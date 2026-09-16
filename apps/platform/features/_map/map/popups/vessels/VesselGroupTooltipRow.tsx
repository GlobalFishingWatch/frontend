import { Fragment } from 'react'

import type { DataviewCategory } from '@globalfishingwatch/api-types'
import { DatasetSubCategory } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'

import type { SliceExtendedFourwingsDeckSublayer } from '../../map.slice'
import PopupSectionLayout from '../shared/PopupSectionLayout'
import VesselsTable from '../shared/VesselsTable'

import popupStyles from '../Popup.module.css'

type VesselGroupTooltipRowProps = {
  feature: SliceExtendedFourwingsDeckSublayer & { category: DataviewCategory; title?: string }
  loading?: boolean
  showFeaturesDetails?: boolean
}

function VesselGroupTooltipRow({
  feature,
  loading,
  showFeaturesDetails,
}: VesselGroupTooltipRowProps) {
  return (
    <Fragment>
      <PopupSectionLayout
        icon="heatmap"
        iconColor={feature.color}
        title={showFeaturesDetails ? feature.title : undefined}
      >
        {!showFeaturesDetails && <h3 className={popupStyles.rowText}>{feature.title}</h3>}
        {loading && (
          <div className={popupStyles.loading}>
            <Spinner size="small" />
          </div>
        )}
        {!loading && showFeaturesDetails && (
          <VesselsTable
            feature={feature}
            activityType={DatasetSubCategory.Presence}
            showValue={false}
          />
        )}
      </PopupSectionLayout>
    </Fragment>
  )
}

export default VesselGroupTooltipRow
