import { PATH_BASENAME } from 'data/map/config'
import type { Locale } from 'types'

type WelcomeContentLang = {
  [locale in Locale]?: {
    title: string
    description: string
  }
}
type WelcomeContent = {
  version?: number
  partnerLogo?: string
  partnerLink?: string
} & WelcomeContentLang

export type WelcomeContentKey = 'vessel-profile' | 'deep-sea-mining'

const WELCOME_POPUP_CONTENT: {
  [category in WelcomeContentKey]?: WelcomeContent
} = {
  'vessel-profile': {
    partnerLogo: 'https://globalfishingwatch.org/wp-content/uploads/TMT_logo_primary_RGB@2x.png',
    partnerLink: 'https://www.tm-tracking.org/',
    en: {
      title: 'Welcome to Vessel Viewer',
      description: `
      <p>Vessel Viewer is an innovative vessel history tool that arms authorities with the information needed to make a rapid assessment of a fishing vessel's recent operations and compliance.</p>
      <p>Developed in partnership by Global Fishing Watch and TMT, the tool provides information on a vessel's identity, fishing activity, port visits and transshipments. This allows users to identify and cross-check relevant, absent or false information about a given vessel and its fishing operations to inform decision-making and operational planning.</p>
      <p>By helping individuals better understand vessel behavior and providing them with broader analysis of vessel operations, Vessel Viewer supports a range of applications that can help bolster ocean governance.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-vessel-orange.png">Vessel history tool</h2>
      <p>Vessel Viewer provides information on a vessel's identity, fishing activity, port visits, authorizations and transshipments.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-inspector-orange.png">Vessel profiles</h2>
      <p>Detailed vessel profiles show identity information alongside tracks and summaries of events that can be interpreted by timeline, location or relationships between vessels.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Searching for vessels</h2>
      <p>Anyone can search for specific vessels across self reported information and over 40 public vessel registries, build custom vessel groups, share links to vessel profiles and save them offline as PDF files.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-teamwork-orange.png">Partnerships</h2>
      <p>We have engaged with a range of partners from across the globe—all utilizing the vessel viewer tool for its various applications —including port inspectors, fisheries enforcement, insurance and seafood supply chains. This collaboration allows us to understand how we can empower stakeholders to achieve their goals and improve the tool over time.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Feedback</h2>
      <p>Help us to improve Vessel Viewer by sending feedback to: <a href="mailto:support@globalfishingwatch.org">support@globalfishingwatch.org</a> </p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Register for free access to additional features</h2>
      <p>Register for a free Global Fishing Watch <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager">account</a> to access advanced search options, analysis features, and data downloads. Registration takes two minutes.</p>
      `,
    },
    fr: {
      title: 'Bienvenue dans Vessel Viewer',
      description: `
      <p>Vessel Viewer est un outil innovant d'historique de navires fournissant aux autorités les informations nécessaires pour évaluer rapidement les opérations récentes et la conformité d'un navire de pêche.</p>
      <p>Développé en partenariat par Global Fishing Watch et TMT, l'outil fournit des informations sur l'identité d'un navire, ses activités de pêche, ses visites de ports et ses transbordements. Vessel Viewer permet aux utilisateurs d'identifier et de recouper les informations pertinentes, manquantes ou fausses sur un navire donné et ses opérations de pêche, afin de renseigner les prises de décisions et la planification opérationnelle.</p>
      <p>En aidant les individus à mieux comprendre le comportement des navires et en leur fournissant une analyse plus générale des opérations des navires, Vessel Viewer offre de vastes possibilités d'applications pouvant contribuer à renforcer la gouvernance des océans.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-vessel-orange.png">Outil d'historique de navires</h2>
      <p>Vessel Viewer fournit des informations sur l'identité d'un navire, son activité de pêche, ses visites de ports, ses autorisations et ses transbordements.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-inspector-orange.png">Profils de navires</h2>
      <p>Les profils détaillés des navires incluent des informations d'identité, des tracés de déplacement et des synthèses d'événements qui peuvent être interprétés sous différents angles selon la chronologie, la localité ou les relations entre les navires.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Rechercher des navires</h2>
      <p>N'importe qui peut rechercher des navires spécifiques dans les informations autodéclarées et dans plus de 40 registres publics de navires, créer des groupes de navires personnalisés, partager des liens vers des profils de navires et les enregistrer hors ligne sous forme de fichiers PDF.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-teamwork-orange.png">Partenariats</h2>
      <p>Nous avons collaboré avec un large éventail de partenaires du monde entier — utilisant tous l'outil Vessel Viewer pour ses diverses applications — notamment des inspecteurs au port, des autorités de contrôle des pêches, des sociétés d'assurance et de sociétés de chaînes d'approvisionnement en produits de la mer. Cette collaboration nous permet de comprendre comment nous pouvons aider les parties prenantes d'atteindre leurs objectifs tout en améliorant l'outil au fil du temps.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Commentaires</h2>
      <p>Aidez-nous à améliorer Vessel Viewer en envoyant vos commentaires à: <a href="mailto:support@globalfishingwatch.org">support@globalfishingwatch.org</a> </p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Enregistrez-vous pour accéder gratuitement à toutes les fonctions</h2>
      <p>Créez un <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager">compte</a> Global Fishing Watch gratuit pour accéder aux fonctionnalités d'analyse avancées, aux téléchargements de données et aux options de recherche avancées. L'enregistrement prend deux minutes.
      </p>
      `,
    },
    pt: {
      title: 'Bem Vindo ao Vessel Viewer',
      description: `
      <p>O Vessel Viewer é uma ferramenta inovadora de histórico de embarcações que fornece às autoridades as informações necessárias para fazer uma avaliação rápida das operações recentes e da conformidade de uma embarcação de pesca.</p>
      <p>Desenvolvido em parceria entre Global Fishing Watch e TMT, a ferramenta fornece informações sobre a identidade de uma embarcação, atividade pesqueira, visitas a porto e transbordo. Isto permite aos usuários identificar e cruzar informações relevantes, ausentes ou falsas sobre uma determinada embarcação e as suas operações de pesca para informar a tomada de decisões e o planeamento operacional.</p>
      <p>Ao ajudar os indivíduos a compreender melhor o comportamento das embarcações e fornecer-lhes uma análise mais ampla das operações das embarcações, o Vessel Viewer suporta uma série de aplicações que podem ajudar a reforçar a governança dos oceanos.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-vessel-orange.png">Histórico de embarcações</h2>
      <p>O Vessel Viewer fornece informações sobre a identidade de uma embarcação, atividade de pesca, visitas portuárias, autorizações e transbordos.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-inspector-orange.png">Perfil de embarcações</h2>
      <p>Perfis detalhados de embarcações mostram informações de identidade juntamente com rastros e resumos de eventos que podem ser interpretados por linha do tempo, localização ou relacionamento entre embarcações.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Buscar por embarcação</h2>
      <p>Qualquer pessoa pode pesquisar embarcações específicas em informações auto-reportadas e em mais de 40 registros públicos de embarcações, criar grupos de embarcações personalizados, compartilhar links para perfis de embarcações e salvá-los off-line como arquivos PDF.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-teamwork-orange.png">Parcerias</h2>
      <p>Entramos em contato com uma série de parceiros de todo o mundo – todos utilizando a ferramenta de visualização de embarcações para suas diversas aplicações – incluindo inspetores portuários, fiscalização de pesca, seguros e cadeias de abastecimento de frutos do mar. Esta colaboração permite-nos compreender como podemos capacitar as partes interessadas para atingir os seus objetivos e melhorar a ferramenta ao longo do tempo.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Feedback</h2>
      <p>Ajude-nos a melhorar o Vessel Viewer enviando feedback para: <a href="mailto:support@globalfishingwatch.org">support@globalfishingwatch.org</a> </p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Registre-se para ter acesso gratuito a todos os recursos</h2>
      <p>Registre-se para obter uma <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager">conta</a> gratuita do Global Fishing Watch para acessar recursos avançados de análise, downloads de dados e opções de pesquisa avançada. O registro leva dois minutos.
      </p>
      `,
    },
    es: {
      title: 'Bienvenido a Vessel Viewer',
      description: `
      <p>Vessel Viewer es una innovadora herramienta de historial de embarcaciones que brinda a las autoridades la información necesaria para realizar una evaluación rápida de las operaciones recientes y el cumplimiento de un buque pesquero.</p>
      <p>Desarrollada por Global Fishing Watch y TMT, la herramienta ofrece información sobre la identidad de un barco, la actividad pesquera, las visitas a puerto y los transbordos. Esto permite a los usuarios identificar y verificar información relevante, ausente o falsa sobre una determinada embarcación y sus operaciones pesqueras para informar la toma de decisiones y la planificación operativa.</p>
      <p>Al ayudar a las personas a comprender mejor el comportamiento de los buques y brindarles un análisis más amplio de las operaciones de los mismos, Vessel Viewer apoya una variedad de aplicaciones que pueden ayudar a reforzar la gobernanza de los océanos.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-vessel-orange.png">Herramienta de historial de embarcaciones</h2>
      <p>Vessel Viewer proporciona información sobre la identidad de un buque, su actividad pesquera, visitas a puertos, autorizaciones y transbordos.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-inspector-orange.png">Perfiles de embarcaciones</h2>
      <p>Los perfiles detallados de las embarcaciones muestran información de identidad junto con trayectorias y resúmenes de eventos que pueden interpretarse por línea de tiempo, ubicación o relaciones entre los buques.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Búsqueda de embarcaciones</h2>
      <p>Cualquiera puede buscar embarcaciones específicas a través de información autoreportada y más de 40 registros públicos de embarcaciones, crear grupos de embarcaciones personalizados, compartir enlaces a perfiles de embarcaciones y guardarlos sin conexión como archivos PDF.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-teamwork-orange.png">Asociaciones</h2>
      <p>Trabajamos con una variedad de socios de todo el mundo, todos utilizando la herramienta de visualización de embarcaciones para sus diversas aplicaciones, incluidos inspectores portuarios, de control de la pesca, seguros y cadenas de suministro de productos del mar. Esta colaboración nos permite comprender cómo podemos empoderar a las partes interesadas para que logren sus objetivos y mejoren la herramienta con el tiempo.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Comentarios</h2>
      <p>Ayúdenos a mejorar Vessel Viewer enviando sus comentarios a: <a href="mailto:support@globalfishingwatch.org">support@globalfishingwatch.org</a> </p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Regístrese para tener acceso gratuito a todas las funciones</h2>
      <p>Regístrese para obtener una <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager">cuenta gratuíta</a> de Global Fishing Watch para acceder a funciones de análisis avanzadas, descargas de datos y opciones de búsqueda avanzada. El registro demora dos minutos</p>
      `,
    },
  },
  'deep-sea-mining': {
    partnerLink: 'https://globalfishingwatch.org/deep-sea-mining/',
    partnerLogo: `${PATH_BASENAME}/images/welcome-popup/deep-sea-mining-partner.jpg`,
    en: {
      title: 'Deep Sea Mining Watch',
      description: `
        <h2>Prepared by Benioff Ocean Science Laboratory, UCSB</h2>
        <p>Recent efforts to find new sources of minerals have led some countries and private companies to turn their attention to the deep seabed. The industry is still in its infancy, but exploration licences have been granted by the International Seabed Authority, an organization created by the United Nations to manage all mineral-related activities in areas beyond national jurisdiction, while ensuring the effective protection of the marine environment from harmful effects that may arise from these activities. The Authority has already granted over 1.5 million square kilometers of license areas for mining exploration in the Pacific, Atlantic and Indian Oceans to at least 22 mining contractors, laying the groundwork for future exploitation.</p>
        <p>The international seabed and its resources are the “common heritage of mankind” and should benefit humankind as a whole. This creates complex governance and regulatory challenges, including for benefit-sharing given the recent market downturns for the seabed minerals being targeted– such as cobalt and nickel– that call into question the economic viability of this potential industry. This is further compounded by significant environmental and socio-economic risks. Concerns raised regarding the impacts of seabed mining include significant damage to unique, slow-to-recover deep-sea ecosystems; risks to the productivity and quality of economically-important fisheries; and threats to sources of marine genetic resources and underwater cultural heritage. </p>
        <p>This report summarizes the activity of vessels known to historically or actively engage in deep-sea mineral activities in regions containing International Seabed Authority (ISA) license areas, including the Eastern and Western Pacific, Atlantic and Indian Oceans. As commercial mining has not yet begun, <a href="https://globalfishingwatch.org${PATH_BASENAME}/report/deep_sea_mining-public" rel="noopener noreferrer" target="_blank">this report</a> and these data in Deep-Sea Mining Watch depict only exploration activity. </p>
        <p>Click here to view a report summarizing activity specific to the <a href="https://globalfishingwatch.org${PATH_BASENAME}/report/clarion_clipperton-public?daysFromLatest=365" rel="noopener noreferrer" target="_blank">Clarion-Clipperton Zone</a>.</p>
        <ul>To learn more about the potential impacts from mining, explore the following resources:
          <li>Amon, D. J., Gollner, S., Morato, T., Smith, C. R., Chen, C., Christiansen, S., ... & Pickens, C. (2022). Assessment of scientific gaps related to the effective environmental management of deep-seabed mining. Marine Policy, 138, 105006. https://doi.org/10.1016/j.marpol.2022.105006</li>
          <li>Levin, L. A., Amon, D. J., & Lily, H. (2020). Challenges to the sustainability of deep-seabed mining. Nature Sustainability, 3(10), 784-7. https://doi.org/10.1038/s41893-020-0558-x</li>
          <li>Drazen, J. C., Smith, C. R., Gjerde, K. M., Haddock, S. H., Carter, G. S., Choy, C. A., ... & Yamamoto, H. (2020). Midwater ecosystems must be considered when evaluating environmental risks of deep-sea mining. Proceedings of the National Academy of Sciences, 117(30), 17455-17460. https://doi.org/10.1073/pnas.2011914117</li>
          <li>Simon-Lledó, E., Bett, B. J., Huvenne, V. A., Köser, K., Schoening, T., Greinert, J., & Jones, D. O. (2019). Biological effects 26 years after simulated deep-sea mining. Scientific reports, 9(1), 8040. https://doi.org/10.1038/s41598-019-44492-w</li>
          <li>Rabone, M., Wiethase, J. H., Simon-Lledó, E., Emery, A. M., Jones, D. O., Dahlgren, T. G., ... & Glover, A. G. (2023). How many metazoan species live in the world’s largest mineral exploration region?. Current biology, 33(12), 2383-2396. https://doi.org/10.1016/j.cub.2023.04.052</li>
          <li>Niner, H. J., Ardron, J. A., Escobar, E. G., Gianni, M., Jaeckel, A., Jones, D. O., ... & Gjerde, K. M. (2018). Deep-sea mining with no net loss of biodiversity—an impossible aim. Frontiers in Marine Science, 5, 53. https://doi.org/10.3389/fmars.2018.00053</li>
        </ul>
        <img src="${PATH_BASENAME}/images/welcome-popup/deep-sea-mining.jpg" alt="Deep Sea Mining Watch" />
        <p>For inquiries, please contact <a href="mailto:bosl-contact@ucsb.edu">bosl-contact@ucsb.edu</a></p>
      `,
    },
  },
}

export default WELCOME_POPUP_CONTENT
