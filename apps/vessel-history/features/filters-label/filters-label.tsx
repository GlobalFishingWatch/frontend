import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'lodash'
import { DateTime } from 'luxon'

import type { Filters } from 'features/event-filters/filters.slice'
import { formatI18nDate } from 'features/i18n/i18nDate'

import styles from './filters-label.module.css'

export interface FiltersLabelProps {
  filters?: Partial<Filters>
}

export function FiltersLabel({ filters = {} }: FiltersLabelProps) {
  const { t } = useTranslation()

  const filtersLabel = useMemo(() => {
    return (
      (Object.keys(filters) as (keyof Filters)[])
        // Exclude filters without value or false
        .filter((key) => !!filters[key])
        .map((key) => ({
          key,
          value: filters[key],
        }))
        .map(({ key, value }) => {
          if (['start', 'end'].includes(key)) {
            return `${capitalize(t(`filters.${key}` as any, key))}: ${formatI18nDate(
              value as string,
              {
                format: DateTime.DATE_SHORT,
              }
            )}`
          } else {
            return `${t(`settings.${key}.shortTitle` as any, key)}`
          }
        })
        .join(', ')
    )
  }, [filters, t])

  return <span className={styles.label}>{filtersLabel}</span>
}

export default FiltersLabel
