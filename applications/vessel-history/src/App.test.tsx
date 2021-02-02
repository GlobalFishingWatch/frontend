import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { render } from '@testing-library/react'
import useGFWLogin from '@globalfishingwatch/react-hooks/dist/use-login'
import store from './store'
import App from './App'

jest.mock('@globalfishingwatch/react-hooks/dist/use-login')

beforeEach(() => {
  useGFWLogin.mockClear()
})

const assignMock = jest.fn()
delete window.location
window.location = { assign: assignMock }

afterEach(() => {
  assignMock.mockClear()
})

it('renders splash screen while loading', () => {
  useGFWLogin.mockReturnValue({
    loading: true,
    logged: false,
    user: null,
    error: null,
  })
  const tree = renderer
    .create(
      <Provider store={store}>
        <App />
      </Provider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('redirects to login screen when not logged', () => {
  useGFWLogin.mockReturnValue({
    loading: false,
    logged: false,
    user: null,
    error: null,
  })
  const tree = renderer.create(
    <Provider store={store}>
      <App />
    </Provider>
  )
  expect(assignMock).toHaveBeenCalled()
})
it('renders home screen when not loading', () => {
  useGFWLogin.mockReturnValue({
    loading: false,
    logged: true,
    user: null,
    error: null,
  })
  const tree = renderer
    .create(
      <Provider store={store}>
        <App />
      </Provider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
