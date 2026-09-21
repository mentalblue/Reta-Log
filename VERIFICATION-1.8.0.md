# Reta Log 1.8.0 — izvještaj o implementaciji i provjerama

Datum: 21. rujna 2026. Polazna verzija: **1.7.5 / 24**. Izdanje: **1.8.0 / 25**. Paket: `hr.mentalblue.retadnevnik`. Pohrana: JSON **schema 2**, proširen dodatnim poljima bez brisanja izvornih zapisa.

**Classic / New design ostaje dostupan. Login je preskočen prema izričitoj uputi korisnika.**

## Zaštita početnog stanja

Izvorni projekt je pregledan; nije zamijenjen novim predloškom. Početni kod sačuvan je u Gitu kao `v1.7.5-baseline` (`74d9a4e`), a rad je odvojen na `feature/action-plan-1.8`. Postoje dodatni checkpointi podataka, sučelja i nativnih integracija.

Podaci na korisnikovu telefonu nisu dostupni ovom razvojnom okruženju niti su ovdje mijenjani. Zaštita stvarne instalacije zahtijeva izvoz backupa u aplikaciji prije nadogradnje. Testovi nadogradnje i povrata provedeni su na testnim podacima. Privatni Eufy CSV korišten je samo za provjeru uvoza; nije uključen u APK ni izvorni ZIP.

## Status zahtjeva

`Done` označava implementirano ponašanje s navedenom provjerom. `Partial` označava preostalu provjeru ili ograničenje; nije tvrdnja da je nativni dio ispitan na telefonu.

| Zahtjev | Status | Rezultat / dokaz |
| --- | --- | --- |
| Početno stanje, grana, verzija i očuvanje podataka | Done | Git baseline; aditivna proširenja; testovi migracije i backupa. |
| Classic / New design | Done | Trajan prekidač u Settings → Compare designs; isti zapisi; browser test reload-a. |
| Dark/light, 3D on/off i kontrast | Done | Različite sjene, rubovi i osvjetljenje; pregled snimaka i usporedba izračunatih stilova. |
| Novi donji meni i pristup kalkulatoru | Done | Today / Journal / Progress / Supplies / Profile; kalkulator u Supplies i toolkitu; jedna vrsta gumba u jednom redu. |
| Today raspored i Arrange cards | Done | Doze, uparene Weight/Supplies, uparene Hydration/Protein, Check-in, toolkit; postojeći šestotočkasti drag ostaje. |
| Uski zaslon i landscape | Done | Chromium 320×740, 412×915, 915×412; bez horizontalnog overflowa; nav tipke u jednom redu. |
| Stvarni Samsung S23 Ultra i povećani sistemski font | Partial | Dodano čitanje fontScale, WebView text zoom i slaganje kartica; fizički telefon nije bio dostupan za potvrdu. |
| Proteinski raspon i midpoint | Done | Zajednička funkcija: ciljna kg × koeficijenti, ručni raspon, precizna sredina; stari prehrambeni cilj sačuvan odvojeno. |
| Statusi proteina i hidratacije | Done | Granice 75% i 100%, neograničen prikaz stvarnog unosa, ispuna najviše 100%, točan ostatak. |
| Pohvala jednom na dan | Done | Spremljen identitet dana i vrste cilja; test ponovljenog prelaska / izmjene bez dvostrukih zapisa. |
| Hydration 300 mL i opcionalno logiranje | Done | Brzi unos 250/300/500 mL; postojeći ručni cilj i prekidači; pretvorba unosa u US fl oz bez promjene kanonske pohrane. |
| Check-in Edit / Cancel | Done | Save čuva isti ID; Cancel ništa ne mijenja; browser test. |
| Journal filtri, Edit / Delete i potvrda | Done | Doze, voda, proteini i osjećaji; potvrda datuma/količine; obračun sažetaka nakon brisanja. |
| Doza → zaliha / model | Done | Test 1 → 1,5 mg, odbijanje prekoračenja, brisanje vraća 10 mg; ne pogađa se bočica. |
| Inventory ilustracije, kategorije, kapaciteti i redoslijed | Done | RET/BAC/pen/cartridge, sačuvano grupiranje kapaciteta i spremanje redoslijeda. |
| Low pragovi | Done | Podesivi mg prag (početno 3), zaseban opcionalni mL prag; istek ima prioritet. |
| BAC otvaranje, raniji rok i rub isteka | Done | Otvaranje kao datum ili timestamp; 28 dana samo uz potvrđeni multidose; raniji tvornički rok; test 29.9.09:59 / 10:00. |
| BAC blokiranje uporabe i discarded | Done | Nova potrošnja istekle/nepotvrđene vode odbijena; discard zaseban od used, povijest ostaje. |
| BAC osvježavanje | Done | Pri povratku u aplikaciju, periodično i timerom na rok; odluka pri spremanju koristi trenutačno vrijeme. |
| Health Connect rasponi i prikaz svih strategija | Done | All available / Date range, uključivi lokalni dani; Latest/Lowest/Average ne brišu raw zapise. |
| Health Connect novi/promijenjeni/preskočeni | Done | Trajni izvorni ID, pregled promjena, eksplicitna potvrda prepisivanja; test zadržavanja lokalne vrijednosti bez potvrde. |
| Health Connect stvarni servis i dozvole | Partial | Java se kompilira. Nisu izvedeni stvarni Android pozivi. Ograničenja povijesti i djelomični rezultati ostaju vidljivi. |
| Calendar Last N / range / keywords / review | Done | Cijeli lokalni dani, validacija N, granice riječi, eksplicitni Show all; bez doze → Needs review. |
| Calendar duplikati, promjene i povezivanje zalihe | Done | ID kalendara/događaja/izvorne pojave; pregled update-a; nema automatske veze s bočicom. Test ponovnog uvoza i premještenog jednokratnog događaja. |
| Calendar stvarni provider i iznimke ponavljanja | Partial | Implementirani provider upit i original occurrence metadata; potrebna potvrda na uređaju s konkretnim kalendarom. |
| Grafikoni 7D / 14D / legenda | Done | Nova otvaranja počinju s 7D; legenda i checkboxovi dijele stanje; sve isključeno prikazuje poruku. |
| Fullscreen zadržava zoom i serije | Done | Browser test 14D i ugašene težine pri ulasku/izlasku. Rotacija više ne resetira izabrani način. |
| Android immersive i izrez kamere | Partial | Nativni WindowInsetsController, privremene sistemske geste i cutout insets implementirani; potrebna fizička provjera. |
| Model settings | Done | Kompaktan unos i Save; pozitivna konačna vrijednost; objašnjenje ostaje modelsko. |
| Current weight i 7-dnevni mini prikaz | Done | Zadnje stvarno vrijeme mjerenja; stari naknadni import ne vraća težinu unatrag; prvi ručni profil sprema datirano mjerenje. |
| Circumferences, strane i trend | Done | Izvorne mjere sačuvane, opcionalna lijeva/desna strana, povijest i jednostavan trend s točnim zapisima. |
| Learn i slike | Done | Naslov → postojeća ilustracija → tekst; objašnjeni gauge, duljina i potreba provjere kompatibilnosti. Slike su ilustracije, ne potvrđeni modeli. |
| Metric/Imperial, datumi, izvještaji | Partial | Glavni unosi, kartice, grafovi i tekst/PDF sadržaj koriste preference; kanonski podaci bez drifta. Starije nutritivne formule zadržavaju eksplicitne g/kg i kg reference, a nativni date-picker prati platformu. PDF izgled nije ispitan na Androidu. |
| Eufy CSV | Done | Stvarna datoteka: 21 stupac, svih 338 timestampova valjano, 338 spremljenih redaka, ponovni uvoz ostaje na 338. |
| Ostali CSV formati | Done | Test odvojenog datuma/vremena kroz UI, DMY/MDY, ISO, zarez/točka, navodnici, delimiters i lb konverzija. |
| Login / cloud | Done — izuzeto | Namjerno preskočeno po korisnikovoj uputi; nema lažne prijave ni automatske sinkronizacije. |
| APK i izvorni ZIP | Done | Izgrađen i potpisan APK; ZIP bez ključa, privatnih podataka i build direktorija. |

## Eufy: uzrok i popravak

Izvorni problem bila je klasifikacija stupca prema riječi `Time` bez prepoznavanja da uzorak već sadrži cijeli datum. Posljedično je validator vidio samo zasebno vrijeme i zahtijevao datum. Automatsko mapiranje sada razmatra naziv i uzorke, prepoznaje timestamp te prihvaća Date **ili** Timestamp. ISO ne koristi DMY/MDY birač. Stroža provjera sprječava tiho pretvaranje nepostojećeg datuma poput 30. veljače.

`WATER` se mapira u postotak vode. Dodana su polja za udjele mišića/kostiju i ostale podatke stvarnog izvoza. Identitet uvoza uključuje izvor, profil, timestamp i mjerenja; ponovni isti uvoz ne udvostručuje retke. Izvorne retke ne zamjenjuju dnevni sažeci.

Datoteka sadrži više obiteljskih profila. Njihova oznaka ostaje u importiranim zapisima; postojeće polje za filtriranje točnog profila dostupno je pri mapiranju. Ako se uvezu svi profili, aplikacija ih smatra dijelom istog lokalnog skupa; ovo izdanje ne uvodi odvojene korisničke račune.

## Provedene provjere

- `core.test.js`, `v16.test.cjs`, `v17.test.cjs`: postojeći izračuni, inventar, tjedni, prehrambeni izračuni i validacija prošli.
- `v18.test.cjs`: pragovi 95/96/127/128/176/180, BAC rubni rokovi, Latest/Lowest/Average, očuvanje izvornika, kg/lb povratna pretvorba, rasponi kroz DST u Europe/Zagreb, parsiranje kalendarske doze i obračun zalihe prošli.
- `csv-generic.cjs`: nepovezani CSV formati prošli.
- `v18-ui.cjs`: CRUD proteina/vode/check-ina/doze, odbijanje nedovoljne zalihe, BAC istek/discard, fullscreen stanje, sve skrivene serije, strane mjera, imperial unos, konflikti Health Connecta, CSV UI i kalendarski duplikati prošli.
- `eufy-import.test.cjs` sa stvarnim privatnim CSV-om: 338/338 timestampova, automatsko mapiranje, sva izvorna mjerenja i drugi uvoz bez novih redaka prošli.
- Ranija regresijska provjera `v173-ui.cjs`: kategorije inventara, Low, drag redoslijed, obrasci, mjere, backup i čista podloga grafova prošli nakon početnog proširenja.
- Vizualno pregledane snimke novog svijetlog/tamnog prikaza; otklonjeno rezanje oznaka navigacije i presvijetli linkovi.
- Java/DEX/resources build uspješan; APK v2/v3 potpis valjan, package i versionCode provjereni.

Nije testirano na fizičkom Androidu ni emulatoru. Nativni provider upiti, stvarno ponašanje dozvola, biometrije, obavijesti, izvoza PDF-a i sistemskih gesti zato se ne smatraju potvrđenima.

## Potpis i povratak

SHA-256 certifikata 1.8.0 jednak je certifikatu 1.7.5:

`b3fd33d2f2cff5254d17c37a5a384ce42b68fdaec820056dabdf56c8bc2dab2b`

To omogućuje nadogradnju iste instalacije potpisane tim ključem. Ne preporučuje se deinstalacija radi nadogradnje. Izvorni ZIP ne sadrži privatni ključ; za buduću kompatibilnu izgradnju potreban je isti zasebno čuvan ključ.

Za usporedbu izgleda koristite prekidač. Za stvarni povrat na staru aplikaciju sačuvajte backup **prije** nadogradnje: novi timestampovi otvaranja i bočne mjere nisu zajamčeno prihvatljivi starijem validatoru. Stari kod i nova baza nisu automatski kompatibilni. Nije obećano da su sve povijesne verzije trajno dostupne.

## Glavne izmijenjene datoteke

`core18.js`, `core17.js`, `core.js`: modeli, validacija i datumi. `app18.js`, `import18.js`, `style18.css`, `index.html`: novi prikaz, CRUD, ciljevi, inventar, uvozi i grafovi. `app.js`, `app16.js`, `app17.js`, `app173.js`: povezivanje s postojećim funkcijama. `MainActivity.java`, `HealthReader.java`, `ReportSummary.java`: Android rasponi, immersive i izvještaji. Build konfiguracija, README i testovi ažurirani.

## Provjereni izvori

- [CDC: multidose vials](https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html) — rok nakon prvog otvaranja i prednost ranijeg tvorničkog isteka.
- [ISSN: protein and exercise](https://link.springer.com/article/10.1186/s12970-017-0177-8) — kontekst prehrane; ne predstavlja potvrdu individualnog target-weight preseta.
- [Android: immersive mode](https://developer.android.com/develop/ui/views/layout/immersive) — sistemske trake i privremeno vraćanje gestom.
- [Android: Calendar Instances](https://developer.android.com/reference/android/provider/CalendarContract.Instances) i [EventsColumns](https://developer.android.com/reference/android/provider/CalendarContract.EventsColumns) — identitet izvorne pojave ponavljanja.
