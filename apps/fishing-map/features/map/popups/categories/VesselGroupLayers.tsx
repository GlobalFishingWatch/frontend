import { Fragment } from 'react'

import type { DataviewCategory } from '@globalfishingwatch/api-types'
import { DatasetSubCategory } from '@globalfishingwatch/api-types'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'

import type { SliceExtendedFourwingsDeckSublayer } from '../../map.slice'

import VesselsTable from './VesselsTable'

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
      <div className={popupStyles.popupSection}>
        <Icon icon="heatmap" className={popupStyles.layerIcon} style={{ color: feature.color }} />
        <div className={popupStyles.popupSectionContent}>
          <h3 className={showFeaturesDetails ? popupStyles.popupSectionTitle : popupStyles.rowText}>
            {feature.title}
          </h3>
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
        </div>
      </div>
    </Fragment>
  )
}

export default VesselGroupTooltipRow
