import { useSelector } from 'react-redux'
import cx from 'classnames'

import ContentHeader from 'features/map/content-panel/ContentHeader'
import ContentMarkdown from 'features/map/content-panel/ContentMarkdown'
import { useScrollToTopOnChange } from 'features/map/content-panel/contentPanel.hooks'
import EmptyContent from 'features/map/content-panel/EmptyContent'
import { selectDatasetById } from 'features/map/datasets/datasets.slice'
import { useAppSearch } from 'router/routes.hook'

import styles from '../ContentPanel.module.css'

const UserDatasetInfoContainer = () => {
  const { sidePanelId } = useAppSearch()
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

export default UserDatasetInfoContainer
