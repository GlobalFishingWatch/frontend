import styles from './Profile.module.css'

const TabDeprecated = ({ vesselId }: { vesselId: string }) => {
  return (
    <div className={styles.deprecatedContainer}>
      <p className={styles.emptyState}>
        This application is in process of being deprecated. Please use{' '}
        <a href={`https://globalfishingwatch.org/map/vessel/${vesselId}`}>the new one</a>.
      </p>
    </div>
  )
}

export default TabDeprecated
