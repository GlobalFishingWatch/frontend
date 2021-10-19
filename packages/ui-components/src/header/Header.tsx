import React, { Fragment } from 'react'
import cx from 'classnames'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './Header.module.css'
import navigation from './Header.links'

interface HeaderProps {
  mini?: boolean
  inverted?: boolean
}

export function Header({ mini = false, inverted = false }: HeaderProps) {
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
                  (!mini || (mini && item.mini)) && (
                    <li key={index} role="menuitem">
                      <a href={item.link}>{item.label}</a>
                      {!mini && item.childs && item.childs.length > 0 && (
                        <Fragment>
                          <input
                            name={`accordion-toggle-${index}`}
                            className={styles.accordionToggle}
                            type="checkbox"
                          />
                          <ul role="menu" className={styles.navListSubMenu}>
                            {item.childs.map((child, index) => (
                              <li key={index} role="menuitem">
                                <a href={child.link}>
                                  <span>{child.label}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </Fragment>
                      )}
                    </li>
                  )
              )}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  )
}
