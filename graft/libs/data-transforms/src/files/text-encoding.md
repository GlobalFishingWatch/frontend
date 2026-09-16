# libs/data-transforms/src/files/text-encoding.ts · [[archive-and-encoding-utilities]] [[file-format-conversion-pipeline]]

Module that exports a function to repair corrupted text encoding by replacing mojibake characters with their correct Unicode equivalents for Latin-based languages.

- fixTextEncoding · function · L1-L31 — Repairs mojibake-corrupted text by replacing garbled characters with correct accented characters and symbols used in Portuguese, French, Spanish, and German.
