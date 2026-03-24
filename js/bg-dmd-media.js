/**
 * BG and DMD Media Management
 * Handles backglass and dmd image/video loading and cleanup
 */

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
