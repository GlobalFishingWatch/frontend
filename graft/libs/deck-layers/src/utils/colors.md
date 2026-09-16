# libs/deck-layers/src/utils/colors.ts · [[color-format-conversion]] [[color-ramps-configuration]]

Utility module providing color format conversion functions for deck.gl visualization library (hex, RGB, RGBA, and vec4 formats).

- hexToRgb · function · L6-L17 — Converts a hexadecimal color string to an RGB object with red, green, and blue components.
- rgbaStringToObject · function · L20-L35 — Parses an RGBA or RGB string and extracts normalized component values into an object.
- hexToDeckColor · function · L37-L48 — Converts a hexadecimal color string to deck.gl's array-based Color format with opacity scaling.
- rgbaToDeckColor · function · L50-L53 — Converts an RGBA string to deck.gl's array-based Color format.
- componentToHex · function · L55-L58 — Converts a single color component value to a zero-padded hexadecimal string.
- deckToHexColor · function · L60-L62 — Converts deck.gl's array-based Color format to a hexadecimal color string.
- deckToRgbaColor · function · L64-L66 — Converts deck.gl's array-based Color format to an RGBA CSS string.
- colorToVec · function · L68-L70 — Normalizes a color component value from 0-255 range to 0-1 range for WebGL shader use.
- deckToVecColor · function · L71-L73 — Converts deck.gl's array-based Color format to a normalized WebGL vec4 shader string.
- rgbaStringToComponents · function · L75-L86 — Extracts RGBA component values from an RGBA/RGB string and returns them as a tuple with alpha scaled to 0-255.
- rgbaToString · function · L88-L90 — Converts an RGBA object to an RGBA CSS string.
- rgbToRgbString · function · L92-L94 — Converts an RGB object to a comma-separated RGB value string.
- hexToRgbString · function · L96-L99 — Converts a hexadecimal color string to a comma-separated RGB value string.
- hexToRgbaString · function · L101-L104 — Converts a hexadecimal color string with opacity to an RGBA CSS string.
- hexToComponents · function · L106-L109 — Converts a hexadecimal color string to a tuple of RGB component values.
