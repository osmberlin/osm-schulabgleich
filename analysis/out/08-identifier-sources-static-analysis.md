# JedeSchule Identifier Sources (Static Code+Docs Analysis)

**Method:** LLM-assisted static analysis of repository docs and source code (no runtime aggregation).

**Primary sources:**

- `jedeschule-scraper/README.md` (state-level ID source and stability notes)
- `jedeschule-scraper/jedeschule/spiders/*.py` (actual ID construction per spider)
- `jedeschule-scraper/jedeschule/fallback_school_id.py` (BW fallback generation)
- `jedeschule-api/app/main.py`, `jedeschule-api/app/schemas.py`, `jedeschule-api/app/models.py` (API/DB identifier semantics)
- `osm-schul-abgleich/src/lib/stateConfig.ts` and `osm-schul-abgleich/src/lib/bundeslandOfficialSources.ts`

**Generated (UTC):** 2026-04-19T10:15:00Z

## API And Data Model Context

- Canonical public school key is `id` and is used as API object identity (`/schools/{school_id}`) and DB primary key.
- `state_key` is modeled as optional metadata about the scraper Land feed and is documented as aligned with Bundesland code vocabulary, but the practical split logic in the OSM matching app still relies on the `id` prefix.
- In the matching app, Bundesland is derived from `id` prefix via `stateCodeFromSchoolId()` and not from API `state_key`.

## Per-Bundesland Identifier Mapping (from code/docs)

| State | JedeSchule ID pattern                                                | Upstream source attribute                                                | Scraper code evidence                                                     | Stability assessment from repo evidence                                                                  | Responsible authority hint (internal source table)          |
| ----- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| BW    | `BW-{DISCH}` preferred; fallback `BW-FB-`_, `BW-FBA-_`, `BW-UUID-\*` | DISCH from email domain, else deterministic hash fallback, else WFS UUID | `baden_wuerttemberg.py`, `fallback_school_id.py`, README ID table         | Mixed: DISCH likely stable; FB/FBA stable if core fields unchanged; UUID fallback can drift on re-import | Kultus BW school/service search (`lobw.kultus-bw.de`)       |
| BY    | `BY-{gml:id}`                                                        | WFS feature `@gml:id`                                                    | `bayern.py` + README note                                                 | Unlikely stable (repo note explicitly uncertain)                                                         | Bayerisches Kultusministerium / Bayern geodata WFS endpoint |
| BE    | `BE-{bsn}`                                                           | WFS field `bsn` (Berliner Schulnummer)                                   | `berlin.py` + README                                                      | Likely stable                                                                                            | Berlin data portal / education administration source        |
| BB    | `BB-{schul_nr}`                                                      | WFS field `schul_nr`                                                     | `brandenburg.py` + README                                                 | Likely stable                                                                                            | Brandenburg MBJS / EduGIS source                            |
| HB    | `HB-{id}`                                                            | Detail-page query param `id` (repo docs: equals SNR)                     | `bremen.py` + README                                                      | Likely stable                                                                                            | Bremen education portal source                              |
| HH    | `HH-{schul_id}`                                                      | API/WFS field `schul_id`                                                 | `hamburg.py` + README                                                     | Likely stable                                                                                            | Hamburg schools dataset/API source                          |
| HE    | `HE-{school_no}`                                                     | Detail-page URL query param `school_no`                                  | `hessen.py` + README                                                      | Likely stable                                                                                            | Hessen school DB source                                     |
| MV    | `MV-{dstnr}`                                                         | WFS field `dstnr`                                                        | `mecklenburg_vorpommern.py` + README                                      | Likely stable                                                                                            | MV geodata / school administration source                   |
| NI    | `NI-{schulnr}`                                                       | JSON details field `schulnr`                                             | `niedersachsen.py` + README                                               | Likely stable                                                                                            | NIBIS school search source                                  |
| NW    | `NW-{Schulnummer}`                                                   | CSV column `Schulnummer`                                                 | `nordrhein_westfalen.py` + README                                         | Likely stable                                                                                            | NRW Open Data (school ministry)                             |
| RP    | `RP-{Schulnummer}`                                                   | Detail page field `Schulnummer`                                          | `rheinland_pfalz.py` + README                                             | Likely stable                                                                                            | RLP school database source                                  |
| SL    | `SL-{OBJECTID}`                                                      | WFS field `OBJECTID`                                                     | `saarland.py` + README                                                    | Not stable (confirmed in repo note; no better alternative available)                                     | Saarland geoportal WFS source                               |
| SN    | `SN-{id}`                                                            | API field `id`                                                           | `sachsen.py` + README                                                     | Likely stable                                                                                            | Saxony school database API                                  |
| ST    | `ST-ARC{OBJECTID}`                                                   | ArcGIS `OBJECTID` (formatted/padded)                                     | `sachsen_anhalt.py` + README                                              | Unlikely stable on re-import (repo note)                                                                 | Sachsen-Anhalt ArcGIS/statistics dataset source             |
| SH    | `SH-{id}`                                                            | TSV/CSV field `id`                                                       | `schleswig_holstein.py` (README ID table does not explicitly list SH row) | Undocumented in README; code suggests direct source id usage, stability unknown from internal docs       | SH open data schools dataset                                |
| TH    | `TH-{Schulnummer}`                                                   | WFS field `Schulnummer`                                                  | `thueringen.py` + README                                                  | Likely stable                                                                                            | Thueringen school portal/WFS source                         |

## Identifier Stability Classes (Repository Evidence Only)

- **Strong internal confidence:** BE, BB, HB, HH, HE, MV, NI, NW, RP, SN, TH.
- **Conditional/implementation-dependent:** BW (high variance due fallback chain).
- **Known weak:** SL, ST.
- **Insufficiently documented internally:** SH (code has source attribute, but README stability row missing).

## OSM-Relevant Interpretation From Static Evidence

- `id` is technically present and consistently prefixed for all states in the scraper design.
- Semantic quality of the suffix differs strongly by state: official school numbers are generally better than transport-layer feature identifiers (`OBJECTID`, mutable WFS IDs).
- For OSM cross-time referencing, state-specific reliability policy is required; a single national blanket assumption would be risky.
