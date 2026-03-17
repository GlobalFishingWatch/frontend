import { Fragment, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useGetReportEventsStatsQuery } from 'queries/report-events-stats-api'
import { useDebounce } from 'use-debounce'

import { Button, IconButton, InputText } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import I18nNumber from 'features/i18n/i18nNumber'
import PortsReportLink from 'features/reports/report-port/PortsReportLink'
import { selectReportEventsPortsFilter } from 'features/reports/reports.config.selectors'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import { useReportHash } from 'features/reports/tabs/events/events-report.hooks'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useReplaceQueryParams } from 'router/routes.hook'

import {
  selectFetchEventsPortsStatsParams,
  selectReportEventsPortsPaginated,
  selectReportEventsPortsPagination,
} from './events-report.selectors'

import styles from './EventReportPorts.module.css'

function EventReportPorts() {
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  const eventsDataviews = useSelector(selectActiveReportDataviews)
  const eventsDataview = eventsDataviews?.[0]
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const fetchEventsPortsStatsParams = useSelector(selectFetchEventsPortsStatsParams)
  const reportEventsPortsPaginated = useSelector(selectReportEventsPortsPaginated)
  const reportEventsPortsFilter = useSelector(selectReportEventsPortsFilter)
  const pagination = useSelector(selectReportEventsPortsPagination)
  const [query, setQuery] = useState(reportEventsPortsFilter || '')
  const [debouncedQuery] = useDebounce(query, 200)
  const { updateReportHash, reportOutdated } = useReportHash()

  const { status } = useGetReportEventsStatsQuery(fetchEventsPortsStatsParams, {
    skip: !eventsDataview || reportOutdated,
  })

  useEffect(() => {
    if (reportEventsPortsFilter !== query) {
      setQuery(reportEventsPortsFilter || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportEventsPortsFilter])

  useEffect(() => {
    replaceQueryParams({ reportEventsPortsFilter: debouncedQuery, reportEventsPortsPage: 0 })
     
  }, [debouncedQuery])

  const onPrevPageClick = () => {
    replaceQueryParams({ reportEventsPortsPage: pagination.page - 1 })
  }
  const onNextPageClick = () => {
    replaceQueryParams({ reportEventsPortsPage: pagination.page + 1 })
  }

  const seePortsClick = useCallback(() => {
    updateReportHash()
    trackEvent({
      category: TrackCategory.GlobalReports,
      action: `Clicked see ports after events`,
    })
  }, [updateReportHash])

  const onTogglePortFilter = (portId: string) => {
    const isPortInFilter = eventsDataview.config?.filters?.next_port_id?.includes(portId)
    const newDataviewConfig = {
      filters: {
        ...(eventsDataview.config?.filters || {}),
        next_port_id: isPortInFilter
          ? eventsDataview.config?.filters?.next_port_id?.filter((id: string) => id !== portId)
          : [...(eventsDataview.config?.filters?.next_port_id || []), portId],
      },
    }
    if (newDataviewConfig.filters.next_port_id.length === 0) {
      newDataviewConfig.filters.next_port_id = undefined
    }
    upsertDataviewInstance({
      id: eventsDataview.id,
      config: newDataviewConfig,
    })
    setTimeout(() => {
      replaceQueryParams({ reportEventsPortsPage: 0 })
    }, 100)
  }

  const hasLessPortsThanAPage =
    pagination.page === 0 && pagination?.resultsNumber < pagination?.resultsPerPage
  const isLastPaginationPage =
    pagination?.offset + pagination?.resultsPerPage >= pagination?.totalFiltered

  if (reportOutdated) {
    return (
      <ReportVesselsPlaceholder animate={false} showGraph={false} showSearch={false}>
        <div className={cx(styles.cover, styles.center, styles.top)}>
          <p>{t((t) => t.eventsReport.newTimeRangePorts)}</p>
          <Button onClick={seePortsClick}>{t((t) => t.eventsReport.seePorts)}</Button>
        </div>
      </ReportVesselsPlaceholder>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <label>{t((t) => t.analysis.portsAfterEvents)}</label>
        <InputText
          type="search"
          placeholder={t((t) => t.analysis.portsSearchPlaceholder)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onCleanButtonClick={() => setQuery('')}
          className={styles.searchInput}
        />
      </div>
      {status !== 'fulfilled' ? (
        <ReportVesselsPlaceholder
          className={styles.tablePlaceholder}
          showGraph={false}
          showGraphHeader={false}
          showSearch={false}
        />
      ) : (
        <Fragment>
          <div className={styles.tableContainer}>
            <div className={styles.portsTable}>
              <div className={cx(styles.header, styles.spansFirstTwoColumns)}>
                {t((t) => t.common.name)}
              </div>
              <div className={cx(styles.header, styles.spansFirstTwoColumns)}>
                {t((t) => t.common.country)}
              </div>
              <div className={cx(styles.header, styles.spansFirstTwoColumns)}>
                {t((t) => t.common.visits)}
              </div>
              {reportEventsPortsPaginated?.map((port, index) => {
                const isPortInFilter = eventsDataview.config?.filters?.next_port_id?.includes(
                  port.id
                )
                const isLastRow = index === reportEventsPortsPaginated.length - 1
                return (
                  <Fragment key={port.id}>
                    <div className={cx({ [styles.border]: !isLastRow }, styles.portName)}>
                      <IconButton
                        icon={isPortInFilter ? 'filter-on' : 'filter-off'}
                        size="small"
                        onClick={() => onTogglePortFilter(port.id)}
                        tooltip={
                          isPortInFilter
                            ? t((t) => t.event.port_visitedAfterRemove)
                            : t((t) => t.event.port_visitedAfterFilter)
                        }
                      />
                      <PortsReportLink port={port}>{port.name}</PortsReportLink>
                    </div>
                    <div className={cx({ [styles.border]: !isLastRow })}>{port.country}</div>
                    <div className={cx({ [styles.border]: !isLastRow }, styles.right)}>
                      {<I18nNumber number={port.value} />}
                    </div>
                  </Fragment>
                )
              })}
            </div>
          </div>
          <div className={styles.footer}>
            <Fragment>
              <div className={styles.flex}>
                <IconButton
                  icon="arrow-left"
                  disabled={pagination?.page === 0}
                  className={cx({ [styles.disabled]: pagination?.page === 0 })}
                  onClick={onPrevPageClick}
                  size="medium"
                />
                <span className={styles.noWrap}>
                  {`${pagination?.offset + 1} - ${
                    isLastPaginationPage
                      ? pagination?.totalFiltered
                      : pagination?.offset + pagination?.resultsPerPage
                  }`}{' '}
                </span>
                <IconButton
                  icon="arrow-right"
                  onClick={onNextPageClick}
                  disabled={isLastPaginationPage || hasLessPortsThanAPage}
                  className={cx({
                    [styles.disabled]: isLastPaginationPage || hasLessPortsThanAPage,
                  })}
                  size="medium"
                />
              </div>
              <span className={cx(styles.noWrap, styles.right)}>
                {reportEventsPortsFilter && (
                  <Fragment>
                    <I18nNumber number={pagination.totalFiltered} /> {t((t) => t.common.of)}{' '}
                  </Fragment>
                )}
                <I18nNumber number={pagination.total} />{' '}
                {t((t) => t.event.port, {
                  count: pagination?.total,
                })}
              </span>
            </Fragment>
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default EventReportPorts
