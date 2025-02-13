import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniq } from 'es-toolkit'
import { saveAs } from 'file-saver'
import { unparse as unparseCSV } from 'papaparse'

import { Button, IconButton } from '@globalfishingwatch/ui-components'

import { REPORT_SHOW_MORE_VESSELS_PER_PAGE, REPORT_VESSELS_PER_PAGE } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import I18nNumber from 'features/i18n/i18nNumber'
import { selectVGRData } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import { selectReportVesselFilter } from 'features/reports/reports.config.selectors'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import { useLocationConnect } from 'routes/routes.hook'
import { getEventLabel } from 'utils/analytics'

import {
  selectReportVessels,
  selectReportVesselsFiltered,
  selectReportVesselsPagination,
} from './report-vessels.selectors'
import ReportVesselsTablePinAll from './ReportVesselsTablePin'

import styles from './ReportVesselsTableFooter.module.css'

type ReportVesselsTableFooterProps = {
  reportName?: string
  activityUnit?: string
}

export default function ReportVesselsTableFooter({
  reportName = 'vessel-report',
  activityUnit,
}: ReportVesselsTableFooterProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vesselGroup = useSelector(selectVGRData)
  const allVessels = useSelector(selectReportVessels)
  const allFilteredVessels = useSelector(selectReportVesselsFiltered)
  const reportVesselFilter = useSelector(selectReportVesselFilter)
  const pagination = useSelector(selectReportVesselsPagination)
  const { start, end } = useSelector(selectTimeRange)

  const vesselGroupVessels = useMemo(() => {
    const vessels = reportVesselFilter ? allFilteredVessels : allVessels
    if (!vessels?.length) {
      return { ids: [], datasets: [] }
    }
    return {
      ids: vessels?.flatMap((v) => v.id || v.id || []),
      datasets: uniq(vessels.flatMap((v) => v.datasetId || [])),
    }
  }, [allFilteredVessels, allVessels, reportVesselFilter])

  if (!allVessels?.length) return null

  const onDownloadVesselsClick = () => {
    const vessels = allVessels?.map((vessel) => {
      return {
        name: vessel.shipName,
        MMSI: vessel.ssvid,
        flag: vessel.flag,
        'flag translated': vessel.flagTranslated,
        IMO: vessel.imo,
        'call sign': vessel.callsign,
        'GFW vessel type': vessel.vesselType,
        'GFW gear type': vessel.geartype,
        ...(activityUnit ? { value: vessel.value } : {}),
        sources: vessel.source,
        vesselId: vessel.id,
        dataset: vessel.datasetId,
      }
    })
    if (vessels?.length) {
      const csv = unparseCSV(vessels)
      const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${reportName}-${start}-${end}.csv`)
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: 'vessel_report_download_csv',
        label: getEventLabel([
          `Groupd id: ${vesselGroup?.id}`,
          `start date: ${start}`,
          `end date: ${end}`,
        ]),
        value: `number of vessels identities: ${vessels.length}`,
      })
    }
  }

  const onPrevPageClick = () => {
    dispatchQueryParams({ reportVesselPage: pagination.page - 1 })
  }
  const onNextPageClick = () => {
    dispatchQueryParams({ reportVesselPage: pagination.page + 1 })
  }
  const onShowMoreClick = () => {
    dispatchQueryParams({
      reportVesselResultsPerPage: REPORT_SHOW_MORE_VESSELS_PER_PAGE,
      reportVesselPage: 0,
    })
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Click on show more vessels`,
    })
  }
  const onShowLessClick = () => {
    dispatchQueryParams({
      reportVesselResultsPerPage: REPORT_VESSELS_PER_PAGE,
      reportVesselPage: 0,
    })
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Click on show less vessels`,
    })
  }

  const onAddToVesselGroup = () => {
    // dispatch(setVesselGroupConfirmationMode('saveAndSeeInWorkspace'))
    trackEvent({
      category: TrackCategory.VesselGroups,
      action: 'add_to_vessel_group',
      label: 'report',
    })
  }

  const isShowingMore = pagination.resultsPerPage === REPORT_SHOW_MORE_VESSELS_PER_PAGE
  const hasLessVesselsThanAPage =
    pagination.page === 0 && pagination?.resultsNumber < pagination?.resultsPerPage
  const isLastPaginationPage =
    pagination?.offset + pagination?.resultsPerPage >= pagination?.totalFiltered

  return (
    <div className={styles.footer}>
      <div className={cx(styles.flex, styles.expand)}>
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
              disabled={isLastPaginationPage || hasLessVesselsThanAPage}
              className={cx({
                [styles.disabled]: isLastPaginationPage || hasLessVesselsThanAPage,
              })}
              size="medium"
            />
          </div>
          {pagination.total > REPORT_VESSELS_PER_PAGE && (
            <button onClick={isShowingMore ? onShowLessClick : onShowMoreClick}>
              <label className={styles.pointer}>
                {t('analysis.resultsPerPage', {
                  results: isShowingMore
                    ? REPORT_VESSELS_PER_PAGE
                    : REPORT_SHOW_MORE_VESSELS_PER_PAGE,
                  defaultValue: `Show ${
                    isShowingMore ? REPORT_VESSELS_PER_PAGE : REPORT_SHOW_MORE_VESSELS_PER_PAGE
                  } per page`,
                })}
              </label>
            </button>
          )}
          <span className={cx(styles.noWrap, styles.right)}>
            {reportVesselFilter && (
              <Fragment>
                <I18nNumber number={pagination.totalFiltered} /> {t('common.of', 'of')}{' '}
              </Fragment>
            )}
            <I18nNumber number={pagination.total} />{' '}
            {t('common.vessel', { count: pagination?.total })}
          </span>
        </Fragment>
      </div>
      <div className={cx(styles.flex, styles.expand)}>
        <div className={cx(styles.flex)}>
          <ReportVesselsTablePinAll vessels={allFilteredVessels!} />
          <VesselGroupAddButton
            vesselsToResolve={vesselGroupVessels.ids}
            datasetsToResolve={vesselGroupVessels.datasets}
            onAddToVesselGroup={onAddToVesselGroup}
          />
        </div>
        <Button
          // testId="download-vessel-table-report"
          onClick={onDownloadVesselsClick}
        >
          {t('analysis.downloadVesselsList', 'Download csv')}
        </Button>
      </div>
    </div>
  )
}
