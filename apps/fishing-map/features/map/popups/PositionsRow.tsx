import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { FourwingsPositionsPickingObject } from '@globalfishingwatch/deck-layers'
import I18nNumber from 'features/i18n/i18nNumber'
import { SliceExtendedFourwingsDeckSublayer } from '../map.slice'
import popupStyles from './Popup.module.css'
import VesselsTable from './VesselsTable'

type PositionsRowProps = {
  feature: FourwingsPositionsPickingObject
  showFeaturesDetails: boolean
}

function PositionsRow({ feature, showFeaturesDetails }: PositionsRowProps) {
  const { t } = useTranslation()
  // TODO get the value based on the sublayer
  const color = feature.sublayers?.[0]?.color
  console.log('🚀 ~ PositionsRow ~ feature:', feature)

  return (
    <Fragment>
      <div className={popupStyles.popupSection}>
        <Icon icon="vessel" className={popupStyles.layerIcon} style={{ color }} />
        <div className={popupStyles.popupSectionContent}>
          {showFeaturesDetails && feature.title && (
            <h3 className={popupStyles.popupSectionTitle}>{feature.title}</h3>
          )}
          {/* <div className={popupStyles.row}>
            <span className={popupStyles.rowText}>
              <I18nNumber number={value} />{' '}
              {t([`common.${feature?.unit}` as any, 'common.hour'], 'hours', {
                count: value, // neded to select the plural automatically
              })}
            </span>
          </div> */}
        </div>
      </div>
    </Fragment>
  )
}

export default PositionsRow
