/**
 * Media Management
 * Handles image/video preloading and rendering with memory management
 */

// Debounce timer for rapid navigation
let mediaUpdateDebounceTimer = null;

function preloadImage(url) {
  if (!hasUsableMedia(url)) return;
  if (mediaPreloadCache.has(url)) return;

  const img = new Image();
  img.decoding = "async";
  img.src = url;
  const promise = img.decode ? img.decode().catch(() => {}) : Promise.resolve();
  mediaPreloadCache.set(url, promise);

  // Keep cache smaller - only 6 most recent
  if (mediaPreloadCache.size > 6) {
    const firstKey = mediaPreloadCache.keys().next().value;
    mediaPreloadCache.delete(firstKey);
  }
}

function preloadNearbyMedia() {
  if (!vpin.tableData || vpin.getTableCount() === 0) return;

  // Only preload images for immediate neighbors, NOT videos (too heavy)
  const indices = [
    wrapIndex(currentTableIndex - 1, vpin.getTableCount()),
    wrapIndex(currentTableIndex + 1, vpin.getTableCount()),
  ];

  indices.forEach((index) => {
    // Only preload wheel images (lightweight)
    preloadImage(vpin.getImageURL(index, "wheel"));
    preloadImage(vpin.getImageURL(index, "cab"));
  });
}

function cleanupMediaElement(element) {
  if (!element) return;

  // Stop and cleanup video elements
  if (element.tagName === "VIDEO") {
    element.pause();
    element.removeAttribute("src");
    element.load(); // Force release of video buffer
  }

  // Clear image sources
  if (element.tagName === "IMG") {
    element.removeAttribute("src");
  }

  // Recursively cleanup children
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

function createMediaElement(videoUrl, imageUrl, title) {
  if (hasUsableMedia(videoUrl)) {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.poster = imageUrl;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata"; // Don't preload full video
    video.style.cssText = "width: 100%; height: 100%; object-fit: cover;";
    video.onerror = () => {
      // Fallback to image on video error
      if (hasUsableMedia(imageUrl)) {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = title;
        img.style.cssText = "width: 100%; height: 100%; object-fit: cover;";
        video.replaceWith(img);
      }
    };
    return video;
  } else if (hasUsableMedia(imageUrl)) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = title;
    img.style.cssText = "width: 100%; height: 100%; object-fit: cover;";
    return img;
  }
  return null;
}
