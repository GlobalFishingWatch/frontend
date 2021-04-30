import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from 'features/app/App'
import configureStore from 'store/store'
import './index.css'

const store = configureStore()

render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)
