import { Fragment } from 'react'
import { groupBy, uniqBy } from 'es-toolkit'
import { useSelector } from 'react-redux'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'
import { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import {
  ContextPickingObject,
  FourwingsComparisonMode,
  FourwingsHeatmapPickingObject,
  FourwingsPositionsPickingObject,
  PolygonPickingObject,
  RulerPickingObject,
  UserLayerPickingObject,
  VesselEventPickingObject,
} from '@globalfishingwatch/deck-layers'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { POPUP_CATEGORY_ORDER } from 'data/config'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useMapViewport } from 'features/map/map-viewport.hooks'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { selectAllDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'
import ComparisonRow from 'features/map/popups/categories/ComparisonRow'
import WorkspacePointsTooltipSection from 'features/map/popups/categories/WorkspacePointsLayers'
import DetectionsTooltipRow from 'features/map/popups/categories/DetectionsLayers'
import UserPointsTooltipSection from 'features/map/popups/categories/UserPointsLayers'
import ActivityTooltipRow from 'features/map/popups/categories/ActivityLayers'
import TileClusterTooltipRow from 'features/map/popups/categories/TileClusterTooltipRow'
import ContextTooltipSection from 'features/map/popups/categories/ContextLayers'
import VesselEventsLayers from 'features/map/popups/categories/VesselEventsLayers'
import EnvironmentTooltipSection from 'features/map/popups/categories/EnvironmentLayers'
import PositionsRow from 'features/map/popups/categories/PositionsRow'
import RulerTooltip from 'features/map/popups/categories/RulerTooltip'
import {
  SliceExtendedClusterPickingObject,
  SliceExtendedFourwingsPickingObject,
  selectApiEventStatus,
  selectFishingInteractionStatus,
} from '../map.slice'
import styles from './Popup.module.css'
import UserContextTooltipSection from './categories/UserContextLayers'
import ReportBufferTooltip from './categories/ReportBufferLayers'

type PopupByCategoryProps = {
  interaction: InteractionEvent | null
  type?: 'hover' | 'click'
}

const OMITED_CATEGORIES = ['draw']

function PopupByCategory({ interaction, type = 'hover' }: PopupByCategoryProps) {
  // Assuming only timeComparison heatmap is visible, so timerange description apply to all
  const mapViewport = useMapViewport()
  const dataviews = useSelector(selectAllDataviewInstancesResolved) as UrlDataviewInstance[]
  const activityInteractionStatus = useSelector(selectFishingInteractionStatus)
  const apiEventStatus = useSelector(selectApiEventStatus)
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
      {Object.entries(featureByCategory)?.map(([featureCategory, features]) => {
        switch (featureCategory) {
          // TODO: deck restore this popup
          // case DataviewCategory.Comparison:
          //   return (
          //     <ComparisonRow
          //       key={featureCategory}
          //       feature={features[0]}
          //       showFeaturesDetails={type === 'click'}
          //     />
          //   )
          case DataviewCategory.Activity:
          case DataviewCategory.Detections: {
            const positionFeatures = (features as SliceExtendedFourwingsPickingObject[]).filter(
              (feature) => feature.visualizationMode === 'positions'
            )
            const uniqPositionFeatures = uniqBy(positionFeatures, (f) => f.properties.id)
            const heatmapFeatures = (features as SliceExtendedFourwingsPickingObject[]).filter(
              (feature) => feature.visualizationMode !== 'positions'
            )
            const TooltipComponent =
              featureCategory === DataviewCategory.Detections
                ? DetectionsTooltipRow
                : ActivityTooltipRow
            return [...uniqPositionFeatures, ...heatmapFeatures].map((feature, i) => {
              if (feature.visualizationMode === 'positions') {
                return (
                  <PositionsRow
                    key={`${feature.id}-${i}`}
                    feature={feature as any as FourwingsPositionsPickingObject}
                    showFeaturesDetails={type === 'click'}
                  />
                )
              }
              return feature.sublayers?.map((sublayer, j) => {
                const dataview = dataviews.find((d) => d.id === sublayer.id)
                return feature.comparisonMode === FourwingsComparisonMode.TimeCompare ? (
                  <ComparisonRow
                    key={featureCategory}
                    feature={features[0] as FourwingsHeatmapPickingObject}
                    showFeaturesDetails={type === 'click'}
                  />
                ) : (
                  <TooltipComponent
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
                  />
                )
              })
            })
          }
          case DataviewCategory.Events: {
            if (apiEventStatus === AsyncReducerStatus.Loading) {
              return (
                <div className={styles.loading}>
                  <Spinner size="small" />
                </div>
              )
            }
            return (
              <TileClusterTooltipRow
                key={featureCategory}
                features={features as SliceExtendedClusterPickingObject[]}
                showFeaturesDetails={type === 'click'}
              />
            )
          }
          case DataviewCategory.Environment: {
            return (
              <Fragment key={featureCategory}>
                <EnvironmentTooltipSection
                  features={features as SliceExtendedFourwingsPickingObject[]}
                  showFeaturesDetails={type === 'click'}
                />
              </Fragment>
            )
          }
          case DataviewCategory.Context: {
            const contextFeatures = (features as ContextPickingObject[]).filter(
              (feature) => feature.subcategory !== DataviewType.UserPoints
            )
            const pointFeatures = (features as UserLayerPickingObject[]).filter(
              (feature) => feature.subcategory === DataviewType.UserPoints
            )
            // Workaround to show user context features in the context section
            const userContextFeatures = (features as UserLayerPickingObject[]).filter(
              (feature) => feature.subcategory === DataviewType.UserContext
            )
            return (
              <Fragment key={featureCategory}>
                <UserPointsTooltipSection
                  features={pointFeatures}
                  showFeaturesDetails={type === 'click'}
                />
                <ContextTooltipSection
                  features={contextFeatures}
                  showFeaturesDetails={type === 'click'}
                />
                <UserContextTooltipSection
                  features={userContextFeatures}
                  showFeaturesDetails={type === 'click'}
                />
              </Fragment>
            )
          }
          case DataviewCategory.Buffer: {
            return <ReportBufferTooltip features={features as PolygonPickingObject[]} />
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
            return (
              <Fragment key={featureCategory}>
                <UserPointsTooltipSection
                  features={userPointFeatures}
                  showFeaturesDetails={type === 'click'}
                />
                <UserContextTooltipSection
                  features={userContextFeatures}
                  showFeaturesDetails={type === 'click'}
                />
              </Fragment>
            )
          }

          case DataviewCategory.Vessels: {
            return (
              <VesselEventsLayers
                key={featureCategory}
                features={features as VesselEventPickingObject[]}
                showFeaturesDetails={type === 'click'}
              />
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
