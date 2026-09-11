---
name: sheets-append-row-placement
description: Where addRow lands in a Google Sheet is decided by Google's table detection, not our code — blank rows and formula-filled rows both break it
---

# `sheet.addRow` placement is Google's table detection, not ours

Every spreadsheet write in `apps/platform` (`routes/api/corrections.ts`, `feedback.ts`,
`downloadSurvey.ts`, `server/api/track-corrections/*`) goes through
`google-spreadsheet`'s `addRow`. Nothing in our code chooses a target row. `addRows` POSTs to

```
values/'<Sheet>'!A<headerRowIndex>:append   ?insertDataOption=OVERWRITE
```

and Google finds a "table" from that anchor, then appends **after the last row of that table,
starting at that table's first column**. Column placement is separate and is by header-name
lookup against `sheet.headerValues`.

**Why:** two different sheet states break this, in opposite directions, and both have bitten us.
Neither is visible in the code, so it reads as an inexplicable integration failure.

## Failure 1 — a fully blank row splits the table (silent column shift)

Google's own example: data at `A1:C2` and `B4:D6` is **two** tables, and appending writes to
`B7` — not `A7`. It picks the _last_ table and anchors on _its_ first column.

So a completely empty row inside or below the corrections block means the next submission is
written starting at whatever column the fragment below happens to begin in, landing under the
wrong headers, with a `200` returned to the analyst. Partially-filled rows are fine — a value in
`F7` directly under `F6` keeps the block contiguous and the anchor stays at column A.

`routes/api/corrections.ts` could produce this blank row itself: `mapDataToHeader` returns `''`
for every header when `data.source` is neither `Registry` nor `SelfReported`, and the handler's
only guard is a truthiness check on `source`. One malformed payload appends an all-empty row and
poisons every write after it. Validate `source` against the enum before writing.

## Failure 2 — formula-filled rows extend the table (append lands far below)

The historical version: rows that _look_ empty but hold a formula (`=IF(A5="","",…)` dragged to
row 1000) are data to the API, so the table extends to the drag's end and new rows land past it.
This was fixed **by hand in the spreadsheet** — there is no commit and no code guard, so it is
fully re-breakable. `server/api/track-corrections/post-new.ts` writes per-row formulas
(`=GET_LATEST_STARTDATE`, `=LINKTOCOMMENTS`, `=GET_IS_RESOLVED`), which are harmless as written
but are exactly the thing an analyst would drag down to pre-fill.

Genuinely empty trailing grid rows are **not** a problem — append stops at the last row with data.

**How to apply:**

- Before debugging a "rows going to the wrong place" report, check the sheet before the code:
  `Ctrl+End` shows the last cell Sheets considers used. Far below the real data ⇒ failure 2.
  A gap inside the block ⇒ failure 1.
- Don't add a row-trimming workaround. The durable fix is to stop using `addRow`: `getRows()` to
  find the last row, then `loadCells` on an explicit `A{n}:{last}{n}` range and
  `saveUpdatedCells()`, which writes to an address we chose. `addRow` gives no way to pass a
  range — `A${headerRowIndex}:append` is hard-coded in the library.
- Passing `{ insert: true }` (→ `INSERT_ROWS`) at least stops appends overwriting anything below.

## Column placement is exact-match on the header text

`addRows` builds the row positionally from `headerValues` (read from the header row and
`.trim()`-ed per cell), so reordering or inserting columns is absorbed, but:

- A **renamed** header — or changed case, or a non-breaking space — silently blanks that column
  forever, because `mapDataToHeader` ends in `return map[header] || ''`. No error.
- A **duplicated** header throws (`checkForDuplicateHeaders`) → 500 and the correction is lost.
- `corrections.ts` hard-codes `loadHeaderRow(4)`. Inserting a row above the headers either throws
  or picks up garbage as headers. Every other route uses the default row 1.

When adding a column to a map in `corrections.ts`, the key must match the sheet's header cell
character-for-character; there is no way to catch a mismatch from the code side.

**Status as of 2026-09-11:** the table-detection specifics above are read from Google's
`values.append` docs and the installed `google-spreadsheet@5.3.0` source, plus the team's memory
of the formula-row incident. The contiguity behaviour for a partially-filled row directly below
the block has **not** been tested against a real sheet — do that on a copy before relying on it.

See [[platform-testing]] for how to verify platform changes generally.
