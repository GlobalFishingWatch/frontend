import React, { useState } from 'react'
import Table from 'features/table/Table'
import styles from './Sidebar.module.css'
import SidebarHeader from './SidebarHeader'

type SidebarProps = {
  onMenuClick: () => void
}

function Sidebar({ onMenuClick }: SidebarProps) {
  const [country, setCountry]  = useState<string|null>('URY')
  
  return (
    <div className={styles.container}>
      <div className="scrollContainer">
        <SidebarHeader onCountryChange={setCountry}/>
        <Table country={country}></Table>
      </div>
    </div>
  )
}

export default Sidebar
