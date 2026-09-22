# libs/api-types/src/identity-vessel.ts · [[api-types-type-definitions]] [[multi-source-vessel-identity-resolution]] [[temporal-data-versioning-constraints]]

Type definitions for vessel identity data structures including registry and self-reported vessel information sources.

- VesselType · type · L1-L10 — Enumeration of vessel classification categories used to identify operational vessel types.
- GearType · type · L23-L53 — Enumeration of fishing and vessel gear type classifications for operational activity identification.
- VesselIdentitySourceEnum · enum · L87-L92 — Enumeration distinguishing vessel identity sources between self-reported broadcast data and public registry data.
- SelfReportedSource · enum · L94-L111 — Enumeration of self-reported vessel position data sources including AIS and VMS systems by country.
- VesselInfo · type · L113-L127 — Common vessel identification data structure shared across self-reported and registry sources.
- VesselTMTInfo · type · L129-L138 — Optional technical and operational metadata for vessel measurements and registry details.
- SelfReportedMatchFields · type · L140-L140 — Classification of match field quality for self-reported vessel identity resolution.
- RegistryLoginMessage · type · L143-L143 — Type alias for authentication requirement message constant.
- SelfReportedInfo · type · L145-L166 — Extended vessel data from self-reported sources including position counts and custom VMS fields.
- RegistryImage · type · L168-L171 — Vessel image reference with copyright attribution from registry sources.
- RegistryExtraFieldValue · type · L173-L179 — Dated value wrapper for registry metadata with temporal masks and type-generic value storage.
- RegistryExtraFields · type · L181-L190 — Additional registry vessel information including construction year, compliance status, and vessel images.
- VesselRegistryInfo · type · L192-L202 — Complete registry vessel identity record with dimensions, tonnage, and optional extra fields.
- VesselRegistryProperty · type · L204-L210 — Base structure for time-bound registry vessel properties with date ranges and source tracking.
- VesselRegistryOwner · type · L212-L215 — Registry owner information extending temporal property with owner name and flag state.
- VesselRegistryOperator · type · L217-L220 — Registry operator information with temporal bounds, name, and flag state authority.
- VesselRegistryAuthorization · type · L222-L222 — Fishing authorization record tracking valid operating periods and source compliance.
- VesselIdentitySearchMatch · type · L224-L227 — Single property-value match result from vessel identity search criteria.
- VesselIdentitySearchMatchCriteria · type · L229-L239 — Query parameters defining vessel identity search scope including source, time period, and matching properties.
- CombinedSourceInfo · type · L241-L248 — Multi-source vessel attribute record with temporal validity and optional confidence values.
- VesselCombinedSourcesInfo · type · L249-L268 — Aggregated multi-source vessel characteristics including dimensions, class, and inferred properties with source tracking.
- IdentityVessel · type · L270-L280 — Complete vessel identity record integrating combined sources, registry, and self-reported data with search and authorization context.
