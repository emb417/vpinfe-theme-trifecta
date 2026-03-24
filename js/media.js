/**
 * Media Management
 * Handles image/video preloading and rendering with memory management
 */

let mediaUpdateDebounceTimer = null;

function preloadImage(url) {
  if (!hasUsableMedia(url)) return;
  if (mediaPreloadCache.has(url)) return;

  const img = new Image();
  img.decoding = "async";
  img.src = url;
  const promise = img.decode ? img.decode().catch(() => {}) : Promise.resolve();
  mediaPreloadCache.set(url, promise);

  if (mediaPreloadCache.size > 6) {
    const firstKey = mediaPreloadCache.keys().next().value;
    mediaPreloadCache.delete(firstKey);
  }
}

function preloadNearbyMedia() {
  if (!vpin.tableData || vpin.getTableCount() === 0) return;

  const indices = [
    wrapIndex(currentTableIndex - 1, vpin.getTableCount()),
    wrapIndex(currentTableIndex + 1, vpin.getTableCount()),
  ];

  indices.forEach((index) => {
    preloadImage(vpin.getImageURL(index, "wheel"));
  });
}

function cleanupMediaElement(element) {
  if (!element) return;

  if (element.tagName === "VIDEO") {
    element.pause();
    element.removeAttribute("src");
    element.load();
  }

  if (element.tagName === "IMG") {
    element.removeAttribute("src");
  }

  const videos = element.querySelectorAll("video");
  videos.forEach((video) => {
    video.pause();
    video.removeAttribute("src");
    video.load();
  });

  const images = element.querySelectorAll("img");
  images.forEach((img) => {
    img.removeAttribute("src");
  });
}

function buildHeroImage(imageUrl, title) {
  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = title;
  img.className = "hero-media-asset";
  img.onerror = () => {
    img.removeAttribute("src");
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

function createMediaElement(videoUrl, imageUrl, title, fitMode = "cover") {
  const objectFit = fitMode;

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
    video.style.cssText = `width: 100%; height: 100%; object-fit: ${objectFit};`;
    video.onerror = () => {
      if (hasUsableMedia(imageUrl)) {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = title;
        img.style.cssText = `width: 100%; height: 100%; object-fit: ${objectFit};`;
        video.replaceWith(img);
      }
    };
    return video;
  } else if (hasUsableMedia(imageUrl)) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = title;
    img.style.cssText = `width: 100%; height: 100%; object-fit: ${objectFit};`;
    return img;
  }
  return null;
}
