# apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts · [[ai-chat-session-management]] [[async-operation-patterns]] [[map-state-synchronization]]

Provides chat session management with message handling, feedback tracking, tool execution (navigation), and authenticated API communication for a map-based AI chat interface.

- FeedbackRating · type · L22-L22 — Type alias representing user feedback ratings on AI responses.
- messageText · function · L25-L30 — Extracts and concatenates text content from a UIMessage's parts.
- getFeedbackState · function · L32-L54 — Parses chat message history to extract user feedback ratings and track associated question/answer pairs.
- chatFetchWithAuth · function · L56-L74 — Wraps HTTP requests with authentication via the GFWAPI client.
- ChatSessionArgs · type · L76-L81 — Configuration object type for initializing a chat session with thread, user, and callback settings.
- useChatSession · function · L83-L189 — React hook that initializes and manages an AI chat session with map navigation and feedback handling.
- prepareSendMessagesRequest · method · L91-L101 — Formats outgoing chat messages with user and thread context for the backend API.
- onToolCall · method · L117-L149 — Handles AI tool invocations, specifically routing navigate tool calls to update the map view.
- reportNavigate · function · L121-L122 — Callback function that reports the result of a navigate tool call back to the AI system.
