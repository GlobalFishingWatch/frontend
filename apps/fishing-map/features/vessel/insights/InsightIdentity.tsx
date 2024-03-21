import { useTranslation } from 'react-i18next'
import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { InsightIdentityResponse } from '@globalfishingwatch/api-types'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import { formatInfoField } from 'utils/info'
import styles from './Insights.module.css'

const InsightIdentity = ({
  insightData,
  isLoading,
}: {
  insightData: InsightIdentityResponse
  isLoading: boolean
}) => {
  const { t } = useTranslation()
  const guestUser = useSelector(selectIsGuestUser)
  const { mouList, flagsChanges } = insightData?.vesselIdentity || {}
  const getMOUListAppearance = () => {
    const messages = []
    if (mouList.tokyo.valuesInThePeriod.length > 0) {
      messages.push(
        <p key="tokyoCount">
          {t('vessel.insights.identityMOUTokyoListsCount', {
            flags: mouList.tokyo.valuesInThePeriod
              .map((v) => formatInfoField(v.reference, 'flag'))
              .join(', '),
            defaultValue: 'Flag present on the Tokyo MOU black or grey list ({{flags}})',
          })}
        </p>
      )
    } else if (mouList.tokyo.totalTimesListed > 0) {
      messages.push(
        <p key="tokyoEmpty">
          {t(
            'vessel.insights.identityMOUTokyoListsPreviousAppearance',
            'Previously flew under another flag on the Tokyo MOU black or grey list'
          )}
        </p>
      )
    }
    if (mouList.paris.valuesInThePeriod.length > 0) {
      messages.push(
        <p key="parisCount">
          {t('vessel.insights.identityMOUParisListsCount', {
            flags: mouList.paris.valuesInThePeriod
              .map((v) => formatInfoField(v.reference, 'flag'))
              .join(', '),
            defaultValue: 'Flag present on the Paris MOU black or grey list ({{flags}})',
          })}
        </p>
      )
    } else if (mouList.paris.totalTimesListed > 0) {
      messages.push(
        <p key="parisEmpty">
          {t(
            'vessel.insights.identityMOUParisListsPreviousAppearance',
            'Previously flew under another flag on the Paris MOU black or grey list'
          )}
        </p>
      )
    }
    if (
      mouList.tokyo.valuesInThePeriod.length === 0 &&
      mouList.paris.valuesInThePeriod.length > 0
    ) {
      messages.push(
        <p className={styles.secondary} key="allEmpty">
          {t(
            'vessel.insights.identityMOUListsEmpty',
            'Flying under a flag/flags not present on the Tokio or Paris MOU black or grey lists'
          )}
        </p>
      )
    }
    return messages
  }

  return (
    <div className={styles.insightContainer}>
      <label>{t('vessel.insights.identity', 'Identity')}</label>
      {guestUser ? (
        <VesselIdentityFieldLogin />
      ) : isLoading || !insightData ? (
        <Fragment>
          <div style={{ width: '60rem' }} className={styles.loadingPlaceholder} />
          <div style={{ width: '10rem' }} className={styles.loadingPlaceholder} />
        </Fragment>
      ) : (
        <div>
          {getMOUListAppearance()}

          <p>
            {flagsChanges?.valuesInThePeriod.length !== 0 ? (
              <span>
                {t('vessel.insights.identityFlagChangesEmpty', {
                  count: flagsChanges.valuesInThePeriod.length,
                  defaultValue: '{{count}} flag changes',
                })}{' '}
                ({flagsChanges.valuesInThePeriod.map((v) => formatInfoField(v.value, 'flag'))})
              </span>
            ) : (
              <span className={styles.secondary}>
                {t('vessel.insights.identityFlagChangesEmpty', 'No flag changes')}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default InsightIdentity
