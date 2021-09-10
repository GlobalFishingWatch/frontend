import React, { useCallback, useMemo } from 'react'
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import InputDate from '@globalfishingwatch/ui-components/dist/input-date'
import MultiSelect, { MultiSelectOption } from '@globalfishingwatch/ui-components/dist/multi-select'
import { Button } from '@globalfishingwatch/ui-components'
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
  const { t } = useTranslation()
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

  const { dispatchQueryParams } = useLocationConnect()

  const setQueryParam = useCallback(
    (e, key?, value?) => {
      dispatchQueryParams({
        [key || e.target.id]: value ?? e.target.value,
      })
    },
    [dispatchQueryParams]
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
    <div className={styles.container}>
      <div className={styles.row}>
        <InputText
          inputSize="small"
          onChange={onMainQueryChange}
          value={query}
          label={t('search.shipname', 'Name')}
          autoFocus
          className={styles.half}
        />
        <InputText
          inputSize="small"
          onChange={setQueryParam}
          id="MMSI"
          className={styles.thirdOfHalf}
          value={MMSI}
          label={t('search.MMSI', 'MMSI')}
        />
        <InputText
          inputSize="small"
          onChange={setQueryParam}
          id="IMO"
          className={styles.thirdOfHalf}
          value={IMO}
          label={t('search.IMO', 'IMO')}
        />
        <InputText
          inputSize="small"
          onChange={setQueryParam}
          id="callsign"
          className={styles.thirdOfHalf}
          value={callsign}
          label={t('search.callsign', 'Callsign')}
        />
      </div>
      <div className={styles.row}>
        <MultiSelect
          label={t('search.flagState', 'Flag states')}
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
          label={t('search.activeAfter', 'Active after')}
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
          label={t('search.activeBefore', 'Active before')}
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
      <div className={cx(styles.row, styles.flexEnd)}>
        <Button className={styles.cta} onClick={fetchResults}>
          {t('search.title', 'Search')}
        </Button>
      </div>
    </div>
  )
}

export default AdvancedSearch
