---
name: AI Chat Session Management
slug: ai-chat-session-management
type: system
sources:
  - path: apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts
    hash: 783eeaf68bb5d39b6cf042c1c69e7b6fd5f1df2f96ecc4fcda976ee96b841ef8
  - path: apps/platform/features/_map/content-panel/chat/chat-threads.hooks.ts
    hash: dc8c524867d682c5c92a39b6ce7e82b62642fb0a0b79e232ef1e2a7eb6f1e37c
  - path: apps/platform/features/_map/content-panel/chat/chat.atoms.ts
    hash: 989b1a903f119607edc22553303a9a85a1c28a41278c0cbc9a8e341888a5c9b5
  - path: apps/platform/features/_map/content-panel/chat/ChatContainer.tsx
    hash: 159cfd9c2b258d6bff4fe06a351b6fdae78eef3259f11af03c7e6cb8184115d9
  - path: apps/platform/features/_map/content-panel/chat/ChatHeader.tsx
    hash: 81a3b8603dbd4db84a449a398fb383ddb6c25fb50763373c7948f403646305e3
  - path: apps/platform/features/_map/content-panel/chat/ChatSession.tsx
    hash: cf3cb7895cf1f3e246a991b265c89d74bf1458c43581c81ce716627db1685ab5
  - path: apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx
    hash: ff0e84554744bd986d7aa4725c4f9e420e9958320dc0543462e727ca3eaaca55
  - path: apps/platform/features/_map/content-panel/chat/navigate-tool.ts
    hash: 79b0eb457d1d46b6845f40fd5c848bb97503ab70455fec866579f0e6bf5131b4
sources_digest: 8b88cce70f9279692b0126d8ab076184d2475d3c967e496b9530697ebd21fed2
links:
  - to: localization-and-resource-keys
    relation: uses
    description: >-
      Internationalized labels via i18next for tool names, states, messages, and
      UI text
  - to: map-state-synchronization
    relation: uses
    description: >-
      Navigate tool dispatches Redux actions and updates Jotai atoms (timerange,
      coordinates) to sync map state with agent commands
  - to: user-authentication-and-authorization
    relation: depends_on
    description: >-
      ChatContainer gates chat access by user tier (guest/GFW user status) via
      Redux selectors
generator:
  version: 1
covers:
  - symbol: ChatContainer
    kind: function
    at: 'apps/platform/features/_map/content-panel/chat/ChatContainer.tsx:L11-L37'
  - symbol: ChatHistoryItem
    kind: function
    at: 'apps/platform/features/_map/content-panel/chat/ChatHeader.tsx:L14-L58'
  - symbol: ChatHeader
    kind: function
    at: 'apps/platform/features/_map/content-panel/chat/ChatHeader.tsx:L60-L134'
  - symbol: ChatSession
    kind: function
    at: 'apps/platform/features/_map/content-panel/chat/ChatSession.tsx:L14-L52'
  - symbol: roleClass
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx:L28-L32
  - symbol: toolActionLabel
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx:L34-L51
  - symbol: toolStateLabel
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx:L53-L64
  - symbol: skillResourceLabel
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx:L66-L81
  - symbol: toolDetail
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx:L91-L96
  - symbol: NavigateToolLink
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx:L98-L119
  - symbol: TripwireData
    kind: type
    at: >-
      apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx:L121-L123
  - symbol: tripwireReason
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx:L125-L129
  - symbol: MessageParts
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx:L131-L195
  - symbol: MessageFeedback
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx:L197-L231
  - symbol: ChatSessionMessages
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx:L233-L345
  - symbol: onSend
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx:L283-L287
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
  - symbol: useSetThreadLoading
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-threads.hooks.ts:L11-L16
  - symbol: useChatThreads
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-threads.hooks.ts:L18-L90
  - symbol: ActiveThread
    kind: type
    at: 'apps/platform/features/_map/content-panel/chat/chat.atoms.ts:L6-L6'
  - symbol: newActiveThread
    kind: function
    at: 'apps/platform/features/_map/content-panel/chat/chat.atoms.ts:L21-L23'
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

Bidirectional chat interface connecting users with an AI agent for map navigation and query interpretation. Manages message history, thread persistence, tool invocations (navigate), feedback collection, and context injection via map URL state.

## Related

- uses [[localization-and-resource-keys]] — Internationalized labels via i18next for tool names, states, messages, and UI text
- uses [[map-state-synchronization]] — Navigate tool dispatches Redux actions and updates Jotai atoms (timerange, coordinates) to sync map state with agent commands
- depends on [[user-authentication-and-authorization]] — ChatContainer gates chat access by user tier (guest/GFW user status) via Redux selectors

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
