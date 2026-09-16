# libs/skills/src/encode-url/dictionary.ts · [[geospatial-layer-dictionary]] [[instance-id-normalization-convention-bridging]]

Exports layer definitions and utilities for mapping dataview instance IDs to layer metadata used by the global fishing watch platform.

- LayerCategory · type · L4-L4 — Enumerates the five semantic categories that layers in the platform visualization system can belong to.
- LayerInfo · type · L6-L11 — Defines the data structure for layer metadata including display name, category classification, and optional backend dataview slug.
- getLayerInfo · function · L289-L304 — Resolves a dataview instance ID to layer metadata by normalizing platform ID conventions (context-layer prefix, library timestamp suffix, vessel prefix) and looking up the dictionary.
