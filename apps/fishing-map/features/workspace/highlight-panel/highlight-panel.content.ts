import { AIS_DATAVIEW_INSTANCE_ID } from 'data/highlighted-workspaces/report.dataviews'

import {
  IS_PRODUCTION_BUILD,
  IS_PRODUCTION_WORKSPACE_ENV,
  PATH_BASENAME,
} from '../../../data/config'
import type { Locale } from '../../../types'

type HighlighPanelConfigLocale = {
  [locale in Locale]?: {
    title: string
    description: string
    learnMoreUrl?: string
  }
}

export type HighlightPanelConfig = {
  dataviewInstanceId: string
  localStorageKey: string
  imageUrl: string
  learnMoreUrl?: string
  delayed?: number
  workspaceUrl?: string
  releaseDateTimestamp: number
} & HighlighPanelConfigLocale

const HIGHLIGHT_POPUP_KEY = 'HighlightPopup'

/**
 * To use as releaseDateTimestamp while the release date is not yet defined.
 *
 * Eg:
 * {
 *   dataviewInstanceId: 'vms-with-some-country',
 *   releaseDateTimestamp: NEXT_YEAR,
 *   localStorageKey: HIGHLIGHT_POPUP_KEY,
 *   delayed: 1000,
 *   ...
 * }
 *
 */
// const NEXT_YEAR = Date.now() + 1000 * 60 * 60 * 24 * 365
const BASE_HIGHLIGHT_CONFIG = {
  localStorageKey: HIGHLIGHT_POPUP_KEY,
  delayed: 1000,
}
// To display a new highlight popup, just add a HighlightPanelConfig element to this array.
// It's important to define a unique dataviewInstanceId and the releaseDateTimestamp
// so that the popup is shown in production only after that date
const HIGHLIGHT_CONFIGS: HighlightPanelConfig[] = [
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: AIS_DATAVIEW_INSTANCE_ID,
    releaseDateTimestamp: Date.parse('2025-05-21T00:00:00Z'),
    imageUrl: '',
    learnMoreUrl: ' https://globalfishingwatch.org/faqs/port-buffer-explained',
    en: {
      title: 'New Port Buffer Applied',
      description:
        'Fishing effort within 3km of ports is now filtered by default to reduce misleading results near anchorages. Change or remove this filter in the activity layer settings.',
    },
    es: {
      title: 'Nuevo búfer de puerto aplicado',
      description:
        'El esfuerzo de pesca aparente a menos de 3 km de los puertos ahora se filtra por defecto para reducir los resultados engañosos cerca de los fondeaderos. Cambie o elimine este filtro en la configuración de la capa de actividad.',
    },
    pt: {
      title: 'Novo buffer de porto aplicado',
      description:
        'O esforço de pesca aparente a menos de 3 km dos portos agora é filtrado por padrão para reduzir resultados enganosos perto de ancoradouros. Altere ou remova este filtro nas configurações da camada de atividade.',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'vessel-groups',
    releaseDateTimestamp: Date.parse('2024-10-24T00:00:00Z'),
    imageUrl: '',
    learnMoreUrl: 'https://globalfishingwatch.org/platform-updates/',
    en: {
      title: 'New vessel groups feature',
      description:
        'Create your vessel group to visualize group activity on the map. Click on the vessel group name to launch an analysis and view group report.',
    },
    es: {
      title: 'Nueva funcionalidad de grupos de embarcaciones',
      description:
        'Cree su grupo de embarcaciones para visualizar la actividad del grupo en el mapa. Haga clic en el nombre del grupo de embarcaciones para iniciar un análisis y ver el informe del grupo.',
    },
    pt: {
      title: 'Nova funcionalidade de grupos de embarcações',
      description:
        'Crie seu grupo de embarcações para visualizar a atividade do grupo no mapa. Clique no nome do grupo de embarcações para iniciar uma análise e ver o relatório do grupo.',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'fishing-ais-pipe-3',
    releaseDateTimestamp: Date.parse('2024-08-01T00:00:00Z'),
    imageUrl: `${PATH_BASENAME}/images/before-after@2x.gif`,
    learnMoreUrl: 'https://globalfishingwatch.org/platform-updates/',
    en: {
      title: 'Updated AIS data and new features',
      description:
        'Global Fishing Watch has improved underlying AIS data accuracy and now supports high resolution map layers. Data improvements may affect fishing effort and activity calculations. Workspaces should be updated to reflect changes',
    },
    es: {
      title: 'Datos de AIS actualizados y nuevas funcionalidades',
      description:
        'Global Fishing Watch ha mejorado la precisión de los datos AIS subyacentes y ahora admite visualizar las capas con mayor resolución. Las mejoras en los datos pueden afectar los cálculos de la actividad y el esfuerzo pesquero. Los espacios de trabajo deben actualizarse para reflejar los cambios',
      learnMoreUrl: 'https://globalfishingwatch.org/es/faqs/marine-traffic-nueva-fuente-ais/',
    },
    pt: {
      title: 'Dados de AIS atualizados e novas funcionalidades',
      description:
        'Global Fishing Watch melhorou a precisão dos dados AIS subjacentes e agora suporta visualizar as camadas com maior resolução. As melhorias nos dados podem afetar os cálculos da atividade e do esforço pesqueiro. Os espaços de trabalho devem ser atualizados para refletir as mudanças',
      learnMoreUrl: 'https://globalfishingwatch.org/es/faqs/marine-traffic-nueva-fuente-ais/',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'fishing-ais',
    releaseDateTimestamp: Date.parse('2024-05-07T00:00:00Z'),
    imageUrl: `${PATH_BASENAME}/images/marine-traffic-ais.jpg`,
    learnMoreUrl: 'https://globalfishingwatch.org/faqs/marine-traffic-new-ais-source/',
    en: {
      title: 'New - Marine Traffic as a terrestrial AIS data source to improve coverage',
      description:
        'From 3 January 2024, Global Fishing Watch has added Marine Traffic as a terrestrial automatic identification system (AIS) data source to improve coverage in three areas - Mediterranean Sea, South China Sea, and the North Sea. This data is now automatically included in the apparent fishing effort and vessel presence map layers.',
    },
    es: {
      title: 'Marine Traffic - nueva fuente de datos terrestre de AIS para mejorar la cobertura',
      description:
        'Desde el 3 de enero de 2024, Global Fishing Watch ha incorporado Marine Traffic como fuente de datos del sistema de identificación automática (AIS) terrestre para mejorar la cobertura en tres áreas: el Mar Mediterráneo, el Mar de China Meridional y el Mar del Norte. Estos datos ahora se incluyen automáticamente en las capas de esfuerzo de pesca aparente y presencia.',
      learnMoreUrl: 'https://globalfishingwatch.org/es/faqs/marine-traffic-nueva-fuente-ais/',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'fishing-ais',
    releaseDateTimestamp: Date.parse('2024-04-08T00:00:00Z'),
    imageUrl: ``,
    learnMoreUrl: 'https://globalfishingwatch.org/faqs/2024-april-data-error/',
    en: {
      title:
        'Resolved - Global Fishing Watch has resolved an underlying AIS data error in the platform.',
      description:
        'If you accessed Global Fishing Watch AIS or VMS data between 26 January - 10 April 2024, there may be errors in the fishing effort and fishing event data. All errors have been resolved and the data has been corrected. Our advice is to repeat any analysis completed with the correct data. We’re sorry for any inconvenience caused.',
    },
    es: {
      title:
        'Resuelto - Global Fishing Watch ha resuelto un error en los datos AIS en la plataforma.',
      description:
        'Si accedió a los datos AIS o VMS de Global Fishing Watch entre el 26 de enero y el 10 de abril de 2024, es posible que haya errores en los datos de esfuerzo pesquero y eventos de pesca. Todos los errores han sido resueltos y los datos han sido corregidos. Nuestra recomendación es repetir cualquier análisis que se haya completado en ese periodo utilizando los datos correctos que ya están disponibles. Sentimos las molestias ocasionadas.',
      learnMoreUrl: 'https://globalfishingwatch.org/es/faqs/abril-2024-error-de-datos/',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'bathymetry-workspace',
    releaseDateTimestamp: Date.parse('2024-01-08T00:00:00Z'),
    imageUrl: `${PATH_BASENAME}/images/chlorophyl@2x.jpg`,
    learnMoreUrl: 'https://globalfishingwatch.org/platform-updates/',
    en: {
      title: 'New environmental data sources added',
      description:
        'Global Fishing Watch has added new datasets, including dynamic oceanographic and ecosystem data following your feedback. Explore the new datasets alongside human activity, and analyze them through space and time using dynamic reports to learn more about your area of interest.',
    },
    pt: {
      title: 'Novas fontes de dados ambientais adicionadas',
      description:
        'Global Fishing Watch adicionou novos conjuntos de dados, incluindo dados oceanográficos dinâmicos e de ecossistemas, seguindo seu feedback. Explore os novos conjuntos de dados ao lado da atividade humana e analise-os através do espaço e do tempo usando relatórios dinâmicos para saber mais sobre sua área de interesse.',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'sar',
    releaseDateTimestamp: Date.parse('2024-01-04T00:00:00Z'),
    imageUrl: `${PATH_BASENAME}/images/sar.webp`,
    learnMoreUrl:
      'https://globalfishingwatch.org/press-release/new-research-harnesses-ai-and-satellite-imagery-to-reveal-the-expanding-footprint-of-human-activity-at-sea',
    en: {
      title: 'Data added from satellite radar reveals industrial vessels hidden from public view',
      description:
        'Global Fishing Watch has added an open global radar detections layer, derived from synthetic aperture radar or SAR, to display vessels at sea in any weather conditions. SAR can show vessels that can not be picked up by other cooperative tracking systems and infrastructure at sea like oil platforms and wind farms.',
    },
    pt: {
      title:
        'Dados adicionados de radar de satélite revelam embarcações industriais ocultas da visão pública',
      description:
        'Global Fishing Watch adicionou uma camada de detecções de radar global aberto, derivada de radar de abertura sintética ou SAR, para exibir embarcações no mar em quaisquer condições climáticas. O SAR pode mostrar embarcações que não podem ser captadas por outros sistemas e infraestrutura de rastreamento cooperativo no mar, como plataformas de petróleo e parques eólicos.',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'vms-with-png',
    releaseDateTimestamp: Date.parse('2023-06-01T00:00:00Z'),
    imageUrl: `${PATH_BASENAME}/images/papua_new_guinea-vms.webp`,
    learnMoreUrl: 'https://globalfishingwatch.org/papua-new-guinea',
    en: {
      title: 'Papua New Guinea’s VMS data is now available',
      description:
        'Vessel monitoring system (VMS) data is provided by the National Fisheries Authority of Papua New Guinea. It is now possible to track the position and activity of all vessels comprising the Fishing Industry Association of Papua New Guinea’s fishing fleet operating in Papua New Guinea’s national waters.',
    },
    es: {
      title: 'Los datos VMS de Papúa Nueva Guinea ya están disponibles',
      description:
        'Los datos del sistema de monitoreo de embarcaciones (VMS) son proporcionados por la Autoridad Nacional de Pesca de Papúa Nueva Guinea. Ahora es posible rastrear la posición y la actividad de todos los barcos que componen la flota pesquera de la Asociación de la Industria Pesquera de Papúa Nueva Guinea que opera en las aguas nacionales de Papúa Nueva Guinea.',
    },
    fr: {
      title: 'Les données VMS de la Papouasie-Nouvelle-Guinée sont désormais disponibles',
      description:
        "Les données du système de surveillance des navires (VMS) sont fournies par l'Autorité nationale des pêches de Papouasie-Nouvelle-Guinée. Il est désormais possible de suivre la position et l'activité de tous les navires de la flotte de pêche de l'Association de l'industrie de la pêche de Papouasie-Nouvelle-Guinée opérant dans les eaux nationales de Papouasie-Nouvelle-Guinée.",
    },
    pt: {
      title: 'Os dados VMS da Papua Nova Guiné estão disponíveis',
      description:
        'Os dados do sistema de monitoramento de embarcações (VMS) são fornecidos pela Autoridade Pesqueira Nacional de Papua Nova Guiné. Agora é possível rastrear a posição e a atividade de todas as embarcações que compõem a frota de pesca da Associação da Indústria Pesqueira da Papua Nova Guiné que opera nas águas nacionais da Papua Nova Guiné.',
    },
  },
]

const AVAILABLE_HIGHLIGHT_CONFIGS = HIGHLIGHT_CONFIGS
  // sort them by release date descending
  .sort((a, b) => (a.releaseDateTimestamp > b.releaseDateTimestamp ? -1 : 1))
const HIGHLIGHT_CONFIG_LATEST = AVAILABLE_HIGHLIGHT_CONFIGS.at(0) as HighlightPanelConfig
const HIGHLIGHT_CONFIG_PREVIOUS = AVAILABLE_HIGHLIGHT_CONFIGS.at(1) as HighlightPanelConfig

const IS_PRODUCTION_ENV = IS_PRODUCTION_BUILD && IS_PRODUCTION_WORKSPACE_ENV

const DISPLAY_LATEST_POPUP =
  // Non production environments always show the latest popup
  !IS_PRODUCTION_ENV ||
  // Production displays the latest only after its release date
  Date.now() >= (HIGHLIGHT_CONFIG_LATEST?.releaseDateTimestamp as number)

const HIGHLIGHT_CONFIG = DISPLAY_LATEST_POPUP ? HIGHLIGHT_CONFIG_LATEST : HIGHLIGHT_CONFIG_PREVIOUS

export const HIGHLIGHT_DATAVIEW_INSTANCE_ID = HIGHLIGHT_CONFIG?.dataviewInstanceId

export default HIGHLIGHT_CONFIG
