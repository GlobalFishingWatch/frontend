import React from 'react'

// import { action } from '@storybook/addon-actions'
import MiniGlobe from '../src/miniglobe'

export default {
  title: 'MiniGlobe',
  component: MiniGlobe,
}

export const Spain = () => <MiniGlobe zoom={4} center={{ latitude: 0, longitude: 0 }} />
