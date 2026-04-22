# JedeSchule Identifier Coverage from CSV (per Bundesland)

**Script:** `[analysis/scripts/jedeschule-identifier-csv-analysis.ts](../scripts/jedeschule-identifier-csv-analysis.ts)`

**Source:** `public/datasets/jedeschule-latest.csv`

**Generated (UTC):** 2026-04-19T10:15:00.382Z

## Scope

This report uses only the current JedeSchule CSV dump and inspects the `id` field quality by Bundesland.

### Metrics

- **usable identifier**: `id` has a non-empty suffix after `STATE-`.
- **parseable pattern**: `id` matches `<prefix>-<suffix>` with a non-empty prefix.
- **known state prefix**: prefix is one of the 16 configured Bundesland codes.
- **ASCII-safe suffix**: suffix uses `[A-Za-z0-9_-]` only (useful for stable transport and string matching).

## Overall


| Metric                                               | Value           |
| ---------------------------------------------------- | --------------- |
| Total schools in CSV                                 | 55135           |
| IDs with parseable `<prefix>-<suffix>` pattern       | 55135 (100.0 %) |
| IDs with known Bundesland prefix                     | 55135 (100.0 %) |
| IDs with usable non-empty suffix                     | 55134 (100.0 %) |
| Rows with unknown/invalid state prefix bucket (`??`) | 0               |


## Per Bundesland


| Code | Bundesland             | Total schools | Usable identifier | Parseable pattern | Known prefix    | ASCII-safe suffix | Suffix has whitespace |
| ---- | ---------------------- | ------------- | ----------------- | ----------------- | --------------- | ----------------- | --------------------- |
| BW   | Baden-Württemberg      | 27194         | 27194 (100.0 %)   | 27194 (100.0 %)   | 27194 (100.0 %) | 27194 (100.0 %)   | 0                     |
| BY   | Bayern                 | 4392          | 4392 (100.0 %)    | 4392 (100.0 %)    | 4392 (100.0 %)  | 4392 (100.0 %)    | 0                     |
| BE   | Berlin                 | 940           | 940 (100.0 %)     | 940 (100.0 %)     | 940 (100.0 %)   | 940 (100.0 %)     | 0                     |
| BB   | Brandenburg            | 966           | 966 (100.0 %)     | 966 (100.0 %)     | 966 (100.0 %)   | 966 (100.0 %)     | 0                     |
| HB   | Bremen                 | 207           | 207 (100.0 %)     | 207 (100.0 %)     | 207 (100.0 %)   | 207 (100.0 %)     | 0                     |
| HH   | Hamburg                | 559           | 559 (100.0 %)     | 559 (100.0 %)     | 559 (100.0 %)   | 559 (100.0 %)     | 0                     |
| HE   | Hessen                 | 2101          | 2101 (100.0 %)    | 2101 (100.0 %)    | 2101 (100.0 %)  | 2101 (100.0 %)    | 0                     |
| MV   | Mecklenburg-Vorpommern | 565           | 564 (99.8 %)      | 565 (100.0 %)     | 565 (100.0 %)   | 564 (99.8 %)      | 0                     |
| NI   | Niedersachsen          | 3128          | 3128 (100.0 %)    | 3128 (100.0 %)    | 3128 (100.0 %)  | 3128 (100.0 %)    | 0                     |
| NW   | Nordrhein-Westfalen    | 5669          | 5669 (100.0 %)    | 5669 (100.0 %)    | 5669 (100.0 %)  | 5669 (100.0 %)    | 0                     |
| RP   | Rheinland-Pfalz        | 1654          | 1654 (100.0 %)    | 1654 (100.0 %)    | 1654 (100.0 %)  | 1654 (100.0 %)    | 0                     |
| SL   | Saarland               | 731           | 731 (100.0 %)     | 731 (100.0 %)     | 731 (100.0 %)   | 643 (88.0 %)      | 13                    |
| SN   | Sachsen                | 2093          | 2093 (100.0 %)    | 2093 (100.0 %)    | 2093 (100.0 %)  | 2093 (100.0 %)    | 0                     |
| ST   | Sachsen-Anhalt         | 1784          | 1784 (100.0 %)    | 1784 (100.0 %)    | 1784 (100.0 %)  | 1784 (100.0 %)    | 0                     |
| SH   | Schleswig-Holstein     | 2028          | 2028 (100.0 %)    | 2028 (100.0 %)    | 2028 (100.0 %)  | 2028 (100.0 %)    | 0                     |
| TH   | Thüringen              | 1124          | 1124 (100.0 %)    | 1124 (100.0 %)    | 1124 (100.0 %)  | 1124 (100.0 %)    | 0                     |


## Baden-Wuerttemberg identifier mix (`BW-`*)


| Pattern                                                 | Count | Share in BW |
| ------------------------------------------------------- | ----- | ----------- |
| `BW-<8digits>` (DISCH)                                  | 4954  | 18.2 %      |
| `BW-FB-*` deterministic fallback (with coordinates)     | 0     | 0.0 %       |
| `BW-FBA-*` deterministic fallback (without coordinates) | 0     | 0.0 %       |
| `BW-UUID-*` feature UUID fallback                       | 22240 | 81.8 %      |
| `BW-FB-UNKNOWN`                                         | 0     | 0.0 %       |


## Sample anomalies (first 20)

- `MV- (empty suffix after state prefix)`
- `SL-Montessori-Gemeinschaftsschule Am Hasenfels (suffix contains whitespace)`
- `SL-Bildungscampus Saarland (Abt. Ausbildung: Studienseminar für das Lehramt für die Primarstufe) (suffix contains whitespace)`
- `SL-Bildungscampus Saarland (Abt. Ausbildung: Studienseminar für das Lehramt für die Sekundarstufe I an (suffix contains whitespace)`
- `SL-Bildungscampus Saarland (Abt. Ausbildung: Studienseminar für das Lehramt für die Sekundarstufe I und (suffix contains whitespace)`
- `SL-Bildungscampus Saarland (Abt. Ausbildung: Studienseminar für das Lehramt für Sonderpädagogik (suffix contains whitespace)`
- `SL-Bildungscampus Saarland (Abt. Ausbildung: Studienseminar für das Lehramt an beruflichen Schulen) (suffix contains whitespace)`
- `SL-Bildungscampus (Abt. Ausbildung: Studienseminar für die Primarstufe) (suffix contains whitespace)`
- `SL-Bildungscampus (Abt. Ausbildung: Studienseminar für Sonderpädagogik) (suffix contains whitespace)`
- `SL-Bildungscampus (Abt. Ausbildung: Studienseminar für die Sekundarstufe I an Gemeinschaftsschulen) (suffix contains whitespace)`
- `SL-Bildungscampus (Abt. Ausbildung: Studienseminar für die Sekundarstufen I und II an Gym. und Gem.) (suffix contains whitespace)`
- `SL-Bildungscampus (Abt. Ausbildung: Studienseminar für berufliche Schulen) (suffix contains whitespace)`
- `SL-Montessori-Gemeinschaftsschule ¿Am Hasenfels¿ (suffix contains whitespace)`
- `SL-Gemeinschaftsschule Saarbrücken-Bruchwiese in Abendform (suffix contains whitespace)`

