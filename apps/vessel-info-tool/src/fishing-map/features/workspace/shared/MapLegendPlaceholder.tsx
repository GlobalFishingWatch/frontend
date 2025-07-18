import styles from './MapLegendPlaceholder.module.css'

export default function MapLegendPlaceholder() {
  return (
    <div className={styles.container}>
      <div style={{ width: '6rem' }} className={styles.block} />
      <div style={{ width: '100%' }} className={styles.block} />
      <div style={{ width: 'calc(100% - 3rem)' }} className={styles.flex}>
        <div style={{ width: '2rem' }} className={styles.block} />
        <div style={{ width: '2rem' }} className={styles.block} />
        <div style={{ width: '2rem' }} className={styles.block} />
        <div style={{ width: '2rem' }} className={styles.block} />
        <div style={{ width: '2rem' }} className={styles.block} />
      </div>
    </div>
  )
}
