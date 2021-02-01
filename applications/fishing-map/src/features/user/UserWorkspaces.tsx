import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import Button from '@globalfishingwatch/ui-components/dist/button'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { Workspace } from '@globalfishingwatch/api-types'
import { WORKSPACE } from 'routes/routes'
import { WorkspaceCategories } from 'data/workspaces'
import styles from './User.module.css'

function UserWorkspaces({ workspaces }: { workspaces: Workspace[] }) {
  const { t } = useTranslation()
  return (
    <div className={styles.views}>
      <div className={styles.viewsHeader}>
        <label>{t('common.workspaces', 'Workspaces')}</label>
        <Button disabled>{t('workspaces.new', 'New Workspace') as string}</Button>
      </div>
      <ul>
        {workspaces?.map((workspace) => {
          return (
            <li className={styles.workspace} key={workspace.id}>
              <Link
                className={styles.workspaceLink}
                to={{
                  type: WORKSPACE,
                  payload: {
                    category: workspace.category || WorkspaceCategories.FishingActivity,
                    workspaceId: workspace.id,
                  },
                  query: {},
                }}
              >
                <span className={styles.workspaceTitle}>{workspace.name}</span>
                <IconButton icon="arrow-right" />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default UserWorkspaces
