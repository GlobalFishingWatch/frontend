import React, { Fragment, type JSX } from 'react'
import cx from 'classnames'

import type { MenuItem } from './Header.links'
import navigation from './Header.links'

import styles from './Header.module.css'

interface HeaderProps {
  children?: React.ReactNode
  mini?: boolean
  inverted?: boolean
}
interface HeaderMenuItemProps {
  index: number
  item: MenuItem
  mini?: boolean
}

export function Header({ children, mini = false, inverted = false }: HeaderProps) {
  return (
    <div
      className={cx(styles.gfwHeaderContainer, { [styles.gfwHeaderContainerInverted]: inverted })}
    >
      <header className={styles.gfwHeader}>
        <div className={styles.whiteBg}></div>
        <a className={styles.appLogo} href="https://globalfishingwatch.org">
          <span className={styles.screenReaderOnly}>Home</span>
        </a>
        <a className={styles.screenReaderOnly} href="#main">
          Skip navigation links
        </a>

        <div className={styles.navContainer}>
          <input className={cx(styles.navMobile, styles.navMobileMenuAction)} type="checkbox" />
          <div className={cx(styles.navMobile, styles.navMobileMenuIcon)}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className={styles.nav} role="navigation" aria-label="main menu">
            <ul className={styles.navList} role="menubar">
              {navigation.map(
                (item, index) =>
                  (!mini || (mini && item.mini)) && HeaderMenuItem({ index, item, mini })
              )}
              {!!children && children}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  )
}

export function HeaderMenuItem({ index, item, mini = false }: HeaderMenuItemProps): JSX.Element {
  return (
    <li key={index} role="menuitem" className={item.className}>
      {((item.link || item.onClick) && (
        <a href={item.link} onClick={item.onClick}>
          {item.label}
        </a>
      )) || <div>{item.label}</div>}
      {!mini && item.childs && item.childs.length > 0 && (
        <Fragment>
          <input
            name={`accordion-toggle-${index}`}
            className={styles.accordionToggle}
            type="checkbox"
          />
          <ul role="menu" className={cx([styles.navListSubMenu, item.className])}>
            {item.childs.map((child, childIndex) => (
              <HeaderMenuItem
                key={`${index}-child-${childIndex}`}
                index={childIndex}
                item={child}
                mini={mini}
              />
            ))}
          </ul>
        </Fragment>
      )}
    </li>
  )
}
