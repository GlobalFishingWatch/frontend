import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '../components/next-auth/layout'
import AccessDenied from '../components/next-auth/access-denied'
import { PATH_BASENAME } from '../components/data/config'

export default function Page() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const [content, setContent] = useState()

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${PATH_BASENAME}/api/examples/protected`)
      const json = await res.json()
      if (json.content) {
        setContent(json.content)
      }
    }
    fetchData()
  }, [session])

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  // If session exists, display content
  return (
    <Layout>
      <h1>Protected Page</h1>
      <p>
        <strong>{content || '\u00a0'}</strong>
      </p>
      <h2>GFW AUTH ME</h2>
      <p>/api/user/me</p>
      <iframe src="api/user/me" />
    </Layout>
  )
}
