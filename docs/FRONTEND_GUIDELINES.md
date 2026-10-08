# FRONTEND DESIGN SYSTEM & HUD GUIDELINES: HACK THE GRID

This document defines the visual identity, UI tokens, typography standards, and HUD component patterns for **Hack the Grid**.

---

## 1. Visual Identity Direction
The UI must **NEVER** resemble a generic university website. The design language fuses:
- **Cybersecurity SOC** (Security Operations Center dark telemetry)
- **Competitive CTF Platform** (High-contrast code monospace aesthetics)
- **Futuristic Game HUD** (Heads-Up Display panels, corner tech marks, scanlines)

---

## 2. Color Palette Specification

| Token | Hex Code | Purpose |
|---|---|---|
| `cyber-bg` | `#05070A` | Deep obsidian primary background |
| `cyber-secondary`| `#0B1017` | Secondary containers & table header bars |
| `cyber-panel` | `#0F1720` | Primary HUD panel background |
| `cyber-cyan` | `#00E5FF` | Neon Cyan — Primary interactive accent & links |
| `cyber-green` | `#39FF88` | Terminal Green — Solved status & success states |
| `cyber-orange` | `#FF6A00` | CodeSphere Orange — Warning accents & brand highlights |
| `cyber-danger` | `#FF3B5C` | Crimson — Incorrect flags, bans, errors |
| `cyber-warning`| `#FFC857` | Amber — Level locks & freeze warnings |
| `cyber-text` | `#F5F7FA` | Crisp white-silver high-contrast body text |
| `cyber-muted` | `#8B98A7` | Muted metadata and technical labels |
| `cyber-border` | `#1B2A38` | Subdued border dividing line |

---

## 3. Typography Hierarchy

1. **Headings & Badges**:
   - Font: `Space Grotesk` or `Sora` (Fallbacks: `sans-serif`)
   - Style: Uppercase, bold/black weight, tracking-wide.
2. **Body Text**:
   - Font: `Inter` (Fallbacks: `system-ui`, `sans-serif`)
   - Style: Clean, legible, high-contrast, leading-relaxed.
3. **Code, Ciphers & Telemetry**:
   - Font: `JetBrains Mono` (Fallbacks: `ui-monospace`, `monospace`)
   - Style: Monospaced, zero ambiguity between `0` and `O` or `1` and `l`.

---

## 4. HUD Component Blueprints

### A. Tech Corner Cuts
Buttons and cards utilize corner border ticks to emulate hardware displays:
```jsx
<span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-70" />
<span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current opacity-70" />
```

### B. Subtle Scanlines & Cyber Grid
Subtle, performance-conscious grid patterns and CRT scanlines are rendered through `ScanlineOverlay.jsx` with `pointer-events-none` to guarantee zero interaction interference.
