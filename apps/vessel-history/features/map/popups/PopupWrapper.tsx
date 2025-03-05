import { useCallback, useMemo } from 'react'
import { Popup } from 'react-map-gl'
import cx from 'classnames'

import type { ExtendedFeature } from '@globalfishingwatch/layer-composer';
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { Icon } from '@globalfishingwatch/ui-components'

import { dataviewInstances } from 'features/dataviews/dataviews.config'

import styles from './Popup.module.css'

type PopupWrapperProps = {
  layers: ExtendedFeature[]
  className?: string
  latitude: number
  longitude: number
}
function PopupWrapper({ layers, className = '', latitude = 0, longitude = 0 }: PopupWrapperProps) {
  const getLayerColor = useCallback(
    (datasetId: string) => {
      return dataviewInstances.find((layerConfig) => layerConfig.id === datasetId)?.config.color
    },
    [dataviewInstances]
  )
  const contexLayers = useMemo(
    () => layers.filter((feature) => feature.generatorType === GeneratorType.Context),
    [layers]
  )

  return (
    <Popup
      latitude={latitude}
      longitude={longitude}
      anchor="top-left"
      className={cx(styles.popup, styles.hover, className)}
      focusAfterOpen={true}
      closeButton={false}
      maxWidth="600px"
    >
      <div className={styles.content}>
        {contexLayers &&
          contexLayers.map((contexLayer, index) => (
            <div key={`${index}`} className={styles.popupSection}>
              <Icon
                icon="polygons"
                className={styles.layerIcon}
                style={{
                  color: getLayerColor(contexLayer.datasetId),
                }}
              />
              <div className={styles.popupSectionContent}>
                <span className={styles.popupSectionTitle}>{contexLayer.value}</span>
              </div>
            </div>
          ))}
      </div>
    </Popup>
  )
}

export default PopupWrapper
