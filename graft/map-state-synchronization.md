---
name: Map State Synchronization
slug: map-state-synchronization
type: concept
sources:
  - path: apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts
    hash: 783eeaf68bb5d39b6cf042c1c69e7b6fd5f1df2f96ecc4fcda976ee96b841ef8
  - path: apps/platform/features/_map/content-panel/chat/navigate-tool.ts
    hash: 79b0eb457d1d46b6845f40fd5c848bb97503ab70455fec866579f0e6bf5131b4
sources_digest: f87138e931c9c21f8729f23c4122164f0fe5ca001a0db54be4870ee237d29400
links:
  - to: ai-chat-session-management
    relation: used_by
    description: >-
      Navigate tool syncs map state (viewport, timerange) as result of agent
      commands
generator:
  version: 1
covers:
  - symbol: FeedbackRating
    kind: type
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L22-L22
  - symbol: messageText
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L25-L30
  - symbol: getFeedbackState
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L32-L54
  - symbol: chatFetchWithAuth
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L56-L74
  - symbol: ChatSessionArgs
    kind: type
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L76-L81
  - symbol: useChatSession
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L83-L189
  - symbol: prepareSendMessagesRequest
    kind: method
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L91-L101
  - symbol: onToolCall
    kind: method
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L117-L149
  - symbol: reportNavigate
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L121-L122
  - symbol: NavigateToolInput
    kind: type
    at: 'apps/platform/features/_map/content-panel/chat/navigate-tool.ts:L29-L29'
  - symbol: NavigateToolNavigation
    kind: type
    at: 'apps/platform/features/_map/content-panel/chat/navigate-tool.ts:L30-L30'
  - symbol: getNavigateToolLinkProps
    kind: function
    at: 'apps/platform/features/_map/content-panel/chat/navigate-tool.ts:L32-L44'
  - symbol: useNavigateToolMapState
    kind: function
    at: 'apps/platform/features/_map/content-panel/chat/navigate-tool.ts:L47-L76'
---

<!-- context:generated:start -->

## Summary

Coordination of viewport (latitude, longitude, zoom) and temporal (timerange) map state across features via Redux dispatch and Jotai atoms. AI agent navigation tool, URL parameters, and user interactions all converge on a single source of truth for map presentation state via setHasChangedSettings and timerangeState atom updates.

## Related

- used by [[ai-chat-session-management]] — Navigate tool syncs map state (viewport, timerange) as result of agent commands

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
