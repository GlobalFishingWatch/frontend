# scripts/check-store-graph.mjs · [[build-automation-and-ci-cd-scripting]] [[monorepo-workspace-dependency-and-boundary-enforcement]] [[store-graph-module-budget-enforcement]]

CI guard that walks the runtime import graph reachable from the store's root reducer and fails if any heavyweight package or module-count budget is breached.

- readWorkspacePackages · function · L137-L165 — Extracts the list of workspace packages from pnpm-workspace.yaml and resolves each to its source-level exports map for traversal.
- sourceTargetFor · function · L179-L208 — Picks the source-level target from an exports entry, preferring development condition over rewritten dist paths.
- resolveWorkspaceSpecifier · function · L214-L251 — Resolves a @scope/pkg or @scope/pkg/subpath specifier to its source file by matching the exports map with exact keys taking precedence over wildcards.
- fail · function · L221-L224 — Records untraversed specifiers with their failure reason and returns an external package node.
- resolveFile · function · L279-L289 — Resolves a file path by checking exact existence, trying registered extensions, and falling back to index files.
- resolveSpecifier · function · L297-L327 — Converts an import specifier to either a file path or external package name, handling assets, relative paths, path aliases, and workspace packages.
- runtimeSpecifiers · function · L330-L370 — Parses a TypeScript source file and extracts all runtime (non-type, non-dynamic) import and export specifiers.
- walk · function · L378-L422 — Breadth-first-searches the import graph from entry points, tracking visited modules, externals, parent edges, and importers for breach reporting.
- addImporter · function · L387-L390 — Records bidirectional tracking of which files import a given file or package name.
- chainTo · function · L425-L433 — Reconstructs the import chain from an entry point down to a specific file by following parent edges.
