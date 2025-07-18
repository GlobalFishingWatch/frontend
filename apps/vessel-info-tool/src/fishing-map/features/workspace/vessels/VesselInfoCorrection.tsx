import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectVesselCorrectionModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { selectUserData } from 'features/user/selectors/user.selectors'
import VesselCorrectionModal from 'features/vessel/vesselCorrection/VesselCorrectionModal'

function VesselInfoCorrection() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)

  const modalOpen = useSelector(selectVesselCorrectionModalOpen)

  const onInfoCorrectionClick = useCallback(() => {
    if (userData) dispatch(setModalOpen({ id: 'vesselCorrection', open: true }))

    trackEvent({
      category: TrackCategory.VesselProfile,
      action: `click vessel correction modal`,
    })
  }, [dispatch, userData])

  return (
    <Fragment>
      <IconButton
        className="vessel-info-correction"
        type="border"
        icon="feedback-error"
        tooltip={t('layer.vessel_info_correction')}
        tooltipPlacement="bottom"
        size="small"
        onClick={onInfoCorrectionClick}
      />
      {modalOpen && (
        <VesselCorrectionModal
          isOpen={modalOpen}
          onClose={() => dispatch(setModalOpen({ id: 'vesselCorrection', open: false }))}
        />
      )}
    </Fragment>
  )
}

export default VesselInfoCorrection
