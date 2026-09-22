# apps/platform/features/_vessels/vessel/vessel.config.selectors.ts · [[identity-source-prioritization]] [[vessel-identity-resolution]]

Redux selectors for querying and deriving vessel profile state properties from location query parameters and vessel data.

- VesselProfileProperty · type · L12-L12 — Type alias that extracts a required vessel profile property type based on a generic parameter.
- selectVesselProfileStateProperty · function · L13-L21 — Factory function that creates Redux selectors for vessel profile state properties, retrieving values from URL query parameters with fallback to default vessel state.
