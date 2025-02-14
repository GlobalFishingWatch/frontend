import styles from './Profile.module.css'

const TabDeprecated = ({ vesselId }: { vesselId: string }) => {
  return (
    <div className={styles.deprecatedContainer}>
      <p className={styles.emptyState}>
        The feature is no longer supported as we phase out this prototype version of Vessel Viewer.
        To access AIS-derived vessel activity, we recommend searching this vessel on the
        <a href={`https://globalfishingwatch.org/map/vessel/${vesselId}`}>
          public Vessel Viewer platform.
        </a>
        .
      </p>
    </div>
  )
}

export default TabDeprecated
