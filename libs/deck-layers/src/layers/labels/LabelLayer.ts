import type { Accessor, LayerContext, LayerProps, LayersList, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { CollisionFilterExtensionProps, DataFilterExtensionProps } from '@deck.gl/extensions'
import type { TextLayerProps } from '@deck.gl/layers'
import { _MultiIconLayer, TextLayer } from '@deck.gl/layers'
import type { Feature, Point } from '@loaders.gl/schema'
import type { Position } from 'geojson'

import { BLEND_BACKGROUND } from '#config/colorRamps.config'
import { LayerGroup } from '#config/sort.config'
import { getLayerGroupOffset } from '#utils'
import { hexToDeckColor } from '#utils/colors'

import { DECK_FONT, loadDeckFont } from './labels.fonts'
import type { LabelBox } from './labels.utils'
import { CHAR_WIDTH_RATIO, LINE_HEIGHT_RATIO, resolveLabelOverlap } from './labels.utils'

type LabelLayerState = {
  fontLoaded: boolean
  layout?: {
    key: string
    data: unknown
    getPixelOffset: Accessor<any, [number, number]>
  }
}

const FONT_ATLAS_PADDING = 6

const PRINTABLE_ASCII = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('')

class PaddedCharactersLayer extends _MultiIconLayer<any> {
  static layerName = 'PaddedCharactersLayer'

  getShaders() {
    const shaders = super.getShaders()
    const pad = FONT_ATLAS_PADDING.toFixed(1)
    shaders.vs = shaders.vs
      .replace(
        'vec2 iconSize = instanceIconFrames.zw;',
        `vec2 iconSize = instanceIconFrames.zw + ${pad} * 2.0;`
      )
      .replace('instanceIconFrames.xy,', `instanceIconFrames.xy - ${pad},`)
      .replace(
        'instanceIconFrames.xy + iconSize,',
        `instanceIconFrames.xy + instanceIconFrames.zw + ${pad},`
      )
    return shaders
  }
}

type LabelLayerProps<DataT> = {
  getPosition?: Accessor<DataT, Position>
  getPickingInfo?: ({ info }: { info: PickingInfo<DataT> }) => typeof info
  filterRange?: DataFilterExtensionProps['filterRange']
  getFilterValue?: DataFilterExtensionProps['getFilterValue']
  getCollisionPriority?: CollisionFilterExtensionProps['getCollisionPriority']
  collisionTestProps?: CollisionFilterExtensionProps['collisionTestProps']
  avoidOverlap?: boolean
}

export class LabelLayer<DataT = unknown> extends CompositeLayer<
  TextLayerProps<DataT> & LayerProps & LabelLayerProps<DataT>
> {
  static layerName = 'LabelLayer'
  static defaultProps = {
    getColor: [255, 255, 255, 255],
    getSize: 14,
    outlineColor: hexToDeckColor(BLEND_BACKGROUND, 1),
    characterSet:
      PRINTABLE_ASCII +
      'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăąĆćĊċČčďĐđĒēĔėĘęěĞğĠġĦħĨĩĪīĬĭİıĶķĺļĽľŁłńņŇňŌōŎŏŐőŒœŘřŚśŞşŠšŢţťŨũŪūŬŭůųŹźŻżŽžƏƠơƯưǫȘșȚțə̧̱̀̃̄̇̈ЈАИНОПСЧабвгдезийклмнопрстуцчьяاةجدرسقلمنويٍḌḍḎḏḐḑḤḥḨḩḯḶṅṆṞṟṢṣṬṭṯẔẕẖẠạẢảẤấầẩẬậẮắẰằẴẾếỀềỆệỉỊịỌọỏốỒồổỘộỚớờủứỪỳỹ–‘’”丁不东中丹主义乌乍乔也买亚亞京人什他代令以伊伐伦伯佛侧俄保俾克六兰共关其典兹内冈军冰冲几凯列刚利别力加努劳勒匈北区华南博卡卢印危厄厘原及叙古各合吉和哇哈哥唐喀国图土圣圭地坡坦埃埔域基堡塔塞墨士外多大太夫奇奥姆委威嫩孟宁安宛宾密富寨小尔尼属屬山屿岛岩岸峡川巴布希帕帝干平库度廷开弗律得德恩意慕戴户所托拉拜拿挝挪捷提摩撒支敦文斐斯新日旦时旺昂普智曼朗朝本权来极林果柬根格桑梵森楚次武比毛民求汗汤汶沃沙河治泊法波泰泽洋洛津洪洲浅济浦海港湾滕滩澳濑爪爱牙特玻珀珊班琴瑙瑚瑞瓜瓦甲甸疆登白百的皮盆直禄福科秘突立第米索红约纳纽绍维缅缓罗美群老耳联肯脱腊舌航色芬苏英茨荷莫莱菲萄营萨葡蒂蒙蓬西角诺贝赞赤赫越路达迪逊速道那邦部都鄂酋里锡长门阿陀陵陶隆雷霍非韦韩領顿领香马鲁鲜鹿麦黄黎黑',
    outlineWidth: FONT_ATLAS_PADDING,
    fontSettings: { sdf: true, buffer: FONT_ATLAS_PADDING, radius: FONT_ATLAS_PADDING },
    sizeUnits: 'pixels',
    getTextAnchor: 'middle',
    getAlignmentBaseline: 'center',
    pickable: false,
    fontFamily: DECK_FONT,
    transitions: {
      getPosition: 50,
    },
    getPixelOffset: [0, -15],
    getPosition: (d: Feature<Point>) => d.geometry.coordinates,
    getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Overlay, params),
  }
  declare state: LabelLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    if (typeof document !== 'undefined') {
      loadDeckFont().then((loaded) => {
        this.setState({ fontLoaded: loaded })
      })
    }
    this.state = {
      fontLoaded: false,
    }
  }

  _resolve<T>(accessor: unknown, d: DataT, index: number, fallback: T): T {
    if (typeof accessor === 'function') {
      return (accessor as any)(d, { index, data: this.props.data, target: [] }) as T
    }
    return (accessor as T) ?? fallback
  }

  _getDeclutteredPixelOffsetAccesor(): Accessor<DataT, [number, number]> | undefined {
    const { data, getText, getSize, getPixelOffset, getPosition } = this.props
    const items = data as DataT[]
    if (!Array.isArray(items) || items.length < 2) {
      return undefined
    }
    const { viewport } = this.context
    const boxes: LabelBox[] = []
    const offsets: [number, number][] = []
    for (let i = 0; i < items.length; i++) {
      const d = items[i]
      const position = this._resolve<Position>(getPosition, d, i, [0, 0])
      const [x, y] = viewport.project(position as number[]) as number[]
      const offset = this._resolve<[number, number]>(getPixelOffset, d, i, [0, 0])
      const size = this._resolve<number>(getSize, d, i, 14)
      const text = this._resolve<string>(getText, d, i, '') || ''
      const longestLine = text.split('\n').reduce((max, line) => Math.max(max, line.length), 0)
      offsets.push(offset)
      boxes.push({
        x,
        y,
        w: longestLine * size * CHAR_WIDTH_RATIO,
        h: size * LINE_HEIGHT_RATIO,
      })
    }
    const resolved = resolveLabelOverlap(boxes, offsets)
    return (_d: DataT, info: { index: number }) => resolved[info.index] || [0, 0]
  }

  _getCachedPixelOffset(): Accessor<DataT, [number, number]> | undefined {
    const { viewport } = this.context
    const { bearing = 0, pitch = 0 } = viewport as { bearing?: number; pitch?: number }
    const key = `${viewport.zoom}|${bearing}|${pitch}|${viewport.width}|${viewport.height}`
    const cached = this.state.layout
    if (cached && cached.key === key && cached.data === this.props.data) {
      return cached.getPixelOffset
    }
    const getPixelOffset = this._getDeclutteredPixelOffsetAccesor()
    if (getPixelOffset) {
      this.state.layout = { key, data: this.props.data, getPixelOffset }
    }
    return getPixelOffset
  }

  renderLayers(): LayersList {
    if (!this.state.fontLoaded) return []
    const getPixelOffset = this.props.avoidOverlap ? this._getCachedPixelOffset() : undefined
    return [
      new TextLayer(
        this.props,
        this.getSubLayerProps({
          id: `${this.props.id}-text`,
          updateTriggers: this.props.updateTriggers,
        }),
        {
          parameters: { depthCompare: 'always', depthWriteEnabled: false },
          _subLayerProps: { characters: { type: PaddedCharactersLayer } },
          ...(getPixelOffset && { getPixelOffset }),
        }
      ),
    ]
  }
}
