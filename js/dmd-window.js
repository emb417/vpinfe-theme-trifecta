/**
 * DMD Window
 * Main update logic for the dmd window
 */

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

  if (existingMedia) {
    cleanupMediaElement(container);
  }
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
