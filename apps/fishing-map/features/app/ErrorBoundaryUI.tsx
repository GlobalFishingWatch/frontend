import { Fragment, lazy, Suspense, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Button } from '@globalfishingwatch/ui-components'

import { selectFeedbackModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { selectIsGFWUser, selectUserData } from 'features/user/selectors/user.selectors'

import { useAppDispatch } from './app.hooks'

import styles from './ErrorBoundary.module.css'

const FeedbackModal = lazy(() => import('features/feedback/FeedbackModal'))

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

  const onFeedbackClick = useCallback(() => {
    if (userData) {
      dispatch(setModalOpen({ id: 'feedback', open: true }))
    }
  }, [dispatch, userData])

  const goBackClick = useCallback(() => {
    window.history.back()
    window.location.reload()
  }, [])

  return (
    <Fragment>
      <div className={styles.errorBoundary}>
        <h1 className={styles.title}>{t((t) => t.errors.genericShort)}</h1>
        <div>
          <Button onClick={goBackClick}>{t((t) => t.common.back)}</Button>{' '}
          <Button type="secondary" onClick={onFeedbackClick}>
            {t((t) => t.errors.reportError)}
          </Button>{' '}
        </div>
        {isGFWUser && (
          <div>
            <Button type="secondary" size="small" onClick={() => setShowError(!showError)}>
              {t((t) => t.errors.showError)} ▾
            </Button>
          </div>
        )}
      </div>
      <div className={styles.error}>
        {showError && error && (
          <ul>
            {error.message && (
              <li>
                <label>Message:</label> {error.message}
              </li>
            )}
            {error.stack && (
              <li>
                <label>Stack:</label> {error.stack}
              </li>
            )}

            {typeof document !== 'undefined' && (
              <li>
                <label>Url:</label> {document.URL}
              </li>
            )}
          </ul>
        )}
      </div>
      {modalFeedbackOpen && (
        <Suspense fallback={null}>
          <FeedbackModal
            isOpen={modalFeedbackOpen}
            onClose={() => dispatch(setModalOpen({ id: 'feedback', open: false }))}
          />
        </Suspense>
      )}
    </Fragment>
  )
}
