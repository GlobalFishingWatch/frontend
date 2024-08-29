import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Fragment } from 'react'
import { unparse as unparseCSV } from 'papaparse'
import { saveAs } from 'file-saver'
import { Button, IconButton } from '@globalfishingwatch/ui-components'
import I18nNumber from 'features/i18n/i18nNumber'
import { useLocationConnect } from 'routes/routes.hook'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectReportVesselFilter } from 'features/app/selectors/app.reports.selector'
import { REPORT_SHOW_MORE_VESSELS_PER_PAGE, REPORT_VESSELS_PER_PAGE } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectActiveActivityAndDetectionsDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectVesselGroupReportVessels } from 'features/vessel-group-report/vessel-group-report.slice'
// import { parseReportVesselsToIdentity } from '../reports.utils'
import styles from './VesselGroupReportVesselsTableFooter.module.css'
import { selectVesselGroupReportVesselsPagination } from './vessel-group-report-vessels.selectors'

type ReportVesselsTableFooterProps = {
  reportName: string
}

export default function VesselGroupReportVesselsTableFooter({
  reportName,
}: ReportVesselsTableFooterProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const allVessels = useSelector(selectVesselGroupReportVessels)
  console.log('allVessels:', allVessels)
  const allFilteredVessels = useSelector(selectVesselGroupReportVessels)
  const reportVesselFilter = useSelector(selectReportVesselFilter)
  // const reportAreaName = useSelector(selectReportAreaName)
  const pagination = useSelector(selectVesselGroupReportVesselsPagination)
  console.log('pagination:', pagination)
  const heatmapDataviews = useSelector(selectActiveActivityAndDetectionsDataviews)
  const { start, end } = useSelector(selectTimeRange)

  if (!allVessels?.length) return null

  // const vesselGroupIdentityVessels = useMemo(() => {
  //   return parseReportVesselsToIdentity(reportVesselFilter ? allFilteredVessels : allVessels)
  // }, [allFilteredVessels, allVessels, reportVesselFilter])

  const onDownloadVesselsClick = () => {
    // if (allVesselsWithAllInfo?.length) {
    //   const vessels = getVesselsFiltered(allVesselsWithAllInfo, reportVesselFilter)?.map(
    //     (vessel) => {
    //       const { dataviewId, category, sourceColor, flagTranslatedClean, ...rest } = vessel
    //       return rest
    //     }
    //   ) as ReportVesselWithDatasets[]
    //   trackEvent({
    //     category: TrackCategory.Analysis,
    //     action: `Click 'Download CSV'`,
    //     label: `region name: ${reportAreaName} | timerange: ${start} - ${end} | filters: ${reportVesselFilter}`,
    //   })
    //   const csv = unparseCSV(vessels)
    if (allVessels?.length) {
      const csv = unparseCSV(allVessels)
      const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${reportName}-${start}-${end}.csv`)
    }
    // }
  }

  const onPrevPageClick = () => {
    dispatchQueryParams({ vesselGroupReportVesselPage: pagination.page - 1 })
  }
  const onNextPageClick = () => {
    dispatchQueryParams({ vesselGroupReportVesselPage: pagination.page + 1 })
  }
  const onShowMoreClick = () => {
    dispatchQueryParams({
      vesselGroupReportResultsPerPage: REPORT_SHOW_MORE_VESSELS_PER_PAGE,
      vesselGroupReportVesselPage: 0,
    })
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Click on show more vessels`,
    })
  }
  const onShowLessClick = () => {
    dispatchQueryParams({
      vesselGroupReportResultsPerPage: REPORT_VESSELS_PER_PAGE,
      reportVesselPage: 0,
    })
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Click on show less vessels`,
    })
  }
  // const onAddToVesselGroup = () => {
  //   const dataviewIds = heatmapDataviews.map(({ id }) => id)
  //   dispatch(setVesselGroupConfirmationMode('saveAndNavigate'))
  //   if (dataviewIds?.length) {
  //     dispatch(setVesselGroupCurrentDataviewIds(dataviewIds))
  //   }
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
    // pagination?.offset + pagination?.resultsPerPage >= (pagination?.totalFiltered as number)
    pagination?.offset + pagination?.resultsPerPage >= (pagination?.total as number)
  console.log('pagination:', pagination)

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
                  ? // ? pagination?.totalFiltered
                    pagination?.total
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
            {/* {reportVesselFilter && ( */}
            <Fragment>
              <I18nNumber number={allVessels!?.length} /> {t('common.of', 'of')}{' '}
            </Fragment>
            {/* )} */}
            <I18nNumber number={pagination.total} />{' '}
            {t('common.vessel', { count: pagination?.total })}
          </span>
        </Fragment>
      </div>
      <div className={cx(styles.flex, styles.expand)}>
        {/* <VesselGroupAddButton
          vessels={allVessels}
          onAddToVesselGroup={onAddToVesselGroup}
          disabled
          tooltip="TODO"
        /> */}
        <Button
          testId="download-vessel-table-report"
          onClick={onDownloadVesselsClick}
          disabled
          tooltip="TODO"
        >
          {t('analysis.downloadVesselsList', 'Download csv')}
        </Button>
      </div>
    </div>
  )
}
