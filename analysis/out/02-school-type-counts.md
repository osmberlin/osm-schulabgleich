# Global `school_type` value counts

**Script:** [`analysis/scripts/jedeschule-official-analysis.ts`](../scripts/jedeschule-official-analysis.ts)

**Source:** `public/datasets/schools_official_de.geojson`

**Generated (UTC):** 2026-04-03T13:26:43.435Z

## Question

What are the values of `school_type` over all states, and how many schools per value?

## Processing (this report only)

- Tabs → spaces; trim each line; drop empty lines; collapse to one line per segment.
- `|` is treated like `;`: split on both, each segment cleaned as above, empty segments removed, then rejoined with `"; "`.
- Rows with count **< 10** are omitted.
- The `school_type` column is truncated to **80** characters in the table (full string is still used for grouping).
- **%** = share of all schools in the file (denominator: total school count).

## Result

| school_type                                                                 | count | %      |
| --------------------------------------------------------------------------- | ----- | ------ |
| education                                                                   | 16577 | 31.3 % |
| Grundschule                                                                 | 10133 | 19.1 % |
| primaryEducation                                                            | 5547  | 10.5 % |
| (not set)                                                                   | 2774  | 5.2 %  |
| Grundschulen                                                                | 2257  | 4.3 %  |
| Gymnasium                                                                   | 1922  | 3.6 %  |
| administrationForEducation                                                  | 1225  | 2.3 %  |
| Förderschule                                                                | 890   | 1.7 %  |
| Mittelschulen                                                               | 852   | 1.6 %  |
| Oberschule                                                                  | 724   | 1.4 %  |
| lowerSecondaryEduction                                                      | 679   | 1.3 %  |
| Berufsbildende Schule                                                       | 562   | 1.1 %  |
| Realschule                                                                  | 495   | 0.9 %  |
| upperSecondaryEducation                                                     | 420   | 0.8 %  |
| Gesamtschule                                                                | 393   | 0.7 %  |
| Berufskolleg                                                                | 362   | 0.7 %  |
| Gymnasien                                                                   | 323   | 0.6 %  |
| Gemeinschaftsschule                                                         | 311   | 0.6 %  |
| Berufsfachschule                                                            | 304   | 0.6 %  |
| Sekundarschule                                                              | 240   | 0.5 %  |
| Realschulen                                                                 | 238   | 0.4 %  |
| Grundschule; vorschulische Sprachförderung; Vorschulklasse                  | 208   | 0.4 %  |
| Hauptschule                                                                 | 206   | 0.4 %  |
| Berufliche Schule                                                           | 198   | 0.4 %  |
| Regelschule                                                                 | 180   | 0.3 %  |
| Integrierte Gesamtschule                                                    | 174   | 0.3 %  |
| Förderzentren                                                               | 159   | 0.3 %  |
| Gymnasium (Mittel- und Oberstufe)                                           | 153   | 0.3 %  |
| Schule mit dem Förderschwerpunkt Lernen                                     | 150   | 0.3 %  |
| Realschule plus                                                             | 138   | 0.3 %  |
| Schulformübergreifende (integrierte) Gesamtschule                           | 135   | 0.3 %  |
| Integrierte Sekundarschule                                                  | 129   | 0.2 %  |
| Berufsschulen                                                               | 120   | 0.2 %  |
| Sonstige Förderschule                                                       | 120   | 0.2 %  |
| Freie Trägerschaft                                                          | 114   | 0.2 %  |
| Schulformbezogene (kooperative) Gesamtschule                                | 114   | 0.2 %  |
| Berufsfachs. f. Hauswirtschaft u. Sozialberufe                              | 108   | 0.2 %  |
| Fachschule                                                                  | 107   | 0.2 %  |
| Berufsschule                                                                | 103   | 0.2 %  |
| Förderzentrum                                                               | 83    | 0.2 %  |
| Studienseminar                                                              | 81    | 0.2 %  |
| Regionale Schule                                                            | 75    | 0.1 %  |
| Stadtteilschule                                                             | 75    | 0.1 %  |
| Gemeinschaftsschule; Hauptschule; Realschule                                | 72    | 0.1 %  |
| Fachoberschulen                                                             | 69    | 0.1 %  |
| Landwirtschaftliche Fachschulen                                             | 64    | 0.1 %  |
| Regionale Schule mit Grundschule                                            | 62    | 0.1 %  |
| Schule in freier Trägerschaft                                               | 61    | 0.1 %  |
| Schule mit dem Förderschwerpunkt geistige Entwicklung                       | 61    | 0.1 %  |
| Gemeinschaftsschule; Grundschule; Hauptschule; Realschule                   | 60    | 0.1 %  |
| Berufsoberschulen                                                           | 59    | 0.1 %  |
| Schulaufsicht                                                               | 59    | 0.1 %  |
| Waldorfschule                                                               | 55    | 0.1 %  |
| Freie Waldorfschule                                                         | 54    | 0.1 %  |
| Haupt- und Realschule                                                       | 54    | 0.1 %  |
| Oberschule mit Grundschule                                                  | 49    | 0.1 %  |
| Förderschule für Geistigbehinderte                                          | 43    | 0.1 %  |
| Gewerbliche Fachschulen                                                     | 43    | 0.1 %  |
| Weiterbildungskolleg                                                        | 43    | 0.1 %  |
| Gesamtschule mit GOST                                                       | 42    | 0.1 %  |
| Förderschulen                                                               | 40    | 0.1 %  |
| Klinikschule                                                                | 38    | 0.1 %  |
| Schule mit dem sonderpäd. Schwerpunkt Lernen                                | 38    | 0.1 %  |
| Gemeinschaftsschule; Gymnasium; Hauptschule; Realschule                     | 37    | 0.1 %  |
| Kooperative Gesamtschule                                                    | 37    | 0.1 %  |
| Schule mit dem sonderpäd. Förderschwerpunkt geistige Entwicklung            | 37    | 0.1 %  |
| Oberstufenzentrum                                                           | 34    | 0.1 %  |
| Kombinierte berufliche Schule                                               | 33    | 0.1 %  |
| ZfsL                                                                        | 33    | 0.1 %  |
| Grund- und Hauptschule                                                      | 32    | 0.1 %  |
| Grundschule; Vorschulklasse                                                 | 32    | 0.1 %  |
| Realschule plus mit Fachoberschule                                          | 32    | 0.1 %  |
| Grundschule mit Orientierungsstufe                                          | 31    | 0.1 %  |
| Oberschule mit gymnasialem Angebot                                          | 31    | 0.1 %  |
| Seminar Gymnasien und Gesamtschulen                                         | 31    | 0.1 %  |
| Wirtschaftsschulen                                                          | 31    | 0.1 %  |
| Förderschule-Schule mit dem Förderschwerpunkt geistige Entwicklung          | 28    | 0.1 %  |
| Grund- und Förderschule                                                     | 28    | 0.1 %  |
| Seminar Grundschule                                                         | 28    | 0.1 %  |
| Berufliche Schule in freier Trägerschaft                                    | 27    | 0.1 %  |
| Berufsfachschulen des Gesundheitswesens                                     | 26    | 0.0 %  |
| Förderschule für Lernbehinderte                                             | 26    | 0.0 %  |
| Grund-, Haupt- und Realschule                                               | 26    | 0.0 %  |
| Fachoberschule                                                              | 25    | 0.0 %  |
| Förderschule-Schule mit dem Förderschwerpunkt Lernen                        | 24    | 0.0 %  |
| Grundschule; Stadtteilschule; vorschulische Sprachförderung; Vorschulklasse | 24    | 0.0 %  |
| Abendgymnasium                                                              | 23    | 0.0 %  |
| Berufsbildende Schule in freier Trägerschaft                                | 21    | 0.0 %  |
| Gymnasiale Oberstufenschule                                                 | 21    | 0.0 %  |
| Sonderschule; Vorschulklasse                                                | 21    | 0.0 %  |
| Förderschwerp. "Geistige Entwicklung"                                       | 20    | 0.0 %  |
| Übrige Förderschwerpunkte                                                   | 20    | 0.0 %  |
| BEA                                                                         | 19    | 0.0 %  |
| Förderschule im Bereich des Berufskollegs                                   | 19    | 0.0 %  |
| Grund-, Haupt und Realschule mit Förderstufe                                | 19    | 0.0 %  |
| Seminar Haupt-, Real- und Gesamtschulen                                     | 19    | 0.0 %  |
| Berufliches Gymnasium                                                       | 18    | 0.0 %  |
| Grund- und Realschule plus (org. verbunden)                                 | 18    | 0.0 %  |
| Sonderschule                                                                | 18    | 0.0 %  |
| Kooperative Gesamtschule mit gymnasialer Oberstufe                          | 17    | 0.0 %  |
| OSZ mit beruflichem Gymnasium                                               | 17    | 0.0 %  |
| Grund- und Oberschule                                                       | 16    | 0.0 %  |
| Gymnasium (Mittelstufe)                                                     | 16    | 0.0 %  |
| Musikschule                                                                 | 16    | 0.0 %  |
| Förderschwerp. "Lernen"                                                     | 15    | 0.0 %  |
| Grundschule mit Förderstufe                                                 | 15    | 0.0 %  |
| Seminar sonderpädagogische Förderung                                        | 15    | 0.0 %  |
| Staatliches Schulamt                                                        | 15    | 0.0 %  |
| Schule mit dem Förderschwerpunkt emotionale und soziale Entwicklung         | 14    | 0.0 %  |
| Studienseminar Grund-, Haupt-, Real- und Sonderschulen                      | 14    | 0.0 %  |
| Thüringer Gemeinschaftsschule                                               | 14    | 0.0 %  |
| ZBW an VHS und anderen Schulformen                                          | 14    | 0.0 %  |
| Berufsbildende Förderschule                                                 | 13    | 0.0 %  |
| Freie Waldorfförderschule                                                   | 13    | 0.0 %  |
| Grundschule; Stadtteilschule; Vorschulklasse                                | 13    | 0.0 %  |
| Kolleg                                                                      | 13    | 0.0 %  |
| Seminar Berufskolleg                                                        | 13    | 0.0 %  |
| Förderschule mit Ausgleichsklassen                                          | 12    | 0.0 %  |
| Haupt- und Realschule mit Förderstufe                                       | 11    | 0.0 %  |
| Klinik- und Krankenhausschule                                               | 11    | 0.0 %  |
| Fachakademien                                                               | 10    | 0.0 %  |
| Förderschule mit mehreren Förderschwerpunkten                               | 10    | 0.0 %  |
| Gewerbliche Berufsfachschulen                                               | 10    | 0.0 %  |
| Kombinierte allgemein bildende Schule                                       | 10    | 0.0 %  |
| Studienseminar Gymnasien                                                    | 10    | 0.0 %  |
| Studienseminare                                                             | 10    | 0.0 %  |
