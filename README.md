# Tattoo Needle Taper Visualizer

> **Interactive dermal dynamics guide for comparing tattoo needle taper lengths and impact.**

[![License](https://img.shields.io/github/license/Poli-International/needle-taper-visualizer)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/Poli-International/needle-taper-visualizer)](https://github.com/Poli-International/needle-taper-visualizer/commits/main)
[![GitHub Stars](https://img.shields.io/github/stars/Poli-International/needle-taper-visualizer?style=social)](https://github.com/Poli-International/needle-taper-visualizer/stargazers)

**Live Tool:** [https://poliinternational.com/needle-taper-visualizer/](https://poliinternational.com/needle-taper-visualizer/)

---

## 📋 Overview

The **Tattoo Needle Taper Visualizer** is a professional calibration tool designed to help artists understand the relationship between needle geometry and dermal trauma. By visualizing how different conical grinds interact with the epidermis and dermis, artists can make informed decisions on tool selection for specific techniques.

### Key Features

1. **📏 Conical Geometry Engine**
   - Interactive SVG visualization of Short (1.5mm) to Extra Long (8.0mm) tapers.
   - Dynamic scaling based on needle gauge (#08, #10, #12).
   - Adjustable penetration depth to simulate actual procedural conditions.

2. **🩸 Trauma & Saturation Analysis**
   - **Trauma Rating:** Real-time estimation of surface area displacement and tissue resistance.
   - **Pigment Delivery:** Analysis of ink flow efficiency based on taper surface area.
   - **Best Use Recommendations:** Technical mapping to styles like Traditional, Realism, and Fine Line.

3. **🔬 Layered Anatomy View**
   - Cross-section visualization of the Epidermis and Dermis layers.
   - Precision measurement lines showing the exact length of the conical grind.

---

## 🔧 Technical Logic & Algorithms

### Taper Dynamics Model

The tool simulates conical geometry using the standard conical grind formula:

```javascript
taperAngle = atan((gauge / 2) / taperLength)
impactArea = π * (gauge / 2)^2 / cos(taperAngle)
traumaLevel = f(impactArea, depth)
```

#### Taper Standard Profiles

| Profile | Length | Trauma | Saturation | Best Use |
| :--- | :--- | :--- | :--- | :--- |
| **Short (ST)** | 1.5mm | High | Maximum | Solid Color |
| **Medium (MT)**| 2.5mm | Medium | High | General |
| **Long (LT)**  | 6.0mm | Low | Controlled | Fine Line |
| **Extra (ELT)**| 8.0mm | Minimal | Precise | Hyper-Realism |

---

## 📁 File Structure

```
needle-taper-visualizer/
├── index.html              # Technical interface
├── css/
│   └── style.css          # Streetwise Dark aesthetic
├── js/
│   ├── database.js        # Taper profile data
│   ├── main.js            # SVG geometry engine
│   └── common.js          # Unified theme logic
└── images/
    └── Poli-International-Co.webp  # Brand Identity
```

---

## 🚀 Deployment & Usage

### Live Production
This tool is integrated into the Poli International ecosystem via the **Poli Core System**. It features full synchronization with the site-wide dark mode and scientific wiki links.

### Standalone Embed
To use this tool on your own studio website, use the following iframe:

```html
<iframe src="https://poliinternational.com/wp-content/standalone-tools/needle-taper-visualizer/index.html" 
        width="100%" 
        height="1200" 
        frameborder="0" 
        style="border-radius: 12px; border: 1px solid #333;">
</iframe>
```

---

## 🎨 Branding & Standards

- **Theme:** Streetwise Dark Mode (Primary: #0693e3, Accent: #9b51e0)
- **Naming:** BEM (Block Element Modifier)
- **SEO Keywords:** Tattoo needle taper, short taper vs long taper, bugpin needles, tattoo needle geometry, dermal trauma, needle physics.

---

## 👨‍💻 Credits

**Built by:** Claude Code Agent System (opencode)
**Client:** Poli International
**Scientific Foundation:** [Needle Geometry & Dermal Physics Wiki](https://poliinternational.com/wp-content/standalone-tools/standards/needle-geometry-physics.html)

---

## 📧 Contact & Support

**Technical Support:** [patrick@poli-international.com](mailto:patrick@poli-international.com)
**Support Innovation:** [Buy Me a Coffee](https://ko-fi.com/patrickkofi)

---

© 2026 Poli International Ltd. | Precision Engineering for the Body Art Industry.
