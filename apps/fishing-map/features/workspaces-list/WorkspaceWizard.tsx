import { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Icon, InputText } from '@globalfishingwatch/ui-components'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import useViewport from 'features/map/map-viewport.hooks'
import styles from './WorkspacesList.module.css'

function WorkspaceWizard() {
  const { t, i18n } = useTranslation()
  const { setMapCoordinates } = useViewport()
  const [inputText, setInputText] = useState('')
  const debouncedText = useDebounce(inputText, 300)

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
