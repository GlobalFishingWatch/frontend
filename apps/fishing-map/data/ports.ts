const ports = [
  {
    id: 'srb-staribanovci',
    name: 'STARI BANOVCI',
    flag: 'SRB',
  },
  {
    id: 'prk-wonsan',
    name: 'WONSAN',
    flag: 'PRK',
  },
  {
    id: 'tkm-hazar',
    name: 'HAZAR',
    flag: 'TKM',
  },
  {
    id: "grd-saintgeorge's",
    name: "SAINT GEORGE'S",
    flag: 'GRD',
  },
  {
    id: 'aze-baku',
    name: 'BAKU',
    flag: 'AZE',
  },
  {
    id: 'dza-annaba',
    name: 'ANNABA',
    flag: 'DZA',
  },
  {
    id: 'twn-keelungcity',
    name: 'KEELUNG CITY',
    flag: 'TWN',
  },
  {
    id: 'hun-almasfuzito',
    name: 'ALMASFUZITO',
    flag: 'HUN',
  },
  {
    id: 'zaf-durban',
    name: 'DURBAN',
    flag: 'ZAF',
  },
  {
    id: "gab-m'byaoilterminal",
    name: "M'BYA OIL TERMINAL",
    flag: 'GAB',
  },
  {
    id: 'per-supe',
    name: 'SUPE',
    flag: 'PER',
  },
  {
    id: 'tto-portofspain',
    name: 'PORT OF SPAIN',
    flag: 'TTO',
  },
  {
    id: 'rou-giurgiu',
    name: 'GIURGIU',
    flag: 'ROU',
  },
  {
    id: 'egy-rasshukhier',
    name: 'RAS SHUKHIER',
    flag: 'EGY',
  },
  {
    id: 'tha-maptaphut',
    name: 'MAP TA PHUT',
    flag: 'THA',
  },
  {
    id: 'bgr-ezerovo',
    name: 'EZEROVO',
    flag: 'BGR',
  },
  {
    id: 'ecu-genovesa',
    name: 'GENOVESA',
    flag: 'ECU',
  },
  {
    id: 'fro-vagur',
    name: 'VAGUR',
    flag: 'FRO',
  },
  {
    id: 'prk-nampo',
    name: 'NAMPO',
    flag: 'PRK',
  },
  {
    id: 'vnm-danang',
    name: 'DA NANG',
    flag: 'VNM',
  },
  {
    id: 'isl-eskifjordhur',
    name: 'ESKIFJORDHUR',
    flag: 'ISL',
  },
  {
    id: 'srb-novisad',
    name: 'NOVI SAD',
    flag: 'SRB',
  },
  {
    id: 'pry-pilar',
    name: 'PILAR',
    flag: 'PRY',
  },
  {
    id: 'dom-santodomingo',
    name: 'SANTO DOMINGO',
    flag: 'DOM',
  },
  {
    id: 'hti-carrefour',
    name: 'CARREFOUR',
    flag: 'HTI',
  },
  {
    id: 'tha-laemchabang',
    name: 'LAEM CHABANG',
    flag: 'THA',
  },
  {
    id: 'prt-estoril',
    name: 'ESTORIL',
    flag: 'PRT',
  },
  {
    id: 'ago-portoamboim',
    name: 'PORTO AMBOIM',
    flag: 'AGO',
  },
  {
    id: 'dza-portmethanier',
    name: 'PORT METHANIER',
    flag: 'DZA',
  },
  {
    id: 'bhs-bhs-18',
    name: 'BHS-18',
    flag: 'BHS',
  },
  {
    id: 'png-wewakharbor',
    name: 'WEWAK HARBOR',
    flag: 'PNG',
  },
  {
    id: 'pan-portobelo',
    name: 'PORTOBELO',
    flag: 'PAN',
  },
  {
    id: 'gha-lome',
    name: 'LOME',
    flag: 'GHA',
  },
  {
    id: 'fji-suva',
    name: 'SUVA',
    flag: 'FJI',
  },
  {
    id: 'isl-budir',
    name: 'BUDIR',
    flag: 'ISL',
  },
  {
    id: 'per-lapampillaoilterminal',
    name: 'LA PAMPILLA OIL TERMINAL',
    flag: 'PER',
  },
  {
    id: 'ago-portodoambriz',
    name: 'PORTO DO AMBRIZ',
    flag: 'AGO',
  },
  {
    id: 'twn-hua-lienkang',
    name: 'HUA-LIEN KANG',
    flag: 'TWN',
  },
  {
    id: 'lva-bolderaja',
    name: 'BOLDERAJA',
    flag: 'LVA',
  },
  {
    id: 'png-lae',
    name: 'LAE',
    flag: 'PNG',
  },
  {
    id: 'chl-chl-4',
    name: 'CHL-4',
    flag: 'CHL',
  },
  {
    id: 'ven-tiajuana',
    name: 'TIA JUANA',
    flag: 'VEN',
  },
  {
    id: 'isl-bildudalur',
    name: 'BILDUDALUR',
    flag: 'ISL',
  },
  {
    id: 'tha-rayongtpiterminal',
    name: 'RAYONG TPI TERMINAL',
    flag: 'THA',
  },
  {
    id: 'irn-bandar-emahshahr',
    name: 'BANDAR-E MAHSHAHR',
    flag: 'IRN',
  },
  {
    id: 'aut-weissenkircheninderwachau',
    name: 'WEISSENKIRCHEN IN DER WACHAU',
    flag: 'AUT',
  },
  {
    id: 'zaf-richardsbay',
    name: 'RICHARDS BAY',
    flag: 'ZAF',
  },
  {
    id: 'lby-zawia',
    name: 'ZAWIA',
    flag: 'LBY',
  },
  {
    id: 'pan-panamacanalanchorage',
    name: 'PANAMA CANAL ANCHORAGE',
    flag: 'PAN',
  },
  {
    id: 'bhs-elbowcay',
    name: 'ELBOW CAY',
    flag: 'BHS',
  },
  {
    id: 'tha-bangkok',
    name: 'BANGKOK',
    flag: 'THA',
  },
  {
    id: 'bhs-bhs-10',
    name: 'BHS-10',
    flag: 'BHS',
  },
  {
    id: 'ecu-lalibertad',
    name: 'LA LIBERTAD',
    flag: 'ECU',
  },
  {
    id: 'are-mubarrazisland',
    name: 'MUBARRAZ ISLAND',
    flag: 'ARE',
  },
  {
    id: 'pri-centralaguirre',
    name: 'CENTRAL AGUIRRE',
    flag: 'PRI',
  },
  {
    id: 'hnd-tela',
    name: 'TELA',
    flag: 'HND',
  },
  {
    id: 'rou-braila',
    name: 'BRAILA',
    flag: 'ROU',
  },
  {
    id: 'irn-khorramshahr',
    name: 'KHORRAMSHAHR',
    flag: 'IRN',
  },
  {
    id: 'tls-dili',
    name: 'DILI',
    flag: 'TLS',
  },
  {
    id: 'egy-elturharbor',
    name: 'EL TUR HARBOR',
    flag: 'EGY',
  },
  {
    id: 'bhs-blackpoint',
    name: 'BLACK POINT',
    flag: 'BHS',
  },
  {
    id: 'col-col-20',
    name: 'COL-20',
    flag: 'COL',
  },
  {
    id: 'bgr-kavarnaanchorage',
    name: 'KAVARNA ANCHORAGE',
    flag: 'BGR',
  },
  {
    id: 'sdn-beshayeroilterminal',
    name: 'BESHAYER OIL TERMINAL',
    flag: 'SDN',
  },
  {
    id: 'bhs-bhs-14',
    name: 'BHS-14',
    flag: 'BHS',
  },
  {
    id: 'mdv-male',
    name: 'MALE',
    flag: 'MDV',
  },
  {
    id: 'slb-ringgicove',
    name: 'RINGGI COVE',
    flag: 'SLB',
  },
  {
    id: 'are-are-97',
    name: 'ARE-97',
    flag: 'ARE',
  },
  {
    id: 'tun-zarzis',
    name: 'ZARZIS',
    flag: 'TUN',
  },
  {
    id: 'ecu-puertoayora',
    name: 'PUERTO AYORA',
    flag: 'ECU',
  },
  {
    id: 'aze-aze-30',
    name: 'AZE-30',
    flag: 'AZE',
  },
  {
    id: 'geo-maltakva',
    name: 'MALTAKVA',
    flag: 'GEO',
  },
  {
    id: 'dza-skikda',
    name: 'SKIKDA',
    flag: 'DZA',
  },
  {
    id: 'vnm-catba',
    name: 'CAT BA',
    flag: 'VNM',
  },
  {
    id: 'lva-daugavgriva',
    name: 'DAUGAVGRIVA',
    flag: 'LVA',
  },
  {
    id: 'vnm-phumy',
    name: 'PHU MY',
    flag: 'VNM',
  },
  {
    id: 'prt-pontadelgada',
    name: 'PONTA DELGADA',
    flag: 'PRT',
  },
  {
    id: 'hun-vac',
    name: 'VAC',
    flag: 'HUN',
  },
  {
    id: 'omn-minaalfahl',
    name: 'MINA AL FAHL',
    flag: 'OMN',
  },
  {
    id: 'col-col-40',
    name: 'COL-40',
    flag: 'COL',
  },
  {
    id: 'ltu-butingeoilterminal',
    name: 'BUTINGE OIL TERMINAL',
    flag: 'LTU',
  },
  {
    id: 'aze-aze-7',
    name: 'AZE-7',
    flag: 'AZE',
  },
  {
    id: 'vct-portelizabeth',
    name: 'PORT ELIZABETH',
    flag: 'VCT',
  },
  {
    id: 'irn-bushehr',
    name: 'BUSHEHR',
    flag: 'IRN',
  },
  {
    id: 'moz-nacala',
    name: 'NACALA',
    flag: 'MOZ',
  },
  {
    id: 'per-casma',
    name: 'CASMA',
    flag: 'PER',
  },
  {
    id: 'glp-pointeapitre',
    name: 'POINTE A PITRE',
    flag: 'GLP',
  },
  {
    id: 'aut-schwechat',
    name: 'SCHWECHAT',
    flag: 'AUT',
  },
  {
    id: 'imn-portsaintmary',
    name: 'PORT SAINT MARY',
    flag: 'IMN',
  },
  {
    id: 'mar-tangermed',
    name: 'TANGER MED',
    flag: 'MAR',
  },
  {
    id: 'irn-koohmobarak',
    name: 'KOOH MOBARAK',
    flag: 'IRN',
  },
  {
    id: 'irn-chabahar',
    name: 'CHABAHAR',
    flag: 'IRN',
  },
  {
    id: 'egy-egy-78',
    name: 'EGY-78',
    flag: 'EGY',
  },
  {
    id: 'jam-kingston',
    name: 'KINGSTON',
    flag: 'JAM',
  },
  {
    id: 'isr-qiryatyam',
    name: 'QIRYAT YAM',
    flag: 'ISR',
  },
  {
    id: 'ncl-baieugue',
    name: 'BAIE UGUE',
    flag: 'NCL',
  },
  {
    id: 'cuw-bullenbaairefinery',
    name: 'BULLENBAAI REFINERY',
    flag: 'CUW',
  },
  {
    id: 'rou-poartaalba',
    name: 'POARTA ALBA',
    flag: 'ROU',
  },
  {
    id: 'are-are-146',
    name: 'ARE-146',
    flag: 'ARE',
  },
  {
    id: 'cog-kalamu',
    name: 'KALAMU',
    flag: 'COG',
  },
  {
    id: 'dom-dom-16',
    name: 'DOM-16',
    flag: 'DOM',
  },
  {
    id: 'bhs-greenturtlecay',
    name: 'GREEN TURTLE CAY',
    flag: 'BHS',
  },
  {
    id: 'png-bialla',
    name: 'BIALLA',
    flag: 'PNG',
  },
  {
    id: 'gum-apraharbor',
    name: 'APRA HARBOR',
    flag: 'GUM',
  },
  {
    id: 'svk-bratislava',
    name: 'BRATISLAVA',
    flag: 'SVK',
  },
  {
    id: 'tun-gabes',
    name: 'GABES',
    flag: 'TUN',
  },
  {
    id: 'mlt-mallieha',
    name: 'MALLIEHA',
    flag: 'MLT',
  },
  {
    id: 'egy-suezcanal',
    name: 'SUEZ CANAL',
    flag: 'EGY',
  },
  {
    id: 'hun-nagymaros',
    name: 'NAGYMAROS',
    flag: 'HUN',
  },
  {
    id: 'hun-dunafoldvar',
    name: 'DUNAFOLDVAR',
    flag: 'HUN',
  },
  {
    id: 'arg-zarate',
    name: 'ZARATE',
    flag: 'ARG',
  },
  {
    id: 'cod-matadi',
    name: 'MATADI',
    flag: 'COD',
  },
  {
    id: 'tha-phuket',
    name: 'PHUKET',
    flag: 'THA',
  },
  {
    id: 'bhs-harveyscay',
    name: 'HARVEYS CAY',
    flag: 'BHS',
  },
  {
    id: 'lbn-sidon',
    name: 'SIDON',
    flag: 'LBN',
  },
  {
    id: 'egy-alexandria',
    name: 'ALEXANDRIA',
    flag: 'EGY',
  },
  {
    id: 'pol-ustka',
    name: 'USTKA',
    flag: 'POL',
  },
  {
    id: 'irl-rosslare',
    name: 'ROSSLARE',
    flag: 'IRL',
  },
  {
    id: 'hti-gonayiv',
    name: 'GONAYIV',
    flag: 'HTI',
  },
  {
    id: 'ata-fildesbay',
    name: 'FILDES BAY',
    flag: 'ATA',
  },
  {
    id: 'ven-joseterminal',
    name: 'JOSE TERMINAL',
    flag: 'VEN',
  },
  {
    id: 'bgr-novoselo',
    name: 'NOVO SELO',
    flag: 'BGR',
  },
  {
    id: 'aze-absheronanchorage',
    name: 'ABSHERON ANCHORAGE',
    flag: 'AZE',
  },
  {
    id: 'chl-puertomontt',
    name: 'PUERTO MONTT',
    flag: 'CHL',
  },
  {
    id: 'ven-puertolacruz',
    name: 'PUERTO LA CRUZ',
    flag: 'VEN',
  },
  {
    id: 'aut-waldkirchenamwesen',
    name: 'WALDKIRCHEN AM WESEN',
    flag: 'AUT',
  },
  {
    id: 'arg-avellaneda',
    name: 'AVELLANEDA',
    flag: 'ARG',
  },
  {
    id: 'eri-eri-3',
    name: 'ERI-3',
    flag: 'ERI',
  },
  {
    id: 'are-ummalqaywayn',
    name: 'UMM AL QAYWAYN',
    flag: 'ARE',
  },
  {
    id: 'are-rashidfield',
    name: 'RASHID FIELD',
    flag: 'ARE',
  },
  {
    id: 'pry-villahayes',
    name: 'VILLA HAYES',
    flag: 'PRY',
  },
  {
    id: 'prt-praia',
    name: 'PRAIA',
    flag: 'PRT',
  },
  {
    id: 'fro-skala',
    name: 'SKALA',
    flag: 'FRO',
  },
  {
    id: 'are-are-105',
    name: 'ARE-105',
    flag: 'ARE',
  },
  {
    id: 'prt-vilarealdesantonio',
    name: 'VILA REAL DE S ANTONIO',
    flag: 'PRT',
  },
  {
    id: 'rou-pristol',
    name: 'PRISTOL',
    flag: 'ROU',
  },
  {
    id: 'est-tallinn',
    name: 'TALLINN',
    flag: 'EST',
  },
  {
    id: 'mar-rabat',
    name: 'RABAT',
    flag: 'MAR',
  },
  {
    id: 'chl-calbuco',
    name: 'CALBUCO',
    flag: 'CHL',
  },
  {
    id: 'per-paita',
    name: 'PAITA',
    flag: 'PER',
  },
  {
    id: 'chl-puertochincui',
    name: 'PUERTO CHINCUI',
    flag: 'CHL',
  },
  {
    id: 'are-alrafiq',
    name: 'AL RAFIQ',
    flag: 'ARE',
  },
  {
    id: 'prt-amora',
    name: 'AMORA',
    flag: 'PRT',
  },
  {
    id: 'dza-arzeweldjedid',
    name: 'ARZEW EL DJEDID',
    flag: 'DZA',
  },
  {
    id: 'aut-melk',
    name: 'MELK',
    flag: 'AUT',
  },
  {
    id: 'dom-puertoplata',
    name: 'PUERTO PLATA',
    flag: 'DOM',
  },
  {
    id: 'ury-colonia',
    name: 'COLONIA',
    flag: 'URY',
  },
  {
    id: 'are-ajman',
    name: 'AJMAN',
    flag: 'ARE',
  },
  {
    id: 'cod-cod-6',
    name: 'COD-6',
    flag: 'COD',
  },
  {
    id: 'col-col-45',
    name: 'COL-45',
    flag: 'COL',
  },
  {
    id: 'irn-bandar-eanzali',
    name: 'BANDAR-E ANZALI',
    flag: 'IRN',
  },
  {
    id: 'dza-oran',
    name: 'ORAN',
    flag: 'DZA',
  },
  {
    id: 'bhs-highbornecay',
    name: 'HIGHBORNE CAY',
    flag: 'BHS',
  },
  {
    id: 'slv-acajutla',
    name: 'ACAJUTLA',
    flag: 'SLV',
  },
  {
    id: 'pak-muhamamadbinqasim',
    name: 'MUHAMAMAD BIN QASIM',
    flag: 'PAK',
  },
  {
    id: 'egy-suezport',
    name: 'SUEZ PORT',
    flag: 'EGY',
  },
  {
    id: 'grl-tasiilaq',
    name: 'TASIILAQ',
    flag: 'GRL',
  },
  {
    id: 'per-chancay',
    name: 'CHANCAY',
    flag: 'PER',
  },
  {
    id: 'ven-palua',
    name: 'PALUA',
    flag: 'VEN',
  },
  {
    id: 'rou-ovidiu',
    name: 'OVIDIU',
    flag: 'ROU',
  },
  {
    id: 'yem-salif',
    name: 'SALIF',
    flag: 'YEM',
  },
  {
    id: "prk-kimch'aek",
    name: "KIMCH'AEK",
    flag: 'PRK',
  },
  {
    id: 'per-paramonga',
    name: 'PARAMONGA',
    flag: 'PER',
  },
  {
    id: 'alb-durres',
    name: 'DURRES',
    flag: 'ALB',
  },
  {
    id: 'hun-paks',
    name: 'PAKS',
    flag: 'HUN',
  },
  {
    id: 'isr-elat',
    name: 'ELAT',
    flag: 'ISR',
  },
  {
    id: 'ven-laguaira',
    name: 'LA GUAIRA',
    flag: 'VEN',
  },
  {
    id: 'cod-cod-4',
    name: 'COD-4',
    flag: 'COD',
  },
  {
    id: 'twn-penghu',
    name: 'PENGHU',
    flag: 'TWN',
  },
  {
    id: 'arg-comodororivadavia',
    name: 'COMODORO RIVADAVIA',
    flag: 'ARG',
  },
  {
    id: 'aut-kirchbergobderdonau',
    name: 'KIRCHBERG OB DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'chl-chl-36',
    name: 'CHL-36',
    flag: 'CHL',
  },
  {
    id: 'sjm-longyearbyen',
    name: 'LONGYEARBYEN',
    flag: 'SJM',
  },
  {
    id: 'ecu-ecu-31',
    name: 'ECU-31',
    flag: 'ECU',
  },
  {
    id: "irq-nahiyat'atbah",
    name: "NAHIYAT 'ATBAH",
    flag: 'IRQ',
  },
  {
    id: 'bhr-bhr-12',
    name: 'BHR-12',
    flag: 'BHR',
  },
  {
    id: 'chl-chl-106',
    name: 'CHL-106',
    flag: 'CHL',
  },
  {
    id: 'irn-abumusa',
    name: 'ABU MUSA',
    flag: 'IRN',
  },
  {
    id: 'bgr-burgas',
    name: 'BURGAS',
    flag: 'BGR',
  },
  {
    id: 'rou-drobeta-turnuseverin',
    name: 'DROBETA-TURNU SEVERIN',
    flag: 'ROU',
  },
  {
    id: 'nga-seaeagleterminal',
    name: 'SEA EAGLE TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'hun-tat',
    name: 'TAT',
    flag: 'HUN',
  },
  {
    id: 'irn-bandar-eshahidreajie',
    name: 'BANDAR-E SHAHID REAJIE',
    flag: 'IRN',
  },
  {
    id: 'tto-ansetembladora',
    name: 'ANSE TEMBLADORA',
    flag: 'TTO',
  },
  {
    id: 'cub-puertopadre',
    name: 'PUERTO PADRE',
    flag: 'CUB',
  },
  {
    id: 'cyp-limassol',
    name: 'LIMASSOL',
    flag: 'CYP',
  },
  {
    id: 'msr-brades',
    name: 'BRADES',
    flag: 'MSR',
  },
  {
    id: 'cpv-saofilipe',
    name: 'SAO FILIPE',
    flag: 'CPV',
  },
  {
    id: 'egy-wadifeiran',
    name: 'WADI FEIRAN',
    flag: 'EGY',
  },
  {
    id: 'bhs-lucaya',
    name: 'LUCAYA',
    flag: 'BHS',
  },
  {
    id: 'are-yasmarina',
    name: 'YAS MARINA',
    flag: 'ARE',
  },
  {
    id: 'twn-jincheng',
    name: 'JINCHENG',
    flag: 'TWN',
  },
  {
    id: 'vut-vut-6',
    name: 'VUT-6',
    flag: 'VUT',
  },
  {
    id: 'pan-sambabonita',
    name: 'SAMBA BONITA',
    flag: 'PAN',
  },
  {
    id: 'cri-limon',
    name: 'LIMON',
    flag: 'CRI',
  },
  {
    id: 'tun-tunis',
    name: 'TUNIS',
    flag: 'TUN',
  },
  {
    id: 'bgr-bgr-22',
    name: 'BGR-22',
    flag: 'BGR',
  },
  {
    id: 'reu-portest',
    name: 'PORT EST',
    flag: 'REU',
  },
  {
    id: 'aut-feldkirchenanderdonau',
    name: 'FELDKIRCHEN AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'alb-shengjin',
    name: 'SHENGJIN',
    flag: 'ALB',
  },
  {
    id: 'dom-aties',
    name: 'ATIES',
    flag: 'DOM',
  },
  {
    id: 'per-lacruz',
    name: 'LA CRUZ',
    flag: 'PER',
  },
  {
    id: 'aze-guneshli',
    name: 'GUNESHLI',
    flag: 'AZE',
  },
  {
    id: 'ago-tombua',
    name: 'TOMBUA',
    flag: 'AGO',
  },
  {
    id: 'sen-kaolack',
    name: 'KAOLACK',
    flag: 'SEN',
  },
  {
    id: 'twn-twn-1',
    name: 'TWN-1',
    flag: 'TWN',
  },
  {
    id: 'qat-qat-22',
    name: 'QAT-22',
    flag: 'QAT',
  },
  {
    id: 'dom-dom-29',
    name: 'DOM-29',
    flag: 'DOM',
  },
  {
    id: 'are-mugharragport',
    name: 'MUGHARRAG PORT',
    flag: 'ARE',
  },
  {
    id: 'qat-raslaffan',
    name: 'RAS LAFFAN',
    flag: 'QAT',
  },
  {
    id: 'mlt-imgarr',
    name: 'IMGARR',
    flag: 'MLT',
  },
  {
    id: 'per-sannicolas',
    name: 'SAN NICOLAS',
    flag: 'PER',
  },
  {
    id: 'irl-valentia',
    name: 'VALENTIA',
    flag: 'IRL',
  },
  {
    id: 'kwt-minaazzawr',
    name: 'MINA AZ ZAWR',
    flag: 'KWT',
  },
  {
    id: 'per-bahiadematarani',
    name: 'BAHIA DE MATARANI',
    flag: 'PER',
  },
  {
    id: 'ury-nuevapalmira',
    name: 'NUEVA PALMIRA',
    flag: 'URY',
  },
  {
    id: 'tha-sattahip',
    name: 'SATTAHIP',
    flag: 'THA',
  },
  {
    id: 'bgr-lom',
    name: 'LOM',
    flag: 'BGR',
  },
  {
    id: 'col-tolu',
    name: 'TOLU',
    flag: 'COL',
  },
  {
    id: 'irn-khark',
    name: 'KHARK',
    flag: 'IRN',
  },
  {
    id: "qat-azza'ayin",
    name: "AZ ZA'AYIN",
    flag: 'QAT',
  },
  {
    id: 'vnm-quinhon',
    name: 'QUI NHON',
    flag: 'VNM',
  },
  {
    id: 'are-salmanfield',
    name: 'SALMAN FIELD',
    flag: 'ARE',
  },
  {
    id: 'cri-puertoherradura',
    name: 'PUERTO HERRADURA',
    flag: 'CRI',
  },
  {
    id: 'irl-dingle',
    name: 'DINGLE',
    flag: 'IRL',
  },
  {
    id: 'ecu-ecu-33',
    name: 'ECU-33',
    flag: 'ECU',
  },
  {
    id: 'mhl-ebaye',
    name: 'EBAYE',
    flag: 'MHL',
  },
  {
    id: 'pyf-baietaiohae',
    name: 'BAIE TAIOHAE',
    flag: 'PYF',
  },
  {
    id: 'per-tierracolorada',
    name: 'TIERRA COLORADA',
    flag: 'PER',
  },
  {
    id: 'tca-cockburnharbor',
    name: 'COCKBURN HARBOR',
    flag: 'TCA',
  },
  {
    id: 'mdg-iharana',
    name: 'IHARANA',
    flag: 'MDG',
  },
  {
    id: 'brb-brb-6',
    name: 'BRB-6',
    flag: 'BRB',
  },
  {
    id: 'ecu-ecu-20',
    name: 'ECU-20',
    flag: 'ECU',
  },
  {
    id: 'srb-pancevo',
    name: 'PANCEVO',
    flag: 'SRB',
  },
  {
    id: 'moz-maputo',
    name: 'MAPUTO',
    flag: 'MOZ',
  },
  {
    id: 'are-mubarrazfield',
    name: 'MUBARRAZ FIELD',
    flag: 'ARE',
  },
  {
    id: 'vct-barrouallie',
    name: 'BARROUALLIE',
    flag: 'VCT',
  },
  {
    id: 'ecu-puertobaquerizomoreno',
    name: 'PUERTO BAQUERIZO MORENO',
    flag: 'ECU',
  },
  {
    id: 'svn-lucija',
    name: 'LUCIJA',
    flag: 'SVN',
  },
  {
    id: 'gab-libreville',
    name: 'LIBREVILLE',
    flag: 'GAB',
  },
  {
    id: 'are-jebeldhanna',
    name: 'JEBEL DHANNA',
    flag: 'ARE',
  },
  {
    id: 'pan-colon',
    name: 'COLON',
    flag: 'PAN',
  },
  {
    id: 'egy-egy-39',
    name: 'EGY-39',
    flag: 'EGY',
  },
  {
    id: 'mus-portmathurin',
    name: 'PORT MATHURIN',
    flag: 'MUS',
  },
  {
    id: 'tha-sriracha',
    name: 'SRIRACHA',
    flag: 'THA',
  },
  {
    id: 'ton-neiafu',
    name: 'NEIAFU',
    flag: 'TON',
  },
  {
    id: 'glp-bouillante',
    name: 'BOUILLANTE',
    flag: 'GLP',
  },
  {
    id: 'ury-recalada',
    name: 'RECALADA',
    flag: 'URY',
  },
  {
    id: 'egy-suezsouthanchorage',
    name: 'SUEZ SOUTH ANCHORAGE',
    flag: 'EGY',
  },
  {
    id: 'arg-sanantonioeste',
    name: 'SAN ANTONIO ESTE',
    flag: 'ARG',
  },
  {
    id: 'ago-matadi',
    name: 'MATADI',
    flag: 'AGO',
  },
  {
    id: 'pri-sanjuan',
    name: 'SAN JUAN',
    flag: 'PRI',
  },
  {
    id: 'bhs-roseisland',
    name: 'ROSE ISLAND',
    flag: 'BHS',
  },
  {
    id: 'bes-kralendijk',
    name: 'KRALENDIJK',
    flag: 'BES',
  },
  {
    id: 'nga-ogidigbe',
    name: 'OGIDIGBE',
    flag: 'NGA',
  },
  {
    id: 'bhs-bhs-4',
    name: 'BHS-4',
    flag: 'BHS',
  },
  {
    id: 'rou-basarabi',
    name: 'BASARABI',
    flag: 'ROU',
  },
  {
    id: 'asm-pagopagoharbor',
    name: 'PAGO PAGO HARBOR',
    flag: 'ASM',
  },
  {
    id: 'kwt-minaalahmadi',
    name: 'MINA AL AHMADI',
    flag: 'KWT',
  },
  {
    id: 'imn-porterin',
    name: 'PORT ERIN',
    flag: 'IMN',
  },
  {
    id: 'aut-ybbsanderdonau',
    name: 'YBBS AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'grl-upernavik',
    name: 'UPERNAVIK',
    flag: 'GRL',
  },
  {
    id: 'qat-alwakrah',
    name: 'AL WAKRAH',
    flag: 'QAT',
  },
  {
    id: 'cod-banana',
    name: 'BANANA',
    flag: 'COD',
  },
  {
    id: 'hun-szazhalombatta',
    name: 'SZAZHALOMBATTA',
    flag: 'HUN',
  },
  {
    id: 'srb-donjimilanovac',
    name: 'DONJI MILANOVAC',
    flag: 'SRB',
  },
  {
    id: 'chl-chl-44',
    name: 'CHL-44',
    flag: 'CHL',
  },
  {
    id: 'twn-penghucounty',
    name: 'PENGHU COUNTY',
    flag: 'TWN',
  },
  {
    id: 'nga-twon-brass',
    name: 'TWON-BRASS',
    flag: 'NGA',
  },
  {
    id: 'chl-puertocaldera',
    name: 'PUERTO CALDERA',
    flag: 'CHL',
  },
  {
    id: 'mdv-hulhumale',
    name: 'HULHUMALE',
    flag: 'MDV',
  },
  {
    id: 'aut-bisamberg',
    name: 'BISAMBERG',
    flag: 'AUT',
  },
  {
    id: 'blz-blz-4',
    name: 'BLZ-4',
    flag: 'BLZ',
  },
  {
    id: 'prt-sagres',
    name: 'SAGRES',
    flag: 'PRT',
  },
  {
    id: 'civ-abidjan',
    name: 'ABIDJAN',
    flag: 'CIV',
  },
  {
    id: 'ecu-puntaarenas',
    name: 'PUNTA ARENAS',
    flag: 'ECU',
  },
  {
    id: 'irn-hengamfield',
    name: 'HENGAM FIELD',
    flag: 'IRN',
  },
  {
    id: 'kwt-dohaharbor',
    name: 'DOHA HARBOR',
    flag: 'KWT',
  },
  {
    id: 'lka-galleharbor',
    name: 'GALLE HARBOR',
    flag: 'LKA',
  },
  {
    id: 'aze-aze-29',
    name: 'AZE-29',
    flag: 'AZE',
  },
  {
    id: 'bgd-chittagong',
    name: 'CHITTAGONG',
    flag: 'BGD',
  },
  {
    id: 'chl-sanjose',
    name: 'SAN JOSE',
    flag: 'CHL',
  },
  {
    id: 'arg-barranqueras',
    name: 'BARRANQUERAS',
    flag: 'ARG',
  },
  {
    id: 'tha-patong',
    name: 'PATONG',
    flag: 'THA',
  },
  {
    id: 'pol-gdynia',
    name: 'GDYNIA',
    flag: 'POL',
  },
  {
    id: 'per-zorritos',
    name: 'ZORRITOS',
    flag: 'PER',
  },
  {
    id: 'are-mubarakfieid',
    name: 'MUBARAK FIEID',
    flag: 'ARE',
  },
  {
    id: 'chl-iquique',
    name: 'IQUIQUE',
    flag: 'CHL',
  },
  {
    id: 'fro-tvoroyri',
    name: 'TVOROYRI',
    flag: 'FRO',
  },
  {
    id: 'vct-petitsaintvincent',
    name: 'PETIT SAINT VINCENT',
    flag: 'VCT',
  },
  {
    id: 'ecu-puertovillamil',
    name: 'PUERTO VILLAMIL',
    flag: 'ECU',
  },
  {
    id: 'gnq-bata',
    name: 'BATA',
    flag: 'GNQ',
  },
  {
    id: 'bhs-bhs-73',
    name: 'BHS-73',
    flag: 'BHS',
  },
  {
    id: 'irl-bantry',
    name: 'BANTRY',
    flag: 'IRL',
  },
  {
    id: 'cri-cri-17',
    name: 'CRI-17',
    flag: 'CRI',
  },
  {
    id: 'cck-cocos',
    name: 'COCOS',
    flag: 'CCK',
  },
  {
    id: 'prt-vianadocastelo',
    name: 'VIANA DO CASTELO',
    flag: 'PRT',
  },
  {
    id: 'egy-maaddiya',
    name: 'MAADDIYA',
    flag: 'EGY',
  },
  {
    id: 'cmr-cmr-4',
    name: 'CMR-4',
    flag: 'CMR',
  },
  {
    id: 'moz-pemba',
    name: 'PEMBA',
    flag: 'MOZ',
  },
  {
    id: 'chl-chonchi',
    name: 'CHONCHI',
    flag: 'CHL',
  },
  {
    id: 'cok-cok-1',
    name: 'COK-1',
    flag: 'COK',
  },
  {
    id: 'hun-harta',
    name: 'HARTA',
    flag: 'HUN',
  },
  {
    id: 'brn-kualabelait',
    name: 'KUALA BELAIT',
    flag: 'BRN',
  },
  {
    id: 'hnd-puertodehencan',
    name: 'PUERTO DE HENCAN',
    flag: 'HND',
  },
  {
    id: 'egy-egy-65',
    name: 'EGY-65',
    flag: 'EGY',
  },
  {
    id: 'aut-sanktaegidi',
    name: 'SANKT AEGIDI',
    flag: 'AUT',
  },
  {
    id: 'cog-pointenoire',
    name: 'POINTE NOIRE',
    flag: 'COG',
  },
  {
    id: 'cub-guayabal',
    name: 'GUAYABAL',
    flag: 'CUB',
  },
  {
    id: 'bhs-crabcay',
    name: 'CRAB CAY',
    flag: 'BHS',
  },
  {
    id: 'kir-englishharbor',
    name: 'ENGLISH HARBOR',
    flag: 'KIR',
  },
  {
    id: 'isr-acre',
    name: 'ACRE',
    flag: 'ISR',
  },
  {
    id: 'bes-gotooilterminal',
    name: 'GOTO OIL TERMINAL',
    flag: 'BES',
  },
  {
    id: 'tto-scarborough',
    name: 'SCARBOROUGH',
    flag: 'TTO',
  },
  {
    id: 'mne-kotor',
    name: 'KOTOR',
    flag: 'MNE',
  },
  {
    id: 'pri-bahiadefajardo',
    name: 'BAHIA DE FAJARDO',
    flag: 'PRI',
  },
  {
    id: 'slv-launion',
    name: 'LA UNION',
    flag: 'SLV',
  },
  {
    id: 'isl-neskaupstadur',
    name: 'NESKAUPSTADUR',
    flag: 'ISL',
  },
  {
    id: 'tgo-lome',
    name: 'LOME',
    flag: 'TGO',
  },
  {
    id: 'cub-santiagodecuba',
    name: 'SANTIAGO DE CUBA',
    flag: 'CUB',
  },
  {
    id: 'ven-ciudadojeda',
    name: 'CIUDAD OJEDA',
    flag: 'VEN',
  },
  {
    id: 'are-ummalquwain',
    name: 'UMM AL QUWAIN',
    flag: 'ARE',
  },
  {
    id: 'ury-puertosauce',
    name: 'PUERTO SAUCE',
    flag: 'URY',
  },
  {
    id: 'vut-vut-10',
    name: 'VUT-10',
    flag: 'VUT',
  },
  {
    id: 'per-per-51',
    name: 'PER-51',
    flag: 'PER',
  },
  {
    id: 'hun-budapestii.kerulet',
    name: 'BUDAPEST II. KERULET',
    flag: 'HUN',
  },
  {
    id: 'pyf-atuona',
    name: 'ATUONA',
    flag: 'PYF',
  },
  {
    id: 'guy-newamsterdam',
    name: 'NEW AMSTERDAM',
    flag: 'GUY',
  },
  {
    id: 'vir-cruzbay',
    name: 'CRUZ BAY',
    flag: 'VIR',
  },
  {
    id: 'syr-alladhiqiyah',
    name: 'AL LADHIQIYAH',
    flag: 'SYR',
  },
  {
    id: 'lva-jaunciems',
    name: 'JAUNCIEMS',
    flag: 'LVA',
  },
  {
    id: 'irl-cork',
    name: 'CORK',
    flag: 'IRL',
  },
  {
    id: 'lca-marigotbay',
    name: 'MARIGOT BAY',
    flag: 'LCA',
  },
  {
    id: 'arg-puertomadryn',
    name: 'PUERTO MADRYN',
    flag: 'ARG',
  },
  {
    id: 'cmr-cmr-21',
    name: 'CMR-21',
    flag: 'CMR',
  },
  {
    id: 'chl-chl-71',
    name: 'CHL-71',
    flag: 'CHL',
  },
  {
    id: 'ago-namibe',
    name: 'NAMIBE',
    flag: 'AGO',
  },
  {
    id: 'ala-krokarna',
    name: 'KROKARNA',
    flag: 'ALA',
  },
  {
    id: 'isl-isl-57',
    name: 'ISL-57',
    flag: 'ISL',
  },
  {
    id: 'vut-isangel',
    name: 'ISANGEL',
    flag: 'VUT',
  },
  {
    id: 'aut-tulln',
    name: 'TULLN',
    flag: 'AUT',
  },
  {
    id: 'zaf-capetown',
    name: 'CAPETOWN',
    flag: 'ZAF',
  },
  {
    id: 'tha-samutsakhon',
    name: 'SAMUT SAKHON',
    flag: 'THA',
  },
  {
    id: 'irn-bandar-eparsterminal',
    name: 'BANDAR-E PARS TERMINAL',
    flag: 'IRN',
  },
  {
    id: 'twn-donggang',
    name: 'DONGGANG',
    flag: 'TWN',
  },
  {
    id: 'ala-sottunga',
    name: 'SOTTUNGA',
    flag: 'ALA',
  },
  {
    id: 'omn-salalah',
    name: 'SALALAH',
    flag: 'OMN',
  },
  {
    id: "sxm-lowerprince'squarter",
    name: "LOWER PRINCE'S QUARTER",
    flag: 'SXM',
  },
  {
    id: 'grl-maniitsoq',
    name: 'MANIITSOQ',
    flag: 'GRL',
  },
  {
    id: 'col-tumaco',
    name: 'TUMACO',
    flag: 'COL',
  },
  {
    id: 'srb-belgrade',
    name: 'BELGRADE',
    flag: 'SRB',
  },
  {
    id: 'geo-batumi',
    name: 'BATUMI',
    flag: 'GEO',
  },
  {
    id: 'aut-scharndorf',
    name: 'SCHARNDORF',
    flag: 'AUT',
  },
  {
    id: 'chl-tenaun',
    name: 'TENAUN',
    flag: 'CHL',
  },
  {
    id: 'ven-puertocumarebo',
    name: 'PUERTO CUMAREBO',
    flag: 'VEN',
  },
  {
    id: 'bgr-silistra',
    name: 'SILISTRA',
    flag: 'BGR',
  },
  {
    id: 'svk-komarno',
    name: 'KOMARNO',
    flag: 'SVK',
  },
  {
    id: 'fro-torshavn',
    name: 'TORSHAVN',
    flag: 'FRO',
  },
  {
    id: 'cub-moa',
    name: 'MOA',
    flag: 'CUB',
  },
  {
    id: 'ecu-ecu-32',
    name: 'ECU-32',
    flag: 'ECU',
  },
  {
    id: 'nga-quaiboeoilterminal',
    name: 'QUA IBOE OIL TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'kaz-bautino',
    name: 'BAUTINO',
    flag: 'KAZ',
  },
  {
    id: 'cyp-akrotiri',
    name: 'AKROTIRI',
    flag: 'CYP',
  },
  {
    id: 'per-chorrillos',
    name: 'CHORRILLOS',
    flag: 'PER',
  },
  {
    id: 'chl-castro',
    name: 'CASTRO',
    flag: 'CHL',
  },
  {
    id: 'lca-vieuxfort',
    name: 'VIEUX FORT',
    flag: 'LCA',
  },
  {
    id: 'irn-bandarkhomeyni',
    name: 'BANDAR KHOMEYNI',
    flag: 'IRN',
  },
  {
    id: 'rou-rou-5',
    name: 'ROU-5',
    flag: 'ROU',
  },
  {
    id: 'tuv-funafuti',
    name: 'FUNAFUTI',
    flag: 'TUV',
  },
  {
    id: 'ven-guanta',
    name: 'GUANTA',
    flag: 'VEN',
  },
  {
    id: 'vgb-roadtown',
    name: 'ROAD TOWN',
    flag: 'VGB',
  },
  {
    id: 'hti-portauprince',
    name: 'PORT AU PRINCE',
    flag: 'HTI',
  },
  {
    id: 'rou-sulina',
    name: 'SULINA',
    flag: 'ROU',
  },
  {
    id: 'cub-guantanamo',
    name: 'GUANTANAMO',
    flag: 'CUB',
  },
  {
    id: 'pri-islapalominos',
    name: 'ISLA PALOMINOS',
    flag: 'PRI',
  },
  {
    id: 'yem-almukha',
    name: 'AL MUKHA',
    flag: 'YEM',
  },
  {
    id: 'guf-kourou',
    name: 'KOUROU',
    flag: 'GUF',
  },
  {
    id: 'bhs-bhs-74',
    name: 'BHS-74',
    flag: 'BHS',
  },
  {
    id: 'col-col-18',
    name: 'COL-18',
    flag: 'COL',
  },
  {
    id: 'vnm-hongai',
    name: 'HON GAI',
    flag: 'VNM',
  },
  {
    id: 'moz-quelimane',
    name: 'QUELIMANE',
    flag: 'MOZ',
  },
  {
    id: 'are-are-190',
    name: 'ARE-190',
    flag: 'ARE',
  },
  {
    id: 'isl-holmavik',
    name: 'HOLMAVIK',
    flag: 'ISL',
  },
  {
    id: 'som-berbera',
    name: 'BERBERA',
    flag: 'SOM',
  },
  {
    id: 'ecu-ecu-43',
    name: 'ECU-43',
    flag: 'ECU',
  },
  {
    id: 'tun-sousse',
    name: 'SOUSSE',
    flag: 'TUN',
  },
  {
    id: 'cyp-cyp-11',
    name: 'CYP-11',
    flag: 'CYP',
  },
  {
    id: 'pry-puertodeasuncion',
    name: 'PUERTO DE ASUNCION',
    flag: 'PRY',
  },
  {
    id: 'glp-basseterre',
    name: 'BASSE TERRE',
    flag: 'GLP',
  },
  {
    id: 'fsm-tafunsak',
    name: 'TAFUNSAK',
    flag: 'FSM',
  },
  {
    id: 'arg-buenosaires',
    name: 'BUENOS AIRES',
    flag: 'ARG',
  },
  {
    id: 'png-portmoresby',
    name: 'PORT MORESBY',
    flag: 'PNG',
  },
  {
    id: 'prt-praiadevitoria',
    name: 'PRAIA DE VITORIA',
    flag: 'PRT',
  },
  {
    id: 'irl-crosshaven',
    name: 'CROSSHAVEN',
    flag: 'IRL',
  },
  {
    id: 'vir-christiansted',
    name: 'CHRISTIANSTED',
    flag: 'VIR',
  },
  {
    id: 'chl-chl-85',
    name: 'CHL-85',
    flag: 'CHL',
  },
  {
    id: 'are-are-178',
    name: 'ARE-178',
    flag: 'ARE',
  },
  {
    id: "bhs-governor'sharbour",
    name: "GOVERNOR'S HARBOUR",
    flag: 'BHS',
  },
  {
    id: 'kna-basseterre',
    name: 'BASSETERRE',
    flag: 'KNA',
  },
  {
    id: 'bhr-diyaralmuharraq',
    name: 'DIYAR AL MUHARRAQ',
    flag: 'BHR',
  },
  {
    id: 'jam-portantonio',
    name: 'PORT ANTONIO',
    flag: 'JAM',
  },
  {
    id: 'srb-novislankamen',
    name: 'NOVI SLANKAMEN',
    flag: 'SRB',
  },
  {
    id: 'fro-eystur',
    name: 'EYSTUR',
    flag: 'FRO',
  },
  {
    id: 'col-puertonuevo',
    name: 'PUERTO NUEVO',
    flag: 'COL',
  },
  {
    id: 'chl-coquimbo',
    name: 'COQUIMBO',
    flag: 'CHL',
  },
  {
    id: 'cyp-paphos',
    name: 'PAPHOS',
    flag: 'CYP',
  },
  {
    id: 'ven-cumana',
    name: 'CUMANA',
    flag: 'VEN',
  },
  {
    id: 'aze-aze-26',
    name: 'AZE-26',
    flag: 'AZE',
  },
  {
    id: 'egy-elarish',
    name: 'ELARISH',
    flag: 'EGY',
  },
  {
    id: 'bgr-povelyanovo',
    name: 'POVELYANOVO',
    flag: 'BGR',
  },
  {
    id: 'guy-georgetown',
    name: 'GEORGETOWN',
    flag: 'GUY',
  },
  {
    id: 'grl-aasiaat',
    name: 'AASIAAT',
    flag: 'GRL',
  },
  {
    id: 'srb-grocka',
    name: 'GROCKA',
    flag: 'SRB',
  },
  {
    id: 'col-col-37',
    name: 'COL-37',
    flag: 'COL',
  },
  {
    id: 'grl-sisimiut',
    name: 'SISIMIUT',
    flag: 'GRL',
  },
  {
    id: 'rou-medgidia',
    name: 'MEDGIDIA',
    flag: 'ROU',
  },
  {
    id: 'prt-tavira',
    name: 'TAVIRA',
    flag: 'PRT',
  },
  {
    id: 'tha-samutprakan',
    name: 'SAMUT PRAKAN',
    flag: 'THA',
  },
  {
    id: 'cyp-cyp-2',
    name: 'CYP-2',
    flag: 'CYP',
  },
  {
    id: 'sen-dakar',
    name: 'DAKAR',
    flag: 'SEN',
  },
  {
    id: 'lbn-jbail',
    name: 'JBAIL',
    flag: 'LBN',
  },
  {
    id: 'isr-herzliyapituah',
    name: 'HERZLIYA PITUAH',
    flag: 'ISR',
  },
  {
    id: 'chl-chl-38',
    name: 'CHL-38',
    flag: 'CHL',
  },
  {
    id: 'dom-dom-20',
    name: 'DOM-20',
    flag: 'DOM',
  },
  {
    id: 'cri-puntamorales',
    name: 'PUNTA MORALES',
    flag: 'CRI',
  },
  {
    id: 'dma-pointemichel',
    name: 'POINTE MICHEL',
    flag: 'DMA',
  },
  {
    id: 'arg-corrientes',
    name: 'CORRIENTES',
    flag: 'ARG',
  },
  {
    id: 'bhs-sampsoncay',
    name: 'SAMPSON CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-bhs-34',
    name: 'BHS-34',
    flag: 'BHS',
  },
  {
    id: 'nga-koko',
    name: 'KOKO',
    flag: 'NGA',
  },
  {
    id: 'irn-jazireh-yelavanoilterminal',
    name: 'JAZIREH-YE LAVAN OIL TERMINAL',
    flag: 'IRN',
  },
  {
    id: 'bhs-bullockharbour',
    name: 'BULLOCK HARBOUR',
    flag: 'BHS',
  },
  {
    id: 'qat-doha',
    name: 'DOHA',
    flag: 'QAT',
  },
  {
    id: 'nga-nga-57',
    name: 'NGA-57',
    flag: 'NGA',
  },
  {
    id: 'dji-doraleh',
    name: 'DORALEH',
    flag: 'DJI',
  },
  {
    id: 'hun-dunapataj',
    name: 'DUNAPATAJ',
    flag: 'HUN',
  },
  {
    id: 'prt-moscavide',
    name: 'MOSCAVIDE',
    flag: 'PRT',
  },
  {
    id: 'dom-laromana',
    name: 'LA ROMANA',
    flag: 'DOM',
  },
  {
    id: 'ala-degerby',
    name: 'DEGERBY',
    flag: 'ALA',
  },
  {
    id: 'mar-laayoune',
    name: 'LAAYOUNE',
    flag: 'MAR',
  },
  {
    id: 'ecu-ecu-44',
    name: 'ECU-44',
    flag: 'ECU',
  },
  {
    id: 'per-pimentel',
    name: 'PIMENTEL',
    flag: 'PER',
  },
  {
    id: 'twn-tai-chungkang',
    name: 'TAI-CHUNG KANG',
    flag: 'TWN',
  },
  {
    id: 'bhs-bhs-52',
    name: 'BHS-52',
    flag: 'BHS',
  },
  {
    id: 'rou-slobozia',
    name: 'SLOBOZIA',
    flag: 'ROU',
  },
  {
    id: 'tto-chaguaramas',
    name: 'CHAGUARAMAS',
    flag: 'TTO',
  },
  {
    id: 'hun-bogyiszlo',
    name: 'BOGYISZLO',
    flag: 'HUN',
  },
  {
    id: 'rou-constanta',
    name: 'CONSTANTA',
    flag: 'ROU',
  },
  {
    id: 'pri-luism.cintron',
    name: 'LUIS M. CINTRON',
    flag: 'PRI',
  },
  {
    id: 'per-pizarro',
    name: 'PIZARRO',
    flag: 'PER',
  },
  {
    id: 'bhs-bhs-61',
    name: 'BHS-61',
    flag: 'BHS',
  },
  {
    id: 'ven-puertoborburata',
    name: 'PUERTO BORBURATA',
    flag: 'VEN',
  },
  {
    id: 'pan-panamacity',
    name: 'PANAMA CITY',
    flag: 'PAN',
  },
  {
    id: 'bhs-compasscay',
    name: 'COMPASS CAY',
    flag: 'BHS',
  },
  {
    id: 'yem-aden',
    name: 'ADEN',
    flag: 'YEM',
  },
  {
    id: 'ury-lapaloma',
    name: 'LA PALOMA',
    flag: 'URY',
  },
  {
    id: 'vct-kingstown',
    name: 'KINGSTOWN',
    flag: 'VCT',
  },
  {
    id: 'pyf-tahaa',
    name: 'TAHAA',
    flag: 'PYF',
  },
  {
    id: 'pol-sopot',
    name: 'SOPOT',
    flag: 'POL',
  },
  {
    id: 'bgr-bgr-25',
    name: 'BGR-25',
    flag: 'BGR',
  },
  {
    id: 'cyp-polis',
    name: 'POLIS',
    flag: 'CYP',
  },
  {
    id: 'cyp-larnaca',
    name: 'LARNACA',
    flag: 'CYP',
  },
  {
    id: 'atg-bolands',
    name: 'BOLANDS',
    flag: 'ATG',
  },
  {
    id: 'aia-sandygroundvillage',
    name: 'SANDY GROUND VILLAGE',
    flag: 'AIA',
  },
  {
    id: 'lka-trincomalee',
    name: 'TRINCOMALEE',
    flag: 'LKA',
  },
  {
    id: 'tun-mersasfax',
    name: 'MERSA SFAX',
    flag: 'TUN',
  },
  {
    id: 'mar-eljorflasfar',
    name: 'EL JORF LASFAR',
    flag: 'MAR',
  },
  {
    id: 'nga-brassoilterminal',
    name: 'BRASS OIL TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'ago-lobito',
    name: 'LOBITO',
    flag: 'AGO',
  },
  {
    id: 'lbn-jounieh',
    name: 'JOUNIEH',
    flag: 'LBN',
  },
  {
    id: 'dom-santacruzdebarahona',
    name: 'SANTA CRUZ DE BARAHONA',
    flag: 'DOM',
  },
  {
    id: 'ven-elpalito',
    name: 'EL PALITO',
    flag: 'VEN',
  },
  {
    id: 'pol-hel',
    name: 'HEL',
    flag: 'POL',
  },
  {
    id: 'vir-portalucroix',
    name: 'PORT ALUCROIX',
    flag: 'VIR',
  },
  {
    id: 'bhs-bhs-71',
    name: 'BHS-71',
    flag: 'BHS',
  },
  {
    id: 'pry-marianoroquealonso',
    name: 'MARIANO ROQUE ALONSO',
    flag: 'PRY',
  },
  {
    id: 'dza-arzew',
    name: 'ARZEW',
    flag: 'DZA',
  },
  {
    id: 'chl-villapuertoeden',
    name: 'VILLA PUERTO EDEN',
    flag: 'CHL',
  },
  {
    id: 'mar-safi',
    name: 'SAFI',
    flag: 'MAR',
  },
  {
    id: 'tha-sirachaterminal',
    name: 'SI RACHA TERMINAL',
    flag: 'THA',
  },
  {
    id: 'bhs-bhs-68',
    name: 'BHS-68',
    flag: 'BHS',
  },
  {
    id: 'twn-kaohsiung',
    name: 'KAOHSIUNG',
    flag: 'TWN',
  },
  {
    id: 'arg-puertorosales',
    name: 'PUERTO ROSALES',
    flag: 'ARG',
  },
  {
    id: 'mlt-malta',
    name: 'MALTA',
    flag: 'MLT',
  },
  {
    id: 'fro-sorvagur',
    name: 'SORVAGUR',
    flag: 'FRO',
  },
  {
    id: 'chl-chl-76',
    name: 'CHL-76',
    flag: 'CHL',
  },
  {
    id: 'rou-bordusani',
    name: 'BORDUSANI',
    flag: 'ROU',
  },
  {
    id: 'ecu-monteverde',
    name: 'MONTEVERDE',
    flag: 'ECU',
  },
  {
    id: 'are-crescentmoonisland',
    name: 'CRESCENT MOON ISLAND',
    flag: 'ARE',
  },
  {
    id: 'est-loksa',
    name: 'LOKSA',
    flag: 'EST',
  },
  {
    id: 'prt-aveiro',
    name: 'AVEIRO',
    flag: 'PRT',
  },
  {
    id: 'bes-sinteustatius',
    name: 'SINT EUSTATIUS',
    flag: 'BES',
  },
  {
    id: 'chl-chl-81',
    name: 'CHL-81',
    flag: 'CHL',
  },
  {
    id: 'ury-santiagovazquez',
    name: 'SANTIAGO VAZQUEZ',
    flag: 'URY',
  },
  {
    id: 'isl-olafsfjordhur',
    name: 'OLAFSFJORDHUR',
    flag: 'ISL',
  },
  {
    id: 'egy-abuqir',
    name: 'ABU QIR',
    flag: 'EGY',
  },
  {
    id: 'tun-sfax',
    name: 'SFAX',
    flag: 'TUN',
  },
  {
    id: 'irl-sligo',
    name: 'SLIGO',
    flag: 'IRL',
  },
  {
    id: 'est-kardla',
    name: 'KARDLA',
    flag: 'EST',
  },
  {
    id: 'arg-bahiablanca',
    name: 'BAHIA BLANCA',
    flag: 'ARG',
  },
  {
    id: 'irl-irl-52',
    name: 'IRL-52',
    flag: 'IRL',
  },
  {
    id: 'per-matarani',
    name: 'MATARANI',
    flag: 'PER',
  },
  {
    id: 'lbn-batroun',
    name: 'BATROUN',
    flag: 'LBN',
  },
  {
    id: 'pan-contadora',
    name: 'CONTADORA',
    flag: 'PAN',
  },
  {
    id: 'aia-northhillvillage',
    name: 'NORTH HILL VILLAGE',
    flag: 'AIA',
  },
  {
    id: 'isl-grimsey',
    name: 'GRIMSEY',
    flag: 'ISL',
  },
  {
    id: 'vir-stthomas',
    name: 'ST THOMAS',
    flag: 'VIR',
  },
  {
    id: 'per-bayovar',
    name: 'BAYOVAR',
    flag: 'PER',
  },
  {
    id: 'srb-cukarica',
    name: 'CUKARICA',
    flag: 'SRB',
  },
  {
    id: 'tha-rawai',
    name: 'RAWAI',
    flag: 'THA',
  },
  {
    id: 'per-ilo',
    name: 'ILO',
    flag: 'PER',
  },
  {
    id: 'irl-waterford',
    name: 'WATERFORD',
    flag: 'IRL',
  },
  {
    id: 'prt-vilamoura',
    name: 'VILAMOURA',
    flag: 'PRT',
  },
  {
    id: 'gab-portgentil',
    name: 'PORT GENTIL',
    flag: 'GAB',
  },
  {
    id: 'are-are-155',
    name: 'ARE-155',
    flag: 'ARE',
  },
  {
    id: 'aia-westendvillage',
    name: 'WEST END VILLAGE',
    flag: 'AIA',
  },
  {
    id: 'chl-michilla',
    name: 'MICHILLA',
    flag: 'CHL',
  },
  {
    id: 'are-ruwais',
    name: 'RUWAIS',
    flag: 'ARE',
  },
  {
    id: 'pri-puertoreal',
    name: 'PUERTO REAL',
    flag: 'PRI',
  },
  {
    id: 'ven-catialamar',
    name: 'CATIA LA MAR',
    flag: 'VEN',
  },
  {
    id: 'bgr-bgr-21',
    name: 'BGR-21',
    flag: 'BGR',
  },
  {
    id: 'pry-asuncion',
    name: 'ASUNCION',
    flag: 'PRY',
  },
  {
    id: 'irl-howth',
    name: 'HOWTH',
    flag: 'IRL',
  },
  {
    id: 'chl-tocopilla',
    name: 'TOCOPILLA',
    flag: 'CHL',
  },
  {
    id: 'are-abudhabi',
    name: 'ABU DHABI',
    flag: 'ARE',
  },
  {
    id: 'isr-ashqelon',
    name: 'ASHQELON',
    flag: 'ISR',
  },
  {
    id: 'rou-gropeni',
    name: 'GROPENI',
    flag: 'ROU',
  },
  {
    id: 'cyp-ayianapa',
    name: 'AYIA NAPA',
    flag: 'CYP',
  },
  {
    id: 'mne-lipci',
    name: 'LIPCI',
    flag: 'MNE',
  },
  {
    id: 'zaf-zaf-28',
    name: 'ZAF-28',
    flag: 'ZAF',
  },
  {
    id: 'bhs-bellscay',
    name: 'BELLS CAY',
    flag: 'BHS',
  },
  {
    id: 'bgd-monglaanchorage',
    name: 'MONGLA ANCHORAGE',
    flag: 'BGD',
  },
  {
    id: 'png-alotoa',
    name: 'ALOTOA',
    flag: 'PNG',
  },
  {
    id: 'chl-chl-86',
    name: 'CHL-86',
    flag: 'CHL',
  },
  {
    id: 'prt-nazare',
    name: 'NAZARE',
    flag: 'PRT',
  },
  {
    id: 'prt-saolourenco',
    name: 'SAO LOURENCO',
    flag: 'PRT',
  },
  {
    id: 'isr-hadera',
    name: 'HADERA',
    flag: 'ISR',
  },
  {
    id: 'aut-korneuburg',
    name: 'KORNEUBURG',
    flag: 'AUT',
  },
  {
    id: 'chl-sanantonio',
    name: 'SAN ANTONIO',
    flag: 'CHL',
  },
  {
    id: 'prt-vilanovadegaia',
    name: 'VILA NOVA DE GAIA',
    flag: 'PRT',
  },
  {
    id: 'bhs-rwcruiseport',
    name: 'RW CRUISE PORT',
    flag: 'BHS',
  },
  {
    id: 'chl-chl-39',
    name: 'CHL-39',
    flag: 'CHL',
  },
  {
    id: 'rou-nasturelu',
    name: 'NASTURELU',
    flag: 'ROU',
  },
  {
    id: 'blz-blz-3',
    name: 'BLZ-3',
    flag: 'BLZ',
  },
  {
    id: 'grl-nuuk',
    name: 'NUUK',
    flag: 'GRL',
  },
  {
    id: 'bhr-minasalman',
    name: 'MINA SALMAN',
    flag: 'BHR',
  },
  {
    id: 'tto-pointfortin',
    name: 'POINT FORTIN',
    flag: 'TTO',
  },
  {
    id: 'bgr-nesebar',
    name: 'NESEBAR',
    flag: 'BGR',
  },
  {
    id: 'col-barranquilla',
    name: 'BARRANQUILLA',
    flag: 'COL',
  },
  {
    id: 'twn-beigan',
    name: 'BEIGAN',
    flag: 'TWN',
  },
  {
    id: 'ecu-ecu-23',
    name: 'ECU-23',
    flag: 'ECU',
  },
  {
    id: 'kwt-alkuwayt',
    name: 'AL KUWAYT',
    flag: 'KWT',
  },
  {
    id: 'hkg-tungchung',
    name: 'TUNG CHUNG',
    flag: 'HKG',
  },
  {
    id: 'sen-ziguinchor',
    name: 'ZIGUINCHOR',
    flag: 'SEN',
  },
  {
    id: 'irl-burtonport',
    name: 'BURTONPORT',
    flag: 'IRL',
  },
  {
    id: 'nic-corinto',
    name: 'CORINTO',
    flag: 'NIC',
  },
  {
    id: 'cri-cocosisland',
    name: 'COCOS ISLAND',
    flag: 'CRI',
  },
  {
    id: 'jor-alaqabah',
    name: 'AL AQABAH',
    flag: 'JOR',
  },
  {
    id: 'svn-ankaran',
    name: 'ANKARAN',
    flag: 'SVN',
  },
  {
    id: 'vnm-catlai',
    name: 'CAT LAI',
    flag: 'VNM',
  },
  {
    id: 'ecu-ecu-5',
    name: 'ECU-5',
    flag: 'ECU',
  },
  {
    id: 'isl-husavik',
    name: 'HUSAVIK',
    flag: 'ISL',
  },
  {
    id: 'bhs-bhs-41',
    name: 'BHS-41',
    flag: 'BHS',
  },
  {
    id: 'cmr-ebometerminal',
    name: 'EBOME TERMINAL',
    flag: 'CMR',
  },
  {
    id: 'gin-kamsar',
    name: 'KAMSAR',
    flag: 'GIN',
  },
  {
    id: 'cod-boma',
    name: 'BOMA',
    flag: 'COD',
  },
  {
    id: 'rou-eselnita',
    name: 'ESELNITA',
    flag: 'ROU',
  },
  {
    id: 'guf-degraddescannes',
    name: 'DEGRAD DES CANNES',
    flag: 'GUF',
  },
  {
    id: 'col-col-na',
    name: 'COL-NA',
    flag: 'COL',
  },
  {
    id: 'pol-swinoujscie',
    name: 'SWINOUJSCIE',
    flag: 'POL',
  },
  {
    id: 'hun-budakalasz',
    name: 'BUDAKALASZ',
    flag: 'HUN',
  },
  {
    id: 'nga-nga-53',
    name: 'NGA-53',
    flag: 'NGA',
  },
  {
    id: 'rou-calafat',
    name: 'CALAFAT',
    flag: 'ROU',
  },
  {
    id: 'egy-ainsukhna',
    name: 'AIN SUKHNA',
    flag: 'EGY',
  },
  {
    id: 'cuw-bokasami',
    name: 'BOKA SAMI',
    flag: 'CUW',
  },
  {
    id: 'grl-kangerlusuaq',
    name: 'KANGERLUSUAQ',
    flag: 'GRL',
  },
  {
    id: 'blz-blz-5',
    name: 'BLZ-5',
    flag: 'BLZ',
  },
  {
    id: 'pyf-fitii',
    name: 'FITII',
    flag: 'PYF',
  },
  {
    id: 'aut-hainburganderdonau',
    name: 'HAINBURG AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'gha-sekondi-takoradi',
    name: 'SEKONDI-TAKORADI',
    flag: 'GHA',
  },
  {
    id: 'srb-srb-7',
    name: 'SRB-7',
    flag: 'SRB',
  },
  {
    id: 'ven-puntacardon',
    name: 'PUNTA CARDON',
    flag: 'VEN',
  },
  {
    id: 'prt-setubal',
    name: 'SETUBAL',
    flag: 'PRT',
  },
  {
    id: 'are-aljazirah',
    name: 'AL JAZIRAH',
    flag: 'ARE',
  },
  {
    id: 'prt-monteestoril',
    name: 'MONTE ESTORIL',
    flag: 'PRT',
  },
  {
    id: 'cub-nuevitasanchorage',
    name: 'NUEVITAS ANCHORAGE',
    flag: 'CUB',
  },
  {
    id: 'omn-khawrkhasab',
    name: 'KHAWR KHASAB',
    flag: 'OMN',
  },
  {
    id: 'are-musaffahanchorage',
    name: 'MUSAFFAH ANCHORAGE',
    flag: 'ARE',
  },
  {
    id: 'arg-puertogallegos',
    name: 'PUERTO GALLEGOS',
    flag: 'ARG',
  },
  {
    id: 'ven-puertocabello',
    name: 'PUERTO CABELLO',
    flag: 'VEN',
  },
  {
    id: 'bhr-bhr-18',
    name: 'BHR-18',
    flag: 'BHR',
  },
  {
    id: 'srb-velikogradiste',
    name: 'VELIKO GRADISTE',
    flag: 'SRB',
  },
  {
    id: 'bgr-bgr-3',
    name: 'BGR-3',
    flag: 'BGR',
  },
  {
    id: 'fro-klaksvik',
    name: 'KLAKSVIK',
    flag: 'FRO',
  },
  {
    id: 'gnq-puntaeuropaterminal',
    name: 'PUNTA EUROPA TERMINAL',
    flag: 'GNQ',
  },
  {
    id: 'chl-arica',
    name: 'ARICA',
    flag: 'CHL',
  },
  {
    id: 'ecu-guayaquil',
    name: 'GUAYAQUIL',
    flag: 'ECU',
  },
  {
    id: 'nga-onne',
    name: 'ONNE',
    flag: 'NGA',
  },
  {
    id: 'tza-zanzibar',
    name: 'ZANZIBAR',
    flag: 'TZA',
  },
  {
    id: 'per-salaverry',
    name: 'SALAVERRY',
    flag: 'PER',
  },
  {
    id: 'egy-rasgharib',
    name: 'RAS GHARIB',
    flag: 'EGY',
  },
  {
    id: 'ven-bajogrande',
    name: 'BAJO GRANDE',
    flag: 'VEN',
  },
  {
    id: 'qat-jazirathalul',
    name: 'JAZIRAT HALUL',
    flag: 'QAT',
  },
  {
    id: 'tun-kelibia',
    name: 'KELIBIA',
    flag: 'TUN',
  },
  {
    id: 'png-vanimo',
    name: 'VANIMO',
    flag: 'PNG',
  },
  {
    id: 'tha-krabi',
    name: 'KRABI',
    flag: 'THA',
  },
  {
    id: 'brn-lumut',
    name: 'LUMUT',
    flag: 'BRN',
  },
  {
    id: 'bgr-balchik',
    name: 'BALCHIK',
    flag: 'BGR',
  },
  {
    id: 'aut-petronell-carnuntum',
    name: 'PETRONELL-CARNUNTUM',
    flag: 'AUT',
  },
  {
    id: 'irn-irn-83',
    name: 'IRN-83',
    flag: 'IRN',
  },
  {
    id: 'irl-castletownbearhaven',
    name: 'CASTLETOWN BEARHAVEN',
    flag: 'IRL',
  },
  {
    id: 'srb-smederevo',
    name: 'SMEDEREVO',
    flag: 'SRB',
  },
  {
    id: 'prt-figueiradafoz',
    name: 'FIGUEIRA DA FOZ',
    flag: 'PRT',
  },
  {
    id: 'egy-damietta',
    name: 'DAMIETTA',
    flag: 'EGY',
  },
  {
    id: 'per-samanco',
    name: 'SAMANCO',
    flag: 'PER',
  },
  {
    id: 'nic-rama',
    name: 'RAMA',
    flag: 'NIC',
  },
  {
    id: 'prt-lisbon',
    name: 'LISBON',
    flag: 'PRT',
  },
  {
    id: 'mdg-antisranana',
    name: 'ANTISRANANA',
    flag: 'MDG',
  },
  {
    id: 'irq-ummqasr',
    name: 'UMM QASR',
    flag: 'IRQ',
  },
  {
    id: 'tha-songkhla',
    name: 'SONGKHLA',
    flag: 'THA',
  },
  {
    id: 'arg-villaconstitucion',
    name: 'VILLA CONSTITUCION',
    flag: 'ARG',
  },
  {
    id: 'zaf-mosselbay',
    name: 'MOSSEL BAY',
    flag: 'ZAF',
  },
  {
    id: 'cmr-douala',
    name: 'DOUALA',
    flag: 'CMR',
  },
  {
    id: 'hun-komarom',
    name: 'KOMAROM',
    flag: 'HUN',
  },
  {
    id: 'are-are-90',
    name: 'ARE-90',
    flag: 'ARE',
  },
  {
    id: 'lby-misratah',
    name: 'MISRATAH',
    flag: 'LBY',
  },
  {
    id: 'est-muuga',
    name: 'MUUGA',
    flag: 'EST',
  },
  {
    id: 'ncl-tadine',
    name: 'TADINE',
    flag: 'NCL',
  },
  {
    id: 'brb-checkerhall',
    name: 'CHECKER HALL',
    flag: 'BRB',
  },
  {
    id: 'alb-vlores',
    name: 'VLORES',
    flag: 'ALB',
  },
  {
    id: 'are-ummshaiffield',
    name: 'UMM SHAIF FIELD',
    flag: 'ARE',
  },
  {
    id: 'arg-ramallo',
    name: 'RAMALLO',
    flag: 'ARG',
  },
  {
    id: 'mne-budva',
    name: 'BUDVA',
    flag: 'MNE',
  },
  {
    id: 'pol-gdansk',
    name: 'GDANSK',
    flag: 'POL',
  },
  {
    id: 'mlt-zebbug',
    name: 'ZEBBUG',
    flag: 'MLT',
  },
  {
    id: 'chl-chl-43',
    name: 'CHL-43',
    flag: 'CHL',
  },
  {
    id: 'guy-linden',
    name: 'LINDEN',
    flag: 'GUY',
  },
  {
    id: 'est-sillamae',
    name: 'SILLAMAE',
    flag: 'EST',
  },
  {
    id: 'ken-mombasa',
    name: 'MOMBASA',
    flag: 'KEN',
  },
  {
    id: 'are-sirabunuayr',
    name: 'SIR ABU NU AYR',
    flag: 'ARE',
  },
  {
    id: 'ecu-ecu-11',
    name: 'ECU-11',
    flag: 'ECU',
  },
  {
    id: 'lbn-chekka',
    name: 'CHEKKA',
    flag: 'LBN',
  },
  {
    id: 'per-sanjuandemarcona',
    name: 'SAN JUAN DE MARCONA',
    flag: 'PER',
  },
  {
    id: 'mar-kenitra',
    name: 'KENITRA',
    flag: 'MAR',
  },
  {
    id: 'nga-forcadosoilterminal',
    name: 'FORCADOS OIL TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'irl-dundalk',
    name: 'DUNDALK',
    flag: 'IRL',
  },
  {
    id: 'irl-bantrybay',
    name: 'BANTRY BAY',
    flag: 'IRL',
  },
  {
    id: 'est-parnu',
    name: 'PARNU',
    flag: 'EST',
  },
  {
    id: 'pyf-afareaitu',
    name: 'AFAREAITU',
    flag: 'PYF',
  },
  {
    id: 'chl-chl-87',
    name: 'CHL-87',
    flag: 'CHL',
  },
  {
    id: 'per-pucusana',
    name: 'PUCUSANA',
    flag: 'PER',
  },
  {
    id: 'bhs-bhs-55',
    name: 'BHS-55',
    flag: 'BHS',
  },
  {
    id: 'pry-pry-28',
    name: 'PRY-28',
    flag: 'PRY',
  },
  {
    id: 'lbr-monrovia',
    name: 'MONROVIA',
    flag: 'LBR',
  },
  {
    id: 'rou-orsova',
    name: 'ORSOVA',
    flag: 'ROU',
  },
  {
    id: 'civ-portbouetanchorage',
    name: 'PORT BOUET ANCHORAGE',
    flag: 'CIV',
  },
  {
    id: 'prt-povoadevarzim',
    name: 'POVOA DE VARZIM',
    flag: 'PRT',
  },
  {
    id: 'srb-srb-28',
    name: 'SRB-28',
    flag: 'SRB',
  },
  {
    id: 'tza-daressalaam',
    name: 'DAR ES SALAAM',
    flag: 'TZA',
  },
  {
    id: 'bhs-freeport',
    name: 'FREEPORT',
    flag: 'BHS',
  },
  {
    id: 'nga-lagos',
    name: 'LAGOS',
    flag: 'NGA',
  },
  {
    id: 'aze-chilov',
    name: 'CHILOV',
    flag: 'AZE',
  },
  {
    id: 'pak-karachi',
    name: 'KARACHI',
    flag: 'PAK',
  },
  {
    id: 'mrt-nouakchott',
    name: 'NOUAKCHOTT',
    flag: 'MRT',
  },
  {
    id: 'irl-irl-81',
    name: 'IRL-81',
    flag: 'IRL',
  },
  {
    id: 'tha-bankokaeo',
    name: 'BAN KO KAEO',
    flag: 'THA',
  },
  {
    id: 'ncl-noumea',
    name: 'NOUMEA',
    flag: 'NCL',
  },
  {
    id: 'isl-skagastrond',
    name: 'SKAGASTROND',
    flag: 'ISL',
  },
  {
    id: 'sle-freetown',
    name: 'FREETOWN',
    flag: 'SLE',
  },
  {
    id: 'bgr-nikopol',
    name: 'NIKOPOL',
    flag: 'BGR',
  },
  {
    id: 'vut-vut-16',
    name: 'VUT-16',
    flag: 'VUT',
  },
  {
    id: 'are-saadiyat',
    name: 'SAADIYAT',
    flag: 'ARE',
  },
  {
    id: 'aze-badamdar',
    name: 'BADAMDAR',
    flag: 'AZE',
  },
  {
    id: 'bhr-khalifabinsalmanoffshore',
    name: 'KHALIFA BIN SALMAN OFFSHORE',
    flag: 'BHR',
  },
  {
    id: 'yem-nishtun',
    name: 'NISHTUN',
    flag: 'YEM',
  },
  {
    id: 'nga-portharcourt',
    name: 'PORT HARCOURT',
    flag: 'NGA',
  },
  {
    id: 'pyf-paopao',
    name: 'PAOPAO',
    flag: 'PYF',
  },
  {
    id: 'mar-tangiercontainer',
    name: 'TANGIER CONTAINER',
    flag: 'MAR',
  },
  {
    id: 'ecu-islapuna',
    name: 'ISLA PUNA',
    flag: 'ECU',
  },
  {
    id: 'aze-aze-23',
    name: 'AZE-23',
    flag: 'AZE',
  },
  {
    id: 'jam-portesquivel',
    name: 'PORT ESQUIVEL',
    flag: 'JAM',
  },
  {
    id: 'brn-brn-16',
    name: 'BRN-16',
    flag: 'BRN',
  },
  {
    id: 'rou-izvoarele',
    name: 'IZVOARELE',
    flag: 'ROU',
  },
  {
    id: 'prt-lajes',
    name: 'LAJES',
    flag: 'PRT',
  },
  {
    id: 'grl-narsarssuaq',
    name: 'NARSARSSUAQ',
    flag: 'GRL',
  },
  {
    id: 'grl-uummannaqharbor',
    name: 'UUMMANNAQ HARBOR',
    flag: 'GRL',
  },
  {
    id: 'are-are-19',
    name: 'ARE-19',
    flag: 'ARE',
  },
  {
    id: 'rou-cernavoda',
    name: 'CERNAVODA',
    flag: 'ROU',
  },
  {
    id: 'are-nasrfield',
    name: 'NASR FIELD',
    flag: 'ARE',
  },
  {
    id: 'rou-galati',
    name: 'GALATI',
    flag: 'ROU',
  },
  {
    id: 'irn-sirusoilterminal',
    name: 'SIRUS OIL TERMINAL',
    flag: 'IRN',
  },
  {
    id: 'png-png-48',
    name: 'PNG-48',
    flag: 'PNG',
  },
  {
    id: 'slb-hutchisonharbor',
    name: 'HUTCHISON HARBOR',
    flag: 'SLB',
  },
  {
    id: 'pri-culebra',
    name: 'CULEBRA',
    flag: 'PRI',
  },
  {
    id: 'tha-kosichangterminal',
    name: 'KO SI CHANG TERMINAL',
    flag: 'THA',
  },
  {
    id: 'flk-stanley',
    name: 'STANLEY',
    flag: 'FLK',
  },
  {
    id: 'gnq-ceibaterminal',
    name: 'CEIBA TERMINAL',
    flag: 'GNQ',
  },
  {
    id: 'brn-muara',
    name: 'MUARA',
    flag: 'BRN',
  },
  {
    id: 'cpv-portodapraia',
    name: 'PORTO DA PRAIA',
    flag: 'CPV',
  },
  {
    id: 'chl-chl-59',
    name: 'CHL-59',
    flag: 'CHL',
  },
  {
    id: 'egy-hamrawein',
    name: 'HAMRAWEIN',
    flag: 'EGY',
  },
  {
    id: 'tha-banaonang',
    name: 'BAN AO NANG',
    flag: 'THA',
  },
  {
    id: 'twn-mailiao',
    name: 'MAILIAO',
    flag: 'TWN',
  },
  {
    id: 'mmr-yetagunmarineterminal',
    name: 'YETAGUN MARINE TERMINAL',
    flag: 'MMR',
  },
  {
    id: 'irl-fenit',
    name: 'FENIT',
    flag: 'IRL',
  },
  {
    id: 'aut-grafenworth',
    name: 'GRAFENWORTH',
    flag: 'AUT',
  },
  {
    id: 'egy-abughusun',
    name: 'ABU GHUSUN',
    flag: 'EGY',
  },
  {
    id: 'tha-bangkholaem',
    name: 'BANG KHO LAEM',
    flag: 'THA',
  },
  {
    id: 'irl-lochgarman',
    name: 'LOCH GARMAN',
    flag: 'IRL',
  },
  {
    id: 'irl-cobh',
    name: 'COBH',
    flag: 'IRL',
  },
  {
    id: 'ago-soyo',
    name: 'SOYO',
    flag: 'AGO',
  },
  {
    id: 'mdg-toamasina',
    name: 'TOAMASINA',
    flag: 'MDG',
  },
  {
    id: 'ven-puertoordaz',
    name: 'PUERTO ORDAZ',
    flag: 'VEN',
  },
  {
    id: 'mlt-sanlawrenz',
    name: 'SAN LAWRENZ',
    flag: 'MLT',
  },
  {
    id: 'pyf-anau',
    name: 'ANAU',
    flag: 'PYF',
  },
  {
    id: 'chl-chl-66',
    name: 'CHL-66',
    flag: 'CHL',
  },
  {
    id: 'tto-pointlisasindustrialport',
    name: 'POINT LISAS INDUSTRIAL PORT',
    flag: 'TTO',
  },
  {
    id: 'yem-yem-18',
    name: 'YEM-18',
    flag: 'YEM',
  },
  {
    id: 'dom-puertoviejodeazua',
    name: 'PUERTO VIEJO DE AZUA',
    flag: 'DOM',
  },
  {
    id: 'prt-quintadolorde',
    name: 'QUINTA DO LORDE',
    flag: 'PRT',
  },
  {
    id: 'vnm-sontra',
    name: 'SON TRA',
    flag: 'VNM',
  },
  {
    id: 'pol-pol-40',
    name: 'POL-40',
    flag: 'POL',
  },
  {
    id: 'arg-puertoibicuy',
    name: 'PUERTO IBICUY',
    flag: 'ARG',
  },
  {
    id: 'irl-dublin',
    name: 'DUBLIN',
    flag: 'IRL',
  },
  {
    id: 'tha-kosamui',
    name: 'KO SAMUI',
    flag: 'THA',
  },
  {
    id: 'nga-apapa',
    name: 'APAPA',
    flag: 'NGA',
  },
  {
    id: 'mne-dobrota',
    name: 'DOBROTA',
    flag: 'MNE',
  },
  {
    id: 'are-sharjah',
    name: 'SHARJAH',
    flag: 'ARE',
  },
  {
    id: 'gin-conakry',
    name: 'CONAKRY',
    flag: 'GIN',
  },
  {
    id: 'mlt-valleta',
    name: 'VALLETA',
    flag: 'MLT',
  },
  {
    id: 'dza-bejaia',
    name: 'BEJAIA',
    flag: 'DZA',
  },
  {
    id: 'ecu-posorja',
    name: 'POSORJA',
    flag: 'ECU',
  },
  {
    id: 'bgr-bgr-23',
    name: 'BGR-23',
    flag: 'BGR',
  },
  {
    id: 'svn-piran',
    name: 'PIRAN',
    flag: 'SVN',
  },
  {
    id: 'are-dalmaisland',
    name: 'DALMA ISLAND',
    flag: 'ARE',
  },
  {
    id: 'irn-kish',
    name: 'KISH',
    flag: 'IRN',
  },
  {
    id: 'ecu-ecu-26',
    name: 'ECU-26',
    flag: 'ECU',
  },
  {
    id: 'lby-minatarabulus(tripoli)',
    name: 'MINA TARABULUS (TRIPOLI)',
    flag: 'LBY',
  },
  {
    id: 'slb-gizoharbor',
    name: 'GIZO HARBOR',
    flag: 'SLB',
  },
  {
    id: 'hun-budapestviii.kerulet',
    name: 'BUDAPEST VIII. KERULET',
    flag: 'HUN',
  },
  {
    id: 'bhs-bhs-42',
    name: 'BHS-42',
    flag: 'BHS',
  },
  {
    id: 'bgr-varna',
    name: 'VARNA',
    flag: 'BGR',
  },
  {
    id: 'tha-banglamung',
    name: 'BANG LAMUNG',
    flag: 'THA',
  },
  {
    id: 'sur-nieuwnickerie',
    name: 'NIEUW NICKERIE',
    flag: 'SUR',
  },
  {
    id: 'prt-prt-44',
    name: 'PRT-44',
    flag: 'PRT',
  },
  {
    id: 'pyf-papeete',
    name: 'PAPEETE',
    flag: 'PYF',
  },
  {
    id: 'fji-levuka',
    name: 'LEVUKA',
    flag: 'FJI',
  },
  {
    id: 'aia-thevalley',
    name: 'THE VALLEY',
    flag: 'AIA',
  },
  {
    id: 'srb-zemun',
    name: 'ZEMUN',
    flag: 'SRB',
  },
  {
    id: 'arg-sanpedro',
    name: 'SAN PEDRO',
    flag: 'ARG',
  },
  {
    id: 'dom-puertodehaina',
    name: 'PUERTO DE HAINA',
    flag: 'DOM',
  },
  {
    id: 'chl-chl-60',
    name: 'CHL-60',
    flag: 'CHL',
  },
  {
    id: 'ala-kumlinge',
    name: 'KUMLINGE',
    flag: 'ALA',
  },
  {
    id: 'est-muuga-portoftallin',
    name: 'MUUGA-PORT OF TALLIN',
    flag: 'EST',
  },
  {
    id: 'sgs-southgeorgia',
    name: 'SOUTH GEORGIA',
    flag: 'SGS',
  },
  {
    id: 'irq-khawralamaya',
    name: 'KHAWR AL AMAYA',
    flag: 'IRQ',
  },
  {
    id: 'rou-harsova',
    name: 'HARSOVA',
    flag: 'ROU',
  },
  {
    id: 'per-malabrigo',
    name: 'MALABRIGO',
    flag: 'PER',
  },
  {
    id: 'omn-minaqabus',
    name: 'MINA QABUS',
    flag: 'OMN',
  },
  {
    id: 'are-dubai',
    name: 'DUBAI',
    flag: 'ARE',
  },
  {
    id: 'ago-girassolterminal',
    name: 'GIRASSOL TERMINAL',
    flag: 'AGO',
  },
  {
    id: 'are-abkfield',
    name: 'ABK FIELD',
    flag: 'ARE',
  },
  {
    id: 'bhs-lynyardcay',
    name: 'LYNYARD CAY',
    flag: 'BHS',
  },
  {
    id: 'mmr-yangon',
    name: 'YANGON',
    flag: 'MMR',
  },
  {
    id: 'tto-pointeapierre',
    name: 'POINTE A PIERRE',
    flag: 'TTO',
  },
  {
    id: 'egy-sokhna',
    name: 'SOKHNA',
    flag: 'EGY',
  },
  {
    id: 'chl-isladepascua',
    name: 'ISLA DE PASCUA',
    flag: 'CHL',
  },
  {
    id: 'cod-cod-10',
    name: 'COD-10',
    flag: 'COD',
  },
  {
    id: 'tha-banphrunai',
    name: 'BAN PHRU NAI',
    flag: 'THA',
  },
  {
    id: 'bhs-spanishwells',
    name: 'SPANISH WELLS',
    flag: 'BHS',
  },
  {
    id: 'aut-ennsdorf',
    name: 'ENNSDORF',
    flag: 'AUT',
  },
  {
    id: 'hnd-puertocortes',
    name: 'PUERTO CORTES',
    flag: 'HND',
  },
  {
    id: 'aut-weinzierlbeikrems',
    name: 'WEINZIERL BEI KREMS',
    flag: 'AUT',
  },
  {
    id: 'hkg-kowloon',
    name: 'KOWLOON',
    flag: 'HKG',
  },
  {
    id: 'srb-gardinovci',
    name: 'GARDINOVCI',
    flag: 'SRB',
  },
  {
    id: 'bhs-bhs-39',
    name: 'BHS-39',
    flag: 'BHS',
  },
  {
    id: 'rou-chiliaveche',
    name: 'CHILIA VECHE',
    flag: 'ROU',
  },
  {
    id: 'ecu-ecu-36',
    name: 'ECU-36',
    flag: 'ECU',
  },
  {
    id: 'hti-caphaitien',
    name: 'CAP HAITIEN',
    flag: 'HTI',
  },
  {
    id: 'col-col-25',
    name: 'COL-25',
    flag: 'COL',
  },
  {
    id: 'cok-avatiu',
    name: 'AVATIU',
    flag: 'COK',
  },
  {
    id: 'ury-puertobuceo',
    name: 'PUERTO BUCEO',
    flag: 'URY',
  },
  {
    id: 'kir-london',
    name: 'LONDON',
    flag: 'KIR',
  },
  {
    id: 'twn-nangan',
    name: 'NANGAN',
    flag: 'TWN',
  },
  {
    id: 'lka-hendala',
    name: 'HENDALA',
    flag: 'LKA',
  },
  {
    id: 'grd-hillsborough',
    name: 'HILLSBOROUGH',
    flag: 'GRD',
  },
  {
    id: 'grl-gronnedal(kangilinnguit)',
    name: 'GRONNEDAL (KANGILINNGUIT)',
    flag: 'GRL',
  },
  {
    id: 'col-covenas',
    name: 'COVENAS',
    flag: 'COL',
  },
  {
    id: 'mco-mco-5',
    name: 'MCO-5',
    flag: 'MCO',
  },
  {
    id: 'tha-thungkhru',
    name: 'THUNG KHRU',
    flag: 'THA',
  },
  {
    id: 'isl-siglufjorhurd',
    name: 'SIGLUFJORHURD',
    flag: 'ISL',
  },
  {
    id: 'pol-wladyslawowo',
    name: 'WLADYSLAWOWO',
    flag: 'POL',
  },
  {
    id: 'aut-klein-pochlarn',
    name: 'KLEIN-POCHLARN',
    flag: 'AUT',
  },
  {
    id: 'irn-jazireh-yesirri',
    name: 'JAZIREH-YE SIRRI',
    flag: 'IRN',
  },
  {
    id: 'che-kaiseraugst',
    name: 'KAISERAUGST',
    flag: 'CHE',
  },
  {
    id: 'bgr-bgr-5',
    name: 'BGR-5',
    flag: 'BGR',
  },
  {
    id: 'chl-puntaarenas',
    name: 'PUNTA ARENAS',
    flag: 'CHL',
  },
  {
    id: 'fji-aven',
    name: 'AVEN',
    flag: 'FJI',
  },
  {
    id: 'are-jumeirah',
    name: 'JUMEIRAH',
    flag: 'ARE',
  },
  {
    id: 'hkg-central',
    name: 'CENTRAL',
    flag: 'HKG',
  },
  {
    id: 'hti-miragoane',
    name: 'MIRAGOANE',
    flag: 'HTI',
  },
  {
    id: 'sjm-barentsburg',
    name: 'BARENTSBURG',
    flag: 'SJM',
  },
  {
    id: 'pol-nowyport',
    name: 'NOWY PORT',
    flag: 'POL',
  },
  {
    id: 'aze-aze-21',
    name: 'AZE-21',
    flag: 'AZE',
  },
  {
    id: 'rou-unirea',
    name: 'UNIREA',
    flag: 'ROU',
  },
  {
    id: 'irl-dunlaoghaire',
    name: 'DUN LAOGHAIRE',
    flag: 'IRL',
  },
  {
    id: 'mtq-fortdefrance',
    name: 'FORT DE FRANCE',
    flag: 'MTQ',
  },
  {
    id: 'cub-cub-4',
    name: 'CUB-4',
    flag: 'CUB',
  },
  {
    id: 'bhs-bhs-65',
    name: 'BHS-65',
    flag: 'BHS',
  },
  {
    id: 'ury-fraybentos',
    name: 'FRAY BENTOS',
    flag: 'URY',
  },
  {
    id: 'chl-antofagasta',
    name: 'ANTOFAGASTA',
    flag: 'CHL',
  },
  {
    id: 'irq-alharithah',
    name: 'AL HARITHAH',
    flag: 'IRQ',
  },
  {
    id: "bmu-stgeorge's",
    name: "ST GEORGE'S",
    flag: 'BMU',
  },
  {
    id: 'est-paldiski',
    name: 'PALDISKI',
    flag: 'EST',
  },
  {
    id: 'egy-egy-82',
    name: 'EGY-82',
    flag: 'EGY',
  },
  {
    id: 'irl-greystones',
    name: 'GREYSTONES',
    flag: 'IRL',
  },
  {
    id: 'are-are-159',
    name: 'ARE-159',
    flag: 'ARE',
  },
  {
    id: 'nga-amenam',
    name: 'AMENAM',
    flag: 'NGA',
  },
  {
    id: 'mlt-xaghra',
    name: 'XAGHRA',
    flag: 'MLT',
  },
  {
    id: 'gha-tema',
    name: 'TEMA',
    flag: 'GHA',
  },
  {
    id: 'srb-srb-14',
    name: 'SRB-14',
    flag: 'SRB',
  },
  {
    id: 'pol-nowewarpno',
    name: 'NOWE WARPNO',
    flag: 'POL',
  },
  {
    id: 'rou-ceatalchioi',
    name: 'CEATALCHIOI',
    flag: 'ROU',
  },
  {
    id: 'niu-alofi',
    name: 'ALOFI',
    flag: 'NIU',
  },
  {
    id: 'blm-ilefourchue',
    name: 'ILE FOURCHUE',
    flag: 'BLM',
  },
  {
    id: 'mne-risan',
    name: 'RISAN',
    flag: 'MNE',
  },
  {
    id: 'bhs-portroyal',
    name: 'PORT ROYAL',
    flag: 'BHS',
  },
  {
    id: 'isl-akranes',
    name: 'AKRANES',
    flag: 'ISL',
  },
  {
    id: 'nga-bonnyterminal',
    name: 'BONNY TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'bhs-adelaidevillage',
    name: 'ADELAIDE VILLAGE',
    flag: 'BHS',
  },
  {
    id: 'ven-carupano',
    name: 'CARUPANO',
    flag: 'VEN',
  },
  {
    id: 'syr-tartus',
    name: 'TARTUS',
    flag: 'SYR',
  },
  {
    id: 'col-sanandres',
    name: 'SAN ANDRES',
    flag: 'COL',
  },
  {
    id: 'nga-tincanisland',
    name: 'TIN CAN ISLAND',
    flag: 'NGA',
  },
  {
    id: 'est-kuressaare',
    name: 'KURESSAARE',
    flag: 'EST',
  },
  {
    id: 'prt-albufeira',
    name: 'ALBUFEIRA',
    flag: 'PRT',
  },
  {
    id: 'irl-muff',
    name: 'MUFF',
    flag: 'IRL',
  },
  {
    id: 'zaf-portelizabeth',
    name: 'PORT ELIZABETH',
    flag: 'ZAF',
  },
  {
    id: 'twn-magong',
    name: 'MAGONG',
    flag: 'TWN',
  },
  {
    id: 'sxm-phillipsburg',
    name: 'PHILLIPSBURG',
    flag: 'SXM',
  },
  {
    id: 'bhs-bhs-58',
    name: 'BHS-58',
    flag: 'BHS',
  },
  {
    id: 'tha-tha-47',
    name: 'THA-47',
    flag: 'THA',
  },
  {
    id: 'tha-khlongtoei',
    name: 'KHLONG TOEI',
    flag: 'THA',
  },
  {
    id: 'twn-newtaipeicity',
    name: 'NEW TAIPEI CITY',
    flag: 'TWN',
  },
  {
    id: 'qat-qat-23',
    name: 'QAT-23',
    flag: 'QAT',
  },
  {
    id: 'aze-aze-27',
    name: 'AZE-27',
    flag: 'AZE',
  },
  {
    id: 'vir-vir-10',
    name: 'VIR-10',
    flag: 'VIR',
  },
  {
    id: "cog-n'kossaterminal",
    name: "N'KOSSA TERMINAL",
    flag: 'COG',
  },
  {
    id: 'arg-puertobelgrano',
    name: 'PUERTO BELGRANO',
    flag: 'ARG',
  },
  {
    id: 'chl-chl-24',
    name: 'CHL-24',
    flag: 'CHL',
  },
  {
    id: 'pri-puertoyabucoa',
    name: 'PUERTO YABUCOA',
    flag: 'PRI',
  },
  {
    id: 'ecu-ecu-42',
    name: 'ECU-42',
    flag: 'ECU',
  },
  {
    id: 'pri-esperanza',
    name: 'ESPERANZA',
    flag: 'PRI',
  },
  {
    id: 'prk-haejuhang',
    name: 'HAEJU HANG',
    flag: 'PRK',
  },
  {
    id: 'col-col-19',
    name: 'COL-19',
    flag: 'COL',
  },
  {
    id: 'wsm-apia',
    name: 'APIA',
    flag: 'WSM',
  },
  {
    id: 'chl-chl-82',
    name: 'CHL-82',
    flag: 'CHL',
  },
  {
    id: 'isl-strandavegur',
    name: 'STRANDAVEGUR',
    flag: 'ISL',
  },
  {
    id: 'est-kunda',
    name: 'KUNDA',
    flag: 'EST',
  },
  {
    id: 'cod-cod-12',
    name: 'COD-12',
    flag: 'COD',
  },
  {
    id: 'are-are-83',
    name: 'ARE-83',
    flag: 'ARE',
  },
  {
    id: 'tha-phangnga',
    name: 'PHANG NGA',
    flag: 'THA',
  },
  {
    id: 'pri-boqueron',
    name: 'BOQUERON',
    flag: 'PRI',
  },
  {
    id: 'hkg-hongkong',
    name: 'HONGKONG',
    flag: 'HKG',
  },
  {
    id: 'esh-dakhla',
    name: 'DAKHLA',
    flag: 'ESH',
  },
  {
    id: 'civ-baobabmarineterminal',
    name: 'BAOBAB MARINE TERMINAL',
    flag: 'CIV',
  },
  {
    id: 'egy-safaga',
    name: 'SAFAGA',
    flag: 'EGY',
  },
  {
    id: 'cmr-cmr-25',
    name: 'CMR-25',
    flag: 'CMR',
  },
  {
    id: 'arg-sannicolasdelosarroyos',
    name: 'SAN NICOLAS DE LOS ARROYOS',
    flag: 'ARG',
  },
  {
    id: 'fji-fji-56',
    name: 'FJI-56',
    flag: 'FJI',
  },
  {
    id: 'mtq-saint-pierre',
    name: 'SAINT-PIERRE',
    flag: 'MTQ',
  },
  {
    id: 'pyf-manihi',
    name: 'MANIHI',
    flag: 'PYF',
  },
  {
    id: 'isl-reydarfjordur',
    name: 'REYDARFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'ata-portlockroy',
    name: 'PORT LOCKROY',
    flag: 'ATA',
  },
  {
    id: 'ven-guiria',
    name: 'GUIRIA',
    flag: 'VEN',
  },
  {
    id: 'irl-youghal',
    name: 'YOUGHAL',
    flag: 'IRL',
  },
  {
    id: 'isl-thingeyri',
    name: 'THINGEYRI',
    flag: 'ISL',
  },
  {
    id: 'cuw-littlecuracao',
    name: 'LITTLE CURACAO',
    flag: 'CUW',
  },
  {
    id: 'slb-portnoro',
    name: 'PORT NORO',
    flag: 'SLB',
  },
  {
    id: 'are-khalifa',
    name: 'KHALIFA',
    flag: 'ARE',
  },
  {
    id: 'arg-puertogalvan',
    name: 'PUERTO GALVAN',
    flag: 'ARG',
  },
  {
    id: 'png-kumul',
    name: 'KUMUL',
    flag: 'PNG',
  },
  {
    id: 'egy-suez',
    name: 'SUEZ',
    flag: 'EGY',
  },
  {
    id: 'ecu-esmeraldas',
    name: 'ESMERALDAS',
    flag: 'ECU',
  },
  {
    id: 'qat-qat-4',
    name: 'QAT-4',
    flag: 'QAT',
  },
  {
    id: 'col-cartagena',
    name: 'CARTAGENA',
    flag: 'COL',
  },
  {
    id: 'chl-quellon',
    name: 'QUELLON',
    flag: 'CHL',
  },
  {
    id: 'aia-blowingpointvillage',
    name: 'BLOWING POINT VILLAGE',
    flag: 'AIA',
  },
  {
    id: 'gin-taressaanchorage',
    name: 'TARESSA ANCHORAGE',
    flag: 'GIN',
  },
  {
    id: 'prt-gafanhadanazare',
    name: 'GAFANHA DA NAZARE',
    flag: 'PRT',
  },
  {
    id: 'prt-caparica',
    name: 'CAPARICA',
    flag: 'PRT',
  },
  {
    id: 'dom-dom-1',
    name: 'DOM-1',
    flag: 'DOM',
  },
  {
    id: 'hun-halasztelek',
    name: 'HALASZTELEK',
    flag: 'HUN',
  },
  {
    id: 'rou-topalu',
    name: 'TOPALU',
    flag: 'ROU',
  },
  {
    id: 'grd-mornerouge',
    name: 'MORNE ROUGE',
    flag: 'GRD',
  },
  {
    id: 'mar-mohammedia',
    name: 'MOHAMMEDIA',
    flag: 'MAR',
  },
  {
    id: 'bhs-shroudcay',
    name: 'SHROUD CAY',
    flag: 'BHS',
  },
  {
    id: 'cri-moin',
    name: 'MOIN',
    flag: 'CRI',
  },
  {
    id: 'nga-antanoilterminal',
    name: 'ANTAN OIL TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'isl-seydhisfjordhur',
    name: 'SEYDHISFJORDHUR',
    flag: 'ISL',
  },
  {
    id: 'per-coishco',
    name: 'COISHCO',
    flag: 'PER',
  },
  {
    id: 'ncl-koumac',
    name: 'KOUMAC',
    flag: 'NCL',
  },
  {
    id: 'per-huarmey',
    name: 'HUARMEY',
    flag: 'PER',
  },
  {
    id: 'isl-hornabjordur',
    name: 'HORNABJORDUR',
    flag: 'ISL',
  },
  {
    id: 'bes-thebottom',
    name: 'THE BOTTOM',
    flag: 'BES',
  },
  {
    id: 'prt-trafaria',
    name: 'TRAFARIA',
    flag: 'PRT',
  },
  {
    id: 'tkm-tkm-15',
    name: 'TKM-15',
    flag: 'TKM',
  },
  {
    id: 'pan-balboa',
    name: 'BALBOA',
    flag: 'PAN',
  },
  {
    id: 'mne-tivat',
    name: 'TIVAT',
    flag: 'MNE',
  },
  {
    id: 'ven-eltabiazo',
    name: 'EL TABIAZO',
    flag: 'VEN',
  },
  {
    id: 'irq-khawralzubair',
    name: 'KHAWR AL ZUBAIR',
    flag: 'IRQ',
  },
  {
    id: 'prt-douro',
    name: 'DOURO',
    flag: 'PRT',
  },
  {
    id: 'are-are-36',
    name: 'ARE-36',
    flag: 'ARE',
  },
  {
    id: 'pyf-teahupoo',
    name: 'TEAHUPOO',
    flag: 'PYF',
  },
  {
    id: 'ecu-ecu-28',
    name: 'ECU-28',
    flag: 'ECU',
  },
  {
    id: 'arg-puertodeseado',
    name: 'PUERTO DESEADO',
    flag: 'ARG',
  },
  {
    id: 'png-png-42',
    name: 'PNG-42',
    flag: 'PNG',
  },
  {
    id: 'ury-puntadeleste',
    name: 'PUNTA DEL ESTE',
    flag: 'URY',
  },
  {
    id: 'irl-newross',
    name: 'NEW ROSS',
    flag: 'IRL',
  },
  {
    id: 'ecu-santaelena',
    name: 'SANTA ELENA',
    flag: 'ECU',
  },
  {
    id: 'pyf-hao',
    name: 'HAO',
    flag: 'PYF',
  },
  {
    id: 'per-laplanchada',
    name: 'LA PLANCHADA',
    flag: 'PER',
  },
  {
    id: 'fji-malai',
    name: 'MALAI',
    flag: 'FJI',
  },
  {
    id: 'bgr-tutrakan',
    name: 'TUTRAKAN',
    flag: 'BGR',
  },
  {
    id: 'prt-horta',
    name: 'HORTA',
    flag: 'PRT',
  },
  {
    id: 'pan-chiriquigrande',
    name: 'CHIRIQUI GRANDE',
    flag: 'PAN',
  },
  {
    id: 'pak-gwadar',
    name: 'GWADAR',
    flag: 'PAK',
  },
  {
    id: 'cod-cod-5',
    name: 'COD-5',
    flag: 'COD',
  },
  {
    id: 'tha-bangsaphan',
    name: 'BANG SAPHAN',
    flag: 'THA',
  },
  {
    id: 'egy-elgouna',
    name: 'EL GOUNA',
    flag: 'EGY',
  },
  {
    id: 'dza-ghazaouet',
    name: 'GHAZAOUET',
    flag: 'DZA',
  },
  {
    id: 'nga-warri',
    name: 'WARRI',
    flag: 'NGA',
  },
  {
    id: 'cpv-portonovo',
    name: 'PORTO NOVO',
    flag: 'CPV',
  },
  {
    id: 'dom-dom-21',
    name: 'DOM-21',
    flag: 'DOM',
  },
  {
    id: 'abw-sintnicolaasbaai',
    name: 'SINT NICOLAAS BAAI',
    flag: 'ABW',
  },
  {
    id: 'pan-gamboa',
    name: 'GAMBOA',
    flag: 'PAN',
  },
  {
    id: 'arg-pasodelapatria',
    name: 'PASO DE LA PATRIA',
    flag: 'ARG',
  },
  {
    id: 'lby-lby-19',
    name: 'LBY-19',
    flag: 'LBY',
  },
  {
    id: 'dom-lascalderas',
    name: 'LAS CALDERAS',
    flag: 'DOM',
  },
  {
    id: 'bgd-mongla',
    name: 'MONGLA',
    flag: 'BGD',
  },
  {
    id: 'ncl-baiedekouaoua',
    name: 'BAIE DE KOUAOUA',
    flag: 'NCL',
  },
  {
    id: 'prt-seixal',
    name: 'SEIXAL',
    flag: 'PRT',
  },
  {
    id: 'per-vegueta',
    name: 'VEGUETA',
    flag: 'PER',
  },
  {
    id: 'mlt-saintpaulsbay',
    name: 'SAINT PAULS BAY',
    flag: 'MLT',
  },
  {
    id: 'hkg-wanchai',
    name: 'WAN CHAI',
    flag: 'HKG',
  },
  {
    id: 'pri-ensenadahonda',
    name: 'ENSENADA HONDA',
    flag: 'PRI',
  },
  {
    id: 'zaf-eastlondon',
    name: 'EAST LONDON',
    flag: 'ZAF',
  },
  {
    id: 'are-khorfakkan',
    name: 'KHORFAKKAN',
    flag: 'ARE',
  },
  {
    id: 'aze-aze-10',
    name: 'AZE-10',
    flag: 'AZE',
  },
  {
    id: 'sdn-portsudan',
    name: 'PORT SUDAN',
    flag: 'SDN',
  },
  {
    id: 'myt-longoni',
    name: 'LONGONI',
    flag: 'MYT',
  },
  {
    id: 'irl-skerries',
    name: 'SKERRIES',
    flag: 'IRL',
  },
  {
    id: 'svn-jagodje',
    name: 'JAGODJE',
    flag: 'SVN',
  },
  {
    id: 'lbn-jdaidetelmatn',
    name: 'JDAIDET EL MATN',
    flag: 'LBN',
  },
  {
    id: 'isl-olafsvik',
    name: 'OLAFSVIK',
    flag: 'ISL',
  },
  {
    id: 'irn-barkanoil-loadingterminal',
    name: 'BARKAN OIL-LOADING TERMINAL',
    flag: 'IRN',
  },
  {
    id: 'hun-szob',
    name: 'SZOB',
    flag: 'HUN',
  },
  {
    id: 'ecu-ecu-27',
    name: 'ECU-27',
    flag: 'ECU',
  },
  {
    id: 'tha-kohe',
    name: 'KO HE',
    flag: 'THA',
  },
  {
    id: 'ncl-mont-dore',
    name: 'MONT-DORE',
    flag: 'NCL',
  },
  {
    id: 'twn-taichung',
    name: 'TAICHUNG',
    flag: 'TWN',
  },
  {
    id: 'glp-portlouis',
    name: 'PORT LOUIS',
    flag: 'GLP',
  },
  {
    id: 'svn-izola',
    name: 'IZOLA',
    flag: 'SVN',
  },
  {
    id: 'tun-rades',
    name: 'RADES',
    flag: 'TUN',
  },
  {
    id: 'tha-rayong',
    name: 'RAYONG',
    flag: 'THA',
  },
  {
    id: 'prt-peniche',
    name: 'PENICHE',
    flag: 'PRT',
  },
  {
    id: 'bhs-bhs-70',
    name: 'BHS-70',
    flag: 'BHS',
  },
  {
    id: 'cyp-vasilikos',
    name: 'VASILIKOS',
    flag: 'CYP',
  },
  {
    id: 'brn-seria',
    name: 'SERIA',
    flag: 'BRN',
  },
  {
    id: 'flk-berkeleysound',
    name: 'BERKELEY SOUND',
    flag: 'FLK',
  },
  {
    id: 'fsm-pohnpei',
    name: 'POHNPEI',
    flag: 'FSM',
  },
  {
    id: 'dom-sanpedrodemacoris',
    name: 'SAN PEDRO DE MACORIS',
    flag: 'DOM',
  },
  {
    id: 'dom-dom-26',
    name: 'DOM-26',
    flag: 'DOM',
  },
  {
    id: 'lca-grosislet',
    name: 'GROS ISLET',
    flag: 'LCA',
  },
  {
    id: 'lbn-bayrut',
    name: 'BAYRUT',
    flag: 'LBN',
  },
  {
    id: 'egy-zeitbayterminal',
    name: 'ZEIT BAY TERMINAL',
    flag: 'EGY',
  },
  {
    id: 'aut-strengberg',
    name: 'STRENGBERG',
    flag: 'AUT',
  },
  {
    id: 'are-are-92',
    name: 'ARE-92',
    flag: 'ARE',
  },
  {
    id: 'ven-venterminals',
    name: 'VENTERMINALS',
    flag: 'VEN',
  },
  {
    id: 'are-alsadar',
    name: 'ALSADAR',
    flag: 'ARE',
  },
  {
    id: 'ven-lasalina',
    name: 'LA SALINA',
    flag: 'VEN',
  },
  {
    id: 'bhs-bhs-46',
    name: 'BHS-46',
    flag: 'BHS',
  },
  {
    id: 'ury-piriapolis',
    name: 'PIRIAPOLIS',
    flag: 'URY',
  },
  {
    id: 'hnd-frenchharbor',
    name: 'FRENCH HARBOR',
    flag: 'HND',
  },
  {
    id: 'egy-bursafaga',
    name: 'BUR SAFAGA',
    flag: 'EGY',
  },
  {
    id: 'isl-saudarkrokur',
    name: 'SAUDARKROKUR',
    flag: 'ISL',
  },
  {
    id: 'isl-isl-45',
    name: 'ISL-45',
    flag: 'ISL',
  },
  {
    id: 'col-tumacoanchorage',
    name: 'TUMACO ANCHORAGE',
    flag: 'COL',
  },
  {
    id: 'are-minasaqr',
    name: 'MINA SAQR',
    flag: 'ARE',
  },
  {
    id: 'ago-palancaterminal',
    name: 'PALANCA TERMINAL',
    flag: 'AGO',
  },
  {
    id: 'isl-sudavik',
    name: 'SUDAVIK',
    flag: 'ISL',
  },
  {
    id: 'nga-escravos',
    name: 'ESCRAVOS',
    flag: 'NGA',
  },
  {
    id: 'gab-portowendo',
    name: 'PORT OWENDO',
    flag: 'GAB',
  },
  {
    id: 'per-per-37',
    name: 'PER-37',
    flag: 'PER',
  },
  {
    id: 'isl-keflavik',
    name: 'KEFLAVIK',
    flag: 'ISL',
  },
  {
    id: 'mtq-sainte-luce',
    name: 'SAINTE-LUCE',
    flag: 'MTQ',
  },
  {
    id: 'pri-laparguera',
    name: 'LA PARGUERA',
    flag: 'PRI',
  },
  {
    id: 'pri-playadeguayanilla',
    name: 'PLAYA DE GUAYANILLA',
    flag: 'PRI',
  },
  {
    id: 'irl-limerick',
    name: 'LIMERICK',
    flag: 'IRL',
  },
  {
    id: 'cuw-newport',
    name: 'NEWPORT',
    flag: 'CUW',
  },
  {
    id: 'zaf-simonstown',
    name: 'SIMONSTOWN',
    flag: 'ZAF',
  },
  {
    id: 'omn-assuwayq',
    name: 'AS SUWAYQ',
    flag: 'OMN',
  },
  {
    id: 'cpv-viladomaio',
    name: 'VILA DO MAIO',
    flag: 'CPV',
  },
  {
    id: 'bhs-bhs-47',
    name: 'BHS-47',
    flag: 'BHS',
  },
  {
    id: 'vut-sola',
    name: 'SOLA',
    flag: 'VUT',
  },
  {
    id: 'srb-starigrad',
    name: 'STARI GRAD',
    flag: 'SRB',
  },
  {
    id: 'mne-prcanj',
    name: 'PRCANJ',
    flag: 'MNE',
  },
  {
    id: 'lva-liepaja',
    name: 'LIEPAJA',
    flag: 'LVA',
  },
  {
    id: 'mlt-vallettaharbors',
    name: 'VALLETTA HARBORS',
    flag: 'MLT',
  },
  {
    id: 'vnm-vungtau',
    name: 'VUNG TAU',
    flag: 'VNM',
  },
  {
    id: 'ago-cabinda',
    name: 'CABINDA',
    flag: 'AGO',
  },
  {
    id: 'aze-hovsan',
    name: 'HOVSAN',
    flag: 'AZE',
  },
  {
    id: 'are-are-191',
    name: 'ARE-191',
    flag: 'ARE',
  },
  {
    id: 'grl-paamuit(frederikshab)',
    name: 'PAAMUIT (FREDERIKSHAB)',
    flag: 'GRL',
  },
  {
    id: 'are-ummlulufield',
    name: 'UMM LULU FIELD',
    flag: 'ARE',
  },
  {
    id: 'rou-gruia',
    name: 'GRUIA',
    flag: 'ROU',
  },
  {
    id: 'twn-kaosiung',
    name: 'KAOSIUNG',
    flag: 'TWN',
  },
  {
    id: 'fji-fji-14',
    name: 'FJI-14',
    flag: 'FJI',
  },
  {
    id: 'ecu-ecu-1',
    name: 'ECU-1',
    flag: 'ECU',
  },
  {
    id: 'kwt-alfintas',
    name: 'AL FINTAS',
    flag: 'KWT',
  },
  {
    id: 'mlt-marsaxlokk',
    name: 'MARSAXLOKK',
    flag: 'MLT',
  },
  {
    id: 'tca-tca-7',
    name: 'TCA-7',
    flag: 'TCA',
  },
  {
    id: 'irl-galway',
    name: 'GALWAY',
    flag: 'IRL',
  },
  {
    id: 'som-boosaaso',
    name: 'BOOSAASO',
    flag: 'SOM',
  },
  {
    id: 'pan-paraiso',
    name: 'PARAISO',
    flag: 'PAN',
  },
  {
    id: 'irl-greenore',
    name: 'GREENORE',
    flag: 'IRL',
  },
  {
    id: 'per-tambodemora',
    name: 'TAMBO DE MORA',
    flag: 'PER',
  },
  {
    id: 'per-huacho',
    name: 'HUACHO',
    flag: 'PER',
  },
  {
    id: 'are-are-128',
    name: 'ARE-128',
    flag: 'ARE',
  },
  {
    id: 'mmr-rangoon',
    name: 'RANGOON',
    flag: 'MMR',
  },
  {
    id: 'pan-vacamonte',
    name: 'VACAMONTE',
    flag: 'PAN',
  },
  {
    id: 'isl-stykkisholmur',
    name: 'STYKKISHOLMUR',
    flag: 'ISL',
  },
  {
    id: 'tgo-kpeme',
    name: 'KPEME',
    flag: 'TGO',
  },
  {
    id: 'mrt-nouadhibou',
    name: 'NOUADHIBOU',
    flag: 'MRT',
  },
  {
    id: 'jam-riobueno',
    name: 'RIO BUENO',
    flag: 'JAM',
  },
  {
    id: 'bhs-bhs-72',
    name: 'BHS-72',
    flag: 'BHS',
  },
  {
    id: 'arg-arroyoseco',
    name: 'ARROYO SECO',
    flag: 'ARG',
  },
  {
    id: 'grl-illulissat(jakobshavn)',
    name: 'ILLULISSAT (JAKOBSHAVN)',
    flag: 'GRL',
  },
  {
    id: 'hnd-puertocastilla',
    name: 'PUERTO CASTILLA',
    flag: 'HND',
  },
  {
    id: 'cpv-santamaria',
    name: 'SANTA MARIA',
    flag: 'CPV',
  },
  {
    id: 'tha-yannawa',
    name: 'YAN NAWA',
    flag: 'THA',
  },
  {
    id: 'aut-baddeutsch-altenburg',
    name: 'BAD DEUTSCH-ALTENBURG',
    flag: 'AUT',
  },
  {
    id: 'mhl-majuro',
    name: 'MAJURO',
    flag: 'MHL',
  },
  {
    id: 'ven-amuay(bahiadeamuay)',
    name: 'AMUAY (BAHIA DE AMUAY)',
    flag: 'VEN',
  },
  {
    id: 'cub-nuevitas',
    name: 'NUEVITAS',
    flag: 'CUB',
  },
  {
    id: 'ecu-puertobolivar',
    name: 'PUERTO BOLIVAR',
    flag: 'ECU',
  },
  {
    id: 'arg-concepciondeluruguay',
    name: 'CONCEPCION DEL URUGUAY',
    flag: 'ARG',
  },
  {
    id: 'tto-pointlisas',
    name: 'POINT LISAS',
    flag: 'TTO',
  },
  {
    id: 'irl-dunmoreeast',
    name: 'DUNMORE EAST',
    flag: 'IRL',
  },
  {
    id: 'prt-lisboa',
    name: 'LISBOA',
    flag: 'PRT',
  },
  {
    id: 'chl-chl-6',
    name: 'CHL-6',
    flag: 'CHL',
  },
  {
    id: 'gtm-puertoquetzal',
    name: 'PUERTO QUETZAL',
    flag: 'GTM',
  },
  {
    id: 'qat-lusail',
    name: 'LUSAIL',
    flag: 'QAT',
  },
  {
    id: 'irn-chahbahar',
    name: 'CHAH BAHAR',
    flag: 'IRN',
  },
  {
    id: 'cub-matanzas',
    name: 'MATANZAS',
    flag: 'CUB',
  },
  {
    id: 'are-ummsuqeimiii',
    name: 'UMM SUQEIM III',
    flag: 'ARE',
  },
  {
    id: 'pol-szczecin',
    name: 'SZCZECIN',
    flag: 'POL',
  },
  {
    id: 'hun-veroce',
    name: 'VEROCE',
    flag: 'HUN',
  },
  {
    id: 'tto-tto-27',
    name: 'TTO-27',
    flag: 'TTO',
  },
  {
    id: 'pry-pry-22',
    name: 'PRY-22',
    flag: 'PRY',
  },
  {
    id: 'arg-mardelplata',
    name: 'MAR DEL PLATA',
    flag: 'ARG',
  },
  {
    id: 'imn-peel',
    name: 'PEEL',
    flag: 'IMN',
  },
  {
    id: 'arg-puertosanmartin',
    name: 'PUERTO SAN MARTIN',
    flag: 'ARG',
  },
  {
    id: 'per-puertoilo',
    name: 'PUERTO ILO',
    flag: 'PER',
  },
  {
    id: 'aze-qobustan',
    name: 'QOBUSTAN',
    flag: 'AZE',
  },
  {
    id: 'prt-sesimbra',
    name: 'SESIMBRA',
    flag: 'PRT',
  },
  {
    id: 'moz-beira',
    name: 'BEIRA',
    flag: 'MOZ',
  },
  {
    id: 'irn-jask',
    name: 'JASK',
    flag: 'IRN',
  },
  {
    id: 'lby-banghazi',
    name: 'BANGHAZI',
    flag: 'LBY',
  },
  {
    id: 'pri-lasmareas',
    name: 'LAS MAREAS',
    flag: 'PRI',
  },
  {
    id: 'per-callao',
    name: 'CALLAO',
    flag: 'PER',
  },
  {
    id: 'nic-puertosandino',
    name: 'PUERTO SANDINO',
    flag: 'NIC',
  },
  {
    id: 'tha-kantangharbor',
    name: 'KANTANG HARBOR',
    flag: 'THA',
  },
  {
    id: 'pyf-tohautu',
    name: 'TOHAUTU',
    flag: 'PYF',
  },
  {
    id: 'png-kimbe',
    name: 'KIMBE',
    flag: 'PNG',
  },
  {
    id: 'tha-phrasamutchedi',
    name: 'PHRA SAMUT CHEDI',
    flag: 'THA',
  },
  {
    id: 'ago-luanda',
    name: 'LUANDA',
    flag: 'AGO',
  },
  {
    id: 'ury-montevideo',
    name: 'MONTEVIDEO',
    flag: 'URY',
  },
  {
    id: 'isl-sandgerdi',
    name: 'SANDGERDI',
    flag: 'ISL',
  },
  {
    id: 'blz-belizecityanchorage',
    name: 'BELIZE CITY ANCHORAGE',
    flag: 'BLZ',
  },
  {
    id: 'rou-mangalia',
    name: 'MANGALIA',
    flag: 'ROU',
  },
  {
    id: 'per-pacasmayo',
    name: 'PACASMAYO',
    flag: 'PER',
  },
  {
    id: 'rou-rou-63',
    name: 'ROU-63',
    flag: 'ROU',
  },
  {
    id: 'cmr-cmr-22',
    name: 'CMR-22',
    flag: 'CMR',
  },
  {
    id: 'bhs-bhs-25',
    name: 'BHS-25',
    flag: 'BHS',
  },
  {
    id: 'kaz-omirzaq',
    name: 'OMIRZAQ',
    flag: 'KAZ',
  },
  {
    id: 'mar-tanger',
    name: 'TANGER',
    flag: 'MAR',
  },
  {
    id: 'mtq-lemarin',
    name: 'LE MARIN',
    flag: 'MTQ',
  },
  {
    id: 'ltu-klaipeda',
    name: 'KLAIPEDA',
    flag: 'LTU',
  },
  {
    id: 'irl-irl-64',
    name: 'IRL-64',
    flag: 'IRL',
  },
  {
    id: 'nga-nga-82',
    name: 'NGA-82',
    flag: 'NGA',
  },
  {
    id: 'gnq-serpentinaterminal',
    name: 'SERPENTINA TERMINAL',
    flag: 'GNQ',
  },
  {
    id: 'prt-piedade',
    name: 'PIEDADE',
    flag: 'PRT',
  },
  {
    id: 'mdg-mahajanga',
    name: 'MAHAJANGA',
    flag: 'MDG',
  },
  {
    id: 'bhs-bhs-64',
    name: 'BHS-64',
    flag: 'BHS',
  },
  {
    id: 'zaf-saldanhabay',
    name: 'SALDANHA BAY',
    flag: 'ZAF',
  },
  {
    id: 'ven-laspiedras',
    name: 'LAS PIEDRAS',
    flag: 'VEN',
  },
  {
    id: 'vnm-campha',
    name: 'CAM PHA',
    flag: 'VNM',
  },
  {
    id: 'aut-vienna',
    name: 'VIENNA',
    flag: 'AUT',
  },
  {
    id: 'mtq-lerobert',
    name: 'LE ROBERT',
    flag: 'MTQ',
  },
  {
    id: 'chl-ayacara',
    name: 'AYACARA',
    flag: 'CHL',
  },
  {
    id: 'mne-bar',
    name: 'BAR',
    flag: 'MNE',
  },
  {
    id: 'aut-hofamtpriel',
    name: 'HOFAMT PRIEL',
    flag: 'AUT',
  },
  {
    id: 'aze-baku-southbay',
    name: 'BAKU-SOUTH BAY',
    flag: 'AZE',
  },
  {
    id: 'srb-knicanin',
    name: 'KNICANIN',
    flag: 'SRB',
  },
  {
    id: 'hun-neszmely',
    name: 'NESZMELY',
    flag: 'HUN',
  },
  {
    id: 'chl-puertochacabuco',
    name: 'PUERTO CHACABUCO',
    flag: 'CHL',
  },
  {
    id: 'tca-grandturk',
    name: 'GRAND TURK',
    flag: 'TCA',
  },
  {
    id: 'isl-reykjavik',
    name: 'REYKJAVIK',
    flag: 'ISL',
  },
  {
    id: 'aut-wolfsthal',
    name: 'WOLFSTHAL',
    flag: 'AUT',
  },
  {
    id: 'sjm-bellsund',
    name: 'BELLSUND',
    flag: 'SJM',
  },
  {
    id: 'per-tablones',
    name: 'TABLONES',
    flag: 'PER',
  },
  {
    id: 'pyf-portrikitea',
    name: 'PORT RIKITEA',
    flag: 'PYF',
  },
  {
    id: 'svk-sturovo',
    name: 'STUROVO',
    flag: 'SVK',
  },
  {
    id: 'pyf-papetoai',
    name: 'PAPETOAI',
    flag: 'PYF',
  },
  {
    id: 'pan-bastimentos',
    name: 'BASTIMENTOS',
    flag: 'PAN',
  },
  {
    id: 'ven-bachaquero',
    name: 'BACHAQUERO',
    flag: 'VEN',
  },
  {
    id: 'hun-baja',
    name: 'BAJA',
    flag: 'HUN',
  },
  {
    id: "grd-stgeorge's",
    name: "ST GEORGE'S",
    flag: 'GRD',
  },
  {
    id: 'ven-ven-63',
    name: 'VEN-63',
    flag: 'VEN',
  },
  {
    id: 'nru-nauru',
    name: 'NAURU',
    flag: 'NRU',
  },
  {
    id: 'grl-narsaq',
    name: 'NARSAQ',
    flag: 'GRL',
  },
  {
    id: 'fsm-moen',
    name: 'MOEN',
    flag: 'FSM',
  },
  {
    id: 'pyf-vairao',
    name: 'VAIRAO',
    flag: 'PYF',
  },
  {
    id: 'ton-nukualofa',
    name: 'NUKU ALOFA',
    flag: 'TON',
  },
  {
    id: 'bhs-bhs-56',
    name: 'BHS-56',
    flag: 'BHS',
  },
  {
    id: 'lka-colombo',
    name: 'COLOMBO',
    flag: 'LKA',
  },
  {
    id: 'lka-marissa',
    name: 'MARISSA',
    flag: 'LKA',
  },
  {
    id: 'sur-nieuwamsterdam',
    name: 'NIEUW AMSTERDAM',
    flag: 'SUR',
  },
  {
    id: 'hkg-taio',
    name: 'TAI O',
    flag: 'HKG',
  },
  {
    id: 'lva-roja',
    name: 'ROJA',
    flag: 'LVA',
  },
  {
    id: 'dom-dom-22',
    name: 'DOM-22',
    flag: 'DOM',
  },
  {
    id: 'khm-kampongsaom',
    name: 'KAMPONG SAOM',
    flag: 'KHM',
  },
  {
    id: 'chl-chl-90',
    name: 'CHL-90',
    flag: 'CHL',
  },
  {
    id: 'isr-haifa',
    name: 'HAIFA',
    flag: 'ISR',
  },
  {
    id: 'dza-alger',
    name: 'ALGER',
    flag: 'DZA',
  },
  {
    id: 'mtq-levauclin',
    name: 'LE VAUCLIN',
    flag: 'MTQ',
  },
  {
    id: 'chl-chl-48',
    name: 'CHL-48',
    flag: 'CHL',
  },
  {
    id: 'cod-cod-14',
    name: 'COD-14',
    flag: 'COD',
  },
  {
    id: 'lby-khoms',
    name: 'KHOMS',
    flag: 'LBY',
  },
  {
    id: 'brn-brn-3',
    name: 'BRN-3',
    flag: 'BRN',
  },
  {
    id: 'bhs-cliftonbay',
    name: 'CLIFTON BAY',
    flag: 'BHS',
  },
  {
    id: 'bgr-vidin',
    name: 'VIDIN',
    flag: 'BGR',
  },
  {
    id: 'srb-sabac',
    name: 'SABAC',
    flag: 'SRB',
  },
  {
    id: 'tha-naiharn',
    name: 'NAI HARN',
    flag: 'THA',
  },
  {
    id: 'chl-portaguirre',
    name: 'PORT AGUIRRE',
    flag: 'CHL',
  },
  {
    id: 'svk-gabcikovo',
    name: 'GABCIKOVO',
    flag: 'SVK',
  },
  {
    id: 'bgr-bgr-16',
    name: 'BGR-16',
    flag: 'BGR',
  },
  {
    id: 'est-haabneeme',
    name: 'HAABNEEME',
    flag: 'EST',
  },
  {
    id: 'pyf-mahina',
    name: 'MAHINA',
    flag: 'PYF',
  },
  {
    id: 'isl-grindavik',
    name: 'GRINDAVIK',
    flag: 'ISL',
  },
  {
    id: 'vir-vir-6',
    name: 'VIR-6',
    flag: 'VIR',
  },
  {
    id: 'cod-block31',
    name: 'BLOCK 31',
    flag: 'COD',
  },
  {
    id: 'tha-ratburana',
    name: 'RAT BURANA',
    flag: 'THA',
  },
  {
    id: 'mar-portnador',
    name: 'PORT NADOR',
    flag: 'MAR',
  },
  {
    id: 'alb-sarande',
    name: 'SARANDE',
    flag: 'ALB',
  },
  {
    id: 'bgr-sozopol',
    name: 'SOZOPOL',
    flag: 'BGR',
  },
  {
    id: 'lva-mersrags',
    name: 'MERSRAGS',
    flag: 'LVA',
  },
  {
    id: 'mne-bijela',
    name: 'BIJELA',
    flag: 'MNE',
  },
  {
    id: 'brn-brn-18',
    name: 'BRN-18',
    flag: 'BRN',
  },
  {
    id: 'bhs-bhs-62',
    name: 'BHS-62',
    flag: 'BHS',
  },
  {
    id: 'aze-aze-31',
    name: 'AZE-31',
    flag: 'AZE',
  },
  {
    id: 'irn-bandar-elengeh',
    name: 'BANDAR-E LENGEH',
    flag: 'IRN',
  },
  {
    id: 'arg-sanisidro',
    name: 'SAN ISIDRO',
    flag: 'ARG',
  },
  {
    id: 'arg-sanlorenzo',
    name: 'SAN LORENZO',
    flag: 'ARG',
  },
  {
    id: 'gib-europapoint',
    name: 'EUROPA POINT',
    flag: 'GIB',
  },
  {
    id: 'aut-goldworth',
    name: 'GOLDWORTH',
    flag: 'AUT',
  },
  {
    id: 'prt-angradoheroismo',
    name: 'ANGRA DO HEROISMO',
    flag: 'PRT',
  },
  {
    id: 'ecu-ecu-34',
    name: 'ECU-34',
    flag: 'ECU',
  },
  {
    id: 'rou-galdau',
    name: 'GALDAU',
    flag: 'ROU',
  },
  {
    id: 'prt-lajesdasflores',
    name: 'LAJES DAS FLORES',
    flag: 'PRT',
  },
  {
    id: 'twn-taoyuan',
    name: 'TAOYUAN',
    flag: 'TWN',
  },
  {
    id: 'chl-mariaolvio',
    name: 'MARIA OLVIO',
    flag: 'CHL',
  },
  {
    id: 'per-ancon',
    name: 'ANCON',
    flag: 'PER',
  },
  {
    id: 'chl-chl-108',
    name: 'CHL-108',
    flag: 'CHL',
  },
  {
    id: 'grl-nanortalikhavn',
    name: 'NANORTALIK HAVN',
    flag: 'GRL',
  },
  {
    id: 'tha-phiphidon',
    name: 'PHI PHI DON',
    flag: 'THA',
  },
  {
    id: 'cub-cub-18',
    name: 'CUB-18',
    flag: 'CUB',
  },
  {
    id: 'mac-macau',
    name: 'MACAU',
    flag: 'MAC',
  },
  {
    id: 'hnd-omoa',
    name: 'OMOA',
    flag: 'HND',
  },
  {
    id: 'rou-rou-24',
    name: 'ROU-24',
    flag: 'ROU',
  },
  {
    id: 'mhl-kwajalein',
    name: 'KWAJALEIN',
    flag: 'MHL',
  },
  {
    id: 'cub-cienfuegos',
    name: 'CIENFUEGOS',
    flag: 'CUB',
  },
  {
    id: 'vnm-hochiminh',
    name: 'HO CHI MINH',
    flag: 'VNM',
  },
  {
    id: 'per-mollendo',
    name: 'MOLLENDO',
    flag: 'PER',
  },
  {
    id: 'aze-aze-32',
    name: 'AZE-32',
    flag: 'AZE',
  },
  {
    id: 'nam-walvisbay',
    name: 'WALVIS BAY',
    flag: 'NAM',
  },
  {
    id: 'per-pisco',
    name: 'PISCO',
    flag: 'PER',
  },
  {
    id: 'yem-almukalla',
    name: 'AL MUKALLA',
    flag: 'YEM',
  },
  {
    id: 'bgr-ruse',
    name: 'RUSE',
    flag: 'BGR',
  },
  {
    id: 'bgr-svishtov',
    name: 'SVISHTOV',
    flag: 'BGR',
  },
  {
    id: 'twn-liuqiu',
    name: 'LIUQIU',
    flag: 'TWN',
  },
  {
    id: 'chl-chacao',
    name: 'CHACAO',
    flag: 'CHL',
  },
  {
    id: 'are-are-176',
    name: 'ARE-176',
    flag: 'ARE',
  },
  {
    id: 'bgd-bgd-14',
    name: 'BGD-14',
    flag: 'BGD',
  },
  {
    id: 'bhs-dunmoretown',
    name: 'DUNMORE TOWN',
    flag: 'BHS',
  },
  {
    id: 'rou-rasova',
    name: 'RASOVA',
    flag: 'ROU',
  },
  {
    id: 'hun-budapestiii.kerulet',
    name: 'BUDAPEST III. KERULET',
    flag: 'HUN',
  },
  {
    id: 'dom-caborojo',
    name: 'CABO ROJO',
    flag: 'DOM',
  },
  {
    id: 'are-jebelali',
    name: 'JEBEL ALI',
    flag: 'ARE',
  },
  {
    id: 'sgs-grytviken',
    name: 'GRYTVIKEN',
    flag: 'SGS',
  },
  {
    id: 'nga-oghara',
    name: 'OGHARA',
    flag: 'NGA',
  },
  {
    id: 'png-kieta',
    name: 'KIETA',
    flag: 'PNG',
  },
  {
    id: 'fro-saltangara',
    name: 'SALTANGARA',
    flag: 'FRO',
  },
  {
    id: 'nga-bonny',
    name: 'BONNY',
    flag: 'NGA',
  },
  {
    id: 'pri-mariaantonia',
    name: 'MARIA ANTONIA',
    flag: 'PRI',
  },
  {
    id: 'est-haapsalu',
    name: 'HAAPSALU',
    flag: 'EST',
  },
  {
    id: 'ton-hihifo',
    name: 'HIHIFO',
    flag: 'TON',
  },
  {
    id: 'are-dasisland',
    name: 'DAS ISLAND',
    flag: 'ARE',
  },
  {
    id: 'shn-jamestown',
    name: 'JAMESTOWN',
    flag: 'SHN',
  },
  {
    id: 'irq-khawralzubairlngterminal',
    name: 'KHAWR AL ZUBAIR LNG TERMINAL',
    flag: 'IRQ',
  },
  {
    id: 'tza-tanga',
    name: 'TANGA',
    flag: 'TZA',
  },
  {
    id: 'egy-elghardaqa',
    name: 'EL GHARDAQA',
    flag: 'EGY',
  },
  {
    id: 'rou-i.c.bratianu',
    name: 'I. C. BRATIANU',
    flag: 'ROU',
  },
  {
    id: 'isl-dalvik',
    name: 'DALVIK',
    flag: 'ISL',
  },
  {
    id: 'kwt-kuwaitcity',
    name: 'KUWAIT CITY',
    flag: 'KWT',
  },
  {
    id: 'ven-elguamache',
    name: 'EL GUAMACHE',
    flag: 'VEN',
  },
  {
    id: 'are-almarmarisland',
    name: 'AL MARMAR ISLAND',
    flag: 'ARE',
  },
  {
    id: 'rou-ciuperceniivechi',
    name: 'CIUPERCENII VECHI',
    flag: 'ROU',
  },
  {
    id: 'vct-chateaubelair',
    name: 'CHATEAUBELAIR',
    flag: 'VCT',
  },
  {
    id: 'bhr-bhr-6',
    name: 'BHR-6',
    flag: 'BHR',
  },
  {
    id: 'kir-tarawa',
    name: 'TARAWA',
    flag: 'KIR',
  },
  {
    id: 'tun-lagoulette',
    name: 'LA GOULETTE',
    flag: 'TUN',
  },
  {
    id: 'aut-linz',
    name: 'LINZ',
    flag: 'AUT',
  },
  {
    id: 'rou-mamaia-sat',
    name: 'MAMAIA-SAT',
    flag: 'ROU',
  },
  {
    id: 'bhs-bhs-36',
    name: 'BHS-36',
    flag: 'BHS',
  },
  {
    id: 'irl-malahide',
    name: 'MALAHIDE',
    flag: 'IRL',
  },
  {
    id: 'irl-arklow',
    name: 'ARKLOW',
    flag: 'IRL',
  },
  {
    id: 'bhs-bhs-28',
    name: 'BHS-28',
    flag: 'BHS',
  },
  {
    id: 'mco-monaco',
    name: 'MONACO',
    flag: 'MCO',
  },
  {
    id: 'kwt-minaashshuaybah',
    name: 'MINA ASH SHUAYBAH',
    flag: 'KWT',
  },
  {
    id: 'tza-mjimwematerminal',
    name: 'MJIMWEMA TERMINAL',
    flag: 'TZA',
  },
  {
    id: 'nga-ajegunle',
    name: 'AJEGUNLE',
    flag: 'NGA',
  },
  {
    id: 'bhs-bhs-51',
    name: 'BHS-51',
    flag: 'BHS',
  },
  {
    id: 'bmu-irelandisland',
    name: 'IRELAND ISLAND',
    flag: 'BMU',
  },
  {
    id: 'kna-charlestown',
    name: 'CHARLESTOWN',
    flag: 'KNA',
  },
  {
    id: 'egy-egy-26',
    name: 'EGY-26',
    flag: 'EGY',
  },
  {
    id: 'brn-brn-14',
    name: 'BRN-14',
    flag: 'BRN',
  },
  {
    id: 'arg-tigre',
    name: 'TIGRE',
    flag: 'ARG',
  },
  {
    id: 'png-lihir',
    name: 'LIHIR',
    flag: 'PNG',
  },
  {
    id: 'isl-vestmannaeyjar',
    name: 'VESTMANNAEYJAR',
    flag: 'ISL',
  },
  {
    id: 'irn-astara',
    name: 'ASTARA',
    flag: 'IRN',
  },
  {
    id: 'aut-leiben',
    name: 'LEIBEN',
    flag: 'AUT',
  },
  {
    id: 'rou-ostrovumare',
    name: 'OSTROVU MARE',
    flag: 'ROU',
  },
  {
    id: 'mda-giurgiulesti',
    name: 'GIURGIULESTI',
    flag: 'MDA',
  },
  {
    id: 'prt-lagos',
    name: 'LAGOS',
    flag: 'PRT',
  },
  {
    id: 'aze-aze-25',
    name: 'AZE-25',
    flag: 'AZE',
  },
  {
    id: 'pri-playadeponce',
    name: 'PLAYA DE PONCE',
    flag: 'PRI',
  },
  {
    id: 'slb-honiara',
    name: 'HONIARA',
    flag: 'SLB',
  },
  {
    id: 'aze-aze-20',
    name: 'AZE-20',
    flag: 'AZE',
  },
  {
    id: 'per-lapunta',
    name: 'LA PUNTA',
    flag: 'PER',
  },
  {
    id: 'are-zirku',
    name: 'ZIRKU',
    flag: 'ARE',
  },
  {
    id: 'mar-casablanca',
    name: 'CASABLANCA',
    flag: 'MAR',
  },
  {
    id: 'ecu-ayoraanchorage',
    name: 'AYORA ANCHORAGE',
    flag: 'ECU',
  },
  {
    id: 'ven-puertomiranda',
    name: 'PUERTO MIRANDA',
    flag: 'VEN',
  },
  {
    id: 'twn-taipei',
    name: 'TAIPEI',
    flag: 'TWN',
  },
  {
    id: 'eri-assab',
    name: 'ASSAB',
    flag: 'ERI',
  },
  {
    id: 'isl-kopasker',
    name: 'KOPASKER',
    flag: 'ISL',
  },
  {
    id: 'cok-cok-2',
    name: 'COK-2',
    flag: 'COK',
  },
  {
    id: 'sur-moengo',
    name: 'MOENGO',
    flag: 'SUR',
  },
  {
    id: 'vnm-quangyen',
    name: 'QUANG YEN',
    flag: 'VNM',
  },
  {
    id: 'pan-sancarlos',
    name: 'SAN CARLOS',
    flag: 'PAN',
  },
  {
    id: 'are-zakumfield',
    name: 'ZAKUM FIELD',
    flag: 'ARE',
  },
  {
    id: 'pry-pry-11',
    name: 'PRY-11',
    flag: 'PRY',
  },
  {
    id: 'nga-okonoterminal',
    name: 'OKONO TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'shn-georgetown',
    name: 'GEORGETOWN',
    flag: 'SHN',
  },
  {
    id: 'grl-qeqertarsuaq',
    name: 'QEQERTARSUAQ',
    flag: 'GRL',
  },
  {
    id: 'pol-leba',
    name: 'LEBA',
    flag: 'POL',
  },
  {
    id: 'chl-cabonegro',
    name: 'CABO NEGRO',
    flag: 'CHL',
  },
  {
    id: 'arg-frayluisa.beltran',
    name: 'FRAY LUIS A. BELTRAN',
    flag: 'ARG',
  },
  {
    id: 'mdv-viligili',
    name: 'VILIGILI',
    flag: 'MDV',
  },
  {
    id: 'irl-irl-3',
    name: 'IRL-3',
    flag: 'IRL',
  },
  {
    id: 'som-kismaayo',
    name: 'KISMAAYO',
    flag: 'SOM',
  },
  {
    id: 'mar-agadir',
    name: 'AGADIR',
    flag: 'MAR',
  },
  {
    id: 'alb-vlore',
    name: 'VLORE',
    flag: 'ALB',
  },
  {
    id: 'svn-koper',
    name: 'KOPER',
    flag: 'SVN',
  },
  {
    id: 'egy-elismailiya',
    name: 'EL ISMAILIYA',
    flag: 'EGY',
  },
  {
    id: 'pan-almirante',
    name: 'ALMIRANTE',
    flag: 'PAN',
  },
  {
    id: 'pry-concepcion',
    name: 'CONCEPCION',
    flag: 'PRY',
  },
  {
    id: 'are-alhamriya',
    name: 'ALHAMRIYA',
    flag: 'ARE',
  },
  {
    id: 'prt-savageislands',
    name: 'SAVAGE ISLANDS',
    flag: 'PRT',
  },
  {
    id: 'lbn-tarabulus',
    name: 'TARABULUS',
    flag: 'LBN',
  },
  {
    id: 'vgb-jostvandyke',
    name: 'JOST VAN DYKE',
    flag: 'VGB',
  },
  {
    id: 'irl-kinsale',
    name: 'KINSALE',
    flag: 'IRL',
  },
  {
    id: 'brn-muaraharbor',
    name: 'MUARA HARBOR',
    flag: 'BRN',
  },
  {
    id: 'cze-cze-1',
    name: 'CZE-1',
    flag: 'CZE',
  },
  {
    id: 'bhs-stanielcay',
    name: 'STANIEL CAY',
    flag: 'BHS',
  },
  {
    id: 'srb-kladovo',
    name: 'KLADOVO',
    flag: 'SRB',
  },
  {
    id: 'twn-twn-57',
    name: 'TWN-57',
    flag: 'TWN',
  },
  {
    id: 'prt-madalena',
    name: 'MADALENA',
    flag: 'PRT',
  },
  {
    id: 'arg-puertonacional',
    name: 'PUERTO NACIONAL',
    flag: 'ARG',
  },
  {
    id: 'bhs-marshharbour',
    name: 'MARSH HARBOUR',
    flag: 'BHS',
  },
  {
    id: 'nga-calabar',
    name: 'CALABAR',
    flag: 'NGA',
  },
  {
    id: 'ven-amuay',
    name: 'AMUAY',
    flag: 'VEN',
  },
  {
    id: 'tha-phatthaya',
    name: 'PHATTHAYA',
    flag: 'THA',
  },
  {
    id: 'dza-merselkebir',
    name: 'MERS EL KEBIR',
    flag: 'DZA',
  },
  {
    id: 'cpv-viladesalrei',
    name: 'VILA DE SAL REI',
    flag: 'CPV',
  },
  {
    id: 'bhr-askar',
    name: 'ASKAR',
    flag: 'BHR',
  },
  {
    id: 'rou-corabia',
    name: 'CORABIA',
    flag: 'ROU',
  },
  {
    id: 'prt-barreiro',
    name: 'BARREIRO',
    flag: 'PRT',
  },
  {
    id: 'cod-kizombafpso',
    name: 'KIZOMBA FPSO',
    flag: 'COD',
  },
  {
    id: 'are-hamriyahlpg',
    name: 'HAMRIYAH LPG',
    flag: 'ARE',
  },
  {
    id: 'aze-absheron',
    name: 'ABSHERON',
    flag: 'AZE',
  },
  {
    id: 'gtm-puertobarrios',
    name: 'PUERTO BARRIOS',
    flag: 'GTM',
  },
  {
    id: 'ury-carmelo',
    name: 'CARMELO',
    flag: 'URY',
  },
  {
    id: 'aut-steyregg',
    name: 'STEYREGG',
    flag: 'AUT',
  },
  {
    id: 'cpv-tarrafal',
    name: 'TARRAFAL',
    flag: 'CPV',
  },
  {
    id: 'prt-olhao',
    name: 'OLHAO',
    flag: 'PRT',
  },
  {
    id: 'cuw-willemstad',
    name: 'WILLEMSTAD',
    flag: 'CUW',
  },
  {
    id: 'twn-peng-hukang',
    name: 'PENG-HU KANG',
    flag: 'TWN',
  },
  {
    id: 'srb-apatin',
    name: 'APATIN',
    flag: 'SRB',
  },
  {
    id: 'atg-codrington',
    name: 'CODRINGTON',
    flag: 'ATG',
  },
  {
    id: 'ala-lumparland',
    name: 'LUMPARLAND',
    flag: 'ALA',
  },
  {
    id: 'reu-saint-pierre',
    name: 'SAINT-PIERRE',
    flag: 'REU',
  },
  {
    id: 'tha-nakluea',
    name: 'NA KLUEA',
    flag: 'THA',
  },
  {
    id: 'chl-huasco',
    name: 'HUASCO',
    flag: 'CHL',
  },
  {
    id: 'irn-abadan',
    name: 'ABADAN',
    flag: 'IRN',
  },
  {
    id: 'prt-viladoconde',
    name: 'VILA DO CONDE',
    flag: 'PRT',
  },
  {
    id: 'syr-arwad',
    name: 'ARWAD',
    flag: 'SYR',
  },
  {
    id: 'stp-saotome',
    name: 'SAO TOME',
    flag: 'STP',
  },
  {
    id: 'cog-djeno',
    name: 'DJENO',
    flag: 'COG',
  },
  {
    id: 'isl-sudureyri',
    name: 'SUDUREYRI',
    flag: 'ISL',
  },
  {
    id: 'yem-alburayqah',
    name: 'AL BURAYQAH',
    flag: 'YEM',
  },
  {
    id: 'pyf-fare',
    name: 'FARE',
    flag: 'PYF',
  },
  {
    id: 'are-are-62',
    name: 'ARE-62',
    flag: 'ARE',
  },
  {
    id: 'pan-charcoazul',
    name: 'CHARCO AZUL',
    flag: 'PAN',
  },
  {
    id: 'brn-brn-20',
    name: 'BRN-20',
    flag: 'BRN',
  },
  {
    id: 'srb-backapalanka',
    name: 'BACKA PALANKA',
    flag: 'SRB',
  },
  {
    id: 'qat-ummsaid',
    name: 'UMM SAID',
    flag: 'QAT',
  },
  {
    id: 'sdn-alkhairoilterminal',
    name: 'AL KHAIR OIL TERMINAL',
    flag: 'SDN',
  },
  {
    id: 'png-orobay',
    name: 'ORO BAY',
    flag: 'PNG',
  },
  {
    id: 'pak-pak-17',
    name: 'PAK-17',
    flag: 'PAK',
  },
  {
    id: 'omn-shinas',
    name: 'SHINAS',
    flag: 'OMN',
  },
  {
    id: 'prt-saomartinhodoporto',
    name: 'SAO MARTINHO DO PORTO',
    flag: 'PRT',
  },
  {
    id: 'dma-roseau',
    name: 'ROSEAU',
    flag: 'DMA',
  },
  {
    id: 'twn-tainan',
    name: 'TAINAN',
    flag: 'TWN',
  },
  {
    id: 'are-kalbaanchorage',
    name: 'KALBA ANCHORAGE',
    flag: 'ARE',
  },
  {
    id: 'per-chimbote',
    name: 'CHIMBOTE',
    flag: 'PER',
  },
  {
    id: 'pol-portpolnochny',
    name: 'PORT POLNOCHNY',
    flag: 'POL',
  },
  {
    id: 'dma-portsmouth',
    name: 'PORTSMOUTH',
    flag: 'DMA',
  },
  {
    id: 'isl-isafjordur',
    name: 'ISAFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'vnm-haiphong',
    name: 'HAIPHONG',
    flag: 'VNM',
  },
  {
    id: 'gnq-malabo',
    name: 'MALABO',
    flag: 'GNQ',
  },
  {
    id: 'ury-paysandu',
    name: 'PAYSANDU',
    flag: 'URY',
  },
  {
    id: 'ven-maracaibo',
    name: 'MARACAIBO',
    flag: 'VEN',
  },
  {
    id: 'brn-championfield',
    name: 'CHAMPION FIELD',
    flag: 'BRN',
  },
  {
    id: 'hti-saint-marc',
    name: 'SAINT-MARC',
    flag: 'HTI',
  },
  {
    id: 'mlt-ghajnsielem',
    name: 'GHAJNSIELEM',
    flag: 'MLT',
  },
  {
    id: 'fro-midvagur',
    name: 'MIDVAGUR',
    flag: 'FRO',
  },
  {
    id: 'dza-mostaganem',
    name: 'MOSTAGANEM',
    flag: 'DZA',
  },
  {
    id: 'aze-qaradagh',
    name: 'QARADAGH',
    flag: 'AZE',
  },
  {
    id: 'are-are-89',
    name: 'ARE-89',
    flag: 'ARE',
  },
  {
    id: 'tha-songkhlaharbor',
    name: 'SONGKHLA HARBOR',
    flag: 'THA',
  },
  {
    id: 'pyf-uturoa',
    name: 'UTUROA',
    flag: 'PYF',
  },
  {
    id: 'egy-aliskandariyh(alexandria)',
    name: 'AL ISKANDARIYH (ALEXANDRIA)',
    flag: 'EGY',
  },
  {
    id: 'irn-deyr',
    name: 'DEYR',
    flag: 'IRN',
  },
  {
    id: 'bhr-manama',
    name: 'MANAMA',
    flag: 'BHR',
  },
  {
    id: 'arg-zonacomun',
    name: 'ZONA COMUN',
    flag: 'ARG',
  },
  {
    id: 'png-rabaul',
    name: 'RABAUL',
    flag: 'PNG',
  },
  {
    id: 'est-est-26',
    name: 'EST-26',
    flag: 'EST',
  },
  {
    id: 'are-ummshaif',
    name: 'UMM SHAIF',
    flag: 'ARE',
  },
  {
    id: 'glp-petitesanses',
    name: 'PETITES ANSES',
    flag: 'GLP',
  },
  {
    id: 'tun-portelkantaoui',
    name: 'PORT EL KANTAOUI',
    flag: 'TUN',
  },
  {
    id: 'spm-miquelon',
    name: 'MIQUELON',
    flag: 'SPM',
  },
  {
    id: 'prt-gafanhadaencarnacao',
    name: 'GAFANHA DA ENCARNACAO',
    flag: 'PRT',
  },
  {
    id: 'aze-alat',
    name: 'ALAT',
    flag: 'AZE',
  },
  {
    id: 'mmr-syriam',
    name: 'SYRIAM',
    flag: 'MMR',
  },
  {
    id: 'ago-kuitooilfield',
    name: 'KUITO OIL FIELD',
    flag: 'AGO',
  },
  {
    id: 'ecu-sanlorenzo',
    name: 'SAN LORENZO',
    flag: 'ECU',
  },
  {
    id: 'are-are-171',
    name: 'ARE-171',
    flag: 'ARE',
  },
  {
    id: 'chl-chl-1',
    name: 'CHL-1',
    flag: 'CHL',
  },
  {
    id: 'ecu-ecu-25',
    name: 'ECU-25',
    flag: 'ECU',
  },
  {
    id: 'lby-mersatobruq',
    name: 'MERSA TOBRUQ',
    flag: 'LBY',
  },
  {
    id: 'ven-lagunillas',
    name: 'LAGUNILLAS',
    flag: 'VEN',
  },
  {
    id: 'arg-rosario',
    name: 'ROSARIO',
    flag: 'ARG',
  },
  {
    id: 'bol-ptosuarezbolivia',
    name: 'PTO SUAREZ BOLIVIA',
    flag: 'BOL',
  },
  {
    id: 'bgr-bgr-40',
    name: 'BGR-40',
    flag: 'BGR',
  },
  {
    id: 'bhr-bhr-8',
    name: 'BHR-8',
    flag: 'BHR',
  },
  {
    id: 'twn-tamsuifishwharf',
    name: 'TAMSUI FISH WHARF',
    flag: 'TWN',
  },
  {
    id: 'rou-midia',
    name: 'MIDIA',
    flag: 'ROU',
  },
  {
    id: 'sjm-nyalesund',
    name: 'NY ALESUND',
    flag: 'SJM',
  },
  {
    id: 'hun-batya',
    name: 'BATYA',
    flag: 'HUN',
  },
  {
    id: 'fsm-colonia',
    name: 'COLONIA',
    flag: 'FSM',
  },
  {
    id: 'atg-parham',
    name: 'PARHAM',
    flag: 'ATG',
  },
  {
    id: 'qat-alshaheenterminal',
    name: 'AL SHAHEEN TERMINAL',
    flag: 'QAT',
  },
  {
    id: 'irl-carlingford',
    name: 'CARLINGFORD',
    flag: 'IRL',
  },
  {
    id: 'lva-riga',
    name: 'RIGA',
    flag: 'LVA',
  },
  {
    id: 'lva-ventspils',
    name: 'VENTSPILS',
    flag: 'LVA',
  },
  {
    id: 'prt-portimao',
    name: 'PORTIMAO',
    flag: 'PRT',
  },
  {
    id: 'twn-tainancity',
    name: 'TAINAN CITY',
    flag: 'TWN',
  },
  {
    id: 'chl-chl-10',
    name: 'CHL-10',
    flag: 'CHL',
  },
  {
    id: 'mus-portlouis',
    name: 'PORT LOUIS',
    flag: 'MUS',
  },
  {
    id: 'bhs-bakersbay',
    name: 'BAKERS BAY',
    flag: 'BHS',
  },
  {
    id: 'ecu-puertomaritimodeguayaquil',
    name: 'PUERTO MARITIMO DE GUAYAQUIL',
    flag: 'ECU',
  },
  {
    id: 'egy-northainsukhnaport',
    name: 'NORTH AIN SUKHNA PORT',
    flag: 'EGY',
  },
  {
    id: 'pry-nanawa',
    name: 'NANAWA',
    flag: 'PRY',
  },
  {
    id: 'rou-smardan',
    name: 'SMARDAN',
    flag: 'ROU',
  },
  {
    id: 'pol-jastarnia',
    name: 'JASTARNIA',
    flag: 'POL',
  },
  {
    id: 'jam-rockypoint',
    name: 'ROCKY POINT',
    flag: 'JAM',
  },
  {
    id: 'fro-fuglafjordur',
    name: 'FUGLAFJORDUR',
    flag: 'FRO',
  },
  {
    id: 'rou-rou-30',
    name: 'ROU-30',
    flag: 'ROU',
  },
  {
    id: 'tha-phrapradaeng',
    name: 'PHRA PRADAENG',
    flag: 'THA',
  },
  {
    id: 'bhs-hawksbillcay',
    name: 'HAWKSBILL CAY',
    flag: 'BHS',
  },
  {
    id: 'chl-valparaiso',
    name: 'VALPARAISO',
    flag: 'CHL',
  },
  {
    id: 'gab-oguendjoterminal',
    name: 'OGUENDJO TERMINAL',
    flag: 'GAB',
  },
  {
    id: 'bhs-bhs-2',
    name: 'BHS-2',
    flag: 'BHS',
  },
  {
    id: 'cod-block15',
    name: 'BLOCK 15',
    flag: 'COD',
  },
  {
    id: 'zaf-zaf-22',
    name: 'ZAF-22',
    flag: 'ZAF',
  },
  {
    id: 'ecu-manta',
    name: 'MANTA',
    flag: 'ECU',
  },
  {
    id: 'are-ummaldalkh',
    name: 'UMM ALDALKH',
    flag: 'ARE',
  },
  {
    id: 'col-santamarta',
    name: 'SANTA MARTA',
    flag: 'COL',
  },
  {
    id: 'col-puertobrisa',
    name: 'PUERTO BRISA',
    flag: 'COL',
  },
  {
    id: 'bhs-nassau',
    name: 'NASSAU',
    flag: 'BHS',
  },
  {
    id: 'vnm-vnm-72',
    name: 'VNM-72',
    flag: 'VNM',
  },
  {
    id: 'isl-djupivogur',
    name: 'DJUPIVOGUR',
    flag: 'ISL',
  },
  {
    id: 'pri-salinas',
    name: 'SALINAS',
    flag: 'PRI',
  },
  {
    id: 'aut-marbachanderdonau',
    name: 'MARBACH AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'pry-sanantonio',
    name: 'SAN ANTONIO',
    flag: 'PRY',
  },
  {
    id: 'qat-qat-29',
    name: 'QAT-29',
    flag: 'QAT',
  },
  {
    id: 'isl-hafnarfjordur',
    name: 'HAFNARFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'col-puertobolivar',
    name: 'PUERTO BOLIVAR',
    flag: 'COL',
  },
  {
    id: 'pri-arecibo',
    name: 'ARECIBO',
    flag: 'PRI',
  },
  {
    id: 'are-arzanahisland',
    name: 'ARZANAH ISLAND',
    flag: 'ARE',
  },
  {
    id: 'hun-mohacs',
    name: 'MOHACS',
    flag: 'HUN',
  },
  {
    id: 'egy-rasabuzanimah',
    name: 'RAS ABU ZANIMAH',
    flag: 'EGY',
  },
  {
    id: 'vut-portvila',
    name: 'PORT VILA',
    flag: 'VUT',
  },
  {
    id: 'prt-sines',
    name: 'SINES',
    flag: 'PRT',
  },
  {
    id: 'fro-vestmanna',
    name: 'VESTMANNA',
    flag: 'FRO',
  },
  {
    id: 'ecu-ecu-15',
    name: 'ECU-15',
    flag: 'ECU',
  },
  {
    id: 'lka-negombo',
    name: 'NEGOMBO',
    flag: 'LKA',
  },
  {
    id: 'chl-chl-46',
    name: 'CHL-46',
    flag: 'CHL',
  },
  {
    id: 'hun-nyergesujfalu',
    name: 'NYERGESUJFALU',
    flag: 'HUN',
  },
  {
    id: 'grl-qasigiannguit-christianshab',
    name: 'QASIGIANNGUIT-CHRISTIANSHAB',
    flag: 'GRL',
  },
  {
    id: 'nga-escravosgas',
    name: 'ESCRAVOS GAS',
    flag: 'NGA',
  },
  {
    id: 'col-col-43',
    name: 'COL-43',
    flag: 'COL',
  },
  {
    id: 'rou-tulcea',
    name: 'TULCEA',
    flag: 'ROU',
  },
  {
    id: 'twn-keelung',
    name: 'KEELUNG',
    flag: 'TWN',
  },
  {
    id: 'vir-limetreebay',
    name: 'LIMETREE BAY',
    flag: 'VIR',
  },
  {
    id: 'tun-monastir',
    name: 'MONASTIR',
    flag: 'TUN',
  },
  {
    id: 'col-col-8',
    name: 'COL-8',
    flag: 'COL',
  },
  {
    id: 'dza-djen-djen',
    name: 'DJEN-DJEN',
    flag: 'DZA',
  },
  {
    id: 'omn-duqm',
    name: 'DUQM',
    flag: 'OMN',
  },
  {
    id: 'bes-bes-5',
    name: 'BES-5',
    flag: 'BES',
  },
  {
    id: 'png-kaviengharbor',
    name: 'KAVIENG HARBOR',
    flag: 'PNG',
  },
  {
    id: 'arg-campana',
    name: 'CAMPANA',
    flag: 'ARG',
  },
  {
    id: 'irl-killybegs',
    name: 'KILLYBEGS',
    flag: 'IRL',
  },
  {
    id: 'pri-lamboglia',
    name: 'LAMBOGLIA',
    flag: 'PRI',
  },
  {
    id: 'egy-idku',
    name: 'IDKU',
    flag: 'EGY',
  },
  {
    id: 'dom-lassalinas',
    name: 'LAS SALINAS',
    flag: 'DOM',
  },
  {
    id: 'prt-cascais',
    name: 'CASCAIS',
    flag: 'PRT',
  },
  {
    id: 'bgr-bgr-10',
    name: 'BGR-10',
    flag: 'BGR',
  },
  {
    id: 'tha-siracha',
    name: 'SI RACHA',
    flag: 'THA',
  },
  {
    id: 'hkg-ngongping',
    name: 'NGONG PING',
    flag: 'HKG',
  },
  {
    id: 'mne-herceg-novi',
    name: 'HERCEG-NOVI',
    flag: 'MNE',
  },
  {
    id: 'dom-ocoabay',
    name: 'OCOA BAY',
    flag: 'DOM',
  },
  {
    id: 'egy-egy-46',
    name: 'EGY-46',
    flag: 'EGY',
  },
  {
    id: 'prt-funchal',
    name: 'FUNCHAL',
    flag: 'PRT',
  },
  {
    id: 'fji-fji-11',
    name: 'FJI-11',
    flag: 'FJI',
  },
  {
    id: 'hun-budapestxi.kerulet',
    name: 'BUDAPEST XI. KERULET',
    flag: 'HUN',
  },
  {
    id: 'isl-drangsnes',
    name: 'DRANGSNES',
    flag: 'ISL',
  },
  {
    id: 'srb-srb-18',
    name: 'SRB-18',
    flag: 'SRB',
  },
  {
    id: 'nam-luderitzbay',
    name: 'LUDERITZ BAY',
    flag: 'NAM',
  },
  {
    id: 'qat-arruways',
    name: 'AR RUWAYS',
    flag: 'QAT',
  },
  {
    id: 'cmr-limbe',
    name: 'LIMBE',
    flag: 'CMR',
  },
  {
    id: 'gtm-santothomasdecastilla',
    name: 'SANTO THOMAS DE CASTILLA',
    flag: 'GTM',
  },
  {
    id: 'cpv-portogrande',
    name: 'PORTO GRANDE',
    flag: 'CPV',
  },
  {
    id: 'com-mutsamudu',
    name: 'MUTSAMUDU',
    flag: 'COM',
  },
  {
    id: 'atg-stjohns',
    name: 'ST JOHNS',
    flag: 'ATG',
  },
  {
    id: 'tto-brighton',
    name: 'BRIGHTON',
    flag: 'TTO',
  },
  {
    id: 'fji-lautoka',
    name: 'LAUTOKA',
    flag: 'FJI',
  },
  {
    id: 'fro-nolsoy',
    name: 'NOLSOY',
    flag: 'FRO',
  },
  {
    id: 'chl-puertowilliams',
    name: 'PUERTO WILLIAMS',
    flag: 'CHL',
  },
  {
    id: 'cri-caldera',
    name: 'CALDERA',
    flag: 'CRI',
  },
  {
    id: 'cmr-cmr-2',
    name: 'CMR-2',
    flag: 'CMR',
  },
  {
    id: 'irn-fereydunkenar',
    name: 'FEREYDUNKENAR',
    flag: 'IRN',
  },
  {
    id: 'som-muqdisho',
    name: 'MUQDISHO',
    flag: 'SOM',
  },
  {
    id: 'irn-bandarabbas',
    name: 'BANDAR ABBAS',
    flag: 'IRN',
  },
  {
    id: 'rou-rou-26',
    name: 'ROU-26',
    flag: 'ROU',
  },
  {
    id: 'mdv-kulhudhuffushi',
    name: 'KULHUDHUFFUSHI',
    flag: 'MDV',
  },
  {
    id: 'sur-paramaribo',
    name: 'PARAMARIBO',
    flag: 'SUR',
  },
  {
    id: 'omn-portofsohar',
    name: 'PORT OF SOHAR',
    flag: 'OMN',
  },
  {
    id: 'egy-elhamraoilterminal',
    name: 'EL HAMRA OIL TERMINAL',
    flag: 'EGY',
  },
  {
    id: 'cri-golfito',
    name: 'GOLFITO',
    flag: 'CRI',
  },
  {
    id: 'lka-trincomaleeharbor',
    name: 'TRINCOMALEE HARBOR',
    flag: 'LKA',
  },
  {
    id: 'col-col-31',
    name: 'COL-31',
    flag: 'COL',
  },
  {
    id: 'lby-alburayqah',
    name: 'AL BURAYQAH',
    flag: 'LBY',
  },
  {
    id: 'bhs-guncay',
    name: 'GUN CAY',
    flag: 'BHS',
  },
  {
    id: 'plw-malakalharbor',
    name: 'MALAKAL HARBOR',
    flag: 'PLW',
  },
  {
    id: 'com-moroni',
    name: 'MORONI',
    flag: 'COM',
  },
  {
    id: 'pyf-fakaravaatoll',
    name: 'FAKARAVA ATOLL',
    flag: 'PYF',
  },
  {
    id: 'pan-bocasdeltoro',
    name: 'BOCAS DEL TORO',
    flag: 'PAN',
  },
  {
    id: 'irl-bereisland',
    name: 'BERE ISLAND',
    flag: 'IRL',
  },
  {
    id: 'lby-darnah',
    name: 'DARNAH',
    flag: 'LBY',
  },
  {
    id: 'mnp-saipan',
    name: 'SAIPAN',
    flag: 'MNP',
  },
  {
    id: 'aze-aze-22',
    name: 'AZE-22',
    flag: 'AZE',
  },
  {
    id: 'egy-egy-24',
    name: 'EGY-24',
    flag: 'EGY',
  },
  {
    id: 'fro-hoyvik',
    name: 'HOYVIK',
    flag: 'FRO',
  },
  {
    id: 'ton-pangai',
    name: 'PANGAI',
    flag: 'TON',
  },
  {
    id: 'are-alraafah',
    name: 'AL RAAFAH',
    flag: 'ARE',
  },
  {
    id: 'aze-aze-18',
    name: 'AZE-18',
    flag: 'AZE',
  },
  {
    id: 'chl-radadearica',
    name: 'RADA DE ARICA',
    flag: 'CHL',
  },
  {
    id: 'cpv-espargos',
    name: 'ESPARGOS',
    flag: 'CPV',
  },
  {
    id: 'irl-clogherhead',
    name: 'CLOGHERHEAD',
    flag: 'IRL',
  },
  {
    id: 'cmr-bombemgue',
    name: 'BOMBEMGUE',
    flag: 'CMR',
  },
  {
    id: 'ata-discoverybay',
    name: 'DISCOVERY BAY',
    flag: 'ATA',
  },
  {
    id: 'vnm-vinhcamranh',
    name: 'VINH CAM RANH',
    flag: 'VNM',
  },
  {
    id: 'syc-victoria',
    name: 'VICTORIA',
    flag: 'SYC',
  },
  {
    id: 'chl-quemchi',
    name: 'QUEMCHI',
    flag: 'CHL',
  },
  {
    id: 'chl-chl-32',
    name: 'CHL-32',
    flag: 'CHL',
  },
  {
    id: 'cod-congoriver',
    name: 'CONGO RIVER',
    flag: 'COD',
  },
  {
    id: 'ecu-douglas',
    name: 'DOUGLAS',
    flag: 'ECU',
  },
  {
    id: 'tun-menzelbourguiba',
    name: 'MENZEL BOURGUIBA',
    flag: 'TUN',
  },
  {
    id: 'are-portrashid',
    name: 'PORT RASHID',
    flag: 'ARE',
  },
  {
    id: 'dza-jijel',
    name: 'JIJEL',
    flag: 'DZA',
  },
  {
    id: 'lbn-sidon/zahraniterminal',
    name: 'SIDON/ZAHRANI TERMINAL',
    flag: 'LBN',
  },
  {
    id: 'jam-ochorios',
    name: 'OCHO RIOS',
    flag: 'JAM',
  },
  {
    id: 'irl-aghada',
    name: 'AGHADA',
    flag: 'IRL',
  },
  {
    id: 'irn-bandartaherioffshoreterminal',
    name: 'BANDAR TAHERI OFFSHORE TERMINAL',
    flag: 'IRN',
  },
  {
    id: "yem-alma'alla'",
    name: "AL MA'ALLA'",
    flag: 'YEM',
  },
  {
    id: 'irn-khargislandoilterminal',
    name: 'KHARG ISLAND OIL TERMINAL',
    flag: 'IRN',
  },
  {
    id: 'vnm-anduong',
    name: 'AN DUONG',
    flag: 'VNM',
  },
  {
    id: 'cri-puertoquepos',
    name: 'PUERTO QUEPOS',
    flag: 'CRI',
  },
  {
    id: 'mdg-andoany',
    name: 'ANDOANY',
    flag: 'MDG',
  },
  {
    id: 'jam-portkaiser',
    name: 'PORT KAISER',
    flag: 'JAM',
  },
  {
    id: 'cri-cri-4',
    name: 'CRI-4',
    flag: 'CRI',
  },
  {
    id: 'pol-stepnica',
    name: 'STEPNICA',
    flag: 'POL',
  },
  {
    id: 'isr-telaviv',
    name: 'TEL AVIV',
    flag: 'ISR',
  },
  {
    id: 'chl-chl-88',
    name: 'CHL-88',
    flag: 'CHL',
  },
  {
    id: "grd-saintdavid's",
    name: "SAINT DAVID'S",
    flag: 'GRD',
  },
  {
    id: 'ala-kokar',
    name: 'KOKAR',
    flag: 'ALA',
  },
  {
    id: 'vir-charlotteamalie',
    name: 'CHARLOTTE AMALIE',
    flag: 'VIR',
  },
  {
    id: 'bmu-hamilton',
    name: 'HAMILTON',
    flag: 'BMU',
  },
  {
    id: 'dma-dma-4',
    name: 'DMA-4',
    flag: 'DMA',
  },
  {
    id: 'mar-dakhla',
    name: 'DAKHLA',
    flag: 'MAR',
  },
  {
    id: 'ala-kokarkyrkoby',
    name: 'KOKAR KYRKOBY',
    flag: 'ALA',
  },
  {
    id: 'lbr-buchanan',
    name: 'BUCHANAN',
    flag: 'LBR',
  },
  {
    id: 'prt-calheta',
    name: 'CALHETA',
    flag: 'PRT',
  },
  {
    id: 'pol-widuchowa',
    name: 'WIDUCHOWA',
    flag: 'POL',
  },
  {
    id: 'rou-rou-87',
    name: 'ROU-87',
    flag: 'ROU',
  },
  {
    id: 'chl-terminalotway',
    name: 'TERMINAL OTWAY',
    flag: 'CHL',
  },
  {
    id: 'hun-ivancsa',
    name: 'IVANCSA',
    flag: 'HUN',
  },
  {
    id: 'bgr-bgr-38',
    name: 'BGR-38',
    flag: 'BGR',
  },
  {
    id: 'hun-budapest',
    name: 'BUDAPEST',
    flag: 'HUN',
  },
  {
    id: 'srb-srb-34',
    name: 'SRB-34',
    flag: 'SRB',
  },
  {
    id: 'glp-sainte-anne',
    name: 'SAINTE-ANNE',
    flag: 'GLP',
  },
  {
    id: 'hun-madocsa',
    name: 'MADOCSA',
    flag: 'HUN',
  },
  {
    id: 'ven-bahiadepertigalete',
    name: 'BAHIA DE PERTIGALETE',
    flag: 'VEN',
  },
  {
    id: 'sgp-singapore',
    name: 'SINGAPORE',
    flag: 'SGP',
  },
  {
    id: 'geo-supsa',
    name: 'SUPSA',
    flag: 'GEO',
  },
  {
    id: 'prt-viladoporto',
    name: 'VILA DO PORTO',
    flag: 'PRT',
  },
  {
    id: 'are-fujairah',
    name: 'FUJAIRAH',
    flag: 'ARE',
  },
  {
    id: 'tha-phrakhanong',
    name: 'PHRA KHANONG',
    flag: 'THA',
  },
  {
    id: 'cmr-cmr-11',
    name: 'CMR-11',
    flag: 'CMR',
  },
  {
    id: 'are-rasal-khaimah',
    name: 'RAS AL-KHAIMAH',
    flag: 'ARE',
  },
  {
    id: 'col-col-44',
    name: 'COL-44',
    flag: 'COL',
  },
  {
    id: 'prt-saoroquedopico',
    name: 'SAO ROQUE DO PICO',
    flag: 'PRT',
  },
  {
    id: 'rou-agigea',
    name: 'AGIGEA',
    flag: 'ROU',
  },
  {
    id: 'bhs-manofwarcay',
    name: 'MAN OF WAR CAY',
    flag: 'BHS',
  },
  {
    id: 'tha-tha-49',
    name: 'THA-49',
    flag: 'THA',
  },
  {
    id: 'png-alotau',
    name: 'ALOTAU',
    flag: 'PNG',
  },
  {
    id: 'jam-montegobay',
    name: 'MONTEGO BAY',
    flag: 'JAM',
  },
  {
    id: 'bhs-georgetown',
    name: 'GEORGE TOWN',
    flag: 'BHS',
  },
  {
    id: 'arg-santafe',
    name: 'SANTA FE',
    flag: 'ARG',
  },
  {
    id: 'jor-talabay',
    name: 'TALA BAY',
    flag: 'JOR',
  },
  {
    id: 'pol-police',
    name: 'POLICE',
    flag: 'POL',
  },
  {
    id: 'cyp-dhekelia',
    name: 'DHEKELIA',
    flag: 'CYP',
  },
  {
    id: 'ecu-ecu-18',
    name: 'ECU-18',
    flag: 'ECU',
  },
  {
    id: 'fro-glyvrar',
    name: 'GLYVRAR',
    flag: 'FRO',
  },
  {
    id: 'isl-thorlakshofn',
    name: 'THORLAKSHOFN',
    flag: 'ISL',
  },
  {
    id: 'prt-ferragudo',
    name: 'FERRAGUDO',
    flag: 'PRT',
  },
  {
    id: 'pol-mrzezyno',
    name: 'MRZEZYNO',
    flag: 'POL',
  },
  {
    id: 'bhs-bhs-29',
    name: 'BHS-29',
    flag: 'BHS',
  },
  {
    id: 'aze-sangachal',
    name: 'SANGACHAL',
    flag: 'AZE',
  },
  {
    id: 'col-col-47',
    name: 'COL-47',
    flag: 'COL',
  },
  {
    id: 'chl-coronel',
    name: 'CORONEL',
    flag: 'CHL',
  },
  {
    id: 'sur-sur-5',
    name: 'SUR-5',
    flag: 'SUR',
  },
  {
    id: 'egy-sidikerir',
    name: 'SIDI KERIR',
    flag: 'EGY',
  },
  {
    id: 'gnq-luba',
    name: 'LUBA',
    flag: 'GNQ',
  },
  {
    id: 'bhs-bhs-49',
    name: 'BHS-49',
    flag: 'BHS',
  },
  {
    id: 'per-cerroazul',
    name: 'CERRO AZUL',
    flag: 'PER',
  },
  {
    id: 'gmb-banjul',
    name: 'BANJUL',
    flag: 'GMB',
  },
  {
    id: 'cmr-offshoreterminal',
    name: 'OFFSHORE TERMINAL',
    flag: 'CMR',
  },
  {
    id: 'irq-al-basraoilterminal',
    name: 'AL-BASRA OIL TERMINAL',
    flag: 'IRQ',
  },
  {
    id: 'mtq-lestrois-ilets',
    name: 'LES TROIS-ILETS',
    flag: 'MTQ',
  },
  {
    id: 'prt-portomoniz',
    name: 'PORTO MONIZ',
    flag: 'PRT',
  },
  {
    id: 'fji-robinsoncrusoeisland',
    name: 'ROBINSON CRUSOE ISLAND',
    flag: 'FJI',
  },
  {
    id: 'cym-georgetown',
    name: 'GEORGE TOWN',
    flag: 'CYM',
  },
  {
    id: 'pan-panamacanal',
    name: 'PANAMA CANAL',
    flag: 'PAN',
  },
  {
    id: 'arg-ushuaia',
    name: 'USHUAIA',
    flag: 'ARG',
  },
  {
    id: 'irl-kilrush',
    name: 'KILRUSH',
    flag: 'IRL',
  },
  {
    id: 'vnm-quanbay',
    name: 'QUAN BAY',
    flag: 'VNM',
  },
  {
    id: 'bhs-inaguaislands',
    name: 'INAGUA ISLANDS',
    flag: 'BHS',
  },
  {
    id: 'vnm-nhabe',
    name: 'NHA BE',
    flag: 'VNM',
  },
  {
    id: 'chl-chl-107',
    name: 'CHL-107',
    flag: 'CHL',
  },
  {
    id: 'hun-labatlan',
    name: 'LABATLAN',
    flag: 'HUN',
  },
  {
    id: 'tto-pointlisasport',
    name: 'POINT LISAS PORT',
    flag: 'TTO',
  },
  {
    id: 'gib-gibraltar',
    name: 'GIBRALTAR',
    flag: 'GIB',
  },
  {
    id: 'pri-mayaguez',
    name: 'MAYAGUEZ',
    flag: 'PRI',
  },
  {
    id: 'are-are-145',
    name: 'ARE-145',
    flag: 'ARE',
  },
  {
    id: 'vnm-vnm-52',
    name: 'VNM-52',
    flag: 'VNM',
  },
  {
    id: 'are-are-136',
    name: 'ARE-136',
    flag: 'ARE',
  },
  {
    id: 'ecu-ecu-17',
    name: 'ECU-17',
    flag: 'ECU',
  },
  {
    id: 'gab-caplopez',
    name: 'CAP LOPEZ',
    flag: 'GAB',
  },
  {
    id: 'chl-puertolagunas',
    name: 'PUERTO LAGUNAS',
    flag: 'CHL',
  },
  {
    id: 'bhs-bhs-48',
    name: 'BHS-48',
    flag: 'BHS',
  },
  {
    id: 'bhs-bhs-60',
    name: 'BHS-60',
    flag: 'BHS',
  },
  {
    id: 'are-barakah',
    name: 'BARAKAH',
    flag: 'ARE',
  },
  {
    id: 'glp-saint-francois',
    name: 'SAINT-FRANCOIS',
    flag: 'GLP',
  },
  {
    id: 'hun-budapestxxi.kerulet',
    name: 'BUDAPEST XXI. KERULET',
    flag: 'HUN',
  },
  {
    id: 'arg-ensenada',
    name: 'ENSENADA',
    flag: 'ARG',
  },
  {
    id: 'tha-saladan',
    name: 'SALADAN',
    flag: 'THA',
  },
  {
    id: 'hun-dunavecse',
    name: 'DUNAVECSE',
    flag: 'HUN',
  },
  {
    id: 'twn-twn-38',
    name: 'TWN-38',
    flag: 'TWN',
  },
  {
    id: 'omn-duqum',
    name: 'DUQUM',
    flag: 'OMN',
  },
  {
    id: 'twn-taichungcity',
    name: 'TAICHUNG CITY',
    flag: 'TWN',
  },
  {
    id: 'fro-kollafjordur',
    name: 'KOLLAFJORDUR',
    flag: 'FRO',
  },
  {
    id: 'arg-camarones',
    name: 'CAMARONES',
    flag: 'ARG',
  },
  {
    id: 'col-col-12',
    name: 'COL-12',
    flag: 'COL',
  },
  {
    id: 'glp-gustavia',
    name: 'GUSTAVIA',
    flag: 'GLP',
  },
  {
    id: 'chl-talcahuano',
    name: 'TALCAHUANO',
    flag: 'CHL',
  },
  {
    id: 'arg-puertoingenierowhite',
    name: 'PUERTO INGENIERO WHITE',
    flag: 'ARG',
  },
  {
    id: 'isl-raufarhofn',
    name: 'RAUFARHOFN',
    flag: 'ISL',
  },
  {
    id: 'prt-castelodepaiva',
    name: 'CASTELO DE PAIVA',
    flag: 'PRT',
  },
  {
    id: 'pyf-pirae',
    name: 'PIRAE',
    flag: 'PYF',
  },
  {
    id: 'yem-alahmadi',
    name: 'AL AHMADI',
    flag: 'YEM',
  },
  {
    id: 'are-are-204',
    name: 'ARE-204',
    flag: 'ARE',
  },
  {
    id: 'chl-bahiaherraduraguayacan',
    name: 'BAHIA HERRADURA GUAYACAN',
    flag: 'CHL',
  },
  {
    id: 'png-madang',
    name: 'MADANG',
    flag: 'PNG',
  },
  {
    id: 'pol-dziwnow',
    name: 'DZIWNOW',
    flag: 'POL',
  },
  {
    id: 'are-are-185',
    name: 'ARE-185',
    flag: 'ARE',
  },
  {
    id: 'dza-tenes',
    name: 'TENES',
    flag: 'DZA',
  },
  {
    id: 'mus-grandbaie',
    name: 'GRAND BAIE',
    flag: 'MUS',
  },
  {
    id: 'lbr-greenville',
    name: 'GREENVILLE',
    flag: 'LBR',
  },
  {
    id: 'srb-novibeograd',
    name: 'NOVI BEOGRAD',
    flag: 'SRB',
  },
  {
    id: 'egy-bursaid(portsaid)',
    name: 'BUR SAID (PORT SAID)',
    flag: 'EGY',
  },
  {
    id: 'hun-dunaujvaros',
    name: 'DUNAUJVAROS',
    flag: 'HUN',
  },
  {
    id: 'col-turbo',
    name: 'TURBO',
    flag: 'COL',
  },
  {
    id: 'irn-bandar-eganaveh',
    name: 'BANDAR-E GANAVEH',
    flag: 'IRN',
  },
  {
    id: 'lva-salacgriva',
    name: 'SALACGRIVA',
    flag: 'LVA',
  },
  {
    id: 'rou-garcov',
    name: 'GARCOV',
    flag: 'ROU',
  },
  {
    id: 'brb-bridgetown',
    name: 'BRIDGETOWN',
    flag: 'BRB',
  },
  {
    id: 'arg-berisso',
    name: 'BERISSO',
    flag: 'ARG',
  },
  {
    id: 'cok-cok-4',
    name: 'COK-4',
    flag: 'COK',
  },
  {
    id: 'chl-chl-50',
    name: 'CHL-50',
    flag: 'CHL',
  },
  {
    id: 'omn-qalhatlngterminal',
    name: 'QALHAT LNG TERMINAL',
    flag: 'OMN',
  },
  {
    id: 'prt-aguadepena',
    name: 'AGUA DE PENA',
    flag: 'PRT',
  },
  {
    id: 'rou-seimeni',
    name: 'SEIMENI',
    flag: 'ROU',
  },
  {
    id: 'nga-okrika',
    name: 'OKRIKA',
    flag: 'NGA',
  },
  {
    id: 'bgr-oryahovo',
    name: 'ORYAHOVO',
    flag: 'BGR',
  },
  {
    id: 'pyf-vaitape',
    name: 'VAITAPE',
    flag: 'PYF',
  },
  {
    id: 'prt-portodeleixoes',
    name: 'PORTO DE LEIXOES',
    flag: 'PRT',
  },
  {
    id: 'sle-sherbroriver',
    name: 'SHERBRO RIVER',
    flag: 'SLE',
  },
  {
    id: 'prt-carcavelos',
    name: 'CARCAVELOS',
    flag: 'PRT',
  },
  {
    id: 'per-talara',
    name: 'TALARA',
    flag: 'PER',
  },
  {
    id: 'rou-mahmudia',
    name: 'MAHMUDIA',
    flag: 'ROU',
  },
  {
    id: 'alb-konispol',
    name: 'KONISPOL',
    flag: 'ALB',
  },
  {
    id: 'jam-discoverybay',
    name: 'DISCOVERY BAY',
    flag: 'JAM',
  },
  {
    id: 'vir-vir-19',
    name: 'VIR-19',
    flag: 'VIR',
  },
  {
    id: 'isr-ashdod',
    name: 'ASHDOD',
    flag: 'ISR',
  },
  {
    id: 'ala-sund',
    name: 'SUND',
    flag: 'ALA',
  },
  {
    id: 'slb-slb-16',
    name: 'SLB-16',
    flag: 'SLB',
  },
  {
    id: 'mdg-mdg-5',
    name: 'MDG-5',
    flag: 'MDG',
  },
  {
    id: 'bhs-chubcay',
    name: 'CHUB CAY',
    flag: 'BHS',
  },
  {
    id: 'mlt-mgarr',
    name: 'MGARR',
    flag: 'MLT',
  },
  {
    id: 'hun-budapestiv.kerulet',
    name: 'BUDAPEST IV. KERULET',
    flag: 'HUN',
  },
  {
    id: 'per-chicama',
    name: 'CHICAMA',
    flag: 'PER',
  },
  {
    id: 'wlf-mata-utu',
    name: 'MATA-UTU',
    flag: 'WLF',
  },
  {
    id: 'prt-ilhasdesertas',
    name: 'ILHAS DESERTAS',
    flag: 'PRT',
  },
  {
    id: 'mdg-toliara',
    name: 'TOLIARA',
    flag: 'MDG',
  },
  {
    id: 'nga-oduduterminal',
    name: 'ODUDU TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'aut-kremsanderdonau',
    name: 'KREMS AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'rou-maliuc',
    name: 'MALIUC',
    flag: 'ROU',
  },
  {
    id: 'egy-egy-23',
    name: 'EGY-23',
    flag: 'EGY',
  },
  {
    id: 'brb-brb-4',
    name: 'BRB-4',
    flag: 'BRB',
  },
  {
    id: 'gnb-bissau',
    name: 'BISSAU',
    flag: 'GNB',
  },
  {
    id: 'irq-albasrah',
    name: 'AL BASRAH',
    flag: 'IRQ',
  },
  {
    id: 'dom-bocachica',
    name: 'BOCA CHICA',
    flag: 'DOM',
  },
  {
    id: 'isl-vopnafjordhur',
    name: 'VOPNAFJORDHUR',
    flag: 'ISL',
  },
  {
    id: 'tha-siamseaport',
    name: 'SIAM SEAPORT',
    flag: 'THA',
  },
  {
    id: 'are-are-39',
    name: 'ARE-39',
    flag: 'ARE',
  },
  {
    id: 'prt-faro',
    name: 'FARO',
    flag: 'PRT',
  },
  {
    id: 'irl-dalkey',
    name: 'DALKEY',
    flag: 'IRL',
  },
  {
    id: 'tha-banchalong',
    name: 'BAN CHALONG',
    flag: 'THA',
  },
  {
    id: 'cog-yomboterminal',
    name: 'YOMBO TERMINAL',
    flag: 'COG',
  },
  {
    id: 'are-are-186',
    name: 'ARE-186',
    flag: 'ARE',
  },
  {
    id: 'chl-dalcahue',
    name: 'DALCAHUE',
    flag: 'CHL',
  },
  {
    id: 'pan-lascumbres',
    name: 'LAS CUMBRES',
    flag: 'PAN',
  },
  {
    id: 'are-buhaseerfield',
    name: 'BU HASEER FIELD',
    flag: 'ARE',
  },
  {
    id: 'hun-budapesti.kerulet',
    name: 'BUDAPEST I. KERULET',
    flag: 'HUN',
  },
  {
    id: 'twn-gengfang',
    name: 'GENGFANG',
    flag: 'TWN',
  },
  {
    id: 'atg-falmouth',
    name: 'FALMOUTH',
    flag: 'ATG',
  },
  {
    id: 'irn-nowshahr',
    name: 'NOWSHAHR',
    flag: 'IRN',
  },
  {
    id: 'fro-strendur',
    name: 'STRENDUR',
    flag: 'FRO',
  },
  {
    id: 'egy-egy-38',
    name: 'EGY-38',
    flag: 'EGY',
  },
  {
    id: 'irl-drogheda',
    name: 'DROGHEDA',
    flag: 'IRL',
  },
  {
    id: 'bhr-sitrah',
    name: 'SITRAH',
    flag: 'BHR',
  },
  {
    id: 'ecu-ecu-45',
    name: 'ECU-45',
    flag: 'ECU',
  },
  {
    id: 'geo-poti',
    name: 'POTI',
    flag: 'GEO',
  },
  {
    id: 'chl-chl-52',
    name: 'CHL-52',
    flag: 'CHL',
  },
  {
    id: 'fro-eidi',
    name: 'EIDI',
    flag: 'FRO',
  },
  {
    id: 'dji-djibouti',
    name: 'DJIBOUTI',
    flag: 'DJI',
  },
  {
    id: 'bgr-bgr-7',
    name: 'BGR-7',
    flag: 'BGR',
  },
  {
    id: 'bhs-bhs-40',
    name: 'BHS-40',
    flag: 'BHS',
  },
  {
    id: 'isl-akureyri',
    name: 'AKUREYRI',
    flag: 'ISL',
  },
  {
    id: 'pri-tallaboa',
    name: 'TALLABOA',
    flag: 'PRI',
  },
  {
    id: 'egy-portsaid',
    name: 'PORT SAID',
    flag: 'EGY',
  },
  {
    id: 'dom-dom-7',
    name: 'DOM-7',
    flag: 'DOM',
  },
  {
    id: 'are-are-85',
    name: 'ARE-85',
    flag: 'ARE',
  },
  {
    id: 'lca-laborie',
    name: 'LABORIE',
    flag: 'LCA',
  },
  {
    id: 'hun-budapestxxii.kerulet',
    name: 'BUDAPEST XXII. KERULET',
    flag: 'HUN',
  },
  {
    id: 'cyp-kyrenia',
    name: 'KYRENIA',
    flag: 'CYP',
  },
  {
    id: 'nga-penningtonoilterminal',
    name: 'PENNINGTON OIL TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'civ-sanpedro',
    name: 'SAN PEDRO',
    flag: 'CIV',
  },
  {
    id: 'dma-saintjoseph',
    name: 'SAINT JOSEPH',
    flag: 'DMA',
  },
  {
    id: 'pry-villaelisa',
    name: 'VILLA ELISA',
    flag: 'PRY',
  },
  {
    id: 'chl-puertochanaral',
    name: 'PUERTO CHANARAL',
    flag: 'CHL',
  },
  {
    id: 'cyp-kalecik',
    name: 'KALECIK',
    flag: 'CYP',
  },
  {
    id: 'sur-paranam',
    name: 'PARANAM',
    flag: 'SUR',
  },
  {
    id: 'rou-isaccea',
    name: 'ISACCEA',
    flag: 'ROU',
  },
  {
    id: 'chl-caletapatillos',
    name: 'CALETA PATILLOS',
    flag: 'CHL',
  },
  {
    id: 'chl-chl-69',
    name: 'CHL-69',
    flag: 'CHL',
  },
  {
    id: 'tun-banzart',
    name: 'BANZART',
    flag: 'TUN',
  },
  {
    id: 'arg-diamante',
    name: 'DIAMANTE',
    flag: 'ARG',
  },
  {
    id: 'guf-saint-laurent-du-maroni',
    name: 'SAINT-LAURENT-DU-MARONI',
    flag: 'GUF',
  },
  {
    id: 'mco-saint-roman',
    name: 'SAINT-ROMAN',
    flag: 'MCO',
  },
  {
    id: 'est-syare',
    name: 'SYARE',
    flag: 'EST',
  },
  {
    id: 'tha-kolanta',
    name: 'KO LANTA',
    flag: 'THA',
  },
  {
    id: 'sle-pepel',
    name: 'PEPEL',
    flag: 'SLE',
  },
  {
    id: 'hun-esztergom',
    name: 'ESZTERGOM',
    flag: 'HUN',
  },
  {
    id: 'sjm-bjornoya',
    name: 'BJORNOYA',
    flag: 'SJM',
  },
  {
    id: 'are-umaldalakh',
    name: 'UM AL DALAKH',
    flag: 'ARE',
  },
  {
    id: 'kwt-almahbulah',
    name: 'AL MAHBULAH',
    flag: 'KWT',
  },
  {
    id: 'pol-kolobrzeg',
    name: 'KOLOBRZEG',
    flag: 'POL',
  },
  {
    id: 'prt-velas',
    name: 'VELAS',
    flag: 'PRT',
  },
  {
    id: 'ven-lecherias',
    name: 'LECHERIAS',
    flag: 'VEN',
  },
  {
    id: 'vnm-thanhhochiminh',
    name: 'THANH HO CHI MINH',
    flag: 'VNM',
  },
  {
    id: 'ven-cumana(puertosucre)',
    name: 'CUMANA (PUERTO SUCRE)',
    flag: 'VEN',
  },
  {
    id: 'twn-shenao',
    name: 'SHEN AO',
    flag: 'TWN',
  },
  {
    id: 'tza-mtwara',
    name: 'MTWARA',
    flag: 'TZA',
  },
  {
    id: 'bhs-bhs-26',
    name: 'BHS-26',
    flag: 'BHS',
  },
  {
    id: 'reu-portouest',
    name: 'PORT OUEST',
    flag: 'REU',
  },
  {
    id: 'fji-lautokaharbor',
    name: 'LAUTOKA HARBOR',
    flag: 'FJI',
  },
  {
    id: 'tha-bankaron',
    name: 'BAN KARON',
    flag: 'THA',
  },
  {
    id: 'irl-wicklow',
    name: 'WICKLOW',
    flag: 'IRL',
  },
  {
    id: 'rou-cumpana',
    name: 'CUMPANA',
    flag: 'ROU',
  },
  {
    id: 'png-kiunga',
    name: 'KIUNGA',
    flag: 'PNG',
  },
  {
    id: 'bgr-bgr-28',
    name: 'BGR-28',
    flag: 'BGR',
  },
  {
    id: 'arg-quequen',
    name: 'QUEQUEN',
    flag: 'ARG',
  },
  {
    id: 'srb-titel',
    name: 'TITEL',
    flag: 'SRB',
  },
  {
    id: 'pry-pry-24',
    name: 'PRY-24',
    flag: 'PRY',
  },
  {
    id: 'cyp-famagusta',
    name: 'FAMAGUSTA',
    flag: 'CYP',
  },
  {
    id: 'prt-vilabaleira',
    name: 'VILA BALEIRA',
    flag: 'PRT',
  },
  {
    id: 'lca-jalousie',
    name: 'JALOUSIE',
    flag: 'LCA',
  },
  {
    id: 'per-eten',
    name: 'ETEN',
    flag: 'PER',
  },
  {
    id: 'ltu-nida',
    name: 'NIDA',
    flag: 'LTU',
  },
  {
    id: 'aut-langenzersdorf',
    name: 'LANGENZERSDORF',
    flag: 'AUT',
  },
  {
    id: 'col-buenaventura',
    name: 'BUENAVENTURA',
    flag: 'COL',
  },
  {
    id: 'ncl-we',
    name: 'WE',
    flag: 'NCL',
  },
  {
    id: 'twn-toucheng',
    name: 'TOUCHENG',
    flag: 'TWN',
  },
  {
    id: 'abw-paardenbaai-(oranjestad)',
    name: 'PAARDEN BAAI - (ORANJESTAD)',
    flag: 'ABW',
  },
  {
    id: 'bhs-adelaide',
    name: 'ADELAIDE',
    flag: 'BHS',
  },
  {
    id: 'slv-acajutlaoffshoreterminal',
    name: 'ACAJUTLA OFFSHORE TERMINAL',
    flag: 'SLV',
  },
  {
    id: 'omn-minaraysut',
    name: 'MINA RAYSUT',
    flag: 'OMN',
  },
  {
    id: 'syc-lapasse',
    name: 'LA PASSE',
    flag: 'SYC',
  },
  {
    id: 'prt-cacilhas',
    name: 'CACILHAS',
    flag: 'PRT',
  },
  {
    id: 'hun-adony',
    name: 'ADONY',
    flag: 'HUN',
  },
  {
    id: 'arg-laplata',
    name: 'LA PLATA',
    flag: 'ARG',
  },
  {
    id: 'hkg-saikung',
    name: 'SAI KUNG',
    flag: 'HKG',
  },
  {
    id: 'srb-petrovaradin',
    name: 'PETROVARADIN',
    flag: 'SRB',
  },
  {
    id: 'bhs-bhs-63',
    name: 'BHS-63',
    flag: 'BHS',
  },
  {
    id: 'ago-soyoangolalngterminal',
    name: 'SOYO ANGOLA LNG TERMINAL',
    flag: 'AGO',
  },
  {
    id: 'png-buka',
    name: 'BUKA',
    flag: 'PNG',
  },
  {
    id: 'ecu-guayaquilgulf',
    name: 'GUAYAQUIL GULF',
    flag: 'ECU',
  },
  {
    id: 'lux-remich',
    name: 'REMICH',
    flag: 'LUX',
  },
  {
    id: 'ben-cotonou',
    name: 'COTONOU',
    flag: 'BEN',
  },
  {
    id: 'chl-quintero',
    name: 'QUINTERO',
    flag: 'CHL',
  },
  {
    id: 'vgb-roadharbor',
    name: 'ROAD HARBOR',
    flag: 'VGB',
  },
  {
    id: 'srb-palilula',
    name: 'PALILULA',
    flag: 'SRB',
  },
  {
    id: 'sdn-sawakinharbor',
    name: 'SAWAKIN HARBOR',
    flag: 'SDN',
  },
  {
    id: 'chl-mejillones',
    name: 'MEJILLONES',
    flag: 'CHL',
  },
  {
    id: 'prt-alges',
    name: 'ALGES',
    flag: 'PRT',
  },
  {
    id: 'grl-qaqurtoq',
    name: 'QAQURTOQ',
    flag: 'GRL',
  },
  {
    id: 'bgr-somovit',
    name: 'SOMOVIT',
    flag: 'BGR',
  },
  {
    id: 'are-fatehfield',
    name: 'FATEH FIELD',
    flag: 'ARE',
  },
  {
    id: 'are-are-188',
    name: 'ARE-188',
    flag: 'ARE',
  },
  {
    id: 'chl-chl-40',
    name: 'CHL-40',
    flag: 'CHL',
  },
  {
    id: 'pcn-adamstown',
    name: 'ADAMSTOWN',
    flag: 'PCN',
  },
  {
    id: 'chl-chl-51',
    name: 'CHL-51',
    flag: 'CHL',
  },
  {
    id: 'tca-cockburntown',
    name: 'COCKBURN TOWN',
    flag: 'TCA',
  },
  {
    id: 'egy-egy-79',
    name: 'EGY-79',
    flag: 'EGY',
  },
  {
    id: 'bgr-svetivlas',
    name: 'SVETI VLAS',
    flag: 'BGR',
  },
  {
    id: 'irn-qeshm',
    name: 'QESHM',
    flag: 'IRN',
  },
  {
    id: 'pyf-haapiti',
    name: 'HAAPITI',
    flag: 'PYF',
  },
  {
    id: 'lca-castries',
    name: 'CASTRIES',
    flag: 'LCA',
  },
  {
    id: 'pol-darlowo',
    name: 'DARLOWO',
    flag: 'POL',
  },
  {
    id: 'hti-aubry',
    name: 'AUBRY',
    flag: 'HTI',
  },
  {
    id: 'cub-bahaidelahabana',
    name: 'BAHAI DE LA HABANA',
    flag: 'CUB',
  },
  {
    id: 'jam-portroyal',
    name: 'PORT ROYAL',
    flag: 'JAM',
  },
  {
    id: 'chl-bahiasanvicente',
    name: 'BAHIA SAN VICENTE',
    flag: 'CHL',
  },
  {
    id: 'irl-foynes',
    name: 'FOYNES',
    flag: 'IRL',
  },
  {
    id: 'est-est-46',
    name: 'EST-46',
    flag: 'EST',
  },
  {
    id: 'pyf-teavaro',
    name: 'TEAVARO',
    flag: 'PYF',
  },
  {
    id: 'cxr-flyingfishcove',
    name: 'FLYING FISH COVE',
    flag: 'CXR',
  },
  {
    id: 'isl-bolungavik',
    name: 'BOLUNGAVIK',
    flag: 'ISL',
  },
  {
    id: 'fro-toftir',
    name: 'TOFTIR',
    flag: 'FRO',
  },
  {
    id: 'srb-beocin',
    name: 'BEOCIN',
    flag: 'SRB',
  },
  {
    id: 'glp-grand-bourg',
    name: 'GRAND-BOURG',
    flag: 'GLP',
  },
  {
    id: 'twn-hsinta',
    name: 'HSINTA',
    flag: 'TWN',
  },
  {
    id: 'twn-su-ao',
    name: 'SU-AO',
    flag: 'TWN',
  },
  {
    id: 'mlt-qala',
    name: 'QALA',
    flag: 'MLT',
  },
  {
    id: 'geo-anaklia',
    name: 'ANAKLIA',
    flag: 'GEO',
  },
  {
    id: 'bhs-northcatcay',
    name: 'NORTH CAT CAY',
    flag: 'BHS',
  },
  {
    id: 'fji-savusavubay',
    name: 'SAVUSAVU BAY',
    flag: 'FJI',
  },
  {
    id: 'lbn-sayda',
    name: 'SAYDA',
    flag: 'LBN',
  },
  {
    id: 'aut-durnstein',
    name: 'DURNSTEIN',
    flag: 'AUT',
  },
  {
    id: 'cub-mariel',
    name: 'MARIEL',
    flag: 'CUB',
  },
  {
    id: 'isl-porshofn',
    name: 'PORSHOFN',
    flag: 'ISL',
  },
  {
    id: 'col-mamonal',
    name: 'MAMONAL',
    flag: 'COL',
  },
  {
    id: 'cri-puntaarenas',
    name: 'PUNTAARENAS',
    flag: 'CRI',
  },
  {
    id: 'cym-cym-5',
    name: 'CYM-5',
    flag: 'CYM',
  },
  {
    id: 'irl-rathmullan',
    name: 'RATHMULLAN',
    flag: 'IRL',
  },
  {
    id: 'pan-melones',
    name: 'MELONES',
    flag: 'PAN',
  },
  {
    id: 'aus-sorrento',
    name: 'SORRENTO',
    flag: 'AUS',
  },
  {
    id: 'aus-fairlight',
    name: 'FAIRLIGHT',
    flag: 'AUS',
  },
  {
    id: 'aus-rockingham',
    name: 'ROCKINGHAM',
    flag: 'AUS',
  },
  {
    id: 'aus-portadelaide',
    name: 'PORT ADELAIDE',
    flag: 'AUS',
  },
  {
    id: 'aus-weipa',
    name: 'WEIPA',
    flag: 'AUS',
  },
  {
    id: 'aus-portmacquarie',
    name: 'PORT MACQUARIE',
    flag: 'AUS',
  },
  {
    id: 'aus-northfremantle',
    name: 'NORTH FREMANTLE',
    flag: 'AUS',
  },
  {
    id: 'aus-forster',
    name: 'FORSTER',
    flag: 'AUS',
  },
  {
    id: 'aus-belmont',
    name: 'BELMONT',
    flag: 'AUS',
  },
  {
    id: 'aus-brisbane',
    name: 'BRISBANE',
    flag: 'AUS',
  },
  {
    id: 'aus-bundaberg',
    name: 'BUNDABERG',
    flag: 'AUS',
  },
  {
    id: 'aus-victoriapoint',
    name: 'VICTORIA POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-oxenford',
    name: 'OXENFORD',
    flag: 'AUS',
  },
  {
    id: 'aus-hawksnest',
    name: 'HAWKS NEST',
    flag: 'AUS',
  },
  {
    id: 'aus-mindarie',
    name: 'MINDARIE',
    flag: 'AUS',
  },
  {
    id: 'aus-portalma',
    name: 'PORT ALMA',
    flag: 'AUS',
  },
  {
    id: 'aus-portstephens',
    name: 'PORT STEPHENS',
    flag: 'AUS',
  },
  {
    id: 'aus-somerville',
    name: 'SOMERVILLE',
    flag: 'AUS',
  },
  {
    id: 'aus-redlandbay',
    name: 'REDLAND BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-newcastle',
    name: 'NEWCASTLE',
    flag: 'AUS',
  },
  {
    id: 'aus-burnie',
    name: 'BURNIE',
    flag: 'AUS',
  },
  {
    id: 'aus-melbourne',
    name: 'MELBOURNE',
    flag: 'AUS',
  },
  {
    id: 'aus-porthedland',
    name: 'PORT HEDLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-pointpiper',
    name: 'POINT PIPER',
    flag: 'AUS',
  },
  {
    id: 'aus-coffsharbour',
    name: 'COFFS HARBOUR',
    flag: 'AUS',
  },
  {
    id: 'aus-byronbay',
    name: 'BYRON BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-fanniebay',
    name: 'FANNIE BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-blairgowrie',
    name: 'BLAIRGOWRIE',
    flag: 'AUS',
  },
  {
    id: 'aus-portdouglas',
    name: 'PORT DOUGLAS',
    flag: 'AUS',
  },
  {
    id: 'aus-tincanbay',
    name: 'TIN CAN BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-cairns',
    name: 'CAIRNS',
    flag: 'AUS',
  },
  {
    id: 'aus-mainbeach',
    name: 'MAIN BEACH',
    flag: 'AUS',
  },
  {
    id: 'aus-quindalup',
    name: 'QUINDALUP',
    flag: 'AUS',
  },
  {
    id: 'aus-urangan',
    name: 'URANGAN',
    flag: 'AUS',
  },
  {
    id: 'aus-geraldton',
    name: 'GERALDTON',
    flag: 'AUS',
  },
  {
    id: 'aus-camdenhaven',
    name: 'CAMDEN HAVEN',
    flag: 'AUS',
  },
  {
    id: 'aus-karumba',
    name: 'KARUMBA',
    flag: 'AUS',
  },
  {
    id: 'aus-gove',
    name: 'GOVE',
    flag: 'AUS',
  },
  {
    id: 'aus-portpirie',
    name: 'PORT PIRIE',
    flag: 'AUS',
  },
  {
    id: 'aus-hampton',
    name: 'HAMPTON',
    flag: 'AUS',
  },
  {
    id: 'aus-yorkeysknob',
    name: 'YORKEYS KNOB',
    flag: 'AUS',
  },
  {
    id: 'aus-mandurah',
    name: 'MANDURAH',
    flag: 'AUS',
  },
  {
    id: 'aus-dover',
    name: 'DOVER',
    flag: 'AUS',
  },
  {
    id: 'aus-kettering',
    name: 'KETTERING',
    flag: 'AUS',
  },
  {
    id: 'aus-whyalla',
    name: 'WHYALLA',
    flag: 'AUS',
  },
  {
    id: 'aus-coogee',
    name: 'COOGEE',
    flag: 'AUS',
  },
  {
    id: 'aus-mackay',
    name: 'MACKAY',
    flag: 'AUS',
  },
  {
    id: 'aus-portland',
    name: 'PORTLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-magneticisland',
    name: 'MAGNETIC ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-portwalcott',
    name: 'PORT WALCOTT',
    flag: 'AUS',
  },
  {
    id: 'aus-maclean',
    name: 'MACLEAN',
    flag: 'AUS',
  },
  {
    id: 'aus-albany',
    name: 'ALBANY',
    flag: 'AUS',
  },
  {
    id: 'aus-sthelens',
    name: 'ST HELENS',
    flag: 'AUS',
  },
  {
    id: 'aus-welshpool',
    name: 'WELSHPOOL',
    flag: 'AUS',
  },
  {
    id: 'aus-rathmines',
    name: 'RATHMINES',
    flag: 'AUS',
  },
  {
    id: 'aus-bilgolabeach',
    name: 'BILGOLA BEACH',
    flag: 'AUS',
  },
  {
    id: 'aus-cygnet',
    name: 'CYGNET',
    flag: 'AUS',
  },
  {
    id: 'aus-hobart',
    name: 'HOBART',
    flag: 'AUS',
  },
  {
    id: 'aus-larrakeyah',
    name: 'LARRAKEYAH',
    flag: 'AUS',
  },
  {
    id: 'aus-corlette',
    name: 'CORLETTE',
    flag: 'AUS',
  },
  {
    id: 'aus-castlecrag',
    name: 'CASTLECRAG',
    flag: 'AUS',
  },
  {
    id: 'aus-bookerbay',
    name: 'BOOKER BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-longueville',
    name: 'LONGUEVILLE',
    flag: 'AUS',
  },
  {
    id: 'aus-margate',
    name: 'MARGATE',
    flag: 'AUS',
  },
  {
    id: 'aus-cannonhill',
    name: 'CANNON HILL',
    flag: 'AUS',
  },
  {
    id: 'aus-mosman',
    name: 'MOSMAN',
    flag: 'AUS',
  },
  {
    id: 'aus-cleveland',
    name: 'CLEVELAND',
    flag: 'AUS',
  },
  {
    id: 'aus-devonport',
    name: 'DEVONPORT',
    flag: 'AUS',
  },
  {
    id: 'aus-balmoral',
    name: 'BALMORAL',
    flag: 'AUS',
  },
  {
    id: 'aus-darlingpoint',
    name: 'DARLING POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-portdenison',
    name: 'PORT DENISON',
    flag: 'AUS',
  },
  {
    id: 'aus-mooloolaba',
    name: 'MOOLOOLABA',
    flag: 'AUS',
  },
  {
    id: 'aus-wallaroo',
    name: 'WALLAROO',
    flag: 'AUS',
  },
  {
    id: 'aus-portkembla',
    name: 'PORT KEMBLA',
    flag: 'AUS',
  },
  {
    id: 'aus-nelsonbay',
    name: 'NELSON BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-manlywest',
    name: 'MANLY WEST',
    flag: 'AUS',
  },
  {
    id: 'aus-capecuvier',
    name: 'CAPE CUVIER',
    flag: 'AUS',
  },
  {
    id: 'aus-gladstone',
    name: 'GLADSTONE',
    flag: 'AUS',
  },
  {
    id: 'aus-geelong',
    name: 'GEELONG',
    flag: 'AUS',
  },
  {
    id: 'aus-eden',
    name: 'EDEN',
    flag: 'AUS',
  },
  {
    id: 'aus-broome',
    name: 'BROOME',
    flag: 'AUS',
  },
  {
    id: 'aus-apollobay',
    name: 'APOLLO BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-townsville',
    name: 'TOWNSVILLE',
    flag: 'AUS',
  },
  {
    id: 'aus-fremantle',
    name: 'FREMANTLE',
    flag: 'AUS',
  },
  {
    id: 'aus-newport',
    name: 'NEWPORT',
    flag: 'AUS',
  },
  {
    id: 'aus-coalpoint',
    name: 'COAL POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-sharkbay',
    name: 'SHARK BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-streakybay',
    name: 'STREAKY BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-canadabay',
    name: 'CANADA BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-palmbeach',
    name: 'PALM BEACH',
    flag: 'AUS',
  },
  {
    id: 'aus-taroona',
    name: 'TAROONA',
    flag: 'AUS',
  },
  {
    id: 'aus-mayfield',
    name: 'MAYFIELD',
    flag: 'AUS',
  },
  {
    id: 'aus-woree',
    name: 'WOREE',
    flag: 'AUS',
  },
  {
    id: 'aus-bermagui',
    name: 'BERMAGUI',
    flag: 'AUS',
  },
  {
    id: 'aus-gladesville',
    name: 'GLADESVILLE',
    flag: 'AUS',
  },
  {
    id: 'aus-manly',
    name: 'MANLY',
    flag: 'AUS',
  },
  {
    id: 'aus-palmcove',
    name: 'PALM COVE',
    flag: 'AUS',
  },
  {
    id: 'aus-berowra',
    name: 'BEROWRA',
    flag: 'AUS',
  },
  {
    id: 'aus-portfairy',
    name: 'PORT FAIRY',
    flag: 'AUS',
  },
  {
    id: 'aus-haypoint',
    name: 'HAY POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-botany',
    name: 'BOTANY',
    flag: 'AUS',
  },
  {
    id: 'aus-dampier',
    name: 'DAMPIER',
    flag: 'AUS',
  },
  {
    id: 'aus-toronto',
    name: 'TORONTO',
    flag: 'AUS',
  },
  {
    id: 'aus-portdalrymple',
    name: 'PORT DALRYMPLE',
    flag: 'AUS',
  },
  {
    id: 'aus-tweedheadswest',
    name: 'TWEED HEADS WEST',
    flag: 'AUS',
  },
  {
    id: 'aus-stanley',
    name: 'STANLEY',
    flag: 'AUS',
  },
  {
    id: 'aus-wollongong',
    name: 'WOLLONGONG',
    flag: 'AUS',
  },
  {
    id: 'aus-bayview',
    name: 'BAY VIEW',
    flag: 'AUS',
  },
  {
    id: 'aus-cammeray',
    name: 'CAMMERAY',
    flag: 'AUS',
  },
  {
    id: 'aus-bowen',
    name: 'BOWEN',
    flag: 'AUS',
  },
  {
    id: 'aus-southport',
    name: 'SOUTHPORT',
    flag: 'AUS',
  },
  {
    id: 'aus-eastgosford',
    name: 'EAST GOSFORD',
    flag: 'AUS',
  },
  {
    id: 'aus-yarraville',
    name: 'YARRAVILLE',
    flag: 'AUS',
  },
  {
    id: 'aus-bundeena',
    name: 'BUNDEENA',
    flag: 'AUS',
  },
  {
    id: 'aus-penneshaw',
    name: 'PENNESHAW',
    flag: 'AUS',
  },
  {
    id: 'aus-lutana',
    name: 'LUTANA',
    flag: 'AUS',
  },
  {
    id: 'aus-batemansbay',
    name: 'BATEMANS BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-clontarf',
    name: 'CLONTARF',
    flag: 'AUS',
  },
  {
    id: 'aus-wynnum',
    name: 'WYNNUM',
    flag: 'AUS',
  },
  {
    id: 'aus-bellpark',
    name: 'BELL PARK',
    flag: 'AUS',
  },
  {
    id: 'aus-bunbury',
    name: 'BUNBURY',
    flag: 'AUS',
  },
  {
    id: 'aus-crawley',
    name: 'CRAWLEY',
    flag: 'AUS',
  },
  {
    id: 'aus-westernport',
    name: 'WESTERN PORT',
    flag: 'AUS',
  },
  {
    id: 'aus-wellingtonpoint',
    name: 'WELLINGTON POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-portgiles',
    name: 'PORT GILES',
    flag: 'AUS',
  },
  {
    id: 'aus-shorncliffe',
    name: 'SHORNCLIFFE',
    flag: 'AUS',
  },
  {
    id: 'aus-werribeesouth',
    name: 'WERRIBEE SOUTH',
    flag: 'AUS',
  },
  {
    id: 'aus-southbrisbane',
    name: 'SOUTH BRISBANE',
    flag: 'AUS',
  },
  {
    id: 'aus-portbonython',
    name: 'PORT BONYTHON',
    flag: 'AUS',
  },
  {
    id: 'aus-franklin',
    name: 'FRANKLIN',
    flag: 'AUS',
  },
  {
    id: 'aus-queenscliff',
    name: 'QUEENSCLIFF',
    flag: 'AUS',
  },
  {
    id: 'aus-greenwellpoint',
    name: 'GREENWELL POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-kwinana',
    name: 'KWINANA',
    flag: 'AUS',
  },
  {
    id: 'aus-huntershill',
    name: 'HUNTERS HILL',
    flag: 'AUS',
  },
  {
    id: 'aus-safetybeach',
    name: 'SAFETY BEACH',
    flag: 'AUS',
  },
  {
    id: 'aus-greatkeppelisland',
    name: 'GREAT KEPPEL ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-beautypoint',
    name: 'BEAUTY POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-ardrossan',
    name: 'ARDROSSAN',
    flag: 'AUS',
  },
  {
    id: 'aus-scarness',
    name: 'SCARNESS',
    flag: 'AUS',
  },
  {
    id: 'aus-mornington',
    name: 'MORNINGTON',
    flag: 'AUS',
  },
  {
    id: 'aus-churchpoint',
    name: 'CHURCH POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-sydney',
    name: 'SYDNEY',
    flag: 'AUS',
  },
  {
    id: 'aus-arcadiavale',
    name: 'ARCADIA VALE',
    flag: 'AUS',
  },
  {
    id: 'aus-goodwood',
    name: 'GOODWOOD',
    flag: 'AUS',
  },
  {
    id: 'aus-belmontsouth',
    name: 'BELMONT SOUTH',
    flag: 'AUS',
  },
  {
    id: 'aus-docklands',
    name: 'DOCKLANDS',
    flag: 'AUS',
  },
  {
    id: 'aus-darwin',
    name: 'DARWIN',
    flag: 'AUS',
  },
  {
    id: 'aus-ascot',
    name: 'ASCOT',
    flag: 'AUS',
  },
  {
    id: 'aus-onslow',
    name: 'ONSLOW',
    flag: 'AUS',
  },
  {
    id: 'aus-eleebana',
    name: 'ELEEBANA',
    flag: 'AUS',
  },
  {
    id: 'aus-thursdayisland',
    name: 'THURSDAY ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-mourilyanharbour',
    name: 'MOURILYAN HARBOUR',
    flag: 'AUS',
  },
  {
    id: 'aus-portlincoln',
    name: 'PORT LINCOLN',
    flag: 'AUS',
  },
  {
    id: 'aus-esperance',
    name: 'ESPERANCE',
    flag: 'AUS',
  },
  {
    id: 'aus-doverheights',
    name: 'DOVER HEIGHTS',
    flag: 'AUS',
  },
  {
    id: 'aus-cremorne',
    name: 'CREMORNE',
    flag: 'AUS',
  },
  {
    id: 'aus-scarborough',
    name: 'SCARBOROUGH',
    flag: 'AUS',
  },
  {
    id: 'aus-portlatta',
    name: 'PORT LATTA',
    flag: 'AUS',
  },
  {
    id: 'aus-carnarvon',
    name: 'CARNARVON',
    flag: 'AUS',
  },
  {
    id: 'aus-jacobswell',
    name: 'JACOBS WELL',
    flag: 'AUS',
  },
  {
    id: 'aus-glenelg',
    name: 'GLENELG',
    flag: 'AUS',
  },
  {
    id: 'aus-launceston',
    name: 'LAUNCESTON',
    flag: 'AUS',
  },
  {
    id: 'aus-williamstown',
    name: 'WILLIAMSTOWN',
    flag: 'AUS',
  },
  {
    id: 'aus-ulladulla',
    name: 'ULLADULLA',
    flag: 'AUS',
  },
  {
    id: 'aus-greenwich',
    name: 'GREENWICH',
    flag: 'AUS',
  },
  {
    id: 'aus-coniston',
    name: 'CONISTON',
    flag: 'AUS',
  },
  {
    id: 'aus-porthuon',
    name: 'PORT HUON',
    flag: 'AUS',
  },
  {
    id: 'aus-blakehurst',
    name: 'BLAKEHURST',
    flag: 'AUS',
  },
  {
    id: 'aus-northbrighton',
    name: 'NORTH BRIGHTON',
    flag: 'AUS',
  },
  {
    id: 'aus-uselessloop',
    name: 'USELESS LOOP',
    flag: 'AUS',
  },
  {
    id: 'aus-bongaree',
    name: 'BONGAREE',
    flag: 'AUS',
  },
  {
    id: 'aus-botanybay',
    name: 'BOTANY BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-ballina',
    name: 'BALLINA',
    flag: 'AUS',
  },
  {
    id: 'aus-capeflatteryharbor',
    name: 'CAPE FLATTERY HARBOR',
    flag: 'AUS',
  },
  {
    id: 'aus-morningside',
    name: 'MORNINGSIDE',
    flag: 'AUS',
  },
  {
    id: 'aus-killarneyheights',
    name: 'KILLARNEY HEIGHTS',
    flag: 'AUS',
  },
  {
    id: 'aus-torquay',
    name: 'TORQUAY',
    flag: 'AUS',
  },
  {
    id: 'aus-spotswood',
    name: 'SPOTSWOOD',
    flag: 'AUS',
  },
  {
    id: 'aus-grayspoint',
    name: 'GRAYS POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-hastings',
    name: 'HASTINGS',
    flag: 'AUS',
  },
  {
    id: 'aus-wyndham',
    name: 'WYNDHAM',
    flag: 'AUS',
  },
  {
    id: 'aus-jurienbay',
    name: 'JURIEN BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-cronulla',
    name: 'CRONULLA',
    flag: 'AUS',
  },
  {
    id: 'aus-thevenard',
    name: 'THEVENARD',
    flag: 'AUS',
  },
  {
    id: 'aus-tworocks',
    name: 'TWO ROCKS',
    flag: 'AUS',
  },
  {
    id: 'aus-milnerbay',
    name: 'MILNER BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-lakesentrance',
    name: 'LAKES ENTRANCE',
    flag: 'AUS',
  },
  {
    id: 'aus-hillarys',
    name: 'HILLARYS',
    flag: 'AUS',
  },
  {
    id: 'bel-turnhout',
    name: 'TURNHOUT',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-23',
    name: 'BEL-23',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-37',
    name: 'BEL-37',
    flag: 'BEL',
  },
  {
    id: 'bel-genk',
    name: 'GENK',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-122',
    name: 'BEL-122',
    flag: 'BEL',
  },
  {
    id: 'bel-kruibeke',
    name: 'KRUIBEKE',
    flag: 'BEL',
  },
  {
    id: 'bel-peruwelz',
    name: 'PERUWELZ',
    flag: 'BEL',
  },
  {
    id: 'bel-huy',
    name: 'HUY',
    flag: 'BEL',
  },
  {
    id: 'bel-diepenbeek',
    name: 'DIEPENBEEK',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-146',
    name: 'BEL-146',
    flag: 'BEL',
  },
  {
    id: 'bel-rupelmonde',
    name: 'RUPELMONDE',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-136',
    name: 'BEL-136',
    flag: 'BEL',
  },
  {
    id: 'bel-halle',
    name: 'HALLE',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-35',
    name: 'BEL-35',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-27',
    name: 'BEL-27',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-85',
    name: 'BEL-85',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-32',
    name: 'BEL-32',
    flag: 'BEL',
  },
  {
    id: 'bel-vise',
    name: 'VISE',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-2',
    name: 'BEL-2',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-145',
    name: 'BEL-145',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-53',
    name: 'BEL-53',
    flag: 'BEL',
  },
  {
    id: 'bel-zeebrugge',
    name: 'ZEEBRUGGE',
    flag: 'BEL',
  },
  {
    id: 'bel-merelbeke',
    name: 'MERELBEKE',
    flag: 'BEL',
  },
  {
    id: 'bel-gevaarts',
    name: 'GEVAARTS',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-80',
    name: 'BEL-80',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-29',
    name: 'BEL-29',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-109',
    name: 'BEL-109',
    flag: 'BEL',
  },
  {
    id: 'bel-zelzate',
    name: 'ZELZATE',
    flag: 'BEL',
  },
  {
    id: 'bel-stabroek',
    name: 'STABROEK',
    flag: 'BEL',
  },
  {
    id: 'bel-liege',
    name: 'LIEGE',
    flag: 'BEL',
  },
  {
    id: 'bel-herentals',
    name: 'HERENTALS',
    flag: 'BEL',
  },
  {
    id: 'bel-amay',
    name: 'AMAY',
    flag: 'BEL',
  },
  {
    id: 'bel-rumst',
    name: 'RUMST',
    flag: 'BEL',
  },
  {
    id: 'bel-lanaken',
    name: 'LANAKEN',
    flag: 'BEL',
  },
  {
    id: 'bel-deinze',
    name: 'DEINZE',
    flag: 'BEL',
  },
  {
    id: 'bel-nieuwpoort',
    name: 'NIEUWPOORT',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-52',
    name: 'BEL-52',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-98',
    name: 'BEL-98',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-64',
    name: 'BEL-64',
    flag: 'BEL',
  },
  {
    id: 'bel-antwerp',
    name: 'ANTWERP',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-100',
    name: 'BEL-100',
    flag: 'BEL',
  },
  {
    id: 'bel-kluisbergen',
    name: 'KLUISBERGEN',
    flag: 'BEL',
  },
  {
    id: 'bel-lovendegem',
    name: 'LOVENDEGEM',
    flag: 'BEL',
  },
  {
    id: 'bel-saint-nicolas',
    name: 'SAINT-NICOLAS',
    flag: 'BEL',
  },
  {
    id: 'bel-pecq',
    name: 'PECQ',
    flag: 'BEL',
  },
  {
    id: 'bel-aalst',
    name: 'AALST',
    flag: 'BEL',
  },
  {
    id: 'bel-vilvoorde',
    name: 'VILVOORDE',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-104',
    name: 'BEL-104',
    flag: 'BEL',
  },
  {
    id: 'bel-wevelgem',
    name: 'WEVELGEM',
    flag: 'BEL',
  },
  {
    id: 'bel-andenne',
    name: 'ANDENNE',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-115',
    name: 'BEL-115',
    flag: 'BEL',
  },
  {
    id: 'bel-antoing',
    name: 'ANTOING',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-59',
    name: 'BEL-59',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-132',
    name: 'BEL-132',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-13',
    name: 'BEL-13',
    flag: 'BEL',
  },
  {
    id: 'bel-mons',
    name: 'MONS',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-138',
    name: 'BEL-138',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-40',
    name: 'BEL-40',
    flag: 'BEL',
  },
  {
    id: 'bel-bree',
    name: 'BREE',
    flag: 'BEL',
  },
  {
    id: 'bel-oudenaarde',
    name: 'OUDENAARDE',
    flag: 'BEL',
  },
  {
    id: 'bel-gavere',
    name: 'GAVERE',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-107',
    name: 'BEL-107',
    flag: 'BEL',
  },
  {
    id: 'bel-floriffoux',
    name: 'FLORIFFOUX',
    flag: 'BEL',
  },
  {
    id: 'bel-antwerpen',
    name: 'ANTWERPEN',
    flag: 'BEL',
  },
  {
    id: 'bel-zutendaal',
    name: 'ZUTENDAAL',
    flag: 'BEL',
  },
  {
    id: 'bel-nameche',
    name: 'NAMECHE',
    flag: 'BEL',
  },
  {
    id: 'bel-oudenburg',
    name: 'OUDENBURG',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-14',
    name: 'BEL-14',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-88',
    name: 'BEL-88',
    flag: 'BEL',
  },
  {
    id: 'bel-flemalle-haute',
    name: 'FLEMALLE-HAUTE',
    flag: 'BEL',
  },
  {
    id: 'bel-saint-ghislain',
    name: 'SAINT-GHISLAIN',
    flag: 'BEL',
  },
  {
    id: 'bel-harelbeke',
    name: 'HARELBEKE',
    flag: 'BEL',
  },
  {
    id: 'bel-overpelt',
    name: 'OVERPELT',
    flag: 'BEL',
  },
  {
    id: 'bel-seraing',
    name: 'SERAING',
    flag: 'BEL',
  },
  {
    id: 'bel-kapelle-op-den-bos',
    name: 'KAPELLE-OP-DEN-BOS',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-105',
    name: 'BEL-105',
    flag: 'BEL',
  },
  {
    id: 'bel-tournai',
    name: 'TOURNAI',
    flag: 'BEL',
  },
  {
    id: 'bel-engis',
    name: 'ENGIS',
    flag: 'BEL',
  },
  {
    id: 'bel-evergem',
    name: 'EVERGEM',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-58',
    name: 'BEL-58',
    flag: 'BEL',
  },
  {
    id: 'bel-izegem',
    name: 'IZEGEM',
    flag: 'BEL',
  },
  {
    id: 'bel-kloosterveld',
    name: 'KLOOSTERVELD',
    flag: 'BEL',
  },
  {
    id: 'bel-brugge',
    name: 'BRUGGE',
    flag: 'BEL',
  },
  {
    id: 'bel-oostende',
    name: 'OOSTENDE',
    flag: 'BEL',
  },
  {
    id: 'bel-bruges',
    name: 'BRUGES',
    flag: 'BEL',
  },
  {
    id: 'bel-thiange',
    name: 'THIANGE',
    flag: 'BEL',
  },
  {
    id: 'bel-moerbrugge',
    name: 'MOERBRUGGE',
    flag: 'BEL',
  },
  {
    id: 'bel-boom',
    name: 'BOOM',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-93',
    name: 'BEL-93',
    flag: 'BEL',
  },
  {
    id: 'bel-wielsbeke',
    name: 'WIELSBEKE',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-114',
    name: 'BEL-114',
    flag: 'BEL',
  },
  {
    id: 'bel-sint-eloois-vijve',
    name: 'SINT-ELOOIS-VIJVE',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-102',
    name: 'BEL-102',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-144',
    name: 'BEL-144',
    flag: 'BEL',
  },
  {
    id: 'bel-spiere-helkijn',
    name: 'SPIERE-HELKIJN',
    flag: 'BEL',
  },
  {
    id: 'bel-lier',
    name: 'LIER',
    flag: 'BEL',
  },
  {
    id: 'bel-duffel',
    name: 'DUFFEL',
    flag: 'BEL',
  },
  {
    id: 'bel-clairehaie',
    name: 'CLAIRE HAIE',
    flag: 'BEL',
  },
  {
    id: 'bel-sintlenaarts',
    name: 'SINT LENAARTS',
    flag: 'BEL',
  },
  {
    id: 'bel-blankenberge',
    name: 'BLANKENBERGE',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-111',
    name: 'BEL-111',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-101',
    name: 'BEL-101',
    flag: 'BEL',
  },
  {
    id: 'bel-ghent',
    name: 'GHENT',
    flag: 'BEL',
  },
  {
    id: 'bel-brussels',
    name: 'BRUSSELS',
    flag: 'BEL',
  },
  {
    id: 'bel-roeulx',
    name: 'ROEULX',
    flag: 'BEL',
  },
  {
    id: 'bel-namur',
    name: 'NAMUR',
    flag: 'BEL',
  },
  {
    id: 'bel-zwevegem',
    name: 'ZWEVEGEM',
    flag: 'BEL',
  },
  {
    id: 'bel-dinant',
    name: 'DINANT',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-48',
    name: 'BEL-48',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-89',
    name: 'BEL-89',
    flag: 'BEL',
  },
  {
    id: 'bel-hasselt',
    name: 'HASSELT',
    flag: 'BEL',
  },
  {
    id: 'bel-diegem',
    name: 'DIEGEM',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-71',
    name: 'BEL-71',
    flag: 'BEL',
  },
  {
    id: 'bel-ghlin',
    name: 'GHLIN',
    flag: 'BEL',
  },
  {
    id: 'bel-farciennes',
    name: 'FARCIENNES',
    flag: 'BEL',
  },
  {
    id: 'bel-yvoir',
    name: 'YVOIR',
    flag: 'BEL',
  },
  {
    id: 'bel-bruxelles',
    name: 'BRUXELLES',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-113',
    name: 'BEL-113',
    flag: 'BEL',
  },
  {
    id: 'bel-herstal',
    name: 'HERSTAL',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-103',
    name: 'BEL-103',
    flag: 'BEL',
  },
  {
    id: 'bel-bellekouter',
    name: 'BELLEKOUTER',
    flag: 'BEL',
  },
  {
    id: 'bel-mechelen',
    name: 'MECHELEN',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-94',
    name: 'BEL-94',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-110',
    name: 'BEL-110',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-112',
    name: 'BEL-112',
    flag: 'BEL',
  },
  {
    id: 'bel-charleroi',
    name: 'CHARLEROI',
    flag: 'BEL',
  },
  {
    id: 'bel-tubize',
    name: 'TUBIZE',
    flag: 'BEL',
  },
  {
    id: 'bel-mons-lez-liege',
    name: 'MONS-LEZ-LIEGE',
    flag: 'BEL',
  },
  {
    id: 'bel-temse',
    name: 'TEMSE',
    flag: 'BEL',
  },
  {
    id: 'bel-aalterbrug',
    name: 'AALTERBRUG',
    flag: 'BEL',
  },
  {
    id: 'bel-bocholt',
    name: 'BOCHOLT',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-97',
    name: 'BEL-97',
    flag: 'BEL',
  },
  {
    id: 'bel-hoboken',
    name: 'HOBOKEN',
    flag: 'BEL',
  },
  {
    id: 'bel-roeselare',
    name: 'ROESELARE',
    flag: 'BEL',
  },
  {
    id: 'bel-lalouviere',
    name: 'LA LOUVIERE',
    flag: 'BEL',
  },
  {
    id: 'bel-bredene',
    name: 'BREDENE',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-125',
    name: 'BEL-125',
    flag: 'BEL',
  },
  {
    id: 'bel-schoten',
    name: 'SCHOTEN',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-79',
    name: 'BEL-79',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-16',
    name: 'BEL-16',
    flag: 'BEL',
  },
  {
    id: 'bel-bel-92',
    name: 'BEL-92',
    flag: 'BEL',
  },
  {
    id: 'bel-dendermonde',
    name: 'DENDERMONDE',
    flag: 'BEL',
  },
  {
    id: 'bel-zingem',
    name: 'ZINGEM',
    flag: 'BEL',
  },
  {
    id: 'bel-tessenderlo',
    name: 'TESSENDERLO',
    flag: 'BEL',
  },
  {
    id: 'bra-bra-223',
    name: 'BRA-223',
    flag: 'BRA',
  },
  {
    id: 'bra-itaqui',
    name: 'ITAQUI',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-268',
    name: 'BRA-268',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-45',
    name: 'BRA-45',
    flag: 'BRA',
  },
  {
    id: 'bra-ilhabela',
    name: 'ILHABELA',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-143',
    name: 'BRA-143',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-99',
    name: 'BRA-99',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-86',
    name: 'BRA-86',
    flag: 'BRA',
  },
  {
    id: 'bra-portosantana',
    name: 'PORTO SANTANA',
    flag: 'BRA',
  },
  {
    id: 'bra-jurongaracruz',
    name: 'JURONG ARACRUZ',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-278',
    name: 'BRA-278',
    flag: 'BRA',
  },
  {
    id: 'bra-riodejaneiro',
    name: 'RIO DE JANEIRO',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-299',
    name: 'BRA-299',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-11',
    name: 'BRA-11',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-7',
    name: 'BRA-7',
    flag: 'BRA',
  },
  {
    id: 'bra-trombetas',
    name: 'TROMBETAS',
    flag: 'BRA',
  },
  {
    id: 'bra-riogrande',
    name: 'RIO GRANDE',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-332',
    name: 'BRA-332',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-324',
    name: 'BRA-324',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-69',
    name: 'BRA-69',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-316',
    name: 'BRA-316',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-330',
    name: 'BRA-330',
    flag: 'BRA',
  },
  {
    id: 'bra-camposbasin',
    name: 'CAMPOS BASIN',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-310',
    name: 'BRA-310',
    flag: 'BRA',
  },
  {
    id: 'bra-portoalegre',
    name: 'PORTO ALEGRE',
    flag: 'BRA',
  },
  {
    id: 'bra-navegantes',
    name: 'NAVEGANTES',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-264',
    name: 'BRA-264',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-53',
    name: 'BRA-53',
    flag: 'BRA',
  },
  {
    id: 'bra-gebig',
    name: 'GEBIG',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-319',
    name: 'BRA-319',
    flag: 'BRA',
  },
  {
    id: 'bra-portodoforno',
    name: 'PORTO DO FORNO',
    flag: 'BRA',
  },
  {
    id: 'bra-santos',
    name: 'SANTOS',
    flag: 'BRA',
  },
  {
    id: 'bra-maceio',
    name: 'MACEIO',
    flag: 'BRA',
  },
  {
    id: 'bra-madrededeus',
    name: 'MADRE DE DEUS',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-97',
    name: 'BRA-97',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-10',
    name: 'BRA-10',
    flag: 'BRA',
  },
  {
    id: 'bra-itajai',
    name: 'ITAJAI',
    flag: 'BRA',
  },
  {
    id: 'bra-itacoatiara',
    name: 'ITACOATIARA',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-307',
    name: 'BRA-307',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-39',
    name: 'BRA-39',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-281',
    name: 'BRA-281',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-282',
    name: 'BRA-282',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-245',
    name: 'BRA-245',
    flag: 'BRA',
  },
  {
    id: 'bra-puertoesperanca',
    name: 'PUERTO ESPERANCA',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-243',
    name: 'BRA-243',
    flag: 'BRA',
  },
  {
    id: 'bra-niteroi',
    name: 'NITEROI',
    flag: 'BRA',
  },
  {
    id: 'bra-ilhaguaiba',
    name: 'ILHA GUAIBA',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-63',
    name: 'BRA-63',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-164',
    name: 'BRA-164',
    flag: 'BRA',
  },
  {
    id: 'bra-juruti',
    name: 'JURUTI',
    flag: 'BRA',
  },
  {
    id: 'bra-viladoconde',
    name: 'VILA DO CONDE',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-255',
    name: 'BRA-255',
    flag: 'BRA',
  },
  {
    id: 'bra-tubarao',
    name: 'TUBARAO',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-235',
    name: 'BRA-235',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-113',
    name: 'BRA-113',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-325',
    name: 'BRA-325',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-77',
    name: 'BRA-77',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-194',
    name: 'BRA-194',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-138',
    name: 'BRA-138',
    flag: 'BRA',
  },
  {
    id: 'bra-saosebastiao',
    name: 'SAO SEBASTIAO',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-232',
    name: 'BRA-232',
    flag: 'BRA',
  },
  {
    id: 'bra-portobelo',
    name: 'PORTO BELO',
    flag: 'BRA',
  },
  {
    id: 'bra-fpsovitoria',
    name: 'FPSO VITORIA',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-308',
    name: 'BRA-308',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-313',
    name: 'BRA-313',
    flag: 'BRA',
  },
  {
    id: 'bra-santana',
    name: 'SANTANA',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-249',
    name: 'BRA-249',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-241',
    name: 'BRA-241',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-244',
    name: 'BRA-244',
    flag: 'BRA',
  },
  {
    id: 'bra-santarem',
    name: 'SANTAREM',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-305',
    name: 'BRA-305',
    flag: 'BRA',
  },
  {
    id: 'bra-tramandaianchorage',
    name: 'TRAMANDAI ANCHORAGE',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-258',
    name: 'BRA-258',
    flag: 'BRA',
  },
  {
    id: 'bra-portocel',
    name: 'PORTOCEL',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-81',
    name: 'BRA-81',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-306',
    name: 'BRA-306',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-104',
    name: 'BRA-104',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-302',
    name: 'BRA-302',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-147',
    name: 'BRA-147',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-131',
    name: 'BRA-131',
    flag: 'BRA',
  },
  {
    id: 'bra-salvador',
    name: 'SALVADOR',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-98',
    name: 'BRA-98',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-100',
    name: 'BRA-100',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-248',
    name: 'BRA-248',
    flag: 'BRA',
  },
  {
    id: 'bra-cabedelo',
    name: 'CABEDELO',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-283',
    name: 'BRA-283',
    flag: 'BRA',
  },
  {
    id: 'bra-macapabayanchorage',
    name: 'MACAPA BAY ANCHORAGE',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-na',
    name: 'BRA-NA',
    flag: 'BRA',
  },
  {
    id: 'bra-vitoria',
    name: 'VITORIA',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-159',
    name: 'BRA-159',
    flag: 'BRA',
  },
  {
    id: 'bra-saoluis',
    name: 'SAO LUIS',
    flag: 'BRA',
  },
  {
    id: 'bra-pecem',
    name: 'PECEM',
    flag: 'BRA',
  },
  {
    id: 'bra-portodemucuripe',
    name: 'PORTO DE MUCURIPE',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-72',
    name: 'BRA-72',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-158',
    name: 'BRA-158',
    flag: 'BRA',
  },
  {
    id: 'bra-portodesuape',
    name: 'PORTO DE SUAPE',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-280',
    name: 'BRA-280',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-70',
    name: 'BRA-70',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-238',
    name: 'BRA-238',
    flag: 'BRA',
  },
  {
    id: 'bra-manaus',
    name: 'MANAUS',
    flag: 'BRA',
  },
  {
    id: 'bra-suape',
    name: 'SUAPE',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-157',
    name: 'BRA-157',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-33',
    name: 'BRA-33',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-212',
    name: 'BRA-212',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-46',
    name: 'BRA-46',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-78',
    name: 'BRA-78',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-79',
    name: 'BRA-79',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-28',
    name: 'BRA-28',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-233',
    name: 'BRA-233',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-166',
    name: 'BRA-166',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-321',
    name: 'BRA-321',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-236',
    name: 'BRA-236',
    flag: 'BRA',
  },
  {
    id: 'bra-fsomacae',
    name: 'FSO MACAE',
    flag: 'BRA',
  },
  {
    id: 'bra-coari',
    name: 'COARI',
    flag: 'BRA',
  },
  {
    id: 'bra-vilavelha',
    name: 'VILA VELHA',
    flag: 'BRA',
  },
  {
    id: 'bra-guaruja',
    name: 'GUARUJA',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-276',
    name: 'BRA-276',
    flag: 'BRA',
  },
  {
    id: 'bra-ubu',
    name: 'UBU',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-290',
    name: 'BRA-290',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-62',
    name: 'BRA-62',
    flag: 'BRA',
  },
  {
    id: 'bra-portodoacu',
    name: 'PORTO DO ACU',
    flag: 'BRA',
  },
  {
    id: 'bra-imbituba',
    name: 'IMBITUBA',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-57',
    name: 'BRA-57',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-279',
    name: 'BRA-279',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-51',
    name: 'BRA-51',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-110',
    name: 'BRA-110',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-162',
    name: 'BRA-162',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-93',
    name: 'BRA-93',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-304',
    name: 'BRA-304',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-320',
    name: 'BRA-320',
    flag: 'BRA',
  },
  {
    id: 'bra-ladario',
    name: 'LADARIO',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-83',
    name: 'BRA-83',
    flag: 'BRA',
  },
  {
    id: 'bra-botafogo',
    name: 'BOTAFOGO',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-94',
    name: 'BRA-94',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-329',
    name: 'BRA-329',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-2',
    name: 'BRA-2',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-41',
    name: 'BRA-41',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-67',
    name: 'BRA-67',
    flag: 'BRA',
  },
  {
    id: 'bra-santosanchorage',
    name: 'SANTOS ANCHORAGE',
    flag: 'BRA',
  },
  {
    id: 'bra-dtse/geguaoilterminal',
    name: 'DTSE / GEGUA OIL TERMINAL',
    flag: 'BRA',
  },
  {
    id: 'bra-angradosreis',
    name: 'ANGRA DOS REIS',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-61',
    name: 'BRA-61',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-92',
    name: 'BRA-92',
    flag: 'BRA',
  },
  {
    id: 'bra-saofrancisco',
    name: 'SAO FRANCISCO',
    flag: 'BRA',
  },
  {
    id: 'bra-itaguai',
    name: 'ITAGUAI',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-303',
    name: 'BRA-303',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-49',
    name: 'BRA-49',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-85',
    name: 'BRA-85',
    flag: 'BRA',
  },
  {
    id: 'bra-pelotas',
    name: 'PELOTAS',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-261',
    name: 'BRA-261',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-74',
    name: 'BRA-74',
    flag: 'BRA',
  },
  {
    id: 'bra-aracaju',
    name: 'ARACAJU',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-161',
    name: 'BRA-161',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-247',
    name: 'BRA-247',
    flag: 'BRA',
  },
  {
    id: 'bra-saofranciscodosul',
    name: 'SAO FRANCISCO DO SUL',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-246',
    name: 'BRA-246',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-37',
    name: 'BRA-37',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-239',
    name: 'BRA-239',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-250',
    name: 'BRA-250',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-59',
    name: 'BRA-59',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-269',
    name: 'BRA-269',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-253',
    name: 'BRA-253',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-52',
    name: 'BRA-52',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-256',
    name: 'BRA-256',
    flag: 'BRA',
  },
  {
    id: 'bra-recife',
    name: 'RECIFE',
    flag: 'BRA',
  },
  {
    id: 'bra-santosbasin',
    name: 'SANTOS BASIN',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-251',
    name: 'BRA-251',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-277',
    name: 'BRA-277',
    flag: 'BRA',
  },
  {
    id: 'bra-belem',
    name: 'BELEM',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-65',
    name: 'BRA-65',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-29',
    name: 'BRA-29',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-311',
    name: 'BRA-311',
    flag: 'BRA',
  },
  {
    id: 'bra-macae',
    name: 'MACAE',
    flag: 'BRA',
  },
  {
    id: 'bra-paranagua',
    name: 'PARANAGUA',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-58',
    name: 'BRA-58',
    flag: 'BRA',
  },
  {
    id: 'bra-natal',
    name: 'NATAL',
    flag: 'BRA',
  },
  {
    id: 'bra-fpsocapixaba',
    name: 'FPSO CAPIXABA',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-318',
    name: 'BRA-318',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-60',
    name: 'BRA-60',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-301',
    name: 'BRA-301',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-130',
    name: 'BRA-130',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-14',
    name: 'BRA-14',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-140',
    name: 'BRA-140',
    flag: 'BRA',
  },
  {
    id: 'bra-aratu',
    name: 'ARATU',
    flag: 'BRA',
  },
  {
    id: 'bra-fortaleza',
    name: 'FORTALEZA',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-309',
    name: 'BRA-309',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-116',
    name: 'BRA-116',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-234',
    name: 'BRA-234',
    flag: 'BRA',
  },
  {
    id: 'bra-bra-32',
    name: 'BRA-32',
    flag: 'BRA',
  },
  {
    id: 'bra-ilheus',
    name: 'ILHEUS',
    flag: 'BRA',
  },
  {
    id: 'can-can-180',
    name: 'CAN-180',
    flag: 'CAN',
  },
  {
    id: 'can-can-44',
    name: 'CAN-44',
    flag: 'CAN',
  },
  {
    id: 'can-conceptionbaysouth',
    name: 'CONCEPTION BAY SOUTH',
    flag: 'CAN',
  },
  {
    id: 'can-troisrivieres',
    name: 'TROIS RIVIERES',
    flag: 'CAN',
  },
  {
    id: 'can-ottawa',
    name: 'OTTAWA',
    flag: 'CAN',
  },
  {
    id: 'can-can-93',
    name: 'CAN-93',
    flag: 'CAN',
  },
  {
    id: 'can-cowichanbay',
    name: 'COWICHAN BAY',
    flag: 'CAN',
  },
  {
    id: 'can-blacksharbour',
    name: 'BLACKS HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-charlottetown',
    name: 'CHARLOTTETOWN',
    flag: 'CAN',
  },
  {
    id: 'can-can-221',
    name: 'CAN-221',
    flag: 'CAN',
  },
  {
    id: 'can-yarmouth',
    name: 'YARMOUTH',
    flag: 'CAN',
  },
  {
    id: 'can-can-60',
    name: 'CAN-60',
    flag: 'CAN',
  },
  {
    id: 'can-can-350',
    name: 'CAN-350',
    flag: 'CAN',
  },
  {
    id: 'can-portlatour',
    name: 'PORT LA TOUR',
    flag: 'CAN',
  },
  {
    id: 'can-can-131',
    name: 'CAN-131',
    flag: 'CAN',
  },
  {
    id: 'can-saintzotique',
    name: 'SAINT ZOTIQUE',
    flag: 'CAN',
  },
  {
    id: 'can-sydney',
    name: 'SYDNEY',
    flag: 'CAN',
  },
  {
    id: 'can-can-196',
    name: 'CAN-196',
    flag: 'CAN',
  },
  {
    id: 'can-can-174',
    name: 'CAN-174',
    flag: 'CAN',
  },
  {
    id: 'can-can-120',
    name: 'CAN-120',
    flag: 'CAN',
  },
  {
    id: 'can-can-90',
    name: 'CAN-90',
    flag: 'CAN',
  },
  {
    id: 'can-can-1',
    name: 'CAN-1',
    flag: 'CAN',
  },
  {
    id: 'can-can-138',
    name: 'CAN-138',
    flag: 'CAN',
  },
  {
    id: 'can-quebec',
    name: 'QUEBEC',
    flag: 'CAN',
  },
  {
    id: 'can-steveston',
    name: 'STEVESTON',
    flag: 'CAN',
  },
  {
    id: 'can-harmac',
    name: 'HARMAC',
    flag: 'CAN',
  },
  {
    id: 'can-can-236',
    name: 'CAN-236',
    flag: 'CAN',
  },
  {
    id: 'can-ucluelet',
    name: 'UCLUELET',
    flag: 'CAN',
  },
  {
    id: 'can-can-234',
    name: 'CAN-234',
    flag: 'CAN',
  },
  {
    id: 'can-lowerwoodsharbour',
    name: 'LOWER WOODS HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-gorgehabour',
    name: 'GORGE HABOUR',
    flag: 'CAN',
  },
  {
    id: 'can-can-53',
    name: 'CAN-53',
    flag: 'CAN',
  },
  {
    id: 'can-heriotbay',
    name: 'HERIOT BAY',
    flag: 'CAN',
  },
  {
    id: 'can-can-202',
    name: 'CAN-202',
    flag: 'CAN',
  },
  {
    id: 'can-can-272',
    name: 'CAN-272',
    flag: 'CAN',
  },
  {
    id: 'can-can-300',
    name: 'CAN-300',
    flag: 'CAN',
  },
  {
    id: 'can-clarkson',
    name: 'CLARKSON',
    flag: 'CAN',
  },
  {
    id: 'can-porthardy',
    name: 'PORT HARDY',
    flag: 'CAN',
  },
  {
    id: 'can-can-287',
    name: 'CAN-287',
    flag: 'CAN',
  },
  {
    id: 'can-can-279',
    name: 'CAN-279',
    flag: 'CAN',
  },
  {
    id: 'can-tofino',
    name: 'TOFINO',
    flag: 'CAN',
  },
  {
    id: 'can-can-100',
    name: 'CAN-100',
    flag: 'CAN',
  },
  {
    id: 'can-can-244',
    name: 'CAN-244',
    flag: 'CAN',
  },
  {
    id: 'can-dentisland',
    name: 'DENT ISLAND',
    flag: 'CAN',
  },
  {
    id: 'can-halifax',
    name: 'HALIFAX',
    flag: 'CAN',
  },
  {
    id: 'can-can-35',
    name: 'CAN-35',
    flag: 'CAN',
  },
  {
    id: 'can-can-182',
    name: 'CAN-182',
    flag: 'CAN',
  },
  {
    id: 'can-westview',
    name: 'WESTVIEW',
    flag: 'CAN',
  },
  {
    id: 'can-meldrumbay',
    name: 'MELDRUM BAY',
    flag: 'CAN',
  },
  {
    id: 'can-can-134',
    name: 'CAN-134',
    flag: 'CAN',
  },
  {
    id: 'can-can-235',
    name: 'CAN-235',
    flag: 'CAN',
  },
  {
    id: 'can-lewisporte',
    name: 'LEWISPORTE',
    flag: 'CAN',
  },
  {
    id: 'can-can-215',
    name: 'CAN-215',
    flag: 'CAN',
  },
  {
    id: 'can-sheetharbour',
    name: 'SHEET HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-windsor',
    name: 'WINDSOR',
    flag: 'CAN',
  },
  {
    id: 'can-dartmouth',
    name: 'DARTMOUTH',
    flag: 'CAN',
  },
  {
    id: 'can-can-45',
    name: 'CAN-45',
    flag: 'CAN',
  },
  {
    id: 'can-victoria',
    name: 'VICTORIA',
    flag: 'CAN',
  },
  {
    id: 'can-dalhousie',
    name: 'DALHOUSIE',
    flag: 'CAN',
  },
  {
    id: 'can-can-188',
    name: 'CAN-188',
    flag: 'CAN',
  },
  {
    id: 'can-canaport(st.john)',
    name: 'CANAPORT (ST. JOHN)',
    flag: 'CAN',
  },
  {
    id: 'can-can-411',
    name: 'CAN-411',
    flag: 'CAN',
  },
  {
    id: 'can-can-191',
    name: 'CAN-191',
    flag: 'CAN',
  },
  {
    id: 'can-can-12',
    name: 'CAN-12',
    flag: 'CAN',
  },
  {
    id: 'can-tribunebay',
    name: 'TRIBUNE BAY',
    flag: 'CAN',
  },
  {
    id: 'can-can-92',
    name: 'CAN-92',
    flag: 'CAN',
  },
  {
    id: 'can-can-163',
    name: 'CAN-163',
    flag: 'CAN',
  },
  {
    id: 'can-can-339',
    name: 'CAN-339',
    flag: 'CAN',
  },
  {
    id: 'can-can-441',
    name: 'CAN-441',
    flag: 'CAN',
  },
  {
    id: 'can-can-126',
    name: 'CAN-126',
    flag: 'CAN',
  },
  {
    id: 'can-can-216',
    name: 'CAN-216',
    flag: 'CAN',
  },
  {
    id: 'can-can-21',
    name: 'CAN-21',
    flag: 'CAN',
  },
  {
    id: 'can-thunderbay',
    name: 'THUNDER BAY',
    flag: 'CAN',
  },
  {
    id: 'can-can-227',
    name: 'CAN-227',
    flag: 'CAN',
  },
  {
    id: 'can-portauxbasques',
    name: 'PORT AUX BASQUES',
    flag: 'CAN',
  },
  {
    id: 'can-can-446',
    name: 'CAN-446',
    flag: 'CAN',
  },
  {
    id: 'can-argyle',
    name: 'ARGYLE',
    flag: 'CAN',
  },
  {
    id: 'can-portcredit',
    name: 'PORT CREDIT',
    flag: 'CAN',
  },
  {
    id: 'can-can-198',
    name: 'CAN-198',
    flag: 'CAN',
  },
  {
    id: 'can-portmouton',
    name: 'PORT MOUTON',
    flag: 'CAN',
  },
  {
    id: 'can-can-181',
    name: 'CAN-181',
    flag: 'CAN',
  },
  {
    id: 'can-can-340',
    name: 'CAN-340',
    flag: 'CAN',
  },
  {
    id: 'can-baiecomeau',
    name: 'BAIE COMEAU',
    flag: 'CAN',
  },
  {
    id: 'can-can-146',
    name: 'CAN-146',
    flag: 'CAN',
  },
  {
    id: 'can-can-23',
    name: 'CAN-23',
    flag: 'CAN',
  },
  {
    id: 'can-can-417',
    name: 'CAN-417',
    flag: 'CAN',
  },
  {
    id: 'can-can-127',
    name: 'CAN-127',
    flag: 'CAN',
  },
  {
    id: 'can-toronto',
    name: 'TORONTO',
    flag: 'CAN',
  },
  {
    id: 'can-can-72',
    name: 'CAN-72',
    flag: 'CAN',
  },
  {
    id: 'can-fishermanscove',
    name: 'FISHERMANS COVE',
    flag: 'CAN',
  },
  {
    id: 'can-can-118',
    name: 'CAN-118',
    flag: 'CAN',
  },
  {
    id: 'can-tadoussac',
    name: 'TADOUSSAC',
    flag: 'CAN',
  },
  {
    id: 'can-can-157',
    name: 'CAN-157',
    flag: 'CAN',
  },
  {
    id: 'can-bamberton',
    name: 'BAMBERTON',
    flag: 'CAN',
  },
  {
    id: 'can-can-5',
    name: 'CAN-5',
    flag: 'CAN',
  },
  {
    id: 'can-can-275',
    name: 'CAN-275',
    flag: 'CAN',
  },
  {
    id: 'can-can-103',
    name: 'CAN-103',
    flag: 'CAN',
  },
  {
    id: 'can-can-456',
    name: 'CAN-456',
    flag: 'CAN',
  },
  {
    id: 'can-can-359',
    name: 'CAN-359',
    flag: 'CAN',
  },
  {
    id: 'can-can-250',
    name: 'CAN-250',
    flag: 'CAN',
  },
  {
    id: 'can-can-267',
    name: 'CAN-267',
    flag: 'CAN',
  },
  {
    id: 'can-can-284',
    name: 'CAN-284',
    flag: 'CAN',
  },
  {
    id: 'can-can-167',
    name: 'CAN-167',
    flag: 'CAN',
  },
  {
    id: 'can-can-428',
    name: 'CAN-428',
    flag: 'CAN',
  },
  {
    id: 'can-can-298',
    name: 'CAN-298',
    flag: 'CAN',
  },
  {
    id: 'can-can-338',
    name: 'CAN-338',
    flag: 'CAN',
  },
  {
    id: 'can-can-205',
    name: 'CAN-205',
    flag: 'CAN',
  },
  {
    id: 'can-can-210',
    name: 'CAN-210',
    flag: 'CAN',
  },
  {
    id: 'can-can-15',
    name: 'CAN-15',
    flag: 'CAN',
  },
  {
    id: 'can-can-108',
    name: 'CAN-108',
    flag: 'CAN',
  },
  {
    id: 'can-can-439',
    name: 'CAN-439',
    flag: 'CAN',
  },
  {
    id: 'can-can-185',
    name: 'CAN-185',
    flag: 'CAN',
  },
  {
    id: 'can-can-276',
    name: 'CAN-276',
    flag: 'CAN',
  },
  {
    id: 'can-can-380',
    name: 'CAN-380',
    flag: 'CAN',
  },
  {
    id: 'can-can-24',
    name: 'CAN-24',
    flag: 'CAN',
  },
  {
    id: 'can-baddeck',
    name: 'BADDECK',
    flag: 'CAN',
  },
  {
    id: 'can-can-189',
    name: 'CAN-189',
    flag: 'CAN',
  },
  {
    id: 'can-can-333',
    name: 'CAN-333',
    flag: 'CAN',
  },
  {
    id: 'can-saintlawrence',
    name: 'SAINT LAWRENCE',
    flag: 'CAN',
  },
  {
    id: 'can-buccaneerbay',
    name: 'BUCCANEER BAY',
    flag: 'CAN',
  },
  {
    id: 'can-can-105',
    name: 'CAN-105',
    flag: 'CAN',
  },
  {
    id: 'can-can-209',
    name: 'CAN-209',
    flag: 'CAN',
  },
  {
    id: 'can-can-19',
    name: 'CAN-19',
    flag: 'CAN',
  },
  {
    id: 'can-northeastpoint',
    name: 'NORTH EAST POINT',
    flag: 'CAN',
  },
  {
    id: 'can-can-450',
    name: 'CAN-450',
    flag: 'CAN',
  },
  {
    id: 'can-montreal-est',
    name: 'MONTREAL-EST',
    flag: 'CAN',
  },
  {
    id: 'can-bellabella',
    name: 'BELLA BELLA',
    flag: 'CAN',
  },
  {
    id: 'can-can-436',
    name: 'CAN-436',
    flag: 'CAN',
  },
  {
    id: 'can-minkisland',
    name: 'MINK ISLAND',
    flag: 'CAN',
  },
  {
    id: 'can-canso',
    name: 'CANSO',
    flag: 'CAN',
  },
  {
    id: 'can-burgeo',
    name: 'BURGEO',
    flag: 'CAN',
  },
  {
    id: 'can-queencharlotte',
    name: 'QUEEN CHARLOTTE',
    flag: 'CAN',
  },
  {
    id: 'can-victoriaharbor',
    name: 'VICTORIA HARBOR',
    flag: 'CAN',
  },
  {
    id: 'can-penderharbour',
    name: 'PENDER HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-portdebecancour',
    name: 'PORT DE BECANCOUR',
    flag: 'CAN',
  },
  {
    id: 'can-can-208',
    name: 'CAN-208',
    flag: 'CAN',
  },
  {
    id: 'can-can-130',
    name: 'CAN-130',
    flag: 'CAN',
  },
  {
    id: 'can-can-317',
    name: 'CAN-317',
    flag: 'CAN',
  },
  {
    id: 'can-can-115',
    name: 'CAN-115',
    flag: 'CAN',
  },
  {
    id: 'can-can-252',
    name: 'CAN-252',
    flag: 'CAN',
  },
  {
    id: 'can-can-303',
    name: 'CAN-303',
    flag: 'CAN',
  },
  {
    id: 'can-esquimalt',
    name: 'ESQUIMALT',
    flag: 'CAN',
  },
  {
    id: 'can-can-91',
    name: 'CAN-91',
    flag: 'CAN',
  },
  {
    id: 'can-cadborobay',
    name: 'CADBORO BAY',
    flag: 'CAN',
  },
  {
    id: 'can-northarm',
    name: 'NORTH ARM',
    flag: 'CAN',
  },
  {
    id: 'can-can-175',
    name: 'CAN-175',
    flag: 'CAN',
  },
  {
    id: 'can-can-170',
    name: 'CAN-170',
    flag: 'CAN',
  },
  {
    id: 'can-can-114',
    name: 'CAN-114',
    flag: 'CAN',
  },
  {
    id: 'can-can-56',
    name: 'CAN-56',
    flag: 'CAN',
  },
  {
    id: 'can-clarksharbour',
    name: 'CLARKS HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-digby',
    name: 'DIGBY',
    flag: 'CAN',
  },
  {
    id: 'can-deceptionbay',
    name: 'DECEPTION BAY',
    flag: 'CAN',
  },
  {
    id: 'can-comebychanceharbor',
    name: 'COME BY CHANCE HARBOR',
    flag: 'CAN',
  },
  {
    id: 'can-bayroberts',
    name: 'BAY ROBERTS',
    flag: 'CAN',
  },
  {
    id: 'can-can-193',
    name: 'CAN-193',
    flag: 'CAN',
  },
  {
    id: 'can-lesmechins',
    name: 'LES MECHINS',
    flag: 'CAN',
  },
  {
    id: 'can-campbellriver',
    name: 'CAMPBELL RIVER',
    flag: 'CAN',
  },
  {
    id: 'can-portcolborne',
    name: 'PORT COLBORNE',
    flag: 'CAN',
  },
  {
    id: 'can-portweller',
    name: 'PORT WELLER',
    flag: 'CAN',
  },
  {
    id: 'can-can-152',
    name: 'CAN-152',
    flag: 'CAN',
  },
  {
    id: 'can-stjohn',
    name: 'ST JOHN',
    flag: 'CAN',
  },
  {
    id: 'can-can-178',
    name: 'CAN-178',
    flag: 'CAN',
  },
  {
    id: 'can-canaport',
    name: 'CANAPORT',
    flag: 'CAN',
  },
  {
    id: 'can-can-379',
    name: 'CAN-379',
    flag: 'CAN',
  },
  {
    id: 'can-can-204',
    name: 'CAN-204',
    flag: 'CAN',
  },
  {
    id: 'can-portmoody',
    name: 'PORT MOODY',
    flag: 'CAN',
  },
  {
    id: 'can-can-437',
    name: 'CAN-437',
    flag: 'CAN',
  },
  {
    id: 'can-can-447',
    name: 'CAN-447',
    flag: 'CAN',
  },
  {
    id: 'can-can-94',
    name: 'CAN-94',
    flag: 'CAN',
  },
  {
    id: 'can-can-296',
    name: 'CAN-296',
    flag: 'CAN',
  },
  {
    id: 'can-can-413',
    name: 'CAN-413',
    flag: 'CAN',
  },
  {
    id: 'can-septiles',
    name: 'SEPT ILES',
    flag: 'CAN',
  },
  {
    id: 'can-masset',
    name: 'MASSET',
    flag: 'CAN',
  },
  {
    id: 'can-thorold',
    name: 'THOROLD',
    flag: 'CAN',
  },
  {
    id: 'can-can-206',
    name: 'CAN-206',
    flag: 'CAN',
  },
  {
    id: 'can-can-344',
    name: 'CAN-344',
    flag: 'CAN',
  },
  {
    id: 'can-can-137',
    name: 'CAN-137',
    flag: 'CAN',
  },
  {
    id: 'can-tsawwassen',
    name: 'TSAWWASSEN',
    flag: 'CAN',
  },
  {
    id: 'can-comox',
    name: 'COMOX',
    flag: 'CAN',
  },
  {
    id: 'can-can-442',
    name: 'CAN-442',
    flag: 'CAN',
  },
  {
    id: 'can-can-292',
    name: 'CAN-292',
    flag: 'CAN',
  },
  {
    id: 'can-can-71',
    name: 'CAN-71',
    flag: 'CAN',
  },
  {
    id: 'can-can-83',
    name: 'CAN-83',
    flag: 'CAN',
  },
  {
    id: 'can-can-121',
    name: 'CAN-121',
    flag: 'CAN',
  },
  {
    id: 'can-kitimat',
    name: 'KITIMAT',
    flag: 'CAN',
  },
  {
    id: 'can-can-291',
    name: 'CAN-291',
    flag: 'CAN',
  },
  {
    id: 'can-can-440',
    name: 'CAN-440',
    flag: 'CAN',
  },
  {
    id: 'can-can-240',
    name: 'CAN-240',
    flag: 'CAN',
  },
  {
    id: 'can-can-39',
    name: 'CAN-39',
    flag: 'CAN',
  },
  {
    id: 'can-can-111',
    name: 'CAN-111',
    flag: 'CAN',
  },
  {
    id: 'can-sooke',
    name: 'SOOKE',
    flag: 'CAN',
  },
  {
    id: 'can-can-61',
    name: 'CAN-61',
    flag: 'CAN',
  },
  {
    id: 'can-can-29',
    name: 'CAN-29',
    flag: 'CAN',
  },
  {
    id: 'can-can-328',
    name: 'CAN-328',
    flag: 'CAN',
  },
  {
    id: 'can-can-81',
    name: 'CAN-81',
    flag: 'CAN',
  },
  {
    id: 'can-can-331',
    name: 'CAN-331',
    flag: 'CAN',
  },
  {
    id: 'can-porthawkesbury',
    name: 'PORT HAWKESBURY',
    flag: 'CAN',
  },
  {
    id: 'can-can-248',
    name: 'CAN-248',
    flag: 'CAN',
  },
  {
    id: 'can-can-355',
    name: 'CAN-355',
    flag: 'CAN',
  },
  {
    id: 'can-can-37',
    name: 'CAN-37',
    flag: 'CAN',
  },
  {
    id: 'can-can-374',
    name: 'CAN-374',
    flag: 'CAN',
  },
  {
    id: 'can-can-295',
    name: 'CAN-295',
    flag: 'CAN',
  },
  {
    id: 'can-can-443',
    name: 'CAN-443',
    flag: 'CAN',
  },
  {
    id: 'can-can-457',
    name: 'CAN-457',
    flag: 'CAN',
  },
  {
    id: 'can-sambro',
    name: 'SAMBRO',
    flag: 'CAN',
  },
  {
    id: 'can-ballantynescove',
    name: 'BALLANTYNES COVE',
    flag: 'CAN',
  },
  {
    id: 'can-cornwall',
    name: 'CORNWALL',
    flag: 'CAN',
  },
  {
    id: 'can-matane',
    name: 'MATANE',
    flag: 'CAN',
  },
  {
    id: 'can-can-51',
    name: 'CAN-51',
    flag: 'CAN',
  },
  {
    id: 'can-can-362',
    name: 'CAN-362',
    flag: 'CAN',
  },
  {
    id: 'can-cashelcove',
    name: 'CASHEL COVE',
    flag: 'CAN',
  },
  {
    id: 'can-lowerlakesterminal',
    name: 'LOWER LAKES TERMINAL',
    flag: 'CAN',
  },
  {
    id: 'can-can-397',
    name: 'CAN-397',
    flag: 'CAN',
  },
  {
    id: 'can-louisburg',
    name: 'LOUISBURG',
    flag: 'CAN',
  },
  {
    id: 'can-can-226',
    name: 'CAN-226',
    flag: 'CAN',
  },
  {
    id: 'can-wedgeport',
    name: 'WEDGEPORT',
    flag: 'CAN',
  },
  {
    id: 'can-littlecurrent',
    name: 'LITTLE CURRENT',
    flag: 'CAN',
  },
  {
    id: 'can-can-360',
    name: 'CAN-360',
    flag: 'CAN',
  },
  {
    id: 'can-can-27',
    name: 'CAN-27',
    flag: 'CAN',
  },
  {
    id: 'can-can-288',
    name: 'CAN-288',
    flag: 'CAN',
  },
  {
    id: 'can-caraquet',
    name: 'CARAQUET',
    flag: 'CAN',
  },
  {
    id: 'can-can-58',
    name: 'CAN-58',
    flag: 'CAN',
  },
  {
    id: 'can-can-449',
    name: 'CAN-449',
    flag: 'CAN',
  },
  {
    id: 'can-portalberni',
    name: 'PORT ALBERNI',
    flag: 'CAN',
  },
  {
    id: 'can-can-214',
    name: 'CAN-214',
    flag: 'CAN',
  },
  {
    id: 'can-can-144',
    name: 'CAN-144',
    flag: 'CAN',
  },
  {
    id: 'can-can-348',
    name: 'CAN-348',
    flag: 'CAN',
  },
  {
    id: 'can-can-283',
    name: 'CAN-283',
    flag: 'CAN',
  },
  {
    id: 'can-cornerbrook',
    name: 'CORNER BROOK',
    flag: 'CAN',
  },
  {
    id: 'can-can-1542',
    name: 'CAN-1542',
    flag: 'CAN',
  },
  {
    id: 'can-can-445',
    name: 'CAN-445',
    flag: 'CAN',
  },
  {
    id: 'can-nanooseharbor',
    name: 'NANOOSE HARBOR',
    flag: 'CAN',
  },
  {
    id: 'can-portedward',
    name: 'PORT EDWARD',
    flag: 'CAN',
  },
  {
    id: 'can-gaspe',
    name: 'GASPE',
    flag: 'CAN',
  },
  {
    id: 'can-can-194',
    name: 'CAN-194',
    flag: 'CAN',
  },
  {
    id: 'can-portbayside',
    name: 'PORT BAYSIDE',
    flag: 'CAN',
  },
  {
    id: 'can-can-398',
    name: 'CAN-398',
    flag: 'CAN',
  },
  {
    id: 'can-portcartier',
    name: 'PORT CARTIER',
    flag: 'CAN',
  },
  {
    id: 'can-can-16',
    name: 'CAN-16',
    flag: 'CAN',
  },
  {
    id: 'can-can-343',
    name: 'CAN-343',
    flag: 'CAN',
  },
  {
    id: 'can-leamington',
    name: 'LEAMINGTON',
    flag: 'CAN',
  },
  {
    id: 'can-dorval',
    name: 'DORVAL',
    flag: 'CAN',
  },
  {
    id: 'can-goosebay',
    name: 'GOOSE BAY',
    flag: 'CAN',
  },
  {
    id: 'can-can-369',
    name: 'CAN-369',
    flag: 'CAN',
  },
  {
    id: 'can-can-435',
    name: 'CAN-435',
    flag: 'CAN',
  },
  {
    id: 'can-can-299',
    name: 'CAN-299',
    flag: 'CAN',
  },
  {
    id: 'can-can-452',
    name: 'CAN-452',
    flag: 'CAN',
  },
  {
    id: 'can-can-268',
    name: 'CAN-268',
    flag: 'CAN',
  },
  {
    id: 'can-saintjohn',
    name: 'SAINT JOHN',
    flag: 'CAN',
  },
  {
    id: 'can-can-166',
    name: 'CAN-166',
    flag: 'CAN',
  },
  {
    id: 'can-can-177',
    name: 'CAN-177',
    flag: 'CAN',
  },
  {
    id: 'can-lunenburg',
    name: 'LUNENBURG',
    flag: 'CAN',
  },
  {
    id: 'can-can-104',
    name: 'CAN-104',
    flag: 'CAN',
  },
  {
    id: 'can-squamish',
    name: 'SQUAMISH',
    flag: 'CAN',
  },
  {
    id: 'can-can-245',
    name: 'CAN-245',
    flag: 'CAN',
  },
  {
    id: 'can-can-9',
    name: 'CAN-9',
    flag: 'CAN',
  },
  {
    id: 'can-shearwater',
    name: 'SHEARWATER',
    flag: 'CAN',
  },
  {
    id: 'can-sainte-catherine',
    name: 'SAINTE-CATHERINE',
    flag: 'CAN',
  },
  {
    id: 'can-can-230',
    name: 'CAN-230',
    flag: 'CAN',
  },
  {
    id: 'can-can-448',
    name: 'CAN-448',
    flag: 'CAN',
  },
  {
    id: 'can-can-212',
    name: 'CAN-212',
    flag: 'CAN',
  },
  {
    id: 'can-can-66',
    name: 'CAN-66',
    flag: 'CAN',
  },
  {
    id: 'can-can-330',
    name: 'CAN-330',
    flag: 'CAN',
  },
  {
    id: 'can-can-110',
    name: 'CAN-110',
    flag: 'CAN',
  },
  {
    id: 'can-killarney',
    name: 'KILLARNEY',
    flag: 'CAN',
  },
  {
    id: 'can-ladysmith',
    name: 'LADYSMITH',
    flag: 'CAN',
  },
  {
    id: 'can-can-312',
    name: 'CAN-312',
    flag: 'CAN',
  },
  {
    id: 'can-can-395',
    name: 'CAN-395',
    flag: 'CAN',
  },
  {
    id: 'can-churchill',
    name: 'CHURCHILL',
    flag: 'CAN',
  },
  {
    id: 'can-can-347',
    name: 'CAN-347',
    flag: 'CAN',
  },
  {
    id: 'can-can-124',
    name: 'CAN-124',
    flag: 'CAN',
  },
  {
    id: 'can-hamilton',
    name: 'HAMILTON',
    flag: 'CAN',
  },
  {
    id: 'can-can-82',
    name: 'CAN-82',
    flag: 'CAN',
  },
  {
    id: 'can-can-431',
    name: 'CAN-431',
    flag: 'CAN',
  },
  {
    id: 'can-can-85',
    name: 'CAN-85',
    flag: 'CAN',
  },
  {
    id: 'can-rimouski',
    name: 'RIMOUSKI',
    flag: 'CAN',
  },
  {
    id: 'can-can-195',
    name: 'CAN-195',
    flag: 'CAN',
  },
  {
    id: 'can-can-329',
    name: 'CAN-329',
    flag: 'CAN',
  },
  {
    id: 'can-sorel',
    name: 'SOREL',
    flag: 'CAN',
  },
  {
    id: 'can-can-327',
    name: 'CAN-327',
    flag: 'CAN',
  },
  {
    id: 'can-can-128',
    name: 'CAN-128',
    flag: 'CAN',
  },
  {
    id: 'can-can-217',
    name: 'CAN-217',
    flag: 'CAN',
  },
  {
    id: 'can-northvancouver',
    name: 'NORTH VANCOUVER',
    flag: 'CAN',
  },
  {
    id: 'can-can-165',
    name: 'CAN-165',
    flag: 'CAN',
  },
  {
    id: 'can-can-190',
    name: 'CAN-190',
    flag: 'CAN',
  },
  {
    id: 'can-vancouver',
    name: 'VANCOUVER',
    flag: 'CAN',
  },
  {
    id: 'can-comebychance',
    name: 'COME BY CHANCE',
    flag: 'CAN',
  },
  {
    id: 'can-can-307',
    name: 'CAN-307',
    flag: 'CAN',
  },
  {
    id: 'can-can-418',
    name: 'CAN-418',
    flag: 'CAN',
  },
  {
    id: 'can-can-135',
    name: 'CAN-135',
    flag: 'CAN',
  },
  {
    id: 'can-can-351',
    name: 'CAN-351',
    flag: 'CAN',
  },
  {
    id: 'can-can-361',
    name: 'CAN-361',
    flag: 'CAN',
  },
  {
    id: 'can-havrestpierre',
    name: 'HAVRE ST PIERRE',
    flag: 'CAN',
  },
  {
    id: 'can-woodsharbour',
    name: 'WOODS HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-can-341',
    name: 'CAN-341',
    flag: 'CAN',
  },
  {
    id: 'can-can-176',
    name: 'CAN-176',
    flag: 'CAN',
  },
  {
    id: 'can-can-414',
    name: 'CAN-414',
    flag: 'CAN',
  },
  {
    id: 'can-can-10',
    name: 'CAN-10',
    flag: 'CAN',
  },
  {
    id: 'can-tsehumharbour',
    name: 'TSEHUM HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-can-260',
    name: 'CAN-260',
    flag: 'CAN',
  },
  {
    id: 'can-can-75',
    name: 'CAN-75',
    flag: 'CAN',
  },
  {
    id: 'can-cambridgebay',
    name: 'CAMBRIDGE BAY',
    flag: 'CAN',
  },
  {
    id: 'can-can-123',
    name: 'CAN-123',
    flag: 'CAN',
  },
  {
    id: 'can-can-381',
    name: 'CAN-381',
    flag: 'CAN',
  },
  {
    id: 'can-portmcneill',
    name: 'PORT MCNEILL',
    flag: 'CAN',
  },
  {
    id: 'can-baydeverde',
    name: 'BAY DE VERDE',
    flag: 'CAN',
  },
  {
    id: 'can-can-211',
    name: 'CAN-211',
    flag: 'CAN',
  },
  {
    id: 'can-pubnico',
    name: 'PUBNICO',
    flag: 'CAN',
  },
  {
    id: 'can-klemtu',
    name: 'KLEMTU',
    flag: 'CAN',
  },
  {
    id: 'can-can-154',
    name: 'CAN-154',
    flag: 'CAN',
  },
  {
    id: 'can-montreal',
    name: 'MONTREAL',
    flag: 'CAN',
  },
  {
    id: 'can-shelburne',
    name: 'SHELBURNE',
    flag: 'CAN',
  },
  {
    id: 'can-can-232',
    name: 'CAN-232',
    flag: 'CAN',
  },
  {
    id: "can-stjohn's",
    name: "ST JOHN'S",
    flag: 'CAN',
  },
  {
    id: 'can-can-382',
    name: 'CAN-382',
    flag: 'CAN',
  },
  {
    id: 'can-ganges',
    name: 'GANGES',
    flag: 'CAN',
  },
  {
    id: 'can-makkovik',
    name: 'MAKKOVIK',
    flag: 'CAN',
  },
  {
    id: 'can-portdalhousie',
    name: 'PORT DALHOUSIE',
    flag: 'CAN',
  },
  {
    id: 'can-can-52',
    name: 'CAN-52',
    flag: 'CAN',
  },
  {
    id: 'can-sandspit',
    name: 'SANDSPIT',
    flag: 'CAN',
  },
  {
    id: 'can-can-153',
    name: 'CAN-153',
    flag: 'CAN',
  },
  {
    id: 'can-can-261',
    name: 'CAN-261',
    flag: 'CAN',
  },
  {
    id: 'can-can-69',
    name: 'CAN-69',
    flag: 'CAN',
  },
  {
    id: 'can-princerupert',
    name: 'PRINCE RUPERT',
    flag: 'CAN',
  },
  {
    id: 'can-goderich',
    name: 'GODERICH',
    flag: 'CAN',
  },
  {
    id: 'can-snugcove',
    name: 'SNUG COVE',
    flag: 'CAN',
  },
  {
    id: 'can-can-404',
    name: 'CAN-404',
    flag: 'CAN',
  },
  {
    id: 'can-sarnia',
    name: 'SARNIA',
    flag: 'CAN',
  },
  {
    id: 'can-gibsons',
    name: 'GIBSONS',
    flag: 'CAN',
  },
  {
    id: 'can-gananoque',
    name: 'GANANOQUE',
    flag: 'CAN',
  },
  {
    id: 'can-can-289',
    name: 'CAN-289',
    flag: 'CAN',
  },
  {
    id: 'can-can-160',
    name: 'CAN-160',
    flag: 'CAN',
  },
  {
    id: 'can-bedwellharbour',
    name: 'BEDWELL HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-variouschannels',
    name: 'VARIOUS CHANNELS',
    flag: 'CAN',
  },
  {
    id: 'can-can-87',
    name: 'CAN-87',
    flag: 'CAN',
  },
  {
    id: 'can-can-454',
    name: 'CAN-454',
    flag: 'CAN',
  },
  {
    id: 'can-can-455',
    name: 'CAN-455',
    flag: 'CAN',
  },
  {
    id: 'can-can-294',
    name: 'CAN-294',
    flag: 'CAN',
  },
  {
    id: 'can-can-101',
    name: 'CAN-101',
    flag: 'CAN',
  },
  {
    id: 'can-can-326',
    name: 'CAN-326',
    flag: 'CAN',
  },
  {
    id: 'can-can-243',
    name: 'CAN-243',
    flag: 'CAN',
  },
  {
    id: 'can-portmellon',
    name: 'PORT MELLON',
    flag: 'CAN',
  },
  {
    id: 'can-labaie(portalfred)',
    name: 'LA BAIE (PORT ALFRED)',
    flag: 'CAN',
  },
  {
    id: 'can-can-353',
    name: 'CAN-353',
    flag: 'CAN',
  },
  {
    id: 'can-can-73',
    name: 'CAN-73',
    flag: 'CAN',
  },
  {
    id: 'can-can-7',
    name: 'CAN-7',
    flag: 'CAN',
  },
  {
    id: 'can-can-233',
    name: 'CAN-233',
    flag: 'CAN',
  },
  {
    id: 'can-can-48',
    name: 'CAN-48',
    flag: 'CAN',
  },
  {
    id: 'can-can-159',
    name: 'CAN-159',
    flag: 'CAN',
  },
  {
    id: 'can-can-156',
    name: 'CAN-156',
    flag: 'CAN',
  },
  {
    id: 'can-can-171',
    name: 'CAN-171',
    flag: 'CAN',
  },
  {
    id: 'can-can-34',
    name: 'CAN-34',
    flag: 'CAN',
  },
  {
    id: 'can-montagueharbour',
    name: 'MONTAGUE HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-can-222',
    name: 'CAN-222',
    flag: 'CAN',
  },
  {
    id: 'can-newwestminster',
    name: 'NEW WESTMINSTER',
    flag: 'CAN',
  },
  {
    id: 'can-can-262',
    name: 'CAN-262',
    flag: 'CAN',
  },
  {
    id: 'can-can-453',
    name: 'CAN-453',
    flag: 'CAN',
  },
  {
    id: 'can-can-336',
    name: 'CAN-336',
    flag: 'CAN',
  },
  {
    id: 'can-shippegan',
    name: 'SHIPPEGAN',
    flag: 'CAN',
  },
  {
    id: 'can-can-213',
    name: 'CAN-213',
    flag: 'CAN',
  },
  {
    id: 'can-can-184',
    name: 'CAN-184',
    flag: 'CAN',
  },
  {
    id: 'can-can-200',
    name: 'CAN-200',
    flag: 'CAN',
  },
  {
    id: 'can-can-310',
    name: 'CAN-310',
    flag: 'CAN',
  },
  {
    id: 'can-can-473',
    name: 'CAN-473',
    flag: 'CAN',
  },
  {
    id: 'can-can-78',
    name: 'CAN-78',
    flag: 'CAN',
  },
  {
    id: 'can-can-349',
    name: 'CAN-349',
    flag: 'CAN',
  },
  {
    id: 'can-portsevern',
    name: 'PORT SEVERN',
    flag: 'CAN',
  },
  {
    id: 'can-cacouna',
    name: 'CACOUNA',
    flag: 'CAN',
  },
  {
    id: 'can-patriciabay',
    name: 'PATRICIA BAY',
    flag: 'CAN',
  },
  {
    id: 'can-southside',
    name: 'SOUTH SIDE',
    flag: 'CAN',
  },
  {
    id: 'can-can-161',
    name: 'CAN-161',
    flag: 'CAN',
  },
  {
    id: 'can-stpierre',
    name: 'ST PIERRE',
    flag: 'CAN',
  },
  {
    id: 'can-alertbay',
    name: 'ALERT BAY',
    flag: 'CAN',
  },
  {
    id: 'can-summerside',
    name: 'SUMMERSIDE',
    flag: 'CAN',
  },
  {
    id: 'can-can-54',
    name: 'CAN-54',
    flag: 'CAN',
  },
  {
    id: 'can-can-365',
    name: 'CAN-365',
    flag: 'CAN',
  },
  {
    id: 'can-nanaimo',
    name: 'NANAIMO',
    flag: 'CAN',
  },
  {
    id: 'can-can-394',
    name: 'CAN-394',
    flag: 'CAN',
  },
  {
    id: 'can-trios-pistolesanchorage',
    name: 'TRIOS-PISTOLES ANCHORAGE',
    flag: 'CAN',
  },
  {
    id: 'can-can-107',
    name: 'CAN-107',
    flag: 'CAN',
  },
  {
    id: 'can-meteghan',
    name: 'METEGHAN',
    flag: 'CAN',
  },
  {
    id: 'can-chemainus',
    name: 'CHEMAINUS',
    flag: 'CAN',
  },
  {
    id: 'can-can-173',
    name: 'CAN-173',
    flag: 'CAN',
  },
  {
    id: 'can-can-142',
    name: 'CAN-142',
    flag: 'CAN',
  },
  {
    id: 'can-can-26',
    name: 'CAN-26',
    flag: 'CAN',
  },
  {
    id: 'can-can-266',
    name: 'CAN-266',
    flag: 'CAN',
  },
  {
    id: 'can-can-201',
    name: 'CAN-201',
    flag: 'CAN',
  },
  {
    id: 'can-can-225',
    name: 'CAN-225',
    flag: 'CAN',
  },
  {
    id: 'can-can-88',
    name: 'CAN-88',
    flag: 'CAN',
  },
  {
    id: 'can-ramea',
    name: 'RAMEA',
    flag: 'CAN',
  },
  {
    id: 'can-can-106',
    name: 'CAN-106',
    flag: 'CAN',
  },
  {
    id: 'can-can-6',
    name: 'CAN-6',
    flag: 'CAN',
  },
  {
    id: 'can-northhead',
    name: 'NORTH HEAD',
    flag: 'CAN',
  },
  {
    id: 'can-can-277',
    name: 'CAN-277',
    flag: 'CAN',
  },
  {
    id: 'can-can-363',
    name: 'CAN-363',
    flag: 'CAN',
  },
  {
    id: 'can-goldriver',
    name: 'GOLD RIVER',
    flag: 'CAN',
  },
  {
    id: 'can-can-438',
    name: 'CAN-438',
    flag: 'CAN',
  },
  {
    id: 'can-can-33',
    name: 'CAN-33',
    flag: 'CAN',
  },
  {
    id: 'can-can-57',
    name: 'CAN-57',
    flag: 'CAN',
  },
  {
    id: 'can-longueuil',
    name: 'LONGUEUIL',
    flag: 'CAN',
  },
  {
    id: 'can-can-102',
    name: 'CAN-102',
    flag: 'CAN',
  },
  {
    id: 'can-can-433',
    name: 'CAN-433',
    flag: 'CAN',
  },
  {
    id: 'can-can-203',
    name: 'CAN-203',
    flag: 'CAN',
  },
  {
    id: 'can-can-237',
    name: 'CAN-237',
    flag: 'CAN',
  },
  {
    id: 'can-can-352',
    name: 'CAN-352',
    flag: 'CAN',
  },
  {
    id: 'can-can-432',
    name: 'CAN-432',
    flag: 'CAN',
  },
  {
    id: 'can-harborgrace',
    name: 'HARBOR GRACE',
    flag: 'CAN',
  },
  {
    id: 'can-can-119',
    name: 'CAN-119',
    flag: 'CAN',
  },
  {
    id: 'can-can-285',
    name: 'CAN-285',
    flag: 'CAN',
  },
  {
    id: 'can-can-421',
    name: 'CAN-421',
    flag: 'CAN',
  },
  {
    id: 'can-argentia',
    name: 'ARGENTIA',
    flag: 'CAN',
  },
  {
    id: 'can-can-125',
    name: 'CAN-125',
    flag: 'CAN',
  },
  {
    id: 'chn-chn-650',
    name: 'CHN-650',
    flag: 'CHN',
  },
  {
    id: 'chn-35b288c5',
    name: '35b288c5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b220cf',
    name: '35b220cf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2',
    name: 'CHN-2',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d72b',
    name: '35b5d72b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-192',
    name: 'CHN-192',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f6d3',
    name: '35b5f6d3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-981',
    name: 'CHN-981',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab0b3',
    name: '35cab0b3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27d65',
    name: '35b27d65',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fc1',
    name: '342c1fc1',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1f85',
    name: '342c1f85',
    flag: 'CHN',
  },
  {
    id: 'chn-340176e9',
    name: '340176e9',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c9e5',
    name: '3403c9e5',
    flag: 'CHN',
  },
  {
    id: 'chn-340170a3',
    name: '340170a3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d5cf',
    name: '35b5d5cf',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae016f',
    name: '35ae016f',
    flag: 'CHN',
  },
  {
    id: 'chn-314e41f9',
    name: '314e41f9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-664',
    name: 'CHN-664',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9fb1',
    name: '342e9fb1',
    flag: 'CHN',
  },
  {
    id: 'chn-34024bb9',
    name: '34024bb9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27a89',
    name: '35b27a89',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad8f49',
    name: '35ad8f49',
    flag: 'CHN',
  },
  {
    id: 'chn-3431b6fd',
    name: '3431b6fd',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6f4e5',
    name: '35b6f4e5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f097',
    name: '35b5f097',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1111',
    name: 'CHN-1111',
    flag: 'CHN',
  },
  {
    id: 'chn-34352bf9',
    name: '34352bf9',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9e4b',
    name: '342e9e4b',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9eef',
    name: '342e9eef',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b513',
    name: '3403b513',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbc3',
    name: '35cacbc3',
    flag: 'CHN',
  },
  {
    id: 'chn-34347429',
    name: '34347429',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68913',
    name: '35b68913',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2ddf',
    name: '35ac2ddf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-946',
    name: 'CHN-946',
    flag: 'CHN',
  },
  {
    id: 'chn-34527d71',
    name: '34527d71',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1f9b',
    name: '342c1f9b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-184',
    name: 'CHN-184',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9689',
    name: '35ca9689',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2340',
    name: 'CHN-2340',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f3e9',
    name: '3434f3e9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28797',
    name: '35b28797',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58a87',
    name: '35b58a87',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-167',
    name: 'CHN-167',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28eaf',
    name: '35b28eaf',
    flag: 'CHN',
  },
  {
    id: 'chn-36b34ae7',
    name: '36b34ae7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2151',
    name: 'CHN-2151',
    flag: 'CHN',
  },
  {
    id: 'chn-quangang',
    name: 'QUANGANG',
    flag: 'CHN',
  },
  {
    id: 'chn-dongguan',
    name: 'DONGGUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-yuhuan',
    name: 'YUHUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2108',
    name: 'CHN-2108',
    flag: 'CHN',
  },
  {
    id: 'chn-34018b93',
    name: '34018b93',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d5b7',
    name: '35b5d5b7',
    flag: 'CHN',
  },
  {
    id: 'chn-huanghua',
    name: 'HUANGHUA',
    flag: 'CHN',
  },
  {
    id: 'chn-35b17141',
    name: '35b17141',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-754',
    name: 'CHN-754',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a097',
    name: '3403a097',
    flag: 'CHN',
  },
  {
    id: 'chn-3403bb87',
    name: '3403bb87',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ea5',
    name: '342e9ea5',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c553',
    name: '3403c553',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1145',
    name: 'CHN-1145',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1009',
    name: 'CHN-1009',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef7f',
    name: '3434ef7f',
    flag: 'CHN',
  },
  {
    id: 'chn-35f2a5a7',
    name: '35f2a5a7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1778',
    name: 'CHN-1778',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1611',
    name: 'CHN-1611',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb543',
    name: '342eb543',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac783',
    name: '35cac783',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79f3',
    name: '35ca79f3',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79df',
    name: '35ca79df',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1156',
    name: 'CHN-1156',
    flag: 'CHN',
  },
  {
    id: 'chn-35b287c9',
    name: '35b287c9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-127',
    name: 'CHN-127',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-134',
    name: 'CHN-134',
    flag: 'CHN',
  },
  {
    id: 'chn-3587ed59',
    name: '3587ed59',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1629',
    name: 'CHN-1629',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2044',
    name: 'CHN-2044',
    flag: 'CHN',
  },
  {
    id: 'chn-36b34adf',
    name: '36b34adf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2452',
    name: 'CHN-2452',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1381',
    name: 'CHN-1381',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-803',
    name: 'CHN-803',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1227',
    name: 'CHN-1227',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-782',
    name: 'CHN-782',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9749',
    name: '35ca9749',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1dff',
    name: '342c1dff',
    flag: 'CHN',
  },
  {
    id: 'chn-yingpan',
    name: 'YINGPAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2505',
    name: 'CHN-2505',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-396',
    name: 'CHN-396',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc71',
    name: '35cacc71',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2503',
    name: 'CHN-2503',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58a91',
    name: '35b58a91',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac252b',
    name: '35ac252b',
    flag: 'CHN',
  },
  {
    id: 'chn-34024977',
    name: '34024977',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e67',
    name: '35ac2e67',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af9f',
    name: '3403af9f',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c9cb',
    name: '3403c9cb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2456',
    name: 'CHN-2456',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae0157',
    name: '35ae0157',
    flag: 'CHN',
  },
  {
    id: 'chn-34287b8d',
    name: '34287b8d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-524',
    name: 'CHN-524',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f0b9',
    name: '35b5f0b9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1858',
    name: 'CHN-1858',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-455',
    name: 'CHN-455',
    flag: 'CHN',
  },
  {
    id: 'chn-34348ba3',
    name: '34348ba3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1128',
    name: 'CHN-1128',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae042f',
    name: '35ae042f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1696',
    name: 'CHN-1696',
    flag: 'CHN',
  },
  {
    id: 'chn-34018beb',
    name: '34018beb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2315',
    name: 'CHN-2315',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-497',
    name: 'CHN-497',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1118',
    name: 'CHN-1118',
    flag: 'CHN',
  },
  {
    id: 'chn-340180e1',
    name: '340180e1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1512',
    name: 'CHN-1512',
    flag: 'CHN',
  },
  {
    id: 'chn-35b287cb',
    name: '35b287cb',
    flag: 'CHN',
  },
  {
    id: 'chn-34352be9',
    name: '34352be9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1228',
    name: 'CHN-1228',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d0b3',
    name: '35b5d0b3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f733',
    name: '35b5f733',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-560',
    name: 'CHN-560',
    flag: 'CHN',
  },
  {
    id: 'chn-3401816d',
    name: '3401816d',
    flag: 'CHN',
  },
  {
    id: 'chn-sansha',
    name: 'SANSHA',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1711',
    name: 'CHN-1711',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1468',
    name: 'CHN-1468',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab0a5',
    name: '35cab0a5',
    flag: 'CHN',
  },
  {
    id: 'chn-34287bed',
    name: '34287bed',
    flag: 'CHN',
  },
  {
    id: 'chn-34046c5f',
    name: '34046c5f',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f3f',
    name: '342e3f3f',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef97',
    name: '3434ef97',
    flag: 'CHN',
  },
  {
    id: 'chn-35caba7f',
    name: '35caba7f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1913',
    name: 'CHN-1913',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f9f',
    name: '342e3f9f',
    flag: 'CHN',
  },
  {
    id: 'chn-342e4019',
    name: '342e4019',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-34',
    name: 'CHN-34',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2460',
    name: 'CHN-2460',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-940',
    name: 'CHN-940',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f4af',
    name: '3434f4af',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af89',
    name: '3403af89',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f99',
    name: '342e3f99',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69edf',
    name: '35b69edf',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac297b',
    name: '35ac297b',
    flag: 'CHN',
  },
  {
    id: 'chn-34338bcb',
    name: '34338bcb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5fa85',
    name: '35b5fa85',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6f4fd',
    name: '35b6f4fd',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c547',
    name: '3403c547',
    flag: 'CHN',
  },
  {
    id: 'chn-314e6a75',
    name: '314e6a75',
    flag: 'CHN',
  },
  {
    id: 'chn-35b26dbb',
    name: '35b26dbb',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb553',
    name: '342eb553',
    flag: 'CHN',
  },
  {
    id: 'chn-341226f9',
    name: '341226f9',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e79',
    name: '35ac2e79',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1671',
    name: 'CHN-1671',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-915',
    name: 'CHN-915',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-702',
    name: 'CHN-702',
    flag: 'CHN',
  },
  {
    id: 'chn-lanshan',
    name: 'LANSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1393',
    name: 'CHN-1393',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f93',
    name: '342e3f93',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2476',
    name: 'CHN-2476',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1233',
    name: 'CHN-1233',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac33e5',
    name: '35ac33e5',
    flag: 'CHN',
  },
  {
    id: 'chn-314e421d',
    name: '314e421d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b204e3',
    name: '35b204e3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28ea7',
    name: '35b28ea7',
    flag: 'CHN',
  },
  {
    id: 'chn-3153cd77',
    name: '3153cd77',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb515',
    name: '342eb515',
    flag: 'CHN',
  },
  {
    id: 'chn-34352961',
    name: '34352961',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b37',
    name: '35b27b37',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af85',
    name: '3403af85',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e23',
    name: '342c1e23',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b73',
    name: '34024b73',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1075',
    name: 'CHN-1075',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1f99',
    name: '342c1f99',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-642',
    name: 'CHN-642',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1602',
    name: 'CHN-1602',
    flag: 'CHN',
  },
  {
    id: 'chn-342e4003',
    name: '342e4003',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-652',
    name: 'CHN-652',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68631',
    name: '35b68631',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27d7b',
    name: '35b27d7b',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc69',
    name: '35cacc69',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1871',
    name: 'CHN-1871',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e5fd',
    name: '3434e5fd',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5efdd',
    name: '35b5efdd',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b3fb',
    name: '3403b3fb',
    flag: 'CHN',
  },
  {
    id: 'chn-34046c59',
    name: '34046c59',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2892f',
    name: '35b2892f',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea74f',
    name: '342ea74f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e65',
    name: '35ac2e65',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b23',
    name: '34348b23',
    flag: 'CHN',
  },
  {
    id: 'chn-35b204d7',
    name: '35b204d7',
    flag: 'CHN',
  },
  {
    id: 'chn-34287ccd',
    name: '34287ccd',
    flag: 'CHN',
  },
  {
    id: 'chn-35b26c39',
    name: '35b26c39',
    flag: 'CHN',
  },
  {
    id: 'chn-342c2027',
    name: '342c2027',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1342',
    name: 'CHN-1342',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58a8b',
    name: '35b58a8b',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c73',
    name: '34018c73',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1767',
    name: 'CHN-1767',
    flag: 'CHN',
  },
  {
    id: 'chn-34018f69',
    name: '34018f69',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2040',
    name: 'CHN-2040',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1684',
    name: 'CHN-1684',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b157',
    name: '3403b157',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1762',
    name: 'CHN-1762',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9c41',
    name: '342e9c41',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f3d',
    name: '342e3f3d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2111',
    name: 'CHN-2111',
    flag: 'CHN',
  },
  {
    id: 'chn-suzhou',
    name: 'SUZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9d05',
    name: '342e9d05',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f497',
    name: '3434f497',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1198',
    name: 'CHN-1198',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2096',
    name: 'CHN-2096',
    flag: 'CHN',
  },
  {
    id: 'chn-yangzhou',
    name: 'YANGZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-34287ceb',
    name: '34287ceb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2028',
    name: 'CHN-2028',
    flag: 'CHN',
  },
  {
    id: 'chn-340249a7',
    name: '340249a7',
    flag: 'CHN',
  },
  {
    id: 'chn-zhangjiagang',
    name: 'ZHANGJIAGANG',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2983',
    name: '35ac2983',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-625',
    name: 'CHN-625',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79c7',
    name: '35ca79c7',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dc99',
    name: '3427dc99',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac997',
    name: '35cac997',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-990',
    name: 'CHN-990',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbdd',
    name: '35cacbdd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-473',
    name: 'CHN-473',
    flag: 'CHN',
  },
  {
    id: 'chn-342862d9',
    name: '342862d9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-213',
    name: 'CHN-213',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea753',
    name: '342ea753',
    flag: 'CHN',
  },
  {
    id: 'chn-34017083',
    name: '34017083',
    flag: 'CHN',
  },
  {
    id: 'chn-35ec8c01',
    name: '35ec8c01',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f9d',
    name: '342e3f9d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28785',
    name: '35b28785',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2465',
    name: 'CHN-2465',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2636',
    name: 'CHN-2636',
    flag: 'CHN',
  },
  {
    id: 'chn-qinzhou',
    name: 'QINZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-35edbc35',
    name: '35edbc35',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1998',
    name: 'CHN-1998',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca91fb',
    name: '35ca91fb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b220cd',
    name: '35b220cd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2177',
    name: 'CHN-2177',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbdb',
    name: '35cacbdb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1647',
    name: 'CHN-1647',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1260',
    name: 'CHN-1260',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab74b',
    name: '35cab74b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d12f',
    name: '35b5d12f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1308',
    name: 'CHN-1308',
    flag: 'CHN',
  },
  {
    id: 'chn-34527d65',
    name: '34527d65',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1753',
    name: 'CHN-1753',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2174',
    name: 'CHN-2174',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d5d1',
    name: '35b5d5d1',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27d6b',
    name: '35b27d6b',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ad6f',
    name: '3403ad6f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1782',
    name: 'CHN-1782',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-723',
    name: 'CHN-723',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27ac1',
    name: '35b27ac1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-705',
    name: 'CHN-705',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f31',
    name: '342e3f31',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2161',
    name: 'CHN-2161',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc0f',
    name: '35cacc0f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1438',
    name: 'CHN-1438',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d12d',
    name: '35b5d12d',
    flag: 'CHN',
  },
  {
    id: 'chn-342e4075',
    name: '342e4075',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1579',
    name: 'CHN-1579',
    flag: 'CHN',
  },
  {
    id: 'chn-34017a8b',
    name: '34017a8b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27ac5',
    name: '35b27ac5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68223',
    name: '35b68223',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-577',
    name: 'CHN-577',
    flag: 'CHN',
  },
  {
    id: 'chn-35b204d3',
    name: '35b204d3',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a659',
    name: '3403a659',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d737',
    name: '35b5d737',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2879b',
    name: '35b2879b',
    flag: 'CHN',
  },
  {
    id: 'chn-34338bad',
    name: '34338bad',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d545',
    name: '35b5d545',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af6f',
    name: '3403af6f',
    flag: 'CHN',
  },
  {
    id: 'chn-3402281d',
    name: '3402281d',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd01',
    name: '3434dd01',
    flag: 'CHN',
  },
  {
    id: 'chn-3411dfdb',
    name: '3411dfdb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-519',
    name: 'CHN-519',
    flag: 'CHN',
  },
  {
    id: 'chn-34017077',
    name: '34017077',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-470',
    name: 'CHN-470',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbfb',
    name: '35cacbfb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6896f',
    name: '35b6896f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-855',
    name: 'CHN-855',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6812b',
    name: '35b6812b',
    flag: 'CHN',
  },
  {
    id: 'chn-34352b87',
    name: '34352b87',
    flag: 'CHN',
  },
  {
    id: 'chn-3403dab3',
    name: '3403dab3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b26d9f',
    name: '35b26d9f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-694',
    name: 'CHN-694',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69f11',
    name: '35b69f11',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1391',
    name: 'CHN-1391',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58a89',
    name: '35b58a89',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d543',
    name: '35b5d543',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-200',
    name: 'CHN-200',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1775',
    name: 'CHN-1775',
    flag: 'CHN',
  },
  {
    id: 'chn-3427d84b',
    name: '3427d84b',
    flag: 'CHN',
  },
  {
    id: 'chn-3153cd7d',
    name: '3153cd7d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1302',
    name: 'CHN-1302',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca8e01',
    name: '35ca8e01',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1891',
    name: 'CHN-1891',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c0f',
    name: '34352c0f',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b6ab',
    name: '3403b6ab',
    flag: 'CHN',
  },
  {
    id: 'chn-35b22721',
    name: '35b22721',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-356',
    name: 'CHN-356',
    flag: 'CHN',
  },
  {
    id: 'chn-34348bbd',
    name: '34348bbd',
    flag: 'CHN',
  },
  {
    id: 'chn-34030879',
    name: '34030879',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1663',
    name: 'CHN-1663',
    flag: 'CHN',
  },
  {
    id: 'chn-34018b8b',
    name: '34018b8b',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e55f',
    name: '3434e55f',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b4d',
    name: '34348b4d',
    flag: 'CHN',
  },
  {
    id: 'chn-penglai',
    name: 'PENGLAI',
    flag: 'CHN',
  },
  {
    id: 'chn-34338d55',
    name: '34338d55',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1840',
    name: 'CHN-1840',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c1b',
    name: '34352c1b',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f73',
    name: '342e3f73',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c9e7',
    name: '3403c9e7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2516',
    name: 'CHN-2516',
    flag: 'CHN',
  },
  {
    id: 'chn-nantong',
    name: 'NANTONG',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-848',
    name: 'CHN-848',
    flag: 'CHN',
  },
  {
    id: 'chn-35b221f9',
    name: '35b221f9',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca630d',
    name: '35ca630d',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f481',
    name: '3434f481',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-115',
    name: 'CHN-115',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2063',
    name: 'CHN-2063',
    flag: 'CHN',
  },
  {
    id: 'chn-xiawei',
    name: 'XIAWEI',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2251',
    name: 'CHN-2251',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-375',
    name: 'CHN-375',
    flag: 'CHN',
  },
  {
    id: 'chn-340180b3',
    name: '340180b3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b22737',
    name: '35b22737',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c567',
    name: '3403c567',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab845',
    name: '35cab845',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c45',
    name: '34018c45',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f085',
    name: '35b5f085',
    flag: 'CHN',
  },
  {
    id: 'chn-34352beb',
    name: '34352beb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1622',
    name: 'CHN-1622',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ef1',
    name: '342e9ef1',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d0b5',
    name: '35b5d0b5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1074',
    name: 'CHN-1074',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ec3',
    name: '342e9ec3',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3fa7',
    name: '342e3fa7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-580',
    name: 'CHN-580',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2155',
    name: 'CHN-2155',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28c5d',
    name: '35b28c5d',
    flag: 'CHN',
  },
  {
    id: 'chn-344d8ead',
    name: '344d8ead',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1889',
    name: 'CHN-1889',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2033',
    name: 'CHN-2033',
    flag: 'CHN',
  },
  {
    id: 'chn-35b67ff7',
    name: '35b67ff7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1882',
    name: 'CHN-1882',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ad71',
    name: '3403ad71',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28933',
    name: '35b28933',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1789',
    name: 'CHN-1789',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-326',
    name: 'CHN-326',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2470',
    name: 'CHN-2470',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2420',
    name: 'CHN-2420',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-903',
    name: 'CHN-903',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef57',
    name: '3434ef57',
    flag: 'CHN',
  },
  {
    id: 'chn-35b912f7',
    name: '35b912f7',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd03',
    name: '3434dd03',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f007',
    name: '3434f007',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac77d',
    name: '35cac77d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28895',
    name: '35b28895',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-506',
    name: 'CHN-506',
    flag: 'CHN',
  },
  {
    id: 'chn-ningde',
    name: 'NINGDE',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-892',
    name: 'CHN-892',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58a93',
    name: '35b58a93',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b0d',
    name: '34348b0d',
    flag: 'CHN',
  },
  {
    id: 'chn-36b32fcd',
    name: '36b32fcd',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca919b',
    name: '35ca919b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f193',
    name: '35b5f193',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1437',
    name: 'CHN-1437',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc2f',
    name: '3403cc2f',
    flag: 'CHN',
  },
  {
    id: 'chn-3403088d',
    name: '3403088d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f6cb',
    name: '35b5f6cb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1568',
    name: 'CHN-1568',
    flag: 'CHN',
  },
  {
    id: 'chn-340170bb',
    name: '340170bb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b686d5',
    name: '35b686d5',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c13',
    name: '34352c13',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1658',
    name: 'CHN-1658',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af91',
    name: '3403af91',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af8f',
    name: '3403af8f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9223',
    name: '35ca9223',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2488',
    name: 'CHN-2488',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-658',
    name: 'CHN-658',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-985',
    name: 'CHN-985',
    flag: 'CHN',
  },
  {
    id: 'chn-34287b89',
    name: '34287b89',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d94b',
    name: '35b5d94b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2424',
    name: 'CHN-2424',
    flag: 'CHN',
  },
  {
    id: 'chn-314e6a09',
    name: '314e6a09',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2266',
    name: 'CHN-2266',
    flag: 'CHN',
  },
  {
    id: 'chn-35b1432b',
    name: '35b1432b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-983',
    name: 'CHN-983',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9729',
    name: '35ca9729',
    flag: 'CHN',
  },
  {
    id: 'chn-34527d9f',
    name: '34527d9f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2529',
    name: '35ac2529',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79c5',
    name: '35ca79c5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69f19',
    name: '35b69f19',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2017',
    name: 'CHN-2017',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-735',
    name: 'CHN-735',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28789',
    name: '35b28789',
    flag: 'CHN',
  },
  {
    id: 'chn-3427d9cb',
    name: '3427d9cb',
    flag: 'CHN',
  },
  {
    id: 'chn-34287cc7',
    name: '34287cc7',
    flag: 'CHN',
  },
  {
    id: 'chn-340187eb',
    name: '340187eb',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea70f',
    name: '342ea70f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1178',
    name: 'CHN-1178',
    flag: 'CHN',
  },
  {
    id: 'chn-35b686d7',
    name: '35b686d7',
    flag: 'CHN',
  },
  {
    id: 'chn-34348bbf',
    name: '34348bbf',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb55b',
    name: '342eb55b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1847',
    name: 'CHN-1847',
    flag: 'CHN',
  },
  {
    id: 'chn-zhapu',
    name: 'ZHAPU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1324',
    name: 'CHN-1324',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c4d9',
    name: '3403c4d9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1041',
    name: 'CHN-1041',
    flag: 'CHN',
  },
  {
    id: 'chn-340180c9',
    name: '340180c9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2168',
    name: 'CHN-2168',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a661',
    name: '3403a661',
    flag: 'CHN',
  },
  {
    id: 'chn-dongying',
    name: 'DONGYING',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-801',
    name: 'CHN-801',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af13',
    name: '3403af13',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2893f',
    name: '35b2893f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca8e03',
    name: '35ca8e03',
    flag: 'CHN',
  },
  {
    id: 'chn-hangzhou',
    name: 'HANGZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-34017a7f',
    name: '34017a7f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d515',
    name: '35b5d515',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1004',
    name: 'CHN-1004',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d55d',
    name: '35b5d55d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6d3',
    name: '35b5d6d3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b15d21',
    name: '35b15d21',
    flag: 'CHN',
  },
  {
    id: 'chn-35b688e3',
    name: '35b688e3',
    flag: 'CHN',
  },
  {
    id: 'chn-340180c1',
    name: '340180c1',
    flag: 'CHN',
  },
  {
    id: 'chn-3402279b',
    name: '3402279b',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae0687',
    name: '35ae0687',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbf9',
    name: '35cacbf9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d505',
    name: '35b5d505',
    flag: 'CHN',
  },
  {
    id: 'chn-lianyungang',
    name: 'LIANYUNGANG',
    flag: 'CHN',
  },
  {
    id: 'chn-34018119',
    name: '34018119',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2541',
    name: 'CHN-2541',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f19d',
    name: '35b5f19d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1528',
    name: 'CHN-1528',
    flag: 'CHN',
  },
  {
    id: 'chn-34348bb9',
    name: '34348bb9',
    flag: 'CHN',
  },
  {
    id: 'chn-35ada283',
    name: '35ada283',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc75',
    name: '35cacc75',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1842',
    name: 'CHN-1842',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1809',
    name: 'CHN-1809',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-853',
    name: 'CHN-853',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1643',
    name: 'CHN-1643',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-870',
    name: 'CHN-870',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68627',
    name: '35b68627',
    flag: 'CHN',
  },
  {
    id: 'chn-35b26c37',
    name: '35b26c37',
    flag: 'CHN',
  },
  {
    id: 'chn-34527d73',
    name: '34527d73',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd1d',
    name: '3434dd1d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1795',
    name: 'CHN-1795',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2131',
    name: 'CHN-2131',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f8d',
    name: '342e3f8d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1529',
    name: 'CHN-1529',
    flag: 'CHN',
  },
  {
    id: 'chn-314e41fb',
    name: '314e41fb',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e78f',
    name: '3434e78f',
    flag: 'CHN',
  },
  {
    id: 'chn-34018097',
    name: '34018097',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1593',
    name: 'CHN-1593',
    flag: 'CHN',
  },
  {
    id: 'chn-34018fcf',
    name: '34018fcf',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d51b',
    name: '35b5d51b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-789',
    name: 'CHN-789',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ad97',
    name: '3403ad97',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1541',
    name: 'CHN-1541',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1634',
    name: 'CHN-1634',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca968b',
    name: '35ca968b',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ada3',
    name: '3403ada3',
    flag: 'CHN',
  },
  {
    id: 'chn-34348ae1',
    name: '34348ae1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1039',
    name: 'CHN-1039',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d0c9',
    name: '35b5d0c9',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f4bd',
    name: '3434f4bd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1108',
    name: 'CHN-1108',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ade9',
    name: '3403ade9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2450',
    name: 'CHN-2450',
    flag: 'CHN',
  },
  {
    id: 'chn-340308f3',
    name: '340308f3',
    flag: 'CHN',
  },
  {
    id: 'chn-shanhaiguan',
    name: 'SHANHAIGUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-724',
    name: 'CHN-724',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1545',
    name: 'CHN-1545',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1916',
    name: 'CHN-1916',
    flag: 'CHN',
  },
  {
    id: 'chn-35ec8c05',
    name: '35ec8c05',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ee3',
    name: '342e9ee3',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ce8d',
    name: '3403ce8d',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f83',
    name: '342e3f83',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9e55',
    name: '342e9e55',
    flag: 'CHN',
  },
  {
    id: 'chn-340187f5',
    name: '340187f5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2548',
    name: 'CHN-2548',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbf3',
    name: '35cacbf3',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c33d',
    name: '3427c33d',
    flag: 'CHN',
  },
  {
    id: 'chn-36ab1d3b',
    name: '36ab1d3b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-180',
    name: 'CHN-180',
    flag: 'CHN',
  },
  {
    id: 'chn-342862f3',
    name: '342862f3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1473',
    name: 'CHN-1473',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae06a9',
    name: '35ae06a9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28787',
    name: '35b28787',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d129',
    name: '35b5d129',
    flag: 'CHN',
  },
  {
    id: 'chn-345288b1',
    name: '345288b1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1907',
    name: 'CHN-1907',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbff',
    name: '35cacbff',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1343',
    name: 'CHN-1343',
    flag: 'CHN',
  },
  {
    id: 'chn-34018bf3',
    name: '34018bf3',
    flag: 'CHN',
  },
  {
    id: 'chn-3452b6ff',
    name: '3452b6ff',
    flag: 'CHN',
  },
  {
    id: 'chn-35b205a7',
    name: '35b205a7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1721',
    name: 'CHN-1721',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-661',
    name: 'CHN-661',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b543',
    name: '3403b543',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6b7',
    name: '35b5d6b7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b686e3',
    name: '35b686e3',
    flag: 'CHN',
  },
  {
    id: 'chn-3433ed55',
    name: '3433ed55',
    flag: 'CHN',
  },
  {
    id: 'chn-dongjiakou',
    name: 'DONGJIAKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-291',
    name: 'CHN-291',
    flag: 'CHN',
  },
  {
    id: 'chn-340227ed',
    name: '340227ed',
    flag: 'CHN',
  },
  {
    id: 'chn-35b15cd7',
    name: '35b15cd7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d407',
    name: '35b5d407',
    flag: 'CHN',
  },
  {
    id: 'chn-35b67ff9',
    name: '35b67ff9',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb555',
    name: '342eb555',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-545',
    name: 'CHN-545',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9eff',
    name: '342e9eff',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c6b',
    name: '34018c6b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-437',
    name: 'CHN-437',
    flag: 'CHN',
  },
  {
    id: 'chn-34022773',
    name: '34022773',
    flag: 'CHN',
  },
  {
    id: 'chn-34018877',
    name: '34018877',
    flag: 'CHN',
  },
  {
    id: 'chn-35b15d27',
    name: '35b15d27',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e5f9',
    name: '3434e5f9',
    flag: 'CHN',
  },
  {
    id: 'chn-34348adf',
    name: '34348adf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-976',
    name: 'CHN-976',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27a8d',
    name: '35b27a8d',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a689',
    name: '3403a689',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-306',
    name: 'CHN-306',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28c21',
    name: '35b28c21',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1005',
    name: 'CHN-1005',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5efd9',
    name: '35b5efd9',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b71',
    name: '34024b71',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e03',
    name: '342c1e03',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c305',
    name: '3427c305',
    flag: 'CHN',
  },
  {
    id: 'chn-3402491b',
    name: '3402491b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1455',
    name: 'CHN-1455',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1641',
    name: 'CHN-1641',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b39',
    name: '34348b39',
    flag: 'CHN',
  },
  {
    id: 'chn-35b288c1',
    name: '35b288c1',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69f1b',
    name: '35b69f1b',
    flag: 'CHN',
  },
  {
    id: 'chn-340235b3',
    name: '340235b3',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c9b5',
    name: '3403c9b5',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c251',
    name: '3427c251',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c4df',
    name: '3403c4df',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6f1',
    name: '35b5d6f1',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f4b',
    name: '342e3f4b',
    flag: 'CHN',
  },
  {
    id: 'chn-34018103',
    name: '34018103',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f85',
    name: '342e3f85',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d72d',
    name: '35b5d72d',
    flag: 'CHN',
  },
  {
    id: 'chn-34018113',
    name: '34018113',
    flag: 'CHN',
  },
  {
    id: 'chn-36aaff51',
    name: '36aaff51',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1398',
    name: 'CHN-1398',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dcbf',
    name: '3427dcbf',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3159',
    name: '35ac3159',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5ee2b',
    name: '35b5ee2b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6817f',
    name: '35b6817f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-112',
    name: 'CHN-112',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27ac3',
    name: '35b27ac3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1681',
    name: 'CHN-1681',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d765',
    name: '35b3d765',
    flag: 'CHN',
  },
  {
    id: 'chn-340180ed',
    name: '340180ed',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2125',
    name: 'CHN-2125',
    flag: 'CHN',
  },
  {
    id: 'chn-35b220cb',
    name: '35b220cb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-643',
    name: 'CHN-643',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1644',
    name: 'CHN-1644',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c853',
    name: '3403c853',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac995',
    name: '35cac995',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad894b',
    name: '35ad894b',
    flag: 'CHN',
  },
  {
    id: 'chn-34018bc9',
    name: '34018bc9',
    flag: 'CHN',
  },
  {
    id: 'chn-3411e825',
    name: '3411e825',
    flag: 'CHN',
  },
  {
    id: 'chn-35caccf7',
    name: '35caccf7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1886',
    name: 'CHN-1886',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-114',
    name: 'CHN-114',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbfd',
    name: '35cacbfd',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2272f',
    name: '35b2272f',
    flag: 'CHN',
  },
  {
    id: 'chn-34018639',
    name: '34018639',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-777',
    name: 'CHN-777',
    flag: 'CHN',
  },
  {
    id: 'chn-35cabf61',
    name: '35cabf61',
    flag: 'CHN',
  },
  {
    id: 'chn-3434efdd',
    name: '3434efdd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-893',
    name: 'CHN-893',
    flag: 'CHN',
  },
  {
    id: 'chn-34024975',
    name: '34024975',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-265',
    name: 'CHN-265',
    flag: 'CHN',
  },
  {
    id: 'chn-35b91303',
    name: '35b91303',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1742',
    name: 'CHN-1742',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-914',
    name: 'CHN-914',
    flag: 'CHN',
  },
  {
    id: 'chn-yancheng',
    name: 'YANCHENG',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2218',
    name: 'CHN-2218',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1403',
    name: 'CHN-1403',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2134',
    name: 'CHN-2134',
    flag: 'CHN',
  },
  {
    id: 'chn-34287bef',
    name: '34287bef',
    flag: 'CHN',
  },
  {
    id: 'chn-shijing',
    name: 'SHIJING',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1236',
    name: 'CHN-1236',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2512',
    name: 'CHN-2512',
    flag: 'CHN',
  },
  {
    id: 'chn-34017af7',
    name: '34017af7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1125',
    name: 'CHN-1125',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2508',
    name: 'CHN-2508',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2341',
    name: 'CHN-2341',
    flag: 'CHN',
  },
  {
    id: 'chn-34018f71',
    name: '34018f71',
    flag: 'CHN',
  },
  {
    id: 'chn-35caceab',
    name: '35caceab',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ee9',
    name: '342e9ee9',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c9dd',
    name: '3403c9dd',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6896d',
    name: '35b6896d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-822',
    name: 'CHN-822',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2253',
    name: 'CHN-2253',
    flag: 'CHN',
  },
  {
    id: 'chn-35b26da3',
    name: '35b26da3',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad98c3',
    name: '35ad98c3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1657',
    name: 'CHN-1657',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc35',
    name: '3403cc35',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69ea9',
    name: '35b69ea9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b03',
    name: '35b27b03',
    flag: 'CHN',
  },
  {
    id: 'chn-314e41fd',
    name: '314e41fd',
    flag: 'CHN',
  },
  {
    id: 'chn-35b22725',
    name: '35b22725',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af75',
    name: '3403af75',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e77',
    name: '35ac2e77',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea757',
    name: '342ea757',
    flag: 'CHN',
  },
  {
    id: 'chn-chaozhou',
    name: 'CHAOZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-885',
    name: 'CHN-885',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1862',
    name: 'CHN-1862',
    flag: 'CHN',
  },
  {
    id: 'chn-34018bb7',
    name: '34018bb7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d3c3',
    name: '35b3d3c3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-997',
    name: 'CHN-997',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1532',
    name: 'CHN-1532',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca93d3',
    name: '35ca93d3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d6dd',
    name: '35b3d6dd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1327',
    name: 'CHN-1327',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-929',
    name: 'CHN-929',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1513',
    name: 'CHN-1513',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-648',
    name: 'CHN-648',
    flag: 'CHN',
  },
  {
    id: 'chn-34118d33',
    name: '34118d33',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab85f',
    name: '35cab85f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca96ef',
    name: '35ca96ef',
    flag: 'CHN',
  },
  {
    id: 'chn-35b9125d',
    name: '35b9125d',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae0165',
    name: '35ae0165',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f087',
    name: '35b5f087',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1465',
    name: 'CHN-1465',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f0bd',
    name: '35b5f0bd',
    flag: 'CHN',
  },
  {
    id: 'chn-shantou',
    name: 'SHANTOU',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c49',
    name: '34352c49',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2176',
    name: 'CHN-2176',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1981',
    name: 'CHN-1981',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc13',
    name: '35cacc13',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c9c9',
    name: '3403c9c9',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae03e1',
    name: '35ae03e1',
    flag: 'CHN',
  },
  {
    id: 'chn-340309a3',
    name: '340309a3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-693',
    name: 'CHN-693',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dcb1',
    name: '3427dcb1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1010',
    name: 'CHN-1010',
    flag: 'CHN',
  },
  {
    id: 'chn-35b20525',
    name: '35b20525',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-404',
    name: 'CHN-404',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c33b',
    name: '3427c33b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27d41',
    name: '35b27d41',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9733',
    name: '35ca9733',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc6b',
    name: '35cacc6b',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb517',
    name: '342eb517',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e5f5',
    name: '3434e5f5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-811',
    name: 'CHN-811',
    flag: 'CHN',
  },
  {
    id: 'chn-35b226d9',
    name: '35b226d9',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3adf',
    name: '35ac3adf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-676',
    name: 'CHN-676',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc67',
    name: '35cacc67',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1288',
    name: 'CHN-1288',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1218',
    name: 'CHN-1218',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1346',
    name: 'CHN-1346',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1049',
    name: 'CHN-1049',
    flag: 'CHN',
  },
  {
    id: 'chn-35b17105',
    name: '35b17105',
    flag: 'CHN',
  },
  {
    id: 'chn-yangxi',
    name: 'YANGXI',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2363',
    name: 'CHN-2363',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc4d',
    name: '3403cc4d',
    flag: 'CHN',
  },
  {
    id: 'chn-shanghai',
    name: 'SHANGHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-34348ae3',
    name: '34348ae3',
    flag: 'CHN',
  },
  {
    id: 'chn-34287bd9',
    name: '34287bd9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b287a5',
    name: '35b287a5',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9225',
    name: '35ca9225',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d541',
    name: '35b5d541',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ad69',
    name: '3403ad69',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1831',
    name: 'CHN-1831',
    flag: 'CHN',
  },
  {
    id: 'chn-340180b9',
    name: '340180b9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b287a9',
    name: '35b287a9',
    flag: 'CHN',
  },
  {
    id: 'chn-340229c5',
    name: '340229c5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b686fd',
    name: '35b686fd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1470',
    name: 'CHN-1470',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-911',
    name: 'CHN-911',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1537',
    name: 'CHN-1537',
    flag: 'CHN',
  },
  {
    id: 'chn-35b21b1b',
    name: '35b21b1b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1363',
    name: 'CHN-1363',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1151',
    name: 'CHN-1151',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b99',
    name: '34024b99',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1322',
    name: 'CHN-1322',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ad95',
    name: '3403ad95',
    flag: 'CHN',
  },
  {
    id: 'chn-342862df',
    name: '342862df',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2002',
    name: 'CHN-2002',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac981',
    name: '35cac981',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1417',
    name: 'CHN-1417',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2551',
    name: 'CHN-2551',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1325',
    name: 'CHN-1325',
    flag: 'CHN',
  },
  {
    id: 'chn-342e401d',
    name: '342e401d',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac95f',
    name: '35cac95f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1680',
    name: 'CHN-1680',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9191',
    name: '35ca9191',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1687',
    name: 'CHN-1687',
    flag: 'CHN',
  },
  {
    id: 'chn-34352bff',
    name: '34352bff',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1785',
    name: 'CHN-1785',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-231',
    name: 'CHN-231',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79dd',
    name: '35ca79dd',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cff7',
    name: '3403cff7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1580',
    name: 'CHN-1580',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1646',
    name: 'CHN-1646',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f37',
    name: '342e3f37',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1698',
    name: 'CHN-1698',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-840',
    name: 'CHN-840',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-752',
    name: 'CHN-752',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-696',
    name: 'CHN-696',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9747',
    name: '35ca9747',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1266',
    name: 'CHN-1266',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf69',
    name: '3588bf69',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2013',
    name: 'CHN-2013',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f19b',
    name: '35b5f19b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1384',
    name: 'CHN-1384',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2565',
    name: 'CHN-2565',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1852',
    name: 'CHN-1852',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad987f',
    name: '35ad987f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-987',
    name: 'CHN-987',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27d67',
    name: '35b27d67',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9737',
    name: '35ca9737',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b401',
    name: '3403b401',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d0cf',
    name: '35b5d0cf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2046',
    name: 'CHN-2046',
    flag: 'CHN',
  },
  {
    id: 'chn-34352b81',
    name: '34352b81',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c9c7',
    name: '3403c9c7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2173',
    name: 'CHN-2173',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-269',
    name: 'CHN-269',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1246',
    name: 'CHN-1246',
    flag: 'CHN',
  },
  {
    id: 'chn-340180f1',
    name: '340180f1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1912',
    name: 'CHN-1912',
    flag: 'CHN',
  },
  {
    id: 'chn-daluisland',
    name: 'DALU ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1176',
    name: 'CHN-1176',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f15',
    name: '342e3f15',
    flag: 'CHN',
  },
  {
    id: 'chn-341226e5',
    name: '341226e5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-687',
    name: 'CHN-687',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d76f',
    name: '35b3d76f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1777',
    name: 'CHN-1777',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28887',
    name: '35b28887',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1112',
    name: 'CHN-1112',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac98f',
    name: '35cac98f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d54f',
    name: '35b5d54f',
    flag: 'CHN',
  },
  {
    id: 'chn-binzhou',
    name: 'BINZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1388',
    name: 'CHN-1388',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27d63',
    name: '35b27d63',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1499',
    name: 'CHN-1499',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-296',
    name: 'CHN-296',
    flag: 'CHN',
  },
  {
    id: 'chn-34018633',
    name: '34018633',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e07',
    name: '342c1e07',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b33',
    name: '34348b33',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6f4ff',
    name: '35b6f4ff',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f199',
    name: '35b5f199',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1436',
    name: 'CHN-1436',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc1d',
    name: '35cacc1d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-155',
    name: 'CHN-155',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca96e9',
    name: '35ca96e9',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9d19',
    name: '342e9d19',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea7ad',
    name: '342ea7ad',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1022',
    name: 'CHN-1022',
    flag: 'CHN',
  },
  {
    id: 'chn-3683758d',
    name: '3683758d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2332',
    name: 'CHN-2332',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1960',
    name: 'CHN-1960',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c53',
    name: '34352c53',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca62d3',
    name: '35ca62d3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-214',
    name: 'CHN-214',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2042',
    name: 'CHN-2042',
    flag: 'CHN',
  },
  {
    id: 'chn-3403dab1',
    name: '3403dab1',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c52f',
    name: '3403c52f',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dcc9',
    name: '3427dcc9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-450',
    name: 'CHN-450',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d417',
    name: '35b5d417',
    flag: 'CHN',
  },
  {
    id: 'chn-35b220d3',
    name: '35b220d3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b287d3',
    name: '35b287d3',
    flag: 'CHN',
  },
  {
    id: 'chn-34018dc5',
    name: '34018dc5',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3ed7',
    name: '342e3ed7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2485',
    name: 'CHN-2485',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c333',
    name: '3427c333',
    flag: 'CHN',
  },
  {
    id: 'chn-lusi',
    name: 'LUSI',
    flag: 'CHN',
  },
  {
    id: 'chn-35b686ff',
    name: '35b686ff',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2095',
    name: 'CHN-2095',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1336',
    name: 'CHN-1336',
    flag: 'CHN',
  },
  {
    id: 'chn-34287c9b',
    name: '34287c9b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1893',
    name: 'CHN-1893',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1595',
    name: 'CHN-1595',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1984',
    name: 'CHN-1984',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-562',
    name: 'CHN-562',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-799',
    name: 'CHN-799',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f8b',
    name: '342e3f8b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2061',
    name: 'CHN-2061',
    flag: 'CHN',
  },
  {
    id: 'chn-340176e3',
    name: '340176e3',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae0161',
    name: '35ae0161',
    flag: 'CHN',
  },
  {
    id: 'chn-342e6a8f',
    name: '342e6a8f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1466',
    name: 'CHN-1466',
    flag: 'CHN',
  },
  {
    id: 'chn-340180e9',
    name: '340180e9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1031',
    name: 'CHN-1031',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2461',
    name: 'CHN-2461',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-713',
    name: 'CHN-713',
    flag: 'CHN',
  },
  {
    id: 'chn-honghu',
    name: 'HONGHU',
    flag: 'CHN',
  },
  {
    id: 'chn-35b91307',
    name: '35b91307',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-960',
    name: 'CHN-960',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-783',
    name: 'CHN-783',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab8ff',
    name: '35cab8ff',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-954',
    name: 'CHN-954',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f1d5',
    name: '35b5f1d5',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b47',
    name: '34348b47',
    flag: 'CHN',
  },
  {
    id: 'chn-340188a5',
    name: '340188a5',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab9b5',
    name: '35cab9b5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2003',
    name: 'CHN-2003',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b15',
    name: '34024b15',
    flag: 'CHN',
  },
  {
    id: 'chn-34287c93',
    name: '34287c93',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ade7',
    name: '3403ade7',
    flag: 'CHN',
  },
  {
    id: 'chn-34287bfb',
    name: '34287bfb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2180',
    name: 'CHN-2180',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2533',
    name: '35ac2533',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2345',
    name: 'CHN-2345',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca6373',
    name: '35ca6373',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1082',
    name: 'CHN-1082',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea76b',
    name: '342ea76b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b1711b',
    name: '35b1711b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58a8f',
    name: '35b58a8f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2038',
    name: 'CHN-2038',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1037',
    name: 'CHN-1037',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-701',
    name: 'CHN-701',
    flag: 'CHN',
  },
  {
    id: 'chn-34022791',
    name: '34022791',
    flag: 'CHN',
  },
  {
    id: 'chn-34017b01',
    name: '34017b01',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2088',
    name: 'CHN-2088',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac315d',
    name: '35ac315d',
    flag: 'CHN',
  },
  {
    id: 'chn-340180ff',
    name: '340180ff',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-362',
    name: 'CHN-362',
    flag: 'CHN',
  },
  {
    id: 'chn-34338ba5',
    name: '34338ba5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-75',
    name: 'CHN-75',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b27',
    name: '35b27b27',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-484',
    name: 'CHN-484',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d411',
    name: '35b5d411',
    flag: 'CHN',
  },
  {
    id: 'chn-3401bd09',
    name: '3401bd09',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3409',
    name: '35ac3409',
    flag: 'CHN',
  },
  {
    id: 'chn-34018b91',
    name: '34018b91',
    flag: 'CHN',
  },
  {
    id: 'chn-34018bb9',
    name: '34018bb9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1328',
    name: 'CHN-1328',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1768',
    name: 'CHN-1768',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-616',
    name: 'CHN-616',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1247',
    name: 'CHN-1247',
    flag: 'CHN',
  },
  {
    id: 'chn-314e6a73',
    name: '314e6a73',
    flag: 'CHN',
  },
  {
    id: 'chn-putian',
    name: 'PUTIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd0f',
    name: '3434dd0f',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab855',
    name: '35cab855',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-992',
    name: 'CHN-992',
    flag: 'CHN',
  },
  {
    id: 'chn-34018107',
    name: '34018107',
    flag: 'CHN',
  },
  {
    id: 'chn-35b91267',
    name: '35b91267',
    flag: 'CHN',
  },
  {
    id: 'chn-35b22729',
    name: '35b22729',
    flag: 'CHN',
  },
  {
    id: 'chn-35b226d7',
    name: '35b226d7',
    flag: 'CHN',
  },
  {
    id: 'chn-34286261',
    name: '34286261',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1067',
    name: 'CHN-1067',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-494',
    name: 'CHN-494',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d657',
    name: '35b5d657',
    flag: 'CHN',
  },
  {
    id: 'chn-34338d57',
    name: '34338d57',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-324',
    name: 'CHN-324',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-352',
    name: 'CHN-352',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c557',
    name: '3403c557',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca91f9',
    name: '35ca91f9',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f001',
    name: '3434f001',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5fa83',
    name: '35b5fa83',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68893',
    name: '35b68893',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d0d3',
    name: '35b5d0d3',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca91e5',
    name: '35ca91e5',
    flag: 'CHN',
  },
  {
    id: 'chn-34018769',
    name: '34018769',
    flag: 'CHN',
  },
  {
    id: 'chn-34338b91',
    name: '34338b91',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1920',
    name: 'CHN-1920',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-526',
    name: 'CHN-526',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac999',
    name: '35cac999',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-337',
    name: 'CHN-337',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1107',
    name: 'CHN-1107',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-660',
    name: 'CHN-660',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d139',
    name: '35b5d139',
    flag: 'CHN',
  },
  {
    id: 'chn-3411da05',
    name: '3411da05',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab8a7',
    name: '35cab8a7',
    flag: 'CHN',
  },
  {
    id: 'chn-34348ba1',
    name: '34348ba1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-268',
    name: 'CHN-268',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27a7f',
    name: '35b27a7f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1098',
    name: 'CHN-1098',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-207',
    name: 'CHN-207',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-657',
    name: 'CHN-657',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca908b',
    name: '35ca908b',
    flag: 'CHN',
  },
  {
    id: 'chn-34352bed',
    name: '34352bed',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac295b',
    name: '35ac295b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2509',
    name: 'CHN-2509',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2435',
    name: 'CHN-2435',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c31d',
    name: '3427c31d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b220c9',
    name: '35b220c9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-639',
    name: 'CHN-639',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-423',
    name: 'CHN-423',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6ff',
    name: '35b5d6ff',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f1dd',
    name: '35b5f1dd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1289',
    name: 'CHN-1289',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27d15',
    name: '35b27d15',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf5d',
    name: '3588bf5d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-804',
    name: 'CHN-804',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-508',
    name: 'CHN-508',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2098',
    name: 'CHN-2098',
    flag: 'CHN',
  },
  {
    id: 'chn-3434eff3',
    name: '3434eff3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6f455',
    name: '35b6f455',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca8fd1',
    name: '35ca8fd1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-94',
    name: 'CHN-94',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1315',
    name: 'CHN-1315',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b50f',
    name: '3403b50f',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c6d',
    name: '34352c6d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d5d5',
    name: '35b5d5d5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-998',
    name: 'CHN-998',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1813',
    name: 'CHN-1813',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1451',
    name: 'CHN-1451',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2608',
    name: 'CHN-2608',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-400',
    name: 'CHN-400',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d405',
    name: '35b5d405',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1442',
    name: 'CHN-1442',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2965',
    name: '35ac2965',
    flag: 'CHN',
  },
  {
    id: 'chn-34018647',
    name: '34018647',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1881',
    name: 'CHN-1881',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-201',
    name: 'CHN-201',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-321',
    name: 'CHN-321',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1229',
    name: 'CHN-1229',
    flag: 'CHN',
  },
  {
    id: 'chn-34352dab',
    name: '34352dab',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d771',
    name: '35b3d771',
    flag: 'CHN',
  },
  {
    id: 'chn-34287c81',
    name: '34287c81',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27085',
    name: '35b27085',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca7993',
    name: '35ca7993',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2337',
    name: 'CHN-2337',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1640',
    name: 'CHN-1640',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d733',
    name: '35b5d733',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68629',
    name: '35b68629',
    flag: 'CHN',
  },
  {
    id: 'chn-340229e7',
    name: '340229e7',
    flag: 'CHN',
  },
  {
    id: 'chn-3401a3e5',
    name: '3401a3e5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b26db1',
    name: '35b26db1',
    flag: 'CHN',
  },
  {
    id: 'chn-359610d5',
    name: '359610d5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f6cd',
    name: '35b5f6cd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-617',
    name: 'CHN-617',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1334',
    name: 'CHN-1334',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2539',
    name: 'CHN-2539',
    flag: 'CHN',
  },
  {
    id: 'chn-34018bbf',
    name: '34018bbf',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d667',
    name: '35b5d667',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1758',
    name: 'CHN-1758',
    flag: 'CHN',
  },
  {
    id: 'chn-342e4011',
    name: '342e4011',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9727',
    name: '35ca9727',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-896',
    name: 'CHN-896',
    flag: 'CHN',
  },
  {
    id: 'chn-sheyang',
    name: 'SHEYANG',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b23',
    name: '35b27b23',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2559',
    name: 'CHN-2559',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-351',
    name: 'CHN-351',
    flag: 'CHN',
  },
  {
    id: 'chn-35b287af',
    name: '35b287af',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac765',
    name: '35cac765',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1214',
    name: 'CHN-1214',
    flag: 'CHN',
  },
  {
    id: 'chn-340176c3',
    name: '340176c3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1175',
    name: 'CHN-1175',
    flag: 'CHN',
  },
  {
    id: 'chn-36839e3d',
    name: '36839e3d',
    flag: 'CHN',
  },
  {
    id: 'chn-35ec8c07',
    name: '35ec8c07',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1471',
    name: 'CHN-1471',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f49f',
    name: '3434f49f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d94d',
    name: '35b5d94d',
    flag: 'CHN',
  },
  {
    id: 'chn-34024bcf',
    name: '34024bcf',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d19',
    name: '34352d19',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-566',
    name: 'CHN-566',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d469',
    name: '35b5d469',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-636',
    name: 'CHN-636',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2510',
    name: 'CHN-2510',
    flag: 'CHN',
  },
  {
    id: 'chn-35caccfd',
    name: '35caccfd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-419',
    name: 'CHN-419',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f01d',
    name: '35b5f01d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1521',
    name: 'CHN-1521',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1faf',
    name: '342c1faf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2439',
    name: 'CHN-2439',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1361',
    name: 'CHN-1361',
    flag: 'CHN',
  },
  {
    id: 'chn-34017099',
    name: '34017099',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2006',
    name: 'CHN-2006',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c41',
    name: '34352c41',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b407',
    name: '3403b407',
    flag: 'CHN',
  },
  {
    id: 'chn-34018db9',
    name: '34018db9',
    flag: 'CHN',
  },
  {
    id: 'chn-macau',
    name: 'MACAU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-489',
    name: 'CHN-489',
    flag: 'CHN',
  },
  {
    id: 'chn-35b686e1',
    name: '35b686e1',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbd5',
    name: '35cacbd5',
    flag: 'CHN',
  },
  {
    id: 'chn-35bee4bd',
    name: '35bee4bd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-349',
    name: 'CHN-349',
    flag: 'CHN',
  },
  {
    id: 'chn-34287c87',
    name: '34287c87',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1221',
    name: 'CHN-1221',
    flag: 'CHN',
  },
  {
    id: 'chn-34018f6f',
    name: '34018f6f',
    flag: 'CHN',
  },
  {
    id: 'chn-345288c7',
    name: '345288c7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-552',
    name: 'CHN-552',
    flag: 'CHN',
  },
  {
    id: 'chn-3446c587',
    name: '3446c587',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b525',
    name: '3403b525',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-897',
    name: 'CHN-897',
    flag: 'CHN',
  },
  {
    id: 'chn-35b20523',
    name: '35b20523',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-889',
    name: 'CHN-889',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1226',
    name: 'CHN-1226',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d0d1',
    name: '35b5d0d1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1013',
    name: 'CHN-1013',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9eaf',
    name: '342e9eaf',
    flag: 'CHN',
  },
  {
    id: 'chn-342862f1',
    name: '342862f1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-142',
    name: 'CHN-142',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d70f',
    name: '35b5d70f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1285',
    name: 'CHN-1285',
    flag: 'CHN',
  },
  {
    id: 'chn-35b17157',
    name: '35b17157',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f075',
    name: '35b5f075',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-551',
    name: 'CHN-551',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5fa9f',
    name: '35b5fa9f',
    flag: 'CHN',
  },
  {
    id: 'chn-35bee49d',
    name: '35bee49d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-827',
    name: 'CHN-827',
    flag: 'CHN',
  },
  {
    id: 'chn-35b204d9',
    name: '35b204d9',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ad0d',
    name: '3403ad0d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-774',
    name: 'CHN-774',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e9b',
    name: '35ac2e9b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d951',
    name: '35b5d951',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c4d5',
    name: '3403c4d5',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b42d',
    name: '3403b42d',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79c3',
    name: '35ca79c3',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c84f',
    name: '3403c84f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1314',
    name: 'CHN-1314',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c51',
    name: '34352c51',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5ee2f',
    name: '35b5ee2f',
    flag: 'CHN',
  },
  {
    id: 'chn-lushan',
    name: 'LUSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1566',
    name: 'CHN-1566',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1179',
    name: 'CHN-1179',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1873',
    name: 'CHN-1873',
    flag: 'CHN',
  },
  {
    id: 'chn-3433ed53',
    name: '3433ed53',
    flag: 'CHN',
  },
  {
    id: 'chn-qinhuangdao',
    name: 'QINHUANGDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1996',
    name: 'CHN-1996',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e5ff',
    name: '3434e5ff',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6f4cb',
    name: '35b6f4cb',
    flag: 'CHN',
  },
  {
    id: 'chn-35cabf5b',
    name: '35cabf5b',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ada1',
    name: '3403ada1',
    flag: 'CHN',
  },
  {
    id: 'chn-yingkou',
    name: 'YINGKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1253',
    name: 'CHN-1253',
    flag: 'CHN',
  },
  {
    id: 'chn-34352be1',
    name: '34352be1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2491',
    name: 'CHN-2491',
    flag: 'CHN',
  },
  {
    id: 'chn-dandong',
    name: 'DANDONG',
    flag: 'CHN',
  },
  {
    id: 'chn-35b167eb',
    name: '35b167eb',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f71',
    name: '342e3f71',
    flag: 'CHN',
  },
  {
    id: 'chn-36b3255f',
    name: '36b3255f',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c247',
    name: '3427c247',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2427',
    name: 'CHN-2427',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1139',
    name: 'CHN-1139',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69f1f',
    name: '35b69f1f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ec8c6b',
    name: '35ec8c6b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1524',
    name: 'CHN-1524',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1136',
    name: 'CHN-1136',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1204',
    name: 'CHN-1204',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1457',
    name: 'CHN-1457',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1578',
    name: 'CHN-1578',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d41b',
    name: '35b5d41b',
    flag: 'CHN',
  },
  {
    id: 'chn-35ec8c11',
    name: '35ec8c11',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a565',
    name: '3403a565',
    flag: 'CHN',
  },
  {
    id: 'chn-34018dcd',
    name: '34018dcd',
    flag: 'CHN',
  },
  {
    id: 'chn-tangshan',
    name: 'TANGSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-422',
    name: 'CHN-422',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f07f',
    name: '35b5f07f',
    flag: 'CHN',
  },
  {
    id: 'chn-3403099b',
    name: '3403099b',
    flag: 'CHN',
  },
  {
    id: 'chn-34018875',
    name: '34018875',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca968d',
    name: '35ca968d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1899',
    name: 'CHN-1899',
    flag: 'CHN',
  },
  {
    id: 'chn-340443e7',
    name: '340443e7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27a7d',
    name: '35b27a7d',
    flag: 'CHN',
  },
  {
    id: 'chn-3446cf71',
    name: '3446cf71',
    flag: 'CHN',
  },
  {
    id: 'chn-3434742f',
    name: '3434742f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-991',
    name: 'CHN-991',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d14d',
    name: '35b5d14d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d137',
    name: '35b5d137',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-143',
    name: 'CHN-143',
    flag: 'CHN',
  },
  {
    id: 'chn-35b1740d',
    name: '35b1740d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-805',
    name: 'CHN-805',
    flag: 'CHN',
  },
  {
    id: 'chn-340307db',
    name: '340307db',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2274f',
    name: '35b2274f',
    flag: 'CHN',
  },
  {
    id: 'chn-zhoushan',
    name: 'ZHOUSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-35b170c7',
    name: '35b170c7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b91259',
    name: '35b91259',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b17',
    name: '34348b17',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1718',
    name: 'CHN-1718',
    flag: 'CHN',
  },
  {
    id: 'chn-346b2be7',
    name: '346b2be7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-460',
    name: 'CHN-460',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-514',
    name: 'CHN-514',
    flag: 'CHN',
  },
  {
    id: 'chn-34018f73',
    name: '34018f73',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca90cd',
    name: '35ca90cd',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac299b',
    name: '35ac299b',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a561',
    name: '3403a561',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1867',
    name: 'CHN-1867',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-412',
    name: 'CHN-412',
    flag: 'CHN',
  },
  {
    id: 'chn-3429353f',
    name: '3429353f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1673',
    name: 'CHN-1673',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf9d',
    name: '3588bf9d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-151',
    name: 'CHN-151',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1547',
    name: 'CHN-1547',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1287',
    name: 'CHN-1287',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-583',
    name: 'CHN-583',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2513',
    name: 'CHN-2513',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d67b',
    name: '35b5d67b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2313',
    name: 'CHN-2313',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-821',
    name: 'CHN-821',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9039',
    name: '35ca9039',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fb5',
    name: '342c1fb5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-706',
    name: 'CHN-706',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1672',
    name: 'CHN-1672',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1355',
    name: 'CHN-1355',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab847',
    name: '35cab847',
    flag: 'CHN',
  },
  {
    id: 'chn-35b1715b',
    name: '35b1715b',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac297f',
    name: '35ac297f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1636',
    name: 'CHN-1636',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1749',
    name: 'CHN-1749',
    flag: 'CHN',
  },
  {
    id: 'chn-3428632d',
    name: '3428632d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-816',
    name: 'CHN-816',
    flag: 'CHN',
  },
  {
    id: 'chn-3403db2d',
    name: '3403db2d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1757',
    name: 'CHN-1757',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-181',
    name: 'CHN-181',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1710',
    name: 'CHN-1710',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2438',
    name: 'CHN-2438',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f191',
    name: '35b5f191',
    flag: 'CHN',
  },
  {
    id: 'chn-35b9126f',
    name: '35b9126f',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ce8b',
    name: '3403ce8b',
    flag: 'CHN',
  },
  {
    id: 'chn-343475cb',
    name: '343475cb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-374',
    name: 'CHN-374',
    flag: 'CHN',
  },
  {
    id: 'chn-3596172b',
    name: '3596172b',
    flag: 'CHN',
  },
  {
    id: 'chn-35caba77',
    name: '35caba77',
    flag: 'CHN',
  },
  {
    id: 'chn-34287cbf',
    name: '34287cbf',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd6f',
    name: '3434dd6f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2079',
    name: 'CHN-2079',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc5f',
    name: '35cacc5f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d73d',
    name: '35b3d73d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-919',
    name: 'CHN-919',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1645',
    name: 'CHN-1645',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9fb5',
    name: '342e9fb5',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac761',
    name: '35cac761',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2192',
    name: 'CHN-2192',
    flag: 'CHN',
  },
  {
    id: 'chn-340229db',
    name: '340229db',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d1f',
    name: '34352d1f',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3ff7',
    name: '342e3ff7',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbd1',
    name: '35cacbd1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1733',
    name: 'CHN-1733',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6f4fb',
    name: '35b6f4fb',
    flag: 'CHN',
  },
  {
    id: 'chn-34018637',
    name: '34018637',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac77b',
    name: '35cac77b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-99',
    name: 'CHN-99',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca921d',
    name: '35ca921d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d5b1',
    name: '35b5d5b1',
    flag: 'CHN',
  },
  {
    id: 'chn-342e6a81',
    name: '342e6a81',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1829',
    name: 'CHN-1829',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-251',
    name: 'CHN-251',
    flag: 'CHN',
  },
  {
    id: 'chn-31532639',
    name: '31532639',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab8a1',
    name: '35cab8a1',
    flag: 'CHN',
  },
  {
    id: 'chn-zhanjiang',
    name: 'ZHANJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1900',
    name: 'CHN-1900',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1801',
    name: 'CHN-1801',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2ef3',
    name: '35ac2ef3',
    flag: 'CHN',
  },
  {
    id: 'chn-340176dd',
    name: '340176dd',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e93',
    name: '35ac2e93',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1475',
    name: 'CHN-1475',
    flag: 'CHN',
  },
  {
    id: 'chn-34017b03',
    name: '34017b03',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f09',
    name: '342e3f09',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-348',
    name: 'CHN-348',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6822b',
    name: '35b6822b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f007',
    name: '35b5f007',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1874',
    name: 'CHN-1874',
    flag: 'CHN',
  },
  {
    id: 'chn-weihai',
    name: 'WEIHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-3452b657',
    name: '3452b657',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f0bb',
    name: '35b5f0bb',
    flag: 'CHN',
  },
  {
    id: 'chn-fengdu',
    name: 'FENGDU',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a6f5',
    name: '3403a6f5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-441',
    name: 'CHN-441',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-274',
    name: 'CHN-274',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-739',
    name: 'CHN-739',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1661',
    name: 'CHN-1661',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9167',
    name: '35ca9167',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ec7',
    name: '342e9ec7',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c84b',
    name: '3403c84b',
    flag: 'CHN',
  },
  {
    id: 'chn-tianjin',
    name: 'TIANJIN',
    flag: 'CHN',
  },
  {
    id: 'chn-35ada545',
    name: '35ada545',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e5f1',
    name: '3434e5f1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-289',
    name: 'CHN-289',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1427',
    name: 'CHN-1427',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae067f',
    name: '35ae067f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1406',
    name: 'CHN-1406',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b11',
    name: '34348b11',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27a95',
    name: '35b27a95',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-844',
    name: 'CHN-844',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-344',
    name: 'CHN-344',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1659',
    name: 'CHN-1659',
    flag: 'CHN',
  },
  {
    id: 'chn-kaolaotou',
    name: 'KAOLAOTOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-431',
    name: 'CHN-431',
    flag: 'CHN',
  },
  {
    id: 'chn-35b170fd',
    name: '35b170fd',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5fa99',
    name: '35b5fa99',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f27',
    name: '342e3f27',
    flag: 'CHN',
  },
  {
    id: 'chn-340188ad',
    name: '340188ad',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea707',
    name: '342ea707',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2451',
    name: 'CHN-2451',
    flag: 'CHN',
  },
  {
    id: 'chn-340181a9',
    name: '340181a9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1258',
    name: 'CHN-1258',
    flag: 'CHN',
  },
  {
    id: 'chn-35b220c7',
    name: '35b220c7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b92457',
    name: '35b92457',
    flag: 'CHN',
  },
  {
    id: 'chn-34287bd7',
    name: '34287bd7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-622',
    name: 'CHN-622',
    flag: 'CHN',
  },
  {
    id: 'chn-34018b8d',
    name: '34018b8d',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e785',
    name: '3434e785',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2562',
    name: 'CHN-2562',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-543',
    name: 'CHN-543',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-567',
    name: 'CHN-567',
    flag: 'CHN',
  },
  {
    id: 'chn-34021f8b',
    name: '34021f8b',
    flag: 'CHN',
  },
  {
    id: 'chn-358b8663',
    name: '358b8663',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-248',
    name: 'CHN-248',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b29',
    name: '34348b29',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b3f',
    name: '34348b3f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2517',
    name: 'CHN-2517',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae017b',
    name: '35ae017b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b288d1',
    name: '35b288d1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1119',
    name: 'CHN-1119',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f91',
    name: '342e3f91',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1617',
    name: 'CHN-1617',
    flag: 'CHN',
  },
  {
    id: 'chn-35878d39',
    name: '35878d39',
    flag: 'CHN',
  },
  {
    id: 'chn-zhongshan',
    name: 'ZHONGSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-34017a89',
    name: '34017a89',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3157',
    name: '35ac3157',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1723',
    name: 'CHN-1723',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f09f',
    name: '35b5f09f',
    flag: 'CHN',
  },
  {
    id: 'chn-hongkong',
    name: 'HONGKONG',
    flag: 'CHN',
  },
  {
    id: 'chn-35b688e5',
    name: '35b688e5',
    flag: 'CHN',
  },
  {
    id: 'chn-zhenjiang',
    name: 'ZHENJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1498',
    name: 'CHN-1498',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1803',
    name: 'CHN-1803',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6862f',
    name: '35b6862f',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b97',
    name: '34024b97',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-338',
    name: 'CHN-338',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-933',
    name: 'CHN-933',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-745',
    name: 'CHN-745',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1356',
    name: 'CHN-1356',
    flag: 'CHN',
  },
  {
    id: 'chn-340229d9',
    name: '340229d9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1132',
    name: 'CHN-1132',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1091',
    name: 'CHN-1091',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1203',
    name: 'CHN-1203',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2167',
    name: 'CHN-2167',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2274d',
    name: '35b2274d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-669',
    name: 'CHN-669',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1741',
    name: 'CHN-1741',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2597',
    name: 'CHN-2597',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1476',
    name: 'CHN-1476',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca8fd7',
    name: '35ca8fd7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1282',
    name: 'CHN-1282',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1549',
    name: 'CHN-1549',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1838',
    name: 'CHN-1838',
    flag: 'CHN',
  },
  {
    id: 'chn-34352bef',
    name: '34352bef',
    flag: 'CHN',
  },
  {
    id: 'chn-34352b8d',
    name: '34352b8d',
    flag: 'CHN',
  },
  {
    id: 'chn-34287c95',
    name: '34287c95',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2563',
    name: 'CHN-2563',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6f5',
    name: '35b5d6f5',
    flag: 'CHN',
  },
  {
    id: 'chn-35bee363',
    name: '35bee363',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d0cb',
    name: '35b5d0cb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1001',
    name: 'CHN-1001',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbf1',
    name: '35cacbf1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1060',
    name: 'CHN-1060',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-599',
    name: 'CHN-599',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-475',
    name: 'CHN-475',
    flag: 'CHN',
  },
  {
    id: 'chn-36b32e31',
    name: '36b32e31',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1006',
    name: 'CHN-1006',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1187',
    name: 'CHN-1187',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1674',
    name: 'CHN-1674',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2426',
    name: 'CHN-2426',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab8f3',
    name: '35cab8f3',
    flag: 'CHN',
  },
  {
    id: 'chn-ganpu',
    name: 'GANPU',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2967',
    name: '35ac2967',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2558',
    name: 'CHN-2558',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68187',
    name: '35b68187',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad9893',
    name: '35ad9893',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79d7',
    name: '35ca79d7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-199',
    name: 'CHN-199',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1434',
    name: 'CHN-1434',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9041',
    name: '35ca9041',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1769',
    name: 'CHN-1769',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c6f',
    name: '34018c6f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d409',
    name: '35b5d409',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-193',
    name: 'CHN-193',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-836',
    name: 'CHN-836',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca903b',
    name: '35ca903b',
    flag: 'CHN',
  },
  {
    id: 'chn-34287b87',
    name: '34287b87',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f37f',
    name: '3434f37f',
    flag: 'CHN',
  },
  {
    id: 'chn-340249a1',
    name: '340249a1',
    flag: 'CHN',
  },
  {
    id: 'chn-3401709d',
    name: '3401709d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f1c5',
    name: '35b5f1c5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-894',
    name: 'CHN-894',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1676',
    name: 'CHN-1676',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1419',
    name: 'CHN-1419',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-507',
    name: 'CHN-507',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1479',
    name: 'CHN-1479',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-877',
    name: 'CHN-877',
    flag: 'CHN',
  },
  {
    id: 'chn-3587f2a9',
    name: '3587f2a9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2142',
    name: 'CHN-2142',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2326',
    name: 'CHN-2326',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-103',
    name: 'CHN-103',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1653',
    name: 'CHN-1653',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-496',
    name: 'CHN-496',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1875',
    name: 'CHN-1875',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cdd5',
    name: '3403cdd5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-158',
    name: 'CHN-158',
    flag: 'CHN',
  },
  {
    id: 'chn-3401880b',
    name: '3401880b',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc59',
    name: '35cacc59',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1414',
    name: 'CHN-1414',
    flag: 'CHN',
  },
  {
    id: 'chn-3411da1f',
    name: '3411da1f',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dcb7',
    name: '3427dcb7',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c4b',
    name: '34018c4b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b686df',
    name: '35b686df',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1652',
    name: 'CHN-1652',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf63',
    name: '3588bf63',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b79',
    name: '34024b79',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1062',
    name: 'CHN-1062',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1025',
    name: 'CHN-1025',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27adb',
    name: '35b27adb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2120',
    name: 'CHN-2120',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28eb5',
    name: '35b28eb5',
    flag: 'CHN',
  },
  {
    id: 'chn-34018fbd',
    name: '34018fbd',
    flag: 'CHN',
  },
  {
    id: 'chn-34030795',
    name: '34030795',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-778',
    name: 'CHN-778',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d507',
    name: '35b5d507',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1905',
    name: 'CHN-1905',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2154',
    name: 'CHN-2154',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6af',
    name: '35b5d6af',
    flag: 'CHN',
  },
  {
    id: 'chn-3434742d',
    name: '3434742d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d701',
    name: '35b5d701',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad88d5',
    name: '35ad88d5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-971',
    name: 'CHN-971',
    flag: 'CHN',
  },
  {
    id: 'chn-34338bb7',
    name: '34338bb7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2477',
    name: 'CHN-2477',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca902b',
    name: '35ca902b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1554',
    name: 'CHN-1554',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-722',
    name: 'CHN-722',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d40f',
    name: '35b5d40f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2171',
    name: 'CHN-2171',
    flag: 'CHN',
  },
  {
    id: 'chn-3446cf7b',
    name: '3446cf7b',
    flag: 'CHN',
  },
  {
    id: 'chn-34338b9f',
    name: '34338b9f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-238',
    name: 'CHN-238',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-979',
    name: 'CHN-979',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2561',
    name: 'CHN-2561',
    flag: 'CHN',
  },
  {
    id: 'chn-3403bb7f',
    name: '3403bb7f',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd0d',
    name: '3434dd0d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6fd',
    name: '35b5d6fd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1722',
    name: 'CHN-1722',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-425',
    name: 'CHN-425',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2342',
    name: 'CHN-2342',
    flag: 'CHN',
  },
  {
    id: 'chn-35b91265',
    name: '35b91265',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9f01',
    name: '342e9f01',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c43',
    name: '34352c43',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1866',
    name: 'CHN-1866',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef9b',
    name: '3434ef9b',
    flag: 'CHN',
  },
  {
    id: 'chn-3434efef',
    name: '3434efef',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f3ed',
    name: '3434f3ed',
    flag: 'CHN',
  },
  {
    id: 'chn-liuao',
    name: 'LIUAO',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-439',
    name: 'CHN-439',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d703',
    name: '35b5d703',
    flag: 'CHN',
  },
  {
    id: 'chn-nanjing',
    name: 'NANJING',
    flag: 'CHN',
  },
  {
    id: 'chn-35b686fb',
    name: '35b686fb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d559',
    name: '35b5d559',
    flag: 'CHN',
  },
  {
    id: 'chn-340229e9',
    name: '340229e9',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c55d',
    name: '3403c55d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28c41',
    name: '35b28c41',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1239',
    name: 'CHN-1239',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-820',
    name: 'CHN-820',
    flag: 'CHN',
  },
  {
    id: 'chn-34018bc7',
    name: '34018bc7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27d7d',
    name: '35b27d7d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2468',
    name: 'CHN-2468',
    flag: 'CHN',
  },
  {
    id: 'chn-35b20507',
    name: '35b20507',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d691',
    name: '35b3d691',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf75',
    name: '3588bf75',
    flag: 'CHN',
  },
  {
    id: 'chn-yantiananchorage',
    name: 'YANTIAN ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'chn-34287be5',
    name: '34287be5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2066',
    name: 'CHN-2066',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1720',
    name: 'CHN-1720',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca7d33',
    name: '35ca7d33',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac793',
    name: '35cac793',
    flag: 'CHN',
  },
  {
    id: 'chn-34024bc1',
    name: '34024bc1',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d03',
    name: '34352d03',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b19',
    name: '34348b19',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6b1',
    name: '35b5d6b1',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c49',
    name: '34018c49',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ebb',
    name: '342e9ebb',
    flag: 'CHN',
  },
  {
    id: 'chn-cangzhou',
    name: 'CANGZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1898',
    name: 'CHN-1898',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1807',
    name: 'CHN-1807',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c2e3',
    name: '3427c2e3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69eb1',
    name: '35b69eb1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1094',
    name: 'CHN-1094',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1424',
    name: 'CHN-1424',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27a3d',
    name: '35b27a3d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1846',
    name: 'CHN-1846',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-546',
    name: 'CHN-546',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1879',
    name: 'CHN-1879',
    flag: 'CHN',
  },
  {
    id: 'chn-35b288db',
    name: '35b288db',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1016',
    name: 'CHN-1016',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28c1f',
    name: '35b28c1f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6891d',
    name: '35b6891d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1385',
    name: 'CHN-1385',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dc91',
    name: '3427dc91',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f1c3',
    name: '35b5f1c3',
    flag: 'CHN',
  },
  {
    id: 'chn-340307d5',
    name: '340307d5',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb56b',
    name: '342eb56b',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca90d3',
    name: '35ca90d3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-558',
    name: 'CHN-558',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d711',
    name: '35b5d711',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f1b',
    name: '342e3f1b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-866',
    name: 'CHN-866',
    flag: 'CHN',
  },
  {
    id: 'chn-340307c7',
    name: '340307c7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f0b7',
    name: '35b5f0b7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1305',
    name: 'CHN-1305',
    flag: 'CHN',
  },
  {
    id: 'chn-343392ab',
    name: '343392ab',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d149',
    name: '35b5d149',
    flag: 'CHN',
  },
  {
    id: 'chn-3401bd07',
    name: '3401bd07',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-186',
    name: 'CHN-186',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-958',
    name: 'CHN-958',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-246',
    name: 'CHN-246',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f37d',
    name: '3434f37d',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c9cf',
    name: '3403c9cf',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2893b',
    name: '35b2893b',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb53d',
    name: '342eb53d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-692',
    name: 'CHN-692',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2526',
    name: 'CHN-2526',
    flag: 'CHN',
  },
  {
    id: 'chn-344d893f',
    name: '344d893f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1616',
    name: 'CHN-1616',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2265',
    name: 'CHN-2265',
    flag: 'CHN',
  },
  {
    id: 'chn-yazhou',
    name: 'YAZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2473',
    name: 'CHN-2473',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1116',
    name: 'CHN-1116',
    flag: 'CHN',
  },
  {
    id: 'chn-35b67fff',
    name: '35b67fff',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacb8b',
    name: '35cacb8b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2229',
    name: 'CHN-2229',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc1b',
    name: '35cacc1b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68225',
    name: '35b68225',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1699',
    name: 'CHN-1699',
    flag: 'CHN',
  },
  {
    id: 'chn-huanggang',
    name: 'HUANGGANG',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-710',
    name: 'CHN-710',
    flag: 'CHN',
  },
  {
    id: 'chn-34018765',
    name: '34018765',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca7997',
    name: '35ca7997',
    flag: 'CHN',
  },
  {
    id: 'chn-nanshaojia',
    name: 'NANSHAOJIA',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1808',
    name: 'CHN-1808',
    flag: 'CHN',
  },
  {
    id: 'chn-35b15d29',
    name: '35b15d29',
    flag: 'CHN',
  },
  {
    id: 'chn-340307d9',
    name: '340307d9',
    flag: 'CHN',
  },
  {
    id: 'chn-34338ba3',
    name: '34338ba3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-800',
    name: 'CHN-800',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3407',
    name: '35ac3407',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cff9',
    name: '3403cff9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d14f',
    name: '35b5d14f',
    flag: 'CHN',
  },
  {
    id: 'chn-35bee497',
    name: '35bee497',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-691',
    name: 'CHN-691',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d40d',
    name: '35b5d40d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d135',
    name: '35b5d135',
    flag: 'CHN',
  },
  {
    id: 'chn-3401915f',
    name: '3401915f',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a6f7',
    name: '3403a6f7',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e9d',
    name: '35ac2e9d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-817',
    name: 'CHN-817',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-582',
    name: 'CHN-582',
    flag: 'CHN',
  },
  {
    id: 'chn-36ab1c7b',
    name: '36ab1c7b',
    flag: 'CHN',
  },
  {
    id: 'chn-34018f5b',
    name: '34018f5b',
    flag: 'CHN',
  },
  {
    id: 'chn-sanshaanchorage',
    name: 'SANSHA ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc5d',
    name: '35cacc5d',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2bd1',
    name: '35ac2bd1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1189',
    name: 'CHN-1189',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6872b',
    name: '35b6872b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-624',
    name: 'CHN-624',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1525',
    name: 'CHN-1525',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca91f7',
    name: '35ca91f7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1804',
    name: 'CHN-1804',
    flag: 'CHN',
  },
  {
    id: 'chn-36839e23',
    name: '36839e23',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1121',
    name: 'CHN-1121',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5efcd',
    name: '35b5efcd',
    flag: 'CHN',
  },
  {
    id: 'chn-3427d9b5',
    name: '3427d9b5',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3ad1',
    name: '35ac3ad1',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e61',
    name: '35ac2e61',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3e3f3',
    name: '35b3e3f3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-604',
    name: 'CHN-604',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-748',
    name: 'CHN-748',
    flag: 'CHN',
  },
  {
    id: 'chn-34017a87',
    name: '34017a87',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-968',
    name: 'CHN-968',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c255',
    name: '3427c255',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2408',
    name: 'CHN-2408',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-641',
    name: 'CHN-641',
    flag: 'CHN',
  },
  {
    id: 'chn-340176e1',
    name: '340176e1',
    flag: 'CHN',
  },
  {
    id: 'chn-yangpu',
    name: 'YANGPU',
    flag: 'CHN',
  },
  {
    id: 'chn-340307bd',
    name: '340307bd',
    flag: 'CHN',
  },
  {
    id: 'chn-342862db',
    name: '342862db',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1704',
    name: 'CHN-1704',
    flag: 'CHN',
  },
  {
    id: 'chn-dongping',
    name: 'DONGPING',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c223',
    name: '3427c223',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac9c1',
    name: '35cac9c1',
    flag: 'CHN',
  },
  {
    id: 'chn-3434efc3',
    name: '3434efc3',
    flag: 'CHN',
  },
  {
    id: 'chn-meizhouisland',
    name: 'MEIZHOU ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-941',
    name: 'CHN-941',
    flag: 'CHN',
  },
  {
    id: 'chn-35b226e1',
    name: '35b226e1',
    flag: 'CHN',
  },
  {
    id: 'chn-36b32fc3',
    name: '36b32fc3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-611',
    name: 'CHN-611',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1076',
    name: 'CHN-1076',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-975',
    name: 'CHN-975',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-430',
    name: 'CHN-430',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1127',
    name: 'CHN-1127',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1539',
    name: 'CHN-1539',
    flag: 'CHN',
  },
  {
    id: 'chn-34287967',
    name: '34287967',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9e4d',
    name: '342e9e4d',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ee5',
    name: '342e9ee5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1171',
    name: 'CHN-1171',
    flag: 'CHN',
  },
  {
    id: 'chn-34338b9d',
    name: '34338b9d',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ea9',
    name: '342e9ea9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-594',
    name: 'CHN-594',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1234',
    name: 'CHN-1234',
    flag: 'CHN',
  },
  {
    id: 'chn-35b912f9',
    name: '35b912f9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b67fe3',
    name: '35b67fe3',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b50d',
    name: '3403b50d',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c3f',
    name: '34352c3f',
    flag: 'CHN',
  },
  {
    id: 'chn-34046c5d',
    name: '34046c5d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58af3',
    name: '35b58af3',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ce1',
    name: '342e9ce1',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c47',
    name: '34018c47',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2432',
    name: 'CHN-2432',
    flag: 'CHN',
  },
  {
    id: 'chn-35b26d79',
    name: '35b26d79',
    flag: 'CHN',
  },
  {
    id: 'chn-3434744b',
    name: '3434744b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-861',
    name: 'CHN-861',
    flag: 'CHN',
  },
  {
    id: 'chn-3403bb81',
    name: '3403bb81',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5fa9d',
    name: '35b5fa9d',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9d1b',
    name: '342e9d1b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1958',
    name: 'CHN-1958',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca96d9',
    name: '35ca96d9',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca90f3',
    name: '35ca90f3',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c57b',
    name: '3403c57b',
    flag: 'CHN',
  },
  {
    id: 'chn-wuhan',
    name: 'WUHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-590',
    name: 'CHN-590',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e17',
    name: '342c1e17',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1087',
    name: 'CHN-1087',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3ad7',
    name: '35ac3ad7',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ee95',
    name: '3403ee95',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2102',
    name: 'CHN-2102',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1271',
    name: 'CHN-1271',
    flag: 'CHN',
  },
  {
    id: 'chn-3401709f',
    name: '3401709f',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af7b',
    name: '3403af7b',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b409',
    name: '3403b409',
    flag: 'CHN',
  },
  {
    id: 'chn-xiamen',
    name: 'XIAMEN',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d50f',
    name: '35b5d50f',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea7af',
    name: '342ea7af',
    flag: 'CHN',
  },
  {
    id: 'chn-34018fa3',
    name: '34018fa3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1182',
    name: 'CHN-1182',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1746',
    name: 'CHN-1746',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-492',
    name: 'CHN-492',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79d1',
    name: '35ca79d1',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb539',
    name: '342eb539',
    flag: 'CHN',
  },
  {
    id: 'chn-35b912fd',
    name: '35b912fd',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dcb5',
    name: '3427dcb5',
    flag: 'CHN',
  },
  {
    id: 'chn-340180b7',
    name: '340180b7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6822f',
    name: '35b6822f',
    flag: 'CHN',
  },
  {
    id: 'chn-3411d1af',
    name: '3411d1af',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1517',
    name: 'CHN-1517',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1413',
    name: 'CHN-1413',
    flag: 'CHN',
  },
  {
    id: 'chn-36ab1d33',
    name: '36ab1d33',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2141',
    name: 'CHN-2141',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1169',
    name: 'CHN-1169',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b27',
    name: '34348b27',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27d69',
    name: '35b27d69',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1649',
    name: 'CHN-1649',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28891',
    name: '35b28891',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-413',
    name: 'CHN-413',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-523',
    name: 'CHN-523',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af9d',
    name: '3403af9d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-206',
    name: 'CHN-206',
    flag: 'CHN',
  },
  {
    id: 'chn-35b167c1',
    name: '35b167c1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1724',
    name: 'CHN-1724',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e71',
    name: '35ac2e71',
    flag: 'CHN',
  },
  {
    id: 'chn-35ec8eab',
    name: '35ec8eab',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e91',
    name: '35ac2e91',
    flag: 'CHN',
  },
  {
    id: 'chn-34046dab',
    name: '34046dab',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-764',
    name: 'CHN-764',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e05',
    name: '342c1e05',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68181',
    name: '35b68181',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-887',
    name: 'CHN-887',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f21',
    name: '342e3f21',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f1c1',
    name: '35b5f1c1',
    flag: 'CHN',
  },
  {
    id: 'chn-342862dd',
    name: '342862dd',
    flag: 'CHN',
  },
  {
    id: 'chn-tieshan',
    name: 'TIESHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-34017407',
    name: '34017407',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3b1d',
    name: '35ac3b1d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1627',
    name: 'CHN-1627',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9193',
    name: '35ca9193',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6823d',
    name: '35b6823d',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b49',
    name: '34348b49',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b9b',
    name: '34024b9b',
    flag: 'CHN',
  },
  {
    id: 'chn-guangzhou',
    name: 'GUANGZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2506',
    name: 'CHN-2506',
    flag: 'CHN',
  },
  {
    id: 'chn-34018bb1',
    name: '34018bb1',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d41d',
    name: '35b5d41d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-227',
    name: 'CHN-227',
    flag: 'CHN',
  },
  {
    id: 'chn-3427d833',
    name: '3427d833',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-683',
    name: 'CHN-683',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28c6b',
    name: '35b28c6b',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad988f',
    name: '35ad988f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-417',
    name: 'CHN-417',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1093',
    name: 'CHN-1093',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e75',
    name: '35ac2e75',
    flag: 'CHN',
  },
  {
    id: 'chn-342862f5',
    name: '342862f5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d5b5',
    name: '35b5d5b5',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b7b',
    name: '34024b7b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f09d',
    name: '35b5f09d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69edb',
    name: '35b69edb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b287cd',
    name: '35b287cd',
    flag: 'CHN',
  },
  {
    id: 'chn-340308ef',
    name: '340308ef',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2018',
    name: 'CHN-2018',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2113',
    name: 'CHN-2113',
    flag: 'CHN',
  },
  {
    id: 'chn-jiayang',
    name: 'JIAYANG',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2110',
    name: 'CHN-2110',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2535',
    name: 'CHN-2535',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea75b',
    name: '342ea75b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-586',
    name: 'CHN-586',
    flag: 'CHN',
  },
  {
    id: 'chn-35b17e1b',
    name: '35b17e1b',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9eb1',
    name: '342e9eb1',
    flag: 'CHN',
  },
  {
    id: 'chn-34018899',
    name: '34018899',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef9d',
    name: '3434ef9d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1885',
    name: 'CHN-1885',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1894',
    name: 'CHN-1894',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d67f',
    name: '35b5d67f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d655',
    name: '35b5d655',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1763',
    name: 'CHN-1763',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2195',
    name: 'CHN-2195',
    flag: 'CHN',
  },
  {
    id: 'chn-35b91271',
    name: '35b91271',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69ead',
    name: '35b69ead',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2234',
    name: 'CHN-2234',
    flag: 'CHN',
  },
  {
    id: 'chn-340187f3',
    name: '340187f3',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab88d',
    name: '35cab88d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1878',
    name: 'CHN-1878',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-886',
    name: 'CHN-886',
    flag: 'CHN',
  },
  {
    id: 'chn-3401862d',
    name: '3401862d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1329',
    name: 'CHN-1329',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1631',
    name: 'CHN-1631',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2ef5',
    name: '35ac2ef5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d5a9',
    name: '35b5d5a9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1964',
    name: 'CHN-1964',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca8e25',
    name: '35ca8e25',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d5f3',
    name: '35b3d5f3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b47',
    name: '35b27b47',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6f4c5',
    name: '35b6f4c5',
    flag: 'CHN',
  },
  {
    id: 'chn-340308e5',
    name: '340308e5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-340',
    name: 'CHN-340',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2384',
    name: 'CHN-2384',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69f17',
    name: '35b69f17',
    flag: 'CHN',
  },
  {
    id: 'chn-zhangzhou',
    name: 'ZHANGZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c4f',
    name: '34352c4f',
    flag: 'CHN',
  },
  {
    id: 'chn-34018fbf',
    name: '34018fbf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1833',
    name: 'CHN-1833',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2de5',
    name: '35ac2de5',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ad9b',
    name: '3403ad9b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2114',
    name: 'CHN-2114',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1805',
    name: 'CHN-1805',
    flag: 'CHN',
  },
  {
    id: 'chn-3452b6f7',
    name: '3452b6f7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2094',
    name: 'CHN-2094',
    flag: 'CHN',
  },
  {
    id: 'chn-3594925b',
    name: '3594925b',
    flag: 'CHN',
  },
  {
    id: 'chn-34024c7f',
    name: '34024c7f',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c05',
    name: '34352c05',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c84d',
    name: '3403c84d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d79f',
    name: '35b3d79f',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd6d',
    name: '3434dd6d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1969',
    name: 'CHN-1969',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-217',
    name: 'CHN-217',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1038',
    name: 'CHN-1038',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af83',
    name: '3403af83',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2191',
    name: 'CHN-2191',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc0b',
    name: '35cacc0b',
    flag: 'CHN',
  },
  {
    id: 'chn-340308ed',
    name: '340308ed',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1114',
    name: 'CHN-1114',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1275',
    name: 'CHN-1275',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c9c3',
    name: '3403c9c3',
    flag: 'CHN',
  },
  {
    id: 'chn-36b32e37',
    name: '36b32e37',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-653',
    name: 'CHN-653',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae0159',
    name: '35ae0159',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2163',
    name: 'CHN-2163',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae0427',
    name: '35ae0427',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b1b',
    name: '35b27b1b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d511',
    name: '35b5d511',
    flag: 'CHN',
  },
  {
    id: 'chn-340307d7',
    name: '340307d7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d473',
    name: '35b5d473',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28893',
    name: '35b28893',
    flag: 'CHN',
  },
  {
    id: 'chn-34287c7f',
    name: '34287c7f',
    flag: 'CHN',
  },
  {
    id: 'chn-34293551',
    name: '34293551',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca917d',
    name: '35ca917d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2273b',
    name: '35b2273b',
    flag: 'CHN',
  },
  {
    id: 'chn-35ec8c13',
    name: '35ec8c13',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f77',
    name: '342e3f77',
    flag: 'CHN',
  },
  {
    id: 'chn-3401811f',
    name: '3401811f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1028',
    name: 'CHN-1028',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3b23',
    name: '35ac3b23',
    flag: 'CHN',
  },
  {
    id: 'chn-3434eff5',
    name: '3434eff5',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef8b',
    name: '3434ef8b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-370',
    name: 'CHN-370',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2507',
    name: 'CHN-2507',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1820',
    name: 'CHN-1820',
    flag: 'CHN',
  },
  {
    id: 'chn-35b688ed',
    name: '35b688ed',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ad13',
    name: '3403ad13',
    flag: 'CHN',
  },
  {
    id: 'chn-36b32fe9',
    name: '36b32fe9',
    flag: 'CHN',
  },
  {
    id: 'chn-3587f2a5',
    name: '3587f2a5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b26d9d',
    name: '35b26d9d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1085',
    name: 'CHN-1085',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fcb',
    name: '342c1fcb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28929',
    name: '35b28929',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d14b',
    name: '35b5d14b',
    flag: 'CHN',
  },
  {
    id: 'chn-34293523',
    name: '34293523',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3143',
    name: '35ac3143',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb513',
    name: '342eb513',
    flag: 'CHN',
  },
  {
    id: 'chn-35b924f9',
    name: '35b924f9',
    flag: 'CHN',
  },
  {
    id: 'chn-3403dabb',
    name: '3403dabb',
    flag: 'CHN',
  },
  {
    id: 'chn-36aaff57',
    name: '36aaff57',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d403',
    name: '35b5d403',
    flag: 'CHN',
  },
  {
    id: 'chn-3446c589',
    name: '3446c589',
    flag: 'CHN',
  },
  {
    id: 'chn-35b91273',
    name: '35b91273',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f38d',
    name: '3434f38d',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad98eb',
    name: '35ad98eb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2480',
    name: 'CHN-2480',
    flag: 'CHN',
  },
  {
    id: 'chn-340176e7',
    name: '340176e7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2099',
    name: 'CHN-2099',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-771',
    name: 'CHN-771',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d775',
    name: '35b3d775',
    flag: 'CHN',
  },
  {
    id: 'chn-3431b6fb',
    name: '3431b6fb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1262',
    name: 'CHN-1262',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-779',
    name: 'CHN-779',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1445',
    name: 'CHN-1445',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1012',
    name: 'CHN-1012',
    flag: 'CHN',
  },
  {
    id: 'chn-35878d37',
    name: '35878d37',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ea3',
    name: '342e9ea3',
    flag: 'CHN',
  },
  {
    id: 'chn-340308f5',
    name: '340308f5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1574',
    name: 'CHN-1574',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea0a7',
    name: '342ea0a7',
    flag: 'CHN',
  },
  {
    id: 'chn-34018757',
    name: '34018757',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2876b',
    name: '35b2876b',
    flag: 'CHN',
  },
  {
    id: 'chn-shenquan',
    name: 'SHENQUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-35b91305',
    name: '35b91305',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-934',
    name: 'CHN-934',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c257',
    name: '3427c257',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-644',
    name: 'CHN-644',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fbf',
    name: '342c1fbf',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ca9d',
    name: '3403ca9d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1008',
    name: 'CHN-1008',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1942',
    name: 'CHN-1942',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-930',
    name: 'CHN-930',
    flag: 'CHN',
  },
  {
    id: 'chn-35b173ff',
    name: '35b173ff',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1f95',
    name: '342c1f95',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f05',
    name: '342e3f05',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9eb7',
    name: '342e9eb7',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca90cf',
    name: '35ca90cf',
    flag: 'CHN',
  },
  {
    id: 'chn-wuxi',
    name: 'WUXI',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-330',
    name: 'CHN-330',
    flag: 'CHN',
  },
  {
    id: 'chn-34018bf5',
    name: '34018bf5',
    flag: 'CHN',
  },
  {
    id: 'chn-34293517',
    name: '34293517',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab8fd',
    name: '35cab8fd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-682',
    name: 'CHN-682',
    flag: 'CHN',
  },
  {
    id: 'chn-36837591',
    name: '36837591',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58a59',
    name: '35b58a59',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-913',
    name: 'CHN-913',
    flag: 'CHN',
  },
  {
    id: 'chn-35b288eb',
    name: '35b288eb',
    flag: 'CHN',
  },
  {
    id: 'chn-340176e5',
    name: '340176e5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1195',
    name: 'CHN-1195',
    flag: 'CHN',
  },
  {
    id: 'chn-35b15983',
    name: '35b15983',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-382',
    name: 'CHN-382',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2560',
    name: 'CHN-2560',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5ee2d',
    name: '35b5ee2d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-852',
    name: 'CHN-852',
    flag: 'CHN',
  },
  {
    id: 'chn-35cabeff',
    name: '35cabeff',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f29',
    name: '342e3f29',
    flag: 'CHN',
  },
  {
    id: 'chn-bayuquan',
    name: 'BAYUQUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab8f5',
    name: '35cab8f5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-675',
    name: 'CHN-675',
    flag: 'CHN',
  },
  {
    id: 'chn-36b32fdb',
    name: '36b32fdb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1835',
    name: 'CHN-1835',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca631f',
    name: '35ca631f',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c521',
    name: '3403c521',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-394',
    name: 'CHN-394',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9e53',
    name: '342e9e53',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f0b',
    name: '342e3f0b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b20529',
    name: '35b20529',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1157',
    name: 'CHN-1157',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae06a1',
    name: '35ae06a1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2239',
    name: 'CHN-2239',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1046',
    name: 'CHN-1046',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f0cd',
    name: '35b5f0cd',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b1d',
    name: '35b27b1d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b21b2b',
    name: '35b21b2b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1632',
    name: 'CHN-1632',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-76',
    name: 'CHN-76',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2533',
    name: 'CHN-2533',
    flag: 'CHN',
  },
  {
    id: 'chn-34024853',
    name: '34024853',
    flag: 'CHN',
  },
  {
    id: 'chn-342e4009',
    name: '342e4009',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d565',
    name: '35b5d565',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79ef',
    name: '35ca79ef',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab853',
    name: '35cab853',
    flag: 'CHN',
  },
  {
    id: 'chn-35b15ce1',
    name: '35b15ce1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1713',
    name: 'CHN-1713',
    flag: 'CHN',
  },
  {
    id: 'chn-35f2a50b',
    name: '35f2a50b',
    flag: 'CHN',
  },
  {
    id: 'chn-3594924f',
    name: '3594924f',
    flag: 'CHN',
  },
  {
    id: 'chn-340308e7',
    name: '340308e7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2100',
    name: 'CHN-2100',
    flag: 'CHN',
  },
  {
    id: 'chn-jiashan',
    name: 'JIASHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-jinghai',
    name: 'JINGHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c9c5',
    name: '3403c9c5',
    flag: 'CHN',
  },
  {
    id: 'chn-3429353d',
    name: '3429353d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b686d9',
    name: '35b686d9',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a685',
    name: '3403a685',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1948',
    name: 'CHN-1948',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-753',
    name: 'CHN-753',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5fa75',
    name: '35b5fa75',
    flag: 'CHN',
  },
  {
    id: 'chn-35b167c3',
    name: '35b167c3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6890d',
    name: '35b6890d',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc6f',
    name: '35cacc6f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca922d',
    name: '35ca922d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1292',
    name: 'CHN-1292',
    flag: 'CHN',
  },
  {
    id: 'chn-35b26dbd',
    name: '35b26dbd',
    flag: 'CHN',
  },
  {
    id: 'chn-3428625f',
    name: '3428625f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-276',
    name: 'CHN-276',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-666',
    name: 'CHN-666',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1194',
    name: 'CHN-1194',
    flag: 'CHN',
  },
  {
    id: 'chn-340307d1',
    name: '340307d1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1110',
    name: 'CHN-1110',
    flag: 'CHN',
  },
  {
    id: 'chn-3431b657',
    name: '3431b657',
    flag: 'CHN',
  },
  {
    id: 'chn-haimen',
    name: 'HAIMEN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1983',
    name: 'CHN-1983',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1172',
    name: 'CHN-1172',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1330',
    name: 'CHN-1330',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2453',
    name: 'CHN-2453',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-819',
    name: 'CHN-819',
    flag: 'CHN',
  },
  {
    id: 'chn-rizhou',
    name: 'RIZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-256',
    name: 'CHN-256',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1168',
    name: 'CHN-1168',
    flag: 'CHN',
  },
  {
    id: 'chn-3433ed51',
    name: '3433ed51',
    flag: 'CHN',
  },
  {
    id: 'chn-34018fb9',
    name: '34018fb9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b67ffb',
    name: '35b67ffb',
    flag: 'CHN',
  },
  {
    id: 'chn-bz26-3field',
    name: 'BZ26-3 FIELD',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1679',
    name: 'CHN-1679',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd05',
    name: '3434dd05',
    flag: 'CHN',
  },
  {
    id: 'chn-qinzhouanchorage',
    name: 'QIN ZHOU ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2402',
    name: 'CHN-2402',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1670',
    name: 'CHN-1670',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2048',
    name: 'CHN-2048',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f195',
    name: '35b5f195',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-834',
    name: 'CHN-834',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-440',
    name: 'CHN-440',
    flag: 'CHN',
  },
  {
    id: 'chn-344d8913',
    name: '344d8913',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1523',
    name: 'CHN-1523',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2135',
    name: 'CHN-2135',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1518',
    name: 'CHN-1518',
    flag: 'CHN',
  },
  {
    id: 'chn-340180c3',
    name: '340180c3',
    flag: 'CHN',
  },
  {
    id: 'chn-342e6a83',
    name: '342e6a83',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2394',
    name: 'CHN-2394',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1596',
    name: 'CHN-1596',
    flag: 'CHN',
  },
  {
    id: 'chn-35b91257',
    name: '35b91257',
    flag: 'CHN',
  },
  {
    id: 'chn-340180dd',
    name: '340180dd',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cef5',
    name: '3403cef5',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea0a9',
    name: '342ea0a9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-761',
    name: 'CHN-761',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac795',
    name: '35cac795',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc41',
    name: '3403cc41',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbef',
    name: '35cacbef',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf9f',
    name: '3588bf9f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-578',
    name: 'CHN-578',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5efd5',
    name: '35b5efd5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-845',
    name: 'CHN-845',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27283',
    name: '35b27283',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5efd1',
    name: '35b5efd1',
    flag: 'CHN',
  },
  {
    id: 'chn-3434faab',
    name: '3434faab',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2433',
    name: 'CHN-2433',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b3f',
    name: '34024b3f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca96f3',
    name: '35ca96f3',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a569',
    name: '3403a569',
    flag: 'CHN',
  },
  {
    id: 'chn-rongcheng',
    name: 'RONGCHENG',
    flag: 'CHN',
  },
  {
    id: 'chn-3435295f',
    name: '3435295f',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f17',
    name: '342e3f17',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c57d',
    name: '3403c57d',
    flag: 'CHN',
  },
  {
    id: 'chn-34024909',
    name: '34024909',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b6d',
    name: '34024b6d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2390',
    name: 'CHN-2390',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2540',
    name: 'CHN-2540',
    flag: 'CHN',
  },
  {
    id: 'chn-342e400f',
    name: '342e400f',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c32f',
    name: '3427c32f',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e555',
    name: '3434e555',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae015f',
    name: '35ae015f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e7b',
    name: '35ac2e7b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-942',
    name: 'CHN-942',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1557',
    name: 'CHN-1557',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d56f',
    name: '35b5d56f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-856',
    name: 'CHN-856',
    flag: 'CHN',
  },
  {
    id: 'chn-35b287a3',
    name: '35b287a3',
    flag: 'CHN',
  },
  {
    id: 'chn-34286265',
    name: '34286265',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-738',
    name: 'CHN-738',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd13',
    name: '3434dd13',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d0f',
    name: '34352d0f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68911',
    name: '35b68911',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28ea5',
    name: '35b28ea5',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c6b',
    name: '34352c6b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-749',
    name: 'CHN-749',
    flag: 'CHN',
  },
  {
    id: 'chn-35edb93f',
    name: '35edb93f',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c301',
    name: '3427c301',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2050',
    name: 'CHN-2050',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca90cb',
    name: '35ca90cb',
    flag: 'CHN',
  },
  {
    id: 'chn-34018101',
    name: '34018101',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-335',
    name: 'CHN-335',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28ec9',
    name: '35b28ec9',
    flag: 'CHN',
  },
  {
    id: 'chn-343475b5',
    name: '343475b5',
    flag: 'CHN',
  },
  {
    id: 'chn-34348af5',
    name: '34348af5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1240',
    name: 'CHN-1240',
    flag: 'CHN',
  },
  {
    id: 'chn-35ec8bff',
    name: '35ec8bff',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68227',
    name: '35b68227',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2399',
    name: 'CHN-2399',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5dead',
    name: '35b5dead',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f01b',
    name: '35b5f01b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2381',
    name: 'CHN-2381',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-361',
    name: 'CHN-361',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-767',
    name: 'CHN-767',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f4b5',
    name: '3434f4b5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b226df',
    name: '35b226df',
    flag: 'CHN',
  },
  {
    id: 'chn-34018f53',
    name: '34018f53',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2d027',
    name: '35b2d027',
    flag: 'CHN',
  },
  {
    id: 'chn-sanya',
    name: 'SANYA',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b1d',
    name: '34348b1d',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac315b',
    name: '35ac315b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d55f',
    name: '35b5d55f',
    flag: 'CHN',
  },
  {
    id: 'chn-shuidong',
    name: 'SHUIDONG',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1149',
    name: 'CHN-1149',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c4f',
    name: '34018c4f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2459',
    name: 'CHN-2459',
    flag: 'CHN',
  },
  {
    id: 'chn-35caccf9',
    name: '35caccf9',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3b21',
    name: '35ac3b21',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-166',
    name: 'CHN-166',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1581',
    name: 'CHN-1581',
    flag: 'CHN',
  },
  {
    id: 'chn-34149bdb',
    name: '34149bdb',
    flag: 'CHN',
  },
  {
    id: 'chn-3403dabd',
    name: '3403dabd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1026',
    name: 'CHN-1026',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1751',
    name: 'CHN-1751',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d665',
    name: '35b5d665',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1099',
    name: 'CHN-1099',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca7d35',
    name: '35ca7d35',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-232',
    name: 'CHN-232',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-993',
    name: 'CHN-993',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1725',
    name: 'CHN-1725',
    flag: 'CHN',
  },
  {
    id: 'chn-3403088b',
    name: '3403088b',
    flag: 'CHN',
  },
  {
    id: 'chn-34018887',
    name: '34018887',
    flag: 'CHN',
  },
  {
    id: 'chn-3431b6e5',
    name: '3431b6e5',
    flag: 'CHN',
  },
  {
    id: 'chn-36ab1d2d',
    name: '36ab1d2d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68bdb',
    name: '35b68bdb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d75d',
    name: '35b3d75d',
    flag: 'CHN',
  },
  {
    id: 'chn-344d8ef5',
    name: '344d8ef5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b924e5',
    name: '35b924e5',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c0b',
    name: '34018c0b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1387',
    name: 'CHN-1387',
    flag: 'CHN',
  },
  {
    id: 'chn-35b17117',
    name: '35b17117',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-371',
    name: 'CHN-371',
    flag: 'CHN',
  },
  {
    id: 'chn-3427d9cd',
    name: '3427d9cd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-257',
    name: 'CHN-257',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-317',
    name: 'CHN-317',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f393',
    name: '3434f393',
    flag: 'CHN',
  },
  {
    id: 'chn-344d8917',
    name: '344d8917',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-445',
    name: 'CHN-445',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1748',
    name: 'CHN-1748',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2291',
    name: 'CHN-2291',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dc97',
    name: '3427dc97',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d25',
    name: '34352d25',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2500',
    name: 'CHN-2500',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1845',
    name: 'CHN-1845',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1320',
    name: 'CHN-1320',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-373',
    name: 'CHN-373',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fc9',
    name: '342c1fc9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1947',
    name: 'CHN-1947',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1411',
    name: 'CHN-1411',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca62d1',
    name: '35ca62d1',
    flag: 'CHN',
  },
  {
    id: 'chn-36837597',
    name: '36837597',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2197',
    name: 'CHN-2197',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-435',
    name: 'CHN-435',
    flag: 'CHN',
  },
  {
    id: 'chn-342862e5',
    name: '342862e5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1276',
    name: 'CHN-1276',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d443',
    name: '35b5d443',
    flag: 'CHN',
  },
  {
    id: 'chn-342e400d',
    name: '342e400d',
    flag: 'CHN',
  },
  {
    id: 'chn-danzhou',
    name: 'DANZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cdd3',
    name: '3403cdd3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27aeb',
    name: '35b27aeb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-529',
    name: 'CHN-529',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab9b3',
    name: '35cab9b3',
    flag: 'CHN',
  },
  {
    id: 'chn-340188a3',
    name: '340188a3',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ec9',
    name: '342e9ec9',
    flag: 'CHN',
  },
  {
    id: 'chn-suqian',
    name: 'SUQIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69ec5',
    name: '35b69ec5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1510',
    name: 'CHN-1510',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae06a5',
    name: '35ae06a5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-807',
    name: 'CHN-807',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2091',
    name: 'CHN-2091',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c239',
    name: '3427c239',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1508',
    name: 'CHN-1508',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69eaf',
    name: '35b69eaf',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e25',
    name: '342c1e25',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-64',
    name: 'CHN-64',
    flag: 'CHN',
  },
  {
    id: 'chn-jiaxing',
    name: 'JIAXING',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2530',
    name: 'CHN-2530',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1048',
    name: 'CHN-1048',
    flag: 'CHN',
  },
  {
    id: 'chn-35b204d1',
    name: '35b204d1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1707',
    name: 'CHN-1707',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2069',
    name: 'CHN-2069',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1902',
    name: 'CHN-1902',
    flag: 'CHN',
  },
  {
    id: 'chn-34024bd3',
    name: '34024bd3',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e8b',
    name: '35ac2e8b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d46b',
    name: '35b5d46b',
    flag: 'CHN',
  },
  {
    id: 'chn-34287bf5',
    name: '34287bf5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1444',
    name: 'CHN-1444',
    flag: 'CHN',
  },
  {
    id: 'chn-34030999',
    name: '34030999',
    flag: 'CHN',
  },
  {
    id: 'chn-3428795d',
    name: '3428795d',
    flag: 'CHN',
  },
  {
    id: 'chn-3402490f',
    name: '3402490f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca7991',
    name: '35ca7991',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-177',
    name: 'CHN-177',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-169',
    name: 'CHN-169',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1493',
    name: 'CHN-1493',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9735',
    name: '35ca9735',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f729',
    name: '35b5f729',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b49',
    name: '35b27b49',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc0d',
    name: '35cacc0d',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f13',
    name: '342e3f13',
    flag: 'CHN',
  },
  {
    id: 'chn-35b051c1',
    name: '35b051c1',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ce87',
    name: '3403ce87',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-655',
    name: 'CHN-655',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1908',
    name: 'CHN-1908',
    flag: 'CHN',
  },
  {
    id: 'chn-36b32fcb',
    name: '36b32fcb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b680d5',
    name: '35b680d5',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1ff3',
    name: '342c1ff3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b288c3',
    name: '35b288c3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-250',
    name: 'CHN-250',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69edd',
    name: '35b69edd',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68637',
    name: '35b68637',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a563',
    name: '3403a563',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d947',
    name: '35b5d947',
    flag: 'CHN',
  },
  {
    id: 'chn-340187c1',
    name: '340187c1',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6864f',
    name: '35b6864f',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f1f',
    name: '342e3f1f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58a95',
    name: '35b58a95',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-628',
    name: 'CHN-628',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d0d5',
    name: '35b5d0d5',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea751',
    name: '342ea751',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9eed',
    name: '342e9eed',
    flag: 'CHN',
  },
  {
    id: 'chn-foshan',
    name: 'FOSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2486',
    name: 'CHN-2486',
    flag: 'CHN',
  },
  {
    id: 'chn-3428626f',
    name: '3428626f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27083',
    name: '35b27083',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-345',
    name: 'CHN-345',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1837',
    name: 'CHN-1837',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fa3',
    name: '342c1fa3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d3db',
    name: '35b3d3db',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca972d',
    name: '35ca972d',
    flag: 'CHN',
  },
  {
    id: 'chn-3403be7d',
    name: '3403be7d',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f4b1',
    name: '3434f4b1',
    flag: 'CHN',
  },
  {
    id: 'chn-3427d849',
    name: '3427d849',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c45',
    name: '34352c45',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1990',
    name: 'CHN-1990',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b19',
    name: '35b27b19',
    flag: 'CHN',
  },
  {
    id: 'chn-35b15cd5',
    name: '35b15cd5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d0d9',
    name: '35b5d0d9',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca91fd',
    name: '35ca91fd',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad98ed',
    name: '35ad98ed',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2bd7',
    name: '35ac2bd7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2093',
    name: 'CHN-2093',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c303',
    name: '3427c303',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b531',
    name: '3403b531',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1220',
    name: 'CHN-1220',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d503',
    name: '35b5d503',
    flag: 'CHN',
  },
  {
    id: 'chn-35949259',
    name: '35949259',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b515',
    name: '3403b515',
    flag: 'CHN',
  },
  {
    id: 'chn-34352b91',
    name: '34352b91',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3b27',
    name: '35ac3b27',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1752',
    name: 'CHN-1752',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1709',
    name: 'CHN-1709',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2896b',
    name: '35b2896b',
    flag: 'CHN',
  },
  {
    id: 'chn-34018763',
    name: '34018763',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2222',
    name: 'CHN-2222',
    flag: 'CHN',
  },
  {
    id: 'chn-35b21b33',
    name: '35b21b33',
    flag: 'CHN',
  },
  {
    id: 'chn-342e400b',
    name: '342e400b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d441',
    name: '35b5d441',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6818f',
    name: '35b6818f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1812',
    name: 'CHN-1812',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd19',
    name: '3434dd19',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ec1',
    name: '342e9ec1',
    flag: 'CHN',
  },
  {
    id: 'chn-34018e27',
    name: '34018e27',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b6ad',
    name: '3403b6ad',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9c15',
    name: '342e9c15',
    flag: 'CHN',
  },
  {
    id: 'chn-342862e7',
    name: '342862e7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d94f',
    name: '35b5d94f',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c565',
    name: '3403c565',
    flag: 'CHN',
  },
  {
    id: 'chn-3403be87',
    name: '3403be87',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-254',
    name: 'CHN-254',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1238',
    name: 'CHN-1238',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6f4c3',
    name: '35b6f4c3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d659',
    name: '35b5d659',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1244',
    name: 'CHN-1244',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1700',
    name: 'CHN-1700',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac7cd',
    name: '35cac7cd',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f1db',
    name: '35b5f1db',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1081',
    name: 'CHN-1081',
    flag: 'CHN',
  },
  {
    id: 'chn-34287c63',
    name: '34287c63',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2428',
    name: 'CHN-2428',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1695',
    name: 'CHN-1695',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1f91',
    name: '342c1f91',
    flag: 'CHN',
  },
  {
    id: 'chn-342e4007',
    name: '342e4007',
    flag: 'CHN',
  },
  {
    id: 'chn-nanpenglieisland',
    name: 'NANPENGLIE ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1553',
    name: 'CHN-1553',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-718',
    name: 'CHN-718',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1086',
    name: 'CHN-1086',
    flag: 'CHN',
  },
  {
    id: 'chn-3401876b',
    name: '3401876b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2183',
    name: 'CHN-2183',
    flag: 'CHN',
  },
  {
    id: 'chn-34347435',
    name: '34347435',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b53d',
    name: '3403b53d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-847',
    name: 'CHN-847',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2979',
    name: '35ac2979',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c2fd',
    name: '3427c2fd',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e8f',
    name: '35ac2e8f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28897',
    name: '35b28897',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b3ff',
    name: '3403b3ff',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-164',
    name: 'CHN-164',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b81',
    name: '34024b81',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1689',
    name: 'CHN-1689',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2270',
    name: 'CHN-2270',
    flag: 'CHN',
  },
  {
    id: 'chn-34338a2f',
    name: '34338a2f',
    flag: 'CHN',
  },
  {
    id: 'chn-36b32fcf',
    name: '36b32fcf',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca8e07',
    name: '35ca8e07',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f3ef',
    name: '3434f3ef',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca908d',
    name: '35ca908d',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca7d29',
    name: '35ca7d29',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d12b',
    name: '35b5d12b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f6d7',
    name: '35b5f6d7',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac985',
    name: '35cac985',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1196',
    name: 'CHN-1196',
    flag: 'CHN',
  },
  {
    id: 'chn-340173f7',
    name: '340173f7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b204d5',
    name: '35b204d5',
    flag: 'CHN',
  },
  {
    id: 'chn-3446cf63',
    name: '3446cf63',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae069d',
    name: '35ae069d',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd6b',
    name: '3434dd6b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1212',
    name: 'CHN-1212',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1552',
    name: 'CHN-1552',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-733',
    name: 'CHN-733',
    flag: 'CHN',
  },
  {
    id: 'chn-34018b89',
    name: '34018b89',
    flag: 'CHN',
  },
  {
    id: 'chn-34024bd7',
    name: '34024bd7',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3ae5',
    name: '35ac3ae5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1042',
    name: 'CHN-1042',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1906',
    name: 'CHN-1906',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-247',
    name: 'CHN-247',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d153',
    name: '35b5d153',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f09b',
    name: '35b5f09b',
    flag: 'CHN',
  },
  {
    id: 'chn-342e6aa1',
    name: '342e6aa1',
    flag: 'CHN',
  },
  {
    id: 'chn-340180e3',
    name: '340180e3',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9203',
    name: '35ca9203',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68649',
    name: '35b68649',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-472',
    name: 'CHN-472',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae015b',
    name: '35ae015b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1688',
    name: 'CHN-1688',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e99',
    name: '35ac2e99',
    flag: 'CHN',
  },
  {
    id: 'chn-34352b93',
    name: '34352b93',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1526',
    name: 'CHN-1526',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-284',
    name: 'CHN-284',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac785',
    name: '35cac785',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f1d3',
    name: '35b5f1d3',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e35',
    name: '342c1e35',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-689',
    name: 'CHN-689',
    flag: 'CHN',
  },
  {
    id: 'chn-358b867d',
    name: '358b867d',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad987d',
    name: '35ad987d',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac9c3',
    name: '35cac9c3',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3fa1',
    name: '342e3fa1',
    flag: 'CHN',
  },
  {
    id: 'chn-3411d1a9',
    name: '3411d1a9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-405',
    name: 'CHN-405',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79db',
    name: '35ca79db',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-210',
    name: 'CHN-210',
    flag: 'CHN',
  },
  {
    id: 'chn-3403adeb',
    name: '3403adeb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b287b7',
    name: '35b287b7',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ef9',
    name: '342e9ef9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-677',
    name: 'CHN-677',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1561',
    name: 'CHN-1561',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58a5f',
    name: '35b58a5f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1201',
    name: 'CHN-1201',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-921',
    name: 'CHN-921',
    flag: 'CHN',
  },
  {
    id: 'chn-34287c97',
    name: '34287c97',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2876d',
    name: '35b2876d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2045',
    name: 'CHN-2045',
    flag: 'CHN',
  },
  {
    id: 'chn-34018095',
    name: '34018095',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1399',
    name: 'CHN-1399',
    flag: 'CHN',
  },
  {
    id: 'chn-34018f0b',
    name: '34018f0b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2170',
    name: 'CHN-2170',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-999',
    name: 'CHN-999',
    flag: 'CHN',
  },
  {
    id: 'chn-3403dad5',
    name: '3403dad5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5efc9',
    name: '35b5efc9',
    flag: 'CHN',
  },
  {
    id: 'chn-34018db5',
    name: '34018db5',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c531',
    name: '3403c531',
    flag: 'CHN',
  },
  {
    id: 'chn-35b220b5',
    name: '35b220b5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-468',
    name: 'CHN-468',
    flag: 'CHN',
  },
  {
    id: 'chn-35b15cdf',
    name: '35b15cdf',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf67',
    name: '3588bf67',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ebf',
    name: '342e9ebf',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58af7',
    name: '35b58af7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1043',
    name: 'CHN-1043',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-505',
    name: 'CHN-505',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-576',
    name: 'CHN-576',
    flag: 'CHN',
  },
  {
    id: 'chn-34024c79',
    name: '34024c79',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6994d',
    name: '35b6994d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2039',
    name: 'CHN-2039',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca91ff',
    name: '35ca91ff',
    flag: 'CHN',
  },
  {
    id: 'chn-34017403',
    name: '34017403',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-420',
    name: 'CHN-420',
    flag: 'CHN',
  },
  {
    id: 'chn-35b20509',
    name: '35b20509',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad9887',
    name: '35ad9887',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca96dd',
    name: '35ca96dd',
    flag: 'CHN',
  },
  {
    id: 'chn-quanzhou',
    name: 'QUANZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-35bee49f',
    name: '35bee49f',
    flag: 'CHN',
  },
  {
    id: 'chn-yueyang',
    name: 'YUEYANG',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79d9',
    name: '35ca79d9',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e49',
    name: '342c1e49',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f081',
    name: '35b5f081',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d457',
    name: '35b5d457',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d777',
    name: '35b3d777',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1660',
    name: 'CHN-1660',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fb1',
    name: '342c1fb1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-307',
    name: 'CHN-307',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2166',
    name: 'CHN-2166',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2534',
    name: 'CHN-2534',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e63',
    name: '35ac2e63',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-670',
    name: 'CHN-670',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-367',
    name: 'CHN-367',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2261',
    name: 'CHN-2261',
    flag: 'CHN',
  },
  {
    id: 'chn-35b9125b',
    name: '35b9125b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b924f1',
    name: '35b924f1',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68001',
    name: '35b68001',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a663',
    name: '3403a663',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b3f',
    name: '35b27b3f',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e33',
    name: '342c1e33',
    flag: 'CHN',
  },
  {
    id: 'chn-haikou',
    name: 'HAIKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1571',
    name: 'CHN-1571',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f077',
    name: '35b5f077',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6b5',
    name: '35b5d6b5',
    flag: 'CHN',
  },
  {
    id: 'chn-3428795b',
    name: '3428795b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1506',
    name: 'CHN-1506',
    flag: 'CHN',
  },
  {
    id: 'chn-35cabf67',
    name: '35cabf67',
    flag: 'CHN',
  },
  {
    id: 'chn-34338d7f',
    name: '34338d7f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2546',
    name: 'CHN-2546',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-972',
    name: 'CHN-972',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28775',
    name: '35b28775',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2888f',
    name: '35b2888f',
    flag: 'CHN',
  },
  {
    id: 'chn-dafeng',
    name: 'DAFENG',
    flag: 'CHN',
  },
  {
    id: 'chn-34122651',
    name: '34122651',
    flag: 'CHN',
  },
  {
    id: 'chn-34287959',
    name: '34287959',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca975b',
    name: '35ca975b',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2a2b',
    name: '35ac2a2b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28773',
    name: '35b28773',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-501',
    name: 'CHN-501',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e7b3',
    name: '3434e7b3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1453',
    name: 'CHN-1453',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2149',
    name: 'CHN-2149',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef63',
    name: '3434ef63',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79d5',
    name: '35ca79d5',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c321',
    name: '3427c321',
    flag: 'CHN',
  },
  {
    id: 'chn-huizhou',
    name: 'HUIZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1052',
    name: 'CHN-1052',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-734',
    name: 'CHN-734',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1917',
    name: 'CHN-1917',
    flag: 'CHN',
  },
  {
    id: 'chn-34352bfb',
    name: '34352bfb',
    flag: 'CHN',
  },
  {
    id: 'chn-35edbc33',
    name: '35edbc33',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1694',
    name: 'CHN-1694',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca96eb',
    name: '35ca96eb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1283',
    name: 'CHN-1283',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f75',
    name: '342e3f75',
    flag: 'CHN',
  },
  {
    id: 'chn-35b9127b',
    name: '35b9127b',
    flag: 'CHN',
  },
  {
    id: 'chn-yangjiang',
    name: 'YANGJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2892d',
    name: '35b2892d',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dc9b',
    name: '3427dc9b',
    flag: 'CHN',
  },
  {
    id: 'chn-changxingdao',
    name: 'CHANGXINGDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-pingtan',
    name: 'PINGTAN',
    flag: 'CHN',
  },
  {
    id: 'chn-34118d31',
    name: '34118d31',
    flag: 'CHN',
  },
  {
    id: 'chn-35b22751',
    name: '35b22751',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2403',
    name: 'CHN-2403',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-862',
    name: 'CHN-862',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2272b',
    name: '35b2272b',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a56f',
    name: '3403a56f',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fb3',
    name: '342c1fb3',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb547',
    name: '342eb547',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1851',
    name: 'CHN-1851',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca96df',
    name: '35ca96df',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f4cd',
    name: '3434f4cd',
    flag: 'CHN',
  },
  {
    id: 'chn-3153cd9d',
    name: '3153cd9d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1173',
    name: 'CHN-1173',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-509',
    name: 'CHN-509',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fb7',
    name: '342c1fb7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b51',
    name: '35b27b51',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2943',
    name: '35ac2943',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-187',
    name: 'CHN-187',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc2b',
    name: '3403cc2b',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9201',
    name: '35ca9201',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2092',
    name: 'CHN-2092',
    flag: 'CHN',
  },
  {
    id: 'chn-35b288d7',
    name: '35b288d7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1208',
    name: 'CHN-1208',
    flag: 'CHN',
  },
  {
    id: 'chn-chongming',
    name: 'CHONGMING',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-574',
    name: 'CHN-574',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1036',
    name: 'CHN-1036',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1637',
    name: 'CHN-1637',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1063',
    name: 'CHN-1063',
    flag: 'CHN',
  },
  {
    id: 'chn-3683758f',
    name: '3683758f',
    flag: 'CHN',
  },
  {
    id: 'chn-340307c5',
    name: '340307c5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69eb3',
    name: '35b69eb3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d5d7',
    name: '35b5d5d7',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb523',
    name: '342eb523',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28633',
    name: '35b28633',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9fab',
    name: '342e9fab',
    flag: 'CHN',
  },
  {
    id: 'chn-34024bd5',
    name: '34024bd5',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e3b',
    name: '342c1e3b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d745',
    name: '35b3d745',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1405',
    name: 'CHN-1405',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a09b',
    name: '3403a09b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b4d',
    name: '35b27b4d',
    flag: 'CHN',
  },
  {
    id: 'chn-wuhu',
    name: 'WUHU',
    flag: 'CHN',
  },
  {
    id: 'chn-340176d1',
    name: '340176d1',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbe3',
    name: '35cacbe3',
    flag: 'CHN',
  },
  {
    id: 'chn-342862d7',
    name: '342862d7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2527',
    name: 'CHN-2527',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1530',
    name: 'CHN-1530',
    flag: 'CHN',
  },
  {
    id: 'chn-35b686e5',
    name: '35b686e5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1104',
    name: 'CHN-1104',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-912',
    name: 'CHN-912',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2244',
    name: 'CHN-2244',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1415',
    name: 'CHN-1415',
    flag: 'CHN',
  },
  {
    id: 'chn-35b92459',
    name: '35b92459',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-295',
    name: 'CHN-295',
    flag: 'CHN',
  },
  {
    id: 'chn-34286273',
    name: '34286273',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2961',
    name: '35ac2961',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac316b',
    name: '35ac316b',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dc95',
    name: '3427dc95',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1191',
    name: 'CHN-1191',
    flag: 'CHN',
  },
  {
    id: 'chn-34018fd3',
    name: '34018fd3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1717',
    name: 'CHN-1717',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b25',
    name: '35b27b25',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c53b',
    name: '3403c53b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-502',
    name: 'CHN-502',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b3b',
    name: '35b27b3b',
    flag: 'CHN',
  },
  {
    id: 'chn-344d7cb3',
    name: '344d7cb3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-173',
    name: 'CHN-173',
    flag: 'CHN',
  },
  {
    id: 'chn-35b912fb',
    name: '35b912fb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d125',
    name: '35b5d125',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-952',
    name: 'CHN-952',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28791',
    name: '35b28791',
    flag: 'CHN',
  },
  {
    id: 'chn-3588c0a1',
    name: '3588c0a1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2524',
    name: 'CHN-2524',
    flag: 'CHN',
  },
  {
    id: 'chn-34024bc9',
    name: '34024bc9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-442',
    name: 'CHN-442',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28ecb',
    name: '35b28ecb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d5cd',
    name: '35b5d5cd',
    flag: 'CHN',
  },
  {
    id: 'chn-340229c7',
    name: '340229c7',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca972b',
    name: '35ca972b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b21',
    name: '35b27b21',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2272d',
    name: '35b2272d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1610',
    name: 'CHN-1610',
    flag: 'CHN',
  },
  {
    id: 'chn-35b17409',
    name: '35b17409',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1138',
    name: 'CHN-1138',
    flag: 'CHN',
  },
  {
    id: 'chn-shanwei',
    name: 'SHANWEI',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1608',
    name: 'CHN-1608',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-925',
    name: 'CHN-925',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1954',
    name: 'CHN-1954',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d509',
    name: '35b5d509',
    flag: 'CHN',
  },
  {
    id: 'chn-340235af',
    name: '340235af',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2050f',
    name: '35b2050f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-433',
    name: 'CHN-433',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-988',
    name: 'CHN-988',
    flag: 'CHN',
  },
  {
    id: 'chn-34527d7d',
    name: '34527d7d',
    flag: 'CHN',
  },
  {
    id: 'chn-35edb915',
    name: '35edb915',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2153',
    name: 'CHN-2153',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2581',
    name: 'CHN-2581',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac7c5',
    name: '35cac7c5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d735',
    name: '35b5d735',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2870b',
    name: '35b2870b',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d17',
    name: '34352d17',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-996',
    name: 'CHN-996',
    flag: 'CHN',
  },
  {
    id: 'chn-36839e19',
    name: '36839e19',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3b1f',
    name: '35ac3b1f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1738',
    name: 'CHN-1738',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c4d',
    name: '34352c4d',
    flag: 'CHN',
  },
  {
    id: 'chn-chizhou',
    name: 'CHIZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-35b924f5',
    name: '35b924f5',
    flag: 'CHN',
  },
  {
    id: 'chn-344d8e5f',
    name: '344d8e5f',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b09',
    name: '34348b09',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2586',
    name: 'CHN-2586',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae06af',
    name: '35ae06af',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a55d',
    name: '3403a55d',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d01',
    name: '34352d01',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1404',
    name: 'CHN-1404',
    flag: 'CHN',
  },
  {
    id: 'chn-huludao',
    name: 'HULUDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-3401a3e1',
    name: '3401a3e1',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2ebd',
    name: '35ac2ebd',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fed',
    name: '342c1fed',
    flag: 'CHN',
  },
  {
    id: 'chn-xiuyu',
    name: 'XIUYU',
    flag: 'CHN',
  },
  {
    id: 'chn-36b32e33',
    name: '36b32e33',
    flag: 'CHN',
  },
  {
    id: 'chn-368375f3',
    name: '368375f3',
    flag: 'CHN',
  },
  {
    id: 'chn-340187d5',
    name: '340187d5',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac959',
    name: '35cac959',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1501',
    name: 'CHN-1501',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca7cd9',
    name: '35ca7cd9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2272',
    name: 'CHN-2272',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1088',
    name: 'CHN-1088',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1069',
    name: 'CHN-1069',
    flag: 'CHN',
  },
  {
    id: 'chn-340180e7',
    name: '340180e7',
    flag: 'CHN',
  },
  {
    id: 'chn-3587f2af',
    name: '3587f2af',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1816',
    name: 'CHN-1816',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef8f',
    name: '3434ef8f',
    flag: 'CHN',
  },
  {
    id: 'chn-dayushanisland',
    name: 'DAYUSHAN ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-344d8eb3',
    name: '344d8eb3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5efe1',
    name: '35b5efe1',
    flag: 'CHN',
  },
  {
    id: 'chn-3403bdd7',
    name: '3403bdd7',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c17',
    name: '34352c17',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-727',
    name: 'CHN-727',
    flag: 'CHN',
  },
  {
    id: 'chn-344d894b',
    name: '344d894b',
    flag: 'CHN',
  },
  {
    id: 'chn-34018e2b',
    name: '34018e2b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69eb5',
    name: '35b69eb5',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c9e3',
    name: '3403c9e3',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b25',
    name: '34348b25',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af79',
    name: '3403af79',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca902f',
    name: '35ca902f',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d6b',
    name: '34352d6b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-427',
    name: 'CHN-427',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-686',
    name: 'CHN-686',
    flag: 'CHN',
  },
  {
    id: 'chn-340180f3',
    name: '340180f3',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca917b',
    name: '35ca917b',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb545',
    name: '342eb545',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b2f',
    name: '34348b2f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-772',
    name: 'CHN-772',
    flag: 'CHN',
  },
  {
    id: 'chn-ruian',
    name: 'RUIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1295',
    name: 'CHN-1295',
    flag: 'CHN',
  },
  {
    id: 'chn-342e4005',
    name: '342e4005',
    flag: 'CHN',
  },
  {
    id: 'chn-kinmen',
    name: 'KINMEN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-9',
    name: 'CHN-9',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2bdf',
    name: '35ac2bdf',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c323',
    name: '3427c323',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f6d',
    name: '342e3f6d',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf77',
    name: '3588bf77',
    flag: 'CHN',
  },
  {
    id: 'chn-shenzhen',
    name: 'SHENZHEN',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2dd5',
    name: '35ac2dd5',
    flag: 'CHN',
  },
  {
    id: 'chn-34338bc9',
    name: '34338bc9',
    flag: 'CHN',
  },
  {
    id: 'chn-3411da23',
    name: '3411da23',
    flag: 'CHN',
  },
  {
    id: 'chn-35b170ff',
    name: '35b170ff',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-105',
    name: 'CHN-105',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d05',
    name: '34352d05',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e797',
    name: '3434e797',
    flag: 'CHN',
  },
  {
    id: 'chn-34286329',
    name: '34286329',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbf7',
    name: '35cacbf7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1186',
    name: 'CHN-1186',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bfa1',
    name: '3588bfa1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1373',
    name: 'CHN-1373',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d569',
    name: '35b5d569',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea709',
    name: '342ea709',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5deb5',
    name: '35b5deb5',
    flag: 'CHN',
  },
  {
    id: 'chn-34122657',
    name: '34122657',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27a51',
    name: '35b27a51',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f8f',
    name: '342e3f8f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68239',
    name: '35b68239',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1309',
    name: 'CHN-1309',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d7a3',
    name: '35b3d7a3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-871',
    name: 'CHN-871',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-402',
    name: 'CHN-402',
    flag: 'CHN',
  },
  {
    id: 'chn-35b20519',
    name: '35b20519',
    flag: 'CHN',
  },
  {
    id: 'chn-3427d835',
    name: '3427d835',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c523',
    name: '3403c523',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-286',
    name: 'CHN-286',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca96d7',
    name: '35ca96d7',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fbb',
    name: '342c1fbb',
    flag: 'CHN',
  },
  {
    id: 'chn-340193e1',
    name: '340193e1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-829',
    name: 'CHN-829',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbf5',
    name: '35cacbf5',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae0683',
    name: '35ae0683',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-591',
    name: 'CHN-591',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad89ab',
    name: '35ad89ab',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca7d27',
    name: '35ca7d27',
    flag: 'CHN',
  },
  {
    id: 'chn-34527d9d',
    name: '34527d9d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-600',
    name: 'CHN-600',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1109',
    name: 'CHN-1109',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69f21',
    name: '35b69f21',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f9b',
    name: '342e3f9b',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79c1',
    name: '35ca79c1',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae015d',
    name: '35ae015d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69ec9',
    name: '35b69ec9',
    flag: 'CHN',
  },
  {
    id: 'chn-36ab1d2f',
    name: '36ab1d2f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-486',
    name: 'CHN-486',
    flag: 'CHN',
  },
  {
    id: 'chn-340307b9',
    name: '340307b9',
    flag: 'CHN',
  },
  {
    id: 'chn-34017049',
    name: '34017049',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-989',
    name: 'CHN-989',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1651',
    name: 'CHN-1651',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1650',
    name: 'CHN-1650',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d6c3',
    name: '35b3d6c3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d5c9',
    name: '35b5d5c9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-113',
    name: 'CHN-113',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af9b',
    name: '3403af9b',
    flag: 'CHN',
  },
  {
    id: 'chn-3431b6e3',
    name: '3431b6e3',
    flag: 'CHN',
  },
  {
    id: 'chn-34018fc5',
    name: '34018fc5',
    flag: 'CHN',
  },
  {
    id: 'chn-34339281',
    name: '34339281',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-868',
    name: 'CHN-868',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-818',
    name: 'CHN-818',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef95',
    name: '3434ef95',
    flag: 'CHN',
  },
  {
    id: 'chn-xiangshui',
    name: 'XIANGSHUI',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-859',
    name: 'CHN-859',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2348',
    name: 'CHN-2348',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2532',
    name: 'CHN-2532',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea7a9',
    name: '342ea7a9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1490',
    name: 'CHN-1490',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fbd',
    name: '342c1fbd',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d155',
    name: '35b5d155',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5faa1',
    name: '35b5faa1',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca62df',
    name: '35ca62df',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2077',
    name: 'CHN-2077',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1344',
    name: 'CHN-1344',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c0d',
    name: '34018c0d',
    flag: 'CHN',
  },
  {
    id: 'chn-340229c9',
    name: '340229c9',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f0d',
    name: '342e3f0d',
    flag: 'CHN',
  },
  {
    id: 'chn-yachengzhen',
    name: 'YACHENGZHEN',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb551',
    name: '342eb551',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e559',
    name: '3434e559',
    flag: 'CHN',
  },
  {
    id: 'chn-342e401b',
    name: '342e401b',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef61',
    name: '3434ef61',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2538',
    name: 'CHN-2538',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28eb7',
    name: '35b28eb7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5fa79',
    name: '35b5fa79',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2489',
    name: 'CHN-2489',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-665',
    name: 'CHN-665',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1313',
    name: 'CHN-1313',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb559',
    name: '342eb559',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1487',
    name: 'CHN-1487',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2493',
    name: 'CHN-2493',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1222',
    name: 'CHN-1222',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2441',
    name: 'CHN-2441',
    flag: 'CHN',
  },
  {
    id: 'chn-34018881',
    name: '34018881',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69eb7',
    name: '35b69eb7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2458',
    name: 'CHN-2458',
    flag: 'CHN',
  },
  {
    id: 'chn-qingdao',
    name: 'QINGDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-314e41e1',
    name: '314e41e1',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e5d',
    name: '35ac2e5d',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f4a3',
    name: '3434f4a3',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b511',
    name: '3403b511',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b39',
    name: '35b27b39',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1feb',
    name: '342c1feb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58af1',
    name: '35b58af1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2005',
    name: 'CHN-2005',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5efdb',
    name: '35b5efdb',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c73',
    name: '34352c73',
    flag: 'CHN',
  },
  {
    id: 'chn-35b680d7',
    name: '35b680d7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b170c9',
    name: '35b170c9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27a63',
    name: '35b27a63',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f483',
    name: '3434f483',
    flag: 'CHN',
  },
  {
    id: 'chn-dongshan',
    name: 'DONGSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac97f',
    name: '35cac97f',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c539',
    name: '3403c539',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-109',
    name: 'CHN-109',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-587',
    name: 'CHN-587',
    flag: 'CHN',
  },
  {
    id: 'chn-35b226dd',
    name: '35b226dd',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c39',
    name: '34018c39',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac295d',
    name: '35ac295d',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac79b',
    name: '35cac79b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f0c9',
    name: '35b5f0c9',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9c57',
    name: '342e9c57',
    flag: 'CHN',
  },
  {
    id: 'chn-3428795f',
    name: '3428795f',
    flag: 'CHN',
  },
  {
    id: 'chn-36b34ae1',
    name: '36b34ae1',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a543',
    name: '3403a543',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1299',
    name: 'CHN-1299',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1776',
    name: 'CHN-1776',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea0ad',
    name: '342ea0ad',
    flag: 'CHN',
  },
  {
    id: 'chn-dalian',
    name: 'DALIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27a93',
    name: '35b27a93',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79ed',
    name: '35ca79ed',
    flag: 'CHN',
  },
  {
    id: 'chn-341226fb',
    name: '341226fb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-421',
    name: 'CHN-421',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd07',
    name: '3434dd07',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1832',
    name: 'CHN-1832',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1638',
    name: 'CHN-1638',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c55b',
    name: '3403c55b',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac33fb',
    name: '35ac33fb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d949',
    name: '35b5d949',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d415',
    name: '35b5d415',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2379',
    name: 'CHN-2379',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1223',
    name: 'CHN-1223',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27d6f',
    name: '35b27d6f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2dd9',
    name: '35ac2dd9',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b13',
    name: '34348b13',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1369',
    name: 'CHN-1369',
    flag: 'CHN',
  },
  {
    id: 'chn-344d8e59',
    name: '344d8e59',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-401',
    name: 'CHN-401',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e8d',
    name: '35ac2e8d',
    flag: 'CHN',
  },
  {
    id: 'chn-36b3255d',
    name: '36b3255d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d679',
    name: '35b5d679',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9061',
    name: '35ca9061',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2052b',
    name: '35b2052b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6f4e7',
    name: '35b6f4e7',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9faf',
    name: '342e9faf',
    flag: 'CHN',
  },
  {
    id: 'chn-xuwen',
    name: 'XUWEN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1130',
    name: 'CHN-1130',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-963',
    name: 'CHN-963',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e7bb',
    name: '3434e7bb',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c2f9',
    name: '3427c2f9',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd65',
    name: '3434dd65',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e79b',
    name: '3434e79b',
    flag: 'CHN',
  },
  {
    id: 'chn-3403bb79',
    name: '3403bb79',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68883',
    name: '35b68883',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-530',
    name: 'CHN-530',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6a9',
    name: '35b5d6a9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b220d5',
    name: '35b220d5',
    flag: 'CHN',
  },
  {
    id: 'chn-34527d75',
    name: '34527d75',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d75f',
    name: '35b3d75f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1084',
    name: 'CHN-1084',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2bd9',
    name: '35ac2bd9',
    flag: 'CHN',
  },
  {
    id: 'chn-34046c57',
    name: '34046c57',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad88d3',
    name: '35ad88d3',
    flag: 'CHN',
  },
  {
    id: 'chn-34017a7d',
    name: '34017a7d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1153',
    name: 'CHN-1153',
    flag: 'CHN',
  },
  {
    id: 'chn-34018e29',
    name: '34018e29',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1303',
    name: 'CHN-1303',
    flag: 'CHN',
  },
  {
    id: 'chn-340176db',
    name: '340176db',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5ee33',
    name: '35b5ee33',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2889b',
    name: '35b2889b',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1f8f',
    name: '342c1f8f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1706',
    name: 'CHN-1706',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-758',
    name: 'CHN-758',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3ad3',
    name: '35ac3ad3',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f89',
    name: '342e3f89',
    flag: 'CHN',
  },
  {
    id: 'chn-3433ed4f',
    name: '3433ed4f',
    flag: 'CHN',
  },
  {
    id: 'chn-34018093',
    name: '34018093',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca7d2f',
    name: '35ca7d2f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1297',
    name: 'CHN-1297',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1731',
    name: 'CHN-1731',
    flag: 'CHN',
  },
  {
    id: 'chn-35cabf01',
    name: '35cabf01',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2193',
    name: 'CHN-2193',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3ad9',
    name: '35ac3ad9',
    flag: 'CHN',
  },
  {
    id: 'chn-36ab1b87',
    name: '36ab1b87',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1856',
    name: 'CHN-1856',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f1eb',
    name: '35b5f1eb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-537',
    name: 'CHN-537',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a669',
    name: '3403a669',
    flag: 'CHN',
  },
  {
    id: 'chn-yantai',
    name: 'YANTAI',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68189',
    name: '35b68189',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef83',
    name: '3434ef83',
    flag: 'CHN',
  },
  {
    id: 'chn-35b9159d',
    name: '35b9159d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2051b',
    name: '35b2051b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b17103',
    name: '35b17103',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1507',
    name: 'CHN-1507',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1854',
    name: 'CHN-1854',
    flag: 'CHN',
  },
  {
    id: 'chn-34352be7',
    name: '34352be7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1371',
    name: 'CHN-1371',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-196',
    name: 'CHN-196',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1999',
    name: 'CHN-1999',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-550',
    name: 'CHN-550',
    flag: 'CHN',
  },
  {
    id: 'chn-3402499f',
    name: '3402499f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5efd7',
    name: '35b5efd7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27a8f',
    name: '35b27a8f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d555',
    name: '35b5d555',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-884',
    name: 'CHN-884',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79bf',
    name: '35ca79bf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-239',
    name: 'CHN-239',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f1d9',
    name: '35b5f1d9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28c19',
    name: '35b28c19',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1362',
    name: 'CHN-1362',
    flag: 'CHN',
  },
  {
    id: 'chn-34018f41',
    name: '34018f41',
    flag: 'CHN',
  },
  {
    id: 'chn-yangkou',
    name: 'YANGKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-36b32e35',
    name: '36b32e35',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1164',
    name: 'CHN-1164',
    flag: 'CHN',
  },
  {
    id: 'chn-35b287a7',
    name: '35b287a7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d56b',
    name: '35b5d56b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-512',
    name: 'CHN-512',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1392',
    name: 'CHN-1392',
    flag: 'CHN',
  },
  {
    id: 'chn-35b924f7',
    name: '35b924f7',
    flag: 'CHN',
  },
  {
    id: 'chn-34352955',
    name: '34352955',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d13',
    name: '34352d13',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1548',
    name: 'CHN-1548',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1609',
    name: 'CHN-1609',
    flag: 'CHN',
  },
  {
    id: 'chn-35b67ffd',
    name: '35b67ffd',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d953',
    name: '35b5d953',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1354',
    name: 'CHN-1354',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1830',
    name: 'CHN-1830',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9edd',
    name: '342e9edd',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea743',
    name: '342ea743',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-790',
    name: 'CHN-790',
    flag: 'CHN',
  },
  {
    id: 'chn-35949245',
    name: '35949245',
    flag: 'CHN',
  },
  {
    id: 'chn-34018dc7',
    name: '34018dc7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d6eb',
    name: '35b3d6eb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-598',
    name: 'CHN-598',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd15',
    name: '3434dd15',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-303',
    name: 'CHN-303',
    flag: 'CHN',
  },
  {
    id: 'chn-3153cd75',
    name: '3153cd75',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1f87',
    name: '342c1f87',
    flag: 'CHN',
  },
  {
    id: 'chn-3403be81',
    name: '3403be81',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea76d',
    name: '342ea76d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2360',
    name: 'CHN-2360',
    flag: 'CHN',
  },
  {
    id: 'chn-344d8eab',
    name: '344d8eab',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca8fd3',
    name: '35ca8fd3',
    flag: 'CHN',
  },
  {
    id: 'chn-340176b9',
    name: '340176b9',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca631b',
    name: '35ca631b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b22733',
    name: '35b22733',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5efdf',
    name: '35b5efdf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-813',
    name: 'CHN-813',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c9e9',
    name: '3403c9e9',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c855',
    name: '3403c855',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-762',
    name: 'CHN-762',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28eb1',
    name: '35b28eb1',
    flag: 'CHN',
  },
  {
    id: 'chn-342862ef',
    name: '342862ef',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c57',
    name: '34352c57',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1358',
    name: 'CHN-1358',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6f453',
    name: '35b6f453',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d401',
    name: '35b5d401',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb557',
    name: '342eb557',
    flag: 'CHN',
  },
  {
    id: 'chn-35b21b2d',
    name: '35b21b2d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-704',
    name: 'CHN-704',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef43',
    name: '3434ef43',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f385',
    name: '3434f385',
    flag: 'CHN',
  },
  {
    id: 'chn-34018dc9',
    name: '34018dc9',
    flag: 'CHN',
  },
  {
    id: 'chn-3434efe5',
    name: '3434efe5',
    flag: 'CHN',
  },
  {
    id: 'chn-34287cd9',
    name: '34287cd9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6f4c9',
    name: '35b6f4c9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6889d',
    name: '35b6889d',
    flag: 'CHN',
  },
  {
    id: 'chn-shandongtou',
    name: 'SHANDONGTOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-549',
    name: 'CHN-549',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2395',
    name: 'CHN-2395',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc73',
    name: '35cacc73',
    flag: 'CHN',
  },
  {
    id: 'chn-342e401f',
    name: '342e401f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68657',
    name: '35b68657',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1860',
    name: 'CHN-1860',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf65',
    name: '3588bf65',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-446',
    name: 'CHN-446',
    flag: 'CHN',
  },
  {
    id: 'chn-34287c77',
    name: '34287c77',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1359',
    name: 'CHN-1359',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f4cf',
    name: '3434f4cf',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b3d',
    name: '34348b3d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2334',
    name: 'CHN-2334',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e85',
    name: '35ac2e85',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f1bf',
    name: '35b5f1bf',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68651',
    name: '35b68651',
    flag: 'CHN',
  },
  {
    id: 'chn-34338ba9',
    name: '34338ba9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-527',
    name: 'CHN-527',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1895',
    name: 'CHN-1895',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1170',
    name: 'CHN-1170',
    flag: 'CHN',
  },
  {
    id: 'chn-fuzhou',
    name: 'FUZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-923',
    name: 'CHN-923',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9e99',
    name: '342e9e99',
    flag: 'CHN',
  },
  {
    id: 'chn-34021f8f',
    name: '34021f8f',
    flag: 'CHN',
  },
  {
    id: 'chn-34018db7',
    name: '34018db7',
    flag: 'CHN',
  },
  {
    id: 'chn-qinyu',
    name: 'QINYU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-720',
    name: 'CHN-720',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1620',
    name: 'CHN-1620',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc47',
    name: '3403cc47',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1573',
    name: 'CHN-1573',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca90c9',
    name: '35ca90c9',
    flag: 'CHN',
  },
  {
    id: 'chn-34287c91',
    name: '34287c91',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd11',
    name: '3434dd11',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca922f',
    name: '35ca922f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-830',
    name: 'CHN-830',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-557',
    name: 'CHN-557',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1909',
    name: 'CHN-1909',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1070',
    name: 'CHN-1070',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1754',
    name: 'CHN-1754',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca91f5',
    name: '35ca91f5',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28915',
    name: '35b28915',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-220',
    name: 'CHN-220',
    flag: 'CHN',
  },
  {
    id: 'chn-340170a5',
    name: '340170a5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1460',
    name: 'CHN-1460',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1435',
    name: 'CHN-1435',
    flag: 'CHN',
  },
  {
    id: 'chn-shouguang',
    name: 'SHOUGUANG',
    flag: 'CHN',
  },
  {
    id: 'chn-340308e9',
    name: '340308e9',
    flag: 'CHN',
  },
  {
    id: 'chn-3403db2f',
    name: '3403db2f',
    flag: 'CHN',
  },
  {
    id: 'chn-35878d3b',
    name: '35878d3b',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab84b',
    name: '35cab84b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28ebb',
    name: '35b28ebb',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f6b',
    name: '342e3f6b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d467',
    name: '35b5d467',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad8f37',
    name: '35ad8f37',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-304',
    name: 'CHN-304',
    flag: 'CHN',
  },
  {
    id: 'chn-3587f2a7',
    name: '3587f2a7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1079',
    name: 'CHN-1079',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef77',
    name: '3434ef77',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27a39',
    name: '35b27a39',
    flag: 'CHN',
  },
  {
    id: 'chn-34018753',
    name: '34018753',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d709',
    name: '35b5d709',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-329',
    name: 'CHN-329',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d413',
    name: '35b5d413',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2009',
    name: 'CHN-2009',
    flag: 'CHN',
  },
  {
    id: 'chn-nanri',
    name: 'NANRI',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-977',
    name: 'CHN-977',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2525',
    name: 'CHN-2525',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb541',
    name: '342eb541',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1839',
    name: 'CHN-1839',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-131',
    name: 'CHN-131',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b1f',
    name: '34348b1f',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c2ff',
    name: '3427c2ff',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1265',
    name: 'CHN-1265',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27d13',
    name: '35b27d13',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28799',
    name: '35b28799',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28931',
    name: '35b28931',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-111',
    name: 'CHN-111',
    flag: 'CHN',
  },
  {
    id: 'chn-35ec8c0f',
    name: '35ec8c0f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3ae3',
    name: '35ac3ae3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68007',
    name: '35b68007',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f72d',
    name: '35b5f72d',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e89',
    name: '35ac2e89',
    flag: 'CHN',
  },
  {
    id: 'chn-35b15cd9',
    name: '35b15cd9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2139',
    name: 'CHN-2139',
    flag: 'CHN',
  },
  {
    id: 'chn-340180c7',
    name: '340180c7',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3b1b',
    name: '35ac3b1b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-717',
    name: 'CHN-717',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1503',
    name: 'CHN-1503',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c335',
    name: '3427c335',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69bf9',
    name: '35b69bf9',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c325',
    name: '3427c325',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1277',
    name: 'CHN-1277',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d707',
    name: '35b5d707',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dcbd',
    name: '3427dcbd',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e01',
    name: '342c1e01',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1849',
    name: 'CHN-1849',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-726',
    name: 'CHN-726',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1743',
    name: 'CHN-1743',
    flag: 'CHN',
  },
  {
    id: 'chn-34018173',
    name: '34018173',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca7995',
    name: '35ca7995',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1870',
    name: 'CHN-1870',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e87',
    name: '35ac2e87',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1669',
    name: 'CHN-1669',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-937',
    name: 'CHN-937',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f009',
    name: '3434f009',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f4a5',
    name: '3434f4a5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2472',
    name: 'CHN-2472',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1925',
    name: 'CHN-1925',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1441',
    name: 'CHN-1441',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1863',
    name: 'CHN-1863',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e791',
    name: '3434e791',
    flag: 'CHN',
  },
  {
    id: 'chn-35b22723',
    name: '35b22723',
    flag: 'CHN',
  },
  {
    id: 'chn-3401704b',
    name: '3401704b',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c851',
    name: '3403c851',
    flag: 'CHN',
  },
  {
    id: 'chn-342e4021',
    name: '342e4021',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1841',
    name: 'CHN-1841',
    flag: 'CHN',
  },
  {
    id: 'chn-340176a5',
    name: '340176a5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-539',
    name: 'CHN-539',
    flag: 'CHN',
  },
  {
    id: 'chn-3429354f',
    name: '3429354f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1519',
    name: 'CHN-1519',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1531',
    name: 'CHN-1531',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1014',
    name: 'CHN-1014',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1623',
    name: 'CHN-1623',
    flag: 'CHN',
  },
  {
    id: 'chn-344e27bf',
    name: '344e27bf',
    flag: 'CHN',
  },
  {
    id: 'chn-342862d3',
    name: '342862d3',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca90c1',
    name: '35ca90c1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1446',
    name: 'CHN-1446',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1273',
    name: 'CHN-1273',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1311',
    name: 'CHN-1311',
    flag: 'CHN',
  },
  {
    id: 'chn-3452b6f9',
    name: '3452b6f9',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca905b',
    name: '35ca905b',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f387',
    name: '3434f387',
    flag: 'CHN',
  },
  {
    id: 'chn-344e27c1',
    name: '344e27c1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-978',
    name: 'CHN-978',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1231',
    name: 'CHN-1231',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-613',
    name: 'CHN-613',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d731',
    name: '35b5d731',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1567',
    name: 'CHN-1567',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac295f',
    name: '35ac295f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28885',
    name: '35b28885',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2105',
    name: 'CHN-2105',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1483',
    name: 'CHN-1483',
    flag: 'CHN',
  },
  {
    id: 'chn-342e6a9f',
    name: '342e6a9f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1737',
    name: 'CHN-1737',
    flag: 'CHN',
  },
  {
    id: 'chn-340187f7',
    name: '340187f7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2862b',
    name: '35b2862b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1786',
    name: 'CHN-1786',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1914',
    name: 'CHN-1914',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b9f',
    name: '34024b9f',
    flag: 'CHN',
  },
  {
    id: 'chn-34018b95',
    name: '34018b95',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1318',
    name: 'CHN-1318',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2242',
    name: 'CHN-2242',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-249',
    name: 'CHN-249',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ce8f',
    name: '3403ce8f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-479',
    name: 'CHN-479',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1161',
    name: 'CHN-1161',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2879f',
    name: '35b2879f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6823b',
    name: '35b6823b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2001',
    name: 'CHN-2001',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c4d7',
    name: '3403c4d7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58af5',
    name: '35b58af5',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9cf9',
    name: '342e9cf9',
    flag: 'CHN',
  },
  {
    id: 'chn-yangshan',
    name: 'YANGSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2101',
    name: 'CHN-2101',
    flag: 'CHN',
  },
  {
    id: 'chn-caofeidian',
    name: 'CAOFEIDIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-926',
    name: 'CHN-926',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad8929',
    name: '35ad8929',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf7b',
    name: '3588bf7b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1090',
    name: 'CHN-1090',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-901',
    name: 'CHN-901',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f1d1',
    name: '35b5f1d1',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea741',
    name: '342ea741',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f197',
    name: '35b5f197',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea745',
    name: '342ea745',
    flag: 'CHN',
  },
  {
    id: 'chn-35b1746f',
    name: '35b1746f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-205',
    name: 'CHN-205',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1293',
    name: 'CHN-1293',
    flag: 'CHN',
  },
  {
    id: 'chn-36839e21',
    name: '36839e21',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef5b',
    name: '3434ef5b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68bd9',
    name: '35b68bd9',
    flag: 'CHN',
  },
  {
    id: 'chn-344d8953',
    name: '344d8953',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6891b',
    name: '35b6891b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1705',
    name: 'CHN-1705',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1249',
    name: 'CHN-1249',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca919d',
    name: '35ca919d',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3ff5',
    name: '342e3ff5',
    flag: 'CHN',
  },
  {
    id: 'chn-weizhouisland',
    name: 'WEIZHOU ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1215',
    name: 'CHN-1215',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2231',
    name: 'CHN-2231',
    flag: 'CHN',
  },
  {
    id: 'chn-34018bed',
    name: '34018bed',
    flag: 'CHN',
  },
  {
    id: 'chn-35b22731',
    name: '35b22731',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-194',
    name: 'CHN-194',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d4ff',
    name: '35b5d4ff',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca8e2d',
    name: '35ca8e2d',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9efb',
    name: '342e9efb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-481',
    name: 'CHN-481',
    flag: 'CHN',
  },
  {
    id: 'chn-3412264d',
    name: '3412264d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1750',
    name: 'CHN-1750',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2be3',
    name: '35ac2be3',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac75f',
    name: '35cac75f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3ae1',
    name: '35ac3ae1',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c525',
    name: '3403c525',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-747',
    name: 'CHN-747',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-318',
    name: 'CHN-318',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2130',
    name: 'CHN-2130',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e97',
    name: '35ac2e97',
    flag: 'CHN',
  },
  {
    id: 'chn-3411e823',
    name: '3411e823',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2031',
    name: 'CHN-2031',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae0167',
    name: '35ae0167',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f38f',
    name: '3434f38f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1779',
    name: 'CHN-1779',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1047',
    name: 'CHN-1047',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-399',
    name: 'CHN-399',
    flag: 'CHN',
  },
  {
    id: 'chn-35b26d99',
    name: '35b26d99',
    flag: 'CHN',
  },
  {
    id: 'chn-35b287bb',
    name: '35b287bb',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9163',
    name: '35ca9163',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28c43',
    name: '35b28c43',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-365',
    name: 'CHN-365',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2258',
    name: 'CHN-2258',
    flag: 'CHN',
  },
  {
    id: 'chn-34022813',
    name: '34022813',
    flag: 'CHN',
  },
  {
    id: 'chn-34348ae7',
    name: '34348ae7',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ad9d',
    name: '3403ad9d',
    flag: 'CHN',
  },
  {
    id: 'chn-34338ba1',
    name: '34338ba1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2271',
    name: 'CHN-2271',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2878f',
    name: '35b2878f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-787',
    name: 'CHN-787',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1023',
    name: 'CHN-1023',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c54f',
    name: '3403c54f',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9d17',
    name: '342e9d17',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-864',
    name: 'CHN-864',
    flag: 'CHN',
  },
  {
    id: 'chn-basuo',
    name: 'BASUO',
    flag: 'CHN',
  },
  {
    id: 'chn-nanao',
    name: 'NANAO',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2514',
    name: 'CHN-2514',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1797',
    name: 'CHN-1797',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ce89',
    name: '3403ce89',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69c01',
    name: '35b69c01',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-633',
    name: 'CHN-633',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2471',
    name: 'CHN-2471',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1463',
    name: 'CHN-1463',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c4db',
    name: '3403c4db',
    flag: 'CHN',
  },
  {
    id: 'chn-maominganchorage',
    name: 'MAOMING ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a703',
    name: '3403a703',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1167',
    name: 'CHN-1167',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1019',
    name: 'CHN-1019',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1123',
    name: 'CHN-1123',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-980',
    name: 'CHN-980',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1939',
    name: 'CHN-1939',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b9d',
    name: '34024b9d',
    flag: 'CHN',
  },
  {
    id: 'chn-340307cf',
    name: '340307cf',
    flag: 'CHN',
  },
  {
    id: 'chn-35b17053',
    name: '35b17053',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2425',
    name: 'CHN-2425',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-424',
    name: 'CHN-424',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68231',
    name: '35b68231',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca630f',
    name: '35ca630f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d133',
    name: '35b5d133',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3b19',
    name: '35ac3b19',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d5af',
    name: '35b5d5af',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-839',
    name: 'CHN-839',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-815',
    name: 'CHN-815',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1113',
    name: 'CHN-1113',
    flag: 'CHN',
  },
  {
    id: 'chn-3402490b',
    name: '3402490b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f18d',
    name: '35b5f18d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2518',
    name: 'CHN-2518',
    flag: 'CHN',
  },
  {
    id: 'chn-35caba79',
    name: '35caba79',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-924',
    name: 'CHN-924',
    flag: 'CHN',
  },
  {
    id: 'chn-35b686f9',
    name: '35b686f9',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef71',
    name: '3434ef71',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1097',
    name: 'CHN-1097',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea0ab',
    name: '342ea0ab',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1058',
    name: 'CHN-1058',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1844',
    name: 'CHN-1844',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef59',
    name: '3434ef59',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbd7',
    name: '35cacbd7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-278',
    name: 'CHN-278',
    flag: 'CHN',
  },
  {
    id: 'chn-3403087f',
    name: '3403087f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-595',
    name: 'CHN-595',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1177',
    name: 'CHN-1177',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab84d',
    name: '35cab84d',
    flag: 'CHN',
  },
  {
    id: 'chn-3683758b',
    name: '3683758b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28629',
    name: '35b28629',
    flag: 'CHN',
  },
  {
    id: 'chn-34287961',
    name: '34287961',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1188',
    name: 'CHN-1188',
    flag: 'CHN',
  },
  {
    id: 'chn-34018f5d',
    name: '34018f5d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2123',
    name: 'CHN-2123',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1078',
    name: 'CHN-1078',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-873',
    name: 'CHN-873',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fa5',
    name: '342c1fa5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1024',
    name: 'CHN-1024',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d0cd',
    name: '35b5d0cd',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69ee1',
    name: '35b69ee1',
    flag: 'CHN',
  },
  {
    id: 'chn-34017409',
    name: '34017409',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad8f33',
    name: '35ad8f33',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c31b',
    name: '3427c31b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2607',
    name: 'CHN-2607',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1624',
    name: 'CHN-1624',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd1b',
    name: '3434dd1b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1150',
    name: 'CHN-1150',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1556',
    name: 'CHN-1556',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dce3',
    name: '3434dce3',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af77',
    name: '3403af77',
    flag: 'CHN',
  },
  {
    id: 'chn-jiangmen',
    name: 'JIANGMEN',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c319',
    name: '3427c319',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27aed',
    name: '35b27aed',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5ee29',
    name: '35b5ee29',
    flag: 'CHN',
  },
  {
    id: 'chn-36837593',
    name: '36837593',
    flag: 'CHN',
  },
  {
    id: 'chn-314e6a77',
    name: '314e6a77',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f72b',
    name: '35b5f72b',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c39',
    name: '34352c39',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1272',
    name: 'CHN-1272',
    flag: 'CHN',
  },
  {
    id: 'chn-3431b6f9',
    name: '3431b6f9',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f00f',
    name: '3434f00f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1639',
    name: 'CHN-1639',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c47',
    name: '34352c47',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f1d7',
    name: '35b5f1d7',
    flag: 'CHN',
  },
  {
    id: 'chn-34018bc1',
    name: '34018bc1',
    flag: 'CHN',
  },
  {
    id: 'chn-34348af1',
    name: '34348af1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1904',
    name: 'CHN-1904',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2469',
    name: 'CHN-2469',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1798',
    name: 'CHN-1798',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1683',
    name: 'CHN-1683',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1535',
    name: 'CHN-1535',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3ff3',
    name: '342e3ff3',
    flag: 'CHN',
  },
  {
    id: 'chn-34352cff',
    name: '34352cff',
    flag: 'CHN',
  },
  {
    id: 'chn-beihai',
    name: 'BEIHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1126',
    name: 'CHN-1126',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1701',
    name: 'CHN-1701',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fc7',
    name: '342c1fc7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1340',
    name: 'CHN-1340',
    flag: 'CHN',
  },
  {
    id: 'chn-34018dcb',
    name: '34018dcb',
    flag: 'CHN',
  },
  {
    id: 'chn-35ec8c6d',
    name: '35ec8c6d',
    flag: 'CHN',
  },
  {
    id: 'chn-3153cd79',
    name: '3153cd79',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2478',
    name: 'CHN-2478',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-838',
    name: 'CHN-838',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-406',
    name: 'CHN-406',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b3b',
    name: '34348b3b',
    flag: 'CHN',
  },
  {
    id: 'chn-341226e7',
    name: '341226e7',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1f8b',
    name: '342c1f8b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-621',
    name: 'CHN-621',
    flag: 'CHN',
  },
  {
    id: 'chn-35caccfb',
    name: '35caccfb',
    flag: 'CHN',
  },
  {
    id: 'chn-340309a7',
    name: '340309a7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2273',
    name: 'CHN-2273',
    flag: 'CHN',
  },
  {
    id: 'chn-35b17111',
    name: '35b17111',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-662',
    name: 'CHN-662',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5fa81',
    name: '35b5fa81',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-163',
    name: 'CHN-163',
    flag: 'CHN',
  },
  {
    id: 'chn-344d8911',
    name: '344d8911',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1163',
    name: 'CHN-1163',
    flag: 'CHN',
  },
  {
    id: 'chn-340181a7',
    name: '340181a7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b924f3',
    name: '35b924f3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1932',
    name: 'CHN-1932',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1242',
    name: 'CHN-1242',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28881',
    name: '35b28881',
    flag: 'CHN',
  },
  {
    id: 'chn-34046c55',
    name: '34046c55',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c41',
    name: '34018c41',
    flag: 'CHN',
  },
  {
    id: 'chn-34018635',
    name: '34018635',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2479',
    name: 'CHN-2479',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d72f',
    name: '35b5d72f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1192',
    name: 'CHN-1192',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a57b',
    name: '3403a57b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-364',
    name: 'CHN-364',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1f8d',
    name: '342c1f8d',
    flag: 'CHN',
  },
  {
    id: 'chn-3403dad3',
    name: '3403dad3',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28883',
    name: '35b28883',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e11',
    name: '342c1e11',
    flag: 'CHN',
  },
  {
    id: 'chn-maoming',
    name: 'MAOMING',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ef7',
    name: '342e9ef7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1274',
    name: 'CHN-1274',
    flag: 'CHN',
  },
  {
    id: 'chn-3411dd3d',
    name: '3411dd3d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-943',
    name: 'CHN-943',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1800',
    name: 'CHN-1800',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28935',
    name: '35b28935',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9165',
    name: '35ca9165',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea0a5',
    name: '342ea0a5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-429',
    name: 'CHN-429',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc5d',
    name: '3403cc5d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1481',
    name: 'CHN-1481',
    flag: 'CHN',
  },
  {
    id: 'chn-34021f89',
    name: '34021f89',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea70d',
    name: '342ea70d',
    flag: 'CHN',
  },
  {
    id: 'chn-35bee49b',
    name: '35bee49b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1864',
    name: 'CHN-1864',
    flag: 'CHN',
  },
  {
    id: 'chn-35b9125f',
    name: '35b9125f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-608',
    name: 'CHN-608',
    flag: 'CHN',
  },
  {
    id: 'chn-340176ef',
    name: '340176ef',
    flag: 'CHN',
  },
  {
    id: 'chn-35b26c49',
    name: '35b26c49',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1691',
    name: 'CHN-1691',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-185',
    name: 'CHN-185',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac9bf',
    name: '35cac9bf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-517',
    name: 'CHN-517',
    flag: 'CHN',
  },
  {
    id: 'chn-34287cc9',
    name: '34287cc9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1241',
    name: 'CHN-1241',
    flag: 'CHN',
  },
  {
    id: 'chn-jinzhou',
    name: 'JINZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca8fd5',
    name: '35ca8fd5',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b95',
    name: '34024b95',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc45',
    name: '3403cc45',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68009',
    name: '35b68009',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1719',
    name: 'CHN-1719',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-865',
    name: 'CHN-865',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1307',
    name: 'CHN-1307',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-212',
    name: 'CHN-212',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af65',
    name: '3403af65',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1459',
    name: 'CHN-1459',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-984',
    name: 'CHN-984',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-579',
    name: 'CHN-579',
    flag: 'CHN',
  },
  {
    id: 'chn-3403be7f',
    name: '3403be7f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27a79',
    name: '35b27a79',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-685',
    name: 'CHN-685',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-880',
    name: 'CHN-880',
    flag: 'CHN',
  },
  {
    id: 'chn-340235ad',
    name: '340235ad',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d127',
    name: '35b5d127',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-130',
    name: 'CHN-130',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1472',
    name: 'CHN-1472',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d65d',
    name: '35b5d65d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2076',
    name: 'CHN-2076',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-949',
    name: 'CHN-949',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc4b',
    name: '3403cc4b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2196',
    name: 'CHN-2196',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1988',
    name: 'CHN-1988',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1745',
    name: 'CHN-1745',
    flag: 'CHN',
  },
  {
    id: 'chn-315226d3',
    name: '315226d3',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca90ed',
    name: '35ca90ed',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-966',
    name: 'CHN-966',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-857',
    name: 'CHN-857',
    flag: 'CHN',
  },
  {
    id: 'chn-35b1774f',
    name: '35b1774f',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc6d',
    name: '35cacc6d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1217',
    name: 'CHN-1217',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f39',
    name: '342e3f39',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d0b7',
    name: '35b5d0b7',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e3d',
    name: '342c1e3d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1184',
    name: 'CHN-1184',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1390',
    name: 'CHN-1390',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68ae7',
    name: '35b68ae7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1888',
    name: 'CHN-1888',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c69',
    name: '34018c69',
    flag: 'CHN',
  },
  {
    id: 'chn-35b26d7d',
    name: '35b26d7d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1000',
    name: 'CHN-1000',
    flag: 'CHN',
  },
  {
    id: 'chn-35b17115',
    name: '35b17115',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1105',
    name: 'CHN-1105',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b4b',
    name: '34348b4b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-123',
    name: 'CHN-123',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-110',
    name: 'CHN-110',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf6d',
    name: '3588bf6d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1469',
    name: 'CHN-1469',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2498',
    name: 'CHN-2498',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d46d',
    name: '35b5d46d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1575',
    name: 'CHN-1575',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1821',
    name: 'CHN-1821',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d1b',
    name: '34352d1b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27d6d',
    name: '35b27d6d',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b53b',
    name: '3403b53b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d741',
    name: '35b3d741',
    flag: 'CHN',
  },
  {
    id: 'chn-34018fa1',
    name: '34018fa1',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca62db',
    name: '35ca62db',
    flag: 'CHN',
  },
  {
    id: 'chn-dongfang',
    name: 'DONGFANG',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-716',
    name: 'CHN-716',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-618',
    name: 'CHN-618',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea755',
    name: '342ea755',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e3f',
    name: '342c1e3f',
    flag: 'CHN',
  },
  {
    id: 'chn-34338bbd',
    name: '34338bbd',
    flag: 'CHN',
  },
  {
    id: 'chn-34347433',
    name: '34347433',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-770',
    name: 'CHN-770',
    flag: 'CHN',
  },
  {
    id: 'chn-35b17467',
    name: '35b17467',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1727',
    name: 'CHN-1727',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1380',
    name: 'CHN-1380',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-961',
    name: 'CHN-961',
    flag: 'CHN',
  },
  {
    id: 'chn-35bee499',
    name: '35bee499',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2463',
    name: 'CHN-2463',
    flag: 'CHN',
  },
  {
    id: 'chn-3403adbf',
    name: '3403adbf',
    flag: 'CHN',
  },
  {
    id: 'chn-maanshan',
    name: 'MAANSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac991',
    name: '35cac991',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1585',
    name: 'CHN-1585',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c11',
    name: '34352c11',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1495',
    name: 'CHN-1495',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-760',
    name: 'CHN-760',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d7c1',
    name: '35b3d7c1',
    flag: 'CHN',
  },
  {
    id: 'chn-35b226d5',
    name: '35b226d5',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc07',
    name: '35cacc07',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca7d31',
    name: '35ca7d31',
    flag: 'CHN',
  },
  {
    id: 'chn-340187cb',
    name: '340187cb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-899',
    name: 'CHN-899',
    flag: 'CHN',
  },
  {
    id: 'chn-340176b1',
    name: '340176b1',
    flag: 'CHN',
  },
  {
    id: 'chn-36ab1c79',
    name: '36ab1c79',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2892b',
    name: '35b2892b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1033',
    name: 'CHN-1033',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2542',
    name: 'CHN-2542',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1788',
    name: 'CHN-1788',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef99',
    name: '3434ef99',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-728',
    name: 'CHN-728',
    flag: 'CHN',
  },
  {
    id: 'chn-34018fc7',
    name: '34018fc7',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9c03',
    name: '342e9c03',
    flag: 'CHN',
  },
  {
    id: 'chn-3401bd8d',
    name: '3401bd8d',
    flag: 'CHN',
  },
  {
    id: 'chn-340229cb',
    name: '340229cb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1397',
    name: 'CHN-1397',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d593',
    name: '35b3d593',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1347',
    name: 'CHN-1347',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea7a7',
    name: '342ea7a7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58a85',
    name: '35b58a85',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca90f5',
    name: '35ca90f5',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac7cf',
    name: '35cac7cf',
    flag: 'CHN',
  },
  {
    id: 'chn-3434eff1',
    name: '3434eff1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1449',
    name: 'CHN-1449',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca7d4b',
    name: '35ca7d4b',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef51',
    name: '3434ef51',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1251',
    name: 'CHN-1251',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2047',
    name: 'CHN-2047',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-775',
    name: 'CHN-775',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c15',
    name: '34018c15',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1887',
    name: 'CHN-1887',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af69',
    name: '3403af69',
    flag: 'CHN',
  },
  {
    id: 'chn-34017073',
    name: '34017073',
    flag: 'CHN',
  },
  {
    id: 'chn-changzhou',
    name: 'CHANGZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-34018f75',
    name: '34018f75',
    flag: 'CHN',
  },
  {
    id: 'chn-314e41f7',
    name: '314e41f7',
    flag: 'CHN',
  },
  {
    id: 'chn-36839e1b',
    name: '36839e1b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1910',
    name: 'CHN-1910',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1730',
    name: 'CHN-1730',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae0155',
    name: '35ae0155',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d563',
    name: '35b5d563',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b6f',
    name: '34024b6f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1027',
    name: 'CHN-1027',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1408',
    name: 'CHN-1408',
    flag: 'CHN',
  },
  {
    id: 'chn-34352be5',
    name: '34352be5',
    flag: 'CHN',
  },
  {
    id: 'chn-34018b97',
    name: '34018b97',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-408',
    name: 'CHN-408',
    flag: 'CHN',
  },
  {
    id: 'chn-34287bf3',
    name: '34287bf3',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a65f',
    name: '3403a65f',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e1f',
    name: '342c1e1f',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea713',
    name: '342ea713',
    flag: 'CHN',
  },
  {
    id: 'chn-xianning',
    name: 'XIANNING',
    flag: 'CHN',
  },
  {
    id: 'chn-34018117',
    name: '34018117',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c5b',
    name: '34352c5b',
    flag: 'CHN',
  },
  {
    id: 'chn-35bee493',
    name: '35bee493',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1382',
    name: 'CHN-1382',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2528',
    name: 'CHN-2528',
    flag: 'CHN',
  },
  {
    id: 'chn-qishazhen',
    name: 'QISHAZHEN',
    flag: 'CHN',
  },
  {
    id: 'chn-huaian',
    name: 'HUAIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-609',
    name: 'CHN-609',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2430',
    name: 'CHN-2430',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf5f',
    name: '3588bf5f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-531',
    name: 'CHN-531',
    flag: 'CHN',
  },
  {
    id: 'chn-jingtang',
    name: 'JINGTANG',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1928',
    name: 'CHN-1928',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2143',
    name: 'CHN-2143',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f083',
    name: '35b5f083',
    flag: 'CHN',
  },
  {
    id: 'chn-34352bdf',
    name: '34352bdf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1628',
    name: 'CHN-1628',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae06ab',
    name: '35ae06ab',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2554',
    name: 'CHN-2554',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9e95',
    name: '342e9e95',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c09',
    name: '34352c09',
    flag: 'CHN',
  },
  {
    id: 'chn-weifang',
    name: 'WEIFANG',
    flag: 'CHN',
  },
  {
    id: 'chn-35b1774b',
    name: '35b1774b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d689',
    name: '35b5d689',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-603',
    name: 'CHN-603',
    flag: 'CHN',
  },
  {
    id: 'chn-35b173f9',
    name: '35b173f9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b20527',
    name: '35b20527',
    flag: 'CHN',
  },
  {
    id: 'chn-340248e3',
    name: '340248e3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1877',
    name: 'CHN-1877',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-663',
    name: 'CHN-663',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1193',
    name: 'CHN-1193',
    flag: 'CHN',
  },
  {
    id: 'chn-35cabf5d',
    name: '35cabf5d',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac987',
    name: '35cac987',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-310',
    name: 'CHN-310',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-765',
    name: 'CHN-765',
    flag: 'CHN',
  },
  {
    id: 'chn-314e41e3',
    name: '314e41e3',
    flag: 'CHN',
  },
  {
    id: 'chn-3401706d',
    name: '3401706d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1793',
    name: 'CHN-1793',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1702',
    name: 'CHN-1702',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1f89',
    name: '342c1f89',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-416',
    name: 'CHN-416',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-737',
    name: 'CHN-737',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-188',
    name: 'CHN-188',
    flag: 'CHN',
  },
  {
    id: 'chn-34018bbb',
    name: '34018bbb',
    flag: 'CHN',
  },
  {
    id: 'chn-340309a9',
    name: '340309a9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-174',
    name: 'CHN-174',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1605',
    name: 'CHN-1605',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-742',
    name: 'CHN-742',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1726',
    name: 'CHN-1726',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1141',
    name: 'CHN-1141',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27a4f',
    name: '35b27a4f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f079',
    name: '35b5f079',
    flag: 'CHN',
  },
  {
    id: 'chn-35ec8955',
    name: '35ec8955',
    flag: 'CHN',
  },
  {
    id: 'chn-35b288c7',
    name: '35b288c7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1306',
    name: 'CHN-1306',
    flag: 'CHN',
  },
  {
    id: 'chn-340180df',
    name: '340180df',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca972f',
    name: '35ca972f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-828',
    name: 'CHN-828',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1497',
    name: 'CHN-1497',
    flag: 'CHN',
  },
  {
    id: 'chn-34018a35',
    name: '34018a35',
    flag: 'CHN',
  },
  {
    id: 'chn-34018bcb',
    name: '34018bcb',
    flag: 'CHN',
  },
  {
    id: 'chn-jiangdu',
    name: 'JIANGDU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1202',
    name: 'CHN-1202',
    flag: 'CHN',
  },
  {
    id: 'chn-35b288bf',
    name: '35b288bf',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b4f',
    name: '35b27b4f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d705',
    name: '35b5d705',
    flag: 'CHN',
  },
  {
    id: 'chn-zhuhai',
    name: 'ZHUHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac791',
    name: '35cac791',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f41',
    name: '342e3f41',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1224',
    name: 'CHN-1224',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1044',
    name: 'CHN-1044',
    flag: 'CHN',
  },
  {
    id: 'chn-34348ba7',
    name: '34348ba7',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf61',
    name: '3588bf61',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c54d',
    name: '3403c54d',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6d5',
    name: '35b5d6d5',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dce5',
    name: '3434dce5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2492',
    name: 'CHN-2492',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1154',
    name: 'CHN-1154',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1197',
    name: 'CHN-1197',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-380',
    name: 'CHN-380',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbe9',
    name: '35cacbe9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2064',
    name: 'CHN-2064',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-141',
    name: 'CHN-141',
    flag: 'CHN',
  },
  {
    id: 'chn-35b21ad7',
    name: '35b21ad7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2709b',
    name: '35b2709b',
    flag: 'CHN',
  },
  {
    id: 'chn-34046c5b',
    name: '34046c5b',
    flag: 'CHN',
  },
  {
    id: 'chn-34022811',
    name: '34022811',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c559',
    name: '3403c559',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1985',
    name: 'CHN-1985',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1394',
    name: 'CHN-1394',
    flag: 'CHN',
  },
  {
    id: 'chn-ezhou',
    name: 'EZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1761',
    name: 'CHN-1761',
    flag: 'CHN',
  },
  {
    id: 'chn-34024979',
    name: '34024979',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2550',
    name: 'CHN-2550',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-674',
    name: 'CHN-674',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a699',
    name: '3403a699',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca96e7',
    name: '35ca96e7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2296',
    name: 'CHN-2296',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-965',
    name: 'CHN-965',
    flag: 'CHN',
  },
  {
    id: 'chn-tongling',
    name: 'TONGLING',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-874',
    name: 'CHN-874',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1370',
    name: 'CHN-1370',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1213',
    name: 'CHN-1213',
    flag: 'CHN',
  },
  {
    id: 'chn-35edb917',
    name: '35edb917',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e7bd',
    name: '3434e7bd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2194',
    name: 'CHN-2194',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f47',
    name: '342e3f47',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1648',
    name: 'CHN-1648',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af7d',
    name: '3403af7d',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c3d',
    name: '34352c3d',
    flag: 'CHN',
  },
  {
    id: 'chn-34287be7',
    name: '34287be7',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dcb9',
    name: '3427dcb9',
    flag: 'CHN',
  },
  {
    id: 'chn-34352be3',
    name: '34352be3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-414',
    name: 'CHN-414',
    flag: 'CHN',
  },
  {
    id: 'chn-340180fb',
    name: '340180fb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1374',
    name: 'CHN-1374',
    flag: 'CHN',
  },
  {
    id: 'chn-342ecaab',
    name: '342ecaab',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1230',
    name: 'CHN-1230',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1135',
    name: 'CHN-1135',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6ad',
    name: '35b5d6ad',
    flag: 'CHN',
  },
  {
    id: 'chn-342ea759',
    name: '342ea759',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1527',
    name: 'CHN-1527',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1115',
    name: 'CHN-1115',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1633',
    name: 'CHN-1633',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27aff',
    name: '35b27aff',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3ad5',
    name: '35ac3ad5',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e19',
    name: '342c1e19',
    flag: 'CHN',
  },
  {
    id: 'chn-340187c9',
    name: '340187c9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1040',
    name: 'CHN-1040',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3e3ed',
    name: '35b3e3ed',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5efcf',
    name: '35b5efcf',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d5f5',
    name: '35b3d5f5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2245',
    name: 'CHN-2245',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1869',
    name: 'CHN-1869',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1452',
    name: 'CHN-1452',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9f03',
    name: '342e9f03',
    flag: 'CHN',
  },
  {
    id: 'chn-34404d19',
    name: '34404d19',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac252d',
    name: '35ac252d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2037',
    name: 'CHN-2037',
    flag: 'CHN',
  },
  {
    id: 'chn-yushanisland',
    name: 'YUSHAN ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1600',
    name: 'CHN-1600',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd63',
    name: '3434dd63',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-287',
    name: 'CHN-287',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1494',
    name: 'CHN-1494',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac33ff',
    name: '35ac33ff',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27ad9',
    name: '35b27ad9',
    flag: 'CHN',
  },
  {
    id: 'chn-34024bbd',
    name: '34024bbd',
    flag: 'CHN',
  },
  {
    id: 'chn-taizhou',
    name: 'TAIZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-340187ed',
    name: '340187ed',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-709',
    name: 'CHN-709',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2475',
    name: 'CHN-2475',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-118',
    name: 'CHN-118',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-731',
    name: 'CHN-731',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c331',
    name: '3427c331',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6f4c7',
    name: '35b6f4c7',
    flag: 'CHN',
  },
  {
    id: 'chn-yichang',
    name: 'YICHANG',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6cb',
    name: '35b5d6cb',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b21',
    name: '34348b21',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c4d3',
    name: '3403c4d3',
    flag: 'CHN',
  },
  {
    id: 'chn-chengmai',
    name: 'CHENGMAI',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1454',
    name: 'CHN-1454',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-780',
    name: 'CHN-780',
    flag: 'CHN',
  },
  {
    id: 'chn-35b17151',
    name: '35b17151',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-584',
    name: 'CHN-584',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6889b',
    name: '35b6889b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1496',
    name: 'CHN-1496',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68185',
    name: '35b68185',
    flag: 'CHN',
  },
  {
    id: 'chn-ganjiang',
    name: 'GANJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-haiyang',
    name: 'HAIYANG',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-703',
    name: 'CHN-703',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacbe5',
    name: '35cacbe5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1612',
    name: 'CHN-1612',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d15',
    name: '34352d15',
    flag: 'CHN',
  },
  {
    id: 'chn-340176bb',
    name: '340176bb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-488',
    name: 'CHN-488',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1604',
    name: 'CHN-1604',
    flag: 'CHN',
  },
  {
    id: 'chn-3411da1b',
    name: '3411da1b',
    flag: 'CHN',
  },
  {
    id: 'chn-35b204df',
    name: '35b204df',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-953',
    name: 'CHN-953',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2d029',
    name: '35b2d029',
    flag: 'CHN',
  },
  {
    id: 'chn-35b22739',
    name: '35b22739',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5efd3',
    name: '35b5efd3',
    flag: 'CHN',
  },
  {
    id: 'chn-342e3f97',
    name: '342e3f97',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f003',
    name: '35b5f003',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58afb',
    name: '35b58afb',
    flag: 'CHN',
  },
  {
    id: 'chn-36ab1d31',
    name: '36ab1d31',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f4b9',
    name: '3434f4b9',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c31f',
    name: '3427c31f',
    flag: 'CHN',
  },
  {
    id: 'chn-34527d77',
    name: '34527d77',
    flag: 'CHN',
  },
  {
    id: 'chn-35b58aed',
    name: '35b58aed',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e5f7',
    name: '3434e5f7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68725',
    name: '35b68725',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2555',
    name: 'CHN-2555',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca91e1',
    name: '35ca91e1',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c43',
    name: '34018c43',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac3acd',
    name: '35ac3acd',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef7d',
    name: '3434ef7d',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e37',
    name: '342c1e37',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2457',
    name: 'CHN-2457',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1826',
    name: 'CHN-1826',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dc93',
    name: '3427dc93',
    flag: 'CHN',
  },
  {
    id: 'chn-taicang',
    name: 'TAICANG',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-917',
    name: 'CHN-917',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d65f',
    name: '35b5d65f',
    flag: 'CHN',
  },
  {
    id: 'chn-340248e5',
    name: '340248e5',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c18f',
    name: '3427c18f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28ea1',
    name: '35b28ea1',
    flag: 'CHN',
  },
  {
    id: 'chn-35b22727',
    name: '35b22727',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b161',
    name: '3403b161',
    flag: 'CHN',
  },
  {
    id: 'chn-340176c1',
    name: '340176c1',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e39',
    name: '342c1e39',
    flag: 'CHN',
  },
  {
    id: 'chn-34287c79',
    name: '34287c79',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-331',
    name: 'CHN-331',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1872',
    name: 'CHN-1872',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca90c5',
    name: '35ca90c5',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ce81',
    name: '3403ce81',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1200',
    name: 'CHN-1200',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1654',
    name: 'CHN-1654',
    flag: 'CHN',
  },
  {
    id: 'chn-haiyan',
    name: 'HAIYAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1057',
    name: 'CHN-1057',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c75',
    name: '34018c75',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-132',
    name: 'CHN-132',
    flag: 'CHN',
  },
  {
    id: 'chn-340187c7',
    name: '340187c7',
    flag: 'CHN',
  },
  {
    id: 'chn-jinshan',
    name: 'JINSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-785',
    name: 'CHN-785',
    flag: 'CHN',
  },
  {
    id: 'chn-34348a65',
    name: '34348a65',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1825',
    name: 'CHN-1825',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca91f1',
    name: '35ca91f1',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69ecb',
    name: '35b69ecb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-504',
    name: 'CHN-504',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-128',
    name: 'CHN-128',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1337',
    name: 'CHN-1337',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc43',
    name: '35cacc43',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-377',
    name: 'CHN-377',
    flag: 'CHN',
  },
  {
    id: 'chn-34018885',
    name: '34018885',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1122',
    name: 'CHN-1122',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79e7',
    name: '35ca79e7',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e58b',
    name: '3434e58b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-891',
    name: 'CHN-891',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-297',
    name: 'CHN-297',
    flag: 'CHN',
  },
  {
    id: 'chn-35cabf43',
    name: '35cabf43',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ee7',
    name: '342e9ee7',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b2d',
    name: '34348b2d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-927',
    name: 'CHN-927',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d4fd',
    name: '35b5d4fd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-808',
    name: 'CHN-808',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1736',
    name: 'CHN-1736',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1533',
    name: 'CHN-1533',
    flag: 'CHN',
  },
  {
    id: 'chn-chenjiagang',
    name: 'CHENJIAGANG',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc37',
    name: '3403cc37',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79eb',
    name: '35ca79eb',
    flag: 'CHN',
  },
  {
    id: 'chn-342eb51b',
    name: '342eb51b',
    flag: 'CHN',
  },
  {
    id: 'chn-3403adc1',
    name: '3403adc1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1781',
    name: 'CHN-1781',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1331',
    name: 'CHN-1331',
    flag: 'CHN',
  },
  {
    id: 'chn-35cab0a1',
    name: '35cab0a1',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f381',
    name: '3434f381',
    flag: 'CHN',
  },
  {
    id: 'chn-35b26d77',
    name: '35b26d77',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2963',
    name: '35ac2963',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f1c7',
    name: '35b5f1c7',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a567',
    name: '3403a567',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dcbb',
    name: '3427dcbb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1735',
    name: 'CHN-1735',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d131',
    name: '35b5d131',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae069f',
    name: '35ae069f',
    flag: 'CHN',
  },
  {
    id: 'chn-ganyu',
    name: 'GANYU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1806',
    name: 'CHN-1806',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1766',
    name: 'CHN-1766',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2dd7',
    name: '35ac2dd7',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c185',
    name: '3427c185',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-528',
    name: 'CHN-528',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2000',
    name: 'CHN-2000',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2385',
    name: 'CHN-2385',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1255',
    name: 'CHN-1255',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-242',
    name: 'CHN-242',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1367',
    name: 'CHN-1367',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-253',
    name: 'CHN-253',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-379',
    name: 'CHN-379',
    flag: 'CHN',
  },
  {
    id: 'chn-35b26d7f',
    name: '35b26d7f',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf71',
    name: '3588bf71',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28ecd',
    name: '35b28ecd',
    flag: 'CHN',
  },
  {
    id: 'chn-jiujiang',
    name: 'JIUJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-3427dccb',
    name: '3427dccb',
    flag: 'CHN',
  },
  {
    id: 'chn-bohe',
    name: 'BOHE',
    flag: 'CHN',
  },
  {
    id: 'chn-fangchenggang',
    name: 'FANGCHENGGANG',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9745',
    name: '35ca9745',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1316',
    name: 'CHN-1316',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc31',
    name: '3403cc31',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c24f',
    name: '3427c24f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6cd',
    name: '35b5d6cd',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1147',
    name: 'CHN-1147',
    flag: 'CHN',
  },
  {
    id: 'chn-3411d1ad',
    name: '3411d1ad',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e4b',
    name: '342c1e4b',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9e93',
    name: '342e9e93',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1f93',
    name: '342c1f93',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-390',
    name: 'CHN-390',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1055',
    name: 'CHN-1055',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-846',
    name: 'CHN-846',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2129',
    name: 'CHN-2129',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1267',
    name: 'CHN-1267',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c4d1',
    name: '3403c4d1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1560',
    name: 'CHN-1560',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1054',
    name: 'CHN-1054',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c6d',
    name: '34018c6d',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc39',
    name: '3403cc39',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1298',
    name: 'CHN-1298',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca905d',
    name: '35ca905d',
    flag: 'CHN',
  },
  {
    id: 'chn-340235b5',
    name: '340235b5',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e1d',
    name: '342c1e1d',
    flag: 'CHN',
  },
  {
    id: 'chn-3401887f',
    name: '3401887f',
    flag: 'CHN',
  },
  {
    id: 'chn-358b867f',
    name: '358b867f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca91ed',
    name: '35ca91ed',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9c11',
    name: '342e9c11',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2036',
    name: 'CHN-2036',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2121',
    name: 'CHN-2121',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3e3eb',
    name: '35b3e3eb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b688ef',
    name: '35b688ef',
    flag: 'CHN',
  },
  {
    id: 'chn-3403c551',
    name: '3403c551',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1083',
    name: 'CHN-1083',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6b3',
    name: '35b5d6b3',
    flag: 'CHN',
  },
  {
    id: 'chn-35bee491',
    name: '35bee491',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-372',
    name: 'CHN-372',
    flag: 'CHN',
  },
  {
    id: 'chn-35b1d6cf',
    name: '35b1d6cf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2544',
    name: 'CHN-2544',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae0151',
    name: '35ae0151',
    flag: 'CHN',
  },
  {
    id: 'chn-3446cf7d',
    name: '3446cf7d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2372',
    name: 'CHN-2372',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1166',
    name: 'CHN-1166',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2437',
    name: 'CHN-2437',
    flag: 'CHN',
  },
  {
    id: 'chn-344d894d',
    name: '344d894d',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b31',
    name: '34348b31',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2be1',
    name: '35ac2be1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1764',
    name: 'CHN-1764',
    flag: 'CHN',
  },
  {
    id: 'chn-34287bf1',
    name: '34287bf1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2150',
    name: 'CHN-2150',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f6d1',
    name: '35b5f6d1',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5fa7f',
    name: '35b5fa7f',
    flag: 'CHN',
  },
  {
    id: 'chn-340180c5',
    name: '340180c5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-467',
    name: 'CHN-467',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1440',
    name: 'CHN-1440',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-168',
    name: 'CHN-168',
    flag: 'CHN',
  },
  {
    id: 'chn-35b20521',
    name: '35b20521',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27b3d',
    name: '35b27b3d',
    flag: 'CHN',
  },
  {
    id: 'chn-340180fd',
    name: '340180fd',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f0cb',
    name: '35b5f0cb',
    flag: 'CHN',
  },
  {
    id: 'chn-caojing',
    name: 'CAOJING',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-698',
    name: 'CHN-698',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d4f9',
    name: '35b5d4f9',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ad77',
    name: '3403ad77',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-647',
    name: 'CHN-647',
    flag: 'CHN',
  },
  {
    id: 'chn-34404d3d',
    name: '34404d3d',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef79',
    name: '3434ef79',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1190',
    name: 'CHN-1190',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f009',
    name: '35b5f009',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d6ab',
    name: '35b5d6ab',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b7f',
    name: '34024b7f',
    flag: 'CHN',
  },
  {
    id: 'chn-34293539',
    name: '34293539',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2429',
    name: 'CHN-2429',
    flag: 'CHN',
  },
  {
    id: 'chn-36ab1d25',
    name: '36ab1d25',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1007',
    name: 'CHN-1007',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f49b',
    name: '3434f49b',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b429',
    name: '3403b429',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-773',
    name: 'CHN-773',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1558',
    name: 'CHN-1558',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef6f',
    name: '3434ef6f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d13b',
    name: '35b5d13b',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af6b',
    name: '3403af6b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1461',
    name: 'CHN-1461',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-605',
    name: 'CHN-605',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1323',
    name: 'CHN-1323',
    flag: 'CHN',
  },
  {
    id: 'chn-3403af73',
    name: '3403af73',
    flag: 'CHN',
  },
  {
    id: 'chn-3411da1d',
    name: '3411da1d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1756',
    name: 'CHN-1756',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1350',
    name: 'CHN-1350',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-936',
    name: 'CHN-936',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1071',
    name: 'CHN-1071',
    flag: 'CHN',
  },
  {
    id: 'chn-jieyang',
    name: 'JIEYANG',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-699',
    name: 'CHN-699',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1301',
    name: 'CHN-1301',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1514',
    name: 'CHN-1514',
    flag: 'CHN',
  },
  {
    id: 'chn-34018879',
    name: '34018879',
    flag: 'CHN',
  },
  {
    id: 'chn-sanmenisland',
    name: 'SANMEN ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-fangcheng',
    name: 'FANGCHENG',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1543',
    name: 'CHN-1543',
    flag: 'CHN',
  },
  {
    id: 'chn-35b170b5',
    name: '35b170b5',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac7e9',
    name: '35cac7e9',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b0b',
    name: '34348b0b',
    flag: 'CHN',
  },
  {
    id: 'chn-342862d1',
    name: '342862d1',
    flag: 'CHN',
  },
  {
    id: 'chn-panjin',
    name: 'PANJIN',
    flag: 'CHN',
  },
  {
    id: 'chn-36b3255b',
    name: '36b3255b',
    flag: 'CHN',
  },
  {
    id: 'chn-34022793',
    name: '34022793',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-614',
    name: 'CHN-614',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e5f',
    name: '35ac2e5f',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef8d',
    name: '3434ef8d',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef69',
    name: '3434ef69',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d557',
    name: '35b5d557',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-959',
    name: 'CHN-959',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1018',
    name: 'CHN-1018',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1053',
    name: 'CHN-1053',
    flag: 'CHN',
  },
  {
    id: 'chn-3401915d',
    name: '3401915d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-680',
    name: 'CHN-680',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c0d',
    name: '34352c0d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1117',
    name: 'CHN-1117',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2462',
    name: 'CHN-2462',
    flag: 'CHN',
  },
  {
    id: 'chn-340180a3',
    name: '340180a3',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9fb3',
    name: '342e9fb3',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e7f',
    name: '35ac2e7f',
    flag: 'CHN',
  },
  {
    id: 'chn-34352b85',
    name: '34352b85',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc53',
    name: '35cacc53',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-376',
    name: 'CHN-376',
    flag: 'CHN',
  },
  {
    id: 'chn-35b17473',
    name: '35b17473',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac983',
    name: '35cac983',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1fb9',
    name: '342c1fb9',
    flag: 'CHN',
  },
  {
    id: 'chn-rizhao',
    name: 'RIZHAO',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9eb9',
    name: '342e9eb9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b28c15',
    name: '35b28c15',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-568',
    name: 'CHN-568',
    flag: 'CHN',
  },
  {
    id: 'chn-binhai',
    name: 'BINHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-3401889b',
    name: '3401889b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2466',
    name: 'CHN-2466',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1850',
    name: 'CHN-1850',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b52f',
    name: '3403b52f',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac763',
    name: '35cac763',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca90eb',
    name: '35ca90eb',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-756',
    name: 'CHN-756',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2490',
    name: 'CHN-2490',
    flag: 'CHN',
  },
  {
    id: 'chn-35b9245f',
    name: '35b9245f',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd73',
    name: '3434dd73',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2529',
    name: 'CHN-2529',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-947',
    name: 'CHN-947',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1815',
    name: 'CHN-1815',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-395',
    name: 'CHN-395',
    flag: 'CHN',
  },
  {
    id: 'chn-wenzhou',
    name: 'WENZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-555',
    name: 'CHN-555',
    flag: 'CHN',
  },
  {
    id: 'chn-35caba75',
    name: '35caba75',
    flag: 'CHN',
  },
  {
    id: 'chn-34287b8b',
    name: '34287b8b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2557',
    name: 'CHN-2557',
    flag: 'CHN',
  },
  {
    id: 'chn-340307c1',
    name: '340307c1',
    flag: 'CHN',
  },
  {
    id: 'chn-ningbo',
    name: 'NINGBO',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1770',
    name: 'CHN-1770',
    flag: 'CHN',
  },
  {
    id: 'chn-340181a5',
    name: '340181a5',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad98e9',
    name: '35ad98e9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f099',
    name: '35b5f099',
    flag: 'CHN',
  },
  {
    id: 'chn-34030797',
    name: '34030797',
    flag: 'CHN',
  },
  {
    id: 'chn-340176bf',
    name: '340176bf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-610',
    name: 'CHN-610',
    flag: 'CHN',
  },
  {
    id: 'chn-34017a79',
    name: '34017a79',
    flag: 'CHN',
  },
  {
    id: 'chn-36b32fc5',
    name: '36b32fc5',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-466',
    name: 'CHN-466',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68129',
    name: '35b68129',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-810',
    name: 'CHN-810',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d799',
    name: '35b3d799',
    flag: 'CHN',
  },
  {
    id: 'chn-34287c85',
    name: '34287c85',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e789',
    name: '3434e789',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca96ed',
    name: '35ca96ed',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d23',
    name: '34352d23',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2959',
    name: '35ac2959',
    flag: 'CHN',
  },
  {
    id: 'chn-3401bda7',
    name: '3401bda7',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d07',
    name: '34352d07',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f4b3',
    name: '3434f4b3',
    flag: 'CHN',
  },
  {
    id: 'chn-3588bf6f',
    name: '3588bf6f',
    flag: 'CHN',
  },
  {
    id: 'chn-340307bf',
    name: '340307bf',
    flag: 'CHN',
  },
  {
    id: 'chn-taishanpowerplant',
    name: 'TAISHAN POWER PLANT',
    flag: 'CHN',
  },
  {
    id: 'chn-35cabf5f',
    name: '35cabf5f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69eab',
    name: '35b69eab',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-895',
    name: 'CHN-895',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69ecf',
    name: '35b69ecf',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5faa7',
    name: '35b5faa7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1286',
    name: 'CHN-1286',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1509',
    name: 'CHN-1509',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e31',
    name: '342c1e31',
    flag: 'CHN',
  },
  {
    id: 'chn-nanpaihe',
    name: 'NANPAIHE',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca6311',
    name: '35ca6311',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-607',
    name: 'CHN-607',
    flag: 'CHN',
  },
  {
    id: 'chn-34338ba7',
    name: '34338ba7',
    flag: 'CHN',
  },
  {
    id: 'chn-3434f3f3',
    name: '3434f3f3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1341',
    name: 'CHN-1341',
    flag: 'CHN',
  },
  {
    id: 'chn-35ad893b',
    name: '35ad893b',
    flag: 'CHN',
  },
  {
    id: 'chn-xingzaidao',
    name: 'XINGZAIDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1492',
    name: 'CHN-1492',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-671',
    name: 'CHN-671',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2175',
    name: 'CHN-2175',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-403',
    name: 'CHN-403',
    flag: 'CHN',
  },
  {
    id: 'chn-35b2862d',
    name: '35b2862d',
    flag: 'CHN',
  },
  {
    id: 'chn-35f2a5a1',
    name: '35f2a5a1',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc09',
    name: '35cacc09',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1002',
    name: 'CHN-1002',
    flag: 'CHN',
  },
  {
    id: 'chn-3452b6fb',
    name: '3452b6fb',
    flag: 'CHN',
  },
  {
    id: 'chn-35b91577',
    name: '35b91577',
    flag: 'CHN',
  },
  {
    id: 'chn-34338b97',
    name: '34338b97',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca8e05',
    name: '35ca8e05',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1822',
    name: 'CHN-1822',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-630',
    name: 'CHN-630',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1783',
    name: 'CHN-1783',
    flag: 'CHN',
  },
  {
    id: 'chn-34287cb9',
    name: '34287cb9',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e7d',
    name: '35ac2e7d',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac7eb',
    name: '35cac7eb',
    flag: 'CHN',
  },
  {
    id: 'chn-3403ca99',
    name: '3403ca99',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-750',
    name: 'CHN-750',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5f18f',
    name: '35b5f18f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca79e9',
    name: '35ca79e9',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d0d7',
    name: '35b5d0d7',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc2d',
    name: '3403cc2d',
    flag: 'CHN',
  },
  {
    id: 'chn-34018c3f',
    name: '34018c3f',
    flag: 'CHN',
  },
  {
    id: 'chn-342c2029',
    name: '342c2029',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b6b',
    name: '34024b6b',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9fad',
    name: '342e9fad',
    flag: 'CHN',
  },
  {
    id: 'chn-yangzhong',
    name: 'YANGZHONG',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2090',
    name: 'CHN-2090',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-649',
    name: 'CHN-649',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc33',
    name: '3403cc33',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d45d',
    name: '35b5d45d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1787',
    name: 'CHN-1787',
    flag: 'CHN',
  },
  {
    id: 'chn-34520fc3',
    name: '34520fc3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1630',
    name: 'CHN-1630',
    flag: 'CHN',
  },
  {
    id: 'chn-35b6f4e9',
    name: '35b6f4e9',
    flag: 'CHN',
  },
  {
    id: 'chn-34017aff',
    name: '34017aff',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-631',
    name: 'CHN-631',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1401',
    name: 'CHN-1401',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1030',
    name: 'CHN-1030',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-833',
    name: 'CHN-833',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-854',
    name: 'CHN-854',
    flag: 'CHN',
  },
  {
    id: 'chn-3403b53f',
    name: '3403b53f',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d3d',
    name: '34352d3d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-867',
    name: 'CHN-867',
    flag: 'CHN',
  },
  {
    id: 'chn-3683759b',
    name: '3683759b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-640',
    name: 'CHN-640',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68891',
    name: '35b68891',
    flag: 'CHN',
  },
  {
    id: 'chn-3403cc4f',
    name: '3403cc4f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-883',
    name: 'CHN-883',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d739',
    name: '35b3d739',
    flag: 'CHN',
  },
  {
    id: 'chn-35b14329',
    name: '35b14329',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-744',
    name: 'CHN-744',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d6e7',
    name: '35b3d6e7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1836',
    name: 'CHN-1836',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca7763',
    name: '35ca7763',
    flag: 'CHN',
  },
  {
    id: 'chn-34287c75',
    name: '34287c75',
    flag: 'CHN',
  },
  {
    id: 'chn-34024b77',
    name: '34024b77',
    flag: 'CHN',
  },
  {
    id: 'chn-34527d7b',
    name: '34527d7b',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca91ef',
    name: '35ca91ef',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1534',
    name: 'CHN-1534',
    flag: 'CHN',
  },
  {
    id: 'chn-35b287a1',
    name: '35b287a1',
    flag: 'CHN',
  },
  {
    id: 'chn-35b226e7',
    name: '35b226e7',
    flag: 'CHN',
  },
  {
    id: 'chn-35b27a55',
    name: '35b27a55',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1973',
    name: 'CHN-1973',
    flag: 'CHN',
  },
  {
    id: 'chn-340229cf',
    name: '340229cf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2078',
    name: 'CHN-2078',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1814',
    name: 'CHN-1814',
    flag: 'CHN',
  },
  {
    id: 'chn-3411da19',
    name: '3411da19',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2179',
    name: 'CHN-2179',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-138',
    name: 'CHN-138',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae0429',
    name: '35ae0429',
    flag: 'CHN',
  },
  {
    id: 'chn-35ae0681',
    name: '35ae0681',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-869',
    name: 'CHN-869',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1426',
    name: 'CHN-1426',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-795',
    name: 'CHN-795',
    flag: 'CHN',
  },
  {
    id: 'chn-3434faa9',
    name: '3434faa9',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-255',
    name: 'CHN-255',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a71d',
    name: '3403a71d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1488',
    name: 'CHN-1488',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-300',
    name: 'CHN-300',
    flag: 'CHN',
  },
  {
    id: 'chn-34338bb9',
    name: '34338bb9',
    flag: 'CHN',
  },
  {
    id: 'chn-342862c3',
    name: '342862c3',
    flag: 'CHN',
  },
  {
    id: 'chn-343475b3',
    name: '343475b3',
    flag: 'CHN',
  },
  {
    id: 'chn-3434efd9',
    name: '3434efd9',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1e1b',
    name: '342c1e1b',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2602',
    name: 'CHN-2602',
    flag: 'CHN',
  },
  {
    id: 'chn-314e6a0b',
    name: '314e6a0b',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef5f',
    name: '3434ef5f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-277',
    name: 'CHN-277',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2467',
    name: 'CHN-2467',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1339',
    name: 'CHN-1339',
    flag: 'CHN',
  },
  {
    id: 'chn-35b1746d',
    name: '35b1746d',
    flag: 'CHN',
  },
  {
    id: 'chn-35cacc4f',
    name: '35cacc4f',
    flag: 'CHN',
  },
  {
    id: 'chn-34352c55',
    name: '34352c55',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d73f',
    name: '35b3d73f',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1834',
    name: 'CHN-1834',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d11',
    name: '34352d11',
    flag: 'CHN',
  },
  {
    id: 'chn-34352d21',
    name: '34352d21',
    flag: 'CHN',
  },
  {
    id: 'chn-344d891b',
    name: '344d891b',
    flag: 'CHN',
  },
  {
    id: 'chn-34348b0f',
    name: '34348b0f',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e557',
    name: '3434e557',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d55b',
    name: '35b5d55b',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca905f',
    name: '35ca905f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ac2e81',
    name: '35ac2e81',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca62e1',
    name: '35ca62e1',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2418',
    name: 'CHN-2418',
    flag: 'CHN',
  },
  {
    id: 'chn-340176a9',
    name: '340176a9',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac767',
    name: '35cac767',
    flag: 'CHN',
  },
  {
    id: 'chn-35b69c03',
    name: '35b69c03',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-796',
    name: 'CHN-796',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1655',
    name: 'CHN-1655',
    flag: 'CHN',
  },
  {
    id: 'chn-3411da07',
    name: '3411da07',
    flag: 'CHN',
  },
  {
    id: 'chn-34018dcf',
    name: '34018dcf',
    flag: 'CHN',
  },
  {
    id: 'chn-342c1f97',
    name: '342c1f97',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-366',
    name: 'CHN-366',
    flag: 'CHN',
  },
  {
    id: 'chn-3434ef45',
    name: '3434ef45',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2361',
    name: 'CHN-2361',
    flag: 'CHN',
  },
  {
    id: 'chn-3402497f',
    name: '3402497f',
    flag: 'CHN',
  },
  {
    id: 'chn-35b5d74b',
    name: '35b5d74b',
    flag: 'CHN',
  },
  {
    id: 'chn-342e9ea7',
    name: '342e9ea7',
    flag: 'CHN',
  },
  {
    id: 'chn-34018e2d',
    name: '34018e2d',
    flag: 'CHN',
  },
  {
    id: 'chn-340176af',
    name: '340176af',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac779',
    name: '35cac779',
    flag: 'CHN',
  },
  {
    id: 'chn-34293545',
    name: '34293545',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-172',
    name: 'CHN-172',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1799',
    name: 'CHN-1799',
    flag: 'CHN',
  },
  {
    id: 'chn-34338bbf',
    name: '34338bbf',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2097',
    name: 'CHN-2097',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-714',
    name: 'CHN-714',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2257',
    name: 'CHN-2257',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-627',
    name: 'CHN-627',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-342',
    name: 'CHN-342',
    flag: 'CHN',
  },
  {
    id: 'chn-3596112b',
    name: '3596112b',
    flag: 'CHN',
  },
  {
    id: 'chn-3434e799',
    name: '3434e799',
    flag: 'CHN',
  },
  {
    id: 'chn-35b3d767',
    name: '35b3d767',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1020',
    name: 'CHN-1020',
    flag: 'CHN',
  },
  {
    id: 'chn-35b68963',
    name: '35b68963',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-681',
    name: 'CHN-681',
    flag: 'CHN',
  },
  {
    id: 'chn-34018f6d',
    name: '34018f6d',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1589',
    name: 'CHN-1589',
    flag: 'CHN',
  },
  {
    id: 'chn-36b32e39',
    name: '36b32e39',
    flag: 'CHN',
  },
  {
    id: 'chn-sz361field',
    name: 'SZ361 FIELD',
    flag: 'CHN',
  },
  {
    id: 'chn-3427c249',
    name: '3427c249',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1686',
    name: 'CHN-1686',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1432',
    name: 'CHN-1432',
    flag: 'CHN',
  },
  {
    id: 'chn-35cac7c3',
    name: '35cac7c3',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1439',
    name: 'CHN-1439',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2082',
    name: 'CHN-2082',
    flag: 'CHN',
  },
  {
    id: 'chn-342e6aa7',
    name: '342e6aa7',
    flag: 'CHN',
  },
  {
    id: 'chn-3403a66f',
    name: '3403a66f',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca90c7',
    name: '35ca90c7',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1386',
    name: 'CHN-1386',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1264',
    name: 'CHN-1264',
    flag: 'CHN',
  },
  {
    id: 'chn-35ca9029',
    name: '35ca9029',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2128',
    name: 'CHN-2128',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-1096',
    name: 'CHN-1096',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2262',
    name: 'CHN-2262',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-2062',
    name: 'CHN-2062',
    flag: 'CHN',
  },
  {
    id: 'chn-chn-974',
    name: 'CHN-974',
    flag: 'CHN',
  },
  {
    id: 'chn-36b32e49',
    name: '36b32e49',
    flag: 'CHN',
  },
  {
    id: 'chn-3434dd17',
    name: '3434dd17',
    flag: 'CHN',
  },
  {
    id: 'chn-3446c58f',
    name: '3446c58f',
    flag: 'CHN',
  },
  {
    id: 'deu-deu-262',
    name: 'DEU-262',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-492',
    name: 'DEU-492',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-194',
    name: 'DEU-194',
    flag: 'DEU',
  },
  {
    id: 'deu-gromitz',
    name: 'GROMITZ',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-554',
    name: 'DEU-554',
    flag: 'DEU',
  },
  {
    id: 'deu-badessen',
    name: 'BAD ESSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-466',
    name: 'DEU-466',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-647',
    name: 'DEU-647',
    flag: 'DEU',
  },
  {
    id: 'deu-atting',
    name: 'ATTING',
    flag: 'DEU',
  },
  {
    id: 'deu-muhlheimammain',
    name: 'MUHLHEIM AM MAIN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-296',
    name: 'DEU-296',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-542',
    name: 'DEU-542',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-664',
    name: 'DEU-664',
    flag: 'DEU',
  },
  {
    id: 'deu-bremen',
    name: 'BREMEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-161',
    name: 'DEU-161',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-423',
    name: 'DEU-423',
    flag: 'DEU',
  },
  {
    id: 'deu-passau',
    name: 'PASSAU',
    flag: 'DEU',
  },
  {
    id: 'deu-starkenburg',
    name: 'STARKENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-porzamrhein',
    name: 'PORZ AM RHEIN',
    flag: 'DEU',
  },
  {
    id: 'deu-lubeck-travemunde',
    name: 'LUBECK-TRAVEMUNDE',
    flag: 'DEU',
  },
  {
    id: 'deu-saal',
    name: 'SAAL',
    flag: 'DEU',
  },
  {
    id: 'deu-neuwied',
    name: 'NEUWIED',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-595',
    name: 'DEU-595',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-347',
    name: 'DEU-347',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-239',
    name: 'DEU-239',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-143',
    name: 'DEU-143',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-326',
    name: 'DEU-326',
    flag: 'DEU',
  },
  {
    id: 'deu-wismar',
    name: 'WISMAR',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-126',
    name: 'DEU-126',
    flag: 'DEU',
  },
  {
    id: 'deu-altenholz',
    name: 'ALTENHOLZ',
    flag: 'DEU',
  },
  {
    id: 'deu-breisachamrhein',
    name: 'BREISACH AM RHEIN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-166',
    name: 'DEU-166',
    flag: 'DEU',
  },
  {
    id: 'deu-bramsche',
    name: 'BRAMSCHE',
    flag: 'DEU',
  },
  {
    id: 'deu-rummelsburg',
    name: 'RUMMELSBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-calberlah',
    name: 'CALBERLAH',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-559',
    name: 'DEU-559',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-90',
    name: 'DEU-90',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-468',
    name: 'DEU-468',
    flag: 'DEU',
  },
  {
    id: 'deu-lingen',
    name: 'LINGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-elsfleth',
    name: 'ELSFLETH',
    flag: 'DEU',
  },
  {
    id: 'deu-frankfurtammain',
    name: 'FRANKFURT AM MAIN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-293',
    name: 'DEU-293',
    flag: 'DEU',
  },
  {
    id: 'deu-emden',
    name: 'EMDEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-325',
    name: 'DEU-325',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-147',
    name: 'DEU-147',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-137',
    name: 'DEU-137',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-404',
    name: 'DEU-404',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-259',
    name: 'DEU-259',
    flag: 'DEU',
  },
  {
    id: 'deu-norddeich',
    name: 'NORDDEICH',
    flag: 'DEU',
  },
  {
    id: 'deu-brunsbuttelcanalterminals',
    name: 'BRUNSBUTTEL CANAL TERMINALS',
    flag: 'DEU',
  },
  {
    id: 'deu-wesel',
    name: 'WESEL',
    flag: 'DEU',
  },
  {
    id: 'deu-bottrop',
    name: 'BOTTROP',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-556',
    name: 'DEU-556',
    flag: 'DEU',
  },
  {
    id: 'deu-hallstadt',
    name: 'HALLSTADT',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-287',
    name: 'DEU-287',
    flag: 'DEU',
  },
  {
    id: 'deu-kappeln',
    name: 'KAPPELN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-182',
    name: 'DEU-182',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-251',
    name: 'DEU-251',
    flag: 'DEU',
  },
  {
    id: 'deu-nierstein',
    name: 'NIERSTEIN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-159',
    name: 'DEU-159',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-409',
    name: 'DEU-409',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-252',
    name: 'DEU-252',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-279',
    name: 'DEU-279',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-339',
    name: 'DEU-339',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-364',
    name: 'DEU-364',
    flag: 'DEU',
  },
  {
    id: 'deu-grunau',
    name: 'GRUNAU',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-153',
    name: 'DEU-153',
    flag: 'DEU',
  },
  {
    id: 'deu-sassnitz',
    name: 'SASSNITZ',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-472',
    name: 'DEU-472',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-109',
    name: 'DEU-109',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-372',
    name: 'DEU-372',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-57',
    name: 'DEU-57',
    flag: 'DEU',
  },
  {
    id: 'deu-dolwinalphaplatform',
    name: 'DOLWIN ALPHA PLATFORM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-526',
    name: 'DEU-526',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-175',
    name: 'DEU-175',
    flag: 'DEU',
  },
  {
    id: 'deu-karlshagen',
    name: 'KARLSHAGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-25',
    name: 'DEU-25',
    flag: 'DEU',
  },
  {
    id: 'deu-tegernheim',
    name: 'TEGERNHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-405',
    name: 'DEU-405',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-359',
    name: 'DEU-359',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-624',
    name: 'DEU-624',
    flag: 'DEU',
  },
  {
    id: 'deu-heikendorf',
    name: 'HEIKENDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-288',
    name: 'DEU-288',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-49',
    name: 'DEU-49',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-40',
    name: 'DEU-40',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-482',
    name: 'DEU-482',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-171',
    name: 'DEU-171',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-420',
    name: 'DEU-420',
    flag: 'DEU',
  },
  {
    id: 'deu-ginsheim-gustavsburg',
    name: 'GINSHEIM-GUSTAVSBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-dusseldorf',
    name: 'DUSSELDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-borkum',
    name: 'BORKUM',
    flag: 'DEU',
  },
  {
    id: 'deu-fresenburg',
    name: 'FRESENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-489',
    name: 'DEU-489',
    flag: 'DEU',
  },
  {
    id: 'deu-busum',
    name: 'BUSUM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-231',
    name: 'DEU-231',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-191',
    name: 'DEU-191',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-277',
    name: 'DEU-277',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-661',
    name: 'DEU-661',
    flag: 'DEU',
  },
  {
    id: 'deu-hanauammain',
    name: 'HANAU AM MAIN',
    flag: 'DEU',
  },
  {
    id: 'deu-sanktgoar',
    name: 'SANKT GOAR',
    flag: 'DEU',
  },
  {
    id: 'deu-wolfsburg',
    name: 'WOLFSBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-lahnstein',
    name: 'LAHNSTEIN',
    flag: 'DEU',
  },
  {
    id: 'deu-bleckede',
    name: 'BLECKEDE',
    flag: 'DEU',
  },
  {
    id: 'deu-gelting',
    name: 'GELTING',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-421',
    name: 'DEU-421',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-61',
    name: 'DEU-61',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-98',
    name: 'DEU-98',
    flag: 'DEU',
  },
  {
    id: 'deu-emmendorf',
    name: 'EMMENDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-biederitz',
    name: 'BIEDERITZ',
    flag: 'DEU',
  },
  {
    id: 'deu-mannheim',
    name: 'MANNHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-342',
    name: 'DEU-342',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-561',
    name: 'DEU-561',
    flag: 'DEU',
  },
  {
    id: 'deu-kaltenengers',
    name: 'KALTENENGERS',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-588',
    name: 'DEU-588',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-245',
    name: 'DEU-245',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-387',
    name: 'DEU-387',
    flag: 'DEU',
  },
  {
    id: 'deu-neckarsulm',
    name: 'NECKARSULM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-503',
    name: 'DEU-503',
    flag: 'DEU',
  },
  {
    id: 'deu-badbevensen',
    name: 'BAD BEVENSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-442',
    name: 'DEU-442',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-477',
    name: 'DEU-477',
    flag: 'DEU',
  },
  {
    id: 'deu-wolgast',
    name: 'WOLGAST',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-518',
    name: 'DEU-518',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-226',
    name: 'DEU-226',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-523',
    name: 'DEU-523',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-205',
    name: 'DEU-205',
    flag: 'DEU',
  },
  {
    id: 'deu-konigswusterhausen',
    name: 'KONIGS WUSTERHAUSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-dorumerneufeld',
    name: 'DORUMER NEUFELD',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-424',
    name: 'DEU-424',
    flag: 'DEU',
  },
  {
    id: 'deu-weener',
    name: 'WEENER',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-451',
    name: 'DEU-451',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-470',
    name: 'DEU-470',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-575',
    name: 'DEU-575',
    flag: 'DEU',
  },
  {
    id: 'deu-lauenburg',
    name: 'LAUENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-151',
    name: 'DEU-151',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-295',
    name: 'DEU-295',
    flag: 'DEU',
  },
  {
    id: 'deu-dusseldorf-pempelfort',
    name: 'DUSSELDORF-PEMPELFORT',
    flag: 'DEU',
  },
  {
    id: 'deu-bischofsheim',
    name: 'BISCHOFSHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-568',
    name: 'DEU-568',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-464',
    name: 'DEU-464',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-397',
    name: 'DEU-397',
    flag: 'DEU',
  },
  {
    id: 'deu-helgoland',
    name: 'HELGOLAND',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-499',
    name: 'DEU-499',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-244',
    name: 'DEU-244',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-233',
    name: 'DEU-233',
    flag: 'DEU',
  },
  {
    id: 'deu-patersberg',
    name: 'PATERSBERG',
    flag: 'DEU',
  },
  {
    id: 'deu-bulstringen',
    name: 'BULSTRINGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-bergkamen',
    name: 'BERGKAMEN',
    flag: 'DEU',
  },
  {
    id: 'deu-nordenham',
    name: 'NORDENHAM',
    flag: 'DEU',
  },
  {
    id: 'deu-straubing',
    name: 'STRAUBING',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-393',
    name: 'DEU-393',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-475',
    name: 'DEU-475',
    flag: 'DEU',
  },
  {
    id: 'deu-berlintreptow',
    name: 'BERLIN TREPTOW',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-394',
    name: 'DEU-394',
    flag: 'DEU',
  },
  {
    id: 'deu-otterndorf',
    name: 'OTTERNDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-355',
    name: 'DEU-355',
    flag: 'DEU',
  },
  {
    id: 'deu-stolzenau',
    name: 'STOLZENAU',
    flag: 'DEU',
  },
  {
    id: 'deu-hamm',
    name: 'HAMM',
    flag: 'DEU',
  },
  {
    id: 'deu-hamburg',
    name: 'HAMBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-235',
    name: 'DEU-235',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-598',
    name: 'DEU-598',
    flag: 'DEU',
  },
  {
    id: 'deu-neustadt',
    name: 'NEUSTADT',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-456',
    name: 'DEU-456',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-189',
    name: 'DEU-189',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-533',
    name: 'DEU-533',
    flag: 'DEU',
  },
  {
    id: 'deu-maasholm',
    name: 'MAASHOLM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-649',
    name: 'DEU-649',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-66',
    name: 'DEU-66',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-616',
    name: 'DEU-616',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-208',
    name: 'DEU-208',
    flag: 'DEU',
  },
  {
    id: 'deu-wesseling',
    name: 'WESSELING',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-435',
    name: 'DEU-435',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-300',
    name: 'DEU-300',
    flag: 'DEU',
  },
  {
    id: 'deu-papenburg',
    name: 'PAPENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-nienhagen',
    name: 'NIENHAGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-tempelhof',
    name: 'TEMPELHOF',
    flag: 'DEU',
  },
  {
    id: 'deu-wilhelmshaven',
    name: 'WILHELMSHAVEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-357',
    name: 'DEU-357',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-149',
    name: 'DEU-149',
    flag: 'DEU',
  },
  {
    id: 'deu-borsfleth',
    name: 'BORSFLETH',
    flag: 'DEU',
  },
  {
    id: 'deu-edingen-neckarhausen',
    name: 'EDINGEN-NECKARHAUSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-281',
    name: 'DEU-281',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-562',
    name: 'DEU-562',
    flag: 'DEU',
  },
  {
    id: 'deu-kleinostheim',
    name: 'KLEINOSTHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-229',
    name: 'DEU-229',
    flag: 'DEU',
  },
  {
    id: 'deu-bremerhaven',
    name: 'BREMERHAVEN',
    flag: 'DEU',
  },
  {
    id: 'deu-rheinbreitbach',
    name: 'RHEINBREITBACH',
    flag: 'DEU',
  },
  {
    id: 'deu-rudesheimamrhein',
    name: 'RUDESHEIM AM RHEIN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-299',
    name: 'DEU-299',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-237',
    name: 'DEU-237',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-494',
    name: 'DEU-494',
    flag: 'DEU',
  },
  {
    id: 'deu-minden',
    name: 'MINDEN',
    flag: 'DEU',
  },
  {
    id: 'deu-dorfprozelten',
    name: 'DORFPROZELTEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-133',
    name: 'DEU-133',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-461',
    name: 'DEU-461',
    flag: 'DEU',
  },
  {
    id: 'deu-neuharlingersiel',
    name: 'NEUHARLINGERSIEL',
    flag: 'DEU',
  },
  {
    id: 'deu-ilvesheim',
    name: 'ILVESHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-493',
    name: 'DEU-493',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-274',
    name: 'DEU-274',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-508',
    name: 'DEU-508',
    flag: 'DEU',
  },
  {
    id: 'deu-barth',
    name: 'BARTH',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-540',
    name: 'DEU-540',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-488',
    name: 'DEU-488',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-30',
    name: 'DEU-30',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-654',
    name: 'DEU-654',
    flag: 'DEU',
  },
  {
    id: 'deu-mitte',
    name: 'MITTE',
    flag: 'DEU',
  },
  {
    id: 'deu-niederrad',
    name: 'NIEDERRAD',
    flag: 'DEU',
  },
  {
    id: 'deu-kehl',
    name: 'KEHL',
    flag: 'DEU',
  },
  {
    id: 'deu-kalkar',
    name: 'KALKAR',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-271',
    name: 'DEU-271',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-491',
    name: 'DEU-491',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-285',
    name: 'DEU-285',
    flag: 'DEU',
  },
  {
    id: 'deu-warnemunde',
    name: 'WARNEMUNDE',
    flag: 'DEU',
  },
  {
    id: 'deu-marl',
    name: 'MARL',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-158',
    name: 'DEU-158',
    flag: 'DEU',
  },
  {
    id: 'deu-rostock',
    name: 'ROSTOCK',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-434',
    name: 'DEU-434',
    flag: 'DEU',
  },
  {
    id: 'deu-norderney',
    name: 'NORDERNEY',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-176',
    name: 'DEU-176',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-594',
    name: 'DEU-594',
    flag: 'DEU',
  },
  {
    id: 'deu-grenzach-wyhlen',
    name: 'GRENZACH-WYHLEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-547',
    name: 'DEU-547',
    flag: 'DEU',
  },
  {
    id: 'deu-freesendorf',
    name: 'FREESENDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-190',
    name: 'DEU-190',
    flag: 'DEU',
  },
  {
    id: 'deu-rheinau',
    name: 'RHEINAU',
    flag: 'DEU',
  },
  {
    id: 'deu-lubbecke',
    name: 'LUBBECKE',
    flag: 'DEU',
  },
  {
    id: 'deu-lubeck',
    name: 'LUBECK',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-336',
    name: 'DEU-336',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-150',
    name: 'DEU-150',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-349',
    name: 'DEU-349',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-163',
    name: 'DEU-163',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-549',
    name: 'DEU-549',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-289',
    name: 'DEU-289',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-398',
    name: 'DEU-398',
    flag: 'DEU',
  },
  {
    id: 'deu-berlinkopenick',
    name: 'BERLIN KOPENICK',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-243',
    name: 'DEU-243',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-334',
    name: 'DEU-334',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-531',
    name: 'DEU-531',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-123',
    name: 'DEU-123',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-127',
    name: 'DEU-127',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-157',
    name: 'DEU-157',
    flag: 'DEU',
  },
  {
    id: 'deu-herne',
    name: 'HERNE',
    flag: 'DEU',
  },
  {
    id: 'deu-kelsterbach',
    name: 'KELSTERBACH',
    flag: 'DEU',
  },
  {
    id: 'deu-rheinbrohl',
    name: 'RHEINBROHL',
    flag: 'DEU',
  },
  {
    id: 'deu-heilbronn',
    name: 'HEILBRONN',
    flag: 'DEU',
  },
  {
    id: 'deu-hausen',
    name: 'HAUSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-448',
    name: 'DEU-448',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-611',
    name: 'DEU-611',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-223',
    name: 'DEU-223',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-633',
    name: 'DEU-633',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-579',
    name: 'DEU-579',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-476',
    name: 'DEU-476',
    flag: 'DEU',
  },
  {
    id: 'deu-altstadtsud',
    name: 'ALTSTADT SUD',
    flag: 'DEU',
  },
  {
    id: 'deu-stockstadtammain',
    name: 'STOCKSTADT AM MAIN',
    flag: 'DEU',
  },
  {
    id: 'deu-grodersby',
    name: 'GRODERSBY',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-589',
    name: 'DEU-589',
    flag: 'DEU',
  },
  {
    id: 'deu-tangermunde',
    name: 'TANGERMUNDE',
    flag: 'DEU',
  },
  {
    id: 'deu-wustermark',
    name: 'WUSTERMARK',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-178',
    name: 'DEU-178',
    flag: 'DEU',
  },
  {
    id: 'deu-beidenfleth',
    name: 'BEIDENFLETH',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-504',
    name: 'DEU-504',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-666',
    name: 'DEU-666',
    flag: 'DEU',
  },
  {
    id: 'deu-regensburg',
    name: 'REGENSBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-501',
    name: 'DEU-501',
    flag: 'DEU',
  },
  {
    id: 'deu-urbar',
    name: 'URBAR',
    flag: 'DEU',
  },
  {
    id: 'deu-stein',
    name: 'STEIN',
    flag: 'DEU',
  },
  {
    id: 'deu-sanktsebastian',
    name: 'SANKT SEBASTIAN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-455',
    name: 'DEU-455',
    flag: 'DEU',
  },
  {
    id: 'deu-stralsund',
    name: 'STRALSUND',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-603',
    name: 'DEU-603',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-298',
    name: 'DEU-298',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-585',
    name: 'DEU-585',
    flag: 'DEU',
  },
  {
    id: 'deu-mainz',
    name: 'MAINZ',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-648',
    name: 'DEU-648',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-516',
    name: 'DEU-516',
    flag: 'DEU',
  },
  {
    id: 'deu-grosskrotzenburg',
    name: 'GROSSKROTZENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-bernkastel-kues',
    name: 'BERNKASTEL-KUES',
    flag: 'DEU',
  },
  {
    id: 'deu-emmerich',
    name: 'EMMERICH',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-555',
    name: 'DEU-555',
    flag: 'DEU',
  },
  {
    id: 'deu-mulheim',
    name: 'MULHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-601',
    name: 'DEU-601',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-230',
    name: 'DEU-230',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-389',
    name: 'DEU-389',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-577',
    name: 'DEU-577',
    flag: 'DEU',
  },
  {
    id: 'deu-neuss',
    name: 'NEUSS',
    flag: 'DEU',
  },
  {
    id: 'deu-wiek',
    name: 'WIEK',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-348',
    name: 'DEU-348',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-658',
    name: 'DEU-658',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-519',
    name: 'DEU-519',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-593',
    name: 'DEU-593',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-573',
    name: 'DEU-573',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-59',
    name: 'DEU-59',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-517',
    name: 'DEU-517',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-278',
    name: 'DEU-278',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-14',
    name: 'DEU-14',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-551',
    name: 'DEU-551',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-422',
    name: 'DEU-422',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-653',
    name: 'DEU-653',
    flag: 'DEU',
  },
  {
    id: 'deu-tonning',
    name: 'TONNING',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-96',
    name: 'DEU-96',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-495',
    name: 'DEU-495',
    flag: 'DEU',
  },
  {
    id: 'deu-gatow',
    name: 'GATOW',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-321',
    name: 'DEU-321',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-512',
    name: 'DEU-512',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-444',
    name: 'DEU-444',
    flag: 'DEU',
  },
  {
    id: 'deu-rudow',
    name: 'RUDOW',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-546',
    name: 'DEU-546',
    flag: 'DEU',
  },
  {
    id: 'deu-tiergarten',
    name: 'TIERGARTEN',
    flag: 'DEU',
  },
  {
    id: 'deu-voerde',
    name: 'VOERDE',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-646',
    name: 'DEU-646',
    flag: 'DEU',
  },
  {
    id: 'deu-geesthacht',
    name: 'GEESTHACHT',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-211',
    name: 'DEU-211',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-186',
    name: 'DEU-186',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-613',
    name: 'DEU-613',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-478',
    name: 'DEU-478',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-535',
    name: 'DEU-535',
    flag: 'DEU',
  },
  {
    id: 'deu-sanktgoarshausen',
    name: 'SANKT GOARSHAUSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-667',
    name: 'DEU-667',
    flag: 'DEU',
  },
  {
    id: 'deu-plochingen',
    name: 'PLOCHINGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-80',
    name: 'DEU-80',
    flag: 'DEU',
  },
  {
    id: 'deu-dorsten',
    name: 'DORSTEN',
    flag: 'DEU',
  },
  {
    id: 'deu-kiel',
    name: 'KIEL',
    flag: 'DEU',
  },
  {
    id: 'deu-brunsbuttelelbahafen',
    name: 'BRUNSBUTTEL ELBAHAFEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-311',
    name: 'DEU-311',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-396',
    name: 'DEU-396',
    flag: 'DEU',
  },
  {
    id: 'deu-weissenthurm',
    name: 'WEISSENTHURM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-60',
    name: 'DEU-60',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-626',
    name: 'DEU-626',
    flag: 'DEU',
  },
  {
    id: 'deu-tegel',
    name: 'TEGEL',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-663',
    name: 'DEU-663',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-485',
    name: 'DEU-485',
    flag: 'DEU',
  },
  {
    id: 'deu-gelsenkirchen',
    name: 'GELSENKIRCHEN',
    flag: 'DEU',
  },
  {
    id: 'deu-niederschoneweide',
    name: 'NIEDERSCHONEWEIDE',
    flag: 'DEU',
  },
  {
    id: 'deu-zingst',
    name: 'ZINGST',
    flag: 'DEU',
  },
  {
    id: 'deu-oberwesel',
    name: 'OBERWESEL',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-264',
    name: 'DEU-264',
    flag: 'DEU',
  },
  {
    id: 'deu-hunderdorf',
    name: 'HUNDERDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-604',
    name: 'DEU-604',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-552',
    name: 'DEU-552',
    flag: 'DEU',
  },
  {
    id: 'deu-spelle',
    name: 'SPELLE',
    flag: 'DEU',
  },
  {
    id: 'deu-munster',
    name: 'MUNSTER',
    flag: 'DEU',
  },
  {
    id: 'deu-worms',
    name: 'WORMS',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-91',
    name: 'DEU-91',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-625',
    name: 'DEU-625',
    flag: 'DEU',
  },
  {
    id: 'deu-haren',
    name: 'HAREN',
    flag: 'DEU',
  },
  {
    id: 'deu-glowe',
    name: 'GLOWE',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-415',
    name: 'DEU-415',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-276',
    name: 'DEU-276',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-370',
    name: 'DEU-370',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-553',
    name: 'DEU-553',
    flag: 'DEU',
  },
  {
    id: 'deu-hakenfelde',
    name: 'HAKENFELDE',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-597',
    name: 'DEU-597',
    flag: 'DEU',
  },
  {
    id: 'deu-schleswig',
    name: 'SCHLESWIG',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-433',
    name: 'DEU-433',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-467',
    name: 'DEU-467',
    flag: 'DEU',
  },
  {
    id: 'deu-buchhorst',
    name: 'BUCHHORST',
    flag: 'DEU',
  },
  {
    id: 'deu-hunxe',
    name: 'HUNXE',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-174',
    name: 'DEU-174',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-266',
    name: 'DEU-266',
    flag: 'DEU',
  },
  {
    id: 'deu-list',
    name: 'LIST',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-165',
    name: 'DEU-165',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-338',
    name: 'DEU-338',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-571',
    name: 'DEU-571',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-416',
    name: 'DEU-416',
    flag: 'DEU',
  },
  {
    id: 'deu-schweinfurt',
    name: 'SCHWEINFURT',
    flag: 'DEU',
  },
  {
    id: 'deu-strande',
    name: 'STRANDE',
    flag: 'DEU',
  },
  {
    id: 'deu-ladbergen',
    name: 'LADBERGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-monkeberg',
    name: 'MONKEBERG',
    flag: 'DEU',
  },
  {
    id: 'deu-strullendorf',
    name: 'STRULLENDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-dortmund',
    name: 'DORTMUND',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-514',
    name: 'DEU-514',
    flag: 'DEU',
  },
  {
    id: 'deu-leverkusen',
    name: 'LEVERKUSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-543',
    name: 'DEU-543',
    flag: 'DEU',
  },
  {
    id: 'deu-hammerbrook',
    name: 'HAMMERBROOK',
    flag: 'DEU',
  },
  {
    id: 'deu-husum',
    name: 'HUSUM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-651',
    name: 'DEU-651',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-286',
    name: 'DEU-286',
    flag: 'DEU',
  },
  {
    id: 'deu-heiligenhafen',
    name: 'HEILIGENHAFEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-564',
    name: 'DEU-564',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-662',
    name: 'DEU-662',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-na',
    name: 'DEU-NA',
    flag: 'DEU',
  },
  {
    id: 'deu-niedernberg',
    name: 'NIEDERNBERG',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-652',
    name: 'DEU-652',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-383',
    name: 'DEU-383',
    flag: 'DEU',
  },
  {
    id: 'deu-enkirch',
    name: 'ENKIRCH',
    flag: 'DEU',
  },
  {
    id: 'deu-juist',
    name: 'JUIST',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-401',
    name: 'DEU-401',
    flag: 'DEU',
  },
  {
    id: 'deu-rees',
    name: 'REES',
    flag: 'DEU',
  },
  {
    id: 'deu-riehl',
    name: 'RIEHL',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-483',
    name: 'DEU-483',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-521',
    name: 'DEU-521',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-365',
    name: 'DEU-365',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-558',
    name: 'DEU-558',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-580',
    name: 'DEU-580',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-596',
    name: 'DEU-596',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-650',
    name: 'DEU-650',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-527',
    name: 'DEU-527',
    flag: 'DEU',
  },
  {
    id: 'deu-kopenick',
    name: 'KOPENICK',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-366',
    name: 'DEU-366',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-557',
    name: 'DEU-557',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-460',
    name: 'DEU-460',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-586',
    name: 'DEU-586',
    flag: 'DEU',
  },
  {
    id: 'deu-busdorf',
    name: 'BUSDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-384',
    name: 'DEU-384',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-465',
    name: 'DEU-465',
    flag: 'DEU',
  },
  {
    id: 'deu-itzehoe',
    name: 'ITZEHOE',
    flag: 'DEU',
  },
  {
    id: 'deu-altstadtnord',
    name: 'ALTSTADT NORD',
    flag: 'DEU',
  },
  {
    id: 'deu-eemshaven',
    name: 'EEMSHAVEN',
    flag: 'DEU',
  },
  {
    id: 'deu-koblenz',
    name: 'KOBLENZ',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-361',
    name: 'DEU-361',
    flag: 'DEU',
  },
  {
    id: 'deu-mariendorf',
    name: 'MARIENDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-88',
    name: 'DEU-88',
    flag: 'DEU',
  },
  {
    id: 'deu-wewelsfleth',
    name: 'WEWELSFLETH',
    flag: 'DEU',
  },
  {
    id: 'deu-grossenbrode',
    name: 'GROSSENBRODE',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-439',
    name: 'DEU-439',
    flag: 'DEU',
  },
  {
    id: 'deu-spandau',
    name: 'SPANDAU',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-144',
    name: 'DEU-144',
    flag: 'DEU',
  },
  {
    id: 'deu-cuxhaven',
    name: 'CUXHAVEN',
    flag: 'DEU',
  },
  {
    id: 'deu-bayenthal',
    name: 'BAYENTHAL',
    flag: 'DEU',
  },
  {
    id: 'deu-nienburg',
    name: 'NIENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-570',
    name: 'DEU-570',
    flag: 'DEU',
  },
  {
    id: 'deu-kleinergrasbrook',
    name: 'KLEINER GRASBROOK',
    flag: 'DEU',
  },
  {
    id: 'deu-lauterbach',
    name: 'LAUTERBACH',
    flag: 'DEU',
  },
  {
    id: 'deu-duisburg',
    name: 'DUISBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-177',
    name: 'DEU-177',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-574',
    name: 'DEU-574',
    flag: 'DEU',
  },
  {
    id: 'deu-sehnde',
    name: 'SEHNDE',
    flag: 'DEU',
  },
  {
    id: 'deu-hochdonn',
    name: 'HOCHDONN',
    flag: 'DEU',
  },
  {
    id: 'deu-haldensleben',
    name: 'HALDENSLEBEN',
    flag: 'DEU',
  },
  {
    id: 'deu-andernach',
    name: 'ANDERNACH',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-254',
    name: 'DEU-254',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-496',
    name: 'DEU-496',
    flag: 'DEU',
  },
  {
    id: 'deu-hochheimammain',
    name: 'HOCHHEIM AM MAIN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-249',
    name: 'DEU-249',
    flag: 'DEU',
  },
  {
    id: 'deu-langeoog',
    name: 'LANGEOOG',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-246',
    name: 'DEU-246',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-310',
    name: 'DEU-310',
    flag: 'DEU',
  },
  {
    id: 'deu-wrestedt',
    name: 'WRESTEDT',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-655',
    name: 'DEU-655',
    flag: 'DEU',
  },
  {
    id: 'deu-dresden',
    name: 'DRESDEN',
    flag: 'DEU',
  },
  {
    id: 'deu-charlottenburg-nord',
    name: 'CHARLOTTENBURG-NORD',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-291',
    name: 'DEU-291',
    flag: 'DEU',
  },
  {
    id: 'deu-cochem',
    name: 'COCHEM',
    flag: 'DEU',
  },
  {
    id: 'deu-sennfeld',
    name: 'SENNFELD',
    flag: 'DEU',
  },
  {
    id: 'deu-ostfildern',
    name: 'OSTFILDERN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-328',
    name: 'DEU-328',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-297',
    name: 'DEU-297',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-587',
    name: 'DEU-587',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-392',
    name: 'DEU-392',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-395',
    name: 'DEU-395',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-638',
    name: 'DEU-638',
    flag: 'DEU',
  },
  {
    id: 'deu-deggendorf',
    name: 'DEGGENDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-320',
    name: 'DEU-320',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-218',
    name: 'DEU-218',
    flag: 'DEU',
  },
  {
    id: 'deu-esslingen',
    name: 'ESSLINGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-449',
    name: 'DEU-449',
    flag: 'DEU',
  },
  {
    id: 'deu-brake',
    name: 'BRAKE',
    flag: 'DEU',
  },
  {
    id: 'deu-meerbusch',
    name: 'MEERBUSCH',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-315',
    name: 'DEU-315',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-17',
    name: 'DEU-17',
    flag: 'DEU',
  },
  {
    id: 'deu-stuttgart-ost',
    name: 'STUTTGART-OST',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-335',
    name: 'DEU-335',
    flag: 'DEU',
  },
  {
    id: 'deu-nochern',
    name: 'NOCHERN',
    flag: 'DEU',
  },
  {
    id: 'deu-gluckstadt',
    name: 'GLUCKSTADT',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-124',
    name: 'DEU-124',
    flag: 'DEU',
  },
  {
    id: 'deu-leutesdorf',
    name: 'LEUTESDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-budenheim',
    name: 'BUDENHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-potsdam',
    name: 'POTSDAM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-103',
    name: 'DEU-103',
    flag: 'DEU',
  },
  {
    id: 'deu-peine',
    name: 'PEINE',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-537',
    name: 'DEU-537',
    flag: 'DEU',
  },
  {
    id: 'deu-speyer',
    name: 'SPEYER',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-606',
    name: 'DEU-606',
    flag: 'DEU',
  },
  {
    id: 'deu-badhonnef',
    name: 'BAD HONNEF',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-578',
    name: 'DEU-578',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-567',
    name: 'DEU-567',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-368',
    name: 'DEU-368',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-487',
    name: 'DEU-487',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-307',
    name: 'DEU-307',
    flag: 'DEU',
  },
  {
    id: 'deu-moabit',
    name: 'MOABIT',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-657',
    name: 'DEU-657',
    flag: 'DEU',
  },
  {
    id: 'deu-rendsburg',
    name: 'RENDSBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-greifswald',
    name: 'GREIFSWALD',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-292',
    name: 'DEU-292',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-304',
    name: 'DEU-304',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-356',
    name: 'DEU-356',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-95',
    name: 'DEU-95',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-196',
    name: 'DEU-196',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-617',
    name: 'DEU-617',
    flag: 'DEU',
  },
  {
    id: 'deu-laboe',
    name: 'LABOE',
    flag: 'DEU',
  },
  {
    id: 'deu-baltrum',
    name: 'BALTRUM',
    flag: 'DEU',
  },
  {
    id: 'deu-oberhausen',
    name: 'OBERHAUSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-giesen',
    name: 'GIESEN',
    flag: 'DEU',
  },
  {
    id: 'deu-traben-trarbach',
    name: 'TRABEN-TRARBACH',
    flag: 'DEU',
  },
  {
    id: 'deu-dettelbach',
    name: 'DETTELBACH',
    flag: 'DEU',
  },
  {
    id: 'deu-freest',
    name: 'FREEST',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-412',
    name: 'DEU-412',
    flag: 'DEU',
  },
  {
    id: 'deu-harburg',
    name: 'HARBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-545',
    name: 'DEU-545',
    flag: 'DEU',
  },
  {
    id: 'deu-genthin',
    name: 'GENTHIN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-213',
    name: 'DEU-213',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-312',
    name: 'DEU-312',
    flag: 'DEU',
  },
  {
    id: 'deu-leer',
    name: 'LEER',
    flag: 'DEU',
  },
  {
    id: 'deu-lauffenamneckar',
    name: 'LAUFFEN AM NECKAR',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-198',
    name: 'DEU-198',
    flag: 'DEU',
  },
  {
    id: 'deu-hoya',
    name: 'HOYA',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-319',
    name: 'DEU-319',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-303',
    name: 'DEU-303',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-474',
    name: 'DEU-474',
    flag: 'DEU',
  },
  {
    id: 'deu-niederkassel',
    name: 'NIEDERKASSEL',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-560',
    name: 'DEU-560',
    flag: 'DEU',
  },
  {
    id: 'deu-rothenburgsort',
    name: 'ROTHENBURGSORT',
    flag: 'DEU',
  },
  {
    id: 'deu-kuehlungsborn',
    name: 'KUEHLUNGSBORN',
    flag: 'DEU',
  },
  {
    id: 'deu-brandenburganderhavel',
    name: 'BRANDENBURG AN DER HAVEL',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-584',
    name: 'DEU-584',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-367',
    name: 'DEU-367',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-534',
    name: 'DEU-534',
    flag: 'DEU',
  },
  {
    id: 'deu-wedding',
    name: 'WEDDING',
    flag: 'DEU',
  },
  {
    id: 'deu-bergeshoevede',
    name: 'BERGESHOEVEDE',
    flag: 'DEU',
  },
  {
    id: 'deu-datteln',
    name: 'DATTELN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-486',
    name: 'DEU-486',
    flag: 'DEU',
  },
  {
    id: 'deu-walluf',
    name: 'WALLUF',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-419',
    name: 'DEU-419',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-377',
    name: 'DEU-377',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-522',
    name: 'DEU-522',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-614',
    name: 'DEU-614',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-634',
    name: 'DEU-634',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-282',
    name: 'DEU-282',
    flag: 'DEU',
  },
  {
    id: 'deu-untereisesheim',
    name: 'UNTEREISESHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-267',
    name: 'DEU-267',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-665',
    name: 'DEU-665',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-240',
    name: 'DEU-240',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-228',
    name: 'DEU-228',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-414',
    name: 'DEU-414',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-602',
    name: 'DEU-602',
    flag: 'DEU',
  },
  {
    id: 'deu-burgauffehmarn',
    name: 'BURG AUF FEHMARN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-635',
    name: 'DEU-635',
    flag: 'DEU',
  },
  {
    id: 'deu-bonn',
    name: 'BONN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-380',
    name: 'DEU-380',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-331',
    name: 'DEU-331',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-225',
    name: 'DEU-225',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-360',
    name: 'DEU-360',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-525',
    name: 'DEU-525',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-599',
    name: 'DEU-599',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-459',
    name: 'DEU-459',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-234',
    name: 'DEU-234',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-407',
    name: 'DEU-407',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-447',
    name: 'DEU-447',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-515',
    name: 'DEU-515',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-104',
    name: 'DEU-104',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-257',
    name: 'DEU-257',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-402',
    name: 'DEU-402',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-581',
    name: 'DEU-581',
    flag: 'DEU',
  },
  {
    id: 'deu-ludwigshafenamrhein',
    name: 'LUDWIGSHAFEN AM RHEIN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-592',
    name: 'DEU-592',
    flag: 'DEU',
  },
  {
    id: 'deu-ostseebadzinnowitz',
    name: 'OSTSEEBAD ZINNOWITZ',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-618',
    name: 'DEU-618',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-432',
    name: 'DEU-432',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-193',
    name: 'DEU-193',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-363',
    name: 'DEU-363',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-576',
    name: 'DEU-576',
    flag: 'DEU',
  },
  {
    id: 'deu-schwedt',
    name: 'SCHWEDT',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-536',
    name: 'DEU-536',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-469',
    name: 'DEU-469',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-411',
    name: 'DEU-411',
    flag: 'DEU',
  },
  {
    id: 'deu-monheimamrhein',
    name: 'MONHEIM AM RHEIN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-269',
    name: 'DEU-269',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-373',
    name: 'DEU-373',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-344',
    name: 'DEU-344',
    flag: 'DEU',
  },
  {
    id: 'deu-deutz',
    name: 'DEUTZ',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-125',
    name: 'DEU-125',
    flag: 'DEU',
  },
  {
    id: 'deu-buchforst',
    name: 'BUCHFORST',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-548',
    name: 'DEU-548',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-590',
    name: 'DEU-590',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-506',
    name: 'DEU-506',
    flag: 'DEU',
  },
  {
    id: 'deu-castrop-rauxel',
    name: 'CASTROP-RAUXEL',
    flag: 'DEU',
  },
  {
    id: 'deu-hamburgwaddensea',
    name: 'HAMBURG WADDEN SEA',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-148',
    name: 'DEU-148',
    flag: 'DEU',
  },
  {
    id: 'deu-germersheim',
    name: 'GERMERSHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-bischberg',
    name: 'BISCHBERG',
    flag: 'DEU',
  },
  {
    id: 'deu-lemwerder',
    name: 'LEMWERDER',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-78',
    name: 'DEU-78',
    flag: 'DEU',
  },
  {
    id: 'deu-heidelberg',
    name: 'HEIDELBERG',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-541',
    name: 'DEU-541',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-77',
    name: 'DEU-77',
    flag: 'DEU',
  },
  {
    id: 'deu-osnabruck',
    name: 'OSNABRUCK',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-353',
    name: 'DEU-353',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-660',
    name: 'DEU-660',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-608',
    name: 'DEU-608',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-23',
    name: 'DEU-23',
    flag: 'DEU',
  },
  {
    id: 'deu-poll',
    name: 'POLL',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-440',
    name: 'DEU-440',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-322',
    name: 'DEU-322',
    flag: 'DEU',
  },
  {
    id: 'deu-bamberg',
    name: 'BAMBERG',
    flag: 'DEU',
  },
  {
    id: 'deu-niederwerth',
    name: 'NIEDERWERTH',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-73',
    name: 'DEU-73',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-403',
    name: 'DEU-403',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-207',
    name: 'DEU-207',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-612',
    name: 'DEU-612',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-232',
    name: 'DEU-232',
    flag: 'DEU',
  },
  {
    id: 'deu-alt-treptow',
    name: 'ALT-TREPTOW',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-498',
    name: 'DEU-498',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-481',
    name: 'DEU-481',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-385',
    name: 'DEU-385',
    flag: 'DEU',
  },
  {
    id: 'deu-oldenburg',
    name: 'OLDENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-318',
    name: 'DEU-318',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-582',
    name: 'DEU-582',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-479',
    name: 'DEU-479',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-620',
    name: 'DEU-620',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-201',
    name: 'DEU-201',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-410',
    name: 'DEU-410',
    flag: 'DEU',
  },
  {
    id: 'deu-kettig',
    name: 'KETTIG',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-316',
    name: 'DEU-316',
    flag: 'DEU',
  },
  {
    id: 'deu-haselhorst',
    name: 'HASELHORST',
    flag: 'DEU',
  },
  {
    id: 'deu-tiefenbach',
    name: 'TIEFENBACH',
    flag: 'DEU',
  },
  {
    id: 'deu-worthamrhein',
    name: 'WORTH AM RHEIN',
    flag: 'DEU',
  },
  {
    id: 'deu-vierow',
    name: 'VIEROW',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-430',
    name: 'DEU-430',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-642',
    name: 'DEU-642',
    flag: 'DEU',
  },
  {
    id: 'deu-wilhelmstadt',
    name: 'WILHELMSTADT',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-302',
    name: 'DEU-302',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-511',
    name: 'DEU-511',
    flag: 'DEU',
  },
  {
    id: 'deu-scharnebeck',
    name: 'SCHARNEBECK',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-591',
    name: 'DEU-591',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-399',
    name: 'DEU-399',
    flag: 'DEU',
  },
  {
    id: 'deu-nordhafenhannover',
    name: 'NORDHAFEN HANNOVER',
    flag: 'DEU',
  },
  {
    id: 'deu-ludinghausen',
    name: 'LUDINGHAUSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-605',
    name: 'DEU-605',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-45',
    name: 'DEU-45',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-375',
    name: 'DEU-375',
    flag: 'DEU',
  },
  {
    id: 'deu-hiddensee',
    name: 'HIDDENSEE',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-480',
    name: 'DEU-480',
    flag: 'DEU',
  },
  {
    id: 'deu-eckernforde',
    name: 'ECKERNFORDE',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-441',
    name: 'DEU-441',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-471',
    name: 'DEU-471',
    flag: 'DEU',
  },
  {
    id: 'deu-wusterwitz',
    name: 'WUSTERWITZ',
    flag: 'DEU',
  },
  {
    id: 'deu-pellworm',
    name: 'PELLWORM',
    flag: 'DEU',
  },
  {
    id: 'deu-hochfeld',
    name: 'HOCHFELD',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-275',
    name: 'DEU-275',
    flag: 'DEU',
  },
  {
    id: 'deu-bremerhavenanchorage',
    name: 'BREMERHAVEN ANCHORAGE',
    flag: 'DEU',
  },
  {
    id: 'deu-lampertheim',
    name: 'LAMPERTHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-217',
    name: 'DEU-217',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-22',
    name: 'DEU-22',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-5',
    name: 'DEU-5',
    flag: 'DEU',
  },
  {
    id: 'deu-stahnsdorf',
    name: 'STAHNSDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-544',
    name: 'DEU-544',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-563',
    name: 'DEU-563',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-134',
    name: 'DEU-134',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-458',
    name: 'DEU-458',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-118',
    name: 'DEU-118',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-572',
    name: 'DEU-572',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-388',
    name: 'DEU-388',
    flag: 'DEU',
  },
  {
    id: 'deu-reisholz',
    name: 'REISHOLZ',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-220',
    name: 'DEU-220',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-283',
    name: 'DEU-283',
    flag: 'DEU',
  },
  {
    id: 'deu-hennigsdorf',
    name: 'HENNIGSDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-hansaviertel',
    name: 'HANSAVIERTEL',
    flag: 'DEU',
  },
  {
    id: 'deu-lohnde',
    name: 'LOHNDE',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-253',
    name: 'DEU-253',
    flag: 'DEU',
  },
  {
    id: 'deu-orth',
    name: 'ORTH',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-583',
    name: 'DEU-583',
    flag: 'DEU',
  },
  {
    id: 'deu-deu-538',
    name: 'DEU-538',
    flag: 'DEU',
  },
  {
    id: 'dnk-dnk-98',
    name: 'DNK-98',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-3',
    name: 'DNK-3',
    flag: 'DNK',
  },
  {
    id: 'dnk-nysted',
    name: 'NYSTED',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-232',
    name: 'DNK-232',
    flag: 'DNK',
  },
  {
    id: 'dnk-aalborg',
    name: 'AALBORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-158',
    name: 'DNK-158',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-179',
    name: 'DNK-179',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-166',
    name: 'DNK-166',
    flag: 'DNK',
  },
  {
    id: 'dnk-ensted',
    name: 'ENSTED',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-248',
    name: 'DNK-248',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-206',
    name: 'DNK-206',
    flag: 'DNK',
  },
  {
    id: 'dnk-hundige',
    name: 'HUNDIGE',
    flag: 'DNK',
  },
  {
    id: 'dnk-agger',
    name: 'AGGER',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-163',
    name: 'DNK-163',
    flag: 'DNK',
  },
  {
    id: 'dnk-middelfart',
    name: 'MIDDELFART',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-126',
    name: 'DNK-126',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-11',
    name: 'DNK-11',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-251',
    name: 'DNK-251',
    flag: 'DNK',
  },
  {
    id: 'dnk-hvalpsund',
    name: 'HVALPSUND',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-190',
    name: 'DNK-190',
    flag: 'DNK',
  },
  {
    id: 'dnk-horsens',
    name: 'HORSENS',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-260',
    name: 'DNK-260',
    flag: 'DNK',
  },
  {
    id: 'dnk-hasle',
    name: 'HASLE',
    flag: 'DNK',
  },
  {
    id: 'dnk-stevnspier',
    name: 'STEVNS PIER',
    flag: 'DNK',
  },
  {
    id: 'dnk-thisted',
    name: 'THISTED',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-223',
    name: 'DNK-223',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-9',
    name: 'DNK-9',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-180',
    name: 'DNK-180',
    flag: 'DNK',
  },
  {
    id: 'dnk-nykobing(falster)',
    name: 'NYKOBING (FALSTER)',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-174',
    name: 'DNK-174',
    flag: 'DNK',
  },
  {
    id: 'dnk-vordingborg',
    name: 'VORDINGBORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-198',
    name: 'DNK-198',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-47',
    name: 'DNK-47',
    flag: 'DNK',
  },
  {
    id: 'dnk-danfield',
    name: 'DAN FIELD',
    flag: 'DNK',
  },
  {
    id: 'dnk-augustenborg',
    name: 'AUGUSTENBORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-84',
    name: 'DNK-84',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-191',
    name: 'DNK-191',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-1',
    name: 'DNK-1',
    flag: 'DNK',
  },
  {
    id: 'dnk-marstal',
    name: 'MARSTAL',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-257',
    name: 'DNK-257',
    flag: 'DNK',
  },
  {
    id: 'dnk-glyngore',
    name: 'GLYNGORE',
    flag: 'DNK',
  },
  {
    id: 'dnk-nykobingsjaelland',
    name: 'NYKOBING SJAELLAND',
    flag: 'DNK',
  },
  {
    id: 'dnk-gilleleje',
    name: 'GILLELEJE',
    flag: 'DNK',
  },
  {
    id: 'dnk-juelsminde',
    name: 'JUELSMINDE',
    flag: 'DNK',
  },
  {
    id: 'dnk-ebeltoft',
    name: 'EBELTOFT',
    flag: 'DNK',
  },
  {
    id: 'dnk-dragerup',
    name: 'DRAGERUP',
    flag: 'DNK',
  },
  {
    id: 'dnk-ballen',
    name: 'BALLEN',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-56',
    name: 'DNK-56',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-97',
    name: 'DNK-97',
    flag: 'DNK',
  },
  {
    id: 'dnk-havneby',
    name: 'HAVNEBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-80',
    name: 'DNK-80',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-129',
    name: 'DNK-129',
    flag: 'DNK',
  },
  {
    id: 'dnk-skaerbaek',
    name: 'SKAERBAEK',
    flag: 'DNK',
  },
  {
    id: 'dnk-haderslev',
    name: 'HADERSLEV',
    flag: 'DNK',
  },
  {
    id: 'dnk-frederikssund',
    name: 'FREDERIKSSUND',
    flag: 'DNK',
  },
  {
    id: 'dnk-koge',
    name: 'KOGE',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-17',
    name: 'DNK-17',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-159',
    name: 'DNK-159',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-176',
    name: 'DNK-176',
    flag: 'DNK',
  },
  {
    id: 'dnk-naestved',
    name: 'NAESTVED',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-87',
    name: 'DNK-87',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-264',
    name: 'DNK-264',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-221',
    name: 'DNK-221',
    flag: 'DNK',
  },
  {
    id: 'dnk-rendbjerg',
    name: 'RENDBJERG',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-125',
    name: 'DNK-125',
    flag: 'DNK',
  },
  {
    id: 'dnk-hadsund',
    name: 'HADSUND',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-109',
    name: 'DNK-109',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-222',
    name: 'DNK-222',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-93',
    name: 'DNK-93',
    flag: 'DNK',
  },
  {
    id: 'dnk-frederikshavn',
    name: 'FREDERIKSHAVN',
    flag: 'DNK',
  },
  {
    id: 'dnk-fakseladeplads',
    name: 'FAKSE LADEPLADS',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-254',
    name: 'DNK-254',
    flag: 'DNK',
  },
  {
    id: 'dnk-gormfield',
    name: 'GORM FIELD',
    flag: 'DNK',
  },
  {
    id: 'dnk-fredericia',
    name: 'FREDERICIA',
    flag: 'DNK',
  },
  {
    id: 'dnk-strandby',
    name: 'STRANDBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-holstebro-stuer',
    name: 'HOLSTEBRO-STUER',
    flag: 'DNK',
  },
  {
    id: 'dnk-munkebo',
    name: 'MUNKEBO',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-40',
    name: 'DNK-40',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-192',
    name: 'DNK-192',
    flag: 'DNK',
  },
  {
    id: 'dnk-klarup',
    name: 'KLARUP',
    flag: 'DNK',
  },
  {
    id: 'dnk-rodvig',
    name: 'RODVIG',
    flag: 'DNK',
  },
  {
    id: 'dnk-rudkobing',
    name: 'RUDKOBING',
    flag: 'DNK',
  },
  {
    id: 'dnk-hornbaek',
    name: 'HORNBAEK',
    flag: 'DNK',
  },
  {
    id: 'dnk-skive',
    name: 'SKIVE',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-219',
    name: 'DNK-219',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-168',
    name: 'DNK-168',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-131',
    name: 'DNK-131',
    flag: 'DNK',
  },
  {
    id: 'dnk-assens',
    name: 'ASSENS',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-96',
    name: 'DNK-96',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-216',
    name: 'DNK-216',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-164',
    name: 'DNK-164',
    flag: 'DNK',
  },
  {
    id: 'dnk-esbjerg',
    name: 'ESBJERG',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-252',
    name: 'DNK-252',
    flag: 'DNK',
  },
  {
    id: 'dnk-aeroskobing',
    name: 'AEROSKOBING',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-207',
    name: 'DNK-207',
    flag: 'DNK',
  },
  {
    id: 'dnk-lango',
    name: 'LANGO',
    flag: 'DNK',
  },
  {
    id: 'dnk-klintholm',
    name: 'KLINTHOLM',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-32',
    name: 'DNK-32',
    flag: 'DNK',
  },
  {
    id: 'dnk-ronbjerglivoe',
    name: 'RONBJERG LIVOE',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-243',
    name: 'DNK-243',
    flag: 'DNK',
  },
  {
    id: 'dnk-aarhus',
    name: 'AARHUS',
    flag: 'DNK',
  },
  {
    id: 'dnk-osterbyhavn',
    name: 'OSTERBYHAVN',
    flag: 'DNK',
  },
  {
    id: 'dnk-hirtshals',
    name: 'HIRTSHALS',
    flag: 'DNK',
  },
  {
    id: 'dnk-hanstholm',
    name: 'HANSTHOLM',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-218',
    name: 'DNK-218',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-139',
    name: 'DNK-139',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-213',
    name: 'DNK-213',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-141',
    name: 'DNK-141',
    flag: 'DNK',
  },
  {
    id: 'dnk-arhus',
    name: 'ARHUS',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-45',
    name: 'DNK-45',
    flag: 'DNK',
  },
  {
    id: 'dnk-stege',
    name: 'STEGE',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-72',
    name: 'DNK-72',
    flag: 'DNK',
  },
  {
    id: 'dnk-odense',
    name: 'ODENSE',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-30',
    name: 'DNK-30',
    flag: 'DNK',
  },
  {
    id: 'dnk-taarbaek',
    name: 'TAARBAEK',
    flag: 'DNK',
  },
  {
    id: 'dnk-hvidesande',
    name: 'HVIDE SANDE',
    flag: 'DNK',
  },
  {
    id: 'dnk-kolding',
    name: 'KOLDING',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-44',
    name: 'DNK-44',
    flag: 'DNK',
  },
  {
    id: 'dnk-copenhagen',
    name: 'COPENHAGEN',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-140',
    name: 'DNK-140',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-143',
    name: 'DNK-143',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-89',
    name: 'DNK-89',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-111',
    name: 'DNK-111',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-182',
    name: 'DNK-182',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-90',
    name: 'DNK-90',
    flag: 'DNK',
  },
  {
    id: 'dnk-thuroby',
    name: 'THURO BY',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-255',
    name: 'DNK-255',
    flag: 'DNK',
  },
  {
    id: 'dnk-dragor',
    name: 'DRAGOR',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-212',
    name: 'DNK-212',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-142',
    name: 'DNK-142',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-37',
    name: 'DNK-37',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-104',
    name: 'DNK-104',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-181',
    name: 'DNK-181',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-77',
    name: 'DNK-77',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-259',
    name: 'DNK-259',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-137',
    name: 'DNK-137',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-211',
    name: 'DNK-211',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-177',
    name: 'DNK-177',
    flag: 'DNK',
  },
  {
    id: 'dnk-nexo',
    name: 'NEXO',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-175',
    name: 'DNK-175',
    flag: 'DNK',
  },
  {
    id: 'dnk-studstrup',
    name: 'STUDSTRUP',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-265',
    name: 'DNK-265',
    flag: 'DNK',
  },
  {
    id: 'dnk-roedbyhavn',
    name: 'ROEDBYHAVN',
    flag: 'DNK',
  },
  {
    id: 'dnk-grenaahavn',
    name: 'GRENAA HAVN',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-31',
    name: 'DNK-31',
    flag: 'DNK',
  },
  {
    id: 'dnk-egernsund',
    name: 'EGERNSUND',
    flag: 'DNK',
  },
  {
    id: 'dnk-abenra',
    name: 'ABENRA',
    flag: 'DNK',
  },
  {
    id: 'dnk-lynaes',
    name: 'LYNAES',
    flag: 'DNK',
  },
  {
    id: 'dnk-sonderborg',
    name: 'SONDERBORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-kalundborganchorage',
    name: 'KALUNDBORG ANCHORAGE',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-153',
    name: 'DNK-153',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-117',
    name: 'DNK-117',
    flag: 'DNK',
  },
  {
    id: 'dnk-praesto',
    name: 'PRAESTO',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-127',
    name: 'DNK-127',
    flag: 'DNK',
  },
  {
    id: 'dnk-karrebaeksminde',
    name: 'KARREBAEKSMINDE',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-69',
    name: 'DNK-69',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-76',
    name: 'DNK-76',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-215',
    name: 'DNK-215',
    flag: 'DNK',
  },
  {
    id: 'dnk-alborg',
    name: 'ALBORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-105',
    name: 'DNK-105',
    flag: 'DNK',
  },
  {
    id: 'dnk-korsor',
    name: 'KORSOR',
    flag: 'DNK',
  },
  {
    id: 'dnk-niva',
    name: 'NIVA',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-34',
    name: 'DNK-34',
    flag: 'DNK',
  },
  {
    id: 'dnk-ronne',
    name: 'RONNE',
    flag: 'DNK',
  },
  {
    id: 'dnk-grasten',
    name: 'GRASTEN',
    flag: 'DNK',
  },
  {
    id: 'dnk-horuphav',
    name: 'HORUPHAV',
    flag: 'DNK',
  },
  {
    id: 'dnk-nakskov',
    name: 'NAKSKOV',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-250',
    name: 'DNK-250',
    flag: 'DNK',
  },
  {
    id: 'dnk-nibe',
    name: 'NIBE',
    flag: 'DNK',
  },
  {
    id: 'dnk-stenore',
    name: 'STENORE',
    flag: 'DNK',
  },
  {
    id: 'dnk-logstor',
    name: 'LOGSTOR',
    flag: 'DNK',
  },
  {
    id: 'dnk-bagenkop',
    name: 'BAGENKOP',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-156',
    name: 'DNK-156',
    flag: 'DNK',
  },
  {
    id: 'dnk-nyborg',
    name: 'NYBORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-lemvig',
    name: 'LEMVIG',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-113',
    name: 'DNK-113',
    flag: 'DNK',
  },
  {
    id: 'dnk-skagen',
    name: 'SKAGEN',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-167',
    name: 'DNK-167',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-33',
    name: 'DNK-33',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-170',
    name: 'DNK-170',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-144',
    name: 'DNK-144',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-188',
    name: 'DNK-188',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-189',
    name: 'DNK-189',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-200',
    name: 'DNK-200',
    flag: 'DNK',
  },
  {
    id: 'dnk-asaa',
    name: 'ASAA',
    flag: 'DNK',
  },
  {
    id: 'dnk-vejle',
    name: 'VEJLE',
    flag: 'DNK',
  },
  {
    id: 'dnk-ejerslev',
    name: 'EJERSLEV',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-256',
    name: 'DNK-256',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-149',
    name: 'DNK-149',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-5',
    name: 'DNK-5',
    flag: 'DNK',
  },
  {
    id: 'dnk-tyrafield',
    name: 'TYRA FIELD',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-173',
    name: 'DNK-173',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-209',
    name: 'DNK-209',
    flag: 'DNK',
  },
  {
    id: 'dnk-korshavn',
    name: 'KORSHAVN',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-57',
    name: 'DNK-57',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-155',
    name: 'DNK-155',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-196',
    name: 'DNK-196',
    flag: 'DNK',
  },
  {
    id: 'dnk-helsingor',
    name: 'HELSINGOR',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-233',
    name: 'DNK-233',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-82',
    name: 'DNK-82',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-187',
    name: 'DNK-187',
    flag: 'DNK',
  },
  {
    id: 'dnk-tunoby',
    name: 'TUNOBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-sonderby',
    name: 'SONDERBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-kerteminde',
    name: 'KERTEMINDE',
    flag: 'DNK',
  },
  {
    id: 'dnk-sakskobing',
    name: 'SAKSKOBING',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-210',
    name: 'DNK-210',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-107',
    name: 'DNK-107',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-135',
    name: 'DNK-135',
    flag: 'DNK',
  },
  {
    id: 'dnk-randers',
    name: 'RANDERS',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-110',
    name: 'DNK-110',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-228',
    name: 'DNK-228',
    flag: 'DNK',
  },
  {
    id: 'dnk-thorsminde',
    name: 'THORSMINDE',
    flag: 'DNK',
  },
  {
    id: 'dnk-kyndby',
    name: 'KYNDBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-152',
    name: 'DNK-152',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-43',
    name: 'DNK-43',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-67',
    name: 'DNK-67',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-245',
    name: 'DNK-245',
    flag: 'DNK',
  },
  {
    id: 'dnk-kalundborg',
    name: 'KALUNDBORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-162',
    name: 'DNK-162',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-112',
    name: 'DNK-112',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-161',
    name: 'DNK-161',
    flag: 'DNK',
  },
  {
    id: 'dnk-abelo',
    name: 'ABELO',
    flag: 'DNK',
  },
  {
    id: 'dnk-gedser',
    name: 'GEDSER',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-121',
    name: 'DNK-121',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-102',
    name: 'DNK-102',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-154',
    name: 'DNK-154',
    flag: 'DNK',
  },
  {
    id: 'dnk-hals',
    name: 'HALS',
    flag: 'DNK',
  },
  {
    id: 'dnk-nykobingmors',
    name: 'NYKOBING MORS',
    flag: 'DNK',
  },
  {
    id: 'dnk-saeby',
    name: 'SAEBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-29',
    name: 'DNK-29',
    flag: 'DNK',
  },
  {
    id: 'dnk-frederiksvaerk',
    name: 'FREDERIKSVAERK',
    flag: 'DNK',
  },
  {
    id: 'dnk-hirsholm',
    name: 'HIRSHOLM',
    flag: 'DNK',
  },
  {
    id: 'dnk-bogense',
    name: 'BOGENSE',
    flag: 'DNK',
  },
  {
    id: 'dnk-skaelskor',
    name: 'SKAELSKOR',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-91',
    name: 'DNK-91',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-2',
    name: 'DNK-2',
    flag: 'DNK',
  },
  {
    id: 'dnk-svendborgdrejoe',
    name: 'SVENDBORG DREJOE',
    flag: 'DNK',
  },
  {
    id: 'dnk-thyboron',
    name: 'THYBORON',
    flag: 'DNK',
  },
  {
    id: 'dnk-dnk-267',
    name: 'DNK-267',
    flag: 'DNK',
  },
  {
    id: 'esp-esp-190',
    name: 'ESP-190',
    flag: 'ESP',
  },
  {
    id: 'esp-lesbotigues',
    name: 'LES BOTIGUES',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-258',
    name: 'ESP-258',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-224',
    name: 'ESP-224',
    flag: 'ESP',
  },
  {
    id: 'esp-celeiro',
    name: 'CELEIRO',
    flag: 'ESP',
  },
  {
    id: 'esp-burriana',
    name: 'BURRIANA',
    flag: 'ESP',
  },
  {
    id: 'esp-aguarda',
    name: 'A GUARDA',
    flag: 'ESP',
  },
  {
    id: 'esp-combarro',
    name: 'COMBARRO',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-38',
    name: 'ESP-38',
    flag: 'ESP',
  },
  {
    id: 'esp-huelva',
    name: 'HUELVA',
    flag: 'ESP',
  },
  {
    id: 'esp-guadarranque',
    name: 'GUADARRANQUE',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-269',
    name: 'ESP-269',
    flag: 'ESP',
  },
  {
    id: 'esp-ibiza',
    name: 'IBIZA',
    flag: 'ESP',
  },
  {
    id: 'esp-ogrove',
    name: 'O GROVE',
    flag: 'ESP',
  },
  {
    id: 'esp-villanuevaygeltru',
    name: 'VILLANUEVA Y GELTRU',
    flag: 'ESP',
  },
  {
    id: 'esp-agaete',
    name: 'AGAETE',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-270',
    name: 'ESP-270',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-22',
    name: 'ESP-22',
    flag: 'ESP',
  },
  {
    id: 'esp-santantonideportmany',
    name: 'SANT ANTONI DE PORTMANY',
    flag: 'ESP',
  },
  {
    id: 'esp-bueu',
    name: 'BUEU',
    flag: 'ESP',
  },
  {
    id: 'esp-castro-urdiales',
    name: 'CASTRO-URDIALES',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-326',
    name: 'ESP-326',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-345',
    name: 'ESP-345',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-191',
    name: 'ESP-191',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-220',
    name: 'ESP-220',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-263',
    name: 'ESP-263',
    flag: 'ESP',
  },
  {
    id: 'esp-vinaros',
    name: 'VINAROS',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-294',
    name: 'ESP-294',
    flag: 'ESP',
  },
  {
    id: 'esp-portdesoller',
    name: 'PORT DE SOLLER',
    flag: 'ESP',
  },
  {
    id: 'esp-altea',
    name: 'ALTEA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-295',
    name: 'ESP-295',
    flag: 'ESP',
  },
  {
    id: 'esp-playademasca',
    name: 'PLAYA DE MASCA',
    flag: 'ESP',
  },
  {
    id: 'esp-eltoro',
    name: 'EL TORO',
    flag: 'ESP',
  },
  {
    id: 'esp-hondarribia',
    name: 'HONDARRIBIA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-236',
    name: 'ESP-236',
    flag: 'ESP',
  },
  {
    id: 'esp-malaga',
    name: 'MALAGA',
    flag: 'ESP',
  },
  {
    id: 'esp-barcelona',
    name: 'BARCELONA',
    flag: 'ESP',
  },
  {
    id: 'esp-campamento',
    name: 'CAMPAMENTO',
    flag: 'ESP',
  },
  {
    id: 'esp-sanciprian',
    name: 'SAN CIPRIAN',
    flag: 'ESP',
  },
  {
    id: 'esp-arenysdemar',
    name: 'ARENYS DE MAR',
    flag: 'ESP',
  },
  {
    id: 'esp-sanvicentedelabarquera',
    name: 'SAN VICENTE DE LA BARQUERA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-102',
    name: 'ESP-102',
    flag: 'ESP',
  },
  {
    id: 'esp-roquetasdemar',
    name: 'ROQUETAS DE MAR',
    flag: 'ESP',
  },
  {
    id: 'esp-laherradura',
    name: 'LA HERRADURA',
    flag: 'ESP',
  },
  {
    id: 'esp-larestinga',
    name: 'LA RESTINGA',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodealcudia',
    name: 'PUERTO DE ALCUDIA',
    flag: 'ESP',
  },
  {
    id: 'esp-lacoruna',
    name: 'LA CORUNA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-337',
    name: 'ESP-337',
    flag: 'ESP',
  },
  {
    id: 'esp-elmasnou',
    name: 'EL MASNOU',
    flag: 'ESP',
  },
  {
    id: 'esp-lasrosas',
    name: 'LAS ROSAS',
    flag: 'ESP',
  },
  {
    id: 'esp-santona',
    name: 'SANTONA',
    flag: 'ESP',
  },
  {
    id: 'esp-bancodelhoyoanchorage',
    name: 'BANCO DEL HOYO ANCHORAGE',
    flag: 'ESP',
  },
  {
    id: 'esp-almeria',
    name: 'ALMERIA',
    flag: 'ESP',
  },
  {
    id: 'esp-marbella',
    name: 'MARBELLA',
    flag: 'ESP',
  },
  {
    id: 'esp-ares',
    name: 'ARES',
    flag: 'ESP',
  },
  {
    id: 'esp-ondarroa',
    name: 'ONDARROA',
    flag: 'ESP',
  },
  {
    id: 'esp-elvaradero',
    name: 'EL VARADERO',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-81',
    name: 'ESP-81',
    flag: 'ESP',
  },
  {
    id: 'esp-erandio',
    name: 'ERANDIO',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-181',
    name: 'ESP-181',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-174',
    name: 'ESP-174',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-242',
    name: 'ESP-242',
    flag: 'ESP',
  },
  {
    id: 'esp-tarifa',
    name: 'TARIFA',
    flag: 'ESP',
  },
  {
    id: 'esp-gandia',
    name: 'GANDIA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-198',
    name: 'ESP-198',
    flag: 'ESP',
  },
  {
    id: 'esp-ailladeons',
    name: 'A ILLA DE ONS',
    flag: 'ESP',
  },
  {
    id: 'esp-barbate',
    name: 'BARBATE',
    flag: 'ESP',
  },
  {
    id: 'esp-carino',
    name: 'CARINO',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-100',
    name: 'ESP-100',
    flag: 'ESP',
  },
  {
    id: 'esp-playadelmedio',
    name: 'PLAYA DEL MEDIO',
    flag: 'ESP',
  },
  {
    id: 'esp-santander',
    name: 'SANTANDER',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-43',
    name: 'ESP-43',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodegarrucha',
    name: 'PUERTO DE GARRUCHA',
    flag: 'ESP',
  },
  {
    id: "esp-colld'enrabassa",
    name: "COLL D'EN RABASSA",
    flag: 'ESP',
  },
  {
    id: 'esp-playadeoroja',
    name: 'PLAYA DE OROJA',
    flag: 'ESP',
  },
  {
    id: 'esp-portolimpic',
    name: 'PORT OLIMPIC',
    flag: 'ESP',
  },
  {
    id: 'esp-elpuertodesantamaria',
    name: 'EL PUERTO DE SANTA MARIA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-28',
    name: 'ESP-28',
    flag: 'ESP',
  },
  {
    id: 'esp-islacristina',
    name: 'ISLA CRISTINA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-2',
    name: 'ESP-2',
    flag: 'ESP',
  },
  {
    id: 'esp-canpastilla',
    name: 'CAN PASTILLA',
    flag: 'ESP',
  },
  {
    id: 'esp-tazacorte',
    name: 'TAZACORTE',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-139',
    name: 'ESP-139',
    flag: 'ESP',
  },
  {
    id: 'esp-valencia',
    name: 'VALENCIA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-344',
    name: 'ESP-344',
    flag: 'ESP',
  },
  {
    id: 'esp-premiademar',
    name: 'PREMIA DE MAR',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-222',
    name: 'ESP-222',
    flag: 'ESP',
  },
  {
    id: 'esp-getaria',
    name: 'GETARIA',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodelaestaca',
    name: 'PUERTO DE LA ESTACA',
    flag: 'ESP',
  },
  {
    id: 'esp-ribeira',
    name: 'RIBEIRA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-16',
    name: 'ESP-16',
    flag: 'ESP',
  },
  {
    id: 'esp-sancarlos',
    name: 'SAN CARLOS',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-206',
    name: 'ESP-206',
    flag: 'ESP',
  },
  {
    id: 'esp-cambados',
    name: 'CAMBADOS',
    flag: 'ESP',
  },
  {
    id: 'esp-calp',
    name: 'CALP',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-253',
    name: 'ESP-253',
    flag: 'ESP',
  },
  {
    id: 'esp-badalona',
    name: 'BADALONA',
    flag: 'ESP',
  },
  {
    id: 'esp-playadelaguancha',
    name: 'PLAYA DE LA GUANCHA',
    flag: 'ESP',
  },
  {
    id: 'esp-puertorico',
    name: 'PUERTO RICO',
    flag: 'ESP',
  },
  {
    id: 'esp-torrevieja',
    name: 'TORREVIEJA',
    flag: 'ESP',
  },
  {
    id: "esp-l'ametllademar",
    name: "L'AMETLLA DE MAR",
    flag: 'ESP',
  },
  {
    id: "esp-l'estartit",
    name: "L'ESTARTIT",
    flag: 'ESP',
  },
  {
    id: 'esp-vilarino',
    name: 'VILARINO',
    flag: 'ESP',
  },
  {
    id: "esp-s'arenal",
    name: "S'ARENAL",
    flag: 'ESP',
  },
  {
    id: 'esp-esp-150',
    name: 'ESP-150',
    flag: 'ESP',
  },
  {
    id: 'esp-thomasmaestre',
    name: 'THOMAS MAESTRE',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-23',
    name: 'ESP-23',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodebilbao',
    name: 'PUERTO DE BILBAO',
    flag: 'ESP',
  },
  {
    id: 'esp-tenerife',
    name: 'TENERIFE',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodejosebanus',
    name: 'PUERTO DE JOSE BANUS',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-186',
    name: 'ESP-186',
    flag: 'ESP',
  },
  {
    id: 'esp-gijon',
    name: 'GIJON',
    flag: 'ESP',
  },
  {
    id: 'esp-nerga',
    name: 'NERGA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-226',
    name: 'ESP-226',
    flag: 'ESP',
  },
  {
    id: 'esp-denia',
    name: 'DENIA',
    flag: 'ESP',
  },
  {
    id: 'esp-mataro',
    name: 'MATARO',
    flag: 'ESP',
  },
  {
    id: 'esp-magaluf',
    name: 'MAGALUF',
    flag: 'ESP',
  },
  {
    id: 'esp-vilanovailageltru',
    name: 'VILANOVA I LA GELTRU',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-107',
    name: 'ESP-107',
    flag: 'ESP',
  },
  {
    id: 'esp-lamanga',
    name: 'LA MANGA',
    flag: 'ESP',
  },
  {
    id: 'esp-motril',
    name: 'MOTRIL',
    flag: 'ESP',
  },
  {
    id: 'esp-blanes',
    name: 'BLANES',
    flag: 'ESP',
  },
  {
    id: 'esp-cambrils',
    name: 'CAMBRILS',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-213',
    name: 'ESP-213',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-340',
    name: 'ESP-340',
    flag: 'ESP',
  },
  {
    id: 'esp-castellon',
    name: 'CASTELLON',
    flag: 'ESP',
  },
  {
    id: 'esp-javea',
    name: 'JAVEA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-158',
    name: 'ESP-158',
    flag: 'ESP',
  },
  {
    id: 'esp-mahon',
    name: 'MAHON',
    flag: 'ESP',
  },
  {
    id: 'esp-calarajada',
    name: 'CALA RAJADA',
    flag: 'ESP',
  },
  {
    id: 'esp-sestao',
    name: 'SESTAO',
    flag: 'ESP',
  },
  {
    id: 'esp-cadiz',
    name: 'CADIZ',
    flag: 'ESP',
  },
  {
    id: 'esp-santapola',
    name: 'SANTA POLA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-287',
    name: 'ESP-287',
    flag: 'ESP',
  },
  {
    id: 'esp-mazarron',
    name: 'MAZARRON',
    flag: 'ESP',
  },
  {
    id: 'esp-fuengirola',
    name: 'FUENGIROLA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-259',
    name: 'ESP-259',
    flag: 'ESP',
  },
  {
    id: 'esp-rosas',
    name: 'ROSAS',
    flag: 'ESP',
  },
  {
    id: 'esp-lamangadelmarmenor',
    name: 'LA MANGA DEL MAR MENOR',
    flag: 'ESP',
  },
  {
    id: 'esp-aguadulce',
    name: 'AGUADULCE',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-189',
    name: 'ESP-189',
    flag: 'ESP',
  },
  {
    id: 'esp-villagarciaanchorage',
    name: 'VILLAGARCIA ANCHORAGE',
    flag: 'ESP',
  },
  {
    id: 'esp-cueta',
    name: 'CUETA',
    flag: 'ESP',
  },
  {
    id: 'esp-santacruzdelapalma',
    name: 'SANTA CRUZ DE LA PALMA',
    flag: 'ESP',
  },
  {
    id: 'esp-alicante',
    name: 'ALICANTE',
    flag: 'ESP',
  },
  {
    id: 'esp-elpuertito',
    name: 'EL PUERTITO',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-333',
    name: 'ESP-333',
    flag: 'ESP',
  },
  {
    id: 'esp-viveiro',
    name: 'VIVEIRO',
    flag: 'ESP',
  },
  {
    id: 'esp-cedeira',
    name: 'CEDEIRA',
    flag: 'ESP',
  },
  {
    id: 'esp-zumaia',
    name: 'ZUMAIA',
    flag: 'ESP',
  },
  {
    id: 'esp-zierbena',
    name: 'ZIERBENA',
    flag: 'ESP',
  },
  {
    id: 'esp-lanzarote',
    name: 'LANZAROTE',
    flag: 'ESP',
  },
  {
    id: 'esp-tabarca',
    name: 'TABARCA',
    flag: 'ESP',
  },
  {
    id: 'esp-fisterra',
    name: 'FISTERRA',
    flag: 'ESP',
  },
  {
    id: 'esp-camarinas',
    name: 'CAMARINAS',
    flag: 'ESP',
  },
  {
    id: 'esp-sagunto',
    name: 'SAGUNTO',
    flag: 'ESP',
  },
  {
    id: 'esp-portdesantmiguel',
    name: 'PORT DE SANT MIGUEL',
    flag: 'ESP',
  },
  {
    id: 'esp-esmolinar',
    name: 'ES MOLINAR',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-347',
    name: 'ESP-347',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-219',
    name: 'ESP-219',
    flag: 'ESP',
  },
  {
    id: 'esp-sanfernando',
    name: 'SAN FERNANDO',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-296',
    name: 'ESP-296',
    flag: 'ESP',
  },
  {
    id: 'esp-sanfeliudeguixols',
    name: 'SAN FELIU DE GUIXOLS',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-45',
    name: 'ESP-45',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-336',
    name: 'ESP-336',
    flag: 'ESP',
  },
  {
    id: 'esp-navia',
    name: 'NAVIA',
    flag: 'ESP',
  },
  {
    id: 'esp-ferrol',
    name: 'FERROL',
    flag: 'ESP',
  },
  {
    id: 'esp-playasantiago',
    name: 'PLAYA SANTIAGO',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-177',
    name: 'ESP-177',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-42',
    name: 'ESP-42',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-165',
    name: 'ESP-165',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-162',
    name: 'ESP-162',
    flag: 'ESP',
  },
  {
    id: 'esp-sevilla',
    name: 'SEVILLA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-227',
    name: 'ESP-227',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-243',
    name: 'ESP-243',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-283',
    name: 'ESP-283',
    flag: 'ESP',
  },
  {
    id: 'esp-orio',
    name: 'ORIO',
    flag: 'ESP',
  },
  {
    id: 'esp-laredo',
    name: 'LAREDO',
    flag: 'ESP',
  },
  {
    id: 'esp-villagarciadearosa',
    name: 'VILLAGARCIA DE AROSA',
    flag: 'ESP',
  },
  {
    id: 'esp-barakaldo',
    name: 'BARAKALDO',
    flag: 'ESP',
  },
  {
    id: 'esp-adra',
    name: 'ADRA',
    flag: 'ESP',
  },
  {
    id: 'esp-redes',
    name: 'REDES',
    flag: 'ESP',
  },
  {
    id: 'esp-sanlucardebarrameda',
    name: 'SANLUCAR DE BARRAMEDA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-123',
    name: 'ESP-123',
    flag: 'ESP',
  },
  {
    id: 'esp-illaconillera',
    name: 'ILLA CONILLERA',
    flag: 'ESP',
  },
  {
    id: 'esp-tarragona',
    name: 'TARRAGONA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-71',
    name: 'ESP-71',
    flag: 'ESP',
  },
  {
    id: 'esp-portdepollenca',
    name: 'PORT DE POLLENCA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-234',
    name: 'ESP-234',
    flag: 'ESP',
  },
  {
    id: 'esp-bureladecabo',
    name: 'BURELA DE CABO',
    flag: 'ESP',
  },
  {
    id: 'esp-mugardos',
    name: 'MUGARDOS',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-10',
    name: 'ESP-10',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-126',
    name: 'ESP-126',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-97',
    name: 'ESP-97',
    flag: 'ESP',
  },
  {
    id: 'esp-lapobladefarnals',
    name: 'LA POBLA DE FARNALS',
    flag: 'ESP',
  },
  {
    id: 'esp-bermeo',
    name: 'BERMEO',
    flag: 'ESP',
  },
  {
    id: 'esp-varaderodebenalmad',
    name: 'VARADERO DE BENALMAD',
    flag: 'ESP',
  },
  {
    id: 'esp-santvicencdemontalt',
    name: 'SANT VICENC DE MONTALT',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-279',
    name: 'ESP-279',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-255',
    name: 'ESP-255',
    flag: 'ESP',
  },
  {
    id: 'esp-elcampello',
    name: 'EL CAMPELLO',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-264',
    name: 'ESP-264',
    flag: 'ESP',
  },
  {
    id: 'esp-palmademallorca',
    name: 'PALMA DE MALLORCA',
    flag: 'ESP',
  },
  {
    id: 'esp-moana',
    name: 'MOANA',
    flag: 'ESP',
  },
  {
    id: 'esp-calanova',
    name: 'CALANOVA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-267',
    name: 'ESP-267',
    flag: 'ESP',
  },
  {
    id: 'esp-ribadeo',
    name: 'RIBADEO',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-288',
    name: 'ESP-288',
    flag: 'ESP',
  },
  {
    id: 'esp-cartagena',
    name: 'CARTAGENA',
    flag: 'ESP',
  },
  {
    id: 'esp-malpica',
    name: 'MALPICA',
    flag: 'ESP',
  },
  {
    id: 'esp-sitges',
    name: 'SITGES',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-346',
    name: 'ESP-346',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-132',
    name: 'ESP-132',
    flag: 'ESP',
  },
  {
    id: 'esp-marin',
    name: 'MARIN',
    flag: 'ESP',
  },
  {
    id: 'esp-mutriku',
    name: 'MUTRIKU',
    flag: 'ESP',
  },
  {
    id: 'esp-sanxenxo',
    name: 'SANXENXO',
    flag: 'ESP',
  },
  {
    id: 'esp-argineguin',
    name: 'ARGINEGUIN',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodepasajes',
    name: 'PUERTO DE PASAJES',
    flag: 'ESP',
  },
  {
    id: 'esp-larapita',
    name: 'LA RAPITA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-153',
    name: 'ESP-153',
    flag: 'ESP',
  },
  {
    id: 'esp-sacalobra',
    name: 'SA CALOBRA',
    flag: 'ESP',
  },
  {
    id: 'esp-santradan',
    name: 'SANTRADAN',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-249',
    name: 'ESP-249',
    flag: 'ESP',
  },
  {
    id: 'esp-santandreudellavaneres',
    name: 'SANT ANDREU DE LLAVANERES',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-83',
    name: 'ESP-83',
    flag: 'ESP',
  },
  {
    id: 'esp-santacruzdetenerife',
    name: 'SANTA CRUZ DE TENERIFE',
    flag: 'ESP',
  },
  {
    id: 'esp-vueltas',
    name: 'VUELTAS',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-200',
    name: 'ESP-200',
    flag: 'ESP',
  },
  {
    id: 'esp-baiona',
    name: 'BAIONA',
    flag: 'ESP',
  },
  {
    id: 'esp-puntacorveira',
    name: 'PUNTA CORVEIRA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-257',
    name: 'ESP-257',
    flag: 'ESP',
  },
  {
    id: 'esp-peniscola',
    name: 'PENISCOLA',
    flag: 'ESP',
  },
  {
    id: 'esp-arrecife',
    name: 'ARRECIFE',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-185',
    name: 'ESP-185',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-166',
    name: 'ESP-166',
    flag: 'ESP',
  },
  {
    id: 'esp-caletadevelez',
    name: 'CALETA DE VELEZ',
    flag: 'ESP',
  },
  {
    id: 'esp-vigo',
    name: 'VIGO',
    flag: 'ESP',
  },
  {
    id: 'esp-torreguadiaro',
    name: 'TORREGUADIARO',
    flag: 'ESP',
  },
  {
    id: 'esp-villajoyosa',
    name: 'VILLAJOYOSA',
    flag: 'ESP',
  },
  {
    id: 'esp-donostia/sansebastian',
    name: 'DONOSTIA / SAN SEBASTIAN',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-303',
    name: 'ESP-303',
    flag: 'ESP',
  },
  {
    id: 'esp-bahiadefornells',
    name: 'BAHIA DE FORNELLS',
    flag: 'ESP',
  },
  {
    id: 'esp-bilbao',
    name: 'BILBAO',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-66',
    name: 'ESP-66',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodecarboneras',
    name: 'PUERTO DE CARBONERAS',
    flag: 'ESP',
  },
  {
    id: 'esp-santcarlesdelarapita',
    name: 'SANT CARLES DE LA RAPITA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-53',
    name: 'ESP-53',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-334',
    name: 'ESP-334',
    flag: 'ESP',
  },
  {
    id: 'esp-rota',
    name: 'ROTA',
    flag: 'ESP',
  },
  {
    id: 'esp-aviles',
    name: 'AVILES',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-233',
    name: 'ESP-233',
    flag: 'ESP',
  },
  {
    id: 'esp-moraira',
    name: 'MORAIRA',
    flag: 'ESP',
  },
  {
    id: 'esp-algeciras',
    name: 'ALGECIRAS',
    flag: 'ESP',
  },
  {
    id: 'esp-diegohernandez',
    name: 'DIEGO HERNANDEZ',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-297',
    name: 'ESP-297',
    flag: 'ESP',
  },
  {
    id: 'esp-mugia',
    name: 'MUGIA',
    flag: 'ESP',
  },
  {
    id: 'esp-cangas',
    name: 'CANGAS',
    flag: 'ESP',
  },
  {
    id: 'esp-laxe',
    name: 'LAXE',
    flag: 'ESP',
  },
  {
    id: 'esp-calallonga',
    name: 'CALA LLONGA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-335',
    name: 'ESP-335',
    flag: 'ESP',
  },
  {
    id: 'esp-llanca',
    name: 'LLANCA',
    flag: 'ESP',
  },
  {
    id: 'esp-arguineguin',
    name: 'ARGUINEGUIN',
    flag: 'ESP',
  },
  {
    id: 'esp-pedropinatar',
    name: 'PEDRO PINATAR',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-230',
    name: 'ESP-230',
    flag: 'ESP',
  },
  {
    id: 'esp-laspalmas',
    name: 'LAS PALMAS',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-60',
    name: 'ESP-60',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodelrosario',
    name: 'PUERTO DEL ROSARIO',
    flag: 'ESP',
  },
  {
    id: 'esp-sada',
    name: 'SADA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-149',
    name: 'ESP-149',
    flag: 'ESP',
  },
  {
    id: 'esp-ciutadella',
    name: 'CIUTADELLA',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-5',
    name: 'ESP-5',
    flag: 'ESP',
  },
  {
    id: 'esp-playasanjuan',
    name: 'PLAYA SAN JUAN',
    flag: 'ESP',
  },
  {
    id: 'esp-costaadeje',
    name: 'COSTA ADEJE',
    flag: 'ESP',
  },
  {
    id: "esp-calad'or",
    name: "CALA D'OR",
    flag: 'ESP',
  },
  {
    id: 'esp-maspalomas',
    name: 'MASPALOMAS',
    flag: 'ESP',
  },
  {
    id: 'esp-bancodelhoyo',
    name: 'BANCO DEL HOYO',
    flag: 'ESP',
  },
  {
    id: 'esp-puntalangosteira',
    name: 'PUNTA LANGOSTEIRA',
    flag: 'ESP',
  },
  {
    id: 'esp-caraminal',
    name: 'CARAMINAL',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-112',
    name: 'ESP-112',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-113',
    name: 'ESP-113',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-274',
    name: 'ESP-274',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-135',
    name: 'ESP-135',
    flag: 'ESP',
  },
  {
    id: 'esp-esp-182',
    name: 'ESP-182',
    flag: 'ESP',
  },
  {
    id: 'fin-fin-61',
    name: 'FIN-61',
    flag: 'FIN',
  },
  {
    id: 'fin-hanko',
    name: 'HANKO',
    flag: 'FIN',
  },
  {
    id: 'fin-raahe',
    name: 'RAAHE',
    flag: 'FIN',
  },
  {
    id: 'fin-turku',
    name: 'TURKU',
    flag: 'FIN',
  },
  {
    id: 'fin-varkaus',
    name: 'VARKAUS',
    flag: 'FIN',
  },
  {
    id: 'fin-pohja',
    name: 'POHJA',
    flag: 'FIN',
  },
  {
    id: 'fin-fin-90',
    name: 'FIN-90',
    flag: 'FIN',
  },
  {
    id: 'fin-fin-59',
    name: 'FIN-59',
    flag: 'FIN',
  },
  {
    id: 'fin-tahkoluoto',
    name: 'TAHKOLUOTO',
    flag: 'FIN',
  },
  {
    id: 'fin-inkoo',
    name: 'INKOO',
    flag: 'FIN',
  },
  {
    id: 'fin-naantali',
    name: 'NAANTALI',
    flag: 'FIN',
  },
  {
    id: 'fin-otaniemi',
    name: 'OTANIEMI',
    flag: 'FIN',
  },
  {
    id: 'fin-kotka',
    name: 'KOTKA',
    flag: 'FIN',
  },
  {
    id: 'fin-kristinestad',
    name: 'KRISTINESTAD',
    flag: 'FIN',
  },
  {
    id: 'fin-veitsiluoto',
    name: 'VEITSILUOTO',
    flag: 'FIN',
  },
  {
    id: 'fin-fin-139',
    name: 'FIN-139',
    flag: 'FIN',
  },
  {
    id: 'fin-koukkuniemi',
    name: 'KOUKKUNIEMI',
    flag: 'FIN',
  },
  {
    id: 'fin-fin-130',
    name: 'FIN-130',
    flag: 'FIN',
  },
  {
    id: 'fin-porvoo',
    name: 'PORVOO',
    flag: 'FIN',
  },
  {
    id: 'fin-lansi-turunmaa',
    name: 'LANSI-TURUNMAA',
    flag: 'FIN',
  },
  {
    id: 'fin-fin-56',
    name: 'FIN-56',
    flag: 'FIN',
  },
  {
    id: 'fin-rahja',
    name: 'RAHJA',
    flag: 'FIN',
  },
  {
    id: 'fin-fin-4',
    name: 'FIN-4',
    flag: 'FIN',
  },
  {
    id: 'fin-uusikaupunki',
    name: 'UUSIKAUPUNKI',
    flag: 'FIN',
  },
  {
    id: 'fin-torina',
    name: 'TORINA',
    flag: 'FIN',
  },
  {
    id: 'fin-mariehamn',
    name: 'MARIEHAMN',
    flag: 'FIN',
  },
  {
    id: 'fin-fin-68',
    name: 'FIN-68',
    flag: 'FIN',
  },
  {
    id: 'fin-joutseno',
    name: 'JOUTSENO',
    flag: 'FIN',
  },
  {
    id: 'fin-fin-158',
    name: 'FIN-158',
    flag: 'FIN',
  },
  {
    id: 'fin-oulu',
    name: 'OULU',
    flag: 'FIN',
  },
  {
    id: 'fin-helsinki',
    name: 'HELSINKI',
    flag: 'FIN',
  },
  {
    id: 'fin-fin-21',
    name: 'FIN-21',
    flag: 'FIN',
  },
  {
    id: 'fin-fin-19',
    name: 'FIN-19',
    flag: 'FIN',
  },
  {
    id: 'fin-kokkola',
    name: 'KOKKOLA',
    flag: 'FIN',
  },
  {
    id: 'fin-tolkkinen',
    name: 'TOLKKINEN',
    flag: 'FIN',
  },
  {
    id: 'fin-mantyluoto',
    name: 'MANTYLUOTO',
    flag: 'FIN',
  },
  {
    id: 'fin-joensuu',
    name: 'JOENSUU',
    flag: 'FIN',
  },
  {
    id: 'fin-kaskinen',
    name: 'KASKINEN',
    flag: 'FIN',
  },
  {
    id: 'fin-porkkala',
    name: 'PORKKALA',
    flag: 'FIN',
  },
  {
    id: 'fin-nagu',
    name: 'NAGU',
    flag: 'FIN',
  },
  {
    id: 'fin-rauma',
    name: 'RAUMA',
    flag: 'FIN',
  },
  {
    id: 'fin-jussaro',
    name: 'JUSSARO',
    flag: 'FIN',
  },
  {
    id: 'fin-jakobstad',
    name: 'JAKOBSTAD',
    flag: 'FIN',
  },
  {
    id: 'fin-vaasa',
    name: 'VAASA',
    flag: 'FIN',
  },
  {
    id: 'fin-fin-57',
    name: 'FIN-57',
    flag: 'FIN',
  },
  {
    id: 'fin-hamina',
    name: 'HAMINA',
    flag: 'FIN',
  },
  {
    id: 'fin-houtskar',
    name: 'HOUTSKAR',
    flag: 'FIN',
  },
  {
    id: 'fin-savonlinna',
    name: 'SAVONLINNA',
    flag: 'FIN',
  },
  {
    id: 'fin-lappeenranta',
    name: 'LAPPEENRANTA',
    flag: 'FIN',
  },
  {
    id: 'fin-ekenas',
    name: 'EKENAS',
    flag: 'FIN',
  },
  {
    id: 'fin-raisio',
    name: 'RAISIO',
    flag: 'FIN',
  },
  {
    id: 'fin-signilskar',
    name: 'SIGNILSKAR',
    flag: 'FIN',
  },
  {
    id: 'fin-fin-83',
    name: 'FIN-83',
    flag: 'FIN',
  },
  {
    id: 'fra-portsaintlouisdurhone',
    name: 'PORT SAINT LOUIS DU RHONE',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-370',
    name: 'FRA-370',
    flag: 'FRA',
  },
  {
    id: 'fra-roscanvel',
    name: 'ROSCANVEL',
    flag: 'FRA',
  },
  {
    id: 'fra-boulogne-billancourt',
    name: 'BOULOGNE-BILLANCOURT',
    flag: 'FRA',
  },
  {
    id: 'fra-chartrettes',
    name: 'CHARTRETTES',
    flag: 'FRA',
  },
  {
    id: 'fra-loos',
    name: 'LOOS',
    flag: 'FRA',
  },
  {
    id: 'fra-freneuse',
    name: 'FRENEUSE',
    flag: 'FRA',
  },
  {
    id: 'fra-rogerville',
    name: 'ROGERVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-sahurs',
    name: 'SAHURS',
    flag: 'FRA',
  },
  {
    id: 'fra-acheres',
    name: 'ACHERES',
    flag: 'FRA',
  },
  {
    id: 'fra-ncl-42',
    name: 'NCL-42',
    flag: 'FRA',
  },
  {
    id: 'fra-martigues',
    name: 'MARTIGUES',
    flag: 'FRA',
  },
  {
    id: 'fra-sartrouville',
    name: 'SARTROUVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-meurchin',
    name: 'MEURCHIN',
    flag: 'FRA',
  },
  {
    id: 'fra-benouville',
    name: 'BENOUVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-jouy-le-moutier',
    name: 'JOUY-LE-MOUTIER',
    flag: 'FRA',
  },
  {
    id: 'fra-escautpont',
    name: 'ESCAUTPONT',
    flag: 'FRA',
  },
  {
    id: 'fra-rosenau',
    name: 'ROSENAU',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-maur-des-fosses',
    name: 'SAINT-MAUR-DES-FOSSES',
    flag: 'FRA',
  },
  {
    id: 'fra-meulan-en-yvelines',
    name: 'MEULAN-EN-YVELINES',
    flag: 'FRA',
  },
  {
    id: 'fra-portdepropriano',
    name: 'PORT DE PROPRIANO',
    flag: 'FRA',
  },
  {
    id: 'fra-beuvry',
    name: 'BEUVRY',
    flag: 'FRA',
  },
  {
    id: 'fra-iledebatz',
    name: 'ILE DE BATZ',
    flag: 'FRA',
  },
  {
    id: 'fra-carentan',
    name: 'CARENTAN',
    flag: 'FRA',
  },
  {
    id: 'fra-sablons',
    name: 'SABLONS',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-223',
    name: 'FRA-223',
    flag: 'FRA',
  },
  {
    id: 'fra-lesattaques',
    name: 'LES ATTAQUES',
    flag: 'FRA',
  },
  {
    id: 'fra-vannes',
    name: 'VANNES',
    flag: 'FRA',
  },
  {
    id: 'fra-juziers',
    name: 'JUZIERS',
    flag: 'FRA',
  },
  {
    id: 'fra-bordeaux',
    name: 'BORDEAUX',
    flag: 'FRA',
  },
  {
    id: 'fra-fourques',
    name: 'FOURQUES',
    flag: 'FRA',
  },
  {
    id: 'fra-comines',
    name: 'COMINES',
    flag: 'FRA',
  },
  {
    id: 'fra-laciotat',
    name: 'LA CIOTAT',
    flag: 'FRA',
  },
  {
    id: 'fra-legosier',
    name: 'LE GOSIER',
    flag: 'FRA',
  },
  {
    id: 'fra-ouistreham',
    name: 'OUISTREHAM',
    flag: 'FRA',
  },
  {
    id: 'fra-stnazaire',
    name: 'ST NAZAIRE',
    flag: 'FRA',
  },
  {
    id: 'fra-arques',
    name: 'ARQUES',
    flag: 'FRA',
  },
  {
    id: 'fra-hardricourt',
    name: 'HARDRICOURT',
    flag: 'FRA',
  },
  {
    id: 'fra-pornichet',
    name: 'PORNICHET',
    flag: 'FRA',
  },
  {
    id: 'fra-limay',
    name: 'LIMAY',
    flag: 'FRA',
  },
  {
    id: 'fra-essars',
    name: 'ESSARS',
    flag: 'FRA',
  },
  {
    id: 'fra-aire-sur-la-lys',
    name: 'AIRE-SUR-LA-LYS',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-jean-de-luz',
    name: 'SAINT-JEAN-DE-LUZ',
    flag: 'FRA',
  },
  {
    id: 'fra-lanveoc',
    name: 'LANVEOC',
    flag: 'FRA',
  },
  {
    id: 'fra-fouesnant',
    name: 'FOUESNANT',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-225',
    name: 'FRA-225',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-453',
    name: 'FRA-453',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-235',
    name: 'FRA-235',
    flag: 'FRA',
  },
  {
    id: 'fra-pontoise',
    name: 'PONTOISE',
    flag: 'FRA',
  },
  {
    id: 'fra-frontignan',
    name: 'FRONTIGNAN',
    flag: 'FRA',
  },
  {
    id: 'fra-courbevoie',
    name: 'COURBEVOIE',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-222',
    name: 'FRA-222',
    flag: 'FRA',
  },
  {
    id: 'fra-ars-en-re',
    name: 'ARS-EN-RE',
    flag: 'FRA',
  },
  {
    id: 'fra-mantes-la-jolie',
    name: 'MANTES-LA-JOLIE',
    flag: 'FRA',
  },
  {
    id: 'fra-pierre-benite',
    name: 'PIERRE-BENITE',
    flag: 'FRA',
  },
  {
    id: 'fra-trevou-treguignec',
    name: 'TREVOU-TREGUIGNEC',
    flag: 'FRA',
  },
  {
    id: 'fra-ncl-35',
    name: 'NCL-35',
    flag: 'FRA',
  },
  {
    id: 'fra-bousbecque',
    name: 'BOUSBECQUE',
    flag: 'FRA',
  },
  {
    id: 'fra-larmor-baden',
    name: 'LARMOR-BADEN',
    flag: 'FRA',
  },
  {
    id: 'fra-maurecourt',
    name: 'MAURECOURT',
    flag: 'FRA',
  },
  {
    id: 'fra-cassis',
    name: 'CASSIS',
    flag: 'FRA',
  },
  {
    id: 'fra-mondelange',
    name: 'MONDELANGE',
    flag: 'FRA',
  },
  {
    id: 'fra-penestin',
    name: 'PENESTIN',
    flag: 'FRA',
  },
  {
    id: 'fra-sotteville-les-rouen',
    name: 'SOTTEVILLE-LES-ROUEN',
    flag: 'FRA',
  },
  {
    id: 'fra-caudebec-en-caux',
    name: 'CAUDEBEC-EN-CAUX',
    flag: 'FRA',
  },
  {
    id: 'fra-laforet-fouesnant',
    name: 'LA FORET-FOUESNANT',
    flag: 'FRA',
  },
  {
    id: 'fra-port-louis',
    name: 'PORT-LOUIS',
    flag: 'FRA',
  },
  {
    id: 'fra-lesandelys',
    name: 'LES ANDELYS',
    flag: 'FRA',
  },
  {
    id: 'fra-fecamp',
    name: 'FECAMP',
    flag: 'FRA',
  },
  {
    id: 'fra-grande-synthe',
    name: 'GRANDE-SYNTHE',
    flag: 'FRA',
  },
  {
    id: 'fra-sete',
    name: 'SETE',
    flag: 'FRA',
  },
  {
    id: 'fra-leconquet',
    name: 'LE CONQUET',
    flag: 'FRA',
  },
  {
    id: 'fra-damgan',
    name: 'DAMGAN',
    flag: 'FRA',
  },
  {
    id: "fra-berre-l'etang",
    name: "BERRE-L'ETANG",
    flag: 'FRA',
  },
  {
    id: 'fra-cabourg',
    name: 'CABOURG',
    flag: 'FRA',
  },
  {
    id: 'fra-lesauthieux-sur-le-port-saint-ouen',
    name: 'LES AUTHIEUX-SUR-LE-PORT-SAINT-OUEN',
    flag: 'FRA',
  },
  {
    id: 'fra-port-vendres',
    name: 'PORT-VENDRES',
    flag: 'FRA',
  },
  {
    id: 'fra-morlaix',
    name: 'MORLAIX',
    flag: 'FRA',
  },
  {
    id: 'fra-cuinchy',
    name: 'CUINCHY',
    flag: 'FRA',
  },
  {
    id: 'fra-bethune',
    name: 'BETHUNE',
    flag: 'FRA',
  },
  {
    id: 'fra-lagarde',
    name: 'LA GARDE',
    flag: 'FRA',
  },
  {
    id: 'fra-canteleu',
    name: 'CANTELEU',
    flag: 'FRA',
  },
  {
    id: 'fra-flamanville',
    name: 'FLAMANVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-petit-couronne',
    name: 'PETIT-COURONNE',
    flag: 'FRA',
  },
  {
    id: 'fra-creteil',
    name: 'CRETEIL',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-411',
    name: 'FRA-411',
    flag: 'FRA',
  },
  {
    id: 'fra-benodet',
    name: 'BENODET',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-quay-portrieux',
    name: 'SAINT-QUAY-PORTRIEUX',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-gilles-croix-de-vie',
    name: 'SAINT-GILLES-CROIX-DE-VIE',
    flag: 'FRA',
  },
  {
    id: 'fra-argenteuil',
    name: 'ARGENTEUIL',
    flag: 'FRA',
  },
  {
    id: 'fra-porcheville',
    name: 'PORCHEVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-menton',
    name: 'MENTON',
    flag: 'FRA',
  },
  {
    id: "fra-portd'ajaccio",
    name: "PORT D' AJACCIO",
    flag: 'FRA',
  },
  {
    id: 'fra-larmor-plage',
    name: 'LARMOR-PLAGE',
    flag: 'FRA',
  },
  {
    id: 'fra-larochelle',
    name: 'LA ROCHELLE',
    flag: 'FRA',
  },
  {
    id: 'fra-pleudihen-sur-rance',
    name: 'PLEUDIHEN-SUR-RANCE',
    flag: 'FRA',
  },
  {
    id: 'fra-dunkerqueportouest',
    name: 'DUNKERQUE PORT OUEST',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-157',
    name: 'FRA-157',
    flag: 'FRA',
  },
  {
    id: 'fra-fessenheim',
    name: 'FESSENHEIM',
    flag: 'FRA',
  },
  {
    id: 'fra-grandcamp-maisy',
    name: 'GRANDCAMP-MAISY',
    flag: 'FRA',
  },
  {
    id: 'fra-bonneuil-sur-marne',
    name: 'BONNEUIL-SUR-MARNE',
    flag: 'FRA',
  },
  {
    id: 'fra-pleneuf-val-andre',
    name: 'PLENEUF-VAL-ANDRE',
    flag: 'FRA',
  },
  {
    id: 'fra-binic',
    name: 'BINIC',
    flag: 'FRA',
  },
  {
    id: 'fra-nice',
    name: 'NICE',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-cloud',
    name: 'SAINT-CLOUD',
    flag: 'FRA',
  },
  {
    id: 'fra-bandol',
    name: 'BANDOL',
    flag: 'FRA',
  },
  {
    id: 'fra-montoir',
    name: 'MONTOIR',
    flag: 'FRA',
  },
  {
    id: 'fra-crozon',
    name: 'CROZON',
    flag: 'FRA',
  },
  {
    id: 'fra-boucau',
    name: 'BOUCAU',
    flag: 'FRA',
  },
  {
    id: 'fra-guf-3',
    name: 'GUF-3',
    flag: 'FRA',
  },
  {
    id: 'fra-laturballe',
    name: 'LA TURBALLE',
    flag: 'FRA',
  },
  {
    id: 'fra-banyulsdelamarenda',
    name: 'BANYULS DE LA MARENDA',
    flag: 'FRA',
  },
  {
    id: 'fra-etel',
    name: 'ETEL',
    flag: 'FRA',
  },
  {
    id: 'fra-canet-en-roussillon',
    name: 'CANET-EN-ROUSSILLON',
    flag: 'FRA',
  },
  {
    id: 'fra-barneville-plage',
    name: 'BARNEVILLE-PLAGE',
    flag: 'FRA',
  },
  {
    id: 'fra-stmartin',
    name: 'ST MARTIN',
    flag: 'FRA',
  },
  {
    id: 'fra-houlgate',
    name: 'HOULGATE',
    flag: 'FRA',
  },
  {
    id: 'fra-bonifacio',
    name: 'BONIFACIO',
    flag: 'FRA',
  },
  {
    id: 'fra-capbreton',
    name: 'CAPBRETON',
    flag: 'FRA',
  },
  {
    id: 'fra-blaringhem',
    name: 'BLARINGHEM',
    flag: 'FRA',
  },
  {
    id: 'fra-illange',
    name: 'ILLANGE',
    flag: 'FRA',
  },
  {
    id: 'fra-port-la-nouvelle',
    name: 'PORT-LA-NOUVELLE',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-valery-en-caux',
    name: 'SAINT-VALERY-EN-CAUX',
    flag: 'FRA',
  },
  {
    id: 'fra-boyard-ville',
    name: 'BOYARD-VILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-lepalais',
    name: 'LE PALAIS',
    flag: 'FRA',
  },
  {
    id: 'fra-ablon-sur-seine',
    name: 'ABLON-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-letreport',
    name: 'LE TREPORT',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-196',
    name: 'FRA-196',
    flag: 'FRA',
  },
  {
    id: 'fra-medan',
    name: 'MEDAN',
    flag: 'FRA',
  },
  {
    id: 'fra-quesnoy-sur-deule',
    name: 'QUESNOY-SUR-DEULE',
    flag: 'FRA',
  },
  {
    id: 'fra-nantes',
    name: 'NANTES',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-304',
    name: 'FRA-304',
    flag: 'FRA',
  },
  {
    id: 'fra-spycker',
    name: 'SPYCKER',
    flag: 'FRA',
  },
  {
    id: 'fra-lebono',
    name: 'LE BONO',
    flag: 'FRA',
  },
  {
    id: 'fra-clohars-carnoet',
    name: 'CLOHARS-CARNOET',
    flag: 'FRA',
  },
  {
    id: 'fra-portoflehavre',
    name: 'PORT OF LE HAVRE',
    flag: 'FRA',
  },
  {
    id: 'fra-tregastel',
    name: 'TREGASTEL',
    flag: 'FRA',
  },
  {
    id: 'fra-lasentinelle',
    name: 'LA SENTINELLE',
    flag: 'FRA',
  },
  {
    id: 'fra-vallauris',
    name: 'VALLAURIS',
    flag: 'FRA',
  },
  {
    id: 'fra-duclair',
    name: 'DUCLAIR',
    flag: 'FRA',
  },
  {
    id: 'fra-rochefort',
    name: 'ROCHEFORT',
    flag: 'FRA',
  },
  {
    id: 'fra-marseille',
    name: 'MARSEILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-maf-2',
    name: 'MAF-2',
    flag: 'FRA',
  },
  {
    id: 'fra-auvers-sur-oise',
    name: 'AUVERS-SUR-OISE',
    flag: 'FRA',
  },
  {
    id: 'fra-sainte-foy-les-lyon',
    name: 'SAINTE-FOY-LES-LYON',
    flag: 'FRA',
  },
  {
    id: 'fra-lagorgue',
    name: 'LA GORGUE',
    flag: 'FRA',
  },
  {
    id: 'fra-bonnieres-sur-seine',
    name: 'BONNIERES-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-lecroisic',
    name: 'LE CROISIC',
    flag: 'FRA',
  },
  {
    id: 'fra-calais',
    name: 'CALAIS',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-malo',
    name: 'SAINT-MALO',
    flag: 'FRA',
  },
  {
    id: 'fra-koenigsmacker',
    name: 'KOENIGSMACKER',
    flag: 'FRA',
  },
  {
    id: 'fra-flers-en-escrebieux',
    name: 'FLERS-EN-ESCREBIEUX',
    flag: 'FRA',
  },
  {
    id: "fra-saint-denis-d'oleron",
    name: "SAINT-DENIS-D'OLERON",
    flag: 'FRA',
  },
  {
    id: 'fra-neuilly-sur-seine',
    name: 'NEUILLY-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-conflans-sainte-honorine',
    name: 'CONFLANS-SAINTE-HONORINE',
    flag: 'FRA',
  },
  {
    id: 'fra-carrieres-sur-seine',
    name: 'CARRIERES-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-andresy',
    name: 'ANDRESY',
    flag: 'FRA',
  },
  {
    id: 'fra-auray',
    name: 'AURAY',
    flag: 'FRA',
  },
  {
    id: 'fra-gargenville',
    name: 'GARGENVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-faaa',
    name: 'FAAA',
    flag: 'FRA',
  },
  {
    id: 'fra-wervicq-sud',
    name: 'WERVICQ-SUD',
    flag: 'FRA',
  },
  {
    id: 'fra-plougonvelin',
    name: 'PLOUGONVELIN',
    flag: 'FRA',
  },
  {
    id: 'fra-triel-sur-seine',
    name: 'TRIEL-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-bauvin',
    name: 'BAUVIN',
    flag: 'FRA',
  },
  {
    id: 'fra-hyeres',
    name: 'HYERES',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-florent',
    name: 'SAINT-FLORENT',
    flag: 'FRA',
  },
  {
    id: 'fra-brest',
    name: 'BREST',
    flag: 'FRA',
  },
  {
    id: 'fra-saintes-maries-de-la-mer',
    name: 'SAINTES-MARIES-DE-LA-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-fos',
    name: 'FOS',
    flag: 'FRA',
  },
  {
    id: 'fra-anzin',
    name: 'ANZIN',
    flag: 'FRA',
  },
  {
    id: 'fra-villeneuve-saint-georges',
    name: 'VILLENEUVE-SAINT-GEORGES',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-martin-de-re',
    name: 'SAINT-MARTIN-DE-RE',
    flag: 'FRA',
  },
  {
    id: 'fra-bayonne',
    name: 'BAYONNE',
    flag: 'FRA',
  },
  {
    id: 'fra-alfortville',
    name: 'ALFORTVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-just',
    name: 'SAINT-JUST',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-129',
    name: 'FRA-129',
    flag: 'FRA',
  },
  {
    id: 'fra-lemee-sur-seine',
    name: 'LE MEE-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-antibes',
    name: 'ANTIBES',
    flag: 'FRA',
  },
  {
    id: 'fra-pauillac',
    name: 'PAUILLAC',
    flag: 'FRA',
  },
  {
    id: "fra-lecapd'agde",
    name: "LE CAP D'AGDE",
    flag: 'FRA',
  },
  {
    id: 'fra-saint-tropez',
    name: 'SAINT-TROPEZ',
    flag: 'FRA',
  },
  {
    id: 'fra-amfreville-la-mi-voie',
    name: 'AMFREVILLE-LA-MI-VOIE',
    flag: 'FRA',
  },
  {
    id: 'fra-arles',
    name: 'ARLES',
    flag: 'FRA',
  },
  {
    id: 'fra-dunkerqueportest',
    name: 'DUNKERQUE PORT EST',
    flag: 'FRA',
  },
  {
    id: 'fra-baden',
    name: 'BADEN',
    flag: 'FRA',
  },
  {
    id: 'fra-lelegue',
    name: 'LE LEGUE',
    flag: 'FRA',
  },
  {
    id: 'fra-vic-la-gardiole',
    name: 'VIC-LA-GARDIOLE',
    flag: 'FRA',
  },
  {
    id: 'fra-soubise',
    name: 'SOUBISE',
    flag: 'FRA',
  },
  {
    id: 'fra-granville',
    name: 'GRANVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-raphael',
    name: 'SAINT-RAPHAEL',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-julien-les-metz',
    name: 'SAINT-JULIEN-LES-METZ',
    flag: 'FRA',
  },
  {
    id: 'fra-leminihic-sur-rance',
    name: 'LE MINIHIC-SUR-RANCE',
    flag: 'FRA',
  },
  {
    id: 'fra-cannes',
    name: 'CANNES',
    flag: 'FRA',
  },
  {
    id: 'fra-suresnes',
    name: 'SURESNES',
    flag: 'FRA',
  },
  {
    id: 'fra-lepontet',
    name: 'LE PONTET',
    flag: 'FRA',
  },
  {
    id: 'fra-guarbecque',
    name: 'GUARBECQUE',
    flag: 'FRA',
  },
  {
    id: 'fra-epervans',
    name: 'EPERVANS',
    flag: 'FRA',
  },
  {
    id: 'fra-port-de-bouc',
    name: 'PORT-DE-BOUC',
    flag: 'FRA',
  },
  {
    id: 'fra-melun',
    name: 'MELUN',
    flag: 'FRA',
  },
  {
    id: 'fra-rosny-sur-seine',
    name: 'ROSNY-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-courseulles-sur-mer',
    name: 'COURSEULLES-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-isbergues',
    name: 'ISBERGUES',
    flag: 'FRA',
  },
  {
    id: 'fra-ande',
    name: 'ANDE',
    flag: 'FRA',
  },
  {
    id: 'fra-gujan-mestras',
    name: 'GUJAN-MESTRAS',
    flag: 'FRA',
  },
  {
    id: 'fra-elbeuf',
    name: 'ELBEUF',
    flag: 'FRA',
  },
  {
    id: 'fra-sevres',
    name: 'SEVRES',
    flag: 'FRA',
  },
  {
    id: 'fra-fort-mardyck',
    name: 'FORT-MARDYCK',
    flag: 'FRA',
  },
  {
    id: 'fra-letrait',
    name: 'LE TRAIT',
    flag: 'FRA',
  },
  {
    id: 'fra-treguier',
    name: 'TREGUIER',
    flag: 'FRA',
  },
  {
    id: 'fra-lerelecq-kerhuon',
    name: 'LE RELECQ-KERHUON',
    flag: 'FRA',
  },
  {
    id: 'fra-lampaul-plouarzel',
    name: 'LAMPAUL-PLOUARZEL',
    flag: 'FRA',
  },
  {
    id: 'fra-courrieres',
    name: 'COURRIERES',
    flag: 'FRA',
  },
  {
    id: 'fra-blainville-sur-orne',
    name: 'BLAINVILLE-SUR-ORNE',
    flag: 'FRA',
  },
  {
    id: 'fra-lorient',
    name: 'LORIENT',
    flag: 'FRA',
  },
  {
    id: 'fra-basse-ham',
    name: 'BASSE-HAM',
    flag: 'FRA',
  },
  {
    id: 'fra-guilvinec',
    name: 'GUILVINEC',
    flag: 'FRA',
  },
  {
    id: 'fra-maisons-alfort',
    name: 'MAISONS-ALFORT',
    flag: 'FRA',
  },
  {
    id: 'fra-cleon',
    name: 'CLEON',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-cast-le-guildo',
    name: 'SAINT-CAST-LE-GUILDO',
    flag: 'FRA',
  },
  {
    id: 'fra-quillebeuf-sur-seine',
    name: 'QUILLEBEUF-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-tonnaycharente',
    name: 'TONNAY CHARENTE',
    flag: 'FRA',
  },
  {
    id: 'fra-wardrecques',
    name: 'WARDRECQUES',
    flag: 'FRA',
  },
  {
    id: 'fra-donges',
    name: 'DONGES',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-philibert',
    name: 'SAINT-PHILIBERT',
    flag: 'FRA',
  },
  {
    id: 'fra-paimboeuf',
    name: 'PAIMBOEUF',
    flag: 'FRA',
  },
  {
    id: 'fra-schoelcher',
    name: 'SCHOELCHER',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-vaast-la-hougue',
    name: 'SAINT-VAAST-LA-HOUGUE',
    flag: 'FRA',
  },
  {
    id: "fra-lessablesd'olonne",
    name: "LES SABLES D' OLONNE",
    flag: 'FRA',
  },
  {
    id: 'fra-calvi',
    name: 'CALVI',
    flag: 'FRA',
  },
  {
    id: 'fra-marquette-lez-lille',
    name: 'MARQUETTE-LEZ-LILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-loctudy',
    name: 'LOCTUDY',
    flag: 'FRA',
  },
  {
    id: 'fra-lacroix-valmer',
    name: 'LA CROIX-VALMER',
    flag: 'FRA',
  },
  {
    id: 'fra-cappelle-la-grande',
    name: 'CAPPELLE-LA-GRANDE',
    flag: 'FRA',
  },
  {
    id: 'fra-macon',
    name: 'MACON',
    flag: 'FRA',
  },
  {
    id: 'fra-sari-solenzara',
    name: 'SARI-SOLENZARA',
    flag: 'FRA',
  },
  {
    id: 'fra-trebeurden',
    name: 'TREBEURDEN',
    flag: 'FRA',
  },
  {
    id: 'fra-paimpol',
    name: 'PAIMPOL',
    flag: 'FRA',
  },
  {
    id: 'fra-concarneau',
    name: 'CONCARNEAU',
    flag: 'FRA',
  },
  {
    id: 'fra-toulon',
    name: 'TOULON',
    flag: 'FRA',
  },
  {
    id: 'fra-lepecq',
    name: 'LE PECQ',
    flag: 'FRA',
  },
  {
    id: 'fra-perros-guirec',
    name: 'PERROS-GUIREC',
    flag: 'FRA',
  },
  {
    id: 'fra-lepre-saint-gervais',
    name: 'LE PRE-SAINT-GERVAIS',
    flag: 'FRA',
  },
  {
    id: 'fra-wambrechies',
    name: 'WAMBRECHIES',
    flag: 'FRA',
  },
  {
    id: 'fra-legrand-quevilly',
    name: 'LE GRAND-QUEVILLY',
    flag: 'FRA',
  },
  {
    id: "fra-l'ilerousse",
    name: "L'ILE ROUSSE",
    flag: 'FRA',
  },
  {
    id: 'fra-carry-le-rouet',
    name: 'CARRY-LE-ROUET',
    flag: 'FRA',
  },
  {
    id: 'fra-lille',
    name: 'LILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-gravelines',
    name: 'GRAVELINES',
    flag: 'FRA',
  },
  {
    id: 'fra-caluire-et-cuire',
    name: 'CALUIRE-ET-CUIRE',
    flag: 'FRA',
  },
  {
    id: 'fra-tancarville',
    name: 'TANCARVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-evin-malmaison',
    name: 'EVIN-MALMAISON',
    flag: 'FRA',
  },
  {
    id: 'fra-ferel',
    name: 'FEREL',
    flag: 'FRA',
  },
  {
    id: 'fra-marseille16',
    name: 'MARSEILLE 16',
    flag: 'FRA',
  },
  {
    id: 'fra-plougrescant',
    name: 'PLOUGRESCANT',
    flag: 'FRA',
  },
  {
    id: 'fra-sene',
    name: 'SENE',
    flag: 'FRA',
  },
  {
    id: 'fra-neuville-sur-oise',
    name: 'NEUVILLE-SUR-OISE',
    flag: 'FRA',
  },
  {
    id: 'fra-villefranche',
    name: 'VILLEFRANCHE',
    flag: 'FRA',
  },
  {
    id: 'fra-radedebrest',
    name: 'RADE DE BREST',
    flag: 'FRA',
  },
  {
    id: 'fra-portduhavre-antifer',
    name: 'PORT DU HAVRE-ANTIFER',
    flag: 'FRA',
  },
  {
    id: 'fra-lelavandou',
    name: 'LE LAVANDOU',
    flag: 'FRA',
  },
  {
    id: 'fra-ambes',
    name: 'AMBES',
    flag: 'FRA',
  },
  {
    id: 'fra-port-en-bessin-huppain',
    name: 'PORT-EN-BESSIN-HUPPAIN',
    flag: 'FRA',
  },
  {
    id: 'fra-tarascon',
    name: 'TARASCON',
    flag: 'FRA',
  },
  {
    id: 'fra-sainte-marie-kerque',
    name: 'SAINTE-MARIE-KERQUE',
    flag: 'FRA',
  },
  {
    id: 'fra-grand-couronne',
    name: 'GRAND-COURONNE',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-aubin-les-elbeuf',
    name: 'SAINT-AUBIN-LES-ELBEUF',
    flag: 'FRA',
  },
  {
    id: 'fra-sainte-maxime',
    name: 'SAINTE-MAXIME',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-392',
    name: 'FRA-392',
    flag: 'FRA',
  },
  {
    id: 'fra-haubourdin',
    name: 'HAUBOURDIN',
    flag: 'FRA',
  },
  {
    id: 'fra-sanary-sur-mer',
    name: 'SANARY-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-radedecherbourg',
    name: 'RADE DE CHERBOURG',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-174',
    name: 'FRA-174',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-148',
    name: 'FRA-148',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-352',
    name: 'FRA-352',
    flag: 'FRA',
  },
  {
    id: 'fra-vallabregues',
    name: 'VALLABREGUES',
    flag: 'FRA',
  },
  {
    id: 'fra-palavas-les-flots',
    name: 'PALAVAS-LES-FLOTS',
    flag: 'FRA',
  },
  {
    id: 'fra-erquy',
    name: 'ERQUY',
    flag: 'FRA',
  },
  {
    id: 'fra-cavalaire-sur-mer',
    name: 'CAVALAIRE-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-pabu',
    name: 'SAINT-PABU',
    flag: 'FRA',
  },
  {
    id: 'fra-estevelles',
    name: 'ESTEVELLES',
    flag: 'FRA',
  },
  {
    id: 'fra-perols',
    name: 'PEROLS',
    flag: 'FRA',
  },
  {
    id: 'fra-audierne',
    name: 'AUDIERNE',
    flag: 'FRA',
  },
  {
    id: 'fra-baiedumarigot',
    name: 'BAIE DU MARIGOT',
    flag: 'FRA',
  },
  {
    id: 'fra-douarnenez',
    name: 'DOUARNENEZ',
    flag: 'FRA',
  },
  {
    id: 'fra-lerove',
    name: 'LE ROVE',
    flag: 'FRA',
  },
  {
    id: 'fra-pont-a-vendin',
    name: 'PONT-A-VENDIN',
    flag: 'FRA',
  },
  {
    id: 'fra-gruissan',
    name: 'GRUISSAN',
    flag: 'FRA',
  },
  {
    id: 'fra-paris',
    name: 'PARIS',
    flag: 'FRA',
  },
  {
    id: 'fra-biot',
    name: 'BIOT',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-cyr-sur-mer',
    name: 'SAINT-CYR-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-rumersheim-le-haut',
    name: 'RUMERSHEIM-LE-HAUT',
    flag: 'FRA',
  },
  {
    id: 'fra-ivry-sur-seine',
    name: 'IVRY-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-riedisheim',
    name: 'RIEDISHEIM',
    flag: 'FRA',
  },
  {
    id: 'fra-boulogne-sur-mer',
    name: 'BOULOGNE-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-denain',
    name: 'DENAIN',
    flag: 'FRA',
  },
  {
    id: 'fra-charenton-le-pont',
    name: 'CHARENTON-LE-PONT',
    flag: 'FRA',
  },
  {
    id: 'fra-rixheim',
    name: 'RIXHEIM',
    flag: 'FRA',
  },
  {
    id: 'fra-jassans-riottier',
    name: 'JASSANS-RIOTTIER',
    flag: 'FRA',
  },
  {
    id: 'fra-metz',
    name: 'METZ',
    flag: 'FRA',
  },
  {
    id: 'fra-avignon',
    name: 'AVIGNON',
    flag: 'FRA',
  },
  {
    id: 'fra-choisy-le-roi',
    name: 'CHOISY-LE-ROI',
    flag: 'FRA',
  },
  {
    id: 'fra-lambersart',
    name: 'LAMBERSART',
    flag: 'FRA',
  },
  {
    id: 'fra-laflotte',
    name: 'LA FLOTTE',
    flag: 'FRA',
  },
  {
    id: 'fra-lapallice',
    name: 'LA PALLICE',
    flag: 'FRA',
  },
  {
    id: 'fra-livry-sur-seine',
    name: 'LIVRY-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-latrinite-sur-mer',
    name: 'LA TRINITE-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-groix',
    name: 'GROIX',
    flag: 'FRA',
  },
  {
    id: 'fra-boissise-le-roi',
    name: 'BOISSISE-LE-ROI',
    flag: 'FRA',
  },
  {
    id: 'fra-lyon',
    name: 'LYON',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-346',
    name: 'FRA-346',
    flag: 'FRA',
  },
  {
    id: 'fra-theoule-sur-mer',
    name: 'THEOULE-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-lamulatiere',
    name: 'LA MULATIERE',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-fons',
    name: 'SAINT-FONS',
    flag: 'FRA',
  },
  {
    id: 'fra-bastia',
    name: 'BASTIA',
    flag: 'FRA',
  },
  {
    id: 'fra-busnes',
    name: 'BUSNES',
    flag: 'FRA',
  },
  {
    id: 'fra-camaret-sur-mer',
    name: 'CAMARET-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-loire-sur-rhone',
    name: 'LOIRE-SUR-RHONE',
    flag: 'FRA',
  },
  {
    id: 'fra-fos-sur-mer',
    name: 'FOS-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-lancieux',
    name: 'LANCIEUX',
    flag: 'FRA',
  },
  {
    id: 'fra-bassens',
    name: 'BASSENS',
    flag: 'FRA',
  },
  {
    id: 'fra-blaye',
    name: 'BLAYE',
    flag: 'FRA',
  },
  {
    id: 'fra-ncl-8',
    name: 'NCL-8',
    flag: 'FRA',
  },
  {
    id: 'fra-larichardais',
    name: 'LA RICHARDAIS',
    flag: 'FRA',
  },
  {
    id: 'fra-rhinau',
    name: 'RHINAU',
    flag: 'FRA',
  },
  {
    id: 'fra-soyons',
    name: 'SOYONS',
    flag: 'FRA',
  },
  {
    id: 'fra-vaux-sur-seine',
    name: 'VAUX-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-cergy-pontoise',
    name: 'CERGY-PONTOISE',
    flag: 'FRA',
  },
  {
    id: 'fra-don',
    name: 'DON',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-venant',
    name: 'SAINT-VENANT',
    flag: 'FRA',
  },
  {
    id: 'fra-courcelles-sur-seine',
    name: 'COURCELLES-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-macau',
    name: 'MACAU',
    flag: 'FRA',
  },
  {
    id: 'fra-billy-berclau',
    name: 'BILLY-BERCLAU',
    flag: 'FRA',
  },
  {
    id: 'fra-vitry-sur-seine',
    name: 'VITRY-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-landeda',
    name: 'LANDEDA',
    flag: 'FRA',
  },
  {
    id: 'fra-mortagne-sur-gironde',
    name: 'MORTAGNE-SUR-GIRONDE',
    flag: 'FRA',
  },
  {
    id: 'fra-poses',
    name: 'POSES',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-maurice',
    name: 'SAINT-MAURICE',
    flag: 'FRA',
  },
  {
    id: 'fra-plouer-sur-rance',
    name: 'PLOUER-SUR-RANCE',
    flag: 'FRA',
  },
  {
    id: 'fra-villennes-sur-seine',
    name: 'VILLENNES-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-lepradet',
    name: 'LE PRADET',
    flag: 'FRA',
  },
  {
    id: 'fra-stmalo',
    name: 'ST MALO',
    flag: 'FRA',
  },
  {
    id: 'fra-deshaies',
    name: 'DESHAIES',
    flag: 'FRA',
  },
  {
    id: 'fra-ottmarsheim',
    name: 'OTTMARSHEIM',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-181',
    name: 'FRA-181',
    flag: 'FRA',
  },
  {
    id: 'fra-loon-plage',
    name: 'LOON-PLAGE',
    flag: 'FRA',
  },
  {
    id: 'fra-igoville',
    name: 'IGOVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-180',
    name: 'FRA-180',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-cyprien-plage',
    name: 'SAINT-CYPRIEN-PLAGE',
    flag: 'FRA',
  },
  {
    id: 'fra-vanves',
    name: 'VANVES',
    flag: 'FRA',
  },
  {
    id: 'fra-chalampe',
    name: 'CHALAMPE',
    flag: 'FRA',
  },
  {
    id: 'fra-lepouliguen',
    name: 'LE POULIGUEN',
    flag: 'FRA',
  },
  {
    id: 'fra-portdecaen',
    name: 'PORT DE CAEN',
    flag: 'FRA',
  },
  {
    id: 'fra-legrau-du-roi',
    name: 'LE GRAU-DU-ROI',
    flag: 'FRA',
  },
  {
    id: 'fra-vernon',
    name: 'VERNON',
    flag: 'FRA',
  },
  {
    id: 'fra-laseyne-sur-mer',
    name: 'LA SEYNE-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-argelers',
    name: 'ARGELERS',
    flag: 'FRA',
  },
  {
    id: 'fra-roquebrune-cap-martin',
    name: 'ROQUEBRUNE-CAP-MARTIN',
    flag: 'FRA',
  },
  {
    id: 'fra-santes',
    name: 'SANTES',
    flag: 'FRA',
  },
  {
    id: 'fra-bouguenais',
    name: 'BOUGUENAIS',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-115',
    name: 'FRA-115',
    flag: 'FRA',
  },
  {
    id: 'fra-arcachon',
    name: 'ARCACHON',
    flag: 'FRA',
  },
  {
    id: 'fra-bennecourt',
    name: 'BENNECOURT',
    flag: 'FRA',
  },
  {
    id: 'fra-watten',
    name: 'WATTEN',
    flag: 'FRA',
  },
  {
    id: 'fra-dieppe',
    name: 'DIEPPE',
    flag: 'FRA',
  },
  {
    id: 'fra-harfleur',
    name: 'HARFLEUR',
    flag: 'FRA',
  },
  {
    id: 'fra-maizieres-les-metz',
    name: 'MAIZIERES-LES-METZ',
    flag: 'FRA',
  },
  {
    id: 'fra-cagnes-sur-mer',
    name: 'CAGNES-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-cattenom',
    name: 'CATTENOM',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-laurent-du-var',
    name: 'SAINT-LAURENT-DU-VAR',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-wandrille-rancon',
    name: 'SAINT-WANDRILLE-RANCON',
    flag: 'FRA',
  },
  {
    id: 'fra-lagrande-motte',
    name: 'LA GRANDE-MOTTE',
    flag: 'FRA',
  },
  {
    id: 'fra-portofrouen',
    name: 'PORT OF ROUEN',
    flag: 'FRA',
  },
  {
    id: 'fra-villeneuve-les-avignon',
    name: 'VILLENEUVE-LES-AVIGNON',
    flag: 'FRA',
  },
  {
    id: 'fra-honfleur',
    name: 'HONFLEUR',
    flag: 'FRA',
  },
  {
    id: 'fra-arzon',
    name: 'ARZON',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-valery-sur-somme',
    name: 'SAINT-VALERY-SUR-SOMME',
    flag: 'FRA',
  },
  {
    id: 'fra-halluin',
    name: 'HALLUIN',
    flag: 'FRA',
  },
  {
    id: 'fra-piriac-sur-mer',
    name: 'PIRIAC-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-pornic',
    name: 'PORNIC',
    flag: 'FRA',
  },
  {
    id: 'fra-levallois-perret',
    name: 'LEVALLOIS-PERRET',
    flag: 'FRA',
  },
  {
    id: 'fra-mezy-sur-seine',
    name: 'MEZY-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-portovecchio',
    name: 'PORTO VECCHIO',
    flag: 'FRA',
  },
  {
    id: 'fra-cancale',
    name: 'CANCALE',
    flag: 'FRA',
  },
  {
    id: 'fra-mtq-16',
    name: 'MTQ-16',
    flag: 'FRA',
  },
  {
    id: 'fra-royan',
    name: 'ROYAN',
    flag: 'FRA',
  },
  {
    id: 'fra-fra-31',
    name: 'FRA-31',
    flag: 'FRA',
  },
  {
    id: 'fra-plougastel-daoulas',
    name: 'PLOUGASTEL-DAOULAS',
    flag: 'FRA',
  },
  {
    id: 'fra-serezin-du-rhone',
    name: 'SEREZIN-DU-RHONE',
    flag: 'FRA',
  },
  {
    id: 'fra-hendaye',
    name: 'HENDAYE',
    flag: 'FRA',
  },
  {
    id: 'fra-quiberon',
    name: 'QUIBERON',
    flag: 'FRA',
  },
  {
    id: 'fra-plobannalec-lesconil',
    name: 'PLOBANNALEC-LESCONIL',
    flag: 'FRA',
  },
  {
    id: "fra-bruay-sur-l'escaut",
    name: "BRUAY-SUR-L'ESCAUT",
    flag: 'FRA',
  },
  {
    id: 'fra-fra-295',
    name: 'FRA-295',
    flag: 'FRA',
  },
  {
    id: 'fra-vieille-eglise',
    name: 'VIEILLE-EGLISE',
    flag: 'FRA',
  },
  {
    id: 'fra-puteaux',
    name: 'PUTEAUX',
    flag: 'FRA',
  },
  {
    id: 'fra-fresnes-sur-escaut',
    name: 'FRESNES-SUR-ESCAUT',
    flag: 'FRA',
  },
  {
    id: 'fra-deauville',
    name: 'DEAUVILLE',
    flag: 'FRA',
  },
  {
    id: 'gbr-portavogie',
    name: 'PORTAVOGIE',
    flag: 'GBR',
  },
  {
    id: 'gbr-gravesend',
    name: 'GRAVESEND',
    flag: 'GBR',
  },
  {
    id: 'gbr-wembury',
    name: 'WEMBURY',
    flag: 'GBR',
  },
  {
    id: 'gbr-barking',
    name: 'BARKING',
    flag: 'GBR',
  },
  {
    id: 'gbr-mylorbridge',
    name: 'MYLOR BRIDGE',
    flag: 'GBR',
  },
  {
    id: 'gbr-milfordhaven',
    name: 'MILFORD HAVEN',
    flag: 'GBR',
  },
  {
    id: 'gbr-southampton',
    name: 'SOUTHAMPTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-wick',
    name: 'WICK',
    flag: 'GBR',
  },
  {
    id: 'gbr-oban',
    name: 'OBAN',
    flag: 'GBR',
  },
  {
    id: 'gbr-barra',
    name: 'BARRA',
    flag: 'GBR',
  },
  {
    id: 'gbr-tynemouth',
    name: 'TYNEMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-stives',
    name: 'ST IVES',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-461',
    name: 'GBR-461',
    flag: 'GBR',
  },
  {
    id: 'gbr-walton-on-the-naze',
    name: 'WALTON-ON-THE-NAZE',
    flag: 'GBR',
  },
  {
    id: 'gbr-surlingham',
    name: 'SURLINGHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-penzance',
    name: 'PENZANCE',
    flag: 'GBR',
  },
  {
    id: 'gbr-ipswich',
    name: 'IPSWICH',
    flag: 'GBR',
  },
  {
    id: 'gbr-whitby',
    name: 'WHITBY',
    flag: 'GBR',
  },
  {
    id: 'gbr-grimsby',
    name: 'GRIMSBY',
    flag: 'GBR',
  },
  {
    id: 'gbr-looe',
    name: 'LOOE',
    flag: 'GBR',
  },
  {
    id: 'gbr-jey-1',
    name: 'JEY-1',
    flag: 'GBR',
  },
  {
    id: 'gbr-birdport',
    name: 'BIRD PORT',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-59',
    name: 'GBR-59',
    flag: 'GBR',
  },
  {
    id: 'gbr-whitleybay',
    name: 'WHITLEY BAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-fishguard',
    name: 'FISHGUARD',
    flag: 'GBR',
  },
  {
    id: 'gbr-bmu-6',
    name: 'BMU-6',
    flag: 'GBR',
  },
  {
    id: 'gbr-sainthelens',
    name: 'SAINT HELENS',
    flag: 'GBR',
  },
  {
    id: 'gbr-aultbea',
    name: 'AULTBEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-ornsay',
    name: 'ORNSAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-inverness',
    name: 'INVERNESS',
    flag: 'GBR',
  },
  {
    id: 'gbr-holyhead',
    name: 'HOLYHEAD',
    flag: 'GBR',
  },
  {
    id: 'gbr-poole',
    name: 'POOLE',
    flag: 'GBR',
  },
  {
    id: 'gbr-jarrow',
    name: 'JARROW',
    flag: 'GBR',
  },
  {
    id: 'gbr-portellen',
    name: 'PORT ELLEN',
    flag: 'GBR',
  },
  {
    id: 'gbr-barry',
    name: 'BARRY',
    flag: 'GBR',
  },
  {
    id: 'gbr-shotleygate',
    name: 'SHOTLEY GATE',
    flag: 'GBR',
  },
  {
    id: 'gbr-portbannatyne',
    name: 'PORT BANNATYNE',
    flag: 'GBR',
  },
  {
    id: 'gbr-pwllheli',
    name: 'PWLLHELI',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-557',
    name: 'GBR-557',
    flag: 'GBR',
  },
  {
    id: 'gbr-montrose',
    name: 'MONTROSE',
    flag: 'GBR',
  },
  {
    id: 'gbr-falmouth',
    name: 'FALMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-granton',
    name: 'GRANTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-thamesport',
    name: 'THAMESPORT',
    flag: 'GBR',
  },
  {
    id: 'gbr-newtowncreek',
    name: 'NEWTOWN CREEK',
    flag: 'GBR',
  },
  {
    id: 'gbr-runcorn',
    name: 'RUNCORN',
    flag: 'GBR',
  },
  {
    id: 'gbr-avonmouth',
    name: 'AVONMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-pittenweem',
    name: 'PITTENWEEM',
    flag: 'GBR',
  },
  {
    id: 'gbr-castlebay',
    name: 'CASTLE BAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-rothesayharbor',
    name: 'ROTHESAY HARBOR',
    flag: 'GBR',
  },
  {
    id: 'gbr-lamlashharbor',
    name: 'LAMLASH HARBOR',
    flag: 'GBR',
  },
  {
    id: 'gbr-kingstonuponhull',
    name: 'KINGSTON UPON HULL',
    flag: 'GBR',
  },
  {
    id: 'gbr-liverpool',
    name: 'LIVERPOOL',
    flag: 'GBR',
  },
  {
    id: 'gbr-newferry',
    name: 'NEW FERRY',
    flag: 'GBR',
  },
  {
    id: 'gbr-plockton',
    name: 'PLOCKTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-teesport',
    name: 'TEESPORT',
    flag: 'GBR',
  },
  {
    id: 'gbr-coleraine',
    name: 'COLERAINE',
    flag: 'GBR',
  },
  {
    id: 'gbr-perth',
    name: 'PERTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-maryport',
    name: 'MARYPORT',
    flag: 'GBR',
  },
  {
    id: 'gbr-llansantffraidglanconwy',
    name: 'LLANSANTFFRAID GLAN CONWY',
    flag: 'GBR',
  },
  {
    id: 'gbr-bridportharbour',
    name: 'BRIDPORT HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-troon',
    name: 'TROON',
    flag: 'GBR',
  },
  {
    id: 'gbr-grangemouth',
    name: 'GRANGEMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-houndpointterminal',
    name: 'HOUND POINT TERMINAL',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-527',
    name: 'GBR-527',
    flag: 'GBR',
  },
  {
    id: 'gbr-mostyn',
    name: 'MOSTYN',
    flag: 'GBR',
  },
  {
    id: 'gbr-bideford',
    name: 'BIDEFORD',
    flag: 'GBR',
  },
  {
    id: 'gbr-kyleoflochalsh',
    name: 'KYLE OF LOCHALSH',
    flag: 'GBR',
  },
  {
    id: 'gbr-neath',
    name: 'NEATH',
    flag: 'GBR',
  },
  {
    id: 'gbr-braefootbayterminal',
    name: 'BRAEFOOT BAY TERMINAL',
    flag: 'GBR',
  },
  {
    id: 'gbr-kinghorn',
    name: 'KINGHORN',
    flag: 'GBR',
  },
  {
    id: 'gbr-southness',
    name: 'SOUTH NESS',
    flag: 'GBR',
  },
  {
    id: 'gbr-millbrook',
    name: 'MILLBROOK',
    flag: 'GBR',
  },
  {
    id: 'gbr-rhu',
    name: 'RHU',
    flag: 'GBR',
  },
  {
    id: 'gbr-nefyn',
    name: 'NEFYN',
    flag: 'GBR',
  },
  {
    id: 'gbr-bootle',
    name: 'BOOTLE',
    flag: 'GBR',
  },
  {
    id: 'gbr-finnartoilterminal',
    name: 'FINNART OIL TERMINAL',
    flag: 'GBR',
  },
  {
    id: 'gbr-invergordon',
    name: 'INVERGORDON',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-308',
    name: 'GBR-308',
    flag: 'GBR',
  },
  {
    id: 'gbr-chelsea',
    name: 'CHELSEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-seaham',
    name: 'SEAHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-lymeregis',
    name: 'LYME REGIS',
    flag: 'GBR',
  },
  {
    id: 'gbr-purfleet',
    name: 'PURFLEET',
    flag: 'GBR',
  },
  {
    id: 'gbr-fawleymarineterminal',
    name: 'FAWLEY MARINE TERMINAL',
    flag: 'GBR',
  },
  {
    id: 'gbr-london',
    name: 'LONDON',
    flag: 'GBR',
  },
  {
    id: 'gbr-ardfern',
    name: 'ARDFERN',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-47',
    name: 'GBR-47',
    flag: 'GBR',
  },
  {
    id: 'gbr-larne',
    name: 'LARNE',
    flag: 'GBR',
  },
  {
    id: "gbr-king'slynn",
    name: "KING'S LYNN",
    flag: 'GBR',
  },
  {
    id: 'gbr-immingham',
    name: 'IMMINGHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-lochmaddy',
    name: 'LOCHMADDY',
    flag: 'GBR',
  },
  {
    id: 'gbr-doverharbor',
    name: 'DOVER HARBOR',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-500',
    name: 'GBR-500',
    flag: 'GBR',
  },
  {
    id: 'gbr-pierowall',
    name: 'PIEROWALL',
    flag: 'GBR',
  },
  {
    id: 'gbr-lochboisdale',
    name: 'LOCHBOISDALE',
    flag: 'GBR',
  },
  {
    id: 'gbr-portaferry',
    name: 'PORTAFERRY',
    flag: 'GBR',
  },
  {
    id: 'gbr-mullion',
    name: 'MULLION',
    flag: 'GBR',
  },
  {
    id: 'gbr-bangor',
    name: 'BANGOR',
    flag: 'GBR',
  },
  {
    id: 'gbr-tobermory',
    name: 'TOBERMORY',
    flag: 'GBR',
  },
  {
    id: 'gbr-margateanchorage',
    name: 'MARGATE ANCHORAGE',
    flag: 'GBR',
  },
  {
    id: 'gbr-canarywharf',
    name: 'CANARY WHARF',
    flag: 'GBR',
  },
  {
    id: 'gbr-foweyharbour',
    name: 'FOWEY HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-lerwick',
    name: 'LERWICK',
    flag: 'GBR',
  },
  {
    id: 'gbr-brundall',
    name: 'BRUNDALL',
    flag: 'GBR',
  },
  {
    id: 'gbr-llandudno',
    name: 'LLANDUDNO',
    flag: 'GBR',
  },
  {
    id: 'gbr-sandbank',
    name: 'SANDBANK',
    flag: 'GBR',
  },
  {
    id: 'gbr-tilbury',
    name: 'TILBURY',
    flag: 'GBR',
  },
  {
    id: 'gbr-sullomvoe',
    name: 'SULLOM VOE',
    flag: 'GBR',
  },
  {
    id: 'gbr-ayr',
    name: 'AYR',
    flag: 'GBR',
  },
  {
    id: 'gbr-portscatho',
    name: 'PORTSCATHO',
    flag: 'GBR',
  },
  {
    id: 'gbr-beccles',
    name: 'BECCLES',
    flag: 'GBR',
  },
  {
    id: 'gbr-mallaig',
    name: 'MALLAIG',
    flag: 'GBR',
  },
  {
    id: 'gbr-arbroath',
    name: 'ARBROATH',
    flag: 'GBR',
  },
  {
    id: 'gbr-southhayling',
    name: 'SOUTH HAYLING',
    flag: 'GBR',
  },
  {
    id: 'gbr-rottingdean',
    name: 'ROTTINGDEAN',
    flag: 'GBR',
  },
  {
    id: 'gbr-rosehearty',
    name: 'ROSEHEARTY',
    flag: 'GBR',
  },
  {
    id: 'gbr-whitstable',
    name: 'WHITSTABLE',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-233',
    name: 'GBR-233',
    flag: 'GBR',
  },
  {
    id: 'gbr-shorehamharbour',
    name: 'SHOREHAM HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-ryeharbour',
    name: 'RYE HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-carnlough',
    name: 'CARNLOUGH',
    flag: 'GBR',
  },
  {
    id: 'gbr-londonderry',
    name: 'LONDONDERRY',
    flag: 'GBR',
  },
  {
    id: 'gbr-heysham',
    name: 'HEYSHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-greenock',
    name: 'GREENOCK',
    flag: 'GBR',
  },
  {
    id: 'gbr-burtonuponstather',
    name: 'BURTON UPON STATHER',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-164',
    name: 'GBR-164',
    flag: 'GBR',
  },
  {
    id: "gbr-st.mary's(scillyisl.)",
    name: "ST. MARY'S (SCILLY ISL.)",
    flag: 'GBR',
  },
  {
    id: 'gbr-manchester',
    name: 'MANCHESTER',
    flag: 'GBR',
  },
  {
    id: 'gbr-uig',
    name: 'UIG',
    flag: 'GBR',
  },
  {
    id: 'gbr-lowestoft',
    name: 'LOWESTOFT',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-583',
    name: 'GBR-583',
    flag: 'GBR',
  },
  {
    id: 'gbr-wallsend',
    name: 'WALLSEND',
    flag: 'GBR',
  },
  {
    id: 'gbr-kirkcudbright',
    name: 'KIRKCUDBRIGHT',
    flag: 'GBR',
  },
  {
    id: 'gbr-beaumaris',
    name: 'BEAUMARIS',
    flag: 'GBR',
  },
  {
    id: 'gbr-christchurch',
    name: 'CHRISTCHURCH',
    flag: 'GBR',
  },
  {
    id: 'gbr-renfrew',
    name: 'RENFREW',
    flag: 'GBR',
  },
  {
    id: 'gbr-portrush',
    name: 'PORTRUSH',
    flag: 'GBR',
  },
  {
    id: 'gbr-fortwilliam',
    name: 'FORT WILLIAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-pembrokedock',
    name: 'PEMBROKE DOCK',
    flag: 'GBR',
  },
  {
    id: 'gbr-scrabsterharbor',
    name: 'SCRABSTER HARBOR',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-544',
    name: 'GBR-544',
    flag: 'GBR',
  },
  {
    id: 'gbr-kilroot',
    name: 'KILROOT',
    flag: 'GBR',
  },
  {
    id: 'gbr-largs',
    name: 'LARGS',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-201',
    name: 'GBR-201',
    flag: 'GBR',
  },
  {
    id: 'gbr-penally',
    name: 'PENALLY',
    flag: 'GBR',
  },
  {
    id: 'gbr-newholland',
    name: 'NEW HOLLAND',
    flag: 'GBR',
  },
  {
    id: 'gbr-ullapool',
    name: 'ULLAPOOL',
    flag: 'GBR',
  },
  {
    id: 'gbr-portsmouth',
    name: 'PORTSMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-bmu-5',
    name: 'BMU-5',
    flag: 'GBR',
  },
  {
    id: 'gbr-berwick-upon-tweed',
    name: 'BERWICK-UPON-TWEED',
    flag: 'GBR',
  },
  {
    id: 'gbr-cromarty',
    name: 'CROMARTY',
    flag: 'GBR',
  },
  {
    id: 'gbr-salcombe',
    name: 'SALCOMBE',
    flag: 'GBR',
  },
  {
    id: 'gbr-weymouthharbour',
    name: 'WEYMOUTH HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-porttalbot',
    name: 'PORT TALBOT',
    flag: 'GBR',
  },
  {
    id: 'gbr-sainthelier',
    name: 'SAINT HELIER',
    flag: 'GBR',
  },
  {
    id: 'gbr-scalloway',
    name: 'SCALLOWAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-scarborough',
    name: 'SCARBOROUGH',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-213',
    name: 'GBR-213',
    flag: 'GBR',
  },
  {
    id: 'gbr-ryde',
    name: 'RYDE',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-223',
    name: 'GBR-223',
    flag: 'GBR',
  },
  {
    id: 'gbr-tarbert',
    name: 'TARBERT',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-76',
    name: 'GBR-76',
    flag: 'GBR',
  },
  {
    id: 'gbr-birkenhead',
    name: 'BIRKENHEAD',
    flag: 'GBR',
  },
  {
    id: 'gbr-plymouth',
    name: 'PLYMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-eastcowes',
    name: 'EAST COWES',
    flag: 'GBR',
  },
  {
    id: 'gbr-buckhaven',
    name: 'BUCKHAVEN',
    flag: 'GBR',
  },
  {
    id: 'gbr-fleetwood',
    name: 'FLEETWOOD',
    flag: 'GBR',
  },
  {
    id: 'gbr-portlandharbour',
    name: 'PORTLAND HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-wells-next-the-sea',
    name: 'WELLS-NEXT-THE-SEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-510',
    name: 'GBR-510',
    flag: 'GBR',
  },
  {
    id: 'gbr-boston',
    name: 'BOSTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-rosneath',
    name: 'ROSNEATH',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-284',
    name: 'GBR-284',
    flag: 'GBR',
  },
  {
    id: 'gbr-newquay',
    name: 'NEWQUAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-belfast',
    name: 'BELFAST',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-419',
    name: 'GBR-419',
    flag: 'GBR',
  },
  {
    id: 'gbr-milfordonsea',
    name: 'MILFORD ON SEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-padstow',
    name: 'PADSTOW',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-367',
    name: 'GBR-367',
    flag: 'GBR',
  },
  {
    id: 'gbr-crinan',
    name: 'CRINAN',
    flag: 'GBR',
  },
  {
    id: 'gbr-kyleakin',
    name: 'KYLEAKIN',
    flag: 'GBR',
  },
  {
    id: 'gbr-swansea',
    name: 'SWANSEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-barnwood',
    name: 'BARNWOOD',
    flag: 'GBR',
  },
  {
    id: 'gbr-polperro',
    name: 'POLPERRO',
    flag: 'GBR',
  },
  {
    id: 'gbr-newhavenharbour',
    name: 'NEWHAVEN HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-workington',
    name: 'WORKINGTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-overton',
    name: 'OVERTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-iwade',
    name: 'IWADE',
    flag: 'GBR',
  },
  {
    id: 'gbr-battersea',
    name: 'BATTERSEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-pooleharbour',
    name: 'POOLE HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-stokegabriel',
    name: 'STOKE GABRIEL',
    flag: 'GBR',
  },
  {
    id: 'gbr-appledore',
    name: 'APPLEDORE',
    flag: 'GBR',
  },
  {
    id: 'gbr-poplar',
    name: 'POPLAR',
    flag: 'GBR',
  },
  {
    id: 'gbr-stone',
    name: 'STONE',
    flag: 'GBR',
  },
  {
    id: 'gbr-lochaline',
    name: 'LOCHALINE',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-133',
    name: 'GBR-133',
    flag: 'GBR',
  },
  {
    id: 'gbr-haylingisland',
    name: 'HAYLING ISLAND',
    flag: 'GBR',
  },
  {
    id: 'gbr-ballycastle',
    name: 'BALLYCASTLE',
    flag: 'GBR',
  },
  {
    id: 'gbr-keadby',
    name: 'KEADBY',
    flag: 'GBR',
  },
  {
    id: 'gbr-felixstowe',
    name: 'FELIXSTOWE',
    flag: 'GBR',
  },
  {
    id: 'gbr-eyemouth',
    name: 'EYEMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-chathamdocks',
    name: 'CHATHAM DOCKS',
    flag: 'GBR',
  },
  {
    id: 'gbr-partington',
    name: 'PARTINGTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-belvedere',
    name: 'BELVEDERE',
    flag: 'GBR',
  },
  {
    id: 'gbr-islesofscilly',
    name: 'ISLES OF SCILLY',
    flag: 'GBR',
  },
  {
    id: 'gbr-douglas',
    name: 'DOUGLAS',
    flag: 'GBR',
  },
  {
    id: 'gbr-bristol',
    name: 'BRISTOL',
    flag: 'GBR',
  },
  {
    id: 'gbr-lymington',
    name: 'LYMINGTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-canveyisland',
    name: 'CANVEY ISLAND',
    flag: 'GBR',
  },
  {
    id: 'gbr-middlesbrough',
    name: 'MIDDLESBROUGH',
    flag: 'GBR',
  },
  {
    id: 'gbr-saltash',
    name: 'SALTASH',
    flag: 'GBR',
  },
  {
    id: 'gbr-kirkwall',
    name: 'KIRKWALL',
    flag: 'GBR',
  },
  {
    id: 'gbr-peterhead',
    name: 'PETERHEAD',
    flag: 'GBR',
  },
  {
    id: 'gbr-brightlingsea',
    name: 'BRIGHTLINGSEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-leith',
    name: 'LEITH',
    flag: 'GBR',
  },
  {
    id: 'gbr-garlston',
    name: 'GARLSTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-teignmouthharbour',
    name: 'TEIGNMOUTH HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-saintsampson',
    name: 'SAINT SAMPSON',
    flag: 'GBR',
  },
  {
    id: 'gbr-blyth',
    name: 'BLYTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-goole',
    name: 'GOOLE',
    flag: 'GBR',
  },
  {
    id: 'gbr-harwich',
    name: 'HARWICH',
    flag: 'GBR',
  },
  {
    id: 'gbr-ardrossan',
    name: 'ARDROSSAN',
    flag: 'GBR',
  },
  {
    id: 'gbr-southwold',
    name: 'SOUTHWOLD',
    flag: 'GBR',
  },
  {
    id: 'gbr-cairnryan',
    name: 'CAIRNRYAN',
    flag: 'GBR',
  },
  {
    id: 'gbr-lyness',
    name: 'LYNESS',
    flag: 'GBR',
  },
  {
    id: 'gbr-southbank',
    name: 'SOUTH BANK',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-222',
    name: 'GBR-222',
    flag: 'GBR',
  },
  {
    id: 'gbr-cowesharbour',
    name: 'COWES HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-bursledon',
    name: 'BURSLEDON',
    flag: 'GBR',
  },
  {
    id: 'gbr-lee-on-the-solent',
    name: 'LEE-ON-THE-SOLENT',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-127',
    name: 'GBR-127',
    flag: 'GBR',
  },
  {
    id: 'gbr-millport',
    name: 'MILLPORT',
    flag: 'GBR',
  },
  {
    id: 'gbr-moelfre',
    name: 'MOELFRE',
    flag: 'GBR',
  },
  {
    id: 'gbr-marchwood',
    name: 'MARCHWOOD',
    flag: 'GBR',
  },
  {
    id: 'gbr-kirkcaldy',
    name: 'KIRKCALDY',
    flag: 'GBR',
  },
  {
    id: 'gbr-cockenzie',
    name: 'COCKENZIE',
    flag: 'GBR',
  },
  {
    id: 'gbr-glensanda',
    name: 'GLENSANDA',
    flag: 'GBR',
  },
  {
    id: 'gbr-stranraer',
    name: 'STRANRAER',
    flag: 'GBR',
  },
  {
    id: 'gbr-campbeltown',
    name: 'CAMPBELTOWN',
    flag: 'GBR',
  },
  {
    id: 'gbr-wisbech',
    name: 'WISBECH',
    flag: 'GBR',
  },
  {
    id: 'gbr-kilkeel',
    name: 'KILKEEL',
    flag: 'GBR',
  },
  {
    id: 'gbr-warrenpoint',
    name: 'WARREN POINT',
    flag: 'GBR',
  },
  {
    id: 'gbr-burnham-on-crouch',
    name: 'BURNHAM-ON-CROUCH',
    flag: 'GBR',
  },
  {
    id: 'gbr-abbeywood',
    name: 'ABBEY WOOD',
    flag: 'GBR',
  },
  {
    id: 'gbr-maldon',
    name: 'MALDON',
    flag: 'GBR',
  },
  {
    id: 'gbr-starcross',
    name: 'STARCROSS',
    flag: 'GBR',
  },
  {
    id: 'gbr-brixhamharbour',
    name: 'BRIXHAM HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-581',
    name: 'GBR-581',
    flag: 'GBR',
  },
  {
    id: 'gbr-aberdeen',
    name: 'ABERDEEN',
    flag: 'GBR',
  },
  {
    id: 'gbr-rothesaydock',
    name: 'ROTHESAY DOCK',
    flag: 'GBR',
  },
  {
    id: 'gbr-torquayharbour',
    name: 'TORQUAY HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-aberystwyth',
    name: 'ABERYSTWYTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-315',
    name: 'GBR-315',
    flag: 'GBR',
  },
  {
    id: 'gbr-brodick',
    name: 'BRODICK',
    flag: 'GBR',
  },
  {
    id: 'gbr-buckieharbor',
    name: 'BUCKIE HARBOR',
    flag: 'GBR',
  },
  {
    id: 'gbr-alderneyharbour',
    name: 'ALDERNEY HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-sunderland',
    name: 'SUNDERLAND',
    flag: 'GBR',
  },
  {
    id: 'gbr-newport-on-tay',
    name: 'NEWPORT-ON-TAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-558',
    name: 'GBR-558',
    flag: 'GBR',
  },
  {
    id: 'gbr-eastham',
    name: 'EASTHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-caernarvon',
    name: 'CAERNARVON',
    flag: 'GBR',
  },
  {
    id: 'gbr-littlehamptonharbour',
    name: 'LITTLEHAMPTON HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-stornowayharbor',
    name: 'STORNOWAY HARBOR',
    flag: 'GBR',
  },
  {
    id: 'gbr-whitehills',
    name: 'WHITEHILLS',
    flag: 'GBR',
  },
  {
    id: 'gbr-southsea',
    name: 'SOUTHSEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-stromness',
    name: 'STROMNESS',
    flag: 'GBR',
  },
  {
    id: 'gbr-burton',
    name: 'BURTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-bmu-3',
    name: 'BMU-3',
    flag: 'GBR',
  },
  {
    id: 'gbr-sheerness',
    name: 'SHEERNESS',
    flag: 'GBR',
  },
  {
    id: 'gbr-howdendyke',
    name: 'HOWDENDYKE',
    flag: 'GBR',
  },
  {
    id: 'gbr-lossiemouth',
    name: 'LOSSIEMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-warkworthharbour',
    name: 'WARKWORTH HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-burghead',
    name: 'BURGHEAD',
    flag: 'GBR',
  },
  {
    id: 'gbr-wemyssbay',
    name: 'WEMYSS BAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-fraserburghharbor',
    name: 'FRASERBURGH HARBOR',
    flag: 'GBR',
  },
  {
    id: 'gbr-hartlepool',
    name: 'HARTLEPOOL',
    flag: 'GBR',
  },
  {
    id: 'gbr-brentford',
    name: 'BRENTFORD',
    flag: 'GBR',
  },
  {
    id: 'gbr-saintpeterport',
    name: 'SAINT PETER PORT',
    flag: 'GBR',
  },
  {
    id: 'gbr-salford',
    name: 'SALFORD',
    flag: 'GBR',
  },
  {
    id: 'gbr-reedham',
    name: 'REEDHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-methil',
    name: 'METHIL',
    flag: 'GBR',
  },
  {
    id: 'gbr-barrowinfurness',
    name: 'BARROW IN FURNESS',
    flag: 'GBR',
  },
  {
    id: 'gbr-carrickfergus',
    name: 'CARRICKFERGUS',
    flag: 'GBR',
  },
  {
    id: 'gbr-pevenseybay',
    name: 'PEVENSEY BAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-kilcreggan',
    name: 'KILCREGGAN',
    flag: 'GBR',
  },
  {
    id: 'gbr-londongateway',
    name: 'LONDON GATEWAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-newtonferrers',
    name: 'NEWTON FERRERS',
    flag: 'GBR',
  },
  {
    id: 'gbr-mevagissey',
    name: 'MEVAGISSEY',
    flag: 'GBR',
  },
  {
    id: 'gbr-sharpness',
    name: 'SHARPNESS',
    flag: 'GBR',
  },
  {
    id: 'gbr-bridlington',
    name: 'BRIDLINGTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-dartmouthharbour',
    name: 'DARTMOUTH HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-overcombe',
    name: 'OVERCOMBE',
    flag: 'GBR',
  },
  {
    id: 'gbr-bosham',
    name: 'BOSHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-neyland',
    name: 'NEYLAND',
    flag: 'GBR',
  },
  {
    id: 'gbr-newcastleupontyne',
    name: 'NEWCASTLE UPON TYNE',
    flag: 'GBR',
  },
  {
    id: 'gbr-portreeharbor',
    name: 'PORTREE HARBOR',
    flag: 'GBR',
  },
  {
    id: 'gbr-gairloch',
    name: 'GAIRLOCH',
    flag: 'GBR',
  },
  {
    id: 'gbr-wareham',
    name: 'WAREHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-seahouses',
    name: 'SEAHOUSES',
    flag: 'GBR',
  },
  {
    id: 'gbr-birdham',
    name: 'BIRDHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-yfelinheli',
    name: 'Y FELINHELI',
    flag: 'GBR',
  },
  {
    id: 'gbr-hunterston',
    name: 'HUNTERSTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-falmouthharbour',
    name: 'FALMOUTH HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-helmsdaleharbor',
    name: 'HELMSDALE HARBOR',
    flag: 'GBR',
  },
  {
    id: 'gbr-corpach',
    name: 'CORPACH',
    flag: 'GBR',
  },
  {
    id: 'gbr-westmersea',
    name: 'WEST MERSEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-rosyth',
    name: 'ROSYTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-karnes',
    name: 'KARNES',
    flag: 'GBR',
  },
  {
    id: 'gbr-dunbar',
    name: 'DUNBAR',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-274',
    name: 'GBR-274',
    flag: 'GBR',
  },
  {
    id: 'gbr-burntisland',
    name: 'BURNTISLAND',
    flag: 'GBR',
  },
  {
    id: 'gbr-yarmouthharbour',
    name: 'YARMOUTH HARBOUR',
    flag: 'GBR',
  },
  {
    id: 'gbr-craignure',
    name: 'CRAIGNURE',
    flag: 'GBR',
  },
  {
    id: 'gbr-ramsgate',
    name: 'RAMSGATE',
    flag: 'GBR',
  },
  {
    id: 'gbr-newlyn',
    name: 'NEWLYN',
    flag: 'GBR',
  },
  {
    id: 'gbr-wandsworth',
    name: 'WANDSWORTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-oilrig',
    name: 'OIL RIG',
    flag: 'GBR',
  },
  {
    id: 'gbr-ramsey',
    name: 'RAMSEY',
    flag: 'GBR',
  },
  {
    id: 'gbr-macduff',
    name: 'MACDUFF',
    flag: 'GBR',
  },
  {
    id: 'gbr-cardiff',
    name: 'CARDIFF',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-338',
    name: 'GBR-338',
    flag: 'GBR',
  },
  {
    id: 'gbr-newport',
    name: 'NEWPORT',
    flag: 'GBR',
  },
  {
    id: 'gbr-dundee',
    name: 'DUNDEE',
    flag: 'GBR',
  },
  {
    id: 'gbr-scapabay',
    name: 'SCAPA BAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-londonderryanchorage',
    name: 'LONDONDERRY ANCHORAGE',
    flag: 'GBR',
  },
  {
    id: 'gbr-westthurrock',
    name: 'WEST THURROCK',
    flag: 'GBR',
  },
  {
    id: 'gbr-anstruther',
    name: 'ANSTRUTHER',
    flag: 'GBR',
  },
  {
    id: 'gbr-ardglass',
    name: 'ARDGLASS',
    flag: 'GBR',
  },
  {
    id: 'gbr-gbr-450',
    name: 'GBR-450',
    flag: 'GBR',
  },
  {
    id: 'gbr-aldeburgh',
    name: 'ALDEBURGH',
    flag: 'GBR',
  },
  {
    id: 'grc-faros',
    name: 'FAROS',
    flag: 'GRC',
  },
  {
    id: 'grc-anafi',
    name: 'ANAFI',
    flag: 'GRC',
  },
  {
    id: 'grc-agioitheodoroi',
    name: 'AGIOI THEODOROI',
    flag: 'GRC',
  },
  {
    id: 'grc-athens',
    name: 'ATHENS',
    flag: 'GRC',
  },
  {
    id: 'grc-vlichadia',
    name: 'VLICHADIA',
    flag: 'GRC',
  },
  {
    id: 'grc-grc-246',
    name: 'GRC-246',
    flag: 'GRC',
  },
  {
    id: 'grc-koufonisos',
    name: 'KOUFONISOS',
    flag: 'GRC',
  },
  {
    id: 'grc-kalamata',
    name: 'KALAMATA',
    flag: 'GRC',
  },
  {
    id: 'grc-skopelos',
    name: 'SKOPELOS',
    flag: 'GRC',
  },
  {
    id: 'grc-ydra',
    name: 'YDRA',
    flag: 'GRC',
  },
  {
    id: 'grc-pilos',
    name: 'PILOS',
    flag: 'GRC',
  },
  {
    id: 'grc-chalki',
    name: 'CHALKI',
    flag: 'GRC',
  },
  {
    id: 'grc-thessaloniki',
    name: 'THESSALONIKI',
    flag: 'GRC',
  },
  {
    id: 'grc-selinia',
    name: 'SELINIA',
    flag: 'GRC',
  },
  {
    id: 'grc-perama',
    name: 'PERAMA',
    flag: 'GRC',
  },
  {
    id: 'grc-patmos',
    name: 'PATMOS',
    flag: 'GRC',
  },
  {
    id: 'grc-dokos',
    name: 'DOKOS',
    flag: 'GRC',
  },
  {
    id: 'grc-akrakavonisi',
    name: 'AKRA KAVONISI',
    flag: 'GRC',
  },
  {
    id: 'grc-souda',
    name: 'SOUDA',
    flag: 'GRC',
  },
  {
    id: 'grc-kefalonia',
    name: 'KEFALONIA',
    flag: 'GRC',
  },
  {
    id: 'grc-palaiaepidavros',
    name: 'PALAIA EPIDAVROS',
    flag: 'GRC',
  },
  {
    id: 'grc-vathis',
    name: 'VATHIS',
    flag: 'GRC',
  },
  {
    id: 'grc-aiyion',
    name: 'AIYION',
    flag: 'GRC',
  },
  {
    id: 'grc-vonitsa',
    name: 'VONITSA',
    flag: 'GRC',
  },
  {
    id: 'grc-drepanon',
    name: 'DREPANON',
    flag: 'GRC',
  },
  {
    id: 'grc-karpathos',
    name: 'KARPATHOS',
    flag: 'GRC',
  },
  {
    id: 'grc-thermi',
    name: 'THERMI',
    flag: 'GRC',
  },
  {
    id: 'grc-kalilimenes',
    name: 'KALI LIMENES',
    flag: 'GRC',
  },
  {
    id: 'grc-marmarion',
    name: 'MARMARION',
    flag: 'GRC',
  },
  {
    id: 'grc-paraliaavlidhos',
    name: 'PARALIA AVLIDHOS',
    flag: 'GRC',
  },
  {
    id: 'grc-piraievs',
    name: 'PIRAIEVS',
    flag: 'GRC',
  },
  {
    id: 'grc-neairaklitsa',
    name: 'NEA IRAKLITSA',
    flag: 'GRC',
  },
  {
    id: 'grc-poros',
    name: 'POROS',
    flag: 'GRC',
  },
  {
    id: 'grc-itea',
    name: 'ITEA',
    flag: 'GRC',
  },
  {
    id: 'grc-amorgos',
    name: 'AMORGOS',
    flag: 'GRC',
  },
  {
    id: 'grc-palaiochora',
    name: 'PALAIOCHORA',
    flag: 'GRC',
  },
  {
    id: 'grc-larimna',
    name: 'LARIMNA',
    flag: 'GRC',
  },
  {
    id: 'grc-stavros',
    name: 'STAVROS',
    flag: 'GRC',
  },
  {
    id: 'grc-loutraki',
    name: 'LOUTRAKI',
    flag: 'GRC',
  },
  {
    id: 'grc-patrai',
    name: 'PATRAI',
    flag: 'GRC',
  },
  {
    id: 'grc-tinos',
    name: 'TINOS',
    flag: 'GRC',
  },
  {
    id: 'grc-sami',
    name: 'SAMI',
    flag: 'GRC',
  },
  {
    id: 'grc-aktibay',
    name: 'AKTI BAY',
    flag: 'GRC',
  },
  {
    id: 'grc-methoni',
    name: 'METHONI',
    flag: 'GRC',
  },
  {
    id: 'grc-chalkissouthanchorage',
    name: 'CHALKIS SOUTH ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'grc-agria',
    name: 'AGRIA',
    flag: 'GRC',
  },
  {
    id: 'grc-yithion',
    name: 'YITHION',
    flag: 'GRC',
  },
  {
    id: 'grc-portocheli',
    name: 'PORTO CHELI',
    flag: 'GRC',
  },
  {
    id: 'grc-pakhioilterminal',
    name: 'PAKHI OIL TERMINAL',
    flag: 'GRC',
  },
  {
    id: 'grc-ialysos',
    name: 'IALYSOS',
    flag: 'GRC',
  },
  {
    id: 'grc-milos',
    name: 'MILOS',
    flag: 'GRC',
  },
  {
    id: 'grc-emporeio',
    name: 'EMPOREIO',
    flag: 'GRC',
  },
  {
    id: 'grc-gouvia',
    name: 'GOUVIA',
    flag: 'GRC',
  },
  {
    id: 'grc-grc-334',
    name: 'GRC-334',
    flag: 'GRC',
  },
  {
    id: 'grc-symi',
    name: 'SYMI',
    flag: 'GRC',
  },
  {
    id: 'grc-chalkis',
    name: 'CHALKIS',
    flag: 'GRC',
  },
  {
    id: 'grc-leipsoi',
    name: 'LEIPSOI',
    flag: 'GRC',
  },
  {
    id: 'grc-vari',
    name: 'VARI',
    flag: 'GRC',
  },
  {
    id: 'grc-plataria',
    name: 'PLATARIA',
    flag: 'GRC',
  },
  {
    id: 'grc-kerkira',
    name: 'KERKIRA',
    flag: 'GRC',
  },
  {
    id: 'grc-ithaki',
    name: 'ITHAKI',
    flag: 'GRC',
  },
  {
    id: 'grc-anomera',
    name: 'ANO MERA',
    flag: 'GRC',
  },
  {
    id: 'grc-limenaria',
    name: 'LIMENARIA',
    flag: 'GRC',
  },
  {
    id: 'grc-frikes',
    name: 'FRIKES',
    flag: 'GRC',
  },
  {
    id: 'grc-salamina',
    name: 'SALAMINA',
    flag: 'GRC',
  },
  {
    id: 'grc-grc-314',
    name: 'GRC-314',
    flag: 'GRC',
  },
  {
    id: 'grc-paros',
    name: 'PAROS',
    flag: 'GRC',
  },
  {
    id: 'grc-antiparos',
    name: 'ANTIPAROS',
    flag: 'GRC',
  },
  {
    id: 'grc-lakki',
    name: 'LAKKI',
    flag: 'GRC',
  },
  {
    id: 'grc-aktaio',
    name: 'AKTAIO',
    flag: 'GRC',
  },
  {
    id: 'grc-kamariotissa',
    name: 'KAMARIOTISSA',
    flag: 'GRC',
  },
  {
    id: 'grc-grc-107',
    name: 'GRC-107',
    flag: 'GRC',
  },
  {
    id: 'grc-voula',
    name: 'VOULA',
    flag: 'GRC',
  },
  {
    id: 'grc-nafpaktos',
    name: 'NAFPAKTOS',
    flag: 'GRC',
  },
  {
    id: 'grc-marathokampos',
    name: 'MARATHOKAMPOS',
    flag: 'GRC',
  },
  {
    id: 'grc-tolon',
    name: 'TOLON',
    flag: 'GRC',
  },
  {
    id: 'grc-patitirion',
    name: 'PATITIRION',
    flag: 'GRC',
  },
  {
    id: 'grc-sikinos',
    name: 'SIKINOS',
    flag: 'GRC',
  },
  {
    id: 'grc-sitia',
    name: 'SITIA',
    flag: 'GRC',
  },
  {
    id: 'grc-pserimos',
    name: 'PSERIMOS',
    flag: 'GRC',
  },
  {
    id: 'grc-aegina',
    name: 'AEGINA',
    flag: 'GRC',
  },
  {
    id: 'grc-navplio',
    name: 'NAVPLIO',
    flag: 'GRC',
  },
  {
    id: 'grc-pithagorion',
    name: 'PITHAGORION',
    flag: 'GRC',
  },
  {
    id: 'grc-folegandros',
    name: 'FOLEGANDROS',
    flag: 'GRC',
  },
  {
    id: 'grc-karystosanchorage',
    name: 'KARYSTOS ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'grc-antirrio',
    name: 'ANTIRRIO',
    flag: 'GRC',
  },
  {
    id: 'grc-rodos',
    name: 'RODOS',
    flag: 'GRC',
  },
  {
    id: 'grc-alimos',
    name: 'ALIMOS',
    flag: 'GRC',
  },
  {
    id: 'grc-ormosaliveriou',
    name: 'ORMOS ALIVERIOU',
    flag: 'GRC',
  },
  {
    id: 'grc-kypseli',
    name: 'KYPSELI',
    flag: 'GRC',
  },
  {
    id: 'grc-loutraaidhipsou',
    name: 'LOUTRA AIDHIPSOU',
    flag: 'GRC',
  },
  {
    id: 'grc-kalymnos',
    name: 'KALYMNOS',
    flag: 'GRC',
  },
  {
    id: 'grc-ios',
    name: 'IOS',
    flag: 'GRC',
  },
  {
    id: 'grc-lagos',
    name: 'LAGOS',
    flag: 'GRC',
  },
  {
    id: 'grc-koroni',
    name: 'KORONI',
    flag: 'GRC',
  },
  {
    id: 'grc-stilis',
    name: 'STILIS',
    flag: 'GRC',
  },
  {
    id: 'grc-grc-187',
    name: 'GRC-187',
    flag: 'GRC',
  },
  {
    id: 'grc-naousa',
    name: 'NAOUSA',
    flag: 'GRC',
  },
  {
    id: 'grc-vouliagmeni',
    name: 'VOULIAGMENI',
    flag: 'GRC',
  },
  {
    id: 'grc-antikyra',
    name: 'ANTIKYRA',
    flag: 'GRC',
  },
  {
    id: 'grc-grc-257',
    name: 'GRC-257',
    flag: 'GRC',
  },
  {
    id: 'grc-oia',
    name: 'OIA',
    flag: 'GRC',
  },
  {
    id: 'grc-agiagalini',
    name: 'AGIA GALINI',
    flag: 'GRC',
  },
  {
    id: 'grc-fournoi',
    name: 'FOURNOI',
    flag: 'GRC',
  },
  {
    id: 'grc-spetses',
    name: 'SPETSES',
    flag: 'GRC',
  },
  {
    id: 'grc-koilas',
    name: 'KOILAS',
    flag: 'GRC',
  },
  {
    id: 'grc-grc-77',
    name: 'GRC-77',
    flag: 'GRC',
  },
  {
    id: 'grc-anosyros',
    name: 'ANO SYROS',
    flag: 'GRC',
  },
  {
    id: 'grc-agiosgeorgis',
    name: 'AGIOS GEORGIS',
    flag: 'GRC',
  },
  {
    id: 'grc-vatika',
    name: 'VATIKA',
    flag: 'GRC',
  },
  {
    id: 'grc-agiosefstratios',
    name: 'AGIOS EFSTRATIOS',
    flag: 'GRC',
  },
  {
    id: 'grc-fry',
    name: 'FRY',
    flag: 'GRC',
  },
  {
    id: 'grc-neakarvali',
    name: 'NEA KARVALI',
    flag: 'GRC',
  },
  {
    id: 'grc-ermioni',
    name: 'ERMIONI',
    flag: 'GRC',
  },
  {
    id: 'grc-chania',
    name: 'CHANIA',
    flag: 'GRC',
  },
  {
    id: 'grc-astakos',
    name: 'ASTAKOS',
    flag: 'GRC',
  },
  {
    id: 'grc-iraklion',
    name: 'IRAKLION',
    flag: 'GRC',
  },
  {
    id: 'grc-neakallikrateia',
    name: 'NEA KALLIKRATEIA',
    flag: 'GRC',
  },
  {
    id: 'grc-dia',
    name: 'DIA',
    flag: 'GRC',
  },
  {
    id: 'grc-gavrio',
    name: 'GAVRIO',
    flag: 'GRC',
  },
  {
    id: 'grc-agioskirykos',
    name: 'AGIOS KIRYKOS',
    flag: 'GRC',
  },
  {
    id: 'grc-oinousses',
    name: 'OINOUSSES',
    flag: 'GRC',
  },
  {
    id: 'grc-neapolivoion',
    name: 'NEAPOLI VOION',
    flag: 'GRC',
  },
  {
    id: 'grc-plomarion',
    name: 'PLOMARION',
    flag: 'GRC',
  },
  {
    id: 'grc-kynopiastes',
    name: 'KYNOPIASTES',
    flag: 'GRC',
  },
  {
    id: 'grc-grc-343',
    name: 'GRC-343',
    flag: 'GRC',
  },
  {
    id: 'grc-psachna',
    name: 'PSACHNA',
    flag: 'GRC',
  },
  {
    id: 'grc-neapoteidaia',
    name: 'NEA POTEIDAIA',
    flag: 'GRC',
  },
  {
    id: 'grc-megisti',
    name: 'MEGISTI',
    flag: 'GRC',
  },
  {
    id: 'grc-serifos',
    name: 'SERIFOS',
    flag: 'GRC',
  },
  {
    id: 'grc-galaxidhion',
    name: 'GALAXIDHION',
    flag: 'GRC',
  },
  {
    id: 'grc-katoachaia',
    name: 'KATO ACHAIA',
    flag: 'GRC',
  },
  {
    id: 'grc-grc-214',
    name: 'GRC-214',
    flag: 'GRC',
  },
  {
    id: 'grc-kalochori',
    name: 'KALOCHORI',
    flag: 'GRC',
  },
  {
    id: 'grc-elevsis',
    name: 'ELEVSIS',
    flag: 'GRC',
  },
  {
    id: 'grc-mitilini',
    name: 'MITILINI',
    flag: 'GRC',
  },
  {
    id: 'grc-volos',
    name: 'VOLOS',
    flag: 'GRC',
  },
  {
    id: 'grc-thasos',
    name: 'THASOS',
    flag: 'GRC',
  },
  {
    id: 'grc-mandraki',
    name: 'MANDRAKI',
    flag: 'GRC',
  },
  {
    id: 'grc-lavrio',
    name: 'LAVRIO',
    flag: 'GRC',
  },
  {
    id: 'grc-keramoti',
    name: 'KERAMOTI',
    flag: 'GRC',
  },
  {
    id: 'grc-oreoi',
    name: 'OREOI',
    flag: 'GRC',
  },
  {
    id: 'grc-kalimnos',
    name: 'KALIMNOS',
    flag: 'GRC',
  },
  {
    id: 'grc-tsingeli',
    name: 'TSINGELI',
    flag: 'GRC',
  },
  {
    id: 'grc-neonkarlovas',
    name: 'NEON KARLOVAS',
    flag: 'GRC',
  },
  {
    id: 'grc-elliniko',
    name: 'ELLINIKO',
    flag: 'GRC',
  },
  {
    id: 'grc-lefkada',
    name: 'LEFKADA',
    flag: 'GRC',
  },
  {
    id: 'grc-preveza',
    name: 'PREVEZA',
    flag: 'GRC',
  },
  {
    id: 'grc-achladi',
    name: 'ACHLADI',
    flag: 'GRC',
  },
  {
    id: 'grc-kythira',
    name: 'KYTHIRA',
    flag: 'GRC',
  },
  {
    id: 'grc-palaiofaliro',
    name: 'PALAIO FALIRO',
    flag: 'GRC',
  },
  {
    id: 'grc-kyllini',
    name: 'KYLLINI',
    flag: 'GRC',
  },
  {
    id: 'grc-kioni',
    name: 'KIONI',
    flag: 'GRC',
  },
  {
    id: 'grc-loutra',
    name: 'LOUTRA',
    flag: 'GRC',
  },
  {
    id: 'grc-palairos',
    name: 'PALAIROS',
    flag: 'GRC',
  },
  {
    id: 'grc-neamichaniona',
    name: 'NEA MICHANIONA',
    flag: 'GRC',
  },
  {
    id: 'grc-megaraoilterminal',
    name: 'MEGARA OIL TERMINAL',
    flag: 'GRC',
  },
  {
    id: 'grc-kavala',
    name: 'KAVALA',
    flag: 'GRC',
  },
  {
    id: 'grc-liminsirou',
    name: 'LIMIN SIROU',
    flag: 'GRC',
  },
  {
    id: 'grc-kimolos',
    name: 'KIMOLOS',
    flag: 'GRC',
  },
  {
    id: 'grc-kythnos',
    name: 'KYTHNOS',
    flag: 'GRC',
  },
  {
    id: 'grc-ayiosnikolaos',
    name: 'AYIOS NIKOLAOS',
    flag: 'GRC',
  },
  {
    id: 'grc-khios',
    name: 'KHIOS',
    flag: 'GRC',
  },
  {
    id: 'grc-neamoudhania',
    name: 'NEA MOUDHANIA',
    flag: 'GRC',
  },
  {
    id: 'grc-schismaeloundas',
    name: 'SCHISMA ELOUNDAS',
    flag: 'GRC',
  },
  {
    id: 'grc-liminmesoyaias',
    name: 'LIMIN MESOYAIAS',
    flag: 'GRC',
  },
  {
    id: 'grc-gazi',
    name: 'GAZI',
    flag: 'GRC',
  },
  {
    id: 'grc-palaiafokaia',
    name: 'PALAIA FOKAIA',
    flag: 'GRC',
  },
  {
    id: 'grc-ithaca',
    name: 'ITHACA',
    flag: 'GRC',
  },
  {
    id: 'grc-parga',
    name: 'PARGA',
    flag: 'GRC',
  },
  {
    id: 'grc-mandra',
    name: 'MANDRA',
    flag: 'GRC',
  },
  {
    id: 'grc-soudha',
    name: 'SOUDHA',
    flag: 'GRC',
  },
  {
    id: 'grc-glyfada',
    name: 'GLYFADA',
    flag: 'GRC',
  },
  {
    id: 'grc-ornos',
    name: 'ORNOS',
    flag: 'GRC',
  },
  {
    id: 'grc-nisosnaxos',
    name: 'NISOS NAXOS',
    flag: 'GRC',
  },
  {
    id: 'grc-liminkos',
    name: 'LIMIN KOS',
    flag: 'GRC',
  },
  {
    id: 'grc-kalamaria',
    name: 'KALAMARIA',
    flag: 'GRC',
  },
  {
    id: 'grc-neaartaki',
    name: 'NEA ARTAKI',
    flag: 'GRC',
  },
  {
    id: 'grc-alexandroupoli',
    name: 'ALEXANDROUPOLI',
    flag: 'GRC',
  },
  {
    id: 'grc-elefsina',
    name: 'ELEFSINA',
    flag: 'GRC',
  },
  {
    id: 'grc-myrina',
    name: 'MYRINA',
    flag: 'GRC',
  },
  {
    id: 'grc-skala',
    name: 'SKALA',
    flag: 'GRC',
  },
  {
    id: 'grc-mikonos',
    name: 'MIKONOS',
    flag: 'GRC',
  },
  {
    id: 'grc-galatas',
    name: 'GALATAS',
    flag: 'GRC',
  },
  {
    id: 'grc-lardos',
    name: 'LARDOS',
    flag: 'GRC',
  },
  {
    id: 'grc-mesolongion',
    name: 'MESOLONGION',
    flag: 'GRC',
  },
  {
    id: 'grc-kefalos',
    name: 'KEFALOS',
    flag: 'GRC',
  },
  {
    id: 'grc-leonidio',
    name: 'LEONIDIO',
    flag: 'GRC',
  },
  {
    id: 'grc-rodhos',
    name: 'RODHOS',
    flag: 'GRC',
  },
  {
    id: 'grc-gefyra',
    name: 'GEFYRA',
    flag: 'GRC',
  },
  {
    id: 'grc-keratsini',
    name: 'KERATSINI',
    flag: 'GRC',
  },
  {
    id: 'grc-zakynthos',
    name: 'ZAKYNTHOS',
    flag: 'GRC',
  },
  {
    id: 'grc-kyparissia',
    name: 'KYPARISSIA',
    flag: 'GRC',
  },
  {
    id: 'grc-grc-374',
    name: 'GRC-374',
    flag: 'GRC',
  },
  {
    id: 'grc-argostolion',
    name: 'ARGOSTOLION',
    flag: 'GRC',
  },
  {
    id: 'grc-kardamaina',
    name: 'KARDAMAINA',
    flag: 'GRC',
  },
  {
    id: 'grc-skiathos',
    name: 'SKIATHOS',
    flag: 'GRC',
  },
  {
    id: 'grc-rethimnon',
    name: 'RETHIMNON',
    flag: 'GRC',
  },
  {
    id: 'grc-katakolon',
    name: 'KATAKOLON',
    flag: 'GRC',
  },
  {
    id: 'grc-lithakia',
    name: 'LITHAKIA',
    flag: 'GRC',
  },
  {
    id: 'grc-kymi',
    name: 'KYMI',
    flag: 'GRC',
  },
  {
    id: 'grc-fira',
    name: 'FIRA',
    flag: 'GRC',
  },
  {
    id: 'grc-samos',
    name: 'SAMOS',
    flag: 'GRC',
  },
  {
    id: 'grc-kiato',
    name: 'KIATO',
    flag: 'GRC',
  },
  {
    id: 'grc-mesaria',
    name: 'MESARIA',
    flag: 'GRC',
  },
  {
    id: 'grc-katastarion',
    name: 'KATASTARION',
    flag: 'GRC',
  },
  {
    id: 'grc-isthmia',
    name: 'ISTHMIA',
    flag: 'GRC',
  },
  {
    id: 'grc-megalochorio',
    name: 'MEGALO CHORIO',
    flag: 'GRC',
  },
  {
    id: 'grc-gaios',
    name: 'GAIOS',
    flag: 'GRC',
  },
  {
    id: 'grc-neaperamos',
    name: 'NEA PERAMOS',
    flag: 'GRC',
  },
  {
    id: 'grc-igoumenitsa',
    name: 'IGOUMENITSA',
    flag: 'GRC',
  },
  {
    id: 'grc-grc-272',
    name: 'GRC-272',
    flag: 'GRC',
  },
  {
    id: 'grc-rafina',
    name: 'RAFINA',
    flag: 'GRC',
  },
  {
    id: 'grc-perivoli',
    name: 'PERIVOLI',
    flag: 'GRC',
  },
  {
    id: 'grc-korinthos',
    name: 'KORINTHOS',
    flag: 'GRC',
  },
  {
    id: 'grc-aspropirgos',
    name: 'ASPROPIRGOS',
    flag: 'GRC',
  },
  {
    id: 'hrv-podstrana',
    name: 'PODSTRANA',
    flag: 'HRV',
  },
  {
    id: 'hrv-primosten',
    name: 'PRIMOSTEN',
    flag: 'HRV',
  },
  {
    id: 'hrv-vrgada',
    name: 'VRGADA',
    flag: 'HRV',
  },
  {
    id: 'hrv-jesenice',
    name: 'JESENICE',
    flag: 'HRV',
  },
  {
    id: 'hrv-ist',
    name: 'IST',
    flag: 'HRV',
  },
  {
    id: 'hrv-vodice',
    name: 'VODICE',
    flag: 'HRV',
  },
  {
    id: 'hrv-funtana',
    name: 'FUNTANA',
    flag: 'HRV',
  },
  {
    id: 'hrv-mljet',
    name: 'MLJET',
    flag: 'HRV',
  },
  {
    id: 'hrv-opatija',
    name: 'OPATIJA',
    flag: 'HRV',
  },
  {
    id: 'hrv-drvenikmali',
    name: 'DRVENIK MALI',
    flag: 'HRV',
  },
  {
    id: 'hrv-iz',
    name: 'IZ',
    flag: 'HRV',
  },
  {
    id: 'hrv-makarska',
    name: 'MAKARSKA',
    flag: 'HRV',
  },
  {
    id: 'hrv-zlarin',
    name: 'ZLARIN',
    flag: 'HRV',
  },
  {
    id: 'hrv-cibaca',
    name: 'CIBACA',
    flag: 'HRV',
  },
  {
    id: 'hrv-postira',
    name: 'POSTIRA',
    flag: 'HRV',
  },
  {
    id: 'hrv-ilovik',
    name: 'ILOVIK',
    flag: 'HRV',
  },
  {
    id: 'hrv-supetar',
    name: 'SUPETAR',
    flag: 'HRV',
  },
  {
    id: 'hrv-vukovar',
    name: 'VUKOVAR',
    flag: 'HRV',
  },
  {
    id: 'hrv-rab',
    name: 'RAB',
    flag: 'HRV',
  },
  {
    id: 'hrv-donjiseget',
    name: 'DONJI SEGET',
    flag: 'HRV',
  },
  {
    id: 'hrv-cavtat',
    name: 'CAVTAT',
    flag: 'HRV',
  },
  {
    id: 'hrv-komiza',
    name: 'KOMIZA',
    flag: 'HRV',
  },
  {
    id: 'hrv-premantura',
    name: 'PREMANTURA',
    flag: 'HRV',
  },
  {
    id: 'hrv-vis',
    name: 'VIS',
    flag: 'HRV',
  },
  {
    id: 'hrv-molat',
    name: 'MOLAT',
    flag: 'HRV',
  },
  {
    id: 'hrv-punat',
    name: 'PUNAT',
    flag: 'HRV',
  },
  {
    id: 'hrv-silba',
    name: 'SILBA',
    flag: 'HRV',
  },
  {
    id: 'hrv-solta',
    name: 'SOLTA',
    flag: 'HRV',
  },
  {
    id: 'hrv-slano',
    name: 'SLANO',
    flag: 'HRV',
  },
  {
    id: 'hrv-kastelsucurac',
    name: 'KASTEL SUCURAC',
    flag: 'HRV',
  },
  {
    id: 'hrv-brsica',
    name: 'BRSICA',
    flag: 'HRV',
  },
  {
    id: 'hrv-umag',
    name: 'UMAG',
    flag: 'HRV',
  },
  {
    id: 'hrv-losinj',
    name: 'LOSINJ',
    flag: 'HRV',
  },
  {
    id: 'hrv-sukosan',
    name: 'SUKOSAN',
    flag: 'HRV',
  },
  {
    id: 'hrv-plomin',
    name: 'PLOMIN',
    flag: 'HRV',
  },
  {
    id: 'hrv-sibenik',
    name: 'SIBENIK',
    flag: 'HRV',
  },
  {
    id: 'hrv-sucuraj',
    name: 'SUCURAJ',
    flag: 'HRV',
  },
  {
    id: 'hrv-zirje',
    name: 'ZIRJE',
    flag: 'HRV',
  },
  {
    id: 'hrv-olib',
    name: 'OLIB',
    flag: 'HRV',
  },
  {
    id: 'hrv-skradin',
    name: 'SKRADIN',
    flag: 'HRV',
  },
  {
    id: 'hrv-trogir',
    name: 'TROGIR',
    flag: 'HRV',
  },
  {
    id: 'hrv-brac',
    name: 'BRAC',
    flag: 'HRV',
  },
  {
    id: 'hrv-kornati',
    name: 'KORNATI',
    flag: 'HRV',
  },
  {
    id: 'hrv-korcula',
    name: 'KORCULA',
    flag: 'HRV',
  },
  {
    id: 'hrv-hrv-68',
    name: 'HRV-68',
    flag: 'HRV',
  },
  {
    id: 'hrv-lumbarda',
    name: 'LUMBARDA',
    flag: 'HRV',
  },
  {
    id: 'hrv-vranjic',
    name: 'VRANJIC',
    flag: 'HRV',
  },
  {
    id: 'hrv-omisalj',
    name: 'OMISALJ',
    flag: 'HRV',
  },
  {
    id: 'hrv-bibinje',
    name: 'BIBINJE',
    flag: 'HRV',
  },
  {
    id: 'hrv-kostrena',
    name: 'KOSTRENA',
    flag: 'HRV',
  },
  {
    id: 'hrv-bilice',
    name: 'BILICE',
    flag: 'HRV',
  },
  {
    id: 'hrv-ploce',
    name: 'PLOCE',
    flag: 'HRV',
  },
  {
    id: 'hrv-starigrad',
    name: 'STARI GRAD',
    flag: 'HRV',
  },
  {
    id: 'hrv-preko',
    name: 'PREKO',
    flag: 'HRV',
  },
  {
    id: 'hrv-lastovo',
    name: 'LASTOVO',
    flag: 'HRV',
  },
  {
    id: 'hrv-sipan',
    name: 'SIPAN',
    flag: 'HRV',
  },
  {
    id: 'hrv-rabac',
    name: 'RABAC',
    flag: 'HRV',
  },
  {
    id: 'hrv-lovran',
    name: 'LOVRAN',
    flag: 'HRV',
  },
  {
    id: 'hrv-pucisca',
    name: 'PUCISCA',
    flag: 'HRV',
  },
  {
    id: 'hrv-molunat',
    name: 'MOLUNAT',
    flag: 'HRV',
  },
  {
    id: 'hrv-ugljan',
    name: 'UGLJAN',
    flag: 'HRV',
  },
  {
    id: 'hrv-susak',
    name: 'SUSAK',
    flag: 'HRV',
  },
  {
    id: 'hrv-hrv-22',
    name: 'HRV-22',
    flag: 'HRV',
  },
  {
    id: 'hrv-marina',
    name: 'MARINA',
    flag: 'HRV',
  },
  {
    id: 'hrv-janjina',
    name: 'JANJINA',
    flag: 'HRV',
  },
  {
    id: 'hrv-otokscedro',
    name: 'OTOK SCEDRO',
    flag: 'HRV',
  },
  {
    id: 'hrv-dubrovnik',
    name: 'DUBROVNIK',
    flag: 'HRV',
  },
  {
    id: 'hrv-porec',
    name: 'POREC',
    flag: 'HRV',
  },
  {
    id: 'hrv-vrsar',
    name: 'VRSAR',
    flag: 'HRV',
  },
  {
    id: 'hrv-kastelkambelovac',
    name: 'KASTEL KAMBELOVAC',
    flag: 'HRV',
  },
  {
    id: 'hrv-zaton',
    name: 'ZATON',
    flag: 'HRV',
  },
  {
    id: 'hrv-dugiotok',
    name: 'DUGI OTOK',
    flag: 'HRV',
  },
  {
    id: 'hrv-premuda',
    name: 'PREMUDA',
    flag: 'HRV',
  },
  {
    id: 'hrv-split',
    name: 'SPLIT',
    flag: 'HRV',
  },
  {
    id: 'hrv-fazana',
    name: 'FAZANA',
    flag: 'HRV',
  },
  {
    id: 'hrv-jelsa',
    name: 'JELSA',
    flag: 'HRV',
  },
  {
    id: 'hrv-pula',
    name: 'PULA',
    flag: 'HRV',
  },
  {
    id: 'hrv-rovinj',
    name: 'ROVINJ',
    flag: 'HRV',
  },
  {
    id: 'hrv-bol',
    name: 'BOL',
    flag: 'HRV',
  },
  {
    id: 'hrv-erdut',
    name: 'ERDUT',
    flag: 'HRV',
  },
  {
    id: 'hrv-hrv-183',
    name: 'HRV-183',
    flag: 'HRV',
  },
  {
    id: 'hrv-krk',
    name: 'KRK',
    flag: 'HRV',
  },
  {
    id: 'hrv-hvar',
    name: 'HVAR',
    flag: 'HRV',
  },
  {
    id: 'hrv-velaluka',
    name: 'VELA LUKA',
    flag: 'HRV',
  },
  {
    id: 'hrv-orebic',
    name: 'OREBIC',
    flag: 'HRV',
  },
  {
    id: 'hrv-grebastica',
    name: 'GREBASTICA',
    flag: 'HRV',
  },
  {
    id: 'hrv-dugirat',
    name: 'DUGI RAT',
    flag: 'HRV',
  },
  {
    id: 'hrv-ston',
    name: 'STON',
    flag: 'HRV',
  },
  {
    id: 'hrv-kraljevica',
    name: 'KRALJEVICA',
    flag: 'HRV',
  },
  {
    id: 'hrv-rijekaluka',
    name: 'RIJEKA LUKA',
    flag: 'HRV',
  },
  {
    id: 'hrv-rogoznica',
    name: 'ROGOZNICA',
    flag: 'HRV',
  },
  {
    id: 'hrv-cres',
    name: 'CRES',
    flag: 'HRV',
  },
  {
    id: 'hrv-kali',
    name: 'KALI',
    flag: 'HRV',
  },
  {
    id: 'hrv-njivice',
    name: 'NJIVICE',
    flag: 'HRV',
  },
  {
    id: 'hrv-novigrad',
    name: 'NOVIGRAD',
    flag: 'HRV',
  },
  {
    id: 'hrv-okruggornji',
    name: 'OKRUG GORNJI',
    flag: 'HRV',
  },
  {
    id: 'hrv-zadar',
    name: 'ZADAR',
    flag: 'HRV',
  },
  {
    id: 'hrv-milna',
    name: 'MILNA',
    flag: 'HRV',
  },
  {
    id: 'hrv-borovo',
    name: 'BOROVO',
    flag: 'HRV',
  },
  {
    id: 'hrv-zut',
    name: 'ZUT',
    flag: 'HRV',
  },
  {
    id: 'hrv-otokkaprije',
    name: 'OTOK KAPRIJE',
    flag: 'HRV',
  },
  {
    id: 'hrv-tribunj',
    name: 'TRIBUNJ',
    flag: 'HRV',
  },
  {
    id: 'hrv-biogradnamoru',
    name: 'BIOGRAD NA MORU',
    flag: 'HRV',
  },
  {
    id: 'hrv-selca',
    name: 'SELCA',
    flag: 'HRV',
  },
  {
    id: 'hrv-tisno',
    name: 'TISNO',
    flag: 'HRV',
  },
  {
    id: 'hrv-bakar',
    name: 'BAKAR',
    flag: 'HRV',
  },
  {
    id: 'hrv-murter',
    name: 'MURTER',
    flag: 'HRV',
  },
  {
    id: 'hrv-sali',
    name: 'SALI',
    flag: 'HRV',
  },
  {
    id: 'hrv-kastelgomilica',
    name: 'KASTEL GOMILICA',
    flag: 'HRV',
  },
  {
    id: 'hrv-velikidrvenik',
    name: 'VELIKI DRVENIK',
    flag: 'HRV',
  },
  {
    id: 'idn-palembang',
    name: 'PALEMBANG',
    flag: 'IDN',
  },
  {
    id: 'idn-glondonggede',
    name: 'GLONDONGGEDE',
    flag: 'IDN',
  },
  {
    id: 'idn-amurang',
    name: 'AMURANG',
    flag: 'IDN',
  },
  {
    id: 'idn-pulausambu',
    name: 'PULAU SAMBU',
    flag: 'IDN',
  },
  {
    id: 'idn-namlea',
    name: 'NAMLEA',
    flag: 'IDN',
  },
  {
    id: 'idn-sabang',
    name: 'SABANG',
    flag: 'IDN',
  },
  {
    id: 'idn-kepuh',
    name: 'KEPUH',
    flag: 'IDN',
  },
  {
    id: 'idn-bangsalaceh',
    name: 'BANGSAL ACEH',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-376',
    name: 'IDN-376',
    flag: 'IDN',
  },
  {
    id: 'idn-nabire',
    name: 'NABIRE',
    flag: 'IDN',
  },
  {
    id: 'idn-bade',
    name: 'BADE',
    flag: 'IDN',
  },
  {
    id: 'idn-tawang',
    name: 'TAWANG',
    flag: 'IDN',
  },
  {
    id: 'idn-kualaenok',
    name: 'KUALA ENOK',
    flag: 'IDN',
  },
  {
    id: 'idn-muria',
    name: 'MURIA',
    flag: 'IDN',
  },
  {
    id: 'idn-kranji',
    name: 'KRANJI',
    flag: 'IDN',
  },
  {
    id: 'idn-semiring',
    name: 'SEMIRING',
    flag: 'IDN',
  },
  {
    id: 'idn-kampungbarutengah',
    name: 'KAMPUNG BARU TENGAH',
    flag: 'IDN',
  },
  {
    id: 'idn-sibolga',
    name: 'SIBOLGA',
    flag: 'IDN',
  },
  {
    id: 'idn-cilacap',
    name: 'CILACAP',
    flag: 'IDN',
  },
  {
    id: 'idn-kubangkepuh',
    name: 'KUBANGKEPUH',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-352',
    name: 'IDN-352',
    flag: 'IDN',
  },
  {
    id: 'idn-samarinda',
    name: 'SAMARINDA',
    flag: 'IDN',
  },
  {
    id: 'idn-hantipan',
    name: 'HANTIPAN',
    flag: 'IDN',
  },
  {
    id: 'idn-gresik',
    name: 'GRESIK',
    flag: 'IDN',
  },
  {
    id: 'idn-muarasungaibaturusa',
    name: 'MUARA SUNGAI BATURUSA',
    flag: 'IDN',
  },
  {
    id: 'idn-eretanwetan',
    name: 'ERETAN WETAN',
    flag: 'IDN',
  },
  {
    id: 'idn-polengoilfield',
    name: 'POLENG OIL FIELD',
    flag: 'IDN',
  },
  {
    id: 'idn-buhanpomako',
    name: 'BUHAN POMAKO',
    flag: 'IDN',
  },
  {
    id: 'idn-tolitoli',
    name: 'TOLITOLI',
    flag: 'IDN',
  },
  {
    id: 'idn-tobelo',
    name: 'TOBELO',
    flag: 'IDN',
  },
  {
    id: 'idn-luwuk',
    name: 'LUWUK',
    flag: 'IDN',
  },
  {
    id: 'idn-lampulo',
    name: 'LAMPULO',
    flag: 'IDN',
  },
  {
    id: 'idn-lembar',
    name: 'LEMBAR',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjunguban',
    name: 'TANJUNGUBAN',
    flag: 'IDN',
  },
  {
    id: 'idn-sampit',
    name: 'SAMPIT',
    flag: 'IDN',
  },
  {
    id: 'idn-labuan',
    name: 'LABUAN',
    flag: 'IDN',
  },
  {
    id: 'idn-bayah',
    name: 'BAYAH',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjungsekong',
    name: 'TANJUNG SEKONG',
    flag: 'IDN',
  },
  {
    id: 'idn-dobo',
    name: 'DOBO',
    flag: 'IDN',
  },
  {
    id: 'idn-tinanggea',
    name: 'TINANGGEA',
    flag: 'IDN',
  },
  {
    id: 'idn-labuhanmaringgai',
    name: 'LABUHAN MARINGGAI',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-420',
    name: 'IDN-420',
    flag: 'IDN',
  },
  {
    id: 'idn-balikpapan',
    name: 'BALIKPAPAN',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-277',
    name: 'IDN-277',
    flag: 'IDN',
  },
  {
    id: 'idn-ampenan',
    name: 'AMPENAN',
    flag: 'IDN',
  },
  {
    id: 'idn-ambon',
    name: 'AMBON',
    flag: 'IDN',
  },
  {
    id: 'idn-bitung',
    name: 'BITUNG',
    flag: 'IDN',
  },
  {
    id: 'idn-bima',
    name: 'BIMA',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-204',
    name: 'IDN-204',
    flag: 'IDN',
  },
  {
    id: 'idn-oebakupang',
    name: 'OEBA KUPANG',
    flag: 'IDN',
  },
  {
    id: 'idn-banjarkawan',
    name: 'BANJAR KAWAN',
    flag: 'IDN',
  },
  {
    id: 'idn-getentiri',
    name: 'GETENTIRI',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-395',
    name: 'IDN-395',
    flag: 'IDN',
  },
  {
    id: 'idn-pekalongan',
    name: 'PEKALONGAN',
    flag: 'IDN',
  },
  {
    id: 'idn-wadas',
    name: 'WADAS',
    flag: 'IDN',
  },
  {
    id: 'idn-merauke',
    name: 'MERAUKE',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjungpandan',
    name: 'TANJUNG PANDAN',
    flag: 'IDN',
  },
  {
    id: 'idn-palaran',
    name: 'PALARAN',
    flag: 'IDN',
  },
  {
    id: 'idn-batupanjang',
    name: 'BATU PANJANG',
    flag: 'IDN',
  },
  {
    id: 'idn-waingapu',
    name: 'WAINGAPU',
    flag: 'IDN',
  },
  {
    id: 'idn-batam',
    name: 'BATAM',
    flag: 'IDN',
  },
  {
    id: 'idn-dulanpok-pok',
    name: 'DULAN POK-POK',
    flag: 'IDN',
  },
  {
    id: 'idn-jakabaring',
    name: 'JAKABARING',
    flag: 'IDN',
  },
  {
    id: 'idn-hamadi',
    name: 'HAMADI',
    flag: 'IDN',
  },
  {
    id: 'idn-kendari',
    name: 'KENDARI',
    flag: 'IDN',
  },
  {
    id: 'idn-sanggeng',
    name: 'SANGGENG',
    flag: 'IDN',
  },
  {
    id: 'idn-lengkong',
    name: 'LENGKONG',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjungbenete',
    name: 'TANJUNG BENETE',
    flag: 'IDN',
  },
  {
    id: 'idn-pondokdadap',
    name: 'PONDOK DADAP',
    flag: 'IDN',
  },
  {
    id: 'idn-waipare',
    name: 'WAIPARE',
    flag: 'IDN',
  },
  {
    id: 'idn-klidanglor',
    name: 'KLIDANG LOR',
    flag: 'IDN',
  },
  {
    id: 'idn-prigi',
    name: 'PRIGI',
    flag: 'IDN',
  },
  {
    id: 'idn-northpulaulautcoalterminal',
    name: 'NORTH PULAU LAUT COAL TERMINAL',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-152',
    name: 'IDN-152',
    flag: 'IDN',
  },
  {
    id: 'idn-telukbatang',
    name: 'TELUK BATANG',
    flag: 'IDN',
  },
  {
    id: 'idn-baubau',
    name: 'BAUBAU',
    flag: 'IDN',
  },
  {
    id: 'idn-ternate',
    name: 'TERNATE',
    flag: 'IDN',
  },
  {
    id: 'idn-desalalang',
    name: 'DESA LALANG',
    flag: 'IDN',
  },
  {
    id: 'idn-sentul',
    name: 'SENTUL',
    flag: 'IDN',
  },
  {
    id: 'idn-tahuna',
    name: 'TAHUNA',
    flag: 'IDN',
  },
  {
    id: 'idn-bawean',
    name: 'BAWEAN',
    flag: 'IDN',
  },
  {
    id: 'idn-kumai',
    name: 'KUMAI',
    flag: 'IDN',
  },
  {
    id: 'idn-jungutbatukajadua',
    name: 'JUNGUTBATU KAJA DUA',
    flag: 'IDN',
  },
  {
    id: 'idn-ketapang',
    name: 'KETAPANG',
    flag: 'IDN',
  },
  {
    id: 'idn-tarakan(tengkayuii)',
    name: 'TARAKAN (TENGKAYU II)',
    flag: 'IDN',
  },
  {
    id: 'idn-barelang',
    name: 'BARELANG',
    flag: 'IDN',
  },
  {
    id: 'idn-ukularang',
    name: 'UKULARANG',
    flag: 'IDN',
  },
  {
    id: 'idn-batulicin',
    name: 'BATULICIN',
    flag: 'IDN',
  },
  {
    id: 'idn-kalibone',
    name: 'KALIBONE',
    flag: 'IDN',
  },
  {
    id: 'idn-surabaya',
    name: 'SURABAYA',
    flag: 'IDN',
  },
  {
    id: 'idn-labuanuki',
    name: 'LABUAN UKI',
    flag: 'IDN',
  },
  {
    id: 'idn-bontanglngterminal',
    name: 'BONTANG LNG TERMINAL',
    flag: 'IDN',
  },
  {
    id: 'idn-jambula',
    name: 'JAMBULA',
    flag: 'IDN',
  },
  {
    id: 'idn-tabunganen',
    name: 'TABUNGANEN',
    flag: 'IDN',
  },
  {
    id: 'idn-plajuanchorage',
    name: 'PLAJU ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-dumai',
    name: 'DUMAI',
    flag: 'IDN',
  },
  {
    id: 'idn-tambakmulyo',
    name: 'TAMBAK MULYO',
    flag: 'IDN',
  },
  {
    id: 'idn-paiton',
    name: 'PAITON',
    flag: 'IDN',
  },
  {
    id: 'idn-sumberrejo',
    name: 'SUMBERREJO',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-98',
    name: 'IDN-98',
    flag: 'IDN',
  },
  {
    id: 'idn-masohi',
    name: 'MASOHI',
    flag: 'IDN',
  },
  {
    id: 'idn-kaimana',
    name: 'KAIMANA',
    flag: 'IDN',
  },
  {
    id: 'idn-labuhansumbawa',
    name: 'LABUHANSUMBAWA',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-368',
    name: 'IDN-368',
    flag: 'IDN',
  },
  {
    id: 'idn-serui',
    name: 'SERUI',
    flag: 'IDN',
  },
  {
    id: 'idn-cigading',
    name: 'CIGADING',
    flag: 'IDN',
  },
  {
    id: 'idn-ujungpandang',
    name: 'UJUNG PANDANG',
    flag: 'IDN',
  },
  {
    id: 'idn-pulokali',
    name: 'PULO KALI',
    flag: 'IDN',
  },
  {
    id: 'idn-filialklandasan',
    name: 'FILIAL KLANDASAN',
    flag: 'IDN',
  },
  {
    id: 'idn-muntok',
    name: 'MUNTOK',
    flag: 'IDN',
  },
  {
    id: 'idn-padangbai',
    name: 'PADANGBAI',
    flag: 'IDN',
  },
  {
    id: 'idn-jakarta',
    name: 'JAKARTA',
    flag: 'IDN',
  },
  {
    id: 'idn-pemangkat',
    name: 'PEMANGKAT',
    flag: 'IDN',
  },
  {
    id: 'idn-anggana',
    name: 'ANGGANA',
    flag: 'IDN',
  },
  {
    id: 'idn-paotere',
    name: 'PAOTERE',
    flag: 'IDN',
  },
  {
    id: 'idn-brondong',
    name: 'BRONDONG',
    flag: 'IDN',
  },
  {
    id: 'idn-lawilawioilterminal',
    name: 'LAWI LAWI OIL TERMINAL',
    flag: 'IDN',
  },
  {
    id: 'idn-pontianak',
    name: 'PONTIANAK',
    flag: 'IDN',
  },
  {
    id: 'idn-antangtarempa',
    name: 'ANTANG TAREMPA',
    flag: 'IDN',
  },
  {
    id: 'idn-lekok',
    name: 'LEKOK',
    flag: 'IDN',
  },
  {
    id: 'idn-paljaya',
    name: 'PAL JAYA',
    flag: 'IDN',
  },
  {
    id: 'idn-karanganyer',
    name: 'KARANGANYER',
    flag: 'IDN',
  },
  {
    id: 'idn-muncar',
    name: 'MUNCAR',
    flag: 'IDN',
  },
  {
    id: 'idn-mahakamdelta',
    name: 'MAHAKAM DELTA',
    flag: 'IDN',
  },
  {
    id: 'idn-sungailiat',
    name: 'SUNGAILIAT',
    flag: 'IDN',
  },
  {
    id: 'idn-dagho',
    name: 'DAGHO',
    flag: 'IDN',
  },
  {
    id: 'idn-maumere',
    name: 'MAUMERE',
    flag: 'IDN',
  },
  {
    id: 'idn-nizamzachmanjakarta',
    name: 'NIZAM ZACHMAN JAKARTA',
    flag: 'IDN',
  },
  {
    id: 'idn-kotabaru',
    name: 'KOTA BARU',
    flag: 'IDN',
  },
  {
    id: 'idn-mayangan',
    name: 'MAYANGAN',
    flag: 'IDN',
  },
  {
    id: 'idn-sungsang',
    name: 'SUNGSANG',
    flag: 'IDN',
  },
  {
    id: 'idn-tuban',
    name: 'TUBAN',
    flag: 'IDN',
  },
  {
    id: 'idn-tamperan',
    name: 'TAMPERAN',
    flag: 'IDN',
  },
  {
    id: 'idn-bacan',
    name: 'BACAN',
    flag: 'IDN',
  },
  {
    id: 'idn-balambang',
    name: 'BALAMBANG',
    flag: 'IDN',
  },
  {
    id: 'idn-cemara',
    name: 'CEMARA',
    flag: 'IDN',
  },
  {
    id: 'idn-tenaukupang',
    name: 'TENAU KUPANG',
    flag: 'IDN',
  },
  {
    id: 'idn-monikeun',
    name: 'MON IKEUN',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-396',
    name: 'IDN-396',
    flag: 'IDN',
  },
  {
    id: 'idn-karimunjawa',
    name: 'KARIMUN JAWA',
    flag: 'IDN',
  },
  {
    id: 'idn-bungus',
    name: 'BUNGUS',
    flag: 'IDN',
  },
  {
    id: 'idn-werukomplek',
    name: 'WERU KOMPLEK',
    flag: 'IDN',
  },
  {
    id: 'idn-kamal',
    name: 'KAMAL',
    flag: 'IDN',
  },
  {
    id: 'idn-kalianget',
    name: 'KALIANGET',
    flag: 'IDN',
  },
  {
    id: 'idn-bajomulyo',
    name: 'BAJOMULYO',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-327',
    name: 'IDN-327',
    flag: 'IDN',
  },
  {
    id: 'idn-demta',
    name: 'DEMTA',
    flag: 'IDN',
  },
  {
    id: 'idn-sungairengas',
    name: 'SUNGAI RENGAS',
    flag: 'IDN',
  },
  {
    id: 'idn-cempae',
    name: 'CEMPAE',
    flag: 'IDN',
  },
  {
    id: 'idn-bula',
    name: 'BULA',
    flag: 'IDN',
  },
  {
    id: 'idn-kotabaru/saijaan',
    name: 'KOTABARU/SAIJAAN',
    flag: 'IDN',
  },
  {
    id: 'idn-kalibaru',
    name: 'KALIBARU',
    flag: 'IDN',
  },
  {
    id: 'idn-sorong',
    name: 'SORONG',
    flag: 'IDN',
  },
  {
    id: 'idn-banjarmasin',
    name: 'BANJARMASIN',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-150',
    name: 'IDN-150',
    flag: 'IDN',
  },
  {
    id: 'idn-nipahanchorage',
    name: 'NIPAH ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjunglimaubontang',
    name: 'TANJUNG LIMAU BONTANG',
    flag: 'IDN',
  },
  {
    id: 'idn-merakmasterminal',
    name: 'MERAK MAS TERMINAL',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjungbenoa',
    name: 'TANJUNG BENOA',
    flag: 'IDN',
  },
  {
    id: 'idn-pasirpanjang',
    name: 'PASIRPANJANG',
    flag: 'IDN',
  },
  {
    id: 'idn-banda',
    name: 'BANDA',
    flag: 'IDN',
  },
  {
    id: 'idn-semarang',
    name: 'SEMARANG',
    flag: 'IDN',
  },
  {
    id: 'idn-jayapura',
    name: 'JAYAPURA',
    flag: 'IDN',
  },
  {
    id: 'idn-sungaigerong',
    name: 'SUNGAIGERONG',
    flag: 'IDN',
  },
  {
    id: 'idn-penajam',
    name: 'PENAJAM',
    flag: 'IDN',
  },
  {
    id: 'idn-fakfak',
    name: 'FAKFAK',
    flag: 'IDN',
  },
  {
    id: 'idn-teladas',
    name: 'TELADAS',
    flag: 'IDN',
  },
  {
    id: 'idn-tasikagung',
    name: 'TASIK AGUNG',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-358',
    name: 'IDN-358',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjungbalaikarimun',
    name: 'TANJUNG BALAI KARIMUN',
    flag: 'IDN',
  },
  {
    id: 'idn-sadeng',
    name: 'SADENG',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-29',
    name: 'IDN-29',
    flag: 'IDN',
  },
  {
    id: 'idn-gilimanuk',
    name: 'GILIMANUK',
    flag: 'IDN',
  },
  {
    id: 'idn-handilenam',
    name: 'HANDILENAM',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-289',
    name: 'IDN-289',
    flag: 'IDN',
  },
  {
    id: 'idn-labuhanlombok',
    name: 'LABUHAN LOMBOK',
    flag: 'IDN',
  },
  {
    id: 'idn-jabungbatangharimarineterminal',
    name: 'JABUNG BATANGHARI MARINE TERMINAL',
    flag: 'IDN',
  },
  {
    id: 'idn-morodemak',
    name: 'MORODEMAK',
    flag: 'IDN',
  },
  {
    id: 'idn-paupanda',
    name: 'PAUPANDA',
    flag: 'IDN',
  },
  {
    id: 'idn-sengari',
    name: 'SENGARI',
    flag: 'IDN',
  },
  {
    id: 'idn-fandoi',
    name: 'FANDOI',
    flag: 'IDN',
  },
  {
    id: 'idn-kasimterminal',
    name: 'KASIM TERMINAL',
    flag: 'IDN',
  },
  {
    id: 'idn-lubuktutung',
    name: 'LUBUKTUTUNG',
    flag: 'IDN',
  },
  {
    id: 'idn-tegalsari',
    name: 'TEGALSARI',
    flag: 'IDN',
  },
  {
    id: 'idn-sumberbaba',
    name: 'SUMBERBABA',
    flag: 'IDN',
  },
  {
    id: 'idn-wonokerto',
    name: 'WONOKERTO',
    flag: 'IDN',
  },
  {
    id: 'idn-kolaka',
    name: 'KOLAKA',
    flag: 'IDN',
  },
  {
    id: 'idn-pulaubaai',
    name: 'PULAU BAAI',
    flag: 'IDN',
  },
  {
    id: 'idn-celukanbawang',
    name: 'CELUKAN BAWANG',
    flag: 'IDN',
  },
  {
    id: 'idn-citemu',
    name: 'CITEMU',
    flag: 'IDN',
  },
  {
    id: 'idn-sayoang',
    name: 'SAYOANG',
    flag: 'IDN',
  },
  {
    id: 'idn-gumuktengah',
    name: 'GUMUK TENGAH',
    flag: 'IDN',
  },
  {
    id: 'idn-kenarilang',
    name: 'KENARILANG',
    flag: 'IDN',
  },
  {
    id: 'idn-muaraciasem',
    name: 'MUARA CIASEM',
    flag: 'IDN',
  },
  {
    id: 'idn-cilincing',
    name: 'CILINCING',
    flag: 'IDN',
  },
  {
    id: 'idn-karangantu',
    name: 'KARANGANTU',
    flag: 'IDN',
  },
  {
    id: 'idn-anyerlor',
    name: 'ANYER LOR',
    flag: 'IDN',
  },
  {
    id: 'idn-brantapasisir',
    name: 'BRANTA PASISIR',
    flag: 'IDN',
  },
  {
    id: 'idn-batuang',
    name: 'BATUANG',
    flag: 'IDN',
  },
  {
    id: 'idn-kejawanan',
    name: 'KEJAWANAN',
    flag: 'IDN',
  },
  {
    id: 'idn-adipala',
    name: 'ADIPALA',
    flag: 'IDN',
  },
  {
    id: 'idn-tual',
    name: 'TUAL',
    flag: 'IDN',
  },
  {
    id: 'idn-pomalaa',
    name: 'POMALAA',
    flag: 'IDN',
  },
  {
    id: 'idn-karanglincak',
    name: 'KARANGLINCAK',
    flag: 'IDN',
  },
  {
    id: 'idn-pulautello',
    name: 'PULAU TELLO',
    flag: 'IDN',
  },
  {
    id: 'idn-sikakap',
    name: 'SIKAKAP',
    flag: 'IDN',
  },
  {
    id: 'idn-belawan',
    name: 'BELAWAN',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-175',
    name: 'IDN-175',
    flag: 'IDN',
  },
  {
    id: 'idn-tumumpa',
    name: 'TUMUMPA',
    flag: 'IDN',
  },
  {
    id: 'idn-wameo',
    name: 'WAMEO',
    flag: 'IDN',
  },
  {
    id: 'idn-labuhanbajo',
    name: 'LABUHAN BAJO',
    flag: 'IDN',
  },
  {
    id: 'idn-lamteungoh',
    name: 'LAM TEUNGOH',
    flag: 'IDN',
  },
  {
    id: 'idn-lempasing',
    name: 'LEMPASING',
    flag: 'IDN',
  },
  {
    id: 'idn-serangan',
    name: 'SERANGAN',
    flag: 'IDN',
  },
  {
    id: 'idn-cempa',
    name: 'CEMPA',
    flag: 'IDN',
  },
  {
    id: 'idn-kwandang',
    name: 'KWANDANG',
    flag: 'IDN',
  },
  {
    id: 'idn-telagapunggur',
    name: 'TELAGA PUNGGUR',
    flag: 'IDN',
  },
  {
    id: 'idn-senipahoilterminal',
    name: 'SENIPAH OIL TERMINAL',
    flag: 'IDN',
  },
  {
    id: 'idn-tenda',
    name: 'TENDA',
    flag: 'IDN',
  },
  {
    id: 'idn-sancang',
    name: 'SANCANG',
    flag: 'IDN',
  },
  {
    id: 'idn-banyuwangianchorage',
    name: 'BANYUWANGI ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-pengambengan',
    name: 'PENGAMBENGAN',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-130',
    name: 'IDN-130',
    flag: 'IDN',
  },
  {
    id: 'idn-batuampar',
    name: 'BATU AMPAR',
    flag: 'IDN',
  },
  {
    id: 'idn-selili',
    name: 'SELILI',
    flag: 'IDN',
  },
  {
    id: 'idn-pariaman',
    name: 'PARIAMAN',
    flag: 'IDN',
  },
  {
    id: 'idn-cilauteureun',
    name: 'CILAUTEUREUN',
    flag: 'IDN',
  },
  {
    id: 'idn-labuhanbadas',
    name: 'LABUHANBADAS',
    flag: 'IDN',
  },
  {
    id: 'idn-jungkat',
    name: 'JUNGKAT',
    flag: 'IDN',
  },
  {
    id: 'idn-wini',
    name: 'WINI',
    flag: 'IDN',
  },
  {
    id: 'idn-karangdima',
    name: 'KARANGDIMA',
    flag: 'IDN',
  },
  {
    id: 'idn-palabuhanratu',
    name: 'PALABUHAN RATU',
    flag: 'IDN',
  },
  {
    id: 'idn-kotaagung',
    name: 'KOTA AGUNG',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-351',
    name: 'IDN-351',
    flag: 'IDN',
  },
  {
    id: 'idn-dompas',
    name: 'DOMPAS',
    flag: 'IDN',
  },
  {
    id: 'idn-satui',
    name: 'SATUI',
    flag: 'IDN',
  },
  {
    id: 'idn-anjirmuara',
    name: 'ANJIRMUARA',
    flag: 'IDN',
  },
  {
    id: 'idn-ardjunaoilfield',
    name: 'ARDJUNA OIL FIELD',
    flag: 'IDN',
  },
  {
    id: 'idn-ciwandan',
    name: 'CIWANDAN',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjungsantan',
    name: 'TANJUNG SANTAN',
    flag: 'IDN',
  },
  {
    id: 'idn-idn-291',
    name: 'IDN-291',
    flag: 'IDN',
  },
  {
    id: 'idn-kruengraya',
    name: 'KRUENGRAYA',
    flag: 'IDN',
  },
  {
    id: 'idn-lontar',
    name: 'LONTAR',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjungpalas',
    name: 'TANJUNG PALAS',
    flag: 'IDN',
  },
  {
    id: 'idn-sekotongtengah',
    name: 'SEKOTONG TENGAH',
    flag: 'IDN',
  },
  {
    id: 'idn-passo',
    name: 'PASSO',
    flag: 'IDN',
  },
  {
    id: 'idn-guring',
    name: 'GURING',
    flag: 'IDN',
  },
  {
    id: 'idn-idi',
    name: 'IDI',
    flag: 'IDN',
  },
  {
    id: 'idn-atapupu',
    name: 'ATAPUPU',
    flag: 'IDN',
  },
  {
    id: 'idn-babo',
    name: 'BABO',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjunggerem',
    name: 'TANJUNG GEREM',
    flag: 'IDN',
  },
  {
    id: 'idn-blanakan',
    name: 'BLANAKAN',
    flag: 'IDN',
  },
  {
    id: 'idn-pontap',
    name: 'PONTAP',
    flag: 'IDN',
  },
  {
    id: 'idn-rangai',
    name: 'RANGAI',
    flag: 'IDN',
  },
  {
    id: 'idn-muaraberauanchorage',
    name: 'MUARA BERAU ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-rajawali',
    name: 'RAJAWALI',
    flag: 'IDN',
  },
  {
    id: 'ind-mumbai',
    name: 'MUMBAI',
    flag: 'IND',
  },
  {
    id: 'ind-ind-156',
    name: 'IND-156',
    flag: 'IND',
  },
  {
    id: 'ind-tuticorin',
    name: 'TUTICORIN',
    flag: 'IND',
  },
  {
    id: 'ind-karanje',
    name: 'KARANJE',
    flag: 'IND',
  },
  {
    id: 'ind-fortgloster',
    name: 'FORT GLOSTER',
    flag: 'IND',
  },
  {
    id: 'ind-sikka',
    name: 'SIKKA',
    flag: 'IND',
  },
  {
    id: 'ind-porbandar',
    name: 'PORBANDAR',
    flag: 'IND',
  },
  {
    id: 'ind-vadinarterminal',
    name: 'VADINAR TERMINAL',
    flag: 'IND',
  },
  {
    id: 'ind-okha',
    name: 'OKHA',
    flag: 'IND',
  },
  {
    id: 'ind-kattivakkam',
    name: 'KATTIVAKKAM',
    flag: 'IND',
  },
  {
    id: 'ind-uran',
    name: 'URAN',
    flag: 'IND',
  },
  {
    id: 'ind-bedi',
    name: 'BEDI',
    flag: 'IND',
  },
  {
    id: 'ind-bajbaj',
    name: 'BAJ BAJ',
    flag: 'IND',
  },
  {
    id: 'ind-ind-103',
    name: 'IND-103',
    flag: 'IND',
  },
  {
    id: 'ind-vishakhapatnam',
    name: 'VISHAKHAPATNAM',
    flag: 'IND',
  },
  {
    id: 'ind-chennai(madras)',
    name: 'CHENNAI (MADRAS)',
    flag: 'IND',
  },
  {
    id: 'ind-jua',
    name: 'JUA',
    flag: 'IND',
  },
  {
    id: 'ind-pipavavbandar',
    name: 'PIPAVAV BANDAR',
    flag: 'IND',
  },
  {
    id: 'ind-newmangalore',
    name: 'NEW MANGALORE',
    flag: 'IND',
  },
  {
    id: 'ind-hazira',
    name: 'HAZIRA',
    flag: 'IND',
  },
  {
    id: 'ind-thoothukudi',
    name: 'THOOTHUKUDI',
    flag: 'IND',
  },
  {
    id: 'ind-ind-132',
    name: 'IND-132',
    flag: 'IND',
  },
  {
    id: 'ind-navlakhi',
    name: 'NAVLAKHI',
    flag: 'IND',
  },
  {
    id: 'ind-dahej',
    name: 'DAHEJ',
    flag: 'IND',
  },
  {
    id: 'ind-diamondharbour',
    name: 'DIAMOND HARBOUR',
    flag: 'IND',
  },
  {
    id: 'ind-panaji',
    name: 'PANAJI',
    flag: 'IND',
  },
  {
    id: 'ind-kakinadabay',
    name: 'KAKINADA BAY',
    flag: 'IND',
  },
  {
    id: 'ind-karwar',
    name: 'KARWAR',
    flag: 'IND',
  },
  {
    id: 'ind-navelim',
    name: 'NAVELIM',
    flag: 'IND',
  },
  {
    id: 'ind-ghogha',
    name: 'GHOGHA',
    flag: 'IND',
  },
  {
    id: 'ind-portblair',
    name: 'PORT BLAIR',
    flag: 'IND',
  },
  {
    id: 'ind-karaikalport',
    name: 'KARAIKAL PORT',
    flag: 'IND',
  },
  {
    id: 'ind-kandla',
    name: 'KANDLA',
    flag: 'IND',
  },
  {
    id: 'ind-mumbai(bombay)',
    name: 'MUMBAI (BOMBAY)',
    flag: 'IND',
  },
  {
    id: 'ind-ind-61',
    name: 'IND-61',
    flag: 'IND',
  },
  {
    id: 'ind-krishnapatnam',
    name: 'KRISHNAPATNAM',
    flag: 'IND',
  },
  {
    id: 'ind-bhavnagar',
    name: 'BHAVNAGAR',
    flag: 'IND',
  },
  {
    id: 'ind-dabhol',
    name: 'DABHOL',
    flag: 'IND',
  },
  {
    id: 'ind-mundra',
    name: 'MUNDRA',
    flag: 'IND',
  },
  {
    id: 'ind-cortalim',
    name: 'CORTALIM',
    flag: 'IND',
  },
  {
    id: 'ind-vascodagama',
    name: 'VASCO DA GAMA',
    flag: 'IND',
  },
  {
    id: 'ind-paradip',
    name: 'PARADIP',
    flag: 'IND',
  },
  {
    id: 'ind-beypore',
    name: 'BEYPORE',
    flag: 'IND',
  },
  {
    id: 'ind-revadanda',
    name: 'REVADANDA',
    flag: 'IND',
  },
  {
    id: 'ind-ind-80',
    name: 'IND-80',
    flag: 'IND',
  },
  {
    id: 'ind-ind-173',
    name: 'IND-173',
    flag: 'IND',
  },
  {
    id: 'ind-kamarajarport',
    name: 'KAMARAJAR PORT',
    flag: 'IND',
  },
  {
    id: 'ind-bambooflat',
    name: 'BAMBOO FLAT',
    flag: 'IND',
  },
  {
    id: 'ind-alang',
    name: 'ALANG',
    flag: 'IND',
  },
  {
    id: 'ind-calcutta',
    name: 'CALCUTTA',
    flag: 'IND',
  },
  {
    id: 'ind-ind-112',
    name: 'IND-112',
    flag: 'IND',
  },
  {
    id: 'ind-jawaharlalnehruport(nhavashiva)',
    name: 'JAWAHARLAL NEHRU PORT (NHAVA SHIVA)',
    flag: 'IND',
  },
  {
    id: 'ind-ind-217',
    name: 'IND-217',
    flag: 'IND',
  },
  {
    id: 'ind-quilon(kollam)',
    name: 'QUILON (KOLLAM)',
    flag: 'IND',
  },
  {
    id: 'ind-oldgoa',
    name: 'OLD GOA',
    flag: 'IND',
  },
  {
    id: 'ind-kochi(cochin)',
    name: 'KOCHI (COCHIN)',
    flag: 'IND',
  },
  {
    id: 'ind-magdalla',
    name: 'MAGDALLA',
    flag: 'IND',
  },
  {
    id: 'ind-ind-175',
    name: 'IND-175',
    flag: 'IND',
  },
  {
    id: 'ind-kochi',
    name: 'KOCHI',
    flag: 'IND',
  },
  {
    id: 'ind-hutbay',
    name: 'HUTBAY',
    flag: 'IND',
  },
  {
    id: 'ind-ratnagiri',
    name: 'RATNAGIRI',
    flag: 'IND',
  },
  {
    id: 'ind-haldiaport',
    name: 'HALDIA PORT',
    flag: 'IND',
  },
  {
    id: 'ind-marmagao',
    name: 'MARMAGAO',
    flag: 'IND',
  },
  {
    id: 'ind-ind-35',
    name: 'IND-35',
    flag: 'IND',
  },
  {
    id: 'ind-cochin',
    name: 'COCHIN',
    flag: 'IND',
  },
  {
    id: 'ita-terrasini',
    name: 'TERRASINI',
    flag: 'ITA',
  },
  {
    id: 'ita-savona',
    name: 'SAVONA',
    flag: 'ITA',
  },
  {
    id: 'ita-santamargheritaligure',
    name: 'SANTA MARGHERITA LIGURE',
    flag: 'ITA',
  },
  {
    id: 'ita-castellammaredelgolfo',
    name: 'CASTELLAMMARE DEL GOLFO',
    flag: 'ITA',
  },
  {
    id: 'ita-venice',
    name: 'VENICE',
    flag: 'ITA',
  },
  {
    id: 'ita-castellammaredistabia',
    name: 'CASTELLAMMARE DI STABIA',
    flag: 'ITA',
  },
  {
    id: 'ita-rosignanosolvay-castiglioncello',
    name: 'ROSIGNANO SOLVAY-CASTIGLIONCELLO',
    flag: 'ITA',
  },
  {
    id: 'ita-portosangiorgio',
    name: 'PORTO SAN GIORGIO',
    flag: 'ITA',
  },
  {
    id: 'ita-mazaradelvallo',
    name: 'MAZARA DEL VALLO',
    flag: 'ITA',
  },
  {
    id: 'ita-scoglitti',
    name: 'SCOGLITTI',
    flag: 'ITA',
  },
  {
    id: 'ita-bisceglie',
    name: 'BISCEGLIE',
    flag: 'ITA',
  },
  {
    id: 'ita-napoli',
    name: 'NAPOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-siracusa',
    name: 'SIRACUSA',
    flag: 'ITA',
  },
  {
    id: "ita-capod'orlando",
    name: "CAPO D'ORLANDO",
    flag: 'ITA',
  },
  {
    id: 'ita-calagonone',
    name: 'CALA GONONE',
    flag: 'ITA',
  },
  {
    id: 'ita-lamaddalena',
    name: 'LA MADDALENA',
    flag: 'ITA',
  },
  {
    id: 'ita-follonica',
    name: 'FOLLONICA',
    flag: 'ITA',
  },
  {
    id: 'ita-livorno',
    name: 'LIVORNO',
    flag: 'ITA',
  },
  {
    id: 'ita-ancona',
    name: 'ANCONA',
    flag: 'ITA',
  },
  {
    id: 'ita-sanremo',
    name: 'SAN REMO',
    flag: 'ITA',
  },
  {
    id: 'ita-favignana',
    name: 'FAVIGNANA',
    flag: 'ITA',
  },
  {
    id: 'ita-marinadicarrara',
    name: 'MARINA DI CARRARA',
    flag: 'ITA',
  },
  {
    id: 'ita-stromboli',
    name: 'STROMBOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-terminiimerese',
    name: 'TERMINI IMERESE',
    flag: 'ITA',
  },
  {
    id: 'ita-carlino',
    name: 'CARLINO',
    flag: 'ITA',
  },
  {
    id: 'ita-ponza',
    name: 'PONZA',
    flag: 'ITA',
  },
  {
    id: 'ita-terracina',
    name: 'TERRACINA',
    flag: 'ITA',
  },
  {
    id: 'ita-puntamarina',
    name: 'PUNTA MARINA',
    flag: 'ITA',
  },
  {
    id: 'ita-isoladellefemmine',
    name: 'ISOLA DELLE FEMMINE',
    flag: 'ITA',
  },
  {
    id: 'ita-giardini-naxos',
    name: 'GIARDINI-NAXOS',
    flag: 'ITA',
  },
  {
    id: 'ita-cecina',
    name: 'CECINA',
    flag: 'ITA',
  },
  {
    id: 'ita-genova',
    name: 'GENOVA',
    flag: 'ITA',
  },
  {
    id: 'ita-portogaribaldi',
    name: 'PORTO GARIBALDI',
    flag: 'ITA',
  },
  {
    id: 'ita-laspezia',
    name: 'LA SPEZIA',
    flag: 'ITA',
  },
  {
    id: 'ita-sorrento',
    name: 'SORRENTO',
    flag: 'ITA',
  },
  {
    id: 'ita-riposto',
    name: 'RIPOSTO',
    flag: 'ITA',
  },
  {
    id: 'ita-sanvitolocapo',
    name: 'SAN VITO LO CAPO',
    flag: 'ITA',
  },
  {
    id: 'ita-portovenere',
    name: 'PORTOVENERE',
    flag: 'ITA',
  },
  {
    id: 'ita-mestre',
    name: 'MESTRE',
    flag: 'ITA',
  },
  {
    id: 'ita-camogli',
    name: 'CAMOGLI',
    flag: 'ITA',
  },
  {
    id: 'ita-palau',
    name: 'PALAU',
    flag: 'ITA',
  },
  {
    id: 'ita-anacapri',
    name: 'ANACAPRI',
    flag: 'ITA',
  },
  {
    id: 'ita-marsala',
    name: 'MARSALA',
    flag: 'ITA',
  },
  {
    id: 'ita-trapani',
    name: 'TRAPANI',
    flag: 'ITA',
  },
  {
    id: 'ita-vasto',
    name: 'VASTO',
    flag: 'ITA',
  },
  {
    id: 'ita-civitavecchia',
    name: 'CIVITAVECCHIA',
    flag: 'ITA',
  },
  {
    id: 'ita-bari',
    name: 'BARI',
    flag: 'ITA',
  },
  {
    id: 'ita-torreannunziata',
    name: 'TORRE ANNUNZIATA',
    flag: 'ITA',
  },
  {
    id: 'ita-monopoli',
    name: 'MONOPOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-rosolina',
    name: 'ROSOLINA',
    flag: 'ITA',
  },
  {
    id: 'ita-marinadischiavonea',
    name: 'MARINA DI SCHIAVONEA',
    flag: 'ITA',
  },
  {
    id: 'ita-ita-116',
    name: 'ITA-116',
    flag: 'ITA',
  },
  {
    id: 'ita-concadeimarini',
    name: 'CONCA DEI MARINI',
    flag: 'ITA',
  },
  {
    id: 'ita-ita-355',
    name: 'ITA-355',
    flag: 'ITA',
  },
  {
    id: 'ita-loano',
    name: 'LOANO',
    flag: 'ITA',
  },
  {
    id: 'ita-ischiaporto',
    name: 'ISCHIA PORTO',
    flag: 'ITA',
  },
  {
    id: 'ita-capitana',
    name: 'CAPITANA',
    flag: 'ITA',
  },
  {
    id: 'ita-pozzuoli',
    name: 'POZZUOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-gela',
    name: 'GELA',
    flag: 'ITA',
  },
  {
    id: 'ita-ita-218',
    name: 'ITA-218',
    flag: 'ITA',
  },
  {
    id: 'ita-scario',
    name: 'SCARIO',
    flag: 'ITA',
  },
  {
    id: 'ita-lipari',
    name: 'LIPARI',
    flag: 'ITA',
  },
  {
    id: 'ita-santostefanoalmare',
    name: 'SANTO STEFANO AL MARE',
    flag: 'ITA',
  },
  {
    id: 'ita-leuca',
    name: 'LEUCA',
    flag: 'ITA',
  },
  {
    id: 'ita-portotorres',
    name: 'PORTO TORRES',
    flag: 'ITA',
  },
  {
    id: 'ita-casamicciolaterme',
    name: 'CASAMICCIOLA TERME',
    flag: 'ITA',
  },
  {
    id: 'ita-ita-223',
    name: 'ITA-223',
    flag: 'ITA',
  },
  {
    id: 'ita-arbatax',
    name: 'ARBATAX',
    flag: 'ITA',
  },
  {
    id: 'ita-viareggio',
    name: 'VIAREGGIO',
    flag: 'ITA',
  },
  {
    id: 'ita-portodioristano',
    name: 'PORTO DI ORISTANO',
    flag: 'ITA',
  },
  {
    id: 'ita-olbia',
    name: 'OLBIA',
    flag: 'ITA',
  },
  {
    id: 'ita-termoli',
    name: 'TERMOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-muggia',
    name: 'MUGGIA',
    flag: 'ITA',
  },
  {
    id: 'ita-anzio',
    name: 'ANZIO',
    flag: 'ITA',
  },
  {
    id: 'ita-melillioilterminal',
    name: 'MELILLI OIL TERMINAL',
    flag: 'ITA',
  },
  {
    id: 'ita-ficarazzi',
    name: 'FICARAZZI',
    flag: 'ITA',
  },
  {
    id: 'ita-manfredonia',
    name: 'MANFREDONIA',
    flag: 'ITA',
  },
  {
    id: 'ita-calaluna',
    name: 'CALA LUNA',
    flag: 'ITA',
  },
  {
    id: 'ita-imperia',
    name: 'IMPERIA',
    flag: 'ITA',
  },
  {
    id: 'ita-pollica',
    name: 'POLLICA',
    flag: 'ITA',
  },
  {
    id: 'ita-portodibarletta',
    name: 'PORTO DI BARLETTA',
    flag: 'ITA',
  },
  {
    id: 'ita-ita-245',
    name: 'ITA-245',
    flag: 'ITA',
  },
  {
    id: 'ita-ventotene',
    name: 'VENTOTENE',
    flag: 'ITA',
  },
  {
    id: 'ita-aeolianislands',
    name: 'AEOLIAN ISLANDS',
    flag: 'ITA',
  },
  {
    id: 'ita-pisa',
    name: 'PISA',
    flag: 'ITA',
  },
  {
    id: 'ita-sciacca',
    name: 'SCIACCA',
    flag: 'ITA',
  },
  {
    id: 'ita-pantelleria',
    name: 'PANTELLERIA',
    flag: 'ITA',
  },
  {
    id: 'ita-ameglia',
    name: 'AMEGLIA',
    flag: 'ITA',
  },
  {
    id: 'ita-stintino',
    name: 'STINTINO',
    flag: 'ITA',
  },
  {
    id: 'ita-sistiana',
    name: 'SISTIANA',
    flag: 'ITA',
  },
  {
    id: 'ita-capanne-prato-cinquale',
    name: 'CAPANNE-PRATO-CINQUALE',
    flag: 'ITA',
  },
  {
    id: 'ita-ita-363',
    name: 'ITA-363',
    flag: 'ITA',
  },
  {
    id: 'ita-civitanovamarche',
    name: 'CIVITANOVA MARCHE',
    flag: 'ITA',
  },
  {
    id: 'ita-trieste',
    name: 'TRIESTE',
    flag: 'ITA',
  },
  {
    id: 'ita-polignanoamare',
    name: 'POLIGNANO A MARE',
    flag: 'ITA',
  },
  {
    id: 'ita-formia',
    name: 'FORMIA',
    flag: 'ITA',
  },
  {
    id: 'ita-giulianova',
    name: 'GIULIANOVA',
    flag: 'ITA',
  },
  {
    id: 'ita-barletta',
    name: 'BARLETTA',
    flag: 'ITA',
  },
  {
    id: 'ita-meta',
    name: 'META',
    flag: 'ITA',
  },
  {
    id: 'ita-santaflavia',
    name: 'SANTA FLAVIA',
    flag: 'ITA',
  },
  {
    id: 'ita-capri',
    name: 'CAPRI',
    flag: 'ITA',
  },
  {
    id: 'ita-procida',
    name: 'PROCIDA',
    flag: 'ITA',
  },
  {
    id: 'ita-crotone',
    name: 'CROTONE',
    flag: 'ITA',
  },
  {
    id: 'ita-castelsardo',
    name: 'CASTELSARDO',
    flag: 'ITA',
  },
  {
    id: 'ita-forio',
    name: 'FORIO',
    flag: 'ITA',
  },
  {
    id: 'ita-portodimalamocco',
    name: 'PORTO DI MALAMOCCO',
    flag: 'ITA',
  },
  {
    id: 'ita-isoletremiti',
    name: 'ISOLE TREMITI',
    flag: 'ITA',
  },
  {
    id: 'ita-fiumicino',
    name: 'FIUMICINO',
    flag: 'ITA',
  },
  {
    id: 'ita-portoazzurro',
    name: 'PORTO AZZURRO',
    flag: 'ITA',
  },
  {
    id: 'ita-veneticomarina',
    name: 'VENETICO MARINA',
    flag: 'ITA',
  },
  {
    id: "ita-sant'agatadimilitello",
    name: "SANT'AGATA DI MILITELLO",
    flag: 'ITA',
  },
  {
    id: 'ita-sanleonemose',
    name: 'SAN LEONE MOSE',
    flag: 'ITA',
  },
  {
    id: 'ita-moladibari',
    name: 'MOLA DI BARI',
    flag: 'ITA',
  },
  {
    id: 'ita-cagliari',
    name: 'CAGLIARI',
    flag: 'ITA',
  },
  {
    id: 'ita-vada',
    name: 'VADA',
    flag: 'ITA',
  },
  {
    id: 'ita-lido',
    name: 'LIDO',
    flag: 'ITA',
  },
  {
    id: 'ita-priologargallo',
    name: 'PRIOLO GARGALLO',
    flag: 'ITA',
  },
  {
    id: 'ita-campalto',
    name: 'CAMPALTO',
    flag: 'ITA',
  },
  {
    id: 'ita-golfoaranci',
    name: 'GOLFO ARANCI',
    flag: 'ITA',
  },
  {
    id: "ita-sant'angelo",
    name: "SANT'ANGELO",
    flag: 'ITA',
  },
  {
    id: 'ita-rimini',
    name: 'RIMINI',
    flag: 'ITA',
  },
  {
    id: 'ita-santeodoro',
    name: 'SAN TEODORO',
    flag: 'ITA',
  },
  {
    id: 'ita-amalfi',
    name: 'AMALFI',
    flag: 'ITA',
  },
  {
    id: 'ita-cefalu',
    name: 'CEFALU',
    flag: 'ITA',
  },
  {
    id: 'ita-molfetta',
    name: 'MOLFETTA',
    flag: 'ITA',
  },
  {
    id: 'ita-brucoli',
    name: 'BRUCOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-radadivado',
    name: 'RADA DI VADO',
    flag: 'ITA',
  },
  {
    id: 'ita-sestrilevante',
    name: 'SESTRI LEVANTE',
    flag: 'ITA',
  },
  {
    id: 'ita-fuorni',
    name: 'FUORNI',
    flag: 'ITA',
  },
  {
    id: 'ita-ita-48',
    name: 'ITA-48',
    flag: 'ITA',
  },
  {
    id: 'ita-portosanpaolo',
    name: 'PORTO SAN PAOLO',
    flag: 'ITA',
  },
  {
    id: 'ita-ita-115',
    name: 'ITA-115',
    flag: 'ITA',
  },
  {
    id: 'ita-isoladelgiglio',
    name: 'ISOLA DEL GIGLIO',
    flag: 'ITA',
  },
  {
    id: 'ita-ita-250',
    name: 'ITA-250',
    flag: 'ITA',
  },
  {
    id: 'ita-murano',
    name: 'MURANO',
    flag: 'ITA',
  },
  {
    id: 'ita-augusta',
    name: 'AUGUSTA',
    flag: 'ITA',
  },
  {
    id: 'ita-ceramida-pellegrina',
    name: 'CERAMIDA-PELLEGRINA',
    flag: 'ITA',
  },
  {
    id: 'ita-vieste',
    name: 'VIESTE',
    flag: 'ITA',
  },
  {
    id: 'ita-agropoli',
    name: 'AGROPOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-sanferdinando',
    name: 'SAN FERDINANDO',
    flag: 'ITA',
  },
  {
    id: 'ita-monfalcone',
    name: 'MONFALCONE',
    flag: 'ITA',
  },
  {
    id: 'ita-portofino',
    name: 'PORTOFINO',
    flag: 'ITA',
  },
  {
    id: 'ita-portoempedocle',
    name: 'PORTO EMPEDOCLE',
    flag: 'ITA',
  },
  {
    id: 'ita-sanbenedettodeltronto',
    name: 'SAN BENEDETTO DEL TRONTO',
    flag: 'ITA',
  },
  {
    id: 'ita-gioiatauro',
    name: 'GIOIA TAURO',
    flag: 'ITA',
  },
  {
    id: 'ita-giudecca',
    name: 'GIUDECCA',
    flag: 'ITA',
  },
  {
    id: 'ita-cauloniamarina',
    name: 'CAULONIA MARINA',
    flag: 'ITA',
  },
  {
    id: 'ita-pachino',
    name: 'PACHINO',
    flag: 'ITA',
  },
  {
    id: 'ita-portofuori',
    name: 'PORTO FUORI',
    flag: 'ITA',
  },
  {
    id: 'ita-ligalli',
    name: 'LI GALLI',
    flag: 'ITA',
  },
  {
    id: 'ita-torredelgreco',
    name: 'TORRE DEL GRECO',
    flag: 'ITA',
  },
  {
    id: 'ita-alghero',
    name: 'ALGHERO',
    flag: 'ITA',
  },
  {
    id: 'ita-riomarina',
    name: 'RIO MARINA',
    flag: 'ITA',
  },
  {
    id: 'ita-malfa',
    name: 'MALFA',
    flag: 'ITA',
  },
  {
    id: 'ita-scilla',
    name: 'SCILLA',
    flag: 'ITA',
  },
  {
    id: 'ita-portopalodicapopassero',
    name: 'PORTOPALO DI CAPO PASSERO',
    flag: 'ITA',
  },
  {
    id: 'ita-taranto',
    name: 'TARANTO',
    flag: 'ITA',
  },
  {
    id: 'ita-grado',
    name: 'GRADO',
    flag: 'ITA',
  },
  {
    id: 'ita-portovesme',
    name: 'PORTO VESME',
    flag: 'ITA',
  },
  {
    id: 'ita-ustica',
    name: 'USTICA',
    flag: 'ITA',
  },
  {
    id: 'ita-ortona',
    name: 'ORTONA',
    flag: 'ITA',
  },
  {
    id: 'ita-capoliveri',
    name: 'CAPOLIVERI',
    flag: 'ITA',
  },
  {
    id: 'ita-ciromarina',
    name: 'CIRO MARINA',
    flag: 'ITA',
  },
  {
    id: 'ita-portopino',
    name: 'PORTO PINO',
    flag: 'ITA',
  },
  {
    id: 'ita-leforna',
    name: 'LE FORNA',
    flag: 'ITA',
  },
  {
    id: 'ita-lerici',
    name: 'LERICI',
    flag: 'ITA',
  },
  {
    id: 'ita-chioggia',
    name: 'CHIOGGIA',
    flag: 'ITA',
  },
  {
    id: 'ita-portovecchiodipiombino',
    name: 'PORTOVECCHIO DI PIOMBINO',
    flag: 'ITA',
  },
  {
    id: 'ita-pula',
    name: 'PULA',
    flag: 'ITA',
  },
  {
    id: 'ita-roccellaionica',
    name: 'ROCCELLA IONICA',
    flag: 'ITA',
  },
  {
    id: 'ita-giammoro',
    name: 'GIAMMORO',
    flag: 'ITA',
  },
  {
    id: 'ita-marinadipisa',
    name: 'MARINA DI PISA',
    flag: 'ITA',
  },
  {
    id: 'ita-portoferraio',
    name: 'PORTOFERRAIO',
    flag: 'ITA',
  },
  {
    id: 'ita-marinadiragusa',
    name: 'MARINA DI RAGUSA',
    flag: 'ITA',
  },
  {
    id: 'ita-pozzallo',
    name: 'POZZALLO',
    flag: 'ITA',
  },
  {
    id: 'ita-milazzo',
    name: 'MILAZZO',
    flag: 'ITA',
  },
  {
    id: 'ita-marinadiravenna',
    name: 'MARINA DI RAVENNA',
    flag: 'ITA',
  },
  {
    id: 'ita-capraiaisola',
    name: 'CAPRAIA ISOLA',
    flag: 'ITA',
  },
  {
    id: 'ita-cassibile',
    name: 'CASSIBILE',
    flag: 'ITA',
  },
  {
    id: 'ita-massalubrense',
    name: 'MASSA LUBRENSE',
    flag: 'ITA',
  },
  {
    id: 'ita-pescara',
    name: 'PESCARA',
    flag: 'ITA',
  },
  {
    id: 'ita-ita-167',
    name: 'ITA-167',
    flag: 'ITA',
  },
  {
    id: 'ita-fortedeimarmi',
    name: 'FORTE DEI MARMI',
    flag: 'ITA',
  },
  {
    id: 'ita-alassio',
    name: 'ALASSIO',
    flag: 'ITA',
  },
  {
    id: 'ita-cetraromarina',
    name: 'CETRARO MARINA',
    flag: 'ITA',
  },
  {
    id: 'ita-lacaletta',
    name: 'LA CALETTA',
    flag: 'ITA',
  },
  {
    id: 'ita-portocervo',
    name: 'PORTO CERVO',
    flag: 'ITA',
  },
  {
    id: 'ita-gaeta',
    name: 'GAETA',
    flag: 'ITA',
  },
  {
    id: 'ita-rapallo',
    name: 'RAPALLO',
    flag: 'ITA',
  },
  {
    id: 'ita-gallipoli',
    name: 'GALLIPOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-chiavari',
    name: 'CHIAVARI',
    flag: 'ITA',
  },
  {
    id: 'ita-portopila',
    name: 'PORTO PILA',
    flag: 'ITA',
  },
  {
    id: 'ita-bosa',
    name: 'BOSA',
    flag: 'ITA',
  },
  {
    id: 'ita-lecastella',
    name: 'LE CASTELLA',
    flag: 'ITA',
  },
  {
    id: 'ita-caorle',
    name: 'CAORLE',
    flag: 'ITA',
  },
  {
    id: 'ita-bogliasco',
    name: 'BOGLIASCO',
    flag: 'ITA',
  },
  {
    id: 'ita-santamarinasalina',
    name: 'SANTA MARINA SALINA',
    flag: 'ITA',
  },
  {
    id: 'ita-prosecco-contovello',
    name: 'PROSECCO-CONTOVELLO',
    flag: 'ITA',
  },
  {
    id: 'ita-portoercole',
    name: 'PORTO ERCOLE',
    flag: 'ITA',
  },
  {
    id: 'ita-marinadigrosseto',
    name: 'MARINA DI GROSSETO',
    flag: 'ITA',
  },
  {
    id: 'ita-finaleligure',
    name: 'FINALE LIGURE',
    flag: 'ITA',
  },
  {
    id: 'ita-portoponteromano',
    name: 'PORTO PONTE ROMANO',
    flag: 'ITA',
  },
  {
    id: 'ita-ita-254',
    name: 'ITA-254',
    flag: 'ITA',
  },
  {
    id: 'ita-gabiccemare',
    name: 'GABICCE MARE',
    flag: 'ITA',
  },
  {
    id: 'ita-pesaro',
    name: 'PESARO',
    flag: 'ITA',
  },
  {
    id: 'ita-sanvincenzo',
    name: 'SAN VINCENZO',
    flag: 'ITA',
  },
  {
    id: 'ita-portodipalermo',
    name: 'PORTO DI PALERMO',
    flag: 'ITA',
  },
  {
    id: 'ita-maratea',
    name: 'MARATEA',
    flag: 'ITA',
  },
  {
    id: 'ita-sanfelicecirceo',
    name: 'SAN FELICE CIRCEO',
    flag: 'ITA',
  },
  {
    id: 'ita-gigliocastello',
    name: 'GIGLIO CASTELLO',
    flag: 'ITA',
  },
  {
    id: 'ita-ita-117',
    name: 'ITA-117',
    flag: 'ITA',
  },
  {
    id: 'ita-ischia',
    name: 'ISCHIA',
    flag: 'ITA',
  },
  {
    id: 'ita-laccoameno',
    name: 'LACCO AMENO',
    flag: 'ITA',
  },
  {
    id: 'ita-fano',
    name: 'FANO',
    flag: 'ITA',
  },
  {
    id: 'ita-santamarinella',
    name: 'SANTA MARINELLA',
    flag: 'ITA',
  },
  {
    id: 'ita-vibovalentiamarina',
    name: 'VIBO VALENTIA MARINA',
    flag: 'ITA',
  },
  {
    id: 'ita-pertegada',
    name: 'PERTEGADA',
    flag: 'ITA',
  },
  {
    id: 'ita-licata',
    name: 'LICATA',
    flag: 'ITA',
  },
  {
    id: 'ita-praiano',
    name: 'PRAIANO',
    flag: 'ITA',
  },
  {
    id: 'ita-villamarina',
    name: 'VILLAMARINA',
    flag: 'ITA',
  },
  {
    id: 'ita-messina',
    name: 'MESSINA',
    flag: 'ITA',
  },
  {
    id: 'ita-portosantostefano',
    name: 'PORTO SANTO STEFANO',
    flag: 'ITA',
  },
  {
    id: "ita-sant'agnello",
    name: "SANT'AGNELLO",
    flag: 'ITA',
  },
  {
    id: 'ita-lavagna',
    name: 'LAVAGNA',
    flag: 'ITA',
  },
  {
    id: 'ita-lampedusa',
    name: 'LAMPEDUSA',
    flag: 'ITA',
  },
  {
    id: 'ita-farosuperiore',
    name: 'FARO SUPERIORE',
    flag: 'ITA',
  },
  {
    id: 'ita-marettimo',
    name: 'MARETTIMO',
    flag: 'ITA',
  },
  {
    id: 'ita-brindisi',
    name: 'BRINDISI',
    flag: 'ITA',
  },
  {
    id: 'ita-taormina',
    name: 'TAORMINA',
    flag: 'ITA',
  },
  {
    id: 'ita-trani',
    name: 'TRANI',
    flag: 'ITA',
  },
  {
    id: 'ita-catania',
    name: 'CATANIA',
    flag: 'ITA',
  },
  {
    id: 'ita-falconaramarittima',
    name: 'FALCONARA MARITTIMA',
    flag: 'ITA',
  },
  {
    id: 'ita-ita-360',
    name: 'ITA-360',
    flag: 'ITA',
  },
  {
    id: 'ita-acitrezza',
    name: 'ACITREZZA',
    flag: 'ITA',
  },
  {
    id: 'ita-linosa',
    name: 'LINOSA',
    flag: 'ITA',
  },
  {
    id: 'ita-salerno',
    name: 'SALERNO',
    flag: 'ITA',
  },
  {
    id: 'ita-celleligure',
    name: 'CELLE LIGURE',
    flag: 'ITA',
  },
  {
    id: 'ita-positano',
    name: 'POSITANO',
    flag: 'ITA',
  },
  {
    id: 'ita-calasetta',
    name: 'CALASETTA',
    flag: 'ITA',
  },
  {
    id: 'ita-portodicorsini',
    name: 'PORTO DI CORSINI',
    flag: 'ITA',
  },
  {
    id: 'ita-rodigarganico',
    name: 'RODI GARGANICO',
    flag: 'ITA',
  },
  {
    id: 'ita-arenzano',
    name: 'ARENZANO',
    flag: 'ITA',
  },
  {
    id: 'ita-ita-196',
    name: 'ITA-196',
    flag: 'ITA',
  },
  {
    id: 'ita-tropea',
    name: 'TROPEA',
    flag: 'ITA',
  },
  {
    id: 'ita-lignanosabbiadoro',
    name: 'LIGNANO SABBIADORO',
    flag: 'ITA',
  },
  {
    id: 'ita-portici',
    name: 'PORTICI',
    flag: 'ITA',
  },
  {
    id: 'ita-sanlorenzoalmare',
    name: 'SAN LORENZO AL MARE',
    flag: 'ITA',
  },
  {
    id: 'ita-santateresagallura',
    name: 'SANTA TERESA GALLURA',
    flag: 'ITA',
  },
  {
    id: 'ita-reggiodicalabria',
    name: 'REGGIO DI CALABRIA',
    flag: 'ITA',
  },
  {
    id: 'ita-mele',
    name: 'MELE',
    flag: 'ITA',
  },
  {
    id: 'ita-villasimius',
    name: 'VILLASIMIUS',
    flag: 'ITA',
  },
  {
    id: 'ita-kamma',
    name: 'KAMMA',
    flag: 'ITA',
  },
  {
    id: 'ita-sarrochoilterminal',
    name: 'SARROCH OIL TERMINAL',
    flag: 'ITA',
  },
  {
    id: 'ita-marinadicampo',
    name: 'MARINA DI CAMPO',
    flag: 'ITA',
  },
  {
    id: 'ita-budoni',
    name: 'BUDONI',
    flag: 'ITA',
  },
  {
    id: 'ita-atrani',
    name: 'ATRANI',
    flag: 'ITA',
  },
  {
    id: 'ita-otranto',
    name: 'OTRANTO',
    flag: 'ITA',
  },
  {
    id: 'ita-carloforte',
    name: 'CARLOFORTE',
    flag: 'ITA',
  },
  {
    id: 'ita-portodichioggia',
    name: 'PORTO DI CHIOGGIA',
    flag: 'ITA',
  },
  {
    id: 'jpn-onagawa',
    name: 'ONAGAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-ashiya',
    name: 'ASHIYA',
    flag: 'JPN',
  },
  {
    id: 'jpn-iwakuni',
    name: 'IWAKUNI',
    flag: 'JPN',
  },
  {
    id: 'jpn-itoman',
    name: 'ITOMAN',
    flag: 'JPN',
  },
  {
    id: 'jpn-sasebo',
    name: 'SASEBO',
    flag: 'JPN',
  },
  {
    id: 'jpn-saganosekiko',
    name: 'SAGANOSEKI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-uwajimako',
    name: 'UWAJIMA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-nishinomiya-hama',
    name: 'NISHINOMIYA-HAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-ieshima',
    name: 'IESHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-matsuyama',
    name: 'MATSUYAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tomakomai',
    name: 'TOMAKOMAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-ofunato',
    name: 'OFUNATO',
    flag: 'JPN',
  },
  {
    id: 'jpn-onoda',
    name: 'ONODA',
    flag: 'JPN',
  },
  {
    id: 'jpn-rumoiko',
    name: 'RUMOI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-noshiroko',
    name: 'NOSHIRO KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-nahari',
    name: 'NAHARI',
    flag: 'JPN',
  },
  {
    id: 'jpn-setoda',
    name: 'SETODA',
    flag: 'JPN',
  },
  {
    id: 'jpn-omaezakiko',
    name: 'OMAEZAKI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-arida',
    name: 'ARIDA',
    flag: 'JPN',
  },
  {
    id: 'jpn-ginowan',
    name: 'GINOWAN',
    flag: 'JPN',
  },
  {
    id: 'jpn-kagoshimako',
    name: 'KAGOSHIMA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-kanda',
    name: 'KANDA',
    flag: 'JPN',
  },
  {
    id: 'jpn-jpn-189',
    name: 'JPN-189',
    flag: 'JPN',
  },
  {
    id: 'jpn-fukuyama',
    name: 'FUKUYAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-sendai',
    name: 'SENDAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-hirado',
    name: 'HIRADO',
    flag: 'JPN',
  },
  {
    id: 'jpn-kinuurako',
    name: 'KINUURA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-takuma',
    name: 'TAKUMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hibikinada',
    name: 'HIBIKINADA',
    flag: 'JPN',
  },
  {
    id: 'jpn-akita',
    name: 'AKITA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kainan',
    name: 'KAINAN',
    flag: 'JPN',
  },
  {
    id: 'jpn-shimabara',
    name: 'SHIMABARA',
    flag: 'JPN',
  },
  {
    id: 'jpn-soma',
    name: 'SOMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-ishigaki',
    name: 'ISHIGAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-aomoriko',
    name: 'AOMORI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-hamada',
    name: 'HAMADA',
    flag: 'JPN',
  },
  {
    id: 'jpn-jpn-421',
    name: 'JPN-421',
    flag: 'JPN',
  },
  {
    id: 'jpn-shiraoi',
    name: 'SHIRAOI',
    flag: 'JPN',
  },
  {
    id: 'jpn-makurazaki',
    name: 'MAKURAZAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-yawatahama',
    name: 'YAWATAHAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hirarako',
    name: 'HIRARA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-shimizu',
    name: 'SHIMIZU',
    flag: 'JPN',
  },
  {
    id: 'jpn-tokyoko',
    name: 'TOKYO KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-ito',
    name: 'ITO',
    flag: 'JPN',
  },
  {
    id: 'jpn-kajiki',
    name: 'KAJIKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-buzen',
    name: 'BUZEN',
    flag: 'JPN',
  },
  {
    id: 'jpn-choshi',
    name: 'CHOSHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-kinwan',
    name: 'KIN WAN',
    flag: 'JPN',
  },
  {
    id: 'jpn-chiba',
    name: 'CHIBA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tokaraislands',
    name: 'TOKARA ISLANDS',
    flag: 'JPN',
  },
  {
    id: 'jpn-kashimako',
    name: 'KASHIMA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-higashi-harima',
    name: 'HIGASHI-HARIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tonosho',
    name: 'TONOSHO',
    flag: 'JPN',
  },
  {
    id: 'jpn-onahama',
    name: 'ONAHAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-usuki',
    name: 'USUKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-ubeko',
    name: 'UBE KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-funabashi',
    name: 'FUNABASHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-namikata',
    name: 'NAMIKATA',
    flag: 'JPN',
  },
  {
    id: 'jpn-naoetsuko',
    name: 'NAOETSU KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-innoshima',
    name: 'INNOSHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kobe',
    name: 'KOBE',
    flag: 'JPN',
  },
  {
    id: 'jpn-yamoto',
    name: 'YAMOTO',
    flag: 'JPN',
  },
  {
    id: 'jpn-matsusaka',
    name: 'MATSUSAKA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hitachi',
    name: 'HITACHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-fukuiko',
    name: 'FUKUI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-jpn-242',
    name: 'JPN-242',
    flag: 'JPN',
  },
  {
    id: 'jpn-jpn-505',
    name: 'JPN-505',
    flag: 'JPN',
  },
  {
    id: 'jpn-yaizu',
    name: 'YAIZU',
    flag: 'JPN',
  },
  {
    id: 'jpn-osaka',
    name: 'OSAKA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kisarazu',
    name: 'KISARAZU',
    flag: 'JPN',
  },
  {
    id: 'jpn-futtsu',
    name: 'FUTTSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-ishinomakiko',
    name: 'ISHINOMAKI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-kokurako',
    name: 'KOKURA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-wakamatsuko',
    name: 'WAKAMATSU KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-shikama',
    name: 'SHIKAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-urayasu',
    name: 'URAYASU',
    flag: 'JPN',
  },
  {
    id: 'jpn-kawasaki',
    name: 'KAWASAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-ishikawa',
    name: 'ISHIKAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-jpn-80',
    name: 'JPN-80',
    flag: 'JPN',
  },
  {
    id: 'jpn-fukuoka',
    name: 'FUKUOKA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tokushima',
    name: 'TOKUSHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-masaki-cho',
    name: 'MASAKI-CHO',
    flag: 'JPN',
  },
  {
    id: 'jpn-nago',
    name: 'NAGO',
    flag: 'JPN',
  },
  {
    id: 'jpn-sakai-senboku',
    name: 'SAKAI-SENBOKU',
    flag: 'JPN',
  },
  {
    id: 'jpn-sukumo',
    name: 'SUKUMO',
    flag: 'JPN',
  },
  {
    id: 'jpn-nishinoomote',
    name: 'NISHINOOMOTE',
    flag: 'JPN',
  },
  {
    id: 'jpn-aomori',
    name: 'AOMORI',
    flag: 'JPN',
  },
  {
    id: 'jpn-yasugicho',
    name: 'YASUGICHO',
    flag: 'JPN',
  },
  {
    id: 'jpn-chofu',
    name: 'CHOFU',
    flag: 'JPN',
  },
  {
    id: 'jpn-ryotsu-minato',
    name: 'RYOTSU-MINATO',
    flag: 'JPN',
  },
  {
    id: 'jpn-otake',
    name: 'OTAKE',
    flag: 'JPN',
  },
  {
    id: 'jpn-nagasaki',
    name: 'NAGASAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-nishishinminato',
    name: 'NISHISHINMINATO',
    flag: 'JPN',
  },
  {
    id: 'jpn-hakata',
    name: 'HAKATA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kagoshima',
    name: 'KAGOSHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-jpn-243',
    name: 'JPN-243',
    flag: 'JPN',
  },
  {
    id: 'jpn-yahata',
    name: 'YAHATA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kikumako',
    name: 'KIKUMA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-kochiko',
    name: 'KOCHI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-matsu-shima',
    name: 'MATSU-SHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hannanko',
    name: 'HANNAN KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-nichinan',
    name: 'NICHINAN',
    flag: 'JPN',
  },
  {
    id: 'jpn-kushikino',
    name: 'KUSHIKINO',
    flag: 'JPN',
  },
  {
    id: 'jpn-narutocho-mitsuishi',
    name: 'NARUTOCHO-MITSUISHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-oitako',
    name: 'OITA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-takahama',
    name: 'TAKAHAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-izumiotsu',
    name: 'IZUMIOTSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-shimminato',
    name: 'SHIMMINATO',
    flag: 'JPN',
  },
  {
    id: 'jpn-akitafunagawa',
    name: 'AKITAFUNAGAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-miyajima',
    name: 'MIYAJIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-sakai-minato',
    name: 'SAKAI-MINATO',
    flag: 'JPN',
  },
  {
    id: 'jpn-katsunanko',
    name: 'KATSUNAN KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-owaseko',
    name: 'OWASE KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-nagato',
    name: 'NAGATO',
    flag: 'JPN',
  },
  {
    id: 'jpn-otaru',
    name: 'OTARU',
    flag: 'JPN',
  },
  {
    id: 'jpn-himeji',
    name: 'HIMEJI',
    flag: 'JPN',
  },
  {
    id: 'jpn-ogasawara',
    name: 'OGASAWARA',
    flag: 'JPN',
  },
  {
    id: 'jpn-oikawa',
    name: 'OIKAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-numazu',
    name: 'NUMAZU',
    flag: 'JPN',
  },
  {
    id: 'jpn-minamatako',
    name: 'MINAMATA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-yokkaichi',
    name: 'YOKKAICHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-tateyama',
    name: 'TATEYAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-iwakuniko',
    name: 'IWAKUNI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-jpn-507',
    name: 'JPN-507',
    flag: 'JPN',
  },
  {
    id: 'jpn-mutsu',
    name: 'MUTSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-takehara',
    name: 'TAKEHARA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tokyo',
    name: 'TOKYO',
    flag: 'JPN',
  },
  {
    id: 'jpn-sakaideko',
    name: 'SAKAIDE KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-jpn-491',
    name: 'JPN-491',
    flag: 'JPN',
  },
  {
    id: 'jpn-miike',
    name: 'MIIKE',
    flag: 'JPN',
  },
  {
    id: 'jpn-nahako',
    name: 'NAHA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-ube',
    name: 'UBE',
    flag: 'JPN',
  },
  {
    id: 'jpn-ibusuki',
    name: 'IBUSUKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-shingu',
    name: 'SHINGU',
    flag: 'JPN',
  },
  {
    id: 'jpn-tadotsu',
    name: 'TADOTSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-ako',
    name: 'AKO',
    flag: 'JPN',
  },
  {
    id: 'jpn-sakai',
    name: 'SAKAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-toba',
    name: 'TOBA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tomakomaiko',
    name: 'TOMAKOMAI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-fushiki-toyama',
    name: 'FUSHIKI-TOYAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hekinan',
    name: 'HEKINAN',
    flag: 'JPN',
  },
  {
    id: 'jpn-oyama',
    name: 'OYAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-iyo',
    name: 'IYO',
    flag: 'JPN',
  },
  {
    id: 'jpn-himekawa',
    name: 'HIMEKAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-susakiko',
    name: 'SUSAKI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-ishikaribaynewport',
    name: 'ISHIKARI BAY NEW PORT',
    flag: 'JPN',
  },
  {
    id: 'jpn-uragako',
    name: 'URAGA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-onomichi-itozaki',
    name: 'ONOMICHI-ITOZAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-saijo',
    name: 'SAIJO',
    flag: 'JPN',
  },
  {
    id: 'jpn-jpn-364',
    name: 'JPN-364',
    flag: 'JPN',
  },
  {
    id: 'jpn-imabariko',
    name: 'IMABARI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-mikawa',
    name: 'MIKAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tsurusaki',
    name: 'TSURUSAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-easternpartofniigata-ko',
    name: 'EASTERN PART OF NIIGATA-KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-yokosuka',
    name: 'YOKOSUKA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kuji',
    name: 'KUJI',
    flag: 'JPN',
  },
  {
    id: 'jpn-kure',
    name: 'KURE',
    flag: 'JPN',
  },
  {
    id: 'jpn-mizushimako',
    name: 'MIZUSHIMA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-karatsu',
    name: 'KARATSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-kanazawa',
    name: 'KANAZAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kesennuma',
    name: 'KESENNUMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kimitsu',
    name: 'KIMITSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-miikeko',
    name: 'MIIKE KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-hibiko',
    name: 'HIBI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-sakaiminato',
    name: 'SAKAIMINATO',
    flag: 'JPN',
  },
  {
    id: 'jpn-yura',
    name: 'YURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-onomichi',
    name: 'ONOMICHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-tobata',
    name: 'TOBATA',
    flag: 'JPN',
  },
  {
    id: 'jpn-chibako',
    name: 'CHIBA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-ichihara',
    name: 'ICHIHARA',
    flag: 'JPN',
  },
  {
    id: 'jpn-shimodako',
    name: 'SHIMODA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-tsurugako',
    name: 'TSURUGA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-shimoda',
    name: 'SHIMODA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kamiiso',
    name: 'KAMIISO',
    flag: 'JPN',
  },
  {
    id: 'jpn-yamada',
    name: 'YAMADA',
    flag: 'JPN',
  },
  {
    id: 'jpn-miyazu',
    name: 'MIYAZU',
    flag: 'JPN',
  },
  {
    id: 'jpn-tokuyama',
    name: 'TOKUYAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-habuko',
    name: 'HABU KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-hiroo',
    name: 'HIROO',
    flag: 'JPN',
  },
  {
    id: 'jpn-abashiriko',
    name: 'ABASHIRI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-minato',
    name: 'MINATO',
    flag: 'JPN',
  },
  {
    id: 'jpn-miyanoura',
    name: 'MIYANOURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-wakkanai',
    name: 'WAKKANAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-fukura',
    name: 'FUKURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-nanaoko',
    name: 'NANAO KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-nagoyako',
    name: 'NAGOYA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-imari',
    name: 'IMARI',
    flag: 'JPN',
  },
  {
    id: 'jpn-yokohama',
    name: 'YOKOHAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-niihama',
    name: 'NIIHAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-aioi',
    name: 'AIOI',
    flag: 'JPN',
  },
  {
    id: 'jpn-kamisu',
    name: 'KAMISU',
    flag: 'JPN',
  },
  {
    id: 'jpn-hososhimako',
    name: 'HOSOSHIMA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-tonda',
    name: 'TONDA',
    flag: 'JPN',
  },
  {
    id: 'jpn-nishihara',
    name: 'NISHIHARA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hikari',
    name: 'HIKARI',
    flag: 'JPN',
  },
  {
    id: 'jpn-hofu',
    name: 'HOFU',
    flag: 'JPN',
  },
  {
    id: 'jpn-mikuni',
    name: 'MIKUNI',
    flag: 'JPN',
  },
  {
    id: 'jpn-kariya',
    name: 'KARIYA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kikonai',
    name: 'KIKONAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-tachibana',
    name: 'TACHIBANA',
    flag: 'JPN',
  },
  {
    id: 'jpn-muroto-misakicho',
    name: 'MUROTO-MISAKICHO',
    flag: 'JPN',
  },
  {
    id: 'jpn-urasoe',
    name: 'URASOE',
    flag: 'JPN',
  },
  {
    id: 'jpn-amagasaki',
    name: 'AMAGASAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-kudamatsu',
    name: 'KUDAMATSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-yatsushiroko',
    name: 'YATSUSHIRO KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-uchiura',
    name: 'UCHIURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hakodateko',
    name: 'HAKODATE KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-muroranko',
    name: 'MURORAN KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-tsukumiko',
    name: 'TSUKUMI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-shimonoseki',
    name: 'SHIMONOSEKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-minamiise',
    name: 'MINAMIISE',
    flag: 'JPN',
  },
  {
    id: 'jpn-mitsukojima',
    name: 'MITSUKOJIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-katsuren-haebaru',
    name: 'KATSUREN-HAEBARU',
    flag: 'JPN',
  },
  {
    id: 'jpn-matsuura',
    name: 'MATSUURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-jpn-490',
    name: 'JPN-490',
    flag: 'JPN',
  },
  {
    id: 'jpn-oarai',
    name: 'OARAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-katsuura',
    name: 'KATSUURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-miyako',
    name: 'MIYAKO',
    flag: 'JPN',
  },
  {
    id: 'jpn-saikiko',
    name: 'SAIKI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-okinawa',
    name: 'OKINAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hanasaki',
    name: 'HANASAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-kushiro',
    name: 'KUSHIRO',
    flag: 'JPN',
  },
  {
    id: 'jpn-mombetsuko',
    name: 'MOMBETSU KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-misumiko',
    name: 'MISUMI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-kamaishiko',
    name: 'KAMAISHI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-maizuru',
    name: 'MAIZURU',
    flag: 'JPN',
  },
  {
    id: 'jpn-ishinomaki',
    name: 'ISHINOMAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-kiire',
    name: 'KIIRE',
    flag: 'JPN',
  },
  {
    id: 'jpn-marugameko',
    name: 'MARUGAME KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-onahamako',
    name: 'ONAHAMA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-sakatako',
    name: 'SAKATA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-gamagoriko',
    name: 'GAMAGORI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-unoko',
    name: 'UNO KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-kushiroko',
    name: 'KUSHIRO KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-nakagusuku',
    name: 'NAKAGUSUKU',
    flag: 'JPN',
  },
  {
    id: 'jpn-niigatako',
    name: 'NIIGATA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-omura',
    name: 'OMURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-mishima-kawanoeko',
    name: 'MISHIMA-KAWANOE KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-muroran',
    name: 'MURORAN',
    flag: 'JPN',
  },
  {
    id: 'jpn-mega',
    name: 'MEGA',
    flag: 'JPN',
  },
  {
    id: 'jpn-oita',
    name: 'OITA',
    flag: 'JPN',
  },
  {
    id: 'jpn-mihara',
    name: 'MIHARA',
    flag: 'JPN',
  },
  {
    id: 'jpn-muturezimako',
    name: 'MUTUREZIMA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-atami',
    name: 'ATAMI',
    flag: 'JPN',
  },
  {
    id: 'jpn-chita',
    name: 'CHITA',
    flag: 'JPN',
  },
  {
    id: 'jpn-yanai',
    name: 'YANAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-kesennumako',
    name: 'KESENNUMA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-tagajo-shi',
    name: 'TAGAJO-SHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-komatsushima',
    name: 'KOMATSUSHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hiroshima',
    name: 'HIROSHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-izumisano',
    name: 'IZUMISANO',
    flag: 'JPN',
  },
  {
    id: 'jpn-atsumi',
    name: 'ATSUMI',
    flag: 'JPN',
  },
  {
    id: 'jpn-hamadako',
    name: 'HAMADA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-kochi',
    name: 'KOCHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-uruma',
    name: 'URUMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-mojiko',
    name: 'MOJI KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-wakayama-shimotsuko',
    name: 'WAKAYAMA-SHIMOTSU KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-kakogawa',
    name: 'KAKOGAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tagonourako',
    name: 'TAGONOURA KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-takasago',
    name: 'TAKASAGO',
    flag: 'JPN',
  },
  {
    id: 'jpn-gobo',
    name: 'GOBO',
    flag: 'JPN',
  },
  {
    id: 'jpn-takamatsu',
    name: 'TAKAMATSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-kashiwazaki',
    name: 'KASHIWAZAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-maizuruko',
    name: 'MAIZURU KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-moji',
    name: 'MOJI',
    flag: 'JPN',
  },
  {
    id: 'jpn-tanabeko',
    name: 'TANABE KO',
    flag: 'JPN',
  },
  {
    id: 'jpn-amami',
    name: 'AMAMI',
    flag: 'JPN',
  },
  {
    id: 'jpn-oshima',
    name: 'OSHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hachinohe',
    name: 'HACHINOHE',
    flag: 'JPN',
  },
  {
    id: 'jpn-shiogama',
    name: 'SHIOGAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-etajima',
    name: 'ETAJIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-nagoya',
    name: 'NAGOYA',
    flag: 'JPN',
  },
  {
    id: 'jpn-shibushi',
    name: 'SHIBUSHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-beppu',
    name: 'BEPPU',
    flag: 'JPN',
  },
  {
    id: 'kor-gwangyanghang',
    name: 'GWANGYANG HANG',
    flag: 'KOR',
  },
  {
    id: 'kor-inchon',
    name: 'INCHON',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-132',
    name: 'KOR-132',
    flag: 'KOR',
  },
  {
    id: 'kor-tonghae',
    name: 'TONGHAE',
    flag: 'KOR',
  },
  {
    id: 'kor-osikdodong',
    name: 'OSIKDO DONG',
    flag: 'KOR',
  },
  {
    id: 'kor-daesan',
    name: 'DAESAN',
    flag: 'KOR',
  },
  {
    id: 'kor-incheon',
    name: 'INCHEON',
    flag: 'KOR',
  },
  {
    id: 'kor-gunsan',
    name: 'GUNSAN',
    flag: 'KOR',
  },
  {
    id: 'kor-mukho',
    name: 'MUKHO',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-196',
    name: 'KOR-196',
    flag: 'KOR',
  },
  {
    id: 'kor-jodo',
    name: 'JODO',
    flag: 'KOR',
  },
  {
    id: 'kor-pohang',
    name: 'POHANG',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-147',
    name: 'KOR-147',
    flag: 'KOR',
  },
  {
    id: 'kor-gaigeturi',
    name: 'GAIGETURI',
    flag: 'KOR',
  },
  {
    id: 'kor-chejuhang',
    name: 'CHEJU HANG',
    flag: 'KOR',
  },
  {
    id: 'kor-jinhaeman',
    name: 'JINHAE MAN',
    flag: 'KOR',
  },
  {
    id: 'kor-yeosu',
    name: 'YEOSU',
    flag: 'KOR',
  },
  {
    id: 'kor-busan',
    name: 'BUSAN',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-88',
    name: 'KOR-88',
    flag: 'KOR',
  },
  {
    id: 'kor-jinhae',
    name: 'JINHAE',
    flag: 'KOR',
  },
  {
    id: 'kor-hamori',
    name: 'HAMORI',
    flag: 'KOR',
  },
  {
    id: 'kor-ilgwang',
    name: 'ILGWANG',
    flag: 'KOR',
  },
  {
    id: 'kor-jeongwang-dong',
    name: 'JEONGWANG-DONG',
    flag: 'KOR',
  },
  {
    id: 'kor-tongyeong',
    name: 'TONGYEONG',
    flag: 'KOR',
  },
  {
    id: 'kor-gampo',
    name: 'GAMPO',
    flag: 'KOR',
  },
  {
    id: 'kor-taesal-li',
    name: 'TAESAL-LI',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-204',
    name: 'KOR-204',
    flag: 'KOR',
  },
  {
    id: 'kor-seocheon',
    name: 'SEOCHEON',
    flag: 'KOR',
  },
  {
    id: 'kor-moppo',
    name: 'MOPPO',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-227',
    name: 'KOR-227',
    flag: 'KOR',
  },
  {
    id: 'kor-hacheong',
    name: 'HACHEONG',
    flag: 'KOR',
  },
  {
    id: 'kor-yosu',
    name: 'YOSU',
    flag: 'KOR',
  },
  {
    id: 'kor-gadeokchannel',
    name: 'GADEOK CHANNEL',
    flag: 'KOR',
  },
  {
    id: 'kor-guryongpo',
    name: 'GURYONGPO',
    flag: 'KOR',
  },
  {
    id: 'kor-gohyeon',
    name: 'GOHYEON',
    flag: 'KOR',
  },
  {
    id: 'kor-ulsan',
    name: 'ULSAN',
    flag: 'KOR',
  },
  {
    id: 'kor-sinhyeon',
    name: 'SINHYEON',
    flag: 'KOR',
  },
  {
    id: 'kor-bucheon-si',
    name: 'BUCHEON-SI',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-57',
    name: 'KOR-57',
    flag: 'KOR',
  },
  {
    id: 'kor-okpo',
    name: 'OKPO',
    flag: 'KOR',
  },
  {
    id: 'kor-masan',
    name: 'MASAN',
    flag: 'KOR',
  },
  {
    id: 'kor-pyeongtaekhang',
    name: 'PYEONGTAEK HANG',
    flag: 'KOR',
  },
  {
    id: 'kor-mokpo',
    name: 'MOKPO',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-120',
    name: 'KOR-120',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-61',
    name: 'KOR-61',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-103',
    name: 'KOR-103',
    flag: 'KOR',
  },
  {
    id: 'kor-oepo',
    name: 'OEPO',
    flag: 'KOR',
  },
  {
    id: 'kor-santyoku',
    name: 'SANTYOKU',
    flag: 'KOR',
  },
  {
    id: 'kor-kunsan',
    name: 'KUNSAN',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-29',
    name: 'KOR-29',
    flag: 'KOR',
  },
  {
    id: 'kor-sim-ri',
    name: 'SIM-RI',
    flag: 'KOR',
  },
  {
    id: 'kor-gijang',
    name: 'GIJANG',
    flag: 'KOR',
  },
  {
    id: 'kor-daecheonhang',
    name: 'DAECHEONHANG',
    flag: 'KOR',
  },
  {
    id: 'kor-seogwipo',
    name: 'SEOGWIPO',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-3',
    name: 'KOR-3',
    flag: 'KOR',
  },
  {
    id: 'kor-donghae',
    name: 'DONGHAE',
    flag: 'KOR',
  },
  {
    id: 'kor-yokji',
    name: 'YOKJI',
    flag: 'KOR',
  },
  {
    id: 'kor-daesanhang',
    name: 'DAESAN HANG',
    flag: 'KOR',
  },
  {
    id: 'kor-jangjwa',
    name: 'JANGJWA',
    flag: 'KOR',
  },
  {
    id: 'kor-nanpo-ri',
    name: 'NANPO-RI',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-164',
    name: 'KOR-164',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-35',
    name: 'KOR-35',
    flag: 'KOR',
  },
  {
    id: 'kor-heuksando',
    name: 'HEUKSANDO',
    flag: 'KOR',
  },
  {
    id: 'kor-uldo-ri',
    name: 'ULDO-RI',
    flag: 'KOR',
  },
  {
    id: 'kor-kor-155',
    name: 'KOR-155',
    flag: 'KOR',
  },
  {
    id: 'kor-naesan-ri',
    name: 'NAESAN-RI',
    flag: 'KOR',
  },
  {
    id: 'mex-cabosanlucas',
    name: 'CABO SAN LUCAS',
    flag: 'MEX',
  },
  {
    id: 'mex-tampico',
    name: 'TAMPICO',
    flag: 'MEX',
  },
  {
    id: 'mex-lapaz',
    name: 'LA PAZ',
    flag: 'MEX',
  },
  {
    id: 'mex-mex-58',
    name: 'MEX-58',
    flag: 'MEX',
  },
  {
    id: 'mex-tuxpan',
    name: 'TUXPAN',
    flag: 'MEX',
  },
  {
    id: 'mex-rosarito',
    name: 'ROSARITO',
    flag: 'MEX',
  },
  {
    id: 'mex-mex-45',
    name: 'MEX-45',
    flag: 'MEX',
  },
  {
    id: 'mex-islasanmarcos',
    name: 'ISLA SAN MARCOS',
    flag: 'MEX',
  },
  {
    id: 'mex-mex-144',
    name: 'MEX-144',
    flag: 'MEX',
  },
  {
    id: 'mex-mex-60',
    name: 'MEX-60',
    flag: 'MEX',
  },
  {
    id: 'mex-pacificocean',
    name: 'PACIFIC OCEAN',
    flag: 'MEX',
  },
  {
    id: 'mex-altamira',
    name: 'ALTAMIRA',
    flag: 'MEX',
  },
  {
    id: 'mex-sanjuandelacosta',
    name: 'SAN JUAN DE LA COSTA',
    flag: 'MEX',
  },
  {
    id: 'mex-sanmigueldecozumel',
    name: 'SAN MIGUEL DE COZUMEL',
    flag: 'MEX',
  },
  {
    id: 'mex-lazarocardenas',
    name: 'LAZARO CARDENAS',
    flag: 'MEX',
  },
  {
    id: 'mex-acapulco',
    name: 'ACAPULCO',
    flag: 'MEX',
  },
  {
    id: 'mex-islamujeres',
    name: 'ISLA MUJERES',
    flag: 'MEX',
  },
  {
    id: 'mex-mazatlan',
    name: 'MAZATLAN',
    flag: 'MEX',
  },
  {
    id: 'mex-seybaplaya',
    name: 'SEYBAPLAYA',
    flag: 'MEX',
  },
  {
    id: 'mex-salinacruz',
    name: 'SALINA CRUZ',
    flag: 'MEX',
  },
  {
    id: 'mex-ensenada',
    name: 'ENSENADA',
    flag: 'MEX',
  },
  {
    id: 'mex-lavictoria(lapenita)',
    name: 'LA VICTORIA (LA PENITA)',
    flag: 'MEX',
  },
  {
    id: 'mex-lasjarretaderas',
    name: 'LAS JARRETADERAS',
    flag: 'MEX',
  },
  {
    id: 'mex-elencanto',
    name: 'EL ENCANTO',
    flag: 'MEX',
  },
  {
    id: 'mex-loreto',
    name: 'LORETO',
    flag: 'MEX',
  },
  {
    id: 'mex-frontera',
    name: 'FRONTERA',
    flag: 'MEX',
  },
  {
    id: 'mex-cozumel',
    name: 'COZUMEL',
    flag: 'MEX',
  },
  {
    id: 'mex-mex-23',
    name: 'MEX-23',
    flag: 'MEX',
  },
  {
    id: 'mex-ciudadmadero',
    name: 'CIUDAD MADERO',
    flag: 'MEX',
  },
  {
    id: 'mex-santarosalia',
    name: 'SANTA ROSALIA',
    flag: 'MEX',
  },
  {
    id: 'mex-chelem',
    name: 'CHELEM',
    flag: 'MEX',
  },
  {
    id: 'mex-moralillo',
    name: 'MORALILLO',
    flag: 'MEX',
  },
  {
    id: 'mex-heroicaalvarado',
    name: 'HEROICA ALVARADO',
    flag: 'MEX',
  },
  {
    id: 'mex-jaluco',
    name: 'JALUCO',
    flag: 'MEX',
  },
  {
    id: 'mex-mex-100',
    name: 'MEX-100',
    flag: 'MEX',
  },
  {
    id: 'mex-manzanillo',
    name: 'MANZANILLO',
    flag: 'MEX',
  },
  {
    id: 'mex-mex-174',
    name: 'MEX-174',
    flag: 'MEX',
  },
  {
    id: 'mex-ciudaddelcarmen',
    name: 'CIUDAD DEL CARMEN',
    flag: 'MEX',
  },
  {
    id: 'mex-penjamo',
    name: 'PENJAMO',
    flag: 'MEX',
  },
  {
    id: 'mex-mex-130',
    name: 'MEX-130',
    flag: 'MEX',
  },
  {
    id: 'mex-ixtapa-zihuatanejo',
    name: 'IXTAPA-ZIHUATANEJO',
    flag: 'MEX',
  },
  {
    id: 'mex-veracruz',
    name: 'VERACRUZ',
    flag: 'MEX',
  },
  {
    id: 'mex-tsiminfield',
    name: 'TSIMIN FIELD',
    flag: 'MEX',
  },
  {
    id: 'mex-dosbocasterminal',
    name: 'DOS BOCAS TERMINAL',
    flag: 'MEX',
  },
  {
    id: 'mex-ixtapa',
    name: 'IXTAPA',
    flag: 'MEX',
  },
  {
    id: 'mex-topolobampo',
    name: 'TOPOLOBAMPO',
    flag: 'MEX',
  },
  {
    id: 'mex-heroicaguaymas',
    name: 'HEROICA GUAYMAS',
    flag: 'MEX',
  },
  {
    id: 'mex-puertomadero',
    name: 'PUERTO MADERO',
    flag: 'MEX',
  },
  {
    id: 'mex-puertopenasco',
    name: 'PUERTO PENASCO',
    flag: 'MEX',
  },
  {
    id: 'mex-mex-86',
    name: 'MEX-86',
    flag: 'MEX',
  },
  {
    id: 'mex-coatzacoalcos',
    name: 'COATZACOALCOS',
    flag: 'MEX',
  },
  {
    id: 'mex-puertomorroredondo',
    name: 'PUERTO MORRO REDONDO',
    flag: 'MEX',
  },
  {
    id: 'mex-mex-93',
    name: 'MEX-93',
    flag: 'MEX',
  },
  {
    id: 'mex-mex-13',
    name: 'MEX-13',
    flag: 'MEX',
  },
  {
    id: 'mex-pichilingue',
    name: 'PICHILINGUE',
    flag: 'MEX',
  },
  {
    id: 'mex-tapeixtles',
    name: 'TAPEIXTLES',
    flag: 'MEX',
  },
  {
    id: 'mex-mex-51',
    name: 'MEX-51',
    flag: 'MEX',
  },
  {
    id: 'mex-mex-180',
    name: 'MEX-180',
    flag: 'MEX',
  },
  {
    id: 'mex-corraldelrisco(puntademita)',
    name: 'CORRAL DEL RISCO (PUNTA DE MITA)',
    flag: 'MEX',
  },
  {
    id: 'mex-acapulcodejuarez',
    name: 'ACAPULCO DE JUAREZ',
    flag: 'MEX',
  },
  {
    id: 'mex-crucecita',
    name: 'CRUCECITA',
    flag: 'MEX',
  },
  {
    id: 'mex-mex-177',
    name: 'MEX-177',
    flag: 'MEX',
  },
  {
    id: 'mex-laplaya',
    name: 'LA PLAYA',
    flag: 'MEX',
  },
  {
    id: 'mex-cayoarcasterminal',
    name: 'CAYO ARCAS TERMINAL',
    flag: 'MEX',
  },
  {
    id: 'mex-bucerias',
    name: 'BUCERIAS',
    flag: 'MEX',
  },
  {
    id: 'mys-kualasepetang',
    name: 'KUALA SEPETANG',
    flag: 'MYS',
  },
  {
    id: 'mys-permatangkuching',
    name: 'PERMATANG KUCHING',
    flag: 'MYS',
  },
  {
    id: 'mys-portdickson',
    name: 'PORT DICKSON',
    flag: 'MYS',
  },
  {
    id: 'mys-tanjungpelepas',
    name: 'TANJUNG PELEPAS',
    flag: 'MYS',
  },
  {
    id: 'mys-bintulu',
    name: 'BINTULU',
    flag: 'MYS',
  },
  {
    id: 'mys-pelabuhansandakan',
    name: 'PELABUHAN SANDAKAN',
    flag: 'MYS',
  },
  {
    id: 'mys-mys-6',
    name: 'MYS-6',
    flag: 'MYS',
  },
  {
    id: 'mys-kampungpasirgudangbaru',
    name: 'KAMPUNG PASIR GUDANG BARU',
    flag: 'MYS',
  },
  {
    id: 'mys-johor',
    name: 'JOHOR',
    flag: 'MYS',
  },
  {
    id: 'mys-fortunestar',
    name: 'FORTUNE STAR',
    flag: 'MYS',
  },
  {
    id: 'mys-kualaperlis',
    name: 'KUALA PERLIS',
    flag: 'MYS',
  },
  {
    id: 'mys-lumut',
    name: 'LUMUT',
    flag: 'MYS',
  },
  {
    id: 'mys-kuantannewport',
    name: 'KUANTAN NEW PORT',
    flag: 'MYS',
  },
  {
    id: 'mys-kualatrengganu',
    name: 'KUALA TRENGGANU',
    flag: 'MYS',
  },
  {
    id: 'mys-kemamanharbor',
    name: 'KEMAMAN HARBOR',
    flag: 'MYS',
  },
  {
    id: 'mys-portlangkawi',
    name: 'PORT LANGKAWI',
    flag: 'MYS',
  },
  {
    id: 'mys-melaka',
    name: 'MELAKA',
    flag: 'MYS',
  },
  {
    id: 'mys-portklang',
    name: 'PORT KLANG',
    flag: 'MYS',
  },
  {
    id: 'mys-pulaupinang',
    name: 'PULAU PINANG',
    flag: 'MYS',
  },
  {
    id: 'mys-mys-126',
    name: 'MYS-126',
    flag: 'MYS',
  },
  {
    id: 'mys-pelabuhansungaiudang',
    name: 'PELABUHAN SUNGAI UDANG',
    flag: 'MYS',
  },
  {
    id: 'mys-miri',
    name: 'MIRI',
    flag: 'MYS',
  },
  {
    id: 'mys-mostyn',
    name: 'MOSTYN',
    flag: 'MYS',
  },
  {
    id: 'mys-johorbahru',
    name: 'JOHOR BAHRU',
    flag: 'MYS',
  },
  {
    id: 'mys-lahaddatu',
    name: 'LAHAD DATU',
    flag: 'MYS',
  },
  {
    id: 'mys-bandarlabuan',
    name: 'BANDAR LABUAN',
    flag: 'MYS',
  },
  {
    id: 'mys-butterworth',
    name: 'BUTTERWORTH',
    flag: 'MYS',
  },
  {
    id: 'mys-victoria',
    name: 'VICTORIA',
    flag: 'MYS',
  },
  {
    id: 'mys-singapore',
    name: 'SINGAPORE',
    flag: 'MYS',
  },
  {
    id: 'mys-kualakedah',
    name: 'KUALA KEDAH',
    flag: 'MYS',
  },
  {
    id: 'mys-pantaicenang',
    name: 'PANTAI CENANG',
    flag: 'MYS',
  },
  {
    id: 'mys-kampungkok',
    name: 'KAMPUNG KOK',
    flag: 'MYS',
  },
  {
    id: 'mys-tawa',
    name: 'TAWA',
    flag: 'MYS',
  },
  {
    id: 'mys-kuantan',
    name: 'KUANTAN',
    flag: 'MYS',
  },
  {
    id: 'mys-kirtehoilterminal',
    name: 'KIRTEH OIL TERMINAL',
    flag: 'MYS',
  },
  {
    id: 'mys-sapangarbay',
    name: 'SAPANGAR BAY',
    flag: 'MYS',
  },
  {
    id: 'mys-alorsetar',
    name: 'ALOR SETAR',
    flag: 'MYS',
  },
  {
    id: 'mys-sibu',
    name: 'SIBU',
    flag: 'MYS',
  },
  {
    id: 'mys-tanjungtokong',
    name: 'TANJUNG TOKONG',
    flag: 'MYS',
  },
  {
    id: 'mys-pantairemis',
    name: 'PANTAI REMIS',
    flag: 'MYS',
  },
  {
    id: 'mys-batupahat',
    name: 'BATU PAHAT',
    flag: 'MYS',
  },
  {
    id: 'mys-jenjarum',
    name: 'JENJARUM',
    flag: 'MYS',
  },
  {
    id: 'mys-klebangbesar',
    name: 'KLEBANG BESAR',
    flag: 'MYS',
  },
  {
    id: 'mys-mys-76',
    name: 'MYS-76',
    flag: 'MYS',
  },
  {
    id: 'mys-penang',
    name: 'PENANG',
    flag: 'MYS',
  },
  {
    id: 'mys-bintuluport',
    name: 'BINTULU PORT',
    flag: 'MYS',
  },
  {
    id: 'mys-kotakinabalu',
    name: 'KOTA KINABALU',
    flag: 'MYS',
  },
  {
    id: 'mys-pelabuhanbass',
    name: 'PELABUHAN BASS',
    flag: 'MYS',
  },
  {
    id: 'mys-kampungtanjungkarang',
    name: 'KAMPUNG TANJUNG KARANG',
    flag: 'MYS',
  },
  {
    id: 'mys-klang',
    name: 'KLANG',
    flag: 'MYS',
  },
  {
    id: 'mys-lutong',
    name: 'LUTONG',
    flag: 'MYS',
  },
  {
    id: 'mys-tg.mani',
    name: 'TG. MANI',
    flag: 'MYS',
  },
  {
    id: 'mys-mys-107',
    name: 'MYS-107',
    flag: 'MYS',
  },
  {
    id: 'mys-perai',
    name: 'PERAI',
    flag: 'MYS',
  },
  {
    id: 'nld-katwijkaandenrijn',
    name: 'KATWIJK AAN DEN RIJN',
    flag: 'NLD',
  },
  {
    id: 'nld-maassluis',
    name: 'MAASSLUIS',
    flag: 'NLD',
  },
  {
    id: 'nld-tuk',
    name: 'TUK',
    flag: 'NLD',
  },
  {
    id: 'nld-rhenen',
    name: 'RHENEN',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-429',
    name: 'NLD-429',
    flag: 'NLD',
  },
  {
    id: 'nld-alblasserdam',
    name: 'ALBLASSERDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-giesbeek',
    name: 'GIESBEEK',
    flag: 'NLD',
  },
  {
    id: 'nld-oudewetering',
    name: 'OUDE WETERING',
    flag: 'NLD',
  },
  {
    id: 'nld-garyp',
    name: 'GARYP',
    flag: 'NLD',
  },
  {
    id: 'nld-berghem',
    name: 'BERGHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-opheusden',
    name: 'OPHEUSDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-rijnsaterwoude',
    name: 'RIJNSATERWOUDE',
    flag: 'NLD',
  },
  {
    id: 'nld-sneek',
    name: 'SNEEK',
    flag: 'NLD',
  },
  {
    id: 'nld-grijpskerk',
    name: 'GRIJPSKERK',
    flag: 'NLD',
  },
  {
    id: 'nld-beers',
    name: 'BEERS',
    flag: 'NLD',
  },
  {
    id: 'nld-harderwijk',
    name: 'HARDERWIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-heerenveen',
    name: 'HEERENVEEN',
    flag: 'NLD',
  },
  {
    id: 'nld-sasvangent',
    name: 'SAS VAN GENT',
    flag: 'NLD',
  },
  {
    id: 'nld-dekruiskamp',
    name: 'DE KRUISKAMP',
    flag: 'NLD',
  },
  {
    id: 'nld-lobith',
    name: 'LOBITH',
    flag: 'NLD',
  },
  {
    id: 'nld-zoelen',
    name: 'ZOELEN',
    flag: 'NLD',
  },
  {
    id: 'nld-voorschoten',
    name: 'VOORSCHOTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-rijnsburg',
    name: 'RIJNSBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-rijpwetering',
    name: 'RIJPWETERING',
    flag: 'NLD',
  },
  {
    id: 'nld-geldermalsen',
    name: 'GELDERMALSEN',
    flag: 'NLD',
  },
  {
    id: 'nld-lieshout',
    name: 'LIESHOUT',
    flag: 'NLD',
  },
  {
    id: 'nld-leiden',
    name: 'LEIDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-twekkelerveld',
    name: 'TWEKKELERVELD',
    flag: 'NLD',
  },
  {
    id: 'nld-wapenveld',
    name: 'WAPENVELD',
    flag: 'NLD',
  },
  {
    id: 'nld-thehague',
    name: 'THE HAGUE',
    flag: 'NLD',
  },
  {
    id: 'nld-scharendijke',
    name: 'SCHARENDIJKE',
    flag: 'NLD',
  },
  {
    id: 'nld-obbicht',
    name: 'OBBICHT',
    flag: 'NLD',
  },
  {
    id: 'nld-montfoort',
    name: 'MONTFOORT',
    flag: 'NLD',
  },
  {
    id: 'nld-goutum',
    name: 'GOUTUM',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-214',
    name: 'NLD-214',
    flag: 'NLD',
  },
  {
    id: 'nld-zeewolde',
    name: 'ZEEWOLDE',
    flag: 'NLD',
  },
  {
    id: 'nld-giethoorn',
    name: 'GIETHOORN',
    flag: 'NLD',
  },
  {
    id: 'nld-maurik',
    name: 'MAURIK',
    flag: 'NLD',
  },
  {
    id: 'nld-denoever',
    name: 'DEN OEVER',
    flag: 'NLD',
  },
  {
    id: 'nld-heumen',
    name: 'HEUMEN',
    flag: 'NLD',
  },
  {
    id: 'nld-monnickendam',
    name: 'MONNICKENDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-leimuiden',
    name: 'LEIMUIDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-middelrode',
    name: 'MIDDELRODE',
    flag: 'NLD',
  },
  {
    id: 'nld-ijsselstein',
    name: 'IJSSELSTEIN',
    flag: 'NLD',
  },
  {
    id: 'nld-oosterpark',
    name: 'OOSTERPARK',
    flag: 'NLD',
  },
  {
    id: 'nld-zoutkamp',
    name: 'ZOUTKAMP',
    flag: 'NLD',
  },
  {
    id: 'nld-enkhuizen',
    name: 'ENKHUIZEN',
    flag: 'NLD',
  },
  {
    id: 'nld-burgum',
    name: 'BURGUM',
    flag: 'NLD',
  },
  {
    id: 'nld-huizen',
    name: 'HUIZEN',
    flag: 'NLD',
  },
  {
    id: 'nld-holtum',
    name: 'HOLTUM',
    flag: 'NLD',
  },
  {
    id: 'nld-yerseke',
    name: 'YERSEKE',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-275',
    name: 'NLD-275',
    flag: 'NLD',
  },
  {
    id: 'nld-donk',
    name: 'DONK',
    flag: 'NLD',
  },
  {
    id: 'nld-stein',
    name: 'STEIN',
    flag: 'NLD',
  },
  {
    id: 'nld-grou',
    name: 'GROU',
    flag: 'NLD',
  },
  {
    id: 'nld-gouderak',
    name: 'GOUDERAK',
    flag: 'NLD',
  },
  {
    id: 'nld-vlissingen',
    name: 'VLISSINGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-hoekvanholland',
    name: 'HOEK VAN HOLLAND',
    flag: 'NLD',
  },
  {
    id: 'nld-andel',
    name: 'ANDEL',
    flag: 'NLD',
  },
  {
    id: 'nld-rijswijk',
    name: 'RIJSWIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-delfzijl',
    name: 'DELFZIJL',
    flag: 'NLD',
  },
  {
    id: 'nld-eijsden',
    name: 'EIJSDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-tolkamer',
    name: 'TOLKAMER',
    flag: 'NLD',
  },
  {
    id: 'nld-oudeschild',
    name: 'OUDESCHILD',
    flag: 'NLD',
  },
  {
    id: 'nld-kerkdriel',
    name: 'KERKDRIEL',
    flag: 'NLD',
  },
  {
    id: 'nld-liesveld',
    name: 'LIESVELD',
    flag: 'NLD',
  },
  {
    id: 'nld-dinteloord',
    name: 'DINTELOORD',
    flag: 'NLD',
  },
  {
    id: 'nld-wolphaartsdijk',
    name: 'WOLPHAARTSDIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-dehoven',
    name: 'DE HOVEN',
    flag: 'NLD',
  },
  {
    id: 'nld-emmeloord',
    name: 'EMMELOORD',
    flag: 'NLD',
  },
  {
    id: 'nld-mook',
    name: 'MOOK',
    flag: 'NLD',
  },
  {
    id: 'nld-ochten',
    name: 'OCHTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-rossum',
    name: 'ROSSUM',
    flag: 'NLD',
  },
  {
    id: 'nld-weert',
    name: 'WEERT',
    flag: 'NLD',
  },
  {
    id: 'nld-hatert',
    name: 'HATERT',
    flag: 'NLD',
  },
  {
    id: 'nld-rotterdam',
    name: 'ROTTERDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-halfweg',
    name: 'HALFWEG',
    flag: 'NLD',
  },
  {
    id: 'nld-schilberg',
    name: 'SCHILBERG',
    flag: 'NLD',
  },
  {
    id: 'nld-appingedam',
    name: 'APPINGEDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-hellevoetsluis',
    name: 'HELLEVOETSLUIS',
    flag: 'NLD',
  },
  {
    id: 'nld-selwerd',
    name: 'SELWERD',
    flag: 'NLD',
  },
  {
    id: 'nld-besoijen',
    name: 'BESOIJEN',
    flag: 'NLD',
  },
  {
    id: 'nld-zuidhorn',
    name: 'ZUIDHORN',
    flag: 'NLD',
  },
  {
    id: 'nld-waarde',
    name: 'WAARDE',
    flag: 'NLD',
  },
  {
    id: 'nld-sintnicolaasga',
    name: 'SINT NICOLAASGA',
    flag: 'NLD',
  },
  {
    id: 'nld-wisselaar',
    name: 'WISSELAAR',
    flag: 'NLD',
  },
  {
    id: 'nld-zuilichem',
    name: 'ZUILICHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-hasselt',
    name: 'HASSELT',
    flag: 'NLD',
  },
  {
    id: 'nld-almerestad',
    name: 'ALMERE STAD',
    flag: 'NLD',
  },
  {
    id: 'nld-goor',
    name: 'GOOR',
    flag: 'NLD',
  },
  {
    id: 'nld-baarlo',
    name: 'BAARLO',
    flag: 'NLD',
  },
  {
    id: 'nld-langeheit',
    name: 'LANGEHEIT',
    flag: 'NLD',
  },
  {
    id: 'nld-oosterhout',
    name: 'OOSTERHOUT',
    flag: 'NLD',
  },
  {
    id: 'nld-standdaarbuiten',
    name: 'STANDDAARBUITEN',
    flag: 'NLD',
  },
  {
    id: 'nld-denhelder',
    name: 'DEN HELDER',
    flag: 'NLD',
  },
  {
    id: 'nld-arnemuiden',
    name: 'ARNEMUIDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-kedichem',
    name: 'KEDICHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-herten',
    name: 'HERTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-vlietwijk',
    name: 'VLIETWIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-uitgeest',
    name: 'UITGEEST',
    flag: 'NLD',
  },
  {
    id: 'nld-akkrum',
    name: 'AKKRUM',
    flag: 'NLD',
  },
  {
    id: 'nld-kootstertille',
    name: 'KOOTSTERTILLE',
    flag: 'NLD',
  },
  {
    id: 'nld-zaandam',
    name: 'ZAANDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-ijlst',
    name: 'IJLST',
    flag: 'NLD',
  },
  {
    id: 'nld-korrewegwijk',
    name: 'KORREWEGWIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-192',
    name: 'NLD-192',
    flag: 'NLD',
  },
  {
    id: 'nld-augustinusga',
    name: 'AUGUSTINUSGA',
    flag: 'NLD',
  },
  {
    id: 'nld-tilburg',
    name: 'TILBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-culemborg',
    name: 'CULEMBORG',
    flag: 'NLD',
  },
  {
    id: 'nld-wildervank',
    name: 'WILDERVANK',
    flag: 'NLD',
  },
  {
    id: 'nld-schelluinen',
    name: 'SCHELLUINEN',
    flag: 'NLD',
  },
  {
    id: 'nld-hattem',
    name: 'HATTEM',
    flag: 'NLD',
  },
  {
    id: 'nld-barendrecht',
    name: 'BARENDRECHT',
    flag: 'NLD',
  },
  {
    id: 'nld-ens',
    name: 'ENS',
    flag: 'NLD',
  },
  {
    id: 'nld-doetinchem',
    name: 'DOETINCHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-zuid-beijerland',
    name: 'ZUID-BEIJERLAND',
    flag: 'NLD',
  },
  {
    id: 'nld-bunde',
    name: 'BUNDE',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-480',
    name: 'NLD-480',
    flag: 'NLD',
  },
  {
    id: 'nld-cuijk',
    name: 'CUIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-urmond',
    name: 'URMOND',
    flag: 'NLD',
  },
  {
    id: 'nld-aarle-rixtel',
    name: 'AARLE-RIXTEL',
    flag: 'NLD',
  },
  {
    id: 'nld-alphenaandenrijn',
    name: 'ALPHEN AAN DEN RIJN',
    flag: 'NLD',
  },
  {
    id: 'nld-breezanddijk',
    name: 'BREEZANDDIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-raamsdonk',
    name: 'RAAMSDONK',
    flag: 'NLD',
  },
  {
    id: 'nld-europoort',
    name: 'EUROPOORT',
    flag: 'NLD',
  },
  {
    id: 'nld-roermond',
    name: 'ROERMOND',
    flag: 'NLD',
  },
  {
    id: 'nld-antwerp',
    name: 'ANTWERP',
    flag: 'NLD',
  },
  {
    id: 'nld-ouddorp',
    name: 'OUDDORP',
    flag: 'NLD',
  },
  {
    id: 'nld-bakhuizen',
    name: 'BAKHUIZEN',
    flag: 'NLD',
  },
  {
    id: 'nld-dieren',
    name: 'DIEREN',
    flag: 'NLD',
  },
  {
    id: 'nld-heel',
    name: 'HEEL',
    flag: 'NLD',
  },
  {
    id: 'nld-brielle',
    name: 'BRIELLE',
    flag: 'NLD',
  },
  {
    id: 'nld-uithoorn',
    name: 'UITHOORN',
    flag: 'NLD',
  },
  {
    id: 'nld-coendersborg',
    name: 'COENDERSBORG',
    flag: 'NLD',
  },
  {
    id: 'nld-amsterdam',
    name: 'AMSTERDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-vlaardingen',
    name: 'VLAARDINGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-goudswaard',
    name: 'GOUDSWAARD',
    flag: 'NLD',
  },
  {
    id: 'nld-lindenholt',
    name: 'LINDENHOLT',
    flag: 'NLD',
  },
  {
    id: 'nld-heijen',
    name: 'HEIJEN',
    flag: 'NLD',
  },
  {
    id: 'nld-bruinisse',
    name: 'BRUINISSE',
    flag: 'NLD',
  },
  {
    id: 'nld-delft',
    name: 'DELFT',
    flag: 'NLD',
  },
  {
    id: 'nld-gouda',
    name: 'GOUDA',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-176',
    name: 'NLD-176',
    flag: 'NLD',
  },
  {
    id: 'nld-leeuwarden',
    name: 'LEEUWARDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-503',
    name: 'NLD-503',
    flag: 'NLD',
  },
  {
    id: 'nld-zaandijk',
    name: 'ZAANDIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-dordrecht',
    name: 'DORDRECHT',
    flag: 'NLD',
  },
  {
    id: 'nld-poortvliet',
    name: 'POORTVLIET',
    flag: 'NLD',
  },
  {
    id: 'nld-wijkbijduurstede',
    name: 'WIJK BIJ DUURSTEDE',
    flag: 'NLD',
  },
  {
    id: 'nld-duivendrecht',
    name: 'DUIVENDRECHT',
    flag: 'NLD',
  },
  {
    id: 'nld-dehagen',
    name: 'DE HAGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-colijnsplaat',
    name: 'COLIJNSPLAAT',
    flag: 'NLD',
  },
  {
    id: 'nld-noordgeest',
    name: 'NOORDGEEST',
    flag: 'NLD',
  },
  {
    id: 'nld-katwijkaanzee',
    name: 'KATWIJK AAN ZEE',
    flag: 'NLD',
  },
  {
    id: 'nld-sintphilipsland',
    name: 'SINT PHILIPSLAND',
    flag: 'NLD',
  },
  {
    id: 'nld-oldehove',
    name: 'OLDEHOVE',
    flag: 'NLD',
  },
  {
    id: 'nld-wanssum',
    name: 'WANSSUM',
    flag: 'NLD',
  },
  {
    id: 'nld-scheveningen',
    name: 'SCHEVENINGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-wijhe',
    name: 'WIJHE',
    flag: 'NLD',
  },
  {
    id: 'nld-wierden',
    name: 'WIERDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-hoogezand',
    name: 'HOOGEZAND',
    flag: 'NLD',
  },
  {
    id: 'nld-thorn',
    name: 'THORN',
    flag: 'NLD',
  },
  {
    id: 'nld-krimpenaandenijssel',
    name: 'KRIMPEN AAN DEN IJSSEL',
    flag: 'NLD',
  },
  {
    id: 'nld-oosterhoogebrug',
    name: 'OOSTERHOOGEBRUG',
    flag: 'NLD',
  },
  {
    id: 'nld-tholen',
    name: 'THOLEN',
    flag: 'NLD',
  },
  {
    id: 'nld-helmond',
    name: 'HELMOND',
    flag: 'NLD',
  },
  {
    id: 'nld-maasbracht',
    name: 'MAASBRACHT',
    flag: 'NLD',
  },
  {
    id: 'nld-milsbeek',
    name: 'MILSBEEK',
    flag: 'NLD',
  },
  {
    id: 'nld-tinga',
    name: 'TINGA',
    flag: 'NLD',
  },
  {
    id: 'nld-harlingen',
    name: 'HARLINGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-spoorwijk',
    name: 'SPOORWIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-herwijnen',
    name: 'HERWIJNEN',
    flag: 'NLD',
  },
  {
    id: 'nld-venlo',
    name: 'VENLO',
    flag: 'NLD',
  },
  {
    id: 'nld-beegden',
    name: 'BEEGDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-leest',
    name: 'LEEST',
    flag: 'NLD',
  },
  {
    id: 'nld-bunschoten',
    name: 'BUNSCHOTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-brakel',
    name: 'BRAKEL',
    flag: 'NLD',
  },
  {
    id: 'nld-erp',
    name: 'ERP',
    flag: 'NLD',
  },
  {
    id: 'nld-lemmer',
    name: 'LEMMER',
    flag: 'NLD',
  },
  {
    id: 'nld-alkmaar',
    name: 'ALKMAAR',
    flag: 'NLD',
  },
  {
    id: 'nld-hunnerberg',
    name: 'HUNNERBERG',
    flag: 'NLD',
  },
  {
    id: 'nld-winsum',
    name: 'WINSUM',
    flag: 'NLD',
  },
  {
    id: 'nld-wijbosch',
    name: 'WIJBOSCH',
    flag: 'NLD',
  },
  {
    id: 'nld-sintjoost',
    name: 'SINT JOOST',
    flag: 'NLD',
  },
  {
    id: 'nld-bolnes',
    name: 'BOLNES',
    flag: 'NLD',
  },
  {
    id: 'nld-ophemert',
    name: 'OPHEMERT',
    flag: 'NLD',
  },
  {
    id: 'nld-schoonhoven',
    name: 'SCHOONHOVEN',
    flag: 'NLD',
  },
  {
    id: 'nld-rothem',
    name: 'ROTHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-lunetten',
    name: 'LUNETTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-kampen',
    name: 'KAMPEN',
    flag: 'NLD',
  },
  {
    id: 'nld-terneuzen',
    name: 'TERNEUZEN',
    flag: 'NLD',
  },
  {
    id: 'nld-noordhorn',
    name: 'NOORDHORN',
    flag: 'NLD',
  },
  {
    id: 'nld-leeuwen',
    name: 'LEEUWEN',
    flag: 'NLD',
  },
  {
    id: 'nld-arcen',
    name: 'ARCEN',
    flag: 'NLD',
  },
  {
    id: 'nld-bodegraven',
    name: 'BODEGRAVEN',
    flag: 'NLD',
  },
  {
    id: 'nld-zaltbommel',
    name: 'ZALTBOMMEL',
    flag: 'NLD',
  },
  {
    id: 'nld-wemeldinge',
    name: 'WEMELDINGE',
    flag: 'NLD',
  },
  {
    id: "nld-'s-hertogenbosch",
    name: "'S-HERTOGENBOSCH",
    flag: 'NLD',
  },
  {
    id: 'nld-haaften',
    name: 'HAAFTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-aduard',
    name: 'ADUARD',
    flag: 'NLD',
  },
  {
    id: 'nld-buchten',
    name: 'BUCHTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-werkendam',
    name: 'WERKENDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-delden',
    name: 'DELDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-naarden',
    name: 'NAARDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-stampersgat',
    name: 'STAMPERSGAT',
    flag: 'NLD',
  },
  {
    id: 'nld-wergea',
    name: 'WERGEA',
    flag: 'NLD',
  },
  {
    id: 'nld-noardburgum',
    name: 'NOARDBURGUM',
    flag: 'NLD',
  },
  {
    id: 'nld-nieuw-lekkerland',
    name: 'NIEUW-LEKKERLAND',
    flag: 'NLD',
  },
  {
    id: 'nld-oudehaske',
    name: 'OUDEHASKE',
    flag: 'NLD',
  },
  {
    id: 'nld-elburg',
    name: 'ELBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-vroomshoop',
    name: 'VROOMSHOOP',
    flag: 'NLD',
  },
  {
    id: 'nld-oldemarkt',
    name: 'OLDEMARKT',
    flag: 'NLD',
  },
  {
    id: 'nld-budel-dorplein',
    name: 'BUDEL-DORPLEIN',
    flag: 'NLD',
  },
  {
    id: 'nld-wijchen',
    name: 'WIJCHEN',
    flag: 'NLD',
  },
  {
    id: 'nld-vianen',
    name: 'VIANEN',
    flag: 'NLD',
  },
  {
    id: 'nld-nijrees',
    name: 'NIJREES',
    flag: 'NLD',
  },
  {
    id: 'nld-vriezenveen',
    name: 'VRIEZENVEEN',
    flag: 'NLD',
  },
  {
    id: 'nld-nijkerk',
    name: 'NIJKERK',
    flag: 'NLD',
  },
  {
    id: 'nld-gronsveld',
    name: 'GRONSVELD',
    flag: 'NLD',
  },
  {
    id: 'nld-wijdenes',
    name: 'WIJDENES',
    flag: 'NLD',
  },
  {
    id: 'nld-prinsenbeek',
    name: 'PRINSENBEEK',
    flag: 'NLD',
  },
  {
    id: 'nld-scheemda',
    name: 'SCHEEMDA',
    flag: 'NLD',
  },
  {
    id: 'nld-echtenerbrug',
    name: 'ECHTENERBRUG',
    flag: 'NLD',
  },
  {
    id: 'nld-deglip',
    name: 'DE GLIP',
    flag: 'NLD',
  },
  {
    id: 'nld-zwijndrecht',
    name: 'ZWIJNDRECHT',
    flag: 'NLD',
  },
  {
    id: 'nld-merum',
    name: 'MERUM',
    flag: 'NLD',
  },
  {
    id: 'nld-holwerd',
    name: 'HOLWERD',
    flag: 'NLD',
  },
  {
    id: 'nld-nieuw-ensintjoosland',
    name: 'NIEUW- EN SINT JOOSLAND',
    flag: 'NLD',
  },
  {
    id: 'nld-heeswijk-dinther',
    name: 'HEESWIJK-DINTHER',
    flag: 'NLD',
  },
  {
    id: 'nld-serooskerke',
    name: 'SEROOSKERKE',
    flag: 'NLD',
  },
  {
    id: 'nld-oosthuizen',
    name: 'OOSTHUIZEN',
    flag: 'NLD',
  },
  {
    id: 'nld-woudsend',
    name: 'WOUDSEND',
    flag: 'NLD',
  },
  {
    id: 'nld-budschop',
    name: 'BUDSCHOP',
    flag: 'NLD',
  },
  {
    id: 'nld-veendam',
    name: 'VEENDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-hofgeest',
    name: 'HOFGEEST',
    flag: 'NLD',
  },
  {
    id: 'nld-hogemors',
    name: 'HOGE MORS',
    flag: 'NLD',
  },
  {
    id: 'nld-sluiskil',
    name: 'SLUISKIL',
    flag: 'NLD',
  },
  {
    id: 'nld-ooginal',
    name: 'OOG IN AL',
    flag: 'NLD',
  },
  {
    id: 'nld-ridderkerk',
    name: 'RIDDERKERK',
    flag: 'NLD',
  },
  {
    id: 'nld-vreeswijk',
    name: 'VREESWIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-petten',
    name: 'PETTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-nederhemert-noord',
    name: 'NEDERHEMERT-NOORD',
    flag: 'NLD',
  },
  {
    id: 'nld-heerewaarden',
    name: 'HEEREWAARDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-woudrichem',
    name: 'WOUDRICHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-keent',
    name: 'KEENT',
    flag: 'NLD',
  },
  {
    id: 'nld-gorinchem',
    name: 'GORINCHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-nederhemert',
    name: 'NEDERHEMERT',
    flag: 'NLD',
  },
  {
    id: 'nld-koudum',
    name: 'KOUDUM',
    flag: 'NLD',
  },
  {
    id: 'nld-bergstoep',
    name: 'BERGSTOEP',
    flag: 'NLD',
  },
  {
    id: 'nld-hoorn',
    name: 'HOORN',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-201',
    name: 'NLD-201',
    flag: 'NLD',
  },
  {
    id: 'nld-driemond',
    name: 'DRIEMOND',
    flag: 'NLD',
  },
  {
    id: 'nld-waddinxveen',
    name: 'WADDINXVEEN',
    flag: 'NLD',
  },
  {
    id: 'nld-deest',
    name: 'DEEST',
    flag: 'NLD',
  },
  {
    id: 'nld-overasselt',
    name: 'OVERASSELT',
    flag: 'NLD',
  },
  {
    id: 'nld-malta',
    name: 'MALTA',
    flag: 'NLD',
  },
  {
    id: 'nld-lierop',
    name: 'LIEROP',
    flag: 'NLD',
  },
  {
    id: 'nld-beesel',
    name: 'BEESEL',
    flag: 'NLD',
  },
  {
    id: 'nld-blokzijl',
    name: 'BLOKZIJL',
    flag: 'NLD',
  },
  {
    id: 'nld-driel',
    name: 'DRIEL',
    flag: 'NLD',
  },
  {
    id: 'nld-amstelveen',
    name: 'AMSTELVEEN',
    flag: 'NLD',
  },
  {
    id: 'nld-bilgaard',
    name: 'BILGAARD',
    flag: 'NLD',
  },
  {
    id: 'nld-meppel',
    name: 'MEPPEL',
    flag: 'NLD',
  },
  {
    id: 'nld-nieuwegein',
    name: 'NIEUWEGEIN',
    flag: 'NLD',
  },
  {
    id: 'nld-woerden',
    name: 'WOERDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-weesp',
    name: 'WEESP',
    flag: 'NLD',
  },
  {
    id: 'nld-haren',
    name: 'HAREN',
    flag: 'NLD',
  },
  {
    id: 'nld-voorburg',
    name: 'VOORBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-dendungen',
    name: 'DEN DUNGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-middelharnis',
    name: 'MIDDELHARNIS',
    flag: 'NLD',
  },
  {
    id: 'nld-landsmeer',
    name: 'LANDSMEER',
    flag: 'NLD',
  },
  {
    id: 'nld-almelo',
    name: 'ALMELO',
    flag: 'NLD',
  },
  {
    id: 'nld-lochem',
    name: 'LOCHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-slikkerveer',
    name: 'SLIKKERVEER',
    flag: 'NLD',
  },
  {
    id: 'nld-wolder',
    name: 'WOLDER',
    flag: 'NLD',
  },
  {
    id: 'nld-middelburg',
    name: 'MIDDELBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-druten',
    name: 'DRUTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-steenbergen',
    name: 'STEENBERGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-ijmuiden',
    name: 'IJMUIDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-wissenkerke',
    name: 'WISSENKERKE',
    flag: 'NLD',
  },
  {
    id: 'nld-oudewater',
    name: 'OUDEWATER',
    flag: 'NLD',
  },
  {
    id: 'nld-numansdorp',
    name: 'NUMANSDORP',
    flag: 'NLD',
  },
  {
    id: 'nld-capelle-west',
    name: 'CAPELLE-WEST',
    flag: 'NLD',
  },
  {
    id: 'nld-workum',
    name: 'WORKUM',
    flag: 'NLD',
  },
  {
    id: 'nld-goes',
    name: 'GOES',
    flag: 'NLD',
  },
  {
    id: 'nld-schiermonnikoog',
    name: 'SCHIERMONNIKOOG',
    flag: 'NLD',
  },
  {
    id: 'nld-baambrugge',
    name: 'BAAMBRUGGE',
    flag: 'NLD',
  },
  {
    id: 'nld-lent',
    name: 'LENT',
    flag: 'NLD',
  },
  {
    id: 'nld-dedrait',
    name: 'DE DRAIT',
    flag: 'NLD',
  },
  {
    id: 'nld-geertruidenberg',
    name: 'GEERTRUIDENBERG',
    flag: 'NLD',
  },
  {
    id: 'nld-valkenburg',
    name: 'VALKENBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-wageningen',
    name: 'WAGENINGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-oudega',
    name: 'OUDEGA',
    flag: 'NLD',
  },
  {
    id: 'nld-lopik',
    name: 'LOPIK',
    flag: 'NLD',
  },
  {
    id: 'nld-frankhuis',
    name: 'FRANKHUIS',
    flag: 'NLD',
  },
  {
    id: 'nld-megen',
    name: 'MEGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-dronten',
    name: 'DRONTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-tiel',
    name: 'TIEL',
    flag: 'NLD',
  },
  {
    id: 'nld-raamsdonksveer',
    name: 'RAAMSDONKSVEER',
    flag: 'NLD',
  },
  {
    id: 'nld-quirijnstok',
    name: 'QUIRIJNSTOK',
    flag: 'NLD',
  },
  {
    id: 'nld-waspik',
    name: 'WASPIK',
    flag: 'NLD',
  },
  {
    id: 'nld-purmerend',
    name: 'PURMEREND',
    flag: 'NLD',
  },
  {
    id: 'nld-breskens',
    name: 'BRESKENS',
    flag: 'NLD',
  },
  {
    id: 'nld-rhoon',
    name: 'RHOON',
    flag: 'NLD',
  },
  {
    id: 'nld-rozenburg',
    name: 'ROZENBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-roosteren',
    name: 'ROOSTEREN',
    flag: 'NLD',
  },
  {
    id: 'nld-obergum',
    name: 'OBERGUM',
    flag: 'NLD',
  },
  {
    id: 'nld-hansweert',
    name: 'HANSWEERT',
    flag: 'NLD',
  },
  {
    id: 'nld-ammerstol',
    name: 'AMMERSTOL',
    flag: 'NLD',
  },
  {
    id: 'nld-angeren',
    name: 'ANGEREN',
    flag: 'NLD',
  },
  {
    id: 'nld-bloemendaal',
    name: 'BLOEMENDAAL',
    flag: 'NLD',
  },
  {
    id: 'nld-moerdijk',
    name: 'MOERDIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-volendam',
    name: 'VOLENDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-spechtenkamp',
    name: 'SPECHTENKAMP',
    flag: 'NLD',
  },
  {
    id: 'nld-oosterzij',
    name: 'OOSTERZIJ',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-449',
    name: 'NLD-449',
    flag: 'NLD',
  },
  {
    id: 'nld-oirschot',
    name: 'OIRSCHOT',
    flag: 'NLD',
  },
  {
    id: 'nld-oranjewijk',
    name: 'ORANJEWIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-axel',
    name: 'AXEL',
    flag: 'NLD',
  },
  {
    id: 'nld-jirnsum',
    name: 'JIRNSUM',
    flag: 'NLD',
  },
  {
    id: 'nld-vinkeveen',
    name: 'VINKEVEEN',
    flag: 'NLD',
  },
  {
    id: 'nld-joure',
    name: 'JOURE',
    flag: 'NLD',
  },
  {
    id: 'nld-langweer',
    name: 'LANGWEER',
    flag: 'NLD',
  },
  {
    id: 'nld-marken',
    name: 'MARKEN',
    flag: 'NLD',
  },
  {
    id: 'nld-ouderkerkaandenijssel',
    name: 'OUDERKERK AAN DEN IJSSEL',
    flag: 'NLD',
  },
  {
    id: 'nld-zwolle',
    name: 'ZWOLLE',
    flag: 'NLD',
  },
  {
    id: 'nld-stmaarten',
    name: 'ST MAARTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-orthen',
    name: 'ORTHEN',
    flag: 'NLD',
  },
  {
    id: 'nld-kadoelen',
    name: 'KADOELEN',
    flag: 'NLD',
  },
  {
    id: 'nld-vijfhuizen',
    name: 'VIJFHUIZEN',
    flag: 'NLD',
  },
  {
    id: 'nld-noord-hofland',
    name: 'NOORD-HOFLAND',
    flag: 'NLD',
  },
  {
    id: 'nld-depeulen',
    name: 'DE PEULEN',
    flag: 'NLD',
  },
  {
    id: 'nld-beusichem',
    name: 'BEUSICHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-ammerzoden',
    name: 'AMMERZODEN',
    flag: 'NLD',
  },
  {
    id: 'nld-aalsmeer',
    name: 'AALSMEER',
    flag: 'NLD',
  },
  {
    id: 'nld-hoek',
    name: 'HOEK',
    flag: 'NLD',
  },
  {
    id: 'nld-afferden',
    name: 'AFFERDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-merenwijk',
    name: 'MERENWIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-burdaard',
    name: 'BURDAARD',
    flag: 'NLD',
  },
  {
    id: 'nld-krooswijk',
    name: 'KROOSWIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-velsen-noord',
    name: 'VELSEN-NOORD',
    flag: 'NLD',
  },
  {
    id: 'nld-grave',
    name: 'GRAVE',
    flag: 'NLD',
  },
  {
    id: 'nld-amersfoort',
    name: 'AMERSFOORT',
    flag: 'NLD',
  },
  {
    id: 'nld-hoogblokland',
    name: 'HOOGBLOKLAND',
    flag: 'NLD',
  },
  {
    id: 'nld-giessendam',
    name: 'GIESSENDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-boven-hardinxveld',
    name: 'BOVEN-HARDINXVELD',
    flag: 'NLD',
  },
  {
    id: 'nld-loven',
    name: 'LOVEN',
    flag: 'NLD',
  },
  {
    id: 'nld-eemshaven',
    name: 'EEMSHAVEN',
    flag: 'NLD',
  },
  {
    id: 'nld-dongen',
    name: 'DONGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-ingen',
    name: 'INGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-haamstede',
    name: 'HAAMSTEDE',
    flag: 'NLD',
  },
  {
    id: 'nld-neder-hardinxveld',
    name: 'NEDER-HARDINXVELD',
    flag: 'NLD',
  },
  {
    id: 'nld-middenmeer',
    name: 'MIDDENMEER',
    flag: 'NLD',
  },
  {
    id: 'nld-groningen',
    name: 'GRONINGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-westervoort',
    name: 'WESTERVOORT',
    flag: 'NLD',
  },
  {
    id: 'nld-drumpt',
    name: 'DRUMPT',
    flag: 'NLD',
  },
  {
    id: 'nld-boskoop',
    name: 'BOSKOOP',
    flag: 'NLD',
  },
  {
    id: 'nld-vollenhove',
    name: 'VOLLENHOVE',
    flag: 'NLD',
  },
  {
    id: 'nld-vuren',
    name: 'VUREN',
    flag: 'NLD',
  },
  {
    id: 'nld-haarlem',
    name: 'HAARLEM',
    flag: 'NLD',
  },
  {
    id: 'nld-diemen',
    name: 'DIEMEN',
    flag: 'NLD',
  },
  {
    id: 'nld-breukelen',
    name: 'BREUKELEN',
    flag: 'NLD',
  },
  {
    id: 'nld-capelleaandenijssel',
    name: 'CAPELLE AAN DEN IJSSEL',
    flag: 'NLD',
  },
  {
    id: 'nld-edam',
    name: 'EDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-kamperland',
    name: 'KAMPERLAND',
    flag: 'NLD',
  },
  {
    id: 'nld-deil',
    name: 'DEIL',
    flag: 'NLD',
  },
  {
    id: 'nld-grootijsselmonde',
    name: 'GROOT IJSSELMONDE',
    flag: 'NLD',
  },
  {
    id: 'nld-terheijden',
    name: 'TERHEIJDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-zijtaart',
    name: 'ZIJTAART',
    flag: 'NLD',
  },
  {
    id: 'nld-reitdiep',
    name: 'REITDIEP',
    flag: 'NLD',
  },
  {
    id: 'nld-ravenstein',
    name: 'RAVENSTEIN',
    flag: 'NLD',
  },
  {
    id: 'nld-brouwershaven',
    name: 'BROUWERSHAVEN',
    flag: 'NLD',
  },
  {
    id: 'nld-heerjansdam',
    name: 'HEERJANSDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-makkum',
    name: 'MAKKUM',
    flag: 'NLD',
  },
  {
    id: 'nld-someren-eind',
    name: 'SOMEREN-EIND',
    flag: 'NLD',
  },
  {
    id: 'nld-borgele',
    name: 'BORGELE',
    flag: 'NLD',
  },
  {
    id: 'nld-lith',
    name: 'LITH',
    flag: 'NLD',
  },
  {
    id: 'nld-franeker',
    name: 'FRANEKER',
    flag: 'NLD',
  },
  {
    id: 'nld-nieuwpoort',
    name: 'NIEUWPOORT',
    flag: 'NLD',
  },
  {
    id: 'nld-boxmeer',
    name: 'BOXMEER',
    flag: 'NLD',
  },
  {
    id: 'nld-goedereede',
    name: 'GOEDEREEDE',
    flag: 'NLD',
  },
  {
    id: 'nld-lottum',
    name: 'LOTTUM',
    flag: 'NLD',
  },
  {
    id: 'nld-ouderkerkaandeamstel',
    name: 'OUDERKERK AAN DE AMSTEL',
    flag: 'NLD',
  },
  {
    id: 'nld-oosteinde',
    name: 'OOSTEINDE',
    flag: 'NLD',
  },
  {
    id: 'nld-oud-loosdrecht',
    name: 'OUD-LOOSDRECHT',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-420',
    name: 'NLD-420',
    flag: 'NLD',
  },
  {
    id: 'nld-oosterbeek',
    name: 'OOSTERBEEK',
    flag: 'NLD',
  },
  {
    id: 'nld-warmond',
    name: 'WARMOND',
    flag: 'NLD',
  },
  {
    id: 'nld-hippolytushoef',
    name: 'HIPPOLYTUSHOEF',
    flag: 'NLD',
  },
  {
    id: 'nld-arnhem',
    name: 'ARNHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-84',
    name: 'NLD-84',
    flag: 'NLD',
  },
  {
    id: 'nld-muiderberg',
    name: 'MUIDERBERG',
    flag: 'NLD',
  },
  {
    id: 'nld-maasdijk',
    name: 'MAASDIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-winschoten',
    name: 'WINSCHOTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-oost-vlieland',
    name: 'OOST-VLIELAND',
    flag: 'NLD',
  },
  {
    id: 'nld-sliedrecht',
    name: 'SLIEDRECHT',
    flag: 'NLD',
  },
  {
    id: 'nld-bolsward',
    name: 'BOLSWARD',
    flag: 'NLD',
  },
  {
    id: 'nld-heechterp',
    name: 'HEECHTERP',
    flag: 'NLD',
  },
  {
    id: 'nld-molenhoek',
    name: 'MOLENHOEK',
    flag: 'NLD',
  },
  {
    id: 'nld-leerdam',
    name: 'LEERDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-gouwsluis',
    name: 'GOUWSLUIS',
    flag: 'NLD',
  },
  {
    id: 'nld-nieuw-beijerland',
    name: 'NIEUW-BEIJERLAND',
    flag: 'NLD',
  },
  {
    id: 'nld-woubrugge',
    name: 'WOUBRUGGE',
    flag: 'NLD',
  },
  {
    id: 'nld-roelofarendsveen',
    name: 'ROELOFARENDSVEEN',
    flag: 'NLD',
  },
  {
    id: 'nld-heeg',
    name: 'HEEG',
    flag: 'NLD',
  },
  {
    id: 'nld-dereit',
    name: 'DE REIT',
    flag: 'NLD',
  },
  {
    id: 'nld-overschie',
    name: 'OVERSCHIE',
    flag: 'NLD',
  },
  {
    id: 'nld-pannerden',
    name: 'PANNERDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-hoogland',
    name: 'HOOGLAND',
    flag: 'NLD',
  },
  {
    id: 'nld-haastrecht',
    name: 'HAASTRECHT',
    flag: 'NLD',
  },
  {
    id: 'nld-born',
    name: 'BORN',
    flag: 'NLD',
  },
  {
    id: 'nld-heemstede',
    name: 'HEEMSTEDE',
    flag: 'NLD',
  },
  {
    id: 'nld-lienden',
    name: 'LIENDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-derompert',
    name: 'DE ROMPERT',
    flag: 'NLD',
  },
  {
    id: 'nld-doornsteeg',
    name: 'DOORNSTEEG',
    flag: 'NLD',
  },
  {
    id: 'nld-medemblik',
    name: 'MEDEMBLIK',
    flag: 'NLD',
  },
  {
    id: 'nld-lelystad',
    name: 'LELYSTAD',
    flag: 'NLD',
  },
  {
    id: 'nld-aalburg',
    name: 'AALBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-papendrecht',
    name: 'PAPENDRECHT',
    flag: 'NLD',
  },
  {
    id: 'nld-dedomp',
    name: 'DE DOMP',
    flag: 'NLD',
  },
  {
    id: 'nld-derijp',
    name: 'DE RIJP',
    flag: 'NLD',
  },
  {
    id: 'nld-nederweert',
    name: 'NEDERWEERT',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-123',
    name: 'NLD-123',
    flag: 'NLD',
  },
  {
    id: 'nld-deventer',
    name: 'DEVENTER',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-393',
    name: 'NLD-393',
    flag: 'NLD',
  },
  {
    id: 'nld-marsum',
    name: 'MARSUM',
    flag: 'NLD',
  },
  {
    id: 'nld-arkel',
    name: 'ARKEL',
    flag: 'NLD',
  },
  {
    id: 'nld-papenveer',
    name: 'PAPENVEER',
    flag: 'NLD',
  },
  {
    id: 'nld-veen',
    name: 'VEEN',
    flag: 'NLD',
  },
  {
    id: 'nld-doornenburg',
    name: 'DOORNENBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-klundert',
    name: 'KLUNDERT',
    flag: 'NLD',
  },
  {
    id: 'nld-aldlan-oost',
    name: 'ALDLAN-OOST',
    flag: 'NLD',
  },
  {
    id: 'nld-dauwendaele',
    name: 'DAUWENDAELE',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-452',
    name: 'NLD-452',
    flag: 'NLD',
  },
  {
    id: 'nld-hees',
    name: 'HEES',
    flag: 'NLD',
  },
  {
    id: 'nld-ooij',
    name: 'OOIJ',
    flag: 'NLD',
  },
  {
    id: 'nld-west-terschelling',
    name: 'WEST-TERSCHELLING',
    flag: 'NLD',
  },
  {
    id: 'nld-urk',
    name: 'URK',
    flag: 'NLD',
  },
  {
    id: 'nld-brunnepe',
    name: 'BRUNNEPE',
    flag: 'NLD',
  },
  {
    id: 'nld-dokkum',
    name: 'DOKKUM',
    flag: 'NLD',
  },
  {
    id: 'nld-breezand',
    name: 'BREEZAND',
    flag: 'NLD',
  },
  {
    id: 'nld-leiderdorp',
    name: 'LEIDERDORP',
    flag: 'NLD',
  },
  {
    id: 'nld-doesburg',
    name: 'DOESBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-bemmel',
    name: 'BEMMEL',
    flag: 'NLD',
  },
  {
    id: 'nld-kudelstaart',
    name: 'KUDELSTAART',
    flag: 'NLD',
  },
  {
    id: 'nld-heugem',
    name: 'HEUGEM',
    flag: 'NLD',
  },
  {
    id: 'nld-maarssen',
    name: 'MAARSSEN',
    flag: 'NLD',
  },
  {
    id: 'nld-schagerbrug',
    name: 'SCHAGERBRUG',
    flag: 'NLD',
  },
  {
    id: 'nld-tricht',
    name: 'TRICHT',
    flag: 'NLD',
  },
  {
    id: 'nld-westeinde',
    name: 'WESTEINDE',
    flag: 'NLD',
  },
  {
    id: 'nld-beek',
    name: 'BEEK',
    flag: 'NLD',
  },
  {
    id: 'nld-son',
    name: 'SON',
    flag: 'NLD',
  },
  {
    id: 'nld-dewijert',
    name: 'DE WIJERT',
    flag: 'NLD',
  },
  {
    id: 'nld-borssele',
    name: 'BORSSELE',
    flag: 'NLD',
  },
  {
    id: 'nld-heusden',
    name: 'HEUSDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-reuver',
    name: 'REUVER',
    flag: 'NLD',
  },
  {
    id: 'nld-lisserbroek',
    name: 'LISSERBROEK',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-286',
    name: 'NLD-286',
    flag: 'NLD',
  },
  {
    id: 'nld-almkerk',
    name: 'ALMKERK',
    flag: 'NLD',
  },
  {
    id: 'nld-maastricht',
    name: 'MAASTRICHT',
    flag: 'NLD',
  },
  {
    id: 'nld-sintjansklooster',
    name: 'SINT JANSKLOOSTER',
    flag: 'NLD',
  },
  {
    id: 'nld-broekoplangedijk',
    name: 'BROEK OP LANGEDIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-hendrik-ido-ambacht',
    name: 'HENDRIK-IDO-AMBACHT',
    flag: 'NLD',
  },
  {
    id: 'nld-sassenheim',
    name: 'SASSENHEIM',
    flag: 'NLD',
  },
  {
    id: 'nld-nijmegen',
    name: 'NIJMEGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-oud-beijerland',
    name: 'OUD-BEIJERLAND',
    flag: 'NLD',
  },
  {
    id: 'nld-bangert',
    name: 'BANGERT',
    flag: 'NLD',
  },
  {
    id: 'nld-schiedam',
    name: 'SCHIEDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-limmel',
    name: 'LIMMEL',
    flag: 'NLD',
  },
  {
    id: 'nld-zuiderburen',
    name: 'ZUIDERBUREN',
    flag: 'NLD',
  },
  {
    id: 'nld-oppenhuizen',
    name: 'OPPENHUIZEN',
    flag: 'NLD',
  },
  {
    id: 'nld-aalst',
    name: 'AALST',
    flag: 'NLD',
  },
  {
    id: 'nld-heteren',
    name: 'HETEREN',
    flag: 'NLD',
  },
  {
    id: 'nld-rheden',
    name: 'RHEDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-utrecht',
    name: 'UTRECHT',
    flag: 'NLD',
  },
  {
    id: 'nld-hedel',
    name: 'HEDEL',
    flag: 'NLD',
  },
  {
    id: 'nld-flevowijk',
    name: 'FLEVOWIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-wessem',
    name: 'WESSEM',
    flag: 'NLD',
  },
  {
    id: 'nld-diessen',
    name: 'DIESSEN',
    flag: 'NLD',
  },
  {
    id: 'nld-giessen',
    name: 'GIESSEN',
    flag: 'NLD',
  },
  {
    id: 'nld-sappemeer',
    name: 'SAPPEMEER',
    flag: 'NLD',
  },
  {
    id: 'nld-linne',
    name: 'LINNE',
    flag: 'NLD',
  },
  {
    id: 'nld-hengelo',
    name: 'HENGELO',
    flag: 'NLD',
  },
  {
    id: 'nld-coevorden',
    name: 'COEVORDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-andelst',
    name: 'ANDELST',
    flag: 'NLD',
  },
  {
    id: 'nld-zuidbroek',
    name: 'ZUIDBROEK',
    flag: 'NLD',
  },
  {
    id: 'nld-nes',
    name: 'NES',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-412',
    name: 'NLD-412',
    flag: 'NLD',
  },
  {
    id: 'nld-gennep',
    name: 'GENNEP',
    flag: 'NLD',
  },
  {
    id: 'nld-zutphen',
    name: 'ZUTPHEN',
    flag: 'NLD',
  },
  {
    id: 'nld-eerde',
    name: 'EERDE',
    flag: 'NLD',
  },
  {
    id: 'nld-nld-318',
    name: 'NLD-318',
    flag: 'NLD',
  },
  {
    id: 'nld-schagen',
    name: 'SCHAGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-leuth',
    name: 'LEUTH',
    flag: 'NLD',
  },
  {
    id: 'nld-eefde',
    name: 'EEFDE',
    flag: 'NLD',
  },
  {
    id: 'nld-belcrum',
    name: 'BELCRUM',
    flag: 'NLD',
  },
  {
    id: 'nld-essesteijn',
    name: 'ESSESTEIJN',
    flag: 'NLD',
  },
  {
    id: 'nld-eastermar',
    name: 'EASTERMAR',
    flag: 'NLD',
  },
  {
    id: 'nld-kalsdonk',
    name: 'KALSDONK',
    flag: 'NLD',
  },
  {
    id: 'nor-skalevik',
    name: 'SKALEVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-skudeneshavn',
    name: 'SKUDENESHAVN',
    flag: 'NOR',
  },
  {
    id: 'nor-rosendal',
    name: 'ROSENDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-batsfjorden',
    name: 'BATSFJORDEN',
    flag: 'NOR',
  },
  {
    id: 'nor-larvik',
    name: 'LARVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-egersund',
    name: 'EGERSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-skogn',
    name: 'SKOGN',
    flag: 'NOR',
  },
  {
    id: 'nor-laerdalsoyri',
    name: 'LAERDALSOYRI',
    flag: 'NOR',
  },
  {
    id: 'nor-leknes',
    name: 'LEKNES',
    flag: 'NOR',
  },
  {
    id: 'nor-sjolyststranda',
    name: 'SJOLYSTSTRANDA',
    flag: 'NOR',
  },
  {
    id: 'nor-askoy',
    name: 'ASKOY',
    flag: 'NOR',
  },
  {
    id: 'nor-engalsvik',
    name: 'ENGALSVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-743',
    name: 'NOR-743',
    flag: 'NOR',
  },
  {
    id: 'nor-hammerfest',
    name: 'HAMMERFEST',
    flag: 'NOR',
  },
  {
    id: 'nor-borgheim',
    name: 'BORGHEIM',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-211',
    name: 'NOR-211',
    flag: 'NOR',
  },
  {
    id: 'nor-saeboe',
    name: 'SAEBOE',
    flag: 'NOR',
  },
  {
    id: 'nor-forsand',
    name: 'FORSAND',
    flag: 'NOR',
  },
  {
    id: 'nor-olderdalen',
    name: 'OLDERDALEN',
    flag: 'NOR',
  },
  {
    id: 'nor-glomfjord',
    name: 'GLOMFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-bruhagen',
    name: 'BRUHAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-vikoyri',
    name: 'VIKOYRI',
    flag: 'NOR',
  },
  {
    id: 'nor-kolbotn',
    name: 'KOLBOTN',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-139',
    name: 'NOR-139',
    flag: 'NOR',
  },
  {
    id: 'nor-maloy',
    name: 'MALOY',
    flag: 'NOR',
  },
  {
    id: 'nor-kvalsund',
    name: 'KVALSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-brekstad',
    name: 'BREKSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-tvedestrand',
    name: 'TVEDESTRAND',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-226',
    name: 'NOR-226',
    flag: 'NOR',
  },
  {
    id: 'nor-mongstad',
    name: 'MONGSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-720',
    name: 'NOR-720',
    flag: 'NOR',
  },
  {
    id: 'nor-kolvereid',
    name: 'KOLVEREID',
    flag: 'NOR',
  },
  {
    id: 'nor-fagerstrand',
    name: 'FAGERSTRAND',
    flag: 'NOR',
  },
  {
    id: 'nor-nesset',
    name: 'NESSET',
    flag: 'NOR',
  },
  {
    id: 'nor-oksfjord',
    name: 'OKSFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-halden',
    name: 'HALDEN',
    flag: 'NOR',
  },
  {
    id: 'nor-meling',
    name: 'MELING',
    flag: 'NOR',
  },
  {
    id: 'nor-hjelset',
    name: 'HJELSET',
    flag: 'NOR',
  },
  {
    id: 'nor-saetre',
    name: 'SAETRE',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-513',
    name: 'NOR-513',
    flag: 'NOR',
  },
  {
    id: 'nor-elnesvagen',
    name: 'ELNESVAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-avanuorri',
    name: 'AVANUORRI',
    flag: 'NOR',
  },
  {
    id: 'nor-moldtustranda',
    name: 'MOLDTUSTRANDA',
    flag: 'NOR',
  },
  {
    id: 'nor-evjen',
    name: 'EVJEN',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-1014',
    name: 'NOR-1014',
    flag: 'NOR',
  },
  {
    id: 'nor-sorvaer',
    name: 'SORVAER',
    flag: 'NOR',
  },
  {
    id: 'nor-selvik',
    name: 'SELVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-askvoll',
    name: 'ASKVOLL',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-172',
    name: 'NOR-172',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-288',
    name: 'NOR-288',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-361',
    name: 'NOR-361',
    flag: 'NOR',
  },
  {
    id: 'nor-finnsnes',
    name: 'FINNSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-kristiansand',
    name: 'KRISTIANSAND',
    flag: 'NOR',
  },
  {
    id: 'nor-risor',
    name: 'RISOR',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-730',
    name: 'NOR-730',
    flag: 'NOR',
  },
  {
    id: 'nor-tjotta',
    name: 'TJOTTA',
    flag: 'NOR',
  },
  {
    id: 'nor-muruvik',
    name: 'MURUVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-osoyro',
    name: 'OSOYRO',
    flag: 'NOR',
  },
  {
    id: 'nor-drammen',
    name: 'DRAMMEN',
    flag: 'NOR',
  },
  {
    id: 'nor-levanger',
    name: 'LEVANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-haugesund',
    name: 'HAUGESUND',
    flag: 'NOR',
  },
  {
    id: 'nor-lodingen',
    name: 'LODINGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-166',
    name: 'NOR-166',
    flag: 'NOR',
  },
  {
    id: 'nor-nerdvika',
    name: 'NERDVIKA',
    flag: 'NOR',
  },
  {
    id: 'nor-sauda',
    name: 'SAUDA',
    flag: 'NOR',
  },
  {
    id: 'nor-hoyanger',
    name: 'HOYANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-kleppesto',
    name: 'KLEPPESTO',
    flag: 'NOR',
  },
  {
    id: 'nor-fredrikstad',
    name: 'FREDRIKSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-tofte',
    name: 'TOFTE',
    flag: 'NOR',
  },
  {
    id: 'nor-svolvaer',
    name: 'SVOLVAER',
    flag: 'NOR',
  },
  {
    id: 'nor-hamnes',
    name: 'HAMNES',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-914',
    name: 'NOR-914',
    flag: 'NOR',
  },
  {
    id: 'nor-mosjoen',
    name: 'MOSJOEN',
    flag: 'NOR',
  },
  {
    id: 'nor-stavanger',
    name: 'STAVANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-langesund',
    name: 'LANGESUND',
    flag: 'NOR',
  },
  {
    id: 'nor-liaboen',
    name: 'LIABOEN',
    flag: 'NOR',
  },
  {
    id: 'nor-trysnes',
    name: 'TRYSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-oslo',
    name: 'OSLO',
    flag: 'NOR',
  },
  {
    id: 'nor-sovik',
    name: 'SOVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-256',
    name: 'NOR-256',
    flag: 'NOR',
  },
  {
    id: 'nor-stavern',
    name: 'STAVERN',
    flag: 'NOR',
  },
  {
    id: 'nor-tonsberg',
    name: 'TONSBERG',
    flag: 'NOR',
  },
  {
    id: 'nor-kopervik',
    name: 'KOPERVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-midsund',
    name: 'MIDSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-sandefjorden',
    name: 'SANDEFJORDEN',
    flag: 'NOR',
  },
  {
    id: 'nor-hommelvik',
    name: 'HOMMELVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-korsnes',
    name: 'KORSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-lakselv',
    name: 'LAKSELV',
    flag: 'NOR',
  },
  {
    id: 'nor-sirevag',
    name: 'SIREVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-rissa',
    name: 'RISSA',
    flag: 'NOR',
  },
  {
    id: 'nor-ydstebohamn',
    name: 'YDSTEBOHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-234',
    name: 'NOR-234',
    flag: 'NOR',
  },
  {
    id: 'nor-storsteilene',
    name: 'STORSTEILENE',
    flag: 'NOR',
  },
  {
    id: 'nor-molde',
    name: 'MOLDE',
    flag: 'NOR',
  },
  {
    id: 'nor-melbu',
    name: 'MELBU',
    flag: 'NOR',
  },
  {
    id: 'nor-abelnes',
    name: 'ABELNES',
    flag: 'NOR',
  },
  {
    id: 'nor-thamshamm',
    name: 'THAMSHAMM',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-438',
    name: 'NOR-438',
    flag: 'NOR',
  },
  {
    id: 'nor-sandnessjoen',
    name: 'SANDNESSJOEN',
    flag: 'NOR',
  },
  {
    id: 'nor-botnhamnfarm',
    name: 'BOTNHAMN FARM',
    flag: 'NOR',
  },
  {
    id: 'nor-kvenvaer',
    name: 'KVENVAER',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-554',
    name: 'NOR-554',
    flag: 'NOR',
  },
  {
    id: 'nor-drobak',
    name: 'DROBAK',
    flag: 'NOR',
  },
  {
    id: 'nor-kirkenes',
    name: 'KIRKENES',
    flag: 'NOR',
  },
  {
    id: 'nor-ytrebygda',
    name: 'YTREBYGDA',
    flag: 'NOR',
  },
  {
    id: 'nor-lillesand',
    name: 'LILLESAND',
    flag: 'NOR',
  },
  {
    id: 'nor-nesna',
    name: 'NESNA',
    flag: 'NOR',
  },
  {
    id: 'nor-sistranda',
    name: 'SISTRANDA',
    flag: 'NOR',
  },
  {
    id: 'nor-rognan',
    name: 'ROGNAN',
    flag: 'NOR',
  },
  {
    id: 'nor-hopen',
    name: 'HOPEN',
    flag: 'NOR',
  },
  {
    id: 'nor-andenes',
    name: 'ANDENES',
    flag: 'NOR',
  },
  {
    id: 'nor-fauske',
    name: 'FAUSKE',
    flag: 'NOR',
  },
  {
    id: 'nor-tufjord',
    name: 'TUFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-foresvik',
    name: 'FORESVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-skjervoy',
    name: 'SKJERVOY',
    flag: 'NOR',
  },
  {
    id: 'nor-honningsvag',
    name: 'HONNINGSVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-vaksdal',
    name: 'VAKSDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-vagaholmen',
    name: 'VAGAHOLMEN',
    flag: 'NOR',
  },
  {
    id: 'nor-hardbakke',
    name: 'HARDBAKKE',
    flag: 'NOR',
  },
  {
    id: 'nor-vevelstad',
    name: 'VEVELSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-836',
    name: 'NOR-836',
    flag: 'NOR',
  },
  {
    id: 'nor-fillan',
    name: 'FILLAN',
    flag: 'NOR',
  },
  {
    id: 'nor-brevik',
    name: 'BREVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-vardo',
    name: 'VARDO',
    flag: 'NOR',
  },
  {
    id: 'nor-gravdal',
    name: 'GRAVDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-stranda',
    name: 'STRANDA',
    flag: 'NOR',
  },
  {
    id: 'nor-aros',
    name: 'AROS',
    flag: 'NOR',
  },
  {
    id: 'nor-kamoyvaer',
    name: 'KAMOYVAER',
    flag: 'NOR',
  },
  {
    id: 'nor-vannvag',
    name: 'VANNVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-skrovahavn',
    name: 'SKROVA HAVN',
    flag: 'NOR',
  },
  {
    id: 'nor-narvik',
    name: 'NARVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-alesund',
    name: 'ALESUND',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-215',
    name: 'NOR-215',
    flag: 'NOR',
  },
  {
    id: 'nor-utgard',
    name: 'UTGARD',
    flag: 'NOR',
  },
  {
    id: 'nor-kristiansund',
    name: 'KRISTIANSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-mehamn',
    name: 'MEHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-svanem',
    name: 'SVANEM',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-100',
    name: 'NOR-100',
    flag: 'NOR',
  },
  {
    id: 'nor-steinsdalen',
    name: 'STEINSDALEN',
    flag: 'NOR',
  },
  {
    id: 'nor-sarpsborg',
    name: 'SARPSBORG',
    flag: 'NOR',
  },
  {
    id: 'nor-tromso',
    name: 'TROMSO',
    flag: 'NOR',
  },
  {
    id: 'nor-farsund',
    name: 'FARSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-billingstad',
    name: 'BILLINGSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-619',
    name: 'NOR-619',
    flag: 'NOR',
  },
  {
    id: 'nor-eivindvik',
    name: 'EIVINDVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-380',
    name: 'NOR-380',
    flag: 'NOR',
  },
  {
    id: 'nor-skutvik',
    name: 'SKUTVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-seter',
    name: 'SETER',
    flag: 'NOR',
  },
  {
    id: 'nor-brattholmen',
    name: 'BRATTHOLMEN',
    flag: 'NOR',
  },
  {
    id: 'nor-ormenlange',
    name: 'ORMEN LANGE',
    flag: 'NOR',
  },
  {
    id: 'nor-storebo',
    name: 'STOREBO',
    flag: 'NOR',
  },
  {
    id: 'nor-tjeldsto',
    name: 'TJELDSTO',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-766',
    name: 'NOR-766',
    flag: 'NOR',
  },
  {
    id: 'nor-berg',
    name: 'BERG',
    flag: 'NOR',
  },
  {
    id: 'nor-tomra',
    name: 'TOMRA',
    flag: 'NOR',
  },
  {
    id: 'nor-vadso',
    name: 'VADSO',
    flag: 'NOR',
  },
  {
    id: 'nor-sunndalsora',
    name: 'SUNNDALSORA',
    flag: 'NOR',
  },
  {
    id: 'nor-leirvik',
    name: 'LEIRVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-hareid',
    name: 'HAREID',
    flag: 'NOR',
  },
  {
    id: 'nor-straume',
    name: 'STRAUME',
    flag: 'NOR',
  },
  {
    id: 'nor-flekkefjorden',
    name: 'FLEKKEFJORDEN',
    flag: 'NOR',
  },
  {
    id: 'nor-orstav',
    name: 'ORSTAV',
    flag: 'NOR',
  },
  {
    id: 'nor-manger',
    name: 'MANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-bud',
    name: 'BUD',
    flag: 'NOR',
  },
  {
    id: 'nor-luroy',
    name: 'LUROY',
    flag: 'NOR',
  },
  {
    id: 'nor-rorvik',
    name: 'RORVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-judaberg',
    name: 'JUDABERG',
    flag: 'NOR',
  },
  {
    id: 'nor-alta',
    name: 'ALTA',
    flag: 'NOR',
  },
  {
    id: 'nor-hindaravag',
    name: 'HINDARAVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-840',
    name: 'NOR-840',
    flag: 'NOR',
  },
  {
    id: 'nor-tananger',
    name: 'TANANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-ballstad',
    name: 'BALLSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-andalsnes',
    name: 'ANDALSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-aiafjord',
    name: 'A I AFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-lyngseidet',
    name: 'LYNGSEIDET',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-1011',
    name: 'NOR-1011',
    flag: 'NOR',
  },
  {
    id: 'nor-sorreisa',
    name: 'SORREISA',
    flag: 'NOR',
  },
  {
    id: 'nor-ornes',
    name: 'ORNES',
    flag: 'NOR',
  },
  {
    id: 'nor-rypefjord',
    name: 'RYPEFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-sand',
    name: 'SAND',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-567',
    name: 'NOR-567',
    flag: 'NOR',
  },
  {
    id: 'nor-inner-vikna',
    name: 'INNER-VIKNA',
    flag: 'NOR',
  },
  {
    id: 'nor-rekefjord',
    name: 'REKEFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-882',
    name: 'NOR-882',
    flag: 'NOR',
  },
  {
    id: 'nor-jondal',
    name: 'JONDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-harstad',
    name: 'HARSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-valldal',
    name: 'VALLDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-berlevag',
    name: 'BERLEVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-tranoy',
    name: 'TRANOY',
    flag: 'NOR',
  },
  {
    id: 'nor-hemnesberget',
    name: 'HEMNESBERGET',
    flag: 'NOR',
  },
  {
    id: 'nor-svelgen',
    name: 'SVELGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-lyngdal',
    name: 'LYNGDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-falkhytta',
    name: 'FALKHYTTA',
    flag: 'NOR',
  },
  {
    id: 'nor-sagvag',
    name: 'SAGVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-931',
    name: 'NOR-931',
    flag: 'NOR',
  },
  {
    id: 'nor-brettesnes',
    name: 'BRETTESNES',
    flag: 'NOR',
  },
  {
    id: 'nor-odda',
    name: 'ODDA',
    flag: 'NOR',
  },
  {
    id: 'nor-vartdal',
    name: 'VARTDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-sogndal',
    name: 'SOGNDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-naersnes',
    name: 'NAERSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-stokkmarknes',
    name: 'STOKKMARKNES',
    flag: 'NOR',
  },
  {
    id: 'nor-kjopsvik',
    name: 'KJOPSVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-karsto',
    name: 'KARSTO',
    flag: 'NOR',
  },
  {
    id: 'nor-jorpeland',
    name: 'JORPELAND',
    flag: 'NOR',
  },
  {
    id: 'nor-kjollefjorden',
    name: 'KJOLLEFJORDEN',
    flag: 'NOR',
  },
  {
    id: 'nor-floro',
    name: 'FLORO',
    flag: 'NOR',
  },
  {
    id: 'nor-horten',
    name: 'HORTEN',
    flag: 'NOR',
  },
  {
    id: 'nor-berger',
    name: 'BERGER',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-906',
    name: 'NOR-906',
    flag: 'NOR',
  },
  {
    id: 'nor-sandvika',
    name: 'SANDVIKA',
    flag: 'NOR',
  },
  {
    id: 'nor-ardalstangen',
    name: 'ARDALSTANGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-bodo',
    name: 'BODO',
    flag: 'NOR',
  },
  {
    id: 'nor-kragero',
    name: 'KRAGERO',
    flag: 'NOR',
  },
  {
    id: 'nor-alsvag',
    name: 'ALSVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-solfjellsjoen',
    name: 'SOLFJELLSJOEN',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-275',
    name: 'NOR-275',
    flag: 'NOR',
  },
  {
    id: 'nor-skien',
    name: 'SKIEN',
    flag: 'NOR',
  },
  {
    id: 'nor-slagenstangen',
    name: 'SLAGENSTANGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-bronnoysund',
    name: 'BRONNOYSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-bleik',
    name: 'BLEIK',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-462',
    name: 'NOR-462',
    flag: 'NOR',
  },
  {
    id: 'nor-rost',
    name: 'ROST',
    flag: 'NOR',
  },
  {
    id: 'nor-eikelandsosen',
    name: 'EIKELANDSOSEN',
    flag: 'NOR',
  },
  {
    id: 'nor-gibostad',
    name: 'GIBOSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-moinlet',
    name: 'MO INLET',
    flag: 'NOR',
  },
  {
    id: 'nor-trondheim',
    name: 'TRONDHEIM',
    flag: 'NOR',
  },
  {
    id: 'nor-stamsund',
    name: 'STAMSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-rensvik',
    name: 'RENSVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-borsa',
    name: 'BORSA',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-770',
    name: 'NOR-770',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-748',
    name: 'NOR-748',
    flag: 'NOR',
  },
  {
    id: 'nor-arendal',
    name: 'ARENDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-breivikbotn',
    name: 'BREIVIKBOTN',
    flag: 'NOR',
  },
  {
    id: 'nor-fosnavag',
    name: 'FOSNAVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-larkollen',
    name: 'LARKOLLEN',
    flag: 'NOR',
  },
  {
    id: 'nor-fitjar',
    name: 'FITJAR',
    flag: 'NOR',
  },
  {
    id: 'nor-myre',
    name: 'MYRE',
    flag: 'NOR',
  },
  {
    id: 'nor-vestbygd',
    name: 'VESTBYGD',
    flag: 'NOR',
  },
  {
    id: 'nor-finnkroken',
    name: 'FINNKROKEN',
    flag: 'NOR',
  },
  {
    id: 'nor-sogne',
    name: 'SOGNE',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-345',
    name: 'NOR-345',
    flag: 'NOR',
  },
  {
    id: 'nor-silvalen',
    name: 'SILVALEN',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-783',
    name: 'NOR-783',
    flag: 'NOR',
  },
  {
    id: 'nor-kjerringoy',
    name: 'KJERRINGOY',
    flag: 'NOR',
  },
  {
    id: 'nor-mandal',
    name: 'MANDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-porsgrunn',
    name: 'PORSGRUNN',
    flag: 'NOR',
  },
  {
    id: 'nor-hjelmelandsvagen',
    name: 'HJELMELANDSVAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-skogsvagen',
    name: 'SKOGSVAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-loding',
    name: 'LODING',
    flag: 'NOR',
  },
  {
    id: 'nor-randaberg',
    name: 'RANDABERG',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-623',
    name: 'NOR-623',
    flag: 'NOR',
  },
  {
    id: 'nor-sandnes',
    name: 'SANDNES',
    flag: 'NOR',
  },
  {
    id: 'nor-husoya',
    name: 'HUSOYA',
    flag: 'NOR',
  },
  {
    id: 'nor-etne',
    name: 'ETNE',
    flag: 'NOR',
  },
  {
    id: 'nor-gryllefjord',
    name: 'GRYLLEFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-botngard',
    name: 'BOTNGARD',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-755',
    name: 'NOR-755',
    flag: 'NOR',
  },
  {
    id: 'nor-inndyr',
    name: 'INNDYR',
    flag: 'NOR',
  },
  {
    id: 'nor-norheimsund',
    name: 'NORHEIMSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-storfosna',
    name: 'STORFOSNA',
    flag: 'NOR',
  },
  {
    id: 'nor-henningsvaer',
    name: 'HENNINGSVAER',
    flag: 'NOR',
  },
  {
    id: 'nor-grimstad',
    name: 'GRIMSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-427',
    name: 'NOR-427',
    flag: 'NOR',
  },
  {
    id: 'nor-sortland',
    name: 'SORTLAND',
    flag: 'NOR',
  },
  {
    id: 'nor-uggdal',
    name: 'UGGDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-hommersak',
    name: 'HOMMERSAK',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-996',
    name: 'NOR-996',
    flag: 'NOR',
  },
  {
    id: 'nor-bergen',
    name: 'BERGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-kirkehamn',
    name: 'KIRKEHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-vormedal',
    name: 'VORMEDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-lysaker',
    name: 'LYSAKER',
    flag: 'NOR',
  },
  {
    id: 'nor-tjome',
    name: 'TJOME',
    flag: 'NOR',
  },
  {
    id: 'nor-vedavagen',
    name: 'VEDAVAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-larsnes',
    name: 'LARSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-vikevag',
    name: 'VIKEVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-bugoynes',
    name: 'BUGOYNES',
    flag: 'NOR',
  },
  {
    id: 'nor-lauvsnes',
    name: 'LAUVSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-stura',
    name: 'STURA',
    flag: 'NOR',
  },
  {
    id: 'nor-gladstad',
    name: 'GLADSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-tangvall',
    name: 'TANGVALL',
    flag: 'NOR',
  },
  {
    id: 'nor-olen',
    name: 'OLEN',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-208',
    name: 'NOR-208',
    flag: 'NOR',
  },
  {
    id: 'nor-kabelvag',
    name: 'KABELVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-hansnes',
    name: 'HANSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-austrheim',
    name: 'AUSTRHEIM',
    flag: 'NOR',
  },
  {
    id: 'nor-medby',
    name: 'MEDBY',
    flag: 'NOR',
  },
  {
    id: 'nor-fiska',
    name: 'FISKA',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-844',
    name: 'NOR-844',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-918',
    name: 'NOR-918',
    flag: 'NOR',
  },
  {
    id: 'nor-mosterhamn',
    name: 'MOSTERHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-tau',
    name: 'TAU',
    flag: 'NOR',
  },
  {
    id: 'nor-hagavik',
    name: 'HAGAVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-burfjord',
    name: 'BURFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-sorland',
    name: 'SORLAND',
    flag: 'NOR',
  },
  {
    id: 'nor-asgardstrand',
    name: 'ASGARDSTRAND',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-620',
    name: 'NOR-620',
    flag: 'NOR',
  },
  {
    id: 'nor-vestnes',
    name: 'VESTNES',
    flag: 'NOR',
  },
  {
    id: 'nor-hamnvik',
    name: 'HAMNVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-holmestrand',
    name: 'HOLMESTRAND',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-749',
    name: 'NOR-749',
    flag: 'NOR',
  },
  {
    id: 'nor-valderoy',
    name: 'VALDEROY',
    flag: 'NOR',
  },
  {
    id: 'nor-valloy',
    name: 'VALLOY',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-416',
    name: 'NOR-416',
    flag: 'NOR',
  },
  {
    id: 'nor-skodje',
    name: 'SKODJE',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-624',
    name: 'NOR-624',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-610',
    name: 'NOR-610',
    flag: 'NOR',
  },
  {
    id: 'nor-reine',
    name: 'REINE',
    flag: 'NOR',
  },
  {
    id: 'nor-volda',
    name: 'VOLDA',
    flag: 'NOR',
  },
  {
    id: 'nor-aurdal',
    name: 'AURDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-moss',
    name: 'MOSS',
    flag: 'NOR',
  },
  {
    id: 'nor-steinshamn',
    name: 'STEINSHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-agotnes',
    name: 'AGOTNES',
    flag: 'NOR',
  },
  {
    id: 'nor-drag',
    name: 'DRAG',
    flag: 'NOR',
  },
  {
    id: 'nor-djupviken',
    name: 'DJUPVIKEN',
    flag: 'NOR',
  },
  {
    id: 'nor-aroysund',
    name: 'AROYSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-ulsteinvik',
    name: 'ULSTEINVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-kambo',
    name: 'KAMBO',
    flag: 'NOR',
  },
  {
    id: 'nor-skjaerhalden',
    name: 'SKJAERHALDEN',
    flag: 'NOR',
  },
  {
    id: 'nor-akrahamn',
    name: 'AKRAHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-husnes',
    name: 'HUSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-sykkylven',
    name: 'SYKKYLVEN',
    flag: 'NOR',
  },
  {
    id: 'nor-tranneset',
    name: 'TRANNESET',
    flag: 'NOR',
  },
  {
    id: 'nor-blakstad',
    name: 'BLAKSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-svelvik',
    name: 'SVELVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-mefjordver',
    name: 'MEFJORDVER',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-909',
    name: 'NOR-909',
    flag: 'NOR',
  },
  {
    id: 'nor-steinkjer',
    name: 'STEINKJER',
    flag: 'NOR',
  },
  {
    id: 'nor-brattvag',
    name: 'BRATTVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-herre',
    name: 'HERRE',
    flag: 'NOR',
  },
  {
    id: 'nor-roan',
    name: 'ROAN',
    flag: 'NOR',
  },
  {
    id: 'nor-stusvik',
    name: 'STUSVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-91',
    name: 'NOR-91',
    flag: 'NOR',
  },
  {
    id: 'nor-ulsteinvikweatherpwsstation',
    name: 'ULSTEINVIK WEATHER PWS STATION',
    flag: 'NOR',
  },
  {
    id: 'nor-fedje',
    name: 'FEDJE',
    flag: 'NOR',
  },
  {
    id: 'nor-balestrand',
    name: 'BALESTRAND',
    flag: 'NOR',
  },
  {
    id: 'nor-selje',
    name: 'SELJE',
    flag: 'NOR',
  },
  {
    id: 'nor-kyrksaeterora',
    name: 'KYRKSAETERORA',
    flag: 'NOR',
  },
  {
    id: 'nor-knarvik',
    name: 'KNARVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-ramberg',
    name: 'RAMBERG',
    flag: 'NOR',
  },
  {
    id: 'nor-brostadbotn',
    name: 'BROSTADBOTN',
    flag: 'NOR',
  },
  {
    id: 'nor-granvin',
    name: 'GRANVIN',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-667',
    name: 'NOR-667',
    flag: 'NOR',
  },
  {
    id: 'nor-nesoddtangen',
    name: 'NESODDTANGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-namsos',
    name: 'NAMSOS',
    flag: 'NOR',
  },
  {
    id: 'nor-stjordal',
    name: 'STJORDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-eide',
    name: 'EIDE',
    flag: 'NOR',
  },
  {
    id: 'nor-nor-785',
    name: 'NOR-785',
    flag: 'NOR',
  },
  {
    id: 'nor-melsomvik',
    name: 'MELSOMVIK',
    flag: 'NOR',
  },
  {
    id: 'nzl-auckland',
    name: 'AUCKLAND',
    flag: 'NZL',
  },
  {
    id: 'nzl-whangarei',
    name: 'WHANGAREI',
    flag: 'NZL',
  },
  {
    id: 'nzl-nzl-25',
    name: 'NZL-25',
    flag: 'NZL',
  },
  {
    id: 'nzl-wellington',
    name: 'WELLINGTON',
    flag: 'NZL',
  },
  {
    id: 'nzl-bluffharbor',
    name: 'BLUFF HARBOR',
    flag: 'NZL',
  },
  {
    id: 'nzl-whangaparaoa',
    name: 'WHANGAPARAOA',
    flag: 'NZL',
  },
  {
    id: 'nzl-picton',
    name: 'PICTON',
    flag: 'NZL',
  },
  {
    id: 'nzl-whangaruru',
    name: 'WHANGARURU',
    flag: 'NZL',
  },
  {
    id: 'nzl-mimiwhangatabay',
    name: 'MIMIWHANGATA BAY',
    flag: 'NZL',
  },
  {
    id: 'nzl-nzl-34',
    name: 'NZL-34',
    flag: 'NZL',
  },
  {
    id: 'nzl-porirua',
    name: 'PORIRUA',
    flag: 'NZL',
  },
  {
    id: 'nzl-napier',
    name: 'NAPIER',
    flag: 'NZL',
  },
  {
    id: 'nzl-whangamata',
    name: 'WHANGAMATA',
    flag: 'NZL',
  },
  {
    id: 'nzl-opua',
    name: 'OPUA',
    flag: 'NZL',
  },
  {
    id: 'nzl-nzl-72',
    name: 'NZL-72',
    flag: 'NZL',
  },
  {
    id: 'nzl-newplymouth',
    name: 'NEW PLYMOUTH',
    flag: 'NZL',
  },
  {
    id: 'nzl-dunedin',
    name: 'DUNEDIN',
    flag: 'NZL',
  },
  {
    id: 'nzl-gisborne',
    name: 'GISBORNE',
    flag: 'NZL',
  },
  {
    id: 'nzl-greymouth',
    name: 'GREYMOUTH',
    flag: 'NZL',
  },
  {
    id: 'nzl-pareanuibay',
    name: 'PAREANUI BAY',
    flag: 'NZL',
  },
  {
    id: 'nzl-paihia',
    name: 'PAIHIA',
    flag: 'NZL',
  },
  {
    id: 'nzl-otagoharbor',
    name: 'OTAGO HARBOR',
    flag: 'NZL',
  },
  {
    id: 'nzl-westport',
    name: 'WESTPORT',
    flag: 'NZL',
  },
  {
    id: 'nzl-nzl-102',
    name: 'NZL-102',
    flag: 'NZL',
  },
  {
    id: 'nzl-nzl-60',
    name: 'NZL-60',
    flag: 'NZL',
  },
  {
    id: 'nzl-timaru',
    name: 'TIMARU',
    flag: 'NZL',
  },
  {
    id: 'nzl-whakatane',
    name: 'WHAKATANE',
    flag: 'NZL',
  },
  {
    id: 'nzl-ngunguru',
    name: 'NGUNGURU',
    flag: 'NZL',
  },
  {
    id: 'nzl-tauranga',
    name: 'TAURANGA',
    flag: 'NZL',
  },
  {
    id: 'nzl-moturuaisland',
    name: 'MOTURUA ISLAND',
    flag: 'NZL',
  },
  {
    id: 'nzl-nzl-71',
    name: 'NZL-71',
    flag: 'NZL',
  },
  {
    id: 'nzl-mangonui',
    name: 'MANGONUI',
    flag: 'NZL',
  },
  {
    id: 'nzl-matapouri',
    name: 'MATAPOURI',
    flag: 'NZL',
  },
  {
    id: 'nzl-portlyttelton',
    name: 'PORT LYTTELTON',
    flag: 'NZL',
  },
  {
    id: 'nzl-nzl-62',
    name: 'NZL-62',
    flag: 'NZL',
  },
  {
    id: 'nzl-whangaroa',
    name: 'WHANGAROA',
    flag: 'NZL',
  },
  {
    id: 'nzl-nelson',
    name: 'NELSON',
    flag: 'NZL',
  },
  {
    id: 'nzl-northshore',
    name: 'NORTH SHORE',
    flag: 'NZL',
  },
  {
    id: 'nzl-pakuranga',
    name: 'PAKURANGA',
    flag: 'NZL',
  },
  {
    id: 'nzl-nzl-6',
    name: 'NZL-6',
    flag: 'NZL',
  },
  {
    id: 'nzl-whitianga',
    name: 'WHITIANGA',
    flag: 'NZL',
  },
  {
    id: 'nzl-seaviewmarina',
    name: 'SEAVIEW MARINA',
    flag: 'NZL',
  },
  {
    id: 'phl-solana',
    name: 'SOLANA',
    flag: 'PHL',
  },
  {
    id: 'phl-masinloc',
    name: 'MASINLOC',
    flag: 'PHL',
  },
  {
    id: 'phl-tangke',
    name: 'TANGKE',
    flag: 'PHL',
  },
  {
    id: 'phl-agusan',
    name: 'AGUSAN',
    flag: 'PHL',
  },
  {
    id: 'phl-bolo',
    name: 'BOLO',
    flag: 'PHL',
  },
  {
    id: 'phl-portcapiz',
    name: 'PORT CAPIZ',
    flag: 'PHL',
  },
  {
    id: 'phl-minglanilla',
    name: 'MINGLANILLA',
    flag: 'PHL',
  },
  {
    id: 'phl-toril',
    name: 'TORIL',
    flag: 'PHL',
  },
  {
    id: 'phl-ilihan',
    name: 'ILIHAN',
    flag: 'PHL',
  },
  {
    id: 'phl-ormoc',
    name: 'ORMOC',
    flag: 'PHL',
  },
  {
    id: 'phl-mariveles',
    name: 'MARIVELES',
    flag: 'PHL',
  },
  {
    id: 'phl-tacloban',
    name: 'TACLOBAN',
    flag: 'PHL',
  },
  {
    id: 'phl-iligan',
    name: 'ILIGAN',
    flag: 'PHL',
  },
  {
    id: 'phl-recodo',
    name: 'RECODO',
    flag: 'PHL',
  },
  {
    id: 'phl-cagsiay',
    name: 'CAGSIAY',
    flag: 'PHL',
  },
  {
    id: 'phl-tubay',
    name: 'TUBAY',
    flag: 'PHL',
  },
  {
    id: 'phl-sinisian',
    name: 'SINISIAN',
    flag: 'PHL',
  },
  {
    id: 'phl-libertad',
    name: 'LIBERTAD',
    flag: 'PHL',
  },
  {
    id: 'phl-manila',
    name: 'MANILA',
    flag: 'PHL',
  },
  {
    id: 'phl-subic',
    name: 'SUBIC',
    flag: 'PHL',
  },
  {
    id: 'phl-coronon',
    name: 'CORONON',
    flag: 'PHL',
  },
  {
    id: 'phl-pangascasan',
    name: 'PANGASCASAN',
    flag: 'PHL',
  },
  {
    id: 'phl-pasacao',
    name: 'PASACAO',
    flag: 'PHL',
  },
  {
    id: 'phl-talaga',
    name: 'TALAGA',
    flag: 'PHL',
  },
  {
    id: 'phl-jordan',
    name: 'JORDAN',
    flag: 'PHL',
  },
  {
    id: 'phl-spratlyislands',
    name: 'SPRATLY ISLANDS',
    flag: 'PHL',
  },
  {
    id: 'phl-lugait',
    name: 'LUGAIT',
    flag: 'PHL',
  },
  {
    id: 'phl-riotuba',
    name: 'RIO TUBA',
    flag: 'PHL',
  },
  {
    id: 'phl-cabadbaran',
    name: 'CABADBARAN',
    flag: 'PHL',
  },
  {
    id: 'phl-iloilo',
    name: 'ILOILO',
    flag: 'PHL',
  },
  {
    id: 'phl-garciahernandez',
    name: 'GARCIA HERNANDEZ',
    flag: 'PHL',
  },
  {
    id: 'phl-tinoto',
    name: 'TINOTO',
    flag: 'PHL',
  },
  {
    id: 'phl-matnog',
    name: 'MATNOG',
    flag: 'PHL',
  },
  {
    id: 'phl-jimenez',
    name: 'JIMENEZ',
    flag: 'PHL',
  },
  {
    id: 'phl-lapu-lapucity',
    name: 'LAPU-LAPU CITY',
    flag: 'PHL',
  },
  {
    id: 'phl-coron',
    name: 'CORON',
    flag: 'PHL',
  },
  {
    id: 'phl-niugan',
    name: 'NIUGAN',
    flag: 'PHL',
  },
  {
    id: 'phl-sangali',
    name: 'SANGALI',
    flag: 'PHL',
  },
  {
    id: 'phl-generalsantos',
    name: 'GENERAL SANTOS',
    flag: 'PHL',
  },
  {
    id: 'phl-bolitoc',
    name: 'BOLITOC',
    flag: 'PHL',
  },
  {
    id: 'phl-camudmud',
    name: 'CAMUDMUD',
    flag: 'PHL',
  },
  {
    id: 'phl-babak',
    name: 'BABAK',
    flag: 'PHL',
  },
  {
    id: 'phl-union',
    name: 'UNION',
    flag: 'PHL',
  },
  {
    id: 'phl-caticlan',
    name: 'CATICLAN',
    flag: 'PHL',
  },
  {
    id: 'phl-mahayag',
    name: 'MAHAYAG',
    flag: 'PHL',
  },
  {
    id: 'phl-pulupandan',
    name: 'PULUPANDAN',
    flag: 'PHL',
  },
  {
    id: 'phl-cebu',
    name: 'CEBU',
    flag: 'PHL',
  },
  {
    id: 'phl-tubigan',
    name: 'TUBIGAN',
    flag: 'PHL',
  },
  {
    id: 'phl-tabaco',
    name: 'TABACO',
    flag: 'PHL',
  },
  {
    id: 'phl-davao',
    name: 'DAVAO',
    flag: 'PHL',
  },
  {
    id: 'phl-villanueva',
    name: 'VILLANUEVA',
    flag: 'PHL',
  },
  {
    id: 'phl-hiju,maco',
    name: 'HIJU, MACO',
    flag: 'PHL',
  },
  {
    id: 'phl-cogan',
    name: 'COGAN',
    flag: 'PHL',
  },
  {
    id: 'phl-navotas',
    name: 'NAVOTAS',
    flag: 'PHL',
  },
  {
    id: 'phl-portozamis',
    name: 'PORT OZAMIS',
    flag: 'PHL',
  },
  {
    id: 'phl-langtad',
    name: 'LANGTAD',
    flag: 'PHL',
  },
  {
    id: 'phl-zamboanga',
    name: 'ZAMBOANGA',
    flag: 'PHL',
  },
  {
    id: 'phl-calero',
    name: 'CALERO',
    flag: 'PHL',
  },
  {
    id: 'phl-manoc-manoc',
    name: 'MANOC-MANOC',
    flag: 'PHL',
  },
  {
    id: 'phl-toledo',
    name: 'TOLEDO',
    flag: 'PHL',
  },
  {
    id: 'phl-subicbay',
    name: 'SUBIC BAY',
    flag: 'PHL',
  },
  {
    id: 'phl-cabcaben',
    name: 'CABCABEN',
    flag: 'PHL',
  },
  {
    id: 'phl-limao',
    name: 'LIMAO',
    flag: 'PHL',
  },
  {
    id: 'phl-calapan',
    name: 'CALAPAN',
    flag: 'PHL',
  },
  {
    id: 'phl-masbate',
    name: 'MASBATE',
    flag: 'PHL',
  },
  {
    id: 'phl-surigaocity',
    name: 'SURIGAO CITY',
    flag: 'PHL',
  },
  {
    id: 'phl-lapaz',
    name: 'LA PAZ',
    flag: 'PHL',
  },
  {
    id: 'phl-aplaya',
    name: 'APLAYA',
    flag: 'PHL',
  },
  {
    id: 'phl-dumaguete',
    name: 'DUMAGUETE',
    flag: 'PHL',
  },
  {
    id: 'phl-nasipitport',
    name: 'NASIPIT PORT',
    flag: 'PHL',
  },
  {
    id: 'phl-batan',
    name: 'BATAN',
    flag: 'PHL',
  },
  {
    id: 'phl-mabini',
    name: 'MABINI',
    flag: 'PHL',
  },
  {
    id: 'phl-dalipuga',
    name: 'DALIPUGA',
    flag: 'PHL',
  },
  {
    id: 'phl-jagna',
    name: 'JAGNA',
    flag: 'PHL',
  },
  {
    id: 'phl-batangascity',
    name: 'BATANGAS CITY',
    flag: 'PHL',
  },
  {
    id: 'phl-kauswagan',
    name: 'KAUSWAGAN',
    flag: 'PHL',
  },
  {
    id: 'phl-puertogalera',
    name: 'PUERTO GALERA',
    flag: 'PHL',
  },
  {
    id: 'phl-dapa',
    name: 'DAPA',
    flag: 'PHL',
  },
  {
    id: 'phl-sangat',
    name: 'SANGAT',
    flag: 'PHL',
  },
  {
    id: 'phl-minlagas',
    name: 'MINLAGAS',
    flag: 'PHL',
  },
  {
    id: 'phl-limay',
    name: 'LIMAY',
    flag: 'PHL',
  },
  {
    id: 'phl-lucena',
    name: 'LUCENA',
    flag: 'PHL',
  },
  {
    id: 'phl-isabel',
    name: 'ISABEL',
    flag: 'PHL',
  },
  {
    id: 'phl-talisay',
    name: 'TALISAY',
    flag: 'PHL',
  },
  {
    id: 'phl-santaritaaplaya',
    name: 'SANTA RITA APLAYA',
    flag: 'PHL',
  },
  {
    id: 'phl-puertoprincesa',
    name: 'PUERTO PRINCESA',
    flag: 'PHL',
  },
  {
    id: 'phl-tagbilaran',
    name: 'TAGBILARAN',
    flag: 'PHL',
  },
  {
    id: 'phl-bugo',
    name: 'BUGO',
    flag: 'PHL',
  },
  {
    id: 'phl-carrascal',
    name: 'CARRASCAL',
    flag: 'PHL',
  },
  {
    id: 'phl-ipil',
    name: 'IPIL',
    flag: 'PHL',
  },
  {
    id: 'phl-balayan',
    name: 'BALAYAN',
    flag: 'PHL',
  },
  {
    id: 'phl-loreto',
    name: 'LORETO',
    flag: 'PHL',
  },
  {
    id: 'phl-inawayan',
    name: 'INAWAYAN',
    flag: 'PHL',
  },
  {
    id: 'phl-buanoy',
    name: 'BUANOY',
    flag: 'PHL',
  },
  {
    id: 'phl-sanfernandoharbor',
    name: 'SAN FERNANDO HARBOR',
    flag: 'PHL',
  },
  {
    id: 'phl-balud',
    name: 'BALUD',
    flag: 'PHL',
  },
  {
    id: 'phl-bacolodcity',
    name: 'BACOLOD CITY',
    flag: 'PHL',
  },
  {
    id: 'phl-obong',
    name: 'OBONG',
    flag: 'PHL',
  },
  {
    id: 'phl-cagayandeoro',
    name: 'CAGAYAN DE ORO',
    flag: 'PHL',
  },
  {
    id: 'phl-bauan',
    name: 'BAUAN',
    flag: 'PHL',
  },
  {
    id: 'phl-consolacion',
    name: 'CONSOLACION',
    flag: 'PHL',
  },
  {
    id: 'phl-naga',
    name: 'NAGA',
    flag: 'PHL',
  },
  {
    id: 'phl-polloc(cotabato)',
    name: 'POLLOC (COTABATO)',
    flag: 'PHL',
  },
  {
    id: 'phl-castanas',
    name: 'CASTANAS',
    flag: 'PHL',
  },
  {
    id: 'phl-langatian',
    name: 'LANGATIAN',
    flag: 'PHL',
  },
  {
    id: 'phl-malita',
    name: 'MALITA',
    flag: 'PHL',
  },
  {
    id: 'phl-sanfernando',
    name: 'SAN FERNANDO',
    flag: 'PHL',
  },
  {
    id: 'phl-doos',
    name: 'DOOS',
    flag: 'PHL',
  },
  {
    id: 'phl-maasin',
    name: 'MAASIN',
    flag: 'PHL',
  },
  {
    id: 'phl-legazpiport',
    name: 'LEGAZPI PORT',
    flag: 'PHL',
  },
  {
    id: 'phl-sanmiguel',
    name: 'SAN MIGUEL',
    flag: 'PHL',
  },
  {
    id: 'phl-calaca',
    name: 'CALACA',
    flag: 'PHL',
  },
  {
    id: 'phl-tandayag',
    name: 'TANDAYAG',
    flag: 'PHL',
  },
  {
    id: 'rus-semikarakorsk',
    name: 'SEMIKARAKORSK',
    flag: 'RUS',
  },
  {
    id: 'rus-belomorsk',
    name: 'BELOMORSK',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-366',
    name: 'RUS-366',
    flag: 'RUS',
  },
  {
    id: 'rus-roslyakovo',
    name: 'ROSLYAKOVO',
    flag: 'RUS',
  },
  {
    id: 'rus-rybinsk',
    name: 'RYBINSK',
    flag: 'RUS',
  },
  {
    id: 'rus-novorossiysk',
    name: 'NOVOROSSIYSK',
    flag: 'RUS',
  },
  {
    id: 'rus-murmansk',
    name: 'MURMANSK',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-251',
    name: 'RUS-251',
    flag: 'RUS',
  },
  {
    id: 'rus-balakovo',
    name: 'BALAKOVO',
    flag: 'RUS',
  },
  {
    id: 'rus-sovetskayagavan',
    name: 'SOVETSKAYA GAVAN',
    flag: 'RUS',
  },
  {
    id: 'rus-petrozavodsk',
    name: 'PETROZAVODSK',
    flag: 'RUS',
  },
  {
    id: 'rus-zhatay',
    name: 'ZHATAY',
    flag: 'RUS',
  },
  {
    id: "rus-shlissel'burg",
    name: "SHLISSEL'BURG",
    flag: 'RUS',
  },
  {
    id: 'rus-nakhodka',
    name: 'NAKHODKA',
    flag: 'RUS',
  },
  {
    id: 'rus-de-kastri',
    name: 'DE-KASTRI',
    flag: 'RUS',
  },
  {
    id: "rus-severo-kuril'sk",
    name: "SEVERO-KURIL'SK",
    flag: 'RUS',
  },
  {
    id: 'rus-okhotskiyreyd',
    name: 'OKHOTSK IY REYD',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-227',
    name: 'RUS-227',
    flag: 'RUS',
  },
  {
    id: 'rus-okhotsk',
    name: 'OKHOTSK',
    flag: 'RUS',
  },
  {
    id: 'rus-lensk',
    name: 'LENSK',
    flag: 'RUS',
  },
  {
    id: 'rus-yakutsk',
    name: 'YAKUTSK',
    flag: 'RUS',
  },
  {
    id: 'rus-svetlyy',
    name: 'SVETLYY',
    flag: 'RUS',
  },
  {
    id: 'rus-podlesnoye',
    name: 'PODLESNOYE',
    flag: 'RUS',
  },
  {
    id: 'rus-kulikovoanchorage',
    name: 'KULIKOVO ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'rus-kaliningrad',
    name: 'KALININGRAD',
    flag: 'RUS',
  },
  {
    id: 'rus-narimanov',
    name: 'NARIMANOV',
    flag: 'RUS',
  },
  {
    id: "rus-arkhangels'k",
    name: "ARKHANGELS'K",
    flag: 'RUS',
  },
  {
    id: 'rus-petropavlovsk',
    name: 'PETROPAVLOVSK',
    flag: 'RUS',
  },
  {
    id: 'rus-konstantinovsk',
    name: 'KONSTANTINOVSK',
    flag: 'RUS',
  },
  {
    id: "rus-ust'-donetskiy",
    name: "UST'-DONETSKIY",
    flag: 'RUS',
  },
  {
    id: 'rus-preobrazheniye',
    name: 'PREOBRAZHENIYE',
    flag: 'RUS',
  },
  {
    id: 'rus-tenishevo',
    name: 'TENISHEVO',
    flag: 'RUS',
  },
  {
    id: 'rus-taganrog',
    name: 'TAGANROG',
    flag: 'RUS',
  },
  {
    id: 'rus-ossora',
    name: 'OSSORA',
    flag: 'RUS',
  },
  {
    id: 'rus-stpetersburg',
    name: 'ST PETERSBURG',
    flag: 'RUS',
  },
  {
    id: 'rus-alekseyevskaya',
    name: 'ALEKSEYEVSKAYA',
    flag: 'RUS',
  },
  {
    id: 'rus-petropavlovsk-kamchatsky',
    name: 'PETROPAVLOVSK-KAMCHATSKY',
    flag: 'RUS',
  },
  {
    id: 'rus-rostov',
    name: 'ROSTOV',
    flag: 'RUS',
  },
  {
    id: "rus-ust'-izhora",
    name: "UST'-IZHORA",
    flag: 'RUS',
  },
  {
    id: 'rus-vanino',
    name: 'VANINO',
    flag: 'RUS',
  },
  {
    id: 'rus-akhtubinsk',
    name: 'AKHTUBINSK',
    flag: 'RUS',
  },
  {
    id: 'rus-astrakhan',
    name: 'ASTRAKHAN',
    flag: 'RUS',
  },
  {
    id: 'rus-tuapse',
    name: 'TUAPSE',
    flag: 'RUS',
  },
  {
    id: 'rus-volochayevskoye',
    name: 'VOLOCHAYEVSKOYE',
    flag: 'RUS',
  },
  {
    id: 'rus-vyborg',
    name: 'VYBORG',
    flag: 'RUS',
  },
  {
    id: 'rus-vitim',
    name: 'VITIM',
    flag: 'RUS',
  },
  {
    id: 'rus-belayagora',
    name: 'BELAYA GORA',
    flag: 'RUS',
  },
  {
    id: 'rus-kysyl-syr',
    name: 'KYSYL-SYR',
    flag: 'RUS',
  },
  {
    id: 'rus-moskalvo',
    name: 'MOSKALVO',
    flag: 'RUS',
  },
  {
    id: 'rus-vzmorye',
    name: 'VZMORYE',
    flag: 'RUS',
  },
  {
    id: 'rus-sabetta',
    name: 'SABETTA',
    flag: 'RUS',
  },
  {
    id: 'rus-kalach-na-donu',
    name: 'KALACH-NA-DONU',
    flag: 'RUS',
  },
  {
    id: 'rus-chkalovsk',
    name: 'CHKALOVSK',
    flag: 'RUS',
  },
  {
    id: 'rus-azov',
    name: 'AZOV',
    flag: 'RUS',
  },
  {
    id: 'rus-kildinisland',
    name: 'KILDIN ISLAND',
    flag: 'RUS',
  },
  {
    id: 'rus-lososina',
    name: 'LOSOSINA',
    flag: 'RUS',
  },
  {
    id: 'rus-vladivostok',
    name: 'VLADIVOSTOK',
    flag: 'RUS',
  },
  {
    id: 'rus-dudinka',
    name: 'DUDINKA',
    flag: 'RUS',
  },
  {
    id: 'rus-vistino',
    name: 'VISTINO',
    flag: 'RUS',
  },
  {
    id: 'rus-zolotaya',
    name: 'ZOLOTAYA',
    flag: 'RUS',
  },
  {
    id: 'rus-severodvinsk',
    name: 'SEVERODVINSK',
    flag: 'RUS',
  },
  {
    id: 'rus-kavkazoilterminal',
    name: 'KAVKAZ OIL TERMINAL',
    flag: 'RUS',
  },
  {
    id: 'rus-oktyabrskiy',
    name: 'OKTYABRSKIY',
    flag: 'RUS',
  },
  {
    id: 'rus-zarubino',
    name: 'ZARUBINO',
    flag: 'RUS',
  },
  {
    id: 'rus-safonovo',
    name: 'SAFONOVO',
    flag: 'RUS',
  },
  {
    id: 'rus-nevelsk',
    name: 'NEVELSK',
    flag: 'RUS',
  },
  {
    id: 'rus-shakhtersk',
    name: 'SHAKHTERSK',
    flag: 'RUS',
  },
  {
    id: 'rus-ptrk',
    name: 'PTRK',
    flag: 'RUS',
  },
  {
    id: 'rus-plastun',
    name: 'PLASTUN',
    flag: 'RUS',
  },
  {
    id: 'rus-slavyanka',
    name: 'SLAVYANKA',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-496',
    name: 'RUS-496',
    flag: 'RUS',
  },
  {
    id: 'rus-kurilsk',
    name: 'KURILSK',
    flag: 'RUS',
  },
  {
    id: 'rus-tambey',
    name: 'TAMBEY',
    flag: 'RUS',
  },
  {
    id: 'rus-podyapolsk',
    name: 'PODYAPOLSK',
    flag: 'RUS',
  },
  {
    id: 'rus-severokurilsk',
    name: 'SEVERO KURILSK',
    flag: 'RUS',
  },
  {
    id: 'rus-severomorsk',
    name: 'SEVEROMORSK',
    flag: 'RUS',
  },
  {
    id: 'rus-centralniy',
    name: 'CENTRALNIY',
    flag: 'RUS',
  },
  {
    id: 'rus-aksay',
    name: 'AKSAY',
    flag: 'RUS',
  },
  {
    id: 'rus-krestovskiyostrov',
    name: 'KRESTOVSKIY OSTROV',
    flag: 'RUS',
  },
  {
    id: 'rus-mysnovyyport',
    name: 'MYS NOVYY PORT',
    flag: 'RUS',
  },
  {
    id: 'rus-gavanvysotsk',
    name: 'GAVAN VYSOTSK',
    flag: 'RUS',
  },
  {
    id: 'rus-volgograd',
    name: 'VOLGOGRAD',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-167',
    name: 'RUS-167',
    flag: 'RUS',
  },
  {
    id: 'rus-bor',
    name: 'BOR',
    flag: 'RUS',
  },
  {
    id: 'rus-kuybyshevskiyzaton',
    name: 'KUYBYSHEVSKIY ZATON',
    flag: 'RUS',
  },
  {
    id: "rus-vasyl'evskyostrov",
    name: "VASYL'EVSKY OSTROV",
    flag: 'RUS',
  },
  {
    id: 'rus-rus-357',
    name: 'RUS-357',
    flag: 'RUS',
  },
  {
    id: 'rus-volzhskiy',
    name: 'VOLZHSKIY',
    flag: 'RUS',
  },
  {
    id: 'rus-sankt-peterburg',
    name: 'SANKT-PETERBURG',
    flag: 'RUS',
  },
  {
    id: "rus-pos'yet",
    name: "POS'YET",
    flag: 'RUS',
  },
  {
    id: 'rus-ulyanovsk',
    name: 'ULYANOVSK',
    flag: 'RUS',
  },
  {
    id: 'rus-lakhtinskiy',
    name: 'LAKHTINSKIY',
    flag: 'RUS',
  },
  {
    id: 'rus-dekastri',
    name: 'DE KASTRI',
    flag: 'RUS',
  },
  {
    id: 'rus-zvenigovo',
    name: 'ZVENIGOVO',
    flag: 'RUS',
  },
  {
    id: 'rus-rybatskoye',
    name: 'RYBATSKOYE',
    flag: 'RUS',
  },
  {
    id: 'rus-bukhtamorzhovaya',
    name: 'BUKHTA MORZHOVAYA',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-471',
    name: 'RUS-471',
    flag: 'RUS',
  },
  {
    id: 'rus-yaroslavl',
    name: 'YAROSLAVL',
    flag: 'RUS',
  },
  {
    id: 'rus-lesosibirsk',
    name: 'LESOSIBIRSK',
    flag: 'RUS',
  },
  {
    id: 'rus-sapernyy',
    name: 'SAPERNYY',
    flag: 'RUS',
  },
  {
    id: 'rus-temryuk',
    name: 'TEMRYUK',
    flag: 'RUS',
  },
  {
    id: 'rus-saratov',
    name: 'SARATOV',
    flag: 'RUS',
  },
  {
    id: 'rus-bukhtavanino',
    name: 'BUKHTA VANINO',
    flag: 'RUS',
  },
  {
    id: "rus-medvezh'yegorsk",
    name: "MEDVEZH'YEGORSK",
    flag: 'RUS',
  },
  {
    id: 'rus-otradnoye',
    name: 'OTRADNOYE',
    flag: 'RUS',
  },
  {
    id: 'rus-admiralteisky',
    name: 'ADMIRALTEISKY',
    flag: 'RUS',
  },
  {
    id: 'rus-isakogorka',
    name: 'ISAKOGORKA',
    flag: 'RUS',
  },
  {
    id: "rus-syzran'",
    name: "SYZRAN'",
    flag: 'RUS',
  },
  {
    id: 'rus-voznesenye',
    name: 'VOZNESENYE',
    flag: 'RUS',
  },
  {
    id: 'rus-kirensk',
    name: 'KIRENSK',
    flag: 'RUS',
  },
  {
    id: "rus-ust'-luga",
    name: "UST'-LUGA",
    flag: 'RUS',
  },
  {
    id: 'rus-posyet',
    name: 'POSYET',
    flag: 'RUS',
  },
  {
    id: 'rus-baltiysk',
    name: 'BALTIYSK',
    flag: 'RUS',
  },
  {
    id: 'rus-shikotan',
    name: 'SHIKOTAN',
    flag: 'RUS',
  },
  {
    id: 'rus-sumkino',
    name: 'SUMKINO',
    flag: 'RUS',
  },
  {
    id: 'rus-myskhako',
    name: 'MYSKHAKO',
    flag: 'RUS',
  },
  {
    id: "rus-vasil'yevo",
    name: "VASIL'YEVO",
    flag: 'RUS',
  },
  {
    id: 'rus-rus-221',
    name: 'RUS-221',
    flag: 'RUS',
  },
  {
    id: "rus-sudoverf'",
    name: "SUDOVERF'",
    flag: 'RUS',
  },
  {
    id: 'rus-starokucherganovka',
    name: 'STAROKUCHERGANOVKA',
    flag: 'RUS',
  },
  {
    id: 'rus-pevek',
    name: 'PEVEK',
    flag: 'RUS',
  },
  {
    id: 'rus-kondopoga',
    name: 'KONDOPOGA',
    flag: 'RUS',
  },
  {
    id: 'rus-olyokminsk',
    name: 'OLYOKMINSK',
    flag: 'RUS',
  },
  {
    id: 'rus-makhachkala',
    name: 'MAKHACHKALA',
    flag: 'RUS',
  },
  {
    id: 'rus-adler',
    name: 'ADLER',
    flag: 'RUS',
  },
  {
    id: 'rus-korsakov',
    name: 'KORSAKOV',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-77',
    name: 'RUS-77',
    flag: 'RUS',
  },
  {
    id: 'rus-arkhangelsk',
    name: 'ARKHANGELSK',
    flag: 'RUS',
  },
  {
    id: 'rus-starocherkasskaya',
    name: 'STAROCHERKASSKAYA',
    flag: 'RUS',
  },
  {
    id: 'rus-vytegra',
    name: 'VYTEGRA',
    flag: 'RUS',
  },
  {
    id: 'rus-tiksi',
    name: 'TIKSI',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-217',
    name: 'RUS-217',
    flag: 'RUS',
  },
  {
    id: "rus-voznesen'ye",
    name: "VOZNESEN'YE",
    flag: 'RUS',
  },
  {
    id: 'rus-kirovsk',
    name: 'KIROVSK',
    flag: 'RUS',
  },
  {
    id: 'rus-berezovka',
    name: 'BEREZOVKA',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-191',
    name: 'RUS-191',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-465',
    name: 'RUS-465',
    flag: 'RUS',
  },
  {
    id: 'rus-yuzhno-kurilsk',
    name: 'YUZHNO-KURILSK',
    flag: 'RUS',
  },
  {
    id: 'rus-krasnoyarsk',
    name: 'KRASNOYARSK',
    flag: 'RUS',
  },
  {
    id: 'rus-boshnyakovo',
    name: 'BOSHNYAKOVO',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-94',
    name: 'RUS-94',
    flag: 'RUS',
  },
  {
    id: 'rus-rekaluga',
    name: 'REKA LUGA',
    flag: 'RUS',
  },
  {
    id: 'rus-zhigansk',
    name: 'ZHIGANSK',
    flag: 'RUS',
  },
  {
    id: 'rus-volgodonsk',
    name: 'VOLGODONSK',
    flag: 'RUS',
  },
  {
    id: 'rus-kholmsk',
    name: 'KHOLMSK',
    flag: 'RUS',
  },
  {
    id: 'rus-sochi',
    name: 'SOCHI',
    flag: 'RUS',
  },
  {
    id: 'rus-sangar',
    name: 'SANGAR',
    flag: 'RUS',
  },
  {
    id: "rus-oktyabr'skiy",
    name: "OKTYABR'SKIY",
    flag: 'RUS',
  },
  {
    id: 'rus-karaginskiyzaliv',
    name: 'KARAGINSKIY ZALIV',
    flag: 'RUS',
  },
  {
    id: 'rus-amgu',
    name: 'AMGU',
    flag: 'RUS',
  },
  {
    id: 'rus-pionerskiy',
    name: 'PIONERSKIY',
    flag: 'RUS',
  },
  {
    id: 'rus-dzhebariki-khaya',
    name: 'DZHEBARIKI-KHAYA',
    flag: 'RUS',
  },
  {
    id: 'rus-kazan',
    name: 'KAZAN',
    flag: 'RUS',
  },
  {
    id: "rus-rudnayapristan'",
    name: "RUDNAYA PRISTAN'",
    flag: 'RUS',
  },
  {
    id: 'rus-anapa',
    name: 'ANAPA',
    flag: 'RUS',
  },
  {
    id: 'rus-vazhiny',
    name: 'VAZHINY',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-220',
    name: 'RUS-220',
    flag: 'RUS',
  },
  {
    id: 'rus-mysabram',
    name: 'MYS ABRAM',
    flag: 'RUS',
  },
  {
    id: 'rus-magadan',
    name: 'MAGADAN',
    flag: 'RUS',
  },
  {
    id: 'rus-temryukanchorage',
    name: 'TEMRYUK ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'rus-nizhniybestyakh',
    name: 'NIZHNIY BESTYAKH',
    flag: 'RUS',
  },
  {
    id: 'rus-tunoshna',
    name: 'TUNOSHNA',
    flag: 'RUS',
  },
  {
    id: 'rus-kabardinka',
    name: 'KABARDINKA',
    flag: 'RUS',
  },
  {
    id: 'rus-segezha',
    name: 'SEGEZHA',
    flag: 'RUS',
  },
  {
    id: 'rus-nikolayevsknaamur',
    name: 'NIKOLAYEVSK NA AMUR',
    flag: 'RUS',
  },
  {
    id: 'rus-anadyr',
    name: 'ANADYR',
    flag: 'RUS',
  },
  {
    id: 'rus-levoberezhnyy',
    name: 'LEVOBEREZHNYY',
    flag: 'RUS',
  },
  {
    id: 'rus-bolshoykamen',
    name: 'BOLSHOY KAMEN',
    flag: 'RUS',
  },
  {
    id: 'rus-gelendzhik',
    name: 'GELENDZHIK',
    flag: 'RUS',
  },
  {
    id: 'rus-ustkamchatsk',
    name: 'UST KAMCHATSK',
    flag: 'RUS',
  },
  {
    id: 'rus-provideniya',
    name: 'PROVIDENIYA',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-11',
    name: 'RUS-11',
    flag: 'RUS',
  },
  {
    id: 'rus-kronshtadt',
    name: 'KRONSHTADT',
    flag: 'RUS',
  },
  {
    id: 'rus-portdikson',
    name: 'PORT DIKSON',
    flag: 'RUS',
  },
  {
    id: 'rus-tilichiki',
    name: 'TILICHIKI',
    flag: 'RUS',
  },
  {
    id: 'rus-kamyshin',
    name: 'KAMYSHIN',
    flag: 'RUS',
  },
  {
    id: "rus-chistopol'",
    name: "CHISTOPOL'",
    flag: 'RUS',
  },
  {
    id: 'rus-volgo-kaspiyskiy',
    name: 'VOLGO-KASPIYSKIY',
    flag: 'RUS',
  },
  {
    id: 'rus-ozernovskiy',
    name: 'OZERNOVSKIY',
    flag: 'RUS',
  },
  {
    id: 'rus-yeysk',
    name: 'YEYSK',
    flag: 'RUS',
  },
  {
    id: 'rus-podtyosovo',
    name: 'PODTYOSOVO',
    flag: 'RUS',
  },
  {
    id: 'rus-cherepovets',
    name: 'CHEREPOVETS',
    flag: 'RUS',
  },
  {
    id: 'rus-bagayevskaya',
    name: 'BAGAYEVSKAYA',
    flag: 'RUS',
  },
  {
    id: 'rus-primorsk',
    name: 'PRIMORSK',
    flag: 'RUS',
  },
  {
    id: 'rus-vostochnyy',
    name: 'VOSTOCHNYY',
    flag: 'RUS',
  },
  {
    id: 'rus-svetlaya',
    name: 'SVETLAYA',
    flag: 'RUS',
  },
  {
    id: 'rus-nikolayevskaya',
    name: 'NIKOLAYEVSKAYA',
    flag: 'RUS',
  },
  {
    id: 'rus-nyurba',
    name: 'NYURBA',
    flag: 'RUS',
  },
  {
    id: 'rus-yaksatovo',
    name: 'YAKSATOVO',
    flag: 'RUS',
  },
  {
    id: 'rus-peleduy',
    name: 'PELEDUY',
    flag: 'RUS',
  },
  {
    id: 'rus-solikamsk',
    name: 'SOLIKAMSK',
    flag: 'RUS',
  },
  {
    id: 'rus-bukhtagaydamak',
    name: 'BUKHTA GAYDAMAK',
    flag: 'RUS',
  },
  {
    id: 'rus-gorodets',
    name: 'GORODETS',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-52',
    name: 'RUS-52',
    flag: 'RUS',
  },
  {
    id: "rus-pamyat'parizhskoykommuny",
    name: "PAMYAT' PARIZHSKOY KOMMUNY",
    flag: 'RUS',
  },
  {
    id: 'rus-novayabalakhna',
    name: 'NOVAYA BALAKHNA',
    flag: 'RUS',
  },
  {
    id: 'rus-pontonnyy',
    name: 'PONTONNYY',
    flag: 'RUS',
  },
  {
    id: 'rus-kstovo',
    name: 'KSTOVO',
    flag: 'RUS',
  },
  {
    id: 'rus-rakushka',
    name: 'RAKUSHKA',
    flag: 'RUS',
  },
  {
    id: 'rus-solyanka',
    name: 'SOLYANKA',
    flag: 'RUS',
  },
  {
    id: "rus-podporozh'ye",
    name: "PODPOROZH'YE",
    flag: 'RUS',
  },
  {
    id: 'rus-rus-348',
    name: 'RUS-348',
    flag: 'RUS',
  },
  {
    id: 'rus-obukhovo',
    name: 'OBUKHOVO',
    flag: 'RUS',
  },
  {
    id: 'rus-bereslavka',
    name: 'BERESLAVKA',
    flag: 'RUS',
  },
  {
    id: 'rus-khandyga',
    name: 'KHANDYGA',
    flag: 'RUS',
  },
  {
    id: 'rus-rostov-na-donu',
    name: 'ROSTOV-NA-DONU',
    flag: 'RUS',
  },
  {
    id: 'rus-uglegorsk',
    name: 'UGLEGORSK',
    flag: 'RUS',
  },
  {
    id: 'rus-nizhniynovgorod',
    name: 'NIZHNIY NOVGOROD',
    flag: 'RUS',
  },
  {
    id: 'rus-shepsi',
    name: 'SHEPSI',
    flag: 'RUS',
  },
  {
    id: 'rus-rus-98',
    name: 'RUS-98',
    flag: 'RUS',
  },
  {
    id: 'rus-dubovka',
    name: 'DUBOVKA',
    flag: 'RUS',
  },
  {
    id: 'rus-olga',
    name: 'OLGA',
    flag: 'RUS',
  },
  {
    id: 'rus-tetyushi',
    name: 'TETYUSHI',
    flag: 'RUS',
  },
  {
    id: "rus-il'ich",
    name: "IL'ICH",
    flag: 'RUS',
  },
  {
    id: 'rus-beringovsky',
    name: 'BERINGOVSKY',
    flag: 'RUS',
  },
  {
    id: 'rus-kandalaksha',
    name: 'KANDALAKSHA',
    flag: 'RUS',
  },
  {
    id: 'rus-egvekinot',
    name: 'EGVEKINOT',
    flag: 'RUS',
  },
  {
    id: "rus-bol'shoykamen'",
    name: "BOL'SHOY KAMEN'",
    flag: 'RUS',
  },
  {
    id: "rus-sheremet'yevskiy",
    name: "SHEREMET'YEVSKIY",
    flag: 'RUS',
  },
  {
    id: "rus-usol'ye",
    name: "USOL'YE",
    flag: 'RUS',
  },
  {
    id: 'rus-shakotan',
    name: 'SHAKOTAN',
    flag: 'RUS',
  },
  {
    id: 'rus-saintpetersburg',
    name: 'SAINT PETERSBURG',
    flag: 'RUS',
  },
  {
    id: "rus-bogatyr'",
    name: "BOGATYR'",
    flag: 'RUS',
  },
  {
    id: 'rus-krasnoslobodsk',
    name: 'KRASNOSLOBODSK',
    flag: 'RUS',
  },
  {
    id: "rus-ust'-kut",
    name: "UST'-KUT",
    flag: 'RUS',
  },
  {
    id: 'rus-mokhsogollokh',
    name: 'MOKHSOGOLLOKH',
    flag: 'RUS',
  },
  {
    id: 'rus-lomonosov',
    name: 'LOMONOSOV',
    flag: 'RUS',
  },
  {
    id: 'rus-naryan-mar',
    name: 'NAR YAN-MAR',
    flag: 'RUS',
  },
  {
    id: 'sau-rabigh',
    name: 'RABIGH',
    flag: 'SAU',
  },
  {
    id: 'sau-dammam',
    name: 'DAMMAM',
    flag: 'SAU',
  },
  {
    id: 'sau-rasalkhafji',
    name: 'RAS AL KHAFJI',
    flag: 'SAU',
  },
  {
    id: 'sau-jeddah',
    name: 'JEDDAH',
    flag: 'SAU',
  },
  {
    id: 'sau-arabiyahfield',
    name: 'ARABIYAH FIELD',
    flag: 'SAU',
  },
  {
    id: 'sau-rasalmishab',
    name: 'RAS AL MISHAB',
    flag: 'SAU',
  },
  {
    id: 'sau-yanbu',
    name: 'YANBU',
    flag: 'SAU',
  },
  {
    id: 'sau-kingfahdport',
    name: 'KING FAHD PORT',
    flag: 'SAU',
  },
  {
    id: 'sau-aljubayl',
    name: 'AL JUBAYL',
    flag: 'SAU',
  },
  {
    id: 'sau-jizan',
    name: 'JIZAN',
    flag: 'SAU',
  },
  {
    id: 'sau-sau-204',
    name: 'SAU-204',
    flag: 'SAU',
  },
  {
    id: 'sau-rastanura',
    name: 'RAS TANURA',
    flag: 'SAU',
  },
  {
    id: 'sau-jiddah',
    name: 'JIDDAH',
    flag: 'SAU',
  },
  {
    id: 'sau-duba',
    name: 'DUBA',
    flag: 'SAU',
  },
  {
    id: 'sau-rastannurah',
    name: 'RAS  TANNURAH',
    flag: 'SAU',
  },
  {
    id: 'sau-sau-190',
    name: 'SAU-190',
    flag: 'SAU',
  },
  {
    id: 'swe-halmstad',
    name: 'HALMSTAD',
    flag: 'SWE',
  },
  {
    id: 'swe-vaja',
    name: 'VAJA',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-429',
    name: 'SWE-429',
    flag: 'SWE',
  },
  {
    id: 'swe-djursholm',
    name: 'DJURSHOLM',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-13',
    name: 'SWE-13',
    flag: 'SWE',
  },
  {
    id: 'swe-hono',
    name: 'HONO',
    flag: 'SWE',
  },
  {
    id: 'swe-tuna',
    name: 'TUNA',
    flag: 'SWE',
  },
  {
    id: 'swe-sundsvall',
    name: 'SUNDSVALL',
    flag: 'SWE',
  },
  {
    id: 'swe-gustavsberg',
    name: 'GUSTAVSBERG',
    flag: 'SWE',
  },
  {
    id: 'swe-farosund',
    name: 'FAROSUND',
    flag: 'SWE',
  },
  {
    id: 'swe-vivstavarv',
    name: 'VIVSTAVARV',
    flag: 'SWE',
  },
  {
    id: 'swe-angelholm',
    name: 'ANGELHOLM',
    flag: 'SWE',
  },
  {
    id: 'swe-bovallstrand',
    name: 'BOVALLSTRAND',
    flag: 'SWE',
  },
  {
    id: 'swe-utansjo',
    name: 'UTANSJO',
    flag: 'SWE',
  },
  {
    id: 'swe-norrtalje',
    name: 'NORRTALJE',
    flag: 'SWE',
  },
  {
    id: 'swe-fittja',
    name: 'FITTJA',
    flag: 'SWE',
  },
  {
    id: 'swe-rundvik',
    name: 'RUNDVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-lulea',
    name: 'LULEA',
    flag: 'SWE',
  },
  {
    id: 'swe-brofjorden',
    name: 'BROFJORDEN',
    flag: 'SWE',
  },
  {
    id: 'swe-falkenberg',
    name: 'FALKENBERG',
    flag: 'SWE',
  },
  {
    id: 'swe-bergshamra',
    name: 'BERGSHAMRA',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-86',
    name: 'SWE-86',
    flag: 'SWE',
  },
  {
    id: 'swe-hjuvik',
    name: 'HJUVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-simrishamn',
    name: 'SIMRISHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-norrsundet',
    name: 'NORRSUNDET',
    flag: 'SWE',
  },
  {
    id: 'swe-taernoelaxboden',
    name: 'TAERNOE LAXBODEN',
    flag: 'SWE',
  },
  {
    id: 'swe-farjestaden',
    name: 'FARJESTADEN',
    flag: 'SWE',
  },
  {
    id: 'swe-ornskoldsvik',
    name: 'ORNSKOLDSVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-ljungskile',
    name: 'LJUNGSKILE',
    flag: 'SWE',
  },
  {
    id: 'swe-gavle',
    name: 'GAVLE',
    flag: 'SWE',
  },
  {
    id: 'swe-klintehamn',
    name: 'KLINTEHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-husum',
    name: 'HUSUM',
    flag: 'SWE',
  },
  {
    id: 'swe-koping',
    name: 'KOPING',
    flag: 'SWE',
  },
  {
    id: 'swe-vastervik',
    name: 'VASTERVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-eriksberg',
    name: 'ERIKSBERG',
    flag: 'SWE',
  },
  {
    id: 'swe-fisksatra',
    name: 'FISKSATRA',
    flag: 'SWE',
  },
  {
    id: 'swe-sandhamn',
    name: 'SANDHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-kalmar',
    name: 'KALMAR',
    flag: 'SWE',
  },
  {
    id: 'swe-goteborg',
    name: 'GOTEBORG',
    flag: 'SWE',
  },
  {
    id: 'swe-varberg',
    name: 'VARBERG',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-106',
    name: 'SWE-106',
    flag: 'SWE',
  },
  {
    id: 'swe-vallvik',
    name: 'VALLVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-billdal',
    name: 'BILLDAL',
    flag: 'SWE',
  },
  {
    id: 'swe-kungshamn',
    name: 'KUNGSHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-ahus',
    name: 'AHUS',
    flag: 'SWE',
  },
  {
    id: 'swe-sigtuna',
    name: 'SIGTUNA',
    flag: 'SWE',
  },
  {
    id: 'swe-uddevalla',
    name: 'UDDEVALLA',
    flag: 'SWE',
  },
  {
    id: 'swe-karlshamn',
    name: 'KARLSHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-gothenburg',
    name: 'GOTHENBURG',
    flag: 'SWE',
  },
  {
    id: 'swe-skivarp',
    name: 'SKIVARP',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-569',
    name: 'SWE-569',
    flag: 'SWE',
  },
  {
    id: 'swe-limhamn',
    name: 'LIMHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-mellerud',
    name: 'MELLERUD',
    flag: 'SWE',
  },
  {
    id: 'swe-borgholm',
    name: 'BORGHOLM',
    flag: 'SWE',
  },
  {
    id: 'swe-ekero',
    name: 'EKERO',
    flag: 'SWE',
  },
  {
    id: 'swe-ostermalm',
    name: 'OSTERMALM',
    flag: 'SWE',
  },
  {
    id: 'swe-borensberg',
    name: 'BORENSBERG',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-253',
    name: 'SWE-253',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-323',
    name: 'SWE-323',
    flag: 'SWE',
  },
  {
    id: 'swe-stockholm',
    name: 'STOCKHOLM',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-448',
    name: 'SWE-448',
    flag: 'SWE',
  },
  {
    id: 'swe-langvik',
    name: 'LANGVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-skelleftehamn',
    name: 'SKELLEFTEHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-bastad',
    name: 'BASTAD',
    flag: 'SWE',
  },
  {
    id: 'swe-hollviken',
    name: 'HOLLVIKEN',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-533',
    name: 'SWE-533',
    flag: 'SWE',
  },
  {
    id: 'swe-oxelosund',
    name: 'OXELOSUND',
    flag: 'SWE',
  },
  {
    id: 'swe-hargshamn',
    name: 'HARGSHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-bollstabruk',
    name: 'BOLLSTABRUK',
    flag: 'SWE',
  },
  {
    id: 'swe-kopparmora',
    name: 'KOPPARMORA',
    flag: 'SWE',
  },
  {
    id: 'swe-hunnebostrand',
    name: 'HUNNEBOSTRAND',
    flag: 'SWE',
  },
  {
    id: 'swe-trollhattan',
    name: 'TROLLHATTAN',
    flag: 'SWE',
  },
  {
    id: 'swe-bjorko',
    name: 'BJORKO',
    flag: 'SWE',
  },
  {
    id: 'swe-stromstad',
    name: 'STROMSTAD',
    flag: 'SWE',
  },
  {
    id: 'swe-stenungsund',
    name: 'STENUNGSUND',
    flag: 'SWE',
  },
  {
    id: 'swe-dalaro',
    name: 'DALARO',
    flag: 'SWE',
  },
  {
    id: 'swe-umeahamn',
    name: 'UMEA HAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-grisslehamn',
    name: 'GRISSLEHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-segeltorp',
    name: 'SEGELTORP',
    flag: 'SWE',
  },
  {
    id: 'swe-ronnang',
    name: 'RONNANG',
    flag: 'SWE',
  },
  {
    id: 'swe-fyrudden',
    name: 'FYRUDDEN',
    flag: 'SWE',
  },
  {
    id: 'swe-vaxholm',
    name: 'VAXHOLM',
    flag: 'SWE',
  },
  {
    id: 'swe-norrkoping',
    name: 'NORRKOPING',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-191',
    name: 'SWE-191',
    flag: 'SWE',
  },
  {
    id: 'swe-malmo',
    name: 'MALMO',
    flag: 'SWE',
  },
  {
    id: 'swe-henan',
    name: 'HENAN',
    flag: 'SWE',
  },
  {
    id: 'swe-majorna',
    name: 'MAJORNA',
    flag: 'SWE',
  },
  {
    id: 'swe-ellos',
    name: 'ELLOS',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-541',
    name: 'SWE-541',
    flag: 'SWE',
  },
  {
    id: 'swe-odsmal',
    name: 'ODSMAL',
    flag: 'SWE',
  },
  {
    id: 'swe-bjarred',
    name: 'BJARRED',
    flag: 'SWE',
  },
  {
    id: 'swe-visby',
    name: 'VISBY',
    flag: 'SWE',
  },
  {
    id: 'swe-kungsangen',
    name: 'KUNGSANGEN',
    flag: 'SWE',
  },
  {
    id: 'swe-torekov',
    name: 'TOREKOV',
    flag: 'SWE',
  },
  {
    id: 'swe-sandarne',
    name: 'SANDARNE',
    flag: 'SWE',
  },
  {
    id: 'swe-ockero',
    name: 'OCKERO',
    flag: 'SWE',
  },
  {
    id: 'swe-hittarp',
    name: 'HITTARP',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-170',
    name: 'SWE-170',
    flag: 'SWE',
  },
  {
    id: 'swe-lysekil',
    name: 'LYSEKIL',
    flag: 'SWE',
  },
  {
    id: 'swe-taby',
    name: 'TABY',
    flag: 'SWE',
  },
  {
    id: 'swe-sodertalje',
    name: 'SODERTALJE',
    flag: 'SWE',
  },
  {
    id: 'swe-enhagen-ekbacken',
    name: 'ENHAGEN-EKBACKEN',
    flag: 'SWE',
  },
  {
    id: 'swe-degerhamn',
    name: 'DEGERHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-hasslo',
    name: 'HASSLO',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-305',
    name: 'SWE-305',
    flag: 'SWE',
  },
  {
    id: 'swe-krokek',
    name: 'KROKEK',
    flag: 'SWE',
  },
  {
    id: 'swe-mortnas',
    name: 'MORTNAS',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-187',
    name: 'SWE-187',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-475',
    name: 'SWE-475',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-41',
    name: 'SWE-41',
    flag: 'SWE',
  },
  {
    id: 'swe-vadstena',
    name: 'VADSTENA',
    flag: 'SWE',
  },
  {
    id: 'swe-hudiksvall',
    name: 'HUDIKSVALL',
    flag: 'SWE',
  },
  {
    id: 'swe-hammarkullen',
    name: 'HAMMARKULLEN',
    flag: 'SWE',
  },
  {
    id: 'swe-arno',
    name: 'ARNO',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-359',
    name: 'SWE-359',
    flag: 'SWE',
  },
  {
    id: 'swe-djuro',
    name: 'DJURO',
    flag: 'SWE',
  },
  {
    id: 'swe-hoganas',
    name: 'HOGANAS',
    flag: 'SWE',
  },
  {
    id: 'swe-lindo',
    name: 'LINDO',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-61',
    name: 'SWE-61',
    flag: 'SWE',
  },
  {
    id: 'swe-timmernabben',
    name: 'TIMMERNABBEN',
    flag: 'SWE',
  },
  {
    id: 'swe-myggenas',
    name: 'MYGGENAS',
    flag: 'SWE',
  },
  {
    id: 'swe-ronneby',
    name: 'RONNEBY',
    flag: 'SWE',
  },
  {
    id: 'swe-balsta',
    name: 'BALSTA',
    flag: 'SWE',
  },
  {
    id: 'swe-hallstavik',
    name: 'HALLSTAVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-kungalv',
    name: 'KUNGALV',
    flag: 'SWE',
  },
  {
    id: 'swe-storugns',
    name: 'STORUGNS',
    flag: 'SWE',
  },
  {
    id: 'swe-glommen',
    name: 'GLOMMEN',
    flag: 'SWE',
  },
  {
    id: 'swe-paskallavik',
    name: 'PASKALLAVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-bietnam',
    name: 'BIETNAM',
    flag: 'SWE',
  },
  {
    id: 'swe-lidkoping',
    name: 'LIDKOPING',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-421',
    name: 'SWE-421',
    flag: 'SWE',
  },
  {
    id: 'swe-styrso',
    name: 'STYRSO',
    flag: 'SWE',
  },
  {
    id: 'swe-trelleborg',
    name: 'TRELLEBORG',
    flag: 'SWE',
  },
  {
    id: 'swe-karlstad',
    name: 'KARLSTAD',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-222',
    name: 'SWE-222',
    flag: 'SWE',
  },
  {
    id: 'swe-bjorlanda',
    name: 'BJORLANDA',
    flag: 'SWE',
  },
  {
    id: 'swe-fjallbacka',
    name: 'FJALLBACKA',
    flag: 'SWE',
  },
  {
    id: 'swe-bergkvara',
    name: 'BERGKVARA',
    flag: 'SWE',
  },
  {
    id: 'swe-karskar',
    name: 'KARSKAR',
    flag: 'SWE',
  },
  {
    id: 'swe-trosa',
    name: 'TROSA',
    flag: 'SWE',
  },
  {
    id: 'swe-haverdal',
    name: 'HAVERDAL',
    flag: 'SWE',
  },
  {
    id: 'swe-sodermalm',
    name: 'SODERMALM',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-278',
    name: 'SWE-278',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-182',
    name: 'SWE-182',
    flag: 'SWE',
  },
  {
    id: 'swe-iggesund',
    name: 'IGGESUND',
    flag: 'SWE',
  },
  {
    id: 'swe-stocka',
    name: 'STOCKA',
    flag: 'SWE',
  },
  {
    id: 'swe-bullandoe',
    name: 'BULLANDOE',
    flag: 'SWE',
  },
  {
    id: 'swe-stockvik',
    name: 'STOCKVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-saltsjobaden',
    name: 'SALTSJOBADEN',
    flag: 'SWE',
  },
  {
    id: 'swe-onsala',
    name: 'ONSALA',
    flag: 'SWE',
  },
  {
    id: 'swe-figeholm',
    name: 'FIGEHOLM',
    flag: 'SWE',
  },
  {
    id: 'swe-enebyberg',
    name: 'ENEBYBERG',
    flag: 'SWE',
  },
  {
    id: 'swe-kristinehamn',
    name: 'KRISTINEHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-smogen',
    name: 'SMOGEN',
    flag: 'SWE',
  },
  {
    id: 'swe-solvesborg',
    name: 'SOLVESBORG',
    flag: 'SWE',
  },
  {
    id: 'swe-viken',
    name: 'VIKEN',
    flag: 'SWE',
  },
  {
    id: 'swe-vasteras',
    name: 'VASTERAS',
    flag: 'SWE',
  },
  {
    id: 'swe-skanormedfalsterbo',
    name: 'SKANOR MED FALSTERBO',
    flag: 'SWE',
  },
  {
    id: 'swe-smygehamn',
    name: 'SMYGEHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-mariefred',
    name: 'MARIEFRED',
    flag: 'SWE',
  },
  {
    id: 'swe-hoviksnas',
    name: 'HOVIKSNAS',
    flag: 'SWE',
  },
  {
    id: 'swe-grebbestad',
    name: 'GREBBESTAD',
    flag: 'SWE',
  },
  {
    id: 'swe-skare',
    name: 'SKARE',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-456',
    name: 'SWE-456',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-441',
    name: 'SWE-441',
    flag: 'SWE',
  },
  {
    id: 'swe-tjuvkil',
    name: 'TJUVKIL',
    flag: 'SWE',
  },
  {
    id: 'swe-borstahusen',
    name: 'BORSTAHUSEN',
    flag: 'SWE',
  },
  {
    id: 'swe-brevik',
    name: 'BREVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-moerbylaanga',
    name: 'MOERBYLAANGA',
    flag: 'SWE',
  },
  {
    id: 'swe-oregrund',
    name: 'OREGRUND',
    flag: 'SWE',
  },
  {
    id: 'swe-storajatterson',
    name: 'STORA JATTERSON',
    flag: 'SWE',
  },
  {
    id: 'swe-kummelnas',
    name: 'KUMMELNAS',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-167',
    name: 'SWE-167',
    flag: 'SWE',
  },
  {
    id: 'swe-backviken',
    name: 'BACKVIKEN',
    flag: 'SWE',
  },
  {
    id: 'swe-lillaedet',
    name: 'LILLA EDET',
    flag: 'SWE',
  },
  {
    id: 'swe-motala',
    name: 'MOTALA',
    flag: 'SWE',
  },
  {
    id: 'swe-stavsnas',
    name: 'STAVSNAS',
    flag: 'SWE',
  },
  {
    id: 'swe-rivo',
    name: 'RIVO',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-77',
    name: 'SWE-77',
    flag: 'SWE',
  },
  {
    id: 'swe-vanersborg',
    name: 'VANERSBORG',
    flag: 'SWE',
  },
  {
    id: 'swe-brunn',
    name: 'BRUNN',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-360',
    name: 'SWE-360',
    flag: 'SWE',
  },
  {
    id: 'swe-bunkeflostrand',
    name: 'BUNKEFLOSTRAND',
    flag: 'SWE',
  },
  {
    id: 'swe-nynashamn',
    name: 'NYNASHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-helsingborg',
    name: 'HELSINGBORG',
    flag: 'SWE',
  },
  {
    id: 'swe-berg',
    name: 'BERG',
    flag: 'SWE',
  },
  {
    id: 'swe-nacka',
    name: 'NACKA',
    flag: 'SWE',
  },
  {
    id: 'swe-harnosand',
    name: 'HARNOSAND',
    flag: 'SWE',
  },
  {
    id: 'swe-ljunghusen',
    name: 'LJUNGHUSEN',
    flag: 'SWE',
  },
  {
    id: 'swe-marstrand',
    name: 'MARSTRAND',
    flag: 'SWE',
  },
  {
    id: 'swe-oskarshamn',
    name: 'OSKARSHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-toreboda',
    name: 'TOREBODA',
    flag: 'SWE',
  },
  {
    id: 'swe-akersberga',
    name: 'AKERSBERGA',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-418',
    name: 'SWE-418',
    flag: 'SWE',
  },
  {
    id: 'swe-traslovslage',
    name: 'TRASLOVSLAGE',
    flag: 'SWE',
  },
  {
    id: 'swe-sundbyberg',
    name: 'SUNDBYBERG',
    flag: 'SWE',
  },
  {
    id: 'swe-karlskrona',
    name: 'KARLSKRONA',
    flag: 'SWE',
  },
  {
    id: 'swe-karlsborg',
    name: 'KARLSBORG',
    flag: 'SWE',
  },
  {
    id: 'swe-lomma',
    name: 'LOMMA',
    flag: 'SWE',
  },
  {
    id: 'swe-soderhamn',
    name: 'SODERHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-544',
    name: 'SWE-544',
    flag: 'SWE',
  },
  {
    id: 'swe-resaro',
    name: 'RESARO',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-63',
    name: 'SWE-63',
    flag: 'SWE',
  },
  {
    id: 'swe-domsjo',
    name: 'DOMSJO',
    flag: 'SWE',
  },
  {
    id: 'swe-hallevik',
    name: 'HALLEVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-rindo',
    name: 'RINDO',
    flag: 'SWE',
  },
  {
    id: 'swe-bromma',
    name: 'BROMMA',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-151',
    name: 'SWE-151',
    flag: 'SWE',
  },
  {
    id: 'swe-donso',
    name: 'DONSO',
    flag: 'SWE',
  },
  {
    id: 'swe-glumslov',
    name: 'GLUMSLOV',
    flag: 'SWE',
  },
  {
    id: 'swe-ystad',
    name: 'YSTAD',
    flag: 'SWE',
  },
  {
    id: 'swe-alafors',
    name: 'ALAFORS',
    flag: 'SWE',
  },
  {
    id: 'swe-skarhamn',
    name: 'SKARHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-surte',
    name: 'SURTE',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-487',
    name: 'SWE-487',
    flag: 'SWE',
  },
  {
    id: 'swe-lidingo',
    name: 'LIDINGO',
    flag: 'SWE',
  },
  {
    id: 'swe-bua',
    name: 'BUA',
    flag: 'SWE',
  },
  {
    id: 'swe-saro',
    name: 'SARO',
    flag: 'SWE',
  },
  {
    id: 'swe-nykoping',
    name: 'NYKOPING',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-366',
    name: 'SWE-366',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-481',
    name: 'SWE-481',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-144',
    name: 'SWE-144',
    flag: 'SWE',
  },
  {
    id: 'swe-obbola',
    name: 'OBBOLA',
    flag: 'SWE',
  },
  {
    id: 'swe-rydeback',
    name: 'RYDEBACK',
    flag: 'SWE',
  },
  {
    id: 'swe-swe-135',
    name: 'SWE-135',
    flag: 'SWE',
  },
  {
    id: 'swe-strangnas',
    name: 'STRANGNAS',
    flag: 'SWE',
  },
  {
    id: 'swe-monsteras',
    name: 'MONSTERAS',
    flag: 'SWE',
  },
  {
    id: 'swe-kyrkbacken',
    name: 'KYRKBACKEN',
    flag: 'SWE',
  },
  {
    id: 'swe-valdemarsvik',
    name: 'VALDEMARSVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-vastrahagen',
    name: 'VASTRA HAGEN',
    flag: 'SWE',
  },
  {
    id: 'swe-slite',
    name: 'SLITE',
    flag: 'SWE',
  },
  {
    id: 'tur-golcukburnu',
    name: 'GOLCUK BURNU',
    flag: 'TUR',
  },
  {
    id: 'tur-derinceburnu',
    name: 'DERINCE BURNU',
    flag: 'TUR',
  },
  {
    id: 'tur-tur-212',
    name: 'TUR-212',
    flag: 'TUR',
  },
  {
    id: 'tur-iskenderun',
    name: 'ISKENDERUN',
    flag: 'TUR',
  },
  {
    id: 'tur-gebze',
    name: 'GEBZE',
    flag: 'TUR',
  },
  {
    id: 'tur-samsun',
    name: 'SAMSUN',
    flag: 'TUR',
  },
  {
    id: 'tur-surmene',
    name: 'SURMENE',
    flag: 'TUR',
  },
  {
    id: 'tur-hopa',
    name: 'HOPA',
    flag: 'TUR',
  },
  {
    id: 'tur-yarimca',
    name: 'YARIMCA',
    flag: 'TUR',
  },
  {
    id: 'tur-tur-108',
    name: 'TUR-108',
    flag: 'TUR',
  },
  {
    id: 'tur-yakacik',
    name: 'YAKACIK',
    flag: 'TUR',
  },
  {
    id: 'tur-tekirdag',
    name: 'TEKIRDAG',
    flag: 'TUR',
  },
  {
    id: 'tur-kizkalesi',
    name: 'KIZKALESI',
    flag: 'TUR',
  },
  {
    id: 'tur-enez',
    name: 'ENEZ',
    flag: 'TUR',
  },
  {
    id: 'tur-didim',
    name: 'DIDIM',
    flag: 'TUR',
  },
  {
    id: 'tur-gelibolu',
    name: 'GELIBOLU',
    flag: 'TUR',
  },
  {
    id: 'tur-datca',
    name: 'DATCA',
    flag: 'TUR',
  },
  {
    id: 'tur-tuzla',
    name: 'TUZLA',
    flag: 'TUR',
  },
  {
    id: 'tur-aliaga',
    name: 'ALIAGA',
    flag: 'TUR',
  },
  {
    id: 'tur-ambarli',
    name: 'AMBARLI',
    flag: 'TUR',
  },
  {
    id: 'tur-dardanelles',
    name: 'DARDANELLES',
    flag: 'TUR',
  },
  {
    id: 'tur-hereke',
    name: 'HEREKE',
    flag: 'TUR',
  },
  {
    id: 'tur-oren',
    name: 'OREN',
    flag: 'TUR',
  },
  {
    id: 'tur-sultankoy',
    name: 'SULTANKOY',
    flag: 'TUR',
  },
  {
    id: 'tur-bandirma',
    name: 'BANDIRMA',
    flag: 'TUR',
  },
  {
    id: 'tur-izmir',
    name: 'IZMIR',
    flag: 'TUR',
  },
  {
    id: 'tur-tur-77',
    name: 'TUR-77',
    flag: 'TUR',
  },
  {
    id: 'tur-tur-98',
    name: 'TUR-98',
    flag: 'TUR',
  },
  {
    id: 'tur-mersin',
    name: 'MERSIN',
    flag: 'TUR',
  },
  {
    id: 'tur-sigacik',
    name: 'SIGACIK',
    flag: 'TUR',
  },
  {
    id: 'tur-defterdarburnu',
    name: 'DEFTERDAR BURNU',
    flag: 'TUR',
  },
  {
    id: 'tur-torosgubre',
    name: 'TOROS GUBRE',
    flag: 'TUR',
  },
  {
    id: 'tur-arhavi',
    name: 'ARHAVI',
    flag: 'TUR',
  },
  {
    id: 'tur-yalova',
    name: 'YALOVA',
    flag: 'TUR',
  },
  {
    id: 'tur-arakli',
    name: 'ARAKLI',
    flag: 'TUR',
  },
  {
    id: 'tur-fatsa',
    name: 'FATSA',
    flag: 'TUR',
  },
  {
    id: 'tur-kumbag',
    name: 'KUMBAG',
    flag: 'TUR',
  },
  {
    id: 'tur-botas',
    name: 'BOTAS',
    flag: 'TUR',
  },
  {
    id: 'tur-adalar',
    name: 'ADALAR',
    flag: 'TUR',
  },
  {
    id: 'tur-sariyer',
    name: 'SARIYER',
    flag: 'TUR',
  },
  {
    id: 'tur-canakkale',
    name: 'CANAKKALE',
    flag: 'TUR',
  },
  {
    id: 'tur-bodrum',
    name: 'BODRUM',
    flag: 'TUR',
  },
  {
    id: 'tur-inebolu',
    name: 'INEBOLU',
    flag: 'TUR',
  },
  {
    id: 'tur-fethiye',
    name: 'FETHIYE',
    flag: 'TUR',
  },
  {
    id: 'tur-eregli',
    name: 'EREGLI',
    flag: 'TUR',
  },
  {
    id: 'tur-karatas',
    name: 'KARATAS',
    flag: 'TUR',
  },
  {
    id: 'tur-deltaterminal',
    name: 'DELTA TERMINAL',
    flag: 'TUR',
  },
  {
    id: 'tur-bozburun',
    name: 'BOZBURUN',
    flag: 'TUR',
  },
  {
    id: 'tur-ayvat',
    name: 'AYVAT',
    flag: 'TUR',
  },
  {
    id: 'tur-ondokuzmayis',
    name: 'ONDOKUZMAYIS',
    flag: 'TUR',
  },
  {
    id: 'tur-esenkoy',
    name: 'ESENKOY',
    flag: 'TUR',
  },
  {
    id: 'tur-eceabat',
    name: 'ECEABAT',
    flag: 'TUR',
  },
  {
    id: 'tur-kusadasi',
    name: 'KUSADASI',
    flag: 'TUR',
  },
  {
    id: 'tur-darica',
    name: 'DARICA',
    flag: 'TUR',
  },
  {
    id: 'tur-gocek',
    name: 'GOCEK',
    flag: 'TUR',
  },
  {
    id: 'tur-tur-60',
    name: 'TUR-60',
    flag: 'TUR',
  },
  {
    id: 'tur-nemrutlimanibay',
    name: 'NEMRUT LIMANI BAY',
    flag: 'TUR',
  },
  {
    id: 'tur-karasu',
    name: 'KARASU',
    flag: 'TUR',
  },
  {
    id: 'tur-rumelifeneri',
    name: 'RUMELIFENERI',
    flag: 'TUR',
  },
  {
    id: 'tur-kaytazdere',
    name: 'KAYTAZDERE',
    flag: 'TUR',
  },
  {
    id: 'tur-alanya',
    name: 'ALANYA',
    flag: 'TUR',
  },
  {
    id: 'tur-tur-84',
    name: 'TUR-84',
    flag: 'TUR',
  },
  {
    id: 'tur-marmaris',
    name: 'MARMARIS',
    flag: 'TUR',
  },
  {
    id: 'tur-istanbul',
    name: 'ISTANBUL',
    flag: 'TUR',
  },
  {
    id: 'tur-kas',
    name: 'KAS',
    flag: 'TUR',
  },
  {
    id: 'tur-yomra',
    name: 'YOMRA',
    flag: 'TUR',
  },
  {
    id: 'tur-karabiga',
    name: 'KARABIGA',
    flag: 'TUR',
  },
  {
    id: 'tur-adalan',
    name: 'ADALAN',
    flag: 'TUR',
  },
  {
    id: 'tur-botasdortyoloilterminal',
    name: 'BOTAS DORTYOL OIL TERMINAL',
    flag: 'TUR',
  },
  {
    id: 'tur-kinali',
    name: 'KINALI',
    flag: 'TUR',
  },
  {
    id: 'tur-alapli',
    name: 'ALAPLI',
    flag: 'TUR',
  },
  {
    id: 'tur-tur-171',
    name: 'TUR-171',
    flag: 'TUR',
  },
  {
    id: 'tur-unye',
    name: 'UNYE',
    flag: 'TUR',
  },
  {
    id: 'tur-alacati',
    name: 'ALACATI',
    flag: 'TUR',
  },
  {
    id: 'tur-antalyaoffshoreterminal',
    name: 'ANTALYA OFFSHORE TERMINAL',
    flag: 'TUR',
  },
  {
    id: 'tur-kalkan',
    name: 'KALKAN',
    flag: 'TUR',
  },
  {
    id: 'tur-tur-219',
    name: 'TUR-219',
    flag: 'TUR',
  },
  {
    id: 'tur-kemer',
    name: 'KEMER',
    flag: 'TUR',
  },
  {
    id: 'tur-ulasli',
    name: 'ULASLI',
    flag: 'TUR',
  },
  {
    id: 'tur-marmara',
    name: 'MARMARA',
    flag: 'TUR',
  },
  {
    id: 'tur-dikili',
    name: 'DIKILI',
    flag: 'TUR',
  },
  {
    id: 'tur-ozdere',
    name: 'OZDERE',
    flag: 'TUR',
  },
  {
    id: 'tur-kababurnu',
    name: 'KABA BURNU',
    flag: 'TUR',
  },
  {
    id: 'tur-yenifoca',
    name: 'YENIFOCA',
    flag: 'TUR',
  },
  {
    id: 'tur-botasnaturalgasterminal',
    name: 'BOTAS NATURAL GAS TERMINAL',
    flag: 'TUR',
  },
  {
    id: 'tur-portocenevizkoyu',
    name: 'PORTO CENEVIZ KOYU',
    flag: 'TUR',
  },
  {
    id: 'tur-silivri',
    name: 'SILIVRI',
    flag: 'TUR',
  },
  {
    id: 'tur-bozyazi',
    name: 'BOZYAZI',
    flag: 'TUR',
  },
  {
    id: 'tur-halidere',
    name: 'HALIDERE',
    flag: 'TUR',
  },
  {
    id: 'tur-sinop',
    name: 'SINOP',
    flag: 'TUR',
  },
  {
    id: 'tur-bayrakli',
    name: 'BAYRAKLI',
    flag: 'TUR',
  },
  {
    id: 'tur-trabzon',
    name: 'TRABZON',
    flag: 'TUR',
  },
  {
    id: 'tur-erdemli',
    name: 'ERDEMLI',
    flag: 'TUR',
  },
  {
    id: 'tur-golcuk',
    name: 'GOLCUK',
    flag: 'TUR',
  },
  {
    id: 'tur-antalya',
    name: 'ANTALYA',
    flag: 'TUR',
  },
  {
    id: 'tur-finike',
    name: 'FINIKE',
    flag: 'TUR',
  },
  {
    id: 'tur-sile',
    name: 'SILE',
    flag: 'TUR',
  },
  {
    id: 'tur-ortyakentyahsi',
    name: 'ORTYAKENT YAHSI',
    flag: 'TUR',
  },
  {
    id: 'tur-cinarcik',
    name: 'CINARCIK',
    flag: 'TUR',
  },
  {
    id: 'tur-borusanfertilizerjetty',
    name: 'BORUSAN FERTILIZER JETTY',
    flag: 'TUR',
  },
  {
    id: 'tur-babakale',
    name: 'BABAKALE',
    flag: 'TUR',
  },
  {
    id: 'tur-cesme',
    name: 'CESME',
    flag: 'TUR',
  },
  {
    id: 'tur-gemlik',
    name: 'GEMLIK',
    flag: 'TUR',
  },
  {
    id: 'tur-yakakent',
    name: 'YAKAKENT',
    flag: 'TUR',
  },
  {
    id: 'tur-yalikavak',
    name: 'YALIKAVAK',
    flag: 'TUR',
  },
  {
    id: 'tur-haydarpasa',
    name: 'HAYDARPASA',
    flag: 'TUR',
  },
  {
    id: 'tur-gulluk',
    name: 'GULLUK',
    flag: 'TUR',
  },
  {
    id: 'tur-tur-135',
    name: 'TUR-135',
    flag: 'TUR',
  },
  {
    id: 'tur-foca',
    name: 'FOCA',
    flag: 'TUR',
  },
  {
    id: 'tur-of',
    name: 'OF',
    flag: 'TUR',
  },
  {
    id: 'tur-dardanellesanchorage',
    name: 'DARDANELLES ANCHORAGE',
    flag: 'TUR',
  },
  {
    id: 'tur-sarkoy',
    name: 'SARKOY',
    flag: 'TUR',
  },
  {
    id: 'tur-mudanya',
    name: 'MUDANYA',
    flag: 'TUR',
  },
  {
    id: 'tur-yeniliman',
    name: 'YENILIMAN',
    flag: 'TUR',
  },
  {
    id: 'tur-kilimli',
    name: 'KILIMLI',
    flag: 'TUR',
  },
  {
    id: 'tur-gerze',
    name: 'GERZE',
    flag: 'TUR',
  },
  {
    id: 'tur-bartin',
    name: 'BARTIN',
    flag: 'TUR',
  },
  {
    id: 'tur-igneada',
    name: 'IGNEADA',
    flag: 'TUR',
  },
  {
    id: 'tur-izmit',
    name: 'IZMIT',
    flag: 'TUR',
  },
  {
    id: 'tur-rize',
    name: 'RIZE',
    flag: 'TUR',
  },
  {
    id: 'tur-zonguldak',
    name: 'ZONGULDAK',
    flag: 'TUR',
  },
  {
    id: 'tur-gundogdu',
    name: 'GUNDOGDU',
    flag: 'TUR',
  },
  {
    id: 'tur-erdek',
    name: 'ERDEK',
    flag: 'TUR',
  },
  {
    id: 'tur-giresun',
    name: 'GIRESUN',
    flag: 'TUR',
  },
  {
    id: 'tur-oludeniz',
    name: 'OLUDENIZ',
    flag: 'TUR',
  },
  {
    id: 'tur-akuagroupertunafarm',
    name: 'AKUA GROUPER TUNA FARM',
    flag: 'TUR',
  },
  {
    id: 'tur-korfez',
    name: 'KORFEZ',
    flag: 'TUR',
  },
  {
    id: 'tur-amasra',
    name: 'AMASRA',
    flag: 'TUR',
  },
  {
    id: 'tur-degirmendere',
    name: 'DEGIRMENDERE',
    flag: 'TUR',
  },
  {
    id: 'tur-gurpinar',
    name: 'GURPINAR',
    flag: 'TUR',
  },
  {
    id: 'tur-tekirova',
    name: 'TEKIROVA',
    flag: 'TUR',
  },
  {
    id: 'tur-toplu',
    name: 'TOPLU',
    flag: 'TUR',
  },
  {
    id: 'tur-tur-129',
    name: 'TUR-129',
    flag: 'TUR',
  },
  {
    id: 'tur-tur-17',
    name: 'TUR-17',
    flag: 'TUR',
  },
  {
    id: 'tur-tur-83',
    name: 'TUR-83',
    flag: 'TUR',
  },
  {
    id: 'tur-tasucu',
    name: 'TASUCU',
    flag: 'TUR',
  },
  {
    id: 'tur-guzelbahce',
    name: 'GUZELBAHCE',
    flag: 'TUR',
  },
  {
    id: 'tur-yesilovacik',
    name: 'YESILOVACIK',
    flag: 'TUR',
  },
  {
    id: 'tur-ayvalik',
    name: 'AYVALIK',
    flag: 'TUR',
  },
  {
    id: 'ukr-balaklavskyi',
    name: 'BALAKLAVSKYI',
    flag: 'UKR',
  },
  {
    id: 'ukr-malokakhovka',
    name: 'MALOKAKHOVKA',
    flag: 'UKR',
  },
  {
    id: 'ukr-ochakiv',
    name: 'OCHAKIV',
    flag: 'UKR',
  },
  {
    id: 'ukr-portoktyabrsk',
    name: 'PORT OKTYABRSK',
    flag: 'UKR',
  },
  {
    id: 'ukr-vylkove',
    name: 'VYLKOVE',
    flag: 'UKR',
  },
  {
    id: 'ukr-kryzhanivka',
    name: 'KRYZHANIVKA',
    flag: 'UKR',
  },
  {
    id: 'ukr-odessa',
    name: 'ODESSA',
    flag: 'UKR',
  },
  {
    id: 'ukr-sevastopol',
    name: 'SEVASTOPOL',
    flag: 'UKR',
  },
  {
    id: 'ukr-dnipryany',
    name: 'DNIPRYANY',
    flag: 'UKR',
  },
  {
    id: 'ukr-reni',
    name: 'RENI',
    flag: 'UKR',
  },
  {
    id: 'ukr-zatoka',
    name: 'ZATOKA',
    flag: 'UKR',
  },
  {
    id: 'ukr-beryslav',
    name: 'BERYSLAV',
    flag: 'UKR',
  },
  {
    id: 'ukr-yuzhnyy',
    name: 'YUZHNYY',
    flag: 'UKR',
  },
  {
    id: 'ukr-illichivsk',
    name: 'ILLICHIVSK',
    flag: 'UKR',
  },
  {
    id: 'ukr-novakakhovka',
    name: 'NOVA KAKHOVKA',
    flag: 'UKR',
  },
  {
    id: 'ukr-partenit',
    name: 'PARTENIT',
    flag: 'UKR',
  },
  {
    id: 'ukr-mariupol',
    name: 'MARIUPOL',
    flag: 'UKR',
  },
  {
    id: 'ukr-rybakivka',
    name: 'RYBAKIVKA',
    flag: 'UKR',
  },
  {
    id: 'ukr-kiliya',
    name: 'KILIYA',
    flag: 'UKR',
  },
  {
    id: 'ukr-berdyansk',
    name: 'BERDYANSK',
    flag: 'UKR',
  },
  {
    id: 'ukr-odesa',
    name: 'ODESA',
    flag: 'UKR',
  },
  {
    id: 'ukr-chelyadinovo',
    name: 'CHELYADINOVO',
    flag: 'UKR',
  },
  {
    id: 'ukr-izmayil',
    name: 'IZMAYIL',
    flag: 'UKR',
  },
  {
    id: 'ukr-kherson',
    name: 'KHERSON',
    flag: 'UKR',
  },
  {
    id: 'ukr-mykolayiv',
    name: 'MYKOLAYIV',
    flag: 'UKR',
  },
  {
    id: 'ukr-yalta',
    name: 'YALTA',
    flag: 'UKR',
  },
  {
    id: 'ukr-broska',
    name: 'BROSKA',
    flag: 'UKR',
  },
  {
    id: 'ukr-sudak',
    name: 'SUDAK',
    flag: 'UKR',
  },
  {
    id: 'ukr-kerch',
    name: 'KERCH',
    flag: 'UKR',
  },
  {
    id: 'ukr-yuzhny',
    name: 'YUZHNY',
    flag: 'UKR',
  },
  {
    id: "ukr-skadovs'k",
    name: "SKADOVS'K",
    flag: 'UKR',
  },
  {
    id: 'ukr-beregovoye',
    name: 'BEREGOVOYE',
    flag: 'UKR',
  },
  {
    id: 'ukr-feodosiya',
    name: 'FEODOSIYA',
    flag: 'UKR',
  },
  {
    id: 'ukr-inkerman',
    name: 'INKERMAN',
    flag: 'UKR',
  },
  {
    id: 'ukr-oleksandrivka',
    name: 'OLEKSANDRIVKA',
    flag: 'UKR',
  },
  {
    id: 'ukr-zavetnoye',
    name: 'ZAVETNOYE',
    flag: 'UKR',
  },
  {
    id: 'ukr-hornostayivka',
    name: 'HORNOSTAYIVKA',
    flag: 'UKR',
  },
  {
    id: 'ukr-dnipro-buzkyy',
    name: 'DNIPRO-BUZKYY',
    flag: 'UKR',
  },
  {
    id: 'ukr-belgorod-dnestrovsky',
    name: 'BELGOROD-DNESTROVSKY',
    flag: 'UKR',
  },
  {
    id: 'ukr-tayirove',
    name: 'TAYIROVE',
    flag: 'UKR',
  },
  {
    id: "ukr-holaprystan'",
    name: "HOLA PRYSTAN'",
    flag: 'UKR',
  },
  {
    id: 'ukr-yevpatoriya',
    name: 'YEVPATORIYA',
    flag: 'UKR',
  },
  {
    id: 'ukr-ukr-67',
    name: 'UKR-67',
    flag: 'UKR',
  },
  {
    id: 'ukr-ukr-109',
    name: 'UKR-109',
    flag: 'UKR',
  },
  {
    id: 'ukr-zaporizhia',
    name: 'ZAPORIZHIA',
    flag: 'UKR',
  },
  {
    id: 'usa-hyannis',
    name: 'HYANNIS',
    flag: 'USA',
  },
  {
    id: 'usa-portinland',
    name: 'PORT INLAND',
    flag: 'USA',
  },
  {
    id: 'usa-castine',
    name: 'CASTINE',
    flag: 'USA',
  },
  {
    id: 'usa-cherrypoint',
    name: 'CHERRY POINT',
    flag: 'USA',
  },
  {
    id: 'usa-tybeeisland',
    name: 'TYBEE ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1207',
    name: 'USA-1207',
    flag: 'USA',
  },
  {
    id: 'usa-plaquemine',
    name: 'PLAQUEMINE',
    flag: 'USA',
  },
  {
    id: 'usa-jupiter',
    name: 'JUPITER',
    flag: 'USA',
  },
  {
    id: 'usa-portoconnor',
    name: 'PORT OCONNOR',
    flag: 'USA',
  },
  {
    id: 'usa-usa-747',
    name: 'USA-747',
    flag: 'USA',
  },
  {
    id: 'usa-poydras',
    name: 'POYDRAS',
    flag: 'USA',
  },
  {
    id: 'usa-pittsburg',
    name: 'PITTSBURG',
    flag: 'USA',
  },
  {
    id: 'usa-coupeville',
    name: 'COUPEVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-bridgecity',
    name: 'BRIDGE CITY',
    flag: 'USA',
  },
  {
    id: 'usa-knightisland',
    name: 'KNIGHT ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-alton',
    name: 'ALTON',
    flag: 'USA',
  },
  {
    id: 'usa-harborsprings',
    name: 'HARBOR SPRINGS',
    flag: 'USA',
  },
  {
    id: 'usa-stonington',
    name: 'STONINGTON',
    flag: 'USA',
  },
  {
    id: 'usa-fortlauderdale',
    name: 'FORT LAUDERDALE',
    flag: 'USA',
  },
  {
    id: 'usa-hollywood',
    name: 'HOLLYWOOD',
    flag: 'USA',
  },
  {
    id: 'usa-beaufort',
    name: 'BEAUFORT',
    flag: 'USA',
  },
  {
    id: 'usa-escanaba',
    name: 'ESCANABA',
    flag: 'USA',
  },
  {
    id: 'usa-margatecity',
    name: 'MARGATE CITY',
    flag: 'USA',
  },
  {
    id: 'usa-osterville',
    name: 'OSTERVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-aberdeen',
    name: 'ABERDEEN',
    flag: 'USA',
  },
  {
    id: 'usa-bucksport',
    name: 'BUCKSPORT',
    flag: 'USA',
  },
  {
    id: 'usa-deerfieldbeach',
    name: 'DEERFIELD BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-bozman',
    name: 'BOZMAN',
    flag: 'USA',
  },
  {
    id: 'usa-hiltonheadisland',
    name: 'HILTON HEAD ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-burg',
    name: 'BURG',
    flag: 'USA',
  },
  {
    id: 'usa-woodshole',
    name: 'WOODS HOLE',
    flag: 'USA',
  },
  {
    id: 'usa-marblehead',
    name: 'MARBLEHEAD',
    flag: 'USA',
  },
  {
    id: 'usa-eastbremerton',
    name: 'EAST BREMERTON',
    flag: 'USA',
  },
  {
    id: 'usa-lazybay',
    name: 'LAZY BAY',
    flag: 'USA',
  },
  {
    id: 'usa-elfincove',
    name: 'ELFIN COVE',
    flag: 'USA',
  },
  {
    id: 'usa-conneaut',
    name: 'CONNEAUT',
    flag: 'USA',
  },
  {
    id: 'usa-reedsport',
    name: 'REEDSPORT',
    flag: 'USA',
  },
  {
    id: 'usa-carville',
    name: 'CARVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-yorktown',
    name: 'YORKTOWN',
    flag: 'USA',
  },
  {
    id: 'usa-longbeach',
    name: 'LONG BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-cairo',
    name: 'CAIRO',
    flag: 'USA',
  },
  {
    id: 'usa-sabine',
    name: 'SABINE',
    flag: 'USA',
  },
  {
    id: 'usa-porthueneme',
    name: 'PORT HUENEME',
    flag: 'USA',
  },
  {
    id: 'usa-kaunakakai',
    name: 'KAUNAKAKAI',
    flag: 'USA',
  },
  {
    id: 'usa-shadyside',
    name: 'SHADY SIDE',
    flag: 'USA',
  },
  {
    id: 'usa-batonrouge',
    name: 'BATON ROUGE',
    flag: 'USA',
  },
  {
    id: 'usa-vevay',
    name: 'VEVAY',
    flag: 'USA',
  },
  {
    id: 'usa-baranof',
    name: 'BARANOF',
    flag: 'USA',
  },
  {
    id: 'usa-portwentworth',
    name: 'PORT WENTWORTH',
    flag: 'USA',
  },
  {
    id: 'usa-meredosia',
    name: 'MEREDOSIA',
    flag: 'USA',
  },
  {
    id: 'usa-porterie',
    name: 'PORT ERIE',
    flag: 'USA',
  },
  {
    id: 'usa-surfcity',
    name: 'SURF CITY',
    flag: 'USA',
  },
  {
    id: 'usa-cahokia',
    name: 'CAHOKIA',
    flag: 'USA',
  },
  {
    id: 'usa-buffalo',
    name: 'BUFFALO',
    flag: 'USA',
  },
  {
    id: 'usa-catlettsburg',
    name: 'CATLETTSBURG',
    flag: 'USA',
  },
  {
    id: 'usa-gretna',
    name: 'GRETNA',
    flag: 'USA',
  },
  {
    id: 'usa-franklinfurnace',
    name: 'FRANKLIN FURNACE',
    flag: 'USA',
  },
  {
    id: 'usa-princetown',
    name: 'PRINCETOWN',
    flag: 'USA',
  },
  {
    id: 'usa-usa-646',
    name: 'USA-646',
    flag: 'USA',
  },
  {
    id: 'usa-calvertcity',
    name: 'CALVERT CITY',
    flag: 'USA',
  },
  {
    id: 'usa-mattapoisett',
    name: 'MATTAPOISETT',
    flag: 'USA',
  },
  {
    id: 'usa-gandy',
    name: 'GANDY',
    flag: 'USA',
  },
  {
    id: 'usa-jacksonville',
    name: 'JACKSONVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-countryclub',
    name: 'COUNTRY CLUB',
    flag: 'USA',
  },
  {
    id: 'usa-vidalia',
    name: 'VIDALIA',
    flag: 'USA',
  },
  {
    id: 'usa-kodiak',
    name: 'KODIAK',
    flag: 'USA',
  },
  {
    id: 'usa-washingtond.c.',
    name: 'WASHINGTON D.C.',
    flag: 'USA',
  },
  {
    id: 'usa-calcite',
    name: 'CALCITE',
    flag: 'USA',
  },
  {
    id: 'usa-hull',
    name: 'HULL',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1547',
    name: 'USA-1547',
    flag: 'USA',
  },
  {
    id: 'usa-tampa',
    name: 'TAMPA',
    flag: 'USA',
  },
  {
    id: 'usa-lakeshore',
    name: 'LAKE SHORE',
    flag: 'USA',
  },
  {
    id: 'usa-sleepybay',
    name: 'SLEEPY BAY',
    flag: 'USA',
  },
  {
    id: 'usa-harbor',
    name: 'HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-atka',
    name: 'ATKA',
    flag: 'USA',
  },
  {
    id: 'usa-oakland',
    name: 'OAKLAND',
    flag: 'USA',
  },
  {
    id: 'usa-beaumont',
    name: 'BEAUMONT',
    flag: 'USA',
  },
  {
    id: 'usa-southboston',
    name: 'SOUTH BOSTON',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1202',
    name: 'USA-1202',
    flag: 'USA',
  },
  {
    id: 'usa-reedville',
    name: 'REEDVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-seabreeze',
    name: 'SEA BREEZE',
    flag: 'USA',
  },
  {
    id: 'usa-boulevardpark',
    name: 'BOULEVARD PARK',
    flag: 'USA',
  },
  {
    id: 'usa-bellingham',
    name: 'BELLINGHAM',
    flag: 'USA',
  },
  {
    id: 'usa-easthamptonnorth',
    name: 'EAST HAMPTON NORTH',
    flag: 'USA',
  },
  {
    id: 'usa-seward',
    name: 'SEWARD',
    flag: 'USA',
  },
  {
    id: 'usa-marion',
    name: 'MARION',
    flag: 'USA',
  },
  {
    id: 'usa-amelia',
    name: 'AMELIA',
    flag: 'USA',
  },
  {
    id: 'usa-newyorkcity',
    name: 'NEW YORK CITY',
    flag: 'USA',
  },
  {
    id: 'usa-santarosais',
    name: 'SANTA ROSA IS',
    flag: 'USA',
  },
  {
    id: 'usa-estherisland',
    name: 'ESTHER ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-hyannisport',
    name: 'HYANNIS PORT',
    flag: 'USA',
  },
  {
    id: 'usa-westpalmbeach',
    name: 'WEST PALM BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-elizabethcity',
    name: 'ELIZABETH CITY',
    flag: 'USA',
  },
  {
    id: 'usa-evansville',
    name: 'EVANSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-499',
    name: 'USA-499',
    flag: 'USA',
  },
  {
    id: 'usa-swansisland',
    name: 'SWANS ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-cambridge',
    name: 'CAMBRIDGE',
    flag: 'USA',
  },
  {
    id: 'usa-titusville',
    name: 'TITUSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-delawarecity',
    name: 'DELAWARE CITY',
    flag: 'USA',
  },
  {
    id: 'usa-bodegabay',
    name: 'BODEGA BAY',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1930',
    name: 'USA-1930',
    flag: 'USA',
  },
  {
    id: 'usa-brooklin',
    name: 'BROOKLIN',
    flag: 'USA',
  },
  {
    id: 'usa-chelsea',
    name: 'CHELSEA',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1551',
    name: 'USA-1551',
    flag: 'USA',
  },
  {
    id: 'usa-wildwood',
    name: 'WILDWOOD',
    flag: 'USA',
  },
  {
    id: 'usa-seabrookisland',
    name: 'SEABROOK ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-ventura',
    name: 'VENTURA',
    flag: 'USA',
  },
  {
    id: 'usa-allapattah',
    name: 'ALLAPATTAH',
    flag: 'USA',
  },
  {
    id: 'usa-sanpedro',
    name: 'SAN PEDRO',
    flag: 'USA',
  },
  {
    id: 'usa-hawkinlet',
    name: 'HAWK INLET',
    flag: 'USA',
  },
  {
    id: 'usa-warwick',
    name: 'WARWICK',
    flag: 'USA',
  },
  {
    id: 'usa-detroit',
    name: 'DETROIT',
    flag: 'USA',
  },
  {
    id: 'usa-westhaven',
    name: 'WEST HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-sanrafael',
    name: 'SAN RAFAEL',
    flag: 'USA',
  },
  {
    id: 'usa-cleveland',
    name: 'CLEVELAND',
    flag: 'USA',
  },
  {
    id: 'usa-danapoint',
    name: 'DANA POINT',
    flag: 'USA',
  },
  {
    id: 'usa-nushagakbay',
    name: 'NUSHAGAK BAY',
    flag: 'USA',
  },
  {
    id: 'usa-baralofbay',
    name: 'BARALOF BAY',
    flag: 'USA',
  },
  {
    id: 'usa-dutchboatyard',
    name: 'DUTCH BOAT YARD',
    flag: 'USA',
  },
  {
    id: 'usa-northlacrosse',
    name: 'NORTH LA CROSSE',
    flag: 'USA',
  },
  {
    id: 'usa-lighthousepoint',
    name: 'LIGHTHOUSE POINT',
    flag: 'USA',
  },
  {
    id: 'usa-sandusky',
    name: 'SANDUSKY',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1293',
    name: 'USA-1293',
    flag: 'USA',
  },
  {
    id: 'usa-alameda',
    name: 'ALAMEDA',
    flag: 'USA',
  },
  {
    id: 'usa-blisscorner',
    name: 'BLISS CORNER',
    flag: 'USA',
  },
  {
    id: 'usa-chicago',
    name: 'CHICAGO',
    flag: 'USA',
  },
  {
    id: 'usa-kovichakbay',
    name: 'KOVICHAK BAY',
    flag: 'USA',
  },
  {
    id: 'usa-paducah',
    name: 'PADUCAH',
    flag: 'USA',
  },
  {
    id: 'usa-northbellevernon',
    name: 'NORTH BELLE VERNON',
    flag: 'USA',
  },
  {
    id: 'usa-oleum',
    name: 'OLEUM',
    flag: 'USA',
  },
  {
    id: 'usa-lewes',
    name: 'LEWES',
    flag: 'USA',
  },
  {
    id: 'usa-santacruz',
    name: 'SANTA CRUZ',
    flag: 'USA',
  },
  {
    id: 'usa-noank',
    name: 'NOANK',
    flag: 'USA',
  },
  {
    id: 'usa-thunderbolt',
    name: 'THUNDERBOLT',
    flag: 'USA',
  },
  {
    id: 'usa-northhavenisland',
    name: 'NORTH HAVEN ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-kenner',
    name: 'KENNER',
    flag: 'USA',
  },
  {
    id: 'usa-marioncenter',
    name: 'MARION CENTER',
    flag: 'USA',
  },
  {
    id: 'usa-tierraverde',
    name: 'TIERRA VERDE',
    flag: 'USA',
  },
  {
    id: 'usa-abbeville',
    name: 'ABBEVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1223',
    name: 'USA-1223',
    flag: 'USA',
  },
  {
    id: 'usa-cordova',
    name: 'CORDOVA',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1886',
    name: 'USA-1886',
    flag: 'USA',
  },
  {
    id: 'usa-portangeles',
    name: 'PORT ANGELES',
    flag: 'USA',
  },
  {
    id: 'usa-haymarkterminal',
    name: 'HAYMARK TERMINAL',
    flag: 'USA',
  },
  {
    id: 'usa-paulina',
    name: 'PAULINA',
    flag: 'USA',
  },
  {
    id: 'usa-oakpark',
    name: 'OAK PARK',
    flag: 'USA',
  },
  {
    id: 'usa-osceola',
    name: 'OSCEOLA',
    flag: 'USA',
  },
  {
    id: 'usa-pointreyes',
    name: 'POINT REYES',
    flag: 'USA',
  },
  {
    id: 'usa-biscaynepark',
    name: 'BISCAYNE PARK',
    flag: 'USA',
  },
  {
    id: 'usa-usa-603',
    name: 'USA-603',
    flag: 'USA',
  },
  {
    id: 'usa-brisbane',
    name: 'BRISBANE',
    flag: 'USA',
  },
  {
    id: 'usa-anacortes',
    name: 'ANACORTES',
    flag: 'USA',
  },
  {
    id: 'usa-montz',
    name: 'MONTZ',
    flag: 'USA',
  },
  {
    id: 'usa-dulac',
    name: 'DULAC',
    flag: 'USA',
  },
  {
    id: 'usa-portsulphur',
    name: 'PORT SULPHUR',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1852',
    name: 'USA-1852',
    flag: 'USA',
  },
  {
    id: 'usa-pascagoula',
    name: 'PASCAGOULA',
    flag: 'USA',
  },
  {
    id: 'usa-westbradenton',
    name: 'WEST BRADENTON',
    flag: 'USA',
  },
  {
    id: 'usa-morgancity',
    name: 'MORGAN CITY',
    flag: 'USA',
  },
  {
    id: 'usa-newport',
    name: 'NEWPORT',
    flag: 'USA',
  },
  {
    id: 'usa-capitola',
    name: 'CAPITOLA',
    flag: 'USA',
  },
  {
    id: 'usa-pointrichmond',
    name: 'POINT RICHMOND',
    flag: 'USA',
  },
  {
    id: 'usa-portneches',
    name: 'PORT NECHES',
    flag: 'USA',
  },
  {
    id: 'usa-grandisle',
    name: 'GRAND ISLE',
    flag: 'USA',
  },
  {
    id: 'usa-portorchard',
    name: 'PORT ORCHARD',
    flag: 'USA',
  },
  {
    id: 'usa-provincetown',
    name: 'PROVINCETOWN',
    flag: 'USA',
  },
  {
    id: 'usa-grandmarais',
    name: 'GRAND MARAIS',
    flag: 'USA',
  },
  {
    id: 'usa-southpatrickshores',
    name: 'SOUTH PATRICK SHORES',
    flag: 'USA',
  },
  {
    id: 'usa-ojus',
    name: 'OJUS',
    flag: 'USA',
  },
  {
    id: 'usa-follansbee',
    name: 'FOLLANSBEE',
    flag: 'USA',
  },
  {
    id: 'usa-ohioville',
    name: 'OHIOVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-mayersville',
    name: 'MAYERSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-portsmouth',
    name: 'PORTSMOUTH',
    flag: 'USA',
  },
  {
    id: 'usa-empire',
    name: 'EMPIRE',
    flag: 'USA',
  },
  {
    id: 'usa-mountdesert',
    name: 'MOUNT DESERT',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1141',
    name: 'USA-1141',
    flag: 'USA',
  },
  {
    id: 'usa-anchorage',
    name: 'ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-peoriaheights',
    name: 'PEORIA HEIGHTS',
    flag: 'USA',
  },
  {
    id: 'usa-ingleside',
    name: 'INGLESIDE',
    flag: 'USA',
  },
  {
    id: 'usa-fortpierce',
    name: 'FORT PIERCE',
    flag: 'USA',
  },
  {
    id: 'usa-honolulu',
    name: 'HONOLULU',
    flag: 'USA',
  },
  {
    id: 'usa-pointsanpablo',
    name: 'POINT SAN PABLO',
    flag: 'USA',
  },
  {
    id: 'usa-littleriver',
    name: 'LITTLE RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-johnsonville',
    name: 'JOHNSONVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-thomaston',
    name: 'THOMASTON',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1524',
    name: 'USA-1524',
    flag: 'USA',
  },
  {
    id: 'usa-brunswick',
    name: 'BRUNSWICK',
    flag: 'USA',
  },
  {
    id: 'usa-baysaintlouis',
    name: 'BAY SAINT LOUIS',
    flag: 'USA',
  },
  {
    id: 'usa-stcharlesclub',
    name: 'ST CHARLES CLUB',
    flag: 'USA',
  },
  {
    id: 'usa-wrightsville',
    name: 'WRIGHTSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-coconutgrove',
    name: 'COCONUT GROVE',
    flag: 'USA',
  },
  {
    id: 'usa-annapolis',
    name: 'ANNAPOLIS',
    flag: 'USA',
  },
  {
    id: 'usa-calumetharbor',
    name: 'CALUMET HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-stevensville',
    name: 'STEVENSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-excursioninlet',
    name: 'EXCURSION INLET',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1420',
    name: 'USA-1420',
    flag: 'USA',
  },
  {
    id: 'usa-coalpoint',
    name: 'COAL POINT',
    flag: 'USA',
  },
  {
    id: 'usa-wickfordcove',
    name: 'WICKFORD COVE',
    flag: 'USA',
  },
  {
    id: 'usa-southhaven',
    name: 'SOUTH HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-havana',
    name: 'HAVANA',
    flag: 'USA',
  },
  {
    id: 'usa-dillingham',
    name: 'DILLINGHAM',
    flag: 'USA',
  },
  {
    id: 'usa-maurer',
    name: 'MAURER',
    flag: 'USA',
  },
  {
    id: 'usa-camden',
    name: 'CAMDEN',
    flag: 'USA',
  },
  {
    id: 'usa-hiltonhead',
    name: 'HILTON HEAD',
    flag: 'USA',
  },
  {
    id: 'usa-whitecenter',
    name: 'WHITE CENTER',
    flag: 'USA',
  },
  {
    id: 'usa-balharbour',
    name: 'BAL HARBOUR',
    flag: 'USA',
  },
  {
    id: 'usa-kitoibay',
    name: 'KITOI BAY',
    flag: 'USA',
  },
  {
    id: 'usa-chickasaw',
    name: 'CHICKASAW',
    flag: 'USA',
  },
  {
    id: 'usa-dauphinisland',
    name: 'DAUPHIN ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-flaglerbeach',
    name: 'FLAGLER BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-staugustine',
    name: 'ST AUGUSTINE',
    flag: 'USA',
  },
  {
    id: 'usa-strose',
    name: 'ST ROSE',
    flag: 'USA',
  },
  {
    id: 'usa-womensbay',
    name: 'WOMENS BAY',
    flag: 'USA',
  },
  {
    id: 'usa-barataria',
    name: 'BARATARIA',
    flag: 'USA',
  },
  {
    id: 'usa-romeoville',
    name: 'ROMEOVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-portsalerno',
    name: 'PORT SALERNO',
    flag: 'USA',
  },
  {
    id: 'usa-hallandalebeach',
    name: 'HALLANDALE BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-grasselli',
    name: 'GRASSELLI',
    flag: 'USA',
  },
  {
    id: 'usa-southamboy',
    name: 'SOUTH AMBOY',
    flag: 'USA',
  },
  {
    id: 'usa-bradenton',
    name: 'BRADENTON',
    flag: 'USA',
  },
  {
    id: 'usa-chatham',
    name: 'CHATHAM',
    flag: 'USA',
  },
  {
    id: 'usa-duckbay',
    name: 'DUCK BAY',
    flag: 'USA',
  },
  {
    id: 'usa-joliet',
    name: 'JOLIET',
    flag: 'USA',
  },
  {
    id: 'usa-baytown',
    name: 'BAYTOWN',
    flag: 'USA',
  },
  {
    id: 'usa-avalon',
    name: 'AVALON',
    flag: 'USA',
  },
  {
    id: 'usa-newburgh',
    name: 'NEWBURGH',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1256',
    name: 'USA-1256',
    flag: 'USA',
  },
  {
    id: 'usa-corpuschristi',
    name: 'CORPUS CHRISTI',
    flag: 'USA',
  },
  {
    id: 'usa-countryclubestates',
    name: 'COUNTRY CLUB ESTATES',
    flag: 'USA',
  },
  {
    id: 'usa-pointroberts',
    name: 'POINT ROBERTS',
    flag: 'USA',
  },
  {
    id: 'usa-usa-951',
    name: 'USA-951',
    flag: 'USA',
  },
  {
    id: 'usa-sunsetbeach',
    name: 'SUNSET BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-sarasota',
    name: 'SARASOTA',
    flag: 'USA',
  },
  {
    id: 'usa-moundcity',
    name: 'MOUND CITY',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1364',
    name: 'USA-1364',
    flag: 'USA',
  },
  {
    id: 'usa-atlanticcity',
    name: 'ATLANTIC CITY',
    flag: 'USA',
  },
  {
    id: 'usa-superior',
    name: 'SUPERIOR',
    flag: 'USA',
  },
  {
    id: 'usa-seattle',
    name: 'SEATTLE',
    flag: 'USA',
  },
  {
    id: 'usa-miamibeach',
    name: 'MIAMI BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-northcharleston',
    name: 'NORTH CHARLESTON',
    flag: 'USA',
  },
  {
    id: 'usa-watchhill',
    name: 'WATCH HILL',
    flag: 'USA',
  },
  {
    id: 'usa-wilsoncove',
    name: 'WILSON COVE',
    flag: 'USA',
  },
  {
    id: 'usa-harahan',
    name: 'HARAHAN',
    flag: 'USA',
  },
  {
    id: 'usa-rockdale',
    name: 'ROCKDALE',
    flag: 'USA',
  },
  {
    id: 'usa-eureka',
    name: 'EUREKA',
    flag: 'USA',
  },
  {
    id: 'usa-usa-626',
    name: 'USA-626',
    flag: 'USA',
  },
  {
    id: 'usa-semiahmoo',
    name: 'SEMIAHMOO',
    flag: 'USA',
  },
  {
    id: 'usa-baltimore',
    name: 'BALTIMORE',
    flag: 'USA',
  },
  {
    id: 'usa-sheboygan',
    name: 'SHEBOYGAN',
    flag: 'USA',
  },
  {
    id: 'usa-alexandriabay',
    name: 'ALEXANDRIA BAY',
    flag: 'USA',
  },
  {
    id: 'usa-mercerisland',
    name: 'MERCER ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-reddogmine',
    name: 'RED DOG MINE',
    flag: 'USA',
  },
  {
    id: 'usa-muskegon',
    name: 'MUSKEGON',
    flag: 'USA',
  },
  {
    id: 'usa-kenai',
    name: 'KENAI',
    flag: 'USA',
  },
  {
    id: 'usa-desmoines',
    name: 'DES MOINES',
    flag: 'USA',
  },
  {
    id: 'usa-bellechasse',
    name: 'BELLE CHASSE',
    flag: 'USA',
  },
  {
    id: 'usa-krotzsprings',
    name: 'KROTZ SPRINGS',
    flag: 'USA',
  },
  {
    id: 'usa-clarksville',
    name: 'CLARKSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-bellevue',
    name: 'BELLEVUE',
    flag: 'USA',
  },
  {
    id: 'usa-bayoulabatre',
    name: 'BAYOU LA BATRE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-99',
    name: 'USA-99',
    flag: 'USA',
  },
  {
    id: 'usa-kake',
    name: 'KAKE',
    flag: 'USA',
  },
  {
    id: 'usa-jerseycity',
    name: 'JERSEY CITY',
    flag: 'USA',
  },
  {
    id: 'usa-pineville',
    name: 'PINEVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1865',
    name: 'USA-1865',
    flag: 'USA',
  },
  {
    id: 'usa-rainier',
    name: 'RAINIER',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1697',
    name: 'USA-1697',
    flag: 'USA',
  },
  {
    id: 'usa-cityisland',
    name: 'CITY ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-seneca',
    name: 'SENECA',
    flag: 'USA',
  },
  {
    id: 'usa-rockland',
    name: 'ROCKLAND',
    flag: 'USA',
  },
  {
    id: 'usa-usa-870',
    name: 'USA-870',
    flag: 'USA',
  },
  {
    id: 'usa-sanfrancisco',
    name: 'SAN FRANCISCO',
    flag: 'USA',
  },
  {
    id: 'usa-coosbay',
    name: 'COOS BAY',
    flag: 'USA',
  },
  {
    id: 'usa-bayouvista',
    name: 'BAYOU VISTA',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1589',
    name: 'USA-1589',
    flag: 'USA',
  },
  {
    id: 'usa-goldenmeadow',
    name: 'GOLDEN MEADOW',
    flag: 'USA',
  },
  {
    id: 'usa-burntstore',
    name: 'BURNT STORE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1316',
    name: 'USA-1316',
    flag: 'USA',
  },
  {
    id: 'usa-adak',
    name: 'ADAK',
    flag: 'USA',
  },
  {
    id: 'usa-rutherfordisland',
    name: 'RUTHERFORD ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-matagorda',
    name: 'MATAGORDA',
    flag: 'USA',
  },
  {
    id: 'usa-uppergrandlagoon',
    name: 'UPPER GRAND LAGOON',
    flag: 'USA',
  },
  {
    id: 'usa-bocaraton',
    name: 'BOCA RATON',
    flag: 'USA',
  },
  {
    id: 'usa-gary',
    name: 'GARY',
    flag: 'USA',
  },
  {
    id: 'usa-larose',
    name: 'LAROSE',
    flag: 'USA',
  },
  {
    id: 'usa-ellago',
    name: 'EL LAGO',
    flag: 'USA',
  },
  {
    id: 'usa-kailua',
    name: 'KAILUA',
    flag: 'USA',
  },
  {
    id: 'usa-bayway',
    name: 'BAYWAY',
    flag: 'USA',
  },
  {
    id: 'usa-orangebeach',
    name: 'ORANGE BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-portmoller',
    name: 'PORT MOLLER',
    flag: 'USA',
  },
  {
    id: 'usa-philadelphia',
    name: 'PHILADELPHIA',
    flag: 'USA',
  },
  {
    id: 'usa-lockport',
    name: 'LOCKPORT',
    flag: 'USA',
  },
  {
    id: 'usa-stignace',
    name: 'ST IGNACE',
    flag: 'USA',
  },
  {
    id: 'usa-boston',
    name: 'BOSTON',
    flag: 'USA',
  },
  {
    id: 'usa-wellsburg',
    name: 'WELLSBURG',
    flag: 'USA',
  },
  {
    id: 'usa-usa-527',
    name: 'USA-527',
    flag: 'USA',
  },
  {
    id: 'usa-minturn',
    name: 'MINTURN',
    flag: 'USA',
  },
  {
    id: 'usa-palmbeach',
    name: 'PALM BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-southharpswell',
    name: 'SOUTH HARPSWELL',
    flag: 'USA',
  },
  {
    id: 'usa-yerbabuenaisland',
    name: 'YERBABUENA ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-camanche',
    name: 'CAMANCHE',
    flag: 'USA',
  },
  {
    id: 'usa-saintmichaels',
    name: 'SAINT MICHAELS',
    flag: 'USA',
  },
  {
    id: 'usa-buffington',
    name: 'BUFFINGTON',
    flag: 'USA',
  },
  {
    id: 'usa-saintjames',
    name: 'SAINT JAMES',
    flag: 'USA',
  },
  {
    id: 'usa-warsaw',
    name: 'WARSAW',
    flag: 'USA',
  },
  {
    id: 'usa-stpaul',
    name: 'ST PAUL',
    flag: 'USA',
  },
  {
    id: 'usa-fairmont',
    name: 'FAIRMONT',
    flag: 'USA',
  },
  {
    id: 'usa-sanmateo',
    name: 'SAN MATEO',
    flag: 'USA',
  },
  {
    id: 'usa-manitowoc',
    name: 'MANITOWOC',
    flag: 'USA',
  },
  {
    id: 'usa-fridayharbor',
    name: 'FRIDAY HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-frenchboro',
    name: 'FRENCHBORO',
    flag: 'USA',
  },
  {
    id: 'usa-lemay',
    name: 'LEMAY',
    flag: 'USA',
  },
  {
    id: 'usa-porthadlock-irondale',
    name: 'PORT HADLOCK-IRONDALE',
    flag: 'USA',
  },
  {
    id: 'usa-newsmyrnabeach',
    name: 'NEW SMYRNA BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1539',
    name: 'USA-1539',
    flag: 'USA',
  },
  {
    id: 'usa-channahon',
    name: 'CHANNAHON',
    flag: 'USA',
  },
  {
    id: 'usa-deerharbor',
    name: 'DEER HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-hodgkins',
    name: 'HODGKINS',
    flag: 'USA',
  },
  {
    id: 'usa-quincy',
    name: 'QUINCY',
    flag: 'USA',
  },
  {
    id: 'usa-neahbay',
    name: 'NEAH BAY',
    flag: 'USA',
  },
  {
    id: 'usa-villahills',
    name: 'VILLA HILLS',
    flag: 'USA',
  },
  {
    id: 'usa-deltaville',
    name: 'DELTAVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-rockledge',
    name: 'ROCKLEDGE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1178',
    name: 'USA-1178',
    flag: 'USA',
  },
  {
    id: 'usa-crevecoeur',
    name: 'CREVE COEUR',
    flag: 'USA',
  },
  {
    id: 'usa-skagway',
    name: 'SKAGWAY',
    flag: 'USA',
  },
  {
    id: 'usa-mountpleasant',
    name: 'MOUNT PLEASANT',
    flag: 'USA',
  },
  {
    id: 'usa-dolton',
    name: 'DOLTON',
    flag: 'USA',
  },
  {
    id: "usa-sewall'spoint",
    name: "SEWALL'S POINT",
    flag: 'USA',
  },
  {
    id: 'usa-cathlamet',
    name: 'CATHLAMET',
    flag: 'USA',
  },
  {
    id: 'usa-portsanluis',
    name: 'PORT SAN LUIS',
    flag: 'USA',
  },
  {
    id: 'usa-berwick',
    name: 'BERWICK',
    flag: 'USA',
  },
  {
    id: 'usa-newark',
    name: 'NEWARK',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1076',
    name: 'USA-1076',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1740',
    name: 'USA-1740',
    flag: 'USA',
  },
  {
    id: 'usa-clinton',
    name: 'CLINTON',
    flag: 'USA',
  },
  {
    id: 'usa-smithland',
    name: 'SMITHLAND',
    flag: 'USA',
  },
  {
    id: 'usa-nome',
    name: 'NOME',
    flag: 'USA',
  },
  {
    id: 'usa-emmonak',
    name: 'EMMONAK',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1371',
    name: 'USA-1371',
    flag: 'USA',
  },
  {
    id: 'usa-georgetown',
    name: 'GEORGETOWN',
    flag: 'USA',
  },
  {
    id: 'usa-kawaihae',
    name: 'KAWAIHAE',
    flag: 'USA',
  },
  {
    id: 'usa-portofmemphis',
    name: 'PORT OF MEMPHIS',
    flag: 'USA',
  },
  {
    id: 'usa-blades',
    name: 'BLADES',
    flag: 'USA',
  },
  {
    id: 'usa-wickliffe',
    name: 'WICKLIFFE',
    flag: 'USA',
  },
  {
    id: 'usa-winslow',
    name: 'WINSLOW',
    flag: 'USA',
  },
  {
    id: 'usa-northbeach',
    name: 'NORTH BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-weehawken',
    name: 'WEEHAWKEN',
    flag: 'USA',
  },
  {
    id: 'usa-lakepark',
    name: 'LAKE PARK',
    flag: 'USA',
  },
  {
    id: 'usa-bridgeport',
    name: 'BRIDGEPORT',
    flag: 'USA',
  },
  {
    id: 'usa-timberlane',
    name: 'TIMBERLANE',
    flag: 'USA',
  },
  {
    id: 'usa-hillsborobeach',
    name: 'HILLSBORO BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-clearlakeshores',
    name: 'CLEAR LAKE SHORES',
    flag: 'USA',
  },
  {
    id: 'usa-alexandria',
    name: 'ALEXANDRIA',
    flag: 'USA',
  },
  {
    id: 'usa-shinnecockbay',
    name: 'SHINNECOCK BAY',
    flag: 'USA',
  },
  {
    id: 'usa-funter',
    name: 'FUNTER',
    flag: 'USA',
  },
  {
    id: 'usa-juneau',
    name: 'JUNEAU',
    flag: 'USA',
  },
  {
    id: 'usa-saultstemarie',
    name: 'SAULT STE MARIE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1008',
    name: 'USA-1008',
    flag: 'USA',
  },
  {
    id: 'usa-oakville',
    name: 'OAKVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-189',
    name: 'USA-189',
    flag: 'USA',
  },
  {
    id: 'usa-texascity',
    name: 'TEXAS CITY',
    flag: 'USA',
  },
  {
    id: 'usa-darien',
    name: 'DARIEN',
    flag: 'USA',
  },
  {
    id: 'usa-presqueisle',
    name: 'PRESQUE ISLE',
    flag: 'USA',
  },
  {
    id: 'usa-crockett',
    name: 'CROCKETT',
    flag: 'USA',
  },
  {
    id: 'usa-nantucket',
    name: 'NANTUCKET',
    flag: 'USA',
  },
  {
    id: 'usa-decatur',
    name: 'DECATUR',
    flag: 'USA',
  },
  {
    id: 'usa-metervikbay',
    name: 'METERVIK BAY',
    flag: 'USA',
  },
  {
    id: 'usa-usa-912',
    name: 'USA-912',
    flag: 'USA',
  },
  {
    id: 'usa-eatonsneck',
    name: 'EATONS NECK',
    flag: 'USA',
  },
  {
    id: 'usa-fortwaltonbeach',
    name: 'FORT WALTON BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-tananipoint',
    name: 'TANANI POINT',
    flag: 'USA',
  },
  {
    id: 'usa-pasadena',
    name: 'PASADENA',
    flag: 'USA',
  },
  {
    id: 'usa-southvallejo',
    name: 'SOUTH VALLEJO',
    flag: 'USA',
  },
  {
    id: 'usa-oceanside',
    name: 'OCEANSIDE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1468',
    name: 'USA-1468',
    flag: 'USA',
  },
  {
    id: 'usa-westmemphis',
    name: 'WEST MEMPHIS',
    flag: 'USA',
  },
  {
    id: 'usa-sacketsharbor',
    name: 'SACKETS HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-granitecity',
    name: 'GRANITE CITY',
    flag: 'USA',
  },
  {
    id: 'usa-gigharbor',
    name: 'GIG HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-neworleans',
    name: 'NEW ORLEANS',
    flag: 'USA',
  },
  {
    id: 'usa-wilmingtonnc',
    name: 'WILMINGTON NC',
    flag: 'USA',
  },
  {
    id: 'usa-powhatanpoint',
    name: 'POWHATAN POINT',
    flag: 'USA',
  },
  {
    id: 'usa-southworth',
    name: 'SOUTHWORTH',
    flag: 'USA',
  },
  {
    id: 'usa-savannah',
    name: 'SAVANNAH',
    flag: 'USA',
  },
  {
    id: 'usa-eastalton',
    name: 'EAST ALTON',
    flag: 'USA',
  },
  {
    id: 'usa-malibu',
    name: 'MALIBU',
    flag: 'USA',
  },
  {
    id: 'usa-portlavaca',
    name: 'PORT LAVACA',
    flag: 'USA',
  },
  {
    id: 'usa-sturgeonbay',
    name: 'STURGEON BAY',
    flag: 'USA',
  },
  {
    id: 'usa-laplace',
    name: 'LAPLACE',
    flag: 'USA',
  },
  {
    id: 'usa-chesapeakebeach',
    name: 'CHESAPEAKE BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-barberspointterminal',
    name: 'BARBERS POINT TERMINAL',
    flag: 'USA',
  },
  {
    id: 'usa-nawiliwilibay',
    name: 'NAWILIWILI BAY',
    flag: 'USA',
  },
  {
    id: 'usa-capegirardeau',
    name: 'CAPE GIRARDEAU',
    flag: 'USA',
  },
  {
    id: 'usa-fortmyersbeach',
    name: 'FORT MYERS BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-sunnyislesbeach',
    name: 'SUNNY ISLES BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-galveston',
    name: 'GALVESTON',
    flag: 'USA',
  },
  {
    id: 'usa-usa-53',
    name: 'USA-53',
    flag: 'USA',
  },
  {
    id: 'usa-indialantic',
    name: 'INDIALANTIC',
    flag: 'USA',
  },
  {
    id: 'usa-mystic',
    name: 'MYSTIC',
    flag: 'USA',
  },
  {
    id: 'usa-bangortridentbase',
    name: 'BANGOR TRIDENT BASE',
    flag: 'USA',
  },
  {
    id: 'usa-meggett',
    name: 'MEGGETT',
    flag: 'USA',
  },
  {
    id: 'usa-indianaharbor',
    name: 'INDIANA HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-dunedin',
    name: 'DUNEDIN',
    flag: 'USA',
  },
  {
    id: 'usa-everett',
    name: 'EVERETT',
    flag: 'USA',
  },
  {
    id: 'usa-vinalhaven',
    name: 'VINALHAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-manchester',
    name: 'MANCHESTER',
    flag: 'USA',
  },
  {
    id: 'usa-petoskey',
    name: 'PETOSKEY',
    flag: 'USA',
  },
  {
    id: 'usa-hyder',
    name: 'HYDER',
    flag: 'USA',
  },
  {
    id: 'usa-usa-410',
    name: 'USA-410',
    flag: 'USA',
  },
  {
    id: 'usa-socastee',
    name: 'SOCASTEE',
    flag: 'USA',
  },
  {
    id: 'usa-yonkers',
    name: 'YONKERS',
    flag: 'USA',
  },
  {
    id: 'usa-clayton',
    name: 'CLAYTON',
    flag: 'USA',
  },
  {
    id: 'usa-pelican',
    name: 'PELICAN',
    flag: 'USA',
  },
  {
    id: 'usa-jefferson',
    name: 'JEFFERSON',
    flag: 'USA',
  },
  {
    id: 'usa-atlanticbeach',
    name: 'ATLANTIC BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-avondale',
    name: 'AVONDALE',
    flag: 'USA',
  },
  {
    id: 'usa-solomonsisland',
    name: 'SOLOMONS ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1698',
    name: 'USA-1698',
    flag: 'USA',
  },
  {
    id: 'usa-caruthersville',
    name: 'CARUTHERSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-sinco',
    name: 'SINCO',
    flag: 'USA',
  },
  {
    id: 'usa-dutchharbor',
    name: 'DUTCH HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1113',
    name: 'USA-1113',
    flag: 'USA',
  },
  {
    id: 'usa-oswego',
    name: 'OSWEGO',
    flag: 'USA',
  },
  {
    id: 'usa-northpekin',
    name: 'NORTH PEKIN',
    flag: 'USA',
  },
  {
    id: 'usa-escatawpa',
    name: 'ESCATAWPA',
    flag: 'USA',
  },
  {
    id: 'usa-usa-909',
    name: 'USA-909',
    flag: 'USA',
  },
  {
    id: 'usa-monterey',
    name: 'MONTEREY',
    flag: 'USA',
  },
  {
    id: 'usa-glencove',
    name: 'GLEN COVE',
    flag: 'USA',
  },
  {
    id: 'usa-lawrenceburg',
    name: 'LAWRENCEBURG',
    flag: 'USA',
  },
  {
    id: 'usa-newsouthmemphis',
    name: 'NEW SOUTH MEMPHIS',
    flag: 'USA',
  },
  {
    id: 'usa-elsegundo',
    name: 'EL SEGUNDO',
    flag: 'USA',
  },
  {
    id: 'usa-mayport',
    name: 'MAYPORT',
    flag: 'USA',
  },
  {
    id: 'usa-elringtonisland',
    name: 'ELRINGTON ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-pankofbreaker',
    name: 'PANKOF BREAKER',
    flag: 'USA',
  },
  {
    id: 'usa-cameron',
    name: 'CAMERON',
    flag: 'USA',
  },
  {
    id: 'usa-vicksburg',
    name: 'VICKSBURG',
    flag: 'USA',
  },
  {
    id: 'usa-moreheadcity',
    name: 'MOREHEAD CITY',
    flag: 'USA',
  },
  {
    id: 'usa-usa-947',
    name: 'USA-947',
    flag: 'USA',
  },
  {
    id: 'usa-mc807platform',
    name: 'MC 807 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-capecharles',
    name: 'CAPE CHARLES',
    flag: 'USA',
  },
  {
    id: 'usa-barrington',
    name: 'BARRINGTON',
    flag: 'USA',
  },
  {
    id: 'usa-bourg',
    name: 'BOURG',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1935',
    name: 'USA-1935',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1883',
    name: 'USA-1883',
    flag: 'USA',
  },
  {
    id: 'usa-kennebunkport',
    name: 'KENNEBUNKPORT',
    flag: 'USA',
  },
  {
    id: 'usa-bath',
    name: 'BATH',
    flag: 'USA',
  },
  {
    id: 'usa-bolivarpeninsula',
    name: 'BOLIVAR PENINSULA',
    flag: 'USA',
  },
  {
    id: 'usa-pineknollshores',
    name: 'PINE KNOLL SHORES',
    flag: 'USA',
  },
  {
    id: 'usa-usa-578',
    name: 'USA-578',
    flag: 'USA',
  },
  {
    id: 'usa-newell',
    name: 'NEWELL',
    flag: 'USA',
  },
  {
    id: 'usa-baldwin',
    name: 'BALDWIN',
    flag: 'USA',
  },
  {
    id: 'usa-sandwich',
    name: 'SANDWICH',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1764',
    name: 'USA-1764',
    flag: 'USA',
  },
  {
    id: 'usa-gulfport',
    name: 'GULFPORT',
    flag: 'USA',
  },
  {
    id: 'usa-oldsaybrookcenter',
    name: 'OLD SAYBROOK CENTER',
    flag: 'USA',
  },
  {
    id: 'usa-belhaven',
    name: 'BELHAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-houston',
    name: 'HOUSTON',
    flag: 'USA',
  },
  {
    id: 'usa-whittier',
    name: 'WHITTIER',
    flag: 'USA',
  },
  {
    id: 'usa-melville',
    name: 'MELVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-lahaina',
    name: 'LAHAINA',
    flag: 'USA',
  },
  {
    id: 'usa-sealbeach',
    name: 'SEAL BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-burnham',
    name: 'BURNHAM',
    flag: 'USA',
  },
  {
    id: 'usa-houghton',
    name: 'HOUGHTON',
    flag: 'USA',
  },
  {
    id: 'usa-usa-127',
    name: 'USA-127',
    flag: 'USA',
  },
  {
    id: 'usa-wanchese',
    name: 'WANCHESE',
    flag: 'USA',
  },
  {
    id: 'usa-tiverton',
    name: 'TIVERTON',
    flag: 'USA',
  },
  {
    id: 'usa-salem',
    name: 'SALEM',
    flag: 'USA',
  },
  {
    id: 'usa-puntagordaisles',
    name: 'PUNTA GORDA ISLES',
    flag: 'USA',
  },
  {
    id: 'usa-rocheharbor',
    name: 'ROCHE  HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-ledbetter',
    name: 'LEDBETTER',
    flag: 'USA',
  },
  {
    id: 'usa-goodhope',
    name: 'GOOD HOPE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-40',
    name: 'USA-40',
    flag: 'USA',
  },
  {
    id: 'usa-capecanaveral',
    name: 'CAPE CANAVERAL',
    flag: 'USA',
  },
  {
    id: 'usa-sanibel',
    name: 'SANIBEL',
    flag: 'USA',
  },
  {
    id: 'usa-norwalk',
    name: 'NORWALK',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1200',
    name: 'USA-1200',
    flag: 'USA',
  },
  {
    id: 'usa-keylargo',
    name: 'KEY LARGO',
    flag: 'USA',
  },
  {
    id: 'usa-northmiamibeach',
    name: 'NORTH MIAMI BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-mosspoint',
    name: 'MOSS POINT',
    flag: 'USA',
  },
  {
    id: 'usa-lusby',
    name: 'LUSBY',
    flag: 'USA',
  },
  {
    id: 'usa-jeanlafitte',
    name: 'JEAN LAFITTE',
    flag: 'USA',
  },
  {
    id: 'usa-chalmette',
    name: 'CHALMETTE',
    flag: 'USA',
  },
  {
    id: 'usa-davisvilledepot',
    name: 'DAVISVILLE DEPOT',
    flag: 'USA',
  },
  {
    id: 'usa-barnegat',
    name: 'BARNEGAT',
    flag: 'USA',
  },
  {
    id: 'usa-ponceinlet',
    name: 'PONCE INLET',
    flag: 'USA',
  },
  {
    id: 'usa-brooklynpark',
    name: 'BROOKLYN PARK',
    flag: 'USA',
  },
  {
    id: 'usa-oquawka',
    name: 'OQUAWKA',
    flag: 'USA',
  },
  {
    id: 'usa-hanalei',
    name: 'HANALEI',
    flag: 'USA',
  },
  {
    id: 'usa-violet',
    name: 'VIOLET',
    flag: 'USA',
  },
  {
    id: 'usa-petersburg',
    name: 'PETERSBURG',
    flag: 'USA',
  },
  {
    id: 'usa-santacatalinais',
    name: 'SANTA CATALINA IS',
    flag: 'USA',
  },
  {
    id: 'usa-ottercove',
    name: 'OTTER COVE',
    flag: 'USA',
  },
  {
    id: 'usa-somerset',
    name: 'SOMERSET',
    flag: 'USA',
  },
  {
    id: 'usa-beachhaven',
    name: 'BEACH HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-brooklyn',
    name: 'BROOKLYN',
    flag: 'USA',
  },
  {
    id: 'usa-sunrise',
    name: 'SUNRISE',
    flag: 'USA',
  },
  {
    id: 'usa-lochmoorwaterwayestates',
    name: 'LOCHMOOR WATERWAY ESTATES',
    flag: 'USA',
  },
  {
    id: 'usa-lakecharles',
    name: 'LAKE CHARLES',
    flag: 'USA',
  },
  {
    id: 'usa-usa-797',
    name: 'USA-797',
    flag: 'USA',
  },
  {
    id: 'usa-richardson',
    name: 'RICHARDSON',
    flag: 'USA',
  },
  {
    id: 'usa-portrichmondsi',
    name: 'PORT RICHMOND SI',
    flag: 'USA',
  },
  {
    id: 'usa-searsport',
    name: 'SEARSPORT',
    flag: 'USA',
  },
  {
    id: 'usa-saintsimonmills',
    name: 'SAINT SIMON MILLS',
    flag: 'USA',
  },
  {
    id: 'usa-orange',
    name: 'ORANGE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1318',
    name: 'USA-1318',
    flag: 'USA',
  },
  {
    id: 'usa-portbyron',
    name: 'PORT BYRON',
    flag: 'USA',
  },
  {
    id: 'usa-brinnon',
    name: 'BRINNON',
    flag: 'USA',
  },
  {
    id: 'usa-artondale',
    name: 'ARTONDALE',
    flag: 'USA',
  },
  {
    id: 'usa-egegik',
    name: 'EGEGIK',
    flag: 'USA',
  },
  {
    id: 'usa-beverly',
    name: 'BEVERLY',
    flag: 'USA',
  },
  {
    id: 'usa-naples',
    name: 'NAPLES',
    flag: 'USA',
  },
  {
    id: 'usa-warren',
    name: 'WARREN',
    flag: 'USA',
  },
  {
    id: 'usa-centralgardens',
    name: 'CENTRAL GARDENS',
    flag: 'USA',
  },
  {
    id: 'usa-longboatkey',
    name: 'LONGBOAT KEY',
    flag: 'USA',
  },
  {
    id: 'usa-haydenisland',
    name: 'HAYDEN ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-northbayvillage',
    name: 'NORTH BAY VILLAGE',
    flag: 'USA',
  },
  {
    id: 'usa-sitka',
    name: 'SITKA',
    flag: 'USA',
  },
  {
    id: 'usa-havredegrace',
    name: 'HAVRE DE GRACE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-260',
    name: 'USA-260',
    flag: 'USA',
  },
  {
    id: 'usa-jacksonvillebeach',
    name: 'JACKSONVILLE BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-stamford',
    name: 'STAMFORD',
    flag: 'USA',
  },
  {
    id: 'usa-westhavencove',
    name: 'WESTHAVEN COVE',
    flag: 'USA',
  },
  {
    id: 'usa-bellaire',
    name: 'BELLAIRE',
    flag: 'USA',
  },
  {
    id: 'usa-gc743platform',
    name: 'GC 743 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-clearwater',
    name: 'CLEARWATER',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1530',
    name: 'USA-1530',
    flag: 'USA',
  },
  {
    id: 'usa-newlondon',
    name: 'NEW LONDON',
    flag: 'USA',
  },
  {
    id: 'usa-jensenbeach',
    name: 'JENSEN BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-highlands',
    name: 'HIGHLANDS',
    flag: 'USA',
  },
  {
    id: 'usa-northrivershores',
    name: 'NORTH RIVER SHORES',
    flag: 'USA',
  },
  {
    id: 'usa-panamacity',
    name: 'PANAMA CITY',
    flag: 'USA',
  },
  {
    id: 'usa-sanmiguelis',
    name: 'SAN MIGUEL IS',
    flag: 'USA',
  },
  {
    id: 'usa-marinadelrey',
    name: 'MARINA DEL REY',
    flag: 'USA',
  },
  {
    id: 'usa-pri-8',
    name: 'PRI-8',
    flag: 'USA',
  },
  {
    id: 'usa-falmouth',
    name: 'FALMOUTH',
    flag: 'USA',
  },
  {
    id: 'usa-andersonbay',
    name: 'ANDERSON BAY',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1874',
    name: 'USA-1874',
    flag: 'USA',
  },
  {
    id: 'usa-stuart',
    name: 'STUART',
    flag: 'USA',
  },
  {
    id: 'usa-manchester-by-the-sea',
    name: 'MANCHESTER-BY-THE-SEA',
    flag: 'USA',
  },
  {
    id: 'usa-ludington',
    name: 'LUDINGTON',
    flag: 'USA',
  },
  {
    id: 'usa-martinez',
    name: 'MARTINEZ',
    flag: 'USA',
  },
  {
    id: 'usa-ilwaco',
    name: 'ILWACO',
    flag: 'USA',
  },
  {
    id: 'usa-barharbor',
    name: 'BAR HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-yarrowpoint',
    name: 'YARROW POINT',
    flag: 'USA',
  },
  {
    id: 'usa-chester',
    name: 'CHESTER',
    flag: 'USA',
  },
  {
    id: 'usa-pittsburgh',
    name: 'PITTSBURGH',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1147',
    name: 'USA-1147',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1406',
    name: 'USA-1406',
    flag: 'USA',
  },
  {
    id: 'usa-newbedford',
    name: 'NEW BEDFORD',
    flag: 'USA',
  },
  {
    id: 'usa-sandiego',
    name: 'SAN DIEGO',
    flag: 'USA',
  },
  {
    id: 'usa-dayton',
    name: 'DAYTON',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1525',
    name: 'USA-1525',
    flag: 'USA',
  },
  {
    id: 'usa-norfolk',
    name: 'NORFOLK',
    flag: 'USA',
  },
  {
    id: 'usa-saintaugustinesouth',
    name: 'SAINT AUGUSTINE SOUTH',
    flag: 'USA',
  },
  {
    id: 'usa-tiburon',
    name: 'TIBURON',
    flag: 'USA',
  },
  {
    id: 'usa-rensselaer',
    name: 'RENSSELAER',
    flag: 'USA',
  },
  {
    id: 'usa-valdez',
    name: 'VALDEZ',
    flag: 'USA',
  },
  {
    id: 'usa-portaransas',
    name: 'PORT ARANSAS',
    flag: 'USA',
  },
  {
    id: 'usa-rivierabeach',
    name: 'RIVIERA BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-bristol',
    name: 'BRISTOL',
    flag: 'USA',
  },
  {
    id: 'usa-westsacramento',
    name: 'WEST SACRAMENTO',
    flag: 'USA',
  },
  {
    id: 'usa-racine',
    name: 'RACINE',
    flag: 'USA',
  },
  {
    id: 'usa-eastdennis',
    name: 'EAST DENNIS',
    flag: 'USA',
  },
  {
    id: 'usa-twoharbors',
    name: 'TWO HARBORS',
    flag: 'USA',
  },
  {
    id: 'usa-palmcity',
    name: 'PALM CITY',
    flag: 'USA',
  },
  {
    id: 'usa-northhaven',
    name: 'NORTH HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-mackinawcity',
    name: 'MACKINAW CITY',
    flag: 'USA',
  },
  {
    id: 'usa-woodmere',
    name: 'WOODMERE',
    flag: 'USA',
  },
  {
    id: 'usa-sandyhookbay',
    name: 'SANDY HOOK BAY',
    flag: 'USA',
  },
  {
    id: 'usa-ashtabula',
    name: 'ASHTABULA',
    flag: 'USA',
  },
  {
    id: 'usa-westbrookcenter',
    name: 'WESTBROOK CENTER',
    flag: 'USA',
  },
  {
    id: 'usa-carmel-by-the-sea',
    name: 'CARMEL-BY-THE-SEA',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1818',
    name: 'USA-1818',
    flag: 'USA',
  },
  {
    id: 'usa-usa-42',
    name: 'USA-42',
    flag: 'USA',
  },
  {
    id: 'usa-sewaren',
    name: 'SEWAREN',
    flag: 'USA',
  },
  {
    id: 'usa-seldovia',
    name: 'SELDOVIA',
    flag: 'USA',
  },
  {
    id: 'usa-greatkillsharbor',
    name: 'GREAT KILLS HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-usa-16',
    name: 'USA-16',
    flag: 'USA',
  },
  {
    id: 'usa-greenwich',
    name: 'GREENWICH',
    flag: 'USA',
  },
  {
    id: 'usa-southsarasota',
    name: 'SOUTH SARASOTA',
    flag: 'USA',
  },
  {
    id: 'usa-craig',
    name: 'CRAIG',
    flag: 'USA',
  },
  {
    id: 'usa-southbeach',
    name: 'SOUTH BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-chulavista',
    name: 'CHULA VISTA',
    flag: 'USA',
  },
  {
    id: 'usa-lauderdale-by-the-sea',
    name: 'LAUDERDALE-BY-THE-SEA',
    flag: 'USA',
  },
  {
    id: 'usa-bucksharbor',
    name: 'BUCKS HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-portroyal',
    name: 'PORT ROYAL',
    flag: 'USA',
  },
  {
    id: 'usa-sullivansisland',
    name: 'SULLIVANS ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-coldbay',
    name: 'COLD BAY',
    flag: 'USA',
  },
  {
    id: 'usa-newhaven',
    name: 'NEW HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-deepwaterpoint',
    name: 'DEEPWATER POINT',
    flag: 'USA',
  },
  {
    id: 'usa-plymouth',
    name: 'PLYMOUTH',
    flag: 'USA',
  },
  {
    id: 'usa-brusly',
    name: 'BRUSLY',
    flag: 'USA',
  },
  {
    id: 'usa-lantana',
    name: 'LANTANA',
    flag: 'USA',
  },
  {
    id: 'usa-nikiski',
    name: 'NIKISKI',
    flag: 'USA',
  },
  {
    id: 'usa-portarthur',
    name: 'PORT ARTHUR',
    flag: 'USA',
  },
  {
    id: 'usa-branfordcenter',
    name: 'BRANFORD CENTER',
    flag: 'USA',
  },
  {
    id: 'usa-hickamfield',
    name: 'HICKAM FIELD',
    flag: 'USA',
  },
  {
    id: 'usa-junobeach',
    name: 'JUNO BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-olsencove',
    name: 'OLSEN COVE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1083',
    name: 'USA-1083',
    flag: 'USA',
  },
  {
    id: 'usa-fallriver',
    name: 'FALL RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1838',
    name: 'USA-1838',
    flag: 'USA',
  },
  {
    id: 'usa-rougeriver',
    name: 'ROUGE RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-manistee',
    name: 'MANISTEE',
    flag: 'USA',
  },
  {
    id: 'usa-portvue',
    name: 'PORT VUE',
    flag: 'USA',
  },
  {
    id: 'usa-oakharbor',
    name: 'OAK HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-porttownsend',
    name: 'PORT TOWNSEND',
    flag: 'USA',
  },
  {
    id: 'usa-miami',
    name: 'MIAMI',
    flag: 'USA',
  },
  {
    id: 'usa-nationalpark',
    name: 'NATIONAL PARK',
    flag: 'USA',
  },
  {
    id: 'usa-chenegabay',
    name: 'CHENEGA BAY',
    flag: 'USA',
  },
  {
    id: 'usa-woodriver',
    name: 'WOOD RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-saintgabriel',
    name: 'SAINT GABRIEL',
    flag: 'USA',
  },
  {
    id: 'usa-owensboro',
    name: 'OWENSBORO',
    flag: 'USA',
  },
  {
    id: 'usa-reserve',
    name: 'RESERVE',
    flag: 'USA',
  },
  {
    id: 'usa-yarmouth',
    name: 'YARMOUTH',
    flag: 'USA',
  },
  {
    id: 'usa-southport',
    name: 'SOUTHPORT',
    flag: 'USA',
  },
  {
    id: 'usa-pointwells',
    name: 'POINT WELLS',
    flag: 'USA',
  },
  {
    id: 'usa-coeymans',
    name: 'COEYMANS',
    flag: 'USA',
  },
  {
    id: 'usa-presquille',
    name: 'PRESQUILLE',
    flag: 'USA',
  },
  {
    id: 'usa-ketchikan',
    name: 'KETCHIKAN',
    flag: 'USA',
  },
  {
    id: 'usa-usa-967',
    name: 'USA-967',
    flag: 'USA',
  },
  {
    id: 'usa-essex',
    name: 'ESSEX',
    flag: 'USA',
  },
  {
    id: 'usa-portland',
    name: 'PORTLAND',
    flag: 'USA',
  },
  {
    id: 'usa-eastport',
    name: 'EASTPORT',
    flag: 'USA',
  },
  {
    id: 'usa-akutanharbor',
    name: 'AKUTAN HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1234',
    name: 'USA-1234',
    flag: 'USA',
  },
  {
    id: 'usa-palacios',
    name: 'PALACIOS',
    flag: 'USA',
  },
  {
    id: 'usa-tombstonerocks',
    name: 'TOMBSTONE ROCKS',
    flag: 'USA',
  },
  {
    id: 'usa-clarkspoint',
    name: 'CLARKS POINT',
    flag: 'USA',
  },
  {
    id: 'usa-karluk',
    name: 'KARLUK',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1096',
    name: 'USA-1096',
    flag: 'USA',
  },
  {
    id: 'usa-freeport',
    name: 'FREEPORT',
    flag: 'USA',
  },
  {
    id: 'usa-oysterbay',
    name: 'OYSTER BAY',
    flag: 'USA',
  },
  {
    id: 'usa-hoodriver',
    name: 'HOOD RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-channelview',
    name: 'CHANNELVIEW',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1823',
    name: 'USA-1823',
    flag: 'USA',
  },
  {
    id: 'usa-northfalmouth',
    name: 'NORTH FALMOUTH',
    flag: 'USA',
  },
  {
    id: 'usa-usa-103',
    name: 'USA-103',
    flag: 'USA',
  },
  {
    id: 'usa-vancouver',
    name: 'VANCOUVER',
    flag: 'USA',
  },
  {
    id: 'usa-wilmington',
    name: 'WILMINGTON',
    flag: 'USA',
  },
  {
    id: 'usa-santabarbaraisland',
    name: 'SANTA BARBARA ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-stockisland',
    name: 'STOCK ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-montegut',
    name: 'MONTEGUT',
    flag: 'USA',
  },
  {
    id: 'usa-shively',
    name: 'SHIVELY',
    flag: 'USA',
  },
  {
    id: 'usa-carteret',
    name: 'CARTERET',
    flag: 'USA',
  },
  {
    id: 'usa-metropolis',
    name: 'METROPOLIS',
    flag: 'USA',
  },
  {
    id: 'usa-grasonville',
    name: 'GRASONVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-monhegan',
    name: 'MONHEGAN',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1225',
    name: 'USA-1225',
    flag: 'USA',
  },
  {
    id: 'usa-colwyn',
    name: 'COLWYN',
    flag: 'USA',
  },
  {
    id: 'usa-isthmuscove',
    name: 'ISTHMUS COVE',
    flag: 'USA',
  },
  {
    id: 'usa-tarponpoint',
    name: 'TARPON POINT',
    flag: 'USA',
  },
  {
    id: 'usa-portreading',
    name: 'PORT READING',
    flag: 'USA',
  },
  {
    id: 'usa-quartermasterharbor',
    name: 'QUARTERMASTER HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-stpetersburg',
    name: 'ST PETERSBURG',
    flag: 'USA',
  },
  {
    id: 'usa-portingleside',
    name: 'PORT INGLESIDE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-463',
    name: 'USA-463',
    flag: 'USA',
  },
  {
    id: 'usa-newportnews',
    name: 'NEWPORT NEWS',
    flag: 'USA',
  },
  {
    id: 'usa-whitemarshisland',
    name: 'WHITEMARSH ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-rochester',
    name: 'ROCHESTER',
    flag: 'USA',
  },
  {
    id: 'usa-meraux',
    name: 'MERAUX',
    flag: 'USA',
  },
  {
    id: 'usa-deale',
    name: 'DEALE',
    flag: 'USA',
  },
  {
    id: 'usa-naknek',
    name: 'NAKNEK',
    flag: 'USA',
  },
  {
    id: 'usa-portmanatee',
    name: 'PORT MANATEE',
    flag: 'USA',
  },
  {
    id: 'usa-gulfharbourclub',
    name: 'GULF HARBOUR CLUB',
    flag: 'USA',
  },
  {
    id: 'usa-gloucester',
    name: 'GLOUCESTER',
    flag: 'USA',
  },
  {
    id: 'usa-fortward',
    name: 'FORT WARD',
    flag: 'USA',
  },
  {
    id: 'usa-cheboygan',
    name: 'CHEBOYGAN',
    flag: 'USA',
  },
  {
    id: 'usa-portwashington',
    name: 'PORT WASHINGTON',
    flag: 'USA',
  },
  {
    id: 'usa-kirkland',
    name: 'KIRKLAND',
    flag: 'USA',
  },
  {
    id: 'usa-delraybeach',
    name: 'DELRAY BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-henry',
    name: 'HENRY',
    flag: 'USA',
  },
  {
    id: 'usa-marrero',
    name: 'MARRERO',
    flag: 'USA',
  },
  {
    id: 'usa-ashland',
    name: 'ASHLAND',
    flag: 'USA',
  },
  {
    id: 'usa-lorain',
    name: 'LORAIN',
    flag: 'USA',
  },
  {
    id: 'usa-putinbay',
    name: 'PUT IN BAY',
    flag: 'USA',
  },
  {
    id: 'usa-pilotpoint',
    name: 'PILOT POINT',
    flag: 'USA',
  },
  {
    id: 'usa-donaldsonville',
    name: 'DONALDSONVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-mosslanding',
    name: 'MOSS LANDING',
    flag: 'USA',
  },
  {
    id: 'usa-mckeesrocks',
    name: 'MCKEES ROCKS',
    flag: 'USA',
  },
  {
    id: 'usa-usa-694',
    name: 'USA-694',
    flag: 'USA',
  },
  {
    id: 'usa-maysville',
    name: 'MAYSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1496',
    name: 'USA-1496',
    flag: 'USA',
  },
  {
    id: 'usa-capemay',
    name: 'CAPE MAY',
    flag: 'USA',
  },
  {
    id: 'usa-longview',
    name: 'LONGVIEW',
    flag: 'USA',
  },
  {
    id: 'usa-aransaspass',
    name: 'ARANSAS PASS',
    flag: 'USA',
  },
  {
    id: 'usa-destin',
    name: 'DESTIN',
    flag: 'USA',
  },
  {
    id: 'usa-puntagorda',
    name: 'PUNTA GORDA',
    flag: 'USA',
  },
  {
    id: 'usa-edgartown',
    name: 'EDGARTOWN',
    flag: 'USA',
  },
  {
    id: 'usa-rockport',
    name: 'ROCKPORT',
    flag: 'USA',
  },
  {
    id: 'usa-hickman',
    name: 'HICKMAN',
    flag: 'USA',
  },
  {
    id: 'usa-ama',
    name: 'AMA',
    flag: 'USA',
  },
  {
    id: 'usa-convent',
    name: 'CONVENT',
    flag: 'USA',
  },
  {
    id: 'usa-stockton',
    name: 'STOCKTON',
    flag: 'USA',
  },
  {
    id: 'usa-biloxi',
    name: 'BILOXI',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1503',
    name: 'USA-1503',
    flag: 'USA',
  },
  {
    id: 'usa-oaklandpark',
    name: 'OAKLAND PARK',
    flag: 'USA',
  },
  {
    id: 'usa-chignik',
    name: 'CHIGNIK',
    flag: 'USA',
  },
  {
    id: 'usa-bethel',
    name: 'BETHEL',
    flag: 'USA',
  },
  {
    id: 'usa-petaluma',
    name: 'PETALUMA',
    flag: 'USA',
  },
  {
    id: 'usa-venice',
    name: 'VENICE',
    flag: 'USA',
  },
  {
    id: 'usa-silvergrove',
    name: 'SILVER GROVE',
    flag: 'USA',
  },
  {
    id: 'usa-waggaman',
    name: 'WAGGAMAN',
    flag: 'USA',
  },
  {
    id: 'usa-rockhall',
    name: 'ROCK HALL',
    flag: 'USA',
  },
  {
    id: 'usa-annamaria',
    name: 'ANNA MARIA',
    flag: 'USA',
  },
  {
    id: 'usa-sewickley',
    name: 'SEWICKLEY',
    flag: 'USA',
  },
  {
    id: "usa-barber'spoint",
    name: "BARBER'S POINT",
    flag: 'USA',
  },
  {
    id: 'usa-blaine',
    name: 'BLAINE',
    flag: 'USA',
  },
  {
    id: 'usa-tenakeesprings',
    name: 'TENAKEE SPRINGS',
    flag: 'USA',
  },
  {
    id: 'usa-duluth',
    name: 'DULUTH',
    flag: 'USA',
  },
  {
    id: 'usa-innersealrock',
    name: 'INNER SEAL ROCK',
    flag: 'USA',
  },
  {
    id: 'usa-telemarbay',
    name: 'TELEMAR BAY',
    flag: 'USA',
  },
  {
    id: 'usa-providence',
    name: 'PROVIDENCE',
    flag: 'USA',
  },
  {
    id: 'usa-lutcher',
    name: 'LUTCHER',
    flag: 'USA',
  },
  {
    id: 'usa-usa-35',
    name: 'USA-35',
    flag: 'USA',
  },
  {
    id: 'usa-hoquiam',
    name: 'HOQUIAM',
    flag: 'USA',
  },
  {
    id: 'usa-pensacola',
    name: 'PENSACOLA',
    flag: 'USA',
  },
  {
    id: 'usa-lemont',
    name: 'LEMONT',
    flag: 'USA',
  },
  {
    id: 'usa-onset',
    name: 'ONSET',
    flag: 'USA',
  },
  {
    id: 'usa-saintdennis',
    name: 'SAINT DENNIS',
    flag: 'USA',
  },
  {
    id: 'usa-littlebearrock',
    name: 'LITTLE BEAR ROCK',
    flag: 'USA',
  },
  {
    id: 'usa-waretown',
    name: 'WARETOWN',
    flag: 'USA',
  },
  {
    id: "usa-'aiea",
    name: "'AIEA",
    flag: 'USA',
  },
  {
    id: 'usa-valdezarm',
    name: 'VALDEZ ARM',
    flag: 'USA',
  },
  {
    id: 'usa-beardstown',
    name: 'BEARDSTOWN',
    flag: 'USA',
  },
  {
    id: 'usa-westwego',
    name: 'WESTWEGO',
    flag: 'USA',
  },
  {
    id: 'usa-norsworthy',
    name: 'NORSWORTHY',
    flag: 'USA',
  },
  {
    id: 'usa-sausalito',
    name: 'SAUSALITO',
    flag: 'USA',
  },
  {
    id: 'usa-usa-938',
    name: 'USA-938',
    flag: 'USA',
  },
  {
    id: 'usa-barview',
    name: 'BARVIEW',
    flag: 'USA',
  },
  {
    id: 'usa-vineyardhaven',
    name: 'VINEYARD HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-keywest',
    name: 'KEY WEST',
    flag: 'USA',
  },
  {
    id: 'usa-prichard',
    name: 'PRICHARD',
    flag: 'USA',
  },
  {
    id: 'usa-naplate',
    name: 'NAPLATE',
    flag: 'USA',
  },
  {
    id: 'usa-selby-on-the-bay',
    name: 'SELBY-ON-THE-BAY',
    flag: 'USA',
  },
  {
    id: 'usa-crescentcity',
    name: 'CRESCENT CITY',
    flag: 'USA',
  },
  {
    id: 'usa-mountvernon',
    name: 'MOUNT VERNON',
    flag: 'USA',
  },
  {
    id: 'usa-cityofmilford(balance)',
    name: 'CITY OF MILFORD (BALANCE)',
    flag: 'USA',
  },
  {
    id: 'usa-usa-800',
    name: 'USA-800',
    flag: 'USA',
  },
  {
    id: 'usa-haines',
    name: 'HAINES',
    flag: 'USA',
  },
  {
    id: 'usa-tuscaloosa',
    name: 'TUSCALOOSA',
    flag: 'USA',
  },
  {
    id: 'usa-marinersharborsi',
    name: 'MARINERS HARBOR SI',
    flag: 'USA',
  },
  {
    id: 'usa-gifford',
    name: 'GIFFORD',
    flag: 'USA',
  },
  {
    id: 'usa-paulsboro',
    name: 'PAULSBORO',
    flag: 'USA',
  },
  {
    id: 'usa-st.helens',
    name: 'ST. HELENS',
    flag: 'USA',
  },
  {
    id: 'usa-pineypoint',
    name: 'PINEY POINT',
    flag: 'USA',
  },
  {
    id: 'usa-middleriver',
    name: 'MIDDLE RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-olympia',
    name: 'OLYMPIA',
    flag: 'USA',
  },
  {
    id: 'usa-morrobay',
    name: 'MORRO BAY',
    flag: 'USA',
  },
  {
    id: 'usa-arnold',
    name: 'ARNOLD',
    flag: 'USA',
  },
  {
    id: 'usa-swanport',
    name: 'SWANPORT',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1097',
    name: 'USA-1097',
    flag: 'USA',
  },
  {
    id: 'usa-kingston',
    name: 'KINGSTON',
    flag: 'USA',
  },
  {
    id: 'usa-tompkinsvillesi',
    name: 'TOMPKINSVILLE SI',
    flag: 'USA',
  },
  {
    id: 'usa-benicia',
    name: 'BENICIA',
    flag: 'USA',
  },
  {
    id: 'usa-hackberry',
    name: 'HACKBERRY',
    flag: 'USA',
  },
  {
    id: 'usa-washburn',
    name: 'WASHBURN',
    flag: 'USA',
  },
  {
    id: 'usa-madison',
    name: 'MADISON',
    flag: 'USA',
  },
  {
    id: 'usa-ogdensburg',
    name: 'OGDENSBURG',
    flag: 'USA',
  },
  {
    id: 'usa-eastriver',
    name: 'EAST RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-burlington',
    name: 'BURLINGTON',
    flag: 'USA',
  },
  {
    id: 'usa-kahului',
    name: 'KAHULUI',
    flag: 'USA',
  },
  {
    id: 'usa-fortmyersshores',
    name: 'FORT MYERS SHORES',
    flag: 'USA',
  },
  {
    id: 'usa-aventura',
    name: 'AVENTURA',
    flag: 'USA',
  },
  {
    id: 'usa-joppa',
    name: 'JOPPA',
    flag: 'USA',
  },
  {
    id: 'usa-porteverglades',
    name: 'PORT EVERGLADES',
    flag: 'USA',
  },
  {
    id: 'usa-tavernier',
    name: 'TAVERNIER',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1905',
    name: 'USA-1905',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1418',
    name: 'USA-1418',
    flag: 'USA',
  },
  {
    id: 'usa-fairhope',
    name: 'FAIRHOPE',
    flag: 'USA',
  },
  {
    id: 'usa-hennepin',
    name: 'HENNEPIN',
    flag: 'USA',
  },
  {
    id: 'usa-platinum',
    name: 'PLATINUM',
    flag: 'USA',
  },
  {
    id: 'usa-sabinepass',
    name: 'SABINE PASS',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1581',
    name: 'USA-1581',
    flag: 'USA',
  },
  {
    id: 'usa-marcoisland',
    name: 'MARCO ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-hartford',
    name: 'HARTFORD',
    flag: 'USA',
  },
  {
    id: 'usa-hannibal',
    name: 'HANNIBAL',
    flag: 'USA',
  },
  {
    id: 'usa-fernandinabeach',
    name: 'FERNANDINA BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-mckeesport',
    name: 'MCKEESPORT',
    flag: 'USA',
  },
  {
    id: 'usa-kendallgreen',
    name: 'KENDALL GREEN',
    flag: 'USA',
  },
  {
    id: 'usa-delcambre',
    name: 'DELCAMBRE',
    flag: 'USA',
  },
  {
    id: 'usa-santabarbara',
    name: 'SANTA BARBARA',
    flag: 'USA',
  },
  {
    id: 'usa-conningtowers-nautiluspark',
    name: 'CONNING TOWERS-NAUTILUS PARK',
    flag: 'USA',
  },
  {
    id: 'usa-greenville',
    name: 'GREENVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-southpoint',
    name: 'SOUTH POINT',
    flag: 'USA',
  },
  {
    id: 'usa-addis',
    name: 'ADDIS',
    flag: 'USA',
  },
  {
    id: 'usa-togiak',
    name: 'TOGIAK',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1772',
    name: 'USA-1772',
    flag: 'USA',
  },
  {
    id: 'usa-kingcove',
    name: 'KING COVE',
    flag: 'USA',
  },
  {
    id: 'usa-houma',
    name: 'HOUMA',
    flag: 'USA',
  },
  {
    id: 'usa-charleston',
    name: 'CHARLESTON',
    flag: 'USA',
  },
  {
    id: 'usa-gallipolis',
    name: 'GALLIPOLIS',
    flag: 'USA',
  },
  {
    id: 'usa-usa-486',
    name: 'USA-486',
    flag: 'USA',
  },
  {
    id: 'usa-crisfield',
    name: 'CRISFIELD',
    flag: 'USA',
  },
  {
    id: 'usa-leonardo',
    name: 'LEONARDO',
    flag: 'USA',
  },
  {
    id: 'usa-sneadsferry',
    name: 'SNEADS FERRY',
    flag: 'USA',
  },
  {
    id: 'usa-apollobeach',
    name: 'APOLLO BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-hoonah',
    name: 'HOONAH',
    flag: 'USA',
  },
  {
    id: 'usa-toledo',
    name: 'TOLEDO',
    flag: 'USA',
  },
  {
    id: 'usa-leetsdale',
    name: 'LEETSDALE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-506',
    name: 'USA-506',
    flag: 'USA',
  },
  {
    id: 'usa-awendaw',
    name: 'AWENDAW',
    flag: 'USA',
  },
  {
    id: 'usa-buzzardsbay',
    name: 'BUZZARDS BAY',
    flag: 'USA',
  },
  {
    id: 'usa-daytonabeach',
    name: 'DAYTONA BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-burnsharbor',
    name: 'BURNS HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-riverridge',
    name: 'RIVER RIDGE',
    flag: 'USA',
  },
  {
    id: 'usa-frankfort',
    name: 'FRANKFORT',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1580',
    name: 'USA-1580',
    flag: 'USA',
  },
  {
    id: 'usa-portisabel',
    name: 'PORT ISABEL',
    flag: 'USA',
  },
  {
    id: 'usa-usa-275',
    name: 'USA-275',
    flag: 'USA',
  },
  {
    id: 'usa-shawisland',
    name: 'SHAW ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-manteowaterfront',
    name: 'MANTEO WATERFRONT',
    flag: 'USA',
  },
  {
    id: 'usa-hypoluxo',
    name: 'HYPOLUXO',
    flag: 'USA',
  },
  {
    id: 'usa-redondobeach',
    name: 'REDONDO BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-portjefferson',
    name: 'PORT JEFFERSON',
    flag: 'USA',
  },
  {
    id: 'usa-southwestharbor',
    name: 'SOUTHWEST HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-newshoreham',
    name: 'NEW SHOREHAM',
    flag: 'USA',
  },
  {
    id: 'usa-creosote',
    name: 'CREOSOTE',
    flag: 'USA',
  },
  {
    id: 'usa-isleofhope',
    name: 'ISLE OF HOPE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-746',
    name: 'USA-746',
    flag: 'USA',
  },
  {
    id: 'usa-gramercy',
    name: 'GRAMERCY',
    flag: 'USA',
  },
  {
    id: 'usa-grandhaven',
    name: 'GRAND HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-usa-29',
    name: 'USA-29',
    flag: 'USA',
  },
  {
    id: 'usa-kc875platform',
    name: 'KC875 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-pocasset',
    name: 'POCASSET',
    flag: 'USA',
  },
  {
    id: 'usa-charlevoix',
    name: 'CHARLEVOIX',
    flag: 'USA',
  },
  {
    id: 'usa-milwaukee',
    name: 'MILWAUKEE',
    flag: 'USA',
  },
  {
    id: 'usa-farley',
    name: 'FARLEY',
    flag: 'USA',
  },
  {
    id: 'usa-carolinabeach',
    name: 'CAROLINA BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-portludlow',
    name: 'PORT LUDLOW',
    flag: 'USA',
  },
  {
    id: 'usa-cundyharbor',
    name: 'CUNDY HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-hardin',
    name: 'HARDIN',
    flag: 'USA',
  },
  {
    id: 'usa-bradentonbeach',
    name: 'BRADENTON BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-newportbeach',
    name: 'NEWPORT BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-greenbay',
    name: 'GREEN BAY',
    flag: 'USA',
  },
  {
    id: 'usa-astoria',
    name: 'ASTORIA',
    flag: 'USA',
  },
  {
    id: 'usa-prisoners',
    name: 'PRISONERS',
    flag: 'USA',
  },
  {
    id: 'usa-crystalriver',
    name: 'CRYSTAL RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-swansboro',
    name: 'SWANSBORO',
    flag: 'USA',
  },
  {
    id: 'usa-tacoma',
    name: 'TACOMA',
    flag: 'USA',
  },
  {
    id: 'usa-isleofpalms',
    name: 'ISLE OF PALMS',
    flag: 'USA',
  },
  {
    id: 'usa-brownsville',
    name: 'BROWNSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-portallen',
    name: 'PORT ALLEN',
    flag: 'USA',
  },
  {
    id: 'usa-marcushook',
    name: 'MARCUS HOOK',
    flag: 'USA',
  },
  {
    id: 'usa-oceancity',
    name: 'OCEAN CITY',
    flag: 'USA',
  },
  {
    id: 'usa-edgewater',
    name: 'EDGEWATER',
    flag: 'USA',
  },
  {
    id: 'usa-mobilebay',
    name: 'MOBILE BAY',
    flag: 'USA',
  },
  {
    id: 'usa-portcanaveral',
    name: 'PORT CANAVERAL',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1183',
    name: 'USA-1183',
    flag: 'USA',
  },
  {
    id: 'usa-losangeles',
    name: 'LOS ANGELES',
    flag: 'USA',
  },
  {
    id: 'usa-usa-484',
    name: 'USA-484',
    flag: 'USA',
  },
  {
    id: 'usa-peru',
    name: 'PERU',
    flag: 'USA',
  },
  {
    id: 'usa-northpalmbeach',
    name: 'NORTH PALM BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-st.louis',
    name: 'ST. LOUIS',
    flag: 'USA',
  },
  {
    id: 'usa-freeland',
    name: 'FREELAND',
    flag: 'USA',
  },
  {
    id: 'usa-scituate',
    name: 'SCITUATE',
    flag: 'USA',
  },
  {
    id: 'usa-kalama',
    name: 'KALAMA',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1667',
    name: 'USA-1667',
    flag: 'USA',
  },
  {
    id: 'usa-sandybay',
    name: 'SANDY BAY',
    flag: 'USA',
  },
  {
    id: 'usa-wardcove',
    name: 'WARD COVE',
    flag: 'USA',
  },
  {
    id: 'usa-gardencity',
    name: 'GARDEN CITY',
    flag: 'USA',
  },
  {
    id: 'usa-poughkeepsie',
    name: 'POUGHKEEPSIE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-548',
    name: 'USA-548',
    flag: 'USA',
  },
  {
    id: 'usa-hilo',
    name: 'HILO',
    flag: 'USA',
  },
  {
    id: 'usa-yakutat',
    name: 'YAKUTAT',
    flag: 'USA',
  },
  {
    id: 'usa-garyville',
    name: 'GARYVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-daniabeach',
    name: 'DANIA BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-newburyport',
    name: 'NEWBURYPORT',
    flag: 'USA',
  },
  {
    id: 'usa-falsepass',
    name: 'FALSE PASS',
    flag: 'USA',
  },
  {
    id: 'usa-deerpark',
    name: 'DEER PARK',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1117',
    name: 'USA-1117',
    flag: 'USA',
  },
  {
    id: 'usa-mobile',
    name: 'MOBILE',
    flag: 'USA',
  },
  {
    id: 'usa-northbend',
    name: 'NORTH BEND',
    flag: 'USA',
  },
  {
    id: 'usa-usa-63',
    name: 'USA-63',
    flag: 'USA',
  },
  {
    id: 'usa-mayo',
    name: 'MAYO',
    flag: 'USA',
  },
  {
    id: 'usa-wildwoodcrest',
    name: 'WILDWOOD CREST',
    flag: 'USA',
  },
  {
    id: 'usa-tri-cityport',
    name: 'TRI-CITY PORT',
    flag: 'USA',
  },
  {
    id: 'usa-hoboken',
    name: 'HOBOKEN',
    flag: 'USA',
  },
  {
    id: 'usa-arabi',
    name: 'ARABI',
    flag: 'USA',
  },
  {
    id: 'usa-terramar',
    name: 'TERRA MAR',
    flag: 'USA',
  },
  {
    id: 'usa-delhihills',
    name: 'DELHI HILLS',
    flag: 'USA',
  },
  {
    id: 'usa-imperial',
    name: 'IMPERIAL',
    flag: 'USA',
  },
  {
    id: 'usa-marco',
    name: 'MARCO',
    flag: 'USA',
  },
  {
    id: 'usa-harwichport',
    name: 'HARWICH PORT',
    flag: 'USA',
  },
  {
    id: 'usa-greenport',
    name: 'GREENPORT',
    flag: 'USA',
  },
  {
    id: 'usa-elizabethport',
    name: 'ELIZABETHPORT',
    flag: 'USA',
  },
  {
    id: 'usa-salisbury',
    name: 'SALISBURY',
    flag: 'USA',
  },
  {
    id: 'usa-unionbay',
    name: 'UNION BAY',
    flag: 'USA',
  },
  {
    id: 'usa-warrenton',
    name: 'WARRENTON',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1177',
    name: 'USA-1177',
    flag: 'USA',
  },
  {
    id: 'usa-bayfield',
    name: 'BAYFIELD',
    flag: 'USA',
  },
  {
    id: 'usa-jeffersonville',
    name: 'JEFFERSONVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-reidland',
    name: 'REIDLAND',
    flag: 'USA',
  },
  {
    id: 'usa-adaknavalairstation',
    name: 'ADAK NAVAL AIR STATION',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1327',
    name: 'USA-1327',
    flag: 'USA',
  },
  {
    id: 'usa-michigancity',
    name: 'MICHIGAN CITY',
    flag: 'USA',
  },
  {
    id: 'usa-uyak',
    name: 'UYAK',
    flag: 'USA',
  },
  {
    id: 'usa-redwoodcity',
    name: 'REDWOOD CITY',
    flag: 'USA',
  },
  {
    id: 'usa-usa-609',
    name: 'USA-609',
    flag: 'USA',
  },
  {
    id: 'usa-portclyde',
    name: 'PORT CLYDE',
    flag: 'USA',
  },
  {
    id: 'usa-stjoseph',
    name: 'ST JOSEPH',
    flag: 'USA',
  },
  {
    id: 'usa-antioch',
    name: 'ANTIOCH',
    flag: 'USA',
  },
  {
    id: 'usa-berkeley',
    name: 'BERKELEY',
    flag: 'USA',
  },
  {
    id: 'usa-marathon',
    name: 'MARATHON',
    flag: 'USA',
  },
  {
    id: 'usa-usa-958',
    name: 'USA-958',
    flag: 'USA',
  },
  {
    id: 'usa-hydaburg',
    name: 'HYDABURG',
    flag: 'USA',
  },
  {
    id: 'usa-lacrosse',
    name: 'LA CROSSE',
    flag: 'USA',
  },
  {
    id: 'usa-klawock',
    name: 'KLAWOCK',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1307',
    name: 'USA-1307',
    flag: 'USA',
  },
  {
    id: 'usa-dundalk',
    name: 'DUNDALK',
    flag: 'USA',
  },
  {
    id: 'usa-hollyhill',
    name: 'HOLLY HILL',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1015',
    name: 'USA-1015',
    flag: 'USA',
  },
  {
    id: 'usa-westlongview',
    name: 'WEST LONGVIEW',
    flag: 'USA',
  },
  {
    id: 'usa-edwardspoint',
    name: 'EDWARDS POINT',
    flag: 'USA',
  },
  {
    id: 'usa-wrangell',
    name: 'WRANGELL',
    flag: 'USA',
  },
  {
    id: 'usa-mareisland',
    name: 'MARE ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1881',
    name: 'USA-1881',
    flag: 'USA',
  },
  {
    id: 'usa-greencovesprings',
    name: 'GREEN COVE SPRINGS',
    flag: 'USA',
  },
  {
    id: 'usa-larsenbay',
    name: 'LARSEN BAY',
    flag: 'USA',
  },
  {
    id: 'usa-keybiscayne',
    name: 'KEY BISCAYNE',
    flag: 'USA',
  },
  {
    id: 'usa-westgulfport',
    name: 'WEST GULFPORT',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1882',
    name: 'USA-1882',
    flag: 'USA',
  },
  {
    id: 'usa-loopterminal',
    name: 'LOOP TERMINAL',
    flag: 'USA',
  },
  {
    id: 'usa-verobeach',
    name: 'VERO BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-montaukharbor',
    name: 'MONTAUK HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-wilson',
    name: 'WILSON',
    flag: 'USA',
  },
  {
    id: 'usa-whiting',
    name: 'WHITING',
    flag: 'USA',
  },
  {
    id: 'usa-pri-31',
    name: 'PRI-31',
    flag: 'USA',
  },
  {
    id: 'usa-sandpoint',
    name: 'SAND POINT',
    flag: 'USA',
  },
  {
    id: 'usa-miramarbeach',
    name: 'MIRAMAR BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-mackinacisland',
    name: 'MACKINAC ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-francisville',
    name: 'FRANCISVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-poulsbo',
    name: 'POULSBO',
    flag: 'USA',
  },
  {
    id: 'usa-jackbay',
    name: 'JACK BAY',
    flag: 'USA',
  },
  {
    id: 'usa-bremerton',
    name: 'BREMERTON',
    flag: 'USA',
  },
  {
    id: 'usa-usa-898',
    name: 'USA-898',
    flag: 'USA',
  },
  {
    id: 'usa-marseilles',
    name: 'MARSEILLES',
    flag: 'USA',
  },
  {
    id: 'usa-sanakisland',
    name: 'SANAK ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-st.jamesharbor',
    name: 'ST. JAMES HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-suquamish',
    name: 'SUQUAMISH',
    flag: 'USA',
  },
  {
    id: 'usa-portarmstrong',
    name: 'PORT ARMSTRONG',
    flag: 'USA',
  },
  {
    id: 'usa-masonboro',
    name: 'MASONBORO',
    flag: 'USA',
  },
  {
    id: 'usa-oceanridge',
    name: 'OCEAN RIDGE',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1592',
    name: 'USA-1592',
    flag: 'USA',
  },
  {
    id: 'usa-valparaiso',
    name: 'VALPARAISO',
    flag: 'USA',
  },
  {
    id: 'usa-langley',
    name: 'LANGLEY',
    flag: 'USA',
  },
  {
    id: 'usa-pennsauken',
    name: 'PENNSAUKEN',
    flag: 'USA',
  },
  {
    id: 'usa-wilmingtonisland',
    name: 'WILMINGTON ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-northfortmyers',
    name: 'NORTH FORT MYERS',
    flag: 'USA',
  },
  {
    id: 'usa-midland',
    name: 'MIDLAND',
    flag: 'USA',
  },
  {
    id: 'usa-palmcoast',
    name: 'PALM COAST',
    flag: 'USA',
  },
  {
    id: 'usa-palmetto',
    name: 'PALMETTO',
    flag: 'USA',
  },
  {
    id: 'usa-eastgreenwich',
    name: 'EAST GREENWICH',
    flag: 'USA',
  },
  {
    id: 'usa-claymont',
    name: 'CLAYMONT',
    flag: 'USA',
  },
  {
    id: 'usa-eastdubuque',
    name: 'EAST DUBUQUE',
    flag: 'USA',
  },
  {
    id: 'usa-belfast',
    name: 'BELFAST',
    flag: 'USA',
  },
  {
    id: 'usa-alpena',
    name: 'ALPENA',
    flag: 'USA',
  },
  {
    id: 'usa-bettendorf',
    name: 'BETTENDORF',
    flag: 'USA',
  },
  {
    id: 'usa-eastchicago',
    name: 'EAST CHICAGO',
    flag: 'USA',
  },
  {
    id: 'usa-bayonne',
    name: 'BAYONNE',
    flag: 'USA',
  },
  {
    id: 'usa-pekin',
    name: 'PEKIN',
    flag: 'USA',
  },
  {
    id: 'usa-usa-1739',
    name: 'USA-1739',
    flag: 'USA',
  },
  {
    id: 'usa-monroe',
    name: 'MONROE',
    flag: 'USA',
  },
  {
    id: 'usa-prien',
    name: 'PRIEN',
    flag: 'USA',
  },
  {
    id: 'usa-brownesvillefishingharbor',
    name: 'BROWNESVILLE FISHING HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-monumentbeach',
    name: 'MONUMENT BEACH',
    flag: 'USA',
  },
]

export default ports
