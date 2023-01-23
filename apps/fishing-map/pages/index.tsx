import path from 'path'
import dynamic from 'next/dynamic'
import { getToken } from 'next-auth/jwt'
import { GFW } from '@globalfishingwatch/authjs-client'
import { AUTH_SECRET } from './api/auth/[...nextauth]'

// This is needed by nx/next builder to run build the standalone next app properly
// https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
path.resolve('./next.config.js')

const MapProvider = dynamic(() => import('react-map-gl').then((module) => module.MapProvider), {
  ssr: false,
})

const AppNoSSRComponent = dynamic(() => import('../features/app/App'), {
  ssr: false,
})

export async function getServerSideProps(context) {
  const token = (await getToken({
    req: context.req,
    secret: AUTH_SECRET,
  })) as { bearerToken: string; refreshToken: string }

  const client = new GFW({
    bearerToken: token?.bearerToken,
    refreshToken: token?.refreshToken,
  })
  try {
    const user = token ? await client.fetchUser() : await client.fetchGuestUser()
    return { props: { user } }
  } catch (e) {
    return {}
  }
}

const Index = (props) => {
  return (
    <MapProvider>
      <AppNoSSRComponent user={props.user} />
    </MapProvider>
  )
}
export default Index
