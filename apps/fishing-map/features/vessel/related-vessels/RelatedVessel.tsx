import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Dataset, IdentityVessel } from '@globalfishingwatch/api-types'
import { selectVesselDataset } from 'features/vessel/selectors/vessel.resources.selectors'
import { formatInfoField } from 'utils/info'
import VesselLink from 'features/vessel/VesselLink'
import { selectIsWorkspaceVesselLocation } from 'routes/routes.selectors'
import VesselPin, { VesselToResolve } from 'features/vessel/VesselPin'
import { getCurrentIdentityVessel } from 'features/vessel/vessel.utils'
import styles from './RelatedVessels.module.css'

const RelatedVessel = ({
  vessel,
  vesselToResolve,
}: {
  vessel?: IdentityVessel
  vesselToResolve?: VesselToResolve
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
  const fullLabel = `${nameLabel} (${flagLabel})`
  const lengthComparison = isWorkspaceVesselLocation ? 25 : 35
  const tooltip =
    fullLabel?.length > lengthComparison
      ? [fullLabel, <br />, t('vessel.clickToSeeMore', 'Click to see more information')]
      : ''

  return (
    <Fragment>
      {isWorkspaceVesselLocation && <VesselPin vessel={vessel} vesselToResolve={vesselToResolve} />}
      <VesselLink
        className={styles.vessel}
        vesselId={vesselIdentity?.id}
        datasetId={vesselDataset?.id}
        tooltip={tooltip}
        fitBounds
      >
        {nameLabel}
      </VesselLink>{' '}
      <span className={styles.secondary}>({flagLabel})</span>
    </Fragment>
  )
}

export default RelatedVessel
