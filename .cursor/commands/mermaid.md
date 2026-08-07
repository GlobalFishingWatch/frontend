# Mermaid diagram

Create a Mermaid diagram of the library/module flow for a path the user provides.

## Steps

1. If no path or folder is given, ask for one before generating.
2. Inspect that path (entry exports, imports, key types/classes).
3. Produce a focused Mermaid diagram (`flowchart` or `sequenceDiagram`) — not a dump of every file.
4. Save the diagram next to the provided path as `flow.mmd` (or the filename the user specified).
5. Keep node labels short; group by layer (UI → state → data → map) when useful for platform/map code.
