import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { IconType } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

import styles from './MapControlGroup.module.css'

type MapControlGroupProps = {
  icon: IconType
  active: boolean
  expanded: boolean
  visible: boolean
  editTooltip: string
  deleteTooltip?: string
  disabled?: boolean
  onClick: () => void
  onVisibilityClick?: () => void
  onDeleteClick?: () => void
}

function MapControlGroup({
  icon,
  visible,
  active,
  expanded,
  editTooltip,
  deleteTooltip,
  disabled,
  onClick,
  onDeleteClick,
  onVisibilityClick,
}: MapControlGroupProps) {
  const { t } = useTranslation()
  return (
    <ul className={cx(styles.container, { [styles.active]: active })}>
      <li>
        <IconButton
          icon={active ? 'edit-off' : icon}
          disabled={disabled}
          type="map-tool"
          tooltip={editTooltip}
          onClick={onClick}
        />
      </li>
      {onVisibilityClick && (
        <li className={cx(styles.expandedAction, { [styles.visible]: expanded })}>
          <IconButton
            icon={visible ? 'visibility-off' : 'visibility-on'}
            disabled={disabled}
            type="map-tool"
            tooltip={t('common.toggleVisibility', 'Toggle visibility')}
            onClick={onVisibilityClick}
          />
        </li>
      )}
      {onDeleteClick && (
        <li className={cx(styles.expandedAction, { [styles.visible]: expanded })}>
          <IconButton
            icon={'delete'}
            disabled={disabled}
            type="map-tool"
            tooltip={deleteTooltip || t('common.delete', 'Delete')}
            onClick={onDeleteClick}
          />
        </li>
      )}
    </ul>
  )
}

export default MapControlGroup
