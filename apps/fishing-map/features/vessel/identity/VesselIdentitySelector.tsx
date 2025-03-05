import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { DateTime } from 'luxon'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import type { VesselDataIdentity } from 'features/vessel/vessel.slice'
import {
  getVesselIdentities,
  getVesselIdentity,
  getVesselIdentityId,
} from 'features/vessel/vessel.utils'
import { useLocationConnect } from 'routes/routes.hook'

import styles from './VesselIdentitySelector.module.css'

function isRegistryInTimerange(registry: VesselDataIdentity, start: string, end: string) {
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

  const identities = getVesselIdentities(vessel, { identitySource })
  const currentIdentity = getVesselIdentity(vessel, { identitySource, identityId })
  const identityIndex = vessel?.identities
    ?.filter((i) => i.identitySource === identitySource)
    .findIndex((i) => i.id === currentIdentity.id)

  const setIdentityId = (identityId: string) => {
    if (identitySource === VesselIdentitySourceEnum.SelfReported) {
      dispatchQueryParams({ vesselSelfReportedId: identityId })
    } else {
      dispatchQueryParams({ vesselRegistryId: identityId })
    }
    const start = formatI18nDate(currentIdentity.transmissionDateFrom)
    const end = formatI18nDate(currentIdentity.transmissionDateTo)
    trackEvent({
      category: TrackCategory.VesselProfile,
      action: `change_timeperiod_${identitySource}_tab`,
      label: `${identityIndex + 1} | ${start} - ${end}`,
    })
  }

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
          const identityId = getVesselIdentityId(identity)
          return (
            <Tooltip
              key={identityId}
              content={t('vessel.selectIdentity', 'See the identity for this dates')}
            >
              <li
                className={cx(styles.icon, {
                  [styles.selected]: identityId === getVesselIdentityId(currentIdentity),
                })}
                onClick={() => setIdentityId(identityId)}
              >
                <span className={styles.dates}>
                  {start} - {end}
                </span>
              </li>
            </Tooltip>
          )
        })}
      </ul>
    </div>
  )
}

export default VesselIdentitySelector
