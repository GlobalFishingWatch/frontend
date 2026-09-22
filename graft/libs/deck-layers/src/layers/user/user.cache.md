# libs/deck-layers/src/layers/user/user.cache.ts · [[response-caching-with-expiration]] [[user-layer-system]]

Module providing HTTP response caching with expiry and cleanup utilities for deck layer user requests.

- ResponseCacheEntry · type · L1-L4 — Data structure holding a cached response buffer and its timestamp for expiry validation.
- cloneArrayBuffer · function · L6-L15 — Creates a deep copy of an ArrayBuffer with fallback handling for detached buffers.
- generateCacheKey · function · L20-L24 — Normalizes a URL for caching by removing query filters and returning a stable cache key.
- isCacheValid · function · L26-L28 — Determines whether a cached entry has expired based on a 20-minute TTL window.
- getCachedResponse · function · L30-L36 — Retrieves and clones a cached response if it exists and is still valid, else returns null.
- clearExpiredCache · function · L38-L45 — Removes all cache entries that have exceeded the 20-minute expiry threshold.
- clearCache · function · L47-L49 — Immediately empties the entire response cache.
- startCacheCleanup · function · L53-L56 — Initiates a periodic background task that removes expired cache entries every 20 minutes.
- stopCacheCleanup · function · L58-L63 — Stops the background cache cleanup interval and resets its reference.
