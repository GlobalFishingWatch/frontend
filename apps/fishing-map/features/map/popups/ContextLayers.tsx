import React, { Fragment, useCallback } from 'react'
import { groupBy } from 'lodash'
import { event as uaEvent } from 'react-ga'
import { Icon } from '@globalfishingwatch/ui-components'
import { TooltipEventFeature } from 'features/map/map.hooks'
import styles from './Popup.module.css'
import ContextLayersRow from './ContextLayersRow'
import { useContextInteractions } from './ContextLayers.hooks'

const TunaRfmoLinksById: Record<string, string> = {
  CCSBT: 'https://www.ccsbt.org/',
  ICCAT: 'https://www.iccat.int/en/',
  IATTC: 'http://www.iattc.org/',
  IOTC: 'http://www.iotc.org/',
  WCPFC: 'http://www.wcpfc.int/',
}

type ContextTooltipRowProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: ContextTooltipRowProps) {
  const { onAnalysisClick, onDownloadClick } = useContextInteractions()
  const featuresByType = groupBy(features, 'layerId')

  const trackOnDownloadClick = useCallback(
    (event, feature) => {
      uaEvent({
        category: 'Data downloads',
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

              const { generatorContextLayer } = feature
              const { gfw_id } = feature.properties
              const isGFWLayer =
                ['mpa', 'mpa-restricted', 'mpa-no-take'].includes(
                  generatorContextLayer as string
                ) ||
                generatorContextLayer === 'tuna-rfmo' ||
                generatorContextLayer === 'eez-areas' ||
                generatorContextLayer === 'wpp-nri' ||
                generatorContextLayer === 'high-seas' ||
                generatorContextLayer === 'fao'

              if (isGFWLayer) {
                let id = gfw_id
                let label = feature.value ?? feature.title
                let linkHref = undefined
                // ContextLayerType.MPA but enums doesn't work in CRA for now
                if (
                  ['mpa', 'mpa-restricted', 'mpa-no-take'].includes(generatorContextLayer as string)
                ) {
                  const { wdpa_pid } = feature.properties
                  label = `${feature.value} - ${feature.properties.desig}`
                  id = `${label}-${gfw_id}`
                  linkHref = wdpa_pid ? `https://www.protectedplanet.net/${wdpa_pid}` : undefined
                } else if (generatorContextLayer === 'tuna-rfmo') {
                  id = `${feature.value}-${gfw_id}`
                  linkHref = TunaRfmoLinksById[feature.value]
                } else if (generatorContextLayer === 'eez-areas') {
                  const { mrgid } = feature.properties
                  id = `${mrgid}-${gfw_id}`
                  linkHref = `https://www.marineregions.org/eezdetails.php?mrgid=${mrgid}`
                } else if (
                  generatorContextLayer === 'wpp-nri' ||
                  generatorContextLayer === 'high-seas'
                ) {
                  id = `${feature.value}-${gfw_id}`
                }

                return (
                  <ContextLayersRow
                    id={id}
                    key={`${id}-${index}`}
                    label={label}
                    linkHref={linkHref}
                    showFeaturesDetails={showFeaturesDetails}
                    handleDownloadClick={(e) => trackOnDownloadClick(e, feature)}
                    handleAnalysisClick={(e) => onAnalysisClick(e, feature)}
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
