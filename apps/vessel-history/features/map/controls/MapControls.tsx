import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton, Modal } from '@globalfishingwatch/ui-components'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { selectDataviewInstancesByType } from 'features/dataviews/dataviews.selectors'
import LayerSwitch from 'features/workspace/common/LayerSwitch'
import EventFilters from 'features/event-filters/EventFilters'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
import ActivityDataAndTerminology from 'features/profile/components/activity/ActivityDataAndTerminology'
import { getDatasetDescriptionTranslated, getDatasetNameTranslated } from 'features/i18n/utils'
import EventFiltersButton from 'features/event-filters/EventFiltersButton'
import styles from './MapControls.module.css'

const MapControls = ({
  mapLoading = false,
  onMouseEnter = () => {},
  onOpenFishingMap = () => {},
}: {
  mapLoading?: boolean
  onMouseEnter?: () => void
  onOpenFishingMap: () => void
}): React.ReactElement => {
  const { t } = useTranslation()
  const domElement = useRef<HTMLElement>()
  useEffect(() => {
    if (!domElement.current) {
      domElement.current = document.getElementById('root') as HTMLElement
    }
  }, [])

  const [extendedControls] = useState(true)
  const [isModalOpen, setIsOpen] = useState(false)
  const [showLayersPopup, setShowLayersPopup] = useState(false)
  const [showLayerInfo, setShowLayerInfo] = useState<{ [key: string]: boolean }>({})
  const layers = useSelector(selectDataviewInstancesByType(GeneratorType.Context))
  const setModalOpen = useCallback((isOpen) => {
    if (isOpen) {
      uaEvent({
        category: 'Vessel Detail ACTIVITY or MAP Tab',
        action: 'Open filters',
        label: JSON.stringify({ tab: 'MAP' }),
      })
    }
    setIsOpen(isOpen)
  }, [])

  const handleCloseShowLayers = useCallback(() => {
    setShowLayersPopup(false)
  }, [])

  return (
    <Fragment>
      <EventFilters
        tab="MAP"
        isModalOpen={isModalOpen}
        onCloseModal={(isOpen) => setModalOpen(isOpen)}
      ></EventFilters>
      <div className={styles.mapControls} onMouseEnter={onMouseEnter}>
        <div className={cx('print-hidden', styles.controlsNested)}>
          {extendedControls && (
            <Fragment>
              <div className={styles.filtersWrapper}>
                <EventFiltersButton
                  type="default"
                  className={styles['map-tool']}
                  onClick={() => setModalOpen(true)}
                ></EventFiltersButton>
              </div>
              <IconButton
                icon="layers"
                type="map-tool"
                size="medium"
                data-tip-pos="left"
                tooltip={t('map.toggleLayers', 'Toggle layers')}
                onClick={() => {
                  setShowLayersPopup(!showLayersPopup)
                  uaEvent({
                    category: 'Vessel Detail MAP Tab',
                    action: 'Open context layer',
                  })
                }}
              />
              <DataAndTerminology
                containerClassName={styles.dataAndTerminologyContainer}
                size="medium"
                type="map-tool"
                title={t('common.dataAndTerminology', 'Data and Terminology')}
              >
                <ActivityDataAndTerminology />
              </DataAndTerminology>
              {showLayersPopup && (
                <Modal
                  appSelector="__next"
                  isOpen={showLayersPopup}
                  onClose={handleCloseShowLayers}
                  header={false}
                  className={styles.layersModalContentWrapper}
                  closeButtonClassName={styles.layersModalCloseButton}
                  contentClassName={styles.layersModalContainer}
                  overlayClassName={styles.layersModalOverlay}
                  portalClassName={styles.layersModalPortal}
                >
                  <div>
                    <div className={styles.contextLayers}>
                      {!!layers &&
                        layers.map((layer) => (
                          <div className={styles.layerContainer} key={layer.id}>
                            <LayerSwitch
                              key={layer.id}
                              className={styles.contextLayer}
                              classNameActive={styles.active}
                              dataview={layer}
                              title={getDatasetNameTranslated(layer)}
                            />
                            <div>
                              <IconButton
                                icon="info"
                                type="default"
                                size="small"
                                className={styles.infoIcon}
                                tooltipPlacement="left"
                                onClick={() =>
                                  setShowLayerInfo({ ...showLayerInfo, [layer.id]: true })
                                }
                              />
                              <Modal
                                appSelector="__next"
                                isOpen={showLayerInfo[layer.id.toString()]}
                                onClose={() =>
                                  setShowLayerInfo({ ...showLayerInfo, [layer.id]: false })
                                }
                                title={getDatasetNameTranslated(layer)}
                              >
                                {getDatasetDescriptionTranslated(layer)}
                              </Modal>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </Modal>
              )}
              {/* <Rulers /> */}
              <IconButton
                type="map-tool"
                icon="external-link"
                size="medium"
                onClick={onOpenFishingMap}
                tooltip={t(
                  'map.openFishingMap',
                  'Click HERE to see the vessel’s track on the main Global Fishing Watch map'
                )}
              />
              <IconButton
                type="map-tool"
                size="medium"
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
