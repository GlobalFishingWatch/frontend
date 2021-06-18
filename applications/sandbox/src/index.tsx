import { render } from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App'
import './index.css'

render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
