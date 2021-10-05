import React, { Fragment, useCallback } from 'react'
import { groupBy } from 'lodash'
import { batch, useDispatch, useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import bbox from '@turf/bbox'
import { useFeatureState } from '@globalfishingwatch/react-hooks/dist/use-map-interaction'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { TIMEBAR_HEIGHT } from 'features/timebar/Timebar'
import { FOOTER_HEIGHT } from 'features/footer/Footer'
import useMapInstance, { useMapContext } from 'features/map/map-context.hooks'
import { Bbox } from 'types'
import { selectSidebarOpen } from 'features/app/app.selectors'
import { getEventLabel } from 'utils/analytics'
import { setDownloadGeometry } from 'features/download/download.slice'
import { setClickedEvent } from '../map.slice'
import { useMapFitBounds } from '../map-viewport.hooks'
import styles from './Popup.module.css'
import ContextLayersRow from './ContextLayersRow'
import { useHighlightArea } from './ContextLayers.hooks'

const TunaRfmoLinksById: Record<string, string> = {
  CCSBT: 'https://www.ccsbt.org/',
  ICCAT: 'https://www.iccat.int/en/',
  IATTC: 'http://www.iattc.org/',
  IOTC: 'http://www.iotc.org/',
  WCPFC: 'http://www.wcpfc.int/',
}

interface FeatureRowProps {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
  onReportClick?: (feature: TooltipEventFeature) => void
  onDownloadClick?: (feature: TooltipEventFeature) => void
}

function FeatureRow({
  feature,
  showFeaturesDetails = false,
  onReportClick,
  onDownloadClick,
}: FeatureRowProps) {
  const context = useMapContext()
  const isSidebarOpen = useSelector(selectSidebarOpen)
  const { dispatchQueryParams } = useLocationConnect()

  const handleReportClick = useCallback(
    (ev: React.MouseEvent) => {
      context.eventManager.once('click', (e: any) => e.stopPropagation(), ev.target)
      if (onReportClick) {
        onReportClick(feature)
      }
      if (!isSidebarOpen) {
        dispatchQueryParams({ sidebarOpen: true })
      }
    },
    [context.eventManager, dispatchQueryParams, feature, isSidebarOpen, onReportClick]
  )

  const handleDownloadClick = useCallback(
    (ev: React.MouseEvent<Element, MouseEvent>) => {
      context.eventManager.once('click', (e: any) => e.stopPropagation(), ev.target)
      if (onDownloadClick) {
        onDownloadClick(feature)
      }
    },
    [context.eventManager, feature, onDownloadClick]
  )

  if (!feature.value) return null

  const { generatorContextLayer } = feature
  const { gfw_id } = feature.properties
  const isGFWLayer =
    ['mpa', 'mpa-restricted', 'mpa-no-take'].includes(generatorContextLayer as string) ||
    generatorContextLayer === 'tuna-rfmo' ||
    generatorContextLayer === 'eez-areas' ||
    generatorContextLayer === 'wpp-nri' ||
    generatorContextLayer === 'high-seas'

  if (isGFWLayer) {
    let id = gfw_id
    let label = feature.value
    let linkHref = undefined
    // ContextLayerType.MPA but enums doesn't work in CRA for now
    if (['mpa', 'mpa-restricted', 'mpa-no-take'].includes(generatorContextLayer as string)) {
      const { wdpa_pid } = feature.properties
      label = `${feature.value} - ${feature.properties.desig}`
      id = `${label}-${gfw_id}`
      linkHref = wdpa_pid ? `https://www.protectedplanet.net/${wdpa_pid}` : undefined
    } else if (generatorContextLayer === 'tuna-rfmo') {
      id = `${feature.value}-${gfw_id}`
      linkHref = TunaRfmoLinksById[feature.value]
    } else if (generatorContextLayer === 'eez-areas') {
      const { mrgid } = feature.properties
      id = `${mrgid}-${gfw_id}`
      linkHref = `https://www.marineregions.org/eezdetails.php?mrgid=${mrgid}`
    } else if (generatorContextLayer === 'wpp-nri' || generatorContextLayer === 'high-seas') {
      id = `${feature.value}-${gfw_id}`
    }

    return (
      <ContextLayersRow
        id={id}
        label={label}
        linkHref={linkHref}
        showFeaturesDetails={showFeaturesDetails}
        handleDownloadClick={handleDownloadClick}
        handleReportClick={handleReportClick}
      />
    )
  }
  return <div key={`${feature.value || gfw_id}`}>{feature.value ?? feature.title}</div>
}

type ContextTooltipRowProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: ContextTooltipRowProps) {
  const dispatch = useDispatch()
  const fitMapBounds = useMapFitBounds()
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const { dispatchQueryParams } = useLocationConnect()

  const highlightArea = useHighlightArea()

  const onReportClick = useCallback(
    (feature: TooltipEventFeature) => {
      if (!feature.properties?.gfw_id) {
        console.warn('No gfw_id available in the feature to analyze', feature)
        return
      }
      const bounds = bbox(feature.geometry) as Bbox
      const areaId = feature.properties?.gfw_id
      const sourceId = feature.source
      batch(() => {
        dispatchQueryParams({ analysis: { areaId, sourceId } })
        dispatch(setClickedEvent(null))
      })
      highlightArea(areaId, sourceId)
      uaEvent({
        category: 'Analysis',
        action: `Open analysis panel`,
        label: getEventLabel([feature.title ?? '', feature.value ?? '']),
      })
      // Analysis already does it on page reload but to avoid waiting
      // this moves the map to the same position
      if (bounds) {
        const boundsParams = {
          padding: 10,
          mapWidth: window.innerWidth / 2,
          mapHeight: window.innerHeight - TIMEBAR_HEIGHT - FOOTER_HEIGHT,
        }
        fitMapBounds(bounds, boundsParams)
      }
    },
    [dispatch, dispatchQueryParams, fitMapBounds, highlightArea]
  )

  const onDownloadClick = useCallback(
    (feature: TooltipEventFeature) => {
      if (!feature.properties?.gfw_id) {
        console.warn('No gfw_id available in the feature to analyze', feature)
        return
      }
      batch(() => {
        dispatch(setDownloadGeometry(feature))
        dispatch(setClickedEvent(null))
      })
      cleanFeatureState('highlight')
    },
    [cleanFeatureState, dispatch]
  )

  const featuresByType = groupBy(features, 'layerId')

  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => (
        <div key={`${featureByType[0].title}-${index}`} className={styles.popupSection}>
          <span
            className={styles.popupSectionColor}
            style={{ backgroundColor: featureByType[0].color }}
          />
          <div className={styles.popupSectionContent}>
            {showFeaturesDetails && (
              <h3 className={styles.popupSectionTitle}>{featureByType[0].title}</h3>
            )}
            {featureByType.map((feature, index) => (
              <FeatureRow
                key={(feature?.id || feature.properties?.value) + index}
                feature={feature}
                showFeaturesDetails={showFeaturesDetails}
                onReportClick={onReportClick}
                onDownloadClick={onDownloadClick}
              />
            ))}
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default ContextTooltipSection
