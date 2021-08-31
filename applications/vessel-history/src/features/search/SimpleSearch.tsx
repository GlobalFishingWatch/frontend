import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { DebounceInput } from 'react-debounce-input'
import { useCallback, useEffect } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import { selectUrlQuery } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import styles from './SimpleSearch.module.css'
import { fetchVesselSearchThunk } from './search.thunk'

const SimpleSearch: React.FC = () => {
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useDispatch()
  const query = useSelector(selectUrlQuery)
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatchQueryParams({ q: e.target.value })
  }

  const fetchResults = useCallback(() => {
    dispatch(
      fetchVesselSearchThunk({
        query,
        offset: 0,
      })
    )
  }, [dispatch, query])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  return (
    <div className={cx(styles.searchbar, query ? styles.searching : '', styles.inputContainer)}>
      <DebounceInput
        debounceTimeout={500}
        autoFocus
        type="search"
        role="search"
        placeholder="Search vessels by name, MMSI, IMO"
        aria-label="Search vessels"
        className={styles.input}
        onChange={onInputChange}
        value={query}
      />
      {!query && (
        <IconButton
          type="default"
          size="medium"
          icon="search"
          className={styles.searchButton}
        ></IconButton>
      )}
    </div>
  )
}

export default SimpleSearch
