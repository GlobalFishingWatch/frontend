import { Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Select } from '@globalfishingwatch/ui-components'

import { selectReportArea } from 'features/_reports/report-area/area-reports.selectors'
import ReportGraphScreenshot from 'features/_reports/shared/download/ReportGraphScreenshot'
import { ReportGraphSummaryArea } from 'features/_reports/shared/download/ReportGraphSummary'
import ReportActivityPlaceholder from 'features/_reports/shared/placeholders/ReportActivityPlaceholder'

import { useMigramar } from './reportEnvironmentMigramar.hooks'
import ReportEnvironmentMigramarGraph from './ReportEnvironmentMigramarGraph'

import styles from '../ReportEnvironment.module.css'

function ReportEnvironmentMigramar() {
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
  const graphRef = useRef<HTMLDivElement>(null)
  const dataSource = graphData?.data_owner && (
    <span>
      {t((t) => t.analysis.dataSource)}: {graphData.data_owner}
    </span>
  )

  return (
    <div className={cx('card', styles.container)}>
      <p className={styles.summary}>
        {t((t) => t.analysis.migramar.title)}
        {graphData && (
          <ReportGraphScreenshot
            graphRef={graphRef}
            name="migramar"
            summary={
              <Fragment>
                <p>
                  <strong>{t((t) => t.analysis.migramar.title)}</strong>
                  <ReportGraphSummaryArea />
                </p>
                <p>
                  {t((t) => t.analysis.migramar.species)}: {effectiveSpecies?.label}
                  {'  -  '}
                  {t((t) => t.analysis.migramar.indicator)}: {effectiveIndicator?.label}
                </p>
                {dataSource && <p>{dataSource}</p>}
              </Fragment>
            }
            legendDataviews={[]}
          />
        )}
      </p>
      {!loading && speciesOptions.length >= 1 && indicatorOptions.length >= 1 && (
        <div className={styles.migramarSelectors}>
          <div>
            <label>{t((t) => t.analysis.migramar.species)}</label>
            {speciesOptions.length === 1 ? (
              <p className={styles.migramarSingleOption}>{effectiveSpecies?.label}</p>
            ) : (
              <Select
                className={styles.migramarSelect}
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
                className={styles.migramarSelect}
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
        <div ref={graphRef}>
          <ReportEnvironmentMigramarGraph row={graphData} />
        </div>
      ) : (
        <ReportActivityPlaceholder showHeader={false}>
          {!loading &&
            speciesOptions.length === 0 &&
            indicatorOptions.length === 0 &&
            t((t) => t.analysis.migramar.noData)}
        </ReportActivityPlaceholder>
      )}
      {dataSource && <p className={styles.disclaimer}>{dataSource}</p>}
    </div>
  )
}

export default ReportEnvironmentMigramar
