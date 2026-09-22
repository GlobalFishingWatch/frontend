# libs/deck-layers/src/layers/workspaces/workspaces.types.ts · [[workspaces-layer]]

- WorkspacesLayerProps · type · L6-L6 — Defines the props interface for the WorkspacesLayer component, extending DeckLayerProps with generic record structure.
- WorkspacesProperties · type · L8-L16 — Specifies the data properties of a workspace feature including identity, access level, and geospatial coordinates.
- WorkspacesFeature · type · L18-L18 — Represents a GeoJSON Feature with Point geometry and WorkspacesProperties as the defining data structure.
- WorkspacesPickingObject · type · L19-L19 — Extends WorkspacesFeature with an explicit category field to support deck.gl's picking/interaction system.
- WorkspacesPickingInfo · type · L21-L21 — Wraps picking event information from deck.gl with a WorkspacesPickingObject to provide type-safe interaction data.
