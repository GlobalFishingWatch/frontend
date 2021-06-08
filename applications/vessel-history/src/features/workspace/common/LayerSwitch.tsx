import { Ref, forwardRef } from 'react'
import cx from 'classnames'
import { Switch } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import styles from './LayerSwitch.module.css'

type LayerSwitchProps = {
  className?: string
  classNameActive?: string
  dataview: UrlDataviewInstance
  disabled?: boolean
  onToggle?: (active: boolean) => void
  title?: string
}

const LayerSwitch = (
  { dataview, className, classNameActive, disabled, onToggle, title }: LayerSwitchProps,
  ref: Ref<HTMLLabelElement>
) => {
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const layerActive = [true, 'true', 1].includes((dataview?.config?.visible ?? true) as any)
  const onToggleLayerActive = () => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        visible: !layerActive,
      },
    })
    if (onToggle) {
      onToggle(!layerActive)
    }
  }
  return (
    <label
      ref={ref}
      className={cx(
        className,
        classNameActive && layerActive ? { [classNameActive]: layerActive } : {}
      )}
    >
      <Switch
        disabled={disabled}
        active={layerActive}
        className={styles.switch}
        onClick={onToggleLayerActive}
        color={dataview.config?.color}
      />
      <h3 className={styles.name}>{title ?? ''}</h3>
    </label>
  )
}

export default forwardRef(LayerSwitch)
