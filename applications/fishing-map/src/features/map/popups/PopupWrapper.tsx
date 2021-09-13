import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { groupBy } from 'lodash'
import { Popup } from 'react-map-gl'
import type { PositionType } from 'react-map-gl/src/utils/dynamic-position'
import { Generators } from '@globalfishingwatch/layer-composer'
import { DataviewCategory } from '@globalfishingwatch/api-types/dist'
import { TooltipEvent } from 'features/map/map.hooks'
import { POPUP_CATEGORY_ORDER } from 'data/config'
import { PRESENCE_POC_INTERACTION } from 'features/datasets/datasets.slice'
import { selectDebugOptions } from 'features/debug/debug.slice'
import styles from './Popup.module.css'
import FishingTooltipRow from './FishingLayers'
import PresenceTooltipRow from './PresenceLayers'
import ViirsTooltipRow from './ViirsLayers'
import TileClusterRow from './TileClusterLayers'
import EnvironmentTooltipSection from './EnvironmentLayers'
import ContextTooltipSection from './ContextLayers'
import UserContextTooltipSection from './UserContextLayers'
import VesselEventsLayers from './VesselEventsLayers'

type PopupWrapperProps = {
  event: TooltipEvent | null
  closeButton?: boolean
  closeOnClick?: boolean
  className?: string
  onClose?: () => void
  anchor?: PositionType
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
  const debugOptions = useSelector(selectDebugOptions)

  if (!event) return null

  const visibleFeatures = event.features.filter((feature) => feature.visible)
  const featureByCategory = groupBy(
    visibleFeatures.sort(
      (a, b) => POPUP_CATEGORY_ORDER.indexOf(a.category) - POPUP_CATEGORY_ORDER.indexOf(b.category)
    ),
    'category'
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
      captureClick
    >
      <div className={styles.content}>
        {Object.entries(featureByCategory).map(([featureCategory, features]) => {
          switch (featureCategory) {
            case DataviewCategory.Fishing:
              return features.map((feature, i) => (
                <FishingTooltipRow
                  key={i + (feature.title as string)}
                  feature={feature}
                  showFeaturesDetails={type === 'click'}
                />
              ))
            case DataviewCategory.Presence:
              return features.map((feature, i) => {
                if (
                  feature.temporalgrid?.sublayerInteractionType === 'presence-detail' ||
                  (debugOptions.presenceTrackPOC &&
                    feature.temporalgrid?.sublayerInteractionType === PRESENCE_POC_INTERACTION)
                ) {
                  return (
                    <FishingTooltipRow
                      key={i + (feature.title as string)}
                      feature={feature}
                      showFeaturesDetails={type === 'click'}
                    />
                  )
                }
                return feature.temporalgrid?.sublayerInteractionType === 'viirs' ? (
                  <ViirsTooltipRow
                    key={i + (feature.title as string)}
                    feature={feature}
                    showFeaturesDetails={type === 'click'}
                  />
                ) : (
                  <PresenceTooltipRow
                    key={i + (feature.title as string)}
                    feature={feature}
                    showFeaturesDetails={type === 'click'}
                  />
                )
              })
            case DataviewCategory.Events:
              return (
                <TileClusterRow
                  key={featureCategory}
                  features={features}
                  showFeaturesDetails={type === 'click'}
                />
              )
            case DataviewCategory.Environment:
              return (
                <EnvironmentTooltipSection
                  key={featureCategory}
                  features={features}
                  showFeaturesDetails={type === 'click'}
                />
              )
            // TODO: merge UserContextTooltipSection and ContextTooltipSection
            case DataviewCategory.Context:
              const userContextFeatures = features.filter(
                (feature) => feature.type === Generators.Type.UserContext
              )
              const defaultContextFeatures = features.filter(
                (feature) => feature.type === Generators.Type.Context
              )
              return (
                <Fragment key={featureCategory}>
                  <UserContextTooltipSection
                    features={userContextFeatures}
                    showFeaturesDetails={type === 'click'}
                  />
                  <ContextTooltipSection
                    features={defaultContextFeatures}
                    showFeaturesDetails={type === 'click'}
                  />
                </Fragment>
              )

            case DataviewCategory.Vessels:
              return <VesselEventsLayers key={featureCategory} features={features} />

            default:
              return null
          }
        })}
      </div>
    </Popup>
  )
}

export default PopupWrapper
