import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { TagItem } from '@globalfishingwatch/ui-components'
import { TagList } from '@globalfishingwatch/ui-components'

import { VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectVesselsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

import styles from '../shared/LayerFilters.module.css'

type LayerFiltersProps = {
  dataview: UrlDataviewInstance
}

function TurningTidesTags({ dataview }: LayerFiltersProps) {
  const { t } = useTranslation()
  const vesselDataviews = useSelector(selectVesselsDataviews)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const vesselsTags = dataview.config?.filters?.id?.map((id: string) => ({
    id: id.replace(VESSEL_LAYER_PREFIX, ''),
    label: vesselDataviews.find((v) => v.id.includes(id))?.config?.name || id,
  }))

  const onRemoveFilterClick = (tag: TagItem, tags: TagItem[]) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        filters: {
          ...(dataview.config?.filters || {}),
          id: tags.length ? tags.map((t) => t.id) : undefined,
        },
      },
    })
  }

  if (!vesselsTags?.length) {
    return null
  }

  return (
    <div className={cx(styles.filter)}>
      <label>{t('common.vessels')}</label>
      <TagList
        tags={vesselsTags}
        color={dataview.config?.color}
        className={styles.tagList}
        onRemove={onRemoveFilterClick}
      />
    </div>
  )
}

export default TurningTidesTags
