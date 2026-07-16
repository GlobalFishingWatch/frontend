# @globalfishingwatch/skills

Agent skills for GFW applications, shareable across repos. Each skill lives in `src/<skill-name>/`: a `SKILL.md` (instructions for the agent), runnable scripts, reference docs, and its own code — built into its own self-contained bundle so the whole `src/<skill-name>/` (or `dist/<skill-name>/`) folder can be copied anywhere and just works.

## Skills

- [encode-url](src/encode-url/SKILL.md) — build a fishing-map URL + TanStack Router navigation config from a navigation intent (route, layers, filters, time range, viewport).
- [decode-url](src/decode-url/SKILL.md) — decode a fishing-map URL into structured context of what the user is seeing.

Both use the real `parseWorkspace`/`stringifyWorkspace` from `@globalfishingwatch/dataviews-client`, so URLs match the app byte-for-byte. `encode-url` owns the shared logic (layer dictionary, route matching) and `decode-url` imports it from there.

## Programmatic use

```ts
import { decodeMapUrl } from '@globalfishingwatch/skills/decode-url'
import { encodeMapUrl } from '@globalfishingwatch/skills/encode-url'

const context = decodeMapUrl(currentUrl)
const { navigation, path } = encodeMapUrl({ route: { type: 'workspace' }, state: context.raw })
```

`@globalfishingwatch/skills` (no subpath) also re-exports both, for convenience.

## Development

```bash
pnpm nx dist skills   # build (also builds dataviews-client deps)
```

This produces `libs/skills/dist/`: a combined `index.js`, plus one self-contained folder per skill (`encode-url/`, `decode-url/`) — each with its own `index.js` bundle alongside its `SKILL.md`, `scripts/`, and `references/`.

Skill scripts run with plain `node` (>= 23) and import their own skill's bundle as `@globalfishingwatch/skills/<skill-name>`, resolved by `scripts/register-gfw-resolver.mjs` from (in order): a sibling `index.js` (dist output), a `../../dist/<skill-name>/index.js` in this monorepo (unbuilt source layout), or — once installed as an npm package — normal `node_modules` resolution via the package's `exports` map.

## Installing a skill into Claude Code (or another agent)

Each skill folder is self-contained (own bundle + `SKILL.md` + `scripts/` + `references/`), so installing one is just copying its folder into the target skills directory.

### From this monorepo

```bash
pnpm nx dist skills

# Claude Code, this project only
cp -r libs/skills/dist/encode-url .claude/skills/

# Claude Code, all your projects
cp -r libs/skills/dist/decode-url ~/.claude/skills/

# any other agent that reads SKILL.md folders — same idea, just point at its skills dir
cp -r libs/skills/dist/encode-url /path/to/agent/skills/
```

### From the published npm package

```bash
pnpm add @globalfishingwatch/skills
cp -r node_modules/@globalfishingwatch/skills/dist/encode-url ~/.claude/skills/
cp -r node_modules/@globalfishingwatch/skills/dist/decode-url ~/.claude/skills/
```

### Into [gfw-agent](https://github.com/GlobalFishingWatch/gfw-agent)

Its skills live at repo root `skills/<skill-name>/` (not `.claude/skills/`), and each agent profile (`agents/<name>.json`) opts in via a `skills` array:

```bash
pnpm add @globalfishingwatch/skills
cp -r node_modules/@globalfishingwatch/skills/dist/encode-url skills/
cp -r node_modules/@globalfishingwatch/skills/dist/decode-url skills/
```

Then add the skill name(s) to the profile, e.g. `agents/default.json`:

```json
"skills": ["encode-url", "decode-url"]
```

## Adding a new skill

Create `libs/skills/src/<skill-name>/` with `SKILL.md` (+ optional `scripts/`, `references/`, and code). If it needs logic another skill already has (e.g. the layer dictionary or route matching in `encode-url/`), import it from there rather than duplicating it. Export the skill's public API from an `index.ts`, add its path to `src/index.ts`, and:

- add it as an `additionalEntryPoints` entry + `exports["./<skill-name>"]` in `package.json`, so it gets its own bundle
- add its `assets` globs (`SKILL.md`, `scripts/**/*`, `references/**/*`, …) to the `dist` target in `project.json`
