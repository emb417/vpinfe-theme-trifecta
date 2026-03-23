/**
 * Updaters
 * Functions to update specific UI elements and screen handlers
 */

function updateHeroMedia(container, title) {
  const imageUrl = vpin.getImageURL(currentTableIndex, "table");
  const videoUrl = vpin.getVideoURL(currentTableIndex, "table");

  const hasValidVideo = hasUsableMedia(videoUrl);
  const hasValidImage = hasUsableMedia(imageUrl);

  if (!hasValidVideo && !hasValidImage) {
    return;
  }

  const previousLayer = container.querySelector(
    ".hero-media-frame.is-active, .hero-media-frame",
  );

  if (previousLayer) {
    const prevImageUrl = previousLayer.dataset.imageUrl;
    const prevVideoUrl = previousLayer.dataset.videoUrl;

    if (prevImageUrl === imageUrl && prevVideoUrl === videoUrl) {
      previousLayer.classList.remove("is-entering", "is-exiting");
      previousLayer.classList.add("is-active");
      return;
    }
  }

  const allOldLayers = container.querySelectorAll(".hero-media-frame");
  allOldLayers.forEach((layer) => {
    cleanupMediaElement(layer);
    layer.remove();
  });

  const frame = document.createElement("div");
  frame.className = "hero-media-frame hero-media-layer is-entering";
  frame.dataset.imageUrl = imageUrl;
  frame.dataset.videoUrl = videoUrl;

  let activated = false;
  const activateLayer = () => {
    if (activated) return;
    activated = true;
    requestAnimationFrame(() => {
      frame.classList.remove("is-entering");
      frame.classList.add("is-active");
    });
  };

  if (hasUsableMedia(videoUrl)) {
    const video = document.createElement("video");
    video.src = videoUrl;
    if (hasUsableMedia(imageUrl)) {
      video.poster = imageUrl;
    }
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.className = "hero-media-asset";
    video.onerror = () => {
      const fallback = buildHeroImage(imageUrl, title);
      video.replaceWith(fallback);
      applyMediaRotation(fallback);
      activateLayer();
    };
    video.addEventListener("loadeddata", activateLayer, { once: true });
    frame.appendChild(video);
    applyMediaRotation(video);
  } else {
    const image = buildHeroImage(imageUrl, title);
    if (image.complete) {
      activateLayer();
    } else {
      image.addEventListener("load", activateLayer, { once: true });
      image.addEventListener("error", activateLayer, { once: true });
    }
    frame.appendChild(image);
    applyMediaRotation(image);
  }

  container.appendChild(frame);
  lastHeroImageUrl = imageUrl;

  activateLayer();
}

function updateBGWindow() {
  const container = document.getElementById("rootContainer");
  if (!vpin.tableData || vpin.tableData.length === 0) {
    container.innerHTML = "";
    return;
  }

  if (currentTableIndex < 0 || currentTableIndex >= vpin.tableData.length) {
    currentTableIndex = 0;
  }

  const table = vpin.getTableMeta(currentTableIndex);
  const info = table.meta.Info || {};
  const vpx = table.meta.VPXFile || {};
  const title =
    info.Title || vpx.filename || table.tableDirName || "Unknown Table";

  const bgImageUrl = vpin.getImageURL(currentTableIndex, "bg");
  const bgVideoUrl = vpin.getVideoURL(currentTableIndex, "bg");

  if (!hasUsableMedia(bgVideoUrl) && !hasUsableMedia(bgImageUrl)) {
    return;
  }

  const existingMedia = container.querySelector("video, img");
  if (existingMedia) {
    const currentSrc = existingMedia.src || "";
    if (hasUsableMedia(bgVideoUrl) && currentSrc === bgVideoUrl) {
      return;
    }
    if (
      !hasUsableMedia(bgVideoUrl) &&
      hasUsableMedia(bgImageUrl) &&
      currentSrc === bgImageUrl
    ) {
      return;
    }
  }

  const oldMedia = container.querySelectorAll("video, img");
  oldMedia.forEach((media) => cleanupMediaElement(media));
  container.innerHTML = "";

  const mediaElement = createMediaElement(
    bgVideoUrl,
    bgImageUrl,
    title,
    "contain",
  );
  if (mediaElement) {
    container.appendChild(mediaElement);
  }
}

function updateDMDWindow() {
  const container = document.getElementById("rootContainer");
  if (!vpin.tableData || vpin.tableData.length === 0) {
    container.innerHTML = "";
    return;
  }

  if (currentTableIndex < 0 || currentTableIndex >= vpin.tableData.length) {
    currentTableIndex = 0;
  }

  const table = vpin.getTableMeta(currentTableIndex);
  const info = table.meta.Info || {};
  const vpx = table.meta.VPXFile || {};
  const title =
    info.Title || vpx.filename || table.tableDirName || "Unknown Table";

  const dmdImageUrl = vpin.getImageURL(currentTableIndex, "dmd");
  const dmdVideoUrl = vpin.getVideoURL(currentTableIndex, "dmd");

  if (!hasUsableMedia(dmdVideoUrl) && !hasUsableMedia(dmdImageUrl)) {
    return;
  }

  const existingMedia = container.querySelector("video, img");
  if (existingMedia) {
    const currentSrc = existingMedia.src || "";
    if (hasUsableMedia(dmdVideoUrl) && currentSrc === dmdVideoUrl) return;
    if (
      !hasUsableMedia(dmdVideoUrl) &&
      hasUsableMedia(dmdImageUrl) &&
      currentSrc === dmdImageUrl
    )
      return;
  }

  const oldMedia = container.querySelectorAll("video, img");
  oldMedia.forEach((media) => cleanupMediaElement(media));
  container.innerHTML = "";

  const mediaElement = createMediaElement(
    dmdVideoUrl,
    dmdImageUrl,
    title,
    "contain",
  );
  if (mediaElement) {
    container.appendChild(mediaElement);
  }
}
