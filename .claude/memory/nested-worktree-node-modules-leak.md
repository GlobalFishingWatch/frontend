---
name: nested-worktree-node-modules-leak
description: Builds inside .claude/worktrees/* can resolve packages from the main checkout's node_modules and fail; benchmark or build in a worktree outside the repo tree
---

# Worktrees under `.claude/worktrees/` resolve the parent checkout's `node_modules`

Claude Code worktrees live at `<repo>/.claude/worktrees/<name>/`, inside the main checkout. A
package that pnpm does not hoist in the worktree is resolved by Node/Vite walking up the tree and
landing in the **main** checkout's `node_modules`. That copy can be a different version.

Seen 2026-11-18: `nx run platform:build` failed in a worktree with
`[MISSING_EXPORT] "parseCookie" is not exported by "../../../../../node_modules/cookie-es/…"`.
The path points five levels up, which is the main checkout. That copy was `cookie-es@2.0.0`, but
`h3` needs `^3.1.1`. The same commit built cleanly in a detached `git worktree add` outside the
repo tree and in CI.

**Why:** a clean `pnpm install` in the worktree does not fix it. The worktree gets correct
isolated deps, but resolution still falls through to the parent for anything not hoisted locally.

**How to apply:** when a build or test fails only inside `.claude/worktrees/*` with a
missing-export or version-mismatch error, check whether the resolved path climbs out of the
worktree before debugging the code. For builds, benchmarks or e2e runs, use a worktree outside the
repo (`git worktree add --detach /tmp/... HEAD`) and remove it afterwards.
