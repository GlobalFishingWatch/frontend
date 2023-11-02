import { Fragment, ReactNode, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
// import NextLink from 'next/link'
import {
  DatasetTypes,
  ResourceStatus,
  DataviewDatasetConfigParam,
  Resource,
  EndpointId,
  IdentityVessel,
  VesselIdentitySourceEnum,
} from '@globalfishingwatch/api-types'
import { IconButton, Tooltip, ColorBarOption } from '@globalfishingwatch/ui-components'
import {
  resolveDataviewDatasetResource,
  UrlDataviewInstance,
  pickTrackResource,
  selectResources,
} from '@globalfishingwatch/dataviews-client'
import { getVesselLabel } from 'utils/info'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectResourceByUrl } from 'features/resources/resources.slice'
import { VESSEL_DATAVIEW_INSTANCE_PREFIX } from 'features/dataviews/dataviews.utils'
import { isGFWOnlyDataset, isPrivateDataset } from 'features/datasets/datasets.utils'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import GFWOnly from 'features/user/GFWOnly'
import VesselDownload from 'features/workspace/vessels/VesselDownload'
import VesselLink from 'features/vessel/VesselLink'
import { getOtherVesselNames } from 'features/vessel/vessel.utils'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import Remove from '../common/Remove'
import Title from '../common/Title'
import FitBounds from '../common/FitBounds'

export type VesselLayerPanelProps = {
  dataview: UrlDataviewInstance
}

function VesselLayerPanel({ dataview }: VesselLayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { url: infoUrl, dataset } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
  const resources = useSelector(selectResources)
  const trackResource = pickTrackResource(dataview, EndpointId.Tracks, resources)
  const infoResource: Resource<IdentityVessel> = useSelector(
    selectResourceByUrl<IdentityVessel>(infoUrl)
  )
  const { items, attributes, listeners, setNodeRef, setActivatorNodeRef, style } =
    useLayerPanelDataviewSort(dataview.id)

  const [colorOpen, setColorOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const layerActive = dataview?.config?.visible ?? true

  const changeTrackColor = (color: ColorBarOption) => {
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

  // const onToggleInfoOpen = () => {
  //   setInfoOpen(!infoOpen)
  // }

  const closeExpandedContainer = () => {
    setColorOpen(false)
    setInfoOpen(false)
  }

  const trackLoading = trackResource?.status === ResourceStatus.Loading
  const infoLoading = infoResource?.status === ResourceStatus.Loading
  const loading = trackLoading || infoLoading

  const infoError = infoResource?.status === ResourceStatus.Error
  const trackError = trackResource?.status === ResourceStatus.Error

  const vesselLabel = infoResource?.data ? getVesselLabel(infoResource.data) : ''
  const otherVesselsLabel = infoResource?.data
    ? getOtherVesselNames(infoResource?.data as IdentityVessel)
    : ''
  const vesselId =
    (infoResource?.datasetConfig?.params?.find(
      (p: DataviewDatasetConfigParam) => p.id === 'vesselId'
    )?.value as string) ||
    dataview.id.replace(VESSEL_DATAVIEW_INSTANCE_PREFIX, '') ||
    ''
  const vesselTitle = vesselLabel || t('common.unknownVessel', 'Unknown vessel')

  const getVesselTitle = (): ReactNode => {
    if (infoLoading) return t('vessel.loadingInfo', 'Loading vessel info')
    if (infoError) return t('common.unknownVessel', 'Unknown vessel')
    if (dataview?.datasetsConfig?.some((d) => isGFWOnlyDataset({ id: d.datasetId })))
      return (
        <Fragment>
          <GFWOnly type="only-icon" />
          {vesselLabel}
          {otherVesselsLabel && <span className={styles.secondary}>{otherVesselsLabel}</span>}
        </Fragment>
      )
    const isPrivateVessel = dataview?.datasetsConfig?.some((d) =>
      isPrivateDataset({ id: d.datasetId })
    )
    return (
      <Fragment>
        {isPrivateVessel && '🔒'}
        {vesselLabel}
        {otherVesselsLabel && <span className={styles.secondary}>{otherVesselsLabel}</span>}
      </Fragment>
    )
  }

  const TitleComponentContent = () => (
    <Fragment>
      <span className={cx({ [styles.faded]: infoLoading || infoError })}>
        <VesselLink
          className={styles.link}
          vesselId={vesselId}
          datasetId={dataset?.id}
          query={{
            vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
            vesselSelfReportedId: vesselId,
          }}
          testId="vessel-layer-vessel-name"
        >
          {getVesselTitle()}
        </VesselLink>
      </span>
      {(infoError || trackError) && (
        <IconButton
          size="small"
          icon="warning"
          type="warning"
          disabled
          className={styles.errorIcon}
        />
      )}
    </Fragment>
  )

  const TitleComponent = (
    <Title
      title={<TitleComponentContent />}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
      toggleVisibility={false}
    />
  )

  const TrackIconComponent = trackLoading ? (
    <IconButton
      loading
      className={styles.loadingIcon}
      size="small"
      tooltip={t('vessel.loading', 'Loading vessel track')}
    />
  ) : (
    <FitBounds
      hasError={trackError}
      trackResource={trackResource as any}
      infoResource={infoResource}
    />
  )

  const InfoIconComponent = infoLoading ? (
    <IconButton
      loading
      className={styles.loadingIcon}
      size="small"
      tooltip={t('vessel.loadingInfo', 'Loading vessel info')}
    />
  ) : (
    <VesselLink vesselId={vesselId} datasetId={dataset?.id}>
      <IconButton
        size="small"
        loading={loading}
        icon={infoError ? 'warning' : 'info'}
        type={infoError ? 'warning' : 'default'}
        disabled={infoError}
        tooltip={
          infoError
            ? `${t(
                'errors.vesselLoading',
                'There was an error loading the vessel details'
              )} (${vesselId})`
            : t('layer.infoOpen', 'Show info')
        }
        // onClick={onToggleInfoOpen}
        tooltipPlacement="top"
      />
    </VesselLink>
  )

  return (
    <div
      className={cx(styles.LayerPanel, { [styles.expandedContainerOpen]: colorOpen || infoOpen })}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        <LayerSwitch active={layerActive} className={styles.switch} dataview={dataview} />
        {vesselTitle && vesselTitle.length > 20 ? (
          <Tooltip content={vesselTitle}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div
          className={cx('print-hidden', styles.actions, styles.hideUntilHovered, {
            [styles.active]: layerActive,
          })}
        >
          <Fragment>
            <VesselDownload
              dataview={dataview}
              vesselIds={[vesselId]}
              vesselTitle={vesselTitle}
              datasetId={trackResource?.dataset!?.id}
            />
            <Color
              dataview={dataview}
              open={colorOpen}
              onColorClick={changeTrackColor}
              onToggleClick={onToggleColorOpen}
              onClickOutside={closeExpandedContainer}
            />
            {layerActive && !infoLoading && TrackIconComponent}
            <Remove dataview={dataview} />
          </Fragment>
          {infoResource && InfoIconComponent}
        </div>
        <IconButton
          icon={'more'}
          loading={loading}
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

export default VesselLayerPanel
