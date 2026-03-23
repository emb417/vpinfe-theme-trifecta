/**
 * Updaters
 * Functions to update specific UI elements
 */

function updateHeroMedia(container, title) {
    const imageUrl = vpin.getImageURL(currentTableIndex, 'table');
    const bgUrl = vpin.getImageURL(currentTableIndex, 'bg');
    const videoUrl = vpin.getVideoURL(currentTableIndex, 'table');
    
    // Don't update if no valid media - prevents flash of fallback during navigation
    if (!hasUsableMedia(videoUrl) && !hasUsableMedia(imageUrl)) {
        return;
    }
    
    const previousLayer = container.querySelector('.hero-media-frame.is-active, .hero-media-frame');

    // Check if we already have the correct content displayed
    // Compare BOTH image and video URLs to detect changes
    if (previousLayer) {
        const prevImageUrl = previousLayer.dataset.imageUrl;
        const prevBgUrl = previousLayer.dataset.bgUrl;
        const prevVideoUrl = previousLayer.dataset.videoUrl;
        
        if (prevImageUrl === imageUrl && 
            prevBgUrl === bgUrl && 
            prevVideoUrl === videoUrl) {
            // Same content, ensure it's marked as active
            previousLayer.classList.remove('is-entering', 'is-exiting');
            previousLayer.classList.add('is-active');
            return;
        }
    }

    const frame = document.createElement('div');
    frame.className = 'hero-media-frame hero-media-layer is-entering';
    frame.dataset.imageUrl = imageUrl;
    frame.dataset.bgUrl = bgUrl;
    frame.dataset.videoUrl = videoUrl; // Store video URL too

    if (isTablePortrait) {
        const bgImage = document.createElement('img');
        bgImage.className = 'hero-media-bg';
        bgImage.src = bgUrl;
        bgImage.alt = '';
        bgImage.setAttribute('aria-hidden', 'true');
        bgImage.onerror = () => {
            bgImage.style.display = 'none';
        };
        frame.appendChild(bgImage);

        const bgOverlay = document.createElement('div');
        bgOverlay.className = 'hero-media-bg-overlay';
        frame.appendChild(bgOverlay);
    }

    let activated = false;
    const activateLayer = () => {
        if (activated) return;
        activated = true;
        requestAnimationFrame(() => {
            frame.classList.remove('is-entering');
            frame.classList.add('is-active');
            if (previousLayer) {
                previousLayer.classList.add('is-exiting');
                setTimeout(() => previousLayer.remove(), 220);
            }
        });
    };

    if (hasUsableMedia(videoUrl)) {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.poster = imageUrl;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.className = 'hero-media-asset';
        video.onerror = () => {
            const fallback = buildHeroImage(imageUrl, title);
            video.replaceWith(fallback);
            applyMediaRotation(fallback);
            activateLayer();
        };
        video.addEventListener('loadeddata', activateLayer, { once: true });
        frame.appendChild(video);
        applyMediaRotation(video);
    } else {
        const image = buildHeroImage(imageUrl, title);
        if (image.complete) {
            activateLayer();
        } else {
            image.addEventListener('load', activateLayer, { once: true });
            image.addEventListener('error', activateLayer, { once: true });
        }
        frame.appendChild(image);
        applyMediaRotation(image);
    }

    container.appendChild(frame);
    lastHeroImageUrl = imageUrl;
    lastHeroBgUrl = bgUrl;
    setTimeout(activateLayer, 16);
}

/**
 * Screen Handlers
 * Update functions for BG and DMD windows
 */

function updateBGWindow() {    
    const container = document.getElementById('rootContainer');
    if (!vpin.tableData || vpin.tableData.length === 0) {
        container.innerHTML = '';
        return;
    }

    // Safety check: ensure currentTableIndex is valid
    if (currentTableIndex < 0 || currentTableIndex >= vpin.tableData.length) {
        currentTableIndex = 0;
    }

    const table = vpin.getTableMeta(currentTableIndex);
    const info = table.meta.Info || {};
    const vpx = table.meta.VPXFile || {};
    const title = info.Title || vpx.filename || table.tableDirName || 'Unknown Table';
    
    const bgImageUrl = vpin.getImageURL(currentTableIndex, "bg");
    const bgVideoUrl = vpin.getVideoURL(currentTableIndex, "bg");
    
    // Check if we already have the right content
    const existingMedia = container.querySelector('video, img');
    if (existingMedia) {
        const currentSrc = existingMedia.src || '';
        if (hasUsableMedia(bgVideoUrl) && currentSrc === bgVideoUrl) {
            return;
        }
        if (!hasUsableMedia(bgVideoUrl) && hasUsableMedia(bgImageUrl) && currentSrc === bgImageUrl) {
            return;
        }
    }
    
    // Clear and rebuild
    container.innerHTML = '';
    
    const mediaElement = createMediaElement(bgVideoUrl, bgImageUrl, title);
    if (mediaElement) {
        container.appendChild(mediaElement);
    }
}

function updateDMDWindow() {
    const container = document.getElementById('rootContainer');
    if (!vpin.tableData || vpin.tableData.length === 0) {
        container.innerHTML = '';
        return;
    }

    // Safety check: ensure currentTableIndex is valid
    if (currentTableIndex < 0 || currentTableIndex >= vpin.tableData.length) {
        currentTableIndex = 0;
    }

    const table = vpin.getTableMeta(currentTableIndex);
    const info = table.meta.Info || {};
    const vpx = table.meta.VPXFile || {};
    const title = info.Title || vpx.filename || table.tableDirName || 'Unknown Table';
    
    const dmdImageUrl = vpin.getImageURL(currentTableIndex, "dmd");
    const dmdVideoUrl = vpin.getVideoURL(currentTableIndex, "dmd");
    
    // Check if we already have the right content
    const existingMedia = container.querySelector('video, img');
    if (existingMedia) {
        const currentSrc = existingMedia.src || '';
        if (hasUsableMedia(dmdVideoUrl) && currentSrc === dmdVideoUrl) return;
        if (!hasUsableMedia(dmdVideoUrl) && hasUsableMedia(dmdImageUrl) && currentSrc === dmdImageUrl) return;
    }
    
    // Clear and rebuild
    container.innerHTML = '';
    
    const mediaElement = createMediaElement(dmdVideoUrl, dmdImageUrl, title);
    if (mediaElement) {
        container.appendChild(mediaElement);
    }
}