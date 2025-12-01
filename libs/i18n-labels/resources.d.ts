interface Resources {
  datasets: {
    'full-chile-fishing-vessels': {
      description: 'Dataset for VMS Chile (Public)'
      name: 'Chile VMS (Fishing Vessels)'
      schema: {
        fleet: {
          enum: {
            industry: 'industry'
            small_fisheries: 'small_fisheries'
          }
          keyword: 'fleet'
        }
        source: 'source'
      }
    }
    'full-indonesia-fishing-vessels': {
      description: 'Dataset for VMS Indonesia (Public)'
      name: 'Indonesia VMS (Fishing Vessels)'
      schema: {
        source: 'source'
      }
    }
    'full-panama-fishing-vessels': {
      description: 'Dataset for VMS Panama (Public)'
      name: 'Panama VMS (Full Fishing Vessels)'
      schema: {
        length: 'length'
        source: 'source'
      }
    }
    'full-peru-fishing-vessels': {
      description: 'Dataset for VMS Peru (Public)'
      name: 'Peru VMS (Fishing Vessels)'
      schema: {
        fleet: {
          enum: {
            artisanal: 'artisanal'
            industrial: 'industrial'
            'not defined': 'not defined'
          }
          keyword: 'fleet'
        }
        length: 'length'
        origin: {
          enum: {
            Foreign: 'Foreign'
            Peru: 'Peru'
          }
          keyword: 'origin'
        }
        source: 'source'
      }
    }
    'private-belize-fishing-effort': {
      description: "Vessel monitoring system (VMS) data is provided by the Belize High Seas Fisheries Unit (BHSFU). Data is collected using Belize's vessel monitoring system via satellites and is published on a three-day delay containing information on vessels’ location, speed, course, and movement. Global Fishing Watch analyzes this data using the same algorithms developed for automatic identification system (AIS) to identify fishing activity and behaviors. The algorithm classifies each broadcast data point from vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch’s fishing activity heat map. VMS broadcasts data differently from AIS and may give different measures of completeness, accuracy, and quality. Global Fishing Watch is continually improving its algorithms across all broadcast data formats to algorithmically identify “apparent fishing activity.” It is possible that some fishing activity is not identified or that the heat map may show apparent fishing activity when fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity,” “fishing” or “fishing effort,” as apparent rather than certain. Any and all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at the user’s discretion. Global Fishing Watch’s fishing presence algorithms are developed and tested using actual fishing event data collected by observers and is combined with expert analysis of AIS vessel movement data, resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and to improve automated classification techniques."
      name: 'Apparent Fishing Effort Belize VMS'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'private-belize-fishing-vessels': {
      description: 'Fishing Vessels (VMS Belize)'
      name: 'VMS Belize (Fishing Vessels)'
      schema: {
        source: 'source'
      }
    }
    'private-belize-non-fishing-vessels': {
      description: 'Non Fishing Vessels (VMS Belize)'
      name: 'VMS Belize (Non Fishing Vessels)'
      schema: {
        source: 'source'
      }
    }
    'private-belize-presence': {
      description: 'Presence (Belize private)'
      name: 'Vessel Presence Belize VMS'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'private-belize-vessel-identity': {
      description: 'Vessel Identity'
      name: 'VMS Belize'
    }
    'private-belize-vessel-identity-fishing': {
      description: 'Vessel Identity'
      name: 'VMS Belize'
    }
    'private-belize-vessel-identity-non-fishing': {
      description: 'Vessel Identity'
      name: 'VMS Belize'
    }
    'private-bra-onyxsat-fishing-effort': {
      description: 'Global Fishing Watch uses data about a vessel’s identity, type, location, speed, direction and more that is broadcast using the Automatic Identification System (AIS) and collected via satellites and terrestrial receivers. AIS was developed for safety/collision-avoidance. Global Fishing Watch analyzes AIS data collected from vessels that our research has identified as known or possible commercial fishing vessels, and applies a fishing detection algorithm to determine “apparent fishing activity” based on changes in vessel speed and direction. The algorithm classifies each AIS broadcast data point for these vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch fishing activity heat map. AIS data as broadcast may vary in completeness, accuracy and quality. Also, data collection by satellite or terrestrial receivers may introduce errors through missing or inaccurate data. Global Fishing Watch’s fishing detection algorithm is a best effort mathematically to identify “apparent fishing activity.” As a result, it is possible that some fishing activity is not identified as such by Global Fishing Watch; conversely, Global Fishing Watch may show apparent fishing activity where fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies designations of vessel fishing activity, including synonyms of the term “fishing activity,” such as “fishing” or “fishing effort,” as “apparent,” rather than certain. Any/all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at your own risk. Global Fishing Watch is taking steps to make sure fishing activity designations are as accurate as possible. Global Fishing Watch fishing detection algorithms are developed and tested using actual fishing event data collected by observers, combined with expert analysis of vessel movement data resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and automated classification techniques.'
      name: 'VMS Brazil'
      schema: {
        license_category: {
          enum: {
            Armadilhas: 'Armadilhas'
            Arrasto: 'Arrasto'
            Cerco: 'Cerco'
            Linha: 'Linha'
            'Rede de emalhe': 'Rede de emalhe'
          }
          keyword: 'license_category'
        }
        target_species: {
          enum: {
            ' Camarão-rosa': ' Camarão-rosa'
            'Abrótea; Galo e Merluza': 'Abrótea; Galo e Merluza'
            'Albacoras - atuns e afins': 'Albacoras - atuns e afins'
            'Bonito-listrado': 'Bonito-listrado'
            'Camarão-rosa e peixes diversos': 'Camarão-rosa e peixes diversos'
            'Camarão-sete-barbas': 'Camarão-sete-barbas'
            'Caranguejo-vermelho': 'Caranguejo-vermelho'
            'Cavala e Albacorinha': 'Cavala e Albacorinha'
            'Corvina; Pescadas; Castanha e Abrótea': 'Corvina; Pescadas; Castanha e Abrótea'
            'Dourado - atuns e afins': 'Dourado - atuns e afins'
            'Espadarte - atuns e afins': 'Espadarte - atuns e afins'
            'Fundo e Superfície': 'Fundo e Superfície'
            'Garoupas; Cherne; Sirigado e outros peixes de fundo': 'Garoupas; Cherne; Sirigado e outros peixes de fundo'
            Lagostas: 'Lagostas'
            Pargo: 'Pargo'
            'Peixe-sapo': 'Peixe-sapo'
            'Pescada Amarela': 'Pescada Amarela'
            'Pescada-gó': 'Pescada-gó'
            'Piramutaba e peixes diversos': 'Piramutaba e peixes diversos'
            'Piramutaba; Dourada e Gurijuba': 'Piramutaba; Dourada e Gurijuba'
            Polvo: 'Polvo'
            'Sardinha-laje': 'Sardinha-laje'
            'Sardinha-verdadeira e Anchova': 'Sardinha-verdadeira e Anchova'
            'Sardinha-verdadeira e Bonito-listrado': 'Sardinha-verdadeira e Bonito-listrado'
            'Sardinha-verdadeira e Tainha': 'Sardinha-verdadeira e Tainha'
            Serras: 'Serras'
            'Tainhas; Anchova e Serras': 'Tainhas; Anchova e Serras'
            camarões: 'camarões'
            'peixes demersais': 'peixes demersais'
            'peixes diversos': 'peixes diversos'
            'permissionamento antigo; em processo de conversão': 'permissionamento antigo; em processo de conversão'
          }
          keyword: 'target_species'
        }
      }
    }
    'private-bra-onyxsat-fishing-vessels': {
      description: 'Fishing Vessels (VMS Brazil)'
      name: 'VMS Brazil (Fishing Vessels)'
      schema: {
        codMarinha: 'codMarinha'
        fishingZone: 'fishingZone'
        licensDescription: 'licensDescription'
        licenseCode: 'licenseCode'
        source: 'source'
        targetSpecies: {
          enum: {
            ' Camarão-rosa': ' Camarão-rosa'
            'Abrótea; Galo e Merluza': 'Abrótea; Galo e Merluza'
            'Albacoras - atuns e afins': 'Albacoras - atuns e afins'
            'Bonito-listrado': 'Bonito-listrado'
            'Camarão-rosa e peixes diversos': 'Camarão-rosa e peixes diversos'
            'Camarão-sete-barbas': 'Camarão-sete-barbas'
            'Caranguejo-vermelho': 'Caranguejo-vermelho'
            'Cavala e Albacorinha': 'Cavala e Albacorinha'
            'Corvina; Pescadas; Castanha e Abrótea': 'Corvina; Pescadas; Castanha e Abrótea'
            'Dourado - atuns e afins': 'Dourado - atuns e afins'
            'Espadarte - atuns e afins': 'Espadarte - atuns e afins'
            'Fundo e Superfície': 'Fundo e Superfície'
            'Garoupas; Cherne; Sirigado e outros peixes de fundo': 'Garoupas; Cherne; Sirigado e outros peixes de fundo'
            Lagostas: 'Lagostas'
            Pargo: 'Pargo'
            'Peixe-sapo': 'Peixe-sapo'
            'Pescada Amarela': 'Pescada Amarela'
            'Pescada-gó': 'Pescada-gó'
            'Piramutaba e peixes diversos': 'Piramutaba e peixes diversos'
            'Piramutaba; Dourada e Gurijuba': 'Piramutaba; Dourada e Gurijuba'
            Polvo: 'Polvo'
            'Sardinha-laje': 'Sardinha-laje'
            'Sardinha-verdadeira e Anchova': 'Sardinha-verdadeira e Anchova'
            'Sardinha-verdadeira e Bonito-listrado': 'Sardinha-verdadeira e Bonito-listrado'
            'Sardinha-verdadeira e Tainha': 'Sardinha-verdadeira e Tainha'
            Serras: 'Serras'
            'Tainhas; Anchova e Serras': 'Tainhas; Anchova e Serras'
            camarões: 'camarões'
            'peixes demersais': 'peixes demersais'
            'peixes diversos': 'peixes diversos'
            'permissionamento antigo; em processo de conversão': 'permissionamento antigo; em processo de conversão'
          }
          keyword: 'targetSpecies'
        }
      }
    }
    'private-bra-onyxsat-non-fishing-vessels': {
      description: 'Non Fishing Vessels (VMS Brazil)'
      name: 'VMS Brazil (Non Fishing Vessels)'
      schema: {
        codMarinha: 'codMarinha'
        fishingZone: 'fishingZone'
        licensDescription: 'licensDescription'
        licenseCode: 'licenseCode'
        source: 'source'
        targetSpecies: {
          enum: {
            ' Camarão-rosa': ' Camarão-rosa'
            'Abrótea; Galo e Merluza': 'Abrótea; Galo e Merluza'
            'Albacoras - atuns e afins': 'Albacoras - atuns e afins'
            'Bonito-listrado': 'Bonito-listrado'
            'Camarão-rosa e peixes diversos': 'Camarão-rosa e peixes diversos'
            'Camarão-sete-barbas': 'Camarão-sete-barbas'
            'Caranguejo-vermelho': 'Caranguejo-vermelho'
            'Cavala e Albacorinha': 'Cavala e Albacorinha'
            'Corvina; Pescadas; Castanha e Abrótea': 'Corvina; Pescadas; Castanha e Abrótea'
            'Dourado - atuns e afins': 'Dourado - atuns e afins'
            'Espadarte - atuns e afins': 'Espadarte - atuns e afins'
            'Fundo e Superfície': 'Fundo e Superfície'
            'Garoupas; Cherne; Sirigado e outros peixes de fundo': 'Garoupas; Cherne; Sirigado e outros peixes de fundo'
            Lagostas: 'Lagostas'
            Pargo: 'Pargo'
            'Peixe-sapo': 'Peixe-sapo'
            'Pescada Amarela': 'Pescada Amarela'
            'Pescada-gó': 'Pescada-gó'
            'Piramutaba e peixes diversos': 'Piramutaba e peixes diversos'
            'Piramutaba; Dourada e Gurijuba': 'Piramutaba; Dourada e Gurijuba'
            Polvo: 'Polvo'
            'Sardinha-laje': 'Sardinha-laje'
            'Sardinha-verdadeira e Anchova': 'Sardinha-verdadeira e Anchova'
            'Sardinha-verdadeira e Bonito-listrado': 'Sardinha-verdadeira e Bonito-listrado'
            'Sardinha-verdadeira e Tainha': 'Sardinha-verdadeira e Tainha'
            Serras: 'Serras'
            'Tainhas; Anchova e Serras': 'Tainhas; Anchova e Serras'
            camarões: 'camarões'
            'peixes demersais': 'peixes demersais'
            'peixes diversos': 'peixes diversos'
            'permissionamento antigo; em processo de conversão': 'permissionamento antigo; em processo de conversão'
          }
          keyword: 'targetSpecies'
        }
      }
    }
    'private-bra-onyxsat-presence': {
      description: 'Presence (Brazil private)'
      name: 'VMS Brazil'
      schema: {
        shiptype: {
          enum: {
            fishing: 'fishing'
            'non-fishing': 'non-fishing'
          }
          keyword: 'shiptype'
        }
      }
    }
    'private-bra-onyxsat-vessel-identity-fishing': {
      description: 'Fishing Vessels (VMS Brazil)'
      name: 'VMS Brazil (Fishing Vessels)'
    }
    'private-bra-onyxsat-vessel-identity-non-fishing': {
      description: 'Non Fishing Vessels (VMS Brazil)'
      name: 'VMS Brazil (Non Fishing Vessels)'
    }
    'private-brazil-opentuna-presence': {
      description: 'Presence (Brazil Open tuna - private)'
      name: 'Brazil VMS'
    }
    'private-costa-rica-fishing-effort': {
      description: 'Description pending'
      name: 'Costa Rica VMS'
      schema: {
        fleet: {
          enum: {
            costarica_vms_atuneros: 'costarica_vms_atuneros'
            costarica_vms_industrial_longline: 'costarica_vms_industrial_longline'
            costarica_vms_sardineros: 'costarica_vms_sardineros'
          }
          keyword: 'fleet'
        }
      }
    }
    'private-costa-rica-presence': {
      description: 'Dataset for VMS Costa Rica presence'
      name: 'Vessel Presence Costa Rica VMS'
      schema: {
        bearing: 'bearing'
        fleet: {
          enum: {
            costarica_vms_atuneros: 'costarica_vms_atuneros'
            costarica_vms_industrial_longline: 'costarica_vms_industrial_longline'
            costarica_vms_sardineros: 'costarica_vms_sardineros'
          }
          keyword: 'fleet'
        }
        speed: 'speed'
      }
    }
    'private-ecuador-fishing-effort': {
      description: 'Description pending'
      name: 'Ecuador VMS'
      schema: {
        shiptype: {
          enum: {
            fishing: 'fishing'
          }
          keyword: 'shiptype'
        }
      }
    }
    'private-ecuador-presence': {
      description: 'Dataset for VMS Ecuador presence'
      name: 'Vessel Presence Ecuador VMS'
      schema: {
        bearing: 'bearing'
        shiptype: {
          enum: {
            auxiliary: 'auxiliary'
            boat: 'boat'
            fishing: 'fishing'
            'international traffic': 'international traffic'
            'national traffic': 'national traffic'
            tug: 'tug'
          }
          keyword: 'shiptype'
        }
        speed: 'speed'
      }
    }
    'private-global-other-vessels': {
      description: 'Other vessels from AIS'
      name: 'AIS (Other Vessels)'
      schema: {
        source: 'source'
      }
    }
    'private-global-presence-tracks': {
      description: 'The dataset contains the tracks from all vessels (AIS) - Version 20201001'
      name: 'Tracks'
      schema: {
        speed: {
          enum: {
            '0': '0'
            '20': '20'
          }
          keyword: 'speed'
        }
      }
    }
    'private-indonesia-aruna-fishing-effort': {
      description: 'Indonesia Aruna Fishing Effort'
      name: 'Aruna: Indonesia Pelagic'
    }
    'private-indonesia-aruna-presence': {
      description: 'Aruna Presence'
      name: 'Aruna: Indonesia Pelagic'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'private-indonesia-aruna-vessel-identity': {
      description: 'Vessels (Indonesia Aruna)'
      name: 'Indonesia Aruna (Vessels)'
    }
    'private-indonesia-aruna-vessels': {
      description: 'Vessels (Indonesia Aruna)'
      name: 'Indonesia Aruna (Vessels)'
      schema: {
        source: 'source'
      }
    }
    'private-indonesia-fishing-effort': {
      description: 'VMS data for Indonesia is not currently available for the period from July 2020.\n\nVessel monitoring system (VMS) data provided by the Indonesian Government’s Ministry of Maritime Affairs and Fisheries. Data is collected using their VMS via satellites and terrestrial receivers, and contains a vessel identities, gear type, location, speed, direction and more. Global Fishing Watch analyzes this data using the same algorithms developed for automatic identification system (AIS) data to identify fishing activity and behaviors. The algorithm classifies each broadcast data point for these vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch fishing activity heat map. VMS broadcasts data quite differently from AIS and may give different measures of completeness, accuracy and quality. Over time our algorithms will improve across all our broadcast data formats. Global Fishing Watch’s fishing presence algorithm for VMS, as for AIS, is a best effort to algorithmically identify “apparent fishing activity.” It is possible that some fishing activity is not identified, or that the heat map may show apparent fishing activity where fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity,” “fishing” or “fishing effort,” as “apparent,” rather than certain. Any/all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at your own risk. Global Fishing Watch fishing presence algorithms are developed and tested using actual fishing event data collected by observers, combined with expert analysis of AIS vessel movement data resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and automated classification techniques.'
      name: 'Indonesia VMS'
    }
    'private-indonesia-fishing-vessels': {
      description: 'Dataset for VMS Indonesia (Private)'
      name: 'Indonesia VMS (Fishing Vessels)'
    }
    'private-indonesia-ipnlf-fishing-effort': {
      description: 'Indonesia AP2HI-IPNLF Fishing Effort'
      name: 'AP2HI-IPNLF: Indonesia Pelagic'
    }
    'private-indonesia-ipnlf-presence': {
      description: 'AP2HI-IPNLF Presence'
      name: 'AP2HI-IPNLF: Indonesia Pelagic'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'private-indonesia-ipnlf-vessel-identity': {
      description: 'Vessels (Indonesia IPNLF)'
      name: 'Indonesia IPNLF (Vessels)'
    }
    'private-indonesia-ipnlf-vessels': {
      description: 'Vessels (Indonesia IPNLF)'
      name: 'Indonesia IPNLF (Vessels)'
      schema: {
        source: 'source'
      }
    }
    'private-indonesia-pelagic-fishing-effort': {
      description: 'Indonesia Pelagic Fishing Effort Private Data'
      name: 'Indonesia Pelagic'
    }
    'private-indonesia-pelagic-presence': {
      description: 'Pelagic Presence'
      name: 'Indonesia Pelagic'
    }
    'private-indonesia-pelagic-vessel-identity': {
      description: 'Vessels (Indonesia Pelagic)'
      name: 'Indonesia Pelagic (Vessels)'
    }
    'private-indonesia-pelagic-vessels': {
      description: 'Vessels (Indonesia Pelagic)'
      name: 'Indonesia Pelagic (Vessels)'
      schema: {
        source: 'source'
      }
    }
    'private-indonesia-presence': {
      description: 'Presence'
      name: 'VMS Indonesia (Presence)'
      schema: {
        shiptype: {
          enum: {
            'Anchored gillnets': 'Anchored gillnets'
            'Basic longline': 'Basic longline'
            'Cast Nets': 'Cast Nets'
            'Fish net/dragnet': 'Fish net/dragnet'
            'Hand Line Tuna': 'Hand Line Tuna'
            Handline: 'Handline'
            'Longline Tuna': 'Longline Tuna'
            'Oceanic gillnet': 'Oceanic gillnet'
            'Pole-and-line': 'Pole-and-line'
            'Purse Seine Big Pelagics with one boat': 'Purse Seine Big Pelagics with one boat'
            'Purse Seine Small Pelagics': 'Purse Seine Small Pelagics'
            'Shrimp net': 'Shrimp net'
            'Squid hooking': 'Squid hooking'
            'Stick-Held lift net': 'Stick-Held lift net'
            Transporter: 'Transporter'
          }
          keyword: 'shiptype'
        }
      }
    }
    'private-indonesia-rare-fishing-effort': {
      description: 'Indonesia Rare Fishing Effort'
      name: 'Rare: Indonesia Pelagic'
    }
    'private-indonesia-rare-presence': {
      description: 'Rare Presence'
      name: 'Rare: Indonesia Pelagic'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'private-indonesia-rare-vessel-identity': {
      description: 'Vessels (Indonesia Rare)'
      name: 'Indonesia Rare (Vessels)'
    }
    'private-indonesia-rare-vessels': {
      description: 'Vessels (Indonesia Rare)'
      name: 'Indonesia Rare (Vessels)'
      schema: {
        source: 'source'
      }
    }
    'private-indonesia-zebrax-presence': {
      description: 'Zebra X Presence'
      name: 'Indonesia Zebrax (Private)'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'private-indonesia-zebrax-vessel-identity': {
      description: 'Vessels (Indonesia ZebraX)'
      name: 'Indonesia ZebraX (Vessels)'
    }
    'private-indonesia-zebrax-vessels': {
      description: 'Vessels (Indonesia ZebraX)'
      name: 'Indonesia ZebraX (Vessels)'
      schema: {
        source: 'source'
      }
    }
    'private-norway-fishing-effort': {
      description: 'Description pending'
      name: 'Norway VMS'
    }
    'private-panama-fishing-effort': {
      description: 'Vessel monitoring system (VMS) data provided by the Panamanian Authority of Aquatic Resources (ARAP). Data is received by Panama’s VMS system via satellite and contains vessel identities, gear type, location, speed, direction and more. Panama’s carrier vessel data is also available here. Each point in the carrier vessel data layer represents a position of the carriers, but not all positions are displayed. Carrier vessel positions are displayed once per day. In the future, we expect to be able to display more positions. Click on a carrier vessel’s position to view the vessel’s complete track. Global Fishing Watch analyzes this data using the same algorithms we developed for automatic identification system (AIS) data to identify fishing activity and behaviors. The algorithm classifies each broadcast data point from vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch fishing activity heat map. VMS broadcasts data quite differently from AIS and may give different measures of completeness, accuracy and quality. Over time our algorithms will improve across all our broadcast data formats. Global Fishing Watch’s fishing detection algorithm for VMS, as for AIS, is a best effort to algorithmically identify “apparent fishing activity.” It is possible that some fishing activity is not identified, or that the heat map may show apparent fishing activity where fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity,” “fishing,” and “fishing effort,” as “apparent” rather than certain. Any/all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at your own risk. Global Fishing Watch fishing detection algorithms are developed and tested using actual fishing event data collected by observers, combined with expert analysis of AIS vessel movement data resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and automated classification.'
      name: 'Panama VMS'
    }
    'private-panama-fishing-vessels': {
      description: 'Dataset for VMS Panama (Private)'
      name: 'Panama Private VMS (Private Fishing Vessels)'
      schema: {
        length: 'length'
        source: 'source'
      }
    }
    'private-panama-non-fishing-vessels': {
      description: 'Dataset for VMS Panama (Private)'
      name: 'Panama Private VMS (Private Non Fishing Vessels)'
      schema: {
        source: 'source'
      }
    }
    'private-panama-presence': {
      description: 'This layer uses the Vessel Monitoring System (VMS) data provided by the Panamanian Authority of Aquatic Resources (ARAP). The data is received by Panama’s VMS system via satellite and contains vessel identities, gear type, location, speed, direction and more. Each point in the carrier vessel data layer represents a position of the carriers, but not all positions are displayed. Carrier vessel positions are displayed once per day. Click on a carrier vessel’s position to view the vessel’s complete track.'
      name: 'Vessel Presence Panama VMS'
      schema: {
        bearing: 'bearing'
        shiptype: {
          enum: {
            carrier: 'carrier'
            fishing: 'fishing'
            oil_tanker: 'oil_tanker'
          }
          keyword: 'shiptype'
        }
        speed: 'speed'
      }
    }
    'private-panama-vessel-identity-fishing': {
      description: 'Dataset for VMS Panama (Private)'
      name: 'Panama Private VMS (Private Fishing Vessels)'
    }
    'private-panama-vessel-identity-non-fishing': {
      description: 'Dataset for VMS Panama (Private)'
      name: 'Panama Private VMS (Private Non Fishing Vessels)'
    }
    'private-peru-fishing-effort': {
      description: 'Vessel monitoring system (VMS) data provided by the Peruvian Government’s Ministry of Production, Fisheries Sector (PRODUCE). Permission to include Peruvian Data required that a 10 day delay to publishing was implemented. Data is collected using their vessel monitoring system (VMS) via satellites and terrestrial receivers, and contains a vessel’s identity gear type, location, speed, direction and more. Global Fishing Watch analyzes this data using the same algorithms developed for automatic identification system (AIS) data to identify fishing activity and behaviors. The algorithm classifies each broadcast data point for these vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch fishing activity heat map. VMS broadcasts data quite differently from AIS and may give different measures of completeness, accuracy and quality. Over time our algorithms will improve across all our broadcast data formats. Global Fishing Watch’s fishing detection algorithm for VMS, as for AIS, is a best effort to algorithmically identify “apparent fishing activity.” It is possible that some fishing activity is not identified, or that the heat map may show apparent fishing activity where fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity,” “fishing” or “fishing effort,” as “apparent,” rather than certain. Any/all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at your own risk. Global Fishing Watch fishing detection algorithms are developed and tested using actual fishing event data collected by observers, combined with expert analysis of AIS vessel movement data resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and automated classification techniques.'
      name: 'Peru VMS'
      schema: {
        fleet: {
          enum: {
            artisanal: 'artisanal'
            industrial: 'industrial'
            'not defined': 'not defined'
            'small-scale': 'small-scale'
          }
          keyword: 'fleet'
        }
        origin: {
          enum: {
            Foreign: 'Foreign'
            PER: 'PER'
          }
          keyword: 'origin'
        }
      }
    }
    'private-peru-fishing-vessels': {
      description: 'Dataset for VMS Peru (Private)'
      name: 'Private Peru VMS (Fishing Vessels)'
      schema: {
        casco: {
          enum: {
            'ACERO NAVAL': 'ACERO NAVAL'
            'FIBRA DE VIDRIO': 'FIBRA DE VIDRIO'
            MADERA: 'MADERA'
            'N/E': 'N/E'
            NONE: 'NONE'
          }
          keyword: 'casco'
        }
        chdSpecies: 'chdSpecies'
        fleet: {
          enum: {
            artisanal: 'artisanal'
            industrial: 'industrial'
            'not defined': 'not defined'
          }
          keyword: 'fleet'
        }
        length: 'length'
        origin: {
          enum: {
            Foreign: 'Foreign'
            Peru: 'Peru'
          }
          keyword: 'origin'
        }
        source: 'source'
      }
    }
    'private-peru-presence': {
      description: 'Vessel monitoring system (VMS) data provided by the Peruvian Government’s Ministry of Production, Fisheries Sector (PRODUCE). Permission to include Peruvian Data required that a 10 day delay to publishing was implemented. Data is collected using their vessel monitoring system (VMS) via satellites and terrestrial receivers, and contains a vessel’s identity gear type, location, speed, direction and more. Global Fishing Watch analyzes this data using the same algorithms developed for automatic identification system (AIS) data to identify fishing activity and behaviors. The algorithm classifies each broadcast data point for these vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch fishing activity heat map. VMS broadcasts data quite differently from AIS and may give different measures of completeness, accuracy and quality. Over time our algorithms will improve across all our broadcast data formats. Global Fishing Watch’s fishing detection algorithm for VMS, as for AIS, is a best effort to algorithmically identify “apparent fishing activity.” It is possible that some fishing activity is not identified, or that the heat map may show apparent fishing activity where fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity,” “fishing” or “fishing effort,” as “apparent,” rather than certain. Any/all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at your own risk. Global Fishing Watch fishing detection algorithms are developed and tested using actual fishing event data collected by observers, combined with expert analysis of AIS vessel movement data resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and automated classification techniques.'
      name: 'Peru VMS Presence'
      schema: {
        fleet: {
          enum: {
            artisanal: 'artisanal'
            industrial: 'industrial'
            'not defined': 'not defined'
            'small-scale': 'small-scale'
          }
          keyword: 'fleet'
        }
        origin: {
          enum: {
            Foreign: 'Foreign'
            PER: 'PER'
          }
          keyword: 'origin'
        }
      }
    }
    'private-peru-vessel-identity-fishing': {
      description: 'Dataset for VMS Peru (Private)'
      name: 'Private Peru VMS (Fishing Vessels)'
    }
    'private-png-fishing-effort': {
      description: "Vessel monitoring system (VMS) data is provided by the The National Fisheries Authority of Papua New Guinea. Data is collected using Papua New Guinea's vessel monitoring (VMS) system via satellites, that contains vessel's identifiers and location, and is published on a five-day delay. Global Fishing Watch infers speed and course for each vessel location and analyzes this data using the same algorithms developed for automatic identification system (AIS) to identify fishing activity and behaviors. The algorithm classifies each broadcast data point from vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch’s fishing activity heat map. VMS broadcasts data differently from AIS and may give different measures of completeness, accuracy, and quality. Global Fishing Watch is continually improving its algorithms across all broadcast data formats to algorithmically identify “apparent fishing activity”. It is possible that some fishing activity is not identified or that the heat map may show apparent fishing activity when fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity”, “fishing” or “fishing effort”, as apparent rather than certain. Any and all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at the user’s discretion. Global Fishing Watch’s fishing detection algorithms are developed and tested using actual fishing event data collected by observers and is combined with expert analysis of AIS vessel movement data, resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and to improve automated classification techniques"
      name: 'Papua New Guinea VMS'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'private-png-fishing-identity-vessels': {
      description: 'Dataset for VMS Papua New Guinea (Private)'
      name: 'Papua New Guinea VMS (Fishing Vessels)'
    }
    'private-png-fishing-vessels': {
      description: 'Dataset for VMS Papua New Guinea (Private)'
      name: 'Papua New Guinea VMS (Fishing Vessels)'
      schema: {
        source: 'source'
      }
    }
    'private-png-presence': {
      description: "Vessel monitoring system (VMS) data is provided by the The National Fisheries Authority of Papua New Guinea. Data is collected using Papua New Guinea's national VMS  that is provided by the Fisheries Information and Management System (FIMS). VMS data includes vessel identifiers and location, and is published with a five-day delay.\n\nThe activity layer displays a heatmap of vessel presence. The presence is determined by taking two positions per hour per vessel from the positions transmitted by the vessel's VMS."
      name: 'Papua New Guinea VMS'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'proto-global-encounters-events': {
      description: 'The dataset contains encounter events with authorizations for AIS. [Fishing-Carriers, Carriers-Fishing, Support-Fishing, Fishing-Support]'
      name: 'Encounter Events. (AIS)'
    }
    'proto-global-encounters-events-30min': {
      description: 'The dataset contains encounter events of 30min for AIS. [Fishing-Carriers, Carriers-Fishing, Support-Fishing, Fishing-Support]'
      name: 'PROTOTYPE - Encounter Events of 30min. (AIS)'
      schema: {
        duration: 'duration'
      }
    }
    'public-ais-presence-viirs-match': {
      description: 'The night lights vessel detections layer, known as visible infrared imaging radiometer suite or VIIRS, shows vessels at sea that satellites have detected by the light they emit at night. Though not exclusively associated with fishing vessels, this activity layer is likely to show vessels associated with activities like squid fishing, which use bright lights and fish at night.The satellite makes a single over-pass across the entire planet every night, detecting lights not obscured by clouds and designed to give at least one observation globally every day. Because the vessels are detected solely based on light emission, we can detect individual vessels and even entire fishing fleets that are not broadcasting automatic identification system (AIS) and so are not represented in the AIS apparent fishing effort layer. Lights from fixed offshore infrastructure and other non-vessel sources are excluded. Global Fishing Watch ingests boat detections processed from low light imaging data collected by the U.S. National Oceanic and Atmospheric Administration (NOAA) VIIRS. The boat detections are processed in near-real time by NOAA’s Earth Observation Group, located in Boulder, Colorado. The data, known as VIIRS boat detections, picks up the presence of fishing vessels using lights to attract catch or to conduct operations at night. More than 85% of the detections are from vessels that lack AIS or Vessel Monitoring System (VMS) transponders. Due to the orbit design of polar orbiting satellites, regions closer to polar will have more over-passes per day, while equatorial regions have only one over-pass daily. Read more about this product, and download the data <a href="https://ngdc.noaa.gov/eog/viirs/download_boat.html" target="_blank" rel="noopener">here</a>.Those using night light detections data should acknowledge the South Atlantic Anomaly (SAA), an area where the Earth\'s inner Van Allen radiation belt is at its lowest altitude, allowing more energetic particles from space to penetrate. When such particles hit the sensors on a satellite, this can create a false signal which might cause the algorithm to recognize it as a boat presence. A filtration algorithm has been applied but there may still be some mis-identification. The GFW layer includes quality flags (QF), including a filter to show only detections which NOAA has classified as vessels (QF1)'
      name: 'VIIRS Match'
      schema: {
        bearing: 'bearing'
        matched: {
          enum: {
            false: 'false'
            true: 'true'
          }
          keyword: 'matched'
        }
        qf_detect: {
          enum: {
            '1': '1'
            '10': '10'
            '2': '2'
            '3': '3'
            '5': '5'
            '7': '7'
          }
          keyword: 'qf_detect'
        }
        radiance: {
          enum: {
            '0': '0'
            '10000': '10000'
          }
          keyword: 'radiance'
        }
        shiptype: {
          enum: {
            carrier: 'carrier'
            fishing: 'fishing'
            support: 'support'
            unknown: 'unknown'
          }
          keyword: 'shiptype'
        }
        speed: 'speed'
      }
    }
    'public-ais-presence-viirs-match-prototype': {
      description: 'The night lights vessel detections layer, known as visible infrared imaging radiometer suite or VIIRS, shows vessels at sea that satellites have detected by the light they emit at night. Though not exclusively associated with fishing vessels, this activity layer is likely to show vessels associated with activities like squid fishing, which use bright lights and fish at night.The satellite makes a single over-pass across the entire planet every night, detecting lights not obscured by clouds and designed to give at least one observation globally every day. Because the vessels are detected solely based on light emission, we can detect individual vessels and even entire fishing fleets that are not broadcasting automatic identification system (AIS) and so are not represented in the AIS apparent fishing effort layer. Lights from fixed offshore infrastructure and other non-vessel sources are excluded. Global Fishing Watch ingests boat detections processed from low light imaging data collected by the U.S. National Oceanic and Atmospheric Administration (NOAA) VIIRS. The boat detections are processed in near-real time by NOAA’s Earth Observation Group, located in Boulder, Colorado. The data, known as VIIRS boat detections, picks up the presence of fishing vessels using lights to attract catch or to conduct operations at night. More than 85% of the detections are from vessels that lack AIS or Vessel Monitoring System (VMS) transponders. Due to the orbit design of polar orbiting satellites, regions closer to polar will have more over-passes per day, while equatorial regions have only one over-pass daily. Read more about this product, and download the data <a href="https://ngdc.noaa.gov/eog/viirs/download_boat.html" target="_blank" rel="noopener">here</a>.Those using night light detections data should acknowledge the South Atlantic Anomaly (SAA), an area where the Earth\'s inner Van Allen radiation belt is at its lowest altitude, allowing more energetic particles from space to penetrate. When such particles hit the sensors on a satellite, this can create a false signal which might cause the algorithm to recognize it as a boat presence. A filtration algorithm has been applied but there may still be some mis-identification. The GFW layer includes quality flags (QF), including a filter to show only detections which NOAA has classified as vessels (QF1)'
      name: 'VIIRS Match'
      schema: {
        matched: {
          enum: {
            false: 'false'
            true: 'true'
          }
          keyword: 'matched'
        }
        qf_detect: {
          enum: {
            '1': '1'
            '10': '10'
            '2': '2'
            '3': '3'
            '5': '5'
            '7': '7'
          }
          keyword: 'qf_detect'
        }
        radiance: {
          enum: {
            '0': '0'
            '10000': '10000'
          }
          keyword: 'radiance'
        }
        shiptype: {
          enum: {
            carrier: 'carrier'
            fishing: 'fishing'
            support: 'support'
            unknown: 'unknown'
          }
          keyword: 'shiptype'
        }
      }
    }
    'public-areas-to-be-avoided-1618836788619': {
      description: '25 nm buffer around islands recommending shipping diversion'
      name: 'Areas to be Avoided by Cargo Shipping'
    }
    'public-bathymetry-contour': {
      description: 'Combination of lines and points that represent the bathymetry contour'
      name: 'Bathymetry Contour'
    }
    'public-belize-fishing-effort': {
      description: "Vessel monitoring system (VMS) data is provided by the Belize High Seas Fisheries Unit (BHSFU). Data is collected using Belize's vessel monitoring system via satellites and is published on a three-day delay containing information on vessels’ location, speed, course, and movement. Global Fishing Watch analyzes this data using the same algorithms developed for automatic identification system (AIS) to identify fishing activity and behaviors. The algorithm classifies each broadcast data point from vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch’s fishing activity heat map. VMS broadcasts data differently from AIS and may give different measures of completeness, accuracy, and quality. Global Fishing Watch is continually improving its algorithms across all broadcast data formats to algorithmically identify “apparent fishing activity.” It is possible that some fishing activity is not identified or that the heat map may show apparent fishing activity when fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity,” “fishing” or “fishing effort,” as apparent rather than certain. Any and all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at the user’s discretion. Global Fishing Watch’s fishing presence algorithms are developed and tested using actual fishing event data collected by observers and is combined with expert analysis of AIS vessel movement data, resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and to improve automated classification techniques."
      name: 'Belize VMS'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'public-belize-fishing-vessels': {
      description: 'Fishing Vessels (VMS Belize)'
      name: 'VMS Belize (Fishing Vessels)'
      schema: {
        source: 'source'
      }
    }
    'public-belize-vessel-identity': {
      description: 'Vessel Identity (VMS Belize)'
      name: 'VMS Belize'
    }
    'public-belize-vessel-identity-fishing': {
      description: 'Vessel Identity (VMS Belize)'
      name: 'VMS Belize'
    }
    'public-bra-onyxsat-fishing-effort': {
      description: 'Global Fishing Watch uses data about a vessel’s identity, type, location, speed, direction and more that is broadcast using the Automatic Identification System (AIS) and collected via satellites and terrestrial receivers. AIS was developed for safety/collision-avoidance. Global Fishing Watch analyzes AIS data collected from vessels that our research has identified as known or possible commercial fishing vessels, and applies a fishing presence algorithm to determine “apparent fishing activity” based on changes in vessel speed and direction. The algorithm classifies each AIS broadcast data point for these vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch fishing activity heat map. AIS data as broadcast may vary in completeness, accuracy and quality. Also, data collection by satellite or terrestrial receivers may introduce errors through missing or inaccurate data. Global Fishing Watch’s fishing presence algorithm is a best effort mathematically to identify “apparent fishing activity.” As a result, it is possible that some fishing activity is not identified as such by Global Fishing Watch; conversely, Global Fishing Watch may show apparent fishing activity where fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies designations of vessel fishing activity, including synonyms of the term “fishing activity,” such as “fishing” or “fishing effort,” as “apparent,” rather than certain. Any/all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at your own risk. Global Fishing Watch is taking steps to make sure fishing activity designations are as accurate as possible. Global Fishing Watch fishing presence algorithms are developed and tested using actual fishing event data collected by observers, combined with expert analysis of vessel movement data resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and automated classification techniques.'
      name: 'Brazil VMS'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
        target_species: {
          enum: {
            ' Camarão-rosa': ' Camarão-rosa'
            'Abrótea; Galo e Merluza': 'Abrótea; Galo e Merluza'
            'Albacoras - atuns e afins': 'Albacoras - atuns e afins'
            'Bonito-listrado': 'Bonito-listrado'
            'Camarão-rosa e peixes diversos': 'Camarão-rosa e peixes diversos'
            'Camarão-sete-barbas': 'Camarão-sete-barbas'
            'Caranguejo-vermelho': 'Caranguejo-vermelho'
            'Cavala e Albacorinha': 'Cavala e Albacorinha'
            'Corvina; Pescadas; Castanha e Abrótea': 'Corvina; Pescadas; Castanha e Abrótea'
            'Dourado - atuns e afins': 'Dourado - atuns e afins'
            'Espadarte - atuns e afins': 'Espadarte - atuns e afins'
            'Fundo e Superfície': 'Fundo e Superfície'
            'Garoupas; Cherne; Sirigado e outros peixes de fundo': 'Garoupas; Cherne; Sirigado e outros peixes de fundo'
            Lagostas: 'Lagostas'
            Pargo: 'Pargo'
            'Peixe-sapo': 'Peixe-sapo'
            'Pescada Amarela': 'Pescada Amarela'
            'Pescada-gó': 'Pescada-gó'
            'Piramutaba e peixes diversos': 'Piramutaba e peixes diversos'
            'Piramutaba; Dourada e Gurijuba': 'Piramutaba; Dourada e Gurijuba'
            Polvo: 'Polvo'
            'Sardinha-laje': 'Sardinha-laje'
            'Sardinha-verdadeira e Anchova': 'Sardinha-verdadeira e Anchova'
            'Sardinha-verdadeira e Bonito-listrado': 'Sardinha-verdadeira e Bonito-listrado'
            'Sardinha-verdadeira e Tainha': 'Sardinha-verdadeira e Tainha'
            Serras: 'Serras'
            'Tainhas; Anchova e Serras': 'Tainhas; Anchova e Serras'
            camarões: 'camarões'
            'peixes demersais': 'peixes demersais'
            'peixes diversos': 'peixes diversos'
            'permissionamento antigo; em processo de conversão': 'permissionamento antigo; em processo de conversão'
          }
          keyword: 'target_species'
        }
      }
    }
    'public-bra-onyxsat-fishing-vessels': {
      description: 'Fishing Vessels (VMS Brazil)'
      name: 'VMS Brazil (Fishing Vessels)'
      schema: {
        codMarinha: 'codMarinha'
        fishingZone: 'fishingZone'
        source: 'source'
        targetSpecies: {
          enum: {
            ' Camarão-rosa': ' Camarão-rosa'
            'Abrótea; Galo e Merluza': 'Abrótea; Galo e Merluza'
            'Albacoras - atuns e afins': 'Albacoras - atuns e afins'
            'Bonito-listrado': 'Bonito-listrado'
            'Camarão-rosa e peixes diversos': 'Camarão-rosa e peixes diversos'
            'Camarão-sete-barbas': 'Camarão-sete-barbas'
            'Caranguejo-vermelho': 'Caranguejo-vermelho'
            'Cavala e Albacorinha': 'Cavala e Albacorinha'
            'Corvina; Pescadas; Castanha e Abrótea': 'Corvina; Pescadas; Castanha e Abrótea'
            'Dourado - atuns e afins': 'Dourado - atuns e afins'
            'Espadarte - atuns e afins': 'Espadarte - atuns e afins'
            'Fundo e Superfície': 'Fundo e Superfície'
            'Garoupas; Cherne; Sirigado e outros peixes de fundo': 'Garoupas; Cherne; Sirigado e outros peixes de fundo'
            Lagostas: 'Lagostas'
            Pargo: 'Pargo'
            'Peixe-sapo': 'Peixe-sapo'
            'Pescada Amarela': 'Pescada Amarela'
            'Pescada-gó': 'Pescada-gó'
            'Piramutaba e peixes diversos': 'Piramutaba e peixes diversos'
            'Piramutaba; Dourada e Gurijuba': 'Piramutaba; Dourada e Gurijuba'
            Polvo: 'Polvo'
            'Sardinha-laje': 'Sardinha-laje'
            'Sardinha-verdadeira e Anchova': 'Sardinha-verdadeira e Anchova'
            'Sardinha-verdadeira e Bonito-listrado': 'Sardinha-verdadeira e Bonito-listrado'
            'Sardinha-verdadeira e Tainha': 'Sardinha-verdadeira e Tainha'
            Serras: 'Serras'
            'Tainhas; Anchova e Serras': 'Tainhas; Anchova e Serras'
            camarões: 'camarões'
            'peixes demersais': 'peixes demersais'
            'peixes diversos': 'peixes diversos'
            'permissionamento antigo; em processo de conversão': 'permissionamento antigo; em processo de conversão'
          }
          keyword: 'targetSpecies'
        }
      }
    }
    'public-bra-onyxsat-vessel-identity-fishing': {
      description: 'Fishing Vessels (VMS Brazil)'
      name: 'VMS Brazil (Fishing Vessels)'
    }
    'public-brazil-opentuna-fishing-vessels': {
      description: 'Dataset for VMS Brazil (Public)'
      name: 'Brazil Open Tuna VMS (Fishing vessels)'
      schema: {
        source: 'source'
      }
    }
    'public-brazil-opentuna-presence': {
      description: 'Presence (Brazil Open tuna)'
      name: 'Brazil Open Tuna VMS'
    }
    'public-brazil-opentuna-vessel-identity-fishing': {
      description: 'Dataset for VMS Brazil (Public)'
      name: 'Brazil Open Tuna VMS (Fishing vessels)'
    }
    'public-cfc-exploration-areas-individual': {
      description: 'Cobalt-rich ferromanganese crusts are often found along the tops and edges of seamounts, knolls, and plateaus at depths ranging between 800 meters to 2500+ meters. These crusts can contain cobalt, nickel, manganese, and rare earth elements. Proposed methods for mining cobalt-rich ferromanganese crusts include grinding and entirely removing the crust from the host rock – which are inhabited by marine biodiversity – then delivering the resulting slurry to the surface. For cobalt-rich ferromanganese crusts, the exploration area allocated to each contractor is 3,000 square kilometres and consists of 150 blocks. Each block is no greater than 20 square kilometres.'
      name: 'CFC Exploration Areas'
      schema: {
        act_date: {
          enum: {
            '1447023600000': '1447023600000'
            '1697752800000': '1697752800000'
          }
          keyword: 'act_date'
        }
        area_key: 'area_key'
        area_km_2: {
          enum: {
            '0.99879855': '0.99879855'
            '20.0156525': '20.0156525'
          }
          keyword: 'area_km_2'
        }
        area_type: 'area_type'
        blk_cell: 'blk_cell'
        blk_cell_id: {
          enum: {}
          keyword: 'blk_cell_id'
        }
        blk_orig: {
          enum: {}
          keyword: 'blk_orig'
        }
        clst_orig: {
          enum: {
            '978303600000': '978303600000'
            '999295200000': '999295200000'
          }
          keyword: 'clst_orig'
        }
        cluster_id: {
          enum: {
            'KC-1': 'KC-1'
            'KC-2': 'KC-2'
            'KC-3': 'KC-3'
            'KC-4': 'KC-4'
            'KC-5': 'KC-5'
            'KC-6': 'KC-6'
            'KC-7': 'KC-7'
            'KC-8': 'KC-8'
            'KC-9': 'KC-9'
            NA: 'NA'
            NR: 'NR'
          }
          keyword: 'cluster_id'
        }
        contract_id: {
          enum: {
            BrazilCRFC1: 'BrazilCRFC1'
            COMRACRFC1: 'COMRACRFC1'
            JOGMECCRFC1: 'JOGMECCRFC1'
            KOREACRFC1: 'KOREACRFC1'
            RUSMNRCRFC1: 'RUSMNRCRFC1'
          }
          keyword: 'contract_id'
        }
        status: 'status'
        sub_area: 'sub_area'
      }
    }
    'public-cfc-reserved-areas-individual': {
      description: 'Cobalt-rich ferromanganese crusts are often found along the tops and edges of seamounts, knolls, and plateaus at depths ranging between 800 meters to 2500+ meters. These crusts can contain cobalt, nickel, manganese, and rare earth elements. Proposed methods for mining cobalt-rich ferromanganese crusts include grinding and entirely removing the crust from the host rock – which are inhabited by marine biodiversity – then delivering the resulting slurry to the surface. Reserved Areas under the International Seabed Authority are a critical mechanism to ensure developing countries have access to deep-sea mineral resources in the future. These areas are typically contributed by developed States when they apply for exploration rights.'
      name: 'CFC Reserved Areas'
      schema: {
        act_date: {
          enum: {
            '1425942000000': '1425942000000'
          }
          keyword: 'act_date'
        }
        area_key: 'area_key'
        area_km_2: 'area_km_2'
        area_type: 'area_type'
        blk_cell: 'blk_cell'
        blk_cell_id: {
          enum: {}
          keyword: 'blk_cell_id'
        }
        blk_orig: {
          enum: {}
          keyword: 'blk_orig'
        }
        cluster_id: 'cluster_id'
        contract_id: {
          enum: {
            CRFCReserved: 'CRFCReserved'
          }
          keyword: 'contract_id'
        }
        status: 'status'
        sub_area: 'sub_area'
      }
    }
    'public-chile-all-vessels': {
      description: 'Dataset for VMS Chile (Public)'
      name: 'Chile VMS (all Vessels)'
    }
    'public-chile-fishing-effort': {
      description: 'Vessel monitoring system (VMS) data provided by the Chilean government’s fisheries and aquaculture regulator (SERNAPESCA). It is possible to filter Chile’s VMS data for small-scale fishing vessels (<18 meters) and industrial fishing vessels (>18 meters). Note that some vessels are <18 meters but are considered industrial because they were registered in the capture of industrial quotas. SERNAPESCA is also using our map to visualize and track vessel positions for their fleet, including vessels involved in aquaculture. Data is collected using Chile’s VMS via satellites and terrestrial receivers and contains vessel identities, gear type, location, speed, direction and more. Global Fishing Watch analyzes this data using the same algorithms we developed for automatic identification system (AIS) data to identify fishing activity and behaviors. The algorithm classifies each broadcast data point from vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch map. VMS broadcasts data quite differently from AIS and may give different measures of completeness, accuracy and quality. Over time our algorithms will improve across all our broadcast data formats. Global Fishing Watch’s fishing presence algorithm for VMS, as for AIS, is a best effort to algorithmically identify “apparent fishing activity.” It is possible that some fishing activity is not identified, or that the heat map may show apparent fishing activity where fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity,” “fishing,” and “fishing effort,” as “apparent” rather than certain. Any/all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at your own risk. Global Fishing Watch fishing presence algorithms are developed and tested using actual fishing event data collected by observers, combined with expert analysis of AIS vessel movement data resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and automated classification.'
      name: 'Chile VMS'
      schema: {
        bearing: 'bearing'
        fleet: {
          enum: {
            chile_vms_industry: 'chile_vms_industry'
            chile_vms_small_fisheries: 'chile_vms_small_fisheries'
          }
          keyword: 'fleet'
        }
        speed: 'speed'
      }
    }
    'public-chile-fishing-vessels': {
      description: 'Dataset for VMS Chile (Public)'
      name: 'Chile VMS (Fishing Vessels)'
    }
    'public-chile-non-fishing-vessels': {
      description: 'Dataset for VMS Chile (Public)'
      name: 'Chile VMS (Non fishing Vessels)'
    }
    'public-chile-presence': {
      description: 'Vessel monitoring system (VMS) data provided by the Chilean government’s fisheries and aquaculture regulator (SERNAPESCA). It is possible to filter Chile’s VMS data for small-scale fishing vessels (<18 meters) and industrial fishing vessels (>18 meters). Note that some vessels are <18 meters but are considered industrial because they were registered in the capture of industrial quotas. SERNAPESCA is also using our map to visualize and track vessel positions for their fleet, including vessels involved in aquaculture. Data is collected using Chile’s VMS via satellites and terrestrial receivers and contains vessel identities, gear type, location, speed, direction and more. Global Fishing Watch analyzes this data using the same algorithms we developed for automatic identification system (AIS) data to identify fishing activity and behaviors. The algorithm classifies each broadcast data point from vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch map. VMS broadcasts data quite differently from AIS and may give different measures of completeness, accuracy and quality. Over time our algorithms will improve across all our broadcast data formats. Global Fishing Watch’s fishing presence algorithm for VMS, as for AIS, is a best effort to algorithmically identify “apparent fishing activity.” It is possible that some fishing activity is not identified, or that the heat map may show apparent fishing activity where fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity,” “fishing,” and “fishing effort,” as “apparent” rather than certain. Any/all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at your own risk. Global Fishing Watch fishing presence algorithms are developed and tested using actual fishing event data collected by observers, combined with expert analysis of AIS vessel movement data resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and automated classification.'
      name: 'Chile VMS'
      schema: {
        bearing: 'bearing'
        fleet: {
          enum: {
            chile_vms_aquaculture: 'chile_vms_aquaculture'
            chile_vms_industry: 'chile_vms_industry'
            chile_vms_small_fisheries: 'chile_vms_small_fisheries'
            chile_vms_transport: 'chile_vms_transport'
          }
          keyword: 'fleet'
        }
        speed: 'speed'
      }
    }
    'public-chile-vessel-identity-fishing': {
      description: 'Dataset for VMS Chile (Public)'
      name: 'Chile VMS (Fishing Vessels)'
    }
    'public-chile-vessel-identity-non-fishing': {
      description: 'Dataset for VMS Chile (Public)'
      name: 'Chile VMS (Non fishing Vessels)'
    }
    'public-clarion-clipperton-zone-isa-claim-areas': {
      description: 'This area represents the cumulative and contiguous area of the Clarion-Clipperton Zone, a region in the Eastern Pacific that is being targeted for seabed mining and managed by the International Seabed Authority. This region includes claim areas slated for exploration, areas reserved for developing states, and areas protected for environmental interest. The primary resource targeted in this region is polymetallic nodules.'
      name: 'Clarion-Clipperton Zone ISA Claim Areas'
      schema: {
        contractor: 'contractor'
        label: 'label'
        type: 'type'
      }
    }
    'public-cold-water-corals': {
      description: 'Buffered at ~1km'
      name: 'Cold Water Corals'
    }
    'public-coral-reefs': {
      description: "<h2>Overview</h2>\n<ul>\n<li>Warm-water coral reefs are found in clear, shallow waters and are highly dynamic ecosystems that support the most biodiverse marine habitat. This dataset shows the global distribution of coral reefs in tropical and subtropical regions.</li>\n<ul>\n<h2>Source</h2>\n<ul>\n <a href='https://data.unep-wcmc.org/datasets/1'>UNEP-WCMC, WorldFish Centre, WRI, TNC (2021). Global distribution of warm-water coral reefs, compiled from multiple sources including the Millennium Coral Reef Mapping Project. Version 4.1. Includes contributions from IMaRS-USF and IRD (2005), IMaRS-USF (2005) and Spalding et al. (2001). Cambridge (UK): UN Environment World Conservation Monitoring Centre. Data DOI: https://doi.org/10.34892/t2wk-5t34.</a></li>"
      name: 'Coral reefs'
    }
    'public-costa-rica-fishing-effort': {
      description: 'Dataset for VMS Costa Rica fishing effort'
      name: 'Costa Rica VMS'
      schema: {
        bearing: 'bearing'
        fleet: {
          enum: {
            costarica_vms_atuneros: 'costarica_vms_atuneros'
            costarica_vms_industrial_longline: 'costarica_vms_industrial_longline'
            costarica_vms_sardineros: 'costarica_vms_sardineros'
          }
          keyword: 'fleet'
        }
        speed: 'speed'
      }
    }
    'public-costa-rica-fishing-vessels': {
      description: 'Dataset for VMS Costa Rica (Public)'
      name: 'Costa Rica VMS'
      schema: {
        source: 'source'
      }
    }
    'public-costa-rica-vessel-identity-vessels': {
      description: 'Dataset for VMS Costa Rica (Public)'
      name: 'Costa Rica VMS'
    }
    'public-dgg_sar_caribe_match_2019': {
      description: 'Vessels identified using synthetic aperture radar (SAR) and matched to a vessel using automatic identification system (AIS) data. Currently available for 2019. Source: Sentinel-1.'
      name: 'SAR with an AIS-matched vessel'
    }
    'public-dgg_sar_caribe_not_match_2019': {
      description: 'Vessels identified using synthetic aperture radar (SAR) without a known match to any vessel recorded using automatic identification system (AIS) data. Currently available for 2019. Source: Sentinel-1.'
      name: 'SAR without an AIS-matched vessel'
    }
    'public-ecuador-fishing-effort': {
      description: 'Dataset for VMS Ecuador fishing effort'
      name: 'Ecuador VMS'
      schema: {
        bearing: 'bearing'
        shiptype: {
          enum: {
            fishing: 'fishing'
          }
          keyword: 'shiptype'
        }
        speed: 'speed'
      }
    }
    'public-ecuador-fishing-vessels': {
      description: 'Dataset for VMS Ecuador (Public)'
      name: 'Ecuador VMS (Fishing vessels)'
      schema: {
        source: 'source'
      }
    }
    'public-ecuador-non-fishing-vessels': {
      description: 'Dataset for VMS Ecuador (Public)'
      name: 'Ecuador VMS (Non fishing vessels)'
      schema: {
        source: 'source'
      }
    }
    'public-ecuador-presence': {
      description: 'Dataset for VMS Ecuador presence'
      name: 'Ecuador VMS'
      schema: {
        bearing: 'bearing'
        shiptype: {
          enum: {
            auxiliary: 'auxiliary'
            boat: 'boat'
            fishing: 'fishing'
            'international traffic': 'international traffic'
            'national traffic': 'national traffic'
            tug: 'tug'
          }
          keyword: 'shiptype'
        }
        speed: 'speed'
      }
    }
    'public-ecuador-vessel-identity-fishing': {
      description: 'VMS Ecuador (Fishing vessels)'
      name: 'Ecuador VMS (Fishing vessels)'
    }
    'public-ecuador-vessel-identity-non-fishing': {
      description: 'VMS Ecuador (Non fishing vessels)'
      name: 'Ecuador VMS (Non fishing vessels)'
    }
    'public-eez-areas': {
      description: "Exclusive economic zones (EEZs) extend up to 200 nautical miles from a country's coast. Flanders Marine Institute (2019). Maritime Boundaries Geodatabase: Maritime Boundaries and Exclusive Economic Zones (200NM), version 11. Source: marineregions.org."
      name: 'EEZs'
    }
    'public-eez-areas-12nm': {
      description: 'Territorial seas are a belt of coastal waters extending at most 12 nautical miles (22.2 km; 13.8 mi) from the baseline (usually the mean low-water mark) of a coastal state.The territorial seas (and EEZs) lines are generally drawn from straight line baselines and these baselines are defined by each coastal state following UNCLOS rules See article 7. Waters inside the baseline are considered "internal waters" (See article 8) Citation: Flanders Marine Institute (2023). Maritime Boundaries Geodatabase: Territorial Seas (12NM), version 4. Available online at https://www.marineregions.org/. https://doi.org/10.14284/633'
      name: 'EEZs 12nm'
    }
    'public-eez-boundaries': {
      description: "EEZs boundaries are shown as solid lines for '200 NM', 'Treaty', 'Median line', 'Joint regime', 'Connection Line', 'Unilateral claim (undisputed)' and dashed lines for 'Joint regime', 'Unsettled', 'Unsettled median line' based on the 'LINE_TYPE' field. Flanders Marine Institute (2019). Maritime Boundaries Geodatabase: Maritime Boundaries and Exclusive Economic Zones (200NM), version 11. Source: marineregions.org"
      name: 'Areas boundaries for eez'
    }
    'public-eez-land': {
      description: 'Flanders Marine Institute (2019). Maritime Boundaries Geodatabase: Maritime Boundaries and Exclusive Economic Zones (200NM), version 11. Source: marineregions.org'
      name: 'EEZ (marineregions.org)'
    }
    'public-fao': {
      description: 'FAO Major Fishing Areas for Statistical Purposes are arbitrary areas, the boundaries of which were determined in consultation with international fishery agencies on various considerations, including (i) the boundary of natural regions and the natural divisions of oceans and seas; (ii) the boundaries of adjacent statistical fisheries bodies already established in inter-governmental conventions and treaties; (iii) existing national practices; (iv) national boundaries; (v) the longitude and latitude grid system; (vi) the distribution of the aquatic fauna; and (vii) the distribution of the resources and the environmental conditions within an area.'
      name: 'FAO'
    }
    'public-fao-areas-major-subareas': {
      description: "FAO major fishing areas for statistical purposes are arbitrary areas, the boundaries of which were determined in consultation with international fishery agencies. The major fishing areas, inland and marine, are listed below by two-digit codes and their names. To access maps and description of boundaries of each fishing area click on the relevant item in the list below or in the map showing the 19 major marine fishing areas. <a href='https://www.fao.org/fishery/en/area/search' target='_blank'>Source</a>"
      name: 'Fao areas (major & subareas)'
    }
    'public-fao-major': {
      description: "FAO major fishing areas for statistical purposes are arbitrary areas, the boundaries of which were determined in consultation with international fishery agencies. The major fishing areas, inland and marine, are listed below by two-digit codes and their names. To access maps and description of boundaries of each fishing area click on the relevant item in the list below or in the map showing the 19 major marine fishing areas. <a href='https://www.fao.org/fishery/en/area/search' target='_blank'>Source</a>. See more detailed <a href='https://globalfishingwatch.org/faqs/reference-layer-sources/' target='_blank' rel=noopener'>metadata information</a> for this layer"
      name: 'FAO major fishing areas'
      schema: {
        FID: 'FID'
        F_CODE: 'F_CODE'
      }
    }
    'public-fisheries-restricted-areas': {
      description: ''
      name: 'Fisheries Restricted Areas'
    }
    'public-fixed-infrastructure': {
      description: 'SAR identified fixed infrastructure'
      name: 'Fixed infrastructure'
      schema: {
        label: {
          enum: {
            oil: 'oil'
            unknown: 'unknown'
            wind: 'wind'
          }
          keyword: 'label'
        }
      }
    }
    'public-fixed-infrastructure-filtered': {
      description: '<h2>Overview</h2> <p>Offshore fixed infrastructure is a global dataset that uses AI and machine learning to detect and classify structures throughout the world’s oceans.</p> <p>Classification labels (oil, wind, and unknown) are provided, as well as confidence levels (high, medium, or low) reflecting our certainty in the assigned label. Detections can be filtered and colored on the map using both label and confidence level.<em></em>The data is updated on a monthly basis, and new classified detections are added at the beginning of every month. Viewing change using the timebar is simple, and allows anyone to recognize the rapid industrialization of the world’s oceans. For example, you can easily observe the expansion of wind farms in the North and East China Seas, or changes in oil infrastructure in the Gulf of Mexico or Persian Gulf.</p> <p>By overlaying the existing map layers, you can explore how vessels interact with oil and wind structures, visualise the density of synthetic aperture radar (SAR) and Visible Infrared Imaging Radiometer Suite (VIIRS) vessel detections around infrastructure, or determine which marine protected areas (MPAs) contain wind, oil, or other infrastructure types. These are only examples of the types of questions we can now ask. Offshore fixed infrastructure is a first of its kind dataset that not only brings to light the extensive industrialization of our oceans, but enables users across industries to use this information in research, monitoring and management.</p> <h2>Use cases</h2> <ul> <li>Maritime domain awareness</li> <ul> <li>Infrastructure locations can support maritime domain awareness, and understanding of other activities occurring at sea.</li> <li>Infrastructure data supports assessments of ocean industrialization, facilitating monitoring of areas experiencing build-up or new development</li> </ul> <li>Monitoring vessels</li> <ul> <li>Infrastructure locations can be used to analyse the behaviour of vessels associated with infrastructure, including grouping vessels based on their interaction with oil and wind structures.</li> <li>Interactions between vessels and infrastructure can help quantify the resources required to support offshore industrial activity</li> <li>The impacts of infrastructure on fishing, including attracting or deterring fishing, can be analysed.</li> </ul> <li>Marine protected areas (MPAs) and marine spatial planning</li> <ul> <li>During the planning stage in the designation of new protected areas, knowing the location of existing infrastructure will be vital to understand which stakeholders shall be included in the consultation process, to understand potential conflicts, and identify easy wins.</li> </ul> <li>Environmental impacts</li> <ul> <li>Infrastructure locations can be used to help detect marine pollution events, and to differentiate between types of pollution events (e.g. pollution from vessels versus pollution from platforms)</li> </ul> </ul> <h2>Caveats</h2> <ul> <li><strong>Sentinel-1 and Sentinel-2 satellites do not sample most of the open ocean.</strong></li> <ul> <li>Most industrial activity happens relatively close to shore.</li> <li>The extent and frequency of SAR acquisitions is determined by the mission priorities.</li> <li>For more info see: https://www.nature.com/articles/s41586-023-06825-8/figures/5</li> </ul> <li><strong>We do not provide detections of infrastructure within 1 km of shore</strong></li> <ul> <li>We do not classify objects within 1 km of shore because it is difficult to map where the shoreline begins, and ambiguous coastlines and rocks cause false positives.</li> <li>The bulk of industrial activities, including offshore development with medium-to-large oil rigs and wind farms, occur several kilometers from shore.</li> </ul> <li> <strong>False positives can be produced from noise artifacts.</strong> </li> <ul> <li>Rocks, small islands, sea ice, radar ambiguities (radar echoes), and image artifacts can cause false positives</li> <li>Detections in some areas including Southern Chile, the Arctic, and the Norwegian Sea have been filtered to remove noise.</li> </ul> <li><strong>Spatial coverage varies over time, which can produce different detections results year on year - <a target="_blank" href="https://share.cleanshot.com/yG0qfF"> <span style="color:rgb(0, 0, 0);">Example</span> </a></strong> </li> <ul> <li>Infrastructure detentions from 2017-01-01 to near real time are available, and updated on a monthly basis.</li> </ul> <li> <strong>Labels can change over time</strong> </li> <ul> <li>The label assigned to a structure is the greatest predicted label averaged across time. As we get more data, the label may change, and more accurately predict the true infrastructure type.</li> </ul> <li><strong>Global datasets aren’t perfect</strong></li> <ul> <li>We’ve done our best to create the most accurate product possible, but there will be infrastructure that isn’t detected, or has been classified incorrectly. This will be most evident when working at the project level.</li> <li>We strongly encourage users to provide feedback to the research team so that we may improve future versions of the model. All feedback is greatly appreciated.</li> </ul> </ul> <h2>Methods</h2> <h3>SAR imagery</h3> <p>We use SAR imagery from the Copernicus Sentinel-1 mission of the European Space Agency (ESA) [1]. The images are sourced from two satellites (S1A and S1B up until December 2021 when S1B stopped operating, and S1A only from 2022 onward) that orbit 180 degrees out of phase with each other in a polar, sun-synchronous orbit. Each satellite has a repeat-cycle of 12 days, so that together they provide a global mapping of coastal waters around the world approximately every six days for the period that both were operating. The number of images per location, however, varies greatly depending on mission priorities, latitude, and degree of overlap between adjacent satellite passes. Spatial coverage also varies over time [2]. Our data consist of dual-polarization images (VH and VV) from the Interferometric Wide (IW) swath mode, with a resolution of about 20 m.</p> <p>[1] <a target="_blank" href="https://sedas.satapps.org/wp-content/uploads/2015/07/Sentinel-1_User_Handbook.pdf"> <span style="color:rgb(0, 0, 0);">https://sedas.satapps.org/wp-content/uploads/2015/07/Sentinel-1_User_Handbook.pdf</span> </a> </p> <p>[2]<a target="_blank" href="https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-1/observation-scenario"> <span style="color:rgb(0, 0, 0);"></span> <span style="color:rgb(0, 0, 0);">https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-1/observation-scenario</span> </a> </p> <h3>Infrastructure detection by SAR</h3> <p>Detecting infrastructure with SAR is based on the widely used Constant False Alarm Rate (CFAR) algorithm, an anomaly detection method conceived for detecting ships in synthetic aperture radar images, that has been modified to remove non-stationary objects. This algorithm is designed to search for pixel values that are unusually bright (the targets) compared to those in the surrounding area (the sea clutter). This method sets a threshold based on the pixel values of the local background (within a window), scanning the whole image pixel-by-pixel. Pixel values above the threshold constitute an anomaly and are likely to be samples from a target.</p> <h3>Infrastructure classification</h3> <p>To classify every detected offshore infrastructure, we used deep learning and designed a ConvNet based on the ConvNeXt architecture. A novel aspect of our deep learning classification approach is the combination of SAR imagery from Sentinel-1 with optical imagery from Sentinel-2. From six-month composites of dual-band SAR (VH and VV) and four-band optical (RGB and NIR) images, we extracted small tiles for every detected fixed infrastructure, with the respective objects at the center of the tile. A single model output includes the probabilities for the specified classes: wind, oil, unknown, lake maracaibo, and noise.</p> <h3>Filtering</h3> <p>GFW post-processed the classified SAR detections to reduce noise (false positives), remove vessels, exclude areas with sea ice at high latitudes, and incorporate expert feedback. We used a clustering approach to identify detections across time (within a 50 m radius) that were likely the same structure but their coordinates differed slightly, and assigned them the greatest average predicted label of the cluster. We also filled in gaps for fixed structures that were missing in one timestep but detected in the previous and following timesteps, and dropped detections appearing in a single timestep. Finally, the dataset underwent extensive manual review and editing by researchers and industry experts in order to refine the final product, and provide the most accurate dataset possible.</p> <h3>Data field descriptions</h3> <p>Each detection has a unique individual identifier (<em>detection_id</em>). A six-month image composite is used in the classification, therefore the <em>detection_date</em> represents the middle of the six month period. This helps to remove non-stationary objects (i.e. vessels), and avoid confusion in the model if a structure is being built, or there isn’t adequate imagery available. <em>structure_id</em> allows you to track a structure through time. There are therefore many <em>detection_id</em> (one for each month the structure is detected) for each <em>structure_id</em>. Labels of <em>wind</em> and <em>oil </em>represent any wind or oil related structure respectively. <em>Unknown</em> represents a structure that is not oil or wind related, such as bridges or navigational buoys. </p> <p>Label confidence levels of ‘High’. ‘Medium’ and ‘Low’ are assigned to each structure, and are conditional on where the detections fell in relation to the boundaries of manually developed wind and oil polygons, and whether the label has changed from the previous month. The <em>label_confidence</em> field can be used to filter analysis. </p> <h2>Resources, code and other notes</h2> <p>Two repos are used in the automation process, both of which are private, and should not be shared publicly.</p> <p>Detection and classification: https://github.com/GlobalFishingWatch/sentinel-1-ee/tree/master</p> <p>Clustering and reclassification: https://github.com/GlobalFishingWatch/infrastructure-post-processing</p> <p>All code developed for the paper, Paolo, F.S., Kroodsma, D., Raynor, J. et al. Satellite mapping reveals extensive industrial activity at sea. Nature 625, 85–91 (2024). https://doi.org/10.1038/s41586-023-06825-8, including SAR detection, deep learning models, and analyses is open source and freely available at https://github.com/GlobalFishingWatch/paper-industrial-activity.</p> <h2>Sources data and citations</h2> <p>Copernicus Sentinel data 2017-current</p> <p>Lujala, Päivi; Jan Ketil Rød &amp; Nadia Thieme, 2007. \'Fighting over Oil: Introducing A New Dataset\', Conflict Management and Peace Science 24(3), 239-256</p> <p>Sabbatino, M., Romeo, L., Baker, V., Bauer, J., Barkhurst, A., Bean, A., DiGiulio, J., Jones, K., Jones, T.J., Justman, D., Miller III, R., Rose, K., and Tong., A., Global Oil &amp; Gas Infrastructure Features Database Geocube Collection, 2019-03-25, https://edx.netl.doe.gov/dataset/global-oil-gas-infrastructure-features-database-geocube-collection, DOI: 10.18141/1502839</p> <h2>License</h2> <p>Non-Commercial Use Only. The Site and the Services are provided for Non-Commercial use only in accordance with the CC BY-NC 4.0 license. If you would like to use the Site and/or the Services for commercial purposes, please contact us.</p> <h2>Global Fishing Watch metadata</h2> <p>Infrastructure development methods should reference the paper:</p> <p>Paolo, F.S., Kroodsma, D., Raynor, J. et al. Satellite mapping reveals extensive industrial activity at sea. Nature 625, 85–91 (2024). https://doi.org/10.1038/s41586-023-06825-8</p> <p>All code developed for the paper, including SAR detection, deep learning models, and analyses is open source and freely available at https://github.com/GlobalFishingWatch/paper-industrial-activity. All the data generated and used by these scripts can reference the following data repos:</p> <p>Analysis and Figures: https://doi.org/10.6084/m9.figshare.24309475</p> <p>Training and Evaluation: https://doi.org/10.6084/m9.figshare.24309469</p>'
      name: 'Offshore Fixed Infrastructure (SAR, Optical)'
      schema: {
        label: {
          enum: {
            oil: 'oil'
            unknown: 'unknown'
            wind: 'wind'
          }
          keyword: 'label'
        }
        label_confidence: {
          enum: {
            high: 'high'
            low: 'low'
            medium: 'medium'
          }
          keyword: 'label_confidence'
        }
        structure_end_date: 'structure_end_date'
        structure_id: 'structure_id'
        structure_start_date: 'structure_start_date'
      }
    }
    'public-fixed-infrastructure-filtered-v1.1': {
      description: '<h2>Overview</h2> <p>Offshore fixed infrastructure is a global dataset that uses AI and machine learning to detect and classify structures throughout the world’s oceans.</p> <p>Classification labels (oil, wind, and unknown) are provided, as well as confidence levels (high, medium, or low) reflecting our certainty in the assigned label. Detections can be filtered and colored on the map using both label and confidence level.<em></em>The data is updated on a monthly basis, and new classified detections are added at the beginning of every month. Viewing change using the timebar is simple, and allows anyone to recognize the rapid industrialization of the world’s oceans. For example, you can easily observe the expansion of wind farms in the North and East China Seas, or changes in oil infrastructure in the Gulf of Mexico or Persian Gulf.</p> <p>By overlaying the existing map layers, you can explore how vessels interact with oil and wind structures, visualise the density of synthetic aperture radar (SAR) and Visible Infrared Imaging Radiometer Suite (VIIRS) vessel detections around infrastructure, or determine which marine protected areas (MPAs) contain wind, oil, or other infrastructure types. These are only examples of the types of questions we can now ask. Offshore fixed infrastructure is a first of its kind dataset that not only brings to light the extensive industrialization of our oceans, but enables users across industries to use this information in research, monitoring and management.</p> <h2>Use cases</h2> <ul> <li>Maritime domain awareness</li> <ul> <li>Infrastructure locations can support maritime domain awareness, and understanding of other activities occurring at sea.</li> <li>Infrastructure data supports assessments of ocean industrialization, facilitating monitoring of areas experiencing build-up or new development</li> </ul> <li>Monitoring vessels</li> <ul> <li>Infrastructure locations can be used to analyse the behaviour of vessels associated with infrastructure, including grouping vessels based on their interaction with oil and wind structures.</li> <li>Interactions between vessels and infrastructure can help quantify the resources required to support offshore industrial activity</li> <li>The impacts of infrastructure on fishing, including attracting or deterring fishing, can be analysed.</li> </ul> <li>Marine protected areas (MPAs) and marine spatial planning</li> <ul> <li>During the planning stage in the designation of new protected areas, knowing the location of existing infrastructure will be vital to understand which stakeholders shall be included in the consultation process, to understand potential conflicts, and identify easy wins.</li> </ul> <li>Environmental impacts</li> <ul> <li>Infrastructure locations can be used to help detect marine pollution events, and to differentiate between types of pollution events (e.g. pollution from vessels versus pollution from platforms)</li> </ul> </ul> <h2>Caveats</h2> <ul> <li><strong>Sentinel-1 and Sentinel-2 satellites do not sample most of the open ocean.</strong></li> <ul> <li>Most industrial activity happens relatively close to shore.</li> <li>The extent and frequency of SAR acquisitions is determined by the mission priorities.</li> <li>For more info see: https://www.nature.com/articles/s41586-023-06825-8/figures/5</li> </ul> <li><strong>We do not provide detections of infrastructure within 1 km of shore</strong></li> <ul> <li>We do not classify objects within 1 km of shore because it is difficult to map where the shoreline begins, and ambiguous coastlines and rocks cause false positives.</li> <li>The bulk of industrial activities, including offshore development with medium-to-large oil rigs and wind farms, occur several kilometers from shore.</li> </ul> <li> <strong>False positives can be produced from noise artifacts.</strong> </li> <ul> <li>Rocks, small islands, sea ice, radar ambiguities (radar echoes), and image artifacts can cause false positives</li> <li>Detections in some areas including Southern Chile, the Arctic, and the Norwegian Sea have been filtered to remove noise.</li> </ul> <li><strong>Spatial coverage varies over time, which can produce different detections results year on year - <a target="_blank" href="https://share.cleanshot.com/yG0qfF"> <span style="color:rgb(0, 0, 0);">Example</span> </a></strong> </li> <ul> <li>Infrastructure detentions from 2017-01-01 to near real time are available, and updated on a monthly basis.</li> </ul> <li> <strong>Labels can change over time</strong> </li> <ul> <li>The label assigned to a structure is the greatest predicted label averaged across time. As we get more data, the label may change, and more accurately predict the true infrastructure type.</li> </ul> <li><strong>Global datasets aren’t perfect</strong></li> <ul> <li>We’ve done our best to create the most accurate product possible, but there will be infrastructure that isn’t detected, or has been classified incorrectly. This will be most evident when working at the project level.</li> <li>We strongly encourage users to provide feedback to the research team so that we may improve future versions of the model. All feedback is greatly appreciated.</li> </ul> </ul> <h2>Methods</h2> <h3>SAR imagery</h3> <p>We use SAR imagery from the Copernicus Sentinel-1 mission of the European Space Agency (ESA) [1]. The images are sourced from two satellites (S1A and S1B up until December 2021 when S1B stopped operating, and S1A only from 2022 onward) that orbit 180 degrees out of phase with each other in a polar, sun-synchronous orbit. Each satellite has a repeat-cycle of 12 days, so that together they provide a global mapping of coastal waters around the world approximately every six days for the period that both were operating. The number of images per location, however, varies greatly depending on mission priorities, latitude, and degree of overlap between adjacent satellite passes. Spatial coverage also varies over time [2]. Our data consist of dual-polarization images (VH and VV) from the Interferometric Wide (IW) swath mode, with a resolution of about 20 m.</p> <p>[1] <a target="_blank" href="https://sedas.satapps.org/wp-content/uploads/2015/07/Sentinel-1_User_Handbook.pdf"> <span style="color:rgb(0, 0, 0);">https://sedas.satapps.org/wp-content/uploads/2015/07/Sentinel-1_User_Handbook.pdf</span> </a> </p> <p>[2]<a target="_blank" href="https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-1/observation-scenario"> <span style="color:rgb(0, 0, 0);"></span> <span style="color:rgb(0, 0, 0);">https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-1/observation-scenario</span> </a> </p> <h3>Infrastructure detection by SAR</h3> <p>Detecting infrastructure with SAR is based on the widely used Constant False Alarm Rate (CFAR) algorithm, an anomaly detection method conceived for detecting ships in synthetic aperture radar images, that has been modified to remove non-stationary objects. This algorithm is designed to search for pixel values that are unusually bright (the targets) compared to those in the surrounding area (the sea clutter). This method sets a threshold based on the pixel values of the local background (within a window), scanning the whole image pixel-by-pixel. Pixel values above the threshold constitute an anomaly and are likely to be samples from a target.</p> <h3>Infrastructure classification</h3> <p>To classify every detected offshore infrastructure, we used deep learning and designed a ConvNet based on the ConvNeXt architecture. A novel aspect of our deep learning classification approach is the combination of SAR imagery from Sentinel-1 with optical imagery from Sentinel-2. From six-month composites of dual-band SAR (VH and VV) and four-band optical (RGB and NIR) images, we extracted small tiles for every detected fixed infrastructure, with the respective objects at the center of the tile. A single model output includes the probabilities for the specified classes: wind, oil, unknown, lake maracaibo, and noise.</p> <h3>Filtering</h3> <p>GFW post-processed the classified SAR detections to reduce noise (false positives), remove vessels, exclude areas with sea ice at high latitudes, and incorporate expert feedback. We used a clustering approach to identify detections across time (within a 50 m radius) that were likely the same structure but their coordinates differed slightly, and assigned them the greatest average predicted label of the cluster. We also filled in gaps for fixed structures that were missing in one timestep but detected in the previous and following timesteps, and dropped detections appearing in a single timestep. Finally, the dataset underwent extensive manual review and editing by researchers and industry experts in order to refine the final product, and provide the most accurate dataset possible.</p> <h3>Data field descriptions</h3> <p>Each detection has a unique individual identifier (<em>detection_id</em>). A six-month image composite is used in the classification, therefore the <em>detection_date</em> represents the middle of the six month period. This helps to remove non-stationary objects (i.e. vessels), and avoid confusion in the model if a structure is being built, or there isn’t adequate imagery available. <em>structure_id</em> allows you to track a structure through time. There are therefore many <em>detection_id</em> (one for each month the structure is detected) for each <em>structure_id</em>. Labels of <em>wind</em> and <em>oil </em>represent any wind or oil related structure respectively. <em>Unknown</em> represents a structure that is not oil or wind related, such as bridges or navigational buoys. </p> <p>Label confidence levels of ‘High’. ‘Medium’ and ‘Low’ are assigned to each structure, and are conditional on where the detections fell in relation to the boundaries of manually developed wind and oil polygons, and whether the label has changed from the previous month. The <em>label_confidence</em> field can be used to filter analysis. </p> <h2>Resources, code and other notes</h2> <p>Two repos are used in the automation process, both of which are private, and should not be shared publicly.</p> <p>Detection and classification: https://github.com/GlobalFishingWatch/sentinel-1-ee/tree/master</p> <p>Clustering and reclassification: https://github.com/GlobalFishingWatch/infrastructure-post-processing</p> <p>All code developed for the paper, Paolo, F.S., Kroodsma, D., Raynor, J. et al. Satellite mapping reveals extensive industrial activity at sea. Nature 625, 85–91 (2024). https://doi.org/10.1038/s41586-023-06825-8, including SAR detection, deep learning models, and analyses is open source and freely available at https://github.com/GlobalFishingWatch/paper-industrial-activity.</p> <h2>Sources data and citations</h2> <p>Copernicus Sentinel data 2017-current</p> <p>Lujala, Päivi; Jan Ketil Rød &amp; Nadia Thieme, 2007. \'Fighting over Oil: Introducing A New Dataset\', Conflict Management and Peace Science 24(3), 239-256</p> <p>Sabbatino, M., Romeo, L., Baker, V., Bauer, J., Barkhurst, A., Bean, A., DiGiulio, J., Jones, K., Jones, T.J., Justman, D., Miller III, R., Rose, K., and Tong., A., Global Oil &amp; Gas Infrastructure Features Database Geocube Collection, 2019-03-25, https://edx.netl.doe.gov/dataset/global-oil-gas-infrastructure-features-database-geocube-collection, DOI: 10.18141/1502839</p> <h2>License</h2> <p>Non-Commercial Use Only. The Site and the Services are provided for Non-Commercial use only in accordance with the CC BY-NC 4.0 license. If you would like to use the Site and/or the Services for commercial purposes, please contact us.</p> <h2>Global Fishing Watch metadata</h2> <p>Infrastructure development methods should reference the paper:</p> <p>Paolo, F.S., Kroodsma, D., Raynor, J. et al. Satellite mapping reveals extensive industrial activity at sea. Nature 625, 85–91 (2024). https://doi.org/10.1038/s41586-023-06825-8</p> <p>All code developed for the paper, including SAR detection, deep learning models, and analyses is open source and freely available at https://github.com/GlobalFishingWatch/paper-industrial-activity. All the data generated and used by these scripts can reference the following data repos:</p> <p>Analysis and Figures: https://doi.org/10.6084/m9.figshare.24309475</p> <p>Training and Evaluation: https://doi.org/10.6084/m9.figshare.24309469</p>'
      name: 'Offshore Fixed Infrastructure (SAR, Optical)'
      schema: {
        label: {
          enum: {
            oil: 'oil'
            unknown: 'unknown'
            wind: 'wind'
          }
          keyword: 'label'
        }
        label_confidence: {
          enum: {
            high: 'high'
            low: 'low'
            medium: 'medium'
          }
          keyword: 'label_confidence'
        }
        structure_end_date: 'structure_end_date'
        structure_id: 'structure_id'
        structure_start_date: 'structure_start_date'
      }
    }
    'public-gfcm-fao': {
      description: 'A fisheries restricted area (FRA) is a geographically defined area in which some specific fishing activities are temporarily or permanently banned or restricted in order to improve the exploitation patterns and conservation of specific stocks as well as of habitats and deep-sea ecosystems. In the Mediterranean and the Black Sea, 1,760,000 square kilometers of sea habitats are protected by ten FRAs established by the GFCM. This includes one large deep-water FRA (1,730,000 square kilometers) in which the use of towed dredges and trawl nets in all waters deeper than 1000 metres is banned to protect deep-sea benthic habitats. The layer was taken from the GFCM website but manually adjusted to reflect the original coordinates of the FRAs as stipulated in the document REC. GFCM/29/2005/1.'
      name: 'GFCM FAO'
    }
    'public-global-all-tracks': {
      description: 'The dataset contains the tracks from all vessels (AIS) - Version 3.0'
      name: 'Tracks'
      schema: {
        speed: {
          enum: {
            '0': '0'
            '20': '20'
          }
          keyword: 'speed'
        }
      }
    }
    'public-global-all-vessels': {
      description: 'Vessels from AIS'
      name: 'AIS (All Vessels)'
      schema: {
        source: 'source'
      }
    }
    'public-global-bathymetry': {
      description: "<h2>Overview</h2>\n<ul>\n<li>Bathymetry is the measurement of water depth and provides details of the physical features of the ocean floor. This gridded bathymetric dataset is a continuous global terrain model that provides elevation data for the ocean in meters on a 15 arc-second interval grid.</li>\n <li>Disclaimer:\nThe bathymetry layer shown on the map is based on gridded data from GEBCO and represents average depth values per tile, calculated in meters. These tiles are at a coarser resolution, so the depth shown may differ from the specific value at a point where you click. For example, if you click on a vessel track within the 50-meter isoline, the depth shown at that point may not exactly match the tile's average due to differences in resolution.\nKeep in mind that bathymetry datasets are generalized and may not reflect precise seafloor conditions at fine scales. Use caution when interpreting these values for regulatory or analytical purposes. \n\n If you require finer detail, you can also upload your own bathymetry polygons for a more precise analysis.</li> \n\n <ul>\n<h2>Source</h2>\n<ul>\n <a href='https://www.gebco.net/data_and_products/gridded_bathymetry_data/#global'>GEBCO Compilation Group (2023) GEBCO 2023 Grid (doi:10.5285/f98b053b-0cbc-6c23-e053-6c86abc0af7b).</a></li>"
      name: 'Bathymetry'
    }
    'public-global-carrier-vessels': {
      description: 'Carriers from AIS'
      name: 'AIS (Carrier Vessels)'
    }
    'public-global-chlorophyl': {
      description: "<h2>Overview</h2>\n<ul>\n<li>Chlorophyll-a is the light-harvesting pigment found in all photosynthetic plants. Marine phytoplankton chemically fix carbon through photosynthesis by taking in dissolved carbon dioxide and producing oxygen. This dataset is comprised of biogeochemical parameters, including chlorophyll, over the global ocean displayed with a 1/4 degree horizontal resolution.</li>\n<ul>\n<h2>Source</h2>\n<ul>\n <a href='https://doi.org/10.48670/moi-00015'>Generated using E.U. Copernicus Marine Service Information; https://doi.org/10.48670/moi-00015.</a></li>"
      name: 'Chlorophyll-a concentration'
    }
    'public-global-chlorophyl-max': {
      description: "Chlorophyll-a is the light-harvesting pigment found in all photosynthetic plants. Its concentration in the ocean is used as an index of phytoplankton biomass and, as such, is a key input to primary productivity models. The moderate resolution imaging spectroradiometer (MODIS) instrument aboard NASA's Terra and Aqua satellites measures ocean color every day, from which global chlorophyll-a concentrations are derived. Ocean phytoplankton chemically fix carbon through photosynthesis, taking in dissolved carbon dioxide and producing oxygen. Through this process, marine plants capture about an equal amount of carbon as does photosynthesis by land vegetation. Changes in the amount of phytoplankton indicate the change in productivity of the oceans and provide a key ocean link for global climate change monitoring. Scientists use chlorophyll in modeling Earth's biogeochemical cycles such as the carbon cycle or the nitrogen cycle. Additionally, on short time scales, chlorophyll can be used to trace oceanographic currents, jets, and plumes. The 1 kilometer resolution and nearly daily global coverage of the MODIS data thus allows scientists to observe mesoscale oceanographic features in coastal and estuarine environments, which are of increasing importance in marine science studies. Source: NASA Earth Observations."
      name: 'Chlorophyll-a concentration'
    }
    'public-global-chlorophyl-min': {
      description: "Chlorophyll-a is the light-harvesting pigment found in all photosynthetic plants. Its concentration in the ocean is used as an index of phytoplankton biomass and, as such, is a key input to primary productivity models. The moderate resolution imaging spectroradiometer (MODIS) instrument aboard NASA's Terra and Aqua satellites measures ocean color every day, from which global chlorophyll-a concentrations are derived. Ocean phytoplankton chemically fix carbon through photosynthesis, taking in dissolved carbon dioxide and producing oxygen. Through this process, marine plants capture about an equal amount of carbon as does photosynthesis by land vegetation. Changes in the amount of phytoplankton indicate the change in productivity of the oceans and provide a key ocean link for global climate change monitoring. Scientists use chlorophyll in modeling Earth's biogeochemical cycles such as the carbon cycle or the nitrogen cycle. Additionally, on short time scales, chlorophyll can be used to trace oceanographic currents, jets, and plumes. The 1 kilometer resolution and nearly daily global coverage of the MODIS data thus allows scientists to observe mesoscale oceanographic features in coastal and estuarine environments, which are of increasing importance in marine science studies. Source: NASA Earth Observations."
      name: 'Chlorophyll-a concentration'
    }
    'public-global-currents-uo': {
      description: 'Currents eastward component'
      name: 'Currents'
    }
    'public-global-currents-vo': {
      description: 'Currents northward component'
      name: 'Currents'
    }
    'public-global-encounters-events': {
      description: '<h2>Overview</h2> <h3> Encounter events identify instances where two vessels appear to meet at sea. </h3> <ul> <p> Global Fishing Watch classifies an event as an encounter when two vessels are detected: </p> <li>Within 500 meters of one another</li> <li>For a duration of at least 2 hours</li> <li>Traveling at a median speed of less than 2 knots</li> <li> And located at least 10 kilometers (5.4 nautical miles) from a coastal anchorage. </li> </ul> <ul> <p> Users can filter encounter events by vessel characteristics and context, including: </p> <li>Duration of encounter</li> <li> Vessel flag - Shows encounters where at least one vessel is flagged to the selected country </li> <li> Next port visit after the encounter - Shows encounters where at least one vessel is has visited the selected port(s) </li> <li>Vessel types involved in the encounter</li> <li>User saved vessel group</li> </ul> <ul> <p>Currently displayed encounter types include:</p> <li>Carrier ⇄ Bunker (experimental)</li> <li>Carrier ⇄ Fishing</li> <li>Fishing ⇄ Bunker (experimental)</li> <li>Fishing ⇄ Fishing (experimental)</li> <li>Support ⇄ Fishing</li> </ul> <p> To view more details about a specific encounter—such as its location or the identity of the encountered vessel—click the “See more” icon associated with the event. </p> <h2>Caveats</h2> <ul> <li> Global Fishing Watch events are the result of rule-based algorithms being applied to AIS positional data. There are many potential reasons for vessels to meet at sea. Such interactions may include transshipment of catch or supplies, equipment transfers, crew changes, safety-related matters, and more. Encounter data should therefore be viewed as an indicator for review. </li> <li> Encounters that do not meet the specifications of GFW encounter events described above are not included in the map, such as encounters less than two hours and in-port encounters. </li> <li> Encounters between the same two vessels occurring within a 4-hour window are consolidated into a single encounter event. While multiple encounters within such a short timeframe are possible, they remain exceptionally rare. </li> <li> The 500-meter proximity threshold is calculated using implied positions—not raw AIS messages. Since AIS transmissions occur at irregular intervals, vessel positions are estimated by a 10-minute time grid using reported course and speed. Proximity is then calculated based on these estimated positions. Due to this modeling approach, it is possible that vessels identified in an encounter may not have been physically within 500 meters of each other for the entire 2-hour period. </li> <li> Bias in vessel identification and gear classification can result in the unexpected presence or absence of an encounter. Misclassifications in vessel type may occur due to inconsistent or incomplete vessel registry data. Misclassifications can also happen when algorithms struggle to appropriately categorize vessels, for instance, where vessels use several gears (thus changing their behavioral patterns) or when a vessel’s MMSI (maritime mobile service identity) number is used by more than one vessel. </li> <li> An encounter event position may not align exactly with the vessels\' tracks. Global Fishing Watch determines a single location for each event by calculating the average latitude and longitude of all positions within the event. As a result it is possible the vessels never occupied that precise location during the encounter event. </li> <li> Global Fishing Watch recommends to visually inspect vessel tracks, always refer to additional data source and/or information, and request records from a vessel to confirm any findings, as part of the users’ due diligence process. </li> </ul> <h2>Learn more</h2> <p> You can read more about transshipment behaviour from our <a href="http://globalfishingwatch.org/wp-content/uploads/GlobalViewOfTransshipment_Aug2017.pdf" >report</a > or <a href="https://www.frontiersin.org/articles/10.3389/fmars.2018.00240/full" >scientific publication</a >. </p>'
      name: 'Encounter Events. (AIS)'
      schema: {
        duration: {
          enum: {
            '2': '2'
            '48': '48'
          }
          keyword: 'duration'
        }
        encounter_type: {
          enum: {
            'CARRIER-BUNKER': 'CARRIER-BUNKER'
            'CARRIER-FISHING': 'CARRIER-FISHING'
            'FISHING-BUNKER': 'FISHING-BUNKER'
            'FISHING-CARRIER': 'FISHING-CARRIER'
            'FISHING-FISHING': 'FISHING-FISHING'
            'FISHING-SUPPORT': 'FISHING-SUPPORT'
            'SUPPORT-FISHING': 'SUPPORT-FISHING'
          }
          keyword: 'encounter_type'
        }
        next_port_id: 'next_port_id'
      }
    }
    'public-global-encounters-events-carriers-fishing': {
      description: 'The dataset contains encounter events for AIS (Carriers-Fishing)'
      name: 'Encounter Events for Carriers-Fishing Vessels (AIS)'
    }
    'public-global-fishing-effort': {
      description: 'Global Fishing Watch uses data about a vessel’s identity, type, location, speed, direction and more that is broadcast using the Automatic Identification System (AIS) and collected via satellites and terrestrial receivers. AIS was developed for safety/collision-avoidance. Global Fishing Watch analyzes AIS data collected from vessels that our research has identified as known or possible commercial fishing vessels, and applies a fishing presence algorithm to determine “apparent fishing activity” based on changes in vessel speed and direction. The algorithm classifies each AIS broadcast data point for these vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch fishing activity heat map. AIS data as broadcast may vary in completeness, accuracy and quality. Also, data collection by satellite or terrestrial receivers may introduce errors through missing or inaccurate data. Global Fishing Watch’s fishing presence algorithm is a best effort mathematically to identify “apparent fishing activity.” As a result, it is possible that some fishing activity is not identified as such by Global Fishing Watch; conversely, Global Fishing Watch may show apparent fishing activity where fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies designations of vessel fishing activity, including synonyms of the term “fishing activity,” such as “fishing” or “fishing effort,” as “apparent,” rather than certain. Any/all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at your own risk. Global Fishing Watch is taking steps to make sure fishing activity designations are as accurate as possible. Global Fishing Watch fishing presence algorithms are developed and tested using actual fishing event data collected by observers, combined with expert analysis of vessel movement data resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and automated classification techniques.'
      name: 'AIS fishing bq'
      schema: {
        bearing: 'bearing'
        distance_from_port_km: {
          enum: {
            '0': '0'
            '1': '1'
            '2': '2'
            '3': '3'
            '4': '4'
            '5': '5'
          }
          keyword: 'distance_from_port_km'
        }
        speed: 'speed'
      }
    }
    'public-global-fishing-events': {
      description: 'The dataset contains fishing events for AIS'
      name: 'Fishing Events (AIS)'
      schema: {
        type: {
          enum: {
            CARGO: 'CARGO'
            CARRIER: 'CARRIER'
            DISCREPANCY: 'DISCREPANCY'
            FISHING: 'FISHING'
            GEAR: 'GEAR'
            OTHER: 'OTHER'
            PASSENGER: 'PASSENGER'
            SEISMIC_VESSEL: 'SEISMIC_VESSEL'
            SUPPORT: 'SUPPORT'
          }
          keyword: 'type'
        }
      }
    }
    'public-global-fishing-vessels': {
      description: 'Vessels from AIS'
      name: 'AIS (Fishing Vessels)'
      schema: {
        source: 'source'
      }
    }
    'public-global-gaps-events': {
      description: 'The dataset contains gaps events for AIS'
      name: 'Disabling Events (AIS)'
    }
    'public-global-loitering-events': {
      description: '<h2>Overview</h2> <h3> Loitering events identify when a vessel is operating away from shore while moving at low speeds. Loitering events highlight when a vessel is behaving in a manner consistent with a potential encounter event (i.e. stationary or drifting slowly at sea) but no encountering vessel is visible on AIS. As such, these should not be considered indicators of likely encounter events, but rather periods of time when undetected encounters could have potentially occurred. </h3> <ul> <p>Global Fishing Watch classifies an event as a loitering event when:</p> <li> The vessel is located more than 20 nautical miles (37.04 kilometers) from shore, and </li> <li>Maintains an average speed of less than 2 knots,</li> <li>For a continuous period of at least 1 hour.</li> </ul> <h2>Caveats</h2> <ul> <li> Global Fishing Watch events are the result of a rule-based algorithm being applied to AIS positional data. Loitering events should be cross-verified with other sources of information (like RFMO transshipment records) when possible. </li> <li> Vessels in loitering events may not be meeting any other vessels at the time of the event. Other events in which a vessel may remain fairly stationary or moving slowly while at sea include: maintenance, losing vessel power, idling during poor weather, waiting outside of port for permission to dock, normal fishing behavior, and more. </li> <li> Due to the individual definitions of loitering events, fishing events, and encounter events, it is possible for a single vessel movement pattern to trigger multiple event types. </li> <li> A loitering event position may not align exactly with the vessel’s tracks. Global Fishing Watch determines a single location for each event by calculating the average latitude and longitude of all positions within that event. As a result it is possible the vessel never occupied that precise location during the event. </li> <li> Global Fishing Watch recommends to visually inspect vessel tracks, always refer to additional data source and/or information, and request records from a vessel to confirm any findings, as part of the users’ due diligence process. </li> </ul> <h2>Learn more</h2> <p> Learn more about considerations of using AIS data by looking at the <a href="https://globalfishingwatch.org/data-documentation/apparent-fishing-events-ais/" >AIS limitations section in the Apparent fishing events (AIS) data documentation.</a >. </p>'
      name: 'Loitering Events (AIS)'
      schema: {
        duration: {
          enum: {
            '0': '0'
            '48': '48'
          }
          keyword: 'duration'
        }
        next_port_id: 'next_port_id'
        type: {
          enum: {
            CARGO: 'CARGO'
            CARRIER: 'CARRIER'
            DISCREPANCY: 'DISCREPANCY'
            FISHING: 'FISHING'
            GEAR: 'GEAR'
            OTHER: 'OTHER'
            PASSENGER: 'PASSENGER'
            SEISMIC_VESSEL: 'SEISMIC_VESSEL'
            SUPPORT: 'SUPPORT'
          }
          keyword: 'type'
        }
      }
    }
    'public-global-loitering-events-carriers': {
      description: 'The dataset contains loitering events for AIS (Carriers).'
      name: 'Loitering Events for Carriers Vessels (AIS)'
    }
    'public-global-nitrate': {
      description: "<h2>Overview</h2>\n<ul>\n<li>Nitrate is required by marine plants for photosynthesis and is a major nutrient for the ocean's productivity, but high concentrations can be an indicator of pollution. This dataset is comprised of biogeochemical parameters, including nitrate, over the global ocean displayed with a 1/4 degree horizontal resolution.</li>\n<ul>\n<h2>Source</h2>\n<ul>\n <a href='https://doi.org/10.48670/moi-00015'>Generated using E.U. Copernicus Marine Service Information; https://doi.org/10.48670/moi-00015.</a></li>\""
      name: 'Nitrate concentration (NO3)'
    }
    'public-global-other-vessels': {
      description: 'Other vessels from AIS'
      name: 'AIS (Other Vessels)'
      schema: {
        source: 'source'
      }
    }
    'public-global-oxygen': {
      description: "<h2>Overview</h2>\n<ul>\n<li>Dissolved oxygen is the amount of oxygen present in water and is crucial for the growth and survival of marine organisms. Warming ocean temperatures can lead to an expansion of low oxygen zones, which can impact the distribution and abundance of marine life. This dataset is comprised of biogeochemical parameters, including dissolved oxygen, over the global ocean displayed with a 1/4 degree horizontal resolution.</li>\n<ul>\n<h2>Source</h2>\n<ul>\n <a href='https://doi.org/10.48670/moi-00015'>Generated using E.U. Copernicus Marine Service Information; https://doi.org/10.48670/moi-00015.</a></li>"
      name: 'Oxygen concentration (O2)'
    }
    'public-global-ph': {
      description: "<h2>Overview</h2>\n<ul>\n<li>The acidity of the ocean is measured by pH. Increased carbon dioxide absorption has lowered the ocean's pH, resulting in ocean acidification which can have wide-ranging impacts on marine organisms. This dataset is comprised of biogeochemical parameters, including pH, over the global ocean displayed with a 1/4 degree horizontal resolution.</li>\n<ul>\n<h2>Source</h2>\n<ul>\n <a href='https://doi.org/10.48670/moi-00015'>Generated using E.U. Copernicus Marine Service Information; https://doi.org/10.48670/moi-00015.</a></li>"
      name: 'potential of hydrogen (PH)'
    }
    'public-global-phosphate': {
      description: "<h2>Overview</h2>\n<ul>\n<li>Phosphate is a major nutrient for marine foodwebs and ocean productivity, but high concentrations can also be an indicator of pollution. This dataset is comprised of biogeochemical parameters, including phosphate, over the global ocean displayed with a 1/4 degree horizontal resolution.</li>\n<ul>\n<h2>Source</h2>\n<ul>\n <a href='https://doi.org/10.48670/moi-00015'>Generated using E.U. Copernicus Marine Service Information; https://doi.org/10.48670/moi-00015.</a></li>"
      name: 'Phosphate concentration (PO4)'
    }
    'public-global-port-visits-events': {
      description: '<h2>Overview</h2> <ul> <p> Global Fishing Watch detects vessel movements in and out of ports and classifies them into four distinct port event types: </p> <li>Port entry</li> <li>Port stop</li> <li>Port gap (a gap in AIS transmission while in port)</li> <li>Port exit</li> </ul> <p> These events are grouped to form port visit events, which represent a vessel’s presence at port based on AIS activity patterns. </p> <p> In the Global Fishing Watch map, only high-confidence port visits are shown. A port visit is determined with high confidence when a vessel is detected with a port entry, stop or gap, and exit. More specifically: </p> <p>A port visit is shown on the map when AIS data shows a vessel:</p> <ul> <li>Entering within 3 kilometers of an anchorage point at the port entry,</li> <li>Exiting within 4 kilometers of a known port exit, and either:</li> <ul> <li> Experiencing a port gap (i.e. no AIS transmissions for 4 hours or more, which may indicate AIS was turned off while in port), or </li> <li> Undergoing a port stop, where the vessel’s speed drops below 0.2 knots and later increases above 0.5 knots. </li> </ul> </ul> <p> Port stops are used to distinguish actual port visits from coastal transits. </p> <h2>Caveats</h2> <ul> <li> Lower-confidence port visits—often caused by noisy, sparse, or incomplete AIS transmissions—are currently excluded from the map. Lower-confidence port visits, while sometimes legitimate, can falsely suggest a port visit that did not occur. </li> <li> Ongoing port visits will not be identified on the map, as a port exit is required by definition for high-confidence port visits to be detected. </li> <li> Additionally, note that the Global Fishing Watch anchorages dataset may not capture all actual anchorage locations, which could lead to missing port events. Refer to the learn more section for a full list of anchorages. </li> <li> Global Fishing Watch recommends to verify port visits, always refer to additional data source and/or information, and request records from a vessel to confirm any findings, as part of the users’ due diligence process. </li> </ul> <h2>Learn more</h2> <p> <a href="https://globalfishingwatch.org/datasets-and-code-anchorages/" >Learn more about anchorages, ports and voyages.</a > </p> <p> Learn more about considerations of using AIS data by looking at the <a href="https://globalfishingwatch.org/data-documentation/apparent-fishing-events-ais/" >AIS limitations section in the Apparent fishing events (AIS) data documentation.</a >.'
      name: 'Port Visits Events (AIS)'
      schema: {
        duration: {
          enum: {
            '2': '2'
            '48': '48'
          }
          keyword: 'duration'
        }
        type: {
          enum: {
            CARGO: 'CARGO'
            CARRIER: 'CARRIER'
            DISCREPANCY: 'DISCREPANCY'
            FISHING: 'FISHING'
            GEAR: 'GEAR'
            OTHER: 'OTHER'
            PASSENGER: 'PASSENGER'
            SEISMIC_VESSEL: 'SEISMIC_VESSEL'
            SUPPORT: 'SUPPORT'
          }
          keyword: 'type'
        }
      }
    }
    'public-global-ports-footprint': {
      description: 'Anchorages footprint using the convex hull grouped by portId'
      name: 'Anchorages convex hulls by portId'
      schema: {
        area: 'area'
        label: {
          enum: {}
          keyword: 'label'
        }
        perimeter: 'perimeter'
      }
    }
    'public-global-presence': {
      description: "Global Fishing Watch uses data about a vessel’s identity, type, location, speed, direction and more that is broadcast using the Automatic Identification System (AIS) and collected via satellites and terrestrial receivers. AIS was developed for safety/collision-avoidance. Global Fishing Watch analyzes AIS data collected from vessels that our research has identified as carriers. The activity layer displays a heatmap of vessel presence. The presence is determined by taking one position per day per vessel from the positions transmitted by the vessel's AIS."
      name: 'AIS'
      schema: {
        bearing: 'bearing'
        speed: {
          enum: {
            '10-15': '10-15'
            '15-25': '15-25'
            '2-4': '2-4'
            '4-6': '4-6'
            '6-10': '6-10'
            '<2': '<2'
            '>25': '>25'
          }
          keyword: 'speed'
        }
      }
    }
    'public-global-presence-tracks': {
      description: 'The dataset contains the tracks from all vessels (AIS) - Version 20201001'
      name: 'Tracks'
      schema: {
        speed: {
          enum: {
            '0': '0'
            '20': '20'
          }
          keyword: 'speed'
        }
      }
    }
    'public-global-salinity': {
      description: "<h2>Overview</h2>\n<ul>\n<li>Sea surface salinity is the measurement of salt concentration at the ocean surface. It determines the density of ocean water along with temperature and is a key parameter to estimate the ocean's influence on climate. This dataset salinity is displayed with a 1/12 degree horizontal resolution.</li>\n<ul>\n<h2>Source</h2>\n<ul>\n <a href='https://doi.org/10.48670/moi-00016'>Generated using E.U. Copernicus Marine Service Information; https://doi.org/10.48670/moi-00016.</a></li>"
      name: 'Surface Salinity'
    }
    'public-global-sar-footprints': {
      description: 'SAR'
      name: 'SAR Footprints'
    }
    'public-global-sar-presence': {
      description: '<h2>Overview</h2>\n<p>Satellite synthetic aperture radar (SAR) is a spaceborne radar imaging system that can detect at-sea vessels and structures in any weather conditions. Microwave pulses are transmitted by a satellite-based antenna towards the Earth surface. The microwave energy scattered back to the spacecraft is then measured and integrated to form a “backscatter” image. The SAR image contains rich information about the different objects on the water, such as their size, orientation and texture. SAR imaging systems overcome most weather conditions and illumination levels, including clouds or rain due to the cloud penetrating property of microwaves, and daylight or darkness due to radar being an “active” sensor (it shoots and records back its own energy). SAR gives an advantage over some other “passive” satellite sensors, such as electro-optical imagery, consisting of a satellite-based camera recording the sunlight/infrared radiation reflected from/emitted by objects on the ground. This latter method can be confounded by cloud cover, haze, weather events and seasonal darkness at high latitudes.</p>\n<h2>Use cases</h2>\n<ul>\n <li>Monitor vessel presence (both fishing and non-fishing) in areas of interest such as marine protected areas (MPAs), exclusive economic zones (EEZs), inshore exclusion zones (IEZs) and Regional Fisheries Management Organisations (RFMOs).</li>\n <li>Assess presence of vessels that don’t show up on cooperative tracking systems—including automatic identification system (AIS) and vessel monitoring system (VMS)—near vulnerable marine ecosystems and essential fish habitats.</li>\n</ul>\n<h2>Limitations</h2>\n<ul>\n <li><b>Sentinel-1 SAR data does not sample most of the open ocean.</b></li>\n <ul>\n <li>Sentinel-1 does not sample most of the open ocean. However, the vast majority of industrial activity is close to shore. Also, farther from shore, more fishing vessels use AIS (60-90%), far more than the average for all fishing vessels (about 25%). Thus, for most of the world, our detection data complemented by AIS will capture the vast majority of human activity in the global ocean.</li>\n </ul>\n <li><b>False positives can be produced from image artifacts (noise).</b></li>\n <li><b>We do not provide detections of vessels 1 kilometer from shore as it’s difficult to accurately map where the shoreline begins.</b></li>\n <ul>\n <li>We do not include objects within 1 km of shore because of ambiguous coastlines and rocks. Nor do we include objects in much of the Arctic and Antarctic, where sea ice can create too many false positives; in both regions, however, vessel traffic is either very low (Antarctic) or in countries that have a high adoption of AIS (northern European or northern North American countries). The bulk of industrial activities occur several kilometers from shore, such as fishing along the continental shelf break, ocean transport over shipping lanes, and offshore development on medium-to-large oil rigs and wind farms. Also, much of the vessel activity within 1 km of shore is by smaller boats such as pleasure crafts.</li>\n </ul>\n <li><b>Vessel detection by SAR imagery is limited primarily by the resolution of the images (~20 m in the case of Sentinel-1 IW GRD products).</b></li>\n <ul>\n <li>As a result, we miss most vessels under 15 m in length, although an object smaller than a pixel can still be seen if it is a strong reflector, such as a vessel made of metal rather than wood or fiberglass. Especially for smaller vessels (25 m), detection also depends on wind speed and the state of the ocean, as a rougher sea surface will produce higher backscatter, making it difficult to separate a small target from the sea clutter. Conversely, the higher the radar incidence angle, the higher the probability of detection, as less backscatter from the background will be received by the antenna. The vessel orientation relative to the satellite antenna also matters, as a vessel perpendicular to the radar line of sight will have a larger backscatter cross section, increasing the probability of being detected.</li>\n </ul>\n <li><b>Vessel length estimates are limited by the quality of ground truth data</b></li>\n <ul>\n <li>Although we selected only high-confidence AIS-SAR matches to construct our training data, we found that some AIS records contained an incorrectly reported length. These errors, however, resulted in only a small fraction of imprecise training labels, and deep learning models can accommodate some noise in the training data.</li>\n </ul>\n <li><b>Not all geographies are covered equally</b></li>\n <ul>\n <li>Our fishing classification may be less accurate in certain regions. In areas of high traffic from pleasure crafts and other service boats, such as near cities in some countries and in the fjords of Norway and Iceland, some of these smaller craft might be misclassified as fishing vessels. Conversely, some misclassification of fishing vessels as non-fishing vessels is expected in areas where all activity is not publicly shared. More importantly, however, is that many industrial fishing vessels are between 10 and 20 meters in length, and the detection capability of our model falls off quickly within these lengths. As a result, the total number of industrial fishing vessels is likely significantly higher than what we detect.</li>\n <li>Our data likely underestimates the concentration of fishing in some regions, where we see areas of vessel activity being "cut off" by the edge of the Sentinel-1 footprint and we miss very small vessels (e.g., most artisanal fishing) that are less likely to carry AIS devices.</li>\n </ul>\n</ul>\n<h2>Methods</h2>\n<h3>SAR imagery</h3>\n<p>We use SAR imagery from the Copernicus Sentinel-1 mission of the European Space Agency (ESA) [1]. The images are sourced from two satellites (S1A and S1B up until December 2021 when S1B stopped operating, and S1A only from 2022 onward) that orbit 180 degrees out of phase with each other in a polar, sun-synchronous orbit. Each satellite has a repeat-cycle of 12 days, so that together they provide a global mapping of coastal waters around the world approximately every six days for the period that both were operating. The number of images per location, however, varies greatly depending on mission priorities, latitude, and degree of overlap between adjacent satellite passes. Spatial coverage also varies over time [2]. Our data consist of dual-polarization images (VH and VV) from the Interferometric Wide (IW) swath mode, with a resolution of about 20 m.</p>\n<p>[1]\n <a target="_blank" href="https://sedas.satapps.org/wp-content/uploads/2015/07/Sentinel-1_User_Handbook.pdf">\n <span style="color:rgb(0, 0, 0);">https://sedas.satapps.org/wp-content/uploads/2015/07/Sentinel-1_User_Handbook.pdf</span>\n </a>\n</p>\n<p>[2]<a target="_blank" href="https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-1/observation-scenario">\n <span style="color:rgb(0, 0, 0);"></span>\n <span style="color:rgb(0, 0, 0);">https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-1/observation-scenario</span>\n </a>\n</p>\n<h3>Detection footprints</h3>\n<p>Detection footprints are areas within each satellite scan (or scene) that our system uses to perform detections. These filters help to keep relevant detections and exclude data that may be inaccurate. Detection footprints are smaller than the total scene as they exclude any land areas and islands, and exclude a 500 meter buffer from the boundaries of the scene and a 1 kilometer buffer from shorelines.</p>\n<h3>Filtering</h3>\n<p>GFW has post-processed the SAR detections to reduce noise (false positives), remove offshore infrastructure from this layer focused on vessels, and exclude areas with sea ice at high latitudes.</p>\n<h3>Vessel detection by SAR</h3>\n<p>Detecting vessels with SAR is based on an known as Constant False Alarm Rate (CFAR), a threshold algorithm used for anomaly detection in radar imagery. This algorithm is designed to search for pixel values that are unusually bright (the targets) compared to those in the surrounding area (the sea clutter). This method sets a threshold based on the pixel values of the local background (within a window), scanning the whole image pixel-by-pixel. Pixel values above the threshold constitute an anomaly and are likely to be samples from a target, and therefore are included as a detection.</p>\n<h3>Vessel presence and length estimation</h3>\n<p>To estimate the length of every detected object and also to identify when our CFAR algorithm made false detections, we designed a deep convolutional neural network (ConvNet) based on the modern ResNet (Residual Networks) architecture. This single-input/multi-output ConvNet takes dual-band SAR image tiles of 80 by 80 pixels as input, and outputs the probability of object presence (known as a “binary classification task”) and the estimated length of the object (known as a “regression task”).</p>\n<h3>Fishing and non-fishing classification</h3>\n<p>To identify whether a detected vessel was a fishing or non-fishing vessel we use a machine learning model. For this classification task we used a ConvNeXt architecture modified to process the following two inputs: the estimated length of the vessel from SAR (a scalar quantity) and a stack of environmental rasters centered at the vessel’s location (a multi-channel image). This multi-input-mixed-data/single-output model passes the raster stack (11 channels) through a series of convolutional layers and combines the resulting feature maps with the vessel length value to perform a binary classification: fishing or non-fishing.&nbsp;</p>\n<p>The environmental layers used to differentiate between fishing and non-fishing include:</p>\n<ol>\n <li>vessel density (based on SAR)</li>\n <li>average vessel length (based on SAR)</li>\n <li>bathymetry</li>\n <li>distance from port</li>\n <li>hours of non-fishing vessel presence, under 50 m (from AIS)</li>\n <li>hours of non-fishing vessel presence, over 50 m (from AIS)</li>\n <li>average surface temperature</li>\n <li>average current speed</li>\n <li>standard deviation of daily temperature</li>\n <li>standard deviation of daily current speed</li>\n <li>average chlorophyll</li>\n</ol>\n<h3>AIS matching and vessel identity</h3>\n<p>AIS data can reveal the identity of vessels, their owners and corporations, and fishing activity. Not all vessels, however, are required to use AIS devices, as regulations vary by country, vessel size, and activity. Vessels engaged in illicit activities can also turn off their AIS transponders or manipulate the locations they broadcast. Also, large “blind spots” along coastal waters arise from nations that restrict access to AIS data that are captured by terrestrial receptors instead of satellites or from poor reception due to high vessel density and low-quality AIS devices. Unmatched SAR detections therefore provide the missing information about vessel traffic in the ocean.</p>\n<h3>SAR and AIS matching</h3>\n<p>Matching SAR detections to vessels’ GPS coordinates (from the automatic identification system (AIS) is challenging because the timestamp of the SAR images and AIS records do not coincide, and a single AIS message can potentially match to multiple vessels appearing in the image, and vice versa. To determine the likelihood that a vessel broadcasting AIS corresponded to a specific SAR detection, we followed a matching approach based on probability rasters of where a vessel is likely to be minutes before and after an AIS position was recorded. These rasters were developed from one year of global AIS data from the Global Fishing Watch pipeline which uses Spire Global and Orbcomm sources of satellite data, including roughly 10 billion vessel positions, and computed for six different vessel classes, considering six different speeds and 36 time intervals. So we obtain the likely position of a vessel that could match a SAR detection based on the vessel class, speed and time interval.</p>\n<h3>AIS matching and vessel identity</h3>\n<p>Automatic identification system (AIS) data can reveal the identity of vessels, their owners and corporations, and fishing activity. Not all vessels, however, are required to use AIS devices, as regulations vary by country, vessel size, and activity. Vessels engaged in illicit activities can also turn off their AIS transponders or manipulate the locations they broadcast. Also, large “blind spots” along coastal waters arise from nations that restrict access to AIS data that are captured by terrestrial receptors instead of satellites or from poor reception due to high vessel density and low-quality AIS devices. Unmatched SAR detections therefore provide the missing information about vessel traffic in the ocean.</p>\n<h2>Resources, code and other notes</h2>\n<p>All code developed in this study for SAR detection, deep learning models, and analyses is open source and freely available at\n <a target="_blank" href="https://github.com/GlobalFishingWatch/paper-industrial-activity">\n <span style="color:rgb(0, 0, 0);">https://github.com/GlobalFishingWatch/paper-industrial-activity</span>\n </a>.\n</p>\n<h2>Source data and citations</h2>\n<p>All vessel data are freely available through the Global Fishing Watch data portal at\n <a target="_blank" href="https://globalfishingwatch.org">\n <span style="color:rgb(0, 0, 0);">https://globalfishingwatch.org</span>\n </a>. All data to reproduce our supporting scientific paper can be downloaded from\n <a target="_blank" href="https://doi.org/10.5281/zenodo.8256932">\n <span style="color:rgb(0, 0, 0);">https://doi.org/10.6084/m9.figshare.24309475</span>\n </a>\n (statistical analyses and figures) and\n <a target="_blank" href="https://doi.org/10.6084/m9.figshare.24309469">\n <span style="color:rgb(0, 0, 0);">https://doi.org/10.6084/m9.figshare.24309469</span>\n </a>\n (model training and evaluation).\n</p>\n<h2>License</h2>\n<p>Non-Commercial Use Only. The Site and the Services are provided for Non-Commercial use only in accordance with the CC BY-NC 4.0 license. If you would like to use the Site and/or the Services for commercial purposes, please contact us.'
      name: 'SAR with Neural classification'
      schema: {
        bearing: 'bearing'
        matched: {
          enum: {
            false: 'false'
            true: 'true'
          }
          keyword: 'matched'
        }
        neural_vessel_type: {
          enum: {
            'Likely Fishing': 'Likely Fishing'
            'Likely non-fishing': 'Likely non-fishing'
            Unknown: 'Unknown'
          }
          keyword: 'neural_vessel_type'
        }
        shiptype: {
          enum: {
            bunker: 'bunker'
            cargo: 'cargo'
            carrier: 'carrier'
            discrepancy: 'discrepancy'
            fishing: 'fishing'
            gear: 'gear'
            other: 'other'
            passenger: 'passenger'
            seismic_vessel: 'seismic_vessel'
            support: 'support'
          }
          keyword: 'shiptype'
        }
        speed: 'speed'
      }
    }
    'public-global-sentinel2-footprints': {
      description: 'Detection footprints'
      name: 'Detection footprints'
    }
    'public-global-sentinel2-presence': {
      description: '<h2>Overview</h2> <p> This layer shows vessels detected using optical satellite imagery collected by the European Space Agency\'s Sentinel-2 satellites. Optical imagery is similar to high-quality aerial photography from space, using reflected sunlight in visible and near-infrared wavelengths. This type of imagery provides high-resolution detail that allows us to spot small vessels, identify wake patterns, and better understand activity near shore. </p> <p> Global Fishing Watch uses a machine learning model that processes each image to identify vessels and estimate their length, orientation, and speed based on wake features. The detections are then filtered using a secondary classifier to remove objects that are not vessels, such as clouds, rocks or icebergs. Each detection is linked to a cropped image (a thumbnail) so users can visually inspect what the model identified. </p> <p> Because optical satellites rely on sunlight and clear skies, detections are only possible during the day and when the area is not obscured by clouds or haze. Despite these limitations, detections with optical imagery are especially helpful in identifying small untracked vessels that may not appear in other tracking systems. </p> <h2>Use cases</h2> <ul> <li> Monitor vessel presence (both fishing and non-fishing) in areas of interest such as marine protected areas (MPAs), exclusive economic zones (EEZs), inshore exclusion zones (IEZs) and Regional Fisheries Management Organisations (RFMOs). In some cases, activity like bottom trawling can be seen through disturbance to seabed sediment. </li> <li> Assess presence of vessels that don\'t show up on cooperative tracking systems—including automatic identification system (AIS) and vessel monitoring system (VMS)—near vulnerable marine ecosystems and essential fish habitats. </li> <li> Goes beyond vessel detection in other satellite remote sensors like Sentinel-1 SAR and VIIRS which simply detect the presence of an object, with Sentinel-2 users can often infer the object\'s activity based on the wake of a detection, and in some cases, the dataset can be used to identify fishing activity e.g. sediment plumes of trawlers, net encircling fish in purse seine vessels. </li> <li> Support analyses on small-scale fishing. While the 10m resolution is still too coarse to comprehensively map small-scale fishing, Sentinel-2 detections have been integrated into multiple analyses related to regional small-scale fishery and demonstrated the potential as a valuable addition to the limited vessel tracking data. </li> </ul> <h2>Limitations</h2> <ul> <li> Vessel detection with optical imagery requires daylight and clear skies <ul> <li> Unlike radar, optical satellites cannot see through clouds, fog, or haze. Detections are only possible during daylight hours when the view is unobstructed. </li> </ul> </li> <li> Not all geographies are covered equally <ul> <li> Sentinel-2 coverage is mostly limited to coastal waters. It revisits most areas every five days, but the image availability depends on the weather. Cloudy or hazy regions have lower effective revisit frequencies than regions with better weather conditions. </li> </ul> </li> <li> The detections may include false positives <ul> <li> Despite post-processing, the model may still produce occasional false detections—e.g., picking up buoys, debris, fixed infrastructure, or image artifacts. These false positives are reduced using a secondary classifier, but not completely eliminated. </li> </ul> </li> <li> Uncertainty in some vessel features <ul> <li> Smaller or slower-moving vessels may not produce visible wakes, making it more difficult to estimate their speed or heading. Therefore, these values may be inaccurate for small boats. </li> </ul> </li> <li> Not all detections unmatched to AIS are untracked vessels <ul> <li> The detections include both vessels on AIS and untracked vessels. We try to match detections to AIS tracks, but sometimes matching is not feasible due to large time gaps between AIS positions and in areas with high density of detections. </li> </ul> </li> </ul> <h2>Methods</h2> <h3>Optical imagery</h3> <p> This layer is based on images from the Sentinel-2 satellites operated by the European Space Agency (ESA). These satellites capture medium-resolution images (10 m per pixel) of the ocean using visible and near-infrared light (among several other bands). Combined, the satellites acquire images of most coastal waters and dedicated areas in the open ocean roughly every five days, and the imagery is made freely available by the ESA. </p> <h3>Image processing and selection</h3> <p> We use pre-processed Sentinel-2 images that have been corrected for geometric distortions and aligned to the Earth\'s surface. These images are split into manageable tiles, and we selected the tiles that cover only ocean areas (image tiles over land are excluded). We use four image bands: red, green, blue (RGB), and near-infrared (NIR), all at 10-meter resolution. These bands give us the detail and contrast needed to detect and classify vessels. </p> <h3>Vessel detection</h3> <p> Our machine learning model scans each image tile to detect vessels. It is trained to look for features such as the shape, brightness, and wake of a vessel. When it finds a likely candidate, the model predicts a score for vessel presence alongside estimates of the vessel\'s location, size, orientation, and speed. </p> <p> The detection model was trained on over 11,000 manually reviewed vessel examples across thousands of Sentinel-2 scenes. This training process included many small vessels and scenes from around the world, helping the model to perform well across different environments and vessel types. </p> <h3>Image thumbnails</h3> <p> Each detection includes a small visual "chip" showing the detected vessel at the center. These thumbnails come in two formats: a color version from the RGB bands, and a grayscale version from the near-infrared band. Each chip covers an area of 1 km². These thumbnails are helpful for visually confirming a detection or understanding its context. For very small vessels (under 15 meters), it may still be difficult to see them clearly. </p> <h3>Reducing false positives</h3> <p> Not everything that looks like a vessel in satellite imagery actually is one. To help remove false detections (like buoys, offshore platforms, sea ice, or clouds), we run each detection through a secondary classifier. This classifier is a machine learning model that uses both the image thumbnail and additional information about the detection (such as distance from shore, local depth, and vessel density nearby, among others) to decide whether the object is likely to be a vessel. We also flag detections that are close to known fixed infrastructure or in areas with substantial sea ice or iceberg presence. </p> <p> If a detection is classified as likely non-vessel or flagged as potential infrastructure or ice, we remove it from the map layer so only high-confidence detections are included. We also clip the satellite footprints (displayed on the map layer) to exclude the areas under the icy-region mask. However, we provide all the false positives with labels through the data download portal for stakeholders who require a more complete dataset. </p> <h3>AIS matching and vessel identity</h3> <p> AIS data can reveal the identity of vessels, their owners and corporations, and fishing activity. Not all vessels, however, are required to use AIS devices, as regulations vary by country, vessel size, and activity. Vessels engaged in illicit activities can also turn off their AIS transponders or manipulate the locations they broadcast. Also, large "blind spots" along coastal waters arise from nations that restrict access to AIS data that are captured by terrestrial receptors instead of satellites or from poor reception due to high vessel density and low-quality AIS devices. Unmatched imagery detections therefore provide the missing information about vessel traffic in the ocean. </p> <p> Matching imagery detections to vessels\' GPS coordinates from AIS is challenging because the timestamps of the images and AIS records do not coincide, and a single AIS identity can potentially match to multiple vessels appearing in the image, and vice versa. To determine the likelihood that a vessel broadcasting AIS corresponded to a specific detection, we developed a matching approach based on probability rasters of where a vessel is likely to be minutes before and after an AIS position was recorded. These rasters were produced from one year of global AIS data from the Global Fishing Watch pipeline, which sources satellite data from Spire Global and Orbcomm. The probability rasters are based on roughly 10 billion vessel positions and are computed for six different vessel classes, considering six different speeds and 36 time intervals. So we obtain the likely position of a vessel that could match a detection based on the vessel class, speed and time interval. In addition to the spatiotemporal matching, we factor in the similarity between the model-inferred vessel length and the length from AIS identity data to avoid (likely incorrect) matches with large discrepancies in size, e.g., AIS of a tugboat and the detection of a large vessel behind it. </p> <h3>Detection footprints</h3> <p> To help users understand where detections were possible, we show the detection "footprints" on the map. These polygons are the portions of the satellite images that cover the ocean and that were used for detection. Thus, if you see a footprint but no detections, it means no vessels were detected in that area. If there is no footprint, no image was processed for that location and time. </p> <h3>Automation and updates</h3> <p> Our detection and matching system runs automatically each day. It checks for new Sentinel-2 images published to Google Cloud and processes those that meet our quality criteria. New detections are typically available within 1–2 days of the satellite capturing the image. The automated pipeline also re-checks any images published late to ensure any data gaps are filled. </p> <h2>Source data and citations</h2> <p> All vessel data are freely available through the Global Fishing Watch data portal at <a target="_blank" rel="noopener noreferrer nofollow" href="https://globalfishingwatch.org/data-download/" >https://globalfishingwatch.org/data-download/</a >. </p> <h2>License</h2> <p> Non-Commercial Use Only. The Site and the Services are provided for Non-Commercial use only in accordance with the CC BY-NC 4.0 license. If you would like to use the Site and/or the Services for commercial purposes, please contact us. </p>'
      name: 'Imagery detections (Optical)'
      schema: {
        bearing: 'bearing'
        length: {
          enum: {
            '20-60': '20-60'
            '60-100': '60-100'
            '<20': '<20'
            '>100': '>100'
          }
          keyword: 'length'
        }
        matched: {
          enum: {
            false: 'false'
            true: 'true'
          }
          keyword: 'matched'
        }
        shiptype: {
          enum: {
            bunker: 'bunker'
            cargo: 'cargo'
            carrier: 'carrier'
            discrepancy: 'discrepancy'
            fishing: 'fishing'
            gear: 'gear'
            other: 'other'
            passenger: 'passenger'
            seismic_vessel: 'seismic_vessel'
            support: 'support'
          }
          keyword: 'shiptype'
        }
      }
    }
    'public-global-sst': {
      description: "<h2>Overview</h2>\n<ul>\n<li>Sea surface temperature is the water temperature at or near the surface. It can impact weather and regional climates, and together with salinity can drive ocean circulation and large-scale movement of ocean currents globally. This dataset provides sea surface temperature at 1/20 degree horizontal grid resolution, using in-situ and satellite data from both infrared and microwave radiometers.</li>\n<ul>\n<h2>Source</h2>\n<ul>\n <a href='https://doi.org/10.48670/moi-00165'>Generated using E.U. Copernicus Marine Service Information; https://doi.org/10.48670/moi-00165.</a></li>"
      name: 'Sea Surface Temperature'
    }
    'public-global-sst-anomalies': {
      description: 'Sea surface temperatures anomalies (Mean)'
      name: 'Sea Surface Temperatures anomalies'
    }
    'public-global-sst-anomalies-max': {
      description: 'Sea surface temperatures anomalies (Max)'
      name: 'Sea Surface Temperatures anomalies (Max)'
    }
    'public-global-sst-anomalies-min': {
      description: 'Sea surface temperatures anomalies (Max)'
      name: 'Sea Surface Temperatures anomalies (Min)'
    }
    'public-global-sst-max': {
      description: 'Surface Temperature'
      name: 'Surface Temperature Max'
    }
    'public-global-sst-min': {
      description: 'Surface Temperature'
      name: 'Surface Temperature Min'
    }
    'public-global-support-vessels': {
      description: 'Support vessels from AIS'
      name: 'AIS (Support Vessels)'
      schema: {
        source: 'source'
      }
    }
    'public-global-thgt': {
      description: "<h2>Overview</h2>\n<ul>\n<li>Wave height is the vertical distance from the trough (bottom) to the crest (top) of a wave on the sea surface. This dataset uses the significant wave height, which is the average of the highest one-third of all wave heights over a given sample period.</li>\n<ul>\n<h2>Source</h2>\n<ul>\n <a href='https://www.pacioos.hawaii.edu/metadata/ww3_global.html'>Cheung, K.F. 2010, updated 2021. WaveWatch III (WW3) Global Wave Model. Distributed by the Pacific Islands Ocean Observing System (PacIOOS), which is a part of the U.S. Integrated Ocean Observing System (IOOS®), funded in part by National Oceanic and Atmospheric Administration (NOAA) Awards #NA16NOS0120024 and #NA21NOS0120091.</a></li>"
      name: 'Waves height'
    }
    'public-global-tracks': {
      description: 'The dataset contains the tracks from all vessels (AIS) - Version 3.0'
      name: 'Tracks'
      schema: {
        speed: 'speed'
      }
    }
    'public-global-vessel-identity': {
      description: 'Vessel Identity (all shiptypes)'
      name: 'AIS (all vessel types)'
      schema: {
        registryTmtExtraFields: 'registryTmtExtraFields'
      }
    }
    'public-global-vessel-insights': {
      description: 'Vessel Insights from AIS'
      name: 'AIS (Insights)'
    }
    'public-global-viirs-presence': {
      description: 'The night lights vessel detections layer, known as visible infrared imaging radiometer suite or VIIRS, shows vessels at sea that satellites have detected by the light they emit at night. Though not exclusively associated with fishing vessels, this activity layer is likely to show vessels associated with activities like squid fishing, which use bright lights and fish at night.The satellite makes a single over-pass across the entire planet every night, detecting lights not obscured by clouds and designed to give at least one observation globally every day. Because the vessels are detected solely based on light emission, we can detect individual vessels and even entire fishing fleets that are not broadcasting automatic identification system (AIS) and so are not represented in the AIS apparent fishing effort layer. Lights from fixed offshore infrastructure and other non-vessel sources are excluded. Global Fishing Watch ingests boat detections processed from low light imaging data collected by the U.S. National Oceanic and Atmospheric Administration (NOAA) VIIRS. The boat detections are processed in near-real time by NOAA’s Earth Observation Group, located in Boulder, Colorado. The data, known as VIIRS boat detections, picks up the presence of fishing vessels using lights to attract catch or to conduct operations at night. More than 85% of the detections are from vessels that lack AIS or Vessel Monitoring System (VMS) transponders. Due to the orbit design of polar orbiting satellites, regions closer to polar will have more over-passes per day, while equatorial regions have only one over-pass daily. Read more about this product, and download the data <a href="https://ngdc.noaa.gov/eog/viirs/download_boat.html" target="_blank" rel="noopener">here</a>.Those using night light detections data should acknowledge the South Atlantic Anomaly (SAA), an area where the Earth\'s inner Van Allen radiation belt is at its lowest altitude, allowing more energetic particles from space to penetrate. When such particles hit the sensors on a satellite, this can create a false signal which might cause the algorithm to recognize it as a boat presence. A filtration algorithm has been applied but there may still be some mis-identification. The GFW layer includes quality flags (QF), including a filter to show only detections which NOAA has classified as vessels (QF1)'
      name: 'Night light detections (VIIRS)'
      schema: {
        bearing: 'bearing'
        matched: {
          enum: {
            false: 'false'
            true: 'true'
          }
          keyword: 'matched'
        }
        qf_detect: {
          enum: {
            '1': '1'
            '10': '10'
            '2': '2'
            '3': '3'
            '5': '5'
            '7': '7'
          }
          keyword: 'qf_detect'
        }
        radiance: {
          enum: {
            '0': '0'
            '10000': '10000'
          }
          keyword: 'radiance'
        }
        shiptype: {
          enum: {
            carrier: 'carrier'
            fishing: 'fishing'
            support: 'support'
            unknown: 'unknown'
          }
          keyword: 'shiptype'
        }
        speed: 'speed'
      }
    }
    'public-global-water-salinity': {
      description: 'Sea surface salinity is a key parameter to estimate the influence of oceans on climate. Along with temperature, salinity is a key factor that determines the density of ocean water and thus determines the convection and re-emergence of water masses. The thermohaline circulation crosses all the oceans in surface and at depth, driven by temperature and salinity. A global “conveyor belt” is a simple model of the large-scale thermohaline circulation. Deep-water forms in the North Atlantic, sinks, moves south, circulates around Antarctica, and finally enters the Indian, Pacific, and Atlantic basins. Currents bring cold water masses from north to south and vice versa. This thermohaline circulation greatly influences the formation of sea ice at the world’s poles, and carries ocean food sources and sea life around the planet, as well as affects rainfall patterns, wind patterns, hurricanes and monsoons. Source: EU Copernicus Marine Service Information.'
      name: 'Global Salinity'
    }
    'public-global-water-salinity-max': {
      description: 'Sea surface salinity is a key parameter to estimate the influence of oceans on climate. Along with temperature, salinity is a key factor that determines the density of ocean water and thus determines the convection and re-emergence of water masses. The thermohaline circulation crosses all the oceans in surface and at depth, driven by temperature and salinity. A global “conveyor belt” is a simple model of the large-scale thermohaline circulation. Deep-water forms in the North Atlantic, sinks, moves south, circulates around Antarctica, and finally enters the Indian, Pacific, and Atlantic basins. Currents bring cold water masses from north to south and vice versa. This thermohaline circulation greatly influences the formation of sea ice at the world’s poles, and carries ocean food sources and sea life around the planet, as well as affects rainfall patterns, wind patterns, hurricanes and monsoons. Source: EU Copernicus Marine Service Information.'
      name: 'Global Salinity'
    }
    'public-global-water-salinity-min': {
      description: 'Sea surface salinity is a key parameter to estimate the influence of oceans on climate. Along with temperature, salinity is a key factor that determines the density of ocean water and thus determines the convection and re-emergence of water masses. The thermohaline circulation crosses all the oceans in surface and at depth, driven by temperature and salinity. A global “conveyor belt” is a simple model of the large-scale thermohaline circulation. Deep-water forms in the North Atlantic, sinks, moves south, circulates around Antarctica, and finally enters the Indian, Pacific, and Atlantic basins. Currents bring cold water masses from north to south and vice versa. This thermohaline circulation greatly influences the formation of sea ice at the world’s poles, and carries ocean food sources and sea life around the planet, as well as affects rainfall patterns, wind patterns, hurricanes and monsoons. Source: EU Copernicus Marine Service Information.'
      name: 'Global Salinity'
    }
    'public-global-water-temperature': {
      description: "Sea surface temperature is the water temperature at the ocean's surface. The Hybrid Coordinate Ocean Model (HYCOM) is a data-assimilative hybrid isopycnal-sigma-pressure (generalized) coordinate ocean model. The subset of HYCOM data hosted in EE contains the variables salinity, temperature, velocity, and elevation. They have been interpolated to a uniform 0.08 degree lat/long grid between 80.48°S and 80.48°N. The salinity, temperature, and velocity variables have been interpolated to 40 standard z-levels. Source: HYCOM"
      name: 'Sea surface temperature'
    }
    'public-global-water-temperature-max': {
      description: "Sea surface temperature is the water temperature at the ocean's surface. The Hybrid Coordinate Ocean Model (HYCOM) is a data-assimilative hybrid isopycnal-sigma-pressure (generalized) coordinate ocean model. The subset of HYCOM data hosted in EE contains the variables salinity, temperature, velocity, and elevation. They have been interpolated to a uniform 0.08 degree lat/long grid between 80.48°S and 80.48°N. The salinity, temperature, and velocity variables have been interpolated to 40 standard z-levels. Source: HYCOM"
      name: 'Sea surface temperature'
    }
    'public-global-water-temperature-min': {
      description: "Sea surface temperature is the water temperature at the ocean's surface. The Hybrid Coordinate Ocean Model (HYCOM) is a data-assimilative hybrid isopycnal-sigma-pressure (generalized) coordinate ocean model. The subset of HYCOM data hosted in EE contains the variables salinity, temperature, velocity, and elevation. They have been interpolated to a uniform 0.08 degree lat/long grid between 80.48°S and 80.48°N. The salinity, temperature, and velocity variables have been interpolated to 40 standard z-levels. Source: HYCOM"
      name: 'Sea surface temperature'
    }
    'public-global-winds-uo': {
      description: 'Winds eastward component'
      name: 'Winds'
    }
    'public-global-winds-vo': {
      description: 'Winds northward component'
      name: 'Winds'
    }
    'public-graticules': {
      description: "Grids or graticules of latitude and longitude at 1, 5, 10 and 30° intervals depending on the zoom level of the map (Source: <a href='https://www.naturalearthdata.com/downloads/110m-physical-vectors/110m-graticules/'_blank'>Natural Earth</a>)."
      name: 'Latitude longitude grids'
    }
    'public-gs-as-simplified': {
      description: 'GSAs simplified'
      name: 'GSAs simplified'
    }
    'public-gulf-of-lion-french-zones': {
      description: 'Gulf of lion french zones'
      name: 'Gulf of Lion French Zones'
    }
    'public-high-seas': {
      description: 'The High Seas are any area of the ocean beyond Exclusive Economic Zones (EEZ). High Seas pockets are areas totally enclosed by EEZs. These pockets can be hard to distinguish from the multiple EEZ jurisdictions that surround them, thus, we have a layer that highlights them.'
      name: 'High seas'
    }
    'public-high-seas-pockets': {
      description: '<p> The United Nations Convention on the Law of the Sea describes the high seas as ‘all parts of the sea that are not included in the exclusive economic zone, in the territorial sea or in the internal waters of a State, or in the archipelagic waters of an archipelagic State.’ High Seas pockets are areas totally enclosed by EEZs. These pockets can be hard to distinguish from the multiple EEZ jurisdictions that surround them, thus, we have a layer that highlights them. Citation: Flanders Marine Institute (2024). Maritime Boundaries Geodatabase: High Seas, version 2. Available online at <a href="https://www.marineregions.org/" target="_blank" >https://www.marineregions.org/</a >. </p>'
      name: 'High seas pockets'
    }
    'public-indian-ocean-isa-claim-areas': {
      description: 'This layer depicts the ISA claim areas for seabed mining in the Indian Ocean, which primarily contain polymetallic sulfides and polymetallic nodules. Exploration leases in this region are currently held by India, Germany, South Korea, and China.'
      name: 'Indian Ocean ISA Claim Areas'
      schema: {
        contractor: 'contractor'
        label: 'label'
        type: 'type'
      }
    }
    'public-indonesia-fishing-effort': {
      description: 'VMS data for Indonesia is not currently available for the period from July 2020.\n\nVessel monitoring system (VMS) data provided by the Indonesian Government’s Ministry of Maritime Affairs and Fisheries. Data is collected using their VMS via satellites and terrestrial receivers, and contains a vessel identities, gear type, location, speed, direction and more. Global Fishing Watch analyzes this data using the same algorithms developed for automatic identification system (AIS) data to identify fishing activity and behaviors. The algorithm classifies each broadcast data point for these vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch fishing activity heat map. VMS broadcasts data quite differently from AIS and may give different measures of completeness, accuracy and quality. Over time our algorithms will improve across all our broadcast data formats. Global Fishing Watch’s fishing presence algorithm for VMS, as for AIS, is a best effort to algorithmically identify “apparent fishing activity.” It is possible that some fishing activity is not identified, or that the heat map may show apparent fishing activity where fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity,” “fishing” or “fishing effort,” as “apparent,” rather than certain. Any/all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at your own risk. Global Fishing Watch fishing presence algorithms are developed and tested using actual fishing event data collected by observers, combined with expert analysis of AIS vessel movement data resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and automated classification techniques.'
      name: 'Indonesia VMS'
    }
    'public-indonesia-fishing-vessels': {
      description: 'Dataset for VMS Indonesia (Public)'
      name: 'Indonesia VMS (Fishing Vessels)'
    }
    'public-indonesia-pelagic-fishing-effort': {
      description: 'Indonesia Pelagic Fishing Effort Public Data'
      name: 'Indonesia Pelagic'
    }
    'public-indonesia-pelagic-presence': {
      description: 'Pelagic Presence'
      name: 'Indonesia Pelagic'
    }
    'public-indonesia-zebrax-presence': {
      description: 'Zebra X Presence'
      name: 'Indonesia Zebrax'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'public-inshore-fishing-zone-1618837176535': {
      description: '50 nm around the Tristan Archipelago and 40nm around Gough (8% of EEZ)'
      name: 'Inshore Fishing Zone'
    }
    'public-isa-areas-contractor': {
      description: "<h2>ISA Contractor Information</h2> <table> <thead> <tr> <th>Contractor ID</th> <th>Preferred Contractor Name</th> <th>Nationality</th> </tr> </thead> <tbody> <tr> <td>BGRPMN1</td> <td> Federal Institute for Geosciences and Natural Resources of Germany - PMN </td> <td>Germany</td> </tr> <tr> <td>BGRPMS1</td> <td> Federal Institute for Geosciences and Natural Resources of Germany - PMS </td> <td>Germany</td> </tr> <tr> <td>BMJPMN1</td> <td>Blue Minerals Jamaica Limited (BMJ) - PMN</td> <td>Jamaica</td> </tr> <tr> <td>BPHDCPMN1</td> <td>Beijing Pioneer Hi-Tech Development Corporation - PMN</td> <td>China</td> </tr> <tr> <td>BrazilCRFC1</td> <td>Companhia de Pesquisa de Recursos Minerais S.A. - CRFC</td> <td>Brazil</td> </tr> <tr> <td>CIICPMN1</td> <td>Cook Islands Investment Corporation - PMN</td> <td>Cook Islands</td> </tr> <tr> <td>CMMPMN1</td> <td>China Minmetals Corporation - PMN</td> <td>China</td> </tr> <tr> <td>COMRACRFC1</td> <td> China Ocean Mineral Resources Research and Development Association - CRFC </td> <td>China</td> </tr> <tr> <td>COMRAPMN1</td> <td> China Ocean Mineral Resources Research and Development Association - PMN </td> <td>China</td> </tr> <tr> <td>COMRAPMS1</td> <td> China Ocean Mineral Resources Research and Development Association - PMS </td> <td>China</td> </tr> <tr> <td>DORDPMN1</td> <td>Deep Ocean Resources Development Co. Ltd. - PMN</td> <td>Japan</td> </tr> <tr> <td>GSRPMN1</td> <td>Global Sea Mineral Resources NV - PMN</td> <td>Belgium</td> </tr> <tr> <td>IFREMERPMN1</td> <td> Institut français de recherche pour l'exploitation de la mer - PMN </td> <td>France</td> </tr> <tr> <td>IFREMERPMS1</td> <td> Institut français de recherche pour l'exploitation de la mer - PMS </td> <td>France</td> </tr> <tr> <td>IndiaPMN1</td> <td>Government of India - PMN</td> <td>India</td> </tr> <tr> <td>IndiaPMS1</td> <td>Government of India - PMS</td> <td>India</td> </tr> <tr> <td>IOMPMN1</td> <td>Interoceanmetal Joint Organization - PMN</td> <td>Poland</td> </tr> <tr> <td>KOREACRFC1</td> <td>Government of the Republic of Korea - CRFC</td> <td>Korea</td> </tr> <tr> <td>KOREAPMN1</td> <td>Government of the Republic of Korea - PMN</td> <td>Korea</td> </tr> <tr> <td>KOREAPMS1</td> <td>Government of the Republic of Korea - PMS</td> <td>Korea</td> </tr> <tr> <td>MARAWAPMN1</td> <td>Marawa Research and Exploration Ltd. - PMN</td> <td>Kiribati</td> </tr> <tr> <td>NORIPMN1</td> <td>Nauru Ocean Resources Inc. - PMN</td> <td>Nauru</td> </tr> <tr> <td>OMSPMN1</td> <td>Ocean Mineral Singapore Pte. Ltd. - PMN</td> <td>Singapore</td> </tr> <tr> <td>POLPMS1</td> <td>Government of the Republic of Poland - PMS</td> <td>Poland</td> </tr> <tr> <td>RUSFEDPMS1</td> <td>Government of the Russian Federation - PMS</td> <td>Russia</td> </tr> <tr> <td>RUSMNRCRFC1</td> <td> Ministry of Natural resources and environment of the russian federation - CRFC </td> <td>Russia</td> </tr> <tr> <td>TOMLPMN1</td> <td>Tonga Offshore Mining Limited - PMN</td> <td>Tonga</td> </tr> <tr> <td>UKSRLPMN1</td> <td>UK Seabed Resources Ltd. - I - PMN</td> <td>UK</td> </tr> <tr> <td>UKSRLPMN2</td> <td>UK Seabed Resources Ltd. - II - PMN</td> <td>UK</td> </tr> <tr> <td>YUZHPMN1</td> <td>Yuzhmorgeologiya - PMN</td> <td>Russia</td> </tr> </tbody> </table>"
      name: 'ISA Areas by Contractor'
      schema: {
        contract: {
          enum: {
            BGRPMN1: 'BGRPMN1'
            BGRPMS1: 'BGRPMS1'
            BMJPMN1: 'BMJPMN1'
            BPHDCPMN1: 'BPHDCPMN1'
            BrazilCRFC1: 'BrazilCRFC1'
            CIICPMN1: 'CIICPMN1'
            CMMPMN1: 'CMMPMN1'
            COMRACRFC1: 'COMRACRFC1'
            COMRAPMN1: 'COMRAPMN1'
            COMRAPMS1: 'COMRAPMS1'
            CRFCReserved: 'CRFCReserved'
            DORDPMN1: 'DORDPMN1'
            GSRPMN1: 'GSRPMN1'
            IFREMERPMN1: 'IFREMERPMN1'
            IFREMERPMS1: 'IFREMERPMS1'
            IOMPMN1: 'IOMPMN1'
            IndiaPMN1: 'IndiaPMN1'
            IndiaPMS1: 'IndiaPMS1'
            JOGMECCRFC1: 'JOGMECCRFC1'
            KOREACRFC1: 'KOREACRFC1'
            KOREAPMN1: 'KOREAPMN1'
            KOREAPMS1: 'KOREAPMS1'
            MARAWAPMN1: 'MARAWAPMN1'
            NORIPMN1: 'NORIPMN1'
            OMSPMN1: 'OMSPMN1'
            PMNReserved: 'PMNReserved'
            POLPMS1: 'POLPMS1'
            RUSFEDPMS1: 'RUSFEDPMS1'
            RUSMNRCRFC1: 'RUSMNRCRFC1'
            TOMLPMN1: 'TOMLPMN1'
            UKSRLPMN1: 'UKSRLPMN1'
            UKSRLPMN2: 'UKSRLPMN2'
            YUZHPMN1: 'YUZHPMN1'
          }
          keyword: 'contract'
        }
        layer: {
          enum: {
            'CFC Exploration Areas': 'CFC Exploration Areas'
            'CFC Reserved Areas': 'CFC Reserved Areas'
            'PMN Exploration Areas': 'PMN Exploration Areas'
            'PMN Reserved Areas': 'PMN Reserved Areas'
            'PMS Exploration Areas': 'PMS Exploration Areas'
          }
          keyword: 'layer'
        }
      }
    }
    'public-isa-layers': {
      description: 'ISA Areas'
      name: 'ISA Areas by Resource Type'
      schema: {
        label: {
          enum: {
            'Areas of particular environmental interest within the Clarion-Clipperton Zone': 'Areas of particular environmental interest within the Clarion-Clipperton Zone'
            'CFC Exploration Areas': 'CFC Exploration Areas'
            'CFC Reserved Areas': 'CFC Reserved Areas'
            'Clarion-Clipperton Zone management area': 'Clarion-Clipperton Zone management area'
            'PMN Exploration Areas': 'PMN Exploration Areas'
            'PMN Reserved Areas': 'PMN Reserved Areas'
            'PMS Exploration Areas': 'PMS Exploration Areas'
          }
          keyword: 'label'
        }
        layer: {
          enum: {
            'GIS-CCZ-Management-Areas — CCZ_Management_Areas.shp copy': 'GIS-CCZ-Management-Areas — CCZ_Management_Areas.shp copy'
            'ISAwebsite_APEIs — ISAwebsite_APEIs Dissolved': 'ISAwebsite_APEIs — ISAwebsite_APEIs Dissolved'
            'ISAwebsite_fclContractAreasCRFC — ISAwebsite_fclContractAreasCRFC Dissolved': 'ISAwebsite_fclContractAreasCRFC — ISAwebsite_fclContractAreasCRFC Dissolved'
            'ISAwebsite_fclContractAreasCRFCres — ISAwebsite_fclContractAreasCRFCres Dissolved': 'ISAwebsite_fclContractAreasCRFCres — ISAwebsite_fclContractAreasCRFCres Dissolved'
            'ISAwebsite_fclContractAreasPMN — ISAwebsite_fclContractAreasPMN Dissolved': 'ISAwebsite_fclContractAreasPMN — ISAwebsite_fclContractAreasPMN Dissolved'
            'ISAwebsite_fclContractAreasPMNres — ISAwebsite_fclContractAreasPMNres Dissolved': 'ISAwebsite_fclContractAreasPMNres — ISAwebsite_fclContractAreasPMNres Dissolved'
            'ISAwebsite_fclContractAreasPMS — ISAwebsite_fclContractAreasPMS Dissolved': 'ISAwebsite_fclContractAreasPMS — ISAwebsite_fclContractAreasPMS Dissolved'
          }
          keyword: 'layer'
        }
      }
    }
    'public-location-labels': {
      description: 'Combination of countries, places and seas dataset labels'
      name: 'Location Labels'
    }
    'public-mangroves': {
      description: "<h2>Overview</h2>\n<ul>\n<li>Mangroves are trees or shrubs that can survive in saline environments and typically grow within the intertidal zone of tropical and subtropical regions. Considered blue carbon habitats, mangrove forests improve water quality, stabilize and protect coastlines, and provide shelter for birds, animals and marine organisms. This dataset uses earth observation satellite imagery to show the global distribution of mangroves.</li>\n<ul>\n<h2>Source</h2>\n<ul>\n <a href='https://data.unep-wcmc.org/datasets/4'>Giri C, Ochieng E, Tieszen LL, Zhu Z, Singh A, Loveland T, Masek J, Duke N (2011). Status and distribution of mangrove forests of the world using earth observation satellite data (version 1.4, updated by UNEP-WCMC). Global Ecology and Biogeography 20: 154-159. DOI: https://doi.org/10.34892/1411-w728.</a></li>"
      name: 'Mangroves'
    }
    'public-marine-ecoregions': {
      description: "<h2>Overview</h2>\n<ul>\n<li>Marine ecoregions are a biogeographic classification of the world's coastal and continental shelf waters. The dataset provides a geographic framework for a broad range of analyses relating to biodiversity in the marine environment.</li>\n<ul>\n<h2>Source</h2>\n<ul>\n <a href='https://geospatial.tnc.org/datasets/ed2be4cf8b7a451f84fd093c2e7660e3/explore'>The Nature Conservancy.</a></li>"
      name: 'Marine ecoregions (MEOW)'
      schema: {
        REALM: {
          enum: {
            Arctic: 'Arctic'
            'Central Indo-Pacific': 'Central Indo-Pacific'
            'Eastern Indo-Pacific': 'Eastern Indo-Pacific'
            'Southern Ocean': 'Southern Ocean'
            'Temperate Australasia': 'Temperate Australasia'
            'Temperate Northern Atlantic': 'Temperate Northern Atlantic'
            'Temperate Northern Pacific': 'Temperate Northern Pacific'
            'Temperate South America': 'Temperate South America'
            'Temperate Southern Africa': 'Temperate Southern Africa'
            'Tropical Atlantic': 'Tropical Atlantic'
            'Tropical Eastern Pacific': 'Tropical Eastern Pacific'
            'Western Indo-Pacific': 'Western Indo-Pacific'
          }
          keyword: 'REALM'
        }
      }
    }
    'public-mediterranean-area-of-interest-1': {
      description: 'Area of Interest'
      name: 'Area of Interest'
    }
    'public-mexico-fishing-effort': {
      description: 'Dataset for VMS Mexico fishing effort'
      name: 'Mexico VMS'
      schema: {
        bearing: 'bearing'
        shiptype: {
          enum: {
            fishing: 'fishing'
          }
          keyword: 'shiptype'
        }
        speed: 'speed'
      }
    }
    'public-mexico-fishing-vessels': {
      description: 'Dataset for VMS Mexico (Public)'
      name: 'Mexico VMS (Fishing vessels)'
      schema: {
        source: 'source'
      }
    }
    'public-mexico-presence': {
      description: 'Dataset for VMS Mexico presence'
      name: 'Mexico VMS'
      schema: {
        bearing: 'bearing'
        shiptype: {
          enum: {
            auxiliary: 'auxiliary'
            boat: 'boat'
            fishing: 'fishing'
            'international traffic': 'international traffic'
            'national traffic': 'national traffic'
            tug: 'tug'
          }
          keyword: 'shiptype'
        }
        speed: 'speed'
      }
    }
    'public-mexico-vessel-identity-fishing': {
      description: 'Dataset for VMS Mexico (Public)'
      name: 'Mexico VMS (Fishing vessels)'
    }
    'public-mid-atlantic-isa-claim-areas': {
      description: 'This layer depicts the ISA claim areas for seabed mining on the Mid-Atlantic Ridge, which contain polymetallic sulfides. Exploration leases in this region are currently held by France, Russia, and Poland.'
      name: 'Mid-Atlantic ISA Claim Areas'
      schema: {
        contractor: 'contractor'
        label: 'label'
        type: 'type'
      }
    }
    'public-mp-as-mp-atlas': {
      description: 'Marine protected areas (MPAs) are areas of the ocean set aside for long-term conservation. These can have different levels of protection, and the range of activities allowed or prohibited within their boundaries varies considerably'
      name: 'MPAs (MPAtlas)'
    }
    'public-mp-atlas': {
      description: '<p><a href="https://www.science.org/doi/10.1126/science.abf0861/" target="_blank" >The MPA Guide</a > is intended to fill a gap in existing MPA classification and assessment tools to help determine how likely MPAs are to deliver the desired conservation outcomes. Over the past few years, the MPAtlas team and key collaborators have applied The MPA Guide framework to MPAs around the world to develop a clearer picture of global marine protection, which includes a recent study establishing a baseline for global "30x30" targets - Publication: <a href="https://conbio.onlinelibrary.wiley.com/doi/10.1111/conl.13020" target="_blank" >Ocean Protection Quality is Lagging Behind Quantity</a >. MPAtlas is the online repository for MPA Guide assessments and associated data. Stage of Establishment represents where the MPA is in its process of being an MPA. <u>Proposed/Committed</u>: The intent to create an MPA is made public. <u>Designated</u>: MPA is established/recognized through legal means or other authoritative rulemaking. <u>Implemented</u>: MPA is acknowledged to be operation ‘in the water’ with plans for management activated. <u>Actively managed</u>: MPA management is ongoing, with monitoring, periodic review and adjustments made as needed to achieve biodiversity conservation and other ecological and social goals. Level of Protection represents the extent to which the MPA protected from seven main types of human activities and is likely to generate positive biodiversity outcomes. <u>Fully Protected</u>: No impact from extractive or destructive activities is allowed, and all abatable impacts are minimized. <u>Highly Protected</u>: Only light extractive activities are allowed that have low total impact, and all other abatable impacts are minimized. <u>Lightly Protected</u>: Some protection of biodiversity exists, but extractive or destructive activities that can have moderate to significant impact are allowed. <u>Minimally Protected</u>: Extensive extraction and other activities with high total impact are allowed, but the site can still be considered an MPA under the IUCN protected area definition and provides some conservation benefit. Some areas allow activities that have an impact so large that they are incompatible with the conservation of biodiversity, as defined by the IUCN. For more information, please visit <a href="https://mpatlas.org/" target="_blank">https://mpatlas.org/</a>. Each assessed MPA has a score card that describes its stage of establishment and level of protection, as well as more details about the components that contributed to these assessments. Note: The MPAtlas dataset does not contain boundaries for all global MPAs, only those assessed against MPA quality frameworks. </p>'
      name: 'MPAs (MPAtlas)'
      schema: {
        establishment_stage: {
          enum: {
            'actively managed': 'actively managed'
            designated: 'designated'
            implemented: 'implemented'
            'proposed/committed': 'proposed/committed'
            unknown: 'unknown'
          }
          keyword: 'establishment_stage'
        }
        mpaguide_protection_level: {
          enum: {
            full: 'full'
            high: 'high'
            incompatible: 'incompatible'
            light: 'light'
            minimal: 'minimal'
            unknown: 'unknown'
          }
          keyword: 'mpaguide_protection_level'
        }
      }
    }
    'public-mpa-all': {
      description: "Marine protected areas (MPAs) are areas of the ocean set aside for long-term conservation. These can have different levels of protection, and the range of activities allowed or prohibited within their boundaries varies considerably. Source: World Database on Protected Areas. Last updated: November 2022. See more detailed <a href='https://globalfishingwatch.org/faqs/reference-layer-sources/' target='_blank' rel=noopener'>metadata information</a> for this layer."
      name: 'MPAs'
    }
    'public-mpa-no-take': {
      description: "The term Marine Protected Areas include marine reserves, fully protected marine areas, no-take zones, marine sanctuaries, ocean sanctuaries, marine parks, locally managed marine areas, to name a few. Many of these have quite different levels of protection, and the range of activities allowed or prohibited within their boundaries varies considerably too. No Take layer was created using the data available from the Marine Protected Planet WDPA using the filter NO_TAKE = 'All'. Source: World Database on Protected Areas (WDPA)"
      name: 'MPAs - No take'
    }
    'public-mpa-no-take-partial': {
      description: 'The term Marine Protected Areas include marine reserves, fully protected marine areas, no-take zones, marine sanctuaries, ocean sanctuaries, marine parks, locally managed marine areas, to name a few. Many of these have quite different levels of protection, and the range of activities allowed or prohibited within their boundaries varies considerably too. Source: World Database on Protected Areas (WDPA)'
      name: 'MPAs - No take Partial'
    }
    'public-mpa-restricted': {
      description: "The term Marine Protected Areas include marine reserves, fully protected marine areas, no-take zones, marine sanctuaries, ocean sanctuaries, marine parks, locally managed marine areas, to name a few. Many of these have quite different levels of protection, and the range of activities allowed or prohibited within their boundaries varies considerably too. No Take layer was created using the data available from the Marine Protected Planet WDPA using the filter NO_TAKE = 'Part'. Source: World Database on Protected Areas (WDPA)"
      name: 'MPAs - Restricted (Source: WDPA)'
    }
    'public-no-take-zone-1618836692786': {
      description: '90% of EEZ'
      name: 'Marine Protection Zone'
    }
    'public-northwest-pacific-isa-claim-areas': {
      description: 'This layer depicts the ISA claim areas for seabed mining in the Northwestern Pacific, which primarily contain resources from cobalt-rich ferromanganese crusts and polymetallic nodules. Several countries hold exploration leases in this region including China, Japan, Russia, and South Korea.'
      name: 'Northwest Pacific ISA Claim Areas'
      schema: {
        contractor: 'contractor'
        label: 'label'
        type: 'type'
      }
    }
    'public-norway-fishing-effort': {
      description: 'Vessel monitoring system (VMS) data is provided by the The Norwegian Directorate of Fisheries. Data is collected using Norway’s vessel monitoring system via satellites and is published on a three-day delay containing information on vessels’ location, speed, course, and movement. Global Fishing Watch analyzes this data using the same algorithms developed for automatic identification system (AIS) to identify fishing activity and behaviors. The algorithm classifies each broadcast data point from vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch’s fishing activity heat map. VMS broadcasts data differently from AIS and may give different measures of completeness, accuracy, and quality. Global Fishing Watch is continually improving its algorithms across all broadcast data formats to algorithmically identify “apparent fishing activity.” It is possible that some fishing activity is not identified or that the heat map may show apparent fishing activity when fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity,” “fishing” or “fishing effort,” as apparent rather than certain. Any and all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at the user’s discretion. Global Fishing Watch’s fishing detection algorithms are developed and tested using actual fishing event data collected by observers and is combined with expert analysis of AIS vessel movement data, resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and to improve automated classification techniques'
      name: 'Norway VMS'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'public-norway-fishing-vessels': {
      description: 'Dataset for VMS Norway (Public)'
      name: 'Norway VMS (Fishing Vessels)'
      schema: {
        source: 'source'
      }
    }
    'public-norway-non-fishing-vessels': {
      description: 'Dataset for VMS Norway (Public)'
      name: 'Norway VMS (Non Fishing Vessels)'
      schema: {
        source: 'source'
      }
    }
    'public-norway-presence': {
      description: 'Dataset for VMS Norway presence'
      name: 'Norway VMS'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'public-norway-vessel-identity-fishing': {
      description: 'Dataset for VMS Norway (Public)'
      name: 'Norway VMS (Fishing Vessels)'
    }
    'public-norway-vessel-identity-non-fishing': {
      description: 'Dataset for VMS Norway (Public)'
      name: 'Norway VMS (Non Fishing Vessels)'
    }
    'public-paa-duke': {
      description: '<p> This global Preferential Access Area (PAA) database was built with data for 44 countries identified by the Illuminating Hidden Harvests (IHH) initiative following Basurto et al. (2023) and the FAOLEX database (https://www.fao.org/faolex/en/). The total resulting PAAs identified in this study (n = 63) in 44 countries may be considered a lower bound and not comprehensive, as governments can also establish PAAs via laws or regulations either: (i) not relating to the fisheries sector and categorized elsewhere in the FAOLEX database and hence not searched, or (ii) not reported or captured in it. The most recent review of FAOLEX to identify PAAs was conducted in 2022. For mapping and spatial analysis of the PAAs, a geodatabase of PAA boundaries was created using definition parameters for each PAA (i.e., distance from shoreline or the baseline, depth, or a given set of coordinates or buffered distances around undersea features). Baselines were extracted from Flanders Marine Institute’s (2023) version 12 global EEZ database, defined by ‘Straight Baseline’ features. The shoreline dataset was ESRI’s 2014 global shoreline, the same shoreline dataset as the Flanders Marine Institute global EEZ database. Depth data was extracted from the GEBCO 2023 global relief dataset. When possible, Duke reached out to local experts to review the boundaries for confirmation that our interpretation of FAOLEX and the relevant law or regulation matches what is being used by local fishers. If you have feedback on the PAA boundaries, information regarding PAAs that are not reflected here, or other questions, please reach out to ssf-paa-info@duke.edu. For more information on PAAs and how they are managed, please see Duke’s publication by Basurto et al. (2024) here: <a href="https://doi.org/10.1038/s44183-024-00096-0" target="_blank" >https://doi.org/10.1038/s44183-024-00096-0</a >. Please note that there is no singular definition of a PAA, therefore each country will decide what activities, vessels, gear types, etc. are prohibited or restricted in the PAA. For more information of the specific designation of each PAA, please see the law or regulation in FAOLex. Citation: DeLand, S., Vegh, T., Cleary, J., Basurto, X., Virdin, J., & Halpin, P. N. (2025). A global dataset of preferential access areas for small-scale fishing. Duke Research Data Repository. <a href="https://doi.org/10.7924/r40s01h5j" target="_blank" >https://doi.org/10.7924/r40s01h5j</a > </p>'
      name: 'PAAS'
    }
    'public-panama-fishing-effort': {
      description: 'Vessel monitoring system (VMS) data provided by the Panamanian Authority of Aquatic Resources (ARAP). Data is received by Panama’s VMS system via satellite and contains vessel identities, gear type, location, speed, direction and more. Panama’s carrier vessel data is also available here. Each point in the carrier vessel data layer represents a position of the carriers, but not all positions are displayed. Carrier vessel positions are displayed once per day. In the future, we expect to be able to display more positions. Click on a carrier vessel’s position to view the vessel’s complete track. Global Fishing Watch analyzes this data using the same algorithms we developed for automatic identification system (AIS) data to identify fishing activity and behaviors. The algorithm classifies each broadcast data point from vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch fishing activity heat map. VMS broadcasts data quite differently from AIS and may give different measures of completeness, accuracy and quality. Over time our algorithms will improve across all our broadcast data formats. Global Fishing Watch’s fishing presence algorithm for VMS, as for AIS, is a best effort to algorithmically identify “apparent fishing activity.” It is possible that some fishing activity is not identified, or that the heat map may show apparent fishing activity where fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity,” “fishing,” and “fishing effort,” as “apparent” rather than certain. Any/all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at your own risk. Global Fishing Watch fishing presence algorithms are developed and tested using actual fishing event data collected by observers, combined with expert analysis of AIS vessel movement data resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and automated classification.'
      name: 'Panama VMS'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'public-panama-fishing-vessels': {
      description: 'Dataset for VMS Panama (Public)'
      name: 'Panama VMS (Public Fishing Vessels)'
      schema: {
        source: 'source'
      }
    }
    'public-panama-non-fishing-vessels': {
      description: 'Dataset for VMS Panama - Carriers (Public)'
      name: 'Panama VMS (Public Non fishing vessels)'
      schema: {
        source: 'source'
      }
    }
    'public-panama-vessel-identity-fishing': {
      description: 'Dataset for VMS Panama (Public)'
      name: 'Panama VMS (Public Fishing Vessels)'
    }
    'public-panama-vessel-identity-non-fishing': {
      description: 'Dataset for VMS Panama - Carriers (Public)'
      name: 'Panama VMS (Public Non fishing vessels)'
    }
    'public-peru-fishing-effort': {
      description: 'Vessel monitoring system (VMS) data provided by the Peruvian Government’s Ministry of Production, Fisheries Sector (PRODUCE). Permission to include Peruvian Data required that a 10 day delay to publishing was implemented. Data is collected using their vessel monitoring system (VMS) via satellites and terrestrial receivers, and contains a vessel’s identity gear type, location, speed, direction and more. Global Fishing Watch analyzes this data using the same algorithms developed for automatic identification system (AIS) data to identify fishing activity and behaviors. The algorithm classifies each broadcast data point for these vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch fishing activity heat map. VMS broadcasts data quite differently from AIS and may give different measures of completeness, accuracy and quality. Over time our algorithms will improve across all our broadcast data formats. Global Fishing Watch’s fishing presence algorithm for VMS, as for AIS, is a best effort to algorithmically identify “apparent fishing activity.” It is possible that some fishing activity is not identified, or that the heat map may show apparent fishing activity where fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity,” “fishing” or “fishing effort,” as “apparent,” rather than certain. Any/all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at your own risk. Global Fishing Watch fishing presence algorithms are developed and tested using actual fishing event data collected by observers, combined with expert analysis of AIS vessel movement data resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and automated classification techniques.'
      name: 'Peru VMS'
      schema: {
        bearing: 'bearing'
        fleet: {
          enum: {
            artisanal: 'artisanal'
            industrial: 'industrial'
            'not defined': 'not defined'
            'small-scale': 'small-scale'
          }
          keyword: 'fleet'
        }
        origin: {
          enum: {
            Foreign: 'Foreign'
            PER: 'PER'
          }
          keyword: 'origin'
        }
        speed: 'speed'
      }
    }
    'public-peru-fishing-vessels': {
      description: 'Dataset for VMS Peru (Public)'
      name: 'Peru VMS (Fishing Vessels)'
    }
    'public-peru-presence': {
      description: 'Vessel monitoring system (VMS) data provided by the Peruvian Government’s Ministry of Production, Fisheries Sector (PRODUCE). Permission to include Peruvian Data required that a 10 day delay to publishing was implemented. Data is collected using their vessel monitoring system (VMS) via satellites and terrestrial receivers, and contains a vessel’s identity gear type, location, speed, direction and more. Global Fishing Watch analyzes this data using the same algorithms developed for automatic identification system (AIS) data to identify fishing activity and behaviors. The algorithm classifies each broadcast data point for these vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch fishing activity heat map. VMS broadcasts data quite differently from AIS and may give different measures of completeness, accuracy and quality. Over time our algorithms will improve across all our broadcast data formats. Global Fishing Watch’s fishing detection algorithm for VMS, as for AIS, is a best effort to algorithmically identify “apparent fishing activity.” It is possible that some fishing activity is not identified, or that the heat map may show apparent fishing activity where fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity,” “fishing” or “fishing effort,” as “apparent,” rather than certain. Any/all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at your own risk. Global Fishing Watch fishing detection algorithms are developed and tested using actual fishing event data collected by observers, combined with expert analysis of AIS vessel movement data resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and automated classification techniques.'
      name: 'Peru VMS Presence'
      schema: {
        fleet: {
          enum: {
            artisanal: 'artisanal'
            industrial: 'industrial'
            'not defined': 'not defined'
            'small-scale': 'small-scale'
          }
          keyword: 'fleet'
        }
        origin: {
          enum: {
            Foreign: 'Foreign'
            PER: 'PER'
          }
          keyword: 'origin'
        }
      }
    }
    'public-peru-vessel-identity-fishing': {
      description: 'Dataset for VMS Peru (Public)'
      name: 'Peru VMS (Fishing Vessels)'
    }
    'public-pmn-exploration-areas-individual': {
      description: 'Polymetallic nodules occur across abyssal plains. These nodules can be found at depths from 3000 meters to 6500 meters with high abundance in the Pacific Ocean and the Central Indian Ocean Basin. Nodules form at a rate of 1-3 millimeters per million years as metals from the surrounding water precipitate onto small particles, such as a grain of sand or a fragment of a shell, forming habitat for unique and poorly understood biodiversity. They are primarily composed of manganese, nickel, cobalt, copper, and rare earth elements. Exploration Areas under the International Seabed Authority are areas licensed for exploration of mineral resources to particular States and associated contractors. 75,000 square kilometers are allocated to each contractor for polymetallic nodule Exploration Areas.'
      name: 'PMN Exploration Areas'
      schema: {
        act_date: {
          enum: {
            '1717970400000': '1717970400000'
            '985816800000': '985816800000'
          }
          keyword: 'act_date'
        }
        area_key: 'area_key'
        area_km_2: {
          enum: {
            '2182.876': '2182.876'
            '74919': '74919'
          }
          keyword: 'area_km_2'
        }
        area_type: 'area_type'
        blk_cell: 'blk_cell'
        blk_cell_id: 'blk_cell_id'
        blk_orig: 'blk_orig'
        clst_orig: 'clst_orig'
        cluster_id: 'cluster_id'
        contract_id: {
          enum: {
            BGRPMN1: 'BGRPMN1'
            BMJPMN1: 'BMJPMN1'
            BPHDCPMN1: 'BPHDCPMN1'
            CIICPMN1: 'CIICPMN1'
            CMMPMN1: 'CMMPMN1'
            COMRAPMN1: 'COMRAPMN1'
            DORDPMN1: 'DORDPMN1'
            GSRPMN1: 'GSRPMN1'
            IFREMERPMN1: 'IFREMERPMN1'
            IOMPMN1: 'IOMPMN1'
            IndiaPMN1: 'IndiaPMN1'
            KOREAPMN1: 'KOREAPMN1'
            MARAWAPMN1: 'MARAWAPMN1'
            NORIPMN1: 'NORIPMN1'
            OMSPMN1: 'OMSPMN1'
            TOMLPMN1: 'TOMLPMN1'
            UKSRLPMN1: 'UKSRLPMN1'
            UKSRLPMN2: 'UKSRLPMN2'
            YUZHPMN1: 'YUZHPMN1'
          }
          keyword: 'contract_id'
        }
        remarks: {
          enum: {
            'Total exploration area of CIIC (PMN) is 71,937 sq.km; AreaKM2 was calcualted by ISA': 'Total exploration area of CIIC (PMN) is 71,937 sq.km; AreaKM2 was calcualted by ISA'
            'Total exploration area of COMRA (PMN) is 75,000 sq.km; AreaKM2 was calculated by ISA': 'Total exploration area of COMRA (PMN) is 75,000 sq.km; AreaKM2 was calculated by ISA'
            'Total exploration area of DORD (PMN) is 75,000 sq.km; AreaKM2 was calculated by ISA': 'Total exploration area of DORD (PMN) is 75,000 sq.km; AreaKM2 was calculated by ISA'
            'Total exploration area of GSR (PMN) is 41,468.91606 sq.km': 'Total exploration area of GSR (PMN) is 41,468.91606 sq.km'
            'Total exploration area of GSR (PMN) is 76,728 sq.km; AreaKM2 was calculated by ISA': 'Total exploration area of GSR (PMN) is 76,728 sq.km; AreaKM2 was calculated by ISA'
            'Total exploration area of IFREMER (PMN) is 75,000 sq.km; AreaKM2 was calculated by ISA': 'Total exploration area of IFREMER (PMN) is 75,000 sq.km; AreaKM2 was calculated by ISA'
            'Total exploration area of IOM (PMN) is 75,000 sq.km; AreaKM2 was calculated by ISA': 'Total exploration area of IOM (PMN) is 75,000 sq.km; AreaKM2 was calculated by ISA'
            'Total exploration area of India (PMN) is 75,000 sq.km, AreaKM2 was calculated by ISA': 'Total exploration area of India (PMN) is 75,000 sq.km, AreaKM2 was calculated by ISA'
            'Total exploration area of Korea (PMN) is 75,000 sq.km; AreaKM2 was calculated by ISA': 'Total exploration area of Korea (PMN) is 75,000 sq.km; AreaKM2 was calculated by ISA'
            'Total exploration area of MARAWA (PMN) is 74,990 sq.km; AreaKM2 was calculated by ISA': 'Total exploration area of MARAWA (PMN) is 74,990 sq.km; AreaKM2 was calculated by ISA'
            'Total exploration area of Yuzhmorgeologiya (PMN) is 75,000 sq.km; AreaKM2 was calculated by ISA': 'Total exploration area of Yuzhmorgeologiya (PMN) is 75,000 sq.km; AreaKM2 was calculated by ISA'
            xx: 'xx'
          }
          keyword: 'remarks'
        }
        status: 'status'
        sub_area: 'sub_area'
      }
    }
    'public-pmn-reserved-areas-individual': {
      description: 'Polymetallic nodules occur across abyssal plains. These nodules can be found at depths from 3000 meters to 6500 meters with high abundance in the Pacific Ocean and the Central Indian Ocean Basin. Nodules form at a rate of 1-3 millimeters per million years as metals from the surrounding water precipitate onto small particles, such as a grain of sand or a fragment of a shell, forming habitat for unique and poorly understood biodiversity. They are primarily composed of manganese, nickel, cobalt, copper, and rare earth elements. Reserved Areas under the International Seabed Authority are a critical mechanism to ensure developing countries have access to deep-sea mineral resources in the future. These areas are typically contributed by developed States when they apply for exploration rights.'
      name: 'PMN Reserved Areas'
      schema: {
        act_date: {
          enum: {
            '1617487200000': '1617487200000'
            '988322400000': '988322400000'
          }
          keyword: 'act_date'
        }
        area_key: 'area_key'
        area_km_2: {
          enum: {
            '1032.952': '1032.952'
            '150000': '150000'
          }
          keyword: 'area_km_2'
        }
        area_type: 'area_type'
        blk_cell: 'blk_cell'
        blk_cell_id: 'blk_cell_id'
        blk_orig: {
          enum: {
            '983401200000': '983401200000'
            '986076000000': '986076000000'
          }
          keyword: 'blk_orig'
        }
        clst_orig: 'clst_orig'
        cluster_id: 'cluster_id'
        contract_id: {
          enum: {
            BPHDCPMN1: 'BPHDCPMN1'
            PMNReserved: 'PMNReserved'
          }
          keyword: 'contract_id'
        }
        remarks: {
          enum: {
            'Origin:BGR': 'Origin:BGR'
            'Origin:COMRA': 'Origin:COMRA'
            'Origin:DORD': 'Origin:DORD'
            'Origin:Government of the Republic of Korea': 'Origin:Government of the Republic of Korea'
            'Origin:IFREMER': 'Origin:IFREMER'
            'Origin:INDIA': 'Origin:INDIA'
            'Origin:IOM': 'Origin:IOM'
            'Origin:UKSRL-ll': 'Origin:UKSRL-ll'
            'Origin:Yuzhmorgeologia': 'Origin:Yuzhmorgeologia'
          }
          keyword: 'remarks'
        }
        status: 'status'
        sub_area: 'sub_area'
      }
    }
    'public-pms-exploration-areas-individual': {
      description: 'Polymetallic sulphides, or seafloor massive sulphides, are formed at hydrothermal vents near mid-ocean ridges and back-arc basins between approximately 1,000 and 4,000 meters in depth. They are formed when superheated, mineral-rich fluids from the Earth’s mantle are rapidly cooled by deep water. Rapid cooling results in dissolved metals in the fluid precipitating as metal sulfides. These sulfides and surrounding polymetallic muds can contain copper, zinc, silver, and gold. For polymetallic sulphides, the exploration area allocated to each contractor is 10,000 square kilometres and consists of 100 blocks. Each block is no greater than 100 square kilometres.'
      name: 'PMS Exploration Areas'
      schema: {
        act_date: {
          enum: {
            '1474840800000': '1474840800000'
            '1698098400000': '1698098400000'
          }
          keyword: 'act_date'
        }
        area_key: 'area_key'
        area_km_2: {
          enum: {
            '1': '1'
            '101': '101'
          }
          keyword: 'area_km_2'
        }
        area_type: 'area_type'
        blk_cell: 'blk_cell'
        blk_cell_id: {
          enum: {}
          keyword: 'blk_cell_id'
        }
        blk_orig: {
          enum: {}
          keyword: 'blk_orig'
        }
        clst_orig: {
          enum: {
            A: 'A'
            B: 'B'
            C: 'C'
            D: 'D'
            E: 'E'
          }
          keyword: 'clst_orig'
        }
        cluster_id: {
          enum: {
            A: 'A'
            B: 'B'
            C: 'C'
            D: 'D'
            E: 'E'
            NA: 'NA'
            NR: 'NR'
          }
          keyword: 'cluster_id'
        }
        contract_id: {
          enum: {
            BGRPMS1: 'BGRPMS1'
            COMRAPMS1: 'COMRAPMS1'
            IFREMERPMS1: 'IFREMERPMS1'
            IndiaPMS1: 'IndiaPMS1'
            KOREAPMS1: 'KOREAPMS1'
            POLPMS1: 'POLPMS1'
            RUSFEDPMS1: 'RUSFEDPMS1'
          }
          keyword: 'contract_id'
        }
        status: 'status'
        sub_area: 'sub_area'
      }
    }
    'public-png-fishing-effort': {
      description: "Vessel monitoring system (VMS) data is provided by the The National Fisheries Authority of Papua New Guinea. Data is collected using Papua New Guinea's vessel monitoring (VMS) system via satellites, that contains vessel's identifiers and location, and is published on a five-day delay. Global Fishing Watch infers speed and course for each vessel location and analyzes this data using the same algorithms developed for automatic identification system (AIS) to identify fishing activity and behaviors. The algorithm classifies each broadcast data point from vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch’s fishing activity heat map. VMS broadcasts data differently from AIS and may give different measures of completeness, accuracy, and quality. Global Fishing Watch is continually improving its algorithms across all broadcast data formats to algorithmically identify “apparent fishing activity”. It is possible that some fishing activity is not identified or that the heat map may show apparent fishing activity when fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies the terms “fishing activity”, “fishing” or “fishing effort”, as apparent rather than certain. Any and all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at the user’s discretion. Global Fishing Watch’s fishing detection algorithms are developed and tested using actual fishing event data collected by observers and is combined with expert analysis of AIS vessel movement data, resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and to improve automated classification techniques"
      name: 'Papua New Guinea VMS'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'public-png-fishing-vessels': {
      description: 'Dataset for VMS Papua New Guinea (Public)'
      name: 'Papua New Guinea VMS (Fishing Vessels)'
      schema: {
        source: 'source'
      }
    }
    'public-png-presence': {
      description: "Vessel monitoring system (VMS) data is provided by the The National Fisheries Authority of Papua New Guinea. Data is collected using Papua New Guinea's national VMS  that is provided by the Fisheries Information and Management System (FIMS). VMS data includes vessel identifiers and location, and is published with a five-day delay.\n\nThe activity layer displays a heatmap of vessel presence. The presence is determined by taking two positions per hour per vessel from the positions transmitted by the vessel's VMS."
      name: 'Papua New Guinea VMS'
      schema: {
        bearing: 'bearing'
        speed: 'speed'
      }
    }
    'public-png-vessel-identity-fishing': {
      description: 'Dataset for VMS Papua New Guinea (Public)'
      name: 'Papua New Guinea VMS (Fishing Vessels)'
    }
    'public-ports': {
      description: 'Named ports'
      name: 'Ports'
      schema: {
        name: 'name'
        port_id: 'port_id'
      }
    }
    'public-ports-v1': {
      description: 'Named ports v1'
      name: 'Ports v1'
    }
    'public-presence-viirs-match-prototype': {
      description: 'The night lights vessel detections layer, known as visible infrared imaging radiometer suite or VIIRS, shows vessels at sea that satellites have detected by the light they emit at night. Though not exclusively associated with fishing vessels, this activity layer is likely to show vessels associated with activities like squid fishing, which use bright lights and fish at night.The satellite makes a single over-pass across the entire planet every night, detecting lights not obscured by clouds and designed to give at least one observation globally every day. Because the vessels are detected solely based on light emission, we can detect individual vessels and even entire fishing fleets that are not broadcasting automatic identification system (AIS) and so are not represented in the AIS apparent fishing effort layer. Lights from fixed offshore infrastructure and other non-vessel sources are excluded. Global Fishing Watch ingests boat detections processed from low light imaging data collected by the U.S. National Oceanic and Atmospheric Administration (NOAA) VIIRS. The boat detections are processed in near-real time by NOAA’s Earth Observation Group, located in Boulder, Colorado. The data, known as VIIRS boat detections, picks up the presence of fishing vessels using lights to attract catch or to conduct operations at night. More than 85% of the detections are from vessels that lack AIS or Vessel Monitoring System (VMS) transponders. Due to the orbit design of polar orbiting satellites, regions closer to polar will have more over-passes per day, while equatorial regions have only one over-pass daily. Read more about this product, and download the data <a href="https://ngdc.noaa.gov/eog/viirs/download_boat.html" target="_blank" rel="noopener">here</a>.Those using night light detections data should acknowledge the South Atlantic Anomaly (SAA), an area where the Earth\'s inner Van Allen radiation belt is at its lowest altitude, allowing more energetic particles from space to penetrate. When such particles hit the sensors on a satellite, this can create a false signal which might cause the algorithm to recognize it as a boat presence. A filtration algorithm has been applied but there may still be some mis-identification. The GFW layer includes quality flags (QF), including a filter to show only detections which NOAA has classified as vessels (QF1)'
      name: 'VIIRS Match'
      schema: {
        matched: {
          enum: {
            false: 'false'
            true: 'true'
          }
          keyword: 'matched'
        }
        qf_detect: {
          enum: {
            '1': '1'
            '10': '10'
            '2': '2'
            '3': '3'
            '5': '5'
            '7': '7'
          }
          keyword: 'qf_detect'
        }
        radiance: {
          enum: {
            '1': '1'
            '1000': '1000'
          }
          keyword: 'radiance'
        }
        shiptype: {
          enum: {
            carrier: 'carrier'
            fishing: 'fishing'
            support: 'support'
            unknown: 'unknown'
          }
          keyword: 'shiptype'
        }
        source: {
          enum: {
            AIS: 'AIS'
            ais_scored: 'ais_scored'
            chile_vms_aquaculture: 'chile_vms_aquaculture'
            chile_vms_industry: 'chile_vms_industry'
            chile_vms_small_fisheries: 'chile_vms_small_fisheries'
            chile_vms_transport: 'chile_vms_transport'
            indovms: 'indovms'
            mexico_vms: 'mexico_vms'
            namibia_vms: 'namibia_vms'
            panama_vms: 'panama_vms'
            'peru.historic': 'peru.historic'
            'peru.trasat_api': 'peru.trasat_api'
            unknown: 'unknown'
          }
          keyword: 'source'
        }
      }
    }
    'public-protectedseas': {
      description: 'Protected seas (only category IUCN MPA)'
      name: 'Protected Seas'
      schema: {
        removal_of: {
          enum: {
            '1': '1'
            '2': '2'
            '3': '3'
            '4': '4'
            '5': '5'
          }
          keyword: 'removal_of'
        }
      }
    }
    'public-protectedseas-all': {
      description: 'Protected seas all'
      name: 'Protected Seas all'
      schema: {
        category_name: {
          enum: {
            'Fisheries Management Area': 'Fisheries Management Area'
            'IUCN MPA': 'IUCN MPA'
            'Jurisdictional Authority Area': 'Jurisdictional Authority Area'
            OECM: 'OECM'
            Other: 'Other'
            'Recreational Area': 'Recreational Area'
            TBD: 'TBD'
            'Vessel Reporting Area': 'Vessel Reporting Area'
            'Vessel Restricted Area': 'Vessel Restricted Area'
            'Voluntary Conservation Measure Area': 'Voluntary Conservation Measure Area'
            'Water Quality/Human Health Area': 'Water Quality/Human Health Area'
          }
          keyword: 'category_name'
        }
        removal_of_marine_life_is_prohibited: {
          enum: {
            '1': '1'
            '2': '2'
            '3': '3'
            '4': '4'
            '5': '5'
          }
          keyword: 'removal_of_marine_life_is_prohibited'
        }
      }
    }
    'public-rfmo': {
      description: "Regional fisheries management organizations (RFMOs) are international bodies formed by countries with a shared interest in managing or conserving fish stocks in a particular region. Some manage all the fish stocks found in a given area, while others focus on specific highly migratory species, notably tuna. The regional fisheries management organization on the Global Fishing Watch map currently includes the five tuna regional fisheries management organizations. See more detailed <a href='https://globalfishingwatch.org/faqs/reference-layer-sources/' target='_blank' rel=noopener'>metadata information</a> for this layer."
      name: 'RFMO'
      schema: {
        ID: {
          enum: {
            APFIC: 'APFIC'
            'BOBP-IGO': 'BOBP-IGO'
            CCAMLR: 'CCAMLR'
            CCBSP: 'CCBSP'
            CCSBT: 'CCSBT'
            'CCSBT Primary Area': 'CCSBT Primary Area'
            COREP: 'COREP'
            CPPS: 'CPPS'
            CRFM: 'CRFM'
            CTMFM: 'CTMFM'
            FCWC: 'FCWC'
            FFA: 'FFA'
            GFCM: 'GFCM'
            IATTC: 'IATTC'
            ICCAT: 'ICCAT'
            ICES: 'ICES'
            IOTC: 'IOTC'
            IPHC: 'IPHC'
            LTA: 'LTA'
            NAFO: 'NAFO'
            NAMMCO: 'NAMMCO'
            NASCO: 'NASCO'
            NEAFC: 'NEAFC'
            NPAFC: 'NPAFC'
            NPFC: 'NPFC'
            OSPESCA: 'OSPESCA'
            PERSGA: 'PERSGA'
            PICES: 'PICES'
            RECOFI: 'RECOFI'
            SEAFDEC: 'SEAFDEC'
            SIOFA: 'SIOFA'
            SPC: 'SPC'
            SPRFMO: 'SPRFMO'
            SRFC: 'SRFC'
            SWIOFC: 'SWIOFC'
            WCPFC: 'WCPFC'
          }
          keyword: 'ID'
        }
      }
    }
    'public-seagrasses': {
      description: "<h2>Overview</h2>\n<ul>\n<li>Seagrasses are a productive ecosystem found globally in shallow marine areas where they provide food and habitat for organisms and play a key role in nutrient cycling. This dataset shows the global distribution of seagrasses.</li>\n<ul>\n<h2>Source</h2>\n<ul>\n <a href='https://data.unep-wcmc.org/datasets/7'>UNEP-WCMC, Short FT (2021). Global distribution of seagrasses (version 7.1). Seventh update to the data layer used in Green and Short (2003). Cambridge (UK): UN Environment World Conservation Monitoring Centre. Data DOI: https://doi.org/10.34892/x6r3-d211. </a></li>"
      name: 'Seagrasses'
      schema: {
        BIO_CLASS: {
          enum: {}
          keyword: 'BIO_CLASS'
        }
        FAMILY: {
          enum: {}
          keyword: 'FAMILY'
        }
        GENUS: {
          enum: {}
          keyword: 'GENUS'
        }
        habitat: {
          enum: {}
          keyword: 'habitat'
        }
      }
    }
    'public-seamounts': {
      description: "<h2>Overview</h2>\n<ul>\n<li>Seamounts are underwater mountains of volcanic origin that can generate an upwelling of nutrients, supporting increased biological productivity, species richness and distinct communities. This dataset of global seafloor geomorphic features includes seamounts, which are defined as peaks that rise over 1,000 m above the seafloor.</li>\n<ul>\n<h2>Source</h2>\n<ul>\n <a href='https://bluehabitats.org/'>Blue Habitats. Seafloor Geomorphic Features Map by Harris, P.T., Macmillan-Lawler, M., Rupp, J. and Baker, E.K. 2014. Geomorphology of the oceans. Marine Geology, 352: 4-24.</a></li>"
      name: 'Seamounts'
      schema: {
        Height: {
          enum: {
            '0': '0'
            '8000': '8000'
          }
          keyword: 'Height'
        }
      }
    }
    'public-south-atlantic-isa-claim-areas': {
      description: 'This layer depicts the ISA claim areas for seabed mining in the South Atlantic Ocean, which contain resources cobalt-rich ferromanganese crusts. Brazil is currently the only country holding leases in this region.'
      name: 'South Atlantic ISA Claim Areas'
      schema: {
        contractor: 'contractor'
        label: 'label'
      }
    }
    'public-tristan-seamounts-200-1618586314138': {
      description: 'Depth: -200 m'
      name: 'Depth: -200 m'
    }
    'public-tristan-seamounts-3000-1618586349746': {
      description: 'Depth: -3000 m'
      name: 'Depth: -3000 m'
    }
    'public-tristan-seamounts-existing-1618586378121': {
      description: '2% of EEZ'
      name: 'Existing Seamount Fishing Zones'
    }
    'public-tuna-rfmo': {
      description: 'Regional fisheries management organizations (RFMOs) are international bodies formed by countries with a shared interest in managing or conserving fish stocks in a particular region. Some manage all the fish stocks found in a given area, while others focus on specific highly migratory species, notably tuna. The regional fisheries management organization on the Global Fishing Watch map currently includes the five tuna regional fisheries management organizations.'
      name: 'RFMOs (Source: FAO)'
    }
    'public-wdpa-may-2021-marine': {
      description: 'Marine protected areas (MPAs) are areas of the ocean set aside for long-term conservation. These can have different levels of protection, and the range of activities allowed or prohibited within their boundaries varies considerably. Source: World Database on Protected Areas. Last updated: May 2021.'
      name: 'MPAs (Source: WDPA)'
    }
    'public-wpp-nri': {
      description: 'The WPP-NRI (Wilayah Pengelolaan Perikanan Negara Republik Indonesia) are fisheries management areas for fishing, conservation, research and fisheries development which cover inland waters, archipelagic waters, and territorial seas within and outside the exclusive economic zone of Indonesia.'
      name: 'WPP NRI'
    }
  }
  flags: {
    ABW: 'Aruba'
    AFG: 'Afghanistan'
    AGO: 'Angola'
    AIA: 'Anguilla'
    ALA: 'Åland Islands'
    ALB: 'Albania'
    AND: 'Andorra'
    ARE: 'United Arab Emirates'
    ARG: 'Argentina'
    ARM: 'Armenia'
    ASM: 'American Samoa'
    ATA: 'Antarctica'
    ATF: 'French Southern Territories'
    ATG: 'Antigua and Barbuda'
    AUS: 'Australia'
    AUT: 'Austria'
    AZE: 'Azerbaijan'
    BDI: 'Burundi'
    BEL: 'Belgium'
    BEN: 'Benin'
    BES: 'Bonaire, Sint Eustatius and Saba'
    BFA: 'Burkina Faso'
    BGD: 'Bangladesh'
    BGR: 'Bulgaria'
    BHR: 'Bahrain'
    BHS: 'Bahamas'
    BIH: 'Bosnia and Herzegovina'
    BLM: 'Saint Barthélemy'
    BLR: 'Belarus'
    BLZ: 'Belize'
    BMU: 'Bermuda'
    BOL: 'Bolivia (Plurinational State of)'
    BRA: 'Brazil'
    BRB: 'Barbados'
    BRN: 'Brunei'
    BTN: 'Bhutan'
    BVT: 'Bouvet Island'
    BWA: 'Botswana'
    CAF: 'Central African Republic'
    CAN: 'Canada'
    CCK: 'Cocos (Keeling) Islands (the)'
    CHE: 'Switzerland'
    CHL: 'Chile'
    CHN: 'China'
    CIV: 'Ivory Coast'
    CMR: 'Cameroon'
    COD: 'Democratic Republic of the Congo'
    COG: 'Republic of the Congo'
    COK: 'Cook Islands'
    COL: 'Colombia'
    COM: 'Comoros'
    CPV: 'Cape Verde'
    CRI: 'Costa Rica'
    CUB: 'Cuba'
    CUW: 'Curaçao'
    CXR: 'Christmas Island'
    CYM: 'Cayman Islands'
    CYP: 'Cyprus'
    CZE: 'Czech Republic'
    DEU: 'Germany'
    DJI: 'Djibouti'
    DMA: 'Dominica'
    DNK: 'Denmark'
    DOM: 'Dominican Republic'
    DZA: 'Algeria'
    ECU: 'Ecuador'
    EGY: 'Egypt'
    ERI: 'Eritrea'
    ESH: 'Western Sahara'
    ESP: 'Spain'
    EST: 'Estonia'
    ETH: 'Ethiopia'
    FIN: 'Finland'
    FJI: 'Fiji'
    FLK: 'Falkland Islands (Malvinas)'
    FRA: 'France'
    FRO: 'Faroe Islands'
    FSM: 'Micronesia (Federated States of)'
    GAB: 'Gabon'
    GBR: 'United Kingdom'
    GEO: 'Georgia'
    GGY: 'Guernsey'
    GHA: 'Ghana'
    GIB: 'Gibraltar'
    GIN: 'Guinea'
    GLP: 'Guadeloupe'
    GMB: 'Gambia (Republic of The)'
    GNB: 'Guinea-Bissau'
    GNQ: 'Equatorial Guinea'
    GRC: 'Greece'
    GRD: 'Grenada'
    GRL: 'Greenland'
    GTM: 'Guatemala'
    GUF: 'French Guiana'
    GUM: 'Guam'
    GUY: 'Guyana'
    HKG: 'Hong Kong'
    HMD: 'Heard Island and McDonald Islands'
    HND: 'Honduras'
    HRV: 'Croatia'
    HTI: 'Haiti'
    HUN: 'Hungary'
    IDN: 'Indonesia'
    IMN: 'Isle of Man'
    IND: 'India'
    IOT: 'British Indian Ocean Territory (Chagos Archipelago)'
    IRL: 'Ireland'
    IRN: 'Iran (Islamic Republic of)'
    IRQ: 'Iraq'
    ISL: 'Iceland'
    ISR: 'Israel'
    ITA: 'Italy'
    JAM: 'Jamaica'
    JEY: 'Jersey'
    JOR: 'Jordan'
    JPN: 'Japan'
    KAZ: 'Kazakhstan'
    KEN: 'Kenya'
    KGZ: 'Kyrgyzstan'
    KHM: 'Cambodia'
    KIR: 'Kiribati'
    KNA: 'Saint Kitts and Nevis'
    KOR: 'Republic of Korea'
    KWT: 'Kuwait'
    LAO: 'Laos'
    LBN: 'Lebanon'
    LBR: 'Liberia'
    LBY: 'Libya'
    LCA: 'Saint Lucia'
    LIE: 'Liechtenstein'
    LKA: 'Sri Lanka'
    LSO: 'Lesotho'
    LTU: 'Lithuania'
    LUX: 'Luxembourg'
    LVA: 'Latvia'
    MAC: 'Macao'
    MAF: 'Saint Martin (French part)'
    MAR: 'Morocco'
    MCO: 'Monaco'
    MDA: 'Republic of Moldova'
    MDG: 'Madagascar'
    MDV: 'Maldives'
    MEX: 'Mexico'
    MHL: 'Marshall Islands'
    MKD: 'Macedonia'
    MLI: 'Mali'
    MLT: 'Malta'
    MMR: 'Myanmar'
    MNE: 'Montenegro'
    MNG: 'Mongolia'
    MNP: 'Northern Mariana Islands'
    MOZ: 'Mozambique'
    MRT: 'Mauritania'
    MSR: 'Montserrat'
    MTQ: 'Martinique'
    MUS: 'Mauritius'
    MWI: 'Malawi'
    MYS: 'Malaysia'
    MYT: 'Mayotte'
    NAM: 'Namibia'
    NCL: 'New Caledonia'
    NER: 'Niger'
    NFK: 'Norfolk Island'
    NGA: 'Nigeria'
    NIC: 'Nicaragua'
    NIU: 'Niue'
    NLD: 'Netherlands'
    NOR: 'Norway'
    NPL: 'Nepal'
    NRU: 'Nauru'
    NZL: 'New Zealand'
    OMN: 'Oman'
    PAK: 'Pakistan'
    PAN: 'Panama'
    PCN: 'Pitcairn'
    PER: 'Peru'
    PHL: 'Philippines'
    PLW: 'Palau'
    PNG: 'Papua New Guinea'
    POL: 'Poland'
    PRI: 'Puerto Rico'
    PRK: "Democratic People's Republic of Korea"
    PRT: 'Portugal'
    PRY: 'Paraguay'
    PSE: 'Palestine'
    PYF: 'French Polynesia'
    QAT: 'Qatar'
    REU: 'Réunion'
    ROU: 'Romania'
    RUS: 'Russia'
    RWA: 'Rwanda'
    SAU: 'Saudi Arabia'
    SDN: 'Sudan'
    SEN: 'Senegal'
    SGP: 'Singapore'
    SGS: 'South Georgia and the South Sandwich Islands'
    SHN: 'Saint Helena'
    SJM: 'Svalbard and Jan Mayen'
    SLB: 'Solomon Islands'
    SLE: 'Sierra Leone'
    SLV: 'El Salvador'
    SMR: 'San Marino'
    SOM: 'Somalia'
    SPM: 'Saint Pierre and Miquelon'
    SRB: 'Serbia'
    SSD: 'South Sudan'
    STP: 'São Tomé and Príncipe'
    SUR: 'Suriname'
    SVK: 'Slovakia'
    SVN: 'Slovenia'
    SWE: 'Sweden'
    SWZ: 'Eswatini'
    SXM: 'Sint Maarten (Dutch part)'
    SYC: 'Seychelles'
    SYR: 'Syria'
    TAI: 'Chinese Taipei'
    TCA: 'Turks and Caicos Islands'
    TCD: 'Chad'
    TGO: 'Togo'
    THA: 'Thailand'
    TJK: 'Tajikistan'
    TKL: 'Tokelau'
    TKM: 'Turkmenistan'
    TLS: 'Timor-Leste'
    TON: 'Tonga'
    TTO: 'Trinidad and Tobago'
    TUN: 'Tunisia'
    TUR: 'Turkey'
    TUV: 'Tuvalu'
    TWN: 'Chinese Taipei'
    TZA: 'Tanzania'
    UGA: 'Uganda'
    UKR: 'Ukraine'
    UMI: 'United States Minor Outlying Islands'
    UNK: 'Kosovo'
    URY: 'Uruguay'
    USA: 'United States of America'
    UZB: 'Uzbekistan'
    VAT: 'Holy See (Vatican City)'
    VCT: 'Saint Vincent and the Grenadines'
    VEN: 'Venezuela'
    VGB: 'British Virgin Islands'
    VIR: 'United States Virgin Islands'
    VNM: 'Vietnam'
    VUT: 'Vanuatu'
    WLF: 'Wallis and Futuna'
    WSM: 'Samoa'
    YEM: 'Yemen'
    ZAF: 'South Africa'
    ZMB: 'Zambia'
    ZWE: 'Zimbabwe'
  }
  timebar: {
    bookmark: {
      deleteBookmark: 'Delete time range bookmark'
      goToBookmark: 'Go to your bookmarked time range'
    }
    dragLabel: 'Drag to change the time range'
    intervals: {
      day: 'day'
      dayTooltip: 'See daily data'
      hour: 'hour'
      hourTooltip: 'See hourly data'
      month: 'month'
      monthTooltip: 'See monthly data'
      year: 'year'
      yearTooltip: 'See yearly data'
    }
    lastUpdate: 'Last update'
    playback: {
      changeAnimationSpeed: 'Change animation speed'
      moveBack: 'Move back'
      moveForward: 'Move forward'
      pauseAnimation: 'Pause Animation'
      playAnimation: 'Play animation'
      toogleAnimationLooping: 'Toggle animation looping'
    }
    setBookmark: 'Bookmark current time range'
    timerange: {
      day: 'Day'
      done: 'Done'
      end: 'End'
      endBeforeStart: 'The end needs to be after the start'
      errorEarlyStart: 'Your start date is the earliest date with data available.'
      errorLatestEnd: 'Your end date is the latest date with data available.'
      errorMaxRange: 'Your time range is the maximum range with data available.'
      errorMinRange: 'Your start and end date must be at least one day apart.'
      last30days: 'Last 30 days'
      last3months: 'Last 3 months'
      last6months: 'Last 6 months'
      lastYear: 'Last year'
      month: 'Month'
      selectAValidDate: 'Please select a valid date'
      start: 'Start'
      title: 'Select a time range'
      tooLongForDays: 'Your timerange is too long to see individual days'
      tooLongForMonths: 'Your timerange is too long to see individual months'
      year: 'Year'
    }
    trackEvents: {
      events: 'events'
    }
    zoomTo: 'Zoom to'
  }
}

export default Resources
