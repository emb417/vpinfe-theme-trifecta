/**
 * Event Handler
 * Handles VPinFE system events
 */

async function receiveEvent(message) {
    vpin.call("console_out", message); // Debug: send to Python CLI console

    // Let VPinFECore handle the data refresh logic
    await vpin.handleEvent(message);

    // Handle UI updates based on event type
    switch (message.type) {
        case "TableIndexUpdate":
            currentTableIndex = message.index;
            updateScreen();
            break;

        case "TableLaunching":
            tableAudio.stop();
            fadeOut();
            break;

        case "TableLaunchComplete":
            fadeIn();
            if (windowName === "table") {
                tableAudio.play(vpin.getAudioURL(currentTableIndex));
            }
            break;

        case "RemoteLaunching":
            tableAudio.stop();
            showRemoteLaunchOverlay(message.table_name);
            fadeOut();
            break;

        case "RemoteLaunchComplete":
            hideRemoteLaunchOverlay();
            fadeIn();
            if (windowName === "table") {
                tableAudio.play(vpin.getAudioURL(currentTableIndex));
            }
            break;

        case "TableDataChange":
            currentTableIndex = message.index;
            updateScreen();
            break;
    }
}