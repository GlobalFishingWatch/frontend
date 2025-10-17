import { Fragment } from 'react'
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

import { POPUP_CATEGORY_ORDER } from 'data/config'
import { SKYLIGHT_PROTOTYPE_DATASET_ID } from 'data/workspaces'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { selectAllDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { PORTS_LAYER_ID } from 'features/map/map.config'
import { useMapViewport } from 'features/map/map-viewport.hooks'
import ActivityTooltipRow from 'features/map/popups/categories/ActivityLayers'
import ClusterEventTooltip from 'features/map/popups/categories/ClusterEventTooltip'
import ComparisonRow from 'features/map/popups/categories/ComparisonRow'
import ContextTooltipSection from 'features/map/popups/categories/ContextLayers'
import DetectionsTooltipRow from 'features/map/popups/categories/DetectionsLayers'
import EnvironmentTooltipSection from 'features/map/popups/categories/EnvironmentLayers'
import PortsTooltipSection from 'features/map/popups/categories/PortsLayers'
import PositionsTooltipSection from 'features/map/popups/categories/PositionsTooltipSection'
import RulerTooltip from 'features/map/popups/categories/RulerTooltip'
import UserPointsTooltipSection from 'features/map/popups/categories/UserPointsLayers'
import UserTracksTooltipSection from 'features/map/popups/categories/UserTracksLayers'
import VesselEventsLayers from 'features/map/popups/categories/VesselEventsLayers'
import VesselGroupTooltipRow from 'features/map/popups/categories/VesselGroupLayers'
import VesselTracksLayers from 'features/map/popups/categories/VesselTracksLayers'
import WorkspacePointsTooltipSection from 'features/map/popups/categories/WorkspacePointsLayers'
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
  selectDetectionsInteractionError,
  selectDetectionsInteractionStatus,
} from '../map.slice'

import CurrentsTooltipRow from './categories/CurrentsLayers'
import ReportBufferTooltip from './categories/ReportBufferLayers'
import UserContextTooltipSection from './categories/UserContextLayers'

import styles from './Popup.module.css'

type PopupByCategoryProps = {
  interaction: InteractionEvent | null
  type?: 'hover' | 'click'
}

const OMITED_CATEGORIES = ['draw']

function PopupByCategory({ interaction, type = 'hover' }: PopupByCategoryProps) {
  const { t } = useTranslation()
  // Assuming only timeComparison heatmap is visible, so timerange description apply to all
  const mapViewport = useMapViewport()
  const dataviews = useSelector(selectAllDataviewInstancesResolved) as UrlDataviewInstance[]
  const activityInteractionStatus = useSelector(selectActivityInteractionStatus)
  const activityInteractionError = useSelector(selectActivityInteractionError)
  const detectionsInteractionStatus = useSelector(selectDetectionsInteractionStatus)
  const detectionsInteractionError = useSelector(selectDetectionsInteractionError)
  const apiEventStatus = useSelector(selectApiEventStatus)
  const apiEventError = useSelector(selectApiEventError)
  if (!mapViewport || !interaction || !interaction.features?.length) return null

  const visibleFeatures = interaction?.features.filter(
    (feature) => !OMITED_CATEGORIES.includes(feature.category)
  )

  if (!visibleFeatures.length) return null
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
    <div className={styles.content}>
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
            const TooltipComponent =
              featureCategory === DataviewCategory.Detections
                ? DetectionsTooltipRow
                : ActivityTooltipRow
            const interactionStatus =
              uniqPositionFeatures.length > 0
                ? detectionsInteractionStatus
                : activityInteractionStatus
            const interactionError =
              featureCategory === DataviewCategory.Detections
                ? detectionsInteractionError
                : activityInteractionError
            return (
              <Fragment key={featureCategory}>
                <PositionsTooltipSection
                  key={featureCategory}
                  features={uniqPositionFeatures}
                  showFeaturesDetails={type === 'click'}
                  loading={interactionStatus === AsyncReducerStatus.Loading}
                  error={interactionError}
                />
                {heatmapFeatures.map((feature, i) => {
                  if (feature.comparisonMode === FourwingsComparisonMode.TimeCompare) {
                    return (
                      <ComparisonRow
                        key={featureCategory}
                        feature={features[0] as FourwingsHeatmapPickingObject}
                        showFeaturesDetails={type === 'click'}
                      />
                    )
                  }
                  return feature.sublayers?.map((sublayer, j) => {
                    const dataview = dataviews.find((d) => d.id === sublayer.id)
                    const isSkylighPrototype = sublayer.datasets.some(
                      (d) => d === SKYLIGHT_PROTOTYPE_DATASET_ID
                    )
                    return (
                      <TooltipComponent
                        key={`${i}-${j}`}
                        loading={
                          (isSkylighPrototype ? activityInteractionStatus : interactionStatus) ===
                          AsyncReducerStatus.Loading
                        }
                        error={
                          interactionStatus === AsyncReducerStatus.Error
                            ? interactionError || t('errors.genericShort', 'Something went wrong')
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
              <ClusterEventTooltip
                key={featureCategory}
                features={features as SliceExtendedClusterPickingObject[]}
                showFeaturesDetails={type === 'click'}
                error={
                  apiEventStatus === AsyncReducerStatus.Error
                    ? apiEventError || t('errors.genericShort')
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
            const currentsFeatures = (features as FourwingsHeatmapPickingObject[])
              .filter((feature) => feature.subcategory === DataviewType.Currents)
              .map((feature) => ({
                ...feature,
                // TODO translate this
                title: 'Currents',
              }))
            const environmentalFeatures = (
              features as SliceExtendedFourwingsPickingObject[]
            ).filter(
              (feature) =>
                feature.subcategory !== DataviewType.UserContext &&
                feature.subcategory !== DataviewType.Currents
            )
            return (
              <Fragment key={featureCategory}>
                {currentsFeatures.map((currentsFeature) => (
                  <CurrentsTooltipRow
                    key={currentsFeature.id}
                    feature={currentsFeature}
                    showFeaturesDetails={type === 'click'}
                  />
                ))}
                <UserContextTooltipSection
                  features={contextFeatures}
                  showFeaturesDetails={type === 'click'}
                />
                <EnvironmentTooltipSection
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
              <ReportBufferTooltip
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
                <VesselTracksLayers
                  features={trackFeatures}
                  showFeaturesDetails={type === 'click'}
                />
                <VesselEventsLayers
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
              <RulerTooltip
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
    </div>
  )
}

export default PopupByCategory
