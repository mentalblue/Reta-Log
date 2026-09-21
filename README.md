# Reta Log 2.0.1

Offline Android journal. Package `hr.mentalblue.retadnevnik`, versionCode **28**, additive JSON store **schema 2**. Android 8+; native Health Connect requires Android 14+.

## UX Architecture V2

Enable **Profile → Appearance & privacy → Compare designs → New design**. In V2 use **You → Settings → Compare designs** to return to Classic. The previously saved design choice is retained on upgrade; Classic remains the default for a new installation.

Five destinations: **Today · Journal · Progress · Supplies · You**. A floating global **+** opens Quick Add without crowding the five navigation targets.

- Today: latest timestamped weight, journey change, explicit model estimate, daily protein/hydration, activity and relevant plans/warnings.
- Journal: unified original doses, body readings, protein, water, check-ins, circumferences, activities and notes; date picker/week selector, type filters, details, edits, confirmed deletion and Undo.
- Progress: Overview / Body / Reta / Nutrition / Activity. Existing charts and all model math reused; body metrics, 7-day moving average, circumference history, recorded adherence, manual activity totals. Model settings live in Reta.
- Supplies: Inventory / Calculator / Learn. Existing containers/expiry/accounting preserved; optional count-based equipment separate from mg/mL. Calculator adds explicit U-100/U-40 marked-unit conversion and custom illustrated capacity.
- You: Goals / Health Data / Connections / Settings. All existing imports/previews, backups, reports, appearance, units, private reminders and device security remain accessible.

Local manual activities, notes and equipment use an **optional `uxV2.version=1` schema-2 extension**. No original records, IDs, units, importer or calculations are rewritten. Opening V2 does not create extension records. Target body fat is an optional profile value. Backup and restore include the extension.

Classic retains its original rendering and routes, except for the release version label. The new modules delegate to the existing forms, charts and transaction/Undo code. See **UX-V2-MAP.md** and **VERIFICATION-2.0.1.md**.

Login and cloud sync remain intentionally out of scope by prior request. Activities and steps are manual; no Health Connect activity import is claimed. Inventory/BAC warnings are in-app; existing user-created native reminders remain available.

## 2.0.1 update

New design now includes a built-in peptide/molecular wallpaper with an adaptive dark/light overlay. Classic does not load or reference this background.

## Build

Android Studio / Gradle: JDK 17, Android SDK 35, AGP 8.7.3. Run `./gradlew assembleDebug` for a development build. A newly generated debug key cannot update an installation signed with the existing key.

For compatible updates, provide your existing private key through environment variables; never commit it:

```text
RETA_KEYSTORE=/absolute/path/to/private-signing-key
RETA_KEY_ALIAS=your-alias
RETA_KEYSTORE_PASSWORD=your-password
RETA_KEY_PASSWORD=your-key-password
```

The direct build used for this release additionally requires:

```text
RETA_ANDROID_JAR=/absolute/path/to/android-35/android.jar
RETA_BUILD_TOOLS=/absolute/path/to/build-tools/35.0.0
RETA_ECJ_JAR=/absolute/path/to/ecj.jar
```

Run `bash build-direct.sh`. Output: `build-direct/Reta-Log-2.0.1.apk`. The private signing key is excluded from this GitHub-ready ZIP. Keep it separately for future compatible updates.

## Tests

```bash
node tests/core.test.js
node tests/v16.test.cjs
node tests/v17.test.cjs
node tests/v18.test.cjs
node tests/csv-generic.cjs
node tests/v20-core.cjs
```

Browser tests use Playwright. Set `CODEX_PRIMARY_RUNTIME_NODE_MODULES` to a node_modules directory containing Playwright, and `RETA_CHROME` to Chromium, then run `node tests/v20-ui.cjs` and `node tests/v20-edge.cjs`. For `node tests/eufy-import.test.cjs`, set `RETA_EUFY_FIXTURE` to the private original 338-row CSV. That test explicitly skips if the file is absent. No real health measurements are included in this repository.

For pixel comparison with 1.9.0, set `RETA_BASELINE_ASSETS` to that version’s assets directory and run `node tests/v20-classic.cjs`. The test normalizes only the version label. **VERIFICATION-2.0.1.md** lists checks and device limitations; older verification files describe their respective releases.

## Backup and rollback

Before upgrading, use **Profile → Backups & calendar import → Export complete backup**. Keep that backup private. Install the APK over the existing app; do not uninstall for an upgrade.

Returning to Classic in 2.0.1 keeps all records, including V2 records (these remain accessible again when V2 is re-enabled and in full backups). Do not downgrade the APK to return to Classic. Older 1.9.0 UI cannot display the new activity/note/equipment extension; round-trip editing by older binaries is not certified. The design switch is reversible without changing the database. The original 1.7.5 code was checkpointed. Older app validation may reject new timestamp opening dates and side-specific circumferences. Keep a **pre-upgrade backup** for returning to the old app. Android normally blocks lower versionCodes; do not clear data or uninstall before preserving old and current backups. Reverting code is separate from reverting the live database.

## Limits

Actual Health Connect/calendar providers, OEM gesture bars, PDF rendering, notifications and biometrics require Android device verification. No emulator or physical phone was available. Data/UI logic was checked in Chromium; Java was compiled and APK signatures verified.

Health Connect history depends on permission and is limited to approximately 20,000 records per request. Calendar reads cap at 10,000 events and report partial results. Source deletions are not mirrored. Nothing is automatically uploaded.

Equipment images are generic AI illustrations, not product compatibility evidence. Legal notices remain drafts for this private build. Nutrition presets and model estimates are not treatment or dosing recommendations.
