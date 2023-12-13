import cx from 'classnames'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { IconButton, IconType } from '@globalfishingwatch/ui-components'
import styles from './MapControlGroup.module.css'

type MapControlGroupProps = {
  icon: IconType
  active: boolean
  expanded: boolean
  visible: boolean
  tooltip: string
  disabled?: boolean
  onClick: () => void
  onVisibilityClick?: () => void
  onResetClick?: () => void
}

function MapControlGroup({
  icon,
  visible,
  active,
  expanded,
  tooltip,
  disabled,
  onClick,
  onResetClick,
  onVisibilityClick,
}: MapControlGroupProps) {
  const { t } = useTranslation()
  return (
    <ul className={cx(styles.container, { [styles.active]: active })}>
      <li>
        <IconButton
          icon={icon}
          disabled={disabled}
          type="map-tool"
          tooltip={tooltip}
          onClick={onClick}
        ></IconButton>
      </li>
      {expanded && (
        <Fragment>
          {onVisibilityClick && (
            <li>
              <IconButton
                icon={visible ? 'visibility-off' : 'visibility-on'}
                disabled={disabled}
                type="map-tool"
                tooltip={t('common.toggleVisibility', 'Toggle visibility')}
                onClick={onVisibilityClick}
              ></IconButton>
            </li>
          )}
          {onResetClick && (
            <li>
              <IconButton
                icon={'delete'}
                disabled={disabled}
                type="map-tool"
                tooltip={t('common.reset', 'Reset')}
                onClick={onResetClick}
              ></IconButton>
            </li>
          )}
        </Fragment>
      )}
    </ul>
  )
}

export default MapControlGroup
