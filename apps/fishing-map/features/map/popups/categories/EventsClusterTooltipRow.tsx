import { DataviewType, EventTypes } from '@globalfishingwatch/api-types'

import { LAYER_LIBRARY_ID_SEPARATOR } from 'data/config'
import {
  ENCOUNTER_EVENTS_SOURCES,
  GAPS_EVENTS_SOURCE_ID,
  LOITERING_EVENTS_SOURCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
} from 'features/dataviews/dataviews.utils'
import EventsClusterRow from 'features/map/popups/categories/EventsClusterRow'
import EventsEncounterTooltipRow from 'features/map/popups/categories/EventsEncounterTooltipRow'
import EventsGapTooltipRow from 'features/map/popups/categories/EventsGapTooltipRow'
import EventsGenericClusterTooltipRow from 'features/map/popups/categories/EventsGenericClusterTooltipRow'
import EventsPortVisitTooltipRow from 'features/map/popups/categories/EventsPortVisitTooltipRow'
import { VESSEL_GROUP_EVENTS_DATAVIEW_IDS } from 'features/reports/report-vessel-group/vessel-group-report.dataviews'

import type {
  ExtendedFeatureByVesselEvent,
  ExtendedFeatureSingleEvent,
  SliceExtendedClusterPickingObject,
} from '../../map.slice'

type EventsClusterTooltipRowProps = {
  feature: SliceExtendedClusterPickingObject
  showFeaturesDetails: boolean
  error?: string
  loading?: boolean
}

const GFW_CLUSTER_LAYERS = [
  'encounter', // Used in VMS workspaces
  'cluster-events', // Used in VMS workspaces
  ...ENCOUNTER_EVENTS_SOURCES,
  PORT_VISITS_EVENTS_SOURCE_ID,
  LOITERING_EVENTS_SOURCE_ID,
  GAPS_EVENTS_SOURCE_ID,
  ...VESSEL_GROUP_EVENTS_DATAVIEW_IDS,
]

export function EventsClusterTooltipRow({
  feature,
  showFeaturesDetails,
  loading,
  error,
}: EventsClusterTooltipRowProps) {
  const isGFWCluster = GFW_CLUSTER_LAYERS.some((source) => {
    const id = feature.layerId.split(LAYER_LIBRARY_ID_SEPARATOR)[0]
    return feature.subcategory === DataviewType.FourwingsTileCluster && id.includes(source)
  })
  const key = `${feature.title}-${feature.eventId}`
  const eventFeature = feature as SliceExtendedClusterPickingObject<ExtendedFeatureSingleEvent>
  if (isGFWCluster) {
    if (feature.layerId.includes('port')) {
      return (
        <EventsPortVisitTooltipRow
          key={key}
          loading={loading}
          error={error}
          feature={feature as SliceExtendedClusterPickingObject<ExtendedFeatureByVesselEvent>}
          showFeaturesDetails={showFeaturesDetails}
        />
      )
    }
    if (feature.layerId.includes(EventTypes.Encounter) || feature.layerId.includes('encounters')) {
      return (
        <EventsEncounterTooltipRow
          key={key}
          loading={loading}
          error={error}
          feature={eventFeature}
          showFeaturesDetails={showFeaturesDetails}
        />
      )
    }
    if (feature.layerId.includes(EventTypes.Gap) || feature.layerId.includes(EventTypes.Gaps)) {
      return (
        <EventsGapTooltipRow
          key={key}
          loading={loading}
          error={error}
          feature={eventFeature}
          showFeaturesDetails={showFeaturesDetails}
        />
      )
    }
    return (
      <EventsClusterRow
        key={key}
        loading={loading}
        error={error}
        feature={eventFeature}
        showFeaturesDetails={showFeaturesDetails}
      />
    )
  }
  return (
    <EventsGenericClusterTooltipRow
      key={key}
      error={error}
      loading={loading}
      feature={eventFeature}
      showFeaturesDetails={showFeaturesDetails}
    />
  )
}

export default EventsClusterTooltipRow
