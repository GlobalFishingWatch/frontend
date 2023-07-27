import React from 'react'
import { Placement } from 'tippy.js'
import cx from 'classnames'
import { Tooltip } from '../tooltip'
import { TooltipTypes } from '../types/types'
import { ReactComponent as AddPolygon } from '../assets/icons/add-polygon.svg'
import { ReactComponent as Analysis } from '../assets/icons/analysis.svg'
import { ReactComponent as ArrowDown } from '../assets/icons/arrow-down.svg'
import { ReactComponent as ArrowLeft } from '../assets/icons/arrow-left.svg'
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg'
import { ReactComponent as ArrowTop } from '../assets/icons/arrow-top.svg'
import { ReactComponent as Calendar } from '../assets/icons/calendar.svg'
import { ReactComponent as Camera } from '../assets/icons/camera.svg'
import { ReactComponent as CategoryCountryPortals } from '../assets/icons/category-country-portals.svg'
import { ReactComponent as CategoryFishing } from '../assets/icons/category-fishing.svg'
import { ReactComponent as CategoryMarineManager } from '../assets/icons/category-marine-manager.svg'
import { ReactComponent as CategoryNews } from '../assets/icons/category-news.svg'
import { ReactComponent as CategoryReports } from '../assets/icons/category-reports.svg'
import { ReactComponent as CategorySearch } from '../assets/icons/category-search.svg'
import { ReactComponent as Close } from '../assets/icons/close.svg'
import { ReactComponent as Clusters } from '../assets/icons/clusters.svg'
import { ReactComponent as ColorPicker } from '../assets/icons/color-picker.svg'
import { ReactComponent as ColorPickerFilled } from '../assets/icons/color-picker-filled.svg'
import { ReactComponent as Compare } from '../assets/icons/compare.svg'
import { ReactComponent as Copy } from '../assets/icons/copy.svg'
import { ReactComponent as Delete } from '../assets/icons/delete.svg'
import { ReactComponent as Dots } from '../assets/icons/dots.svg'
import { ReactComponent as Download } from '../assets/icons/download.svg'
import { ReactComponent as Drag } from '../assets/icons/drag.svg'
import { ReactComponent as Draw } from '../assets/icons/draw.svg'
import { ReactComponent as Edit } from '../assets/icons/edit.svg'
import { ReactComponent as Email } from '../assets/icons/email.svg'
import { ReactComponent as Encounters } from '../assets/icons/encounters.svg'
import { ReactComponent as EventLegendEncounter } from '../assets/icons/event-legend-encounter.svg'
import { ReactComponent as EventLegendFishing } from '../assets/icons/event-legend-fishing.svg'
import { ReactComponent as EventLegendLoitering } from '../assets/icons/event-legend-loitering.svg'
import { ReactComponent as EventLegendPort } from '../assets/icons/event-legend-port_visit.svg'
import { ReactComponent as EventEncounter } from '../assets/icons/event-encounter.svg'
import { ReactComponent as EventFishing } from '../assets/icons/event-fishing.svg'
import { ReactComponent as EventLoitering } from '../assets/icons/event-loitering.svg'
import { ReactComponent as EventPort } from '../assets/icons/event-port.svg'
import { ReactComponent as EventPortVisit } from '../assets/icons/event-port-visit.svg'
import { ReactComponent as ExternalLink } from '../assets/icons/external-link.svg'
import { ReactComponent as Feedback } from '../assets/icons/feedback.svg'
import { ReactComponent as FilterOff } from '../assets/icons/filter-off.svg'
import { ReactComponent as FilterOn } from '../assets/icons/filter-on.svg'
import { ReactComponent as GFWLogo } from '../assets/icons/gfw-logo.svg'
import { ReactComponent as Graph } from '../assets/icons/graph.svg'
import { ReactComponent as Heatmap } from '../assets/icons/heatmap.svg'
import { ReactComponent as Help } from '../assets/icons/help.svg'
import { ReactComponent as History } from '../assets/icons/history.svg'
import { ReactComponent as Home } from '../assets/icons/home.svg'
import { ReactComponent as Info } from '../assets/icons/info.svg'
import { ReactComponent as Language } from '../assets/icons/language.svg'
import { ReactComponent as Layers } from '../assets/icons/layers.svg'
import { ReactComponent as Logout } from '../assets/icons/logout.svg'
import { ReactComponent as Magic } from '../assets/icons/magic.svg'
import { ReactComponent as Menu } from '../assets/icons/menu.svg'
import { ReactComponent as Minus } from '../assets/icons/minus.svg'
import { ReactComponent as More } from '../assets/icons/more.svg'
import { ReactComponent as Pin } from '../assets/icons/pin.svg'
import { ReactComponent as PinFilled } from '../assets/icons/pin-filled.svg'
import { ReactComponent as Plus } from '../assets/icons/plus.svg'
import { ReactComponent as Polygons } from '../assets/icons/polygons.svg'
import { ReactComponent as Print } from '../assets/icons/print.svg'
import { ReactComponent as Private } from '../assets/icons/private.svg'
import { ReactComponent as Publish } from '../assets/icons/publish.svg'
import { ReactComponent as RemoveFromMap } from '../assets/icons/remove-from-map.svg'
import { ReactComponent as Report } from '../assets/icons/report.svg'
import { ReactComponent as Ruler } from '../assets/icons/ruler.svg'
import { ReactComponent as Satellite } from '../assets/icons/satellite.svg'
import { ReactComponent as Save } from '../assets/icons/save.svg'
import { ReactComponent as Search } from '../assets/icons/search.svg'
import { ReactComponent as Settings } from '../assets/icons/settings.svg'
import { ReactComponent as Share } from '../assets/icons/share.svg'
import { ReactComponent as Skip } from '../assets/icons/skip.svg'
import { ReactComponent as Sparks } from '../assets/icons/sparks.svg'
import { ReactComponent as Split } from '../assets/icons/split.svg'
import { ReactComponent as Target } from '../assets/icons/target.svg'
import { ReactComponent as Tick } from '../assets/icons/tick.svg'
import { ReactComponent as Track } from '../assets/icons/track.svg'
import { ReactComponent as EventGap } from '../assets/icons/event-gap.svg'
// import { ReactComponent as TransmissionsOn } from '../assets/icons/transmissions-on.svg'
import { ReactComponent as Upload } from '../assets/icons/upload.svg'
import { ReactComponent as User } from '../assets/icons/user.svg'
import { ReactComponent as Vessel } from '../assets/icons/vessel.svg'
import { ReactComponent as ViewOnMap } from '../assets/icons/view-on-map.svg'
import { ReactComponent as VisibilityOff } from '../assets/icons/visibility-off.svg'
import { ReactComponent as VisibilityOn } from '../assets/icons/visibility-on.svg'
import { ReactComponent as Warning } from '../assets/icons/warning.svg'
import styles from './Icon.module.css'

export const IconComponents = {
  'add-polygon': AddPolygon,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-top': ArrowTop,
  'category-country-portals': CategoryCountryPortals,
  'category-fishing-activity': CategoryFishing,
  'category-marine-manager': CategoryMarineManager,
  'category-news': CategoryNews,
  'category-reports': CategoryReports,
  'category-search': CategorySearch,
  'color-picker-filled': ColorPickerFilled,
  'color-picker': ColorPicker,
  'event-encounter': EventEncounter,
  'event-fishing': EventFishing,
  'event-gap': EventGap,
  'event-loitering': EventLoitering,
  'event-legend-encounter': EventLegendEncounter,
  'event-legend-fishing': EventLegendFishing,
  'event-legend-loitering': EventLegendLoitering,
  'event-legend-port_visit': EventLegendPort,
  'event-port_visit': EventPortVisit,
  'event-port': EventPort,
  'external-link': ExternalLink,
  'filter-off': FilterOff,
  'filter-on': FilterOn,
  'gfw-logo': GFWLogo,
  'pin-filled': PinFilled,
  'remove-from-map': RemoveFromMap,
  'view-on-map': ViewOnMap,
  'visibility-off': VisibilityOff,
  'visibility-on': VisibilityOn,
  analysis: Analysis,
  calendar: Calendar,
  camera: Camera,
  close: Close,
  clusters: Clusters,
  compare: Compare,
  copy: Copy,
  delete: Delete,
  dots: Dots,
  download: Download,
  drag: Drag,
  draw: Draw,
  edit: Edit,
  email: Email,
  encounters: Encounters,
  feedback: Feedback,
  graph: Graph,
  heatmap: Heatmap,
  help: Help,
  history: History,
  home: Home,
  info: Info,
  language: Language,
  layers: Layers,
  logout: Logout,
  magic: Magic,
  menu: Menu,
  minus: Minus,
  more: More,
  pin: Pin,
  plus: Plus,
  polygons: Polygons,
  print: Print,
  private: Private,
  publish: Publish,
  report: Report,
  ruler: Ruler,
  satellite: Satellite,
  save: Save,
  search: Search,
  settings: Settings,
  share: Share,
  skip: Skip,
  sparks: Sparks,
  split: Split,
  target: Target,
  tick: Tick,
  track: Track,
  upload: Upload,
  user: User,
  vessel: Vessel,
  warning: Warning,
}

export type IconType = keyof typeof IconComponents

export interface IconProps {
  className?: string
  icon: IconType
  style?: React.CSSProperties
  type?: 'default' | 'warning' | 'original-colors'
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
}

const defaultStyle = {}

export function Icon(props: IconProps) {
  const { icon, tooltip, type = 'default', className = '', style = defaultStyle } = props
  const Component = IconComponents[icon]
  if (!Component) {
    console.warn(`Missing icon: ${icon} in ui-components Icon component. Rendering null`)
    return null
  }
  return (
    <Tooltip content={tooltip as React.ReactNode} placement="auto">
      <Component className={cx(styles.icon, styles[type], className)} style={style} />
    </Tooltip>
  )
}
