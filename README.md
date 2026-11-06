# SkyLab — ISA Atmosphere Explorer

A beginner-friendly, single-page web application for exploring the International Standard Atmosphere (ISA) troposphere model (0–11,000 m). Move the altitude slider to see real-time updates of temperature, pressure, density, and speed of sound.

## Features

- **Interactive altitude slider** — 0 to 11,000 m with 50 m steps
- **Four atmospheric properties** — Temperature, static pressure, air density, speed of sound
- **Metric/Imperial toggle** — Switch display units while preserving SI calculations
- **Density profile chart** — SVG-based visualization with live altitude marker
- **Responsive design** — Works on desktop and mobile
- **Accessible** — Keyboard-operable controls, ARIA labels, focus states
- **No dependencies** — Plain HTML, CSS, and JavaScript

## Quick Start

Simply open `index.html` in any modern browser:

```bash
# On macOS
open index.html

# On Windows
start index.html

# On Linux
xdg-open index.html
```

Or drag `index.html` into your browser window.

## Project Structure

```
skylab-isa-explorer/
├── index.html      # Semantic HTML structure and controls
├── styles.css      # Layout, responsive design, visual styling
├── script.js       # ISA calculations, unit conversions, chart drawing
└── README.md       # This file
```

## ISA Model

This app implements the **ISA troposphere lapse-rate model** for geopotential altitudes 0–11,000 m using these constants:

| Constant | Symbol | Value | Unit |
|----------|--------|-------|------|
| Sea-level temperature | T₀ | 288.15 | K |
| Sea-level pressure | p₀ | 101325 | Pa |
| Temperature lapse rate | L | 0.0065 | K/m |
| Gravitational acceleration | g₀ | 9.80665 | m/s² |
| Specific gas constant (dry air) | R | 287.05287 | J/(kg·K) |
| Ratio of specific heats | γ | 1.4 | — |

### Formulas

For geopotential altitude `h` (metres):

```
T = T₀ − L·h                                    Temperature [K]
p = p₀ × (T/T₀)^(g₀/(R·L))                     Pressure [Pa]
ρ = p/(R·T)                                     Density [kg/m³]
a = √(γ·R·T)                                    Speed of sound [m/s]
```

All calculations are performed in **SI units**. Conversions to display units happen only at render time.

## Reference Values

The model produces these standard reference values:

| Altitude | Temperature | Pressure | Density | Speed of Sound |
|----------|-------------|----------|---------|----------------|
| 0 m | 15.0 °C | 1013.25 hPa | 1.225 kg/m³ | 340.3 m/s |
| 11,000 m | −56.5 °C | 226.3 hPa | 0.364 kg/m³ | 295.1 m/s |

## Unit Conversions

| Quantity | Metric | Imperial | Conversion |
|----------|--------|----------|------------|
| Altitude | m | ft | × 3.280839895 |
| Temperature | °C | °F | (°C × 9/5) + 32 |
| Pressure | hPa | inHg | Pa × 0.0002952998307 |
| Density | kg/m³ | slug/ft³ | × 0.00194032033 |
| Speed of sound | m/s | kt | × 1.943844492 |

**Important:** The unit toggle changes *presentation only*. Internal calculations always use SI units. Switching units and switching back returns identical physical values (subject only to display rounding).

## Design Principles

- **Aerospace instrumentation aesthetic** — Dark navy background, cyan accents, high-contrast readouts
- **CSS custom properties** — Centralized design tokens for colors, spacing, typography
- **Semantic HTML** — Accessible structure with proper ARIA attributes
- **Responsive CSS Grid** — Multi-column layout collapses to single column on mobile
- **Reduced motion support** — Respects `prefers-reduced-motion`
- **No frameworks** — Vanilla implementation, easy to understand and modify

## Browser Support

Any modern browser with ES6+ support:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Limitations

⚠️ **This is an educational model only.** It does not represent:
- Live weather conditions
- Humidity effects
- Wind or turbulence
- Non-standard atmospheric conditions
- The atmosphere above 11,000 m (stratosphere, mesosphere, etc.)

**Do not use for flight planning, aircraft performance certification, or safety-critical engineering decisions.**

## Development

### Running Locally

No build step required. Open `index.html` directly in a browser.

For live reloading during development, you can use any static server:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`.

### Code Organization

- **`index.html`** — Semantic structure: header, altitude control, result cards, chart, footer
- **`styles.css`** — Design tokens (CSS variables), component styles, responsive breakpoints, SVG chart styles
- **`script.js`** — ISA constants, calculation functions, unit conversions, chart rendering, event handlers

### Extending the Model

To add stratosphere support (11,000–20,000 m), modify `calculateISA()` in `script.js` to use the isothermal layer formulas:
- T = 216.65 K (constant)
- p = p₁₁ × exp(−g₀(h−11000)/(R×T))
- ρ = p/(R×T)

## License

MIT License — Free for educational and personal use.

## Acknowledgments

- ISA constants per ICAO Doc 7488 / ISO 2533
- Inspired by aerospace engineering education tools