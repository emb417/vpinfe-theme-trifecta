/**
 * Hero Media Management
 * Handles hero window video/image rendering with caching for large files
 */

function buildHeroImage(imageUrl, title) {
  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = title;
  img.className = "hero-media-asset";
  img.onerror = () => {
    img.src = "";
    img.alt = `${title} media unavailable`;
  };
  return img;
}

function applyMediaRotation(element) {
  if (!element) return;

  const normalized = ((tableRotationDegrees % 360) + 360) % 360;
  const swapAxes = normalized === 90 || normalized === 270;
  const mediaRotation = swapAxes ? -tableRotationDegrees : tableRotationDegrees;

  if (swapAxes) {
    element.style.width = "177.78%";
    element.style.height = "56.25%";
    element.style.maxWidth = "none";
    element.style.maxHeight = "none";
    element.style.objectFit = "fill";
    element.style.transform = `rotate(${mediaRotation}deg)`;
  } else {
    element.style.width = "100%";
    element.style.height = "100%";
    element.style.maxWidth = "";
    element.style.maxHeight = "";
    element.style.objectFit = "cover";
    element.style.transform =
      mediaRotation !== 0 ? `rotate(${mediaRotation}deg)` : "none";
  }
}

function preloadHeroVideo(url) {
  if (!hasUsableMedia(url)) return;
  if (heroVideoCache.has(url)) return;

  const video = document.createElement("video");
  video.src = url;
  video.preload = "auto";
  video.muted = true;
  video.load();

  heroVideoCache.set(url, video);

  if (heroVideoCache.size > MAX_HERO_CACHE) {
    const firstKey = heroVideoCache.keys().next().value;
    const oldVideo = heroVideoCache.get(firstKey);
    oldVideo.src = "";
    oldVideo.load();
    heroVideoCache.delete(firstKey);
  }
}

function preloadAdjacentHeroMedia() {
  if (!vpin.tableData || vpin.getTableCount() === 0) return;

  const indices = [
    wrapIndex(currentTableIndex - 1, vpin.getTableCount()),
    wrapIndex(currentTableIndex + 1, vpin.getTableCount()),
  ];

  indices.forEach((index) => {
    const videoUrl = vpin.getVideoURL(index, "table");
    preloadHeroVideo(videoUrl);
  });
}

function cleanupHeroCache() {
  heroVideoCache.forEach((video) => {
    video.src = "";
    video.load();
  });
  heroVideoCache.clear();
}

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
    video.load();
    video.play().catch(() => {});

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

  if (heroUpdateDebounceTimer) {
    clearTimeout(heroUpdateDebounceTimer);
  }
  heroUpdateDebounceTimer = setTimeout(() => {
    preloadAdjacentHeroMedia();
  }, 500);
}
