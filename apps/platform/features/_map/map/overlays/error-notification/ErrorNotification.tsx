import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import { useEventKeyListener } from '@globalfishingwatch/react-hooks'
import { Button, Icon, InputText } from '@globalfishingwatch/ui-components'

import { WORKSPACE_ENV } from 'data/workspace-env'
import PopupWrapper from 'features/_map/map/popups/PopupWrapper'
import { selectIsGuestUser, selectUserData } from 'features/_user/selectors/user.selectors'
import { postFeedback } from 'features/feedback/feedback.utils'
import { getCurrentAppUrl } from 'router/routes.utils'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import { useMapErrorNotification } from './error-notification.hooks'

import styles from './ErrorNotification.module.css'

const ErrorNotification = (): React.ReactNode | null => {
  const { t } = useTranslation()
  const { errorNotification, resetErrorNotification, setErrorNotification, setNotifyingErrorEdit } =
    useMapErrorNotification()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const userData = useSelector(selectUserData)
  const isGuest = useSelector(selectIsGuestUser)

  const onClose = () => {
    resetErrorNotification()
    setNotifyingErrorEdit(false)
    setSuccess(false)
  }

  const onConfirmClick = async () => {
    if (!errorNotification) {
      return
    }
    setLoading(true)
    try {
      const date = new Date()
      const finalErrorData = {
        latitude: errorNotification.lat,
        longitude: errorNotification.lon,
        label: errorNotification.label,
        date: date.toISOString(),
        url: getCurrentAppUrl(),
        userId: userData?.id || GUEST_USER_TYPE,
        email: userData?.email || EMPTY_FIELD_PLACEHOLDER,
        environment: WORKSPACE_ENV,
        name: userData?.firstName
          ? `${userData.firstName} ${userData.lastName}`
          : EMPTY_FIELD_PLACEHOLDER,
      }
      await postFeedback({ type: 'error', data: finalErrorData, isGuest })
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

  if (!errorNotification) {
    return null
  }

  return (
    <div onPointerUp={(event) => event.preventDefault()}>
      <PopupWrapper
        showClose
        onClose={onClose}
        latitude={Number(errorNotification.lat)}
        longitude={Number(errorNotification.lon)}
      >
        <div className={styles.popupContent} ref={ref}>
          <InputText
            label={t((t) => t.map.errorLabel)}
            value={errorNotification?.label || ''}
            onChange={(e) => setErrorNotification({ label: e.target.value })}
            placeholder={t((t) => t.map.errorPlaceholder)}
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
                t((t) => t.common.confirm)
              )}
            </Button>
          </div>
        </div>
      </PopupWrapper>
    </div>
  )
}

export default ErrorNotification
