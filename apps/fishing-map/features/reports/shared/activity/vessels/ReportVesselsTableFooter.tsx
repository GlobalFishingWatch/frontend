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
import { useAppDispatch } from 'features/app/app.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import { selectReportVesselFilter } from 'features/reports/areas/area-reports.config.selectors'
import type { ReportVesselWithDatasets } from 'features/reports/areas/area-reports.selectors'
import { selectReportAreaName } from 'features/reports/areas/area-reports.selectors'
import { getVesselsFiltered } from 'features/reports/areas/area-reports.utils'
import { setVesselGroupConfirmationMode } from 'features/vessel-groups/vessel-groups-modal.slice'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import { useLocationConnect } from 'routes/routes.hook'

import {
  selectReportVesselsFiltered,
  selectReportVesselsList,
  selectReportVesselsListWithAllInfo,
  selectReportVesselsPagination,
} from './report-activity-vessels.selectors'
import ReportVesselsTablePinAll from './ReportVesselsTablePin'

import styles from './ReportVesselsTableFooter.module.css'

type ReportVesselsTableFooterProps = {
  reportName?: string
}

export default function ReportVesselsTableFooter({ reportName }: ReportVesselsTableFooterProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const allVesselsWithAllInfo = useSelector(selectReportVesselsListWithAllInfo)
  const allVessels = useSelector(selectReportVesselsList)
  const allFilteredVessels = useSelector(selectReportVesselsFiltered)
  const reportVesselFilter = useSelector(selectReportVesselFilter)
  const reportAreaName = useSelector(selectReportAreaName)
  const pagination = useSelector(selectReportVesselsPagination)
  const { start, end } = useSelector(selectTimeRange)
  const allVesselsFiltered = useSelector(selectReportVesselsFiltered)

  const vesselGroupVessels = useMemo(() => {
    const vessels = reportVesselFilter ? allFilteredVessels : allVessels
    if (!vessels?.length) {
      return null
    }
    return {
      ids: vessels?.flatMap((v) => v.id || v.vesselId || []),
      datasets: uniq(vessels.flatMap((v) => v.infoDataset?.id || [])),
    }
  }, [allFilteredVessels, allVessels, reportVesselFilter])

  const onDownloadVesselsClick = () => {
    if (allVesselsWithAllInfo?.length) {
      const vessels = getVesselsFiltered<ReportVesselWithDatasets>(
        allVesselsWithAllInfo,
        reportVesselFilter
      )?.map((vessel) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dataviewId, category, color, flagTranslatedClean, hours, value, ...rest } = vessel
        return { ...rest, value: formatI18nNumber(hours || value) }
      })
      trackEvent({
        category: TrackCategory.Analysis,
        action: `Click 'Download CSV'`,
        label: `region name: ${reportAreaName} | timerange: ${start} - ${end} | filters: ${reportVesselFilter}`,
      })
      const csv = unparseCSV(vessels)
      const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${reportName}-${start}-${end}.csv`)
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
      reportResultsPerPage: REPORT_SHOW_MORE_VESSELS_PER_PAGE,
      reportVesselPage: 0,
    })
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Click on show more vessels`,
    })
  }
  const onShowLessClick = () => {
    dispatchQueryParams({ reportResultsPerPage: REPORT_VESSELS_PER_PAGE, reportVesselPage: 0 })
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Click on show less vessels`,
    })
  }
  const onAddToVesselGroup = (vesselGroupId: string) => {
    dispatch(setVesselGroupConfirmationMode('saveAndSeeInWorkspace'))
    trackEvent({
      category: TrackCategory.VesselGroups,
      action: 'add_to_vessel_group_from_dynamic_report',
      label: `${vesselGroupId}`,
    })
  }

  const isShowingMore = pagination.resultsPerPage === REPORT_SHOW_MORE_VESSELS_PER_PAGE
  const hasLessVesselsThanAPage =
    pagination.page === 0 && pagination?.resultsNumber < pagination?.resultsPerPage
  const isLastPaginationPage =
    pagination?.offset + pagination?.resultsPerPage >= (pagination?.totalFiltered as number)

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
          <span className={cx(styles.noWrap, styles.right)}>
            {reportVesselFilter && (
              <Fragment>
                <I18nNumber number={allFilteredVessels?.length || 0} /> {t('common.of', 'of')}{' '}
              </Fragment>
            )}
            {pagination?.total && (
              <Fragment>
                <I18nNumber number={pagination.total} />{' '}
                {t('common.vessel', { count: pagination.total })}
              </Fragment>
            )}
          </span>
        </Fragment>
      </div>
      <div className={cx(styles.flex, styles.expand)}>
        <div className={cx(styles.flex)}>
          <ReportVesselsTablePinAll vessels={allVesselsFiltered!} />
          <VesselGroupAddButton
            vesselsToResolve={vesselGroupVessels?.ids}
            datasetsToResolve={vesselGroupVessels?.datasets}
            onAddToVesselGroup={onAddToVesselGroup}
          />
        </div>
        <Button testId="download-vessel-table-report" onClick={onDownloadVesselsClick}>
          {t('analysis.downloadVesselsList', 'Download csv')}
        </Button>
      </div>
    </div>
  )
}
