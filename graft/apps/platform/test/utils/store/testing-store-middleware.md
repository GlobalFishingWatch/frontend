# apps/platform/test/utils/store/testing-store-middleware.ts · [[redux-test-store]]

Testing utility module that provides middleware for capturing and inspecting Redux actions in unit tests.

- ActionMatcher · type · L5-L10 — Type definition for matching Redux actions during testing by type, payload, metadata, and query properties.
- TestingStoreMiddleware · class · L12-L106 — Test helper class that intercepts and tracks Redux actions dispatched during unit tests, allowing assertions on action history and async action waiting.
- setFilterMiddlewareRegistered · method · L17-L19 — Controls whether to filter out internal middlewareRegistered actions from action tracking results.
- clear · method · L21-L24 — Resets the tracked actions and action listeners to allow clean state for each test.
- getActions · method · L26-L31 — Returns all dispatched actions, optionally filtered to exclude internal middlewareRegistered actions.
- getActionsByType · method · L33-L38 — Retrieves all actions matching a specific type, with optional filtering of internal middleware actions.
- getLastActionByType · method · L40-L46 — Retrieves the most recently dispatched action of a specified type for test assertions.
- wasActionDispatched · method · L48-L50 — Checks whether an action of the given type has been dispatched at any point during the test.
- waitForAction · method · L52-L78 — Waits asynchronously for an action of a specific type to be dispatched, with a configurable timeout for handling async state changes.
- removeActionListener · method · L80-L85 — Removes a registered action listener from the internal listeners array.
- createMiddleware · method · L87-L105 — Creates a Redux middleware function that captures all dispatched actions and notifies registered listeners while passing actions through normally.
- createTestingMiddleware · function · L108-L110 — Factory function that instantiates a new TestingStoreMiddleware for use in Redux test configuration.
