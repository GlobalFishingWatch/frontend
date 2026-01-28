import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { saveAs } from 'file-saver'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectReportAreaName } from 'features/reports/report-area/area-reports.selectors'
import { selectReportEventsSubCategorySelector } from 'features/reports/reports.config.selectors'
import { parseReportEventsToCSV } from 'features/reports/tabs/events/events.report.download'
import { useFetchEventReportGraphEvents } from 'features/reports/tabs/events/events-report.hooks'
import type { EventsReportGraphProps } from 'features/reports/tabs/events/events-report.types'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'

type EventsReportDownloadProps = Pick<EventsReportGraphProps, 'dataviews' | 'start' | 'end'> & {
  className?: string
}
const EventsReportDownload = ({ dataviews, start, end, className }: EventsReportDownloadProps) => {
  const { t } = useTranslation()
  const timerange = useSelector(selectTimeRange)
  const reportEventsSubCategory = useSelector(selectReportEventsSubCategorySelector)
  const reportAreaName = useSelector(selectReportAreaName)
  const fetchEventsData = useFetchEventReportGraphEvents()
  const [isDownloading, setIsDownloading] = useState(false)

  const onDownloadClick = useCallback(async () => {
    if (dataviews?.length) {
      setIsDownloading(true)
      const data = await fetchEventsData({ dataviews, start, end })
      const csvData = parseReportEventsToCSV(data)
      const blob = new Blob([csvData], { type: 'text/plain;charset=utf-8' })
      const fileName = [
        reportEventsSubCategory,
        'events',
        reportAreaName || 'global',
        timerange.start,
        timerange.end,
      ]
        .filter(Boolean)
        .join('-')
      saveAs(blob, `${fileName}.csv`)
      trackEvent({
        category: TrackCategory.Analysis,
        action: 'events_report_download',
        label: `${reportEventsSubCategory}_tab`,
      })
      setIsDownloading(false)
    }
  }, [
    dataviews,
    fetchEventsData,
    start,
    end,
    reportEventsSubCategory,
    reportAreaName,
    timerange.start,
    timerange.end,
  ])

  if (!dataviews?.length) {
    return null
  }

  return (
    <UserLoggedIconButton
      icon="download"
      size="medium"
      className={cx('print-hidden', className)}
      type="border"
      onClick={onDownloadClick}
      loading={isDownloading}
      disabled={isDownloading}
      tooltip={t((t) => t.download.eventsDownload)}
      loginTooltip={t((t) => t.download.eventsDownloadLogin)}
      tooltipPlacement="top"
    />
  )
}

export default EventsReportDownload
