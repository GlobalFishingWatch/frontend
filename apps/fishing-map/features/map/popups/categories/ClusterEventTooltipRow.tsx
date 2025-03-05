import { useTranslation } from 'react-i18next'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { Icon } from '@globalfishingwatch/ui-components'

import { getDatasetLabel } from 'features/datasets/datasets.utils'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { getEventDescriptionComponent } from 'utils/events'
import { formatInfoField } from 'utils/info'

import type { ExtendedFeatureSingleEvent, SliceExtendedClusterPickingObject } from '../../map.slice'

import styles from '../Popup.module.css'

type ClusterEventTooltipRowProps = {
  feature: SliceExtendedClusterPickingObject<ExtendedFeatureSingleEvent>
  showFeaturesDetails: boolean
  error?: string
}

function ClusterEventTooltipRow({ feature, showFeaturesDetails }: ClusterEventTooltipRowProps) {
  const { t } = useTranslation()
  const { datasetId, event, color } = feature
  const title = getDatasetLabel({ id: datasetId! })
  const infoDataset = event?.dataset.relatedDatasets?.find((d) => d.type === DatasetTypes.Vessels)

  return (
    <div className={styles.popupSection}>
      <Icon icon="clusters" className={styles.layerIcon} style={{ color }} />
      <div className={styles.popupSectionContent}>
        {<h3 className={styles.popupSectionTitle}>{title}</h3>}
        {showFeaturesDetails && (
          <div className={styles.row}>
            {event?.vessel ? (
              <div className={styles.rowText}>
                <VesselPin
                  vesselToResolve={{ ...event.vessel, datasetId: infoDataset?.id as string }}
                  size="small"
                  className={styles.inlineBtn}
                />
                <VesselLink
                  vesselId={event.vessel.id}
                  datasetId={infoDataset?.id}
                  className={styles.marginRight}
                >
                  {formatInfoField(event.vessel.name, 'shipname')}
                </VesselLink>
                ({formatInfoField(event.vessel.flag, 'flag')}){' '}
                <span className={styles.secondary} style={{ display: 'inline' }}>
                  {getEventDescriptionComponent(event)?.description}
                </span>
              </div>
            ) : (
              t('event.noData', 'No data available')
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClusterEventTooltipRow
