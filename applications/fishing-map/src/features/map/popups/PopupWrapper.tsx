import React from 'react'
import cx from 'classnames'
import { Anchor } from 'mapbox-gl'
import groupBy from 'lodash/groupBy'
import { Popup } from '@globalfishingwatch/react-map-gl'
import { Generators } from '@globalfishingwatch/layer-composer'
import { TooltipEvent } from 'features/map/map.hooks'
import styles from './Popup.module.css'
import HeatmapTooltipRow from './HeatmapLayers'
import ContextTooltipSection from './ContextLayers'

type PopupWrapperProps = {
  event: TooltipEvent | null
  closeButton?: boolean
  closeOnClick?: boolean
  className?: string
  onClose?: () => void
  anchor?: Anchor
  type?: 'hover' | 'click'
}
function PopupWrapper({
  event,
  closeButton = false,
  closeOnClick = false,
  type = 'hover',
  className = '',
  onClose,
  anchor,
}: PopupWrapperProps) {
  if (!event) return null

  const featureByType = groupBy(
    event.features.sort((a, b) => (a.type === Generators.Type.HeatmapAnimated ? -1 : 0)),
    'type'
  )
  return (
    <Popup
      latitude={event.latitude}
      longitude={event.longitude}
      closeButton={closeButton}
      closeOnClick={closeOnClick}
      onClose={onClose}
      className={cx(styles.popup, styles[type], className)}
      anchor={anchor}
    >
      <div className={styles.content}>
        {Object.entries(featureByType).map(([featureType, features]) => {
          if (featureType === Generators.Type.HeatmapAnimated) {
            return features.map((feature, i) => (
              <HeatmapTooltipRow
                key={i + (feature.title as string)}
                feature={feature}
                showFeaturesDetails={type === 'click'}
              />
            ))
          }
          if (featureType === Generators.Type.Context) {
            return (
              <ContextTooltipSection
                key={featureType}
                features={features}
                showFeaturesDetails={type === 'click'}
              />
            )
          }
          if (featureType === Generators.Type.GL) {
            return features.map((feature, i) => (
              <div key={feature.value || i} className={styles.popupSection}>
                {feature.value}
              </div>
            ))
          }
          return null
        })}
      </div>
    </Popup>
  )
}

export default PopupWrapper
