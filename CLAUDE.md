<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

## This workspace

pnpm only (`preinstall` runs `only-allow pnpm`), pinned `pnpm@11.15.1`. Never use npm/yarn here.

Apps in `apps/*`, shared libs in `libs/*`. pnpm workspace members: `linting`, `apps/*`, `apps/platform/config`, `libs/*`. Every app now carries a `package.json` and resolves `@globalfishingwatch/*` through real pnpm symlinks — the `tsconfig.base.json` paths that used to stand in for them are gone. App manifests list **only** `workspace:` deps — npm packages are declared once in the root `package.json`; see `.claude/memory/app-dependency-catalog.md`.

`apps/platform` is the main map app. It was named `fishing-map` — older notes, memory files and branches still say so. Current names: `apps/platform`, project `platform`, e2e project `platform-e2e`, config package `@platform/config`.

### Lib resolution (read before touching tsconfig or vite config)

Libs are consumed via built `dist/`, not src paths. Each `libs/*/package.json` export has three conditions: `types` → `dist/*.d.ts`, `development` → `src/*` (Vite dev only, gives HMR without lib rebuilds), `default` → `dist/*`. Consequence: after editing a lib's public types, run that lib's `build` target or typecheck fails on correct code. Details and the traps in `.claude/memory/platform-dist-workspace-link.md`.

### Commands

| Task               | Command                                            |
| ------------------ | -------------------------------------------------- |
| Run the map app    | `pnpm nx start platform` (port 3003)               |
| Build a lib's dist | `pnpm nx build <lib>` (emits to `libs/<lib>/dist`) |
| Typecheck          | `pnpm nx typecheck platform`                       |
| Build app          | `pnpm nx build platform`                           |
| e2e                | `pnpm nx test platform-e2e`                        |

Vitest suites are currently broken in `platform` — don't run them to validate changes. Verify with typecheck + lint, e2e, or a real SSR build. See `.claude/memory/platform-testing.md`.

## Team knowledge

Durable facts about this repo live in `.claude/memory/`, one fact per file, imported below. They are committed and reviewed like code.

**Claude: this folder is where repo knowledge goes.** When you learn something durable about this codebase — an architectural constraint, a non-obvious build behavior, a trap that cost time to find — write it as a new file in `.claude/memory/` and add an import line here. Do **not** put it in your per-user memory directory; that one is only for an individual's personal working preferences. Rules of thumb:

- One fact per file, kebab-case filename, `name` + `description` frontmatter, an `# H1`, then `**Why:**` and `**How to apply:**`.
- Cross-link with `[[other-file-name]]`.
- Prefer updating an existing file over adding a near-duplicate.
- Don't record what the code or git history already says. Record the reasoning that isn't in them.
- Date any claim that will age ("as of 2026-08"), so a stale note is recognisable as stale.

@.claude/memory/platform-dist-workspace-link.md
@.claude/memory/lib-build-target-name.md
@.claude/memory/app-dependency-catalog.md
@.claude/memory/platform-config-package.md
@.claude/memory/platform-testing.md
@.claude/memory/skills-lib.md
@.claude/memory/encode-url-skill-maintenance.md
@.claude/memory/typescript7-migration.md
@.claude/memory/locales-source-is-the-only-editable.md
