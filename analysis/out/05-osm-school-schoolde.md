# OSM `school=*` and `school:de=*` (nationwide Schul-GeoJSON)

**Script:** [`analysis/scripts/osm-school-tags-analysis.ts`](../scripts/osm-school-tags-analysis.ts)

**Source:** `public/datasets/schools_osm_de.geojson`

**Generated (UTC):** 2026-04-04T08:17:15.325Z

## Question

How often are `school` and `school:de` set on `amenity=school` features in the pipeline extract? Which raw values appear, and what **canonical German Schulart** do we derive (see [`src/lib/osmSchoolKindDe.ts`](../../src/lib/osmSchoolKindDe.ts))?

## Processing

- **Relevant `school=*` rows** in the “Schularten” tables: at least one segment (after splitting on `;` / `,`) is **not** in the exclude set: `animal_training`, `aviation`, `barista`, `bible`, `coaching`, `computer`, `cooking`, `dog`, `educational_garden`, `entrance`, `farm`, `hunting`, `only`, `political`, `recreational_diving`, `sailing`, `shed`, `yes`.
- **Canonical label** (`canonicalDe`): if `school:de` is present, use it (minus excluded segments); else map `school=*` segments via `OSM_SCHOOL_EN_TO_DE` or pass through free-text German.
- **Canonical counts** below omit rows with no canonical label (`none`, `excluded`, `unmapped` with no mappable segment).

## Summary

| Metric                                 | Value |
| -------------------------------------- | ----- |
| Features (total)                       | 36895 |
| Features with `school=*`               | 880   |
| Features with `school:de=*`            | 2064  |
| Features with **both** tags            | 372   |
| Features with **either** tag           | 2572  |
| Distinct raw `school=*` values         | 73    |
| Distinct raw `school:de=*` values      | 78    |
| Distinct **canonical** Schulart labels | 103   |

## Rows by `canonicalSchoolKindDe` source

| source      | features |
| ----------- | -------- |
| none        | 34323    |
| school:de   | 2064     |
| mapped      | 395      |
| passthrough | 86       |
| excluded    | 27       |

## Canonical Schulart (count ≥ 5)

| canonicalDe                          | count | % of features |
| ------------------------------------ | ----- | ------------- |
| Grundschule                          | 1293  | 3.50 %        |
| Gymnasium                            | 250   | 0.68 %        |
| Förderschule                         | 187   | 0.51 %        |
| Gesamtschule                         | 157   | 0.43 %        |
| Weiterführende Schule                | 113   | 0.31 %        |
| Berufsschule                         | 90    | 0.24 %        |
| Realschule                           | 55    | 0.15 %        |
| Grundschule; Hauptschule; Realschule | 37    | 0.10 %        |
| Hauptschule; Realschule              | 30    | 0.08 %        |
| Gemeinschaftsschule                  | 29    | 0.08 %        |
| Berufsbildende Schule                | 25    | 0.07 %        |
| Förderschule (Sehen)                 | 19    | 0.05 %        |
| Berufskolleg                         | 18    | 0.05 %        |
| Hauptschule                          | 17    | 0.05 %        |
| Oberschule                           | 16    | 0.04 %        |
| Grundschule; Hauptschule             | 14    | 0.04 %        |
| Stadtteilschule                      | 13    | 0.04 %        |
| Hauptschule; Realschule; Gymnasium   | 11    | 0.03 %        |
| Abendgymnasium                       | 9     | 0.02 %        |
| Grund- und Gemeinschaftsschule       | 9     | 0.02 %        |
| Grundschule; Weiterführende Schule   | 8     | 0.02 %        |
| Realschule Plus                      | 8     | 0.02 %        |
| Berufsbildungszentrum                | 7     | 0.02 %        |
| Förderzentrum                        | 6     | 0.02 %        |

## `school=*` — relevant raw values (all counts)

_Segments matching the exclude list are omitted from this “Schularten” table; see appendix._

| school                                                                      | count | % of features |
| --------------------------------------------------------------------------- | ----- | ------------- |
| primary                                                                     | 379   | 1.03 %        |
| secondary                                                                   | 235   | 0.64 %        |
| Grundschule                                                                 | 34    | 0.09 %        |
| blind                                                                       | 22    | 0.06 %        |
| primary;secondary                                                           | 20    | 0.05 %        |
| vocational                                                                  | 20    | 0.05 %        |
| elementary                                                                  | 18    | 0.05 %        |
| special_education_needs                                                     | 17    | 0.05 %        |
| special_education_needs;primary;secondary                                   | 8     | 0.02 %        |
| Gymnasium                                                                   | 7     | 0.02 %        |
| Förderschule                                                                | 6     | 0.02 %        |
| special_needs                                                               | 6     | 0.02 %        |
| Oberschule                                                                  | 4     | 0.01 %        |
| primary; secondary                                                          | 4     | 0.01 %        |
| special school                                                              | 4     | 0.01 %        |
| art                                                                         | 3     | 0.01 %        |
| comprehensive                                                               | 3     | 0.01 %        |
| gymnasium                                                                   | 3     | 0.01 %        |
| Hauptschule                                                                 | 3     | 0.01 %        |
| language                                                                    | 3     | 0.01 %        |
| professional_education                                                      | 3     | 0.01 %        |
| Volkshochschule                                                             | 3     | 0.01 %        |
| Förderschule mit dem Schwerpunkt Lernen, emotionale und soziale Entwicklung | 2     | 0.01 %        |
| Gesamtschule                                                                | 2     | 0.01 %        |
| Grundschule;Mittelschule                                                    | 2     | 0.01 %        |
| music_school                                                                | 2     | 0.01 %        |
| Realschule                                                                  | 2     | 0.01 %        |
| secondary school                                                            | 2     | 0.01 %        |
| social                                                                      | 2     | 0.01 %        |
| special_education_needs;primary                                             | 2     | 0.01 %        |
| special_education_needs;secondary                                           | 2     | 0.01 %        |
| sport                                                                       | 2     | 0.01 %        |
| Waldorfschule                                                               | 2     | 0.01 %        |
| adult_education                                                             | 1     | 0.00 %        |
| Altenpflegeschule                                                           | 1     | 0.00 %        |
| Berufsfachschule für Sozialwesen                                            | 1     | 0.00 %        |
| Berufskolleg                                                                | 1     | 0.00 %        |
| college                                                                     | 1     | 0.00 %        |
| deaf                                                                        | 1     | 0.00 %        |
| Dr.-Theodor-Neubauer Schule                                                 | 1     | 0.00 %        |
| Föderschule                                                                 | 1     | 0.00 %        |
| Grund- und Hauptschule für gesundheitsgeschädigte Kinder und Jugendliche    | 1     | 0.00 %        |
| Grund- und Realschule                                                       | 1     | 0.00 %        |
| Grund- und Realschule Plus                                                  | 1     | 0.00 %        |
| Grundschule / Mittelschule                                                  | 1     | 0.00 %        |
| Grundschule, Realschule                                                     | 1     | 0.00 %        |
| Kolleg                                                                      | 1     | 0.00 %        |
| Mittelschule                                                                | 1     | 0.00 %        |
| primary_school                                                              | 1     | 0.00 %        |
| primary, secondary                                                          | 1     | 0.00 %        |
| primary;secondary;tertiary                                                  | 1     | 0.00 %        |
| Private Grundschule                                                         | 1     | 0.00 %        |
| Regionale Schule                                                            | 1     | 0.00 %        |
| Schulzentrum                                                                | 1     | 0.00 %        |
| Sonderschule                                                                | 1     | 0.00 %        |
| special                                                                     | 1     | 0.00 %        |
| special_education_needs;music                                               | 1     | 0.00 %        |
| vocational_school                                                           | 1     | 0.00 %        |
| Volksschule                                                                 | 1     | 0.00 %        |

## `school:de=*` — raw values (top 80 by count)

| school:de                                                                 | count | % of features |
| ------------------------------------------------------------------------- | ----- | ------------- |
| Grundschule                                                               | 1071  | 2.90 %        |
| Gymnasium                                                                 | 240   | 0.65 %        |
| Förderschule                                                              | 159   | 0.43 %        |
| Gesamtschule                                                              | 152   | 0.41 %        |
| Berufsschule                                                              | 89    | 0.24 %        |
| Realschule                                                                | 53    | 0.14 %        |
| Grundschule;Hauptschule;Realschule                                        | 37    | 0.10 %        |
| Hauptschule;Realschule                                                    | 30    | 0.08 %        |
| Gemeinschaftsschule                                                       | 29    | 0.08 %        |
| Berufskolleg                                                              | 16    | 0.04 %        |
| Grundschule;Hauptschule                                                   | 14    | 0.04 %        |
| Hauptschule                                                               | 14    | 0.04 %        |
| Stadtteilschule                                                           | 13    | 0.04 %        |
| Oberschule                                                                | 12    | 0.03 %        |
| Hauptschule;Realschule;Gymnasium                                          | 11    | 0.03 %        |
| Abendgymnasium                                                            | 9     | 0.02 %        |
| Grund- und Gemeinschaftsschule                                            | 9     | 0.02 %        |
| Realschule Plus                                                           | 8     | 0.02 %        |
| Berufsbildungszentrum                                                     | 7     | 0.02 %        |
| Förderzentrum                                                             | 6     | 0.02 %        |
| Grundschule;Gymnasium                                                     | 4     | 0.01 %        |
| Grundschule;Hauptschule;Realschule;Gymnasium                              | 4     | 0.01 %        |
| Privatschule                                                              | 4     | 0.01 %        |
| Realschule;Gymnasium                                                      | 4     | 0.01 %        |
| Berufsbildende Schule                                                     | 3     | 0.01 %        |
| Grund- und Hauptschule                                                    | 3     | 0.01 %        |
| Integrierte Gesamtschule                                                  | 3     | 0.01 %        |
| Fachoberschule;Berufsoberschule                                           | 2     | 0.01 %        |
| Grundschule;Realschule                                                    | 2     | 0.01 %        |
| Grundschule;Werkrealschule                                                | 2     | 0.01 %        |
| Gymnasium;Berufsschule                                                    | 2     | 0.01 %        |
| Oberstufenzentrum                                                         | 2     | 0.01 %        |
| Realschule Plus mit Fachoberschule                                        | 2     | 0.01 %        |
| Sekundarschule                                                            | 2     | 0.01 %        |
| Waldorfschule                                                             | 2     | 0.01 %        |
| Weiterbildungskolleg                                                      | 2     | 0.01 %        |
| Abendrealschule                                                           | 1     | 0.00 %        |
| Abendschule                                                               | 1     | 0.00 %        |
| Berufbildende Schule                                                      | 1     | 0.00 %        |
| Berufsakademie                                                            | 1     | 0.00 %        |
| Berufsbildungsstätte                                                      | 1     | 0.00 %        |
| Berufsschule;Gymnasium                                                    | 1     | 0.00 %        |
| Förderschule;Grundschule;Mittelschule;Berufsschule                        | 1     | 0.00 %        |
| Förderzentrum Lernen                                                      | 1     | 0.00 %        |
| Freie Waldorfschule                                                       | 1     | 0.00 %        |
| Gemeinschaftsschule mit Gymnasialer Oberstufe                             | 1     | 0.00 %        |
| Gemeinschaftsschule mit Oberstufe                                         | 1     | 0.00 %        |
| Gesamtschule;Gymnasium                                                    | 1     | 0.00 %        |
| Grund- und Gemeinschaftsschule Heikendorf                                 | 1     | 0.00 %        |
| Grund- und Hauptschule mit Werkrealschule                                 | 1     | 0.00 %        |
| Grund- und Regionalschule                                                 | 1     | 0.00 %        |
| Grund- und Stadtteilschule                                                | 1     | 0.00 %        |
| Grundschule mit Vorlaufkurs und Vorklasse                                 | 1     | 0.00 %        |
| Grundschule;Förderschule                                                  | 1     | 0.00 %        |
| Grundschule;Gemeinschaftsschule                                           | 1     | 0.00 %        |
| Grundschule;Gesamtschule                                                  | 1     | 0.00 %        |
| Grundschule;Hauptschule;Realschule;Berufsfachschule                       | 1     | 0.00 %        |
| Grundschule;Mittelschule                                                  | 1     | 0.00 %        |
| Grundschule;Oberschule;Gymnasium                                          | 1     | 0.00 %        |
| Grundschule;Realschule Plus                                               | 1     | 0.00 %        |
| Grundschule;Realschule;Gymnasium                                          | 1     | 0.00 %        |
| Gymnasium;Berufskolleg                                                    | 1     | 0.00 %        |
| Haupt-Werkrealschule                                                      | 1     | 0.00 %        |
| Hauptschule;Förderschule                                                  | 1     | 0.00 %        |
| Integrierte Gesamtschule;Grundschule                                      | 1     | 0.00 %        |
| Kinder- und Jugendwohnheim                                                | 1     | 0.00 %        |
| Kolleg                                                                    | 1     | 0.00 %        |
| Kooperative Gesamtschule mit Grundstufe                                   | 1     | 0.00 %        |
| Landwirtschaftsschule                                                     | 1     | 0.00 %        |
| Mittelschule                                                              | 1     | 0.00 %        |
| Montessori-Schule                                                         | 1     | 0.00 %        |
| Oberstufengymnasium                                                       | 1     | 0.00 %        |
| Pflegeschule                                                              | 1     | 0.00 %        |
| Realschule;Berufliches Gymnasium                                          | 1     | 0.00 %        |
| Schule mit dem sonderpädagogischem Förderschwerpunkt geistige Entwicklung | 1     | 0.00 %        |
| Sonderschule mit Förderschwerpunkt geistige Entwicklung                   | 1     | 0.00 %        |
| Sprachförderschule                                                        | 1     | 0.00 %        |
| Verbundschule                                                             | 1     | 0.00 %        |

## Per Bundesland: features with a canonical Schulart

| State | Features (total) | With canonicalDe | Share |
| ----- | ---------------- | ---------------- | ----- |
| BW    | 5286             | 103              | 1.9%  |
| BY    | 5704             | 64               | 1.1%  |
| BE    | 1072             | 91               | 8.5%  |
| BB    | 1071             | 57               | 5.3%  |
| HB    | 254              | 2                | 0.8%  |
| HH    | 559              | 35               | 6.3%  |
| HE    | 2443             | 1181             | 48.3% |
| MV    | 704              | 4                | 0.6%  |
| NI    | 3951             | 185              | 4.7%  |
| NW    | 7497             | 520              | 6.9%  |
| RP    | 1748             | 104              | 5.9%  |
| SL    | 415              | 6                | 1.4%  |
| SN    | 1935             | 29               | 1.5%  |
| ST    | 1098             | 14               | 1.3%  |
| SH    | 1192             | 142              | 11.9% |
| TH    | 1966             | 8                | 0.4%  |

## Appendix: `school=*` mapping preview (distinct raw → canonical)

_Useful for extending `OSM_SCHOOL_EN_TO_DE` when `source` is `unmapped`._

| raw `school=*`                                                              | canonicalDe                                                                 | source      |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------- |
| adult_education                                                             | Volkshochschule                                                             | mapped      |
| Altenpflegeschule                                                           | Altenpflegeschule                                                           | passthrough |
| animal_training                                                             | —                                                                           | excluded    |
| art                                                                         | Kunstschule                                                                 | mapped      |
| aviation                                                                    | —                                                                           | excluded    |
| barista                                                                     | —                                                                           | excluded    |
| Berufsfachschule für Sozialwesen                                            | Berufsfachschule für Sozialwesen                                            | passthrough |
| Berufskolleg                                                                | Berufskolleg                                                                | passthrough |
| bible                                                                       | —                                                                           | excluded    |
| blind                                                                       | Förderschule (Sehen)                                                        | mapped      |
| coaching                                                                    | —                                                                           | excluded    |
| college                                                                     | Berufskolleg                                                                | mapped      |
| comprehensive                                                               | Gesamtschule                                                                | mapped      |
| computer                                                                    | —                                                                           | excluded    |
| cooking                                                                     | —                                                                           | excluded    |
| deaf                                                                        | Förderschule (Hören)                                                        | mapped      |
| Dr.-Theodor-Neubauer Schule                                                 | Dr.-Theodor-Neubauer Schule                                                 | passthrough |
| educational_garden                                                          | —                                                                           | excluded    |
| elementary                                                                  | Grundschule                                                                 | mapped      |
| farm                                                                        | —                                                                           | excluded    |
| Föderschule                                                                 | Föderschule                                                                 | passthrough |
| Förderschule                                                                | Förderschule                                                                | passthrough |
| Förderschule mit dem Schwerpunkt Lernen, emotionale und soziale Entwicklung | Förderschule mit dem Schwerpunkt Lernen; emotionale und soziale Entwicklung | passthrough |
| Gesamtschule                                                                | Gesamtschule                                                                | passthrough |
| Grund- und Hauptschule für gesundheitsgeschädigte Kinder und Jugendliche    | Grund- und Hauptschule für gesundheitsgeschädigte Kinder und Jugendliche    | passthrough |
| Grund- und Realschule                                                       | Grund- und Realschule                                                       | passthrough |
| Grund- und Realschule Plus                                                  | Grund- und Realschule Plus                                                  | passthrough |
| Grundschule                                                                 | Grundschule                                                                 | passthrough |
| Grundschule / Mittelschule                                                  | Grundschule; Mittelschule                                                   | passthrough |
| Grundschule, Realschule                                                     | Grundschule; Realschule                                                     | passthrough |
| Grundschule;Mittelschule                                                    | Grundschule; Mittelschule                                                   | passthrough |
| gymnasium                                                                   | Gymnasium                                                                   | mapped      |
| Gymnasium                                                                   | Gymnasium                                                                   | passthrough |
| Hauptschule                                                                 | Hauptschule                                                                 | passthrough |
| hunting                                                                     | —                                                                           | excluded    |
| Kolleg                                                                      | Kolleg                                                                      | passthrough |
| language                                                                    | Sprachschule                                                                | mapped      |
| Mittelschule                                                                | Mittelschule                                                                | passthrough |
| music_school                                                                | Musikschule                                                                 | mapped      |
| Oberschule                                                                  | Oberschule                                                                  | passthrough |
| political                                                                   | —                                                                           | excluded    |
| primary                                                                     | Grundschule                                                                 | mapped      |
| primary_school                                                              | Grundschule                                                                 | mapped      |
| primary, secondary                                                          | Grundschule; Weiterführende Schule                                          | mapped      |
| primary; secondary                                                          | Grundschule; Weiterführende Schule                                          | mapped      |
| primary;secondary                                                           | Grundschule; Weiterführende Schule                                          | mapped      |
| primary;secondary;tertiary                                                  | Grundschule; Weiterführende Schule; tertiary                                | mapped      |
| Private Grundschule                                                         | Private Grundschule                                                         | passthrough |
| professional_education                                                      | Berufsbildende Schule                                                       | mapped      |
| Realschule                                                                  | Realschule                                                                  | passthrough |
| recreational_diving                                                         | —                                                                           | excluded    |
| Regionale Schule                                                            | Regionale Schule                                                            | passthrough |
| sailing                                                                     | —                                                                           | excluded    |
| Schulzentrum                                                                | Schulzentrum                                                                | passthrough |
| secondary                                                                   | Weiterführende Schule                                                       | mapped      |
| secondary school                                                            | secondary school                                                            | passthrough |
| social                                                                      | Schule für Erziehungshilfe                                                  | mapped      |
| Sonderschule                                                                | Sonderschule                                                                | passthrough |
| special                                                                     | Förderschule                                                                | mapped      |
| special school                                                              | Förderschule                                                                | mapped      |
| special_education_needs                                                     | Förderschule                                                                | mapped      |
| special_education_needs;music                                               | Förderschule; Musikschule                                                   | mapped      |
| special_education_needs;primary                                             | Förderschule; Grundschule                                                   | mapped      |
| special_education_needs;primary;secondary                                   | Förderschule; Grundschule; Weiterführende Schule                            | mapped      |
| special_education_needs;secondary                                           | Förderschule; Weiterführende Schule                                         | mapped      |
| special_needs                                                               | Förderschule                                                                | mapped      |
| sport                                                                       | Sportschule                                                                 | mapped      |
| vocational                                                                  | Berufsbildende Schule                                                       | mapped      |
| vocational_school                                                           | Berufsschule                                                                | mapped      |
| Volkshochschule                                                             | Volkshochschule                                                             | passthrough |
| Volksschule                                                                 | Volksschule                                                                 | passthrough |
| Waldorfschule                                                               | Waldorfschule                                                               | passthrough |
| yes                                                                         | —                                                                           | excluded    |

## Appendix: excluded / ancillary `school=*` values

| school              | count |
| ------------------- | ----- |
| educational_garden  | 13    |
| yes                 | 2     |
| animal_training     | 1     |
| aviation            | 1     |
| barista             | 1     |
| bible               | 1     |
| coaching            | 1     |
| computer            | 1     |
| cooking             | 1     |
| farm                | 1     |
| hunting             | 1     |
| political           | 1     |
| recreational_diving | 1     |
| sailing             | 1     |

## Taginfo reference: Germany `school=*` (top values)

Source: [taginfo.geofabrik.de europe:germany](https://taginfo.geofabrik.de/europe:germany/keys/school#values). Ancillary values such as `entrance` are **not** Schulformen for this project.

| value                                                                       | count (DE extract) | % of key |
| --------------------------------------------------------------------------- | ------------------ | -------- |
| primary                                                                     | 402                | 35.0 %   |
| secondary                                                                   | 261                | 22.7 %   |
| entrance                                                                    | 62                 | 5.4 %    |
| yes                                                                         | 44                 | 3.8 %    |
| Grundschule                                                                 | 39                 | 3.4 %    |
| blind                                                                       | 30                 | 2.6 %    |
| elementary                                                                  | 25                 | 2.2 %    |
| vocational                                                                  | 23                 | 2.0 %    |
| primary;secondary                                                           | 21                 | 1.8 %    |
| special_education_needs                                                     | 18                 | 1.6 %    |
| only                                                                        | 13                 | 1.1 %    |
| educational_garden                                                          | 13                 | 1.1 %    |
| dog                                                                         | 10                 | 0.9 %    |
| Gymnasium                                                                   | 8                  | 0.7 %    |
| special_education_needs;primary;secondary                                   | 8                  | 0.7 %    |
| Volkshochschule                                                             | 6                  | 0.5 %    |
| special_needs                                                               | 6                  | 0.5 %    |
| Förderschule                                                                | 6                  | 0.5 %    |
| music_school                                                                | 5                  | 0.4 %    |
| art                                                                         | 5                  | 0.4 %    |
| gymnasium                                                                   | 5                  | 0.4 %    |
| Gesamtschule                                                                | 5                  | 0.4 %    |
| Oberschule                                                                  | 4                  | 0.4 %    |
| primary; secondary                                                          | 4                  | 0.4 %    |
| special school                                                              | 4                  | 0.4 %    |
| sport                                                                       | 4                  | 0.4 %    |
| classrooms                                                                  | 4                  | 0.4 %    |
| language                                                                    | 3                  | 0.3 %    |
| professional_education                                                      | 3                  | 0.3 %    |
| animal_training                                                             | 3                  | 0.3 %    |
| comprehensive                                                               | 3                  | 0.3 %    |
| cooking                                                                     | 3                  | 0.3 %    |
| Hauptschule                                                                 | 3                  | 0.3 %    |
| kindergarten                                                                | 3                  | 0.3 %    |
| sports                                                                      | 3                  | 0.3 %    |
| Realschule                                                                  | 2                  | 0.2 %    |
| social                                                                      | 2                  | 0.2 %    |
| gym                                                                         | 2                  | 0.2 %    |
| Grundschule;Mittelschule                                                    | 2                  | 0.2 %    |
| political                                                                   | 2                  | 0.2 %    |
| Förderschule mit dem Schwerpunkt Lernen, emotionale und soziale Entwicklung | 2                  | 0.2 %    |
| special_education_needs;primary                                             | 2                  | 0.2 %    |
| dance                                                                       | 2                  | 0.2 %    |
| special_education_needs;secondary                                           | 2                  | 0.2 %    |
| Waldorfschule                                                               | 2                  | 0.2 %    |

## Taginfo reference: Germany `school:de=*` (top values)

| value                                        | count (DE extract) | % of key |
| -------------------------------------------- | ------------------ | -------- |
| Grundschule                                  | 1148               | 51.1 %   |
| Gymnasium                                    | 257                | 11.4 %   |
| Förderschule                                 | 178                | 7.9 %    |
| Gesamtschule                                 | 160                | 7.1 %    |
| Berufsschule                                 | 110                | 4.9 %    |
| Realschule                                   | 58                 | 2.6 %    |
| Grundschule;Hauptschule;Realschule           | 38                 | 1.7 %    |
| Hauptschule;Realschule                       | 34                 | 1.5 %    |
| Gemeinschaftsschule                          | 29                 | 1.3 %    |
| Berufskolleg                                 | 20                 | 0.9 %    |
| Hauptschule                                  | 17                 | 0.8 %    |
| Grundschule;Hauptschule                      | 16                 | 0.7 %    |
| Stadtteilschule                              | 13                 | 0.6 %    |
| Oberschule                                   | 13                 | 0.6 %    |
| Hauptschule;Realschule;Gymnasium             | 11                 | 0.5 %    |
| Grund- und Gemeinschaftsschule               | 9                  | 0.4 %    |
| Abendgymnasium                               | 9                  | 0.4 %    |
| Realschule Plus                              | 8                  | 0.4 %    |
| Volkshochschule                              | 8                  | 0.4 %    |
| Berufsbildungszentrum                        | 7                  | 0.3 %    |
| Förderzentrum                                | 6                  | 0.3 %    |
| Sekundarschule                               | 4                  | 0.2 %    |
| Grundschule;Hauptschule;Realschule;Gymnasium | 4                  | 0.2 %    |
| Realschule;Gymnasium                         | 4                  | 0.2 %    |
| Privatschule                                 | 4                  | 0.2 %    |
| Grundschule;Gymnasium                        | 4                  | 0.2 %    |
| Berufsbildende Schule                        | 3                  | 0.1 %    |
| Integrierte Gesamtschule                     | 3                  | 0.1 %    |
| Grund- und Hauptschule                       | 3                  | 0.1 %    |
| Realschule Plus mit Fachoberschule           | 3                  | 0.1 %    |
| Weiterbildungskolleg                         | 3                  | 0.1 %    |
| Grundschule;Werkrealschule                   | 2                  | 0.1 %    |
| Grundschule;Förderschule                     | 2                  | 0.1 %    |
| Fachoberschule;Berufsoberschule              | 2                  | 0.1 %    |
| Gymnasium;Berufsschule                       | 2                  | 0.1 %    |
| Grundschule;Realschule;Gymnasium             | 2                  | 0.1 %    |
| Waldorfschule                                | 2                  | 0.1 %    |
| Gemeinschaftsschule mit Oberstufe            | 2                  | 0.1 %    |
| Oberstufenzentrum                            | 2                  | 0.1 %    |
| Grundschule;Realschule                       | 2                  | 0.1 %    |
| Verbundschule                                | 2                  | 0.1 %    |
| Gymnasium;Berufskolleg                       | 1                  | 0.0 %    |
| Grundschule;Mittelschule                     | 1                  | 0.0 %    |
| Sprachförderschule                           | 1                  | 0.0 %    |
| Berufbildende Schule                         | 1                  | 0.0 %    |
