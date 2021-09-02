import { Provider } from 'react-redux'
import React from 'react'
import { render } from '@testing-library/react'
import useGFWLogin from '@globalfishingwatch/react-hooks/dist/use-login'
import store from './store'
import App from './App'

jest.mock('@globalfishingwatch/react-hooks/dist/use-login')
jest.useFakeTimers()

describe('<App />', () => {
  const assignMock = jest.fn()
  const mockGFWLogin: jest.Mock = useGFWLogin as jest.Mock
  delete window['location']
  window.location = { assign: assignMock }

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
    mockGFWLogin.mockReturnValue(gfwLoginDefault)
    const component = render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000)
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('redirects to login screen when not logged', () => {
    mockGFWLogin.mockReturnValue({ ...gfwLoginDefault, loading: false })
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    expect(assignMock).toHaveBeenCalled()
  })
  it('renders home screen when not loading', () => {
    mockGFWLogin.mockReturnValue({
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
