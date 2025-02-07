import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { saveAs } from 'file-saver'
import { unparse as unparseCSV } from 'papaparse'

import { Button, IconButton } from '@globalfishingwatch/ui-components'

import { REPORT_SHOW_MORE_VESSELS_PER_PAGE, REPORT_VESSELS_PER_PAGE } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import I18nNumber from 'features/i18n/i18nNumber'
import { selectVGRData } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import { selectReportVesselFilter } from 'features/reports/reports.config.selectors'
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
}

export default function ReportVesselsTableFooter({
  reportName = 'vessel-report',
}: ReportVesselsTableFooterProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vesselGroup = useSelector(selectVGRData)
  // TODO:CVP get this vessels depending on the report type
  // TODO:CVP migrate funcionality from reports/tabs/activity/vessels/ReportVesselsTableFooter.tsx
  const allVessels = useSelector(selectReportVessels)
  const reportVesselFilter = useSelector(selectReportVesselFilter)
  const pagination = useSelector(selectReportVesselsPagination)
  const { start, end } = useSelector(selectTimeRange)

  if (!allVessels?.length) return null

  const onDownloadVesselsClick = () => {
    const vessels = allVessels?.map((vessel) => {
      return {
        dataset: vessel.dataset,
        flag: vessel.flag,
        'flag translated': vessel.flagTranslated,
        'GFW vessel type': vessel.vesselType,
        'GFW gear type': vessel.geartype,
        sources: vessel.source,
        name: vessel.shipName,
        MMSI: vessel.ssvid,
        // TODO:CVP add imo
        IMO: vessel.imo,
        // TODO:CVP add callsign
        'call sign': vessel.callsign,
        vesselId: vessel.id,
      }
    })
    if (vessels?.length) {
      const csv = unparseCSV(vessels)
      const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${reportName}-${vesselGroup?.name}-${start}-${end}.csv`)
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
    // trackEvent({
    //   category: TrackCategory.Analysis,
    //   action: `Click on show more vessels`,
    // })
  }
  const onShowLessClick = () => {
    dispatchQueryParams({
      reportVesselResultsPerPage: REPORT_VESSELS_PER_PAGE,
      reportVesselPage: 0,
    })
    // trackEvent({
    //   category: TrackCategory.Analysis,
    //   action: `Click on show less vessels`,
    // })
  }
  // const onAddToVesselGroup = () => {
  //   const dataviewIds = heatmapDataviews.map(({ id }) => id)
  //   dispatch(setVesselGroupConfirmationMode('saveAndNavigate'))
  //   trackEvent({
  //     category: TrackCategory.VesselGroups,
  //     action: 'add_to_vessel_group',
  //     label: 'report',
  //   })
  // }

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
                <I18nNumber number={pagination.totalFiltered} /> {t('common.of', 'of')}{' '}
              </Fragment>
            )}
            <I18nNumber number={pagination.total} />{' '}
            {t('common.vessel', { count: pagination?.total })}
          </span>
        </Fragment>
      </div>
      <div className={cx(styles.flex, styles.expand, styles.end)}>
        <div className={cx(styles.flex)}>
          {/* TODO:CVP make this work */}
          {/* <ReportVesselsTablePinAll vessels={allVessels!} /> */}
          {/* <VesselGroupAddButton
          vessels={allVessels}
          onAddToVesselGroup={onAddToVesselGroup}
          disabled
          tooltip="TODO"
        /> */}
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
