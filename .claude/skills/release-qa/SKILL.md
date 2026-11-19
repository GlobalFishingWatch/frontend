---
name: release-qa
description: Build the shared release QA board for apps/platform — diff develop against the last deployed @gfw/platform@X.Y.Z tag, map the changes onto apps/platform/platform-features-list.md, and publish a ranked pass/fail checklist artifact the team ticks together. Use when someone is about to release / deploy platform, asks "what do we need to test", "release checklist", "QA board", "changelog for the release", or names a platform tag to compare against.
---

# Platform release QA board

Output: a published Artifact with three tiers of checks. Each check has links to the commits behind it, and the
pass/fail ticks are shared through the `db` capability. `template.html`, next to this file, is the last board
that shipped. Reuse it as-is and change only the data. Do not redesign it.

Previous boards, for reference:

- 5.0.25 → develop (2026-10-19): https://claude.ai/artifact/BgMxK7tHo92YYjMw6syLKX
- develop → main (2026-09-14): https://claude.ai/artifact/LNr8LtmJZBQ9pu8aYLDkf3

## 1. Pin the range

```bash
git fetch --tags origin
git tag -l '@gfw/platform@*' --sort=-v:refname | head -3   # base = the tag the user names, else the newest
BASE=@gfw/platform@X.Y.Z; HEAD=develop
git merge-base --is-ancestor $BASE $HEAD && echo ok         # if not an ancestor, stop and ask
git rev-list --count $BASE..$HEAD
git diff --shortstat $BASE $HEAD
git log --no-merges --format='%h %ad %s' --date=short $BASE..$HEAD | grep -vi crowdin > $SCRATCH/commits.txt
```

Also run `git log --oneline $HEAD..origin/main`. If main has release-only commits, mention them in the footer.

## 2. Find what moved

- Path weight: `git diff --stat=200 $BASE $HEAD -- apps/platform libs`, grouped by feature folder.
- Read **every** line of `commits.txt` (use Read on the saved file, since it is too long for inline output).
  Cluster the commits by feature, not by date.
- Feature flags. Diff `apps/platform/features/debug/debug.slice.ts`. A removed flag means the feature now ships
  to everyone, so it goes in Tier 1 and the board must say so. Also check `VITE_*` gates in
  `apps/platform/data/map/config.ts` against `.env`, and flag any whose production value is unknown.
- User gating (`selectIsGFWUser`, `GFWOnly`, `userGroup`). Name the audience in the check text.
- Spot-check with `git show --stat <sha>` whenever a commit subject is vague (`wip`, `cr`, `tweaks`), or when one
  commit seems to undo another. Example: "add tracks in positions", then "disable tracks for now". Make that pair
  a "confirm intended state" check. Do not guess the outcome.

## 3. Map onto the features list

Open `apps/platform/platform-features-list.md`. For each cluster:

- If it maps onto a list line, use the user-visible behaviour in `text`. Put the list path in `why`, for example
  `Sidebar → Vessels → Filter by speed / depth`.
- If it is a new area with no list section, add the `new` badge and say in the group note that the list needs a
  section.
- A feature-list area with ≤2 trivial file touches goes in the "Barely touched" box. Verify this with
  `git diff --name-only $BASE $HEAD | grep -i <area>`.

Tiers:

| Tier | Meaning                                                                    |
| ---- | -------------------------------------------------------------------------- |
| 01   | New, rewritten, flag removed, or data/pipeline migration — test everything |
| 02   | Real behaviour change in an existing feature — test the named behaviour    |
| 03   | Dependency bumps, Sentry fixes, perf, infra — smoke pass                   |

Write each check as something a tester can observe ("Sort arrow is right on first selection"), not as a
description of the code change. Aim for 80–120 checks. Merge near-duplicates.

## 4. Fill the template

Copy `template.html` to `$SCRATCH/release-qa-<base>/index.html`, then edit only these parts:

- `<title>` and `<h1>`: `<base version> → Develop QA`
- the lede, and the `.refs` chips (base, head sha, commit counts, files, +/−, diff date)
- the `TIERS` array (`id` must be unique and stable, `commits` are 10-char shas)
- the "Barely touched" list and the footer note
- `const LS = 'gfw-qa-<base>-develop'`

Before publishing, confirm that every sha is in range. **This catches typos and invented hashes:**

```bash
for h in $(grep -oE "'[0-9a-f]{10}'" index.html | tr -d "'" | sort -u); do
  git merge-base --is-ancestor $h $HEAD && ! git merge-base --is-ancestor $h $BASE || echo "BAD $h"
done
```

## 5. Publish

- Publish a **new** artifact. Never overwrite an older board, because its ticks belong to that release. Use
  `icon: "checklist"` and `capabilities: {"db": {}}`, plus a one-line `description`.
- Run the functional pass: `ArtifactData list` on collection `checks` must return empty without errors.
- Reply with the link, the tier counts, and the items marked "confirm". Tell the user the board is private until
  they share it from the page's Share menu.
- Remind the user, per Global Fishing Watch AI policy, to review the board before circulating it. The team owns
  the content. Testers should open the commit links to verify any item they doubt.

## 6. API config PRs (when the user names any)

Changes to `GlobalFishingWatch/gfw-terraform-api-resources` go on a **separate** board, cross-linked with the
frontend one. Example: https://claude.ai/artifact/HSWqigdvo42iCCjmrM9gf5 (pipe 5, PRs #227 and #223).

- Read the PRs with `gh pr diff` and `gh pr view --json commits,comments`. The plan comment shows add, change
  and destroy counts per environment, but its body is truncated. Name the destroyed resource from the commits.
- Shallow-clone the PR branch. Check that every slug in `apps/platform/config/map/dataviews.ts` (resolved with the
  current `PIPE_DATASET_VERSION`) exists as `slug = "…"` there, and that no `var.environment == "production"` gate
  remains on anything the app uses.
- Compare `.github/apps/production.yml` and the default values in `libs/datasets-client/src/constants.ts` with
  the last tag. A changed default with no production override means production switches data when the
  frontend deploys.
- Tier 1 on that board is always deploy order, the live old frontend against the new config, and rollback.
- To render PR and terraform commit links, use the `refs` and `link()` variant in that board's script instead of
  `commits`.

## Traps

- `confirm()` / `alert()` do nothing inside the artifact viewer. The template uses a two-click "Clear all".
- Crowdin and `chore(release): publish` commits are noise. Drop them from the analysis, but count them in the
  totals.
- Commits merged from main into develop can appear twice with different shas. Cite one of them.
