# libs/deck-layers

Non-obvious constraints on the deck.gl layers in this lib, each found the hard way by reading
deck.gl's source: two on label rendering (shaders), one on TileLayer sublayer caching, one on how sublayer errors are wrapped. One fact per file in
`.claude/memory/`, same convention as the workspace root — see the root `CLAUDE.md`.

@.claude/memory/deck-collision-priority-range.md
@.claude/memory/label-layer-sdf-outline-opacity.md
@.claude/memory/tile-layer-render-sublayers-triggers.md
@.claude/memory/deck-raise-error-wraps-cause.md
