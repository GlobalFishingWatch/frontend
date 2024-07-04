import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { SortableContext } from '@dnd-kit/sortable'
import styles from 'features/workspace/shared/Sections.module.css'
import { selectEventsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import LayerPanelContainer from '../shared/LayerPanelContainer'
import LayerPanel from './EventsLayerPanel'

function EventsLayerSection(): React.ReactElement | null {
  const { t } = useTranslation()
  const dataviews = useSelector(selectEventsDataviews)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

  if (!dataviews || dataviews.length === 0) {
    return null
  }

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={cx('print-hidden', styles.sectionTitle)}>{t('common.events', 'Events')}</h2>
      </div>

      <SortableContext items={dataviews}>
        {dataviews?.map((dataview) => (
          <LayerPanelContainer key={dataview.id} dataview={dataview}>
            <LayerPanel dataview={dataview} />
          </LayerPanelContainer>
        ))}
      </SortableContext>
    </div>
  )
}

export default EventsLayerSection
