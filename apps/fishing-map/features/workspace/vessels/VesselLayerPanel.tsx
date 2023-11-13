import { Fragment, ReactNode, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { groupBy } from 'lodash'
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
import { formatInfoField, getVesselLabel } from 'utils/info'
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
import { formatI18nDate } from 'features/i18n/i18nDate'
import { t } from 'features/i18n/i18n'
import { isGFWUser } from 'features/user/user.slice'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import Remove from '../common/Remove'
import Title from '../common/Title'
import FitBounds from '../common/FitBounds'

export type VesselLayerPanelProps = {
  dataview: UrlDataviewInstance
}

export const getVesselIdentityTooltipSummary = (
  vessel: IdentityVessel,
  { showVesselId } = {} as { showVesselId: boolean }
) => {
  if (!vessel || !vessel.selfReportedInfo?.length) {
    return ['']
  }
  const identitiesByNormalizedShipname = groupBy(vessel?.selfReportedInfo, 'nShipname')
  const identities = Object.entries(identitiesByNormalizedShipname).flatMap(
    ([_, selfReportedInfo]) => {
      const firstTransmissionDateFrom = selfReportedInfo.reduce((acc, curr) => {
        if (!acc) {
          return curr.transmissionDateFrom
        }
        return acc < curr.transmissionDateFrom ? acc : curr.transmissionDateFrom
      }, '')
      const lastTransmissionDateTo = selfReportedInfo.reduce((acc, curr) => {
        if (!acc) {
          return curr.transmissionDateTo
        }
        return acc > curr.transmissionDateTo ? acc : curr.transmissionDateTo
      }, '')

      const selfReported = selfReportedInfo[0]
      const name = formatInfoField(selfReported.shipname, 'name')
      const flag = formatInfoField(selfReported.flag, 'flag')
      let info = `${name} - (${flag}) (${formatI18nDate(
        firstTransmissionDateFrom
      )} - ${formatI18nDate(lastTransmissionDateTo)})`
      if (showVesselId) {
        return [
          info,
          <br />,
          selfReportedInfo.map((s, index) => (
            <Fragment key={s.id}>
              <GFWOnly type="only-icon" /> {s.id}
              {index < selfReportedInfo.length - 1 && <br />}
            </Fragment>
          )),
          <br />,
        ]
      }
      return [info, <br />]
    }
  )
  return [...identities, t('vessel.clickToSeeMore', 'Click to see more information')]
}

function VesselLayerPanel({ dataview }: VesselLayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { url: infoUrl, dataset } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
  const resources = useSelector(selectResources)
  const gfwUser = useSelector(isGFWUser)
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

  const vesselData = infoResource?.data
  const vesselLabel = vesselData ? getVesselLabel(vesselData) : ''
  const otherVesselsLabel = vesselData ? getOtherVesselNames(vesselData as IdentityVessel) : ''
  const identitiesSummary = vesselData
    ? getVesselIdentityTooltipSummary(vesselData, { showVesselId: gfwUser || false })
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

    const isPrivateVessel = dataview?.datasetsConfig
      ?.filter((d) => d.datasetId)
      .some((d) => isPrivateDataset({ id: d.datasetId }))
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
          tooltip={identitiesSummary}
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
            : ''
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
