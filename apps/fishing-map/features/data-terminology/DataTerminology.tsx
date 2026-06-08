import { useCallback } from 'react'
import cx from 'classnames'

import type { IconButtonSize, IconButtonType } from '@globalfishingwatch/ui-components'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import type { DataTerminologySlugs } from 'features/cms/loaders/data-terminology.types'
import { useSidePanel } from 'features/content-panel/contentPanel.hooks'

import styles from './DataTerminology.module.css'

interface DataTerminologyProps {
  className?: string
  size?: IconButtonSize
  type?: IconButtonType
  title?: string | React.ReactNode
  terminologyKey: DataTerminologySlugs
  tooltip?: string
  inline?: boolean
}

const DataTerminology: React.FC<DataTerminologyProps> = ({
  terminologyKey,
  className,
  tooltip,
  size = 'small',
  type,
  inline,
}): React.ReactElement<any> => {
  const { openSidePanel } = useSidePanel()

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      openSidePanel({
        type: 'dataTerminology',
        id: terminologyKey,
      })
      trackEvent({
        category: TrackCategory.HelpHints,
        action: `open_data_terminology_${terminologyKey}`,
        label: terminologyKey,
      })
    },
    [openSidePanel, terminologyKey]
  )

  if (inline) {
    return (
      <span
        className={cx(styles.infoButton, className, 'print-hidden')}
        onClick={onClick}
        role="button"
        tabIndex={0}
        title={tooltip}
      >
        <Icon icon="info" />
      </span>
    )
  }

  return (
    <IconButton
      icon="info"
      className={cx(styles.infoButton, className, 'print-hidden')}
      size={size}
      type={type}
      onClick={onClick}
      tooltip={tooltip}
    />
  )
}

export default DataTerminology
