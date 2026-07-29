import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { DataviewType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Select } from '@globalfishingwatch/ui-components'

import { selectReportArea } from 'features/reports/report-area/area-reports.selectors'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'

import { useMigramar } from './reportEnvironmentMigramar.hooks'
import ReportEnvironmentMigramarGraph from './ReportEnvironmentMigramarGraph'

import styles from '../ReportEnvironment.module.css'

function ReportEnvironmentMigramar({ dataview }: { dataview: UrlDataviewInstance<DataviewType> }) {
  const { t } = useTranslation()
  const reportArea = useSelector(selectReportArea)
  const {
    speciesOptions,
    indicatorOptions,
    effectiveSpecies,
    effectiveIndicator,
    selectSpecies,
    selectIndicator,
    graphData,
    loading,
  } = useMigramar(reportArea?.properties?.id)

  return (
    <div className={cx('card', styles.container)}>
      <p className={styles.summary}>{t((t) => t.analysis.migramar.title)}</p>
      {!loading && speciesOptions.length >= 1 && indicatorOptions.length >= 1 && (
        <div className={styles.migramarSelectors}>
          <div>
            <label>{t((t) => t.analysis.migramar.species)}</label>
            {speciesOptions.length === 1 ? (
              <p className={styles.migramarSingleOption}>{effectiveSpecies?.label}</p>
            ) : (
              <Select
                options={speciesOptions}
                selectedOption={effectiveSpecies}
                onSelect={selectSpecies}
                placeholder={loading ? '…' : t((t) => t.analysis.migramar.selectSpecies)}
                disabled={loading}
              />
            )}
          </div>
          <div>
            <label>{t((t) => t.analysis.migramar.indicator)}</label>
            {indicatorOptions.length === 1 ? (
              <p className={styles.migramarSingleOption}>{effectiveIndicator?.label}</p>
            ) : (
              <Select
                options={indicatorOptions}
                selectedOption={effectiveIndicator}
                onSelect={selectIndicator}
                placeholder={loading ? '…' : t((t) => t.analysis.migramar.selectIndicator)}
                disabled={loading}
              />
            )}
          </div>
        </div>
      )}
      {graphData ? (
        <ReportEnvironmentMigramarGraph row={graphData} />
      ) : (
        <ReportActivityPlaceholder showHeader={false}>
          {!loading &&
            speciesOptions.length === 0 &&
            indicatorOptions.length === 0 &&
            t((t) => t.analysis.migramar.noData)}
        </ReportActivityPlaceholder>
      )}
      {graphData?.data_owner && (
        <p className={styles.disclaimer}>
          <span>
            {t((t) => t.analysis.dataSource)}: {graphData.data_owner}
          </span>
        </p>
      )}
    </div>
  )
}

export default ReportEnvironmentMigramar
