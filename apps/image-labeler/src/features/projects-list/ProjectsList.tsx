// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link } from '@tanstack/react-router'
import { useGFWLogin, useGFWLoginRedirect } from '@globalfishingwatch/react-hooks/use-login'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'
import { useGetLabellingProjectsListQuery } from '../../api/projects-list'
import styles from './ProjectsList.module.css'

type LabellingProject = {
  id: number
  name: string
  labels: string[]
  bqQuery: string
  bqTable: string
  gcsThumbnails: string
}

export function ProjectsList() {
  const login = useGFWLogin()
  useGFWLoginRedirect(login)
  const { data, isLoading } = useGetLabellingProjectsListQuery({}, { skip: !login.logged })
  if (!login.logged || isLoading) {
    return <Spinner />
  }
  return (
    <div>
      <h1 className={styles.pageTitle}>Labelling Projects</h1>
      {data.entries.map((project: LabellingProject) => (
        <Link
          to="/project/$projectId"
          params={{
            projectId: project.id.toString(),
          }}
          className={styles.project}
          key={project.id}
        >
          <h2 className={styles.projectName}>{project.name}</h2>
          <div className={styles.projectProperties}>
            <div>
              <label>Labels</label>
              {project.labels.join(', ')}
            </div>
            {/* <div>
              <label>BQ Query</label>
              {project.bqQuery}
            </div> */}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ProjectsList
