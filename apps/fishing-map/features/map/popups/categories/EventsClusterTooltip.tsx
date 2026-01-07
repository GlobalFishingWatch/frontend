import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { getDatasetLabel } from 'features/datasets/datasets.utils'
import EventsClusterTooltipRow from 'features/map/popups/categories/EventsClusterTooltipRow'

import type { SliceExtendedClusterPickingObject } from '../../map.slice'

import styles from '../Popup.module.css'

type EventsClusterTooltipProps = {
  features: SliceExtendedClusterPickingObject[]
  showFeaturesDetails: boolean
  loading?: boolean
  error?: string
}

export function EventsClusterTooltip({
  features,
  showFeaturesDetails,
  loading,
  error,
}: EventsClusterTooltipProps) {
  const { t } = useTranslation()
  if (showFeaturesDetails && features.length > 1) {
    const feature = {
      ...features[0],
      title: getDatasetLabel({
        id: features[0].datasetId!,
      }),
      count: features[0]?.properties?.value || 1,
    }
    const moreFeatures = features.slice(1)
    return (
      <Fragment>
        <EventsClusterTooltipRow
          feature={feature}
          showFeaturesDetails={showFeaturesDetails}
          loading={loading}
          error={error}
        />
        {moreFeatures.length > 0 && (
          <div className={cx(styles.popupSection, styles.secondary)}>
            + {moreFeatures.length} {t('common.more')}
          </div>
        )}
      </Fragment>
    )
  }
  return (
    <Fragment>
      {features.map((f) => {
        const feature = {
          ...f,
          title: getDatasetLabel({ id: f.datasetId! }),
          count: f?.properties?.value || 1,
        }
        return (
          <EventsClusterTooltipRow
            key={f.id}
            feature={feature}
            showFeaturesDetails={showFeaturesDetails}
            error={error}
            loading={loading}
          />
        )
      })}
    </Fragment>
  )
}

export default EventsClusterTooltip
