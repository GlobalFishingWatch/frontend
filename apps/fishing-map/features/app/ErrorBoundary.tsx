import { Component, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Button } from '@globalfishingwatch/ui-components'
import styles from './ErrorBoundary.module.css'

class ErrorBoundary extends Component<any, { error: Error | null }> {
  constructor(props: any) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo)
  }
  render() {
    if (this.state.error) {
      return <ErrorBoundaryUI error={this.state.error} />
    }
    return this.props.children
  }
}

const ErrorBoundaryUI = ({ error }: { error: Error }) => {
  const { t } = useTranslation()
  const [showError, setShowError] = useState(false)
  const { message, stack } = error
  const errorInfo = [message, stack, document.URL]

  const mailto = [
    'mailto:support@globalfishingwatch.org?',
    Object.entries({
      subject: 'Reporting an error',
      body: errorInfo.join('\n'),
    })
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&'),
  ].join('')

  return (
    <div className={styles.errorBoundary}>
      <h1 className={styles.title}>{t('errors.genericShort', 'Something went wrong')}</h1>
      <div>
        <Button type="secondary" size="small" onClick={() => setShowError(!showError)}>
          {t('errors.showError', 'Show error')} ▾
        </Button>
        <div className={styles.error}>
          {showError && errorInfo.map((info, i) => <div key={i}>{info}</div>)}
        </div>
      </div>
      <div className={styles.mailto}>
        <Trans i18nKey="errors.contactUs">
          Please <a href={mailto}>contact us</a> to report the problem.
        </Trans>
      </div>
    </div>
  )
}

export default ErrorBoundary
