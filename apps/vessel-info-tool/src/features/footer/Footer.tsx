import { useTranslation } from 'react-i18next'

import { Route } from '@/routes/_auth/index'
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
  const searchQuery = Route.useSearch()

  const rowSelection = searchQuery.selectedRows
  const hasSelectedRows = rowSelection && rowSelection.length > 0

  return (
    <div>
      <div className={styles.footer}>
        {/* add action request selector - for ICCAT */}
        {/* add import new file button */}
        {children}
        <Button
          className={styles.downloadButton}
          onClick={() => downloadClick()}
          disabled={!hasSelectedRows}
          tooltip={!hasSelectedRows ? t('footer.select_rows', 'Select vessels to download') : ''}
        >
          {t('footer.download', 'Download all')}
        </Button>
      </div>
    </div>
  )
}

export default Footer
