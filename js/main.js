/**
 * Trifecta Theme - Main Entry Point
 * 3-Screen Cabinet Edition
 */

const vpin = new VPinFECore();
vpin.init();
window.vpin = vpin;

window.receiveEvent = receiveEvent;

vpin.ready.then(async () => {
  await vpin.call("get_my_window_name").then((result) => {
    windowName = result;
  });

  vpin.registerInputHandler(handleInput);

  config = await vpin.call("get_theme_config");

  if (windowName === "table") {
    await applyTableLayout();
    window.addEventListener("resize", () => {
      applyTableLayout().then(() => {
        updateTableWindow();
      });
    });
  }

  const initializeDisplay = async () => {
    if (!vpin.tableData || vpin.tableData.length === 0) {
      return false;
    }

    const initialIndex = await vpin
      .call("get_current_table_index")
      .catch(() => {
        return 0;
      });
    currentTableIndex = initialIndex || 0;

    if (windowName === "table") {
      updateScreen();

      setTimeout(() => {
        vpin.sendMessageToAllWindows({
          type: "TableIndexUpdate",
          index: currentTableIndex,
        });
      }, 500);
    }

    return true;
  };

  const initialized = await initializeDisplay();

  if (!initialized) {
    const checkData = setInterval(async () => {
      const success = await initializeDisplay();
      if (success) {
        clearInterval(checkData);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkData);
    }, 10000);
  }
});
