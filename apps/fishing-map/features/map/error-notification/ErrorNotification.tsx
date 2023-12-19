import { useSelector } from 'react-redux'
import { Popup } from 'react-map-gl'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { stringify } from 'qs'
import { Button, Icon, InputText } from '@globalfishingwatch/ui-components'
import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import { useEventKeyListener } from '@globalfishingwatch/react-hooks'
import { MapAnnotation } from '@globalfishingwatch/layer-composer'
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
  const onConfirmClick = async () => {
    if (!errorNotification) {
      return
    }
    setLoading(true)
    try {
      const feedbackSpreadsheetDoc = await loadSpreadsheetDoc(ERRORS_SPREADSHEET_ID)
      const sheet = feedbackSpreadsheetDoc.sheetsByTitle[ERRORS_SHEET_TITLE]
      const date = new Date()
      const mapAnnotation: MapAnnotation[] = [
        {
          id: date.getTime(),
          lat: errorNotification.latitude,
          lon: errorNotification.longitude,
          label: errorNotification.label,
        },
      ]
      const finalErrorData = {
        ...errorNotification,
        date: date.toISOString(),
        url: `${window.location.href}${stringify(mapAnnotation)}`,
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
  const ref = useEventKeyListener(['Enter'], onConfirmClick)

  if (!errorNotification) {
    return null
  }

  const onClose = () => {
    resetErrorNotification()
    setNotifyingError(false)
    setSuccess(false)
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
      <div className={styles.popupContent} ref={ref}>
        <InputText
          label={t('map.errorLabel', 'Error description')}
          value={errorNotification?.label || ''}
          onChange={(e) => setErrorNotification({ label: e.target.value })}
          placeholder={t(
            'map.errorPlaceholder',
            'Please describe the error as detailed as possible'
          )}
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
