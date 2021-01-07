import React, { useState } from 'react'
import { DebounceInput } from 'react-debounce-input'
import Logo from '@globalfishingwatch/ui-components/src/logo'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button/IconButton'
import GFWAPI from '@globalfishingwatch/api-client'
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
  const [searching, setSearching] = useState(false)
  const [vessels, setVessels] = useState([])
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
    } else {
    }
  }

  const fetchData = (query: string) => {
    //const { query, resultsOffset, resultsTotal } = this.state

    //if (resultsTotal !== 0 && resultsOffset >= resultsTotal) return
    setSearching(true)
    GFWAPI.fetch(`/vessels?query=${query}&limit=${resultsPerRequest}&offset=${0}`)
      .then((json: any) => {
        const resultVessels = json.entries
        setSearching(false)
        /*const totalVessels = resultVessels.concat(this.state.vessels)
        this.setState((prevState) => ({
          vessels: totalVessels,
          tip: json.entries.length > 0 ? `${json.total.value} matching results` : 'No results',
          resultsTotal: json.total,
          resultsOffset: (prevState.resultsOffset += json.entries.length),
        }))*/
      })
      .catch((error) => {
        setSearching(false)
        /*this.setState({
          tip: this.tips.connectionError,
        })*/
      })
  }

  return (
    <div className={styles.homeContainer}>
      <header>
        <Logo></Logo>
        <IconButton type="default" size="default" icon="settings"></IconButton>
        <IconButton type="default" size="default" icon="logout"></IconButton>
      </header>
      <div>
        <div className={styles.searchbar}>
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
            <div className={styles.offlineVessels}>
              <VesselListItem vessel={null} />
              <VesselListItem saved={true} vessel={null} />
              <VesselListItem vessel={null} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
