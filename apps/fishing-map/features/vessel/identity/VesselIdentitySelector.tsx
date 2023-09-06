import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { formatI18nDate } from 'features/i18n/i18nDate'
import {
  getVesselIdentities,
  getVesselIdentity,
  getVesselIdentyId,
} from 'features/vessel/vessel.utils'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import styles from './VesselIdentitySelector.module.css'

function isRegistryInTimerange(registry, start, end) {
  const registryStart = DateTime.fromISO(registry.transmissionDateFrom).toMillis()
  const registryEnd = DateTime.fromISO(registry.transmissionDateTo).toMillis()
  const timerangeStart = DateTime.fromISO(start).toMillis()
  const timerangeEnd = DateTime.fromISO(end).toMillis()
  return Math.max(registryStart, timerangeStart) < Math.min(registryEnd, timerangeEnd)
}

const VesselIdentitySelector = () => {
  const { t } = useTranslation()
  const vessel = useSelector(selectVesselInfoData)
  const identitySource = useSelector(selectVesselIdentitySource)
  const identityId = useSelector(selectVesselIdentityId)
  const { dispatchQueryParams } = useLocationConnect()
  const { start, end } = useTimerangeConnect()

  const setIdentityId = (vesselIdentityId: string) => {
    dispatchQueryParams({ vesselIdentityId })
  }

  const identities = getVesselIdentities(vessel, { identitySource })
  const currentIdentity = getVesselIdentity(vessel, { identitySource, identityId })

  if (!identities?.length || identities?.length <= 1) return null

  const isIdentityInTimerange = isRegistryInTimerange(currentIdentity, start, end)
  return (
    <div>
      {!isIdentityInTimerange && (
        <p className={styles.error}>
          {t(
            'vessel.identityDatesOutOfRange',
            'The dates of this identity don’t overlap with your current time range'
          )}
        </p>
      )}
      <ul className={cx(styles.selector, 'print-hidden')}>
        {identities.map((identity) => {
          const start = formatI18nDate(identity.transmissionDateFrom)
          const end = formatI18nDate(identity.transmissionDateTo)
          const identityId = getVesselIdentyId(identity)
          return (
            <li
              key={identityId}
              className={cx(styles.icon, {
                [styles.selected]: identityId === getVesselIdentyId(currentIdentity),
              })}
              onClick={() => setIdentityId(identityId)}
            >
              <span className={styles.dates}>
                {start} - {end}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default VesselIdentitySelector
