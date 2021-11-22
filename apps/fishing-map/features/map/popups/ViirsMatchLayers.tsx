import React, { Fragment } from 'react'
import { groupBy } from 'lodash'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@globalfishingwatch/ui-components'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import I18nNumber from 'features/i18n/i18nNumber'
import { TooltipEventFeature, useClickedEventConnect } from 'features/map/map.hooks'
import { getVesselLabel } from 'utils/info'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.selectors'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { getEventLabel } from 'utils/analytics'
import { ExtendedFeatureVesselDatasets, MAX_TOOLTIP_LIST } from '../map.slice'
import styles from './Popup.module.css'

type ViirsMatchTooltipRowProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}
function ViirsMatchTooltipRow({ feature, showFeaturesDetails }: ViirsMatchTooltipRowProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { viirsInteractionStatus } = useClickedEventConnect()
  const viirsGroupedByVessel = groupBy(feature.viirs, 'vessel.id')
  const vessels = Object.entries(viirsGroupedByVessel)
    .sort(([id, a], [id2, b]) => b.length - a.length)
    .slice(0, MAX_TOOLTIP_LIST)

  const onVesselClick = (vessel: ExtendedFeatureVesselDatasets) => {
    const vesselEventsDatasets = getRelatedDatasetsByType(vessel.dataset, DatasetTypes.Events)
    const eventsDatasetsId =
      vesselEventsDatasets && vesselEventsDatasets?.length
        ? vesselEventsDatasets.map((d) => d.id)
        : []

    const vesselDataviewInstance = getVesselDataviewInstance(vessel, {
      trackDatasetId: vessel.trackDataset?.id,
      infoDatasetId: vessel.infoDataset?.id,
      ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
    })

    upsertDataviewInstance(vesselDataviewInstance)

    uaEvent({
      category: 'Tracks',
      action: 'Click in vessel from grid cell panel',
      label: getEventLabel([vessel.dataset.id, vessel.id]),
    })
  }

  return (
    <div className={styles.popupSection}>
      <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
        <div className={styles.row}>
          <span className={styles.rowText}>
            <I18nNumber number={feature.value} />{' '}
            {t([`common.${feature.temporalgrid?.unit}` as any, 'common.detection'], 'detections', {
              count: parseInt(feature.value), // neded to select the plural automatically
            })}
          </span>
        </div>
        {viirsInteractionStatus === AsyncReducerStatus.Loading && (
          <div className={styles.loading}>
            <Spinner size="small" />
          </div>
        )}
        {showFeaturesDetails && viirsInteractionStatus === AsyncReducerStatus.Finished && vessels && (
          <Fragment>
            <table className={styles.viirsTable}>
              <thead>
                <tr>
                  <th>{t('common.vessel', 'Vessel')}</th>
                  <th>
                    {t(
                      [`common.${feature.temporalgrid?.unit}` as any, 'common.detection'],
                      'detections',
                      {
                        count: parseInt(feature.value), // neded to select the plural automatically
                      }
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {vessels.map(([vesselId, detections]) => {
                  const vessel = detections[0].vessel
                  const vesselLabel = getVesselLabel(vessel, true)
                  return (
                    <tr key={vesselId}>
                      <td>
                        <button
                          key={vessel.id}
                          className={styles.vesselRow}
                          onClick={() => onVesselClick(vessel)}
                        >
                          <span className={styles.vesselName}>{vesselLabel}</span>
                        </button>
                      </td>
                      <td>{<I18nNumber number={detections.length} />}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default ViirsMatchTooltipRow
