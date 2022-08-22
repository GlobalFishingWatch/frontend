import React, { useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import { useClickOutside } from 'hooks/screen.hooks'
import Tooltip from 'components/tooltip/tooltip'
import { ContextLayer, LayerTypes } from 'types/app.types'
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg'
import { ReactComponent as IconMinus } from 'assets/icons/minus.svg'
import { ReactComponent as IconLayers } from 'assets/icons/layers.svg'
import { ReactComponent as IconClose } from 'assets/icons/close.svg'
import { ReactComponent as IconScreenshot } from 'assets/icons/screenshot.svg'
import { ReactComponent as IconInfo } from 'assets/icons/info.svg'
import { MAX_ZOOM_LEVEL } from 'data/constants'
import styles from './map-controls.module.css'

interface MapControlsProps {
  zoom: number
  layers: ContextLayer[] | null
  downloadReady: boolean
  hasVesselSelected: boolean
  setMapZoom: (zoom: number) => void
  setLayersActive: (layers: LayerTypes[]) => void
  setMapDownloadVisible: (visible: boolean) => void
}

const MapControls: React.FC<MapControlsProps> = ({
  zoom,
  layers,
  setMapZoom,
  downloadReady,
  hasVesselSelected,
  setLayersActive,
  setMapDownloadVisible,
}): JSX.Element => {
  const [showContextLayers, setShowContextLayers] = useState<boolean>(false)

  const switchContextLayers = useCallback(() => {
    setShowContextLayers(!showContextLayers)
  }, [showContextLayers])
  // const layerSelectorRef = useClickOutside(switchContextLayers)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetZoom = useCallback(
    debounce((zoom: number) => {
      setMapZoom(zoom)
    }, 200),
    [zoom, setMapZoom]
  )

  const handleZoomIn = useCallback(() => {
    if (zoom < MAX_ZOOM_LEVEL) {
      debouncedSetZoom(zoom + 1)
    }
  }, [zoom, debouncedSetZoom])

  const handleZoomOut = useCallback(() => {
    if (zoom > 1) {
      debouncedSetZoom(zoom - 1)
    }
  }, [zoom, debouncedSetZoom])

  const downloadMap = useCallback(() => {
    setMapDownloadVisible(true)
    uaEvent({
      category: 'CVP - General Actions',
      action: 'Start screenshot',
      label: hasVesselSelected ? 'vessel history page' : 'home page',
    })
  }, [hasVesselSelected, setMapDownloadVisible])

  const handleLayerToggle = (layerSelected: ContextLayer) => {
    const activeLayers = (layers || []).reduce<LayerTypes[]>((acc, layer) => {
      if (layerSelected.id === layer.id) {
        if (!layer.active) {
          acc.push(layer.id)
        }
      } else if (layer.active) {
        acc.push(layer.id)
      }
      return acc
    }, [])
    setLayersActive(activeLayers)
  }

  return (
    <div className={styles.mapControls}>
      <button
        className={styles.mapControl}
        onClick={handleZoomIn}
        aria-label="Increase zoom"
        data-tip-pos="left"
      >
        <IconPlus />
      </button>
      <button
        className={styles.mapControl}
        onClick={handleZoomOut}
        aria-label="Decrease zoom"
        data-tip-pos="left"
      >
        <IconMinus />
      </button>
      <button
        className={styles.mapControl}
        aria-label={!showContextLayers ? 'Show contextual layers' : undefined}
        data-tip-pos="left"
        onClick={switchContextLayers}
      >
        {!showContextLayers ? <IconLayers /> : <IconClose />}
      </button>
      {showContextLayers && (
        <div className={styles.contextLayersContainer} /*ref={layerSelectorRef}*/>
          <div className={styles.contextLayers}>
            {layers !== null &&
              layers.map((layer) => (
                <label
                  className={cx(styles.contextLayer, {
                    [styles.disabled]: layer.disabled === true,
                  })}
                  key={layer.id}
                >
                  <input
                    id={layer.id}
                    type="checkbox"
                    style={{ color: layer.color }}
                    checked={layer.active}
                    onChange={() => handleLayerToggle(layer)}
                  />
                  <span className={styles.label}>
                    {layer.label}
                    {layer.description && (
                      <Tooltip content={layer.description}>
                        <span className={styles.info}>
                          <IconInfo />
                        </span>
                      </Tooltip>
                    )}
                  </span>
                </label>
              ))}
          </div>
          <button className={styles.contextLayersButton} onClick={switchContextLayers}>
            <IconClose />
          </button>
        </div>
      )}
      <button
        className={styles.mapControl}
        onClick={downloadMap}
        aria-label="Download map"
        data-tip-pos="left"
        disabled={!downloadReady}
      >
        <IconScreenshot />
      </button>
    </div>
  )
}

export default MapControls
