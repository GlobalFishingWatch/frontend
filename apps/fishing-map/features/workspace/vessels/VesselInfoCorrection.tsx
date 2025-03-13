import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { IconButton } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectInfoCorrectionModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { selectUserData } from 'features/user/selectors/user.selectors'
import InfoCorrectionModal from 'features/vessel/infoCorrection/InfoCorrectionModal'

function VesselInfoCorrection() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)

  const modalOpen = useSelector(selectInfoCorrectionModalOpen)

  const onInfoCorrectionClick = useCallback(() => {
    if (userData) dispatch(setModalOpen({ id: 'infoCorrection', open: true }))
  }, [dispatch, userData])

  return (
    <Fragment>
      <IconButton
        className="vessel-info-correction"
        type="border"
        icon="feedback-error"
        tooltip={t('layer.vessel_info_correction', 'Suggest a correction')}
        tooltipPlacement="bottom"
        size="small"
        onClick={onInfoCorrectionClick}
      />
      {modalOpen && (
        <InfoCorrectionModal
          isOpen={modalOpen}
          onClose={() => dispatch(setModalOpen({ id: 'infoCorrection', open: false }))}
        />
      )}
    </Fragment>
  )
}

export default VesselInfoCorrection
