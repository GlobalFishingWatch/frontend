import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { InsightIdentityResponse } from '@globalfishingwatch/api-types'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import styles from './Insights.module.css'

const InsightIUU = ({
  insightData,
  isLoading,
}: {
  insightData: InsightIdentityResponse
  isLoading: boolean
}) => {
  const { t } = useTranslation()
  const guestUser = useSelector(selectIsGuestUser)
  const { iuuVesselList } = insightData?.vesselIdentity || {}
  return (
    <div className={styles.insightContainer}>
      <label>{t('vessel.insights.IUU', 'RFMO IUU Vessel List')}</label>
      {guestUser ? (
        <VesselIdentityFieldLogin />
      ) : isLoading || !insightData ? (
        <div style={{ width: '50rem' }} className={styles.loadingPlaceholder} />
      ) : (
        <div>
          <p>
            {iuuVesselList.valuesInThePeriod.length !== 0 ? (
              <span>
                {t('vessel.insights.IUUBlackListsCount', {
                  // value: iuuBlacklist.valuesInThePeriod.join(', '),
                  // defaultValue: 'The vessel is present on an RFMO IUU blacklist ({{value}})',
                  defaultValue: 'The vessel is present on an RFMO IUU vessel list',
                })}
              </span>
            ) : (
              <span className={styles.secondary}>
                {t(
                  'vessel.insights.IUUBlackListsEmpty',
                  'The vessel is not present on an RFMO IUU vessel list'
                )}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default InsightIUU
