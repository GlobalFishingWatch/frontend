import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useDebounce } from 'use-debounce'

import { InputText, Tooltip } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import type { ReportState } from 'features/reports/reports.types'
import { useLocationConnect } from 'routes/routes.hook'
import { selectLocationType } from 'routes/routes.selectors'

import styles from './ReportVesselsFilter.module.css'

type ReportVesselsFilterProps = {
  filter: ReportState['reportVesselFilter']
  filterQueryParam?: keyof Pick<ReportState, 'reportVesselFilter'>
  pageQueryParam?: keyof Pick<ReportState, 'reportVesselPage'>
}

export default function ReportVesselsFilter({
  filter,
  filterQueryParam = 'reportVesselFilter',
  pageQueryParam = 'reportVesselPage',
}: ReportVesselsFilterProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const [query, setQuery] = useState(filter || '')
  const [debouncedQuery] = useDebounce(query, 200)
  const locationType = useSelector(selectLocationType)

  useEffect(() => {
    if (filter !== undefined && filter !== query) {
      setQuery(filter || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const prevDebouncedQueryRef = useRef<string | null>(null)

  useEffect(() => {
    // Prevent firing on initial render
    if (
      prevDebouncedQueryRef.current !== null &&
      debouncedQuery !== prevDebouncedQueryRef.current
    ) {
      dispatchQueryParams({ [filterQueryParam]: debouncedQuery, [pageQueryParam]: 0 })

      trackEvent({
        category: TrackCategory.Analysis,
        action: `Type search into vessel list from ${locationType}`,
        label: debouncedQuery,
      })
    }
    prevDebouncedQueryRef.current = debouncedQuery
  }, [debouncedQuery, dispatchQueryParams, filterQueryParam, pageQueryParam, locationType])

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
          placeholder={t('analysis.searchPlaceholder')}
          onChange={(e) => setQuery(e.target.value)}
          onCleanButtonClick={() => setQuery('')}
          className={styles.input}
        />
      </Tooltip>
    </div>
  )
}
