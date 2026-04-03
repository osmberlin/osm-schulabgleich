# `school_type` coverage by Bundesland (official nationwide GeoJSON)

**Script:** [`analysis/scripts/jedeschule-official-analysis.ts`](../scripts/jedeschule-official-analysis.ts)

**Source:** `public/datasets/schools_official_de.geojson`

**Generated (UTC):** 2026-04-03T13:26:43.418Z

## Question

How many Bundesländer have at least one school **with a `school_type` value**? For each state, how many schools **have** a value and what share is that?

## Summary

| Metric                                                        | Value |
| ------------------------------------------------------------- | ----- |
| Bundesländer in this file                                     | 16    |
| Bundesländer with ≥1 school **with** a `school_type` value    | 15    |
| Bundesländer where **every** school has a `school_type` value | 8     |

## Bundesländer with no `school_type` values in this file

**HB** — in this extract, no school row has a `school_type` string.

**Bremen (HB):** Rows use the **same** GeoJSON properties as everywhere else (`school_type`, `legal_status`, `provider`, …). Here `school_type` is `null` for every school — there is **no other field** in this dataset that carries school type instead. `legal_status` and `provider` are usually unset too, so this reflects how JedeSchule publishes Bremen, not a different column layout.

## Per state

| State (code) | Schools (total) | Schools **with** a `school_type` value | Share with a value |
| ------------ | --------------- | -------------------------------------- | ------------------ |
| BW           | 24976           | 24448                                  | 97.9%              |
| BY           | 4392            | 4392                                   | 100.0%             |
| BE           | 940             | 940                                    | 100.0%             |
| BB           | 966             | 966                                    | 100.0%             |
| HB           | 207             | 0                                      | 0.0%               |
| HH           | 559             | 558                                    | 99.8%              |
| HE           | 2101            | 2101                                   | 100.0%             |
| MV           | 565             | 563                                    | 99.6%              |
| NI           | 3128            | 3128                                   | 100.0%             |
| NW           | 5669            | 5669                                   | 100.0%             |
| RP           | 1654            | 1653                                   | 99.9%              |
| SL           | 731             | 729                                    | 99.7%              |
| SN           | 2093            | 2093                                   | 100.0%             |
| ST           | 1784            | 857                                    | 48.0%              |
| SH           | 2028            | 922                                    | 45.5%              |
| TH           | 1124            | 1124                                   | 100.0%             |
