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
import { selectVGRVesselFilter } from 'features/reports/vessel-groups/vessel-group.config.selectors'
import { selectVGRData } from 'features/reports/vessel-groups/vessel-group-report.slice'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { useLocationConnect } from 'routes/routes.hook'
import { getEventLabel } from 'utils/analytics'

import {
  selectVGRVesselsFiltered,
  selectVGRVesselsPagination,
} from './vessel-group-report-vessels.selectors'

import styles from './VesselGroupReportVesselsTableFooter.module.css'

export default function VesselGroupReportVesselsTableFooter() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vesselGroup = useSelector(selectVGRData)
  const allVessels = useSelector(selectVGRVesselsFiltered)
  const reportVesselFilter = useSelector(selectVGRVesselFilter)
  const pagination = useSelector(selectVGRVesselsPagination)
  const { start, end } = useSelector(selectTimeRange)

  if (!allVessels?.length) return null

  const onDownloadVesselsClick = () => {
    const vessels = allVessels?.map((vessel) => {
      return {
        dataset: vessel.dataset,
        flag: getVesselProperty(vessel.identity!, 'flag'),
        'flag translated': vessel.flagTranslated,
        'GFW vessel type': vessel.vesselType,
        'GFW gear type': vessel.geartype,
        sources: vessel.source,
        name: vessel.shipName,
        MMSI: getVesselProperty(vessel.identity!, 'ssvid'),
        IMO: getVesselProperty(vessel.identity!, 'imo'),
        'call sign': getVesselProperty(vessel.identity!, 'callsign'),
        vesselId: vessel.vesselId,
      }
    })
    if (vessels?.length) {
      const csv = unparseCSV(vessels)
      const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `vessel-group-${vesselGroup?.name}-${start}-${end}.csv`)
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: 'vessel_group_profile_download_csv',
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
    dispatchQueryParams({ vGRVesselPage: pagination.page - 1 })
  }
  const onNextPageClick = () => {
    dispatchQueryParams({ vGRVesselPage: pagination.page + 1 })
  }
  const onShowMoreClick = () => {
    dispatchQueryParams({
      vGRVesselsResultsPerPage: REPORT_SHOW_MORE_VESSELS_PER_PAGE,
      vGRVesselPage: 0,
    })
    // trackEvent({
    //   category: TrackCategory.Analysis,
    //   action: `Click on show more vessels`,
    // })
  }
  const onShowLessClick = () => {
    dispatchQueryParams({
      vGRVesselsResultsPerPage: REPORT_VESSELS_PER_PAGE,
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
