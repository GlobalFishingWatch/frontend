import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type { SupportedDatasetSchema } from 'features/datasets/datasets.utils'
import DatasetFlagField from 'features/workspace/shared/DatasetFlagsField'
import DatasetSchemaField from 'features/workspace/shared/DatasetSchemaField'
import DatasetFilterSource from 'features/workspace/shared/DatasetSourceField'

import styles from './ReportSummaryTags.module.css'

type LayerPanelProps = {
  index: number
  dataview: UrlDataviewInstance
  hiddenProperties?: string[]
  availableFields: string[][]
}

export default function ReportSummaryTags({
  dataview,
  hiddenProperties,
  availableFields,
}: LayerPanelProps) {
  const { t } = useTranslation()
  const hasFilters = dataview.config?.filters && Object.keys(dataview.config.filters).length > 0

  const showDot =
    !hiddenProperties?.includes('dataset') ||
    !hiddenProperties?.includes('source') ||
    !hiddenProperties?.includes('flag') ||
    hasFilters

  const areAllPropertiesHidden =
    hiddenProperties?.includes('dataset') &&
    hiddenProperties?.includes('source') &&
    hiddenProperties?.includes('flag') &&
    availableFields.every((f) => hiddenProperties?.includes(f[0]))

  if (areAllPropertiesHidden) {
    // TODO I don't understand that logic
    return null
  }

  return (
    <div className={cx(styles.row)}>
      <div className={cx(styles.content, { [styles.contentDot]: showDot })}>
        {showDot && <span className={styles.dot} style={{ color: dataview.config?.color }} />}
        {!hiddenProperties?.includes('source') && <DatasetFilterSource dataview={dataview} />}
        {!hiddenProperties?.includes('flag') && (
          <DatasetFlagField dataview={dataview} showWhenEmpty />
        )}
        {availableFields.map((field) => {
          return hiddenProperties?.includes(field[0]) ? null : (
            <DatasetSchemaField
              key={field[0]}
              dataview={dataview}
              field={field[0] as SupportedDatasetSchema}
              label={t(field[1] as any, field[2])}
            />
          )
        })}
      </div>
    </div>
  )
}
