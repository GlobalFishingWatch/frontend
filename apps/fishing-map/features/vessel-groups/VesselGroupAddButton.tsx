import { useCallback } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { Button, ButtonType, ButtonSize } from '@globalfishingwatch/ui-components'
import { VesselGroupUpsert } from '@globalfishingwatch/api-types'
import { VesselLastIdentity } from 'features/search/search.slice'
import {
  setVesselGroupEditId,
  setNewVesselGroupSearchVessels,
  setVesselGroupsModalOpen,
  MAX_VESSEL_GROUP_VESSELS,
  updateVesselGroupVesselsThunk,
  createVesselGroupThunk,
} from 'features/vessel-groups/vessel-groups.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { IdentityVesselData } from 'features/vessel/vessel.slice'
import { ReportVesselWithDatasets } from 'features/area-report/reports.selectors'
import { getCurrentIdentityVessel } from 'features/vessel/vessel.utils'
import styles from './VesselGroupListTooltip.module.css'
import VesselGroupListTooltip, { NEW_VESSEL_GROUP_ID } from './VesselGroupListTooltip'

type VesselGroupAddButtonProps = {
  mode?: 'auto' | 'manual'
  children?: React.ReactNode
  vessels: (VesselLastIdentity | ReportVesselWithDatasets | IdentityVesselData)[]
  onAddToVesselGroup?: (vesselGroupId?: string) => void
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
  const tooManyVessels = vessels && vessels?.length > MAX_VESSEL_GROUP_VESSELS

  return (
    <Button
      size={buttonSize}
      type={buttonType}
      className={cx('print-hidden', styles.button, className)}
      onClick={onToggleClick}
      disabled={!vessels?.length || tooManyVessels}
      tooltip={
        tooManyVessels
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
    onAddToVesselGroup,
    mode = 'manual',
    children = <VesselGroupAddActionButton />,
  } = props
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const handleAddToVesselGroupClick = useCallback(
    async (vesselGroupId?: string) => {
      if (mode === 'auto') {
        const vesselGroup: VesselGroupUpsert = {
          vessels: vessels.flatMap((vessel) => {
            const { id, dataset } = getCurrentIdentityVessel(vessel as IdentityVesselData)
            if (!id || !dataset) {
              return []
            }
            return {
              vesselId: id,
              dataset: typeof dataset === 'string' ? dataset : dataset.id,
            }
          }),
        }
        const thunkFn =
          vesselGroupId === NEW_VESSEL_GROUP_ID
            ? createVesselGroupThunk
            : updateVesselGroupVesselsThunk
        if (vesselGroupId === NEW_VESSEL_GROUP_ID) {
          const name = prompt(t('vesselGroup.enterName', 'Enter vessel group name'))
          if (name) {
            vesselGroup.name = name
          }
        } else {
          vesselGroup.id = vesselGroupId
        }
        const dispatchedAction = await dispatch(thunkFn(vesselGroup as any))
        if (thunkFn.fulfilled.match(dispatchedAction)) {
          if (onAddToVesselGroup) {
            onAddToVesselGroup(dispatchedAction.payload.id)
          }
        }
      } else {
        const vesselsWithDataset = vessels.map((vessel) => ({
          ...vessel,
          id: (vessel as VesselLastIdentity)?.id || (vessel as ReportVesselWithDatasets)?.vesselId,
          dataset:
            typeof vessel?.dataset === 'string'
              ? vessel.dataset
              : vessel.dataset?.id || (vessel as ReportVesselWithDatasets)?.infoDataset?.id,
        }))
        if (vesselsWithDataset?.length) {
          if (vesselGroupId && vesselGroupId !== NEW_VESSEL_GROUP_ID) {
            dispatch(setVesselGroupEditId(vesselGroupId))
          }
          dispatch(setNewVesselGroupSearchVessels(vesselsWithDataset))
          dispatch(setVesselGroupsModalOpen(true))
        } else {
          console.warn('No related activity datasets founds for', vesselsWithDataset)
        }
        if (onAddToVesselGroup) {
          onAddToVesselGroup(vesselGroupId)
        }
      }
    },
    [dispatch, mode, onAddToVesselGroup, t, vessels]
  )
  return (
    <VesselGroupListTooltip onAddToVesselGroup={handleAddToVesselGroupClick} children={children} />
  )
}

export default VesselGroupAddButton
