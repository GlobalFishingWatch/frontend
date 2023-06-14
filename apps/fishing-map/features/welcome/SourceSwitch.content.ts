import { Locale } from 'types'

export type WelcomenContentLangContent = {
  title: string
  description: string
  disclaimer: string
}

type WelcomeContentLang = {
  [locale in Locale]?: WelcomenContentLangContent
}

const SOURCE_SWITCH_CONTENT: WelcomeContentLang = {
  en: {
    title: 'Updates to data sources in the Global Fishing Watch platform',
    description: `
        <p>Global Fishing Watch has established a new partnership with <a target="_blank" href="https://spire.com/">Spire Global</a>, providing even more precise and consistent AIS activity data through the use of ExactView satellites.</p>
        <p>As of January 1, 2023, Global Fishing Watch data is generated using both Spire and Spire Global satellites and will no longer use OrbComm data. Users should be aware it is possible their estimates of activity may have changed.</p>
        <p>Global Fishing Watch is completing analysis to determine the impact and location of changes, as well as improvements for data continuity.</p>
        <p>Please see details on possible changes in <a target="_blank" href="https://globalfishingwatch.org/faqs/data-source-updates/">our FAQ</a> or email <a href="mailto:support@globalfishingwatch.org">support@globalfishingwatch.org</a> for further information.</p>
      `,
    disclaimer:
      'Updates to data sources in the Global Fishing Watch platform. From 1 January, 2023, Spire Global satellites included which may change apparent fishing effort estimates. <a target="_blank" href="https://globalfishingwatch.org/faqs/data-source-updates/">Learn more.</a>',
  },
  es: {
    title: 'Actualizaciones de fuentes de datos en la plataforma Global Fishing Watch',
    description: `
        <p>Global Fishing Watch ha establecido una nueva asociación con <a target="_blank" href="https://spire.com/">Spire Global</a>, proporcionando datos de actividad AIS aún más precisos y consistentes mediante el uso de satélites ExactView.</p>
        <p>A partir del 1 de enero de 2023, los datos de Global Fishing Watch se generan utilizando los satélites Spire y Spire Global y ya no utilizarán los datos de OrbComm. Los usuarios deben saber que es posible que sus estimaciones de actividad hayan cambiado.</p>
        <p>Global Fishing Watch está completando el análisis para determinar el posible impacto y ubicación de los cambios, así como las mejoras para la continuidad de los datos.</p>
        <p>Consulte los detalles sobre posibles cambios en <a target="_blank" href="https://globalfishingwatch.org/faqs/data-source-updates/">nuestro FAQ</a> o envíe un correo electrónico a <a href="mailto:support@globalfishingwatch.org">support@globalfishingwatch.org</a> para obtener más información.</p>
      `,
    disclaimer:
      'Actualizaciones de fuentes de datos en la plataforma Global Fishing Watch. A partir del 1 de enero de 2023, se incluyeron los satélites de Spire Global, que pueden cambiar las estimaciones del esfuerzo de pesca aparente. <a target="_blank" href="https://globalfishingwatch.org/faqs/data-source-updates/">Más información.</a>',
  },
  pt: {
    title: 'Atualização na fonte de dados na plataforma Global Fishing Watch',
    description: `
        <p>Global Fishing Watch estabeleceu uma nova parceria com <a target="_blank" href="https://spire.com/">Spire Global</a>, fornecendo dados de AIS ainda mais precisos e consistentes através do uso de satélites ExactView.</p>
        <p>A partir de 1º de Janeiro de 2023, os dados do Global Fishing Watch são gerados utilizando satélites Spire e Spire Global e não serão mais utilizados dados OrbComm. Os usuários devem estar cientes de que é possível que suas estimativas de atividade tenham mudado.</p>
        <p>Global Fishing Watch está realizando análises para determinar o impacto destas mudanças, bem como melhorias para a continuidade dos dados.</p>
        <p>Por favor volte <a target="_blank" href="https://globalfishingwatch.org/faqs/data-source-updates/">aquí</a> para detalhes sobre possíveis mudanças ou envie um e-mail para <a href="mailto:support@globalfishingwatch.org">support@globalfishingwatch.org</a> para mais informações.</p>
      `,
    disclaimer:
      'Atualização na fonte de dados na plataforma Global Fishing Watch. A partir de 1º de Janeiro de 2023, os satélites Spire Global foram incluídos. É possível que suas estimativas de atividade tenham mudado. <a target="_blank" href="https://globalfishingwatch.org/faqs/data-source-updates/">Mais informação.</a>',
  },
  fr: {
    title: 'Mises à jour des sources de données dans la plateforme Global Fishing Watch',
    description: `
        <p>Global Fishing Watch a établi un nouveau partenariat avec <a target="_blank" href="https://spire.com/">Spire Global</a>, fournissant des données d'activité AIS encore plus précises et cohérentes grâce à l'utilisation des satellites ExactView.</p>
        <p>À compter du 1er janvier 2023, les données de Global Fishing Watch sont générées à l'aide des satellites Spire et Spire Global et n'utiliseront plus les données OrbComm. Les utilisateurs doivent savoir qu'il est possible que leurs estimations d'activité aient changé.</p>
        <p>Global Fishing Watch est en train de réaliser une analyse pour déterminer l'impact et la localisation des changements, ainsi que des améliorations pour la continuité des données.</p>
        <p>Veuillez consulter les détails sur les changements possibles dans <a target="_blank" href="https://globalfishingwatch.org/faqs/data-source-updates/">notre FAQ</a> ou envoyez un courriel à <a href="mailto:support@globalfishingwatch.org">support@globalfishingwatch.org</a> pour plus d'informations.</p>
      `,
    disclaimer: `Mises à jour des sources de données dans la plateforme Global Fishing Watch. À partir du 1er janvier 2023, les satellites Spire Global sont inclus, ce qui peut modifier les estimations de l'effort de pêche apparent. <a target="_blank" href="https://globalfishingwatch.org/faqs/data-source-updates/">En savoir plus.</a>`,
  },
  id: {
    title: 'Pembaruan pada sumber data di platform Global Fishing Watch',
    description: `
        <p>Global Fishing Watch telah menjalin kemitraan baru dengan <a target="_blank" href="https://spire.com/">Spire Global</a>, menyediakan data aktivitas AIS yang lebih presisi dan konsisten melalui penggunaan satelit ExactView.</p>
        <p>Mulai 1 Januari 2023, data Global Fishing Watch dihasilkan dengan menggunakan satelit Spire dan Spire Global dan tidak akan lagi menggunakan data Orbcomm. Pengguna harus menyadari bahwa ada kemungkinan perkiraan aktivitas yang mereka lakukan mungkin telah berubah.</p>
        <p>Global Fishing Watch sedang menyelesaikan analisis untuk menentukan dampak dan lokasi perubahan, serta perbaikan untuk kesinambungan data.</p>
        <p>Silakan lihat detail tentang kemungkinan perubahan di <a target="_blank" href="https://globalfishingwatch.org/faqs/data-source-updates/">FAQ</a> kami atau email <a href="mailto:support@globalfishingwatch.org">support@globalfishingwatch.org</a> untuk informasi lebih lanjut.</p>
      `,
    disclaimer: `Pembaruan pada sumber data di platform Global Fishing Watch. Mulai 1 Januari 2023, Satelit Spire Global telah dimasukkan sehingga dapat mengubah estimasi upaya penangkapan ikan yang terlihat. <a target="_blank" href="https://globalfishingwatch.org/faqs/data-source-updates/">Pelajari lebih lanjut.</a>`,
  },
}

export const getSourceSwitchContentByLng = (lng: Locale | string) => {
  return SOURCE_SWITCH_CONTENT[lng || Locale.en]
}

export default SOURCE_SWITCH_CONTENT
