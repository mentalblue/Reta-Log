# Reta Log 2.0.26 — Plan i Inventory

Verzija APK-a: **2.0.26**, build **53**. Temelj je postojeći projekt 2.0.25 iz ove sesije; stari priloženi 2.0.1 nije prepisao novije funkcionalnosti.

## Implementirano

### Planovi
- Backspace u poljima za unos više ne pokreće povratak. Escape i povratak izvan polja ostaju navigacijske radnje.
- Trajno brisanje plana uz potvrdu. Definicija plana i nedovršene planirane pojave uklanjaju se bez arhiviranja plana.
- Dovršeni zapisi injekcija ostaju identični. Zadržavaju samo povezanu dovršenu pojavu s nazivom izbrisanog plana radi integriteta stare poveznice, bez aktivne definicije plana.
- Brisanje uklanja povezane podsjetnike. Uređivanje osvježava datume postojećeg podsjetnika.
- Zaštita od ponovljenog spremanja i od stvaranja jednakog aktivnog rasporeda. Postojeći mogući duplikati označeni su u upravljanju; korisnik bira koji će obrisati.
- Izričit početni i završni datum, uključiv završni dan, odabir dana/vremena/doza u koraku Schedule i datumi u pregledu.
- Status prikaza: Scheduled prije početka, Active unutar razdoblja, Completed nakon završetka, odnosno Ended/Cancelled nakon ručnog završavanja. Više paralelnih planova ostaje podržano.
- Kalendarske granice tjedana i redoslijed doza usklađeni su za vremensku zonu i ograničenje brojem pojava.
- Pregled i spremanje računaju iste buduće pojave; uređivanje ne duplicira već dovršenu pojavu.

### Inventory
- Jedinstven naziv Inventory na Today, stranici zaliha i navigaciji novog dizajna.
- Vrste: peptide vial, BAC water vial, syringe, pen needle, disposable pen, reusable pen i cartridge. Postojeći ostali artikli ostaju dostupni radi očuvanja podataka.
- Šprice imaju proizvoljnu zapreminu i broj komada; pen igle broj komada, gauge i duljinu.
- Disposable pen ima kapacitet i stvarni preostali volumen u mL; ručni Log usage smanjuje volumen. Ne izmišlja se koncentracija niti sadržaj peptida iz samog volumena pena.
- Svaki reusable pen zaseban je artikl: naziv, boja i kompatibilan kapacitet cartridgea. Postavljanje, zamjena i uklanjanje cartridgea bilježe se u povijesti.
- Jedan cartridge može biti postavljen u samo jedan pen. Neusklađeni kapaciteti se odbijaju.
- Poveznica pena vidljiva je u detaljima cartridgea i oznaci cartridgea pri bilježenju injekcije.
- Cartridge ima odvojenu ilustraciju uskog staklenog cilindra s klipom, stanje empty/unopened ili filled/depleted, kapacitet i sadržaj.
- Punjenje čuva izvornu bočicu peptida, BAC bočicu i pripadajuće mg/mL. Postojeća logika rekonstitucije/prijenosa zadržava jednokratno smanjenje izvora i matematičku koncentraciju.

### Izgled
- Filteri su kratke oznake u zaobljenim gumbima koji se prelamaju u uredne redove. Gumbi se ne skupljaju ispod širine teksta.
- Total summary prikazuje naziv lijevo, količinu desno u istom redu.
- Kraći nazivi na Today karticama, jasnije jedinice i raspodjela prostora.
- Spojen okvir odabrane kartice i donjih detalja, uključujući uklanjanje zaobljenja na vanjskom spoju.
- Posebne SVG ilustracije za cartridge i pen; dosljedne ikone plana i inventara s odabranim akcentom.
- Settings prikazuje verziju APK-a i proširen opis novih funkcionalnosti.

## Podaci i datoteke

- Inventory proširenje ima verziju **3**; verzija 2 i stari zapisi ostaju čitljivi. Nema resetiranja baze.
- Titration ostaje u postojećem spremištu. Validacija dopušta dovršenu pojavu odvojenu od izbrisane definicije plana, samo ako postoji dovršeni zapis koji se na nju odnosi.
- Glavne promjene: app214.js, app224.js, inventory224.js, core20.js, core21.js, index.html, release221.js; novi domain226.js, app226.js, inventory226.css.
- Build metapodaci: app/build.gradle i build-direct.sh.
- Novi test: tests/fixes226.cjs. Izvoz pregleda: tests/export226.cjs i tests/render-preview226.py.

## Provedene provjere

- `tests/fixes226.cjs` u Europe/Zagreb: Backspace bez navigacije, uključiv raspon datuma i osam različitih tjednih doza, zaštita od duplikata, čuvanje stvarne povijesti pri uređivanju i brisanju, brisanje svih nedovršenih pojava i podsjetnika, dimenzije artikala, potrošnja disposable pena u mL, BAC i peptide izvori cartridgea, postavljanje/zamjena pena, zabrana dvostrukog postavljanja, validacija spremljenih podataka, filteri i renderiranje obje teme. PROLAZI.
- `tests/inventory224-dom.cjs`: startup cijele aplikacije, Today kartice, inline detalji, navigacija, rekonstitucija, prijenos, jedna stvarna injekcija i odbitak, povijest, uređivanje/brisanje artikala, planovi, pretraga, Calculator, Learn i ponovno učitavanje podataka. PROLAZI.
- `tests/inventory224.cjs`: migracija bez gubitka povijesti, očuvanje količina, sprečavanje ponavljanja prijenosa i negativnog stanja, izdvajanje drugih spojeva iz Reta modela. PROLAZI.
- `tests/plan214.cjs` u Europe/Zagreb: četiri tjedne injekcije, osam split doza, različite doze, Every X Days, tri faze i zbrojevi. PROLAZI.
- Java kompilacija, Android resursi, DEX, APK pakiranje i potpis. PROLAZI.
- Potvrđena verzija 53 / 2.0.26, min SDK 26 i target SDK 35. V2/V3 potpis valjan; certifikat odgovara APK-u 2.0.25.

## Što nije potvrđeno na uređaju

Chromium se ne može pokrenuti u ovom okruženju (`socket() failed: Operation not permitted`), a Android uređaj/emulator nije priključen. DOM testovi potvrđuju ponašanje i strukturu, ali nisu dokaz izgleda, dodira ili tipkovnice na Samsungu S23 Ultra. Fizička kamera i haptika nisu ponovno testirane niti izmijenjene ovom verzijom.

**Nije potvrđena 100% vizualna podudarnost na Androidu.** Priloženi PNG je jasno označen statički pregled iz produkcijskog HTML/CSS-a s oglednim podacima, renderiran WeasyPrintom uz zamjenu button elemenata u div i SVG boja radi kompatibilnosti. Ne sadrži izmjene visine kartica za potrebe slike. To nije screenshot instaliranog APK-a. HTML pregledi sadrže produkcijske stilove, bez aktivnih akcija za mijenjanje podataka.
