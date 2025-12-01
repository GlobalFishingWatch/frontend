import { Fragment } from 'react'

import { Icon, Spinner } from '@globalfishingwatch/ui-components'

import I18nNumber from 'features/i18n/i18nNumber'

import type { ExtendedFeatureSingleEvent, SliceExtendedClusterPickingObject } from '../../map.slice'

import styles from '../Popup.module.css'

type EncountersLayerProps = {
  feature: SliceExtendedClusterPickingObject<ExtendedFeatureSingleEvent>
  showFeaturesDetails: boolean
  error?: string
  loading?: boolean
}

function GenericClusterTooltipRow({
  feature,
  showFeaturesDetails,
  error,
  loading,
}: EncountersLayerProps) {
  return (
    <div className={styles.popupSection}>
      <Icon icon="clusters" style={{ color: feature.color }} />
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails ? (
          <h3 className={styles.popupSectionTitle}>{feature.title}</h3>
        ) : (
          feature.count && (
            <div className={styles.row}>
              <span className={styles.rowText}>
                <I18nNumber number={feature.count} />
              </span>
            </div>
          )
        )}
        {error && <p className={styles.error}>{error}</p>}
        {loading ? (
          <Spinner className={styles.eventSpinner} inline size="small" />
        ) : (
          showFeaturesDetails &&
          feature.properties && (
            <div className={styles.row}>
              <ul className={styles.list}>
                {Object.entries(feature.properties).map(([key, value]) => {
                  if (key === 'count' || key === 'expansionZoom') {
                    return null
                  }
                  return (
                    <li key={key}>
                      <span className={styles.strong}>{key}</span>: {JSON.stringify(value)}
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default GenericClusterTooltipRow
