import React from 'react'
import Sticky from 'react-sticky-el'
import { useDispatch, useSelector } from 'react-redux'
import { Logo, Select, SelectOption, SubBrands } from '@globalfishingwatch/ui-components'
import { selectCountries } from 'features/app/data'
import { selectCountry, setCountry } from 'features/labeler/labeler.slice'
import styles from './SidebarHeader.module.css'

interface HeaderProps {
  onCountryChange?: (country: string) => void
}
function SidebarHeader(props: HeaderProps) {
  const countries: SelectOption[] = useSelector(selectCountries)
  const country = useSelector(selectCountry)
  const dispatch = useDispatch()

  return (
    <Sticky scrollElement=".scrollContainer">
      <div className={styles.sidebarHeader}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} subBrand={SubBrands.PortLabeler} />
        </a>
        <Select
          options={countries}
          onRemove={() => {}}
          selectedOption={country ? {id: country, label: country} : undefined}
          onSelect={(selected: SelectOption) => {
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
