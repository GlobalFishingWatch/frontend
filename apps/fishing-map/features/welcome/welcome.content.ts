import { WorkspaceCategory } from 'data/workspaces'
import { Locale } from 'types'

type WelcomeContentLang = {
  [locale in Locale]?: {
    title: string
    description: string
  }
}
type WelcomeContent = {
  partnerLogo?: string
  partnerLink?: string
} & WelcomeContentLang

const WELCOME_POPUP_CONTENT: { [category in WorkspaceCategory]?: WelcomeContent } = {
  [WorkspaceCategory.MarineManager]: {
    partnerLogo: 'https://globalfishingwatch.org/wp-content/uploads/Logo_DonaBertarelliPH@2x.png',
    partnerLink: 'https://donabertarelli.com/',
    en: {
      title: 'Welcome to Global Fishing Watch Marine Manager',
      description: `<p>Global Fishing Watch Marine Manager is a freely available, innovative technology portal that was founded by Dona Bertarelli. It provides near real-time, dynamic and interactive data on ocean conditions, biology and human-use activity to support marine spatial planning, marine protected area design and management, and scientific research.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png">Apparent fishing effort</h2>
      <p>We use data that is broadcast using the automatic identification system (AIS) and collected via satellites and terrestrial receivers. We then combine this information with vessel monitoring system data provided by our partner countries. We apply our fishing detection algorithm to determine “apparent fishing effort” based on changes in vessel speed and direction.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-vessel-orange.png">Vessel activity</h2>
      <p>We have integrated vessel presence data into the portal, which indicates the locations of all vessels transmitting on AIS. Vessel presence data can currently be filtered by fishing and carrier vessels, as well as ships categorized as “other vessels”, which include those associated with shipping, tourism and oil and gas exploration.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-coral-orange.png">Environmental data</h2>
      <p>Global Fishing Watch is providing publicly available oceanographic and biological datasets, like sea surface temperature and primary productivity and salinity, to allow anyone to examine environmental patterns as they relate to human activity.</p>
      <p>In private workspaces, managers and researchers can upload their own datasets—like animal telemetry tracks—to inform management and protection of vulnerable species.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png">Reference layers</h2>
      <p>Reference layers support understanding of vessel activity around marine protected areas and other areas. They can be added to support detailed analysis or spatial management.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-teamwork-orange.png">Partnerships</h2>
      <p>We have engaged with a range of partner sites from across the globe—all utilizing the portal for its various applications. This collaboration allows us to understand how we can empower stakeholders to achieve their goals and improve the portal over time.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Feedback</h2>
      <p>Help us to improve Global Fishing Watch Marine Manager by sending feedback to: <a href="mailto:marinemanager@globalfishingwatch.org">marinemanager@globalfishingwatch.org</a> </p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Register for free access to all features</h2>
      <p>Register for a free Global Fishing Watch <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager">account</a> to access advanced analysis features, data downloads and advanced search options. Registration takes two minutes.</p>
      `,
    },
    es: {
      title: 'Bienvenido a Global Fishing Watch Marine Manager',
      description: `<p> Global Fishing Watch Marine Manager es un portal de tecnología innovadora de acceso gratuito que fue fundado por Dona Bertarelli. Proporciona datos casi en tiempo real, dinámicos e interactivos sobre las condiciones del océano, la biología y la actividad de uso humano para respaldar la planificación espacial marina, el diseño y la gestión de áreas marinas protegidas y la investigación científica. </p>
      <h2> <img src = "https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png"> Esfuerzo de pesca aparente </h2>
      <p> Usamos datos que se transmiten mediante el sistema de identificación automática (AIS) y se recopilan a través de satélites y receptores terrestres. Luego, combinamos esta información con los datos del sistema de seguimiento de embarcaciones proporcionados por nuestros países socios. Aplicamos nuestro algoritmo de detección de pesca para determinar el "esfuerzo de pesca aparente" en función de los cambios en la velocidad y dirección del barco. </p>
      <h2> <img src = "https://globalfishingwatch.org/wp-content/uploads/icon-vessel-orange.png"> Actividad de la embarcación </h2>
      <p> Hemos integrado datos de presencia de embarcaciones en el portal, que indica las ubicaciones de todas las embarcaciones que transmiten por AIS. Los datos de presencia de embarcaciones actualmente pueden ser filtrados por embarcaciones pesqueras y de transporte, así como por embarcaciones categorizadas como "otras embarcaciones", que incluyen aquellas asociadas con el transporte marítimo, el turismo y la exploración de petróleo y gas. </p>
      <h2> <img src = "https://globalfishingwatch.org/wp-content/uploads/icon-coral-orange.png"> Datos ambientales </h2>
      <p> Global Fishing Watch proporciona conjuntos de datos oceanográficos y biológicos disponibles públicamente, como la temperatura de la superficie del mar y la productividad y salinidad primarias, para permitir que cualquiera pueda examinar los patrones ambientales en relación con la actividad humana. </p>
      <p> En espacios de trabajo privados, los administradores e investigadores pueden cargar sus propios conjuntos de datos (como pistas de telemetría animal) para informar la gestión y protección de especies vulnerables. </p>
      <h2> <img src = "https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png"> Capas de referencia </h2>
      <p> Las capas de referencia apoyan la comprensión de la actividad de los barcos alrededor de áreas marinas protegidas y otras áreas. Se pueden agregar para respaldar el análisis detallado o la gestión espacial. </p>
      <h2> <img src = "https://globalfishingwatch.org/wp-content/uploads/icon-teamwork-orange.png"> Asociaciones </h2>
      <p> Nos hemos comprometido con una variedad de sitios asociados de todo el mundo, todos utilizando el portal para sus diversas aplicaciones. Esta colaboración nos permite comprender cómo podemos empoderar a las partes interesadas para que logren sus objetivos y mejoren el portal con el tiempo. </p>
      <h2> <img src = "https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png"> Comentarios </h2>
      <p> Ayúdenos a mejorar Global Fishing Watch Marine Manager enviando sus comentarios a: <a href="mailto:marinemanager@globalfishingwatch.org"> marinemanager@globalfishingwatch.org </a> </p>
      <h2> <img src = "https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png"> Regístrese para obtener acceso gratuito a todas las funciones </h2>
      <p> Regístrese para obtener una cuenta gratuita de Global Fishing Watch <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager"> </ a > para acceder a funciones de análisis avanzado, descargas de datos y opciones de búsqueda avanzada. El registro demora dos minutos. </p>
      `,
    },
  },
  [WorkspaceCategory.FishingActivity]: {
    en: {
      title: 'Welcome to the Global Fishing Watch Map',
      description: `
        <p>The Global Fishing Watch map is the first open-access online tool for visualization and analysis of vessel-based human activity at sea. Anyone with an internet connection can access the map to monitor global fishing activity from 2012 to the present for more than 65,000 commercial fishing vessels that are responsible for a significant part of global seafood catch.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png">Apparent fishing effort</h2>
        <p>We use data that is broadcast using the automatic identification system (AIS) and collected via satellites and terrestrial receivers. We then combine this information with vessel monitoring system data provided by our partner countries. We apply our fishing detection algorithm to determine “apparent fishing effort” based on changes in vessel speed and direction. The heat map grid cell colors show how much fishing happened in that area, allowing for precise comparison.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_VESSEL-TRACKS_Orange.png">Vessel tracks and events</h2>
        <p>View precise, high-resolution vessel tracks in the map and “events'' that occurred along each track. Events highlight where fishing took place, port visits, vessel encounters and loitering events—when a single vessel exhibits behavior indicative of an encounter with another vessel but no other transmissions were received. Events are grouped together when the map is zoomed out. Zoom in on a specific area for more detailed information.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Search for a vessel</h2>
        <p>Search for a vessel anywhere on the map by vessel name, maritime mobile service identity number, International Maritime Organization number, call sign or vessel monitoring system identifier. Advanced search allows you to filter and refine your search more effectively by source, flags and dates active. Click on any vessel in the search results to add that vessel track to the map.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png">Upload reference layers</h2>
        <p>Reference layers facilitate a better understanding of vessel activity around exclusive economic zones, regional fisheries management organizations and other areas. Add your own reference layers to support detailed analysis or spatial management.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Feedback</h2>
        <p>Help us improve the Global Fishing Watch map by sending feedback to <a href="mailto:support@globalfishingwatch.org">support@globalfishingwatch.org</a> or through the built-in feedback form in the left sidebar on the map.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Register for free access to all features</h2>
        <p>Register for a free Global Fishing Watch <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/map">account</a> to access advanced analysis features, data downloads and advanced search options. Registration takes two minutes.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBE_Orange-1.png">Previous Global Fishing Watch map</h2>
        <p><a href="https://globalfishingwatch.org/legacy-map/?utm_source=map3_welcome_page&utm_medium=map_2_link&utm_campaign=sunsetting_map2">Access the previous Global Fishing Watch map</a> to migrate workspaces until 18 October 2021.</p>
      `,
    },
    es: {
      title: 'Bienvenido al mapa Global Fishing Watch',
      description: `
        <p>El mapa Global Fishing Watch es la primera herramienta en línea de acceso abierto para la visualización y el análisis de la actividad humana en el mar basada en embarcaciones. Cualquiera con una conexión a Internet puede acceder al mapa para monitorear la actividad pesquera mundial, desde 2012 hasta el presente, de más de 65.000 embarcaciones pesqueras comerciales que son responsables de una parte significativa de la captura mundial de pescado y mariscos.
        </p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png">Esfuerzo de pesca aparente</h2>
        <p>Usamos datos que se transmiten mediante el sistema de identificación automática (AIS) y se recopilan a través de satélites y receptores terrestres. Luego, combinamos esta información con los datos del sistema de seguimiento de embarcaciones proporcionados por nuestros países socios. Aplicamos nuestro algoritmo de detección de pesca para determinar el "esfuerzo de pesca aparente" en función de los cambios en la velocidad y dirección del buque. Los colores de las celdas de la cuadrícula del mapa de calor muestran cuánta pesca ocurrió en esa área, lo que permite una comparación precisa.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_VESSEL-TRACKS_Orange.png">Rutas de embarcaciones y eventos</h2>
        <p>Vea la ruta precisa de embarcaciones en alta resolución en el mapa y los "eventos" que ocurrieron a lo largo de cada ruta. Los eventos destacan dónde tuvo lugar la pesca, las visitas a puertos, los encuentros con embarcaciones y eventos de merodeo -cuando una sola embarcación muestra un comportamiento indicativo de un encuentro con otra embarcación, pero no se recibieron otras transmisiones. Los eventos se agrupan cuando se aleja la vista del mapa. Amplíe un área específica para obtener información más detallada.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Búsqueda de una embarcación</h2>
        <p>Busque una embarcación en cualquier lugar del mapa por nombre, número de identidad del servicio móvil marítimo, número de la Organización Marítima Internacional, distintivo de llamada o identificador del sistema de seguimiento de embarcaciones. La búsqueda avanzada le permite filtrar y refinar su búsqueda de manera más efectiva por fuente, banderas y fechas activas. Haga clic en cualquier embarcación en los resultados de la búsqueda para agregar la ruta de esa embarcación al mapa.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png">Cargar capas de referencia</h2>
        <p>Las capas de referencia facilitan una mejor comprensión de la actividad de los barcos alrededor de las zonas económicas exclusivas, las organizaciones regionales de ordenación pesquera y otras áreas. Agregue sus propias capas de referencia para respaldar el análisis detallado o la gestión espacial.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Comentarios</h2>
        <p>Ayúdenos a mejorar el mapa Global Fishing Watch enviando comentarios a <a href="mailto:support@globalfishingwatch.org">support@globalfishingwatch.org</a> o mediante el formulario integrado en la barra lateral izquierda del mapa.
        </p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Regístrese para tener acceso gratuito a todas las funciones</h2>
        <p><a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/map">Regístrese para obtener una cuenta gratuita de Global Fishing Watch</ a > para acceder a funciones de análisis avanzado, descargas de datos y opciones de búsqueda avanzada. El registro demora dos minutos. </p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBE_Orange-1.png">Mapa anterior de Global Fishing Watch</h2>
        <p><a href="https://globalfishingwatch.org/legacy-map/?utm_source=map3_welcome_page&utm_medium=map_2_link&utm_campaign=sunsetting_map2">Acceda aquí a la versión anterior del mapa de Global Fishing Watch</a> para migrar los espacios de trabajo hasta el 18 de octubre de 2021.</p>
      `,
    },
    fr: {
      title: 'Bienvenue sur la carte de Global Fishing Watch',
      description: `
        <p>La carte de Global Fishing Watch est le premier outil en ligne d’accès ouvert permettant la visualisation et l’analyse de l’activité humaine en bateau en mer. Tout utilisateur disposant d’une connexion internet peut accéder à la carte pour surveiller l’activité de pêche globale de 2012 à aujourd’hui, pour plus de 65 000 navires de pêche commerciale, responsable d’une part significative de la prise globale de produits de la mer.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png">Effort de pêche apparent</h2>
        <p>Nous utilisons des données émises via le système AIS et collectées par des satellites et récepteurs terrestres. Nous combinons ensuite cette information avec des données des systèmes de surveillance fournis par nos pays partenaires. Nous appliquons notre algorithme de détection de pêche pour déterminer “l’effort de pêche apparent” basé sur les changements de vitesse et de direction des navires. Les couleurs de la carte de chaleur permettent des comparaisons précises en montrant l’effort de pêche d’une zone donnée. </p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_VESSEL-TRACKS_Orange.png">Trajectoires et événements des navires</h2>
        <p>Visualisez les trajectoires précises en haute résolution des navires et les “événements” ayant eu lieu durant ces trajectoires. Les événements montrent lorsqu’un navire à pêché, visité un port, rencontré un autre navire en mer. Les “évènements de dérive” montrent quand un seul navire montre un comportement caractéristique d’une rencontre avec un autre navire, mais qu’aucune autre transmission n’a été reçue. Les évènements sont regroupés lorsque la carte est dézoomée. Zoomez sur une zone spécifique pour accéder à plus de détails.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Recherche de navire</h2>
        <p>Recherchez un navire n’importe où sur la carte, par nom de navire, numéro MMSI, numéro OMI, indicatif ou identifiant VMS. La recherche avancée vous permet de filtrer et affiner votre recherche plus efficacement par source, pavillon, et dates d’activité. Cliquez sur un navire dans les résultats de recherche pour ajouter sa trajectoire sur la carte. </p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png">Ajouter des calques de référence</h2>
        <p>Les calques de référence aident à comprendre l’activité des navires autour des ZEE, RFMO et autres zones. Ajoutez vos propres calques de référence pour aider à les analyses détaillées.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Retour d’expérience</h2>
        <p>Aidez-nous à améliorer la carte de Global Fishing Watch en envoyant votre retour d’expérience à <a href="mailto:support@globalfishingwatch.org">support@globalfishingwatch.org</a> ou via le formulaire de retour d’expérience disponible en bas à gauche de l’écran.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Enregistrez-vous pour l’accès à toutes les fonctionnalités</h2>
        <p>Vous pouvez vous <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/map">créer un compte Global Fishing Watch</a> gratuitement pour accéder aux fonctionnalités avancées d’analyse, téléchargement de données et enregistrement d’espaces de travail. </p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBE_Orange-1.png">Previous Global Fishing Watch map</h2>
        <p><a href="https://globalfishingwatch.org/legacy-map/?utm_source=map3_welcome_page&utm_medium=map_2_link&utm_campaign=sunsetting_map2">Accédez à l’ancienne version de la carte Global Fishing Watch</a> pour migrer vos espaces de travail avant le 18 octobre 2021. </p>
      `,
    },
    id: {
      title: 'Selamat datang di peta Global Fishing Watch',
      description: `
        <p>Peta Global Fishing Watch adalah alat daring dengan akses terbuka yang pertama untuk visualisasi dan analisis kapal berdasarkan aktivitas manusia di laut. Siapa saja dengan koneksi internet dapat mengakses peta untuk memantau aktivitas penangkapan ikan global dari tahun 2012 hingga sekarang untuk lebih dari 65.000 kapal penangkap ikan komersial yang bertanggung jawab atas sebagian besar tangkapan makanan laut secara global.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png">Upaya penangkapan ikan yang terlihat</h2>
        <p>Kami menggunakan data yang disiarkan menggunakan automatic identification system (AIS) dan dikumpulkan melalui satelit dan penerima terestrial. Kemudian kami menggabungkan informasi ini dengan data sistem pemantauan kapal yang disediakan oleh negara mitra kami. Kami menerapkan algoritma deteksi penangkapan ikan untuk menentukan “upaya penangkapan yang terlihat” berdasarkan perubahan kecepatan dan arah kapal. Warna sel grid pada peta panas menunjukkan berapa banyak penangkapan ikan yang terjadi di area itu, memungkinkan untuk perbandingan yang tepat.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_VESSEL-TRACKS_Orange.png">Lintasan kapal dan peristiwa</h2>
        <p>Melihat lintasan kapal beresolusi tinggi yang tepat di peta dan "peristiwa" yang terjadi di sepanjang setiap lintasan. Peristiwa menyoroti tempat penangkapan ikan, kunjungan pelabuhan, pertemuan kapal, dan peristiwa berkeliaran—ketika satu kapal menunjukkan perilaku yang menunjukkan pertemuan dengan kapal lain tetapi tidak ada transmisi lain yang diterima. Peristiwa dikelompokkan bersama saat peta diperkecil. Perbesar area tertentu untuk informasi lebih detail.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Pencarian kapal</h2>
        <p>Pencarian kapal di mana saja di peta dengan nama kapal, nomor maritime mobile service identity (MMSI), nomor Organisasi Maritim Internasional, tanda panggil atau pengenal sistem pemantauan kapal. Pencarian lanjutan memungkinkan Anda untuk menyaring dan memperhalus pencarian Anda secara lebih efektif berdasarkan sumber, bendera, dan tanggal aktif. Klik kapal mana saja di hasil pencarian untuk menambahkan jalur kapal itu ke peta.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png">Unggah layer referensi</h2>
        <p>Layer referensi memfasilitasi pemahaman yang lebih baik tentang aktivitas kapal di sekitar zona ekonomi eksklusif, organisasi pengelolaan perikanan regional, dan area lainnya. Tambahkan lapisan referensi Anda sendiri untuk mendukung analisis terperinci atau manajemen spasial.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Umpan balik</h2>
        <p>Bantu kami meningkatkan perbaikan peta Global Fishing Watch dengan mengirimkan umpan balik ke <a href="mailto:support@globalfishingwatch.org">support@globalfishingwatch.org</a> atau melalui formulir umpan balik di sebelah sisi kiri pada peta.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Daftar untuk akses gratis ke semua fitur</h2>
        <p>Daftarkan <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/map">akun</a> Global Fishing Watch gratis untuk mengakses fitur analisis lanjutan, unduhan data, dan menyimpan ruang kerja Anda. Pendaftaran memakan waktu dua menit.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBE_Orange-1.png">Peta Global Fishing Watch sebelumnya</h2>
        <p><a href="https://globalfishingwatch.org/legacy-map/?utm_source=map3_welcome_page&utm_medium=map_2_link&utm_campaign=sunsetting_map2">Akses peta Global Fishing Watch sebelumnya di sini untuk memigrasikan ruang kerja hingga 18 Oktober 2021.</a></p>
      `,
    },
    pt: {
      title: 'Bem vindo ao mapa do Global fishing Watch',
      description: `
        <p>O mapa do Global Fishing Watch é a primeira ferramenta de acesso livre para visualização e análise da atividade humana no mar. qualquer pessoa com conexão à internet pode acessar o mapa para monitorar a atividade pesqueira desde 2012 a até a data atual, de mais de 65.000 embarcações comerciais de pesca que são responsáveis por uma parcela significativa da captura mundial de pescados.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png">Esforço de pesca aparente</h2>
        <p>Nós usamos dados que são transmitidos usando o Sistema de Identificação Automática (AIS) coletados via satélite e receptores terrestres. Nós então combinamos estas informações com dados dos sistemas de rastreamento de embarcações fornecidos pelos nossos países parceiros. Nós aplicamos nossos algoritmos de detecção para determinar o “esforço de pesca aparente”, baseado em mudanças na velocidade e direção da embarcação. O mapa de calor com células coloridas mostra quanta atividade de pesca ocorreu naquela área, permitindo comparações precisas.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_VESSEL-TRACKS_Orange.png">Rotas de embarcações e eventos</h2>
        <p>Visualize rastros precisos e de alta resolução da embarcação no mapa e “eventos” que ocorreram ao longo de cada rota. Os eventos destacam onde a pesca ocorreu, visitas a portos, encontros de embarcações e eventos de deriva. Os eventos são agrupados quando o zoom do mapa é reduzido. Amplie uma área específica para obter informações mais detalhadas.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Pesquise por uma embarcação</h2>
        <p>Pesquise por uma embarcação em qualquer lugar do mapa pelo nome da embarcação, número de identificação de serviço móvel marítimo (MMSI), número da Organização Marítima Internacional (IMO), código de chamada (Callsign), ou identificador do sistema de rastreamento de embarcações. A pesquisa avançada permite filtrar e refinar sua busca por fonte de informação, bandeira e datas. Clique em qualquer embarcação nos resultados da busca para adicionar a sua rota no mapa.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png">Carregar camadas de referência</h2>
        <p>Camadas de referência facilitam uma melhor compreensão da atividade nas zonas econômicas exclusivas, Organizações Regionais de Pesca e outras áreas. Adicione suas próprias camadas de referência para realizar análises detalhadas ou gestão espacial.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Retorno</h2>
        <p>Ajude-nos a melhorar o mapa do Global Fishing Watch enviando seus comentários e sugestões para support@globalfishingwatch.org ou através do formulário de comentários no painel lateral esquerdo do mapa.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Registre-se para ter acesso a todas as funcionalidades</h2>
        <p>Registre-se para obter uma <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/map">conta</a> gratuita do Global Fishing Watch para acessar recursos de análise avançada, downloads de dados e opções de pesquisa avançada. O registro leva dois minutos.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBE_Orange-1.png">Mapa anterior do Global Fishing Watch</h2>
        <p><a href="https://globalfishingwatch.org/legacy-map/?utm_source=map3_welcome_page&utm_medium=map_2_link&utm_campaign=sunsetting_map2">Acesse o mapa anterior</a> do Global Fishing Watch para migrar os espaços de trabalho até 18 de outubro de 2021.</p>
      `,
    },
  },
}

export default WELCOME_POPUP_CONTENT
