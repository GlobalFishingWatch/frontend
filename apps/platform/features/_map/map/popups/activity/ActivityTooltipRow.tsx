import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import type { DatasetSubCategory, DataviewCategory } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'

import I18nNumber from 'features/i18n/i18nNumber'

import type { SliceExtendedFourwingsDeckSublayer } from '../../map.slice'
import PopupSectionLayout from '../shared/PopupSectionLayout'
import VesselsTable from '../shared/VesselsTable'

import popupStyles from '../Popup.module.css'

type ActivityTooltipRowProps = {
  feature: SliceExtendedFourwingsDeckSublayer & { category: DataviewCategory; title?: string }
  loading?: boolean
  error?: string
  showFeaturesDetails: boolean
  activityType?: DatasetSubCategory
}

type FeatureUnit = 'hours' | 'messages' | 'detections'

function ActivityTooltipRow({
  feature,
  showFeaturesDetails,
  loading,
  error,
  activityType,
}: ActivityTooltipRowProps) {
  const { t } = useTranslation()
  // TODO get the value based on the sublayer
  const value = feature?.value as number
  const unit = feature?.unit ?? ('hours' as FeatureUnit)
  if (!value) {
    return null
  }
  return (
    <Fragment>
      <PopupSectionLayout
        icon="heatmap"
        iconColor={feature.color}
        title={showFeaturesDetails && feature.title ? feature.title : undefined}
      >
        <div className={popupStyles.row}>
          <span className={popupStyles.rowText} data-testid="activity-tooltip-row-value">
            <I18nNumber number={value} />{' '}
            {t((t) => t.common[unit], {
              defaultValue: 'hours',
              count: value, // neded to select the plural automatically
            } as any)}
          </span>
        </div>
        {loading && (
          <div className={popupStyles.loading}>
            <Spinner size="small" />
          </div>
        )}
        {!loading && error && <p className={popupStyles.error}>{error}</p>}
        {!loading && showFeaturesDetails && (
          <VesselsTable feature={feature} activityType={activityType} />
        )}
      </PopupSectionLayout>
    </Fragment>
  )
}

export default ActivityTooltipRow
