# libs/skills/src/encode-url/scripts/register-gfw-resolver.mjs · [[custom-module-resolution-for-skills]] [[monorepo-module-resolution-bridging]]

Registers a Node.js module resolution hook to resolve custom skill packages from either dist or source layouts.

- resolve · method · L18-L23 — Intercepts module resolution for the skill specifier and returns the path to its bundled index.js file.
