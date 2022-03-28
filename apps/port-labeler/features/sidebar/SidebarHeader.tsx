import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Icon, IconButton, Logo, Select, SelectOption, SubBrands } from '@globalfishingwatch/ui-components'
import { flags } from '@globalfishingwatch/i18n-labels'
import { selectCountry } from 'features/labeler/labeler.slice'
import { selectCountries } from 'features/map/map.selectors'
import styles from './SidebarHeader.module.css'
import { useSelectedTracksConnect } from './sidebar.hooks'

interface HeaderProps {
  onCountryChange?: (country: string) => void
}
function SidebarHeader(props: HeaderProps) {
  const { t } = useTranslation()
  const countries: SelectOption[] = useSelector(selectCountries)
  const country = useSelector(selectCountry)
  const {
    onCountryChange,
    dispatchDownloadSelectedTracks,
    dispatchImportHandler,
  } = useSelectedTracksConnect()


  return (

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
        placeholder={t('messages.country_selection', 'Select a country')}
        selectedOption={country ? { id: country, label: flags[country] ?? country } : undefined}
        onSelect={(selected: SelectOption) => {
          onCountryChange(selected.id)

          if (props.onCountryChange) {
            props.onCountryChange(selected.id)
          }
        }}
      />
    </div>

  )
}

export default SidebarHeader
