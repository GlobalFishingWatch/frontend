# libs/skills/src/decode-url/scripts/register-gfw-resolver.mjs · [[custom-module-resolution-for-skills]] [[monorepo-module-resolution-bridging]]

Registers Node.js module hooks to resolve the skill bundle from either a built dist directory or monorepo source, allowing dynamic import of the skill package by its canonical specifier.

- resolve · method · L18-L23 — Intercepts module resolution to redirect the skill package specifier to the correct bundle location when it exists, otherwise delegates to the default resolver.
