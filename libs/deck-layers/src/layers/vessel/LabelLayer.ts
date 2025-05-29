import type { Accessor, LayerContext, LayerProps, LayersList, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { TextLayerProps } from '@deck.gl/layers'
import { TextLayer } from '@deck.gl/layers'
import type { Feature, Point } from '@loaders.gl/schema'

import { BLEND_BACKGROUND, getLayerGroupOffset, LayerGroup } from '../../utils'
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
    outlineColor: hexToDeckColor(BLEND_BACKGROUND, 1),
    characterSet:
      ' "&\'(),-./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ[]`abcdefghijklmnopqrstuvwxyzÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăąĆćĊċČčďĐđĒēĔėĘęěĞğĠġĦħĨĩĪīĬĭİıĶķĺļĽľŁłńņŇňŌōŎŏŐőŒœŘřŚśŞşŠšŢţťŨũŪūŬŭůųŹźŻżŽžƏƠơƯưǫȘșȚțə̧̱̀̃̄̇̈ЈАИНОПСЧабвгдезийклмнопрстуцчьяاةجدرسقلمنويٍḌḍḎḏḐḑḤḥḨḩḯḶṅṆṞṟṢṣṬṭṯẔẕẖẠạẢảẤấầẩẬậẮắẰằẴẾếỀềỆệỉỊịỌọỏốỒồổỘộỚớờủứỪỳỹ–‘’”丁不东中丹主义乌乍乔也买亚亞京人什他代令以伊伐伦伯佛侧俄保俾克六兰共关其典兹内冈军冰冲几凯列刚利别力加努劳勒匈北区华南博卡卢印危厄厘原及叙古各合吉和哇哈哥唐喀国图土圣圭地坡坦埃埔域基堡塔塞墨士外多大太夫奇奥姆委威嫩孟宁安宛宾密富寨小尔尼属屬山屿岛岩岸峡川巴布希帕帝干平库度廷开弗律得德恩意慕戴户所托拉拜拿挝挪捷提摩撒支敦文斐斯新日旦时旺昂普智曼朗朝本权来极林果柬根格桑梵森楚次武比毛民求汗汤汶沃沙河治泊法波泰泽洋洛津洪洲浅济浦海港湾滕滩澳濑爪爱牙特玻珀珊班琴瑙瑚瑞瓜瓦甲甸疆登白百的皮盆直禄福科秘突立第米索红约纳纽绍维缅缓罗美群老耳联肯脱腊舌航色芬苏英茨荷莫莱菲萄营萨葡蒂蒙蓬西角诺贝赞赤赫越路达迪逊速道那邦部都鄂酋里锡长门阿陀陵陶隆雷霍非韦韩領顿领香马鲁鲜鹿麦黄黎黑',
    outlineWidth: 20,
    fontSettings: { sdf: true, smoothing: 0.2, buffer: 30 },
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
