import cx from 'classnames'
import { Icon, IconType } from '@globalfishingwatch/ui-components'
import { WorkspaceCategory } from 'data/workspaces'
import styles from './CategoryTabs.module.css'

const categories = ['fishing-activity' as WorkspaceCategory, 'marine-manager' as WorkspaceCategory]
function CategoryTabsServer({ category }: { category?: WorkspaceCategory }) {
  return (
    <ul className={cx('print-hidden', styles.CategoryTabs)}>
      <li className={styles.tab}>
        <span className={styles.tabContent}>
          <Icon icon="menu" />
        </span>
      </li>
      {categories?.map((cat) => (
        <li
          key={cat}
          className={cx(styles.tab, {
            [styles.current]: cat === category,
          })}
        >
          <Icon icon={`category-${cat}` as IconType} />
        </li>
      ))}
      <li className={styles.separator} aria-hidden></li>
      <li className={cx(styles.tab, styles.secondary)}>
        <Icon icon="sparks" />
      </li>
      <li className={cx(styles.tab, styles.secondary)}>
        <Icon icon="help" />
      </li>
      <li className={cx(styles.tab, styles.secondary)}>
        <Icon icon="feedback" />
      </li>
      <li className={styles.tab}>
        <Icon icon="language" />
      </li>
      <li className={cx(styles.tab)}>
        <Icon icon="user" />
      </li>
    </ul>
  )
}

export default CategoryTabsServer
