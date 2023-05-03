import { memo, useRef, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useCombobox, UseComboboxStateChange } from 'downshift'
import { InputText, IconButton } from '@globalfishingwatch/ui-components'
import type {
  searchOceanAreas as searchOceanAreasType,
  OceanAreaLocale,
  OceanArea,
} from '@globalfishingwatch/ocean-areas'
import { Bbox } from 'types'
import Hint from 'features/help/Hint'
import { setHintDismissed } from 'features/help/hints.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { useMapFitBounds } from '../map-viewport.hooks'
import styles from './MapSearch.module.css'

const MapSearch = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const [query, setQuery] = useState<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [areasMatching, setAreasMatching] = useState<OceanArea[]>([])
  const searchOceanAreas = useRef<typeof searchOceanAreasType>()

  const fitBounds = useMapFitBounds()

  const onSelectResult = ({ selectedItem }: UseComboboxStateChange<OceanArea>) => {
    const bounds = selectedItem?.properties.bounds as Bbox
    if (bounds) {
      fitBounds(bounds)
    }
  }

  const onInputChange = ({ type, inputValue }: UseComboboxStateChange<OceanArea>) => {
    if (type === '__item_click__' || type === '__input_keydown_enter__' || !inputValue) {
      setQuery('')
      setAreasMatching([])
    } else {
      setQuery(inputValue)
      if (searchOceanAreas.current) {
        const areas = searchOceanAreas.current(inputValue, {
          locale: i18n.language as OceanAreaLocale,
        })
        setAreasMatching(areas)
      }
    }
  }

  const togglePropOptions = {
    onClick: async () => {
      if (!searchOceanAreas.current) {
        searchOceanAreas.current = await import('@globalfishingwatch/ocean-areas').then(
          (module) => module.searchOceanAreas
        )
      }
      dispatch(setHintDismissed('areaSearch'))
      setTimeout(() => {
        inputRef.current?.focus()
      }, 1)
    },
  }

  const {
    getComboboxProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    getToggleButtonProps,
    highlightedIndex,
    inputValue,
    isOpen,
  } = useCombobox({
    inputValue: query,
    items: areasMatching,
    itemToString: (item: OceanArea | null): string => (item ? item.properties.name : ''),
    onInputValueChange: onInputChange,
    onSelectedItemChange: onSelectResult,
  })
  return (
    <div className={styles.container} {...getComboboxProps()}>
      <IconButton
        {...getToggleButtonProps(togglePropOptions)}
        icon="search"
        type="map-tool"
        tooltip={isOpen ? t('search.close', 'Close search') : t('map.search', 'Search areas')}
        className={cx({ [styles.active]: isOpen })}
      ></IconButton>

      <Hint id="areaSearch" className={styles.helpHint} />
      <div className={cx(styles.searchContainer, { [styles.hidden]: !isOpen })}>
        <InputText
          {...getInputProps({ ref: inputRef })}
          className={styles.input}
          placeholder={t('map.search', 'Search areas')}
          value={inputValue}
        />
        <ul {...getMenuProps()} className={styles.results}>
          {areasMatching?.map((item, index) => (
            <li
              {...getItemProps({ item, index })}
              key={`${item}${index}`}
              className={cx(styles.result, { [styles.highlighted]: highlightedIndex === index })}
            >
              {item.properties.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default memo(MapSearch)
