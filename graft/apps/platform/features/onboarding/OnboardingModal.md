# apps/platform/features/onboarding/OnboardingModal.tsx · [[onboarding-system]]

Displays the main welcome modal for new users with onboarding cards, optional AI copilot prompt, login encouragement for guests, and help navigation links.

- getTutorialsLink · function · L33-L37 — Returns the localized tutorials URL for the public site, with different routing patterns for Spanish versus English.
- getFAQsLink · function · L39-L43 — Returns the localized FAQs URL for the public site, with different routing patterns for Spanish versus English.
- OnboardingModal · function · L45-L196 — Renders a modal UI that presents onboarding options including tutorial cards, AI copilot queries for GFW users, and login prompts for guest users.
- close · function · L58-L58 — Dispatches an action to close the onboarding modal.
