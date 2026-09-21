# Reta Log 1.9.0 — New design

## Isporuka

Android paket `hr.mentalblue.retadnevnik`, verzija **1.9.0**, versionCode **26**. Polazna verzija: 1.8.0 (Git commit `04a7749`).

Uključivanje: **Profile → Settings → Compare designs → New design**. Isključivanje vraća Classic. Postavka se pamti nakon ponovnog pokretanja. Oba prikaza koriste iste zapise.

## Implementirano

- Izolirani vizualni sustav u `design19.css`, isključivo unutar `body.new-design`; postojeći raspored, redoslijed kartica, navigacijske rute i funkcije ostaju.
- Svijetle satin površine i tamne navy površine, plavo–indigo–ljubičasti gradijenti.
- Sjaj, osvijetljeni rub i ambijentalna sjena na svakoj kartici. 3D dodatno pojačava dubinu i osvjetljenje. Sjaj ostaje prisutan i kad je 3D isključen.
- Hero kartice s izraženijim gradijentom; grafikoni imaju čistu unutarnju podlogu i sjaj na rubovima.
- Lokalno uključen Manrope font s OFL licencom i sistemskim fallbackom; tabularne brojke.
- Ujednačene kartice, gumbi, filteri, inputi, modali, statusi i donja navigacija. Semantički statusi ostaju zeleni, jantarni i crveni.
- Plavo–indigo zadani akcent i paleta za New design s prilagodbom kontrasta. Classic akcent čuva se odvojeno. Nova postavka `settings.newAccent` utječe samo na prezentaciju.
- Vektorske ilustracije RET/BAC bočica, pena i cartridgea s gradijentima stakla, metalnim odsjajem i sjenom. Dekorativne su i ne mijenjaju kontrole ni podatke.
- Ažurirane oznake verzije i metapodaci backupa. Poslovna logika, CSV, izračuni, native integracije i shema podataka nisu mijenjani.

Aplikacija ostaje u postojećoj Java/WebView arhitekturi. Ovo nije migracija na Jetpack Compose. Reusable vizualne komponente implementirane su kroz postojeće HTML renderere i zajedničke CSS tokene, što omogućuje kasnije preslikavanje na Compose.

## Promijenjene datoteke

- Novo: `app/src/main/assets/design19.css`, `design19.js`.
- Novo: `app/src/main/assets/fonts/Manrope.ttf`, `fonts/OFL.txt`.
- Novo: `tests/design19-ui.cjs`, `DESIGN-SYSTEM-1.9.md`, ovaj izvještaj.
- Povezivanje: `app/src/main/assets/index.html`.
- Verzija: `app/build.gradle`, `build-direct.sh`, `app.js`, `app17.js`, `app18.js`, `README.md`.

## Provedene provjere

**Prošlo:**

- `tests/design19-ui.cjs`: 11 ruta × 2 teme × 3 širine (320, 412, 915 px); bez horizontalnog prelijevanja, svi navigacijski gumbi u jednom redu.
- Učitavanje lokalnog Manrope fonta; različite sjene 3D on/off; sjaj prisutan u oba stanja; promjena akcenta; otvaranje forme unosa.
- Klik na stvarni New design checkbox, povrat na Classic, ponovno uključivanje i reload. Zapisi doza, zaliha, mjerenja, vode i proteina ostaju jednaki.
- Pixel usporedba početnog Classic ekrana s uključenim i isključenim novim CSS-om, u obje teme: jednaka slika.
- Vizualni pregled screenshotova Today, Supplies i Progress u novom izgledu.
- `core.test.js`, `v16.test.cjs`, `v17.test.cjs`, `v18.test.cjs`: postojeći izračuni, inventar, ciljevi, migracije, rokovi i jedinice.
- `csv-generic.cjs`: postojeći opći CSV formati.
- `eufy-import.test.cjs` sa stvarnim privatnim CSV-om: 338 timestampova, automatsko mapiranje, očuvanje izvornih mjerenja i zaštita od ponovnog uvoza.
- `v18-ui.cjs`: CRUD vode/proteina/check-ina/doza, stanje grafikona, inventar, jedinice, import, postavke.
- Android Java/DEX/resources build; APK potpis v2/v3; provjerena verzija, paket i pakiranje novih asseta.
- Certifikat isti kao 1.8.0: `b3fd33d2f2cff5254d17c37a5a384ce42b68fdaec820056dabdf56c8bc2dab2b`.

**Ograničenja:** browser provjere provedene su u Chromiumu. APK nije pokrenut na fizičkom Samsung uređaju ni Android emulatoru; native dozvole, sistemske geste i stvarna nadogradnja na telefonu nisu time potvrđeni.

Privatni Eufy CSV, ključevi i korisnička baza nisu uključeni u izvorni ZIP. APK je potpisan istim ključem radi nadogradnje postojeće 1.8 instalacije; instalirati preko postojeće aplikacije. Prebacivanje dizajna ne zahtijeva deinstalaciju.
