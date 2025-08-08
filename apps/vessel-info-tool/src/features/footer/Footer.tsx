import { t } from 'i18next'

import { Button } from '@globalfishingwatch/ui-components'

import styles from './Footer.module.css'

function Footer({
  children,
  downloadClick,
}: {
  children?: React.ReactNode
  downloadClick: () => void
}) {
  return (
    <div className={styles.sticky}>
      <div className={styles.footer}>
        {children}
        <Button onClick={() => downloadClick()}>{t('footer.buttonText')}</Button>
      </div>
    </div>
  )
}

export default Footer
