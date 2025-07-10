import { useState } from 'react'

import { useGFWLogin, useGFWLoginRedirect } from '@globalfishingwatch/react-hooks'
import { Button, Modal, Spinner } from '@globalfishingwatch/ui-components'

import { useGetLabellingProjectsListQuery } from '../../api/projects-list'
import type { LabellingProject } from '../../types'

import ProjectForm from './ProjectForm'
import ProjectItem from './ProjectItem'

import styles from './ProjectsList.module.css'

const EMPTY_PROJECT: Omit<LabellingProject, 'id'> = {
  name: '',
  labels: [],
  gcsThumbnails: 'gs://',
  bqQuery: '',
  bqTable: '',
  scale: '',
}

export function ProjectsList() {
  const login = useGFWLogin()
  useGFWLoginRedirect(login)
  const { data, isLoading } = useGetLabellingProjectsListQuery({}, { skip: !login.logged })
  console.log('🚀 ~ ProjectsList ~ data:', data)
  const [createOpen, setCreateOpen] = useState(false)
  if (!login.logged || isLoading) {
    return <Spinner />
  }

  const closeModal = () => {
    setCreateOpen(false)
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Labelling Projects</h1>
      {data?.entries?.map((project: LabellingProject) => (
        <ProjectItem project={project} key={project.id} />
      ))}
      <Button className={styles.createProjectBtn} onClick={() => setCreateOpen(true)}>
        Create new project
      </Button>
      <Modal
        contentClassName={styles.editModal}
        appSelector={'app'}
        title="Create new project"
        isOpen={createOpen}
        shouldCloseOnEsc
        onClose={closeModal}
      >
        <ProjectForm mode="create" project={EMPTY_PROJECT} />
      </Modal>
    </div>
  )
}

export default ProjectsList
