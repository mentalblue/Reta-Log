# Archived notes from releases before 1.8.0

Historical document only. Use README.md and VERIFICATION-1.8.0.md for current features, build instructions and test results. Signing keys are NOT included in the source distribution.

English personal journal for Android 8+; native Health Connect import requires Android 14+.

## Changes in 1.6
- User-facing chart labels use avg/average.
- Home has a swipeable seven-calendar-day dose window with dates and arrows, and weekly confirmed-dose totals anchored on the first entry date.
- Supplies are accordions with available/empty colour plus text, total remaining mg, separate bacteriostatic water in mL, and duplication that resets history and preparation date. Water use is manually recorded.
- Journal-to-inventory navigation remembers the originating entry; Android Back returns there.
- Body/weight chart supports pan, pinch/buttons zoom, full screen, point labels and dated readings.
- Daily average or latest same-day measurement preference is used by the weight charts, weight statistics and forecast; raw records are preserved.
- Auto/custom nutrition with grams, percentages and protein range. Balanced preset uses 45% carbohydrate calories; keto uses about 5% capped at 30 g. Protein remains independent of keto. Default current-weight ranges: 1.2–1.6 g/kg or 1.4–2.0 when resistance training selected. Target-weight 1.5–2.2 is explicitly an adjustable planning convention, not a retatrutide-specific guideline.
- Larger small text, neon blue/green/yellow accents and custom page background with adaptive text/button contrast.
- Large custom check-in note, reminders with inclusive end date or no end, male/female abdomen location diagrams.
- Learn has an AI-generated equipment photo and explanations of cartridge compatibility and muscle retention. It does not endorse refilling products against their device instructions.

### Verification for 1.6
Core tests passed for weight selection, anchored weeks, macro energy accounting, protein parity between keto/balanced and contrast. Browser checks passed for dose windows, accordion/copy/water, entry-back navigation, profile calculation, weight chart/selection, theme, reminder end date form, female torso and persistence. Native reminder end-date handling compiles but notification delivery and Android Back need physical device confirmation. APK v2/v3 signature verified; no real device or emulator test.

### Generated equipment image
Asset: app/src/main/assets/equipment.png. Built-in ImageGen was used with a prompt for an unbranded photorealistic medicine vial, 3 mL-style cartridge and reusable pen on a navy studio background, with no exposed needle or preparation procedure. Illustration only, not device-specific reference.

## Changes in 1.5.1
- Exact kg labels beside measured weight dots, with two decimal places. Zoom reveals labels as spacing permits; tapping prioritises the selected day.
- Labels avoid neighbouring dots and labels. Multiple same-day readings retain their daily mean.
- Browser checks passed for zoomed values, selection, portrait and landscape. APK signature verified; no physical-device test.

## Changes in 1.5
- Journal balances now represent remaining mg immediately after each confirmed entry, calculated chronologically for its linked supply.
- Equal timestamps use stable entry-ID ordering; journal display uses the same tie ordering.
- Planned entries explicitly show current supply without deducting the planned amount; skipped entries do not deduct stock.
- Click the Journal supply balance to open Inventory, scroll to and focus the exact linked supply. Inventory continues to show current total remaining.
- Verified historical recalculation after edit/delete/undo, supply isolation, timestamp ties, navigation/focus and persistence.

## Changes in 1.4
- Journal weekday and current remaining mg for its linked supply.
- Supply cards include total confirmed mg injected and dated injection history.
- Body chart uses calendar months/years, a fixed kg scale, horizontal scrolling, and tappable daily readings.
- Main chart overlays daily mean measured weight on a separate kg axis; missing days stay empty.
- Years are retained in abbreviated dates. Model explanation distinguishes instantaneous amount from time averages.
- Verified supply accounting/status filtering, delete/undo updates, multi-reading days, missing days, year boundaries, chart axes, landscape and data reload in browser UI.

## Included
- Historical dose journal, planned/skipped entries, editing, duplicate warning, delete and Undo.
- Illustrated abdominal location log, lyophilised-vial and pen-cartridge inventory.
- Interactive model chart with pan, pinch zoom, landscape fullscreen, peaks/troughs, trailing means, view mean, Today and separate dashed scenarios.
- Profile, BMI, separate protein/carbohydrate targets, calorie-deficit estimate and keto preference.
- Weight history, weekly/monthly within-period changes and a goal-date projection.
- CSV column mapping and import preview for Eufy exports, calendar provider import and basic ICS fallback; batch undo.
- Health Connect reads weight, fat percentage, lean mass, bone mass, water mass and BMR when permitted and available. Other scale fields can be entered manually or imported through CSV. Lean mass is not muscle mass.
- Native biometric/device-credential lock, immediate background lock and protected app preview when enabled.
- Private recurring notifications, JSON backup/restore, journal CSV and native PDF journal report.
- Light, dark and system themes, four accent palettes, illustrated equipment guide and adaptive vial icon.

## Goal projection
Uses one weight per day (daily average or latest measurement, as selected) in the most recent 28 days. Requires at least five distinct days spanning 14 days and a weigh-in within seven days. Fits a linear trend; remaining kg is the recent seven-calendar-day mean minus target. Shows no arrival estimate for a stable/rising trend or an estimate over two years. This is a mathematical extrapolation, not an expected treatment outcome.

## Limits and checks
Built and APK v2/v3 signature verified on 18 September 2026. Tested JavaScript model/forecast/CSV validation and browser UI save/reload, delete/undo, navigation, calculator invalidation, portrait/landscape and zoom. Not run on a physical Android device or Android emulator. Native permissions, authentication, notifications and provider reads need device verification. Actual Eufy CSV column names are confirmed by the user during mapping; no personal export sample was available.

The APK contains no personal records. The PK display assumes instantaneous absorption and exponential elimination (default six-day half-life); it is not a measured blood level and does not recommend doses. The calculator converts supplied mass/concentration/volume values, not a preparation protocol. Pen clicks are not calculated. Nutrition values are editable estimates.

The following refinements are not in this preview: profile photo, drag-to-reorder cards, configurable lock delay, automated screenshot OCR, continuous background Health Connect sync, configurable fasting windows. Heart-rate import is not included in the current Health Connect reader. ICS recurrence and differing timezones must use the device calendar import to preserve occurrence times.

## Install
Open Reta-Log-1.6.apk from Android Downloads. This uses the same application ID and prototype signing key as Reta dnevnik 0.1. Back up records before uninstalling. This is a prototype key, not a production distribution key. Data remains in app-private storage; exported JSON/CSV/PDF is readable. Uninstalling erases local records.

## Build
Gradle configuration: Android Gradle Plugin 8.7.3, SDK 35, min SDK 26, JDK 17. Run `./gradlew :app:assembleDebug` after configuring your SDK.

Alternative actually used for this APK: `build-direct.sh`, with Android Build Tools 35.0.0, Android 35 android.jar and Eclipse ECJ 3.38.0. Set RETA_ANDROID_JAR, RETA_BUILD_TOOLS and RETA_ECJ_JAR paths. Script compiles Java 8 bytecode, compiles resources, runs d8, aligns and signs the APK. Runtime Java APIs require Android 8+.

Run mathematical checks: `node tests/core.test.js`.

### 1.6.1 — layout and journey corrections
- Bottom navigation remains one row at 320, 360 and 412 px; labels cannot wrap.
- Removed free background picker and separate colour card. Existing accent palette now includes sky blue, fresh green and golden yellow. All accents are adjusted for contrast on the selected surface, including gold on light themes.
- Added curated Midnight, Forest and Slate themes alongside Light, Dark and System. Removed legacy custom backgrounds from active settings. Cards use subtle lighting and depth without saturated backgrounds.
- Journal entries collapse independently, with Open all / Close all. Header and edit action stay visible; expansion survives the inventory return path.
- Weekly dose dates show three-letter weekdays and anchor to the first confirmed dose day. Journey weights exclude pre-treatment dates from summaries, retaining all original measurements. Week and month periods anchor to the same starting day; missing baseline weights are not invented.
- Daily check-in dates include weekdays, including live feedback in the entry form.
- Validation: core tests and v161-ui.cjs (42 theme/accent combinations, navigation widths, accordion controls and return, Thursday–Wednesday weekly boundaries, journey baseline, existing 1.6 functionality). Actual Android hardware interaction remains unverified.

### 1.7 — optional premium surfaces and daily records
- Appearance: optional **3D card style** adds restrained lighting, depth and fine textures. Existing theme/accent contrast adaptation remains. Home cards can be hidden or reordered.
- Inventories are grouped into retatrutide vials, pen cartridges, disposable pens and bacteriostatic water. Unopened/in-use/empty states have labels and green/amber/red borders. First confirmed use or an entered opening/preparation date marks use; several supplies may be open. Pencil/copy actions remain accessible 44 px buttons. Copy resets opening/use history.
- Latest weight opens the weight graph at the last recorded day; navigation keeps return history. Unified + Log links to doses, measurements, feelings and enabled daily logs.
- Hydration: optional **personal drinks goal** in mL; no unvalidated retatrutide-dose adjustment. Learn distinguishes drinks from EFSA total dietary water reference values. Logging is optional, with +250/+500 mL, custom timestamps, edit, delete and undo.
- Protein: optional grams-consumed log with food/whey/whey isolate/other source and meal. Repeat last creates a reviewed new record. Disabling either log retains history. Both are included in validated backup/restore.
- Equipment: four newly generated generic illustrations are embedded offline. The native WebView now serves bundled assets via an intercepted, allowlisted local HTTPS origin, avoiding reliance on unrestricted file access. No network permission was added.
- Learn includes reconstitution terminology and concentration calculations, explicitly excluding a universal retatrutide preparation protocol or shelf-life claim. External references remain collapsible.
- About & Legal contains versioned draft Terms of Use, Privacy Policy and medical/educational disclaimer, with a short first-use notice. **Publisher identity/contact, applicable jurisdiction and legal/regulatory review are still required before public distribution.** No blanket immunity is claimed.
- A date-limited clinician summary includes confirmed/planned/skipped doses, daily selected weights in text, original weight readings in PDF, check-ins and optional daily records. Explicit labels distinguish these. Existing full-journal PDF with model graph remains available.
- Validation: tests/v17.test.cjs checks ISO local-day keys, totals, legacy migration, invalid logs and supply status. tests/v17-ui.cjs checks all new user flows, backup round-trip and invalid restore preservation, four images, navigation widths and all theme/accent combinations. Native PDF generation, notifications and WebView loading still require real-phone confirmation; compilation/signature verification alone does not test them.

#### 1.7 image provenance
Generated with the built-in image-generation tool for this release, as generic educational product illustrations, not real manufacturer photographs. Asset paths:
- app/src/main/assets/equipment-pen.png: conventional silver reusable cartridge pen, dark blue cap, separate cartridge, no brand; pale blue-grey studio background.
- app/src/main/assets/equipment-syringe.png: small 1 mL syringe with protective orange cap and plain wrapper; illustrative markings are not a measuring reference.
- app/src/main/assets/equipment-water.png: generic smaller 5 mL and larger 10 mL glass vials; no brand or regulatory claims.
- app/src/main/assets/equipment-needle.png: individually packaged capped pen needle, illustrative 31G · 4 mm marking; not a device recommendation.
All images are marked as AI illustrations in Learn. The design does not assert that pictured equipment is approved or compatible with retatrutide. Original generation prompts are included in IMAGE-PROMPTS-1.7.md.

### 1.7.1 — navigation, quick logging and touch ordering
- Bottom navigation uses one horizontal text line on phones (icons appear beside labels on wider screens); full-screen charts still hide it.
- Fixed shared button HTML escaping: double-quoted actions previously broke Hydration/Protein buttons in + Log. Tests now click these actual buttons, enter values and save.
- Added +300 mL alongside +250/+500 mL.
- Latest weight and Supplies share one responsive two-column row, moving as one group; individual visibility preferences are preserved.
- Recorded balance lists each category's container count, declared capacity distribution (e.g. 2 × 10 mg), remaining total and count with contents. mg and mL stay separate.
- Arrange home cards now uses six-dot drag handles, hold-to-drag (240 ms), auto-scroll, persist on release, cancellation rollback and keyboard up/down support. Pointer capture remains on the stable list rather than moved rows.
- 3D on/off is visibly different: flat surfaces when off, raised borders/shadows and fine patterns when on, plus an appearance preview.
- tests/v171-ui.cjs exercises real quick-log clicks, 300 mL, paired layout at 320/360/412 px, category capacity summaries, mouse and emulated touch drag, and distinct 3D styles. Includes previous 1.7 flows and backup/persistence checks. Physical Android device verification remains outstanding.

### 1.7.2 — restore navigation icons
- All five navigation icons stay visible on every supported screen width. The selected page label sits beside its icon; inactive labels remain accessible via names/tooltips. No icon/label stacking and no second navigation row.
- Navigation is a fixed-height, non-wrapping flex row; fullscreen charts hide it as before.
- tests/v172-nav.cjs verifies five visible 24 px icons, a common vertical centre and row, exactly one inline selected label, no button overflow, correct page clicks and fullscreen hiding at widths 280–600 px across all five pages. Real-device confirmation remains outstanding.

### 1.7.3 — requested refinements only
- Native window insets are applied to the root once and consumed before reaching the WebView; the web navigation no longer adds another safe-area bottom inset. System navigation buttons themselves remain managed by Android. Physical phone confirmation is needed for the reported empty strip.
- No decorative patterns on graph cards. Other 3D cards use restrained gradients and small angular corner accents, replacing concentric rings. No new-design switch or navigation reorganisation was added.
- Save / Remove compact icon-and-text actions appear at top and bottom of supply details; removal retains confirmation.
- Inventory category default order: retatrutide vials, bacteriostatic water, disposable pens, cartridges. Arrange categories offers six-dot hold/drag handles with keyboard fallback and persistent ordering.
- Category summaries show capacity composition, remaining quantity and used quantity, e.g. 4 × 10 mg · 32 mg left · 8 mg used. Different capacities remain separate.
- Remaining medication amounts ≤3 mg are red; nonempty supplies also show exactly “Low”. Water is not subject to an mg threshold; zero remains Empty.
- Small vector RET / BAC vial, pen and cartridge illustrations appear in collapsed supply headers and category headings.
- Profile includes optional dated circumference records: neck, chest, biceps, waist, hips, thigh and calf. An interactive male/female schematic connects each area to its cm input and highlights focused measurements. Edit/delete/undo and validated backup/restore preserve history. Notes allow consistent side and placement to be recorded.
- tests/v173-ui.cjs validates inventory summaries, Low units, dual actions, category dragging, illustrations, interactive measurements and restore validation, clean graphs, and 8 px web navigation padding. APK build/signature and existing core tests passed. Native insets still need physical-device confirmation.
