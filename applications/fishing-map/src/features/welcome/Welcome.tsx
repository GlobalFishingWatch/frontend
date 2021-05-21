import React from 'react'
import { Logo } from '@globalfishingwatch/ui-components'
import styles from './Welcome.module.css'

const WELCOME_POPUP_CONTENT = {
  'marine-manager': {
    partnerLogo:
      'https://globalfishingwatch.org/website3/wp-content/uploads/Logo_DonaBertarelliPH@2x.png',
    partnerLink: 'https://donabertarelli.com/',
    title: 'Welcome to Global Fishing Watch Marine Manager',
    content: `<p>Global Fishing Watch Marine Manager is a freely available, innovative technology portal that was founded by Dona Bertarelli. It provides near real-time, dynamic and interactive data on ocean conditions, biology and human-use activity to support marine spatial planning, marine protected area design and management, and scientific research.</p>
    <h2><img src="https://globalfishingwatch.org/website3/wp-content/uploads/icon-line-caught-fish-orange.png">Apparent fishing effort</h2>
    <p>We use data that is broadcast using the automatic identification system (AIS) and collected via satellites and terrestrial receivers. We then combine this information with vessel monitoring system data provided by our partner countries. We apply our fishing detection algorithm to determine “apparent fishing effort” based on changes in vessel speed and direction.</p>
    <h2><img src="https://globalfishingwatch.org/website3/wp-content/uploads/icon-vessel-orange.png">Vessel activity</h2>
    <p>We have integrated vessel presence data into the portal, which indicates the locations of all vessels transmitting on AIS. Vessel presence data can currently be filtered by fishing and carrier vessels, as well as ships categorized as “other vessels”, which include those associated with shipping, tourism and oil and gas exploration.</p>
    <h2><img src="https://globalfishingwatch.org/website3/wp-content/uploads/icon-coral-orange.png">Environmental data</h2>
    <p>Global Fishing Watch is providing publicly available oceanographic and biological datasets, like sea surface temperature and primary productivity and salinity, to allow anyone to examine environmental patterns as they relate to human activity.</p>
    <p>In private workspaces, managers and researchers can upload their own datasets—animal telemetry tracks—to inform management and protection of vulnerable species.</p>
    <h2><img src="https://globalfishingwatch.org/website3/wp-content/uploads/icon-location-map-orange.png">Reference layers</h2>
    <p>Reference layers support understanding of vessel activity around marine protected areas and other areas. They can be added to support detailed analysis or spatial management.</p>
    <h2><img src="https://globalfishingwatch.org/website3/wp-content/uploads/icon-teamwork-orange.png">Partnerships</h2>
    <p>We have engaged with a range of partner sites from across the globe—all utilizing the portal for its various applications. This collaboration allows us to understand how we can empower stakeholders to achieve their goals and improve the portal over time.</p>
    <h2><img src="https://globalfishingwatch.org/website3/wp-content/uploads/icon-email-orange.png">Feedback</h2>
    <p>Help us to improve Global Fishing Watch Marine Manager by sending feedback to: <a href="mailto:marinemanager@globalfishingwatch.org">marinemanager@globalfishingwatch.org</a> </p>
    <h2><img src="https://globalfishingwatch.org/website3/wp-content/uploads/icon-graph-orange-1.png">Register for free access to all features</h2>
    <p>Register for a free Global Fishing Watch <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager">account</a> to access advanced analysis features, data downloads and advanced search options. Registration takes two minutes.</p>
    `,
  },
}

const Welcome: React.FC = () => {
  const { partnerLogo, partnerLink, title, content } = WELCOME_POPUP_CONTENT['marine-manager']
  return (
    <div className={styles.container}>
      <div className={styles.logos}>
        <Logo />
        {partnerLogo && partnerLink && (
          <a href={partnerLink} target="_blank" rel="noopener noreferrer">
            <img className={styles.partnerLogo} src={partnerLogo} />
          </a>
        )}
      </div>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.contentContainer} dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  )
}

export default Welcome
