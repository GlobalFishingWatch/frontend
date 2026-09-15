import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { IconButton } from '@globalfishingwatch/ui-components'

import { selectUserData } from 'features/_user/selectors/user.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'

function VesselInfoCorrection() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)

  const onInfoCorrectionClick = useCallback(() => {
    if (userData) dispatch(setModalOpen({ id: 'vesselCorrection', open: true }))

    trackEvent({
      category: TrackCategory.VesselProfile,
      action: `click vessel correction modal`,
    })
  }, [dispatch, userData])

  return (
    <IconButton
      className="vessel-info-correction print-hidden"
      type="border"
      icon="feedback-error"
      tooltip={t((t) => t.layer.vessel_info_correction)}
      tooltipPlacement="bottom"
      size="medium"
      onClick={onInfoCorrectionClick}
    />
  )
}

export default VesselInfoCorrection
