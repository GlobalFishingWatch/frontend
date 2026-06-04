import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useGetDataTerminologyContentQuery } from 'queries/data-terminology-api'

import { Spinner } from '@globalfishingwatch/ui-components'

import ContentHeader from 'features/content-panel/ContentHeader'
import ContentMarkdown from 'features/content-panel/ContentMarkdown'
import EmptyContent from 'features/content-panel/EmptyContent'
import { Route } from 'routes/_app'
import type { Locale } from 'types'

import styles from './ContentPanel.module.css'

const DataTerminologyContent = () => {
  const { sidePanelId } = Route.useSearch()
  const { i18n } = useTranslation()

  const { data, isLoading, isError } = useGetDataTerminologyContentQuery({
    id: sidePanelId as string,
    locale: i18n.language as Locale,
  })
  console.log('🚀 ~ DataTerminologyContent ~ data:', data)

  if (isLoading) {
    return <Spinner />
  }
  if (isError || !data) {
    return <EmptyContent />
  }

  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles.header)}>
        <ContentHeader title={data.title} />
        {/*  || t((t) => t.dataTerminology[data.terminologyKey]) */}
      </div>
      <div className={cx(styles.scrollContainer)}>
        <div className={cx(styles.content)}>
          <ContentMarkdown>{data.description}</ContentMarkdown>
        </div>
      </div>
    </div>
  )
}

export default DataTerminologyContent
