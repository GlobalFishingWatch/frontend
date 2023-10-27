import { batch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { CSVLink } from 'react-csv'
import { Fragment, useEffect } from 'react'
import { Button, IconButton } from '@globalfishingwatch/ui-components'
import { useStateCallback } from '@globalfishingwatch/react-hooks'
import I18nNumber from 'features/i18n/i18nNumber'
import { useLocationConnect } from 'routes/routes.hook'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import { selectReportVesselFilter, selectTimeRange } from 'features/app/app.selectors'
import { REPORT_SHOW_MORE_VESSELS_PER_PAGE, REPORT_VESSELS_PER_PAGE } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  setVesselGroupConfirmationMode,
  setVesselGroupCurrentDataviewIds,
} from 'features/vessel-groups/vessel-groups.slice'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import {
  selectReportVesselsFiltered,
  selectReportVesselsList,
  selectReportVesselsListWithAllInfo,
  selectReportVesselsPagination,
  getVesselsFiltered,
  ReportVesselWithDatasets,
} from '../reports.selectors'
import styles from './ReportVesselsTableFooter.module.css'

type ReportVesselsTableFooterProps = {
  reportName: string
}

export default function ReportVesselsTableFooter({ reportName }: ReportVesselsTableFooterProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const [allVesselsWithAllInfoFiltered, setAllVesselsWithAllInfoFiltered] = useStateCallback<
    ReportVesselWithDatasets[]
  >([])
  const allVesselsWithAllInfo = useSelector(selectReportVesselsListWithAllInfo)
  const allVessels = useSelector(selectReportVesselsList)
  const allFilteredVessels = useSelector(selectReportVesselsFiltered)
  const reportVesselFilter = useSelector(selectReportVesselFilter)
  const pagination = useSelector(selectReportVesselsPagination)
  const heatmapDataviews = useSelector(selectActiveHeatmapDataviews)
  const { start, end } = useSelector(selectTimeRange)

  const getDownloadVessels = async (_: any, done: any) => {
    if (allVesselsWithAllInfo) {
      const vessels = getVesselsFiltered(allVesselsWithAllInfo, reportVesselFilter)
      setAllVesselsWithAllInfoFiltered(
        vessels?.map((vessel) => {
          const { dataviewId, category, sourceColor, flagTranslatedClean, ...rest } = vessel
          return rest
        }) as ReportVesselWithDatasets[],
        () => {
          trackEvent({
            category: TrackCategory.Analysis,
            action: `Download CSV`,
          })
          done()
        }
      )
    }
  }

  useEffect(() => {
    // State cleanup needed to avoid sluggist renders when there are lots of vessels
    if (allVesselsWithAllInfoFiltered.length) {
      setAllVesselsWithAllInfoFiltered([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allVesselsWithAllInfoFiltered.length])

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
  const onAddToVesselGroup = () => {
    const dataviewIds = heatmapDataviews.map(({ id }) => id)
    batch(() => {
      dispatch(setVesselGroupConfirmationMode('saveAndNavigate'))
      if (dataviewIds?.length) {
        dispatch(setVesselGroupCurrentDataviewIds(dataviewIds))
      }
    })
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
                <I18nNumber number={allFilteredVessels!?.length} /> {t('common.of', 'of')}{' '}
              </Fragment>
            )}
            <I18nNumber number={pagination.total} />{' '}
            {t('common.vessel', { count: pagination?.total })}
          </span>
        </Fragment>
      </div>
      <div className={cx(styles.flex, styles.expand)}>
        <VesselGroupAddButton
          vessels={reportVesselFilter ? allFilteredVessels : (allVessels as any)}
          showCount={false}
          onAddToVesselGroup={onAddToVesselGroup}
        />
        <CSVLink
          filename={`${reportName}-${start}-${end}.csv`}
          onClick={getDownloadVessels}
          asyncOnClick={true}
          data={allVesselsWithAllInfoFiltered}
        >
          <Button testId="download-vessel-table-report">
            {t('analysis.downloadVesselsList', 'Download csv')}
          </Button>
        </CSVLink>
      </div>
    </div>
  )
}
