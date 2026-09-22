# scripts/reachable-features.mjs · [[build-automation-and-ci-cd-scripting]] [[feature-reachability-analysis]]

Analyzes which feature directories are reachable at runtime (excluding type-only imports) from specified entry points to identify module load boundaries.

- rf · function · L64-L72 — Resolves a bare file path to an actual file by checking for direct file match, appending known extensions, or finding an index file.
- resolveSpec · function · L73-L78 — Converts an import specifier into an absolute file path by applying relative path resolution, exact module mappings, or prefix-based path construction.
- specs · function · L79-L113 — Extracts all runtime import specifiers from a TypeScript/TSX file by parsing and filtering out type-only imports and exports.
