import type { ReactNode } from 'react'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Icon, Tooltip } from '@globalfishingwatch/ui-components'

import { CONTEXT_LAYERS_DATAVIEWS } from 'data/workspaces'
import { getDatasetTypeIcon } from 'features/datasets/datasets.utils'

import { useDataviewInstancesConnect } from '../workspace.hook'

import styles from './Title.module.css'

type TitleProps = {
  dataview: UrlDataviewInstance
  className: string
  classNameActive: string
  title: string | ReactNode
  onToggle?: () => void
  toggleVisibility?: boolean
  showIcon?: boolean
  showTooltip?: boolean
}

const Title = (props: TitleProps) => {
  const {
    dataview,
    className,
    classNameActive,
    title,
    onToggle,
    toggleVisibility = true,
    showIcon = false,
    showTooltip = true,
  } = props
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const layerActive = dataview?.config?.visible ?? true
  const datasetIcon = dataview?.datasets?.[0] && getDatasetTypeIcon(dataview?.datasets?.[0])

  const onToggleLayerActive = () => {
    if (toggleVisibility) {
      upsertDataviewInstance({
        id: dataview.id,
        config: {
          visible: !layerActive,
        },
      })
    }
    if (onToggle) {
      onToggle()
    }
  }

  return (
    <Tooltip content={showTooltip && (title as string).length > 20 ? title : ''}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <h3
        className={cx(styles.titleSpan, className, {
          [classNameActive]: layerActive,
        })}
        onClick={onToggleLayerActive}
      >
        {showIcon &&
          datasetIcon &&
          !CONTEXT_LAYERS_DATAVIEWS.includes(dataview.dataviewId as string) && (
            <Icon icon={datasetIcon} />
          )}
        {title}
      </h3>
    </Tooltip>
  )
}

export default Title
