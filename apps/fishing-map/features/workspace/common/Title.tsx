import { forwardRef, ReactNode, Ref } from 'react'
import cx from 'classnames'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Icon } from '@globalfishingwatch/ui-components'
import { getDatasetTypeIcon } from 'features/datasets/datasets.utils'
import { CONTEXT_LAYERS_DATAVIEWS } from 'data/workspaces'
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
}

const Title = (props: TitleProps, ref: Ref<HTMLHeadingElement>) => {
  const {
    dataview,
    className,
    classNameActive,
    title,
    onToggle,
    toggleVisibility = true,
    showIcon = false,
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
    <h3
      ref={ref}
      className={cx(className, { [classNameActive]: layerActive })}
      onClick={onToggleLayerActive}
    >
      <span className={styles.titleSpan}>
        {showIcon &&
          datasetIcon &&
          !CONTEXT_LAYERS_DATAVIEWS.includes(dataview.dataviewId as string) && (
            <Icon icon={datasetIcon} />
          )}
        {title}
      </span>
    </h3>
  )
}

export default forwardRef(Title)
