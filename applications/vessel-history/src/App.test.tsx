import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { render } from '@testing-library/react'
import store from './store'
import App from './App'

it('renders splash screen while loading', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <App />
      </Provider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
