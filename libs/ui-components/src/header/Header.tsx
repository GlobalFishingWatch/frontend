import React, { Fragment, type JSX } from 'react'
import cx from 'classnames'

import { Icon } from '../icon'

import styles from './Header.module.css'

const navigation = [
  {
    label: 'impact',
    items: [
      {
        label: 'what we do',
        items: [
          { label: '2030 strategy', href: 'https://globalfishingwatch.org/2030-strategy' },
          { label: 'country outreach', href: 'https://globalfishingwatch.org/country-outreach' },
          {
            label: 'global ocean mapping',
            href: 'https://globalfishingwatch.org/global-ocean-mapping',
          },
          {
            label: 'international policy',
            href: 'https://globalfishingwatch.org/international-policy',
          },
          { label: 'our approach', href: 'https://globalfishingwatch.org/our-approach' },
          { label: 'transparency', href: 'https://globalfishingwatch.org/transparency' },
        ],
      },
      {
        label: 'science',
        items: [
          { label: 'projects', href: 'https://globalfishingwatch.org/research-projects' },
          { label: 'publications', href: 'https://globalfishingwatch.org/publications' },
          { label: 'research', href: 'https://globalfishingwatch.org/research' },
        ],
      },
      {
        label: 'highlights',
        items: [
          { label: 'Success Stories', href: 'https://globalfishingwatch.org/success-stories' },
          {
            label: 'Joint Analytical Cell',
            href: 'https://globalfishingwatch.org/joint-analytical-cell',
          },
        ],
      },
    ],
  },

  {
    label: 'technology',
    items: [
      {
        label: 'tools',
        items: [
          { label: 'Our Platform', href: 'https://globalfishingwatch.org/our-platform' },
          { label: 'map', href: 'https://globalfishingwatch.org/our-map' },
          {
            label: 'Marine Manager',
            href: 'https://globalfishingwatch.org/marine-manager-portal',
          },
          {
            label: 'Carrier Vessels',
            href: 'https://globalfishingwatch.org/carrier-vessels-portal',
          },
          { label: 'Vessel Viewer', href: 'https://globalfishingwatch.org/vessel-viewer-tool' },
        ],
      },
      {
        label: 'data',
        items: [
          { label: 'Our APIs', href: 'https://globalfishingwatch.org/our-apis' },
          { label: 'Datasets & Code', href: 'https://globalfishingwatch.org/datasets-and-code' },
        ],
      },
      {
        label: 'help',
        items: [
          { label: 'FAQs', href: 'https://globalfishingwatch.org/help-faqs' },
          { label: 'Platform Updates', href: 'https://globalfishingwatch.org/platform-updates' },
          { label: 'Tutorials', href: 'https://globalfishingwatch.org/tutorials' },
          {
            label: 'User Guide',
            href: 'https://globalfishingwatch.org/user-guide',
          },
        ],
      },
    ],
  },
  { label: 'newsroom', href: 'https://globalfishingwatch.org/newsroom' },
  { label: 'stories & updates', href: 'https://globalfishingwatch.org/stories-and-updates' },
  {
    label: 'about',

    items: [
      {
        label: 'Who we are',
        items: [
          {
            label: 'A Vision for Our Global Ocean',
            href: 'https://globalfishingwatch.org/a-vision-for-our-global-ocean',
          },
          { label: 'Careers', href: 'https://globalfishingwatch.org/careers' },
        ],
      },
      {
        label: 'Leadership',
        items: [
          { label: 'Board of Directors', href: 'https://globalfishingwatch.org/leadership' },
          { label: 'Executive Team', href: 'https://globalfishingwatch.org/executive-team' },
        ],
      },
      {
        label: 'Team',
        items: [{ label: 'Experts', href: 'https://globalfishingwatch.org/experts' }],
      },
      {
        label: 'Reporting',
        items: [
          {
            label: 'Annual Report 2023',
            href: 'https://globalfishingwatch.org/annual-report-2023',
          },
          { label: 'Financials', href: 'https://globalfishingwatch.org/financials' },
        ],
      },
    ],
  },
]

export type MenuItem = {
  className?: string
  href?: string
  label: string | React.ReactNode
  items?: MenuItem[]
  onClick?: React.MouseEventHandler
}

interface HeaderProps {
  children?: React.ReactNode
  inverted?: boolean
}
interface HeaderMenuItemProps {
  index: number
  item: MenuItem
}

export function Header({ children, inverted = false }: HeaderProps) {
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
              {navigation.map((item, index) => HeaderMenuItem({ index, item }))}
              {!!children && children}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  )
}

export function HeaderMenuItem({ index, item }: HeaderMenuItemProps): JSX.Element {
  return (
    <li key={index} role="menuitem" className={styles.navItem}>
      {item.href ? (
        <a href={item.href} onClick={item.onClick} className={styles.itemLabel}>
          {item.label}
        </a>
      ) : (
        <div className={styles.navLabel}>
          <span>{item.label}</span>
          <Icon className={styles.navLabelIcon} icon="arrow-down" />
        </div>
      )}
      {item.items && item.items.length > 0 && (
        <Fragment>
          <input
            name={`accordion-toggle-${index}`}
            className={styles.accordionToggle}
            type="checkbox"
          />
          <ul role="menu" className={cx([styles.navListSubMenu, item.className])}>
            {item.items.map((child, childIndex) => (
              <div className={styles.subNavItem} key={`${index}-child-${childIndex}`}>
                <p className={styles.subNavItemLabel}>{child.label}</p>
                {child.items && child.items.length > 0 && (
                  <ul>
                    {child.items.map((grandChild, grandChildIndex) => (
                      <li key={grandChildIndex}>
                        <a
                          href={grandChild.href}
                          onClick={grandChild.onClick}
                          className={styles.itemLabel}
                        >
                          {grandChild.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ul>
        </Fragment>
      )}
    </li>
  )
}
