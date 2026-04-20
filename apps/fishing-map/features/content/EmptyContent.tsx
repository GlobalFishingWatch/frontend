import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import ContentHeader from 'features/content/ContentHeader'

import styles from './ContentPanel.module.css'

function EmptyContent() {
  const { t } = useTranslation()

  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles.header)}>
        <ContentHeader />
      </div>
      <div className={cx(styles.scrollContainer)}>
        <div className={cx(styles.content)}>
          <p>
            {t((t) => t.common.noData, {
              ns: 'translations',
              defaultValue: 'No content available',
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default EmptyContent
