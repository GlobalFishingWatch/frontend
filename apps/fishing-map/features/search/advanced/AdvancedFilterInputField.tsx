import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { InputText } from '@globalfishingwatch/ui-components'

import { useSearchFiltersConnect, useSearchFiltersErrors } from 'features/search/search.hook'
import type { VesselSearchState } from 'features/search/search.types'

type AdvancedFilterInputFieldProps = {
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void
  field: keyof VesselSearchState
}

function AdvancedFilterInputField({ onChange, field }: AdvancedFilterInputFieldProps) {
  const { t } = useTranslation()
  const searchFilterErrors = useSearchFiltersErrors()
  const { searchFilters } = useSearchFiltersConnect()
  const value = searchFilters[field] || ''
  const invalid = searchFilterErrors[field]

  const PLACEHOLDER_BY_FIELD: Record<string, string> = useMemo(
    () => ({
      ssvid: '123456789, 987654321, ...',
      imo: '1234567, 7654321, ...',
      callsign: 'A1BC2, X2YZ, ...',
      owner: t('search.placeholderFilterMultiple', 'One or more values (comma separated)'),
    }),
    [t]
  )

  return (
    <InputText
      onChange={onChange}
      id={field}
      invalid={invalid}
      invalidTooltip={
        invalid
          ? t('search.filterNotSupported', {
              defaultValue: "One of your sources selected doesn't support filtering by {{filter}}",
              filter: t(`vessel.${field}`, 'field').toLowerCase(),
            })
          : ''
      }
      value={value}
      placeholder={PLACEHOLDER_BY_FIELD[field as string]}
      label={t(`vessel.${field === 'ssvid' ? 'mmsi' : field}`, field)}
    />
  )
}

export default AdvancedFilterInputField
