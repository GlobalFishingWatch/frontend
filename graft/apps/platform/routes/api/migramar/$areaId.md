# apps/platform/routes/api/migramar/$areaId.ts · [[migramar-data-api]]

Defines a TanStack Router API endpoint that retrieves and filters Migramar ecological dataset rows by geographic area from a Google Spreadsheet.

- MigramarRowYear · type · L5-L32 — Union type defining valid calendar years supported for annual migration data columns.
- MigramarRow · type · L34-L52 — Type definition for a migration data row containing species, indicators, scenario analysis, and annual year values.
- MigramarApiResponse · type · L54-L54 — Union type for the API response: either an array of migration rows or an error object with success flag and message.
