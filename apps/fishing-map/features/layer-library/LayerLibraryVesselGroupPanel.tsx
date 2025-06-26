import { Fragment, useCallback, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { Icon, IconButton, Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectActiveVesselGroupDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import { getVesselGroupDataviewInstance } from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import VesselGroupReportLink from 'features/reports/report-vessel-group/VesselGroupReportLink'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import { selectAllVisibleVesselGroups } from 'features/vessel-groups/vessel-groups.selectors'
import { selectWorkspaceVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import { getVesselGroupVesselsCount } from 'features/vessel-groups/vessel-groups.utils'
import { setVesselGroupsModalOpen } from 'features/vessel-groups/vessel-groups-modal.slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'
import LocalStorageLoginLink from 'routes/LoginLink'
import { AsyncReducerStatus } from 'utils/async-slice'
import { formatInfoField } from 'utils/info'

import styles from './LayerLibraryVesselGroupPanel.module.css'

const LayerLibraryVesselGroupPanel = ({ searchQuery }: { searchQuery: string }) => {
  const { t } = useTranslation()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const dispatch = useAppDispatch()
  const guestUser = useSelector(selectIsGuestUser)

  const dataviews = useSelector(selectAllVisibleVesselGroups)

  const activeDataviews = useSelector(selectActiveVesselGroupDataviews)

  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)

  const filteredDataview = useMemo(
    () =>
      dataviews.filter((dataview) => {
        return getDatasetLabel(dataview).toLowerCase().includes(searchQuery.toLowerCase())
      }),
    [dataviews, searchQuery]
  )
  const onAddVesselGroupClick = useCallback(() => {
    dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
    dispatch(setVesselGroupsModalOpen(true))
    dispatch(setWorkspaceSuggestSave(true))
  }, [dispatch])

  const toggleAddToWorkspace = useCallback(
    (vesselGroupId: string, action: 'remove' | 'add') => {
      const dataviewInstance = getVesselGroupDataviewInstance(vesselGroupId)
      if (dataviewInstance && action === 'add') {
        upsertDataviewInstance(dataviewInstance)
      } else if (dataviewInstance && action === 'remove') {
        //TO DO: check if this is the right way to remove the dataview instance
        deleteDataviewInstance(vesselGroupId)
      }
      dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
    },
    [dispatch, deleteDataviewInstance, upsertDataviewInstance]
  )

  const SectionComponent = () => {
    if (guestUser) {
      return (
        <div className={styles.login}>
          <Trans i18nKey="dataset.uploadVesselGroups">
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
            to create and access your vessel groups.
          </Trans>
        </div>
      )
    }

    if (workspaceVesselGroupsStatus === AsyncReducerStatus.Loading) {
      return (
        <div className={cx(styles.placeholder, styles.center)}>
          <Spinner />
        </div>
      )
    }

    return (
      <ul className={styles.vesselGroupDatasets}>
        {filteredDataview.length > 0 ? (
          filteredDataview?.map((vesselGroup) => {
            return (
              <li className={styles.dataset} key={vesselGroup?.id}>
                <span className={styles.datasetLabel}>
                  <Icon icon="vessel-group" />
                  {formatInfoField(vesselGroup?.name, 'shipname')} (
                  {vesselGroup?.vessels?.length && getVesselGroupVesselsCount(vesselGroup)})
                </span>

                <div>
                  <VesselGroupReportLink vesselGroupId={vesselGroup?.id ?? ''}>
                    <IconButton
                      tooltip={t('vesselGroupReport.clickToSee')}
                      icon="analysis"
                      onClick={() => {
                        dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
                      }}
                    />
                  </VesselGroupReportLink>

                  <IconButton
                    tooltip={t('workspace.addLayer')}
                    icon="plus"
                    onClick={() => toggleAddToWorkspace(vesselGroup.id, 'add')}
                  />
                </div>
              </li>
            )
          })
        ) : (
          <div className={styles.placeholder}>{t('workspace.emptyStateVesselGroups')}</div>
        )}
      </ul>
    )
  }

  return (
    <Fragment>
      <div className={styles.titleContainer}>
        <label id={DataviewCategory.VesselGroups} className={styles.categoryLabel}>
          {t('common.vesselGroups')}
        </label>
        <UserLoggedIconButton
          type="border"
          icon="add-to-vessel-group"
          size="medium"
          tooltip={t('vesselGroup.createNewGroup')}
          tooltipPlacement="top"
          onClick={() => onAddVesselGroupClick()}
        />
      </div>
      <SectionComponent />
    </Fragment>
  )
}

export default LayerLibraryVesselGroupPanel
