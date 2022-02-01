import React from 'react'
import Tooltip from 'components/tooltip/tooltip'
import { EncounterTypes } from 'types/app.types'
import styles from './encounters-legend.module.css'

interface EncountersLegendProps {
  encounterTypes: EncounterTypes[]
}

const EncountersLegend: React.FC<EncountersLegendProps> = (props): React.ReactElement => {
  const { encounterTypes } = props
  return (
    <div className={styles.legendContainer}>
      {encounterTypes.map((encounterType) => (
        <Tooltip key={encounterType.id} content={encounterType.tooltip}>
          <div className={styles.legend}>
            <span>{encounterType.label}</span>
            <span className={styles.legendIcon} style={{ color: encounterType.color }} />
          </div>
        </Tooltip>
      ))}
    </div>
  )
}

export default EncountersLegend
