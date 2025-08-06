import { Logo } from '@globalfishingwatch/ui-components'

import { useTableFilters } from '../dynamicTable/hooks/useTableFilters'
import DynamicFilters, { FilterState } from '../filter/DynamicFilters'

import styles from './SidebarHeader.module.css'

function SidebarHeader({ children }: { children?: React.ReactNode }) {
  return (
    <div className={styles.sticky}>
      <div className={styles.sidebarHeader}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} />
        </a>
        {children}
      </div>
    </div>
  )
}

export default SidebarHeader
