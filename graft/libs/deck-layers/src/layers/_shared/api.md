# libs/deck-layers/src/layers/_shared/api.ts · [[api-gateway-integration]] [[api-integration-and-data-loading]]

- FetchWithGFWAPIContext · type · L17-L25 — Type defining the context options (abort signal, layer configuration) passed to authenticated API fetch operations.
- getFetchLoadOptions · function · L27-L36 — Creates fetch options with GFW API authorization token for data loading requests.
- isSpriteUrl · function · L41-L43 — Tests whether a URL points to a deck sprite asset by matching the sprite filename pattern.
- getSpriteFilename · function · L45-L48 — Extracts the sprite filename from a URL or returns the default vessel-sprite.png.
- resolveLocalSpriteUrl · function · L50-L67 — Constructs the absolute URL for a locally-served sprite asset using environment-based base paths.
- fetchLocalSprite · function · L69-L76 — Fetches a sprite image from local server and converts it to an ImageBitmap for rendering.
- ResponseHeaderOptions · type · L78-L78 — Type defining the parameters needed to extract and parse response headers from HTTP responses.
- getResponseHeader · function · L82-L95 — Extracts a response header value and optionally converts it to a number using type-safe overloads.
- fetchWithGFWAPI · function · L97-L137 — Routes authenticated API requests to local sprite assets or GFW API, parsing vessel track data with timestamp base headers when applicable.
