import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import saveAs from 'file-saver'
import { IconButton } from '@globalfishingwatch/ui-components'
import {
  selectFilteredEvents,
  selectVesselEventsLoading,
} from 'features/vessel/activity/vessels-activity.selectors'
import { selectVesselInfoDataId } from 'features/vessel/vessel.slice'
import { selectVoyagesByVessel } from 'features/vessel/activity/activity-by-voyage/activity-by-voyage.selectors'
import { parseEventsToCSV } from 'features/vessel/vessel.utils'
import { selectVesselActivityMode } from 'features/vessel/vessel.selectors'

const VesselActivityDownload = () => {
  const { t } = useTranslation()
  const vesselId = useSelector(selectVesselInfoDataId)
  const activityMode = useSelector(selectVesselActivityMode)
  const eventsLoading = useSelector(selectVesselEventsLoading)
  const voyages = useSelector(selectVoyagesByVessel)
  const allEvents = useSelector(selectFilteredEvents)

  const onDownloadClick = () => {
    if (activityMode === 'voyages') {
      // TODO Voyages download
      // if (voyages?.length) {
      //   const data = parseVoyagesToCSV(voyages)
      //   const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
      //   saveAs(blob, vesselId + '.csv')
      // }
    } else {
      const data = parseEventsToCSV(allEvents)
      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${vesselId}-${activityMode}-events.csv`)
    }
  }

  return (
    <IconButton
      icon="download"
      size="medium"
      type="border"
      disabled={eventsLoading}
      onClick={onDownloadClick}
      tooltip={t('download.dataDownload', 'Download Data')}
      tooltipPlacement="top"
    />
  )
}

export default VesselActivityDownload
