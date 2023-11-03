import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Dataset, IdentityVessel } from '@globalfishingwatch/api-types'
import { selectVesselDataset } from 'features/vessel/vessel.selectors'
import { formatInfoField } from 'utils/info'
import VesselLink from 'features/vessel/VesselLink'
import { selectIsWorkspaceVesselLocation } from 'routes/routes.selectors'
import VesselPin, { VesselToResolve } from 'features/vessel/VesselPin'
import { getCurrentIdentityVessel } from 'features/vessel/vessel.utils'
import styles from './RelatedVessels.module.css'

const RelatedVessel = ({
  vessel,
  vesselToResolve,
  showTooltip = false,
}: {
  vessel?: IdentityVessel
  vesselToResolve?: VesselToResolve
  showTooltip?: boolean
}) => {
  const { t } = useTranslation()
  const vesselIdentity = vessel ? getCurrentIdentityVessel(vessel) : vesselToResolve
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const vesselDataset = useSelector(selectVesselDataset) as Dataset
  const nameLabel = formatInfoField(
    (vesselIdentity as any)?.shipname || (vesselIdentity as any)?.name || '',
    'shipname'
  )
  const flagLabel = formatInfoField(vesselIdentity?.flag || '', 'flag')
  const fullLabel = `${t('common.see', 'See')} ${nameLabel} (${flagLabel})`

  return (
    <Fragment>
      {isWorkspaceVesselLocation && (
        <VesselPin
          vessel={vessel}
          vesselToResolve={vesselToResolve}
          tooltip={t('vessel.addToWorkspace', 'Add vessel to view')}
        />
      )}
      <VesselLink
        className={styles.vessel}
        vesselId={vesselIdentity?.id}
        datasetId={vesselDataset?.id}
        tooltip={showTooltip ? fullLabel : ''}
      >
        {nameLabel}
      </VesselLink>{' '}
      <span className={styles.secondary}>({flagLabel})</span>
    </Fragment>
  )
}

export default RelatedVessel
