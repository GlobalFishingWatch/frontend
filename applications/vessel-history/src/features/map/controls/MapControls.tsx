import React, { Fragment, useCallback, useEffect, useRef, useState, useMemo } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import formatcoords from 'formatcoords'
import {
  MiniGlobe,
  IconButton,
  Tooltip,
  Modal,
  Spinner,
  Button,
} from '@globalfishingwatch/ui-components'
import { Generators } from '@globalfishingwatch/layer-composer'
import useDebounce from '@globalfishingwatch/react-hooks/dist/use-debounce'
// import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useDataviewInstancesConnect } from 'features/dataviews/dataviews.hook'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.selectors'
// import Rulers from 'features/map/rulers/Rulers'
import useViewport, { useMapBounds } from 'features/map/map-viewport.hooks'
// import { isWorkspaceLocation } from 'routes/routes.selectors'
// import { useDownloadDomElementAsImage } from 'hooks/screen.hooks'
// import setInlineStyles from 'utils/dom'
import { MapCoordinates } from 'types'
// import { toFixed } from 'utils/shared'
// import { selectIsAnalyzing } from 'features/analysis/analysis.selectors'
import { useLocationConnect } from 'routes/routes.hook'
// import { isPrintSupported } from '../MapScreenshot'
import styles from './MapControls.module.css'
// import MapSearch from './MapSearch'

const MapControls = ({
  mapLoading = false,
  onMouseEnter = () => {},
}: {
  mapLoading?: boolean
  onMouseEnter?: () => void
}): React.ReactElement => {
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)
  const [miniGlobeHovered, setMiniGlobeHovered] = useState(false)
  const resolvedDataviewInstances = useSelector(selectDataviewInstancesResolved)
  const { dispatchQueryParams } = useLocationConnect()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const domElement = useRef<HTMLElement>()
  // const { loading, downloadImage, previewImage, previewImageLoading, generatePreviewImage } =
  //   useDownloadDomElementAsImage(domElement.current, false)

  useEffect(() => {
    if (!domElement.current) {
      domElement.current = document.getElementById('root') as HTMLElement
    }
  }, [])

  const { viewport, setMapCoordinates } = useViewport()
  const { latitude, longitude, zoom } = viewport
  const { bounds } = useMapBounds()
  const center = useMemo(
    () => ({
      latitude,
      longitude,
    }),
    [latitude, longitude]
  )
  const options = useMemo(() => ({ bounds, center }), [bounds, center])
  const debouncedOptions = useDebounce(options, 16)

  const onZoomInClick = useCallback(() => {
    setMapCoordinates({ latitude, longitude, zoom: zoom + 1 })
  }, [latitude, longitude, setMapCoordinates, zoom])

  const onZoomOutClick = useCallback(() => {
    setMapCoordinates({ latitude, longitude, zoom: Math.max(1, zoom - 1) })
  }, [latitude, longitude, setMapCoordinates, zoom])

  const handleModalClose = useCallback(() => {
    if (domElement.current) {
      domElement.current.classList.remove('printing')
    }
    setModalOpen(false)
  }, [])

  const onPDFDownloadClick = useCallback(() => {
    handleModalClose()
    setTimeout(window.print, 200)
  }, [handleModalClose])

  const basemapDataviewInstance = resolvedDataviewInstances?.find(
    (d) => d.config?.type === Generators.Type.Basemap
  )
  const currentBasemap = basemapDataviewInstance?.config?.basemap ?? Generators.BasemapType.Default
  // const switchBasemap = () => {
  //   upsertDataviewInstance({
  //     id: basemapDataviewInstance?.id,
  //     config: {
  //       basemap:
  //         currentBasemap === Generators.BasemapType.Default
  //           ? Generators.BasemapType.Satellite
  //           : Generators.BasemapType.Default,
  //     },
  //   })
  // }

  // const handleLayerToggle = (layerSelected: ContextLayer) => {
  //   const activeLayers = layers.map((layer) => {
  //     if (layer.id === layerSelected.id) {
  //       layer.visible = !layer.visible
  //     }
  //     if (!layer.visible) {
  //       return layer.id
  //     }
  //     return null
  //   })
  //   const activeLayersFiltered = activeLayers.filter((layer: string | null) => layer)
  //   dispatch(updateQueryParams({ hiddenLayers: activeLayersFiltered.join(',') }))
  // }
  const [extendedControls] = useState(true)
  const [showLayersPopup, setShowLayersPopup] = useState(false)

  // const isAnalyzing = useSelector(selectIsAnalyzing)
  return (
    <Fragment>
      <div className={styles.mapControls} onMouseEnter={onMouseEnter}>
        <div className={cx('print-hidden', styles.controlsNested)}>
          {extendedControls && (
            <Fragment>
              {/* <Rulers /> */}
              <IconButton
                icon="layers"
                type="map-tool"
                tooltip={t('map.toggleLayers', 'Toggle layers')}
                data-tip-pos="left"
                aria-label={t('map.toggleLayers', 'Toggle layers')}
                onClick={() => setShowLayersPopup(!showLayersPopup)}
              />
              {/**
              {showLayersPopup && (
                <div className={styles.contextLayersContainer} ref={layerSelectorRef}>
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
                            checked={layer.visible}
                            onChange={() => handleLayerToggle(layer)}
                          />
                          <span className={styles.label}>
                            {layer.label}
                            {layer.description && (
                              <div></div>
                            )}
                          </span>
                        </label>
                      ))}
                  </div>
                  <button className={styles.contextLayersButton} onClick={switchContextLayers}>
                    <Icon icon="close" />
                  </button>
                </div>
              )} */}
              <IconButton
                type="map-tool"
                tooltip={t('map.loading', 'Map loading')}
                loading={mapLoading}
                className={cx(styles.loadingBtn, {
                  [styles.visible]: mapLoading,
                })}
              />
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default MapControls
