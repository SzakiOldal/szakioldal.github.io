# SzakiOldal

Modern weboldalak magyar szakipari vállalkozásoknak — víz-gáz-fűtés-,
villany-, klíma- és burkolászakembereknek.

**Élő oldal:** https://szakioldal.github.io/

## A projektről

Statikus HTML/CSS/vanilla-JS oldal, build lépés nélkül. Nincs framework,
nincs bundler — a fájlok közvetlenül GitHub Pages-re publikálódnak a
`main` ágról.

```
index.html              Főoldal
adatkezeles.html         Adatkezelési tájékoztató
aszf.html                Általános Szerződési Feltételek
impresszum.html          Impresszum
404.html                 Egyedi 404 oldal
css/                      Stíluslapok (tokens, base, components, szekciónkénti fájlok)
js/                       ES modulok (js/main.js az egyetlen betöltött <script type="module">)
fonts/                    Önhosztolt betűtípus-alkészletek (Manrope, Inter, JetBrains Mono)
demo-vizgazfutes/         Balogh Víz-Gáz-Fűtés — önálló, kitalált bemutató oldal
demo-villanyszerelo/      Fázis Villany — önálló, kitalált bemutató oldal
demo-klima/               Szellő Klíma — önálló, kitalált bemutató oldal
demo-burkolas/            FORMA Burkolás — önálló, kitalált bemutató oldal
tools/                    Fejlesztői segédeszközök (nem része az élő oldalnak)
```

A négy `demo-*` mappa mindegyike egy önmagában is működő, önálló HTML fájl
(inline CSS/JS) — kitalált vállalkozásokat mutat be, ezt minden demó
lábléce és a `noindex` meta is jelzi.

## Helyi futtatás

Nincs build lépés — bármilyen statikus fájlszerver megteszi:

```bash
python -m http.server 8000
```

## Fejlesztői eszközök

- `tools/assets/` — az og-image és a favicon generálásának forrása
  (lásd az ottani README-t)
- `.github/workflows/` — HTML-validálás, link-ellenőrzés és alap
  füst-tesztek minden push-nál, mielőtt a Pages publikálja az oldalt

## Jogi

A tulajdonos jelenleg magánszemélyként, bejegyzett vállalkozás nélkül
üzemelteti az oldalt — lásd [impresszum.html](impresszum.html).
