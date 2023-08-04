import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import saveAs from 'file-saver'
import { IconButton } from '@globalfishingwatch/ui-components'
import { selectVesselEventsLoading } from 'features/vessel/activity/vessels-activity.selectors'
import { selectVesselInfoDataId } from 'features/vessel/vessel.slice'
import { parseEventsToCSV } from 'features/vessel/vessel.utils'
import { selectVesselEventsFilteredByTimerange } from 'features/vessel/vessel.selectors'

const VesselActivityDownload = () => {
  const { t } = useTranslation()
  const vesselId = useSelector(selectVesselInfoDataId)
  const eventsLoading = useSelector(selectVesselEventsLoading)
  const events = useSelector(selectVesselEventsFilteredByTimerange)

  const onDownloadClick = () => {
    const data = parseEventsToCSV(events)
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, `${vesselId}-events.csv`)
  }

  return (
    <IconButton
      icon="download"
      size="medium"
      className="print-hidden"
      type="border"
      disabled={eventsLoading}
      onClick={onDownloadClick}
      tooltip={t('download.dataDownload', 'Download Data')}
      tooltipPlacement="top"
    />
  )
}

export default VesselActivityDownload
