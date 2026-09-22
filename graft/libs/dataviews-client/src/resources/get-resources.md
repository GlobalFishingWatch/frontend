# libs/dataviews-client/src/resources/get-resources.ts · [[deck-layer-resource-fetching]]

Module that orchestrates dataview dataset configuration and resource resolution for track visualization, filtering and prioritizing vessel data based on zoom level and chunking strategy.

- GetDatasetConfigCallback · type · L12-L15 — Callback function type that transforms a list of dataset configurations for a dataview.
- GetDatasetConfigsCallbacks · type · L17-L22 — Collection of optional callbacks to process different dataset configuration types during dataview extension.
- splitTrackDataviews · function · L24-L40 — Partitions dataviews into track-type and non-track dataviews for separate processing.
- extendDataviewDatasetConfig · function · L42-L115 — Enriches track dataviews with vessel, track, real-time, and event dataset configurations, applying custom callbacks.
- getResources · function · L117-L141 — Extracts and resolves vessel endpoint resource URLs from dataview dataset configurations for data fetching.
- pickTrackResource · function · L143-L191 — Selects the most appropriate vessel track resource based on zoom level, prioritizing whole non-chunked tracks over merged chunks.
