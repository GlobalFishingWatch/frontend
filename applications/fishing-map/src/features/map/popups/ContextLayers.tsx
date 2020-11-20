import React, { Fragment } from 'react'
// import { ContextLayerType } from '@globalfishingwatch/layer-composer/dist/generators/types'
import groupBy from 'lodash/groupBy'
import { IconButton } from '@globalfishingwatch/ui-components'
import { TooltipEventFeature } from 'features/map/map.hooks'
import styles from './Popup.module.css'

const TunaRfmoLinksById: Record<string, string> = {
  CCSBT: 'https://www.ccsbt.org/',
  ICCAT: 'https://www.iccat.int/en/',
  IATTC: 'http://www.iattc.org/',
  IOTC: 'http://www.iotc.org/',
  WCPFC: 'http://www.wcpfc.int/',
}

function getRowByLayer(feature: TooltipEventFeature, showFeaturesDetails = false) {
  if (!feature.value) return null

  // ContextLayerType.MPA but enums doesn't work in CRA for now
  if (feature.layer === 'mpa') {
    const { wdpa_pid } = feature.properties
    const label = `${feature.value} - ${feature.properties.desig}`
    return (
      <div className={styles.row} key={label}>
        <span className={styles.rowText}>{label}</span>
        {showFeaturesDetails && (
          <div className={styles.rowActions}>
            <IconButton icon="report" tooltip="Report (Coming soon)" size="small" />
            {wdpa_pid && (
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://www.protectedplanet.net/${wdpa_pid}`}
              >
                <IconButton icon="info" tooltip="See more" size="small" />
              </a>
            )}
          </div>
        )}
      </div>
    )
  }
  if (feature.layer === 'tuna-rfmo') {
    const link = TunaRfmoLinksById[feature.value]
    return (
      <div className={styles.row} key={feature.value}>
        <span className={styles.rowText}>{feature.value}</span>
        {showFeaturesDetails && link && (
          <div className={styles.rowActions}>
            <a target="_blank" rel="noreferrer" href={link}>
              <IconButton icon="info" tooltip="See more" size="small" />
            </a>
          </div>
        )}
      </div>
    )
  }
  if (feature.layer === 'eez-areas') {
    const { mrgid } = feature.properties
    return (
      <div className={styles.row} key={mrgid}>
        <span className={styles.rowText}>{feature.value}</span>
        {showFeaturesDetails && (
          <div className={styles.rowActions}>
            <IconButton icon="report" tooltip="Report (Coming soon)" size="small" />
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.marineregions.org/eezdetails.php?mrgid=${mrgid}`}
            >
              <IconButton icon="info" tooltip="See more" size="small" />
            </a>
          </div>
        )}
      </div>
    )
  }
  return <div key={feature.value}>{feature.value}</div>
}

type ContextTooltipRowProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: ContextTooltipRowProps) {
  const featuresByType = groupBy(features, 'layer')
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType) => (
        <div key={featureByType[0].title} className={styles.popupSection}>
          <span
            className={styles.popupSectionColor}
            style={{ backgroundColor: featureByType[0].color }}
          />
          <div className={styles.popupSectionContent}>
            {showFeaturesDetails && (
              <h3 className={styles.popupSectionTitle}>{featureByType[0].title}</h3>
            )}
            {featureByType.map((feature) => getRowByLayer(feature, showFeaturesDetails))}
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default ContextTooltipSection
