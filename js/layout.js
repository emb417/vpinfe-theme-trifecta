/**
 * Layout Manager
 * Handles screen rotation and scaling for table window
 */

async function applyTableLayout() {
  if (windowName !== "table") return;

  const screen = document.getElementById("tableScreen");
  const overlayRoot = document.getElementById("overlay-root");
  if (!screen) return;

  const cabMode = await vpin.call("get_cab_mode");
  const rotationDegree = await vpin.call("get_table_rotation");
  tableRotationDegrees = rotationDegree;
  const normalized = ((rotationDegree % 360) + 360) % 360;
  const swapAxes = normalized === 90 || normalized === 270;
  isTablePortrait = swapAxes;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const baseWidth = swapAxes ? 1080 : 1920;
  const baseHeight = swapAxes ? 1920 : 1080;
  const scale = swapAxes
    ? Math.min(vw / baseHeight, vh / baseWidth)
    : Math.min(vw / baseWidth, vh / baseHeight);

  screen.style.width = `${baseWidth}px`;
  screen.style.height = `${baseHeight}px`;
  screen.style.transform =
    rotationDegree !== 0
      ? `rotate(${rotationDegree}deg) scale(${scale})`
      : `scale(${scale})`;
  screen.style.visibility = "visible";

  if (overlayRoot) {
    if (rotationDegree !== 0) {
      overlayRoot.style.width = `${baseWidth}px`;
      overlayRoot.style.height = `${baseHeight}px`;
      overlayRoot.style.top = "50%";
      overlayRoot.style.left = "50%";
      overlayRoot.style.transform = `translate(-50%, -50%) rotate(${rotationDegree}deg) scale(${scale})`;
    } else {
      overlayRoot.style.width = "100vw";
      overlayRoot.style.height = "100vh";
      overlayRoot.style.top = "0";
      overlayRoot.style.left = "0";
      overlayRoot.style.transform = "none";
    }
  }

  // Use landscape class for landscape mode, portrait is the default
  document.body.classList.toggle("table-screen-landscape", !isTablePortrait);
  document.body.classList.toggle("table-screen-portrait", isTablePortrait);
  document.body.classList.toggle("table-screen-cab", Boolean(cabMode));
}
