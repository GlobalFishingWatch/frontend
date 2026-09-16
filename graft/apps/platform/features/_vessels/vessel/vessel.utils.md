# apps/platform/features/_vessels/vessel/vessel.utils.ts · [[identity-source-prioritization]] [[transmission-date-validation]] [[vessel-identity-resolution]]

Utility module providing vessel identity resolution, property extraction, and vessel data formatting functions for the fishing watch platform.

- VesselsParamsSupported · type · L30-L30 — Union type defining supported vessel data structures across API responses and UI state.
- GetVesselIdentityParams · type · L31-L31 — Type alias for optional vessel identity lookup parameters by ID and data source.
- getVesselCombinedSource · function · L33-L38 — Retrieves combined source vessel information matching a specific vessel ID.
- getVesselCombinedSourceProperty · function · L40-L52 — Extracts and sorts shiptype or geartype properties from combined source data, most recent first.
- getVesselIdentitiesBySource · function · L54-L89 — Maps vessel identities from a specific source (Registry or SelfReported), enriching them with combined source gear/ship types.
- getVesselIdentities · function · L91-L123 — Collects all unique identities from vessel data, deduplicating across registry and self-reported sources with optional filtering.
- getVesselIdentityId · function · L125-L129 — Extracts the appropriate identity ID depending on whether it is self-reported or registry-sourced.
- getVesselIdentity · function · L131-L139 — Finds a specific vessel identity by ID and source, or returns the first available identity.
- VesselIdentityProperty · type · L141-L142 — Union type allowing access to common identity properties plus special fields like owner, id, and image.
- VesselProperty · type · L144-L152 — Conditional type that maps vessel identity property names to their runtime value types.
- getVesselProperty · function · L153-L185 — Retrieves a typed property value from a vessel identity, with special handling for owner names and combined source gear/ship types.
- getLatestIdentityPrioritised · function · L187-L207 — Returns the latest vessel identity prioritizing self-reported data over registry, with enriched gear and ship types.
- getMatchCriteriaPrioritised · function · L209-L217 — Selects the highest-priority match criteria, preferring registry source over others.
- getBestMatchCriteriaIdentity · function · L219-L234 — Finds the vessel identity best matching the vessel's stored match criteria.
- getVesselId · function · L236-L244 — Extracts the primary vessel ID, preferring self-reported identity over registry reference.
- getRelatedIdentityVesselIds · function · L246-L255 — Collects self-reported vessel IDs matched via multiple fields, excluding the primary vessel.
- SearchIdentityResolvedParams · type · L257-L259 — Type holding optional property prioritization for identity resolution during search.
- getVesselTransmissionDates · function · L263-L282 — Computes the earliest and latest transmission date boundaries across all self-reported identities.
- isBefore · function · L264-L265 — Compares two UTC date strings returning true if the first is strictly earlier.
- getSearchIdentityResolved · function · L284-L329 — Resolves the best vessel identity for search results using match criteria, prioritized properties, and transmission date aggregation.
- sortVesselRegistryProperties · function · L331-L341 — Sorts registry properties by source code and then date, newest/alphabetically first.
- getCurrentIdentityVessel · function · L343-L363 — Constructs a complete vessel record for display, combining identity data with authorizations, owners, and combined source info.
- getVoyageTimeRange · function · L365-L367 — Extracts the earliest start and latest end timestamp from a sequence of activity events.
- filterRegistryInfoByDateAndSSVID · function · L369-L384 — Filters registry properties by time range overlap and optional SSVID match, returning sorted results.
- getOtherVesselNames · function · L386-L395 — Collects alternate vessel names from deduplicated identities, excluding the current shipname.
- isFieldLoginRequired · function · L397-L399 — Checks whether a field value is the API's login-required sentinel string.
- formatTransmissionDate · function · L401-L410 — Formats a vessel's transmission date range as a human-readable or ISO string pair.
- getIdentitySourceLabel · function · L412-L428 — Generates a localized label describing which identity sources are present, with privacy indicators for self-reported data.
- isTimerangeOutsideTransmissions · function · L430-L443 — Determines whether a time range falls entirely outside a vessel's transmission date bounds.
- getSkylightLink · function · L445-L447 — Constructs a Skylight Earth URL for a vessel given its Skylight ID.
