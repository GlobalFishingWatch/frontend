import type { ComponentType } from 'react';
import { Fragment, useState } from 'react'
import cx from 'classnames'
import { IconButton, Radio } from '@globalfishingwatch/ui-components'
import { ReactComponent as AreaIcon } from 'assets/icons/timebar-area.svg'
import { useVisibleGeoTemporalLayers } from 'features/layers/layers.hooks'
import { useSelectedTimebarLayerId } from 'features/timebar/timebar.hooks'
import styles from './TimebarSettings.module.css'

const Icon = ({
  SvgIcon,
  label,
  color,
  disabled,
}: {
  SvgIcon: ComponentType
  label: string
  color: string
  disabled?: boolean
}) => {
  const svgProps = {
    fill: color,
    stroke: color,
  }
  return (
    <Fragment>
      <SvgIcon
        className={cx(styles.icon, { [styles.iconDisabled]: disabled })}
        {...(svgProps as any)}
      />
      {label}
    </Fragment>
  )
}

const TimebarSettings = () => {
  const [optionsPanelOpen, setOptionsPanelOpen] = useState(false)
  const [selectedLayerId, setSelectedLayerId] = useSelectedTimebarLayerId()
  const layers = useVisibleGeoTemporalLayers()
  // const { timebarVisualisation, dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  // const { timebarSelectedEnvId, dispatchTimebarSelectedEnvId } = useTimebarEnvironmentConnect()
  // const { timebarGraph, dispatchTimebarGraph } = useTimebarGraphConnect()

  const openOptions = () => {
    setOptionsPanelOpen(true)
  }
  const closeOptions = () => {
    setOptionsPanelOpen(false)
  }

  return (
    <div className={cx('print-hidden', styles.container)}>
      {layers?.length > 0 && (
        <Fragment>
          <IconButton
            icon={optionsPanelOpen ? 'close' : 'settings'}
            type="map-tool"
            onClick={optionsPanelOpen ? closeOptions : openOptions}
            tooltip={optionsPanelOpen ? 'Close timebar settings' : 'Open timebar settings'}
          />
          {optionsPanelOpen && (
            <ul className={styles.optionsContainer}>
              {layers.map((layer, i) => {
                const title = layer.dataset?.name || layer.dataset?.id
                return (
                  <li key={layer.id}>
                    <Radio
                      label={<Icon SvgIcon={AreaIcon} label={title} color={layer?.config.color} />}
                      active={selectedLayerId ? selectedLayerId === layer.id : i === 0}
                      onClick={() => setSelectedLayerId(layer.id)}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </Fragment>
      )}
    </div>
  )
}

export default TimebarSettings
