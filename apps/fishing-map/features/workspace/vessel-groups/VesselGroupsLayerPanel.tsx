import { Fragment, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import Link from 'redux-first-router-link'
import { VesselGroup } from '@globalfishingwatch/api-types'
import { IconButton, ColorBarOption, Tooltip } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import { formatInfoField } from 'utils/info'
import { VESSEL_GROUP_REPORT } from 'routes/routes'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import Remove from '../common/Remove'
import Title from '../common/Title'

export type VesselGroupLayerPanelProps = {
  dataview: UrlDataviewInstance
  vesselGroup?: VesselGroup
}

function VesselGroupLayerPanel({
  dataview,
  vesselGroup,
}: VesselGroupLayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const activityLayer = useGetDeckLayer<FourwingsLayer>(dataview?.id)
  const layerLoaded = activityLayer?.loaded
  const layerError = activityLayer?.instance?.getError?.()

  const { items, attributes, listeners, setNodeRef, setActivatorNodeRef, style } =
    useLayerPanelDataviewSort(dataview.id)

  const [colorOpen, setColorOpen] = useState(false)

  const layerActive = dataview?.config?.visible ?? true

  const changeInstanceColor = (color: ColorBarOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        color: color.value,
      },
    })
    setColorOpen(false)
  }

  const onToggleColorOpen = () => {
    setColorOpen(!colorOpen)
  }

  const closeExpandedContainer = () => {
    setColorOpen(false)
  }

  return (
    <div
      className={cx(
        styles.LayerPanel,
        { [styles.expandedContainerOpen]: colorOpen },
        { 'print-hidden': !layerActive }
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        <LayerSwitch active={layerActive} className={styles.switch} dataview={dataview} />
        <Title
          title={
            <Link
              className={styles.link}
              to={{
                type: VESSEL_GROUP_REPORT,
                payload: {
                  vesselGroupId: vesselGroup?.id,
                },
                query: {},
              }}
            >
              <Tooltip
                content={t('vesselGroupReport.clickToSee', 'Click to see the vessel group report')}
              >
                <span>
                  {formatInfoField(vesselGroup?.name, 'name')}{' '}
                  <span className={styles.secondary}> ({vesselGroup?.vessels.length})</span>
                </span>
              </Tooltip>
            </Link>
          }
          className={styles.name}
          classNameActive={styles.active}
          dataview={dataview}
          toggleVisibility={false}
        />
        <div
          className={cx('print-hidden', styles.actions, styles.hideUntilHovered, {
            [styles.active]: layerActive,
          })}
        >
          <Fragment>
            {layerActive && (
              <Color
                dataview={dataview}
                open={colorOpen}
                onColorClick={changeInstanceColor}
                onToggleClick={onToggleColorOpen}
                onClickOutside={closeExpandedContainer}
              />
            )}
            <Remove dataview={dataview} />
          </Fragment>
        </div>
        <IconButton
          icon={layerActive ? (layerError ? 'warning' : 'more') : undefined}
          type={layerError ? 'warning' : 'default'}
          loading={layerActive && !layerLoaded}
          className={cx('print-hidden', styles.shownUntilHovered)}
          size="small"
        />
        {items.length > 1 && (
          <IconButton
            size="small"
            ref={setActivatorNodeRef}
            {...listeners}
            icon="drag"
            className={styles.dragger}
          />
        )}
      </div>
    </div>
  )
}

export default VesselGroupLayerPanel
