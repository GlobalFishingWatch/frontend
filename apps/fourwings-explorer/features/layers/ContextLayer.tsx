import { useMemo, useState } from 'react'
import cx from 'classnames'
import { uniqBy } from 'lodash'
import { Tooltip, ColorBarOption, IconButton } from '@globalfishingwatch/ui-components'
import { GeoJSONFeature } from '@globalfishingwatch/maplibre-gl'
import { getAreasByDistance } from '@globalfishingwatch/ocean-areas'
import { useLayerPanelDataviewSort } from 'features/layers/layers-sort.hook'
import { DatasetLayer, useLayersConfig } from 'features/layers/layers.hooks'
import Remove from 'features/layers/common/Remove'
import Color from 'features/layers/common/Color'
import { MapLayerFeaturesParams, useMapLayerFeatures } from 'features/map/map-sources.hooks'
import { useDebouncedViewport } from 'features/map/map-viewport.hooks'
import { ContextAPIDataset } from 'features/datasets/datasets.types'
import { MapCoordinates } from 'types'
import styles from './Layers.module.css'
import Title from './common/Title'
import LayerSwitch from './common/LayerSwitch'

type LayerPanelProps = {
  layer: DatasetLayer<ContextAPIDataset>
  onToggle?: () => void
}

const filterFeaturesByCenterDistance = (
  features: GeoJSONFeature[],
  center: MapCoordinates,
  limit = 5
) => {
  if (!features?.length || !center?.latitude || !center?.latitude) {
    return []
  }
  const featureCollection = {
    type: 'FeatureCollection' as const,
    features,
  }
  const closerAreas = getAreasByDistance(featureCollection, center)
  return uniqBy(closerAreas, 'properties.id').slice(0, limit)
}

function ContextLayer({ layer, onToggle }: LayerPanelProps): React.ReactElement {
  const { updateLayer } = useLayersConfig()
  const [colorOpen, setColorOpen] = useState(false)
  const viewport = useDebouncedViewport()
  const viewportHash = viewport
    ? [viewport.latitude, viewport.longitude, viewport.zoom].join(',')
    : ''
  const featuresParams = useMemo(() => {
    const params: MapLayerFeaturesParams = {
      cacheKey: viewportHash,
      queryMethod: 'render',
    }
    return params
  }, [viewportHash])
  const layerFeatures = useMapLayerFeatures(layer, featuresParams)?.[0]
  const polygonId = layer.dataset?.configuration?.polygonId
  const uniqLayerFeatures = uniqBy(layerFeatures?.features, `properties.${polygonId}`)
  const featuresSortedByDistance = filterFeaturesByCenterDistance(uniqLayerFeatures, viewport)
  const layerActive = layer?.config?.visible ?? true

  const { items, attributes, listeners, setNodeRef, setActivatorNodeRef, style } =
    useLayerPanelDataviewSort(layer.id)

  const changeColor = (color: ColorBarOption) => {
    updateLayer({
      id: layer.id,
      config: {
        color: color.value,
      },
    })
    setColorOpen(false)
  }
  const onToggleColorOpen = () => {
    setColorOpen(!colorOpen)
  }

  const closeExpandedContainer = () => {
    setColorOpen(false)
  }

  const title = layer.dataset?.name

  const TitleComponent = (
    <Title
      title={title}
      className={styles.name}
      classNameActive={styles.active}
      layer={layer}
      onToggle={onToggle}
    />
  )

  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: colorOpen,
        'print-hidden': !layerActive,
      })}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        <LayerSwitch
          active={layerActive}
          className={styles.switch}
          layer={layer}
          onToggle={onToggle}
        />
        {title && title.length > 30 ? (
          <Tooltip content={title}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
          {layerActive && (
            <Color
              layer={layer}
              open={colorOpen}
              onColorClick={changeColor}
              onToggleClick={onToggleColorOpen}
              onClickOutside={closeExpandedContainer}
            />
          )}
          <Remove layer={layer} />
          {items.length > 1 && (
            <IconButton
              size="small"
              ref={setActivatorNodeRef}
              {...listeners}
              icon="drag"
              className={styles.dragger}
            />
          )}
        </div>
      </div>
      <div className={styles.properties}>
        {polygonId &&
          layerActive &&
          featuresSortedByDistance &&
          featuresSortedByDistance.length > 0 && (
            <div>
              <label>Closest areas</label>
              <ul>
                {featuresSortedByDistance.map((feature) => {
                  const id = feature?.properties?.[polygonId]
                  return <li key={id}>{id}</li>
                })}
              </ul>
            </div>
          )}
      </div>
    </div>
  )
}

export default ContextLayer
