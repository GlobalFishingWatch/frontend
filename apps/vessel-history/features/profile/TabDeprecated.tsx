import cx from 'classnames'

import type { VesselWithHistory } from 'types'

import styles from './Profile.module.css'

const TabDeprecated = ({
  vessel,
  vesselId,
  fullHeight = true,
}: {
  vessel?: VesselWithHistory
  vesselId: string
  fullHeight?: boolean
}) => {
  const href = vessel?.mmsi
    ? `https://globalfishingwatch.org/map/vessel-search?sO=advanced&ssvid=${vessel.mmsi}`
    : `https://globalfishingwatch.org/map/vessel/${vesselId}`
  return (
    <div className={cx(styles.deprecatedContainer, { [styles.deprecatedFullHeight]: fullHeight })}>
      <p className={styles.emptyState}>
        The feature is no longer supported as we phase out this prototype version of Vessel Viewer.
        <br />
        To access AIS-derived vessel activity, we recommend searching this vessel on the
        <br />
        <a href={href}>public Vessel Viewer platform.</a>.
      </p>
    </div>
  )
}

export default TabDeprecated
