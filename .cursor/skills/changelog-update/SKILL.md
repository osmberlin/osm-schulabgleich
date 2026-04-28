---
name: changelog-update
description: Update the project changelog registry from recent git commits. Use when the user asks to add missing changelog refs, draft descriptions, translate entries to German, group related commits, or mark non-user-facing work as hidden.
---

# Changelog Update

Use this short workflow:

1. Run `bun run changelog:prefill`.
2. Run `bun run changelog:verify` and read missing refs from output.
3. Group related refs into one registry entry where they describe one change.
4. Keep visible entries in German, short and user-facing.
5. Mark technical-only entries with `hide: true` and remove `descriptionMd`.
6. Run `bun run changelog` until verify/build pass.
7. Commit generated changelog files and registry updates with `git commit -m "Update changelog" -m "hide changelog"`

Rules:

- Registry file: `changelog.registry.yaml`.
- Visible entry shape: `refs` + `descriptionMd`.
- Hidden entry shape: `refs` + `hide: true` (no description).
