# libs/api-types/src/events.ts · [[api-types-type-definitions]] [[discriminated-union-type-safety-via-generics]] [[event-taxonomy-authorization-compliance]] [[geospatial-filtering-region-hierarchies]] [[multi-source-vessel-identity-resolution]] [[temporal-data-versioning-constraints]]

Type definitions for maritime event data structures including vessel encounters, fishing activities, port visits, and regional authorizations.

- PointCoordinate · type · L1-L4 — A geographic point defined by latitude and longitude coordinates.
- RegionType · enum · L6-L13 — Enumeration of marine region classification types including exclusive economic zones, RFMOs, marine protected areas, FAO regions, and high seas.
- Regions · type · L15-L22 — Container mapping each region type to an array of region identifiers associated with an event or position.
- GapPosition · type · L24-L26 — A coordinate point enriched with the geographic regions that overlap at that location.
- EventTypes · enum · L28-L35 — Enumeration of distinct fishing vessel event categories tracked in the API.
- EventType · type · L37-L37 — Type alias for a string literal matching any EventTypes enum value.
- EventNextPort · type · L39-L44 — Information about a vessel's next scheduled or predicted port destination.
- EventVesselTypeEnum · enum · L46-L49 — Classification of vessel role in events as either a carrier or fishing vessel.
- AuthorizationType · type · L51-L51 — The authorization status of a vessel as confirmed, denied, or awaiting verification.
- EventAuthorization · type · L53-L56 — A vessel's fishing authorization status for a specific RFMO.
- EventVesselAuthorization · type · L58-L61 — A vessel's publicly listed authorization status for a specific RFMO.
- EventVessel · type · L63-L72 — Core data about a vessel involved in an event, including identity, flag, type, next port, and authorizations.
- RFMOs · type · L74-L75 — Named enumeration of regional fisheries management organizations.
- EncounterEventAuthorizations · type · L77-L84 — Records whether a vessel had authorization to operate in a specific RFMO region during an encounter.
- AuthorizationOptions · enum · L86-L90 — Enumeration of authorization verification states for vessel encounter events.
- EncounterEvent · type · L92-L117 — Details of a vessel-to-vessel encounter including distance, speed, and authorization status across all relevant RFMOs.
- LoiteringEvent · type · L119-L124 — Measurements of sustained low-movement behavior by a vessel indicating fishing or suspicious activity.
- PortEvent · type · L126-L132 — Information about a port associated with a vessel event.
- Anchorage · type · L134-L144 — Geographic and operational details of an anchorage point where a vessel stopped.
- PortVisitEvent · type · L146-L153 — Details of a vessel's port visit including duration, confidence, and start, intermediate, and end anchorage positions.
- GapEvent · type · L155-L167 — A gap in vessel tracking data, including position before and after the gap, duration, and indicators of intentional signal disabling.
- GapsEvent · type · L169-L174 — Bounding box defining a geographic region containing multiple tracking gaps.
- FishingEventDayNightCategory · type · L176-L176 — Classification of fishing activity timing relative to sunrise and sunset.
- LonglineFishingFields · type · L179-L186 — Additional time-of-day and twilight zone attributes specific to longline fishing events.
- FishingEvent · type · L188-L192 — Aggregate metrics of a detected fishing event including distance traveled, speed, and duration.
- Distances · type · L194-L199 — Distances from a vessel event's start and end positions to shore and nearest port.
- ApiEvent · type · L201-L220 — The main event response type combining a vessel, event timing, position, and optional event details from any event category.
- ApiEvents · type · L222-L226 — Paginated response container for a list of events with total count and limit metadata.
