import { forwardRef, ReactNode, Ref } from 'react'
import cx from 'classnames'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Icon } from '@globalfishingwatch/ui-components'
import { getDatasetIcon } from 'features/datasets/datasets.utils'
import { CONTEXT_LAYERS_DATAVIEWS } from 'data/workspaces'
import { useDataviewInstancesConnect } from '../workspace.hook'

type TitleProps = {
  dataview: UrlDataviewInstance
  className: string
  classNameActive: string
  title: string | ReactNode
  onToggle?: () => void
}

const Title = (props: TitleProps, ref: Ref<HTMLHeadingElement>) => {
  const { dataview, className, classNameActive, title, onToggle } = props
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const layerActive = dataview?.config?.visible ?? true
  const datasetIcon = getDatasetIcon(dataview?.datasets?.[0])

  const onToggleLayerActive = () => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        visible: !layerActive,
      },
    })
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
      <span>
        {datasetIcon && !CONTEXT_LAYERS_DATAVIEWS.includes(dataview.dataviewId) && (
          <Icon icon={datasetIcon} style={{ transform: 'translateY(25%)' }} />
        )}
        {title}
      </span>
    </h3>
  )
}

export default forwardRef(Title)
