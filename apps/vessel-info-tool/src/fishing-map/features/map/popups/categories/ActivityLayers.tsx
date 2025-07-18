import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import type { DatasetSubCategory, DataviewCategory } from '@globalfishingwatch/api-types'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'

import I18nNumber from 'features/i18n/i18nNumber'

import type { SliceExtendedFourwingsDeckSublayer } from '../../map.slice'

import VesselsTable from './VesselsTable'

import popupStyles from '../Popup.module.css'

type ActivityTooltipRowProps = {
  feature: SliceExtendedFourwingsDeckSublayer & { category: DataviewCategory; title?: string }
  loading?: boolean
  error?: string
  showFeaturesDetails: boolean
  activityType?: DatasetSubCategory
}

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
  if (!value) {
    return null
  }
  return (
    <Fragment>
      <div className={popupStyles.popupSection}>
        <Icon icon="heatmap" className={popupStyles.layerIcon} style={{ color: feature.color }} />
        <div className={popupStyles.popupSectionContent}>
          {showFeaturesDetails && feature.title && (
            <h3 className={popupStyles.popupSectionTitle}>{feature.title}</h3>
          )}
          <div className={popupStyles.row}>
            <span className={popupStyles.rowText}>
              <I18nNumber number={value} />{' '}
              {t([`common.${feature?.unit}` as any, 'common.hour'], 'hours', {
                count: value, // neded to select the plural automatically
              })}
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
        </div>
      </div>
    </Fragment>
  )
}

export default ActivityTooltipRow
