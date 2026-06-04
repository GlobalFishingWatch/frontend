import { useCallback } from 'react'
import cx from 'classnames'

import type { IconButtonSize, IconButtonType } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

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
}

const DataTerminology: React.FC<DataTerminologyProps> = ({
  terminologyKey,
  className,
  tooltip,
  size,
  type,
}): React.ReactElement<any> => {
  const { openSidePanel } = useSidePanel()

  const onClick = useCallback(() => {
    openSidePanel({
      type: 'dataTerminology',
      id: terminologyKey,
    })
    trackEvent({
      category: TrackCategory.HelpHints,
      action: `open_data_terminology_${terminologyKey}`,
      label: terminologyKey,
    })
  }, [openSidePanel, terminologyKey])

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
