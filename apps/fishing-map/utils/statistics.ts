export function weightedMean(arrValues: number[], arrWeights: number[]) {
  const result = arrValues
    .map(function (value, i) {
      const weight = arrWeights[i]
      const sum = value * weight

      return [sum, weight]
    })
    .reduce(
      function (p, c) {
        return [p[0] + c[0], p[1] + c[1]]
      },
      [0, 0]
    )

  return result[0] / result[1]
}
