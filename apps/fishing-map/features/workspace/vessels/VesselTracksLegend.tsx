import { useSelector } from 'react-redux'
import { LegendType, MapLegend } from '@globalfishingwatch/ui-components'
import { selectVesselsColorBy } from 'features/app/selectors/app.selectors'
import styles from 'features/workspace/shared/Sections.module.css'

const COLORS = [
  '#4B2AA3',
  '#632995',
  '#8C2992',
  '#BA3A8F',
  '#E05885',
  '#FC7B79',
  '#FFA369',
  '#FFCC4F',
  '#FFF650',
  '#FFF992',
]

const SPEEDS = [0, 1, 2, 4, 6, 8, 10, 15, 20, 25]
const DEPTHS = [0, -100, -200, -500, -1000, -2000, -3000, -4000, -5000, -6000]

function VesselTracksLegend(): React.ReactElement | null {
  const vesselsColorBy = useSelector(selectVesselsColorBy)

  const legend = {
    id: vesselsColorBy,
    type: LegendType.ColorRampDiscrete,
    unit: vesselsColorBy === 'speed' ? 'knots' : 'meters',
    values: vesselsColorBy === 'speed' ? SPEEDS : DEPTHS,
    colors: vesselsColorBy === 'speed' ? COLORS : COLORS.slice().reverse(),
  }

  if (vesselsColorBy === 'track') {
    return null
  }

  return (
    <div className={styles.content}>
      <MapLegend layer={legend} />
    </div>
  )
}

export default VesselTracksLegend
