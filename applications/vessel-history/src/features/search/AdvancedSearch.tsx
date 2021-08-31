import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import InputDate from '@globalfishingwatch/ui-components/dist/input-date'
import MultiSelect, { MultiSelectOption } from '@globalfishingwatch/ui-components/dist/multi-select'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectAdvancedSearchCallsign,
  selectAdvancedSearchFields,
  selectAdvancedSearchFlags,
  selectAdvancedSearchIMO,
  selectAdvancedSearchMMSI,
  selectFirstTransmissionDate,
  selectLastTransmissionDate,
  selectUrlQuery,
} from 'routes/routes.selectors'
import { getFlags } from 'utils/flags'
import { DEFAULT_WORKSPACE } from 'data/config'
import { fetchVesselSearchThunk } from './search.thunk'
import styles from './AdvancedSearch.module.css'

const AdvancedSearch: React.FC = () => {
  const dispatch = useDispatch()
  const query = useSelector(selectUrlQuery)
  const MMSI = useSelector(selectAdvancedSearchMMSI)
  const IMO = useSelector(selectAdvancedSearchIMO)
  const callsign = useSelector(selectAdvancedSearchCallsign)
  const flags = useSelector(selectAdvancedSearchFlags)
  const lastTransmissionDate = useSelector(selectLastTransmissionDate)
  const firstTransmissionDate = useSelector(selectFirstTransmissionDate)

  const allFlagOptions = useMemo(getFlags, [])
  const flagOptions = useMemo(() => {
    return flags.map((id) => ({ id, label: allFlagOptions.find((f) => f.id === id)?.label || '' }))
  }, [flags, allFlagOptions])

  const advancedSearch = useSelector(selectAdvancedSearchFields)
  const fetchResults = useCallback(() => {
    dispatch(
      fetchVesselSearchThunk({
        query,
        offset: 0,
        advancedSearch,
      })
    )
  }, [dispatch, query, advancedSearch])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  const { dispatchQueryParams } = useLocationConnect()

  const setQueryParam = useCallback(
    (e, key?, value?) => {
      dispatchQueryParams({
        [key || e.target.id]: value ?? e.target.value,
      })
      fetchResults()
    },
    [dispatchQueryParams, fetchResults]
  )

  const onMainQueryChange = useCallback(
    (e) => {
      setQueryParam(e, 'q')
    },
    [setQueryParam]
  )

  const onFlagChange = useCallback(
    (flags) => {
      setQueryParam(null, 'flags', flags ? flags.map((f: MultiSelectOption) => f.id).join(',') : '')
    },
    [setQueryParam]
  )

  return (
    <div>
      <div className={styles.row}>
        <InputText
          onChange={onMainQueryChange}
          value={query}
          label="name"
          autoFocus
          className={styles.half}
        />
        <InputText
          onChange={setQueryParam}
          className={styles.thirdOfHalf}
          value={MMSI}
          label="MMSI"
        />
        <InputText
          onChange={setQueryParam}
          className={styles.thirdOfHalf}
          value={IMO}
          label="IMO"
        />
        <InputText
          onChange={setQueryParam}
          className={styles.thirdOfHalf}
          value={callsign}
          label="callsign"
        />
      </div>
      <div className={styles.row}>
        <MultiSelect
          label="Flag States"
          className={styles.full}
          options={allFlagOptions}
          selectedOptions={flagOptions}
          onSelect={(filter) => {
            onFlagChange([...(flagOptions || []), filter])
          }}
          onRemove={(_, rest) => {
            onFlagChange(rest)
          }}
          onCleanClick={() => {
            onFlagChange(null)
          }}
        />
      </div>
      <div className={styles.row}>
        <InputDate
          value={lastTransmissionDate}
          className={styles.half}
          max={DEFAULT_WORKSPACE.availableEnd.slice(0, 10) as string}
          min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
          // label={t('common.active_after', 'Active after')}
          label="Active after"
          onChange={(e) => {
            if (e.target.value !== lastTransmissionDate) {
              setQueryParam(e, 'lastTransmissionDate')
            }
          }}
          onRemove={(e) => {
            if (lastTransmissionDate !== '') {
              setQueryParam(e, 'lastTransmissionDate', '')
            }
          }}
        />
        <InputDate
          value={firstTransmissionDate}
          className={styles.half}
          max={DEFAULT_WORKSPACE.availableEnd.slice(0, 10) as string}
          min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
          label="Active before"
          onChange={(e) => {
            if (e.target.value !== firstTransmissionDate) {
              setQueryParam(e, 'firstTransmissionDate')
            }
          }}
          onRemove={(e) => {
            if (firstTransmissionDate !== '') {
              setQueryParam(e, 'firstTransmissionDate', '')
            }
          }}
        />
      </div>
    </div>
  )
}

export default AdvancedSearch
