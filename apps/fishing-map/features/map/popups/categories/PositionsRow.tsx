import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniq } from 'es-toolkit'
import { DateTime } from 'luxon'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import type { FourwingsPositionsPickingObject } from '@globalfishingwatch/deck-layers'
import {
  getIsActivityPositionMatched,
  getIsDetectionsPositionMatched,
} from '@globalfishingwatch/deck-layers'
import { Icon } from '@globalfishingwatch/ui-components'

import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import I18nDate from 'features/i18n/i18nDate'
import VesselPin from 'features/vessel/VesselPin'
import { formatInfoField } from 'utils/info'

import popupStyles from '../Popup.module.css'

type PositionsRowProps = {
  feature: FourwingsPositionsPickingObject
  showFeaturesDetails: boolean
}

function PositionsRow({ feature, showFeaturesDetails }: PositionsRowProps) {
  const allDatasets = useSelector(selectAllDatasets)
  // TODO get the value based on the sublayer
  const color = feature.sublayers?.[0]?.color
  const isPositionMatched =
    feature.category === 'activity'
      ? getIsActivityPositionMatched(feature)
      : getIsDetectionsPositionMatched(feature)
  const shipname = isPositionMatched
    ? (formatInfoField(feature.properties.shipname, 'shipname') as string)
    : ''
  const activityDatasets = uniq(
    feature.sublayers?.flatMap((sublayer) => sublayer.datasets || []) || []
  )
  const searchDatasets = allDatasets.flatMap((dataset) => {
    if (activityDatasets.includes(dataset.id)) {
      const relatedVesselDataset = getRelatedDatasetByType(dataset, DatasetTypes.Vessels)
      return relatedVesselDataset?.id || []
    }
    return []
  })

  return (
    <Fragment>
      <div className={cx(popupStyles.popupSection, popupStyles.smallPadding)}>
        <Icon icon="vessel" className={popupStyles.layerIcon} style={{ color }} />
        <div className={popupStyles.popupSectionContent}>
          <div className={popupStyles.row}>
            <span className={cx(popupStyles.rowText, popupStyles.vesselTitle)}>
              {showFeaturesDetails && isPositionMatched && (
                <VesselPin
                  vesselToSearch={{
                    id: feature.properties.vessel_id || feature.properties.id,
                    name: feature.properties.shipname,
                    datasets: searchDatasets,
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
