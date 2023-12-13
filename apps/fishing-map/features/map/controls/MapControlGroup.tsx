import cx from 'classnames'
import { Fragment } from 'react'
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
                icon={visible ? 'visibility-on' : 'visibility-off'}
                disabled={disabled}
                type="map-tool"
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
