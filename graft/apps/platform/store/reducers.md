# apps/platform/store/reducers.ts · [[redux-store-configuration]] [[state-shape-and-persistence]]

Defines the Redux root reducer by combining all feature slices and their lazy-loaded counterparts into a single store state.

- LazyLoadedSlices · interface · L33-L33 — Extension interface that allows feature slices to augment the Redux store state with dynamically injected reducers at runtime.
- RootState · type · L60-L60 — Type alias that represents the complete Redux store state shape derived from the root reducer.
