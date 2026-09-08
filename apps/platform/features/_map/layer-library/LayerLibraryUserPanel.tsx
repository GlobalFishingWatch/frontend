import { Fragment, useCallback, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetStatus, DataviewCategory } from '@globalfishingwatch/api-types'
import { getDatasetConfiguration } from '@globalfishingwatch/datasets-client'
import type { DrawFeatureType } from '@globalfishingwatch/deck-layers/draw'
import { Icon, IconButton, Spinner } from '@globalfishingwatch/ui-components'

import { getDataviewInstanceByDataset, useAddDataset } from 'features/_map/datasets/datasets.hook'
import {
  getDatasetLabel,
  getDatasetMatchesSearch,
  getDatasetTypeIcon,
  groupDatasetsByGeometryType,
} from 'features/_map/datasets/datasets.utils'
import { useMapDrawConnect } from 'features/_map/map/map-draw.hooks'
import InfoError from 'features/_map/workspace/shared/InfoError'
import { useDataviewInstancesConnect } from 'features/_map/workspace/workspace.hook'
import LoginButtonWrapper from 'features/_user/LoginButtonWrapper'
import LoginLink from 'features/_user/LoginLink'
import { selectUserDatasets } from 'features/_user/selectors/user.permissions.selectors'
import { selectIsGuestUser } from 'features/_user/selectors/user.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import { getTimeAgo, getUTCDateTime, sortByCreationDate } from 'utils/dates'
import { getIsBrowser } from 'utils/dom'
import { getHighlightedText } from 'utils/text'

import styles from './LayerLibraryUserPanel.module.css'

const COLLAPSED_DATASETS_COUNT = 10

const LayerLibraryUserPanel = ({
  searchQuery,
  datasetsLoaded,
}: {
  searchQuery: string
  datasetsLoaded: boolean
}) => {
  const { t } = useTranslation()

  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const dispatch = useAppDispatch()
  const { dispatchSetMapDrawing } = useMapDrawConnect()
  const datasets = useSelector(selectUserDatasets)
  const guestUser = useSelector(selectIsGuestUser)
  const onAddNewClick = useAddDataset()
  const [expandedGeometries, setExpandedGeometries] = useState<string[]>([])

  const toggleGeometryExpanded = useCallback((geometryType: string) => {
    setExpandedGeometries((expanded) =>
      expanded.includes(geometryType)
        ? expanded.filter((type) => type !== geometryType)
        : [...expanded, geometryType]
    )
  }, [])

  const filteredDatasets = useMemo(
    () => datasets.filter((dataset) => getDatasetMatchesSearch(dataset, searchQuery)),
    [datasets, searchQuery]
  )

  const datasetsByGeometryType = useMemo(
    () =>
      Object.entries(groupDatasetsByGeometryType(filteredDatasets)).filter(
        ([, geometryDatasets]) => geometryDatasets.length > 0
      ),
    [filteredDatasets]
  )

  const onAddToWorkspaceClick = useCallback(
    (dataset: Dataset) => {
      const dataviewInstanceWithDataset = getDataviewInstanceByDataset(dataset)
      if (!dataviewInstanceWithDataset) {
        return
      }
      upsertDataviewInstance({
        ...dataviewInstanceWithDataset,
        id: `${dataviewInstanceWithDataset.id}-${Date.now()}`,
      })
      dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
    },
    [dispatch, upsertDataviewInstance]
  )

  const onUploadClick = useCallback(() => {
    onAddNewClick()
    dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
  }, [datasets.length, onAddNewClick, dispatch])

  const onDrawClick = useCallback(
    (drawFeatureType: DrawFeatureType) => {
      dispatchSetMapDrawing(drawFeatureType)
      dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
      trackEvent({
        category: TrackCategory.ReferenceLayer,
        action: `Draw a custom reference layer - Start`,
      })
    },
    [dispatchSetMapDrawing]
  )

  const SectionComponent = () => {
    if (guestUser) {
      return (
        <div className={styles.emptyState}>
          <Trans i18nKey={(t) => t.dataset.uploadLogin}>
            <a
              className={styles.link}
              href={GFWAPI.getRegisterUrl(getIsBrowser() ? window.location.toString() : '')}
            >
              Register
            </a>
            or
            <LoginLink className={styles.link} loginSource="layer-library-user">
              login
            </LoginLink>
            to upload datasets (free, 2 minutes)
          </Trans>
        </div>
      )
    }

    if (!datasetsLoaded) {
      return (
        <div className={cx(styles.emptyState, styles.center)}>
          <Spinner />
        </div>
      )
    }

    return (
      <div className={styles.userDatasetList}>
        {datasetsByGeometryType.length > 0 ? (
          datasetsByGeometryType.map(([geometryType, layer]) => {
            const sortedDatasets = sortByCreationDate<Dataset>(layer)
            const expanded = Boolean(searchQuery) || expandedGeometries.includes(geometryType)
            const visibleDatasets = expanded
              ? sortedDatasets
              : sortedDatasets.slice(0, COLLAPSED_DATASETS_COUNT)
            const hiddenCount = sortedDatasets.length - visibleDatasets.length

            return (
              <ul className={styles.userGeometryList} key={geometryType}>
                <label id={geometryType} className={styles.geometryLabel}>
                  {t((t: any) => t.dataset.type[geometryType], { defaultValue: geometryType })} (
                  {layer.length})
                </label>
                {visibleDatasets.map((dataset, index) => {
                  const datasetError = dataset.status === DatasetStatus.Error
                  const datasetImporting = dataset.status === DatasetStatus.Importing
                  let infoTooltip = t((t) => t.layer.seeDescription, {
                    defaultValue: 'Click to see layer description',
                  }) as string
                  if (datasetImporting) {
                    infoTooltip = t((t) => t.dataset.importing)
                  }
                  if (datasetError) {
                    const importLogs =
                      getDatasetConfiguration(dataset, 'userContextLayerV1').importLogs || ''
                    infoTooltip = `${t((t) => t.errors.uploadError)} ${importLogs ? `- ${importLogs}` : ''}`
                  }
                  const datasetIcon = getDatasetTypeIcon(dataset)
                  const createdAgo = dataset.createdAt
                    ? getTimeAgo(getUTCDateTime(dataset.createdAt), t)
                    : ''

                  return (
                    <li className={styles.dataset} key={dataset.id}>
                      <span>
                        <span className={styles.datasetName}>
                          {datasetIcon && (
                            <Icon icon={datasetIcon} style={{ transform: 'translateY(25%)' }} />
                          )}
                          {getHighlightedText(getDatasetLabel(dataset), searchQuery, styles)}
                        </span>
                        <span className={styles.datasetMeta}>{createdAgo}</span>
                      </span>
                      <div>
                        {datasetError ? (
                          <InfoError
                            error={datasetError}
                            loading={datasetImporting}
                            tooltip={infoTooltip}
                            size="default"
                            // onClick={() => !datasetError && onInfoClick(dataset)}
                          />
                        ) : (
                          <IconButton
                            testId={`${dataset.type}-add-to-map-${index}`}
                            icon="view-on-map"
                            onClick={() => onAddToWorkspaceClick(dataset)}
                            tooltip={t((t) => t.user.seeDataset)}
                          />
                        )}
                      </div>
                    </li>
                  )
                })}
                {(hiddenCount > 0 || (expanded && !searchQuery)) && (
                  <li>
                    <button
                      className={styles.showMore}
                      onClick={() => toggleGeometryExpanded(geometryType)}
                    >
                      <label>
                        {hiddenCount > 0
                          ? (t((t) => t.dataset.showMore, { count: hiddenCount }) as string)
                          : t((t) => t.dataset.showLess)}
                      </label>
                    </button>
                  </li>
                )}
              </ul>
            )
          })
        ) : (
          <div className={styles.placeholder}>{t((t) => t.dataset.emptyState)}</div>
        )}
      </div>
    )
  }

  return (
    <Fragment>
      <div className={styles.titleContainer}>
        <label id={DataviewCategory.User} className={styles.categoryLabel}>
          {t((t) => t.common.user)}
        </label>
        <LoginButtonWrapper
          tooltip={t((t) => t.dataset.uploadLogin)}
          loginSource="user-upload-datasets"
        >
          <IconButton
            icon="upload"
            type="border"
            size="medium"
            tooltip={t((t) => t.dataset.upload)}
            tooltipPlacement="top"
            className="print-hidden"
            onClick={onUploadClick}
          />
        </LoginButtonWrapper>
        <LoginButtonWrapper tooltip={t((t) => t.layer.drawPolygonLogin)} loginSource="draw-polygon">
          <IconButton
            icon="draw"
            type="border"
            size="medium"
            tooltip={t((t) => t.layer.drawPolygon)}
            tooltipPlacement="top"
            className="print-hidden"
            onClick={() => onDrawClick('polygons')}
          />
        </LoginButtonWrapper>
        <LoginButtonWrapper tooltip={t((t) => t.layer.drawPointsLogin)} loginSource="draw-points">
          <IconButton
            icon="draw-points"
            type="border"
            size="medium"
            tooltip={t((t) => t.layer.drawPoints)}
            tooltipPlacement="top"
            className="print-hidden"
            onClick={() => onDrawClick('points')}
          />
        </LoginButtonWrapper>
      </div>
      {/* eslint-disable-next-line react-hooks/static-components */}
      <SectionComponent />
    </Fragment>
  )
}

export default LayerLibraryUserPanel
