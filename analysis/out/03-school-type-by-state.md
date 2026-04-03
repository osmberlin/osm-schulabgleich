# `school_type` counts per state

**Script:** [`analysis/scripts/jedeschule-official-analysis.ts`](../scripts/jedeschule-official-analysis.ts)

**Source:** `public/datasets/schools_official_de.geojson`

**Generated (UTC):** 2026-04-03T13:26:43.454Z

## Question

Count per `school_type` per Bundesland.

## Processing

Same `school_type` normalization as `02-school-type-counts.md` (`schoolTypeBucketKeyQ2` in the script):

- Tabs → spaces; trim each line; drop empty lines; collapse to one line per segment.
- `|` is treated like `;`: split on both, each segment cleaned as above, empty segments removed, then rejoined with `"; "`.
- The `school_type` column is truncated to **60** characters in this table (full normalized string is used for grouping).
- **%** = share of schools in that Bundesland (row’s state).

## Result

| State | school_type                                                   | count | %       |
| ----- | ------------------------------------------------------------- | ----- | ------- |
| BB    | Grundschule                                                   | 483   | 50.0 %  |
| BB    | Oberschule                                                    | 111   | 11.5 %  |
| BB    | Gymnasium                                                     | 109   | 11.3 %  |
| BB    | Oberschule mit Grundschule                                    | 49    | 5.1 %   |
| BB    | Gesamtschule mit GOST                                         | 42    | 4.3 %   |
| BB    | Schule mit dem sonderpäd. Schwerpunkt Lernen                  | 38    | 3.9 %   |
| BB    | Schule mit dem sonderpäd. Förderschwerpunkt geistige Entwick… | 37    | 3.8 %   |
| BB    | Berufliche Schule in freier Trägerschaft                      | 27    | 2.8 %   |
| BB    | OSZ mit beruflichem Gymnasium                                 | 17    | 1.8 %   |
| BB    | ZBW an VHS und anderen Schulformen                            | 14    | 1.4 %   |
| BB    | OSZ                                                           | 8     | 0.8 %   |
| BB    | Waldorfschule                                                 | 7     | 0.7 %   |
| BB    | Schule mit dem sonderpäd. Förderschwerpunkt emotionale und s… | 6     | 0.6 %   |
| BB    | Fachschule                                                    | 4     | 0.4 %   |
| BB    | Gesamtschule mit Grundschule und GOST                         | 4     | 0.4 %   |
| BB    | Schule des ZBW                                                | 3     | 0.3 %   |
| BB    | Berufliche Schule in fr. Trägerschaft mit Beruflichem Gymnas… | 2     | 0.2 %   |
| BB    | Schule mit dem sonderpäd. Förderschwerpunkt körperliche und … | 2     | 0.2 %   |
| BB    | Schule für Kranke                                             | 1     | 0.1 %   |
| BB    | Schule mit dem sonderpäd. Förderschwerpunkt Hören             | 1     | 0.1 %   |
| BB    | Schule mit dem sonderpäd. Förderschwerpunkt Sehen             | 1     | 0.1 %   |
| BE    | Grundschule                                                   | 440   | 46.8 %  |
| BE    | Integrierte Sekundarschule                                    | 129   | 13.7 %  |
| BE    | Gymnasium                                                     | 106   | 11.3 %  |
| BE    | Gemeinschaftsschule                                           | 48    | 5.1 %   |
| BE    | Oberstufenzentrum                                             | 34    | 3.6 %   |
| BE    | Kombinierte berufliche Schule                                 | 33    | 3.5 %   |
| BE    | Fachschule                                                    | 27    | 2.9 %   |
| BE    | Förderschwerp. "Geistige Entwicklung"                         | 20    | 2.1 %   |
| BE    | Übrige Förderschwerpunkte                                     | 20    | 2.1 %   |
| BE    | Förderschwerp. "Lernen"                                       | 15    | 1.6 %   |
| BE    | Berufsfachschule                                              | 12    | 1.3 %   |
| BE    | Freie Waldorfschule                                           | 12    | 1.3 %   |
| BE    | Kombinierte allgemein bildende Schule                         | 10    | 1.1 %   |
| BE    | Berufsschule mit sonderpäd. Aufgaben                          | 5     | 0.5 %   |
| BE    | Förderschwerp. einschl. beruflichem Teil                      | 5     | 0.5 %   |
| BE    | Volkshochschule                                               | 5     | 0.5 %   |
| BE    | Berufsschule                                                  | 4     | 0.4 %   |
| BE    | Volkshochschul-Kolleg                                         | 4     | 0.4 %   |
| BE    | Fachoberschule                                                | 3     | 0.3 %   |
| BE    | Kolleg                                                        | 3     | 0.3 %   |
| BE    | Abend-Gymnasium                                               | 2     | 0.2 %   |
| BE    | Förderschwerp. "Lernen"u."Geistige Entwickl."                 | 2     | 0.2 %   |
| BE    | Kombinierte allg./berufl. Schule                              | 1     | 0.1 %   |
| BW    | education                                                     | 16577 | 66.4 %  |
| BW    | primaryEducation                                              | 5547  | 22.2 %  |
| BW    | administrationForEducation                                    | 1225  | 4.9 %   |
| BW    | lowerSecondaryEduction                                        | 679   | 2.7 %   |
| BW    | (not set)                                                     | 528   | 2.1 %   |
| BW    | upperSecondaryEducation                                       | 420   | 1.7 %   |
| BY    | Grundschulen                                                  | 2257  | 51.4 %  |
| BY    | Mittelschulen                                                 | 852   | 19.4 %  |
| BY    | Gymnasien                                                     | 323   | 7.4 %   |
| BY    | Realschulen                                                   | 238   | 5.4 %   |
| BY    | Förderzentren                                                 | 159   | 3.6 %   |
| BY    | Berufsschulen                                                 | 120   | 2.7 %   |
| BY    | Berufsfachs. f. Hauswirtschaft u. Sozialberufe                | 108   | 2.5 %   |
| BY    | Fachoberschulen                                               | 69    | 1.6 %   |
| BY    | Landwirtschaftliche Fachschulen                               | 64    | 1.5 %   |
| BY    | Berufsoberschulen                                             | 59    | 1.3 %   |
| BY    | Gewerbliche Fachschulen                                       | 43    | 1.0 %   |
| BY    | Wirtschaftsschulen                                            | 31    | 0.7 %   |
| BY    | Berufsfachschulen des Gesundheitswesens                       | 26    | 0.6 %   |
| BY    | Fachakademien                                                 | 10    | 0.2 %   |
| BY    | Gewerbliche Berufsfachschulen                                 | 10    | 0.2 %   |
| BY    | Berufsfachschulen f. techn. Assistenzberufe                   | 9     | 0.2 %   |
| BY    | Berufsschulen zur sonderpädog. Förderung                      | 3     | 0.1 %   |
| BY    | Kaufmännische Berufsfachschulen                               | 3     | 0.1 %   |
| BY    | Hauswirtschaftliche Fachschulen                               | 2     | 0.0 %   |
| BY    | Kollegs                                                       | 2     | 0.0 %   |
| BY    | Berufsfachschulen f. Fremdsprachenberufe                      | 1     | 0.0 %   |
| BY    | Fachakademien für Landwirtschaft                              | 1     | 0.0 %   |
| BY    | Kaufmännische Fachschulen                                     | 1     | 0.0 %   |
| BY    | Schulen besonderer Art                                        | 1     | 0.0 %   |
| HB    | (not set)                                                     | 207   | 100.0 % |
| HE    | Grundschule                                                   | 1095  | 52.1 %  |
| HE    | Gymnasium (Mittel- und Oberstufe)                             | 153   | 7.3 %   |
| HE    | Berufliche Schule                                             | 145   | 6.9 %   |
| HE    | Schulformübergreifende (integrierte) Gesamtschule             | 135   | 6.4 %   |
| HE    | Sonstige Förderschule                                         | 120   | 5.7 %   |
| HE    | Schulformbezogene (kooperative) Gesamtschule                  | 114   | 5.4 %   |
| HE    | Schule mit dem Förderschwerpunkt Lernen                       | 89    | 4.2 %   |
| HE    | Haupt- und Realschule                                         | 27    | 1.3 %   |
| HE    | Grund-, Haupt- und Realschule                                 | 22    | 1.0 %   |
| HE    | Realschule                                                    | 22    | 1.0 %   |
| HE    | Gymnasiale Oberstufenschule                                   | 21    | 1.0 %   |
| HE    | Grund-, Haupt und Realschule mit Förderstufe                  | 19    | 0.9 %   |
| HE    | Gymnasium (Mittelstufe)                                       | 16    | 0.8 %   |
| HE    | Grundschule mit Förderstufe                                   | 15    | 0.7 %   |
| HE    | Staatliches Schulamt                                          | 15    | 0.7 %   |
| HE    | Studienseminar Grund-, Haupt-, Real- und Sonderschulen        | 14    | 0.7 %   |
| HE    | Haupt- und Realschule mit Förderstufe                         | 11    | 0.5 %   |
| HE    | Abendgymnasium                                                | 10    | 0.5 %   |
| HE    | Studienseminar Gymnasien                                      | 10    | 0.5 %   |
| HE    | Grund- und Hauptschule                                        | 9     | 0.4 %   |
| HE    | Mittelstufenschule                                            | 9     | 0.4 %   |
| HE    | Mittelstufenschule mit Grundschule                            | 7     | 0.3 %   |
| HE    | Kooperative Gesamtschule mit Mittelstufenschule               | 5     | 0.2 %   |
| HE    | Studienseminar Berufliche Schulen                             | 5     | 0.2 %   |
| HE    | Hessenkolleg                                                  | 4     | 0.2 %   |
| HE    | Grund- und Realschule                                         | 3     | 0.1 %   |
| HE    | Abendrealschule                                               | 2     | 0.1 %   |
| HE    | Allgemeine Dienststelle                                       | 1     | 0.0 %   |
| HE    | Fiktive Dienststelle                                          | 1     | 0.0 %   |
| HE    | Hessisches Kultusministerium                                  | 1     | 0.0 %   |
| HE    | Sonstige Dienststelle                                         | 1     | 0.0 %   |
| HH    | Grundschule; vorschulische Sprachförderung; Vorschulklasse    | 208   | 37.2 %  |
| HH    | Gymnasium                                                     | 84    | 15.0 %  |
| HH    | Stadtteilschule                                               | 75    | 13.4 %  |
| HH    | Grundschule; Vorschulklasse                                   | 32    | 5.7 %   |
| HH    | Grundschule; Stadtteilschule; vorschulische Sprachförderung;… | 24    | 4.3 %   |
| HH    | Sonderschule; Vorschulklasse                                  | 21    | 3.8 %   |
| HH    | Sonderschule                                                  | 18    | 3.2 %   |
| HH    | Grundschule; Stadtteilschule; Vorschulklasse                  | 13    | 2.3 %   |
| HH    | Berufsfachschule                                              | 9     | 1.6 %   |
| HH    | Berufsschule                                                  | 8     | 1.4 %   |
| HH    | Berufsfachschule; Berufsschule; Berufsvorbereitungsschule     | 7     | 1.3 %   |
| HH    | Berufsfachschule; Berufsschule; Berufsvorbereitungsschule; F… | 7     | 1.3 %   |
| HH    | Gymnasium; Stadtteilschule                                    | 6     | 1.1 %   |
| HH    | Berufsfachschule; Berufsschule; Berufsvorbereitungsschule; F… | 5     | 0.9 %   |
| HH    | Berufsfachschule; Fachschule                                  | 5     | 0.9 %   |
| HH    | Berufsfachschule; Berufsoberschule; Berufsschule; Berufsvorb… | 3     | 0.5 %   |
| HH    | Fachschule                                                    | 3     | 0.5 %   |
| HH    | Berufliche Gymnasien; Berufsfachschule; Berufsoberschule; Be… | 2     | 0.4 %   |
| HH    | Berufliche Gymnasien; Berufsfachschule; Berufsschule; Berufs… | 2     | 0.4 %   |
| HH    | Berufliche Gymnasien; Berufsfachschule; Berufsschule; Berufs… | 2     | 0.4 %   |
| HH    | Berufsfachschule (allg. bild.); Berufsvorbereitungsschule (a… | 2     | 0.4 %   |
| HH    | Berufsfachschule; Berufsoberschule; Berufsvorbereitungsschul… | 2     | 0.4 %   |
| HH    | Berufsfachschule; Berufsschule; Berufsvorbereitungsschule; F… | 2     | 0.4 %   |
| HH    | Berufsoberschule; Berufsschule; Berufsvorbereitungsschule; F… | 2     | 0.4 %   |
| HH    | Berufsschule; Berufsvorbereitungsschule                       | 2     | 0.4 %   |
| HH    | Berufsvorbereitungsschule (allg. bild.)                       | 2     | 0.4 %   |
| HH    | Berufsvorbereitungsschule (allg. bild.); Sonderschule; Vorsc… | 2     | 0.4 %   |
| HH    | (not set)                                                     | 1     | 0.2 %   |
| HH    | Abendgymnasium                                                | 1     | 0.2 %   |
| HH    | Abendgymnasium; Abendschule; Hansa-Kolleg                     | 1     | 0.2 %   |
| HH    | Berufliche Gymnasien; Berufsfachschule; Berufsschule; Berufs… | 1     | 0.2 %   |
| HH    | Berufliche Gymnasien; Berufsfachschule; Berufsvorbereitungss… | 1     | 0.2 %   |
| HH    | Berufsfachschule; Berufsoberschule; Berufsschule; Berufsvorb… | 1     | 0.2 %   |
| HH    | Doppeltqualifizierender Bildungsgang; Stadtteilschule         | 1     | 0.2 %   |
| HH    | Grundschule                                                   | 1     | 0.2 %   |
| HH    | Grundschule; Gymnasium; Vorschulklasse                        | 1     | 0.2 %   |
| HH    | Grundschule; Sonderschule; Stadtteilschule; Vorschulklasse    | 1     | 0.2 %   |
| HH    | Studienkolleg                                                 | 1     | 0.2 %   |
| MV    | Grundschule                                                   | 211   | 37.3 %  |
| MV    | Regionale Schule                                              | 75    | 13.3 %  |
| MV    | Regionale Schule mit Grundschule                              | 62    | 11.0 %  |
| MV    | Gymnasium                                                     | 44    | 7.8 %   |
| MV    | Grundschule mit Orientierungsstufe                            | 31    | 5.5 %   |
| MV    | Förderschule-Schule mit dem Förderschwerpunkt geistige Entwi… | 28    | 5.0 %   |
| MV    | Förderschule-Schule mit dem Förderschwerpunkt Lernen          | 24    | 4.2 %   |
| MV    | Kooperative Gesamtschule mit gymnasialer Oberstufe            | 17    | 3.0 %   |
| MV    | Integrierte Gesamtschule mit gymnasialer Oberstufe            | 9     | 1.6 %   |
| MV    | Integrierte Gesamtschule mit gymnasialer Oberstufe und Grund… | 9     | 1.6 %   |
| MV    | Förderschule-Schule mit den Förderschwerpunkten geistige Ent… | 6     | 1.1 %   |
| MV    | Kooperative Gesamtschule mit gymnasialer Oberstufe und Grund… | 6     | 1.1 %   |
| MV    | Waldorfschule                                                 | 6     | 1.1 %   |
| MV    | Abendgymnasium                                                | 3     | 0.5 %   |
| MV    | Gymnasium mit Grundschule und Orientierungsstufe              | 3     | 0.5 %   |
| MV    | Gymnasium mit Regionaler Schule                               | 3     | 0.5 %   |
| MV    | (not set)                                                     | 2     | 0.4 %   |
| MV    | Förderschule-Schule mit dem Förderschwerpunkt emotionale und… | 2     | 0.4 %   |
| MV    | Förderschule-Schule mit dem Förderschwerpunkt körperliche un… | 2     | 0.4 %   |
| MV    | Förderschule-Schule mit dem Förderschwerpunkt Unterricht kra… | 2     | 0.4 %   |
| MV    | Förderschule-Schule mit den Förderschwerpunkten Lernen und U… | 2     | 0.4 %   |
| MV    | Gymnasium und Regionale Schule mit Grundschule                | 2     | 0.4 %   |
| MV    | Integrierte Gesamtschule mit gymn. Oberstufe, Grundschule, F… | 2     | 0.4 %   |
| MV    | Integrierte Gesamtschule ohne gymnasiale Oberstufe            | 2     | 0.4 %   |
| MV    | Integrierte Gesamtschule ohne gymnasiale Oberstufe mit Grund… | 2     | 0.4 %   |
| MV    | Förderschule-Schule mit dem Förderschwerpunkt Hören           | 1     | 0.2 %   |
| MV    | Förderschule-Schule mit dem Förderschwerpunkt körperliche un… | 1     | 0.2 %   |
| MV    | Förderschule-Schule mit dem Förderschwerpunkt Sehen           | 1     | 0.2 %   |
| MV    | Förderschule-Schule mit den Förderschwerpunkten emotionale u… | 1     | 0.2 %   |
| MV    | Förderschule-Schule mit den Förderschwerpunkten emotionale u… | 1     | 0.2 %   |
| MV    | Förderschule-Schule mit den Förderschwerpunkten emotionale u… | 1     | 0.2 %   |
| MV    | Förderschule-Schule mit den Förderschwerpunkten Lernen, emot… | 1     | 0.2 %   |
| MV    | Höhere Berufsfachschule                                       | 1     | 0.2 %   |
| MV    | Regionale Schule mit Grundschule und Förderschule-Schule mit… | 1     | 0.2 %   |
| MV    | Regionale Schule mit integrierter Gesamtschule im Aufbau      | 1     | 0.2 %   |
| NI    | Grundschule                                                   | 1608  | 51.4 %  |
| NI    | Berufsbildende Schule                                         | 327   | 10.5 %  |
| NI    | Gymnasium                                                     | 256   | 8.2 %   |
| NI    | Oberschule                                                    | 243   | 7.8 %   |
| NI    | Förderschule                                                  | 197   | 6.3 %   |
| NI    | Integrierte Gesamtschule                                      | 107   | 3.4 %   |
| NI    | Realschule                                                    | 89    | 2.8 %   |
| NI    | Studienseminar                                                | 50    | 1.6 %   |
| NI    | Hauptschule                                                   | 46    | 1.5 %   |
| NI    | Kooperative Gesamtschule                                      | 35    | 1.1 %   |
| NI    | Oberschule mit gymnasialem Angebot                            | 31    | 1.0 %   |
| NI    | Grund- und Förderschule                                       | 28    | 0.9 %   |
| NI    | Haupt- und Realschule                                         | 27    | 0.9 %   |
| NI    | Grund- und Hauptschule                                        | 23    | 0.7 %   |
| NI    | Freie Waldorfschule                                           | 20    | 0.6 %   |
| NI    | Grund- und Oberschule                                         | 16    | 0.5 %   |
| NI    | Integrative Gesamt- und Grundschule                           | 9     | 0.3 %   |
| NI    | Abendgymnasium                                                | 5     | 0.2 %   |
| NI    | Grund-, Haupt- und Realschule                                 | 4     | 0.1 %   |
| NI    | Kolleg                                                        | 4     | 0.1 %   |
| NI    | Haupt- und Förderschule                                       | 2     | 0.1 %   |
| NI    | Grund-, Haupt-, Real- und Förderschule                        | 1     | 0.0 %   |
| NW    | Grundschule                                                   | 2826  | 49.9 %  |
| NW    | Gymnasium                                                     | 631   | 11.1 %  |
| NW    | Förderschule                                                  | 453   | 8.0 %   |
| NW    | Gesamtschule                                                  | 384   | 6.8 %   |
| NW    | Realschule                                                    | 372   | 6.6 %   |
| NW    | Berufskolleg                                                  | 362   | 6.4 %   |
| NW    | Hauptschule                                                   | 159   | 2.8 %   |
| NW    | Sekundarschule                                                | 117   | 2.1 %   |
| NW    | Schulaufsicht                                                 | 59    | 1.0 %   |
| NW    | Weiterbildungskolleg                                          | 43    | 0.8 %   |
| NW    | Waldorfschule                                                 | 42    | 0.7 %   |
| NW    | Klinikschule                                                  | 38    | 0.7 %   |
| NW    | ZfsL                                                          | 33    | 0.6 %   |
| NW    | Seminar Gymnasien und Gesamtschulen                           | 31    | 0.5 %   |
| NW    | Seminar Grundschule                                           | 28    | 0.5 %   |
| NW    | Förderschule im Bereich des Berufskollegs                     | 19    | 0.3 %   |
| NW    | Seminar Haupt-, Real- und Gesamtschulen                       | 19    | 0.3 %   |
| NW    | Seminar sonderpädagogische Förderung                          | 15    | 0.3 %   |
| NW    | Freie Waldorfförderschule                                     | 13    | 0.2 %   |
| NW    | Seminar Berufskolleg                                          | 13    | 0.2 %   |
| NW    | Primus (Schulversuch)                                         | 5     | 0.1 %   |
| NW    | Schulischer Lernort                                           | 2     | 0.0 %   |
| NW    | Volksschule                                                   | 2     | 0.0 %   |
| NW    | Förderschule im Bereich der Realschule                        | 1     | 0.0 %   |
| NW    | Förderschule im Bereich des Gymnasiums                        | 1     | 0.0 %   |
| NW    | Hiberniaschule                                                | 1     | 0.0 %   |
| RP    | Grundschule                                                   | 945   | 57.1 %  |
| RP    | Gymnasium                                                     | 154   | 9.3 %   |
| RP    | Realschule plus                                               | 138   | 8.3 %   |
| RP    | Förderschule                                                  | 133   | 8.0 %   |
| RP    | Berufsbildende Schule                                         | 102   | 6.2 %   |
| RP    | Integrierte Gesamtschule                                      | 56    | 3.4 %   |
| RP    | Realschule plus mit Fachoberschule                            | 32    | 1.9 %   |
| RP    | Studienseminar                                                | 31    | 1.9 %   |
| RP    | BEA                                                           | 19    | 1.1 %   |
| RP    | Grund- und Realschule plus (org. verbunden)                   | 18    | 1.1 %   |
| RP    | Freie Waldorfschule                                           | 10    | 0.6 %   |
| RP    | Realschule                                                    | 8     | 0.5 %   |
| RP    | Kolleg und Abendgymnasium (org.verbunden)                     | 3     | 0.2 %   |
| RP    | Grund- und Hauptschule (org. verbunden)                       | 2     | 0.1 %   |
| RP    | (not set)                                                     | 1     | 0.1 %   |
| RP    | Hauptschule                                                   | 1     | 0.1 %   |
| RP    | Kolleg                                                        | 1     | 0.1 %   |
| SH    | (not set)                                                     | 1106  | 54.5 %  |
| SH    | Grundschule                                                   | 392   | 19.3 %  |
| SH    | Freie Trägerschaft                                            | 114   | 5.6 %   |
| SH    | Gymnasium                                                     | 95    | 4.7 %   |
| SH    | Förderzentrum                                                 | 83    | 4.1 %   |
| SH    | Gemeinschaftsschule; Hauptschule; Realschule                  | 72    | 3.6 %   |
| SH    | Gemeinschaftsschule; Grundschule; Hauptschule; Realschule     | 60    | 3.0 %   |
| SH    | Gemeinschaftsschule; Gymnasium; Hauptschule; Realschule       | 37    | 1.8 %   |
| SH    | Berufsbildende Schule                                         | 35    | 1.7 %   |
| SH    | Grundschule; Förderzentrum                                    | 6     | 0.3 %   |
| SH    | Gymnasium; Gemeinschaftsschule; Hauptschule; Realschule       | 5     | 0.2 %   |
| SH    | Gemeinschaftsschule; Grundschule; Förderzentrum; Hauptschule… | 4     | 0.2 %   |
| SH    | Gemeinschaftsschule; Grundschule; Gymnasium; Hauptschule; Re… | 4     | 0.2 %   |
| SH    | Förderzentrum; Grundschule                                    | 2     | 0.1 %   |
| SH    | Freie Trägerschaft; Grundschule                               | 2     | 0.1 %   |
| SH    | Gemeinschaftsschule; Grundschule; Förderzentrum; Gymnasium; … | 2     | 0.1 %   |
| SH    | Freie Trägerschaft; Grundschule; Gymnasium; Gemeinschaftssch… | 1     | 0.0 %   |
| SH    | Freie Trägerschaft; Grundschule; Gymnasium; Regionalschule; … | 1     | 0.0 %   |
| SH    | Gemeinschaftsschule; Förderzentrum; Gymnasium; Hauptschule; … | 1     | 0.0 %   |
| SH    | Gemeinschaftsschule; Förderzentrum; Hauptschule; Realschule   | 1     | 0.0 %   |
| SH    | Gesamtschule                                                  | 1     | 0.0 %   |
| SH    | Grund und Hauptschule                                         | 1     | 0.0 %   |
| SH    | Grundschule; Freie Trägerschaft                               | 1     | 0.0 %   |
| SH    | Grundschule; Hauptschule; Grund und Hauptschule; Realschule   | 1     | 0.0 %   |
| SH    | Gymnasium; Grundschule; Gemeinschaftsschule; Hauptschule; Re… | 1     | 0.0 %   |
| SL    | Grundschule                                                   | 356   | 48.7 %  |
| SL    | Gemeinschaftsschule                                           | 126   | 17.2 %  |
| SL    | Gymnasium                                                     | 72    | 9.8 %   |
| SL    | Berufliche Schule                                             | 53    | 7.3 %   |
| SL    | Förderschule                                                  | 40    | 5.5 %   |
| SL    | Förderschulen                                                 | 40    | 5.5 %   |
| SL    | Studienseminare                                               | 10    | 1.4 %   |
| SL    | Freie Waldorfschule                                           | 8     | 1.1 %   |
| SL    | Berufsakademie                                                | 4     | 0.5 %   |
| SL    | Hochschule                                                    | 4     | 0.5 %   |
| SL    | Realschule                                                    | 4     | 0.5 %   |
| SL    | Fachhochschule                                                | 3     | 0.4 %   |
| SL    | (not set)                                                     | 2     | 0.3 %   |
| SL    | Erweiterte Realschule                                         | 2     | 0.3 %   |
| SL    | Gemeinschaftsschule Abendform                                 | 2     | 0.3 %   |
| SL    | Abendgymnasium                                                | 1     | 0.1 %   |
| SL    | Gesamtschule                                                  | 1     | 0.1 %   |
| SL    | Lyzeum                                                        | 1     | 0.1 %   |
| SL    | Saarland-Kolleg                                               | 1     | 0.1 %   |
| SL    | Universität                                                   | 1     | 0.1 %   |
| SN    | Grundschule                                                   | 856   | 40.9 %  |
| SN    | Oberschule                                                    | 370   | 17.7 %  |
| SN    | Berufsfachschule                                              | 283   | 13.5 %  |
| SN    | Gymnasium                                                     | 182   | 8.7 %   |
| SN    | Berufsschule                                                  | 91    | 4.3 %   |
| SN    | Fachschule                                                    | 73    | 3.5 %   |
| SN    | Schule mit dem Förderschwerpunkt geistige Entwicklung         | 61    | 2.9 %   |
| SN    | Schule mit dem Förderschwerpunkt Lernen                       | 61    | 2.9 %   |
| SN    | Fachoberschule                                                | 22    | 1.1 %   |
| SN    | Berufliches Gymnasium                                         | 18    | 0.9 %   |
| SN    | Schule mit dem Förderschwerpunkt emotionale und soziale Entw… | 14    | 0.7 %   |
| SN    | Berufsbildende Förderschule                                   | 13    | 0.6 %   |
| SN    | Klinik- und Krankenhausschule                                 | 11    | 0.5 %   |
| SN    | Gemeinschaftsschule                                           | 6     | 0.3 %   |
| SN    | Oberschule+                                                   | 5     | 0.2 %   |
| SN    | Kolleg                                                        | 4     | 0.2 %   |
| SN    | Schule mit dem Förderschwerpunkt körperliche und motorische … | 4     | 0.2 %   |
| SN    | Schule mit dem Förderschwerpunkt Sprache                      | 4     | 0.2 %   |
| SN    | Schule nach §63d SächsSchulG                                  | 4     | 0.2 %   |
| SN    | Abendgymnasium                                                | 3     | 0.1 %   |
| SN    | Abendoberschule                                               | 3     | 0.1 %   |
| SN    | Schule mit dem Förderschwerpunkt Hören                        | 3     | 0.1 %   |
| SN    | Schule mit dem Förderschwerpunkt Sehen                        | 2     | 0.1 %   |
| ST    | (not set)                                                     | 927   | 52.0 %  |
| ST    | Grundschule                                                   | 492   | 27.6 %  |
| ST    | Sekundarschule                                                | 123   | 6.9 %   |
| ST    | Gymnasium                                                     | 76    | 4.3 %   |
| ST    | Gemeinschaftsschule                                           | 49    | 2.7 %   |
| ST    | Förderschule für Geistigbehinderte                            | 43    | 2.4 %   |
| ST    | Förderschule für Lernbehinderte                               | 26    | 1.5 %   |
| ST    | Förderschule mit Ausgleichsklassen                            | 12    | 0.7 %   |
| ST    | Integrierte Gesamtschule                                      | 11    | 0.6 %   |
| ST    | Förderschule mit mehreren Förderschwerpunkten                 | 10    | 0.6 %   |
| ST    | Förderschule für Körperbehinderte                             | 4     | 0.2 %   |
| ST    | Freie Waldorfschule                                           | 4     | 0.2 %   |
| ST    | Förderschule für Sprachentwicklung                            | 2     | 0.1 %   |
| ST    | Kooperative Gesamtschule                                      | 2     | 0.1 %   |
| ST    | Förderschule für Gehörlose und Hörgeschädigte                 | 1     | 0.1 %   |
| ST    | Schule des Zweiten Bildungsweges                              | 1     | 0.1 %   |
| ST    | Sportschule                                                   | 1     | 0.1 %   |
| TH    | Grundschule                                                   | 428   | 38.1 %  |
| TH    | Regelschule                                                   | 180   | 16.0 %  |
| TH    | Gymnasium                                                     | 113   | 10.1 %  |
| TH    | Berufsbildende Schule                                         | 98    | 8.7 %   |
| TH    | Gemeinschaftsschule                                           | 82    | 7.3 %   |
| TH    | Förderschule                                                  | 67    | 6.0 %   |
| TH    | Schule in freier Trägerschaft                                 | 61    | 5.4 %   |
| TH    | Berufsbildende Schule in freier Trägerschaft                  | 21    | 1.9 %   |
| TH    | Musikschule                                                   | 16    | 1.4 %   |
| TH    | Thüringer Gemeinschaftsschule                                 | 14    | 1.2 %   |
| TH    | Gesamtschule                                                  | 7     | 0.6 %   |
| TH    | Thür. Gemeinschaftsschule in freier Trägerschaft              | 6     | 0.5 %   |
| TH    | Schullandheim                                                 | 5     | 0.4 %   |
| TH    | Grundschule in freier Trägerschaft                            | 4     | 0.4 %   |
| TH    | Sonstige                                                      | 4     | 0.4 %   |
| TH    | Hochschule                                                    | 3     | 0.3 %   |
| TH    | Regelschule in freier Trägerschaft                            | 3     | 0.3 %   |
| TH    | Sonstiges                                                     | 3     | 0.3 %   |
| TH    | Förderschule in freier Trägerschaft                           | 2     | 0.2 %   |
| TH    | Gymnasium in freier Trägerschaft                              | 2     | 0.2 %   |
| TH    | Volkshochschule                                               | 2     | 0.2 %   |
| TH    | Kolleg                                                        | 1     | 0.1 %   |
| TH    | Schule in freier Traegerschaft                                | 1     | 0.1 %   |
| TH    | Schülerakademie                                               | 1     | 0.1 %   |
