import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import type { InsightResponse } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components'

import DataTerminology from 'features/vessel/identity/DataTerminology'

import InsightError from './InsightErrorMessage'
import InsightGapsDetails from './InsightGapsDetails'

import styles from './Insights.module.css'

const InsightGaps = ({
  insightData,
  isLoading,
  error,
}: {
  insightData?: InsightResponse
  isLoading: boolean
  error: ParsedAPIError
}) => {
  const { t } = useTranslation()
  const { aisOff } = insightData?.gap || {}
  const [eventDetailsVisibility, setEventDetailsVisibility] = useState(false)

  const toggleEventDetailsVisibility = useCallback(() => {
    setEventDetailsVisibility((visibility) => !visibility)
  }, [])

  return (
    <div id="gaps" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <Tooltip content={t('common.experimentalTooltip')}>
          <label className="experimental">{t('vessel.insights.gaps')}</label>
        </Tooltip>
        <DataTerminology title={t('vessel.insights.gaps')} terminologyKey="insightsGaps" />
      </div>
      {isLoading ? (
        <div style={{ width: '20rem' }} className={styles.loadingPlaceholder} />
      ) : error ? (
        <InsightError error={error} />
      ) : (
        <div>
          {aisOff?.length !== 0 ? (
            <Fragment>
              <span>
                {t('vessel.insights.gapsEvents', {
                  count: aisOff?.length,
                })}
              </span>
              <InsightGapsDetails
                insightData={insightData}
                visible={eventDetailsVisibility}
                toggleVisibility={toggleEventDetailsVisibility}
              />
            </Fragment>
          ) : (
            <p className={styles.secondary}>{t('vessel.insights.gapsEventsEmpty')}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default InsightGaps
