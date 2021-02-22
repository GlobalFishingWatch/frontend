import React, { Fragment, useState } from 'react'
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
import { SearchFilter } from 'features/search/search.slice'
import styles from './Report.module.css'
import FishingActivity from './FishingActivity'
import ReportLayerPanel from './ReportLayerPanel'
import { createReportThunk, DateRange } from './report.slice'

type ReportPanelProps = {
  type: string
}

function Report({ type }: ReportPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { dispatchQueryParams } = useLocationConnect()
  const staticTime = useSelector(selectStaticTime)
  const dataviews = useSelector(selectTemporalgridDataviews) || []

  if (!staticTime) {
    return <Fragment />
  }
  const dateRange: DateRange = staticTime
  const onCloseClick = () => {
    batch(() => {
      dispatch(resetWorkspaceReportQuery())
      dispatchQueryParams({ report: undefined })
    })
  }

  const mockedGeometry: GeoJSON.Polygon = {
    type: 'Polygon',
    coordinates: [
      [
        [0.164794921875, 38.53097889440024],
        [4.482421875, 38.53097889440024],
        [4.482421875, 40.111688665595956],
        [0.164794921875, 40.111688665595956],
        [0.164794921875, 38.53097889440024],
      ],
    ],
  }

  const onGenerateClick = async () => {
    setLoading(true)
    batch(() => {
      dataviews.forEach(async (dataview) => {
        const result = await dispatch(
          createReportThunk({
            name: `${dataview.name} - ${t('common.report', 'Report')}`,
            dateRange: dateRange,
            filters: dataview.config?.filters as SearchFilter,
            datasets: dataview?.config?.datasets || [],
            geometry: mockedGeometry,
          })
        )
        console.log(result)
      })
    })
    setLoading(false)
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
        <Button className={styles.saveBtn} onClick={onGenerateClick} loading={loading}>
          {t('report.generate', 'Generate Report')}
        </Button>
      </div>
    </div>
  )
}

export default Report
