const baseBlobIntensity = 0.003

// TODO this must vary *within* on zoom level
// TODO also depends on grid size
const baseBlobRadius = 40

export default {
  blob: {
    'heatmap-color': null, // set with color ramp
    'heatmap-weight': 1, // set with value picking
    'heatmap-radius': [
      'interpolate',
      ['exponential', 2],
      ['zoom'],
      0,
      baseBlobRadius,
      16,
      baseBlobRadius * 256,
    ],
    'heatmap-intensity': [
      'interpolate',
      ['exponential', 2],
      ['zoom'],
      0,
      baseBlobIntensity,
      16,
      16 * baseBlobIntensity,
    ],
    'heatmap-intensity-transition': {
      duration: 0,
      delay: 0,
    },
    // 'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 8, 1, 10, 0],
  },
  gridded: {
    // 'fill-opacity': 0.99,
    'fill-color': null, // set with value picking
  },
  extruded: {
    'fill-extrusion-color': null, // set with value picking
    'fill-extrusion-height': 0, // set with value picking (or secondary value?)
  },
}
