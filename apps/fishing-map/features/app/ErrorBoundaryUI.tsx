import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Button } from '@globalfishingwatch/ui-components'

import FeedbackModal from 'features/feedback/FeedbackModal'
import { selectFeedbackModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { selectIsGFWUser, selectUserData } from 'features/user/selectors/user.selectors'

import { useAppDispatch } from './app.hooks'

import styles from './ErrorBoundary.module.css'

interface ErrorBoundaryUIProps {
  error: Error
}

export default function ErrorBoundaryUI({ error }: ErrorBoundaryUIProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [showError, setShowError] = useState(false)
  const userData = useSelector(selectUserData)
  const modalFeedbackOpen = useSelector(selectFeedbackModalOpen)
  const isGFWUser = useSelector(selectIsGFWUser)
  const { message, stack } = error
  const errorInfo = [message, stack, document.URL]

  const onFeedbackClick = useCallback(() => {
    if (userData) {
      dispatch(setModalOpen({ id: 'feedback', open: true }))
    }
  }, [dispatch, userData])

  return (
    <Fragment>
      <div className={styles.errorBoundary}>
        <h1 className={styles.title}>{t('errors.genericShort')}</h1>
        <div>
          <Button type="secondary" onClick={onFeedbackClick}>
            {t('errors.reportError')}
          </Button>{' '}
        </div>
        {isGFWUser && (
          <div>
            <Button type="secondary" size="small" onClick={() => setShowError(!showError)}>
              {t('errors.showError')} ▾
            </Button>
          </div>
        )}
      </div>
      <div className={styles.error}>
        {showError && errorInfo.map((info, i) => <div key={i}>{info}</div>)}
      </div>
      {modalFeedbackOpen && (
        <FeedbackModal
          isOpen={modalFeedbackOpen}
          onClose={() => dispatch(setModalOpen({ id: 'feedback', open: false }))}
        />
      )}
    </Fragment>
  )
}
