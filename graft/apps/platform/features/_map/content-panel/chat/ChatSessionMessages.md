# apps/platform/features/_map/content-panel/chat/ChatSessionMessages.tsx · [[ai-chat-session-management]]

Main React component that renders a chat session message thread with message display, user input, and feedback controls for an AI assistant conversation.

- roleClass · function · L28-L32 — Maps message role to corresponding CSS class for styling user, assistant, and system messages.
- toolActionLabel · function · L34-L51 — Returns localized label for a tool action based on its name.
- toolStateLabel · function · L53-L64 — Returns visual indicator symbol for tool execution state (pending, success, or error).
- skillResourceLabel · function · L66-L81 — Returns localized label for skill resource file based on filename.
- toolDetail · function · L91-L96 — Detects and returns label for skill resource files referenced in tool input data.
- NavigateToolLink · function · L98-L119 — Renders a clickable navigation link that applies map state changes when the navigate tool is invoked.
- TripwireData · type · L121-L123 — Type definition for tripwire block data containing optional reason for request blocking.
- tripwireReason · function · L125-L129 — Extracts the reason string from a tripwire data message part.
- MessageParts · function · L131-L195 — Renders individual message parts (text, reasoning, tripwire, tools) with appropriate formatting and interactivity.
- MessageFeedback · function · L197-L231 — Renders thumbs-up and thumbs-down feedback buttons that allow users to rate and provide reasons for AI responses.
- ChatSessionMessages · function · L233-L345 — Main chat component that manages message state, user input, auto-scrolling, pending prompts, and feedback submission.
- onSend · function · L283-L287 — Clears input field, sends message to chat session, and triggers completion callback.
