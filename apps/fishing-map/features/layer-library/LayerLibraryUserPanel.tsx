import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetStatus, DataviewCategory } from '@globalfishingwatch/api-types'
import type { DrawFeatureType } from '@globalfishingwatch/deck-layers'
import { Icon, IconButton, Spinner } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { getDataviewInstanceByDataset, useAddDataset } from 'features/datasets/datasets.hook'
import { fetchAllDatasetsThunk, selectDatasetsStatus } from 'features/datasets/datasets.slice'
import {
  getDatasetLabel,
  getDatasetTypeIcon,
  groupDatasetsByGeometryType,
} from 'features/datasets/datasets.utils'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import { selectUserDatasets } from 'features/user/selectors/user.permissions.selectors'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import InfoError from 'features/workspace/shared/InfoError'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'
import LocalStorageLoginLink from 'routes/LoginLink'
import { AsyncReducerStatus } from 'utils/async-slice'
import { sortByCreationDate } from 'utils/dates'
import { upperFirst } from 'utils/info'
import { getHighlightedText } from 'utils/text'

import styles from './LayerLibraryUserPanel.module.css'

const LayerLibraryUserPanel = ({ searchQuery }: { searchQuery: string }) => {
  const [infoDataset, setInfoDataset] = useState<Dataset | undefined>()
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const dispatch = useAppDispatch()
  const { dispatchSetMapDrawing } = useMapDrawConnect()
  const datasets = useSelector(selectUserDatasets)
  const datasetStatus = useSelector(selectDatasetsStatus)
  const guestUser = useSelector(selectIsGuestUser)
  const onAddNewClick = useAddDataset()

  const filteredDatasets = useMemo(
    () =>
      datasets.filter((dataset) => {
        return getDatasetLabel(dataset).toLowerCase().includes(searchQuery.toLowerCase())
      }),
    [datasets, searchQuery]
  )

  useEffect(() => {
    if (!guestUser) {
      dispatch(fetchAllDatasetsThunk())
    }
  }, [dispatch, guestUser])

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

  const onInfoClick = useCallback((dataset: Dataset) => {
    setInfoDataset(dataset)
  }, [])

  const onUploadClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Open panel to upload new reference layer`,
      value: datasets.length,
    })
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
          <Trans i18nKey="dataset.uploadLogin">
            <a
              className={styles.link}
              href={GFWAPI.getRegisterUrl(
                typeof window !== 'undefined' ? window.location.toString() : ''
              )}
            >
              Register
            </a>
            or
            <LocalStorageLoginLink className={styles.link}>login</LocalStorageLoginLink>
            to upload datasets (free, 2 minutes)
          </Trans>
        </div>
      )
    }
    if (datasetStatus !== AsyncReducerStatus.Finished) {
      return (
        <div className={cx(styles.emptyState, styles.center)}>
          <Spinner />
        </div>
      )
    }

    return (
      <div className={styles.userDatasetList}>
        {filteredDatasets && filteredDatasets.length > 0 ? (
          Object.entries(groupDatasetsByGeometryType(filteredDatasets)).map(
            ([geometryType, layer]) => (
              <ul className={styles.userGeometryList} key={geometryType}>
                <label id={geometryType} className={styles.categoryLabel}>
                  {t(`dataset.type${geometryType}`, upperFirst(geometryType))}
                </label>
                {sortByCreationDate<Dataset>(layer).map((dataset) => {
                  const datasetError = dataset.status === DatasetStatus.Error
                  const datasetImporting = dataset.status === DatasetStatus.Importing
                  const datasetDescription = dataset.description !== dataset.name
                  let infoTooltip = t(
                    `layer.seeDescription`,
                    'Click to see layer description'
                  ) as string
                  if (datasetImporting) {
                    infoTooltip = t('dataset.importing')
                  }
                  if (datasetError) {
                    infoTooltip = `${t('errors.uploadError')} - ${dataset.importLogs}`
                  }
                  const datasetIcon = getDatasetTypeIcon(dataset)

                  return (
                    <li className={styles.dataset} key={dataset.id}>
                      <span>
                        {datasetIcon && (
                          <Icon icon={datasetIcon} style={{ transform: 'translateY(25%)' }} />
                        )}
                        {getHighlightedText(getDatasetLabel(dataset), searchQuery, styles)}
                      </span>
                      <div>
                        {(datasetError || datasetDescription) && (
                          <InfoError
                            error={datasetError}
                            loading={datasetImporting}
                            tooltip={infoTooltip}
                            size="default"
                            onClick={() => !datasetError && onInfoClick(dataset)}
                          />
                        )}
                        {!datasetError && (
                          <IconButton
                            icon="view-on-map"
                            onClick={() => onAddToWorkspaceClick(dataset)}
                            tooltip={t('user.seeDataset')}
                          />
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )
          )
        ) : (
          <div className={styles.placeholder}>{t('dataset.emptyState')}</div>
        )}
      </div>
    )
  }

  return (
    <Fragment>
      <div className={styles.titleContainer}>
        <label id={DataviewCategory.User} className={styles.categoryLabel}>
          {t('common.user')}
        </label>
        <LoginButtonWrapper tooltip={t('dataset.uploadLogin')}>
          <IconButton
            icon="upload"
            type="border"
            size="medium"
            tooltip={t('dataset.upload')}
            tooltipPlacement="top"
            className="print-hidden"
            onClick={onUploadClick}
          />
        </LoginButtonWrapper>
        <LoginButtonWrapper tooltip={t('layer.drawPolygonLogin')}>
          <IconButton
            icon="draw"
            type="border"
            size="medium"
            tooltip={t('layer.drawPolygon')}
            tooltipPlacement="top"
            className="print-hidden"
            onClick={() => onDrawClick('polygons')}
          />
        </LoginButtonWrapper>
        <LoginButtonWrapper tooltip={t('layer.drawPointsLogin')}>
          <IconButton
            icon="draw-points"
            type="border"
            size="medium"
            tooltip={t('layer.drawPoints')}
            tooltipPlacement="top"
            className="print-hidden"
            onClick={() => onDrawClick('points')}
          />
        </LoginButtonWrapper>
      </div>

      <SectionComponent />
    </Fragment>
  )
}

export default LayerLibraryUserPanel
