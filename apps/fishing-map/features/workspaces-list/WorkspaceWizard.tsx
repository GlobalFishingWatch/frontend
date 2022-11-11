import { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Button, Icon, InputText, Spinner } from '@globalfishingwatch/ui-components'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import useViewport from 'features/map/map-viewport.hooks'
import { fetchDatasetAreasThunk, selectDatasetAreasById } from 'features/areas/areas.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import styles from './WorkspacesList.module.css'

const WIZARD_AREAS_DATASET = 'public-mpa-all'
function WorkspaceWizard() {
  const { t, i18n } = useTranslation()
  const { setMapCoordinates } = useViewport()
  const dispatch = useAppDispatch()
  const [inputText, setInputText] = useState('')
  const datasetAreas = useSelector(selectDatasetAreasById(WIZARD_AREAS_DATASET))
  const debouncedText = useDebounce(inputText, 300)

  useEffect(() => {
    dispatch(fetchDatasetAreasThunk({ datasetId: WIZARD_AREAS_DATASET }))
  }, [dispatch])

  const onInputChange = useCallback((e) => {
    setInputText(e.target.value)
  }, [])

  const onConfirmClick = useCallback((e) => {
    console.log('TODO: save workspsace')
  }, [])

  useEffect(() => {
    if (debouncedText) {
      console.log('reuqest API data with', debouncedText)
    }
  }, [debouncedText])

  return (
    <div className={styles.wizardContainer}>
      <label>
        {t('workspace.wizard.title', 'Setup a marine manager workspace for any area globally')}
      </label>
      <InputText value={inputText} onChange={onInputChange} />
      {datasetAreas?.status === AsyncReducerStatus.Loading && <Spinner />}
      <div>
        <p className={styles.disclaimer}>
          <Icon icon="info" />
          {t('workspace.wizard.help', 'You can move the map and update your workspace later')}
        </p>
        <Button onClick={onConfirmClick}>{t('common.confirm', 'Confirm')}</Button>
      </div>
    </div>
  )
}

export default WorkspaceWizard
