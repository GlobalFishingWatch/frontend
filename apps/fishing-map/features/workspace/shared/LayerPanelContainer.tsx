import cx from 'classnames'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Icon } from '@globalfishingwatch/ui-components'
import HighlightPanel from '../highlight-panel/HighlightPanel'
import styles from './LayerPanel.module.css'
import { DRAGGABLE_ITEM_ID } from './Draggable'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  children: React.ReactElement
  draggable?: boolean
  style?: React.CSSProperties
}

function LayerPanelContainer({
  dataview,
  children,
  draggable = false,
  style = {},
}: LayerPanelProps): React.ReactElement {
  return (
    <div
      style={style}
      className={cx(styles.LayerPanelContainer, { [styles.draggable]: draggable })}
    >
      {draggable && (
        <div className={styles.dragger} id={DRAGGABLE_ITEM_ID}>
          <Icon icon="drag" />
        </div>
      )}
      <div></div>
      {children}
      <HighlightPanel dataviewInstanceId={dataview.id} placement="right" />
    </div>
  )
}

export default LayerPanelContainer
