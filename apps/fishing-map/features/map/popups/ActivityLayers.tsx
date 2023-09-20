import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@globalfishingwatch/ui-components'
import I18nNumber from 'features/i18n/i18nNumber'
import { TooltipEventFeature } from 'features/map/map.hooks'
import popupStyles from './Popup.module.css'
import VesselsTable, { getVesselTableTitle } from './VesselsTable'

type ActivityTooltipRowProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}

function ActivityTooltipRow({ feature, showFeaturesDetails }: ActivityTooltipRowProps) {
  const { t } = useTranslation()
  const title = getVesselTableTitle(feature)

  return (
    <Fragment>
      <div className={popupStyles.popupSection}>
        <Icon icon="heatmap" className={popupStyles.layerIcon} style={{ color: feature.color }} />
        <div className={popupStyles.popupSectionContent}>
          {showFeaturesDetails && <h3 className={popupStyles.popupSectionTitle}>{title}</h3>}
          <div className={popupStyles.row}>
            <span className={popupStyles.rowText}>
              <I18nNumber number={feature.value} />{' '}
              {t([`common.${feature.temporalgrid?.unit}` as any, 'common.hour'], 'hours', {
                count: parseInt(feature.value), // neded to select the plural automatically
              })}
            </span>
          </div>
          {showFeaturesDetails && (
            <VesselsTable feature={feature} activityType={feature.subcategory} />
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default ActivityTooltipRow
