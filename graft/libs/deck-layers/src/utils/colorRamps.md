# libs/deck-layers/src/utils/colorRamps.ts · [[color-ramps-configuration]] [[color-ramps-palettes]]

Provides utility functions for generating and transforming color ramps used in deck visualization layers.

- isMultiHueColorRampId · function · L24-L25 — Type guard that checks whether a ramp identifier refers to a multi-hue color ramp.
- getColorRampByOpacitySteps · function · L29-L37 — Generates a color ramp by varying opacity from a minimum threshold to full opacity across discrete steps.
- getColorRampToWhite · function · L39-L57 — Creates a color ramp that interpolates from a given color to white across a specified number of steps.
- getMixedOpacityToWhiteColorRamp · function · L59-L68 — Combines opacity-based and white-end color ramps to produce a composite ramp with both fading and color shift.
- resolveColorRampId · function · L70-L71 — Returns a valid color ramp identifier, falling back to the default if the provided one is not recognized.
- getBivariateRamp · function · L73-L80 — Builds two opacity-based color ramps from bivariate color ramp identifiers, converting each to RGBA objects.
- getBlend · function · L82-L84 — Blends two colors using screen blend mode over a standard background to produce a composite RGBA color.
- getBivariateRampLegend · function · L86-L113 — Generates a 16-entry legend by blending pairs of bivariate color ramps with varying opacities to visualize the data relationship.
- GetColorRampReturn · type · L115-L119 — Conditional type that maps format specifiers to their corresponding color ramp output types.
- getColorRamp · function · L121-L140 — Retrieves a formatted color ramp in multiple formats (RGBA strings, objects, or arrays) with optional white endpoint and multi-hue support.
