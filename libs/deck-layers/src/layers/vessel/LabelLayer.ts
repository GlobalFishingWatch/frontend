import type { Accessor, LayerContext, LayerProps, LayersList, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { TextLayerProps } from '@deck.gl/layers'
import { TextLayer } from '@deck.gl/layers'
import type { Feature, Point } from '@loaders.gl/schema'

import { BLEND_BACKGROUND } from '../../utils'
import { hexToDeckColor } from '../../utils/colors'
import { DECK_FONT, loadDeckFont } from '../../utils/fonts'

type LabelLayerState = {
  fontLoaded: boolean
}

type LabelLayerProps<DataT> = {
  getPickingInfo?: ({ info }: { info: PickingInfo<DataT> }) => typeof info
  getCollisionPriority?: Accessor<DataT, number>
  collisionTestProps?: Record<string, number>
}

export class LabelLayer<DataT = unknown> extends CompositeLayer<
  TextLayerProps<DataT> & LayerProps & LabelLayerProps<DataT>
> {
  static layerName = 'LabelLayer'
  static defaultProps = {
    getColor: [255, 255, 255, 255],
    getSize: 14,
    outlineColor: hexToDeckColor(BLEND_BACKGROUND, 0.5),
    characterSet:
      ' "&\'(),-./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ[]`abcdefghijklmnopqrstuvwxyzÀÁÂÄÅÆÇÈÉÍÎÐÒÓÔÖØÚÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāăąĆćċČčďĐđĒēėęěğĠġĦħĩĪīĭİıĶķĺļĽľŁłńņňŌōŏŐőŒœŘřŚśŞşŠšŢţťũŪūŬŭůųźŻżŽžƏơưǫȘșȚțə̧̱̀̃̄̇̈ЈАИНОПСЧабвгдезийклмнопрстуцчьяاةجدرسقلمنويٍḍḎḏḐḑḤḥḨḩḯṅṞṟṢṣṬṭṯẔẕẖạảẤấầẩậắằếềệỉịọỏốồổộớờủứỳỹ–‘’”、丁不东中丹主乌乍也买亚京他代以伊伐伦伯佛俄保克兰共关其典兹内冈冰几凯列刚利别力加努劳勒匈北南博卡卢印危厄及叙古台各合吉和哈哥喀国图土圣圭地坡坦埃埔基堡塔塞墨士多大夫奥委威嫩孟宁安宛宾密富寨尔尼属山岛巴布希帕帝干库度廷开律得德恩意慕所托拉拜拿挝挪捷提摩撒支敦文斐斯新日旦时旺昂普智曼朗朝本来松极林果柬根格桑森比毛民求汗汤汶沙泊法波泰泽洋洛津洪洲济浦海港湾澳爱牙特玻班瑙瑞瓜瓦甸疆登白百的皮直福科秘突立米索约纳纽绍维缅罗美群老耳联肯脱腊舌色芬苏英茨荷莫莱菲萄萨葡蒙蓬西角诞诺贝赞赤赫越路达迪道那都酋里长门阿陀陶隆非韦韩顿领香马鲁鲜麦黎黑ÃÊËÌÏÑÕÙÛŸÑ |',
    outlineWidth: 20,
    fontSettings: { sdf: true, smoothing: 0.2, buffer: 15 },
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
    parameters: {
      depthCompare: 'always',
    },
  }
  state!: LabelLayerState

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

  renderLayers(): LayersList {
    if (!this.state.fontLoaded) return []
    return [
      new TextLayer(
        this.props,
        this.getSubLayerProps({
          id: `${this.props.id}-text`,
          updateTriggers: this.props.updateTriggers,
        })
      ),
    ]
  }
}
