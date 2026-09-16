# apps/platform/features/i18n/LanguageToggle.tsx · [[development-only-language-variants]] [[internationalization]]

Module providing UI components for language selection and Crowdin in-context translation support in the Global Fishing Watch platform.

- CrowdinScripts · function · L13-L30 — Component that conditionally injects Crowdin's in-context translation scripts into the document head when the specified language is active.
- LanguageToggleProps · type · L32-L35 — Type definition for LanguageToggle component props specifying optional CSS class and dropdown position.
- LanguageToggle · function · L37-L74 — React component that renders a language selection dropdown button and menu, with conditional warning states for development environments using untranslated source language.
