import { Fragment } from 'react'

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
  features: SliceExtendedClusterPickingObject[]
  showFeaturesDetails: boolean
  error?: string
}

const GFW_CLUSTER_LAYERS = [
  ...ENCOUNTER_EVENTS_SOURCES,
  PORT_VISITS_EVENTS_SOURCE_ID,
  LOITERING_EVENTS_SOURCE_ID,
  ...VESSEL_GROUP_EVENTS_DATAVIEW_IDS,
]

function ClusterTooltipRow({ features, showFeaturesDetails, error }: ClusterTooltipRowProps) {
  return (
    <Fragment>
      {features.map((feature, index) => {
        const key = `${feature.title}-${index}`
        const eventFeature =
          feature as SliceExtendedClusterPickingObject<ExtendedFeatureSingleEvent>
        if (
          GFW_CLUSTER_LAYERS.some(
            (source) => feature.layerId.split(LAYER_LIBRARY_ID_SEPARATOR)[0] === source
          )
        ) {
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
          if (feature.layerId.includes('encounter')) {
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
      })}
    </Fragment>
  )
}

export default ClusterTooltipRow
