import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { IconButtonType } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { getVesselDatasetsDownloadTrackSupported } from 'features/datasets/datasets.utils'
import { setDownloadTrackVessel } from 'features/download/downloadTrack.slice'
import { selectUserData } from 'features/user/selectors/user.selectors'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import type { VesselLayerPanelProps } from 'features/workspace/vessels/VesselLayerPanel'

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
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)
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

  return (
    <UserLoggedIconButton
      icon="download"
      type={iconType}
      disabled={!downloadSupported}
      loginTooltip={
        t(
          'download.trackLogin',
          'Register and login to download vessel tracks (free, 2 minutes)'
        ) as string
      }
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
