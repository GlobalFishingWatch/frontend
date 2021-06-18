import React from 'react'
import { render } from 'react-dom'
import './index.css'
import Login from './Login'
import App from './App'

render(
  <Login>
    <App />
  </Login>,
  document.getElementById('root')
)
