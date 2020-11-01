import React, { memo } from 'react'
import { LegendLayer } from './MapLegend'
import styles from './Bivariate.module.css'
import BivariateArrows from './Bivariate-arrows'

type BivariateLegendProps = {
  layer: LegendLayer
  className?: string
}

function BivariateLegend({ layer, className }: BivariateLegendProps) {
  if (!layer || !layer.bivariateRamp || !layer.sublayersBreaks) return null
  return (
    <svg
      className={styles.container}
      width="184px"
      height="170px"
      viewBox="0 0 184 170"
      version="1.1"
    >
      <g stroke="none" fill="none">
        <g transform="translate(-73, -246)">
          <g>
            <g transform="translate(0, 70)">
              <g transform="translate(93, 176)">
                <g className={styles.labels}>
                  <BivariateArrows />
                  <text>
                    <tspan x="14" y="68">
                      {layer.sublayersBreaks[0][0]}
                    </tspan>
                  </text>
                  <text>
                    <tspan x="28" y="46">
                      {layer.sublayersBreaks[0][1]}
                    </tspan>
                  </text>
                  <text>
                    <tspan x="42" y="31">
                      {layer.sublayersBreaks[0][2]}
                    </tspan>
                  </text>
                  <text>
                    <tspan x="56" y="15">
                      {layer.sublayersBreaks[0][3]}
                    </tspan>
                  </text>
                  <text>
                    <tspan x="28" y="90">
                      {layer.sublayersBreaks[1][1]}
                    </tspan>
                  </text>
                  <text>
                    <tspan x="42" y="105">
                      {layer.sublayersBreaks[1][2]}
                    </tspan>
                  </text>
                  <text>
                    <tspan x="56" y="120">
                      {layer.sublayersBreaks[1][3]}
                    </tspan>
                  </text>
                </g>
                <g transform="translate(81, 62) scale(1, -1) rotate(45) translate(-81, -62) translate(41, 22)">
                  {layer.bivariateRamp.map((color: string, i: number) => (
                    <rect
                      key={i}
                      fill={color as string}
                      x={20 * ((i - 1) % 4)}
                      y={20 * (3 - Math.floor((i - 1) / 4))}
                      width="20"
                      height="20"
                    ></rect>
                  ))}
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export default memo(BivariateLegend)
