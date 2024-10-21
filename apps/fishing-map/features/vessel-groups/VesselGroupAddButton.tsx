import { useCallback } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { useSelector } from 'react-redux'
import { Button, ButtonType, ButtonSize } from '@globalfishingwatch/ui-components'
import {
  MAX_VESSEL_GROUP_VESSELS,
  searchVesselGroupsVesselsThunk,
} from 'features/vessel-groups/vessel-groups-modal.slice'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import styles from './VesselGroupListTooltip.module.css'
import VesselGroupListTooltip from './VesselGroupListTooltip'
import {
  AddVesselGroupVessel,
  useVesselGroupsModal,
  useVesselGroupsUpdate,
  NEW_VESSEL_GROUP_ID,
} from './vessel-groups.hooks'
import { parseVesselGroupVessels } from './vessel-groups.utils'

type VesselGroupAddButtonProps = {
  children?: React.ReactNode
  vessels?: AddVesselGroupVessel[]
  vesselsToResolve?: string[]
  datasetsToResolve?: string[]
  onAddToVesselGroup?: (vesselGroupId: string) => void
  keepOpenWhileAdding?: boolean
}

type VesselGroupAddButtonToggleProps = {
  showCount?: boolean
  buttonSize?: ButtonSize
  buttonType?: ButtonType
  className?: string
  vessels?: VesselGroupAddButtonProps['vessels']
  vesselsToResolve?: string[]
  onToggleClick?: () => void
}

export function VesselGroupAddActionButton({
  vessels,
  vesselsToResolve,
  showCount = false,
  buttonSize = 'default',
  buttonType = 'secondary',
  className,
  onToggleClick,
}: VesselGroupAddButtonToggleProps) {
  const { t } = useTranslation()
  const guestUser = useSelector(selectIsGuestUser)
  const tooManyVessels = vessels && vessels?.length > MAX_VESSEL_GROUP_VESSELS
  const disabled = guestUser || (!vessels?.length && !vesselsToResolve?.length) || tooManyVessels

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
  const {
    vessels,
    vesselsToResolve,
    datasetsToResolve,
    onAddToVesselGroup,
    children = <VesselGroupAddActionButton vesselsToResolve={vesselsToResolve} />,
    keepOpenWhileAdding,
  } = props
  const addVesselsToVesselGroup = useVesselGroupsUpdate()
  const createVesselGroupWithVessels = useVesselGroupsModal()
  const vesselGroupVessels = parseVesselGroupVessels(vessels!)
  const dispatch = useAppDispatch()

  const handleAddToVesselGroupClick = useCallback(
    async (vesselGroupId: string) => {
      let resolvedVesselGroupVessels = vesselGroupVessels
      if (vesselsToResolve && datasetsToResolve) {
        // TODO:VV3 check if this works properly
        const action = await dispatch(
          searchVesselGroupsVesselsThunk({
            ids: vesselsToResolve,
            idField: 'vesselId',
            datasets: datasetsToResolve,
          })
        )
        if (searchVesselGroupsVesselsThunk.fulfilled.match(action)) {
          resolvedVesselGroupVessels = action.payload
        }
      }
      if (vesselGroupId !== NEW_VESSEL_GROUP_ID) {
        if (resolvedVesselGroupVessels.length) {
          const vesselGroup = await addVesselsToVesselGroup(
            vesselGroupId,
            resolvedVesselGroupVessels
          )
          if (onAddToVesselGroup && vesselGroup) {
            onAddToVesselGroup(vesselGroup?.id)
          }
        }
      } else {
        createVesselGroupWithVessels(vesselGroupId, resolvedVesselGroupVessels)
        if (onAddToVesselGroup) {
          onAddToVesselGroup(vesselGroupId)
        }
      }
    },
    [
      addVesselsToVesselGroup,
      createVesselGroupWithVessels,
      datasetsToResolve,
      dispatch,
      onAddToVesselGroup,
      vesselGroupVessels,
      vesselsToResolve,
    ]
  )
  return (
    <VesselGroupListTooltip
      onAddToVesselGroup={handleAddToVesselGroupClick}
      vessels={vesselGroupVessels}
      children={children}
      keepOpenWhileAdding={keepOpenWhileAdding}
    />
  )
}

export default VesselGroupAddButton
