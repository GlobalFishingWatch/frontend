import { useState } from 'react'
import cx from 'classnames'

import { Button, InputText } from '@globalfishingwatch/ui-components'

import { PATH_BASENAME } from 'data/config'

import styles from './WorkspaceGenerator.module.css'

type Message = {
  role: 'user' | 'agent'
  message: string
}

function useWorkspacesAgent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState<string | null>(null)

  async function sendMessage(userMessage: string) {
    setMessages((prev) => [...prev, { role: 'user', message: userMessage }])
    setIsLoading(true)
    setHasError(null)
    try {
      const response = await fetch(`${PATH_BASENAME}/api/workspaces-generator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      })
      const data = (await response.json()) as { message: string; error?: string }
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }
      setMessages((prev) => [...prev, { role: 'agent', message: data.message ?? '' }])
    } catch (err: any) {
      setHasError(err.message || 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return { messages, sendMessage, isLoading, hasError }
}

const WorkspaceGenerator = () => {
  const [input, setInput] = useState('hola')
  const { messages, sendMessage, isLoading, hasError } = useWorkspacesAgent()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input) {
      sendMessage(input)
      setInput('')
    }
  }

  return (
    <div>
      <div className={styles.messagesContainer}>
        {messages.length > 0 && (
          <ul className={styles.messages}>
            {messages.map((msg, i) => {
              return (
                <li
                  key={i}
                  className={cx(
                    styles.message,
                    msg.role === 'user' ? styles.userMessage : styles.agentMessage
                  )}
                >
                  <span>{msg.message}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <InputText
          className={styles.input}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me to create a workspace"
          disabled={isLoading}
        />
        <Button
          size="medium"
          loading={isLoading}
          className={styles.button}
          disabled={isLoading || !input.trim()}
        >
          Send
        </Button>
      </form>
      {hasError && <p className={styles.error}>{hasError}</p>}
    </div>
  )
}

export default WorkspaceGenerator
