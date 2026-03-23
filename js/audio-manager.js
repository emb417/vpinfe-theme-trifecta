/**
 * Audio Manager
 * Handles table audio playback with crossfade support
 * Works on both Chromium and pywebview backends
 */

const tableAudio = {
    audio: Object.assign(new Audio(), { loop: true }),
    fadeId: null,
    fadeDuration: 500,
    maxVolume: 0.8,
    currentUrl: null,

    play(url, retries = 3) {
        if (!url) { this.stop(); return; }
        if (this.currentUrl === url && !this.audio.paused) return;

        const audio = this.audio;
        clearInterval(this.fadeId);
        audio.pause();
        audio.volume = 0;
        audio.src = url;
        this.currentUrl = url;

        audio.play().then(() => {
            if (this.currentUrl === url) this._fade(0, this.maxVolume);
        }).catch(e => {
            if (e.name === 'NotAllowedError') {
                // Autoplay blocked (pywebview/WebKitGTK) - fall back to Python bridge
                this._retries = retries;
                this._triggerWhenReady(url);
            } else {
                if (retries > 0 && this.currentUrl === url) {
                    setTimeout(() => this.play(url, retries - 1), 1000);
                }
            }
        });
    },

    _triggerWhenReady(url) {
        if (this.currentUrl !== url) return;
        if (this.audio.readyState >= 2) {
            vpin.call("trigger_audio_play").catch(() => {});
        } else {
            this.audio.addEventListener('canplay', () => {
                if (this.currentUrl === url) {
                    vpin.call("trigger_audio_play").catch(() => {});
                }
            }, { once: true });
        }
    },

    // Called from Python via evaluate_js (pywebview privileged context)
    _resumePlay() {
        const url = this.currentUrl;
        const retries = this._retries || 0;
        if (!url) return;
        this.audio.play().then(() => {
            if (this.currentUrl === url) this._fade(0, this.maxVolume);
        }).catch(e => {
            if (retries > 0 && this.currentUrl === url) {
                this._retries = retries - 1;
                setTimeout(() => this._triggerWhenReady(url), 500);
            }
        });
    },

    stop() {
        if (this.audio && !this.audio.paused) {
            this._fade(this.audio.volume, 0, () => {
                this.audio.pause();
                this.currentUrl = null;
            });
        } else {
            clearInterval(this.fadeId);
            this.currentUrl = null;
        }
    },

    _fade(from, to, onComplete) {
        clearInterval(this.fadeId);
        const audio = this.audio;
        if (!audio) { if (onComplete) onComplete(); return; }
        audio.volume = from;
        const steps = this.fadeDuration / 20;
        const delta = (to - from) / steps;
        this.fadeId = setInterval(() => {
            const next = audio.volume + delta;
            if ((delta > 0 && next >= to) || (delta < 0 && next <= to) || delta === 0) {
                audio.volume = to;
                clearInterval(this.fadeId);
                if (onComplete) onComplete();
            } else {
                audio.volume = next;
            }
        }, 20);
    }
};