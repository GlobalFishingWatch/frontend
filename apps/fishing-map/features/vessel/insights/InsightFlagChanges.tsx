import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import type { InsightResponse } from '@globalfishingwatch/api-types'

import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import { formatInfoField } from 'utils/info'
import { listAsSentence } from 'utils/shared'

import styles from './Insights.module.css'

const InsightFlagChanges = ({
  insightData,
  isLoading,
  error,
}: {
  insightData?: InsightResponse
  isLoading: boolean
  error: ParsedAPIError
}) => {
  const { t } = useTranslation()
  const guestUser = useSelector(selectIsGuestUser)
  const { flagsChanges } = insightData?.vesselIdentity || {}

  return (
    <div id="flagChanges" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label>{t('vessel.insights.flagChanges')}</label>
        <DataTerminology
          title={t('vessel.insights.flagChanges')}
          terminologyKey="insightsFlagsChanges"
        />
      </div>
      {guestUser ? (
        <VesselIdentityFieldLogin />
      ) : isLoading ? (
        <Fragment>
          <div style={{ width: '30rem' }} className={styles.loadingPlaceholder} />
        </Fragment>
      ) : error ? (
        <InsightError error={error} />
      ) : (
        <div>
          <p>
            {flagsChanges?.valuesInThePeriod.length !== 0 ||
            flagsChanges?.totalTimesListed !== 0 ? (
              <span>
                {t('vessel.insights.flagChangesCount', {
                  count: flagsChanges?.valuesInThePeriod.length || flagsChanges?.totalTimesListed,
                })}{' '}
                {flagsChanges?.valuesInThePeriod.length
                  ? listAsSentence(
                      flagsChanges?.valuesInThePeriod.map(
                        (v) => formatInfoField(v.value, 'flag') as string
                      ) || []
                    )
                  : ''}
              </span>
            ) : (
              <span className={styles.secondary}>{t('vessel.insights.flagChangesEmpty')}</span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default InsightFlagChanges
