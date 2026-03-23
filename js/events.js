/**
 * Event Handler
 * Handles VPinFE system events
 */

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
      break;

    case "TableLaunchComplete":
      fadeIn();
      setTimeout(() => {
        document
          .querySelectorAll("video")
          .forEach((v) => v.play().catch(() => {}));
      }, 100);
      break;

    case "RemoteLaunching":
      document.querySelectorAll("video").forEach((v) => v.pause());
      showRemoteLaunchOverlay(message.table_name);
      fadeOut();
      break;

    case "RemoteLaunchComplete":
      hideRemoteLaunchOverlay();
      fadeIn();
      setTimeout(() => {
        document
          .querySelectorAll("video")
          .forEach((v) => v.play().catch(() => {}));
      }, 100);
      break;

    case "TableDataChange":
      currentTableIndex = message.index;
      updateScreen();
      break;
  }
}
