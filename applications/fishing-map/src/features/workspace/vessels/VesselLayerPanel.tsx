import React, { Fragment, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import {
  Vessel,
  DatasetTypes,
  ResourceStatus,
  DataviewDatasetConfigParam,
} from '@globalfishingwatch/api-types'
import { IconButton, Tooltip } from '@globalfishingwatch/ui-components'
import { ColorBarOption } from '@globalfishingwatch/ui-components/dist/color-bar'
import { Segment } from '@globalfishingwatch/data-transforms'
import {
  resolveDataviewDatasetResource,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField, getVesselLabel } from 'utils/info'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectResourceByUrl } from 'features/resources/resources.slice'
import I18nDate from 'features/i18n/i18nDate'
import I18nFlag from 'features/i18n/i18nFlag'
import { VESSEL_DATAVIEW_INSTANCE_PREFIX } from 'features/dataviews/dataviews.utils'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import { isGuestUser } from 'features/user/user.selectors'
import LocalStorageLoginLink from 'routes/LoginLink'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import Remove from '../common/Remove'
import Title from '../common/Title'
import FitBounds from '../common/FitBounds'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { url: infoUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
  const { url: trackUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)
  const infoResource = useSelector(selectResourceByUrl<Vessel>(infoUrl))
  const trackResource = useSelector(selectResourceByUrl<Segment[]>(trackUrl))
  const guestUser = useSelector(isGuestUser)
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
  const onToggleInfoOpen = () => {
    setInfoOpen(!infoOpen)
  }

  const closeExpandedContainer = () => {
    setColorOpen(false)
    setInfoOpen(false)
  }

  const vesselLabel = infoResource?.data ? getVesselLabel(infoResource.data) : ''
  const vesselId =
    (infoResource?.datasetConfig?.params?.find(
      (p: DataviewDatasetConfigParam) => p.id === 'vesselId'
    )?.value as string) ||
    dataview.id.replace(VESSEL_DATAVIEW_INSTANCE_PREFIX, '') ||
    ''
  const vesselTitle = vesselLabel || vesselId

  const TitleComponent = (
    <Title
      title={vesselTitle}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
    />
  )

  const trackLoading = trackResource?.status === ResourceStatus.Loading
  const infoLoading = infoResource?.status === ResourceStatus.Loading

  const infoError = infoResource?.status === ResourceStatus.Error
  const trackError = trackResource?.status === ResourceStatus.Error

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
    <Fragment>
      <Color
        dataview={dataview}
        open={colorOpen}
        onColorClick={changeTrackColor}
        onToggleClick={onToggleColorOpen}
        onClickOutside={closeExpandedContainer}
      />
      <FitBounds hasError={trackError} trackResource={trackResource} />
    </Fragment>
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
            ? t('errors.vesselLoading', 'There was an error loading the vessel details')
            : infoOpen
            ? t('layer.infoClose', 'Hide info')
            : t('layer.infoOpen', 'Show info')
        }
        onClick={onToggleInfoOpen}
        tooltipPlacement="top"
      />
    </ExpandedContainer>
  )

  return (
    <div
      className={cx(styles.LayerPanel, { [styles.expandedContainerOpen]: colorOpen || infoOpen })}
    >
      <div className={styles.header}>
        <LayerSwitch active={layerActive} className={styles.switch} dataview={dataview} />
        {vesselTitle && vesselTitle.length > 20 ? (
          <Tooltip content={vesselTitle}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
          <Fragment>
            {layerActive && !infoLoading && TrackIconComponent}
            {infoResource && InfoIconComponent}
            <Remove dataview={dataview} />
          </Fragment>
        </div>
      </div>
    </div>
  )
}

export default LayerPanel
