import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { DataviewType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Select } from '@globalfishingwatch/ui-components'

import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'

import { useMigramarAreaData, useMigramarOptions } from './reportEnvironmentMigramar.hooks'
import ReportEnvironmentMigramarGraph from './ReportEnvironmentMigramarGraph'

import styles from '../ReportEnvironment.module.css'

// TODO:Migramar make id dynamic
const AREA_ID = 'coco_island_national_park'

function ReportEnvironmentMigramar({ dataview }: { dataview: UrlDataviewInstance<DataviewType> }) {
  const { t, i18n } = useTranslation()
  const { species, indicators, loading: optionsLoading } = useMigramarOptions()
  const { rows, loading: dataLoading } = useMigramarAreaData(AREA_ID)

  const [selectedSpecies, setSelectedSpecies] = useState<SelectOption | undefined>()
  const [selectedIndicator, setSelectedIndicator] = useState<SelectOption | undefined>()

  const speciesOptions: SelectOption[] = useMemo(
    () =>
      species
        .filter((s) => rows.some((r) => r.species === s.id))
        .map((s) => ({ id: s.id, label: i18n.language === 'es' ? s.label_es : s.label_en })),
    [species, rows, i18n.language]
  )

  const indicatorOptions: SelectOption[] = useMemo(
    () =>
      indicators
        .filter((ind) => rows.some((r) => r.indicator === ind.id))
        .map((ind) => ({
          id: ind.id,
          label: i18n.language === 'es' ? ind.label_es_long : ind.label_en_long,
        })),
    [indicators, rows, i18n.language]
  )

  const loading = optionsLoading || dataLoading

  const selectedRow = useMemo(
    () =>
      selectedSpecies && selectedIndicator
        ? rows.find(
            (row) => row.species === selectedSpecies.id && row.indicator === selectedIndicator.id
          )
        : undefined,
    [rows, selectedSpecies, selectedIndicator]
  )

  return (
    <div className={styles.container}>
      <p className={styles.summary}>{t((t) => t.analysis.migramar.title)}</p>
      <div className={styles.migramarSelectors}>
        <Select
          label={t((t) => t.analysis.migramar.species)}
          options={speciesOptions}
          selectedOption={selectedSpecies}
          onSelect={(option) => {
            setSelectedSpecies(option)
            const firstMatch = indicatorOptions.find((ind) =>
              rows.some((r) => r.species === option.id && r.indicator === ind.id)
            )
            setSelectedIndicator(firstMatch)
          }}
          placeholder={loading ? '…' : 'Select a species'}
          disabled={loading}
        />
        <Select
          label={t((t) => t.analysis.migramar.indicator)}
          options={indicatorOptions}
          selectedOption={selectedIndicator}
          onSelect={(option) => {
            setSelectedIndicator(option)
            const firstMatch = speciesOptions.find((sp) =>
              rows.some((r) => r.indicator === option.id && r.species === sp.id)
            )
            setSelectedSpecies(firstMatch)
          }}
          placeholder={loading ? '…' : 'Select an indicator'}
          disabled={loading}
        />
      </div>
      {selectedRow ? (
        <ReportEnvironmentMigramarGraph row={selectedRow} />
      ) : (
        <ReportActivityPlaceholder showHeader={false} />
      )}
      {selectedRow?.data_owner && (
        <p className={styles.disclaimer}>
          <span>
            {t((t) => t.analysis.dataSource)}: {selectedRow.data_owner}
          </span>
          {/* {selectedRow.contact_info && <span>{selectedRow.contact_info}</span>} */}
        </p>
      )}
    </div>
  )
}

export default ReportEnvironmentMigramar
