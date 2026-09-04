import { Fragment, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { groupBy, uniqBy } from 'es-toolkit'

import type { DatasetSubCategory } from '@globalfishingwatch/api-types'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import type {
  ContextPickingObject,
  FourwingsHeatmapPickingObject,
  PolygonPickingObject,
  RulerPickingObject,
  UserLayerPickingObject,
  VesselEventPickingObject,
} from '@globalfishingwatch/deck-layers'
import {
  FOOTPRINT_ID,
  FourwingsComparisonMode,
  POSITIONS_ID,
} from '@globalfishingwatch/deck-layers'

import { POPUP_CATEGORY_ORDER } from 'data/map/config'
import { getDatasetTitleByDataview } from 'features/_map/datasets/datasets.utils'
import { selectAllDataviewInstancesResolved } from 'features/_map/dataviews/selectors/dataviews.resolvers.selectors'
import { PORTS_LAYER_ID, REPORT_HOTSPOT_ID } from 'features/_map/map/map.config'
import { useMapViewport } from 'features/_map/map/map-viewport.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'

import type {
  SliceExtendedClusterPickingObject,
  SliceExtendedFourwingsPickingObject,
} from '../map.slice'
import {
  selectActivityInteractionError,
  selectActivityInteractionStatus,
  selectApiEventError,
  selectApiEventStatus,
  selectDetectionPositionsInteractionError,
  selectDetectionPositionsInteractionStatus,
  selectRealTimePositionsInteractionError,
  selectRealTimePositionsInteractionStatus,
} from '../map.slice'

import ActivityTooltipRow from './activity/ActivityTooltipRow'
import ComparisonTooltipRow from './activity/ComparisonTooltipRow'
import DetectionsTooltipRow from './activity/DetectionsTooltipRow'
import PositionsTooltipSection from './activity/PositionsTooltipSection'
import ContextTooltipSection from './context/ContextTooltipSection'
import PortsTooltipSection from './context/PortsTooltipSection'
import GriddedValueTooltipSection from './environment/GriddedValueTooltipSection'
import VectorsTooltipRow from './environment/VectorsTooltipRow'
import EventsClusterTooltipSection from './events/EventsClusterTooltipSection'
import HotspotTooltipSection from './tools/HotspotTooltipSection'
import ReportBufferTooltipSection from './tools/ReportBufferTooltipSection'
import RulerTooltipSection from './tools/RulerTooltipSection'
import WorkspacePointsTooltipSection from './tools/WorkspacePointsTooltipSection'
import UserContextTooltipSection from './user/UserContextTooltipSection'
import UserPointsTooltipSection from './user/UserPointsTooltipSection'
import UserTracksTooltipSection from './user/UserTracksTooltipSection'
import VesselEventsTooltipSection from './vessels/VesselEventsTooltipSection'
import VesselGroupTooltipRow from './vessels/VesselGroupTooltipRow'
import VesselTracksTooltipSection from './vessels/VesselTracksTooltipSection'

import styles from './Popup.module.css'

type PopupByCategoryProps = {
  interaction: InteractionEvent | null
  type?: 'hover' | 'click'
}

const OMITTED_CATEGORIES = ['draw']

function PopupByCategory({ interaction, type = 'hover' }: PopupByCategoryProps) {
  const { t } = useTranslation()
  // Assuming only timeComparison heatmap is visible, so timerange description apply to all
  const mapViewport = useMapViewport()
  const dataviews = useSelector(selectAllDataviewInstancesResolved) as UrlDataviewInstance[]
  const activityInteractionStatus = useSelector(selectActivityInteractionStatus)
  const activityInteractionError = useSelector(selectActivityInteractionError)
  const detectionPositionsInteractionStatus = useSelector(selectDetectionPositionsInteractionStatus)
  const detectionPositionsInteractionError = useSelector(selectDetectionPositionsInteractionError)
  const realTimePositionsInteractionStatus = useSelector(selectRealTimePositionsInteractionStatus)
  const realTimePositionsInteractionError = useSelector(selectRealTimePositionsInteractionError)
  const apiEventStatus = useSelector(selectApiEventStatus)
  const apiEventError = useSelector(selectApiEventError)
  if (!mapViewport || !interaction || !interaction.features?.length) return null

  const hotspotFeature = interaction?.features.find((f) => (f as any).id === REPORT_HOTSPOT_ID)
  const hotspotProperties = hotspotFeature ? (hotspotFeature as any).properties : null

  const visibleFeatures = interaction?.features.filter(
    (feature) =>
      !OMITTED_CATEGORIES.includes(feature.category) && (feature as any).id !== REPORT_HOTSPOT_ID
  )

  if (!visibleFeatures.length && !hotspotFeature) return null
  const featureByCategory = groupBy(
    visibleFeatures
      // Needed to create a new array and not muting with sort
      .map((feature) => feature)
      .sort(
        (a, b) =>
          POPUP_CATEGORY_ORDER.indexOf(a?.category as DataviewCategory) -
          POPUP_CATEGORY_ORDER.indexOf(b?.category as DataviewCategory)
      ),
    (f) => f.category
  )

  return (
    <div className={styles.content} translate="no">
      {Object.entries(featureByCategory)?.map(([featureCategory, allCategoryFeatures]) => {
        const features = allCategoryFeatures.some((feature) => feature.uniqueFeatureInteraction)
          ? [allCategoryFeatures[0]]
          : allCategoryFeatures
        switch (featureCategory) {
          case DataviewCategory.Activity:
          case DataviewCategory.Detections: {
            const positionFeatures = (features as SliceExtendedFourwingsPickingObject[]).filter(
              (feature) => feature.visualizationMode === POSITIONS_ID
            )
            const uniqPositionFeatures = uniqBy(positionFeatures, (f) => f.properties.id)
            const heatmapFeatures = (features as SliceExtendedFourwingsPickingObject[]).filter(
              (feature) => feature.visualizationMode?.includes('heatmap')
            )
            const isDetectionsCategory = featureCategory === DataviewCategory.Detections
            const isPositionInteraction = uniqPositionFeatures.length > 0
            const TooltipComponent = isDetectionsCategory
              ? DetectionsTooltipRow
              : ActivityTooltipRow
            return (
              <Fragment key={featureCategory}>
                {isPositionInteraction && (
                  <PositionsTooltipSection
                    key={featureCategory}
                    features={uniqPositionFeatures}
                    showFeaturesDetails={type === 'click'}
                    loading={
                      detectionPositionsInteractionStatus === AsyncReducerStatus.Loading ||
                      realTimePositionsInteractionStatus === AsyncReducerStatus.Loading
                    }
                    error={detectionPositionsInteractionError || realTimePositionsInteractionError}
                  />
                )}
                {heatmapFeatures.map((feature, i) => {
                  if (feature.comparisonMode === FourwingsComparisonMode.TimeCompare) {
                    return (
                      <ComparisonTooltipRow
                        key={featureCategory}
                        feature={features[0] as FourwingsHeatmapPickingObject}
                        showFeaturesDetails={type === 'click'}
                      />
                    )
                  }
                  return feature.sublayers?.map((sublayer, j) => {
                    const dataview = dataviews.find((d) => d.id === sublayer.id)
                    return (
                      <TooltipComponent
                        key={`${i}-${j}`}
                        loading={activityInteractionStatus === AsyncReducerStatus.Loading}
                        error={
                          activityInteractionError === AsyncReducerStatus.Error
                            ? activityInteractionError ||
                              t((t) => t.errors.genericShort, {
                                defaultValue: 'Something went wrong',
                              })
                            : undefined
                        }
                        feature={{
                          ...sublayer,
                          category: feature.category as DataviewCategory,
                          title: dataview
                            ? getDatasetTitleByDataview(dataview, { showPrivateIcon: false })
                            : feature.title,
                        }}
                        showFeaturesDetails={type === 'click'}
                        activityType={dataview?.datasets?.[0]?.subcategory as DatasetSubCategory}
                      />
                    )
                  })
                })}
              </Fragment>
            )
          }
          case DataviewCategory.VesselGroups: {
            const heatmapFeatures = (features as SliceExtendedFourwingsPickingObject[]).filter(
              (feature) => feature.visualizationMode === FOOTPRINT_ID
            )
            return heatmapFeatures.map((feature, i) => {
              return feature.sublayers?.map((sublayer, j) => {
                const vesselGroup = dataviews.find((d) => d.id === sublayer.id)?.vesselGroup
                return (
                  <VesselGroupTooltipRow
                    key={`${i}-${j}`}
                    loading={activityInteractionStatus === AsyncReducerStatus.Loading}
                    feature={{
                      ...sublayer,
                      category: feature.category as DataviewCategory,
                      title: vesselGroup?.name as string,
                    }}
                    showFeaturesDetails={type === 'click'}
                  />
                )
              })
            })
          }
          case DataviewCategory.Events: {
            return (
              <EventsClusterTooltipSection
                key={featureCategory}
                features={features as SliceExtendedClusterPickingObject[]}
                showFeaturesDetails={type === 'click'}
                error={
                  apiEventStatus === AsyncReducerStatus.Error
                    ? apiEventError || t((t) => t.errors.genericShort)
                    : undefined
                }
                loading={apiEventStatus === AsyncReducerStatus.Loading}
              />
            )
          }
          case DataviewCategory.Environment: {
            const contextFeatures = (features as UserLayerPickingObject[]).filter(
              (feature) => feature.subcategory === DataviewType.UserContext
            )
            const vectorsFeatures = (features as FourwingsHeatmapPickingObject[]).filter(
              (feature) => feature.subcategory === DataviewType.FourwingsVector
            )
            const environmentalFeatures = (
              features as SliceExtendedFourwingsPickingObject[]
            ).filter(
              (feature) =>
                feature.subcategory !== DataviewType.UserContext &&
                feature.subcategory !== DataviewType.FourwingsVector
            )
            return (
              <Fragment key={featureCategory}>
                {vectorsFeatures.map((currentsFeature) => (
                  <VectorsTooltipRow
                    key={currentsFeature.id}
                    feature={currentsFeature}
                    showFeaturesDetails={type === 'click'}
                  />
                ))}
                <UserContextTooltipSection
                  features={contextFeatures}
                  showFeaturesDetails={type === 'click'}
                />
                <GriddedValueTooltipSection
                  features={environmentalFeatures}
                  showFeaturesDetails={type === 'click'}
                />
              </Fragment>
            )
          }
          case DataviewCategory.Context: {
            const portFeatures: UserLayerPickingObject[] = []
            const pointFeatures: UserLayerPickingObject[] = []
            const contextFeatures: ContextPickingObject[] = []
            const userContextFeatures: UserLayerPickingObject[] = []
            for (const feature of features) {
              if (feature.layerId.startsWith(PORTS_LAYER_ID)) {
                portFeatures.push(feature as UserLayerPickingObject)
              } else if (
                (feature as UserLayerPickingObject).subcategory === DataviewType.UserPoints
              ) {
                pointFeatures.push(feature as UserLayerPickingObject)
              } else if (feature.subcategory === DataviewType.UserContext) {
                // Workaround to show user context features in the context section
                userContextFeatures.push(feature as UserLayerPickingObject)
              } else {
                contextFeatures.push(feature as ContextPickingObject)
              }
            }

            return (
              <Fragment key={featureCategory}>
                <ContextTooltipSection
                  features={contextFeatures}
                  showFeaturesDetails={type === 'click'}
                />
                <UserPointsTooltipSection
                  features={pointFeatures}
                  showFeaturesDetails={type === 'click'}
                />
                <UserContextTooltipSection
                  features={userContextFeatures}
                  showFeaturesDetails={type === 'click'}
                />
                <PortsTooltipSection
                  features={portFeatures}
                  showFeaturesDetails={type === 'click'}
                />
              </Fragment>
            )
          }
          case DataviewCategory.Buffer: {
            return (
              <ReportBufferTooltipSection
                key={featureCategory}
                features={features as PolygonPickingObject[]}
              />
            )
          }
          case DataviewCategory.User: {
            const userPointFeatures = (features as UserLayerPickingObject[]).filter(
              (feature) =>
                feature.subcategory === DataviewType.UserPoints ||
                feature.subcategory === 'draw-points'
            )
            const userContextFeatures = (features as UserLayerPickingObject[]).filter(
              (feature) =>
                feature.subcategory === DataviewType.UserContext ||
                feature.subcategory === 'draw-polygons'
            )
            const userTrackFeatures = (features as UserLayerPickingObject[]).filter(
              (feature) => feature.subcategory === DataviewType.Track
            )
            const userBQHeatmapFeatures = (features as FourwingsHeatmapPickingObject[]).filter(
              (feature) =>
                feature.subcategory === DataviewType.UserContext ||
                feature.subcategory === DataviewType.HeatmapAnimated
            )
            const userStaticHeatmapFeatures = (
              features as SliceExtendedFourwingsPickingObject[]
            ).filter((feature) => feature.subcategory === DataviewType.HeatmapStatic)
            return (
              <Fragment key={featureCategory}>
                <UserPointsTooltipSection
                  features={userPointFeatures}
                  showFeaturesDetails={type === 'click'}
                />
                <UserTracksTooltipSection
                  features={userTrackFeatures}
                  showFeaturesDetails={type === 'click'}
                />
                <UserContextTooltipSection
                  features={userContextFeatures}
                  showFeaturesDetails={type === 'click'}
                />
                <GriddedValueTooltipSection
                  features={userStaticHeatmapFeatures}
                  showFeaturesDetails={type === 'click'}
                />
                {userBQHeatmapFeatures &&
                  userBQHeatmapFeatures.map((feature, i) => {
                    return feature.sublayers?.map((sublayer, j) => {
                      const dataview = dataviews.find((d) => d.id === sublayer.id)
                      return (
                        <ActivityTooltipRow
                          key={`${i}-${j}`}
                          loading={activityInteractionStatus === AsyncReducerStatus.Loading}
                          feature={{
                            ...sublayer,
                            category: feature.category as DataviewCategory,
                            title: dataview
                              ? getDatasetTitleByDataview(dataview, { showPrivateIcon: false })
                              : feature.title,
                          }}
                          showFeaturesDetails={type === 'click'}
                          activityType={dataview?.datasets?.[0]?.subcategory as DatasetSubCategory}
                        />
                      )
                    })
                  })}
              </Fragment>
            )
          }
          case DataviewCategory.Vessels: {
            const trackFeatures = (features as VesselEventPickingObject[]).filter(
              (feature) => feature.subcategory === DataviewType.Track
            )
            const eventFeatures = (features as VesselEventPickingObject[]).filter(
              (feature) => feature.subcategory === DataviewType.VesselEvents
            )
            return (
              <Fragment key={featureCategory}>
                <VesselTracksTooltipSection
                  features={trackFeatures}
                  showFeaturesDetails={type === 'click'}
                />
                <VesselEventsTooltipSection
                  features={eventFeatures}
                  showFeaturesDetails={type === 'click'}
                />
              </Fragment>
            )
          }
          case DataviewCategory.Workspaces: {
            return (
              <WorkspacePointsTooltipSection
                key={featureCategory}
                features={features as any}
                showFeaturesDetails={type === 'click'}
              />
            )
          }
          case 'rulers': {
            const rulersFeatures = (features as RulerPickingObject[]).filter(
              (f) => f.properties.order === 'start' || f.properties.order === 'end'
            )
            return (
              <RulerTooltipSection
                key={featureCategory}
                features={rulersFeatures}
                showFeaturesDetails={type === 'click'}
              />
            )
          }
          default:
            return null
        }
      })}
      {hotspotProperties && <HotspotTooltipSection properties={hotspotProperties} />}
    </div>
  )
}

export default memo(PopupByCategory)
