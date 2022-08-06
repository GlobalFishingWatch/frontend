import { useCallback } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import { DatasetLayer, useMapLayersConfig } from 'features/layers/layers.hooks'

type RemoveProps = {
  className?: string
  layer?: DatasetLayer
  onClick?: (e: any) => void
}

const Remove = ({ onClick, className, layer }: RemoveProps) => {
  const { removeMapLayer } = useMapLayersConfig()

  const onClickInternal = useCallback(
    (e: any) => {
      if (onClick) {
        onClick(e)
        return
      }
      if (layer) {
        removeMapLayer(layer.id)
      }
    },
    [onClick, layer, removeMapLayer]
  )

  return (
    <IconButton
      icon="delete"
      size="small"
      tooltip="Remove layer"
      tooltipPlacement="top"
      onClick={onClickInternal}
      className={className}
    />
  )
}

export default Remove
