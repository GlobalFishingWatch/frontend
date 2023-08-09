import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import saveAs from 'file-saver'
import { IconButton } from '@globalfishingwatch/ui-components'
import { selectVesselEventsLoading } from 'features/vessel/activity/vessels-activity.selectors'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { getVesselProperty, parseEventsToCSV } from 'features/vessel/vessel.utils'
import { selectVesselEventsFilteredByTimerange } from 'features/vessel/vessel.selectors'
import {
  selectVesselIdentityIndex,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { selectTimeRange } from 'features/app/app.selectors'

const VesselActivityDownload = () => {
  const { t } = useTranslation()
  const vesselData = useSelector(selectVesselInfoData)
  const identityIndex = useSelector(selectVesselIdentityIndex)
  const identitySource = useSelector(selectVesselIdentitySource)
  const timerange = useSelector(selectTimeRange)
  const eventsLoading = useSelector(selectVesselEventsLoading)
  const events = useSelector(selectVesselEventsFilteredByTimerange)

  const onDownloadClick = () => {
    const data = parseEventsToCSV(events)
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
    saveAs(
      blob,
      `${getVesselProperty(vesselData, 'shipname', {
        identityIndex,
        identitySource,
      })}(${getVesselProperty(vesselData, 'flag', {
        identityIndex,
        identitySource,
      })})-events-${timerange?.start}-${timerange?.end}.csv`
    )
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
