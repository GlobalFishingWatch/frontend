import { DataviewType, EventTypes } from '@globalfishingwatch/api-types'

import { LAYER_LIBRARY_ID_SEPARATOR } from 'data/map/config'
import {
  ENCOUNTER_EVENTS_SOURCES,
  GAPS_EVENTS_SOURCE_ID,
  LOITERING_EVENTS_SOURCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
} from 'features/_map/dataviews/dataviews.utils'
import { VESSEL_GROUP_EVENTS_DATAVIEW_IDS } from 'features/_reports/report-vessel-group/vessel-group-report.dataviews'

import type {
  ExtendedFeatureByVesselEvent,
  ExtendedFeatureSingleEvent,
  SliceExtendedClusterPickingObject,
} from '../../map.slice'

import EventsClusterTooltipRow from './EventsClusterTooltipRow'
import EventsEncounterTooltipRow from './EventsEncounterTooltipRow'
import EventsGapTooltipRow from './EventsGapTooltipRow'
import EventsGenericClusterTooltipRow from './EventsGenericClusterTooltipRow'
import EventsPortVisitTooltipRow from './EventsPortVisitTooltipRow'

type PopupByEventTypeProps = {
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

function PopupByEventType({ feature, showFeaturesDetails, loading, error }: PopupByEventTypeProps) {
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
      <EventsClusterTooltipRow
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

export default PopupByEventType
