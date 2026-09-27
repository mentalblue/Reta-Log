# Reta Log 2.0.24 — implementation and verification

Build: versionName 2.0.24, versionCode 51. Baseline: existing 2.0.23 working project, not the older attached 2.0.1 archive.

## Implemented

- Today **Plan** card backed by existing Plan/Titration records: plan name and compound, start date/duration, expandable plans, phase timeline, completed/current/future states, phase occurrence view, Manage Plans and Add new plan.
- Today **Supplies** card backed by existing vial/equipment records: dynamic groups, three columns at supported widths, single inline expansion with connected outline, textual breakdown, More and View All navigation.
- Supplies → Inventory overview with search, filters, expandable total summary, category stock cards, grouped summaries before items, Overview / Items / Usage History / Notes, item detail and source links.
- BAC grouping by arbitrary nominal volume, actual remaining volume, opened state/date and existing expiry controls.
- Empty/filled cartridges with custom capacity, source compound, concentration, source vial, fill date, volume and remaining mg.
- Reconstitution records connect compound and BAC vials. Transfer records conserve compound quantity between source and cartridge. Duplicate operation IDs and excessive withdrawals are rejected. Stock transfers and other stock usage do not become completed injections.
- Inventory deletion archives records and retains traceability. Archive/restore, duplicate vial, expiry/discard, edit and injection recording remain available.
- Plan/entry compound identity. Non-retatrutide records are excluded from the Reta mathematical model and Reta planned projection. Legacy untagged records retain their prior retatrutide interpretation.
- Updated version and expandable Settings description, including structured promotional descriptions of the new functionality.

## Files changed

New runtime files: `app/src/main/assets/inventory224.js`, `app224.js`, `inventory224.css`.

Updated: `app.js` (atomic injection compound/opened metadata), `app18.js` (supply identity/storage metadata), `app214.js` (plan identity, preserved phase editing, compound forecast/projection), `release221.js` (version and structured feature description), `index.html`, `app/build.gradle`, `build-direct.sh`.

New tests: `tests/inventory224.cjs`, `tests/inventory224-dom.cjs`, `tests/inventory224-ui.cjs`. Synthetic fixture: `tests/fixture224.json`.

## Models and migration

Existing root schema 2 and `uxV2.version = 1` remain. Inventory operations add the versioned `uxV2.inventoryVersion = 2` extension and `inventoryEvents`; missing fields on older records remain readable. Existing `vials` and `uxV2.equipment` remain the sources of truth.

Optional vial metadata: capacityMl, substance, concentration, reconstitution, stockMovements, sourceVialId, filledAt, cartridgeState, addedAt, storage and deletedAt. Existing openedAt/usedMl/mg/volume fields are reused. Equipment initialQuantity is captured on usage when absent. Plans gain name/compound, occurrences and entries gain compound.

No database reset or rewriting of historical injections is performed by migration. Mutations use the existing validated save transaction and Undo. Transfers are subtracted once from source balances, and actual injections once from their selected container.

## Passed checks

- Existing core tests: forecast, PK model, CSV, historical supply balances, supply isolation, weight aggregation, units, BAC deadlines, original-record preservation, UX V2 backup roundtrip and equipment validation.
- Existing supply aggregation/expiry/archive tests.
- Existing Plan tests: four weekly occurrences in four weeks; eight unequal-dose split occurrences; every-X-days schedule; multi-phase totals.
- New inventory domain tests: additive extension, BAC deduction, 10 mg / 2 mL → 1.5 mL / 7.5 mg transfer, source remainder, duplicate rejection, independent actual injection deduction, overdraw rejection, archived-source protection, backup and compound isolation.
- New DOM integration tests load the complete application and exercise Today expansion, navigation, reconstitution, transfer, injection logging, other usage, traceable deletion, custom cartridges, compound supply creation, plan creation/editing, accordion collapse, search, Calculator, Learn, theme state and backup reload without runtime errors.
- Optical estimator tests pass for synthetic rates and reject flat/noisy/short/interrupted signals. This is not clinical validation.
- Android Java compilation, resources, dex generation, APK alignment and signing succeeded.
- APK signature v2/v3 verified. Signing certificate matches 2.0.23; package name remains hr.mentalblue.retadnevnik, minSdk 26 and targetSdk 35.

## Remaining verification limitations

The full Playwright visual test is included but could not run: this execution session blocks local socket creation required by Chromium (process_singleton_posix socket error). Therefore screenshot comparison, actual 360/412px and landscape rendering, keyboard overlap, large-font accessibility, light/dark visual fidelity and exact connected-outline geometry are **not verified**. DOM checks do not substitute for those checks.

No physical Android device is attached. Install/upgrade behaviour, camera contact detection on the S23 Ultra, tactile feedback, notification delivery and device-specific layout still require on-device testing. The existing native pulse/haptics implementation was preserved, not physically revalidated.

The new illustrations are code-rendered medical glass/vector assets; exact visual equivalence to the supplied rendered reference art is not asserted. This build is ready for device review; full visual acceptance remains outstanding.
