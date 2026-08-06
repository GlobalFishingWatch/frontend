---
name: skills-lib
description: libs/skills — encode-url/decode-url agent skills; esbuild-bundled, verified by round-tripping the example conversations
---

# libs/skills holds the map chatbot's URL skills

`libs/skills` (`@globalfishingwatch/skills`) holds the agent skills `encode-url` and `decode-url`, used by the map chatbot. Source lives under `libs/skills/src/{encode-url,decode-url}/`.

Targets (`libs/skills/project.json`):

| Target | What it does |
| --- | --- |
| `bundle` | esbuild → self-contained ESM in `libs/skills/dist`, plus SKILL.md / references / scripts copied as assets |
| `types` | `dts-bundle-generator` → `dist/**/*.d.ts` |
| `claude:encode-url` / `claude:decode-url` | copy the built skill into `~/.claude/skills/` for local use |

`bundle` runs esbuild with `platform: node`, a `createRequire` banner, and aliases: [[platform-config-package]] source (`@platform/config` → `apps/platform/config/index.ts`) plus the local dists of api-types, api-client, data-transforms, deck-layers, deck-loaders, datasets-client and dataviews-client. Skill scripts run under plain node ≥ 23 via `scripts/register-gfw-resolver.mjs`.

**Why:** URL query encoding (parameter abbreviations plus `~N` tokenization) must go through the real `stringifyWorkspace` / `parseWorkspace`. An LLM must never hand-build these URLs.

**How to apply:** verify a change by decoding and re-encoding every URL in `libs/skills/src/encode-url/references/examples-conversations.md` — the parsed states must deep-equal. Run `pnpm nx bundle skills`, then `node libs/skills/src/encode-url/scripts/encode-url.mjs`. Versioned dataview slugs support the `{PIPE_DATASET_VERSION}` token, and the encoder auto-fills `dataviewId` for any `id` containing `__`. See [[encode-url-skill-maintenance]] for the doc-sync checklist.
