import { Spinner } from '@globalfishingwatch/ui-components'

import I18nNumber from 'features/i18n/i18nNumber'

import type { ExtendedFeatureSingleEvent, SliceExtendedClusterPickingObject } from '../../map.slice'
import PopupSectionLayout from '../shared/PopupSectionLayout'

import styles from '../Popup.module.css'

type EventsGenericClusterTooltipRowProps = {
  feature: SliceExtendedClusterPickingObject<ExtendedFeatureSingleEvent>
  showFeaturesDetails: boolean
  error?: string
  loading?: boolean
}

function EventsGenericClusterTooltipRow({
  feature,
  showFeaturesDetails,
  error,
  loading,
}: EventsGenericClusterTooltipRowProps) {
  return (
    <PopupSectionLayout
      icon="clusters"
      iconColor={feature.color}
      title={showFeaturesDetails ? feature.title : undefined}
    >
      {!showFeaturesDetails && feature.count && (
        <div className={styles.row}>
          <span className={styles.rowText}>
            <I18nNumber number={feature.count} />
          </span>
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {loading ? (
        <Spinner className={styles.loading} size="small" />
      ) : (
        showFeaturesDetails &&
        feature.properties && (
          <div className={styles.row}>
            <ul className={styles.list}>
              {Object.entries(feature.properties).map(([key, value]) => {
                if (key === 'count' || key === 'expansionZoom') {
                  return null
                }
                let displayValue: string
                try {
                  displayValue = JSON.stringify(value)
                } catch {
                  displayValue = ''
                }
                return (
                  <li key={key}>
                    <span className={styles.strong}>{key}</span>: {displayValue}
                  </li>
                )
              })}
            </ul>
          </div>
        )
      )}
    </PopupSectionLayout>
  )
}

export default EventsGenericClusterTooltipRow
