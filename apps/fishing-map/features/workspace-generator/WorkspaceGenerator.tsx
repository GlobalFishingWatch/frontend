import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Button, Icon, InputText, Spinner } from '@globalfishingwatch/ui-components'

import { PATH_BASENAME } from 'data/config'
import { selectUserId } from 'features/user/selectors/user.permissions.selectors'

import styles from './WorkspaceGenerator.module.css'

type Message = {
  role: 'user' | 'agent'
  message: string
}

const EXAMPLE_MESSAGES = [
  'Italian trawlers fishing in the Mediterranean last year',
  'What Peruvian vesels visited Quito in February?',
  'Encounters and port visits of Lake Aurora last month',
  'What is the fishing activity in the Gulf of Mexico?',
  'Longliners fishing in the Pacific in 2024',
  'Cargo traffic near Ascension Island',
  'Spanish vessels fishing in France in 2023',
  'Activity of the vessel with MMSI 228015700',
  'Chinese squid jiggers near Galapagos last 3 years',
  'Fishing activity of French trawlers in the North Sea this year',
  'Which Filipino vessels were in Manila in January?',
  'Port visits of MV Arctic Sunrise in the last 6 months',
  'What fishing activity is occurring near the Canary Islands?',
  'Japanese longliners in the Indian Ocean in 2023',
  'Bunker traffic in Western Indian Ocean',
  'Greek bulk carriers operating in Turkey in 2024',
  'Activity of the vessel with IMO 9684067',
  'Chinese fishing vessels near Falkland Islands in the last year',
  'Carrier activity in the South China Sea',
  'Vessel movements off the coast of Somalia',
]

function useWorkspacesAgent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState<string | null>(null)
  const userId = useSelector(selectUserId)
  const [threadId, setThreadId] = useState<string | null>(null)

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
        body: JSON.stringify({ message: userMessage, userId, threadId }),
      })
      const data = (await response.json()) as { message: string; error?: string; threadId: string }
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }
      setMessages((prev) => [...prev, { role: 'agent', message: data.message ?? '' }])
      setThreadId(data.threadId)
    } catch (err: any) {
      setHasError(err.message || 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return { messages, sendMessage, isLoading, hasError }
}

const WorkspaceGenerator = () => {
  const [input, setInput] = useState('')
  const { messages, sendMessage, isLoading, hasError } = useWorkspacesAgent()
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [rollingMessageIndex, setRollingMessageIndex] = useState(
    Math.floor(Math.random() * EXAMPLE_MESSAGES.length)
  )
  const rollingMessage = EXAMPLE_MESSAGES[rollingMessageIndex]
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setRollingMessageIndex(Math.floor(Math.random() * EXAMPLE_MESSAGES.length))
    }, 5000)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
    return () => clearInterval(interval)
  }, [messages.length])

  function scrollToBottom() {
    if (messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
        })
        inputRef.current?.focus()
      }, 1)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input) {
      scrollToBottom()
      await sendMessage(input)
      setInput('')
      scrollToBottom()
    }
  }

  return (
    <div className={styles.container}>
      <div ref={messagesContainerRef} className={styles.messagesContainer}>
        {messages.length > 0 ? (
          <ul>
            {messages.map((msg, i) => {
              return (
                <li
                  key={i}
                  className={cx(
                    styles.message,
                    msg.role === 'user' ? styles.userMessage : styles.agentMessage
                  )}
                >
                  <p className={styles.messageText}>{msg.message}</p>
                </li>
              )
            })}
            {isLoading && (
              <li className={cx(styles.message, styles.agentMessage)}>
                <Spinner size="small" color="#ffffff" />
              </li>
            )}
          </ul>
        ) : (
          <p className={styles.exampleMessages}>{`e.g. ${rollingMessage}`}</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <InputText
          className={styles.input}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask GFW workspace generator"
          disabled={isLoading}
          ref={inputRef}
        />
        <Button className={styles.button} disabled={isLoading || !input.trim()}>
          <Icon icon="arrow-right" />
        </Button>
      </form>
      {hasError && <p className={styles.error}>{hasError}</p>}
    </div>
  )
}

export default WorkspaceGenerator
