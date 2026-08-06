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
