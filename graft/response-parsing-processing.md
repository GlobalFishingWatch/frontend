---
name: Response Parsing & Processing
slug: response-parsing-processing
type: file
sources:
  - path: libs/api-client/src/utils/parse.ts
    hash: 8ee149ba598f7591080c1fceef86ef68ecf556265573c470eff9e9b55bc530da
sources_digest: 3d91de62be7b8608d8b0bc504b13c4b09c55bb63849519f410ea22f3743948be
links:
  - to: api-error-classification-parsing
    relation: uses
    description: >-
      Response processor depends on error classification to normalize API error
      responses
generator:
  version: 1
covers:
  - symbol: processStatus
    kind: function
    at: 'libs/api-client/src/utils/parse.ts:L3-L43'
  - symbol: parseJSON
    kind: function
    at: 'libs/api-client/src/utils/parse.ts:L45-L45'
---

<!-- context:generated:start -->

## Summary

HTTP response validation and error conversion for the API client. processStatus function validates responses (accepting 200-399, rejecting 400+ unless ResourceResponseType is 'default'), converts error responses to structured error objects supporting both singular message and plural messages fields for backward compatibility. parseJSON delegates to Response.json(). Uses async executor anti-pattern to await response.text() during error parsing.

## Related

- uses [[api-error-classification-parsing]] — Response processor depends on error classification to normalize API error responses

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
