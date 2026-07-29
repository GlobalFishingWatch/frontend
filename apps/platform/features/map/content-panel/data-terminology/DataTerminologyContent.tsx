import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useGetDataTerminologyContentQuery } from 'queries/map/data-terminology-api'

import { Spinner } from '@globalfishingwatch/ui-components'

import ContentHeader from 'features/map/content-panel/ContentHeader'
import ContentMarkdown from 'features/map/content-panel/ContentMarkdown'
import { useScrollToTopOnChange } from 'features/map/content-panel/contentPanel.hooks'
import EmptyContent from 'features/map/content-panel/EmptyContent'
import { useAppSearch } from 'router/routes.hook'
import type { Locale } from 'types'

import styles from '../ContentPanel.module.css'

const DataTerminologyContent = () => {
  const { sidePanelId } = useAppSearch()
  const { i18n, t } = useTranslation()
  const scrollContainerRef = useScrollToTopOnChange<HTMLDivElement>(sidePanelId)

  const { data, isLoading, isError } = useGetDataTerminologyContentQuery({
    id: sidePanelId as string,
    locale: i18n.language as Locale,
  })

  if (isLoading) {
    return <Spinner />
  }
  if (isError || !data) {
    return <EmptyContent />
  }

  const title = data.title
  const labelTranslation = title
    ? t((t: any) => t.vessel[title], { defaultValue: title })
    : t((t: any) => t.common.dataTerminology)

  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles.header)}>
        <ContentHeader title={labelTranslation} />
      </div>
      <div ref={scrollContainerRef} className={cx(styles.scrollContainer)}>
        <div className={cx(styles.content)}>
          <ContentMarkdown>{data.description}</ContentMarkdown>
        </div>
      </div>
    </div>
  )
}

export default DataTerminologyContent
