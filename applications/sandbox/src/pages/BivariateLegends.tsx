import { normal, screen } from 'color-blend'
import { RGB, RGBA } from 'color-blend/dist/types'
import { Fragment } from 'react'

const BACKGROUND = '#244979'

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 1,
      }
    : null
}

const componentToHex = (c: number) => {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

const rgbaToHex = ({ r, g, b }: RGBA) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

const getBlend = (color1: RGBA, color2: RGBA) => {
  return rgbaToHex(normal(hexToRgb(BACKGROUND) as RGBA, screen(color1 as RGBA, color2 as RGBA)))
}

const getColorRampByOpacitySteps = (color: string, numSteps = 4) => {
  const rgbColor = hexToRgb(color) as RGB
  const opacitySteps = [...Array(numSteps)].map((_, i) => i / (numSteps - 1))
  return opacitySteps.map((opacity) => {
    return {
      r: rgbColor?.r,
      g: rgbColor?.g,
      b: rgbColor?.b,
      a: opacity,
    }
  })
}

export const BivariateLegends = () => {
  const teal = getColorRampByOpacitySteps('#00FFBC')
  const magenta = getColorRampByOpacitySteps('#FF64CE')
  const lilac = getColorRampByOpacitySteps('#9CA4FF')
  const orange = getColorRampByOpacitySteps('#FFAA0D')
  const green = getColorRampByOpacitySteps('#d1f359')
  // const red = getColorRampByOpacitySteps('#FF6854')
  // const sky = getColorRampByOpacitySteps('#00EEFF')
  // const salmon = getColorRampByOpacitySteps('#FFAE9B')
  // const yellow = getColorRampByOpacitySteps('#e2d005')

  const ramp1 = orange
  const ramp2 = lilac

  return (
    <Fragment>
      <svg width="184px" height="170px" viewBox="0 0 184 170" version="1.1">
        <g stroke="none" fill="none">
          <g transform="translate(-73, -246)">
            <g>
              <g transform="translate(0, 70)">
                <g transform="translate(93, 176)">
                  <g transform="translate(81, 62) scale(1, -1) rotate(45) translate(-81, -62) translate(41, 22)">
                    <rect fill="rgba(0, 36, 87, 0)" x="-20" y="80" width="20" height="20"></rect>
                    <rect fill="#244979" x="0" y="60" width="20" height="20"></rect>
                    <rect fill="#207D8C" x="20" y="60" width="20" height="20"></rect>
                    <rect fill="#17B4A0" x="40" y="60" width="20" height="20"></rect>
                    <rect fill="#26FFBD" x="60" y="60" width="20" height="20"></rect>
                    <rect fill="#66518F" x="0" y="40" width="20" height="20"></rect>
                    <rect fill="#667CA0" x="20" y="40" width="20" height="20"></rect>
                    <rect fill="#63B3AD" x="40" y="40" width="20" height="20"></rect>
                    <rect fill="#66FFC2" x="60" y="40" width="20" height="20"></rect>
                    <rect fill="#A659A9" x="0" y="20" width="20" height="20"></rect>
                    <rect fill="#A67CB2" x="20" y="20" width="20" height="20"></rect>
                    <rect fill="#A6B3BB" x="40" y="20" width="20" height="20"></rect>
                    <rect fill="#A6FFC7" x="60" y="20" width="20" height="20"></rect>
                    <rect fill="#FF64CE" x="0" y="0" width="20" height="20"></rect>
                    <rect fill="#FF7CCE" x="20" y="0" width="20" height="20"></rect>
                    <rect fill="#FFB3CE" x="40" y="0" width="20" height="20"></rect>
                    <rect fill="#FFFFFF" x="60" y="0" width="20" height="20"></rect>0
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <svg width="184px" height="170px" viewBox="0 0 184 170" version="1.1">
        <g stroke="none" fill="none">
          <g transform="translate(-73, -246)">
            <g>
              <g transform="translate(0, 70)">
                <g transform="translate(93, 176)">
                  <g transform="translate(81, 62) scale(1, -1) rotate(45) translate(-81, -62) translate(41, 22)">
                    <rect fill="rgba(0, 36, 87, 0)" x="-20" y="80" width="20" height="20"></rect>
                    <rect
                      fill={getBlend(ramp1[0], ramp2[0])}
                      x="0"
                      y="60"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[1], ramp2[0])}
                      x="20"
                      y="60"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[2], ramp2[0])}
                      x="40"
                      y="60"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[3], ramp2[0])}
                      x="60"
                      y="60"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[0], ramp2[1])}
                      x="0"
                      y="40"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[1], ramp2[1])}
                      x="20"
                      y="40"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[2], ramp2[1])}
                      x="40"
                      y="40"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[3], ramp2[1])}
                      x="60"
                      y="40"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[0], ramp2[2])}
                      x="0"
                      y="20"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[1], ramp2[2])}
                      x="20"
                      y="20"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[2], ramp2[2])}
                      x="40"
                      y="20"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[3], ramp2[2])}
                      x="60"
                      y="20"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[0], ramp2[3])}
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[1], ramp2[3])}
                      x="20"
                      y="0"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[2], ramp2[3])}
                      x="40"
                      y="0"
                      width="20"
                      height="20"
                    ></rect>
                    <rect
                      fill={getBlend(ramp1[3], ramp2[3])}
                      x="60"
                      y="0"
                      width="20"
                      height="20"
                    ></rect>
                    0
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </Fragment>
  )
}

export default BivariateLegends
