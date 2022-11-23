import { useCallback } from 'react'
import cx from 'classnames'
import { Popup } from 'react-map-gl'
import { ExtendedFeature } from '@globalfishingwatch/react-hooks'
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
  return (
    <Popup
      latitude={latitude}
      longitude={longitude}
      anchor="top-left"
      className={cx(styles.popup, styles['hover'], className)}
      focusAfterOpen={true}
      closeButton={false}
      maxWidth="600px"
    >
      <div className={styles.content}>
        {layers &&
          layers.map((layer, index) => (
            <div key={`${index}`} className={styles.popupSection}>
              <Icon
                icon="polygons"
                className={styles.layerIcon}
                style={{
                  color: getLayerColor(layer.datasetId),
                }}
              />
              <div className={styles.popupSectionContent}>
                <span className={styles.popupSectionTitle}>{layer.value}</span>
              </div>
            </div>
          ))}
      </div>
    </Popup>
  )
}

export default PopupWrapper
