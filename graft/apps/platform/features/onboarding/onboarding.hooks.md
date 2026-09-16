# apps/platform/features/onboarding/onboarding.hooks.ts · [[analytics-tracking]] [[help-system-integration]] [[onboarding-system]]

Exports React hooks for onboarding workflows: dispatching card actions with analytics and guide navigation, queuing copilot prompts to chat, and animating typewriter placeholder text.

- getGuideTarget · function · L26-L29 — Resolves a user guide slug to its matching section and subsection identifiers for side panel display.
- useOnboardingCardActions · function · L35-L98 — Returns a dispatcher that closes the onboarding modal and executes the appropriate action (navigation, search, or guide opening) based on card type.
- useOnboardingCopilotPrompt · function · L104-L125 — Returns a callback that sends a trimmed question to the analysis copilot chat session and opens the chat panel.
- pickNext · function · L133-L136 — Selects a random phrase from the list that differs from the current one.
- prefersReducedMotion · function · L138-L143 — Checks if the user's system preferences disable animations.
- useTypewriterPlaceholder · function · L150-L184 — Returns an animated placeholder string that cycles through phrases with typing, holding, and deletion effects respecting motion preferences.
- tick · function · L161-L176 — Advances the typewriter animation state by one character step, toggling between typing and deletion phases.
