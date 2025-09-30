import type { KeyboardEventHandler } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import type { UseComboboxStateChange } from 'downshift'
import { useCombobox } from 'downshift'

import type { Dataview } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { OceanArea, OceanAreaLocale } from '@globalfishingwatch/ocean-areas'
import { InputText } from '@globalfishingwatch/ui-components'

import { OCEAN_AREAS_DATAVIEWS } from 'data/dataviews'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import { getDataviewInstanceFromDataview } from 'features/dataviews/dataviews.utils'
import { selectContextAreasDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { t as trans } from 'features/i18n/i18n'
import { ReportCategory } from 'features/reports/reports.types'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { useOceanAreas } from 'hooks/ocean-areas'
import { PORT_REPORT, WORKSPACE_REPORT } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'
import { selectLocationQuery } from 'routes/routes.selectors'
import { getEventLabel } from 'utils/analytics'
import { formatInfoField, upperFirst } from 'utils/info'

import styles from './AreaReportSearch.module.css'

const MAX_RESULTS_NUMBER = 10

const getItemLabel = (item: OceanArea | null) => {
  if (!item) return ''
  const name = item.properties?.name ? formatInfoField(item.properties?.name, 'name') : ''
  return `${name} (${trans(
    `layer.areas.${item.properties?.type}` as any,
    upperFirst(item.properties?.type)
  )})`
}

function AreaReportSearch({ className }: { className?: string }) {
  const { t, i18n } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [areasMatching, setAreasMatching] = useState<OceanArea[]>([])
  const [selectedItem, setSelectedItem] = useState<OceanArea | null>(null)
  const [inputSearch, setInputSearch] = useState<string>('')
  const workspace = useSelector(selectWorkspace)
  const contextAreasDataviews = useSelector(selectContextAreasDataviews)
  const allDataviews = useSelector(selectAllDataviews)
  const query = useSelector(selectLocationQuery)
  const { searchOceanAreas } = useOceanAreas()
  const { dispatchLocation } = useLocationConnect()

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

  const navigateToAreaReport = (area: OceanArea) => {
    const dataview: Dataview | UrlDataviewInstance | undefined =
      contextAreasDataviews?.find((dataview) => dataview.slug?.includes(area.properties?.type)) ||
      allDataviews.find(
        (dataview) =>
          OCEAN_AREAS_DATAVIEWS.includes(dataview.slug as any) &&
          dataview.slug?.includes(area.properties?.type)
      )

    if (dataview) {
      const datasetId = dataview.datasetsConfig?.[0]?.datasetId
      if (datasetId) {
        const dataviewInstance = (query.dataviewInstances || []).find(
          (d: UrlDataviewInstance) => d.id === dataview?.id
        )
        let dataviewInstances: UrlDataviewInstance[] = []
        if (dataviewInstance) {
          dataviewInstances = (query.dataviewInstances || []).map((d: UrlDataviewInstance) => {
            if (d.id === dataviewInstance.id) {
              return {
                ...d,
                config: {
                  ...d.config,
                  visible: true,
                },
              }
            }
            return d
          })
        } else {
          const newDataviewInstance = getDataviewInstanceFromDataview(dataview as Dataview)
          dataviewInstances = [
            ...(query.dataviewInstances || []),
            { ...newDataviewInstance, config: { visible: true } },
          ]
        }
        if (area.properties?.type === 'port') {
          dispatchLocation(PORT_REPORT, {
            payload: {
              category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
              workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
              portId: area.properties.area,
            },
            query: {
              ...query,
              reportCategory: ReportCategory.Events,
              portsReportName: area.properties.name,
              portsReportCountry: area.properties.area?.toString().split('-')[0]?.toUpperCase(),
              portsReportDatasetId: datasetId,
              dataviewInstances,
            },
          })
        } else {
          dispatchLocation(WORKSPACE_REPORT, {
            payload: { datasetId, areaId: area.properties.area },
            query: {
              ...query,
              dataviewInstances,
            },
          })
        }
      } else {
        console.warn('No datasetId found for area', area)
      }
    } else {
      console.warn('No dataview found for area', area)
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
        className
      )}
    >
      <div className={styles.comboContainer}>
        <InputText
          {...inputProps}
          className={styles.input}
          placeholder={t('map.search')}
          onBlur={onInputBlur}
          onKeyDown={handleKeyDown}
          inputSize="small"
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
