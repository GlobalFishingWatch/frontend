import type { KeyboardEventHandler } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import type { UseComboboxStateChange } from 'downshift'
import { useCombobox } from 'downshift'

import type { OceanArea, OceanAreaLocale } from '@globalfishingwatch/ocean-areas'
import { InputText } from '@globalfishingwatch/ui-components'

import { useNavigateToAreaReport } from 'features/_reports/shared/area-search/area-report.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { t as trans } from 'features/i18n/i18n'
import { useOceanAreas } from 'hooks/ocean-areas'
import { getEventLabel } from 'utils/analytics'
import { formatInfoField, upperFirst } from 'utils/info'

import styles from './AreaReportSearch.module.css'

const MAX_RESULTS_NUMBER = 10

const getItemLabel = (item: OceanArea | null) => {
  if (!item) return ''
  const name = item.properties?.name ? formatInfoField(item.properties?.name, 'name') : ''
  return `${name} (${trans((t: any) => t.layer.areas[item.properties?.type], {
    defaultValue: upperFirst(item.properties?.type),
  })})`
}

function AreaReportSearch({ className }: { className?: string }) {
  const { t, i18n } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [areasMatching, setAreasMatching] = useState<OceanArea[]>([])
  const [selectedItem, setSelectedItem] = useState<OceanArea | null>(null)
  const [inputSearch, setInputSearch] = useState<string>('')
  const { searchOceanAreas } = useOceanAreas()
  const navigateToAreaReport = useNavigateToAreaReport()

  const updateMatchingAreas = async (inputValue: string) => {
    try {
      const areas = await searchOceanAreas({
        query: inputValue,
        locale: i18n.language as OceanAreaLocale,
      })
      setAreasMatching((areas || []).slice(0, MAX_RESULTS_NUMBER))
    } catch (error) {
      console.error('Error searching ocean areas:', error)
      setAreasMatching([])
    }
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
  // eslint-disable-next-line react-hooks/refs
  const inputProps = getInputProps({ ref: inputRef })

  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === 'Escape') {
      setSelectedItem(null)
      setInputSearch('')
      setAreasMatching([])
      inputRef.current?.blur()
    }
    inputProps.onKeyDown?.(e)
  }

  return (
    <div
      className={cx(
        styles.inputContainer,
        { [styles.open]: isOpen && areasMatching.length > 0 },
        'print-hidden',
        className
      )}
    >
      <div className={styles.comboContainer}>
        <InputText
          {...inputProps}
          className={styles.input}
          placeholder={t((t) => t.map.search)}
          onBlur={onInputBlur}
          onKeyDown={handleKeyDown}
          inputSize="medium"
          type="search"
        />
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
