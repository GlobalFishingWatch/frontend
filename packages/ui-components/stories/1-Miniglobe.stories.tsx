import React from 'react'
import { withKnobs, number, object } from '@storybook/addon-knobs'

// import { action } from '@storybook/addon-actions'
import MiniGlobe from '../src/miniglobe'

export default {
  title: 'MiniGlobe',
  component: MiniGlobe,
  decorators: [withKnobs],
}

const defaultCenter = {
  latitude: 0,
  longitude: 0,
}
const defaultBounds = {
  north: 10,
  south: -10,
  west: -10,
  east: 10,
}
export const Spain = () => (
  <MiniGlobe
    size={number('size', 380)}
    center={object('center', defaultCenter)}
    bounds={object('bounds', defaultBounds)}
  />
)
