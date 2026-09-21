# Reta Log 2.0.1 — peptide background update

The generated vertical peptide/molecular wallpaper is included as `app/src/main/assets/peptide-background.png` and applied only by `design20.css` when the **New design** option is enabled.

Dark New design uses a navy transparency gradient over the image: it remains visible at the top, fades through the dashboard and leaves the lower reading area dark. Light New design uses a much stronger pale overlay. Cards, charts, navigation, controls and all data remain above it; chart cards still use their existing clean opaque chart surface. `prefers-reduced-motion` changes the attachment from fixed to scrolling.

Classic stays byte-independent from this image: `style.css`, `style18.css`, `design19.css` and legacy renderers do not reference it. The user can return to Classic through the existing design switch.

## Checks

- `tests/background20.cjs`: source asset exists and is larger than 1 MiB; New-design-only CSS references are present; Classic stylesheet references are absent.
- `tests/v20-core.cjs`: prior UX V2 store extension validation and backup round-trip remain passing.
- `node --check app/src/main/assets/app20.js`: passed.
- `./gradlew assembleDebug --no-daemon`: could not start because this runtime no longer has cached Gradle and outbound access to `services.gradle.org` is unavailable. The temporary Android SDK/build tools and Chromium runtime used for 2.0.0 were also unavailable, so 2.0.1 APK/build and visual browser verification are pending the restored build environment.

The source archive contains no signing key, build folders or personal health data.
