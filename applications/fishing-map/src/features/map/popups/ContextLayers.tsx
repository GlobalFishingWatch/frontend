import React, { Fragment, useCallback } from 'react'
// import { ContextLayerType } from '@globalfishingwatch/layer-composer/dist/generators/types'
import groupBy from 'lodash/groupBy'
import { batch, useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import union from '@turf/union'
import { Feature, Polygon } from 'geojson'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { setReportGeometry } from 'features/report/report.slice'
import { useMapboxInstance } from '../map.context'
import { selectClickedEvent } from '../map.slice'
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
  index: number
}

function FeatureRow({
  feature,
  showFeaturesDetails = false,
  onReportClick,
  index = Date.now(),
}: FeatureRowProps) {
  const { t } = useTranslation()

  if (!feature.value) return null
  const { gfw_id } = feature.properties

  // ContextLayerType.MPA but enums doesn't work in CRA for now
  if (feature.contextLayer === 'mpa') {
    const { wdpa_pid } = feature.properties
    const label = `${feature.value} - ${feature.properties.desig}`
    return (
      <div className={styles.row} key={`${index}-${label}-${gfw_id}`}>
        <span className={styles.rowText}>{label}</span>
        {showFeaturesDetails && (
          <div className={styles.rowActions}>
            <IconButton
              icon="report"
              tooltip={t('common.report', 'Report')}
              onClick={() => onReportClick && onReportClick(feature)}
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
  if (feature.contextLayer === 'tuna-rfmo') {
    const link = TunaRfmoLinksById[feature.value]
    return (
      <div className={styles.row} key={`${index}-${feature.value}-${gfw_id}`}>
        <span className={styles.rowText}>{feature.value}</span>
        <div className={styles.rowActions}>
          <IconButton
            icon="report"
            tooltip={t('common.report', 'Report')}
            onClick={() => onReportClick && onReportClick(feature)}
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
  if (feature.contextLayer === 'eez-areas') {
    const { mrgid } = feature.properties
    return (
      <div className={styles.row} key={`${index}-${mrgid}-${gfw_id}`}>
        <span className={styles.rowText}>{feature.value}</span>
        {showFeaturesDetails && (
          <div className={styles.rowActions}>
            <IconButton
              icon="report"
              tooltip={t('common.report', 'Report')}
              onClick={() => onReportClick && onReportClick(feature)}
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
  return <div key={`${index}-${feature.value || gfw_id}`}>{feature.value}</div>
}

type ContextTooltipRowProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: ContextTooltipRowProps) {
  const mapInstance = useMapboxInstance()
  const clickedEvent = useSelector(selectClickedEvent)
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useDispatch()

  const onReportClick = useCallback(
    (feature: TooltipEventFeature) => {
      if (!mapInstance || !clickedEvent) {
        console.warn(`No map ${mapInstance ? 'clicked event' : 'map instance'} instance found`)
        return
      }
      if (!feature.properties?.gfw_id) {
        console.warn('No gfw_id available in the feature to analyze', feature)
        return
      }

      // TODO: validate if queryRenderedFeatures returns the entire geometry even being out of the viewport
      // const intersectionOptions = { layers: [feature.layerId] }
      // const contextAreaFeatures = mapInstance.queryRenderedFeatures(
      //   clickedEvent.point as any,
      //   intersectionOptions
      // )
      const contextAreaFeatures = mapInstance.querySourceFeatures(feature.source, {
        sourceLayer: feature.sourceLayer,
        filter: ['==', 'gfw_id', feature.properties?.gfw_id],
      })
      const contextAreaGeometry = contextAreaFeatures.reduce((acc, { geometry, properties }) => {
        const featureGeometry: Feature<Polygon> = {
          type: 'Feature',
          geometry: geometry as Polygon,
          properties,
        }
        if (!acc?.type) return featureGeometry
        return union(acc, featureGeometry, { properties }) as Feature<Polygon>
      }, {} as Feature<Polygon>)

      batch(() => {
        dispatch(
          setReportGeometry({
            geometry: contextAreaGeometry,
            name: feature.properties.value,
          })
        )
        dispatchQueryParams({ report: 'fishing-activity' })
      })
    },
    [mapInstance, clickedEvent, dispatchQueryParams, dispatch]
  )
  const featuresByType = groupBy(features, 'layer')
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
                index={index}
                feature={feature}
                showFeaturesDetails={showFeaturesDetails}
                onReportClick={onReportClick}
              />
            ))}
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default ContextTooltipSection
