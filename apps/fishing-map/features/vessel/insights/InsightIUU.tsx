import { useTranslation } from 'react-i18next'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import type { InsightResponse } from '@globalfishingwatch/api-types'

import DataTerminology from 'features/vessel/identity/DataTerminology'
import InsightError from 'features/vessel/insights/InsightErrorMessage'

import styles from './Insights.module.css'

const InsightIUU = ({
  insightData,
  isLoading,
  error,
}: {
  insightData?: InsightResponse
  isLoading: boolean
  error: ParsedAPIError
}) => {
  const { t } = useTranslation()
  const { iuuVesselList } = insightData?.vesselIdentity || {}
  return (
    <div id="IUU" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label>{t('vessel.insights.IUU', 'RFMO IUU Vessel List')}</label>
        <DataTerminology
          size="tiny"
          type="default"
          title={t('vessel.insights.IUU', 'RFMO IUU Vessel List')}
          terminologyKey="insightsIUU"
        />
      </div>
      {isLoading ? (
        <div style={{ width: '50rem' }} className={styles.loadingPlaceholder} />
      ) : error ? (
        <InsightError error={error} />
      ) : (
        <div>
          <p>
            {iuuVesselList?.valuesInThePeriod.length !== 0 ? (
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
