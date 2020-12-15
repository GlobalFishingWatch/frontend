import React, { useMemo } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import MultiSelect, { MultiSelectOption } from '@globalfishingwatch/ui-components/dist/multi-select'
import InputDate from '@globalfishingwatch/ui-components/dist/input-date'
import { getFlags } from 'utils/flags'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import useClickedOutside from 'hooks/use-clicked-outside'
import { GearType, GEAR_TYPES } from 'data/datasets'
import { DEFAULT_WORKSPACE } from 'data/config'
import { useSearchFiltersConnect } from './search.hook'
import styles from './SearchFilters.module.css'

type SearchFiltersProps = {
  className?: string
}

function SearchFilters({ className = '' }: SearchFiltersProps) {
  const { t } = useTranslation()
  const { searchFilters, setSearchFiltersOpen, setSearchFilters } = useSearchFiltersConnect()
  const { flags, gearTypes, firstTransmissionDate = '', lastTransmissionDate = '' } = searchFilters
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
      {/* <MultiSelect
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
      /> */}
      <div className={styles.row}>
        <InputDate
          value={firstTransmissionDate}
          max={DEFAULT_WORKSPACE.end.slice(0, 10) as string}
          min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
          label={t('common.active_after', 'Active after')}
          onChange={(e) => {
            if (e.target.value !== firstTransmissionDate) {
              setSearchFilters({ firstTransmissionDate: e.target.value })
            }
          }}
          onRemove={() => {
            if (firstTransmissionDate) {
              setSearchFilters({ firstTransmissionDate: undefined })
            }
          }}
        />
      </div>
      <div className={styles.row}>
        <InputDate
          value={lastTransmissionDate}
          max={DEFAULT_WORKSPACE.end.slice(0, 10) as string}
          min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
          label={t('common.active_before', 'Active Before')}
          onChange={(e) => {
            if (e.target.value !== lastTransmissionDate) {
              setSearchFilters({ lastTransmissionDate: e.target.value })
            }
          }}
          onRemove={() => {
            if (lastTransmissionDate) {
              setSearchFilters({ lastTransmissionDate: undefined })
            }
          }}
        />
      </div>
    </div>
  )
}

export default SearchFilters
