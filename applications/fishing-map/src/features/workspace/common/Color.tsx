import React from 'react'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import ColorBar, {
  ColorBarOption,
  LineColorBarOptions,
} from '@globalfishingwatch/ui-components/dist/color-bar'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import ExpandedContainer from '../shared/ExpandedContainer'

type ColorProps = {
  open: boolean
  dataview: UrlDataviewInstance
  onColorClick: (color: ColorBarOption) => void
  onToggleClick: (e: any) => void
  onClickOutside: () => void
}

const Color = (props: ColorProps) => {
  const { open, dataview, onToggleClick, onColorClick, onClickOutside } = props
  const { t } = useTranslation()
  return (
    <ExpandedContainer
      visible={open}
      onClickOutside={onClickOutside}
      component={
        <ColorBar
          colorBarOptions={LineColorBarOptions}
          selectedColor={dataview.config?.color}
          onColorClick={onColorClick}
        />
      }
    >
      <IconButton
        icon={open ? 'color-picker' : 'color-picker-filled'}
        size="small"
        style={open ? {} : { color: dataview.config?.color }}
        tooltip={t('layer.color_change', 'Change color')}
        tooltipPlacement="top"
        onClick={onToggleClick}
        className={styles.actionButton}
      />
    </ExpandedContainer>
  )
}

export default Color
