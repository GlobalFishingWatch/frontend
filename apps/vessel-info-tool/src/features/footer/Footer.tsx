import { useTranslation } from 'react-i18next'

import { Button } from '@globalfishingwatch/ui-components'

import styles from '../../styles/global.module.css'

function Footer({
  children,
  downloadClick,
}: {
  children?: React.ReactNode
  downloadClick: () => void
}) {
  const { t } = useTranslation()

  return (
    <div>
      <div className={styles.footer}>
        {children}
        <Button className={styles.downloadButton} onClick={() => downloadClick()}>
          {t('footer.download', 'Download all')}
        </Button>
      </div>
    </div>
  )
}

export default Footer
