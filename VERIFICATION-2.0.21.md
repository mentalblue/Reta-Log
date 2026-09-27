# Reta Log 2.0.21

- Fixed Quick Add switching back to one column at <=375 px. Browser assertions verify two columns at 320, 360, 375, 384 and 412 px without horizontal overflow.
- Settings now shows the installed package version via the Android bridge, with an accessible More/Less disclosure for release changes and app capabilities. Removed outdated version labels in Settings, About and backup metadata.
- Increased native pulse feedback from 18 ms / amplitude 65 to 40 ms / device default amplitude with explicit sonification usage. Feedback begins after consistent optical peak intervals. Duplicate peak candidates no longer reset the beat train. No-contact frames clear the signal.
- Completed camera measurements are held in memory until Save reading. Don't save and closing the sheet discard the pending result. Save is guarded against duplicates.
- Passed Quick Add / installed-version disclosure regression; pulse no-contact rejection, 72 bpm signal, haptic callbacks, save-once and discard checks; existing navigation, Journal, model and Plan regressions.
- Native Java compilation and APK v2/v3 signature verification passed. Version 2.0.21 / code 48.

No physical Android device was attached. Actual camera quality and tactile strength remain device checks; simulated frame tests do not establish clinical accuracy.
