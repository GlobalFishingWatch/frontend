---
name: encode-url-jev
description: Build a GFW map URL (and TanStack Router navigation config) identical to what the platform app itself generates, encoding the full app state — layers, filters, time range, viewport and route. Use when the user wants to see, compare or review ocean activity (fishing effort, vessel presence, detections, encounters, loitering, port visits, environment conditions, etc), open a report over an area or port, open a vessel profile, or search vessels — whether building a view from scratch or modifying the one behind their current URL.
---

# Encode GFW map URL (Jev-planned)

The plan script has already made every decision: route, layers, filters, flags, areas, time range, and how a follow-up changes the current map. It asks the Jev model typed questions and applies the app rules in code. Your job is the last step: fill in what it could not, encode, and reply.

Requires node >= 24 and `TYPESAFE_API_KEY` in the environment. In the monorepo, run `pnpm nx build skills` once so `dist/` exists.

## 1. Plan

```bash
node scripts/plan-url.mjs '{"message":"<latest user message>","currentUrl":"<the map URL the user is on, if any>"}'
```

Always pass `currentUrl` when you have it: follow-ups ("and by flag?", "only in 2025") are applied on top of it.

The output is `{ draft, alternatives?, todo, seeAlso? }`. `draft` (and each alternative) is already the input of the encoder.

## 2. Resolve `todo`

Each `todo` item is one instruction. Do exactly what it says and nothing else.

- Replace every `TODO:<field>` placeholder in the draft.
- Viewport items: set `state.latitude` / `state.longitude` / `state.zoom` to frame the named place.
- Id lookups: grep [references/areas.json](references/areas.json), [references/ports.json](references/ports.json) (large, always grep by name, never read it whole) or [references/dataset-filters.json](references/dataset-filters.json).
- "Unsure about …" items: the plan made a best guess. Keep it unless the message clearly means the other option.

Do **not** change anything a todo does not name: layers, visibility, filters, colors, time range, route. Those are decided. If `todo` is empty, encode the draft as it is.

## 3. Encode

```bash
node scripts/encode-url.mjs '<draft JSON>'
```

Run it once for `draft` and once for each item of `alternatives`. The output is `{ navigation, path, warnings? }`:

- `navigation`: TanStack Router config, for navigating from inside the map app.
- `path`: for external links, prepend `https://globalfishingwatch.org`.

If the encoder fails and lists per-dataset filter support, change only the filter it names and rerun.

## 4. Reply

- Give the link. When there are `alternatives`, offer them too; they are the map view and the report of the same request, and the user picks one.
- Tell the user every encoder `warnings` line in plain words, e.g. "gear type trawlers is only reported by Norway VMS, so only Norway is shown".
- When there is a `seeAlso`, add it as a "see also" link (prepend the origin). It is a curated workspace, so never put state on top of it.

A state param not covered here may still exist. [references/query-params.md](references/query-params.md) and [references/layers.md](references/layers.md) document them.
