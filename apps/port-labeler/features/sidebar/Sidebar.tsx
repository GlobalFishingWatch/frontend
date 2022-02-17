import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Table from 'features/table/Table'
import { selectSelectedPoints } from 'features/labeler/labeler.slice'
import styles from './Sidebar.module.css'
import SidebarHeader from './SidebarHeader'

type SidebarProps = {
  onMenuClick: () => void
}

function Sidebar({ onMenuClick }: SidebarProps) {

  console.log(useSelector(selectSelectedPoints))

  return (
    <div className={styles.container}>
      <div className="scrollContainer">
        <SidebarHeader/>
        <Table></Table>
      </div>
    </div>
  )
}

export default Sidebar
