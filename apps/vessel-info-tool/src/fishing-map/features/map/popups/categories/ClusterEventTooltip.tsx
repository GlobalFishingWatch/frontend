import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { getDatasetLabel } from 'features/datasets/datasets.utils'
import ClusterTooltipRow from 'features/map/popups/categories/ClusterEventTooltipRow'

import type { SliceExtendedClusterPickingObject } from '../../map.slice'

import styles from '../Popup.module.css'

type ClusterTooltipProps = {
  features: SliceExtendedClusterPickingObject[]
  showFeaturesDetails: boolean
  loading?: boolean
  error?: string
}

export function ClusterTooltip({
  features,
  showFeaturesDetails,
  loading,
  error,
}: ClusterTooltipProps) {
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
        <ClusterTooltipRow
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
          <ClusterTooltipRow
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

export default ClusterTooltip
