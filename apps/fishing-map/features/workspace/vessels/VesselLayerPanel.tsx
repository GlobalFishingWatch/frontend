import { Fragment, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import {
  Vessel,
  DatasetTypes,
  ResourceStatus,
  DataviewDatasetConfigParam,
  Resource,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { IconButton, Tooltip, ColorBarOption } from '@globalfishingwatch/ui-components'
import {
  resolveDataviewDatasetResource,
  UrlDataviewInstance,
  pickTrackResource,
  selectResources,
} from '@globalfishingwatch/dataviews-client'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField, getVesselLabel } from 'utils/info'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectResourceByUrl } from 'features/resources/resources.slice'
import { VESSEL_DATAVIEW_INSTANCE_PREFIX } from 'features/dataviews/dataviews.utils'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import { isGuestUser, isGFWUser, selectUserData } from 'features/user/user.slice'
import I18nDate from 'features/i18n/i18nDate'
import I18nFlag from 'features/i18n/i18nFlag'
import {
  getDatasetLabel,
  getVesselDatasetsDownloadTrackSupported,
  isGFWOnlyDataset,
  isPrivateDataset,
} from 'features/datasets/datasets.utils'
import { setDownloadTrackVessel } from 'features/download/downloadTrack.slice'
import LocalStorageLoginLink from 'routes/LoginLink'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectPrivateUserGroups } from 'features/user/user.selectors'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import Remove from '../common/Remove'
import Title from '../common/Title'
import FitBounds from '../common/FitBounds'
import InfoModal from '../common/InfoModal'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { url: infoUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
  const resources = useSelector(selectResources)
  const trackResource = pickTrackResource(dataview, EndpointId.Tracks, resources)
  const infoResource: Resource<Vessel> = useSelector(selectResourceByUrl<Vessel>(infoUrl))
  const { items, attributes, listeners, setNodeRef, setActivatorNodeRef, style } =
    useLayerPanelDataviewSort(dataview.id)

  const guestUser = useSelector(isGuestUser)
  const userData = useSelector(selectUserData)
  const [colorOpen, setColorOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [datasetModalOpen, setDatasetModalOpen] = useState(false)
  const gfwUser = useSelector(isGFWUser)
  const userPrivateGroups = useSelector(selectPrivateUserGroups)
  const downloadDatasetsSupported = getVesselDatasetsDownloadTrackSupported(
    dataview,
    userData?.permissions
  )
  const downloadSupported = downloadDatasetsSupported.length > 0

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
  const onToggleInfoOpen = () => {
    setInfoOpen(!infoOpen)
  }

  const closeExpandedContainer = () => {
    if (!datasetModalOpen) {
      setColorOpen(false)
      setInfoOpen(false)
    }
  }

  const trackLoading = trackResource?.status === ResourceStatus.Loading
  const infoLoading = infoResource?.status === ResourceStatus.Loading
  const loading = trackLoading || infoLoading

  const infoError = infoResource?.status === ResourceStatus.Error
  const trackError = trackResource?.status === ResourceStatus.Error

  const vesselLabel = infoResource?.data ? getVesselLabel(infoResource.data) : ''
  const vesselId =
    (infoResource?.datasetConfig?.params?.find(
      (p: DataviewDatasetConfigParam) => p.id === 'vesselId'
    )?.value as string) ||
    dataview.id.replace(VESSEL_DATAVIEW_INSTANCE_PREFIX, '') ||
    ''
  const vesselTitle = vesselLabel || t('common.unknownVessel', 'Unknown vessel')

  const getVesselTitle = (): string => {
    if (infoLoading) return t('vessel.loadingInfo', 'Loading vessel info')
    if (infoError) return t('common.unknownVessel', 'Unknown vessel')
    if (dataview?.datasetsConfig.some((d) => isGFWOnlyDataset({ id: d.datasetId })))
      return `🐠 ${vesselLabel}`
    if (dataview?.datasetsConfig.some((d) => isPrivateDataset({ id: d.datasetId })))
      return `🔒 ${vesselLabel}`
    return vesselLabel
  }

  const TitleComponentContent = () => (
    <Fragment>
      <span className={cx({ [styles.faded]: infoLoading || infoError })}>{getVesselTitle()}</span>
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
    />
  )

  const getFieldValue = (field: any, fieldValue: string | undefined) => {
    if (!fieldValue) return
    if (field.type === 'date') {
      return <I18nDate date={fieldValue} />
    }
    if (field.type === 'flag') {
      return <I18nFlag iso={fieldValue} />
    }
    if (field.id === 'geartype') {
      if (!fieldValue) return EMPTY_FIELD_PLACEHOLDER
      const fieldValueSplit = fieldValue.split('|')
      if (fieldValueSplit.length > 1) {
        return fieldValueSplit
          .map((field) => t(`vessel.gearTypes.${field}` as any, field))
          .join(', ')
      }
      return t(`vessel.gearTypes.${fieldValue}` as any, fieldValue)
    }
    if (field.id === 'mmsi') {
      return (
        <a
          className={styles.link}
          target="_blank"
          rel="noreferrer"
          href={`https://www.marinetraffic.com/en/ais/details/ships/${fieldValue}`}
        >
          {formatInfoField(fieldValue, field.type)}
        </a>
      )
    }
    if (field.id === 'dataset') {
      return getDatasetLabel({ id: fieldValue })
    }
    return formatInfoField(fieldValue, field.type)
  }

  const infoFields = guestUser
    ? dataview.infoConfig?.fields.filter((field) => field.guest)
    : dataview.infoConfig?.fields

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
    <ExpandedContainer
      visible={infoOpen}
      onClickOutside={closeExpandedContainer}
      component={
        <ul className={styles.infoContent}>
          {infoFields?.map((field: any) => {
            const value = infoResource?.data?.[field.id as keyof Vessel]
            if (!value && !field.mandatory) return null
            const fieldValues = Array.isArray(value) ? value : [value]
            return (
              <li key={field.id} className={styles.infoContentItem}>
                <label>{t(`vessel.${field.id}` as any)}</label>
                {fieldValues.map((fieldValue, i) => (
                  <span key={field.id + fieldValue}>
                    {fieldValue ? getFieldValue(field, fieldValue as any) : '---'}
                    {/* Field values separator */}
                    {i < fieldValues.length - 1 ? ', ' : ''}
                    {field.id === 'dataset' && infoOpen && gfwUser && (
                      <InfoModal dataview={dataview} onModalStateChange={setDatasetModalOpen} />
                    )}
                  </span>
                ))}
              </li>
            )
          })}
          {guestUser && (
            <li className={styles.infoLogin}>
              <Trans i18nKey="vessel.login">
                You need to
                <LocalStorageLoginLink className={styles.link}>login</LocalStorageLoginLink>
                to see more details
              </Trans>
            </li>
          )}
        </ul>
      }
    >
      <IconButton
        size="small"
        icon={infoError ? 'warning' : 'info'}
        type={infoError ? 'warning' : 'default'}
        disabled={infoError}
        tooltip={
          infoError
            ? `${t(
                'errors.vesselLoading',
                'There was an error loading the vessel details'
              )} (${vesselId})`
            : infoOpen
            ? t('layer.infoClose', 'Hide info')
            : t('layer.infoOpen', 'Show info')
        }
        onClick={onToggleInfoOpen}
        tooltipPlacement="top"
      />
    </ExpandedContainer>
  )

  const onDownloadClick = () => {
    dispatch(
      setDownloadTrackVessel({
        id: vesselId,
        name: vesselTitle,
        datasets: trackResource?.dataset.id,
      })
    )
  }

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
            {(gfwUser || userPrivateGroups?.length > 0) && (
              <IconButton
                icon="download"
                disabled={!downloadSupported}
                tooltip={
                  downloadSupported
                    ? t('download.trackAction', 'Download vessel track')
                    : t(
                        'download.trackNotAllowed',
                        "You don't have permissions to download tracks from this source"
                      )
                }
                tooltipPlacement="top"
                onClick={onDownloadClick}
                size="small"
              />
            )}

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

export default LayerPanel
