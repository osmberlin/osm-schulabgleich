# JedeSchule Identifier Report Index

This index bundles the 3-part report package and provides a one-page decision view for OSM usage.

**Generated (UTC):** 2026-04-19T10:25:00Z

## Report Set

- Part 1 (scripted CSV analysis): `analysis/out/07-identifier-csv-coverage.md`
- Part 2 (static scraper/API analysis): `analysis/out/08-identifier-sources-static-analysis.md`
- Part 3 (web-enriched final synthesis): `analysis/out/09-identifier-governance-osm-suitability.md`

## Quick Decision Matrix (OSM Referencing)


| Decision class                                    | Bundeslaender                      |
| ------------------------------------------------- | ---------------------------------- |
| Usable as canonical reference                     | BE, HH, NW, SN, TH                 |
| Usable with constraints                           | BB, HB, HE, MV, NI, RP, SH, BY, BW |
| Not reliable as sole key (current implementation) | SL, ST                             |


## Why These Classes

- Canonical states have clearer domain identifiers and stronger governance signals.
- Constraint states have usable IDs but weaker lifecycle guarantees, mixed generation logic, or unclear long-term persistence commitments.
- Non-sole-key states currently depend on source feature identifiers (`OBJECTID`-style) that are more likely to change across reimports.

## Suggested Operational Policy

- Keep per-state matching policy (not one national rule).
- For constraint states, always combine ID with secondary evidence (name/address/distance).
- For non-sole-key states, avoid hard identity assertions from ID alone.

