import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Dataset, DataviewInstance } from '@globalfishingwatch/api-types'
import { IconButton, Tooltip } from '@globalfishingwatch/ui-components'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselDataset } from 'features/vessel/vessel.selectors'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getVesselDataviewInstance, getVesselInWorkspace } from 'features/dataviews/dataviews.utils'
import { formatInfoField } from 'utils/info'
import VesselLink from 'features/vessel/VesselLink'
import { VesselLastIdentity } from 'features/search/search.slice'
import { selectIsWorkspaceVesselLocation } from 'routes/routes.selectors'
import styles from './RelatedVessels.module.css'

const RelatedVessel = ({
  vessel,
  showTooltip = false,
}: {
  vessel: VesselLastIdentity
  showTooltip?: boolean
}) => {
  const { t } = useTranslation()
  const { track, info, events } = useSelector(selectVesselInfoData)
  const { dispatchQueryParams } = useLocationConnect()
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const vesselDataset = useSelector(selectVesselDataset) as Dataset
  const vesselsInWorkspace = useSelector(selectActiveTrackDataviews)
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const vesselInWorkspace = getVesselInWorkspace(vesselsInWorkspace, vessel.id as string)
  const hasDatasets = track && info
  const pinTrackDisabled = !hasDatasets
  const nameLabel = formatInfoField(vessel.shipname || (vessel as any).name || '', 'shipname')
  const flagLabel = formatInfoField(vessel.flag || '', 'flag')
  const fullLabel = `${nameLabel} (${flagLabel})`

  const onVesselClick = async () => {
    if (vesselInWorkspace) {
      deleteDataviewInstance(vesselInWorkspace.id)
      return
    }
    const vesselDataviewInstance: DataviewInstance = getVesselDataviewInstance(
      { id: vessel.id },
      { info, track, events }
    )
    dispatchQueryParams({ viewOnlyVessel: false })
    upsertDataviewInstance(vesselDataviewInstance)
  }

  return (
    <Fragment>
      {isWorkspaceVesselLocation && (
        <IconButton
          className={styles.pin}
          icon={vesselInWorkspace ? 'pin-filled' : 'pin'}
          style={{
            color: vesselInWorkspace ? vesselInWorkspace.config?.color : '',
          }}
          disabled={pinTrackDisabled}
          tooltip={
            pinTrackDisabled
              ? ''
              : vesselInWorkspace
              ? t('search.removeVessel', 'Remove vessel')
              : t('search.seeVessel', 'See vessel')
          }
          onClick={onVesselClick}
          size="small"
        />
      )}
      <Tooltip content={showTooltip && fullLabel.length > 30 && fullLabel}>
        <span>
          <VesselLink className={styles.vessel} vesselId={vessel.id} datasetId={vesselDataset?.id}>
            {nameLabel}
          </VesselLink>{' '}
          <span className={styles.secondary}>({flagLabel})</span>
        </span>
      </Tooltip>
    </Fragment>
  )
}

export default RelatedVessel
