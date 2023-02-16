import { Fragment, useMemo, useState } from 'react'
import { DeckGL } from '@deck.gl/react/typed'
import { MapView } from '@deck.gl/core/typed'
import { GeoJSON } from 'geojson'
import { useVesselsLayer, useVesselsLayerLoaded } from 'layers/vessel/vessels.hooks'
import { useFourwingsLayer, useFourwingsLayerLoaded } from 'layers/fourwings/fourwings.hooks'
import { basemapLayer } from 'layers/basemap/BasemapLayer'
import { EditableGeoJsonLayer } from '@nebula.gl/layers'
import {
  DrawPolygonMode,
  ModifyMode,
  CompositeMode,
  SnappableMode,
  TranslateMode,
} from '@nebula.gl/edit-modes'
import { useURLViewport, useViewport } from 'features/map/map-viewport.hooks'
import { zIndexSortedArray } from 'utils/layers'

const mapView = new MapView({ repeat: true })

const MapWrapper = (): React.ReactElement => {
  useURLViewport()
  const { viewState, onViewportStateChange } = useViewport()

  const fourwingsLayer = useFourwingsLayer()
  const vesselsLayer = useVesselsLayer()
  const vesselsLoaded = useVesselsLayerLoaded()
  const fourwingsLoaded = useFourwingsLayerLoaded()
  const [editMode, setEditMode] = useState(false)
  const [editableLayerGeometry, setEditableLayerGeometry] = useState<GeoJSON | null>({
    type: 'FeatureCollection',
    features: [],
  })

  const editableLayer = new EditableGeoJsonLayer({
    id: 'nebula',
    data: editableLayerGeometry,
    selectedFeatureIndexes: [],
    // mode: new CompositeMode([new DrawPolygonMode(), new ModifyMode()]),
    mode: editMode ? new SnappableMode(new TranslateMode()) : DrawPolygonMode,

    // Styles
    filled: true,
    pointRadiusMinPixels: 2,
    pointRadiusScale: 2000,
    getFillColor: [200, 0, 80, 180],

    // Interactive props
    pickable: true,
    autoHighlight: true,

    onEdit: ({ updatedData, editType, featureIndexes, editContext }) => {
      console.log('EDITTING', editType, featureIndexes, editContext)
      setEditableLayerGeometry(updatedData)
    },
  })

  const layers = useMemo(() => {
    return zIndexSortedArray([basemapLayer, fourwingsLayer, vesselsLayer, editableLayer])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fourwingsLayer, vesselsLayer, vesselsLoaded, fourwingsLoaded, editableLayer])
  console.log(layers)
  const getTooltip = (tooltip) => {
    // Heatmap
    if (tooltip.object?.value) {
      if (Array.isArray(tooltip.object?.value)) {
        const sublayers = tooltip.object.value?.flatMap(({ id, value }) =>
          value ? `${id}: ${value}` : []
        )
        return sublayers.length ? sublayers.join('\n') : undefined
      }
      return tooltip.object?.value
    }
    // Vessel position
    if (tooltip.object?.properties?.vesselId) {
      return tooltip.object?.properties?.vesselId.toString()
    }
    // Vessel event
    if (tooltip?.object?.type) {
      return tooltip.object.type
    }
    return
  }

  return (
    <Fragment>
      <DeckGL
        views={mapView}
        controller={true}
        viewState={viewState}
        layers={layers}
        getTooltip={getTooltip}
        onViewStateChange={onViewportStateChange}
        getCursor={editableLayer.getCursor.bind(editableLayer)}
      />
      <button
        style={{ position: 'absolute', color: 'red', top: 0, left: '30px' }}
        onClick={() => setEditMode(!editMode)}
      >
        Edit
      </button>
    </Fragment>
  )
}

export default MapWrapper
