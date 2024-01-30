import React, { useEffect, useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'
import { InputText, Tooltip } from '@globalfishingwatch/ui-components'
import { selectReportVesselFilter } from 'features/app/selectors/app.reports.selector'
import { useLocationConnect } from 'routes/routes.hook'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import styles from './ReportVesselsFilter.module.css'

type ReportVesselsFilterProps = {}

export default function ReportVesselsFilter(props: ReportVesselsFilterProps) {
  const { t } = useTranslation()
  const reportVesselFilter = useSelector(selectReportVesselFilter)
  const { dispatchQueryParams } = useLocationConnect()
  const [query, setQuery] = useState(reportVesselFilter)
  const [debouncedQuery] = useDebounce(query, 200)

  useEffect(() => {
    dispatchQueryParams({ reportVesselFilter: debouncedQuery, reportVesselPage: 0 })
    trackEvent({
      category: TrackCategory.Analysis,
      action: 'Type search into vessel list',
      label: debouncedQuery,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  useEffect(() => {
    if (reportVesselFilter !== query) {
      setQuery(reportVesselFilter)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportVesselFilter])

  return (
    <div className={styles.inputContainer}>
      <Tooltip
        content={
          <Fragment>
            {t(
              'analysis.searchHelp',
              "Use spaces to search by multiple fileds and '-' to find all vessels that don't match a query."
            )}
            <br />
            {t(
              'analysis.searchHelpExamples',
              "e.g. 'china trawlers', '-spain', 'peru purse|trawler'"
            )}
          </Fragment>
        }
      >
        <InputText
          type="search"
          value={query}
          placeholder={t(
            'analysis.searchPlaceholder',
            'Type to filter vessels by name, mmsi, flag states or gear type'
          )}
          onChange={(e) => setQuery(e.target.value)}
          onCleanButtonClick={() => setQuery('')}
          className={styles.input}
        />
      </Tooltip>
    </div>
  )
}
