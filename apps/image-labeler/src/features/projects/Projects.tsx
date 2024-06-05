// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link } from '@tanstack/react-router'
import { useGFWLogin, useGFWLoginRedirect } from '@globalfishingwatch/react-hooks/use-login'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'
import styles from './projects.module.css'

const tasks = [
  { id: 1, name: 'Task 1' },
  { id: 2, name: 'Task 2' },
]

export function App() {
  const login = useGFWLogin()
  useGFWLoginRedirect(login)
  if (!login.logged) {
    return <Spinner />
  }
  return (
    <div>
      <h2 className={styles.title}>Projects page</h2>
      {tasks.map((task) => (
        <div key={task.id}>
          <Link
            to="/tasks/$taskId"
            params={{
              taskId: task.id.toString(),
            }}
          >
            {task.name}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default App
