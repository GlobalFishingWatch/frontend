import React, { Suspense, lazy } from 'react'
import { Placement } from 'tippy.js'
import cx from 'classnames'
import { Tooltip } from '../tooltip'
import { TooltipTypes } from '../types/types'
import styles from './Icon.module.css'

export const IconComponents = {
  'add-polygon': lazy(() =>
    import('../assets/icons/add-polygon.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'arrow-down': lazy(() =>
    import('../assets/icons/analysis.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'arrow-left': lazy(() =>
    import('../assets/icons/annotation.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'arrow-right': lazy(() =>
    import('../assets/icons/arrow-down.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'arrow-top': lazy(() =>
    import('../assets/icons/arrow-left.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'category-country-portals': lazy(() =>
    import('../assets/icons/arrow-right.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'category-fishing-activity': lazy(() =>
    import('../assets/icons/arrow-top.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'category-marine-manager': lazy(() =>
    import('../assets/icons/blue-habitats-logo.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'category-news': lazy(() =>
    import('../assets/icons/calendar.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'category-reports': lazy(() =>
    import('../assets/icons/camera.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'category-search': lazy(() =>
    import('../assets/icons/category-country-portals.svg').then((m) => ({
      default: m.ReactComponent,
    }))
  ),
  'color-picker-filled': lazy(() =>
    import('../assets/icons/category-fishing.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'color-picker': lazy(() =>
    import('../assets/icons/category-marine-manager.svg').then((m) => ({
      default: m.ReactComponent,
    }))
  ),
  'event-encounter': lazy(() =>
    import('../assets/icons/category-news.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'event-fishing': lazy(() =>
    import('../assets/icons/category-reports.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'event-gap': lazy(() =>
    import('../assets/icons/category-search.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'event-loitering': lazy(() =>
    import('../assets/icons/close.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'event-legend-encounter': lazy(() =>
    import('../assets/icons/clusters.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'event-legend-fishing': lazy(() =>
    import('../assets/icons/color-picker.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'event-legend-loitering': lazy(() =>
    import('../assets/icons/color-picker-filled.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'event-legend-port_visit': lazy(() =>
    import('../assets/icons/compare.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'event-port_visit': lazy(() =>
    import('../assets/icons/copernicus-logo.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'event-port': lazy(() =>
    import('../assets/icons/copy.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  expand: lazy(() =>
    import('../assets/icons/delete.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'external-link': lazy(() =>
    import('../assets/icons/dots.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'fao-logo': lazy(() =>
    import('../assets/icons/download.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'filter-off': lazy(() =>
    import('../assets/icons/drag.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'filter-on': lazy(() =>
    import('../assets/icons/draw.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'fit-to-timerange': lazy(() =>
    import('../assets/icons/edit.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'gebco-logo': lazy(() =>
    import('../assets/icons/edit-off.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'gfw-logo': lazy(() =>
    import('../assets/icons/email.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'layers-on': lazy(() =>
    import('../assets/icons/encounters.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'layers-off': lazy(() =>
    import('../assets/icons/event-encounter.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'pin-filled': lazy(() =>
    import('../assets/icons/event-fishing.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'remove-from-map': lazy(() =>
    import('../assets/icons/event-gap.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'view-on-map': lazy(() =>
    import('../assets/icons/event-legend-encounter.svg').then((m) => ({
      default: m.ReactComponent,
    }))
  ),
  'visibility-off': lazy(() =>
    import('../assets/icons/event-legend-fishing.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'visibility-on': lazy(() =>
    import('../assets/icons/event-legend-loitering.svg').then((m) => ({
      default: m.ReactComponent,
    }))
  ),
  analysis: lazy(() =>
    import('../assets/icons/event-legend-port_visit.svg').then((m) => ({
      default: m.ReactComponent,
    }))
  ),
  annotation: lazy(() =>
    import('../assets/icons/event-loitering.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'blue-habitats-logo': lazy(() =>
    import('../assets/icons/event-port.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  calendar: lazy(() =>
    import('../assets/icons/event-port-visit.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  camera: lazy(() =>
    import('../assets/icons/expand.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  close: lazy(() =>
    import('../assets/icons/external-link.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  clusters: lazy(() =>
    import('../assets/icons/fao-logo.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  compare: lazy(() =>
    import('../assets/icons/feedback.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'copernicus-logo': lazy(() =>
    import('../assets/icons/feedback-error.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  copy: lazy(() =>
    import('../assets/icons/filter-off.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  delete: lazy(() =>
    import('../assets/icons/filter-on.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  dots: lazy(() =>
    import('../assets/icons/fit-to-timerange.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  download: lazy(() =>
    import('../assets/icons/gca-logo.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  drag: lazy(() =>
    import('../assets/icons/gebco-logo.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  draw: lazy(() =>
    import('../assets/icons/gfw-logo.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  edit: lazy(() =>
    import('../assets/icons/graph.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'edit-off': lazy(() =>
    import('../assets/icons/heatmap.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  email: lazy(() =>
    import('../assets/icons/help.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  encounters: lazy(() =>
    import('../assets/icons/history.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  feedback: lazy(() =>
    import('../assets/icons/home.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'feedback-error': lazy(() =>
    import('../assets/icons/hycom-logo.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'gca-logo': lazy(() =>
    import('../assets/icons/info.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  graph: lazy(() =>
    import('../assets/icons/language.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  heatmap: lazy(() =>
    import('../assets/icons/layers.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  help: lazy(() =>
    import('../assets/icons/layers-off.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  history: lazy(() =>
    import('../assets/icons/layers-on.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  home: lazy(() =>
    import('../assets/icons/logout.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'hycom-logo': lazy(() =>
    import('../assets/icons/magic.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  info: lazy(() =>
    import('../assets/icons/marine-regions-logo.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  language: lazy(() =>
    import('../assets/icons/menu.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  layers: lazy(() =>
    import('../assets/icons/minus.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  logout: lazy(() =>
    import('../assets/icons/more.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  magic: lazy(() =>
    import('../assets/icons/nasa-logo.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'marine-regions-logo': lazy(() =>
    import('../assets/icons/pacioos-logo.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  menu: lazy(() => import('../assets/icons/pin.svg').then((m) => ({ default: m.ReactComponent }))),
  minus: lazy(() =>
    import('../assets/icons/pin-filled.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  more: lazy(() => import('../assets/icons/plus.svg').then((m) => ({ default: m.ReactComponent }))),
  'nasa-logo': lazy(() =>
    import('../assets/icons/polygons.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'pacioos-logo': lazy(() =>
    import('../assets/icons/print.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  pin: lazy(() =>
    import('../assets/icons/private.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  plus: lazy(() =>
    import('../assets/icons/protected-planet-logo.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  polygons: lazy(() =>
    import('../assets/icons/protected-seas-logo.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  print: lazy(() =>
    import('../assets/icons/publish.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  private: lazy(() =>
    import('../assets/icons/remove-from-map.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'protected-planet-logo': lazy(() =>
    import('../assets/icons/report.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'protected-seas-logo': lazy(() =>
    import('../assets/icons/ruler.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  publish: lazy(() =>
    import('../assets/icons/satellite.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  report: lazy(() =>
    import('../assets/icons/save.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  ruler: lazy(() =>
    import('../assets/icons/search.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  satellite: lazy(() =>
    import('../assets/icons/settings.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  save: lazy(() =>
    import('../assets/icons/share.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  search: lazy(() =>
    import('../assets/icons/skip.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  settings: lazy(() =>
    import('../assets/icons/sparks.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  share: lazy(() =>
    import('../assets/icons/split.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  skip: lazy(() =>
    import('../assets/icons/target.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  sparks: lazy(() =>
    import('../assets/icons/tick.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  split: lazy(() =>
    import('../assets/icons/track.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  target: lazy(() =>
    import('../assets/icons/unep-logo.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  tick: lazy(() =>
    import('../assets/icons/upload.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  track: lazy(() =>
    import('../assets/icons/user.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  upload: lazy(() =>
    import('../assets/icons/vessel.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  user: lazy(() =>
    import('../assets/icons/view-on-map.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  'unep-logo': lazy(() =>
    import('../assets/icons/visibility-off.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  vessel: lazy(() =>
    import('../assets/icons/visibility-on.svg').then((m) => ({ default: m.ReactComponent }))
  ),
  warning: lazy(() =>
    import('../assets/icons/warning.svg').then((m) => ({ default: m.ReactComponent }))
  ),
}

export type IconType = keyof typeof IconComponents

export interface IconProps {
  className?: string
  icon: IconType
  style?: React.CSSProperties
  type?: 'default' | 'warning' | 'original-colors'
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
  testId?: string
}

const defaultStyle = {}

export function Icon(props: IconProps) {
  const { icon, tooltip, type = 'default', className = '', style = defaultStyle, testId } = props
  const Component = IconComponents[icon]
  if (!Component) {
    console.warn(`Missing icon: ${icon} in ui-components Icon component. Rendering null`)
    return null
  }
  return (
    <Tooltip content={tooltip as React.ReactNode} placement="auto">
      <Suspense fallback={null}>
        <Component
          className={cx(styles.icon, styles[type], className)}
          style={style}
          {...(testId && { 'data-test': testId })}
        />
      </Suspense>
    </Tooltip>
  )
}
