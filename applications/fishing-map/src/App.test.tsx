import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from 'store'
import App from './App'

test('renders app', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  )

  expect(getByText(/Sidebar/i)).toBeInTheDocument()
})
