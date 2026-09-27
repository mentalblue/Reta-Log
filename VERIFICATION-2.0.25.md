# Reta Log 2.0.25 — layout correction candidate

Version name 2.0.25, version code 52. Based on the current 2.0.24 project, preserving the existing application and records. The attached 2.0.1 archive is an older baseline and was not used to overwrite current functionality.

## Changes

- Today Plan: compact header/action alignment, consistent SVG icons, a weekly timeline with date ranges, individual dose ranges and frequency; current week marker; actual completion checks; compact headers for other active plans.
- Calendar-week counting uses calendar dates, so a four-week plan does not become five rows across daylight-saving changes.
- Rendering is tested to leave stored plans and occurrences untouched. Multiple active records remain separate; no records were silently merged or deleted because they share a name.
- Today Supplies: stable category order (compound, pen needles, water, cartridges, consumables, separate syringes), bounded text widths, safe wrapping, smaller unit labels, aligned values and stock indicators; three columns at ordinary phone widths and two at widths below 360 CSS px.
- Inline inventory expansion remains connected to the selected tile. Details do not repeat decorative illustrations.
- Reworked glass vial/cartridge SVGs, consistent outlined Plan/cube/add/chevron/check icons and selected-accent styling.
- Inventory overview, category panels and item detail styling share bounded typography, spacing, illustration sizes and light/dark surfaces.
- Settings fallback and Android build metadata now report 2.0.25.

## Verified

- Complete Android compilation, resource packaging and signing succeeded.
- APK metadata: package hr.mentalblue.retadnevnik, version 52 / 2.0.25, target SDK 35.
- APK v2/v3 signature validates and signing certificate matches 2.0.24.
- inventory224-dom.cjs passes, including startup; Today expansion; navigation; BAC use; transfer to cartridge; one real injection; usage history; traceable archive; custom cartridge size; compound saving; plan save/edit; search; Calculator/Learn; state serialization.
- Added assertions: repeated Today rendering does not mutate state, four weeks across the Europe/Zagreb daylight-saving boundary remain four weeks, and a 2+2+2-week plan maps to phase indices 0,0,1,1,2,2.
- inventory224.cjs passes additive migration, inventory conservation, duplicate-operation rejection, stock deductions, overdraw prevention and history/compound isolation.
- plan214.cjs passes weekly, unequal split-dose, every-X-days and multi-phase generation.

## Visual verification limit — NOT 100% approved

Chromium installation succeeded, but launch is blocked by the execution environment: socket() failed, Operation not permitted. No Android device or emulator is connected. Browser visual tests and camera/haptic device tests could not be completed.

The supplied PNG is a STATIC REVIEW RENDER with synthetic demonstration records, NOT an Android screenshot and NOT proof of exact WebView rendering. It is generated from the actual exported application HTML and styles using WeasyPrint, with renderer compatibility transformations documented in tests/render-static225.py (buttons rendered as divs, fixed review heights and SVG paint fallbacks). These compatibility transformations do not alter production files. It omits device chrome and other Today cards.

The standalone HTML previews retain the production styles and sample content, inline resources for offline review, and have record-changing click handlers removed. They are visual snapshots, not a replacement application.

Pixel-for-pixel fidelity, actual touch/keyboard behavior, accessibility scaling and the final S23 Ultra layout remain unverified. This build is a review candidate. The requested 100% visual acceptance is NOT claimed. No new camera/haptic changes were made in this correction.
