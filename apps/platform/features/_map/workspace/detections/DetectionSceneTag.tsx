import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { TagList } from '@globalfishingwatch/ui-components'

import { useDataviewInstancesConnect } from 'features/_map/workspace/workspace.hook'

import styles from '../shared/LayerPanel.module.css'

type DetectionSceneTagProps = {
  dataview: UrlDataviewInstance
}

function DetectionSceneTag({ dataview }: DetectionSceneTagProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const sceneId = dataview.config?.highlightedSceneId

  if (!sceneId) {
    return null
  }

  return (
    <div className={cx(styles.filter)}>
      <label className={styles.tagListLabel}>{t((t) => t.detectionScene.highlight)}</label>
      <TagList
        tags={[{ id: sceneId, label: sceneId }]}
        color={dataview.config?.color}
        className={styles.tagList}
        onRemove={() =>
          upsertDataviewInstance({
            id: dataview.id,
            config: { highlightedSceneId: undefined },
          })
        }
      />
    </div>
  )
}

export default DetectionSceneTag
