import { useCallback } from 'react'
import cx from 'classnames'

import { Icon, Tooltip } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useSidePanel } from 'features/content-panel/contentPanel.hooks'

import styles from './DataTerminology.module.css'

interface DataTerminologyProps {
  className?: string
  title?: string | React.ReactNode
  terminologyKey: string
  tooltip?: string
}

const DataTerminology: React.FC<DataTerminologyProps> = ({
  terminologyKey,
  className,
  tooltip,
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
    <Tooltip content={tooltip}>
      <span role="button" onClick={onClick} tabIndex={0}>
        <Icon icon="info" className={cx(styles.infoButton, className, 'print-hidden')} />
      </span>
    </Tooltip>
  )
}

export default DataTerminology
