import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { stringify } from 'qs'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import { URL_STRINGIFY_CONFIG } from '@globalfishingwatch/dataviews-client'
import { useEventKeyListener } from '@globalfishingwatch/react-hooks'
import { Button, Icon, InputText } from '@globalfishingwatch/ui-components'

import { PATH_BASENAME, PUBLIC_WORKSPACE_ENV } from 'data/config'
import PopupWrapper from 'features/map/popups/PopupWrapper'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { selectLocationQuery } from 'routes/routes.selectors'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import type { MapAnnotation } from '../annotations/annotations.types'

import { useMapErrorNotification } from './error-notification.hooks'

import styles from './ErrorNotification.module.css'

const ErrorNotification = (): React.ReactNode | null => {
  const { t } = useTranslation()
  const { errorNotification, resetErrorNotification, setErrorNotification, setNotifyingErrorEdit } =
    useMapErrorNotification()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const locationQuery = useSelector(selectLocationQuery)
  const userData = useSelector(selectUserData)

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
      const mapAnnotations: MapAnnotation[] = [
        {
          id: date.getTime(),
          lat: errorNotification.lat,
          lon: errorNotification.lon,
          label: errorNotification.label,
        },
      ]
      const query = stringify(
        {
          ...locationQuery,
          mapAnnotations,
          mapAnnotationsVisible: true,
        },
        URL_STRINGIFY_CONFIG
      )
      const finalErrorData = {
        latitude: errorNotification.lat,
        longitude: errorNotification.lon,
        label: errorNotification.label,
        date: date.toISOString(),
        url: `${window.location.origin}${window.location.pathname}?${query}`,
        userId: userData?.id || GUEST_USER_TYPE,
        email: userData?.email || EMPTY_FIELD_PLACEHOLDER,
        environment: PUBLIC_WORKSPACE_ENV || 'development',
        name: userData?.firstName
          ? `${userData.firstName} ${userData.lastName}`
          : EMPTY_FIELD_PLACEHOLDER,
      }
      const response = await fetch(`${PATH_BASENAME}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'error', data: finalErrorData }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }
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
      </PopupWrapper>
    </div>
  )
}

export default ErrorNotification
