# libs/timebar/src/utils/create-guarded-context.ts · [[react-context-safety-pattern]] [[timebar-utilities-helpers]]

Utility module that exports a factory function for creating React contexts with runtime validation to ensure hooks are used within the correct provider.

- createGuardedContext · function · L3-L13 — Creates a React context and a hook that validates the context is used within the specified provider, throwing an error if accessed outside.
- useGuardedContext · function · L5-L11 — Hook that retrieves the context value and enforces that it is not null, throwing an error if used outside the required provider.
