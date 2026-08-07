---
name: typescript7-migration
description: TypeScript 7 (native Go compiler) is wired up via Nx's aliasing scheme — don't "just bump typescript"
---

# TypeScript 7 is aliased, not plainly installed

TypeScript 7.0 (GA 2026-07-08) is a native Go port of `tsc`, roughly 10x faster, but it ships **without** a programmatic compiler API until 7.1. Anything that does `require('typescript')` — Nx's project-graph plugin, `typescript-eslint` — breaks outright on a naive version bump.

This workspace therefore uses Nx's official aliasing scheme. Root `package.json`:

```json
"typescript": "npm:@typescript/typescript6@^6.0.2",
"@typescript/native": "npm:typescript@^7.0.2"
```

`require('typescript')` resolves to the 6.0 API so Nx and eslint keep working, while the `tsc` CLI runs native 7.0. Validated when introduced: Nx project graph works, full-workspace `typecheck` output is byte-identical to plain TS 6.0.3, lint is clean, a fresh `api-portal` build succeeds.

## The editor half is separate — and it's the part that fixes OOM

The default VS Code TS extension resolves `node_modules/typescript` by name, which the aliasing above points at the *slow* 6.0 compat shim. `.vscode/settings.json` overrides it:

```json
"js/ts.experimental.useTsgo": true,
"js/ts.tsdk.path": "node_modules/@typescript/native/lib"
```

That also needs the `TypeScriptTeam.native-preview` VS Code extension installed locally. Without this half, the version alias does nothing for editor memory.

**Why:** the goal was editor performance — VS Code running out of memory in this large Nx monorepo — not just faster CI type-checks. Both halves are required.

**How to apply:** before recommending "just bump typescript" here, read this file — a naive bump breaks Nx entirely. Once Nx and typescript-eslint ship native TS7 support (check their changelogs), the aliasing may become unnecessary; verify current state before changing it.

## Do not "fix" the aliases — they look inverted and are not

`"typescript": "npm:@typescript/typescript6"` and `"@typescript/native": "npm:typescript@7"` read backwards. They are correct. An audit in 2026-08 flagged them as an inversion bug and nearly renamed them; renaming breaks Nx's project graph and typescript-eslint, both of which resolve `require('typescript')` and need the 6.x JS API.

Concretely, in `node_modules/.bin/`: **`tsc` is TS 7.0.2 native, `tsc6` is TS 6.0.3.**

| Consumer | Compiler | Why |
|---|---|---|
| every `typecheck` target (shells out to `tsc`) | **TS 7 native** | speed |
| VS Code (`js/ts.tsdk.path` → `@typescript/native/lib`) | **TS 7 native** | editor memory |
| `@nx/js:tsc` (lib `.d.ts` emit), typescript-eslint | **TS 6** | need the JS compiler API, which TS 7 native does not expose until 7.1 |

## Measured, 2026-08

- `apps/platform` (148k LOC): **2.38s** under TS 7 vs **13.39s** under TS 6 — byte-identical diagnostics.
- All 15 libs pass `--noEmit` under TS 7; declaration + `.d.ts.map` emit verified working.

## Libs now have their own `typecheck` target

Previously only apps did, so libs were type-checked only as a side effect of `dist` (TS 6 API). Every lib now has `typecheck` → `tsc --noEmit --project <lib>/tsconfig.lib.json`, which means libs get TS 7 speed too. The command comes from the `typecheck` entry in `nx.json` `targetDefaults`; each project only declares the bits that differ.
