'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import cx from 'classnames'
// import type { IconType } from '@globalfishingwatch/ui-components'
import { useTranslation } from 'react-i18next'
import { Icon, IconType } from '@globalfishingwatch/ui-components'
// import { WorkspaceCategories } from 'data/workspaces'
// import HelpModal from 'features/help/HelpModal'
// import LanguageToggle from 'features/i18n/LanguageToggle'
// import WhatsNew from 'features/sidebar/WhatsNew'
// import LocalStorageLoginLink from 'routes/LoginLink'
// import HelpHub from 'features/hints/HelpHub'
import styles from './SidebarMenu.module.css'

type WorkspaceCategories = { id?: string; title: string }

type CategoryTabsProps = {
  categories: WorkspaceCategories[]
}

const CategoryTabs = ({ categories }: CategoryTabsProps) => {
  const { t } = useTranslation()
  const guestUser = true
  const locationCategory = ''

  return (
    <Fragment>
      <ul className={cx('print-hidden', styles.CategoryTabs)}>
        {/* <li
          className={styles.tab}
          onClick={() => {
            console.log('client')
          }}
        >
          <span className={styles.tabContent}>
            <Icon icon="menu" />
          </span>
        </li> */}
        {categories?.map((category, index) => (
          <li
            key={category.title}
            className={cx(styles.tab, {
              [styles.current]: locationCategory === category.title,
              // || (index === 0 && locationType === HOME),
            })}
          >
            <Link className={styles.tabContent} href={`/${category.title}`} title={category.title}>
              <Icon icon={`category-${category.title}` as IconType} />
            </Link>
          </li>
        ))}
        <li className={styles.separator} aria-hidden></li>
        <li className={cx(styles.tab, styles.secondary)}>{/* <WhatsNew /> */}</li>
        <li className={cx(styles.tab, styles.secondary)}>{/* <HelpHub /> */}</li>
        <li className={styles.tab}>{/* <LanguageToggle /> */}</li>
        <li
          className={cx(styles.tab, {
            // [styles.current]: locationType === USER,
          })}
        >
          {guestUser ? null : (
            //   (
            //   <Tooltip content={t('common.login', 'Log in')}>
            //     <Icon icon="user" />
            //     {/* <LocalStorageLoginLink className={styles.loginLink}>
            //     </LocalStorageLoginLink> */}
            //   </Tooltip>
            // )
            <Link href="/user">
              {/* {userData ? initials : <Icon icon="user" className="print-hidden" />} */}
              <Icon icon="user" className="print-hidden" />
            </Link>
          )}
        </li>
      </ul>
      {/* {modalFeedbackOpen && (
        <FeedbackModal
          isOpen={modalFeedbackOpen}
          onClose={() => dispatch(setModalOpen({ id: 'feedback', open: false }))}
        />
      )} */}
    </Fragment>
  )
}

export default CategoryTabs
