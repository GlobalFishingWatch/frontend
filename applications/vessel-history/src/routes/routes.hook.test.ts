import useGFWLogin from '@globalfishingwatch/react-hooks/dist/use-login'
import { useGFWAuthentication } from './routes.hook'

jest.mock('@globalfishingwatch/react-hooks/dist/use-login')

describe('route.hook', () => {
  describe('useGFWAuthentication', () => {
    const mockGFWLogin: jest.Mock = useGFWLogin as jest.Mock
    delete window['location']
    window.location = { href: 'http://initial.url.org/' } as any

    const gfwLoginDefault = {
      loading: true,
      logged: false,
      user: null,
      error: null,
    }

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('redirects to login screen when not logged', () => {
      const initialUrl = window.location.href
      mockGFWLogin.mockReturnValue({ ...gfwLoginDefault, loading: false })
      const result = useGFWAuthentication()
      expect(result).toEqual({
        loading: false,
        logged: false,
        error: null,
        user: null,
      })
      expect(window.location.href).not.toEqual(initialUrl)
    })
    it('does not redirect to login screen when logged', () => {
      const initialUrl = window.location.href
      const loginData = {
        loading: false,
        logged: true,
        error: null,
        user: { name: 'john', age: 20 },
      }
      mockGFWLogin.mockReturnValue(loginData)
      const result = useGFWAuthentication()
      expect(result).toEqual(loginData)
      expect(window.location.href).toEqual(initialUrl)
    })
  })
})
