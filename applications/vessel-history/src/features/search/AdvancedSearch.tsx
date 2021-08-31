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
      <InputText
        onChange={onMainQueryChange}
        value={query}
        label="name"
        autoFocus
        // disabled={!basicSearchAllowed}
        // className={styles.input}
        // loading={
        //   searchStatus === AsyncReducerStatus.Loading || searchStatus === AsyncReducerStatus.Aborted
        // }
        // placeholder={t('search.placeholder', 'Type to search vessels')}
      />
      <InputText onChange={setQueryParam} value={MMSI} label="MMSI" placeholder="..." />
      <InputText onChange={setQueryParam} value={IMO} label="IMO" placeholder="..." />
      <InputText onChange={setQueryParam} value={callsign} label="callsign" placeholder="..." />
      <MultiSelect
        label="Flag States"
        // placeholder={getPlaceholderBySelections(flags)}
        options={allFlagOptions}
        selectedOptions={flagOptions}
        // className={styles.row}
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
      <InputDate
        value={lastTransmissionDate}
        max={DEFAULT_WORKSPACE.availableEnd.slice(0, 10) as string}
        min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
        // label={t('common.active_after', 'Active after')}
        label="Active after"
        onChange={(e) => {
          console.log(e.target.id, e.target.value)
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
        max={DEFAULT_WORKSPACE.availableEnd.slice(0, 10) as string}
        min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
        label="Active before"
        onChange={(e) => {
          console.log(e.target.id, e.target.value)
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
  )
}

export default AdvancedSearch
