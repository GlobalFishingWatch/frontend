import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import cx from 'classnames'

import { Popover, Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import {
  NEW_VESSEL_GROUP_ID,
  useVesselGroupsOptions,
} from 'features/vessel-groups/vessel-groups.hooks'
import { selectVesselGroupsStatusId } from 'features/vessel-groups/vessel-groups.slice'

import {
  setVesselGroupsModalOpen,
  type VesselGroupVesselIdentity,
} from './vessel-groups-modal.slice'

import styles from './VesselGroupListTooltip.module.css'

type VesselGroupListTooltipProps = {
  children?: React.ReactNode
  vessels?: VesselGroupVesselIdentity[]
  onAddToVesselGroup?: (vesselGroupId: string) => void
  keepOpenWhileAdding?: boolean
  disabled?: boolean
}

function VesselGroupListTooltip(props: VesselGroupListTooltipProps) {
  const { onAddToVesselGroup, children, keepOpenWhileAdding = false, disabled = false } = props
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const vesselGroupOptions = useVesselGroupsOptions()
  const vesselGroupsStatusId = useSelector(selectVesselGroupsStatusId)
  const [addingToGroup, setAddingToGroup] = useState(false)
  const [vesselGroupsOpen, setVesselGroupsOpen] = useState(false)
  const guestUser = useSelector(selectIsGuestUser)

  const toggleVesselGroupsOpen = useCallback(() => {
    if (!disabled) {
      setVesselGroupsOpen(!vesselGroupsOpen)
    }
  }, [vesselGroupsOpen, disabled])

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
        if (vesselGroupId === NEW_VESSEL_GROUP_ID) {
          dispatch(setVesselGroupsModalOpen(true))
        } else {
          if (keepOpenWhileAdding) {
            setAddingToGroup(true)
          } else {
            setVesselGroupsOpen(false)
          }
        }
      }
    },
    [dispatch, keepOpenWhileAdding, onAddToVesselGroup]
  )

  return (
    <Popover
      open={vesselGroupsOpen}
      onOpenChange={guestUser ? undefined : toggleVesselGroupsOpen}
      placement="bottom"
      content={
        <ul className={styles.groupOptions}>
          {!guestUser && (
            <li
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
              role="button"
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
                disabled,
              } as any,
              (child.props as any).children
            )
          }
        })}
      </div>
    </Popover>
  )
}

export default VesselGroupListTooltip
