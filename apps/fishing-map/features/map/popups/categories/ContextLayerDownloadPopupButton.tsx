import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { IconButton } from '@globalfishingwatch/ui-components'

import { getActivityDatasetsReportSupported } from 'features/datasets/datasets.utils'
import {
  selectActiveHeatmapDowloadDataviews,
  selectHasReportLayersVisible,
} from 'features/dataviews/selectors/dataviews.selectors'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'

type ContextLayerDownloadPopupButtonProps = {
  onClick: (e: React.MouseEvent<Element, MouseEvent>) => void
}

const ContextLayerDownloadPopupButton: React.FC<ContextLayerDownloadPopupButtonProps> = ({
  onClick,
}: ContextLayerDownloadPopupButtonProps) => {
  const { t } = useTranslation()
  const guestUser = useSelector(selectIsGuestUser)
  const userData = useSelector(selectUserData)
  const activityDataviews = useSelector(selectActiveHeatmapDowloadDataviews)
  const hasAnalysableLayer = useSelector(selectHasReportLayersVisible)
  const datasetsReportAllowed = getActivityDatasetsReportSupported(
    activityDataviews,
    userData?.permissions || []
  )

  const datasetsReportSupported = datasetsReportAllowed?.length > 0
  return (
    <LoginButtonWrapper tooltip={t('download.heatmapLogin')}>
      <IconButton
        icon="download"
        disabled={!guestUser && (!hasAnalysableLayer || !datasetsReportSupported)}
        testId="download-activity-layers"
        tooltip={
          datasetsReportSupported ? t('download.heatmapLayers') : t('download.noHeatmapLayers')
        }
        onClick={onClick}
        size="small"
      />
    </LoginButtonWrapper>
  )
}

export default ContextLayerDownloadPopupButton
