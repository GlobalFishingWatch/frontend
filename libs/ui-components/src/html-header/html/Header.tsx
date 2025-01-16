import React, { Fragment } from 'react'

import navigation from '../Header.links'

interface HeaderProps {
  mini?: boolean
  inverted?: boolean
}

export function Header({ mini = false, inverted = false }: HeaderProps) {
  return (
    <div className={`gfw-header-container ${inverted ? 'gfw-header-container-inverted' : ''}`}>
      <header className="gfw-header">
        <div className="white-bg"></div>
        <a className="app-logo" href="https://globalfishingwatch.org">
          <span className="screen-reader-only">Home</span>
        </a>
        <a className="screen-reader-only" href="#main">
          Skip navigation links
        </a>

        <div className="nav-container">
          <input className="nav-mobile nav-mobile-menu-action" type="checkbox" />
          <div className="nav-mobile nav-mobile-menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className="nav" role="navigation" aria-label="main menu">
            <ul className="nav-list" role="menubar">
              {navigation.map(
                (item, index) =>
                  (!mini || (mini && item.mini)) && (
                    <li key={index} role="menuitem">
                      <a href={item.link}>{item.label}</a>
                      {!mini && item.childs && item.childs.length > 0 && (
                        <Fragment>
                          <input
                            name={`accordion-toggle-${index}`}
                            className="accordion-toggle"
                            type="checkbox"
                          />
                          <ul role="menu" className="nav-list-sub-menu">
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
              <li key="donate" role="menuitem" className="highlight-btn">
                <a href="https://globalfishingwatch.org/donate/">Donate</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  )
}
