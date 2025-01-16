import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import formatcoords from 'formatcoords'

import * as Generators from '@globalfishingwatch/layer-composer'
import { Icon } from '@globalfishingwatch/ui-components/icon'
import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
import type { MiniglobeBounds } from '@globalfishingwatch/ui-components/miniglobe'
import { MiniGlobe } from '@globalfishingwatch/ui-components/miniglobe'

import { CONTEXT_LAYERS } from '../../../data/config'
import Rulers from '../../../features/rulers/Rulers'
import { updateQueryParams } from '../../../routes/routes.actions'
import { selectHiddenLayers, selectSatellite } from '../../../routes/routes.selectors'
import { useAppDispatch } from '../../../store.hooks'
import type { ContextLayer } from '../../../types'
import { useViewportConnect } from '../map.hooks'

import styles from './MapControls.module.css'

const MapControls = ({ bounds }: { bounds: MiniglobeBounds | null }) => {
  const { zoom, latitude, longitude, dispatchViewport } = useViewportConnect()
  const dispatch = useAppDispatch()
  const [showContextLayers, setShowContextLayers] = useState<boolean>(false)

  const switchContextLayers = useCallback(() => {
    setShowContextLayers(!showContextLayers)
  }, [showContextLayers])

  const hiddenLayers = useSelector(selectHiddenLayers)

  const layers = CONTEXT_LAYERS.map((layer) => ({
    ...layer,
    visible: !hiddenLayers.includes(layer.id),
  }))
  const handleLayerToggle = (layerSelected: ContextLayer) => {
    const activeLayers = layers.map((layer) => {
      if (layer.id === layerSelected.id) {
        layer.visible = !layer.visible
      }
      if (!layer.visible) {
        return layer.id
      }
      return null
    })
    const activeLayersFiltered = activeLayers.filter((layer: string | null) => layer)
    dispatch(updateQueryParams({ hiddenLayers: activeLayersFiltered.join(',') }))
  }

  const [showCoords, setShowCoords] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [showDMS, setShowDMS] = useState(false)
  const isSatellite = useSelector(selectSatellite)
  const currentBasemap = isSatellite
    ? Generators.BasemapType.Satellite
    : Generators.BasemapType.Default
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
          dispatchViewport({ zoom: zoom + 1 })
        }}
        aria-label="Increase zoom"
      >
        <Icon icon={'plus'} />
      </button>
      <button
        className={styles.mapControl}
        onClick={() => {
          dispatchViewport({ zoom: zoom - 1 })
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
      <button
        className={cx(styles.basemapSwitcher, styles[currentBasemap])}
        onClick={switchBasemap}
      ></button>

      {showContextLayers && (
        <div className={styles.contextLayersContainer}>
          <div className={styles.contextLayers}>
            {layers !== null &&
              layers.map((layer: ContextLayer) => (
                <label
                  className={cx(styles.contextLayer, {
                    [styles.disabled]: layer.visible === true,
                  })}
                  key={layer.id}
                >
                  <input
                    type="checkbox"
                    style={{ color: layer.color }}
                    disabled={layer.disabled}
                    checked={layer.visible}
                    onChange={() => handleLayerToggle(layer)}
                  />
                  <span className={styles.label}>
                    {layer.label}
                    {layer.description && (
                      <div></div>
                      /*<Tooltip content={layer.description}>
                        <span className={styles.info}>
                          <Icon icon="info" />
                        </span>
                      </Tooltip>*/
                    )}
                  </span>
                </label>
              ))}
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
