import { createServerFn } from '@tanstack/react-start'

import { GFWAPI } from '@globalfishingwatch/api-client'

export const getUserToken = createServerFn().handler(async () => {
  console.info('Getting user token...')

  const token = await GFWAPI.getToken()
  return token
})

export const getUser = createServerFn().handler(async () => {
  console.info('Getting user token...')

  const token = await GFWAPI.get()
  return token
})
