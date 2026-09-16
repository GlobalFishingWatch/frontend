# libs/deck-loaders/src/user/lib/parse-user-tracks.ts · [[timestamp-alignment-across-simplification]] [[user-tracks-parsing-pipeline]]

- arrayBufferToJson · function · L8-L17 — function arrayBufferToJson(arrayBuffer: ArrayBuffer)
- ParseUserTrackParams · type · L19-L24 — type ParseUserTrackParams = { filters: Record<string, any> filterOperators?: FilterOperators workerUrl?: string includeCoordinateProperties?: string[] }
- parseUserTrack · function · L28-L102 — parseUserTrack = ( arrayBuffer: ArrayBuffer, params = {} as ParseUserTrackParams ): UserTrackData
