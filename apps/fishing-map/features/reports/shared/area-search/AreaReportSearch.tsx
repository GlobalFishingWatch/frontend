import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import type { UseComboboxStateChange } from 'downshift'
import { useCombobox } from 'downshift'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { OceanArea, OceanAreaLocale } from '@globalfishingwatch/ocean-areas'
import { searchOceanAreas } from '@globalfishingwatch/ocean-areas'
import { IconButton, InputText } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectContextAreasDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { t as trans } from 'features/i18n/i18n'
import { WORKSPACE_REPORT } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'
import { selectLocationQuery } from 'routes/routes.selectors'
import { getEventLabel } from 'utils/analytics'

import styles from './AreaReportSearch.module.css'

const MAX_RESULTS_NUMBER = 10

const getItemLabel = (item: OceanArea | null) => {
  if (!item) return ''
  if (item.properties?.type === 'ocean') {
    return item.properties?.name
  }
  return `${item.properties?.name} (${trans(
    `layer.areas.${item.properties?.type}` as any,
    item.properties?.type.toUpperCase()
  )})`
}

function AreaReportSearch() {
  const { t, i18n } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [areasMatching, setAreasMatching] = useState<OceanArea[]>([])
  const [selectedItem, setSelectedItem] = useState<OceanArea | null>(null)
  const [inputSearch, setInputSearch] = useState<string>('')
  const dataviews = useSelector(selectContextAreasDataviews)
  const query = useSelector(selectLocationQuery)
  const { dispatchLocation } = useLocationConnect()

  const updateMatchingAreas = async (inputValue: string) => {
    const matchingAreas = await searchOceanAreas(inputValue, {
      locale: i18n.language as OceanAreaLocale,
    })
    setAreasMatching(matchingAreas.slice(0, MAX_RESULTS_NUMBER))
  }

  const onInputChange = ({ inputValue }: UseComboboxStateChange<OceanArea>) => {
    if (inputValue === '') {
      setSelectedItem(null)
      setAreasMatching([])
    } else {
      updateMatchingAreas(inputValue as string)
    }
    setInputSearch(inputValue as string)
  }

  const navigateToAreaReport = (area: OceanArea) => {
    const dataview = dataviews?.find((dataview) => dataview.slug?.includes(area.properties?.type))
    if (dataview) {
      const datasetId = dataview.datasetsConfig?.[0]?.datasetId
      if (datasetId) {
        const dataviewInstance = (query.dataviewInstances || []).find(
          (d: UrlDataviewInstance) => d.id === dataview.id
        )
        const dataviewInstances = dataviewInstance
          ? query.dataviewInstances.map((d: UrlDataviewInstance) => {
              if (d.id === dataviewInstance.id) {
                return {
                  ...d,
                  config: {
                    ...d.config,
                    visible: true,
                  },
                }
              }
            })
          : [...(query.dataviewInstances || []), { id: dataview.id, config: { visible: true } }]
        dispatchLocation(WORKSPACE_REPORT, {
          payload: { datasetId, areaId: area.properties.area },
          query: {
            ...query,
            dataviewInstances,
          },
        })
      }
    } else {
      console.warn('No dataset found for area', area)
    }
  }

  const onSelectResult = ({ selectedItem, inputValue = '' }: UseComboboxStateChange<OceanArea>) => {
    setAreasMatching([])
    if (selectedItem) {
      setSelectedItem(selectedItem)
      navigateToAreaReport(selectedItem)
      trackEvent({
        category: TrackCategory.Analysis,
        action: 'Search for an area in report',
        label: getEventLabel([inputValue, selectedItem?.properties?.name || '']),
      })
    } else {
      setSelectedItem(null)
    }
  }

  const { getMenuProps, getInputProps, getItemProps, highlightedIndex, inputValue, isOpen } =
    useCombobox({
      inputValue: inputSearch,
      selectedItem,
      items: areasMatching,
      itemToString: getItemLabel,
      onInputValueChange: onInputChange,
      onSelectedItemChange: onSelectResult,
    })

  const onInputBlur = () => {
    if (inputValue !== getItemLabel(selectedItem)) {
      setSelectedItem(null)
      setInputSearch('')
      setAreasMatching([])
    }
  }
  return (
    <div
      className={cx(styles.inputContainer, { [styles.open]: isOpen && areasMatching.length > 0 })}
    >
      <div className={styles.comboContainer}>
        <InputText
          {...getInputProps({ ref: inputRef })}
          className={styles.input}
          placeholder={t('map.search', 'Search areas')}
          onBlur={onInputBlur}
        />
        <IconButton
          icon="search"
          className={cx(styles.search, { [styles.disabled]: isOpen })}
        ></IconButton>
        <ul {...getMenuProps()} className={styles.results}>
          {isOpen &&
            areasMatching?.map((item, index) => (
              <li
                {...getItemProps({ item, index })}
                key={`${item}${index}`}
                className={cx(styles.result, {
                  [styles.highlighted]: highlightedIndex === index,
                })}
              >
                {getItemLabel(item)}
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default AreaReportSearch
