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

// Media caching - Images
let lastHeroImageUrl = null;
const mediaPreloadCache = new Map();

// Media caching - Videos (BG/DMD)
const videoPreloadCache = new Map();

// Media caching - Videos (Hero)
const heroVideoCache = new Map();

// Media caching - Wheel images
const wheelImageCache = new Map();

// Cache size limits
const MAX_HERO_CACHE = 3;
const MAX_VIDEO_CACHE = 6;
const MAX_IMAGE_CACHE = 12;
const MAX_WHEEL_CACHE = 10;

// Debounce timers
let heroUpdateDebounceTimer = null;

// View references
let tableView = null;
