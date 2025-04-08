import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import formatcoords from 'formatcoords'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { BasemapType } from '@globalfishingwatch/deck-layers'
import type { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { Icon, IconButton, MiniGlobe, Tooltip } from '@globalfishingwatch/ui-components'

import { CONTEXT_LAYERS_IDS } from '../../../data/config'
import Rulers from '../../../features/rulers/Rulers'
import { updateQueryParams } from '../../../routes/routes.actions'
import { selectIsSatelliteBasemap } from '../../../routes/routes.selectors'
import { useAppDispatch } from '../../../store.hooks'
import { useMapSetViewState, useMapViewState } from '../map.hooks'
import { getContextualLayersDataviews } from '../map-layers.selectors'

import styles from './MapControls.module.css'

const MapControls = ({ bounds }: { bounds: MiniglobeBounds | null }) => {
  const setViewState = useMapSetViewState()
  const { zoom, latitude, longitude } = useMapViewState()
  const dispatch = useAppDispatch()
  const [showContextLayers, setShowContextLayers] = useState<boolean>(false)

  const switchContextLayers = useCallback(() => {
    setShowContextLayers(!showContextLayers)
  }, [showContextLayers])

  const layers = useSelector(getContextualLayersDataviews)

  const handleLayerToggle = (layerSelected: UrlDataviewInstance) => {
    const updatedLayers = layers.map((layer) => ({
      ...layer,
      visible: layer.id === layerSelected.id ? !layer.config.visible : layer.config.visible,
    }))
    const hiddenLayers = updatedLayers.filter((layer) => !layer.visible).map((layer) => layer.id)
    dispatch(updateQueryParams({ hiddenLayers: hiddenLayers.join(',') }))
  }

  const [showCoords, setShowCoords] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [showDMS, setShowDMS] = useState(false)
  const isSatellite = useSelector(selectIsSatelliteBasemap)
  const isLandmassEnabled = layers.find((layer) => layer.id === CONTEXT_LAYERS_IDS.basemap)?.config
    .visible
  const currentBasemap = isSatellite ? BasemapType.Satellite : BasemapType.Default
  const switchBasemap = () => {
    dispatch(updateQueryParams({ satellite: !isSatellite }))
  }

  return (
    <div className={styles.mapControls}>
      <div
        role="button"
        tabIndex={0}
        className={styles.miniglobe}
        onMouseEnter={() => setShowCoords(true)}
        onMouseLeave={() => setShowCoords(false)}
        onClick={() => setPinned(!pinned)}
      >
        {bounds && (
          <MiniGlobe
            viewportThickness={1}
            center={{ latitude, longitude }}
            bounds={bounds}
            size={70}
          />
        )}
      </div>
      <button
        className={styles.mapControl}
        onClick={() => {
          setViewState({ zoom: zoom + 1 })
        }}
        aria-label="Increase zoom"
      >
        <Icon icon={'plus'} />
      </button>
      <button
        className={styles.mapControl}
        onClick={() => {
          setViewState({ zoom: zoom - 1 })
        }}
        aria-label="Decrease zoom"
      >
        <Icon icon={'minus'} />
      </button>
      <Rulers />
      <IconButton
        icon="layers"
        type="map-tool"
        data-tip-pos="left"
        aria-label={!showContextLayers ? 'Show contextual layers' : undefined}
        onClick={switchContextLayers}
      />
      {isLandmassEnabled && (
        <button
          className={cx(styles.basemapSwitcher, styles[currentBasemap])}
          onClick={switchBasemap}
        ></button>
      )}

      {showContextLayers && (
        <div className={styles.contextLayersContainer}>
          <div className={styles.contextLayers}>
            {layers !== null &&
              layers.map((layer) => {
                const label = layer.datasets?.[0]?.name
                // const description = layer.datasets?.[0]?.description
                return (
                  <label
                    className={cx(styles.contextLayer, {
                      [styles.disabled]: layer.config.visible === true,
                    })}
                    key={layer.id}
                  >
                    <input
                      type="checkbox"
                      style={{ color: layer.config.color }}
                      checked={layer.config.visible}
                      onChange={() => handleLayerToggle(layer)}
                    />
                    <span className={styles.label}>
                      {label}
                      {/* {description && (
                        <Tooltip content={description}>
                          <span className={styles.info}>
                            <Icon icon="info" />
                          </span>
                        </Tooltip>
                      )} */}
                    </span>
                  </label>
                )
              })}
          </div>
          <button className={styles.contextLayersButton} onClick={switchContextLayers}>
            <Icon icon="close" />
          </button>
        </div>
      )}
      {(pinned || showCoords) && (
        <div
          role="button"
          tabIndex={0}
          className={cx(styles.coords, { [styles._pinned]: pinned })}
          onClick={() => setShowDMS(!showDMS)}
        >
          {showDMS
            ? formatcoords(latitude, longitude).format('DDMMssX', {
                latLonSeparator: '',
                decimalPlaces: 2,
              })
            : `${latitude},${longitude}`}
        </div>
      )}
    </div>
  )
}

export default MapControls
