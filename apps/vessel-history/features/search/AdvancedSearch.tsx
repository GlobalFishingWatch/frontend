import React, { useCallback, useMemo } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Button,
  InputText,
  InputDate,
  MultiSelect,
  MultiSelectOption,
} from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectAdvancedSearchCallsign,
  selectAdvancedSearchFlags,
  selectAdvancedSearchIMO,
  selectAdvancedSearchMMSI,
  selectFirstTransmissionDate,
  selectLastTransmissionDate,
} from 'routes/routes.selectors'
import { getFlags } from 'utils/flags'
import { DEFAULT_WORKSPACE } from 'data/config'
import { useSearchConnect } from './search.hooks'
import styles from './AdvancedSearch.module.css'

const AdvancedSearch: React.FC = () => {
  const { t } = useTranslation()

  const { query, fetchResults } = useSearchConnect()
  const mmsi = useSelector(selectAdvancedSearchMMSI)
  const imo = useSelector(selectAdvancedSearchIMO)
  const callsign = useSelector(selectAdvancedSearchCallsign)
  const flags = useSelector(selectAdvancedSearchFlags)
  const lastTransmissionDate = useSelector(selectLastTransmissionDate)
  const firstTransmissionDate = useSelector(selectFirstTransmissionDate)

  const allFlagOptions = useMemo(getFlags, [])
  const flagOptions = useMemo(() => {
    return flags.map((id) => ({ id, label: allFlagOptions.find((f) => f.id === id)?.label || '' }))
  }, [flags, allFlagOptions])

  const { dispatchQueryParams } = useLocationConnect()

  const setQueryParam = useCallback(
    (e, key?, value?) => {
      dispatchQueryParams({
        [key || e.target.id]: value ?? e.target.value,
      })
    },
    [dispatchQueryParams]
  )

  const onResetClick = useCallback(() => {
    setQueryParam(null, 'q', '')
    setQueryParam(null, 'mmsi', '')
    setQueryParam(null, 'imo', '')
    setQueryParam(null, 'callsign', '')
    setQueryParam(null, 'flags', '')
    setQueryParam(null, 'lastTransmissionDate', '')
    setQueryParam(null, 'firstTransmissionDate', '')
  }, [setQueryParam])

  const onSearchClick = useCallback(
    (e) => {
      fetchResults()
    },
    [fetchResults]
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
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSearchClick(e)
        }}
      >
        <div className={styles.row}>
          <InputText
            autoComplete="off"
            inputSize="small"
            onChange={onMainQueryChange}
            value={query ?? ''}
            label={t('search.shipname', 'Name')}
            autoFocus={true}
            className={styles.full}
          />
          <InputText
            inputSize="small"
            onChange={setQueryParam}
            id="mmsi"
            className={styles.width8ch}
            value={mmsi ?? ''}
            label={t('search.MMSI', 'MMSI')}
          />
          <InputText
            inputSize="small"
            onChange={setQueryParam}
            id="imo"
            className={styles.width7ch}
            value={imo ?? ''}
            label={t('search.IMO', 'IMO')}
          />
          <InputText
            inputSize="small"
            onChange={setQueryParam}
            id="callsign"
            className={styles.width6ch}
            value={callsign ?? ''}
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
            value={lastTransmissionDate ?? ''}
            className={styles.full}
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
            value={firstTransmissionDate ?? ''}
            className={styles.full}
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
          <Button type="secondary" onClick={onResetClick}>
            {t('clear', 'Clear ')}
          </Button>
          <Button className={styles.cta} onClick={onSearchClick}>
            {t('search.title', 'Search')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AdvancedSearch
