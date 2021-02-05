import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { DebounceInput } from 'react-debounce-input'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import GFWAPI from '@globalfishingwatch/api-client'
import { Spinner, IconButton } from '@globalfishingwatch/ui-components'
import { logoutUserThunk } from 'features/user/user.slice'
import { Vessel } from 'types'
import VesselListItem from 'features/vessel-list-item/VesselListItem'
import styles from './Home.module.css'
import '@globalfishingwatch/ui-components/dist/base.css'

interface LoaderProps {
  invert?: boolean
  timeout?: number
  mini?: boolean
  encounter?: boolean
  carrier?: boolean
}

const Home: React.FC<LoaderProps> = (): React.ReactElement => {
  const dispatch = useDispatch()
  const [searching, setSearching] = useState(false)
  const [vessels, setVessels] = useState<Array<Vessel>>([])
  const [query, setQuery] = useState('')
  const minimumCharacters = 3
  const resultsPerRequest = 25
  const tips = {
    intial: 'Try searching for any name or UVI:XXXXXX',
    searching: 'Searching...',
    insuficientCharacters: `Type at least ${minimumCharacters} characters`,
    connectionError: 'Ups! something went wrong :/',
  }

  const updateQuery = (e: any) => {
    setQuery(e.target.value)
    setVessels([])
    if (query.length >= minimumCharacters) {
      fetchData(query)
    }
  }

  const fetchData = async (query: string) => {
    setSearching(true)
    const newVessels = await GFWAPI.fetch<any>(
      `/v1/vessels/search?datasets=public-global-vessels%3Av20190502&limit=${resultsPerRequest}&offset=${0}&query=${query}`
    )
      .then((json: any) => {
        const resultVessels: Array<Vessel> = json.entries
        setSearching(false)
        const totalVessels = resultVessels.concat(vessels)
        return totalVessels
      })
      .catch((error) => {
        setSearching(false)
        return vessels
      })
    setVessels(newVessels)
  }

  return (
    <div className={styles.homeContainer}>
      {!query && (
        <header>
          <Logo className={styles.logo}></Logo>
          <IconButton
            type="default"
            size="default"
            icon="logout"
            onClick={async () => {
              dispatch(logoutUserThunk({ redirectToLogin: true }))
            }}
          ></IconButton>
          <IconButton type="default" size="default" icon="settings"></IconButton>
        </header>
      )}
      <div>
        <div className={styles.searchbar + ` ${query ? styles.searching : ''}`}>
          <DebounceInput
            debounceTimeout={500}
            autoFocus
            type="search"
            role="search"
            placeholder="Search vessels by name, MMSI, IMO"
            aria-label="Search vessels"
            className={styles.input}
            onChange={(e) => updateQuery(e)}
          />
          {!query && (
            <IconButton
              type="default"
              size="default"
              icon="search"
              className={styles.searchButton}
            ></IconButton>
          )}
        </div>
        {!query && (
          <div>
            <h2>OFFLINE ACCESS</h2>
            <div className={styles.offlineVessels}></div>
          </div>
        )}
        {query && (
          <div>
            {searching && <Spinner className={styles.loader}></Spinner>}
            <div className={styles.offlineVessels}>
              {vessels.map((vessel, index) => (
                <VesselListItem key={index} vessel={vessel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
