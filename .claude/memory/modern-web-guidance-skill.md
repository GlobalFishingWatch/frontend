---
name: modern-web-guidance-skill
description: the modern-web-guidance skill is copied unchanged from upstream; repo rules for it (pnpx, scope, browser floor) live here, not in its SKILL.md
---

# `modern-web-guidance` skill: upstream copy, repo rules here

`.claude/skills/modern-web-guidance/SKILL.md` is Google Chrome's Modern Web Guidance skill
(https://developer.chrome.com/docs/modern-web-guidance), copied unchanged from
`GoogleChrome/modern-web-guidance`. It is committed on purpose so the whole team gets it
(decided 2026-11-18).

**Why:** we want to keep it in step with upstream. Any edit to `SKILL.md` is lost on the next
refresh, so every repo-specific rule lives in this file or in a project memory instead.

**How to apply:**

- **Do not edit `SKILL.md`.** To refresh it, copy the upstream `SKILL.md` over it again, keep the
  "Vendored from" header comment and update its version. The upstream file pins
  `--skill-version`, so the commands stay matched to it. Then check the rules below still hold.
- **Run its commands with `pnpx`, never `npx`.** This repo is pnpm-only. `SKILL.md` shows
  `npx -y modern-web-guidance@latest …`; run `pnpx modern-web-guidance@latest …` with the same
  arguments (`pnpx` takes no `-y`). The skill itself says to prefer `pnpx` when pnpm is present.
- **Use it only for browser DOM, CSS and HTML work** in `apps/*` and `libs/ui-components`. Skip
  it for deck.gl/WebGL layers, Redux, data transforms, server routes, Nx and build config. The
  guides do not cover those, and every call is a network round trip.
- **Browser support:** `apps/platform` targets browsers older than the skill's Baseline Widely
  available default. Read [[platform-browser-floor]] before trusting a guide's "no fallback
  needed". Never follow its tip to set Vite `build.target: 'esnext'` in platform.
- Treat a guide as advice, not as the local standard: where it conflicts with a memory file in
  this repo, the memory file wins.
