import { useCallback } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import type { DatasetLayer} from 'features/layers/layers.hooks';
import { useLayersConfig } from 'features/layers/layers.hooks'

type RemoveProps = {
  className?: string
  layer?: DatasetLayer
  onClick?: (e: any) => void
}

const Remove = ({ onClick, className, layer }: RemoveProps) => {
  const { removeLayer } = useLayersConfig()

  const onClickInternal = useCallback(
    (e: any) => {
      if (onClick) {
        onClick(e)
        return
      }
      if (layer) {
        removeLayer(layer.id)
      }
    },
    [onClick, layer, removeLayer]
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
