import React, { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import {
  selectWorkspaceStatus,
  selectDataviewsResourceQueries,
} from 'features/workspace/workspace.selectors'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { AsyncReducerStatus } from 'types'
import { isUserLogged } from 'features/user/user.selectors'
import { selectWorkspaceId } from 'routes/routes.selectors'
import HeatmapsSection from './heatmaps/HeatmapsSection'
import VesselsSection from './vessels/VesselsSection'
import ContextArea from './context-areas/ContextAreaSection'
import styles from './Workspace.module.css'

function Workspace() {
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const userLogged = useSelector(isUserLogged)
  const workspaceId = useSelector(selectWorkspaceId)

  useEffect(() => {
    if (userLogged && workspaceStatus === AsyncReducerStatus.Idle) {
      dispatch(fetchWorkspaceThunk(workspaceId as string))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLogged, workspaceId])

  const resourceQueries = useSelector(selectDataviewsResourceQueries)
  useEffect(() => {
    if (resourceQueries) {
      resourceQueries.forEach((resourceQuery) => {
        dispatch(fetchResourceThunk(resourceQuery))
      })
    }
  }, [dispatch, resourceQueries])

  return workspaceStatus === AsyncReducerStatus.Error ||
    workspaceStatus === AsyncReducerStatus.Loading ? (
    <div className={styles.placeholder}>
      {workspaceStatus === AsyncReducerStatus.Loading ? (
        <Spinner />
      ) : (
        t(
          'errors.workspaceLoad',
          'There was an error loading the workspace, please try again later'
        )
      )}
    </div>
  ) : (
    <Fragment>
      <HeatmapsSection />
      <VesselsSection />
      <ContextArea />
    </Fragment>
  )
}

export default Workspace
