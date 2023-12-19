import { useSelector } from 'react-redux'
import { Popup } from 'react-map-gl'
import { useTranslation } from 'react-i18next'
import { KeyboardEventHandler, useState } from 'react'
import { Button, Icon, InputText } from '@globalfishingwatch/ui-components'
import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import { useMapErrorNotification } from 'features/map/error-notification/error-notification.hooks'
import { loadSpreadsheetDoc } from 'utils/spreadsheet'
import { selectUserData } from 'features/user/user.slice'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { selectErrorNotification } from './error-notification.slice'
import styles from './ErrorNotification.module.css'

const ERRORS_SPREADSHEET_ID = '1VzEjTiSJrbwBfZrhaSFwZgHClxKkwN9E0rrfFR8bw2c'
const ERRORS_SHEET_TITLE = 'errors'

const ErrorNotification = () => {
  const { t } = useTranslation()
  const errorNotification = useSelector(selectErrorNotification)
  const { resetErrorNotification, setErrorNotification, setNotifyingError } =
    useMapErrorNotification()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const userData = useSelector(selectUserData)

  if (!errorNotification) {
    return null
  }

  const onConfirmClick = async () => {
    setLoading(true)
    try {
      const feedbackSpreadsheetDoc = await loadSpreadsheetDoc(ERRORS_SPREADSHEET_ID)
      // loads document properties and worksheets
      const sheet = feedbackSpreadsheetDoc.sheetsByTitle[ERRORS_SHEET_TITLE]
      const date = new Date()
      const annotationURL = `&mapAnnotations[0][lon]=${
        errorNotification.longitude
      }&mapAnnotations[0][lat]=${
        errorNotification.latitude
      }&mapAnnotations[0][clr]=%23ffffff&mapAnnotations[0][label]=${
        errorNotification.label
      }&mapAnnotations[0][id]=${date.getTime()}`
      const finalErrorData = {
        ...errorNotification,
        date: date.toISOString(),
        url: `${window.location.href}${annotationURL}`,
        userId: userData?.id || GUEST_USER_TYPE,
        email: userData?.email || EMPTY_FIELD_PLACEHOLDER,
        name: userData?.firstName
          ? `${userData.firstName} ${userData.lastName}`
          : EMPTY_FIELD_PLACEHOLDER,
      }
      await sheet.addRow(finalErrorData)
      setLoading(false)
      setSuccess(true)
      setTimeout(onClose, 1000)
    } catch (e: any) {
      setLoading(false)
      onClose()
      console.error('Error: ', e)
    }
  }

  const onClose = () => {
    resetErrorNotification()
    setNotifyingError(false)
    setSuccess(false)
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      onConfirmClick()
    }
  }

  return (
    <Popup
      latitude={errorNotification.latitude as number}
      longitude={errorNotification.longitude as number}
      closeButton={true}
      closeOnClick={false}
      onClose={onClose}
      className={styles.popup}
    >
      <div className={styles.popupContent}>
        <InputText
          label="error description"
          value={errorNotification?.label || ''}
          onChange={(e) => setErrorNotification({ label: e.target.value })}
          placeholder={t(
            'map.annotationPlaceholder',
            'Please describe the error as detailed as possible'
          )}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
        <div className={styles.popupButtons}>
          <Button
            onClick={onConfirmClick}
            className={styles.confirmBtn}
            disabled={!errorNotification.label}
            loading={loading}
          >
            {success ? (
              <Icon icon="tick" className={styles.successIcon} />
            ) : (
              t('common.confirm', 'Confirm')
            )}
          </Button>
        </div>
      </div>
    </Popup>
  )
}

export default ErrorNotification
