import { useCallback } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { useSelector } from 'react-redux'
import { Button, ButtonType, ButtonSize } from '@globalfishingwatch/ui-components'
import { MAX_VESSEL_GROUP_VESSELS } from 'features/vessel-groups/vessel-groups-modal.slice'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import styles from './VesselGroupListTooltip.module.css'
import VesselGroupListTooltip from './VesselGroupListTooltip'
import {
  AddVesselGroupVessel,
  useVesselGroupsModal,
  useVesselGroupsUpdate,
  NEW_VESSEL_GROUP_ID,
} from './vessel-groups.hooks'

type VesselGroupAddButtonProps = {
  children?: React.ReactNode
  vessels: AddVesselGroupVessel[]
  onAddToVesselGroup?: (vesselGroupId: string) => void
}

type VesselGroupAddButtonToggleProps = {
  showCount?: boolean
  buttonSize?: ButtonSize
  buttonType?: ButtonType
  className?: string
  vessels?: VesselGroupAddButtonProps['vessels']
  onToggleClick?: () => void
}

export function VesselGroupAddActionButton({
  vessels,
  showCount = false,
  buttonSize = 'default',
  buttonType = 'secondary',
  className,
  onToggleClick,
}: VesselGroupAddButtonToggleProps) {
  const { t } = useTranslation()
  const guestUser = useSelector(selectIsGuestUser)
  const tooManyVessels = vessels && vessels?.length > MAX_VESSEL_GROUP_VESSELS
  const disabled = guestUser || !vessels?.length || tooManyVessels

  return (
    <Button
      size={buttonSize}
      type={buttonType}
      className={cx('print-hidden', styles.button, className)}
      onClick={disabled ? undefined : onToggleClick}
      disabled={disabled}
      tooltip={
        guestUser
          ? t('vesselGroup.loginToAdd', 'Login to add to group')
          : tooManyVessels
          ? t('vesselGroup.tooManyVessels', {
              count: MAX_VESSEL_GROUP_VESSELS,
              defaultValue: 'Maximum number of vessels is {{count}}',
            })
          : ''
      }
      tooltipPlacement="top"
    >
      {t('vesselGroup.add', 'Add to group')}
      {showCount && vessels ? ` (${vessels.length})` : ''}
    </Button>
  )
}

function VesselGroupAddButton(props: VesselGroupAddButtonProps) {
  const { vessels, onAddToVesselGroup, children = <VesselGroupAddActionButton /> } = props
  const addVesselsToVesselGroup = useVesselGroupsUpdate()
  const createVesselGroupWithVessels = useVesselGroupsModal()

  const handleAddToVesselGroupClick = useCallback(
    async (vesselGroupId: string) => {
      if (vesselGroupId !== NEW_VESSEL_GROUP_ID) {
        if (vessels.length) {
          const vesselGroup = await addVesselsToVesselGroup(vesselGroupId, vessels)
          if (onAddToVesselGroup && vesselGroup) {
            onAddToVesselGroup(vesselGroup?.id)
          }
        }
      } else {
        createVesselGroupWithVessels(vesselGroupId, vessels)
        if (onAddToVesselGroup) {
          onAddToVesselGroup(vesselGroupId)
        }
      }
    },
    [addVesselsToVesselGroup, createVesselGroupWithVessels, onAddToVesselGroup, vessels]
  )
  return (
    <VesselGroupListTooltip
      onAddToVesselGroup={handleAddToVesselGroupClick}
      vessels={vessels}
      children={children}
    />
  )
}

export default VesselGroupAddButton
