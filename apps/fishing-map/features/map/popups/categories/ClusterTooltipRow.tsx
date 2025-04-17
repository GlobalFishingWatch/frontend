import { Fragment } from 'react'

import { DataviewType } from '@globalfishingwatch/api-types'

import { LAYER_LIBRARY_ID_SEPARATOR } from 'data/config'
import {
  ENCOUNTER_EVENTS_SOURCES,
  LOITERING_EVENTS_SOURCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
} from 'features/dataviews/dataviews.utils'
import ClusterEventTooltipRow from 'features/map/popups/categories/ClusterEventTooltipRow'
import EncounterTooltipRow from 'features/map/popups/categories/EncounterTooltipRow'
import GenericClusterTooltipRow from 'features/map/popups/categories/GenericClusterTooltipRow'
import PortVisitEventTooltipRow from 'features/map/popups/categories/PortVisitEventTooltipRow'
import { VESSEL_GROUP_EVENTS_DATAVIEW_IDS } from 'features/reports/report-vessel-group/vessel-group-report.dataviews'

import type {
  ExtendedFeatureByVesselEvent,
  ExtendedFeatureSingleEvent,
  SliceExtendedClusterPickingObject,
} from '../../map.slice'

type ClusterTooltipRowProps = {
  feature: SliceExtendedClusterPickingObject
  showFeaturesDetails: boolean
  error?: string
}

type ClusterTooltipRowsProps = Omit<ClusterTooltipRowProps, 'feature'> & {
  features: SliceExtendedClusterPickingObject[]
}

const GFW_CLUSTER_LAYERS = [
  'encounter', // Used in VMS workspaaces
  ...ENCOUNTER_EVENTS_SOURCES,
  PORT_VISITS_EVENTS_SOURCE_ID,
  LOITERING_EVENTS_SOURCE_ID,
  ...VESSEL_GROUP_EVENTS_DATAVIEW_IDS,
]

export function ClusterTooltipRow({ feature, showFeaturesDetails, error }: ClusterTooltipRowProps) {
  const isGFWCluster = GFW_CLUSTER_LAYERS.some((source) => {
    const id = feature.layerId.split(LAYER_LIBRARY_ID_SEPARATOR)[0]
    return feature.subcategory === DataviewType.FourwingsTileCluster && id.includes(source)
  })
  const key = `${feature.title}-${feature.eventId}`
  const eventFeature = feature as SliceExtendedClusterPickingObject<ExtendedFeatureSingleEvent>
  if (isGFWCluster) {
    if (feature.layerId.includes('port')) {
      return (
        <PortVisitEventTooltipRow
          key={key}
          error={error}
          feature={feature as SliceExtendedClusterPickingObject<ExtendedFeatureByVesselEvent>}
          showFeaturesDetails={showFeaturesDetails}
        />
      )
    }
    if (feature.layerId.includes('encounter') || feature.layerId.includes('encounters')) {
      return (
        <EncounterTooltipRow
          key={key}
          error={error}
          feature={eventFeature}
          showFeaturesDetails={showFeaturesDetails}
        />
      )
    }
    return (
      <ClusterEventTooltipRow
        key={key}
        error={error}
        feature={eventFeature}
        showFeaturesDetails={showFeaturesDetails}
      />
    )
  }
  return (
    <GenericClusterTooltipRow
      key={key}
      error={error}
      feature={eventFeature}
      showFeaturesDetails={showFeaturesDetails}
    />
  )
}

function ClusterTooltipRows({ features, showFeaturesDetails, error }: ClusterTooltipRowsProps) {
  return (
    <Fragment>
      {features.map((feature, index) => {
        return (
          <ClusterTooltipRow
            key={`${feature.title}-${index}`}
            feature={feature}
            showFeaturesDetails={showFeaturesDetails}
            error={error}
          />
        )
      })}
    </Fragment>
  )
}

export default ClusterTooltipRows
