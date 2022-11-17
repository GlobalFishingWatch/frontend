import { useState, useEffect, useRef, useMemo } from 'react'
import cx from 'classnames'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { useCombobox, UseComboboxStateChange } from 'downshift'
import { matchSorter } from 'match-sorter'
import { useSelector } from 'react-redux'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { Icon, IconButton, InputText } from '@globalfishingwatch/ui-components'
import { wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import {
  DEFAULT_CONTEXT_SOURCE_LAYER,
  getContextSourceId,
} from '@globalfishingwatch/layer-composer'
import { getMapCoordinatesFromBounds, useMapFitBounds } from 'features/map/map-viewport.hooks'
import {
  DatasetArea,
  fetchDatasetAreasThunk,
  selectDatasetAreasById,
} from 'features/areas/areas.slice'
import {
  MARINE_MANAGER_DATAVIEWS,
  MARINE_MANAGER_DATAVIEWS_INSTANCES,
  WIZARD_TEMPLATE_ID,
} from 'data/default-workspaces/marine-manager'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import useMapInstance from 'features/map/map-context.hooks'
import { selectMarineManagerGenerators } from 'features/map/map.selectors'
import { MPA_DATAVIEW_INSTANCE_ID, WorkspaceCategories } from 'data/workspaces'
import { AsyncReducerStatus } from 'utils/async-slice'
import { WORKSPACE, WORKSPACES_LIST } from 'routes/routes'
import styles from './WorkspaceWizard.module.css'

const MAX_RESULTS_NUMBER = 10
const WIZARD_AREAS_DATASET = 'public-mpa-all'

function WorkspaceWizard() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const fitBounds = useMapFitBounds()
  const map = useMapInstance()
  const { updateFeatureState, cleanFeatureState } = useFeatureState(map)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [areasMatching, setAreasMatching] = useState<DatasetArea[]>([])
  const [selectedItem, setSelectedItem] = useState<DatasetArea>(null)
  const datasetAreas = useSelector(selectDatasetAreasById(WIZARD_AREAS_DATASET))
  const marineManagerGenerators = useSelector(selectMarineManagerGenerators)

  const fetchDatasetAreas = () => {
    if (
      datasetAreas?.status !== AsyncReducerStatus.Finished &&
      datasetAreas?.status !== AsyncReducerStatus.Loading &&
      !datasetAreas?.data?.length
    ) {
      dispatch(fetchDatasetAreasThunk({ datasetId: WIZARD_AREAS_DATASET }))
    }
  }

  const updateMatchingAreas = (areas: DatasetArea[], inputValue: string) => {
    const matchingAreas = inputValue
      ? matchSorter(areas, inputValue, {
          keys: ['label'],
        }).slice(0, MAX_RESULTS_NUMBER)
      : []
    setAreasMatching(matchingAreas)
  }
  const onInputChange = ({ inputValue }: UseComboboxStateChange<DatasetArea>) => {
    if (inputValue === '') {
      setSelectedItem(null)
      setAreasMatching([])
      fitBounds([-90, -180, 90, 180])
    } else {
      updateMatchingAreas(datasetAreas?.data, inputValue)
      cleanFeatureState('highlight')
    }
  }

  const onSelectResult = ({ selectedItem }: UseComboboxStateChange<DatasetArea>) => {
    setSelectedItem(selectedItem)
    setAreasMatching([])
    const id = selectedItem?.id
    const mpaSourceId = getContextSourceId(
      marineManagerGenerators?.find((g) => g.datasetId === WIZARD_AREAS_DATASET)
    )
    if (mpaSourceId) {
      const featureState = {
        source: mpaSourceId,
        sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
        id,
      }
      updateFeatureState([featureState], 'highlight')
    }
  }

  const onHighlightedIndexChange = ({ highlightedIndex }: UseComboboxStateChange<DatasetArea>) => {
    const highlightedArea = areasMatching[highlightedIndex]
    const bounds = highlightedArea?.bbox
    if (bounds) {
      const wrappedBounds = wrapBBoxLongitudes(bounds)
      fitBounds(wrappedBounds)
    }
  }

  useEffect(() => {
    const fetchMarineManagerData = async () => {
      const marineManagerDataviews = MARINE_MANAGER_DATAVIEWS.map((d) => d.dataviewId)
      const { payload } = await dispatch(fetchDataviewsByIdsThunk(marineManagerDataviews))
      if (payload) {
        const datasetsIds = getDatasetsInDataviews(payload)
        if (datasetsIds?.length) {
          dispatch(fetchDatasetsByIdsThunk(datasetsIds))
        }
      }
    }
    fetchMarineManagerData()
  }, [dispatch])

  const {
    getComboboxProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    inputValue,
    isOpen,
  } = useCombobox({
    selectedItem,
    items: areasMatching,
    itemToString: (item: DatasetArea | null): string => (item ? item.label : ''),
    onInputValueChange: onInputChange,
    onSelectedItemChange: onSelectResult,
    onHighlightedIndexChange: onHighlightedIndexChange,
  })

  useEffect(() => {
    if (inputValue) {
      updateMatchingAreas(datasetAreas?.data, inputValue)
    }
    // Only needed to ensure the areas are updated when the request resolves
    // and already has an input text to filter by
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetAreas?.data])

  const onInputBlur = () => {
    if (inputValue !== selectedItem?.label) {
      setSelectedItem(null)
      setAreasMatching([])
    }
  }

  const linkTo = useMemo(() => {
    if (!selectedItem) {
      return { type: WORKSPACES_LIST, payload: { category: WorkspaceCategories.MarineManager } }
    }

    const { latitude, longitude, zoom } = getMapCoordinatesFromBounds(map, selectedItem?.bbox)
    return {
      type: WORKSPACE,
      payload: {
        category: WorkspaceCategories.MarineManager,
        workspaceId: WIZARD_TEMPLATE_ID,
      },
      query: {
        latitude,
        longitude,
        zoom,
        daysFromLatest: 90,
        dataviewInstances: [
          { id: MPA_DATAVIEW_INSTANCE_ID, config: { visible: true } },
          ...MARINE_MANAGER_DATAVIEWS_INSTANCES,
        ],
      },
      replaceQuery: true,
    }
  }, [map, selectedItem])

  const linkDisabled = !selectedItem

  return (
    <div className={styles.wizardContainer} {...getComboboxProps()}>
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
            onFocus={fetchDatasetAreas}
          />
          <IconButton
            icon="search"
            loading={datasetAreas?.status === AsyncReducerStatus.Loading}
            className={cx(styles.search, { [styles.active]: isOpen })}
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
                  {item.label}
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className={styles.actions}>
        <p className={styles.hint}>
          <Icon icon="magic" />
          {t('workspace.wizard.help', 'You can move the map and update your workspace later')}
        </p>
        <Link
          to={linkTo}
          target="_self"
          className={cx(styles.confirmBtn, { [styles.disabled]: linkDisabled })}
          onClick={(e) => {
            if (!selectedItem) e.preventDefault()
          }}
        >
          {t('common.confirm', 'Confirm')}
        </Link>
      </div>
    </div>
  )
}

export default WorkspaceWizard
