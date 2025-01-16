import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { saveAs } from 'file-saver'
import { unparse as unparseCSV } from 'papaparse'

import { Button, IconButton } from '@globalfishingwatch/ui-components'

import { REPORT_SHOW_MORE_VESSELS_PER_PAGE, REPORT_VESSELS_PER_PAGE } from 'data/config'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import I18nNumber from 'features/i18n/i18nNumber'
import type { VesselsPagination } from 'features/reports/vessel-groups/events/vgr-events.selectors'
import { selectVGRData } from 'features/reports/vessel-groups/vessel-group-report.slice'
import styles from 'features/reports/vessel-groups/vessels/VesselGroupReportVesselsTableFooter.module.css'
import type { VesselGroupReportState } from 'features/vessel-groups/vessel-groups.types'
import { useLocationConnect } from 'routes/routes.hook'

import type { EventsStatsVessel } from '../../ports/ports-report.slice'
import type { PortsReportState } from '../../ports/ports-report.types'

export default function EventsReportVesselsTableFooter({
  vessels,
  filter,
  pagination,
  pageQueryParam = 'vGREventsVesselPage',
  resultsPerPageQueryParam = 'vGREventsResultsPerPage',
}: {
  vessels: EventsStatsVessel[]
  filter: string
  pagination: VesselsPagination
  pageQueryParam?:
    | keyof Pick<VesselGroupReportState, 'vGREventsVesselPage'>
    | keyof Pick<PortsReportState, 'portsReportVesselsPage'>
  resultsPerPageQueryParam?:
    | keyof Pick<VesselGroupReportState, 'vGREventsResultsPerPage'>
    | keyof Pick<PortsReportState, 'portsReportVesselsResultsPerPage'>
}) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vesselGroup = useSelector(selectVGRData)
  const { start, end } = useSelector(selectTimeRange)

  if (!vessels?.length) return null

  const onDownloadVesselsClick = () => {
    const vesselsCopy = vessels?.map((vessel) => {
      const { ...rest } = vessel
      return rest
    })
    if (vesselsCopy?.length) {
      //   trackEvent({
      //     category: TrackCategory.Analysis,
      //     action: `Click 'Download CSV'`,
      //     label: `region name: ${reportAreaName} | timerange: ${start} - ${end} | filters: ${reportVesselFilter}`,
      //   })
      const csv = unparseCSV(vesselsCopy)
      const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${vesselGroup?.name}-${start}-${end}.csv`)
    }
  }

  const onPrevPageClick = () => {
    dispatchQueryParams({ [pageQueryParam]: pagination.page - 1 })
  }
  const onNextPageClick = () => {
    dispatchQueryParams({ [pageQueryParam]: pagination.page + 1 })
  }
  const onShowMoreClick = () => {
    dispatchQueryParams({
      [resultsPerPageQueryParam]: REPORT_SHOW_MORE_VESSELS_PER_PAGE,
      [pageQueryParam]: 0,
    })
    // trackEvent({
    //   category: TrackCategory.Analysis,
    //   action: `Click on show more vessels`,
    // })
  }
  const onShowLessClick = () => {
    dispatchQueryParams({
      [resultsPerPageQueryParam]: REPORT_VESSELS_PER_PAGE,
      [pageQueryParam]: 0,
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
            {filter && (
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
