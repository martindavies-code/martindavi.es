# HANDOVER - 2026-11-25

## What changed
- `css/styles.css` & `css/academic.css`: fixed tablet and intermediate viewport
  header, navigation and bio layout (`641px-1359px`) without changing the
  desktop (`1440px`) or mobile (`<= 480px`) layouts. Full-width stacked header
  rows for `<= 1279px` with equal-width controls, compact `1280px-1359px`
  desktop header padding so all five pages stay on one top row, single-row
  `>= 44px` touch-target `.chassis-nav` at `680px-1023px` (`3 + 2` grid at
  `481px-679px`), updated `scroll-padding-top` offsets, `overflow-wrap: anywhere`
  on `.spec-val a`, balanced `.about-grid` tablet layout, and fixed
  `.academic-toggle-btn` sizing in Academic Mode.
- `data/projects.json` & `js/app.js`: rewrote `MJD-EXP-02` (`Sports Analysis`)
  copy in UK English with no em dashes to reflect `The Championship Formula`
  expansion across English Tiers 1 to 4 (`180` tables, `1981` to `2026`,
  `91,270` matches, `238,714` goals, interactive SVG charts, play-off seed
  odds, verified scorer audits, full-archive explorer and mode toggles).
- `tests/app.test.js`: added regression tests for `MJD-EXP-02` copy parity
  and tablet CSS layout rules.

## What is tested
- `npx eslint .` passes cleanly.
- `node --test tests/app.test.js`: 88/88 pass.
- Playwright visual and bounding-box checks across `412px-1440px` (`index.html`,
  `wrong-martin.html`, Light, Dark and Distinguished Academic Mode): zero
  horizontal overflow.

---

# HANDOVER - 2026-11-06 (Instinct)

## What changed
- `css/styles.css`, mobile media query (max-width: 640px) only: the two header
  toggles (Distinguished Academic Mode + theme switch) now share one
  equal-width row instead of stacking as two ragged right-aligned boxes.
  Header height at 412px (Pixel 6): ~502px -> ~454px. No desktop changes.
  No markup, copy or JS changes.

## What is tested
- `node --test tests/app.test.js`: 86/86 pass.
- Local Playwright visual checks at 412px and 360px: dark, light and
  Distinguished Academic Mode on all five pages; no horizontal scroll.
- Desktop (1440px) header visually identical to previous live version.
- Live post-deploy check on martindavi.es (Pixel 6 emulation) passed.

## Unresolved
- Nothing known. The full-width 5-row mobile directory nav is the deliberate
  design and was left alone.
