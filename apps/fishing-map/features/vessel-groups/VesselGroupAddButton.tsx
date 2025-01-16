import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { ButtonSize,ButtonType } from '@globalfishingwatch/ui-components'
import { Button, Icon } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import {
  MAX_VESSEL_GROUP_VESSELS,
  searchVesselGroupsVesselsThunk,
} from 'features/vessel-groups/vessel-groups-modal.slice'

import type { AddVesselGroupVessel } from './vessel-groups.hooks'
import {
  NEW_VESSEL_GROUP_ID,
  useVesselGroupsModal,
  useVesselGroupsUpdate,
} from './vessel-groups.hooks'
import { parseVesselGroupVessels } from './vessel-groups.utils'
import VesselGroupListTooltip from './VesselGroupListTooltip'

import styles from './VesselGroupListTooltip.module.css'

type VesselGroupAddButtonProps = {
  children?: React.ReactNode
  vessels?: AddVesselGroupVessel[]
  vesselsToResolve?: string[]
  datasetsToResolve?: string[]
  onAddToVesselGroup?: (vesselGroupId: string, vesselCount?: number) => void
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
  const vesselsLength = vessels?.length || 0 + (vesselsToResolve ? vesselsToResolve?.length : 0)
  const tooManyVessels = vesselsLength > MAX_VESSEL_GROUP_VESSELS
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
      <Icon icon={'vessel-group'} />
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
            onAddToVesselGroup(vesselGroup?.id, vesselGroup?.vessels?.length)
          }
        }
      } else {
        createVesselGroupWithVessels(vesselGroupId, resolvedVesselGroupVessels)
        if (onAddToVesselGroup) {
          onAddToVesselGroup(vesselGroupId, resolvedVesselGroupVessels?.length)
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
