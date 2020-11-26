const toFixed = (value: number, decimals = 2) =>
  (Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals)

export default toFixed
