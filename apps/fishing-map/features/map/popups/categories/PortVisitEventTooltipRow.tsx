import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import { Button, Icon } from '@globalfishingwatch/ui-components'

import { getDatasetLabel } from 'features/datasets/datasets.utils'
import PortsReportLink from 'features/reports/ports/PortsReportLink'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { selectIsPortReportLocation } from 'routes/routes.selectors'

import type {
  ExtendedFeatureByVesselEvent,
  SliceExtendedClusterPickingObject,
} from '../../map.slice'

import VesselsTable from './VesselsTable'

import styles from '../Popup.module.css'

type PortVisitLayerProps = {
  feature: SliceExtendedClusterPickingObject<ExtendedFeatureByVesselEvent>
  showFeaturesDetails: boolean
  error?: string
}

function PortVisitEventTooltipRow({ feature, showFeaturesDetails, error }: PortVisitLayerProps) {
  const { t } = useTranslation()
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const { datasetId, event, color } = feature
  const title = getDatasetLabel({ id: datasetId! })
  const isGFWUser = useSelector(selectIsGFWUser)

  return (
    <div className={styles.popupSection}>
      <Icon icon="clusters" className={styles.layerIcon} style={{ color }} />
      <div className={styles.popupSectionContent}>
        {<h3 className={styles.popupSectionTitle}>{title}</h3>}
        {error && <p className={styles.error}>{error}</p>}
        {showFeaturesDetails && (
          <VesselsTable
            feature={
              {
                vessels: event?.vessels,
                category: DataviewCategory.Events,
              } as any
            }
            vesselProperty="events"
          />
        )}
        {isGFWUser && event?.port && !isPortReportLocation && (
          <PortsReportLink port={event.port}>
            <Button className={styles.portCTA}>
              {t('portsReport.seePortReport', 'See all entry events to this port')} (
              {event.port.name})
            </Button>
          </PortsReportLink>
        )}
      </div>
    </div>
  )
}

export default PortVisitEventTooltipRow
