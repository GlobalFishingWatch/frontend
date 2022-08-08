import { forwardRef, ReactNode, Ref } from 'react'
import cx from 'classnames'
import { DatasetLayer, useMapLayersConfig } from 'features/layers/layers.hooks'

type TitleProps = {
  layer: DatasetLayer
  className: string
  classNameActive: string
  title: string | ReactNode
  onToggle?: () => void
}

const Title = (props: TitleProps, ref: Ref<HTMLHeadingElement>) => {
  const { layer, className, classNameActive, title, onToggle } = props
  const { updateMapLayer } = useMapLayersConfig()
  const layerActive = layer?.config?.visible ?? true

  const onToggleLayerActive = () => {
    updateMapLayer({
      id: layer.id,
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
      <span>{title}</span>
    </h3>
  )
}

export default forwardRef(Title)
