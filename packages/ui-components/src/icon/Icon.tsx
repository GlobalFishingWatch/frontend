import React, { useMemo, memo } from 'react'
import { Placement } from 'tippy.js'
import cx from 'classnames'
import Tooltip from '../tooltip'
import { ReactComponent as ArrowDown } from '../assets/icons/arrow-down.svg'
import { ReactComponent as ArrowLeft } from '../assets/icons/arrow-left.svg'
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg'
import { ReactComponent as ArrowTop } from '../assets/icons/arrow-top.svg'
import { ReactComponent as Camera } from '../assets/icons/camera.svg'
import { ReactComponent as Close } from '../assets/icons/close.svg'
import { ReactComponent as ColorPicker } from '../assets/icons/color-picker.svg'
import { ReactComponent as ColorPickerFilled } from '../assets/icons/color-picker-filled.svg'
import { ReactComponent as Compare } from '../assets/icons/compare.svg'
import { ReactComponent as Delete } from '../assets/icons/delete.svg'
import { ReactComponent as Download } from '../assets/icons/download.svg'
import { ReactComponent as Edit } from '../assets/icons/edit.svg'
import { ReactComponent as Email } from '../assets/icons/email.svg'
import { ReactComponent as FilterOff } from '../assets/icons/filter-off.svg'
import { ReactComponent as FilterOn } from '../assets/icons/filter-on.svg'
import { ReactComponent as Graph } from '../assets/icons/graph.svg'
import { ReactComponent as Home } from '../assets/icons/home.svg'
import { ReactComponent as Info } from '../assets/icons/info.svg'
import { ReactComponent as Layers } from '../assets/icons/layers.svg'
import { ReactComponent as Logout } from '../assets/icons/logout.svg'
import { ReactComponent as Menu } from '../assets/icons/menu.svg'
import { ReactComponent as Minus } from '../assets/icons/minus.svg'
import { ReactComponent as Plus } from '../assets/icons/plus.svg'
import { ReactComponent as Publish } from '../assets/icons/publish.svg'
import { ReactComponent as RemoveFromMap } from '../assets/icons/remove-from-map.svg'
import { ReactComponent as Ruler } from '../assets/icons/ruler.svg'
import { ReactComponent as Report } from '../assets/icons/report.svg'
import { ReactComponent as Satellite } from '../assets/icons/satellite.svg'
import { ReactComponent as Search } from '../assets/icons/search.svg'
import { ReactComponent as Settings } from '../assets/icons/settings.svg'
import { ReactComponent as Share } from '../assets/icons/share.svg'
import { ReactComponent as Skip } from '../assets/icons/skip.svg'
import { ReactComponent as Split } from '../assets/icons/split.svg'
import { ReactComponent as Target } from '../assets/icons/target.svg'
import { ReactComponent as Tick } from '../assets/icons/tick.svg'
import { ReactComponent as Upload } from '../assets/icons/upload.svg'
import { ReactComponent as User } from '../assets/icons/user.svg'
import { ReactComponent as ViewOnMap } from '../assets/icons/view-on-map.svg'
import { ReactComponent as Warning } from '../assets/icons/warning.svg'
import styles from './Icon.module.css'

export const IconComponents = {
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-top': ArrowTop,
  camera: Camera,
  close: Close,
  'color-picker': ColorPicker,
  'color-picker-filled': ColorPickerFilled,
  compare: Compare,
  delete: Delete,
  download: Download,
  edit: Edit,
  email: Email,
  'filter-off': FilterOff,
  'filter-on': FilterOn,
  graph: Graph,
  home: Home,
  info: Info,
  logout: Logout,
  layers: Layers,
  menu: Menu,
  minus: Minus,
  plus: Plus,
  publish: Publish,
  'remove-from-map': RemoveFromMap,
  ruler: Ruler,
  report: Report,
  satellite: Satellite,
  search: Search,
  settings: Settings,
  share: Share,
  skip: Skip,
  split: Split,
  target: Target,
  tick: Tick,
  upload: Upload,
  user: User,
  'view-on-map': ViewOnMap,
  warning: Warning,
}

interface IconProps {
  className?: string
  icon: keyof typeof IconComponents
  type?: 'default' | 'warning'
  tooltip?: React.ReactChild | React.ReactChild[] | string
  tooltipPlacement?: Placement
}

const Icon: React.FC<IconProps> = (props) => {
  const { icon, tooltip, type = 'default', className = '' } = props
  const Component = IconComponents[icon]
  return (
    <Tooltip content={tooltip} placement="auto">
      <Component className={cx(styles.icon, styles[type], className)} />
    </Tooltip>
  )
}

export default memo(Icon)
