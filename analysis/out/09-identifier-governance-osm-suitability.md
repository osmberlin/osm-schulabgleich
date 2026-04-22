# JedeSchule Identifier Governance And OSM Suitability (Final Synthesis)

**Purpose:** Evaluate whether JedeSchule identifiers can be used as stable unique references for OpenStreetMap school linkage, per Bundesland.

**Generated (UTC):** 2026-04-19T10:15:00Z

## Inputs Used

- Part 1 (scripted CSV metrics): `analysis/out/07-identifier-csv-coverage.md`
- Part 2 (static code/docs extraction): `analysis/out/08-identifier-sources-static-analysis.md`
- Web enrichment (authority/process context), including:
  - [Hamburg schools dataset/API](https://api.hamburg.de/datasets/v1/schulen)
  - [NRW Open Data (school ministry)](https://www.schulministerium.nrw/open-data)
  - [Saxony school API docs](https://schuldatenbank.sachsen.de/docs/api.html)
  - [Thuringia school-number system explainer](https://www.schulstatistik-thueringen.de/html/themen/schulen/schulnummern-thueringen.html)
  - [BW school/service search](https://lobw.kultus-bw.de/didsuche/)
  - [Saarland schools OAF view](https://geoportal.saarland.de/spatial-objects/257/collections/Staatliche_Dienste:Schulen_SL/items?f=html)
  - [Berlin school master data (BSN)](https://www.bildungsstatistik.berlin.de/statistik/ListGen/schuldaten_a.aspx)
  - [Bavaria WFS capabilities](https://gdiserv.bayern.de/srv112940/services/schulstandortebayern-wfs?SERVICE=WFS&REQUEST=GetCapabilities)

## Executive Takeaways

- CSV-level availability is very high: 55,134 of 55,135 rows have non-empty identifier suffixes.
- Structural presence is not equal to semantic stability:
  - `BW`: 81.8% currently use `BW-UUID-*` fallback in the CSV snapshot (reimport-sensitive by design).
  - `SL`: source currently exposes a `Schulkennz` field in web view, but scraper uses `OBJECTID`; this should be considered high risk for long-term reference stability.
  - `ST`: identifier is derived from ArcGIS `OBJECTID`, documented as potentially unstable on data reimport.
- Best OSM strategy is state-specific confidence classes, not one uniform national rule.

## Per-State Governance, Stability, OSM Recommendation

| State | JedeSchule suffix source | Responsible authority (best available evidence) | Process/ownership evidence | Stability risk | OSM recommendation |
| --- | --- | --- | --- | --- | --- |
| BW | DISCH / FB / FBA / UUID chain | Baden-Wuerttemberg Kultus domain data owners | BW didsuche references Dienststellenschluessel and ministry-provided address data | Medium-High (current heavy UUID fallback share) | Use with constraints; prefer DISCH-backed IDs where possible |
| BY | WFS `gml:id` | Bayerisches Staatsministerium fuer Unterricht und Kultus | WFS capabilities exposes provider and contact; id appears service-technical | Medium-High | Use with constraints; monitor churn across updates |
| BE | `bsn` (Berliner Schulnummer) | Senatsverwaltung fuer Bildung, Jugend und Familie | Berlin school master table prominently keyed by BSN | Low-Medium | Suitable as canonical reference candidate |
| BB | `schul_nr` | MBJS Brandenburg / Brandenburg school portal owners | Internal scraper/docs are clear; external process docs less explicit | Medium | Suitable with periodic validation |
| HB | page `id`/SNR | Senatorin/Senator fuer Kinder und Bildung Bremen | Bremen school search uses sorting/search by school number | Medium | Suitable with periodic validation |
| HH | `schul_id` | Behorde fuer Schule und Berufsbildung (data owner), LGV API provider | Hamburg dataset explicitly documents school number and responsible provider | Low-Medium | Suitable as canonical reference candidate |
| HE | `school_no` (Dienststellennummer) | Hessen school DB / HMKB ecosystem | Hessen school DB workflow indicates central maintenance of core data | Medium | Suitable with periodic validation |
| MV | `dstnr` | MV education administration and geodata providers | Internal docs/code indicate direct source ID usage; limited explicit public governance detail | Medium | Suitable with constraints (watch for ID format anomalies) |
| NI | `schulnr` | Niedersachsen NIBIS/NLQ ecosystem | NIBIS is central portal; explicit governance of identifier lifecycle not clearly documented publicly | Medium | Suitable with periodic validation |
| NW | `Schulnummer` | Ministerium fuer Schule und Bildung NRW | NRW Open Data explicitly links many datasets through Schulnummer | Low-Medium | Suitable as canonical reference candidate |
| RP | `Schulnummer` | RLP school DB and school administration stack | RLP school DB supports search by Schulnummer | Medium | Suitable with periodic validation |
| SL | `OBJECTID` (scraper); `Schulkennz` visible in source web layer | Saarland geoportal data owner | OAF view shows both OBJECTID and Schulkennz, implying a better domain identifier may exist than OBJECTID | High | Not suitable as sole canonical key in current scraper implementation |
| SN | API `id` | Saxony school database operators | Public API docs show stable school endpoints and institutional key concepts | Low-Medium | Suitable as canonical reference candidate |
| ST | ArcGIS `OBJECTID` (formatted `ARCxxxxx`) | Sachsen-Anhalt statistics/geodata publisher | OBJECTID commonly tied to feature table row identity, not guaranteed permanent business key | High | Not suitable as sole canonical key |
| SH | source `id` from SH schools export | SH open data + IQSH/school administration ecosystem | Internal scraper uses direct `id`; public governance wording on lifecycle is sparse | Medium | Suitable with constraints until lifecycle evidence is stronger |
| TH | `Schulnummer` | Thueringen school/statistics administration | Public school-number ranges and logic are documented by school statistics portal | Low-Medium | Suitable as canonical reference candidate |

## Confidence Notes

- **Higher confidence:** BE, HH, NW, SN, TH (clear identifier semantics and/or explicit official data governance clues).
- **Medium confidence:** BB, HB, HE, MV, NI, RP, SH (usable IDs, but incomplete public lifecycle guarantees).
- **Lower confidence / red flags:** BW (current UUID-heavy share), BY (service identifier semantics), SL and ST (`OBJECTID`-driven).

## OSM Decision Framework

- **Use as canonical now:** BE, HH, NW, SN, TH.
- **Use with safeguards:** BB, HB, HE, MV, NI, RP, SH, BY, BW.
- **Do not use as sole canonical key (current pipeline):** SL, ST.

## Practical Next Steps For OSM Matching

- Introduce per-state policy in matching:
  - allow strict `ref` confidence for canonical states,
  - require secondary checks (name/address/distance) for constrained states,
  - avoid sole-key assertions for SL/ST.
- For `BW`, prefer DISCH when available and treat UUID fallback IDs as potentially volatile.
- For `SL`, evaluate switching scraper key from `OBJECTID` to `Schulkennz` where non-colliding and present.
- Add longitudinal churn monitoring: compare ID sets across refreshes per state and alert on abnormal replacement rates.
