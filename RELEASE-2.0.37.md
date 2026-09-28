# Reta Log 2.0.37 — build 64

Based on the recovered and audited 2.0.36 source, not 2.0.32 or the unrelated 2.0.1 upload.

## Implemented

- Canonical injection IDs link planned occurrences to Taken/Skipped records. The same editor is used from occurrence details and injection history. Changes to dose, status or source reconcile derived inventory balances.
- Per-compound estimated level, peak, trough and calendar-day average use the existing exponential model. Planned projections are separate; Planned and Skipped do not contribute to current levels. Other compounds require an explicit half-life assumption.
- Progress tabs: Overview, Peptides, Body, Activity. Available body measurements are displayed as current value, change and trend; absent metrics do not become zero cards.
- Shared interactive charts: 7D/14D/1M/3M/All, default 7D, pan, horizontal/vertical pinch, selection and series controls. Android fullscreen requests landscape and uses a 24% control column.
- Related body readings are grouped for display and analytics; original imported rows and provenance remain. Group edits preserve original values, and grouped deletion supports the existing Undo snapshot.
- Acetic Acid is a distinct inventory solvent using the existing exact-container balance and reconstitution system. Transfers preserve solvent lineage. BAC expiry defaults are not applied to Acetic Acid.
- Settings and Connections are available together through the gear. Existing input controls are retained. Per-compound model settings and pre-upgrade backup export are added.
- Today retains existing surfaces and artwork, with the requested peptide selector/model link, mini-model curve, two-decimal weight delta and card ordering.
- Injection site selection has front/back maps, discrete positions and last-used information.
- About / What's New reflects this release.

## Migration and data preservation

Schema 2 is retained with additive `uxV2.integratedVersion = 1` metadata. Existing records are not destructively rewritten. Planned occurrences receive linked canonical injection records; executing one updates its ID rather than creating another injection. Historical injections stay after plan deletion. Inventory remains based on existing stock movements and Taken records.

A pre-upgrade store snapshot is retained in Android private preferences (browser fallback: localStorage). Settings → Connections & data offers export of that snapshot and the existing complete backup/restore. Original import rows are retained underneath grouped body views.

## Material changes

New: `integrated237.js`, `app237.js`, `graphs237.js`, `integrated237.css`, `tests/integrated237.cjs`, `tests/browser237.cjs`.

Updated: asset load order, app bootstrap backup, selected-weight extension point, solvent wording in inventory views, `release221.js`, `MainActivity.java`, `HealthReader.java`, Gradle version and direct build version.

## Deliberately reused

Existing schema validation, snapshot/Undo, import preview and Undo import, CSV parser/mapping, Health Connect access, calendar/ICS, exports and reports, inventory balance/reconstitution/transfer engines, plan generation, exponential model, native camera pulse/haptics, app typography/artwork/themes, biometric lock and reminder controls.

## Verification

- New integrated acceptance suite passes: canonical Plan→Taken, no duplicate record, editing dose/source/status, exact solvent deduction, cartridge lineage, overdraft rejection, depletion and restoration, plan deletion/history retention, body grouping/provenance/stable representative, backup round-trip, Settings routes and Acetic Acid entry point.
- Browser suite passes: 7D default, All full history, point selection, pan, layer toggle, fullscreen controls/Back, no horizontal overflow at 320/360/412px, ranges on one row, preservation of Settings/Connections input IDs, 12 Quick Add cards, 14 site targets and editor-preserving Back.
- 14 of 15 selected regression suites pass. `inventory232-dom.cjs` fails at its old fixture (peptide has no state); the identical failure is reproduced on unchanged 2.0.36. New integration coverage uses explicit Lyophilised state and passes reconstitution/stock checks. Raw results are in `audit/`.
- Today layout comparison at 412×915: all six primary card widths and heights match 2.0.36 with the same empty-state fixture.
- Fresh Android 35 compilation, DEX/resource packaging and APK v2/v3 signing; same certificate as 2.0.36. This is not an assets-only APK patch.

## Limits requiring device validation

No physical Android device was connected. Installation over your existing data, actual Health Connect permission/import flows, camera pulse accuracy/haptics and hardware orientation changes need an on-device check. Browser tests exercise the fullscreen UI; native orientation code compiles but was not exercised on a device.

Body deduplication is deliberately conservative: same-time compatible Health Connect rows, or matching weight within 60 seconds across Health Connect and CSV. Ambiguous/unmatched rows stay separate. This does not promise that every provider's historical duplication can be recognized.

Activity exposes records actually supplied by the existing importer (steps, pulse and recorded activities). This release does not add new native HRV/VO2/workout/calorie permissions or invent missing data. It is a tracking application, not a clinical validation of the entered substances or model assumptions.

Screenshots use synthetic demonstration records; they are browser renders of this source, not images generated to represent an unimplemented UI.
