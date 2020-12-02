import React, { useMemo } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import MultiSelect, { MultiSelectOption } from '@globalfishingwatch/ui-components/dist/multi-select'
import { InputText } from '@globalfishingwatch/ui-components'
import { getFlags } from 'utils/flags'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import useClickedOutside from 'hooks/use-clicked-outside'
import { GearType, GEAR_TYPES } from 'data/datasets'
import { useSearchFiltersConnect } from './search.hook'
import styles from './SearchFilters.module.css'

type SearchFiltersProps = {
  className?: string
}

function SearchFilters({ className = '' }: SearchFiltersProps) {
  const { t } = useTranslation()
  const { searchFilters, setSearchFiltersOpen, setSearchFilters } = useSearchFiltersConnect()
  const { flags, gearTypes } = searchFilters
  const flagOptions = useMemo(getFlags, [])

  const expandedContainerRef = useClickedOutside(() => setSearchFiltersOpen(false))

  return (
    <div className={cx(className)} ref={expandedContainerRef}>
      <MultiSelect
        label={t('layer.flag_state_plural', 'Flag States')}
        placeholder={getPlaceholderBySelections(flags)}
        options={flagOptions}
        selectedOptions={flags}
        className={styles.row}
        onSelect={(filter) => {
          setSearchFilters({ flags: [...(flags || []), filter] })
        }}
        onRemove={(filter, rest) => {
          setSearchFilters({ flags: rest })
        }}
        onCleanClick={() => {
          setSearchFilters({ flags: undefined })
        }}
      />
      <MultiSelect
        label={t('layer.gear_type_plural', 'Gear types')}
        placeholder={getPlaceholderBySelections(gearTypes)}
        options={GEAR_TYPES}
        selectedOptions={gearTypes}
        className={styles.row}
        onSelect={(filter: MultiSelectOption<GearType>) => {
          setSearchFilters({ gearTypes: [...(gearTypes || []), filter] })
        }}
        onRemove={(filter, rest) => {
          setSearchFilters({ gearTypes: rest as MultiSelectOption<GearType>[] })
        }}
        onCleanClick={() => {
          setSearchFilters({ flags: undefined })
        }}
      />
      <div className={styles.row}>
        <InputText
          label={t('common.active_after', 'Active after')}
          type="date"
          onChange={(e) => setSearchFilters({ startDate: e.target.value })}
        />
      </div>
      <div className={styles.row}>
        <InputText
          label={t('common.active_before', 'Active Before')}
          type="date"
          onChange={(e) => setSearchFilters({ endDate: e.target.value })}
        />
      </div>
    </div>
  )
}

export default SearchFilters
