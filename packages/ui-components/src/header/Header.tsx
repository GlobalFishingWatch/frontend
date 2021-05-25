import React, { Fragment, memo } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './Header.css'

export type MenuItem = {
  link: string
  label: string
  mini?: boolean
  childs?: MenuItem[]
}

const navigation: MenuItem[] = [
  {
    link: 'https://globalfishingwatch.org/topics/',
    label: 'Topics',
    childs: [
      { link: 'https://globalfishingwatch.org/commercial-fishing/', label: 'Commercial Fishing', childs: [] },
      { link: 'https://globalfishingwatch.org/transshipment/', label: 'Transshipment', childs: [] },
    ],
  },
  {
    link: 'https://globalfishingwatch.org/map-and-data/',
    label: 'Map & dara',
    childs: [
      { link: 'https://globalfishingwatch.org/our-technology/', label: 'Our Technology' },
      { link: 'https://globalfishingwatch.org/our-map/', label: 'Our Map' },
      {
        link: 'https://globalfishingwatch.org/carrier-vessel-portal/',
        label: 'Carrier Vessel Portal',
      },
      { link: 'https://globalfishingwatch.org/datasets-and-code/', label: 'Datasets and Code' },
    ],
  },
  {
    link: 'https://globalfishingwatch.org/programs/',
    label: 'Programs',
    childs: [
      {
        link: 'https://globalfishingwatch.org/research/',
        label: 'Research',
        childs: [
          { link: 'https://globalfishingwatch.org/our-analysis/', label: 'Analysis' },
          { link: 'https://globalfishingwatch.org/publications/', label: 'Publications' },
        ],
      },
      {
        link: 'https://globalfishingwatch.org/transparency/',
        label: 'Transparency',
        childs: [
          {
            link: 'https://globalfishingwatch.org/transparency-program-africa/',
            label: 'Africa',
          },
          { link: 'https://globalfishingwatch.org/transparency-program-asia/', label: 'Asia' },
          {
            link: 'https://globalfishingwatch.org/transparency-program-latin-america/',
            label: 'Latin America',
          },
          {
            link: 'https://globalfishingwatch.org/transparency-program-mediterranean/',
            label: 'Mediterranean',
          },
          {
            link: 'https://globalfishingwatch.org/transparency-program-pacific/',
            label: 'Pacific',
          },
        ],
      },
    ],
  },
  {
    link: 'https://globalfishingwatch.org/newsroom/',
    label: 'Newsroom',
    childs: [
      { link: 'https://globalfishingwatch.org/blog/', label: 'Blog' },
      { link: 'https://globalfishingwatch.org/multimedia/', label: 'Multimedia' },
    ],
  },
  {
    link: 'https://globalfishingwatch.org/about-us/',
    label: 'About us',
    mini: true,
    childs: [
      { link: 'https://globalfishingwatch.org/leadership/', label: 'Board of Directors' },
      { link: 'https://globalfishingwatch.org/meet-the-team/', label: 'Team' },
      { link: 'https://globalfishingwatch.org/careers/', label: 'Careers' },
      { link: 'https://globalfishingwatch.org/financials/', label: 'Financials' },
    ],
  },
  {
    link: 'https://globalfishingwatch.org/help-faqs/"',
    label: 'Help',
    childs: [
      { link: 'https://globalfishingwatch.org/help-faqs/', label: 'FAQ' },
      { link: 'https://globalfishingwatch.org/tutorials/', label: 'Tutorials' },
      { link: 'https://globalfishingwatch.org/contact-us/', label: 'Contact Us' },
    ],
  },
]

interface HeaderProps {
  mini?: boolean
  inverted?: boolean
  languages?: boolean
}

function Header({ mini = false, inverted = false, languages = true }: HeaderProps) {
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
                      <a href={item.link} aria-haspopup="true">
                        {item.label}
                      </a>
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
              {languages && (
                <li role="menuitem" id="bablic-languages-container" style={{ display: 'none' }}>
                  <a id="bablic-languages-title" href="#" aria-haspopup="true">
                    Languages
                  </a>
                  <input
                    name="accordion-toggle-languages"
                    className="accordion-toggle"
                    type="checkbox"
                  />
                  <ul role="menu" id="bablic-languages" className="nav-list-sub-menu"></ul>
                </li>
              )}
              <li key="donate" role="menuitem" className="highlight-btn">
                <a href="https://globalfishingwatch.org/donate/" aria-haspopup="true">
                  Donate
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default memo(Header)
