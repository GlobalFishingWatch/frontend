# libs/deck-loaders/src/vessels/lib/types.ts · [[event-type-specific-color-styling]] [[lazy-loaded-static-data-with-synchronous-imports]] [[vessel-events-parsing-pipeline]]

Type definitions and constants for vessel event rendering, longline categorization, and deck.gl track data structures.

- LonglineCategory · type · L15-L15 — Union type categorizing longline fishing events by day/night temporal distribution.
- isLonglineSetEvent · function · L24-L24 — Checks if an event represents a longline fishing set by detecting the presence of a day-night category.
- getLonglineCategory · function · L26-L31 — Maps a fishing event to its appropriate longline category based on temporal characteristics (day/night).
- VesselTrackGraphExtent · type · L33-L33 — Tuple type representing the min/max range for vessel track graph attributes (speed or elevation).
- VesselTrackData · type · L35-L56 — Structure defining the packed geometry and attribute data for rendering vessel track paths in deck.gl.
- VesselDeckLayersEventData · type · L58-L66 — Extended event type combining API event data with positioning and rendering metadata for deck layer visualization.
