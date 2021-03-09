import React, { Fragment, useCallback } from 'react'
// import { ContextLayerType } from '@globalfishingwatch/layer-composer/dist/generators/types'
import groupBy from 'lodash/groupBy'
import { batch, useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { selectHasAnalysisLayersVisible } from 'features/workspace/workspace.selectors'
import { setClickedEvent } from '../map.slice'
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
  reportEnabled?: boolean
}

function FeatureRow({
  feature,
  showFeaturesDetails = false,
  onReportClick,
  reportEnabled = true,
}: FeatureRowProps) {
  const { t } = useTranslation()

  if (!feature.value) return null
  const { gfw_id } = feature.properties

  // ContextLayerType.MPA but enums doesn't work in CRA for now
  if (['mpa', 'mpa-restricted', 'mpa-no-take'].includes(feature.contextLayer as string)) {
    const { wdpa_pid } = feature.properties
    const label = `${feature.value} - ${feature.properties.desig}`
    return (
      <div className={styles.row} key={`${label}-${gfw_id}`}>
        <span className={styles.rowText}>{label}</span>
        {showFeaturesDetails && (
          <div className={styles.rowActions}>
            <IconButton
              icon="report"
              disabled={!reportEnabled}
              tooltip={
                reportEnabled
                  ? t('common.report', 'Report')
                  : t('analysis.noActivityLayers', 'No activity layers active')
              }
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
      <div className={styles.row} key={`${feature.value}-${gfw_id}`}>
        <span className={styles.rowText}>{feature.value}</span>
        <div className={styles.rowActions}>
          <IconButton
            icon="report"
            disabled={!reportEnabled}
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
      <div className={styles.row} key={`${mrgid}-${gfw_id}`}>
        <span className={styles.rowText}>{feature.value}</span>
        {showFeaturesDetails && (
          <div className={styles.rowActions}>
            <IconButton
              icon="report"
              disabled={!reportEnabled}
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
  if (feature.contextLayer === 'wpp-nri') {
    return (
      <div className={styles.row} key={`${feature.value}-${gfw_id}`}>
        <span className={styles.rowText}>{feature.value}</span>
        {showFeaturesDetails && (
          <div className={styles.rowActions}>
            <IconButton
              icon="report"
              disabled={!reportEnabled}
              tooltip={t('common.report', 'Report')}
              onClick={() => onReportClick && onReportClick(feature)}
              size="small"
            />
          </div>
        )}
      </div>
    )
  }
  return <div key={`${feature.value || gfw_id}`}>{feature.value}</div>
}

type ContextTooltipRowProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: ContextTooltipRowProps) {
  const { dispatchQueryParams } = useLocationConnect()
  const hasAnalysisLayers = useSelector(selectHasAnalysisLayersVisible)
  const dispatch = useDispatch()

  const onReportClick = useCallback(
    (feature: TooltipEventFeature) => {
      if (!feature.properties?.gfw_id) {
        console.warn('No gfw_id available in the feature to analyze', feature)
        return
      }

      batch(() => {
        dispatchQueryParams({
          analysis: {
            areaId: feature.properties?.gfw_id,
            sourceId: feature.source,
          },
        })
        dispatch(setClickedEvent(null))
      })
    },
    [dispatch, dispatchQueryParams]
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
                key={feature.properties?.value + index}
                feature={feature}
                showFeaturesDetails={showFeaturesDetails}
                onReportClick={onReportClick}
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
