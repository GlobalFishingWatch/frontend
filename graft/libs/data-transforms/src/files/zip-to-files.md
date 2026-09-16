# libs/data-transforms/src/files/zip-to-files.ts · [[archive-and-encoding-utilities]] [[file-format-conversion-pipeline]]

Module that provides utilities to extract and process files from ZIP archives, filtering out macOS metadata and matching file types.

- isZipFile · function · L5-L9 — Determines whether a file is a ZIP archive by checking its extension or MIME type.
- isJunkEntry · function · L12-L13 — Filters out macOS metadata directories and files (like __MACOSX and ._* entries) that should not be processed.
- zipToFiles · function · L15-L29 — Loads a ZIP file asynchronously, filters entries by type, and excludes junk macOS metadata entries, returning an array of matched ZIP objects.
- findZipEntries · function · L32-L34 — Filters ZIP entries by filename pattern while excluding junk macOS metadata entries.
- zipEntryToFile · function · L36-L39 — Converts a ZIP entry to a File object by reading its contents as an array buffer.
