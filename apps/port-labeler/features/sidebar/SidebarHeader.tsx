import React from 'react'
import Sticky from 'react-sticky-el'
import { useDispatch, useSelector } from 'react-redux'
import { Icon, IconButton, Logo, Select, SelectOption, SubBrands } from '@globalfishingwatch/ui-components'
import { selectCountry, setCountry } from 'features/labeler/labeler.slice'
import { selectCountries } from 'features/map/map.selectors'
import styles from './SidebarHeader.module.css'
import { useSelectedTracksConnect } from './sidebar.hooks'

interface HeaderProps {
  onCountryChange?: (country: string) => void
}
function SidebarHeader(props: HeaderProps) {
  const countries: SelectOption[] = useSelector(selectCountries)
  const country = useSelector(selectCountry)
  const dispatch = useDispatch()
  const {
    dispatchDownloadSelectedTracks,
    dispatchImportHandler,
  } = useSelectedTracksConnect()
  return (
    <Sticky scrollElement=".scrollContainer">
      <div className={styles.sidebarHeader}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} subBrand={SubBrands.PortLabeler} />
        </a>
        <div className={styles.actionButtons}>
          <label className={styles.importButton}>
            <input
              id="file-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={dispatchImportHandler}
            />
            <Icon
              icon="upload"
            />
          </label>

          <IconButton
            type="default"
            icon="save"
            className={styles.actionButton}
            onClick={() => dispatchDownloadSelectedTracks()}
          />
        </div>
        <Select
          options={countries}
          onRemove={() => { }}
          selectedOption={country ? { id: country, label: country } : undefined}
          onSelect={(selected: SelectOption) => {
            dispatch(setCountry(selected.id))
            dispatch(setCountry(selected.id))

            if (props.onCountryChange) {
              props.onCountryChange(selected.id)
            }
          }}
        />
      </div>
    </Sticky>
  )
}

export default SidebarHeader
