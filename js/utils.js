/**
 * Utility Functions
 * Helper functions used throughout the theme
 */

function setNodeText(node, value) {
  const nextValue = value || "";
  if (node.textContent !== nextValue) {
    node.textContent = nextValue;
  }
}

function wrapIndex(index, length) {
  return (index + length) % length;
}

function hasUsableMedia(url) {
  return Boolean(url) && !String(url).includes("file_missing");
}

function cleanupAllMedia() {
  document.querySelectorAll("video").forEach((v) => {
    v.pause();
    v.src = "";
    v.load();
  });

  if (typeof cleanupWheelCache === "function") {
    cleanupWheelCache();
  }
  if (typeof cleanupBGDMDCache === "function") {
    cleanupBGDMDCache();
  }
  if (typeof cleanupHeroCache === "function") {
    cleanupHeroCache();
  }
}

function updateScreen() {
  if (windowName === "table") {
    updateTableWindow();
    preloadAdjacentHeroMedia();
  } else if (windowName === "bg") {
    updateBGWindow();
    preloadNearbyMedia();
  } else if (windowName === "dmd") {
    updateDMDWindow();
    preloadNearbyMedia();
  }
}

function fadeOut() {
  const overlay = document.getElementById("fadeOverlay");
  if (overlay) {
    const loadingMsg = document.getElementById("loading-message");
    if (loadingMsg) {
      if (tableRotationDegrees !== 0) {
        loadingMsg.style.transform = `rotate(${tableRotationDegrees}deg)`;
      }
      loadingMsg.style.display = "block";

      const loadingName = document.getElementById("loading-table-name");
      if (loadingName && typeof currentTableIndex !== "undefined") {
        const table = vpin.getTableMeta(currentTableIndex);
        const info = table.meta.Info || {};
        const vpx = table.meta.VPXFile || {};
        const title =
          info.Title || vpx.filename || table.tableDirName || "Unknown Table";
        const displayTitle =
          title && title.trim() ? title : `Table ${currentTableIndex + 1}`;
        loadingName.textContent = displayTitle;
      }
    }
    overlay.classList.add("show");
  }
}

function fadeIn() {
  const overlay = document.getElementById("fadeOverlay");
  if (overlay) {
    const loadingMsg = document.getElementById("loading-message");
    if (loadingMsg) {
      loadingMsg.style.display = "none";
    }
    overlay.classList.remove("show");
  }
}

function showRemoteLaunchOverlay(tableName) {
  const overlay = document.getElementById("remote-launch-overlay");
  const nameEl = document.getElementById("remote-launch-table-name");
  if (overlay && nameEl) {
    nameEl.textContent = tableName || "Unknown Table";
    overlay.style.display = "flex";
  }
}

function hideRemoteLaunchOverlay() {
  const overlay = document.getElementById("remote-launch-overlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}
