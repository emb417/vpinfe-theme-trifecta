/**
 * Trifecta Theme - Main Entry Point
 * 3-Screen Cabinet Edition
 */

// Initialize VPinFECore
const vpin = new VPinFECore();
vpin.init();
window.vpin = vpin; // Main menu needs this

// Register receiveEvent globally BEFORE vpin.ready
window.receiveEvent = receiveEvent;

// Wait for VPinFECore to be ready
vpin.ready.then(async () => {

    // Get window name (table, bg, or dmd)
    await vpin.call("get_my_window_name")
        .then(result => {
            windowName = result;
        });

    // Register input handler (table window only)
    vpin.registerInputHandler(handleInput);

    // Load optional config.json
    config = await vpin.call("get_theme_config");

    // Apply layout for table window
    if (windowName === "table") {
        await applyTableLayout();
        window.addEventListener('resize', () => {
            applyTableLayout().then(() => {
                updateTableWindow();
            });
        });
    }

    // Wait for table data to be ready before initial render
    const initializeDisplay = async () => {
        if (!vpin.tableData || vpin.tableData.length === 0) {
            return false;
        }

        // Get the current table index from VPinFE
        const initialIndex = await vpin.call("get_current_table_index").catch(() => {
            return 0;
        });
        currentTableIndex = initialIndex || 0;
        
        // ONLY TABLE WINDOW renders immediately
        // BG/DMD wait for TableIndexUpdate message
        if (windowName === "table") {
            updateScreen();
            
            // Broadcast after a short delay to ensure BG/DMD are ready
            setTimeout(() => {
                vpin.sendMessageToAllWindows({
                    type: 'TableIndexUpdate',
                    index: currentTableIndex
                });
            }, 100);
        }
        
        return true;
    };

    // Try immediate initialization
    const initialized = await initializeDisplay();
    
    // If not initialized, poll for data
    if (!initialized) {
        const checkData = setInterval(async () => {
            const success = await initializeDisplay();
            if (success) {
                clearInterval(checkData);
            }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
            clearInterval(checkData);
        }, 10000);
    }
});