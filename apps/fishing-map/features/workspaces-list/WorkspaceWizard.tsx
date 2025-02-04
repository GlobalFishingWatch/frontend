import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import type { UseComboboxStateChange } from 'downshift'
import { useCombobox } from 'downshift'
import Link from 'redux-first-router-link'

import type { Dataview } from '@globalfishingwatch/api-types'
import type { OceanArea, OceanAreaLocale } from '@globalfishingwatch/ocean-areas'
import { searchOceanAreas } from '@globalfishingwatch/ocean-areas'
import { Icon, IconButton, InputText } from '@globalfishingwatch/ui-components'

import {
  MARINE_MANAGER_DATAVIEWS,
  MARINE_MANAGER_DATAVIEWS_INSTANCES,
  WIZARD_TEMPLATE_ID,
} from 'data/default-workspaces/marine-manager'
import {
  EEZ_DATAVIEW_INSTANCE_ID,
  MPA_DATAVIEW_INSTANCE_ID,
  WorkspaceCategory,
} from 'data/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import { fetchDataviewsByIdsThunk, selectAllDataviews } from 'features/dataviews/dataviews.slice'
import { t as trans } from 'features/i18n/i18n'
import { getMapCoordinatesFromBounds, useMapFitBounds } from 'features/map/map-bounds.hooks'
import { useDeckMap } from 'features/map/map-context.hooks'
import { useMapViewState } from 'features/map/map-viewport.hooks'
import { WORKSPACE, WORKSPACE_REPORT } from 'routes/routes'
import type { Bbox } from 'types'
import { getEventLabel } from 'utils/analytics'

import styles from './WorkspaceWizard.module.css'

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

function WorkspaceWizard() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const fitBounds = useMapFitBounds()
  const map = useDeckMap()
  const viewState = useMapViewState()
  const dataviews = useSelector(selectAllDataviews)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [areasMatching, setAreasMatching] = useState<OceanArea[]>([])
  const [selectedItem, setSelectedItem] = useState<OceanArea | null>(null)
  const [inputSearch, setInputSearch] = useState<string>('')

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
      fitBounds([-90, -180, 90, 180])
    } else {
      updateMatchingAreas(inputValue as string)
    }
    setInputSearch(inputValue as string)
  }

  const onSelectResult = ({ selectedItem }: UseComboboxStateChange<OceanArea>) => {
    trackEvent({
      category: TrackCategory.WorkspaceManagement,
      action: 'Uses marine manager workspace wizard',
      label: getEventLabel([inputSearch, selectedItem?.properties?.name || '']),
    })
    setSelectedItem(selectedItem as any)
    setAreasMatching([])
  }

  const onSearchClick = () => {
    if (selectedItem) {
      const bounds = selectedItem?.properties.bounds
      if (bounds) {
        fitBounds(bounds)
      }
    }
  }

  const onHighlightedIndexChange = ({ highlightedIndex }: UseComboboxStateChange<OceanArea>) => {
    const highlightedArea = areasMatching[highlightedIndex as number]
    const bounds = highlightedArea?.properties.bounds
    if (bounds) {
      fitBounds(bounds)
    }
  }

  useEffect(() => {
    const fetchMarineManagerData = async () => {
      const marineManagerDataviews = MARINE_MANAGER_DATAVIEWS.map((d) => d.dataviewId)
      const { payload } = await dispatch(fetchDataviewsByIdsThunk(marineManagerDataviews))
      if (payload) {
        const datasetsIds = getDatasetsInDataviews(payload as Dataview[])
        if (datasetsIds?.length) {
          dispatch(fetchDatasetsByIdsThunk({ ids: datasetsIds }))
        }
      }
    }
    fetchMarineManagerData()
  }, [dispatch])

  const { getMenuProps, getInputProps, getItemProps, highlightedIndex, inputValue, isOpen } =
    useCombobox({
      selectedItem,
      items: areasMatching,
      itemToString: getItemLabel,
      onInputValueChange: onInputChange,
      onSelectedItemChange: onSelectResult,
      onHighlightedIndexChange: onHighlightedIndexChange,
    })

  const onInputBlur = () => {
    if (inputValue !== getItemLabel(selectedItem)) {
      setSelectedItem(null)
      setAreasMatching([])
    }
  }
  const linkToArea = useMemo(() => {
    const linkViewport = selectedItem
      ? getMapCoordinatesFromBounds(selectedItem.properties?.bounds as Bbox)
      : viewState

    return {
      type: WORKSPACE,
      payload: {
        category: WorkspaceCategory.MarineManager,
        workspaceId: WIZARD_TEMPLATE_ID,
      },
      query: {
        ...linkViewport,
        daysFromLatest: 90,
        dataviewInstances: [
          {
            id: EEZ_DATAVIEW_INSTANCE_ID,
            config: { visible: selectedItem?.properties?.type === 'eez' },
          },
          {
            id: MPA_DATAVIEW_INSTANCE_ID,
            config: { visible: selectedItem?.properties?.type === 'mpa' },
          },
          ...MARINE_MANAGER_DATAVIEWS_INSTANCES,
        ],
      },
      replaceQuery: true,
    }
  }, [selectedItem, viewState])

  const linkToReport = useMemo(() => {
    if (!selectedItem || selectedItem?.properties?.type === 'ocean') {
      return null
    }
    const dataview = dataviews.find((d) =>
      (d.slug as string).includes(selectedItem?.properties?.type)
    )

    if (!dataview) {
      return null
    }
    const datasetId = dataview.datasetsConfig?.[0]?.datasetId
    if (!datasetId) {
      return null
    }
    return {
      ...linkToArea,
      type: WORKSPACE_REPORT,
      payload: {
        ...linkToArea.payload,
        datasetId,
        areaId: selectedItem?.properties?.area,
      },
      query: {
        ...linkToArea.query,
      },
    }
  }, [selectedItem, dataviews, linkToArea])

  const linkLabel = selectedItem
    ? t('workspace.wizard.exploreArea', 'Explore area')
    : t('workspace.wizard.exploreGlobal', 'Explore global')

  return (
    <div className={styles.wizardContainer}>
      <div
        className={cx(styles.inputContainer, { [styles.open]: isOpen && areasMatching.length > 0 })}
      >
        <label>
          {t('workspace.wizard.title', 'Setup a marine manager workspace for any area globally')}
        </label>
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
            onClick={onSearchClick}
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
      <div className={styles.actions}>
        <div>
          <p className={styles.hint}>
            <Icon icon="magic" />
            {t('workspace.wizard.help', 'You can move the map and update your workspace later')}
          </p>
        </div>
        <div className={styles.linksContainer}>
          {selectedItem && linkToReport && (
            <Link to={linkToReport} target="_self" className={cx(styles.confirmBtn)}>
              {t('analysis.see', 'See report')}
            </Link>
          )}
          <Link to={linkToArea} target="_self" className={cx(styles.confirmBtn)}>
            {linkLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceWizard
