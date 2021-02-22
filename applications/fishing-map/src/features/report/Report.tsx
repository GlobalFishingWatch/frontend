import React from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { batch, useDispatch, useSelector } from 'react-redux'
import { Button, IconButton } from '@globalfishingwatch/ui-components'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { resetWorkspaceReportQuery } from 'features/workspace/workspace.slice'
import { useLocationConnect } from 'routes/routes.hook'
import sectionStyles from 'features/workspace/shared/Sections.module.css'
import { selectStaticTime } from 'features/timebar/timebar.slice'
import { selectTemporalgridDataviews } from 'features/workspace/workspace.selectors'
import styles from './Report.module.css'
import FishingActivity from './FishingActivity'
import ReportLayerPanel from './ReportLayerPanel'

type ReportPanelProps = {
  type: string
}

function Report({ type }: ReportPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const staticTime = useSelector(selectStaticTime)
  const dataviews = useSelector(selectTemporalgridDataviews) || []

  const onCloseClick = () => {
    batch(() => {
      // dispatch(resetFilters())
      // dispatch(cleanVesselSearchResults())
      dispatch(resetWorkspaceReportQuery())
      dispatchQueryParams({ report: undefined })
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.report', 'Report')}</h2>
        <div className={cx('print-hidden', sectionStyles.sectionButtons)}>
          <IconButton
            icon="close"
            onClick={onCloseClick}
            type="border"
            tooltip={t('report.close', 'Close report')}
            tooltipPlacement="bottom"
          />
        </div>
      </div>
      <div className={styles.content}>
        <FishingActivity dataviews={dataviews} staticTime={staticTime} />
      </div>
      <div className={styles.footer}>
        <Button
          className={styles.errorBtn}
          onClick={async () => {
            // dispatch(logoutUserThunk({ redirectToLogin: true }))
            console.log('generate report')
          }}
        >
          {t('report.generate', 'Generate')}
        </Button>
      </div>
    </div>
  )
}

export default Report
