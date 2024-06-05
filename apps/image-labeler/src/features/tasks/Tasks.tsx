import { getRouteApi } from '@tanstack/react-router'
import styles from './tasks.module.css'

const route = getRouteApi('/tasks/$taskId')

export function App() {
  const { taskId } = route.useParams()
  return <h2 className={styles.title}>Your tasks: {taskId}</h2>
}

export default App
