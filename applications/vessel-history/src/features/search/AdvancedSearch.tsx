import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectAdvancedSearchIMO,
  selectAdvancedSearchMMSI,
  selectUrlQuery,
} from 'routes/routes.selectors'

const AdvancedSearch: React.FC = () => {
  const query = useSelector(selectUrlQuery)
  const MMSI = useSelector(selectAdvancedSearchMMSI)
  const IMO = useSelector(selectAdvancedSearchIMO)
  const { dispatchQueryParams } = useLocationConnect()

  const onMainQueryChange = useCallback(
    (e) => {
      dispatchQueryParams({
        q: e.target.value,
      })
    },
    [dispatchQueryParams]
  )

  const onInputChange = useCallback(
    (e) => {
      const key = e.target.id
      dispatchQueryParams({
        [key]: e.target.value,
      })
    },
    [dispatchQueryParams]
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
      <InputText onChange={onInputChange} value={MMSI} label="MMSI" placeholder="..." />
      <InputText onChange={onInputChange} value={IMO} label="IMO" placeholder="..." />
    </div>
  )
}

export default AdvancedSearch
