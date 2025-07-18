import { DataviewType } from '@globalfishingwatch/api-types'

import { LAYER_LIBRARY_ID_SEPARATOR } from 'data/config'
import {
  ENCOUNTER_EVENTS_SOURCES,
  LOITERING_EVENTS_SOURCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
} from 'features/dataviews/dataviews.utils'
import ClusterEventTooltipRow from 'features/map/popups/categories/ClusterEventRow'
import GenericClusterTooltipRow from 'features/map/popups/categories/ClusterGenericTooltipRow'
import EncounterTooltipRow from 'features/map/popups/categories/EncounterTooltipRow'
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
  loading?: boolean
}

const GFW_CLUSTER_LAYERS = [
  'encounter', // Used in VMS workspaaces
  ...ENCOUNTER_EVENTS_SOURCES,
  PORT_VISITS_EVENTS_SOURCE_ID,
  LOITERING_EVENTS_SOURCE_ID,
  ...VESSEL_GROUP_EVENTS_DATAVIEW_IDS,
]

export function ClusterTooltipRow({
  feature,
  showFeaturesDetails,
  loading,
  error,
}: ClusterTooltipRowProps) {
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
          loading={loading}
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
          loading={loading}
          error={error}
          feature={eventFeature}
          showFeaturesDetails={showFeaturesDetails}
        />
      )
    }
    return (
      <ClusterEventTooltipRow
        key={key}
        loading={loading}
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
      loading={loading}
      feature={eventFeature}
      showFeaturesDetails={showFeaturesDetails}
    />
  )
}

export default ClusterTooltipRow
