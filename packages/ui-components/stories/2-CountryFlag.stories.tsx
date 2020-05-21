import React from 'react'

// import { action } from '@storybook/addon-actions'
import CountryFlag from '../src/countryflag'

export default {
  title: 'CountryFlag',
  component: CountryFlag,
}

export const Spain = () => <CountryFlag iso="ESP" />
