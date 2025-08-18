import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton, TagList } from '@globalfishingwatch/ui-components'

import { getSchemaFiltersInDataview } from 'features/datasets/datasets.utils'
import { selectIsGlobalReportsEnabled } from 'features/debug/debug.selectors'
import { selectReportCategory } from 'features/reports/reports.selectors'
import { ReportCategory } from 'features/reports/reports.types'
import DatasetSchemaField from 'features/workspace/shared/DatasetSchemaField'
import DatasetFilterSource from 'features/workspace/shared/DatasetSourceField'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import Filters from 'features/workspace/shared/LayerFilters'

import styles from './ReportSummaryTags.module.css'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

export default function ReportSummaryTags({ dataview }: LayerPanelProps) {
  const { t } = useTranslation()
  const isGlobalReportsEnabled = useSelector(selectIsGlobalReportsEnabled)
  const reportCategory = useSelector(selectReportCategory)

  const [filtersUIOpen, setFiltersUIOpen] = useState(false)

  const onToggleFiltersUIOpen = () => {
    setFiltersUIOpen(!filtersUIOpen)
  }

  const { filtersAllowed } = getSchemaFiltersInDataview(dataview)

  return (
    <div className={styles.row}>
      <div className={styles.actionsContainer}>
        <span className={styles.dot} style={{ color: dataview.config?.color }} />
        {isGlobalReportsEnabled && (
          <ExpandedContainer
            onClickOutside={onToggleFiltersUIOpen}
            visible={filtersUIOpen}
            className={styles.expandedContainer}
            component={<Filters dataview={dataview} onConfirmCallback={onToggleFiltersUIOpen} />}
          >
            <IconButton
              icon={filtersUIOpen ? 'filter-on' : 'filter-off'}
              size="small"
              onClick={onToggleFiltersUIOpen}
              className={cx(styles.printHidden, styles.filterButton)}
              tooltip={filtersUIOpen ? t('layer.filterClose') : t('layer.filterOpen')}
              tooltipPlacement="top"
            />
          </ExpandedContainer>
        )}
      </div>
      <Fragment>
        {(reportCategory === ReportCategory.Activity ||
          reportCategory === ReportCategory.Detections ||
          reportCategory === ReportCategory.Others) && (
          <Fragment>
            <DatasetFilterSource dataview={dataview} className={styles.tag} />
            {filtersAllowed.map(({ id, label }) => (
              <DatasetSchemaField
                key={id}
                dataview={dataview}
                field={id}
                label={label}
                className={styles.tag}
              />
            ))}
          </Fragment>
        )}
        {reportCategory === ReportCategory.Environment ? (
          dataview.config?.minVisibleValue || dataview.config?.maxVisibleValue ? (
            <DatasetSchemaField
              key={'visibleValues'}
              dataview={dataview}
              field={'visibleValues'}
              label={t('common.visibleValues')}
              removeType="visibleValues"
            />
          ) : (
            <div className={styles.filter}>
              <label>{t('common.visibleValues')}</label>
              <TagList
                tags={[{ id: 'all', label: t('selects.allSelected') }]}
                color={dataview.config?.color}
                className={styles.tagList}
              />
            </div>
          )
        ) : null}
      </Fragment>
    </div>
  )
}
