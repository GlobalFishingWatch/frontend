import React, { useState } from 'react'
import cx from 'classnames'

import { Button } from '../button'
import type { ButtonSize } from '../button/Button'

import type { Tab } from '.'

import styles from './Tabs.module.css'

export interface TabsProps<TabID = string> {
  tabs: Tab<TabID>[]
  activeTab?: TabID
  onTabClick?: (tab: Tab<TabID>, e: React.MouseEvent) => void
  mountAllTabsOnLoad?: boolean
  className?: string
  tabClassName?: string
  headerClassName?: string
  buttonSize?: ButtonSize
}

export function Tabs<TabID = string>({
  activeTab,
  tabs,
  onTabClick,
  mountAllTabsOnLoad = false,
  className = '',
  tabClassName = '',
  headerClassName = '',
  buttonSize = 'default',
}: TabsProps<TabID>) {
  const activeTabId = activeTab || tabs?.[0]?.id
  const [activeTabs, setActiveTabs] = useState<TabID[]>(() =>
    activeTabId !== undefined ? [activeTabId] : []
  )
  const loadedTabs =
    activeTabId !== undefined && !activeTabs.includes(activeTabId)
      ? [...activeTabs, activeTabId]
      : activeTabs

  const handleTabClick = (tab: Tab<TabID>, e: React.MouseEvent) => {
    setActiveTabs((previousActiveTabs) => {
      if (previousActiveTabs.includes(tab.id)) {
        return previousActiveTabs
      }

      return [...previousActiveTabs, tab.id]
    })
    if (onTabClick) {
      onTabClick(tab, e)
    }
  }
  return (
    <div className={cx(styles.container, className)}>
      <ul className={cx(styles.header, headerClassName)} role="tablist">
        {tabs.map((tab, index) => {
          const tabSelected = activeTabId === tab.id
          const selectedIndex = tabs.findIndex((t) => t.id === activeTabId)
          const showBorder =
            index !== selectedIndex && index !== selectedIndex - 1 && index !== tabs.length - 1
          return (
            <li
              key={tab.id as unknown as string}
              className={styles.tab}
              role="tab"
              aria-controls={tab.id as unknown as string}
              tabIndex={index}
              aria-selected={tabSelected}
            >
              <Button
                className={cx(styles.tabButton, {
                  [styles.tabActive]: tabSelected,
                  [styles.border]: showBorder,
                })}
                type="secondary"
                tooltip={tab.tooltip}
                tooltipPlacement={tab.tooltipPlacement}
                disabled={tab.disabled}
                onClick={(e) => handleTabClick(tab, e)}
                size={buttonSize || 'default'}
                testId={tab.testId}
              >
                {tab.title}
              </Button>
            </li>
          )
        })}
      </ul>
      {tabs.map((tab) => {
        if (tab.disabled) {
          return null
        }
        const tabSelected = activeTabId === tab.id
        if ((mountAllTabsOnLoad || tabSelected || loadedTabs.includes(tab.id)) && tab.content) {
          return (
            // eslint-disable-next-line jsx-a11y/role-supports-aria-props
            <div
              key={tab.id as unknown as string}
              id={tab.id as unknown as string}
              role="tabpanel"
              aria-expanded={tabSelected}
              className={cx(styles.content, tabClassName, {
                [styles.contentActive]: tabSelected,
              })}
            >
              {tab.content}
            </div>
          )
        }
        return null
      })}
    </div>
  )
}
