# Reta Log 2.0.16 — regression repair

## Cause and changes

An undefined `extendNeverPlans214()` call ran before every application render. It prevented all navigation renders, the refresh after saving a pulse, and the confirmation after saving a plan. Removed this unfinished render hook. Existing generated schedules and saved records are retained; no storage schema or camera estimator change was made.

Weekly slot fields now update their draft without replacing focused DOM elements. Add/remove operations restore the wizard body's scroll offset, rather than only the outer sheet offset. Removed the duplicate weeks input. Weekly time is collected into the saved slot. Task detail text now shares the status size and accent. The plan confirmation displays its circular check, count, total, next injection, view/reminder actions and Done button. Restored Quick Add shortcuts hidden by the plan adapter. Detached Journal date-strip callbacks cannot change the selected date after leaving Journal.

## Executed verification

- Syntax checks for every JavaScript asset: passed.
- All non-browser test files: passed (model, CSV, inventory, backup validation, pulse signal rejection/recovery and schedule generation).
- `tests/today210.cjs` in Chromium: passed; ten theme/width combinations, pulse permission/cancel/save/Journal/chart flow and step refresh.
- `tests/fixes216.cjs` in Chromium: passed with no page errors. Includes complete application startup, clicks on all five navigation destinations, Settings and back, Explore model canvas, simulated camera frames through the real estimator and save transaction, one pulse record, current card and Journal display, persistence after reload, Custom day/time/dose edits retaining DOM and scroll, add/remove slot scroll retention, single weeks display, four-week plan generating four 17:15 occurrences, confirmation with four injections and 6 mg, view plan, persistence after reload, original completed injection preserved, navigation with an active plan, four reminder timestamps sent to a mocked native bridge, landscape and dark/light layouts at 360/412/600 px.
- Confirmation and task screenshots inspected in both themes.
- Full direct Android build succeeded, versionCode 43 / versionName 2.0.16.

## Limits

Browser tests execute the packaged HTML/JavaScript and mock the native bridge. A physical Samsung was not connected. Android notification delivery, actual camera hardware and installation over the user's private data were not exercised. The APK uses the same signing key as 2.0.15; no reset or destructive migration was introduced.
