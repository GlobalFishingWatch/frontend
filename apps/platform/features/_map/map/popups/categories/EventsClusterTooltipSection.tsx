import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { selectAllDatasets } from 'features/_map/datasets/datasets.slice'
import { getDatasetLabel } from 'features/_map/datasets/datasets.utils'

import type { SliceExtendedClusterPickingObject } from '../../map.slice'

import PopupByEventType from './PopupByEventType'

import styles from '../Popup.module.css'

type EventsClusterTooltipSectionProps = {
  features: SliceExtendedClusterPickingObject[]
  showFeaturesDetails: boolean
  loading?: boolean
  error?: string
}

function EventsClusterTooltipSection({
  features,
  showFeaturesDetails,
  loading,
  error,
}: EventsClusterTooltipSectionProps) {
  const datasets = useSelector(selectAllDatasets)
  const { t } = useTranslation()
  if (showFeaturesDetails && features.length > 1) {
    const dataset = datasets.find((d) => d.id === features[0].datasetId)
    const feature = {
      ...features[0],
      title: getDatasetLabel(dataset) || features[0].datasetId,
      count: features[0]?.properties?.value || 1,
    }
    const moreFeatures = features.slice(1)
    return (
      <Fragment>
        <PopupByEventType
          feature={feature}
          showFeaturesDetails={showFeaturesDetails}
          loading={loading}
          error={error}
        />
        {moreFeatures.length > 0 && (
          <div className={cx(styles.popupSection, styles.secondary)}>
            + {moreFeatures.length} {t((t) => t.common.more)}
          </div>
        )}
      </Fragment>
    )
  }
  return (
    <Fragment>
      {features.map((f) => {
        const dataset = datasets.find((d) => d.id === features[0].datasetId)
        const feature = {
          ...f,
          title: getDatasetLabel(dataset) || features[0].datasetId,
          count: f?.properties?.value || 1,
        }
        return (
          <PopupByEventType
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

export default EventsClusterTooltipSection
