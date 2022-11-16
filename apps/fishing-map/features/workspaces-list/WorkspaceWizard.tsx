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
import { HOME, WORKSPACES_LIST } from 'routes/routes'
import { MARINE_MANAGER_DATAVIEWS } from 'data/default-workspaces/marine-manager'
import {
  GLOBAL_CHLOROPHYL_DATAVIEW_ID,
  GLOBAL_SALINITY_DATAVIEW_ID,
  GLOBAL_WATER_TEMPERATURE_DATAVIEW_ID,
  MPA_DATAVIEW_INSTANCE_ID,
  WorkspaceCategories,
} from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import useMapInstance from 'features/map/map-context.hooks'
import { selectMarineManagerGenerators } from 'features/map/map.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
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
  const [query, setQuery] = useState<string>('')
  const [areasMatching, setAreasMatching] = useState<DatasetArea[]>([])
  const [selectedItem, setSelectedItem] = useState<DatasetArea>(null)
  const [workspaceName, setWorkspaceName] = useState<string>('')
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

  const onSearchInputChange = ({
    type,
    inputValue,
    selectedItem,
  }: UseComboboxStateChange<DatasetArea>) => {
    if (type === '__item_click__' || type === '__input_keydown_enter__') {
      setQuery(selectedItem.label)
      setAreasMatching([])
    } else {
      setQuery(inputValue)
      const matchingAreas = inputValue
        ? matchSorter(datasetAreas?.data, inputValue, {
            keys: ['label'],
          }).slice(0, MAX_RESULTS_NUMBER)
        : []
      setAreasMatching(matchingAreas)
      cleanFeatureState('highlight')
    }
    if (inputValue === '') {
      setSelectedItem(null)
    }
  }

  const onNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceName(e.target.value)
  }

  const onSelectResult = ({ selectedItem }: UseComboboxStateChange<DatasetArea>) => {
    setSelectedItem(selectedItem)
    const id = selectedItem?.id
    const mpaSourceId = getContextSourceId(
      marineManagerGenerators.find((g) => g.datasetId === WIZARD_AREAS_DATASET)
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
    inputValue: query,
    items: areasMatching,
    selectedItem: selectedItem,
    itemToString: (item: DatasetArea | null): string => (item ? item.label : ''),
    onInputValueChange: onSearchInputChange,
    onSelectedItemChange: onSelectResult,
    onHighlightedIndexChange: onHighlightedIndexChange,
  })

  const linkTo = useMemo(() => {
    if (!selectedItem) {
      return { type: WORKSPACES_LIST, payload: { category: WorkspaceCategories.MarineManager } }
    }

    const { latitude, longitude, zoom } = getMapCoordinatesFromBounds(map, selectedItem?.bbox)
    return {
      type: HOME,
      payload: {},
      query: {
        latitude,
        longitude,
        zoom,
        daysFromLatest: 90,
        dataviewInstances: [
          {
            id: MPA_DATAVIEW_INSTANCE_ID,
            config: {
              visible: true,
            },
          },
          {
            id: 'water-temp',
            config: {
              visible: false,
            },
            dataviewId: GLOBAL_WATER_TEMPERATURE_DATAVIEW_ID,
          },
          {
            id: 'salinity',
            config: {
              visible: false,
            },
            dataviewId: GLOBAL_SALINITY_DATAVIEW_ID,
          },
          {
            id: 'chlorophyl',
            config: {
              visible: false,
            },
            dataviewId: GLOBAL_CHLOROPHYL_DATAVIEW_ID,
          },
        ],
      },
      replaceQuery: true,
    }
  }, [map, selectedItem])

  const linkDisabled = !selectedItem || workspaceName.length < 3

  return (
    <div className={styles.wizardContainer} {...getComboboxProps()}>
      <div className={cx(styles.inputContainer, { [styles.open]: areasMatching.length > 0 })}>
        <label>
          {t('workspace.wizard.title', 'Setup a marine manager workspace for any area globally')}
        </label>
        <InputText
          {...getInputProps({ ref: inputRef })}
          className={styles.input}
          placeholder={t('map.search', 'Search areas')}
          onFocus={fetchDatasetAreas}
          value={inputValue || ''}
        />
        <IconButton
          icon="search"
          loading={datasetAreas?.status === AsyncReducerStatus.Loading}
          className={cx(styles.search, { [styles.active]: isOpen })}
        ></IconButton>
        <ul {...getMenuProps()} className={styles.results}>
          {areasMatching?.map((item, index) => (
            <li
              {...getItemProps({ item, index })}
              key={`${item}${index}`}
              className={cx(styles.result, { [styles.highlighted]: highlightedIndex === index })}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.inputContainer}>
        {selectedItem && (
          <InputText
            label={t('workspace.wizard.name', 'Give a name to your workspace')}
            placeholder={t('common.name', 'Name')}
            className={styles.input}
            value={workspaceName}
            onChange={onNameInputChange}
            autoFocus
          />
        )}
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
