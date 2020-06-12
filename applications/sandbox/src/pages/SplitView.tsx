import React, { useState } from 'react'
import SplitView from '@globalfishingwatch/ui-components/src/split-view'
import Components from './Components'

const SplitViewPage = () => {
  const [open, setOpen] = useState<boolean>(true)
  const aside = (
    <ul className="sidebar">
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
      <li>Sidebar</li>
    </ul>
  )
  const main = <Components />
  return (
    <SplitView
      isOpen={open}
      onToggle={() => setOpen(!open)}
      aside={aside}
      main={main}
      asideWidth="50%"
      className="split-container"
    />
  )
}

export default SplitViewPage
