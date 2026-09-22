# apps/platform/scripts/generate-vessel-sitemap.mjs · [[sitemap-generation-script]]

Script that generates a compressed sitemap index and vessel shard files from a GFW CSV export for SEO purposes.

- splitCsvLine · function · L28-L49 — Parses an RFC4180-compliant CSV line by handling quoted fields containing commas and escaped quotes.
- xmlEscape · function · L109-L109 — Escapes XML special characters to safely embed values in sitemap URL elements.
- shardName · function · L110-L110 — Generates the filename for a compressed sitemap shard given its index number.
- mb · function · L140-L140 — Converts byte counts to megabyte strings formatted to one decimal place.
