# Modern Web Guidance: evaluation and legacy-scan results

_Date: 2026-11-17 · Package checked: `modern-web-guidance@1.0.1` (published 2026-11-16) · Repo: `GlobalFishingWatch/frontend`_

## Summary

- **What it is.** Google Chrome's Modern Web Guidance is a set of agent _skills_ plus a CLI with
  curated guides on current web platform APIs, covering performance, accessibility, CSS, forms and
  security. It has no testing or code-quality guides.
- **Fit for this repo.** Narrow. `apps/platform` is already fairly modern, and the hardest code here
  is deck.gl/WebGL, Redux, data transforms and Nx, none of which it covers.
- **Recommendation.** Use the standalone `legacy-scan` CLI once in a while and triage its output.
  You don't need to install the Claude Code plugin to get that value.
- **Scan result.** 20 findings across the repo. 6 are real fixes, counting one real bug that the
  scan missed and that came up while verifying its findings. About 10 are optional, 2 would break
  things if applied, and 4 aren't worth doing.

## Ways to use it

| Goal                                                          | How                                                                          |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| One-off check of legacy patterns                              | `npx modern-web-guidance@1.0.1 legacy-scan <path>` (standalone, no AI)       |
| Triage or fix findings with Claude                            | Run the scan with `--json`, then give the output to Claude. No plugin needed |
| Claude follows the guidance automatically during feature work | Install the Claude Code plugin (below)                                       |

### Install options

```sh
# Claude Code plugin. Defaults to user scope (all projects on your machine).
# Add --scope project to write it into .claude/settings.json instead.
claude plugin marketplace add GoogleChrome/modern-web-guidance
claude plugin install modern-web-guidance@googlechrome

# Project install through the package's own wizard (writes files into the repo; check git status after)
npx modern-web-guidance@latest install            # or: install --choose  (pick skill packs)
npx modern-web-guidance@latest update
```

Skill packs: **`modern-web-guidance`** (relevant here) and **`chrome-extensions`** (Manifest V3, Web
Store; not relevant).

## Findings

### Fix: real bugs

**1. Enter submits while an input method (IME) is still composing text (3 sites)**

People typing Japanese, Chinese or Korean press Enter to confirm a character, and these handlers
submit the half-written text instead.

- `apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx:378`: chat textarea
- `apps/platform/features/_vessels/track-correction/TrackCorrectionEdit.tsx:256`: comment input
- `apps/platform/features/_vessels/track-correction/TrackCorrectionNew.tsx:277`: comment input

Fix: add this inside each handler, after `preventDefault()`. The `229` check covers Safari, which
doesn't set `isComposing` reliably, per the guide.

```ts
if (e.nativeEvent.isComposing || e.keyCode === 229) return
```

**2. Unpolyfilled `.toReversed()` inside the build target (not flagged by the scan)**

- `apps/platform/features/_map/dataviews/dataviews.hooks.ts:215`
- `toReversed` needs Chrome 110 and Safari 16, but the client build targets Chrome 87 and Safari 15.
- `utils/polyfills.ts` adds `toSorted`, `findLast` and `findLastIndex` for older browsers, but not
  `toReversed`. So "migrate all dataviews" will most likely throw a `TypeError` on those browsers.
- Fix: add a `toReversed` polyfill next to the others, or use `.slice().reverse()`.

**3. Row-selection checkbox can't be reached by keyboard**

- `apps/data-download-portal/src/components/table/table.module.scss:157` and `:163`. The
  component is in `table.tsx:100`.
- The real `<input type="checkbox">` is hidden with `display: none`, and the visible box is drawn
  on an **empty** `<label>`. Keyboard users can't tab to it or toggle it, and screen readers get a
  control with no name.
- Fix: show the native input and style it directly, with `accent-color: var(--primary-color)` or
  `appearance: none` plus `::before`/`::after` on the input itself. Add an `aria-label`, such as
  "Select row" or "Select all". `indeterminate` is already set on the native input
  (`table.tsx:94`), so the select-all state keeps working.

### Optional: real but low value

| Where                                                                                             | Suggestion                                            | Note                                                                                                                     |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `apps/platform/.../chat/ChatSessionMessages.tsx:316`                                              | JS textarea auto-resize → CSS `field-sizing: content` | Widely supported only since 2026-06 (Firefox 152). With current targets the JS stays as a fallback, so the gain is small |
| `apps/platform/features/_map/dataviews/dataviews.hooks.ts:41`, `:54`                              | `[...a].sort()` → `a.toSorted()`                      | Safe (polyfilled). Style only                                                                                            |
| `apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityCombinedSourceField.tsx:54` | same                                                  | same                                                                                                                     |
| `apps/platform/features/_vessels/vessel/vessel.utils.ts:62`, `:344`                               | same                                                  | same                                                                                                                     |
| `apps/platform/queries/map/vessel-events-api.ts:49`                                               | same                                                  | same                                                                                                                     |
| `apps/platform/utils/info.ts:208`                                                                 | same                                                  | same                                                                                                                     |
| `apps/data-download-portal/src/utils/sorting.tsx:4`, `:13`                                        | same                                                  | Safe: the app uses Vite 8's default targets (Chrome 111 / Safari 16.4)                                                   |
| `apps/port-labeler/src/utils/group-by.ts:7`                                                       | `reduce` grouping → `Object.groupBy()`                | Callers only use `Object.keys` and indexing. The result has no prototype. Internal tool, low priority                    |

### Don't apply

| Where                                                                                                              | Why                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `apps/platform/features/_map/workspace/vessels/VesselTracksLegend.tsx:130` (`.slice().reverse()` → `toReversed()`) | `toReversed` isn't polyfilled, so this would add a second copy of bug 2                                      |
| `apps/platform/scripts/load-boundaries/load-boundaries.ts:392` (`[...walk.externals].sort()`)                      | **False flag**: `externals` is a `Map`, which has no `toSorted`. The guide's own rules say to drop this case |

### Not worth it

- `apps/platform/scripts/load-boundaries/load-boundaries.ts:349`: build script run by Node.
  Cosmetic.
- `apps/platform/features/debug/DebugTestingTools.tsx:18`: debug-only tool.

## Takeaways

- The scan's best catch was the IME Enter bug, which a grep wouldn't have found.
- The scan knows nothing about this project's browser targets or polyfills. One of its suggestions
  would have caused a crash on browsers the app still supports, so always triage the output.
- The plugin is optional. Try it at user scope for a while before installing it for the whole team.

## Sources

- [Chrome for Developers: Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance)
- [GoogleChrome/modern-web-guidance README](https://raw.githubusercontent.com/GoogleChrome/modern-web-guidance/main/README.md)
- [GoogleChrome/modern-web-guidance-src](https://github.com/GoogleChrome/modern-web-guidance-src)
- [npm: modern-web-guidance](https://www.npmjs.com/package/modern-web-guidance) (v1.0.1 tarball, inspected locally)
- Guides retrieved with the CLI: `ime-safe-enter-submit`, `form-fields-automatically-fit-contents`, `js`
- [Google I/O 2026 Chrome updates](https://developer.chrome.com/blog/chrome-at-io26?hl=en)
