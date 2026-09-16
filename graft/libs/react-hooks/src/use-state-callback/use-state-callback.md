# libs/react-hooks/src/use-state-callback/use-state-callback.ts · [[react-hooks-library]] [[react-hooks-state-and-refs-management]]

- OnUpdateCallback · type · L3-L3 — Type alias for a callback function invoked when state is updated, receiving the new state value.
- SetStateUpdaterCallback · type · L4-L4 — Type alias for a function that computes new state from the previous state.
- SetStateAction · type · L5-L8 — Type alias for the state setter signature supporting both direct values and updater functions with optional callbacks.
- useStateCallback · function · L14-L31 — React hook that provides setState with a callback mechanism by deferring callback execution to an effect that runs after state updates.
- setCustomState · function · L18-L21 — State setter that stores the callback in a ref before dispatching the state update to React.
