# Reta Log 2.0.15 verification

## Pulse estimate changes

- The camera measurement starts by tapping the heart; the separate Start button is removed.
- Instructions now explain fingertip placement over the rear camera and flashlight, steady contact and the expected 30–45 second duration.
- The live trace is drawn from optical camera samples and is labeled as an optical signal, not an ECG.
- Estimation checks red, green and blue channels, accepts lower central skin coverage, and retains rejection of flat, noisy, interrupted and unstable signals.
- Camera frames remain local and are discarded. Only an accepted estimate is added to the existing Journal measurement list.

## Checks completed

- `node tests/pulse210.cjs`: passed 7 synthetic pulse rates, flat/noisy/short/interrupted rejection, low-amplitude multi-channel recovery and bounded trace output.
- Other non-browser JavaScript test files: passed.
- Direct Android build: passed; package `hr.mentalblue.retadnevnik`, versionCode 42 / versionName 2.0.15.
- `apksigner verify`: passed with APK Signature Scheme v2 and v3.
- `zipalign -c -v 4`: passed.

## Device validation still needed

No physical Android phone, especially the user's Samsung, was connected to this build session. The camera stream, torch behavior, fingertip signal quality and measured result need confirmation on-device. The Playwright screen test was updated for the tap-heart interaction, but could not run because no Chromium executable is installed in the session. The camera value is an informational optical estimate and has not been clinically validated.
