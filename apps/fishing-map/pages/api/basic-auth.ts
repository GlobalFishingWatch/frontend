import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  // const { headers, body, } = _
  console.log('Basic Auth required from: ', _.url)
  res.setHeader('WWW-authenticate', 'Basic realm="Secure Area"')
  res.statusCode = 401
  res.end(`Auth Required.`)
}
