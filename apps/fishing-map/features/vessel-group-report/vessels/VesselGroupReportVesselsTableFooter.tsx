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
import { REPORT_SHOW_MORE_VESSELS_PER_PAGE, REPORT_VESSELS_PER_PAGE } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectVesselGroupReportData } from 'features/vessel-group-report/vessel-group-report.slice'
import { formatInfoField } from 'utils/info'
import { selectVesselGroupReportVesselFilter } from '../vessel-group.config.selectors'
import styles from './VesselGroupReportVesselsTableFooter.module.css'
import {
  selectVesselGroupReportVesselsFiltered,
  selectVesselGroupReportVesselsPagination,
} from './vessel-group-report-vessels.selectors'

export default function VesselGroupReportVesselsTableFooter() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vesselGroup = useSelector(selectVesselGroupReportData)
  const allVessels = useSelector(selectVesselGroupReportVesselsFiltered)
  const reportVesselFilter = useSelector(selectVesselGroupReportVesselFilter)
  const pagination = useSelector(selectVesselGroupReportVesselsPagination)
  const { start, end } = useSelector(selectTimeRange)

  if (!allVessels?.length) return null

  const onDownloadVesselsClick = () => {
    const vessels = allVessels?.map((vessel) => {
      const { flagTranslated, flagTranslatedClean, ...rest } = vessel
      return rest
    })
    if (vessels?.length) {
      //   trackEvent({
      //     category: TrackCategory.Analysis,
      //     action: `Click 'Download CSV'`,
      //     label: `region name: ${reportAreaName} | timerange: ${start} - ${end} | filters: ${reportVesselFilter}`,
      //   })
      const csv = unparseCSV(vessels)
      const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${formatInfoField(vesselGroup?.name, 'name')}-${start}-${end}.csv`)
    }
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
    // trackEvent({
    //   category: TrackCategory.Analysis,
    //   action: `Click on show more vessels`,
    // })
  }
  const onShowLessClick = () => {
    dispatchQueryParams({
      vesselGroupReportResultsPerPage: REPORT_VESSELS_PER_PAGE,
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
        {/* <VesselGroupAddButton
          vessels={allVessels}
          onAddToVesselGroup={onAddToVesselGroup}
          disabled
          tooltip="TODO"
        /> */}
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