import { useTranslation } from 'react-i18next'
import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { InsightMOUListResponse } from '@globalfishingwatch/api-types'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import { formatInfoField } from 'utils/info'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import styles from './Insights.module.css'

const InsightMOUList = ({
  insightData,
  isLoading,
  error,
}: {
  insightData: InsightMOUListResponse
  isLoading: boolean
  error: ParsedAPIError
}) => {
  const { t } = useTranslation()
  const guestUser = useSelector(selectIsGuestUser)
  const { mouList } = insightData?.vesselIdentity || {}
  const getMOUListAppearance = () => {
    const messages = []
    if (mouList?.tokyo.valuesInThePeriod.length > 0) {
      messages.push(
        <p key="tokyoCount">
          {t('vessel.insights.MOUTokyoListsCount', {
            flags: mouList?.tokyo.valuesInThePeriod
              .map((v) => formatInfoField(v.reference, 'flag'))
              .join(', '),
            defaultValue: 'Flag present on the Tokyo MOU black or grey list ({{flags}})',
          })}
        </p>
      )
    } else if (mouList?.tokyo.totalTimesListed > 0) {
      messages.push(
        <p key="tokyoEmpty">
          {t(
            'vessel.insights.MOUTokyoListsPreviousAppearance',
            'Previously flew under another flag on the Tokyo MOU black or grey list'
          )}
        </p>
      )
    }
    if (mouList?.paris.valuesInThePeriod.length > 0) {
      messages.push(
        <p key="parisCount">
          {t('vessel.insights.MOUParisListsCount', {
            flags: mouList?.paris.valuesInThePeriod
              .map((v) => formatInfoField(v.reference, 'flag'))
              .join(', '),
            defaultValue: 'Flag present on the Paris MOU black or grey list ({{flags}})',
          })}
        </p>
      )
    } else if (mouList?.paris.totalTimesListed > 0) {
      messages.push(
        <p key="parisEmpty">
          {t(
            'vessel.insights.MOUParisListsPreviousAppearance',
            'Previously flew under another flag on the Paris MOU black or grey list'
          )}
        </p>
      )
    }
    if (
      mouList?.tokyo.valuesInThePeriod.length === 0 &&
      mouList?.paris.valuesInThePeriod.length > 0
    ) {
      messages.push(
        <p className={styles.secondary} key="allEmpty">
          {t(
            'vessel.insights.MOUListsEmpty',
            'Flying under a flag/flags not present on the Tokio or Paris MOU black or grey lists'
          )}
        </p>
      )
    }
    return messages
  }

  return (
    <div className={styles.insightContainer}>
      <label>{t('vessel.insights.MOULists', 'MOU Lists')}</label>
      {guestUser ? (
        <VesselIdentityFieldLogin />
      ) : isLoading ? (
        <Fragment>
          <div style={{ width: '60rem' }} className={styles.loadingPlaceholder} />
          <div style={{ width: '10rem' }} className={styles.loadingPlaceholder} />
        </Fragment>
      ) : error ? (
        <InsightError error={error} />
      ) : (
        <div>{getMOUListAppearance()}</div>
      )}
    </div>
  )
}

export default InsightMOUList
