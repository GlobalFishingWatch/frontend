# apps/platform/features/_map/content-panel/chat/chat.atoms.ts · [[ai-chat-session-management]]

Atom definitions for managing active chat thread state and pending prompt input across the chat feature.

- ActiveThread · type · L6-L6 — Type representing the state of an active chat thread with its unique identifier, creation status, and loading state.
- newActiveThread · function · L21-L23 — Factory function that creates a new active thread with a fresh UUID and initialized state flags.
