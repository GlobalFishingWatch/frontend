# libs/ui-components/src/color-bar/ColorBar.tsx · [[color-theme-configuration]] [[css-module-encapsulation-theming]] [[localstorage-persistence-pattern]]

- ColorBarProps · interface · L17-L25 — Type interface defining configuration options for the ColorBar component including selected color, disabled colors, and display tooltips.
- ColorBar · function · L27-L113 — React functional component that renders an interactive color picker with toggle between preset swatches and continuous hue-bar modes.
- toggleColorMode · function · L48-L50 — Callback function that switches the color selection mode between 'swatches' and 'hue-bar' display modes.
- handleHueBarSelection · function · L52-L57 — Callback function that converts a selected hue-bar color to hexadecimal format and triggers the onColorClick handler.
