import React, { Fragment, memo } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './Header.css'

const navigation = [
  {
    link: 'https://globalfishingwatch.org/map-and-data/',
    label: 'Map & data',
    childs: [
      { link: 'https://globalfishingwatch.org/our-map/', label: 'Our map' },
      { link: 'https://globalfishingwatch.org/join/', label: 'Map sign up' },
      { link: 'https://globalfishingwatch.org/map-and-data/technology/', label: 'How it works' },
      { link: 'https://globalfishingwatch.org/faqs/', label: 'Help hub' },
      { link: 'https://globalfishingwatch.org/datasets-and-code/', label: 'Datasets and code' },
    ],
  },
  {
    link: 'https://globalfishingwatch.org/faqs/',
    label: 'Help',
  },
  {
    link: 'https://globalfishingwatch.org/research/',
    label: 'Research',
    childs: [
      { link: 'https://globalfishingwatch.org/research-partners/', label: 'Research partners' },
      { link: 'https://globalfishingwatch.org/publications/', label: 'Publications' },
    ],
  },
  {
    link: 'https://globalfishingwatch.org/news/',
    label: 'News & Blog',
    childs: [
      { link: 'https://globalfishingwatch.org/news/press-centre/', label: 'Press centre' },
      { link: 'https://globalfishingwatch.org/blog/', label: 'Blog' },
      {
        link: 'https://globalfishingwatch.org/new-and-views/highlights/',
        label: 'Media highlights',
      },
    ],
  },
  {
    link: 'https://globalfishingwatch.org/get-involved/',
    label: 'Get involved',
    childs: [
      {
        link: 'https://globalfishingwatch.org/transparency-makes-a-difference/',
        label: 'Share your story',
      },
      { link: 'https://globalfishingwatch.org/join/', label: 'Newsletter sign up' },
      { link: 'https://globalfishingwatch.force.com/gfw', label: 'Discussion forum' },
      { link: 'https://globalfishingwatch.org/work-for-us/', label: 'Work for us' },
      { link: 'https://globalfishingwatch.org/contact-us', label: 'Contact us' },
    ],
  },
  {
    link: 'https://globalfishingwatch.org/about-us/',
    label: 'About us',
    mini: true,
    childs: [
      { link: 'https://globalfishingwatch.org/programs/', label: 'Programs' },
      { link: 'https://globalfishingwatch.org/leadership/', label: 'Leadership' },
      { link: 'https://globalfishingwatch.org/partners/', label: 'Partners' },
      { link: 'https://globalfishingwatch.org/meet-the-team/', label: 'Meet the team' },
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
        <a className="app-logo" href="http://globalfishingwatch.org">
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
