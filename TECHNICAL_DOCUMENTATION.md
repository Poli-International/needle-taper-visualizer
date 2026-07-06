# Needle Taper Visualizer - Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Schemas](#data-schemas)
3. [Calculation / Logic Algorithms](#calculation--logic-algorithms)
4. [API Reference](#api-reference)
5. [Integration Guide](#integration-guide)
6. [Customization](#customization)
7. [Performance](#performance)
8. [Browser Compatibility](#browser-compatibility)
9. [Security](#security)
10. [Version History](#version-history)
11. [Support / Contact](#support--contact)

---

## Architecture Overview

### Technology Stack

| Technology | Usage |
|------------|-------|
| **HTML5** | Document structure, SVG visualization canvas, form controls |
| **CSS3** | Dark/light mode styling, responsive layout, animation effects |
| **Vanilla JavaScript (ES6)** | All interactivity, SVG manipulation, data management |
| **SVG (inline)** | Real-time needle geometry rendering, skin layer visualization |

### File Structure

```
needle-taper-visualizer/
├── index.html          # Main tool interface, SVG canvas, control panel
├── documentation.html  # Full documentation page (loaded in iframe)
├── css/
│   ├── poli-standard.css   # Shared Poli theme styles
│   └── style.css           # Tool-specific styles
└── js/
    ├── common.js           # Theme toggle, embed modal, iframe resizing
    ├── database.js         # TAPER_DATABASE constant object
    └── main.js             # Core visualization engine, event handlers
```

### Component Breakdown

1. **Control Panel** (left sidebar)
   - Taper selector (4 buttons: short/medium/long/extra)
   - Needle gauge dropdown (3 options)
   - Penetration depth slider (0.5mm–2.5mm)

2. **Visualization Stage** (main area)
   - SVG canvas (800×500 viewBox)
   - Skin layer rectangles (epidermis at y=300, dermis at y=340)
   - Dynamic needle geometry (taper path + shaft rectangle)
   - Impact glow circle
   - Measurement line and label

3. **Analysis Grid** (below visualization)
   - Trauma rating bar (0–100%)
   - Pigment delivery bar (0–100%)
   - Best use recommendation text

4. **Tab System**
   - Tool tab (main interface)
   - Documentation tab (loads documentation.html in iframe)
   - Embed Code tab (copy-to-clipboard iframe snippet)

---

## Data Schemas

### TAPER_DATABASE (defined in `database.js`)

```javascript
const TAPER_DATABASE = {
    short: {
        name: "Short Taper (ST)",
        length_mm: 1.5,
        description: "Large impact surface area. High trauma but high pigment delivery.",
        trauma: 85,
        saturation: 95,
        best_use: "Solid Color / Bold Traditional",
        grind: "Short conical grind"
    },
    medium: {
        name: "Medium Taper (MT)",
        length_mm: 2.5,
        description: "Versatile standard. Balanced trauma and pigment retention.",
        trauma: 55,
        saturation: 80,
        best_use: "Linework / General Shading",
        grind: "Standard industrial grind"
    },
    long: {
        name: "Long Taper (LT)",
        length_mm: 6.0,
        description: "Small impact surface. Low trauma, precise pigment placement.",
        trauma: 25,
        saturation: 65,
        best_use: "Fine Line / Realism",
        grind: "Long precision grind"
    },
    extra: {
        name: "Extra Long (ELT)",
        length_mm: 8.0,
        description: "Surgical precision. Minimal trauma, ideal for delicate layers.",
        trauma: 15,
        saturation: 50,
        best_use: "Hyper-Realism / Soft Wash",
        grind: "Extreme conical taper"
    }
};
```

### Application State (defined in `main.js`)

```javascript
let state = {
    taper: 'short',    // String: 'short' | 'medium' | 'long' | 'extra'
    gauge: 0.35,       // Number: 0.25 | 0.30 | 0.35 (mm)
    depth: 1.5         // Number: 0.5–2.5 (mm)
};
```

### Configuration Constants (defined in `main.js`)

```javascript
const CANVAS_WIDTH = 800;    // SVG viewBox width
const CENTER_X = 400;        // Center of canvas (x-coordinate)
const SURFACE_Y = 300;       // Skin surface y-coordinate
const SCALE = 60;            // Pixels per millimeter
```

---

## Calculation / Logic Algorithms

### `updateVisuals()` Function (core engine in `main.js`)

This function recalculates all visual elements whenever user input changes. It performs the following steps:

#### Step 1: Data Retrieval
```javascript
const data = TAPER_DATABASE[state.taper];
const gaugePx = state.gauge * SCALE;      // Convert gauge mm to pixels
const taperPx = data.length_mm * SCALE;   // Convert taper mm to pixels
const depthPx = state.depth * SCALE;      // Convert depth mm to pixels
```

#### Step 2: Needle Positioning
```javascript
// Translate entire needle group by penetration depth
needleGroup.setAttribute('transform', `translate(0, ${depthPx})`);
```

#### Step 3: Impact Glow Calculation
```javascript
// Glow radius scales inversely with trauma rating
const glowRadius = (1 - (data.trauma / 100)) * 5 + 5;
impactGlow.setAttribute('r', (data.trauma / 20) + 10);
impactGlow.setAttribute('opacity', data.trauma / 200);
```

#### Step 4: Conical Taper Geometry
```javascript
// Calculate triangle vertices for the taper shape
const tipX = CENTER_X;                    // Tip at center
const tipY = SURFACE_Y;                   // Tip at skin surface
const shaftTopY = tipY - taperPx;         // Top of taper section
const xLeft = CENTER_X - (gaugePx / 2);   // Left edge of shaft
const xRight = CENTER_X + (gaugePx / 2);  // Right edge of shaft

// SVG path: triangle from tip to shaft width
const d = `M ${tipX} ${tipY} L ${xLeft} ${shaftTopY} L ${xRight} ${shaftTopY} Z`;
taperPath.setAttribute('d', d);
```

#### Step 5: Shaft Rectangle
```javascript
// Extends upward from taper top to far above canvas
shaftRect.setAttribute('x', xLeft);
shaftRect.setAttribute('width', gaugePx);
shaftRect.setAttribute('y', -1000);
shaftRect.setAttribute('height', 1000 + shaftTopY);
```

#### Step 6: Measurement Line
```javascript
// Vertical line beside the taper with length label
measureLine.setAttribute('x1', xRight + 20);
measureLine.setAttribute('x2', xRight + 20);
measureLine.setAttribute('y1', tipY + depthPx);
measureLine.setAttribute('y2', shaftTopY + depthPx);

measureText.setAttribute('x', xRight + 30);
measureText.setAttribute('y', (tipY + shaftTopY) / 2 + depthPx);
measureText.textContent = `Taper: ${data.length_mm}mm`;
```

#### Step 7: Analysis Display Update
```javascript
// Update trauma bar width and label
traumaFill.style.width = `${data.trauma}%`;
traumaText.textContent = data.trauma > 70 ? "High Trauma" : 
                         data.trauma > 40 ? "Medium Trauma" : "Low Trauma";

// Update saturation bar width and label
inkFill.style.width = `${data.saturation}%`;
inkText.textContent = data.saturation > 80 ? "Heavy Saturation" : "Controlled Delivery";

// Update best use recommendation
bestUseText.textContent = data.best_use;
```

### Trauma Classification Logic (in `updateVisuals()`)

| Trauma Value | Classification |
|--------------|----------------|
| > 70 | "High Trauma" |
| 40–70 | "Medium Trauma" |
| < 40 | "Low Trauma" |

### Saturation Classification Logic (in `updateVisuals()`)

| Saturation Value | Classification |
|------------------|----------------|
| > 80 | "Heavy Saturation" |
| ≤ 80 | "Controlled Delivery" |

---

## API Reference

### Public Functions

#### `updateVisuals()`
- **Location**: `main.js`
- **Parameters**: None (reads from global `state` object and `TAPER_DATABASE`)
- **Returns**: `undefined`
- **Behavior**: Recalculates all SVG element positions, dimensions, and analysis display values based on current state
- **Called by**: Event listeners on taper buttons, gauge select, depth slider; also called once on DOMContentLoaded

#### `copyEmbedCode()`
- **Location**: `index.html` (inline script)
- **Parameters**: None
- **Returns**: `undefined`
- **Behavior**: Selects text in `#embedCodeTab` textarea, executes `document.execCommand('copy')`, shows alert

#### `sendHeight()`
- **Location**: `common.js`
- **Parameters**: None
- **Returns**: `undefined`
- **Behavior**: Calculates `document.body.scrollHeight + 50`, posts message `{ height: height }` to parent window via `window.parent.postMessage()`

#### `setTheme(theme, save)`
- **Location**: `common.js`
- **Parameters**:
  - `theme` (string): `'light'` or `'dark'`
  - `save` (boolean): Whether to persist to `localStorage`
- **Returns**: `undefined`
- **Behavior**: Toggles `light-mode`/`dark-mode` classes on body, updates toggle button icon, optionally saves to `localStorage`

### Event Handlers

| Element | Event | Handler Behavior |
|---------|-------|------------------|
| `.taper-btn` | `click` | Removes `active` class from all buttons, adds to clicked button, sets `state.taper`, calls `updateVisuals()` |
| `#needle-gauge` | `change` | Parses selected value to float, sets `state.gauge`, calls `updateVisuals()` |
| `#penetration-depth` | `input` | Parses slider value to float, sets `state.depth`, calls `updateVisuals()` |
| `.tool-tab` | `click` | Updates tab button styles, shows/hides corresponding `.wrapper-tab-content` |
| `#copyEmbedCode` | `click` | Copies textarea content to clipboard, shows "Copied!" feedback for 2 seconds |
| `window` | `message` | Listens for `{ theme: 'light'|'dark' }` messages from parent frame |

---

## Integration Guide

### Standalone Embedding

The tool is a fully self-contained static HTML/CSS/JS application with no external dependencies. Embed it in any webpage using an iframe:

```html
<iframe 
    src="https://poliinternational.com/tools/needle-taper-visualizer/index.html" 
    width="100%" 
    height="1200" 
    frameborder="0" 
    style="border-radius:12px;">
</iframe>
```

### Iframe Communication

The tool automatically sends its height to the parent window via `postMessage`:

```javascript
// Sent on load, resize, and DOM mutations
window.parent.postMessage({ height: document.body.scrollHeight + 50 }, '*');
```

The parent can control the theme by posting a message:

```javascript
// From parent frame
iframe.contentWindow.postMessage({ theme: 'light' }, '*');
```

### Embed Code Tab

The tool provides a built-in "Embed Code" tab that displays the iframe snippet and a "Copy Code" button for easy integration.

---

## Customization

### Theme Customization

The tool supports dark and light modes. Themes are controlled via:

1. **Local storage**: `localStorage.setItem('theme', 'light')` or `'dark'`
2. **Parent frame messages**: `{ theme: 'light' }` or `{ theme: 'dark' }`
3. **Toggle button**: Click the theme icon in the tool header

### CSS Customization

All visual styles are in two CSS files:
- `poli-standard.css`: Shared Poli brand styles
- `style.css`: Tool-specific styles

Override styles by targeting the tool's CSS classes within your parent page or by modifying the source files.

### Data Customization

Modify `TAPER_DATABASE` in `database.js` to:
- Add new taper profiles
- Adjust trauma/saturation values
- Change best-use recommendations
- Modify taper lengths

---

## Performance

### Optimization Characteristics

- **Zero external dependencies**: No jQuery, React, or third-party libraries
- **Single reflow per interaction**: `updateVisuals()` runs once per user input
- **SVG rendering**: Uses native browser SVG engine (hardware-accelerated on most devices)
- **Minimal DOM manipulation**: Only updates SVG attributes and text content
- **No network requests**: All data is embedded in the JavaScript files

### Performance Considerations

- The tool runs entirely client-side with no server calls
- SVG viewBox is fixed at 800×500, ensuring consistent rendering across devices
- The `MutationObserver` in `common.js` watches for DOM changes but only triggers height recalculation, not visual updates

---

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome 60+ | Full support |
| Firefox 55+ | Full support |
| Safari 12+ | Full support |
| Edge 79+ | Full support |
| Opera 47+ | Full support |
| iOS Safari 12+ | Full support |
| Chrome Android 60+ | Full support |

### Requirements

- **SVG support**: Required for visualization (supported in all modern browsers)
- **ES6 JavaScript**: Arrow functions, `const`/`let`, template literals
- **CSS custom properties**: Used for theming
- **`postMessage` API**: For iframe communication
- **`localStorage`**: For theme persistence (optional, degrades gracefully)

---

## Security

### Input Handling

- **No user text input**: The tool uses only buttons, dropdowns, and range sliders
- **No form submission**: All interactions are client-side only
- **No data storage**: No user data is collected or transmitted

### XSS Prevention

- All dynamic text content is set via `textContent` (not `innerHTML`)
- SVG attribute values are numeric or predefined strings from `TAPER_DATABASE`
- No `eval()` or dynamic code execution
- No URL parameters are processed

### Iframe Security

- The tool sets `X-Frame-Options` via meta tag: `<meta name="robots" content="noindex, nofollow">`
- Parent frame communication uses `postMessage` with wildcard origin (`'*'`) for maximum compatibility
- Theme messages are validated before application

### Data Integrity

- `TAPER_DATABASE` is a constant object with hardcoded values
- State values are constrained by UI controls (dropdown options, slider min/max)
- No external data sources or APIs are accessed

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01 | Initial release |

---

## Support / Contact

For technical support, feature requests, or custom integration assistance:

- **Email**: support@poliinternational.com
- **Contact Form**: https://poliinternational.com/contact-us/
- **Tool URL**: https://poliinternational.com/tools/needle-taper-visualizer/

### Support Scope

- Tool functionality and bugs
- Embedding and integration guidance
- Customization questions
- Feature requests for future versions

### Response Time

Standard support inquiries are typically answered within 1-2 business days.
