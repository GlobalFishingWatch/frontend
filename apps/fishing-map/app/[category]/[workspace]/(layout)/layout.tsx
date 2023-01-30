import React from 'react'
import ClientSplitView from 'app/features/sidebar/SplitView.client'
import SidebarMenu from 'app/features/sidebar/SidebarMenu'
import styles from './layout.module.css'

async function ReportLayout({ children }) {
  const readOnly = false
  return (
    <ClientSplitView>
      <div className={styles.container}>
        {!readOnly && <SidebarMenu />}
        {/* New dataset modal is used in user and workspace pages*/}
        <div className="scrollContainer">{children}</div>
      </div>
    </ClientSplitView>
  )
}

export default ReportLayout
