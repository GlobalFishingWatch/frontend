import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { flags } from '@globalfishingwatch/i18n-labels'
import type {
  SelectOption} from '@globalfishingwatch/ui-components';
import {
  Icon,
  IconButton,
  Logo,
  Select,
  SubBrands,
} from '@globalfishingwatch/ui-components'

import { selectCountries, selectCountry, sortOptions } from 'features/labeler/labeler.slice'
import Search from 'features/search/Search'

import { useSelectedTracksConnect } from './sidebar.hooks'

import styles from './SidebarHeader.module.css'

interface HeaderProps {
  onCountryChange?: (country: string) => void
}
function SidebarHeader(props: HeaderProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const countries: SelectOption[] = useSelector(selectCountries)
  const country = useSelector(selectCountry)
  const { onCountryChange, dispatchDownload, dispatchImportHandler } = useSelectedTracksConnect()

  return (
    <div className={styles.sidebarHeader}>
      <a href="https://globalfishingwatch.org" className={styles.logoLink}>
        <Logo className={styles.logo} subBrand={SubBrands.PortLabeler} />
      </a>
      <div className={styles.actionButtons}>
        <Search />
        <IconButton
          type="default"
          icon="split"
          tooltip="Sort selectors"
          tooltipPlacement="bottom"
          className={styles.actionButton}
          onClick={() => dispatch(sortOptions())}
        />
        <label className={styles.importButton}>
          <input
            id="file-upload"
            type="file"
            style={{ display: 'none' }}
            onChange={dispatchImportHandler}
          />
          <Icon icon="upload" tooltip="Upload file" tooltipPlacement="bottom" />
        </label>

        <IconButton
          type="default"
          icon="save"
          tooltip="Save file"
          tooltipPlacement="bottom"
          className={styles.actionButton}
          onClick={() => dispatchDownload()}
        />
      </div>
      <Select
        options={countries}
        onRemove={() => { }}
        className={styles.countrySelector}
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
