import { useSelector } from 'react-redux'
import cx from 'classnames'

import ContentHeader from 'features/content-panel/ContentHeader'
import ContentMarkdown from 'features/content-panel/ContentMarkdown'
import { useScrollToTopOnChange } from 'features/content-panel/contentPanel.hooks'
import EmptyContent from 'features/content-panel/EmptyContent'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { Route } from 'routes/_app'

import styles from './ContentPanel.module.css'

const UserDatasetContent = () => {
  const { sidePanelId } = Route.useSearch()
  const dataset = useSelector(selectDatasetById(sidePanelId as string))
  const scrollContainerRef = useScrollToTopOnChange<HTMLDivElement>(sidePanelId)

  if (!dataset) return <EmptyContent />

  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles.header)}>
        <ContentHeader title={dataset.name} />
      </div>
      <div ref={scrollContainerRef} className={cx(styles.scrollContainer)}>
        <div className={cx(styles.content)}>
          <ContentMarkdown>{dataset.description}</ContentMarkdown>
        </div>
      </div>
    </div>
  )
}

export default UserDatasetContent
