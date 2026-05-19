import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth')({
  server: {
    handlers: {
      GET: async () => {
        return new Response('Auth Required.', {
          status: 401,
          headers: { 'WWW-authenticate': 'Basic realm="Secure Area"' },
        })
      },
    },
  },
})
