# SkyLab — ISA Atmosphere Explorer

## Project brief for an AI coding assistant

Build a beginner-friendly, polished, single-page web app that lets a user explore how the International Standard Atmosphere (ISA) changes with altitude.

The user moves an altitude slider and immediately sees standard-atmosphere temperature, pressure, density, and speed of sound update. The app should feel like a small aerospace instrument panel, not a generic school assignment.

## 1. Target outcome

Create a working website that:

- Runs locally by opening `index.html` in a modern browser.
- Uses only plain HTML, CSS, and JavaScript (no frameworks, package managers, build tools, or external APIs).
- Works on desktop and mobile screens.
- Has a clear, attractive interface with readable labels and units.
- Explains that this is an educational ISA model, not live weather data or a flight-planning tool.

## 2. Core features (MVP)

### A. Altitude control

- Add a range slider covering 0 to 11,000 metres, with a sensible step such as 50 or 100 metres.
- Start at sea level (0 m).
- Update all displayed values whenever the slider moves.
- Show the selected altitude prominently.
- Internally store altitude in metres, regardless of the display unit.

### B. ISA calculations

Use the ISA troposphere lapse-rate model from sea level through 11,000 m. Use these constants:

| Constant | Value |
|---|---:|
| Sea-level temperature, `T0` | 288.15 K |
| Sea-level pressure, `p0` | 101325 Pa |
| Temperature lapse rate, `L` | 0.0065 K/m |
| Gravitational acceleration, `g0` | 9.80665 m/s² |
| Specific gas constant for dry air, `R` | 287.05287 J/(kg·K) |
| Ratio of specific heats, `gamma` | 1.4 |

For geopotential altitude `h` in metres, calculate:

```text
T = T0 - L * h
p = p0 * (T / T0) ** (g0 / (R * L))
rho = p / (R * T)
a = sqrt(gamma * R * T)
```

Where:

- `T` is temperature in kelvin.
- `p` is pressure in pascals.
- `rho` is density in kg/m³.
- `a` is speed of sound in m/s.

Keep calculations in SI units. Convert only when displaying values.

### C. Result cards

Show four clear result cards:

1. Temperature
2. Static pressure
3. Air density
4. Speed of sound

Use sensible display precision and always show units. Do not imply these are measured real-world conditions.

### D. Metric / imperial display toggle

Add a visible toggle that changes displayed units while preserving the same internal SI calculation:

| Quantity | Metric | Imperial |
|---|---|---|
| Altitude | m | ft |
| Temperature | °C | °F |
| Pressure | hPa | inHg |
| Density | kg/m³ | slug/ft³ |
| Speed of sound | m/s | kt |

Use these conversion factors:

```text
metres to feet:       3.280839895
Celsius to Fahrenheit: (C * 9/5) + 32
pascals to hPa:       Pa / 100
pascals to inHg:      Pa * 0.0002952998307
kg/m³ to slug/ft³:    kg/m³ * 0.00194032033
m/s to knots:         m/s * 1.943844492
```

The unit toggle must not change the physical result, only its presentation.

### E. Visual altitude profile

Create a simple chart or vertical profile showing how air density decreases from sea level to 11,000 m. It can be a hand-built SVG or another lightweight solution; do not add a charting dependency.

- Plot the ISA density curve across the full altitude range.
- Mark the user's selected altitude on the curve.
- Keep axes, labels, and the marker readable on small screens.
- Update the marker when the slider moves.

If implementing the chart would block the basic app, finish the slider and result cards first, then add the chart as the next milestone.

## 3. Design direction

Use an aerospace / instrumentation visual style:

- Dark navy or charcoal background.
- Subtle blue or cyan accents.
- High-contrast numerical readouts.
- Clean cards, thin borders, restrained glow effects, and consistent spacing.
- A small eyebrow label such as `ATMOSPHERE LAB` and a clear page title: `ISA Atmosphere Explorer`.
- Avoid excessive animation, clutter, tiny text, or fake technical decoration that harms readability.
- Use responsive CSS so the cards stack on narrow screens.
- Respect `prefers-reduced-motion`.

The visual design should be polished but remain easy for a beginner to understand and modify.

## 4. Suggested file structure

Create these files:

```text
skylab-isa-explorer/
├── index.html
├── styles.css
├── script.js
└── README.md
```

Keep responsibilities separated:

- `index.html`: semantic page structure and controls.
- `styles.css`: layout, responsive design, and visual styling.
- `script.js`: ISA calculations, unit conversions, chart drawing, and UI updates.
- `README.md`: project overview, how to run it, formulas, assumptions, and limitations.

Do not put all code into one enormous HTML file.

## 5. Implementation plan

Build in these small milestones so each one can be tested and committed separately:

1. **Page skeleton:** create the HTML layout and basic responsive styling.
2. **Altitude slider:** make the slider work and display the selected altitude.
3. **ISA model:** add a standalone calculation function and display the four metric results.
4. **Unit toggle:** add imperial conversions and verify toggling does not change the underlying result.
5. **Density profile:** draw the density curve and selected-altitude marker.
6. **Polish and documentation:** improve mobile layout, keyboard usability, explanatory notes, and README.

Do not generate fake commits or pretend that work was completed. The developer will make real commits after reviewing and testing each milestone.

## 6. Quality checks

Verify at minimum:

- At 0 m, the app displays approximately:
  - Temperature: 15.0 °C
  - Pressure: 1013.25 hPa
  - Density: 1.225 kg/m³
  - Speed of sound: 340.3 m/s
- At 11,000 m, the app displays approximately:
  - Temperature: -56.5 °C
  - Pressure: 226.3 hPa
  - Density: 0.364 kg/m³
  - Speed of sound: 295.1 m/s
- Moving the slider updates all readouts and the chart marker.
- Switching units and switching back returns to the same physical values (allowing for display rounding).
- No console errors appear in the browser.
- The layout remains usable on a narrow mobile viewport.
- The slider can be operated with a keyboard and has an accessible label.

## 7. Scope and limitations

This project models the dry-air ISA troposphere from 0 to 11,000 m using a simplified lapse-rate formula. It does not model humidity, local weather, wind, non-standard atmospheric conditions, or the full atmosphere above 11,000 m. It must not be presented as a tool for real flight operations, aircraft performance certification, or safety-critical engineering decisions.

## 8. Instructions to the coding AI

Before writing code, briefly explain the planned implementation and file structure. Then create the complete project files. Keep the JavaScript readable and add short comments to explain the formulas and unit conversions. Do not introduce unnecessary dependencies or features outside this brief.

After creating the files, provide:

1. A short explanation of what each file does.
2. Exact instructions for running the app locally.
3. A checklist for manually testing the quality checks above.
4. A short list of beginner-friendly next improvements, clearly separated from the finished MVP.

Prioritize a correct, working MVP over visual complexity.

## 9. Frontend & UI/UX Guidelines

### Visual Aesthetics & Styling Rules

- **Anti-AI Slop Rules**: No generic purple/blue background gradients. Avoid centered text blocks on full-width backgrounds.
- **Color Discipline**: Limit the palette to 1 primary accent color, 1 neutral background scale (e.g., Zinc/Slate), and functional colors (success/error). Use CSS variables or Tailwind theme tokens—never hardcode hex codes.
- **Typography & Scale**: Set crisp visual hierarchy. Headers must be bold with distinct scale differences (`text-3xl`, `text-xl`, `text-sm`). Use `text-muted-foreground` for secondary text.
- **Component Integrity**: Build layouts using shadcn/ui components. Do not construct inline card boxes with arbitrary padding or borders.
- **Spacing & Layout**: Stick to Tailwind’s standard spacing scale (`gap-4`, `p-6`). Ensure responsive desktop/mobile layouts use multi-column grids rather than single vertical stacks.

### Compatibility note for this project

The original project requirements specify plain HTML, CSS, and JavaScript with no frameworks, package managers, build tools, or external dependencies. Literal use of shadcn/ui and Tailwind would change that stack: shadcn/ui components are intended for React projects and rely on Tailwind CSS. For this beginner-friendly vanilla implementation, preserve the original stack and treat the guidelines above as visual and design principles:

- Use semantic HTML elements and reusable CSS classes as the vanilla equivalents of shadcn/ui components.
- Use CSS custom properties for the accent color, neutral surface scale, text colors, and functional states. Do not hardcode color values throughout individual rules.
- Translate Tailwind typography and spacing tokens into a small, consistent CSS type and spacing scale.
- Build responsive multi-column layouts with CSS Grid and collapse them appropriately on narrow screens.
- Do not add React, Tailwind, shadcn/ui, or a build system unless the project owner explicitly changes the technology-stack requirement.
