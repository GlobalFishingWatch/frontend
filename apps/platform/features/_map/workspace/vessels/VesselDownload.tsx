import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { IconButtonType } from '@globalfishingwatch/ui-components'

import { getVesselDatasetsDownloadTrackSupported } from 'features/_map/datasets/datasets.permissions'
import { setDownloadTrackVessel } from 'features/_map/download/downloadTrack.slice'
import type { VesselLayerPanelProps } from 'features/_map/workspace/vessels/VesselLayerPanel'
import { selectUserData } from 'features/_user/selectors/user.selectors'
import UserLoggedIconButton from 'features/_user/UserLoggedIconButton'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'

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
    // Open flag lives in modals.slice so Modals.tsx does not have to reach into downloadTrack.slice.
    dispatch(setModalOpen({ id: 'downloadTrack', open: true }))
  }

  if (!downloadSupported) {
    return null
  }

  return (
    <UserLoggedIconButton
      loginSource="vessel-download"
      icon="download"
      type={iconType}
      loginTooltip={t((t) => t.download.trackLogin) as string}
      tooltip={t((t) => t.download.trackAction)}
      tooltipPlacement="top"
      onClick={onDownloadClick}
      size="medium"
    />
  )
}

export default VesselDownloadButton
