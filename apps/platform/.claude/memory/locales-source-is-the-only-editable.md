---
name: locales-source-is-the-only-editable
description: How to add a translation — key in code first, then the English value by hand in locales/source; never touch the other locales
---

# Adding a translation: code first, then `source` by hand

`apps/platform/public/locales/` holds seven locale folders. **`source/` is the only one anyone
edits.** `en`, `es`, `fr`, `id`, `pt` and `val` are Crowdin output — `crowdin.yml` maps
`apps/platform/public/locales/source` → `%two_letters_code%`.

`en` is _not_ the source. It is Crowdin's English translation _of_ `source`, so its values can
differ from what the code says.

## The workflow — this order, always

1. **Write the key in the code first.**

   ```tsx
   t((t) => t.vesselGroupReport.insights.blackList)
   ```

   If the key is built at runtime (`t((t) => t.vessel[field])`) the extractor cannot see it — add
   it to `preservePatterns` in `apps/platform/i18next.config.ts` instead.

   `i18next-cli extract` deletes every key it cannot find a reference for, so this step is what
   keeps the key alive. The dev server's `i18n:watch` runs extract automatically; otherwise run
   `pnpm nx run platform:i18n`. The key appears in `source/translations.json` with an **empty**
   value.

2. **Open `apps/platform/public/locales/source/translations.json` and type the English value**
   into that newly created key.

Crowdin picks it up from `source` on the next sync and fills the other six locales.

**Why this order:** step 2 before step 1 is wasted work — a value written for a key with no code
reference is deleted by the next `extract`. And a `defaultValue` in code does _not_ populate
`source`; it is only the runtime fallback shown until the value exists. (The generated key stays
empty because `primaryLanguage` is `'en'` while `locales` is `['source']`, so `extract`'s
default-syncing never applies to the file it writes. Left as-is deliberately.)

**How to apply:**

- Reword English: edit the value in `source/translations.json`.
- Delete a key: remove the last code reference (and any `preservePatterns` entry), then re-run
  extract. Do not delete it from the JSON by hand — extract does that.
- **Never open `en`, `es`, `fr`, `id`, `pt` or `val`.** A hand edit there is silently reverted on
  the next Crowdin sync, and it never reaches Crowdin because only `source` is uploaded. Dead keys
  left behind in those files clear themselves once they are gone from `source`. Reading them is
  fine; writing is not. Never script a pass that writes across the locale folders.

## Trap: a running `extract --watch` pins the config it started with

`pnpm nx start platform` → `i18n:watch` → `i18next-cli extract --watch`, which reads
`i18next.config.ts` **once**. Edit that file while the dev server runs and the watcher keeps
applying the _old_ config, silently stripping keys on its next fire — which looks exactly like an
nx cache bug and is not one.

**After changing `i18next.config.ts`, restart the dev server.**

The watcher also used to retrigger itself: `--with-types` writes `features/i18n/i18n.types.d.ts`,
which the `features/**/*.ts` input glob matched. `'**/*.d.ts'` is in `extract.ignore` for that
reason.

## Corollary for the nx targets

`i18n` and `i18n:extract` declare **no** `outputs` covering `public/locales`.
`source/translations.json` is a tracked file that extract rewrites in place, not a build artifact;
declaring it as a cache output makes nx believe it owns the file. Same trap as
[[lib-build-target-name]].
