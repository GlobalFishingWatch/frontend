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
  const [showLayersPopup, setShowLayersPopup] = useState(false)
  const layers = useSelector(selectDataviewInstancesByType(GeneratorType.Context))

  const layerTitle = (dataview: UrlDataviewInstance) => {
    const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Context)
    return t(`datasets:${dataset?.id}.name` as any, dataset?.name)
  }

  const handleCloseShowLayers = useCallback(() => {
    setShowLayersPopup(false)
  }, [])

  return (
    <Fragment>
      <div className={styles.mapControls} onMouseEnter={onMouseEnter}>
        <div className={cx('print-hidden', styles.controlsNested)}>
          {extendedControls && (
            <Fragment>
              <IconButton
                icon="layers"
                type="map-tool"
                size="medium"
                data-tip-pos="left"
                aria-label={t('map.toggleLayers', 'Toggle layers')}
                onClick={() => setShowLayersPopup(!showLayersPopup)}
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
                          <LayerSwitch
                            key={layer.id}
                            className={styles.contextLayer}
                            classNameActive={styles.active}
                            dataview={layer}
                            title={layerTitle(layer)}
                          />
                        ))}
                    </div>
                  </div>
                </Modal>
              )}
              {/* <Rulers /> */}
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
