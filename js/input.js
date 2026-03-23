/**
 * Input Handler
 * Handles joystick/keyboard input for table navigation
 */

async function handleInput(input) {
  switch (input) {
    case "joyleft":
      lastWheelMoveDirection = -1;
      currentTableIndex = wrapIndex(
        currentTableIndex - 1,
        vpin.tableData.length,
      );
      updateScreen();

      vpin.sendMessageToAllWindows({
        type: "TableIndexUpdate",
        index: currentTableIndex,
      });
      break;

    case "joyright":
      lastWheelMoveDirection = 1;
      currentTableIndex = wrapIndex(
        currentTableIndex + 1,
        vpin.tableData.length,
      );
      updateScreen();

      vpin.sendMessageToAllWindows({
        type: "TableIndexUpdate",
        index: currentTableIndex,
      });
      break;

    case "joyselect":
      vpin.sendMessageToAllWindows({ type: "TableLaunching" });
      fadeOut();
      await vpin.launchTable(currentTableIndex);
      break;

    case "joyback":
      // Handle back button if needed
      break;
  }
}
