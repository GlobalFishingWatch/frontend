import React, { Fragment, useCallback } from 'react'
import { groupBy } from 'lodash'
import { batch, useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import bbox from '@turf/bbox'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { useFeatureState } from '@globalfishingwatch/react-hooks/dist/use-map-interaction'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer/dist/generators'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { selectHasAnalysisLayersVisible } from 'features/dataviews/dataviews.selectors'
import { TIMEBAR_HEIGHT } from 'features/timebar/Timebar'
import { FOOTER_HEIGHT } from 'features/footer/Footer'
import useMapInstance, { useMapContext } from 'features/map/map-context.hooks'
import { Bbox } from 'types'
import { selectSidebarOpen } from 'features/app/app.selectors'
import { getEventLabel } from 'utils/analytics'
import { setDownloadActivityGeometry } from 'features/download/downloadActivity.slice'
import { isGFWUser } from 'features/user/user.slice'
import { setClickedEvent } from '../map.slice'
import { useMapFitBounds } from '../map-viewport.hooks'
import styles from './Popup.module.css'

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
  reportEnabled?: boolean
}

function FeatureRow({
  feature,
  showFeaturesDetails = false,
  onReportClick,
  onDownloadClick,
  reportEnabled = true,
}: FeatureRowProps) {
  const { t } = useTranslation()
  const context = useMapContext()
  const isSidebarOpen = useSelector(selectSidebarOpen)
  const { dispatchQueryParams } = useLocationConnect()
  const gfwUser = useSelector(isGFWUser)

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
  const { gfw_id } = feature.properties

  // ContextLayerType.MPA but enums doesn't work in CRA for now
  if (['mpa', 'mpa-restricted', 'mpa-no-take'].includes(feature.generatorContextLayer as string)) {
    const { wdpa_pid } = feature.properties
    const label = `${feature.value} - ${feature.properties.desig}`
    return (
      <div className={styles.row} key={`${label}-${gfw_id}`}>
        <span className={styles.rowText}>{label}</span>
        {showFeaturesDetails && (
          <div className={styles.rowActions}>
            {gfwUser && (
              <IconButton
                icon="download"
                disabled={!reportEnabled}
                tooltip={t(
                  'download.activityAction',
                  'Download visible activity layers for this area'
                )}
                onClick={handleDownloadClick}
                size="small"
              />
            )}
            <IconButton
              icon="report"
              disabled={!reportEnabled}
              tooltip={
                reportEnabled
                  ? t('common.analysis', 'Create an analysis for this area')
                  : t(
                      'common.analysisNotAvailable',
                      'Toggle an activity or environmenet layer on to analyse in in this area'
                    )
              }
              onClick={handleReportClick}
              size="small"
            />
            {wdpa_pid && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.protectedplanet.net/${wdpa_pid}`}
              >
                <IconButton icon="info" tooltip="See more" size="small" />
              </a>
            )}
          </div>
        )}
      </div>
    )
  }
  if (feature.generatorContextLayer === 'tuna-rfmo') {
    const link = TunaRfmoLinksById[feature.value]
    return (
      <div className={styles.row} key={`${feature.value}-${gfw_id}`}>
        <span className={styles.rowText}>{feature.value}</span>
        <div className={styles.rowActions}>
          {gfwUser && (
            <IconButton
              icon="download"
              disabled={!reportEnabled}
              tooltip={t(
                'download.activityAction',
                'Download visible activity layers for this area'
              )}
              onClick={handleDownloadClick}
              size="small"
            />
          )}
          <IconButton
            icon="report"
            disabled={!reportEnabled}
            tooltip={
              reportEnabled
                ? t('common.analysis', 'Create an analysis for this area')
                : t(
                    'common.analysisNotAvailable',
                    'Toggle an activity or environmenet layer on to analyse in in this area'
                  )
            }
            onClick={handleReportClick}
            size="small"
          />
          {showFeaturesDetails && link && (
            <a target="_blank" rel="noopener noreferrer" href={link}>
              <IconButton icon="info" tooltip="See more" size="small" />
            </a>
          )}
        </div>
      </div>
    )
  }
  if (feature.generatorContextLayer === 'eez-areas') {
    const { mrgid } = feature.properties
    return (
      <div className={styles.row} key={`${mrgid}-${gfw_id}`}>
        <span className={styles.rowText}>{feature.value}</span>
        {showFeaturesDetails && (
          <div className={styles.rowActions}>
            {gfwUser && (
              <IconButton
                icon="download"
                disabled={!reportEnabled}
                tooltip={t(
                  'download.activityAction',
                  'Download visible activity layers for this area'
                )}
                onClick={handleDownloadClick}
                size="small"
              />
            )}
            <IconButton
              icon="report"
              disabled={!reportEnabled}
              tooltip={
                reportEnabled
                  ? t('common.analysis', 'Create an analysis for this area')
                  : t(
                      'common.analysisNotAvailable',
                      'Toggle an activity or environmenet layer on to analyse in in this area'
                    )
              }
              onClick={handleReportClick}
              size="small"
            />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.marineregions.org/eezdetails.php?mrgid=${mrgid}`}
            >
              <IconButton icon="info" tooltip="See more" size="small" />
            </a>
          </div>
        )}
      </div>
    )
  }
  if (
    feature.generatorContextLayer === 'wpp-nri' ||
    feature.generatorContextLayer === 'high-seas'
  ) {
    return (
      <div className={styles.row} key={`${feature.value}-${gfw_id}`}>
        <span className={styles.rowText}>{feature.value}</span>
        {showFeaturesDetails && (
          <div className={styles.rowActions}>
            {gfwUser && (
              <IconButton
                icon="download"
                disabled={!reportEnabled}
                tooltip={t(
                  'download.activityAction',
                  'Download visible activity layers for this area'
                )}
                onClick={handleDownloadClick}
                size="small"
              />
            )}
            <IconButton
              icon="report"
              disabled={!reportEnabled}
              tooltip={
                reportEnabled
                  ? t('common.analysis', 'Create an analysis for this area')
                  : t(
                      'common.analysisNotAvailable',
                      'Toggle an activity or environmenet layer on to analyse it in this area'
                    )
              }
              onClick={handleReportClick}
              size="small"
            />
          </div>
        )}
      </div>
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
  const { updateFeatureState, cleanFeatureState } = useFeatureState(useMapInstance())
  const { dispatchQueryParams } = useLocationConnect()
  const hasAnalysisLayers = useSelector(selectHasAnalysisLayersVisible)

  const highlightArea = useCallback(
    (source: string, id: string) => {
      cleanFeatureState('highlight')
      const featureState = { source, sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER, id }
      updateFeatureState([featureState], 'highlight')
    },
    [cleanFeatureState, updateFeatureState]
  )

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
        dispatch(setDownloadActivityGeometry(feature))
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
                reportEnabled={hasAnalysisLayers}
              />
            ))}
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default ContextTooltipSection
