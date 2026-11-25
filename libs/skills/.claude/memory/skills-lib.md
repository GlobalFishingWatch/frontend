---
name: skills-lib
description: libs/skills is an esbuild bundle published for gfw-agent; only the platform assistant imports it (context-tools)
---

# libs/skills is published for other repos; apps import only context-tools

`@globalfishingwatch/skills` lives here so esbuild can inline [[platform-config-package]] and `@globalfishingwatch/*`. The only app import is `@globalfishingwatch/skills/context-tools` (platform assistant, since 2026-11-24): the context tool names, descriptions and output types (`AssistantContextToolOutputs`) live here so the app and gfw-agent share one definition. Every app tool function is annotated with its output type, so an output change in the app fails `typecheck` until this contract changes too. The shapes are split per page in `src/context-tools/types/<page>-context-tool.types.ts`, re-exported by `types/index.ts`. They import each other with `import type` and a `.js` extension (`./types/index.js`, never `./types`: `nodenext` does not resolve directory indexes), and the `build` tsc runs with `--module nodenext`: the `.d.ts` files are published as emitted, and gfw-agent resolves them with `nodenext`, where an extensionless relative import does not resolve. Keep the subpath free of runtime imports too — Vite serves it from src. That subpath has a `development` export condition (src) so the app resolves it like other libs; keep it free of node-only code and of the encode/decode modules. It is the only entry that ships `.d.ts` files: `build` runs `bundle` (esbuild, `declaration: false`) then `tsc` on `src/context-tools/index.ts`, which emits it and the files it imports. Encode/decode types would reference the workspace packages esbuild inlines, which are not in the tarball, so gfw-agent hand-writes those in `src/types/gfw-skills.d.ts`. `thirdParty: true` makes the tarball self-contained — workspace packages stay in `devDependencies` (`linting/nx.js` ignores this manifest so `--fix` cannot promote them).

**Why:** URL encoding must go through `stringifyWorkspace` / `parseWorkspace`. An LLM must never hand-build these URLs.

**How to apply:** `pnpm nx build skills` **from the workspace root** — `@nx/esbuild` resolves entry points against `process.cwd()`, so running it from `libs/skills/` fails with `Could not resolve "libs/skills/src/index.ts"`. Then round-trip every URL in `libs/skills/src/encode-url/references/examples-conversations.md`. Doc sync: [[encode-url-skill-maintenance]].

## It is also the channel for app constants other repos need (since 2026-09-30)

`gfw-agent`'s `scripts/sync-user-guide.ts` imports `USER_GUIDE_SECTIONS` (source of truth: `@platform/config/user-guide`) from this package, to link only to user guide slugs the app can open. It used to regex-parse a sibling `../frontend` checkout. Keep `@platform/config` private and build-less ([[platform-config-package]]); re-export from `src/index.ts` here instead. Changing the constant only reaches the agent after a skills release, a version bump in `gfw-agent`, and a `pnpm guide:sync` there.
