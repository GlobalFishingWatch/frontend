import styles from './ReportActivityEvolution.module.css'

export default function DataComparisonLegend(props: any) {
  const { payload } = props

  if (payload && payload.length)
    return (
      <div className={styles.legendRow}>
        {payload.map(({ color, payload }: any, index: number) => {
          return (
            <div key={index}>
              <span className={styles.tooltipValueDot} style={{ color }}></span>
              {payload.unit}
            </div>
          )
        })}
      </div>
    )

  return null
}
