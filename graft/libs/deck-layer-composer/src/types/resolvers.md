# libs/deck-layer-composer/src/types/resolvers.ts · [[deck-layer-composition-system]]

Type definitions for resolver configuration and functions that transform dataviews and global config into deck layer properties.

- TimeRange · type · L17-L17 — Defines a time period with start and end date strings.
- TimeMode · type · L19-L19 — Enum-like type distinguishing between realtime and historical time modes.
- ResolverGlobalConfig · type · L21-L44 — Carries global configuration needed by all layer resolvers, including time bounds, visualization modes, and UI event/style settings.
- DeckResolverFunction · type · L46-L49 — Defines the function signature for resolvers that transform a dataview and global config into deck layer props.
