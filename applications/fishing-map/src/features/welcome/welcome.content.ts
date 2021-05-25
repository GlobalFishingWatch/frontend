import { WorkspaceCategories } from 'data/workspaces'
import { Locale } from 'types'

type WelcomeContentLang = {
  [locale in Locale]?: {
    title: string
    description: string
  }
}
type WelcomeContent = {
  partnerLogo: string
  partnerLink: string
} & WelcomeContentLang

const WELCOME_POPUP_CONTENT: { [category in WorkspaceCategories]?: WelcomeContent } = {
  [WorkspaceCategories.MarineManager]: {
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
}

export default WELCOME_POPUP_CONTENT
