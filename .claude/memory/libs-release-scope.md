---
name: libs-release-scope
description: Why the libs release group sets updateDependents "never", and why the affected base only matches lib tags
---

# Libs release versions only the projects it publishes (as of 2026-10-28)

`nx release` publishes only the `--projects` it is given, but versioning with the default
`updateDependents: "auto"` also patch-bumps, commits and **tags** every dependent. A
`libs-release.yml` dispatch for `api-types` alone bumped and tagged 13 libs and published one.
The libs group in `nx.json` sets `"updateDependents": "never"` so the commit, the tags and the
publish cover the same projects.

**Why:** a tag for a version that never reached npm breaks the "since the last tag" logic and
leaves version gaps. Dependents do not need a republish for a patch or minor bump: with
`preserveLocalDependencyProtocols`, `workspace:^` publishes as `^<version>`. For a major bump,
release with `project: affected`. `build` inputs include `^production`, so the dependents are
in that list anyway.

**How to apply:** do not drop `updateDependents: "never"` unless the publish step is also
changed to publish every versioned project. Check with
`pnpm nx release patch --projects=<lib> --dry-run --verbose --skip-publish`; the `git tag` lines
must match the projects passed in.

## The affected base must be a lib tag

Apps deploy under `@gfw/*` tags too (`@gfw/platform@…`). A bare `git describe --match '@gfw/*'`
returned the last app deploy, so `affected` silently skipped libs changed before that deploy.
The resolve step passes one `--match "@gfw/<lib>@*"` per project of the libs group.
`i18n-labels` is excluded because it releases on every labels push.

See [[task-based-affected]] for why the affected query carries `-t build`.
