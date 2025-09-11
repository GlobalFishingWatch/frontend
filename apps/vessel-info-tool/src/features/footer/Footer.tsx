import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Button } from '@globalfishingwatch/ui-components'

import type { RootState } from 'store'

import styles from '../../styles/global.module.css'

function Footer({
  children,
  downloadClick,
}: {
  children?: React.ReactNode
  downloadClick: () => void
}) {
  const { t } = useTranslation()
  const rowSelection = useSelector((state: RootState) => state.table.selectedRows)
  const hasSelectedRows = Object.keys(rowSelection).length > 0

  return (
    <div>
      <div className={styles.footer}>
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
