import { DateTime } from 'luxon'
import { Spinner, Tooltip } from '@globalfishingwatch/ui-components'
import ContextLayersSection from 'features/sidebar/ContextLayersSection'
import VesselsSection from 'features/sidebar/VesselsSection'
import { getTimeAgo } from 'utils/dates'
import SidebarHeader from './SidebarHeader'
import styles from './Sidebar.module.css'

function Sidebar({ lastUpdate }) {
  const formattedLastUpdate = DateTime.fromISO(lastUpdate, { zone: 'utc' }).plus({ hours: 1 })
  return (
    <div className={styles.container}>
      <div className="scrollContainer">
        <SidebarHeader />
        <div className={styles.row}>
          <label>Last update</label>
          {lastUpdate ? (
            <Tooltip content={formattedLastUpdate.toLocaleString(DateTime.DATETIME_FULL)}>
              <span>{getTimeAgo(formattedLastUpdate)}</span>
            </Tooltip>
          ) : (
            <Spinner size="small" />
          )}
        </div>
        <VesselsSection />
        <ContextLayersSection />
      </div>
    </div>
  )
}

export default Sidebar
