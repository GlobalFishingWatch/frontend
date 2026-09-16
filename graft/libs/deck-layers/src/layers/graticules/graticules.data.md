# libs/deck-layers/src/layers/graticules/graticules.data.ts · [[graticules-layer]]

Generates GeoJSON features for graticule lines (meridians and parallels) with scale-based ranking and directional labels.

- getLineScaleRank · function · L5-L7 — Determines the visual scale rank of a graticule line based on coordinate divisibility (90, 30, 10, 5, or 1).
- getLongitudeLabel · function · L9-L12 — Formats a longitude value as a cardinal direction label (E/W with absolute value).
- getLatitudeLabel · function · L14-L17 — Formats a latitude value as a cardinal direction label (N/S with absolute value).
- generateGraticulesFeatures · function · L19-L61 — Creates all graticule line features by generating meridians and parallels as GeoJSON LineStrings with scale ranks and labels.
