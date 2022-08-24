import { DescriptionChunks } from './analysisDescription.hooks'
import styles from './AnalysisDescription.module.css'

const AnalysisDescription: React.FC<{ description: DescriptionChunks }> = (props) => {
  const { description } = props
  if (!description || !description.length) return null
  return (
    <h3 className={styles.title}>
      {description.map((d) =>
        d.strong ? <strong key={d.label}>{d.label}</strong> : <span key={d.label}>{d.label}</span>
      )}
      .
    </h3>
  )
}

export default AnalysisDescription
