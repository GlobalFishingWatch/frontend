# apps/platform/hooks/secret-menu.hooks.ts · [[secret-menu-pattern]]

React hooks module that provides keyboard-triggered secret menu functionality supporting both key-sequence and key-repeat activation modes with optional Redux integration.

- DebugMenu · type · L8-L8 — Tuple type representing debug menu state and toggle callback.
- SecretMenuProps · type · L10-L28 — Union type defining two modes of secret menu activation: key sequence or repeated key press.
- useSecretKeyboardCombo · function · L30-L98 — Hook that detects either a key sequence or repeated key presses to trigger a callback.
- useSecretMenu · function · L100-L114 — Hook that integrates secret keyboard combo detection with Redux dispatch and returns menu state.
