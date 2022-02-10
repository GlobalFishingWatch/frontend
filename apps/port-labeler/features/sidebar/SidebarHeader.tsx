import React from 'react'
import Sticky from 'react-sticky-el'
import { useSelector } from 'react-redux'
import { Logo, Select, SelectOption, SubBrands } from '@globalfishingwatch/ui-components'
import { selectCountries } from 'features/app/data'
import styles from './SidebarHeader.module.css'

interface HeaderProps {
  onCountryChange?: (country: string) => void
}
function SidebarHeader(props: HeaderProps) {
  const countries: SelectOption[] = useSelector(selectCountries)

  return (
    <Sticky scrollElement=".scrollContainer">
      <div className={styles.sidebarHeader}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} subBrand={SubBrands.PortLabeler} />
        </a>
        <Select
          options={countries}
          onRemove={() => {}}
          onSelect={(selected: SelectOption) => {
            props.onCountryChange(selected.id)
          }}
        />
      </div>
    </Sticky>
  )
}

export default SidebarHeader
