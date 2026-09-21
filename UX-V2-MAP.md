# Reta Log 2.0 — CURRENT → UX Architecture V2

Baseline: 1.9.0 / versionCode 26 / commit 65e6d33. Classic must retain its renderers and routes. UX V2 is enabled only by settings.design=new.

## Audit
Java Activity hosts local HTML/JS/CSS in WebView. No Compose, ViewModels or SQL database exists. S is the shared schema-2 record store, persisted atomically through Native.saveStore; browser tests use localStorage. Core modules own calculations, validation, dose balances and imports. app16/17/173/18 progressively extend the original renderers. design19 is presentation only. Native bridges own Health Connect, calendar read/preview, files, biometric/device credential lock, private reminders and immersive bars. No backend/login/cloud sync. Existing activity, standalone note and equipment-count records do not exist.

## Mapping
| Current route/components | V2 destination | Reuse |
|---|---|---|
| overview, weightHome, estimateHome, targetTile | Today | Current weight/model/target calculations; compact summaries and relevant actions |
| journal, wellness, dailyHistory, measurements, feelings, circumferences | Journal | One chronology, local date picker/week strip and filters; existing edit/delete/Undo flows |
| insights, progressPanel, forecastPanel | Progress / Overview | Existing baseline, weekly/monthly change, projection |
| weightChartMarkup, bodyHistory, circumferenceCard | Progress / Body | Existing interactive chart, all original body metrics and circumference history |
| pk-chart, weeklyCard, doseWindowCard, half | Progress / Reta | Existing model, layers, dose markers, weekly history, model settings |
| nutritionCard, hydration/protein logs | Progress / Nutrition | Existing target math; observed daily totals and adherence |
| new optional manual activity records | Progress / Activity | Logged workouts, durations, steps; no fabricated Health Connect integration |
| inventory, calculator, learn | Supplies / Inventory, Calculator, Learn | All existing forms, balances, expiry/thresholds, category reorder and illustrations |
| profile, dailySettings, editProteinRange | You / Goals, Health Data | Same edit forms and settings; optional target body fat |
| data, import18, summary | You / Connections | Native imports/previews/duplicates, backups, export, reports |
| settings, reminders, legal | You / Settings and secondary routes | Appearance, units, biometrics, device credential fallback, notifications and legal |
| quickLog | Global + | Existing entry forms; optional manual activity/note forms |

## Risks and decisions
- Keep legacy files/renderers intact: captured delegates run unchanged in Classic; add app20.js/design20.css instead of rewriting old layers.
- Route aliases redirect only New design. Preserve Android Back, per-tab scroll and chart range/layer state through rerender and fullscreen.
- All existing store arrays, IDs, formulas, importer and Java integrations unchanged. Optional records use additive uxV2 extension version 1, validated and included in backup/restore; absent extension requires no migration/write.
- Optional activity/notes/equipment record arrays use existing transaction/Undo infrastructure. Count equipment remains separate from drug mg and water mL.
- No actual injection dates inferred from reminders; only explicitly planned records displayed as plans.
- Retain legacy code for Classic and shared form/chart reuse. Consolidate user-visible routes, not business logic.
- Build and sign with the existing certificate; never include private key/user CSV in source archive.
- Native permission/device smoke tests require a real Android device; browser bridge mocks cannot certify them.
