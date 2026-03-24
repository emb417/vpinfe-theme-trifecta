/**
 * BG and DMD Media Management
 * Handles image/video preloading and rendering with memory management
 */

function preloadImage(url) {
  if (!hasUsableMedia(url)) return;
  if (mediaPreloadCache.has(url)) return;

  const img = new Image();
  img.decoding = "async";
  img.src = url;
  const promise = img.decode ? img.decode().catch(() => {}) : Promise.resolve();
  mediaPreloadCache.set(url, promise);

  if (mediaPreloadCache.size > 12) {
    const firstKey = mediaPreloadCache.keys().next().value;
    mediaPreloadCache.delete(firstKey);
  }
}

function preloadVideo(url) {
  if (!hasUsableMedia(url)) return;
  if (videoPreloadCache.has(url)) return;

  const video = document.createElement("video");
  video.src = url;
  video.preload = "auto";
  video.muted = true;
  video.load();

  videoPreloadCache.set(url, video);

  // Cache for adjacent ±1 table
  if (videoPreloadCache.size > 6) {
    const firstKey = videoPreloadCache.keys().next().value;
    const oldVideo = videoPreloadCache.get(firstKey);
    oldVideo.src = "";
    oldVideo.load();
    videoPreloadCache.delete(firstKey);
  }
}

function preloadNearbyMedia() {
  if (!vpin.tableData || vpin.getTableCount() === 0) return;

  const indices = [
    wrapIndex(currentTableIndex - 1, vpin.getTableCount()),
    wrapIndex(currentTableIndex + 1, vpin.getTableCount()),
  ];

  indices.forEach((index) => {
    preloadImage(vpin.getImageURL(index, "bg"));
    preloadImage(vpin.getImageURL(index, "dmd"));
    preloadVideo(vpin.getVideoURL(index, "bg"));
    preloadVideo(vpin.getVideoURL(index, "dmd"));
  });
}

function cleanupMediaElement(element) {
  if (!element) return;

  if (element.tagName === "VIDEO") {
    element.pause();
    element.src = "";
    element.load();
  }

  if (element.tagName === "IMG") {
    element.src = "";
  }

  const videos = element.querySelectorAll("video");
  videos.forEach((video) => {
    video.pause();
    video.src = "";
    video.load();
  });

  const images = element.querySelectorAll("img");
  images.forEach((img) => {
    img.src = "";
  });
}

function cleanupBGDMDCache() {
  videoPreloadCache.forEach((video) => {
    video.src = "";
    video.load();
  });
  videoPreloadCache.clear();
  mediaPreloadCache.clear();
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
    video.preload = "auto";
    video.style.cssText = `width: 100%; height: 100%; object-fit: ${objectFit};`;

    video.play().catch(() => {});

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
