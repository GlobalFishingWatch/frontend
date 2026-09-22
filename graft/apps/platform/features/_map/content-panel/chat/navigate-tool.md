# apps/platform/features/_map/content-panel/chat/navigate-tool.ts · [[ai-chat-session-management]] [[map-state-synchronization]]

Provides validation schema and utilities for the chat agent's navigation tool to safely route to allowed map views with normalized search parameters and map state.

- NavigateToolInput · type · L29-L29 — Type alias that infers the expected input schema for the agent's navigate tool command.
- NavigateToolNavigation · type · L30-L30 — Type alias extracting the navigation property from NavigateToolInput for type-safe route specifications.
- getNavigateToolLinkProps · function · L32-L44 — Normalizes agent navigation commands into router-compatible link properties, including workspace serialization and token cleanup.
- useNavigateToolMapState · function · L47-L76 — React hook that applies map viewport and timerange state changes derived from agent navigation commands.
