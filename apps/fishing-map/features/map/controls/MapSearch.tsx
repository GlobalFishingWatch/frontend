import { memo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import type { UseComboboxStateChange } from 'downshift'
import { useCombobox } from 'downshift'
import type { Point } from 'geojson'

import type { OceanArea, OceanAreaLocale } from '@globalfishingwatch/ocean-areas'
import { searchOceanAreas } from '@globalfishingwatch/ocean-areas'
import { IconButton, InputText } from '@globalfishingwatch/ui-components'

import { BASE_CONTEXT_LAYERS_DATAVIEW_INSTANCES } from 'data/default-workspaces/context-layers'
import { useAppDispatch } from 'features/app/app.hooks'
import Hint from 'features/help/Hint'
import { setHintDismissed } from 'features/help/hints.slice'
import { useMapSetViewState } from 'features/map/map-viewport.hooks'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import type { Bbox } from 'types'
import { formatInfoField } from 'utils/info'

import { useMapFitBounds } from '../map-bounds.hooks'

import styles from './MapSearch.module.css'

const MapSearch = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const [query, setQuery] = useState<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [areasMatching, setAreasMatching] = useState<OceanArea[]>([])
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const fitBounds = useMapFitBounds()
  const setMapViewState = useMapSetViewState()

  const onSelectResult = ({ selectedItem }: UseComboboxStateChange<OceanArea>) => {
    const bounds = selectedItem?.properties.bounds as Bbox
    const areaDataview =
      selectedItem?.properties?.type &&
      BASE_CONTEXT_LAYERS_DATAVIEW_INSTANCES.find((d) =>
        d.id.includes(selectedItem?.properties?.type)
      )
    if (areaDataview) {
      upsertDataviewInstance({
        ...areaDataview,
        config: {
          visible: true,
        },
      })
    }
    if (selectedItem?.properties.type === 'port') {
      const [longitude, latitude] = (selectedItem.geometry as Point).coordinates
      setMapViewState({
        latitude,
        longitude,
        zoom: 12,
      })
    } else if (bounds) {
      fitBounds(bounds, { fitZoom: true })
    }
  }

  const onInputChange = async ({ type, inputValue }: UseComboboxStateChange<OceanArea>) => {
    if (type === '__item_click__' || type === '__input_keydown_enter__' || !inputValue) {
      setQuery('')
      setAreasMatching([])
    } else {
      setQuery(inputValue)
      const areas = await searchOceanAreas(inputValue, {
        locale: i18n.language as OceanAreaLocale,
      })
      setAreasMatching(areas)
    }
  }

  const togglePropOptions = {
    onClick: async () => {
      dispatch(setHintDismissed('areaSearch'))
      setTimeout(() => {
        inputRef.current?.focus()
      }, 1)
    },
  }

  const {
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
    <div className={styles.container}>
      <IconButton
        {...getToggleButtonProps(togglePropOptions)}
        icon="search"
        type="map-tool"
        testId="map-search-button"
        tooltip={isOpen ? t('search.close', 'Close search') : t('map.search', 'Search areas')}
        className={cx({ [styles.active]: isOpen })}
      ></IconButton>

      <Hint id="areaSearch" className={styles.helpHint} />
      <div className={cx(styles.searchContainer, { [styles.hidden]: !isOpen })}>
        <InputText
          {...getInputProps({ ref: inputRef })}
          className={styles.input}
          testId="map-search-input"
          placeholder={t('map.search', 'Search areas')}
          value={inputValue}
        />
        <ul {...getMenuProps()} className={styles.results} data-test="map-search-results">
          {areasMatching?.map((item, index) => {
            const { type, name, flag } = item.properties
            return (
              <li
                {...getItemProps({ item, index })}
                key={`${item}${index}`}
                data-test={`map-search-result-${index}`}
                className={cx(styles.result, { [styles.highlighted]: highlightedIndex === index })}
              >
                {`${t(`search.searchTypes.${type}`, type)}: ${formatInfoField(name, 'name')}${
                  type === 'port' ? ` (${formatInfoField(flag, 'flag')})` : ''
                }`}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default memo(MapSearch)
