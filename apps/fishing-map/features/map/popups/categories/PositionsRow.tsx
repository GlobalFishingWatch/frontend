import { Fragment } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { Icon } from '@globalfishingwatch/ui-components'
import { FourwingsPositionsPickingObject } from '@globalfishingwatch/deck-layers'
import { formatInfoField } from 'utils/info'
import VesselPin from 'features/vessel/VesselPin'
import I18nDate from 'features/i18n/i18nDate'
import popupStyles from '../Popup.module.css'

type PositionsRowProps = {
  feature: FourwingsPositionsPickingObject
  showFeaturesDetails: boolean
}

function PositionsRow({ feature, showFeaturesDetails }: PositionsRowProps) {
  const { t } = useTranslation()
  // TODO get the value based on the sublayer
  const color = feature.sublayers?.[0]?.color
  const shipname = feature.properties.shipname
    ? (formatInfoField(feature.properties.shipname, 'shipname') as string)
    : ''
  return (
    <Fragment>
      <div className={cx(popupStyles.popupSection, popupStyles.smallPadding)}>
        <Icon icon="vessel" className={popupStyles.layerIcon} style={{ color }} />
        <div className={popupStyles.popupSectionContent}>
          <div className={popupStyles.row}>
            <span className={cx(popupStyles.rowText, popupStyles.vesselTitle)}>
              {showFeaturesDetails && shipname && (
                <VesselPin
                  vesselToResolve={{
                    id: feature.properties.id,
                    name: feature.properties.shipname,
                  }}
                />
              )}
              <span>
                <span className={popupStyles.marginRight}>{shipname}</span>
                <span className={popupStyles.secondary}>
                  <I18nDate
                    date={feature.properties.htime * 1000 * 60 * 60}
                    format={DateTime.DATETIME_MED}
                  />
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default PositionsRow
