# @globalfishingwatch/skills

Agent skills for GFW applications, shareable across repos. Each skill is a self-contained folder with a `SKILL.md` (instructions for the agent) plus runnable scripts and reference docs.

## Skills

- [encode-url](encode-url/SKILL.md) — build a fishing-map URL + TanStack Router navigation config from a navigation intent (route, layers, filters, time range, viewport).
- [decode-url](decode-url/SKILL.md) — decode a fishing-map URL into structured context of what the user is seeing.

Both use the real `parseWorkspace`/`stringifyWorkspace` from `@globalfishingwatch/dataviews-client`, so URLs match the app byte-for-byte.

## Programmatic use

```ts
import { decodeMapUrl, encodeMapUrl } from '@globalfishingwatch/skills'

const context = decodeMapUrl(currentUrl)
const { navigation, path } = encodeMapUrl({ route: { type: 'workspace' }, state: context.raw })
```

## Development

```bash
pnpm nx dist skills   # build (also builds dataviews-client deps)
```

Skill scripts run with plain `node` (>= 23) and resolve `@globalfishingwatch/*` packages from sibling `libs/*/dist` builds in this monorepo, or from `node_modules/@globalfishingwatch/*` when installed as a package (see `*/scripts/register-gfw-resolver.mjs`).

## Adding a new skill

Create `libs/skills/<skill-name>/SKILL.md` (+ optional `scripts/`, `references/`), add shared logic under `src/` if other repos should import it, and list the folder in `package.json` `files`.
