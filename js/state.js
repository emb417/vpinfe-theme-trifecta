/**
 * State Management
 * Global state variables for the theme
 */

// Window identification
let windowName = "";

// Table navigation
let currentTableIndex = 0;
let lastRenderedTableIndex = -1;
let lastWheelMoveDirection = 0;

// Display configuration
let isTablePortrait = false;
let tableRotationDegrees = 0;

// Configuration
let config = null;

// Debounce timers
let heroUpdateDebounceTimer = null;
let bgUpdateDebounceTimer = null;
let dmdUpdateDebounceTimer = null;

// View references
let tableView = null;
