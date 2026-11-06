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
