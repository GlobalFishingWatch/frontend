import { useState } from 'react'
import { InputText } from '@globalfishingwatch/ui-components/input-text'
import { Button } from '@globalfishingwatch/ui-components/button'
import { LabellingProject } from '../../types'
import { useCreateProjectMutation, useEditProjectMutation } from '../../api'
import styles from './ProjectsList.module.css'

export function ProjectForm({
  project,
  mode,
  closeModal,
}: {
  project: LabellingProject
  mode: 'edit' | 'create'
  closeModal: () => void
}) {
  const [error, setError] = useState('')
  const [projectInfo, setProjectInfo] = useState(project)
  const [editProject, { isLoading: isEditLoading }] = useEditProjectMutation({
    fixedCacheKey: [project.id].join(),
  })
  const [createProject, { isLoading: isCreateLoading }] = useCreateProjectMutation({
    fixedCacheKey: [project.id].join(),
  })

  const handleChange = ({ value, field }: { value: string | string[]; field: string }) => {
    setProjectInfo({ ...projectInfo, [field]: value })
  }

  const saveProject = async () => {
    let res = null
    if (mode === 'edit') {
      res = await editProject(projectInfo)
    } else {
      res = await createProject(projectInfo)
    }
    if (res.data) {
      window.location.reload()
    } else if (res.error) {
      setError((res.error as any).message)
    }
  }

  const confirmDisabled =
    !projectInfo.name || !projectInfo.labels.length || !projectInfo.bqQuery || !projectInfo.bqTable

  return (
    <div className={styles.projectEdit}>
      <div className={styles.projectEditProperty}>
        <label>Name</label>
        <InputText
          value={projectInfo.name}
          onChange={(e) => handleChange({ value: e.target.value, field: 'name' })}
        />
      </div>
      <div className={styles.projectEditProperty}>
        <label>Labels (comma separated)</label>
        <InputText
          value={projectInfo.labels.join(', ')}
          onChange={(e) =>
            handleChange({
              value: e.target.value.split(', ').map((l) => l.trim()),
              field: 'labels',
            })
          }
        />
      </div>
      <div className={styles.projectEditProperty}>
        <label>GCS Thumbnails</label>
        <InputText
          value={projectInfo.gcsThumbnails}
          onChange={(e) => handleChange({ value: e.target.value, field: 'gcsThumbnails' })}
        />
      </div>
      <div className={styles.projectEditProperty}>
        <label>
          BQ Query{' '}
          <span className={styles.secondary}>
            (Should return an id field matching the thumbnail file names, other fields will appear
            as metadata)
          </span>
        </label>
        <textarea
          className={styles.textArea}
          name="Text1"
          cols={73}
          rows={7}
          value={projectInfo.bqQuery}
          onChange={(e) => handleChange({ value: e.target.value, field: 'bqQuery' })}
        >
          {projectInfo.bqQuery}
        </textarea>
      </div>
      <div className={styles.projectEditProperty}>
        <label>
          Name for the BQ Table to store labelling results{' '}
          <span className={styles.secondary}>(Should not exist already)</span>
        </label>
        <InputText
          value={projectInfo.bqTable}
          onChange={(e) => handleChange({ value: e.target.value, field: 'bqTable' })}
        />
      </div>
      <div className={styles.projectEditProperty}>
        <label>Scale (in meters per pixel)</label>
        <InputText
          value={projectInfo.scale}
          onChange={(e) => handleChange({ value: e.target.value, field: 'scale' })}
        />
      </div>
      <div className={styles.footer}>
        {error && <p className={styles.error}>{error}</p>}
        <Button
          disabled={confirmDisabled}
          loading={mode === 'edit' ? isEditLoading : isCreateLoading}
          className={styles.saveProjectBtn}
          onClick={saveProject}
        >
          {mode === 'edit' ? 'Update project' : 'Create project'}
        </Button>
      </div>
    </div>
  )
}

export default ProjectForm
