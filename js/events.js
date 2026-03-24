/**
 * Event Handler
 * Handles VPinFE system events
 */

let mouseMovedDuringPlay = false;
const handleMouseMoveDuringPlay = () => {
  mouseMovedDuringPlay = true;
};

async function receiveEvent(message) {
  vpin.call("console_out", message);

  await vpin.handleEvent(message);

  switch (message.type) {
    case "TableIndexUpdate":
      currentTableIndex = message.index;
      updateScreen();
      break;

    case "TableLaunching":
      document.querySelectorAll("video").forEach((v) => v.pause());
      fadeOut();
      cleanupAllMedia();
      document.body.style.cursor = "none";
      mouseMovedDuringPlay = false;
      document.addEventListener("mousemove", handleMouseMoveDuringPlay);
      break;

    case "TableLaunchComplete":
      fadeIn();
      updateScreen();
      document.removeEventListener("mousemove", handleMouseMoveDuringPlay);
      if (mouseMovedDuringPlay) {
        document.body.style.cursor = "auto";
      }
      break;

    case "RemoteLaunching":
      document.querySelectorAll("video").forEach((v) => v.pause());
      showRemoteLaunchOverlay(message.table_name);
      fadeOut();
      cleanupAllMedia();
      document.body.style.cursor = "none";
      mouseMovedDuringPlay = false;
      document.addEventListener("mousemove", handleMouseMoveDuringPlay);
      break;

    case "RemoteLaunchComplete":
      hideRemoteLaunchOverlay();
      fadeIn();
      updateScreen();
      document.removeEventListener("mousemove", handleMouseMoveDuringPlay);
      if (mouseMovedDuringPlay) {
        document.body.style.cursor = "auto";
      }
      break;

    case "TableDataChange":
      currentTableIndex = message.index;
      updateScreen();
      break;
  }
}
