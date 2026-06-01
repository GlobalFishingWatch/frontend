import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { isRegistryInTimerange } from 'features/vessel/identity/vessel-identity.utils'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import {
  getVesselIdentities,
  getVesselIdentity,
  getVesselIdentityId,
} from 'features/vessel/vessel.utils'
import { useReplaceQueryParams } from 'router/routes.hook'

import styles from './VesselIdentitySelector.module.css'

const VesselIdentitySelector = () => {
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  const vessel = useSelector(selectVesselInfoData)
  const identitySource = useSelector(selectVesselIdentitySource)
  const identityId = useSelector(selectVesselIdentityId)
  const { start, end } = useTimerangeConnect()

  const identities = getVesselIdentities(vessel, { identitySource })
  const currentIdentity = getVesselIdentity(vessel, { identitySource, identityId })
  const identityIndex = vessel?.identities
    ?.filter((i) => i.identitySource === identitySource)
    .findIndex((i) => i.id === currentIdentity.id)

  const setIdentityId = (identityId: string, from: string, to: string) => {
    if (identitySource === VesselIdentitySourceEnum.SelfReported) {
      replaceQueryParams({ vesselSelfReportedId: identityId })
    } else {
      replaceQueryParams({ vesselRegistryId: identityId })
    }

    const start = formatI18nDate(from)
    const end = formatI18nDate(to)
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
        <p className={styles.error}>{t((t) => t.vessel.identityDatesOutOfRange)}</p>
      )}
      <ul className={cx(styles.selector, 'print-hidden')}>
        {identities.map((identity) => {
          const start = formatI18nDate(identity.transmissionDateFrom)
          const end = formatI18nDate(identity.transmissionDateTo)
          const identityId = getVesselIdentityId(identity)
          return (
            <Tooltip key={identityId} content={t((t) => t.vessel.selectIdentity)}>
              <li>
                <button
                  className={cx(styles.icon, {
                    [styles.selected]: identityId === getVesselIdentityId(currentIdentity),
                  })}
                  onClick={() =>
                    setIdentityId(
                      identityId,
                      identity.transmissionDateFrom,
                      identity.transmissionDateTo
                    )
                  }
                >
                  <span className={styles.dates}>
                    {start} - {end}
                  </span>
                </button>
              </li>
            </Tooltip>
          )
        })}
      </ul>
    </div>
  )
}

export default VesselIdentitySelector
