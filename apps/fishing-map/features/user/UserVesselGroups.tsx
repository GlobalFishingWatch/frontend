import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { Spinner, IconButton, Button } from '@globalfishingwatch/ui-components'
import { VesselGroup } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  setVesselGroupsModalOpen,
  selectVesselGroupsStatus,
  selectVesselGroupsStatusId,
  deleteVesselGroupThunk,
  setVesselGroupEditId,
  selectVesselGroupEditId,
} from 'features/vessel-groups/vessel-groups.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDatasetsStatus } from 'features/datasets/datasets.slice'
import { getVesselGroupLabel } from 'features/vessel-groups/vessel-groups.utils'
import { sortByCreationDate } from 'utils/dates'
import { selectUserVesselGroups } from './user.selectors'
import styles from './User.module.css'

function UserVesselGroups() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const vesselGroups = useSelector(selectUserVesselGroups)
  const vesselGroupStatus = useSelector(selectVesselGroupsStatus)
  const vesselGroupStatusId = useSelector(selectVesselGroupsStatusId)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const loading =
    datasetsStatus === AsyncReducerStatus.Loading ||
    vesselGroupStatus === AsyncReducerStatus.Loading
  const editingGroupId = useSelector(selectVesselGroupEditId)

  const onNewGroupClick = useCallback(() => {
    dispatch(setVesselGroupsModalOpen(true))
  }, [dispatch])

  const onEditClick = useCallback(
    async (vesselGroup: VesselGroup) => {
      dispatch(setVesselGroupEditId(vesselGroup.id))
      dispatch(setVesselGroupsModalOpen(true))
    },
    [dispatch]
  )

  const onDeleteClick = useCallback(
    (vesselGroup: VesselGroup) => {
      const confirmation = window.confirm(
        `${t(
          'vesselGroup.confirmRemove',
          'Are you sure you want to permanently delete this vessel group?'
        )}\n${vesselGroup.name}`
      )
      if (confirmation) {
        dispatch(deleteVesselGroupThunk(vesselGroup.id.toString()))
      }
    },
    [dispatch, t]
  )

  return (
    <div className={styles.views}>
      <div className={styles.viewsHeader}>
        <label>{t('vesselGroup.vesselGroups', 'Vessel Groups')}</label>
        <Button disabled={loading} type="secondary" onClick={onNewGroupClick}>
          {t('vesselGroup.new', 'New vessel group') as string}
        </Button>
      </div>
      {loading ? (
        <div className={styles.placeholder}>
          <Spinner size="small" />
        </div>
      ) : (
        <ul>
          {vesselGroups && vesselGroups.length > 0 ? (
            sortByCreationDate<VesselGroup>(vesselGroups).map((vesselGroup) => {
              return (
                <li className={styles.dataset} key={vesselGroup.id}>
                  {getVesselGroupLabel(vesselGroup)}
                  <div>
                    <IconButton
                      icon="edit"
                      loading={vesselGroup.id === editingGroupId}
                      tooltip={t('vesselGroup.edit', 'Edit list of vessels')}
                      onClick={() => onEditClick(vesselGroup)}
                    />
                    <IconButton
                      icon="delete"
                      type="warning"
                      loading={vesselGroup.id === vesselGroupStatusId}
                      tooltip={t('vesselGroup.remove', 'Remove vessel group')}
                      onClick={() => onDeleteClick(vesselGroup)}
                    />
                  </div>
                </li>
              )
            })
          ) : (
            <div className={styles.placeholder}>
              {t('vesselGroup.emptyState', 'Your vessel groups will appear here')}
            </div>
          )}
        </ul>
      )}
    </div>
  )
}

export default UserVesselGroups
