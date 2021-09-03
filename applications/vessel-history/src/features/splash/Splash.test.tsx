import { render, waitFor } from '@testing-library/react'
import { useTranslation } from 'react-i18next'
import { useUser } from 'features/user/user.hooks'
import Splash from './Splash'

jest.mock('features/user/user.hooks')
jest.mock('react-i18next')

describe('Splash', () => {
  const mockUseTranslation: jest.Mock = useTranslation as jest.Mock
  const mockUseUser: jest.Mock = useUser as jest.Mock
  const userDefault = {
    loading: true,
    logged: false,
    user: null,
    error: null,
    authorized: null,
    login: () => jest.fn(),
    logout: () => jest.fn(),
  }

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (_ns: any, fallback: any) => fallback,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', async () => {
    const user = { ...userDefault, logged: true }

    mockUseUser.mockReturnValue(user)

    const component = render(<Splash />)
    const splashElement = await waitFor(() => component.getByTestId('splash'))
    expect(splashElement).toMatchSnapshot()
    expect(splashElement).toBeInTheDocument()
  })
})
