---
name: encode-url-jev-skill
description: Why encode-url-jev exists next to encode-url, where its decisions live, and how to test and tune it
---

# encode-url-jev moves the skill's decisions out of the LLM prompt

`libs/skills/src/encode-url-jev/` is a second version of [[encode-url-skill-maintenance]]'s skill. It is kept **next to** `encode-url` on purpose, so the two can be A/B tested (added 2026-09-24). Do not merge them or delete one without asking.

`planMapUrl` asks Jev (TypeSafe System One, `jev-1.13.0`, docs.typesafe.ai) typed questions (`choice`/`noul`) through the official `@typesafe-ai/sdk` client, which also owns retries and the question/answer types. Code turns the answers into an `encodeMapUrl` draft. The LLM step only resolves `todo` items: viewport, MPA/port/vessel ids and low-confidence picks.

Questions go in **rounds**, not one request (changed 2026-09-24). Each step declares `needs`; every step whose needs are resolved shares one request. Today that is 3 rounds: (1) mode, route, layers, areaTypes, period → (2) places, time, report, account, search → (3) filters. A round only asks what the earlier answers made relevant: FAO/RFMO/country candidates only for the area types named, date parts only for the period kind, report params only on report pages, and filters only for the resolved layers. The filter options come from `dataset-filters.json` for the datasets those layers use.

**Why:** the original SKILL.md asked one LLM to make ~25 judgment calls in one pass, and mistakes could not be traced to a rule. A single speculative Jev request asked ~360 questions (22k–37k tokens) whatever the message was. Rounds cost 36–285 questions (2k–34k tokens) and 0.85–1.8 s in total. As of 2026-09-24, the 251-question country fan-out is what's left of the cost when a country is named. Rules that are arithmetic (dates, colors, hiding defaults) stay in code because Jev is weak at them.

**How to apply:**

- To change a decision, edit one file in `steps/` (one concern each; question keys are prefixed `<step>.`). A question that only makes sense after another decision belongs in a step that `needs` it, not asked speculatively. The deterministic rules are in `draft.ts`.
- On follow-ups, filters target the named layers, else only the layer the view focuses on. Asking for every visible layer turned "russia vessels" into a VMS `origin=Foreign` filter on a 9-layer global report.
- Phrase questions literally. "Do the words of `message` itself mention X?" instead of "Does `message` ask about X?" dropped a follow-up false positive from 0.55 to 0.02, because otherwise Jev also counts what `current_map` already shows. Ask for the date parts that are "written in" the message, or Jev fills in day 1 for "May 2025". Ask for FAO areas as "code or name", not as the full label (0.16 vs 0.94).
- Tune against the transcripts: `pnpm nx try-jev skills -- --conversations` (live, needs `TYPESAFE_API_KEY`, read from the gitignored `libs/skills/.env`). As of 2026-09-24, 22/27 turns match. Two of the misses are by design (MPA id, target species are LLM todos). Turn #25's expected URL has From/To reversed in the transcript itself.
- Run the offline check with `pnpm nx test skills` (`node:test` on the built bundle, replaying fixed answers). The `platform` vitest problem does not apply here: this lib has no vitest config at all.
