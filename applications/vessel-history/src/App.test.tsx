import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import { useGFWAuthentication } from 'routes/routes.hook'
import store from './store'
import App from './App'

jest.mock('routes/routes.hook')
jest.useFakeTimers()

describe('<App />', () => {
  const mockGFWAuthentication: jest.Mock = useGFWAuthentication as jest.Mock

  const gfwLoginDefault = {
    loading: true,
    logged: false,
    user: null,
    error: null,
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders splash screen while loading', () => {
    mockGFWAuthentication.mockReturnValue(gfwLoginDefault)
    const component = render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000)
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('renders home screen when not loading', () => {
    mockGFWAuthentication.mockReturnValue({
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
