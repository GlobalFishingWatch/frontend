import { Fragment, useCallback } from 'react'
import { groupBy } from 'lodash'
import { Icon } from '@globalfishingwatch/ui-components'
import { ContextLayerType } from '@globalfishingwatch/layer-composer'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { getContextAreaLink } from 'features/dataviews/dataviews.utils'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import styles from './Popup.module.css'
import ContextLayersRow from './ContextLayersRow'
import { useContextInteractions } from './ContextLayers.hooks'

type ContextTooltipRowProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: ContextTooltipRowProps) {
  const { onReportClick, onDownloadClick } = useContextInteractions()
  const featuresByType = groupBy(features, 'layerId')

  const trackOnDownloadClick = useCallback(
    (event, feature) => {
      trackEvent({
        category: TrackCategory.DataDownloads,
        action: `Click on polygon, click on download icon`,
      })
      onDownloadClick(event, feature)
    },
    [onDownloadClick]
  )

  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => (
        <div key={`${featureByType[0].title}-${index}`} className={styles.popupSection}>
          <Icon
            icon="polygons"
            className={styles.layerIcon}
            style={{ color: featureByType[0].color }}
          />
          <div className={styles.popupSectionContent}>
            {showFeaturesDetails && (
              <h3 className={styles.popupSectionTitle}>{featureByType[0].title}</h3>
            )}
            {featureByType.map((feature, index) => {
              if (!feature.value) return null
              const { generatorContextLayer, promoteId } = feature
              const gfw_id = feature.properties.gfw_id || feature.properties[promoteId as string]
              const isGFWLayer =
                generatorContextLayer === ContextLayerType.MPA ||
                generatorContextLayer === ContextLayerType.MPARestricted ||
                generatorContextLayer === ContextLayerType.MPANoTake ||
                generatorContextLayer === ContextLayerType.TunaRfmo ||
                generatorContextLayer === ContextLayerType.EEZ ||
                generatorContextLayer === ContextLayerType.WPPNRI ||
                generatorContextLayer === ContextLayerType.HighSeas ||
                generatorContextLayer === ContextLayerType.FAO ||
                generatorContextLayer === ContextLayerType.ProtectedSeas

              if (isGFWLayer) {
                let id = gfw_id
                let label = feature.value ?? feature.title
                let linkHref: string | undefined
                // ContextLayerType.MPA but enums doesn't work in CRA for now
                switch (generatorContextLayer) {
                  case ContextLayerType.MPA:
                  case ContextLayerType.MPANoTake:
                  case ContextLayerType.MPARestricted:
                    const { NAME, WDPA_PID } = feature.properties
                    label = NAME || feature.value || ''
                    id = `${label}-${gfw_id}`
                    linkHref = getContextAreaLink(generatorContextLayer, WDPA_PID)
                    break
                  case ContextLayerType.TunaRfmo:
                    id = `${feature.value}-${gfw_id}`
                    linkHref = getContextAreaLink(generatorContextLayer, feature.value)
                    break
                  case ContextLayerType.EEZ:
                    const { MRGID_EEZ } = feature.properties
                    id = `${MRGID_EEZ}-${gfw_id}`
                    linkHref = getContextAreaLink(generatorContextLayer, MRGID_EEZ)
                    break
                  case ContextLayerType.ProtectedSeas:
                    const { id: site_id } = feature.properties
                    id = `${site_id}-${gfw_id}`
                    linkHref = getContextAreaLink(generatorContextLayer, site_id)
                    break
                  case ContextLayerType.FAO:
                    const { F_CODE } = feature.properties
                    id = `${F_CODE}-${gfw_id}`
                    linkHref = getContextAreaLink(generatorContextLayer, F_CODE)
                    break
                  case ContextLayerType.WPPNRI:
                  case ContextLayerType.HighSeas:
                    id = `${feature.value}-${gfw_id}`
                    break
                }

                return (
                  <ContextLayersRow
                    id={id}
                    key={`${id}-${index}`}
                    label={label}
                    linkHref={linkHref}
                    feature={feature}
                    showFeaturesDetails={showFeaturesDetails}
                    handleDownloadClick={(e) => trackOnDownloadClick(e, feature)}
                    handleReportClick={onReportClick}
                  />
                )
              }
              return <div key={`${feature.value || gfw_id}`}>{feature.value ?? feature.title}</div>
            })}
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default ContextTooltipSection
