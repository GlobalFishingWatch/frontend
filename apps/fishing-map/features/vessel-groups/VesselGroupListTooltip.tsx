import { useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import React from 'react'
import { toast } from 'react-toastify'
import { Popover, Spinner } from '@globalfishingwatch/ui-components'
import {
  NEW_VESSEL_GROUP_ID,
  useVesselGroupsOptions,
} from 'features/vessel-groups/vessel-groups.hooks'
import { selectHasUserGroupsPermissions } from 'features/user/selectors/user.permissions.selectors'
import { selectVesselGroupsStatusId } from 'features/vessel-groups/vessel-groups.slice'
import styles from './VesselGroupListTooltip.module.css'
import { VesselGroupVesselIdentity } from './vessel-groups-modal.slice'

type VesselGroupListTooltipProps = {
  children?: React.ReactNode
  vessels?: VesselGroupVesselIdentity[]
  onAddToVesselGroup?: (vesselGroupId: string) => void
  keepOpenWhileAdding?: boolean
}

function VesselGroupListTooltip(props: VesselGroupListTooltipProps) {
  const { onAddToVesselGroup, children, keepOpenWhileAdding = false } = props
  const { t } = useTranslation()
  const hasUserGroupsPermissions = useSelector(selectHasUserGroupsPermissions)
  const vesselGroupOptions = useVesselGroupsOptions()
  const vesselGroupsStatusId = useSelector(selectVesselGroupsStatusId)
  const [addingToGroup, setAddingToGroup] = useState(false)
  const [vesselGroupsOpen, setVesselGroupsOpen] = useState(false)

  const toggleVesselGroupsOpen = useCallback(() => {
    setVesselGroupsOpen(!vesselGroupsOpen)
  }, [vesselGroupsOpen])

  useEffect(() => {
    if (addingToGroup && !vesselGroupsStatusId) {
      toast(t('vesselGroup.vesselAddedToGroup', 'Your vessel group was updated'), {
        toastId: 'vesselAddedToGroup',
      })
      setVesselGroupsOpen(false)
      setAddingToGroup(false)
    }
  }, [vesselGroupsStatusId, t, addingToGroup])

  const handleVesselGroupClick = useCallback(
    (vesselGroupId: string) => {
      if (onAddToVesselGroup) {
        onAddToVesselGroup(vesselGroupId)
        if (keepOpenWhileAdding) {
          setAddingToGroup(true)
        } else {
          setVesselGroupsOpen(false)
        }
      }
    },
    [keepOpenWhileAdding, onAddToVesselGroup]
  )

  return (
    <Popover
      open={vesselGroupsOpen}
      onOpenChange={toggleVesselGroupsOpen}
      placement="bottom"
      content={
        <ul className={styles.groupOptions}>
          {hasUserGroupsPermissions && (
            <li
              className={cx(styles.groupOption, styles.groupOptionNew)}
              onClick={() => handleVesselGroupClick(NEW_VESSEL_GROUP_ID)}
              key="new-group"
            >
              {t('vesselGroup.createNewGroup', 'Create new group')}
            </li>
          )}
          {vesselGroupOptions.map((group) => (
            <li
              className={styles.groupOption}
              key={group.id}
              onClick={!group.loading ? () => handleVesselGroupClick(group.id) : undefined}
            >
              {group.label}
              {group.loading && <Spinner className={styles.groupLoading} size="tiny" />}
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
                onToggleClick: toggleVesselGroupsOpen,
              } as any,
              child.props.children
            )
          }
        })}
      </div>
    </Popover>
  )
}

export default VesselGroupListTooltip
