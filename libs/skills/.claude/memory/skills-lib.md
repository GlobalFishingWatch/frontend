---
name: skills-lib
description: libs/skills is a publish-only esbuild bundle of encode-url/decode-url; apps never import it
---

# libs/skills is published for other repos, not used by apps

`@globalfishingwatch/skills` lives here so esbuild can inline [[platform-config-package]] and `@globalfishingwatch/*`. Nothing in `apps/` imports it. `thirdParty: true` makes the tarball self-contained — workspace packages stay in `devDependencies` (`linting/nx.js` ignores this manifest so `--fix` cannot promote them).

**Why:** URL encoding must go through `stringifyWorkspace` / `parseWorkspace`. An LLM must never hand-build these URLs.

**How to apply:** `pnpm nx build skills` **from the workspace root** — `@nx/esbuild` resolves entry points against `process.cwd()`, so running it from `libs/skills/` fails with `Could not resolve "libs/skills/src/index.ts"`. Then round-trip every URL in `libs/skills/src/encode-url/references/examples-conversations.md`. Doc sync: [[encode-url-skill-maintenance]].

## It is also the channel for app constants other repos need (since 2026-09-30)

`gfw-agent`'s `scripts/sync-user-guide.ts` imports `USER_GUIDE_SECTIONS` (source of truth: `@platform/config/user-guide`) from this package, to link only to user guide slugs the app can open. It used to regex-parse a sibling `../frontend` checkout. Keep `@platform/config` private and build-less ([[platform-config-package]]); re-export from `src/index.ts` here instead. Changing the constant only reaches the agent after a skills release, a version bump in `gfw-agent`, and a `pnpm guide:sync` there.
