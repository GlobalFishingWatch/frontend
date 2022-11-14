import { useCallback, useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useCombobox, UseComboboxStateChange } from 'downshift'
import bbox from '@turf/bbox'
import { matchSorter } from 'match-sorter'
import { useSelector } from 'react-redux'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { Button, Icon, IconButton, InputText } from '@globalfishingwatch/ui-components'
import { Bbox, wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import {
  DatasetArea,
  fetchDatasetAreasThunk,
  selectDatasetAreasById,
} from 'features/areas/areas.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import styles from './WorkspaceWizard.module.css'

const MAX_RESULTS_NUMBER = 10
const WIZARD_AREAS_DATASET = 'public-mpa-all'

function WorkspaceWizard() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const fitBounds = useMapFitBounds()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [query, setQuery] = useState<string>('')
  const [areasMatching, setAreasMatching] = useState<DatasetArea[]>([])
  const datasetAreas = useSelector(selectDatasetAreasById(WIZARD_AREAS_DATASET))
  const debouncedQuery = useDebounce(query, 300)

  const fetchDatasetAreas = () => {
    if (
      datasetAreas?.status !== AsyncReducerStatus.Finished &&
      datasetAreas?.status !== AsyncReducerStatus.Loading &&
      !datasetAreas?.data?.length
    ) {
      dispatch(fetchDatasetAreasThunk({ datasetId: WIZARD_AREAS_DATASET }))
    }
  }

  const onInputChange = ({ type, inputValue }: UseComboboxStateChange<DatasetArea>) => {
    if (type === '__item_click__' || type === '__input_keydown_enter__' || !inputValue) {
      setQuery('')
      setAreasMatching([])
    } else {
      setQuery(inputValue)
    }
  }

  const onSelectResult = ({ selectedItem }: UseComboboxStateChange<DatasetArea>) => {
    const bounds = selectedItem?.bbox
    if (bounds) {
      const wrappedBounds = wrapBBoxLongitudes(bbox(bounds) as Bbox)
      fitBounds(wrappedBounds)
    }
  }

  const onConfirmClick = useCallback((e) => {
    console.log('TODO: save workspsace')
  }, [])

  useEffect(() => {
    if (!datasetAreas?.data || !debouncedQuery) {
      setAreasMatching([])
    } else {
      const matchingAreas = matchSorter(datasetAreas?.data, debouncedQuery, {
        keys: ['label'],
      }).slice(0, MAX_RESULTS_NUMBER)
      setAreasMatching(matchingAreas)
    }
  }, [datasetAreas?.data, debouncedQuery])

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
    itemToString: (item: DatasetArea | null): string => (item ? item.label : ''),
    onInputValueChange: onInputChange,
    onSelectedItemChange: onSelectResult,
  })

  return (
    <div className={styles.wizardContainer} {...getComboboxProps()}>
      <div className={styles.inputContainer}>
        <label>
          {t('workspace.wizard.title', 'Setup a marine manager workspace for any area globally')}
        </label>
        <InputText
          {...getInputProps({ ref: inputRef })}
          className={styles.input}
          placeholder={t('map.search', 'Search areas')}
          onFocus={fetchDatasetAreas}
          value={inputValue}
        />
        <IconButton
          icon="search"
          loading={datasetAreas?.status === AsyncReducerStatus.Loading}
          className={cx(styles.search, { [styles.active]: isOpen })}
        ></IconButton>
      </div>
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
      <div className={styles.actions}>
        <p className={styles.hint}>
          <Icon icon="info" />
          {t('workspace.wizard.help', 'You can move the map and update your workspace later')}
        </p>
        <Button onClick={onConfirmClick}>{t('common.confirm', 'Confirm')}</Button>
      </div>
    </div>
  )
}

export default WorkspaceWizard
