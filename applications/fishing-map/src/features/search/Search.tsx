import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import useDebounce from '@globalfishingwatch/react-hooks/dist/use-debounce'
import { useLocationConnect } from 'routes/routes.hook'
import { HOME, SEARCH } from 'routes/routes'
import { fetchVesselSearchThunk } from './search.slice'

function Search() {
  const dispatch = useDispatch()
  const { payload } = useLocationConnect()
  const [searchQuery, setSearchQuery] = useState((payload.query || '') as string)
  const query = useDebounce(searchQuery, 200)
  const { dispatchLocation } = useLocationConnect()

  useEffect(() => {
    if (query) {
      dispatchLocation(SEARCH, { query })
      dispatch(fetchVesselSearchThunk(query))
    } else {
      dispatchLocation(SEARCH)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const onCloseClick = () => {
    dispatchLocation(HOME)
  }
  const onInputChange = (e: any) => {
    setSearchQuery(e.target.value)
  }
  return (
    <Fragment>
      <InputText onChange={onInputChange} value={searchQuery} />
      <IconButton icon="close" onClick={onCloseClick} />
    </Fragment>
  )
}

export default Search
