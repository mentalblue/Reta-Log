# Reta Log 2.0.1 — UX Architecture V2

Paket: `hr.mentalblue.retadnevnik` · versionCode **28**. Polazište: 1.9.0, commit `65e6d33`. Nova arhitektura uključuje se samo kroz **New design**. Postojeći izbor izgleda zadržava se pri nadogradnji.

## Što je promijenjeno

Postojeća aplikacija je Java/WebView, s lokalnim JSON spremištem schema 2. Nema Compose komponenti, ViewModela, SQL baze ni autentifikacijskog backenda. Problem je bio raspored: analitika, unosi, konfiguracija i alati bili su pomiješani, uz više odvojenih prikaza povijesti. V2 objedinjuje pristup tim funkcijama, koristeći postojeće obrasce, računanje i transakcije.

| Prije | UX V2 |
|---|---|
| Overview i Today kartice | Today: trenutna težina, promjena od početka praćenja, označena modelska procjena, dnevni ciljevi i relevantne aktivnosti/upozorenja |
| Journal, Daily Records, pojedinačne povijesti | Journal: zajednička kronologija, kalendarski odabir dana, dan u tjednu, filtri, Details/Edit/Delete/Undo |
| Insights i statističke kartice | Progress: Overview / Body / Reta / Nutrition / Activity |
| Model settings u Settings | Progress → Reta |
| Inventory, Calculator, Learn | Supplies: Inventory / Calculator / Learn |
| Profile, Data, Settings | You: Goals / Health Data / Connections / Settings |
| Različiti gumbi za unos | Globalni + Quick Add, dostupan iz svih glavnih odredišta |

+ je zasebni plutajući gumb iznad navigacije: ostaje točno pet odredišta i čitljivi nazivi. Grafovi, uvoz i unos koriste postojeće implementacije. Skupne kategorije inventara sada se mogu otvoriti unutar sažetka, a svaki spremnik ostaje dostupan u svojoj kategoriji.

## Status zahtjeva

| Područje | Status | Dokaz ili ograničenje |
|---|---|---|
| Pet odredišta i globalni Quick Add | Done | Provjereni klikovi, stvarni obrasci svih osam vrsta unosa |
| Today i jasan ESTIMATED/MODEL prikaz | Done | Postojeća matematička funkcija, stvarno posljednje mjerenje, dnevni ciljevi, samo eksplicitno planirane injekcije |
| Journal i objedinjena povijest | Done | Izvorni zapisi bez kopiranja između filtara; odabir datuma i tjedna; uređivanje, potvrda brisanja, Undo |
| Progress i postojeće statistike | Done | Svih pet sekcija; tjedne/mjesečne promjene, projekcija cilja, dani i ukupni mg, povijest doza i model |
| Body i uvezeni parametri | Done | Svi postojeći Core.metricNames parametri, izvorni zapisi, 7D/14D/30D/90D/All, dodatni pomični prosjek, opsezi i lijeva/desna strana |
| Reta graf | Done | Izvorni interaktivni graf, slojevi, označene doze, peak/trough, težina na desnoj osi, vremenski raspon, zoom/pan/fullscreen |
| Nutrition | Done | Postojeće formule i makro ciljevi neizmijenjeni; stvarno uneseni protein/voda i udio zabilježenih dana koji dosežu trenutačni cilj |
| Activity | Partial | Stvarni ručni unosi aktivnosti, minuta i koraka, zbrojevi i aktivni dani. Health Connect import aktivnosti nije postojao i nije dodan |
| Supplies i odvojeni mg/mL/komadi | Done | Postojeći inventar, izračun ostatka, BAC pravila, pragovi, preuređivanje kategorija, zasebna oprema i Undo |
| Calculator i Learn | Done | Postojeći kalkulator i vodiči; dodana izričita U-100/U-40 pretvorba volumena i prilagođeni prikaz kapaciteta; nema univerzalnih pen-click tvrdnji |
| You, ciljevi, postavke, izvještaji | Done | Postojeći obrasci i integracije dostupni; dodatni cilj masnog tkiva; Classic preuređivanje kartica ostaje dostupno kao Classic postavka |
| Eufy/CSV | Done | Stvarni privatni izvoz: 338 vremenskih zapisa, sva polja, mapiranje i ponovni uvoz bez duplikata |
| Health Connect i Calendar | Partial | Native kod i postojeći rasponi/preview ostali; simulirani Health Connect rezultat provjeren u browseru. Dozvole i stvarni davatelji podataka nisu testirani na telefonu |
| Podsjetnici | Partial | Postojeći privatni ručno postavljeni sistemski podsjetnici zadržani. Novi automatski alarmi za sve ciljeve/niske zalihe nisu implementirani; upozorenja su unutar aplikacije |
| Biometrija i uređajni PIN fallback | Partial | Postojeća native implementacija zadržana; povratni događaj osvježava You → Settings. Stvarno otključavanje zahtijeva uređaj |
| Login / cloud sync | Izvan opsega | Prethodno je izričito dogovoreno zanemariti login; nema lažnih ekrana prijave ni tvrdnje o sinkronizaciji |
| Classic | Done | Pixel usporedba 11 ekrana × dvije teme jednaka 1.9.0; normalizirana je samo oznaka verzije |
| APK | Done | Java/DEX/resources build, APK potpis v2/v3, isti paket i certifikat kao 1.9.0 |

## Podaci i kompatibilnost

Nijedna postojeća lista, ID, vrijeme mjerenja, izvorna vrijednost ni veza s inventarom nije migrirana, očišćena ili resetirana. Model, formule proteina, makroi, projekcija težine, konverzije postojećih jedinica i importeri su neizmijenjeni.

Dodaci su opcionalni: `uxV2: {version: 1, activity?: [], notes?: [], equipment?: []}` te `profile.targetFat`. Nastaju tek pri spremanju novog podatka; nema obveznog zapisa migracije pri otvaranju. Proširenje se validira, sprema kroz postojeći `change/persist` i ulazi u potpuni backup/restore. Aktivnosti i bilješke ulaze i u tekstualne/PDF izvještaje. Klasični prikaz ne prikazuje te nove vrste zapisa, ali ih ne briše: ponovno uključivanje New design vraća njihov prikaz.

Pomični prosjek i pokazatelji pridržavanja ciljeva jesu izvedeni prikazi. Nisu novi izvorni zdravstveni zapisi. Dani bez unosa nisu proglašeni danima bez unosa hrane/vode. Planirane doze ne troše zalihu.

## Promijenjene datoteke i zadržani kod

- Novo: `app20.js` — UX V2 rute, sekcije i adapteri; `design20.css` — isključivo `body.new-design`; `core20.js` — validacija opcionalnog proširenja.
- Novo: `UX-V2-MAP.md`, četiri V2 testa, ovaj izvještaj.
- `index.html` učitava nove module nakon postojećih.
- `app.js`, `app17.js`, `app18.js`: oznake verzije. U `app18.js` dodan je mali uvjet koji u V2 sprječava da BAC timer očisti nespremljeni unos kalkulatora. Classic nastavlja istu putanju.
- `app/build.gradle`, `build-direct.sh`: 2.0.1 / 27. `README.md`: upute i ograničenja.
- Java integracije, `core.js/core16.js/core17.js/core18.js`, uvoz i izvorni stilovi nisu mijenjani.
- Stari rendereri ostaju jer ih koristi Classic i jer novi prikaz preuzima postojeće funkcionalne dijelove. Uklonjeno je dupliciranje korisničkih odredišta u New design; nije brisan radni kod radi kozmetike.

## Stvarno provedene provjere

- `core.test.js`, `v16.test.cjs`, `v17.test.cjs`, `v18.test.cjs`, `csv-generic.cjs`: postojeći izračuni, inventar, granice ciljeva, BAC rokovi, jedinice, datumi i CSV.
- `v20-core.cjs`: stari store bez proširenja, backup round-trip, validacija ID-jeva/datuma/količina i odbijanje nevaljanog proširenja.
- `v20-ui.cjs`: 14 prikaza × light/dark × 320/412/915 px, bez horizontalnog prelijevanja; pet navigacijskih odredišta; osam Quick Add obrazaca; objedinjena povijest i filtri; novi zapisi; injekcija Edit/Delete/Undo i preostali mg; oprema/Undo; kalkulator; preview i deduplikacija Health Connect rezultata; potvrđeni restore; stanje grafikona; promjena dizajna i ponovno učitavanje.
- `v20-classic.cjs`: 11 ruta × light/dark, usporedba sa stvarnim 1.9.0 assetima. Jednaki pikseli uz normalizaciju oznake verzije.
- `v20-edge.cjs`: svi prazni prikazi, odabrani dan za unos, uvećani browser layout, nespremljeni kalkulator nakon BAC refresh događaja, native lock callback za You postavke.
- `eufy-import.test.cjs`: stvarni privatni CSV sa 338 zapisa; testni uvoz ostao je u izoliranom browseru. Privatni CSV nije uključen u paket izvornog koda.
- Vizualno pregledani light/dark prikazi, uključujući Today, Progress/Reta, You i Supplies.
- Android paket: uspješan compile Java → DEX, resursi, zipalign i provjera potpisa v2/v3.

## Build i instalacija

APK: **Reta-Log-2.0.1.apk**, versionCode **28**, Android 8+ (API 26), target/compile 35.

Certifikat SHA-256: `b3fd33d2f2cff5254d17c37a5a384ce42b68fdaec820056dabdf56c8bc2dab2b` — isti kao 1.9.0. Namijenjen je instalaciji preko postojeće aplikacije. Ne treba deinstalirati aplikaciju za promjenu dizajna. Izvorni ZIP nema ključ potpisa, build direktorije, Git povijest s ranijom konfiguracijom ni privatne zdravstvene podatke.

Povratak na Classic radi unutar ove iste instalacije i ne mijenja podatke. Instalacija starijeg APK-a nije postupak vraćanja dizajna; Android obično blokira niži versionCode, a stariji UI ne poznaje nove aktivnosti/bilješke/opremu. Kompatibilnost obrade novog backupa starim binarnim verzijama nije potvrđena.

## Preostale provjere i ograničenja

APK nije pokrenut na fizičkom S23 Ultra ni emulatoru. Stvarna nadogradnja, Android dozvole, Health Connect/Calendar davatelji, native PDF, obavijesti, biometrija i OEM sistemske geste zahtijevaju provjeru na telefonu. Browser testovi i uspješan build nisu zamjena za to.

Podtabovi, Back, pozicije i stanje grafikona pamte se unutar otvorene sesije; nakon potpunog ponovnog pokretanja aplikacija počinje na Today. Podaci i postavke se trajno čuvaju. Browser provjera uvećanja nije potvrda svih Android veličina fonta.

Nema novih medicinskih preporuka, automatskog rasporeda doziranja, dijagnoza, cloud sinkronizacije ni nepostojećih mjerenja koncentracije.
