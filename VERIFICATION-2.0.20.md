# Reta Log 2.0.20 verification

- Quick Add uses a dedicated CSS grid with two cards per row at 412 px and a one-column fallback below 376 px. The browser test checks row placement, equal card widths, labels, icons, selected accent and existing entry behavior.
- Heart-rate UI restores the Camera2 thumbnail inside a clipped heart; native preview frames update it, and the heart turns red only while native fingertip contact is detected. The optical waveform is compact and gridded.
- Native Camera2 contact classification checks a large, warm red fingertip region, red channel dominance, brightness and low spatial luminance variation. A no-contact frame resets the signal buffer and the JS estimator does not calculate a BPM or haptic beat without contact.
- The estimator requires a stable optical signal across multiple windows. Native `pulseTick()` vibrates briefly on validated repeated optical peaks; the Android manifest requests `VIBRATE`.
- Automated browser regression simulates ambient flicker with no contact and confirms no saved measurement and no haptic callbacks; then it simulates a stable 72 bpm camera PPG stream and checks one saved result and beat-synchronized haptic callbacks. Also verifies selected accent in dark/light themes and the camera preview binding.
- Build uses Android platform 35, compiles Java, aligns/signs the APK, and verifies package metadata and signature.

Physical camera contact and vibration still require final confirmation on the target handset; automated tests exercise representative camera frames and the native bridge without a physical camera.
