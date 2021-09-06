import React, { Fragment } from 'react'
import { Provider } from 'react-redux'
import { render, waitFor, act } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from 'features/i18n/__mocks__/i18n'
import { useUser } from 'features/user/user.hooks'
import store from './store'
import App from './App'

jest.mock('features/user/user.hooks')
// This is to setup i18n provider for the test
render(
  <I18nextProvider i18n={i18n as any}>
    <Fragment />
  </I18nextProvider>
)

describe('<App />', () => {
  const mockUser: jest.Mock = useUser as jest.Mock

  const gfwLoginDefault = {
    loading: true,
    logged: false,
    user: null,
    error: null,
  }

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllTimers()
  })

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

  it('renders home screen when not loading', async () => {
    mockUser.mockReturnValue({
      ...gfwLoginDefault,
      loading: false,
      logged: true,
      authorized: true,
      user: { id: '1', name: 'foo' },
    })
    const component = render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    act(() => {
      jest.runAllTimers() // trigger setTimeout
    })
    await waitFor(() => component.getByTestId('home'))
    expect(component.asFragment()).toMatchSnapshot()
  })
})
