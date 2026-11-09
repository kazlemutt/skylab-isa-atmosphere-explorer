# SkyLab ISA Atmosphere Explorer — Design Plan

## Subject & Audience
**Subject:** International Standard Atmosphere (ISA) troposphere model — an aerospace engineering educational tool.
**Audience:** Student pilots, aerospace engineering students, aviation enthusiasts, physics learners.
**Primary Job:** Let users explore how air properties (temperature, pressure, density, speed of sound) change with altitude, using an interface that feels like a real flight instrument — not a generic dashboard.

---

## Color Palette (6 core tokens)

| Token | Hex | Role |
|-------|-----|------|
| `--bg-panel` | `#080b0e` | Instrument panel face — near-black, not navy |
| `--bg-face` | `#0f1419` | Instrument glass/face background |
| `--bg-raised` | `#171e27` | Raised bezels, slider track, chart area |
| `--border-seam` | `#1f2a38` | Panel seams, instrument borders |
| `--readout-primary` | `#00e676` | **Primary readout green** (EFIS convention — safe/normal) |
| `--readout-amber` | `#ffb300` | **Amber** for altitude-related values (caution/attention) |
| `--text-primary` | `#dfe6ed` | Primary labels, titles |
| `--text-secondary` | `#7a8d9c` | Secondary labels, units |
| `--text-muted` | `#4a5d6b` | Tertiary, disabled, fine print |

**No cyan. No purple gradients. No decorative accent washes.** Aviation instruments use green (normal), amber (caution), red (warning) — semantic, not decorative.

---

## Typography

**One display family, one UI family — clearly distinct.**

| Role | Family | Treatment |
|------|--------|-----------|
| **Readouts (numbers)** | `ui-monospace, SF Mono, Menlo, Consolas, monospace` | Tabular numerals (`font-variant-numeric: tabular-nums`), large scale, `--readout-primary` or `--readout-amber`, letter-spacing `-.02em` |
| **UI / Labels / Body** | `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Sentence case, no all-caps tracking, clear hierarchy via weight/scale only |

**Type Scale (clamped, fluid):**
- `--text-xs`: 0.6875rem (11px) — fine print, disclaimer
- `--text-sm`: 0.8125rem (13px) — unit labels, axis labels
- `--text-base`: 0.9375rem (15px) — body, control labels
- `--text-lg`: 1.125rem (18px) — section titles
- `--text-xl`: 1.5rem (24px) — readout values (small)
- `--text-2xl`: 2.25rem (36px) — readout values (medium)
- `--text-3xl`: 3.5rem (56px) — **primary altitude readout**
- `--text-4xl`: 5.5rem (88px) — hero altitude (if used)

**Line lengths:** < 70ch for body. Readouts are single-line.

---

## Layout Concept

**Instrument panel metaphor — left-aligned, hierarchical, not a card grid.**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  SKYLAB  ISA EXPLORER                                    [METRIC ▼ IMPERIAL] │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────┐  ┌──────────┐  │
│  │  ALTITUDE                                                 │  │ DENSITY  │  │
│  │                                                          │  │ PROFILE  │  │
│  │       0  FT                                               │  │          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │  1.225   │  │
│  │  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  │  │   ┤      │  │
│  │  └────────────────────────────────────────────────────┘  │  │  0.900   │  │
│  │  0          5,500          11,000  FT                    │  │   ┤██    │  │
│  └──────────────────────────────────────────────────────────┘  │  0.600   │  │
│                                                                 │   ┤████  │  │
│  ┌──────────────┬──────────────┬──────────────┬────────────┐   │  0.300   │  │
│  │  TEMPERATURE │  PRESSURE    │  DENSITY     │  SOUND     │   │   ┤██████│  │
│  │   -56.5 °C   │   226.3 hPa  │   0.364      │   295.1    │   │  0.000   │  │
│  │              │              │   kg/m³      │   m/s      │   │  0   5K 11K│  │
│  └──────────────┴──────────────┴──────────────┴────────────┘   └──────────┘  │
│                                                                              │
│  Educational model only — ISA troposphere (0–11,000 m). Not for flight use.  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Key layout decisions:**
- **Single primary instrument**: The altitude selector dominates (left, large)
- **Readouts as horizontal tapes**: Four equal-width horizontal instruments (EICAS style), not cards
- **Chart as vertical tape**: Density profile on right, tall, like a Vertical Situation Display
- **Left-aligned content**: Instruments align left in a cockpit
- **No card shadows, no hover lifts, no decorative borders** — panel seams only

**Responsive behavior:**
- ≥ 1000px: Two-column (altitude+readouts | chart)
- 700–999px: Stacked — altitude selector full width, readouts 2×2, chart below
- < 700px: Single column — altitude, readouts stacked, chart compressed

---

## Principles

1. **Instrument panel, not dashboard** — Every element serves the altimeter metaphor. No generic "card" components.
2. **Readouts are tapes, not cards** — Horizontal value displays like engine instruments (EICAS), with labels above, values prominent, units subordinate.
3. **One primary interaction** — The altitude selector is the only control. Everything else reacts.
4. **Aviation color semantics** — Green = primary/normal readouts. Amber = altitude/height values. Red = warnings (unused here). No decorative cyan.
5. **Restraint** — No hover animations on readouts. No card shadows. No decorative gradients. One subtle transition: the slider thumb and chart marker.
6. **Tabular numerals everywhere** — Numbers never jump when values change.
7. **Respect the medium** — `prefers-reduced-motion` kills all transitions. `prefers-contrast: more` strengthens borders. Keyboard-operable throughout.

---

## What Changed from Current Design (Self-Critique)

| Current (Generic) | Revised (Distinctive) | Why |
|-------------------|----------------------|-----|
| Dark navy + cyan accent | Panel black + aviation green/amber | Semantic color, not decorative |
| 4 identical rounded cards | 4 horizontal instrument tapes | Matches EICAS/engine instrument layout |
| ALL-CAPS "ATMOSPHERE LAB" eyebrow | "SKYLAB ISA EXPLORER" — sentence case, no tracking | Not template chrome |
| Monospace for symbol labels (T, p, ρ, a) | Monospace ONLY for numeric readouts | Monospace is for numbers, not decoration |
| Hover lift + glow on every card | Zero hover effects on readouts | Instruments don't animate on hover |
| Chart in a card with legend below | Chart as vertical tape, right-aligned | VSD metaphor, integrated |
| Generic slider track | Slider as altimeter setting knob | Primary control gets primary treatment |
| Uniform border-radius everywhere | Sharp panel seams, only slider thumb rounded | Instrument panels have sharp edges |

---

## Implementation Notes

- **No new dependencies** — Plain HTML/CSS/JS, same as current
- **CSS custom properties** for all tokens (already established pattern)
- **SVG chart redrawn** as vertical tape with altitude increasing upward (aviation convention)
- **Slider restyled** as a prominent altimeter-style selector
- **Tabular numerals** via `font-variant-numeric: tabular-nums` on all readouts
- **Reduced motion** already supported — extend to new transitions