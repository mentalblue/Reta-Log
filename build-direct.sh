#!/usr/bin/env bash
set -euo pipefail
# Direct build alternative; supply Android 35 platform, Build Tools 35 and ECJ.
: "${RETA_ANDROID_JAR:?Set RETA_ANDROID_JAR}"
: "${RETA_BUILD_TOOLS:?Set RETA_BUILD_TOOLS}"
: "${RETA_ECJ_JAR:?Set RETA_ECJ_JAR}"
project_dir="$(cd "$(dirname "$0")" && pwd)"
build_dir="$project_dir/build-direct"
mkdir -p "$build_dir/classes" "$build_dir/dex"
java -jar "$RETA_ECJ_JAR" -8 -nowarn -bootclasspath "$RETA_ANDROID_JAR:$RETA_BUILD_TOOLS/core-lambda-stubs.jar" -d "$build_dir/classes" "$project_dir"/app/src/main/java/hr/mentalblue/retadnevnik/*.java
python3 - "$project_dir" "$build_dir" <<'PY'
import pathlib,sys
p,b=map(pathlib.Path,sys.argv[1:])
s=(p/'app/src/main/AndroidManifest.xml').read_text().replace('<manifest ', '<manifest package="hr.mentalblue.retadnevnik" ',1)
(b/'AndroidManifest.xml').write_text(s)
PY
"$RETA_BUILD_TOOLS/aapt2" compile --dir "$project_dir/app/src/main/res" -o "$build_dir/resources.zip"
"$RETA_BUILD_TOOLS/aapt2" link -o "$build_dir/resources.apk" --manifest "$build_dir/AndroidManifest.xml" -I "$RETA_ANDROID_JAR" --min-sdk-version 26 --target-sdk-version 35 --version-code 28 --version-name 2.0.1 -A "$project_dir/app/src/main/assets" "$build_dir/resources.zip"
mapfile -t class_files < <(find "$build_dir/classes" -name '*.class')
"$RETA_BUILD_TOOLS/d8" --min-api 26 --lib "$RETA_ANDROID_JAR" --output "$build_dir/dex" "${class_files[@]}"
python3 - "$build_dir" <<'PY'
import pathlib,sys,zipfile,shutil
b=pathlib.Path(sys.argv[1]);shutil.copy(b/'resources.apk',b/'unsigned.apk')
with zipfile.ZipFile(b/'unsigned.apk','a') as z:
 for f in (b/'dex').glob('*.dex'):z.write(f,f.name)
PY
"$RETA_BUILD_TOOLS/zipalign" -f -p 4 "$build_dir/unsigned.apk" "$build_dir/aligned.apk"
"$RETA_BUILD_TOOLS/apksigner" sign --ks "${RETA_KEYSTORE:?Set RETA_KEYSTORE to your private signing key}" --ks-key-alias "${RETA_KEY_ALIAS:?Set RETA_KEY_ALIAS}" --ks-pass env:RETA_KEYSTORE_PASSWORD --key-pass env:RETA_KEY_PASSWORD --out "$build_dir/Reta-Log-2.0.1.apk" "$build_dir/aligned.apk"
"$RETA_BUILD_TOOLS/apksigner" verify --verbose "$build_dir/Reta-Log-2.0.1.apk"
