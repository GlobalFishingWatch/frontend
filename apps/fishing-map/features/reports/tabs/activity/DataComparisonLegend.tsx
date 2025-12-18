import { getContrastSafeColor } from '@globalfishingwatch/responsive-visualizations'

import styles from './ReportActivityEvolution.module.css'

export default function DataComparisonLegend(props: any) {
  const { payload } = props

  if (payload && payload.length)
    return (
      <div className={styles.legendRow}>
        {payload.map(({ color, payload }: any, index: number) => {
          const safeColor = getContrastSafeColor(color, 'text')
          return (
            <span key={index} style={{ color: safeColor, fontWeight: 500 }}>
              {payload.unit}
            </span>
          )
        })}
      </div>
    )

  return null
}
