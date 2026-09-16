# apps/platform/utils/csv.ts · [[csv-generation-and-parsing]]

CSV utility module providing parsers and converters for exporting tabular data in comma-separated values format.

- CsvConfig · type · L5-L9 — Configuration object that defines how to map and transform object properties into CSV columns.
- parseCSVString · function · L11-L13 — Escapes commas in string values by replacing them with hyphens to prevent CSV field delimiter corruption.
- parseCSVDate · function · L14-L14 — Converts numeric timestamps to ISO 8601 date-time strings for CSV output.
- parseCSVList · function · L15-L15 — Joins array elements with pipe delimiters to represent list values as single CSV fields.
- objectArrayToCSV · function · L17-L35 — Transforms an array of objects into a CSV string by applying configuration-driven field mapping, optional value transformation, and escaping.
