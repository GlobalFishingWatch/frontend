---
name: platform-browser-floor
description: platform's client targets chrome87/safari15, below Baseline Widely available — new JS APIs need a polyfill, and build.target must never be raised
---

# platform supports browsers below Baseline Widely available

**Browser Support:** the `apps/platform` client build targets
`['chrome87', 'safari15', 'firefox115', 'edge111']` (`vite.config.ts`,
`environments.client.build.target`). That is older than Baseline Widely available
(Chrome 111 / Safari 16.4), which is what Vite 8 and the `modern-web-guidance` skill assume by
default ([[modern-web-guidance-skill]]). A guide that says a feature is safe without a fallback is
**not** safe here unless that feature shipped in Chrome 87 and Safari 15.

**Why:** the floor is the oldest browsers seen failing in Sentry (FRONTEND-NE, 2026-11): Chrome
Mobile 87 / Android WebViews and iOS 15. Vite's default target emitted ES2022 class static
blocks, a `SyntaxError` on Chrome < 94, which crashed the whole app for those users.

**How to apply:**

- Never raise or replace `build.target`, and never set it to `'esnext'` — even though the
  `modern-web-guidance` skill suggests `esnext` for top-level `await`. Load the module with a
  dynamic `import()` instead.
- Syntax is down-levelled by the build. **Runtime APIs are not.** A newer built-in method
  (`Array.prototype.toReversed`, `Object.groupBy`, `Promise.withResolvers`, …) needs a fallback.
  Either add it to `utils/polyfills.ts`, which `client.tsx` imports first, or avoid the method.
- As of 2026-11, `utils/polyfills.ts` adds `toSorted`, `toReversed`, `findLast`,
  `findLastIndex`, `at` and `Object.hasOwn`. TypeScript's `lib` types every ES2023 method, so a
  missing polyfill only fails at runtime on an old browser — check this list before using one.
- For CSS and HTML features, follow the guide's fallback advice as for a non-Baseline feature,
  unless the feature shipped in Chrome 87 and Safari 15.
- Other apps in `apps/*` use Vite's default targets, so the skill's Baseline default fits them.
