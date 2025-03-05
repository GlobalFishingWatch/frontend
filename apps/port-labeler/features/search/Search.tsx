import { Fragment, useCallback, useMemo,useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import type { SelectOption } from '@globalfishingwatch/ui-components';
import { Button, IconButton, InputText, Select } from '@globalfishingwatch/ui-components'

import { setSelectedPoints } from 'features/labeler/labeler.slice'

import { useSearchConnect } from './search.hooks'

import styles from './Search.module.css'

interface SearchOptions { }

const Search: React.FC<SearchOptions> = (props) => {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const { searchPoints } = useSearchConnect()
  const [searchType, setSearchType] = useState(undefined)
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useDispatch()


  const options: SelectOption[] = useMemo(() => {
    return [
      {
        id: 'port',
        label: 'Ports',
      },
      {
        id: 'subarea',
        label: 'Subareas',
      },
      {
        id: 'anchorage',
        label: 'Anchorages',
      },
      {
        id: 'destination',
        label: 'Destination',
      },
    ]
  }, [])

  const seach = useCallback(() => {
    searchPoints(searchType.id, searchValue)
  }, [searchPoints, searchType, searchValue])

  const clear = useCallback(() => {
    dispatch(setSelectedPoints([]))
  }, [setSelectedPoints])

  return (
    <Fragment>
      <IconButton icon="search" type="default" size="default" className={styles.button} onClick={() => setOpen(!open)}>
      </IconButton>
      {open && (
        <ul className={styles.list}>
          <li>
            <Select
              options={options}
              selectedOption={searchType}
              onSelect={function (option: SelectOption<any>): void {
                setSearchType(option)
              }} />
          </li>
          <li>
            <InputText
              value={searchValue}
              className={styles.full}
              placeholder={'search term...'}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
          </li>

          <li className={styles.buttons}>
            <Button size='small' onClick={seach} disabled={!searchType || !searchValue}>Search</Button>
            <Button size='small' type='secondary' onClick={clear}>clear</Button>
          </li>
        </ul>
      )}
    </Fragment >
  )
}

export default Search