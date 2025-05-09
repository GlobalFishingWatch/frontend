import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useGetReportEventsStatsQuery } from 'queries/report-events-stats-api'
import { useDebounce } from 'use-debounce'

import { Button, IconButton, InputText } from '@globalfishingwatch/ui-components'

import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import I18nNumber from 'features/i18n/i18nNumber'
import { selectReportEventsPortsFilter } from 'features/reports/reports.config.selectors'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import { useReportHash } from 'features/reports/tabs/events/events-report.hooks'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'

import {
  selectFetchEventsPortsStatsParams,
  selectReportEventsPortsPaginated,
  selectReportEventsPortsPagination,
} from './events-report.selectors'

import styles from './EventReportPorts.module.css'

function EventReportPorts() {
  const { t } = useTranslation()
  const eventsDataview = useSelector(selectActiveReportDataviews)?.[0]
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const statsParams = useSelector(selectFetchEventsPortsStatsParams)
  const reportEventsPortsPaginated = useSelector(selectReportEventsPortsPaginated)
  const reportEventsPortsFilter = useSelector(selectReportEventsPortsFilter)
  const pagination = useSelector(selectReportEventsPortsPagination)
  const { dispatchQueryParams } = useLocationConnect()

  const [query, setQuery] = useState(reportEventsPortsFilter || '')
  const [debouncedQuery] = useDebounce(query, 200)
  const { updateReportHash, reportOutdated } = useReportHash()

  const { status } = useGetReportEventsStatsQuery(statsParams, {
    skip: !eventsDataview || reportOutdated,
  })

  useEffect(() => {
    if (reportEventsPortsFilter !== query) {
      setQuery(reportEventsPortsFilter || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportEventsPortsFilter])

  useEffect(() => {
    dispatchQueryParams({ reportEventsPortsFilter: debouncedQuery, reportEventsPortsPage: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  const onPrevPageClick = () => {
    dispatchQueryParams({ reportEventsPortsPage: pagination.page - 1 })
  }
  const onNextPageClick = () => {
    dispatchQueryParams({ reportEventsPortsPage: pagination.page + 1 })
  }

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
    upsertDataviewInstance({
      id: eventsDataview.id,
      config: newDataviewConfig,
    })
  }

  const hasLessPortsThanAPage =
    pagination.page === 0 && pagination?.resultsNumber < pagination?.resultsPerPage
  const isLastPaginationPage =
    pagination?.offset + pagination?.resultsPerPage >= pagination?.totalFiltered

  if (reportOutdated) {
    return (
      <ReportVesselsPlaceholder animate={false} showGraph={false} showSearch={false}>
        <div className={cx(styles.cover, styles.center, styles.top)}>
          <p>
            {t(
              'eventsReport.newTimeRangePorts',
              'Click the button to see the ports visited after events'
            )}
          </p>
          <Button onClick={updateReportHash}>{t('eventsReport.seePorts', 'See ports')}</Button>
        </div>
      </ReportVesselsPlaceholder>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <label>{t('analysis.portsAfterEvents', 'Ports visited after events')}</label>
        <InputText
          type="search"
          placeholder={t('analysis.portsSearchPlaceholder', 'Search ports')}
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
                {t('common.name', 'Name')}
              </div>
              <div className={cx(styles.header, styles.spansFirstTwoColumns)}>
                {t('common.country', 'Country')}
              </div>
              <div className={cx(styles.header, styles.spansFirstTwoColumns)}>
                {t('common.visits', 'Visits')}
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
                            ? t('event.port_visitedAfterRemove', 'Remove port filter')
                            : t(
                                'event.port_visitedAfterFilter',
                                'Filter events by port visited after'
                              )
                        }
                      />
                      {port.name}
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
                    <I18nNumber number={pagination.totalFiltered} /> {t('common.of', 'of')}{' '}
                  </Fragment>
                )}
                <I18nNumber number={pagination.total} />{' '}
                {t('event.port', { count: pagination?.total })}
              </span>
            </Fragment>
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default EventReportPorts
