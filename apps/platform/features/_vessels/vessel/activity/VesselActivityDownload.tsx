import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { selectTimeRange } from 'features/_map/workspace/selectors/app.timebar.selectors'
import UserLoggedIconButton from 'features/_user/UserLoggedIconButton'
import { selectVesselEventsFilteredByTimerange } from 'features/_vessels/vessel/selectors/vessel.resources.selectors'
import { selectVesselInfoData } from 'features/_vessels/vessel/selectors/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
  selectVesselSection,
} from 'features/_vessels/vessel/vessel.config.selectors'
import { parseEventsToCSV } from 'features/_vessels/vessel/vessel.download'
import { getVesselProperty } from 'features/_vessels/vessel/vessel.utils'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'

import { useVesselProfileEventsLoading } from '../vessel-events.hooks'

const VesselActivityDownload = () => {
  const { t } = useTranslation()
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const timerange = useSelector(selectTimeRange)
  const eventsLoading = useVesselProfileEventsLoading()
  const events = useSelector(selectVesselEventsFilteredByTimerange)
  const vesselSection = useSelector(selectVesselSection)

  const onDownloadClick = async () => {
    const data = parseEventsToCSV(events)
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
    const { saveAs } = await import('file-saver')
    saveAs(
      blob,
      `${getVesselProperty(vesselData, 'shipname', {
        identityId,
        identitySource,
      })}(${getVesselProperty(vesselData, 'flag', {
        identityId,
        identitySource,
      })})-events-${timerange?.start}-${timerange?.end}.csv`
    )
    trackEvent({
      category: TrackCategory.VesselProfile,
      action: 'vessel_events_download',
      label: `${vesselSection}_tab`,
    })
  }

  return (
    <UserLoggedIconButton
      loginSource="vessel-download"
      icon="download"
      size="medium"
      className="print-hidden"
      type="border"
      disabled={eventsLoading}
      onClick={onDownloadClick}
      tooltip={t((t) => t.download.eventsDownload)}
      loginTooltip={t((t) => t.download.eventsDownloadLogin)}
      tooltipPlacement="top"
    />
  )
}

export default VesselActivityDownload
