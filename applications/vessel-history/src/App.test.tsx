import { Provider } from 'react-redux'
import { render, waitFor } from '@testing-library/react'
import { useUser } from 'features/user/user.hooks'
import store from './store'
import App from './App'

jest.mock('features/user/user.hooks')
jest.useFakeTimers()

describe('<App />', () => {
  const mockUser: jest.Mock = useUser as jest.Mock

  const gfwLoginDefault = {
    loading: true,
    logged: false,
    user: null,
    error: null,
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders splash screen while loading', async () => {
    mockUser.mockReturnValue(gfwLoginDefault)
    const component = render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    const splashElement = await waitFor(() => component.getByTestId('splash'))
    expect(splashElement).toBeInTheDocument()
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('renders home screen when not loading', () => {
    mockUser.mockReturnValue({
      ...gfwLoginDefault,
      loading: false,
      logged: true,
    })
    const component = render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    jest.runAllTimers()
    component.rerender()
    expect(component.asFragment()).toMatchSnapshot()
  })
})
