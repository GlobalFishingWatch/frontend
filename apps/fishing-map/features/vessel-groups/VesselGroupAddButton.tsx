import { useCallback, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import React from 'react'
import { Button, ButtonType, ButtonSize, Popover } from '@globalfishingwatch/ui-components'
import { VesselLastIdentity } from 'features/search/search.slice'
import {
  setVesselGroupEditId,
  setNewVesselGroupSearchVessels,
  setVesselGroupsModalOpen,
  MAX_VESSEL_GROUP_VESSELS,
} from 'features/vessel-groups/vessel-groups.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'
import { selectHasUserGroupsPermissions } from 'features/user/selectors/user.permissions.selectors'
import { ReportVesselWithDatasets } from 'features/reports/reports.selectors'
import { IdentityVesselData } from 'features/vessel/vessel.slice'
import styles from './VesselGroupAddButton.module.css'

type VesselGroupAddButtonProps = {
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
  const { vessels, onAddToVesselGroup, children = <VesselGroupAddActionButton /> } = props
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const hasUserGroupsPermissions = useSelector(selectHasUserGroupsPermissions)
  const vesselGroupOptions = useVesselGroupsOptions()
  const tooManyVessels = vessels?.length > MAX_VESSEL_GROUP_VESSELS
  const disabled = !vessels?.length || tooManyVessels
  const [vesselGroupsOpen, setVesselGroupsOpen] = useState(false)

  const toggleVesselGroupsOpen = useCallback(() => {
    if (!disabled) {
      setVesselGroupsOpen(!vesselGroupsOpen)
    }
  }, [disabled, vesselGroupsOpen])

  const handleAddToVesselGroupClick = useCallback(
    async (vesselGroupId?: string) => {
      const vesselsWithDataset = vessels.map((vessel) => ({
        ...vessel,
        id: (vessel as VesselLastIdentity)?.id || (vessel as ReportVesselWithDatasets)?.vesselId,
        dataset:
          (vessel as VesselLastIdentity)?.dataset?.id ||
          (vessel as ReportVesselWithDatasets)?.infoDataset?.id,
      }))
      if (vesselsWithDataset?.length) {
        if (vesselGroupId) {
          dispatch(setVesselGroupEditId(vesselGroupId))
        }
        dispatch(setNewVesselGroupSearchVessels(vesselsWithDataset))
        dispatch(setVesselGroupsModalOpen(true))
        if (onAddToVesselGroup) {
          onAddToVesselGroup(vesselGroupId)
        }
      } else {
        console.warn('No related activity datasets founds for', vesselsWithDataset)
      }
    },
    [dispatch, onAddToVesselGroup, vessels]
  )
  return (
    hasUserGroupsPermissions && (
      <Popover
        open={vesselGroupsOpen}
        onOpenChange={toggleVesselGroupsOpen}
        content={
          <ul className={styles.groupOptions}>
            <li
              className={cx(styles.groupOption, styles.groupOptionNew)}
              onClick={() => handleAddToVesselGroupClick()}
              key="new-group"
            >
              {t('vesselGroup.createNewGroup', 'Create new group')}
            </li>
            {vesselGroupOptions.map((group) => (
              <li
                className={styles.groupOption}
                key={group.id}
                onClick={() => handleAddToVesselGroupClick(group.id)}
              >
                {group.label}
              </li>
            ))}
          </ul>
        }
      >
        <div>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(
                child,
                {
                  ...props,
                  vessels,
                  onToggleClick: toggleVesselGroupsOpen,
                } as any,
                (child.props as any).children
              )
            }
          })}
        </div>
      </Popover>
    )
  )
}

export default VesselGroupAddButton
