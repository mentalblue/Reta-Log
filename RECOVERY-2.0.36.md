# Reta Log 2.0.36 — recovery and verification status

## Provenance

The app assets were extracted directly from the supplied `Reta-Log-2.0.35.apk` (SHA-256 `904995cf6da765ed0c80079f76394003e4d47b847d66400fcd8237a50cc2115e`). The Android project and Java source were recovered from the saved 2.0.32 source archive. The APK's `classes.dex` matches the 2.0.32 APK byte-for-byte; Android manifest and resources differ because of version metadata. The resulting source is thus based on the actual 2.0.35 app assets and the native code used to build the earlier APK.

All 2.0.35 assets, including `inventory233.js`, `inventory233.css`, `today233.css` and the 2.0.35 `app233.js`, remain in the recovered project. Inventory lifecycle corrections are applied in `inventory224.js`, `app224.js`, `inventory229.css` and the separately loaded `app236.js`.

## What was checked

- Every script referenced by `index.html` exists, and every JavaScript asset passes `node --check`.
- `inventory-lifecycle233.cjs`, `inventory224.cjs` and `plan214.cjs` pass.
- The lifecycle test checks BAC water depletion, source restrictions, vial-to-cartridge transfer, exhausted stock, alphabetical sorting and neutral colours for counted supplies.

## APK for device testing

An APK was rebuilt by replacing the web assets inside the supplied 2.0.35 APK, retaining the unchanged `classes.dex`, incrementing the binary manifest to versionName 2.0.36/versionCode 63 and signing the resulting APK with the same certificate as 2.0.35. `tools/repackage_android.py` contains the local packaging/signing procedure; the private signing key is not bundled with the source ZIP.

APK signature scheme v2 content digest and RSA signature were checked. For independent confirmation, the digest parser was applied to the supplied 2.0.35 APK and matched its existing Android v2 digest too. ZIP CRC, the presence of app236.js, and modified manifest metadata passed local checks.

## What remains unverified

DOM tests could not run because jsdom is unavailable. The Android UI, installation on a physical phone and inventory flows have not been exercised on a device. Android SDK/Build Tools were not available; this is an asset-level repackage of the native-equivalent APK with v2 signing, not a fresh Android Gradle compile.
