# apps/platform/features/nav/HelpHub.tsx · [[analytics-tracking]] [[help-system-integration]] [[navigation-system]]

A React component that provides a help hub menu with options to reset hints, open onboarding, access user guides, chat assistant, video tutorials, and FAQs.

- HelpHub · function · L21-L154 — React component that renders a help menu hub with buttons for resetting hints, opening guides, accessing tutorials, FAQs, and conditionally showing a chatbot assistant.
- onHelpClick · function · L33-L40 — Handler that tracks analytics for hint restoration and dispatches an action to reset all dismissed hints.
- getFAQsLink · function · L42-L45 — Returns the localized FAQ URL, choosing the Spanish or English documentation link based on current language.
- getVideoTutorialsLink · function · L47-L50 — Returns the localized video tutorials URL, choosing the Spanish or English resources link based on current language.
- redirectEvent · function · L52-L58 — Tracks analytics events when users click to navigate to external help resources.
