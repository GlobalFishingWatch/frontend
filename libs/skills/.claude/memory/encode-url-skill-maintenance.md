---
name: encode-url-skill-maintenance
description: How to sync the encode-url skill docs with app types — follow MAINTENANCE.md
---

# Syncing the encode-url skill docs

The `encode-url` skill (`libs/skills/src/encode-url/`) carries its own update prompt at `libs/skills/src/encode-url/MAINTENANCE.md`. When asked to "check for updates" or sync the skill docs, follow that file rather than re-deriving the process:

1. Diff documented params against the JSDoc'd state types — `apps/platform/types/index.ts`, `features/_reports/reports.types.ts`, `features/_vessels/vessel/vessel.types.ts`, `features/_vessels/search/search.types.ts`.
2. Diff enum values using the **"Value sources (for update checks)"** table inside MAINTENANCE.md, which maps each param to the exact symbol and file it was copied from. That table deliberately lives in MAINTENANCE.md and not in the runtime-loaded references, to keep skill token cost down.
3. Verify with `pnpm nx build skills` then `node libs/skills/src/encode-url/scripts/encode-url.mjs`. See [[skills-lib]].

**Why:** the value sources and update requirements were persisted (2026-07-16) so each update round is a mechanical diff instead of re-discovery.

**How to apply:** start from MAINTENANCE.md's prompt verbatim. Keep coverage curated — internal params stay in the "never set" footnote. Known traps: URL param `reportResultsPerPage` vs type field `reportVesselResultsPerPage`; the FAO context instance is `context-layer-fao-areas`, not `context-layer-fao`; `visibleEvents` uses `gaps`, not `gap`.
