# Trifecta Theme

A modular 3-screen cabinet theme for VPinFE that demonstrates clean architecture patterns for building custom pinball frontend experiences.

![Trifecta Theme Preview](preview.png)

## Overview

Trifecta is built with a modular JavaScript architecture that separates concerns into focused, maintainable files. This makes it easy to understand, customize, and use as a template for your own themes.

## Architecture

### Core Concept

The theme uses a **single-responsibility module pattern** where each JavaScript file handles one specific concern. This approach makes customization straightforward—you only need to modify the files related to what you want to change.

### File Structure

```bash
trifecta/
├── index_table.html          # Main playfield window
├── index_bg.html             # Backglass window
├── index_dmd.html            # DMD window
├── manifest.json             # Theme metadata
├── config.json               # User-configurable settings
├── style.css                 # Master stylesheet (imports only)
│
├── css/
│   ├── base.css              # Resets, variables, foundational styles
│   ├── layout.css            # Screen layout structure
│   ├── carousel.css          # Wheel carousel styling
│   └── hero-media.css        # Full-screen media styling
│
└── js/
    ├── state.js              # Global state management
    ├── utils.js              # Helper functions
    ├── events.js             # VPinFE event handling
    ├── layout.js             # Screen rotation/scaling (table window only)
    ├── input.js              # Joystick/keyboard input (table window only)
    ├── dom-builder.js        # DOM construction (table window only)
    ├── carousel.js           # Wheel carousel logic (table window only)
    ├── hero-media.js         # Hero media management (table window only)
    ├── table-window.js       # Table window update logic
    ├── bg-dmd-media.js       # Media element creation (BG/DMD windows)
    ├── bg-window.js          # Backglass window update logic
    ├── dmd-window.js         # DMD window update logic
    └── main.js               # Entry point and initialization
```

## Module Responsibilities

### State Management (`state.js`)

- Global variables shared across modules
- Window identification, table navigation, display configuration
- Debounce timers, view references, auto-advance state

**Customize if:** You need additional global state or configuration values

### Utilities (`utils.js`)

- Pure helper functions with no side effects
- Text manipulation, index wrapping, media validation
- Screen update orchestration with debouncing
- Fade transitions and overlay management

**Customize if:** You need additional helper functions or want to change debounce timings

### Events (`events.js`)

- Central event handler for all VPinFE system events
- Routes events to appropriate update functions
- Handles table launches, remote launches, data changes
- **Audio is now managed automatically by VPinFECore** via `vpin.handleEvent()`

**Customize if:** You need to respond to events differently or add custom event handling

### Layout (`layout.js`)

- Screen rotation and scaling calculations (table window only)
- Handles portrait/landscape orientation
- Manages overlay positioning for rotated screens

**Customize if:** You want different rotation behavior or scaling logic

### Input (`input.js`)

- Joystick and keyboard input handling (table window only)
- Auto-advance timer management
- Navigation and table launching

**Customize if:** You want different navigation behavior, custom key mappings, or auto-advance timing

### DOM Builder (`dom-builder.js`)

- Constructs the main table view DOM structure (table window only)
- Creates layout hierarchy: hero media → bottom overlay → carousel + info rows
- Builds and caches DOM references in `tableView` object

**Customize if:** You want a completely different layout structure

### Carousel (`carousel.js`)

- Wheel carousel rendering and animation (table window only)
- Handles smooth scrolling with directional animations
- Card positioning and visual effects

**Customize if:** You want different carousel behavior, animations, or visual effects

### Hero Media (`hero-media.js`)

- Full-screen media display for table window
- Video/image loading with fallbacks
- Rotation-aware media transformation
- Layer-based crossfade transitions

**Customize if:** You want different media display behavior or transition effects

### Table Window (`table-window.js`)

- Main update logic for the table (playfield) window
- Splits updates into carousel (immediate) and hero media (debounced)
- Metadata formatting and display
- Calls `vpin.playTableAudio(currentTableIndex)` for audio playback

**Customize if:** You want to change what metadata displays or how updates are coordinated

### BG/DMD Media (`bg-dmd-media.js`)

- Shared media element creation for backglass and DMD windows
- Handles video/image with fallbacks
- Supports window position/size overrides from `vpinfe.ini`

**Customize if:** You want different media handling for secondary screens

### BG Window (`bg-window.js`)

- Backglass window update logic
- Simple media display with override support

**Customize if:** You want different backglass display behavior

### DMD Window (`dmd-window.js`)

- DMD window update logic
- Simple media display with override support

**Customize if:** You want different DMD display behavior

### Main (`main.js`)

- Entry point and initialization
- VPinFE core setup, event registration
- Window-specific initialization (layout, input)

**Customize if:** You need different initialization logic or want to change startup behavior

## Customization Guide

### Quick Customization (Visual Only)

If you just want to change the appearance without modifying behavior:

1. **Edit `css/layout.css`** - Change the overall screen layout structure
2. **Edit `css/carousel.css`** - Modify carousel appearance and animations
3. **Edit `css/hero-media.css`** - Adjust media display styling
4. **Edit `css/base.css`** - Update colors, fonts, and foundational styles

### Moderate Customization (Layout Structure)

To change what displays and where:

1. **Edit `js/dom-builder.js`** - Modify the DOM structure (add/remove elements, change hierarchy)
2. **Edit `js/table-window.js`** - Update what metadata displays and how it's formatted
3. **Update corresponding CSS files** - Style your new structure

### Advanced Customization (Behavior)

To change how the theme works:

1. **Edit `js/input.js`** - Modify navigation, add custom controls, change auto-advance
2. **Edit `js/carousel.js`** - Change carousel logic, animations, or visual effects
3. **Edit `js/hero-media.js`** - Alter media loading, transitions, or rotation handling
4. **Edit `js/events.js`** - Add custom event responses or change existing behavior

### Deep Customization (Architecture)

To fundamentally restructure the theme:

1. **Understand dependencies** - Check module load order in HTML files
2. **Modify `js/state.js`** - Add global state as needed
3. **Update `js/utils.js`** - Add shared helper functions
4. **Refactor modules** - Split or combine modules to fit your architecture

## Module Dependencies

### Load Order (Critical)

Modules must load in dependency order:

```javascript
// VPinFE Core (always first)
vpinfe - core.js;

// State and utilities (foundation)
state.js;
utils.js;

// Feature modules (can be reorganized)
layout.js; // Table window only
input.js; // Table window only
events.js;
dom - builder.js; // Table window only
carousel.js; // Table window only
hero - media.js; // Table window only
table - window.js; // Table window only
bg - dmd - media.js; // BG/DMD windows only
bg - window.js; // BG window only
dmd - window.js; // DMD window only

// Initialization (always last)
main.js;
```

### Module Relationships

```bash
main.js
  ├─ Initializes VPinFECore
  ├─ Calls applyTableLayout() → layout.js
  ├─ Registers handleInput() → input.js
  └─ Calls updateScreen() → utils.js
       ├─ table: updateTableWindowCarousel() → table-window.js
       │           ├─ ensureTableView() → dom-builder.js
       │           └─ updateWheelCarousel() → carousel.js
       ├─ table: updateTableWindowHeroMedia() → table-window.js
       │           ├─ updateHeroMedia() → hero-media.js
       │           └─ vpin.playTableAudio() → VPinFECore
       ├─ bg: updateBGWindow() → bg-window.js
       │       └─ createMediaElement() → bg-dmd-media.js
       └─ dmd: updateDMDWindow() → dmd-window.js
                └─ createMediaElement() → bg-dmd-media.js

events.js
  ├─ Receives all VPinFE events
  ├─ Calls vpin.handleEvent() → VPinFECore (handles audio automatically)
  └─ Calls updateScreen() → utils.js
```

## Audio Support

Trifecta uses VPinFECore's **centralized audio manager**. No custom audio code is needed in the theme.

### How It Works

1. **Enable in config.json:**

   ```json
   {
     "use_core_audio": true
   }
   ```

2. **VPinFECore handles everything:**
   - `vpin.handleEvent()` automatically manages audio transitions
   - Fades out on table launch
   - Resumes on launch complete
   - Updates on table index changes

3. **Manual control (optional):**

   ```javascript
   // Play audio for a specific table
   vpin.playTableAudio(currentTableIndex);

   // Stop audio with fade
   vpin.stopTableAudio();

   // Stop immediately
   vpin.stopTableAudio({ immediate: true });
   ```

### Audio Files

Place `audio.mp3` files in each table's `medias/` folder. VPinFECore automatically finds and plays them.

## Configuration

### Theme Config (`config.json`)

```json
{
  "use_core_audio": true,
  "input": {
    "keymap": {
      "ControlRight": "collection",
      "Digit1": "select"
    }
  }
}
```

- **`use_core_audio`** - Enable VPinFECore's centralized audio manager
- **`input.keymap`** - Custom keyboard shortcuts (accessed in `main.js`)

### Window Overrides (Advanced)

For users with physical screen cropping (like DMD bezels), VPinFE supports optional window position/size overrides via `vpinfe.ini`:

```ini
[Displays]
dmdwindowoverride = x,y,width,height
bgwindowoverride = x,y,width,height
```

These are passed as URL parameters to window HTML files and handled in `bg-dmd-media.js` via the `override` parameter in `createMediaElement()`.

## Performance Considerations

### Debouncing Strategy

The theme uses debounced updates to prevent excessive rendering:

- **Table carousel + metadata**: Immediate (no debounce) for instant visual feedback
- **Table hero media**: 200ms debounce to avoid rapid video loading during fast scrolling
- **Backglass**: 50ms debounce (secondary screen, less critical)
- **DMD**: 100ms debounce (secondary screen, less critical)

Adjust debounce timings in `utils.js` → `updateScreen()`.

### Media Loading

- **JIT (Just-In-Time)**: Media loads on-demand, no preloading
- **Carousel images**: Load immediately via browser cache
- **Hero media**: Debounced to prevent rapid loading during navigation
- **OS caching**: Relies on filesystem cache for frequently accessed media
- **Chromium caching**: Leverages browser's native image/video caching

### Memory Management

- **Video cleanup**: Uses `src = ""` + `load()` for proper memory release
- **Image cleanup**: Sets `src = ""` to unload images
- **DOM cleanup**: Removes old layers after transitions complete
- **Auto-advance**: Timer-based, cleared on interaction

## Best Practices

### When Creating Your Own Theme

1. **Start with a copy** - Fork this theme and modify incrementally
2. **Test one change at a time** - Easier to debug when things break
3. **Keep modules focused** - Don't let files grow into monoliths
4. **Use semantic names** - Function and variable names should reveal intent
5. **Respect load order** - Dependencies must load before dependents
6. **Handle missing data** - Always check for null/undefined before accessing properties
7. **Clean up resources** - Stop videos, clear timers, remove event listeners
8. **Test all windows** - Table, backglass, and DMD each have unique code paths

### Code Style

This theme follows these conventions:

- **No inline comments** - Code should be self-documenting
- **No version numbers in comments** - Git handles versioning
- **Consistent naming** - `camelCase` for variables/functions, `PascalCase` for classes
- **No dead code** - Removed features should be fully deleted, not commented out

### Common Pitfalls

1. **Module load order** - Loading modules out of order causes undefined reference errors
2. **Window-specific code** - Some modules only load in specific windows (check HTML files)
3. **Event self-delivery** - `sendMessageToAllWindows()` doesn't deliver to the sending window
4. **Video memory leaks** - Always clean up videos properly with `src = ""` + `load()`
5. **Hardcoded values** - Make things configurable via `config.json` when possible
6. **Audio management** - Don't implement custom audio code; use VPinFECore's centralized manager

## Distribution

When packaging your theme for distribution:

1. **Update `manifest.json`** - Name, version, author, description
2. **Include `preview.png`** - Screenshot of your theme in action
3. **Test on fresh install** - Verify all media paths work relative to theme directory
4. **Document customization** - If you add config options, document them
5. **Avoid hardcoded paths** - Use VPinFE's URL methods (`getImageURL`, `getVideoURL`, etc.)

## Support

For VPinFE Theme Docs: [https://github.com/superhac/vpinfe/blob/master/docs/theme.md](https://github.com/superhac/vpinfe/blob/master/docs/theme.md)

For Trifecta-specific questions DM @emb417 in [VPC discord](https://discord.gg/CuEn7Dn2).

---

**Happy theming!** The modular architecture means you can change as little or as much as you want—start simple and grow from there.
