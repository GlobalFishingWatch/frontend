# libs/deck-layers/src/layers/fourwings/fourwings.stats.ts · [[fourwings-data-infrastructure]] [[geometry-validation-and-error-handling]]

Module providing statistical utilities for computing color ramp steps and filtering outliers from aggregated data.

- getSteps · function · L7-L21 — Clusters data values into discrete color ramp steps using ckmeans algorithm, ensuring minimum step count by padding with synthetic boundary values.
- removeOutliers · function · L23-L39 — Filters numeric values to exclude statistical outliers beyond mean ± (standard deviation × scale factor), with adjustable scale based on aggregation operation.
