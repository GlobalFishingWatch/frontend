import styles from './HistogramRangeFilterPlaceholder.module.css'

/** Shown while the layer tiles load, the color scale and the histogram both come from them. */
function HistogramRangeFilterPlaceholder() {
  return (
    <div className={styles.container} data-testid="histogram-range-filter-placeholder">
      <div className={styles.label} />
      <div className={styles.histogram} />
      <div className={styles.slider}>
        <div className={styles.thumb} />
        <div className={styles.track} />
        <div className={styles.thumb} />
      </div>
      <div className={styles.inputs}>
        <div className={styles.input} />
        <div className={styles.input} />
      </div>
    </div>
  )
}

export default HistogramRangeFilterPlaceholder
