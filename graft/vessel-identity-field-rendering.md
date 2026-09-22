---
name: Vessel Identity Field Rendering
slug: vessel-identity-field-rendering
type: system
sources:
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityField.tsx
    hash: aafdb7aedb67d839e24e478033bc86c062aeed039bdcfeff6f39d6e08f8b0eed
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityFieldLogin.tsx
    hash: 6af7eabab37e3dc91f123776b2c3cd3abbb3ed6480dca6aecdfde6776fa3b183
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityFields.tsx
    hash: 9ed14d1dcfa8ae4d9cdeecb65ea5d10e6e29259e14635393c22647f7f79e4b5b
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityGFWExtendedGeartype.tsx
    hash: f2dc82f1adb93a7393515d2546bb14b920971cf2733d8624cf6d7759f58edda7
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityGFWExtendedVesseltype.tsx
    hash: 2395fa9cca00a0372f6885afbb53bde4d6fabc15d26c41575fe66b26b72c0b19
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselTypesField.tsx
    hash: 750e20c558796bafb3e2e1dbaac3e41902345ee0dc054df74407afe6ba8defec
sources_digest: 5119e84104f43c7c13fc1c122bfd5f01db6b86759a61bc0dfe105fbf3ecd8a9b
links:
  - to: configuration-driven-layout-pattern
    relation: depends_on
    description: >-
      VesselIdentityFields resolves field values using configuration constants
      like COMBINED_SOURCE_VALUE_FIELDS and AIS_SELF_REPORTED_SHIPTYPE
  - to: gfw-user-permission-gating
    relation: implements
    description: >-
      VesselIdentityGFWExtendedGeartype and VesselIdentityGFWExtendedVesseltype
      return null if user is not GFW or JAC user
  - to: time-range-filtering-pattern
    relation: implements
    description: >-
      VesselIdentityFields and GFW extended components filter combined source
      data using getIsCombinedSourceInTimerange
generator:
  version: 1
covers:
  - symbol: VesselIdentityFieldProps
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityField.tsx:L11-L15
  - symbol: VesselIdentityField
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityField.tsx:L16-L53
  - symbol: VesselIdentityFieldLogin
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityFieldLogin.tsx:L5-L16
  - symbol: VesselIdentityFieldsProps
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityFields.tsx:L30-L39
  - symbol: CombinedSourceValueField
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityFields.tsx:L41-L41
  - symbol: resolveFieldValue
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityFields.tsx:L43-L76
  - symbol: VesselIdentityFields
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityFields.tsx:L78-L159
  - symbol: VesselIdentityGFWExtendedGeartypeProps
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityGFWExtendedGeartype.tsx:L20-L23
  - symbol: VesselIdentityGFWExtendedGeartype
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityGFWExtendedGeartype.tsx:L24-L119
  - symbol: VesselIdentityGFWExtendedVesseltypeProps
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityGFWExtendedVesseltype.tsx:L16-L19
  - symbol: VesselIdentityGFWExtendedVesseltype
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityGFWExtendedVesseltype.tsx:L20-L83
  - symbol: VesselTypesFieldProps
    kind: interface
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselTypesField.tsx:L9-L13
  - symbol: VesselTypesField
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselTypesField.tsx:L15-L29
---

<!-- context:generated:start -->

## Summary

Renders individual and grouped vessel attribute fields with conditional highlighting, tooltips, authentication gating, and type-specific formatting. Handles complex cases like combined source fields with time-range filtering, registry extra fields with object wrapping, and Chilean VMS SSVID masking.

## Related

- depends on [[configuration-driven-layout-pattern]] — VesselIdentityFields resolves field values using configuration constants like COMBINED_SOURCE_VALUE_FIELDS and AIS_SELF_REPORTED_SHIPTYPE
- implements [[gfw-user-permission-gating]] — VesselIdentityGFWExtendedGeartype and VesselIdentityGFWExtendedVesseltype return null if user is not GFW or JAC user
- implements [[time-range-filtering-pattern]] — VesselIdentityFields and GFW extended components filter combined source data using getIsCombinedSourceInTimerange

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
