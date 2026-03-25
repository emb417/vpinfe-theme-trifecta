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

  const keymap = (config && config.input && config.input.keymap) || {};

  if (windowName === "table") {
    await applyTableLayout();
    window.addEventListener("resize", () => {
      applyTableLayout().then(() => {
        updateTableWindowCarousel();
        updateTableWindowHeroMedia();
      });
    });
    window.addEventListener("keydown", (e) => {
      if (isGameRunning) return;
      const action =
        keymap[e.code] || keymap[e.key] || keymap[e.key.toLowerCase()];

      if (action === "collection") {
        vpin.toggleCollectionMenu();
      } else if (action === "select") {
        handleInput("joyselect");
      }
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
      startAutoAdvanceTimer();

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
