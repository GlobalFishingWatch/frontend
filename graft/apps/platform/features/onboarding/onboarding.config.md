# apps/platform/features/onboarding/onboarding.config.ts · [[onboarding-system]]

Configuration module that exports onboarding card definitions, copilot examples, and related TypeScript type definitions for the onboarding feature.

- TFunc · type · L5-L5 — Type alias for the i18n translation function signature.
- OnboardingCardId · type · L7-L7 — Enumeration type restricting onboarding card identifiers to three valid options.
- OnboardingCard · type · L9-L14 — Data structure defining the shape of an onboarding card with localized content and image path.
- getCopilotExamples · function · L17-L30 — Generates a localized array of example prompts to display as animated placeholders in the copilot input field.
- getOnboardingCards · function · L32-L53 — Assembles localized onboarding cards with titles, descriptions, and associated welcome panel images.
