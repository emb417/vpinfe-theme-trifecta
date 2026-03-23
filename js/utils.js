/**
 * Utility Functions
 * Helper functions used throughout the theme
 */

function setNodeText(node, value) {
    const nextValue = value || '';
    if (node.textContent !== nextValue) {
        node.textContent = nextValue;
    }
}

function wrapIndex(index, length) {
    return (index + length) % length;
}

function hasUsableMedia(url) {
    return Boolean(url) && !String(url).includes('file_missing');
}

function fadeOut() {
    const overlay = document.getElementById("fadeOverlay");
    if (overlay) overlay.classList.add("show");
}

function fadeIn() {
    const overlay = document.getElementById("fadeOverlay");
    if (overlay) overlay.classList.remove("show");
}

function showRemoteLaunchOverlay(tableName) {
    const overlay = document.getElementById('remote-launch-overlay');
    const nameEl = document.getElementById('remote-launch-table-name');
    if (overlay && nameEl) {
        nameEl.textContent = tableName || 'Unknown Table';
        overlay.style.display = 'flex';
    }
}

function hideRemoteLaunchOverlay() {
    const overlay = document.getElementById('remote-launch-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}