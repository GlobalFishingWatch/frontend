import { useCallback, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import React from 'react'
import { Popover, Spinner } from '@globalfishingwatch/ui-components'
import {
  AddVesselGroupVessel,
  NEW_VESSEL_GROUP_ID,
  useVesselGroupsOptions,
} from 'features/vessel-groups/vessel-groups.hooks'
import { selectHasUserGroupsPermissions } from 'features/user/selectors/user.permissions.selectors'
import styles from './VesselGroupListTooltip.module.css'

type VesselGroupListTooltipProps = {
  children?: React.ReactNode
  vessels?: AddVesselGroupVessel[]
  onAddToVesselGroup?: (vesselGroupId: string) => void
}

function VesselGroupListTooltip(props: VesselGroupListTooltipProps) {
  const { onAddToVesselGroup, children } = props
  const { t } = useTranslation()
  const hasUserGroupsPermissions = useSelector(selectHasUserGroupsPermissions)
  const vesselGroupOptions = useVesselGroupsOptions()
  const [vesselGroupsOpen, setVesselGroupsOpen] = useState(false)

  const toggleVesselGroupsOpen = useCallback(() => {
    setVesselGroupsOpen(!vesselGroupsOpen)
  }, [vesselGroupsOpen])

  return (
    <Popover
      open={vesselGroupsOpen}
      onOpenChange={toggleVesselGroupsOpen}
      placement="right"
      content={
        <ul className={styles.groupOptions}>
          {hasUserGroupsPermissions && (
            <li
              className={cx(styles.groupOption, styles.groupOptionNew)}
              onClick={() => onAddToVesselGroup?.(NEW_VESSEL_GROUP_ID)}
              key="new-group"
            >
              {t('vesselGroup.createNewGroup', 'Create new group')}
            </li>
          )}
          {vesselGroupOptions.map((group) => (
            <li
              className={styles.groupOption}
              key={group.id}
              onClick={
                !group.loading && onAddToVesselGroup
                  ? () => onAddToVesselGroup(group.id)
                  : undefined
              }
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
