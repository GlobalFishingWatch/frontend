import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import HighlightPanel from '../highlight-panel/HighlightPanel'

import styles from './LayerPanel.module.css'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  children: React.ReactElement<any>
}

function LayerPanelContainer({ dataview, children }: LayerPanelProps): React.ReactElement<any> {
  return (
    <div className={styles.LayerPanelContainer}>
      {children}
      <HighlightPanel dataviewInstanceId={dataview.id} placement="right" />
    </div>
  )
}

export default LayerPanelContainer
