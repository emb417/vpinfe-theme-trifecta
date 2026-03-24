/**
 * Event Handler
 * Handles VPinFE system events
 */

// Track mouse movement during table play
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
      document.body.style.cursor = "none";
      mouseMovedDuringPlay = false;
      document.addEventListener("mousemove", handleMouseMoveDuringPlay);
      break;

    case "TableLaunchComplete":
      fadeIn();
      setTimeout(() => {
        document
          .querySelectorAll("video")
          .forEach((v) => v.play().catch(() => {}));
      }, 100);
      document.removeEventListener("mousemove", handleMouseMoveDuringPlay);
      if (mouseMovedDuringPlay) {
        document.body.style.cursor = "auto";
      }
      break;

    case "RemoteLaunching":
      document.querySelectorAll("video").forEach((v) => v.pause());
      showRemoteLaunchOverlay(message.table_name);
      fadeOut();
      document.body.style.cursor = "none";
      mouseMovedDuringPlay = false;
      document.addEventListener("mousemove", handleMouseMoveDuringPlay);
      break;

    case "RemoteLaunchComplete":
      hideRemoteLaunchOverlay();
      fadeIn();
      setTimeout(() => {
        document
          .querySelectorAll("video")
          .forEach((v) => v.play().catch(() => {}));
      }, 100);
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
