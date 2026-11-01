# OSM Schulabgleich

Vergleicht pro Bundesland Schulstammdaten von [jedeschule.codefor.de](https://jedeschule.codefor.de) mit OSM (`amenity=school`, `education=school`, `amenity=college` und `education=college`; je **Knoten**, **Weg** und **Relation** in einem Overpass-Lauf mit `out meta geom`).

Die zentrale CSV kommt von [jedeschule.codefor.de](https://jedeschule.codefor.de) ([Projekt](https://codefor.de/projekte/jedeschule-2/), [csv-data](https://jedeschule.codefor.de/csv-data/)); die CI trennt **Daten-Refresh** und **Deploy**:

- `data-refresh.yml` lädt Daten nachts um **03:00 Europe/Berlin** und aktualisiert dabei **OSM und amtliche CSV in jedem Lauf**.
- `pages-deploy.yml` nutzt den letzten erfolgreichen Datensatz-Artefaktstand und deployt ohne frischen Download.

**Diagramme (Mermaid):** [Pipeline (Download → pro Land)](docs/pipeline.md) · [`matchSchools` (Abgleichslogik)](docs/match-schools.md)

## Daten-Pipeline (Download → Abgleich pro Bundesland)

Nach dem Download liegen die JedeSchule-CSV und das OSM-GeoJSON (nur für den Match-Schritt, unter `public/datasets/.pipeline/`, nicht im statischen Build). Der Abgleich läuft **pro Bundesland** (Gate → Dedupe → `matchSchools`) und schreibt direkt `public/datasets/{code}/…` sowie `summary.json`.

| Skript                         | Aufgabe                                                                                                                                                                                                                                              |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pipeline:download:jedeschule` | CSV laden → `jedeschule-latest.csv`, `jedeschule_stats.json`, `schools_official_de.meta.json`.                                                                                                                                                       |
| `pipeline:download:osm`        | Ein Overpass-Lauf für **Deutschland** → `.pipeline/schools_osm_de.geojson`, `schools_osm_de.meta.json`.                                                                                                                                              |
| `pipeline:download`            | Startet **beide** Downloads **parallel**; **Exit 1**, wenn eine Quelle fehlschlägt (`ok: false` in den Meta-JSONs).                                                                                                                                  |
| `pipeline:match`               | Abgleich aller Länder (**ohne** nationale Zwischendateien). **Nur** wenn JedeSchule- **und** OSM-Meta `ok: true` und CSV + `.pipeline`-OSM vorliegen, sonst Skip + `runs.jsonl`. `PIPELINE_FORCE_MATCH=1` erzwingt den Lauf mit vorhandenen Dateien. |
| `pipeline:split-lands`         | Entspricht `pipeline:match` (Alias; es gibt keinen separaten Split-Schritt mehr).                                                                                                                                                                    |
| `pipeline:rebuild`             | Nur Abgleich (**ohne** Downloads), analog `pipeline:match`.                                                                                                                                                                                          |
| `pipeline`                     | `pipeline:download` → `pipeline:rebuild` (z. B. CI).                                                                                                                                                                                                 |

```bash
bun run pipeline
```

CSV-URL: `scripts/lib/jedeschuleDumpConfig.ts`. Optional lokal: `public/datasets/jedeschule-latest.csv` (`.gitignore`). Meta in `schools_official_de.meta.json` u. a. `generatedAt`, HTTP-Header, SHA-256, `update_timestamp`, `upstreamDatasetChanged`.

Download-Orchestrierung: `Bun.spawn` (beide Quellen parallel); der Parent prüft danach beide Meta-Dateien.

### Abstandsprüfung gematchter Schulen

Für jede gematchte Zeile mit amtlichem Punkt wird der Abstand zum OSM-Schwerpunkt berechnet (`distanceMeters`, in allen Match-Modi). Die Pipeline bewertet ihn und speichert das Ergebnis als `distanceCheck.level` an der Zeile (`src/lib/matchDistanceCheck.ts`):

- `ok`: bis 400 m (oder kein Abstand). Das liegt über der Größe eines einzelnen Schulgeländes: Bei 99,9 % der OSM-Schulflächen (Wege) sind es höchstens 353 m vom Schwerpunkt zum Rand.
- `accepted`: über 400 m, aber die Zuordnung ist über `ref` eindeutig und das OSM-Objekt wurde höchstens 2 Jahre vor dem OSM-Snapshot zuletzt bearbeitet.
- `hint`: über 400 m bis 1 km, `error`: über 1 km.

Das Bearbeitungsdatum (`osmLastEditedAt`) kommt aus dem Overpass-Zeitstempel des Elements (`out meta geom`, als `_pipelineOsmTimestamp`). Andere Metadaten (Nutzer, UID, Changeset, Version) werden nicht gespeichert. Ältere gecachte GeoJSON-Stände ohne Zeitstempel gelten als „unbekannt“. Bezugszeit ist `overpassResponseTimestamp`, nicht die aktuelle Uhrzeit.

## Bundesland-Grenzen

Die vereinfachten Grenzen liegen unter `public/bundesland-boundaries/{code}.geojson` (**OpenStreetMap**).

## Entwicklung

```bash
bun install
bun run pipeline:download          # oder einzeln :jedeschule / :osm
bun run pipeline:rebuild
bun run dev
```

Wenn die Downloads schon passen und nur der Abgleich neu laufen soll:

```bash
bun run pipeline:rebuild
```

## Suchparameter (Query-String)

### Startseite (`/`)

- **`map`** (`?map=z/lat/lon`, wie bei openstreetmap.org): Router **`beforeLoad`** leitet auf das passende **`/bundesland/{code}`** um (wie bei **`?osm=`** technisch gleiches Muster: keine globale Client-Logik nötig).
- **`osm`:** OSM-Objekt als Freitext — z. B. `w93504889`, `way/93504889` oder Link von **openstreetmap.org** / **osm.org**. **`beforeLoad`** lädt die Position per **Overpass**, bestimmt das **Bundesland** und leitet zu **`/bundesland/{code}?map=z/lat/lon`** um (**`bbox`** wird nicht gesetzt). **`osm`** steht danach nicht mehr in der URL. Geht auch mit **`?osm=`** unter **`/bundesland/{code}`** (gleicher Redirect). Die **Lupen**-Suche in der Kopfzeile navigiert zu **`/?osm=…`** und löst denselben Ablauf aus.

### Bundesland-Übersicht (`/bundesland/{code}`)

- **`map`:** synchronisiert die **Kartenansicht** (Zoom und Mittelpunkt).
- **`bbox`** (`?bbox=west,south,east,north`): optionaler **Listenfilter** auf den Kartenausschnitt (Setzen/Löschen über die Karte).

## Qualität

```bash
bun run check
bun run test
bun run build
```

GitHub Actions:

- `.github/workflows/ci.yml`: PR-Verify (`check-ci` + Dependency Review).
- `.github/workflows/data-refresh.yml`: geplanter/manueller Daten-Refresh, schreibt `datasets-last-good` (Artifact).
- `.github/workflows/pages-deploy.yml`: Push-Deploy aus `datasets-last-good` + `pipeline:rebuild` + Pages-Deploy.
- `.github/workflows/maproulette-rebuild.yml`: MapRoulette-Aufgaben neu aufbauen **nur** nach einem vollen Refresh Datasets (sobald Pages die neuen Feeds veröffentlicht hat). Code-Push- oder manuelle Pages-Deploys werden übersprungen (klare Skip-Meldung im Action-Log); `workflow_dispatch` bleibt für einen manuellen Rebuild. **Pausiert:** MapRoulette hat API-Keys abgeschaltet, der automatische Trigger ist deaktiviert, bis es [Personal Access Tokens](https://github.com/maproulette/maproulette-backend/issues/1288) gibt; bis dahin werden die Kampagnen manuell auf maproulette.org aktualisiert.

## See also

- https://community.openstreetmap.org/t/art-der-schulen-uber-isced-level-school-oder-school-de/104643
