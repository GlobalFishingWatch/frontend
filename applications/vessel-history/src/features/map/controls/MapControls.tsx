import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DatasetTypes } from '@globalfishingwatch/api-types/dist'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton, Modal } from '@globalfishingwatch/ui-components'
import { GeneratorType } from '@globalfishingwatch/layer-composer/dist/generators'
import { selectDataviewInstancesByType } from 'features/dataviews/dataviews.selectors'
import LayerSwitch from 'features/workspace/common/LayerSwitch'
import { selectFilterUpdated } from 'features/vessels/activity/vessels-activity.selectors'
import EventFilters from 'features/event-filters/EventFilters'
import styles from './MapControls.module.css'

const MapControls = ({
  mapLoading = false,
  onMouseEnter = () => {},
}: {
  mapLoading?: boolean
  onMouseEnter?: () => void
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
  const [showMPAInfo, setShowMPAInfo] = useState(false)
  const layers = useSelector(selectDataviewInstancesByType(GeneratorType.Context))
  const filtered = useSelector(selectFilterUpdated)
  const setModalOpen = useCallback((isOpen) => {
    setIsOpen(isOpen)
  }, [])
  const layerTitle = (dataview: UrlDataviewInstance) => {
    const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Context)
    return t(`datasets:${dataset?.id}.name` as any, dataset?.name)
  }

  const handleCloseShowLayers = useCallback(() => {
    setShowLayersPopup(false)
  }, [])

  return (
    <Fragment>
      <EventFilters isModalOpen={isModalOpen} onCloseModal={(isOpen) => setModalOpen(isOpen)}></EventFilters>
      <div className={styles.mapControls} onMouseEnter={onMouseEnter}>
        <div className={cx('print-hidden', styles.controlsNested)}>
          {extendedControls && (
            <Fragment>
              <IconButton
                icon="layers"
                type="map-tool"
                size="medium"
                data-tip-pos="left"
                tooltip={t('map.toggleLayers', 'Toggle layers')}
                onClick={() => setShowLayersPopup(!showLayersPopup)}
              />
              <IconButton
                type="map-tool"
                icon={filtered ? 'filter-on' : 'filter-off'}
                size="medium"
                tooltip={t('map.filters', 'Filter events')}
                onClick={() => setModalOpen(true)}
              />
              {showLayersPopup && (
                <Modal
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
                          <div className={styles.layerContainer}>
                            <LayerSwitch
                              key={layer.id}
                              className={styles.contextLayer}
                              classNameActive={styles.active}
                              dataview={layer}
                              title={layerTitle(layer)}
                            />
                            {layer.id === 'context-layer-mpa' && (
                              <div>

                                <IconButton
                                  icon='info'
                                  type='default'
                                  size="small"
                                  className={styles.infoIcon}
                                  tooltipPlacement="left"
                                  onClick={() =>setShowMPAInfo(true)}
                                />
                                <Modal
                                  isOpen={showMPAInfo}
                                  onClose={() =>setShowMPAInfo(false)}
                                  title={layerTitle(layer)}
                                  >
                                    {t('map.descriptionMPA', 'Marine protected areas (MPAs)...')}
      
                                </Modal>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </Modal>
              )}
              {/* <Rulers /> */}
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
