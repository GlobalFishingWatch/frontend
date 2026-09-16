---
name: Dataview URL Workspace
slug: dataview-url-workspace
type: system
sources:
  - path: libs/dataviews-client/src/url-workspace/index.ts
    hash: e0c0137393fd2b1f85935fc5ba376561172c5e51e569b468c7203b3f320e12c3
  - path: libs/dataviews-client/src/url-workspace/migrations.ts
    hash: 7a002d74692cdbf45f085de38c47cb252274a075d72a87e371549653fc64fec4
  - path: libs/dataviews-client/src/url-workspace/url-workspace.ts
    hash: 6e8001bcbfa793189f04aa2c228ad4dc4a5f869b9c1e08442f124ae12ae41b0f
sources_digest: 1a8eb6cc4cc2a12a666542b8f19800750a6215fbfeb462fdba33120bcf56401b
links:
  - to: dataview-resolution-filtering
    relation: produces
    description: Parses URL query strings into dataview instances for resolution
  - to: vms-dataset-registry
    relation: depends_on
    description: >-
      Uses migration dictionaries to upgrade legacy dataset identifiers during
      URL parsing
generator:
  version: 1
covers:
  - symbol: removeLegacyEndpointPrefix
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/migrations.ts:L10-L15'
  - symbol: migrateLegacyVMSPublicDataset
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/migrations.ts:L17-L21'
  - symbol: migrateLegacyVMSFullDataset
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/migrations.ts:L23-L27'
  - symbol: migrateLegacyVMSDatasets
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/migrations.ts:L29-L31'
  - symbol: migrateDetectionsLegacyDatasets
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/migrations.ts:L33-L39'
  - symbol: migrateVesselLegacyDatasets
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/migrations.ts:L41-L43'
  - symbol: runDatasetMigrations
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/migrations.ts:L45-L49'
  - symbol: migrateEventsLegacyDatasets
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/migrations.ts:L51-L53'
  - symbol: Dictionary
    kind: type
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L14-L14'
  - symbol: BaseUrlWorkspace
    kind: type
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L19-L28'
  - symbol: hasParamToBeAbbreviatedDuplicated
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L110-L113'
  - symbol: parseIntNumber
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L121-L121'
  - symbol: safeDecodeURIComponent
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L126-L133'
  - symbol: parseLegacyDataviewInstanceConfig
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L135-L160'
  - symbol: parseDataviewInstance
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L162-L203'
  - symbol: deepReplaceKeys
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L251-L256'
  - symbol: getObjectTokens
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L258-L267'
  - symbol: deepTokenizeValues
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L270-L313'
  - symbol: tokenizeValues
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L291-L309'
  - symbol: deepDetokenizeValues
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L315-L342'
  - symbol: detokenizeValues
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L317-L339'
  - symbol: decoder
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L345-L367'
  - symbol: parseWorkspace
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L374-L405'
  - symbol: stringifyWorkspace
    kind: function
    at: 'libs/dataviews-client/src/url-workspace/url-workspace.ts:L407-L412'
---

<!-- context:generated:start -->

## Summary

Encodes and decodes workspace state (dataview instances, map configuration, UI settings) as compact URL query strings using abbreviation and tokenization. Handles backward compatibility through dataset migrations when parsing legacy URL formats.

## Related

- produces [[dataview-resolution-filtering]] — Parses URL query strings into dataview instances for resolution
- depends on [[vms-dataset-registry]] — Uses migration dictionaries to upgrade legacy dataset identifiers during URL parsing

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
