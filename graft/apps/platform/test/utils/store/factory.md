# apps/platform/test/utils/store/factory.ts · [[redux-test-store]]

Test fixture factory providing Redux store state builders with type safety for preloaded state in test scenarios.

- DefaultState · type · L12-L12 — Type alias for the shape of the Redux store default state.
- DatasetsState · type · L13-L13 — Type alias extracting the datasets slice from the default Redux state.
- DeepPartial · type · L14-L14 — Recursive type utility that makes all properties of an object optional at any depth.
- EagerSliceName · type · L25-L30 — Conditional type that identifies required (eagerly-registered) Redux slices to ensure only valid state keys are used in test fixtures.
- _FixtureKeysAreEager · type · L33-L33 — Compile-time assertion that detects if a fixture key is not an eagerly-registered Redux slice, causing a type error.
- getDefaultState · function · L35-L49 — Builds a default Redux store state with optional overrides and injects the test end date into workspace configuration.
- getDefaultStateWithDatasets · function · L51-L70 — Merges an array of datasets into the default state by converting them to entity-normalized form and appending their IDs.
- getDefaultViewportProperty · function · L74-L79 — Extracts a viewport property (latitude, longitude, or zoom) from query params or workspace data with fallback precedence.
