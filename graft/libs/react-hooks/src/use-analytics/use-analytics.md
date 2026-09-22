# libs/react-hooks/src/use-analytics/use-analytics.ts · [[react-hooks-defensive-patterns]] [[react-hooks-lazy-analytics]] [[react-hooks-library]] [[react-hooks-standard-library-dependencies]]

Module providing React hooks and utilities for initializing Google Analytics (GA4) tracking and dispatching custom analytics events.

- InitOptions · type · L5-L5 — Type alias extracting react-ga4 initialization options structure from the library's initialize function signature.
- ReactGAClient · type · L7-L12 — Type definition for the react-ga4 client interface with event, initialize, and set methods.
- resolveReactGAClient · function · L14-L23 — Resolves the react-ga4 module export by unwrapping default exports and validating the event method exists.
- getReactGAClient · function · L29-L38 — Lazy-loads react-ga4 on demand with memoization to ensure concurrent callers share a single import promise.
- TrackCategory · enum · L40-L42 — Enumeration defining supported event categories for analytics tracking.
- TrackEventParams · type · L44-L50 — Generic type defining the parameter structure for tracking events with category, action, and optional metadata.
- trackEvent · function · L52-L84 — Sends analytics events to Google Analytics 4 with category and action converted to snake_case format.
- useAnalyticsParams · type · L86-L91 — Configuration type for analytics initialization with debug mode and Google tracking identifiers.
- useAnalyticsInit · function · L93-L154 — React hook that initializes Google Analytics 4 with memoized config and provides a setConfig method to update tracking settings.
