# apps/platform/server/api/utils/sanitize.ts · [[google-sheets-data-persistence]] [[security-formula-injection-prevention]]

Provides functions to sanitize and escape user-supplied values against Google Sheets formula-injection attacks by neutralizing formula triggers and escaping string interpolations.

- sanitizeSheetValue · function · L17-L22 — Neutralizes a single cell value by prefixing formula-triggering strings with a single quote to force literal text interpretation in Sheets.
- sanitizeSheetRow · function · L28-L34 — Applies value sanitization to every string in a flat row object to prevent formula injection across all user-supplied fields.
- escapeFormulaString · function · L41-L43 — Escapes user values interpolated into app-generated formula strings by doubling quotes and collapsing newlines to prevent breaking out of string literals.
