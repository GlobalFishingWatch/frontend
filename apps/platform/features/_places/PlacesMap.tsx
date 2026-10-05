import { useState } from 'react'
import { MapView } from '@deck.gl/core'
import DeckGL from '@deck.gl/react'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { DataviewInstance } from '@globalfishingwatch/api-types'
import type { ResolverGlobalConfig } from '@globalfishingwatch/deck-layer-composer'
import { useDeckLayerInstances } from '@globalfishingwatch/deck-layer-composer'
import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'
import { DEFAULT_VIEWPORT } from '@platform/config/map/app'

import type { PlacesMapDataviews } from 'features/_places/places-map.config'
import { usePlacesMapDataviews } from 'features/_places/places-map.hooks'

const PLACES_MAP_VIEW = new MapView({ id: 'places-map', repeat: true })

type PlacesMapProps = {
  dataviewsByType: PlacesMapDataviews
  type: OceanAreaType
}

function PlacesMap({ dataviewsByType, type }: PlacesMapProps) {
  const [viewState, setViewState] = useState(DEFAULT_VIEWPORT)
  const dataviews = usePlacesMapDataviews(dataviewsByType, type)
  const layers = useDeckLayerInstances({
    dataviews: dataviews as DataviewInstance[],
    globalConfig: { token: GFWAPI.token } as ResolverGlobalConfig,
  })

  return (
    <DeckGL
      views={PLACES_MAP_VIEW}
      viewState={viewState}
      onViewStateChange={({ viewState }) => setViewState(viewState as typeof DEFAULT_VIEWPORT)}
      controller
      layers={layers}
    />
  )
}

export default PlacesMap
