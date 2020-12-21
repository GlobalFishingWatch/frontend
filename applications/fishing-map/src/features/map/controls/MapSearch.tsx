import React, { memo, useRef, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useCombobox, UseComboboxStateChange } from 'downshift'
import { fitBounds } from 'viewport-mercator-project'
import { IconButton, InputText } from '@globalfishingwatch/ui-components'
import { OceanArea, searchOceanAreas } from '@globalfishingwatch/ocean-areas'
import { useMapboxRef } from '../map.context'
import useViewport from '../map-viewport.hooks'
import styles from './MapSearch.module.css'

const MapSearch = () => {
  const { t } = useTranslation()
  const [query, setQuery] = useState<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [areasMatching, setAreasMatching] = useState<OceanArea[]>([])
  const mapRef = useMapboxRef()

  const { setMapCoordinates } = useViewport()

  const onSelectResult = ({ selectedItem }: UseComboboxStateChange<OceanArea>) => {
    const bounds = selectedItem?.properties.bounds
    if (bounds) {
      const { latitude, longitude, zoom } = fitBounds({
        bounds: [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ],
        width: mapRef.current.getMap()._canvas.width,
        height: mapRef.current.getMap()._canvas.height,
        padding: 60,
      })
      setMapCoordinates({ latitude, longitude, zoom })
    }
  }

  const onInputChange = ({ type, inputValue }: UseComboboxStateChange<OceanArea>) => {
    if (type === '__item_click__' || type === '__input_keydown_enter__' || !inputValue) {
      setQuery('')
      setAreasMatching([])
    } else {
      setQuery(inputValue)
      searchOceanAreas(inputValue).then((areas: OceanArea[]) => {
        setAreasMatching(areas)
      })
    }
  }

  const togglePropOptions = {
    onClick: () => {
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
