import { t } from 'i18next'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { IconButton, IconButtonType } from '@globalfishingwatch/ui-components'
import LocalStorageLoginLink from 'routes/LoginLink'
import { useAppDispatch } from 'features/app/app.hooks'
import { getVesselDatasetsDownloadTrackSupported } from 'features/datasets/datasets.utils'
import { setDownloadTrackVessel } from 'features/download/downloadTrack.slice'
import { isGuestUser, selectUserData } from 'features/user/user.slice'
import { VesselLayerPanelProps } from 'features/workspace/vessels/VesselLayerPanel'

type VesselDownloadButtonProps = VesselLayerPanelProps & {
  vesselIds: string[]
  vesselTitle: string
  datasetId: string
  iconType?: IconButtonType
}

function VesselDownloadButton({
  dataview,
  vesselIds,
  vesselTitle,
  datasetId,
  iconType = 'default',
}: VesselDownloadButtonProps) {
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)
  const [isHover, setIsHover] = useState(false)
  const guestUser = useSelector(isGuestUser)
  const downloadDatasetsSupported = getVesselDatasetsDownloadTrackSupported(
    dataview,
    userData?.permissions
  )
  const downloadSupported = downloadDatasetsSupported.length > 0

  const onDownloadClick = () => {
    dispatch(
      setDownloadTrackVessel({
        ids: vesselIds,
        name: vesselTitle,
        datasets: datasetId,
      })
    )
  }

  if (guestUser) {
    return (
      <LocalStorageLoginLink>
        <IconButton
          type={iconType}
          icon={isHover ? 'user' : 'download'}
          tooltip={
            t(
              'download.trackLogin',
              'Register and login to download vessel tracks (free, 2 minutes)'
            ) as string
          }
          tooltipPlacement="top"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          size="small"
        />
      </LocalStorageLoginLink>
    )
  }

  return (
    <IconButton
      icon="download"
      type={iconType}
      disabled={!downloadSupported}
      tooltip={
        downloadSupported
          ? t('download.trackAction', 'Download vessel track')
          : t(
              'download.trackNotAllowed',
              "You don't have permissions to download tracks from this source"
            )
      }
      tooltipPlacement="top"
      onClick={onDownloadClick}
      size="small"
    />
  )
}

export default VesselDownloadButton
