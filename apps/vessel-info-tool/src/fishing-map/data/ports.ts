const ports = [
  {
    id: 'usa-marinadelrey',
    name: 'MARINA DEL REY',
    flag: 'USA',
  },
  {
    id: 'usa-southpasadena',
    name: 'SOUTH PASADENA',
    flag: 'USA',
  },
  {
    id: 'usa-greencovesprings',
    name: 'GREEN COVE SPRINGS',
    flag: 'USA',
  },
  {
    id: 'bhs-dunmoretown',
    name: 'DUNMORE TOWN',
    flag: 'BHS',
  },
  {
    id: 'fra-douarnenez',
    name: 'DOUARNENEZ',
    flag: 'FRA',
  },
  {
    id: "fra-lessablesd'olonne",
    name: "LES SABLES D' OLONNE",
    flag: 'FRA',
  },
  {
    id: 'esp-cartagena',
    name: 'CARTAGENA',
    flag: 'ESP',
  },
  {
    id: 'fra-ouistreham',
    name: 'OUISTREHAM',
    flag: 'FRA',
  },
  {
    id: 'esp-calpe',
    name: 'CALPE',
    flag: 'ESP',
  },
  {
    id: 'chn-haian',
    name: 'HAIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-yuhuan',
    name: 'YUHUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-rongcheng',
    name: 'RONGCHENG',
    flag: 'CHN',
  },
  {
    id: 'jpn-onagawa',
    name: 'ONAGAWA',
    flag: 'JPN',
  },
  {
    id: 'png-portmoresby',
    name: 'PORT MORESBY',
    flag: 'PNG',
  },
  {
    id: 'nzl-seaviewmarina',
    name: 'SEAVIEW MARINA',
    flag: 'NZL',
  },
  {
    id: 'usa-stpaul',
    name: 'ST PAUL',
    flag: 'USA',
  },
  {
    id: 'gbr-beaucette',
    name: 'BEAUCETTE',
    flag: 'GBR',
  },
  {
    id: 'fra-pornichet',
    name: 'PORNICHET',
    flag: 'FRA',
  },
  {
    id: 'nor-sture',
    name: 'STURE',
    flag: 'NOR',
  },
  {
    id: 'pol-hel',
    name: 'HEL',
    flag: 'POL',
  },
  {
    id: 'tur-yorukler',
    name: 'YORUKLER',
    flag: 'TUR',
  },
  {
    id: 'kwt-minaalzour',
    name: 'MINA AL ZOUR',
    flag: 'KWT',
  },
  {
    id: 'ind-vizag',
    name: 'VIZAG',
    flag: 'IND',
  },
  {
    id: 'phl-pasacao',
    name: 'PASACAO',
    flag: 'PHL',
  },
  {
    id: 'hnd-puertocastilla',
    name: 'PUERTO CASTILLA',
    flag: 'HND',
  },
  {
    id: 'fin-roytta',
    name: 'ROYTTA',
    flag: 'FIN',
  },
  {
    id: 'bhr-galali',
    name: 'GALALI',
    flag: 'BHR',
  },
  {
    id: 'irl-drogheda',
    name: 'DROGHEDA',
    flag: 'IRL',
  },
  {
    id: 'usa-wrangell',
    name: 'WRANGELL',
    flag: 'USA',
  },
  {
    id: 'hrv-betina',
    name: 'BETINA',
    flag: 'HRV',
  },
  {
    id: 'nor-hemnesberget',
    name: 'HEMNESBERGET',
    flag: 'NOR',
  },
  {
    id: 'rus-vitim',
    name: 'VITIM',
    flag: 'RUS',
  },
  {
    id: 'pyf-hao',
    name: 'HAO',
    flag: 'PYF',
  },
  {
    id: 'deu-lauffen',
    name: 'LAUFFEN',
    flag: 'DEU',
  },
  {
    id: 'usa-cheboygan',
    name: 'CHEBOYGAN',
    flag: 'USA',
  },
  {
    id: 'nor-forsand',
    name: 'FORSAND',
    flag: 'NOR',
  },
  {
    id: 'ita-stintino',
    name: 'STINTINO',
    flag: 'ITA',
  },
  {
    id: 'rus-temryuk',
    name: 'TEMRYUK',
    flag: 'RUS',
  },
  {
    id: 'hun-veroce',
    name: 'VEROCE',
    flag: 'HUN',
  },
  {
    id: 'rus-moscow',
    name: 'MOSCOW',
    flag: 'RUS',
  },
  {
    id: 'pan-sambabonita',
    name: 'SAMBA BONITA',
    flag: 'PAN',
  },
  {
    id: 'nld-lelystad',
    name: 'LELYSTAD',
    flag: 'NLD',
  },
  {
    id: 'tur-darica',
    name: 'DARICA',
    flag: 'TUR',
  },
  {
    id: 'cyp-latsi',
    name: 'LATSI',
    flag: 'CYP',
  },
  {
    id: 'aze-hovsan',
    name: 'HOVSAN',
    flag: 'AZE',
  },
  {
    id: 'idn-gresik',
    name: 'GRESIK',
    flag: 'IDN',
  },
  {
    id: 'idn-tarjun',
    name: 'TARJUN',
    flag: 'IDN',
  },
  {
    id: 'chn-jiangdu',
    name: 'JIANGDU',
    flag: 'CHN',
  },
  {
    id: 'jpn-minamata',
    name: 'MINAMATA',
    flag: 'JPN',
  },
  {
    id: 'gbr-castlebay',
    name: 'CASTLE BAY',
    flag: 'GBR',
  },
  {
    id: 'esp-altea',
    name: 'ALTEA',
    flag: 'ESP',
  },
  {
    id: 'idn-dobo',
    name: 'DOBO',
    flag: 'IDN',
  },
  {
    id: 'aus-taroona',
    name: 'TAROONA',
    flag: 'AUS',
  },
  {
    id: 'jpn-shigei',
    name: 'SHIGEI',
    flag: 'JPN',
  },
  {
    id: 'jpn-shiraoi',
    name: 'SHIRAOI',
    flag: 'JPN',
  },
  {
    id: 'glp-legosier',
    name: 'LE GOSIER',
    flag: 'GLP',
  },
  {
    id: 'bra-ubu',
    name: 'UBU',
    flag: 'BRA',
  },
  {
    id: 'ind-krishnapatnam',
    name: 'KRISHNAPATNAM',
    flag: 'IND',
  },
  {
    id: 'mys-fortunestar',
    name: 'FORTUNE STAR',
    flag: 'MYS',
  },
  {
    id: 'fra-argenteuil',
    name: 'ARGENTEUIL',
    flag: 'FRA',
  },
  {
    id: 'rus-pevek',
    name: 'PEVEK',
    flag: 'RUS',
  },
  {
    id: 'ita-pozzuoli',
    name: 'POZZUOLI',
    flag: 'ITA',
  },
  {
    id: 'nzl-paihia',
    name: 'PAIHIA',
    flag: 'NZL',
  },
  {
    id: 'cyp-ayianapa',
    name: 'AYIA NAPA',
    flag: 'CYP',
  },
  {
    id: 'ita-fontanebianche',
    name: 'FONTANE BIANCHE',
    flag: 'ITA',
  },
  {
    id: 'pan-limonbaymarina',
    name: 'LIMON BAY MARINA',
    flag: 'PAN',
  },
  {
    id: 'usa-welcome',
    name: 'WELCOME',
    flag: 'USA',
  },
  {
    id: 'usa-alton',
    name: 'ALTON',
    flag: 'USA',
  },
  {
    id: 'fra-aubervilliers',
    name: 'AUBERVILLIERS',
    flag: 'FRA',
  },
  {
    id: 'usa-ingleside',
    name: 'INGLESIDE',
    flag: 'USA',
  },
  {
    id: 'usa-osceola',
    name: 'OSCEOLA',
    flag: 'USA',
  },
  {
    id: 'usa-capegirardeau',
    name: 'CAPE GIRARDEAU',
    flag: 'USA',
  },
  {
    id: 'can-windsor',
    name: 'WINDSOR',
    flag: 'CAN',
  },
  {
    id: 'usa-windmillharbor',
    name: 'WINDMILL HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-woodshole',
    name: 'WOODS HOLE',
    flag: 'USA',
  },
  {
    id: 'vir-cruzbay',
    name: 'CRUZ BAY',
    flag: 'VIR',
  },
  {
    id: 'arg-sanlorenzo',
    name: 'SAN LORENZO',
    flag: 'ARG',
  },
  {
    id: 'fra-lorient',
    name: 'LORIENT',
    flag: 'FRA',
  },
  {
    id: 'nld-makkum',
    name: 'MAKKUM',
    flag: 'NLD',
  },
  {
    id: 'fra-saintjeancapferrat',
    name: 'SAINTJEAN CAP FERRAT',
    flag: 'FRA',
  },
  {
    id: 'fra-basel',
    name: 'BASEL',
    flag: 'FRA',
  },
  {
    id: 'nor-frihetsholmen',
    name: 'FRIHETSHOLMEN',
    flag: 'NOR',
  },
  {
    id: 'deu-passau',
    name: 'PASSAU',
    flag: 'DEU',
  },
  {
    id: 'ita-santagatamilitello',
    name: 'SANT AGATA MILITELLO',
    flag: 'ITA',
  },
  {
    id: 'tur-diliskelesi',
    name: 'DILISKELESI',
    flag: 'TUR',
  },
  {
    id: 'idn-surabaya',
    name: 'SURABAYA',
    flag: 'IDN',
  },
  {
    id: 'chn-macau',
    name: 'MACAU',
    flag: 'CHN',
  },
  {
    id: 'idn-badas',
    name: 'BADAS',
    flag: 'IDN',
  },
  {
    id: 'chn-putian',
    name: 'PUTIAN',
    flag: 'CHN',
  },
  {
    id: 'phl-villanueva',
    name: 'VILLANUEVA',
    flag: 'PHL',
  },
  {
    id: 'jpn-ryotsu',
    name: 'RYOTSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-soma',
    name: 'SOMA',
    flag: 'JPN',
  },
  {
    id: 'ncl-tadine',
    name: 'TADINE',
    flag: 'NCL',
  },
  {
    id: 'esp-aguadulce',
    name: 'AGUADULCE',
    flag: 'ESP',
  },
  {
    id: 'idn-kolaka',
    name: 'KOLAKA',
    flag: 'IDN',
  },
  {
    id: 'phl-tabaco',
    name: 'TABACO',
    flag: 'PHL',
  },
  {
    id: 'jpn-shimabara',
    name: 'SHIMABARA',
    flag: 'JPN',
  },
  {
    id: 'esp-almeria',
    name: 'ALMERIA',
    flag: 'ESP',
  },
  {
    id: 'nld-terschelling',
    name: 'TERSCHELLING',
    flag: 'NLD',
  },
  {
    id: 'deu-freesendorf',
    name: 'FREESENDORF',
    flag: 'DEU',
  },
  {
    id: 'tha-songkhla',
    name: 'SONGKHLA',
    flag: 'THA',
  },
  {
    id: 'chn-nanhui',
    name: 'NANHUI',
    flag: 'CHN',
  },
  {
    id: 'aia-westendvillage',
    name: 'WEST END VILLAGE',
    flag: 'AIA',
  },
  {
    id: 'are-fatair',
    name: 'FATAIR',
    flag: 'ARE',
  },
  {
    id: 'chn-binzhou',
    name: 'BINZHOU',
    flag: 'CHN',
  },
  {
    id: 'usa-texascity',
    name: 'TEXAS CITY',
    flag: 'USA',
  },
  {
    id: 'usa-bettendorf',
    name: 'BETTENDORF',
    flag: 'USA',
  },
  {
    id: 'usa-quincy',
    name: 'QUINCY',
    flag: 'USA',
  },
  {
    id: 'ita-portoazzurro',
    name: 'PORTO AZZURRO',
    flag: 'ITA',
  },
  {
    id: 'sau-jizan',
    name: 'JIZAN',
    flag: 'SAU',
  },
  {
    id: 'usa-frankfort',
    name: 'FRANKFORT',
    flag: 'USA',
  },
  {
    id: 'nor-mongstad',
    name: 'MONGSTAD',
    flag: 'NOR',
  },
  {
    id: 'swe-bjorlandakile',
    name: 'BJORLANDA KILE',
    flag: 'SWE',
  },
  {
    id: 'usa-clarkspoint',
    name: 'CLARKS POINT',
    flag: 'USA',
  },
  {
    id: 'fra-venables',
    name: 'VENABLES',
    flag: 'FRA',
  },
  {
    id: 'dma-saintjoseph',
    name: 'SAINT JOSEPH',
    flag: 'DMA',
  },
  {
    id: 'fra-elbeuf',
    name: 'ELBEUF',
    flag: 'FRA',
  },
  {
    id: 'rus-vysotsk',
    name: 'VYSOTSK',
    flag: 'RUS',
  },
  {
    id: 'nor-kjopmannskjaer',
    name: 'KJOPMANNSKJAER',
    flag: 'NOR',
  },
  {
    id: 'bel-ghlin',
    name: 'GHLIN',
    flag: 'BEL',
  },
  {
    id: 'usa-newport',
    name: 'NEWPORT',
    flag: 'USA',
  },
  {
    id: 'usa-longbeach',
    name: 'LONG BEACH',
    flag: 'USA',
  },
  {
    id: 'cri-golfito',
    name: 'GOLFITO',
    flag: 'CRI',
  },
  {
    id: 'usa-portmanatee',
    name: 'PORT MANATEE',
    flag: 'USA',
  },
  {
    id: 'grl-nanortalik',
    name: 'NANORTALIK',
    flag: 'GRL',
  },
  {
    id: 'isl-saudarkrokur',
    name: 'SAUDARKROKUR',
    flag: 'ISL',
  },
  {
    id: 'gbr-maldon',
    name: 'MALDON',
    flag: 'GBR',
  },
  {
    id: 'nld-yerseke',
    name: 'YERSEKE',
    flag: 'NLD',
  },
  {
    id: 'nor-bronnoysund',
    name: 'BRONNOYSUND',
    flag: 'NOR',
  },
  {
    id: 'grc-sami',
    name: 'SAMI',
    flag: 'GRC',
  },
  {
    id: 'deu-norderney',
    name: 'NORDERNEY',
    flag: 'DEU',
  },
  {
    id: 'jpn-kanda',
    name: 'KANDA',
    flag: 'JPN',
  },
  {
    id: 'chn-huludao',
    name: 'HULUDAO',
    flag: 'CHN',
  },
  {
    id: 'bhs-inaguaislands',
    name: 'INAGUA ISLANDS',
    flag: 'BHS',
  },
  {
    id: 'can-porthawkesbury',
    name: 'PORT HAWKESBURY',
    flag: 'CAN',
  },
  {
    id: 'arg-rosario',
    name: 'ROSARIO',
    flag: 'ARG',
  },
  {
    id: 'nld-katwijk',
    name: 'KATWIJK',
    flag: 'NLD',
  },
  {
    id: 'deu-emmerich',
    name: 'EMMERICH',
    flag: 'DEU',
  },
  {
    id: 'tur-yesilovacik',
    name: 'YESILOVACIK',
    flag: 'TUR',
  },
  {
    id: 'rus-ustluga',
    name: 'UST LUGA',
    flag: 'RUS',
  },
  {
    id: 'mex-zaapfield',
    name: 'ZAAP FIELD',
    flag: 'MEX',
  },
  {
    id: 'grd-hillsborough',
    name: 'HILLSBOROUGH',
    flag: 'GRD',
  },
  {
    id: 'nld-delft',
    name: 'DELFT',
    flag: 'NLD',
  },
  {
    id: 'deu-neuss',
    name: 'NEUSS',
    flag: 'DEU',
  },
  {
    id: 'swe-koping',
    name: 'KOPING',
    flag: 'SWE',
  },
  {
    id: 'grc-kythnosanchorage',
    name: 'KYTHNOS ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'are-ummaldalkh',
    name: 'UMM ALDALKH',
    flag: 'ARE',
  },
  {
    id: 'gbr-pwllheli',
    name: 'PWLLHELI',
    flag: 'GBR',
  },
  {
    id: 'rus-anadyr',
    name: 'ANADYR',
    flag: 'RUS',
  },
  {
    id: 'bel-floriffoux',
    name: 'FLORIFFOUX',
    flag: 'BEL',
  },
  {
    id: 'esp-pobradocaraminal',
    name: 'POBRA DO CARAMINAL',
    flag: 'ESP',
  },
  {
    id: 'can-gananoque',
    name: 'GANANOQUE',
    flag: 'CAN',
  },
  {
    id: 'usa-monroe',
    name: 'MONROE',
    flag: 'USA',
  },
  {
    id: 'usa-adamsville',
    name: 'ADAMSVILLE',
    flag: 'USA',
  },
  {
    id: 'cym-georgetown',
    name: 'GEORGE TOWN',
    flag: 'CYM',
  },
  {
    id: 'esp-lagomera',
    name: 'LA GOMERA',
    flag: 'ESP',
  },
  {
    id: 'prt-vianadocastelo',
    name: 'VIANA DO CASTELO',
    flag: 'PRT',
  },
  {
    id: 'fra-landeda',
    name: 'LANDEDA',
    flag: 'FRA',
  },
  {
    id: 'esp-gandia',
    name: 'GANDIA',
    flag: 'ESP',
  },
  {
    id: 'dza-tenes',
    name: 'TENES',
    flag: 'DZA',
  },
  {
    id: 'nga-lagos',
    name: 'LAGOS',
    flag: 'NGA',
  },
  {
    id: 'nld-nieuwegein',
    name: 'NIEUWEGEIN',
    flag: 'NLD',
  },
  {
    id: 'deu-eemshaven',
    name: 'EEMSHAVEN',
    flag: 'DEU',
  },
  {
    id: 'nld-delfzijl',
    name: 'DELFZIJL',
    flag: 'NLD',
  },
  {
    id: 'cmr-bombemgue',
    name: 'BOMBEMGUE',
    flag: 'CMR',
  },
  {
    id: 'ita-terrasini',
    name: 'TERRASINI',
    flag: 'ITA',
  },
  {
    id: 'deu-glowe',
    name: 'GLOWE',
    flag: 'DEU',
  },
  {
    id: 'nor-myre',
    name: 'MYRE',
    flag: 'NOR',
  },
  {
    id: 'hrv-otoktijat',
    name: 'OTOK TIJAT',
    flag: 'HRV',
  },
  {
    id: 'ita-otranto',
    name: 'OTRANTO',
    flag: 'ITA',
  },
  {
    id: 'grc-hydra',
    name: 'HYDRA',
    flag: 'GRC',
  },
  {
    id: 'rus-gelendzhik',
    name: 'GELENDZHIK',
    flag: 'RUS',
  },
  {
    id: 'chn-zhongshan',
    name: 'ZHONGSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-sanmenisland',
    name: 'SANMEN ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-jiangyin',
    name: 'JIANGYIN',
    flag: 'CHN',
  },
  {
    id: 'fra-brest',
    name: 'BREST',
    flag: 'FRA',
  },
  {
    id: 'fra-plougrescant',
    name: 'PLOUGRESCANT',
    flag: 'FRA',
  },
  {
    id: 'esp-pedropinatar',
    name: 'PEDRO PINATAR',
    flag: 'ESP',
  },
  {
    id: 'ita-imperia',
    name: 'IMPERIA',
    flag: 'ITA',
  },
  {
    id: 'nzl-timaru',
    name: 'TIMARU',
    flag: 'NZL',
  },
  {
    id: 'deu-orth',
    name: 'ORTH',
    flag: 'DEU',
  },
  {
    id: 'usa-newhaven',
    name: 'NEW HAVEN',
    flag: 'USA',
  },
  {
    id: 'fra-portlanouvelle',
    name: 'PORT LA NOUVELLE',
    flag: 'FRA',
  },
  {
    id: 'irn-khorramshahr',
    name: 'KHORRAMSHAHR',
    flag: 'IRN',
  },
  {
    id: 'usa-camden',
    name: 'CAMDEN',
    flag: 'USA',
  },
  {
    id: 'usa-barharbor',
    name: 'BAR HARBOR',
    flag: 'USA',
  },
  {
    id: 'swe-hoganas',
    name: 'HOGANAS',
    flag: 'SWE',
  },
  {
    id: 'nor-gravdal',
    name: 'GRAVDAL',
    flag: 'NOR',
  },
  {
    id: 'aut-bisamberg',
    name: 'BISAMBERG',
    flag: 'AUT',
  },
  {
    id: 'swe-sundsvall',
    name: 'SUNDSVALL',
    flag: 'SWE',
  },
  {
    id: 'tur-pendik',
    name: 'PENDIK',
    flag: 'TUR',
  },
  {
    id: 'rus-balakovo',
    name: 'BALAKOVO',
    flag: 'RUS',
  },
  {
    id: 'tur-yarimca',
    name: 'YARIMCA',
    flag: 'TUR',
  },
  {
    id: 'usa-racine',
    name: 'RACINE',
    flag: 'USA',
  },
  {
    id: 'gbr-portaferry',
    name: 'PORTAFERRY',
    flag: 'GBR',
  },
  {
    id: 'bel-kortrijk',
    name: 'KORTRIJK',
    flag: 'BEL',
  },
  {
    id: 'ind-magdalla',
    name: 'MAGDALLA',
    flag: 'IND',
  },
  {
    id: 'hrv-otokkaprije',
    name: 'OTOK KAPRIJE',
    flag: 'HRV',
  },
  {
    id: 'aus-capecuvier',
    name: 'CAPE CUVIER',
    flag: 'AUS',
  },
  {
    id: 'fra-lille',
    name: 'LILLE',
    flag: 'FRA',
  },
  {
    id: 'sgp-sembawang',
    name: 'SEMBAWANG',
    flag: 'SGP',
  },
  {
    id: 'gbr-southendanchorage',
    name: 'SOUTHEND ANCHORAGE',
    flag: 'GBR',
  },
  {
    id: 'usa-ludington',
    name: 'LUDINGTON',
    flag: 'USA',
  },
  {
    id: 'fra-mondelange',
    name: 'MONDELANGE',
    flag: 'FRA',
  },
  {
    id: 'fro-glyvrar',
    name: 'GLYVRAR',
    flag: 'FRO',
  },
  {
    id: 'rus-alekseevsk',
    name: 'ALEKSEEVSK',
    flag: 'RUS',
  },
  {
    id: 'can-gibsons',
    name: 'GIBSONS',
    flag: 'CAN',
  },
  {
    id: 'usa-chester',
    name: 'CHESTER',
    flag: 'USA',
  },
  {
    id: 'usa-daytonabeach',
    name: 'DAYTONA BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-lantana',
    name: 'LANTANA',
    flag: 'USA',
  },
  {
    id: 'bhs-blackpoint',
    name: 'BLACK POINT',
    flag: 'BHS',
  },
  {
    id: 'irl-kinsale',
    name: 'KINSALE',
    flag: 'IRL',
  },
  {
    id: 'gbr-padstow',
    name: 'PADSTOW',
    flag: 'GBR',
  },
  {
    id: 'fra-ajaccio',
    name: 'AJACCIO',
    flag: 'FRA',
  },
  {
    id: 'nor-lodingen',
    name: 'LODINGEN',
    flag: 'NOR',
  },
  {
    id: 'grc-kalymnos',
    name: 'KALYMNOS',
    flag: 'GRC',
  },
  {
    id: 'chn-aojiang',
    name: 'AOJIANG',
    flag: 'CHN',
  },
  {
    id: 'aus-melbourne',
    name: 'MELBOURNE',
    flag: 'AUS',
  },
  {
    id: 'nzl-matapouri',
    name: 'MATAPOURI',
    flag: 'NZL',
  },
  {
    id: 'fra-crozon',
    name: 'CROZON',
    flag: 'FRA',
  },
  {
    id: 'esp-santaponsa',
    name: 'SANTA PONSA',
    flag: 'ESP',
  },
  {
    id: 'chl-sanantonio',
    name: 'SAN ANTONIO',
    flag: 'CHL',
  },
  {
    id: 'swe-borstahusen',
    name: 'BORSTAHUSEN',
    flag: 'SWE',
  },
  {
    id: 'rus-kholmsk',
    name: 'KHOLMSK',
    flag: 'RUS',
  },
  {
    id: 'lby-zawia',
    name: 'ZAWIA',
    flag: 'LBY',
  },
  {
    id: 'tha-laemchabang',
    name: 'LAEM CHABANG',
    flag: 'THA',
  },
  {
    id: 'nld-tiel',
    name: 'TIEL',
    flag: 'NLD',
  },
  {
    id: 'deu-wismar',
    name: 'WISMAR',
    flag: 'DEU',
  },
  {
    id: 'svn-koper',
    name: 'KOPER',
    flag: 'SVN',
  },
  {
    id: 'pri-arecibo',
    name: 'ARECIBO',
    flag: 'PRI',
  },
  {
    id: 'nor-etne',
    name: 'ETNE',
    flag: 'NOR',
  },
  {
    id: 'esp-pasitoblanco',
    name: 'PASITO BLANCO',
    flag: 'ESP',
  },
  {
    id: 'col-tolu',
    name: 'TOLU',
    flag: 'COL',
  },
  {
    id: 'col-puertobrisa',
    name: 'PUERTO BRISA',
    flag: 'COL',
  },
  {
    id: 'usa-meggett',
    name: 'MEGGETT',
    flag: 'USA',
  },
  {
    id: 'hrv-njivice',
    name: 'NJIVICE',
    flag: 'HRV',
  },
  {
    id: 'swe-gyrt',
    name: 'GYRT',
    flag: 'SWE',
  },
  {
    id: 'can-vancouver',
    name: 'VANCOUVER',
    flag: 'CAN',
  },
  {
    id: "usa-porto'connor",
    name: "PORT O'CONNOR",
    flag: 'USA',
  },
  {
    id: 'usa-hallandale',
    name: 'HALLANDALE',
    flag: 'USA',
  },
  {
    id: 'chl-castro',
    name: 'CASTRO',
    flag: 'CHL',
  },
  {
    id: 'grl-upernavik',
    name: 'UPERNAVIK',
    flag: 'GRL',
  },
  {
    id: 'isl-djupivogur',
    name: 'DJUPIVOGUR',
    flag: 'ISL',
  },
  {
    id: 'esp-mazarron',
    name: 'MAZARRON',
    flag: 'ESP',
  },
  {
    id: 'nor-fedje',
    name: 'FEDJE',
    flag: 'NOR',
  },
  {
    id: 'nld-stein',
    name: 'STEIN',
    flag: 'NLD',
  },
  {
    id: 'dnk-ballen',
    name: 'BALLEN',
    flag: 'DNK',
  },
  {
    id: 'dnk-gilleleje',
    name: 'GILLELEJE',
    flag: 'DNK',
  },
  {
    id: 'dnk-rodvig',
    name: 'RODVIG',
    flag: 'DNK',
  },
  {
    id: 'nor-moirana',
    name: 'MO I RANA',
    flag: 'NOR',
  },
  {
    id: 'fin-rauma',
    name: 'RAUMA',
    flag: 'FIN',
  },
  {
    id: 'fin-ekenas',
    name: 'EKENAS',
    flag: 'FIN',
  },
  {
    id: 'grc-heraklio',
    name: 'HERAKLIO',
    flag: 'GRC',
  },
  {
    id: 'ind-kolkata',
    name: 'KOLKATA',
    flag: 'IND',
  },
  {
    id: 'sgp-tekong',
    name: 'TEKONG',
    flag: 'SGP',
  },
  {
    id: 'chn-yueyang',
    name: 'YUEYANG',
    flag: 'CHN',
  },
  {
    id: 'idn-anggana',
    name: 'ANGGANA',
    flag: 'IDN',
  },
  {
    id: 'chn-lianyungang',
    name: 'LIANYUNGANG',
    flag: 'CHN',
  },
  {
    id: 'chn-jiashan',
    name: 'JIASHAN',
    flag: 'CHN',
  },
  {
    id: 'jpn-nishinoomote',
    name: 'NISHINOOMOTE',
    flag: 'JPN',
  },
  {
    id: 'jpn-saganoseki',
    name: 'SAGANOSEKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-toba',
    name: 'TOBA',
    flag: 'JPN',
  },
  {
    id: 'esp-javea',
    name: 'JAVEA',
    flag: 'ESP',
  },
  {
    id: 'chl-talcahuano',
    name: 'TALCAHUANO',
    flag: 'CHL',
  },
  {
    id: 'jpn-yokkaichi',
    name: 'YOKKAICHI',
    flag: 'JPN',
  },
  {
    id: 'nga-okonoterminal',
    name: 'OKONO TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'est-kardla',
    name: 'KARDLA',
    flag: 'EST',
  },
  {
    id: 'grc-kythnos',
    name: 'KYTHNOS',
    flag: 'GRC',
  },
  {
    id: 'deu-dolwinalphaplatform',
    name: 'DOLWIN ALPHA PLATFORM',
    flag: 'DEU',
  },
  {
    id: 'usa-warsaw',
    name: 'WARSAW',
    flag: 'USA',
  },
  {
    id: 'usa-savannah',
    name: 'SAVANNAH',
    flag: 'USA',
  },
  {
    id: 'nld-nederweert',
    name: 'NEDERWEERT',
    flag: 'NLD',
  },
  {
    id: 'usa-portsulphur',
    name: 'PORT SULPHUR',
    flag: 'USA',
  },
  {
    id: 'usa-oswego',
    name: 'OSWEGO',
    flag: 'USA',
  },
  {
    id: 'deu-bernkastel',
    name: 'BERNKASTEL',
    flag: 'DEU',
  },
  {
    id: 'bel-pecq',
    name: 'PECQ',
    flag: 'BEL',
  },
  {
    id: 'jpn-nanao',
    name: 'NANAO',
    flag: 'JPN',
  },
  {
    id: 'can-bedwellharbour',
    name: 'BEDWELL HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'usa-cameron',
    name: 'CAMERON',
    flag: 'USA',
  },
  {
    id: 'can-yarmouth',
    name: 'YARMOUTH',
    flag: 'CAN',
  },
  {
    id: 'arg-arroyoseco',
    name: 'ARROYO SECO',
    flag: 'ARG',
  },
  {
    id: 'can-portauxbasques',
    name: 'PORT AUX BASQUES',
    flag: 'CAN',
  },
  {
    id: 'bra-natal',
    name: 'NATAL',
    flag: 'BRA',
  },
  {
    id: 'gbr-cowes',
    name: 'COWES',
    flag: 'GBR',
  },
  {
    id: 'nld-rotterdammaasvlakte',
    name: 'ROTTERDAM MAASVLAKTE',
    flag: 'NLD',
  },
  {
    id: 'fra-legrauduroi',
    name: 'LE GRAU DU ROI',
    flag: 'FRA',
  },
  {
    id: 'nld-franeker',
    name: 'FRANEKER',
    flag: 'NLD',
  },
  {
    id: 'deu-scharnebeck',
    name: 'SCHARNEBECK',
    flag: 'DEU',
  },
  {
    id: 'ago-tombua',
    name: 'TOMBUA',
    flag: 'AGO',
  },
  {
    id: 'ita-gioiatauro',
    name: 'GIOIA TAURO',
    flag: 'ITA',
  },
  {
    id: 'ita-vieste',
    name: 'VIESTE',
    flag: 'ITA',
  },
  {
    id: 'hrv-saplunara',
    name: 'SAPLUNARA',
    flag: 'HRV',
  },
  {
    id: 'tur-kusadasi',
    name: 'KUSADASI',
    flag: 'TUR',
  },
  {
    id: 'rou-cernavoda',
    name: 'CERNAVODA',
    flag: 'ROU',
  },
  {
    id: 'tur-istanbul',
    name: 'ISTANBUL',
    flag: 'TUR',
  },
  {
    id: 'yem-nishtun',
    name: 'NISHTUN',
    flag: 'YEM',
  },
  {
    id: 'idn-sibolga',
    name: 'SIBOLGA',
    flag: 'IDN',
  },
  {
    id: 'twn-taichung',
    name: 'TAICHUNG',
    flag: 'TWN',
  },
  {
    id: 'chn-lusi',
    name: 'LUSI',
    flag: 'CHN',
  },
  {
    id: 'aus-newcastle',
    name: 'NEWCASTLE',
    flag: 'AUS',
  },
  {
    id: 'usa-princeton',
    name: 'PRINCETON',
    flag: 'USA',
  },
  {
    id: 'chl-coronel',
    name: 'CORONEL',
    flag: 'CHL',
  },
  {
    id: 'esp-ciutadella',
    name: 'CIUTADELLA',
    flag: 'ESP',
  },
  {
    id: 'aus-coffsharbour',
    name: 'COFFS HARBOUR',
    flag: 'AUS',
  },
  {
    id: 'jpn-oikawa',
    name: 'OIKAWA',
    flag: 'JPN',
  },
  {
    id: 'brn-seria',
    name: 'SERIA',
    flag: 'BRN',
  },
  {
    id: 'usa-indianaharbor',
    name: 'INDIANA HARBOR',
    flag: 'USA',
  },
  {
    id: 'nld-zwolle',
    name: 'ZWOLLE',
    flag: 'NLD',
  },
  {
    id: 'deu-lohnde',
    name: 'LOHNDE',
    flag: 'DEU',
  },
  {
    id: 'aus-geraldton',
    name: 'GERALDTON',
    flag: 'AUS',
  },
  {
    id: 'fin-vaskilahti',
    name: 'VASKILAHTI',
    flag: 'FIN',
  },
  {
    id: 'jpn-ube',
    name: 'UBE',
    flag: 'JPN',
  },
  {
    id: 'dnk-tyrafield',
    name: 'TYRA FIELD',
    flag: 'DNK',
  },
  {
    id: 'gbr-solent',
    name: 'SOLENT',
    flag: 'GBR',
  },
  {
    id: 'rus-olga',
    name: 'OLGA',
    flag: 'RUS',
  },
  {
    id: 'gbr-tenby',
    name: 'TENBY',
    flag: 'GBR',
  },
  {
    id: 'hrv-opatija',
    name: 'OPATIJA',
    flag: 'HRV',
  },
  {
    id: 'nor-skjelnan',
    name: 'SKJELNAN',
    flag: 'NOR',
  },
  {
    id: 'chn-luoyuan',
    name: 'LUOYUAN',
    flag: 'CHN',
  },
  {
    id: 'rus-kozmino',
    name: 'KOZMINO',
    flag: 'RUS',
  },
  {
    id: 'usa-benecia',
    name: 'BENECIA',
    flag: 'USA',
  },
  {
    id: 'fra-letrait',
    name: 'LE TRAIT',
    flag: 'FRA',
  },
  {
    id: 'mex-manzanillo',
    name: 'MANZANILLO',
    flag: 'MEX',
  },
  {
    id: 'ven-elpalito',
    name: 'EL PALITO',
    flag: 'VEN',
  },
  {
    id: 'gbr-alderney',
    name: 'ALDERNEY',
    flag: 'GBR',
  },
  {
    id: 'fra-dunkirk',
    name: 'DUNKIRK',
    flag: 'FRA',
  },
  {
    id: 'nld-velsen',
    name: 'VELSEN',
    flag: 'NLD',
  },
  {
    id: 'nld-lemmer',
    name: 'LEMMER',
    flag: 'NLD',
  },
  {
    id: 'nld-buchten',
    name: 'BUCHTEN',
    flag: 'NLD',
  },
  {
    id: 'fra-porquerolles',
    name: 'PORQUEROLLES',
    flag: 'FRA',
  },
  {
    id: 'aut-grafenworth',
    name: 'GRAFENWORTH',
    flag: 'AUT',
  },
  {
    id: 'alb-vlore',
    name: 'VLORE',
    flag: 'ALB',
  },
  {
    id: 'tur-gumusluk',
    name: 'GUMUSLUK',
    flag: 'TUR',
  },
  {
    id: 'egy-suezcanal',
    name: 'SUEZ CANAL',
    flag: 'EGY',
  },
  {
    id: 'are-dasisland',
    name: 'DAS ISLAND',
    flag: 'ARE',
  },
  {
    id: 'ind-bedi',
    name: 'BEDI',
    flag: 'IND',
  },
  {
    id: 'chn-qinzhou',
    name: 'QINZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-huanggang',
    name: 'HUANGGANG',
    flag: 'CHN',
  },
  {
    id: 'chn-xiuyu',
    name: 'XIUYU',
    flag: 'CHN',
  },
  {
    id: 'chn-yachengzhen',
    name: 'YACHENGZHEN',
    flag: 'CHN',
  },
  {
    id: 'chn-ganpu',
    name: 'GANPU',
    flag: 'CHN',
  },
  {
    id: 'jpn-kesennuma',
    name: 'KESENNUMA',
    flag: 'JPN',
  },
  {
    id: 'pan-vacamonte',
    name: 'VACAMONTE',
    flag: 'PAN',
  },
  {
    id: 'nor-henningsvaer',
    name: 'HENNINGSVAER',
    flag: 'NOR',
  },
  {
    id: 'kor-masan',
    name: 'MASAN',
    flag: 'KOR',
  },
  {
    id: 'slv-launion',
    name: 'LA UNION',
    flag: 'SLV',
  },
  {
    id: 'esh-dakhla',
    name: 'DAKHLA',
    flag: 'ESH',
  },
  {
    id: 'esp-elpajar',
    name: 'EL PAJAR',
    flag: 'ESP',
  },
  {
    id: 'blz-belizecityanchorage',
    name: 'BELIZE CITY ANCHORAGE',
    flag: 'BLZ',
  },
  {
    id: 'egy-sidikerir',
    name: 'SIDI KERIR',
    flag: 'EGY',
  },
  {
    id: 'usa-clayton',
    name: 'CLAYTON',
    flag: 'USA',
  },
  {
    id: 'aut-ybbsanderdonau',
    name: 'YBBS AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'tur-rize',
    name: 'RIZE',
    flag: 'TUR',
  },
  {
    id: 'idn-pemangkaran',
    name: 'PEMANGKARAN',
    flag: 'IDN',
  },
  {
    id: 'deu-hennigsdorf',
    name: 'HENNIGSDORF',
    flag: 'DEU',
  },
  {
    id: 'swe-hallevik',
    name: 'HALLEVIK',
    flag: 'SWE',
  },
  {
    id: 'usa-glassport',
    name: 'GLASSPORT',
    flag: 'USA',
  },
  {
    id: 'pan-portobelo',
    name: 'PORTOBELO',
    flag: 'PAN',
  },
  {
    id: 'aus-sthelens',
    name: 'ST HELENS',
    flag: 'AUS',
  },
  {
    id: 'usa-woodriver',
    name: 'WOOD RIVER',
    flag: 'USA',
  },
  {
    id: 'bel-boom',
    name: 'BOOM',
    flag: 'BEL',
  },
  {
    id: 'grc-sagiada',
    name: 'SAGIADA',
    flag: 'GRC',
  },
  {
    id: 'usa-olympia',
    name: 'OLYMPIA',
    flag: 'USA',
  },
  {
    id: 'usa-portblakely',
    name: 'PORT BLAKELY',
    flag: 'USA',
  },
  {
    id: 'usa-brownsville',
    name: 'BROWNSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-lemont',
    name: 'LEMONT',
    flag: 'USA',
  },
  {
    id: 'per-ilo',
    name: 'ILO',
    flag: 'PER',
  },
  {
    id: 'usa-vineyardhaven',
    name: 'VINEYARD HAVEN',
    flag: 'USA',
  },
  {
    id: 'bra-recife',
    name: 'RECIFE',
    flag: 'BRA',
  },
  {
    id: 'fra-saintmalo',
    name: 'SAINT MALO',
    flag: 'FRA',
  },
  {
    id: 'nld-bruinisse',
    name: 'BRUINISSE',
    flag: 'NLD',
  },
  {
    id: 'fra-ottmarsheim',
    name: 'OTTMARSHEIM',
    flag: 'FRA',
  },
  {
    id: 'dnk-vordingborg',
    name: 'VORDINGBORG',
    flag: 'DNK',
  },
  {
    id: 'ita-portosangiorgio',
    name: 'PORTO SAN GIORGIO',
    flag: 'ITA',
  },
  {
    id: 'nor-harstad',
    name: 'HARSTAD',
    flag: 'NOR',
  },
  {
    id: 'ita-bari',
    name: 'BARI',
    flag: 'ITA',
  },
  {
    id: 'grc-chalkis',
    name: 'CHALKIS',
    flag: 'GRC',
  },
  {
    id: 'nor-havoysund',
    name: 'HAVOYSUND',
    flag: 'NOR',
  },
  {
    id: 'tur-tuzla',
    name: 'TUZLA',
    flag: 'TUR',
  },
  {
    id: 'are-saadiyat',
    name: 'SAADIYAT',
    flag: 'ARE',
  },
  {
    id: 'aus-morningside',
    name: 'MORNINGSIDE',
    flag: 'AUS',
  },
  {
    id: 'ven-puertocabello',
    name: 'PUERTO CABELLO',
    flag: 'VEN',
  },
  {
    id: 'nor-kirkehamn',
    name: 'KIRKEHAMN',
    flag: 'NOR',
  },
  {
    id: 'deu-eckernforde',
    name: 'ECKERNFORDE',
    flag: 'DEU',
  },
  {
    id: 'guf-kourou',
    name: 'KOUROU',
    flag: 'GUF',
  },
  {
    id: 'gbr-wisbech',
    name: 'WISBECH',
    flag: 'GBR',
  },
  {
    id: 'deu-freest',
    name: 'FREEST',
    flag: 'DEU',
  },
  {
    id: 'aut-marbachanderdonau',
    name: 'MARBACH AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'fin-joensuu',
    name: 'JOENSUU',
    flag: 'FIN',
  },
  {
    id: 'jpn-matsusaka',
    name: 'MATSUSAKA',
    flag: 'JPN',
  },
  {
    id: 'ita-portopino',
    name: 'PORTO PINO',
    flag: 'ITA',
  },
  {
    id: 'usa-burnsharbor',
    name: 'BURNS HARBOR',
    flag: 'USA',
  },
  {
    id: 'chl-guayacan',
    name: 'GUAYACAN',
    flag: 'CHL',
  },
  {
    id: 'dnk-nibe',
    name: 'NIBE',
    flag: 'DNK',
  },
  {
    id: 'swe-torekov',
    name: 'TOREKOV',
    flag: 'SWE',
  },
  {
    id: 'idn-tegal',
    name: 'TEGAL',
    flag: 'IDN',
  },
  {
    id: 'deu-rheinbrohl',
    name: 'RHEINBROHL',
    flag: 'DEU',
  },
  {
    id: 'bel-aalst',
    name: 'AALST',
    flag: 'BEL',
  },
  {
    id: 'deu-esslingen',
    name: 'ESSLINGEN',
    flag: 'DEU',
  },
  {
    id: 'ton-nukualofa',
    name: 'NUKU ALOFA',
    flag: 'TON',
  },
  {
    id: 'arg-villaconstitucion',
    name: 'VILLA CONSTITUCION',
    flag: 'ARG',
  },
  {
    id: 'nld-rotterdam',
    name: 'ROTTERDAM',
    flag: 'NLD',
  },
  {
    id: 'nor-sogndal',
    name: 'SOGNDAL',
    flag: 'NOR',
  },
  {
    id: 'lby-tripoli',
    name: 'TRIPOLI',
    flag: 'LBY',
  },
  {
    id: 'lby-benghazi',
    name: 'BENGHAZI',
    flag: 'LBY',
  },
  {
    id: 'grc-samos',
    name: 'SAMOS',
    flag: 'GRC',
  },
  {
    id: 'chn-yangjiang',
    name: 'YANGJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-shanghai',
    name: 'SHANGHAI',
    flag: 'CHN',
  },
  {
    id: 'aus-wallaroo',
    name: 'WALLAROO',
    flag: 'AUS',
  },
  {
    id: 'hrv-muline',
    name: 'MULINE',
    flag: 'HRV',
  },
  {
    id: 'grc-stnicolas',
    name: 'ST NICOLAS',
    flag: 'GRC',
  },
  {
    id: 'are-dalmaisland',
    name: 'DALMA ISLAND',
    flag: 'ARE',
  },
  {
    id: 'chn-dayushanisland',
    name: 'DAYUSHAN ISLAND',
    flag: 'CHN',
  },
  {
    id: 'ecu-lalibertad',
    name: 'LA LIBERTAD',
    flag: 'ECU',
  },
  {
    id: 'grc-gouvia',
    name: 'GOUVIA',
    flag: 'GRC',
  },
  {
    id: 'fsm-pohnpei',
    name: 'POHNPEI',
    flag: 'FSM',
  },
  {
    id: 'can-tadoussac',
    name: 'TADOUSSAC',
    flag: 'CAN',
  },
  {
    id: 'nor-knarrevik',
    name: 'KNARREVIK',
    flag: 'NOR',
  },
  {
    id: 'tto-pointeapierre',
    name: 'POINTE A PIERRE',
    flag: 'TTO',
  },
  {
    id: 'nld-spakenburg',
    name: 'SPAKENBURG',
    flag: 'NLD',
  },
  {
    id: 'dnk-stege',
    name: 'STEGE',
    flag: 'DNK',
  },
  {
    id: 'nor-sagvag',
    name: 'SAGVAG',
    flag: 'NOR',
  },
  {
    id: 'gbr-howdendyke',
    name: 'HOWDENDYKE',
    flag: 'GBR',
  },
  {
    id: 'idn-idi',
    name: 'IDI',
    flag: 'IDN',
  },
  {
    id: 'mex-altamira',
    name: 'ALTAMIRA',
    flag: 'MEX',
  },
  {
    id: 'usa-saintgabriel',
    name: 'SAINT GABRIEL',
    flag: 'USA',
  },
  {
    id: 'gtm-puertobarrios',
    name: 'PUERTO BARRIOS',
    flag: 'GTM',
  },
  {
    id: 'jam-kingston',
    name: 'KINGSTON',
    flag: 'JAM',
  },
  {
    id: 'usa-brewercovehaven',
    name: 'BREWER COVE HAVEN',
    flag: 'USA',
  },
  {
    id: 'chl-iquique',
    name: 'IQUIQUE',
    flag: 'CHL',
  },
  {
    id: 'ata-portlockroy',
    name: 'PORT LOCKROY',
    flag: 'ATA',
  },
  {
    id: 'esp-lascoloradas',
    name: 'LAS COLORADAS',
    flag: 'ESP',
  },
  {
    id: 'rus-baltiysk',
    name: 'BALTIYSK',
    flag: 'RUS',
  },
  {
    id: 'grc-corinth',
    name: 'CORINTH',
    flag: 'GRC',
  },
  {
    id: 'bgr-oryahovo',
    name: 'ORYAHOVO',
    flag: 'BGR',
  },
  {
    id: 'tur-bozyazi',
    name: 'BOZYAZI',
    flag: 'TUR',
  },
  {
    id: 'are-sharjah',
    name: 'SHARJAH',
    flag: 'ARE',
  },
  {
    id: 'aus-bunbury',
    name: 'BUNBURY',
    flag: 'AUS',
  },
  {
    id: 'usa-sandybay',
    name: 'SANDY BAY',
    flag: 'USA',
  },
  {
    id: 'nor-larsnes',
    name: 'LARSNES',
    flag: 'NOR',
  },
  {
    id: 'aus-crawley',
    name: 'CRAWLEY',
    flag: 'AUS',
  },
  {
    id: 'egy-rasgharib',
    name: 'RAS GHARIB',
    flag: 'EGY',
  },
  {
    id: 'usa-quincyil',
    name: 'QUINCY IL',
    flag: 'USA',
  },
  {
    id: 'hrv-rabac',
    name: 'RABAC',
    flag: 'HRV',
  },
  {
    id: 'tur-gerze',
    name: 'GERZE',
    flag: 'TUR',
  },
  {
    id: 'nor-vannvag',
    name: 'VANNVAG',
    flag: 'NOR',
  },
  {
    id: 'usa-lopezisland',
    name: 'LOPEZ ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-hannibal',
    name: 'HANNIBAL',
    flag: 'USA',
  },
  {
    id: 'ita-arechi',
    name: 'ARECHI',
    flag: 'ITA',
  },
  {
    id: 'fin-savonlinna',
    name: 'SAVONLINNA',
    flag: 'FIN',
  },
  {
    id: 'lka-negombo',
    name: 'NEGOMBO',
    flag: 'LKA',
  },
  {
    id: 'nld-utrecht',
    name: 'UTRECHT',
    flag: 'NLD',
  },
  {
    id: 'arg-puntaloyola',
    name: 'PUNTA LOYOLA',
    flag: 'ARG',
  },
  {
    id: 'phl-santaritaaplaya',
    name: 'SANTA RITA APLAYA',
    flag: 'PHL',
  },
  {
    id: 'aus-toronto',
    name: 'TORONTO',
    flag: 'AUS',
  },
  {
    id: 'swe-lidingoebosoen',
    name: 'LIDINGOE BOSOEN',
    flag: 'SWE',
  },
  {
    id: 'nld-breda',
    name: 'BREDA',
    flag: 'NLD',
  },
  {
    id: 'deu-spelle',
    name: 'SPELLE',
    flag: 'DEU',
  },
  {
    id: 'gbr-ipswichanchorage',
    name: 'IPSWICH ANCHORAGE',
    flag: 'GBR',
  },
  {
    id: 'ury-santiagovazquez',
    name: 'SANTIAGO VAZQUEZ',
    flag: 'URY',
  },
  {
    id: 'ury-piriapolis',
    name: 'PIRIAPOLIS',
    flag: 'URY',
  },
  {
    id: 'gbr-uig',
    name: 'UIG',
    flag: 'GBR',
  },
  {
    id: 'gbr-exmouth',
    name: 'EXMOUTH',
    flag: 'GBR',
  },
  {
    id: 'fra-lilerousse',
    name: 'LILE ROUSSE',
    flag: 'FRA',
  },
  {
    id: 'ita-anzio',
    name: 'ANZIO',
    flag: 'ITA',
  },
  {
    id: 'hrv-malilosinj',
    name: 'MALI LOSINJ',
    flag: 'HRV',
  },
  {
    id: 'hun-budapest',
    name: 'BUDAPEST',
    flag: 'HUN',
  },
  {
    id: 'fin-mariehamn',
    name: 'MARIEHAMN',
    flag: 'FIN',
  },
  {
    id: 'aus-tworocks',
    name: 'TWO ROCKS',
    flag: 'AUS',
  },
  {
    id: 'chn-jimiya',
    name: 'JIMIYA',
    flag: 'CHN',
  },
  {
    id: 'idn-atapupu',
    name: 'ATAPUPU',
    flag: 'IDN',
  },
  {
    id: 'phl-surigaocity',
    name: 'SURIGAO CITY',
    flag: 'PHL',
  },
  {
    id: 'can-nanooseharbor',
    name: 'NANOOSE HARBOR',
    flag: 'CAN',
  },
  {
    id: 'isl-kopasker',
    name: 'KOPASKER',
    flag: 'ISL',
  },
  {
    id: 'ita-loano',
    name: 'LOANO',
    flag: 'ITA',
  },
  {
    id: 'rus-sabetta',
    name: 'SABETTA',
    flag: 'RUS',
  },
  {
    id: 'kor-gwangyang',
    name: 'GWANGYANG',
    flag: 'KOR',
  },
  {
    id: 'ukr-ochakiv',
    name: 'OCHAKIV',
    flag: 'UKR',
  },
  {
    id: 'jpn-rumoi',
    name: 'RUMOI',
    flag: 'JPN',
  },
  {
    id: 'chn-maominganchorage',
    name: 'MAOMING ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'usa-bozman',
    name: 'BOZMAN',
    flag: 'USA',
  },
  {
    id: 'mne-kotor',
    name: 'KOTOR',
    flag: 'MNE',
  },
  {
    id: 'grc-souda',
    name: 'SOUDA',
    flag: 'GRC',
  },
  {
    id: 'rus-vazhiny',
    name: 'VAZHINY',
    flag: 'RUS',
  },
  {
    id: 'usa-hanalei',
    name: 'HANALEI',
    flag: 'USA',
  },
  {
    id: 'usa-marseilles',
    name: 'MARSEILLES',
    flag: 'USA',
  },
  {
    id: 'fro-vagur',
    name: 'VAGUR',
    flag: 'FRO',
  },
  {
    id: 'nld-zoutkamp',
    name: 'ZOUTKAMP',
    flag: 'NLD',
  },
  {
    id: 'dnk-thisted',
    name: 'THISTED',
    flag: 'DNK',
  },
  {
    id: 'rus-rakushkaanchorage',
    name: 'RAKUSHKA ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'usa-bolonisland',
    name: 'BOLON ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-kirkland',
    name: 'KIRKLAND',
    flag: 'USA',
  },
  {
    id: 'deu-wustermark',
    name: 'WUSTERMARK',
    flag: 'DEU',
  },
  {
    id: 'usa-funter',
    name: 'FUNTER',
    flag: 'USA',
  },
  {
    id: 'gbr-ardfern',
    name: 'ARDFERN',
    flag: 'GBR',
  },
  {
    id: 'cri-puntamorales',
    name: 'PUNTA MORALES',
    flag: 'CRI',
  },
  {
    id: 'usa-hennepin',
    name: 'HENNEPIN',
    flag: 'USA',
  },
  {
    id: 'atg-falmouth',
    name: 'FALMOUTH',
    flag: 'ATG',
  },
  {
    id: 'fro-fuglafjordur',
    name: 'FUGLAFJORDUR',
    flag: 'FRO',
  },
  {
    id: 'esp-aviles',
    name: 'AVILES',
    flag: 'ESP',
  },
  {
    id: 'gbr-dartmouth',
    name: 'DARTMOUTH',
    flag: 'GBR',
  },
  {
    id: 'esp-thomasmaestre',
    name: 'THOMAS MAESTRE',
    flag: 'ESP',
  },
  {
    id: 'nor-hoyanger',
    name: 'HOYANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-finnsnes',
    name: 'FINNSNES',
    flag: 'NOR',
  },
  {
    id: 'pol-gdynia',
    name: 'GDYNIA',
    flag: 'POL',
  },
  {
    id: 'ala-lumparland',
    name: 'LUMPARLAND',
    flag: 'ALA',
  },
  {
    id: 'grc-antirrio',
    name: 'ANTIRRIO',
    flag: 'GRC',
  },
  {
    id: 'grc-michaniona',
    name: 'MICHANIONA',
    flag: 'GRC',
  },
  {
    id: 'chn-shenzhen',
    name: 'SHENZHEN',
    flag: 'CHN',
  },
  {
    id: 'aus-glenelg',
    name: 'GLENELG',
    flag: 'AUS',
  },
  {
    id: 'idn-jayapura',
    name: 'JAYAPURA',
    flag: 'IDN',
  },
  {
    id: 'jpn-ofunato',
    name: 'OFUNATO',
    flag: 'JPN',
  },
  {
    id: 'nzl-orakei',
    name: 'ORAKEI',
    flag: 'NZL',
  },
  {
    id: 'irl-dunlaoghaire',
    name: 'DUN LAOGHAIRE',
    flag: 'IRL',
  },
  {
    id: 'fra-pornic',
    name: 'PORNIC',
    flag: 'FRA',
  },
  {
    id: 'fra-leverdonsurmer',
    name: 'LE VERDON SUR MER',
    flag: 'FRA',
  },
  {
    id: 'dnk-koege',
    name: 'KOEGE',
    flag: 'DNK',
  },
  {
    id: 'jpn-kanazawa',
    name: 'KANAZAWA',
    flag: 'JPN',
  },
  {
    id: 'aus-portlatta',
    name: 'PORT LATTA',
    flag: 'AUS',
  },
  {
    id: 'mex-cayoarcasterminal',
    name: 'CAYO ARCAS TERMINAL',
    flag: 'MEX',
  },
  {
    id: 'fra-menen',
    name: 'MENEN',
    flag: 'FRA',
  },
  {
    id: 'usa-greenport',
    name: 'GREENPORT',
    flag: 'USA',
  },
  {
    id: 'nld-heeg',
    name: 'HEEG',
    flag: 'NLD',
  },
  {
    id: 'mdg-toamasina',
    name: 'TOAMASINA',
    flag: 'MDG',
  },
  {
    id: 'nld-numansdorp',
    name: 'NUMANSDORP',
    flag: 'NLD',
  },
  {
    id: 'deu-stolzenau',
    name: 'STOLZENAU',
    flag: 'DEU',
  },
  {
    id: 'usa-manteowaterfront',
    name: 'MANTEO WATERFRONT',
    flag: 'USA',
  },
  {
    id: 'grc-chalkissouthanchorage',
    name: 'CHALKIS SOUTH ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'deu-speyer',
    name: 'SPEYER',
    flag: 'DEU',
  },
  {
    id: 'usa-vancouver',
    name: 'VANCOUVER',
    flag: 'USA',
  },
  {
    id: 'grc-corintheastanchorage',
    name: 'CORINTH EAST ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'usa-sunsetbeach',
    name: 'SUNSET BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-portisabel',
    name: 'PORT ISABEL',
    flag: 'USA',
  },
  {
    id: 'cub-havana',
    name: 'HAVANA',
    flag: 'CUB',
  },
  {
    id: 'usa-bucksport',
    name: 'BUCKSPORT',
    flag: 'USA',
  },
  {
    id: 'isl-olafsfjordur',
    name: 'OLAFSFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'esp-lapalma',
    name: 'LA PALMA',
    flag: 'ESP',
  },
  {
    id: 'prt-sesimbra',
    name: 'SESIMBRA',
    flag: 'PRT',
  },
  {
    id: 'irl-galway',
    name: 'GALWAY',
    flag: 'IRL',
  },
  {
    id: 'gbr-burghead',
    name: 'BURGHEAD',
    flag: 'GBR',
  },
  {
    id: 'esp-barcelona',
    name: 'BARCELONA',
    flag: 'ESP',
  },
  {
    id: 'esp-blanes',
    name: 'BLANES',
    flag: 'ESP',
  },
  {
    id: 'bel-overpelt',
    name: 'OVERPELT',
    flag: 'BEL',
  },
  {
    id: 'ita-gaeta',
    name: 'GAETA',
    flag: 'ITA',
  },
  {
    id: 'tur-eregli',
    name: 'EREGLI',
    flag: 'TUR',
  },
  {
    id: 'chn-pintan',
    name: 'PINTAN',
    flag: 'CHN',
  },
  {
    id: 'phl-tubigan',
    name: 'TUBIGAN',
    flag: 'PHL',
  },
  {
    id: 'ita-augusta',
    name: 'AUGUSTA',
    flag: 'ITA',
  },
  {
    id: 'swe-karlskrona',
    name: 'KARLSKRONA',
    flag: 'SWE',
  },
  {
    id: 'usa-neahbay',
    name: 'NEAH BAY',
    flag: 'USA',
  },
  {
    id: 'nld-alphenaandenrijn',
    name: 'ALPHEN AAN DEN RIJN',
    flag: 'NLD',
  },
  {
    id: 'swe-lysekil',
    name: 'LYSEKIL',
    flag: 'SWE',
  },
  {
    id: 'grc-rio',
    name: 'RIO',
    flag: 'GRC',
  },
  {
    id: 'nor-valle',
    name: 'VALLE',
    flag: 'NOR',
  },
  {
    id: 'srb-beocin',
    name: 'BEOCIN',
    flag: 'SRB',
  },
  {
    id: 'nor-slovaag',
    name: 'SLOVAAG',
    flag: 'NOR',
  },
  {
    id: 'tgo-kpeme',
    name: 'KPEME',
    flag: 'TGO',
  },
  {
    id: 'deu-waltrop',
    name: 'WALTROP',
    flag: 'DEU',
  },
  {
    id: 'aus-coalpoint',
    name: 'COAL POINT',
    flag: 'AUS',
  },
  {
    id: 'mex-ciudaddelcarmen',
    name: 'CIUDAD DEL CARMEN',
    flag: 'MEX',
  },
  {
    id: 'irl-killybegs',
    name: 'KILLYBEGS',
    flag: 'IRL',
  },
  {
    id: 'esp-cedeira',
    name: 'CEDEIRA',
    flag: 'ESP',
  },
  {
    id: 'gbr-fowey',
    name: 'FOWEY',
    flag: 'GBR',
  },
  {
    id: 'gbr-macduff',
    name: 'MACDUFF',
    flag: 'GBR',
  },
  {
    id: 'deu-brake',
    name: 'BRAKE',
    flag: 'DEU',
  },
  {
    id: 'dnk-bagenkop',
    name: 'BAGENKOP',
    flag: 'DNK',
  },
  {
    id: 'ita-sanvitolocapo',
    name: 'SAN VITO LO CAPO',
    flag: 'ITA',
  },
  {
    id: 'grc-kypseli',
    name: 'KYPSELI',
    flag: 'GRC',
  },
  {
    id: 'rus-severomorsk',
    name: 'SEVEROMORSK',
    flag: 'RUS',
  },
  {
    id: 'irn-nowshahr',
    name: 'NOWSHAHR',
    flag: 'IRN',
  },
  {
    id: 'are-hamriyahlpg',
    name: 'HAMRIYAH LPG',
    flag: 'ARE',
  },
  {
    id: 'idn-celukanbawang',
    name: 'CELUKAN BAWANG',
    flag: 'IDN',
  },
  {
    id: 'phl-davao',
    name: 'DAVAO',
    flag: 'PHL',
  },
  {
    id: 'gbr-harwich',
    name: 'HARWICH',
    flag: 'GBR',
  },
  {
    id: 'aus-margate',
    name: 'MARGATE',
    flag: 'AUS',
  },
  {
    id: 'esp-portolimpic',
    name: 'PORT OLIMPIC',
    flag: 'ESP',
  },
  {
    id: 'can-toronto',
    name: 'TORONTO',
    flag: 'CAN',
  },
  {
    id: 'usa-boothbayharbor',
    name: 'BOOTHBAY HARBOR',
    flag: 'USA',
  },
  {
    id: 'gbr-perth',
    name: 'PERTH',
    flag: 'GBR',
  },
  {
    id: 'dnk-agger',
    name: 'AGGER',
    flag: 'DNK',
  },
  {
    id: 'nga-calabar',
    name: 'CALABAR',
    flag: 'NGA',
  },
  {
    id: 'grc-nafplion',
    name: 'NAFPLION',
    flag: 'GRC',
  },
  {
    id: 'mdg-diegosuarez',
    name: 'DIEGO SUAREZ',
    flag: 'MDG',
  },
  {
    id: 'gbr-coverack',
    name: 'COVERACK',
    flag: 'GBR',
  },
  {
    id: 'are-almarmarisland',
    name: 'AL MARMAR ISLAND',
    flag: 'ARE',
  },
  {
    id: 'deu-stralsund',
    name: 'STRALSUND',
    flag: 'DEU',
  },
  {
    id: 'chn-haiyan',
    name: 'HAIYAN',
    flag: 'CHN',
  },
  {
    id: 'usa-providence',
    name: 'PROVIDENCE',
    flag: 'USA',
  },
  {
    id: 'mys-sarikei',
    name: 'SARIKEI',
    flag: 'MYS',
  },
  {
    id: 'bol-ptosuarezbolivia',
    name: 'PTO SUAREZ BOLIVIA',
    flag: 'BOL',
  },
  {
    id: 'deu-godorf',
    name: 'GODORF',
    flag: 'DEU',
  },
  {
    id: 'usa-barberspoint',
    name: 'BARBERS POINT',
    flag: 'USA',
  },
  {
    id: 'can-princerupert',
    name: 'PRINCE RUPERT',
    flag: 'CAN',
  },
  {
    id: 'usa-newportbeach',
    name: 'NEWPORT BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-panamacity',
    name: 'PANAMA CITY',
    flag: 'USA',
  },
  {
    id: 'chl-puertonatales',
    name: 'PUERTO NATALES',
    flag: 'CHL',
  },
  {
    id: 'grd-stgeorges',
    name: 'ST GEORGES',
    flag: 'GRD',
  },
  {
    id: 'gbr-stives',
    name: 'ST IVES',
    flag: 'GBR',
  },
  {
    id: 'fra-cherbourg',
    name: 'CHERBOURG',
    flag: 'FRA',
  },
  {
    id: 'ita-portovecchio',
    name: 'PORTO VECCHIO',
    flag: 'ITA',
  },
  {
    id: 'nor-mosjoen',
    name: 'MOSJOEN',
    flag: 'NOR',
  },
  {
    id: 'hrv-kali',
    name: 'KALI',
    flag: 'HRV',
  },
  {
    id: 'svk-komarno',
    name: 'KOMARNO',
    flag: 'SVK',
  },
  {
    id: 'grc-paros',
    name: 'PAROS',
    flag: 'GRC',
  },
  {
    id: 'ind-mangalore',
    name: 'MANGALORE',
    flag: 'IND',
  },
  {
    id: 'phl-bauan',
    name: 'BAUAN',
    flag: 'PHL',
  },
  {
    id: 'aus-southport',
    name: 'SOUTHPORT',
    flag: 'AUS',
  },
  {
    id: 'usa-cove',
    name: 'COVE',
    flag: 'USA',
  },
  {
    id: 'nor-midsund',
    name: 'MIDSUND',
    flag: 'NOR',
  },
  {
    id: 'ita-ponza',
    name: 'PONZA',
    flag: 'ITA',
  },
  {
    id: 'est-miiduranna',
    name: 'MIIDURANNA',
    flag: 'EST',
  },
  {
    id: 'kwt-minaalahmadi',
    name: 'MINA AL AHMADI',
    flag: 'KWT',
  },
  {
    id: 'chn-nanshaojia',
    name: 'NANSHAOJIA',
    flag: 'CHN',
  },
  {
    id: 'cod-matadi',
    name: 'MATADI',
    flag: 'COD',
  },
  {
    id: 'are-nasrfield',
    name: 'NASR FIELD',
    flag: 'ARE',
  },
  {
    id: 'usa-marquette',
    name: 'MARQUETTE',
    flag: 'USA',
  },
  {
    id: 'usa-sandusky',
    name: 'SANDUSKY',
    flag: 'USA',
  },
  {
    id: 'usa-wilmingtonnc',
    name: 'WILMINGTON NC',
    flag: 'USA',
  },
  {
    id: 'can-saintzotique',
    name: 'SAINT ZOTIQUE',
    flag: 'CAN',
  },
  {
    id: 'nld-hengelo',
    name: 'HENGELO',
    flag: 'NLD',
  },
  {
    id: 'ita-tavolara',
    name: 'TAVOLARA',
    flag: 'ITA',
  },
  {
    id: 'usa-dartmouthrock',
    name: 'DARTMOUTH ROCK',
    flag: 'USA',
  },
  {
    id: 'grl-kangilinnguit',
    name: 'KANGILINNGUIT',
    flag: 'GRL',
  },
  {
    id: 'ita-calagalera',
    name: 'CALA GALERA',
    flag: 'ITA',
  },
  {
    id: 'dnk-nysted',
    name: 'NYSTED',
    flag: 'DNK',
  },
  {
    id: 'swe-klintehamn',
    name: 'KLINTEHAMN',
    flag: 'SWE',
  },
  {
    id: 'moz-matola',
    name: 'MATOLA',
    flag: 'MOZ',
  },
  {
    id: 'rou-mangalia',
    name: 'MANGALIA',
    flag: 'ROU',
  },
  {
    id: 'dom-puertoviejo',
    name: 'PUERTO VIEJO',
    flag: 'DOM',
  },
  {
    id: 'pry-sanantonio',
    name: 'SAN ANTONIO',
    flag: 'PRY',
  },
  {
    id: 'can-brentwoodbay',
    name: 'BRENTWOOD BAY',
    flag: 'CAN',
  },
  {
    id: 'deu-gelsenkirchen',
    name: 'GELSENKIRCHEN',
    flag: 'DEU',
  },
  {
    id: 'guy-newamsterdam',
    name: 'NEW AMSTERDAM',
    flag: 'GUY',
  },
  {
    id: 'ita-lesaline',
    name: 'LE SALINE',
    flag: 'ITA',
  },
  {
    id: 'ita-portoliscia',
    name: 'PORTO LISCIA',
    flag: 'ITA',
  },
  {
    id: 'usa-annapolis',
    name: 'ANNAPOLIS',
    flag: 'USA',
  },
  {
    id: 'esp-islacristina',
    name: 'ISLA CRISTINA',
    flag: 'ESP',
  },
  {
    id: 'fro-eidi',
    name: 'EIDI',
    flag: 'FRO',
  },
  {
    id: 'gbr-portree',
    name: 'PORTREE',
    flag: 'GBR',
  },
  {
    id: 'gbr-teignmouth',
    name: 'TEIGNMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-neaphouse',
    name: 'NEAP HOUSE',
    flag: 'GBR',
  },
  {
    id: 'gbr-brightlingsea',
    name: 'BRIGHTLINGSEA',
    flag: 'GBR',
  },
  {
    id: 'nld-terneuzen',
    name: 'TERNEUZEN',
    flag: 'NLD',
  },
  {
    id: 'nld-harlingen',
    name: 'HARLINGEN',
    flag: 'NLD',
  },
  {
    id: 'nor-luroy',
    name: 'LUROY',
    flag: 'NOR',
  },
  {
    id: 'nor-breivoll',
    name: 'BREIVOLL',
    flag: 'NOR',
  },
  {
    id: 'grc-myrina',
    name: 'MYRINA',
    flag: 'GRC',
  },
  {
    id: 'ukr-yalta',
    name: 'YALTA',
    flag: 'UKR',
  },
  {
    id: 'ind-panaji',
    name: 'PANAJI',
    flag: 'IND',
  },
  {
    id: 'mys-langkawi',
    name: 'LANGKAWI',
    flag: 'MYS',
  },
  {
    id: 'chn-fengdu',
    name: 'FENGDU',
    flag: 'CHN',
  },
  {
    id: 'chn-shidao',
    name: 'SHIDAO',
    flag: 'CHN',
  },
  {
    id: 'jpn-iyo',
    name: 'IYO',
    flag: 'JPN',
  },
  {
    id: 'aus-devonport',
    name: 'DEVONPORT',
    flag: 'AUS',
  },
  {
    id: 'dom-santodomingo',
    name: 'SANTO DOMINGO',
    flag: 'DOM',
  },
  {
    id: 'can-conceptionbaysouth',
    name: 'CONCEPTION BAY SOUTH',
    flag: 'CAN',
  },
  {
    id: 'gbr-aberdeen',
    name: 'ABERDEEN',
    flag: 'GBR',
  },
  {
    id: 'fra-iledaix',
    name: 'ILE DAIX',
    flag: 'FRA',
  },
  {
    id: 'esp-santapola',
    name: 'SANTA POLA',
    flag: 'ESP',
  },
  {
    id: 'jpn-tokachi',
    name: 'TOKACHI',
    flag: 'JPN',
  },
  {
    id: 'usa-saultstemarie',
    name: 'SAULT STE MARIE',
    flag: 'USA',
  },
  {
    id: 'can-louisburg',
    name: 'LOUISBURG',
    flag: 'CAN',
  },
  {
    id: 'deu-bremen',
    name: 'BREMEN',
    flag: 'DEU',
  },
  {
    id: 'isr-ashdod',
    name: 'ASHDOD',
    flag: 'ISR',
  },
  {
    id: 'kaz-bautino',
    name: 'BAUTINO',
    flag: 'KAZ',
  },
  {
    id: 'cri-limon',
    name: 'LIMON',
    flag: 'CRI',
  },
  {
    id: 'usa-portwashington',
    name: 'PORT WASHINGTON',
    flag: 'USA',
  },
  {
    id: 'can-cacouna',
    name: 'CACOUNA',
    flag: 'CAN',
  },
  {
    id: 'irl-burtonport',
    name: 'BURTONPORT',
    flag: 'IRL',
  },
  {
    id: 'fra-lebono',
    name: 'LE BONO',
    flag: 'FRA',
  },
  {
    id: 'deu-haren',
    name: 'HAREN',
    flag: 'DEU',
  },
  {
    id: 'swe-paaskallavik',
    name: 'PAASKALLAVIK',
    flag: 'SWE',
  },
  {
    id: 'usa-robinhoodmarine',
    name: 'ROBINHOOD MARINE',
    flag: 'USA',
  },
  {
    id: 'esp-sada',
    name: 'SADA',
    flag: 'ESP',
  },
  {
    id: 'esp-sanfernando',
    name: 'SAN FERNANDO',
    flag: 'ESP',
  },
  {
    id: 'fra-bonneuil',
    name: 'BONNEUIL',
    flag: 'FRA',
  },
  {
    id: 'arg-sannicolasdelosarroyos',
    name: 'SAN NICOLAS DE LOS ARROYOS',
    flag: 'ARG',
  },
  {
    id: 'esp-combarro',
    name: 'COMBARRO',
    flag: 'ESP',
  },
  {
    id: 'che-kaiseraugst',
    name: 'KAISERAUGST',
    flag: 'CHE',
  },
  {
    id: 'idn-tawang',
    name: 'TAWANG',
    flag: 'IDN',
  },
  {
    id: 'can-northarm',
    name: 'NORTH ARM',
    flag: 'CAN',
  },
  {
    id: 'usa-quartermaster',
    name: 'QUARTERMASTER',
    flag: 'USA',
  },
  {
    id: 'usa-corpuschristi',
    name: 'CORPUS CHRISTI',
    flag: 'USA',
  },
  {
    id: 'usa-stuart',
    name: 'STUART',
    flag: 'USA',
  },
  {
    id: "bhs-governor'sharbour",
    name: "GOVERNOR'S HARBOUR",
    flag: 'BHS',
  },
  {
    id: 'col-cartagena',
    name: 'CARTAGENA',
    flag: 'COL',
  },
  {
    id: 'esp-ribadeo',
    name: 'RIBADEO',
    flag: 'ESP',
  },
  {
    id: 'fra-arques',
    name: 'ARQUES',
    flag: 'FRA',
  },
  {
    id: 'nld-scharendijke',
    name: 'SCHARENDIJKE',
    flag: 'NLD',
  },
  {
    id: 'nor-stavanger',
    name: 'STAVANGER',
    flag: 'NOR',
  },
  {
    id: 'deu-norddeich',
    name: 'NORDDEICH',
    flag: 'DEU',
  },
  {
    id: 'nor-ardalstangen',
    name: 'ARDALSTANGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-halden',
    name: 'HALDEN',
    flag: 'NOR',
  },
  {
    id: 'deu-rostock',
    name: 'ROSTOCK',
    flag: 'DEU',
  },
  {
    id: 'ita-venice',
    name: 'VENICE',
    flag: 'ITA',
  },
  {
    id: 'ago-soyo',
    name: 'SOYO',
    flag: 'AGO',
  },
  {
    id: 'srb-apatin',
    name: 'APATIN',
    flag: 'SRB',
  },
  {
    id: 'fin-uusikaupunki',
    name: 'UUSIKAUPUNKI',
    flag: 'FIN',
  },
  {
    id: 'bgr-sozopol',
    name: 'SOZOPOL',
    flag: 'BGR',
  },
  {
    id: 'yem-hodeidah',
    name: 'HODEIDAH',
    flag: 'YEM',
  },
  {
    id: 'chn-dongguan',
    name: 'DONGGUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-taicang',
    name: 'TAICANG',
    flag: 'CHN',
  },
  {
    id: 'jpn-habu',
    name: 'HABU',
    flag: 'JPN',
  },
  {
    id: 'per-marquez',
    name: 'MARQUEZ',
    flag: 'PER',
  },
  {
    id: 'hti-gonaives',
    name: 'GONAIVES',
    flag: 'HTI',
  },
  {
    id: 'fra-audierne',
    name: 'AUDIERNE',
    flag: 'FRA',
  },
  {
    id: 'hrv-starigrad',
    name: 'STARI GRAD',
    flag: 'HRV',
  },
  {
    id: 'kor-mukho',
    name: 'MUKHO',
    flag: 'KOR',
  },
  {
    id: 'rus-magadan',
    name: 'MAGADAN',
    flag: 'RUS',
  },
  {
    id: 'usa-milford',
    name: 'MILFORD',
    flag: 'USA',
  },
  {
    id: 'nld-schoonhoven',
    name: 'SCHOONHOVEN',
    flag: 'NLD',
  },
  {
    id: 'png-bialla',
    name: 'BIALLA',
    flag: 'PNG',
  },
  {
    id: 'prt-praia',
    name: 'PRAIA',
    flag: 'PRT',
  },
  {
    id: 'usa-deerfieldbeach',
    name: 'DEERFIELD BEACH',
    flag: 'USA',
  },
  {
    id: 'phl-sanfernando',
    name: 'SAN FERNANDO',
    flag: 'PHL',
  },
  {
    id: 'swe-kaerrdal',
    name: 'KAERRDAL',
    flag: 'SWE',
  },
  {
    id: 'swe-langedrag',
    name: 'LANGEDRAG',
    flag: 'SWE',
  },
  {
    id: 'esp-rota',
    name: 'ROTA',
    flag: 'ESP',
  },
  {
    id: 'phl-batan',
    name: 'BATAN',
    flag: 'PHL',
  },
  {
    id: 'tca-cockburnharbor',
    name: 'COCKBURN HARBOR',
    flag: 'TCA',
  },
  {
    id: 'usa-westgulfport',
    name: 'WEST GULFPORT',
    flag: 'USA',
  },
  {
    id: 'nor-greaker',
    name: 'GREAKER',
    flag: 'NOR',
  },
  {
    id: 'cub-mariel',
    name: 'MARIEL',
    flag: 'CUB',
  },
  {
    id: 'aia-longbayvillage',
    name: 'LONG BAY VILLAGE',
    flag: 'AIA',
  },
  {
    id: 'ury-colonia',
    name: 'COLONIA',
    flag: 'URY',
  },
  {
    id: 'gbr-brixham',
    name: 'BRIXHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-runcorn',
    name: 'RUNCORN',
    flag: 'GBR',
  },
  {
    id: 'bel-antwerp',
    name: 'ANTWERP',
    flag: 'BEL',
  },
  {
    id: 'dnk-glyngore',
    name: 'GLYNGORE',
    flag: 'DNK',
  },
  {
    id: 'hrv-cres',
    name: 'CRES',
    flag: 'HRV',
  },
  {
    id: 'hrv-dubrovnik',
    name: 'DUBROVNIK',
    flag: 'HRV',
  },
  {
    id: 'nor-oksfjord',
    name: 'OKSFJORD',
    flag: 'NOR',
  },
  {
    id: 'rou-calafat',
    name: 'CALAFAT',
    flag: 'ROU',
  },
  {
    id: 'grc-skopelos',
    name: 'SKOPELOS',
    flag: 'GRC',
  },
  {
    id: 'rou-constanta',
    name: 'CONSTANTA',
    flag: 'ROU',
  },
  {
    id: 'ind-haldia',
    name: 'HALDIA',
    flag: 'IND',
  },
  {
    id: 'idn-suralaya',
    name: 'SURALAYA',
    flag: 'IDN',
  },
  {
    id: 'chn-shanwei',
    name: 'SHANWEI',
    flag: 'CHN',
  },
  {
    id: 'chn-bayuquan',
    name: 'BAYUQUAN',
    flag: 'CHN',
  },
  {
    id: 'phl-portcapiz',
    name: 'PORT CAPIZ',
    flag: 'PHL',
  },
  {
    id: 'jpn-niihama',
    name: 'NIIHAMA',
    flag: 'JPN',
  },
  {
    id: 'aus-ulladulla',
    name: 'ULLADULLA',
    flag: 'AUS',
  },
  {
    id: 'nzl-napier',
    name: 'NAPIER',
    flag: 'NZL',
  },
  {
    id: 'fra-menton',
    name: 'MENTON',
    flag: 'FRA',
  },
  {
    id: 'jpn-shiogama',
    name: 'SHIOGAMA',
    flag: 'JPN',
  },
  {
    id: 'ita-santamariadileuca',
    name: 'SANTA MARIA DI LEUCA',
    flag: 'ITA',
  },
  {
    id: 'twn-mailiao',
    name: 'MAILIAO',
    flag: 'TWN',
  },
  {
    id: 'aus-palmcove',
    name: 'PALM COVE',
    flag: 'AUS',
  },
  {
    id: 'chn-sanshaanchorage',
    name: 'SANSHA ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'niu-alofi',
    name: 'ALOFI',
    flag: 'NIU',
  },
  {
    id: 'usa-chignik',
    name: 'CHIGNIK',
    flag: 'USA',
  },
  {
    id: 'gbr-cromarty',
    name: 'CROMARTY',
    flag: 'GBR',
  },
  {
    id: 'nor-risor',
    name: 'RISOR',
    flag: 'NOR',
  },
  {
    id: 'swe-rindo',
    name: 'RINDO',
    flag: 'SWE',
  },
  {
    id: 'hrv-sipanskaluka',
    name: 'SIPANSKA LUKA',
    flag: 'HRV',
  },
  {
    id: 'hun-adony',
    name: 'ADONY',
    flag: 'HUN',
  },
  {
    id: 'bel-liege',
    name: 'LIEGE',
    flag: 'BEL',
  },
  {
    id: 'bel-vise',
    name: 'VISE',
    flag: 'BEL',
  },
  {
    id: 'usa-lockport',
    name: 'LOCKPORT',
    flag: 'USA',
  },
  {
    id: 'deu-dormagen',
    name: 'DORMAGEN',
    flag: 'DEU',
  },
  {
    id: 'usa-porthueneme',
    name: 'PORT HUENEME',
    flag: 'USA',
  },
  {
    id: 'usa-bellaire',
    name: 'BELLAIRE',
    flag: 'USA',
  },
  {
    id: 'lca-jalousie',
    name: 'JALOUSIE',
    flag: 'LCA',
  },
  {
    id: 'esp-muros',
    name: 'MUROS',
    flag: 'ESP',
  },
  {
    id: 'gbr-goole',
    name: 'GOOLE',
    flag: 'GBR',
  },
  {
    id: 'bel-bocholt',
    name: 'BOCHOLT',
    flag: 'BEL',
  },
  {
    id: 'swe-smogen',
    name: 'SMOGEN',
    flag: 'SWE',
  },
  {
    id: 'swe-bua',
    name: 'BUA',
    flag: 'SWE',
  },
  {
    id: 'fra-leconquet',
    name: 'LE CONQUET',
    flag: 'FRA',
  },
  {
    id: 'nld-vlieland',
    name: 'VLIELAND',
    flag: 'NLD',
  },
  {
    id: 'grc-chalki',
    name: 'CHALKI',
    flag: 'GRC',
  },
  {
    id: 'chn-shandongtou',
    name: 'SHANDONGTOU',
    flag: 'CHN',
  },
  {
    id: 'aus-porthuon',
    name: 'PORT HUON',
    flag: 'AUS',
  },
  {
    id: 'usa-santacruzca',
    name: 'SANTA CRUZ CA',
    flag: 'USA',
  },
  {
    id: 'idn-manggis',
    name: 'MANGGIS',
    flag: 'IDN',
  },
  {
    id: 'twn-zhongyun',
    name: 'ZHONGYUN',
    flag: 'TWN',
  },
  {
    id: 'phl-recodo',
    name: 'RECODO',
    flag: 'PHL',
  },
  {
    id: 'chn-huanghua',
    name: 'HUANG HUA',
    flag: 'CHN',
  },
  {
    id: 'rus-tuapse',
    name: 'TUAPSE',
    flag: 'RUS',
  },
  {
    id: 'dom-barahona',
    name: 'BARAHONA',
    flag: 'DOM',
  },
  {
    id: 'rus-volgograd',
    name: 'VOLGOGRAD',
    flag: 'RUS',
  },
  {
    id: 'deu-lubbecke',
    name: 'LUBBECKE',
    flag: 'DEU',
  },
  {
    id: 'bel-halle',
    name: 'HALLE',
    flag: 'BEL',
  },
  {
    id: 'pan-lasminas',
    name: 'LAS MINAS',
    flag: 'PAN',
  },
  {
    id: 'per-talara',
    name: 'TALARA',
    flag: 'PER',
  },
  {
    id: 'gbr-mevagissey',
    name: 'MEVAGISSEY',
    flag: 'GBR',
  },
  {
    id: 'gbr-troon',
    name: 'TROON',
    flag: 'GBR',
  },
  {
    id: 'bel-aalterbrug',
    name: 'AALTERBRUG',
    flag: 'BEL',
  },
  {
    id: 'nor-saeboe',
    name: 'SAEBOE',
    flag: 'NOR',
  },
  {
    id: 'nor-finnoy',
    name: 'FINNOY',
    flag: 'NOR',
  },
  {
    id: 'dnk-thorsminde',
    name: 'THORSMINDE',
    flag: 'DNK',
  },
  {
    id: 'ita-marinadipisa',
    name: 'MARINA DI PISA',
    flag: 'ITA',
  },
  {
    id: 'tur-izmir',
    name: 'IZMIR',
    flag: 'TUR',
  },
  {
    id: 'are-alhamriya',
    name: 'ALHAMRIYA',
    flag: 'ARE',
  },
  {
    id: 'chn-taixing',
    name: 'TAI XING',
    flag: 'CHN',
  },
  {
    id: 'nzl-russell',
    name: 'RUSSELL',
    flag: 'NZL',
  },
  {
    id: 'grc-tsingeli',
    name: 'TSINGELI',
    flag: 'GRC',
  },
  {
    id: 'esp-badalona',
    name: 'BADALONA',
    flag: 'ESP',
  },
  {
    id: 'kor-gampo',
    name: 'GAMPO',
    flag: 'KOR',
  },
  {
    id: 'jpn-noshiro',
    name: 'NOSHIRO',
    flag: 'JPN',
  },
  {
    id: 'ecu-puntaarenas',
    name: 'PUNTA ARENAS',
    flag: 'ECU',
  },
  {
    id: 'usa-hickman',
    name: 'HICKMAN',
    flag: 'USA',
  },
  {
    id: 'gbr-yarmouth',
    name: 'YARMOUTH',
    flag: 'GBR',
  },
  {
    id: 'esp-portdesantmiguel',
    name: 'PORT DE SANT MIGUEL',
    flag: 'ESP',
  },
  {
    id: 'tun-gabes',
    name: 'GABES',
    flag: 'TUN',
  },
  {
    id: 'swe-kristinehamn',
    name: 'KRISTINEHAMN',
    flag: 'SWE',
  },
  {
    id: 'can-patriciabay',
    name: 'PATRICIA BAY',
    flag: 'CAN',
  },
  {
    id: 'ita-baiae',
    name: 'BAIAE',
    flag: 'ITA',
  },
  {
    id: 'phl-legazpiport',
    name: 'LEGAZPI PORT',
    flag: 'PHL',
  },
  {
    id: 'deu-wurzburg',
    name: 'WURZBURG',
    flag: 'DEU',
  },
  {
    id: 'can-johnstown',
    name: 'JOHNSTOWN',
    flag: 'CAN',
  },
  {
    id: 'eri-assab',
    name: 'ASSAB',
    flag: 'ERI',
  },
  {
    id: 'usa-orange',
    name: 'ORANGE',
    flag: 'USA',
  },
  {
    id: 'usa-stockisland',
    name: 'STOCK ISLAND',
    flag: 'USA',
  },
  {
    id: 'bel-merelbeke',
    name: 'MERELBEKE',
    flag: 'BEL',
  },
  {
    id: 'fra-carnonplage',
    name: 'CARNON PLAGE',
    flag: 'FRA',
  },
  {
    id: 'nld-hansweert',
    name: 'HANSWEERT',
    flag: 'NLD',
  },
  {
    id: 'nga-oghara',
    name: 'OGHARA',
    flag: 'NGA',
  },
  {
    id: 'nor-hjorungavaag',
    name: 'HJORUNGAVAAG',
    flag: 'NOR',
  },
  {
    id: 'deu-lingen',
    name: 'LINGEN',
    flag: 'DEU',
  },
  {
    id: 'rou-medgidia',
    name: 'MEDGIDIA',
    flag: 'ROU',
  },
  {
    id: 'tur-karasu',
    name: 'KARASU',
    flag: 'TUR',
  },
  {
    id: 'qat-doha',
    name: 'DOHA',
    flag: 'QAT',
  },
  {
    id: 'are-abudhabi',
    name: 'ABU DHABI',
    flag: 'ARE',
  },
  {
    id: 'kor-incheon',
    name: 'INCHEON',
    flag: 'KOR',
  },
  {
    id: 'kor-okpo',
    name: 'OKPO',
    flag: 'KOR',
  },
  {
    id: 'jpn-higashiharima',
    name: 'HIGASHIHARIMA',
    flag: 'JPN',
  },
  {
    id: 'nzl-mimiwhangatabay',
    name: 'MIMIWHANGATA BAY',
    flag: 'NZL',
  },
  {
    id: 'ukr-yevpatoriya',
    name: 'YEVPATORIYA',
    flag: 'UKR',
  },
  {
    id: 'idn-tobelo',
    name: 'TOBELO',
    flag: 'IDN',
  },
  {
    id: 'gtm-puertoquetzal',
    name: 'PUERTO QUETZAL',
    flag: 'GTM',
  },
  {
    id: 'egy-ainsukhna',
    name: 'AIN SUKHNA',
    flag: 'EGY',
  },
  {
    id: 'jpn-yanai',
    name: 'YANAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-amagasakinishinomiya',
    name: 'AMAGASAKINISHINOMIYA',
    flag: 'JPN',
  },
  {
    id: 'gnq-bata',
    name: 'BATA',
    flag: 'GNQ',
  },
  {
    id: 'can-canso',
    name: 'CANSO',
    flag: 'CAN',
  },
  {
    id: 'usa-stlouis',
    name: 'ST LOUIS',
    flag: 'USA',
  },
  {
    id: 'usa-oceancity',
    name: 'OCEAN CITY',
    flag: 'USA',
  },
  {
    id: 'nor-eggesbones',
    name: 'EGGESBONES',
    flag: 'NOR',
  },
  {
    id: 'can-frasierriver',
    name: 'FRASIER RIVER',
    flag: 'CAN',
  },
  {
    id: 'nor-arendalanchorage',
    name: 'ARENDAL ANCHORAGE',
    flag: 'NOR',
  },
  {
    id: 'nor-svanem',
    name: 'SVANEM',
    flag: 'NOR',
  },
  {
    id: 'deu-mulheim',
    name: 'MULHEIM',
    flag: 'DEU',
  },
  {
    id: 'fra-vernon',
    name: 'VERNON',
    flag: 'FRA',
  },
  {
    id: 'usa-grandmaraisrecreat',
    name: 'GRAND MARAIS RECREAT',
    flag: 'USA',
  },
  {
    id: 'nld-culemborg',
    name: 'CULEMBORG',
    flag: 'NLD',
  },
  {
    id: 'usa-seattle',
    name: 'SEATTLE',
    flag: 'USA',
  },
  {
    id: 'mex-veracruz',
    name: 'VERACRUZ',
    flag: 'MEX',
  },
  {
    id: 'mex-dosbocas',
    name: 'DOS BOCAS',
    flag: 'MEX',
  },
  {
    id: 'abw-oranjestad',
    name: 'ORANJESTAD',
    flag: 'ABW',
  },
  {
    id: 'isl-bildudalur',
    name: 'BILDUDALUR',
    flag: 'ISL',
  },
  {
    id: 'gbr-plymouth',
    name: 'PLYMOUTH',
    flag: 'GBR',
  },
  {
    id: 'civ-abidjan',
    name: 'ABIDJAN',
    flag: 'CIV',
  },
  {
    id: 'nld-stellendam',
    name: 'STELLENDAM',
    flag: 'NLD',
  },
  {
    id: 'deu-uelzen',
    name: 'UELZEN',
    flag: 'DEU',
  },
  {
    id: 'ago-luanda',
    name: 'LUANDA',
    flag: 'AGO',
  },
  {
    id: 'hrv-drvenikmali',
    name: 'DRVENIK MALI',
    flag: 'HRV',
  },
  {
    id: 'est-tallinn',
    name: 'TALLINN',
    flag: 'EST',
  },
  {
    id: 'chn-hongwan',
    name: 'HONGWAN',
    flag: 'CHN',
  },
  {
    id: 'twn-hsinta',
    name: 'HSINTA',
    flag: 'TWN',
  },
  {
    id: 'chn-pishandao',
    name: 'PISHANDAO',
    flag: 'CHN',
  },
  {
    id: 'chl-cabonegro',
    name: 'CABO NEGRO',
    flag: 'CHL',
  },
  {
    id: 'fra-lapallice',
    name: 'LA PALLICE',
    flag: 'FRA',
  },
  {
    id: 'tgo-lome',
    name: 'LOME',
    flag: 'TGO',
  },
  {
    id: 'are-arzanahisland',
    name: 'ARZANAH ISLAND',
    flag: 'ARE',
  },
  {
    id: 'bra-jurongaracruz',
    name: 'JURONG ARACRUZ',
    flag: 'BRA',
  },
  {
    id: 'fra-guilvinec',
    name: 'GUILVINEC',
    flag: 'FRA',
  },
  {
    id: 'ind-pipavav',
    name: 'PIPAVAV',
    flag: 'IND',
  },
  {
    id: 'aus-whyalla',
    name: 'WHYALLA',
    flag: 'AUS',
  },
  {
    id: 'are-mubarrazfield',
    name: 'MUBARRAZ FIELD',
    flag: 'ARE',
  },
  {
    id: 'nga-quaiboeterminal',
    name: 'QUA IBOE TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'usa-spudpoint',
    name: 'SPUD POINT',
    flag: 'USA',
  },
  {
    id: 'usa-meydenbauer',
    name: 'MEYDENBAUER',
    flag: 'USA',
  },
  {
    id: 'esp-ailladeons',
    name: 'A ILLA DE ONS',
    flag: 'ESP',
  },
  {
    id: 'tur-ceyhan',
    name: 'CEYHAN',
    flag: 'TUR',
  },
  {
    id: 'rus-volgodonsk',
    name: 'VOLGODONSK',
    flag: 'RUS',
  },
  {
    id: 'aus-mourilyanharbour',
    name: 'MOURILYAN HARBOUR',
    flag: 'AUS',
  },
  {
    id: 'gbr-methil',
    name: 'METHIL',
    flag: 'GBR',
  },
  {
    id: 'usa-manitowoc',
    name: 'MANITOWOC',
    flag: 'USA',
  },
  {
    id: 'swe-brofjorden',
    name: 'BROFJORDEN',
    flag: 'SWE',
  },
  {
    id: 'gbr-avonmouth',
    name: 'AVONMOUTH',
    flag: 'GBR',
  },
  {
    id: 'irq-basrah',
    name: 'BASRAH',
    flag: 'IRQ',
  },
  {
    id: 'rou-tulcea',
    name: 'TULCEA',
    flag: 'ROU',
  },
  {
    id: 'ecu-posorja',
    name: 'POSORJA',
    flag: 'ECU',
  },
  {
    id: 'per-coishco',
    name: 'COISHCO',
    flag: 'PER',
  },
  {
    id: 'col-covenas',
    name: 'COVENAS',
    flag: 'COL',
  },
  {
    id: 'chl-chacao',
    name: 'CHACAO',
    flag: 'CHL',
  },
  {
    id: 'arg-sanantonioeste',
    name: 'SAN ANTONIO ESTE',
    flag: 'ARG',
  },
  {
    id: 'prt-vilamoura',
    name: 'VILAMOURA',
    flag: 'PRT',
  },
  {
    id: 'gbr-belfast',
    name: 'BELFAST',
    flag: 'GBR',
  },
  {
    id: 'fra-benodet',
    name: 'BENODET',
    flag: 'FRA',
  },
  {
    id: 'gbr-eyemouth',
    name: 'EYEMOUTH',
    flag: 'GBR',
  },
  {
    id: 'fra-letreport',
    name: 'LE TREPORT',
    flag: 'FRA',
  },
  {
    id: 'dnk-kerteminde',
    name: 'KERTEMINDE',
    flag: 'DNK',
  },
  {
    id: 'aut-ennsdorf',
    name: 'ENNSDORF',
    flag: 'AUT',
  },
  {
    id: 'ita-gallipoli',
    name: 'GALLIPOLI',
    flag: 'ITA',
  },
  {
    id: 'alb-shengjin',
    name: 'SHENGJIN',
    flag: 'ALB',
  },
  {
    id: 'lva-ventspils',
    name: 'VENTSPILS',
    flag: 'LVA',
  },
  {
    id: 'zaf-mosselbay',
    name: 'MOSSEL BAY',
    flag: 'ZAF',
  },
  {
    id: 'grc-ermioni',
    name: 'ERMIONI',
    flag: 'GRC',
  },
  {
    id: 'tur-sigacik',
    name: 'SIGACIK',
    flag: 'TUR',
  },
  {
    id: 'nor-kjollefjord',
    name: 'KJOLLEFJORD',
    flag: 'NOR',
  },
  {
    id: 'egy-alexandria',
    name: 'ALEXANDRIA',
    flag: 'EGY',
  },
  {
    id: 'chn-huangpu',
    name: 'HUANGPU',
    flag: 'CHN',
  },
  {
    id: 'twn-donggang',
    name: 'DONGGANG',
    flag: 'TWN',
  },
  {
    id: 'chn-pulandian',
    name: 'PULANDIAN',
    flag: 'CHN',
  },
  {
    id: 'phl-pulupandan',
    name: 'PULUPANDAN',
    flag: 'PHL',
  },
  {
    id: 'jpn-kuji',
    name: 'KUJI',
    flag: 'JPN',
  },
  {
    id: 'prt-lajesdasflores',
    name: 'LAJES DAS FLORES',
    flag: 'PRT',
  },
  {
    id: 'tur-aliaga',
    name: 'ALIAGA',
    flag: 'TUR',
  },
  {
    id: 'jpn-kagoshima',
    name: 'KAGOSHIMA',
    flag: 'JPN',
  },
  {
    id: 'col-turbo',
    name: 'TURBO',
    flag: 'COL',
  },
  {
    id: 'deu-gromitz',
    name: 'GROMITZ',
    flag: 'DEU',
  },
  {
    id: 'irn-dayyer',
    name: 'DAYYER',
    flag: 'IRN',
  },
  {
    id: 'esp-gijon',
    name: 'GIJON',
    flag: 'ESP',
  },
  {
    id: 'grc-monemvasia',
    name: 'MONEMVASIA',
    flag: 'GRC',
  },
  {
    id: 'rus-bagaevskaya',
    name: 'BAGAEVSKAYA',
    flag: 'RUS',
  },
  {
    id: 'rus-zhigansk',
    name: 'ZHIGANSK',
    flag: 'RUS',
  },
  {
    id: 'usa-portmoller',
    name: 'PORT MOLLER',
    flag: 'USA',
  },
  {
    id: 'usa-bethel',
    name: 'BETHEL',
    flag: 'USA',
  },
  {
    id: 'nld-oosterhout',
    name: 'OOSTERHOUT',
    flag: 'NLD',
  },
  {
    id: 'hrv-cavtat',
    name: 'CAVTAT',
    flag: 'HRV',
  },
  {
    id: 'phl-mariveles',
    name: 'MARIVELES',
    flag: 'PHL',
  },
  {
    id: 'deu-worthamrhein',
    name: 'WORTH AM RHEIN',
    flag: 'DEU',
  },
  {
    id: 'arg-corrientes',
    name: 'CORRIENTES',
    flag: 'ARG',
  },
  {
    id: 'aus-larrakeyah',
    name: 'LARRAKEYAH',
    flag: 'AUS',
  },
  {
    id: 'esp-elferrol',
    name: 'EL FERROL',
    flag: 'ESP',
  },
  {
    id: 'are-jazeeratumqassar',
    name: 'JAZEERAT UM QASSAR',
    flag: 'ARE',
  },
  {
    id: 'deu-hoechst',
    name: 'HOECHST',
    flag: 'DEU',
  },
  {
    id: 'pyf-borabora',
    name: 'BORA BORA',
    flag: 'PYF',
  },
  {
    id: 'usa-homer',
    name: 'HOMER',
    flag: 'USA',
  },
  {
    id: 'usa-pittsburg',
    name: 'PITTSBURG',
    flag: 'USA',
  },
  {
    id: 'dom-laromana',
    name: 'LA ROMANA',
    flag: 'DOM',
  },
  {
    id: 'ury-montevideo',
    name: 'MONTEVIDEO',
    flag: 'URY',
  },
  {
    id: 'esp-loscristianos',
    name: 'LOS CRISTIANOS',
    flag: 'ESP',
  },
  {
    id: 'fra-lecroisic',
    name: 'LE CROISIC',
    flag: 'FRA',
  },
  {
    id: 'fra-nantes',
    name: 'NANTES',
    flag: 'FRA',
  },
  {
    id: 'nor-egersund',
    name: 'EGERSUND',
    flag: 'NOR',
  },
  {
    id: 'ita-calasetta',
    name: 'CALASETTA',
    flag: 'ITA',
  },
  {
    id: 'ita-milazzo',
    name: 'MILAZZO',
    flag: 'ITA',
  },
  {
    id: 'hrv-velikidrvenik',
    name: 'VELIKI DRVENIK',
    flag: 'HRV',
  },
  {
    id: 'grc-leros',
    name: 'LEROS',
    flag: 'GRC',
  },
  {
    id: 'rus-rostovnadon',
    name: 'ROSTOV NA DON',
    flag: 'RUS',
  },
  {
    id: 'ind-karaikal',
    name: 'KARAIKAL',
    flag: 'IND',
  },
  {
    id: 'chn-xiamen',
    name: 'XIAMEN',
    flag: 'CHN',
  },
  {
    id: 'chn-dongjiakou',
    name: 'DONGJIAKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-liuheng',
    name: 'LIUHENG',
    flag: 'CHN',
  },
  {
    id: 'idn-maumere',
    name: 'MAUMERE',
    flag: 'IDN',
  },
  {
    id: 'phl-lugait',
    name: 'LUGAIT',
    flag: 'PHL',
  },
  {
    id: 'usa-pointcadet',
    name: 'POINT CADET',
    flag: 'USA',
  },
  {
    id: 'usa-newyork',
    name: 'NEW YORK',
    flag: 'USA',
  },
  {
    id: 'isl-hofn',
    name: 'HOFN',
    flag: 'ISL',
  },
  {
    id: 'ita-sciacca',
    name: 'SCIACCA',
    flag: 'ITA',
  },
  {
    id: 'ury-fraybentos',
    name: 'FRAY BENTOS',
    flag: 'URY',
  },
  {
    id: 'rus-retinskoe',
    name: 'RETINSKOE',
    flag: 'RUS',
  },
  {
    id: 'jpn-mishima',
    name: 'MISHIMA',
    flag: 'JPN',
  },
  {
    id: 'cmr-limbe',
    name: 'LIMBE',
    flag: 'CMR',
  },
  {
    id: 'bel-huy',
    name: 'HUY',
    flag: 'BEL',
  },
  {
    id: 'swe-bullandoe',
    name: 'BULLANDOE',
    flag: 'SWE',
  },
  {
    id: 'plw-melekeok',
    name: 'MELEKEOK',
    flag: 'PLW',
  },
  {
    id: 'tun-menzelbourguiba',
    name: 'MENZEL BOURGUIBA',
    flag: 'TUN',
  },
  {
    id: 'ita-cefalu',
    name: 'CEFALU',
    flag: 'ITA',
  },
  {
    id: 'rus-karaginskiyzaliv',
    name: 'KARAGINSKIY ZALIV',
    flag: 'RUS',
  },
  {
    id: 'hrv-tribunj',
    name: 'TRIBUNJ',
    flag: 'HRV',
  },
  {
    id: 'usa-togiak',
    name: 'TOGIAK',
    flag: 'USA',
  },
  {
    id: 'phl-tinoto',
    name: 'TINOTO',
    flag: 'PHL',
  },
  {
    id: 'can-cambridgebay',
    name: 'CAMBRIDGE BAY',
    flag: 'CAN',
  },
  {
    id: 'deu-hoya',
    name: 'HOYA',
    flag: 'DEU',
  },
  {
    id: 'nld-niftrik',
    name: 'NIFTRIK',
    flag: 'NLD',
  },
  {
    id: 'pan-taboguilla',
    name: 'TABOGUILLA',
    flag: 'PAN',
  },
  {
    id: 'idn-morodemak',
    name: 'MORODEMAK',
    flag: 'IDN',
  },
  {
    id: 'gbr-lochmaddy',
    name: 'LOCHMADDY',
    flag: 'GBR',
  },
  {
    id: 'fro-tvoroyri',
    name: 'TVOROYRI',
    flag: 'FRO',
  },
  {
    id: 'gbr-ardglass',
    name: 'ARDGLASS',
    flag: 'GBR',
  },
  {
    id: 'esp-aguilas',
    name: 'AGUILAS',
    flag: 'ESP',
  },
  {
    id: 'gbr-fawley',
    name: 'FAWLEY',
    flag: 'GBR',
  },
  {
    id: 'nld-zaandam',
    name: 'ZAANDAM',
    flag: 'NLD',
  },
  {
    id: 'nga-portharcourt',
    name: 'PORT HARCOURT',
    flag: 'NGA',
  },
  {
    id: 'ita-boccadimagra',
    name: 'BOCCA DI MAGRA',
    flag: 'ITA',
  },
  {
    id: 'dnk-nyborg',
    name: 'NYBORG',
    flag: 'DNK',
  },
  {
    id: 'nor-olderdalen',
    name: 'OLDERDALEN',
    flag: 'NOR',
  },
  {
    id: 'grc-epidavros',
    name: 'EPIDAVROS',
    flag: 'GRC',
  },
  {
    id: 'aze-baku',
    name: 'BAKU',
    flag: 'AZE',
  },
  {
    id: 'phl-ormoc',
    name: 'ORMOC',
    flag: 'PHL',
  },
  {
    id: 'jpn-ishikari',
    name: 'ISHIKARI',
    flag: 'JPN',
  },
  {
    id: 'aus-hardysbay',
    name: 'HARDYS BAY',
    flag: 'AUS',
  },
  {
    id: 'png-rabaul',
    name: 'RABAUL',
    flag: 'PNG',
  },
  {
    id: 'pyf-opunohubay',
    name: 'OPUNOHU BAY',
    flag: 'PYF',
  },
  {
    id: 'nor-abelnes',
    name: 'ABELNES',
    flag: 'NOR',
  },
  {
    id: 'gnq-luba',
    name: 'LUBA',
    flag: 'GNQ',
  },
  {
    id: 'idn-ternate',
    name: 'TERNATE',
    flag: 'IDN',
  },
  {
    id: 'grc-kalilimenesanchorage',
    name: 'KALI LIMENES ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'hrv-rijeka',
    name: 'RIJEKA',
    flag: 'HRV',
  },
  {
    id: 'nor-sula',
    name: 'SULA',
    flag: 'NOR',
  },
  {
    id: 'mlt-cirkewwa',
    name: 'CIRKEWWA',
    flag: 'MLT',
  },
  {
    id: 'mda-giurgiulesti',
    name: 'GIURGIULESTI',
    flag: 'MDA',
  },
  {
    id: 'tur-yalova',
    name: 'YALOVA',
    flag: 'TUR',
  },
  {
    id: 'fji-savusavu',
    name: 'SAVUSAVU',
    flag: 'FJI',
  },
  {
    id: 'nic-corinto',
    name: 'CORINTO',
    flag: 'NIC',
  },
  {
    id: 'idn-demta',
    name: 'DEMTA',
    flag: 'IDN',
  },
  {
    id: 'grc-frikes',
    name: 'FRIKES',
    flag: 'GRC',
  },
  {
    id: 'swe-viggbuholm',
    name: 'VIGGBUHOLM',
    flag: 'SWE',
  },
  {
    id: 'fra-portmort',
    name: 'PORT MORT',
    flag: 'FRA',
  },
  {
    id: 'usa-edgewater',
    name: 'EDGEWATER',
    flag: 'USA',
  },
  {
    id: 'usa-kodiak',
    name: 'KODIAK',
    flag: 'USA',
  },
  {
    id: 'bhs-bellscay',
    name: 'BELLS CAY',
    flag: 'BHS',
  },
  {
    id: 'usa-capecharles',
    name: 'CAPE CHARLES',
    flag: 'USA',
  },
  {
    id: 'arg-concepciondeluruguay',
    name: 'CONCEPCION DEL URUGUAY',
    flag: 'ARG',
  },
  {
    id: 'gbr-rothesay',
    name: 'ROTHESAY',
    flag: 'GBR',
  },
  {
    id: 'bel-izegem',
    name: 'IZEGEM',
    flag: 'BEL',
  },
  {
    id: 'nor-lysoysund',
    name: 'LYSOYSUND',
    flag: 'NOR',
  },
  {
    id: 'ita-portosantostefano',
    name: 'PORTO SANTO STEFANO',
    flag: 'ITA',
  },
  {
    id: 'ita-marsala',
    name: 'MARSALA',
    flag: 'ITA',
  },
  {
    id: 'ita-riposto',
    name: 'RIPOSTO',
    flag: 'ITA',
  },
  {
    id: 'ita-vibovalentia',
    name: 'VIBO VALENTIA',
    flag: 'ITA',
  },
  {
    id: 'ukr-olvia',
    name: 'OLVIA',
    flag: 'UKR',
  },
  {
    id: 'mys-sibu',
    name: 'SIBU',
    flag: 'MYS',
  },
  {
    id: 'idn-kotabaru',
    name: 'KOTABARU',
    flag: 'IDN',
  },
  {
    id: 'chn-sheyang',
    name: 'SHEYANG',
    flag: 'CHN',
  },
  {
    id: 'chn-nanhuangcheng',
    name: 'NANHUANGCHENG',
    flag: 'CHN',
  },
  {
    id: 'phl-puertogalera',
    name: 'PUERTO GALERA',
    flag: 'PHL',
  },
  {
    id: 'idn-ende',
    name: 'ENDE',
    flag: 'IDN',
  },
  {
    id: 'jpn-otaru',
    name: 'OTARU',
    flag: 'JPN',
  },
  {
    id: 'fra-plougonvelin',
    name: 'PLOUGONVELIN',
    flag: 'FRA',
  },
  {
    id: 'mys-sandakan',
    name: 'SANDAKAN',
    flag: 'MYS',
  },
  {
    id: 'usa-greenwich',
    name: 'GREENWICH',
    flag: 'USA',
  },
  {
    id: 'esp-sanadriandebesos',
    name: 'SAN ADRIAN DE BESOS',
    flag: 'ESP',
  },
  {
    id: 'ita-alghero',
    name: 'ALGHERO',
    flag: 'ITA',
  },
  {
    id: 'sau-aljubail',
    name: 'AL JUBAIL',
    flag: 'SAU',
  },
  {
    id: 'jpn-yokohama',
    name: 'YOKOHAMA',
    flag: 'JPN',
  },
  {
    id: 'civ-baobabmarineterminal',
    name: 'BAOBAB MARINE TERMINAL',
    flag: 'CIV',
  },
  {
    id: 'gtm-santotomas',
    name: 'SANTO TOMAS',
    flag: 'GTM',
  },
  {
    id: 'usa-warwick',
    name: 'WARWICK',
    flag: 'USA',
  },
  {
    id: 'hrv-stomorska',
    name: 'STOMORSKA',
    flag: 'HRV',
  },
  {
    id: 'aia-thevalley',
    name: 'THE VALLEY',
    flag: 'AIA',
  },
  {
    id: 'irl-fenit',
    name: 'FENIT',
    flag: 'IRL',
  },
  {
    id: 'irn-mahshahr',
    name: 'MAHSHAHR',
    flag: 'IRN',
  },
  {
    id: 'fra-paris',
    name: 'PARIS',
    flag: 'FRA',
  },
  {
    id: 'swe-fjallbacka',
    name: 'FJALLBACKA',
    flag: 'SWE',
  },
  {
    id: 'gbr-braefoot',
    name: 'BRAEFOOT',
    flag: 'GBR',
  },
  {
    id: 'rus-kamyshin',
    name: 'KAMYSHIN',
    flag: 'RUS',
  },
  {
    id: 'dnk-grasten',
    name: 'GRASTEN',
    flag: 'DNK',
  },
  {
    id: 'mex-coatzacoalcos',
    name: 'COATZACOALCOS',
    flag: 'MEX',
  },
  {
    id: 'can-sambro',
    name: 'SAMBRO',
    flag: 'CAN',
  },
  {
    id: 'irl-newross',
    name: 'NEW ROSS',
    flag: 'IRL',
  },
  {
    id: 'gbr-kilkeel',
    name: 'KILKEEL',
    flag: 'GBR',
  },
  {
    id: 'gbr-liverpool',
    name: 'LIVERPOOL',
    flag: 'GBR',
  },
  {
    id: 'esp-roses',
    name: 'ROSES',
    flag: 'ESP',
  },
  {
    id: 'nor-svelgen',
    name: 'SVELGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-brattvag',
    name: 'BRATTVAG',
    flag: 'NOR',
  },
  {
    id: 'fra-saintflorent',
    name: 'SAINT FLORENT',
    flag: 'FRA',
  },
  {
    id: 'deu-gelting',
    name: 'GELTING',
    flag: 'DEU',
  },
  {
    id: 'nor-horten',
    name: 'HORTEN',
    flag: 'NOR',
  },
  {
    id: 'nor-tjome',
    name: 'TJOME',
    flag: 'NOR',
  },
  {
    id: 'ita-palermo',
    name: 'PALERMO',
    flag: 'ITA',
  },
  {
    id: 'aut-korneuburg',
    name: 'KORNEUBURG',
    flag: 'AUT',
  },
  {
    id: 'grc-volos',
    name: 'VOLOS',
    flag: 'GRC',
  },
  {
    id: 'omn-duqm',
    name: 'DUQM',
    flag: 'OMN',
  },
  {
    id: 'chn-rushan',
    name: 'RUSHAN',
    flag: 'CHN',
  },
  {
    id: 'aus-botanybay',
    name: 'BOTANY BAY',
    flag: 'AUS',
  },
  {
    id: 'fra-montoir',
    name: 'MONTOIR',
    flag: 'FRA',
  },
  {
    id: 'fra-antibes',
    name: 'ANTIBES',
    flag: 'FRA',
  },
  {
    id: 'gmb-banjul',
    name: 'BANJUL',
    flag: 'GMB',
  },
  {
    id: 'swe-lulea',
    name: 'LULEA',
    flag: 'SWE',
  },
  {
    id: 'twn-toucheng',
    name: 'TOUCHENG',
    flag: 'TWN',
  },
  {
    id: 'nga-escravosfield',
    name: 'ESCRAVOS FIELD',
    flag: 'NGA',
  },
  {
    id: 'nld-elburg',
    name: 'ELBURG',
    flag: 'NLD',
  },
  {
    id: 'hrv-porec',
    name: 'POREC',
    flag: 'HRV',
  },
  {
    id: 'nor-hammerfest',
    name: 'HAMMERFEST',
    flag: 'NOR',
  },
  {
    id: 'rus-saratov',
    name: 'SARATOV',
    flag: 'RUS',
  },
  {
    id: 'usa-dillingham',
    name: 'DILLINGHAM',
    flag: 'USA',
  },
  {
    id: 'usa-martinez',
    name: 'MARTINEZ',
    flag: 'USA',
  },
  {
    id: 'grc-tilos',
    name: 'TILOS',
    flag: 'GRC',
  },
  {
    id: 'mex-ixtapa',
    name: 'IXTAPA',
    flag: 'MEX',
  },
  {
    id: 'pan-balboaanchorage',
    name: 'BALBOA ANCHORAGE',
    flag: 'PAN',
  },
  {
    id: 'hrv-zatonanchorage',
    name: 'ZATON ANCHORAGE',
    flag: 'HRV',
  },
  {
    id: 'usa-johnstown',
    name: 'JOHNSTOWN',
    flag: 'USA',
  },
  {
    id: 'usa-barnegatlighthouse',
    name: 'BARNEGAT LIGHTHOUSE',
    flag: 'USA',
  },
  {
    id: 'can-meteghan',
    name: 'METEGHAN',
    flag: 'CAN',
  },
  {
    id: 'isl-bolungarvik',
    name: 'BOLUNGARVIK',
    flag: 'ISL',
  },
  {
    id: 'isl-skagastrond',
    name: 'SKAGASTROND',
    flag: 'ISL',
  },
  {
    id: 'fro-torshavn',
    name: 'TORSHAVN',
    flag: 'FRO',
  },
  {
    id: 'gbr-whitby',
    name: 'WHITBY',
    flag: 'GBR',
  },
  {
    id: 'ita-marettimo',
    name: 'MARETTIMO',
    flag: 'ITA',
  },
  {
    id: 'swe-limhamn',
    name: 'LIMHAMN',
    flag: 'SWE',
  },
  {
    id: 'pol-portmorskipolice',
    name: 'PORT MORSKI POLICE',
    flag: 'POL',
  },
  {
    id: 'nor-narvik',
    name: 'NARVIK',
    flag: 'NOR',
  },
  {
    id: 'srb-velikogradiste',
    name: 'VELIKO GRADISTE',
    flag: 'SRB',
  },
  {
    id: 'chn-hongkong',
    name: 'HONGKONG',
    flag: 'CHN',
  },
  {
    id: 'idn-banjarmasin',
    name: 'BANJARMASIN',
    flag: 'IDN',
  },
  {
    id: 'chn-binhai',
    name: 'BINHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-zhapu',
    name: 'ZHAPU',
    flag: 'CHN',
  },
  {
    id: 'nld-uitdam',
    name: 'UITDAM',
    flag: 'NLD',
  },
  {
    id: 'jpn-mitajiri',
    name: 'MITAJIRI',
    flag: 'JPN',
  },
  {
    id: 'esp-moraira',
    name: 'MORAIRA',
    flag: 'ESP',
  },
  {
    id: 'egy-zeitbay',
    name: 'ZEIT BAY',
    flag: 'EGY',
  },
  {
    id: 'gab-oguendjoterminal',
    name: 'OGUENDJO TERMINAL',
    flag: 'GAB',
  },
  {
    id: 'brn-championfield',
    name: 'CHAMPION FIELD',
    flag: 'BRN',
  },
  {
    id: 'vct-chateaubelair',
    name: 'CHATEAUBELAIR',
    flag: 'VCT',
  },
  {
    id: 'mtq-fortdefrance',
    name: 'FORT DE FRANCE',
    flag: 'MTQ',
  },
  {
    id: 'nld-heerenveen',
    name: 'HEERENVEEN',
    flag: 'NLD',
  },
  {
    id: 'deu-neuharlingersiel',
    name: 'NEUHARLINGERSIEL',
    flag: 'DEU',
  },
  {
    id: 'cyp-paphos',
    name: 'PAPHOS',
    flag: 'CYP',
  },
  {
    id: "rus-bogatyr'",
    name: "BOGATYR'",
    flag: 'RUS',
  },
  {
    id: 'rus-egvekinot',
    name: 'EGVEKINOT',
    flag: 'RUS',
  },
  {
    id: 'deu-gluckstadt',
    name: 'GLUCKSTADT',
    flag: 'DEU',
  },
  {
    id: 'dza-jijel',
    name: 'JIJEL',
    flag: 'DZA',
  },
  {
    id: 'pyf-vairao',
    name: 'VAIRAO',
    flag: 'PYF',
  },
  {
    id: 'usa-albany',
    name: 'ALBANY',
    flag: 'USA',
  },
  {
    id: 'swe-valdemarsvik',
    name: 'VALDEMARSVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-borgholm',
    name: 'BORGHOLM',
    flag: 'SWE',
  },
  {
    id: 'rus-shakhtersk',
    name: 'SHAKHTERSK',
    flag: 'RUS',
  },
  {
    id: 'aus-somerville',
    name: 'SOMERVILLE',
    flag: 'AUS',
  },
  {
    id: 'fin-hamina',
    name: 'HAMINA',
    flag: 'FIN',
  },
  {
    id: 'ncl-kouaouaanchorage',
    name: 'KOUAOUA ANCHORAGE',
    flag: 'NCL',
  },
  {
    id: 'idn-muarabungin',
    name: 'MUARA BUNGIN',
    flag: 'IDN',
  },
  {
    id: 'idn-puger',
    name: 'PUGER',
    flag: 'IDN',
  },
  {
    id: 'usa-charleston',
    name: 'CHARLESTON',
    flag: 'USA',
  },
  {
    id: 'usa-sullivansisland',
    name: 'SULLIVANS ISLAND',
    flag: 'USA',
  },
  {
    id: 'can-quebec',
    name: 'QUEBEC',
    flag: 'CAN',
  },
  {
    id: 'fra-paimpol',
    name: 'PAIMPOL',
    flag: 'FRA',
  },
  {
    id: 'gbr-gravesend',
    name: 'GRAVESEND',
    flag: 'GBR',
  },
  {
    id: 'gbr-sheerness',
    name: 'SHEERNESS',
    flag: 'GBR',
  },
  {
    id: 'nld-amsterdam',
    name: 'AMSTERDAM',
    flag: 'NLD',
  },
  {
    id: 'dza-skikda',
    name: 'SKIKDA',
    flag: 'DZA',
  },
  {
    id: 'dnk-assens',
    name: 'ASSENS',
    flag: 'DNK',
  },
  {
    id: 'ita-portopila',
    name: 'PORTO PILA',
    flag: 'ITA',
  },
  {
    id: 'ita-portopalo',
    name: 'PORTOPALO',
    flag: 'ITA',
  },
  {
    id: 'tur-trabzon',
    name: 'TRABZON',
    flag: 'TUR',
  },
  {
    id: 'tur-camburnu',
    name: 'CAMBURNU',
    flag: 'TUR',
  },
  {
    id: 'chn-qishazhen',
    name: 'QISHAZHEN',
    flag: 'CHN',
  },
  {
    id: 'phl-bacolodcity',
    name: 'BACOLOD CITY',
    flag: 'PHL',
  },
  {
    id: 'idn-gorontalo',
    name: 'GORONTALO',
    flag: 'IDN',
  },
  {
    id: 'jpn-tokuyamakudamatsu',
    name: 'TOKUYAMAKUDAMATSU',
    flag: 'JPN',
  },
  {
    id: 'rus-vladivostok',
    name: 'VLADIVOSTOK',
    flag: 'RUS',
  },
  {
    id: 'png-alotau',
    name: 'ALOTAU',
    flag: 'PNG',
  },
  {
    id: 'aus-wynnum',
    name: 'WYNNUM',
    flag: 'AUS',
  },
  {
    id: 'fro-kollafjord',
    name: 'KOLLAFJORD',
    flag: 'FRO',
  },
  {
    id: 'esp-bahiadefornells',
    name: 'BAHIA DE FORNELLS',
    flag: 'ESP',
  },
  {
    id: 'dnk-niva',
    name: 'NIVA',
    flag: 'DNK',
  },
  {
    id: 'grc-karystosanchorage',
    name: 'KARYSTOS ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'tur-marmaraereglisi',
    name: 'MARMARA EREGLISI',
    flag: 'TUR',
  },
  {
    id: 'phl-dapa',
    name: 'DAPA',
    flag: 'PHL',
  },
  {
    id: 'esp-burriana',
    name: 'BURRIANA',
    flag: 'ESP',
  },
  {
    id: 'phl-dumaguete',
    name: 'DUMAGUETE',
    flag: 'PHL',
  },
  {
    id: 'aus-haypoint',
    name: 'HAY POINT',
    flag: 'AUS',
  },
  {
    id: 'deu-dortmund',
    name: 'DORTMUND',
    flag: 'DEU',
  },
  {
    id: 'nor-rubbestadneset',
    name: 'RUBBESTADNESET',
    flag: 'NOR',
  },
  {
    id: 'rus-sovgavan',
    name: 'SOVGAVAN',
    flag: 'RUS',
  },
  {
    id: 'usa-reddoganchorage',
    name: 'RED DOG ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-southharpswell',
    name: 'SOUTH HARPSWELL',
    flag: 'USA',
  },
  {
    id: 'nld-zeewolde',
    name: 'ZEEWOLDE',
    flag: 'NLD',
  },
  {
    id: 'nor-ansnes',
    name: 'ANSNES',
    flag: 'NOR',
  },
  {
    id: 'dnk-logstor',
    name: 'LOGSTOR',
    flag: 'DNK',
  },
  {
    id: 'idn-muncar',
    name: 'MUNCAR',
    flag: 'IDN',
  },
  {
    id: 'nld-ochten',
    name: 'OCHTEN',
    flag: 'NLD',
  },
  {
    id: 'tza-tanga',
    name: 'TANGA',
    flag: 'TZA',
  },
  {
    id: 'tza-mjimwematerminal',
    name: 'MJIMWEMA TERMINAL',
    flag: 'TZA',
  },
  {
    id: 'nor-leinoy',
    name: 'LEINOY',
    flag: 'NOR',
  },
  {
    id: 'fra-treguier',
    name: 'TREGUIER',
    flag: 'FRA',
  },
  {
    id: 'nor-reilstad',
    name: 'REILSTAD',
    flag: 'NOR',
  },
  {
    id: 'gbr-gunness',
    name: 'GUNNESS',
    flag: 'GBR',
  },
  {
    id: 'usa-porthadlock',
    name: 'PORT HADLOCK',
    flag: 'USA',
  },
  {
    id: 'usa-redwoodcity',
    name: 'REDWOOD CITY',
    flag: 'USA',
  },
  {
    id: 'usa-pascagoula',
    name: 'PASCAGOULA',
    flag: 'USA',
  },
  {
    id: 'usa-decatur',
    name: 'DECATUR',
    flag: 'USA',
  },
  {
    id: 'cri-puertoherradura',
    name: 'PUERTO HERRADURA',
    flag: 'CRI',
  },
  {
    id: 'jam-montegobay',
    name: 'MONTEGO BAY',
    flag: 'JAM',
  },
  {
    id: 'grl-nuuk',
    name: 'NUUK',
    flag: 'GRL',
  },
  {
    id: 'nld-haarlem',
    name: 'HAARLEM',
    flag: 'NLD',
  },
  {
    id: 'deu-lampertheim',
    name: 'LAMPERTHEIM',
    flag: 'DEU',
  },
  {
    id: 'nor-lervik',
    name: 'LERVIK',
    flag: 'NOR',
  },
  {
    id: 'dnk-vang',
    name: 'VANG',
    flag: 'DNK',
  },
  {
    id: 'aut-hofamtpriel',
    name: 'HOFAMT PRIEL',
    flag: 'AUT',
  },
  {
    id: 'grc-corfu',
    name: 'CORFU',
    flag: 'GRC',
  },
  {
    id: 'lva-riga',
    name: 'RIGA',
    flag: 'LVA',
  },
  {
    id: 'grc-serifos',
    name: 'SERIFOS',
    flag: 'GRC',
  },
  {
    id: 'bgr-somovit',
    name: 'SOMOVIT',
    flag: 'BGR',
  },
  {
    id: 'grc-lipsi',
    name: 'LIPSI',
    flag: 'GRC',
  },
  {
    id: 'rus-makhachkala',
    name: 'MAKHACHKALA',
    flag: 'RUS',
  },
  {
    id: 'idn-tanjungbalaikarimun',
    name: 'TANJUNG BALAI KARIMUN',
    flag: 'IDN',
  },
  {
    id: 'chn-dapeng',
    name: 'DAPENG',
    flag: 'CHN',
  },
  {
    id: 'twn-suao',
    name: 'SUAO',
    flag: 'TWN',
  },
  {
    id: 'nzl-moturuaisland',
    name: 'MOTURUA ISLAND',
    flag: 'NZL',
  },
  {
    id: 'jpn-yonabaru',
    name: 'YONABARU',
    flag: 'JPN',
  },
  {
    id: 'nzl-whangaruru',
    name: 'WHANGARURU',
    flag: 'NZL',
  },
  {
    id: 'ita-lipari',
    name: 'LIPARI',
    flag: 'ITA',
  },
  {
    id: 'tur-martas',
    name: 'MARTAS',
    flag: 'TUR',
  },
  {
    id: 'usa-vendovianchorage',
    name: 'VENDOVI ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'chn-youcaihua',
    name: 'YOUCAIHUA',
    flag: 'CHN',
  },
  {
    id: 'are-rashidfield',
    name: 'RASHID FIELD',
    flag: 'ARE',
  },
  {
    id: 'nld-appingedam',
    name: 'APPINGEDAM',
    flag: 'NLD',
  },
  {
    id: 'tur-hopa',
    name: 'HOPA',
    flag: 'TUR',
  },
  {
    id: 'nld-kornwerderzand',
    name: 'KORNWERDERZAND',
    flag: 'NLD',
  },
  {
    id: 'nor-fauske',
    name: 'FAUSKE',
    flag: 'NOR',
  },
  {
    id: 'jpn-shinmonji',
    name: 'SHINMONJI',
    flag: 'JPN',
  },
  {
    id: 'gbr-ayr',
    name: 'AYR',
    flag: 'GBR',
  },
  {
    id: 'esp-elastillero',
    name: 'EL ASTILLERO',
    flag: 'ESP',
  },
  {
    id: 'ita-alassio',
    name: 'ALASSIO',
    flag: 'ITA',
  },
  {
    id: 'dnk-aeroskobing',
    name: 'AEROSKOBING',
    flag: 'DNK',
  },
  {
    id: 'aia-sandygroundvillage',
    name: 'SANDY GROUND VILLAGE',
    flag: 'AIA',
  },
  {
    id: 'jpn-aioi',
    name: 'AIOI',
    flag: 'JPN',
  },
  {
    id: 'bel-harelbeke',
    name: 'HARELBEKE',
    flag: 'BEL',
  },
  {
    id: 'hnd-tela',
    name: 'TELA',
    flag: 'HND',
  },
  {
    id: 'fra-saintsuliac',
    name: 'SAINT SULIAC',
    flag: 'FRA',
  },
  {
    id: 'usa-monterey',
    name: 'MONTEREY',
    flag: 'USA',
  },
  {
    id: 'pan-almirante',
    name: 'ALMIRANTE',
    flag: 'PAN',
  },
  {
    id: 'ecu-sanlorenzo',
    name: 'SAN LORENZO',
    flag: 'ECU',
  },
  {
    id: 'usa-melville',
    name: 'MELVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-harwichport',
    name: 'HARWICH PORT',
    flag: 'USA',
  },
  {
    id: 'usa-northhaven',
    name: 'NORTH HAVEN',
    flag: 'USA',
  },
  {
    id: 'brb-checkerhall',
    name: 'CHECKER HALL',
    flag: 'BRB',
  },
  {
    id: 'esp-lasgalletas',
    name: 'LAS GALLETAS',
    flag: 'ESP',
  },
  {
    id: 'esp-puertocalero',
    name: 'PUERTO CALERO',
    flag: 'ESP',
  },
  {
    id: 'gbr-amble',
    name: 'AMBLE',
    flag: 'GBR',
  },
  {
    id: 'nld-volendam',
    name: 'VOLENDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-venlo',
    name: 'VENLO',
    flag: 'NLD',
  },
  {
    id: 'nga-onne',
    name: 'ONNE',
    flag: 'NGA',
  },
  {
    id: 'deu-breisach',
    name: 'BREISACH',
    flag: 'DEU',
  },
  {
    id: 'nor-sandnessjoen',
    name: 'SANDNESSJOEN',
    flag: 'NOR',
  },
  {
    id: 'ind-bhavnagarnewport',
    name: 'BHAVNAGAR NEW PORT',
    flag: 'IND',
  },
  {
    id: 'sgp-singapore',
    name: 'SINGAPORE',
    flag: 'SGP',
  },
  {
    id: 'chn-shuidong',
    name: 'SHUIDONG',
    flag: 'CHN',
  },
  {
    id: 'chn-pingyuan',
    name: 'PINGYUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chenjiagang',
    name: 'CHENJIAGANG',
    flag: 'CHN',
  },
  {
    id: 'phl-libertad',
    name: 'LIBERTAD',
    flag: 'PHL',
  },
  {
    id: 'mnp-saipan',
    name: 'SAIPAN',
    flag: 'MNP',
  },
  {
    id: 'dnk-klintholm',
    name: 'KLINTHOLM',
    flag: 'DNK',
  },
  {
    id: 'ind-nhavasheva',
    name: 'NHAVA SHEVA',
    flag: 'IND',
  },
  {
    id: 'chn-longkou',
    name: 'LONGKOU',
    flag: 'CHN',
  },
  {
    id: 'kwt-shuaiba',
    name: 'SHUAIBA',
    flag: 'KWT',
  },
  {
    id: 'usa-toledo',
    name: 'TOLEDO',
    flag: 'USA',
  },
  {
    id: 'usa-onset',
    name: 'ONSET',
    flag: 'USA',
  },
  {
    id: 'ita-marcianamarina',
    name: 'MARCIANA MARINA',
    flag: 'ITA',
  },
  {
    id: 'dnk-snekkersten',
    name: 'SNEKKERSTEN',
    flag: 'DNK',
  },
  {
    id: 'aut-sanktaegidi',
    name: 'SANKT AEGIDI',
    flag: 'AUT',
  },
  {
    id: 'nor-steinkjer',
    name: 'STEINKJER',
    flag: 'NOR',
  },
  {
    id: 'mdg-majunga',
    name: 'MAJUNGA',
    flag: 'MDG',
  },
  {
    id: 'gbr-coleraine',
    name: 'COLERAINE',
    flag: 'GBR',
  },
  {
    id: 'aus-redlandbay',
    name: 'REDLAND BAY',
    flag: 'AUS',
  },
  {
    id: 'mhl-kwajalein',
    name: 'KWAJALEIN',
    flag: 'MHL',
  },
  {
    id: 'swe-storugns',
    name: 'STORUGNS',
    flag: 'SWE',
  },
  {
    id: 'mne-budva',
    name: 'BUDVA',
    flag: 'MNE',
  },
  {
    id: 'are-ummshaif',
    name: 'UMM SHAIF',
    flag: 'ARE',
  },
  {
    id: 'glp-portlouis',
    name: 'PORT LOUIS',
    flag: 'GLP',
  },
  {
    id: 'nld-lieshout',
    name: 'LIESHOUT',
    flag: 'NLD',
  },
  {
    id: 'fra-tonnaycharente',
    name: 'TONNAY CHARENTE',
    flag: 'FRA',
  },
  {
    id: 'idn-wonokerto',
    name: 'WONOKERTO',
    flag: 'IDN',
  },
  {
    id: 'usa-westport',
    name: 'WESTPORT',
    flag: 'USA',
  },
  {
    id: 'usa-sarasota',
    name: 'SARASOTA',
    flag: 'USA',
  },
  {
    id: 'can-montreal',
    name: 'MONTREAL',
    flag: 'CAN',
  },
  {
    id: 'nor-nesset',
    name: 'NESSET',
    flag: 'NOR',
  },
  {
    id: 'nor-fagerstrand',
    name: 'FAGERSTRAND',
    flag: 'NOR',
  },
  {
    id: 'ita-lampedusa',
    name: 'LAMPEDUSA',
    flag: 'ITA',
  },
  {
    id: 'grc-elafonisos',
    name: 'ELAFONISOS',
    flag: 'GRC',
  },
  {
    id: 'grc-lavrion',
    name: 'LAVRION',
    flag: 'GRC',
  },
  {
    id: 'fin-kotka',
    name: 'KOTKA',
    flag: 'FIN',
  },
  {
    id: 'aze-qobustan',
    name: 'QOBUSTAN',
    flag: 'AZE',
  },
  {
    id: 'idn-batam',
    name: 'BATAM',
    flag: 'IDN',
  },
  {
    id: 'idn-bawean',
    name: 'BAWEAN',
    flag: 'IDN',
  },
  {
    id: 'chn-changshu',
    name: 'CHANGSHU',
    flag: 'CHN',
  },
  {
    id: 'phl-masbate',
    name: 'MASBATE',
    flag: 'PHL',
  },
  {
    id: 'phl-cagayandeoro',
    name: 'CAGAYAN DE ORO',
    flag: 'PHL',
  },
  {
    id: 'phl-nasipitport',
    name: 'NASIPIT PORT',
    flag: 'PHL',
  },
  {
    id: 'jpn-urasoe',
    name: 'URASOE',
    flag: 'JPN',
  },
  {
    id: 'aus-kettering',
    name: 'KETTERING',
    flag: 'AUS',
  },
  {
    id: 'aus-hawksnest',
    name: 'HAWKS NEST',
    flag: 'AUS',
  },
  {
    id: 'aus-cannonhill',
    name: 'CANNON HILL',
    flag: 'AUS',
  },
  {
    id: 'pyf-atuona',
    name: 'ATUONA',
    flag: 'PYF',
  },
  {
    id: 'grl-maniitsoq',
    name: 'MANIITSOQ',
    flag: 'GRL',
  },
  {
    id: 'bra-madrededeus',
    name: 'MADRE DE DEUS',
    flag: 'BRA',
  },
  {
    id: 'esp-torreguadiaro',
    name: 'TORREGUADIARO',
    flag: 'ESP',
  },
  {
    id: 'gbr-glasgow',
    name: 'GLASGOW',
    flag: 'GBR',
  },
  {
    id: 'grc-fournoi',
    name: 'FOURNOI',
    flag: 'GRC',
  },
  {
    id: 'jpn-saiki',
    name: 'SAIKI',
    flag: 'JPN',
  },
  {
    id: 'per-pisco',
    name: 'PISCO',
    flag: 'PER',
  },
  {
    id: 'gbr-blyth',
    name: 'BLYTH',
    flag: 'GBR',
  },
  {
    id: 'ita-barletta',
    name: 'BARLETTA',
    flag: 'ITA',
  },
  {
    id: 'are-kalbaanchorage',
    name: 'KALBA ANCHORAGE',
    flag: 'ARE',
  },
  {
    id: 'chn-qianliyan',
    name: 'QIANLIYAN',
    flag: 'CHN',
  },
  {
    id: 'usa-thunderboltmarine',
    name: 'THUNDERBOLT MARINE',
    flag: 'USA',
  },
  {
    id: 'nld-kerkdriel',
    name: 'KERKDRIEL',
    flag: 'NLD',
  },
  {
    id: 'grc-kyparissia',
    name: 'KYPARISSIA',
    flag: 'GRC',
  },
  {
    id: 'aus-fanniebay',
    name: 'FANNIE BAY',
    flag: 'AUS',
  },
  {
    id: 'usa-larsenbay',
    name: 'LARSEN BAY',
    flag: 'USA',
  },
  {
    id: 'usa-portofnaples',
    name: 'PORT OF NAPLES',
    flag: 'USA',
  },
  {
    id: 'per-puertochicama',
    name: 'PUERTO CHICAMA',
    flag: 'PER',
  },
  {
    id: 'gbr-fleetwood',
    name: 'FLEETWOOD',
    flag: 'GBR',
  },
  {
    id: 'aus-victoriapoint',
    name: 'VICTORIA POINT',
    flag: 'AUS',
  },
  {
    id: 'grc-aspropyrgos',
    name: 'ASPROPYRGOS',
    flag: 'GRC',
  },
  {
    id: 'mex-zihuatanejo',
    name: 'ZIHUATANEJO',
    flag: 'MEX',
  },
  {
    id: 'tuv-funafuti',
    name: 'FUNAFUTI',
    flag: 'TUV',
  },
  {
    id: 'cze-decin',
    name: 'DECIN',
    flag: 'CZE',
  },
  {
    id: 'gbr-morfanefyn',
    name: 'MORFA NEFYN',
    flag: 'GBR',
  },
  {
    id: 'dnk-faaborg',
    name: 'FAABORG',
    flag: 'DNK',
  },
  {
    id: 'nld-oss',
    name: 'OSS',
    flag: 'NLD',
  },
  {
    id: 'irl-whitegate',
    name: 'WHITEGATE',
    flag: 'IRL',
  },
  {
    id: 'deu-schwelgern',
    name: 'SCHWELGERN',
    flag: 'DEU',
  },
  {
    id: 'per-pacasmayo',
    name: 'PACASMAYO',
    flag: 'PER',
  },
  {
    id: 'usa-petersburg',
    name: 'PETERSBURG',
    flag: 'USA',
  },
  {
    id: 'usa-nantucket',
    name: 'NANTUCKET',
    flag: 'USA',
  },
  {
    id: 'sen-ziguinchor',
    name: 'ZIGUINCHOR',
    flag: 'SEN',
  },
  {
    id: 'isl-eskifjordur',
    name: 'ESKIFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'esp-mugia',
    name: 'MUGIA',
    flag: 'ESP',
  },
  {
    id: 'prt-nazare',
    name: 'NAZARE',
    flag: 'PRT',
  },
  {
    id: 'fra-antifer',
    name: 'ANTIFER',
    flag: 'FRA',
  },
  {
    id: 'esp-peniscola',
    name: 'PENISCOLA',
    flag: 'ESP',
  },
  {
    id: 'bel-duffel',
    name: 'DUFFEL',
    flag: 'BEL',
  },
  {
    id: 'nld-moerdijk',
    name: 'MOERDIJK',
    flag: 'NLD',
  },
  {
    id: 'nor-sand',
    name: 'SAND',
    flag: 'NOR',
  },
  {
    id: 'dnk-naestved',
    name: 'NAESTVED',
    flag: 'DNK',
  },
  {
    id: 'mlt-comino',
    name: 'COMINO',
    flag: 'MLT',
  },
  {
    id: 'alb-vlores',
    name: 'VLORES',
    flag: 'ALB',
  },
  {
    id: 'ltu-klaipeda',
    name: 'KLAIPEDA',
    flag: 'LTU',
  },
  {
    id: 'grc-santorini',
    name: 'SANTORINI',
    flag: 'GRC',
  },
  {
    id: 'pak-portqasim',
    name: 'PORT QASIM',
    flag: 'PAK',
  },
  {
    id: 'mys-kualasepetang',
    name: 'KUALA SEPETANG',
    flag: 'MYS',
  },
  {
    id: 'bra-itaguai',
    name: 'ITAGUAI',
    flag: 'BRA',
  },
  {
    id: 'esp-calaratjada',
    name: 'CALA RATJADA',
    flag: 'ESP',
  },
  {
    id: 'nor-filtvet',
    name: 'FILTVET',
    flag: 'NOR',
  },
  {
    id: 'chn-qinyu',
    name: 'QINYU',
    flag: 'CHN',
  },
  {
    id: 'fra-nice',
    name: 'NICE',
    flag: 'FRA',
  },
  {
    id: 'idn-lontar',
    name: 'LONTAR',
    flag: 'IDN',
  },
  {
    id: 'sau-rastanura',
    name: 'RAS TANURA',
    flag: 'SAU',
  },
  {
    id: 'chn-bayuquananchorage',
    name: 'BAYUQUAN ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'usa-warrenton',
    name: 'WARRENTON',
    flag: 'USA',
  },
  {
    id: 'usa-goodsellpoint',
    name: 'GOODSELL POINT',
    flag: 'USA',
  },
  {
    id: 'nld-groningen',
    name: 'GRONINGEN',
    flag: 'NLD',
  },
  {
    id: 'dnk-rendbjerg',
    name: 'RENDBJERG',
    flag: 'DNK',
  },
  {
    id: "ukr-skadovs'k",
    name: "SKADOVS'K",
    flag: 'UKR',
  },
  {
    id: 'bhr-minasalman',
    name: 'MINA SALMAN',
    flag: 'BHR',
  },
  {
    id: 'usa-kennebunkport',
    name: 'KENNEBUNKPORT',
    flag: 'USA',
  },
  {
    id: 'mys-kuantancity',
    name: 'KUANTAN CITY',
    flag: 'MYS',
  },
  {
    id: 'gbr-yfelinheli',
    name: 'Y FELINHELI',
    flag: 'GBR',
  },
  {
    id: 'nld-boskoop',
    name: 'BOSKOOP',
    flag: 'NLD',
  },
  {
    id: 'usa-palmcoast',
    name: 'PALM COAST',
    flag: 'USA',
  },
  {
    id: 'can-nanticoke',
    name: 'NANTICOKE',
    flag: 'CAN',
  },
  {
    id: 'usa-stamfordlanding',
    name: 'STAMFORD LANDING',
    flag: 'USA',
  },
  {
    id: 'arg-santafe',
    name: 'SANTA FE',
    flag: 'ARG',
  },
  {
    id: 'arg-zarate',
    name: 'ZARATE',
    flag: 'ARG',
  },
  {
    id: 'gbr-larne',
    name: 'LARNE',
    flag: 'GBR',
  },
  {
    id: 'nld-monnickendam',
    name: 'MONNICKENDAM',
    flag: 'NLD',
  },
  {
    id: 'deu-wilhelmshaven',
    name: 'WILHELMSHAVEN',
    flag: 'DEU',
  },
  {
    id: 'nor-namsos',
    name: 'NAMSOS',
    flag: 'NOR',
  },
  {
    id: 'nor-rypefjord',
    name: 'RYPEFJORD',
    flag: 'NOR',
  },
  {
    id: 'grc-chios',
    name: 'CHIOS',
    flag: 'GRC',
  },
  {
    id: 'rou-galati',
    name: 'GALATI',
    flag: 'ROU',
  },
  {
    id: 'chn-yantai',
    name: 'YANTAI',
    flag: 'CHN',
  },
  {
    id: 'chn-yushanisland',
    name: 'YUSHAN ISLAND',
    flag: 'CHN',
  },
  {
    id: 'kor-ulsan',
    name: 'ULSAN',
    flag: 'KOR',
  },
  {
    id: 'aus-bermagui',
    name: 'BERMAGUI',
    flag: 'AUS',
  },
  {
    id: 'nzl-rakinoisland',
    name: 'RAKINO ISLAND',
    flag: 'NZL',
  },
  {
    id: 'usa-tacoma',
    name: 'TACOMA',
    flag: 'USA',
  },
  {
    id: 'qat-simaisma',
    name: 'SIMAISMA',
    flag: 'QAT',
  },
  {
    id: 'esp-sanciprian',
    name: 'SAN CIPRIAN',
    flag: 'ESP',
  },
  {
    id: 'gib-gibraltar',
    name: 'GIBRALTAR',
    flag: 'GIB',
  },
  {
    id: 'yem-almukalla',
    name: 'AL MUKALLA',
    flag: 'YEM',
  },
  {
    id: 'tur-dardanelles',
    name: 'DARDANELLES',
    flag: 'TUR',
  },
  {
    id: 'sau-dammam',
    name: 'DAMMAM',
    flag: 'SAU',
  },
  {
    id: 'arg-comodororivadavia',
    name: 'COMODORO RIVADAVIA',
    flag: 'ARG',
  },
  {
    id: 'chn-qinzhouanchorage',
    name: 'QIN ZHOU ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'usa-longview',
    name: 'LONGVIEW',
    flag: 'USA',
  },
  {
    id: 'per-salaverry',
    name: 'SALAVERRY',
    flag: 'PER',
  },
  {
    id: 'grd-lesterrebay',
    name: 'LESTERRE BAY',
    flag: 'GRD',
  },
  {
    id: 'mar-mohammedia',
    name: 'MOHAMMEDIA',
    flag: 'MAR',
  },
  {
    id: 'ita-aprillamarittima',
    name: 'APRILLA MARITTIMA',
    flag: 'ITA',
  },
  {
    id: 'rus-balakhna',
    name: 'BALAKHNA',
    flag: 'RUS',
  },
  {
    id: 'nld-kessel',
    name: 'KESSEL',
    flag: 'NLD',
  },
  {
    id: 'aus-broome',
    name: 'BROOME',
    flag: 'AUS',
  },
  {
    id: 'hrv-lukutiha',
    name: 'LUKU TIHA',
    flag: 'HRV',
  },
  {
    id: 'usa-haymarkterminal',
    name: 'HAYMARK TERMINAL',
    flag: 'USA',
  },
  {
    id: 'swe-lomma',
    name: 'LOMMA',
    flag: 'SWE',
  },
  {
    id: 'esp-redes',
    name: 'REDES',
    flag: 'ESP',
  },
  {
    id: 'can-buccaneerbay',
    name: 'BUCCANEER BAY',
    flag: 'CAN',
  },
  {
    id: 'mex-topolobampo',
    name: 'TOPOLOBAMPO',
    flag: 'MEX',
  },
  {
    id: 'usa-krotzsprings',
    name: 'KROTZ SPRINGS',
    flag: 'USA',
  },
  {
    id: 'usa-goldenmeadow',
    name: 'GOLDEN MEADOW',
    flag: 'USA',
  },
  {
    id: 'usa-havana',
    name: 'HAVANA',
    flag: 'USA',
  },
  {
    id: 'usa-mayport',
    name: 'MAYPORT',
    flag: 'USA',
  },
  {
    id: 'usa-telemarbay',
    name: 'TELEMAR BAY',
    flag: 'USA',
  },
  {
    id: 'usa-poughkeepsie',
    name: 'POUGHKEEPSIE',
    flag: 'USA',
  },
  {
    id: 'can-troisrivieres',
    name: 'TROIS RIVIERES',
    flag: 'CAN',
  },
  {
    id: 'vir-vessupbay',
    name: 'VESSUP BAY',
    flag: 'VIR',
  },
  {
    id: 'can-burgeo',
    name: 'BURGEO',
    flag: 'CAN',
  },
  {
    id: 'gbr-lerwick',
    name: 'LERWICK',
    flag: 'GBR',
  },
  {
    id: 'bel-kluisbergen',
    name: 'KLUISBERGEN',
    flag: 'BEL',
  },
  {
    id: 'nld-workum',
    name: 'WORKUM',
    flag: 'NLD',
  },
  {
    id: 'hrv-sutomiscica',
    name: 'SUTOMISCICA',
    flag: 'HRV',
  },
  {
    id: 'aut-scharndorf',
    name: 'SCHARNDORF',
    flag: 'AUT',
  },
  {
    id: 'lbn-beirut',
    name: 'BEIRUT',
    flag: 'LBN',
  },
  {
    id: 'sau-duba',
    name: 'DUBA',
    flag: 'SAU',
  },
  {
    id: 'idn-belawan',
    name: 'BELAWAN',
    flag: 'IDN',
  },
  {
    id: 'chn-tianjin',
    name: 'TIANJIN',
    flag: 'CHN',
  },
  {
    id: 'chn-lanshan',
    name: 'LANSHAN',
    flag: 'CHN',
  },
  {
    id: 'phl-tagbilaran',
    name: 'TAGBILARAN',
    flag: 'PHL',
  },
  {
    id: 'rus-podyapolsk',
    name: 'PODYAPOLSK',
    flag: 'RUS',
  },
  {
    id: 'aus-gladstone',
    name: 'GLADSTONE',
    flag: 'AUS',
  },
  {
    id: 'esp-lapuntilla',
    name: 'LA PUNTILLA',
    flag: 'ESP',
  },
  {
    id: 'swe-oskarshamn',
    name: 'OSKARSHAMN',
    flag: 'SWE',
  },
  {
    id: 'twn-gengfang',
    name: 'GENGFANG',
    flag: 'TWN',
  },
  {
    id: 'usa-forthancock',
    name: 'FORT HANCOCK',
    flag: 'USA',
  },
  {
    id: 'nor-slagen',
    name: 'SLAGEN',
    flag: 'NOR',
  },
  {
    id: 'jpn-komatsushima',
    name: 'KOMATSUSHIMA',
    flag: 'JPN',
  },
  {
    id: 'esp-tarragona',
    name: 'TARRAGONA',
    flag: 'ESP',
  },
  {
    id: 'usa-rodriguezkey',
    name: 'RODRIGUEZ KEY',
    flag: 'USA',
  },
  {
    id: 'can-rimouski',
    name: 'RIMOUSKI',
    flag: 'CAN',
  },
  {
    id: 'deu-minden',
    name: 'MINDEN',
    flag: 'DEU',
  },
  {
    id: 'aut-hainburganderdonau',
    name: 'HAINBURG AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'per-huarmey',
    name: 'HUARMEY',
    flag: 'PER',
  },
  {
    id: 'sgp-pulaupunggoltimor',
    name: 'PULAU PUNGGOL TIMOR',
    flag: 'SGP',
  },
  {
    id: 'rus-prigorodnoyeanchorage',
    name: 'PRIGORODNOYE ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'cmr-massongo',
    name: 'MASSONGO',
    flag: 'CMR',
  },
  {
    id: 'deu-heidelberg',
    name: 'HEIDELBERG',
    flag: 'DEU',
  },
  {
    id: 'imn-portsaintmary',
    name: 'PORT SAINT MARY',
    flag: 'IMN',
  },
  {
    id: 'swe-ororvikabyfjorden',
    name: 'O RORVIK ABYFJORDEN',
    flag: 'SWE',
  },
  {
    id: 'egy-abughusun',
    name: 'ABU GHUSUN',
    flag: 'EGY',
  },
  {
    id: 'usa-valdez',
    name: 'VALDEZ',
    flag: 'USA',
  },
  {
    id: 'usa-seattleportmadison',
    name: 'SEATTLE PORT MADISON',
    flag: 'USA',
  },
  {
    id: 'cpv-mindelo',
    name: 'MINDELO',
    flag: 'CPV',
  },
  {
    id: 'mrt-cansado',
    name: 'CANSADO',
    flag: 'MRT',
  },
  {
    id: 'esp-palamos',
    name: 'PALAMOS',
    flag: 'ESP',
  },
  {
    id: 'nor-hareid',
    name: 'HAREID',
    flag: 'NOR',
  },
  {
    id: 'nld-eemshaven',
    name: 'EEMSHAVEN',
    flag: 'NLD',
  },
  {
    id: 'dnk-hvidesande',
    name: 'HVIDE SANDE',
    flag: 'DNK',
  },
  {
    id: 'ita-procida',
    name: 'PROCIDA',
    flag: 'ITA',
  },
  {
    id: 'hrv-susak',
    name: 'SUSAK',
    flag: 'HRV',
  },
  {
    id: 'nor-bugoynes',
    name: 'BUGOYNES',
    flag: 'NOR',
  },
  {
    id: 'chn-changjiangkou',
    name: 'CHANGJIANGKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-yangshan',
    name: 'YANGSHAN',
    flag: 'CHN',
  },
  {
    id: 'idn-serui',
    name: 'SERUI',
    flag: 'IDN',
  },
  {
    id: 'fro-strendur',
    name: 'STRENDUR',
    flag: 'FRO',
  },
  {
    id: 'jpn-shingu',
    name: 'SHINGU',
    flag: 'JPN',
  },
  {
    id: 'ita-lampedusaanchorage',
    name: 'LAMPEDUSA ANCHORAGE',
    flag: 'ITA',
  },
  {
    id: 'ind-mormugao',
    name: 'MORMUGAO',
    flag: 'IND',
  },
  {
    id: 'col-puertobolivar',
    name: 'PUERTO BOLIVAR',
    flag: 'COL',
  },
  {
    id: 'are-khalifa',
    name: 'KHALIFA',
    flag: 'ARE',
  },
  {
    id: 'chn-changsha',
    name: 'CHANGSHA',
    flag: 'CHN',
  },
  {
    id: 'bra-tubarao',
    name: 'TUBARAO',
    flag: 'BRA',
  },
  {
    id: "cog-n'kossaterminal",
    name: "N'KOSSA TERMINAL",
    flag: 'COG',
  },
  {
    id: 'usa-sewardanchorage',
    name: 'SEWARD ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'fra-vannes',
    name: 'VANNES',
    flag: 'FRA',
  },
  {
    id: 'gbr-lymington',
    name: 'LYMINGTON',
    flag: 'GBR',
  },
  {
    id: 'deu-grosskrotzenburg',
    name: 'GROSSKROTZENBURG',
    flag: 'DEU',
  },
  {
    id: 'dnk-hadsund',
    name: 'HADSUND',
    flag: 'DNK',
  },
  {
    id: 'swe-stockby',
    name: 'STOCKBY',
    flag: 'SWE',
  },
  {
    id: 'bgr-silistra',
    name: 'SILISTRA',
    flag: 'BGR',
  },
  {
    id: 'chn-taipingwan',
    name: 'TAIPINGWAN',
    flag: 'CHN',
  },
  {
    id: 'bra-aracaju',
    name: 'ARACAJU',
    flag: 'BRA',
  },
  {
    id: 'gbr-queenborough',
    name: 'QUEENBOROUGH',
    flag: 'GBR',
  },
  {
    id: 'gbr-southwold',
    name: 'SOUTHWOLD',
    flag: 'GBR',
  },
  {
    id: 'dnk-ejerslev',
    name: 'EJERSLEV',
    flag: 'DNK',
  },
  {
    id: 'tun-monastir',
    name: 'MONASTIR',
    flag: 'TUN',
  },
  {
    id: 'fsm-colonia',
    name: 'COLONIA',
    flag: 'FSM',
  },
  {
    id: 'swe-kinderoad',
    name: 'KINDE ROAD',
    flag: 'SWE',
  },
  {
    id: 'usa-kenai',
    name: 'KENAI',
    flag: 'USA',
  },
  {
    id: 'swe-ljungskile',
    name: 'LJUNGSKILE',
    flag: 'SWE',
  },
  {
    id: 'usa-cathlamet',
    name: 'CATHLAMET',
    flag: 'USA',
  },
  {
    id: 'per-tierracolorada',
    name: 'TIERRA COLORADA',
    flag: 'PER',
  },
  {
    id: 'can-pubnico',
    name: 'PUBNICO',
    flag: 'CAN',
  },
  {
    id: 'can-portmouton',
    name: 'PORT MOUTON',
    flag: 'CAN',
  },
  {
    id: 'sur-paramariboanchorage',
    name: 'PARAMARIBO ANCHORAGE',
    flag: 'SUR',
  },
  {
    id: 'gbr-torquay',
    name: 'TORQUAY',
    flag: 'GBR',
  },
  {
    id: 'nld-willemstad',
    name: 'WILLEMSTAD',
    flag: 'NLD',
  },
  {
    id: 'bel-lanaken',
    name: 'LANAKEN',
    flag: 'BEL',
  },
  {
    id: 'svn-piran',
    name: 'PIRAN',
    flag: 'SVN',
  },
  {
    id: 'hrv-plomin',
    name: 'PLOMIN',
    flag: 'HRV',
  },
  {
    id: 'ita-vulcano',
    name: 'VULCANO',
    flag: 'ITA',
  },
  {
    id: 'fin-raahe',
    name: 'RAAHE',
    flag: 'FIN',
  },
  {
    id: 'dji-djibouti',
    name: 'DJIBOUTI',
    flag: 'DJI',
  },
  {
    id: 'idn-kumaianchorage',
    name: 'KUMAI ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-kendari',
    name: 'KENDARI',
    flag: 'IDN',
  },
  {
    id: 'idn-sorong',
    name: 'SORONG',
    flag: 'IDN',
  },
  {
    id: 'jpn-hososhima',
    name: 'HOSOSHIMA',
    flag: 'JPN',
  },
  {
    id: 'aus-jacobswell',
    name: 'JACOBS WELL',
    flag: 'AUS',
  },
  {
    id: 'esp-fuengirola',
    name: 'FUENGIROLA',
    flag: 'ESP',
  },
  {
    id: 'fra-lelavandou',
    name: 'LE LAVANDOU',
    flag: 'FRA',
  },
  {
    id: 'usa-seward',
    name: 'SEWARD',
    flag: 'USA',
  },
  {
    id: 'usa-morrobay',
    name: 'MORRO BAY',
    flag: 'USA',
  },
  {
    id: 'deu-saintgoar',
    name: 'SAINT GOAR',
    flag: 'DEU',
  },
  {
    id: 'deu-oberwesel',
    name: 'OBERWESEL',
    flag: 'DEU',
  },
  {
    id: 'dnk-nykobing(falster)',
    name: 'NYKOBING (FALSTER)',
    flag: 'DNK',
  },
  {
    id: 'usa-greenbay',
    name: 'GREEN BAY',
    flag: 'USA',
  },
  {
    id: 'swe-saltsjoebadenpaalna',
    name: 'SALTSJOEBADEN PAALNA',
    flag: 'SWE',
  },
  {
    id: 'rou-orsova',
    name: 'ORSOVA',
    flag: 'ROU',
  },
  {
    id: 'can-saintlawrence',
    name: 'SAINT LAWRENCE',
    flag: 'CAN',
  },
  {
    id: 'bel-herstal',
    name: 'HERSTAL',
    flag: 'BEL',
  },
  {
    id: 'irl-skerries',
    name: 'SKERRIES',
    flag: 'IRL',
  },
  {
    id: 'gbr-lochaline',
    name: 'LOCHALINE',
    flag: 'GBR',
  },
  {
    id: 'rus-ustkut',
    name: 'UST KUT',
    flag: 'RUS',
  },
  {
    id: 'bra-trombetas',
    name: 'TROMBETAS',
    flag: 'BRA',
  },
  {
    id: 'nor-helle',
    name: 'HELLE',
    flag: 'NOR',
  },
  {
    id: 'idn-glumpangumpunguno',
    name: 'GLUMPANG UMPUNG UNO',
    flag: 'IDN',
  },
  {
    id: 'usa-lahaina',
    name: 'LAHAINA',
    flag: 'USA',
  },
  {
    id: 'usa-everett',
    name: 'EVERETT',
    flag: 'USA',
  },
  {
    id: 'usa-venice',
    name: 'VENICE',
    flag: 'USA',
  },
  {
    id: 'esp-tenerife',
    name: 'TENERIFE',
    flag: 'ESP',
  },
  {
    id: 'gbr-porttalbot',
    name: 'PORT TALBOT',
    flag: 'GBR',
  },
  {
    id: 'gbr-westray',
    name: 'WESTRAY',
    flag: 'GBR',
  },
  {
    id: 'fra-lehavre',
    name: 'LE HAVRE',
    flag: 'FRA',
  },
  {
    id: 'esp-arenysdemar',
    name: 'ARENYS DE MAR',
    flag: 'ESP',
  },
  {
    id: 'nor-fonnes',
    name: 'FONNES',
    flag: 'NOR',
  },
  {
    id: 'nor-vaksdal',
    name: 'VAKSDAL',
    flag: 'NOR',
  },
  {
    id: 'swe-vanersborg',
    name: 'VANERSBORG',
    flag: 'SWE',
  },
  {
    id: 'swe-sodertalje',
    name: 'SODERTALJE',
    flag: 'SWE',
  },
  {
    id: 'pol-gdansk',
    name: 'GDANSK',
    flag: 'POL',
  },
  {
    id: 'aze-sangachal',
    name: 'SANGACHAL',
    flag: 'AZE',
  },
  {
    id: 'tha-bangkok',
    name: 'BANGKOK',
    flag: 'THA',
  },
  {
    id: 'idn-palembang',
    name: 'PALEMBANG',
    flag: 'IDN',
  },
  {
    id: 'chn-caofeidian',
    name: 'CAOFEIDIAN',
    flag: 'CHN',
  },
  {
    id: 'jpn-shimizu',
    name: 'SHIMIZU',
    flag: 'JPN',
  },
  {
    id: 'aus-geelong',
    name: 'GEELONG',
    flag: 'AUS',
  },
  {
    id: 'bhs-spanishwells',
    name: 'SPANISH WELLS',
    flag: 'BHS',
  },
  {
    id: 'jpn-hiradoanchorage',
    name: 'HIRADO ANCHORAGE',
    flag: 'JPN',
  },
  {
    id: 'deu-juist',
    name: 'JUIST',
    flag: 'DEU',
  },
  {
    id: 'png-wewak',
    name: 'WEWAK',
    flag: 'PNG',
  },
  {
    id: 'gbr-whitehills',
    name: 'WHITEHILLS',
    flag: 'GBR',
  },
  {
    id: 'nld-breukelen',
    name: 'BREUKELEN',
    flag: 'NLD',
  },
  {
    id: 'sjm-nyalesund',
    name: 'NY ALESUND',
    flag: 'SJM',
  },
  {
    id: 'rus-nikolayevsknaamur',
    name: 'NIKOLAYEVSK NA AMUR',
    flag: 'RUS',
  },
  {
    id: 'grc-varkiza',
    name: 'VARKIZA',
    flag: 'GRC',
  },
  {
    id: 'can-goderich',
    name: 'GODERICH',
    flag: 'CAN',
  },
  {
    id: 'prt-lajes',
    name: 'LAJES',
    flag: 'PRT',
  },
  {
    id: 'fra-gargenville',
    name: 'GARGENVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-chartrettes',
    name: 'CHARTRETTES',
    flag: 'FRA',
  },
  {
    id: 'tha-phatthaya',
    name: 'PHATTHAYA',
    flag: 'THA',
  },
  {
    id: 'cxr-flyingfishcove',
    name: 'FLYING FISH COVE',
    flag: 'CXR',
  },
  {
    id: 'can-sydney',
    name: 'SYDNEY',
    flag: 'CAN',
  },
  {
    id: 'ita-lerici',
    name: 'LERICI',
    flag: 'ITA',
  },
  {
    id: 'deu-reisholz',
    name: 'REISHOLZ',
    flag: 'DEU',
  },
  {
    id: 'bel-gavere',
    name: 'GAVERE',
    flag: 'BEL',
  },
  {
    id: 'usa-morrisonville',
    name: 'MORRISONVILLE',
    flag: 'USA',
  },
  {
    id: 'fra-hendaye',
    name: 'HENDAYE',
    flag: 'FRA',
  },
  {
    id: 'usa-juneau',
    name: 'JUNEAU',
    flag: 'USA',
  },
  {
    id: 'usa-calumetharbor',
    name: 'CALUMET HARBOR',
    flag: 'USA',
  },
  {
    id: 'can-sorel',
    name: 'SOREL',
    flag: 'CAN',
  },
  {
    id: 'esp-tarajal',
    name: 'TARAJAL',
    flag: 'ESP',
  },
  {
    id: 'fra-blaye',
    name: 'BLAYE',
    flag: 'FRA',
  },
  {
    id: 'nld-weesp',
    name: 'WEESP',
    flag: 'NLD',
  },
  {
    id: 'nor-stord',
    name: 'STORD',
    flag: 'NOR',
  },
  {
    id: 'fra-saintmandrier',
    name: 'SAINT MANDRIER',
    flag: 'FRA',
  },
  {
    id: 'nor-reine',
    name: 'REINE',
    flag: 'NOR',
  },
  {
    id: 'ukr-balaklavskyi',
    name: 'BALAKLAVSKYI',
    flag: 'UKR',
  },
  {
    id: 'idn-kotaagung',
    name: 'KOTA AGUNG',
    flag: 'IDN',
  },
  {
    id: 'chn-zhanjiang',
    name: 'ZHANJIANG',
    flag: 'CHN',
  },
  {
    id: 'jpn-namikata',
    name: 'NAMIKATA',
    flag: 'JPN',
  },
  {
    id: 'idn-kaimana',
    name: 'KAIMANA',
    flag: 'IDN',
  },
  {
    id: 'rus-krabozavodsk',
    name: 'KRABOZAVODSK',
    flag: 'RUS',
  },
  {
    id: 'usa-kingcove',
    name: 'KING COVE',
    flag: 'USA',
  },
  {
    id: 'isl-sudavik',
    name: 'SUDAVIK',
    flag: 'ISL',
  },
  {
    id: 'nor-oslo',
    name: 'OSLO',
    flag: 'NOR',
  },
  {
    id: 'phl-cabcaben',
    name: 'CABCABEN',
    flag: 'PHL',
  },
  {
    id: 'dom-samana',
    name: 'SAMANA',
    flag: 'DOM',
  },
  {
    id: 'deu-lubeck',
    name: 'LUBECK',
    flag: 'DEU',
  },
  {
    id: 'jpn-iwakuni',
    name: 'IWAKUNI',
    flag: 'JPN',
  },
  {
    id: 'mex-cayoarcas',
    name: 'CAYO ARCAS',
    flag: 'MEX',
  },
  {
    id: 'nga-seaeagleterminal',
    name: 'SEA EAGLE TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'deu-herne',
    name: 'HERNE',
    flag: 'DEU',
  },
  {
    id: 'deu-bergeshoevede',
    name: 'BERGESHOEVEDE',
    flag: 'DEU',
  },
  {
    id: 'rus-voznesenyeanchorage',
    name: 'VOZNESENYE ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'rus-ozernovskiy',
    name: 'OZERNOVSKIY',
    flag: 'RUS',
  },
  {
    id: 'bgr-balchik',
    name: 'BALCHIK',
    flag: 'BGR',
  },
  {
    id: 'usa-barataria',
    name: 'BARATARIA',
    flag: 'USA',
  },
  {
    id: 'can-midland',
    name: 'MIDLAND',
    flag: 'CAN',
  },
  {
    id: 'gbr-tees',
    name: 'TEES',
    flag: 'GBR',
  },
  {
    id: 'nor-tvedestrand',
    name: 'TVEDESTRAND',
    flag: 'NOR',
  },
  {
    id: 'ita-ameglia',
    name: 'AMEGLIA',
    flag: 'ITA',
  },
  {
    id: 'phl-castanas',
    name: 'CASTANAS',
    flag: 'PHL',
  },
  {
    id: 'swe-sandarne',
    name: 'SANDARNE',
    flag: 'SWE',
  },
  {
    id: 'nor-hindaravag',
    name: 'HINDARAVAG',
    flag: 'NOR',
  },
  {
    id: 'bgr-vidin',
    name: 'VIDIN',
    flag: 'BGR',
  },
  {
    id: 'mys-stulanglaut',
    name: 'STULANG LAUT',
    flag: 'MYS',
  },
  {
    id: 'bel-roeselare',
    name: 'ROESELARE',
    flag: 'BEL',
  },
  {
    id: 'pyf-faaa',
    name: 'FAAA',
    flag: 'PYF',
  },
  {
    id: 'usa-louisville',
    name: 'LOUISVILLE',
    flag: 'USA',
  },
  {
    id: 'cub-cienfuegos',
    name: 'CIENFUEGOS',
    flag: 'CUB',
  },
  {
    id: 'bhs-bullockharbour',
    name: 'BULLOCK HARBOUR',
    flag: 'BHS',
  },
  {
    id: 'bhs-nassau',
    name: 'NASSAU',
    flag: 'BHS',
  },
  {
    id: 'per-ancon',
    name: 'ANCON',
    flag: 'PER',
  },
  {
    id: 'usa-wickfordcove',
    name: 'WICKFORD COVE',
    flag: 'USA',
  },
  {
    id: 'blm-ilefourchue',
    name: 'ILE FOURCHUE',
    flag: 'BLM',
  },
  {
    id: 'gbr-newquay',
    name: 'NEWQUAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-greenock',
    name: 'GREENOCK',
    flag: 'GBR',
  },
  {
    id: 'fra-loctudy',
    name: 'LOCTUDY',
    flag: 'FRA',
  },
  {
    id: 'esp-larapita',
    name: 'LA RAPITA',
    flag: 'ESP',
  },
  {
    id: 'bel-dendermonde',
    name: 'DENDERMONDE',
    flag: 'BEL',
  },
  {
    id: 'nld-denhelder',
    name: 'DEN HELDER',
    flag: 'NLD',
  },
  {
    id: 'nor-kopervik',
    name: 'KOPERVIK',
    flag: 'NOR',
  },
  {
    id: 'nld-ijlst',
    name: 'IJLST',
    flag: 'NLD',
  },
  {
    id: 'nld-maasbracht',
    name: 'MAASBRACHT',
    flag: 'NLD',
  },
  {
    id: 'deu-lauenburg',
    name: 'LAUENBURG',
    flag: 'DEU',
  },
  {
    id: 'ita-terminiimerese',
    name: 'TERMINI IMERESE',
    flag: 'ITA',
  },
  {
    id: 'nor-stokkmarknes',
    name: 'STOKKMARKNES',
    flag: 'NOR',
  },
  {
    id: 'ind-paradip',
    name: 'PARADIP',
    flag: 'IND',
  },
  {
    id: 'mys-lumut',
    name: 'LUMUT',
    flag: 'MYS',
  },
  {
    id: 'idn-lubukgaung',
    name: 'LUBUK GAUNG',
    flag: 'IDN',
  },
  {
    id: 'idn-lamongan',
    name: 'LAMONGAN',
    flag: 'IDN',
  },
  {
    id: 'aus-mindarie',
    name: 'MINDARIE',
    flag: 'AUS',
  },
  {
    id: 'jpn-tachibana',
    name: 'TACHIBANA',
    flag: 'JPN',
  },
  {
    id: 'aus-portpirie',
    name: 'PORT PIRIE',
    flag: 'AUS',
  },
  {
    id: 'aus-thursdayisland',
    name: 'THURSDAY ISLAND',
    flag: 'AUS',
  },
  {
    id: 'png-lae',
    name: 'LAE',
    flag: 'PNG',
  },
  {
    id: 'nzl-bluff',
    name: 'BLUFF',
    flag: 'NZL',
  },
  {
    id: 'can-cadborobay',
    name: 'CADBORO BAY',
    flag: 'CAN',
  },
  {
    id: 'nor-vestnes',
    name: 'VESTNES',
    flag: 'NOR',
  },
  {
    id: 'gab-caplopez',
    name: 'CAP LOPEZ',
    flag: 'GAB',
  },
  {
    id: 'dnk-asaa',
    name: 'ASAA',
    flag: 'DNK',
  },
  {
    id: 'hrv-krijal',
    name: 'KRIJAL',
    flag: 'HRV',
  },
  {
    id: 'chn-maoming',
    name: 'MAOMING',
    flag: 'CHN',
  },
  {
    id: 'kor-busannewport',
    name: 'BUSAN NEW PORT',
    flag: 'KOR',
  },
  {
    id: 'lby-khoms',
    name: 'KHOMS',
    flag: 'LBY',
  },
  {
    id: 'rus-oktyabrskiy',
    name: 'OKTYABRSKIY',
    flag: 'RUS',
  },
  {
    id: 'usa-newlondon',
    name: 'NEW LONDON',
    flag: 'USA',
  },
  {
    id: 'bra-ilheus',
    name: 'ILHEUS',
    flag: 'BRA',
  },
  {
    id: 'ita-marinadicampo',
    name: 'MARINA DI CAMPO',
    flag: 'ITA',
  },
  {
    id: 'tur-marmaris',
    name: 'MARMARIS',
    flag: 'TUR',
  },
  {
    id: 'nor-skien',
    name: 'SKIEN',
    flag: 'NOR',
  },
  {
    id: 'are-ummsuqeimiii',
    name: 'UMM SUQEIM III',
    flag: 'ARE',
  },
  {
    id: 'grc-kilada',
    name: 'KILADA',
    flag: 'GRC',
  },
  {
    id: 'gbr-iwade',
    name: 'IWADE',
    flag: 'GBR',
  },
  {
    id: 'jpn-sasebo',
    name: 'SASEBO',
    flag: 'JPN',
  },
  {
    id: 'fin-inkoo',
    name: 'INKOO',
    flag: 'FIN',
  },
  {
    id: 'can-portcredit',
    name: 'PORT CREDIT',
    flag: 'CAN',
  },
  {
    id: 'idn-eretanwetan',
    name: 'ERETAN WETAN',
    flag: 'IDN',
  },
  {
    id: 'can-sandspit',
    name: 'SANDSPIT',
    flag: 'CAN',
  },
  {
    id: 'usa-emeryville',
    name: 'EMERYVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-keywest',
    name: 'KEY WEST',
    flag: 'USA',
  },
  {
    id: 'usa-herringtonsouth',
    name: 'HERRINGTON SOUTH',
    flag: 'USA',
  },
  {
    id: 'usa-atlanticcity',
    name: 'ATLANTIC CITY',
    flag: 'USA',
  },
  {
    id: 'usa-portjefferson',
    name: 'PORT JEFFERSON',
    flag: 'USA',
  },
  {
    id: 'hti-portauprince',
    name: 'PORT AU PRINCE',
    flag: 'HTI',
  },
  {
    id: 'lca-culdesac',
    name: 'CUL DE SAC',
    flag: 'LCA',
  },
  {
    id: 'spm-miquelon',
    name: 'MIQUELON',
    flag: 'SPM',
  },
  {
    id: 'gbr-sharpness',
    name: 'SHARPNESS',
    flag: 'GBR',
  },
  {
    id: 'nor-jondal',
    name: 'JONDAL',
    flag: 'NOR',
  },
  {
    id: 'hun-bogyiszlo',
    name: 'BOGYISZLO',
    flag: 'HUN',
  },
  {
    id: 'zaf-durban',
    name: 'DURBAN',
    flag: 'ZAF',
  },
  {
    id: 'aus-darwin',
    name: 'DARWIN',
    flag: 'AUS',
  },
  {
    id: 'jpn-yawatahama',
    name: 'YAWATAHAMA',
    flag: 'JPN',
  },
  {
    id: 'aus-bundeena',
    name: 'BUNDEENA',
    flag: 'AUS',
  },
  {
    id: 'isl-keflavik',
    name: 'KEFLAVIK',
    flag: 'ISL',
  },
  {
    id: 'nor-maloy',
    name: 'MALOY',
    flag: 'NOR',
  },
  {
    id: 'tur-kemer',
    name: 'KEMER',
    flag: 'TUR',
  },
  {
    id: 'cyp-famagusta',
    name: 'FAMAGUSTA',
    flag: 'CYP',
  },
  {
    id: 'nzl-portfitzroy',
    name: 'PORT FITZROY',
    flag: 'NZL',
  },
  {
    id: 'per-mollendo',
    name: 'MOLLENDO',
    flag: 'PER',
  },
  {
    id: 'chl-valparaiso',
    name: 'VALPARAISO',
    flag: 'CHL',
  },
  {
    id: 'mrt-nouakchott',
    name: 'NOUAKCHOTT',
    flag: 'MRT',
  },
  {
    id: 'jpn-miike',
    name: 'MIIKE',
    flag: 'JPN',
  },
  {
    id: 'ind-tuticorin',
    name: 'TUTICORIN',
    flag: 'IND',
  },
  {
    id: 'usa-yakutat',
    name: 'YAKUTAT',
    flag: 'USA',
  },
  {
    id: 'usa-riversideyachtclub',
    name: 'RIVERSIDE YACHT CLUB',
    flag: 'USA',
  },
  {
    id: 'chl-terminalotway',
    name: 'TERMINAL OTWAY',
    flag: 'CHL',
  },
  {
    id: 'grc-kioni',
    name: 'KIONI',
    flag: 'GRC',
  },
  {
    id: 'tur-bandirma',
    name: 'BANDIRMA',
    flag: 'TUR',
  },
  {
    id: 'tur-giresun',
    name: 'GIRESUN',
    flag: 'TUR',
  },
  {
    id: 'are-yasmarina',
    name: 'YAS MARINA',
    flag: 'ARE',
  },
  {
    id: 'usa-saintmichaels',
    name: 'SAINT MICHAELS',
    flag: 'USA',
  },
  {
    id: 'usa-baranof',
    name: 'BARANOF',
    flag: 'USA',
  },
  {
    id: 'slb-maepu',
    name: 'MAEPU',
    flag: 'SLB',
  },
  {
    id: 'deu-trier',
    name: 'TRIER',
    flag: 'DEU',
  },
  {
    id: 'aia-blowingpointvillage',
    name: 'BLOWING POINT VILLAGE',
    flag: 'AIA',
  },
  {
    id: 'mar-kenitra',
    name: 'KENITRA',
    flag: 'MAR',
  },
  {
    id: 'deu-karlshagen',
    name: 'KARLSHAGEN',
    flag: 'DEU',
  },
  {
    id: 'bel-mons',
    name: 'MONS',
    flag: 'BEL',
  },
  {
    id: 'egy-aladabiyah',
    name: 'AL ADABIYAH',
    flag: 'EGY',
  },
  {
    id: 'can-tofino',
    name: 'TOFINO',
    flag: 'CAN',
  },
  {
    id: 'mex-acapulco',
    name: 'ACAPULCO',
    flag: 'MEX',
  },
  {
    id: 'mex-alvarado',
    name: 'ALVARADO',
    flag: 'MEX',
  },
  {
    id: 'pri-culebra',
    name: 'CULEBRA',
    flag: 'PRI',
  },
  {
    id: 'tto-scarborough',
    name: 'SCARBOROUGH',
    flag: 'TTO',
  },
  {
    id: 'prt-velas',
    name: 'VELAS',
    flag: 'PRT',
  },
  {
    id: 'isl-isafjordur',
    name: 'ISAFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'gbr-clydebank',
    name: 'CLYDEBANK',
    flag: 'GBR',
  },
  {
    id: 'gbr-bridlington',
    name: 'BRIDLINGTON',
    flag: 'GBR',
  },
  {
    id: 'esp-premiademar',
    name: 'PREMIA DE MAR',
    flag: 'ESP',
  },
  {
    id: 'dnk-korsor',
    name: 'KORSOR',
    flag: 'DNK',
  },
  {
    id: 'deu-berlin',
    name: 'BERLIN',
    flag: 'DEU',
  },
  {
    id: 'nor-bodo',
    name: 'BODO',
    flag: 'NOR',
  },
  {
    id: 'nor-alsvag',
    name: 'ALSVAG',
    flag: 'NOR',
  },
  {
    id: 'zaf-saldanhabay',
    name: 'SALDANHA BAY',
    flag: 'ZAF',
  },
  {
    id: 'jpn-naha',
    name: 'NAHA',
    flag: 'JPN',
  },
  {
    id: 'aus-portstephens',
    name: 'PORT STEPHENS',
    flag: 'AUS',
  },
  {
    id: 'nzl-whitianga',
    name: 'WHITIANGA',
    flag: 'NZL',
  },
  {
    id: 'esp-torrevieja',
    name: 'TORREVIEJA',
    flag: 'ESP',
  },
  {
    id: 'jpn-hamada',
    name: 'HAMADA',
    flag: 'JPN',
  },
  {
    id: 'dnk-fredericia',
    name: 'FREDERICIA',
    flag: 'DNK',
  },
  {
    id: 'deu-neustadt',
    name: 'NEUSTADT',
    flag: 'DEU',
  },
  {
    id: 'egy-idku',
    name: 'IDKU',
    flag: 'EGY',
  },
  {
    id: 'ind-sikka',
    name: 'SIKKA',
    flag: 'IND',
  },
  {
    id: 'idn-dompas',
    name: 'DOMPAS',
    flag: 'IDN',
  },
  {
    id: 'phl-lapaz',
    name: 'LA PAZ',
    flag: 'PHL',
  },
  {
    id: 'jpn-onahama',
    name: 'ONAHAMA',
    flag: 'JPN',
  },
  {
    id: 'pry-pilar',
    name: 'PILAR',
    flag: 'PRY',
  },
  {
    id: 'dnk-studstrup',
    name: 'STUDSTRUP',
    flag: 'DNK',
  },
  {
    id: 'grc-kefalos',
    name: 'KEFALOS',
    flag: 'GRC',
  },
  {
    id: 'rus-nizhniynovgorod',
    name: 'NIZHNIY NOVGOROD',
    flag: 'RUS',
  },
  {
    id: 'civ-portbouetanchorage',
    name: 'PORT BOUET ANCHORAGE',
    flag: 'CIV',
  },
  {
    id: 'mex-puertomadero',
    name: 'PUERTO MADERO',
    flag: 'MEX',
  },
  {
    id: 'usa-manistee',
    name: 'MANISTEE',
    flag: 'USA',
  },
  {
    id: 'nor-storfosna',
    name: 'STORFOSNA',
    flag: 'NOR',
  },
  {
    id: 'usa-alameda',
    name: 'ALAMEDA',
    flag: 'USA',
  },
  {
    id: 'jpn-tahara',
    name: 'TAHARA',
    flag: 'JPN',
  },
  {
    id: 'deu-hamm',
    name: 'HAMM',
    flag: 'DEU',
  },
  {
    id: 'fra-thionville',
    name: 'THIONVILLE',
    flag: 'FRA',
  },
  {
    id: 'sxm-oysterpond',
    name: 'OYSTER POND',
    flag: 'SXM',
  },
  {
    id: 'nor-hollen',
    name: 'HOLLEN',
    flag: 'NOR',
  },
  {
    id: 'usa-stjoseph',
    name: 'ST JOSEPH',
    flag: 'USA',
  },
  {
    id: 'idn-cilauteureun',
    name: 'CILAUTEUREUN',
    flag: 'IDN',
  },
  {
    id: 'usa-haines',
    name: 'HAINES',
    flag: 'USA',
  },
  {
    id: 'fro-toftir',
    name: 'TOFTIR',
    flag: 'FRO',
  },
  {
    id: 'dnk-sonderby',
    name: 'SONDERBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-kalundborg',
    name: 'KALUNDBORG',
    flag: 'DNK',
  },
  {
    id: 'swe-vasteras',
    name: 'VASTERAS',
    flag: 'SWE',
  },
  {
    id: 'hrv-lumbarda',
    name: 'LUMBARDA',
    flag: 'HRV',
  },
  {
    id: 'are-minasaqr',
    name: 'MINA SAQR',
    flag: 'ARE',
  },
  {
    id: 'irn-queshm',
    name: 'QUESHM',
    flag: 'IRN',
  },
  {
    id: 'idn-paiton',
    name: 'PAITON',
    flag: 'IDN',
  },
  {
    id: 'aus-jurienbay',
    name: 'JURIEN BAY',
    flag: 'AUS',
  },
  {
    id: 'chn-qushan',
    name: 'QUSHAN',
    flag: 'CHN',
  },
  {
    id: 'rus-plastun',
    name: 'PLASTUN',
    flag: 'RUS',
  },
  {
    id: 'aus-launceston',
    name: 'LAUNCESTON',
    flag: 'AUS',
  },
  {
    id: 'aus-sydney',
    name: 'SYDNEY',
    flag: 'AUS',
  },
  {
    id: 'esp-calallonga',
    name: 'CALA LLONGA',
    flag: 'ESP',
  },
  {
    id: 'nor-ramberg',
    name: 'RAMBERG',
    flag: 'NOR',
  },
  {
    id: 'chn-zhoushananchorage',
    name: 'ZHOUSHAN ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'chn-sz361field',
    name: 'SZ361 FIELD',
    flag: 'CHN',
  },
  {
    id: 'usa-galesville',
    name: 'GALESVILLE',
    flag: 'USA',
  },
  {
    id: 'nld-geldermalsen',
    name: 'GELDERMALSEN',
    flag: 'NLD',
  },
  {
    id: 'dnk-skive',
    name: 'SKIVE',
    flag: 'DNK',
  },
  {
    id: 'nor-skjervika',
    name: 'SKJERVIKA',
    flag: 'NOR',
  },
  {
    id: 'usa-locustpoint',
    name: 'LOCUST POINT',
    flag: 'USA',
  },
  {
    id: 'ven-amuay',
    name: 'AMUAY',
    flag: 'VEN',
  },
  {
    id: 'gbr-longhope',
    name: 'LONGHOPE',
    flag: 'GBR',
  },
  {
    id: 'aze-chilov',
    name: 'CHILOV',
    flag: 'AZE',
  },
  {
    id: 'jam-portkaiser',
    name: 'PORT KAISER',
    flag: 'JAM',
  },
  {
    id: 'hti-saintmarc',
    name: 'SAINT MARC',
    flag: 'HTI',
  },
  {
    id: 'nld-sasvangent',
    name: 'SAS VAN GENT',
    flag: 'NLD',
  },
  {
    id: 'rus-ulyanovsk',
    name: 'ULYANOVSK',
    flag: 'RUS',
  },
  {
    id: 'sur-paranam',
    name: 'PARANAM',
    flag: 'SUR',
  },
  {
    id: 'esp-puertodesanadrian',
    name: 'PUERTO DE SAN ADRIAN',
    flag: 'ESP',
  },
  {
    id: 'can-kitimat',
    name: 'KITIMAT',
    flag: 'CAN',
  },
  {
    id: 'grd-grandmal',
    name: 'GRAND MAL',
    flag: 'GRD',
  },
  {
    id: 'bra-paranagua',
    name: 'PARANAGUA',
    flag: 'BRA',
  },
  {
    id: 'cpv-salrei',
    name: 'SAL REI',
    flag: 'CPV',
  },
  {
    id: 'gbr-londonderry',
    name: 'LONDONDERRY',
    flag: 'GBR',
  },
  {
    id: 'nld-weert',
    name: 'WEERT',
    flag: 'NLD',
  },
  {
    id: 'nor-fiska',
    name: 'FISKA',
    flag: 'NOR',
  },
  {
    id: 'nld-zutphen',
    name: 'ZUTPHEN',
    flag: 'NLD',
  },
  {
    id: 'nld-almelo',
    name: 'ALMELO',
    flag: 'NLD',
  },
  {
    id: 'ita-portoempedocle',
    name: 'PORTO EMPEDOCLE',
    flag: 'ITA',
  },
  {
    id: 'tur-fenerbahce',
    name: 'FENERBAHCE',
    flag: 'TUR',
  },
  {
    id: 'aze-alat',
    name: 'ALAT',
    flag: 'AZE',
  },
  {
    id: 'chn-foshan',
    name: 'FOSHAN',
    flag: 'CHN',
  },
  {
    id: 'idn-reo',
    name: 'REO',
    flag: 'IDN',
  },
  {
    id: 'aus-mooloolaba',
    name: 'MOOLOOLABA',
    flag: 'AUS',
  },
  {
    id: 'nor-mosterhamn',
    name: 'MOSTERHAMN',
    flag: 'NOR',
  },
  {
    id: 'can-canaport',
    name: 'CANAPORT',
    flag: 'CAN',
  },
  {
    id: 'rus-kronshtadt',
    name: 'KRONSHTADT',
    flag: 'RUS',
  },
  {
    id: 'tur-bartin',
    name: 'BARTIN',
    flag: 'TUR',
  },
  {
    id: 'mys-labuan',
    name: 'LABUAN',
    flag: 'MYS',
  },
  {
    id: 'mex-salinacruz',
    name: 'SALINA CRUZ',
    flag: 'MEX',
  },
  {
    id: 'usa-cleveland',
    name: 'CLEVELAND',
    flag: 'USA',
  },
  {
    id: 'nld-wijkbijduurstede',
    name: 'WIJK BIJ DUURSTEDE',
    flag: 'NLD',
  },
  {
    id: 'srb-ostruznica',
    name: 'OSTRUZNICA',
    flag: 'SRB',
  },
  {
    id: 'tur-bodrum',
    name: 'BODRUM',
    flag: 'TUR',
  },
  {
    id: 'usa-rockport',
    name: 'ROCKPORT',
    flag: 'USA',
  },
  {
    id: 'nor-karyingen',
    name: 'KARYINGEN',
    flag: 'NOR',
  },
  {
    id: 'rus-podporozhye',
    name: 'PODPOROZHYE',
    flag: 'RUS',
  },
  {
    id: 'phl-ipil',
    name: 'IPIL',
    flag: 'PHL',
  },
  {
    id: 'usa-greatislandboat',
    name: 'GREAT ISLAND BOAT',
    flag: 'USA',
  },
  {
    id: 'jpn-abashiri',
    name: 'ABASHIRI',
    flag: 'JPN',
  },
  {
    id: 'grc-portoheli',
    name: 'PORTO HELI',
    flag: 'GRC',
  },
  {
    id: 'mys-telagaharbour',
    name: 'TELAGA HARBOUR',
    flag: 'MYS',
  },
  {
    id: 'aus-rockingham',
    name: 'ROCKINGHAM',
    flag: 'AUS',
  },
  {
    id: 'aus-wyndham',
    name: 'WYNDHAM',
    flag: 'AUS',
  },
  {
    id: 'rus-uglegorskanchorage',
    name: 'UGLEGORSK ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'irl-sligo',
    name: 'SLIGO',
    flag: 'IRL',
  },
  {
    id: 'nor-selvik',
    name: 'SELVIK',
    flag: 'NOR',
  },
  {
    id: 'usa-palacios',
    name: 'PALACIOS',
    flag: 'USA',
  },
  {
    id: 'grl-ilulissat',
    name: 'ILULISSAT',
    flag: 'GRL',
  },
  {
    id: 'nor-brekstad',
    name: 'BREKSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-levanger',
    name: 'LEVANGER',
    flag: 'NOR',
  },
  {
    id: 'ita-chioggia',
    name: 'CHIOGGIA',
    flag: 'ITA',
  },
  {
    id: 'ita-messina',
    name: 'MESSINA',
    flag: 'ITA',
  },
  {
    id: 'ita-rodigarganico',
    name: 'RODI GARGANICO',
    flag: 'ITA',
  },
  {
    id: 'hrv-vis',
    name: 'VIS',
    flag: 'HRV',
  },
  {
    id: 'hrv-pomena',
    name: 'POMENA',
    flag: 'HRV',
  },
  {
    id: 'hun-dunaujvaros',
    name: 'DUNAUJVAROS',
    flag: 'HUN',
  },
  {
    id: 'geo-batumi',
    name: 'BATUMI',
    flag: 'GEO',
  },
  {
    id: 'idn-makassar',
    name: 'MAKASSAR',
    flag: 'IDN',
  },
  {
    id: 'irl-aughinish',
    name: 'AUGHINISH',
    flag: 'IRL',
  },
  {
    id: 'ita-linosa',
    name: 'LINOSA',
    flag: 'ITA',
  },
  {
    id: 'ind-ghoghaanchorage',
    name: 'GHOGHA ANCHORAGE',
    flag: 'IND',
  },
  {
    id: 'jpn-yamagawa',
    name: 'YAMAGAWA',
    flag: 'JPN',
  },
  {
    id: 'cuw-fuikbaai',
    name: 'FUIK BAAI',
    flag: 'CUW',
  },
  {
    id: 'esp-argineguin',
    name: 'ARGINEGUIN',
    flag: 'ESP',
  },
  {
    id: 'brn-seriaoilterminal',
    name: 'SERIA OIL TERMINAL',
    flag: 'BRN',
  },
  {
    id: 'kir-tarawa',
    name: 'TARAWA',
    flag: 'KIR',
  },
  {
    id: 'tun-sfax',
    name: 'SFAX',
    flag: 'TUN',
  },
  {
    id: 'cog-kalamu',
    name: 'KALAMU',
    flag: 'COG',
  },
  {
    id: 'nld-bergenopzoom',
    name: 'BERGEN OP ZOOM',
    flag: 'NLD',
  },
  {
    id: 'nld-zuilichem',
    name: 'ZUILICHEM',
    flag: 'NLD',
  },
  {
    id: 'lbn-tripoli',
    name: 'TRIPOLI',
    flag: 'LBN',
  },
  {
    id: 'usa-barlowbay',
    name: 'BARLOW BAY',
    flag: 'USA',
  },
  {
    id: 'fin-jussaro',
    name: 'JUSSARO',
    flag: 'FIN',
  },
  {
    id: 'rus-amgu',
    name: 'AMGU',
    flag: 'RUS',
  },
  {
    id: 'swe-norrkoping',
    name: 'NORRKOPING',
    flag: 'SWE',
  },
  {
    id: 'can-pointtupper',
    name: 'POINT TUPPER',
    flag: 'CAN',
  },
  {
    id: 'idn-teluksemangkaanchorage',
    name: 'TELUK SEMANGKA ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'swe-vikhog',
    name: 'VIKHOG',
    flag: 'SWE',
  },
  {
    id: 'hun-paks',
    name: 'PAKS',
    flag: 'HUN',
  },
  {
    id: 'ven-puertocumarebo',
    name: 'PUERTO CUMAREBO',
    flag: 'VEN',
  },
  {
    id: 'jpn-chofu',
    name: 'CHOFU',
    flag: 'JPN',
  },
  {
    id: 'can-porthardy',
    name: 'PORT HARDY',
    flag: 'CAN',
  },
  {
    id: 'usa-bellingham',
    name: 'BELLINGHAM',
    flag: 'USA',
  },
  {
    id: 'usa-houmaanchorage',
    name: 'HOUMA ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'per-pucusana',
    name: 'PUCUSANA',
    flag: 'PER',
  },
  {
    id: 'nld-roompot',
    name: 'ROOMPOT',
    flag: 'NLD',
  },
  {
    id: 'nld-gorinchem',
    name: 'GORINCHEM',
    flag: 'NLD',
  },
  {
    id: 'deu-papenburg',
    name: 'PAPENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-hohenwarthe',
    name: 'HOHENWARTHE',
    flag: 'DEU',
  },
  {
    id: 'pol-ustka',
    name: 'USTKA',
    flag: 'POL',
  },
  {
    id: 'sau-rabigh',
    name: 'RABIGH',
    flag: 'SAU',
  },
  {
    id: 'aus-scarborough',
    name: 'SCARBOROUGH',
    flag: 'AUS',
  },
  {
    id: 'nor-stavern',
    name: 'STAVERN',
    flag: 'NOR',
  },
  {
    id: 'pyf-haapiti',
    name: 'HAAPITI',
    flag: 'PYF',
  },
  {
    id: 'bra-portocel',
    name: 'PORTOCEL',
    flag: 'BRA',
  },
  {
    id: 'tha-maptaphut',
    name: 'MAPTAPHUT',
    flag: 'THA',
  },
  {
    id: 'usa-darrow',
    name: 'DARROW',
    flag: 'USA',
  },
  {
    id: 'bel-brussels',
    name: 'BRUSSELS',
    flag: 'BEL',
  },
  {
    id: 'usa-ilwaco',
    name: 'ILWACO',
    flag: 'USA',
  },
  {
    id: 'gbr-bangor',
    name: 'BANGOR',
    flag: 'GBR',
  },
  {
    id: 'idn-probolinggo',
    name: 'PROBOLINGGO',
    flag: 'IDN',
  },
  {
    id: 'esp-sacalobra',
    name: 'SA CALOBRA',
    flag: 'ESP',
  },
  {
    id: 'mex-puertovallarta',
    name: 'PUERTO VALLARTA',
    flag: 'MEX',
  },
  {
    id: 'esp-villagarciaanchorage',
    name: 'VILLAGARCIA ANCHORAGE',
    flag: 'ESP',
  },
  {
    id: 'usa-santacatalinaisland',
    name: 'SANTA CATALINA ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-orangebeach',
    name: 'ORANGE BEACH',
    flag: 'USA',
  },
  {
    id: 'dom-puertoplata',
    name: 'PUERTO PLATA',
    flag: 'DOM',
  },
  {
    id: 'dom-aties',
    name: 'ATIES',
    flag: 'DOM',
  },
  {
    id: 'bra-puertoesperanca',
    name: 'PUERTO ESPERANCA',
    flag: 'BRA',
  },
  {
    id: 'ury-juanlacaze',
    name: 'JUAN LACAZE',
    flag: 'URY',
  },
  {
    id: 'bra-cabedelo',
    name: 'CABEDELO',
    flag: 'BRA',
  },
  {
    id: 'gbr-thamesport',
    name: 'THAMESPORT',
    flag: 'GBR',
  },
  {
    id: 'nor-kvenvaer',
    name: 'KVENVAER',
    flag: 'NOR',
  },
  {
    id: 'deu-otterndorf',
    name: 'OTTERNDORF',
    flag: 'DEU',
  },
  {
    id: 'idn-barelang',
    name: 'BARELANG',
    flag: 'IDN',
  },
  {
    id: 'idn-waingapu',
    name: 'WAINGAPU',
    flag: 'IDN',
  },
  {
    id: 'chn-changdao',
    name: 'CHANGDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-longyan',
    name: 'LONGYAN',
    flag: 'CHN',
  },
  {
    id: 'idn-namlea',
    name: 'NAMLEA',
    flag: 'IDN',
  },
  {
    id: 'rus-dekastri',
    name: 'DE KASTRI',
    flag: 'RUS',
  },
  {
    id: 'aus-hampton',
    name: 'HAMPTON',
    flag: 'AUS',
  },
  {
    id: 'sle-pepel',
    name: 'PEPEL',
    flag: 'SLE',
  },
  {
    id: 'est-roomassaare',
    name: 'ROOMASSAARE',
    flag: 'EST',
  },
  {
    id: 'jpn-saizaki',
    name: 'SAIZAKI',
    flag: 'JPN',
  },
  {
    id: 'pan-chiriquigrande',
    name: 'CHIRIQUI GRANDE',
    flag: 'PAN',
  },
  {
    id: 'swe-trelleborg',
    name: 'TRELLEBORG',
    flag: 'SWE',
  },
  {
    id: 'isr-haifa',
    name: 'HAIFA',
    flag: 'ISR',
  },
  {
    id: 'jpn-nagoya',
    name: 'NAGOYA',
    flag: 'JPN',
  },
  {
    id: 'usa-sanfrancisco',
    name: 'SAN FRANCISCO',
    flag: 'USA',
  },
  {
    id: 'gbr-berwick',
    name: 'BERWICK',
    flag: 'GBR',
  },
  {
    id: 'fra-cannes',
    name: 'CANNES',
    flag: 'FRA',
  },
  {
    id: 'ita-sanfelicecirceo',
    name: 'SAN FELICE CIRCEO',
    flag: 'ITA',
  },
  {
    id: 'rou-agigea',
    name: 'AGIGEA',
    flag: 'ROU',
  },
  {
    id: 'rus-lensk',
    name: 'LENSK',
    flag: 'RUS',
  },
  {
    id: 'nor-jorpeland',
    name: 'JORPELAND',
    flag: 'NOR',
  },
  {
    id: 'prk-nampo',
    name: 'NAMPO',
    flag: 'PRK',
  },
  {
    id: 'fra-calvi',
    name: 'CALVI',
    flag: 'FRA',
  },
  {
    id: 'jam-ochorios',
    name: 'OCHO RIOS',
    flag: 'JAM',
  },
  {
    id: 'gbr-bromborough',
    name: 'BROMBOROUGH',
    flag: 'GBR',
  },
  {
    id: 'usa-treasurecoast',
    name: 'TREASURE COAST',
    flag: 'USA',
  },
  {
    id: 'rus-kuybyshevskiyzaton',
    name: 'KUYBYSHEVSKIY ZATON',
    flag: 'RUS',
  },
  {
    id: 'jam-portesquivel',
    name: 'PORT ESQUIVEL',
    flag: 'JAM',
  },
  {
    id: 'can-masset',
    name: 'MASSET',
    flag: 'CAN',
  },
  {
    id: 'dma-roseau',
    name: 'ROSEAU',
    flag: 'DMA',
  },
  {
    id: 'isl-siglufjordur',
    name: 'SIGLUFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'gbr-mallaig',
    name: 'MALLAIG',
    flag: 'GBR',
  },
  {
    id: 'esp-portbalis',
    name: 'PORT BALIS',
    flag: 'ESP',
  },
  {
    id: 'deu-bulstringen',
    name: 'BULSTRINGEN',
    flag: 'DEU',
  },
  {
    id: 'swe-foto',
    name: 'FOTO',
    flag: 'SWE',
  },
  {
    id: 'nor-rost',
    name: 'ROST',
    flag: 'NOR',
  },
  {
    id: 'pol-wladyslawowo',
    name: 'WLADYSLAWOWO',
    flag: 'POL',
  },
  {
    id: 'nor-lyngseidet',
    name: 'LYNGSEIDET',
    flag: 'NOR',
  },
  {
    id: 'fin-oulu',
    name: 'OULU',
    flag: 'FIN',
  },
  {
    id: 'idn-manokwari',
    name: 'MANOKWARI',
    flag: 'IDN',
  },
  {
    id: 'nzl-auckland',
    name: 'AUCKLAND',
    flag: 'NZL',
  },
  {
    id: 'usa-bainbridgeisland',
    name: 'BAINBRIDGE ISLAND',
    flag: 'USA',
  },
  {
    id: 'dnk-helsingor',
    name: 'HELSINGOR',
    flag: 'DNK',
  },
  {
    id: 'mys-rebak',
    name: 'REBAK',
    flag: 'MYS',
  },
  {
    id: 'idn-karimunjawa',
    name: 'KARIMUN JAWA',
    flag: 'IDN',
  },
  {
    id: 'tun-sousse',
    name: 'SOUSSE',
    flag: 'TUN',
  },
  {
    id: 'idn-lawelawe',
    name: 'LAWE LAWE',
    flag: 'IDN',
  },
  {
    id: 'usa-thenarrows',
    name: 'THE NARROWS',
    flag: 'USA',
  },
  {
    id: 'usa-philadelphia',
    name: 'PHILADELPHIA',
    flag: 'USA',
  },
  {
    id: 'bmu-hamilton',
    name: 'HAMILTON',
    flag: 'BMU',
  },
  {
    id: 'swe-monsteras',
    name: 'MONSTERAS',
    flag: 'SWE',
  },
  {
    id: 'nor-gryllefjord',
    name: 'GRYLLEFJORD',
    flag: 'NOR',
  },
  {
    id: 'lby-marsaalbrega',
    name: 'MARSA AL BREGA',
    flag: 'LBY',
  },
  {
    id: 'bes-gotooilterminal',
    name: 'GOTO OIL TERMINAL',
    flag: 'BES',
  },
  {
    id: 'rus-portdikson',
    name: 'PORT DIKSON',
    flag: 'RUS',
  },
  {
    id: 'aus-capeflatteryharbor',
    name: 'CAPE FLATTERY HARBOR',
    flag: 'AUS',
  },
  {
    id: 'irl-bantry',
    name: 'BANTRY',
    flag: 'IRL',
  },
  {
    id: 'fra-carteret',
    name: 'CARTERET',
    flag: 'FRA',
  },
  {
    id: 'nld-alkmaar',
    name: 'ALKMAAR',
    flag: 'NLD',
  },
  {
    id: 'hnd-omoaanchorage',
    name: 'OMOA ANCHORAGE',
    flag: 'HND',
  },
  {
    id: 'grd-carriacou',
    name: 'CARRIACOU',
    flag: 'GRD',
  },
  {
    id: 'nzl-whangamata',
    name: 'WHANGAMATA',
    flag: 'NZL',
  },
  {
    id: 'nld-hasselt',
    name: 'HASSELT',
    flag: 'NLD',
  },
  {
    id: 'tur-eskihisar',
    name: 'ESKIHISAR',
    flag: 'TUR',
  },
  {
    id: 'nld-dokkum',
    name: 'DOKKUM',
    flag: 'NLD',
  },
  {
    id: 'nor-lyngdal',
    name: 'LYNGDAL',
    flag: 'NOR',
  },
  {
    id: 'can-montagueharbour',
    name: 'MONTAGUE HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'usa-desmoines',
    name: 'DES MOINES',
    flag: 'USA',
  },
  {
    id: 'usa-mosslanding',
    name: 'MOSS LANDING',
    flag: 'USA',
  },
  {
    id: 'irl-malahide',
    name: 'MALAHIDE',
    flag: 'IRL',
  },
  {
    id: 'nld-tholen',
    name: 'THOLEN',
    flag: 'NLD',
  },
  {
    id: 'nld-leiden',
    name: 'LEIDEN',
    flag: 'NLD',
  },
  {
    id: 'nor-rorvik',
    name: 'RORVIK',
    flag: 'NOR',
  },
  {
    id: 'bhr-nuranaisland',
    name: 'NURANA ISLAND',
    flag: 'BHR',
  },
  {
    id: 'idn-bima',
    name: 'BIMA',
    flag: 'IDN',
  },
  {
    id: 'chn-lianjiang',
    name: 'LIANJIANG',
    flag: 'CHN',
  },
  {
    id: 'twn-bdeep461',
    name: 'B DEEP 461',
    flag: 'TWN',
  },
  {
    id: 'phl-buanoy',
    name: 'BUANOY',
    flag: 'PHL',
  },
  {
    id: 'gbr-mousehole',
    name: 'MOUSEHOLE',
    flag: 'GBR',
  },
  {
    id: 'deu-langeoog',
    name: 'LANGEOOG',
    flag: 'DEU',
  },
  {
    id: 'ita-isoletremiti',
    name: 'ISOLE TREMITI',
    flag: 'ITA',
  },
  {
    id: 'chn-xiangshan',
    name: 'XIANGSHAN',
    flag: 'CHN',
  },
  {
    id: 'prt-povoadevarzim',
    name: 'POVOA DE VARZIM',
    flag: 'PRT',
  },
  {
    id: 'are-jebeldhanna',
    name: 'JEBEL DHANNA',
    flag: 'ARE',
  },
  {
    id: 'dma-pointemichel',
    name: 'POINTE MICHEL',
    flag: 'DMA',
  },
  {
    id: 'nld-giesbeek',
    name: 'GIESBEEK',
    flag: 'NLD',
  },
  {
    id: 'phl-polloc(cotabato)',
    name: 'POLLOC (COTABATO)',
    flag: 'PHL',
  },
  {
    id: 'rus-kavkaz',
    name: 'KAVKAZ',
    flag: 'RUS',
  },
  {
    id: 'gbr-corpach',
    name: 'CORPACH',
    flag: 'GBR',
  },
  {
    id: 'gbr-newtowncreek',
    name: 'NEWTOWN CREEK',
    flag: 'GBR',
  },
  {
    id: 'chl-michilla',
    name: 'MICHILLA',
    flag: 'CHL',
  },
  {
    id: 'nor-ellingsoy',
    name: 'ELLINGSOY',
    flag: 'NOR',
  },
  {
    id: 'jpn-ako',
    name: 'AKO',
    flag: 'JPN',
  },
  {
    id: 'bgr-svishtov',
    name: 'SVISHTOV',
    flag: 'BGR',
  },
  {
    id: 'can-dorval',
    name: 'DORVAL',
    flag: 'CAN',
  },
  {
    id: 'bhs-highbornecay',
    name: 'HIGHBORNE CAY',
    flag: 'BHS',
  },
  {
    id: 'chl-ayacara',
    name: 'AYACARA',
    flag: 'CHL',
  },
  {
    id: 'chl-mariaolvio',
    name: 'MARIA OLVIO',
    flag: 'CHL',
  },
  {
    id: 'can-argentia',
    name: 'ARGENTIA',
    flag: 'CAN',
  },
  {
    id: 'grl-sisimiut',
    name: 'SISIMIUT',
    flag: 'GRL',
  },
  {
    id: 'esp-denia',
    name: 'DENIA',
    flag: 'ESP',
  },
  {
    id: 'fra-bethune',
    name: 'BETHUNE',
    flag: 'FRA',
  },
  {
    id: 'nor-sykkylven',
    name: 'SYKKYLVEN',
    flag: 'NOR',
  },
  {
    id: 'deu-bremerhaven',
    name: 'BREMERHAVEN',
    flag: 'DEU',
  },
  {
    id: 'hrv-vrsar',
    name: 'VRSAR',
    flag: 'HRV',
  },
  {
    id: 'ita-capri',
    name: 'CAPRI',
    flag: 'ITA',
  },
  {
    id: 'hrv-necujam',
    name: 'NECUJAM',
    flag: 'HRV',
  },
  {
    id: 'lva-liepaja',
    name: 'LIEPAJA',
    flag: 'LVA',
  },
  {
    id: 'egy-maaddiya',
    name: 'MAADDIYA',
    flag: 'EGY',
  },
  {
    id: 'idn-cilegon',
    name: 'CILEGON',
    flag: 'IDN',
  },
  {
    id: 'vnm-haiphong',
    name: 'HAIPHONG',
    flag: 'VNM',
  },
  {
    id: 'chn-jiaxing',
    name: 'JIAXING',
    flag: 'CHN',
  },
  {
    id: 'isl-akranes',
    name: 'AKRANES',
    flag: 'ISL',
  },
  {
    id: 'tur-dikili',
    name: 'DIKILI',
    flag: 'TUR',
  },
  {
    id: 'chn-jintang',
    name: 'JINTANG',
    flag: 'CHN',
  },
  {
    id: 'dom-sanpedrodemacoris',
    name: 'SAN PEDRO DE MACORIS',
    flag: 'DOM',
  },
  {
    id: 'jpn-hanasaki',
    name: 'HANASAKI',
    flag: 'JPN',
  },
  {
    id: 'ltu-butinge',
    name: 'BUTINGE',
    flag: 'LTU',
  },
  {
    id: 'mex-tsiminfield',
    name: 'TSIMIN FIELD',
    flag: 'MEX',
  },
  {
    id: 'usa-dulac',
    name: 'DULAC',
    flag: 'USA',
  },
  {
    id: 'prt-portosanto',
    name: 'PORTO SANTO',
    flag: 'PRT',
  },
  {
    id: 'esp-corcubion',
    name: 'CORCUBION',
    flag: 'ESP',
  },
  {
    id: 'mar-rabat',
    name: 'RABAT',
    flag: 'MAR',
  },
  {
    id: 'swe-husum',
    name: 'HUSUM',
    flag: 'SWE',
  },
  {
    id: 'ita-monfalcone',
    name: 'MONFALCONE',
    flag: 'ITA',
  },
  {
    id: 'grc-portorafti',
    name: 'PORTO RAFTI',
    flag: 'GRC',
  },
  {
    id: 'usa-geismar',
    name: 'GEISMAR',
    flag: 'USA',
  },
  {
    id: 'phl-jimenez',
    name: 'JIMENEZ',
    flag: 'PHL',
  },
  {
    id: 'fra-isbergues',
    name: 'ISBERGUES',
    flag: 'FRA',
  },
  {
    id: 'aus-corlette',
    name: 'CORLETTE',
    flag: 'AUS',
  },
  {
    id: 'idn-tasikagung',
    name: 'TASIK AGUNG',
    flag: 'IDN',
  },
  {
    id: 'usa-berkeley',
    name: 'BERKELEY',
    flag: 'USA',
  },
  {
    id: 'aut-kremsanderdonau',
    name: 'KREMS AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'grc-milaki',
    name: 'MILAKI',
    flag: 'GRC',
  },
  {
    id: 'egy-ismailiya',
    name: 'ISMAILIYA',
    flag: 'EGY',
  },
  {
    id: 'irn-genaveh',
    name: 'GENAVEH',
    flag: 'IRN',
  },
  {
    id: 'aus-hobart',
    name: 'HOBART',
    flag: 'AUS',
  },
  {
    id: 'aus-tweedheads',
    name: 'TWEED HEADS',
    flag: 'AUS',
  },
  {
    id: 'nzl-dunedin',
    name: 'DUNEDIN',
    flag: 'NZL',
  },
  {
    id: 'deu-lauterbach',
    name: 'LAUTERBACH',
    flag: 'DEU',
  },
  {
    id: 'per-tambodemora',
    name: 'TAMBO DE MORA',
    flag: 'PER',
  },
  {
    id: 'cyp-larnaca',
    name: 'LARNACA',
    flag: 'CYP',
  },
  {
    id: 'mys-kemaman',
    name: 'KEMAMAN',
    flag: 'MYS',
  },
  {
    id: 'nld-leeuwarden',
    name: 'LEEUWARDEN',
    flag: 'NLD',
  },
  {
    id: 'nor-holmsbu',
    name: 'HOLMSBU',
    flag: 'NOR',
  },
  {
    id: 'isr-hadera',
    name: 'HADERA',
    flag: 'ISR',
  },
  {
    id: 'nld-stampersgat',
    name: 'STAMPERSGAT',
    flag: 'NLD',
  },
  {
    id: 'hrv-kastelkambelovac',
    name: 'KASTEL KAMBELOVAC',
    flag: 'HRV',
  },
  {
    id: 'jpn-wakayama',
    name: 'WAKAYAMA',
    flag: 'JPN',
  },
  {
    id: 'nor-engalsvik',
    name: 'ENGALSVIK',
    flag: 'NOR',
  },
  {
    id: 'rus-vostochnyy',
    name: 'VOSTOCHNYY',
    flag: 'RUS',
  },
  {
    id: 'ecu-monteverde',
    name: 'MONTEVERDE',
    flag: 'ECU',
  },
  {
    id: 'bhs-lynyardcay',
    name: 'LYNYARD CAY',
    flag: 'BHS',
  },
  {
    id: 'can-ballantynescove',
    name: 'BALLANTYNES COVE',
    flag: 'CAN',
  },
  {
    id: 'pyf-manihi',
    name: 'MANIHI',
    flag: 'PYF',
  },
  {
    id: 'phl-kauswagan',
    name: 'KAUSWAGAN',
    flag: 'PHL',
  },
  {
    id: 'swe-ronneby',
    name: 'RONNEBY',
    flag: 'SWE',
  },
  {
    id: 'usa-bridgeport',
    name: 'BRIDGEPORT',
    flag: 'USA',
  },
  {
    id: 'usa-marblehead',
    name: 'MARBLEHEAD',
    flag: 'USA',
  },
  {
    id: 'bes-kralendijk',
    name: 'KRALENDIJK',
    flag: 'BES',
  },
  {
    id: 'sxm-philipsburg',
    name: 'PHILIPSBURG',
    flag: 'SXM',
  },
  {
    id: 'vct-kingstown',
    name: 'KINGSTOWN',
    flag: 'VCT',
  },
  {
    id: 'bra-salvador',
    name: 'SALVADOR',
    flag: 'BRA',
  },
  {
    id: 'esp-bermeo',
    name: 'BERMEO',
    flag: 'ESP',
  },
  {
    id: 'esp-mutriku',
    name: 'MUTRIKU',
    flag: 'ESP',
  },
  {
    id: 'bel-wielsbeke',
    name: 'WIELSBEKE',
    flag: 'BEL',
  },
  {
    id: 'ita-fiumicino',
    name: 'FIUMICINO',
    flag: 'ITA',
  },
  {
    id: 'ita-coriglianocalabro',
    name: 'CORIGLIANO CALABRO',
    flag: 'ITA',
  },
  {
    id: 'ind-navlakhi',
    name: 'NAVLAKHI',
    flag: 'IND',
  },
  {
    id: 'chn-haikou',
    name: 'HAIKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chaozhou',
    name: 'CHAOZHOU',
    flag: 'CHN',
  },
  {
    id: 'phl-puertoprincesa',
    name: 'PUERTO PRINCESA',
    flag: 'PHL',
  },
  {
    id: 'chn-wenzhou',
    name: 'WENZHOU',
    flag: 'CHN',
  },
  {
    id: 'jpn-oita',
    name: 'OITA',
    flag: 'JPN',
  },
  {
    id: 'aus-portdouglas',
    name: 'PORT DOUGLAS',
    flag: 'AUS',
  },
  {
    id: 'can-steveston',
    name: 'STEVESTON',
    flag: 'CAN',
  },
  {
    id: 'usa-pensacola',
    name: 'PENSACOLA',
    flag: 'USA',
  },
  {
    id: 'ven-puertomiranda',
    name: 'PUERTO MIRANDA',
    flag: 'VEN',
  },
  {
    id: 'prt-olhao',
    name: 'OLHAO',
    flag: 'PRT',
  },
  {
    id: 'irl-wicklow',
    name: 'WICKLOW',
    flag: 'IRL',
  },
  {
    id: 'gbr-campbeltown',
    name: 'CAMPBELTOWN',
    flag: 'GBR',
  },
  {
    id: 'gbr-haylingisland',
    name: 'HAYLING ISLAND',
    flag: 'GBR',
  },
  {
    id: 'nor-flatoy',
    name: 'FLATOY',
    flag: 'NOR',
  },
  {
    id: 'jpn-mikawa',
    name: 'MIKAWA',
    flag: 'JPN',
  },
  {
    id: 'bra-dtse/geguaoilterminal',
    name: 'DTSE / GEGUA OIL TERMINAL',
    flag: 'BRA',
  },
  {
    id: 'are-sirabunuayr',
    name: 'SIR ABU NU AYR',
    flag: 'ARE',
  },
  {
    id: 'ind-mundra',
    name: 'MUNDRA',
    flag: 'IND',
  },
  {
    id: 'phl-calaca',
    name: 'CALACA',
    flag: 'PHL',
  },
  {
    id: 'usa-kalama',
    name: 'KALAMA',
    flag: 'USA',
  },
  {
    id: 'chl-patillos',
    name: 'PATILLOS',
    flag: 'CHL',
  },
  {
    id: 'deu-wedel',
    name: 'WEDEL',
    flag: 'DEU',
  },
  {
    id: 'dnk-thuroby',
    name: 'THURO BY',
    flag: 'DNK',
  },
  {
    id: 'jpn-onomichiitozaki',
    name: 'ONOMICHIITOZAKI',
    flag: 'JPN',
  },
  {
    id: 'usa-santarosaisland',
    name: 'SANTA ROSA ISLAND',
    flag: 'USA',
  },
  {
    id: 'idn-santan',
    name: 'SANTAN',
    flag: 'IDN',
  },
  {
    id: 'nzl-paroabay',
    name: 'PAROA BAY',
    flag: 'NZL',
  },
  {
    id: 'rou-corabia',
    name: 'CORABIA',
    flag: 'ROU',
  },
  {
    id: 'rus-zhatay',
    name: 'ZHATAY',
    flag: 'RUS',
  },
  {
    id: 'usa-delshire',
    name: 'DELSHIRE',
    flag: 'USA',
  },
  {
    id: 'jpn-kainan',
    name: 'KAINAN',
    flag: 'JPN',
  },
  {
    id: 'deu-schleswig',
    name: 'SCHLESWIG',
    flag: 'DEU',
  },
  {
    id: 'est-kunda',
    name: 'KUNDA',
    flag: 'EST',
  },
  {
    id: 'usa-honolulu',
    name: 'HONOLULU',
    flag: 'USA',
  },
  {
    id: 'usa-anacortes',
    name: 'ANACORTES',
    flag: 'USA',
  },
  {
    id: 'usa-oysterpoint',
    name: 'OYSTER POINT',
    flag: 'USA',
  },
  {
    id: 'ecu-baquerizomoreno',
    name: 'BAQUERIZO MORENO',
    flag: 'ECU',
  },
  {
    id: 'bra-ladario',
    name: 'LADARIO',
    flag: 'BRA',
  },
  {
    id: 'prt-oeiras',
    name: 'OEIRAS',
    flag: 'PRT',
  },
  {
    id: 'gbr-felixstowe',
    name: 'FELIXSTOWE',
    flag: 'GBR',
  },
  {
    id: 'deu-hausen',
    name: 'HAUSEN',
    flag: 'DEU',
  },
  {
    id: 'ita-favignana',
    name: 'FAVIGNANA',
    flag: 'ITA',
  },
  {
    id: 'deu-wolgast',
    name: 'WOLGAST',
    flag: 'DEU',
  },
  {
    id: 'hrv-primosten',
    name: 'PRIMOSTEN',
    flag: 'HRV',
  },
  {
    id: 'ita-monopoli',
    name: 'MONOPOLI',
    flag: 'ITA',
  },
  {
    id: 'swe-sandhamn',
    name: 'SANDHAMN',
    flag: 'SWE',
  },
  {
    id: 'irn-chabahar',
    name: 'CHABAHAR',
    flag: 'IRN',
  },
  {
    id: 'chn-lammaisland',
    name: 'LAMMA ISLAND',
    flag: 'CHN',
  },
  {
    id: 'jpn-himeji',
    name: 'HIMEJI',
    flag: 'JPN',
  },
  {
    id: 'aus-cairns',
    name: 'CAIRNS',
    flag: 'AUS',
  },
  {
    id: 'gbr-saintaubin',
    name: 'SAINT AUBIN',
    flag: 'GBR',
  },
  {
    id: 'jpn-nagasaki',
    name: 'NAGASAKI',
    flag: 'JPN',
  },
  {
    id: 'aus-portkembla',
    name: 'PORT KEMBLA',
    flag: 'AUS',
  },
  {
    id: 'grd-pricklybay',
    name: 'PRICKLY BAY',
    flag: 'GRD',
  },
  {
    id: 'fra-frontignan',
    name: 'FRONTIGNAN',
    flag: 'FRA',
  },
  {
    id: 'tha-kosichang',
    name: 'KO SICHANG',
    flag: 'THA',
  },
  {
    id: 'are-mubarrazisland',
    name: 'MUBARRAZ ISLAND',
    flag: 'ARE',
  },
  {
    id: 'usa-baltimore',
    name: 'BALTIMORE',
    flag: 'USA',
  },
  {
    id: 'fra-airesurlalys',
    name: 'AIRE SUR LA LYS',
    flag: 'FRA',
  },
  {
    id: 'nor-dusavik',
    name: 'DUSAVIK',
    flag: 'NOR',
  },
  {
    id: 'deu-friedrichsfeld',
    name: 'FRIEDRICHSFELD',
    flag: 'DEU',
  },
  {
    id: 'deu-maasholm',
    name: 'MAASHOLM',
    flag: 'DEU',
  },
  {
    id: 'rus-kirovsk',
    name: 'KIROVSK',
    flag: 'RUS',
  },
  {
    id: 'gbr-beaumaris',
    name: 'BEAUMARIS',
    flag: 'GBR',
  },
  {
    id: 'jpn-kanokawa',
    name: 'KANOKAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tsuruga',
    name: 'TSURUGA',
    flag: 'JPN',
  },
  {
    id: 'usa-lacrosse',
    name: 'LA CROSSE',
    flag: 'USA',
  },
  {
    id: 'usa-boothbayregionboat',
    name: 'BOOTHBAY REGION BOAT',
    flag: 'USA',
  },
  {
    id: 'gbr-london',
    name: 'LONDON',
    flag: 'GBR',
  },
  {
    id: 'swe-vallvik',
    name: 'VALLVIK',
    flag: 'SWE',
  },
  {
    id: 'fra-damgan',
    name: 'DAMGAN',
    flag: 'FRA',
  },
  {
    id: 'pri-mariaantonia',
    name: 'MARIA ANTONIA',
    flag: 'PRI',
  },
  {
    id: 'tur-fatsa',
    name: 'FATSA',
    flag: 'TUR',
  },
  {
    id: 'usa-grandhaven',
    name: 'GRAND HAVEN',
    flag: 'USA',
  },
  {
    id: 'chn-yangxi',
    name: 'YANGXI',
    flag: 'CHN',
  },
  {
    id: 'usa-delhihills',
    name: 'DELHI HILLS',
    flag: 'USA',
  },
  {
    id: 'gbr-kirkcaldy',
    name: 'KIRKCALDY',
    flag: 'GBR',
  },
  {
    id: 'can-bellabella',
    name: 'BELLA BELLA',
    flag: 'CAN',
  },
  {
    id: 'ven-sucre',
    name: 'SUCRE',
    flag: 'VEN',
  },
  {
    id: 'guy-georgetown',
    name: 'GEORGETOWN',
    flag: 'GUY',
  },
  {
    id: 'ben-cotonou',
    name: 'COTONOU',
    flag: 'BEN',
  },
  {
    id: 'nor-vigra',
    name: 'VIGRA',
    flag: 'NOR',
  },
  {
    id: 'deu-wrestedt',
    name: 'WRESTEDT',
    flag: 'DEU',
  },
  {
    id: 'deu-strullendorf',
    name: 'STRULLENDORF',
    flag: 'DEU',
  },
  {
    id: 'nam-walvisbay',
    name: 'WALVIS BAY',
    flag: 'NAM',
  },
  {
    id: 'hrv-bobovisca',
    name: 'BOBOVISCA',
    flag: 'HRV',
  },
  {
    id: 'swe-hargshamn',
    name: 'HARGSHAMN',
    flag: 'SWE',
  },
  {
    id: 'tur-erdek',
    name: 'ERDEK',
    flag: 'TUR',
  },
  {
    id: 'idn-bengkulu',
    name: 'BENGKULU',
    flag: 'IDN',
  },
  {
    id: 'brn-kualabelait',
    name: 'KUALA BELAIT',
    flag: 'BRN',
  },
  {
    id: 'mys-tawau',
    name: 'TAWAU',
    flag: 'MYS',
  },
  {
    id: 'chn-huaian',
    name: 'HUAIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-pingtan',
    name: 'PINGTAN',
    flag: 'CHN',
  },
  {
    id: 'chn-dalian',
    name: 'DALIAN',
    flag: 'CHN',
  },
  {
    id: 'phl-solana',
    name: 'SOLANA',
    flag: 'PHL',
  },
  {
    id: 'ata-discoverybay',
    name: 'DISCOVERY BAY',
    flag: 'ATA',
  },
  {
    id: 'nor-soloavagen',
    name: 'SOLOAVAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-fredrikstad',
    name: 'FREDRIKSTAD',
    flag: 'NOR',
  },
  {
    id: 'deu-grossenbrode',
    name: 'GROSSENBRODE',
    flag: 'DEU',
  },
  {
    id: 'idn-tual',
    name: 'TUAL',
    flag: 'IDN',
  },
  {
    id: 'gbr-sainthelier',
    name: 'SAINT HELIER',
    flag: 'GBR',
  },
  {
    id: 'jpn-tsukumi',
    name: 'TSUKUMI',
    flag: 'JPN',
  },
  {
    id: 'som-mogadishu',
    name: 'MOGADISHU',
    flag: 'SOM',
  },
  {
    id: 'nld-breezanddijk',
    name: 'BREEZANDDIJK',
    flag: 'NLD',
  },
  {
    id: 'gbr-southsea',
    name: 'SOUTHSEA',
    flag: 'GBR',
  },
  {
    id: 'fra-gambsheim',
    name: 'GAMBSHEIM',
    flag: 'FRA',
  },
  {
    id: 'nzl-picton',
    name: 'PICTON',
    flag: 'NZL',
  },
  {
    id: 'jam-rockypoint',
    name: 'ROCKY POINT',
    flag: 'JAM',
  },
  {
    id: 'nor-haakonsvern',
    name: 'HAAKONSVERN',
    flag: 'NOR',
  },
  {
    id: 'irl-bantrybay',
    name: 'BANTRY BAY',
    flag: 'IRL',
  },
  {
    id: 'nld-nijmegen',
    name: 'NIJMEGEN',
    flag: 'NLD',
  },
  {
    id: 'grc-yali',
    name: 'YALI',
    flag: 'GRC',
  },
  {
    id: 'nor-fillan',
    name: 'FILLAN',
    flag: 'NOR',
  },
  {
    id: 'bel-oudenaarde',
    name: 'OUDENAARDE',
    flag: 'BEL',
  },
  {
    id: 'usa-hawkinlet',
    name: 'HAWK INLET',
    flag: 'USA',
  },
  {
    id: 'bel-moerbrugge',
    name: 'MOERBRUGGE',
    flag: 'BEL',
  },
  {
    id: 'usa-portlandor',
    name: 'PORTLAND OR',
    flag: 'USA',
  },
  {
    id: 'usa-gulfport',
    name: 'GULFPORT',
    flag: 'USA',
  },
  {
    id: 'irl-dundalk',
    name: 'DUNDALK',
    flag: 'IRL',
  },
  {
    id: 'esp-portdesoller',
    name: 'PORT DE SOLLER',
    flag: 'ESP',
  },
  {
    id: 'nld-enkhuizen',
    name: 'ENKHUIZEN',
    flag: 'NLD',
  },
  {
    id: 'dnk-aabenraa',
    name: 'AABENRAA',
    flag: 'DNK',
  },
  {
    id: 'dnk-hornbaek',
    name: 'HORNBAEK',
    flag: 'DNK',
  },
  {
    id: 'ita-salina',
    name: 'SALINA',
    flag: 'ITA',
  },
  {
    id: 'rou-murfatlar',
    name: 'MURFATLAR',
    flag: 'ROU',
  },
  {
    id: 'rus-sochi',
    name: 'SOCHI',
    flag: 'RUS',
  },
  {
    id: 'irn-khark',
    name: 'KHARK',
    flag: 'IRN',
  },
  {
    id: 'ind-portblair',
    name: 'PORT BLAIR',
    flag: 'IND',
  },
  {
    id: 'can-snugcove',
    name: 'SNUG COVE',
    flag: 'CAN',
  },
  {
    id: 'nor-storsteilene',
    name: 'STORSTEILENE',
    flag: 'NOR',
  },
  {
    id: 'jpn-nakagususku',
    name: 'NAKAGUSUSKU',
    flag: 'JPN',
  },
  {
    id: 'rus-posyet',
    name: 'POSYET',
    flag: 'RUS',
  },
  {
    id: 'ita-santapanagia',
    name: 'SANTA PANAGIA',
    flag: 'ITA',
  },
  {
    id: 'grc-pserimos',
    name: 'PSERIMOS',
    flag: 'GRC',
  },
  {
    id: 'are-ummshaiffield',
    name: 'UMM SHAIF FIELD',
    flag: 'ARE',
  },
  {
    id: 'aus-churchpoint',
    name: 'CHURCH POINT',
    flag: 'AUS',
  },
  {
    id: 'grc-agioskirykos',
    name: 'AGIOS KIRYKOS',
    flag: 'GRC',
  },
  {
    id: 'usa-harborsprings',
    name: 'HARBOR SPRINGS',
    flag: 'USA',
  },
  {
    id: 'usa-jacksonvillebeach',
    name: 'JACKSONVILLE BEACH',
    flag: 'USA',
  },
  {
    id: 'bel-charleroi',
    name: 'CHARLEROI',
    flag: 'BEL',
  },
  {
    id: 'deu-rudesheim',
    name: 'RUDESHEIM',
    flag: 'DEU',
  },
  {
    id: 'ita-stintinostill',
    name: 'STINTINO STILL',
    flag: 'ITA',
  },
  {
    id: 'nld-goes',
    name: 'GOES',
    flag: 'NLD',
  },
  {
    id: 'usa-rocheharbor',
    name: 'ROCHE  HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-wilmingtonisland',
    name: 'WILMINGTON ISLAND',
    flag: 'USA',
  },
  {
    id: 'bhs-cliftonbay',
    name: 'CLIFTON BAY',
    flag: 'BHS',
  },
  {
    id: 'usa-sebascoresort',
    name: 'SEBASCO RESORT',
    flag: 'USA',
  },
  {
    id: 'bra-imbituba',
    name: 'IMBITUBA',
    flag: 'BRA',
  },
  {
    id: 'prt-aveiro',
    name: 'AVEIRO',
    flag: 'PRT',
  },
  {
    id: 'bel-zeebrugge',
    name: 'ZEEBRUGGE',
    flag: 'BEL',
  },
  {
    id: 'nld-almere',
    name: 'ALMERE',
    flag: 'NLD',
  },
  {
    id: 'nld-maastricht',
    name: 'MAASTRICHT',
    flag: 'NLD',
  },
  {
    id: 'dnk-dragor',
    name: 'DRAGOR',
    flag: 'DNK',
  },
  {
    id: 'ita-molfetta',
    name: 'MOLFETTA',
    flag: 'ITA',
  },
  {
    id: 'grc-gaios',
    name: 'GAIOS',
    flag: 'GRC',
  },
  {
    id: 'grc-marathokampos',
    name: 'MARATHOKAMPOS',
    flag: 'GRC',
  },
  {
    id: 'bgr-nesebar',
    name: 'NESEBAR',
    flag: 'BGR',
  },
  {
    id: 'omn-khasab',
    name: 'KHASAB',
    flag: 'OMN',
  },
  {
    id: 'tha-samutsakhon',
    name: 'SAMUT SAKHON',
    flag: 'THA',
  },
  {
    id: 'chn-beihai',
    name: 'BEIHAI',
    flag: 'CHN',
  },
  {
    id: 'mac-macau',
    name: 'MACAU',
    flag: 'MAC',
  },
  {
    id: 'kor-jinhae',
    name: 'JINHAE',
    flag: 'KOR',
  },
  {
    id: 'png-lihir',
    name: 'LIHIR',
    flag: 'PNG',
  },
  {
    id: 'can-stewart',
    name: 'STEWART',
    flag: 'CAN',
  },
  {
    id: 'bhs-guncay',
    name: 'GUN CAY',
    flag: 'BHS',
  },
  {
    id: 'gbr-thames',
    name: 'THAMES',
    flag: 'GBR',
  },
  {
    id: 'dnk-lynaes',
    name: 'LYNAES',
    flag: 'DNK',
  },
  {
    id: 'cyp-akrotiri',
    name: 'AKROTIRI',
    flag: 'CYP',
  },
  {
    id: 'aus-welshpool',
    name: 'WELSHPOOL',
    flag: 'AUS',
  },
  {
    id: 'esp-castellon',
    name: 'CASTELLON',
    flag: 'ESP',
  },
  {
    id: 'idn-ketapang',
    name: 'KETAPANG',
    flag: 'IDN',
  },
  {
    id: 'are-mubarakfieid',
    name: 'MUBARAK FIEID',
    flag: 'ARE',
  },
  {
    id: 'esp-bancodelhoyoanchorage',
    name: 'BANCO DEL HOYO ANCHORAGE',
    flag: 'ESP',
  },
  {
    id: 'ven-lagunillas',
    name: 'LAGUNILLAS',
    flag: 'VEN',
  },
  {
    id: 'can-havrestpierre',
    name: 'HAVRE ST PIERRE',
    flag: 'CAN',
  },
  {
    id: 'grc-benitses',
    name: 'BENITSES',
    flag: 'GRC',
  },
  {
    id: 'jor-aqaba',
    name: 'AQABA',
    flag: 'JOR',
  },
  {
    id: 'phl-langatian',
    name: 'LANGATIAN',
    flag: 'PHL',
  },
  {
    id: 'swe-ljusne',
    name: 'LJUSNE',
    flag: 'SWE',
  },
  {
    id: 'mex-akalfield',
    name: 'AKAL FIELD',
    flag: 'MEX',
  },
  {
    id: 'usa-nevilleisland',
    name: 'NEVILLE ISLAND',
    flag: 'USA',
  },
  {
    id: 'tur-gocek',
    name: 'GOCEK',
    flag: 'TUR',
  },
  {
    id: 'ukr-kiliya',
    name: 'KILIYA',
    flag: 'UKR',
  },
  {
    id: 'nor-kragero',
    name: 'KRAGERO',
    flag: 'NOR',
  },
  {
    id: 'cri-puntaarenas',
    name: 'PUNTAARENAS',
    flag: 'CRI',
  },
  {
    id: 'tur-derince',
    name: 'DERINCE',
    flag: 'TUR',
  },
  {
    id: 'vgb-nannycay',
    name: 'NANNY CAY',
    flag: 'VGB',
  },
  {
    id: 'usa-southhaven',
    name: 'SOUTH HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-caruthersville',
    name: 'CARUTHERSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-joppa',
    name: 'JOPPA',
    flag: 'USA',
  },
  {
    id: 'ecu-puertobolivar',
    name: 'PUERTO BOLIVAR',
    flag: 'ECU',
  },
  {
    id: 'chl-caldera',
    name: 'CALDERA',
    flag: 'CHL',
  },
  {
    id: 'fra-quiberon',
    name: 'QUIBERON',
    flag: 'FRA',
  },
  {
    id: 'dza-alger',
    name: 'ALGER',
    flag: 'DZA',
  },
  {
    id: 'nga-escravos',
    name: 'ESCRAVOS',
    flag: 'NGA',
  },
  {
    id: 'nor-kleppesto',
    name: 'KLEPPESTO',
    flag: 'NOR',
  },
  {
    id: 'deu-wesel',
    name: 'WESEL',
    flag: 'DEU',
  },
  {
    id: 'ita-vadoligure',
    name: 'VADO LIGURE',
    flag: 'ITA',
  },
  {
    id: 'nor-orkanger',
    name: 'ORKANGER',
    flag: 'NOR',
  },
  {
    id: 'deu-arnis',
    name: 'ARNIS',
    flag: 'DEU',
  },
  {
    id: 'dnk-odense',
    name: 'ODENSE',
    flag: 'DNK',
  },
  {
    id: 'ita-scilla',
    name: 'SCILLA',
    flag: 'ITA',
  },
  {
    id: 'pol-darlowo',
    name: 'DARLOWO',
    flag: 'POL',
  },
  {
    id: 'hrv-bogoevo',
    name: 'BOGOEVO',
    flag: 'HRV',
  },
  {
    id: 'are-mugharragport',
    name: 'MUGHARRAG PORT',
    flag: 'ARE',
  },
  {
    id: 'phl-isabel',
    name: 'ISABEL',
    flag: 'PHL',
  },
  {
    id: 'aus-portlincoln',
    name: 'PORT LINCOLN',
    flag: 'AUS',
  },
  {
    id: 'usa-sawmillbay',
    name: 'SAWMILL BAY',
    flag: 'USA',
  },
  {
    id: 'can-sidney',
    name: 'SIDNEY',
    flag: 'CAN',
  },
  {
    id: 'grc-katakolo',
    name: 'KATAKOLO',
    flag: 'GRC',
  },
  {
    id: 'tur-asyaport',
    name: 'ASYAPORT',
    flag: 'TUR',
  },
  {
    id: 'jpn-takehara',
    name: 'TAKEHARA',
    flag: 'JPN',
  },
  {
    id: 'usa-sunriseharbor',
    name: 'SUNRISE HARBOR',
    flag: 'USA',
  },
  {
    id: 'ita-palermoanchorage',
    name: 'PALERMO ANCHORAGE',
    flag: 'ITA',
  },
  {
    id: 'mex-lazarocardenas',
    name: 'LAZARO CARDENAS',
    flag: 'MEX',
  },
  {
    id: 'ven-tiajuana',
    name: 'TIA JUANA',
    flag: 'VEN',
  },
  {
    id: 'gbr-christchurch',
    name: 'CHRISTCHURCH',
    flag: 'GBR',
  },
  {
    id: 'tur-kas',
    name: 'KAS',
    flag: 'TUR',
  },
  {
    id: 'rus-kstovo',
    name: 'KSTOVO',
    flag: 'RUS',
  },
  {
    id: 'phl-toledo',
    name: 'TOLEDO',
    flag: 'PHL',
  },
  {
    id: 'aus-albany',
    name: 'ALBANY',
    flag: 'AUS',
  },
  {
    id: 'usa-porterie',
    name: 'PORT ERIE',
    flag: 'USA',
  },
  {
    id: 'hrv-otokkakan',
    name: 'OTOK KAKAN',
    flag: 'HRV',
  },
  {
    id: 'can-tribunebay',
    name: 'TRIBUNE BAY',
    flag: 'CAN',
  },
  {
    id: 'usa-jensenbeach',
    name: 'JENSEN BEACH',
    flag: 'USA',
  },
  {
    id: 'bhs-greenturtlecay',
    name: 'GREEN TURTLE CAY',
    flag: 'BHS',
  },
  {
    id: 'srb-donjimilanovac',
    name: 'DONJI MILANOVAC',
    flag: 'SRB',
  },
  {
    id: 'nor-siggjarvag',
    name: 'SIGGJARVAG',
    flag: 'NOR',
  },
  {
    id: 'irn-bandartaherioffshoreterminal',
    name: 'BANDAR TAHERI OFFSHORE TERMINAL',
    flag: 'IRN',
  },
  {
    id: 'idn-cemara',
    name: 'CEMARA',
    flag: 'IDN',
  },
  {
    id: 'usa-huntingtontristate',
    name: 'HUNTINGTON TRI STATE',
    flag: 'USA',
  },
  {
    id: 'esp-cueta',
    name: 'CUETA',
    flag: 'ESP',
  },
  {
    id: 'gbr-ardrossan',
    name: 'ARDROSSAN',
    flag: 'GBR',
  },
  {
    id: 'dza-mostaganem',
    name: 'MOSTAGANEM',
    flag: 'DZA',
  },
  {
    id: 'nld-zierikzee',
    name: 'ZIERIKZEE',
    flag: 'NLD',
  },
  {
    id: 'nld-harderwijk',
    name: 'HARDERWIJK',
    flag: 'NLD',
  },
  {
    id: 'ita-portoferraio',
    name: 'PORTO FERRAIO',
    flag: 'ITA',
  },
  {
    id: 'swe-ockero',
    name: 'OCKERO',
    flag: 'SWE',
  },
  {
    id: 'nor-svolvaer',
    name: 'SVOLVAER',
    flag: 'NOR',
  },
  {
    id: 'svk-gabcikovo',
    name: 'GABCIKOVO',
    flag: 'SVK',
  },
  {
    id: 'grc-karpathos',
    name: 'KARPATHOS',
    flag: 'GRC',
  },
  {
    id: 'rou-sulina',
    name: 'SULINA',
    flag: 'ROU',
  },
  {
    id: 'are-aljazirah',
    name: 'AL JAZIRAH',
    flag: 'ARE',
  },
  {
    id: 'chn-ruian',
    name: 'RUIAN',
    flag: 'CHN',
  },
  {
    id: 'can-gaspe',
    name: 'GASPE',
    flag: 'CAN',
  },
  {
    id: 'gbr-millport',
    name: 'MILLPORT',
    flag: 'GBR',
  },
  {
    id: 'tur-kumbag',
    name: 'KUMBAG',
    flag: 'TUR',
  },
  {
    id: 'mys-lahaddatu',
    name: 'LAHAD DATU',
    flag: 'MYS',
  },
  {
    id: 'phl-cogan',
    name: 'COGAN',
    flag: 'PHL',
  },
  {
    id: 'sxm-stmaarten',
    name: 'ST MAARTEN',
    flag: 'SXM',
  },
  {
    id: 'gbr-brighton',
    name: 'BRIGHTON',
    flag: 'GBR',
  },
  {
    id: 'jpn-sendai',
    name: 'SENDAI',
    flag: 'JPN',
  },
  {
    id: 'gnq-serpentinaterminal',
    name: 'SERPENTINA TERMINAL',
    flag: 'GNQ',
  },
  {
    id: 'lby-tobruk',
    name: 'TOBRUK',
    flag: 'LBY',
  },
  {
    id: 'rus-vytegra',
    name: 'VYTEGRA',
    flag: 'RUS',
  },
  {
    id: 'esp-orio',
    name: 'ORIO',
    flag: 'ESP',
  },
  {
    id: 'fra-santes',
    name: 'SANTES',
    flag: 'FRA',
  },
  {
    id: 'idn-ampenan',
    name: 'AMPENAN',
    flag: 'IDN',
  },
  {
    id: 'nld-dongen',
    name: 'DONGEN',
    flag: 'NLD',
  },
  {
    id: 'hrv-zaton',
    name: 'ZATON',
    flag: 'HRV',
  },
  {
    id: 'nld-middenmeer',
    name: 'MIDDENMEER',
    flag: 'NLD',
  },
  {
    id: 'nor-melsomvik',
    name: 'MELSOMVIK',
    flag: 'NOR',
  },
  {
    id: 'nld-deest',
    name: 'DEEST',
    flag: 'NLD',
  },
  {
    id: 'can-portalberni',
    name: 'PORT ALBERNI',
    flag: 'CAN',
  },
  {
    id: 'usa-tampa',
    name: 'TAMPA',
    flag: 'USA',
  },
  {
    id: 'usa-mamibeach',
    name: 'MAMI BEACH',
    flag: 'USA',
  },
  {
    id: 'bra-itajai',
    name: 'ITAJAI',
    flag: 'BRA',
  },
  {
    id: 'bra-itaqui',
    name: 'ITAQUI',
    flag: 'BRA',
  },
  {
    id: 'cpv-tarrafal',
    name: 'TARRAFAL',
    flag: 'CPV',
  },
  {
    id: 'gbr-southampton',
    name: 'SOUTHAMPTON',
    flag: 'GBR',
  },
  {
    id: 'bel-oostende',
    name: 'OOSTENDE',
    flag: 'BEL',
  },
  {
    id: 'chn-yangzhong',
    name: 'YANGZHONG',
    flag: 'CHN',
  },
  {
    id: 'chn-ninghai',
    name: 'NINGHAI',
    flag: 'CHN',
  },
  {
    id: 'phl-agusan',
    name: 'AGUSAN',
    flag: 'PHL',
  },
  {
    id: 'jpn-yura',
    name: 'YURA',
    flag: 'JPN',
  },
  {
    id: 'col-sanandres',
    name: 'SAN ANDRES',
    flag: 'COL',
  },
  {
    id: 'chl-quemchi',
    name: 'QUEMCHI',
    flag: 'CHL',
  },
  {
    id: 'ita-santostefano',
    name: 'SANTO STEFANO',
    flag: 'ITA',
  },
  {
    id: 'ind-porbandar',
    name: 'PORBANDAR',
    flag: 'IND',
  },
  {
    id: 'mys-tanjungpelepas',
    name: 'TANJUNG PELEPAS',
    flag: 'MYS',
  },
  {
    id: 'bhr-khalifabinsalman',
    name: 'KHALIFA BIN SALMAN',
    flag: 'BHR',
  },
  {
    id: 'cog-yomboterminal',
    name: 'YOMBO TERMINAL',
    flag: 'COG',
  },
  {
    id: 'hti-aubry',
    name: 'AUBRY',
    flag: 'HTI',
  },
  {
    id: 'usa-breweressex',
    name: 'BREWER ESSEX',
    flag: 'USA',
  },
  {
    id: 'aut-leiben',
    name: 'LEIBEN',
    flag: 'AUT',
  },
  {
    id: 'chn-yancheng',
    name: 'YANCHENG',
    flag: 'CHN',
  },
  {
    id: 'ind-okha',
    name: 'OKHA',
    flag: 'IND',
  },
  {
    id: 'idn-palopo',
    name: 'PALOPO',
    flag: 'IDN',
  },
  {
    id: 'usa-laketashmoo',
    name: 'LAKE TASHMOO',
    flag: 'USA',
  },
  {
    id: 'bel-bruges',
    name: 'BRUGES',
    flag: 'BEL',
  },
  {
    id: 'swe-gavle',
    name: 'GAVLE',
    flag: 'SWE',
  },
  {
    id: 'pyf-teahupoo',
    name: 'TEAHUPOO',
    flag: 'PYF',
  },
  {
    id: 'usa-northbend',
    name: 'NORTH BEND',
    flag: 'USA',
  },
  {
    id: 'nor-hommersak',
    name: 'HOMMERSAK',
    flag: 'NOR',
  },
  {
    id: 'pan-puenteatlantico',
    name: 'PUENTE ATLANTICO',
    flag: 'PAN',
  },
  {
    id: 'can-saultstemarie',
    name: 'SAULT STE MARIE',
    flag: 'CAN',
  },
  {
    id: 'pyf-vaiare',
    name: 'VAIARE',
    flag: 'PYF',
  },
  {
    id: 'can-queencharlotte',
    name: 'QUEEN CHARLOTTE',
    flag: 'CAN',
  },
  {
    id: 'usa-greatkillsharbor',
    name: 'GREAT KILLS HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-reserve',
    name: 'RESERVE',
    flag: 'USA',
  },
  {
    id: 'can-sarnia',
    name: 'SARNIA',
    flag: 'CAN',
  },
  {
    id: 'usa-palmyachtcenter',
    name: 'PALM YACHT CENTER',
    flag: 'USA',
  },
  {
    id: 'chl-antofagasta',
    name: 'ANTOFAGASTA',
    flag: 'CHL',
  },
  {
    id: 'can-harborgrace',
    name: 'HARBOR GRACE',
    flag: 'CAN',
  },
  {
    id: 'can-longpond',
    name: 'LONG POND',
    flag: 'CAN',
  },
  {
    id: 'prt-funchal',
    name: 'FUNCHAL',
    flag: 'PRT',
  },
  {
    id: 'irl-howth',
    name: 'HOWTH',
    flag: 'IRL',
  },
  {
    id: 'gbr-seahouses',
    name: 'SEAHOUSES',
    flag: 'GBR',
  },
  {
    id: 'gbr-kingslynn',
    name: 'KINGS LYNN',
    flag: 'GBR',
  },
  {
    id: 'nld-dordrecht',
    name: 'DORDRECHT',
    flag: 'NLD',
  },
  {
    id: 'dza-bejaia',
    name: 'BEJAIA',
    flag: 'DZA',
  },
  {
    id: 'nor-vikoyri',
    name: 'VIKOYRI',
    flag: 'NOR',
  },
  {
    id: 'nor-korshamn',
    name: 'KORSHAMN',
    flag: 'NOR',
  },
  {
    id: 'hrv-maslinica',
    name: 'MASLINICA',
    flag: 'HRV',
  },
  {
    id: 'tur-poyraz',
    name: 'POYRAZ',
    flag: 'TUR',
  },
  {
    id: 'irq-khawralzubairlngterminal',
    name: 'KHAWR AL ZUBAIR LNG TERMINAL',
    flag: 'IRQ',
  },
  {
    id: 'jpn-nichinan',
    name: 'NICHINAN',
    flag: 'JPN',
  },
  {
    id: 'idn-babo',
    name: 'BABO',
    flag: 'IDN',
  },
  {
    id: 'can-stpierre',
    name: 'ST PIERRE',
    flag: 'CAN',
  },
  {
    id: 'dza-annaba',
    name: 'ANNABA',
    flag: 'DZA',
  },
  {
    id: 'ita-sestrilevante',
    name: 'SESTRI LEVANTE',
    flag: 'ITA',
  },
  {
    id: 'phl-zamboanga',
    name: 'ZAMBOANGA',
    flag: 'PHL',
  },
  {
    id: 'usa-stpetersburg',
    name: 'ST PETERSBURG',
    flag: 'USA',
  },
  {
    id: 'chl-arica',
    name: 'ARICA',
    flag: 'CHL',
  },
  {
    id: 'tur-kartal',
    name: 'KARTAL',
    flag: 'TUR',
  },
  {
    id: 'cmr-ebometerminal',
    name: 'EBOME TERMINAL',
    flag: 'CMR',
  },
  {
    id: 'idn-muaraberauanchorage',
    name: 'MUARA BERAU ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'usa-mc807platform',
    name: 'MC 807 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-newburghin',
    name: 'NEWBURGH IN',
    flag: 'USA',
  },
  {
    id: 'jam-portroyal',
    name: 'PORT ROYAL',
    flag: 'JAM',
  },
  {
    id: 'pri-puertoreal',
    name: 'PUERTO REAL',
    flag: 'PRI',
  },
  {
    id: 'nor-porsgrunn',
    name: 'PORSGRUNN',
    flag: 'NOR',
  },
  {
    id: 'hrv-icici',
    name: 'ICICI',
    flag: 'HRV',
  },
  {
    id: 'usa-mackinawcity',
    name: 'MACKINAW CITY',
    flag: 'USA',
  },
  {
    id: 'rus-kulikovoanchorage',
    name: 'KULIKOVO ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'usa-rowayton',
    name: 'ROWAYTON',
    flag: 'USA',
  },
  {
    id: 'nor-aroysund',
    name: 'AROYSUND',
    flag: 'NOR',
  },
  {
    id: 'hrv-prvicluka',
    name: 'PRVIC LUKA',
    flag: 'HRV',
  },
  {
    id: 'usa-selby',
    name: 'SELBY',
    flag: 'USA',
  },
  {
    id: 'usa-fortmorgananchorage',
    name: 'FORT MORGAN ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'mex-cozumel',
    name: 'COZUMEL',
    flag: 'MEX',
  },
  {
    id: 'usa-blades',
    name: 'BLADES',
    flag: 'USA',
  },
  {
    id: 'usa-plymouthharbor',
    name: 'PLYMOUTH HARBOR',
    flag: 'USA',
  },
  {
    id: 'ven-guanta',
    name: 'GUANTA',
    flag: 'VEN',
  },
  {
    id: 'gbr-tilbury',
    name: 'TILBURY',
    flag: 'GBR',
  },
  {
    id: 'nor-oystese',
    name: 'OYSTESE',
    flag: 'NOR',
  },
  {
    id: 'deu-dusseldorf',
    name: 'DUSSELDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-kappeln',
    name: 'KAPPELN',
    flag: 'DEU',
  },
  {
    id: 'dnk-praesto',
    name: 'PRAESTO',
    flag: 'DNK',
  },
  {
    id: 'hrv-sukosan',
    name: 'SUKOSAN',
    flag: 'HRV',
  },
  {
    id: 'grc-glyfada',
    name: 'GLYFADA',
    flag: 'GRC',
  },
  {
    id: 'egy-safaga',
    name: 'SAFAGA',
    flag: 'EGY',
  },
  {
    id: 'irn-sirri',
    name: 'SIRRI',
    flag: 'IRN',
  },
  {
    id: 'chn-langya',
    name: 'LANGYA',
    flag: 'CHN',
  },
  {
    id: 'chn-songmen',
    name: 'SONGMEN',
    flag: 'CHN',
  },
  {
    id: 'idn-amurang',
    name: 'AMURANG',
    flag: 'IDN',
  },
  {
    id: 'can-digby',
    name: 'DIGBY',
    flag: 'CAN',
  },
  {
    id: 'mlt-marsaxlokk',
    name: 'MARSAXLOKK',
    flag: 'MLT',
  },
  {
    id: 'phl-garciahernandez',
    name: 'GARCIA HERNANDEZ',
    flag: 'PHL',
  },
  {
    id: 'chn-taishanpowerplant',
    name: 'TAISHAN POWER PLANT',
    flag: 'CHN',
  },
  {
    id: 'rus-korsakov',
    name: 'KORSAKOV',
    flag: 'RUS',
  },
  {
    id: 'bra-suape',
    name: 'SUAPE',
    flag: 'BRA',
  },
  {
    id: 'usa-mobile',
    name: 'MOBILE',
    flag: 'USA',
  },
  {
    id: 'chn-cfd11field',
    name: 'CFD11 FIELD',
    flag: 'CHN',
  },
  {
    id: 'pyf-rikitea',
    name: 'RIKITEA',
    flag: 'PYF',
  },
  {
    id: 'deu-schwedt',
    name: 'SCHWEDT',
    flag: 'DEU',
  },
  {
    id: 'swe-norrtalje',
    name: 'NORRTALJE',
    flag: 'SWE',
  },
  {
    id: 'cck-cocos',
    name: 'COCOS',
    flag: 'CCK',
  },
  {
    id: 'phl-mahayag',
    name: 'MAHAYAG',
    flag: 'PHL',
  },
  {
    id: 'can-minkisland',
    name: 'MINK ISLAND',
    flag: 'CAN',
  },
  {
    id: 'mys-tanjunglangsat',
    name: 'TANJUNG LANGSAT',
    flag: 'MYS',
  },
  {
    id: 'cyp-kalecik',
    name: 'KALECIK',
    flag: 'CYP',
  },
  {
    id: 'aus-portgiles',
    name: 'PORT GILES',
    flag: 'AUS',
  },
  {
    id: 'dnk-kalundborganchorage',
    name: 'KALUNDBORG ANCHORAGE',
    flag: 'DNK',
  },
  {
    id: 'bel-rumst',
    name: 'RUMST',
    flag: 'BEL',
  },
  {
    id: 'dnk-dragerup',
    name: 'DRAGERUP',
    flag: 'DNK',
  },
  {
    id: 'mlt-mgarr',
    name: 'MGARR',
    flag: 'MLT',
  },
  {
    id: 'phl-cagsiay',
    name: 'CAGSIAY',
    flag: 'PHL',
  },
  {
    id: 'deu-rees',
    name: 'REES',
    flag: 'DEU',
  },
  {
    id: 'nld-grave',
    name: 'GRAVE',
    flag: 'NLD',
  },
  {
    id: 'rus-tenishevo',
    name: 'TENISHEVO',
    flag: 'RUS',
  },
  {
    id: 'nor-odda',
    name: 'ODDA',
    flag: 'NOR',
  },
  {
    id: 'esp-rianxo',
    name: 'RIANXO',
    flag: 'ESP',
  },
  {
    id: 'nld-akersloot',
    name: 'AKERSLOOT',
    flag: 'NLD',
  },
  {
    id: 'gbr-inverkeithing',
    name: 'INVERKEITHING',
    flag: 'GBR',
  },
  {
    id: 'hrv-skradinanchorage',
    name: 'SKRADIN ANCHORAGE',
    flag: 'HRV',
  },
  {
    id: 'usa-dutchharbor',
    name: 'DUTCH HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-pointroberts',
    name: 'POINT ROBERTS',
    flag: 'USA',
  },
  {
    id: 'mex-loscabos',
    name: 'LOS CABOS',
    flag: 'MEX',
  },
  {
    id: 'usa-wrightsvillebeach',
    name: 'WRIGHTSVILLE BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-eastgloucester',
    name: 'EAST GLOUCESTER',
    flag: 'USA',
  },
  {
    id: 'maf-stmartin',
    name: 'ST MARTIN',
    flag: 'MAF',
  },
  {
    id: 'brb-speightstown',
    name: 'SPEIGHTSTOWN',
    flag: 'BRB',
  },
  {
    id: 'bra-maceio',
    name: 'MACEIO',
    flag: 'BRA',
  },
  {
    id: 'esp-caletadevelez',
    name: 'CALETA DE VELEZ',
    flag: 'ESP',
  },
  {
    id: 'nld-hoorn',
    name: 'HOORN',
    flag: 'NLD',
  },
  {
    id: 'nld-sneek',
    name: 'SNEEK',
    flag: 'NLD',
  },
  {
    id: 'fra-propriano',
    name: 'PROPRIANO',
    flag: 'FRA',
  },
  {
    id: 'svn-izola',
    name: 'IZOLA',
    flag: 'SVN',
  },
  {
    id: 'grc-kavala',
    name: 'KAVALA',
    flag: 'GRC',
  },
  {
    id: 'grc-kos',
    name: 'KOS',
    flag: 'GRC',
  },
  {
    id: 'tur-esenkoy',
    name: 'ESENKOY',
    flag: 'TUR',
  },
  {
    id: 'egy-wadifeiran',
    name: 'WADI FEIRAN',
    flag: 'EGY',
  },
  {
    id: 'tur-inebolu',
    name: 'INEBOLU',
    flag: 'TUR',
  },
  {
    id: 'chn-meizhouisland',
    name: 'MEIZHOU ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-jinshitan',
    name: 'JINSHITAN',
    flag: 'CHN',
  },
  {
    id: 'jpn-tagonoura',
    name: 'TAGONOURA',
    flag: 'JPN',
  },
  {
    id: 'aus-cronulla',
    name: 'CRONULLA',
    flag: 'AUS',
  },
  {
    id: 'png-kieta',
    name: 'KIETA',
    flag: 'PNG',
  },
  {
    id: 'slb-honiara',
    name: 'HONIARA',
    flag: 'SLB',
  },
  {
    id: 'hnd-sanlorenzo',
    name: 'SAN LORENZO',
    flag: 'HND',
  },
  {
    id: 'gbr-lochboisdale',
    name: 'LOCHBOISDALE',
    flag: 'GBR',
  },
  {
    id: 'irl-dublin',
    name: 'DUBLIN',
    flag: 'IRL',
  },
  {
    id: 'ecu-puertovillamil',
    name: 'PUERTO VILLAMIL',
    flag: 'ECU',
  },
  {
    id: 'swe-slite',
    name: 'SLITE',
    flag: 'SWE',
  },
  {
    id: 'phl-sinisian',
    name: 'SINISIAN',
    flag: 'PHL',
  },
  {
    id: 'dnk-roedbyhavn',
    name: 'ROEDBYHAVN',
    flag: 'DNK',
  },
  {
    id: 'swe-karlshamn',
    name: 'KARLSHAMN',
    flag: 'SWE',
  },
  {
    id: 'hun-nagymaros',
    name: 'NAGYMAROS',
    flag: 'HUN',
  },
  {
    id: 'tur-iskenderun',
    name: 'ISKENDERUN',
    flag: 'TUR',
  },
  {
    id: 'usa-pocasset',
    name: 'POCASSET',
    flag: 'USA',
  },
  {
    id: 'gbr-scapa',
    name: 'SCAPA',
    flag: 'GBR',
  },
  {
    id: 'nld-loosdrecht',
    name: 'LOOSDRECHT',
    flag: 'NLD',
  },
  {
    id: 'hrv-pula',
    name: 'PULA',
    flag: 'HRV',
  },
  {
    id: 'grc-koufonisi',
    name: 'KOUFONISI',
    flag: 'GRC',
  },
  {
    id: 'jpn-saijo',
    name: 'SAIJO',
    flag: 'JPN',
  },
  {
    id: 'pan-limonbayanchorage',
    name: 'LIMON BAY ANCHORAGE',
    flag: 'PAN',
  },
  {
    id: 'imn-porterin',
    name: 'PORT ERIN',
    flag: 'IMN',
  },
  {
    id: 'usa-portneches',
    name: 'PORT NECHES',
    flag: 'USA',
  },
  {
    id: 'hrv-bakar',
    name: 'BAKAR',
    flag: 'HRV',
  },
  {
    id: 'rus-solikamsk',
    name: 'SOLIKAMSK',
    flag: 'RUS',
  },
  {
    id: 'dnk-svendborgdrejoe',
    name: 'SVENDBORG DREJOE',
    flag: 'DNK',
  },
  {
    id: 'rou-giurgiu',
    name: 'GIURGIU',
    flag: 'ROU',
  },
  {
    id: 'deu-grieth',
    name: 'GRIETH',
    flag: 'DEU',
  },
  {
    id: 'usa-houghton',
    name: 'HOUGHTON',
    flag: 'USA',
  },
  {
    id: 'usa-wardcove',
    name: 'WARD COVE',
    flag: 'USA',
  },
  {
    id: 'can-comox',
    name: 'COMOX',
    flag: 'CAN',
  },
  {
    id: 'per-chancay',
    name: 'CHANCAY',
    flag: 'PER',
  },
  {
    id: 'bra-coari',
    name: 'COARI',
    flag: 'BRA',
  },
  {
    id: 'sen-dakar',
    name: 'DAKAR',
    flag: 'SEN',
  },
  {
    id: 'isl-faskrudsfjordur',
    name: 'FASKRUDSFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'lbr-greenville',
    name: 'GREENVILLE',
    flag: 'LBR',
  },
  {
    id: 'irl-limerick',
    name: 'LIMERICK',
    flag: 'IRL',
  },
  {
    id: 'bel-kloosterveld',
    name: 'KLOOSTERVELD',
    flag: 'BEL',
  },
  {
    id: 'fra-mulhouse',
    name: 'MULHOUSE',
    flag: 'FRA',
  },
  {
    id: 'deu-travemuende',
    name: 'TRAVEMUENDE',
    flag: 'DEU',
  },
  {
    id: 'nor-gladstad',
    name: 'GLADSTAD',
    flag: 'NOR',
  },
  {
    id: 'aut-strengberg',
    name: 'STRENGBERG',
    flag: 'AUT',
  },
  {
    id: 'nor-torsken',
    name: 'TORSKEN',
    flag: 'NOR',
  },
  {
    id: 'swe-visby',
    name: 'VISBY',
    flag: 'SWE',
  },
  {
    id: 'bgr-nikopol',
    name: 'NIKOPOL',
    flag: 'BGR',
  },
  {
    id: 'grc-naxos',
    name: 'NAXOS',
    flag: 'GRC',
  },
  {
    id: 'egy-portsaid',
    name: 'PORT SAID',
    flag: 'EGY',
  },
  {
    id: 'aus-coogee',
    name: 'COOGEE',
    flag: 'AUS',
  },
  {
    id: 'jpn-miyanoura',
    name: 'MIYANOURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-setoda',
    name: 'SETODA',
    flag: 'JPN',
  },
  {
    id: 'jpn-sakaiminato',
    name: 'SAKAIMINATO',
    flag: 'JPN',
  },
  {
    id: 'jpn-uraga',
    name: 'URAGA',
    flag: 'JPN',
  },
  {
    id: 'aus-bowen',
    name: 'BOWEN',
    flag: 'AUS',
  },
  {
    id: 'can-cowichanbay',
    name: 'COWICHAN BAY',
    flag: 'CAN',
  },
  {
    id: 'are-alsadar',
    name: 'ALSADAR',
    flag: 'ARE',
  },
  {
    id: 'twn-houwu',
    name: 'HOUWU',
    flag: 'TWN',
  },
  {
    id: 'jpn-tokyo',
    name: 'TOKYO',
    flag: 'JPN',
  },
  {
    id: 'chn-jinghai',
    name: 'JINGHAI',
    flag: 'CHN',
  },
  {
    id: 'nld-terschellinganchorage',
    name: 'TERSCHELLING ANCHORAGE',
    flag: 'NLD',
  },
  {
    id: 'aus-uselessloop',
    name: 'USELESS LOOP',
    flag: 'AUS',
  },
  {
    id: 'fra-rochefort',
    name: 'ROCHEFORT',
    flag: 'FRA',
  },
  {
    id: 'deu-zingst',
    name: 'ZINGST',
    flag: 'DEU',
  },
  {
    id: 'usa-eatonsneck',
    name: 'EATONS NECK',
    flag: 'USA',
  },
  {
    id: 'isl-holmavik',
    name: 'HOLMAVIK',
    flag: 'ISL',
  },
  {
    id: 'ita-lamaddalena',
    name: 'LA MADDALENA',
    flag: 'ITA',
  },
  {
    id: 'nor-stjordal',
    name: 'STJORDAL',
    flag: 'NOR',
  },
  {
    id: 'tur-dardanellesanchorage',
    name: 'DARDANELLES ANCHORAGE',
    flag: 'TUR',
  },
  {
    id: 'usa-buffalo',
    name: 'BUFFALO',
    flag: 'USA',
  },
  {
    id: 'grc-palairos',
    name: 'PALAIROS',
    flag: 'GRC',
  },
  {
    id: 'ita-amalfi',
    name: 'AMALFI',
    flag: 'ITA',
  },
  {
    id: 'can-portmoody',
    name: 'PORT MOODY',
    flag: 'CAN',
  },
  {
    id: 'lux-mertert',
    name: 'MERTERT',
    flag: 'LUX',
  },
  {
    id: 'fra-pontoise',
    name: 'PONTOISE',
    flag: 'FRA',
  },
  {
    id: 'nor-aagotnes',
    name: 'AAGOTNES',
    flag: 'NOR',
  },
  {
    id: 'bel-engis',
    name: 'ENGIS',
    flag: 'BEL',
  },
  {
    id: 'nld-cuijk',
    name: 'CUIJK',
    flag: 'NLD',
  },
  {
    id: 'swe-kungalv',
    name: 'KUNGALV',
    flag: 'SWE',
  },
  {
    id: 'idn-sungailiat',
    name: 'SUNGAILIAT',
    flag: 'IDN',
  },
  {
    id: 'idn-pemangkat',
    name: 'PEMANGKAT',
    flag: 'IDN',
  },
  {
    id: 'nld-heteren',
    name: 'HETEREN',
    flag: 'NLD',
  },
  {
    id: 'usa-bayoulabatre',
    name: 'BAYOU LA BATRE',
    flag: 'USA',
  },
  {
    id: 'bhs-bakersbay',
    name: 'BAKERS BAY',
    flag: 'BHS',
  },
  {
    id: 'pri-salinas',
    name: 'SALINAS',
    flag: 'PRI',
  },
  {
    id: 'vir-ensomhedbay',
    name: 'ENSOMHED BAY',
    flag: 'VIR',
  },
  {
    id: 'gin-conakry',
    name: 'CONAKRY',
    flag: 'GIN',
  },
  {
    id: 'gbr-saintmawes',
    name: 'SAINT MAWES',
    flag: 'GBR',
  },
  {
    id: 'fra-tancarville',
    name: 'TANCARVILLE',
    flag: 'FRA',
  },
  {
    id: 'nor-molde',
    name: 'MOLDE',
    flag: 'NOR',
  },
  {
    id: 'swe-stockholm',
    name: 'STOCKHOLM',
    flag: 'SWE',
  },
  {
    id: 'are-barakah',
    name: 'BARAKAH',
    flag: 'ARE',
  },
  {
    id: 'vnm-hongai',
    name: 'HON GAI',
    flag: 'VNM',
  },
  {
    id: 'hkg-hongkong',
    name: 'HONG KONG',
    flag: 'HKG',
  },
  {
    id: 'chn-chizhou',
    name: 'CHIZHOU',
    flag: 'CHN',
  },
  {
    id: 'jpn-shimotsu',
    name: 'SHIMOTSU',
    flag: 'JPN',
  },
  {
    id: 'idn-biak',
    name: 'BIAK',
    flag: 'IDN',
  },
  {
    id: 'nor-langesund',
    name: 'LANGESUND',
    flag: 'NOR',
  },
  {
    id: 'grc-milos',
    name: 'MILOS',
    flag: 'GRC',
  },
  {
    id: 'tur-rumelifeneri',
    name: 'RUMELIFENERI',
    flag: 'TUR',
  },
  {
    id: 'twn-hualien',
    name: 'HUALIEN',
    flag: 'TWN',
  },
  {
    id: 'ita-terminiimereseanchorage',
    name: 'TERMINI IMERESE ANCHORAGE',
    flag: 'ITA',
  },
  {
    id: 'qat-lusail',
    name: 'LUSAIL',
    flag: 'QAT',
  },
  {
    id: 'are-crescentmoonisland',
    name: 'CRESCENT MOON ISLAND',
    flag: 'ARE',
  },
  {
    id: 'usa-delraybeach',
    name: 'DELRAY BEACH',
    flag: 'USA',
  },
  {
    id: 'grl-tasiilaq',
    name: 'TASIILAQ',
    flag: 'GRL',
  },
  {
    id: 'fra-salaise',
    name: 'SALAISE',
    flag: 'FRA',
  },
  {
    id: 'est-haapsalu',
    name: 'HAAPSALU',
    flag: 'EST',
  },
  {
    id: 'chl-tenaun',
    name: 'TENAUN',
    flag: 'CHL',
  },
  {
    id: 'fra-don',
    name: 'DON',
    flag: 'FRA',
  },
  {
    id: 'dnk-sakskobing',
    name: 'SAKSKOBING',
    flag: 'DNK',
  },
  {
    id: 'swe-oesteraaker',
    name: 'OESTERAAKER',
    flag: 'SWE',
  },
  {
    id: 'ala-sund',
    name: 'SUND',
    flag: 'ALA',
  },
  {
    id: 'are-alraafah',
    name: 'AL RAAFAH',
    flag: 'ARE',
  },
  {
    id: 'idn-pariaman',
    name: 'PARIAMAN',
    flag: 'IDN',
  },
  {
    id: 'gbr-moelfre',
    name: 'MOELFRE',
    flag: 'GBR',
  },
  {
    id: 'nld-goudswaard',
    name: 'GOUDSWAARD',
    flag: 'NLD',
  },
  {
    id: 'grc-parga',
    name: 'PARGA',
    flag: 'GRC',
  },
  {
    id: 'swe-henan',
    name: 'HENAN',
    flag: 'SWE',
  },
  {
    id: 'usa-craig',
    name: 'CRAIG',
    flag: 'USA',
  },
  {
    id: 'usa-neworleans',
    name: 'NEW ORLEANS',
    flag: 'USA',
  },
  {
    id: 'usa-palmbeach',
    name: 'PALM BEACH',
    flag: 'USA',
  },
  {
    id: 'per-supe',
    name: 'SUPE',
    flag: 'PER',
  },
  {
    id: 'chl-quellon',
    name: 'QUELLON',
    flag: 'CHL',
  },
  {
    id: 'usa-portlandme',
    name: 'PORTLAND ME',
    flag: 'USA',
  },
  {
    id: 'lca-marigotbay',
    name: 'MARIGOT BAY',
    flag: 'LCA',
  },
  {
    id: 'gbr-plockton',
    name: 'PLOCKTON',
    flag: 'GBR',
  },
  {
    id: 'esp-zumaya',
    name: 'ZUMAYA',
    flag: 'ESP',
  },
  {
    id: 'esp-pasajes',
    name: 'PASAJES',
    flag: 'ESP',
  },
  {
    id: 'fra-saintlouisdurhone',
    name: 'SAINT LOUIS DU RHONE',
    flag: 'FRA',
  },
  {
    id: 'nld-kootstertille',
    name: 'KOOTSTERTILLE',
    flag: 'NLD',
  },
  {
    id: 'ita-portofino',
    name: 'PORTOFINO',
    flag: 'ITA',
  },
  {
    id: 'nor-roan',
    name: 'ROAN',
    flag: 'NOR',
  },
  {
    id: 'nor-glomfjord',
    name: 'GLOMFJORD',
    flag: 'NOR',
  },
  {
    id: 'hrv-bol',
    name: 'BOL',
    flag: 'HRV',
  },
  {
    id: 'aus-onslow',
    name: 'ONSLOW',
    flag: 'AUS',
  },
  {
    id: 'idn-samarinda',
    name: 'SAMARINDA',
    flag: 'IDN',
  },
  {
    id: 'chn-ningde',
    name: 'NINGDE',
    flag: 'CHN',
  },
  {
    id: 'jpn-meishikimi',
    name: 'MEISHIKIMI',
    flag: 'JPN',
  },
  {
    id: 'ago-namibe',
    name: 'NAMIBE',
    flag: 'AGO',
  },
  {
    id: 'nor-kjopsvik',
    name: 'KJOPSVIK',
    flag: 'NOR',
  },
  {
    id: 'moz-portoamelia',
    name: 'PORTO AMELIA',
    flag: 'MOZ',
  },
  {
    id: 'are-ruwais',
    name: 'RUWAIS',
    flag: 'ARE',
  },
  {
    id: 'jpn-yoshiumi',
    name: 'YOSHIUMI',
    flag: 'JPN',
  },
  {
    id: 'grl-uummannaq',
    name: 'UUMMANNAQ',
    flag: 'GRL',
  },
  {
    id: 'deu-baltrum',
    name: 'BALTRUM',
    flag: 'DEU',
  },
  {
    id: 'aus-townsville',
    name: 'TOWNSVILLE',
    flag: 'AUS',
  },
  {
    id: 'bra-santosbasin',
    name: 'SANTOS BASIN',
    flag: 'BRA',
  },
  {
    id: 'can-portweller',
    name: 'PORT WELLER',
    flag: 'CAN',
  },
  {
    id: 'bel-turnhout',
    name: 'TURNHOUT',
    flag: 'BEL',
  },
  {
    id: 'deu-leer',
    name: 'LEER',
    flag: 'DEU',
  },
  {
    id: 'aze-qaradagh',
    name: 'QARADAGH',
    flag: 'AZE',
  },
  {
    id: 'idn-banda',
    name: 'BANDA',
    flag: 'IDN',
  },
  {
    id: 'bmu-kingswharf',
    name: 'KINGS WHARF',
    flag: 'BMU',
  },
  {
    id: 'mys-kertih',
    name: 'KERTIH',
    flag: 'MYS',
  },
  {
    id: 'isl-hafnarfjordur',
    name: 'HAFNARFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'swe-fyrudden',
    name: 'FYRUDDEN',
    flag: 'SWE',
  },
  {
    id: 'usa-perthamboy',
    name: 'PERTH AMBOY',
    flag: 'USA',
  },
  {
    id: 'rus-pamyatparizhskoy',
    name: 'PAMYAT PARIZHSKOY',
    flag: 'RUS',
  },
  {
    id: 'usa-tiburon',
    name: 'TIBURON',
    flag: 'USA',
  },
  {
    id: 'nld-grou',
    name: 'GROU',
    flag: 'NLD',
  },
  {
    id: 'can-ganges',
    name: 'GANGES',
    flag: 'CAN',
  },
  {
    id: 'usa-westbradenton',
    name: 'WEST BRADENTON',
    flag: 'USA',
  },
  {
    id: 'ury-nuevapalmira',
    name: 'NUEVA PALMIRA',
    flag: 'URY',
  },
  {
    id: 'esp-corralejo',
    name: 'CORRALEJO',
    flag: 'ESP',
  },
  {
    id: 'prt-cascais',
    name: 'CASCAIS',
    flag: 'PRT',
  },
  {
    id: 'esp-tarifa',
    name: 'TARIFA',
    flag: 'ESP',
  },
  {
    id: 'gbr-poole',
    name: 'POOLE',
    flag: 'GBR',
  },
  {
    id: 'deu-schweinfurt',
    name: 'SCHWEINFURT',
    flag: 'DEU',
  },
  {
    id: 'deu-regensburg',
    name: 'REGENSBURG',
    flag: 'DEU',
  },
  {
    id: 'nor-skrova',
    name: 'SKROVA',
    flag: 'NOR',
  },
  {
    id: 'tur-gulluk',
    name: 'GULLUK',
    flag: 'TUR',
  },
  {
    id: 'vnm-danang',
    name: 'DA NANG',
    flag: 'VNM',
  },
  {
    id: 'aus-porthedland',
    name: 'PORT HEDLAND',
    flag: 'AUS',
  },
  {
    id: 'twn-kaohsiung',
    name: 'KAOHSIUNG',
    flag: 'TWN',
  },
  {
    id: 'nor-kristiansand',
    name: 'KRISTIANSAND',
    flag: 'NOR',
  },
  {
    id: 'dnk-frederiksvaerk',
    name: 'FREDERIKSVAERK',
    flag: 'DNK',
  },
  {
    id: 'rus-novorossiysk',
    name: 'NOVOROSSIYSK',
    flag: 'RUS',
  },
  {
    id: 'chn-songxia',
    name: 'SONGXIA',
    flag: 'CHN',
  },
  {
    id: 'usa-lahainaanchorage',
    name: 'LAHAINA ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'phl-balayan',
    name: 'BALAYAN',
    flag: 'PHL',
  },
  {
    id: 'ind-alanganchorage',
    name: 'ALANG ANCHORAGE',
    flag: 'IND',
  },
  {
    id: 'chn-nanpenglieisland',
    name: 'NANPENGLIE ISLAND',
    flag: 'CHN',
  },
  {
    id: 'irl-arklow',
    name: 'ARKLOW',
    flag: 'IRL',
  },
  {
    id: 'mar-tangier',
    name: 'TANGIER',
    flag: 'MAR',
  },
  {
    id: 'gbr-portbury',
    name: 'PORTBURY',
    flag: 'GBR',
  },
  {
    id: 'ita-oristano',
    name: 'ORISTANO',
    flag: 'ITA',
  },
  {
    id: 'fin-pargas',
    name: 'PARGAS',
    flag: 'FIN',
  },
  {
    id: 'jpn-hakata',
    name: 'HAKATA',
    flag: 'JPN',
  },
  {
    id: 'rus-rudnayapristan',
    name: 'RUDNAYA PRISTAN',
    flag: 'RUS',
  },
  {
    id: 'usa-gc743platform',
    name: 'GC 743 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'swe-skalderviken',
    name: 'SKALDERVIKEN',
    flag: 'SWE',
  },
  {
    id: 'rus-lesosibirsk',
    name: 'LESOSIBIRSK',
    flag: 'RUS',
  },
  {
    id: 'stp-saotome',
    name: 'SAO TOME',
    flag: 'STP',
  },
  {
    id: 'atg-fiveislandsvillage',
    name: 'FIVE ISLANDS VILLAGE',
    flag: 'ATG',
  },
  {
    id: 'nld-arnhem',
    name: 'ARNHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-haaften',
    name: 'HAAFTEN',
    flag: 'NLD',
  },
  {
    id: 'usa-astoria',
    name: 'ASTORIA',
    flag: 'USA',
  },
  {
    id: 'esp-puertodelrosario',
    name: 'PUERTO DEL ROSARIO',
    flag: 'ESP',
  },
  {
    id: 'mar-nador',
    name: 'NADOR',
    flag: 'MAR',
  },
  {
    id: 'gbr-heysham',
    name: 'HEYSHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-scarborough',
    name: 'SCARBOROUGH',
    flag: 'GBR',
  },
  {
    id: 'fra-bastia',
    name: 'BASTIA',
    flag: 'FRA',
  },
  {
    id: 'ita-trapani',
    name: 'TRAPANI',
    flag: 'ITA',
  },
  {
    id: 'ita-brucoli',
    name: 'BRUCOLI',
    flag: 'ITA',
  },
  {
    id: 'hrv-velaluka',
    name: 'VELA LUKA',
    flag: 'HRV',
  },
  {
    id: 'swe-stavsnas',
    name: 'STAVSNAS',
    flag: 'SWE',
  },
  {
    id: 'ala-krokarna',
    name: 'KROKARNA',
    flag: 'ALA',
  },
  {
    id: 'rou-braila',
    name: 'BRAILA',
    flag: 'ROU',
  },
  {
    id: 'irq-ummqasr',
    name: 'UMM QASR',
    flag: 'IRQ',
  },
  {
    id: 'aus-mandurah',
    name: 'MANDURAH',
    flag: 'AUS',
  },
  {
    id: 'chn-weitou',
    name: 'WEITOU',
    flag: 'CHN',
  },
  {
    id: 'jpn-kure',
    name: 'KURE',
    flag: 'JPN',
  },
  {
    id: 'jpn-hibi',
    name: 'HIBI',
    flag: 'JPN',
  },
  {
    id: 'aus-gove',
    name: 'GOVE',
    flag: 'AUS',
  },
  {
    id: 'jpn-shimoda',
    name: 'SHIMODA',
    flag: 'JPN',
  },
  {
    id: 'nzl-westport',
    name: 'WESTPORT',
    flag: 'NZL',
  },
  {
    id: 'fra-lepalais',
    name: 'LE PALAIS',
    flag: 'FRA',
  },
  {
    id: 'isl-stykkisholmur',
    name: 'STYKKISHOLMUR',
    flag: 'ISL',
  },
  {
    id: 'gbr-margateanchorage',
    name: 'MARGATE ANCHORAGE',
    flag: 'GBR',
  },
  {
    id: 'nga-escravosoilterminal',
    name: 'ESCRAVOS OIL TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'gnq-ceibaterminal',
    name: 'CEIBA TERMINAL',
    flag: 'GNQ',
  },
  {
    id: 'pan-lascumbres',
    name: 'LAS CUMBRES',
    flag: 'PAN',
  },
  {
    id: 'esp-cangas',
    name: 'CANGAS',
    flag: 'ESP',
  },
  {
    id: 'fra-lanildut',
    name: 'LANILDUT',
    flag: 'FRA',
  },
  {
    id: 'gbr-whitstable',
    name: 'WHITSTABLE',
    flag: 'GBR',
  },
  {
    id: 'fra-wingles',
    name: 'WINGLES',
    flag: 'FRA',
  },
  {
    id: 'ita-calagonone',
    name: 'CALA GONONE',
    flag: 'ITA',
  },
  {
    id: 'deu-hiddensee',
    name: 'HIDDENSEE',
    flag: 'DEU',
  },
  {
    id: 'chn-taohua',
    name: 'TAOHUA',
    flag: 'CHN',
  },
  {
    id: 'usa-kc875platform',
    name: 'KC875 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-follansbee',
    name: 'FOLLANSBEE',
    flag: 'USA',
  },
  {
    id: 'usa-southwestharbor',
    name: 'SOUTHWEST HARBOR',
    flag: 'USA',
  },
  {
    id: 'dnk-holbaek',
    name: 'HOLBAEK',
    flag: 'DNK',
  },
  {
    id: 'srb-novisad',
    name: 'NOVI SAD',
    flag: 'SRB',
  },
  {
    id: 'ukr-zaporizhia',
    name: 'ZAPORIZHIA',
    flag: 'UKR',
  },
  {
    id: 'esp-villagarcia',
    name: 'VILLAGARCIA',
    flag: 'ESP',
  },
  {
    id: 'grc-koroni',
    name: 'KORONI',
    flag: 'GRC',
  },
  {
    id: 'hun-vac',
    name: 'VAC',
    flag: 'HUN',
  },
  {
    id: 'can-alertbay',
    name: 'ALERT BAY',
    flag: 'CAN',
  },
  {
    id: 'glp-bouillante',
    name: 'BOUILLANTE',
    flag: 'GLP',
  },
  {
    id: 'irl-dingle',
    name: 'DINGLE',
    flag: 'IRL',
  },
  {
    id: 'nor-floro',
    name: 'FLORO',
    flag: 'NOR',
  },
  {
    id: 'bel-thiange',
    name: 'THIANGE',
    flag: 'BEL',
  },
  {
    id: 'fra-rhinau',
    name: 'RHINAU',
    flag: 'FRA',
  },
  {
    id: 'deu-oldenburg',
    name: 'OLDENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-badwimpfen',
    name: 'BAD WIMPFEN',
    flag: 'DEU',
  },
  {
    id: 'cmr-douala',
    name: 'DOUALA',
    flag: 'CMR',
  },
  {
    id: 'ita-arbatax',
    name: 'ARBATAX',
    flag: 'ITA',
  },
  {
    id: 'hrv-biogradnamoru',
    name: 'BIOGRAD NA MORU',
    flag: 'HRV',
  },
  {
    id: 'bgr-ruse',
    name: 'RUSE',
    flag: 'BGR',
  },
  {
    id: 'tur-cesme',
    name: 'CESME',
    flag: 'TUR',
  },
  {
    id: 'rus-vyborg',
    name: 'VYBORG',
    flag: 'RUS',
  },
  {
    id: 'kor-daesan',
    name: 'DAESAN',
    flag: 'KOR',
  },
  {
    id: 'can-penderharbour',
    name: 'PENDER HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'chl-portaguirre',
    name: 'PORT AGUIRRE',
    flag: 'CHL',
  },
  {
    id: 'isl-sandgerdi',
    name: 'SANDGERDI',
    flag: 'ISL',
  },
  {
    id: 'nld-schiermonnikoog',
    name: 'SCHIERMONNIKOOG',
    flag: 'NLD',
  },
  {
    id: 'jpn-susaki',
    name: 'SUSAKI',
    flag: 'JPN',
  },
  {
    id: 'ven-laguaira',
    name: 'LA GUAIRA',
    flag: 'VEN',
  },
  {
    id: 'hrv-rukavac',
    name: 'RUKAVAC',
    flag: 'HRV',
  },
  {
    id: 'bra-pecem',
    name: 'PECEM',
    flag: 'BRA',
  },
  {
    id: 'chn-dandong',
    name: 'DAN DONG',
    flag: 'CHN',
  },
  {
    id: 'usa-ballenaisle',
    name: 'BALLENA ISLE',
    flag: 'USA',
  },
  {
    id: 'cub-guantanamo',
    name: 'GUANTANAMO',
    flag: 'CUB',
  },
  {
    id: 'mar-casablanca',
    name: 'CASABLANCA',
    flag: 'MAR',
  },
  {
    id: 'nld-oudbeijerland',
    name: 'OUD BEIJERLAND',
    flag: 'NLD',
  },
  {
    id: 'nor-sandefjord',
    name: 'SANDEFJORD',
    flag: 'NOR',
  },
  {
    id: 'ita-positano',
    name: 'POSITANO',
    flag: 'ITA',
  },
  {
    id: 'grc-spetses',
    name: 'SPETSES',
    flag: 'GRC',
  },
  {
    id: 'eri-massawa',
    name: 'MASSAWA',
    flag: 'ERI',
  },
  {
    id: 'usa-clintonharbor',
    name: 'CLINTON HARBOR',
    flag: 'USA',
  },
  {
    id: 'nld-heerjansdam',
    name: 'HEERJANSDAM',
    flag: 'NLD',
  },
  {
    id: 'ita-santamarinella',
    name: 'SANTA MARINELLA',
    flag: 'ITA',
  },
  {
    id: 'hrv-polace',
    name: 'POLACE',
    flag: 'HRV',
  },
  {
    id: 'hun-komarno',
    name: 'KOMARNO',
    flag: 'HUN',
  },
  {
    id: 'kir-london',
    name: 'LONDON',
    flag: 'KIR',
  },
  {
    id: 'swe-figeholm',
    name: 'FIGEHOLM',
    flag: 'SWE',
  },
  {
    id: 'cub-guayabal',
    name: 'GUAYABAL',
    flag: 'CUB',
  },
  {
    id: 'phl-malita',
    name: 'MALITA',
    flag: 'PHL',
  },
  {
    id: 'nor-vatlandsvaag',
    name: 'VATLANDSVAAG',
    flag: 'NOR',
  },
  {
    id: 'usa-portangeles',
    name: 'PORT ANGELES',
    flag: 'USA',
  },
  {
    id: 'can-squamish',
    name: 'SQUAMISH',
    flag: 'CAN',
  },
  {
    id: 'usa-angelisland',
    name: 'ANGEL ISLAND',
    flag: 'USA',
  },
  {
    id: 'bra-manaus',
    name: 'MANAUS',
    flag: 'BRA',
  },
  {
    id: 'deu-burgauffehmarn',
    name: 'BURG AUF FEHMARN',
    flag: 'DEU',
  },
  {
    id: 'fin-reposaari',
    name: 'REPOSAARI',
    flag: 'FIN',
  },
  {
    id: 'sau-yanbuindustrial',
    name: 'YANBU INDUSTRIAL',
    flag: 'SAU',
  },
  {
    id: 'myt-longoni',
    name: 'LONGONI',
    flag: 'MYT',
  },
  {
    id: 'chn-doumen',
    name: 'DOUMEN',
    flag: 'CHN',
  },
  {
    id: 'idn-tanjungbenete',
    name: 'TANJUNG BENETE',
    flag: 'IDN',
  },
  {
    id: 'chn-zhoushan',
    name: 'ZHOUSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-weihai',
    name: 'WEIHAI',
    flag: 'CHN',
  },
  {
    id: 'kor-hamori',
    name: 'HAMORI',
    flag: 'KOR',
  },
  {
    id: 'kor-guryongpo',
    name: 'GURYONGPO',
    flag: 'KOR',
  },
  {
    id: 'esp-camarinas',
    name: 'CAMARINAS',
    flag: 'ESP',
  },
  {
    id: 'nor-tonsberg',
    name: 'TONSBERG',
    flag: 'NOR',
  },
  {
    id: 'nor-fredvang',
    name: 'FREDVANG',
    flag: 'NOR',
  },
  {
    id: 'lbn-zahrani',
    name: 'ZAHRANI',
    flag: 'LBN',
  },
  {
    id: 'idn-nipahanchorage',
    name: 'NIPAH ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: "gab-m'byaoilterminal",
    name: "M'BYA OIL TERMINAL",
    flag: 'GAB',
  },
  {
    id: 'rus-shalskii',
    name: 'SHALSKII',
    flag: 'RUS',
  },
  {
    id: 'can-summerside',
    name: 'SUMMERSIDE',
    flag: 'CAN',
  },
  {
    id: 'per-samanco',
    name: 'SAMANCO',
    flag: 'PER',
  },
  {
    id: 'abw-sannicolas',
    name: 'SAN NICOLAS',
    flag: 'ABW',
  },
  {
    id: 'isl-nordufjordur',
    name: 'NORDUFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'irl-greenore',
    name: 'GREENORE',
    flag: 'IRL',
  },
  {
    id: 'nld-kortgene',
    name: 'KORTGENE',
    flag: 'NLD',
  },
  {
    id: 'nzl-gisborne',
    name: 'GISBORNE',
    flag: 'NZL',
  },
  {
    id: "usa-captain'scove",
    name: "CAPTAIN'S COVE",
    flag: 'USA',
  },
  {
    id: 'nic-rama',
    name: 'RAMA',
    flag: 'NIC',
  },
  {
    id: 'rou-moldovaveche',
    name: 'MOLDOVA VECHE',
    flag: 'ROU',
  },
  {
    id: 'jpn-anegasaki',
    name: 'ANEGASAKI',
    flag: 'JPN',
  },
  {
    id: 'usa-paulsboro',
    name: 'PAULSBORO',
    flag: 'USA',
  },
  {
    id: 'usa-stockton',
    name: 'STOCKTON',
    flag: 'USA',
  },
  {
    id: 'usa-bourg',
    name: 'BOURG',
    flag: 'USA',
  },
  {
    id: 'usa-clearwater',
    name: 'CLEARWATER',
    flag: 'USA',
  },
  {
    id: 'usa-verobeach',
    name: 'VERO BEACH',
    flag: 'USA',
  },
  {
    id: 'esp-puertodesantiago',
    name: 'PUERTO DE SANTIAGO',
    flag: 'ESP',
  },
  {
    id: 'gbr-brodick',
    name: 'BRODICK',
    flag: 'GBR',
  },
  {
    id: 'esp-vinaros',
    name: 'VINAROS',
    flag: 'ESP',
  },
  {
    id: 'nld-capelleaanijssel',
    name: 'CAPELLE AAN IJSSEL',
    flag: 'NLD',
  },
  {
    id: 'nld-doetinchem',
    name: 'DOETINCHEM',
    flag: 'NLD',
  },
  {
    id: 'deu-badbevensen',
    name: 'BAD BEVENSEN',
    flag: 'DEU',
  },
  {
    id: 'nor-papper',
    name: 'PAPPER',
    flag: 'NOR',
  },
  {
    id: 'dnk-stubbekobing',
    name: 'STUBBEKOBING',
    flag: 'DNK',
  },
  {
    id: 'ita-rimini',
    name: 'RIMINI',
    flag: 'ITA',
  },
  {
    id: 'sjm-longyearbyen',
    name: 'LONGYEARBYEN',
    flag: 'SJM',
  },
  {
    id: 'khm-sihanoukville',
    name: 'SIHANOUKVILLE',
    flag: 'KHM',
  },
  {
    id: 'idn-semarang',
    name: 'SEMARANG',
    flag: 'IDN',
  },
  {
    id: 'aus-portdenison',
    name: 'PORT DENISON',
    flag: 'AUS',
  },
  {
    id: 'aus-brighton',
    name: 'BRIGHTON',
    flag: 'AUS',
  },
  {
    id: 'esp-alcanar',
    name: 'ALCANAR',
    flag: 'ESP',
  },
  {
    id: 'nor-hagavik',
    name: 'HAGAVIK',
    flag: 'NOR',
  },
  {
    id: 'tur-fethiye',
    name: 'FETHIYE',
    flag: 'TUR',
  },
  {
    id: 'idn-pulausambu',
    name: 'PULAU SAMBU',
    flag: 'IDN',
  },
  {
    id: 'twn-niaoyu',
    name: 'NIAOYU',
    flag: 'TWN',
  },
  {
    id: 'jpn-marugame',
    name: 'MARUGAME',
    flag: 'JPN',
  },
  {
    id: 'chn-southkudangdao',
    name: 'SOUTH KUDANGDAO',
    flag: 'CHN',
  },
  {
    id: 'pan-manzanillo',
    name: 'MANZANILLO',
    flag: 'PAN',
  },
  {
    id: 'mys-telokramunia',
    name: 'TELOK RAMUNIA',
    flag: 'MYS',
  },
  {
    id: 'sau-arabiyahfield',
    name: 'ARABIYAH FIELD',
    flag: 'SAU',
  },
  {
    id: 'pri-puertoyabucoa',
    name: 'PUERTO YABUCOA',
    flag: 'PRI',
  },
  {
    id: 'nld-goor',
    name: 'GOOR',
    flag: 'NLD',
  },
  {
    id: 'rus-bereslavka',
    name: 'BERESLAVKA',
    flag: 'RUS',
  },
  {
    id: 'usa-eaglehill',
    name: 'EAGLE HILL',
    flag: 'USA',
  },
  {
    id: 'tur-yakakoy',
    name: 'YAKAKOY',
    flag: 'TUR',
  },
  {
    id: 'ind-hutbay',
    name: 'HUTBAY',
    flag: 'IND',
  },
  {
    id: 'jpn-kokura',
    name: 'KOKURA',
    flag: 'JPN',
  },
  {
    id: 'usa-sealbeach',
    name: 'SEAL BEACH',
    flag: 'USA',
  },
  {
    id: 'grc-antiparosanchorage',
    name: 'ANTIPAROS ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'mys-sungailinggi',
    name: 'SUNGAI LINGGI',
    flag: 'MYS',
  },
  {
    id: 'gbr-crinan',
    name: 'CRINAN',
    flag: 'GBR',
  },
  {
    id: 'pak-gwadar',
    name: 'GWADAR',
    flag: 'PAK',
  },
  {
    id: 'usa-keybiscayne',
    name: 'KEY BISCAYNE',
    flag: 'USA',
  },
  {
    id: 'can-matane',
    name: 'MATANE',
    flag: 'CAN',
  },
  {
    id: 'bra-santana',
    name: 'SANTANA',
    flag: 'BRA',
  },
  {
    id: 'esp-sanlucardebarra',
    name: 'SANLUCAR DE BARRA',
    flag: 'ESP',
  },
  {
    id: 'fra-argelers',
    name: 'ARGELERS',
    flag: 'FRA',
  },
  {
    id: 'fra-arles',
    name: 'ARLES',
    flag: 'FRA',
  },
  {
    id: 'deu-genthin',
    name: 'GENTHIN',
    flag: 'DEU',
  },
  {
    id: 'swe-hollviksnas',
    name: 'HOLLVIKSNAS',
    flag: 'SWE',
  },
  {
    id: 'deu-vierow',
    name: 'VIEROW',
    flag: 'DEU',
  },
  {
    id: 'ita-taranto',
    name: 'TARANTO',
    flag: 'ITA',
  },
  {
    id: 'grc-chania',
    name: 'CHANIA',
    flag: 'GRC',
  },
  {
    id: 'twn-longmen',
    name: 'LONG MEN',
    flag: 'TWN',
  },
  {
    id: 'jpn-takamatsu',
    name: 'TAKAMATSU',
    flag: 'JPN',
  },
  {
    id: 'rus-zolotaya',
    name: 'ZOLOTAYA',
    flag: 'RUS',
  },
  {
    id: 'aus-ballina',
    name: 'BALLINA',
    flag: 'AUS',
  },
  {
    id: 'png-buka',
    name: 'BUKA',
    flag: 'PNG',
  },
  {
    id: 'nzl-whangaroa',
    name: 'WHANGAROA',
    flag: 'NZL',
  },
  {
    id: 'ago-portoamboim',
    name: 'PORTO AMBOIM',
    flag: 'AGO',
  },
  {
    id: 'bra-saoluis',
    name: 'SAO LUIS',
    flag: 'BRA',
  },
  {
    id: 'dnk-danfield',
    name: 'DAN FIELD',
    flag: 'DNK',
  },
  {
    id: 'gbr-montrose',
    name: 'MONTROSE',
    flag: 'GBR',
  },
  {
    id: 'swe-skarhamn',
    name: 'SKARHAMN',
    flag: 'SWE',
  },
  {
    id: 'rus-arkhangelsk',
    name: 'ARKHANGELSK',
    flag: 'RUS',
  },
  {
    id: 'chn-xingcheng',
    name: 'XINGCHENG',
    flag: 'CHN',
  },
  {
    id: 'gbr-sunderland',
    name: 'SUNDERLAND',
    flag: 'GBR',
  },
  {
    id: 'nor-averoy',
    name: 'AVEROY',
    flag: 'NOR',
  },
  {
    id: 'jpn-hakodate',
    name: 'HAKODATE',
    flag: 'JPN',
  },
  {
    id: 'phl-naga',
    name: 'NAGA',
    flag: 'PHL',
  },
  {
    id: 'usa-chicago',
    name: 'CHICAGO',
    flag: 'USA',
  },
  {
    id: 'bra-gebig',
    name: 'GEBIG',
    flag: 'BRA',
  },
  {
    id: 'mex-puertopenasco',
    name: 'PUERTO PENASCO',
    flag: 'MEX',
  },
  {
    id: 'usa-deerharbor',
    name: 'DEER HARBOR',
    flag: 'USA',
  },
  {
    id: 'swe-ballstaviken',
    name: 'BALLSTAVIKEN',
    flag: 'SWE',
  },
  {
    id: 'swe-smaengsviken',
    name: 'SMAENGSVIKEN',
    flag: 'SWE',
  },
  {
    id: 'pyf-huahine',
    name: 'HUAHINE',
    flag: 'PYF',
  },
  {
    id: 'pcn-adamstown',
    name: 'ADAMSTOWN',
    flag: 'PCN',
  },
  {
    id: 'can-nanaimo',
    name: 'NANAIMO',
    flag: 'CAN',
  },
  {
    id: 'usa-matagorda',
    name: 'MATAGORDA',
    flag: 'USA',
  },
  {
    id: 'tca-grandturk',
    name: 'GRAND TURK',
    flag: 'TCA',
  },
  {
    id: 'chl-mejillones',
    name: 'MEJILLONES',
    flag: 'CHL',
  },
  {
    id: 'arg-puertodeseado',
    name: 'PUERTO DESEADO',
    flag: 'ARG',
  },
  {
    id: 'mtq-saintpierre',
    name: 'SAINT PIERRE',
    flag: 'MTQ',
  },
  {
    id: 'bra-saosebastiao',
    name: 'SAO SEBASTIAO',
    flag: 'BRA',
  },
  {
    id: 'esp-santander',
    name: 'SANTANDER',
    flag: 'ESP',
  },
  {
    id: 'gbr-sainthelens',
    name: 'SAINT HELENS',
    flag: 'GBR',
  },
  {
    id: 'esp-sitges',
    name: 'SITGES',
    flag: 'ESP',
  },
  {
    id: 'cod-boma',
    name: 'BOMA',
    flag: 'COD',
  },
  {
    id: 'swe-solvesborg',
    name: 'SOLVESBORG',
    flag: 'SWE',
  },
  {
    id: 'grc-patras',
    name: 'PATRAS',
    flag: 'GRC',
  },
  {
    id: 'zaf-portelizabeth',
    name: 'PORT ELIZABETH',
    flag: 'ZAF',
  },
  {
    id: 'grc-amorgos',
    name: 'AMORGOS',
    flag: 'GRC',
  },
  {
    id: 'mys-penang',
    name: 'PENANG',
    flag: 'MYS',
  },
  {
    id: 'idn-pontianak',
    name: 'PONTIANAK',
    flag: 'IDN',
  },
  {
    id: 'chn-jingtang',
    name: 'JINGTANG',
    flag: 'CHN',
  },
  {
    id: 'idn-pomako',
    name: 'POMAKO',
    flag: 'IDN',
  },
  {
    id: 'jpn-miyako',
    name: 'MIYAKO',
    flag: 'JPN',
  },
  {
    id: 'usa-palmshores',
    name: 'PALM SHORES',
    flag: 'USA',
  },
  {
    id: 'esp-lesbotigues',
    name: 'LES BOTIGUES',
    flag: 'ESP',
  },
  {
    id: 'swe-gronemads',
    name: 'GRONEMADS',
    flag: 'SWE',
  },
  {
    id: 'chn-qidong',
    name: 'QIDONG',
    flag: 'CHN',
  },
  {
    id: 'ita-savona',
    name: 'SAVONA',
    flag: 'ITA',
  },
  {
    id: 'tha-rayong',
    name: 'RAYONG',
    flag: 'THA',
  },
  {
    id: 'mdv-thilafushi',
    name: 'THILAFUSHI',
    flag: 'MDV',
  },
  {
    id: 'egy-sokhna',
    name: 'SOKHNA',
    flag: 'EGY',
  },
  {
    id: 'gbr-rosyth',
    name: 'ROSYTH',
    flag: 'GBR',
  },
  {
    id: 'nor-manger',
    name: 'MANGER',
    flag: 'NOR',
  },
  {
    id: 'gnq-puntaeuropa',
    name: 'PUNTA EUROPA',
    flag: 'GNQ',
  },
  {
    id: 'deu-flensburg',
    name: 'FLENSBURG',
    flag: 'DEU',
  },
  {
    id: 'rus-vytegraanchorage',
    name: 'VYTEGRA ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'grc-kythira',
    name: 'KYTHIRA',
    flag: 'GRC',
  },
  {
    id: 'grc-pachi',
    name: 'PACHI',
    flag: 'GRC',
  },
  {
    id: 'jam-portrhoades',
    name: 'PORT RHOADES',
    flag: 'JAM',
  },
  {
    id: 'nld-veere',
    name: 'VEERE',
    flag: 'NLD',
  },
  {
    id: 'aus-portmacquarie',
    name: 'PORT MACQUARIE',
    flag: 'AUS',
  },
  {
    id: 'usa-herringtonnorth',
    name: 'HERRINGTON NORTH',
    flag: 'USA',
  },
  {
    id: 'deu-itzehoe',
    name: 'ITZEHOE',
    flag: 'DEU',
  },
  {
    id: 'hnd-frenchharbor',
    name: 'FRENCH HARBOR',
    flag: 'HND',
  },
  {
    id: 'gbr-houndpointterminal',
    name: 'HOUND POINT TERMINAL',
    flag: 'GBR',
  },
  {
    id: 'nld-drachten',
    name: 'DRACHTEN',
    flag: 'NLD',
  },
  {
    id: 'rus-boshnyakovoanchorage',
    name: 'BOSHNYAKOVO ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'aus-hopeisland',
    name: 'HOPE ISLAND',
    flag: 'AUS',
  },
  {
    id: 'atg-crabbs',
    name: 'CRABBS',
    flag: 'ATG',
  },
  {
    id: 'rus-belayagora',
    name: 'BELAYA GORA',
    flag: 'RUS',
  },
  {
    id: 'fra-caen',
    name: 'CAEN',
    flag: 'FRA',
  },
  {
    id: 'pan-gatunlakeanchorage',
    name: 'GATUN LAKE ANCHORAGE',
    flag: 'PAN',
  },
  {
    id: 'cub-nuevitas',
    name: 'NUEVITAS',
    flag: 'CUB',
  },
  {
    id: 'usa-blockisland',
    name: 'BLOCK ISLAND',
    flag: 'USA',
  },
  {
    id: 'ury-puntadeleste',
    name: 'PUNTA DEL ESTE',
    flag: 'URY',
  },
  {
    id: 'gbr-portellen',
    name: 'PORT ELLEN',
    flag: 'GBR',
  },
  {
    id: 'gbr-cardiff',
    name: 'CARDIFF',
    flag: 'GBR',
  },
  {
    id: 'fra-capbreton',
    name: 'CAPBRETON',
    flag: 'FRA',
  },
  {
    id: 'gbr-lowestoft',
    name: 'LOWESTOFT',
    flag: 'GBR',
  },
  {
    id: 'nor-skogsvagen',
    name: 'SKOGSVAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-flekkeroy',
    name: 'FLEKKEROY',
    flag: 'NOR',
  },
  {
    id: 'deu-beidenfleth',
    name: 'BEIDENFLETH',
    flag: 'DEU',
  },
  {
    id: 'deu-bamberg',
    name: 'BAMBERG',
    flag: 'DEU',
  },
  {
    id: 'swe-vrango',
    name: 'VRANGO',
    flag: 'SWE',
  },
  {
    id: 'grc-lefkada',
    name: 'LEFKADA',
    flag: 'GRC',
  },
  {
    id: 'rus-vistino',
    name: 'VISTINO',
    flag: 'RUS',
  },
  {
    id: 'irn-anzali',
    name: 'ANZALI',
    flag: 'IRN',
  },
  {
    id: 'syc-portvictoria',
    name: 'PORT VICTORIA',
    flag: 'SYC',
  },
  {
    id: 'aus-fremantle',
    name: 'FREMANTLE',
    flag: 'AUS',
  },
  {
    id: 'chn-nanao',
    name: 'NANAO',
    flag: 'CHN',
  },
  {
    id: 'flk-stanley',
    name: 'STANLEY',
    flag: 'FLK',
  },
  {
    id: 'gbr-londonderryanchorage',
    name: 'LONDONDERRY ANCHORAGE',
    flag: 'GBR',
  },
  {
    id: 'nor-ulsteinvik',
    name: 'ULSTEINVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-hansnes',
    name: 'HANSNES',
    flag: 'NOR',
  },
  {
    id: 'grc-elefsis',
    name: 'ELEFSIS',
    flag: 'GRC',
  },
  {
    id: 'phl-lucena',
    name: 'LUCENA',
    flag: 'PHL',
  },
  {
    id: 'arg-puertomadryn',
    name: 'PUERTO MADRYN',
    flag: 'ARG',
  },
  {
    id: 'kna-stkitts',
    name: 'ST KITTS',
    flag: 'KNA',
  },
  {
    id: 'are-fujairah',
    name: 'FUJAIRAH',
    flag: 'ARE',
  },
  {
    id: 'idn-kalbut',
    name: 'KALBUT',
    flag: 'IDN',
  },
  {
    id: 'chn-daluisland',
    name: 'DALU ISLAND',
    flag: 'CHN',
  },
  {
    id: 'cod-block31',
    name: 'BLOCK 31',
    flag: 'COD',
  },
  {
    id: 'usa-oakharbor',
    name: 'OAK HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-belfastcity',
    name: 'BELFAST CITY',
    flag: 'USA',
  },
  {
    id: 'prt-lagos',
    name: 'LAGOS',
    flag: 'PRT',
  },
  {
    id: 'prt-albufeira',
    name: 'ALBUFEIRA',
    flag: 'PRT',
  },
  {
    id: 'hrv-novigrad',
    name: 'NOVIGRAD',
    flag: 'HRV',
  },
  {
    id: 'aus-mackay',
    name: 'MACKAY',
    flag: 'AUS',
  },
  {
    id: 'ita-porteponteromano',
    name: 'PORTE PONTE ROMANO',
    flag: 'ITA',
  },
  {
    id: 'usa-perthamboyanchorage',
    name: 'PERTH AMBOY ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'idn-pengambengan',
    name: 'PENGAMBENGAN',
    flag: 'IDN',
  },
  {
    id: 'usa-richmond',
    name: 'RICHMOND',
    flag: 'USA',
  },
  {
    id: 'bhs-marshharbour',
    name: 'MARSH HARBOUR',
    flag: 'BHS',
  },
  {
    id: 'chl-lirquen',
    name: 'LIRQUEN',
    flag: 'CHL',
  },
  {
    id: 'pri-islapalominos',
    name: 'ISLA PALOMINOS',
    flag: 'PRI',
  },
  {
    id: 'bra-juruti',
    name: 'JURUTI',
    flag: 'BRA',
  },
  {
    id: 'esp-sanandres',
    name: 'SAN ANDRES',
    flag: 'ESP',
  },
  {
    id: 'isl-porshofn',
    name: 'PORSHOFN',
    flag: 'ISL',
  },
  {
    id: 'prt-peniche',
    name: 'PENICHE',
    flag: 'PRT',
  },
  {
    id: 'gbr-swansea',
    name: 'SWANSEA',
    flag: 'GBR',
  },
  {
    id: 'fra-binic',
    name: 'BINIC',
    flag: 'FRA',
  },
  {
    id: 'deu-wolfsburg',
    name: 'WOLFSBURG',
    flag: 'DEU',
  },
  {
    id: 'swe-stenungsund',
    name: 'STENUNGSUND',
    flag: 'SWE',
  },
  {
    id: 'hun-szazhalombatta',
    name: 'SZAZHALOMBATTA',
    flag: 'HUN',
  },
  {
    id: 'are-portrashid',
    name: 'PORT RASHID',
    flag: 'ARE',
  },
  {
    id: 'idn-karimunbesaranchorage',
    name: 'KARIMUNBESAR ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'chn-huangshi',
    name: 'HUANGSHI',
    flag: 'CHN',
  },
  {
    id: 'jpn-naze',
    name: 'NAZE',
    flag: 'JPN',
  },
  {
    id: 'aus-forster',
    name: 'FORSTER',
    flag: 'AUS',
  },
  {
    id: 'nzl-porirua',
    name: 'PORIRUA',
    flag: 'NZL',
  },
  {
    id: 'dnk-stigsnaes',
    name: 'STIGSNAES',
    flag: 'DNK',
  },
  {
    id: 'bes-sinteustatius',
    name: 'SINT EUSTATIUS',
    flag: 'BES',
  },
  {
    id: 'nga-bonnyterminal',
    name: 'BONNY TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'usa-crescentcity',
    name: 'CRESCENT CITY',
    flag: 'USA',
  },
  {
    id: 'tto-labrea',
    name: 'LA BREA',
    flag: 'TTO',
  },
  {
    id: 'gbr-hunterston',
    name: 'HUNTERSTON',
    flag: 'GBR',
  },
  {
    id: 'deu-lahnstein',
    name: 'LAHNSTEIN',
    flag: 'DEU',
  },
  {
    id: 'deu-magdeburg',
    name: 'MAGDEBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-wiek',
    name: 'WIEK',
    flag: 'DEU',
  },
  {
    id: 'bgr-lom',
    name: 'LOM',
    flag: 'BGR',
  },
  {
    id: 'che-birsfelden',
    name: 'BIRSFELDEN',
    flag: 'CHE',
  },
  {
    id: 'ita-sanlorenzoalmare',
    name: 'SAN LORENZO AL MARE',
    flag: 'ITA',
  },
  {
    id: 'aus-maclean',
    name: 'MACLEAN',
    flag: 'AUS',
  },
  {
    id: 'tur-dortyol',
    name: 'DORTYOL',
    flag: 'TUR',
  },
  {
    id: 'bhs-lucaya',
    name: 'LUCAYA',
    flag: 'BHS',
  },
  {
    id: 'jam-riobueno',
    name: 'RIO BUENO',
    flag: 'JAM',
  },
  {
    id: 'gbr-ipswich',
    name: 'IPSWICH',
    flag: 'GBR',
  },
  {
    id: 'nld-stavoren',
    name: 'STAVOREN',
    flag: 'NLD',
  },
  {
    id: 'can-littlecurrent',
    name: 'LITTLE CURRENT',
    flag: 'CAN',
  },
  {
    id: 'nor-engene',
    name: 'ENGENE',
    flag: 'NOR',
  },
  {
    id: 'usa-northamericansh',
    name: 'NORTH AMERICAN SH',
    flag: 'USA',
  },
  {
    id: 'bhs-georgetown',
    name: 'GEORGE TOWN',
    flag: 'BHS',
  },
  {
    id: 'usa-delawarecity',
    name: 'DELAWARE CITY',
    flag: 'USA',
  },
  {
    id: 'arg-puertobelgrano',
    name: 'PUERTO BELGRANO',
    flag: 'ARG',
  },
  {
    id: 'fra-dielette',
    name: 'DIELETTE',
    flag: 'FRA',
  },
  {
    id: 'esp-palmademallorca',
    name: 'PALMA DE MALLORCA',
    flag: 'ESP',
  },
  {
    id: 'nor-bergen',
    name: 'BERGEN',
    flag: 'NOR',
  },
  {
    id: 'deu-munster',
    name: 'MUNSTER',
    flag: 'DEU',
  },
  {
    id: 'dnk-nykobingmors',
    name: 'NYKOBING MORS',
    flag: 'DNK',
  },
  {
    id: 'deu-kuehlungsborn',
    name: 'KUEHLUNGSBORN',
    flag: 'DEU',
  },
  {
    id: 'nor-tjotta',
    name: 'TJOTTA',
    flag: 'NOR',
  },
  {
    id: 'nor-ornes',
    name: 'ORNES',
    flag: 'NOR',
  },
  {
    id: 'ita-laccoameno',
    name: 'LACCO AMENO',
    flag: 'ITA',
  },
  {
    id: 'rou-eselnita',
    name: 'ESELNITA',
    flag: 'ROU',
  },
  {
    id: 'ukr-odessa',
    name: 'ODESSA',
    flag: 'UKR',
  },
  {
    id: 'egy-damietta',
    name: 'DAMIETTA',
    flag: 'EGY',
  },
  {
    id: 'fji-suva',
    name: 'SUVA',
    flag: 'FJI',
  },
  {
    id: 'usa-westbrooktown',
    name: 'WESTBROOK TOWN',
    flag: 'USA',
  },
  {
    id: 'arg-bahiablanca',
    name: 'BAHIA BLANCA',
    flag: 'ARG',
  },
  {
    id: 'esp-alcudia',
    name: 'ALCUDIA',
    flag: 'ESP',
  },
  {
    id: 'nor-knarvik',
    name: 'KNARVIK',
    flag: 'NOR',
  },
  {
    id: 'bhr-hidd',
    name: 'HIDD',
    flag: 'BHR',
  },
  {
    id: 'are-fatehfield',
    name: 'FATEH FIELD',
    flag: 'ARE',
  },
  {
    id: 'pan-colon2000',
    name: 'COLON 2000',
    flag: 'PAN',
  },
  {
    id: 'nld-dinteloord',
    name: 'DINTELOORD',
    flag: 'NLD',
  },
  {
    id: 'hrv-zirje',
    name: 'ZIRJE',
    flag: 'HRV',
  },
  {
    id: 'egy-elhamraoilterminal',
    name: 'EL HAMRA OIL TERMINAL',
    flag: 'EGY',
  },
  {
    id: 'usa-newell',
    name: 'NEWELL',
    flag: 'USA',
  },
  {
    id: 'usa-rochester',
    name: 'ROCHESTER',
    flag: 'USA',
  },
  {
    id: 'nld-vinkeveen',
    name: 'VINKEVEEN',
    flag: 'NLD',
  },
  {
    id: 'dnk-egernsund',
    name: 'EGERNSUND',
    flag: 'DNK',
  },
  {
    id: 'phl-doos',
    name: 'DOOS',
    flag: 'PHL',
  },
  {
    id: 'nor-valevaag',
    name: 'VALEVAAG',
    flag: 'NOR',
  },
  {
    id: 'hrv-marina',
    name: 'MARINA',
    flag: 'HRV',
  },
  {
    id: 'bel-olen',
    name: 'OLEN',
    flag: 'BEL',
  },
  {
    id: 'usa-eastriver',
    name: 'EAST RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-carteret',
    name: 'CARTERET',
    flag: 'USA',
  },
  {
    id: 'svn-lucija',
    name: 'LUCIJA',
    flag: 'SVN',
  },
  {
    id: 'kaz-aktau',
    name: 'AKTAU',
    flag: 'KAZ',
  },
  {
    id: 'bel-roeulx',
    name: 'ROEULX',
    flag: 'BEL',
  },
  {
    id: 'rus-lomonosov',
    name: 'LOMONOSOV',
    flag: 'RUS',
  },
  {
    id: 'nld-oudewater',
    name: 'OUDEWATER',
    flag: 'NLD',
  },
  {
    id: 'swe-kallviken',
    name: 'KALLVIKEN',
    flag: 'SWE',
  },
  {
    id: 'usa-kailuakona',
    name: 'KAILUA KONA',
    flag: 'USA',
  },
  {
    id: 'chl-puertochacabuco',
    name: 'PUERTO CHACABUCO',
    flag: 'CHL',
  },
  {
    id: 'usa-hyannis',
    name: 'HYANNIS',
    flag: 'USA',
  },
  {
    id: 'pri-guayanilla',
    name: 'GUAYANILLA',
    flag: 'PRI',
  },
  {
    id: 'can-shelburne',
    name: 'SHELBURNE',
    flag: 'CAN',
  },
  {
    id: 'msr-littlebay',
    name: 'LITTLE BAY',
    flag: 'MSR',
  },
  {
    id: 'esp-grove',
    name: 'GROVE',
    flag: 'ESP',
  },
  {
    id: 'gbr-oban',
    name: 'OBAN',
    flag: 'GBR',
  },
  {
    id: 'esp-mataro',
    name: 'MATARO',
    flag: 'ESP',
  },
  {
    id: 'nld-breskens',
    name: 'BRESKENS',
    flag: 'NLD',
  },
  {
    id: 'aut-goldworth',
    name: 'GOLDWORTH',
    flag: 'AUT',
  },
  {
    id: 'ita-sorrento',
    name: 'SORRENTO',
    flag: 'ITA',
  },
  {
    id: 'grc-preveza',
    name: 'PREVEZA',
    flag: 'GRC',
  },
  {
    id: 'srb-smederevo',
    name: 'SMEDEREVO',
    flag: 'SRB',
  },
  {
    id: 'nor-tufjord',
    name: 'TUFJORD',
    flag: 'NOR',
  },
  {
    id: 'com-mutsamudu',
    name: 'MUTSAMUDU',
    flag: 'COM',
  },
  {
    id: 'chn-jiujiang',
    name: 'JIUJIANG',
    flag: 'CHN',
  },
  {
    id: 'mys-sutera',
    name: 'SUTERA',
    flag: 'MYS',
  },
  {
    id: 'chn-penglai',
    name: 'PENGLAI',
    flag: 'CHN',
  },
  {
    id: 'kor-gunsan',
    name: 'GUNSAN',
    flag: 'KOR',
  },
  {
    id: 'jpn-hibikinada',
    name: 'HIBIKINADA',
    flag: 'JPN',
  },
  {
    id: 'idn-merauke',
    name: 'MERAUKE',
    flag: 'IDN',
  },
  {
    id: 'nzl-tauranga',
    name: 'TAURANGA',
    flag: 'NZL',
  },
  {
    id: 'bra-saofranciscodosul',
    name: 'SAO FRANCISCO DO SUL',
    flag: 'BRA',
  },
  {
    id: 'nor-lillesand',
    name: 'LILLESAND',
    flag: 'NOR',
  },
  {
    id: 'ita-napoli',
    name: 'NAPOLI',
    flag: 'ITA',
  },
  {
    id: 'grc-stylida',
    name: 'STYLIDA',
    flag: 'GRC',
  },
  {
    id: 'can-portcartier',
    name: 'PORT CARTIER',
    flag: 'CAN',
  },
  {
    id: 'bra-fortaleza',
    name: 'FORTALEZA',
    flag: 'BRA',
  },
  {
    id: 'egy-abuqir',
    name: 'ABU QIR',
    flag: 'EGY',
  },
  {
    id: 'idn-muria',
    name: 'MURIA',
    flag: 'IDN',
  },
  {
    id: 'cpv-palmeira',
    name: 'PALMEIRA',
    flag: 'CPV',
  },
  {
    id: 'rus-peleduy',
    name: 'PELEDUY',
    flag: 'RUS',
  },
  {
    id: 'esp-portdepollenca',
    name: 'PORT DE POLLENCA',
    flag: 'ESP',
  },
  {
    id: 'grc-portolagos',
    name: 'PORTO LAGOS',
    flag: 'GRC',
  },
  {
    id: 'fin-porvoo',
    name: 'PORVOO',
    flag: 'FIN',
  },
  {
    id: 'usa-mayo',
    name: 'MAYO',
    flag: 'USA',
  },
  {
    id: 'bel-wevelgem',
    name: 'WEVELGEM',
    flag: 'BEL',
  },
  {
    id: 'est-loksa',
    name: 'LOKSA',
    flag: 'EST',
  },
  {
    id: 'hrv-vodice',
    name: 'VODICE',
    flag: 'HRV',
  },
  {
    id: 'idn-pantoean',
    name: 'PANTOEAN',
    flag: 'IDN',
  },
  {
    id: 'jpn-kawasaki',
    name: 'KAWASAKI',
    flag: 'JPN',
  },
  {
    id: 'deu-oberhausen',
    name: 'OBERHAUSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-hildesheim',
    name: 'HILDESHEIM',
    flag: 'DEU',
  },
  {
    id: 'ita-portonogaro',
    name: 'PORTO NOGARO',
    flag: 'ITA',
  },
  {
    id: 'bel-beernem',
    name: 'BEERNEM',
    flag: 'BEL',
  },
  {
    id: 'swe-flivik',
    name: 'FLIVIK',
    flag: 'SWE',
  },
  {
    id: 'bhs-shroudcay',
    name: 'SHROUD CAY',
    flag: 'BHS',
  },
  {
    id: 'per-tablones',
    name: 'TABLONES',
    flag: 'PER',
  },
  {
    id: 'ven-puertoordaz',
    name: 'PUERTO ORDAZ',
    flag: 'VEN',
  },
  {
    id: 'grd-petitmartinique',
    name: 'PETIT MARTINIQUE',
    flag: 'GRD',
  },
  {
    id: 'grl-paamuit',
    name: 'PAAMUIT',
    flag: 'GRL',
  },
  {
    id: 'gbr-scrabster',
    name: 'SCRABSTER',
    flag: 'GBR',
  },
  {
    id: 'deu-peine',
    name: 'PEINE',
    flag: 'DEU',
  },
  {
    id: 'swe-backviken',
    name: 'BACKVIKEN',
    flag: 'SWE',
  },
  {
    id: 'ita-fanocanalealbani',
    name: 'FANO CANALE ALBANI',
    flag: 'ITA',
  },
  {
    id: 'grc-kyllini',
    name: 'KYLLINI',
    flag: 'GRC',
  },
  {
    id: 'grc-larymna',
    name: 'LARYMNA',
    flag: 'GRC',
  },
  {
    id: 'est-paldiski',
    name: 'PALDISKI',
    flag: 'EST',
  },
  {
    id: 'moz-beira',
    name: 'BEIRA',
    flag: 'MOZ',
  },
  {
    id: 'chn-guishan',
    name: 'GUISHAN',
    flag: 'CHN',
  },
  {
    id: 'idn-handil',
    name: 'HANDIL',
    flag: 'IDN',
  },
  {
    id: 'jpn-toyamashin',
    name: 'TOYAMASHIN',
    flag: 'JPN',
  },
  {
    id: 'aus-eastgosford',
    name: 'EAST GOSFORD',
    flag: 'AUS',
  },
  {
    id: 'dnk-strandby',
    name: 'STRANDBY',
    flag: 'DNK',
  },
  {
    id: 'ind-kakinada',
    name: 'KAKINADA',
    flag: 'IND',
  },
  {
    id: 'phl-iloilo',
    name: 'ILOILO',
    flag: 'PHL',
  },
  {
    id: 'esp-carboneras',
    name: 'CARBONERAS',
    flag: 'ESP',
  },
  {
    id: 'ita-terracina',
    name: 'TERRACINA',
    flag: 'ITA',
  },
  {
    id: 'hrv-okruggornjianchorage',
    name: 'OKRUG GORNJI ANCHORAGE',
    flag: 'HRV',
  },
  {
    id: 'nld-gaastmeer',
    name: 'GAASTMEER',
    flag: 'NLD',
  },
  {
    id: 'nor-tofte',
    name: 'TOFTE',
    flag: 'NOR',
  },
  {
    id: 'lux-remich',
    name: 'REMICH',
    flag: 'LUX',
  },
  {
    id: 'nor-vikene',
    name: 'VIKENE',
    flag: 'NOR',
  },
  {
    id: 'aus-balmoral',
    name: 'BALMORAL',
    flag: 'AUS',
  },
  {
    id: 'dnk-lango',
    name: 'LANGO',
    flag: 'DNK',
  },
  {
    id: 'hrv-kolocep',
    name: 'KOLOCEP',
    flag: 'HRV',
  },
  {
    id: 'jpn-takuma',
    name: 'TAKUMA',
    flag: 'JPN',
  },
  {
    id: 'can-leamington',
    name: 'LEAMINGTON',
    flag: 'CAN',
  },
  {
    id: 'nld-elst',
    name: 'ELST',
    flag: 'NLD',
  },
  {
    id: 'esp-boiro',
    name: 'BOIRO',
    flag: 'ESP',
  },
  {
    id: 'usa-redondo',
    name: 'REDONDO',
    flag: 'USA',
  },
  {
    id: 'usa-bohicket',
    name: 'BOHICKET',
    flag: 'USA',
  },
  {
    id: 'usa-wilmington',
    name: 'WILMINGTON',
    flag: 'USA',
  },
  {
    id: 'tto-chaguaramas',
    name: 'CHAGUARAMAS',
    flag: 'TTO',
  },
  {
    id: 'isl-thingeyri',
    name: 'THINGEYRI',
    flag: 'ISL',
  },
  {
    id: 'gbr-hamble',
    name: 'HAMBLE',
    flag: 'GBR',
  },
  {
    id: 'fra-melun',
    name: 'MELUN',
    flag: 'FRA',
  },
  {
    id: 'ita-livorno',
    name: 'LIVORNO',
    flag: 'ITA',
  },
  {
    id: 'ita-pesaro',
    name: 'PESARO',
    flag: 'ITA',
  },
  {
    id: 'dnk-roenne',
    name: 'ROENNE',
    flag: 'DNK',
  },
  {
    id: 'ita-vasto',
    name: 'VASTO',
    flag: 'ITA',
  },
  {
    id: 'geo-poti',
    name: 'POTI',
    flag: 'GEO',
  },
  {
    id: 'chn-anqing',
    name: 'ANQING',
    flag: 'CHN',
  },
  {
    id: 'jpn-wakkanai',
    name: 'WAKKANAI',
    flag: 'JPN',
  },
  {
    id: 'aus-dover',
    name: 'DOVER',
    flag: 'AUS',
  },
  {
    id: 'nzl-waikawa',
    name: 'WAIKAWA',
    flag: 'NZL',
  },
  {
    id: 'usa-falmouth',
    name: 'FALMOUTH',
    flag: 'USA',
  },
  {
    id: 'ury-lapaloma',
    name: 'LA PALOMA',
    flag: 'URY',
  },
  {
    id: 'ita-manfredonia',
    name: 'MANFREDONIA',
    flag: 'ITA',
  },
  {
    id: 'dnk-havneby',
    name: 'HAVNEBY',
    flag: 'DNK',
  },
  {
    id: 'tur-silivri',
    name: 'SILIVRI',
    flag: 'TUR',
  },
  {
    id: 'are-ummlulufield',
    name: 'UMM LULU FIELD',
    flag: 'ARE',
  },
  {
    id: 'ago-kuitooilfield',
    name: 'KUITO OIL FIELD',
    flag: 'AGO',
  },
  {
    id: 'usa-sacramento',
    name: 'SACRAMENTO',
    flag: 'USA',
  },
  {
    id: 'rus-cherepovets',
    name: 'CHEREPOVETS',
    flag: 'RUS',
  },
  {
    id: 'mys-kuantan',
    name: 'KUANTAN',
    flag: 'MYS',
  },
  {
    id: 'ita-portocervo',
    name: 'PORTO CERVO',
    flag: 'ITA',
  },
  {
    id: 'hrv-orebic',
    name: 'OREBIC',
    flag: 'HRV',
  },
  {
    id: 'jpn-otake',
    name: 'OTAKE',
    flag: 'JPN',
  },
  {
    id: 'ita-calaluna',
    name: 'CALA LUNA',
    flag: 'ITA',
  },
  {
    id: 'fra-limay',
    name: 'LIMAY',
    flag: 'FRA',
  },
  {
    id: 'mys-batupahat',
    name: 'BATU PAHAT',
    flag: 'MYS',
  },
  {
    id: 'deu-fresenburg',
    name: 'FRESENBURG',
    flag: 'DEU',
  },
  {
    id: 'swe-soedra',
    name: 'SOEDRA',
    flag: 'SWE',
  },
  {
    id: 'bel-lalouviere',
    name: 'LA LOUVIERE',
    flag: 'BEL',
  },
  {
    id: 'nld-driel',
    name: 'DRIEL',
    flag: 'NLD',
  },
  {
    id: 'nor-horsoy',
    name: 'HORSOY',
    flag: 'NOR',
  },
  {
    id: 'idn-kualaenok',
    name: 'KUALA ENOK',
    flag: 'IDN',
  },
  {
    id: 'tur-fordotosan',
    name: 'FORD OTOSAN',
    flag: 'TUR',
  },
  {
    id: 'usa-coeymans',
    name: 'COEYMANS',
    flag: 'USA',
  },
  {
    id: 'vir-stthomas',
    name: 'ST THOMAS',
    flag: 'VIR',
  },
  {
    id: 'esp-vilanova',
    name: 'VILANOVA',
    flag: 'ESP',
  },
  {
    id: 'nor-haroysundet',
    name: 'HAROYSUNDET',
    flag: 'NOR',
  },
  {
    id: 'deu-geesthacht',
    name: 'GEESTHACHT',
    flag: 'DEU',
  },
  {
    id: 'aut-weissenkircheninderwachau',
    name: 'WEISSENKIRCHEN IN DER WACHAU',
    flag: 'AUT',
  },
  {
    id: 'nor-tranoy',
    name: 'TRANOY',
    flag: 'NOR',
  },
  {
    id: 'egy-elgouna',
    name: 'EL GOUNA',
    flag: 'EGY',
  },
  {
    id: 'idn-kupang',
    name: 'KUPANG',
    flag: 'IDN',
  },
  {
    id: 'jpn-fushikitoyama',
    name: 'FUSHIKITOYAMA',
    flag: 'JPN',
  },
  {
    id: 'can-dentisland',
    name: 'DENT ISLAND',
    flag: 'CAN',
  },
  {
    id: 'mar-agadir',
    name: 'AGADIR',
    flag: 'MAR',
  },
  {
    id: 'hrv-krk',
    name: 'KRK',
    flag: 'HRV',
  },
  {
    id: 'ukr-chornomorsk',
    name: 'CHORNOMORSK',
    flag: 'UKR',
  },
  {
    id: 'ecu-douglas',
    name: 'DOUGLAS',
    flag: 'ECU',
  },
  {
    id: 'chn-yantiananchorage',
    name: 'YANTIAN ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'usa-biloxi',
    name: 'BILOXI',
    flag: 'USA',
  },
  {
    id: 'usa-fortlauderdale',
    name: 'FORT LAUDERDALE',
    flag: 'USA',
  },
  {
    id: 'usa-brewerhawthorne',
    name: 'BREWER HAWTHORNE',
    flag: 'USA',
  },
  {
    id: 'deu-andernach',
    name: 'ANDERNACH',
    flag: 'DEU',
  },
  {
    id: 'deu-bergkamen',
    name: 'BERGKAMEN',
    flag: 'DEU',
  },
  {
    id: 'tur-turgutreis',
    name: 'TURGUTREIS',
    flag: 'TUR',
  },
  {
    id: 'rus-shlisseburg',
    name: 'SHLISSEBURG',
    flag: 'RUS',
  },
  {
    id: 'usa-oakland',
    name: 'OAKLAND',
    flag: 'USA',
  },
  {
    id: 'bhs-elbowcay',
    name: 'ELBOW CAY',
    flag: 'BHS',
  },
  {
    id: 'usa-joliet',
    name: 'JOLIET',
    flag: 'USA',
  },
  {
    id: 'usa-sunshine',
    name: 'SUNSHINE',
    flag: 'USA',
  },
  {
    id: 'nld-nieuwlekkerland',
    name: 'NIEUW LEKKERLAND',
    flag: 'NLD',
  },
  {
    id: 'deu-frankfurt',
    name: 'FRANKFURT',
    flag: 'DEU',
  },
  {
    id: 'gbr-eastham',
    name: 'EASTHAM',
    flag: 'GBR',
  },
  {
    id: 'arg-barranqueras',
    name: 'BARRANQUERAS',
    flag: 'ARG',
  },
  {
    id: 'phl-riotuba',
    name: 'RIO TUBA',
    flag: 'PHL',
  },
  {
    id: 'usa-galveston',
    name: 'GALVESTON',
    flag: 'USA',
  },
  {
    id: 'arg-mardelplata',
    name: 'MAR DEL PLATA',
    flag: 'ARG',
  },
  {
    id: 'esp-laspalmas',
    name: 'LAS PALMAS',
    flag: 'ESP',
  },
  {
    id: 'nld-zwartenberg',
    name: 'ZWARTENBERG',
    flag: 'NLD',
  },
  {
    id: 'ita-genoa',
    name: 'GENOA',
    flag: 'ITA',
  },
  {
    id: 'ita-marinadisalivoli',
    name: 'MARINA DI SALIVOLI',
    flag: 'ITA',
  },
  {
    id: 'deu-straubing',
    name: 'STRAUBING',
    flag: 'DEU',
  },
  {
    id: 'aut-waldkirchenamwesen',
    name: 'WALDKIRCHEN AM WESEN',
    flag: 'AUT',
  },
  {
    id: 'hun-solt',
    name: 'SOLT',
    flag: 'HUN',
  },
  {
    id: 'nor-vardo',
    name: 'VARDO',
    flag: 'NOR',
  },
  {
    id: 'lka-galle',
    name: 'GALLE',
    flag: 'LKA',
  },
  {
    id: 'aus-hillarys',
    name: 'HILLARYS',
    flag: 'AUS',
  },
  {
    id: 'chn-shouguang',
    name: 'SHOUGUANG',
    flag: 'CHN',
  },
  {
    id: 'jpn-kudamatsu',
    name: 'KUDAMATSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-tanabe',
    name: 'TANABE',
    flag: 'JPN',
  },
  {
    id: 'aus-scarness',
    name: 'SCARNESS',
    flag: 'AUS',
  },
  {
    id: 'nzl-tutukaka',
    name: 'TUTUKAKA',
    flag: 'NZL',
  },
  {
    id: 'bra-forno',
    name: 'FORNO',
    flag: 'BRA',
  },
  {
    id: 'aus-werribeesouth',
    name: 'WERRIBEE SOUTH',
    flag: 'AUS',
  },
  {
    id: 'pri-esperanza',
    name: 'ESPERANZA',
    flag: 'PRI',
  },
  {
    id: 'grc-neamoudania',
    name: 'NEA MOUDANIA',
    flag: 'GRC',
  },
  {
    id: 'ven-bajogrande',
    name: 'BAJO GRANDE',
    flag: 'VEN',
  },
  {
    id: 'bra-vitoria',
    name: 'VITORIA',
    flag: 'BRA',
  },
  {
    id: 'nld-zaltbommel',
    name: 'ZALTBOMMEL',
    flag: 'NLD',
  },
  {
    id: 'grc-kastellorizo',
    name: 'KASTELLORIZO',
    flag: 'GRC',
  },
  {
    id: 'egy-hurghada',
    name: 'HURGHADA',
    flag: 'EGY',
  },
  {
    id: 'tur-kupluagzi',
    name: 'KUPLUAGZI',
    flag: 'TUR',
  },
  {
    id: 'ncl-prony',
    name: 'PRONY',
    flag: 'NCL',
  },
  {
    id: 'usa-edgartown',
    name: 'EDGARTOWN',
    flag: 'USA',
  },
  {
    id: 'can-lunenburg',
    name: 'LUNENBURG',
    flag: 'CAN',
  },
  {
    id: 'dnk-stenore',
    name: 'STENORE',
    flag: 'DNK',
  },
  {
    id: 'rus-petrozavodsk',
    name: 'PETROZAVODSK',
    flag: 'RUS',
  },
  {
    id: 'lca-rodneybay',
    name: 'RODNEY BAY',
    flag: 'LCA',
  },
  {
    id: 'nor-arendal',
    name: 'ARENDAL',
    flag: 'NOR',
  },
  {
    id: 'pan-taboga',
    name: 'TABOGA',
    flag: 'PAN',
  },
  {
    id: 'phl-hiju,maco',
    name: 'HIJU, MACO',
    flag: 'PHL',
  },
  {
    id: 'bel-nameche',
    name: 'NAMECHE',
    flag: 'BEL',
  },
  {
    id: 'deu-badhonnef',
    name: 'BAD HONNEF',
    flag: 'DEU',
  },
  {
    id: 'nld-ooltgensplaat',
    name: 'OOLTGENSPLAAT',
    flag: 'NLD',
  },
  {
    id: 'nld-waalwijk',
    name: 'WAALWIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-ravenstein',
    name: 'RAVENSTEIN',
    flag: 'NLD',
  },
  {
    id: 'usa-santabarbara',
    name: 'SANTA BARBARA',
    flag: 'USA',
  },
  {
    id: 'isl-reykjavik',
    name: 'REYKJAVIK',
    flag: 'ISL',
  },
  {
    id: 'gbr-aberdourbayanchorage',
    name: 'ABERDOUR BAY ANCHORAGE',
    flag: 'GBR',
  },
  {
    id: 'gbr-littlehampton',
    name: 'LITTLEHAMPTON',
    flag: 'GBR',
  },
  {
    id: 'nld-scheveningen',
    name: 'SCHEVENINGEN',
    flag: 'NLD',
  },
  {
    id: 'nor-tennebo',
    name: 'TENNEBO',
    flag: 'NOR',
  },
  {
    id: 'deu-brunsbuttel',
    name: 'BRUNSBUTTEL',
    flag: 'DEU',
  },
  {
    id: 'ita-portovenere',
    name: 'PORTOVENERE',
    flag: 'ITA',
  },
  {
    id: 'dnk-frederikshavn',
    name: 'FREDERIKSHAVN',
    flag: 'DNK',
  },
  {
    id: 'nor-hommelvik',
    name: 'HOMMELVIK',
    flag: 'NOR',
  },
  {
    id: 'deu-konigswusterhausen',
    name: 'KONIGS WUSTERHAUSEN',
    flag: 'DEU',
  },
  {
    id: 'nor-bleik',
    name: 'BLEIK',
    flag: 'NOR',
  },
  {
    id: 'lva-salacgriva',
    name: 'SALACGRIVA',
    flag: 'LVA',
  },
  {
    id: 'grc-naousaanchorage',
    name: 'NAOUSA ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'com-moroni',
    name: 'MORONI',
    flag: 'COM',
  },
  {
    id: 'mdv-kulhudhuffushi',
    name: 'KULHUDHUFFUSHI',
    flag: 'MDV',
  },
  {
    id: 'idn-jakarta',
    name: 'JAKARTA',
    flag: 'IDN',
  },
  {
    id: 'aus-penneshaw',
    name: 'PENNESHAW',
    flag: 'AUS',
  },
  {
    id: 'aus-magneticisland',
    name: 'MAGNETIC ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-shorncliffe',
    name: 'SHORNCLIFFE',
    flag: 'AUS',
  },
  {
    id: 'mex-pichilingue',
    name: 'PICHILINGUE',
    flag: 'MEX',
  },
  {
    id: 'isl-sudureyri',
    name: 'SUDUREYRI',
    flag: 'ISL',
  },
  {
    id: 'ita-carloforte',
    name: 'CARLOFORTE',
    flag: 'ITA',
  },
  {
    id: 'hrv-makarska',
    name: 'MAKARSKA',
    flag: 'HRV',
  },
  {
    id: 'irn-rajaei',
    name: 'RAJAEI',
    flag: 'IRN',
  },
  {
    id: 'chn-quangang',
    name: 'QUANGANG',
    flag: 'CHN',
  },
  {
    id: 'aus-greenwellpoint',
    name: 'GREENWELL POINT',
    flag: 'AUS',
  },
  {
    id: 'fji-lautoka',
    name: 'LAUTOKA',
    flag: 'FJI',
  },
  {
    id: 'tur-tekirdag',
    name: 'TEKIRDAG',
    flag: 'TUR',
  },
  {
    id: 'usa-stcharlesclub',
    name: 'ST CHARLES CLUB',
    flag: 'USA',
  },
  {
    id: 'usa-lloydharbor',
    name: 'LLOYD HARBOR',
    flag: 'USA',
  },
  {
    id: 'fra-avignon',
    name: 'AVIGNON',
    flag: 'FRA',
  },
  {
    id: 'nor-bruhagen',
    name: 'BRUHAGEN',
    flag: 'NOR',
  },
  {
    id: 'hun-esztergom',
    name: 'ESZTERGOM',
    flag: 'HUN',
  },
  {
    id: 'dnk-frederikssund',
    name: 'FREDERIKSSUND',
    flag: 'DNK',
  },
  {
    id: 'idn-lubuktutung',
    name: 'LUBUKTUTUNG',
    flag: 'IDN',
  },
  {
    id: 'bra-fsomacae',
    name: 'FSO MACAE',
    flag: 'BRA',
  },
  {
    id: 'dnk-ishoj',
    name: 'ISHOJ',
    flag: 'DNK',
  },
  {
    id: 'phl-talaga',
    name: 'TALAGA',
    flag: 'PHL',
  },
  {
    id: 'hti-miragoane',
    name: 'MIRAGOANE',
    flag: 'HTI',
  },
  {
    id: 'usa-mackinacisland',
    name: 'MACKINAC ISLAND',
    flag: 'USA',
  },
  {
    id: 'aus-byronbay',
    name: 'BYRON BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-belmont',
    name: 'BELMONT',
    flag: 'AUS',
  },
  {
    id: 'aus-rathmines',
    name: 'RATHMINES',
    flag: 'AUS',
  },
  {
    id: 'usa-ventura',
    name: 'VENTURA',
    flag: 'USA',
  },
  {
    id: 'mex-cabosanlucas',
    name: 'CABO SAN LUCAS',
    flag: 'MEX',
  },
  {
    id: 'usa-northportbay',
    name: 'NORTHPORT BAY',
    flag: 'USA',
  },
  {
    id: 'ven-ciudadojeda',
    name: 'CIUDAD OJEDA',
    flag: 'VEN',
  },
  {
    id: 'can-woodsharbour',
    name: 'WOODS HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'grl-narsaq',
    name: 'NARSAQ',
    flag: 'GRL',
  },
  {
    id: 'isl-neskaupstadur',
    name: 'NESKAUPSTADUR',
    flag: 'ISL',
  },
  {
    id: 'esp-bueu',
    name: 'BUEU',
    flag: 'ESP',
  },
  {
    id: 'irl-youghal',
    name: 'YOUGHAL',
    flag: 'IRL',
  },
  {
    id: 'gbr-stornoway',
    name: 'STORNOWAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-grimsby',
    name: 'GRIMSBY',
    flag: 'GBR',
  },
  {
    id: 'fra-duclair',
    name: 'DUCLAIR',
    flag: 'FRA',
  },
  {
    id: 'nld-emmeloord',
    name: 'EMMELOORD',
    flag: 'NLD',
  },
  {
    id: 'deu-kehl',
    name: 'KEHL',
    flag: 'DEU',
  },
  {
    id: 'nor-verdal',
    name: 'VERDAL',
    flag: 'NOR',
  },
  {
    id: 'ita-ancona',
    name: 'ANCONA',
    flag: 'ITA',
  },
  {
    id: 'aut-kirchbergobderdonau',
    name: 'KIRCHBERG OB DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'fin-vaasa',
    name: 'VAASA',
    flag: 'FIN',
  },
  {
    id: 'grc-methoni',
    name: 'METHONI',
    flag: 'GRC',
  },
  {
    id: 'lka-marissa',
    name: 'MARISSA',
    flag: 'LKA',
  },
  {
    id: 'jpn-ieshima',
    name: 'IESHIMA',
    flag: 'JPN',
  },
  {
    id: 'maf-orientbay',
    name: 'ORIENT BAY',
    flag: 'MAF',
  },
  {
    id: 'irl-cork',
    name: 'CORK',
    flag: 'IRL',
  },
  {
    id: 'ita-pozzallo',
    name: 'POZZALLO',
    flag: 'ITA',
  },
  {
    id: 'usa-whittier',
    name: 'WHITTIER',
    flag: 'USA',
  },
  {
    id: 'usa-jeffersonville',
    name: 'JEFFERSONVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-swansisland',
    name: 'SWANS ISLAND',
    flag: 'USA',
  },
  {
    id: 'pry-asuncion',
    name: 'ASUNCION',
    flag: 'PRY',
  },
  {
    id: 'nld-lagezwaluwe',
    name: 'LAGE ZWALUWE',
    flag: 'NLD',
  },
  {
    id: 'nor-hjelmeland',
    name: 'HJELMELAND',
    flag: 'NOR',
  },
  {
    id: 'grc-vouliagmeni',
    name: 'VOULIAGMENI',
    flag: 'GRC',
  },
  {
    id: 'usa-shawisland',
    name: 'SHAW ISLAND',
    flag: 'USA',
  },
  {
    id: 'nld-nijkerk',
    name: 'NIJKERK',
    flag: 'NLD',
  },
  {
    id: 'deu-ueckermunde',
    name: 'UECKERMUNDE',
    flag: 'DEU',
  },
  {
    id: 'mne-tivat',
    name: 'TIVAT',
    flag: 'MNE',
  },
  {
    id: 'rus-novyiport',
    name: 'NOVYIPORT',
    flag: 'RUS',
  },
  {
    id: 'slb-gizo',
    name: 'GIZO',
    flag: 'SLB',
  },
  {
    id: 'rus-voznesenye',
    name: 'VOZNESENYE',
    flag: 'RUS',
  },
  {
    id: 'phl-spratlyislands',
    name: 'SPRATLY ISLANDS',
    flag: 'PHL',
  },
  {
    id: 'idn-sadeng',
    name: 'SADENG',
    flag: 'IDN',
  },
  {
    id: 'col-santamarta',
    name: 'SANTA MARTA',
    flag: 'COL',
  },
  {
    id: 'arg-sanpedro',
    name: 'SAN PEDRO',
    flag: 'ARG',
  },
  {
    id: 'bra-santarem',
    name: 'SANTAREM',
    flag: 'BRA',
  },
  {
    id: 'bra-portobelo',
    name: 'PORTO BELO',
    flag: 'BRA',
  },
  {
    id: 'gbr-lamlash',
    name: 'LAMLASH',
    flag: 'GBR',
  },
  {
    id: 'gbr-westmersea',
    name: 'WEST MERSEA',
    flag: 'GBR',
  },
  {
    id: 'fra-calais',
    name: 'CALAIS',
    flag: 'FRA',
  },
  {
    id: 'deu-husum',
    name: 'HUSUM',
    flag: 'DEU',
  },
  {
    id: 'deu-dettelbach',
    name: 'DETTELBACH',
    flag: 'DEU',
  },
  {
    id: 'ita-marina4s.p.a.',
    name: 'MARINA 4 S.P.A.',
    flag: 'ITA',
  },
  {
    id: 'idn-bayah',
    name: 'BAYAH',
    flag: 'IDN',
  },
  {
    id: 'chn-tongling',
    name: 'TONGLING',
    flag: 'CHN',
  },
  {
    id: 'chn-taizhou',
    name: 'TAIZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-xiawei',
    name: 'XIAWEI',
    flag: 'CHN',
  },
  {
    id: 'chn-jiayang',
    name: 'JIAYANG',
    flag: 'CHN',
  },
  {
    id: 'jpn-beppu',
    name: 'BEPPU',
    flag: 'JPN',
  },
  {
    id: 'aus-karumba',
    name: 'KARUMBA',
    flag: 'AUS',
  },
  {
    id: 'aus-sorrento',
    name: 'SORRENTO',
    flag: 'AUS',
  },
  {
    id: 'usa-provincetown',
    name: 'PROVINCETOWN',
    flag: 'USA',
  },
  {
    id: 'isl-thorlakshofn',
    name: 'THORLAKSHOFN',
    flag: 'ISL',
  },
  {
    id: 'mex-morroredondo',
    name: 'MORRO REDONDO',
    flag: 'MEX',
  },
  {
    id: 'gbr-greatyarmouth',
    name: 'GREAT YARMOUTH',
    flag: 'GBR',
  },
  {
    id: 'ita-panarea',
    name: 'PANAREA',
    flag: 'ITA',
  },
  {
    id: 'can-deceptionbay',
    name: 'DECEPTION BAY',
    flag: 'CAN',
  },
  {
    id: 'nor-drammen',
    name: 'DRAMMEN',
    flag: 'NOR',
  },
  {
    id: 'sgp-singaporeanchorage',
    name: 'SINGAPORE ANCHORAGE',
    flag: 'SGP',
  },
  {
    id: 'usa-rutherfordisland',
    name: 'RUTHERFORD ISLAND',
    flag: 'USA',
  },
  {
    id: 'sen-kaolack',
    name: 'KAOLACK',
    flag: 'SEN',
  },
  {
    id: 'gbr-arbroath',
    name: 'ARBROATH',
    flag: 'GBR',
  },
  {
    id: 'nor-sistranda',
    name: 'SISTRANDA',
    flag: 'NOR',
  },
  {
    id: 'usa-sewickley',
    name: 'SEWICKLEY',
    flag: 'USA',
  },
  {
    id: 'atg-stjohns',
    name: 'ST JOHNS',
    flag: 'ATG',
  },
  {
    id: 'usa-stignace',
    name: 'ST IGNACE',
    flag: 'USA',
  },
  {
    id: 'fra-lezardrieux',
    name: 'LEZARDRIEUX',
    flag: 'FRA',
  },
  {
    id: 'mlt-mallieha',
    name: 'MALLIEHA',
    flag: 'MLT',
  },
  {
    id: 'fin-kristinestad',
    name: 'KRISTINESTAD',
    flag: 'FIN',
  },
  {
    id: 'chl-puertochincui',
    name: 'PUERTO CHINCUI',
    flag: 'CHL',
  },
  {
    id: 'arg-laplata',
    name: 'LA PLATA',
    flag: 'ARG',
  },
  {
    id: 'gbr-barrowinfurness',
    name: 'BARROW IN FURNESS',
    flag: 'GBR',
  },
  {
    id: 'ita-portotorres',
    name: 'PORTO TORRES',
    flag: 'ITA',
  },
  {
    id: 'fin-helsinki',
    name: 'HELSINKI',
    flag: 'FIN',
  },
  {
    id: 'ukr-belgoroddnestrovsky',
    name: 'BELGOROD DNESTROVSKY',
    flag: 'UKR',
  },
  {
    id: 'omn-alsuwayq',
    name: 'Al SUWAYQ',
    flag: 'OMN',
  },
  {
    id: 'mys-kualaterengganu',
    name: 'KUALA TERENGGANU',
    flag: 'MYS',
  },
  {
    id: 'chn-haiyang',
    name: 'HAIYANG',
    flag: 'CHN',
  },
  {
    id: 'jpn-hirado',
    name: 'HIRADO',
    flag: 'JPN',
  },
  {
    id: 'jpn-maizuru',
    name: 'MAIZURU',
    flag: 'JPN',
  },
  {
    id: 'aus-portdalrymple',
    name: 'PORT DALRYMPLE',
    flag: 'AUS',
  },
  {
    id: 'cub-moa',
    name: 'MOA',
    flag: 'CUB',
  },
  {
    id: 'swe-ronnang',
    name: 'RONNANG',
    flag: 'SWE',
  },
  {
    id: 'dnk-fakseladeplads',
    name: 'FAKSE LADEPLADS',
    flag: 'DNK',
  },
  {
    id: 'ukr-berdyansk',
    name: 'BERDYANSK',
    flag: 'UKR',
  },
  {
    id: 'omn-salalah',
    name: 'SALALAH',
    flag: 'OMN',
  },
  {
    id: 'esp-roquetasdemar',
    name: 'ROQUETAS DE MAR',
    flag: 'ESP',
  },
  {
    id: 'gbr-saintpeterport',
    name: 'SAINT PETER PORT',
    flag: 'GBR',
  },
  {
    id: 'tur-babakale',
    name: 'BABAKALE',
    flag: 'TUR',
  },
  {
    id: 'idn-kualatanjung',
    name: 'KUALA TANJUNG',
    flag: 'IDN',
  },
  {
    id: 'nld-schiedam',
    name: 'SCHIEDAM',
    flag: 'NLD',
  },
  {
    id: 'cub-puertopadre',
    name: 'PUERTO PADRE',
    flag: 'CUB',
  },
  {
    id: 'rus-moskalvo',
    name: 'MOSKALVO',
    flag: 'RUS',
  },
  {
    id: 'tur-alanya',
    name: 'ALANYA',
    flag: 'TUR',
  },
  {
    id: 'usa-alitak',
    name: 'ALITAK',
    flag: 'USA',
  },
  {
    id: 'esp-grantarajal',
    name: 'GRAN TARAJAL',
    flag: 'ESP',
  },
  {
    id: 'idn-kwandang',
    name: 'KWANDANG',
    flag: 'IDN',
  },
  {
    id: 'nld-leerdam',
    name: 'LEERDAM',
    flag: 'NLD',
  },
  {
    id: 'dnk-nakskov',
    name: 'NAKSKOV',
    flag: 'DNK',
  },
  {
    id: 'rus-ustkamchatsk',
    name: 'UST KAMCHATSK',
    flag: 'RUS',
  },
  {
    id: 'aus-ascot',
    name: 'ASCOT',
    flag: 'AUS',
  },
  {
    id: 'fro-skali',
    name: 'SKALI',
    flag: 'FRO',
  },
  {
    id: 'nld-maurik',
    name: 'MAURIK',
    flag: 'NLD',
  },
  {
    id: 'srb-titel',
    name: 'TITEL',
    flag: 'SRB',
  },
  {
    id: 'ind-vadinar',
    name: 'VADINAR',
    flag: 'IND',
  },
  {
    id: 'mex-ensenada',
    name: 'ENSENADA',
    flag: 'MEX',
  },
  {
    id: 'usa-houma',
    name: 'HOUMA',
    flag: 'USA',
  },
  {
    id: 'per-lapuntaanchorage',
    name: 'LA PUNTA ANCHORAGE',
    flag: 'PER',
  },
  {
    id: 'usa-newbedford',
    name: 'NEW BEDFORD',
    flag: 'USA',
  },
  {
    id: 'glp-deshaies',
    name: 'DESHAIES',
    flag: 'GLP',
  },
  {
    id: 'sur-moengo',
    name: 'MOENGO',
    flag: 'SUR',
  },
  {
    id: 'isl-akureyri',
    name: 'AKUREYRI',
    flag: 'ISL',
  },
  {
    id: 'esp-bilbao',
    name: 'BILBAO',
    flag: 'ESP',
  },
  {
    id: 'gbr-peterhead',
    name: 'PETERHEAD',
    flag: 'GBR',
  },
  {
    id: 'deu-kroslin',
    name: 'KROSLIN',
    flag: 'DEU',
  },
  {
    id: 'hrv-zadar',
    name: 'ZADAR',
    flag: 'HRV',
  },
  {
    id: 'chn-yangpu',
    name: 'YANGPU',
    flag: 'CHN',
  },
  {
    id: 'jpn-hirara',
    name: 'HIRARA',
    flag: 'JPN',
  },
  {
    id: 'nzl-portchalmers',
    name: 'PORT CHALMERS',
    flag: 'NZL',
  },
  {
    id: 'dnk-avedore',
    name: 'AVEDORE',
    flag: 'DNK',
  },
  {
    id: 'jpn-tokushima',
    name: 'TOKUSHIMA',
    flag: 'JPN',
  },
  {
    id: 'idn-sungaipakning',
    name: 'SUNGAI PAKNING',
    flag: 'IDN',
  },
  {
    id: 'mar-safi',
    name: 'SAFI',
    flag: 'MAR',
  },
  {
    id: 'are-sharjahanchorage',
    name: 'SHARJAH ANCHORAGE',
    flag: 'ARE',
  },
  {
    id: 'hrv-pucisca',
    name: 'PUCISCA',
    flag: 'HRV',
  },
  {
    id: 'grc-kissamos',
    name: 'KISSAMOS',
    flag: 'GRC',
  },
  {
    id: 'ukr-reni',
    name: 'RENI',
    flag: 'UKR',
  },
  {
    id: 'lbn-jounieh',
    name: 'JOUNIEH',
    flag: 'LBN',
  },
  {
    id: 'jpn-mizushima',
    name: 'MIZUSHIMA',
    flag: 'JPN',
  },
  {
    id: 'aus-adelaide',
    name: 'ADELAIDE',
    flag: 'AUS',
  },
  {
    id: 'lbn-selaata',
    name: 'SELAATA',
    flag: 'LBN',
  },
  {
    id: 'ukr-sevastopol',
    name: 'SEVASTOPOL',
    flag: 'UKR',
  },
  {
    id: 'usa-greenville',
    name: 'GREENVILLE',
    flag: 'USA',
  },
  {
    id: 'gbr-mylor',
    name: 'MYLOR',
    flag: 'GBR',
  },
  {
    id: 'swe-skutskar',
    name: 'SKUTSKAR',
    flag: 'SWE',
  },
  {
    id: 'bel-namur',
    name: 'NAMUR',
    flag: 'BEL',
  },
  {
    id: 'gab-owendo',
    name: 'OWENDO',
    flag: 'GAB',
  },
  {
    id: 'nld-giethoorn',
    name: 'GIETHOORN',
    flag: 'NLD',
  },
  {
    id: 'nld-rhenen',
    name: 'RHENEN',
    flag: 'NLD',
  },
  {
    id: 'irl-waterfordcity',
    name: 'WATERFORD CITY',
    flag: 'IRL',
  },
  {
    id: 'nld-schagen',
    name: 'SCHAGEN',
    flag: 'NLD',
  },
  {
    id: 'usa-calvertcity',
    name: 'CALVERT CITY',
    flag: 'USA',
  },
  {
    id: 'nld-burdaard',
    name: 'BURDAARD',
    flag: 'NLD',
  },
  {
    id: 'idn-wanggarasi',
    name: 'WANGGARASI',
    flag: 'IDN',
  },
  {
    id: 'usa-marinyachtclub',
    name: 'MARIN YACHT CLUB',
    flag: 'USA',
  },
  {
    id: 'usa-miami',
    name: 'MIAMI',
    flag: 'USA',
  },
  {
    id: 'usa-wanchese',
    name: 'WANCHESE',
    flag: 'USA',
  },
  {
    id: 'mar-jorflasfar',
    name: 'JORF LASFAR',
    flag: 'MAR',
  },
  {
    id: 'bel-genk',
    name: 'GENK',
    flag: 'BEL',
  },
  {
    id: 'nor-moss',
    name: 'MOSS',
    flag: 'NOR',
  },
  {
    id: 'ita-giglioporto',
    name: 'GIGLIO PORTO',
    flag: 'ITA',
  },
  {
    id: 'rus-saintpetersburg',
    name: 'SAINT PETERSBURG',
    flag: 'RUS',
  },
  {
    id: 'nor-svartnes',
    name: 'SVARTNES',
    flag: 'NOR',
  },
  {
    id: 'idn-palabuhanratu',
    name: 'PALABUHAN RATU',
    flag: 'IDN',
  },
  {
    id: 'aus-esperance',
    name: 'ESPERANCE',
    flag: 'AUS',
  },
  {
    id: 'jpn-fukura',
    name: 'FUKURA',
    flag: 'JPN',
  },
  {
    id: 'aus-yorkeysknob',
    name: 'YORKEYS KNOB',
    flag: 'AUS',
  },
  {
    id: 'aus-grayspoint',
    name: 'GRAYS POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-blakehurst',
    name: 'BLAKEHURST',
    flag: 'AUS',
  },
  {
    id: 'aus-nelsonbay',
    name: 'NELSON BAY',
    flag: 'AUS',
  },
  {
    id: 'can-saintjohn',
    name: 'SAINT JOHN',
    flag: 'CAN',
  },
  {
    id: 'fra-portovecchio',
    name: 'PORTO VECCHIO',
    flag: 'FRA',
  },
  {
    id: 'dnk-hasle',
    name: 'HASLE',
    flag: 'DNK',
  },
  {
    id: 'aus-pointsamson',
    name: 'POINT SAMSON',
    flag: 'AUS',
  },
  {
    id: 'ven-guiria',
    name: 'GUIRIA',
    flag: 'VEN',
  },
  {
    id: 'esp-algeciras',
    name: 'ALGECIRAS',
    flag: 'ESP',
  },
  {
    id: 'kor-onsan',
    name: 'ONSAN',
    flag: 'KOR',
  },
  {
    id: 'jpn-fukuyama',
    name: 'FUKUYAMA',
    flag: 'JPN',
  },
  {
    id: 'isr-ashkelon',
    name: 'ASHKELON',
    flag: 'ISR',
  },
  {
    id: 'ind-kandla',
    name: 'KANDLA',
    flag: 'IND',
  },
  {
    id: 'can-portcolborne',
    name: 'PORT COLBORNE',
    flag: 'CAN',
  },
  {
    id: 'nor-andalsnes',
    name: 'ANDALSNES',
    flag: 'NOR',
  },
  {
    id: 'bgr-povelyanovo',
    name: 'POVELYANOVO',
    flag: 'BGR',
  },
  {
    id: 'rus-kirensk',
    name: 'KIRENSK',
    flag: 'RUS',
  },
  {
    id: 'fra-hyeres',
    name: 'HYERES',
    flag: 'FRA',
  },
  {
    id: 'nor-elnesvagen',
    name: 'ELNESVAGEN',
    flag: 'NOR',
  },
  {
    id: 'deu-lunen',
    name: 'LUNEN',
    flag: 'DEU',
  },
  {
    id: 'swe-gaashaga',
    name: 'GAASHAGA',
    flag: 'SWE',
  },
  {
    id: 'ala-kokar',
    name: 'KOKAR',
    flag: 'ALA',
  },
  {
    id: 'dnk-saeby',
    name: 'SAEBY',
    flag: 'DNK',
  },
  {
    id: 'phl-inawayan',
    name: 'INAWAYAN',
    flag: 'PHL',
  },
  {
    id: 'bel-schoten',
    name: 'SCHOTEN',
    flag: 'BEL',
  },
  {
    id: 'aus-mayfield',
    name: 'MAYFIELD',
    flag: 'AUS',
  },
  {
    id: "ukr-holaprystan'",
    name: "HOLA PRYSTAN'",
    flag: 'UKR',
  },
  {
    id: 'gbr-warrenpoint',
    name: 'WARRENPOINT',
    flag: 'GBR',
  },
  {
    id: 'esp-moana',
    name: 'MOANA',
    flag: 'ESP',
  },
  {
    id: 'idn-lekok',
    name: 'LEKOK',
    flag: 'IDN',
  },
  {
    id: 'cub-santiagodecuba',
    name: 'SANTIAGO DE CUBA',
    flag: 'CUB',
  },
  {
    id: 'usa-southnorwalk',
    name: 'SOUTH NORWALK',
    flag: 'USA',
  },
  {
    id: 'isl-husavik',
    name: 'HUSAVIK',
    flag: 'ISL',
  },
  {
    id: 'gbr-newlyn',
    name: 'NEWLYN',
    flag: 'GBR',
  },
  {
    id: 'gbr-holyhead',
    name: 'HOLYHEAD',
    flag: 'GBR',
  },
  {
    id: 'fra-honfleur',
    name: 'HONFLEUR',
    flag: 'FRA',
  },
  {
    id: 'nor-mekjarvik',
    name: 'MEKJARVIK',
    flag: 'NOR',
  },
  {
    id: 'nga-warri',
    name: 'WARRI',
    flag: 'NGA',
  },
  {
    id: 'deu-bramsche',
    name: 'BRAMSCHE',
    flag: 'DEU',
  },
  {
    id: 'grc-salamina',
    name: 'SALAMINA',
    flag: 'GRC',
  },
  {
    id: 'ukr-yuzhny',
    name: 'YUZHNY',
    flag: 'UKR',
  },
  {
    id: 'chn-xinhai',
    name: 'XINHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-shenquan',
    name: 'SHENQUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-ganyu',
    name: 'GANYU',
    flag: 'CHN',
  },
  {
    id: 'aus-portfairy',
    name: 'PORT FAIRY',
    flag: 'AUS',
  },
  {
    id: 'bhs-freeport',
    name: 'FREEPORT',
    flag: 'BHS',
  },
  {
    id: 'usa-carolinabeach',
    name: 'CAROLINA BEACH',
    flag: 'USA',
  },
  {
    id: 'esp-campello',
    name: 'CAMPELLO',
    flag: 'ESP',
  },
  {
    id: 'nor-seter',
    name: 'SETER',
    flag: 'NOR',
  },
  {
    id: 'swe-ystad',
    name: 'YSTAD',
    flag: 'SWE',
  },
  {
    id: 'grc-skiathos',
    name: 'SKIATHOS',
    flag: 'GRC',
  },
  {
    id: 'fin-baatvik',
    name: 'BAATVIK',
    flag: 'FIN',
  },
  {
    id: 'tha-sattahip',
    name: 'SATTAHIP',
    flag: 'THA',
  },
  {
    id: 'chn-changxingdao',
    name: 'CHANGXINGDAO',
    flag: 'CHN',
  },
  {
    id: 'jpn-misumi',
    name: 'MISUMI',
    flag: 'JPN',
  },
  {
    id: 'jpn-fukui',
    name: 'FUKUI',
    flag: 'JPN',
  },
  {
    id: 'yem-aden',
    name: 'ADEN',
    flag: 'YEM',
  },
  {
    id: 'idn-cirebon',
    name: 'CIREBON',
    flag: 'IDN',
  },
  {
    id: 'pri-mayaguez',
    name: 'MAYAGUEZ',
    flag: 'PRI',
  },
  {
    id: 'deu-marl',
    name: 'MARL',
    flag: 'DEU',
  },
  {
    id: 'nor-svelvik',
    name: 'SVELVIK',
    flag: 'NOR',
  },
  {
    id: 'rus-nizhnynovgorod',
    name: 'NIZHNY NOVGOROD',
    flag: 'RUS',
  },
  {
    id: 'per-bayovar',
    name: 'BAYOVAR',
    flag: 'PER',
  },
  {
    id: 'arg-campana',
    name: 'CAMPANA',
    flag: 'ARG',
  },
  {
    id: 'irl-rushbrooke',
    name: 'RUSHBROOKE',
    flag: 'IRL',
  },
  {
    id: 'fra-poses',
    name: 'POSES',
    flag: 'FRA',
  },
  {
    id: 'ita-camogli',
    name: 'CAMOGLI',
    flag: 'ITA',
  },
  {
    id: 'dnk-ronbjerglivoe',
    name: 'RONBJERG LIVOE',
    flag: 'DNK',
  },
  {
    id: 'swe-gullholmen',
    name: 'GULLHOLMEN',
    flag: 'SWE',
  },
  {
    id: 'swe-dalaro',
    name: 'DALARO',
    flag: 'SWE',
  },
  {
    id: 'bel-sintlenaarts',
    name: 'SINT LENAARTS',
    flag: 'BEL',
  },
  {
    id: 'pyf-tohautu',
    name: 'TOHAUTU',
    flag: 'PYF',
  },
  {
    id: 'rus-yakutsk',
    name: 'YAKUTSK',
    flag: 'RUS',
  },
  {
    id: 'swe-dufnaes',
    name: 'DUFNAES',
    flag: 'SWE',
  },
  {
    id: 'usa-poulsbo',
    name: 'POULSBO',
    flag: 'USA',
  },
  {
    id: 'bhs-manofwarcay',
    name: 'MAN OF WAR CAY',
    flag: 'BHS',
  },
  {
    id: 'chl-huasco',
    name: 'HUASCO',
    flag: 'CHL',
  },
  {
    id: 'isl-dalvik',
    name: 'DALVIK',
    flag: 'ISL',
  },
  {
    id: 'fra-portducrouesty',
    name: 'PORT DU CROUESTY',
    flag: 'FRA',
  },
  {
    id: 'esp-lavilavillajoyosa',
    name: 'LA VILA VILLAJOYOSA',
    flag: 'ESP',
  },
  {
    id: 'nld-colijnsplaat',
    name: 'COLIJNSPLAAT',
    flag: 'NLD',
  },
  {
    id: 'nor-foresvik',
    name: 'FORESVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-tananger',
    name: 'TANANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-tomrefjord',
    name: 'TOMREFJORD',
    flag: 'NOR',
  },
  {
    id: 'mco-monaco',
    name: 'MONACO',
    flag: 'MCO',
  },
  {
    id: 'deu-buesum',
    name: 'BUESUM',
    flag: 'DEU',
  },
  {
    id: 'ita-acciaroli',
    name: 'ACCIAROLI',
    flag: 'ITA',
  },
  {
    id: 'nor-drag',
    name: 'DRAG',
    flag: 'NOR',
  },
  {
    id: 'swe-iggesund',
    name: 'IGGESUND',
    flag: 'SWE',
  },
  {
    id: 'hun-mohacs',
    name: 'MOHACS',
    flag: 'HUN',
  },
  {
    id: 'grc-argostoli',
    name: 'ARGOSTOLI',
    flag: 'GRC',
  },
  {
    id: 'grc-ithaki',
    name: 'ITHAKI',
    flag: 'GRC',
  },
  {
    id: 'tur-unye',
    name: 'UNYE',
    flag: 'TUR',
  },
  {
    id: 'sdn-sawakin',
    name: 'SAWAKIN',
    flag: 'SDN',
  },
  {
    id: 'idn-padang',
    name: 'PADANG',
    flag: 'IDN',
  },
  {
    id: 'vnm-vungtau',
    name: 'VUNG TAU',
    flag: 'VNM',
  },
  {
    id: 'chn-gulei',
    name: 'GULEI',
    flag: 'CHN',
  },
  {
    id: 'jpn-matsuura',
    name: 'MATSUURA',
    flag: 'JPN',
  },
  {
    id: 'pyf-mahina',
    name: 'MAHINA',
    flag: 'PYF',
  },
  {
    id: 'pan-bocasdeltoro',
    name: 'BOCAS DEL TORO',
    flag: 'PAN',
  },
  {
    id: 'usa-dutchboatyard',
    name: 'DUTCH BOAT YARD',
    flag: 'USA',
  },
  {
    id: 'gbr-sullomvoe',
    name: 'SULLOM VOE',
    flag: 'GBR',
  },
  {
    id: 'dnk-hals',
    name: 'HALS',
    flag: 'DNK',
  },
  {
    id: 'hrv-rovinj',
    name: 'ROVINJ',
    flag: 'HRV',
  },
  {
    id: 'grc-oinousses',
    name: 'OINOUSSES',
    flag: 'GRC',
  },
  {
    id: 'grc-pythagoreio',
    name: 'PYTHAGOREIO',
    flag: 'GRC',
  },
  {
    id: 'jpn-imari',
    name: 'IMARI',
    flag: 'JPN',
  },
  {
    id: 'esp-puertodejosebanus',
    name: 'PUERTO DE JOSE BANUS',
    flag: 'ESP',
  },
  {
    id: 'tur-akyarlar',
    name: 'AKYARLAR',
    flag: 'TUR',
  },
  {
    id: 'phl-minglanilla',
    name: 'MINGLANILLA',
    flag: 'PHL',
  },
  {
    id: 'cri-caldera',
    name: 'CALDERA',
    flag: 'CRI',
  },
  {
    id: 'idn-tanjungpemancingan',
    name: 'TANJUNG PEMANCINGAN',
    flag: 'IDN',
  },
  {
    id: 'mdv-kooddoo',
    name: 'KOODDOO',
    flag: 'MDV',
  },
  {
    id: 'sau-safaniyafield',
    name: 'SAFANIYA FIELD',
    flag: 'SAU',
  },
  {
    id: 'fra-comines',
    name: 'COMINES',
    flag: 'FRA',
  },
  {
    id: 'deu-nuremberg',
    name: 'NUREMBERG',
    flag: 'DEU',
  },
  {
    id: 'grc-itea',
    name: 'ITEA',
    flag: 'GRC',
  },
  {
    id: 'usa-fallriver',
    name: 'FALL RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-portclyde',
    name: 'PORT CLYDE',
    flag: 'USA',
  },
  {
    id: 'nor-oksenoya',
    name: 'OKSENOYA',
    flag: 'NOR',
  },
  {
    id: 'dnk-nykobing',
    name: 'NYKOBING',
    flag: 'DNK',
  },
  {
    id: 'nor-monstad',
    name: 'MONSTAD',
    flag: 'NOR',
  },
  {
    id: 'swe-fiskebaeckskil',
    name: 'FISKEBAECKSKIL',
    flag: 'SWE',
  },
  {
    id: 'srb-grocka',
    name: 'GROCKA',
    flag: 'SRB',
  },
  {
    id: 'geo-anaklia',
    name: 'ANAKLIA',
    flag: 'GEO',
  },
  {
    id: 'deu-niedernberg',
    name: 'NIEDERNBERG',
    flag: 'DEU',
  },
  {
    id: 'mlt-armierbay',
    name: 'ARMIER BAY',
    flag: 'MLT',
  },
  {
    id: 'gbr-rye',
    name: 'RYE',
    flag: 'GBR',
  },
  {
    id: 'per-eten',
    name: 'ETEN',
    flag: 'PER',
  },
  {
    id: 'hrv-slano',
    name: 'SLANO',
    flag: 'HRV',
  },
  {
    id: 'nld-amersfoort',
    name: 'AMERSFOORT',
    flag: 'NLD',
  },
  {
    id: 'usa-natchez',
    name: 'NATCHEZ',
    flag: 'USA',
  },
  {
    id: 'ven-elguamache',
    name: 'EL GUAMACHE',
    flag: 'VEN',
  },
  {
    id: 'grl-aasiaat',
    name: 'AASIAAT',
    flag: 'GRL',
  },
  {
    id: 'gbr-whitehaven',
    name: 'WHITEHAVEN',
    flag: 'GBR',
  },
  {
    id: 'bel-bellekouter',
    name: 'BELLEKOUTER',
    flag: 'BEL',
  },
  {
    id: 'nor-vartdal',
    name: 'VARTDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-tyssedal',
    name: 'TYSSEDAL',
    flag: 'NOR',
  },
  {
    id: 'deu-heiligenhafen',
    name: 'HEILIGENHAFEN',
    flag: 'DEU',
  },
  {
    id: 'cod-banana',
    name: 'BANANA',
    flag: 'COD',
  },
  {
    id: 'svk-bratislava',
    name: 'BRATISLAVA',
    flag: 'SVK',
  },
  {
    id: 'grc-mykonos',
    name: 'MYKONOS',
    flag: 'GRC',
  },
  {
    id: 'tha-phiphiisland',
    name: 'PHI PHI ISLAND',
    flag: 'THA',
  },
  {
    id: 'idn-tahuna',
    name: 'TAHUNA',
    flag: 'IDN',
  },
  {
    id: 'jpn-uwajima',
    name: 'UWAJIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kushiro',
    name: 'KUSHIRO',
    flag: 'JPN',
  },
  {
    id: 'aus-brisbane',
    name: 'BRISBANE',
    flag: 'AUS',
  },
  {
    id: 'usa-bolivar',
    name: 'BOLIVAR',
    flag: 'USA',
  },
  {
    id: 'esp-puertorico',
    name: 'PUERTO RICO',
    flag: 'ESP',
  },
  {
    id: 'irl-rosslare',
    name: 'ROSSLARE',
    flag: 'IRL',
  },
  {
    id: 'nor-steinshamn',
    name: 'STEINSHAMN',
    flag: 'NOR',
  },
  {
    id: 'ind-chennai',
    name: 'CHENNAI',
    flag: 'IND',
  },
  {
    id: 'geo-supsa',
    name: 'SUPSA',
    flag: 'GEO',
  },
  {
    id: 'nor-slemmestad',
    name: 'SLEMMESTAD',
    flag: 'NOR',
  },
  {
    id: 'cyp-kyrenia',
    name: 'KYRENIA',
    flag: 'CYP',
  },
  {
    id: 'fin-pietarsaari',
    name: 'PIETARSAARI',
    flag: 'FIN',
  },
  {
    id: 'can-cashelcove',
    name: 'CASHEL COVE',
    flag: 'CAN',
  },
  {
    id: 'gbr-erith',
    name: 'ERITH',
    flag: 'GBR',
  },
  {
    id: 'nga-koko',
    name: 'KOKO',
    flag: 'NGA',
  },
  {
    id: 'swe-grebbestad',
    name: 'GREBBESTAD',
    flag: 'SWE',
  },
  {
    id: 'swe-harnosand',
    name: 'HARNOSAND',
    flag: 'SWE',
  },
  {
    id: 'aus-hastings',
    name: 'HASTINGS',
    flag: 'AUS',
  },
  {
    id: 'pan-amadorcruiseport',
    name: 'AMADOR CRUISE PORT',
    flag: 'PAN',
  },
  {
    id: 'usa-jacksonville',
    name: 'JACKSONVILLE',
    flag: 'USA',
  },
  {
    id: 'aze-absheron',
    name: 'ABSHERON',
    flag: 'AZE',
  },
  {
    id: 'atg-codrington',
    name: 'CODRINGTON',
    flag: 'ATG',
  },
  {
    id: 'gbr-reedham',
    name: 'REEDHAM',
    flag: 'GBR',
  },
  {
    id: 'aus-southbrisbane',
    name: 'SOUTH BRISBANE',
    flag: 'AUS',
  },
  {
    id: 'ita-marzamemi',
    name: 'MARZAMEMI',
    flag: 'ITA',
  },
  {
    id: 'phl-sangat',
    name: 'SANGAT',
    flag: 'PHL',
  },
  {
    id: 'idn-telukbatang',
    name: 'TELUK BATANG',
    flag: 'IDN',
  },
  {
    id: 'pri-fajardo',
    name: 'FAJARDO',
    flag: 'PRI',
  },
  {
    id: 'cpv-viladomaio',
    name: 'VILA DO MAIO',
    flag: 'CPV',
  },
  {
    id: 'gbr-mostyn',
    name: 'MOSTYN',
    flag: 'GBR',
  },
  {
    id: 'fra-etel',
    name: 'ETEL',
    flag: 'FRA',
  },
  {
    id: 'nld-sluiskil',
    name: 'SLUISKIL',
    flag: 'NLD',
  },
  {
    id: 'nld-wemeldinge',
    name: 'WEMELDINGE',
    flag: 'NLD',
  },
  {
    id: 'ita-chiavari',
    name: 'CHIAVARI',
    flag: 'ITA',
  },
  {
    id: 'nor-brevik',
    name: 'BREVIK',
    flag: 'NOR',
  },
  {
    id: 'swe-taernoelaxboden',
    name: 'TAERNOE LAXBODEN',
    flag: 'SWE',
  },
  {
    id: 'hrv-rogoznica',
    name: 'ROGOZNICA',
    flag: 'HRV',
  },
  {
    id: 'ita-bisceglie',
    name: 'BISCEGLIE',
    flag: 'ITA',
  },
  {
    id: 'srb-backapalanka',
    name: 'BACKA PALANKA',
    flag: 'SRB',
  },
  {
    id: 'egy-suezport',
    name: 'SUEZ PORT',
    flag: 'EGY',
  },
  {
    id: 'egy-rasshukhier',
    name: 'RAS SHUKHIER',
    flag: 'EGY',
  },
  {
    id: 'tha-phuket',
    name: 'PHUKET',
    flag: 'THA',
  },
  {
    id: 'chn-liuao',
    name: 'LIUAO',
    flag: 'CHN',
  },
  {
    id: 'chn-changzhou',
    name: 'CHANGZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-zoushan',
    name: 'ZOUSHAN',
    flag: 'CHN',
  },
  {
    id: 'jpn-ichikikushikino',
    name: 'ICHIKIKUSHIKINO',
    flag: 'JPN',
  },
  {
    id: 'fra-roscanvel',
    name: 'ROSCANVEL',
    flag: 'FRA',
  },
  {
    id: 'ita-civitanova',
    name: 'CIVITANOVA',
    flag: 'ITA',
  },
  {
    id: 'nor-gibostad',
    name: 'GIBOSTAD',
    flag: 'NOR',
  },
  {
    id: 'omn-sohar',
    name: 'SOHAR',
    flag: 'OMN',
  },
  {
    id: 'prt-sagres',
    name: 'SAGRES',
    flag: 'PRT',
  },
  {
    id: 'swe-simrishamn',
    name: 'SIMRISHAMN',
    flag: 'SWE',
  },
  {
    id: 'are-jebelali',
    name: 'JEBEL ALI',
    flag: 'ARE',
  },
  {
    id: 'chn-luhuashananchorage',
    name: 'LUHUASHAN ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'civ-sanpedro',
    name: 'SAN PEDRO',
    flag: 'CIV',
  },
  {
    id: 'chn-majishananchorage',
    name: 'MAJISHAN ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'mex-dosbocasanchorage',
    name: 'DOS BOCAS ANCHORAGE',
    flag: 'MEX',
  },
  {
    id: 'are-khorfakkan',
    name: 'KHOR FAKKAN',
    flag: 'ARE',
  },
  {
    id: 'usa-oysterbay',
    name: 'OYSTER BAY',
    flag: 'USA',
  },
  {
    id: 'nld-sliedrecht',
    name: 'SLIEDRECHT',
    flag: 'NLD',
  },
  {
    id: 'prk-wonsan',
    name: 'WONSAN',
    flag: 'PRK',
  },
  {
    id: 'jpn-tomakomai',
    name: 'TOMAKOMAI',
    flag: 'JPN',
  },
  {
    id: 'usa-rivermarshathyatt',
    name: 'RIVER MARSH AT HYATT',
    flag: 'USA',
  },
  {
    id: 'esp-sansebastian',
    name: 'SAN SEBASTIAN',
    flag: 'ESP',
  },
  {
    id: 'nld-purmerend',
    name: 'PURMEREND',
    flag: 'NLD',
  },
  {
    id: 'usa-paulina',
    name: 'PAULINA',
    flag: 'USA',
  },
  {
    id: 'rus-yeysk',
    name: 'YEYSK',
    flag: 'RUS',
  },
  {
    id: 'nor-asgardstrand',
    name: 'ASGARDSTRAND',
    flag: 'NOR',
  },
  {
    id: 'irl-marinopoint',
    name: 'MARINO POINT',
    flag: 'IRL',
  },
  {
    id: 'mex-islamujeres',
    name: 'ISLA MUJERES',
    flag: 'MEX',
  },
  {
    id: 'chl-chonchi',
    name: 'CHONCHI',
    flag: 'CHL',
  },
  {
    id: 'pri-laparguera',
    name: 'LA PARGUERA',
    flag: 'PRI',
  },
  {
    id: 'vir-christiansted',
    name: 'CHRISTIANSTED',
    flag: 'VIR',
  },
  {
    id: 'nld-deventer',
    name: 'DEVENTER',
    flag: 'NLD',
  },
  {
    id: 'nga-brass',
    name: 'BRASS',
    flag: 'NGA',
  },
  {
    id: 'swe-lillaedet',
    name: 'LILLA EDET',
    flag: 'SWE',
  },
  {
    id: 'deu-dresden',
    name: 'DRESDEN',
    flag: 'DEU',
  },
  {
    id: 'aut-tulln',
    name: 'TULLN',
    flag: 'AUT',
  },
  {
    id: 'chn-qingdao',
    name: 'QINGDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-xingzaidao',
    name: 'XINGZAIDAO',
    flag: 'CHN',
  },
  {
    id: 'aus-tincanbay',
    name: 'TIN CAN BAY',
    flag: 'AUS',
  },
  {
    id: 'usa-twindolphin',
    name: 'TWIN DOLPHIN',
    flag: 'USA',
  },
  {
    id: 'slb-noroanchorage',
    name: 'NORO ANCHORAGE',
    flag: 'SLB',
  },
  {
    id: 'dom-riohaina',
    name: 'RIO HAINA',
    flag: 'DOM',
  },
  {
    id: 'rus-kaliningrad',
    name: 'KALININGRAD',
    flag: 'RUS',
  },
  {
    id: 'bhr-diyaralmuharraq',
    name: 'DIYAR AL MUHARRAQ',
    flag: 'BHR',
  },
  {
    id: 'phl-sanmiguel',
    name: 'SAN MIGUEL',
    flag: 'PHL',
  },
  {
    id: 'cub-nuevitasanchorage',
    name: 'NUEVITAS ANCHORAGE',
    flag: 'CUB',
  },
  {
    id: 'tur-icdas',
    name: 'ICDAS',
    flag: 'TUR',
  },
  {
    id: 'egy-suezsouthanchorage',
    name: 'SUEZ SOUTH ANCHORAGE',
    flag: 'EGY',
  },
  {
    id: 'are-zakumfield',
    name: 'ZAKUM FIELD',
    flag: 'ARE',
  },
  {
    id: 'esp-sanfeliudeguixols',
    name: 'SAN FELIU DE GUIXOLS',
    flag: 'ESP',
  },
  {
    id: 'deu-duisburg',
    name: 'DUISBURG',
    flag: 'DEU',
  },
  {
    id: 'ita-sistiana',
    name: 'SISTIANA',
    flag: 'ITA',
  },
  {
    id: 'nor-berg',
    name: 'BERG',
    flag: 'NOR',
  },
  {
    id: 'rus-kandalaksha',
    name: 'KANDALAKSHA',
    flag: 'RUS',
  },
  {
    id: 'phl-tubay',
    name: 'TUBAY',
    flag: 'PHL',
  },
  {
    id: 'usa-portorchard',
    name: 'PORT ORCHARD',
    flag: 'USA',
  },
  {
    id: 'pyf-nukuhiva',
    name: 'NUKU HIVA',
    flag: 'PYF',
  },
  {
    id: 'can-victoria',
    name: 'VICTORIA',
    flag: 'CAN',
  },
  {
    id: 'usa-st.helens',
    name: 'ST. HELENS',
    flag: 'USA',
  },
  {
    id: 'usa-atlantichighlands',
    name: 'ATLANTIC HIGHLANDS',
    flag: 'USA',
  },
  {
    id: 'ata-fildesbay',
    name: 'FILDES BAY',
    flag: 'ATA',
  },
  {
    id: 'dza-arzew',
    name: 'ARZEW',
    flag: 'DZA',
  },
  {
    id: 'swe-goteborg',
    name: 'GOTEBORG',
    flag: 'SWE',
  },
  {
    id: 'aut-linz',
    name: 'LINZ',
    flag: 'AUT',
  },
  {
    id: 'nor-breivikbotn',
    name: 'BREIVIKBOTN',
    flag: 'NOR',
  },
  {
    id: 'grc-sitia',
    name: 'SITIA',
    flag: 'GRC',
  },
  {
    id: 'est-sillamae',
    name: 'SILLAMAE',
    flag: 'EST',
  },
  {
    id: 'som-berbera',
    name: 'BERBERA',
    flag: 'SOM',
  },
  {
    id: 'ind-hazira',
    name: 'HAZIRA',
    flag: 'IND',
  },
  {
    id: 'idn-bontang',
    name: 'BONTANG',
    flag: 'IDN',
  },
  {
    id: 'chn-shipu',
    name: 'SHIPU',
    flag: 'CHN',
  },
  {
    id: 'fsm-kosrae',
    name: 'KOSRAE',
    flag: 'FSM',
  },
  {
    id: 'nor-osoyro',
    name: 'OSOYRO',
    flag: 'NOR',
  },
  {
    id: 'phl-calero',
    name: 'CALERO',
    flag: 'PHL',
  },
  {
    id: 'pyf-tahaa',
    name: 'TAHAA',
    flag: 'PYF',
  },
  {
    id: 'cog-djeno',
    name: 'DJENO',
    flag: 'COG',
  },
  {
    id: 'mys-pengerang',
    name: 'PENGERANG',
    flag: 'MYS',
  },
  {
    id: 'ecu-esmeraldas',
    name: 'ESMERALDAS',
    flag: 'ECU',
  },
  {
    id: 'are-buhaseerfield',
    name: 'BU HASEER FIELD',
    flag: 'ARE',
  },
  {
    id: 'prt-figueiradafoz',
    name: 'FIGUEIRA DA FOZ',
    flag: 'PRT',
  },
  {
    id: 'grc-alimos',
    name: 'ALIMOS',
    flag: 'GRC',
  },
  {
    id: 'ita-sarroch',
    name: 'SARROCH',
    flag: 'ITA',
  },
  {
    id: 'usa-northbeachanchorage',
    name: 'NORTH BEACH ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'nor-rognan',
    name: 'ROGNAN',
    flag: 'NOR',
  },
  {
    id: 'ita-cecina',
    name: 'CECINA',
    flag: 'ITA',
  },
  {
    id: 'bel-baasrode',
    name: 'BAASRODE',
    flag: 'BEL',
  },
  {
    id: 'nzl-pareanuibay',
    name: 'PAREANUI BAY',
    flag: 'NZL',
  },
  {
    id: 'mex-mazatlan',
    name: 'MAZATLAN',
    flag: 'MEX',
  },
  {
    id: 'glp-pointeapitre',
    name: 'POINTE A PITRE',
    flag: 'GLP',
  },
  {
    id: 'esp-playasanjuan',
    name: 'PLAYA SAN JUAN',
    flag: 'ESP',
  },
  {
    id: 'esp-adra',
    name: 'ADRA',
    flag: 'ESP',
  },
  {
    id: 'nld-doesburg',
    name: 'DOESBURG',
    flag: 'NLD',
  },
  {
    id: 'nor-stranda',
    name: 'STRANDA',
    flag: 'NOR',
  },
  {
    id: 'swe-karlstad',
    name: 'KARLSTAD',
    flag: 'SWE',
  },
  {
    id: 'ita-sanbenedettodeltronto',
    name: 'SAN BENEDETTO DEL TRONTO',
    flag: 'ITA',
  },
  {
    id: 'ita-licata',
    name: 'LICATA',
    flag: 'ITA',
  },
  {
    id: 'hrv-silba',
    name: 'SILBA',
    flag: 'HRV',
  },
  {
    id: 'grc-astacos',
    name: 'ASTACOS',
    flag: 'GRC',
  },
  {
    id: 'chn-sanya',
    name: 'SANYA',
    flag: 'CHN',
  },
  {
    id: 'idn-sampit',
    name: 'SAMPIT',
    flag: 'IDN',
  },
  {
    id: 'chn-suqian',
    name: 'SUQIAN',
    flag: 'CHN',
  },
  {
    id: 'phl-obong',
    name: 'OBONG',
    flag: 'PHL',
  },
  {
    id: 'jpn-owase',
    name: 'OWASE',
    flag: 'JPN',
  },
  {
    id: 'gum-apraharbor',
    name: 'APRA HARBOR',
    flag: 'GUM',
  },
  {
    id: 'sjm-bellsundanchorage',
    name: 'BELLSUND ANCHORAGE',
    flag: 'SJM',
  },
  {
    id: 'ita-stromboli',
    name: 'STROMBOLI',
    flag: 'ITA',
  },
  {
    id: 'yem-saleef',
    name: 'SALEEF',
    flag: 'YEM',
  },
  {
    id: 'jpn-shibushi',
    name: 'SHIBUSHI',
    flag: 'JPN',
  },
  {
    id: 'dom-caborojo',
    name: 'CABO ROJO',
    flag: 'DOM',
  },
  {
    id: 'col-tumaco',
    name: 'TUMACO',
    flag: 'COL',
  },
  {
    id: 'mys-malacca',
    name: 'MALACCA',
    flag: 'MYS',
  },
  {
    id: 'usa-buffaloia',
    name: 'BUFFALO IA',
    flag: 'USA',
  },
  {
    id: 'usa-tricfield',
    name: 'TRICFIELD',
    flag: 'USA',
  },
  {
    id: 'can-caraquet',
    name: 'CARAQUET',
    flag: 'CAN',
  },
  {
    id: 'esp-portocristo',
    name: 'PORTO CRISTO',
    flag: 'ESP',
  },
  {
    id: 'jpn-moji',
    name: 'MOJI',
    flag: 'JPN',
  },
  {
    id: 'gbr-aultbea',
    name: 'AULTBEA',
    flag: 'GBR',
  },
  {
    id: 'fra-auray',
    name: 'AURAY',
    flag: 'FRA',
  },
  {
    id: 'deu-dorpen',
    name: 'DORPEN',
    flag: 'DEU',
  },
  {
    id: 'deu-hanover',
    name: 'HANOVER',
    flag: 'DEU',
  },
  {
    id: 'ecu-manta',
    name: 'MANTA',
    flag: 'ECU',
  },
  {
    id: 'bhs-portroyal',
    name: 'PORT ROYAL',
    flag: 'BHS',
  },
  {
    id: 'sle-freetown',
    name: 'FREETOWN',
    flag: 'SLE',
  },
  {
    id: 'mar-tangermed',
    name: 'TANGER MED',
    flag: 'MAR',
  },
  {
    id: 'gbr-portishead',
    name: 'PORTISHEAD',
    flag: 'GBR',
  },
  {
    id: 'fra-arcachon',
    name: 'ARCACHON',
    flag: 'FRA',
  },
  {
    id: 'bel-deinze',
    name: 'DEINZE',
    flag: 'BEL',
  },
  {
    id: 'bel-ghent',
    name: 'GHENT',
    flag: 'BEL',
  },
  {
    id: 'nor-husnes',
    name: 'HUSNES',
    flag: 'NOR',
  },
  {
    id: 'ita-scoglitti',
    name: 'SCOGLITTI',
    flag: 'ITA',
  },
  {
    id: 'ita-lecastella',
    name: 'LE CASTELLA',
    flag: 'ITA',
  },
  {
    id: 'nor-honningsvag',
    name: 'HONNINGSVAG',
    flag: 'NOR',
  },
  {
    id: 'mys-bintulu',
    name: 'BINTULU',
    flag: 'MYS',
  },
  {
    id: 'chn-zhenjiang',
    name: 'ZHENJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-gouqiisland',
    name: 'GOUQI ISLAND',
    flag: 'CHN',
  },
  {
    id: 'jpn-yaizu',
    name: 'YAIZU',
    flag: 'JPN',
  },
  {
    id: 'bra-angradosreis',
    name: 'ANGRA DOS REIS',
    flag: 'BRA',
  },
  {
    id: 'esp-alicante',
    name: 'ALICANTE',
    flag: 'ESP',
  },
  {
    id: 'nor-larkollen',
    name: 'LARKOLLEN',
    flag: 'NOR',
  },
  {
    id: 'dnk-hundige',
    name: 'HUNDIGE',
    flag: 'DNK',
  },
  {
    id: 'grc-piraeus',
    name: 'PIRAEUS',
    flag: 'GRC',
  },
  {
    id: 'bhr-muharraq',
    name: 'MUHARRAQ',
    flag: 'BHR',
  },
  {
    id: 'ita-cetara',
    name: 'CETARA',
    flag: 'ITA',
  },
  {
    id: 'qat-halul',
    name: 'HALUL',
    flag: 'QAT',
  },
  {
    id: 'rus-azov',
    name: 'AZOV',
    flag: 'RUS',
  },
  {
    id: 'usa-georgetown',
    name: 'GEORGETOWN',
    flag: 'USA',
  },
  {
    id: 'usa-newburgh',
    name: 'NEWBURGH',
    flag: 'USA',
  },
  {
    id: 'ita-rosignanosolvay',
    name: 'ROSIGNANO SOLVAY',
    flag: 'ITA',
  },
  {
    id: 'fra-berre',
    name: 'BERRE',
    flag: 'FRA',
  },
  {
    id: 'dnk-lemvig',
    name: 'LEMVIG',
    flag: 'DNK',
  },
  {
    id: 'vgb-jostvandyke',
    name: 'JOST VAN DYKE',
    flag: 'VGB',
  },
  {
    id: 'ecu-baltra',
    name: 'BALTRA',
    flag: 'ECU',
  },
  {
    id: 'usa-bath',
    name: 'BATH',
    flag: 'USA',
  },
  {
    id: 'cpv-santamaria',
    name: 'SANTA MARIA',
    flag: 'CPV',
  },
  {
    id: 'idn-sikakap',
    name: 'SIKAKAP',
    flag: 'IDN',
  },
  {
    id: 'swe-aalstensmaabaatsham',
    name: 'AALSTEN SMAABAATSHAM',
    flag: 'SWE',
  },
  {
    id: 'nld-maarssen',
    name: 'MAARSSEN',
    flag: 'NLD',
  },
  {
    id: 'usa-mountdesert',
    name: 'MOUNT DESERT',
    flag: 'USA',
  },
  {
    id: 'usa-grandmarais',
    name: 'GRAND MARAIS',
    flag: 'USA',
  },
  {
    id: 'usa-freeport',
    name: 'FREEPORT',
    flag: 'USA',
  },
  {
    id: 'usa-portarthur',
    name: 'PORT ARTHUR',
    flag: 'USA',
  },
  {
    id: 'chl-corral',
    name: 'CORRAL',
    flag: 'CHL',
  },
  {
    id: 'glp-saintberthelemyanchorage',
    name: 'SAINT BERTHELEMY ANCHORAGE',
    flag: 'GLP',
  },
  {
    id: 'mtq-schoelcher',
    name: 'SCHOELCHER',
    flag: 'MTQ',
  },
  {
    id: 'isl-vestmannaeyjar',
    name: 'VESTMANNAEYJAR',
    flag: 'ISL',
  },
  {
    id: 'gbr-salcombe',
    name: 'SALCOMBE',
    flag: 'GBR',
  },
  {
    id: 'fra-larochelle',
    name: 'LA ROCHELLE',
    flag: 'FRA',
  },
  {
    id: 'gbr-portsmouth',
    name: 'PORTSMOUTH',
    flag: 'GBR',
  },
  {
    id: 'fra-divessurmer',
    name: 'DIVES SUR MER',
    flag: 'FRA',
  },
  {
    id: 'deu-mainz',
    name: 'MAINZ',
    flag: 'DEU',
  },
  {
    id: 'dnk-aalborg',
    name: 'AALBORG',
    flag: 'DNK',
  },
  {
    id: 'aut-melk',
    name: 'MELK',
    flag: 'AUT',
  },
  {
    id: 'ita-brindisi',
    name: 'BRINDISI',
    flag: 'ITA',
  },
  {
    id: 'chn-tieshan',
    name: 'TIESHAN',
    flag: 'CHN',
  },
  {
    id: 'idn-labuanbajo',
    name: 'LABUAN BAJO',
    flag: 'IDN',
  },
  {
    id: 'idn-ambon',
    name: 'AMBON',
    flag: 'IDN',
  },
  {
    id: 'kor-tongyeong',
    name: 'TONGYEONG',
    flag: 'KOR',
  },
  {
    id: 'jpn-sakata',
    name: 'SAKATA',
    flag: 'JPN',
  },
  {
    id: 'aus-palmbeach',
    name: 'PALM BEACH',
    flag: 'AUS',
  },
  {
    id: 'rus-petropavlovsk',
    name: 'PETROPAVLOVSK',
    flag: 'RUS',
  },
  {
    id: 'nzl-greymouth',
    name: 'GREYMOUTH',
    flag: 'NZL',
  },
  {
    id: 'arg-ushuaia',
    name: 'USHUAIA',
    flag: 'ARG',
  },
  {
    id: 'can-northsydney',
    name: 'NORTH SYDNEY',
    flag: 'CAN',
  },
  {
    id: 'moz-nacala',
    name: 'NACALA',
    flag: 'MOZ',
  },
  {
    id: 'pyf-uturoa',
    name: 'UTUROA',
    flag: 'PYF',
  },
  {
    id: 'bhs-adelaide',
    name: 'ADELAIDE',
    flag: 'BHS',
  },
  {
    id: 'idn-tarakan',
    name: 'TARAKAN',
    flag: 'IDN',
  },
  {
    id: 'aus-thevenard',
    name: 'THEVENARD',
    flag: 'AUS',
  },
  {
    id: 'dnk-hirsholm',
    name: 'HIRSHOLM',
    flag: 'DNK',
  },
  {
    id: 'bel-lier',
    name: 'LIER',
    flag: 'BEL',
  },
  {
    id: 'swe-vastervik',
    name: 'VASTERVIK',
    flag: 'SWE',
  },
  {
    id: 'fin-kaskinen',
    name: 'KASKINEN',
    flag: 'FIN',
  },
  {
    id: 'moz-quelimane',
    name: 'QUELIMANE',
    flag: 'MOZ',
  },
  {
    id: 'nor-karsto',
    name: 'KARSTO',
    flag: 'NOR',
  },
  {
    id: 'idn-mahakamdelta',
    name: 'MAHAKAM DELTA',
    flag: 'IDN',
  },
  {
    id: 'grc-dokos',
    name: 'DOKOS',
    flag: 'GRC',
  },
  {
    id: 'phl-navotas',
    name: 'NAVOTAS',
    flag: 'PHL',
  },
  {
    id: 'bra-santosanchorage',
    name: 'SANTOS ANCHORAGE',
    flag: 'BRA',
  },
  {
    id: 'esp-calanova',
    name: 'CALANOVA',
    flag: 'ESP',
  },
  {
    id: 'ita-caprera',
    name: 'CAPRERA',
    flag: 'ITA',
  },
  {
    id: 'dnk-nordby',
    name: 'NORDBY',
    flag: 'DNK',
  },
  {
    id: 'nld-hoogezand',
    name: 'HOOGEZAND',
    flag: 'NLD',
  },
  {
    id: 'nld-waterhuizen',
    name: 'WATERHUIZEN',
    flag: 'NLD',
  },
  {
    id: 'nld-lisse',
    name: 'LISSE',
    flag: 'NLD',
  },
  {
    id: 'grc-keri',
    name: 'KERI',
    flag: 'GRC',
  },
  {
    id: 'can-portmcneill',
    name: 'PORT MCNEILL',
    flag: 'CAN',
  },
  {
    id: 'usa-naplate',
    name: 'NAPLATE',
    flag: 'USA',
  },
  {
    id: 'usa-brunswick',
    name: 'BRUNSWICK',
    flag: 'USA',
  },
  {
    id: 'usa-deltaville',
    name: 'DELTAVILLE',
    flag: 'USA',
  },
  {
    id: 'cuw-littlecuracao',
    name: 'LITTLE CURACAO',
    flag: 'CUW',
  },
  {
    id: 'lca-vieuxfort',
    name: 'VIEUX FORT',
    flag: 'LCA',
  },
  {
    id: 'bra-portoalegre',
    name: 'PORTO ALEGRE',
    flag: 'BRA',
  },
  {
    id: 'bra-aratu',
    name: 'ARATU',
    flag: 'BRA',
  },
  {
    id: 'esp-celeiro',
    name: 'CELEIRO',
    flag: 'ESP',
  },
  {
    id: 'esp-motril',
    name: 'MOTRIL',
    flag: 'ESP',
  },
  {
    id: 'gbr-fraserburgh',
    name: 'FRASERBURGH',
    flag: 'GBR',
  },
  {
    id: 'fra-ambes',
    name: 'AMBES',
    flag: 'FRA',
  },
  {
    id: 'nld-vlissingen',
    name: 'VLISSINGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-denoever',
    name: 'DEN OEVER',
    flag: 'NLD',
  },
  {
    id: 'nor-sirevag',
    name: 'SIREVAG',
    flag: 'NOR',
  },
  {
    id: 'dnk-hanstholm',
    name: 'HANSTHOLM',
    flag: 'DNK',
  },
  {
    id: 'tun-bizerte',
    name: 'BIZERTE',
    flag: 'TUN',
  },
  {
    id: 'dnk-aarhus',
    name: 'AARHUS',
    flag: 'DNK',
  },
  {
    id: 'hun-neszmely',
    name: 'NESZMELY',
    flag: 'HUN',
  },
  {
    id: 'nor-hamnes',
    name: 'HAMNES',
    flag: 'NOR',
  },
  {
    id: 'tur-tasucu',
    name: 'TASUCU',
    flag: 'TUR',
  },
  {
    id: 'irn-bandarabbas',
    name: 'BANDAR ABBAS',
    flag: 'IRN',
  },
  {
    id: 'ind-mumbai',
    name: 'MUMBAI',
    flag: 'IND',
  },
  {
    id: 'chn-fangcheng',
    name: 'FANGCHENG',
    flag: 'CHN',
  },
  {
    id: 'aus-dunsborough',
    name: 'DUNSBOROUGH',
    flag: 'AUS',
  },
  {
    id: 'idn-kahyangan',
    name: 'KAHYANGAN',
    flag: 'IDN',
  },
  {
    id: 'chn-wuhu',
    name: 'WUHU',
    flag: 'CHN',
  },
  {
    id: 'chn-nantong',
    name: 'NANTONG',
    flag: 'CHN',
  },
  {
    id: 'twn-tamsuifishwharf',
    name: 'TAMSUI FISH WHARF',
    flag: 'TWN',
  },
  {
    id: 'can-portmellon',
    name: 'PORT MELLON',
    flag: 'CAN',
  },
  {
    id: 'mex-guaymas',
    name: 'GUAYMAS',
    flag: 'MEX',
  },
  {
    id: 'nor-varhaugvika',
    name: 'VARHAUGVIKA',
    flag: 'NOR',
  },
  {
    id: 'jpn-matsuyama',
    name: 'MATSUYAMA',
    flag: 'JPN',
  },
  {
    id: 'wsm-apia',
    name: 'APIA',
    flag: 'WSM',
  },
  {
    id: 'omn-shinas',
    name: 'SHINAS',
    flag: 'OMN',
  },
  {
    id: 'mhl-majuro',
    name: 'MAJURO',
    flag: 'MHL',
  },
  {
    id: 'col-barranquilla',
    name: 'BARRANQUILLA',
    flag: 'COL',
  },
  {
    id: 'nga-forcadosterminal',
    name: 'FORCADOS TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'mex-tuxpan',
    name: 'TUXPAN',
    flag: 'MEX',
  },
  {
    id: 'can-clarkson',
    name: 'CLARKSON',
    flag: 'CAN',
  },
  {
    id: 'usa-rockhall',
    name: 'ROCK HALL',
    flag: 'USA',
  },
  {
    id: 'esp-santona',
    name: 'SANTONA',
    flag: 'ESP',
  },
  {
    id: 'deu-tonning',
    name: 'TONNING',
    flag: 'DEU',
  },
  {
    id: 'chn-yingkou',
    name: 'YINGKOU',
    flag: 'CHN',
  },
  {
    id: 'ita-trieste',
    name: 'TRIESTE',
    flag: 'ITA',
  },
  {
    id: 'mys-kotakinabalu',
    name: 'KOTA KINABALU',
    flag: 'MYS',
  },
  {
    id: 'gbr-pembroke',
    name: 'PEMBROKE',
    flag: 'GBR',
  },
  {
    id: 'usa-burg',
    name: 'BURG',
    flag: 'USA',
  },
  {
    id: 'deu-kelheim',
    name: 'KELHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-leverkusen',
    name: 'LEVERKUSEN',
    flag: 'DEU',
  },
  {
    id: 'nor-gursken',
    name: 'GURSKEN',
    flag: 'NOR',
  },
  {
    id: 'usa-francisville',
    name: 'FRANCISVILLE',
    flag: 'USA',
  },
  {
    id: 'idn-pondokdadap',
    name: 'PONDOK DADAP',
    flag: 'IDN',
  },
  {
    id: 'usa-grandisle',
    name: 'GRAND ISLE',
    flag: 'USA',
  },
  {
    id: 'usa-silvergrove',
    name: 'SILVER GROVE',
    flag: 'USA',
  },
  {
    id: 'bhs-rwcruiseport',
    name: 'RW CRUISE PORT',
    flag: 'BHS',
  },
  {
    id: 'usa-rockland',
    name: 'ROCKLAND',
    flag: 'USA',
  },
  {
    id: 'bel-blankenberge',
    name: 'BLANKENBERGE',
    flag: 'BEL',
  },
  {
    id: 'nor-vedavagen',
    name: 'VEDAVAGEN',
    flag: 'NOR',
  },
  {
    id: 'deu-bonn',
    name: 'BONN',
    flag: 'DEU',
  },
  {
    id: 'swe-varberg',
    name: 'VARBERG',
    flag: 'SWE',
  },
  {
    id: 'ita-ravenna',
    name: 'RAVENNA',
    flag: 'ITA',
  },
  {
    id: 'nor-vaeroy',
    name: 'VAEROY',
    flag: 'NOR',
  },
  {
    id: 'ago-lobito',
    name: 'LOBITO',
    flag: 'AGO',
  },
  {
    id: 'swe-trosa',
    name: 'TROSA',
    flag: 'SWE',
  },
  {
    id: 'nor-tromso',
    name: 'TROMSO',
    flag: 'NOR',
  },
  {
    id: 'srb-kladovo',
    name: 'KLADOVO',
    flag: 'SRB',
  },
  {
    id: 'tur-kapakli',
    name: 'KAPAKLI',
    flag: 'TUR',
  },
  {
    id: 'omn-muscat',
    name: 'MUSCAT',
    flag: 'OMN',
  },
  {
    id: 'chn-ganjiang',
    name: 'GANJIANG',
    flag: 'CHN',
  },
  {
    id: 'kor-busan',
    name: 'BUSAN',
    flag: 'KOR',
  },
  {
    id: 'kor-samcheok',
    name: 'SAMCHEOK',
    flag: 'KOR',
  },
  {
    id: 'fji-levuka',
    name: 'LEVUKA',
    flag: 'FJI',
  },
  {
    id: 'usa-estherisland',
    name: 'ESTHER ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-northcove',
    name: 'NORTH COVE',
    flag: 'USA',
  },
  {
    id: 'esp-malaga',
    name: 'MALAGA',
    flag: 'ESP',
  },
  {
    id: 'gbr-kirkwall',
    name: 'KIRKWALL',
    flag: 'GBR',
  },
  {
    id: 'swe-falkenberg',
    name: 'FALKENBERG',
    flag: 'SWE',
  },
  {
    id: 'fin-sapokkaguestmarina',
    name: 'SAPOKKA GUEST MARINA',
    flag: 'FIN',
  },
  {
    id: 'moz-maputo',
    name: 'MAPUTO',
    flag: 'MOZ',
  },
  {
    id: 'jpn-tateyama',
    name: 'TATEYAMA',
    flag: 'JPN',
  },
  {
    id: 'mys-pasirgudang',
    name: 'PASIR GUDANG',
    flag: 'MYS',
  },
  {
    id: 'tto-pointlisas',
    name: 'POINT LISAS',
    flag: 'TTO',
  },
  {
    id: 'can-meldrumbay',
    name: 'MELDRUM BAY',
    flag: 'CAN',
  },
  {
    id: 'ven-bachaquero',
    name: 'BACHAQUERO',
    flag: 'VEN',
  },
  {
    id: 'gbr-islesofscilly',
    name: 'ISLES OF SCILLY',
    flag: 'GBR',
  },
  {
    id: 'deu-kleinostheim',
    name: 'KLEINOSTHEIM',
    flag: 'DEU',
  },
  {
    id: 'swe-nykoping',
    name: 'NYKOPING',
    flag: 'SWE',
  },
  {
    id: 'hun-szob',
    name: 'SZOB',
    flag: 'HUN',
  },
  {
    id: 'ton-pangai',
    name: 'PANGAI',
    flag: 'TON',
  },
  {
    id: 'deu-wewelsfleth',
    name: 'WEWELSFLETH',
    flag: 'DEU',
  },
  {
    id: 'dnk-stevnspier',
    name: 'STEVNS PIER',
    flag: 'DNK',
  },
  {
    id: 'nor-holmestrand',
    name: 'HOLMESTRAND',
    flag: 'NOR',
  },
  {
    id: 'jpn-ikedaanchorage',
    name: 'IKEDA ANCHORAGE',
    flag: 'JPN',
  },
  {
    id: 'can-cornerbrook',
    name: 'CORNER BROOK',
    flag: 'CAN',
  },
  {
    id: 'can-chemainus',
    name: 'CHEMAINUS',
    flag: 'CAN',
  },
  {
    id: 'deu-rheinau',
    name: 'RHEINAU',
    flag: 'DEU',
  },
  {
    id: 'pan-rodman',
    name: 'RODMAN',
    flag: 'PAN',
  },
  {
    id: 'nld-roosendaal',
    name: 'ROOSENDAAL',
    flag: 'NLD',
  },
  {
    id: 'nld-vollenhove',
    name: 'VOLLENHOVE',
    flag: 'NLD',
  },
  {
    id: 'idn-teladas',
    name: 'TELADAS',
    flag: 'IDN',
  },
  {
    id: 'usa-pearlharbor',
    name: 'PEARL HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-blakeisland',
    name: 'BLAKE ISLAND',
    flag: 'USA',
  },
  {
    id: 'mex-santarosalia',
    name: 'SANTA ROSALIA',
    flag: 'MEX',
  },
  {
    id: 'ury-paysandu',
    name: 'PAYSANDU',
    flag: 'URY',
  },
  {
    id: 'esp-barbate',
    name: 'BARBATE',
    flag: 'ESP',
  },
  {
    id: 'fra-bayonne',
    name: 'BAYONNE',
    flag: 'FRA',
  },
  {
    id: 'nld-hellevoetsluis',
    name: 'HELLEVOETSLUIS',
    flag: 'NLD',
  },
  {
    id: 'swe-malmo',
    name: 'MALMO',
    flag: 'SWE',
  },
  {
    id: 'hrv-milna',
    name: 'MILNA',
    flag: 'HRV',
  },
  {
    id: 'tur-gemlik',
    name: 'GEMLIK',
    flag: 'TUR',
  },
  {
    id: 'mys-miri',
    name: 'MIRI',
    flag: 'MYS',
  },
  {
    id: 'idn-lembar',
    name: 'LEMBAR',
    flag: 'IDN',
  },
  {
    id: 'nzl-wellington',
    name: 'WELLINGTON',
    flag: 'NZL',
  },
  {
    id: 'usa-eastport',
    name: 'EASTPORT',
    flag: 'USA',
  },
  {
    id: 'fra-roscoff',
    name: 'ROSCOFF',
    flag: 'FRA',
  },
  {
    id: 'ita-formia',
    name: 'FORMIA',
    flag: 'ITA',
  },
  {
    id: 'chn-bohe',
    name: 'BOHE',
    flag: 'CHN',
  },
  {
    id: 'phl-carrascal',
    name: 'CARRASCAL',
    flag: 'PHL',
  },
  {
    id: 'mex-puntademita',
    name: 'PUNTA DE MITA',
    flag: 'MEX',
  },
  {
    id: 'grc-alexandroupoli',
    name: 'ALEXANDROUPOLI',
    flag: 'GRC',
  },
  {
    id: 'jpn-hannan',
    name: 'HANNAN',
    flag: 'JPN',
  },
  {
    id: 'deu-bremerhavenanchorage',
    name: 'BREMERHAVEN ANCHORAGE',
    flag: 'DEU',
  },
  {
    id: 'bra-fpsocapixaba',
    name: 'FPSO CAPIXABA',
    flag: 'BRA',
  },
  {
    id: 'can-thorold',
    name: 'THOROLD',
    flag: 'CAN',
  },
  {
    id: 'prt-viladoporto',
    name: 'VILA DO PORTO',
    flag: 'PRT',
  },
  {
    id: 'dnk-horuphav',
    name: 'HORUPHAV',
    flag: 'DNK',
  },
  {
    id: "ita-sant'angelo",
    name: "SANT'ANGELO",
    flag: 'ITA',
  },
  {
    id: 'rus-otradnoye',
    name: 'OTRADNOYE',
    flag: 'RUS',
  },
  {
    id: 'aus-dampier',
    name: 'DAMPIER',
    flag: 'AUS',
  },
  {
    id: 'usa-reedville',
    name: 'REEDVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-smithcove',
    name: 'SMITH COVE',
    flag: 'USA',
  },
  {
    id: 'aze-absheronanchorage',
    name: 'ABSHERON ANCHORAGE',
    flag: 'AZE',
  },
  {
    id: 'phl-bolo',
    name: 'BOLO',
    flag: 'PHL',
  },
  {
    id: 'bel-hasselt',
    name: 'HASSELT',
    flag: 'BEL',
  },
  {
    id: 'aut-schwechat',
    name: 'SCHWECHAT',
    flag: 'AUT',
  },
  {
    id: 'idn-asemdoyong',
    name: 'ASEM DOYONG',
    flag: 'IDN',
  },
  {
    id: 'cri-quepos',
    name: 'QUEPOS',
    flag: 'CRI',
  },
  {
    id: 'bhs-compasscay',
    name: 'COMPASS CAY',
    flag: 'BHS',
  },
  {
    id: 'usa-capemaycorinthian',
    name: 'CAPE MAY CORINTHIAN',
    flag: 'USA',
  },
  {
    id: 'fra-portjerome',
    name: 'PORT JEROME',
    flag: 'FRA',
  },
  {
    id: 'nor-sauda',
    name: 'SAUDA',
    flag: 'NOR',
  },
  {
    id: 'dnk-skagen',
    name: 'SKAGEN',
    flag: 'DNK',
  },
  {
    id: 'swe-gotaalvtrollhatten',
    name: 'GOTA ALV TROLLHATTEN',
    flag: 'SWE',
  },
  {
    id: 'lva-mersrags',
    name: 'MERSRAGS',
    flag: 'LVA',
  },
  {
    id: 'nor-kvalsund',
    name: 'KVALSUND',
    flag: 'NOR',
  },
  {
    id: 'qat-mesaieed',
    name: 'MESAIEED',
    flag: 'QAT',
  },
  {
    id: 'chn-dongping',
    name: 'DONGPING',
    flag: 'CHN',
  },
  {
    id: 'chn-huizhou',
    name: 'HUIZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-maanshan',
    name: 'MAANSHAN',
    flag: 'CHN',
  },
  {
    id: 'phl-sangali',
    name: 'SANGALI',
    flag: 'PHL',
  },
  {
    id: 'fra-saintbrieuc',
    name: 'SAINT BRIEUC',
    flag: 'FRA',
  },
  {
    id: 'swe-karlsborg',
    name: 'KARLSBORG',
    flag: 'SWE',
  },
  {
    id: 'png-kimbe',
    name: 'KIMBE',
    flag: 'PNG',
  },
  {
    id: 'sau-rasalmishab',
    name: 'RAS AL MISHAB',
    flag: 'SAU',
  },
  {
    id: 'jpn-kobe',
    name: 'KOBE',
    flag: 'JPN',
  },
  {
    id: 'ury-recaladaanchorage',
    name: 'RECALADA ANCHORAGE',
    flag: 'URY',
  },
  {
    id: 'usa-gigharbor',
    name: 'GIG HARBOR',
    flag: 'USA',
  },
  {
    id: 'ury-carmelo',
    name: 'CARMELO',
    flag: 'URY',
  },
  {
    id: 'pry-concepcion',
    name: 'CONCEPCION',
    flag: 'PRY',
  },
  {
    id: 'grl-qeqertarsuaq',
    name: 'QEQERTARSUAQ',
    flag: 'GRL',
  },
  {
    id: 'deu-cochem',
    name: 'COCHEM',
    flag: 'DEU',
  },
  {
    id: 'bgr-tutrakan',
    name: 'TUTRAKAN',
    flag: 'BGR',
  },
  {
    id: 'ukr-novakakhovka',
    name: 'NOVA KAKHOVKA',
    flag: 'UKR',
  },
  {
    id: 'usa-pointdefiance',
    name: 'POINT DEFIANCE',
    flag: 'USA',
  },
  {
    id: 'hrv-punat',
    name: 'PUNAT',
    flag: 'HRV',
  },
  {
    id: 'fin-naantali',
    name: 'NAANTALI',
    flag: 'FIN',
  },
  {
    id: 'png-vanimo',
    name: 'VANIMO',
    flag: 'PNG',
  },
  {
    id: 'deu-stade',
    name: 'STADE',
    flag: 'DEU',
  },
  {
    id: 'hun-madocsa',
    name: 'MADOCSA',
    flag: 'HUN',
  },
  {
    id: 'usa-edmondsyachtclub',
    name: 'EDMONDS YACHT CLUB',
    flag: 'USA',
  },
  {
    id: 'usa-scituate',
    name: 'SCITUATE',
    flag: 'USA',
  },
  {
    id: 'esp-carino',
    name: 'CARINO',
    flag: 'ESP',
  },
  {
    id: 'gbr-tobermory',
    name: 'TOBERMORY',
    flag: 'GBR',
  },
  {
    id: 'esp-marbella',
    name: 'MARBELLA',
    flag: 'ESP',
  },
  {
    id: 'gbr-invergordon',
    name: 'INVERGORDON',
    flag: 'GBR',
  },
  {
    id: 'esp-cambrils',
    name: 'CAMBRILS',
    flag: 'ESP',
  },
  {
    id: 'fra-valenciennnes',
    name: 'VALENCIENNNES',
    flag: 'FRA',
  },
  {
    id: 'nld-edam',
    name: 'EDAM',
    flag: 'NLD',
  },
  {
    id: 'nor-granvin',
    name: 'GRANVIN',
    flag: 'NOR',
  },
  {
    id: 'nor-kristiansund',
    name: 'KRISTIANSUND',
    flag: 'NOR',
  },
  {
    id: 'deu-walluf',
    name: 'WALLUF',
    flag: 'DEU',
  },
  {
    id: 'deu-nordenham',
    name: 'NORDENHAM',
    flag: 'DEU',
  },
  {
    id: 'nor-kolvereid',
    name: 'KOLVEREID',
    flag: 'NOR',
  },
  {
    id: 'nam-luderitz',
    name: 'LUDERITZ',
    flag: 'NAM',
  },
  {
    id: 'hrv-komiza',
    name: 'KOMIZA',
    flag: 'HRV',
  },
  {
    id: 'hun-harta',
    name: 'HARTA',
    flag: 'HUN',
  },
  {
    id: 'irn-asaluyeh',
    name: 'ASALUYEH',
    flag: 'IRN',
  },
  {
    id: 'chn-nanjing',
    name: 'NANJING',
    flag: 'CHN',
  },
  {
    id: 'chn-yizheng',
    name: 'YIZHENG',
    flag: 'CHN',
  },
  {
    id: 'phl-batangascity',
    name: 'BATANGAS CITY',
    flag: 'PHL',
  },
  {
    id: 'phl-generalsantos',
    name: 'GENERAL SANTOS',
    flag: 'PHL',
  },
  {
    id: 'can-tsawwassen',
    name: 'TSAWWASSEN',
    flag: 'CAN',
  },
  {
    id: 'fra-lanapoule',
    name: 'LA NAPOULE',
    flag: 'FRA',
  },
  {
    id: 'ita-pescara',
    name: 'PESCARA',
    flag: 'ITA',
  },
  {
    id: 'ita-roccellaionica',
    name: 'ROCCELLA IONICA',
    flag: 'ITA',
  },
  {
    id: 'idn-luwuk',
    name: 'LUWUK',
    flag: 'IDN',
  },
  {
    id: 'jpn-kashima',
    name: 'KASHIMA',
    flag: 'JPN',
  },
  {
    id: 'idn-biringkassi',
    name: 'BIRINGKASSI',
    flag: 'IDN',
  },
  {
    id: 'nor-naersnes',
    name: 'NAERSNES',
    flag: 'NOR',
  },
  {
    id: 'swe-jungfrusundroad',
    name: 'JUNGFRUSUND ROAD',
    flag: 'SWE',
  },
  {
    id: 'irn-abadan',
    name: 'ABADAN',
    flag: 'IRN',
  },
  {
    id: 'tkm-hazar',
    name: 'HAZAR',
    flag: 'TKM',
  },
  {
    id: 'jpn-osaka',
    name: 'OSAKA',
    flag: 'JPN',
  },
  {
    id: 'ita-torreannunziata',
    name: 'TORRE ANNUNZIATA',
    flag: 'ITA',
  },
  {
    id: 'omn-minaalfahlanchorage',
    name: 'MINA AL FAHL ANCHORAGE',
    flag: 'OMN',
  },
  {
    id: 'aus-portbonython',
    name: 'PORT BONYTHON',
    flag: 'AUS',
  },
  {
    id: 'bel-gevaarts',
    name: 'GEVAARTS',
    flag: 'BEL',
  },
  {
    id: 'chl-isladepascua',
    name: 'ISLA DE PASCUA',
    flag: 'CHL',
  },
  {
    id: 'nld-drimmelen',
    name: 'DRIMMELEN',
    flag: 'NLD',
  },
  {
    id: 'aut-weinzierlbeikrems',
    name: 'WEINZIERL BEI KREMS',
    flag: 'AUT',
  },
  {
    id: 'swe-moerbylaanga',
    name: 'MOERBYLAANGA',
    flag: 'SWE',
  },
  {
    id: 'deu-stuttgart',
    name: 'STUTTGART',
    flag: 'DEU',
  },
  {
    id: 'grc-vonitsa',
    name: 'VONITSA',
    flag: 'GRC',
  },
  {
    id: 'usa-anchorage',
    name: 'ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-portludlow',
    name: 'PORT LUDLOW',
    flag: 'USA',
  },
  {
    id: 'usa-danapoint',
    name: 'DANA POINT',
    flag: 'USA',
  },
  {
    id: 'usa-sandwich',
    name: 'SANDWICH',
    flag: 'USA',
  },
  {
    id: 'usa-chatham',
    name: 'CHATHAM',
    flag: 'USA',
  },
  {
    id: 'pri-lasmareas',
    name: 'LAS MAREAS',
    flag: 'PRI',
  },
  {
    id: 'mtq-lemarin',
    name: 'LE MARIN',
    flag: 'MTQ',
  },
  {
    id: 'guf-degraddescannes',
    name: 'DEGRAD DES CANNES',
    flag: 'GUF',
  },
  {
    id: 'bra-botafogo',
    name: 'BOTAFOGO',
    flag: 'BRA',
  },
  {
    id: 'irl-bereisland',
    name: 'BERE ISLAND',
    flag: 'IRL',
  },
  {
    id: 'gbr-ballycastle',
    name: 'BALLYCASTLE',
    flag: 'GBR',
  },
  {
    id: 'fra-concarneau',
    name: 'CONCARNEAU',
    flag: 'FRA',
  },
  {
    id: 'gbr-leith',
    name: 'LEITH',
    flag: 'GBR',
  },
  {
    id: 'gbr-ellesmere',
    name: 'ELLESMERE',
    flag: 'GBR',
  },
  {
    id: 'fra-laturballe',
    name: 'LA TURBALLE',
    flag: 'FRA',
  },
  {
    id: 'fra-fecamp',
    name: 'FECAMP',
    flag: 'FRA',
  },
  {
    id: 'esp-formentera',
    name: 'FORMENTERA',
    flag: 'ESP',
  },
  {
    id: 'fra-portmarly',
    name: 'PORT MARLY',
    flag: 'FRA',
  },
  {
    id: 'deu-dorsten',
    name: 'DORSTEN',
    flag: 'DEU',
  },
  {
    id: 'deu-gernsheim',
    name: 'GERNSHEIM',
    flag: 'DEU',
  },
  {
    id: 'nor-sunndalsora',
    name: 'SUNNDALSORA',
    flag: 'NOR',
  },
  {
    id: 'dnk-munkebo',
    name: 'MUNKEBO',
    flag: 'DNK',
  },
  {
    id: 'dnk-hundested',
    name: 'HUNDESTED',
    flag: 'DNK',
  },
  {
    id: 'deu-deggendorf',
    name: 'DEGGENDORF',
    flag: 'DEU',
  },
  {
    id: 'ita-porticellos.flavia',
    name: 'PORTICELLO S. FLAVIA',
    flag: 'ITA',
  },
  {
    id: 'ita-marinadiragusa',
    name: 'MARINA DI RAGUSA',
    flag: 'ITA',
  },
  {
    id: 'nor-kamoyvaer',
    name: 'KAMOYVAER',
    flag: 'NOR',
  },
  {
    id: 'grc-rhodes',
    name: 'RHODES',
    flag: 'GRC',
  },
  {
    id: 'rou-midia',
    name: 'MIDIA',
    flag: 'ROU',
  },
  {
    id: 'chn-wuhan',
    name: 'WUHAN',
    flag: 'CHN',
  },
  {
    id: 'aus-bongaree',
    name: 'BONGAREE',
    flag: 'AUS',
  },
  {
    id: 'grc-perama',
    name: 'PERAMA',
    flag: 'GRC',
  },
  {
    id: 'grc-kimolos',
    name: 'KIMOLOS',
    flag: 'GRC',
  },
  {
    id: 'jpn-atami',
    name: 'ATAMI',
    flag: 'JPN',
  },
  {
    id: 'som-kismaayo',
    name: 'KISMAAYO',
    flag: 'SOM',
  },
  {
    id: 'irn-lengeh',
    name: 'LENGEH',
    flag: 'IRN',
  },
  {
    id: 'ind-dahej',
    name: 'DAHEJ',
    flag: 'IND',
  },
  {
    id: 'bra-santos',
    name: 'SANTOS',
    flag: 'BRA',
  },
  {
    id: 'nga-oduduterminal',
    name: 'ODUDU TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'swe-ronnskar',
    name: 'RONNSKAR',
    flag: 'SWE',
  },
  {
    id: 'jpn-chiba',
    name: 'CHIBA',
    flag: 'JPN',
  },
  {
    id: 'usa-tiverton',
    name: 'TIVERTON',
    flag: 'USA',
  },
  {
    id: 'rus-kazan',
    name: 'KAZAN',
    flag: 'RUS',
  },
  {
    id: 'dnk-augustenborg',
    name: 'AUGUSTENBORG',
    flag: 'DNK',
  },
  {
    id: 'idn-bacan',
    name: 'BACAN',
    flag: 'IDN',
  },
  {
    id: 'kor-anjeong',
    name: 'ANJEONG',
    flag: 'KOR',
  },
  {
    id: 'deu-heilbronn',
    name: 'HEILBRONN',
    flag: 'DEU',
  },
  {
    id: 'nld-heijen',
    name: 'HEIJEN',
    flag: 'NLD',
  },
  {
    id: 'usa-andersonbay',
    name: 'ANDERSON BAY',
    flag: 'USA',
  },
  {
    id: 'esp-puertodelasnieves',
    name: 'PUERTO DE LAS NIEVES',
    flag: 'ESP',
  },
  {
    id: 'gbr-scalloway',
    name: 'SCALLOWAY',
    flag: 'GBR',
  },
  {
    id: 'fra-bonifacio',
    name: 'BONIFACIO',
    flag: 'FRA',
  },
  {
    id: 'ita-liparianchorage',
    name: 'LIPARI ANCHORAGE',
    flag: 'ITA',
  },
  {
    id: 'srb-belgrade',
    name: 'BELGRADE',
    flag: 'SRB',
  },
  {
    id: 'lbn-chekka',
    name: 'CHEKKA',
    flag: 'LBN',
  },
  {
    id: 'irn-bandarimamkhomeini',
    name: 'BANDAR IMAM KHOMEINI',
    flag: 'IRN',
  },
  {
    id: 'chn-guangzhou',
    name: 'GUANGZHOU',
    flag: 'CHN',
  },
  {
    id: 'aus-queenscliff',
    name: 'QUEENSCLIFF',
    flag: 'AUS',
  },
  {
    id: 'aus-lakesentrance',
    name: 'LAKES ENTRANCE',
    flag: 'AUS',
  },
  {
    id: 'vut-santo',
    name: 'SANTO',
    flag: 'VUT',
  },
  {
    id: 'nzl-newplymouth',
    name: 'NEW PLYMOUTH',
    flag: 'NZL',
  },
  {
    id: 'fji-aven',
    name: 'AVEN',
    flag: 'FJI',
  },
  {
    id: 'chl-villapuertoeden',
    name: 'VILLA PUERTO EDEN',
    flag: 'CHL',
  },
  {
    id: 'usa-boston',
    name: 'BOSTON',
    flag: 'USA',
  },
  {
    id: 'esp-loscaideros',
    name: 'LOS CAIDEROS',
    flag: 'ESP',
  },
  {
    id: 'nld-oudeschild',
    name: 'OUDESCHILD',
    flag: 'NLD',
  },
  {
    id: 'nor-akrehamn',
    name: 'AKREHAMN',
    flag: 'NOR',
  },
  {
    id: 'rus-svetly',
    name: 'SVETLY',
    flag: 'RUS',
  },
  {
    id: 'grc-soudaanchorage',
    name: 'SOUDA ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'chn-huangdao',
    name: 'HUANGDAO',
    flag: 'CHN',
  },
  {
    id: 'deu-borkum',
    name: 'BORKUM',
    flag: 'DEU',
  },
  {
    id: 'mdg-tulear',
    name: 'TULEAR',
    flag: 'MDG',
  },
  {
    id: 'jpn-wakayamaanchorage',
    name: 'WAKAYAMA ANCHORAGE',
    flag: 'JPN',
  },
  {
    id: 'ita-gela',
    name: 'GELA',
    flag: 'ITA',
  },
  {
    id: 'jpn-kisarazu',
    name: 'KISARAZU',
    flag: 'JPN',
  },
  {
    id: 'png-kumul',
    name: 'KUMUL',
    flag: 'PNG',
  },
  {
    id: 'dnk-haderslev',
    name: 'HADERSLEV',
    flag: 'DNK',
  },
  {
    id: 'dnk-middelfart',
    name: 'MIDDELFART',
    flag: 'DNK',
  },
  {
    id: 'usa-stonington',
    name: 'STONINGTON',
    flag: 'USA',
  },
  {
    id: 'nor-ranseilforening',
    name: 'RAN SEILFORENING',
    flag: 'NOR',
  },
  {
    id: 'dnk-svendborg',
    name: 'SVENDBORG',
    flag: 'DNK',
  },
  {
    id: 'idn-lembongan',
    name: 'LEMBONGAN',
    flag: 'IDN',
  },
  {
    id: 'phl-coronon',
    name: 'CORONON',
    flag: 'PHL',
  },
  {
    id: 'ita-portosanpaolo',
    name: 'PORTO SAN PAOLO',
    flag: 'ITA',
  },
  {
    id: 'mus-portmathurin',
    name: 'PORT MATHURIN',
    flag: 'MUS',
  },
  {
    id: 'nld-aalst',
    name: 'AALST',
    flag: 'NLD',
  },
  {
    id: 'idn-karanglincak',
    name: 'KARANGLINCAK',
    flag: 'IDN',
  },
  {
    id: 'usa-skagway',
    name: 'SKAGWAY',
    flag: 'USA',
  },
  {
    id: 'usa-eureka',
    name: 'EUREKA',
    flag: 'USA',
  },
  {
    id: 'usa-tarponpoint',
    name: 'TARPON POINT',
    flag: 'USA',
  },
  {
    id: 'dom-lassalinas',
    name: 'LAS SALINAS',
    flag: 'DOM',
  },
  {
    id: 'esp-sancarlos',
    name: 'SAN CARLOS',
    flag: 'ESP',
  },
  {
    id: 'deu-datteln',
    name: 'DATTELN',
    flag: 'DEU',
  },
  {
    id: 'ita-cagliari',
    name: 'CAGLIARI',
    flag: 'ITA',
  },
  {
    id: 'dnk-tunoby',
    name: 'TUNOBY',
    flag: 'DNK',
  },
  {
    id: 'ita-reggiocalabria',
    name: 'REGGIO CALABRIA',
    flag: 'ITA',
  },
  {
    id: 'grc-folegandros',
    name: 'FOLEGANDROS',
    flag: 'GRC',
  },
  {
    id: 'mmr-yangon',
    name: 'YANGON',
    flag: 'MMR',
  },
  {
    id: 'idn-pangkalbalam',
    name: 'PANGKAL BALAM',
    flag: 'IDN',
  },
  {
    id: 'chn-macun',
    name: 'MACUN',
    flag: 'CHN',
  },
  {
    id: 'kor-oepo',
    name: 'OEPO',
    flag: 'KOR',
  },
  {
    id: 'syr-latakia',
    name: 'LATAKIA',
    flag: 'SYR',
  },
  {
    id: 'dnk-copenhagen',
    name: 'COPENHAGEN',
    flag: 'DNK',
  },
  {
    id: 'gbr-conwy',
    name: 'CONWY',
    flag: 'GBR',
  },
  {
    id: 'esp-santantoni',
    name: 'SANT ANTONI',
    flag: 'ESP',
  },
  {
    id: 'jpn-hitachi',
    name: 'HITACHI',
    flag: 'JPN',
  },
  {
    id: 'usa-pilotpoint',
    name: 'PILOT POINT',
    flag: 'USA',
  },
  {
    id: 'swe-vaxholm',
    name: 'VAXHOLM',
    flag: 'SWE',
  },
  {
    id: 'swe-ornskoldsvik',
    name: 'ORNSKOLDSVIK',
    flag: 'SWE',
  },
  {
    id: 'aus-apollobay',
    name: 'APOLLO BAY',
    flag: 'AUS',
  },
  {
    id: 'phl-toril',
    name: 'TORIL',
    flag: 'PHL',
  },
  {
    id: 'can-kingston',
    name: 'KINGSTON',
    flag: 'CAN',
  },
  {
    id: 'aut-langenzersdorf',
    name: 'LANGENZERSDORF',
    flag: 'AUT',
  },
  {
    id: 'gbr-rosneath',
    name: 'ROSNEATH',
    flag: 'GBR',
  },
  {
    id: 'nld-huizen',
    name: 'HUIZEN',
    flag: 'NLD',
  },
  {
    id: 'rus-berezniki',
    name: 'BEREZNIKI',
    flag: 'RUS',
  },
  {
    id: 'fra-strasbourg',
    name: 'STRASBOURG',
    flag: 'FRA',
  },
  {
    id: 'usa-sausalito',
    name: 'SAUSALITO',
    flag: 'USA',
  },
  {
    id: 'usa-jeffersonbeach',
    name: 'JEFFERSON BEACH',
    flag: 'USA',
  },
  {
    id: 'lca-soufriere',
    name: 'SOUFRIERE',
    flag: 'LCA',
  },
  {
    id: 'bra-itacoatiara',
    name: 'ITACOATIARA',
    flag: 'BRA',
  },
  {
    id: 'prt-canical',
    name: 'CANICAL',
    flag: 'PRT',
  },
  {
    id: 'esp-vigo',
    name: 'VIGO',
    flag: 'ESP',
  },
  {
    id: 'gbr-burntisland',
    name: 'BURNTISLAND',
    flag: 'GBR',
  },
  {
    id: 'gbr-chatham',
    name: 'CHATHAM',
    flag: 'GBR',
  },
  {
    id: "esp-calad'or",
    name: "CALA D'OR",
    flag: 'ESP',
  },
  {
    id: 'deu-badessen',
    name: 'BAD ESSEN',
    flag: 'DEU',
  },
  {
    id: 'ita-lavagna',
    name: 'LAVAGNA',
    flag: 'ITA',
  },
  {
    id: 'deu-calberlah',
    name: 'CALBERLAH',
    flag: 'DEU',
  },
  {
    id: 'swe-marstrand',
    name: 'MARSTRAND',
    flag: 'SWE',
  },
  {
    id: 'ala-degerby',
    name: 'DEGERBY',
    flag: 'ALA',
  },
  {
    id: 'grc-galaxidi',
    name: 'GALAXIDI',
    flag: 'GRC',
  },
  {
    id: 'chn-zhuhai',
    name: 'ZHUHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-shekou',
    name: 'SHEKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-qinhuangdao',
    name: 'QINHUANGDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-ningbo',
    name: 'NINGBO',
    flag: 'CHN',
  },
  {
    id: 'rus-zarubino',
    name: 'ZARUBINO',
    flag: 'RUS',
  },
  {
    id: 'rus-severokurilsk',
    name: 'SEVERO KURILSK',
    flag: 'RUS',
  },
  {
    id: 'nzl-bayswater',
    name: 'BAYSWATER',
    flag: 'NZL',
  },
  {
    id: 'nzl-gulfharbour',
    name: 'GULF HARBOUR',
    flag: 'NZL',
  },
  {
    id: 'usa-yorktown',
    name: 'YORKTOWN',
    flag: 'USA',
  },
  {
    id: 'idn-malahayati',
    name: 'MALAHAYATI',
    flag: 'IDN',
  },
  {
    id: 'ita-golfoaranci',
    name: 'GOLFO ARANCI',
    flag: 'ITA',
  },
  {
    id: 'idn-banyuwangianchorage',
    name: 'BANYUWANGI ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'chn-weifang',
    name: 'WEIFANG',
    flag: 'CHN',
  },
  {
    id: 'tha-songkhlaanchorage',
    name: 'SONGKHLA ANCHORAGE',
    flag: 'THA',
  },
  {
    id: 'are-umaldalakh',
    name: 'UM AL DALAKH',
    flag: 'ARE',
  },
  {
    id: 'ukr-kerch',
    name: 'KERCH',
    flag: 'UKR',
  },
  {
    id: 'dom-ocoabay',
    name: 'OCOA BAY',
    flag: 'DOM',
  },
  {
    id: 'ago-cabinda',
    name: 'CABINDA',
    flag: 'AGO',
  },
  {
    id: 'esp-alcaidesa',
    name: 'ALCAIDESA',
    flag: 'ESP',
  },
  {
    id: 'nld-steenbergen',
    name: 'STEENBERGEN',
    flag: 'NLD',
  },
  {
    id: 'tur-toros',
    name: 'TOROS',
    flag: 'TUR',
  },
  {
    id: 'deu-wesseling',
    name: 'WESSELING',
    flag: 'DEU',
  },
  {
    id: 'fra-koenigsmacker',
    name: 'KOENIGSMACKER',
    flag: 'FRA',
  },
  {
    id: 'idn-tamperan',
    name: 'TAMPERAN',
    flag: 'IDN',
  },
  {
    id: 'usa-kahului',
    name: 'KAHULUI',
    flag: 'USA',
  },
  {
    id: "bmu-stgeorge's",
    name: "ST GEORGE'S",
    flag: 'BMU',
  },
  {
    id: 'gbr-stromness',
    name: 'STROMNESS',
    flag: 'GBR',
  },
  {
    id: 'gbr-weymouth',
    name: 'WEYMOUTH',
    flag: 'GBR',
  },
  {
    id: 'bel-bree',
    name: 'BREE',
    flag: 'BEL',
  },
  {
    id: 'tur-yalikavak',
    name: 'YALIKAVAK',
    flag: 'TUR',
  },
  {
    id: 'bgd-monglaanchorage',
    name: 'MONGLA ANCHORAGE',
    flag: 'BGD',
  },
  {
    id: 'idn-tanjunguban',
    name: 'TANJUNG UBAN',
    flag: 'IDN',
  },
  {
    id: 'vnm-hochiminh',
    name: 'HO CHI MINH',
    flag: 'VNM',
  },
  {
    id: 'jpn-ishigaki',
    name: 'ISHIGAKI',
    flag: 'JPN',
  },
  {
    id: 'idn-wini',
    name: 'WINI',
    flag: 'IDN',
  },
  {
    id: 'kor-aewol',
    name: 'AEWOL',
    flag: 'KOR',
  },
  {
    id: 'idn-saumlaki',
    name: 'SAUMLAKI',
    flag: 'IDN',
  },
  {
    id: 'jpn-hiroshima',
    name: 'HIROSHIMA',
    flag: 'JPN',
  },
  {
    id: 'vut-portvila',
    name: 'PORT VILA',
    flag: 'VUT',
  },
  {
    id: 'usa-sanclementeisland',
    name: 'SAN CLEMENTE ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-marco',
    name: 'MARCO',
    flag: 'USA',
  },
  {
    id: 'usa-camachee',
    name: 'CAMACHEE',
    flag: 'USA',
  },
  {
    id: 'dnk-sonderborg',
    name: 'SONDERBORG',
    flag: 'DNK',
  },
  {
    id: "esp-l'ametllademar",
    name: "L'AMETLLA DE MAR",
    flag: 'ESP',
  },
  {
    id: 'bgr-varna',
    name: 'VARNA',
    flag: 'BGR',
  },
  {
    id: 'sdn-portsudan',
    name: 'PORT SUDAN',
    flag: 'SDN',
  },
  {
    id: 'kor-donghae',
    name: 'DONGHAE',
    flag: 'KOR',
  },
  {
    id: 'bra-tramandaianchorage',
    name: 'TRAMANDAI ANCHORAGE',
    flag: 'BRA',
  },
  {
    id: 'deu-kiel',
    name: 'KIEL',
    flag: 'DEU',
  },
  {
    id: 'usa-portinland',
    name: 'PORT INLAND',
    flag: 'USA',
  },
  {
    id: 'cuw-bullenbay',
    name: 'BULLENBAY',
    flag: 'CUW',
  },
  {
    id: 'usa-mattapoisettanchorage',
    name: 'MATTAPOISETT ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-searsport',
    name: 'SEARSPORT',
    flag: 'USA',
  },
  {
    id: 'dnk-hvalpsund',
    name: 'HVALPSUND',
    flag: 'DNK',
  },
  {
    id: 'rus-chistopol',
    name: 'CHISTOPOL',
    flag: 'RUS',
  },
  {
    id: 'idn-lempasing',
    name: 'LEMPASING',
    flag: 'IDN',
  },
  {
    id: 'swe-trollhattan',
    name: 'TROLLHATTAN',
    flag: 'SWE',
  },
  {
    id: 'mex-barradenavidad',
    name: 'BARRA DE NAVIDAD',
    flag: 'MEX',
  },
  {
    id: 'usa-porteverglades',
    name: 'PORT EVERGLADES',
    flag: 'USA',
  },
  {
    id: 'can-becancour',
    name: 'BECANCOUR',
    flag: 'CAN',
  },
  {
    id: 'glp-gustavia',
    name: 'GUSTAVIA',
    flag: 'GLP',
  },
  {
    id: 'vct-bequia',
    name: 'BEQUIA',
    flag: 'VCT',
  },
  {
    id: 'arg-diamante',
    name: 'DIAMANTE',
    flag: 'ARG',
  },
  {
    id: 'arg-tigre',
    name: 'TIGRE',
    flag: 'ARG',
  },
  {
    id: 'irl-foynes',
    name: 'FOYNES',
    flag: 'IRL',
  },
  {
    id: 'gbr-ullapool',
    name: 'ULLAPOOL',
    flag: 'GBR',
  },
  {
    id: 'bel-tournai',
    name: 'TOURNAI',
    flag: 'BEL',
  },
  {
    id: 'bel-mechelen',
    name: 'MECHELEN',
    flag: 'BEL',
  },
  {
    id: 'nld-barendrecht',
    name: 'BARENDRECHT',
    flag: 'NLD',
  },
  {
    id: 'bel-farciennes',
    name: 'FARCIENNES',
    flag: 'BEL',
  },
  {
    id: 'nld-werkendam',
    name: 'WERKENDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-tolkamer',
    name: 'TOLKAMER',
    flag: 'NLD',
  },
  {
    id: 'deu-cologne',
    name: 'COLOGNE',
    flag: 'DEU',
  },
  {
    id: 'nor-drobak',
    name: 'DROBAK',
    flag: 'NOR',
  },
  {
    id: 'deu-potsdam',
    name: 'POTSDAM',
    flag: 'DEU',
  },
  {
    id: 'hrv-umag',
    name: 'UMAG',
    flag: 'HRV',
  },
  {
    id: 'hrv-rasa',
    name: 'RASA',
    flag: 'HRV',
  },
  {
    id: 'nor-melbu',
    name: 'MELBU',
    flag: 'NOR',
  },
  {
    id: 'ita-siracusa',
    name: 'SIRACUSA',
    flag: 'ITA',
  },
  {
    id: 'hrv-sumartin',
    name: 'SUMARTIN',
    flag: 'HRV',
  },
  {
    id: 'lka-colombo',
    name: 'COLOMBO',
    flag: 'LKA',
  },
  {
    id: 'tha-thaplamu',
    name: 'THAP LAMU',
    flag: 'THA',
  },
  {
    id: 'chn-shanhaiguan',
    name: 'SHANHAIGUAN',
    flag: 'CHN',
  },
  {
    id: 'rus-svetlaya',
    name: 'SVETLAYA',
    flag: 'RUS',
  },
  {
    id: 'jpn-ito',
    name: 'ITO',
    flag: 'JPN',
  },
  {
    id: 'jpn-monbetsu',
    name: 'MONBETSU',
    flag: 'JPN',
  },
  {
    id: 'idn-cilacap',
    name: 'CILACAP',
    flag: 'IDN',
  },
  {
    id: 'bgr-burgas',
    name: 'BURGAS',
    flag: 'BGR',
  },
  {
    id: 'are-salmanfield',
    name: 'SALMAN FIELD',
    flag: 'ARE',
  },
  {
    id: 'ago-block15',
    name: 'BLOCK 15',
    flag: 'AGO',
  },
  {
    id: 'usa-selbybay',
    name: 'SELBY BAY',
    flag: 'USA',
  },
  {
    id: 'usa-hinghamshipyard',
    name: 'HINGHAM SHIPYARD',
    flag: 'USA',
  },
  {
    id: 'deu-germersheim',
    name: 'GERMERSHEIM',
    flag: 'DEU',
  },
  {
    id: 'usa-avila',
    name: 'AVILA',
    flag: 'USA',
  },
  {
    id: 'gbr-milfordhaven',
    name: 'MILFORD HAVEN',
    flag: 'GBR',
  },
  {
    id: 'swe-bergkvara',
    name: 'BERGKVARA',
    flag: 'SWE',
  },
  {
    id: 'usa-sturgeonbay',
    name: 'STURGEON BAY',
    flag: 'USA',
  },
  {
    id: 'usa-northeastharbor',
    name: 'NORTHEAST HARBOR',
    flag: 'USA',
  },
  {
    id: 'can-baydeverde',
    name: 'BAY DE VERDE',
    flag: 'CAN',
  },
  {
    id: 'nld-meppel',
    name: 'MEPPEL',
    flag: 'NLD',
  },
  {
    id: 'est-kakumaehaven',
    name: 'KAKUMAE HAVEN',
    flag: 'EST',
  },
  {
    id: 'rus-zvenigovo',
    name: 'ZVENIGOVO',
    flag: 'RUS',
  },
  {
    id: 'rus-bolshoykamen',
    name: 'BOLSHOY KAMEN',
    flag: 'RUS',
  },
  {
    id: 'swe-hudiksvall',
    name: 'HUDIKSVALL',
    flag: 'SWE',
  },
  {
    id: 'png-orobay',
    name: 'ORO BAY',
    flag: 'PNG',
  },
  {
    id: 'usa-lakecharles',
    name: 'LAKE CHARLES',
    flag: 'USA',
  },
  {
    id: 'arg-camarones',
    name: 'CAMARONES',
    flag: 'ARG',
  },
  {
    id: 'nld-wanssum',
    name: 'WANSSUM',
    flag: 'NLD',
  },
  {
    id: 'usa-staugustine',
    name: 'ST AUGUSTINE',
    flag: 'USA',
  },
  {
    id: 'ven-puertolacruz',
    name: 'PUERTO LA CRUZ',
    flag: 'VEN',
  },
  {
    id: 'can-shearwater',
    name: 'SHEARWATER',
    flag: 'CAN',
  },
  {
    id: 'bra-macae',
    name: 'MACAE',
    flag: 'BRA',
  },
  {
    id: 'lbr-monrovia',
    name: 'MONROVIA',
    flag: 'LBR',
  },
  {
    id: 'esp-lage',
    name: 'LAGE',
    flag: 'ESP',
  },
  {
    id: 'gbr-glassondock',
    name: 'GLASSON DOCK',
    flag: 'GBR',
  },
  {
    id: 'gbr-boston',
    name: 'BOSTON',
    flag: 'GBR',
  },
  {
    id: 'nld-maassluis',
    name: 'MAASSLUIS',
    flag: 'NLD',
  },
  {
    id: 'nld-ijmuiden',
    name: 'IJMUIDEN',
    flag: 'NLD',
  },
  {
    id: 'syr-tartus',
    name: 'TARTUS',
    flag: 'SYR',
  },
  {
    id: 'rus-anapa',
    name: 'ANAPA',
    flag: 'RUS',
  },
  {
    id: 'mus-grandbaie',
    name: 'GRAND BAIE',
    flag: 'MUS',
  },
  {
    id: 'kor-jeju',
    name: 'JEJU',
    flag: 'KOR',
  },
  {
    id: 'idn-sayoang',
    name: 'SAYOANG',
    flag: 'IDN',
  },
  {
    id: 'jpn-kikuma',
    name: 'KIKUMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kochi',
    name: 'KOCHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-misaki',
    name: 'MISAKI',
    flag: 'JPN',
  },
  {
    id: 'aus-weipa',
    name: 'WEIPA',
    flag: 'AUS',
  },
  {
    id: 'aus-eden',
    name: 'EDEN',
    flag: 'AUS',
  },
  {
    id: 'irl-greencastle',
    name: 'GREENCASTLE',
    flag: 'IRL',
  },
  {
    id: 'fra-royan',
    name: 'ROYAN',
    flag: 'FRA',
  },
  {
    id: 'deu-strande',
    name: 'STRANDE',
    flag: 'DEU',
  },
  {
    id: 'cyp-limassol',
    name: 'LIMASSOL',
    flag: 'CYP',
  },
  {
    id: 'brb-bridgetown',
    name: 'BRIDGETOWN',
    flag: 'BRB',
  },
  {
    id: 'esp-sanxenxo',
    name: 'SANXENXO',
    flag: 'ESP',
  },
  {
    id: 'ita-portovesme',
    name: 'PORTO VESME',
    flag: 'ITA',
  },
  {
    id: 'mne-bar',
    name: 'BAR',
    flag: 'MNE',
  },
  {
    id: 'gnb-bissau',
    name: 'BISSAU',
    flag: 'GNB',
  },
  {
    id: 'cyp-vasilikos',
    name: 'VASILIKOS',
    flag: 'CYP',
  },
  {
    id: 'bra-camposbasin',
    name: 'CAMPOS BASIN',
    flag: 'BRA',
  },
  {
    id: 'can-portdalhousie',
    name: 'PORT DALHOUSIE',
    flag: 'CAN',
  },
  {
    id: 'can-cornwall',
    name: 'CORNWALL',
    flag: 'CAN',
  },
  {
    id: 'swe-landskrona',
    name: 'LANDSKRONA',
    flag: 'SWE',
  },
  {
    id: 'irl-crosshaven',
    name: 'CROSSHAVEN',
    flag: 'IRL',
  },
  {
    id: 'tun-kelibia',
    name: 'KELIBIA',
    flag: 'TUN',
  },
  {
    id: 'usa-egegik',
    name: 'EGEGIK',
    flag: 'USA',
  },
  {
    id: 'deu-karlsruhe',
    name: 'KARLSRUHE',
    flag: 'DEU',
  },
  {
    id: 'ukr-zatoka',
    name: 'ZATOKA',
    flag: 'UKR',
  },
  {
    id: 'usa-putinbay',
    name: 'PUT IN BAY',
    flag: 'USA',
  },
  {
    id: 'swe-nordon',
    name: 'NORDON',
    flag: 'SWE',
  },
  {
    id: 'can-lesmechins',
    name: 'LES MECHINS',
    flag: 'CAN',
  },
  {
    id: 'usa-duluthsuperior',
    name: 'DULUTH SUPERIOR',
    flag: 'USA',
  },
  {
    id: 'usa-usngzcgi',
    name: 'US NGZ CGI',
    flag: 'USA',
  },
  {
    id: 'usa-cairo',
    name: 'CAIRO',
    flag: 'USA',
  },
  {
    id: 'usa-northpalmbeach',
    name: 'NORTH PALM BEACH',
    flag: 'USA',
  },
  {
    id: 'pan-panamacanalanchorage',
    name: 'PANAMA CANAL ANCHORAGE',
    flag: 'PAN',
  },
  {
    id: 'bes-saba',
    name: 'SABA',
    flag: 'BES',
  },
  {
    id: 'fra-dieppe',
    name: 'DIEPPE',
    flag: 'FRA',
  },
  {
    id: 'nor-askvoll',
    name: 'ASKVOLL',
    flag: 'NOR',
  },
  {
    id: 'nor-mandal',
    name: 'MANDAL',
    flag: 'NOR',
  },
  {
    id: 'ita-santateresagallura',
    name: 'SANTA TERESA GALLURA',
    flag: 'ITA',
  },
  {
    id: 'ita-castellammaredistabia',
    name: 'CASTELLAMMARE DI STABIA',
    flag: 'ITA',
  },
  {
    id: 'are-ajman',
    name: 'AJMAN',
    flag: 'ARE',
  },
  {
    id: 'idn-dumai',
    name: 'DUMAI',
    flag: 'IDN',
  },
  {
    id: 'chn-yangkou',
    name: 'YANGKOU',
    flag: 'CHN',
  },
  {
    id: 'idn-tolitoli',
    name: 'TOLITOLI',
    flag: 'IDN',
  },
  {
    id: 'idn-bade',
    name: 'BADE',
    flag: 'IDN',
  },
  {
    id: 'aus-mornington',
    name: 'MORNINGTON',
    flag: 'AUS',
  },
  {
    id: 'nzl-mangonui',
    name: 'MANGONUI',
    flag: 'NZL',
  },
  {
    id: 'usa-havredegrace',
    name: 'HAVRE DE GRACE',
    flag: 'USA',
  },
  {
    id: 'hti-caphaitien',
    name: 'CAP HAITIEN',
    flag: 'HTI',
  },
  {
    id: 'pri-puertodelrey',
    name: 'PUERTO DEL REY',
    flag: 'PRI',
  },
  {
    id: 'fin-hanko',
    name: 'HANKO',
    flag: 'FIN',
  },
  {
    id: 'nor-melkoya',
    name: 'MELKOYA',
    flag: 'NOR',
  },
  {
    id: 'jpn-kamaishi',
    name: 'KAMAISHI',
    flag: 'JPN',
  },
  {
    id: 'lca-castries',
    name: 'CASTRIES',
    flag: 'LCA',
  },
  {
    id: 'ita-piombino',
    name: 'PIOMBINO',
    flag: 'ITA',
  },
  {
    id: 'swe-nogersund',
    name: 'NOGERSUND',
    flag: 'SWE',
  },
  {
    id: 'bra-portodoacu',
    name: 'PORTO DO ACU',
    flag: 'BRA',
  },
  {
    id: 'pan-panamaanchoragepacific',
    name: 'PANAMA ANCHORAGE PACIFIC',
    flag: 'PAN',
  },
  {
    id: 'jpn-aomori',
    name: 'AOMORI',
    flag: 'JPN',
  },
  {
    id: 'usa-thomaston',
    name: 'THOMASTON',
    flag: 'USA',
  },
  {
    id: 'can-makkovik',
    name: 'MAKKOVIK',
    flag: 'CAN',
  },
  {
    id: 'deu-trabentrarbach',
    name: 'TRABEN TRARBACH',
    flag: 'DEU',
  },
  {
    id: 'nor-laerdalsoyri',
    name: 'LAERDALSOYRI',
    flag: 'NOR',
  },
  {
    id: 'ukr-kherson',
    name: 'KHERSON',
    flag: 'UKR',
  },
  {
    id: 'rus-zavolzhye',
    name: 'ZAVOLZHYE',
    flag: 'RUS',
  },
  {
    id: 'lka-trincomalee',
    name: 'TRINCOMALEE',
    flag: 'LKA',
  },
  {
    id: 'hrv-rab',
    name: 'RAB',
    flag: 'HRV',
  },
  {
    id: 'swe-hasslo',
    name: 'HASSLO',
    flag: 'SWE',
  },
  {
    id: 'dom-bocachica',
    name: 'BOCA CHICA',
    flag: 'DOM',
  },
  {
    id: 'vnm-campha',
    name: 'CAM PHA',
    flag: 'VNM',
  },
  {
    id: 'jpn-amagasaki',
    name: 'AMAGASAKI',
    flag: 'JPN',
  },
  {
    id: 'phl-mabini',
    name: 'MABINI',
    flag: 'PHL',
  },
  {
    id: 'phl-union',
    name: 'UNION',
    flag: 'PHL',
  },
  {
    id: 'jpn-miyazu',
    name: 'MIYAZU',
    flag: 'JPN',
  },
  {
    id: 'deu-plochingen',
    name: 'PLOCHINGEN',
    flag: 'DEU',
  },
  {
    id: 'mex-tampico',
    name: 'TAMPICO',
    flag: 'MEX',
  },
  {
    id: 'usa-lighthousepoint',
    name: 'LIGHTHOUSE POINT',
    flag: 'USA',
  },
  {
    id: 'usa-marion',
    name: 'MARION',
    flag: 'USA',
  },
  {
    id: 'can-comebychance',
    name: 'COME BY CHANCE',
    flag: 'CAN',
  },
  {
    id: 'gbr-carrickfergus',
    name: 'CARRICKFERGUS',
    flag: 'GBR',
  },
  {
    id: 'ago-matadi',
    name: 'MATADI',
    flag: 'AGO',
  },
  {
    id: 'ita-ischia',
    name: 'ISCHIA',
    flag: 'ITA',
  },
  {
    id: 'pol-swinoujscie',
    name: 'SWINOUJSCIE',
    flag: 'POL',
  },
  {
    id: 'tur-canakkale',
    name: 'CANAKKALE',
    flag: 'TUR',
  },
  {
    id: 'qat-alruwais',
    name: 'AL RUWAIS',
    flag: 'QAT',
  },
  {
    id: 'chn-fuzhou',
    name: 'FUZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-kemen',
    name: 'KEMEN',
    flag: 'CHN',
  },
  {
    id: 'twn-yeliu',
    name: 'YELIU',
    flag: 'TWN',
  },
  {
    id: 'phl-caticlan',
    name: 'CATICLAN',
    flag: 'PHL',
  },
  {
    id: 'jpn-niigata',
    name: 'NIIGATA',
    flag: 'JPN',
  },
  {
    id: 'jpn-yokosuka',
    name: 'YOKOSUKA',
    flag: 'JPN',
  },
  {
    id: 'png-kiunga',
    name: 'KIUNGA',
    flag: 'PNG',
  },
  {
    id: 'rus-nevelsk',
    name: 'NEVELSK',
    flag: 'RUS',
  },
  {
    id: 'nga-bonny',
    name: 'BONNY',
    flag: 'NGA',
  },
  {
    id: 'irn-lavan',
    name: 'LAVAN',
    flag: 'IRN',
  },
  {
    id: 'aus-coochiemudloisland',
    name: 'COOCHIEMUDLO ISLAND',
    flag: 'AUS',
  },
  {
    id: 'som-boosaaso',
    name: 'BOOSAASO',
    flag: 'SOM',
  },
  {
    id: 'idn-muntok',
    name: 'MUNTOK',
    flag: 'IDN',
  },
  {
    id: 'jpn-kinwan',
    name: 'KINWAN',
    flag: 'JPN',
  },
  {
    id: 'rus-nakhodka',
    name: 'NAKHODKA',
    flag: 'RUS',
  },
  {
    id: 'jpn-akitafunagawa',
    name: 'AKITAFUNAGAWA',
    flag: 'JPN',
  },
  {
    id: 'irn-hengamfield',
    name: 'HENGAM FIELD',
    flag: 'IRN',
  },
  {
    id: 'nga-amenam',
    name: 'AMENAM',
    flag: 'NGA',
  },
  {
    id: 'esp-llanca',
    name: 'LLANCA',
    flag: 'ESP',
  },
  {
    id: 'usa-andrewsbay',
    name: 'ANDREWS BAY',
    flag: 'USA',
  },
  {
    id: 'arg-puertoibicuy',
    name: 'PUERTO IBICUY',
    flag: 'ARG',
  },
  {
    id: 'nld-middelburg',
    name: 'MIDDELBURG',
    flag: 'NLD',
  },
  {
    id: 'cyp-dhekelia',
    name: 'DHEKELIA',
    flag: 'CYP',
  },
  {
    id: 'hrv-vinisce',
    name: 'VINISCE',
    flag: 'HRV',
  },
  {
    id: 'bel-zelzate',
    name: 'ZELZATE',
    flag: 'BEL',
  },
  {
    id: 'per-chimbote',
    name: 'CHIMBOTE',
    flag: 'PER',
  },
  {
    id: 'grl-qaqurtoq',
    name: 'QAQURTOQ',
    flag: 'GRL',
  },
  {
    id: 'isl-vopnafjordur',
    name: 'VOPNAFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'nld-muiderzand',
    name: 'MUIDERZAND',
    flag: 'NLD',
  },
  {
    id: 'swe-lerkil',
    name: 'LERKIL',
    flag: 'SWE',
  },
  {
    id: 'ita-pantelleria',
    name: 'PANTELLERIA',
    flag: 'ITA',
  },
  {
    id: 'ita-termoli',
    name: 'TERMOLI',
    flag: 'ITA',
  },
  {
    id: 'zaf-capetown',
    name: 'CAPE TOWN',
    flag: 'ZAF',
  },
  {
    id: 'mne-zelenika',
    name: 'ZELENIKA',
    flag: 'MNE',
  },
  {
    id: 'zaf-richardsbay',
    name: 'RICHARDS BAY',
    flag: 'ZAF',
  },
  {
    id: 'chn-laizhou',
    name: 'LAIZHOU',
    flag: 'CHN',
  },
  {
    id: 'phl-matnog',
    name: 'MATNOG',
    flag: 'PHL',
  },
  {
    id: 'jpn-imabari',
    name: 'IMABARI',
    flag: 'JPN',
  },
  {
    id: 'jpn-kashiwazaki',
    name: 'KASHIWAZAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-choshi',
    name: 'CHOSHI',
    flag: 'JPN',
  },
  {
    id: 'dom-lascalderas',
    name: 'LAS CALDERAS',
    flag: 'DOM',
  },
  {
    id: 'esp-coruna',
    name: 'CORUNA',
    flag: 'ESP',
  },
  {
    id: 'grc-symi',
    name: 'SYMI',
    flag: 'GRC',
  },
  {
    id: 'gbr-ramsgate',
    name: 'RAMSGATE',
    flag: 'GBR',
  },
  {
    id: 'usa-portsmouth',
    name: 'PORTSMOUTH',
    flag: 'USA',
  },
  {
    id: 'nld-belfeld',
    name: 'BELFELD',
    flag: 'NLD',
  },
  {
    id: 'deu-koblenz',
    name: 'KOBLENZ',
    flag: 'DEU',
  },
  {
    id: 'swe-farjestaden',
    name: 'FARJESTADEN',
    flag: 'SWE',
  },
  {
    id: 'lbn-saida',
    name: 'SAIDA',
    flag: 'LBN',
  },
  {
    id: 'ita-darsenasabbiadoro',
    name: 'DARSENA SABBIADORO',
    flag: 'ITA',
  },
  {
    id: 'jpn-funabashi',
    name: 'FUNABASHI',
    flag: 'JPN',
  },
  {
    id: 'can-killarney',
    name: 'KILLARNEY',
    flag: 'CAN',
  },
  {
    id: 'bel-zingem',
    name: 'ZINGEM',
    flag: 'BEL',
  },
  {
    id: 'nor-fiskarstranda',
    name: 'FISKARSTRANDA',
    flag: 'NOR',
  },
  {
    id: 'deu-ludwigshafen',
    name: 'LUDWIGSHAFEN',
    flag: 'DEU',
  },
  {
    id: 'aus-birkdale',
    name: 'BIRKDALE',
    flag: 'AUS',
  },
  {
    id: 'nor-nesbrygga',
    name: 'NESBRYGGA',
    flag: 'NOR',
  },
  {
    id: 'deu-dorfprozelten',
    name: 'DORFPROZELTEN',
    flag: 'DEU',
  },
  {
    id: 'idn-sancang',
    name: 'SANCANG',
    flag: 'IDN',
  },
  {
    id: 'usa-hilo',
    name: 'HILO',
    flag: 'USA',
  },
  {
    id: 'usa-bangorwa',
    name: 'BANGOR WA',
    flag: 'USA',
  },
  {
    id: 'usa-peoria',
    name: 'PEORIA',
    flag: 'USA',
  },
  {
    id: 'usa-gulfharbourclub',
    name: 'GULF HARBOUR CLUB',
    flag: 'USA',
  },
  {
    id: 'usa-fortmyers',
    name: 'FORT MYERS',
    flag: 'USA',
  },
  {
    id: 'can-wedgeport',
    name: 'WEDGEPORT',
    flag: 'CAN',
  },
  {
    id: 'grd-clarkscourtbay',
    name: 'CLARKS COURT BAY',
    flag: 'GRD',
  },
  {
    id: 'bra-pelotas',
    name: 'PELOTAS',
    flag: 'BRA',
  },
  {
    id: 'gin-taressaanchorage',
    name: 'TARESSA ANCHORAGE',
    flag: 'GIN',
  },
  {
    id: 'esp-sevilla',
    name: 'SEVILLA',
    flag: 'ESP',
  },
  {
    id: 'gbr-kyleoflochalsh',
    name: 'KYLE OF LOCHALSH',
    flag: 'GBR',
  },
  {
    id: 'bel-nieuwpoort',
    name: 'NIEUWPOORT',
    flag: 'BEL',
  },
  {
    id: 'deu-worms',
    name: 'WORMS',
    flag: 'DEU',
  },
  {
    id: 'deu-elsfleth',
    name: 'ELSFLETH',
    flag: 'DEU',
  },
  {
    id: 'cog-pointenoire',
    name: 'POINTE NOIRE',
    flag: 'COG',
  },
  {
    id: 'tur-yalovatown',
    name: 'YALOVA TOWN',
    flag: 'TUR',
  },
  {
    id: 'bhr-manama',
    name: 'MANAMA',
    flag: 'BHR',
  },
  {
    id: 'irn-kish',
    name: 'KISH',
    flag: 'IRN',
  },
  {
    id: 'mdv-male',
    name: 'MALE',
    flag: 'MDV',
  },
  {
    id: 'chn-dongtou',
    name: 'DONGTOU',
    flag: 'CHN',
  },
  {
    id: 'phl-jordan',
    name: 'JORDAN',
    flag: 'PHL',
  },
  {
    id: 'kor-daecheonhang',
    name: 'DAECHEONHANG',
    flag: 'KOR',
  },
  {
    id: 'jpn-hachinohe',
    name: 'HACHINOHE',
    flag: 'JPN',
  },
  {
    id: 'usa-sandpoint',
    name: 'SAND POINT',
    flag: 'USA',
  },
  {
    id: 'atg-bolands',
    name: 'BOLANDS',
    flag: 'ATG',
  },
  {
    id: 'prt-pontadelgada',
    name: 'PONTA DELGADA',
    flag: 'PRT',
  },
  {
    id: 'isl-grindavik',
    name: 'GRINDAVIK',
    flag: 'ISL',
  },
  {
    id: 'fra-laciotat',
    name: 'LA CIOTAT',
    flag: 'FRA',
  },
  {
    id: 'jpn-ishinomaki',
    name: 'ISHINOMAKI',
    flag: 'JPN',
  },
  {
    id: 'gha-tema',
    name: 'TEMA',
    flag: 'GHA',
  },
  {
    id: 'swe-oxelosund',
    name: 'OXELOSUND',
    flag: 'SWE',
  },
  {
    id: 'grc-psachna',
    name: 'PSACHNA',
    flag: 'GRC',
  },
  {
    id: 'gbr-scapaflow',
    name: 'SCAPA FLOW',
    flag: 'GBR',
  },
  {
    id: 'gbr-tyne',
    name: 'TYNE',
    flag: 'GBR',
  },
  {
    id: 'tur-hereke',
    name: 'HEREKE',
    flag: 'TUR',
  },
  {
    id: 'cod-block15',
    name: 'BLOCK 15',
    flag: 'COD',
  },
  {
    id: 'esp-isladearosa',
    name: 'ISLA DE AROSA',
    flag: 'ESP',
  },
  {
    id: 'bel-dessel',
    name: 'DESSEL',
    flag: 'BEL',
  },
  {
    id: 'deu-nierstein',
    name: 'NIERSTEIN',
    flag: 'DEU',
  },
  {
    id: 'sau-yanbu',
    name: 'YANBU',
    flag: 'SAU',
  },
  {
    id: 'irn-fereydoonkenar',
    name: 'FEREYDOONKENAR',
    flag: 'IRN',
  },
  {
    id: 'egy-hamrawein',
    name: 'HAMRAWEIN',
    flag: 'EGY',
  },
  {
    id: 'egy-elarish',
    name: 'ELARISH',
    flag: 'EGY',
  },
  {
    id: 'aus-franklin',
    name: 'FRANKLIN',
    flag: 'AUS',
  },
  {
    id: 'grl-kangerlusuaq',
    name: 'KANGERLUSUAQ',
    flag: 'GRL',
  },
  {
    id: 'deu-hanau',
    name: 'HANAU',
    flag: 'DEU',
  },
  {
    id: 'can-portsevern',
    name: 'PORT SEVERN',
    flag: 'CAN',
  },
  {
    id: 'ven-maracaibo',
    name: 'MARACAIBO',
    flag: 'VEN',
  },
  {
    id: 'ukr-mariupol',
    name: 'MARIUPOL',
    flag: 'UKR',
  },
  {
    id: 'grc-soussaki',
    name: 'SOUSSAKI',
    flag: 'GRC',
  },
  {
    id: 'usa-portrichmond',
    name: 'PORT RICHMOND',
    flag: 'USA',
  },
  {
    id: 'prt-leixoes',
    name: 'LEIXOES',
    flag: 'PRT',
  },
  {
    id: 'gbr-inverkip',
    name: 'INVERKIP',
    flag: 'GBR',
  },
  {
    id: 'dza-ghazaouet',
    name: 'GHAZAOUET',
    flag: 'DZA',
  },
  {
    id: 'fra-ilesdufrioul',
    name: 'ILES DU FRIOUL',
    flag: 'FRA',
  },
  {
    id: 'nor-sylte',
    name: 'SYLTE',
    flag: 'NOR',
  },
  {
    id: 'nor-grimstad',
    name: 'GRIMSTAD',
    flag: 'NOR',
  },
  {
    id: 'gnq-malabo',
    name: 'MALABO',
    flag: 'GNQ',
  },
  {
    id: 'dnk-rudkobing',
    name: 'RUDKOBING',
    flag: 'DNK',
  },
  {
    id: 'grc-aegina',
    name: 'AEGINA',
    flag: 'GRC',
  },
  {
    id: 'fin-kalajoki',
    name: 'KALAJOKI',
    flag: 'FIN',
  },
  {
    id: 'chn-majishan',
    name: 'MAJISHAN',
    flag: 'CHN',
  },
  {
    id: 'usa-aransaspass',
    name: 'ARANSAS PASS',
    flag: 'USA',
  },
  {
    id: 'gbr-eastbourne',
    name: 'EASTBOURNE',
    flag: 'GBR',
  },
  {
    id: 'est-parnu',
    name: 'PARNU',
    flag: 'EST',
  },
  {
    id: 'per-sannicolas',
    name: 'SAN NICOLAS',
    flag: 'PER',
  },
  {
    id: 'grc-kalamata',
    name: 'KALAMATA',
    flag: 'GRC',
  },
  {
    id: 'chn-dongying',
    name: 'DONG YING',
    flag: 'CHN',
  },
  {
    id: 'idn-phewmofield',
    name: 'PHEWMO FIELD',
    flag: 'IDN',
  },
  {
    id: 'pan-colon',
    name: 'COLON',
    flag: 'PAN',
  },
  {
    id: 'nld-uithoorn',
    name: 'UITHOORN',
    flag: 'NLD',
  },
  {
    id: 'rus-tiksi',
    name: 'TIKSI',
    flag: 'RUS',
  },
  {
    id: 'mex-sanjuandelacosta',
    name: 'SAN JUAN DE LA COSTA',
    flag: 'MEX',
  },
  {
    id: 'usa-coosbay',
    name: 'COOS BAY',
    flag: 'USA',
  },
  {
    id: 'ukr-izmail',
    name: 'IZMAIL',
    flag: 'UKR',
  },
  {
    id: 'cuw-caracasbay',
    name: 'CARACAS BAY',
    flag: 'CUW',
  },
  {
    id: 'usa-leetsdale',
    name: 'LEETSDALE',
    flag: 'USA',
  },
  {
    id: 'bel-temse',
    name: 'TEMSE',
    flag: 'BEL',
  },
  {
    id: 'jpn-shimonoseki',
    name: 'SHIMONOSEKI',
    flag: 'JPN',
  },
  {
    id: 'usa-falsepass',
    name: 'FALSE PASS',
    flag: 'USA',
  },
  {
    id: 'pyf-papeete',
    name: 'PAPEETE',
    flag: 'PYF',
  },
  {
    id: 'usa-beaumont',
    name: 'BEAUMONT',
    flag: 'USA',
  },
  {
    id: 'ecu-genovesa',
    name: 'GENOVESA',
    flag: 'ECU',
  },
  {
    id: 'cri-cocosisland',
    name: 'COCOS ISLAND',
    flag: 'CRI',
  },
  {
    id: 'chl-sanvicente',
    name: 'SAN VICENTE',
    flag: 'CHL',
  },
  {
    id: 'vir-greatstjamesisle',
    name: 'GREAT ST JAMES ISLE',
    flag: 'VIR',
  },
  {
    id: 'esp-cadiz',
    name: 'CADIZ',
    flag: 'ESP',
  },
  {
    id: 'imn-peel',
    name: 'PEEL',
    flag: 'IMN',
  },
  {
    id: 'dnk-thyboron',
    name: 'THYBORON',
    flag: 'DNK',
  },
  {
    id: 'dnk-hirtshals',
    name: 'HIRTSHALS',
    flag: 'DNK',
  },
  {
    id: 'nor-trondheim',
    name: 'TRONDHEIM',
    flag: 'NOR',
  },
  {
    id: 'mlt-bugibba',
    name: 'BUGIBBA',
    flag: 'MLT',
  },
  {
    id: 'grc-pylos',
    name: 'PYLOS',
    flag: 'GRC',
  },
  {
    id: 'grc-ios',
    name: 'IOS',
    flag: 'GRC',
  },
  {
    id: 'pak-karachi',
    name: 'KARACHI',
    flag: 'PAK',
  },
  {
    id: 'idn-panjang',
    name: 'PANJANG',
    flag: 'IDN',
  },
  {
    id: 'chn-yangzhou',
    name: 'YANGZHOU',
    flag: 'CHN',
  },
  {
    id: 'idn-baubau',
    name: 'BAU BAU',
    flag: 'IDN',
  },
  {
    id: 'idn-dagho',
    name: 'DAGHO',
    flag: 'IDN',
  },
  {
    id: 'vgb-roadtown',
    name: 'ROAD TOWN',
    flag: 'VGB',
  },
  {
    id: 'isl-reydarfjordur',
    name: 'REYDARFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'gab-portgentil',
    name: 'PORT GENTIL',
    flag: 'GAB',
  },
  {
    id: 'ita-viareggio',
    name: 'VIAREGGIO',
    flag: 'ITA',
  },
  {
    id: 'hrv-trogir',
    name: 'TROGIR',
    flag: 'HRV',
  },
  {
    id: 'swe-holmsund',
    name: 'HOLMSUND',
    flag: 'SWE',
  },
  {
    id: 'aus-kwinana',
    name: 'KWINANA',
    flag: 'AUS',
  },
  {
    id: 'ita-ventotene',
    name: 'VENTOTENE',
    flag: 'ITA',
  },
  {
    id: 'jpn-kiire',
    name: 'KIIRE',
    flag: 'JPN',
  },
  {
    id: 'blz-belizecity',
    name: 'BELIZE CITY',
    flag: 'BLZ',
  },
  {
    id: 'nor-vaagland',
    name: 'VAAGLAND',
    flag: 'NOR',
  },
  {
    id: 'phl-maasin',
    name: 'MAASIN',
    flag: 'PHL',
  },
  {
    id: 'deu-mukran',
    name: 'MUKRAN',
    flag: 'DEU',
  },
  {
    id: 'usa-southpark',
    name: 'SOUTH PARK',
    flag: 'USA',
  },
  {
    id: 'nld-hendrikidoambacht',
    name: 'HENDRIK IDO AMBACHT',
    flag: 'NLD',
  },
  {
    id: 'sjm-barentsburg',
    name: 'BARENTSBURG',
    flag: 'SJM',
  },
  {
    id: 'can-hamilton',
    name: 'HAMILTON',
    flag: 'CAN',
  },
  {
    id: 'idn-bajomulyo',
    name: 'BAJOMULYO',
    flag: 'IDN',
  },
  {
    id: 'can-baddeck',
    name: 'BADDECK',
    flag: 'CAN',
  },
  {
    id: 'can-portedward',
    name: 'PORT EDWARD',
    flag: 'CAN',
  },
  {
    id: 'usa-charlestoncomplex',
    name: 'CHARLESTON COMPLEX',
    flag: 'USA',
  },
  {
    id: 'usa-sandiego',
    name: 'SAN DIEGO',
    flag: 'USA',
  },
  {
    id: 'bhs-sampsoncay',
    name: 'SAMPSON CAY',
    flag: 'BHS',
  },
  {
    id: 'pry-villahayes',
    name: 'VILLA HAYES',
    flag: 'PRY',
  },
  {
    id: 'esp-burela',
    name: 'BURELA',
    flag: 'ESP',
  },
  {
    id: 'nor-vestbygd',
    name: 'VESTBYGD',
    flag: 'NOR',
  },
  {
    id: 'nor-heroy',
    name: 'HEROY',
    flag: 'NOR',
  },
  {
    id: 'ita-giulianova',
    name: 'GIULIANOVA',
    flag: 'ITA',
  },
  {
    id: 'aut-wolfsthal',
    name: 'WOLFSTHAL',
    flag: 'AUT',
  },
  {
    id: 'hun-dunavecse',
    name: 'DUNAVECSE',
    flag: 'HUN',
  },
  {
    id: 'nor-burfjord',
    name: 'BURFJORD',
    flag: 'NOR',
  },
  {
    id: 'grc-kymi',
    name: 'KYMI',
    flag: 'GRC',
  },
  {
    id: 'rou-garcov',
    name: 'GARCOV',
    flag: 'ROU',
  },
  {
    id: 'est-muuga',
    name: 'MUUGA',
    flag: 'EST',
  },
  {
    id: 'rou-ovidiu',
    name: 'OVIDIU',
    flag: 'ROU',
  },
  {
    id: 'nor-berlevag',
    name: 'BERLEVAG',
    flag: 'NOR',
  },
  {
    id: 'chn-dongfang',
    name: 'DONGFANG',
    flag: 'CHN',
  },
  {
    id: 'chn-diashan',
    name: 'DIASHAN',
    flag: 'CHN',
  },
  {
    id: 'phl-dalipuga',
    name: 'DALIPUGA',
    flag: 'PHL',
  },
  {
    id: 'aus-portland',
    name: 'PORTLAND',
    flag: 'AUS',
  },
  {
    id: 'usa-cherrypoint',
    name: 'CHERRY POINT',
    flag: 'USA',
  },
  {
    id: 'fra-saintnazaire',
    name: 'SAINT NAZAIRE',
    flag: 'FRA',
  },
  {
    id: 'kor-gijang',
    name: 'GIJANG',
    flag: 'KOR',
  },
  {
    id: 'usa-capeporpoise',
    name: 'CAPE PORPOISE',
    flag: 'USA',
  },
  {
    id: 'fra-trebeurden',
    name: 'TREBEURDEN',
    flag: 'FRA',
  },
  {
    id: 'rus-taganrog',
    name: 'TAGANROG',
    flag: 'RUS',
  },
  {
    id: 'nga-penningtonterminal',
    name: 'PENNINGTON TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'fra-lesattaques',
    name: 'LES ATTAQUES',
    flag: 'FRA',
  },
  {
    id: 'can-lewisporte',
    name: 'LEWISPORTE',
    flag: 'CAN',
  },
  {
    id: 'nor-larvik',
    name: 'LARVIK',
    flag: 'NOR',
  },
  {
    id: 'rus-astrakhan',
    name: 'ASTRAKHAN',
    flag: 'RUS',
  },
  {
    id: 'dnk-kolding',
    name: 'KOLDING',
    flag: 'DNK',
  },
  {
    id: 'asm-pagopagoharbor',
    name: 'PAGO PAGO HARBOR',
    flag: 'ASM',
  },
  {
    id: 'usa-kingston',
    name: 'KINGSTON',
    flag: 'USA',
  },
  {
    id: 'usa-jupiter',
    name: 'JUPITER',
    flag: 'USA',
  },
  {
    id: 'per-callao',
    name: 'CALLAO',
    flag: 'PER',
  },
  {
    id: 'usa-eastgreenwich',
    name: 'EAST GREENWICH',
    flag: 'USA',
  },
  {
    id: 'irl-castletownbearhaven',
    name: 'CASTLETOWN BEARHAVEN',
    flag: 'IRL',
  },
  {
    id: 'nld-aalsmeer',
    name: 'AALSMEER',
    flag: 'NLD',
  },
  {
    id: 'dnk-grenaa',
    name: 'GRENAA',
    flag: 'DNK',
  },
  {
    id: 'dnk-gedser',
    name: 'GEDSER',
    flag: 'DNK',
  },
  {
    id: 'hrv-korcula',
    name: 'KORCULA',
    flag: 'HRV',
  },
  {
    id: 'tur-haydarpasa',
    name: 'HAYDARPASA',
    flag: 'TUR',
  },
  {
    id: 'jor-aqabaindustrial',
    name: 'AQABA INDUSTRIAL',
    flag: 'JOR',
  },
  {
    id: 'chn-nanpaihe',
    name: 'NANPAIHE',
    flag: 'CHN',
  },
  {
    id: 'phl-subic',
    name: 'SUBIC',
    flag: 'PHL',
  },
  {
    id: 'rus-slavyanka',
    name: 'SLAVYANKA',
    flag: 'RUS',
  },
  {
    id: 'fro-runavik',
    name: 'RUNAVIK',
    flag: 'FRO',
  },
  {
    id: 'fra-bandol',
    name: 'BANDOL',
    flag: 'FRA',
  },
  {
    id: 'nor-judaberg',
    name: 'JUDABERG',
    flag: 'NOR',
  },
  {
    id: 'grc-eleftheres',
    name: 'ELEFTHERES',
    flag: 'GRC',
  },
  {
    id: 'phl-bugo',
    name: 'BUGO',
    flag: 'PHL',
  },
  {
    id: 'kor-busannewportanchorage',
    name: 'BUSAN NEW PORT ANCHORAGE',
    flag: 'KOR',
  },
  {
    id: 'rus-vanino',
    name: 'VANINO',
    flag: 'RUS',
  },
  {
    id: 'aus-milnerbay',
    name: 'MILNER BAY',
    flag: 'AUS',
  },
  {
    id: 'qat-alshaheenterminal',
    name: 'AL SHAHEEN TERMINAL',
    flag: 'QAT',
  },
  {
    id: 'can-goosebay',
    name: 'GOOSE BAY',
    flag: 'CAN',
  },
  {
    id: 'nld-middelharnis',
    name: 'MIDDELHARNIS',
    flag: 'NLD',
  },
  {
    id: 'rus-adler',
    name: 'ADLER',
    flag: 'RUS',
  },
  {
    id: 'bgd-mongla',
    name: 'MONGLA',
    flag: 'BGD',
  },
  {
    id: 'vnm-phumy',
    name: 'PHU MY',
    flag: 'VNM',
  },
  {
    id: 'esp-playadefanabe',
    name: 'PLAYA DE FANABE',
    flag: 'ESP',
  },
  {
    id: 'deu-osnabruck',
    name: 'OSNABRUCK',
    flag: 'DEU',
  },
  {
    id: 'aus-wollongong',
    name: 'WOLLONGONG',
    flag: 'AUS',
  },
  {
    id: 'nld-tilburg',
    name: 'TILBURG',
    flag: 'NLD',
  },
  {
    id: 'ago-portodoambriz',
    name: 'PORTO DO AMBRIZ',
    flag: 'AGO',
  },
  {
    id: 'nld-vriezenveen',
    name: 'VRIEZENVEEN',
    flag: 'NLD',
  },
  {
    id: 'jpn-akita',
    name: 'AKITA',
    flag: 'JPN',
  },
  {
    id: 'nor-sarpsborg',
    name: 'SARPSBORG',
    flag: 'NOR',
  },
  {
    id: 'can-heriotbay',
    name: 'HERIOT BAY',
    flag: 'CAN',
  },
  {
    id: 'usa-houston',
    name: 'HOUSTON',
    flag: 'USA',
  },
  {
    id: 'usa-morgancity',
    name: 'MORGAN CITY',
    flag: 'USA',
  },
  {
    id: 'col-buenaventura',
    name: 'BUENAVENTURA',
    flag: 'COL',
  },
  {
    id: 'glp-basseterre',
    name: 'BASSE TERRE',
    flag: 'GLP',
  },
  {
    id: 'gin-kamsar',
    name: 'KAMSAR',
    flag: 'GIN',
  },
  {
    id: 'fra-sete',
    name: 'SETE',
    flag: 'FRA',
  },
  {
    id: 'nor-fitjar',
    name: 'FITJAR',
    flag: 'NOR',
  },
  {
    id: 'nor-aurdal',
    name: 'AURDAL',
    flag: 'NOR',
  },
  {
    id: 'deu-cuxhaven',
    name: 'CUXHAVEN',
    flag: 'DEU',
  },
  {
    id: 'deu-nienburg',
    name: 'NIENBURG',
    flag: 'DEU',
  },
  {
    id: 'ita-filicudi',
    name: 'FILICUDI',
    flag: 'ITA',
  },
  {
    id: 'nor-senjahopen',
    name: 'SENJAHOPEN',
    flag: 'NOR',
  },
  {
    id: 'grc-gythio',
    name: 'GYTHIO',
    flag: 'GRC',
  },
  {
    id: 'grc-tinos',
    name: 'TINOS',
    flag: 'GRC',
  },
  {
    id: 'grc-xirokamposanchorage',
    name: 'XIROKAMPOS ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'mys-kualakedah',
    name: 'KUALA KEDAH',
    flag: 'MYS',
  },
  {
    id: 'idn-pomalaa',
    name: 'POMALAA',
    flag: 'IDN',
  },
  {
    id: 'cub-matanzas',
    name: 'MATANZAS',
    flag: 'CUB',
  },
  {
    id: 'twn-jinning',
    name: 'JINNING',
    flag: 'TWN',
  },
  {
    id: 'dza-oran',
    name: 'ORAN',
    flag: 'DZA',
  },
  {
    id: 'sgp-tanahmerah',
    name: 'TANAH MERAH',
    flag: 'SGP',
  },
  {
    id: 'usa-loop',
    name: 'LOOP',
    flag: 'USA',
  },
  {
    id: 'can-sheetharbour',
    name: 'SHEET HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'swe-degerhamn',
    name: 'DEGERHAMN',
    flag: 'SWE',
  },
  {
    id: 'tur-datca',
    name: 'DATCA',
    flag: 'TUR',
  },
  {
    id: 'usa-ostervilleanglers',
    name: 'OSTERVILLE ANGLERS',
    flag: 'USA',
  },
  {
    id: 'rus-kondopoga',
    name: 'KONDOPOGA',
    flag: 'RUS',
  },
  {
    id: 'usa-ottawa',
    name: 'OTTAWA',
    flag: 'USA',
  },
  {
    id: 'gbr-manchester',
    name: 'MANCHESTER',
    flag: 'GBR',
  },
  {
    id: 'nld-andel',
    name: 'ANDEL',
    flag: 'NLD',
  },
  {
    id: 'nld-helmond',
    name: 'HELMOND',
    flag: 'NLD',
  },
  {
    id: 'nor-flekkefjord',
    name: 'FLEKKEFJORD',
    flag: 'NOR',
  },
  {
    id: 'usa-memphis',
    name: 'MEMPHIS',
    flag: 'USA',
  },
  {
    id: 'usa-graysharbor',
    name: 'GRAYS HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-stsimons',
    name: 'ST SIMONS',
    flag: 'USA',
  },
  {
    id: 'usa-nantucketanchorage',
    name: 'NANTUCKET ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'cpv-praia',
    name: 'PRAIA',
    flag: 'CPV',
  },
  {
    id: 'esp-arrecife',
    name: 'ARRECIFE',
    flag: 'ESP',
  },
  {
    id: 'fra-bordeaux',
    name: 'BORDEAUX',
    flag: 'FRA',
  },
  {
    id: 'esp-sagunto',
    name: 'SAGUNTO',
    flag: 'ESP',
  },
  {
    id: 'gbr-dover',
    name: 'DOVER',
    flag: 'GBR',
  },
  {
    id: 'deu-tangermunde',
    name: 'TANGERMUNDE',
    flag: 'DEU',
  },
  {
    id: 'aut-steyregg',
    name: 'STEYREGG',
    flag: 'AUT',
  },
  {
    id: 'pol-szczecin',
    name: 'SZCZECIN',
    flag: 'POL',
  },
  {
    id: 'swe-nynashamn',
    name: 'NYNASHAMN',
    flag: 'SWE',
  },
  {
    id: 'nor-alta',
    name: 'ALTA',
    flag: 'NOR',
  },
  {
    id: 'tur-eren',
    name: 'EREN',
    flag: 'TUR',
  },
  {
    id: 'tur-sinop',
    name: 'SINOP',
    flag: 'TUR',
  },
  {
    id: 'brn-muara',
    name: 'MUARA',
    flag: 'BRN',
  },
  {
    id: 'twn-magong',
    name: 'MAGONG',
    flag: 'TWN',
  },
  {
    id: 'twn-anping',
    name: 'ANPING',
    flag: 'TWN',
  },
  {
    id: 'phl-manila',
    name: 'MANILA',
    flag: 'PHL',
  },
  {
    id: 'kor-seogwipo',
    name: 'SEOGWIPO',
    flag: 'KOR',
  },
  {
    id: 'nor-viebust',
    name: 'VIEBUST',
    flag: 'NOR',
  },
  {
    id: 'nor-sorreisa',
    name: 'SORREISA',
    flag: 'NOR',
  },
  {
    id: 'chn-kaolaotou',
    name: 'KAOLAOTOU',
    flag: 'CHN',
  },
  {
    id: 'ita-varazze',
    name: 'VARAZZE',
    flag: 'ITA',
  },
  {
    id: 'ita-fortedeimarmi',
    name: 'FORTE DEI MARMI',
    flag: 'ITA',
  },
  {
    id: 'bgr-kavarnaanchorage',
    name: 'KAVARNA ANCHORAGE',
    flag: 'BGR',
  },
  {
    id: 'sdn-marsabashayer',
    name: 'MARSA BASHAYER',
    flag: 'SDN',
  },
  {
    id: 'tza-daressalaam',
    name: 'DAR ES SALAAM',
    flag: 'TZA',
  },
  {
    id: 'irn-bahregan',
    name: 'BAHREGAN',
    flag: 'IRN',
  },
  {
    id: 'cod-kizombafpso',
    name: 'KIZOMBA FPSO',
    flag: 'COD',
  },
  {
    id: 'per-paita',
    name: 'PAITA',
    flag: 'PER',
  },
  {
    id: 'rus-yaroslavl',
    name: 'YAROSLAVL',
    flag: 'RUS',
  },
  {
    id: 'mne-bijela',
    name: 'BIJELA',
    flag: 'MNE',
  },
  {
    id: 'usa-montaukstation',
    name: 'MONTAUK STATION',
    flag: 'USA',
  },
  {
    id: 'dnk-bogense',
    name: 'BOGENSE',
    flag: 'DNK',
  },
  {
    id: 'phl-tandayag',
    name: 'TANDAYAG',
    flag: 'PHL',
  },
  {
    id: 'lbr-buchanan',
    name: 'BUCHANAN',
    flag: 'LBR',
  },
  {
    id: 'bel-clairehaie',
    name: 'CLAIRE HAIE',
    flag: 'BEL',
  },
  {
    id: 'idn-hantipan',
    name: 'HANTIPAN',
    flag: 'IDN',
  },
  {
    id: 'can-campbellriver',
    name: 'CAMPBELL RIVER',
    flag: 'CAN',
  },
  {
    id: 'mex-lapaz',
    name: 'LA PAZ',
    flag: 'MEX',
  },
  {
    id: 'usa-marathon',
    name: 'MARATHON',
    flag: 'USA',
  },
  {
    id: 'usa-southport',
    name: 'SOUTHPORT',
    flag: 'USA',
  },
  {
    id: 'usa-swansboro',
    name: 'SWANSBORO',
    flag: 'USA',
  },
  {
    id: 'usa-fortandrews',
    name: 'FORT ANDREWS',
    flag: 'USA',
  },
  {
    id: 'chl-puntaarenas',
    name: 'PUNTA ARENAS',
    flag: 'CHL',
  },
  {
    id: 'ven-carupano',
    name: 'CARUPANO',
    flag: 'VEN',
  },
  {
    id: 'esp-santauxiaribeira',
    name: 'SANTA UXIA RIBEIRA',
    flag: 'ESP',
  },
  {
    id: 'esp-fuenterrabia',
    name: 'FUENTERRABIA',
    flag: 'ESP',
  },
  {
    id: "esp-s'arenal",
    name: "S'ARENAL",
    flag: 'ESP',
  },
  {
    id: 'nor-haugesund',
    name: 'HAUGESUND',
    flag: 'NOR',
  },
  {
    id: 'dnk-osterbyhavn',
    name: 'OSTERBYHAVN',
    flag: 'DNK',
  },
  {
    id: 'nor-stamsund',
    name: 'STAMSUND',
    flag: 'NOR',
  },
  {
    id: 'ita-agropoli',
    name: 'AGROPOLI',
    flag: 'ITA',
  },
  {
    id: 'lby-misurata',
    name: 'MISURATA',
    flag: 'LBY',
  },
  {
    id: 'nor-skutvik',
    name: 'SKUTVIK',
    flag: 'NOR',
  },
  {
    id: 'aut-durnstein',
    name: 'DURNSTEIN',
    flag: 'AUT',
  },
  {
    id: 'pol-kolobrzeg',
    name: 'KOLOBRZEG',
    flag: 'POL',
  },
  {
    id: 'zaf-simonstown',
    name: 'SIMONSTOWN',
    flag: 'ZAF',
  },
  {
    id: 'nor-batsfjord',
    name: 'BATSFJORD',
    flag: 'NOR',
  },
  {
    id: 'tur-yomra',
    name: 'YOMRA',
    flag: 'TUR',
  },
  {
    id: 'ind-karanje',
    name: 'KARANJE',
    flag: 'IND',
  },
  {
    id: 'chn-yichang',
    name: 'YICHANG',
    flag: 'CHN',
  },
  {
    id: 'chn-cheklapkok',
    name: 'CHEKLAPKOK',
    flag: 'CHN',
  },
  {
    id: 'twn-liuqiu',
    name: 'LIUQIU',
    flag: 'TWN',
  },
  {
    id: 'chn-xifangshen',
    name: 'XIFANGSHEN',
    flag: 'CHN',
  },
  {
    id: 'cri-moin',
    name: 'MOIN',
    flag: 'CRI',
  },
  {
    id: 'pan-puertoarmuelles',
    name: 'PUERTO ARMUELLES',
    flag: 'PAN',
  },
  {
    id: 'grc-zakynthos',
    name: 'ZAKYNTHOS',
    flag: 'GRC',
  },
  {
    id: 'grc-anafi',
    name: 'ANAFI',
    flag: 'GRC',
  },
  {
    id: 'ven-catialamar',
    name: 'CATIA LA MAR',
    flag: 'VEN',
  },
  {
    id: 'bel-andenne',
    name: 'ANDENNE',
    flag: 'BEL',
  },
  {
    id: 'idn-wayame',
    name: 'WAYAME',
    flag: 'IDN',
  },
  {
    id: 'usa-yorkriverhaven',
    name: 'YORK RIVER HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-ogdensburg',
    name: 'OGDENSBURG',
    flag: 'USA',
  },
  {
    id: 'hrv-brijuni',
    name: 'BRIJUNI',
    flag: 'HRV',
  },
  {
    id: 'hrv-otokscedro',
    name: 'OTOK SCEDRO',
    flag: 'HRV',
  },
  {
    id: 'pri-boqueron',
    name: 'BOQUERON',
    flag: 'PRI',
  },
  {
    id: 'gbr-sandbank',
    name: 'SANDBANK',
    flag: 'GBR',
  },
  {
    id: 'rou-oltenita',
    name: 'OLTENITA',
    flag: 'ROU',
  },
  {
    id: 'dnk-skaelskor',
    name: 'SKAELSKOR',
    flag: 'DNK',
  },
  {
    id: 'ven-joseterminal',
    name: 'JOSE TERMINAL',
    flag: 'VEN',
  },
  {
    id: 'usa-isthmuscove',
    name: 'ISTHMUS COVE',
    flag: 'USA',
  },
  {
    id: 'usa-gramercy',
    name: 'GRAMERCY',
    flag: 'USA',
  },
  {
    id: 'chl-sanjose',
    name: 'SAN JOSE',
    flag: 'CHL',
  },
  {
    id: 'can-blacksharbour',
    name: 'BLACKS HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'tto-portofspain',
    name: 'PORT OF SPAIN',
    flag: 'TTO',
  },
  {
    id: "can-stjohn's",
    name: "ST JOHN'S",
    flag: 'CAN',
  },
  {
    id: 'bra-riodejaneiro',
    name: 'RIO DE JANEIRO',
    flag: 'BRA',
  },
  {
    id: 'isl-raufarhofn',
    name: 'RAUFARHOFN',
    flag: 'ISL',
  },
  {
    id: 'fro-klaksvik',
    name: 'KLAKSVIK',
    flag: 'FRO',
  },
  {
    id: 'gbr-inverness',
    name: 'INVERNESS',
    flag: 'GBR',
  },
  {
    id: 'fra-sainttropez',
    name: 'SAINT TROPEZ',
    flag: 'FRA',
  },
  {
    id: 'dnk-vejle',
    name: 'VEJLE',
    flag: 'DNK',
  },
  {
    id: 'deu-sehnde',
    name: 'SEHNDE',
    flag: 'DEU',
  },
  {
    id: 'nor-kabelvaag',
    name: 'KABELVAAG',
    flag: 'NOR',
  },
  {
    id: 'hrv-omisalj',
    name: 'OMISALJ',
    flag: 'HRV',
  },
  {
    id: 'hrv-jelsa',
    name: 'JELSA',
    flag: 'HRV',
  },
  {
    id: 'tur-mudanya',
    name: 'MUDANYA',
    flag: 'TUR',
  },
  {
    id: 'tur-samsun',
    name: 'SAMSUN',
    flag: 'TUR',
  },
  {
    id: 'tha-bangsaphan',
    name: 'BANG SAPHAN',
    flag: 'THA',
  },
  {
    id: 'phl-iligan',
    name: 'ILIGAN',
    flag: 'PHL',
  },
  {
    id: 'jpn-naoetsu',
    name: 'NAOETSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-muroran',
    name: 'MURORAN',
    flag: 'JPN',
  },
  {
    id: 'png-madang',
    name: 'MADANG',
    flag: 'PNG',
  },
  {
    id: 'aus-cleveland',
    name: 'CLEVELAND',
    flag: 'AUS',
  },
  {
    id: 'nzl-halfmoonbay',
    name: 'HALF MOON BAY',
    flag: 'NZL',
  },
  {
    id: 'dnk-nexo',
    name: 'NEXO',
    flag: 'DNK',
  },
  {
    id: 'grc-patmos',
    name: 'PATMOS',
    flag: 'GRC',
  },
  {
    id: 'nor-kirkenes',
    name: 'KIRKENES',
    flag: 'NOR',
  },
  {
    id: 'chn-changhai',
    name: 'CHANGHAI',
    flag: 'CHN',
  },
  {
    id: 'aus-westernport',
    name: 'WESTERNPORT',
    flag: 'AUS',
  },
  {
    id: 'nzl-whangarei',
    name: 'WHANGAREI',
    flag: 'NZL',
  },
  {
    id: 'usa-oceanside',
    name: 'OCEANSIDE',
    flag: 'USA',
  },
  {
    id: 'flk-berkeleysound',
    name: 'BERKELEY SOUND',
    flag: 'FLK',
  },
  {
    id: 'chn-jinshan',
    name: 'JINSHAN',
    flag: 'CHN',
  },
  {
    id: 'ago-palancaterminal',
    name: 'PALANCA TERMINAL',
    flag: 'AGO',
  },
  {
    id: 'usa-pointreyes',
    name: 'POINT REYES',
    flag: 'USA',
  },
  {
    id: 'nld-bodegraven',
    name: 'BODEGRAVEN',
    flag: 'NLD',
  },
  {
    id: 'can-churchill',
    name: 'CHURCHILL',
    flag: 'CAN',
  },
  {
    id: 'nor-skjaerhalden',
    name: 'SKJAERHALDEN',
    flag: 'NOR',
  },
  {
    id: 'usa-goodhope',
    name: 'GOOD HOPE',
    flag: 'USA',
  },
  {
    id: 'usa-alexandriabay',
    name: 'ALEXANDRIA BAY',
    flag: 'USA',
  },
  {
    id: 'deu-lemwerder',
    name: 'LEMWERDER',
    flag: 'DEU',
  },
  {
    id: 'egy-eltor',
    name: 'EL TOR',
    flag: 'EGY',
  },
  {
    id: 'usa-mystic',
    name: 'MYSTIC',
    flag: 'USA',
  },
  {
    id: 'mex-rosaritoanchorage',
    name: 'ROSARITO ANCHORAGE',
    flag: 'MEX',
  },
  {
    id: 'usa-ashtabula',
    name: 'ASHTABULA',
    flag: 'USA',
  },
  {
    id: 'swe-gustavsberg',
    name: 'GUSTAVSBERG',
    flag: 'SWE',
  },
  {
    id: 'usa-castine',
    name: 'CASTINE',
    flag: 'USA',
  },
  {
    id: 'usa-porttownsend',
    name: 'PORT TOWNSEND',
    flag: 'USA',
  },
  {
    id: 'usa-burntstore',
    name: 'BURNT STORE',
    flag: 'USA',
  },
  {
    id: 'per-barranco',
    name: 'BARRANCO',
    flag: 'PER',
  },
  {
    id: 'arg-ramallo',
    name: 'RAMALLO',
    flag: 'ARG',
  },
  {
    id: 'prt-setubal',
    name: 'SETUBAL',
    flag: 'PRT',
  },
  {
    id: 'esp-chipiona',
    name: 'CHIPIONA',
    flag: 'ESP',
  },
  {
    id: 'fra-iledebatz',
    name: 'ILE DE BATZ',
    flag: 'FRA',
  },
  {
    id: 'gbr-barry',
    name: 'BARRY',
    flag: 'GBR',
  },
  {
    id: 'dnk-randers',
    name: 'RANDERS',
    flag: 'DNK',
  },
  {
    id: 'swe-lidkoping',
    name: 'LIDKOPING',
    flag: 'SWE',
  },
  {
    id: 'ukr-vylkove',
    name: 'VYLKOVE',
    flag: 'UKR',
  },
  {
    id: 'tza-mtwara',
    name: 'MTWARA',
    flag: 'TZA',
  },
  {
    id: 'are-ummalqaywayn',
    name: 'UMM AL QAYWAYN',
    flag: 'ARE',
  },
  {
    id: 'ind-kochi',
    name: 'KOCHI',
    flag: 'IND',
  },
  {
    id: 'chn-xinhui',
    name: 'XINHUI',
    flag: 'CHN',
  },
  {
    id: 'idn-bitung',
    name: 'BITUNG',
    flag: 'IDN',
  },
  {
    id: 'prt-praiadavitoria',
    name: 'PRAIA DA VITORIA',
    flag: 'PRT',
  },
  {
    id: 'nor-hardbakke',
    name: 'HARDBAKKE',
    flag: 'NOR',
  },
  {
    id: 'dnk-juelsminde',
    name: 'JUELSMINDE',
    flag: 'DNK',
  },
  {
    id: 'tur-namikkemal',
    name: 'NAMIK KEMAL',
    flag: 'TUR',
  },
  {
    id: 'omn-qalhatlngterminal',
    name: 'QALHAT LNG TERMINAL',
    flag: 'OMN',
  },
  {
    id: 'rus-yuzhokurilsk',
    name: 'YUZHO KURILSK',
    flag: 'RUS',
  },
  {
    id: 'col-puertonuevo',
    name: 'PUERTO NUEVO',
    flag: 'COL',
  },
  {
    id: 'twn-hoping',
    name: 'HOPING',
    flag: 'TWN',
  },
  {
    id: 'can-thunderbay',
    name: 'THUNDER BAY',
    flag: 'CAN',
  },
  {
    id: 'can-charlottetown',
    name: 'CHARLOTTETOWN',
    flag: 'CAN',
  },
  {
    id: 'deu-bendorf',
    name: 'BENDORF',
    flag: 'DEU',
  },
  {
    id: 'hrv-ilovik',
    name: 'ILOVIK',
    flag: 'HRV',
  },
  {
    id: 'rus-primorsk',
    name: 'PRIMORSK',
    flag: 'RUS',
  },
  {
    id: 'jpn-sakaide',
    name: 'SAKAIDE',
    flag: 'JPN',
  },
  {
    id: 'gbr-glensanda',
    name: 'GLENSANDA',
    flag: 'GBR',
  },
  {
    id: 'nor-volda',
    name: 'VOLDA',
    flag: 'NOR',
  },
  {
    id: 'swe-halmstad',
    name: 'HALMSTAD',
    flag: 'SWE',
  },
  {
    id: 'usa-naknek',
    name: 'NAKNEK',
    flag: 'USA',
  },
  {
    id: 'nld-gouda',
    name: 'GOUDA',
    flag: 'NLD',
  },
  {
    id: 'mys-sungaiudang',
    name: 'SUNGAI UDANG',
    flag: 'MYS',
  },
  {
    id: 'nzl-opua',
    name: 'OPUA',
    flag: 'NZL',
  },
  {
    id: 'per-lapampillaoilterminal',
    name: 'LA PAMPILLA OIL TERMINAL',
    flag: 'PER',
  },
  {
    id: 'ukr-nikotera',
    name: 'NIKO TERA',
    flag: 'UKR',
  },
  {
    id: 'bel-dinant',
    name: 'DINANT',
    flag: 'BEL',
  },
  {
    id: 'bel-yvoir',
    name: 'YVOIR',
    flag: 'BEL',
  },
  {
    id: 'aus-eleebana',
    name: 'ELEEBANA',
    flag: 'AUS',
  },
  {
    id: 'usa-threemileharbor',
    name: 'THREEMILE HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-sitka',
    name: 'SITKA',
    flag: 'USA',
  },
  {
    id: 'can-klemtu',
    name: 'KLEMTU',
    flag: 'CAN',
  },
  {
    id: 'can-powellriver',
    name: 'POWELL RIVER',
    flag: 'CAN',
  },
  {
    id: 'ecu-ayoraanchorage',
    name: 'AYORA ANCHORAGE',
    flag: 'ECU',
  },
  {
    id: 'usa-seneca',
    name: 'SENECA',
    flag: 'USA',
  },
  {
    id: 'chl-tocopilla',
    name: 'TOCOPILLA',
    flag: 'CHL',
  },
  {
    id: 'can-ramea',
    name: 'RAMEA',
    flag: 'CAN',
  },
  {
    id: 'fra-granville',
    name: 'GRANVILLE',
    flag: 'FRA',
  },
  {
    id: 'esp-tabarca',
    name: 'TABARCA',
    flag: 'ESP',
  },
  {
    id: 'esp-portdandratx',
    name: 'PORT DANDRATX',
    flag: 'ESP',
  },
  {
    id: 'nor-ydstebohamn',
    name: 'YDSTEBOHAMN',
    flag: 'NOR',
  },
  {
    id: 'ita-laspezia',
    name: 'LA SPEZIA',
    flag: 'ITA',
  },
  {
    id: 'swe-helsingborg',
    name: 'HELSINGBORG',
    flag: 'SWE',
  },
  {
    id: 'deu-greifswald',
    name: 'GREIFSWALD',
    flag: 'DEU',
  },
  {
    id: 'aut-feldkirchenanderdonau',
    name: 'FELDKIRCHEN AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'ita-tropea',
    name: 'TROPEA',
    flag: 'ITA',
  },
  {
    id: 'nor-andenes',
    name: 'ANDENES',
    flag: 'NOR',
  },
  {
    id: 'grc-thessaloniki',
    name: 'THESSALONIKI',
    flag: 'GRC',
  },
  {
    id: 'ukr-mykolayiv',
    name: 'MYKOLAYIV',
    flag: 'UKR',
  },
  {
    id: 'chn-haimen',
    name: 'HAIMEN',
    flag: 'CHN',
  },
  {
    id: 'chn-xiangshui',
    name: 'XIANGSHUI',
    flag: 'CHN',
  },
  {
    id: 'chn-chongming',
    name: 'CHONGMING',
    flag: 'CHN',
  },
  {
    id: 'aus-safetybeach',
    name: 'SAFETY BEACH',
    flag: 'AUS',
  },
  {
    id: 'ncl-noumea',
    name: 'NOUMEA',
    flag: 'NCL',
  },
  {
    id: 'usa-yerbabuenaisland',
    name: 'YERBABUENA ISLAND',
    flag: 'USA',
  },
  {
    id: 'dom-caucedo',
    name: 'CAUCEDO',
    flag: 'DOM',
  },
  {
    id: 'bra-ilhaguaiba',
    name: 'ILHA GUAIBA',
    flag: 'BRA',
  },
  {
    id: 'fra-golfejuan',
    name: 'GOLFE JUAN',
    flag: 'FRA',
  },
  {
    id: 'mne-hercegnovi',
    name: 'HERCEGNOVI',
    flag: 'MNE',
  },
  {
    id: 'aus-burnie',
    name: 'BURNIE',
    flag: 'AUS',
  },
  {
    id: 'mhl-ebaye',
    name: 'EBAYE',
    flag: 'MHL',
  },
  {
    id: 'can-robertsbank',
    name: 'ROBERTS BANK',
    flag: 'CAN',
  },
  {
    id: 'arg-puertorosales',
    name: 'PUERTO ROSALES',
    flag: 'ARG',
  },
  {
    id: 'nor-vormedal',
    name: 'VORMEDAL',
    flag: 'NOR',
  },
  {
    id: 'che-basel',
    name: 'BASEL',
    flag: 'CHE',
  },
  {
    id: 'deu-ladbergen',
    name: 'LADBERGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-barth',
    name: 'BARTH',
    flag: 'DEU',
  },
  {
    id: 'grc-missolonghi',
    name: 'MISSOLONGHI',
    flag: 'GRC',
  },
  {
    id: 'gbr-portbannatyne',
    name: 'PORT BANNATYNE',
    flag: 'GBR',
  },
  {
    id: 'ukr-feodosiya',
    name: 'FEODOSIYA',
    flag: 'UKR',
  },
  {
    id: 'dnk-skaerbaek',
    name: 'SKAERBAEK',
    flag: 'DNK',
  },
  {
    id: 'swe-smygehamn',
    name: 'SMYGEHAMN',
    flag: 'SWE',
  },
  {
    id: 'irn-astara',
    name: 'ASTARA',
    flag: 'IRN',
  },
  {
    id: 'grc-neakarvali',
    name: 'NEA KARVALI',
    flag: 'GRC',
  },
  {
    id: 'idn-prigi',
    name: 'PRIGI',
    flag: 'IDN',
  },
  {
    id: 'usa-industry',
    name: 'INDUSTRY',
    flag: 'USA',
  },
  {
    id: 'nld-wageningen',
    name: 'WAGENINGEN',
    flag: 'NLD',
  },
  {
    id: 'can-esquimalt',
    name: 'ESQUIMALT',
    flag: 'CAN',
  },
  {
    id: 'can-tsehumharbour',
    name: 'TSEHUM HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'usa-paducah',
    name: 'PADUCAH',
    flag: 'USA',
  },
  {
    id: 'per-sanjuandemarcona',
    name: 'SAN JUAN DE MARCONA',
    flag: 'PER',
  },
  {
    id: 'vgb-sopershole',
    name: 'SOPERS HOLE',
    flag: 'VGB',
  },
  {
    id: 'bra-riogrande',
    name: 'RIO GRANDE',
    flag: 'BRA',
  },
  {
    id: 'fra-larichardais',
    name: 'LA RICHARDAIS',
    flag: 'FRA',
  },
  {
    id: 'esp-mahon',
    name: 'MAHON',
    flag: 'ESP',
  },
  {
    id: 'nld-burgum',
    name: 'BURGUM',
    flag: 'NLD',
  },
  {
    id: 'nor-rekefjord',
    name: 'REKEFJORD',
    flag: 'NOR',
  },
  {
    id: 'fra-rosenau',
    name: 'ROSENAU',
    flag: 'FRA',
  },
  {
    id: 'gab-libreville',
    name: 'LIBREVILLE',
    flag: 'GAB',
  },
  {
    id: 'dnk-karrebaeksminde',
    name: 'KARREBAEKSMINDE',
    flag: 'DNK',
  },
  {
    id: 'nor-forvik',
    name: 'FORVIK',
    flag: 'NOR',
  },
  {
    id: 'grc-igoumenitsa',
    name: 'IGOUMENITSA',
    flag: 'GRC',
  },
  {
    id: 'ken-mombasa',
    name: 'MOMBASA',
    flag: 'KEN',
  },
  {
    id: 'idn-cigading',
    name: 'CIGADING',
    flag: 'IDN',
  },
  {
    id: 'chn-shantou',
    name: 'SHANTOU',
    flag: 'CHN',
  },
  {
    id: 'chn-quanzhou',
    name: 'QUANZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-daishancounty',
    name: 'DAISHAN COUNTY',
    flag: 'CHN',
  },
  {
    id: 'nzl-portlyttelton',
    name: 'PORT LYTTELTON',
    flag: 'NZL',
  },
  {
    id: 'usa-sabinepass',
    name: 'SABINE PASS',
    flag: 'USA',
  },
  {
    id: 'gbr-looe',
    name: 'LOOE',
    flag: 'GBR',
  },
  {
    id: 'ita-crotone',
    name: 'CROTONE',
    flag: 'ITA',
  },
  {
    id: 'fin-mantyluoto',
    name: 'MANTYLUOTO',
    flag: 'FIN',
  },
  {
    id: 'nor-sorvar',
    name: 'SORVAR',
    flag: 'NOR',
  },
  {
    id: 'tur-zonguldak',
    name: 'ZONGULDAK',
    flag: 'TUR',
  },
  {
    id: 'are-alrafiq',
    name: 'AL RAFIQ',
    flag: 'ARE',
  },
  {
    id: 'jpn-karatsu',
    name: 'KARATSU',
    flag: 'JPN',
  },
  {
    id: 'usa-newportnews',
    name: 'NEWPORT NEWS',
    flag: 'USA',
  },
  {
    id: 'gbr-lymeregis',
    name: 'LYME REGIS',
    flag: 'GBR',
  },
  {
    id: 'ita-falconara',
    name: 'FALCONARA',
    flag: 'ITA',
  },
  {
    id: 'chn-longwangtang',
    name: 'LONGWANGTANG',
    flag: 'CHN',
  },
  {
    id: 'mys-portdickson',
    name: 'PORT DICKSON',
    flag: 'MYS',
  },
  {
    id: 'ita-capotesta',
    name: 'CAPO TESTA',
    flag: 'ITA',
  },
  {
    id: 'nor-skogn',
    name: 'SKOGN',
    flag: 'NOR',
  },
  {
    id: 'ita-grado',
    name: 'GRADO',
    flag: 'ITA',
  },
  {
    id: 'gbr-hartlepool',
    name: 'HARTLEPOOL',
    flag: 'GBR',
  },
  {
    id: 'grc-koufonisos',
    name: 'KOUFONISOS',
    flag: 'GRC',
  },
  {
    id: 'nor-espevaer',
    name: 'ESPEVAER',
    flag: 'NOR',
  },
  {
    id: 'rus-beringovsky',
    name: 'BERINGOVSKY',
    flag: 'RUS',
  },
  {
    id: 'are-abkfield',
    name: 'ABK FIELD',
    flag: 'ARE',
  },
  {
    id: 'isl-straumsvik',
    name: 'STRAUMSVIK',
    flag: 'ISL',
  },
  {
    id: 'prk-haeju',
    name: 'HAEJU',
    flag: 'PRK',
  },
  {
    id: 'rou-isaccea',
    name: 'ISACCEA',
    flag: 'ROU',
  },
  {
    id: 'idn-brondong',
    name: 'BRONDONG',
    flag: 'IDN',
  },
  {
    id: 'fra-cuinchy',
    name: 'CUINCHY',
    flag: 'FRA',
  },
  {
    id: 'gbr-garston',
    name: 'GARSTON',
    flag: 'GBR',
  },
  {
    id: 'idn-labuhanmaringgai',
    name: 'LABUHAN MARINGGAI',
    flag: 'IDN',
  },
  {
    id: 'bhs-chubcay',
    name: 'CHUB CAY',
    flag: 'BHS',
  },
  {
    id: 'sur-paramaribo',
    name: 'PARAMARIBO',
    flag: 'SUR',
  },
  {
    id: 'esp-puntalangosteira',
    name: 'PUNTA LANGOSTEIRA',
    flag: 'ESP',
  },
  {
    id: 'gbr-dundee',
    name: 'DUNDEE',
    flag: 'GBR',
  },
  {
    id: 'gbr-portland',
    name: 'PORTLAND',
    flag: 'GBR',
  },
  {
    id: 'nld-rotterdambotlek',
    name: 'ROTTERDAM BOTLEK',
    flag: 'NLD',
  },
  {
    id: 'nor-rosendal',
    name: 'ROSENDAL',
    flag: 'NOR',
  },
  {
    id: 'nld-lochem',
    name: 'LOCHEM',
    flag: 'NLD',
  },
  {
    id: 'tza-zanzibar',
    name: 'ZANZIBAR',
    flag: 'TZA',
  },
  {
    id: 'bhr-askar',
    name: 'ASKAR',
    flag: 'BHR',
  },
  {
    id: 'bhr-sitrah',
    name: 'SITRAH',
    flag: 'BHR',
  },
  {
    id: 'twn-kinmen',
    name: 'KINMEN',
    flag: 'TWN',
  },
  {
    id: 'nzl-nelson',
    name: 'NELSON',
    flag: 'NZL',
  },
  {
    id: 'usa-hoonah',
    name: 'HOONAH',
    flag: 'USA',
  },
  {
    id: 'chl-coquimbo',
    name: 'COQUIMBO',
    flag: 'CHL',
  },
  {
    id: 'irl-dunmoreeast',
    name: 'DUNMORE EAST',
    flag: 'IRL',
  },
  {
    id: 'hrv-sibenik',
    name: 'SIBENIK',
    flag: 'HRV',
  },
  {
    id: 'grc-syrosanchorage',
    name: 'SYROS ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'esp-ondarroa',
    name: 'ONDARROA',
    flag: 'ESP',
  },
  {
    id: 'grc-agioitheodoroi',
    name: 'AGIOI THEODOROI',
    flag: 'GRC',
  },
  {
    id: 'usa-keylargo',
    name: 'KEY LARGO',
    flag: 'USA',
  },
  {
    id: 'nor-storebo',
    name: 'STOREBO',
    flag: 'NOR',
  },
  {
    id: 'nld-kampen',
    name: 'KAMPEN',
    flag: 'NLD',
  },
  {
    id: 'swe-bietnam',
    name: 'BIETNAM',
    flag: 'SWE',
  },
  {
    id: 'hun-baja',
    name: 'BAJA',
    flag: 'HUN',
  },
  {
    id: 'deu-zinnowitz',
    name: 'ZINNOWITZ',
    flag: 'DEU',
  },
  {
    id: 'ita-bosa',
    name: 'BOSA',
    flag: 'ITA',
  },
  {
    id: 'swe-bastad',
    name: 'BASTAD',
    flag: 'SWE',
  },
  {
    id: 'rus-rybinsk',
    name: 'RYBINSK',
    flag: 'RUS',
  },
  {
    id: 'phl-langtad',
    name: 'LANGTAD',
    flag: 'PHL',
  },
  {
    id: 'usa-peruil',
    name: 'PERU IL',
    flag: 'USA',
  },
  {
    id: 'hrv-jezera',
    name: 'JEZERA',
    flag: 'HRV',
  },
  {
    id: 'fra-metz',
    name: 'METZ',
    flag: 'FRA',
  },
  {
    id: 'gbr-dagenham',
    name: 'DAGENHAM',
    flag: 'GBR',
  },
  {
    id: 'usa-channahon',
    name: 'CHANNAHON',
    flag: 'USA',
  },
  {
    id: 'usa-portroyallanding',
    name: 'PORT ROYAL LANDING',
    flag: 'USA',
  },
  {
    id: 'bhs-stanielcay',
    name: 'STANIEL CAY',
    flag: 'BHS',
  },
  {
    id: 'chl-quintero',
    name: 'QUINTERO',
    flag: 'CHL',
  },
  {
    id: 'usa-davisville',
    name: 'DAVISVILLE',
    flag: 'USA',
  },
  {
    id: 'maf-saintmartin',
    name: 'SAINT MARTIN',
    flag: 'MAF',
  },
  {
    id: 'arg-necochea',
    name: 'NECOCHEA',
    flag: 'ARG',
  },
  {
    id: 'cpv-portonovo',
    name: 'PORTO NOVO',
    flag: 'CPV',
  },
  {
    id: 'prt-lisbon',
    name: 'LISBON',
    flag: 'PRT',
  },
  {
    id: 'dnk-esbjerg',
    name: 'ESBJERG',
    flag: 'DNK',
  },
  {
    id: 'deu-hamburg',
    name: 'HAMBURG',
    flag: 'DEU',
  },
  {
    id: 'nor-muruvik',
    name: 'MURUVIK',
    flag: 'NOR',
  },
  {
    id: 'isr-eilat',
    name: 'EILAT',
    flag: 'ISR',
  },
  {
    id: 'reu-reunion',
    name: 'REUNION',
    flag: 'REU',
  },
  {
    id: 'chn-changqitou',
    name: 'CHANGQITOU',
    flag: 'CHN',
  },
  {
    id: 'chn-dafeng',
    name: 'DAFENG',
    flag: 'CHN',
  },
  {
    id: 'phl-cebu',
    name: 'CEBU',
    flag: 'PHL',
  },
  {
    id: 'jpn-tadotsu',
    name: 'TADOTSU',
    flag: 'JPN',
  },
  {
    id: 'aus-arcadiavale',
    name: 'ARCADIA VALE',
    flag: 'AUS',
  },
  {
    id: 'nzl-waihekeisland',
    name: 'WAIHEKE ISLAND',
    flag: 'NZL',
  },
  {
    id: 'esp-portalsnous',
    name: 'PORTALS NOUS',
    flag: 'ESP',
  },
  {
    id: 'nor-remoy',
    name: 'REMOY',
    flag: 'NOR',
  },
  {
    id: 'usa-elsegundoanchorage',
    name: 'EL SEGUNDO ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'fra-cassis',
    name: 'CASSIS',
    flag: 'FRA',
  },
  {
    id: 'tur-ambarli',
    name: 'AMBARLI',
    flag: 'TUR',
  },
  {
    id: 'jpn-tokuyamakudamatsuanchorage',
    name: 'TOKUYAMAKUDAMATSU ANCHORAGE',
    flag: 'JPN',
  },
  {
    id: 'ton-neiafu',
    name: 'NEIAFU',
    flag: 'TON',
  },
  {
    id: 'kna-charlestownanchorage',
    name: 'CHARLESTOWN ANCHORAGE',
    flag: 'KNA',
  },
  {
    id: 'nor-farsund',
    name: 'FARSUND',
    flag: 'NOR',
  },
  {
    id: 'aut-vienna',
    name: 'VIENNA',
    flag: 'AUT',
  },
  {
    id: 'bgr-novoselo',
    name: 'NOVO SELO',
    flag: 'BGR',
  },
  {
    id: 'kor-pyeongtaek',
    name: 'PYEONGTAEK',
    flag: 'KOR',
  },
  {
    id: 'rus-kurilsk',
    name: 'KURILSK',
    flag: 'RUS',
  },
  {
    id: 'usa-alpena',
    name: 'ALPENA',
    flag: 'USA',
  },
  {
    id: 'usa-yarmouth',
    name: 'YARMOUTH',
    flag: 'USA',
  },
  {
    id: 'fra-toulon',
    name: 'TOULON',
    flag: 'FRA',
  },
  {
    id: 'grc-paxos',
    name: 'PAXOS',
    flag: 'GRC',
  },
  {
    id: 'usa-metropolis',
    name: 'METROPOLIS',
    flag: 'USA',
  },
  {
    id: 'deu-haldensleben',
    name: 'HALDENSLEBEN',
    flag: 'DEU',
  },
  {
    id: 'bhs-crabcay',
    name: 'CRAB CAY',
    flag: 'BHS',
  },
  {
    id: 'swe-donso',
    name: 'DONSO',
    flag: 'SWE',
  },
  {
    id: 'nld-druten',
    name: 'DRUTEN',
    flag: 'NLD',
  },
  {
    id: 'bel-tessenderlo',
    name: 'TESSENDERLO',
    flag: 'BEL',
  },
  {
    id: 'nld-empel',
    name: 'EMPEL',
    flag: 'NLD',
  },
  {
    id: 'bel-avelgem',
    name: 'AVELGEM',
    flag: 'BEL',
  },
  {
    id: 'tur-maltepe',
    name: 'MALTEPE',
    flag: 'TUR',
  },
  {
    id: 'usa-harborisland',
    name: 'HARBOR ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-lewes',
    name: 'LEWES',
    flag: 'USA',
  },
  {
    id: 'tto-pointfortin',
    name: 'POINT FORTIN',
    flag: 'TTO',
  },
  {
    id: 'esp-nerga',
    name: 'NERGA',
    flag: 'ESP',
  },
  {
    id: 'esp-laredo',
    name: 'LAREDO',
    flag: 'ESP',
  },
  {
    id: 'nor-straume',
    name: 'STRAUME',
    flag: 'NOR',
  },
  {
    id: 'nor-tau',
    name: 'TAU',
    flag: 'NOR',
  },
  {
    id: 'deu-mannheim',
    name: 'MANNHEIM',
    flag: 'DEU',
  },
  {
    id: 'tun-rades',
    name: 'RADES',
    flag: 'TUN',
  },
  {
    id: 'swe-stromstad',
    name: 'STROMSTAD',
    flag: 'SWE',
  },
  {
    id: 'ala-kokarkyrkoby',
    name: 'KOKAR KYRKOBY',
    flag: 'ALA',
  },
  {
    id: 'fin-veitsiluoto',
    name: 'VEITSILUOTO',
    flag: 'FIN',
  },
  {
    id: 'tur-enez',
    name: 'ENEZ',
    flag: 'TUR',
  },
  {
    id: 'are-zirku',
    name: 'ZIRKU',
    flag: 'ARE',
  },
  {
    id: 'chn-minhang',
    name: 'MINHANG',
    flag: 'CHN',
  },
  {
    id: 'usa-cordova',
    name: 'CORDOVA',
    flag: 'USA',
  },
  {
    id: 'gbr-falmouth',
    name: 'FALMOUTH',
    flag: 'GBR',
  },
  {
    id: 'tur-nemrut',
    name: 'NEMRUT',
    flag: 'TUR',
  },
  {
    id: 'can-septiles',
    name: 'SEPT ILES',
    flag: 'CAN',
  },
  {
    id: 'chl-chanaral',
    name: 'CHANARAL',
    flag: 'CHL',
  },
  {
    id: 'isl-seydisfjordur',
    name: 'SEYDISFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'fra-donges',
    name: 'DONGES',
    flag: 'FRA',
  },
  {
    id: 'deu-winningen',
    name: 'WINNINGEN',
    flag: 'DEU',
  },
  {
    id: 'hun-tat',
    name: 'TAT',
    flag: 'HUN',
  },
  {
    id: 'deu-weener',
    name: 'WEENER',
    flag: 'DEU',
  },
  {
    id: 'bel-peruwelz',
    name: 'PERUWELZ',
    flag: 'BEL',
  },
  {
    id: 'hun-sazhalombata',
    name: 'SAZHALOMBATA',
    flag: 'HUN',
  },
  {
    id: 'dma-portsmouth',
    name: 'PORTSMOUTH',
    flag: 'DMA',
  },
  {
    id: 'esp-santamaria',
    name: 'SANTA MARIA',
    flag: 'ESP',
  },
  {
    id: 'gbr-douglas',
    name: 'DOUGLAS',
    flag: 'GBR',
  },
  {
    id: 'esp-illaconillera',
    name: 'ILLA CONILLERA',
    flag: 'ESP',
  },
  {
    id: 'swe-uddevalla',
    name: 'UDDEVALLA',
    flag: 'SWE',
  },
  {
    id: 'nor-nesna',
    name: 'NESNA',
    flag: 'NOR',
  },
  {
    id: 'grc-tinosanchorage',
    name: 'TINOS ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'nor-mehamn',
    name: 'MEHAMN',
    flag: 'NOR',
  },
  {
    id: 'ukr-dneprobugskiy',
    name: 'DNEPROBUGSKIY',
    flag: 'UKR',
  },
  {
    id: 'rus-murmansk',
    name: 'MURMANSK',
    flag: 'RUS',
  },
  {
    id: 'mus-portlouis',
    name: 'PORT LOUIS',
    flag: 'MUS',
  },
  {
    id: 'chn-honghu',
    name: 'HONGHU',
    flag: 'CHN',
  },
  {
    id: 'chn-yantian',
    name: 'YANTIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-zhangzhou',
    name: 'ZHANGZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-sansha',
    name: 'SANSHA',
    flag: 'CHN',
  },
  {
    id: 'png-kavieng',
    name: 'KAVIENG',
    flag: 'PNG',
  },
  {
    id: 'gbr-grangemouth',
    name: 'GRANGEMOUTH',
    flag: 'GBR',
  },
  {
    id: 'tur-kucukyali',
    name: 'KUCUKYALI',
    flag: 'TUR',
  },
  {
    id: 'chn-nancun',
    name: 'NANCUN',
    flag: 'CHN',
  },
  {
    id: 'aus-batemansbay',
    name: 'BATEMANS BAY',
    flag: 'AUS',
  },
  {
    id: 'vir-stcroix',
    name: 'ST CROIX',
    flag: 'VIR',
  },
  {
    id: 'usa-watchhill',
    name: 'WATCH HILL',
    flag: 'USA',
  },
  {
    id: 'ven-cabimas',
    name: 'CABIMAS',
    flag: 'VEN',
  },
  {
    id: 'gbr-ardrishaig',
    name: 'ARDRISHAIG',
    flag: 'GBR',
  },
  {
    id: 'hrv-zlarin',
    name: 'ZLARIN',
    flag: 'HRV',
  },
  {
    id: 'rus-ossora',
    name: 'OSSORA',
    flag: 'RUS',
  },
  {
    id: 'kor-pohang',
    name: 'POHANG',
    flag: 'KOR',
  },
  {
    id: 'usa-camanche',
    name: 'CAMANCHE',
    flag: 'USA',
  },
  {
    id: 'usa-cambridge',
    name: 'CAMBRIDGE',
    flag: 'USA',
  },
  {
    id: 'dnk-korshavn',
    name: 'KORSHAVN',
    flag: 'DNK',
  },
  {
    id: 'phl-balud',
    name: 'BALUD',
    flag: 'PHL',
  },
  {
    id: 'aus-bundaberg',
    name: 'BUNDABERG',
    flag: 'AUS',
  },
  {
    id: 'vct-petitsaintvincent',
    name: 'PETIT SAINT VINCENT',
    flag: 'VCT',
  },
  {
    id: 'nor-sandviksberget',
    name: 'SANDVIKSBERGET',
    flag: 'NOR',
  },
  {
    id: 'rus-tilichiki',
    name: 'TILICHIKI',
    flag: 'RUS',
  },
  {
    id: 'nor-sandnes',
    name: 'SANDNES',
    flag: 'NOR',
  },
  {
    id: 'swe-rivo',
    name: 'RIVO',
    flag: 'SWE',
  },
  {
    id: 'chn-jieyang',
    name: 'JIEYANG',
    flag: 'CHN',
  },
  {
    id: 'per-paramonga',
    name: 'PARAMONGA',
    flag: 'PER',
  },
  {
    id: 'phl-loreto',
    name: 'LORETO',
    flag: 'PHL',
  },
  {
    id: 'nld-heusden',
    name: 'HEUSDEN',
    flag: 'NLD',
  },
  {
    id: 'irl-kilrush',
    name: 'KILRUSH',
    flag: 'IRL',
  },
  {
    id: 'usa-fridayharbor',
    name: 'FRIDAY HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-vallejo',
    name: 'VALLEJO',
    flag: 'USA',
  },
  {
    id: 'mex-nuevovallarta',
    name: 'NUEVO VALLARTA',
    flag: 'MEX',
  },
  {
    id: 'usa-detroit',
    name: 'DETROIT',
    flag: 'USA',
  },
  {
    id: 'cuw-willemstad',
    name: 'WILLEMSTAD',
    flag: 'CUW',
  },
  {
    id: 'pri-sanjuan',
    name: 'SAN JUAN',
    flag: 'PRI',
  },
  {
    id: 'arg-buenosaires',
    name: 'BUENOS AIRES',
    flag: 'ARG',
  },
  {
    id: 'cpv-saofilipe',
    name: 'SAO FILIPE',
    flag: 'CPV',
  },
  {
    id: 'fra-lyon',
    name: 'LYON',
    flag: 'FRA',
  },
  {
    id: 'fra-lavera',
    name: 'LAVERA',
    flag: 'FRA',
  },
  {
    id: 'deu-hochdonn',
    name: 'HOCHDONN',
    flag: 'DEU',
  },
  {
    id: 'nor-mefjord',
    name: 'MEFJORD',
    flag: 'NOR',
  },
  {
    id: 'hrv-vukovar',
    name: 'VUKOVAR',
    flag: 'HRV',
  },
  {
    id: 'alb-durres',
    name: 'DURRES',
    flag: 'ALB',
  },
  {
    id: 'tur-mersin',
    name: 'MERSIN',
    flag: 'TUR',
  },
  {
    id: 'are-dubai',
    name: 'DUBAI',
    flag: 'ARE',
  },
  {
    id: 'bgd-chittagong',
    name: 'CHITTAGONG',
    flag: 'BGD',
  },
  {
    id: 'mys-portklang',
    name: 'PORT KLANG',
    flag: 'MYS',
  },
  {
    id: 'idn-parepare',
    name: 'PARE PARE',
    flag: 'IDN',
  },
  {
    id: 'chn-zhangjiagang',
    name: 'ZHANGJIAGANG',
    flag: 'CHN',
  },
  {
    id: 'phl-calapan',
    name: 'CALAPAN',
    flag: 'PHL',
  },
  {
    id: 'kor-mokpo',
    name: 'MOKPO',
    flag: 'KOR',
  },
  {
    id: 'kor-yeosu',
    name: 'YEOSU',
    flag: 'KOR',
  },
  {
    id: 'jpn-usuki',
    name: 'USUKI',
    flag: 'JPN',
  },
  {
    id: 'rus-malokurilsk',
    name: 'MALOKURILSK',
    flag: 'RUS',
  },
  {
    id: 'gbr-seaham',
    name: 'SEAHAM',
    flag: 'GBR',
  },
  {
    id: 'nor-vadso',
    name: 'VADSO',
    flag: 'NOR',
  },
  {
    id: 'egy-rasabuzanimah',
    name: 'RAS ABU ZANIMAH',
    flag: 'EGY',
  },
  {
    id: 'aus-manly',
    name: 'MANLY',
    flag: 'AUS',
  },
  {
    id: 'slv-acajutla',
    name: 'ACAJUTLA',
    flag: 'SLV',
  },
  {
    id: 'esp-varaderodebenalmad',
    name: 'VARADERO DE BENALMAD',
    flag: 'ESP',
  },
  {
    id: 'ita-mazaradelvallo',
    name: 'MAZARA DEL VALLO',
    flag: 'ITA',
  },
  {
    id: 'qat-raslaffan',
    name: 'RAS LAFFAN',
    flag: 'QAT',
  },
  {
    id: 'chn-panjin',
    name: 'PANJIN',
    flag: 'CHN',
  },
  {
    id: 'ven-puntaguaranao',
    name: 'PUNTA GUARANAO',
    flag: 'VEN',
  },
  {
    id: 'bra-viladoconde',
    name: 'VILA DO CONDE',
    flag: 'BRA',
  },
  {
    id: 'rus-temryukanchorage',
    name: 'TEMRYUK ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'chn-nanri',
    name: 'NANRI',
    flag: 'CHN',
  },
  {
    id: 'usa-mountvernon',
    name: 'MOUNT VERNON',
    flag: 'USA',
  },
  {
    id: 'hrv-olib',
    name: 'OLIB',
    flag: 'HRV',
  },
  {
    id: 'tur-bozburun',
    name: 'BOZBURUN',
    flag: 'TUR',
  },
  {
    id: 'jpn-senzaki',
    name: 'SENZAKI',
    flag: 'JPN',
  },
  {
    id: 'grc-kalamaki',
    name: 'KALAMAKI',
    flag: 'GRC',
  },
  {
    id: 'phl-niugan',
    name: 'NIUGAN',
    flag: 'PHL',
  },
  {
    id: 'idn-blanakan',
    name: 'BLANAKAN',
    flag: 'IDN',
  },
  {
    id: 'can-ucluelet',
    name: 'UCLUELET',
    flag: 'CAN',
  },
  {
    id: 'usa-carville',
    name: 'CARVILLE',
    flag: 'USA',
  },
  {
    id: 'per-veguetaanchorage',
    name: 'VEGUETA ANCHORAGE',
    flag: 'PER',
  },
  {
    id: 'usa-sneadsferry',
    name: 'SNEADS FERRY',
    flag: 'USA',
  },
  {
    id: 'bhs-harveyscay',
    name: 'HARVEYS CAY',
    flag: 'BHS',
  },
  {
    id: 'chl-puertowilliams',
    name: 'PUERTO WILLIAMS',
    flag: 'CHL',
  },
  {
    id: 'bra-belem',
    name: 'BELEM',
    flag: 'BRA',
  },
  {
    id: 'isl-olafsvik',
    name: 'OLAFSVIK',
    flag: 'ISL',
  },
  {
    id: 'esp-baiona',
    name: 'BAIONA',
    flag: 'ESP',
  },
  {
    id: 'gbr-newhaven',
    name: 'NEWHAVEN',
    flag: 'GBR',
  },
  {
    id: 'esp-canpastilla',
    name: 'CAN PASTILLA',
    flag: 'ESP',
  },
  {
    id: 'bel-rupelmonde',
    name: 'RUPELMONDE',
    flag: 'BEL',
  },
  {
    id: 'nld-krimpenaandelek',
    name: 'KRIMPEN AAN DE LEK',
    flag: 'NLD',
  },
  {
    id: 'fra-marseille',
    name: 'MARSEILLE',
    flag: 'FRA',
  },
  {
    id: 'nga-okrika',
    name: 'OKRIKA',
    flag: 'NGA',
  },
  {
    id: 'deu-ludinghausen',
    name: 'LUDINGHAUSEN',
    flag: 'DEU',
  },
  {
    id: 'dnk-horsens',
    name: 'HORSENS',
    flag: 'DNK',
  },
  {
    id: 'hrv-supetar',
    name: 'SUPETAR',
    flag: 'HRV',
  },
  {
    id: 'hun-almasfuzito',
    name: 'ALMASFUZITO',
    flag: 'HUN',
  },
  {
    id: 'nor-skjervoy',
    name: 'SKJERVOY',
    flag: 'NOR',
  },
  {
    id: 'tur-sile',
    name: 'SILE',
    flag: 'TUR',
  },
  {
    id: 'tur-antalya',
    name: 'ANTALYA',
    flag: 'TUR',
  },
  {
    id: 'vnm-quinhon',
    name: 'QUI NHON',
    flag: 'VNM',
  },
  {
    id: 'idn-sumberrejo',
    name: 'SUMBERREJO',
    flag: 'IDN',
  },
  {
    id: 'chn-shengsi',
    name: 'SHENGSI',
    flag: 'CHN',
  },
  {
    id: 'aus-greatkeppelisland',
    name: 'GREAT KEPPEL ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-laurieton',
    name: 'LAURIETON',
    flag: 'AUS',
  },
  {
    id: 'can-pinkneyspoint',
    name: 'PINKNEYS POINT',
    flag: 'CAN',
  },
  {
    id: 'nld-ameland',
    name: 'AMELAND',
    flag: 'NLD',
  },
  {
    id: 'tun-zarzis',
    name: 'ZARZIS',
    flag: 'TUN',
  },
  {
    id: 'chn-yingpan',
    name: 'YINGPAN',
    flag: 'CHN',
  },
  {
    id: 'chn-jinzhou',
    name: 'JINZHOU',
    flag: 'CHN',
  },
  {
    id: 'esh-laayoune',
    name: 'LAAYOUNE',
    flag: 'ESH',
  },
  {
    id: 'aus-ardrossan',
    name: 'ARDROSSAN',
    flag: 'AUS',
  },
  {
    id: 'usa-striperinc',
    name: 'STRIPER INC',
    flag: 'USA',
  },
  {
    id: 'dnk-abelo',
    name: 'ABELO',
    flag: 'DNK',
  },
  {
    id: 'fin-houtskar',
    name: 'HOUTSKAR',
    flag: 'FIN',
  },
  {
    id: 'mex-chahue',
    name: 'CHAHUE',
    flag: 'MEX',
  },
  {
    id: 'pan-cristobal',
    name: 'CRISTOBAL',
    flag: 'PAN',
  },
  {
    id: 'svk-sturovo',
    name: 'STUROVO',
    flag: 'SVK',
  },
  {
    id: 'deu-kelsterbach',
    name: 'KELSTERBACH',
    flag: 'DEU',
  },
  {
    id: 'hrv-molunat',
    name: 'MOLUNAT',
    flag: 'HRV',
  },
  {
    id: 'usa-monheganisland',
    name: 'MONHEGAN ISLAND',
    flag: 'USA',
  },
  {
    id: 'nic-puertosandino',
    name: 'PUERTO SANDINO',
    flag: 'NIC',
  },
  {
    id: 'swe-agno',
    name: 'AGNO',
    flag: 'SWE',
  },
  {
    id: 'pol-sopot',
    name: 'SOPOT',
    flag: 'POL',
  },
  {
    id: 'usa-kaneohe',
    name: 'KANEOHE',
    flag: 'USA',
  },
  {
    id: 'fro-midvagur',
    name: 'MIDVAGUR',
    flag: 'FRO',
  },
  {
    id: 'gbr-wick',
    name: 'WICK',
    flag: 'GBR',
  },
  {
    id: 'deu-emden',
    name: 'EMDEN',
    flag: 'DEU',
  },
  {
    id: 'nor-kyrksaeterora',
    name: 'KYRKSAETERORA',
    flag: 'NOR',
  },
  {
    id: 'deu-rendsburg',
    name: 'RENDSBURG',
    flag: 'DEU',
  },
  {
    id: 'swe-ahus',
    name: 'AHUS',
    flag: 'SWE',
  },
  {
    id: 'nor-sortland',
    name: 'SORTLAND',
    flag: 'NOR',
  },
  {
    id: 'hrv-rogac',
    name: 'ROGAC',
    flag: 'HRV',
  },
  {
    id: 'hrv-hvar',
    name: 'HVAR',
    flag: 'HRV',
  },
  {
    id: 'hrv-lastovo',
    name: 'LASTOVO',
    flag: 'HRV',
  },
  {
    id: 'ala-kumlinge',
    name: 'KUMLINGE',
    flag: 'ALA',
  },
  {
    id: 'grc-revithoussa',
    name: 'REVITHOUSSA',
    flag: 'GRC',
  },
  {
    id: 'chn-shijing',
    name: 'SHIJING',
    flag: 'CHN',
  },
  {
    id: 'twn-taipei',
    name: 'TAIPEI',
    flag: 'TWN',
  },
  {
    id: 'phl-cabadbaran',
    name: 'CABADBARAN',
    flag: 'PHL',
  },
  {
    id: 'usa-indialantic',
    name: 'INDIALANTIC',
    flag: 'USA',
  },
  {
    id: 'prt-horta',
    name: 'HORTA',
    flag: 'PRT',
  },
  {
    id: 'nor-sovik',
    name: 'SOVIK',
    flag: 'NOR',
  },
  {
    id: 'ind-ennore',
    name: 'ENNORE',
    flag: 'IND',
  },
  {
    id: 'mex-huanacaxtle',
    name: 'HUANACAXTLE',
    flag: 'MEX',
  },
  {
    id: 'bhs-northcatcay',
    name: 'NORTH CAT CAY',
    flag: 'BHS',
  },
  {
    id: 'hti-laffiteau',
    name: 'LAFFITEAU',
    flag: 'HTI',
  },
  {
    id: 'idn-tuban',
    name: 'TUBAN',
    flag: 'IDN',
  },
  {
    id: 'ita-civitavecchia',
    name: 'CIVITAVECCHIA',
    flag: 'ITA',
  },
  {
    id: 'bra-fpsovitoria',
    name: 'FPSO VITORIA',
    flag: 'BRA',
  },
  {
    id: 'usa-emmonak',
    name: 'EMMONAK',
    flag: 'USA',
  },
  {
    id: 'usa-batonrouge',
    name: 'BATON ROUGE',
    flag: 'USA',
  },
  {
    id: 'usa-norfolk',
    name: 'NORFOLK',
    flag: 'USA',
  },
  {
    id: 'shn-ascension',
    name: 'ASCENSION',
    flag: 'SHN',
  },
  {
    id: 'ita-olbia',
    name: 'OLBIA',
    flag: 'ITA',
  },
  {
    id: 'ita-torredelgreco',
    name: 'TORRE DEL GRECO',
    flag: 'ITA',
  },
  {
    id: 'hun-dunafoldvar',
    name: 'DUNAFOLDVAR',
    flag: 'HUN',
  },
  {
    id: 'phl-coron',
    name: 'CORON',
    flag: 'PHL',
  },
  {
    id: 'jpn-yatsushiro',
    name: 'YATSUSHIRO',
    flag: 'JPN',
  },
  {
    id: 'usa-titusville',
    name: 'TITUSVILLE',
    flag: 'USA',
  },
  {
    id: 'esp-marin',
    name: 'MARIN',
    flag: 'ESP',
  },
  {
    id: 'pan-melones',
    name: 'MELONES',
    flag: 'PAN',
  },
  {
    id: 'usa-northhavenisland',
    name: 'NORTH HAVEN ISLAND',
    flag: 'USA',
  },
  {
    id: "esp-l'estartit",
    name: "L'ESTARTIT",
    flag: 'ESP',
  },
  {
    id: 'deu-frankfurtammain',
    name: 'FRANKFURT AM MAIN',
    flag: 'DEU',
  },
  {
    id: 'deu-bleckede',
    name: 'BLECKEDE',
    flag: 'DEU',
  },
  {
    id: 'phl-jagna',
    name: 'JAGNA',
    flag: 'PHL',
  },
  {
    id: 'bhs-adelaidevillage',
    name: 'ADELAIDE VILLAGE',
    flag: 'BHS',
  },
  {
    id: 'ven-guayanacity',
    name: 'GUAYANA CITY',
    flag: 'VEN',
  },
  {
    id: 'lux-grevenmacher',
    name: 'GREVENMACHER',
    flag: 'LUX',
  },
  {
    id: 'aus-streakybay',
    name: 'STREAKY BAY',
    flag: 'AUS',
  },
  {
    id: 'per-cerroazul',
    name: 'CERRO AZUL',
    flag: 'PER',
  },
  {
    id: 'can-sooke',
    name: 'SOOKE',
    flag: 'CAN',
  },
  {
    id: 'ecu-guayaquil',
    name: 'GUAYAQUIL',
    flag: 'ECU',
  },
  {
    id: 'per-huacho',
    name: 'HUACHO',
    flag: 'PER',
  },
  {
    id: 'jam-portantonio',
    name: 'PORT ANTONIO',
    flag: 'JAM',
  },
  {
    id: 'usa-yonkers',
    name: 'YONKERS',
    flag: 'USA',
  },
  {
    id: 'usa-bristol',
    name: 'BRISTOL',
    flag: 'USA',
  },
  {
    id: 'irl-greystones',
    name: 'GREYSTONES',
    flag: 'IRL',
  },
  {
    id: 'fra-watten',
    name: 'WATTEN',
    flag: 'FRA',
  },
  {
    id: 'deu-list',
    name: 'LIST',
    flag: 'DEU',
  },
  {
    id: 'grc-mytilini',
    name: 'MYTILINI',
    flag: 'GRC',
  },
  {
    id: 'are-jumeirah',
    name: 'JUMEIRAH',
    flag: 'ARE',
  },
  {
    id: 'ind-ratnagiri',
    name: 'RATNAGIRI',
    flag: 'IND',
  },
  {
    id: 'rus-dudinka',
    name: 'DUDINKA',
    flag: 'RUS',
  },
  {
    id: 'idn-plajuanchorage',
    name: 'PLAJU ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'chn-jingjiang',
    name: 'JINGJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-qushanisland',
    name: 'QUSHAN ISLAND',
    flag: 'CHN',
  },
  {
    id: 'esp-garrucha',
    name: 'GARRUCHA',
    flag: 'ESP',
  },
  {
    id: 'hrv-ist',
    name: 'IST',
    flag: 'HRV',
  },
  {
    id: 'hrv-jesenice',
    name: 'JESENICE',
    flag: 'HRV',
  },
  {
    id: 'phl-portozamis',
    name: 'PORT OZAMIS',
    flag: 'PHL',
  },
  {
    id: 'prt-sines',
    name: 'SINES',
    flag: 'PRT',
  },
  {
    id: 'zaf-eastlondon',
    name: 'EAST LONDON',
    flag: 'ZAF',
  },
  {
    id: 'tur-igneada',
    name: 'IGNEADA',
    flag: 'TUR',
  },
  {
    id: 'pan-balboa',
    name: 'BALBOA',
    flag: 'PAN',
  },
  {
    id: 'sau-jeddah',
    name: 'JEDDAH',
    flag: 'SAU',
  },
  {
    id: 'usa-washington',
    name: 'WASHINGTON',
    flag: 'USA',
  },
  {
    id: 'usa-pequot',
    name: 'PEQUOT',
    flag: 'USA',
  },
  {
    id: 'nld-denhaag',
    name: 'DEN HAAG',
    flag: 'NLD',
  },
  {
    id: 'fin-pori',
    name: 'PORI',
    flag: 'FIN',
  },
  {
    id: 'grc-poros',
    name: 'POROS',
    flag: 'GRC',
  },
  {
    id: 'usa-powhatanpoint',
    name: 'POWHATAN POINT',
    flag: 'USA',
  },
  {
    id: 'dnk-kyndby',
    name: 'KYNDBY',
    flag: 'DNK',
  },
  {
    id: 'fra-rouen',
    name: 'ROUEN',
    flag: 'FRA',
  },
  {
    id: 'jpn-toyohashi',
    name: 'TOYOHASHI',
    flag: 'JPN',
  },
  {
    id: 'nga-sapele',
    name: 'SAPELE',
    flag: 'NGA',
  },
  {
    id: 'can-ottawa',
    name: 'OTTAWA',
    flag: 'CAN',
  },
  {
    id: 'nor-trysnes',
    name: 'TRYSNES',
    flag: 'NOR',
  },
  {
    id: 'bgr-ezerovo',
    name: 'EZEROVO',
    flag: 'BGR',
  },
  {
    id: 'usa-fortmyersbeach',
    name: 'FORT MYERS BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-beaufort',
    name: 'BEAUFORT',
    flag: 'USA',
  },
  {
    id: 'per-matarani',
    name: 'MATARANI',
    flag: 'PER',
  },
  {
    id: 'prt-portimao',
    name: 'PORTIMAO',
    flag: 'PRT',
  },
  {
    id: 'prt-vilarealdesantonio',
    name: 'VILA REAL DE S ANTONIO',
    flag: 'PRT',
  },
  {
    id: 'gbr-finnart',
    name: 'FINNART',
    flag: 'GBR',
  },
  {
    id: 'gbr-newport',
    name: 'NEWPORT',
    flag: 'GBR',
  },
  {
    id: 'esp-elmasnou',
    name: 'EL MASNOU',
    flag: 'ESP',
  },
  {
    id: 'dnk-marstal',
    name: 'MARSTAL',
    flag: 'DNK',
  },
  {
    id: 'deu-brandenburg',
    name: 'BRANDENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-sassnitz',
    name: 'SASSNITZ',
    flag: 'DEU',
  },
  {
    id: 'hrv-ploce',
    name: 'PLOCE',
    flag: 'HRV',
  },
  {
    id: 'irq-khoralzubair',
    name: 'KHOR AL ZUBAIR',
    flag: 'IRQ',
  },
  {
    id: 'irn-bushehr',
    name: 'BUSHEHR',
    flag: 'IRN',
  },
  {
    id: 'tha-naiharn',
    name: 'NAI HARN',
    flag: 'THA',
  },
  {
    id: 'idn-merakmasterminal',
    name: 'MERAK MAS TERMINAL',
    flag: 'IDN',
  },
  {
    id: 'chn-basuo',
    name: 'BASUO',
    flag: 'CHN',
  },
  {
    id: 'chn-weizhouisland',
    name: 'WEIZHOU ISLAND',
    flag: 'CHN',
  },
  {
    id: 'idn-benoa',
    name: 'BENOA',
    flag: 'IDN',
  },
  {
    id: 'chn-rizhao',
    name: 'RIZHAO',
    flag: 'CHN',
  },
  {
    id: 'phl-batangas',
    name: 'BATANGAS',
    flag: 'PHL',
  },
  {
    id: 'usa-bocaraton',
    name: 'BOCA RATON',
    flag: 'USA',
  },
  {
    id: 'deu-pellworm',
    name: 'PELLWORM',
    flag: 'DEU',
  },
  {
    id: 'qat-alwakrah',
    name: 'AL WAKRAH',
    flag: 'QAT',
  },
  {
    id: 'tha-sriracha',
    name: 'SRIRACHA',
    flag: 'THA',
  },
  {
    id: 'aus-carnarvon',
    name: 'CARNARVON',
    flag: 'AUS',
  },
  {
    id: 'can-baiecomeau',
    name: 'BAIE COMEAU',
    flag: 'CAN',
  },
  {
    id: 'esp-valencia',
    name: 'VALENCIA',
    flag: 'ESP',
  },
  {
    id: 'ita-ustica',
    name: 'USTICA',
    flag: 'ITA',
  },
  {
    id: 'bra-macapabayanchorage',
    name: 'MACAPA BAY ANCHORAGE',
    flag: 'BRA',
  },
  {
    id: 'sau-khafji',
    name: 'KHAFJI',
    flag: 'SAU',
  },
  {
    id: 'ago-daliaangola',
    name: 'DALIA ANGOLA',
    flag: 'AGO',
  },
  {
    id: 'dnk-gormfield',
    name: 'GORM FIELD',
    flag: 'DNK',
  },
  {
    id: 'usa-vicksburg',
    name: 'VICKSBURG',
    flag: 'USA',
  },
  {
    id: 'cmr-tiko',
    name: 'TIKO',
    flag: 'CMR',
  },
  {
    id: 'deu-laboe',
    name: 'LABOE',
    flag: 'DEU',
  },
  {
    id: 'grc-agiosnikolaos',
    name: 'AGIOS NIKOLAOS',
    flag: 'GRC',
  },
  {
    id: 'can-shippegan',
    name: 'SHIPPEGAN',
    flag: 'CAN',
  },
  {
    id: 'grc-nafpaktos',
    name: 'NAFPAKTOS',
    flag: 'GRC',
  },
  {
    id: 'usa-newportanchorage',
    name: 'NEWPORT ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-coyotepoint',
    name: 'COYOTE POINT',
    flag: 'USA',
  },
  {
    id: 'usa-pekin',
    name: 'PEKIN',
    flag: 'USA',
  },
  {
    id: 'usa-sandypoint',
    name: 'SANDY POINT',
    flag: 'USA',
  },
  {
    id: 'prt-porto',
    name: 'PORTO',
    flag: 'PRT',
  },
  {
    id: 'fin-turku',
    name: 'TURKU',
    flag: 'FIN',
  },
  {
    id: 'rus-mokhsogollokh',
    name: 'MOKHSOGOLLOKH',
    flag: 'RUS',
  },
  {
    id: 'are-ummalquwain',
    name: 'UMM AL QUWAIN',
    flag: 'ARE',
  },
  {
    id: 'bhs-hawksbillcay',
    name: 'HAWKSBILL CAY',
    flag: 'BHS',
  },
  {
    id: 'idn-gilimanuk',
    name: 'GILIMANUK',
    flag: 'IDN',
  },
  {
    id: 'esp-campamento',
    name: 'CAMPAMENTO',
    flag: 'ESP',
  },
  {
    id: 'nor-kambo',
    name: 'KAMBO',
    flag: 'NOR',
  },
  {
    id: 'usa-brooklin',
    name: 'BROOKLIN',
    flag: 'USA',
  },
  {
    id: 'swe-ellos',
    name: 'ELLOS',
    flag: 'SWE',
  },
  {
    id: 'jpn-nago',
    name: 'NAGO',
    flag: 'JPN',
  },
  {
    id: 'usa-ketchikan',
    name: 'KETCHIKAN',
    flag: 'USA',
  },
  {
    id: 'usa-capecanaveral',
    name: 'CAPE CANAVERAL',
    flag: 'USA',
  },
  {
    id: 'bhs-roseisland',
    name: 'ROSE ISLAND',
    flag: 'BHS',
  },
  {
    id: 'usa-marcushook',
    name: 'MARCUS HOOK',
    flag: 'USA',
  },
  {
    id: 'usa-montauk',
    name: 'MONTAUK',
    flag: 'USA',
  },
  {
    id: 'usa-newburyport',
    name: 'NEWBURYPORT',
    flag: 'USA',
  },
  {
    id: 'can-clarksharbour',
    name: 'CLARKS HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'esp-huelva',
    name: 'HUELVA',
    flag: 'ESP',
  },
  {
    id: 'esp-ibiza',
    name: 'IBIZA',
    flag: 'ESP',
  },
  {
    id: 'nor-fosnavag',
    name: 'FOSNAVAG',
    flag: 'NOR',
  },
  {
    id: 'mlt-portomaso',
    name: 'PORTOMASO',
    flag: 'MLT',
  },
  {
    id: 'swe-kalmar',
    name: 'KALMAR',
    flag: 'SWE',
  },
  {
    id: 'hrv-split',
    name: 'SPLIT',
    flag: 'HRV',
  },
  {
    id: 'grc-rafina',
    name: 'RAFINA',
    flag: 'GRC',
  },
  {
    id: 'grc-keramoti',
    name: 'KERAMOTI',
    flag: 'GRC',
  },
  {
    id: 'aze-guneshli',
    name: 'GUNESHLI',
    flag: 'AZE',
  },
  {
    id: 'phl-ilihan',
    name: 'ILIHAN',
    flag: 'PHL',
  },
  {
    id: 'twn-shenao',
    name: 'SHEN AO',
    flag: 'TWN',
  },
  {
    id: 'phl-tacloban',
    name: 'TACLOBAN',
    flag: 'PHL',
  },
  {
    id: 'nru-nauru',
    name: 'NAURU',
    flag: 'NRU',
  },
  {
    id: 'esp-ares',
    name: 'ARES',
    flag: 'ESP',
  },
  {
    id: 'esp-guetaria',
    name: 'GUETARIA',
    flag: 'ESP',
  },
  {
    id: 'gbr-immingham',
    name: 'IMMINGHAM',
    flag: 'GBR',
  },
  {
    id: 'tha-krabi',
    name: 'KRABI',
    flag: 'THA',
  },
  {
    id: 'chn-caojing',
    name: 'CAOJING',
    flag: 'CHN',
  },
  {
    id: 'jpn-sakai',
    name: 'SAKAI',
    flag: 'JPN',
  },
  {
    id: 'gbr-hull',
    name: 'HULL',
    flag: 'GBR',
  },
  {
    id: 'nld-lith',
    name: 'LITH',
    flag: 'NLD',
  },
  {
    id: 'srb-pancevo',
    name: 'PANCEVO',
    flag: 'SRB',
  },
  {
    id: 'tur-demircikoy',
    name: 'DEMIRCIKOY',
    flag: 'TUR',
  },
  {
    id: 'rus-konstantinovsk',
    name: 'KONSTANTINOVSK',
    flag: 'RUS',
  },
  {
    id: 'aus-portalma',
    name: 'PORT ALMA',
    flag: 'AUS',
  },
  {
    id: 'ita-marinadicarrara',
    name: 'MARINA DI CARRARA',
    flag: 'ITA',
  },
  {
    id: 'shn-jamestown',
    name: 'JAMESTOWN',
    flag: 'SHN',
  },
  {
    id: 'nor-norheimsund',
    name: 'NORHEIMSUND',
    flag: 'NOR',
  },
  {
    id: 'ita-ciromarina',
    name: 'CIRO MARINA',
    flag: 'ITA',
  },
  {
    id: 'swe-fiskeback',
    name: 'FISKEBACK',
    flag: 'SWE',
  },
  {
    id: 'nld-roermond',
    name: 'ROERMOND',
    flag: 'NLD',
  },
  {
    id: 'rus-naryanmar',
    name: 'NARYAN MAR',
    flag: 'RUS',
  },
  {
    id: 'usa-hodgkins',
    name: 'HODGKINS',
    flag: 'USA',
  },
  {
    id: 'can-bayroberts',
    name: 'BAY ROBERTS',
    flag: 'CAN',
  },
  {
    id: 'rus-krasnoyarsk',
    name: 'KRASNOYARSK',
    flag: 'RUS',
  },
  {
    id: 'usa-akutan',
    name: 'AKUTAN',
    flag: 'USA',
  },
  {
    id: 'pan-gamboa',
    name: 'GAMBOA',
    flag: 'PAN',
  },
  {
    id: 'chl-puertomontt',
    name: 'PUERTO MONTT',
    flag: 'CHL',
  },
  {
    id: 'can-labaie(portalfred)',
    name: 'LA BAIE (PORT ALFRED)',
    flag: 'CAN',
  },
  {
    id: 'mrt-nouadhibou',
    name: 'NOUADHIBOU',
    flag: 'MRT',
  },
  {
    id: 'esp-malpica',
    name: 'MALPICA',
    flag: 'ESP',
  },
  {
    id: 'fro-leirvik',
    name: 'LEIRVIK',
    flag: 'FRO',
  },
  {
    id: 'fra-groix',
    name: 'GROIX',
    flag: 'FRA',
  },
  {
    id: "fra-lecapd'agde",
    name: "LE CAP D'AGDE",
    flag: 'FRA',
  },
  {
    id: 'nor-bud',
    name: 'BUD',
    flag: 'NOR',
  },
  {
    id: 'deu-helgoland',
    name: 'HELGOLAND',
    flag: 'DEU',
  },
  {
    id: 'nor-nerdvika',
    name: 'NERDVIKA',
    flag: 'NOR',
  },
  {
    id: 'ala-sottunga',
    name: 'SOTTUNGA',
    flag: 'ALA',
  },
  {
    id: 'grc-ermoupoli',
    name: 'ERMOUPOLI',
    flag: 'GRC',
  },
  {
    id: 'tur-narli',
    name: 'NARLI',
    flag: 'TUR',
  },
  {
    id: 'chn-ezhou',
    name: 'EZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-dongshan',
    name: 'DONGSHAN',
    flag: 'CHN',
  },
  {
    id: 'esp-fisterra',
    name: 'FISTERRA',
    flag: 'ESP',
  },
  {
    id: 'pol-jastarnia',
    name: 'JASTARNIA',
    flag: 'POL',
  },
  {
    id: 'kor-gohyeon',
    name: 'GOHYEON',
    flag: 'KOR',
  },
  {
    id: 'usa-avalon',
    name: 'AVALON',
    flag: 'USA',
  },
  {
    id: 'grc-gavrio',
    name: 'GAVRIO',
    flag: 'GRC',
  },
  {
    id: 'phl-limay',
    name: 'LIMAY',
    flag: 'PHL',
  },
  {
    id: 'jpn-hikari',
    name: 'HIKARI',
    flag: 'JPN',
  },
  {
    id: 'rus-semikarakorsk',
    name: 'SEMIKARAKORSK',
    flag: 'RUS',
  },
  {
    id: 'col-tumacoanchorage',
    name: 'TUMACO ANCHORAGE',
    flag: 'COL',
  },
  {
    id: 'nld-veghel',
    name: 'VEGHEL',
    flag: 'NLD',
  },
  {
    id: 'deu-freiburg',
    name: 'FREIBURG',
    flag: 'DEU',
  },
  {
    id: 'usa-rubyisland',
    name: 'RUBY ISLAND',
    flag: 'USA',
  },
  {
    id: 'can-ladysmith',
    name: 'LADYSMITH',
    flag: 'CAN',
  },
  {
    id: 'usa-jeanlafitte',
    name: 'JEAN LAFITTE',
    flag: 'USA',
  },
  {
    id: 'usa-fortpierce',
    name: 'FORT PIERCE',
    flag: 'USA',
  },
  {
    id: 'gbr-shoreham',
    name: 'SHOREHAM',
    flag: 'GBR',
  },
  {
    id: 'fra-conflans',
    name: 'CONFLANS',
    flag: 'FRA',
  },
  {
    id: 'nor-skudeneshavn',
    name: 'SKUDENESHAVN',
    flag: 'NOR',
  },
  {
    id: 'nld-urk',
    name: 'URK',
    flag: 'NLD',
  },
  {
    id: 'dnk-ebeltoft',
    name: 'EBELTOFT',
    flag: 'DNK',
  },
  {
    id: 'nor-utgard',
    name: 'UTGARD',
    flag: 'NOR',
  },
  {
    id: 'ita-portogaribaldi',
    name: 'PORTO GARIBALDI',
    flag: 'ITA',
  },
  {
    id: 'swe-grisslehamn',
    name: 'GRISSLEHAMN',
    flag: 'SWE',
  },
  {
    id: 'kwt-kuwaitcity',
    name: 'KUWAIT CITY',
    flag: 'KWT',
  },
  {
    id: 'twn-keelung',
    name: 'KEELUNG',
    flag: 'TWN',
  },
  {
    id: 'jpn-itoman',
    name: 'ITOMAN',
    flag: 'JPN',
  },
  {
    id: 'jpn-itoigawa',
    name: 'ITOIGAWA',
    flag: 'JPN',
  },
  {
    id: 'can-gorgehabour',
    name: 'GORGE HABOUR',
    flag: 'CAN',
  },
  {
    id: 'hnd-puertocortes',
    name: 'PUERTO CORTES',
    flag: 'HND',
  },
  {
    id: 'ita-sanremo',
    name: 'SANREMO',
    flag: 'ITA',
  },
  {
    id: 'ita-ortona',
    name: 'ORTONA',
    flag: 'ITA',
  },
  {
    id: 'ita-catania',
    name: 'CATANIA',
    flag: 'ITA',
  },
  {
    id: 'alb-sarande',
    name: 'SARANDE',
    flag: 'ALB',
  },
  {
    id: 'fin-kokkola',
    name: 'KOKKOLA',
    flag: 'FIN',
  },
  {
    id: 'jpn-makurazaki',
    name: 'MAKURAZAKI',
    flag: 'JPN',
  },
  {
    id: 'ven-puntacardon',
    name: 'PUNTA CARDON',
    flag: 'VEN',
  },
  {
    id: 'are-musaffahanchorage',
    name: 'MUSAFFAH ANCHORAGE',
    flag: 'ARE',
  },
  {
    id: 'usa-milwaukee',
    name: 'MILWAUKEE',
    flag: 'USA',
  },
  {
    id: 'pri-ponce',
    name: 'PONCE',
    flag: 'PRI',
  },
  {
    id: 'rus-podtyosovo',
    name: 'PODTYOSOVO',
    flag: 'RUS',
  },
  {
    id: 'usa-nome',
    name: 'NOME',
    flag: 'USA',
  },
  {
    id: 'tls-dili',
    name: 'DILI',
    flag: 'TLS',
  },
  {
    id: 'jpn-omaezaki',
    name: 'OMAEZAKI',
    flag: 'JPN',
  },
  {
    id: 'usa-oakpark',
    name: 'OAK PARK',
    flag: 'USA',
  },
  {
    id: 'prt-faro',
    name: 'FARO',
    flag: 'PRT',
  },
  {
    id: 'jpn-onoda',
    name: 'ONODA',
    flag: 'JPN',
  },
  {
    id: 'gbr-newholland',
    name: 'NEW HOLLAND',
    flag: 'GBR',
  },
  {
    id: 'nor-olen',
    name: 'OLEN',
    flag: 'NOR',
  },
  {
    id: 'jpn-kinuura',
    name: 'KINUURA',
    flag: 'JPN',
  },
  {
    id: 'deu-bottrop',
    name: 'BOTTROP',
    flag: 'DEU',
  },
  {
    id: 'phl-minlagas',
    name: 'MINLAGAS',
    flag: 'PHL',
  },
  {
    id: 'nor-ormenlange',
    name: 'ORMEN LANGE',
    flag: 'NOR',
  },
  {
    id: 'nld-veendam',
    name: 'VEENDAM',
    flag: 'NLD',
  },
  {
    id: 'aus-cygnet',
    name: 'CYGNET',
    flag: 'AUS',
  },
  {
    id: 'esp-fene',
    name: 'FENE',
    flag: 'ESP',
  },
  {
    id: 'nor-lauvsnes',
    name: 'LAUVSNES',
    flag: 'NOR',
  },
  {
    id: 'bel-tubize',
    name: 'TUBIZE',
    flag: 'BEL',
  },
  {
    id: 'usa-clearlakeshores',
    name: 'CLEAR LAKE SHORES',
    flag: 'USA',
  },
  {
    id: 'ecu-puertoayora',
    name: 'PUERTO AYORA',
    flag: 'ECU',
  },
  {
    id: 'usa-destin',
    name: 'DESTIN',
    flag: 'USA',
  },
  {
    id: 'usa-cocoavillage',
    name: 'COCOA VILLAGE',
    flag: 'USA',
  },
  {
    id: 'can-halifax',
    name: 'HALIFAX',
    flag: 'CAN',
  },
  {
    id: 'esp-playadesantiago',
    name: 'PLAYA DE SANTIAGO',
    flag: 'ESP',
  },
  {
    id: 'nor-alesund',
    name: 'ALESUND',
    flag: 'NOR',
  },
  {
    id: 'deu-olpenitz',
    name: 'OLPENITZ',
    flag: 'DEU',
  },
  {
    id: 'nor-borsa',
    name: 'BORSA',
    flag: 'NOR',
  },
  {
    id: 'deu-wusterwitz',
    name: 'WUSTERWITZ',
    flag: 'DEU',
  },
  {
    id: 'mlt-valletta',
    name: 'VALLETTA',
    flag: 'MLT',
  },
  {
    id: 'grc-patra',
    name: 'PATRA',
    flag: 'GRC',
  },
  {
    id: 'chn-nansha',
    name: 'NANSHA',
    flag: 'CHN',
  },
  {
    id: 'idn-balikpapan',
    name: 'BALIKPAPAN',
    flag: 'IDN',
  },
  {
    id: 'chn-beilong',
    name: 'BEILONG',
    flag: 'CHN',
  },
  {
    id: 'chn-lushan',
    name: 'LUSHAN',
    flag: 'CHN',
  },
  {
    id: 'usa-blaine',
    name: 'BLAINE',
    flag: 'USA',
  },
  {
    id: 'ita-salerno',
    name: 'SALERNO',
    flag: 'ITA',
  },
  {
    id: 'deu-nordhafenhannover',
    name: 'NORDHAFEN HANNOVER',
    flag: 'DEU',
  },
  {
    id: 'nor-hamnvik',
    name: 'HAMNVIK',
    flag: 'NOR',
  },
  {
    id: 'grc-astakos',
    name: 'ASTAKOS',
    flag: 'GRC',
  },
  {
    id: 'bgr-svetivlas',
    name: 'SVETI VLAS',
    flag: 'BGR',
  },
  {
    id: 'ita-marinachiaiolella',
    name: 'MARINA CHIAIOLELLA',
    flag: 'ITA',
  },
  {
    id: 'gbr-saintsampson',
    name: 'SAINT SAMPSON',
    flag: 'GBR',
  },
  {
    id: 'usa-haydenisland',
    name: 'HAYDEN ISLAND',
    flag: 'USA',
  },
  {
    id: 'rus-nizhniybestyakh',
    name: 'NIZHNIY BESTYAKH',
    flag: 'RUS',
  },
  {
    id: 'gbr-portchester',
    name: 'PORTCHESTER',
    flag: 'GBR',
  },
  {
    id: 'fra-tregastel',
    name: 'TREGASTEL',
    flag: 'FRA',
  },
  {
    id: 'guy-linden',
    name: 'LINDEN',
    flag: 'GUY',
  },
  {
    id: 'ita-portorotondo',
    name: 'PORTO ROTONDO',
    flag: 'ITA',
  },
  {
    id: 'can-dalhousie',
    name: 'DALHOUSIE',
    flag: 'CAN',
  },
  {
    id: 'grc-drepano',
    name: 'DREPANO',
    flag: 'GRC',
  },
  {
    id: 'deu-stahnsdorf',
    name: 'STAHNSDORF',
    flag: 'DEU',
  },
]

export default ports
