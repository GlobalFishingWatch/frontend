import React from 'react'
import { cleanup, render } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'

jest.mock('@globalfishingwatch/api-client')

afterEach(cleanup)

const _store = store
describe('App', () => {
  test('displays login page', () => {
    const component = render(
      <Provider store={_store}>
        <App />
      </Provider>
    )
    expect(component.container).toMatchSnapshot()
  })
})
