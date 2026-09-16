---
name: React Hooks Lazy Analytics
slug: react-hooks-lazy-analytics
type: concept
sources:
  - path: libs/react-hooks/src/use-analytics/index.ts
    hash: 02d6d029799abc736b1d46a950a207a63c810d7610be752ec4c153fc5e88335f
  - path: libs/react-hooks/src/use-analytics/use-analytics.ts
    hash: 248f16f2f663cf3405684fec3696a278b674892d0a16ccca461ddffc957c987e
sources_digest: 6079be89b83955a0bc6dad38551f98ed2628a4e0b30c582caf0491ae7306350f
links: []
generator:
  version: 1
covers:
  - symbol: InitOptions
    kind: type
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L5-L5'
  - symbol: ReactGAClient
    kind: type
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L7-L12'
  - symbol: resolveReactGAClient
    kind: function
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L14-L23'
  - symbol: getReactGAClient
    kind: function
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L29-L38'
  - symbol: TrackCategory
    kind: enum
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L40-L42'
  - symbol: TrackEventParams
    kind: type
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L44-L50'
  - symbol: trackEvent
    kind: function
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L52-L84'
  - symbol: useAnalyticsParams
    kind: type
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L86-L91'
  - symbol: useAnalyticsInit
    kind: function
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L93-L154'
---

<!-- context:generated:start -->

## Summary

On-demand GA4 integration using singleton promise pattern to ensure react-ga4 loads only once despite concurrent initialization. useAnalyticsInit accepts measurement IDs and GTM IDs, memoizes config to prevent re-initialization, returns initialized flag and setConfig method. trackEvent formats all parameters in snake_case (required by GA4 API) via es-toolkit utility. Gotcha: must use two-argument event(name, params) signature to preserve snake_case; library otherwise auto-converts to title case.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
