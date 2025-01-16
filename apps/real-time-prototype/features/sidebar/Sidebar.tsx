import { DateTime } from 'luxon'

import { Spinner, Switch, Tooltip } from '@globalfishingwatch/ui-components'

import ContextLayersSection from 'features/sidebar/ContextLayersSection'
import VesselsSection from 'features/sidebar/VesselsSection'
import { getTimeAgo } from 'utils/dates'

import SidebarHeader from './SidebarHeader'

import styles from './Sidebar.module.css'

function Sidebar({ lastUpdate, showLatestPositions, setShowLatestPositions }) {
  const formattedLastUpdate = DateTime.fromISO(lastUpdate, { zone: 'utc' }).plus({ hours: 1 })
  return (
    <div className={styles.container}>
      <div className="scrollContainer">
        <SidebarHeader />
        <div className={styles.row}>
          <div className={styles.header}>
            <Switch
              className={styles.switch}
              active={showLatestPositions}
              onClick={() => setShowLatestPositions(!showLatestPositions)}
            />
            <span>LATEST POSITIONS</span>
          </div>
          <label>Last data update</label>
          {lastUpdate ? (
            <Tooltip content={formattedLastUpdate.toLocaleString(DateTime.DATETIME_FULL)}>
              <span>{getTimeAgo(formattedLastUpdate)}</span>
            </Tooltip>
          ) : (
            <Spinner size="small" />
          )}
        </div>
        <VesselsSection lastUpdate={lastUpdate} />
        <ContextLayersSection />
      </div>
    </div>
  )
}

export default Sidebar
