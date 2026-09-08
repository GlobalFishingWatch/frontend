const ports = [
  {
    id: 'aia-blowingpointvillage',
    name: 'BLOWING POINT VILLAGE',
    flag: 'AIA',
  },
  {
    id: 'ala-degerby',
    name: 'DEGERBY',
    flag: 'ALA',
  },
  {
    id: 'ala-kokar',
    name: 'KOKAR',
    flag: 'ALA',
  },
  {
    id: 'ala-kokarkyrkoby',
    name: 'KOKAR KYRKOBY',
    flag: 'ALA',
  },
  {
    id: 'ala-krokarna',
    name: 'KROKARNA',
    flag: 'ALA',
  },
  {
    id: 'ala-kumlinge',
    name: 'KUMLINGE',
    flag: 'ALA',
  },
  {
    id: 'ala-sottunga',
    name: 'SOTTUNGA',
    flag: 'ALA',
  },
  {
    id: 'ala-sund',
    name: 'SUND',
    flag: 'ALA',
  },
  {
    id: 'arg-barranqueras',
    name: 'BARRANQUERAS',
    flag: 'ARG',
  },
  {
    id: 'arg-corrientes',
    name: 'CORRIENTES',
    flag: 'ARG',
  },
  {
    id: 'arg-diamante',
    name: 'DIAMANTE',
    flag: 'ARG',
  },
  {
    id: 'arg-km456',
    name: 'KM 456',
    flag: 'ARG',
  },
  {
    id: 'arg-sannicolasdelosarroyos',
    name: 'SAN NICOLAS DE LOS ARROYOS',
    flag: 'ARG',
  },
  {
    id: 'arg-santafe',
    name: 'SANTA FE',
    flag: 'ARG',
  },
  {
    id: 'arg-yacyretadam',
    name: 'YACYRETA DAM',
    flag: 'ARG',
  },
  {
    id: 'atg-crabbs',
    name: 'CRABBS',
    flag: 'ATG',
  },
  {
    id: 'atg-greatbirdisland',
    name: 'GREAT BIRD ISLAND',
    flag: 'ATG',
  },
  {
    id: 'aus-aulst',
    name: 'AU LST',
    flag: 'AUS',
  },
  {
    id: 'aus-banksiapeninsula',
    name: 'BANKSIA PENINSULA',
    flag: 'AUS',
  },
  {
    id: 'aus-barnesbay',
    name: 'BARNES BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-bdockx00005',
    name: 'BDOCKX00005',
    flag: 'AUS',
  },
  {
    id: 'aus-bed',
    name: 'BED',
    flag: 'AUS',
  },
  {
    id: 'aus-belmont',
    name: 'BELMONT',
    flag: 'AUS',
  },
  {
    id: 'aus-birkdale',
    name: 'BIRKDALE',
    flag: 'AUS',
  },
  {
    id: 'aus-brooklyn',
    name: 'BROOKLYN',
    flag: 'AUS',
  },
  {
    id: 'aus-brunyisland',
    name: 'BRUNY ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-callalabay',
    name: 'CALLALA BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-coalpoint',
    name: 'COAL POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-coochiemudloisland',
    name: 'COOCHIEMUDLO ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-cooperalleybay',
    name: 'COOPER ALLEY BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-cygnet',
    name: 'CYGNET',
    flag: 'AUS',
  },
  {
    id: 'aus-dukeisland',
    name: 'DUKE ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-dunwich',
    name: 'DUNWICH',
    flag: 'AUS',
  },
  {
    id: 'aus-earls',
    name: 'EARLS',
    flag: 'AUS',
  },
  {
    id: 'aus-eastgosford',
    name: 'EAST GOSFORD',
    flag: 'AUS',
  },
  {
    id: 'aus-eleebana',
    name: 'ELEEBANA',
    flag: 'AUS',
  },
  {
    id: 'aus-franklin',
    name: 'FRANKLIN',
    flag: 'AUS',
  },
  {
    id: 'aus-gordonriver',
    name: 'GORDON RIVER',
    flag: 'AUS',
  },
  {
    id: 'aus-grayspoint',
    name: 'GRAYS POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-greatbay',
    name: 'GREAT BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-greenwellpoint',
    name: 'GREENWELL POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-harwood',
    name: 'HARWOOD',
    flag: 'AUS',
  },
  {
    id: 'aus-hastings',
    name: 'HASTINGS',
    flag: 'AUS',
  },
  {
    id: 'aus-ina',
    name: 'INA',
    flag: 'AUS',
  },
  {
    id: 'aus-karragarraisland',
    name: 'KARRAGARRA ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-kettering',
    name: 'KETTERING',
    flag: 'AUS',
  },
  {
    id: 'aus-laurieton',
    name: 'LAURIETON',
    flag: 'AUS',
  },
  {
    id: 'aus-lockb00005',
    name: 'LOCKB00005',
    flag: 'AUS',
  },
  {
    id: 'aus-lodgebay',
    name: 'LODGE BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-maclean',
    name: 'MACLEAN',
    flag: 'AUS',
  },
  {
    id: 'aus-macleayisland',
    name: 'MACLEAY ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-missionarybay',
    name: 'MISSIONARY BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-morningside',
    name: 'MORNINGSIDE',
    flag: 'AUS',
  },
  {
    id: 'aus-newcastleaus',
    name: 'NEWCASTLE AUS',
    flag: 'AUS',
  },
  {
    id: 'aus-patongabeach',
    name: 'PATONGA BEACH',
    flag: 'AUS',
  },
  {
    id: 'aus-porthuon',
    name: 'PORT HUON',
    flag: 'AUS',
  },
  {
    id: 'aus-portobris',
    name: 'PORT O BRIS',
    flag: 'AUS',
  },
  {
    id: 'aus-portstephens',
    name: 'PORT STEPHENS',
    flag: 'AUS',
  },
  {
    id: 'aus-ptvincent',
    name: 'PT VINCENT',
    flag: 'AUS',
  },
  {
    id: 'aus-randallsbay',
    name: 'RANDALLS BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-rathmines',
    name: 'RATHMINES',
    flag: 'AUS',
  },
  {
    id: 'aus-redlandbay',
    name: 'REDLAND BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-rockingham',
    name: 'ROCKINGHAM',
    flag: 'AUS',
  },
  {
    id: 'aus-somerville',
    name: 'SOMERVILLE',
    flag: 'AUS',
  },
  {
    id: 'aus-southbrisbane',
    name: 'SOUTH BRISBANE',
    flag: 'AUS',
  },
  {
    id: 'aus-taranna',
    name: 'TARANNA',
    flag: 'AUS',
  },
  {
    id: 'aus-toronto',
    name: 'TORONTO',
    flag: 'AUS',
  },
  {
    id: 'aus-victoriapoint',
    name: 'VICTORIA POINT',
    flag: 'AUS',
  },
  {
    id: 'aut-baddeutsch-altenburg',
    name: 'BAD DEUTSCH-ALTENBURG',
    flag: 'AUT',
  },
  {
    id: 'aut-bisamberg',
    name: 'BISAMBERG',
    flag: 'AUT',
  },
  {
    id: 'aut-bratislava',
    name: 'BRATISLAVA',
    flag: 'AUT',
  },
  {
    id: 'aut-budapest',
    name: 'BUDAPEST',
    flag: 'AUT',
  },
  {
    id: 'aut-durnstein',
    name: 'DURNSTEIN',
    flag: 'AUT',
  },
  {
    id: 'aut-enns',
    name: 'ENNS',
    flag: 'AUT',
  },
  {
    id: 'aut-ennsdorf',
    name: 'ENNSDORF',
    flag: 'AUT',
  },
  {
    id: 'aut-feldkirchenanderdonau',
    name: 'FELDKIRCHEN AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'aut-freudenau',
    name: 'FREUDENAU',
    flag: 'AUT',
  },
  {
    id: 'aut-goldworth',
    name: 'GOLDWORTH',
    flag: 'AUT',
  },
  {
    id: 'aut-grafenworth',
    name: 'GRAFENWORTH',
    flag: 'AUT',
  },
  {
    id: 'aut-hainburganderdonau',
    name: 'HAINBURG AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'aut-hofamtpriel',
    name: 'HOFAMT PRIEL',
    flag: 'AUT',
  },
  {
    id: 'aut-kirchbergobderdonau',
    name: 'KIRCHBERG OB DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'aut-klein-pochlarn',
    name: 'KLEIN-POCHLARN',
    flag: 'AUT',
  },
  {
    id: 'aut-korneuburg',
    name: 'KORNEUBURG',
    flag: 'AUT',
  },
  {
    id: 'aut-krems',
    name: 'KREMS',
    flag: 'AUT',
  },
  {
    id: 'aut-kremsanderdonau',
    name: 'KREMS AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'aut-langenzersdorf',
    name: 'LANGENZERSDORF',
    flag: 'AUT',
  },
  {
    id: 'aut-leiben',
    name: 'LEIBEN',
    flag: 'AUT',
  },
  {
    id: 'aut-linz',
    name: 'LINZ',
    flag: 'AUT',
  },
  {
    id: 'aut-lobau',
    name: 'LOBAU',
    flag: 'AUT',
  },
  {
    id: 'aut-marbachanderdonau',
    name: 'MARBACH AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'aut-melk',
    name: 'MELK',
    flag: 'AUT',
  },
  {
    id: 'aut-petronell-carnuntum',
    name: 'PETRONELL-CARNUNTUM',
    flag: 'AUT',
  },
  {
    id: 'aut-pischelsdorf',
    name: 'PISCHELSDORF',
    flag: 'AUT',
  },
  {
    id: 'aut-regensburg',
    name: 'REGENSBURG',
    flag: 'AUT',
  },
  {
    id: 'aut-sanktaegidi',
    name: 'SANKT AEGIDI',
    flag: 'AUT',
  },
  {
    id: 'aut-scharndorf',
    name: 'SCHARNDORF',
    flag: 'AUT',
  },
  {
    id: 'aut-schwechat',
    name: 'SCHWECHAT',
    flag: 'AUT',
  },
  {
    id: 'aut-strengberg',
    name: 'STRENGBERG',
    flag: 'AUT',
  },
  {
    id: 'aut-tulln',
    name: 'TULLN',
    flag: 'AUT',
  },
  {
    id: 'aut-waldkirchenamwesen',
    name: 'WALDKIRCHEN AM WESEN',
    flag: 'AUT',
  },
  {
    id: 'aut-weinzierlbeikrems',
    name: 'WEINZIERL BEI KREMS',
    flag: 'AUT',
  },
  {
    id: 'aut-weissenkircheninderwachau',
    name: 'WEISSENKIRCHEN IN DER WACHAU',
    flag: 'AUT',
  },
  {
    id: 'aut-wien',
    name: 'WIEN',
    flag: 'AUT',
  },
  {
    id: 'aut-wiennussdorf',
    name: 'WIEN NUSSDORF',
    flag: 'AUT',
  },
  {
    id: 'aut-wolfsthal',
    name: 'WOLFSTHAL',
    flag: 'AUT',
  },
  {
    id: 'aut-ybbsanderdonau',
    name: 'YBBS AN DER DONAU',
    flag: 'AUT',
  },
  {
    id: 'aze-absheron',
    name: 'ABSHERON',
    flag: 'AZE',
  },
  {
    id: 'aze-absheronanchorage',
    name: 'ABSHERON ANCHORAGE',
    flag: 'AZE',
  },
  {
    id: 'aze-chilov',
    name: 'CHILOV',
    flag: 'AZE',
  },
  {
    id: 'aze-guneshli',
    name: 'GUNESHLI',
    flag: 'AZE',
  },
  {
    id: 'aze-qaradagh',
    name: 'QARADAGH',
    flag: 'AZE',
  },
  {
    id: 'aze-qobustan',
    name: 'QOBUSTAN',
    flag: 'AZE',
  },
  {
    id: 'aze-sangachal',
    name: 'SANGACHAL',
    flag: 'AZE',
  },
  {
    id: 'bel-aalst',
    name: 'AALST',
    flag: 'BEL',
  },
  {
    id: 'bel-aalterbrug',
    name: 'AALTERBRUG',
    flag: 'BEL',
  },
  {
    id: 'bel-andenne',
    name: 'ANDENNE',
    flag: 'BEL',
  },
  {
    id: 'bel-avelgem',
    name: 'AVELGEM',
    flag: 'BEL',
  },
  {
    id: 'bel-baasrode',
    name: 'BAASRODE',
    flag: 'BEL',
  },
  {
    id: 'bel-beernem',
    name: 'BEERNEM',
    flag: 'BEL',
  },
  {
    id: 'bel-bocholt',
    name: 'BOCHOLT',
    flag: 'BEL',
  },
  {
    id: 'bel-bree',
    name: 'BREE',
    flag: 'BEL',
  },
  {
    id: 'bel-brussels',
    name: 'BRUSSELS',
    flag: 'BEL',
  },
  {
    id: 'bel-charleroi',
    name: 'CHARLEROI',
    flag: 'BEL',
  },
  {
    id: 'bel-clairehaie',
    name: 'CLAIRE HAIE',
    flag: 'BEL',
  },
  {
    id: 'bel-deinze',
    name: 'DEINZE',
    flag: 'BEL',
  },
  {
    id: 'bel-dendermonde',
    name: 'DENDERMONDE',
    flag: 'BEL',
  },
  {
    id: 'bel-dessel',
    name: 'DESSEL',
    flag: 'BEL',
  },
  {
    id: 'bel-dinant',
    name: 'DINANT',
    flag: 'BEL',
  },
  {
    id: 'bel-duffel',
    name: 'DUFFEL',
    flag: 'BEL',
  },
  {
    id: 'bel-engis',
    name: 'ENGIS',
    flag: 'BEL',
  },
  {
    id: 'bel-farciennes',
    name: 'FARCIENNES',
    flag: 'BEL',
  },
  {
    id: 'bel-floriffoux',
    name: 'FLORIFFOUX',
    flag: 'BEL',
  },
  {
    id: 'bel-gavere',
    name: 'GAVERE',
    flag: 'BEL',
  },
  {
    id: 'bel-geel',
    name: 'GEEL',
    flag: 'BEL',
  },
  {
    id: 'bel-genk',
    name: 'GENK',
    flag: 'BEL',
  },
  {
    id: 'bel-gevaarts',
    name: 'GEVAARTS',
    flag: 'BEL',
  },
  {
    id: 'bel-ghlin',
    name: 'GHLIN',
    flag: 'BEL',
  },
  {
    id: 'bel-halle',
    name: 'HALLE',
    flag: 'BEL',
  },
  {
    id: 'bel-harelbeke',
    name: 'HARELBEKE',
    flag: 'BEL',
  },
  {
    id: 'bel-hasselt',
    name: 'HASSELT',
    flag: 'BEL',
  },
  {
    id: 'bel-huy',
    name: 'HUY',
    flag: 'BEL',
  },
  {
    id: 'bel-izegem',
    name: 'IZEGEM',
    flag: 'BEL',
  },
  {
    id: 'bel-kapelle-op-den-bos',
    name: 'KAPELLE-OP-DEN-BOS',
    flag: 'BEL',
  },
  {
    id: 'bel-kloosterveld',
    name: 'KLOOSTERVELD',
    flag: 'BEL',
  },
  {
    id: 'bel-kluisbergen',
    name: 'KLUISBERGEN',
    flag: 'BEL',
  },
  {
    id: 'bel-kortrijk',
    name: 'KORTRIJK',
    flag: 'BEL',
  },
  {
    id: 'bel-lalouviere',
    name: 'LA LOUVIERE',
    flag: 'BEL',
  },
  {
    id: 'bel-lanaken',
    name: 'LANAKEN',
    flag: 'BEL',
  },
  {
    id: 'bel-liege',
    name: 'LIEGE',
    flag: 'BEL',
  },
  {
    id: 'bel-lier',
    name: 'LIER',
    flag: 'BEL',
  },
  {
    id: 'bel-mechelen',
    name: 'MECHELEN',
    flag: 'BEL',
  },
  {
    id: 'bel-merelbeke',
    name: 'MERELBEKE',
    flag: 'BEL',
  },
  {
    id: 'bel-moerbrugge',
    name: 'MOERBRUGGE',
    flag: 'BEL',
  },
  {
    id: 'bel-mons',
    name: 'MONS',
    flag: 'BEL',
  },
  {
    id: 'bel-nameche',
    name: 'NAMECHE',
    flag: 'BEL',
  },
  {
    id: 'bel-namur',
    name: 'NAMUR',
    flag: 'BEL',
  },
  {
    id: 'bel-olen',
    name: 'OLEN',
    flag: 'BEL',
  },
  {
    id: 'bel-oudenaarde',
    name: 'OUDENAARDE',
    flag: 'BEL',
  },
  {
    id: 'bel-overpelt',
    name: 'OVERPELT',
    flag: 'BEL',
  },
  {
    id: 'bel-pecq',
    name: 'PECQ',
    flag: 'BEL',
  },
  {
    id: 'bel-peruwelz',
    name: 'PERUWELZ',
    flag: 'BEL',
  },
  {
    id: 'bel-roeselare',
    name: 'ROESELARE',
    flag: 'BEL',
  },
  {
    id: 'bel-roeulx',
    name: 'ROEULX',
    flag: 'BEL',
  },
  {
    id: 'bel-rumst',
    name: 'RUMST',
    flag: 'BEL',
  },
  {
    id: 'bel-rupelmonde',
    name: 'RUPELMONDE',
    flag: 'BEL',
  },
  {
    id: 'bel-saint-ghislain',
    name: 'SAINT-GHISLAIN',
    flag: 'BEL',
  },
  {
    id: 'bel-sint-eloois-vijve',
    name: 'SINT-ELOOIS-VIJVE',
    flag: 'BEL',
  },
  {
    id: 'bel-spiere-helkijn',
    name: 'SPIERE-HELKIJN',
    flag: 'BEL',
  },
  {
    id: 'bel-temse',
    name: 'TEMSE',
    flag: 'BEL',
  },
  {
    id: 'bel-thiange',
    name: 'THIANGE',
    flag: 'BEL',
  },
  {
    id: 'bel-tournai',
    name: 'TOURNAI',
    flag: 'BEL',
  },
  {
    id: 'bel-tubize',
    name: 'TUBIZE',
    flag: 'BEL',
  },
  {
    id: 'bel-turnhout',
    name: 'TURNHOUT',
    flag: 'BEL',
  },
  {
    id: 'bel-vise',
    name: 'VISE',
    flag: 'BEL',
  },
  {
    id: 'bel-wielsbeke',
    name: 'WIELSBEKE',
    flag: 'BEL',
  },
  {
    id: 'bel-yvoir',
    name: 'YVOIR',
    flag: 'BEL',
  },
  {
    id: 'bel-zingem',
    name: 'ZINGEM',
    flag: 'BEL',
  },
  {
    id: 'bgr-lom',
    name: 'LOM',
    flag: 'BGR',
  },
  {
    id: 'bgr-nikopol',
    name: 'NIKOPOL',
    flag: 'BGR',
  },
  {
    id: 'bgr-novoselo',
    name: 'NOVO SELO',
    flag: 'BGR',
  },
  {
    id: 'bgr-ruse',
    name: 'RUSE',
    flag: 'BGR',
  },
  {
    id: 'bgr-silistra',
    name: 'SILISTRA',
    flag: 'BGR',
  },
  {
    id: 'bgr-somovit',
    name: 'SOMOVIT',
    flag: 'BGR',
  },
  {
    id: 'bgr-svishtov',
    name: 'SVISHTOV',
    flag: 'BGR',
  },
  {
    id: 'bgr-tutrakan',
    name: 'TUTRAKAN',
    flag: 'BGR',
  },
  {
    id: 'bgr-vidin',
    name: 'VIDIN',
    flag: 'BGR',
  },
  {
    id: 'bhs-sampsoncay',
    name: 'SAMPSON CAY',
    flag: 'BHS',
  },
  {
    id: 'bol-ptosuarezbolivia',
    name: 'PTO SUAREZ BOLIVIA',
    flag: 'BOL',
  },
  {
    id: 'bra-coari',
    name: 'COARI',
    flag: 'BRA',
  },
  {
    id: 'bra-guaraquecaba',
    name: 'GUARAQUECABA',
    flag: 'BRA',
  },
  {
    id: 'bra-igarape-miri',
    name: 'IGARAPE-MIRI',
    flag: 'BRA',
  },
  {
    id: 'bra-ipojuca',
    name: 'IPOJUCA',
    flag: 'BRA',
  },
  {
    id: 'bra-ladario',
    name: 'LADARIO',
    flag: 'BRA',
  },
  {
    id: 'bra-limoeirodoajuru',
    name: 'LIMOEIRO DO AJURU',
    flag: 'BRA',
  },
  {
    id: 'bra-munguba',
    name: 'MUNGUBA',
    flag: 'BRA',
  },
  {
    id: 'bra-pelotas',
    name: 'PELOTAS',
    flag: 'BRA',
  },
  {
    id: 'bra-puertoesperanca',
    name: 'PUERTO ESPERANCA',
    flag: 'BRA',
  },
  {
    id: 'bra-santaluziadoitanhy',
    name: 'SANTA LUZIA DO ITANHY',
    flag: 'BRA',
  },
  {
    id: 'bra-saocaetanodeodivelas',
    name: 'SAO CAETANO DE ODIVELAS',
    flag: 'BRA',
  },
  {
    id: 'can-dentisland',
    name: 'DENT ISLAND',
    flag: 'CAN',
  },
  {
    id: 'can-dorval',
    name: 'DORVAL',
    flag: 'CAN',
  },
  {
    id: 'can-gananoque',
    name: 'GANANOQUE',
    flag: 'CAN',
  },
  {
    id: 'can-goderich',
    name: 'GODERICH',
    flag: 'CAN',
  },
  {
    id: 'can-heriotbay',
    name: 'HERIOT BAY',
    flag: 'CAN',
  },
  {
    id: 'can-johnstown',
    name: 'JOHNSTOWN',
    flag: 'CAN',
  },
  {
    id: 'can-killarney',
    name: 'KILLARNEY',
    flag: 'CAN',
  },
  {
    id: 'can-kingston',
    name: 'KINGSTON',
    flag: 'CAN',
  },
  {
    id: 'can-klemtu',
    name: 'KLEMTU',
    flag: 'CAN',
  },
  {
    id: 'can-leamington',
    name: 'LEAMINGTON',
    flag: 'CAN',
  },
  {
    id: 'can-littlecurrent',
    name: 'LITTLE CURRENT',
    flag: 'CAN',
  },
  {
    id: 'can-meldrumbay',
    name: 'MELDRUM BAY',
    flag: 'CAN',
  },
  {
    id: 'can-minkisland',
    name: 'MINK ISLAND',
    flag: 'CAN',
  },
  {
    id: 'can-nanticoke',
    name: 'NANTICOKE',
    flag: 'CAN',
  },
  {
    id: 'can-ottawa',
    name: 'OTTAWA',
    flag: 'CAN',
  },
  {
    id: 'can-portcredit',
    name: 'PORT CREDIT',
    flag: 'CAN',
  },
  {
    id: 'can-portsevern',
    name: 'PORT SEVERN',
    flag: 'CAN',
  },
  {
    id: 'can-saintzotique',
    name: 'SAINT ZOTIQUE',
    flag: 'CAN',
  },
  {
    id: 'can-saultstemarie',
    name: 'SAULT STE MARIE',
    flag: 'CAN',
  },
  {
    id: 'can-toronto',
    name: 'TORONTO',
    flag: 'CAN',
  },
  {
    id: 'che-basel',
    name: 'BASEL',
    flag: 'CHE',
  },
  {
    id: 'che-kaiseraugst',
    name: 'KAISERAUGST',
    flag: 'CHE',
  },
  {
    id: 'chl-achao',
    name: 'ACHAO',
    flag: 'CHL',
  },
  {
    id: 'chl-alao',
    name: 'ALAO',
    flag: 'CHL',
  },
  {
    id: 'chl-alqui',
    name: 'ALQUI',
    flag: 'CHL',
  },
  {
    id: 'chl-angelmo',
    name: 'ANGELMO',
    flag: 'CHL',
  },
  {
    id: 'chl-anihue',
    name: 'ANIHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-antiquina',
    name: 'ANTIQUINA',
    flag: 'CHL',
  },
  {
    id: 'chl-apiao',
    name: 'APIAO',
    flag: 'CHL',
  },
  {
    id: 'chl-arauco',
    name: 'ARAUCO',
    flag: 'CHL',
  },
  {
    id: 'chl-auchac',
    name: 'AUCHAC',
    flag: 'CHL',
  },
  {
    id: 'chl-aucho',
    name: 'AUCHO',
    flag: 'CHL',
  },
  {
    id: 'chl-aulen',
    name: 'AULEN',
    flag: 'CHL',
  },
  {
    id: 'chl-aulin',
    name: 'AULIN',
    flag: 'CHL',
  },
  {
    id: 'chl-bahiailque',
    name: 'BAHIA ILQUE',
    flag: 'CHL',
  },
  {
    id: 'chl-bahiasalada',
    name: 'BAHIA SALADA',
    flag: 'CHL',
  },
  {
    id: 'chl-barranquilla',
    name: 'BARRANQUILLA',
    flag: 'CHL',
  },
  {
    id: 'chl-bascunan',
    name: 'BASCUNAN',
    flag: 'CHL',
  },
  {
    id: 'chl-bocabudi',
    name: 'BOCA BUDI',
    flag: 'CHL',
  },
  {
    id: 'chl-bocaderapel',
    name: 'BOCA DE RAPEL',
    flag: 'CHL',
  },
  {
    id: 'chl-bocasur',
    name: 'BOCA SUR',
    flag: 'CHL',
  },
  {
    id: 'chl-boyeruca',
    name: 'BOYERUCA',
    flag: 'CHL',
  },
  {
    id: 'chl-buill',
    name: 'BUILL',
    flag: 'CHL',
  },
  {
    id: 'chl-caguach',
    name: 'CAGUACH',
    flag: 'CHL',
  },
  {
    id: 'chl-cahuil',
    name: 'CAHUIL',
    flag: 'CHL',
  },
  {
    id: 'chl-caicura',
    name: 'CAICURA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletaaguadelazorra',
    name: 'CALETA AGUA DE LA ZORRA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletaangosta',
    name: 'CALETA ANGOSTA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletaarica',
    name: 'CALETA ARICA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletabuena',
    name: 'CALETA BUENA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletacarrizalilloomamani',
    name: 'CALETA CARRIZALILLO O MAMANI',
    flag: 'CHL',
  },
  {
    id: 'chl-caletachanaral',
    name: 'CALETA CHANARAL',
    flag: 'CHL',
  },
  {
    id: 'chl-caletacobija',
    name: 'CALETA COBIJA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletagualaguala',
    name: 'CALETA GUALAGUALA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletagutierrez',
    name: 'CALETA GUTIERREZ',
    flag: 'CHL',
  },
  {
    id: 'chl-caletahornitos',
    name: 'CALETA HORNITOS',
    flag: 'CHL',
  },
  {
    id: 'chl-caletahuachan',
    name: 'CALETA HUACHAN',
    flag: 'CHL',
  },
  {
    id: 'chl-caletahuasco',
    name: 'CALETA HUASCO',
    flag: 'CHL',
  },
  {
    id: 'chl-caletalosbronces',
    name: 'CALETA LOS BRONCES',
    flag: 'CHL',
  },
  {
    id: 'chl-caletalosburrossur',
    name: 'CALETA LOS BURROS SUR',
    flag: 'CHL',
  },
  {
    id: 'chl-caletapoyo',
    name: 'CALETA POYO',
    flag: 'CHL',
  },
  {
    id: 'chl-calle',
    name: 'CALLE',
    flag: 'CHL',
  },
  {
    id: 'chl-canamo',
    name: 'CANAMO',
    flag: 'CHL',
  },
  {
    id: 'chl-cariquilda',
    name: 'CARIQUILDA',
    flag: 'CHL',
  },
  {
    id: 'chl-casadepesca',
    name: 'CASA DE PESCA',
    flag: 'CHL',
  },
  {
    id: 'chl-casadepiedra(tiruasur7)',
    name: 'CASA DE PIEDRA (TIRUA SUR 7)',
    flag: 'CHL',
  },
  {
    id: 'chl-cascabeles',
    name: 'CASCABELES',
    flag: 'CHL',
  },
  {
    id: 'chl-cascajal',
    name: 'CASCAJAL',
    flag: 'CHL',
  },
  {
    id: 'chl-castro',
    name: 'CASTRO',
    flag: 'CHL',
  },
  {
    id: 'chl-caulin',
    name: 'CAULIN',
    flag: 'CHL',
  },
  {
    id: 'chl-cerroverde',
    name: 'CERRO VERDE',
    flag: 'CHL',
  },
  {
    id: 'chl-chaicas',
    name: 'CHAICAS',
    flag: 'CHL',
  },
  {
    id: 'chl-chaiten',
    name: 'CHAITEN',
    flag: 'CHL',
  },
  {
    id: 'chl-chamiza',
    name: 'CHAMIZA',
    flag: 'CHL',
  },
  {
    id: 'chl-chana',
    name: 'CHANA',
    flag: 'CHL',
  },
  {
    id: 'chl-chanavaya',
    name: 'CHANAVAYA',
    flag: 'CHL',
  },
  {
    id: 'chl-chanchan',
    name: 'CHAN CHAN',
    flag: 'CHL',
  },
  {
    id: 'chl-chanhue',
    name: 'CHANHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-chauchil',
    name: 'CHAUCHIL',
    flag: 'CHL',
  },
  {
    id: 'chl-chauquear&islapuluqui',
    name: 'CHAUQUEAR & ISLA PULUQUI',
    flag: 'CHL',
  },
  {
    id: 'chl-chayahue',
    name: 'CHAYAHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-cheniao',
    name: 'CHENIAO',
    flag: 'CHL',
  },
  {
    id: 'chl-chepu',
    name: 'CHEPU',
    flag: 'CHL',
  },
  {
    id: 'chl-chigualoco',
    name: 'CHIGUALOCO',
    flag: 'CHL',
  },
  {
    id: 'chl-cholgo',
    name: 'CHOLGO',
    flag: 'CHL',
  },
  {
    id: 'chl-cholgue',
    name: 'CHOLGUE',
    flag: 'CHL',
  },
  {
    id: 'chl-chonchi',
    name: 'CHONCHI',
    flag: 'CHL',
  },
  {
    id: 'chl-chuit',
    name: 'CHUIT',
    flag: 'CHL',
  },
  {
    id: 'chl-chulcuy',
    name: 'CHULCUY',
    flag: 'CHL',
  },
  {
    id: 'chl-chulin',
    name: 'CHULIN',
    flag: 'CHL',
  },
  {
    id: 'chl-chumelden',
    name: 'CHUMELDEN',
    flag: 'CHL',
  },
  {
    id: 'chl-cobquecura',
    name: 'COBQUECURA',
    flag: 'CHL',
  },
  {
    id: 'chl-cochamo',
    name: 'COCHAMO',
    flag: 'CHL',
  },
  {
    id: 'chl-coihuin',
    name: 'COIHUIN',
    flag: 'CHL',
  },
  {
    id: 'chl-colaco',
    name: 'COLACO',
    flag: 'CHL',
  },
  {
    id: 'chl-colcura',
    name: 'COLCURA',
    flag: 'CHL',
  },
  {
    id: 'chl-comillahue(tiruasur6)',
    name: 'COMILLAHUE (TIRUA SUR 6)',
    flag: 'CHL',
  },
  {
    id: 'chl-compu',
    name: 'COMPU',
    flag: 'CHL',
  },
  {
    id: 'chl-condor',
    name: 'CONDOR',
    flag: 'CHL',
  },
  {
    id: 'chl-conimo&hueihue',
    name: 'CONIMO & HUEIHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-contao',
    name: 'CONTAO',
    flag: 'CHL',
  },
  {
    id: 'chl-cubero',
    name: 'CUBERO',
    flag: 'CHL',
  },
  {
    id: 'chl-cuevadeperez',
    name: 'CUEVA DE PEREZ',
    flag: 'CHL',
  },
  {
    id: 'chl-curanue',
    name: 'CURANUE',
    flag: 'CHL',
  },
  {
    id: 'chl-desembocadurariomaipo',
    name: 'DESEMBOCADURA RIO MAIPO',
    flag: 'CHL',
  },
  {
    id: 'chl-dichato',
    name: 'DICHATO',
    flag: 'CHL',
  },
  {
    id: 'chl-duhatao',
    name: 'DUHATAO',
    flag: 'CHL',
  },
  {
    id: 'chl-elapolillado',
    name: 'EL APOLILLADO',
    flag: 'CHL',
  },
  {
    id: 'chl-eldique',
    name: 'EL DIQUE',
    flag: 'CHL',
  },
  {
    id: 'chl-elmanzano(hualaihue)',
    name: 'EL MANZANO (HUALAIHUE)',
    flag: 'CHL',
  },
  {
    id: 'chl-elmorado',
    name: 'EL MORADO',
    flag: 'CHL',
  },
  {
    id: 'chl-elmorro(lota)&laconchilla',
    name: 'EL MORRO (LOTA) & LA CONCHILLA',
    flag: 'CHL',
  },
  {
    id: 'chl-elrefugio',
    name: 'EL REFUGIO',
    flag: 'CHL',
  },
  {
    id: 'chl-elrosario',
    name: 'EL ROSARIO',
    flag: 'CHL',
  },
  {
    id: 'chl-elsauce',
    name: 'EL SAUCE',
    flag: 'CHL',
  },
  {
    id: 'chl-ensueno-sarco',
    name: 'ENSUENO - SARCO',
    flag: 'CHL',
  },
  {
    id: 'chl-estaquilla',
    name: 'ESTAQUILLA',
    flag: 'CHL',
  },
  {
    id: 'chl-higuerillas',
    name: 'HIGUERILLAS',
    flag: 'CHL',
  },
  {
    id: 'chl-horcon',
    name: 'HORCON',
    flag: 'CHL',
  },
  {
    id: 'chl-hornos',
    name: 'HORNOS',
    flag: 'CHL',
  },
  {
    id: 'chl-huahuar',
    name: 'HUAHUAR',
    flag: 'CHL',
  },
  {
    id: 'chl-hualaihueestero',
    name: 'HUALAIHUE ESTERO',
    flag: 'CHL',
  },
  {
    id: 'chl-huanillo',
    name: 'HUANILLO',
    flag: 'CHL',
  },
  {
    id: 'chl-huelden',
    name: 'HUELDEN',
    flag: 'CHL',
  },
  {
    id: 'chl-huentelauquen',
    name: 'HUENTELAUQUEN',
    flag: 'CHL',
  },
  {
    id: 'chl-huequi',
    name: 'HUEQUI',
    flag: 'CHL',
  },
  {
    id: 'chl-huicha',
    name: 'HUICHA',
    flag: 'CHL',
  },
  {
    id: 'chl-huildad',
    name: 'HUILDAD',
    flag: 'CHL',
  },
  {
    id: 'chl-isladelreysectorcentro',
    name: 'ISLA DEL REY SECTOR CENTRO',
    flag: 'CHL',
  },
  {
    id: 'chl-isladelreysectorlascoloradas',
    name: 'ISLA DEL REY SECTOR LAS COLORADAS',
    flag: 'CHL',
  },
  {
    id: 'chl-islameulin',
    name: 'ISLA MEULIN',
    flag: 'CHL',
  },
  {
    id: 'chl-islamocha',
    name: 'ISLA MOCHA',
    flag: 'CHL',
  },
  {
    id: 'chl-islatac',
    name: 'ISLA TAC',
    flag: 'CHL',
  },
  {
    id: 'chl-islotedeltrabajo(islamocha)',
    name: 'ISLOTE DEL TRABAJO (ISLA MOCHA)',
    flag: 'CHL',
  },
  {
    id: 'chl-laaguada',
    name: 'LA AGUADA',
    flag: 'CHL',
  },
  {
    id: 'chl-labarra',
    name: 'LA BARRA',
    flag: 'CHL',
  },
  {
    id: 'chl-lacachina',
    name: 'LA CACHINA',
    flag: 'CHL',
  },
  {
    id: 'chl-lacata',
    name: 'LA CATA',
    flag: 'CHL',
  },
  {
    id: 'chl-lacolorada',
    name: 'LA COLORADA',
    flag: 'CHL',
  },
  {
    id: 'chl-lapasada',
    name: 'LA PASADA',
    flag: 'CHL',
  },
  {
    id: 'chl-lapesca',
    name: 'LA PESCA',
    flag: 'CHL',
  },
  {
    id: 'chl-lapoza',
    name: 'LA POZA',
    flag: 'CHL',
  },
  {
    id: 'chl-lareina',
    name: 'LA REINA',
    flag: 'CHL',
  },
  {
    id: 'chl-lasal',
    name: 'LA SAL',
    flag: 'CHL',
  },
  {
    id: 'chl-lasconchas',
    name: 'LAS CONCHAS',
    flag: 'CHL',
  },
  {
    id: 'chl-laslisas',
    name: 'LAS LISAS',
    flag: 'CHL',
  },
  {
    id: 'chl-lasmisiones(tiruasur1)',
    name: 'LAS MISIONES (TIRUA SUR 1)',
    flag: 'CHL',
  },
  {
    id: 'chl-laspenas',
    name: 'LAS PENAS',
    flag: 'CHL',
  },
  {
    id: 'chl-lastetillas',
    name: 'LAS TETILLAS',
    flag: 'CHL',
  },
  {
    id: 'chl-latifuca',
    name: 'LA TIFUCA',
    flag: 'CHL',
  },
  {
    id: 'chl-lavegadelaboca',
    name: 'LA VEGA DE LA BOCA',
    flag: 'CHL',
  },
  {
    id: 'chl-lenca',
    name: 'LENCA',
    flag: 'CHL',
  },
  {
    id: 'chl-lenga',
    name: 'LENGA',
    flag: 'CHL',
  },
  {
    id: 'chl-lepihue',
    name: 'LEPIHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-limari',
    name: 'LIMARI',
    flag: 'CHL',
  },
  {
    id: 'chl-linao',
    name: 'LINAO',
    flag: 'CHL',
  },
  {
    id: 'chl-llanchid',
    name: 'LLANCHID',
    flag: 'CHL',
  },
  {
    id: 'chl-lleguiman',
    name: 'LLEGUIMAN',
    flag: 'CHL',
  },
  {
    id: 'chl-lliuco',
    name: 'LLIUCO',
    flag: 'CHL',
  },
  {
    id: 'chl-lolcura',
    name: 'LOLCURA',
    flag: 'CHL',
  },
  {
    id: 'chl-loncura',
    name: 'LONCURA',
    flag: 'CHL',
  },
  {
    id: 'chl-losburros',
    name: 'LOS BURROS',
    flag: 'CHL',
  },
  {
    id: 'chl-loschilcos(tiruasur5)',
    name: 'LOS CHILCOS (TIRUA SUR 5)',
    flag: 'CHL',
  },
  {
    id: 'chl-loschonos',
    name: 'LOS CHONOS',
    flag: 'CHL',
  },
  {
    id: 'chl-loschoros(choreadero)',
    name: 'LOS CHOROS (CHOREADERO)',
    flag: 'CHL',
  },
  {
    id: 'chl-losmedanos',
    name: 'LOS MEDANOS',
    flag: 'CHL',
  },
  {
    id: 'chl-losmolles',
    name: 'LOS MOLLES',
    flag: 'CHL',
  },
  {
    id: 'chl-lospinos',
    name: 'LOS PINOS',
    flag: 'CHL',
  },
  {
    id: 'chl-lospiures',
    name: 'LOS PIURES',
    flag: 'CHL',
  },
  {
    id: 'chl-lospozos',
    name: 'LOS POZOS',
    flag: 'CHL',
  },
  {
    id: 'chl-lostoros',
    name: 'LOS TOROS',
    flag: 'CHL',
  },
  {
    id: 'chl-lostoyos',
    name: 'LOS TOYOS',
    flag: 'CHL',
  },
  {
    id: 'chl-losverdes',
    name: 'LOS VERDES',
    flag: 'CHL',
  },
  {
    id: 'chl-loyola',
    name: 'LOYOLA',
    flag: 'CHL',
  },
  {
    id: 'chl-lozasamarillas',
    name: 'LOZAS AMARILLAS',
    flag: 'CHL',
  },
  {
    id: 'chl-machil',
    name: 'MACHIL',
    flag: 'CHL',
  },
  {
    id: 'chl-maitencillo',
    name: 'MAITENCILLO',
    flag: 'CHL',
  },
  {
    id: 'chl-maldonado',
    name: 'MALDONADO',
    flag: 'CHL',
  },
  {
    id: 'chl-manao',
    name: 'MANAO',
    flag: 'CHL',
  },
  {
    id: 'chl-manihueico',
    name: 'MANIHUEICO',
    flag: 'CHL',
  },
  {
    id: 'chl-mapue',
    name: 'MAPUE',
    flag: 'CHL',
  },
  {
    id: 'chl-marbrava',
    name: 'MAR BRAVA',
    flag: 'CHL',
  },
  {
    id: 'chl-matanzas',
    name: 'MATANZAS',
    flag: 'CHL',
  },
  {
    id: 'chl-maullin&muelletoledo',
    name: 'MAULLIN & MUELLE TOLEDO',
    flag: 'CHL',
  },
  {
    id: 'chl-mehuin',
    name: 'MEHUIN',
    flag: 'CHL',
  },
  {
    id: 'chl-mehuinbajo',
    name: 'MEHUIN BAJO',
    flag: 'CHL',
  },
  {
    id: 'chl-milagro',
    name: 'MILAGRO',
    flag: 'CHL',
  },
  {
    id: 'chl-mississipi',
    name: 'MISSISSIPI',
    flag: 'CHL',
  },
  {
    id: 'chl-molito',
    name: 'MOLITO',
    flag: 'CHL',
  },
  {
    id: 'chl-morrochaicas',
    name: 'MORRO CHAICAS',
    flag: 'CHL',
  },
  {
    id: 'chl-muelle1,repollalalto&muelle2,repollalalto',
    name: 'MUELLE 1, REPOLLAL ALTO & MUELLE 2, REPOLLAL ALTO',
    flag: 'CHL',
  },
  {
    id: 'chl-muelleartesanal,puertoaguirre',
    name: 'MUELLE ARTESANAL, PUERTO AGUIRRE',
    flag: 'CHL',
  },
  {
    id: 'chl-muelleartesanal,puertoraulmarinbalmaceda',
    name: 'MUELLE ARTESANAL, PUERTO RAUL MARIN BALMACEDA',
    flag: 'CHL',
  },
  {
    id: 'chl-muelleartesanal,repollalbajo',
    name: 'MUELLE ARTESANAL, REPOLLAL BAJO',
    flag: 'CHL',
  },
  {
    id: 'chl-muellecementerio,puertomelinka',
    name: 'MUELLE CEMENTERIO, PUERTO MELINKA',
    flag: 'CHL',
  },
  {
    id: 'chl-muellecrucecanalfitzroy&riocanelo',
    name: 'MUELLE CRUCE CANAL FITZ ROY & RIO CANELO',
    flag: 'CHL',
  },
  {
    id: 'chl-muellefiscal,puertoraulmarinbalmaceda',
    name: 'MUELLE FISCAL, PUERTO RAUL MARIN BALMACEDA',
    flag: 'CHL',
  },
  {
    id: 'chl-muellepuertopuyuhuapi',
    name: 'MUELLE PUERTO PUYUHUAPI',
    flag: 'CHL',
  },
  {
    id: 'chl-muellerioaysen,puertoaysen',
    name: 'MUELLE RIO AYSEN, PUERTO AYSEN',
    flag: 'CHL',
  },
  {
    id: 'chl-muelletocopilla',
    name: 'MUELLE TOCOPILLA',
    flag: 'CHL',
  },
  {
    id: 'chl-nahuelhuapi',
    name: 'NAHUELHUAPI',
    flag: 'CHL',
  },
  {
    id: 'chl-nal',
    name: 'NAL',
    flag: 'CHL',
  },
  {
    id: 'chl-nayahue',
    name: 'NAYAHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-nehuentue',
    name: 'NEHUENTUE',
    flag: 'CHL',
  },
  {
    id: 'chl-palqui',
    name: 'PALQUI',
    flag: 'CHL',
  },
  {
    id: 'chl-pangue',
    name: 'PANGUE',
    flag: 'CHL',
  },
  {
    id: 'chl-panitaobajo',
    name: 'PANITAO BAJO',
    flag: 'CHL',
  },
  {
    id: 'chl-penco',
    name: 'PENCO',
    flag: 'CHL',
  },
  {
    id: 'chl-penuelas',
    name: 'PENUELAS',
    flag: 'CHL',
  },
  {
    id: 'chl-pichanco',
    name: 'PICHANCO',
    flag: 'CHL',
  },
  {
    id: 'chl-pichicolo',
    name: 'PICHICOLO',
    flag: 'CHL',
  },
  {
    id: 'chl-pichicuy',
    name: 'PICHICUY',
    flag: 'CHL',
  },
  {
    id: 'chl-piedraazul',
    name: 'PIEDRA AZUL',
    flag: 'CHL',
  },
  {
    id: 'chl-pilolcura',
    name: 'PILOLCURA',
    flag: 'CHL',
  },
  {
    id: 'chl-pinihuil',
    name: 'PINIHUIL',
    flag: 'CHL',
  },
  {
    id: 'chl-playablanca',
    name: 'PLAYA BLANCA',
    flag: 'CHL',
  },
  {
    id: 'chl-playachanga',
    name: 'PLAYA CHANGA',
    flag: 'CHL',
  },
  {
    id: 'chl-playacheuque',
    name: 'PLAYA CHEUQUE',
    flag: 'CHL',
  },
  {
    id: 'chl-playacolun',
    name: 'PLAYA COLUN',
    flag: 'CHL',
  },
  {
    id: 'chl-playanegra',
    name: 'PLAYA NEGRA',
    flag: 'CHL',
  },
  {
    id: 'chl-playasur',
    name: 'PLAYA SUR',
    flag: 'CHL',
  },
  {
    id: 'chl-portales',
    name: 'PORTALES',
    flag: 'CHL',
  },
  {
    id: 'chl-pto.dominguez',
    name: 'PTO. DOMINGUEZ',
    flag: 'CHL',
  },
  {
    id: 'chl-pto.saavedra',
    name: 'PTO. SAAVEDRA',
    flag: 'CHL',
  },
  {
    id: 'chl-pucatrihue',
    name: 'PUCATRIHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-pudeto',
    name: 'PUDETO',
    flag: 'CHL',
  },
  {
    id: 'chl-pueblohundido',
    name: 'PUEBLO HUNDIDO',
    flag: 'CHL',
  },
  {
    id: 'chl-puentedetierra(tiruasur2)',
    name: 'PUENTE DE TIERRA (TIRUA SUR 2)',
    flag: 'CHL',
  },
  {
    id: 'chl-puertobonito',
    name: 'PUERTO BONITO',
    flag: 'CHL',
  },
  {
    id: 'chl-puertohualaihue',
    name: 'PUERTO HUALAIHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-puertohuite',
    name: 'PUERTO HUITE',
    flag: 'CHL',
  },
  {
    id: 'chl-puertomanso',
    name: 'PUERTO MANSO',
    flag: 'CHL',
  },
  {
    id: 'chl-puertooscuro',
    name: 'PUERTO OSCURO',
    flag: 'CHL',
  },
  {
    id: 'chl-puertoviejo',
    name: 'PUERTO VIEJO',
    flag: 'CHL',
  },
  {
    id: 'chl-puertowilliams&terminalpesqueropuertowilliams',
    name: 'PUERTO WILLIAMS & TERMINAL PESQUERO PUERTO WILLIAMS',
    flag: 'CHL',
  },
  {
    id: 'chl-pulelo',
    name: 'PULELO',
    flag: 'CHL',
  },
  {
    id: 'chl-pullihue',
    name: 'PULLIHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-pumalin',
    name: 'PUMALIN',
    flag: 'CHL',
  },
  {
    id: 'chl-pumillahue',
    name: 'PUMILLAHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-puntacabezadevaca',
    name: 'PUNTA CABEZA DE VACA',
    flag: 'CHL',
  },
  {
    id: 'chl-puntacapitanes',
    name: 'PUNTA CAPITANES',
    flag: 'CHL',
  },
  {
    id: 'chl-puntachorosa(sanagustin)',
    name: 'PUNTA CHOROS A (SAN AGUSTIN)',
    flag: 'CHL',
  },
  {
    id: 'chl-puntachorosb(loscorrales)',
    name: 'PUNTA CHOROS B (LOS CORRALES)',
    flag: 'CHL',
  },
  {
    id: 'chl-puntaplata',
    name: 'PUNTA PLATA',
    flag: 'CHL',
  },
  {
    id: 'chl-pupelde',
    name: 'PUPELDE',
    flag: 'CHL',
  },
  {
    id: 'chl-puqueldon',
    name: 'PUQUELDON',
    flag: 'CHL',
  },
  {
    id: 'chl-queilen',
    name: 'QUEILEN',
    flag: 'CHL',
  },
  {
    id: 'chl-quemchi',
    name: 'QUEMCHI',
    flag: 'CHL',
  },
  {
    id: 'chl-quenac',
    name: 'QUENAC',
    flag: 'CHL',
  },
  {
    id: 'chl-quenuir',
    name: 'QUENUIR',
    flag: 'CHL',
  },
  {
    id: 'chl-quetalmahue',
    name: 'QUETALMAHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-queten',
    name: 'QUETEN',
    flag: 'CHL',
  },
  {
    id: 'chl-quiaca',
    name: 'QUIACA',
    flag: 'CHL',
  },
  {
    id: 'chl-quiapo',
    name: 'QUIAPO',
    flag: 'CHL',
  },
  {
    id: 'chl-quildaco',
    name: 'QUILDACO',
    flag: 'CHL',
  },
  {
    id: 'chl-quilo',
    name: 'QUILO',
    flag: 'CHL',
  },
  {
    id: 'chl-quintay',
    name: 'QUINTAY',
    flag: 'CHL',
  },
  {
    id: 'chl-rauco',
    name: 'RAUCO',
    flag: 'CHL',
  },
  {
    id: 'chl-reldehue',
    name: 'RELDEHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-rigo',
    name: 'RIGO',
    flag: 'CHL',
  },
  {
    id: 'chl-rilan',
    name: 'RILAN',
    flag: 'CHL',
  },
  {
    id: 'chl-riocolun',
    name: 'RIO COLUN',
    flag: 'CHL',
  },
  {
    id: 'chl-rionegro-hornopiren',
    name: 'RIO NEGRO - HORNOPIREN',
    flag: 'CHL',
  },
  {
    id: 'chl-rocuant',
    name: 'ROCUANT',
    flag: 'CHL',
  },
  {
    id: 'chl-rolecha',
    name: 'ROLECHA',
    flag: 'CHL',
  },
  {
    id: 'chl-rollizo',
    name: 'ROLLIZO',
    flag: 'CHL',
  },
  {
    id: 'chl-romopulli',
    name: 'ROMOPULLI',
    flag: 'CHL',
  },
  {
    id: 'chl-sanagustin',
    name: 'SAN AGUSTIN',
    flag: 'CHL',
  },
  {
    id: 'chl-sanantoniocalbuco',
    name: 'SAN ANTONIO CALBUCO',
    flag: 'CHL',
  },
  {
    id: 'chl-sanantoniodechadmo',
    name: 'SAN ANTONIO DE CHADMO',
    flag: 'CHL',
  },
  {
    id: 'chl-sanjosedebutachauques',
    name: 'SAN JOSE DE BUTACHAUQUES',
    flag: 'CHL',
  },
  {
    id: 'chl-sanjuan',
    name: 'SAN JUAN',
    flag: 'CHL',
  },
  {
    id: 'chl-sanlorenzo',
    name: 'SAN LORENZO',
    flag: 'CHL',
  },
  {
    id: 'chl-sanpedro,laserena',
    name: 'SAN PEDRO, LA SERENA',
    flag: 'CHL',
  },
  {
    id: 'chl-sanpedro,losvilos',
    name: 'SAN PEDRO, LOS VILOS',
    flag: 'CHL',
  },
  {
    id: 'chl-sanpedro-concon',
    name: 'SAN PEDRO-CONCON',
    flag: 'CHL',
  },
  {
    id: 'chl-santamaria',
    name: 'SANTA MARIA',
    flag: 'CHL',
  },
  {
    id: 'chl-santarosa',
    name: 'SANTA ROSA',
    flag: 'CHL',
  },
  {
    id: 'chl-sotomo',
    name: 'SOTOMO',
    flag: 'CHL',
  },
  {
    id: 'chl-talca',
    name: 'TALCA',
    flag: 'CHL',
  },
  {
    id: 'chl-talcan',
    name: 'TALCAN',
    flag: 'CHL',
  },
  {
    id: 'chl-talcaruca',
    name: 'TALCARUCA',
    flag: 'CHL',
  },
  {
    id: 'chl-talquilla',
    name: 'TALQUILLA',
    flag: 'CHL',
  },
  {
    id: 'chl-tentelhue',
    name: 'TENTELHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-terao',
    name: 'TERAO',
    flag: 'CHL',
  },
  {
    id: 'chl-teupa',
    name: 'TEUPA',
    flag: 'CHL',
  },
  {
    id: 'chl-tongoy',
    name: 'TONGOY',
    flag: 'CHL',
  },
  {
    id: 'chl-toreesdelinca',
    name: 'TOREES DEL INCA',
    flag: 'CHL',
  },
  {
    id: 'chl-totoral',
    name: 'TOTORAL',
    flag: 'CHL',
  },
  {
    id: 'chl-totoralillonorte',
    name: 'TOTORALILLO NORTE',
    flag: 'CHL',
  },
  {
    id: 'chl-totoralillosur',
    name: 'TOTORALILLO SUR',
    flag: 'CHL',
  },
  {
    id: 'chl-tranicuraa(tiruasur3)',
    name: 'TRANICURA A (TIRUA SUR 3)',
    flag: 'CHL',
  },
  {
    id: 'chl-tranicurab(tiruasur4)',
    name: 'TRANICURA B (TIRUA SUR 4)',
    flag: 'CHL',
  },
  {
    id: 'chl-villarica(ranquil)',
    name: 'VILLARICA (RANQUIL)',
    flag: 'CHL',
  },
  {
    id: 'chl-yaldad',
    name: 'YALDAD',
    flag: 'CHL',
  },
  {
    id: 'chl-yerbasbuenas',
    name: 'YERBAS BUENAS',
    flag: 'CHL',
  },
  {
    id: 'chl-zapallar',
    name: 'ZAPALLAR',
    flag: 'CHL',
  },
  {
    id: 'chl-zenteno',
    name: 'ZENTENO',
    flag: 'CHL',
  },
  {
    id: 'chn-jiashan',
    name: 'JIASHAN',
    flag: 'CHN',
  },
  {
    id: 'cze-decin',
    name: 'DECIN',
    flag: 'CZE',
  },
  {
    id: 'deu-andernach',
    name: 'ANDERNACH',
    flag: 'DEU',
  },
  {
    id: 'deu-arnis',
    name: 'ARNIS',
    flag: 'DEU',
  },
  {
    id: 'deu-badbevensen',
    name: 'BAD BEVENSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-badessen',
    name: 'BAD ESSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-badhonnef',
    name: 'BAD HONNEF',
    flag: 'DEU',
  },
  {
    id: 'deu-badwimpfen',
    name: 'BAD WIMPFEN',
    flag: 'DEU',
  },
  {
    id: 'deu-baltrum',
    name: 'BALTRUM',
    flag: 'DEU',
  },
  {
    id: 'deu-bamberg',
    name: 'BAMBERG',
    flag: 'DEU',
  },
  {
    id: 'deu-beidenfleth',
    name: 'BEIDENFLETH',
    flag: 'DEU',
  },
  {
    id: 'deu-bendorf',
    name: 'BENDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-bergeshoevede',
    name: 'BERGESHOEVEDE',
    flag: 'DEU',
  },
  {
    id: 'deu-bergkamen',
    name: 'BERGKAMEN',
    flag: 'DEU',
  },
  {
    id: 'deu-berlin',
    name: 'BERLIN',
    flag: 'DEU',
  },
  {
    id: 'deu-bernkastel',
    name: 'BERNKASTEL',
    flag: 'DEU',
  },
  {
    id: 'deu-bleckede',
    name: 'BLECKEDE',
    flag: 'DEU',
  },
  {
    id: 'deu-bonn',
    name: 'BONN',
    flag: 'DEU',
  },
  {
    id: 'deu-bottrop',
    name: 'BOTTROP',
    flag: 'DEU',
  },
  {
    id: 'deu-bramsche',
    name: 'BRAMSCHE',
    flag: 'DEU',
  },
  {
    id: 'deu-brandenburg',
    name: 'BRANDENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-bulstringen',
    name: 'BULSTRINGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-calberlah',
    name: 'CALBERLAH',
    flag: 'DEU',
  },
  {
    id: 'deu-cochem',
    name: 'COCHEM',
    flag: 'DEU',
  },
  {
    id: 'deu-cologne',
    name: 'COLOGNE',
    flag: 'DEU',
  },
  {
    id: 'deu-datteln',
    name: 'DATTELN',
    flag: 'DEU',
  },
  {
    id: 'deu-deggendorf',
    name: 'DEGGENDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-dettelbach',
    name: 'DETTELBACH',
    flag: 'DEU',
  },
  {
    id: 'deu-dorfprozelten',
    name: 'DORFPROZELTEN',
    flag: 'DEU',
  },
  {
    id: 'deu-dormagen',
    name: 'DORMAGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-dorsten',
    name: 'DORSTEN',
    flag: 'DEU',
  },
  {
    id: 'deu-dresden',
    name: 'DRESDEN',
    flag: 'DEU',
  },
  {
    id: 'deu-edingen-neckarhausen',
    name: 'EDINGEN-NECKARHAUSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-elsfleth',
    name: 'ELSFLETH',
    flag: 'DEU',
  },
  {
    id: 'deu-emmerich',
    name: 'EMMERICH',
    flag: 'DEU',
  },
  {
    id: 'deu-esslingen',
    name: 'ESSLINGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-frankfurt',
    name: 'FRANKFURT',
    flag: 'DEU',
  },
  {
    id: 'deu-frankfurtammain',
    name: 'FRANKFURT AM MAIN',
    flag: 'DEU',
  },
  {
    id: 'deu-freest',
    name: 'FREEST',
    flag: 'DEU',
  },
  {
    id: 'deu-freiburg',
    name: 'FREIBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-fresenburg',
    name: 'FRESENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-friedrichsfeld',
    name: 'FRIEDRICHSFELD',
    flag: 'DEU',
  },
  {
    id: 'deu-geesthacht',
    name: 'GEESTHACHT',
    flag: 'DEU',
  },
  {
    id: 'deu-gelsenkirchen',
    name: 'GELSENKIRCHEN',
    flag: 'DEU',
  },
  {
    id: 'deu-gelting',
    name: 'GELTING',
    flag: 'DEU',
  },
  {
    id: 'deu-genthin',
    name: 'GENTHIN',
    flag: 'DEU',
  },
  {
    id: 'deu-germersheim',
    name: 'GERMERSHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-gernsheim',
    name: 'GERNSHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-godorf',
    name: 'GODORF',
    flag: 'DEU',
  },
  {
    id: 'deu-grenzach-wyhlen',
    name: 'GRENZACH-WYHLEN',
    flag: 'DEU',
  },
  {
    id: 'deu-grieth',
    name: 'GRIETH',
    flag: 'DEU',
  },
  {
    id: 'deu-grossenbrode',
    name: 'GROSSENBRODE',
    flag: 'DEU',
  },
  {
    id: 'deu-grosskrotzenburg',
    name: 'GROSSKROTZENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-haldensleben',
    name: 'HALDENSLEBEN',
    flag: 'DEU',
  },
  {
    id: 'deu-hamm',
    name: 'HAMM',
    flag: 'DEU',
  },
  {
    id: 'deu-hanau',
    name: 'HANAU',
    flag: 'DEU',
  },
  {
    id: 'deu-hanover',
    name: 'HANOVER',
    flag: 'DEU',
  },
  {
    id: 'deu-haren',
    name: 'HAREN',
    flag: 'DEU',
  },
  {
    id: 'deu-hausen',
    name: 'HAUSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-heidelberg',
    name: 'HEIDELBERG',
    flag: 'DEU',
  },
  {
    id: 'deu-heilbronn',
    name: 'HEILBRONN',
    flag: 'DEU',
  },
  {
    id: 'deu-hennigsdorf',
    name: 'HENNIGSDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-hildesheim',
    name: 'HILDESHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-hoechst',
    name: 'HOECHST',
    flag: 'DEU',
  },
  {
    id: 'deu-hohenwarthe',
    name: 'HOHENWARTHE',
    flag: 'DEU',
  },
  {
    id: 'deu-hoya',
    name: 'HOYA',
    flag: 'DEU',
  },
  {
    id: 'deu-itzehoe',
    name: 'ITZEHOE',
    flag: 'DEU',
  },
  {
    id: 'deu-juist',
    name: 'JUIST',
    flag: 'DEU',
  },
  {
    id: 'deu-karlshagen',
    name: 'KARLSHAGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-karlsruhe',
    name: 'KARLSRUHE',
    flag: 'DEU',
  },
  {
    id: 'deu-kehl',
    name: 'KEHL',
    flag: 'DEU',
  },
  {
    id: 'deu-kelheim',
    name: 'KELHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-kelsterbach',
    name: 'KELSTERBACH',
    flag: 'DEU',
  },
  {
    id: 'deu-kleinostheim',
    name: 'KLEINOSTHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-koblenz',
    name: 'KOBLENZ',
    flag: 'DEU',
  },
  {
    id: 'deu-konigswusterhausen',
    name: 'KONIGS WUSTERHAUSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-krefeld',
    name: 'KREFELD',
    flag: 'DEU',
  },
  {
    id: 'deu-ladbergen',
    name: 'LADBERGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-lampertheim',
    name: 'LAMPERTHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-lauenburg',
    name: 'LAUENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-lauffen',
    name: 'LAUFFEN',
    flag: 'DEU',
  },
  {
    id: 'deu-leverkusen',
    name: 'LEVERKUSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-lingen',
    name: 'LINGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-lohnde',
    name: 'LOHNDE',
    flag: 'DEU',
  },
  {
    id: 'deu-lubbecke',
    name: 'LUBBECKE',
    flag: 'DEU',
  },
  {
    id: 'deu-ludinghausen',
    name: 'LUDINGHAUSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-ludwigshafen',
    name: 'LUDWIGSHAFEN',
    flag: 'DEU',
  },
  {
    id: 'deu-lunen',
    name: 'LUNEN',
    flag: 'DEU',
  },
  {
    id: 'deu-magdeburg',
    name: 'MAGDEBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-mainz',
    name: 'MAINZ',
    flag: 'DEU',
  },
  {
    id: 'deu-mannheim',
    name: 'MANNHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-marl',
    name: 'MARL',
    flag: 'DEU',
  },
  {
    id: 'deu-misburg',
    name: 'MISBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-mulheim',
    name: 'MULHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-munster',
    name: 'MUNSTER',
    flag: 'DEU',
  },
  {
    id: 'deu-neuss',
    name: 'NEUSS',
    flag: 'DEU',
  },
  {
    id: 'deu-niedernberg',
    name: 'NIEDERNBERG',
    flag: 'DEU',
  },
  {
    id: 'deu-nienburg',
    name: 'NIENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-nierstein',
    name: 'NIERSTEIN',
    flag: 'DEU',
  },
  {
    id: 'deu-nordhafenhannover',
    name: 'NORDHAFEN HANNOVER',
    flag: 'DEU',
  },
  {
    id: 'deu-nuremberg',
    name: 'NUREMBERG',
    flag: 'DEU',
  },
  {
    id: 'deu-oberhausen',
    name: 'OBERHAUSEN',
    flag: 'DEU',
  },
  {
    id: 'deu-oldenburg',
    name: 'OLDENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-oortkaten',
    name: 'OORTKATEN',
    flag: 'DEU',
  },
  {
    id: 'deu-orth',
    name: 'ORTH',
    flag: 'DEU',
  },
  {
    id: 'deu-osnabruck',
    name: 'OSNABRUCK',
    flag: 'DEU',
  },
  {
    id: 'deu-papenburg',
    name: 'PAPENBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-passau',
    name: 'PASSAU',
    flag: 'DEU',
  },
  {
    id: 'deu-peine',
    name: 'PEINE',
    flag: 'DEU',
  },
  {
    id: 'deu-plochingen',
    name: 'PLOCHINGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-potsdam',
    name: 'POTSDAM',
    flag: 'DEU',
  },
  {
    id: 'deu-rees',
    name: 'REES',
    flag: 'DEU',
  },
  {
    id: 'deu-regensburg',
    name: 'REGENSBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-reisholz',
    name: 'REISHOLZ',
    flag: 'DEU',
  },
  {
    id: 'deu-rheinau',
    name: 'RHEINAU',
    flag: 'DEU',
  },
  {
    id: 'deu-rheinbrohl',
    name: 'RHEINBROHL',
    flag: 'DEU',
  },
  {
    id: 'deu-rudesheim',
    name: 'RUDESHEIM',
    flag: 'DEU',
  },
  {
    id: 'deu-saintgoar',
    name: 'SAINT GOAR',
    flag: 'DEU',
  },
  {
    id: 'deu-salzgitter',
    name: 'SALZGITTER',
    flag: 'DEU',
  },
  {
    id: 'deu-scharnebeck',
    name: 'SCHARNEBECK',
    flag: 'DEU',
  },
  {
    id: 'deu-schleswig',
    name: 'SCHLESWIG',
    flag: 'DEU',
  },
  {
    id: 'deu-schwedt',
    name: 'SCHWEDT',
    flag: 'DEU',
  },
  {
    id: 'deu-schweinfurt',
    name: 'SCHWEINFURT',
    flag: 'DEU',
  },
  {
    id: 'deu-schwelgern',
    name: 'SCHWELGERN',
    flag: 'DEU',
  },
  {
    id: 'deu-sehnde',
    name: 'SEHNDE',
    flag: 'DEU',
  },
  {
    id: 'deu-spelle',
    name: 'SPELLE',
    flag: 'DEU',
  },
  {
    id: 'deu-speyer',
    name: 'SPEYER',
    flag: 'DEU',
  },
  {
    id: 'deu-spyck',
    name: 'SPYCK',
    flag: 'DEU',
  },
  {
    id: 'deu-stahnsdorf',
    name: 'STAHNSDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-stolzenau',
    name: 'STOLZENAU',
    flag: 'DEU',
  },
  {
    id: 'deu-straubing',
    name: 'STRAUBING',
    flag: 'DEU',
  },
  {
    id: 'deu-strullendorf',
    name: 'STRULLENDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-stuttgart',
    name: 'STUTTGART',
    flag: 'DEU',
  },
  {
    id: 'deu-tangermunde',
    name: 'TANGERMUNDE',
    flag: 'DEU',
  },
  {
    id: 'deu-tonning',
    name: 'TONNING',
    flag: 'DEU',
  },
  {
    id: 'deu-trabentrarbach',
    name: 'TRABEN TRARBACH',
    flag: 'DEU',
  },
  {
    id: 'deu-trier',
    name: 'TRIER',
    flag: 'DEU',
  },
  {
    id: 'deu-uelzen',
    name: 'UELZEN',
    flag: 'DEU',
  },
  {
    id: 'deu-uentrop',
    name: 'UENTROP',
    flag: 'DEU',
  },
  {
    id: 'deu-walluf',
    name: 'WALLUF',
    flag: 'DEU',
  },
  {
    id: 'deu-waltrop',
    name: 'WALTROP',
    flag: 'DEU',
  },
  {
    id: 'deu-weener',
    name: 'WEENER',
    flag: 'DEU',
  },
  {
    id: 'deu-wesseling',
    name: 'WESSELING',
    flag: 'DEU',
  },
  {
    id: 'deu-winningen',
    name: 'WINNINGEN',
    flag: 'DEU',
  },
  {
    id: 'deu-wolfsburg',
    name: 'WOLFSBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-worms',
    name: 'WORMS',
    flag: 'DEU',
  },
  {
    id: 'deu-worthamrhein',
    name: 'WORTH AM RHEIN',
    flag: 'DEU',
  },
  {
    id: 'deu-wrestedt',
    name: 'WRESTEDT',
    flag: 'DEU',
  },
  {
    id: 'deu-wurzburg',
    name: 'WURZBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-wustermark',
    name: 'WUSTERMARK',
    flag: 'DEU',
  },
  {
    id: 'dnk-aeroskobing',
    name: 'AEROSKOBING',
    flag: 'DNK',
  },
  {
    id: 'dnk-asaa',
    name: 'ASAA',
    flag: 'DNK',
  },
  {
    id: 'dnk-egernsund',
    name: 'EGERNSUND',
    flag: 'DNK',
  },
  {
    id: 'dnk-ejerslev',
    name: 'EJERSLEV',
    flag: 'DNK',
  },
  {
    id: 'dnk-fakseladeplads',
    name: 'FAKSE LADEPLADS',
    flag: 'DNK',
  },
  {
    id: 'dnk-frederikssund',
    name: 'FREDERIKSSUND',
    flag: 'DNK',
  },
  {
    id: 'dnk-horuphav',
    name: 'HORUPHAV',
    flag: 'DNK',
  },
  {
    id: 'dnk-hundige',
    name: 'HUNDIGE',
    flag: 'DNK',
  },
  {
    id: 'dnk-ishoj',
    name: 'ISHOJ',
    flag: 'DNK',
  },
  {
    id: 'dnk-kolding',
    name: 'KOLDING',
    flag: 'DNK',
  },
  {
    id: 'dnk-korshavn',
    name: 'KORSHAVN',
    flag: 'DNK',
  },
  {
    id: 'dnk-lango',
    name: 'LANGO',
    flag: 'DNK',
  },
  {
    id: 'dnk-marstal',
    name: 'MARSTAL',
    flag: 'DNK',
  },
  {
    id: 'dnk-naestved',
    name: 'NAESTVED',
    flag: 'DNK',
  },
  {
    id: 'dnk-nakskov',
    name: 'NAKSKOV',
    flag: 'DNK',
  },
  {
    id: 'dnk-nibe',
    name: 'NIBE',
    flag: 'DNK',
  },
  {
    id: 'dnk-nordby',
    name: 'NORDBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-nykobing',
    name: 'NYKOBING',
    flag: 'DNK',
  },
  {
    id: 'dnk-nykobing(falster)',
    name: 'NYKOBING (FALSTER)',
    flag: 'DNK',
  },
  {
    id: 'dnk-nysted',
    name: 'NYSTED',
    flag: 'DNK',
  },
  {
    id: 'dnk-praesto',
    name: 'PRAESTO',
    flag: 'DNK',
  },
  {
    id: 'dnk-rendbjerg',
    name: 'RENDBJERG',
    flag: 'DNK',
  },
  {
    id: 'dnk-ronbjerglivoe',
    name: 'RONBJERG LIVOE',
    flag: 'DNK',
  },
  {
    id: 'dnk-rudkobing',
    name: 'RUDKOBING',
    flag: 'DNK',
  },
  {
    id: 'dnk-sakskobing',
    name: 'SAKSKOBING',
    flag: 'DNK',
  },
  {
    id: 'dnk-skaerbaek',
    name: 'SKAERBAEK',
    flag: 'DNK',
  },
  {
    id: 'dnk-stege',
    name: 'STEGE',
    flag: 'DNK',
  },
  {
    id: 'dnk-stubbekobing',
    name: 'STUBBEKOBING',
    flag: 'DNK',
  },
  {
    id: 'dnk-studstrup',
    name: 'STUDSTRUP',
    flag: 'DNK',
  },
  {
    id: 'dnk-svendborgdrejoe',
    name: 'SVENDBORG DREJOE',
    flag: 'DNK',
  },
  {
    id: 'dom-lassalinas',
    name: 'LAS SALINAS',
    flag: 'DOM',
  },
  {
    id: 'ecu-desembaercaderocabuyal',
    name: 'DESEMBAERCADERO CABUYAL',
    flag: 'ECU',
  },
  {
    id: 'ecu-desembarcaderomompiche',
    name: 'DESEMBARCADERO MOMPICHE',
    flag: 'ECU',
  },
  {
    id: 'esp-boiro',
    name: 'BOIRO',
    flag: 'ESP',
  },
  {
    id: 'esp-calanova',
    name: 'CALANOVA',
    flag: 'ESP',
  },
  {
    id: 'esp-combarro',
    name: 'COMBARRO',
    flag: 'ESP',
  },
  {
    id: 'esp-moana',
    name: 'MOANA',
    flag: 'ESP',
  },
  {
    id: 'esp-redes',
    name: 'REDES',
    flag: 'ESP',
  },
  {
    id: 'esp-rianxo',
    name: 'RIANXO',
    flag: 'ESP',
  },
  {
    id: 'est-kakumaehaven',
    name: 'KAKUMAE HAVEN',
    flag: 'EST',
  },
  {
    id: 'est-nasva',
    name: 'NASVA',
    flag: 'EST',
  },
  {
    id: 'fin-houtskar',
    name: 'HOUTSKAR',
    flag: 'FIN',
  },
  {
    id: 'fin-joensuu',
    name: 'JOENSUU',
    flag: 'FIN',
  },
  {
    id: 'fin-jussaro',
    name: 'JUSSARO',
    flag: 'FIN',
  },
  {
    id: 'fin-sapokkaguestmarina',
    name: 'SAPOKKA GUEST MARINA',
    flag: 'FIN',
  },
  {
    id: 'fin-savonlinna',
    name: 'SAVONLINNA',
    flag: 'FIN',
  },
  {
    id: 'fin-vaskilahti',
    name: 'VASKILAHTI',
    flag: 'FIN',
  },
  {
    id: 'fra-argenteuil',
    name: 'ARGENTEUIL',
    flag: 'FRA',
  },
  {
    id: 'fra-aubervilliers',
    name: 'AUBERVILLIERS',
    flag: 'FRA',
  },
  {
    id: 'fra-auray',
    name: 'AURAY',
    flag: 'FRA',
  },
  {
    id: 'fra-avignon',
    name: 'AVIGNON',
    flag: 'FRA',
  },
  {
    id: 'fra-basel',
    name: 'BASEL',
    flag: 'FRA',
  },
  {
    id: 'fra-bethune',
    name: 'BETHUNE',
    flag: 'FRA',
  },
  {
    id: 'fra-binic',
    name: 'BINIC',
    flag: 'FRA',
  },
  {
    id: 'fra-blainville-sur-orne',
    name: 'BLAINVILLE-SUR-ORNE',
    flag: 'FRA',
  },
  {
    id: 'fra-boissise-le-roi',
    name: 'BOISSISE-LE-ROI',
    flag: 'FRA',
  },
  {
    id: 'fra-bonneuil',
    name: 'BONNEUIL',
    flag: 'FRA',
  },
  {
    id: 'fra-boulogne-billancourt',
    name: 'BOULOGNE-BILLANCOURT',
    flag: 'FRA',
  },
  {
    id: 'fra-carrieres-sur-seine',
    name: 'CARRIERES-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-chartrettes',
    name: 'CHARTRETTES',
    flag: 'FRA',
  },
  {
    id: 'fra-conflans',
    name: 'CONFLANS',
    flag: 'FRA',
  },
  {
    id: 'fra-crozon',
    name: 'CROZON',
    flag: 'FRA',
  },
  {
    id: 'fra-cuinchy',
    name: 'CUINCHY',
    flag: 'FRA',
  },
  {
    id: 'fra-damgan',
    name: 'DAMGAN',
    flag: 'FRA',
  },
  {
    id: 'fra-don',
    name: 'DON',
    flag: 'FRA',
  },
  {
    id: 'fra-duclair',
    name: 'DUCLAIR',
    flag: 'FRA',
  },
  {
    id: 'fra-elbeuf',
    name: 'ELBEUF',
    flag: 'FRA',
  },
  {
    id: 'fra-flers-en-escrebieux',
    name: 'FLERS-EN-ESCREBIEUX',
    flag: 'FRA',
  },
  {
    id: 'fra-fresnes-sur-escaut',
    name: 'FRESNES-SUR-ESCAUT',
    flag: 'FRA',
  },
  {
    id: 'fra-gambsheim',
    name: 'GAMBSHEIM',
    flag: 'FRA',
  },
  {
    id: 'fra-gargenville',
    name: 'GARGENVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-isbergues',
    name: 'ISBERGUES',
    flag: 'FRA',
  },
  {
    id: 'fra-koenigsmacker',
    name: 'KOENIGSMACKER',
    flag: 'FRA',
  },
  {
    id: 'fra-larichardais',
    name: 'LA RICHARDAIS',
    flag: 'FRA',
  },
  {
    id: 'fra-lebono',
    name: 'LE BONO',
    flag: 'FRA',
  },
  {
    id: 'fra-lesattaques',
    name: 'LES ATTAQUES',
    flag: 'FRA',
  },
  {
    id: 'fra-lezardrieux',
    name: 'LEZARDRIEUX',
    flag: 'FRA',
  },
  {
    id: 'fra-lille',
    name: 'LILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-limay',
    name: 'LIMAY',
    flag: 'FRA',
  },
  {
    id: 'fra-melun',
    name: 'MELUN',
    flag: 'FRA',
  },
  {
    id: 'fra-menen',
    name: 'MENEN',
    flag: 'FRA',
  },
  {
    id: 'fra-metz',
    name: 'METZ',
    flag: 'FRA',
  },
  {
    id: 'fra-meulan-en-yvelines',
    name: 'MEULAN-EN-YVELINES',
    flag: 'FRA',
  },
  {
    id: 'fra-mondelange',
    name: 'MONDELANGE',
    flag: 'FRA',
  },
  {
    id: 'fra-mulhouse',
    name: 'MULHOUSE',
    flag: 'FRA',
  },
  {
    id: 'fra-neuilly-sur-seine',
    name: 'NEUILLY-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-nonnieres-sur-seine',
    name: 'NONNIERES-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-ottmarsheim',
    name: 'OTTMARSHEIM',
    flag: 'FRA',
  },
  {
    id: 'fra-pantin',
    name: 'PANTIN',
    flag: 'FRA',
  },
  {
    id: 'fra-paris',
    name: 'PARIS',
    flag: 'FRA',
  },
  {
    id: 'fra-pleneuf-val-andre',
    name: 'PLENEUF-VAL-ANDRE',
    flag: 'FRA',
  },
  {
    id: 'fra-pont-a-vendin',
    name: 'PONT-A-VENDIN',
    flag: 'FRA',
  },
  {
    id: 'fra-pontoise',
    name: 'PONTOISE',
    flag: 'FRA',
  },
  {
    id: 'fra-portmarly',
    name: 'PORT MARLY',
    flag: 'FRA',
  },
  {
    id: 'fra-portmort',
    name: 'PORT MORT',
    flag: 'FRA',
  },
  {
    id: 'fra-poses',
    name: 'POSES',
    flag: 'FRA',
  },
  {
    id: 'fra-quesnoy-sur-deule',
    name: 'QUESNOY-SUR-DEULE',
    flag: 'FRA',
  },
  {
    id: 'fra-rhinau',
    name: 'RHINAU',
    flag: 'FRA',
  },
  {
    id: 'fra-rosenau',
    name: 'ROSENAU',
    flag: 'FRA',
  },
  {
    id: 'fra-rumersheim-le-haut',
    name: 'RUMERSHEIM-LE-HAUT',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-aubin-les-elbeuf',
    name: 'SAINT-AUBIN-LES-ELBEUF',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-denis',
    name: 'SAINT-DENIS',
    flag: 'FRA',
  },
  {
    id: 'fra-saintsuliac',
    name: 'SAINT SULIAC',
    flag: 'FRA',
  },
  {
    id: 'fra-santes',
    name: 'SANTES',
    flag: 'FRA',
  },
  {
    id: 'fra-strasbourg',
    name: 'STRASBOURG',
    flag: 'FRA',
  },
  {
    id: 'fra-thionville',
    name: 'THIONVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-tonnaycharente',
    name: 'TONNAY CHARENTE',
    flag: 'FRA',
  },
  {
    id: 'fra-treguier',
    name: 'TREGUIER',
    flag: 'FRA',
  },
  {
    id: 'fra-triel-sur-seine',
    name: 'TRIEL-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-valenciennnes',
    name: 'VALENCIENNNES',
    flag: 'FRA',
  },
  {
    id: 'fra-vannes',
    name: 'VANNES',
    flag: 'FRA',
  },
  {
    id: 'fra-venables',
    name: 'VENABLES',
    flag: 'FRA',
  },
  {
    id: 'fra-vernon',
    name: 'VERNON',
    flag: 'FRA',
  },
  {
    id: 'fra-villeneuve-saint-georges',
    name: 'VILLENEUVE-SAINT-GEORGES',
    flag: 'FRA',
  },
  {
    id: 'fra-watten',
    name: 'WATTEN',
    flag: 'FRA',
  },
  {
    id: 'fra-wingles',
    name: 'WINGLES',
    flag: 'FRA',
  },
  {
    id: 'gbr-ardfern',
    name: 'ARDFERN',
    flag: 'GBR',
  },
  {
    id: 'gbr-ardrishaig',
    name: 'ARDRISHAIG',
    flag: 'GBR',
  },
  {
    id: 'gbr-aultbea',
    name: 'AULTBEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-bunessan',
    name: 'BUNESSAN',
    flag: 'GBR',
  },
  {
    id: 'gbr-coleraine',
    name: 'COLERAINE',
    flag: 'GBR',
  },
  {
    id: 'gbr-garston',
    name: 'GARSTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-gigha',
    name: 'GIGHA',
    flag: 'GBR',
  },
  {
    id: 'gbr-howdendyke',
    name: 'HOWDENDYKE',
    flag: 'GBR',
  },
  {
    id: 'gbr-inverkeithing',
    name: 'INVERKEITHING',
    flag: 'GBR',
  },
  {
    id: 'gbr-iwade',
    name: 'IWADE',
    flag: 'GBR',
  },
  {
    id: 'gbr-kirkcaldy',
    name: 'KIRKCALDY',
    flag: 'GBR',
  },
  {
    id: 'gbr-lochmaddy',
    name: 'LOCHMADDY',
    flag: 'GBR',
  },
  {
    id: 'gbr-longhope',
    name: 'LONGHOPE',
    flag: 'GBR',
  },
  {
    id: 'gbr-manchester',
    name: 'MANCHESTER',
    flag: 'GBR',
  },
  {
    id: 'gbr-mylor',
    name: 'MYLOR',
    flag: 'GBR',
  },
  {
    id: 'gbr-portavadie',
    name: 'PORTAVADIE',
    flag: 'GBR',
  },
  {
    id: 'gbr-portbannatyne',
    name: 'PORT BANNATYNE',
    flag: 'GBR',
  },
  {
    id: 'gbr-portchester',
    name: 'PORTCHESTER',
    flag: 'GBR',
  },
  {
    id: 'gbr-portree',
    name: 'PORTREE',
    flag: 'GBR',
  },
  {
    id: 'gbr-reedham',
    name: 'REEDHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-rosneath',
    name: 'ROSNEATH',
    flag: 'GBR',
  },
  {
    id: 'gbr-rye',
    name: 'RYE',
    flag: 'GBR',
  },
  {
    id: 'gbr-sandbank',
    name: 'SANDBANK',
    flag: 'GBR',
  },
  {
    id: 'gbr-scapa',
    name: 'SCAPA',
    flag: 'GBR',
  },
  {
    id: 'gbr-tarbert',
    name: 'TARBERT',
    flag: 'GBR',
  },
  {
    id: 'gbr-tayvallich',
    name: 'TAYVALLICH',
    flag: 'GBR',
  },
  {
    id: 'gbr-tenby',
    name: 'TENBY',
    flag: 'GBR',
  },
  {
    id: 'gbr-yfelinheli',
    name: 'Y FELINHELI',
    flag: 'GBR',
  },
  {
    id: 'geo-anaklia',
    name: 'ANAKLIA',
    flag: 'GEO',
  },
  {
    id: 'grc-alyki',
    name: 'ALYKI',
    flag: 'GRC',
  },
  {
    id: 'grc-antiparos',
    name: 'ANTIPAROS',
    flag: 'GRC',
  },
  {
    id: 'grc-antiparosanchorage',
    name: 'ANTIPAROS ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'grc-arki',
    name: 'ARKI',
    flag: 'GRC',
  },
  {
    id: 'grc-astacos',
    name: 'ASTACOS',
    flag: 'GRC',
  },
  {
    id: 'grc-atokos',
    name: 'ATOKOS',
    flag: 'GRC',
  },
  {
    id: 'grc-epidavros',
    name: 'EPIDAVROS',
    flag: 'GRC',
  },
  {
    id: 'grc-folegandros',
    name: 'FOLEGANDROS',
    flag: 'GRC',
  },
  {
    id: 'grc-kalamaki',
    name: 'KALAMAKI',
    flag: 'GRC',
  },
  {
    id: 'grc-kea',
    name: 'KEA',
    flag: 'GRC',
  },
  {
    id: 'grc-kioni',
    name: 'KIONI',
    flag: 'GRC',
  },
  {
    id: 'grc-klima',
    name: 'KLIMA',
    flag: 'GRC',
  },
  {
    id: 'grc-koufonisi',
    name: 'KOUFONISI',
    flag: 'GRC',
  },
  {
    id: 'grc-koufonisos',
    name: 'KOUFONISOS',
    flag: 'GRC',
  },
  {
    id: 'grc-kypseli',
    name: 'KYPSELI',
    flag: 'GRC',
  },
  {
    id: 'grc-lipsi',
    name: 'LIPSI',
    flag: 'GRC',
  },
  {
    id: 'grc-meganisi',
    name: 'MEGANISI',
    flag: 'GRC',
  },
  {
    id: 'grc-nafpaktos',
    name: 'NAFPAKTOS',
    flag: 'GRC',
  },
  {
    id: 'grc-palairos',
    name: 'PALAIROS',
    flag: 'GRC',
  },
  {
    id: 'grc-paxos',
    name: 'PAXOS',
    flag: 'GRC',
  },
  {
    id: 'grc-portorafti',
    name: 'PORTO RAFTI',
    flag: 'GRC',
  },
  {
    id: 'grc-revithoussa',
    name: 'REVITHOUSSA',
    flag: 'GRC',
  },
  {
    id: 'grc-sagiada',
    name: 'SAGIADA',
    flag: 'GRC',
  },
  {
    id: 'grc-salamina',
    name: 'SALAMINA',
    flag: 'GRC',
  },
  {
    id: 'grc-schoinousa',
    name: 'SCHOINOUSA',
    flag: 'GRC',
  },
  {
    id: 'grc-sifnos',
    name: 'SIFNOS',
    flag: 'GRC',
  },
  {
    id: 'grc-vonitsa',
    name: 'VONITSA',
    flag: 'GRC',
  },
  {
    id: 'grc-xirokamposanchorage',
    name: 'XIROKAMPOS ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'hrv-bogoevo',
    name: 'BOGOEVO',
    flag: 'HRV',
  },
  {
    id: 'hrv-icici',
    name: 'ICICI',
    flag: 'HRV',
  },
  {
    id: 'hrv-jelsa',
    name: 'JELSA',
    flag: 'HRV',
  },
  {
    id: 'hrv-krk',
    name: 'KRK',
    flag: 'HRV',
  },
  {
    id: 'hrv-njivice',
    name: 'NJIVICE',
    flag: 'HRV',
  },
  {
    id: 'hrv-opatija',
    name: 'OPATIJA',
    flag: 'HRV',
  },
  {
    id: 'hrv-osijek',
    name: 'OSIJEK',
    flag: 'HRV',
  },
  {
    id: 'hrv-otokscedro',
    name: 'OTOK SCEDRO',
    flag: 'HRV',
  },
  {
    id: 'hrv-polace',
    name: 'POLACE',
    flag: 'HRV',
  },
  {
    id: 'hrv-prvicluka',
    name: 'PRVIC LUKA',
    flag: 'HRV',
  },
  {
    id: 'hrv-punat',
    name: 'PUNAT',
    flag: 'HRV',
  },
  {
    id: 'hrv-sipanskaluka',
    name: 'SIPANSKA LUKA',
    flag: 'HRV',
  },
  {
    id: 'hrv-skradinanchorage',
    name: 'SKRADIN ANCHORAGE',
    flag: 'HRV',
  },
  {
    id: 'hrv-slano',
    name: 'SLANO',
    flag: 'HRV',
  },
  {
    id: 'hrv-stomorska',
    name: 'STOMORSKA',
    flag: 'HRV',
  },
  {
    id: 'hrv-vodice',
    name: 'VODICE',
    flag: 'HRV',
  },
  {
    id: 'hrv-vukovar',
    name: 'VUKOVAR',
    flag: 'HRV',
  },
  {
    id: 'hrv-zatonanchorage',
    name: 'ZATON ANCHORAGE',
    flag: 'HRV',
  },
  {
    id: 'hun-adony',
    name: 'ADONY',
    flag: 'HUN',
  },
  {
    id: 'hun-almasfuzito',
    name: 'ALMASFUZITO',
    flag: 'HUN',
  },
  {
    id: 'hun-baja',
    name: 'BAJA',
    flag: 'HUN',
  },
  {
    id: 'hun-bogyiszlo',
    name: 'BOGYISZLO',
    flag: 'HUN',
  },
  {
    id: 'hun-dunafoldvar',
    name: 'DUNAFOLDVAR',
    flag: 'HUN',
  },
  {
    id: 'hun-dunaujvaros',
    name: 'DUNAUJVAROS',
    flag: 'HUN',
  },
  {
    id: 'hun-dunavecse',
    name: 'DUNAVECSE',
    flag: 'HUN',
  },
  {
    id: 'hun-esztergom',
    name: 'ESZTERGOM',
    flag: 'HUN',
  },
  {
    id: 'hun-fokto',
    name: 'FOKTO',
    flag: 'HUN',
  },
  {
    id: 'hun-gonyu',
    name: 'GONYU',
    flag: 'HUN',
  },
  {
    id: 'hun-harta',
    name: 'HARTA',
    flag: 'HUN',
  },
  {
    id: 'hun-komarno',
    name: 'KOMARNO',
    flag: 'HUN',
  },
  {
    id: 'hun-madocsa',
    name: 'MADOCSA',
    flag: 'HUN',
  },
  {
    id: 'hun-nagymaros',
    name: 'NAGYMAROS',
    flag: 'HUN',
  },
  {
    id: 'hun-neszmely',
    name: 'NESZMELY',
    flag: 'HUN',
  },
  {
    id: 'hun-paks',
    name: 'PAKS',
    flag: 'HUN',
  },
  {
    id: 'hun-sazhalombata',
    name: 'SAZHALOMBATA',
    flag: 'HUN',
  },
  {
    id: 'hun-solt',
    name: 'SOLT',
    flag: 'HUN',
  },
  {
    id: 'hun-szazhalombatta',
    name: 'SZAZHALOMBATTA',
    flag: 'HUN',
  },
  {
    id: 'hun-szob',
    name: 'SZOB',
    flag: 'HUN',
  },
  {
    id: 'hun-tat',
    name: 'TAT',
    flag: 'HUN',
  },
  {
    id: 'hun-vac',
    name: 'VAC',
    flag: 'HUN',
  },
  {
    id: 'hun-veroce',
    name: 'VEROCE',
    flag: 'HUN',
  },
  {
    id: 'idn-asemdoyong',
    name: 'ASEM DOYONG',
    flag: 'IDN',
  },
  {
    id: 'idn-babululaut',
    name: 'BABULU LAUT',
    flag: 'IDN',
  },
  {
    id: 'idn-batukalang',
    name: 'BATU KALANG',
    flag: 'IDN',
  },
  {
    id: 'idn-cemara',
    name: 'CEMARA',
    flag: 'IDN',
  },
  {
    id: 'idn-ciawitali',
    name: 'CIAWITALI',
    flag: 'IDN',
  },
  {
    id: 'idn-cilauteureun',
    name: 'CILAUTEUREUN',
    flag: 'IDN',
  },
  {
    id: 'idn-ciparage',
    name: 'CIPARAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-glumpangumpunguno',
    name: 'GLUMPANG UMPUNG UNO',
    flag: 'IDN',
  },
  {
    id: 'idn-hantipan',
    name: 'HANTIPAN',
    flag: 'IDN',
  },
  {
    id: 'idn-jeunieb',
    name: 'JEUNIEB',
    flag: 'IDN',
  },
  {
    id: 'idn-lekok',
    name: 'LEKOK',
    flag: 'IDN',
  },
  {
    id: 'idn-morodemak',
    name: 'MORODEMAK',
    flag: 'IDN',
  },
  {
    id: 'idn-muarabungin',
    name: 'MUARA BUNGIN',
    flag: 'IDN',
  },
  {
    id: 'idn-muaraciasem',
    name: 'MUARA CIASEM',
    flag: 'IDN',
  },
  {
    id: 'idn-pemangkaran',
    name: 'PEMANGKARAN',
    flag: 'IDN',
  },
  {
    id: 'idn-pengambengan',
    name: 'PENGAMBENGAN',
    flag: 'IDN',
  },
  {
    id: 'idn-pengarengan',
    name: 'PENGARENGAN',
    flag: 'IDN',
  },
  {
    id: 'idn-playangan',
    name: 'PLAYANGAN',
    flag: 'IDN',
  },
  {
    id: 'idn-puger',
    name: 'PUGER',
    flag: 'IDN',
  },
  {
    id: 'idn-sancang',
    name: 'SANCANG',
    flag: 'IDN',
  },
  {
    id: 'idn-sisinubi',
    name: 'SISINUBI',
    flag: 'IDN',
  },
  {
    id: 'idn-surade',
    name: 'SURADE',
    flag: 'IDN',
  },
  {
    id: 'idn-teladas',
    name: 'TELADAS',
    flag: 'IDN',
  },
  {
    id: 'idn-wanggarasi',
    name: 'WANGGARASI',
    flag: 'IDN',
  },
  {
    id: 'idn-wonokerto',
    name: 'WONOKERTO',
    flag: 'IDN',
  },
  {
    id: 'irl-bantry',
    name: 'BANTRY',
    flag: 'IRL',
  },
  {
    id: 'irl-kilrush',
    name: 'KILRUSH',
    flag: 'IRL',
  },
  {
    id: 'irl-marinopoint',
    name: 'MARINO POINT',
    flag: 'IRL',
  },
  {
    id: 'irl-waterfordcity',
    name: 'WATERFORD CITY',
    flag: 'IRL',
  },
  {
    id: 'irn-astara',
    name: 'ASTARA',
    flag: 'IRN',
  },
  {
    id: 'ita-ameglia',
    name: 'AMEGLIA',
    flag: 'ITA',
  },
  {
    id: 'ita-aprillamarittima',
    name: 'APRILLA MARITTIMA',
    flag: 'ITA',
  },
  {
    id: 'ita-baiae',
    name: 'BAIAE',
    flag: 'ITA',
  },
  {
    id: 'ita-grado',
    name: 'GRADO',
    flag: 'ITA',
  },
  {
    id: 'ita-lesaline',
    name: 'LE SALINE',
    flag: 'ITA',
  },
  {
    id: 'ita-portosanpaolo',
    name: 'PORTO SAN PAOLO',
    flag: 'ITA',
  },
  {
    id: 'ita-terracina',
    name: 'TERRACINA',
    flag: 'ITA',
  },
  {
    id: 'jpn-amagasaki',
    name: 'AMAGASAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-amagasakinishinomiya',
    name: 'AMAGASAKINISHINOMIYA',
    flag: 'JPN',
  },
  {
    id: 'jpn-habu',
    name: 'HABU',
    flag: 'JPN',
  },
  {
    id: 'jpn-saizaki',
    name: 'SAIZAKI',
    flag: 'JPN',
  },
  {
    id: 'kaz-kashaganfield',
    name: 'KASHAGAN FIELD',
    flag: 'KAZ',
  },
  {
    id: 'kaz-kuryk',
    name: 'KURYK',
    flag: 'KAZ',
  },
  {
    id: 'kaz-prorva',
    name: 'PRORVA',
    flag: 'KAZ',
  },
  {
    id: 'lux-grevenmacher',
    name: 'GREVENMACHER',
    flag: 'LUX',
  },
  {
    id: 'lux-mertert',
    name: 'MERTERT',
    flag: 'LUX',
  },
  {
    id: 'lux-remich',
    name: 'REMICH',
    flag: 'LUX',
  },
  {
    id: 'mne-bjellila',
    name: 'BJELLILA',
    flag: 'MNE',
  },
  {
    id: 'mne-buljaricabeach',
    name: 'BULJARICA BEACH',
    flag: 'MNE',
  },
  {
    id: 'mne-lipci',
    name: 'LIPCI',
    flag: 'MNE',
  },
  {
    id: 'mne-petrovac',
    name: 'PETROVAC',
    flag: 'MNE',
  },
  {
    id: 'mne-rafailovici',
    name: 'RAFAILOVICI',
    flag: 'MNE',
  },
  {
    id: 'mne-stroko',
    name: 'ST ROKO',
    flag: 'MNE',
  },
  {
    id: 'mys-stulanglaut',
    name: 'STULANG LAUT',
    flag: 'MYS',
  },
  {
    id: 'nld-almelo',
    name: 'ALMELO',
    flag: 'NLD',
  },
  {
    id: 'nld-amersfoort',
    name: 'AMERSFOORT',
    flag: 'NLD',
  },
  {
    id: 'nld-andel',
    name: 'ANDEL',
    flag: 'NLD',
  },
  {
    id: 'nld-appingedam',
    name: 'APPINGEDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-arnhem',
    name: 'ARNHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-belfeld',
    name: 'BELFELD',
    flag: 'NLD',
  },
  {
    id: 'nld-bergenopzoom',
    name: 'BERGEN OP ZOOM',
    flag: 'NLD',
  },
  {
    id: 'nld-bodegraven',
    name: 'BODEGRAVEN',
    flag: 'NLD',
  },
  {
    id: 'nld-boskoop',
    name: 'BOSKOOP',
    flag: 'NLD',
  },
  {
    id: 'nld-breda',
    name: 'BREDA',
    flag: 'NLD',
  },
  {
    id: 'nld-buchten',
    name: 'BUCHTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-burdaard',
    name: 'BURDAARD',
    flag: 'NLD',
  },
  {
    id: 'nld-burgum',
    name: 'BURGUM',
    flag: 'NLD',
  },
  {
    id: 'nld-cuijk',
    name: 'CUIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-deest',
    name: 'DEEST',
    flag: 'NLD',
  },
  {
    id: 'nld-deventer',
    name: 'DEVENTER',
    flag: 'NLD',
  },
  {
    id: 'nld-doetinchem',
    name: 'DOETINCHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-dokkum',
    name: 'DOKKUM',
    flag: 'NLD',
  },
  {
    id: 'nld-dongen',
    name: 'DONGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-drachten',
    name: 'DRACHTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-driel',
    name: 'DRIEL',
    flag: 'NLD',
  },
  {
    id: 'nld-druten',
    name: 'DRUTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-elburg',
    name: 'ELBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-elst',
    name: 'ELST',
    flag: 'NLD',
  },
  {
    id: 'nld-emmeloord',
    name: 'EMMELOORD',
    flag: 'NLD',
  },
  {
    id: 'nld-empel',
    name: 'EMPEL',
    flag: 'NLD',
  },
  {
    id: 'nld-franeker',
    name: 'FRANEKER',
    flag: 'NLD',
  },
  {
    id: 'nld-gaastmeer',
    name: 'GAASTMEER',
    flag: 'NLD',
  },
  {
    id: 'nld-geldermalsen',
    name: 'GELDERMALSEN',
    flag: 'NLD',
  },
  {
    id: 'nld-giesbeek',
    name: 'GIESBEEK',
    flag: 'NLD',
  },
  {
    id: 'nld-giethoorn',
    name: 'GIETHOORN',
    flag: 'NLD',
  },
  {
    id: 'nld-goes',
    name: 'GOES',
    flag: 'NLD',
  },
  {
    id: 'nld-goor',
    name: 'GOOR',
    flag: 'NLD',
  },
  {
    id: 'nld-gouda',
    name: 'GOUDA',
    flag: 'NLD',
  },
  {
    id: 'nld-goudswaard',
    name: 'GOUDSWAARD',
    flag: 'NLD',
  },
  {
    id: 'nld-grave',
    name: 'GRAVE',
    flag: 'NLD',
  },
  {
    id: 'nld-groningen',
    name: 'GRONINGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-grou',
    name: 'GROU',
    flag: 'NLD',
  },
  {
    id: 'nld-harderwijk',
    name: 'HARDERWIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-hasselt',
    name: 'HASSELT',
    flag: 'NLD',
  },
  {
    id: 'nld-heeg',
    name: 'HEEG',
    flag: 'NLD',
  },
  {
    id: 'nld-heerenveen',
    name: 'HEERENVEEN',
    flag: 'NLD',
  },
  {
    id: 'nld-heijen',
    name: 'HEIJEN',
    flag: 'NLD',
  },
  {
    id: 'nld-helmond',
    name: 'HELMOND',
    flag: 'NLD',
  },
  {
    id: 'nld-hengelo',
    name: 'HENGELO',
    flag: 'NLD',
  },
  {
    id: 'nld-heteren',
    name: 'HETEREN',
    flag: 'NLD',
  },
  {
    id: 'nld-heusden',
    name: 'HEUSDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-hoogezand',
    name: 'HOOGEZAND',
    flag: 'NLD',
  },
  {
    id: 'nld-hoorn',
    name: 'HOORN',
    flag: 'NLD',
  },
  {
    id: 'nld-huizen',
    name: 'HUIZEN',
    flag: 'NLD',
  },
  {
    id: 'nld-ijlst',
    name: 'IJLST',
    flag: 'NLD',
  },
  {
    id: 'nld-kessel',
    name: 'KESSEL',
    flag: 'NLD',
  },
  {
    id: 'nld-leeuwarden',
    name: 'LEEUWARDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-lieshout',
    name: 'LIESHOUT',
    flag: 'NLD',
  },
  {
    id: 'nld-lith',
    name: 'LITH',
    flag: 'NLD',
  },
  {
    id: 'nld-lochem',
    name: 'LOCHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-loosdrecht',
    name: 'LOOSDRECHT',
    flag: 'NLD',
  },
  {
    id: 'nld-maarssen',
    name: 'MAARSSEN',
    flag: 'NLD',
  },
  {
    id: 'nld-maasbracht',
    name: 'MAASBRACHT',
    flag: 'NLD',
  },
  {
    id: 'nld-maashees',
    name: 'MAASHEES',
    flag: 'NLD',
  },
  {
    id: 'nld-maastricht',
    name: 'MAASTRICHT',
    flag: 'NLD',
  },
  {
    id: 'nld-maurik',
    name: 'MAURIK',
    flag: 'NLD',
  },
  {
    id: 'nld-meppel',
    name: 'MEPPEL',
    flag: 'NLD',
  },
  {
    id: 'nld-middenmeer',
    name: 'MIDDENMEER',
    flag: 'NLD',
  },
  {
    id: 'nld-muiderzand',
    name: 'MUIDERZAND',
    flag: 'NLD',
  },
  {
    id: 'nld-nederweert',
    name: 'NEDERWEERT',
    flag: 'NLD',
  },
  {
    id: 'nld-niftrik',
    name: 'NIFTRIK',
    flag: 'NLD',
  },
  {
    id: 'nld-nijkerk',
    name: 'NIJKERK',
    flag: 'NLD',
  },
  {
    id: 'nld-nijmegen',
    name: 'NIJMEGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-numansdorp',
    name: 'NUMANSDORP',
    flag: 'NLD',
  },
  {
    id: 'nld-ooltgensplaat',
    name: 'OOLTGENSPLAAT',
    flag: 'NLD',
  },
  {
    id: 'nld-oosterhout',
    name: 'OOSTERHOUT',
    flag: 'NLD',
  },
  {
    id: 'nld-oostmahorn',
    name: 'OOSTMAHORN',
    flag: 'NLD',
  },
  {
    id: 'nld-oudewater',
    name: 'OUDEWATER',
    flag: 'NLD',
  },
  {
    id: 'nld-purmerend',
    name: 'PURMEREND',
    flag: 'NLD',
  },
  {
    id: 'nld-ravenstein',
    name: 'RAVENSTEIN',
    flag: 'NLD',
  },
  {
    id: 'nld-rhenen',
    name: 'RHENEN',
    flag: 'NLD',
  },
  {
    id: 'nld-roermond',
    name: 'ROERMOND',
    flag: 'NLD',
  },
  {
    id: 'nld-roosendaal',
    name: 'ROOSENDAAL',
    flag: 'NLD',
  },
  {
    id: 'nld-s-hertogenbosch',
    name: 'S-HERTOGENBOSCH',
    flag: 'NLD',
  },
  {
    id: 'nld-schagen',
    name: 'SCHAGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-schoonhoven',
    name: 'SCHOONHOVEN',
    flag: 'NLD',
  },
  {
    id: 'nld-sneek',
    name: 'SNEEK',
    flag: 'NLD',
  },
  {
    id: 'nld-stampersgat',
    name: 'STAMPERSGAT',
    flag: 'NLD',
  },
  {
    id: 'nld-steenbergen',
    name: 'STEENBERGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-stein',
    name: 'STEIN',
    flag: 'NLD',
  },
  {
    id: 'nld-tholen',
    name: 'THOLEN',
    flag: 'NLD',
  },
  {
    id: 'nld-tiel',
    name: 'TIEL',
    flag: 'NLD',
  },
  {
    id: 'nld-tilburg',
    name: 'TILBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-uithoorn',
    name: 'UITHOORN',
    flag: 'NLD',
  },
  {
    id: 'nld-utrecht',
    name: 'UTRECHT',
    flag: 'NLD',
  },
  {
    id: 'nld-veendam',
    name: 'VEENDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-veere',
    name: 'VEERE',
    flag: 'NLD',
  },
  {
    id: 'nld-veghel',
    name: 'VEGHEL',
    flag: 'NLD',
  },
  {
    id: 'nld-venlo',
    name: 'VENLO',
    flag: 'NLD',
  },
  {
    id: 'nld-vinkeveen',
    name: 'VINKEVEEN',
    flag: 'NLD',
  },
  {
    id: 'nld-vollenhove',
    name: 'VOLLENHOVE',
    flag: 'NLD',
  },
  {
    id: 'nld-vriezenveen',
    name: 'VRIEZENVEEN',
    flag: 'NLD',
  },
  {
    id: 'nld-wageningen',
    name: 'WAGENINGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-wanssum',
    name: 'WANSSUM',
    flag: 'NLD',
  },
  {
    id: 'nld-waterhuizen',
    name: 'WATERHUIZEN',
    flag: 'NLD',
  },
  {
    id: 'nld-workum',
    name: 'WORKUM',
    flag: 'NLD',
  },
  {
    id: 'nld-zeewolde',
    name: 'ZEEWOLDE',
    flag: 'NLD',
  },
  {
    id: 'nld-zoutkamp',
    name: 'ZOUTKAMP',
    flag: 'NLD',
  },
  {
    id: 'nld-zuilichem',
    name: 'ZUILICHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-zwartenberg',
    name: 'ZWARTENBERG',
    flag: 'NLD',
  },
  {
    id: 'nld-zwartsluis',
    name: 'ZWARTSLUIS',
    flag: 'NLD',
  },
  {
    id: 'nld-zwolle',
    name: 'ZWOLLE',
    flag: 'NLD',
  },
  {
    id: 'nor-ansnes',
    name: 'ANSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-aroysund',
    name: 'AROYSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-asgardstrand',
    name: 'ASGARDSTRAND',
    flag: 'NOR',
  },
  {
    id: 'nor-aurdal',
    name: 'AURDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-berg',
    name: 'BERG',
    flag: 'NOR',
  },
  {
    id: 'nor-bjarkoy',
    name: 'BJARKOY',
    flag: 'NOR',
  },
  {
    id: 'nor-buvika',
    name: 'BUVIKA',
    flag: 'NOR',
  },
  {
    id: 'nor-eikefjord',
    name: 'EIKEFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-engalsvik',
    name: 'ENGALSVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-etne',
    name: 'ETNE',
    flag: 'NOR',
  },
  {
    id: 'nor-fillan',
    name: 'FILLAN',
    flag: 'NOR',
  },
  {
    id: 'nor-fiska',
    name: 'FISKA',
    flag: 'NOR',
  },
  {
    id: 'nor-flam',
    name: 'FLAM',
    flag: 'NOR',
  },
  {
    id: 'nor-flekkefjord',
    name: 'FLEKKEFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-forsand',
    name: 'FORSAND',
    flag: 'NOR',
  },
  {
    id: 'nor-forvik',
    name: 'FORVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-granvin',
    name: 'GRANVIN',
    flag: 'NOR',
  },
  {
    id: 'nor-greaker',
    name: 'GREAKER',
    flag: 'NOR',
  },
  {
    id: 'nor-hamnes',
    name: 'HAMNES',
    flag: 'NOR',
  },
  {
    id: 'nor-helle',
    name: 'HELLE',
    flag: 'NOR',
  },
  {
    id: 'nor-hellesylt',
    name: 'HELLESYLT',
    flag: 'NOR',
  },
  {
    id: 'nor-herand',
    name: 'HERAND',
    flag: 'NOR',
  },
  {
    id: 'nor-hindaravag',
    name: 'HINDARAVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-holmestrand',
    name: 'HOLMESTRAND',
    flag: 'NOR',
  },
  {
    id: 'nor-hommelvik',
    name: 'HOMMELVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-horsoy',
    name: 'HORSOY',
    flag: 'NOR',
  },
  {
    id: 'nor-hyen',
    name: 'HYEN',
    flag: 'NOR',
  },
  {
    id: 'nor-jektvik',
    name: 'JEKTVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-kambo',
    name: 'KAMBO',
    flag: 'NOR',
  },
  {
    id: 'nor-kaupanger',
    name: 'KAUPANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-kjopmannskjaer',
    name: 'KJOPMANNSKJAER',
    flag: 'NOR',
  },
  {
    id: 'nor-knarrlagsund',
    name: 'KNARRLAGSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-kolvereid',
    name: 'KOLVEREID',
    flag: 'NOR',
  },
  {
    id: 'nor-kvalsund',
    name: 'KVALSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-kvenvaer',
    name: 'KVENVAER',
    flag: 'NOR',
  },
  {
    id: 'nor-kvinesdal',
    name: 'KVINESDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-kyrksaeterora',
    name: 'KYRKSAETERORA',
    flag: 'NOR',
  },
  {
    id: 'nor-lauvsnes',
    name: 'LAUVSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-lysoysund',
    name: 'LYSOYSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-melsomvik',
    name: 'MELSOMVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-naersnes',
    name: 'NAERSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-nesbrygga',
    name: 'NESBRYGGA',
    flag: 'NOR',
  },
  {
    id: 'nor-nevlunghavn',
    name: 'NEVLUNGHAVN',
    flag: 'NOR',
  },
  {
    id: 'nor-oystese',
    name: 'OYSTESE',
    flag: 'NOR',
  },
  {
    id: 'nor-rakvag',
    name: 'RAKVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-saeboe',
    name: 'SAEBOE',
    flag: 'NOR',
  },
  {
    id: 'nor-sagvag',
    name: 'SAGVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-sandefjord',
    name: 'SANDEFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-sandeid',
    name: 'SANDEID',
    flag: 'NOR',
  },
  {
    id: 'nor-sarpsborg',
    name: 'SARPSBORG',
    flag: 'NOR',
  },
  {
    id: 'nor-selva',
    name: 'SELVA',
    flag: 'NOR',
  },
  {
    id: 'nor-selvik',
    name: 'SELVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-skaanevik',
    name: 'SKAANEVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-skien',
    name: 'SKIEN',
    flag: 'NOR',
  },
  {
    id: 'nor-skjaerhalden',
    name: 'SKJAERHALDEN',
    flag: 'NOR',
  },
  {
    id: 'nor-skrova',
    name: 'SKROVA',
    flag: 'NOR',
  },
  {
    id: 'nor-sogndal',
    name: 'SOGNDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-son',
    name: 'SON',
    flag: 'NOR',
  },
  {
    id: 'nor-storfosna',
    name: 'STORFOSNA',
    flag: 'NOR',
  },
  {
    id: 'nor-stranda',
    name: 'STRANDA',
    flag: 'NOR',
  },
  {
    id: 'nor-straumen',
    name: 'STRAUMEN',
    flag: 'NOR',
  },
  {
    id: 'nor-svanem',
    name: 'SVANEM',
    flag: 'NOR',
  },
  {
    id: 'nor-sylte',
    name: 'SYLTE',
    flag: 'NOR',
  },
  {
    id: 'nor-tonsberg',
    name: 'TONSBERG',
    flag: 'NOR',
  },
  {
    id: 'nor-vaagland',
    name: 'VAAGLAND',
    flag: 'NOR',
  },
  {
    id: 'nor-valle',
    name: 'VALLE',
    flag: 'NOR',
  },
  {
    id: 'nor-vatlandsvaag',
    name: 'VATLANDSVAAG',
    flag: 'NOR',
  },
  {
    id: 'nor-vestersand',
    name: 'VESTERSAND',
    flag: 'NOR',
  },
  {
    id: 'nor-vikedal',
    name: 'VIKEDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-vikene',
    name: 'VIKENE',
    flag: 'NOR',
  },
  {
    id: 'nor-visnes',
    name: 'VISNES',
    flag: 'NOR',
  },
  {
    id: 'nzl-paroabay',
    name: 'PAROA BAY',
    flag: 'NZL',
  },
  {
    id: 'nzl-westharbour',
    name: 'WEST HARBOUR',
    flag: 'NZL',
  },
  {
    id: 'pan-chorrillo',
    name: 'CHORRILLO',
    flag: 'PAN',
  },
  {
    id: 'pan-sambabonita',
    name: 'SAMBA BONITA',
    flag: 'PAN',
  },
  {
    id: 'per-casma',
    name: 'CASMA',
    flag: 'PER',
  },
  {
    id: 'per-cerroazul',
    name: 'CERRO AZUL',
    flag: 'PER',
  },
  {
    id: 'per-eten',
    name: 'ETEN',
    flag: 'PER',
  },
  {
    id: 'per-lobitos',
    name: 'LOBITOS',
    flag: 'PER',
  },
  {
    id: 'per-pacasmayo',
    name: 'PACASMAYO',
    flag: 'PER',
  },
  {
    id: 'phl-batan',
    name: 'BATAN',
    flag: 'PHL',
  },
  {
    id: 'phl-cabadbaran',
    name: 'CABADBARAN',
    flag: 'PHL',
  },
  {
    id: 'phl-doos',
    name: 'DOOS',
    flag: 'PHL',
  },
  {
    id: 'phl-iligantosurigao',
    name: 'ILIGAN TO SURIGAO',
    flag: 'PHL',
  },
  {
    id: 'phl-jagna',
    name: 'JAGNA',
    flag: 'PHL',
  },
  {
    id: 'phl-lucena',
    name: 'LUCENA',
    flag: 'PHL',
  },
  {
    id: 'phl-niugan',
    name: 'NIUGAN',
    flag: 'PHL',
  },
  {
    id: 'phl-union',
    name: 'UNION',
    flag: 'PHL',
  },
  {
    id: 'phl-winsubicbayonly',
    name: 'W IN SUBIC BAY ONLY',
    flag: 'PHL',
  },
  {
    id: 'png-kieta',
    name: 'KIETA',
    flag: 'PNG',
  },
  {
    id: 'pri-laparguera',
    name: 'LA PARGUERA',
    flag: 'PRI',
  },
  {
    id: 'pry-pilar',
    name: 'PILAR',
    flag: 'PRY',
  },
  {
    id: 'pry-puertovallemi',
    name: 'PUERTO VALLE MI',
    flag: 'PRY',
  },
  {
    id: 'pry-sanantonio',
    name: 'SAN ANTONIO',
    flag: 'PRY',
  },
  {
    id: 'rou-calafat',
    name: 'CALAFAT',
    flag: 'ROU',
  },
  {
    id: 'rou-cernavoda',
    name: 'CERNAVODA',
    flag: 'ROU',
  },
  {
    id: 'rou-corabia',
    name: 'CORABIA',
    flag: 'ROU',
  },
  {
    id: 'rou-drobeta-turnuseverin',
    name: 'DROBETA-TURNU SEVERIN',
    flag: 'ROU',
  },
  {
    id: 'rou-eselnita',
    name: 'ESELNITA',
    flag: 'ROU',
  },
  {
    id: 'rou-garcov',
    name: 'GARCOV',
    flag: 'ROU',
  },
  {
    id: 'rou-giurgiu',
    name: 'GIURGIU',
    flag: 'ROU',
  },
  {
    id: 'rou-giurgiulesti',
    name: 'GIURGIULESTI',
    flag: 'ROU',
  },
  {
    id: 'rou-isaccea',
    name: 'ISACCEA',
    flag: 'ROU',
  },
  {
    id: 'rou-medgidia',
    name: 'MEDGIDIA',
    flag: 'ROU',
  },
  {
    id: 'rou-moldovaveche',
    name: 'MOLDOVA VECHE',
    flag: 'ROU',
  },
  {
    id: 'rou-murfatlar',
    name: 'MURFATLAR',
    flag: 'ROU',
  },
  {
    id: 'rou-oltenita',
    name: 'OLTENITA',
    flag: 'ROU',
  },
  {
    id: 'rus-alekseevsk',
    name: 'ALEKSEEVSK',
    flag: 'RUS',
  },
  {
    id: 'rus-balakhna',
    name: 'BALAKHNA',
    flag: 'RUS',
  },
  {
    id: 'rus-balakovo',
    name: 'BALAKOVO',
    flag: 'RUS',
  },
  {
    id: 'rus-bereslavka',
    name: 'BERESLAVKA',
    flag: 'RUS',
  },
  {
    id: 'rus-berezniki',
    name: 'BEREZNIKI',
    flag: 'RUS',
  },
  {
    id: "rus-bogatyr'",
    name: "BOGATYR'",
    flag: 'RUS',
  },
  {
    id: 'rus-buzan',
    name: 'BUZAN',
    flag: 'RUS',
  },
  {
    id: 'rus-cherepovets',
    name: 'CHEREPOVETS',
    flag: 'RUS',
  },
  {
    id: 'rus-cherepovetsanchorage',
    name: 'CHEREPOVETS ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'rus-chistopol',
    name: 'CHISTOPOL',
    flag: 'RUS',
  },
  {
    id: 'rus-filanovskogo',
    name: 'FILANOVSKOGO',
    flag: 'RUS',
  },
  {
    id: 'rus-kalach-na-donu',
    name: 'KALACH-NA-DONU',
    flag: 'RUS',
  },
  {
    id: 'rus-kamyshin',
    name: 'KAMYSHIN',
    flag: 'RUS',
  },
  {
    id: 'rus-kirensk',
    name: 'KIRENSK',
    flag: 'RUS',
  },
  {
    id: 'rus-kirovsk',
    name: 'KIROVSK',
    flag: 'RUS',
  },
  {
    id: 'rus-kondopoga',
    name: 'KONDOPOGA',
    flag: 'RUS',
  },
  {
    id: 'rus-krasnoyarsk',
    name: 'KRASNOYARSK',
    flag: 'RUS',
  },
  {
    id: 'rus-kstovo',
    name: 'KSTOVO',
    flag: 'RUS',
  },
  {
    id: 'rus-kuybyshevskiyzaton',
    name: 'KUYBYSHEVSKIY ZATON',
    flag: 'RUS',
  },
  {
    id: 'rus-lomonosov',
    name: 'LOMONOSOV',
    flag: 'RUS',
  },
  {
    id: 'rus-mokhsogollokh',
    name: 'MOKHSOGOLLOKH',
    flag: 'RUS',
  },
  {
    id: 'rus-moscow',
    name: 'MOSCOW',
    flag: 'RUS',
  },
  {
    id: 'rus-naberezhnyechelny',
    name: 'NABEREZHNYE CHELNY',
    flag: 'RUS',
  },
  {
    id: 'rus-nakhodkaanchorage',
    name: 'NAKHODKA ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'rus-nizhnekamsk',
    name: 'NIZHNEKAMSK',
    flag: 'RUS',
  },
  {
    id: 'rus-nizhnekamskanchorage',
    name: 'NIZHNEKAMSK ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'rus-nizhniybestyakh',
    name: 'NIZHNIY BESTYAKH',
    flag: 'RUS',
  },
  {
    id: 'rus-nizhniynovgorod',
    name: 'NIZHNIY NOVGOROD',
    flag: 'RUS',
  },
  {
    id: 'rus-nizhnynovgorod',
    name: 'NIZHNY NOVGOROD',
    flag: 'RUS',
  },
  {
    id: 'rus-oktyabrsk',
    name: 'OKTYABRSK',
    flag: 'RUS',
  },
  {
    id: 'rus-omsk',
    name: 'OMSK',
    flag: 'RUS',
  },
  {
    id: 'rus-pamyatparizhskoy',
    name: 'PAMYAT PARIZHSKOY',
    flag: 'RUS',
  },
  {
    id: 'rus-peleduy',
    name: 'PELEDUY',
    flag: 'RUS',
  },
  {
    id: 'rus-petrozavodsk',
    name: 'PETROZAVODSK',
    flag: 'RUS',
  },
  {
    id: 'rus-podtyosovo',
    name: 'PODTYOSOVO',
    flag: 'RUS',
  },
  {
    id: 'rus-rybinsk',
    name: 'RYBINSK',
    flag: 'RUS',
  },
  {
    id: 'rus-saratov',
    name: 'SARATOV',
    flag: 'RUS',
  },
  {
    id: 'rus-shalskii',
    name: 'SHALSKII',
    flag: 'RUS',
  },
  {
    id: 'rus-shlisseburg',
    name: 'SHLISSEBURG',
    flag: 'RUS',
  },
  {
    id: 'rus-solikamsk',
    name: 'SOLIKAMSK',
    flag: 'RUS',
  },
  {
    id: 'rus-tenishevo',
    name: 'TENISHEVO',
    flag: 'RUS',
  },
  {
    id: 'rus-tolyatti',
    name: 'TOLYATTI',
    flag: 'RUS',
  },
  {
    id: 'rus-ufa',
    name: 'UFA',
    flag: 'RUS',
  },
  {
    id: "rus-ust'-donetskiy",
    name: "UST'-DONETSKIY",
    flag: 'RUS',
  },
  {
    id: 'rus-ust-kut',
    name: 'UST-KUT',
    flag: 'RUS',
  },
  {
    id: 'rus-ustkut',
    name: 'UST KUT',
    flag: 'RUS',
  },
  {
    id: 'rus-vazhiny',
    name: 'VAZHINY',
    flag: 'RUS',
  },
  {
    id: 'rus-vitim',
    name: 'VITIM',
    flag: 'RUS',
  },
  {
    id: 'rus-volgo-kaspiyskiy',
    name: 'VOLGO-KASPIYSKIY',
    flag: 'RUS',
  },
  {
    id: 'rus-voznesenye',
    name: 'VOZNESENYE',
    flag: 'RUS',
  },
  {
    id: 'rus-voznesenyeanchorage',
    name: 'VOZNESENYE ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'rus-vytegra',
    name: 'VYTEGRA',
    flag: 'RUS',
  },
  {
    id: 'rus-vytegraanchorage',
    name: 'VYTEGRA ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'rus-yakutsk',
    name: 'YAKUTSK',
    flag: 'RUS',
  },
  {
    id: 'rus-yaroslavl',
    name: 'YAROSLAVL',
    flag: 'RUS',
  },
  {
    id: 'rus-zavolzhye',
    name: 'ZAVOLZHYE',
    flag: 'RUS',
  },
  {
    id: 'rus-zhatay',
    name: 'ZHATAY',
    flag: 'RUS',
  },
  {
    id: 'rus-zhigansk',
    name: 'ZHIGANSK',
    flag: 'RUS',
  },
  {
    id: 'rus-zvenigovo',
    name: 'ZVENIGOVO',
    flag: 'RUS',
  },
  {
    id: 'slb-hobaba',
    name: 'HOBABA',
    flag: 'SLB',
  },
  {
    id: 'slb-korighole',
    name: 'KORIGHOLE',
    flag: 'SLB',
  },
  {
    id: 'slb-maloku',
    name: 'MALOKU',
    flag: 'SLB',
  },
  {
    id: 'slb-muki',
    name: 'MUKI',
    flag: 'SLB',
  },
  {
    id: 'srb-apatin',
    name: 'APATIN',
    flag: 'SRB',
  },
  {
    id: 'srb-backapalanka',
    name: 'BACKA PALANKA',
    flag: 'SRB',
  },
  {
    id: 'srb-beocin',
    name: 'BEOCIN',
    flag: 'SRB',
  },
  {
    id: 'srb-donjimilanovac',
    name: 'DONJI MILANOVAC',
    flag: 'SRB',
  },
  {
    id: 'srb-grocka',
    name: 'GROCKA',
    flag: 'SRB',
  },
  {
    id: 'srb-kladovo',
    name: 'KLADOVO',
    flag: 'SRB',
  },
  {
    id: 'srb-novisad',
    name: 'NOVI SAD',
    flag: 'SRB',
  },
  {
    id: 'srb-ostruznica',
    name: 'OSTRUZNICA',
    flag: 'SRB',
  },
  {
    id: 'srb-pancevo',
    name: 'PANCEVO',
    flag: 'SRB',
  },
  {
    id: 'srb-prahovo',
    name: 'PRAHOVO',
    flag: 'SRB',
  },
  {
    id: 'srb-smederevo',
    name: 'SMEDEREVO',
    flag: 'SRB',
  },
  {
    id: 'srb-sremskikarlovci',
    name: 'SREMSKI KARLOVCI',
    flag: 'SRB',
  },
  {
    id: 'srb-titel',
    name: 'TITEL',
    flag: 'SRB',
  },
  {
    id: 'srb-velikogradiste',
    name: 'VELIKO GRADISTE',
    flag: 'SRB',
  },
  {
    id: 'svk-bratislava',
    name: 'BRATISLAVA',
    flag: 'SVK',
  },
  {
    id: 'svk-gabcikovo',
    name: 'GABCIKOVO',
    flag: 'SVK',
  },
  {
    id: 'svk-klizskanema',
    name: 'KLIZSKA NEMA',
    flag: 'SVK',
  },
  {
    id: 'svk-komarno',
    name: 'KOMARNO',
    flag: 'SVK',
  },
  {
    id: 'svk-sturovo',
    name: 'STUROVO',
    flag: 'SVK',
  },
  {
    id: 'svn-lucija',
    name: 'LUCIJA',
    flag: 'SVN',
  },
  {
    id: 'swe-aalstensmaabaatsham',
    name: 'AALSTEN SMAABAATSHAM',
    flag: 'SWE',
  },
  {
    id: 'swe-agno',
    name: 'AGNO',
    flag: 'SWE',
  },
  {
    id: 'swe-bastad',
    name: 'BASTAD',
    flag: 'SWE',
  },
  {
    id: 'swe-bietnam',
    name: 'BIETNAM',
    flag: 'SWE',
  },
  {
    id: 'swe-bjorlandakile',
    name: 'BJORLANDA KILE',
    flag: 'SWE',
  },
  {
    id: 'swe-dalaro',
    name: 'DALARO',
    flag: 'SWE',
  },
  {
    id: 'swe-djupvik',
    name: 'DJUPVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-docksta',
    name: 'DOCKSTA',
    flag: 'SWE',
  },
  {
    id: 'swe-dufnaes',
    name: 'DUFNAES',
    flag: 'SWE',
  },
  {
    id: 'swe-ellos',
    name: 'ELLOS',
    flag: 'SWE',
  },
  {
    id: 'swe-farjestaden',
    name: 'FARJESTADEN',
    flag: 'SWE',
  },
  {
    id: 'swe-figeholm',
    name: 'FIGEHOLM',
    flag: 'SWE',
  },
  {
    id: 'swe-fiskebaeckskil',
    name: 'FISKEBAECKSKIL',
    flag: 'SWE',
  },
  {
    id: 'swe-fjallbacka',
    name: 'FJALLBACKA',
    flag: 'SWE',
  },
  {
    id: 'swe-flivik',
    name: 'FLIVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-fyrudden',
    name: 'FYRUDDEN',
    flag: 'SWE',
  },
  {
    id: 'swe-gaashaga',
    name: 'GAASHAGA',
    flag: 'SWE',
  },
  {
    id: 'swe-gustavsberg',
    name: 'GUSTAVSBERG',
    flag: 'SWE',
  },
  {
    id: 'swe-gyrt',
    name: 'GYRT',
    flag: 'SWE',
  },
  {
    id: 'swe-hallevik',
    name: 'HALLEVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-hamburgsundvandigen',
    name: 'HAMBURGSUND VANDIGEN',
    flag: 'SWE',
  },
  {
    id: 'swe-hasselby',
    name: 'HASSELBY',
    flag: 'SWE',
  },
  {
    id: 'swe-henan',
    name: 'HENAN',
    flag: 'SWE',
  },
  {
    id: 'swe-jungfrusundroad',
    name: 'JUNGFRUSUND ROAD',
    flag: 'SWE',
  },
  {
    id: 'swe-karlstad',
    name: 'KARLSTAD',
    flag: 'SWE',
  },
  {
    id: 'swe-kinderoad',
    name: 'KINDE ROAD',
    flag: 'SWE',
  },
  {
    id: 'swe-koping',
    name: 'KOPING',
    flag: 'SWE',
  },
  {
    id: 'swe-kungalv',
    name: 'KUNGALV',
    flag: 'SWE',
  },
  {
    id: 'swe-lerkil',
    name: 'LERKIL',
    flag: 'SWE',
  },
  {
    id: 'swe-lidingoebosoen',
    name: 'LIDINGOE BOSOEN',
    flag: 'SWE',
  },
  {
    id: 'swe-ljungskile',
    name: 'LJUNGSKILE',
    flag: 'SWE',
  },
  {
    id: 'swe-lomma',
    name: 'LOMMA',
    flag: 'SWE',
  },
  {
    id: 'swe-moerbylaanga',
    name: 'MOERBYLAANGA',
    flag: 'SWE',
  },
  {
    id: 'swe-monsteras',
    name: 'MONSTERAS',
    flag: 'SWE',
  },
  {
    id: 'swe-norrtalje',
    name: 'NORRTALJE',
    flag: 'SWE',
  },
  {
    id: 'swe-okno',
    name: 'OKNO',
    flag: 'SWE',
  },
  {
    id: 'swe-ororvikabyfjorden',
    name: 'O RORVIK ABYFJORDEN',
    flag: 'SWE',
  },
  {
    id: 'swe-ramsvik',
    name: 'RAMSVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-reso',
    name: 'RESO',
    flag: 'SWE',
  },
  {
    id: 'swe-rindo',
    name: 'RINDO',
    flag: 'SWE',
  },
  {
    id: 'swe-saltsjoebadenpaalna',
    name: 'SALTSJOEBADEN PAALNA',
    flag: 'SWE',
  },
  {
    id: 'swe-sannas',
    name: 'SANNAS',
    flag: 'SWE',
  },
  {
    id: 'swe-smaengsviken',
    name: 'SMAENGSVIKEN',
    flag: 'SWE',
  },
  {
    id: 'swe-stegeborgs',
    name: 'STEGEBORGS',
    flag: 'SWE',
  },
  {
    id: 'swe-stenungsund',
    name: 'STENUNGSUND',
    flag: 'SWE',
  },
  {
    id: 'swe-stockby',
    name: 'STOCKBY',
    flag: 'SWE',
  },
  {
    id: 'swe-storakorno',
    name: 'STORAKORNO',
    flag: 'SWE',
  },
  {
    id: 'swe-torekov',
    name: 'TOREKOV',
    flag: 'SWE',
  },
  {
    id: 'swe-trollhattan',
    name: 'TROLLHATTAN',
    flag: 'SWE',
  },
  {
    id: 'swe-trosa',
    name: 'TROSA',
    flag: 'SWE',
  },
  {
    id: 'swe-valdemarsvik',
    name: 'VALDEMARSVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-vallvik',
    name: 'VALLVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-vikhog',
    name: 'VIKHOG',
    flag: 'SWE',
  },
  {
    id: 'sxm-oysterpond',
    name: 'OYSTER POND',
    flag: 'SXM',
  },
  {
    id: 'tkm-aladja',
    name: 'ALADJA',
    flag: 'TKM',
  },
  {
    id: 'tkm-hazar',
    name: 'HAZAR',
    flag: 'TKM',
  },
  {
    id: 'tkm-kiyanly',
    name: 'KIYANLY',
    flag: 'TKM',
  },
  {
    id: 'tkm-lamfield',
    name: 'LAM FIELD',
    flag: 'TKM',
  },
  {
    id: 'tkm-okarem',
    name: 'OKAREM',
    flag: 'TKM',
  },
  {
    id: 'tur-bozburun',
    name: 'BOZBURUN',
    flag: 'TUR',
  },
  {
    id: 'tur-ekincik',
    name: 'EKINCIK',
    flag: 'TUR',
  },
  {
    id: 'tur-fordotosan',
    name: 'FORD OTOSAN',
    flag: 'TUR',
  },
  {
    id: 'tur-maltepe',
    name: 'MALTEPE',
    flag: 'TUR',
  },
  {
    id: 'tur-mudanya',
    name: 'MUDANYA',
    flag: 'TUR',
  },
  {
    id: 'tur-namikkemal',
    name: 'NAMIK KEMAL',
    flag: 'TUR',
  },
  {
    id: 'tur-pendik',
    name: 'PENDIK',
    flag: 'TUR',
  },
  {
    id: "ukr-holaprystan'",
    name: "HOLA PRYSTAN'",
    flag: 'UKR',
  },
  {
    id: 'ukr-kiliya',
    name: 'KILIYA',
    flag: 'UKR',
  },
  {
    id: 'ukr-novakakhovka',
    name: 'NOVA KAKHOVKA',
    flag: 'UKR',
  },
  {
    id: "ukr-rybal'che",
    name: "RYBAL'CHE",
    flag: 'UKR',
  },
  {
    id: 'ukr-zaporizhia',
    name: 'ZAPORIZHIA',
    flag: 'UKR',
  },
  {
    id: 'ukr-zatoka',
    name: 'ZATOKA',
    flag: 'UKR',
  },
  {
    id: 'ury-santiagovazquez',
    name: 'SANTIAGO VAZQUEZ',
    flag: 'URY',
  },
  {
    id: 'usa-alexandriabay',
    name: 'ALEXANDRIA BAY',
    flag: 'USA',
  },
  {
    id: 'usa-alpena',
    name: 'ALPENA',
    flag: 'USA',
  },
  {
    id: 'usa-alton',
    name: 'ALTON',
    flag: 'USA',
  },
  {
    id: 'usa-andrewsbay',
    name: 'ANDREWS BAY',
    flag: 'USA',
  },
  {
    id: 'usa-ashtabula',
    name: 'ASHTABULA',
    flag: 'USA',
  },
  {
    id: 'usa-barlowbay',
    name: 'BARLOW BAY',
    flag: 'USA',
  },
  {
    id: 'usa-bellaire',
    name: 'BELLAIRE',
    flag: 'USA',
  },
  {
    id: 'usa-bettendorf',
    name: 'BETTENDORF',
    flag: 'USA',
  },
  {
    id: 'usa-blades',
    name: 'BLADES',
    flag: 'USA',
  },
  {
    id: 'usa-bozman',
    name: 'BOZMAN',
    flag: 'USA',
  },
  {
    id: 'usa-breweressex',
    name: 'BREWER ESSEX',
    flag: 'USA',
  },
  {
    id: 'usa-brooklin',
    name: 'BROOKLIN',
    flag: 'USA',
  },
  {
    id: 'usa-buffalo',
    name: 'BUFFALO',
    flag: 'USA',
  },
  {
    id: 'usa-buffaloia',
    name: 'BUFFALO IA',
    flag: 'USA',
  },
  {
    id: 'usa-cairo',
    name: 'CAIRO',
    flag: 'USA',
  },
  {
    id: 'usa-calumetharbor',
    name: 'CALUMET HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-calvertcity',
    name: 'CALVERT CITY',
    flag: 'USA',
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
    id: 'usa-caneycreek',
    name: 'CANEY CREEK',
    flag: 'USA',
  },
  {
    id: 'usa-capegirardeau',
    name: 'CAPE GIRARDEAU',
    flag: 'USA',
  },
  {
    id: 'usa-caruthersville',
    name: 'CARUTHERSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-carville',
    name: 'CARVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-channahon',
    name: 'CHANNAHON',
    flag: 'USA',
  },
  {
    id: 'usa-cheboygan',
    name: 'CHEBOYGAN',
    flag: 'USA',
  },
  {
    id: 'usa-chester',
    name: 'CHESTER',
    flag: 'USA',
  },
  {
    id: 'usa-chicago',
    name: 'CHICAGO',
    flag: 'USA',
  },
  {
    id: 'usa-cluckanut',
    name: 'CLUCKANUT',
    flag: 'USA',
  },
  {
    id: 'usa-courthousebay',
    name: 'COURTHOUSE BAY',
    flag: 'USA',
  },
  {
    id: 'usa-darrow',
    name: 'DARROW',
    flag: 'USA',
  },
  {
    id: 'usa-decatur',
    name: 'DECATUR',
    flag: 'USA',
  },
  {
    id: 'usa-deerharbor',
    name: 'DEER HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-delhihills',
    name: 'DELHI HILLS',
    flag: 'USA',
  },
  {
    id: 'usa-delshire',
    name: 'DELSHIRE',
    flag: 'USA',
  },
  {
    id: 'usa-duluthsuperior',
    name: 'DULUTH SUPERIOR',
    flag: 'USA',
  },
  {
    id: 'usa-eastriver',
    name: 'EAST RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-edgewater',
    name: 'EDGEWATER',
    flag: 'USA',
  },
  {
    id: 'usa-emeryville',
    name: 'EMERYVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-evansville',
    name: 'EVANSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-follansbee',
    name: 'FOLLANSBEE',
    flag: 'USA',
  },
  {
    id: 'usa-francisville',
    name: 'FRANCISVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-frankfort',
    name: 'FRANKFORT',
    flag: 'USA',
  },
  {
    id: 'usa-glassport',
    name: 'GLASSPORT',
    flag: 'USA',
  },
  {
    id: 'usa-governmentisland',
    name: 'GOVERNMENT ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-grandmarais',
    name: 'GRAND MARAIS',
    flag: 'USA',
  },
  {
    id: 'usa-grandmaraisrecreat',
    name: 'GRAND MARAIS RECREAT',
    flag: 'USA',
  },
  {
    id: 'usa-greatkillsharbor',
    name: 'GREAT KILLS HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-greenbay',
    name: 'GREEN BAY',
    flag: 'USA',
  },
  {
    id: 'usa-greenville',
    name: 'GREENVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-haines',
    name: 'HAINES',
    flag: 'USA',
  },
  {
    id: 'usa-hannibal',
    name: 'HANNIBAL',
    flag: 'USA',
  },
  {
    id: 'usa-harborsprings',
    name: 'HARBOR SPRINGS',
    flag: 'USA',
  },
  {
    id: 'usa-havana',
    name: 'HAVANA',
    flag: 'USA',
  },
  {
    id: 'usa-haydenisland',
    name: 'HAYDEN ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-hennepin',
    name: 'HENNEPIN',
    flag: 'USA',
  },
  {
    id: 'usa-hickman',
    name: 'HICKMAN',
    flag: 'USA',
  },
  {
    id: 'usa-hinghamshipyard',
    name: 'HINGHAM SHIPYARD',
    flag: 'USA',
  },
  {
    id: 'usa-hodgkins',
    name: 'HODGKINS',
    flag: 'USA',
  },
  {
    id: 'usa-huntingtontristate',
    name: 'HUNTINGTON TRI STATE',
    flag: 'USA',
  },
  {
    id: 'usa-indianaharbor',
    name: 'INDIANA HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-industry',
    name: 'INDUSTRY',
    flag: 'USA',
  },
  {
    id: 'usa-jeffersonville',
    name: 'JEFFERSONVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-jensenbeach',
    name: 'JENSEN BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-joliet',
    name: 'JOLIET',
    flag: 'USA',
  },
  {
    id: 'usa-joppa',
    name: 'JOPPA',
    flag: 'USA',
  },
  {
    id: 'usa-kabuta',
    name: 'KABUTA',
    flag: 'USA',
  },
  {
    id: 'usa-kanawhaharbor',
    name: 'KANAWHA HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-kenai',
    name: 'KENAI',
    flag: 'USA',
  },
  {
    id: 'usa-kirkland',
    name: 'KIRKLAND',
    flag: 'USA',
  },
  {
    id: 'usa-krotzsprings',
    name: 'KROTZ SPRINGS',
    flag: 'USA',
  },
  {
    id: 'usa-lacrosse',
    name: 'LA CROSSE',
    flag: 'USA',
  },
  {
    id: 'usa-leetsdale',
    name: 'LEETSDALE',
    flag: 'USA',
  },
  {
    id: 'usa-lemont',
    name: 'LEMONT',
    flag: 'USA',
  },
  {
    id: 'usa-lockport',
    name: 'LOCKPORT',
    flag: 'USA',
  },
  {
    id: 'usa-louisville',
    name: 'LOUISVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-ludington',
    name: 'LUDINGTON',
    flag: 'USA',
  },
  {
    id: 'usa-manistee',
    name: 'MANISTEE',
    flag: 'USA',
  },
  {
    id: 'usa-manitowoc',
    name: 'MANITOWOC',
    flag: 'USA',
  },
  {
    id: 'usa-marseilles',
    name: 'MARSEILLES',
    flag: 'USA',
  },
  {
    id: 'usa-mayo',
    name: 'MAYO',
    flag: 'USA',
  },
  {
    id: 'usa-mearsgreatoak',
    name: 'MEARS GREAT OAK',
    flag: 'USA',
  },
  {
    id: 'usa-mearshaven',
    name: 'MEARS HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-meydenbauer',
    name: 'MEYDENBAUER',
    flag: 'USA',
  },
  {
    id: 'usa-milwaukee',
    name: 'MILWAUKEE',
    flag: 'USA',
  },
  {
    id: 'usa-monroe',
    name: 'MONROE',
    flag: 'USA',
  },
  {
    id: 'usa-mountdesert',
    name: 'MOUNT DESERT',
    flag: 'USA',
  },
  {
    id: 'usa-mountvernon',
    name: 'MOUNT VERNON',
    flag: 'USA',
  },
  {
    id: 'usa-naplate',
    name: 'NAPLATE',
    flag: 'USA',
  },
  {
    id: 'usa-natchez',
    name: 'NATCHEZ',
    flag: 'USA',
  },
  {
    id: 'usa-nevilleisland',
    name: 'NEVILLE ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-newburghin',
    name: 'NEWBURGH IN',
    flag: 'USA',
  },
  {
    id: 'usa-newell',
    name: 'NEWELL',
    flag: 'USA',
  },
  {
    id: 'usa-northbeachanchorage',
    name: 'NORTH BEACH ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-northseadrift',
    name: 'NORTH SEADRIFT',
    flag: 'USA',
  },
  {
    id: 'usa-oakharbor',
    name: 'OAK HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-oakpark',
    name: 'OAK PARK',
    flag: 'USA',
  },
  {
    id: 'usa-ogdensburg',
    name: 'OGDENSBURG',
    flag: 'USA',
  },
  {
    id: 'usa-oldriver',
    name: 'OLD RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-osceola',
    name: 'OSCEOLA',
    flag: 'USA',
  },
  {
    id: 'usa-ottawa',
    name: 'OTTAWA',
    flag: 'USA',
  },
  {
    id: 'usa-paducah',
    name: 'PADUCAH',
    flag: 'USA',
  },
  {
    id: 'usa-palmcoast',
    name: 'PALM COAST',
    flag: 'USA',
  },
  {
    id: 'usa-pekin',
    name: 'PEKIN',
    flag: 'USA',
  },
  {
    id: 'usa-peoria',
    name: 'PEORIA',
    flag: 'USA',
  },
  {
    id: 'usa-peruil',
    name: 'PERU IL',
    flag: 'USA',
  },
  {
    id: 'usa-pointroberts',
    name: 'POINT ROBERTS',
    flag: 'USA',
  },
  {
    id: 'usa-porterie',
    name: 'PORT ERIE',
    flag: 'USA',
  },
  {
    id: 'usa-porthadlock',
    name: 'PORT HADLOCK',
    flag: 'USA',
  },
  {
    id: 'usa-portinland',
    name: 'PORT INLAND',
    flag: 'USA',
  },
  {
    id: 'usa-portwashington',
    name: 'PORT WASHINGTON',
    flag: 'USA',
  },
  {
    id: 'usa-poulsbo',
    name: 'POULSBO',
    flag: 'USA',
  },
  {
    id: 'usa-powhatanpoint',
    name: 'POWHATAN POINT',
    flag: 'USA',
  },
  {
    id: 'usa-putinbay',
    name: 'PUT IN BAY',
    flag: 'USA',
  },
  {
    id: 'usa-quincyil',
    name: 'QUINCY IL',
    flag: 'USA',
  },
  {
    id: 'usa-racine',
    name: 'RACINE',
    flag: 'USA',
  },
  {
    id: 'usa-rivermarshathyatt',
    name: 'RIVER MARSH AT HYATT',
    flag: 'USA',
  },
  {
    id: 'usa-riversideyachtclub',
    name: 'RIVERSIDE YACHT CLUB',
    flag: 'USA',
  },
  {
    id: 'usa-robinhoodmarine',
    name: 'ROBINHOOD MARINE',
    flag: 'USA',
  },
  {
    id: 'usa-rochester',
    name: 'ROCHESTER',
    flag: 'USA',
  },
  {
    id: 'usa-rockhall',
    name: 'ROCK HALL',
    flag: 'USA',
  },
  {
    id: 'usa-rosedale',
    name: 'ROSEDALE',
    flag: 'USA',
  },
  {
    id: 'usa-sadlerpoint',
    name: 'SADLER POINT',
    flag: 'USA',
  },
  {
    id: 'usa-saintegenevieve',
    name: 'SAINTE GENEVIEVE',
    flag: 'USA',
  },
  {
    id: 'usa-saintpaul',
    name: 'SAINT PAUL',
    flag: 'USA',
  },
  {
    id: 'usa-sandusky',
    name: 'SANDUSKY',
    flag: 'USA',
  },
  {
    id: 'usa-sandypoint',
    name: 'SANDY POINT',
    flag: 'USA',
  },
  {
    id: 'usa-seneca',
    name: 'SENECA',
    flag: 'USA',
  },
  {
    id: 'usa-sewickley',
    name: 'SEWICKLEY',
    flag: 'USA',
  },
  {
    id: 'usa-shawisland',
    name: 'SHAW ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-silvergrove',
    name: 'SILVER GROVE',
    flag: 'USA',
  },
  {
    id: 'usa-smithcove',
    name: 'SMITH COVE',
    flag: 'USA',
  },
  {
    id: 'usa-southhaven',
    name: 'SOUTH HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-stcharlesclub',
    name: 'ST CHARLES CLUB',
    flag: 'USA',
  },
  {
    id: 'usa-stignace',
    name: 'ST IGNACE',
    flag: 'USA',
  },
  {
    id: 'usa-stjoseph',
    name: 'ST JOSEPH',
    flag: 'USA',
  },
  {
    id: 'usa-stoneport',
    name: 'STONEPORT',
    flag: 'USA',
  },
  {
    id: 'usa-stuartfl',
    name: 'STUART FL',
    flag: 'USA',
  },
  {
    id: 'usa-sturgeonbay',
    name: 'STURGEON BAY',
    flag: 'USA',
  },
  {
    id: 'usa-suciaisland',
    name: 'SUCIA ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-sunshine',
    name: 'SUNSHINE',
    flag: 'USA',
  },
  {
    id: 'usa-thomaston',
    name: 'THOMASTON',
    flag: 'USA',
  },
  {
    id: 'usa-titusville',
    name: 'TITUSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-tricfield',
    name: 'TRICFIELD',
    flag: 'USA',
  },
  {
    id: 'usa-vicksburg',
    name: 'VICKSBURG',
    flag: 'USA',
  },
  {
    id: 'usa-victoria',
    name: 'VICTORIA',
    flag: 'USA',
  },
  {
    id: 'usa-weirton',
    name: 'WEIRTON',
    flag: 'USA',
  },
  {
    id: 'usa-winona',
    name: 'WINONA',
    flag: 'USA',
  },
  {
    id: 'usa-yankeetown',
    name: 'YANKEETOWN',
    flag: 'USA',
  },
  {
    id: 'usa-yarmouth',
    name: 'YARMOUTH',
    flag: 'USA',
  },
  {
    id: 'usa-yonkers',
    name: 'YONKERS',
    flag: 'USA',
  },
  {
    id: 'usa-yorkriverhaven',
    name: 'YORK RIVER HAVEN',
    flag: 'USA',
  },
  {
    id: 'vct-mustique',
    name: 'MUSTIQUE',
    flag: 'VCT',
  },
  {
    id: 'vgb-parhamtown',
    name: 'PARHAM TOWN',
    flag: 'VGB',
  },
  {
    id: 'vnm-camaufishingport',
    name: 'CA MAU FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'abw-aruba',
    name: 'ARUBA',
    flag: 'ABW',
  },
  {
    id: 'abw-oranjestad',
    name: 'ORANJESTAD',
    flag: 'ABW',
  },
  {
    id: 'abw-sannicolas',
    name: 'SAN NICOLAS',
    flag: 'ABW',
  },
  {
    id: 'ago-block14',
    name: 'BLOCK 14',
    flag: 'AGO',
  },
  {
    id: 'ago-block15',
    name: 'BLOCK 15',
    flag: 'AGO',
  },
  {
    id: 'ago-cabinda',
    name: 'CABINDA',
    flag: 'AGO',
  },
  {
    id: 'ago-clovangola',
    name: 'CLOV ANGOLA',
    flag: 'AGO',
  },
  {
    id: 'ago-daliaangola',
    name: 'DALIA ANGOLA',
    flag: 'AGO',
  },
  {
    id: 'ago-dande',
    name: 'DANDE',
    flag: 'AGO',
  },
  {
    id: 'ago-ensco109',
    name: 'ENSCO 109',
    flag: 'AGO',
  },
  {
    id: 'ago-gimboa',
    name: 'GIMBOA',
    flag: 'AGO',
  },
  {
    id: 'ago-greaterplutonio',
    name: 'GREATER PLUTONIO',
    flag: 'AGO',
  },
  {
    id: 'ago-kuitooilfield',
    name: 'KUITO OIL FIELD',
    flag: 'AGO',
  },
  {
    id: 'ago-mafumeirafield',
    name: 'MAFUMEIRA FIELD',
    flag: 'AGO',
  },
  {
    id: 'ago-malongo',
    name: 'MALONGO',
    flag: 'AGO',
  },
  {
    id: 'ago-malongooffshore',
    name: 'MALONGO OFFSHORE',
    flag: 'AGO',
  },
  {
    id: 'ago-olympianch',
    name: 'OLYMPI ANCH',
    flag: 'AGO',
  },
  {
    id: 'ago-palancaterminal',
    name: 'PALANCA TERMINAL',
    flag: 'AGO',
  },
  {
    id: 'ago-pazflorangola',
    name: 'PAZFLOR ANGOLA',
    flag: 'AGO',
  },
  {
    id: 'ago-portoamboim',
    name: 'PORTO AMBOIM',
    flag: 'AGO',
  },
  {
    id: 'ago-portodoambriz',
    name: 'PORTO DO AMBRIZ',
    flag: 'AGO',
  },
  {
    id: 'ago-sanhafpso',
    name: 'SANHA FPSO',
    flag: 'AGO',
  },
  {
    id: 'ago-westtucana',
    name: 'WEST TUCANA',
    flag: 'AGO',
  },
  {
    id: 'aia-dogisland',
    name: 'DOG ISLAND',
    flag: 'AIA',
  },
  {
    id: 'aia-longbayvillage',
    name: 'LONG BAY VILLAGE',
    flag: 'AIA',
  },
  {
    id: 'aia-prickleypearcays',
    name: 'PRICKLEY PEAR CAYS',
    flag: 'AIA',
  },
  {
    id: 'aia-sandygroundvillage',
    name: 'SANDY GROUND VILLAGE',
    flag: 'AIA',
  },
  {
    id: 'aia-scrubisland',
    name: 'SCRUB ISLAND',
    flag: 'AIA',
  },
  {
    id: 'aia-thevalley',
    name: 'THE VALLEY',
    flag: 'AIA',
  },
  {
    id: 'aia-westendvillage',
    name: 'WEST END VILLAGE',
    flag: 'AIA',
  },
  {
    id: 'ala-lumparland',
    name: 'LUMPARLAND',
    flag: 'ALA',
  },
  {
    id: 'alb-durres',
    name: 'DURRES',
    flag: 'ALB',
  },
  {
    id: 'alb-portoromano',
    name: 'PORTO ROMANO',
    flag: 'ALB',
  },
  {
    id: 'alb-sarande',
    name: 'SARANDE',
    flag: 'ALB',
  },
  {
    id: 'alb-shengjin',
    name: 'SHENGJIN',
    flag: 'ALB',
  },
  {
    id: 'alb-vlore',
    name: 'VLORE',
    flag: 'ALB',
  },
  {
    id: 'alb-vlores',
    name: 'VLORES',
    flag: 'ALB',
  },
  {
    id: 'are-abkfield',
    name: 'ABK FIELD',
    flag: 'ARE',
  },
  {
    id: 'are-abudhabi',
    name: 'ABU DHABI',
    flag: 'ARE',
  },
  {
    id: 'are-ajman',
    name: 'AJMAN',
    flag: 'ARE',
  },
  {
    id: 'are-alhamriya',
    name: 'ALHAMRIYA',
    flag: 'ARE',
  },
  {
    id: 'are-aljazirah',
    name: 'AL JAZIRAH',
    flag: 'ARE',
  },
  {
    id: 'are-almarmarisland',
    name: 'AL MARMAR ISLAND',
    flag: 'ARE',
  },
  {
    id: 'are-alraafah',
    name: 'AL RAAFAH',
    flag: 'ARE',
  },
  {
    id: 'are-alrafiq',
    name: 'AL RAFIQ',
    flag: 'ARE',
  },
  {
    id: 'are-alsadar',
    name: 'ALSADAR',
    flag: 'ARE',
  },
  {
    id: 'are-arzanahisland',
    name: 'ARZANAH ISLAND',
    flag: 'ARE',
  },
  {
    id: 'are-barakah',
    name: 'BARAKAH',
    flag: 'ARE',
  },
  {
    id: 'are-buhaseerfield',
    name: 'BU HASEER FIELD',
    flag: 'ARE',
  },
  {
    id: 'are-crescentmoonisland',
    name: 'CRESCENT MOON ISLAND',
    flag: 'ARE',
  },
  {
    id: 'are-dalmaisland',
    name: 'DALMA ISLAND',
    flag: 'ARE',
  },
  {
    id: 'are-dasisland',
    name: 'DAS ISLAND',
    flag: 'ARE',
  },
  {
    id: 'are-dubai',
    name: 'DUBAI',
    flag: 'ARE',
  },
  {
    id: 'are-fatair',
    name: 'FATAIR',
    flag: 'ARE',
  },
  {
    id: 'are-fatehfield',
    name: 'FATEH FIELD',
    flag: 'ARE',
  },
  {
    id: 'are-fujairah',
    name: 'FUJAIRAH',
    flag: 'ARE',
  },
  {
    id: 'are-hamriyahlpg',
    name: 'HAMRIYAH LPG',
    flag: 'ARE',
  },
  {
    id: 'are-jazeeratumqassar',
    name: 'JAZEERAT UM QASSAR',
    flag: 'ARE',
  },
  {
    id: 'are-jebelali',
    name: 'JEBEL ALI',
    flag: 'ARE',
  },
  {
    id: 'are-jebeldhanna',
    name: 'JEBEL DHANNA',
    flag: 'ARE',
  },
  {
    id: 'are-jumeirah',
    name: 'JUMEIRAH',
    flag: 'ARE',
  },
  {
    id: 'are-kalbaanchorage',
    name: 'KALBA ANCHORAGE',
    flag: 'ARE',
  },
  {
    id: 'are-khalifa',
    name: 'KHALIFA',
    flag: 'ARE',
  },
  {
    id: 'are-minasaqr',
    name: 'MINA SAQR',
    flag: 'ARE',
  },
  {
    id: 'are-mubarakfieid',
    name: 'MUBARAK FIEID',
    flag: 'ARE',
  },
  {
    id: 'are-mubarrazfield',
    name: 'MUBARRAZ FIELD',
    flag: 'ARE',
  },
  {
    id: 'are-mubarrazisland',
    name: 'MUBARRAZ ISLAND',
    flag: 'ARE',
  },
  {
    id: 'are-mugharragport',
    name: 'MUGHARRAG PORT',
    flag: 'ARE',
  },
  {
    id: 'are-musaffahanchorage',
    name: 'MUSAFFAH ANCHORAGE',
    flag: 'ARE',
  },
  {
    id: 'are-nasrfield',
    name: 'NASR FIELD',
    flag: 'ARE',
  },
  {
    id: 'are-portrashid',
    name: 'PORT RASHID',
    flag: 'ARE',
  },
  {
    id: 'are-rasal-khaimah',
    name: 'RAS AL-KHAIMAH',
    flag: 'ARE',
  },
  {
    id: 'are-rashidfield',
    name: 'RASHID FIELD',
    flag: 'ARE',
  },
  {
    id: 'are-ruwais',
    name: 'RUWAIS',
    flag: 'ARE',
  },
  {
    id: 'are-saadiyat',
    name: 'SAADIYAT',
    flag: 'ARE',
  },
  {
    id: 'are-salmanfield',
    name: 'SALMAN FIELD',
    flag: 'ARE',
  },
  {
    id: 'are-sharjahanchorage',
    name: 'SHARJAH ANCHORAGE',
    flag: 'ARE',
  },
  {
    id: 'are-sirabunuayr',
    name: 'SIR ABU NU AYR',
    flag: 'ARE',
  },
  {
    id: 'are-umaldalakh',
    name: 'UM AL DALAKH',
    flag: 'ARE',
  },
  {
    id: 'are-ummaldalkh',
    name: 'UMM ALDALKH',
    flag: 'ARE',
  },
  {
    id: 'are-ummalqaywayn',
    name: 'UMM AL QAYWAYN',
    flag: 'ARE',
  },
  {
    id: 'are-ummalquwain',
    name: 'UMM AL QUWAIN',
    flag: 'ARE',
  },
  {
    id: 'are-ummlulufield',
    name: 'UMM LULU FIELD',
    flag: 'ARE',
  },
  {
    id: 'are-ummshaif',
    name: 'UMM SHAIF',
    flag: 'ARE',
  },
  {
    id: 'are-ummshaiffield',
    name: 'UMM SHAIF FIELD',
    flag: 'ARE',
  },
  {
    id: 'are-ummsuqeimiii',
    name: 'UMM SUQEIM III',
    flag: 'ARE',
  },
  {
    id: 'are-yasmarina',
    name: 'YAS MARINA',
    flag: 'ARE',
  },
  {
    id: 'are-zakumfield',
    name: 'ZAKUM FIELD',
    flag: 'ARE',
  },
  {
    id: 'are-zirku',
    name: 'ZIRKU',
    flag: 'ARE',
  },
  {
    id: 'arg-arroyoseco',
    name: 'ARROYO SECO',
    flag: 'ARG',
  },
  {
    id: 'arg-atucha',
    name: 'ATUCHA',
    flag: 'ARG',
  },
  {
    id: 'arg-caletacordova',
    name: 'CALETA CORDOVA',
    flag: 'ARG',
  },
  {
    id: 'arg-caletaolivia',
    name: 'CALETA OLIVIA',
    flag: 'ARG',
  },
  {
    id: 'arg-caletapaula',
    name: 'CALETA PAULA',
    flag: 'ARG',
  },
  {
    id: 'arg-camarones',
    name: 'CAMARONES',
    flag: 'ARG',
  },
  {
    id: 'arg-comodororivadavia',
    name: 'COMODORO RIVADAVIA',
    flag: 'ARG',
  },
  {
    id: 'arg-concepciondeluruguay',
    name: 'CONCEPCION DEL URUGUAY',
    flag: 'ARG',
  },
  {
    id: 'arg-delguazu',
    name: 'DEL GUAZU',
    flag: 'ARG',
  },
  {
    id: 'arg-docksud',
    name: 'DOCK SUD',
    flag: 'ARG',
  },
  {
    id: 'arg-escobar',
    name: 'ESCOBAR',
    flag: 'ARG',
  },
  {
    id: 'arg-km171',
    name: 'KM 171',
    flag: 'ARG',
  },
  {
    id: 'arg-laplata',
    name: 'LA PLATA',
    flag: 'ARG',
  },
  {
    id: 'arg-necochea',
    name: 'NECOCHEA',
    flag: 'ARG',
  },
  {
    id: 'arg-puebloesther',
    name: 'PUEBLO ESTHER',
    flag: 'ARG',
  },
  {
    id: 'arg-puertobelgrano',
    name: 'PUERTO BELGRANO',
    flag: 'ARG',
  },
  {
    id: 'arg-puertodeseado',
    name: 'PUERTO DESEADO',
    flag: 'ARG',
  },
  {
    id: 'arg-puertoibicuy',
    name: 'PUERTO IBICUY',
    flag: 'ARG',
  },
  {
    id: 'arg-puertorawson',
    name: 'PUERTO RAWSON',
    flag: 'ARG',
  },
  {
    id: 'arg-puertorosales',
    name: 'PUERTO ROSALES',
    flag: 'ARG',
  },
  {
    id: 'arg-puntacolorada',
    name: 'PUNTA COLORADA',
    flag: 'ARG',
  },
  {
    id: 'arg-puntaquilla',
    name: 'PUNTA QUILLA',
    flag: 'ARG',
  },
  {
    id: 'arg-ramallo',
    name: 'RAMALLO',
    flag: 'ARG',
  },
  {
    id: 'arg-riotalabera',
    name: 'RIO TALABERA',
    flag: 'ARG',
  },
  {
    id: 'arg-rosario',
    name: 'ROSARIO',
    flag: 'ARG',
  },
  {
    id: 'arg-sanlorenzo',
    name: 'SAN LORENZO',
    flag: 'ARG',
  },
  {
    id: 'arg-sannicolas',
    name: 'SAN NICOLAS',
    flag: 'ARG',
  },
  {
    id: 'arg-sanpedro',
    name: 'SAN PEDRO',
    flag: 'ARG',
  },
  {
    id: 'arg-sansebastian',
    name: 'SAN SEBASTIAN',
    flag: 'ARG',
  },
  {
    id: 'arg-tigre',
    name: 'TIGRE',
    flag: 'ARG',
  },
  {
    id: 'arg-ushuaia',
    name: 'USHUAIA',
    flag: 'ARG',
  },
  {
    id: 'arg-villaconstitucion',
    name: 'VILLA CONSTITUCION',
    flag: 'ARG',
  },
  {
    id: 'arg-zarate',
    name: 'ZARATE',
    flag: 'ARG',
  },
  {
    id: 'ata-carlinibase',
    name: 'CARLINI BASE',
    flag: 'ATA',
  },
  {
    id: 'ata-palmerstation',
    name: 'PALMER STATION',
    flag: 'ATA',
  },
  {
    id: 'ata-portlockroy',
    name: 'PORT LOCKROY',
    flag: 'ATA',
  },
  {
    id: 'atg-barbuda',
    name: 'BARBUDA',
    flag: 'ATG',
  },
  {
    id: 'atg-bolands',
    name: 'BOLANDS',
    flag: 'ATG',
  },
  {
    id: 'atg-carlislebay',
    name: 'CARLISLE BAY',
    flag: 'ATG',
  },
  {
    id: 'atg-charles',
    name: 'CHARLES',
    flag: 'ATG',
  },
  {
    id: 'atg-codrington',
    name: 'CODRINGTON',
    flag: 'ATG',
  },
  {
    id: 'atg-dickensonbay',
    name: 'DICKENSON BAY',
    flag: 'ATG',
  },
  {
    id: 'atg-falmouth',
    name: 'FALMOUTH',
    flag: 'ATG',
  },
  {
    id: 'atg-fiveislandsvillage',
    name: 'FIVE ISLANDS VILLAGE',
    flag: 'ATG',
  },
  {
    id: 'atg-longisland',
    name: 'LONG ISLAND',
    flag: 'ATG',
  },
  {
    id: 'atg-mamorabay',
    name: 'MAMORA BAY',
    flag: 'ATG',
  },
  {
    id: 'atg-nonsuchbay',
    name: 'NONSUCH BAY',
    flag: 'ATG',
  },
  {
    id: 'atg-stjohns',
    name: 'ST JOHNS',
    flag: 'ATG',
  },
  {
    id: 'aus-abbotpoint',
    name: 'ABBOT POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-adelaide',
    name: 'ADELAIDE',
    flag: 'AUS',
  },
  {
    id: 'aus-airliebeach',
    name: 'AIRLIE BEACH',
    flag: 'AUS',
  },
  {
    id: 'aus-albany',
    name: 'ALBANY',
    flag: 'AUS',
  },
  {
    id: 'aus-apollobay',
    name: 'APOLLO BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-arcadiavale',
    name: 'ARCADIA VALE',
    flag: 'AUS',
  },
  {
    id: 'aus-ardrossan',
    name: 'ARDROSSAN',
    flag: 'AUS',
  },
  {
    id: 'aus-ascot',
    name: 'ASCOT',
    flag: 'AUS',
  },
  {
    id: 'aus-ashburton',
    name: 'ASHBURTON',
    flag: 'AUS',
  },
  {
    id: 'aus-aubne',
    name: 'AU BNE',
    flag: 'AUS',
  },
  {
    id: 'aus-audrw',
    name: 'AU DRW',
    flag: 'AUS',
  },
  {
    id: 'aus-aumky',
    name: 'AU MKY',
    flag: 'AUS',
  },
  {
    id: 'aus-auntl',
    name: 'AU NTL',
    flag: 'AUS',
  },
  {
    id: 'aus-axas',
    name: 'AXAS',
    flag: 'AUS',
  },
  {
    id: 'aus-baitreef',
    name: 'BAIT REEF',
    flag: 'AUS',
  },
  {
    id: 'aus-ballina',
    name: 'BALLINA',
    flag: 'AUS',
  },
  {
    id: 'aus-balmoral',
    name: 'BALMORAL',
    flag: 'AUS',
  },
  {
    id: 'aus-barrowisland',
    name: 'BARROW ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-batemansbay',
    name: 'BATEMANS BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-bde',
    name: 'B DE',
    flag: 'AUS',
  },
  {
    id: 'aus-bdong',
    name: 'B DONG',
    flag: 'AUS',
  },
  {
    id: 'aus-beiro',
    name: 'BEIRO',
    flag: 'AUS',
  },
  {
    id: 'aus-bermagui',
    name: 'BERMAGUI',
    flag: 'AUS',
  },
  {
    id: 'aus-bg',
    name: 'BG',
    flag: 'AUS',
  },
  {
    id: 'aus-binalongbay',
    name: 'BINALONG BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-bingbong',
    name: 'BINGBONG',
    flag: 'AUS',
  },
  {
    id: 'aus-blackislandreef',
    name: 'BLACK ISLAND REEF',
    flag: 'AUS',
  },
  {
    id: 'aus-blakehurst',
    name: 'BLAKEHURST',
    flag: 'AUS',
  },
  {
    id: 'aus-bongaree',
    name: 'BONGAREE',
    flag: 'AUS',
  },
  {
    id: 'aus-borderisland',
    name: 'BORDER ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-botanybay',
    name: 'BOTANY BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-bowen',
    name: 'BOWEN',
    flag: 'AUS',
  },
  {
    id: 'aus-brighton',
    name: 'BRIGHTON',
    flag: 'AUS',
  },
  {
    id: 'aus-brisbane',
    name: 'BRISBANE',
    flag: 'AUS',
  },
  {
    id: 'aus-broome',
    name: 'BROOME',
    flag: 'AUS',
  },
  {
    id: 'aus-bulwer',
    name: 'BULWER',
    flag: 'AUS',
  },
  {
    id: 'aus-bunbury',
    name: 'BUNBURY',
    flag: 'AUS',
  },
  {
    id: 'aus-bundaberg',
    name: 'BUNDABERG',
    flag: 'AUS',
  },
  {
    id: 'aus-bundeena',
    name: 'BUNDEENA',
    flag: 'AUS',
  },
  {
    id: 'aus-burnie',
    name: 'BURNIE',
    flag: 'AUS',
  },
  {
    id: 'aus-byronbay',
    name: 'BYRON BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-c51',
    name: 'C51',
    flag: 'AUS',
  },
  {
    id: 'aus-cairns',
    name: 'CAIRNS',
    flag: 'AUS',
  },
  {
    id: 'aus-cannonhill',
    name: 'CANNON HILL',
    flag: 'AUS',
  },
  {
    id: 'aus-capecuvier',
    name: 'CAPE CUVIER',
    flag: 'AUS',
  },
  {
    id: 'aus-capeflatteryharbor',
    name: 'CAPE FLATTERY HARBOR',
    flag: 'AUS',
  },
  {
    id: 'aus-capepreston',
    name: 'CAPE PRESTON',
    flag: 'AUS',
  },
  {
    id: 'aus-capewoolamai',
    name: 'CAPE WOOLAMAI',
    flag: 'AUS',
  },
  {
    id: 'aus-carlisleisland',
    name: 'CARLISLE ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-carnarvon',
    name: 'CARNARVON',
    flag: 'AUS',
  },
  {
    id: 'aus-churchpoint',
    name: 'CHURCH POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-cleveland',
    name: 'CLEVELAND',
    flag: 'AUS',
  },
  {
    id: 'aus-cockatooisland',
    name: 'COCKATOO ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-coffsharbour',
    name: 'COFFS HARBOUR',
    flag: 'AUS',
  },
  {
    id: 'aus-colesbay',
    name: 'COLES BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-coogee',
    name: 'COOGEE',
    flag: 'AUS',
  },
  {
    id: 'aus-cooktown',
    name: 'COOKTOWN',
    flag: 'AUS',
  },
  {
    id: 'aus-corlette',
    name: 'CORLETTE',
    flag: 'AUS',
  },
  {
    id: 'aus-cowancreek',
    name: 'COWAN CREEK',
    flag: 'AUS',
  },
  {
    id: 'aus-crawley',
    name: 'CRAWLEY',
    flag: 'AUS',
  },
  {
    id: 'aus-cronulla',
    name: 'CRONULLA',
    flag: 'AUS',
  },
  {
    id: 'aus-curlewisland',
    name: 'CURLEW ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-dampier',
    name: 'DAMPIER',
    flag: 'AUS',
  },
  {
    id: 'aus-dao',
    name: 'DAO',
    flag: 'AUS',
  },
  {
    id: 'aus-darwin',
    name: 'DARWIN',
    flag: 'AUS',
  },
  {
    id: 'aus-deepholebay',
    name: 'DEEPHOLE BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-denham',
    name: 'DENHAM',
    flag: 'AUS',
  },
  {
    id: 'aus-devonport',
    name: 'DEVONPORT',
    flag: 'AUS',
  },
  {
    id: 'aus-dover',
    name: 'DOVER',
    flag: 'AUS',
  },
  {
    id: 'aus-dunalley',
    name: 'DUNALLEY',
    flag: 'AUS',
  },
  {
    id: 'aus-dunk',
    name: 'DUNK',
    flag: 'AUS',
  },
  {
    id: 'aus-dunsborough',
    name: 'DUNSBOROUGH',
    flag: 'AUS',
  },
  {
    id: 'aus-eden',
    name: 'EDEN',
    flag: 'AUS',
  },
  {
    id: 'aus-esperance',
    name: 'ESPERANCE',
    flag: 'AUS',
  },
  {
    id: 'aus-esperanceaus',
    name: 'ESPERANCE AUS',
    flag: 'AUS',
  },
  {
    id: 'aus-exmouth',
    name: 'EXMOUTH',
    flag: 'AUS',
  },
  {
    id: 'aus-fanniebay',
    name: 'FANNIE BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-fantomeislandreef',
    name: 'FANTOME ISLAND REEF',
    flag: 'AUS',
  },
  {
    id: 'aus-fitzroyisland',
    name: 'FITZROY ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-fitzroyreef',
    name: 'FITZROY REEF',
    flag: 'AUS',
  },
  {
    id: 'aus-forster',
    name: 'FORSTER',
    flag: 'AUS',
  },
  {
    id: 'aus-fremantle',
    name: 'FREMANTLE',
    flag: 'AUS',
  },
  {
    id: 'aus-funnelbay',
    name: 'FUNNEL BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-geelong',
    name: 'GEELONG',
    flag: 'AUS',
  },
  {
    id: 'aus-geraldton',
    name: 'GERALDTON',
    flag: 'AUS',
  },
  {
    id: 'aus-gladstone',
    name: 'GLADSTONE',
    flag: 'AUS',
  },
  {
    id: 'aus-glenelg',
    name: 'GLENELG',
    flag: 'AUS',
  },
  {
    id: 'aus-gloucesterisland',
    name: 'GLOUCESTER ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-gloucesterpassage',
    name: 'GLOUCESTER PASSAGE',
    flag: 'AUS',
  },
  {
    id: 'aus-gorgonfield',
    name: 'GORGON FIELD',
    flag: 'AUS',
  },
  {
    id: 'aus-gove',
    name: 'GOVE',
    flag: 'AUS',
  },
  {
    id: 'aus-greatkeppelisland',
    name: 'GREAT KEPPEL ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-greenisland',
    name: 'GREEN ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-hamiltonisland',
    name: 'HAMILTON ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-hampton',
    name: 'HAMPTON',
    flag: 'AUS',
  },
  {
    id: 'aus-hardysbay',
    name: 'HARDYS BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-haslewoodisland',
    name: 'HASLEWOOD ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-hawksnest',
    name: 'HAWKS NEST',
    flag: 'AUS',
  },
  {
    id: 'aus-haymanisland',
    name: 'HAYMAN ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-haypoint',
    name: 'HAY POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-hexhamisland',
    name: 'HEXHAM ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-hillarys',
    name: 'HILLARYS',
    flag: 'AUS',
  },
  {
    id: 'aus-hobart',
    name: 'HOBART',
    flag: 'AUS',
  },
  {
    id: 'aus-hookisland',
    name: 'HOOK ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-hopeisland',
    name: 'HOPE ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-hopeislandsreef',
    name: 'HOPE ISLANDS REEF',
    flag: 'AUS',
  },
  {
    id: 'aus-hummockyisland',
    name: 'HUMMOCKY ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-hunterisland',
    name: 'HUNTER ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-huskisson',
    name: 'HUSKISSON',
    flag: 'AUS',
  },
  {
    id: 'aus-ichthysfield',
    name: 'ICHTHYS FIELD',
    flag: 'AUS',
  },
  {
    id: 'aus-iluka',
    name: 'ILUKA',
    flag: 'AUS',
  },
  {
    id: 'aus-ingotislets',
    name: 'INGOT ISLETS',
    flag: 'AUS',
  },
  {
    id: 'aus-inskippoint',
    name: 'INSKIP POINT',
    flag: 'AUS',
  },
  {
    id: 'aus-jacobswell',
    name: 'JACOBS WELL',
    flag: 'AUS',
  },
  {
    id: 'aus-jervisbay',
    name: 'JERVIS BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-jurienbay',
    name: 'JURIEN BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-karumba',
    name: 'KARUMBA',
    flag: 'AUS',
  },
  {
    id: 'aus-kingisland',
    name: 'KING ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-kooringal',
    name: 'KOORINGAL',
    flag: 'AUS',
  },
  {
    id: 'aus-kwinana',
    name: 'KWINANA',
    flag: 'AUS',
  },
  {
    id: 'aus-ladybarron',
    name: 'LADY BARRON',
    flag: 'AUS',
  },
  {
    id: 'aus-ladyelliotreef',
    name: 'LADY ELLIOT REEF',
    flag: 'AUS',
  },
  {
    id: 'aus-ladymusgravereef',
    name: 'LADY MUSGRAVE REEF',
    flag: 'AUS',
  },
  {
    id: 'aus-lakesentrance',
    name: 'LAKES ENTRANCE',
    flag: 'AUS',
  },
  {
    id: 'aus-langford-birdisland',
    name: 'LANGFORD-BIRD ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-larrakeyah',
    name: 'LARRAKEYAH',
    flag: 'AUS',
  },
  {
    id: 'aus-launceston',
    name: 'LAUNCESTON',
    flag: 'AUS',
  },
  {
    id: 'aus-lindemanisland',
    name: 'LINDEMAN ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-littletaylorbay',
    name: 'LITTLE TAYLOR BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-lizardisland',
    name: 'LIZARD ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-longislandreef',
    name: 'LONG ISLAND REEF',
    flag: 'AUS',
  },
  {
    id: 'aus-lowisles',
    name: 'LOW ISLES',
    flag: 'AUS',
  },
  {
    id: 'aus-lucinda',
    name: 'LUCINDA',
    flag: 'AUS',
  },
  {
    id: 'aus-mackay',
    name: 'MACKAY',
    flag: 'AUS',
  },
  {
    id: 'aus-magneticisland',
    name: 'MAGNETIC ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-mandurah',
    name: 'MANDURAH',
    flag: 'AUS',
  },
  {
    id: 'aus-manly',
    name: 'MANLY',
    flag: 'AUS',
  },
  {
    id: 'aus-margate',
    name: 'MARGATE',
    flag: 'AUS',
  },
  {
    id: 'aus-mariaisland',
    name: 'MARIA ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-mastheadisland',
    name: 'MAST HEAD ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-mayfield',
    name: 'MAYFIELD',
    flag: 'AUS',
  },
  {
    id: 'aus-melbourne',
    name: 'MELBOURNE',
    flag: 'AUS',
  },
  {
    id: 'aus-metung',
    name: 'METUNG',
    flag: 'AUS',
  },
  {
    id: 'aus-michaelmasreef',
    name: 'MICHAELMAS REEF',
    flag: 'AUS',
  },
  {
    id: 'aus-milnerbay',
    name: 'MILNER BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-mindarie',
    name: 'MINDARIE',
    flag: 'AUS',
  },
  {
    id: 'aus-mooloolaba',
    name: 'MOOLOOLABA',
    flag: 'AUS',
  },
  {
    id: 'aus-moretonisland',
    name: 'MORETON ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-morlayisland',
    name: 'MORLAY ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-mornington',
    name: 'MORNINGTON',
    flag: 'AUS',
  },
  {
    id: 'aus-mourilyanharbour',
    name: 'MOURILYAN HARBOUR',
    flag: 'AUS',
  },
  {
    id: 'aus-mudisland',
    name: 'MUD ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-nelsonbay',
    name: 'NELSON BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-newcastle',
    name: 'NEWCASTLE',
    flag: 'AUS',
  },
  {
    id: 'aus-northstradbrokeisland',
    name: 'NORTH STRADBROKE ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-northwestisland',
    name: 'NORTH WEST ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-nubeena',
    name: 'NUBEENA',
    flag: 'AUS',
  },
  {
    id: 'aus-oceanmonarch',
    name: 'OCEAN MONARCH',
    flag: 'AUS',
  },
  {
    id: 'aus-onslow',
    name: 'ONSLOW',
    flag: 'AUS',
  },
  {
    id: 'aus-opalreef',
    name: 'OPAL REEF',
    flag: 'AUS',
  },
  {
    id: 'aus-orpheusisland',
    name: 'ORPHEUS ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-outernewryisland',
    name: 'OUTER NEWRY ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-palmbeach',
    name: 'PALM BEACH',
    flag: 'AUS',
  },
  {
    id: 'aus-palmcove',
    name: 'PALM COVE',
    flag: 'AUS',
  },
  {
    id: 'aus-paynesville',
    name: 'PAYNESVILLE',
    flag: 'AUS',
  },
  {
    id: 'aus-peelisland',
    name: 'PEEL ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-pelsaertisland',
    name: 'PELSAERT ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-penneshaw',
    name: 'PENNESHAW',
    flag: 'AUS',
  },
  {
    id: 'aus-percygroup',
    name: 'PERCY GROUP',
    flag: 'AUS',
  },
  {
    id: 'aus-pointsamson',
    name: 'POINT SAMSON',
    flag: 'AUS',
  },
  {
    id: 'aus-portalma',
    name: 'PORT ALMA',
    flag: 'AUS',
  },
  {
    id: 'aus-portarthur',
    name: 'PORT ARTHUR',
    flag: 'AUS',
  },
  {
    id: 'aus-portbonython',
    name: 'PORT BONYTHON',
    flag: 'AUS',
  },
  {
    id: 'aus-portdalrymple',
    name: 'PORT DALRYMPLE',
    flag: 'AUS',
  },
  {
    id: 'aus-portdenison',
    name: 'PORT DENISON',
    flag: 'AUS',
  },
  {
    id: 'aus-portdouglas',
    name: 'PORT DOUGLAS',
    flag: 'AUS',
  },
  {
    id: 'aus-portfairy',
    name: 'PORT FAIRY',
    flag: 'AUS',
  },
  {
    id: 'aus-portgiles',
    name: 'PORT GILES',
    flag: 'AUS',
  },
  {
    id: 'aus-porthedland',
    name: 'PORT HEDLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-portkembla',
    name: 'PORT KEMBLA',
    flag: 'AUS',
  },
  {
    id: 'aus-portland',
    name: 'PORTLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-portlandroad',
    name: 'PORTLAND ROAD',
    flag: 'AUS',
  },
  {
    id: 'aus-portlatta',
    name: 'PORT LATTA',
    flag: 'AUS',
  },
  {
    id: 'aus-portlincolnsa',
    name: 'PORT LINCOLN SA',
    flag: 'AUS',
  },
  {
    id: 'aus-portmacquarie',
    name: 'PORT MACQUARIE',
    flag: 'AUS',
  },
  {
    id: 'aus-portpirie',
    name: 'PORT PIRIE',
    flag: 'AUS',
  },
  {
    id: 'aus-portwalcott',
    name: 'PORT WALCOTT',
    flag: 'AUS',
  },
  {
    id: 'aus-prosserbay',
    name: 'PROSSER BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-ptadelaide',
    name: 'PT ADELAIDE',
    flag: 'AUS',
  },
  {
    id: 'aus-pyreneesfield',
    name: 'PYRENEES FIELD',
    flag: 'AUS',
  },
  {
    id: 'aus-queenscliff',
    name: 'QUEENSCLIFF',
    flag: 'AUS',
  },
  {
    id: 'aus-robe',
    name: 'ROBE',
    flag: 'AUS',
  },
  {
    id: 'aus-rosslyn',
    name: 'ROSSLYN',
    flag: 'AUS',
  },
  {
    id: 'aus-rottnestisland',
    name: 'ROTTNEST ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-safetybeach',
    name: 'SAFETY BEACH',
    flag: 'AUS',
  },
  {
    id: 'aus-scarborough',
    name: 'SCARBOROUGH',
    flag: 'AUS',
  },
  {
    id: 'aus-scarness',
    name: 'SCARNESS',
    flag: 'AUS',
  },
  {
    id: 'aus-scawfellisland',
    name: 'SCAWFELL ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-schoutenisland',
    name: 'SCHOUTEN ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-shawisland',
    name: 'SHAW ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-shorncliffe',
    name: 'SHORNCLIFFE',
    flag: 'AUS',
  },
  {
    id: 'aus-shuteharbor',
    name: 'SHUTE HARBOR',
    flag: 'AUS',
  },
  {
    id: 'aus-skardonriver',
    name: 'SKARDON RIVER',
    flag: 'AUS',
  },
  {
    id: 'aus-sorrento',
    name: 'SORRENTO',
    flag: 'AUS',
  },
  {
    id: 'aus-southisland',
    name: 'SOUTH ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-southmolleisland',
    name: 'SOUTH MOLLE ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-southport',
    name: 'SOUTHPORT',
    flag: 'AUS',
  },
  {
    id: 'aus-stansbury',
    name: 'STANSBURY',
    flag: 'AUS',
  },
  {
    id: 'aus-stbeesisland',
    name: 'ST BEES ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-sthelenaisland',
    name: 'ST HELENA ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-sthelens',
    name: 'ST HELENS',
    flag: 'AUS',
  },
  {
    id: 'aus-strahan',
    name: 'STRAHAN',
    flag: 'AUS',
  },
  {
    id: 'aus-streakybay',
    name: 'STREAKY BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-swansea',
    name: 'SWANSEA',
    flag: 'AUS',
  },
  {
    id: 'aus-sydney',
    name: 'SYDNEY',
    flag: 'AUS',
  },
  {
    id: 'aus-taroona',
    name: 'TAROONA',
    flag: 'AUS',
  },
  {
    id: 'aus-thevenard',
    name: 'THEVENARD',
    flag: 'AUS',
  },
  {
    id: 'aus-thomasisland',
    name: 'THOMAS ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-thursdayisland',
    name: 'THURSDAY ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-tincanbay',
    name: 'TIN CAN BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-torresstraits',
    name: 'TORRES STRAITS',
    flag: 'AUS',
  },
  {
    id: 'aus-townsville',
    name: 'TOWNSVILLE',
    flag: 'AUS',
  },
  {
    id: 'aus-triabunna',
    name: 'TRIABUNNA',
    flag: 'AUS',
  },
  {
    id: 'aus-tweedheads',
    name: 'TWEED HEADS',
    flag: 'AUS',
  },
  {
    id: 'aus-tworocks',
    name: 'TWO ROCKS',
    flag: 'AUS',
  },
  {
    id: 'aus-ulladulla',
    name: 'ULLADULLA',
    flag: 'AUS',
  },
  {
    id: 'aus-uselessloop',
    name: 'USELESS LOOP',
    flag: 'AUS',
  },
  {
    id: 'aus-uwan',
    name: 'UWAN',
    flag: 'AUS',
  },
  {
    id: 'aus-varanus',
    name: 'VARANUS',
    flag: 'AUS',
  },
  {
    id: 'aus-veghel',
    name: 'VEGHEL',
    flag: 'AUS',
  },
  {
    id: 'aus-vincentia',
    name: 'VINCENTIA',
    flag: 'AUS',
  },
  {
    id: 'aus-wallaroo',
    name: 'WALLAROO',
    flag: 'AUS',
  },
  {
    id: 'aus-wandoo',
    name: 'WANDOO',
    flag: 'AUS',
  },
  {
    id: 'aus-weipa',
    name: 'WEIPA',
    flag: 'AUS',
  },
  {
    id: 'aus-welshpool',
    name: 'WELSHPOOL',
    flag: 'AUS',
  },
  {
    id: 'aus-werribeesouth',
    name: 'WERRIBEE SOUTH',
    flag: 'AUS',
  },
  {
    id: 'aus-westernport',
    name: 'WESTERNPORT',
    flag: 'AUS',
  },
  {
    id: 'aus-wheatstone',
    name: 'WHEATSTONE',
    flag: 'AUS',
  },
  {
    id: 'aus-whitsundayisland',
    name: 'WHITSUNDAY ISLAND',
    flag: 'AUS',
  },
  {
    id: 'aus-whyalla',
    name: 'WHYALLA',
    flag: 'AUS',
  },
  {
    id: 'aus-wistarireef',
    name: 'WISTARI REEF',
    flag: 'AUS',
  },
  {
    id: 'aus-wollongong',
    name: 'WOLLONGONG',
    flag: 'AUS',
  },
  {
    id: 'aus-woodwarkbay',
    name: 'WOODWARK BAY',
    flag: 'AUS',
  },
  {
    id: 'aus-wyndham',
    name: 'WYNDHAM',
    flag: 'AUS',
  },
  {
    id: 'aus-wynnum',
    name: 'WYNNUM',
    flag: 'AUS',
  },
  {
    id: 'aus-yorkeysknob',
    name: 'YORKEYS KNOB',
    flag: 'AUS',
  },
  {
    id: 'aut-steyregg',
    name: 'STEYREGG',
    flag: 'AUT',
  },
  {
    id: 'aut-vienna',
    name: 'VIENNA',
    flag: 'AUT',
  },
  {
    id: 'aze-alat',
    name: 'ALAT',
    flag: 'AZE',
  },
  {
    id: 'aze-baku',
    name: 'BAKU',
    flag: 'AZE',
  },
  {
    id: 'aze-baku-southbay',
    name: 'BAKU-SOUTH BAY',
    flag: 'AZE',
  },
  {
    id: 'aze-hovsan',
    name: 'HOVSAN',
    flag: 'AZE',
  },
  {
    id: 'bel-antwerp',
    name: 'ANTWERP',
    flag: 'BEL',
  },
  {
    id: 'bel-blankenberge',
    name: 'BLANKENBERGE',
    flag: 'BEL',
  },
  {
    id: 'bel-boom',
    name: 'BOOM',
    flag: 'BEL',
  },
  {
    id: 'bel-bruges',
    name: 'BRUGES',
    flag: 'BEL',
  },
  {
    id: 'bel-ghent',
    name: 'GHENT',
    flag: 'BEL',
  },
  {
    id: 'bel-herstal',
    name: 'HERSTAL',
    flag: 'BEL',
  },
  {
    id: 'bel-nieuwpoort',
    name: 'NIEUWPOORT',
    flag: 'BEL',
  },
  {
    id: 'bel-oostende',
    name: 'OOSTENDE',
    flag: 'BEL',
  },
  {
    id: 'bel-schoten',
    name: 'SCHOTEN',
    flag: 'BEL',
  },
  {
    id: 'bel-sintlenaarts',
    name: 'SINT LENAARTS',
    flag: 'BEL',
  },
  {
    id: 'bel-tessenderlo',
    name: 'TESSENDERLO',
    flag: 'BEL',
  },
  {
    id: 'bel-wevelgem',
    name: 'WEVELGEM',
    flag: 'BEL',
  },
  {
    id: 'bel-zeebrugge',
    name: 'ZEEBRUGGE',
    flag: 'BEL',
  },
  {
    id: 'bel-zelzate',
    name: 'ZELZATE',
    flag: 'BEL',
  },
  {
    id: 'bes-gotooilterminal',
    name: 'GOTO OIL TERMINAL',
    flag: 'BES',
  },
  {
    id: 'bes-kralendijk',
    name: 'KRALENDIJK',
    flag: 'BES',
  },
  {
    id: 'bes-saba',
    name: 'SABA',
    flag: 'BES',
  },
  {
    id: 'bes-sinteustatius',
    name: 'SINT EUSTATIUS',
    flag: 'BES',
  },
  {
    id: 'bgd-mongla',
    name: 'MONGLA',
    flag: 'BGD',
  },
  {
    id: 'bgd-monglaanchorage',
    name: 'MONGLA ANCHORAGE',
    flag: 'BGD',
  },
  {
    id: 'bgr-balchik',
    name: 'BALCHIK',
    flag: 'BGR',
  },
  {
    id: 'bgr-burgas',
    name: 'BURGAS',
    flag: 'BGR',
  },
  {
    id: 'bgr-ezerovo',
    name: 'EZEROVO',
    flag: 'BGR',
  },
  {
    id: 'bgr-kavarnaanchorage',
    name: 'KAVARNA ANCHORAGE',
    flag: 'BGR',
  },
  {
    id: 'bgr-nesebar',
    name: 'NESEBAR',
    flag: 'BGR',
  },
  {
    id: 'bgr-oryahovo',
    name: 'ORYAHOVO',
    flag: 'BGR',
  },
  {
    id: 'bgr-povelyanovo',
    name: 'POVELYANOVO',
    flag: 'BGR',
  },
  {
    id: 'bgr-sozopol',
    name: 'SOZOPOL',
    flag: 'BGR',
  },
  {
    id: 'bgr-svetivlas',
    name: 'SVETI VLAS',
    flag: 'BGR',
  },
  {
    id: 'bgr-varna',
    name: 'VARNA',
    flag: 'BGR',
  },
  {
    id: 'bhr-askar',
    name: 'ASKAR',
    flag: 'BHR',
  },
  {
    id: 'bhr-diyaralmuharraq',
    name: 'DIYAR AL MUHARRAQ',
    flag: 'BHR',
  },
  {
    id: 'bhr-galali',
    name: 'GALALI',
    flag: 'BHR',
  },
  {
    id: 'bhr-hidd',
    name: 'HIDD',
    flag: 'BHR',
  },
  {
    id: 'bhr-khalifabinsalman',
    name: 'KHALIFA BIN SALMAN',
    flag: 'BHR',
  },
  {
    id: 'bhr-manama',
    name: 'MANAMA',
    flag: 'BHR',
  },
  {
    id: 'bhr-minasalman',
    name: 'MINA SALMAN',
    flag: 'BHR',
  },
  {
    id: 'bhr-muharraq',
    name: 'MUHARRAQ',
    flag: 'BHR',
  },
  {
    id: 'bhr-nuranaisland',
    name: 'NURANA ISLAND',
    flag: 'BHR',
  },
  {
    id: 'bhr-sitrah',
    name: 'SITRAH',
    flag: 'BHR',
  },
  {
    id: 'bhs-adelaide',
    name: 'ADELAIDE',
    flag: 'BHS',
  },
  {
    id: 'bhs-adelaidevillage',
    name: 'ADELAIDE VILLAGE',
    flag: 'BHS',
  },
  {
    id: 'bhs-bakersbay',
    name: 'BAKERS BAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-bellscay',
    name: 'BELLS CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-blackpoint',
    name: 'BLACK POINT',
    flag: 'BHS',
  },
  {
    id: 'bhs-bullockharbour',
    name: 'BULLOCK HARBOUR',
    flag: 'BHS',
  },
  {
    id: 'bhs-chubcay',
    name: 'CHUB CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-cliftonbay',
    name: 'CLIFTON BAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-compasscay',
    name: 'COMPASS CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-crabcay',
    name: 'CRAB CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-dunmoretown',
    name: 'DUNMORE TOWN',
    flag: 'BHS',
  },
  {
    id: 'bhs-elbowcay',
    name: 'ELBOW CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-georgetown',
    name: 'GEORGE TOWN',
    flag: 'BHS',
  },
  {
    id: "bhs-governor'sharbour",
    name: "GOVERNOR'S HARBOUR",
    flag: 'BHS',
  },
  {
    id: 'bhs-greenturtlecay',
    name: 'GREEN TURTLE CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-guncay',
    name: 'GUN CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-harveyscay',
    name: 'HARVEYS CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-hawksbillcay',
    name: 'HAWKSBILL CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-highbornecay',
    name: 'HIGHBORNE CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-inaguaislands',
    name: 'INAGUA ISLANDS',
    flag: 'BHS',
  },
  {
    id: 'bhs-lucaya',
    name: 'LUCAYA',
    flag: 'BHS',
  },
  {
    id: 'bhs-lynyardcay',
    name: 'LYNYARD CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-manofwarcay',
    name: 'MAN OF WAR CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-marshharbour',
    name: 'MARSH HARBOUR',
    flag: 'BHS',
  },
  {
    id: 'bhs-nassau',
    name: 'NASSAU',
    flag: 'BHS',
  },
  {
    id: 'bhs-northcatcay',
    name: 'NORTH CAT CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-portroyal',
    name: 'PORT ROYAL',
    flag: 'BHS',
  },
  {
    id: 'bhs-roseisland',
    name: 'ROSE ISLAND',
    flag: 'BHS',
  },
  {
    id: 'bhs-rwcruiseport',
    name: 'RW CRUISE PORT',
    flag: 'BHS',
  },
  {
    id: 'bhs-shroudcay',
    name: 'SHROUD CAY',
    flag: 'BHS',
  },
  {
    id: 'bhs-spanishwells',
    name: 'SPANISH WELLS',
    flag: 'BHS',
  },
  {
    id: 'bhs-stanielcay',
    name: 'STANIEL CAY',
    flag: 'BHS',
  },
  {
    id: 'blm-ilefourchue',
    name: 'ILE FOURCHUE',
    flag: 'BLM',
  },
  {
    id: 'blz-belizecityanchorage',
    name: 'BELIZE CITY ANCHORAGE',
    flag: 'BLZ',
  },
  {
    id: 'bmu-hamilton',
    name: 'HAMILTON',
    flag: 'BMU',
  },
  {
    id: 'bmu-kingswharf',
    name: 'KINGS WHARF',
    flag: 'BMU',
  },
  {
    id: "bmu-stgeorge's",
    name: "ST GEORGE'S",
    flag: 'BMU',
  },
  {
    id: 'bra-antonina',
    name: 'ANTONINA',
    flag: 'BRA',
  },
  {
    id: 'bra-dtse/geguaoilterminal',
    name: 'DTSE / GEGUA OIL TERMINAL',
    flag: 'BRA',
  },
  {
    id: 'bra-itacoatiara',
    name: 'ITACOATIARA',
    flag: 'BRA',
  },
  {
    id: 'bra-jurongaracruz',
    name: 'JURONG ARACRUZ',
    flag: 'BRA',
  },
  {
    id: 'bra-juruti',
    name: 'JURUTI',
    flag: 'BRA',
  },
  {
    id: 'bra-madrededeus',
    name: 'MADRE DE DEUS',
    flag: 'BRA',
  },
  {
    id: 'bra-manaus',
    name: 'MANAUS',
    flag: 'BRA',
  },
  {
    id: 'bra-portoalegre',
    name: 'PORTO ALEGRE',
    flag: 'BRA',
  },
  {
    id: 'bra-santarem',
    name: 'SANTAREM',
    flag: 'BRA',
  },
  {
    id: 'bra-saolourencodosul',
    name: 'SAO LOURENCO DO SUL',
    flag: 'BRA',
  },
  {
    id: 'bra-trombetas',
    name: 'TROMBETAS',
    flag: 'BRA',
  },
  {
    id: 'brb-bridgetown',
    name: 'BRIDGETOWN',
    flag: 'BRB',
  },
  {
    id: 'brb-checkerhall',
    name: 'CHECKER HALL',
    flag: 'BRB',
  },
  {
    id: 'brb-speightstown',
    name: 'SPEIGHTSTOWN',
    flag: 'BRB',
  },
  {
    id: 'brn-championfield',
    name: 'CHAMPION FIELD',
    flag: 'BRN',
  },
  {
    id: 'brn-kualabelait',
    name: 'KUALA BELAIT',
    flag: 'BRN',
  },
  {
    id: 'brn-muara',
    name: 'MUARA',
    flag: 'BRN',
  },
  {
    id: 'brn-seria',
    name: 'SERIA',
    flag: 'BRN',
  },
  {
    id: 'brn-seriaoilterminal',
    name: 'SERIA OIL TERMINAL',
    flag: 'BRN',
  },
  {
    id: 'can-alertbay',
    name: 'ALERT BAY',
    flag: 'CAN',
  },
  {
    id: 'can-baddeck',
    name: 'BADDECK',
    flag: 'CAN',
  },
  {
    id: 'can-baiecomeau',
    name: 'BAIE COMEAU',
    flag: 'CAN',
  },
  {
    id: 'can-ballantynescove',
    name: 'BALLANTYNES COVE',
    flag: 'CAN',
  },
  {
    id: 'can-baydeverde',
    name: 'BAY DE VERDE',
    flag: 'CAN',
  },
  {
    id: 'can-bayroberts',
    name: 'BAY ROBERTS',
    flag: 'CAN',
  },
  {
    id: 'can-becancour',
    name: 'BECANCOUR',
    flag: 'CAN',
  },
  {
    id: 'can-bedwellharbour',
    name: 'BEDWELL HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-bellabella',
    name: 'BELLA BELLA',
    flag: 'CAN',
  },
  {
    id: 'can-belledune',
    name: 'BELLEDUNE',
    flag: 'CAN',
  },
  {
    id: 'can-blacksharbour',
    name: 'BLACKS HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-brentwoodbay',
    name: 'BRENTWOOD BAY',
    flag: 'CAN',
  },
  {
    id: 'can-buccaneerbay',
    name: 'BUCCANEER BAY',
    flag: 'CAN',
  },
  {
    id: 'can-burgeo',
    name: 'BURGEO',
    flag: 'CAN',
  },
  {
    id: 'can-cacouna',
    name: 'CACOUNA',
    flag: 'CAN',
  },
  {
    id: 'can-cadborobay',
    name: 'CADBORO BAY',
    flag: 'CAN',
  },
  {
    id: 'can-cambridgebay',
    name: 'CAMBRIDGE BAY',
    flag: 'CAN',
  },
  {
    id: 'can-campbellriver',
    name: 'CAMPBELL RIVER',
    flag: 'CAN',
  },
  {
    id: 'can-caraquet',
    name: 'CARAQUET',
    flag: 'CAN',
  },
  {
    id: 'can-cashelcove',
    name: 'CASHEL COVE',
    flag: 'CAN',
  },
  {
    id: 'can-charlottetown',
    name: 'CHARLOTTETOWN',
    flag: 'CAN',
  },
  {
    id: 'can-chemainus',
    name: 'CHEMAINUS',
    flag: 'CAN',
  },
  {
    id: 'can-churchill',
    name: 'CHURCHILL',
    flag: 'CAN',
  },
  {
    id: 'can-clarksharbour',
    name: 'CLARKS HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-clarkson',
    name: 'CLARKSON',
    flag: 'CAN',
  },
  {
    id: 'can-comebychance',
    name: 'COME BY CHANCE',
    flag: 'CAN',
  },
  {
    id: 'can-comox',
    name: 'COMOX',
    flag: 'CAN',
  },
  {
    id: 'can-conceptionbaysouth',
    name: 'CONCEPTION BAY SOUTH',
    flag: 'CAN',
  },
  {
    id: 'can-cornerbrook',
    name: 'CORNER BROOK',
    flag: 'CAN',
  },
  {
    id: 'can-cornwall',
    name: 'CORNWALL',
    flag: 'CAN',
  },
  {
    id: 'can-cowichanbay',
    name: 'COWICHAN BAY',
    flag: 'CAN',
  },
  {
    id: 'can-dalhousie',
    name: 'DALHOUSIE',
    flag: 'CAN',
  },
  {
    id: 'can-deceptionbay',
    name: 'DECEPTION BAY',
    flag: 'CAN',
  },
  {
    id: 'can-digby',
    name: 'DIGBY',
    flag: 'CAN',
  },
  {
    id: 'can-esquimalt',
    name: 'ESQUIMALT',
    flag: 'CAN',
  },
  {
    id: 'can-frasierriver',
    name: 'FRASIER RIVER',
    flag: 'CAN',
  },
  {
    id: 'can-ganges',
    name: 'GANGES',
    flag: 'CAN',
  },
  {
    id: 'can-gaspe',
    name: 'GASPE',
    flag: 'CAN',
  },
  {
    id: 'can-gibsons',
    name: 'GIBSONS',
    flag: 'CAN',
  },
  {
    id: 'can-goosebay',
    name: 'GOOSE BAY',
    flag: 'CAN',
  },
  {
    id: 'can-gorgehabour',
    name: 'GORGE HABOUR',
    flag: 'CAN',
  },
  {
    id: 'can-grandeanse',
    name: 'GRANDE ANSE',
    flag: 'CAN',
  },
  {
    id: 'can-halifax',
    name: 'HALIFAX',
    flag: 'CAN',
  },
  {
    id: 'can-hamilton',
    name: 'HAMILTON',
    flag: 'CAN',
  },
  {
    id: 'can-havrestpierre',
    name: 'HAVRE ST PIERRE',
    flag: 'CAN',
  },
  {
    id: 'can-iqaluit',
    name: 'IQALUIT',
    flag: 'CAN',
  },
  {
    id: 'can-kitimat',
    name: 'KITIMAT',
    flag: 'CAN',
  },
  {
    id: 'can-labaie(portalfred)',
    name: 'LA BAIE (PORT ALFRED)',
    flag: 'CAN',
  },
  {
    id: 'can-ladysmith',
    name: 'LADYSMITH',
    flag: 'CAN',
  },
  {
    id: 'can-lesmechins',
    name: 'LES MECHINS',
    flag: 'CAN',
  },
  {
    id: 'can-lewisporte',
    name: 'LEWISPORTE',
    flag: 'CAN',
  },
  {
    id: 'can-longpond',
    name: 'LONG POND',
    flag: 'CAN',
  },
  {
    id: 'can-louisburg',
    name: 'LOUISBURG',
    flag: 'CAN',
  },
  {
    id: 'can-lunenburg',
    name: 'LUNENBURG',
    flag: 'CAN',
  },
  {
    id: 'can-makkovik',
    name: 'MAKKOVIK',
    flag: 'CAN',
  },
  {
    id: 'can-masset',
    name: 'MASSET',
    flag: 'CAN',
  },
  {
    id: 'can-matane',
    name: 'MATANE',
    flag: 'CAN',
  },
  {
    id: 'can-meteghan',
    name: 'METEGHAN',
    flag: 'CAN',
  },
  {
    id: 'can-midland',
    name: 'MIDLAND',
    flag: 'CAN',
  },
  {
    id: 'can-montagueharbour',
    name: 'MONTAGUE HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-montreal',
    name: 'MONTREAL',
    flag: 'CAN',
  },
  {
    id: 'can-nanaimo',
    name: 'NANAIMO',
    flag: 'CAN',
  },
  {
    id: 'can-nanooseharbor',
    name: 'NANOOSE HARBOR',
    flag: 'CAN',
  },
  {
    id: 'can-northarm',
    name: 'NORTH ARM',
    flag: 'CAN',
  },
  {
    id: 'can-northsydney',
    name: 'NORTH SYDNEY',
    flag: 'CAN',
  },
  {
    id: 'can-patriciabay',
    name: 'PATRICIA BAY',
    flag: 'CAN',
  },
  {
    id: 'can-penderharbour',
    name: 'PENDER HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-pinkneyspoint',
    name: 'PINKNEYS POINT',
    flag: 'CAN',
  },
  {
    id: 'can-pointtupper',
    name: 'POINT TUPPER',
    flag: 'CAN',
  },
  {
    id: 'can-portalberni',
    name: 'PORT ALBERNI',
    flag: 'CAN',
  },
  {
    id: 'can-portauxbasques',
    name: 'PORT AUX BASQUES',
    flag: 'CAN',
  },
  {
    id: 'can-portcartier',
    name: 'PORT CARTIER',
    flag: 'CAN',
  },
  {
    id: 'can-portcolborne',
    name: 'PORT COLBORNE',
    flag: 'CAN',
  },
  {
    id: 'can-portdalhousie',
    name: 'PORT DALHOUSIE',
    flag: 'CAN',
  },
  {
    id: 'can-portedward',
    name: 'PORT EDWARD',
    flag: 'CAN',
  },
  {
    id: 'can-porthardy',
    name: 'PORT HARDY',
    flag: 'CAN',
  },
  {
    id: 'can-porthawkesbury',
    name: 'PORT HAWKESBURY',
    flag: 'CAN',
  },
  {
    id: 'can-portmcneill',
    name: 'PORT MCNEILL',
    flag: 'CAN',
  },
  {
    id: 'can-portmellon',
    name: 'PORT MELLON',
    flag: 'CAN',
  },
  {
    id: 'can-portmoody',
    name: 'PORT MOODY',
    flag: 'CAN',
  },
  {
    id: 'can-portmouton',
    name: 'PORT MOUTON',
    flag: 'CAN',
  },
  {
    id: 'can-portweller',
    name: 'PORT WELLER',
    flag: 'CAN',
  },
  {
    id: 'can-powellriver',
    name: 'POWELL RIVER',
    flag: 'CAN',
  },
  {
    id: 'can-princerupert',
    name: 'PRINCE RUPERT',
    flag: 'CAN',
  },
  {
    id: 'can-pubnico',
    name: 'PUBNICO',
    flag: 'CAN',
  },
  {
    id: 'can-quebec',
    name: 'QUEBEC',
    flag: 'CAN',
  },
  {
    id: 'can-queencharlotte',
    name: 'QUEEN CHARLOTTE',
    flag: 'CAN',
  },
  {
    id: 'can-ramea',
    name: 'RAMEA',
    flag: 'CAN',
  },
  {
    id: 'can-rimouski',
    name: 'RIMOUSKI',
    flag: 'CAN',
  },
  {
    id: 'can-robertsbank',
    name: 'ROBERTS BANK',
    flag: 'CAN',
  },
  {
    id: 'can-saintanthony',
    name: 'SAINT ANTHONY',
    flag: 'CAN',
  },
  {
    id: 'can-sainte-catherine',
    name: 'SAINTE-CATHERINE',
    flag: 'CAN',
  },
  {
    id: 'can-saintjohn',
    name: 'SAINT JOHN',
    flag: 'CAN',
  },
  {
    id: 'can-saintlawrence',
    name: 'SAINT LAWRENCE',
    flag: 'CAN',
  },
  {
    id: 'can-sambro',
    name: 'SAMBRO',
    flag: 'CAN',
  },
  {
    id: 'can-sandspit',
    name: 'SANDSPIT',
    flag: 'CAN',
  },
  {
    id: 'can-sarnia',
    name: 'SARNIA',
    flag: 'CAN',
  },
  {
    id: 'can-septiles',
    name: 'SEPT ILES',
    flag: 'CAN',
  },
  {
    id: 'can-shearwater',
    name: 'SHEARWATER',
    flag: 'CAN',
  },
  {
    id: 'can-sheetharbour',
    name: 'SHEET HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-shelburne',
    name: 'SHELBURNE',
    flag: 'CAN',
  },
  {
    id: 'can-shippegan',
    name: 'SHIPPEGAN',
    flag: 'CAN',
  },
  {
    id: 'can-sidney',
    name: 'SIDNEY',
    flag: 'CAN',
  },
  {
    id: 'can-snugcove',
    name: 'SNUG COVE',
    flag: 'CAN',
  },
  {
    id: 'can-sooke',
    name: 'SOOKE',
    flag: 'CAN',
  },
  {
    id: 'can-sorel',
    name: 'SOREL',
    flag: 'CAN',
  },
  {
    id: 'can-squamish',
    name: 'SQUAMISH',
    flag: 'CAN',
  },
  {
    id: 'can-steveston',
    name: 'STEVESTON',
    flag: 'CAN',
  },
  {
    id: 'can-stewart',
    name: 'STEWART',
    flag: 'CAN',
  },
  {
    id: 'can-stpierre',
    name: 'ST PIERRE',
    flag: 'CAN',
  },
  {
    id: 'can-summerside',
    name: 'SUMMERSIDE',
    flag: 'CAN',
  },
  {
    id: 'can-sydney',
    name: 'SYDNEY',
    flag: 'CAN',
  },
  {
    id: 'can-tadoussac',
    name: 'TADOUSSAC',
    flag: 'CAN',
  },
  {
    id: 'can-thorold',
    name: 'THOROLD',
    flag: 'CAN',
  },
  {
    id: 'can-thunderbay',
    name: 'THUNDER BAY',
    flag: 'CAN',
  },
  {
    id: 'can-tofino',
    name: 'TOFINO',
    flag: 'CAN',
  },
  {
    id: 'can-tribunebay',
    name: 'TRIBUNE BAY',
    flag: 'CAN',
  },
  {
    id: 'can-trios-pistolesanchorage',
    name: 'TRIOS-PISTOLES ANCHORAGE',
    flag: 'CAN',
  },
  {
    id: 'can-troisrivieres',
    name: 'TROIS RIVIERES',
    flag: 'CAN',
  },
  {
    id: 'can-tsawwassen',
    name: 'TSAWWASSEN',
    flag: 'CAN',
  },
  {
    id: 'can-tsehumharbour',
    name: 'TSEHUM HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-ucluelet',
    name: 'UCLUELET',
    flag: 'CAN',
  },
  {
    id: 'can-valleyfield',
    name: 'VALLEYFIELD',
    flag: 'CAN',
  },
  {
    id: 'can-vancouver',
    name: 'VANCOUVER',
    flag: 'CAN',
  },
  {
    id: 'can-victoria',
    name: 'VICTORIA',
    flag: 'CAN',
  },
  {
    id: 'can-wedgeport',
    name: 'WEDGEPORT',
    flag: 'CAN',
  },
  {
    id: 'can-windsor',
    name: 'WINDSOR',
    flag: 'CAN',
  },
  {
    id: 'can-woodsharbour',
    name: 'WOODS HARBOUR',
    flag: 'CAN',
  },
  {
    id: 'can-yarmouth',
    name: 'YARMOUTH',
    flag: 'CAN',
  },
  {
    id: 'cck-cocos',
    name: 'COCOS',
    flag: 'CCK',
  },
  {
    id: 'che-birsfelden',
    name: 'BIRSFELDEN',
    flag: 'CHE',
  },
  {
    id: 'chl-aguafresca',
    name: 'AGUA FRESCA',
    flag: 'CHL',
  },
  {
    id: 'chl-aguantao',
    name: 'AGUANTAO',
    flag: 'CHL',
  },
  {
    id: 'chl-alejandroselkirk',
    name: 'ALEJANDRO SELKIRK',
    flag: 'CHL',
  },
  {
    id: 'chl-algarrobo',
    name: 'ALGARROBO',
    flag: 'CHL',
  },
  {
    id: 'chl-bahiacumberland',
    name: 'BAHIA CUMBERLAND',
    flag: 'CHL',
  },
  {
    id: 'chl-bahiahuelmo',
    name: 'BAHIA HUELMO',
    flag: 'CHL',
  },
  {
    id: 'chl-cabonegro',
    name: 'CABO NEGRO',
    flag: 'CHL',
  },
  {
    id: 'chl-caletapaposo',
    name: 'CALETA PAPOSO',
    flag: 'CHL',
  },
  {
    id: 'chl-calfuco',
    name: 'CALFUCO',
    flag: 'CHL',
  },
  {
    id: 'chl-cardonal',
    name: 'CARDONAL',
    flag: 'CHL',
  },
  {
    id: 'chl-chanavayita',
    name: 'CHANAVAYITA',
    flag: 'CHL',
  },
  {
    id: 'chl-chivilingo',
    name: 'CHIVILINGO',
    flag: 'CHL',
  },
  {
    id: 'chl-chope',
    name: 'CHOPE',
    flag: 'CHL',
  },
  {
    id: 'chl-corralesnorte',
    name: 'CORRALES NORTE',
    flag: 'CHL',
  },
  {
    id: 'chl-elcisne',
    name: 'EL CISNE',
    flag: 'CHL',
  },
  {
    id: 'chl-elmorro(talcahuano)',
    name: 'EL MORRO (TALCAHUANO)',
    flag: 'CHL',
  },
  {
    id: 'chl-guayacan',
    name: 'GUAYACAN',
    flag: 'CHL',
  },
  {
    id: 'chl-hotuiti',
    name: 'HOTU ITI',
    flag: 'CHL',
  },
  {
    id: 'chl-huellelhue',
    name: 'HUELLELHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-huentelolen',
    name: 'HUENTELOLEN',
    flag: 'CHL',
  },
  {
    id: 'chl-laarena',
    name: 'LA ARENA',
    flag: 'CHL',
  },
  {
    id: 'chl-lamecura',
    name: 'LAMECURA',
    flag: 'CHL',
  },
  {
    id: 'chl-laperouse(mangahoonu)',
    name: 'LAPEROUSE (MANGA HOONU)',
    flag: 'CHL',
  },
  {
    id: 'chl-laraquete',
    name: 'LARAQUETE',
    flag: 'CHL',
  },
  {
    id: 'chl-latrinchera',
    name: 'LA TRINCHERA',
    flag: 'CHL',
  },
  {
    id: 'chl-lirquen',
    name: 'LIRQUEN',
    flag: 'CHL',
  },
  {
    id: 'chl-loanco',
    name: 'LOANCO',
    flag: 'CHL',
  },
  {
    id: 'chl-losmolinos',
    name: 'LOS MOLINOS',
    flag: 'CHL',
  },
  {
    id: 'chl-mangaroa',
    name: 'MANGA ROA',
    flag: 'CHL',
  },
  {
    id: 'chl-mariaolvio',
    name: 'MARIA OLVIO',
    flag: 'CHL',
  },
  {
    id: 'chl-metri',
    name: 'METRI',
    flag: 'CHL',
  },
  {
    id: 'chl-michilla',
    name: 'MICHILLA',
    flag: 'CHL',
  },
  {
    id: 'chl-muelleaguasquietas,puertoaysen',
    name: 'MUELLE AGUAS QUIETAS, PUERTO AYSEN',
    flag: 'CHL',
  },
  {
    id: 'chl-muelleartesanal,caletaandrade',
    name: 'MUELLE ARTESANAL, CALETA ANDRADE',
    flag: 'CHL',
  },
  {
    id: 'chl-muellepesquerablumar',
    name: 'MUELLE PESQUERA BLUMAR',
    flag: 'CHL',
  },
  {
    id: 'chl-muellepuertogaviota',
    name: 'MUELLE PUERTO GAVIOTA',
    flag: 'CHL',
  },
  {
    id: 'chl-pinohuacho',
    name: 'PINO HUACHO',
    flag: 'CHL',
  },
  {
    id: 'chl-portofino',
    name: 'PORTO FINO',
    flag: 'CHL',
  },
  {
    id: 'chl-puelche',
    name: 'PUELCHE',
    flag: 'CHL',
  },
  {
    id: 'chl-puertonatales',
    name: 'PUERTO NATALES',
    flag: 'CHL',
  },
  {
    id: 'chl-puntaastorga',
    name: 'PUNTA ASTORGA',
    flag: 'CHL',
  },
  {
    id: 'chl-puntacarrera',
    name: 'PUNTA CARRERA',
    flag: 'CHL',
  },
  {
    id: 'chl-putu',
    name: 'PUTU',
    flag: 'CHL',
  },
  {
    id: 'chl-quehui',
    name: 'QUEHUI',
    flag: 'CHL',
  },
  {
    id: 'chl-queule',
    name: 'QUEULE',
    flag: 'CHL',
  },
  {
    id: 'chl-quidico',
    name: 'QUIDICO',
    flag: 'CHL',
  },
  {
    id: 'chl-sanpedrodenolasco',
    name: 'SAN PEDRO DE NOLASCO',
    flag: 'CHL',
  },
  {
    id: 'chl-taucu',
    name: 'TAUCU',
    flag: 'CHL',
  },
  {
    id: 'chl-terminalotway',
    name: 'TERMINAL OTWAY',
    flag: 'CHL',
  },
  {
    id: 'chl-tirua',
    name: 'TIRUA',
    flag: 'CHL',
  },
  {
    id: 'chl-totoralillocentro',
    name: 'TOTORALILLO CENTRO',
    flag: 'CHL',
  },
  {
    id: 'chl-vaihu',
    name: 'VAIHU',
    flag: 'CHL',
  },
  {
    id: 'chl-ventana',
    name: 'VENTANA',
    flag: 'CHL',
  },
  {
    id: 'chl-villarrica,dichato',
    name: 'VILLARRICA, DICHATO',
    flag: 'CHL',
  },
  {
    id: 'chn-anqing',
    name: 'ANQING',
    flag: 'CHN',
  },
  {
    id: 'chn-aojiang',
    name: 'AOJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-basuo',
    name: 'BASUO',
    flag: 'CHN',
  },
  {
    id: 'chn-bayuquan',
    name: 'BAYUQUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-bayuquananchorage',
    name: 'BAYUQUAN ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'chn-beihai',
    name: 'BEIHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-beilong',
    name: 'BEILONG',
    flag: 'CHN',
  },
  {
    id: 'chn-binhai',
    name: 'BINHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-binzhou',
    name: 'BINZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-bohe',
    name: 'BOHE',
    flag: 'CHN',
  },
  {
    id: 'chn-bz26-3field',
    name: 'BZ26-3 FIELD',
    flag: 'CHN',
  },
  {
    id: 'chn-caofeidian',
    name: 'CAOFEIDIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-caojing',
    name: 'CAOJING',
    flag: 'CHN',
  },
  {
    id: 'chn-cfd11field',
    name: 'CFD11 FIELD',
    flag: 'CHN',
  },
  {
    id: 'chn-changdao',
    name: 'CHANGDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-changhai',
    name: 'CHANGHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-changjiangkou',
    name: 'CHANGJIANGKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-changsha',
    name: 'CHANGSHA',
    flag: 'CHN',
  },
  {
    id: 'chn-changshu',
    name: 'CHANGSHU',
    flag: 'CHN',
  },
  {
    id: 'chn-changzhou',
    name: 'CHANGZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chaozhou',
    name: 'CHAOZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-cheklapkok',
    name: 'CHEKLAPKOK',
    flag: 'CHN',
  },
  {
    id: 'chn-chenjiagang',
    name: 'CHENJIAGANG',
    flag: 'CHN',
  },
  {
    id: 'chn-chizhou',
    name: 'CHIZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-chongming',
    name: 'CHONGMING',
    flag: 'CHN',
  },
  {
    id: 'chn-dafeng',
    name: 'DAFENG',
    flag: 'CHN',
  },
  {
    id: 'chn-daluisland',
    name: 'DALU ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-dandong',
    name: 'DAN DONG',
    flag: 'CHN',
  },
  {
    id: 'chn-dapeng',
    name: 'DAPENG',
    flag: 'CHN',
  },
  {
    id: 'chn-diashan',
    name: 'DIASHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-dongfang',
    name: 'DONGFANG',
    flag: 'CHN',
  },
  {
    id: 'chn-dongguan',
    name: 'DONGGUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-dongping',
    name: 'DONGPING',
    flag: 'CHN',
  },
  {
    id: 'chn-dongtou',
    name: 'DONGTOU',
    flag: 'CHN',
  },
  {
    id: 'chn-dongying',
    name: 'DONGYING',
    flag: 'CHN',
  },
  {
    id: 'chn-doumen',
    name: 'DOUMEN',
    flag: 'CHN',
  },
  {
    id: 'chn-ezhou',
    name: 'EZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-fengdu',
    name: 'FENGDU',
    flag: 'CHN',
  },
  {
    id: 'chn-foshan',
    name: 'FOSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-ganjiang',
    name: 'GANJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-ganpu',
    name: 'GANPU',
    flag: 'CHN',
  },
  {
    id: 'chn-ganyu',
    name: 'GANYU',
    flag: 'CHN',
  },
  {
    id: 'chn-gouqiisland',
    name: 'GOUQI ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-gulei',
    name: 'GULEI',
    flag: 'CHN',
  },
  {
    id: 'chn-haian',
    name: 'HAIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-haikou',
    name: 'HAIKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-haimen',
    name: 'HAIMEN',
    flag: 'CHN',
  },
  {
    id: 'chn-haiyan',
    name: 'HAIYAN',
    flag: 'CHN',
  },
  {
    id: 'chn-haiyang',
    name: 'HAIYANG',
    flag: 'CHN',
  },
  {
    id: 'chn-honghu',
    name: 'HONGHU',
    flag: 'CHN',
  },
  {
    id: 'chn-hongwan',
    name: 'HONGWAN',
    flag: 'CHN',
  },
  {
    id: 'chn-huaian',
    name: 'HUAIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-huangdao',
    name: 'HUANGDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-huanggang',
    name: 'HUANGGANG',
    flag: 'CHN',
  },
  {
    id: 'chn-huanghua',
    name: 'HUANG HUA',
    flag: 'CHN',
  },
  {
    id: 'chn-huangshi',
    name: 'HUANGSHI',
    flag: 'CHN',
  },
  {
    id: 'chn-huizhou',
    name: 'HUIZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-huludao',
    name: 'HULUDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-jiangdu',
    name: 'JIANGDU',
    flag: 'CHN',
  },
  {
    id: 'chn-jiangyin',
    name: 'JIANGYIN',
    flag: 'CHN',
  },
  {
    id: 'chn-jiaxing',
    name: 'JIAXING',
    flag: 'CHN',
  },
  {
    id: 'chn-jiayang',
    name: 'JIAYANG',
    flag: 'CHN',
  },
  {
    id: 'chn-jieyang',
    name: 'JIEYANG',
    flag: 'CHN',
  },
  {
    id: 'chn-jimiya',
    name: 'JIMIYA',
    flag: 'CHN',
  },
  {
    id: 'chn-jinghai',
    name: 'JINGHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-jingjiang',
    name: 'JINGJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-jingtang',
    name: 'JINGTANG',
    flag: 'CHN',
  },
  {
    id: 'chn-jinshan',
    name: 'JINSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-jinshitan',
    name: 'JINSHITAN',
    flag: 'CHN',
  },
  {
    id: 'chn-jintang',
    name: 'JINTANG',
    flag: 'CHN',
  },
  {
    id: 'chn-jinzhou',
    name: 'JINZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-jiujiang',
    name: 'JIUJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-kaolaotou',
    name: 'KAOLAOTOU',
    flag: 'CHN',
  },
  {
    id: 'chn-kemen',
    name: 'KEMEN',
    flag: 'CHN',
  },
  {
    id: 'chn-laizhou',
    name: 'LAIZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-langya',
    name: 'LANGYA',
    flag: 'CHN',
  },
  {
    id: 'chn-lanshan',
    name: 'LANSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-liuao',
    name: 'LIUAO',
    flag: 'CHN',
  },
  {
    id: 'chn-longkou',
    name: 'LONGKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-longwangtang',
    name: 'LONGWANGTANG',
    flag: 'CHN',
  },
  {
    id: 'chn-luhuashananchorage',
    name: 'LUHUASHAN ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'chn-luoyuan',
    name: 'LUOYUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-lushan',
    name: 'LUSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-lusi',
    name: 'LUSI',
    flag: 'CHN',
  },
  {
    id: 'chn-maanshan',
    name: 'MAANSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-macau',
    name: 'MACAU',
    flag: 'CHN',
  },
  {
    id: 'chn-macun',
    name: 'MACUN',
    flag: 'CHN',
  },
  {
    id: 'chn-majishan',
    name: 'MAJISHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-majishananchorage',
    name: 'MAJISHAN ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'chn-maoming',
    name: 'MAOMING',
    flag: 'CHN',
  },
  {
    id: 'chn-maominganchorage',
    name: 'MAOMING ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'chn-meizhouisland',
    name: 'MEIZHOU ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-minhang',
    name: 'MINHANG',
    flag: 'CHN',
  },
  {
    id: 'chn-nanao',
    name: 'NANAO',
    flag: 'CHN',
  },
  {
    id: 'chn-nancun',
    name: 'NANCUN',
    flag: 'CHN',
  },
  {
    id: 'chn-nanhuangcheng',
    name: 'NANHUANGCHENG',
    flag: 'CHN',
  },
  {
    id: 'chn-nanhui',
    name: 'NANHUI',
    flag: 'CHN',
  },
  {
    id: 'chn-nanjing',
    name: 'NANJING',
    flag: 'CHN',
  },
  {
    id: 'chn-nanpaihe',
    name: 'NANPAIHE',
    flag: 'CHN',
  },
  {
    id: 'chn-nanpenglieisland',
    name: 'NANPENGLIE ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-nanri',
    name: 'NANRI',
    flag: 'CHN',
  },
  {
    id: 'chn-nansha',
    name: 'NANSHA',
    flag: 'CHN',
  },
  {
    id: 'chn-nanshaojia',
    name: 'NANSHAOJIA',
    flag: 'CHN',
  },
  {
    id: 'chn-nantong',
    name: 'NANTONG',
    flag: 'CHN',
  },
  {
    id: 'chn-ninghai',
    name: 'NINGHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-panjin',
    name: 'PANJIN',
    flag: 'CHN',
  },
  {
    id: 'chn-pingtan',
    name: 'PINGTAN',
    flag: 'CHN',
  },
  {
    id: 'chn-pingyuan',
    name: 'PINGYUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-pintan',
    name: 'PINTAN',
    flag: 'CHN',
  },
  {
    id: 'chn-pishandao',
    name: 'PISHANDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-pulandian',
    name: 'PULANDIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-putian',
    name: 'PUTIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-qianliyan',
    name: 'QIANLIYAN',
    flag: 'CHN',
  },
  {
    id: 'chn-qidong',
    name: 'QIDONG',
    flag: 'CHN',
  },
  {
    id: 'chn-qinhuangdao',
    name: 'QINHUANGDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-qinyu',
    name: 'QINYU',
    flag: 'CHN',
  },
  {
    id: 'chn-qinzhou',
    name: 'QINZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-qinzhouanchorage',
    name: 'QIN ZHOU ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'chn-qishazhen',
    name: 'QISHAZHEN',
    flag: 'CHN',
  },
  {
    id: 'chn-quangang',
    name: 'QUANGANG',
    flag: 'CHN',
  },
  {
    id: 'chn-qushan',
    name: 'QUSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-qushanisland',
    name: 'QUSHAN ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-rizhao',
    name: 'RIZHAO',
    flag: 'CHN',
  },
  {
    id: 'chn-rongcheng',
    name: 'RONGCHENG',
    flag: 'CHN',
  },
  {
    id: 'chn-ruian',
    name: 'RUIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-rushan',
    name: 'RUSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-sanmenisland',
    name: 'SANMEN ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-sansha',
    name: 'SANSHA',
    flag: 'CHN',
  },
  {
    id: 'chn-sanshaanchorage',
    name: 'SANSHA ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'chn-sanya',
    name: 'SANYA',
    flag: 'CHN',
  },
  {
    id: 'chn-shandongtou',
    name: 'SHANDONGTOU',
    flag: 'CHN',
  },
  {
    id: 'chn-shanhaiguan',
    name: 'SHANHAIGUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-shantou',
    name: 'SHANTOU',
    flag: 'CHN',
  },
  {
    id: 'chn-shanwei',
    name: 'SHANWEI',
    flag: 'CHN',
  },
  {
    id: 'chn-shekou',
    name: 'SHEKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-shengsi',
    name: 'SHENGSI',
    flag: 'CHN',
  },
  {
    id: 'chn-shenquan',
    name: 'SHENQUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-sheyang',
    name: 'SHEYANG',
    flag: 'CHN',
  },
  {
    id: 'chn-shijing',
    name: 'SHIJING',
    flag: 'CHN',
  },
  {
    id: 'chn-shipu',
    name: 'SHIPU',
    flag: 'CHN',
  },
  {
    id: 'chn-shouguang',
    name: 'SHOUGUANG',
    flag: 'CHN',
  },
  {
    id: 'chn-shuidong',
    name: 'SHUIDONG',
    flag: 'CHN',
  },
  {
    id: 'chn-songmen',
    name: 'SONGMEN',
    flag: 'CHN',
  },
  {
    id: 'chn-songxia',
    name: 'SONGXIA',
    flag: 'CHN',
  },
  {
    id: 'chn-southkudangdao',
    name: 'SOUTH KUDANGDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-suqian',
    name: 'SUQIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-sz361field',
    name: 'SZ361 FIELD',
    flag: 'CHN',
  },
  {
    id: 'chn-taicang',
    name: 'TAICANG',
    flag: 'CHN',
  },
  {
    id: 'chn-taipingwan',
    name: 'TAIPINGWAN',
    flag: 'CHN',
  },
  {
    id: 'chn-taishanpowerplant',
    name: 'TAISHAN POWER PLANT',
    flag: 'CHN',
  },
  {
    id: 'chn-taixing',
    name: 'TAI XING',
    flag: 'CHN',
  },
  {
    id: 'chn-taohua',
    name: 'TAOHUA',
    flag: 'CHN',
  },
  {
    id: 'chn-tieshan',
    name: 'TIESHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-tongling',
    name: 'TONGLING',
    flag: 'CHN',
  },
  {
    id: 'chn-weifang',
    name: 'WEIFANG',
    flag: 'CHN',
  },
  {
    id: 'chn-weihai',
    name: 'WEIHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-weitou',
    name: 'WEITOU',
    flag: 'CHN',
  },
  {
    id: 'chn-weizhouisland',
    name: 'WEIZHOU ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-wenzhou',
    name: 'WENZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-wuhan',
    name: 'WUHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-wuhu',
    name: 'WUHU',
    flag: 'CHN',
  },
  {
    id: 'chn-xiangshan',
    name: 'XIANGSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-xiangshui',
    name: 'XIANGSHUI',
    flag: 'CHN',
  },
  {
    id: 'chn-xiawei',
    name: 'XIAWEI',
    flag: 'CHN',
  },
  {
    id: 'chn-xifangshen',
    name: 'XIFANGSHEN',
    flag: 'CHN',
  },
  {
    id: 'chn-xingcheng',
    name: 'XINGCHENG',
    flag: 'CHN',
  },
  {
    id: 'chn-xingzaidao',
    name: 'XINGZAIDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-xinhai',
    name: 'XINHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-xinhui',
    name: 'XINHUI',
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
    id: 'chn-yancheng',
    name: 'YANCHENG',
    flag: 'CHN',
  },
  {
    id: 'chn-yangjiang',
    name: 'YANGJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-yangkou',
    name: 'YANGKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-yangpu',
    name: 'YANGPU',
    flag: 'CHN',
  },
  {
    id: 'chn-yangshan',
    name: 'YANGSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-yangxi',
    name: 'YANGXI',
    flag: 'CHN',
  },
  {
    id: 'chn-yangzhong',
    name: 'YANGZHONG',
    flag: 'CHN',
  },
  {
    id: 'chn-yangzhou',
    name: 'YANGZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-yantian',
    name: 'YANTIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-yantiananchorage',
    name: 'YANTIAN ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'chn-yichang',
    name: 'YICHANG',
    flag: 'CHN',
  },
  {
    id: 'chn-yingkou',
    name: 'YINGKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-yingpan',
    name: 'YINGPAN',
    flag: 'CHN',
  },
  {
    id: 'chn-yizheng',
    name: 'YIZHENG',
    flag: 'CHN',
  },
  {
    id: 'chn-youcaihua',
    name: 'YOUCAIHUA',
    flag: 'CHN',
  },
  {
    id: 'chn-yueyang',
    name: 'YUEYANG',
    flag: 'CHN',
  },
  {
    id: 'chn-yuhuan',
    name: 'YUHUAN',
    flag: 'CHN',
  },
  {
    id: 'chn-yushanisland',
    name: 'YUSHAN ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-zhangjiagang',
    name: 'ZHANGJIAGANG',
    flag: 'CHN',
  },
  {
    id: 'chn-zhanjiang',
    name: 'ZHANJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-zhapu',
    name: 'ZHAPU',
    flag: 'CHN',
  },
  {
    id: 'chn-zhenjiang',
    name: 'ZHENJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-zhongshan',
    name: 'ZHONGSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-zhoushananchorage',
    name: 'ZHOUSHAN ANCHORAGE',
    flag: 'CHN',
  },
  {
    id: 'chn-zhuhai',
    name: 'ZHUHAI',
    flag: 'CHN',
  },
  {
    id: 'cmr-bombemgue',
    name: 'BOMBEMGUE',
    flag: 'CMR',
  },
  {
    id: 'cmr-ebometerminal',
    name: 'EBOME TERMINAL',
    flag: 'CMR',
  },
  {
    id: 'cmr-limbe',
    name: 'LIMBE',
    flag: 'CMR',
  },
  {
    id: 'cmr-massongo',
    name: 'MASSONGO',
    flag: 'CMR',
  },
  {
    id: 'cmr-tiko',
    name: 'TIKO',
    flag: 'CMR',
  },
  {
    id: 'cod-banana',
    name: 'BANANA',
    flag: 'COD',
  },
  {
    id: 'cod-block15',
    name: 'BLOCK 15',
    flag: 'COD',
  },
  {
    id: 'cod-block31',
    name: 'BLOCK 31',
    flag: 'COD',
  },
  {
    id: 'cod-kizombafpso',
    name: 'KIZOMBA FPSO',
    flag: 'COD',
  },
  {
    id: 'cog-djeno',
    name: 'DJENO',
    flag: 'COG',
  },
  {
    id: 'cog-kalamu',
    name: 'KALAMU',
    flag: 'COG',
  },
  {
    id: "cog-n'kossaterminal",
    name: "N'KOSSA TERMINAL",
    flag: 'COG',
  },
  {
    id: 'cog-offshore',
    name: 'OFFSHORE',
    flag: 'COG',
  },
  {
    id: 'cog-pnr',
    name: 'PNR',
    flag: 'COG',
  },
  {
    id: 'cog-sefp',
    name: 'SEFP',
    flag: 'COG',
  },
  {
    id: 'cog-yanga',
    name: 'YANGA',
    flag: 'COG',
  },
  {
    id: 'cog-yomboterminal',
    name: 'YOMBO TERMINAL',
    flag: 'COG',
  },
  {
    id: 'col-covenas',
    name: 'COVENAS',
    flag: 'COL',
  },
  {
    id: 'col-puertobolivar',
    name: 'PUERTO BOLIVAR',
    flag: 'COL',
  },
  {
    id: 'col-puertobrisa',
    name: 'PUERTO BRISA',
    flag: 'COL',
  },
  {
    id: 'col-puertonuevo',
    name: 'PUERTO NUEVO',
    flag: 'COL',
  },
  {
    id: 'col-sanandres',
    name: 'SAN ANDRES',
    flag: 'COL',
  },
  {
    id: 'col-tolu',
    name: 'TOLU',
    flag: 'COL',
  },
  {
    id: 'com-mutsamudu',
    name: 'MUTSAMUDU',
    flag: 'COM',
  },
  {
    id: 'cpv-portonovo',
    name: 'PORTO NOVO',
    flag: 'CPV',
  },
  {
    id: 'cpv-salrei',
    name: 'SAL REI',
    flag: 'CPV',
  },
  {
    id: 'cpv-santamaria',
    name: 'SANTA MARIA',
    flag: 'CPV',
  },
  {
    id: 'cpv-saofilipe',
    name: 'SAO FILIPE',
    flag: 'CPV',
  },
  {
    id: 'cpv-tarrafal',
    name: 'TARRAFAL',
    flag: 'CPV',
  },
  {
    id: 'cpv-viladomaio',
    name: 'VILA DO MAIO',
    flag: 'CPV',
  },
  {
    id: 'cri-moin',
    name: 'MOIN',
    flag: 'CRI',
  },
  {
    id: 'cri-papagayo',
    name: 'PAPAGAYO',
    flag: 'CRI',
  },
  {
    id: 'cri-puertoherradura',
    name: 'PUERTO HERRADURA',
    flag: 'CRI',
  },
  {
    id: 'cri-puntamorales',
    name: 'PUNTA MORALES',
    flag: 'CRI',
  },
  {
    id: 'cub-cienfuegos',
    name: 'CIENFUEGOS',
    flag: 'CUB',
  },
  {
    id: 'cub-guantanamo',
    name: 'GUANTANAMO',
    flag: 'CUB',
  },
  {
    id: 'cub-guayabal',
    name: 'GUAYABAL',
    flag: 'CUB',
  },
  {
    id: 'cub-mariel',
    name: 'MARIEL',
    flag: 'CUB',
  },
  {
    id: 'cub-matanzas',
    name: 'MATANZAS',
    flag: 'CUB',
  },
  {
    id: 'cub-moa',
    name: 'MOA',
    flag: 'CUB',
  },
  {
    id: 'cub-nuevitas',
    name: 'NUEVITAS',
    flag: 'CUB',
  },
  {
    id: 'cub-nuevitasanchorage',
    name: 'NUEVITAS ANCHORAGE',
    flag: 'CUB',
  },
  {
    id: 'cub-puertopadre',
    name: 'PUERTO PADRE',
    flag: 'CUB',
  },
  {
    id: 'cuw-bullenbay',
    name: 'BULLENBAY',
    flag: 'CUW',
  },
  {
    id: 'cuw-caracasbay',
    name: 'CARACAS BAY',
    flag: 'CUW',
  },
  {
    id: 'cuw-fuikbaai',
    name: 'FUIK BAAI',
    flag: 'CUW',
  },
  {
    id: 'cuw-littlecuracao',
    name: 'LITTLE CURACAO',
    flag: 'CUW',
  },
  {
    id: 'cxr-flyingfishcove',
    name: 'FLYING FISH COVE',
    flag: 'CXR',
  },
  {
    id: 'cym-georgetown',
    name: 'GEORGE TOWN',
    flag: 'CYM',
  },
  {
    id: 'cyp-akrotiri',
    name: 'AKROTIRI',
    flag: 'CYP',
  },
  {
    id: 'cyp-ayianapa',
    name: 'AYIA NAPA',
    flag: 'CYP',
  },
  {
    id: 'cyp-dhekelia',
    name: 'DHEKELIA',
    flag: 'CYP',
  },
  {
    id: 'cyp-famagusta',
    name: 'FAMAGUSTA',
    flag: 'CYP',
  },
  {
    id: 'cyp-kalecik',
    name: 'KALECIK',
    flag: 'CYP',
  },
  {
    id: 'cyp-kyrenia',
    name: 'KYRENIA',
    flag: 'CYP',
  },
  {
    id: 'cyp-larnaca',
    name: 'LARNACA',
    flag: 'CYP',
  },
  {
    id: 'cyp-latsi',
    name: 'LATSI',
    flag: 'CYP',
  },
  {
    id: 'cyp-limassol',
    name: 'LIMASSOL',
    flag: 'CYP',
  },
  {
    id: 'cyp-paphos',
    name: 'PAPHOS',
    flag: 'CYP',
  },
  {
    id: 'cyp-vasilikos',
    name: 'VASILIKOS',
    flag: 'CYP',
  },
  {
    id: 'deu-barth',
    name: 'BARTH',
    flag: 'DEU',
  },
  {
    id: 'deu-bensersiel',
    name: 'BENSERSIEL',
    flag: 'DEU',
  },
  {
    id: 'deu-borkum',
    name: 'BORKUM',
    flag: 'DEU',
  },
  {
    id: 'deu-brake',
    name: 'BRAKE',
    flag: 'DEU',
  },
  {
    id: 'deu-breisach',
    name: 'BREISACH',
    flag: 'DEU',
  },
  {
    id: 'deu-bremen',
    name: 'BREMEN',
    flag: 'DEU',
  },
  {
    id: 'deu-brunsbuttel',
    name: 'BRUNSBUTTEL',
    flag: 'DEU',
  },
  {
    id: 'deu-buesum',
    name: 'BUESUM',
    flag: 'DEU',
  },
  {
    id: 'deu-burgauffehmarn',
    name: 'BURG AUF FEHMARN',
    flag: 'DEU',
  },
  {
    id: 'deu-dolwinalphaplatform',
    name: 'DOLWIN ALPHA PLATFORM',
    flag: 'DEU',
  },
  {
    id: 'deu-dorpen',
    name: 'DORPEN',
    flag: 'DEU',
  },
  {
    id: 'deu-dortmund',
    name: 'DORTMUND',
    flag: 'DEU',
  },
  {
    id: 'deu-duisburg',
    name: 'DUISBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-dusseldorf',
    name: 'DUSSELDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-eckernforde',
    name: 'ECKERNFORDE',
    flag: 'DEU',
  },
  {
    id: 'deu-eemshaven',
    name: 'EEMSHAVEN',
    flag: 'DEU',
  },
  {
    id: 'deu-emden',
    name: 'EMDEN',
    flag: 'DEU',
  },
  {
    id: 'deu-flensburg',
    name: 'FLENSBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-freesendorf',
    name: 'FREESENDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-glowe',
    name: 'GLOWE',
    flag: 'DEU',
  },
  {
    id: 'deu-gluckstadt',
    name: 'GLUCKSTADT',
    flag: 'DEU',
  },
  {
    id: 'deu-greifswald',
    name: 'GREIFSWALD',
    flag: 'DEU',
  },
  {
    id: 'deu-gromitz',
    name: 'GROMITZ',
    flag: 'DEU',
  },
  {
    id: 'deu-hamburg',
    name: 'HAMBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-heiligenhafen',
    name: 'HEILIGENHAFEN',
    flag: 'DEU',
  },
  {
    id: 'deu-helgoland',
    name: 'HELGOLAND',
    flag: 'DEU',
  },
  {
    id: 'deu-herne',
    name: 'HERNE',
    flag: 'DEU',
  },
  {
    id: 'deu-hiddensee',
    name: 'HIDDENSEE',
    flag: 'DEU',
  },
  {
    id: 'deu-hochdonn',
    name: 'HOCHDONN',
    flag: 'DEU',
  },
  {
    id: 'deu-hooksiel',
    name: 'HOOKSIEL',
    flag: 'DEU',
  },
  {
    id: 'deu-husum',
    name: 'HUSUM',
    flag: 'DEU',
  },
  {
    id: 'deu-kappeln',
    name: 'KAPPELN',
    flag: 'DEU',
  },
  {
    id: 'deu-kiel',
    name: 'KIEL',
    flag: 'DEU',
  },
  {
    id: 'deu-kroslin',
    name: 'KROSLIN',
    flag: 'DEU',
  },
  {
    id: 'deu-kuehlungsborn',
    name: 'KUEHLUNGSBORN',
    flag: 'DEU',
  },
  {
    id: 'deu-laboe',
    name: 'LABOE',
    flag: 'DEU',
  },
  {
    id: 'deu-lahnstein',
    name: 'LAHNSTEIN',
    flag: 'DEU',
  },
  {
    id: 'deu-langeoog',
    name: 'LANGEOOG',
    flag: 'DEU',
  },
  {
    id: 'deu-lauterbach',
    name: 'LAUTERBACH',
    flag: 'DEU',
  },
  {
    id: 'deu-leer',
    name: 'LEER',
    flag: 'DEU',
  },
  {
    id: 'deu-lemwerder',
    name: 'LEMWERDER',
    flag: 'DEU',
  },
  {
    id: 'deu-list',
    name: 'LIST',
    flag: 'DEU',
  },
  {
    id: 'deu-lubeck',
    name: 'LUBECK',
    flag: 'DEU',
  },
  {
    id: 'deu-maasholm',
    name: 'MAASHOLM',
    flag: 'DEU',
  },
  {
    id: 'deu-minden',
    name: 'MINDEN',
    flag: 'DEU',
  },
  {
    id: 'deu-mukran',
    name: 'MUKRAN',
    flag: 'DEU',
  },
  {
    id: 'deu-neuharlingersiel',
    name: 'NEUHARLINGERSIEL',
    flag: 'DEU',
  },
  {
    id: 'deu-neustadt',
    name: 'NEUSTADT',
    flag: 'DEU',
  },
  {
    id: 'deu-norddeich',
    name: 'NORDDEICH',
    flag: 'DEU',
  },
  {
    id: 'deu-nordenham',
    name: 'NORDENHAM',
    flag: 'DEU',
  },
  {
    id: 'deu-norderney',
    name: 'NORDERNEY',
    flag: 'DEU',
  },
  {
    id: 'deu-oberwesel',
    name: 'OBERWESEL',
    flag: 'DEU',
  },
  {
    id: 'deu-olpenitz',
    name: 'OLPENITZ',
    flag: 'DEU',
  },
  {
    id: 'deu-otterndorf',
    name: 'OTTERNDORF',
    flag: 'DEU',
  },
  {
    id: 'deu-pellworm',
    name: 'PELLWORM',
    flag: 'DEU',
  },
  {
    id: 'deu-rendsburg',
    name: 'RENDSBURG',
    flag: 'DEU',
  },
  {
    id: 'deu-rostock',
    name: 'ROSTOCK',
    flag: 'DEU',
  },
  {
    id: 'deu-sassnitz',
    name: 'SASSNITZ',
    flag: 'DEU',
  },
  {
    id: 'deu-stade',
    name: 'STADE',
    flag: 'DEU',
  },
  {
    id: 'deu-stralsund',
    name: 'STRALSUND',
    flag: 'DEU',
  },
  {
    id: 'deu-strande',
    name: 'STRANDE',
    flag: 'DEU',
  },
  {
    id: 'deu-travemuende',
    name: 'TRAVEMUENDE',
    flag: 'DEU',
  },
  {
    id: 'deu-ueckermunde',
    name: 'UECKERMUNDE',
    flag: 'DEU',
  },
  {
    id: 'deu-vierow',
    name: 'VIEROW',
    flag: 'DEU',
  },
  {
    id: 'deu-wedel',
    name: 'WEDEL',
    flag: 'DEU',
  },
  {
    id: 'deu-wesel',
    name: 'WESEL',
    flag: 'DEU',
  },
  {
    id: 'deu-wewelsfleth',
    name: 'WEWELSFLETH',
    flag: 'DEU',
  },
  {
    id: 'deu-wiek',
    name: 'WIEK',
    flag: 'DEU',
  },
  {
    id: 'deu-wilhelmshaven',
    name: 'WILHELMSHAVEN',
    flag: 'DEU',
  },
  {
    id: 'deu-wismar',
    name: 'WISMAR',
    flag: 'DEU',
  },
  {
    id: 'deu-wolgast',
    name: 'WOLGAST',
    flag: 'DEU',
  },
  {
    id: 'deu-wusterwitz',
    name: 'WUSTERWITZ',
    flag: 'DEU',
  },
  {
    id: 'deu-zingst',
    name: 'ZINGST',
    flag: 'DEU',
  },
  {
    id: 'deu-zinnowitz',
    name: 'ZINNOWITZ',
    flag: 'DEU',
  },
  {
    id: 'dma-pointemichel',
    name: 'POINTE MICHEL',
    flag: 'DMA',
  },
  {
    id: 'dma-portsmouth',
    name: 'PORTSMOUTH',
    flag: 'DMA',
  },
  {
    id: 'dma-roseau',
    name: 'ROSEAU',
    flag: 'DMA',
  },
  {
    id: 'dma-saintjoseph',
    name: 'SAINT JOSEPH',
    flag: 'DMA',
  },
  {
    id: 'dnk-aabenraa',
    name: 'AABENRAA',
    flag: 'DNK',
  },
  {
    id: 'dnk-aalborg',
    name: 'AALBORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-aarhus',
    name: 'AARHUS',
    flag: 'DNK',
  },
  {
    id: 'dnk-abelo',
    name: 'ABELO',
    flag: 'DNK',
  },
  {
    id: 'dnk-agger',
    name: 'AGGER',
    flag: 'DNK',
  },
  {
    id: 'dnk-assens',
    name: 'ASSENS',
    flag: 'DNK',
  },
  {
    id: 'dnk-augustenborg',
    name: 'AUGUSTENBORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-avedore',
    name: 'AVEDORE',
    flag: 'DNK',
  },
  {
    id: 'dnk-bagenkop',
    name: 'BAGENKOP',
    flag: 'DNK',
  },
  {
    id: 'dnk-ballen',
    name: 'BALLEN',
    flag: 'DNK',
  },
  {
    id: 'dnk-bogense',
    name: 'BOGENSE',
    flag: 'DNK',
  },
  {
    id: 'dnk-copenhagen',
    name: 'COPENHAGEN',
    flag: 'DNK',
  },
  {
    id: 'dnk-danfield',
    name: 'DAN FIELD',
    flag: 'DNK',
  },
  {
    id: 'dnk-dragerup',
    name: 'DRAGERUP',
    flag: 'DNK',
  },
  {
    id: 'dnk-dragor',
    name: 'DRAGOR',
    flag: 'DNK',
  },
  {
    id: 'dnk-ebeltoft',
    name: 'EBELTOFT',
    flag: 'DNK',
  },
  {
    id: 'dnk-faaborg',
    name: 'FAABORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-fredericia',
    name: 'FREDERICIA',
    flag: 'DNK',
  },
  {
    id: 'dnk-frederiksvaerk',
    name: 'FREDERIKSVAERK',
    flag: 'DNK',
  },
  {
    id: 'dnk-gedser',
    name: 'GEDSER',
    flag: 'DNK',
  },
  {
    id: 'dnk-gilleleje',
    name: 'GILLELEJE',
    flag: 'DNK',
  },
  {
    id: 'dnk-glyngore',
    name: 'GLYNGORE',
    flag: 'DNK',
  },
  {
    id: 'dnk-gormfield',
    name: 'GORM FIELD',
    flag: 'DNK',
  },
  {
    id: 'dnk-grasten',
    name: 'GRASTEN',
    flag: 'DNK',
  },
  {
    id: 'dnk-grenaa',
    name: 'GRENAA',
    flag: 'DNK',
  },
  {
    id: 'dnk-haderslev',
    name: 'HADERSLEV',
    flag: 'DNK',
  },
  {
    id: 'dnk-hadsund',
    name: 'HADSUND',
    flag: 'DNK',
  },
  {
    id: 'dnk-hals',
    name: 'HALS',
    flag: 'DNK',
  },
  {
    id: 'dnk-hasle',
    name: 'HASLE',
    flag: 'DNK',
  },
  {
    id: 'dnk-havneby',
    name: 'HAVNEBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-hirsholm',
    name: 'HIRSHOLM',
    flag: 'DNK',
  },
  {
    id: 'dnk-holbaek',
    name: 'HOLBAEK',
    flag: 'DNK',
  },
  {
    id: 'dnk-holstebro-stuer',
    name: 'HOLSTEBRO-STUER',
    flag: 'DNK',
  },
  {
    id: 'dnk-hornbaek',
    name: 'HORNBAEK',
    flag: 'DNK',
  },
  {
    id: 'dnk-horsens',
    name: 'HORSENS',
    flag: 'DNK',
  },
  {
    id: 'dnk-hundested',
    name: 'HUNDESTED',
    flag: 'DNK',
  },
  {
    id: 'dnk-hvalpsund',
    name: 'HVALPSUND',
    flag: 'DNK',
  },
  {
    id: 'dnk-juelsminde',
    name: 'JUELSMINDE',
    flag: 'DNK',
  },
  {
    id: 'dnk-kalundborganchorage',
    name: 'KALUNDBORG ANCHORAGE',
    flag: 'DNK',
  },
  {
    id: 'dnk-karrebaeksminde',
    name: 'KARREBAEKSMINDE',
    flag: 'DNK',
  },
  {
    id: 'dnk-kerteminde',
    name: 'KERTEMINDE',
    flag: 'DNK',
  },
  {
    id: 'dnk-klintholm',
    name: 'KLINTHOLM',
    flag: 'DNK',
  },
  {
    id: 'dnk-koege',
    name: 'KOEGE',
    flag: 'DNK',
  },
  {
    id: 'dnk-korsor',
    name: 'KORSOR',
    flag: 'DNK',
  },
  {
    id: 'dnk-kyndby',
    name: 'KYNDBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-logstor',
    name: 'LOGSTOR',
    flag: 'DNK',
  },
  {
    id: 'dnk-lundeborg',
    name: 'LUNDEBORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-lynaes',
    name: 'LYNAES',
    flag: 'DNK',
  },
  {
    id: 'dnk-middelfart',
    name: 'MIDDELFART',
    flag: 'DNK',
  },
  {
    id: 'dnk-munkebo',
    name: 'MUNKEBO',
    flag: 'DNK',
  },
  {
    id: 'dnk-nexo',
    name: 'NEXO',
    flag: 'DNK',
  },
  {
    id: 'dnk-niva',
    name: 'NIVA',
    flag: 'DNK',
  },
  {
    id: 'dnk-nyborg',
    name: 'NYBORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-nykobingmors',
    name: 'NYKOBING MORS',
    flag: 'DNK',
  },
  {
    id: 'dnk-odense',
    name: 'ODENSE',
    flag: 'DNK',
  },
  {
    id: 'dnk-osterbyhavn',
    name: 'OSTERBYHAVN',
    flag: 'DNK',
  },
  {
    id: 'dnk-randers',
    name: 'RANDERS',
    flag: 'DNK',
  },
  {
    id: 'dnk-rodvig',
    name: 'RODVIG',
    flag: 'DNK',
  },
  {
    id: 'dnk-roedbyhavn',
    name: 'ROEDBYHAVN',
    flag: 'DNK',
  },
  {
    id: 'dnk-roenne',
    name: 'ROENNE',
    flag: 'DNK',
  },
  {
    id: 'dnk-rorvig',
    name: 'RORVIG',
    flag: 'DNK',
  },
  {
    id: 'dnk-saeby',
    name: 'SAEBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-skaelskor',
    name: 'SKAELSKOR',
    flag: 'DNK',
  },
  {
    id: 'dnk-skive',
    name: 'SKIVE',
    flag: 'DNK',
  },
  {
    id: 'dnk-snekkersten',
    name: 'SNEKKERSTEN',
    flag: 'DNK',
  },
  {
    id: 'dnk-soeby',
    name: 'SOEBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-sonderborg',
    name: 'SONDERBORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-sonderby',
    name: 'SONDERBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-stenore',
    name: 'STENORE',
    flag: 'DNK',
  },
  {
    id: 'dnk-stevnspier',
    name: 'STEVNS PIER',
    flag: 'DNK',
  },
  {
    id: 'dnk-stigsnaes',
    name: 'STIGSNAES',
    flag: 'DNK',
  },
  {
    id: 'dnk-svendborg',
    name: 'SVENDBORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-thisted',
    name: 'THISTED',
    flag: 'DNK',
  },
  {
    id: 'dnk-thorsminde',
    name: 'THORSMINDE',
    flag: 'DNK',
  },
  {
    id: 'dnk-thuroby',
    name: 'THURO BY',
    flag: 'DNK',
  },
  {
    id: 'dnk-tunoby',
    name: 'TUNOBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-tyrafield',
    name: 'TYRA FIELD',
    flag: 'DNK',
  },
  {
    id: 'dnk-vang',
    name: 'VANG',
    flag: 'DNK',
  },
  {
    id: 'dnk-vejle',
    name: 'VEJLE',
    flag: 'DNK',
  },
  {
    id: 'dnk-vordingborg',
    name: 'VORDINGBORG',
    flag: 'DNK',
  },
  {
    id: 'dom-aties',
    name: 'ATIES',
    flag: 'DOM',
  },
  {
    id: 'dom-barahona',
    name: 'BARAHONA',
    flag: 'DOM',
  },
  {
    id: 'dom-bocachica',
    name: 'BOCA CHICA',
    flag: 'DOM',
  },
  {
    id: 'dom-caborojo',
    name: 'CABO ROJO',
    flag: 'DOM',
  },
  {
    id: 'dom-caucedo',
    name: 'CAUCEDO',
    flag: 'DOM',
  },
  {
    id: 'dom-laromana',
    name: 'LA ROMANA',
    flag: 'DOM',
  },
  {
    id: 'dom-lascalderas',
    name: 'LAS CALDERAS',
    flag: 'DOM',
  },
  {
    id: 'dom-ocoabay',
    name: 'OCOA BAY',
    flag: 'DOM',
  },
  {
    id: 'dom-puertoplata',
    name: 'PUERTO PLATA',
    flag: 'DOM',
  },
  {
    id: 'dom-puertoviejo',
    name: 'PUERTO VIEJO',
    flag: 'DOM',
  },
  {
    id: 'dom-riohaina',
    name: 'RIO HAINA',
    flag: 'DOM',
  },
  {
    id: 'dom-samana',
    name: 'SAMANA',
    flag: 'DOM',
  },
  {
    id: 'dom-sanpedrodemacoris',
    name: 'SAN PEDRO DE MACORIS',
    flag: 'DOM',
  },
  {
    id: 'dom-santodomingo',
    name: 'SANTO DOMINGO',
    flag: 'DOM',
  },
  {
    id: 'dza-algiers',
    name: 'ALGIERS',
    flag: 'DZA',
  },
  {
    id: 'dza-annaba',
    name: 'ANNABA',
    flag: 'DZA',
  },
  {
    id: 'dza-arzew',
    name: 'ARZEW',
    flag: 'DZA',
  },
  {
    id: 'dza-bejaia',
    name: 'BEJAIA',
    flag: 'DZA',
  },
  {
    id: 'dza-djen-djen',
    name: 'DJEN-DJEN',
    flag: 'DZA',
  },
  {
    id: 'dza-djendjen',
    name: 'DJEN DJEN',
    flag: 'DZA',
  },
  {
    id: 'dza-ghazaouet',
    name: 'GHAZAOUET',
    flag: 'DZA',
  },
  {
    id: 'dza-jijel',
    name: 'JIJEL',
    flag: 'DZA',
  },
  {
    id: 'dza-skikda',
    name: 'SKIKDA',
    flag: 'DZA',
  },
  {
    id: 'dza-tenes',
    name: 'TENES',
    flag: 'DZA',
  },
  {
    id: 'egy-abughusun',
    name: 'ABU GHUSUN',
    flag: 'EGY',
  },
  {
    id: 'egy-abuqir',
    name: 'ABU QIR',
    flag: 'EGY',
  },
  {
    id: 'egy-ainsukhna',
    name: 'AIN SUKHNA',
    flag: 'EGY',
  },
  {
    id: 'egy-aladabiyah',
    name: 'AL ADABIYAH',
    flag: 'EGY',
  },
  {
    id: 'egy-alexandria',
    name: 'ALEXANDRIA',
    flag: 'EGY',
  },
  {
    id: 'egy-damietta',
    name: 'DAMIETTA',
    flag: 'EGY',
  },
  {
    id: 'egy-el-adabiyah',
    name: 'EL-ADABIYAH',
    flag: 'EGY',
  },
  {
    id: 'egy-elarish',
    name: 'ELARISH',
    flag: 'EGY',
  },
  {
    id: 'egy-elgouna',
    name: 'EL GOUNA',
    flag: 'EGY',
  },
  {
    id: 'egy-elhamraoilterminal',
    name: 'EL HAMRA OIL TERMINAL',
    flag: 'EGY',
  },
  {
    id: 'egy-eltor',
    name: 'EL TOR',
    flag: 'EGY',
  },
  {
    id: 'egy-hamrawein',
    name: 'HAMRAWEIN',
    flag: 'EGY',
  },
  {
    id: 'egy-hurghada',
    name: 'HURGHADA',
    flag: 'EGY',
  },
  {
    id: 'egy-idku',
    name: 'IDKU',
    flag: 'EGY',
  },
  {
    id: 'egy-ismailiya',
    name: 'ISMAILIYA',
    flag: 'EGY',
  },
  {
    id: 'egy-maaddiya',
    name: 'MAADDIYA',
    flag: 'EGY',
  },
  {
    id: 'egy-rasabuzanimah',
    name: 'RAS ABU ZANIMAH',
    flag: 'EGY',
  },
  {
    id: 'egy-rasgharib',
    name: 'RAS GHARIB',
    flag: 'EGY',
  },
  {
    id: 'egy-rasshukhier',
    name: 'RAS SHUKHIER',
    flag: 'EGY',
  },
  {
    id: 'egy-safaga',
    name: 'SAFAGA',
    flag: 'EGY',
  },
  {
    id: 'egy-sidikerir',
    name: 'SIDI KERIR',
    flag: 'EGY',
  },
  {
    id: 'egy-sokhna',
    name: 'SOKHNA',
    flag: 'EGY',
  },
  {
    id: 'egy-suezport',
    name: 'SUEZ PORT',
    flag: 'EGY',
  },
  {
    id: 'egy-wadifeiran',
    name: 'WADI FEIRAN',
    flag: 'EGY',
  },
  {
    id: 'egy-zeitbay',
    name: 'ZEIT BAY',
    flag: 'EGY',
  },
  {
    id: 'eri-assab',
    name: 'ASSAB',
    flag: 'ERI',
  },
  {
    id: 'eri-massawa',
    name: 'MASSAWA',
    flag: 'ERI',
  },
  {
    id: 'esh-laayoune',
    name: 'LAAYOUNE',
    flag: 'ESH',
  },
  {
    id: 'esp-adra',
    name: 'ADRA',
    flag: 'ESP',
  },
  {
    id: 'esp-aguadulce',
    name: 'AGUADULCE',
    flag: 'ESP',
  },
  {
    id: 'esp-aguilas',
    name: 'AGUILAS',
    flag: 'ESP',
  },
  {
    id: 'esp-ailladeons',
    name: 'A ILLA DE ONS',
    flag: 'ESP',
  },
  {
    id: 'esp-alcaidesa',
    name: 'ALCAIDESA',
    flag: 'ESP',
  },
  {
    id: 'esp-alcanar',
    name: 'ALCANAR',
    flag: 'ESP',
  },
  {
    id: 'esp-alcudia',
    name: 'ALCUDIA',
    flag: 'ESP',
  },
  {
    id: 'esp-alicante',
    name: 'ALICANTE',
    flag: 'ESP',
  },
  {
    id: 'esp-almeria',
    name: 'ALMERIA',
    flag: 'ESP',
  },
  {
    id: 'esp-altea',
    name: 'ALTEA',
    flag: 'ESP',
  },
  {
    id: 'esp-arenysdemar',
    name: 'ARENYS DE MAR',
    flag: 'ESP',
  },
  {
    id: 'esp-ares',
    name: 'ARES',
    flag: 'ESP',
  },
  {
    id: 'esp-argineguin',
    name: 'ARGINEGUIN',
    flag: 'ESP',
  },
  {
    id: 'esp-arinaga',
    name: 'ARINAGA',
    flag: 'ESP',
  },
  {
    id: 'esp-arrecife',
    name: 'ARRECIFE',
    flag: 'ESP',
  },
  {
    id: 'esp-aviles',
    name: 'AVILES',
    flag: 'ESP',
  },
  {
    id: 'esp-badalona',
    name: 'BADALONA',
    flag: 'ESP',
  },
  {
    id: 'esp-bahiadefornells',
    name: 'BAHIA DE FORNELLS',
    flag: 'ESP',
  },
  {
    id: 'esp-baiona',
    name: 'BAIONA',
    flag: 'ESP',
  },
  {
    id: 'esp-barcelona',
    name: 'BARCELONA',
    flag: 'ESP',
  },
  {
    id: 'esp-bermeo',
    name: 'BERMEO',
    flag: 'ESP',
  },
  {
    id: 'esp-bilbao',
    name: 'BILBAO',
    flag: 'ESP',
  },
  {
    id: 'esp-blanes',
    name: 'BLANES',
    flag: 'ESP',
  },
  {
    id: 'esp-bueu',
    name: 'BUEU',
    flag: 'ESP',
  },
  {
    id: 'esp-burela',
    name: 'BURELA',
    flag: 'ESP',
  },
  {
    id: 'esp-burriana',
    name: 'BURRIANA',
    flag: 'ESP',
  },
  {
    id: "esp-calad'or",
    name: "CALA D'OR",
    flag: 'ESP',
  },
  {
    id: 'esp-calallonga',
    name: 'CALA LLONGA',
    flag: 'ESP',
  },
  {
    id: 'esp-calaratjada',
    name: 'CALA RATJADA',
    flag: 'ESP',
  },
  {
    id: 'esp-caletadevelez',
    name: 'CALETA DE VELEZ',
    flag: 'ESP',
  },
  {
    id: 'esp-calpe',
    name: 'CALPE',
    flag: 'ESP',
  },
  {
    id: 'esp-camarinas',
    name: 'CAMARINAS',
    flag: 'ESP',
  },
  {
    id: 'esp-cambrils',
    name: 'CAMBRILS',
    flag: 'ESP',
  },
  {
    id: 'esp-campello',
    name: 'CAMPELLO',
    flag: 'ESP',
  },
  {
    id: 'esp-canpastilla',
    name: 'CAN PASTILLA',
    flag: 'ESP',
  },
  {
    id: 'esp-carboneras',
    name: 'CARBONERAS',
    flag: 'ESP',
  },
  {
    id: 'esp-carino',
    name: 'CARINO',
    flag: 'ESP',
  },
  {
    id: 'esp-castellon',
    name: 'CASTELLON',
    flag: 'ESP',
  },
  {
    id: 'esp-castro-urdiales',
    name: 'CASTRO-URDIALES',
    flag: 'ESP',
  },
  {
    id: 'esp-cedeira',
    name: 'CEDEIRA',
    flag: 'ESP',
  },
  {
    id: 'esp-celeiro',
    name: 'CELEIRO',
    flag: 'ESP',
  },
  {
    id: 'esp-chipiona',
    name: 'CHIPIONA',
    flag: 'ESP',
  },
  {
    id: 'esp-ciutadella',
    name: 'CIUTADELLA',
    flag: 'ESP',
  },
  {
    id: 'esp-corcubion',
    name: 'CORCUBION',
    flag: 'ESP',
  },
  {
    id: 'esp-corralejo',
    name: 'CORRALEJO',
    flag: 'ESP',
  },
  {
    id: 'esp-coruna',
    name: 'CORUNA',
    flag: 'ESP',
  },
  {
    id: 'esp-denia',
    name: 'DENIA',
    flag: 'ESP',
  },
  {
    id: 'esp-elastillero',
    name: 'EL ASTILLERO',
    flag: 'ESP',
  },
  {
    id: 'esp-elferrol',
    name: 'EL FERROL',
    flag: 'ESP',
  },
  {
    id: 'esp-elmasnou',
    name: 'EL MASNOU',
    flag: 'ESP',
  },
  {
    id: 'esp-elpajar',
    name: 'EL PAJAR',
    flag: 'ESP',
  },
  {
    id: 'esp-fene',
    name: 'FENE',
    flag: 'ESP',
  },
  {
    id: 'esp-fisterra',
    name: 'FISTERRA',
    flag: 'ESP',
  },
  {
    id: 'esp-formentera',
    name: 'FORMENTERA',
    flag: 'ESP',
  },
  {
    id: 'esp-fuengirola',
    name: 'FUENGIROLA',
    flag: 'ESP',
  },
  {
    id: 'esp-fuenterrabia',
    name: 'FUENTERRABIA',
    flag: 'ESP',
  },
  {
    id: 'esp-gandia',
    name: 'GANDIA',
    flag: 'ESP',
  },
  {
    id: 'esp-garrucha',
    name: 'GARRUCHA',
    flag: 'ESP',
  },
  {
    id: 'esp-gijon',
    name: 'GIJON',
    flag: 'ESP',
  },
  {
    id: 'esp-grantarajal',
    name: 'GRAN TARAJAL',
    flag: 'ESP',
  },
  {
    id: 'esp-grove',
    name: 'GROVE',
    flag: 'ESP',
  },
  {
    id: 'esp-guetaria',
    name: 'GUETARIA',
    flag: 'ESP',
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
    id: 'esp-illaconillera',
    name: 'ILLA CONILLERA',
    flag: 'ESP',
  },
  {
    id: 'esp-islacristina',
    name: 'ISLA CRISTINA',
    flag: 'ESP',
  },
  {
    id: 'esp-javea',
    name: 'JAVEA',
    flag: 'ESP',
  },
  {
    id: "esp-l'estartit",
    name: "L'ESTARTIT",
    flag: 'ESP',
  },
  {
    id: 'esp-lage',
    name: 'LAGE',
    flag: 'ESP',
  },
  {
    id: 'esp-lagomera',
    name: 'LA GOMERA',
    flag: 'ESP',
  },
  {
    id: 'esp-lapalma',
    name: 'LA PALMA',
    flag: 'ESP',
  },
  {
    id: 'esp-lapuntilla',
    name: 'LA PUNTILLA',
    flag: 'ESP',
  },
  {
    id: 'esp-larapita',
    name: 'LA RAPITA',
    flag: 'ESP',
  },
  {
    id: 'esp-laredo',
    name: 'LAREDO',
    flag: 'ESP',
  },
  {
    id: 'esp-lascoloradas',
    name: 'LAS COLORADAS',
    flag: 'ESP',
  },
  {
    id: 'esp-lasgalletas',
    name: 'LAS GALLETAS',
    flag: 'ESP',
  },
  {
    id: 'esp-lavilavillajoyosa',
    name: 'LA VILA VILLAJOYOSA',
    flag: 'ESP',
  },
  {
    id: 'esp-lesbotigues',
    name: 'LES BOTIGUES',
    flag: 'ESP',
  },
  {
    id: 'esp-llanca',
    name: 'LLANCA',
    flag: 'ESP',
  },
  {
    id: 'esp-loscaideros',
    name: 'LOS CAIDEROS',
    flag: 'ESP',
  },
  {
    id: 'esp-loscristianos',
    name: 'LOS CRISTIANOS',
    flag: 'ESP',
  },
  {
    id: 'esp-mahon',
    name: 'MAHON',
    flag: 'ESP',
  },
  {
    id: 'esp-malaga',
    name: 'MALAGA',
    flag: 'ESP',
  },
  {
    id: 'esp-malpica',
    name: 'MALPICA',
    flag: 'ESP',
  },
  {
    id: 'esp-marbella',
    name: 'MARBELLA',
    flag: 'ESP',
  },
  {
    id: 'esp-mataro',
    name: 'MATARO',
    flag: 'ESP',
  },
  {
    id: 'esp-mazarron',
    name: 'MAZARRON',
    flag: 'ESP',
  },
  {
    id: 'esp-moraira',
    name: 'MORAIRA',
    flag: 'ESP',
  },
  {
    id: 'esp-morrodeljable',
    name: 'MORRO DEL JABLE',
    flag: 'ESP',
  },
  {
    id: 'esp-motril',
    name: 'MOTRIL',
    flag: 'ESP',
  },
  {
    id: 'esp-mugia',
    name: 'MUGIA',
    flag: 'ESP',
  },
  {
    id: 'esp-muros',
    name: 'MUROS',
    flag: 'ESP',
  },
  {
    id: 'esp-mutriku',
    name: 'MUTRIKU',
    flag: 'ESP',
  },
  {
    id: 'esp-nerga',
    name: 'NERGA',
    flag: 'ESP',
  },
  {
    id: 'esp-ondarroa',
    name: 'ONDARROA',
    flag: 'ESP',
  },
  {
    id: 'esp-orio',
    name: 'ORIO',
    flag: 'ESP',
  },
  {
    id: 'esp-palamos',
    name: 'PALAMOS',
    flag: 'ESP',
  },
  {
    id: 'esp-palmademallorca',
    name: 'PALMA DE MALLORCA',
    flag: 'ESP',
  },
  {
    id: 'esp-pasitoblanco',
    name: 'PASITO BLANCO',
    flag: 'ESP',
  },
  {
    id: 'esp-pedropinatar',
    name: 'PEDRO PINATAR',
    flag: 'ESP',
  },
  {
    id: 'esp-peniscola',
    name: 'PENISCOLA',
    flag: 'ESP',
  },
  {
    id: 'esp-playadefanabe',
    name: 'PLAYA DE FANABE',
    flag: 'ESP',
  },
  {
    id: 'esp-playadesantiago',
    name: 'PLAYA DE SANTIAGO',
    flag: 'ESP',
  },
  {
    id: 'esp-playasanjuan',
    name: 'PLAYA SAN JUAN',
    flag: 'ESP',
  },
  {
    id: 'esp-portalsnous',
    name: 'PORTALS NOUS',
    flag: 'ESP',
  },
  {
    id: 'esp-portbalis',
    name: 'PORT BALIS',
    flag: 'ESP',
  },
  {
    id: 'esp-portdandratx',
    name: 'PORT DANDRATX',
    flag: 'ESP',
  },
  {
    id: 'esp-portdepollenca',
    name: 'PORT DE POLLENCA',
    flag: 'ESP',
  },
  {
    id: 'esp-portdesantmiguel',
    name: 'PORT DE SANT MIGUEL',
    flag: 'ESP',
  },
  {
    id: 'esp-portdesoller',
    name: 'PORT DE SOLLER',
    flag: 'ESP',
  },
  {
    id: 'esp-portocristo',
    name: 'PORTO CRISTO',
    flag: 'ESP',
  },
  {
    id: 'esp-portolimpic',
    name: 'PORT OLIMPIC',
    flag: 'ESP',
  },
  {
    id: 'esp-premiademar',
    name: 'PREMIA DE MAR',
    flag: 'ESP',
  },
  {
    id: 'esp-puertocalero',
    name: 'PUERTO CALERO',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodejosebanus',
    name: 'PUERTO DE JOSE BANUS',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodelasnieves',
    name: 'PUERTO DE LAS NIEVES',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodelrosario',
    name: 'PUERTO DEL ROSARIO',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodeportivoalm',
    name: 'PUERTO DEPORTIVO ALM',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodesalinetas',
    name: 'PUERTO DE SALINETAS',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodesantiago',
    name: 'PUERTO DE SANTIAGO',
    flag: 'ESP',
  },
  {
    id: 'esp-puertorico',
    name: 'PUERTO RICO',
    flag: 'ESP',
  },
  {
    id: 'esp-puntalangosteira',
    name: 'PUNTA LANGOSTEIRA',
    flag: 'ESP',
  },
  {
    id: 'esp-ribadeo',
    name: 'RIBADEO',
    flag: 'ESP',
  },
  {
    id: 'esp-roquetasdemar',
    name: 'ROQUETAS DE MAR',
    flag: 'ESP',
  },
  {
    id: 'esp-roses',
    name: 'ROSES',
    flag: 'ESP',
  },
  {
    id: 'esp-rota',
    name: 'ROTA',
    flag: 'ESP',
  },
  {
    id: "esp-s'arenal",
    name: "S'ARENAL",
    flag: 'ESP',
  },
  {
    id: 'esp-sacalobra',
    name: 'SA CALOBRA',
    flag: 'ESP',
  },
  {
    id: 'esp-sada',
    name: 'SADA',
    flag: 'ESP',
  },
  {
    id: 'esp-sagunto',
    name: 'SAGUNTO',
    flag: 'ESP',
  },
  {
    id: 'esp-sanadriandebesos',
    name: 'SAN ADRIAN DE BESOS',
    flag: 'ESP',
  },
  {
    id: 'esp-sanandres',
    name: 'SAN ANDRES',
    flag: 'ESP',
  },
  {
    id: 'esp-sancarlos',
    name: 'SAN CARLOS',
    flag: 'ESP',
  },
  {
    id: 'esp-sanciprian',
    name: 'SAN CIPRIAN',
    flag: 'ESP',
  },
  {
    id: 'esp-sanfeliudeguixols',
    name: 'SAN FELIU DE GUIXOLS',
    flag: 'ESP',
  },
  {
    id: 'esp-sanfernando',
    name: 'SAN FERNANDO',
    flag: 'ESP',
  },
  {
    id: 'esp-sanlucardebarra',
    name: 'SANLUCAR DE BARRA',
    flag: 'ESP',
  },
  {
    id: 'esp-sansebastian',
    name: 'SAN SEBASTIAN',
    flag: 'ESP',
  },
  {
    id: 'esp-santamaria',
    name: 'SANTA MARIA',
    flag: 'ESP',
  },
  {
    id: 'esp-santantoni',
    name: 'SANT ANTONI',
    flag: 'ESP',
  },
  {
    id: 'esp-santapola',
    name: 'SANTA POLA',
    flag: 'ESP',
  },
  {
    id: 'esp-santaponsa',
    name: 'SANTA PONSA',
    flag: 'ESP',
  },
  {
    id: 'esp-santona',
    name: 'SANTONA',
    flag: 'ESP',
  },
  {
    id: 'esp-sanxenxo',
    name: 'SANXENXO',
    flag: 'ESP',
  },
  {
    id: 'esp-sevilla',
    name: 'SEVILLA',
    flag: 'ESP',
  },
  {
    id: 'esp-sitges',
    name: 'SITGES',
    flag: 'ESP',
  },
  {
    id: 'esp-tabarca',
    name: 'TABARCA',
    flag: 'ESP',
  },
  {
    id: 'esp-tarajal',
    name: 'TARAJAL',
    flag: 'ESP',
  },
  {
    id: 'esp-tarifa',
    name: 'TARIFA',
    flag: 'ESP',
  },
  {
    id: 'esp-tarragona',
    name: 'TARRAGONA',
    flag: 'ESP',
  },
  {
    id: 'esp-thomasmaestre',
    name: 'THOMAS MAESTRE',
    flag: 'ESP',
  },
  {
    id: 'esp-torreguadiaro',
    name: 'TORREGUADIARO',
    flag: 'ESP',
  },
  {
    id: 'esp-torrevieja',
    name: 'TORREVIEJA',
    flag: 'ESP',
  },
  {
    id: 'esp-valencia',
    name: 'VALENCIA',
    flag: 'ESP',
  },
  {
    id: 'esp-varaderodebenalmad',
    name: 'VARADERO DE BENALMAD',
    flag: 'ESP',
  },
  {
    id: 'esp-vilanova',
    name: 'VILANOVA',
    flag: 'ESP',
  },
  {
    id: 'esp-villagarcia',
    name: 'VILLAGARCIA',
    flag: 'ESP',
  },
  {
    id: 'esp-vinaros',
    name: 'VINAROS',
    flag: 'ESP',
  },
  {
    id: 'esp-zumaya',
    name: 'ZUMAYA',
    flag: 'ESP',
  },
  {
    id: 'est-abrukaroomassaare',
    name: 'ABRUKA ROOMASSAARE',
    flag: 'EST',
  },
  {
    id: 'est-dirhami',
    name: 'DIRHAMI',
    flag: 'EST',
  },
  {
    id: 'est-haapsalu',
    name: 'HAAPSALU',
    flag: 'EST',
  },
  {
    id: 'est-kardla',
    name: 'KARDLA',
    flag: 'EST',
  },
  {
    id: 'est-kelnaseleppneeme',
    name: 'KELNASE LEPPNEEME',
    flag: 'EST',
  },
  {
    id: 'est-kunda',
    name: 'KUNDA',
    flag: 'EST',
  },
  {
    id: 'est-lehtma',
    name: 'LEHTMA',
    flag: 'EST',
  },
  {
    id: 'est-loksa',
    name: 'LOKSA',
    flag: 'EST',
  },
  {
    id: 'est-miiduranna',
    name: 'MIIDURANNA',
    flag: 'EST',
  },
  {
    id: 'est-montu',
    name: 'MONTU',
    flag: 'EST',
  },
  {
    id: 'est-muuga',
    name: 'MUUGA',
    flag: 'EST',
  },
  {
    id: 'est-paldiski',
    name: 'PALDISKI',
    flag: 'EST',
  },
  {
    id: 'est-parnu',
    name: 'PARNU',
    flag: 'EST',
  },
  {
    id: 'est-ringsu',
    name: 'RINGSU',
    flag: 'EST',
  },
  {
    id: 'est-rohukula',
    name: 'ROHUKULA',
    flag: 'EST',
  },
  {
    id: 'est-roomassaare',
    name: 'ROOMASSAARE',
    flag: 'EST',
  },
  {
    id: 'est-sillamae',
    name: 'SILLAMAE',
    flag: 'EST',
  },
  {
    id: 'est-veere',
    name: 'VEERE',
    flag: 'EST',
  },
  {
    id: 'est-virtsu',
    name: 'VIRTSU',
    flag: 'EST',
  },
  {
    id: 'fin-ajos',
    name: 'AJOS',
    flag: 'FIN',
  },
  {
    id: 'fin-baatvik',
    name: 'BAATVIK',
    flag: 'FIN',
  },
  {
    id: 'fin-ekenas',
    name: 'EKENAS',
    flag: 'FIN',
  },
  {
    id: 'fin-hamina',
    name: 'HAMINA',
    flag: 'FIN',
  },
  {
    id: 'fin-hanko',
    name: 'HANKO',
    flag: 'FIN',
  },
  {
    id: 'fin-helsinki',
    name: 'HELSINKI',
    flag: 'FIN',
  },
  {
    id: 'fin-inkoo',
    name: 'INKOO',
    flag: 'FIN',
  },
  {
    id: 'fin-kalajoki',
    name: 'KALAJOKI',
    flag: 'FIN',
  },
  {
    id: 'fin-kaskinen',
    name: 'KASKINEN',
    flag: 'FIN',
  },
  {
    id: 'fin-kokkola',
    name: 'KOKKOLA',
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
    id: 'fin-mantyluoto',
    name: 'MANTYLUOTO',
    flag: 'FIN',
  },
  {
    id: 'fin-mariehamn',
    name: 'MARIEHAMN',
    flag: 'FIN',
  },
  {
    id: 'fin-mustola',
    name: 'MUSTOLA',
    flag: 'FIN',
  },
  {
    id: 'fin-naantali',
    name: 'NAANTALI',
    flag: 'FIN',
  },
  {
    id: 'fin-olkiluoto',
    name: 'OLKILUOTO',
    flag: 'FIN',
  },
  {
    id: 'fin-oulu',
    name: 'OULU',
    flag: 'FIN',
  },
  {
    id: 'fin-pargas',
    name: 'PARGAS',
    flag: 'FIN',
  },
  {
    id: 'fin-pietarsaari',
    name: 'PIETARSAARI',
    flag: 'FIN',
  },
  {
    id: 'fin-pori',
    name: 'PORI',
    flag: 'FIN',
  },
  {
    id: 'fin-porvoo',
    name: 'PORVOO',
    flag: 'FIN',
  },
  {
    id: 'fin-rauma',
    name: 'RAUMA',
    flag: 'FIN',
  },
  {
    id: 'fin-reposaari',
    name: 'REPOSAARI',
    flag: 'FIN',
  },
  {
    id: 'fin-turku',
    name: 'TURKU',
    flag: 'FIN',
  },
  {
    id: 'fin-uusikaupunki',
    name: 'UUSIKAUPUNKI',
    flag: 'FIN',
  },
  {
    id: 'fin-vaasa',
    name: 'VAASA',
    flag: 'FIN',
  },
  {
    id: 'fin-vuosaari',
    name: 'VUOSAARI',
    flag: 'FIN',
  },
  {
    id: 'fji-aven',
    name: 'AVEN',
    flag: 'FJI',
  },
  {
    id: 'fji-maololailaiisland',
    name: 'MAOLO LAILAI ISLAND',
    flag: 'FJI',
  },
  {
    id: 'fji-nadi',
    name: 'NADI',
    flag: 'FJI',
  },
  {
    id: 'fji-savusavu',
    name: 'SAVUSAVU',
    flag: 'FJI',
  },
  {
    id: 'fji-vuda',
    name: 'VUDA',
    flag: 'FJI',
  },
  {
    id: 'flk-mareharbour',
    name: 'MARE HARBOUR',
    flag: 'FLK',
  },
  {
    id: 'fra-airesurlalys',
    name: 'AIRE SUR LA LYS',
    flag: 'FRA',
  },
  {
    id: 'fra-ajaccio',
    name: 'AJACCIO',
    flag: 'FRA',
  },
  {
    id: 'fra-ambes',
    name: 'AMBES',
    flag: 'FRA',
  },
  {
    id: 'fra-antibes',
    name: 'ANTIBES',
    flag: 'FRA',
  },
  {
    id: 'fra-antifer',
    name: 'ANTIFER',
    flag: 'FRA',
  },
  {
    id: 'fra-arcachon',
    name: 'ARCACHON',
    flag: 'FRA',
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
    id: 'fra-arques',
    name: 'ARQUES',
    flag: 'FRA',
  },
  {
    id: 'fra-audierne',
    name: 'AUDIERNE',
    flag: 'FRA',
  },
  {
    id: 'fra-bandol',
    name: 'BANDOL',
    flag: 'FRA',
  },
  {
    id: 'fra-bastia',
    name: 'BASTIA',
    flag: 'FRA',
  },
  {
    id: 'fra-bayonne',
    name: 'BAYONNE',
    flag: 'FRA',
  },
  {
    id: 'fra-benodet',
    name: 'BENODET',
    flag: 'FRA',
  },
  {
    id: 'fra-berre',
    name: 'BERRE',
    flag: 'FRA',
  },
  {
    id: 'fra-blaye',
    name: 'BLAYE',
    flag: 'FRA',
  },
  {
    id: 'fra-bonifacio',
    name: 'BONIFACIO',
    flag: 'FRA',
  },
  {
    id: 'fra-bordeaux',
    name: 'BORDEAUX',
    flag: 'FRA',
  },
  {
    id: 'fra-boulogne-sur-mer',
    name: 'BOULOGNE-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-caen',
    name: 'CAEN',
    flag: 'FRA',
  },
  {
    id: 'fra-calais',
    name: 'CALAIS',
    flag: 'FRA',
  },
  {
    id: 'fra-calvi',
    name: 'CALVI',
    flag: 'FRA',
  },
  {
    id: 'fra-camaret-sur-mer',
    name: 'CAMARET-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-campomoro',
    name: 'CAMPOMORO',
    flag: 'FRA',
  },
  {
    id: 'fra-canet-en-roussillon',
    name: 'CANET-EN-ROUSSILLON',
    flag: 'FRA',
  },
  {
    id: 'fra-cannes',
    name: 'CANNES',
    flag: 'FRA',
  },
  {
    id: 'fra-capbreton',
    name: 'CAPBRETON',
    flag: 'FRA',
  },
  {
    id: 'fra-carnonplage',
    name: 'CARNON PLAGE',
    flag: 'FRA',
  },
  {
    id: 'fra-carry-le-rouet',
    name: 'CARRY-LE-ROUET',
    flag: 'FRA',
  },
  {
    id: 'fra-carteret',
    name: 'CARTERET',
    flag: 'FRA',
  },
  {
    id: 'fra-cassis',
    name: 'CASSIS',
    flag: 'FRA',
  },
  {
    id: 'fra-cavalaire-sur-mer',
    name: 'CAVALAIRE-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-cavallo',
    name: 'CAVALLO',
    flag: 'FRA',
  },
  {
    id: 'fra-cherbourg',
    name: 'CHERBOURG',
    flag: 'FRA',
  },
  {
    id: 'fra-comines',
    name: 'COMINES',
    flag: 'FRA',
  },
  {
    id: 'fra-concarneau',
    name: 'CONCARNEAU',
    flag: 'FRA',
  },
  {
    id: 'fra-conde',
    name: 'CONDE',
    flag: 'FRA',
  },
  {
    id: 'fra-courseulles-sur-mer',
    name: 'COURSEULLES-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-dielette',
    name: 'DIELETTE',
    flag: 'FRA',
  },
  {
    id: 'fra-dieppe',
    name: 'DIEPPE',
    flag: 'FRA',
  },
  {
    id: 'fra-divessurmer',
    name: 'DIVES SUR MER',
    flag: 'FRA',
  },
  {
    id: 'fra-donges',
    name: 'DONGES',
    flag: 'FRA',
  },
  {
    id: 'fra-douarnenez',
    name: 'DOUARNENEZ',
    flag: 'FRA',
  },
  {
    id: 'fra-dunkirk',
    name: 'DUNKIRK',
    flag: 'FRA',
  },
  {
    id: 'fra-etel',
    name: 'ETEL',
    flag: 'FRA',
  },
  {
    id: 'fra-fecamp',
    name: 'FECAMP',
    flag: 'FRA',
  },
  {
    id: 'fra-fos-sur-mer',
    name: 'FOS-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-frontignan',
    name: 'FRONTIGNAN',
    flag: 'FRA',
  },
  {
    id: 'fra-girolata',
    name: 'GIROLATA',
    flag: 'FRA',
  },
  {
    id: 'fra-golfejuan',
    name: 'GOLFE JUAN',
    flag: 'FRA',
  },
  {
    id: 'fra-grand-couronne',
    name: 'GRAND-COURONNE',
    flag: 'FRA',
  },
  {
    id: 'fra-granville',
    name: 'GRANVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-groix',
    name: 'GROIX',
    flag: 'FRA',
  },
  {
    id: 'fra-guilvinec',
    name: 'GUILVINEC',
    flag: 'FRA',
  },
  {
    id: 'fra-hendaye',
    name: 'HENDAYE',
    flag: 'FRA',
  },
  {
    id: 'fra-hoedic',
    name: 'HOEDIC',
    flag: 'FRA',
  },
  {
    id: 'fra-honfleur',
    name: 'HONFLEUR',
    flag: 'FRA',
  },
  {
    id: 'fra-houat',
    name: 'HOUAT',
    flag: 'FRA',
  },
  {
    id: 'fra-hyeres',
    name: 'HYERES',
    flag: 'FRA',
  },
  {
    id: 'fra-iledaix',
    name: 'ILE DAIX',
    flag: 'FRA',
  },
  {
    id: 'fra-iledebatz',
    name: 'ILE DE BATZ',
    flag: 'FRA',
  },
  {
    id: 'fra-iledesein',
    name: 'ILE DE SEIN',
    flag: 'FRA',
  },
  {
    id: 'fra-ilesdufrioul',
    name: 'ILES DU FRIOUL',
    flag: 'FRA',
  },
  {
    id: 'fra-laciotat',
    name: 'LA CIOTAT',
    flag: 'FRA',
  },
  {
    id: 'fra-lacotiniere',
    name: 'LA COTINIERE',
    flag: 'FRA',
  },
  {
    id: 'fra-laforet-fouesnant',
    name: 'LA FORET-FOUESNANT',
    flag: 'FRA',
  },
  {
    id: 'fra-lagrande-motte',
    name: 'LA GRANDE-MOTTE',
    flag: 'FRA',
  },
  {
    id: 'fra-lanapoule',
    name: 'LA NAPOULE',
    flag: 'FRA',
  },
  {
    id: 'fra-landeda',
    name: 'LANDEDA',
    flag: 'FRA',
  },
  {
    id: 'fra-lanildut',
    name: 'LANILDUT',
    flag: 'FRA',
  },
  {
    id: 'fra-lapallice',
    name: 'LA PALLICE',
    flag: 'FRA',
  },
  {
    id: 'fra-larmor-baden',
    name: 'LARMOR-BADEN',
    flag: 'FRA',
  },
  {
    id: 'fra-larochelle',
    name: 'LA ROCHELLE',
    flag: 'FRA',
  },
  {
    id: 'fra-latrinite-sur-mer',
    name: 'LA TRINITE-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-laturballe',
    name: 'LA TURBALLE',
    flag: 'FRA',
  },
  {
    id: 'fra-lavera',
    name: 'LAVERA',
    flag: 'FRA',
  },
  {
    id: 'fra-lavezzi',
    name: 'LAVEZZI',
    flag: 'FRA',
  },
  {
    id: "fra-lecapd'agde",
    name: "LE CAP D'AGDE",
    flag: 'FRA',
  },
  {
    id: 'fra-leconquet',
    name: 'LE CONQUET',
    flag: 'FRA',
  },
  {
    id: 'fra-lecroisic',
    name: 'LE CROISIC',
    flag: 'FRA',
  },
  {
    id: 'fra-legrauduroi',
    name: 'LE GRAU DU ROI',
    flag: 'FRA',
  },
  {
    id: 'fra-lehavre',
    name: 'LE HAVRE',
    flag: 'FRA',
  },
  {
    id: 'fra-lelavandou',
    name: 'LE LAVANDOU',
    flag: 'FRA',
  },
  {
    id: 'fra-lepalais',
    name: 'LE PALAIS',
    flag: 'FRA',
  },
  {
    id: "fra-lessablesd'olonne",
    name: "LES SABLES D' OLONNE",
    flag: 'FRA',
  },
  {
    id: 'fra-letrait',
    name: 'LE TRAIT',
    flag: 'FRA',
  },
  {
    id: 'fra-letreport',
    name: 'LE TREPORT',
    flag: 'FRA',
  },
  {
    id: 'fra-leverdonsurmer',
    name: 'LE VERDON SUR MER',
    flag: 'FRA',
  },
  {
    id: 'fra-lilerousse',
    name: 'LILE ROUSSE',
    flag: 'FRA',
  },
  {
    id: 'fra-loctudy',
    name: 'LOCTUDY',
    flag: 'FRA',
  },
  {
    id: 'fra-lorient',
    name: 'LORIENT',
    flag: 'FRA',
  },
  {
    id: 'fra-lyon',
    name: 'LYON',
    flag: 'FRA',
  },
  {
    id: 'fra-marseille',
    name: 'MARSEILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-menton',
    name: 'MENTON',
    flag: 'FRA',
  },
  {
    id: 'fra-montoir',
    name: 'MONTOIR',
    flag: 'FRA',
  },
  {
    id: 'fra-nantes',
    name: 'NANTES',
    flag: 'FRA',
  },
  {
    id: 'fra-nice',
    name: 'NICE',
    flag: 'FRA',
  },
  {
    id: 'fra-ouessant',
    name: 'OUESSANT',
    flag: 'FRA',
  },
  {
    id: 'fra-ouistreham',
    name: 'OUISTREHAM',
    flag: 'FRA',
  },
  {
    id: 'fra-paimpol',
    name: 'PAIMPOL',
    flag: 'FRA',
  },
  {
    id: 'fra-palavas-les-flots',
    name: 'PALAVAS-LES-FLOTS',
    flag: 'FRA',
  },
  {
    id: 'fra-perros-guirec',
    name: 'PERROS-GUIREC',
    flag: 'FRA',
  },
  {
    id: 'fra-pinarellu',
    name: 'PINARELLU',
    flag: 'FRA',
  },
  {
    id: 'fra-piriac-sur-mer',
    name: 'PIRIAC-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-plougonvelin',
    name: 'PLOUGONVELIN',
    flag: 'FRA',
  },
  {
    id: 'fra-plougrescant',
    name: 'PLOUGRESCANT',
    flag: 'FRA',
  },
  {
    id: 'fra-pornic',
    name: 'PORNIC',
    flag: 'FRA',
  },
  {
    id: 'fra-pornichet',
    name: 'PORNICHET',
    flag: 'FRA',
  },
  {
    id: 'fra-porquerolles',
    name: 'PORQUEROLLES',
    flag: 'FRA',
  },
  {
    id: 'fra-port-en-bessin',
    name: 'PORT-EN-BESSIN',
    flag: 'FRA',
  },
  {
    id: 'fra-port-vendres',
    name: 'PORT-VENDRES',
    flag: 'FRA',
  },
  {
    id: 'fra-portducrouesty',
    name: 'PORT DU CROUESTY',
    flag: 'FRA',
  },
  {
    id: 'fra-portjerome',
    name: 'PORT JEROME',
    flag: 'FRA',
  },
  {
    id: 'fra-portjerome-sur-seine',
    name: 'PORT JEROME-SUR-SEINE',
    flag: 'FRA',
  },
  {
    id: 'fra-portlanouvelle',
    name: 'PORT LA NOUVELLE',
    flag: 'FRA',
  },
  {
    id: 'fra-portovecchio',
    name: 'PORTO VECCHIO',
    flag: 'FRA',
  },
  {
    id: 'fra-propriano',
    name: 'PROPRIANO',
    flag: 'FRA',
  },
  {
    id: 'fra-quiberon',
    name: 'QUIBERON',
    flag: 'FRA',
  },
  {
    id: 'fra-roccapina',
    name: 'ROCCAPINA',
    flag: 'FRA',
  },
  {
    id: 'fra-rochefort',
    name: 'ROCHEFORT',
    flag: 'FRA',
  },
  {
    id: 'fra-roquebrune-cap-martin',
    name: 'ROQUEBRUNE-CAP-MARTIN',
    flag: 'FRA',
  },
  {
    id: 'fra-roscanvel',
    name: 'ROSCANVEL',
    flag: 'FRA',
  },
  {
    id: 'fra-roscoff',
    name: 'ROSCOFF',
    flag: 'FRA',
  },
  {
    id: 'fra-rouen',
    name: 'ROUEN',
    flag: 'FRA',
  },
  {
    id: 'fra-royan',
    name: 'ROYAN',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-cast-le-guildo',
    name: 'SAINT-CAST-LE-GUILDO',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-cyprien',
    name: 'SAINT-CYPRIEN',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-cyr-sur-mer',
    name: 'SAINT-CYR-SUR-MER',
    flag: 'FRA',
  },
  {
    id: "fra-saint-denis-d'oleron",
    name: "SAINT-DENIS-D'OLERON",
    flag: 'FRA',
  },
  {
    id: 'fra-saint-gilles-croix-de-vie',
    name: 'SAINT-GILLES-CROIX-DE-VIE',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-jean-de-luz',
    name: 'SAINT-JEAN-DE-LUZ',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-laurent-du-var',
    name: 'SAINT-LAURENT-DU-VAR',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-martin-de-re',
    name: 'SAINT-MARTIN-DE-RE',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-pabu',
    name: 'SAINT-PABU',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-quay-portrieux',
    name: 'SAINT-QUAY-PORTRIEUX',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-raphael',
    name: 'SAINT-RAPHAEL',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-vaast-la-hougue',
    name: 'SAINT-VAAST-LA-HOUGUE',
    flag: 'FRA',
  },
  {
    id: 'fra-saint-valery-sur-somme',
    name: 'SAINT-VALERY-SUR-SOMME',
    flag: 'FRA',
  },
  {
    id: 'fra-saintbrieuc',
    name: 'SAINT BRIEUC',
    flag: 'FRA',
  },
  {
    id: 'fra-sainte-maxime',
    name: 'SAINTE-MAXIME',
    flag: 'FRA',
  },
  {
    id: 'fra-saintes-maries-de-la-mer',
    name: 'SAINTES-MARIES-DE-LA-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-saintflorent',
    name: 'SAINT FLORENT',
    flag: 'FRA',
  },
  {
    id: 'fra-saintguenole',
    name: 'SAINT GUENOLE',
    flag: 'FRA',
  },
  {
    id: 'fra-saintjeancapferrat',
    name: 'SAINTJEAN CAP FERRAT',
    flag: 'FRA',
  },
  {
    id: 'fra-saintlouisdurhone',
    name: 'SAINT LOUIS DU RHONE',
    flag: 'FRA',
  },
  {
    id: 'fra-saintmalo',
    name: 'SAINT MALO',
    flag: 'FRA',
  },
  {
    id: 'fra-saintmandrier',
    name: 'SAINT MANDRIER',
    flag: 'FRA',
  },
  {
    id: 'fra-saintmartin',
    name: 'SAINT MARTIN',
    flag: 'FRA',
  },
  {
    id: 'fra-saintnazaire',
    name: 'SAINT NAZAIRE',
    flag: 'FRA',
  },
  {
    id: 'fra-sainttropez',
    name: 'SAINT TROPEZ',
    flag: 'FRA',
  },
  {
    id: 'fra-salaise',
    name: 'SALAISE',
    flag: 'FRA',
  },
  {
    id: 'fra-salindegiraud',
    name: 'SALIN DE GIRAUD',
    flag: 'FRA',
  },
  {
    id: 'fra-sanary-sur-mer',
    name: 'SANARY-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fra-santamanza',
    name: 'SANT AMANZA',
    flag: 'FRA',
  },
  {
    id: 'fra-sete',
    name: 'SETE',
    flag: 'FRA',
  },
  {
    id: 'fra-tancarville',
    name: 'TANCARVILLE',
    flag: 'FRA',
  },
  {
    id: 'fra-toulon',
    name: 'TOULON',
    flag: 'FRA',
  },
  {
    id: 'fra-trebeurden',
    name: 'TREBEURDEN',
    flag: 'FRA',
  },
  {
    id: 'fra-tregastel',
    name: 'TREGASTEL',
    flag: 'FRA',
  },
  {
    id: 'fra-trouville-sur-mer',
    name: 'TROUVILLE-SUR-MER',
    flag: 'FRA',
  },
  {
    id: 'fro-eidi',
    name: 'EIDI',
    flag: 'FRO',
  },
  {
    id: 'fro-glyvrar',
    name: 'GLYVRAR',
    flag: 'FRO',
  },
  {
    id: 'fro-nordskala',
    name: 'NORDSKALA',
    flag: 'FRO',
  },
  {
    id: 'fro-oyri',
    name: 'OYRI',
    flag: 'FRO',
  },
  {
    id: 'fro-skali',
    name: 'SKALI',
    flag: 'FRO',
  },
  {
    id: 'gab-caplopez',
    name: 'CAP LOPEZ',
    flag: 'GAB',
  },
  {
    id: 'gab-etame',
    name: 'ETAME',
    flag: 'GAB',
  },
  {
    id: 'gab-gambaanchorage',
    name: 'GAMBA ANCHORAGE',
    flag: 'GAB',
  },
  {
    id: 'gab-libreville',
    name: 'LIBREVILLE',
    flag: 'GAB',
  },
  {
    id: "gab-m'byaoilterminal",
    name: "M'BYA OIL TERMINAL",
    flag: 'GAB',
  },
  {
    id: 'gab-oguendjoterminal',
    name: 'OGUENDJO TERMINAL',
    flag: 'GAB',
  },
  {
    id: 'gbr-aberdourbayanchorage',
    name: 'ABERDOUR BAY ANCHORAGE',
    flag: 'GBR',
  },
  {
    id: 'gbr-alderney',
    name: 'ALDERNEY',
    flag: 'GBR',
  },
  {
    id: 'gbr-amble',
    name: 'AMBLE',
    flag: 'GBR',
  },
  {
    id: 'gbr-arbroath',
    name: 'ARBROATH',
    flag: 'GBR',
  },
  {
    id: 'gbr-ardglass',
    name: 'ARDGLASS',
    flag: 'GBR',
  },
  {
    id: 'gbr-ardrossan',
    name: 'ARDROSSAN',
    flag: 'GBR',
  },
  {
    id: 'gbr-avonmouth',
    name: 'AVONMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-ayr',
    name: 'AYR',
    flag: 'GBR',
  },
  {
    id: 'gbr-ballycastle',
    name: 'BALLYCASTLE',
    flag: 'GBR',
  },
  {
    id: 'gbr-bangor',
    name: 'BANGOR',
    flag: 'GBR',
  },
  {
    id: 'gbr-barrowinfurness',
    name: 'BARROW IN FURNESS',
    flag: 'GBR',
  },
  {
    id: 'gbr-barry',
    name: 'BARRY',
    flag: 'GBR',
  },
  {
    id: 'gbr-beaucette',
    name: 'BEAUCETTE',
    flag: 'GBR',
  },
  {
    id: 'gbr-beaumaris',
    name: 'BEAUMARIS',
    flag: 'GBR',
  },
  {
    id: 'gbr-belfast',
    name: 'BELFAST',
    flag: 'GBR',
  },
  {
    id: 'gbr-berwick',
    name: 'BERWICK',
    flag: 'GBR',
  },
  {
    id: 'gbr-blyth',
    name: 'BLYTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-boston',
    name: 'BOSTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-braefoot',
    name: 'BRAEFOOT',
    flag: 'GBR',
  },
  {
    id: 'gbr-bridlington',
    name: 'BRIDLINGTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-brightlingsea',
    name: 'BRIGHTLINGSEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-brighton',
    name: 'BRIGHTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-brinian',
    name: 'BRINIAN',
    flag: 'GBR',
  },
  {
    id: 'gbr-brixham',
    name: 'BRIXHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-brodick',
    name: 'BRODICK',
    flag: 'GBR',
  },
  {
    id: 'gbr-bromborough',
    name: 'BROMBOROUGH',
    flag: 'GBR',
  },
  {
    id: 'gbr-burghead',
    name: 'BURGHEAD',
    flag: 'GBR',
  },
  {
    id: 'gbr-burnham-on-crouch',
    name: 'BURNHAM-ON-CROUCH',
    flag: 'GBR',
  },
  {
    id: 'gbr-burntisland',
    name: 'BURNTISLAND',
    flag: 'GBR',
  },
  {
    id: 'gbr-campbeltown',
    name: 'CAMPBELTOWN',
    flag: 'GBR',
  },
  {
    id: 'gbr-canna',
    name: 'CANNA',
    flag: 'GBR',
  },
  {
    id: 'gbr-cardiff',
    name: 'CARDIFF',
    flag: 'GBR',
  },
  {
    id: 'gbr-carrickfergus',
    name: 'CARRICKFERGUS',
    flag: 'GBR',
  },
  {
    id: 'gbr-castlebay',
    name: 'CASTLE BAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-chatham',
    name: 'CHATHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-christchurch',
    name: 'CHRISTCHURCH',
    flag: 'GBR',
  },
  {
    id: 'gbr-clydebank',
    name: 'CLYDEBANK',
    flag: 'GBR',
  },
  {
    id: 'gbr-colonsay',
    name: 'COLONSAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-conwy',
    name: 'CONWY',
    flag: 'GBR',
  },
  {
    id: 'gbr-corpach',
    name: 'CORPACH',
    flag: 'GBR',
  },
  {
    id: 'gbr-coverack',
    name: 'COVERACK',
    flag: 'GBR',
  },
  {
    id: 'gbr-cowes',
    name: 'COWES',
    flag: 'GBR',
  },
  {
    id: 'gbr-crinan',
    name: 'CRINAN',
    flag: 'GBR',
  },
  {
    id: 'gbr-dagenham',
    name: 'DAGENHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-dartmouth',
    name: 'DARTMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-douglas',
    name: 'DOUGLAS',
    flag: 'GBR',
  },
  {
    id: 'gbr-dover',
    name: 'DOVER',
    flag: 'GBR',
  },
  {
    id: 'gbr-dundee',
    name: 'DUNDEE',
    flag: 'GBR',
  },
  {
    id: 'gbr-dunvegan',
    name: 'DUNVEGAN',
    flag: 'GBR',
  },
  {
    id: 'gbr-eastbourne',
    name: 'EASTBOURNE',
    flag: 'GBR',
  },
  {
    id: 'gbr-eastham',
    name: 'EASTHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-ellesmere',
    name: 'ELLESMERE',
    flag: 'GBR',
  },
  {
    id: 'gbr-emsworth',
    name: 'EMSWORTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-erith',
    name: 'ERITH',
    flag: 'GBR',
  },
  {
    id: 'gbr-exmouth',
    name: 'EXMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-eyemouth',
    name: 'EYEMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-falmouth',
    name: 'FALMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-faslane',
    name: 'FASLANE',
    flag: 'GBR',
  },
  {
    id: 'gbr-fawley',
    name: 'FAWLEY',
    flag: 'GBR',
  },
  {
    id: 'gbr-felixstowe',
    name: 'FELIXSTOWE',
    flag: 'GBR',
  },
  {
    id: 'gbr-finnart',
    name: 'FINNART',
    flag: 'GBR',
  },
  {
    id: 'gbr-fleetwood',
    name: 'FLEETWOOD',
    flag: 'GBR',
  },
  {
    id: 'gbr-fowey',
    name: 'FOWEY',
    flag: 'GBR',
  },
  {
    id: 'gbr-gardenstown',
    name: 'GARDENSTOWN',
    flag: 'GBR',
  },
  {
    id: 'gbr-girvan',
    name: 'GIRVAN',
    flag: 'GBR',
  },
  {
    id: 'gbr-glasgow',
    name: 'GLASGOW',
    flag: 'GBR',
  },
  {
    id: 'gbr-glassondock',
    name: 'GLASSON DOCK',
    flag: 'GBR',
  },
  {
    id: 'gbr-glensanda',
    name: 'GLENSANDA',
    flag: 'GBR',
  },
  {
    id: 'gbr-goole',
    name: 'GOOLE',
    flag: 'GBR',
  },
  {
    id: 'gbr-grangemouth',
    name: 'GRANGEMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-gravesend',
    name: 'GRAVESEND',
    flag: 'GBR',
  },
  {
    id: 'gbr-greatyarmouth',
    name: 'GREAT YARMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-greenock',
    name: 'GREENOCK',
    flag: 'GBR',
  },
  {
    id: 'gbr-grimsby',
    name: 'GRIMSBY',
    flag: 'GBR',
  },
  {
    id: 'gbr-gunness',
    name: 'GUNNESS',
    flag: 'GBR',
  },
  {
    id: 'gbr-hamble',
    name: 'HAMBLE',
    flag: 'GBR',
  },
  {
    id: 'gbr-hartlepool',
    name: 'HARTLEPOOL',
    flag: 'GBR',
  },
  {
    id: 'gbr-harwich',
    name: 'HARWICH',
    flag: 'GBR',
  },
  {
    id: 'gbr-haylingisland',
    name: 'HAYLING ISLAND',
    flag: 'GBR',
  },
  {
    id: 'gbr-helford',
    name: 'HELFORD',
    flag: 'GBR',
  },
  {
    id: 'gbr-heysham',
    name: 'HEYSHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-holyhead',
    name: 'HOLYHEAD',
    flag: 'GBR',
  },
  {
    id: 'gbr-houndpointterminal',
    name: 'HOUND POINT TERMINAL',
    flag: 'GBR',
  },
  {
    id: 'gbr-hunterston',
    name: 'HUNTERSTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-ilfracombe',
    name: 'ILFRACOMBE',
    flag: 'GBR',
  },
  {
    id: 'gbr-invergordon',
    name: 'INVERGORDON',
    flag: 'GBR',
  },
  {
    id: 'gbr-inverkip',
    name: 'INVERKIP',
    flag: 'GBR',
  },
  {
    id: 'gbr-inverness',
    name: 'INVERNESS',
    flag: 'GBR',
  },
  {
    id: 'gbr-iona',
    name: 'IONA',
    flag: 'GBR',
  },
  {
    id: 'gbr-ipswich',
    name: 'IPSWICH',
    flag: 'GBR',
  },
  {
    id: 'gbr-ipswichanchorage',
    name: 'IPSWICH ANCHORAGE',
    flag: 'GBR',
  },
  {
    id: 'gbr-islesofscilly',
    name: 'ISLES OF SCILLY',
    flag: 'GBR',
  },
  {
    id: 'gbr-kilkeel',
    name: 'KILKEEL',
    flag: 'GBR',
  },
  {
    id: 'gbr-kingslynn',
    name: 'KINGS LYNN',
    flag: 'GBR',
  },
  {
    id: 'gbr-kinlochbervie',
    name: 'KINLOCHBERVIE',
    flag: 'GBR',
  },
  {
    id: 'gbr-kyleoflochalsh',
    name: 'KYLE OF LOCHALSH',
    flag: 'GBR',
  },
  {
    id: 'gbr-lamlash',
    name: 'LAMLASH',
    flag: 'GBR',
  },
  {
    id: 'gbr-larne',
    name: 'LARNE',
    flag: 'GBR',
  },
  {
    id: 'gbr-leith',
    name: 'LEITH',
    flag: 'GBR',
  },
  {
    id: 'gbr-littlehampton',
    name: 'LITTLEHAMPTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-liverpool',
    name: 'LIVERPOOL',
    flag: 'GBR',
  },
  {
    id: 'gbr-lochaline',
    name: 'LOCHALINE',
    flag: 'GBR',
  },
  {
    id: 'gbr-lochboisdale',
    name: 'LOCHBOISDALE',
    flag: 'GBR',
  },
  {
    id: 'gbr-lochinver',
    name: 'LOCHINVER',
    flag: 'GBR',
  },
  {
    id: 'gbr-london',
    name: 'LONDON',
    flag: 'GBR',
  },
  {
    id: 'gbr-londonderry',
    name: 'LONDONDERRY',
    flag: 'GBR',
  },
  {
    id: 'gbr-looe',
    name: 'LOOE',
    flag: 'GBR',
  },
  {
    id: 'gbr-lowestoft',
    name: 'LOWESTOFT',
    flag: 'GBR',
  },
  {
    id: 'gbr-lymeregis',
    name: 'LYME REGIS',
    flag: 'GBR',
  },
  {
    id: 'gbr-lymington',
    name: 'LYMINGTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-macduff',
    name: 'MACDUFF',
    flag: 'GBR',
  },
  {
    id: 'gbr-maldon',
    name: 'MALDON',
    flag: 'GBR',
  },
  {
    id: 'gbr-mallaig',
    name: 'MALLAIG',
    flag: 'GBR',
  },
  {
    id: 'gbr-margateanchorage',
    name: 'MARGATE ANCHORAGE',
    flag: 'GBR',
  },
  {
    id: 'gbr-methil',
    name: 'METHIL',
    flag: 'GBR',
  },
  {
    id: 'gbr-mevagissey',
    name: 'MEVAGISSEY',
    flag: 'GBR',
  },
  {
    id: 'gbr-milfordhaven',
    name: 'MILFORD HAVEN',
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
    id: 'gbr-montrose',
    name: 'MONTROSE',
    flag: 'GBR',
  },
  {
    id: 'gbr-morfanefyn',
    name: 'MORFA NEFYN',
    flag: 'GBR',
  },
  {
    id: 'gbr-mostyn',
    name: 'MOSTYN',
    flag: 'GBR',
  },
  {
    id: 'gbr-mousehole',
    name: 'MOUSEHOLE',
    flag: 'GBR',
  },
  {
    id: 'gbr-neaphouse',
    name: 'NEAP HOUSE',
    flag: 'GBR',
  },
  {
    id: 'gbr-newhaven',
    name: 'NEWHAVEN',
    flag: 'GBR',
  },
  {
    id: 'gbr-newholland',
    name: 'NEW HOLLAND',
    flag: 'GBR',
  },
  {
    id: 'gbr-newlyn',
    name: 'NEWLYN',
    flag: 'GBR',
  },
  {
    id: 'gbr-newport',
    name: 'NEWPORT',
    flag: 'GBR',
  },
  {
    id: 'gbr-newquay',
    name: 'NEWQUAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-newtowncreek',
    name: 'NEWTOWN CREEK',
    flag: 'GBR',
  },
  {
    id: 'gbr-oban',
    name: 'OBAN',
    flag: 'GBR',
  },
  {
    id: 'gbr-padstow',
    name: 'PADSTOW',
    flag: 'GBR',
  },
  {
    id: 'gbr-pembroke',
    name: 'PEMBROKE',
    flag: 'GBR',
  },
  {
    id: 'gbr-perth',
    name: 'PERTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-plockton',
    name: 'PLOCKTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-plymouth',
    name: 'PLYMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-poole',
    name: 'POOLE',
    flag: 'GBR',
  },
  {
    id: 'gbr-portaferry',
    name: 'PORTAFERRY',
    flag: 'GBR',
  },
  {
    id: 'gbr-portbury',
    name: 'PORTBURY',
    flag: 'GBR',
  },
  {
    id: 'gbr-portellen',
    name: 'PORT ELLEN',
    flag: 'GBR',
  },
  {
    id: 'gbr-portishead',
    name: 'PORTISHEAD',
    flag: 'GBR',
  },
  {
    id: 'gbr-portland',
    name: 'PORTLAND',
    flag: 'GBR',
  },
  {
    id: 'gbr-portpatrick',
    name: 'PORTPATRICK',
    flag: 'GBR',
  },
  {
    id: 'gbr-portsmouth',
    name: 'PORTSMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-porttalbot',
    name: 'PORT TALBOT',
    flag: 'GBR',
  },
  {
    id: 'gbr-pwllheli',
    name: 'PWLLHELI',
    flag: 'GBR',
  },
  {
    id: 'gbr-queenborough',
    name: 'QUEENBOROUGH',
    flag: 'GBR',
  },
  {
    id: 'gbr-ramsgate',
    name: 'RAMSGATE',
    flag: 'GBR',
  },
  {
    id: 'gbr-rosyth',
    name: 'ROSYTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-rothesay',
    name: 'ROTHESAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-runcorn',
    name: 'RUNCORN',
    flag: 'GBR',
  },
  {
    id: 'gbr-russel',
    name: 'RUSSEL',
    flag: 'GBR',
  },
  {
    id: 'gbr-saintaubin',
    name: 'SAINT AUBIN',
    flag: 'GBR',
  },
  {
    id: 'gbr-sainthelens',
    name: 'SAINT HELENS',
    flag: 'GBR',
  },
  {
    id: 'gbr-sainthelier',
    name: 'SAINT HELIER',
    flag: 'GBR',
  },
  {
    id: 'gbr-saintmawes',
    name: 'SAINT MAWES',
    flag: 'GBR',
  },
  {
    id: 'gbr-saintpeterport',
    name: 'SAINT PETER PORT',
    flag: 'GBR',
  },
  {
    id: 'gbr-saintsampson',
    name: 'SAINT SAMPSON',
    flag: 'GBR',
  },
  {
    id: 'gbr-salcombe',
    name: 'SALCOMBE',
    flag: 'GBR',
  },
  {
    id: 'gbr-scapaflow',
    name: 'SCAPA FLOW',
    flag: 'GBR',
  },
  {
    id: 'gbr-scarborough',
    name: 'SCARBOROUGH',
    flag: 'GBR',
  },
  {
    id: 'gbr-schiehallionfield',
    name: 'SCHIEHALLION FIELD',
    flag: 'GBR',
  },
  {
    id: 'gbr-seaham',
    name: 'SEAHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-seahouses',
    name: 'SEAHOUSES',
    flag: 'GBR',
  },
  {
    id: 'gbr-sharpness',
    name: 'SHARPNESS',
    flag: 'GBR',
  },
  {
    id: 'gbr-sheerness',
    name: 'SHEERNESS',
    flag: 'GBR',
  },
  {
    id: 'gbr-shoreham',
    name: 'SHOREHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-solent',
    name: 'SOLENT',
    flag: 'GBR',
  },
  {
    id: 'gbr-southampton',
    name: 'SOUTHAMPTON',
    flag: 'GBR',
  },
  {
    id: 'gbr-southendanchorage',
    name: 'SOUTHEND ANCHORAGE',
    flag: 'GBR',
  },
  {
    id: 'gbr-southsea',
    name: 'SOUTHSEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-southwold',
    name: 'SOUTHWOLD',
    flag: 'GBR',
  },
  {
    id: 'gbr-stives',
    name: 'ST IVES',
    flag: 'GBR',
  },
  {
    id: 'gbr-stromness',
    name: 'STROMNESS',
    flag: 'GBR',
  },
  {
    id: 'gbr-sullomvoe',
    name: 'SULLOM VOE',
    flag: 'GBR',
  },
  {
    id: 'gbr-sunderland',
    name: 'SUNDERLAND',
    flag: 'GBR',
  },
  {
    id: 'gbr-suttonbridge',
    name: 'SUTTON BRIDGE',
    flag: 'GBR',
  },
  {
    id: 'gbr-swanage',
    name: 'SWANAGE',
    flag: 'GBR',
  },
  {
    id: 'gbr-swansea',
    name: 'SWANSEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-tees',
    name: 'TEES',
    flag: 'GBR',
  },
  {
    id: 'gbr-teignmouth',
    name: 'TEIGNMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-thames',
    name: 'THAMES',
    flag: 'GBR',
  },
  {
    id: 'gbr-thamesanchorage',
    name: 'THAMES ANCHORAGE',
    flag: 'GBR',
  },
  {
    id: 'gbr-thamesport',
    name: 'THAMESPORT',
    flag: 'GBR',
  },
  {
    id: 'gbr-tilbury',
    name: 'TILBURY',
    flag: 'GBR',
  },
  {
    id: 'gbr-tobermory',
    name: 'TOBERMORY',
    flag: 'GBR',
  },
  {
    id: 'gbr-torquay',
    name: 'TORQUAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-troon',
    name: 'TROON',
    flag: 'GBR',
  },
  {
    id: 'gbr-uig',
    name: 'UIG',
    flag: 'GBR',
  },
  {
    id: 'gbr-ullapool',
    name: 'ULLAPOOL',
    flag: 'GBR',
  },
  {
    id: 'gbr-walton-on-the-naze',
    name: 'WALTON-ON-THE-NAZE',
    flag: 'GBR',
  },
  {
    id: 'gbr-warrenpoint',
    name: 'WARRENPOINT',
    flag: 'GBR',
  },
  {
    id: 'gbr-wells-next-the-sea',
    name: 'WELLS-NEXT-THE-SEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-westmersea',
    name: 'WEST MERSEA',
    flag: 'GBR',
  },
  {
    id: 'gbr-westray',
    name: 'WESTRAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-weymouth',
    name: 'WEYMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gbr-whitby',
    name: 'WHITBY',
    flag: 'GBR',
  },
  {
    id: 'gbr-whitehaven',
    name: 'WHITEHAVEN',
    flag: 'GBR',
  },
  {
    id: 'gbr-whitehills',
    name: 'WHITEHILLS',
    flag: 'GBR',
  },
  {
    id: 'gbr-whitstable',
    name: 'WHITSTABLE',
    flag: 'GBR',
  },
  {
    id: 'gbr-wick',
    name: 'WICK',
    flag: 'GBR',
  },
  {
    id: 'gbr-wisbech',
    name: 'WISBECH',
    flag: 'GBR',
  },
  {
    id: 'gbr-workington',
    name: 'WORKINGTON',
    flag: 'GBR',
  },
  {
    id: 'geo-batumi',
    name: 'BATUMI',
    flag: 'GEO',
  },
  {
    id: 'geo-kulevi',
    name: 'KULEVI',
    flag: 'GEO',
  },
  {
    id: 'geo-poti',
    name: 'POTI',
    flag: 'GEO',
  },
  {
    id: 'geo-supsa',
    name: 'SUPSA',
    flag: 'GEO',
  },
  {
    id: 'gha-jubileefield',
    name: 'JUBILEE FIELD',
    flag: 'GHA',
  },
  {
    id: 'gha-tenfield',
    name: 'TEN FIELD',
    flag: 'GHA',
  },
  {
    id: 'gin-dapilon',
    name: 'DAPILON',
    flag: 'GIN',
  },
  {
    id: 'gin-kamsar',
    name: 'KAMSAR',
    flag: 'GIN',
  },
  {
    id: 'gin-taressaanchorage',
    name: 'TARESSA ANCHORAGE',
    flag: 'GIN',
  },
  {
    id: 'glp-basseterre',
    name: 'BASSE TERRE',
    flag: 'GLP',
  },
  {
    id: 'glp-bouillante',
    name: 'BOUILLANTE',
    flag: 'GLP',
  },
  {
    id: 'glp-deshaies',
    name: 'DESHAIES',
    flag: 'GLP',
  },
  {
    id: 'glp-gustavia',
    name: 'GUSTAVIA',
    flag: 'GLP',
  },
  {
    id: 'glp-legosier',
    name: 'LE GOSIER',
    flag: 'GLP',
  },
  {
    id: 'glp-portlouis',
    name: 'PORT LOUIS',
    flag: 'GLP',
  },
  {
    id: 'glp-saint-francois',
    name: 'SAINT-FRANCOIS',
    flag: 'GLP',
  },
  {
    id: 'glp-saint-louis',
    name: 'SAINT-LOUIS',
    flag: 'GLP',
  },
  {
    id: 'glp-saintberthelemyanchorage',
    name: 'SAINT BERTHELEMY ANCHORAGE',
    flag: 'GLP',
  },
  {
    id: 'glp-sainte-anne',
    name: 'SAINTE-ANNE',
    flag: 'GLP',
  },
  {
    id: 'glp-terre-de-bas',
    name: 'TERRE-DE-BAS',
    flag: 'GLP',
  },
  {
    id: 'glp-terre-de-haut',
    name: 'TERRE-DE-HAUT',
    flag: 'GLP',
  },
  {
    id: 'gnq-asengfpso',
    name: 'ASENG FPSO',
    flag: 'GNQ',
  },
  {
    id: 'gnq-ceibaterminal',
    name: 'CEIBA TERMINAL',
    flag: 'GNQ',
  },
  {
    id: 'gnq-luba',
    name: 'LUBA',
    flag: 'GNQ',
  },
  {
    id: 'gnq-puntaeuropa',
    name: 'PUNTA EUROPA',
    flag: 'GNQ',
  },
  {
    id: 'gnq-serpentinaterminal',
    name: 'SERPENTINA TERMINAL',
    flag: 'GNQ',
  },
  {
    id: 'grc-aegina',
    name: 'AEGINA',
    flag: 'GRC',
  },
  {
    id: 'grc-agioitheodoroi',
    name: 'AGIOI THEODOROI',
    flag: 'GRC',
  },
  {
    id: 'grc-agioskirykos',
    name: 'AGIOS KIRYKOS',
    flag: 'GRC',
  },
  {
    id: 'grc-agiosnikolaos',
    name: 'AGIOS NIKOLAOS',
    flag: 'GRC',
  },
  {
    id: 'grc-alexandroupoli',
    name: 'ALEXANDROUPOLI',
    flag: 'GRC',
  },
  {
    id: 'grc-alimos',
    name: 'ALIMOS',
    flag: 'GRC',
  },
  {
    id: 'grc-amorgos',
    name: 'AMORGOS',
    flag: 'GRC',
  },
  {
    id: 'grc-anafi',
    name: 'ANAFI',
    flag: 'GRC',
  },
  {
    id: 'grc-antipaxos',
    name: 'ANTIPAXOS',
    flag: 'GRC',
  },
  {
    id: 'grc-antirrio',
    name: 'ANTIRRIO',
    flag: 'GRC',
  },
  {
    id: 'grc-argostoli',
    name: 'ARGOSTOLI',
    flag: 'GRC',
  },
  {
    id: 'grc-aspropyrgos',
    name: 'ASPROPYRGOS',
    flag: 'GRC',
  },
  {
    id: 'grc-astakos',
    name: 'ASTAKOS',
    flag: 'GRC',
  },
  {
    id: 'grc-benitses',
    name: 'BENITSES',
    flag: 'GRC',
  },
  {
    id: 'grc-chalki',
    name: 'CHALKI',
    flag: 'GRC',
  },
  {
    id: 'grc-chalkis',
    name: 'CHALKIS',
    flag: 'GRC',
  },
  {
    id: 'grc-chalkissouthanchorage',
    name: 'CHALKIS SOUTH ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'grc-chania',
    name: 'CHANIA',
    flag: 'GRC',
  },
  {
    id: 'grc-chios',
    name: 'CHIOS',
    flag: 'GRC',
  },
  {
    id: 'grc-corfu',
    name: 'CORFU',
    flag: 'GRC',
  },
  {
    id: 'grc-corfuanchorage',
    name: 'CORFU ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'grc-corinth',
    name: 'CORINTH',
    flag: 'GRC',
  },
  {
    id: 'grc-corintheastanchorage',
    name: 'CORINTH EAST ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'grc-dokos',
    name: 'DOKOS',
    flag: 'GRC',
  },
  {
    id: 'grc-drepano',
    name: 'DREPANO',
    flag: 'GRC',
  },
  {
    id: 'grc-elefsis',
    name: 'ELEFSIS',
    flag: 'GRC',
  },
  {
    id: 'grc-eleftheres',
    name: 'ELEFTHERES',
    flag: 'GRC',
  },
  {
    id: 'grc-ermioni',
    name: 'ERMIONI',
    flag: 'GRC',
  },
  {
    id: 'grc-ermoupoli',
    name: 'ERMOUPOLI',
    flag: 'GRC',
  },
  {
    id: 'grc-finikas',
    name: 'FINIKAS',
    flag: 'GRC',
  },
  {
    id: 'grc-fiskardo',
    name: 'FISKARDO',
    flag: 'GRC',
  },
  {
    id: 'grc-fournoi',
    name: 'FOURNOI',
    flag: 'GRC',
  },
  {
    id: 'grc-frikes',
    name: 'FRIKES',
    flag: 'GRC',
  },
  {
    id: 'grc-gaios',
    name: 'GAIOS',
    flag: 'GRC',
  },
  {
    id: 'grc-galaxidi',
    name: 'GALAXIDI',
    flag: 'GRC',
  },
  {
    id: 'grc-gavrio',
    name: 'GAVRIO',
    flag: 'GRC',
  },
  {
    id: 'grc-glyfada',
    name: 'GLYFADA',
    flag: 'GRC',
  },
  {
    id: 'grc-gouvia',
    name: 'GOUVIA',
    flag: 'GRC',
  },
  {
    id: 'grc-gythio',
    name: 'GYTHIO',
    flag: 'GRC',
  },
  {
    id: 'grc-hydra',
    name: 'HYDRA',
    flag: 'GRC',
  },
  {
    id: 'grc-igoumenitsa',
    name: 'IGOUMENITSA',
    flag: 'GRC',
  },
  {
    id: 'grc-ios',
    name: 'IOS',
    flag: 'GRC',
  },
  {
    id: 'grc-itea',
    name: 'ITEA',
    flag: 'GRC',
  },
  {
    id: 'grc-ithaki',
    name: 'ITHAKI',
    flag: 'GRC',
  },
  {
    id: 'grc-kalilimenesanchorage',
    name: 'KALI LIMENES ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'grc-kalymnos',
    name: 'KALYMNOS',
    flag: 'GRC',
  },
  {
    id: 'grc-karpathos',
    name: 'KARPATHOS',
    flag: 'GRC',
  },
  {
    id: 'grc-karystosanchorage',
    name: 'KARYSTOS ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'grc-kastellorizo',
    name: 'KASTELLORIZO',
    flag: 'GRC',
  },
  {
    id: 'grc-kastos',
    name: 'KASTOS',
    flag: 'GRC',
  },
  {
    id: 'grc-katakolo',
    name: 'KATAKOLO',
    flag: 'GRC',
  },
  {
    id: 'grc-kavala',
    name: 'KAVALA',
    flag: 'GRC',
  },
  {
    id: 'grc-kefalos',
    name: 'KEFALOS',
    flag: 'GRC',
  },
  {
    id: 'grc-keramoti',
    name: 'KERAMOTI',
    flag: 'GRC',
  },
  {
    id: 'grc-keri',
    name: 'KERI',
    flag: 'GRC',
  },
  {
    id: 'grc-kilada',
    name: 'KILADA',
    flag: 'GRC',
  },
  {
    id: 'grc-kimolos',
    name: 'KIMOLOS',
    flag: 'GRC',
  },
  {
    id: 'grc-kissamos',
    name: 'KISSAMOS',
    flag: 'GRC',
  },
  {
    id: 'grc-koroni',
    name: 'KORONI',
    flag: 'GRC',
  },
  {
    id: 'grc-kos',
    name: 'KOS',
    flag: 'GRC',
  },
  {
    id: 'grc-kyllini',
    name: 'KYLLINI',
    flag: 'GRC',
  },
  {
    id: 'grc-kymi',
    name: 'KYMI',
    flag: 'GRC',
  },
  {
    id: 'grc-kyparissia',
    name: 'KYPARISSIA',
    flag: 'GRC',
  },
  {
    id: 'grc-kythira',
    name: 'KYTHIRA',
    flag: 'GRC',
  },
  {
    id: 'grc-kythnos',
    name: 'KYTHNOS',
    flag: 'GRC',
  },
  {
    id: 'grc-kythnosanchorage',
    name: 'KYTHNOS ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'grc-larymna',
    name: 'LARYMNA',
    flag: 'GRC',
  },
  {
    id: 'grc-lefkada',
    name: 'LEFKADA',
    flag: 'GRC',
  },
  {
    id: 'grc-leros',
    name: 'LEROS',
    flag: 'GRC',
  },
  {
    id: 'grc-lindos',
    name: 'LINDOS',
    flag: 'GRC',
  },
  {
    id: 'grc-marathokampos',
    name: 'MARATHOKAMPOS',
    flag: 'GRC',
  },
  {
    id: 'grc-methoni',
    name: 'METHONI',
    flag: 'GRC',
  },
  {
    id: 'grc-michaniona',
    name: 'MICHANIONA',
    flag: 'GRC',
  },
  {
    id: 'grc-milaki',
    name: 'MILAKI',
    flag: 'GRC',
  },
  {
    id: 'grc-milos',
    name: 'MILOS',
    flag: 'GRC',
  },
  {
    id: 'grc-missolonghi',
    name: 'MISSOLONGHI',
    flag: 'GRC',
  },
  {
    id: 'grc-monemvasia',
    name: 'MONEMVASIA',
    flag: 'GRC',
  },
  {
    id: 'grc-mykonos',
    name: 'MYKONOS',
    flag: 'GRC',
  },
  {
    id: 'grc-mykonosanchorage',
    name: 'MYKONOS ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'grc-myrina',
    name: 'MYRINA',
    flag: 'GRC',
  },
  {
    id: 'grc-mytilini',
    name: 'MYTILINI',
    flag: 'GRC',
  },
  {
    id: 'grc-nafplion',
    name: 'NAFPLION',
    flag: 'GRC',
  },
  {
    id: 'grc-naousaanchorage',
    name: 'NAOUSA ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'grc-naxos',
    name: 'NAXOS',
    flag: 'GRC',
  },
  {
    id: 'grc-neakarvali',
    name: 'NEA KARVALI',
    flag: 'GRC',
  },
  {
    id: 'grc-neamoudania',
    name: 'NEA MOUDANIA',
    flag: 'GRC',
  },
  {
    id: 'grc-nydri',
    name: 'NYDRI',
    flag: 'GRC',
  },
  {
    id: 'grc-oinousses',
    name: 'OINOUSSES',
    flag: 'GRC',
  },
  {
    id: 'grc-pachi',
    name: 'PACHI',
    flag: 'GRC',
  },
  {
    id: 'grc-palaiokastritsa',
    name: 'PALAIOKASTRITSA',
    flag: 'GRC',
  },
  {
    id: 'grc-parga',
    name: 'PARGA',
    flag: 'GRC',
  },
  {
    id: 'grc-paros',
    name: 'PAROS',
    flag: 'GRC',
  },
  {
    id: 'grc-patmos',
    name: 'PATMOS',
    flag: 'GRC',
  },
  {
    id: 'grc-patra',
    name: 'PATRA',
    flag: 'GRC',
  },
  {
    id: 'grc-patras',
    name: 'PATRAS',
    flag: 'GRC',
  },
  {
    id: 'grc-perama',
    name: 'PERAMA',
    flag: 'GRC',
  },
  {
    id: 'grc-poros',
    name: 'POROS',
    flag: 'GRC',
  },
  {
    id: 'grc-portoheli',
    name: 'PORTO HELI',
    flag: 'GRC',
  },
  {
    id: 'grc-portolagos',
    name: 'PORTO LAGOS',
    flag: 'GRC',
  },
  {
    id: 'grc-preveza',
    name: 'PREVEZA',
    flag: 'GRC',
  },
  {
    id: 'grc-psachna',
    name: 'PSACHNA',
    flag: 'GRC',
  },
  {
    id: 'grc-pserimos',
    name: 'PSERIMOS',
    flag: 'GRC',
  },
  {
    id: 'grc-pylos',
    name: 'PYLOS',
    flag: 'GRC',
  },
  {
    id: 'grc-pythagoreio',
    name: 'PYTHAGOREIO',
    flag: 'GRC',
  },
  {
    id: 'grc-rafina',
    name: 'RAFINA',
    flag: 'GRC',
  },
  {
    id: 'grc-rhodes',
    name: 'RHODES',
    flag: 'GRC',
  },
  {
    id: 'grc-rio',
    name: 'RIO',
    flag: 'GRC',
  },
  {
    id: 'grc-sami',
    name: 'SAMI',
    flag: 'GRC',
  },
  {
    id: 'grc-samos',
    name: 'SAMOS',
    flag: 'GRC',
  },
  {
    id: 'grc-santorini',
    name: 'SANTORINI',
    flag: 'GRC',
  },
  {
    id: 'grc-serifos',
    name: 'SERIFOS',
    flag: 'GRC',
  },
  {
    id: 'grc-sitia',
    name: 'SITIA',
    flag: 'GRC',
  },
  {
    id: 'grc-skiathos',
    name: 'SKIATHOS',
    flag: 'GRC',
  },
  {
    id: 'grc-skopelos',
    name: 'SKOPELOS',
    flag: 'GRC',
  },
  {
    id: 'grc-skyros',
    name: 'SKYROS',
    flag: 'GRC',
  },
  {
    id: 'grc-souda',
    name: 'SOUDA',
    flag: 'GRC',
  },
  {
    id: 'grc-soudaanchorage',
    name: 'SOUDA ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'grc-soussaki',
    name: 'SOUSSAKI',
    flag: 'GRC',
  },
  {
    id: 'grc-spetses',
    name: 'SPETSES',
    flag: 'GRC',
  },
  {
    id: 'grc-stnicolas',
    name: 'ST NICOLAS',
    flag: 'GRC',
  },
  {
    id: 'grc-stylida',
    name: 'STYLIDA',
    flag: 'GRC',
  },
  {
    id: 'grc-symi',
    name: 'SYMI',
    flag: 'GRC',
  },
  {
    id: 'grc-syrosanchorage',
    name: 'SYROS ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'grc-syvota',
    name: 'SYVOTA',
    flag: 'GRC',
  },
  {
    id: 'grc-thessaloniki',
    name: 'THESSALONIKI',
    flag: 'GRC',
  },
  {
    id: 'grc-thisvi',
    name: 'THISVI',
    flag: 'GRC',
  },
  {
    id: 'grc-tilos',
    name: 'TILOS',
    flag: 'GRC',
  },
  {
    id: 'grc-tinos',
    name: 'TINOS',
    flag: 'GRC',
  },
  {
    id: 'grc-tinosanchorage',
    name: 'TINOS ANCHORAGE',
    flag: 'GRC',
  },
  {
    id: 'grc-tsingeli',
    name: 'TSINGELI',
    flag: 'GRC',
  },
  {
    id: 'grc-varkiza',
    name: 'VARKIZA',
    flag: 'GRC',
  },
  {
    id: 'grc-volos',
    name: 'VOLOS',
    flag: 'GRC',
  },
  {
    id: 'grc-vouliagmeni',
    name: 'VOULIAGMENI',
    flag: 'GRC',
  },
  {
    id: 'grc-yali',
    name: 'YALI',
    flag: 'GRC',
  },
  {
    id: 'grc-zakynthos',
    name: 'ZAKYNTHOS',
    flag: 'GRC',
  },
  {
    id: 'grd-carriacou',
    name: 'CARRIACOU',
    flag: 'GRD',
  },
  {
    id: 'grd-clarkscourtbay',
    name: 'CLARKS COURT BAY',
    flag: 'GRD',
  },
  {
    id: 'grd-grandmal',
    name: 'GRAND MAL',
    flag: 'GRD',
  },
  {
    id: 'grd-hillsborough',
    name: 'HILLSBOROUGH',
    flag: 'GRD',
  },
  {
    id: 'grd-lesterrebay',
    name: 'LESTERRE BAY',
    flag: 'GRD',
  },
  {
    id: 'grd-petitmartinique',
    name: 'PETIT MARTINIQUE',
    flag: 'GRD',
  },
  {
    id: 'grd-pricklybay',
    name: 'PRICKLY BAY',
    flag: 'GRD',
  },
  {
    id: 'grd-rondeisland',
    name: 'RONDE ISLAND',
    flag: 'GRD',
  },
  {
    id: 'grl-kangaatsaiq',
    name: 'KANGAATSAIQ',
    flag: 'GRL',
  },
  {
    id: 'grl-kangerlusuaq',
    name: 'KANGERLUSUAQ',
    flag: 'GRL',
  },
  {
    id: 'grl-kangilinnguit',
    name: 'KANGILINNGUIT',
    flag: 'GRL',
  },
  {
    id: 'grl-narsaq',
    name: 'NARSAQ',
    flag: 'GRL',
  },
  {
    id: 'grl-qeqertarsuatsiaat',
    name: 'QEQERTARSUATSIAAT',
    flag: 'GRL',
  },
  {
    id: 'grl-tasiilaq',
    name: 'TASIILAQ',
    flag: 'GRL',
  },
  {
    id: 'grl-upernavik',
    name: 'UPERNAVIK',
    flag: 'GRL',
  },
  {
    id: 'grl-uummannaq',
    name: 'UUMMANNAQ',
    flag: 'GRL',
  },
  {
    id: 'gtm-sanjoseanchorage',
    name: 'SAN JOSE ANCHORAGE',
    flag: 'GTM',
  },
  {
    id: 'gtm-santotomas',
    name: 'SANTO TOMAS',
    flag: 'GTM',
  },
  {
    id: 'guf-degraddescannes',
    name: 'DEGRAD DES CANNES',
    flag: 'GUF',
  },
  {
    id: 'guf-kourou',
    name: 'KOUROU',
    flag: 'GUF',
  },
  {
    id: 'gum-apraharbor',
    name: 'APRA HARBOR',
    flag: 'GUM',
  },
  {
    id: 'guy-linden',
    name: 'LINDEN',
    flag: 'GUY',
  },
  {
    id: 'guy-newamsterdam',
    name: 'NEW AMSTERDAM',
    flag: 'GUY',
  },
  {
    id: 'hkg-hongkong',
    name: 'HONG KONG',
    flag: 'HKG',
  },
  {
    id: 'hnd-omoaanchorage',
    name: 'OMOA ANCHORAGE',
    flag: 'HND',
  },
  {
    id: 'hnd-puertocortes',
    name: 'PUERTO CORTES',
    flag: 'HND',
  },
  {
    id: 'hnd-sanlorenzo',
    name: 'SAN LORENZO',
    flag: 'HND',
  },
  {
    id: 'hnd-tela',
    name: 'TELA',
    flag: 'HND',
  },
  {
    id: 'hrv-bakar',
    name: 'BAKAR',
    flag: 'HRV',
  },
  {
    id: 'hrv-betina',
    name: 'BETINA',
    flag: 'HRV',
  },
  {
    id: 'hrv-biogradnamoru',
    name: 'BIOGRAD NA MORU',
    flag: 'HRV',
  },
  {
    id: 'hrv-bobovisca',
    name: 'BOBOVISCA',
    flag: 'HRV',
  },
  {
    id: 'hrv-bol',
    name: 'BOL',
    flag: 'HRV',
  },
  {
    id: 'hrv-brijuni',
    name: 'BRIJUNI',
    flag: 'HRV',
  },
  {
    id: 'hrv-cavtat',
    name: 'CAVTAT',
    flag: 'HRV',
  },
  {
    id: 'hrv-cres',
    name: 'CRES',
    flag: 'HRV',
  },
  {
    id: 'hrv-drvenikmali',
    name: 'DRVENIK MALI',
    flag: 'HRV',
  },
  {
    id: 'hrv-dubrovnik',
    name: 'DUBROVNIK',
    flag: 'HRV',
  },
  {
    id: 'hrv-hvar',
    name: 'HVAR',
    flag: 'HRV',
  },
  {
    id: 'hrv-ilovik',
    name: 'ILOVIK',
    flag: 'HRV',
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
    id: 'hrv-jezera',
    name: 'JEZERA',
    flag: 'HRV',
  },
  {
    id: 'hrv-kastelkambelovac',
    name: 'KASTEL KAMBELOVAC',
    flag: 'HRV',
  },
  {
    id: 'hrv-kolocep',
    name: 'KOLOCEP',
    flag: 'HRV',
  },
  {
    id: 'hrv-komiza',
    name: 'KOMIZA',
    flag: 'HRV',
  },
  {
    id: 'hrv-korcula',
    name: 'KORCULA',
    flag: 'HRV',
  },
  {
    id: 'hrv-krijal',
    name: 'KRIJAL',
    flag: 'HRV',
  },
  {
    id: 'hrv-lastovo',
    name: 'LASTOVO',
    flag: 'HRV',
  },
  {
    id: 'hrv-lopud',
    name: 'LOPUD',
    flag: 'HRV',
  },
  {
    id: 'hrv-loviste',
    name: 'LOVISTE',
    flag: 'HRV',
  },
  {
    id: 'hrv-lukutiha',
    name: 'LUKU TIHA',
    flag: 'HRV',
  },
  {
    id: 'hrv-lumbarda',
    name: 'LUMBARDA',
    flag: 'HRV',
  },
  {
    id: 'hrv-makarska',
    name: 'MAKARSKA',
    flag: 'HRV',
  },
  {
    id: 'hrv-malilosinj',
    name: 'MALI LOSINJ',
    flag: 'HRV',
  },
  {
    id: 'hrv-marina',
    name: 'MARINA',
    flag: 'HRV',
  },
  {
    id: 'hrv-maslinica',
    name: 'MASLINICA',
    flag: 'HRV',
  },
  {
    id: 'hrv-milna',
    name: 'MILNA',
    flag: 'HRV',
  },
  {
    id: 'hrv-molunat',
    name: 'MOLUNAT',
    flag: 'HRV',
  },
  {
    id: 'hrv-muline',
    name: 'MULINE',
    flag: 'HRV',
  },
  {
    id: 'hrv-necujam',
    name: 'NECUJAM',
    flag: 'HRV',
  },
  {
    id: 'hrv-novigrad',
    name: 'NOVIGRAD',
    flag: 'HRV',
  },
  {
    id: 'hrv-okruggornjianchorage',
    name: 'OKRUG GORNJI ANCHORAGE',
    flag: 'HRV',
  },
  {
    id: 'hrv-olib',
    name: 'OLIB',
    flag: 'HRV',
  },
  {
    id: 'hrv-omisalj',
    name: 'OMISALJ',
    flag: 'HRV',
  },
  {
    id: 'hrv-orebic',
    name: 'OREBIC',
    flag: 'HRV',
  },
  {
    id: 'hrv-otokkakan',
    name: 'OTOK KAKAN',
    flag: 'HRV',
  },
  {
    id: 'hrv-otokkaprije',
    name: 'OTOK KAPRIJE',
    flag: 'HRV',
  },
  {
    id: 'hrv-otoktijat',
    name: 'OTOK TIJAT',
    flag: 'HRV',
  },
  {
    id: 'hrv-ploce',
    name: 'PLOCE',
    flag: 'HRV',
  },
  {
    id: 'hrv-plomin',
    name: 'PLOMIN',
    flag: 'HRV',
  },
  {
    id: 'hrv-pomena',
    name: 'POMENA',
    flag: 'HRV',
  },
  {
    id: 'hrv-porec',
    name: 'POREC',
    flag: 'HRV',
  },
  {
    id: 'hrv-primosten',
    name: 'PRIMOSTEN',
    flag: 'HRV',
  },
  {
    id: 'hrv-pucisca',
    name: 'PUCISCA',
    flag: 'HRV',
  },
  {
    id: 'hrv-pula',
    name: 'PULA',
    flag: 'HRV',
  },
  {
    id: 'hrv-rab',
    name: 'RAB',
    flag: 'HRV',
  },
  {
    id: 'hrv-rabac',
    name: 'RABAC',
    flag: 'HRV',
  },
  {
    id: 'hrv-rasa',
    name: 'RASA',
    flag: 'HRV',
  },
  {
    id: 'hrv-rijeka',
    name: 'RIJEKA',
    flag: 'HRV',
  },
  {
    id: 'hrv-rogac',
    name: 'ROGAC',
    flag: 'HRV',
  },
  {
    id: 'hrv-rogoznica',
    name: 'ROGOZNICA',
    flag: 'HRV',
  },
  {
    id: 'hrv-rovinj',
    name: 'ROVINJ',
    flag: 'HRV',
  },
  {
    id: 'hrv-rukavac',
    name: 'RUKAVAC',
    flag: 'HRV',
  },
  {
    id: 'hrv-saplunara',
    name: 'SAPLUNARA',
    flag: 'HRV',
  },
  {
    id: 'hrv-sibenik',
    name: 'SIBENIK',
    flag: 'HRV',
  },
  {
    id: 'hrv-silba',
    name: 'SILBA',
    flag: 'HRV',
  },
  {
    id: 'hrv-starigrad',
    name: 'STARI GRAD',
    flag: 'HRV',
  },
  {
    id: 'hrv-sukosan',
    name: 'SUKOSAN',
    flag: 'HRV',
  },
  {
    id: 'hrv-sumartin',
    name: 'SUMARTIN',
    flag: 'HRV',
  },
  {
    id: 'hrv-supetar',
    name: 'SUPETAR',
    flag: 'HRV',
  },
  {
    id: 'hrv-susak',
    name: 'SUSAK',
    flag: 'HRV',
  },
  {
    id: 'hrv-sutomiscica',
    name: 'SUTOMISCICA',
    flag: 'HRV',
  },
  {
    id: 'hrv-tribunj',
    name: 'TRIBUNJ',
    flag: 'HRV',
  },
  {
    id: 'hrv-trogir',
    name: 'TROGIR',
    flag: 'HRV',
  },
  {
    id: 'hrv-umag',
    name: 'UMAG',
    flag: 'HRV',
  },
  {
    id: 'hrv-velaluka',
    name: 'VELA LUKA',
    flag: 'HRV',
  },
  {
    id: 'hrv-velikidrvenik',
    name: 'VELIKI DRVENIK',
    flag: 'HRV',
  },
  {
    id: 'hrv-vinisce',
    name: 'VINISCE',
    flag: 'HRV',
  },
  {
    id: 'hrv-vis',
    name: 'VIS',
    flag: 'HRV',
  },
  {
    id: 'hrv-vrsar',
    name: 'VRSAR',
    flag: 'HRV',
  },
  {
    id: 'hrv-zaton',
    name: 'ZATON',
    flag: 'HRV',
  },
  {
    id: 'hrv-zirje',
    name: 'ZIRJE',
    flag: 'HRV',
  },
  {
    id: 'hrv-zlarin',
    name: 'ZLARIN',
    flag: 'HRV',
  },
  {
    id: 'hti-aubry',
    name: 'AUBRY',
    flag: 'HTI',
  },
  {
    id: 'hti-caphaitien',
    name: 'CAP HAITIEN',
    flag: 'HTI',
  },
  {
    id: 'hti-gonaives',
    name: 'GONAIVES',
    flag: 'HTI',
  },
  {
    id: 'hti-laffiteau',
    name: 'LAFFITEAU',
    flag: 'HTI',
  },
  {
    id: 'hti-miragoane',
    name: 'MIRAGOANE',
    flag: 'HTI',
  },
  {
    id: 'hti-portauprince',
    name: 'PORT AU PRINCE',
    flag: 'HTI',
  },
  {
    id: 'hti-saintmarc',
    name: 'SAINT MARC',
    flag: 'HTI',
  },
  {
    id: 'hun-budapest',
    name: 'BUDAPEST',
    flag: 'HUN',
  },
  {
    id: 'hun-mohacs',
    name: 'MOHACS',
    flag: 'HUN',
  },
  {
    id: 'idn-adangbay',
    name: 'ADANG BAY',
    flag: 'IDN',
  },
  {
    id: 'idn-amamapare',
    name: 'AMAMAPARE',
    flag: 'IDN',
  },
  {
    id: 'idn-amamapareanchorage',
    name: 'AMAMAPARE ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-ampenan',
    name: 'AMPENAN',
    flag: 'IDN',
  },
  {
    id: 'idn-amurang',
    name: 'AMURANG',
    flag: 'IDN',
  },
  {
    id: 'idn-anggana',
    name: 'ANGGANA',
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
    id: 'idn-bacan',
    name: 'BACAN',
    flag: 'IDN',
  },
  {
    id: 'idn-badas',
    name: 'BADAS',
    flag: 'IDN',
  },
  {
    id: 'idn-bade',
    name: 'BADE',
    flag: 'IDN',
  },
  {
    id: 'idn-bahodopi',
    name: 'BAHODOPI',
    flag: 'IDN',
  },
  {
    id: 'idn-bajomulyo',
    name: 'BAJOMULYO',
    flag: 'IDN',
  },
  {
    id: 'idn-bakau',
    name: 'BAKAU',
    flag: 'IDN',
  },
  {
    id: 'idn-bakauheni',
    name: 'BAKAUHENI',
    flag: 'IDN',
  },
  {
    id: 'idn-balikpapan',
    name: 'BALIKPAPAN',
    flag: 'IDN',
  },
  {
    id: 'idn-balongan',
    name: 'BALONGAN',
    flag: 'IDN',
  },
  {
    id: 'idn-banda',
    name: 'BANDA',
    flag: 'IDN',
  },
  {
    id: 'idn-banjarmasin',
    name: 'BANJARMASIN',
    flag: 'IDN',
  },
  {
    id: 'idn-banyuwangianchorage',
    name: 'BANYUWANGI ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-barelang',
    name: 'BARELANG',
    flag: 'IDN',
  },
  {
    id: 'idn-baubau',
    name: 'BAU BAU',
    flag: 'IDN',
  },
  {
    id: 'idn-bawean',
    name: 'BAWEAN',
    flag: 'IDN',
  },
  {
    id: 'idn-bayah',
    name: 'BAYAH',
    flag: 'IDN',
  },
  {
    id: 'idn-belawan',
    name: 'BELAWAN',
    flag: 'IDN',
  },
  {
    id: 'idn-belinyu',
    name: 'BELINYU',
    flag: 'IDN',
  },
  {
    id: 'idn-bengkulu',
    name: 'BENGKULU',
    flag: 'IDN',
  },
  {
    id: 'idn-biak',
    name: 'BIAK',
    flag: 'IDN',
  },
  {
    id: 'idn-bima',
    name: 'BIMA',
    flag: 'IDN',
  },
  {
    id: 'idn-bintan',
    name: 'BINTAN',
    flag: 'IDN',
  },
  {
    id: 'idn-bintuni',
    name: 'BINTUNI',
    flag: 'IDN',
  },
  {
    id: 'idn-biringkassi',
    name: 'BIRINGKASSI',
    flag: 'IDN',
  },
  {
    id: 'idn-blanakan',
    name: 'BLANAKAN',
    flag: 'IDN',
  },
  {
    id: 'idn-bontang',
    name: 'BONTANG',
    flag: 'IDN',
  },
  {
    id: 'idn-brondong',
    name: 'BRONDONG',
    flag: 'IDN',
  },
  {
    id: 'idn-bunatianchorage',
    name: 'BUNATI ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-bunyu',
    name: 'BUNYU',
    flag: 'IDN',
  },
  {
    id: 'idn-celukanbawang',
    name: 'CELUKAN BAWANG',
    flag: 'IDN',
  },
  {
    id: 'idn-cigading',
    name: 'CIGADING',
    flag: 'IDN',
  },
  {
    id: 'idn-cilacap',
    name: 'CILACAP',
    flag: 'IDN',
  },
  {
    id: 'idn-cilegon',
    name: 'CILEGON',
    flag: 'IDN',
  },
  {
    id: 'idn-cinta',
    name: 'CINTA',
    flag: 'IDN',
  },
  {
    id: 'idn-cirebon',
    name: 'CIREBON',
    flag: 'IDN',
  },
  {
    id: 'idn-dagho',
    name: 'DAGHO',
    flag: 'IDN',
  },
  {
    id: 'idn-demta',
    name: 'DEMTA',
    flag: 'IDN',
  },
  {
    id: 'idn-dobo',
    name: 'DOBO',
    flag: 'IDN',
  },
  {
    id: 'idn-dompas',
    name: 'DOMPAS',
    flag: 'IDN',
  },
  {
    id: 'idn-dumai',
    name: 'DUMAI',
    flag: 'IDN',
  },
  {
    id: 'idn-ende',
    name: 'ENDE',
    flag: 'IDN',
  },
  {
    id: 'idn-eretanwetan',
    name: 'ERETAN WETAN',
    flag: 'IDN',
  },
  {
    id: 'idn-futong',
    name: 'FUTONG',
    flag: 'IDN',
  },
  {
    id: 'idn-gilimanuk',
    name: 'GILIMANUK',
    flag: 'IDN',
  },
  {
    id: 'idn-gorontalo',
    name: 'GORONTALO',
    flag: 'IDN',
  },
  {
    id: 'idn-gresik',
    name: 'GRESIK',
    flag: 'IDN',
  },
  {
    id: 'idn-grogot',
    name: 'GROGOT',
    flag: 'IDN',
  },
  {
    id: 'idn-handil',
    name: 'HANDIL',
    flag: 'IDN',
  },
  {
    id: 'idn-idcalabai',
    name: 'ID CALABAI',
    flag: 'IDN',
  },
  {
    id: 'idn-idi',
    name: 'IDI',
    flag: 'IDN',
  },
  {
    id: 'idn-idmli',
    name: 'ID MLI',
    flag: 'IDN',
  },
  {
    id: 'idn-jambi',
    name: 'JAMBI',
    flag: 'IDN',
  },
  {
    id: 'idn-jayapura',
    name: 'JAYAPURA',
    flag: 'IDN',
  },
  {
    id: 'idn-kahyangan',
    name: 'KAHYANGAN',
    flag: 'IDN',
  },
  {
    id: 'idn-kaimana',
    name: 'KAIMANA',
    flag: 'IDN',
  },
  {
    id: 'idn-kalbut',
    name: 'KALBUT',
    flag: 'IDN',
  },
  {
    id: 'idn-kalioranganchorage',
    name: 'KALIORANG ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-karanglincak',
    name: 'KARANGLINCAK',
    flag: 'IDN',
  },
  {
    id: 'idn-karimunbesaranchorage',
    name: 'KARIMUNBESAR ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-karimunjawa',
    name: 'KARIMUN JAWA',
    flag: 'IDN',
  },
  {
    id: 'idn-kendari',
    name: 'KENDARI',
    flag: 'IDN',
  },
  {
    id: 'idn-ketapang',
    name: 'KETAPANG',
    flag: 'IDN',
  },
  {
    id: 'idn-kolaka',
    name: 'KOLAKA',
    flag: 'IDN',
  },
  {
    id: 'idn-kotaagung',
    name: 'KOTA AGUNG',
    flag: 'IDN',
  },
  {
    id: 'idn-kotabaru',
    name: 'KOTABARU',
    flag: 'IDN',
  },
  {
    id: 'idn-kruenggeukueh',
    name: 'KRUENG GEUKUEH',
    flag: 'IDN',
  },
  {
    id: 'idn-kualaenok',
    name: 'KUALA ENOK',
    flag: 'IDN',
  },
  {
    id: 'idn-kualatanjung',
    name: 'KUALA TANJUNG',
    flag: 'IDN',
  },
  {
    id: 'idn-kumaianchorage',
    name: 'KUMAI ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-kupang',
    name: 'KUPANG',
    flag: 'IDN',
  },
  {
    id: 'idn-kwandang',
    name: 'KWANDANG',
    flag: 'IDN',
  },
  {
    id: 'idn-labuanbajo',
    name: 'LABUAN BAJO',
    flag: 'IDN',
  },
  {
    id: 'idn-labuhanmaringgai',
    name: 'LABUHAN MARINGGAI',
    flag: 'IDN',
  },
  {
    id: 'idn-lamongan',
    name: 'LAMONGAN',
    flag: 'IDN',
  },
  {
    id: 'idn-lawelawe',
    name: 'LAWE LAWE',
    flag: 'IDN',
  },
  {
    id: 'idn-lembar',
    name: 'LEMBAR',
    flag: 'IDN',
  },
  {
    id: 'idn-lembongan',
    name: 'LEMBONGAN',
    flag: 'IDN',
  },
  {
    id: 'idn-lempasing',
    name: 'LEMPASING',
    flag: 'IDN',
  },
  {
    id: 'idn-lontar',
    name: 'LONTAR',
    flag: 'IDN',
  },
  {
    id: 'idn-lubukgaung',
    name: 'LUBUK GAUNG',
    flag: 'IDN',
  },
  {
    id: 'idn-lubuktutung',
    name: 'LUBUKTUTUNG',
    flag: 'IDN',
  },
  {
    id: 'idn-luwuk',
    name: 'LUWUK',
    flag: 'IDN',
  },
  {
    id: 'idn-mahakamdelta',
    name: 'MAHAKAM DELTA',
    flag: 'IDN',
  },
  {
    id: 'idn-makassar',
    name: 'MAKASSAR',
    flag: 'IDN',
  },
  {
    id: 'idn-malahayati',
    name: 'MALAHAYATI',
    flag: 'IDN',
  },
  {
    id: 'idn-manggis',
    name: 'MANGGIS',
    flag: 'IDN',
  },
  {
    id: 'idn-manokwari',
    name: 'MANOKWARI',
    flag: 'IDN',
  },
  {
    id: 'idn-maumere',
    name: 'MAUMERE',
    flag: 'IDN',
  },
  {
    id: 'idn-merakmasterminal',
    name: 'MERAK MAS TERMINAL',
    flag: 'IDN',
  },
  {
    id: 'idn-merauke',
    name: 'MERAUKE',
    flag: 'IDN',
  },
  {
    id: 'idn-muaraberauanchorage',
    name: 'MUARA BERAU ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-muarapantai',
    name: 'MUARA PANTAI',
    flag: 'IDN',
  },
  {
    id: 'idn-muarasatui',
    name: 'MUARA SATUI',
    flag: 'IDN',
  },
  {
    id: 'idn-muncar',
    name: 'MUNCAR',
    flag: 'IDN',
  },
  {
    id: 'idn-muntok',
    name: 'MUNTOK',
    flag: 'IDN',
  },
  {
    id: 'idn-muria',
    name: 'MURIA',
    flag: 'IDN',
  },
  {
    id: 'idn-nabire',
    name: 'NABIRE',
    flag: 'IDN',
  },
  {
    id: 'idn-namlea',
    name: 'NAMLEA',
    flag: 'IDN',
  },
  {
    id: 'idn-pabelokan',
    name: 'PABELOKAN',
    flag: 'IDN',
  },
  {
    id: 'idn-padang',
    name: 'PADANG',
    flag: 'IDN',
  },
  {
    id: 'idn-paiton',
    name: 'PAITON',
    flag: 'IDN',
  },
  {
    id: 'idn-palabuhanratu',
    name: 'PALABUHAN RATU',
    flag: 'IDN',
  },
  {
    id: 'idn-palanggaanchorage',
    name: 'PALANGGA ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-palembang',
    name: 'PALEMBANG',
    flag: 'IDN',
  },
  {
    id: 'idn-palopo',
    name: 'PALOPO',
    flag: 'IDN',
  },
  {
    id: 'idn-pangkalanbun',
    name: 'PANGKALAN BUN',
    flag: 'IDN',
  },
  {
    id: 'idn-pangkalbalam',
    name: 'PANGKAL BALAM',
    flag: 'IDN',
  },
  {
    id: 'idn-panjang',
    name: 'PANJANG',
    flag: 'IDN',
  },
  {
    id: 'idn-pantoean',
    name: 'PANTOEAN',
    flag: 'IDN',
  },
  {
    id: 'idn-pantoloan',
    name: 'PANTOLOAN',
    flag: 'IDN',
  },
  {
    id: 'idn-parepare',
    name: 'PARE PARE',
    flag: 'IDN',
  },
  {
    id: 'idn-pariaman',
    name: 'PARIAMAN',
    flag: 'IDN',
  },
  {
    id: 'idn-pelintung',
    name: 'PELINTUNG',
    flag: 'IDN',
  },
  {
    id: 'idn-pemangkat',
    name: 'PEMANGKAT',
    flag: 'IDN',
  },
  {
    id: 'idn-perawang',
    name: 'PERAWANG',
    flag: 'IDN',
  },
  {
    id: 'idn-phewmofield',
    name: 'PHEWMO FIELD',
    flag: 'IDN',
  },
  {
    id: 'idn-plajuanchorage',
    name: 'PLAJU ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-pomako',
    name: 'POMAKO',
    flag: 'IDN',
  },
  {
    id: 'idn-pomalaa',
    name: 'POMALAA',
    flag: 'IDN',
  },
  {
    id: 'idn-pondokdadap',
    name: 'PONDOK DADAP',
    flag: 'IDN',
  },
  {
    id: 'idn-pontianak',
    name: 'PONTIANAK',
    flag: 'IDN',
  },
  {
    id: 'idn-prigi',
    name: 'PRIGI',
    flag: 'IDN',
  },
  {
    id: 'idn-probolinggo',
    name: 'PROBOLINGGO',
    flag: 'IDN',
  },
  {
    id: 'idn-pulausambu',
    name: 'PULAU SAMBU',
    flag: 'IDN',
  },
  {
    id: 'idn-reo',
    name: 'REO',
    flag: 'IDN',
  },
  {
    id: 'idn-sadeng',
    name: 'SADENG',
    flag: 'IDN',
  },
  {
    id: 'idn-samarinda',
    name: 'SAMARINDA',
    flag: 'IDN',
  },
  {
    id: 'idn-sampit',
    name: 'SAMPIT',
    flag: 'IDN',
  },
  {
    id: 'idn-santan',
    name: 'SANTAN',
    flag: 'IDN',
  },
  {
    id: 'idn-saumlaki',
    name: 'SAUMLAKI',
    flag: 'IDN',
  },
  {
    id: 'idn-sayoang',
    name: 'SAYOANG',
    flag: 'IDN',
  },
  {
    id: 'idn-semarang',
    name: 'SEMARANG',
    flag: 'IDN',
  },
  {
    id: 'idn-serui',
    name: 'SERUI',
    flag: 'IDN',
  },
  {
    id: 'idn-sibolga',
    name: 'SIBOLGA',
    flag: 'IDN',
  },
  {
    id: 'idn-sikakap',
    name: 'SIKAKAP',
    flag: 'IDN',
  },
  {
    id: 'idn-sorong',
    name: 'SORONG',
    flag: 'IDN',
  },
  {
    id: 'idn-sumberrejo',
    name: 'SUMBERREJO',
    flag: 'IDN',
  },
  {
    id: 'idn-sungailiat',
    name: 'SUNGAILIAT',
    flag: 'IDN',
  },
  {
    id: 'idn-sungaipakning',
    name: 'SUNGAI PAKNING',
    flag: 'IDN',
  },
  {
    id: 'idn-surabaya',
    name: 'SURABAYA',
    flag: 'IDN',
  },
  {
    id: 'idn-taboneoanchorage',
    name: 'TABONEO ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-tahuna',
    name: 'TAHUNA',
    flag: 'IDN',
  },
  {
    id: 'idn-tamperan',
    name: 'TAMPERAN',
    flag: 'IDN',
  },
  {
    id: 'idn-tangguhanchorage',
    name: 'TANGGUH ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjungbalaikarimun',
    name: 'TANJUNG BALAI KARIMUN',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjungbara',
    name: 'TANJUNG BARA',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjungbenete',
    name: 'TANJUNG BENETE',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjungbuli',
    name: 'TANJUNG BULI',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjungpemancingan',
    name: 'TANJUNG PEMANCINGAN',
    flag: 'IDN',
  },
  {
    id: 'idn-tanjunguban',
    name: 'TANJUNG UBAN',
    flag: 'IDN',
  },
  {
    id: 'idn-tarakan',
    name: 'TARAKAN',
    flag: 'IDN',
  },
  {
    id: 'idn-tarjun',
    name: 'TARJUN',
    flag: 'IDN',
  },
  {
    id: 'idn-tasikagung',
    name: 'TASIK AGUNG',
    flag: 'IDN',
  },
  {
    id: 'idn-tawang',
    name: 'TAWANG',
    flag: 'IDN',
  },
  {
    id: 'idn-tegal',
    name: 'TEGAL',
    flag: 'IDN',
  },
  {
    id: 'idn-telukbatang',
    name: 'TELUK BATANG',
    flag: 'IDN',
  },
  {
    id: 'idn-teluksemangkaanchorage',
    name: 'TELUK SEMANGKA ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-ternate',
    name: 'TERNATE',
    flag: 'IDN',
  },
  {
    id: 'idn-tobelo',
    name: 'TOBELO',
    flag: 'IDN',
  },
  {
    id: 'idn-tolitoli',
    name: 'TOLITOLI',
    flag: 'IDN',
  },
  {
    id: 'idn-tual',
    name: 'TUAL',
    flag: 'IDN',
  },
  {
    id: 'idn-tuban',
    name: 'TUBAN',
    flag: 'IDN',
  },
  {
    id: 'idn-waingapu',
    name: 'WAINGAPU',
    flag: 'IDN',
  },
  {
    id: 'idn-wayame',
    name: 'WAYAME',
    flag: 'IDN',
  },
  {
    id: 'idn-weda',
    name: 'WEDA',
    flag: 'IDN',
  },
  {
    id: 'idn-wini',
    name: 'WINI',
    flag: 'IDN',
  },
  {
    id: 'imn-peel',
    name: 'PEEL',
    flag: 'IMN',
  },
  {
    id: 'imn-porterin',
    name: 'PORT ERIN',
    flag: 'IMN',
  },
  {
    id: 'imn-portsaintmary',
    name: 'PORT SAINT MARY',
    flag: 'IMN',
  },
  {
    id: 'ind-alanganchorage',
    name: 'ALANG ANCHORAGE',
    flag: 'IND',
  },
  {
    id: 'ind-androth',
    name: 'ANDROTH',
    flag: 'IND',
  },
  {
    id: 'ind-bedi',
    name: 'BEDI',
    flag: 'IND',
  },
  {
    id: 'ind-chennai',
    name: 'CHENNAI',
    flag: 'IND',
  },
  {
    id: 'ind-dabhol',
    name: 'DABHOL',
    flag: 'IND',
  },
  {
    id: 'ind-dahej',
    name: 'DAHEJ',
    flag: 'IND',
  },
  {
    id: 'ind-dhamra',
    name: 'DHAMRA',
    flag: 'IND',
  },
  {
    id: 'ind-dharamtar',
    name: 'DHARAMTAR',
    flag: 'IND',
  },
  {
    id: 'ind-dighi',
    name: 'DIGHI',
    flag: 'IND',
  },
  {
    id: 'ind-ennore',
    name: 'ENNORE',
    flag: 'IND',
  },
  {
    id: 'ind-gangavaram',
    name: 'GANGAVARAM',
    flag: 'IND',
  },
  {
    id: 'ind-ghoghaanchorage',
    name: 'GHOGHA ANCHORAGE',
    flag: 'IND',
  },
  {
    id: 'ind-gopalpur',
    name: 'GOPALPUR',
    flag: 'IND',
  },
  {
    id: 'ind-haldia',
    name: 'HALDIA',
    flag: 'IND',
  },
  {
    id: 'ind-hazira',
    name: 'HAZIRA',
    flag: 'IND',
  },
  {
    id: 'ind-hutbay',
    name: 'HUTBAY',
    flag: 'IND',
  },
  {
    id: 'ind-jaigarh',
    name: 'JAIGARH',
    flag: 'IND',
  },
  {
    id: 'ind-jakhau',
    name: 'JAKHAU',
    flag: 'IND',
  },
  {
    id: 'ind-kandla',
    name: 'KANDLA',
    flag: 'IND',
  },
  {
    id: 'ind-karaikal',
    name: 'KARAIKAL',
    flag: 'IND',
  },
  {
    id: 'ind-karanje',
    name: 'KARANJE',
    flag: 'IND',
  },
  {
    id: 'ind-karwar',
    name: 'KARWAR',
    flag: 'IND',
  },
  {
    id: 'ind-kattupalli',
    name: 'KATTUPALLI',
    flag: 'IND',
  },
  {
    id: 'ind-kochi',
    name: 'KOCHI',
    flag: 'IND',
  },
  {
    id: 'ind-kolkata',
    name: 'KOLKATA',
    flag: 'IND',
  },
  {
    id: 'ind-krishnapatnam',
    name: 'KRISHNAPATNAM',
    flag: 'IND',
  },
  {
    id: 'ind-magdalla',
    name: 'MAGDALLA',
    flag: 'IND',
  },
  {
    id: 'ind-mangalore',
    name: 'MANGALORE',
    flag: 'IND',
  },
  {
    id: 'ind-mormugao',
    name: 'MORMUGAO',
    flag: 'IND',
  },
  {
    id: 'ind-muldwarka',
    name: 'MULDWARKA',
    flag: 'IND',
  },
  {
    id: 'ind-mumbai',
    name: 'MUMBAI',
    flag: 'IND',
  },
  {
    id: 'ind-mumbaihighfield',
    name: 'MUMBAI HIGH FIELD',
    flag: 'IND',
  },
  {
    id: 'ind-mundra',
    name: 'MUNDRA',
    flag: 'IND',
  },
  {
    id: 'ind-navlakhi',
    name: 'NAVLAKHI',
    flag: 'IND',
  },
  {
    id: 'ind-nhavasheva',
    name: 'NHAVA SHEVA',
    flag: 'IND',
  },
  {
    id: 'ind-okha',
    name: 'OKHA',
    flag: 'IND',
  },
  {
    id: 'ind-panaji',
    name: 'PANAJI',
    flag: 'IND',
  },
  {
    id: 'ind-paradip',
    name: 'PARADIP',
    flag: 'IND',
  },
  {
    id: 'ind-pipavav',
    name: 'PIPAVAV',
    flag: 'IND',
  },
  {
    id: 'ind-porbandar',
    name: 'PORBANDAR',
    flag: 'IND',
  },
  {
    id: 'ind-portblair',
    name: 'PORT BLAIR',
    flag: 'IND',
  },
  {
    id: 'ind-ratnagiri',
    name: 'RATNAGIRI',
    flag: 'IND',
  },
  {
    id: 'ind-sagar',
    name: 'SAGAR',
    flag: 'IND',
  },
  {
    id: 'ind-sikka',
    name: 'SIKKA',
    flag: 'IND',
  },
  {
    id: 'ind-sikkaanchorage',
    name: 'SIKKA ANCHORAGE',
    flag: 'IND',
  },
  {
    id: 'ind-tuticorin',
    name: 'TUTICORIN',
    flag: 'IND',
  },
  {
    id: 'ind-vadinar',
    name: 'VADINAR',
    flag: 'IND',
  },
  {
    id: 'ind-vizag',
    name: 'VIZAG',
    flag: 'IND',
  },
  {
    id: 'irl-amber',
    name: 'AMBER',
    flag: 'IRL',
  },
  {
    id: 'irl-arklow',
    name: 'ARKLOW',
    flag: 'IRL',
  },
  {
    id: 'irl-aughinish',
    name: 'AUGHINISH',
    flag: 'IRL',
  },
  {
    id: 'irl-ballycotton',
    name: 'BALLYCOTTON',
    flag: 'IRL',
  },
  {
    id: 'irl-baltimore',
    name: 'BALTIMORE',
    flag: 'IRL',
  },
  {
    id: 'irl-bantrybay',
    name: 'BANTRY BAY',
    flag: 'IRL',
  },
  {
    id: 'irl-burtonport',
    name: 'BURTONPORT',
    flag: 'IRL',
  },
  {
    id: 'irl-cork',
    name: 'CORK',
    flag: 'IRL',
  },
  {
    id: 'irl-courtmacsherry',
    name: 'COURTMACSHERRY',
    flag: 'IRL',
  },
  {
    id: 'irl-crookhaven',
    name: 'CROOKHAVEN',
    flag: 'IRL',
  },
  {
    id: 'irl-crosshaven',
    name: 'CROSSHAVEN',
    flag: 'IRL',
  },
  {
    id: 'irl-dingle',
    name: 'DINGLE',
    flag: 'IRL',
  },
  {
    id: 'irl-drogheda',
    name: 'DROGHEDA',
    flag: 'IRL',
  },
  {
    id: 'irl-dublin',
    name: 'DUBLIN',
    flag: 'IRL',
  },
  {
    id: 'irl-dundalk',
    name: 'DUNDALK',
    flag: 'IRL',
  },
  {
    id: 'irl-dunlaoghaire',
    name: 'DUN LAOGHAIRE',
    flag: 'IRL',
  },
  {
    id: 'irl-dunmoreeast',
    name: 'DUNMORE EAST',
    flag: 'IRL',
  },
  {
    id: 'irl-fenit',
    name: 'FENIT',
    flag: 'IRL',
  },
  {
    id: 'irl-foynes',
    name: 'FOYNES',
    flag: 'IRL',
  },
  {
    id: 'irl-greencastle',
    name: 'GREENCASTLE',
    flag: 'IRL',
  },
  {
    id: 'irl-greenore',
    name: 'GREENORE',
    flag: 'IRL',
  },
  {
    id: 'irl-greystones',
    name: 'GREYSTONES',
    flag: 'IRL',
  },
  {
    id: 'irl-howth',
    name: 'HOWTH',
    flag: 'IRL',
  },
  {
    id: 'irl-kilmorequay',
    name: 'KILMORE QUAY',
    flag: 'IRL',
  },
  {
    id: 'irl-kinsale',
    name: 'KINSALE',
    flag: 'IRL',
  },
  {
    id: 'irl-limerick',
    name: 'LIMERICK',
    flag: 'IRL',
  },
  {
    id: 'irl-malahide',
    name: 'MALAHIDE',
    flag: 'IRL',
  },
  {
    id: 'irl-moneypoint',
    name: 'MONEY POINT',
    flag: 'IRL',
  },
  {
    id: 'irl-newross',
    name: 'NEW ROSS',
    flag: 'IRL',
  },
  {
    id: 'irl-rosaveel',
    name: 'ROSAVEEL',
    flag: 'IRL',
  },
  {
    id: 'irl-rosslare',
    name: 'ROSSLARE',
    flag: 'IRL',
  },
  {
    id: 'irl-rushbrooke',
    name: 'RUSHBROOKE',
    flag: 'IRL',
  },
  {
    id: 'irl-skerries',
    name: 'SKERRIES',
    flag: 'IRL',
  },
  {
    id: 'irl-sligo',
    name: 'SLIGO',
    flag: 'IRL',
  },
  {
    id: 'irl-waterford',
    name: 'WATERFORD',
    flag: 'IRL',
  },
  {
    id: 'irl-whitegate',
    name: 'WHITEGATE',
    flag: 'IRL',
  },
  {
    id: 'irl-wicklow',
    name: 'WICKLOW',
    flag: 'IRL',
  },
  {
    id: 'irl-youghal',
    name: 'YOUGHAL',
    flag: 'IRL',
  },
  {
    id: 'irn-abadan',
    name: 'ABADAN',
    flag: 'IRN',
  },
  {
    id: 'irn-amirabad',
    name: 'AMIRABAD',
    flag: 'IRN',
  },
  {
    id: 'irn-amirabadanchorage',
    name: 'AMIRABAD ANCHORAGE',
    flag: 'IRN',
  },
  {
    id: 'irn-anzali',
    name: 'ANZALI',
    flag: 'IRN',
  },
  {
    id: 'irn-anzalianchorage',
    name: 'ANZALI ANCHORAGE',
    flag: 'IRN',
  },
  {
    id: 'irn-asaluyeh',
    name: 'ASALUYEH',
    flag: 'IRN',
  },
  {
    id: 'irn-bahregan',
    name: 'BAHREGAN',
    flag: 'IRN',
  },
  {
    id: 'irn-bandarabbas',
    name: 'BANDAR ABBAS',
    flag: 'IRN',
  },
  {
    id: 'irn-bandarimamkhomeini',
    name: 'BANDAR IMAM KHOMEINI',
    flag: 'IRN',
  },
  {
    id: 'irn-bandartaherioffshoreterminal',
    name: 'BANDAR TAHERI OFFSHORE TERMINAL',
    flag: 'IRN',
  },
  {
    id: 'irn-chabahar',
    name: 'CHABAHAR',
    flag: 'IRN',
  },
  {
    id: 'irn-charak',
    name: 'CHARAK',
    flag: 'IRN',
  },
  {
    id: 'irn-dayyer',
    name: 'DAYYER',
    flag: 'IRN',
  },
  {
    id: 'irn-fereydoonkenar',
    name: 'FEREYDOONKENAR',
    flag: 'IRN',
  },
  {
    id: 'irn-foroozanfield',
    name: 'FOROOZAN FIELD',
    flag: 'IRN',
  },
  {
    id: 'irn-genaveh',
    name: 'GENAVEH',
    flag: 'IRN',
  },
  {
    id: 'irn-hengamfield',
    name: 'HENGAM FIELD',
    flag: 'IRN',
  },
  {
    id: 'irn-isoico',
    name: 'ISOICO',
    flag: 'IRN',
  },
  {
    id: 'irn-khark',
    name: 'KHARK',
    flag: 'IRN',
  },
  {
    id: 'irn-khorramshahr',
    name: 'KHORRAMSHAHR',
    flag: 'IRN',
  },
  {
    id: 'irn-kish',
    name: 'KISH',
    flag: 'IRN',
  },
  {
    id: 'irn-lavan',
    name: 'LAVAN',
    flag: 'IRN',
  },
  {
    id: 'irn-lengeh',
    name: 'LENGEH',
    flag: 'IRN',
  },
  {
    id: 'irn-mahshahr',
    name: 'MAHSHAHR',
    flag: 'IRN',
  },
  {
    id: 'irn-nowshahr',
    name: 'NOWSHAHR',
    flag: 'IRN',
  },
  {
    id: 'irn-pohl',
    name: 'POHL',
    flag: 'IRN',
  },
  {
    id: 'irn-queshm',
    name: 'QUESHM',
    flag: 'IRN',
  },
  {
    id: 'irn-rajaei',
    name: 'RAJAEI',
    flag: 'IRN',
  },
  {
    id: 'irn-sirri',
    name: 'SIRRI',
    flag: 'IRN',
  },
  {
    id: 'irn-tombak',
    name: 'TOMBAK',
    flag: 'IRN',
  },
  {
    id: 'irq-al-basrahoilterminal',
    name: 'AL-BASRAH OIL TERMINAL',
    flag: 'IRQ',
  },
  {
    id: 'irq-alfawanchorage',
    name: 'AL FAW ANCHORAGE',
    flag: 'IRQ',
  },
  {
    id: 'irq-basrah',
    name: 'BASRAH',
    flag: 'IRQ',
  },
  {
    id: 'irq-khawralzubairlngterminal',
    name: 'KHAWR AL ZUBAIR LNG TERMINAL',
    flag: 'IRQ',
  },
  {
    id: 'irq-khoralzubair',
    name: 'KHOR AL ZUBAIR',
    flag: 'IRQ',
  },
  {
    id: 'irq-ummqasr',
    name: 'UMM QASR',
    flag: 'IRQ',
  },
  {
    id: 'isl-bakkafjorddur',
    name: 'BAKKAFJORDDUR',
    flag: 'ISL',
  },
  {
    id: 'isl-bildudalur',
    name: 'BILDUDALUR',
    flag: 'ISL',
  },
  {
    id: 'isl-breiddalsvik',
    name: 'BREIDDALSVIK',
    flag: 'ISL',
  },
  {
    id: 'isl-dalvik',
    name: 'DALVIK',
    flag: 'ISL',
  },
  {
    id: 'isl-djupivogur',
    name: 'DJUPIVOGUR',
    flag: 'ISL',
  },
  {
    id: 'isl-flateyri',
    name: 'FLATEYRI',
    flag: 'ISL',
  },
  {
    id: 'isl-gdansk',
    name: 'GDANSK',
    flag: 'ISL',
  },
  {
    id: 'isl-grundartangi',
    name: 'GRUNDARTANGI',
    flag: 'ISL',
  },
  {
    id: 'isl-hofn',
    name: 'HOFN',
    flag: 'ISL',
  },
  {
    id: 'isl-holmavik',
    name: 'HOLMAVIK',
    flag: 'ISL',
  },
  {
    id: 'isl-hrisey',
    name: 'HRISEY',
    flag: 'ISL',
  },
  {
    id: 'isl-husavik',
    name: 'HUSAVIK',
    flag: 'ISL',
  },
  {
    id: 'isl-nordufjordur',
    name: 'NORDUFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'isl-olafsfjordur',
    name: 'OLAFSFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'isl-olafsvik',
    name: 'OLAFSVIK',
    flag: 'ISL',
  },
  {
    id: 'isl-patreksfjordur',
    name: 'PATREKSFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'isl-rif',
    name: 'RIF',
    flag: 'ISL',
  },
  {
    id: 'isl-sandgerdi',
    name: 'SANDGERDI',
    flag: 'ISL',
  },
  {
    id: 'isl-siglufjordur',
    name: 'SIGLUFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'isl-skagastrond',
    name: 'SKAGASTROND',
    flag: 'ISL',
  },
  {
    id: 'isl-straumsvik',
    name: 'STRAUMSVIK',
    flag: 'ISL',
  },
  {
    id: 'isl-stykkisholmur',
    name: 'STYKKISHOLMUR',
    flag: 'ISL',
  },
  {
    id: 'isl-sudavik',
    name: 'SUDAVIK',
    flag: 'ISL',
  },
  {
    id: 'isl-sudureyri',
    name: 'SUDUREYRI',
    flag: 'ISL',
  },
  {
    id: 'isl-thingeyri',
    name: 'THINGEYRI',
    flag: 'ISL',
  },
  {
    id: 'isl-thorlakshofn',
    name: 'THORLAKSHOFN',
    flag: 'ISL',
  },
  {
    id: 'isr-ashdod',
    name: 'ASHDOD',
    flag: 'ISR',
  },
  {
    id: 'isr-ashkelon',
    name: 'ASHKELON',
    flag: 'ISR',
  },
  {
    id: 'isr-eilat',
    name: 'EILAT',
    flag: 'ISR',
  },
  {
    id: 'isr-hadera',
    name: 'HADERA',
    flag: 'ISR',
  },
  {
    id: 'isr-haifa',
    name: 'HAIFA',
    flag: 'ISR',
  },
  {
    id: 'isr-telaviv-yafo',
    name: 'TEL AVIV-YAFO',
    flag: 'ISR',
  },
  {
    id: 'ita-acciaroli',
    name: 'ACCIAROLI',
    flag: 'ITA',
  },
  {
    id: 'ita-agropoli',
    name: 'AGROPOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-alassio',
    name: 'ALASSIO',
    flag: 'ITA',
  },
  {
    id: 'ita-alghero',
    name: 'ALGHERO',
    flag: 'ITA',
  },
  {
    id: 'ita-amalfi',
    name: 'AMALFI',
    flag: 'ITA',
  },
  {
    id: 'ita-ancona',
    name: 'ANCONA',
    flag: 'ITA',
  },
  {
    id: 'ita-anzio',
    name: 'ANZIO',
    flag: 'ITA',
  },
  {
    id: 'ita-arbatax',
    name: 'ARBATAX',
    flag: 'ITA',
  },
  {
    id: 'ita-arechi',
    name: 'ARECHI',
    flag: 'ITA',
  },
  {
    id: 'ita-augusta',
    name: 'AUGUSTA',
    flag: 'ITA',
  },
  {
    id: 'ita-bari',
    name: 'BARI',
    flag: 'ITA',
  },
  {
    id: 'ita-barletta',
    name: 'BARLETTA',
    flag: 'ITA',
  },
  {
    id: 'ita-bisceglie',
    name: 'BISCEGLIE',
    flag: 'ITA',
  },
  {
    id: 'ita-boccadimagra',
    name: 'BOCCA DI MAGRA',
    flag: 'ITA',
  },
  {
    id: 'ita-bosa',
    name: 'BOSA',
    flag: 'ITA',
  },
  {
    id: 'ita-brindisi',
    name: 'BRINDISI',
    flag: 'ITA',
  },
  {
    id: 'ita-brucoli',
    name: 'BRUCOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-budelli',
    name: 'BUDELLI',
    flag: 'ITA',
  },
  {
    id: 'ita-cagliari',
    name: 'CAGLIARI',
    flag: 'ITA',
  },
  {
    id: 'ita-calagalera',
    name: 'CALA GALERA',
    flag: 'ITA',
  },
  {
    id: 'ita-calagonone',
    name: 'CALA GONONE',
    flag: 'ITA',
  },
  {
    id: 'ita-calaluna',
    name: 'CALA LUNA',
    flag: 'ITA',
  },
  {
    id: 'ita-calasetta',
    name: 'CALASETTA',
    flag: 'ITA',
  },
  {
    id: 'ita-camogli',
    name: 'CAMOGLI',
    flag: 'ITA',
  },
  {
    id: 'ita-cannigione',
    name: 'CANNIGIONE',
    flag: 'ITA',
  },
  {
    id: 'ita-capotesta',
    name: 'CAPO TESTA',
    flag: 'ITA',
  },
  {
    id: 'ita-caprera',
    name: 'CAPRERA',
    flag: 'ITA',
  },
  {
    id: 'ita-capri',
    name: 'CAPRI',
    flag: 'ITA',
  },
  {
    id: 'ita-carloforte',
    name: 'CARLOFORTE',
    flag: 'ITA',
  },
  {
    id: 'ita-castellammaredistabia',
    name: 'CASTELLAMMARE DI STABIA',
    flag: 'ITA',
  },
  {
    id: 'ita-catania',
    name: 'CATANIA',
    flag: 'ITA',
  },
  {
    id: 'ita-cecina',
    name: 'CECINA',
    flag: 'ITA',
  },
  {
    id: 'ita-cefalu',
    name: 'CEFALU',
    flag: 'ITA',
  },
  {
    id: 'ita-cetara',
    name: 'CETARA',
    flag: 'ITA',
  },
  {
    id: 'ita-chiavari',
    name: 'CHIAVARI',
    flag: 'ITA',
  },
  {
    id: 'ita-chioggia',
    name: 'CHIOGGIA',
    flag: 'ITA',
  },
  {
    id: 'ita-ciromarina',
    name: 'CIRO MARINA',
    flag: 'ITA',
  },
  {
    id: 'ita-civitanova',
    name: 'CIVITANOVA',
    flag: 'ITA',
  },
  {
    id: 'ita-civitavecchia',
    name: 'CIVITAVECCHIA',
    flag: 'ITA',
  },
  {
    id: 'ita-coriglianocalabro',
    name: 'CORIGLIANO CALABRO',
    flag: 'ITA',
  },
  {
    id: 'ita-crotone',
    name: 'CROTONE',
    flag: 'ITA',
  },
  {
    id: 'ita-darsenasabbiadoro',
    name: 'DARSENA SABBIADORO',
    flag: 'ITA',
  },
  {
    id: 'ita-falconara',
    name: 'FALCONARA',
    flag: 'ITA',
  },
  {
    id: 'ita-fanocanalealbani',
    name: 'FANO CANALE ALBANI',
    flag: 'ITA',
  },
  {
    id: 'ita-favignana',
    name: 'FAVIGNANA',
    flag: 'ITA',
  },
  {
    id: 'ita-filicudi',
    name: 'FILICUDI',
    flag: 'ITA',
  },
  {
    id: 'ita-fiumicino',
    name: 'FIUMICINO',
    flag: 'ITA',
  },
  {
    id: 'ita-fontanebianche',
    name: 'FONTANE BIANCHE',
    flag: 'ITA',
  },
  {
    id: 'ita-formia',
    name: 'FORMIA',
    flag: 'ITA',
  },
  {
    id: 'ita-fortedeimarmi',
    name: 'FORTE DEI MARMI',
    flag: 'ITA',
  },
  {
    id: 'ita-gaeta',
    name: 'GAETA',
    flag: 'ITA',
  },
  {
    id: 'ita-gallipoli',
    name: 'GALLIPOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-gela',
    name: 'GELA',
    flag: 'ITA',
  },
  {
    id: 'ita-genoa',
    name: 'GENOA',
    flag: 'ITA',
  },
  {
    id: 'ita-giardini-naxos',
    name: 'GIARDINI-NAXOS',
    flag: 'ITA',
  },
  {
    id: 'ita-giglioporto',
    name: 'GIGLIO PORTO',
    flag: 'ITA',
  },
  {
    id: 'ita-gioiatauro',
    name: 'GIOIA TAURO',
    flag: 'ITA',
  },
  {
    id: 'ita-giulianova',
    name: 'GIULIANOVA',
    flag: 'ITA',
  },
  {
    id: 'ita-golfoaranci',
    name: 'GOLFO ARANCI',
    flag: 'ITA',
  },
  {
    id: 'ita-imperia',
    name: 'IMPERIA',
    flag: 'ITA',
  },
  {
    id: 'ita-ischia',
    name: 'ISCHIA',
    flag: 'ITA',
  },
  {
    id: 'ita-isoletremiti',
    name: 'ISOLE TREMITI',
    flag: 'ITA',
  },
  {
    id: 'ita-laccoameno',
    name: 'LACCO AMENO',
    flag: 'ITA',
  },
  {
    id: 'ita-lamaddalena',
    name: 'LA MADDALENA',
    flag: 'ITA',
  },
  {
    id: 'ita-lampedusa',
    name: 'LAMPEDUSA',
    flag: 'ITA',
  },
  {
    id: 'ita-lampedusaanchorage',
    name: 'LAMPEDUSA ANCHORAGE',
    flag: 'ITA',
  },
  {
    id: 'ita-laspezia',
    name: 'LA SPEZIA',
    flag: 'ITA',
  },
  {
    id: 'ita-lavagna',
    name: 'LAVAGNA',
    flag: 'ITA',
  },
  {
    id: 'ita-lecastella',
    name: 'LE CASTELLA',
    flag: 'ITA',
  },
  {
    id: 'ita-lerici',
    name: 'LERICI',
    flag: 'ITA',
  },
  {
    id: 'ita-licata',
    name: 'LICATA',
    flag: 'ITA',
  },
  {
    id: 'ita-linosa',
    name: 'LINOSA',
    flag: 'ITA',
  },
  {
    id: 'ita-lipari',
    name: 'LIPARI',
    flag: 'ITA',
  },
  {
    id: 'ita-liparianchorage',
    name: 'LIPARI ANCHORAGE',
    flag: 'ITA',
  },
  {
    id: 'ita-livorno',
    name: 'LIVORNO',
    flag: 'ITA',
  },
  {
    id: 'ita-loano',
    name: 'LOANO',
    flag: 'ITA',
  },
  {
    id: 'ita-manfredonia',
    name: 'MANFREDONIA',
    flag: 'ITA',
  },
  {
    id: 'ita-marcianamarina',
    name: 'MARCIANA MARINA',
    flag: 'ITA',
  },
  {
    id: 'ita-marettimo',
    name: 'MARETTIMO',
    flag: 'ITA',
  },
  {
    id: 'ita-marina4s.p.a.',
    name: 'MARINA 4 S.P.A.',
    flag: 'ITA',
  },
  {
    id: 'ita-marinachiaiolella',
    name: 'MARINA CHIAIOLELLA',
    flag: 'ITA',
  },
  {
    id: 'ita-marinadicampo',
    name: 'MARINA DI CAMPO',
    flag: 'ITA',
  },
  {
    id: 'ita-marinadicarrara',
    name: 'MARINA DI CARRARA',
    flag: 'ITA',
  },
  {
    id: 'ita-marinadipisa',
    name: 'MARINA DI PISA',
    flag: 'ITA',
  },
  {
    id: 'ita-marinadiragusa',
    name: 'MARINA DI RAGUSA',
    flag: 'ITA',
  },
  {
    id: 'ita-marinadisalivoli',
    name: 'MARINA DI SALIVOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-maristella',
    name: 'MARISTELLA',
    flag: 'ITA',
  },
  {
    id: 'ita-marsala',
    name: 'MARSALA',
    flag: 'ITA',
  },
  {
    id: 'ita-marzamemi',
    name: 'MARZAMEMI',
    flag: 'ITA',
  },
  {
    id: 'ita-mazaradelvallo',
    name: 'MAZARA DEL VALLO',
    flag: 'ITA',
  },
  {
    id: 'ita-messina',
    name: 'MESSINA',
    flag: 'ITA',
  },
  {
    id: 'ita-milazzo',
    name: 'MILAZZO',
    flag: 'ITA',
  },
  {
    id: 'ita-molfetta',
    name: 'MOLFETTA',
    flag: 'ITA',
  },
  {
    id: 'ita-mondello',
    name: 'MONDELLO',
    flag: 'ITA',
  },
  {
    id: 'ita-monfalcone',
    name: 'MONFALCONE',
    flag: 'ITA',
  },
  {
    id: 'ita-monopoli',
    name: 'MONOPOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-napoli',
    name: 'NAPOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-olbia',
    name: 'OLBIA',
    flag: 'ITA',
  },
  {
    id: 'ita-oristano',
    name: 'ORISTANO',
    flag: 'ITA',
  },
  {
    id: 'ita-ortona',
    name: 'ORTONA',
    flag: 'ITA',
  },
  {
    id: 'ita-otranto',
    name: 'OTRANTO',
    flag: 'ITA',
  },
  {
    id: 'ita-palermo',
    name: 'PALERMO',
    flag: 'ITA',
  },
  {
    id: 'ita-palermoanchorage',
    name: 'PALERMO ANCHORAGE',
    flag: 'ITA',
  },
  {
    id: 'ita-panarea',
    name: 'PANAREA',
    flag: 'ITA',
  },
  {
    id: 'ita-pantelleria',
    name: 'PANTELLERIA',
    flag: 'ITA',
  },
  {
    id: 'ita-pesaro',
    name: 'PESARO',
    flag: 'ITA',
  },
  {
    id: 'ita-pescara',
    name: 'PESCARA',
    flag: 'ITA',
  },
  {
    id: 'ita-piombino',
    name: 'PIOMBINO',
    flag: 'ITA',
  },
  {
    id: 'ita-ponza',
    name: 'PONZA',
    flag: 'ITA',
  },
  {
    id: 'ita-porteponteromano',
    name: 'PORTE PONTE ROMANO',
    flag: 'ITA',
  },
  {
    id: 'ita-porticellos.flavia',
    name: 'PORTICELLO S. FLAVIA',
    flag: 'ITA',
  },
  {
    id: 'ita-portoazzurro',
    name: 'PORTO AZZURRO',
    flag: 'ITA',
  },
  {
    id: 'ita-portocervo',
    name: 'PORTO CERVO',
    flag: 'ITA',
  },
  {
    id: 'ita-portoempedocle',
    name: 'PORTO EMPEDOCLE',
    flag: 'ITA',
  },
  {
    id: 'ita-portoferraio',
    name: 'PORTO FERRAIO',
    flag: 'ITA',
  },
  {
    id: 'ita-portofino',
    name: 'PORTOFINO',
    flag: 'ITA',
  },
  {
    id: 'ita-portogaribaldi',
    name: 'PORTO GARIBALDI',
    flag: 'ITA',
  },
  {
    id: 'ita-portoliscia',
    name: 'PORTO LISCIA',
    flag: 'ITA',
  },
  {
    id: 'ita-portonogaro',
    name: 'PORTO NOGARO',
    flag: 'ITA',
  },
  {
    id: 'ita-portopalo',
    name: 'PORTOPALO',
    flag: 'ITA',
  },
  {
    id: 'ita-portopila',
    name: 'PORTO PILA',
    flag: 'ITA',
  },
  {
    id: 'ita-portopino',
    name: 'PORTO PINO',
    flag: 'ITA',
  },
  {
    id: 'ita-portorotondo',
    name: 'PORTO ROTONDO',
    flag: 'ITA',
  },
  {
    id: 'ita-portosangiorgio',
    name: 'PORTO SAN GIORGIO',
    flag: 'ITA',
  },
  {
    id: 'ita-portosantostefano',
    name: 'PORTO SANTO STEFANO',
    flag: 'ITA',
  },
  {
    id: 'ita-portotorres',
    name: 'PORTO TORRES',
    flag: 'ITA',
  },
  {
    id: 'ita-portovecchio',
    name: 'PORTO VECCHIO',
    flag: 'ITA',
  },
  {
    id: 'ita-portovenere',
    name: 'PORTOVENERE',
    flag: 'ITA',
  },
  {
    id: 'ita-portovesme',
    name: 'PORTO VESME',
    flag: 'ITA',
  },
  {
    id: 'ita-positano',
    name: 'POSITANO',
    flag: 'ITA',
  },
  {
    id: 'ita-pozzallo',
    name: 'POZZALLO',
    flag: 'ITA',
  },
  {
    id: 'ita-pozzuoli',
    name: 'POZZUOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-procida',
    name: 'PROCIDA',
    flag: 'ITA',
  },
  {
    id: 'ita-ravenna',
    name: 'RAVENNA',
    flag: 'ITA',
  },
  {
    id: 'ita-reggiocalabria',
    name: 'REGGIO CALABRIA',
    flag: 'ITA',
  },
  {
    id: 'ita-rimini',
    name: 'RIMINI',
    flag: 'ITA',
  },
  {
    id: 'ita-riposto',
    name: 'RIPOSTO',
    flag: 'ITA',
  },
  {
    id: 'ita-roccellaionica',
    name: 'ROCCELLA IONICA',
    flag: 'ITA',
  },
  {
    id: 'ita-rodigarganico',
    name: 'RODI GARGANICO',
    flag: 'ITA',
  },
  {
    id: 'ita-rosignanosolvay',
    name: 'ROSIGNANO SOLVAY',
    flag: 'ITA',
  },
  {
    id: 'ita-salerno',
    name: 'SALERNO',
    flag: 'ITA',
  },
  {
    id: 'ita-salina',
    name: 'SALINA',
    flag: 'ITA',
  },
  {
    id: 'ita-sanbenedettodeltronto',
    name: 'SAN BENEDETTO DEL TRONTO',
    flag: 'ITA',
  },
  {
    id: 'ita-sanfelicecirceo',
    name: 'SAN FELICE CIRCEO',
    flag: 'ITA',
  },
  {
    id: 'ita-sanlorenzoalmare',
    name: 'SAN LORENZO AL MARE',
    flag: 'ITA',
  },
  {
    id: 'ita-sanremo',
    name: 'SANREMO',
    flag: 'ITA',
  },
  {
    id: "ita-sant'angelo",
    name: "SANT'ANGELO",
    flag: 'ITA',
  },
  {
    id: 'ita-santagatamilitello',
    name: 'SANT AGATA MILITELLO',
    flag: 'ITA',
  },
  {
    id: 'ita-santamariadileuca',
    name: 'SANTA MARIA DI LEUCA',
    flag: 'ITA',
  },
  {
    id: 'ita-santamarinella',
    name: 'SANTA MARINELLA',
    flag: 'ITA',
  },
  {
    id: 'ita-santapanagia',
    name: 'SANTA PANAGIA',
    flag: 'ITA',
  },
  {
    id: 'ita-santateresagallura',
    name: 'SANTA TERESA GALLURA',
    flag: 'ITA',
  },
  {
    id: 'ita-santostefano',
    name: 'SANTO STEFANO',
    flag: 'ITA',
  },
  {
    id: 'ita-sanvitolocapo',
    name: 'SAN VITO LO CAPO',
    flag: 'ITA',
  },
  {
    id: 'ita-sarroch',
    name: 'SARROCH',
    flag: 'ITA',
  },
  {
    id: 'ita-savona',
    name: 'SAVONA',
    flag: 'ITA',
  },
  {
    id: 'ita-sciacca',
    name: 'SCIACCA',
    flag: 'ITA',
  },
  {
    id: 'ita-scilla',
    name: 'SCILLA',
    flag: 'ITA',
  },
  {
    id: 'ita-scoglitti',
    name: 'SCOGLITTI',
    flag: 'ITA',
  },
  {
    id: 'ita-sestrilevante',
    name: 'SESTRI LEVANTE',
    flag: 'ITA',
  },
  {
    id: 'ita-siracusa',
    name: 'SIRACUSA',
    flag: 'ITA',
  },
  {
    id: 'ita-sistiana',
    name: 'SISTIANA',
    flag: 'ITA',
  },
  {
    id: 'ita-sorrento',
    name: 'SORRENTO',
    flag: 'ITA',
  },
  {
    id: 'ita-stintino',
    name: 'STINTINO',
    flag: 'ITA',
  },
  {
    id: 'ita-stintinostill',
    name: 'STINTINO STILL',
    flag: 'ITA',
  },
  {
    id: 'ita-stromboli',
    name: 'STROMBOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-taranto',
    name: 'TARANTO',
    flag: 'ITA',
  },
  {
    id: 'ita-tavolara',
    name: 'TAVOLARA',
    flag: 'ITA',
  },
  {
    id: 'ita-terminiimerese',
    name: 'TERMINI IMERESE',
    flag: 'ITA',
  },
  {
    id: 'ita-terminiimereseanchorage',
    name: 'TERMINI IMERESE ANCHORAGE',
    flag: 'ITA',
  },
  {
    id: 'ita-termoli',
    name: 'TERMOLI',
    flag: 'ITA',
  },
  {
    id: 'ita-terrasini',
    name: 'TERRASINI',
    flag: 'ITA',
  },
  {
    id: 'ita-torreannunziata',
    name: 'TORRE ANNUNZIATA',
    flag: 'ITA',
  },
  {
    id: 'ita-torredelgreco',
    name: 'TORRE DEL GRECO',
    flag: 'ITA',
  },
  {
    id: 'ita-trapani',
    name: 'TRAPANI',
    flag: 'ITA',
  },
  {
    id: 'ita-trieste',
    name: 'TRIESTE',
    flag: 'ITA',
  },
  {
    id: 'ita-tropea',
    name: 'TROPEA',
    flag: 'ITA',
  },
  {
    id: 'ita-ustica',
    name: 'USTICA',
    flag: 'ITA',
  },
  {
    id: 'ita-vadoligure',
    name: 'VADO LIGURE',
    flag: 'ITA',
  },
  {
    id: 'ita-varazze',
    name: 'VARAZZE',
    flag: 'ITA',
  },
  {
    id: 'ita-vasto',
    name: 'VASTO',
    flag: 'ITA',
  },
  {
    id: 'ita-venice',
    name: 'VENICE',
    flag: 'ITA',
  },
  {
    id: 'ita-ventotene',
    name: 'VENTOTENE',
    flag: 'ITA',
  },
  {
    id: 'ita-viareggio',
    name: 'VIAREGGIO',
    flag: 'ITA',
  },
  {
    id: 'ita-vibovalentia',
    name: 'VIBO VALENTIA',
    flag: 'ITA',
  },
  {
    id: 'ita-vieste',
    name: 'VIESTE',
    flag: 'ITA',
  },
  {
    id: 'ita-vulcano',
    name: 'VULCANO',
    flag: 'ITA',
  },
  {
    id: 'jam-montegobay',
    name: 'MONTEGO BAY',
    flag: 'JAM',
  },
  {
    id: 'jam-ochorios',
    name: 'OCHO RIOS',
    flag: 'JAM',
  },
  {
    id: 'jam-portantonio',
    name: 'PORT ANTONIO',
    flag: 'JAM',
  },
  {
    id: 'jam-portesquivel',
    name: 'PORT ESQUIVEL',
    flag: 'JAM',
  },
  {
    id: 'jam-portkaiser',
    name: 'PORT KAISER',
    flag: 'JAM',
  },
  {
    id: 'jam-portlandbight',
    name: 'PORTLAND BIGHT',
    flag: 'JAM',
  },
  {
    id: 'jam-portrhoades',
    name: 'PORT RHOADES',
    flag: 'JAM',
  },
  {
    id: 'jam-portroyal',
    name: 'PORT ROYAL',
    flag: 'JAM',
  },
  {
    id: 'jam-riobueno',
    name: 'RIO BUENO',
    flag: 'JAM',
  },
  {
    id: 'jam-rockypoint',
    name: 'ROCKY POINT',
    flag: 'JAM',
  },
  {
    id: 'jor-aqaba',
    name: 'AQABA',
    flag: 'JOR',
  },
  {
    id: 'jor-aqabaindustrial',
    name: 'AQABA INDUSTRIAL',
    flag: 'JOR',
  },
  {
    id: 'jpn-aioi',
    name: 'AIOI',
    flag: 'JPN',
  },
  {
    id: 'jpn-akadomarianchorage',
    name: 'AKADOMARI ANCHORAGE',
    flag: 'JPN',
  },
  {
    id: 'jpn-akita',
    name: 'AKITA',
    flag: 'JPN',
  },
  {
    id: 'jpn-akitafunagawa',
    name: 'AKITAFUNAGAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-ako',
    name: 'AKO',
    flag: 'JPN',
  },
  {
    id: 'jpn-anegasaki',
    name: 'ANEGASAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-aomori',
    name: 'AOMORI',
    flag: 'JPN',
  },
  {
    id: 'jpn-atami',
    name: 'ATAMI',
    flag: 'JPN',
  },
  {
    id: 'jpn-beppu',
    name: 'BEPPU',
    flag: 'JPN',
  },
  {
    id: 'jpn-chiba',
    name: 'CHIBA',
    flag: 'JPN',
  },
  {
    id: 'jpn-chofu',
    name: 'CHOFU',
    flag: 'JPN',
  },
  {
    id: 'jpn-choshi',
    name: 'CHOSHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-fuke',
    name: 'FUKE',
    flag: 'JPN',
  },
  {
    id: 'jpn-fukui',
    name: 'FUKUI',
    flag: 'JPN',
  },
  {
    id: 'jpn-fukura',
    name: 'FUKURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-fukuyama',
    name: 'FUKUYAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-funabashi',
    name: 'FUNABASHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-fushikitoyama',
    name: 'FUSHIKITOYAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hakatashima',
    name: 'HAKATASHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hakodate',
    name: 'HAKODATE',
    flag: 'JPN',
  },
  {
    id: 'jpn-hamada',
    name: 'HAMADA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hanasaki',
    name: 'HANASAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-hannan',
    name: 'HANNAN',
    flag: 'JPN',
  },
  {
    id: 'jpn-haramachi',
    name: 'HARAMACHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-hibi',
    name: 'HIBI',
    flag: 'JPN',
  },
  {
    id: 'jpn-hibikinada',
    name: 'HIBIKINADA',
    flag: 'JPN',
  },
  {
    id: 'jpn-higashiharima',
    name: 'HIGASHIHARIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hikari',
    name: 'HIKARI',
    flag: 'JPN',
  },
  {
    id: 'jpn-himeji',
    name: 'HIMEJI',
    flag: 'JPN',
  },
  {
    id: 'jpn-hinase',
    name: 'HINASE',
    flag: 'JPN',
  },
  {
    id: 'jpn-hirado',
    name: 'HIRADO',
    flag: 'JPN',
  },
  {
    id: 'jpn-hiradoanchorage',
    name: 'HIRADO ANCHORAGE',
    flag: 'JPN',
  },
  {
    id: 'jpn-hirao',
    name: 'HIRAO',
    flag: 'JPN',
  },
  {
    id: 'jpn-hirara',
    name: 'HIRARA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hitachi',
    name: 'HITACHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-hitachinaka',
    name: 'HITACHINAKA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hososhima',
    name: 'HOSOSHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-ichikikushikino',
    name: 'ICHIKIKUSHIKINO',
    flag: 'JPN',
  },
  {
    id: 'jpn-ie',
    name: 'IE',
    flag: 'JPN',
  },
  {
    id: 'jpn-ieshima',
    name: 'IESHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-iidaanchorage',
    name: 'IIDA ANCHORAGE',
    flag: 'JPN',
  },
  {
    id: 'jpn-ikedaanchorage',
    name: 'IKEDA ANCHORAGE',
    flag: 'JPN',
  },
  {
    id: 'jpn-imabari',
    name: 'IMABARI',
    flag: 'JPN',
  },
  {
    id: 'jpn-imari',
    name: 'IMARI',
    flag: 'JPN',
  },
  {
    id: 'jpn-ishigaki',
    name: 'ISHIGAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-ishinomaki',
    name: 'ISHINOMAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-ito',
    name: 'ITO',
    flag: 'JPN',
  },
  {
    id: 'jpn-itoigawa',
    name: 'ITOIGAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-itoman',
    name: 'ITOMAN',
    flag: 'JPN',
  },
  {
    id: 'jpn-iwakuni',
    name: 'IWAKUNI',
    flag: 'JPN',
  },
  {
    id: 'jpn-iyo',
    name: 'IYO',
    flag: 'JPN',
  },
  {
    id: 'jpn-kainan',
    name: 'KAINAN',
    flag: 'JPN',
  },
  {
    id: 'jpn-kamaishi',
    name: 'KAMAISHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-kanazawa',
    name: 'KANAZAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kanda',
    name: 'KANDA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kanokawa',
    name: 'KANOKAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-karatsu',
    name: 'KARATSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-kashima',
    name: 'KASHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kashiwazaki',
    name: 'KASHIWAZAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-katakami',
    name: 'KATAKAMI',
    flag: 'JPN',
  },
  {
    id: 'jpn-katsuura',
    name: 'KATSUURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kawasaki',
    name: 'KAWASAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-kesennuma',
    name: 'KESENNUMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kiire',
    name: 'KIIRE',
    flag: 'JPN',
  },
  {
    id: 'jpn-kikai',
    name: 'KIKAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-kikuma',
    name: 'KIKUMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kinoe',
    name: 'KINOE',
    flag: 'JPN',
  },
  {
    id: 'jpn-kinuura',
    name: 'KINUURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kinwan',
    name: 'KINWAN',
    flag: 'JPN',
  },
  {
    id: 'jpn-kitakyushu',
    name: 'KITAKYUSHU',
    flag: 'JPN',
  },
  {
    id: 'jpn-kochi',
    name: 'KOCHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-komatsushima',
    name: 'KOMATSUSHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-komenotsu',
    name: 'KOMENOTSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-koniya',
    name: 'KONIYA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kudamatsu',
    name: 'KUDAMATSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-kuji',
    name: 'KUJI',
    flag: 'JPN',
  },
  {
    id: 'jpn-kushimoto',
    name: 'KUSHIMOTO',
    flag: 'JPN',
  },
  {
    id: 'jpn-kushiro',
    name: 'KUSHIRO',
    flag: 'JPN',
  },
  {
    id: 'jpn-maizuru',
    name: 'MAIZURU',
    flag: 'JPN',
  },
  {
    id: 'jpn-marugame',
    name: 'MARUGAME',
    flag: 'JPN',
  },
  {
    id: 'jpn-matoyaanchorage',
    name: 'MATOYA ANCHORAGE',
    flag: 'JPN',
  },
  {
    id: 'jpn-matsusaka',
    name: 'MATSUSAKA',
    flag: 'JPN',
  },
  {
    id: 'jpn-matsuura',
    name: 'MATSUURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-meishikimi',
    name: 'MEISHIKIMI',
    flag: 'JPN',
  },
  {
    id: 'jpn-miike',
    name: 'MIIKE',
    flag: 'JPN',
  },
  {
    id: 'jpn-mikawa',
    name: 'MIKAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-minamata',
    name: 'MINAMATA',
    flag: 'JPN',
  },
  {
    id: 'jpn-misaki',
    name: 'MISAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-mishima',
    name: 'MISHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-misumi',
    name: 'MISUMI',
    flag: 'JPN',
  },
  {
    id: 'jpn-mitajiri',
    name: 'MITAJIRI',
    flag: 'JPN',
  },
  {
    id: 'jpn-miyako',
    name: 'MIYAKO',
    flag: 'JPN',
  },
  {
    id: 'jpn-miyanoura',
    name: 'MIYANOURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-miyazaki',
    name: 'MIYAZAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-miyazu',
    name: 'MIYAZU',
    flag: 'JPN',
  },
  {
    id: 'jpn-mizushima',
    name: 'MIZUSHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-moji',
    name: 'MOJI',
    flag: 'JPN',
  },
  {
    id: 'jpn-muroran',
    name: 'MURORAN',
    flag: 'JPN',
  },
  {
    id: 'jpn-mutsuogawara',
    name: 'MUTSUOGAWARA',
    flag: 'JPN',
  },
  {
    id: 'jpn-nagasaki',
    name: 'NAGASAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-nagasu',
    name: 'NAGASU',
    flag: 'JPN',
  },
  {
    id: 'jpn-nago',
    name: 'NAGO',
    flag: 'JPN',
  },
  {
    id: 'jpn-naha',
    name: 'NAHA',
    flag: 'JPN',
  },
  {
    id: 'jpn-nakagususku',
    name: 'NAKAGUSUSKU',
    flag: 'JPN',
  },
  {
    id: 'jpn-nakanoseki',
    name: 'NAKANOSEKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-namikata',
    name: 'NAMIKATA',
    flag: 'JPN',
  },
  {
    id: 'jpn-nanao',
    name: 'NANAO',
    flag: 'JPN',
  },
  {
    id: 'jpn-naoetsu',
    name: 'NAOETSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-naze',
    name: 'NAZE',
    flag: 'JPN',
  },
  {
    id: 'jpn-nichinan',
    name: 'NICHINAN',
    flag: 'JPN',
  },
  {
    id: 'jpn-niigata',
    name: 'NIIGATA',
    flag: 'JPN',
  },
  {
    id: 'jpn-niihama',
    name: 'NIIHAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-nishinoomote',
    name: 'NISHINOOMOTE',
    flag: 'JPN',
  },
  {
    id: 'jpn-nobeokaanchorage',
    name: 'NOBEOKA ANCHORAGE',
    flag: 'JPN',
  },
  {
    id: 'jpn-noshiro',
    name: 'NOSHIRO',
    flag: 'JPN',
  },
  {
    id: 'jpn-nyugawa',
    name: 'NYUGAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-ofunato',
    name: 'OFUNATO',
    flag: 'JPN',
  },
  {
    id: 'jpn-oita',
    name: 'OITA',
    flag: 'JPN',
  },
  {
    id: 'jpn-okayama',
    name: 'OKAYAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-omaezaki',
    name: 'OMAEZAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-onagawa',
    name: 'ONAGAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-onahama',
    name: 'ONAHAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-onomichiitozaki',
    name: 'ONOMICHIITOZAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-oshimanagasaki',
    name: 'OSHIMA NAGASAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-otake',
    name: 'OTAKE',
    flag: 'JPN',
  },
  {
    id: 'jpn-otaru',
    name: 'OTARU',
    flag: 'JPN',
  },
  {
    id: 'jpn-owase',
    name: 'OWASE',
    flag: 'JPN',
  },
  {
    id: 'jpn-rumoi',
    name: 'RUMOI',
    flag: 'JPN',
  },
  {
    id: 'jpn-ryotsu',
    name: 'RYOTSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-saganoseki',
    name: 'SAGANOSEKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-saijo',
    name: 'SAIJO',
    flag: 'JPN',
  },
  {
    id: 'jpn-saiki',
    name: 'SAIKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-sakaide',
    name: 'SAKAIDE',
    flag: 'JPN',
  },
  {
    id: 'jpn-sakaiminato',
    name: 'SAKAIMINATO',
    flag: 'JPN',
  },
  {
    id: 'jpn-sakata',
    name: 'SAKATA',
    flag: 'JPN',
  },
  {
    id: 'jpn-sasebo',
    name: 'SASEBO',
    flag: 'JPN',
  },
  {
    id: 'jpn-satsumasendai',
    name: 'SATSUMASENDAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-senzaki',
    name: 'SENZAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-shibushi',
    name: 'SHIBUSHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-shigei',
    name: 'SHIGEI',
    flag: 'JPN',
  },
  {
    id: 'jpn-shimabara',
    name: 'SHIMABARA',
    flag: 'JPN',
  },
  {
    id: 'jpn-shimoda',
    name: 'SHIMODA',
    flag: 'JPN',
  },
  {
    id: 'jpn-shimonoseki',
    name: 'SHIMONOSEKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-shimotsu',
    name: 'SHIMOTSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-shingu',
    name: 'SHINGU',
    flag: 'JPN',
  },
  {
    id: 'jpn-shinmonji',
    name: 'SHINMONJI',
    flag: 'JPN',
  },
  {
    id: 'jpn-shiraoi',
    name: 'SHIRAOI',
    flag: 'JPN',
  },
  {
    id: 'jpn-shiriyamazaki',
    name: 'SHIRIYAMAZAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-soma',
    name: 'SOMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-susaki',
    name: 'SUSAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-tachibana',
    name: 'TACHIBANA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tadotsu',
    name: 'TADOTSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-tagonoura',
    name: 'TAGONOURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tahara',
    name: 'TAHARA',
    flag: 'JPN',
  },
  {
    id: 'jpn-takamatsu',
    name: 'TAKAMATSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-takehara',
    name: 'TAKEHARA',
    flag: 'JPN',
  },
  {
    id: 'jpn-takuma',
    name: 'TAKUMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tanabe',
    name: 'TANABE',
    flag: 'JPN',
  },
  {
    id: 'jpn-tateyama',
    name: 'TATEYAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tatsugo',
    name: 'TATSUGO',
    flag: 'JPN',
  },
  {
    id: 'jpn-toba',
    name: 'TOBA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tokachi',
    name: 'TOKACHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-tokushima',
    name: 'TOKUSHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tokuyamakudamatsu',
    name: 'TOKUYAMAKUDAMATSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-tokuyamakudamatsuanchorage',
    name: 'TOKUYAMAKUDAMATSU ANCHORAGE',
    flag: 'JPN',
  },
  {
    id: 'jpn-tokyo',
    name: 'TOKYO',
    flag: 'JPN',
  },
  {
    id: 'jpn-tomakomaanchorage',
    name: 'TOMAKOMA ANCHORAGE',
    flag: 'JPN',
  },
  {
    id: 'jpn-tomakomai',
    name: 'TOMAKOMAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-tottori',
    name: 'TOTTORI',
    flag: 'JPN',
  },
  {
    id: 'jpn-toyamashin',
    name: 'TOYAMASHIN',
    flag: 'JPN',
  },
  {
    id: 'jpn-toyohashi',
    name: 'TOYOHASHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-tsu',
    name: 'TSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-tsukumi',
    name: 'TSUKUMI',
    flag: 'JPN',
  },
  {
    id: 'jpn-tsuna',
    name: 'TSUNA',
    flag: 'JPN',
  },
  {
    id: 'jpn-tsuneishi',
    name: 'TSUNEISHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-tsuruga',
    name: 'TSURUGA',
    flag: 'JPN',
  },
  {
    id: 'jpn-uchinomi',
    name: 'UCHINOMI',
    flag: 'JPN',
  },
  {
    id: 'jpn-urakawa',
    name: 'URAKAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-urasoe',
    name: 'URASOE',
    flag: 'JPN',
  },
  {
    id: 'jpn-usuki',
    name: 'USUKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-uwajima',
    name: 'UWAJIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-wakayama',
    name: 'WAKAYAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-yaizu',
    name: 'YAIZU',
    flag: 'JPN',
  },
  {
    id: 'jpn-yanai',
    name: 'YANAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-yatsushiro',
    name: 'YATSUSHIRO',
    flag: 'JPN',
  },
  {
    id: 'jpn-yawatahama',
    name: 'YAWATAHAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-yokkaichi',
    name: 'YOKKAICHI',
    flag: 'JPN',
  },
  {
    id: 'jpn-yonabaru',
    name: 'YONABARU',
    flag: 'JPN',
  },
  {
    id: 'jpn-yonaguni',
    name: 'YONAGUNI',
    flag: 'JPN',
  },
  {
    id: 'jpn-yoshiumi',
    name: 'YOSHIUMI',
    flag: 'JPN',
  },
  {
    id: 'jpn-yura',
    name: 'YURA',
    flag: 'JPN',
  },
  {
    id: 'kaz-aktau',
    name: 'AKTAU',
    flag: 'KAZ',
  },
  {
    id: 'kaz-bautino',
    name: 'BAUTINO',
    flag: 'KAZ',
  },
  {
    id: 'ken-kilifi',
    name: 'KILIFI',
    flag: 'KEN',
  },
  {
    id: 'ken-lamu',
    name: 'LAMU',
    flag: 'KEN',
  },
  {
    id: 'ken-milindi',
    name: 'MILINDI',
    flag: 'KEN',
  },
  {
    id: 'ken-shimoni',
    name: 'SHIMONI',
    flag: 'KEN',
  },
  {
    id: 'khm-sihanoukville',
    name: 'SIHANOUKVILLE',
    flag: 'KHM',
  },
  {
    id: 'kna-charlestownanchorage',
    name: 'CHARLESTOWN ANCHORAGE',
    flag: 'KNA',
  },
  {
    id: 'kna-stkitts',
    name: 'ST KITTS',
    flag: 'KNA',
  },
  {
    id: 'kna-whitehousebayanchorage',
    name: 'WHITE HOUSE BAY ANCHORAGE',
    flag: 'KNA',
  },
  {
    id: 'kor-aewol',
    name: 'AEWOL',
    flag: 'KOR',
  },
  {
    id: 'kor-anjeong',
    name: 'ANJEONG',
    flag: 'KOR',
  },
  {
    id: 'kor-boryeong',
    name: 'BORYEONG',
    flag: 'KOR',
  },
  {
    id: 'kor-busannewportanchorage',
    name: 'BUSAN NEW PORT ANCHORAGE',
    flag: 'KOR',
  },
  {
    id: 'kor-daecheonhang',
    name: 'DAECHEONHANG',
    flag: 'KOR',
  },
  {
    id: 'kor-daesan',
    name: 'DAESAN',
    flag: 'KOR',
  },
  {
    id: 'kor-dangjin',
    name: 'DANGJIN',
    flag: 'KOR',
  },
  {
    id: 'kor-gageodo',
    name: 'GAGEODO',
    flag: 'KOR',
  },
  {
    id: 'kor-gampo',
    name: 'GAMPO',
    flag: 'KOR',
  },
  {
    id: 'kor-geoje',
    name: 'GEOJE',
    flag: 'KOR',
  },
  {
    id: 'kor-gijang',
    name: 'GIJANG',
    flag: 'KOR',
  },
  {
    id: 'kor-gohyeon',
    name: 'GOHYEON',
    flag: 'KOR',
  },
  {
    id: 'kor-gunsan',
    name: 'GUNSAN',
    flag: 'KOR',
  },
  {
    id: 'kor-guryongpo',
    name: 'GURYONGPO',
    flag: 'KOR',
  },
  {
    id: 'kor-gwangyang',
    name: 'GWANGYANG',
    flag: 'KOR',
  },
  {
    id: 'kor-hamori',
    name: 'HAMORI',
    flag: 'KOR',
  },
  {
    id: 'kor-hosan',
    name: 'HOSAN',
    flag: 'KOR',
  },
  {
    id: 'kor-incheon',
    name: 'INCHEON',
    flag: 'KOR',
  },
  {
    id: 'kor-jinhae',
    name: 'JINHAE',
    flag: 'KOR',
  },
  {
    id: 'kor-naesan-ri',
    name: 'NAESAN-RI',
    flag: 'KOR',
  },
  {
    id: 'kor-oepo',
    name: 'OEPO',
    flag: 'KOR',
  },
  {
    id: 'kor-okgye',
    name: 'OKGYE',
    flag: 'KOR',
  },
  {
    id: 'kor-paengmog',
    name: 'PAENGMOG',
    flag: 'KOR',
  },
  {
    id: 'kor-pohang',
    name: 'POHANG',
    flag: 'KOR',
  },
  {
    id: 'kor-pyeongtaek',
    name: 'PYEONGTAEK',
    flag: 'KOR',
  },
  {
    id: 'kor-samcheok',
    name: 'SAMCHEOK',
    flag: 'KOR',
  },
  {
    id: 'kor-samcheonpo',
    name: 'SAMCHEONPO',
    flag: 'KOR',
  },
  {
    id: 'kor-seogwipo',
    name: 'SEOGWIPO',
    flag: 'KOR',
  },
  {
    id: 'kor-taean',
    name: 'TAEAN',
    flag: 'KOR',
  },
  {
    id: 'kor-wando',
    name: 'WANDO',
    flag: 'KOR',
  },
  {
    id: 'kor-yeosuanchorage',
    name: 'YEOSU ANCHORAGE',
    flag: 'KOR',
  },
  {
    id: 'kwt-kuwaitcity',
    name: 'KUWAIT CITY',
    flag: 'KWT',
  },
  {
    id: 'kwt-minaalahmadi',
    name: 'MINA AL AHMADI',
    flag: 'KWT',
  },
  {
    id: 'kwt-minaalzour',
    name: 'MINA AL ZOUR',
    flag: 'KWT',
  },
  {
    id: 'kwt-shuaiba',
    name: 'SHUAIBA',
    flag: 'KWT',
  },
  {
    id: 'lbn-beirut',
    name: 'BEIRUT',
    flag: 'LBN',
  },
  {
    id: 'lbn-chekka',
    name: 'CHEKKA',
    flag: 'LBN',
  },
  {
    id: 'lbn-dbaiyeh',
    name: 'DBAIYEH',
    flag: 'LBN',
  },
  {
    id: 'lbn-jiyeh',
    name: 'JIYEH',
    flag: 'LBN',
  },
  {
    id: 'lbn-jounieh',
    name: 'JOUNIEH',
    flag: 'LBN',
  },
  {
    id: 'lbn-saida',
    name: 'SAIDA',
    flag: 'LBN',
  },
  {
    id: 'lbn-selaata',
    name: 'SELAATA',
    flag: 'LBN',
  },
  {
    id: 'lbn-tripoli',
    name: 'TRIPOLI',
    flag: 'LBN',
  },
  {
    id: 'lbn-zahrani',
    name: 'ZAHRANI',
    flag: 'LBN',
  },
  {
    id: 'lbr-buchanan',
    name: 'BUCHANAN',
    flag: 'LBR',
  },
  {
    id: 'lbr-greenville',
    name: 'GREENVILLE',
    flag: 'LBR',
  },
  {
    id: 'lby-benghazi',
    name: 'BENGHAZI',
    flag: 'LBY',
  },
  {
    id: 'lby-khoms',
    name: 'KHOMS',
    flag: 'LBY',
  },
  {
    id: 'lby-marsaalbrega',
    name: 'MARSA AL BREGA',
    flag: 'LBY',
  },
  {
    id: 'lby-mellitah',
    name: 'MELLITAH',
    flag: 'LBY',
  },
  {
    id: 'lby-misurata',
    name: 'MISURATA',
    flag: 'LBY',
  },
  {
    id: 'lby-tobruk',
    name: 'TOBRUK',
    flag: 'LBY',
  },
  {
    id: 'lby-tripoli',
    name: 'TRIPOLI',
    flag: 'LBY',
  },
  {
    id: 'lby-zawia',
    name: 'ZAWIA',
    flag: 'LBY',
  },
  {
    id: 'lca-castries',
    name: 'CASTRIES',
    flag: 'LCA',
  },
  {
    id: 'lca-culdesac',
    name: 'CUL DE SAC',
    flag: 'LCA',
  },
  {
    id: 'lca-jalousie',
    name: 'JALOUSIE',
    flag: 'LCA',
  },
  {
    id: 'lca-marigotbay',
    name: 'MARIGOT BAY',
    flag: 'LCA',
  },
  {
    id: 'lca-rodneybay',
    name: 'RODNEY BAY',
    flag: 'LCA',
  },
  {
    id: 'lca-soufriere',
    name: 'SOUFRIERE',
    flag: 'LCA',
  },
  {
    id: 'lca-stluciaanchorage',
    name: 'ST LUCIA ANCHORAGE',
    flag: 'LCA',
  },
  {
    id: 'lca-vieuxfort',
    name: 'VIEUX FORT',
    flag: 'LCA',
  },
  {
    id: 'lka-galle',
    name: 'GALLE',
    flag: 'LKA',
  },
  {
    id: 'lka-marissa',
    name: 'MARISSA',
    flag: 'LKA',
  },
  {
    id: 'lka-negombo',
    name: 'NEGOMBO',
    flag: 'LKA',
  },
  {
    id: 'lka-puttalam',
    name: 'PUTTALAM',
    flag: 'LKA',
  },
  {
    id: 'lka-trincomalee',
    name: 'TRINCOMALEE',
    flag: 'LKA',
  },
  {
    id: 'ltu-butinge',
    name: 'BUTINGE',
    flag: 'LTU',
  },
  {
    id: 'lva-liepaja',
    name: 'LIEPAJA',
    flag: 'LVA',
  },
  {
    id: 'lva-mersrags',
    name: 'MERSRAGS',
    flag: 'LVA',
  },
  {
    id: 'lva-riga',
    name: 'RIGA',
    flag: 'LVA',
  },
  {
    id: 'lva-salacgriva',
    name: 'SALACGRIVA',
    flag: 'LVA',
  },
  {
    id: 'lva-skulte',
    name: 'SKULTE',
    flag: 'LVA',
  },
  {
    id: 'maf-orientbay',
    name: 'ORIENT BAY',
    flag: 'MAF',
  },
  {
    id: 'maf-stmartin',
    name: 'ST MARTIN',
    flag: 'MAF',
  },
  {
    id: 'mar-casablanca',
    name: 'CASABLANCA',
    flag: 'MAR',
  },
  {
    id: 'mar-jorflasfar',
    name: 'JORF LASFAR',
    flag: 'MAR',
  },
  {
    id: 'mar-kenitra',
    name: 'KENITRA',
    flag: 'MAR',
  },
  {
    id: 'mar-mohammedia',
    name: 'MOHAMMEDIA',
    flag: 'MAR',
  },
  {
    id: 'mar-nador',
    name: 'NADOR',
    flag: 'MAR',
  },
  {
    id: 'mar-rabat',
    name: 'RABAT',
    flag: 'MAR',
  },
  {
    id: 'mar-safi',
    name: 'SAFI',
    flag: 'MAR',
  },
  {
    id: 'mar-smir',
    name: 'SMIR',
    flag: 'MAR',
  },
  {
    id: 'mar-tantan',
    name: 'TANTAN',
    flag: 'MAR',
  },
  {
    id: 'mco-monaco',
    name: 'MONACO',
    flag: 'MCO',
  },
  {
    id: 'mda-giurgiulesti',
    name: 'GIURGIULESTI',
    flag: 'MDA',
  },
  {
    id: 'mdg-majunga',
    name: 'MAJUNGA',
    flag: 'MDG',
  },
  {
    id: 'mdg-toamasina',
    name: 'TOAMASINA',
    flag: 'MDG',
  },
  {
    id: 'mdg-tulear',
    name: 'TULEAR',
    flag: 'MDG',
  },
  {
    id: 'mdv-kulhudhuffushi',
    name: 'KULHUDHUFFUSHI',
    flag: 'MDV',
  },
  {
    id: 'mdv-thilafushi',
    name: 'THILAFUSHI',
    flag: 'MDV',
  },
  {
    id: 'mex-abkatun',
    name: 'ABKATUN',
    flag: 'MEX',
  },
  {
    id: 'mex-aguaverde',
    name: 'AGUA VERDE',
    flag: 'MEX',
  },
  {
    id: 'mex-akalfield',
    name: 'AKAL FIELD',
    flag: 'MEX',
  },
  {
    id: 'mex-altamira',
    name: 'ALTAMIRA',
    flag: 'MEX',
  },
  {
    id: 'mex-alvarado',
    name: 'ALVARADO',
    flag: 'MEX',
  },
  {
    id: 'mex-ayatsilfield',
    name: 'AYATSIL FIELD',
    flag: 'MEX',
  },
  {
    id: 'mex-bahiatortugas',
    name: 'BAHIA TORTUGAS',
    flag: 'MEX',
  },
  {
    id: 'mex-barradenavidad',
    name: 'BARRA DE NAVIDAD',
    flag: 'MEX',
  },
  {
    id: 'mex-cabosanlucas',
    name: 'CABO SAN LUCAS',
    flag: 'MEX',
  },
  {
    id: 'mex-cancun',
    name: 'CANCUN',
    flag: 'MEX',
  },
  {
    id: 'mex-cayoarcas',
    name: 'CAYO ARCAS',
    flag: 'MEX',
  },
  {
    id: 'mex-cayoarcasterminal',
    name: 'CAYO ARCAS TERMINAL',
    flag: 'MEX',
  },
  {
    id: 'mex-chahue',
    name: 'CHAHUE',
    flag: 'MEX',
  },
  {
    id: 'mex-ciudaddelcarmen',
    name: 'CIUDAD DEL CARMEN',
    flag: 'MEX',
  },
  {
    id: 'mex-coatzacoalcos',
    name: 'COATZACOALCOS',
    flag: 'MEX',
  },
  {
    id: 'mex-cozumel',
    name: 'COZUMEL',
    flag: 'MEX',
  },
  {
    id: 'mex-dosbocasanchorage',
    name: 'DOS BOCAS ANCHORAGE',
    flag: 'MEX',
  },
  {
    id: 'mex-guaymas',
    name: 'GUAYMAS',
    flag: 'MEX',
  },
  {
    id: 'mex-huanacaxtle',
    name: 'HUANACAXTLE',
    flag: 'MEX',
  },
  {
    id: 'mex-islamujeres',
    name: 'ISLA MUJERES',
    flag: 'MEX',
  },
  {
    id: 'mex-ixtapa',
    name: 'IXTAPA',
    flag: 'MEX',
  },
  {
    id: 'mex-kuilfield',
    name: 'KUIL FIELD',
    flag: 'MEX',
  },
  {
    id: 'mex-lapaz',
    name: 'LA PAZ',
    flag: 'MEX',
  },
  {
    id: 'mex-lazarocardenas',
    name: 'LAZARO CARDENAS',
    flag: 'MEX',
  },
  {
    id: 'mex-loscabos',
    name: 'LOS CABOS',
    flag: 'MEX',
  },
  {
    id: 'mex-manikfield',
    name: 'MANIK FIELD',
    flag: 'MEX',
  },
  {
    id: 'mex-morroredondo',
    name: 'MORRO REDONDO',
    flag: 'MEX',
  },
  {
    id: 'mex-nuevovallarta',
    name: 'NUEVO VALLARTA',
    flag: 'MEX',
  },
  {
    id: 'mex-onelfield',
    name: 'ONEL FIELD',
    flag: 'MEX',
  },
  {
    id: 'mex-pichilingue',
    name: 'PICHILINGUE',
    flag: 'MEX',
  },
  {
    id: 'mex-progreso',
    name: 'PROGRESO',
    flag: 'MEX',
  },
  {
    id: 'mex-puertomorelos',
    name: 'PUERTO MORELOS',
    flag: 'MEX',
  },
  {
    id: 'mex-puertopenasco',
    name: 'PUERTO PENASCO',
    flag: 'MEX',
  },
  {
    id: 'mex-puertovallarta',
    name: 'PUERTO VALLARTA',
    flag: 'MEX',
  },
  {
    id: 'mex-puntademita',
    name: 'PUNTA DE MITA',
    flag: 'MEX',
  },
  {
    id: 'mex-puntavenado',
    name: 'PUNTA VENADO',
    flag: 'MEX',
  },
  {
    id: 'mex-rosaritoanchorage',
    name: 'ROSARITO ANCHORAGE',
    flag: 'MEX',
  },
  {
    id: 'mex-sanjuandelacosta',
    name: 'SAN JUAN DE LA COSTA',
    flag: 'MEX',
  },
  {
    id: 'mex-santarosalia',
    name: 'SANTA ROSALIA',
    flag: 'MEX',
  },
  {
    id: 'mex-topolobampo',
    name: 'TOPOLOBAMPO',
    flag: 'MEX',
  },
  {
    id: 'mex-tsiminfield',
    name: 'TSIMIN FIELD',
    flag: 'MEX',
  },
  {
    id: 'mex-tuxpan',
    name: 'TUXPAN',
    flag: 'MEX',
  },
  {
    id: 'mex-villalosfrailes',
    name: 'VILLA LOS FRAILES',
    flag: 'MEX',
  },
  {
    id: 'mex-yaxchefield',
    name: 'YAXCHE FIELD',
    flag: 'MEX',
  },
  {
    id: 'mex-zaapfield',
    name: 'ZAAP FIELD',
    flag: 'MEX',
  },
  {
    id: 'mex-zihuatanejo',
    name: 'ZIHUATANEJO',
    flag: 'MEX',
  },
  {
    id: 'mhl-ebaye',
    name: 'EBAYE',
    flag: 'MHL',
  },
  {
    id: 'mhl-kwajalein',
    name: 'KWAJALEIN',
    flag: 'MHL',
  },
  {
    id: 'mlt-armierbay',
    name: 'ARMIER BAY',
    flag: 'MLT',
  },
  {
    id: 'mlt-cirkewwa',
    name: 'CIRKEWWA',
    flag: 'MLT',
  },
  {
    id: 'mlt-comino',
    name: 'COMINO',
    flag: 'MLT',
  },
  {
    id: 'mlt-mallieha',
    name: 'MALLIEHA',
    flag: 'MLT',
  },
  {
    id: 'mlt-mgarr',
    name: 'MGARR',
    flag: 'MLT',
  },
  {
    id: 'mlt-portomaso',
    name: 'PORTOMASO',
    flag: 'MLT',
  },
  {
    id: 'mmr-kyaukpyu',
    name: 'KYAUKPYU',
    flag: 'MMR',
  },
  {
    id: 'mne-bigova',
    name: 'BIGOVA',
    flag: 'MNE',
  },
  {
    id: 'mne-bijela',
    name: 'BIJELA',
    flag: 'MNE',
  },
  {
    id: 'mne-budva',
    name: 'BUDVA',
    flag: 'MNE',
  },
  {
    id: 'mne-elpresidentebeach',
    name: 'EL PRESIDENTE BEACH',
    flag: 'MNE',
  },
  {
    id: 'mne-kotor',
    name: 'KOTOR',
    flag: 'MNE',
  },
  {
    id: 'mne-kraljinabeach',
    name: 'KRALJINA BEACH',
    flag: 'MNE',
  },
  {
    id: 'mne-kumbor',
    name: 'KUMBOR',
    flag: 'MNE',
  },
  {
    id: 'mne-portnovimarina',
    name: 'PORTNOVI MARINA',
    flag: 'MNE',
  },
  {
    id: 'mne-tivat',
    name: 'TIVAT',
    flag: 'MNE',
  },
  {
    id: 'mnp-saipan',
    name: 'SAIPAN',
    flag: 'MNP',
  },
  {
    id: 'moz-matola',
    name: 'MATOLA',
    flag: 'MOZ',
  },
  {
    id: 'moz-moma',
    name: 'MOMA',
    flag: 'MOZ',
  },
  {
    id: 'moz-portoamelia',
    name: 'PORTO AMELIA',
    flag: 'MOZ',
  },
  {
    id: 'moz-quelimane',
    name: 'QUELIMANE',
    flag: 'MOZ',
  },
  {
    id: 'msr-littlebay',
    name: 'LITTLE BAY',
    flag: 'MSR',
  },
  {
    id: 'mtq-case-pilote',
    name: 'CASE-PILOTE',
    flag: 'MTQ',
  },
  {
    id: 'mtq-fortdefrance',
    name: 'FORT DE FRANCE',
    flag: 'MTQ',
  },
  {
    id: 'mtq-lemarin',
    name: 'LE MARIN',
    flag: 'MTQ',
  },
  {
    id: 'mtq-lesansesdarlet',
    name: 'LES ANSES DARLET',
    flag: 'MTQ',
  },
  {
    id: 'mtq-lestrois-ilets',
    name: 'LES TROIS-ILETS',
    flag: 'MTQ',
  },
  {
    id: 'mtq-saintpierre',
    name: 'SAINT PIERRE',
    flag: 'MTQ',
  },
  {
    id: 'mtq-schoelcher',
    name: 'SCHOELCHER',
    flag: 'MTQ',
  },
  {
    id: 'mus-grandbaie',
    name: 'GRAND BAIE',
    flag: 'MUS',
  },
  {
    id: 'mus-portmathurin',
    name: 'PORT MATHURIN',
    flag: 'MUS',
  },
  {
    id: 'mys-baganpanchor',
    name: 'BAGAN PANCHOR',
    flag: 'MYS',
  },
  {
    id: 'mys-batupahat',
    name: 'BATU PAHAT',
    flag: 'MYS',
  },
  {
    id: 'mys-bintulu',
    name: 'BINTULU',
    flag: 'MYS',
  },
  {
    id: 'mys-endau',
    name: 'ENDAU',
    flag: 'MYS',
  },
  {
    id: 'mys-fortunestar',
    name: 'FORTUNE STAR',
    flag: 'MYS',
  },
  {
    id: 'mys-kemaman',
    name: 'KEMAMAN',
    flag: 'MYS',
  },
  {
    id: 'mys-kemamananchorage',
    name: 'KEMAMAN ANCHORAGE',
    flag: 'MYS',
  },
  {
    id: 'mys-kertih',
    name: 'KERTIH',
    flag: 'MYS',
  },
  {
    id: 'mys-kimanis',
    name: 'KIMANIS',
    flag: 'MYS',
  },
  {
    id: 'mys-kotakinabalu',
    name: 'KOTA KINABALU',
    flag: 'MYS',
  },
  {
    id: 'mys-kualabaram',
    name: 'KUALA BARAM',
    flag: 'MYS',
  },
  {
    id: 'mys-kualakedah',
    name: 'KUALA KEDAH',
    flag: 'MYS',
  },
  {
    id: 'mys-kualasepetang',
    name: 'KUALA SEPETANG',
    flag: 'MYS',
  },
  {
    id: 'mys-kualaterengganu',
    name: 'KUALA TERENGGANU',
    flag: 'MYS',
  },
  {
    id: 'mys-kuantan',
    name: 'KUANTAN',
    flag: 'MYS',
  },
  {
    id: 'mys-kuching',
    name: 'KUCHING',
    flag: 'MYS',
  },
  {
    id: 'mys-labuan',
    name: 'LABUAN',
    flag: 'MYS',
  },
  {
    id: 'mys-lahaddatu',
    name: 'LAHAD DATU',
    flag: 'MYS',
  },
  {
    id: 'mys-langkawi',
    name: 'LANGKAWI',
    flag: 'MYS',
  },
  {
    id: 'mys-lumut',
    name: 'LUMUT',
    flag: 'MYS',
  },
  {
    id: 'mys-malacca',
    name: 'MALACCA',
    flag: 'MYS',
  },
  {
    id: 'mys-miri',
    name: 'MIRI',
    flag: 'MYS',
  },
  {
    id: 'mys-rebak',
    name: 'REBAK',
    flag: 'MYS',
  },
  {
    id: 'mys-samalaju',
    name: 'SAMALAJU',
    flag: 'MYS',
  },
  {
    id: 'mys-sandakan',
    name: 'SANDAKAN',
    flag: 'MYS',
  },
  {
    id: 'mys-sarikei',
    name: 'SARIKEI',
    flag: 'MYS',
  },
  {
    id: 'mys-sekinchan',
    name: 'SEKINCHAN',
    flag: 'MYS',
  },
  {
    id: 'mys-sibu',
    name: 'SIBU',
    flag: 'MYS',
  },
  {
    id: 'mys-sipitang',
    name: 'SIPITANG',
    flag: 'MYS',
  },
  {
    id: 'mys-sungailinggi',
    name: 'SUNGAI LINGGI',
    flag: 'MYS',
  },
  {
    id: 'mys-sungaiudang',
    name: 'SUNGAI UDANG',
    flag: 'MYS',
  },
  {
    id: 'mys-sutera',
    name: 'SUTERA',
    flag: 'MYS',
  },
  {
    id: 'mys-tanjunglangsat',
    name: 'TANJUNG LANGSAT',
    flag: 'MYS',
  },
  {
    id: 'mys-tawau',
    name: 'TAWAU',
    flag: 'MYS',
  },
  {
    id: 'mys-telagaharbour',
    name: 'TELAGA HARBOUR',
    flag: 'MYS',
  },
  {
    id: 'mys-tokbali',
    name: 'TOK BALI',
    flag: 'MYS',
  },
  {
    id: 'myt-longoni',
    name: 'LONGONI',
    flag: 'MYT',
  },
  {
    id: 'nam-luderitz',
    name: 'LUDERITZ',
    flag: 'NAM',
  },
  {
    id: 'ncl-karembe',
    name: 'KAREMBE',
    flag: 'NCL',
  },
  {
    id: 'ncl-kouaouaanchorage',
    name: 'KOUAOUA ANCHORAGE',
    flag: 'NCL',
  },
  {
    id: 'ncl-nakety',
    name: 'NAKETY',
    flag: 'NCL',
  },
  {
    id: 'ncl-noumea',
    name: 'NOUMEA',
    flag: 'NCL',
  },
  {
    id: 'ncl-prony',
    name: 'PRONY',
    flag: 'NCL',
  },
  {
    id: 'ncl-tadine',
    name: 'TADINE',
    flag: 'NCL',
  },
  {
    id: 'ncl-teoudie',
    name: 'TEOUDIE',
    flag: 'NCL',
  },
  {
    id: 'ncl-tontouta',
    name: 'TONTOUTA',
    flag: 'NCL',
  },
  {
    id: 'nga-agbami',
    name: 'AGBAMI',
    flag: 'NGA',
  },
  {
    id: 'nga-agbamifpso',
    name: 'AGBAMI FPSO',
    flag: 'NGA',
  },
  {
    id: 'nga-akpofpso',
    name: 'AKPO FPSO',
    flag: 'NGA',
  },
  {
    id: 'nga-amenam',
    name: 'AMENAM',
    flag: 'NGA',
  },
  {
    id: 'nga-bongaterminal',
    name: 'BONGA TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'nga-bonnyterminal',
    name: 'BONNY TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'nga-brass',
    name: 'BRASS',
    flag: 'NGA',
  },
  {
    id: 'nga-calabar',
    name: 'CALABAR',
    flag: 'NGA',
  },
  {
    id: 'nga-ebokfield',
    name: 'EBOK FIELD',
    flag: 'NGA',
  },
  {
    id: 'nga-escravosfield',
    name: 'ESCRAVOS FIELD',
    flag: 'NGA',
  },
  {
    id: 'nga-forcados',
    name: 'FORCADOS',
    flag: 'NGA',
  },
  {
    id: 'nga-forcadosterminal',
    name: 'FORCADOS TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'nga-imaterminal',
    name: 'IMA TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'nga-koko',
    name: 'KOKO',
    flag: 'NGA',
  },
  {
    id: 'nga-oduduterminal',
    name: 'ODUDU TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'nga-oghara',
    name: 'OGHARA',
    flag: 'NGA',
  },
  {
    id: 'nga-okonoterminal',
    name: 'OKONO TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'nga-okorofield',
    name: 'OKORO FIELD',
    flag: 'NGA',
  },
  {
    id: 'nga-onne',
    name: 'ONNE',
    flag: 'NGA',
  },
  {
    id: 'nga-penningtonterminal',
    name: 'PENNINGTON TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'nga-quaiboeterminal',
    name: 'QUA IBOE TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'nga-sapele',
    name: 'SAPELE',
    flag: 'NGA',
  },
  {
    id: 'nga-seaeagleterminal',
    name: 'SEA EAGLE TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'nga-usanfpso',
    name: 'USAN FPSO',
    flag: 'NGA',
  },
  {
    id: 'nic-corinto',
    name: 'CORINTO',
    flag: 'NIC',
  },
  {
    id: 'nic-puertosandino',
    name: 'PUERTO SANDINO',
    flag: 'NIC',
  },
  {
    id: 'nic-rama',
    name: 'RAMA',
    flag: 'NIC',
  },
  {
    id: 'niu-alofi',
    name: 'ALOFI',
    flag: 'NIU',
  },
  {
    id: 'nld-aalsmeer',
    name: 'AALSMEER',
    flag: 'NLD',
  },
  {
    id: 'nld-aalst',
    name: 'AALST',
    flag: 'NLD',
  },
  {
    id: 'nld-akersloot',
    name: 'AKERSLOOT',
    flag: 'NLD',
  },
  {
    id: 'nld-alkmaar',
    name: 'ALKMAAR',
    flag: 'NLD',
  },
  {
    id: 'nld-almere',
    name: 'ALMERE',
    flag: 'NLD',
  },
  {
    id: 'nld-alphenaandenrijn',
    name: 'ALPHEN AAN DEN RIJN',
    flag: 'NLD',
  },
  {
    id: 'nld-ameland',
    name: 'AMELAND',
    flag: 'NLD',
  },
  {
    id: 'nld-barendrecht',
    name: 'BARENDRECHT',
    flag: 'NLD',
  },
  {
    id: 'nld-breezanddijk',
    name: 'BREEZANDDIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-breukelen',
    name: 'BREUKELEN',
    flag: 'NLD',
  },
  {
    id: 'nld-bruinisse',
    name: 'BRUINISSE',
    flag: 'NLD',
  },
  {
    id: 'nld-capelleaanijssel',
    name: 'CAPELLE AAN IJSSEL',
    flag: 'NLD',
  },
  {
    id: 'nld-colijnsplaat',
    name: 'COLIJNSPLAAT',
    flag: 'NLD',
  },
  {
    id: 'nld-culemborg',
    name: 'CULEMBORG',
    flag: 'NLD',
  },
  {
    id: 'nld-delft',
    name: 'DELFT',
    flag: 'NLD',
  },
  {
    id: 'nld-delfzijl',
    name: 'DELFZIJL',
    flag: 'NLD',
  },
  {
    id: 'nld-denhaag',
    name: 'DEN HAAG',
    flag: 'NLD',
  },
  {
    id: 'nld-denoever',
    name: 'DEN OEVER',
    flag: 'NLD',
  },
  {
    id: 'nld-dinteloord',
    name: 'DINTELOORD',
    flag: 'NLD',
  },
  {
    id: 'nld-doesburg',
    name: 'DOESBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-dordrecht',
    name: 'DORDRECHT',
    flag: 'NLD',
  },
  {
    id: 'nld-drimmelen',
    name: 'DRIMMELEN',
    flag: 'NLD',
  },
  {
    id: 'nld-edam',
    name: 'EDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-eemshaven',
    name: 'EEMSHAVEN',
    flag: 'NLD',
  },
  {
    id: 'nld-enkhuizen',
    name: 'ENKHUIZEN',
    flag: 'NLD',
  },
  {
    id: 'nld-gorinchem',
    name: 'GORINCHEM',
    flag: 'NLD',
  },
  {
    id: 'nld-haaften',
    name: 'HAAFTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-haarlem',
    name: 'HAARLEM',
    flag: 'NLD',
  },
  {
    id: 'nld-hansweert',
    name: 'HANSWEERT',
    flag: 'NLD',
  },
  {
    id: 'nld-heerjansdam',
    name: 'HEERJANSDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-hellevoetsluis',
    name: 'HELLEVOETSLUIS',
    flag: 'NLD',
  },
  {
    id: 'nld-hendrikidoambacht',
    name: 'HENDRIK IDO AMBACHT',
    flag: 'NLD',
  },
  {
    id: 'nld-ijsseloog',
    name: 'IJSSELOOG',
    flag: 'NLD',
  },
  {
    id: 'nld-kampen',
    name: 'KAMPEN',
    flag: 'NLD',
  },
  {
    id: 'nld-katwijk',
    name: 'KATWIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-kerkdriel',
    name: 'KERKDRIEL',
    flag: 'NLD',
  },
  {
    id: 'nld-kootstertille',
    name: 'KOOTSTERTILLE',
    flag: 'NLD',
  },
  {
    id: 'nld-kornwerderzand',
    name: 'KORNWERDERZAND',
    flag: 'NLD',
  },
  {
    id: 'nld-kortgene',
    name: 'KORTGENE',
    flag: 'NLD',
  },
  {
    id: 'nld-krimpenaandelek',
    name: 'KRIMPEN AAN DE LEK',
    flag: 'NLD',
  },
  {
    id: 'nld-lagezwaluwe',
    name: 'LAGE ZWALUWE',
    flag: 'NLD',
  },
  {
    id: 'nld-lauwersoog',
    name: 'LAUWERSOOG',
    flag: 'NLD',
  },
  {
    id: 'nld-leerdam',
    name: 'LEERDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-leiden',
    name: 'LEIDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-lelystad',
    name: 'LELYSTAD',
    flag: 'NLD',
  },
  {
    id: 'nld-lemmer',
    name: 'LEMMER',
    flag: 'NLD',
  },
  {
    id: 'nld-lisse',
    name: 'LISSE',
    flag: 'NLD',
  },
  {
    id: 'nld-maassluis',
    name: 'MAASSLUIS',
    flag: 'NLD',
  },
  {
    id: 'nld-makkum',
    name: 'MAKKUM',
    flag: 'NLD',
  },
  {
    id: 'nld-middelburg',
    name: 'MIDDELBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-middelharnis',
    name: 'MIDDELHARNIS',
    flag: 'NLD',
  },
  {
    id: 'nld-moerdijk',
    name: 'MOERDIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-monnickendam',
    name: 'MONNICKENDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-neeltjejans',
    name: 'NEELTJE JANS',
    flag: 'NLD',
  },
  {
    id: 'nld-nieuwegein',
    name: 'NIEUWEGEIN',
    flag: 'NLD',
  },
  {
    id: 'nld-nieuwlekkerland',
    name: 'NIEUW LEKKERLAND',
    flag: 'NLD',
  },
  {
    id: 'nld-ochten',
    name: 'OCHTEN',
    flag: 'NLD',
  },
  {
    id: 'nld-opzoeknaarzand',
    name: 'OP ZOEK NAAR ZAND',
    flag: 'NLD',
  },
  {
    id: 'nld-oss',
    name: 'OSS',
    flag: 'NLD',
  },
  {
    id: 'nld-oudbeijerland',
    name: 'OUD BEIJERLAND',
    flag: 'NLD',
  },
  {
    id: 'nld-oudeschild',
    name: 'OUDESCHILD',
    flag: 'NLD',
  },
  {
    id: 'nld-roompot',
    name: 'ROOMPOT',
    flag: 'NLD',
  },
  {
    id: 'nld-rotterdam',
    name: 'ROTTERDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-rotterdambotlek',
    name: 'ROTTERDAM BOTLEK',
    flag: 'NLD',
  },
  {
    id: 'nld-sasvangent',
    name: 'SAS VAN GENT',
    flag: 'NLD',
  },
  {
    id: 'nld-scharendijke',
    name: 'SCHARENDIJKE',
    flag: 'NLD',
  },
  {
    id: 'nld-schiedam',
    name: 'SCHIEDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-schiermonnikoog',
    name: 'SCHIERMONNIKOOG',
    flag: 'NLD',
  },
  {
    id: 'nld-sintannaland',
    name: 'SINT ANNALAND',
    flag: 'NLD',
  },
  {
    id: 'nld-sliedrecht',
    name: 'SLIEDRECHT',
    flag: 'NLD',
  },
  {
    id: 'nld-sluiskil',
    name: 'SLUISKIL',
    flag: 'NLD',
  },
  {
    id: 'nld-spakenburg',
    name: 'SPAKENBURG',
    flag: 'NLD',
  },
  {
    id: 'nld-stadaantharingvlie',
    name: 'STAD AANT HARINGVLIE',
    flag: 'NLD',
  },
  {
    id: 'nld-stavoren',
    name: 'STAVOREN',
    flag: 'NLD',
  },
  {
    id: 'nld-stellendam',
    name: 'STELLENDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-terneuzen',
    name: 'TERNEUZEN',
    flag: 'NLD',
  },
  {
    id: 'nld-terschelling',
    name: 'TERSCHELLING',
    flag: 'NLD',
  },
  {
    id: 'nld-terschellinganchorage',
    name: 'TERSCHELLING ANCHORAGE',
    flag: 'NLD',
  },
  {
    id: 'nld-texel',
    name: 'TEXEL',
    flag: 'NLD',
  },
  {
    id: 'nld-tolkamer',
    name: 'TOLKAMER',
    flag: 'NLD',
  },
  {
    id: 'nld-uitdam',
    name: 'UITDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-urk',
    name: 'URK',
    flag: 'NLD',
  },
  {
    id: 'nld-velsen',
    name: 'VELSEN',
    flag: 'NLD',
  },
  {
    id: 'nld-vlieland',
    name: 'VLIELAND',
    flag: 'NLD',
  },
  {
    id: 'nld-vlissingen',
    name: 'VLISSINGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-volendam',
    name: 'VOLENDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-waalwijk',
    name: 'WAALWIJK',
    flag: 'NLD',
  },
  {
    id: 'nld-walsoorden',
    name: 'WALSOORDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-weert',
    name: 'WEERT',
    flag: 'NLD',
  },
  {
    id: 'nld-weesp',
    name: 'WEESP',
    flag: 'NLD',
  },
  {
    id: 'nld-wemeldinge',
    name: 'WEMELDINGE',
    flag: 'NLD',
  },
  {
    id: 'nld-werkendam',
    name: 'WERKENDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-wijkbijduurstede',
    name: 'WIJK BIJ DUURSTEDE',
    flag: 'NLD',
  },
  {
    id: 'nld-willemstad',
    name: 'WILLEMSTAD',
    flag: 'NLD',
  },
  {
    id: 'nld-yerseke',
    name: 'YERSEKE',
    flag: 'NLD',
  },
  {
    id: 'nld-zaandam',
    name: 'ZAANDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-zaltbommel',
    name: 'ZALTBOMMEL',
    flag: 'NLD',
  },
  {
    id: 'nld-zierikzee',
    name: 'ZIERIKZEE',
    flag: 'NLD',
  },
  {
    id: 'nld-zutphen',
    name: 'ZUTPHEN',
    flag: 'NLD',
  },
  {
    id: 'nor-aardal',
    name: 'AARDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-abelvaer',
    name: 'ABELVAER',
    flag: 'NOR',
  },
  {
    id: 'nor-akkarvik',
    name: 'AKKARVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-alsvag',
    name: 'ALSVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-alvik',
    name: 'ALVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-andalsnes',
    name: 'ANDALSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-ardalstangen',
    name: 'ARDALSTANGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-askje',
    name: 'ASKJE',
    flag: 'NOR',
  },
  {
    id: 'nor-borsa',
    name: 'BORSA',
    flag: 'NOR',
  },
  {
    id: 'nor-breivoll',
    name: 'BREIVOLL',
    flag: 'NOR',
  },
  {
    id: 'nor-brekke',
    name: 'BREKKE',
    flag: 'NOR',
  },
  {
    id: 'nor-brekstad',
    name: 'BREKSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-brevik',
    name: 'BREVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-bugoynes',
    name: 'BUGOYNES',
    flag: 'NOR',
  },
  {
    id: 'nor-burfjord',
    name: 'BURFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-buroysund',
    name: 'BUROYSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-drag',
    name: 'DRAG',
    flag: 'NOR',
  },
  {
    id: 'nor-drammen',
    name: 'DRAMMEN',
    flag: 'NOR',
  },
  {
    id: 'nor-drobak',
    name: 'DROBAK',
    flag: 'NOR',
  },
  {
    id: 'nor-eikefetanchorage',
    name: 'EIKEFET ANCHORAGE',
    flag: 'NOR',
  },
  {
    id: 'nor-ekne',
    name: 'EKNE',
    flag: 'NOR',
  },
  {
    id: 'nor-elnesvagen',
    name: 'ELNESVAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-engene',
    name: 'ENGENE',
    flag: 'NOR',
  },
  {
    id: 'nor-fagerstrand',
    name: 'FAGERSTRAND',
    flag: 'NOR',
  },
  {
    id: 'nor-fauske',
    name: 'FAUSKE',
    flag: 'NOR',
  },
  {
    id: 'nor-filtvet',
    name: 'FILTVET',
    flag: 'NOR',
  },
  {
    id: 'nor-flatoy',
    name: 'FLATOY',
    flag: 'NOR',
  },
  {
    id: 'nor-follafoss',
    name: 'FOLLAFOSS',
    flag: 'NOR',
  },
  {
    id: 'nor-forus',
    name: 'FORUS',
    flag: 'NOR',
  },
  {
    id: 'nor-fredrikstad',
    name: 'FREDRIKSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-fuglevik',
    name: 'FUGLEVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-geiranger',
    name: 'GEIRANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-gjermundshamn',
    name: 'GJERMUNDSHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-gladstad',
    name: 'GLADSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-glomfjord',
    name: 'GLOMFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-grovfjord',
    name: 'GROVFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-gudvangen',
    name: 'GUDVANGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-gursken',
    name: 'GURSKEN',
    flag: 'NOR',
  },
  {
    id: 'nor-haakonsvern',
    name: 'HAAKONSVERN',
    flag: 'NOR',
  },
  {
    id: 'nor-halden',
    name: 'HALDEN',
    flag: 'NOR',
  },
  {
    id: 'nor-hamn',
    name: 'HAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-hanoytangen',
    name: 'HANOYTANGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-hasselvika',
    name: 'HASSELVIKA',
    flag: 'NOR',
  },
  {
    id: 'nor-helgeroa',
    name: 'HELGEROA',
    flag: 'NOR',
  },
  {
    id: 'nor-helnessund',
    name: 'HELNESSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-hemnesberget',
    name: 'HEMNESBERGET',
    flag: 'NOR',
  },
  {
    id: 'nor-hervik',
    name: 'HERVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-hjellestad',
    name: 'HJELLESTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-hjelmeland',
    name: 'HJELMELAND',
    flag: 'NOR',
  },
  {
    id: 'nor-holla',
    name: 'HOLLA',
    flag: 'NOR',
  },
  {
    id: 'nor-holmsbu',
    name: 'HOLMSBU',
    flag: 'NOR',
  },
  {
    id: 'nor-hommersak',
    name: 'HOMMERSAK',
    flag: 'NOR',
  },
  {
    id: 'nor-horten',
    name: 'HORTEN',
    flag: 'NOR',
  },
  {
    id: 'nor-hoyanger',
    name: 'HOYANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-hoylandsbygd',
    name: 'HOYLANDSBYGD',
    flag: 'NOR',
  },
  {
    id: 'nor-husnes',
    name: 'HUSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-jelsa',
    name: 'JELSA',
    flag: 'NOR',
  },
  {
    id: 'nor-jondal',
    name: 'JONDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-jorpeland',
    name: 'JORPELAND',
    flag: 'NOR',
  },
  {
    id: 'nor-judaberg',
    name: 'JUDABERG',
    flag: 'NOR',
  },
  {
    id: 'nor-karsto',
    name: 'KARSTO',
    flag: 'NOR',
  },
  {
    id: 'nor-karyingen',
    name: 'KARYINGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-kjella',
    name: 'KJELLA',
    flag: 'NOR',
  },
  {
    id: 'nor-kjopsvik',
    name: 'KJOPSVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-knarvik',
    name: 'KNARVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-kragero',
    name: 'KRAGERO',
    flag: 'NOR',
  },
  {
    id: 'nor-laerdalsoyri',
    name: 'LAERDALSOYRI',
    flag: 'NOR',
  },
  {
    id: 'nor-larkollen',
    name: 'LARKOLLEN',
    flag: 'NOR',
  },
  {
    id: 'nor-leirvika',
    name: 'LEIRVIKA',
    flag: 'NOR',
  },
  {
    id: 'nor-leirvikinhyllestad',
    name: 'LEIRVIK IN HYLLESTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-lervik',
    name: 'LERVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-lyngseidet',
    name: 'LYNGSEIDET',
    flag: 'NOR',
  },
  {
    id: 'nor-melsbo',
    name: 'MELSBO',
    flag: 'NOR',
  },
  {
    id: 'nor-moirana',
    name: 'MO I RANA',
    flag: 'NOR',
  },
  {
    id: 'nor-mosjoen',
    name: 'MOSJOEN',
    flag: 'NOR',
  },
  {
    id: 'nor-moss',
    name: 'MOSS',
    flag: 'NOR',
  },
  {
    id: 'nor-muruvik',
    name: 'MURUVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-narvik',
    name: 'NARVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-nesna',
    name: 'NESNA',
    flag: 'NOR',
  },
  {
    id: 'nor-oksenoya',
    name: 'OKSENOYA',
    flag: 'NOR',
  },
  {
    id: 'nor-olderdalen',
    name: 'OLDERDALEN',
    flag: 'NOR',
  },
  {
    id: 'nor-omastranda',
    name: 'OMASTRANDA',
    flag: 'NOR',
  },
  {
    id: 'nor-orkanger',
    name: 'ORKANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-ornes',
    name: 'ORNES',
    flag: 'NOR',
  },
  {
    id: 'nor-oslo',
    name: 'OSLO',
    flag: 'NOR',
  },
  {
    id: 'nor-osoyro',
    name: 'OSOYRO',
    flag: 'NOR',
  },
  {
    id: 'nor-papper',
    name: 'PAPPER',
    flag: 'NOR',
  },
  {
    id: 'nor-porsgrunn',
    name: 'PORSGRUNN',
    flag: 'NOR',
  },
  {
    id: 'nor-reilstad',
    name: 'REILSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-rognan',
    name: 'ROGNAN',
    flag: 'NOR',
  },
  {
    id: 'nor-rosendal',
    name: 'ROSENDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-sand',
    name: 'SAND',
    flag: 'NOR',
  },
  {
    id: 'nor-sandbukta',
    name: 'SANDBUKTA',
    flag: 'NOR',
  },
  {
    id: 'nor-sandnes',
    name: 'SANDNES',
    flag: 'NOR',
  },
  {
    id: 'nor-sauda',
    name: 'SAUDA',
    flag: 'NOR',
  },
  {
    id: 'nor-skibotn',
    name: 'SKIBOTN',
    flag: 'NOR',
  },
  {
    id: 'nor-skipstadsand',
    name: 'SKIPSTADSAND',
    flag: 'NOR',
  },
  {
    id: 'nor-skjanes',
    name: 'SKJANES',
    flag: 'NOR',
  },
  {
    id: 'nor-skogn',
    name: 'SKOGN',
    flag: 'NOR',
  },
  {
    id: 'nor-skutvik',
    name: 'SKUTVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-slemmestad',
    name: 'SLEMMESTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-slovaag',
    name: 'SLOVAAG',
    flag: 'NOR',
  },
  {
    id: 'nor-sorkjosen',
    name: 'SORKJOSEN',
    flag: 'NOR',
  },
  {
    id: 'nor-steinkjer',
    name: 'STEINKJER',
    flag: 'NOR',
  },
  {
    id: 'nor-stjernoy',
    name: 'STJERNOY',
    flag: 'NOR',
  },
  {
    id: 'nor-stjordal',
    name: 'STJORDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-storsteilene',
    name: 'STORSTEILENE',
    flag: 'NOR',
  },
  {
    id: 'nor-sund',
    name: 'SUND',
    flag: 'NOR',
  },
  {
    id: 'nor-sunndalsora',
    name: 'SUNNDALSORA',
    flag: 'NOR',
  },
  {
    id: 'nor-svelvik',
    name: 'SVELVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-sykkylven',
    name: 'SYKKYLVEN',
    flag: 'NOR',
  },
  {
    id: 'nor-tau',
    name: 'TAU',
    flag: 'NOR',
  },
  {
    id: 'nor-titran',
    name: 'TITRAN',
    flag: 'NOR',
  },
  {
    id: 'nor-tjome',
    name: 'TJOME',
    flag: 'NOR',
  },
  {
    id: 'nor-tjotta',
    name: 'TJOTTA',
    flag: 'NOR',
  },
  {
    id: 'nor-tvedestrand',
    name: 'TVEDESTRAND',
    flag: 'NOR',
  },
  {
    id: 'nor-tyssedal',
    name: 'TYSSEDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-vaksdal',
    name: 'VAKSDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-vanvikan',
    name: 'VANVIKAN',
    flag: 'NOR',
  },
  {
    id: 'nor-verdal',
    name: 'VERDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-viebust',
    name: 'VIEBUST',
    flag: 'NOR',
  },
  {
    id: 'nor-vikoyri',
    name: 'VIKOYRI',
    flag: 'NOR',
  },
  {
    id: 'nzl-auckland',
    name: 'AUCKLAND',
    flag: 'NZL',
  },
  {
    id: 'nzl-bayswater',
    name: 'BAYSWATER',
    flag: 'NZL',
  },
  {
    id: 'nzl-bostaquetbay',
    name: 'BOSTAQUET BAY',
    flag: 'NZL',
  },
  {
    id: 'nzl-campbay',
    name: 'CAMP BAY',
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
    id: 'nzl-greatmercuryisland',
    name: 'GREAT MERCURY ISLAND',
    flag: 'NZL',
  },
  {
    id: 'nzl-greymouth',
    name: 'GREYMOUTH',
    flag: 'NZL',
  },
  {
    id: 'nzl-gulfharbour',
    name: 'GULF HARBOUR',
    flag: 'NZL',
  },
  {
    id: 'nzl-halfmoonbay',
    name: 'HALF MOON BAY',
    flag: 'NZL',
  },
  {
    id: 'nzl-havelock',
    name: 'HAVELOCK',
    flag: 'NZL',
  },
  {
    id: 'nzl-kawau',
    name: 'KAWAU',
    flag: 'NZL',
  },
  {
    id: 'nzl-leigh',
    name: 'LEIGH',
    flag: 'NZL',
  },
  {
    id: 'nzl-lochmarabay',
    name: 'LOCHMARA BAY',
    flag: 'NZL',
  },
  {
    id: 'nzl-mangonui',
    name: 'MANGONUI',
    flag: 'NZL',
  },
  {
    id: 'nzl-marsdenpoint',
    name: 'MARSDEN POINT',
    flag: 'NZL',
  },
  {
    id: 'nzl-matapouri',
    name: 'MATAPOURI',
    flag: 'NZL',
  },
  {
    id: 'nzl-mimiwhangatabay',
    name: 'MIMIWHANGATA BAY',
    flag: 'NZL',
  },
  {
    id: 'nzl-moturuaisland',
    name: 'MOTURUA ISLAND',
    flag: 'NZL',
  },
  {
    id: 'nzl-nelson',
    name: 'NELSON',
    flag: 'NZL',
  },
  {
    id: 'nzl-newplymouth',
    name: 'NEW PLYMOUTH',
    flag: 'NZL',
  },
  {
    id: 'nzl-nz-104',
    name: 'NZ-104',
    flag: 'NZL',
  },
  {
    id: 'nzl-opua',
    name: 'OPUA',
    flag: 'NZL',
  },
  {
    id: 'nzl-orakei',
    name: 'ORAKEI',
    flag: 'NZL',
  },
  {
    id: 'nzl-paihia',
    name: 'PAIHIA',
    flag: 'NZL',
  },
  {
    id: 'nzl-pareanuibay',
    name: 'PAREANUI BAY',
    flag: 'NZL',
  },
  {
    id: 'nzl-picton',
    name: 'PICTON',
    flag: 'NZL',
  },
  {
    id: 'nzl-pineharbour',
    name: 'PINE HARBOUR',
    flag: 'NZL',
  },
  {
    id: 'nzl-porirua',
    name: 'PORIRUA',
    flag: 'NZL',
  },
  {
    id: 'nzl-portchalmers',
    name: 'PORT CHALMERS',
    flag: 'NZL',
  },
  {
    id: 'nzl-portfitzroy',
    name: 'PORT FITZROY',
    flag: 'NZL',
  },
  {
    id: 'nzl-rakinoisland',
    name: 'RAKINO ISLAND',
    flag: 'NZL',
  },
  {
    id: 'nzl-rakituisland',
    name: 'RAKITU ISLAND',
    flag: 'NZL',
  },
  {
    id: 'nzl-russell',
    name: 'RUSSELL',
    flag: 'NZL',
  },
  {
    id: 'nzl-seaviewmarina',
    name: 'SEAVIEW MARINA',
    flag: 'NZL',
  },
  {
    id: 'nzl-slipperisland',
    name: 'SLIPPER ISLAND',
    flag: 'NZL',
  },
  {
    id: 'nzl-stewartisland',
    name: 'STEWART ISLAND',
    flag: 'NZL',
  },
  {
    id: 'nzl-tauranga',
    name: 'TAURANGA',
    flag: 'NZL',
  },
  {
    id: 'nzl-timaru',
    name: 'TIMARU',
    flag: 'NZL',
  },
  {
    id: 'nzl-tiritirimatangiisland',
    name: 'TIRITIRI MATANGI ISLAND',
    flag: 'NZL',
  },
  {
    id: 'nzl-tryphena',
    name: 'TRYPHENA',
    flag: 'NZL',
  },
  {
    id: 'nzl-tutukaka',
    name: 'TUTUKAKA',
    flag: 'NZL',
  },
  {
    id: 'nzl-waihekeisland',
    name: 'WAIHEKE ISLAND',
    flag: 'NZL',
  },
  {
    id: 'nzl-waikawa',
    name: 'WAIKAWA',
    flag: 'NZL',
  },
  {
    id: 'nzl-wellington',
    name: 'WELLINGTON',
    flag: 'NZL',
  },
  {
    id: 'nzl-westport',
    name: 'WESTPORT',
    flag: 'NZL',
  },
  {
    id: 'nzl-whangamata',
    name: 'WHANGAMATA',
    flag: 'NZL',
  },
  {
    id: 'nzl-whangarei',
    name: 'WHANGAREI',
    flag: 'NZL',
  },
  {
    id: 'nzl-whangaroa',
    name: 'WHANGAROA',
    flag: 'NZL',
  },
  {
    id: 'nzl-whangaruru',
    name: 'WHANGARURU',
    flag: 'NZL',
  },
  {
    id: 'nzl-whitianga',
    name: 'WHITIANGA',
    flag: 'NZL',
  },
  {
    id: 'omn-almouj',
    name: 'ALMOUJ',
    flag: 'OMN',
  },
  {
    id: 'omn-almudayq',
    name: 'AL MUDAYQ',
    flag: 'OMN',
  },
  {
    id: 'omn-alsuwayq',
    name: 'Al SUWAYQ',
    flag: 'OMN',
  },
  {
    id: 'omn-hassa',
    name: 'HASSA',
    flag: 'OMN',
  },
  {
    id: 'omn-khasab',
    name: 'KHASAB',
    flag: 'OMN',
  },
  {
    id: 'omn-minaalfahlanchorage',
    name: 'MINA AL FAHL ANCHORAGE',
    flag: 'OMN',
  },
  {
    id: 'omn-qalhatlngterminal',
    name: 'QALHAT LNG TERMINAL',
    flag: 'OMN',
  },
  {
    id: 'omn-shinas',
    name: 'SHINAS',
    flag: 'OMN',
  },
  {
    id: 'pak-gadanianchorage',
    name: 'GADANI ANCHORAGE',
    flag: 'PAK',
  },
  {
    id: 'pak-gwadar',
    name: 'GWADAR',
    flag: 'PAK',
  },
  {
    id: 'pak-karachi',
    name: 'KARACHI',
    flag: 'PAK',
  },
  {
    id: 'pak-portqasim',
    name: 'PORT QASIM',
    flag: 'PAK',
  },
  {
    id: 'pan-almirante',
    name: 'ALMIRANTE',
    flag: 'PAN',
  },
  {
    id: 'pan-bocasdeltoro',
    name: 'BOCAS DEL TORO',
    flag: 'PAN',
  },
  {
    id: 'pan-chagresriveranchorage',
    name: 'CHAGRES RIVER ANCHORAGE',
    flag: 'PAN',
  },
  {
    id: 'pan-chiriquigrande',
    name: 'CHIRIQUI GRANDE',
    flag: 'PAN',
  },
  {
    id: 'pan-colon2000',
    name: 'COLON 2000',
    flag: 'PAN',
  },
  {
    id: 'pan-cristobal',
    name: 'CRISTOBAL',
    flag: 'PAN',
  },
  {
    id: 'pan-gamboa',
    name: 'GAMBOA',
    flag: 'PAN',
  },
  {
    id: 'pan-lascumbres',
    name: 'LAS CUMBRES',
    flag: 'PAN',
  },
  {
    id: 'pan-lasminas',
    name: 'LAS MINAS',
    flag: 'PAN',
  },
  {
    id: 'pan-limonbaymarina',
    name: 'LIMON BAY MARINA',
    flag: 'PAN',
  },
  {
    id: 'pan-portobelo',
    name: 'PORTOBELO',
    flag: 'PAN',
  },
  {
    id: 'pan-puenteatlantico',
    name: 'PUENTE ATLANTICO',
    flag: 'PAN',
  },
  {
    id: 'pan-sanblas',
    name: 'SAN BLAS',
    flag: 'PAN',
  },
  {
    id: 'pcn-adamstown',
    name: 'ADAMSTOWN',
    flag: 'PCN',
  },
  {
    id: 'per-barranco',
    name: 'BARRANCO',
    flag: 'PER',
  },
  {
    id: 'per-conchan',
    name: 'CONCHAN',
    flag: 'PER',
  },
  {
    id: 'per-culebras',
    name: 'CULEBRAS',
    flag: 'PER',
  },
  {
    id: 'per-melchorita',
    name: 'MELCHORITA',
    flag: 'PER',
  },
  {
    id: 'phl-agusan',
    name: 'AGUSAN',
    flag: 'PHL',
  },
  {
    id: 'phl-bacolodcity',
    name: 'BACOLOD CITY',
    flag: 'PHL',
  },
  {
    id: 'phl-balayan',
    name: 'BALAYAN',
    flag: 'PHL',
  },
  {
    id: 'phl-balud',
    name: 'BALUD',
    flag: 'PHL',
  },
  {
    id: 'phl-batangas',
    name: 'BATANGAS',
    flag: 'PHL',
  },
  {
    id: 'phl-batangascity',
    name: 'BATANGAS CITY',
    flag: 'PHL',
  },
  {
    id: 'phl-bauan',
    name: 'BAUAN',
    flag: 'PHL',
  },
  {
    id: 'phl-berong',
    name: 'BERONG',
    flag: 'PHL',
  },
  {
    id: 'phl-bolo',
    name: 'BOLO',
    flag: 'PHL',
  },
  {
    id: 'phl-buanoy',
    name: 'BUANOY',
    flag: 'PHL',
  },
  {
    id: 'phl-bugo',
    name: 'BUGO',
    flag: 'PHL',
  },
  {
    id: 'phl-cagayandeoro',
    name: 'CAGAYAN DE ORO',
    flag: 'PHL',
  },
  {
    id: 'phl-cagdianao',
    name: 'CAGDIANAO',
    flag: 'PHL',
  },
  {
    id: 'phl-cagsiay',
    name: 'CAGSIAY',
    flag: 'PHL',
  },
  {
    id: 'phl-calaca',
    name: 'CALACA',
    flag: 'PHL',
  },
  {
    id: 'phl-calapan',
    name: 'CALAPAN',
    flag: 'PHL',
  },
  {
    id: 'phl-calero',
    name: 'CALERO',
    flag: 'PHL',
  },
  {
    id: 'phl-carrascal',
    name: 'CARRASCAL',
    flag: 'PHL',
  },
  {
    id: 'phl-castanas',
    name: 'CASTANAS',
    flag: 'PHL',
  },
  {
    id: 'phl-caticlan',
    name: 'CATICLAN',
    flag: 'PHL',
  },
  {
    id: 'phl-cebu',
    name: 'CEBU',
    flag: 'PHL',
  },
  {
    id: 'phl-cogan',
    name: 'COGAN',
    flag: 'PHL',
  },
  {
    id: 'phl-coron',
    name: 'CORON',
    flag: 'PHL',
  },
  {
    id: 'phl-coronon',
    name: 'CORONON',
    flag: 'PHL',
  },
  {
    id: 'phl-dalipuga',
    name: 'DALIPUGA',
    flag: 'PHL',
  },
  {
    id: 'phl-dapa',
    name: 'DAPA',
    flag: 'PHL',
  },
  {
    id: 'phl-dapitan',
    name: 'DAPITAN',
    flag: 'PHL',
  },
  {
    id: 'phl-dumaguete',
    name: 'DUMAGUETE',
    flag: 'PHL',
  },
  {
    id: 'phl-espanola',
    name: 'ESPANOLA',
    flag: 'PHL',
  },
  {
    id: 'phl-garciahernandez',
    name: 'GARCIA HERNANDEZ',
    flag: 'PHL',
  },
  {
    id: 'phl-hiju,maco',
    name: 'HIJU, MACO',
    flag: 'PHL',
  },
  {
    id: 'phl-hinatuan',
    name: 'HINATUAN',
    flag: 'PHL',
  },
  {
    id: 'phl-iligan',
    name: 'ILIGAN',
    flag: 'PHL',
  },
  {
    id: 'phl-ilihan',
    name: 'ILIHAN',
    flag: 'PHL',
  },
  {
    id: 'phl-iloilo',
    name: 'ILOILO',
    flag: 'PHL',
  },
  {
    id: 'phl-inawayan',
    name: 'INAWAYAN',
    flag: 'PHL',
  },
  {
    id: 'phl-ipil',
    name: 'IPIL',
    flag: 'PHL',
  },
  {
    id: 'phl-isabel',
    name: 'ISABEL',
    flag: 'PHL',
  },
  {
    id: 'phl-jimenez',
    name: 'JIMENEZ',
    flag: 'PHL',
  },
  {
    id: 'phl-jordan',
    name: 'JORDAN',
    flag: 'PHL',
  },
  {
    id: 'phl-kauswagan',
    name: 'KAUSWAGAN',
    flag: 'PHL',
  },
  {
    id: 'phl-langatian',
    name: 'LANGATIAN',
    flag: 'PHL',
  },
  {
    id: 'phl-langtad',
    name: 'LANGTAD',
    flag: 'PHL',
  },
  {
    id: 'phl-lapu-lapucity',
    name: 'LAPU-LAPU CITY',
    flag: 'PHL',
  },
  {
    id: 'phl-legazpiport',
    name: 'LEGAZPI PORT',
    flag: 'PHL',
  },
  {
    id: 'phl-libertad',
    name: 'LIBERTAD',
    flag: 'PHL',
  },
  {
    id: 'phl-limay',
    name: 'LIMAY',
    flag: 'PHL',
  },
  {
    id: 'phl-loreto',
    name: 'LORETO',
    flag: 'PHL',
  },
  {
    id: 'phl-lugait',
    name: 'LUGAIT',
    flag: 'PHL',
  },
  {
    id: 'phl-maasin',
    name: 'MAASIN',
    flag: 'PHL',
  },
  {
    id: 'phl-mabini',
    name: 'MABINI',
    flag: 'PHL',
  },
  {
    id: 'phl-mahayag',
    name: 'MAHAYAG',
    flag: 'PHL',
  },
  {
    id: 'phl-malita',
    name: 'MALITA',
    flag: 'PHL',
  },
  {
    id: 'phl-manoc-manoc',
    name: 'MANOC-MANOC',
    flag: 'PHL',
  },
  {
    id: 'phl-mariveles',
    name: 'MARIVELES',
    flag: 'PHL',
  },
  {
    id: 'phl-masbate',
    name: 'MASBATE',
    flag: 'PHL',
  },
  {
    id: 'phl-matnog',
    name: 'MATNOG',
    flag: 'PHL',
  },
  {
    id: 'phl-minglanilla',
    name: 'MINGLANILLA',
    flag: 'PHL',
  },
  {
    id: 'phl-minlagas',
    name: 'MINLAGAS',
    flag: 'PHL',
  },
  {
    id: 'phl-naga',
    name: 'NAGA',
    flag: 'PHL',
  },
  {
    id: 'phl-narrapalawan',
    name: 'NARRA PALAWAN',
    flag: 'PHL',
  },
  {
    id: 'phl-nasipitport',
    name: 'NASIPIT PORT',
    flag: 'PHL',
  },
  {
    id: 'phl-navotas',
    name: 'NAVOTAS',
    flag: 'PHL',
  },
  {
    id: 'phl-obong',
    name: 'OBONG',
    flag: 'PHL',
  },
  {
    id: 'phl-ormoc',
    name: 'ORMOC',
    flag: 'PHL',
  },
  {
    id: 'phl-pagbilao',
    name: 'PAGBILAO',
    flag: 'PHL',
  },
  {
    id: 'phl-palawan',
    name: 'PALAWAN',
    flag: 'PHL',
  },
  {
    id: 'phl-pasacao',
    name: 'PASACAO',
    flag: 'PHL',
  },
  {
    id: 'phl-phriotuba',
    name: 'PH RIO TUBA',
    flag: 'PHL',
  },
  {
    id: 'phl-phsubic',
    name: 'PH SUBIC',
    flag: 'PHL',
  },
  {
    id: 'phl-polloc(cotabato)',
    name: 'POLLOC (COTABATO)',
    flag: 'PHL',
  },
  {
    id: 'phl-portcapiz',
    name: 'PORT CAPIZ',
    flag: 'PHL',
  },
  {
    id: 'phl-portozamis',
    name: 'PORT OZAMIS',
    flag: 'PHL',
  },
  {
    id: 'phl-puertogalera',
    name: 'PUERTO GALERA',
    flag: 'PHL',
  },
  {
    id: 'phl-puertoprincesa',
    name: 'PUERTO PRINCESA',
    flag: 'PHL',
  },
  {
    id: 'phl-pulupandan',
    name: 'PULUPANDAN',
    flag: 'PHL',
  },
  {
    id: 'phl-recodo',
    name: 'RECODO',
    flag: 'PHL',
  },
  {
    id: 'phl-riotuba',
    name: 'RIO TUBA',
    flag: 'PHL',
  },
  {
    id: 'phl-sanfernando',
    name: 'SAN FERNANDO',
    flag: 'PHL',
  },
  {
    id: 'phl-sangali',
    name: 'SANGALI',
    flag: 'PHL',
  },
  {
    id: 'phl-sangat',
    name: 'SANGAT',
    flag: 'PHL',
  },
  {
    id: 'phl-sanmiguel',
    name: 'SAN MIGUEL',
    flag: 'PHL',
  },
  {
    id: 'phl-santaritaaplaya',
    name: 'SANTA RITA APLAYA',
    flag: 'PHL',
  },
  {
    id: 'phl-seatrial',
    name: 'SEATRIAL',
    flag: 'PHL',
  },
  {
    id: 'phl-semirara',
    name: 'SEMIRARA',
    flag: 'PHL',
  },
  {
    id: 'phl-sinisian',
    name: 'SINISIAN',
    flag: 'PHL',
  },
  {
    id: 'phl-solana',
    name: 'SOLANA',
    flag: 'PHL',
  },
  {
    id: 'phl-spratlyislands',
    name: 'SPRATLY ISLANDS',
    flag: 'PHL',
  },
  {
    id: 'phl-subic',
    name: 'SUBIC',
    flag: 'PHL',
  },
  {
    id: 'phl-subicbayvicinity',
    name: 'SUBIC BAY VICINITY',
    flag: 'PHL',
  },
  {
    id: 'phl-surigao',
    name: 'SURIGAO',
    flag: 'PHL',
  },
  {
    id: 'phl-surigaocity',
    name: 'SURIGAO CITY',
    flag: 'PHL',
  },
  {
    id: 'phl-tabaco',
    name: 'TABACO',
    flag: 'PHL',
  },
  {
    id: 'phl-tacloban',
    name: 'TACLOBAN',
    flag: 'PHL',
  },
  {
    id: 'phl-taganito',
    name: 'TAGANITO',
    flag: 'PHL',
  },
  {
    id: 'phl-tagbilaran',
    name: 'TAGBILARAN',
    flag: 'PHL',
  },
  {
    id: 'phl-talaga',
    name: 'TALAGA',
    flag: 'PHL',
  },
  {
    id: 'phl-tandayag',
    name: 'TANDAYAG',
    flag: 'PHL',
  },
  {
    id: 'phl-tawitawi',
    name: 'TAWI TAWI',
    flag: 'PHL',
  },
  {
    id: 'phl-toledo',
    name: 'TOLEDO',
    flag: 'PHL',
  },
  {
    id: 'phl-toril',
    name: 'TORIL',
    flag: 'PHL',
  },
  {
    id: 'phl-tubay',
    name: 'TUBAY',
    flag: 'PHL',
  },
  {
    id: 'phl-tubigan',
    name: 'TUBIGAN',
    flag: 'PHL',
  },
  {
    id: 'phl-villanueva',
    name: 'VILLANUEVA',
    flag: 'PHL',
  },
  {
    id: 'phl-zamboanga',
    name: 'ZAMBOANGA',
    flag: 'PHL',
  },
  {
    id: 'png-alotau',
    name: 'ALOTAU',
    flag: 'PNG',
  },
  {
    id: 'png-basamuk',
    name: 'BASAMUK',
    flag: 'PNG',
  },
  {
    id: 'png-bialla',
    name: 'BIALLA',
    flag: 'PNG',
  },
  {
    id: 'png-buka',
    name: 'BUKA',
    flag: 'PNG',
  },
  {
    id: 'png-drina',
    name: 'DRINA',
    flag: 'PNG',
  },
  {
    id: 'png-kangelona',
    name: 'KANGELONA',
    flag: 'PNG',
  },
  {
    id: 'png-karu',
    name: 'KARU',
    flag: 'PNG',
  },
  {
    id: 'png-kavieng',
    name: 'KAVIENG',
    flag: 'PNG',
  },
  {
    id: 'png-kimbe',
    name: 'KIMBE',
    flag: 'PNG',
  },
  {
    id: 'png-kiunga',
    name: 'KIUNGA',
    flag: 'PNG',
  },
  {
    id: 'png-kumul',
    name: 'KUMUL',
    flag: 'PNG',
  },
  {
    id: 'png-lihir',
    name: 'LIHIR',
    flag: 'PNG',
  },
  {
    id: 'png-lorengau',
    name: 'LORENGAU',
    flag: 'PNG',
  },
  {
    id: 'png-muliama',
    name: 'MULIAMA',
    flag: 'PNG',
  },
  {
    id: 'png-orobay',
    name: 'ORO BAY',
    flag: 'PNG',
  },
  {
    id: 'png-portmoresby',
    name: 'PORT MORESBY',
    flag: 'PNG',
  },
  {
    id: 'png-sampalpa',
    name: 'SAMPALPA',
    flag: 'PNG',
  },
  {
    id: 'pol-darlowo',
    name: 'DARLOWO',
    flag: 'POL',
  },
  {
    id: 'pol-gdansk',
    name: 'GDANSK',
    flag: 'POL',
  },
  {
    id: 'pol-hel',
    name: 'HEL',
    flag: 'POL',
  },
  {
    id: 'pol-jastarnia',
    name: 'JASTARNIA',
    flag: 'POL',
  },
  {
    id: 'pol-kolobrzeg',
    name: 'KOLOBRZEG',
    flag: 'POL',
  },
  {
    id: 'pol-portmorskipolice',
    name: 'PORT MORSKI POLICE',
    flag: 'POL',
  },
  {
    id: 'pol-sopot',
    name: 'SOPOT',
    flag: 'POL',
  },
  {
    id: 'pol-swinoujscie',
    name: 'SWINOUJSCIE',
    flag: 'POL',
  },
  {
    id: 'pol-szczecin',
    name: 'SZCZECIN',
    flag: 'POL',
  },
  {
    id: 'pol-ustka',
    name: 'USTKA',
    flag: 'POL',
  },
  {
    id: 'pol-wladyslawowo',
    name: 'WLADYSLAWOWO',
    flag: 'POL',
  },
  {
    id: 'pri-arecibo',
    name: 'ARECIBO',
    flag: 'PRI',
  },
  {
    id: 'pri-boqueron',
    name: 'BOQUERON',
    flag: 'PRI',
  },
  {
    id: 'pri-culebra',
    name: 'CULEBRA',
    flag: 'PRI',
  },
  {
    id: 'pri-esperanza',
    name: 'ESPERANZA',
    flag: 'PRI',
  },
  {
    id: 'pri-fajardo',
    name: 'FAJARDO',
    flag: 'PRI',
  },
  {
    id: 'pri-guayanilla',
    name: 'GUAYANILLA',
    flag: 'PRI',
  },
  {
    id: 'pri-islapalominos',
    name: 'ISLA PALOMINOS',
    flag: 'PRI',
  },
  {
    id: 'pri-lasmareas',
    name: 'LAS MAREAS',
    flag: 'PRI',
  },
  {
    id: 'pri-mariaantonia',
    name: 'MARIA ANTONIA',
    flag: 'PRI',
  },
  {
    id: 'pri-mayaguez',
    name: 'MAYAGUEZ',
    flag: 'PRI',
  },
  {
    id: 'pri-palmasdelmar',
    name: 'PALMAS DEL MAR',
    flag: 'PRI',
  },
  {
    id: 'pri-ponce',
    name: 'PONCE',
    flag: 'PRI',
  },
  {
    id: 'pri-puertodelrey',
    name: 'PUERTO DEL REY',
    flag: 'PRI',
  },
  {
    id: 'pri-puertoreal',
    name: 'PUERTO REAL',
    flag: 'PRI',
  },
  {
    id: 'pri-puertoyabucoa',
    name: 'PUERTO YABUCOA',
    flag: 'PRI',
  },
  {
    id: 'pri-salinas',
    name: 'SALINAS',
    flag: 'PRI',
  },
  {
    id: 'pri-sanjuan',
    name: 'SAN JUAN',
    flag: 'PRI',
  },
  {
    id: 'prk-haeju',
    name: 'HAEJU',
    flag: 'PRK',
  },
  {
    id: 'prk-nampo',
    name: 'NAMPO',
    flag: 'PRK',
  },
  {
    id: 'prk-taean',
    name: 'TAEAN',
    flag: 'PRK',
  },
  {
    id: 'prk-wonsan',
    name: 'WONSAN',
    flag: 'PRK',
  },
  {
    id: 'prt-albufeira',
    name: 'ALBUFEIRA',
    flag: 'PRT',
  },
  {
    id: 'prt-aveiro',
    name: 'AVEIRO',
    flag: 'PRT',
  },
  {
    id: 'prt-canical',
    name: 'CANICAL',
    flag: 'PRT',
  },
  {
    id: 'prt-cascais',
    name: 'CASCAIS',
    flag: 'PRT',
  },
  {
    id: 'prt-faro',
    name: 'FARO',
    flag: 'PRT',
  },
  {
    id: 'prt-figueiradafoz',
    name: 'FIGUEIRA DA FOZ',
    flag: 'PRT',
  },
  {
    id: 'prt-funchal',
    name: 'FUNCHAL',
    flag: 'PRT',
  },
  {
    id: 'prt-horta',
    name: 'HORTA',
    flag: 'PRT',
  },
  {
    id: 'prt-lagos',
    name: 'LAGOS',
    flag: 'PRT',
  },
  {
    id: 'prt-lajes',
    name: 'LAJES',
    flag: 'PRT',
  },
  {
    id: 'prt-lajesdasflores',
    name: 'LAJES DAS FLORES',
    flag: 'PRT',
  },
  {
    id: 'prt-lisbon',
    name: 'LISBON',
    flag: 'PRT',
  },
  {
    id: 'prt-nazare',
    name: 'NAZARE',
    flag: 'PRT',
  },
  {
    id: 'prt-oeiras',
    name: 'OEIRAS',
    flag: 'PRT',
  },
  {
    id: 'prt-olhao',
    name: 'OLHAO',
    flag: 'PRT',
  },
  {
    id: 'prt-peniche',
    name: 'PENICHE',
    flag: 'PRT',
  },
  {
    id: 'prt-portimao',
    name: 'PORTIMAO',
    flag: 'PRT',
  },
  {
    id: 'prt-porto',
    name: 'PORTO',
    flag: 'PRT',
  },
  {
    id: 'prt-portosanto',
    name: 'PORTO SANTO',
    flag: 'PRT',
  },
  {
    id: 'prt-povoadevarzim',
    name: 'POVOA DE VARZIM',
    flag: 'PRT',
  },
  {
    id: 'prt-praia',
    name: 'PRAIA',
    flag: 'PRT',
  },
  {
    id: 'prt-praiadavitoria',
    name: 'PRAIA DA VITORIA',
    flag: 'PRT',
  },
  {
    id: 'prt-sagres',
    name: 'SAGRES',
    flag: 'PRT',
  },
  {
    id: 'prt-sesimbra',
    name: 'SESIMBRA',
    flag: 'PRT',
  },
  {
    id: 'prt-setubal',
    name: 'SETUBAL',
    flag: 'PRT',
  },
  {
    id: 'prt-sines',
    name: 'SINES',
    flag: 'PRT',
  },
  {
    id: 'prt-velas',
    name: 'VELAS',
    flag: 'PRT',
  },
  {
    id: 'prt-vianadocastelo',
    name: 'VIANA DO CASTELO',
    flag: 'PRT',
  },
  {
    id: 'prt-viladoporto',
    name: 'VILA DO PORTO',
    flag: 'PRT',
  },
  {
    id: 'prt-vilamoura',
    name: 'VILAMOURA',
    flag: 'PRT',
  },
  {
    id: 'prt-vilarealdesantonio',
    name: 'VILA REAL DE S ANTONIO',
    flag: 'PRT',
  },
  {
    id: 'pry-asuncion',
    name: 'ASUNCION',
    flag: 'PRY',
  },
  {
    id: 'pry-concepcion',
    name: 'CONCEPCION',
    flag: 'PRY',
  },
  {
    id: 'pry-villahayes',
    name: 'VILLA HAYES',
    flag: 'PRY',
  },
  {
    id: 'pyf-atuona',
    name: 'ATUONA',
    flag: 'PYF',
  },
  {
    id: 'pyf-borabora',
    name: 'BORA BORA',
    flag: 'PYF',
  },
  {
    id: 'pyf-faaa',
    name: 'FAAA',
    flag: 'PYF',
  },
  {
    id: 'pyf-fakarava',
    name: 'FAKARAVA',
    flag: 'PYF',
  },
  {
    id: 'pyf-haapiti',
    name: 'HAAPITI',
    flag: 'PYF',
  },
  {
    id: 'pyf-hao',
    name: 'HAO',
    flag: 'PYF',
  },
  {
    id: 'pyf-huahine',
    name: 'HUAHINE',
    flag: 'PYF',
  },
  {
    id: 'pyf-mahina',
    name: 'MAHINA',
    flag: 'PYF',
  },
  {
    id: 'pyf-manihi',
    name: 'MANIHI',
    flag: 'PYF',
  },
  {
    id: 'pyf-maupiti',
    name: 'MAUPITI',
    flag: 'PYF',
  },
  {
    id: 'pyf-opunohubay',
    name: 'OPUNOHU BAY',
    flag: 'PYF',
  },
  {
    id: 'pyf-rangiroa',
    name: 'RANGIROA',
    flag: 'PYF',
  },
  {
    id: 'pyf-rikitea',
    name: 'RIKITEA',
    flag: 'PYF',
  },
  {
    id: 'pyf-tahaa',
    name: 'TAHAA',
    flag: 'PYF',
  },
  {
    id: 'pyf-teahupoo',
    name: 'TEAHUPOO',
    flag: 'PYF',
  },
  {
    id: 'pyf-tohautu',
    name: 'TOHAUTU',
    flag: 'PYF',
  },
  {
    id: 'pyf-uturoa',
    name: 'UTUROA',
    flag: 'PYF',
  },
  {
    id: 'pyf-vaiare',
    name: 'VAIARE',
    flag: 'PYF',
  },
  {
    id: 'pyf-vairao',
    name: 'VAIRAO',
    flag: 'PYF',
  },
  {
    id: 'qat-alruwais',
    name: 'AL RUWAIS',
    flag: 'QAT',
  },
  {
    id: 'qat-alshaheenterminal',
    name: 'AL SHAHEEN TERMINAL',
    flag: 'QAT',
  },
  {
    id: 'qat-alwakrah',
    name: 'AL WAKRAH',
    flag: 'QAT',
  },
  {
    id: 'qat-doha',
    name: 'DOHA',
    flag: 'QAT',
  },
  {
    id: 'qat-halul',
    name: 'HALUL',
    flag: 'QAT',
  },
  {
    id: 'qat-hamad',
    name: 'HAMAD',
    flag: 'QAT',
  },
  {
    id: 'qat-lusail',
    name: 'LUSAIL',
    flag: 'QAT',
  },
  {
    id: 'qat-mesaieed',
    name: 'MESAIEED',
    flag: 'QAT',
  },
  {
    id: 'qat-raslaffan',
    name: 'RAS LAFFAN',
    flag: 'QAT',
  },
  {
    id: 'qat-simaisma',
    name: 'SIMAISMA',
    flag: 'QAT',
  },
  {
    id: 'rou-agigea',
    name: 'AGIGEA',
    flag: 'ROU',
  },
  {
    id: 'rou-braila',
    name: 'BRAILA',
    flag: 'ROU',
  },
  {
    id: 'rou-constanta',
    name: 'CONSTANTA',
    flag: 'ROU',
  },
  {
    id: 'rou-galati',
    name: 'GALATI',
    flag: 'ROU',
  },
  {
    id: 'rou-mangalia',
    name: 'MANGALIA',
    flag: 'ROU',
  },
  {
    id: 'rou-midia',
    name: 'MIDIA',
    flag: 'ROU',
  },
  {
    id: 'rou-orsova',
    name: 'ORSOVA',
    flag: 'ROU',
  },
  {
    id: 'rou-ovidiu',
    name: 'OVIDIU',
    flag: 'ROU',
  },
  {
    id: 'rou-sulina',
    name: 'SULINA',
    flag: 'ROU',
  },
  {
    id: 'rou-tatanir',
    name: 'TATANIR',
    flag: 'ROU',
  },
  {
    id: 'rou-tulcea',
    name: 'TULCEA',
    flag: 'ROU',
  },
  {
    id: 'rus-adler',
    name: 'ADLER',
    flag: 'RUS',
  },
  {
    id: 'rus-amgu',
    name: 'AMGU',
    flag: 'RUS',
  },
  {
    id: 'rus-anadyr',
    name: 'ANADYR',
    flag: 'RUS',
  },
  {
    id: 'rus-anapa',
    name: 'ANAPA',
    flag: 'RUS',
  },
  {
    id: 'rus-arkhangelsk',
    name: 'ARKHANGELSK',
    flag: 'RUS',
  },
  {
    id: 'rus-astrakhan',
    name: 'ASTRAKHAN',
    flag: 'RUS',
  },
  {
    id: 'rus-azov',
    name: 'AZOV',
    flag: 'RUS',
  },
  {
    id: 'rus-bagaevskaya',
    name: 'BAGAEVSKAYA',
    flag: 'RUS',
  },
  {
    id: 'rus-baltiysk',
    name: 'BALTIYSK',
    flag: 'RUS',
  },
  {
    id: 'rus-baydaratskaya',
    name: 'BAYDARATSKAYA',
    flag: 'RUS',
  },
  {
    id: 'rus-belayagora',
    name: 'BELAYA GORA',
    flag: 'RUS',
  },
  {
    id: 'rus-beringovsky',
    name: 'BERINGOVSKY',
    flag: 'RUS',
  },
  {
    id: 'rus-bolshoykamen',
    name: 'BOLSHOY KAMEN',
    flag: 'RUS',
  },
  {
    id: 'rus-boshnyakovoanchorage',
    name: 'BOSHNYAKOVO ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'rus-bronka',
    name: 'BRONKA',
    flag: 'RUS',
  },
  {
    id: 'rus-bykovsky',
    name: 'BYKOVSKY',
    flag: 'RUS',
  },
  {
    id: 'rus-dekastri',
    name: 'DE KASTRI',
    flag: 'RUS',
  },
  {
    id: 'rus-dudinka',
    name: 'DUDINKA',
    flag: 'RUS',
  },
  {
    id: 'rus-egvekinot',
    name: 'EGVEKINOT',
    flag: 'RUS',
  },
  {
    id: 'rus-gelendzhik',
    name: 'GELENDZHIK',
    flag: 'RUS',
  },
  {
    id: 'rus-glinnik',
    name: 'GLINNIK',
    flag: 'RUS',
  },
  {
    id: 'rus-kandalaksha',
    name: 'KANDALAKSHA',
    flag: 'RUS',
  },
  {
    id: 'rus-karaginskiyzaliv',
    name: 'KARAGINSKIY ZALIV',
    flag: 'RUS',
  },
  {
    id: 'rus-kavkaz',
    name: 'KAVKAZ',
    flag: 'RUS',
  },
  {
    id: 'rus-kazan',
    name: 'KAZAN',
    flag: 'RUS',
  },
  {
    id: 'rus-kholmsk',
    name: 'KHOLMSK',
    flag: 'RUS',
  },
  {
    id: 'rus-konstantinovsk',
    name: 'KONSTANTINOVSK',
    flag: 'RUS',
  },
  {
    id: 'rus-korsakov',
    name: 'KORSAKOV',
    flag: 'RUS',
  },
  {
    id: 'rus-kozmino',
    name: 'KOZMINO',
    flag: 'RUS',
  },
  {
    id: 'rus-krabozavodsk',
    name: 'KRABOZAVODSK',
    flag: 'RUS',
  },
  {
    id: 'rus-kulikovoanchorage',
    name: 'KULIKOVO ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'rus-kurilsk',
    name: 'KURILSK',
    flag: 'RUS',
  },
  {
    id: 'rus-lensk',
    name: 'LENSK',
    flag: 'RUS',
  },
  {
    id: 'rus-lesosibirsk',
    name: 'LESOSIBIRSK',
    flag: 'RUS',
  },
  {
    id: 'rus-magadan',
    name: 'MAGADAN',
    flag: 'RUS',
  },
  {
    id: 'rus-makhachkala',
    name: 'MAKHACHKALA',
    flag: 'RUS',
  },
  {
    id: 'rus-malokurilsk',
    name: 'MALOKURILSK',
    flag: 'RUS',
  },
  {
    id: 'rus-moskalvo',
    name: 'MOSKALVO',
    flag: 'RUS',
  },
  {
    id: 'rus-myskamenny',
    name: 'MYS KAMENNY',
    flag: 'RUS',
  },
  {
    id: 'rus-naryanmar',
    name: 'NARYAN MAR',
    flag: 'RUS',
  },
  {
    id: 'rus-nevelsk',
    name: 'NEVELSK',
    flag: 'RUS',
  },
  {
    id: 'rus-nikolayevsknaamur',
    name: 'NIKOLAYEVSK NA AMUR',
    flag: 'RUS',
  },
  {
    id: 'rus-novorossiysk',
    name: 'NOVOROSSIYSK',
    flag: 'RUS',
  },
  {
    id: 'rus-novyiport',
    name: 'NOVYIPORT',
    flag: 'RUS',
  },
  {
    id: 'rus-olga',
    name: 'OLGA',
    flag: 'RUS',
  },
  {
    id: 'rus-olya',
    name: 'OLYA',
    flag: 'RUS',
  },
  {
    id: 'rus-onega',
    name: 'ONEGA',
    flag: 'RUS',
  },
  {
    id: 'rus-ossora',
    name: 'OSSORA',
    flag: 'RUS',
  },
  {
    id: 'rus-otradnoye',
    name: 'OTRADNOYE',
    flag: 'RUS',
  },
  {
    id: 'rus-ozernovskiy',
    name: 'OZERNOVSKIY',
    flag: 'RUS',
  },
  {
    id: 'rus-pevek',
    name: 'PEVEK',
    flag: 'RUS',
  },
  {
    id: 'rus-plastun',
    name: 'PLASTUN',
    flag: 'RUS',
  },
  {
    id: 'rus-podporozhye',
    name: 'PODPOROZHYE',
    flag: 'RUS',
  },
  {
    id: 'rus-podyapolsk',
    name: 'PODYAPOLSK',
    flag: 'RUS',
  },
  {
    id: 'rus-portdikson',
    name: 'PORT DIKSON',
    flag: 'RUS',
  },
  {
    id: 'rus-posyet',
    name: 'POSYET',
    flag: 'RUS',
  },
  {
    id: 'rus-primorsk',
    name: 'PRIMORSK',
    flag: 'RUS',
  },
  {
    id: 'rus-rakushkaanchorage',
    name: 'RAKUSHKA ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'rus-rostovnadon',
    name: 'ROSTOV NA DON',
    flag: 'RUS',
  },
  {
    id: 'rus-rudnayapristan',
    name: 'RUDNAYA PRISTAN',
    flag: 'RUS',
  },
  {
    id: 'rus-sabetta',
    name: 'SABETTA',
    flag: 'RUS',
  },
  {
    id: 'rus-samara',
    name: 'SAMARA',
    flag: 'RUS',
  },
  {
    id: 'rus-semikarakorsk',
    name: 'SEMIKARAKORSK',
    flag: 'RUS',
  },
  {
    id: 'rus-severomorsk',
    name: 'SEVEROMORSK',
    flag: 'RUS',
  },
  {
    id: 'rus-shakhtersk',
    name: 'SHAKHTERSK',
    flag: 'RUS',
  },
  {
    id: 'rus-siziman',
    name: 'SIZIMAN',
    flag: 'RUS',
  },
  {
    id: 'rus-sochi',
    name: 'SOCHI',
    flag: 'RUS',
  },
  {
    id: 'rus-sovgavan',
    name: 'SOVGAVAN',
    flag: 'RUS',
  },
  {
    id: 'rus-svetlaya',
    name: 'SVETLAYA',
    flag: 'RUS',
  },
  {
    id: 'rus-svetly',
    name: 'SVETLY',
    flag: 'RUS',
  },
  {
    id: 'rus-syzran',
    name: 'SYZRAN',
    flag: 'RUS',
  },
  {
    id: 'rus-taganrog',
    name: 'TAGANROG',
    flag: 'RUS',
  },
  {
    id: 'rus-taman',
    name: 'TAMAN',
    flag: 'RUS',
  },
  {
    id: 'rus-temryuk',
    name: 'TEMRYUK',
    flag: 'RUS',
  },
  {
    id: 'rus-temryukanchorage',
    name: 'TEMRYUK ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'rus-tiksi',
    name: 'TIKSI',
    flag: 'RUS',
  },
  {
    id: 'rus-tilichiki',
    name: 'TILICHIKI',
    flag: 'RUS',
  },
  {
    id: 'rus-tuapse',
    name: 'TUAPSE',
    flag: 'RUS',
  },
  {
    id: 'rus-uglegorskanchorage',
    name: 'UGLEGORSK ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'rus-ulyanovsk',
    name: 'ULYANOVSK',
    flag: 'RUS',
  },
  {
    id: 'rus-ustkamchatsk',
    name: 'UST KAMCHATSK',
    flag: 'RUS',
  },
  {
    id: 'rus-ustluga',
    name: 'UST LUGA',
    flag: 'RUS',
  },
  {
    id: 'rus-vanino',
    name: 'VANINO',
    flag: 'RUS',
  },
  {
    id: 'rus-varandey',
    name: 'VARANDEY',
    flag: 'RUS',
  },
  {
    id: 'rus-vistino',
    name: 'VISTINO',
    flag: 'RUS',
  },
  {
    id: 'rus-volgodonsk',
    name: 'VOLGODONSK',
    flag: 'RUS',
  },
  {
    id: 'rus-volgograd',
    name: 'VOLGOGRAD',
    flag: 'RUS',
  },
  {
    id: 'rus-volzhskiy',
    name: 'VOLZHSKIY',
    flag: 'RUS',
  },
  {
    id: 'rus-vyborg',
    name: 'VYBORG',
    flag: 'RUS',
  },
  {
    id: 'rus-vysotsk',
    name: 'VYSOTSK',
    flag: 'RUS',
  },
  {
    id: 'rus-yeysk',
    name: 'YEYSK',
    flag: 'RUS',
  },
  {
    id: 'rus-yuzhno-morskoy',
    name: 'YUZHNO-MORSKOY',
    flag: 'RUS',
  },
  {
    id: 'rus-zarubino',
    name: 'ZARUBINO',
    flag: 'RUS',
  },
  {
    id: 'rus-zolotaya',
    name: 'ZOLOTAYA',
    flag: 'RUS',
  },
  {
    id: 'sau-abualipier',
    name: 'ABU ALI PIER',
    flag: 'SAU',
  },
  {
    id: 'sau-abusafahfield',
    name: 'ABU SAFAH FIELD',
    flag: 'SAU',
  },
  {
    id: 'sau-aljubail',
    name: 'AL JUBAIL',
    flag: 'SAU',
  },
  {
    id: 'sau-arabiyahfield',
    name: 'ARABIYAH FIELD',
    flag: 'SAU',
  },
  {
    id: 'sau-berrifield',
    name: 'BERRI FIELD',
    flag: 'SAU',
  },
  {
    id: 'sau-dammam',
    name: 'DAMMAM',
    flag: 'SAU',
  },
  {
    id: 'sau-duba',
    name: 'DUBA',
    flag: 'SAU',
  },
  {
    id: 'sau-hasbahfield',
    name: 'HASBAH FIELD',
    flag: 'SAU',
  },
  {
    id: 'sau-jazaneconomiccity',
    name: 'JAZAN ECONOMIC CITY',
    flag: 'SAU',
  },
  {
    id: 'sau-jeddah',
    name: 'JEDDAH',
    flag: 'SAU',
  },
  {
    id: 'sau-jizan',
    name: 'JIZAN',
    flag: 'SAU',
  },
  {
    id: 'sau-karanfield',
    name: 'KARAN FIELD',
    flag: 'SAU',
  },
  {
    id: 'sau-khafji',
    name: 'KHAFJI',
    flag: 'SAU',
  },
  {
    id: 'sau-kingabdullah',
    name: 'KING ABDULLAH',
    flag: 'SAU',
  },
  {
    id: 'sau-marjanfield',
    name: 'MARJAN FIELD',
    flag: 'SAU',
  },
  {
    id: 'sau-ngh333',
    name: 'NGH 333',
    flag: 'SAU',
  },
  {
    id: 'sau-rasalkhair',
    name: 'RAS AL KHAIR',
    flag: 'SAU',
  },
  {
    id: 'sau-rasalmishab',
    name: 'RAS AL MISHAB',
    flag: 'SAU',
  },
  {
    id: 'sau-rastanura',
    name: 'RAS TANURA',
    flag: 'SAU',
  },
  {
    id: 'sau-safaniyafield',
    name: 'SAFANIYA FIELD',
    flag: 'SAU',
  },
  {
    id: 'sau-tanajib',
    name: 'TANAJIB',
    flag: 'SAU',
  },
  {
    id: 'sau-taroutbay',
    name: 'TAROUT BAY',
    flag: 'SAU',
  },
  {
    id: 'sau-yanbu',
    name: 'YANBU',
    flag: 'SAU',
  },
  {
    id: 'sau-yanbuindustrial',
    name: 'YANBU INDUSTRIAL',
    flag: 'SAU',
  },
  {
    id: 'sau-zuluffield',
    name: 'ZULUF FIELD',
    flag: 'SAU',
  },
  {
    id: 'sdn-marsabashayer',
    name: 'MARSA BASHAYER',
    flag: 'SDN',
  },
  {
    id: 'sdn-portsudan',
    name: 'PORT SUDAN',
    flag: 'SDN',
  },
  {
    id: 'sdn-sawakin',
    name: 'SAWAKIN',
    flag: 'SDN',
  },
  {
    id: 'sen-kaolack',
    name: 'KAOLACK',
    flag: 'SEN',
  },
  {
    id: 'sen-ziguinchor',
    name: 'ZIGUINCHOR',
    flag: 'SEN',
  },
  {
    id: 'sgp-pulaupunggoltimor',
    name: 'PULAU PUNGGOL TIMOR',
    flag: 'SGP',
  },
  {
    id: 'sgp-sembawang',
    name: 'SEMBAWANG',
    flag: 'SGP',
  },
  {
    id: 'sgp-singaporeanchorage',
    name: 'SINGAPORE ANCHORAGE',
    flag: 'SGP',
  },
  {
    id: 'sgp-tanahmerah',
    name: 'TANAH MERAH',
    flag: 'SGP',
  },
  {
    id: 'sgp-tekong',
    name: 'TEKONG',
    flag: 'SGP',
  },
  {
    id: 'shn-jamestown',
    name: 'JAMESTOWN',
    flag: 'SHN',
  },
  {
    id: 'slb-gizo',
    name: 'GIZO',
    flag: 'SLB',
  },
  {
    id: 'slb-lokiha',
    name: 'LOKIHA',
    flag: 'SLB',
  },
  {
    id: 'slb-maepu',
    name: 'MAEPU',
    flag: 'SLB',
  },
  {
    id: 'slb-putagita',
    name: 'PUTAGITA',
    flag: 'SLB',
  },
  {
    id: 'sle-pepel',
    name: 'PEPEL',
    flag: 'SLE',
  },
  {
    id: 'slv-acajutla',
    name: 'ACAJUTLA',
    flag: 'SLV',
  },
  {
    id: 'som-berbera',
    name: 'BERBERA',
    flag: 'SOM',
  },
  {
    id: 'som-boosaaso',
    name: 'BOOSAASO',
    flag: 'SOM',
  },
  {
    id: 'som-kismaayo',
    name: 'KISMAAYO',
    flag: 'SOM',
  },
  {
    id: 'som-mogadishu',
    name: 'MOGADISHU',
    flag: 'SOM',
  },
  {
    id: 'spm-miquelon',
    name: 'MIQUELON',
    flag: 'SPM',
  },
  {
    id: 'srb-belgrade',
    name: 'BELGRADE',
    flag: 'SRB',
  },
  {
    id: 'sur-moengo',
    name: 'MOENGO',
    flag: 'SUR',
  },
  {
    id: 'sur-paranam',
    name: 'PARANAM',
    flag: 'SUR',
  },
  {
    id: 'svn-izola',
    name: 'IZOLA',
    flag: 'SVN',
  },
  {
    id: 'svn-koper',
    name: 'KOPER',
    flag: 'SVN',
  },
  {
    id: 'svn-piran',
    name: 'PIRAN',
    flag: 'SVN',
  },
  {
    id: 'swe-aarstahavsbad',
    name: 'AARSTA HAVSBAD',
    flag: 'SWE',
  },
  {
    id: 'swe-ahus',
    name: 'AHUS',
    flag: 'SWE',
  },
  {
    id: 'swe-arkosund',
    name: 'ARKOSUND',
    flag: 'SWE',
  },
  {
    id: 'swe-backviken',
    name: 'BACKVIKEN',
    flag: 'SWE',
  },
  {
    id: 'swe-ballstaviken',
    name: 'BALLSTAVIKEN',
    flag: 'SWE',
  },
  {
    id: 'swe-bergkvara',
    name: 'BERGKVARA',
    flag: 'SWE',
  },
  {
    id: 'swe-borgholm',
    name: 'BORGHOLM',
    flag: 'SWE',
  },
  {
    id: 'swe-borstahusen',
    name: 'BORSTAHUSEN',
    flag: 'SWE',
  },
  {
    id: 'swe-brofjorden',
    name: 'BROFJORDEN',
    flag: 'SWE',
  },
  {
    id: 'swe-bua',
    name: 'BUA',
    flag: 'SWE',
  },
  {
    id: 'swe-bullandoe',
    name: 'BULLANDOE',
    flag: 'SWE',
  },
  {
    id: 'swe-degerhamn',
    name: 'DEGERHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-donso',
    name: 'DONSO',
    flag: 'SWE',
  },
  {
    id: 'swe-evlingesmaabaatsham',
    name: 'EVLINGE SMAABAATSHAM',
    flag: 'SWE',
  },
  {
    id: 'swe-falkenberg',
    name: 'FALKENBERG',
    flag: 'SWE',
  },
  {
    id: 'swe-farosund',
    name: 'FAROSUND',
    flag: 'SWE',
  },
  {
    id: 'swe-fiskeback',
    name: 'FISKEBACK',
    flag: 'SWE',
  },
  {
    id: 'swe-furusund',
    name: 'FURUSUND',
    flag: 'SWE',
  },
  {
    id: 'swe-gavle',
    name: 'GAVLE',
    flag: 'SWE',
  },
  {
    id: 'swe-gotaalvtrollhatten',
    name: 'GOTA ALV TROLLHATTEN',
    flag: 'SWE',
  },
  {
    id: 'swe-grebbestad',
    name: 'GREBBESTAD',
    flag: 'SWE',
  },
  {
    id: 'swe-grisslehamn',
    name: 'GRISSLEHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-gronemads',
    name: 'GRONEMADS',
    flag: 'SWE',
  },
  {
    id: 'swe-gronhogen',
    name: 'GRONHOGEN',
    flag: 'SWE',
  },
  {
    id: 'swe-gullholmen',
    name: 'GULLHOLMEN',
    flag: 'SWE',
  },
  {
    id: 'swe-halmstad',
    name: 'HALMSTAD',
    flag: 'SWE',
  },
  {
    id: 'swe-haraholmen',
    name: 'HARAHOLMEN',
    flag: 'SWE',
  },
  {
    id: 'swe-hargshamn',
    name: 'HARGSHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-harnosand',
    name: 'HARNOSAND',
    flag: 'SWE',
  },
  {
    id: 'swe-hasslo',
    name: 'HASSLO',
    flag: 'SWE',
  },
  {
    id: 'swe-havstenssund',
    name: 'HAVSTENSSUND',
    flag: 'SWE',
  },
  {
    id: 'swe-hoganas',
    name: 'HOGANAS',
    flag: 'SWE',
  },
  {
    id: 'swe-hollviksnas',
    name: 'HOLLVIKSNAS',
    flag: 'SWE',
  },
  {
    id: 'swe-holmsund',
    name: 'HOLMSUND',
    flag: 'SWE',
  },
  {
    id: 'swe-hudiksvall',
    name: 'HUDIKSVALL',
    flag: 'SWE',
  },
  {
    id: 'swe-husum',
    name: 'HUSUM',
    flag: 'SWE',
  },
  {
    id: 'swe-hyppeln',
    name: 'HYPPELN',
    flag: 'SWE',
  },
  {
    id: 'swe-iggesund',
    name: 'IGGESUND',
    flag: 'SWE',
  },
  {
    id: 'swe-kaerrdal',
    name: 'KAERRDAL',
    flag: 'SWE',
  },
  {
    id: 'swe-kallviken',
    name: 'KALLVIKEN',
    flag: 'SWE',
  },
  {
    id: 'swe-kalmar',
    name: 'KALMAR',
    flag: 'SWE',
  },
  {
    id: 'swe-kalvo',
    name: 'KALVO',
    flag: 'SWE',
  },
  {
    id: 'swe-kapellskar',
    name: 'KAPELLSKAR',
    flag: 'SWE',
  },
  {
    id: 'swe-karington',
    name: 'KARINGTON',
    flag: 'SWE',
  },
  {
    id: 'swe-karlsborg',
    name: 'KARLSBORG',
    flag: 'SWE',
  },
  {
    id: 'swe-karlshamn',
    name: 'KARLSHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-karlskrona',
    name: 'KARLSKRONA',
    flag: 'SWE',
  },
  {
    id: 'swe-kivik',
    name: 'KIVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-klintehamn',
    name: 'KLINTEHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-kristianopel',
    name: 'KRISTIANOPEL',
    flag: 'SWE',
  },
  {
    id: 'swe-kristinehamn',
    name: 'KRISTINEHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-landskrona',
    name: 'LANDSKRONA',
    flag: 'SWE',
  },
  {
    id: 'swe-langedrag',
    name: 'LANGEDRAG',
    flag: 'SWE',
  },
  {
    id: 'swe-lidkoping',
    name: 'LIDKOPING',
    flag: 'SWE',
  },
  {
    id: 'swe-lillaedet',
    name: 'LILLA EDET',
    flag: 'SWE',
  },
  {
    id: 'swe-limhamn',
    name: 'LIMHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-ljusne',
    name: 'LJUSNE',
    flag: 'SWE',
  },
  {
    id: 'swe-lysekil',
    name: 'LYSEKIL',
    flag: 'SWE',
  },
  {
    id: 'swe-malmo',
    name: 'MALMO',
    flag: 'SWE',
  },
  {
    id: 'swe-marstrand',
    name: 'MARSTRAND',
    flag: 'SWE',
  },
  {
    id: 'swe-monsterasanchorage',
    name: 'MONSTERAS ANCHORAGE',
    flag: 'SWE',
  },
  {
    id: 'swe-nogersund',
    name: 'NOGERSUND',
    flag: 'SWE',
  },
  {
    id: 'swe-nordon',
    name: 'NORDON',
    flag: 'SWE',
  },
  {
    id: 'swe-norrkoping',
    name: 'NORRKOPING',
    flag: 'SWE',
  },
  {
    id: 'swe-norrkopinganchorage',
    name: 'NORRKOPING ANCHORAGE',
    flag: 'SWE',
  },
  {
    id: 'swe-norvik',
    name: 'NORVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-nykoping',
    name: 'NYKOPING',
    flag: 'SWE',
  },
  {
    id: 'swe-nynashamn',
    name: 'NYNASHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-ockero',
    name: 'OCKERO',
    flag: 'SWE',
  },
  {
    id: 'swe-oesteraaker',
    name: 'OESTERAAKER',
    flag: 'SWE',
  },
  {
    id: 'swe-ornskoldsvik',
    name: 'ORNSKOLDSVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-oskarshamn',
    name: 'OSKARSHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-paaskallavik',
    name: 'PAASKALLAVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-rivo',
    name: 'RIVO',
    flag: 'SWE',
  },
  {
    id: 'swe-ronnang',
    name: 'RONNANG',
    flag: 'SWE',
  },
  {
    id: 'swe-ronneby',
    name: 'RONNEBY',
    flag: 'SWE',
  },
  {
    id: 'swe-ronnskar',
    name: 'RONNSKAR',
    flag: 'SWE',
  },
  {
    id: 'swe-sandarne',
    name: 'SANDARNE',
    flag: 'SWE',
  },
  {
    id: 'swe-sandhamn',
    name: 'SANDHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-simrishamn',
    name: 'SIMRISHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-skalderviken',
    name: 'SKALDERVIKEN',
    flag: 'SWE',
  },
  {
    id: 'swe-skarhamn',
    name: 'SKARHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-skillinge',
    name: 'SKILLINGE',
    flag: 'SWE',
  },
  {
    id: 'swe-skutskar',
    name: 'SKUTSKAR',
    flag: 'SWE',
  },
  {
    id: 'swe-slite',
    name: 'SLITE',
    flag: 'SWE',
  },
  {
    id: 'swe-smygehamn',
    name: 'SMYGEHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-sodertalje',
    name: 'SODERTALJE',
    flag: 'SWE',
  },
  {
    id: 'swe-soedra',
    name: 'SOEDRA',
    flag: 'SWE',
  },
  {
    id: 'swe-solvesborg',
    name: 'SOLVESBORG',
    flag: 'SWE',
  },
  {
    id: 'swe-stavsnas',
    name: 'STAVSNAS',
    flag: 'SWE',
  },
  {
    id: 'swe-stenungsundanchorage',
    name: 'STENUNGSUND ANCHORAGE',
    flag: 'SWE',
  },
  {
    id: 'swe-stockholm',
    name: 'STOCKHOLM',
    flag: 'SWE',
  },
  {
    id: 'swe-stockholmanchorage',
    name: 'STOCKHOLM ANCHORAGE',
    flag: 'SWE',
  },
  {
    id: 'swe-storavika',
    name: 'STORA VIKA',
    flag: 'SWE',
  },
  {
    id: 'swe-storugns',
    name: 'STORUGNS',
    flag: 'SWE',
  },
  {
    id: 'swe-stromstad',
    name: 'STROMSTAD',
    flag: 'SWE',
  },
  {
    id: 'swe-sundsvall',
    name: 'SUNDSVALL',
    flag: 'SWE',
  },
  {
    id: 'swe-taernoelaxboden',
    name: 'TAERNOE LAXBODEN',
    flag: 'SWE',
  },
  {
    id: 'swe-trelleborg',
    name: 'TRELLEBORG',
    flag: 'SWE',
  },
  {
    id: 'swe-ulvoehamncommunity',
    name: 'ULVOEHAMN COMMUNITY',
    flag: 'SWE',
  },
  {
    id: 'swe-vanersborg',
    name: 'VANERSBORG',
    flag: 'SWE',
  },
  {
    id: 'swe-varberg',
    name: 'VARBERG',
    flag: 'SWE',
  },
  {
    id: 'swe-vasteras',
    name: 'VASTERAS',
    flag: 'SWE',
  },
  {
    id: 'swe-vastervik',
    name: 'VASTERVIK',
    flag: 'SWE',
  },
  {
    id: 'swe-vaxholm',
    name: 'VAXHOLM',
    flag: 'SWE',
  },
  {
    id: 'swe-viggbuholm',
    name: 'VIGGBUHOLM',
    flag: 'SWE',
  },
  {
    id: 'swe-visby',
    name: 'VISBY',
    flag: 'SWE',
  },
  {
    id: 'swe-vrango',
    name: 'VRANGO',
    flag: 'SWE',
  },
  {
    id: 'swe-wallhamn',
    name: 'WALLHAMN',
    flag: 'SWE',
  },
  {
    id: 'swe-ystad',
    name: 'YSTAD',
    flag: 'SWE',
  },
  {
    id: 'sxm-philipsburg',
    name: 'PHILIPSBURG',
    flag: 'SXM',
  },
  {
    id: 'sxm-stmaarten',
    name: 'ST MAARTEN',
    flag: 'SXM',
  },
  {
    id: 'syr-latakia',
    name: 'LATAKIA',
    flag: 'SYR',
  },
  {
    id: 'syr-tartus',
    name: 'TARTUS',
    flag: 'SYR',
  },
  {
    id: 'tca-cockburnharbor',
    name: 'COCKBURN HARBOR',
    flag: 'TCA',
  },
  {
    id: 'tca-grandturk',
    name: 'GRAND TURK',
    flag: 'TCA',
  },
  {
    id: 'tca-providencialesanchorage',
    name: 'PROVIDENCIALES ANCHORAGE',
    flag: 'TCA',
  },
  {
    id: 'tgo-kpeme',
    name: 'KPEME',
    flag: 'TGO',
  },
  {
    id: 'tha-bangpakong',
    name: 'BANGPAKONG',
    flag: 'THA',
  },
  {
    id: 'tha-bangsaphan',
    name: 'BANG SAPHAN',
    flag: 'THA',
  },
  {
    id: 'tha-kosichang',
    name: 'KO SICHANG',
    flag: 'THA',
  },
  {
    id: 'tha-krabi',
    name: 'KRABI',
    flag: 'THA',
  },
  {
    id: 'tha-laemchabang',
    name: 'LAEM CHABANG',
    flag: 'THA',
  },
  {
    id: 'tha-maptaphut',
    name: 'MAPTAPHUT',
    flag: 'THA',
  },
  {
    id: 'tha-naiharn',
    name: 'NAI HARN',
    flag: 'THA',
  },
  {
    id: 'tha-phatthaya',
    name: 'PHATTHAYA',
    flag: 'THA',
  },
  {
    id: 'tha-phiphiisland',
    name: 'PHI PHI ISLAND',
    flag: 'THA',
  },
  {
    id: 'tha-phuketanchorage',
    name: 'PHUKET ANCHORAGE',
    flag: 'THA',
  },
  {
    id: 'tha-rayong',
    name: 'RAYONG',
    flag: 'THA',
  },
  {
    id: 'tha-sattahip',
    name: 'SATTAHIP',
    flag: 'THA',
  },
  {
    id: 'tkm-bekdash',
    name: 'BEKDASH',
    flag: 'TKM',
  },
  {
    id: 'tkm-turkmenbashi',
    name: 'TURKMENBASHI',
    flag: 'TKM',
  },
  {
    id: 'ton-neiafu',
    name: 'NEIAFU',
    flag: 'TON',
  },
  {
    id: 'ton-nukualofa',
    name: 'NUKU ALOFA',
    flag: 'TON',
  },
  {
    id: 'ton-pangai',
    name: 'PANGAI',
    flag: 'TON',
  },
  {
    id: 'tto-labrea',
    name: 'LA BREA',
    flag: 'TTO',
  },
  {
    id: 'tto-pointeapierre',
    name: 'POINTE A PIERRE',
    flag: 'TTO',
  },
  {
    id: 'tto-pointfortin',
    name: 'POINT FORTIN',
    flag: 'TTO',
  },
  {
    id: 'tto-pointlisas',
    name: 'POINT LISAS',
    flag: 'TTO',
  },
  {
    id: 'tto-portofspain',
    name: 'PORT OF SPAIN',
    flag: 'TTO',
  },
  {
    id: 'tto-scarborough',
    name: 'SCARBOROUGH',
    flag: 'TTO',
  },
  {
    id: 'tun-bizerte',
    name: 'BIZERTE',
    flag: 'TUN',
  },
  {
    id: 'tun-gabes',
    name: 'GABES',
    flag: 'TUN',
  },
  {
    id: 'tun-kelibia',
    name: 'KELIBIA',
    flag: 'TUN',
  },
  {
    id: 'tun-menzelbourguiba',
    name: 'MENZEL BOURGUIBA',
    flag: 'TUN',
  },
  {
    id: 'tun-monastir',
    name: 'MONASTIR',
    flag: 'TUN',
  },
  {
    id: 'tun-rades',
    name: 'RADES',
    flag: 'TUN',
  },
  {
    id: 'tun-skhirra',
    name: 'SKHIRRA',
    flag: 'TUN',
  },
  {
    id: 'tun-sousse',
    name: 'SOUSSE',
    flag: 'TUN',
  },
  {
    id: 'tun-zarzis',
    name: 'ZARZIS',
    flag: 'TUN',
  },
  {
    id: 'tur-akcansa',
    name: 'AKCANSA',
    flag: 'TUR',
  },
  {
    id: 'tur-akyarlar',
    name: 'AKYARLAR',
    flag: 'TUR',
  },
  {
    id: 'tur-alanya',
    name: 'ALANYA',
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
    id: 'tur-antalya',
    name: 'ANTALYA',
    flag: 'TUR',
  },
  {
    id: 'tur-asyaport',
    name: 'ASYAPORT',
    flag: 'TUR',
  },
  {
    id: 'tur-babakale',
    name: 'BABAKALE',
    flag: 'TUR',
  },
  {
    id: 'tur-bandirma',
    name: 'BANDIRMA',
    flag: 'TUR',
  },
  {
    id: 'tur-bartin',
    name: 'BARTIN',
    flag: 'TUR',
  },
  {
    id: 'tur-bodrum',
    name: 'BODRUM',
    flag: 'TUR',
  },
  {
    id: 'tur-bozyazi',
    name: 'BOZYAZI',
    flag: 'TUR',
  },
  {
    id: 'tur-camburnu',
    name: 'CAMBURNU',
    flag: 'TUR',
  },
  {
    id: 'tur-ceyhan',
    name: 'CEYHAN',
    flag: 'TUR',
  },
  {
    id: 'tur-dardanelles',
    name: 'DARDANELLES',
    flag: 'TUR',
  },
  {
    id: 'tur-dardanellesanchorage',
    name: 'DARDANELLES ANCHORAGE',
    flag: 'TUR',
  },
  {
    id: 'tur-darica',
    name: 'DARICA',
    flag: 'TUR',
  },
  {
    id: 'tur-datca',
    name: 'DATCA',
    flag: 'TUR',
  },
  {
    id: 'tur-demircikoy',
    name: 'DEMIRCIKOY',
    flag: 'TUR',
  },
  {
    id: 'tur-derince',
    name: 'DERINCE',
    flag: 'TUR',
  },
  {
    id: 'tur-didim',
    name: 'DIDIM',
    flag: 'TUR',
  },
  {
    id: 'tur-dikili',
    name: 'DIKILI',
    flag: 'TUR',
  },
  {
    id: 'tur-diliskelesi',
    name: 'DILISKELESI',
    flag: 'TUR',
  },
  {
    id: 'tur-dortyol',
    name: 'DORTYOL',
    flag: 'TUR',
  },
  {
    id: 'tur-enez',
    name: 'ENEZ',
    flag: 'TUR',
  },
  {
    id: 'tur-erdek',
    name: 'ERDEK',
    flag: 'TUR',
  },
  {
    id: 'tur-eregli',
    name: 'EREGLI',
    flag: 'TUR',
  },
  {
    id: 'tur-eren',
    name: 'EREN',
    flag: 'TUR',
  },
  {
    id: 'tur-esenkoy',
    name: 'ESENKOY',
    flag: 'TUR',
  },
  {
    id: 'tur-eskihisar',
    name: 'ESKIHISAR',
    flag: 'TUR',
  },
  {
    id: 'tur-fatsa',
    name: 'FATSA',
    flag: 'TUR',
  },
  {
    id: 'tur-fenerbahce',
    name: 'FENERBAHCE',
    flag: 'TUR',
  },
  {
    id: 'tur-fethiye',
    name: 'FETHIYE',
    flag: 'TUR',
  },
  {
    id: 'tur-gemlik',
    name: 'GEMLIK',
    flag: 'TUR',
  },
  {
    id: 'tur-gerze',
    name: 'GERZE',
    flag: 'TUR',
  },
  {
    id: 'tur-giresun',
    name: 'GIRESUN',
    flag: 'TUR',
  },
  {
    id: 'tur-gocek',
    name: 'GOCEK',
    flag: 'TUR',
  },
  {
    id: 'tur-gulluk',
    name: 'GULLUK',
    flag: 'TUR',
  },
  {
    id: 'tur-gumusluk',
    name: 'GUMUSLUK',
    flag: 'TUR',
  },
  {
    id: 'tur-haydarpasa',
    name: 'HAYDARPASA',
    flag: 'TUR',
  },
  {
    id: 'tur-hereke',
    name: 'HEREKE',
    flag: 'TUR',
  },
  {
    id: 'tur-hopa',
    name: 'HOPA',
    flag: 'TUR',
  },
  {
    id: 'tur-icdas',
    name: 'ICDAS',
    flag: 'TUR',
  },
  {
    id: 'tur-igneada',
    name: 'IGNEADA',
    flag: 'TUR',
  },
  {
    id: 'tur-inebolu',
    name: 'INEBOLU',
    flag: 'TUR',
  },
  {
    id: 'tur-iskenderun',
    name: 'ISKENDERUN',
    flag: 'TUR',
  },
  {
    id: 'tur-iskentermik',
    name: 'ISKENTERMIK',
    flag: 'TUR',
  },
  {
    id: 'tur-istanbul',
    name: 'ISTANBUL',
    flag: 'TUR',
  },
  {
    id: 'tur-izmir',
    name: 'IZMIR',
    flag: 'TUR',
  },
  {
    id: 'tur-kapakli',
    name: 'KAPAKLI',
    flag: 'TUR',
  },
  {
    id: 'tur-karasu',
    name: 'KARASU',
    flag: 'TUR',
  },
  {
    id: 'tur-kartal',
    name: 'KARTAL',
    flag: 'TUR',
  },
  {
    id: 'tur-kas',
    name: 'KAS',
    flag: 'TUR',
  },
  {
    id: 'tur-kemer',
    name: 'KEMER',
    flag: 'TUR',
  },
  {
    id: 'tur-kucukyali',
    name: 'KUCUKYALI',
    flag: 'TUR',
  },
  {
    id: 'tur-kumbag',
    name: 'KUMBAG',
    flag: 'TUR',
  },
  {
    id: 'tur-kupluagzi',
    name: 'KUPLUAGZI',
    flag: 'TUR',
  },
  {
    id: 'tur-kusadasi',
    name: 'KUSADASI',
    flag: 'TUR',
  },
  {
    id: 'tur-marmaraereglisi',
    name: 'MARMARA EREGLISI',
    flag: 'TUR',
  },
  {
    id: 'tur-marmaris',
    name: 'MARMARIS',
    flag: 'TUR',
  },
  {
    id: 'tur-martas',
    name: 'MARTAS',
    flag: 'TUR',
  },
  {
    id: 'tur-narli',
    name: 'NARLI',
    flag: 'TUR',
  },
  {
    id: 'tur-nemrut',
    name: 'NEMRUT',
    flag: 'TUR',
  },
  {
    id: 'tur-poyraz',
    name: 'POYRAZ',
    flag: 'TUR',
  },
  {
    id: 'tur-rize',
    name: 'RIZE',
    flag: 'TUR',
  },
  {
    id: 'tur-rumelifeneri',
    name: 'RUMELIFENERI',
    flag: 'TUR',
  },
  {
    id: 'tur-samsun',
    name: 'SAMSUN',
    flag: 'TUR',
  },
  {
    id: 'tur-saraylar',
    name: 'SARAYLAR',
    flag: 'TUR',
  },
  {
    id: 'tur-sigacik',
    name: 'SIGACIK',
    flag: 'TUR',
  },
  {
    id: 'tur-sile',
    name: 'SILE',
    flag: 'TUR',
  },
  {
    id: 'tur-silivri',
    name: 'SILIVRI',
    flag: 'TUR',
  },
  {
    id: 'tur-sinop',
    name: 'SINOP',
    flag: 'TUR',
  },
  {
    id: 'tur-tasucu',
    name: 'TASUCU',
    flag: 'TUR',
  },
  {
    id: 'tur-tekirdag',
    name: 'TEKIRDAG',
    flag: 'TUR',
  },
  {
    id: 'tur-toros',
    name: 'TOROS',
    flag: 'TUR',
  },
  {
    id: 'tur-trabzon',
    name: 'TRABZON',
    flag: 'TUR',
  },
  {
    id: 'tur-tuzla',
    name: 'TUZLA',
    flag: 'TUR',
  },
  {
    id: 'tur-unye',
    name: 'UNYE',
    flag: 'TUR',
  },
  {
    id: 'tur-yakakoy',
    name: 'YAKAKOY',
    flag: 'TUR',
  },
  {
    id: 'tur-yalikavak',
    name: 'YALIKAVAK',
    flag: 'TUR',
  },
  {
    id: 'tur-yalovatown',
    name: 'YALOVA TOWN',
    flag: 'TUR',
  },
  {
    id: 'tur-yarimca',
    name: 'YARIMCA',
    flag: 'TUR',
  },
  {
    id: 'tur-yesilovacik',
    name: 'YESILOVACIK',
    flag: 'TUR',
  },
  {
    id: 'tur-yomra',
    name: 'YOMRA',
    flag: 'TUR',
  },
  {
    id: 'tur-yorukler',
    name: 'YORUKLER',
    flag: 'TUR',
  },
  {
    id: 'tur-zonguldak',
    name: 'ZONGULDAK',
    flag: 'TUR',
  },
  {
    id: 'twn-anping',
    name: 'ANPING',
    flag: 'TWN',
  },
  {
    id: 'twn-bdeep461',
    name: 'B DEEP 461',
    flag: 'TWN',
  },
  {
    id: 'twn-donggang',
    name: 'DONGGANG',
    flag: 'TWN',
  },
  {
    id: 'twn-gengfang',
    name: 'GENGFANG',
    flag: 'TWN',
  },
  {
    id: 'twn-hoping',
    name: 'HOPING',
    flag: 'TWN',
  },
  {
    id: 'twn-houwu',
    name: 'HOUWU',
    flag: 'TWN',
  },
  {
    id: 'twn-hsinta',
    name: 'HSINTA',
    flag: 'TWN',
  },
  {
    id: 'twn-hualien',
    name: 'HUALIEN',
    flag: 'TWN',
  },
  {
    id: 'twn-jinning',
    name: 'JINNING',
    flag: 'TWN',
  },
  {
    id: 'twn-liuqiu',
    name: 'LIUQIU',
    flag: 'TWN',
  },
  {
    id: 'twn-longmen',
    name: 'LONG MEN',
    flag: 'TWN',
  },
  {
    id: 'twn-magong',
    name: 'MAGONG',
    flag: 'TWN',
  },
  {
    id: 'twn-niaoyu',
    name: 'NIAOYU',
    flag: 'TWN',
  },
  {
    id: 'twn-shenao',
    name: 'SHEN AO',
    flag: 'TWN',
  },
  {
    id: 'twn-tamsuifishwharf',
    name: 'TAMSUI FISH WHARF',
    flag: 'TWN',
  },
  {
    id: 'twn-toucheng',
    name: 'TOUCHENG',
    flag: 'TWN',
  },
  {
    id: 'twn-yeliu',
    name: 'YELIU',
    flag: 'TWN',
  },
  {
    id: 'twn-zhongyun',
    name: 'ZHONGYUN',
    flag: 'TWN',
  },
  {
    id: 'tza-mjimwematerminal',
    name: 'MJIMWEMA TERMINAL',
    flag: 'TZA',
  },
  {
    id: 'tza-mtwara',
    name: 'MTWARA',
    flag: 'TZA',
  },
  {
    id: 'tza-tanga',
    name: 'TANGA',
    flag: 'TZA',
  },
  {
    id: 'tza-zanzibar',
    name: 'ZANZIBAR',
    flag: 'TZA',
  },
  {
    id: 'ukr-balaklavskyi',
    name: 'BALAKLAVSKYI',
    flag: 'UKR',
  },
  {
    id: 'ukr-belgoroddnestrovsky',
    name: 'BELGOROD DNESTROVSKY',
    flag: 'UKR',
  },
  {
    id: 'ukr-berdyansk',
    name: 'BERDYANSK',
    flag: 'UKR',
  },
  {
    id: 'ukr-berdyanskanchorage',
    name: 'BERDYANSK ANCHORAGE',
    flag: 'UKR',
  },
  {
    id: 'ukr-chornomorsk',
    name: 'CHORNOMORSK',
    flag: 'UKR',
  },
  {
    id: 'ukr-dneprobugskiy',
    name: 'DNEPROBUGSKIY',
    flag: 'UKR',
  },
  {
    id: 'ukr-feodosiya',
    name: 'FEODOSIYA',
    flag: 'UKR',
  },
  {
    id: 'ukr-izmail',
    name: 'IZMAIL',
    flag: 'UKR',
  },
  {
    id: 'ukr-kerch',
    name: 'KERCH',
    flag: 'UKR',
  },
  {
    id: 'ukr-kherson',
    name: 'KHERSON',
    flag: 'UKR',
  },
  {
    id: 'ukr-komyshburunska',
    name: 'KOMYSH BURUNSKA',
    flag: 'UKR',
  },
  {
    id: 'ukr-mariupol',
    name: 'MARIUPOL',
    flag: 'UKR',
  },
  {
    id: 'ukr-mariupolanchorage',
    name: 'MARIUPOL ANCHORAGE',
    flag: 'UKR',
  },
  {
    id: 'ukr-mykolayiv',
    name: 'MYKOLAYIV',
    flag: 'UKR',
  },
  {
    id: 'ukr-nikotera',
    name: 'NIKO TERA',
    flag: 'UKR',
  },
  {
    id: 'ukr-ochakiv',
    name: 'OCHAKIV',
    flag: 'UKR',
  },
  {
    id: 'ukr-odessa',
    name: 'ODESSA',
    flag: 'UKR',
  },
  {
    id: 'ukr-olvia',
    name: 'OLVIA',
    flag: 'UKR',
  },
  {
    id: 'ukr-pansk',
    name: 'PANSK',
    flag: 'UKR',
  },
  {
    id: 'ukr-reni',
    name: 'RENI',
    flag: 'UKR',
  },
  {
    id: 'ukr-sevastopol',
    name: 'SEVASTOPOL',
    flag: 'UKR',
  },
  {
    id: "ukr-skadovs'k",
    name: "SKADOVS'K",
    flag: 'UKR',
  },
  {
    id: 'ukr-vylkove',
    name: 'VYLKOVE',
    flag: 'UKR',
  },
  {
    id: 'ukr-yalta',
    name: 'YALTA',
    flag: 'UKR',
  },
  {
    id: 'ukr-yevpatoriya',
    name: 'YEVPATORIYA',
    flag: 'UKR',
  },
  {
    id: 'ukr-yuzhny',
    name: 'YUZHNY',
    flag: 'UKR',
  },
  {
    id: 'ury-carmelo',
    name: 'CARMELO',
    flag: 'URY',
  },
  {
    id: 'ury-colonia',
    name: 'COLONIA',
    flag: 'URY',
  },
  {
    id: 'ury-fraybentos',
    name: 'FRAY BENTOS',
    flag: 'URY',
  },
  {
    id: 'ury-joseignacioterminal',
    name: 'JOSE IGNACIO TERMINAL',
    flag: 'URY',
  },
  {
    id: 'ury-juanlacaze',
    name: 'JUAN LACAZE',
    flag: 'URY',
  },
  {
    id: 'ury-nuevapalmira',
    name: 'NUEVA PALMIRA',
    flag: 'URY',
  },
  {
    id: 'ury-paysandu',
    name: 'PAYSANDU',
    flag: 'URY',
  },
  {
    id: 'ury-piriapolis',
    name: 'PIRIAPOLIS',
    flag: 'URY',
  },
  {
    id: 'ury-puntadeleste',
    name: 'PUNTA DEL ESTE',
    flag: 'URY',
  },
  {
    id: 'ury-puntapereira',
    name: 'PUNTA PEREIRA',
    flag: 'URY',
  },
  {
    id: 'usa-ac857platform',
    name: 'AC 857 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-adamsville',
    name: 'ADAMSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-alameda',
    name: 'ALAMEDA',
    flag: 'USA',
  },
  {
    id: 'usa-albany',
    name: 'ALBANY',
    flag: 'USA',
  },
  {
    id: 'usa-alitak',
    name: 'ALITAK',
    flag: 'USA',
  },
  {
    id: 'usa-alliance',
    name: 'ALLIANCE',
    flag: 'USA',
  },
  {
    id: 'usa-anacortes',
    name: 'ANACORTES',
    flag: 'USA',
  },
  {
    id: 'usa-anchorage',
    name: 'ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-andersonbay',
    name: 'ANDERSON BAY',
    flag: 'USA',
  },
  {
    id: 'usa-angelisland',
    name: 'ANGEL ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-annapolis',
    name: 'ANNAPOLIS',
    flag: 'USA',
  },
  {
    id: 'usa-annisquam',
    name: 'ANNISQUAM',
    flag: 'USA',
  },
  {
    id: 'usa-aransaspass',
    name: 'ARANSAS PASS',
    flag: 'USA',
  },
  {
    id: 'usa-astoria',
    name: 'ASTORIA',
    flag: 'USA',
  },
  {
    id: 'usa-atlanticcity',
    name: 'ATLANTIC CITY',
    flag: 'USA',
  },
  {
    id: 'usa-atlantichighlands',
    name: 'ATLANTIC HIGHLANDS',
    flag: 'USA',
  },
  {
    id: 'usa-atreco',
    name: 'ATRECO',
    flag: 'USA',
  },
  {
    id: 'usa-aukebay',
    name: 'AUKE BAY',
    flag: 'USA',
  },
  {
    id: 'usa-avalon',
    name: 'AVALON',
    flag: 'USA',
  },
  {
    id: 'usa-avila',
    name: 'AVILA',
    flag: 'USA',
  },
  {
    id: 'usa-bainbridgeisland',
    name: 'BAINBRIDGE ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-ballenaisle',
    name: 'BALLENA ISLE',
    flag: 'USA',
  },
  {
    id: 'usa-baltimore',
    name: 'BALTIMORE',
    flag: 'USA',
  },
  {
    id: 'usa-bangorwa',
    name: 'BANGOR WA',
    flag: 'USA',
  },
  {
    id: 'usa-baranof',
    name: 'BARANOF',
    flag: 'USA',
  },
  {
    id: 'usa-barataria',
    name: 'BARATARIA',
    flag: 'USA',
  },
  {
    id: 'usa-barharbor',
    name: 'BAR HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-barnegatlighthouse',
    name: 'BARNEGAT LIGHTHOUSE',
    flag: 'USA',
  },
  {
    id: 'usa-bath',
    name: 'BATH',
    flag: 'USA',
  },
  {
    id: 'usa-batonrouge',
    name: 'BATON ROUGE',
    flag: 'USA',
  },
  {
    id: 'usa-bayoulabatre',
    name: 'BAYOU LA BATRE',
    flag: 'USA',
  },
  {
    id: 'usa-beaufort',
    name: 'BEAUFORT',
    flag: 'USA',
  },
  {
    id: 'usa-beaumont',
    name: 'BEAUMONT',
    flag: 'USA',
  },
  {
    id: 'usa-belfastcity',
    name: 'BELFAST CITY',
    flag: 'USA',
  },
  {
    id: 'usa-benecia',
    name: 'BENECIA',
    flag: 'USA',
  },
  {
    id: 'usa-berkeley',
    name: 'BERKELEY',
    flag: 'USA',
  },
  {
    id: 'usa-bethel',
    name: 'BETHEL',
    flag: 'USA',
  },
  {
    id: 'usa-biloxi',
    name: 'BILOXI',
    flag: 'USA',
  },
  {
    id: 'usa-blaine',
    name: 'BLAINE',
    flag: 'USA',
  },
  {
    id: 'usa-blakeisland',
    name: 'BLAKE ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-blockisland',
    name: 'BLOCK ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-bocaraton',
    name: 'BOCA RATON',
    flag: 'USA',
  },
  {
    id: 'usa-bohicket',
    name: 'BOHICKET',
    flag: 'USA',
  },
  {
    id: 'usa-bolivar',
    name: 'BOLIVAR',
    flag: 'USA',
  },
  {
    id: 'usa-bolonisland',
    name: 'BOLON ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-boothbayharbor',
    name: 'BOOTHBAY HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-boothbayregionboat',
    name: 'BOOTHBAY REGION BOAT',
    flag: 'USA',
  },
  {
    id: 'usa-boston',
    name: 'BOSTON',
    flag: 'USA',
  },
  {
    id: 'usa-bourg',
    name: 'BOURG',
    flag: 'USA',
  },
  {
    id: 'usa-brewercovehaven',
    name: 'BREWER COVE HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-brewerhawthorne',
    name: 'BREWER HAWTHORNE',
    flag: 'USA',
  },
  {
    id: 'usa-bridgeport',
    name: 'BRIDGEPORT',
    flag: 'USA',
  },
  {
    id: 'usa-brielle',
    name: 'BRIELLE',
    flag: 'USA',
  },
  {
    id: 'usa-bristol',
    name: 'BRISTOL',
    flag: 'USA',
  },
  {
    id: 'usa-brownsville',
    name: 'BROWNSVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-brunswick',
    name: 'BRUNSWICK',
    flag: 'USA',
  },
  {
    id: 'usa-bucksport',
    name: 'BUCKSPORT',
    flag: 'USA',
  },
  {
    id: 'usa-burg',
    name: 'BURG',
    flag: 'USA',
  },
  {
    id: 'usa-burnsharbor',
    name: 'BURNS HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-burntstore',
    name: 'BURNT STORE',
    flag: 'USA',
  },
  {
    id: 'usa-cainhoy',
    name: 'CAINHOY',
    flag: 'USA',
  },
  {
    id: 'usa-camachee',
    name: 'CAMACHEE',
    flag: 'USA',
  },
  {
    id: 'usa-camden',
    name: 'CAMDEN',
    flag: 'USA',
  },
  {
    id: 'usa-cameron',
    name: 'CAMERON',
    flag: 'USA',
  },
  {
    id: 'usa-capecanaveral',
    name: 'CAPE CANAVERAL',
    flag: 'USA',
  },
  {
    id: 'usa-capecharles',
    name: 'CAPE CHARLES',
    flag: 'USA',
  },
  {
    id: 'usa-capemaycorinthian',
    name: 'CAPE MAY CORINTHIAN',
    flag: 'USA',
  },
  {
    id: 'usa-capeporpoise',
    name: 'CAPE PORPOISE',
    flag: 'USA',
  },
  {
    id: "usa-captain'scove",
    name: "CAPTAIN'S COVE",
    flag: 'USA',
  },
  {
    id: 'usa-carolinabeach',
    name: 'CAROLINA BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-carteret',
    name: 'CARTERET',
    flag: 'USA',
  },
  {
    id: 'usa-castine',
    name: 'CASTINE',
    flag: 'USA',
  },
  {
    id: 'usa-cathlamet',
    name: 'CATHLAMET',
    flag: 'USA',
  },
  {
    id: 'usa-charleston',
    name: 'CHARLESTON',
    flag: 'USA',
  },
  {
    id: 'usa-charlestoncomplex',
    name: 'CHARLESTON COMPLEX',
    flag: 'USA',
  },
  {
    id: 'usa-chatham',
    name: 'CHATHAM',
    flag: 'USA',
  },
  {
    id: 'usa-chautauqua',
    name: 'CHAUTAUQUA',
    flag: 'USA',
  },
  {
    id: 'usa-cherrypoint',
    name: 'CHERRY POINT',
    flag: 'USA',
  },
  {
    id: 'usa-chignik',
    name: 'CHIGNIK',
    flag: 'USA',
  },
  {
    id: 'usa-clarkspoint',
    name: 'CLARKS POINT',
    flag: 'USA',
  },
  {
    id: 'usa-clayton',
    name: 'CLAYTON',
    flag: 'USA',
  },
  {
    id: 'usa-clearlakeshores',
    name: 'CLEAR LAKE SHORES',
    flag: 'USA',
  },
  {
    id: 'usa-clearwater',
    name: 'CLEARWATER',
    flag: 'USA',
  },
  {
    id: 'usa-cleveland',
    name: 'CLEVELAND',
    flag: 'USA',
  },
  {
    id: 'usa-clintonharbor',
    name: 'CLINTON HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-cocoavillage',
    name: 'COCOA VILLAGE',
    flag: 'USA',
  },
  {
    id: 'usa-coeclesharbor',
    name: 'COECLES HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-coeymans',
    name: 'COEYMANS',
    flag: 'USA',
  },
  {
    id: 'usa-columbusbelmont',
    name: 'COLUMBUS BELMONT',
    flag: 'USA',
  },
  {
    id: 'usa-coosbay',
    name: 'COOS BAY',
    flag: 'USA',
  },
  {
    id: 'usa-cordova',
    name: 'CORDOVA',
    flag: 'USA',
  },
  {
    id: 'usa-corpuschristi',
    name: 'CORPUS CHRISTI',
    flag: 'USA',
  },
  {
    id: 'usa-cove',
    name: 'COVE',
    flag: 'USA',
  },
  {
    id: 'usa-coyotepoint',
    name: 'COYOTE POINT',
    flag: 'USA',
  },
  {
    id: 'usa-craig',
    name: 'CRAIG',
    flag: 'USA',
  },
  {
    id: 'usa-crescentcity',
    name: 'CRESCENT CITY',
    flag: 'USA',
  },
  {
    id: 'usa-cuttyhunk',
    name: 'CUTTYHUNK',
    flag: 'USA',
  },
  {
    id: 'usa-danapoint',
    name: 'DANA POINT',
    flag: 'USA',
  },
  {
    id: 'usa-dartmouthrock',
    name: 'DARTMOUTH ROCK',
    flag: 'USA',
  },
  {
    id: 'usa-davant',
    name: 'DAVANT',
    flag: 'USA',
  },
  {
    id: 'usa-davisville',
    name: 'DAVISVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-daytonabeach',
    name: 'DAYTONA BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-deceptionpass',
    name: 'DECEPTION PASS',
    flag: 'USA',
  },
  {
    id: 'usa-deepriver',
    name: 'DEEP RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-deerfieldbeach',
    name: 'DEERFIELD BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-delawarecity',
    name: 'DELAWARE CITY',
    flag: 'USA',
  },
  {
    id: 'usa-delraybeach',
    name: 'DELRAY BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-deltaville',
    name: 'DELTAVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-desmoines',
    name: 'DES MOINES',
    flag: 'USA',
  },
  {
    id: 'usa-destin',
    name: 'DESTIN',
    flag: 'USA',
  },
  {
    id: 'usa-detroit',
    name: 'DETROIT',
    flag: 'USA',
  },
  {
    id: 'usa-diamond',
    name: 'DIAMOND',
    flag: 'USA',
  },
  {
    id: 'usa-dillingham',
    name: 'DILLINGHAM',
    flag: 'USA',
  },
  {
    id: 'usa-dogriver',
    name: 'DOG RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-dulac',
    name: 'DULAC',
    flag: 'USA',
  },
  {
    id: 'usa-dutchboatyard',
    name: 'DUTCH BOAT YARD',
    flag: 'USA',
  },
  {
    id: 'usa-eaglehill',
    name: 'EAGLE HILL',
    flag: 'USA',
  },
  {
    id: 'usa-eastgloucester',
    name: 'EAST GLOUCESTER',
    flag: 'USA',
  },
  {
    id: 'usa-eastgreenwich',
    name: 'EAST GREENWICH',
    flag: 'USA',
  },
  {
    id: 'usa-eastport',
    name: 'EASTPORT',
    flag: 'USA',
  },
  {
    id: 'usa-eatonsneck',
    name: 'EATONS NECK',
    flag: 'USA',
  },
  {
    id: 'usa-edgartown',
    name: 'EDGARTOWN',
    flag: 'USA',
  },
  {
    id: 'usa-edmondsyachtclub',
    name: 'EDMONDS YACHT CLUB',
    flag: 'USA',
  },
  {
    id: 'usa-egegik',
    name: 'EGEGIK',
    flag: 'USA',
  },
  {
    id: 'usa-elsegundoanchorage',
    name: 'EL SEGUNDO ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-emmonak',
    name: 'EMMONAK',
    flag: 'USA',
  },
  {
    id: 'usa-empire',
    name: 'EMPIRE',
    flag: 'USA',
  },
  {
    id: 'usa-estherisland',
    name: 'ESTHER ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-eureka',
    name: 'EUREKA',
    flag: 'USA',
  },
  {
    id: 'usa-everett',
    name: 'EVERETT',
    flag: 'USA',
  },
  {
    id: 'usa-fairlesshills',
    name: 'FAIRLESS HILLS',
    flag: 'USA',
  },
  {
    id: 'usa-fallriver',
    name: 'FALL RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-falmouth',
    name: 'FALMOUTH',
    flag: 'USA',
  },
  {
    id: 'usa-falsepass',
    name: 'FALSE PASS',
    flag: 'USA',
  },
  {
    id: 'usa-fortandrews',
    name: 'FORT ANDREWS',
    flag: 'USA',
  },
  {
    id: 'usa-forthancock',
    name: 'FORT HANCOCK',
    flag: 'USA',
  },
  {
    id: 'usa-fortlauderdale',
    name: 'FORT LAUDERDALE',
    flag: 'USA',
  },
  {
    id: 'usa-fortmorgananchorage',
    name: 'FORT MORGAN ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-fortmyers',
    name: 'FORT MYERS',
    flag: 'USA',
  },
  {
    id: 'usa-fortmyersbeach',
    name: 'FORT MYERS BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-fortpierce',
    name: 'FORT PIERCE',
    flag: 'USA',
  },
  {
    id: 'usa-fourchon',
    name: 'FOURCHON',
    flag: 'USA',
  },
  {
    id: 'usa-fourchonanchorage',
    name: 'FOURCHON ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-freeport',
    name: 'FREEPORT',
    flag: 'USA',
  },
  {
    id: 'usa-fridayharbor',
    name: 'FRIDAY HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-funter',
    name: 'FUNTER',
    flag: 'USA',
  },
  {
    id: 'usa-galesville',
    name: 'GALESVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-galveston',
    name: 'GALVESTON',
    flag: 'USA',
  },
  {
    id: 'usa-gc512platform',
    name: 'GC 512 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-gc608platform',
    name: 'GC 608 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-gc640platform',
    name: 'GC 640 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-gc680platform',
    name: 'GC 680 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-gc743platform',
    name: 'GC 743 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-gc782platform',
    name: 'GC 782 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-geismar',
    name: 'GEISMAR',
    flag: 'USA',
  },
  {
    id: 'usa-georgetown',
    name: 'GEORGETOWN',
    flag: 'USA',
  },
  {
    id: 'usa-gibbstown',
    name: 'GIBBSTOWN',
    flag: 'USA',
  },
  {
    id: 'usa-gibsonisland',
    name: 'GIBSON ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-gigharbor',
    name: 'GIG HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-gola',
    name: 'GOLA',
    flag: 'USA',
  },
  {
    id: 'usa-goldenmeadow',
    name: 'GOLDEN MEADOW',
    flag: 'USA',
  },
  {
    id: 'usa-goodhope',
    name: 'GOOD HOPE',
    flag: 'USA',
  },
  {
    id: 'usa-goodsellpoint',
    name: 'GOODSELL POINT',
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
    id: 'usa-grandisle',
    name: 'GRAND ISLE',
    flag: 'USA',
  },
  {
    id: 'usa-grandisleanchorage',
    name: 'GRAND ISLE ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-graysharbor',
    name: 'GRAYS HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-greatislandboat',
    name: 'GREAT ISLAND BOAT',
    flag: 'USA',
  },
  {
    id: 'usa-greencovesprings',
    name: 'GREEN COVE SPRINGS',
    flag: 'USA',
  },
  {
    id: 'usa-greenport',
    name: 'GREENPORT',
    flag: 'USA',
  },
  {
    id: 'usa-greenwich',
    name: 'GREENWICH',
    flag: 'USA',
  },
  {
    id: 'usa-gulfharbourclub',
    name: 'GULF HARBOUR CLUB',
    flag: 'USA',
  },
  {
    id: 'usa-gulfport',
    name: 'GULFPORT',
    flag: 'USA',
  },
  {
    id: 'usa-halibutpoint',
    name: 'HALIBUT POINT',
    flag: 'USA',
  },
  {
    id: 'usa-hallandale',
    name: 'HALLANDALE',
    flag: 'USA',
  },
  {
    id: 'usa-hampton',
    name: 'HAMPTON',
    flag: 'USA',
  },
  {
    id: 'usa-hanalei',
    name: 'HANALEI',
    flag: 'USA',
  },
  {
    id: 'usa-harborisland',
    name: 'HARBOR ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-harwichport',
    name: 'HARWICH PORT',
    flag: 'USA',
  },
  {
    id: 'usa-hatteras',
    name: 'HATTERAS',
    flag: 'USA',
  },
  {
    id: 'usa-havredegrace',
    name: 'HAVRE DE GRACE',
    flag: 'USA',
  },
  {
    id: 'usa-hawkinlet',
    name: 'HAWK INLET',
    flag: 'USA',
  },
  {
    id: 'usa-haymarkterminal',
    name: 'HAYMARK TERMINAL',
    flag: 'USA',
  },
  {
    id: 'usa-herringtonnorth',
    name: 'HERRINGTON NORTH',
    flag: 'USA',
  },
  {
    id: 'usa-herringtonsouth',
    name: 'HERRINGTON SOUTH',
    flag: 'USA',
  },
  {
    id: 'usa-hilo',
    name: 'HILO',
    flag: 'USA',
  },
  {
    id: 'usa-homer',
    name: 'HOMER',
    flag: 'USA',
  },
  {
    id: 'usa-hoonah',
    name: 'HOONAH',
    flag: 'USA',
  },
  {
    id: 'usa-houghton',
    name: 'HOUGHTON',
    flag: 'USA',
  },
  {
    id: 'usa-houma',
    name: 'HOUMA',
    flag: 'USA',
  },
  {
    id: 'usa-houmaanchorage',
    name: 'HOUMA ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-houston',
    name: 'HOUSTON',
    flag: 'USA',
  },
  {
    id: 'usa-hyannis',
    name: 'HYANNIS',
    flag: 'USA',
  },
  {
    id: 'usa-hydepark',
    name: 'HYDE PARK',
    flag: 'USA',
  },
  {
    id: 'usa-ilwaco',
    name: 'ILWACO',
    flag: 'USA',
  },
  {
    id: 'usa-indialantic',
    name: 'INDIALANTIC',
    flag: 'USA',
  },
  {
    id: 'usa-ingleside',
    name: 'INGLESIDE',
    flag: 'USA',
  },
  {
    id: 'usa-intracoastalcity',
    name: 'INTRACOASTAL CITY',
    flag: 'USA',
  },
  {
    id: 'usa-isthmuscove',
    name: 'ISTHMUS COVE',
    flag: 'USA',
  },
  {
    id: 'usa-jacksonville',
    name: 'JACKSONVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-jacksonvillebeach',
    name: 'JACKSONVILLE BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-jeanlafitte',
    name: 'JEAN LAFITTE',
    flag: 'USA',
  },
  {
    id: 'usa-jeffersonbeach',
    name: 'JEFFERSON BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-johnstown',
    name: 'JOHNSTOWN',
    flag: 'USA',
  },
  {
    id: 'usa-judithpoint',
    name: 'JUDITH POINT',
    flag: 'USA',
  },
  {
    id: 'usa-judithpointanchorage',
    name: 'JUDITH POINT ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-juneau',
    name: 'JUNEAU',
    flag: 'USA',
  },
  {
    id: 'usa-jupiter',
    name: 'JUPITER',
    flag: 'USA',
  },
  {
    id: 'usa-kahului',
    name: 'KAHULUI',
    flag: 'USA',
  },
  {
    id: 'usa-kailuakona',
    name: 'KAILUA KONA',
    flag: 'USA',
  },
  {
    id: 'usa-kalama',
    name: 'KALAMA',
    flag: 'USA',
  },
  {
    id: 'usa-kaneohe',
    name: 'KANEOHE',
    flag: 'USA',
  },
  {
    id: 'usa-kc875platform',
    name: 'KC875 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-kennebunkport',
    name: 'KENNEBUNKPORT',
    flag: 'USA',
  },
  {
    id: 'usa-ketchikan',
    name: 'KETCHIKAN',
    flag: 'USA',
  },
  {
    id: 'usa-keybiscayne',
    name: 'KEY BISCAYNE',
    flag: 'USA',
  },
  {
    id: 'usa-keylargo',
    name: 'KEY LARGO',
    flag: 'USA',
  },
  {
    id: 'usa-keywest',
    name: 'KEY WEST',
    flag: 'USA',
  },
  {
    id: 'usa-kingcove',
    name: 'KING COVE',
    flag: 'USA',
  },
  {
    id: 'usa-kingston',
    name: 'KINGSTON',
    flag: 'USA',
  },
  {
    id: 'usa-kodiak',
    name: 'KODIAK',
    flag: 'USA',
  },
  {
    id: 'usa-lahaina',
    name: 'LAHAINA',
    flag: 'USA',
  },
  {
    id: 'usa-lahainaanchorage',
    name: 'LAHAINA ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-lakecharles',
    name: 'LAKE CHARLES',
    flag: 'USA',
  },
  {
    id: 'usa-laketashmoo',
    name: 'LAKE TASHMOO',
    flag: 'USA',
  },
  {
    id: 'usa-lantana',
    name: 'LANTANA',
    flag: 'USA',
  },
  {
    id: 'usa-larsenbay',
    name: 'LARSEN BAY',
    flag: 'USA',
  },
  {
    id: 'usa-leeville',
    name: 'LEEVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-lewes',
    name: 'LEWES',
    flag: 'USA',
  },
  {
    id: 'usa-lighthousepoint',
    name: 'LIGHTHOUSE POINT',
    flag: 'USA',
  },
  {
    id: 'usa-lloydharbor',
    name: 'LLOYD HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-locustpoint',
    name: 'LOCUST POINT',
    flag: 'USA',
  },
  {
    id: 'usa-longbeach',
    name: 'LONG BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-longview',
    name: 'LONGVIEW',
    flag: 'USA',
  },
  {
    id: 'usa-loop',
    name: 'LOOP',
    flag: 'USA',
  },
  {
    id: 'usa-lopezisland',
    name: 'LOPEZ ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-mackinacisland',
    name: 'MACKINAC ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-mackinawcity',
    name: 'MACKINAW CITY',
    flag: 'USA',
  },
  {
    id: 'usa-mamibeach',
    name: 'MAMI BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-manchester-by-the-sea',
    name: 'MANCHESTER-BY-THE-SEA',
    flag: 'USA',
  },
  {
    id: 'usa-manteowaterfront',
    name: 'MANTEO WATERFRONT',
    flag: 'USA',
  },
  {
    id: 'usa-marathon',
    name: 'MARATHON',
    flag: 'USA',
  },
  {
    id: 'usa-marblehead',
    name: 'MARBLEHEAD',
    flag: 'USA',
  },
  {
    id: 'usa-marco',
    name: 'MARCO',
    flag: 'USA',
  },
  {
    id: 'usa-marcushook',
    name: 'MARCUS HOOK',
    flag: 'USA',
  },
  {
    id: 'usa-marinadelrey',
    name: 'MARINA DEL REY',
    flag: 'USA',
  },
  {
    id: 'usa-marinavillage',
    name: 'MARINA VILLAGE',
    flag: 'USA',
  },
  {
    id: 'usa-marinyachtclub',
    name: 'MARIN YACHT CLUB',
    flag: 'USA',
  },
  {
    id: 'usa-marion',
    name: 'MARION',
    flag: 'USA',
  },
  {
    id: 'usa-marquette',
    name: 'MARQUETTE',
    flag: 'USA',
  },
  {
    id: 'usa-martinez',
    name: 'MARTINEZ',
    flag: 'USA',
  },
  {
    id: 'usa-matagorda',
    name: 'MATAGORDA',
    flag: 'USA',
  },
  {
    id: 'usa-mattapoisettanchorage',
    name: 'MATTAPOISETT ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-mayport',
    name: 'MAYPORT',
    flag: 'USA',
  },
  {
    id: 'usa-mc127platform',
    name: 'MC 127 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-mc724platform',
    name: 'MC 724 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-mc807platform',
    name: 'MC 807 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-mc809platform',
    name: 'MC 809 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-mc822platform',
    name: 'MC 822 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-meggett',
    name: 'MEGGETT',
    flag: 'USA',
  },
  {
    id: 'usa-melville',
    name: 'MELVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-memphis',
    name: 'MEMPHIS',
    flag: 'USA',
  },
  {
    id: 'usa-metropolis',
    name: 'METROPOLIS',
    flag: 'USA',
  },
  {
    id: 'usa-miami',
    name: 'MIAMI',
    flag: 'USA',
  },
  {
    id: 'usa-michoud',
    name: 'MICHOUD',
    flag: 'USA',
  },
  {
    id: 'usa-milford',
    name: 'MILFORD',
    flag: 'USA',
  },
  {
    id: 'usa-monheganisland',
    name: 'MONHEGAN ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-montauk',
    name: 'MONTAUK',
    flag: 'USA',
  },
  {
    id: 'usa-montaukstation',
    name: 'MONTAUK STATION',
    flag: 'USA',
  },
  {
    id: 'usa-monterey',
    name: 'MONTEREY',
    flag: 'USA',
  },
  {
    id: 'usa-moreheadcityanchorage',
    name: 'MOREHEAD CITY ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-morgancity',
    name: 'MORGAN CITY',
    flag: 'USA',
  },
  {
    id: 'usa-morrisonville',
    name: 'MORRISONVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-morrobay',
    name: 'MORRO BAY',
    flag: 'USA',
  },
  {
    id: 'usa-mosslanding',
    name: 'MOSS LANDING',
    flag: 'USA',
  },
  {
    id: 'usa-mystic',
    name: 'MYSTIC',
    flag: 'USA',
  },
  {
    id: 'usa-naknek',
    name: 'NAKNEK',
    flag: 'USA',
  },
  {
    id: 'usa-nantucket',
    name: 'NANTUCKET',
    flag: 'USA',
  },
  {
    id: 'usa-nantucketanchorage',
    name: 'NANTUCKET ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-neahbay',
    name: 'NEAH BAY',
    flag: 'USA',
  },
  {
    id: 'usa-newburgh',
    name: 'NEWBURGH',
    flag: 'USA',
  },
  {
    id: 'usa-newburyport',
    name: 'NEWBURYPORT',
    flag: 'USA',
  },
  {
    id: 'usa-newhaven',
    name: 'NEW HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-newiberia',
    name: 'NEW IBERIA',
    flag: 'USA',
  },
  {
    id: 'usa-newlondon',
    name: 'NEW LONDON',
    flag: 'USA',
  },
  {
    id: 'usa-neworleans',
    name: 'NEW ORLEANS',
    flag: 'USA',
  },
  {
    id: 'usa-newport',
    name: 'NEWPORT',
    flag: 'USA',
  },
  {
    id: 'usa-newportanchorage',
    name: 'NEWPORT ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-newportbeach',
    name: 'NEWPORT BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-newportnews',
    name: 'NEWPORT NEWS',
    flag: 'USA',
  },
  {
    id: 'usa-newyork',
    name: 'NEW YORK',
    flag: 'USA',
  },
  {
    id: 'usa-nikiskianchorage',
    name: 'NIKISKI ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-nome',
    name: 'NOME',
    flag: 'USA',
  },
  {
    id: 'usa-norfolk',
    name: 'NORFOLK',
    flag: 'USA',
  },
  {
    id: 'usa-northamericansh',
    name: 'NORTH AMERICAN SH',
    flag: 'USA',
  },
  {
    id: 'usa-northbend',
    name: 'NORTH BEND',
    flag: 'USA',
  },
  {
    id: 'usa-northcove',
    name: 'NORTH COVE',
    flag: 'USA',
  },
  {
    id: 'usa-northeastharbor',
    name: 'NORTHEAST HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-northhaven',
    name: 'NORTH HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-northhavenisland',
    name: 'NORTH HAVEN ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-northpalmbeach',
    name: 'NORTH PALM BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-northportbay',
    name: 'NORTHPORT BAY',
    flag: 'USA',
  },
  {
    id: 'usa-oakland',
    name: 'OAKLAND',
    flag: 'USA',
  },
  {
    id: 'usa-oceancity',
    name: 'OCEAN CITY',
    flag: 'USA',
  },
  {
    id: 'usa-oceanreef',
    name: 'OCEAN REEF',
    flag: 'USA',
  },
  {
    id: 'usa-oceanside',
    name: 'OCEANSIDE',
    flag: 'USA',
  },
  {
    id: 'usa-olmsted',
    name: 'OLMSTED',
    flag: 'USA',
  },
  {
    id: 'usa-olympia',
    name: 'OLYMPIA',
    flag: 'USA',
  },
  {
    id: 'usa-onset',
    name: 'ONSET',
    flag: 'USA',
  },
  {
    id: 'usa-orange',
    name: 'ORANGE',
    flag: 'USA',
  },
  {
    id: 'usa-orangebeach',
    name: 'ORANGE BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-ostervilleanglers',
    name: 'OSTERVILLE ANGLERS',
    flag: 'USA',
  },
  {
    id: 'usa-oswego',
    name: 'OSWEGO',
    flag: 'USA',
  },
  {
    id: 'usa-oysterbay',
    name: 'OYSTER BAY',
    flag: 'USA',
  },
  {
    id: 'usa-oysterpoint',
    name: 'OYSTER POINT',
    flag: 'USA',
  },
  {
    id: 'usa-palacios',
    name: 'PALACIOS',
    flag: 'USA',
  },
  {
    id: 'usa-palmbeach',
    name: 'PALM BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-palmshores',
    name: 'PALM SHORES',
    flag: 'USA',
  },
  {
    id: 'usa-palmyachtcenter',
    name: 'PALM YACHT CENTER',
    flag: 'USA',
  },
  {
    id: 'usa-panamacity',
    name: 'PANAMA CITY',
    flag: 'USA',
  },
  {
    id: 'usa-pascagoula',
    name: 'PASCAGOULA',
    flag: 'USA',
  },
  {
    id: 'usa-paulina',
    name: 'PAULINA',
    flag: 'USA',
  },
  {
    id: 'usa-paulsboro',
    name: 'PAULSBORO',
    flag: 'USA',
  },
  {
    id: 'usa-pearlharbor',
    name: 'PEARL HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-pensacola',
    name: 'PENSACOLA',
    flag: 'USA',
  },
  {
    id: 'usa-pequot',
    name: 'PEQUOT',
    flag: 'USA',
  },
  {
    id: 'usa-perthamboy',
    name: 'PERTH AMBOY',
    flag: 'USA',
  },
  {
    id: 'usa-perthamboyanchorage',
    name: 'PERTH AMBOY ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-philadelphia',
    name: 'PHILADELPHIA',
    flag: 'USA',
  },
  {
    id: 'usa-pilotpoint',
    name: 'PILOT POINT',
    flag: 'USA',
  },
  {
    id: 'usa-pittsburg',
    name: 'PITTSBURG',
    flag: 'USA',
  },
  {
    id: 'usa-plymouthharbor',
    name: 'PLYMOUTH HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-pocasset',
    name: 'POCASSET',
    flag: 'USA',
  },
  {
    id: 'usa-pointcadet',
    name: 'POINT CADET',
    flag: 'USA',
  },
  {
    id: 'usa-pointcomfort',
    name: 'POINT COMFORT',
    flag: 'USA',
  },
  {
    id: 'usa-pointcomfortanchorage',
    name: 'POINT COMFORT ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-pointdefiance',
    name: 'POINT DEFIANCE',
    flag: 'USA',
  },
  {
    id: 'usa-pointreyes',
    name: 'POINT REYES',
    flag: 'USA',
  },
  {
    id: 'usa-portangeles',
    name: 'PORT ANGELES',
    flag: 'USA',
  },
  {
    id: 'usa-portarthur',
    name: 'PORT ARTHUR',
    flag: 'USA',
  },
  {
    id: 'usa-portblakely',
    name: 'PORT BLAKELY',
    flag: 'USA',
  },
  {
    id: 'usa-portclyde',
    name: 'PORT CLYDE',
    flag: 'USA',
  },
  {
    id: 'usa-porteverglades',
    name: 'PORT EVERGLADES',
    flag: 'USA',
  },
  {
    id: 'usa-porthueneme',
    name: 'PORT HUENEME',
    flag: 'USA',
  },
  {
    id: 'usa-portisabel',
    name: 'PORT ISABEL',
    flag: 'USA',
  },
  {
    id: 'usa-portjefferson',
    name: 'PORT JEFFERSON',
    flag: 'USA',
  },
  {
    id: 'usa-portlandme',
    name: 'PORTLAND ME',
    flag: 'USA',
  },
  {
    id: 'usa-portlandor',
    name: 'PORTLAND OR',
    flag: 'USA',
  },
  {
    id: 'usa-portludlow',
    name: 'PORT LUDLOW',
    flag: 'USA',
  },
  {
    id: 'usa-portmanatee',
    name: 'PORT MANATEE',
    flag: 'USA',
  },
  {
    id: 'usa-portmoller',
    name: 'PORT MOLLER',
    flag: 'USA',
  },
  {
    id: 'usa-portmorris',
    name: 'PORT MORRIS',
    flag: 'USA',
  },
  {
    id: 'usa-portneches',
    name: 'PORT NECHES',
    flag: 'USA',
  },
  {
    id: "usa-porto'connor",
    name: "PORT O'CONNOR",
    flag: 'USA',
  },
  {
    id: 'usa-portofnaples',
    name: 'PORT OF NAPLES',
    flag: 'USA',
  },
  {
    id: 'usa-portorchard',
    name: 'PORT ORCHARD',
    flag: 'USA',
  },
  {
    id: 'usa-portrichmond',
    name: 'PORT RICHMOND',
    flag: 'USA',
  },
  {
    id: 'usa-portroyallanding',
    name: 'PORT ROYAL LANDING',
    flag: 'USA',
  },
  {
    id: 'usa-portsmouth',
    name: 'PORTSMOUTH',
    flag: 'USA',
  },
  {
    id: 'usa-portsulphur',
    name: 'PORT SULPHUR',
    flag: 'USA',
  },
  {
    id: 'usa-porttownsend',
    name: 'PORT TOWNSEND',
    flag: 'USA',
  },
  {
    id: 'usa-poughkeepsie',
    name: 'POUGHKEEPSIE',
    flag: 'USA',
  },
  {
    id: 'usa-princeton',
    name: 'PRINCETON',
    flag: 'USA',
  },
  {
    id: 'usa-providence',
    name: 'PROVIDENCE',
    flag: 'USA',
  },
  {
    id: 'usa-provincetown',
    name: 'PROVINCETOWN',
    flag: 'USA',
  },
  {
    id: 'usa-prudhoebay',
    name: 'PRUDHOE BAY',
    flag: 'USA',
  },
  {
    id: 'usa-quartermaster',
    name: 'QUARTERMASTER',
    flag: 'USA',
  },
  {
    id: 'usa-quincy',
    name: 'QUINCY',
    flag: 'USA',
  },
  {
    id: 'usa-reddoganchorage',
    name: 'RED DOG ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-redondo',
    name: 'REDONDO',
    flag: 'USA',
  },
  {
    id: 'usa-redwoodcity',
    name: 'REDWOOD CITY',
    flag: 'USA',
  },
  {
    id: 'usa-reedville',
    name: 'REEDVILLE',
    flag: 'USA',
  },
  {
    id: 'usa-reserve',
    name: 'RESERVE',
    flag: 'USA',
  },
  {
    id: 'usa-richmond',
    name: 'RICHMOND',
    flag: 'USA',
  },
  {
    id: 'usa-riverheadanchorage',
    name: 'RIVERHEAD ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-rocheharbor',
    name: 'ROCHE  HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-rockland',
    name: 'ROCKLAND',
    flag: 'USA',
  },
  {
    id: 'usa-rockport',
    name: 'ROCKPORT',
    flag: 'USA',
  },
  {
    id: 'usa-rodriguezkey',
    name: 'RODRIGUEZ KEY',
    flag: 'USA',
  },
  {
    id: 'usa-rowayton',
    name: 'ROWAYTON',
    flag: 'USA',
  },
  {
    id: 'usa-rubyisland',
    name: 'RUBY ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-rutherfordisland',
    name: 'RUTHERFORD ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-sabinepass',
    name: 'SABINE PASS',
    flag: 'USA',
  },
  {
    id: 'usa-sacramento',
    name: 'SACRAMENTO',
    flag: 'USA',
  },
  {
    id: 'usa-sagharbor',
    name: 'SAG HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-saintgabriel',
    name: 'SAINT GABRIEL',
    flag: 'USA',
  },
  {
    id: 'usa-saintmichaels',
    name: 'SAINT MICHAELS',
    flag: 'USA',
  },
  {
    id: 'usa-sakonnet',
    name: 'SAKONNET',
    flag: 'USA',
  },
  {
    id: 'usa-sanclementeisland',
    name: 'SAN CLEMENTE ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-sandiego',
    name: 'SAN DIEGO',
    flag: 'USA',
  },
  {
    id: 'usa-sandpoint',
    name: 'SAND POINT',
    flag: 'USA',
  },
  {
    id: 'usa-sandwich',
    name: 'SANDWICH',
    flag: 'USA',
  },
  {
    id: 'usa-sandybay',
    name: 'SANDY BAY',
    flag: 'USA',
  },
  {
    id: 'usa-sanfrancisco',
    name: 'SAN FRANCISCO',
    flag: 'USA',
  },
  {
    id: 'usa-santabarbara',
    name: 'SANTA BARBARA',
    flag: 'USA',
  },
  {
    id: 'usa-santacatalinaisland',
    name: 'SANTA CATALINA ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-santacruzca',
    name: 'SANTA CRUZ CA',
    flag: 'USA',
  },
  {
    id: 'usa-santacruzisland',
    name: 'SANTA CRUZ ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-santarosaisland',
    name: 'SANTA ROSA ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-sarasota',
    name: 'SARASOTA',
    flag: 'USA',
  },
  {
    id: 'usa-saultstemarie',
    name: 'SAULT STE MARIE',
    flag: 'USA',
  },
  {
    id: 'usa-sausalito',
    name: 'SAUSALITO',
    flag: 'USA',
  },
  {
    id: 'usa-savannah',
    name: 'SAVANNAH',
    flag: 'USA',
  },
  {
    id: 'usa-sawmillcove',
    name: 'SAWMILL COVE',
    flag: 'USA',
  },
  {
    id: 'usa-scituate',
    name: 'SCITUATE',
    flag: 'USA',
  },
  {
    id: 'usa-sealbeach',
    name: 'SEAL BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-searsport',
    name: 'SEARSPORT',
    flag: 'USA',
  },
  {
    id: 'usa-seattle',
    name: 'SEATTLE',
    flag: 'USA',
  },
  {
    id: 'usa-seattleportmadison',
    name: 'SEATTLE PORT MADISON',
    flag: 'USA',
  },
  {
    id: 'usa-sebascoresort',
    name: 'SEBASCO RESORT',
    flag: 'USA',
  },
  {
    id: 'usa-selby',
    name: 'SELBY',
    flag: 'USA',
  },
  {
    id: 'usa-selbybay',
    name: 'SELBY BAY',
    flag: 'USA',
  },
  {
    id: 'usa-seward',
    name: 'SEWARD',
    flag: 'USA',
  },
  {
    id: 'usa-sewardanchorage',
    name: 'SEWARD ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-sitka',
    name: 'SITKA',
    flag: 'USA',
  },
  {
    id: 'usa-skagway',
    name: 'SKAGWAY',
    flag: 'USA',
  },
  {
    id: 'usa-sneadsferry',
    name: 'SNEADS FERRY',
    flag: 'USA',
  },
  {
    id: 'usa-southharpswell',
    name: 'SOUTH HARPSWELL',
    flag: 'USA',
  },
  {
    id: 'usa-southnorwalk',
    name: 'SOUTH NORWALK',
    flag: 'USA',
  },
  {
    id: 'usa-southpark',
    name: 'SOUTH PARK',
    flag: 'USA',
  },
  {
    id: 'usa-southpasadena',
    name: 'SOUTH PASADENA',
    flag: 'USA',
  },
  {
    id: 'usa-southport',
    name: 'SOUTHPORT',
    flag: 'USA',
  },
  {
    id: 'usa-southwestharbor',
    name: 'SOUTHWEST HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-spudpoint',
    name: 'SPUD POINT',
    flag: 'USA',
  },
  {
    id: 'usa-ss349platform',
    name: 'SS 349 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-st.helens',
    name: 'ST. HELENS',
    flag: 'USA',
  },
  {
    id: 'usa-stamfordlanding',
    name: 'STAMFORD LANDING',
    flag: 'USA',
  },
  {
    id: 'usa-staugustine',
    name: 'ST AUGUSTINE',
    flag: 'USA',
  },
  {
    id: 'usa-stlouis',
    name: 'ST LOUIS',
    flag: 'USA',
  },
  {
    id: 'usa-stockisland',
    name: 'STOCK ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-stockton',
    name: 'STOCKTON',
    flag: 'USA',
  },
  {
    id: 'usa-stonington',
    name: 'STONINGTON',
    flag: 'USA',
  },
  {
    id: 'usa-stpaul',
    name: 'ST PAUL',
    flag: 'USA',
  },
  {
    id: 'usa-stpetersburg',
    name: 'ST PETERSBURG',
    flag: 'USA',
  },
  {
    id: 'usa-striperinc',
    name: 'STRIPER INC',
    flag: 'USA',
  },
  {
    id: 'usa-stsimons',
    name: 'ST SIMONS',
    flag: 'USA',
  },
  {
    id: 'usa-stuart',
    name: 'STUART',
    flag: 'USA',
  },
  {
    id: 'usa-stuartisland',
    name: 'STUART ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-sullivansisland',
    name: 'SULLIVANS ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-sunnypoint',
    name: 'SUNNY POINT',
    flag: 'USA',
  },
  {
    id: 'usa-sunriseharbor',
    name: 'SUNRISE HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-sunsetbeach',
    name: 'SUNSET BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-swansboro',
    name: 'SWANSBORO',
    flag: 'USA',
  },
  {
    id: 'usa-swansisland',
    name: 'SWANS ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-tacoma',
    name: 'TACOMA',
    flag: 'USA',
  },
  {
    id: 'usa-takuharbor',
    name: 'TAKU HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-tampa',
    name: 'TAMPA',
    flag: 'USA',
  },
  {
    id: 'usa-tarponpoint',
    name: 'TARPON POINT',
    flag: 'USA',
  },
  {
    id: 'usa-tarrytown',
    name: 'TARRYTOWN',
    flag: 'USA',
  },
  {
    id: 'usa-telemarbay',
    name: 'TELEMAR BAY',
    flag: 'USA',
  },
  {
    id: 'usa-texascity',
    name: 'TEXAS CITY',
    flag: 'USA',
  },
  {
    id: 'usa-thenarrows',
    name: 'THE NARROWS',
    flag: 'USA',
  },
  {
    id: 'usa-threemileharbor',
    name: 'THREEMILE HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-thunderboltmarine',
    name: 'THUNDERBOLT MARINE',
    flag: 'USA',
  },
  {
    id: 'usa-tiburon',
    name: 'TIBURON',
    flag: 'USA',
  },
  {
    id: 'usa-tiverton',
    name: 'TIVERTON',
    flag: 'USA',
  },
  {
    id: 'usa-toledo',
    name: 'TOLEDO',
    flag: 'USA',
  },
  {
    id: 'usa-treasurecoast',
    name: 'TREASURE COAST',
    flag: 'USA',
  },
  {
    id: 'usa-twinbrothers',
    name: 'TWIN BROTHERS',
    flag: 'USA',
  },
  {
    id: 'usa-twindolphin',
    name: 'TWIN DOLPHIN',
    flag: 'USA',
  },
  {
    id: 'usa-usngzcgi',
    name: 'US NGZ CGI',
    flag: 'USA',
  },
  {
    id: 'usa-valdez',
    name: 'VALDEZ',
    flag: 'USA',
  },
  {
    id: 'usa-vallejo',
    name: 'VALLEJO',
    flag: 'USA',
  },
  {
    id: 'usa-vancouver',
    name: 'VANCOUVER',
    flag: 'USA',
  },
  {
    id: 'usa-vendovianchorage',
    name: 'VENDOVI ANCHORAGE',
    flag: 'USA',
  },
  {
    id: 'usa-venice',
    name: 'VENICE',
    flag: 'USA',
  },
  {
    id: 'usa-ventura',
    name: 'VENTURA',
    flag: 'USA',
  },
  {
    id: 'usa-verobeach',
    name: 'VERO BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-vineyardhaven',
    name: 'VINEYARD HAVEN',
    flag: 'USA',
  },
  {
    id: 'usa-vk786platform',
    name: 'VK 786 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-wanchese',
    name: 'WANCHESE',
    flag: 'USA',
  },
  {
    id: 'usa-wardcove',
    name: 'WARD COVE',
    flag: 'USA',
  },
  {
    id: 'usa-warrenton',
    name: 'WARRENTON',
    flag: 'USA',
  },
  {
    id: 'usa-warsaw',
    name: 'WARSAW',
    flag: 'USA',
  },
  {
    id: 'usa-warwick',
    name: 'WARWICK',
    flag: 'USA',
  },
  {
    id: 'usa-washington',
    name: 'WASHINGTON',
    flag: 'USA',
  },
  {
    id: 'usa-watchhill',
    name: 'WATCH HILL',
    flag: 'USA',
  },
  {
    id: 'usa-welcome',
    name: 'WELCOME',
    flag: 'USA',
  },
  {
    id: 'usa-westbradenton',
    name: 'WEST BRADENTON',
    flag: 'USA',
  },
  {
    id: 'usa-westbrooktown',
    name: 'WESTBROOK TOWN',
    flag: 'USA',
  },
  {
    id: 'usa-westgulfport',
    name: 'WEST GULFPORT',
    flag: 'USA',
  },
  {
    id: 'usa-westport',
    name: 'WESTPORT',
    flag: 'USA',
  },
  {
    id: 'usa-westportpoint',
    name: 'WESTPORT POINT',
    flag: 'USA',
  },
  {
    id: 'usa-whittier',
    name: 'WHITTIER',
    flag: 'USA',
  },
  {
    id: 'usa-wickfordcove',
    name: 'WICKFORD COVE',
    flag: 'USA',
  },
  {
    id: 'usa-willspoint',
    name: 'WILLS POINT',
    flag: 'USA',
  },
  {
    id: 'usa-wilmingtonisland',
    name: 'WILMINGTON ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-wilmingtonnc',
    name: 'WILMINGTON NC',
    flag: 'USA',
  },
  {
    id: 'usa-windmillharbor',
    name: 'WINDMILL HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-woodriver',
    name: 'WOOD RIVER',
    flag: 'USA',
  },
  {
    id: 'usa-woodshole',
    name: 'WOODS HOLE',
    flag: 'USA',
  },
  {
    id: 'usa-wr29platform',
    name: 'WR 29 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-wr678platform',
    name: 'WR 678 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-wr758platform',
    name: 'WR 758 PLATFORM',
    flag: 'USA',
  },
  {
    id: 'usa-wrangell',
    name: 'WRANGELL',
    flag: 'USA',
  },
  {
    id: 'usa-wrightsvillebeach',
    name: 'WRIGHTSVILLE BEACH',
    flag: 'USA',
  },
  {
    id: 'usa-yakutat',
    name: 'YAKUTAT',
    flag: 'USA',
  },
  {
    id: 'usa-yerbabuenaisland',
    name: 'YERBABUENA ISLAND',
    flag: 'USA',
  },
  {
    id: 'usa-yorklanding',
    name: 'YORK LANDING',
    flag: 'USA',
  },
  {
    id: 'usa-yorktown',
    name: 'YORKTOWN',
    flag: 'USA',
  },
  {
    id: 'vct-bequia',
    name: 'BEQUIA',
    flag: 'VCT',
  },
  {
    id: 'vct-bluelagoon',
    name: 'BLUE LAGOON',
    flag: 'VCT',
  },
  {
    id: 'vct-canouan',
    name: 'CANOUAN',
    flag: 'VCT',
  },
  {
    id: 'vct-chateaubelair',
    name: 'CHATEAUBELAIR',
    flag: 'VCT',
  },
  {
    id: 'vct-mayreau',
    name: 'MAYREAU',
    flag: 'VCT',
  },
  {
    id: 'vct-palmisland',
    name: 'PALM ISLAND',
    flag: 'VCT',
  },
  {
    id: 'vct-petitsaintvincent',
    name: 'PETIT SAINT VINCENT',
    flag: 'VCT',
  },
  {
    id: 'vct-tobagocays',
    name: 'TOBAGO CAYS',
    flag: 'VCT',
  },
  {
    id: 'vct-unionisland',
    name: 'UNION ISLAND',
    flag: 'VCT',
  },
  {
    id: 'ven-amuay',
    name: 'AMUAY',
    flag: 'VEN',
  },
  {
    id: 'ven-bachaquero',
    name: 'BACHAQUERO',
    flag: 'VEN',
  },
  {
    id: 'ven-bajogrande',
    name: 'BAJO GRANDE',
    flag: 'VEN',
  },
  {
    id: 'ven-bocagrande',
    name: 'BOCA GRANDE',
    flag: 'VEN',
  },
  {
    id: 'ven-cabimas',
    name: 'CABIMAS',
    flag: 'VEN',
  },
  {
    id: 'ven-carenero',
    name: 'CARENERO',
    flag: 'VEN',
  },
  {
    id: 'ven-carupano',
    name: 'CARUPANO',
    flag: 'VEN',
  },
  {
    id: 'ven-catialamar',
    name: 'CATIA LA MAR',
    flag: 'VEN',
  },
  {
    id: 'ven-ciudadojeda',
    name: 'CIUDAD OJEDA',
    flag: 'VEN',
  },
  {
    id: 'ven-elguamache',
    name: 'EL GUAMACHE',
    flag: 'VEN',
  },
  {
    id: 'ven-elpalito',
    name: 'EL PALITO',
    flag: 'VEN',
  },
  {
    id: 'ven-guanta',
    name: 'GUANTA',
    flag: 'VEN',
  },
  {
    id: 'ven-guayanacity',
    name: 'GUAYANA CITY',
    flag: 'VEN',
  },
  {
    id: 'ven-guiria',
    name: 'GUIRIA',
    flag: 'VEN',
  },
  {
    id: 'ven-joseterminal',
    name: 'JOSE TERMINAL',
    flag: 'VEN',
  },
  {
    id: 'ven-laguaira',
    name: 'LA GUAIRA',
    flag: 'VEN',
  },
  {
    id: 'ven-lagunillas',
    name: 'LAGUNILLAS',
    flag: 'VEN',
  },
  {
    id: 'ven-maracaibo',
    name: 'MARACAIBO',
    flag: 'VEN',
  },
  {
    id: 'ven-matanzas',
    name: 'MATANZAS',
    flag: 'VEN',
  },
  {
    id: 'ven-puertocabello',
    name: 'PUERTO CABELLO',
    flag: 'VEN',
  },
  {
    id: 'ven-puertocumarebo',
    name: 'PUERTO CUMAREBO',
    flag: 'VEN',
  },
  {
    id: 'ven-puertolacruz',
    name: 'PUERTO LA CRUZ',
    flag: 'VEN',
  },
  {
    id: 'ven-puertomiranda',
    name: 'PUERTO MIRANDA',
    flag: 'VEN',
  },
  {
    id: 'ven-puertoordaz',
    name: 'PUERTO ORDAZ',
    flag: 'VEN',
  },
  {
    id: 'ven-puntacardon',
    name: 'PUNTA CARDON',
    flag: 'VEN',
  },
  {
    id: 'ven-puntaguaranao',
    name: 'PUNTA GUARANAO',
    flag: 'VEN',
  },
  {
    id: 'ven-tiajuana',
    name: 'TIA JUANA',
    flag: 'VEN',
  },
  {
    id: 'vgb-anegada',
    name: 'ANEGADA',
    flag: 'VGB',
  },
  {
    id: 'vgb-beefisland',
    name: 'BEEF ISLAND',
    flag: 'VGB',
  },
  {
    id: 'vgb-cooperisland',
    name: 'COOPER ISLAND',
    flag: 'VGB',
  },
  {
    id: 'vgb-guanaisland',
    name: 'GUANA ISLAND',
    flag: 'VGB',
  },
  {
    id: 'vgb-jostvandyke',
    name: 'JOST VAN DYKE',
    flag: 'VGB',
  },
  {
    id: 'vgb-nannycay',
    name: 'NANNY CAY',
    flag: 'VGB',
  },
  {
    id: 'vgb-normanisland',
    name: 'NORMAN ISLAND',
    flag: 'VGB',
  },
  {
    id: 'vgb-peterisland',
    name: 'PETER ISLAND',
    flag: 'VGB',
  },
  {
    id: 'vgb-roadtown',
    name: 'ROAD TOWN',
    flag: 'VGB',
  },
  {
    id: 'vgb-saltisland',
    name: 'SALT ISLAND',
    flag: 'VGB',
  },
  {
    id: 'vgb-sopershole',
    name: 'SOPERS HOLE',
    flag: 'VGB',
  },
  {
    id: 'vgb-virgingorda',
    name: 'VIRGIN GORDA',
    flag: 'VGB',
  },
  {
    id: 'vir-christiansted',
    name: 'CHRISTIANSTED',
    flag: 'VIR',
  },
  {
    id: 'vir-cruzbay',
    name: 'CRUZ BAY',
    flag: 'VIR',
  },
  {
    id: 'vir-ensomhedbay',
    name: 'ENSOMHED BAY',
    flag: 'VIR',
  },
  {
    id: 'vir-greatstjamesisle',
    name: 'GREAT ST JAMES ISLE',
    flag: 'VIR',
  },
  {
    id: 'vir-stcroix',
    name: 'ST CROIX',
    flag: 'VIR',
  },
  {
    id: 'vir-stthomas',
    name: 'ST THOMAS',
    flag: 'VIR',
  },
  {
    id: 'vir-vessupbay',
    name: 'VESSUP BAY',
    flag: 'VIR',
  },
  {
    id: 'vnm-anthoifishingport',
    name: 'AN THOI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-bachlongvifishingport',
    name: 'BACH LONG VI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-batrifishingport',
    name: 'BA TRI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-bendafishingport',
    name: 'BEN DA FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-bendamfishingport',
    name: 'BEN DAM FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-binhchaufishingport',
    name: 'BINH CHAU FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-binhdaifishingport',
    name: 'BINH DAI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-caidoivamfishingport',
    name: 'CAI DOI VAM FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-caimep',
    name: 'CAI MEP',
    flag: 'VNM',
  },
  {
    id: 'vnm-campha',
    name: 'CAM PHA',
    flag: 'VNM',
  },
  {
    id: 'vnm-canafishingport',
    name: 'CA NA FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-cangcanhatle',
    name: 'CANG CA NHAT LE',
    flag: 'VNM',
  },
  {
    id: 'vnm-chocautau(quangphuc)fishingport',
    name: 'CHO CAU TAU (QUANG PHUC) FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-concofishingport',
    name: 'CON CO FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-condaofishingport',
    name: 'CON DAO FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-cuahoifishingport',
    name: 'CUA HOI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-cualanfishingport',
    name: 'CUA LAN FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-cuanhuongfishingport',
    name: 'CUA NHUONG FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-cuasotfishingport',
    name: 'CUA SOT FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-cuatungfishingport',
    name: 'CUA TUNG FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-cuavietfishingport',
    name: 'CUA VIET FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-cuavietmarketfishingport',
    name: 'CUA VIET MARKET FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-dabacfishingport',
    name: 'DA BAC FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-dailanhfishingport',
    name: 'DAI LANH FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-danang',
    name: 'DA NANG',
    flag: 'VNM',
  },
  {
    id: 'vnm-danphuocfishingport',
    name: 'DAN PHUOC FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-degifishingport',
    name: 'DE GI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-dinhanfishingport',
    name: 'DINH AN FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-donghaifishingport',
    name: 'DONG HAI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-dongnai',
    name: 'DONG NAI',
    flag: 'VNM',
  },
  {
    id: 'vnm-dongtacfishingport',
    name: 'DONG TAC FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-dungquat',
    name: 'DUNG QUAT',
    flag: 'VNM',
  },
  {
    id: 'vnm-fishingport19/5',
    name: 'FISHING PORT 19/5',
    flag: 'VNM',
  },
  {
    id: 'vnm-fishingportninhco',
    name: 'FISHING PORT NINH CO',
    flag: 'VNM',
  },
  {
    id: 'vnm-ganhhaofishingport',
    name: 'GANH HAO FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-godau',
    name: 'GO DAU',
    flag: 'VNM',
  },
  {
    id: 'vnm-haichaufishingport',
    name: 'HAI CHAU FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-hoalocfishingport',
    name: 'HOA LOC FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-hoguifishingport',
    name: 'HO GUI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-honrofishingport',
    name: 'HON RO FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-hungthaifisherieslogisticsport',
    name: 'HUNG THAI FISHERIES LOGISTICS PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-incomapfishingport&lothan+shiprepairport',
    name: 'INCOMAP FISHING PORT & LO THAN + SHIP REPAIR PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-lachbangfishingport',
    name: 'LACH BANG FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-lachhoifishingport',
    name: 'LACH HOI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-lachquenfishingport',
    name: 'LACH QUEN FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-lachvanfishingport',
    name: 'LACH VAN FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-lagifishingport',
    name: 'LA GI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-langchimfishingport',
    name: 'LANG CHIM FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-locanfishingport&tanphuocfishingport',
    name: 'LOC AN FISHING PORT & TAN PHUOC FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-longkou',
    name: 'LONGKOU',
    flag: 'VNM',
  },
  {
    id: 'vnm-lysonfishingport',
    name: 'LY SON FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-moofishingport',
    name: 'MO O FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-muiongfishingport',
    name: 'MUI ONG FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-myafishingport',
    name: 'MY A FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-mytanfishingport',
    name: 'MY TAN FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-mythofishingport',
    name: 'MY THO FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-nghison',
    name: 'NGHI SON',
    flag: 'VNM',
  },
  {
    id: 'vnm-ngochaifishingport',
    name: 'NGOC HAI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-ninhchufishingport',
    name: 'NINH CHU FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-ninhhaifishingport',
    name: 'NINH HAI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-phanricuafishingport',
    name: 'PHAN RI CUA FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-phanthietfishingport',
    name: 'PHAN THIET FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-phuhaifishingport',
    name: 'PHU HAI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-phulacfishingport',
    name: 'PHU LAC FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-phumy',
    name: 'PHU MY',
    flag: 'VNM',
  },
  {
    id: 'vnm-quanghoifishingport',
    name: 'QUANG HOI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-quinhon',
    name: 'QUI NHON',
    flag: 'VNM',
  },
  {
    id: 'vnm-quynhonfishingport',
    name: 'QUY NHON FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-quynhphuongfishingport',
    name: 'QUYNH PHUONG FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-rachgocfishingport',
    name: 'RACH GOC FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-sahuynhfishingport',
    name: 'SA HUYNH FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-sakyfishingport',
    name: 'SA KY FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-sonduong',
    name: 'SON DUONG',
    flag: 'VNM',
  },
  {
    id: 'vnm-songdocfishingport',
    name: 'SONG DOC FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-songtrabongfishingport',
    name: 'SONG TRA BONG FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-taccaufishingport',
    name: 'TAC CAU FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-tamquanfishingport',
    name: 'TAM QUAN FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-tamquangfishingport',
    name: 'TAM QUANG FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-tanxuanfishingport',
    name: 'TAN XUAN FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-thanhphufishingport',
    name: 'THANH PHU FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-thanhvuifishingport',
    name: 'THANH VUI FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-thuananfishingport',
    name: 'THUAN AN FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-tienchaufishingport',
    name: 'TIEN CHAU FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-tinhhoafishingport',
    name: 'TINH HOA FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-tinhkyfishingport',
    name: 'TINH KY FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-tranchaufishingport',
    name: 'TRAN CHAU FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-trandefishingport',
    name: 'TRAN DE FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-tuhienfishingport',
    name: 'TU HIEN FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-vamlangfishingport',
    name: 'VAM LANG FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-vinhluongfishingport',
    name: 'VINH LUONG FISHING PORT',
    flag: 'VNM',
  },
  {
    id: 'vnm-xuanhoifishignport',
    name: 'XUAN HOI FISHIGN PORT',
    flag: 'VNM',
  },
  {
    id: 'vut-portvila',
    name: 'PORT VILA',
    flag: 'VUT',
  },
  {
    id: 'vut-santo',
    name: 'SANTO',
    flag: 'VUT',
  },
  {
    id: 'wsm-apia',
    name: 'APIA',
    flag: 'WSM',
  },
  {
    id: 'yem-aden',
    name: 'ADEN',
    flag: 'YEM',
  },
  {
    id: 'yem-almukalla',
    name: 'AL MUKALLA',
    flag: 'YEM',
  },
  {
    id: 'yem-hodeidah',
    name: 'HODEIDAH',
    flag: 'YEM',
  },
  {
    id: 'yem-nishtun',
    name: 'NISHTUN',
    flag: 'YEM',
  },
  {
    id: 'yem-saleef',
    name: 'SALEEF',
    flag: 'YEM',
  },
  {
    id: 'zaf-coega',
    name: 'COEGA',
    flag: 'ZAF',
  },
  {
    id: 'zaf-durbananchorage',
    name: 'DURBAN ANCHORAGE',
    flag: 'ZAF',
  },
  {
    id: 'zaf-houtbay',
    name: 'HOUT BAY',
    flag: 'ZAF',
  },
  {
    id: 'zaf-mosselbay',
    name: 'MOSSEL BAY',
    flag: 'ZAF',
  },
  {
    id: 'zaf-richardsbay',
    name: 'RICHARDS BAY',
    flag: 'ZAF',
  },
  {
    id: 'zaf-saldanhabay',
    name: 'SALDANHA BAY',
    flag: 'ZAF',
  },
  {
    id: 'zaf-simonstown',
    name: 'SIMONSTOWN',
    flag: 'ZAF',
  },
  {
    id: 'ago-banana',
    name: 'BANANA',
    flag: 'AGO',
  },
  {
    id: 'ago-lobito',
    name: 'LOBITO',
    flag: 'AGO',
  },
  {
    id: 'ago-luanda',
    name: 'LUANDA',
    flag: 'AGO',
  },
  {
    id: 'ago-matadi',
    name: 'MATADI',
    flag: 'AGO',
  },
  {
    id: 'ago-namibe',
    name: 'NAMIBE',
    flag: 'AGO',
  },
  {
    id: 'ago-soyo',
    name: 'SOYO',
    flag: 'AGO',
  },
  {
    id: 'ago-tombua',
    name: 'TOMBUA',
    flag: 'AGO',
  },
  {
    id: 'are-khorfakkan',
    name: 'KHOR FAKKAN',
    flag: 'ARE',
  },
  {
    id: 'are-sharjah',
    name: 'SHARJAH',
    flag: 'ARE',
  },
  {
    id: 'arg-bahiablanca',
    name: 'BAHIA BLANCA',
    flag: 'ARG',
  },
  {
    id: 'arg-buenosaires',
    name: 'BUENOS AIRES',
    flag: 'ARG',
  },
  {
    id: 'arg-campana',
    name: 'CAMPANA',
    flag: 'ARG',
  },
  {
    id: 'arg-mardelplata',
    name: 'MAR DEL PLATA',
    flag: 'ARG',
  },
  {
    id: 'arg-puertomadryn',
    name: 'PUERTO MADRYN',
    flag: 'ARG',
  },
  {
    id: 'arg-puntaloyola',
    name: 'PUNTA LOYOLA',
    flag: 'ARG',
  },
  {
    id: 'arg-sanantonioeste',
    name: 'SAN ANTONIO ESTE',
    flag: 'ARG',
  },
  {
    id: 'asm-pagopagoharbor',
    name: 'PAGO PAGO HARBOR',
    flag: 'ASM',
  },
  {
    id: 'ata-deceptionisland',
    name: 'DECEPTION ISLAND',
    flag: 'ATA',
  },
  {
    id: 'ata-discoverybay',
    name: 'DISCOVERY BAY',
    flag: 'ATA',
  },
  {
    id: 'ata-fildesbay',
    name: 'FILDES BAY',
    flag: 'ATA',
  },
  {
    id: 'aus-portlincoln',
    name: 'PORT LINCOLN',
    flag: 'AUS',
  },
  {
    id: 'ben-cotonou',
    name: 'COTONOU',
    flag: 'BEN',
  },
  {
    id: 'bgd-chittagong',
    name: 'CHITTAGONG',
    flag: 'BGD',
  },
  {
    id: 'bhs-freeport',
    name: 'FREEPORT',
    flag: 'BHS',
  },
  {
    id: 'blz-belizecity',
    name: 'BELIZE CITY',
    flag: 'BLZ',
  },
  {
    id: 'bra-acarau',
    name: 'ACARAU',
    flag: 'BRA',
  },
  {
    id: 'bra-alcobaca',
    name: 'ALCOBACA',
    flag: 'BRA',
  },
  {
    id: 'bra-anchieta',
    name: 'ANCHIETA',
    flag: 'BRA',
  },
  {
    id: 'bra-angradosreis',
    name: 'ANGRA DOS REIS',
    flag: 'BRA',
  },
  {
    id: 'bra-apicum-acu',
    name: 'APICUM-ACU',
    flag: 'BRA',
  },
  {
    id: 'bra-aracaju',
    name: 'ARACAJU',
    flag: 'BRA',
  },
  {
    id: 'bra-aracati',
    name: 'ARACATI',
    flag: 'BRA',
  },
  {
    id: 'bra-aracruz',
    name: 'ARACRUZ',
    flag: 'BRA',
  },
  {
    id: 'bra-aratu',
    name: 'ARATU',
    flag: 'BRA',
  },
  {
    id: 'bra-areiabranca',
    name: 'AREIA BRANCA',
    flag: 'BRA',
  },
  {
    id: 'bra-arraialdocabo',
    name: 'ARRAIAL DO CABO',
    flag: 'BRA',
  },
  {
    id: 'bra-augustocorrea',
    name: 'AUGUSTO CORREA',
    flag: 'BRA',
  },
  {
    id: 'bra-baiaformosa',
    name: 'BAIA FORMOSA',
    flag: 'BRA',
  },
  {
    id: 'bra-balneariobarradosul',
    name: 'BALNEARIO BARRA DO SUL',
    flag: 'BRA',
  },
  {
    id: 'bra-beberibe',
    name: 'BEBERIBE',
    flag: 'BRA',
  },
  {
    id: 'bra-belem',
    name: 'BELEM',
    flag: 'BRA',
  },
  {
    id: 'bra-botafogo',
    name: 'BOTAFOGO',
    flag: 'BRA',
  },
  {
    id: 'bra-cabedelo',
    name: 'CABEDELO',
    flag: 'BRA',
  },
  {
    id: 'bra-cabofrio',
    name: 'CABO FRIO',
    flag: 'BRA',
  },
  {
    id: 'bra-calcoene',
    name: 'CALCOENE',
    flag: 'BRA',
  },
  {
    id: 'bra-camocim',
    name: 'CAMOCIM',
    flag: 'BRA',
  },
  {
    id: 'bra-camposbasin',
    name: 'CAMPOS BASIN',
    flag: 'BRA',
  },
  {
    id: 'bra-cananeia',
    name: 'CANANEIA',
    flag: 'BRA',
  },
  {
    id: 'bra-canavieiras',
    name: 'CANAVIEIRAS',
    flag: 'BRA',
  },
  {
    id: 'bra-caravelas',
    name: 'CARAVELAS',
    flag: 'BRA',
  },
  {
    id: 'bra-caucaia',
    name: 'CAUCAIA',
    flag: 'BRA',
  },
  {
    id: 'bra-curuca',
    name: 'CURUCA',
    flag: 'BRA',
  },
  {
    id: 'bra-fernandodenoronha',
    name: 'FERNANDO DE NORONHA',
    flag: 'BRA',
  },
  {
    id: 'bra-florianopolis',
    name: 'FLORIANOPOLIS',
    flag: 'BRA',
  },
  {
    id: 'bra-forno',
    name: 'FORNO',
    flag: 'BRA',
  },
  {
    id: 'bra-fortaleza',
    name: 'FORTALEZA',
    flag: 'BRA',
  },
  {
    id: 'bra-fpsocapixaba',
    name: 'FPSO CAPIXABA',
    flag: 'BRA',
  },
  {
    id: 'bra-fpsovitoria',
    name: 'FPSO VITORIA',
    flag: 'BRA',
  },
  {
    id: 'bra-fsomacae',
    name: 'FSO MACAE',
    flag: 'BRA',
  },
  {
    id: 'bra-garopaba',
    name: 'GAROPABA',
    flag: 'BRA',
  },
  {
    id: 'bra-gebig',
    name: 'GEBIG',
    flag: 'BRA',
  },
  {
    id: 'bra-governadorcelsoramos',
    name: 'GOVERNADOR CELSO RAMOS',
    flag: 'BRA',
  },
  {
    id: 'bra-guarapari',
    name: 'GUARAPARI',
    flag: 'BRA',
  },
  {
    id: 'bra-guaratuba',
    name: 'GUARATUBA',
    flag: 'BRA',
  },
  {
    id: 'bra-icoarachi',
    name: 'ICOARACHI',
    flag: 'BRA',
  },
  {
    id: 'bra-ilhabela',
    name: 'ILHABELA',
    flag: 'BRA',
  },
  {
    id: 'bra-ilhaguaiba',
    name: 'ILHA GUAIBA',
    flag: 'BRA',
  },
  {
    id: 'bra-ilheus',
    name: 'ILHEUS',
    flag: 'BRA',
  },
  {
    id: 'bra-imbituba',
    name: 'IMBITUBA',
    flag: 'BRA',
  },
  {
    id: 'bra-itaguai',
    name: 'ITAGUAI',
    flag: 'BRA',
  },
  {
    id: 'bra-itajai',
    name: 'ITAJAI',
    flag: 'BRA',
  },
  {
    id: 'bra-itapemirim',
    name: 'ITAPEMIRIM',
    flag: 'BRA',
  },
  {
    id: 'bra-itaqui',
    name: 'ITAQUI',
    flag: 'BRA',
  },
  {
    id: 'bra-itarema',
    name: 'ITAREMA',
    flag: 'BRA',
  },
  {
    id: 'bra-laguna',
    name: 'LAGUNA',
    flag: 'BRA',
  },
  {
    id: 'bra-luiscorreia',
    name: 'LUIS CORREIA',
    flag: 'BRA',
  },
  {
    id: 'bra-macae',
    name: 'MACAE',
    flag: 'BRA',
  },
  {
    id: 'bra-macapa',
    name: 'MACAPA',
    flag: 'BRA',
  },
  {
    id: 'bra-macapabayanchorage',
    name: 'MACAPA BAY ANCHORAGE',
    flag: 'BRA',
  },
  {
    id: 'bra-maceio',
    name: 'MACEIO',
    flag: 'BRA',
  },
  {
    id: 'bra-maragogi',
    name: 'MARAGOGI',
    flag: 'BRA',
  },
  {
    id: 'bra-marataizes',
    name: 'MARATAIZES',
    flag: 'BRA',
  },
  {
    id: 'bra-maxaranguape',
    name: 'MAXARANGUAPE',
    flag: 'BRA',
  },
  {
    id: 'bra-natal',
    name: 'NATAL',
    flag: 'BRA',
  },
  {
    id: 'bra-niteroi',
    name: 'NITEROI',
    flag: 'BRA',
  },
  {
    id: 'bra-oiapoque',
    name: 'OIAPOQUE',
    flag: 'BRA',
  },
  {
    id: 'bra-palhoca',
    name: 'PALHOCA',
    flag: 'BRA',
  },
  {
    id: 'bra-paracuru',
    name: 'PARACURU',
    flag: 'BRA',
  },
  {
    id: 'bra-paranagua',
    name: 'PARANAGUA',
    flag: 'BRA',
  },
  {
    id: 'bra-paraty',
    name: 'PARATY',
    flag: 'BRA',
  },
  {
    id: 'bra-passodetorres',
    name: 'PASSO DE TORRES',
    flag: 'BRA',
  },
  {
    id: 'bra-pecem',
    name: 'PECEM',
    flag: 'BRA',
  },
  {
    id: 'bra-penha',
    name: 'PENHA',
    flag: 'BRA',
  },
  {
    id: 'bra-piacabucu',
    name: 'PIACABUCU',
    flag: 'BRA',
  },
  {
    id: 'bra-piuma',
    name: 'PIUMA',
    flag: 'BRA',
  },
  {
    id: 'bra-portobelo',
    name: 'PORTO BELO',
    flag: 'BRA',
  },
  {
    id: 'bra-portocel',
    name: 'PORTOCEL',
    flag: 'BRA',
  },
  {
    id: 'bra-portodoacu',
    name: 'PORTO DO ACU',
    flag: 'BRA',
  },
  {
    id: 'bra-portodomangue',
    name: 'PORTO DO MANGUE',
    flag: 'BRA',
  },
  {
    id: 'bra-portoseguro',
    name: 'PORTO SEGURO',
    flag: 'BRA',
  },
  {
    id: 'bra-prado',
    name: 'PRADO',
    flag: 'BRA',
  },
  {
    id: 'bra-recife',
    name: 'RECIFE',
    flag: 'BRA',
  },
  {
    id: 'bra-riodejaneiro',
    name: 'RIO DE JANEIRO',
    flag: 'BRA',
  },
  {
    id: 'bra-riogrande',
    name: 'RIO GRANDE',
    flag: 'BRA',
  },
  {
    id: 'bra-salvador',
    name: 'SALVADOR',
    flag: 'BRA',
  },
  {
    id: 'bra-santana',
    name: 'SANTANA',
    flag: 'BRA',
  },
  {
    id: 'bra-santos',
    name: 'SANTOS',
    flag: 'BRA',
  },
  {
    id: 'bra-santosanchorage',
    name: 'SANTOS ANCHORAGE',
    flag: 'BRA',
  },
  {
    id: 'bra-santosbasin',
    name: 'SANTOS BASIN',
    flag: 'BRA',
  },
  {
    id: 'bra-saofranciscodosul',
    name: 'SAO FRANCISCO DO SUL',
    flag: 'BRA',
  },
  {
    id: 'bra-saogoncalo',
    name: 'SAO GONCALO',
    flag: 'BRA',
  },
  {
    id: 'bra-saojosedonorte',
    name: 'SAO JOSE DO NORTE',
    flag: 'BRA',
  },
  {
    id: 'bra-saoluis',
    name: 'SAO LUIS',
    flag: 'BRA',
  },
  {
    id: 'bra-saosebastiao',
    name: 'SAO SEBASTIAO',
    flag: 'BRA',
  },
  {
    id: 'bra-soure',
    name: 'SOURE',
    flag: 'BRA',
  },
  {
    id: 'bra-suape',
    name: 'SUAPE',
    flag: 'BRA',
  },
  {
    id: 'bra-termisa',
    name: 'TERMISA',
    flag: 'BRA',
  },
  {
    id: 'bra-tmib',
    name: 'TMIB',
    flag: 'BRA',
  },
  {
    id: 'bra-tramandaianchorage',
    name: 'TRAMANDAI ANCHORAGE',
    flag: 'BRA',
  },
  {
    id: 'bra-tubarao',
    name: 'TUBARAO',
    flag: 'BRA',
  },
  {
    id: 'bra-tutoia',
    name: 'TUTOIA',
    flag: 'BRA',
  },
  {
    id: 'bra-ubatuba',
    name: 'UBATUBA',
    flag: 'BRA',
  },
  {
    id: 'bra-ubu',
    name: 'UBU',
    flag: 'BRA',
  },
  {
    id: 'bra-vigia',
    name: 'VIGIA',
    flag: 'BRA',
  },
  {
    id: 'bra-viladoconde',
    name: 'VILA DO CONDE',
    flag: 'BRA',
  },
  {
    id: 'bra-vitoria',
    name: 'VITORIA',
    flag: 'BRA',
  },
  {
    id: 'can-argentia',
    name: 'ARGENTIA',
    flag: 'CAN',
  },
  {
    id: 'can-baybulls',
    name: 'BAY BULLS',
    flag: 'CAN',
  },
  {
    id: 'can-harborgrace',
    name: 'HARBOR GRACE',
    flag: 'CAN',
  },
  {
    id: "can-stjohn's",
    name: "ST JOHN'S",
    flag: 'CAN',
  },
  {
    id: 'chl-alfaro',
    name: 'ALFARO',
    flag: 'CHL',
  },
  {
    id: 'chl-amargos',
    name: 'AMARGOS',
    flag: 'CHL',
  },
  {
    id: 'chl-ancud',
    name: 'ANCUD',
    flag: 'CHL',
  },
  {
    id: 'chl-antofagasta',
    name: 'ANTOFAGASTA',
    flag: 'CHL',
  },
  {
    id: 'chl-arica',
    name: 'ARICA',
    flag: 'CHL',
  },
  {
    id: 'chl-astillero',
    name: 'ASTILLERO',
    flag: 'CHL',
  },
  {
    id: 'chl-bahiachilota&terminalpesqueroporvenir',
    name: 'BAHIA CHILOTA & TERMINAL PESQUERO PORVENIR',
    flag: 'CHL',
  },
  {
    id: 'chl-bahiaelcolorado',
    name: 'BAHIA EL COLORADO',
    flag: 'CHL',
  },
  {
    id: 'chl-bahiamansa',
    name: 'BAHIA MANSA',
    flag: 'CHL',
  },
  {
    id: 'chl-bahiamansa(puntaarenas)',
    name: 'BAHIA MANSA (PUNTA ARENAS)',
    flag: 'CHL',
  },
  {
    id: 'chl-buchupureo',
    name: 'BUCHUPUREO',
    flag: 'CHL',
  },
  {
    id: 'chl-calbuco-lavega',
    name: 'CALBUCO - LA VEGA',
    flag: 'CHL',
  },
  {
    id: 'chl-caldera',
    name: 'CALDERA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletaantofagasta',
    name: 'CALETA ANTOFAGASTA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletabolfin',
    name: 'CALETA BOLFIN',
    flag: 'CHL',
  },
  {
    id: 'chl-caletacamarones',
    name: 'CALETA CAMARONES',
    flag: 'CHL',
  },
  {
    id: 'chl-caletaconstitucion',
    name: 'CALETA CONSTITUCION',
    flag: 'CHL',
  },
  {
    id: 'chl-caletaindigena',
    name: 'CALETA INDIGENA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletalotabajo',
    name: 'CALETA LOTA BAJO',
    flag: 'CHL',
  },
  {
    id: 'chl-caletapaquica',
    name: 'CALETA PAQUICA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletaquiane',
    name: 'CALETA QUIANE',
    flag: 'CHL',
  },
  {
    id: 'chl-caletaurcu',
    name: 'CALETA URCU',
    flag: 'CHL',
  },
  {
    id: 'chl-camanchaca',
    name: 'CAMANCHACA',
    flag: 'CHL',
  },
  {
    id: 'chl-candelaria',
    name: 'CANDELARIA',
    flag: 'CHL',
  },
  {
    id: 'chl-cantera',
    name: 'CANTERA',
    flag: 'CHL',
  },
  {
    id: 'chl-caramucho',
    name: 'CARAMUCHO',
    flag: 'CHL',
  },
  {
    id: 'chl-carelmapu',
    name: 'CARELMAPU',
    flag: 'CHL',
  },
  {
    id: 'chl-chacao',
    name: 'CHACAO',
    flag: 'CHL',
  },
  {
    id: 'chl-chaiuin',
    name: 'CHAIUIN',
    flag: 'CHL',
  },
  {
    id: 'chl-chanaral',
    name: 'CHANARAL',
    flag: 'CHL',
  },
  {
    id: 'chl-chauman',
    name: 'CHAUMAN',
    flag: 'CHL',
  },
  {
    id: 'chl-chome',
    name: 'CHOME',
    flag: 'CHL',
  },
  {
    id: 'chl-chungungo',
    name: 'CHUNGUNGO',
    flag: 'CHL',
  },
  {
    id: 'chl-coliumo',
    name: 'COLIUMO',
    flag: 'CHL',
  },
  {
    id: 'chl-coquimbo',
    name: 'COQUIMBO',
    flag: 'CHL',
  },
  {
    id: 'chl-coquimbo&muelleaip&muellebracpesca&muellepescabel2',
    name: 'COQUIMBO & MUELLE AIP & MUELLE BRACPESCA & MUELLE PESCABEL 2',
    flag: 'CHL',
  },
  {
    id: 'chl-coronel',
    name: 'CORONEL',
    flag: 'CHL',
  },
  {
    id: 'chl-corpescamejillones',
    name: 'CORPESCA MEJILLONES',
    flag: 'CHL',
  },
  {
    id: 'chl-corral',
    name: 'CORRAL',
    flag: 'CHL',
  },
  {
    id: 'chl-curacodevelez',
    name: 'CURACO DE VELEZ',
    flag: 'CHL',
  },
  {
    id: 'chl-curanipe',
    name: 'CURANIPE',
    flag: 'CHL',
  },
  {
    id: 'chl-dalcahue',
    name: 'DALCAHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-duao',
    name: 'DUAO',
    flag: 'CHL',
  },
  {
    id: 'chl-elblanco',
    name: 'EL BLANCO',
    flag: 'CHL',
  },
  {
    id: 'chl-elcobre',
    name: 'EL COBRE',
    flag: 'CHL',
  },
  {
    id: 'chl-elfierro',
    name: 'EL FIERRO',
    flag: 'CHL',
  },
  {
    id: 'chl-elmanzano',
    name: 'EL MANZANO',
    flag: 'CHL',
  },
  {
    id: 'chl-elmembrillo',
    name: 'EL MEMBRILLO',
    flag: 'CHL',
  },
  {
    id: 'chl-elmorro',
    name: 'EL MORRO',
    flag: 'CHL',
  },
  {
    id: 'chl-elparron',
    name: 'EL PARRON',
    flag: 'CHL',
  },
  {
    id: 'chl-elpiojo',
    name: 'EL PIOJO',
    flag: 'CHL',
  },
  {
    id: 'chl-elsoldado',
    name: 'EL SOLDADO',
    flag: 'CHL',
  },
  {
    id: 'chl-farocorona',
    name: 'FARO CORONA',
    flag: 'CHL',
  },
  {
    id: 'chl-flamenco',
    name: 'FLAMENCO',
    flag: 'CHL',
  },
  {
    id: 'chl-guanaqueros',
    name: 'GUANAQUEROS',
    flag: 'CHL',
  },
  {
    id: 'chl-huasco',
    name: 'HUASCO',
    flag: 'CHL',
  },
  {
    id: 'chl-huiro',
    name: 'HUIRO',
    flag: 'CHL',
  },
  {
    id: 'chl-iquique',
    name: 'IQUIQUE',
    flag: 'CHL',
  },
  {
    id: 'chl-islacailin',
    name: 'ISLA CAILIN',
    flag: 'CHL',
  },
  {
    id: 'chl-islachidhuapi',
    name: 'ISLA CHIDHUAPI',
    flag: 'CHL',
  },
  {
    id: 'chl-isladelreysectorcarboneros',
    name: 'ISLA DEL REY SECTOR CARBONEROS',
    flag: 'CHL',
  },
  {
    id: 'chl-isladepascua',
    name: 'ISLA DE PASCUA',
    flag: 'CHL',
  },
  {
    id: 'chl-islaguar',
    name: 'ISLA GUAR',
    flag: 'CHL',
  },
  {
    id: 'chl-islahuapi-abtao',
    name: 'ISLA HUAPI-ABTAO',
    flag: 'CHL',
  },
  {
    id: 'chl-islamaillen',
    name: 'ISLA MAILLEN',
    flag: 'CHL',
  },
  {
    id: 'chl-islatabon',
    name: 'ISLA TABON',
    flag: 'CHL',
  },
  {
    id: 'chl-lacalera(islamocha)',
    name: 'LA CALERA (ISLA MOCHA)',
    flag: 'CHL',
  },
  {
    id: 'chl-lagunaverde',
    name: 'LAGUNA VERDE',
    flag: 'CHL',
  },
  {
    id: 'chl-lahacienda(islamocha)',
    name: 'LA HACIENDA (ISLA MOCHA)',
    flag: 'CHL',
  },
  {
    id: 'chl-laisla&lasmunecas&muellecalypso&muellecartagena&muelleetchepare(valdivia)&santaisabel&shivar',
    name: 'LA ISLA & LAS MUNECAS & MUELLE CALYPSO & MUELLE CARTAGENA & MUELLE ETCHEPARE (VALDIVIA) & SANTA ISABEL & SHIVAR',
    flag: 'CHL',
  },
  {
    id: 'chl-lascanteras',
    name: 'LAS CANTERAS',
    flag: 'CHL',
  },
  {
    id: 'chl-lebu&puertopesqueroartesanaldelebu&sectorvaraderolebu',
    name: 'LEBU & PUERTO PESQUERO ARTESANAL DE LEBU & SECTOR VARADERO LEBU',
    flag: 'CHL',
  },
  {
    id: 'chl-lin-lin',
    name: 'LIN-LIN',
    flag: 'CHL',
  },
  {
    id: 'chl-llico',
    name: 'LLICO',
    flag: 'CHL',
  },
  {
    id: 'chl-loncoyen',
    name: 'LONCOYEN',
    flag: 'CHL',
  },
  {
    id: 'chl-loscazones(islamocha)',
    name: 'LOS CAZONES (ISLA MOCHA)',
    flag: 'CHL',
  },
  {
    id: 'chl-losliles',
    name: 'LOS LILES',
    flag: 'CHL',
  },
  {
    id: 'chl-loslobos',
    name: 'LOS LOBOS',
    flag: 'CHL',
  },
  {
    id: 'chl-lospellines',
    name: 'LOS PELLINES',
    flag: 'CHL',
  },
  {
    id: 'chl-maguillines',
    name: 'MAGUILLINES',
    flag: 'CHL',
  },
  {
    id: 'chl-maicolpue',
    name: 'MAICOLPUE',
    flag: 'CHL',
  },
  {
    id: 'chl-maiquillahue',
    name: 'MAIQUILLAHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-mancera',
    name: 'MANCERA',
    flag: 'CHL',
  },
  {
    id: 'chl-mangapiko',
    name: 'MANGA PIKO',
    flag: 'CHL',
  },
  {
    id: 'chl-manquemapu',
    name: 'MANQUEMAPU',
    flag: 'CHL',
  },
  {
    id: 'chl-matadero(islamocha)',
    name: 'MATADERO (ISLA MOCHA)',
    flag: 'CHL',
  },
  {
    id: 'chl-maule',
    name: 'MAULE',
    flag: 'CHL',
  },
  {
    id: 'chl-mejillones',
    name: 'MEJILLONES',
    flag: 'CHL',
  },
  {
    id: 'chl-melinka',
    name: 'MELINKA',
    flag: 'CHL',
  },
  {
    id: 'chl-millongue',
    name: 'MILLONGUE',
    flag: 'CHL',
  },
  {
    id: 'chl-montemar',
    name: 'MONTEMAR',
    flag: 'CHL',
  },
  {
    id: 'chl-muellecaletacavancha',
    name: 'MUELLE CALETA CAVANCHA',
    flag: 'CHL',
  },
  {
    id: 'chl-muellecamanchaca',
    name: 'MUELLE CAMANCHACA',
    flag: 'CHL',
  },
  {
    id: 'chl-muellecoquimboii',
    name: 'MUELLE  COQUIMBO II',
    flag: 'CHL',
  },
  {
    id: 'chl-muelleestero,puertomelinka',
    name: 'MUELLE ESTERO, PUERTO MELINKA',
    flag: 'CHL',
  },
  {
    id: 'chl-muelleorizoncoquimbo',
    name: 'MUELLE ORIZON COQUIMBO',
    flag: 'CHL',
  },
  {
    id: 'chl-muelletaltal',
    name: 'MUELLE TALTAL',
    flag: 'CHL',
  },
  {
    id: 'chl-muelletortel',
    name: 'MUELLE TORTEL',
    flag: 'CHL',
  },
  {
    id: 'chl-obispito',
    name: 'OBISPITO',
    flag: 'CHL',
  },
  {
    id: 'chl-papagayo',
    name: 'PAPAGAYO',
    flag: 'CHL',
  },
  {
    id: 'chl-papudo',
    name: 'PAPUDO',
    flag: 'CHL',
  },
  {
    id: 'chl-pargua',
    name: 'PARGUA',
    flag: 'CHL',
  },
  {
    id: 'chl-patache',
    name: 'PATACHE',
    flag: 'CHL',
  },
  {
    id: 'chl-patillos',
    name: 'PATILLOS',
    flag: 'CHL',
  },
  {
    id: 'chl-pelluhue',
    name: 'PELLUHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-perone',
    name: 'PERONE',
    flag: 'CHL',
  },
  {
    id: 'chl-pichibudi',
    name: 'PICHIBUDI',
    flag: 'CHL',
  },
  {
    id: 'chl-pichilemu',
    name: 'PICHILEMU',
    flag: 'CHL',
  },
  {
    id: 'chl-playapichicullin',
    name: 'PLAYA PICHICULLIN',
    flag: 'CHL',
  },
  {
    id: 'chl-playarosada',
    name: 'PLAYA ROSADA',
    flag: 'CHL',
  },
  {
    id: 'chl-pollollo',
    name: 'POLLOLLO',
    flag: 'CHL',
  },
  {
    id: 'chl-portaguirre',
    name: 'PORT AGUIRRE',
    flag: 'CHL',
  },
  {
    id: 'chl-puertecillo',
    name: 'PUERTECILLO',
    flag: 'CHL',
  },
  {
    id: 'chl-puertoaldea(hornilla)',
    name: 'PUERTO ALDEA (HORNILLA)',
    flag: 'CHL',
  },
  {
    id: 'chl-puertochacabuco',
    name: 'PUERTO CHACABUCO',
    flag: 'CHL',
  },
  {
    id: 'chl-puertochincui',
    name: 'PUERTO CHINCUI',
    flag: 'CHL',
  },
  {
    id: 'chl-puertoinlges',
    name: 'PUERTO INLGES',
    flag: 'CHL',
  },
  {
    id: 'chl-puertomontt',
    name: 'PUERTO MONTT',
    flag: 'CHL',
  },
  {
    id: 'chl-puertonortei.santamaria',
    name: 'PUERTO NORTE I. SANTA MARIA',
    flag: 'CHL',
  },
  {
    id: 'chl-puertonuevo',
    name: 'PUERTO NUEVO',
    flag: 'CHL',
  },
  {
    id: 'chl-puertosuri.santamaria',
    name: 'PUERTO SUR I. SANTA MARIA',
    flag: 'CHL',
  },
  {
    id: 'chl-puertowilliams',
    name: 'PUERTO WILLIAMS',
    flag: 'CHL',
  },
  {
    id: 'chl-puntaarenas',
    name: 'PUNTA ARENAS',
    flag: 'CHL',
  },
  {
    id: 'chl-puntachilen',
    name: 'PUNTA CHILEN',
    flag: 'CHL',
  },
  {
    id: 'chl-puntachungo',
    name: 'PUNTA CHUNGO',
    flag: 'CHL',
  },
  {
    id: 'chl-puntalavapie',
    name: 'PUNTA LAVAPIE',
    flag: 'CHL',
  },
  {
    id: 'chl-quellon',
    name: 'QUELLON',
    flag: 'CHL',
  },
  {
    id: 'chl-quintero',
    name: 'QUINTERO',
    flag: 'CHL',
  },
  {
    id: 'chl-rioinio',
    name: 'RIO INIO',
    flag: 'CHL',
  },
  {
    id: 'chl-riomaule',
    name: 'RIO MAULE',
    flag: 'CHL',
  },
  {
    id: 'chl-rioseco',
    name: 'RIO SECO',
    flag: 'CHL',
  },
  {
    id: 'chl-rumena',
    name: 'RUMENA',
    flag: 'CHL',
  },
  {
    id: 'chl-sanambrosio',
    name: 'SAN AMBROSIO',
    flag: 'CHL',
  },
  {
    id: 'chl-sanantonio',
    name: 'SAN ANTONIO',
    flag: 'CHL',
  },
  {
    id: 'chl-sanignacio',
    name: 'SAN IGNACIO',
    flag: 'CHL',
  },
  {
    id: 'chl-sanjose',
    name: 'SAN JOSE',
    flag: 'CHL',
  },
  {
    id: 'chl-sanjosedetranqui',
    name: 'SAN JOSE DE TRANQUI',
    flag: 'CHL',
  },
  {
    id: 'chl-sanpedro',
    name: 'SAN PEDRO',
    flag: 'CHL',
  },
  {
    id: 'chl-sanrafael',
    name: 'SAN RAFAEL',
    flag: 'CHL',
  },
  {
    id: 'chl-sanramon',
    name: 'SAN RAMON',
    flag: 'CHL',
  },
  {
    id: 'chl-sanvicente',
    name: 'SAN VICENTE',
    flag: 'CHL',
  },
  {
    id: 'chl-sectorminacosta',
    name: 'SECTOR MINA COSTA',
    flag: 'CHL',
  },
  {
    id: 'chl-talcahuano',
    name: 'TALCAHUANO',
    flag: 'CHL',
  },
  {
    id: 'chl-talcahuano,sectorlapoza',
    name: 'TALCAHUANO, SECTOR LA POZA',
    flag: 'CHL',
  },
  {
    id: 'chl-tenaun',
    name: 'TENAUN',
    flag: 'CHL',
  },
  {
    id: 'chl-terminalpesquerodeniebla',
    name: 'TERMINAL PESQUERO DE NIEBLA',
    flag: 'CHL',
  },
  {
    id: 'chl-terminalpesqueropuertonatales',
    name: 'TERMINAL PESQUERO PUERTO NATALES',
    flag: 'CHL',
  },
  {
    id: 'chl-tocopilla',
    name: 'TOCOPILLA',
    flag: 'CHL',
  },
  {
    id: 'chl-tresespinos',
    name: 'TRES ESPINOS',
    flag: 'CHL',
  },
  {
    id: 'chl-tumbes',
    name: 'TUMBES',
    flag: 'CHL',
  },
  {
    id: 'chl-valparaiso',
    name: 'VALPARAISO',
    flag: 'CHL',
  },
  {
    id: 'chl-villapuertoeden',
    name: 'VILLA PUERTO EDEN',
    flag: 'CHL',
  },
  {
    id: 'chl-yana',
    name: 'YANA',
    flag: 'CHL',
  },
  {
    id: 'chl-yuste',
    name: 'YUSTE',
    flag: 'CHL',
  },
  {
    id: 'chn-changqitou',
    name: 'CHANGQITOU',
    flag: 'CHN',
  },
  {
    id: 'chn-changxingdao',
    name: 'CHANGXINGDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-daishancounty',
    name: 'DAISHAN COUNTY',
    flag: 'CHN',
  },
  {
    id: 'chn-dalian',
    name: 'DALIAN',
    flag: 'CHN',
  },
  {
    id: 'chn-dayushanisland',
    name: 'DAYUSHAN ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-dongjiakou',
    name: 'DONGJIAKOU',
    flag: 'CHN',
  },
  {
    id: 'chn-dongshan',
    name: 'DONGSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-fangcheng',
    name: 'FANGCHENG',
    flag: 'CHN',
  },
  {
    id: 'chn-fuzhou',
    name: 'FUZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-guangzhou',
    name: 'GUANGZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-guishan',
    name: 'GUISHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-hongkong',
    name: 'HONGKONG',
    flag: 'CHN',
  },
  {
    id: 'chn-huangpu',
    name: 'HUANGPU',
    flag: 'CHN',
  },
  {
    id: 'chn-lammaisland',
    name: 'LAMMA ISLAND',
    flag: 'CHN',
  },
  {
    id: 'chn-lianjiang',
    name: 'LIANJIANG',
    flag: 'CHN',
  },
  {
    id: 'chn-lianyungang',
    name: 'LIANYUNGANG',
    flag: 'CHN',
  },
  {
    id: 'chn-liuheng',
    name: 'LIUHENG',
    flag: 'CHN',
  },
  {
    id: 'chn-longyan',
    name: 'LONGYAN',
    flag: 'CHN',
  },
  {
    id: 'chn-ningbo',
    name: 'NINGBO',
    flag: 'CHN',
  },
  {
    id: 'chn-ningde',
    name: 'NINGDE',
    flag: 'CHN',
  },
  {
    id: 'chn-penglai',
    name: 'PENGLAI',
    flag: 'CHN',
  },
  {
    id: 'chn-qingdao',
    name: 'QINGDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-quanzhou',
    name: 'QUANZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-shanghai',
    name: 'SHANGHAI',
    flag: 'CHN',
  },
  {
    id: 'chn-shenzhen',
    name: 'SHENZHEN',
    flag: 'CHN',
  },
  {
    id: 'chn-shidao',
    name: 'SHIDAO',
    flag: 'CHN',
  },
  {
    id: 'chn-taizhou',
    name: 'TAIZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-tianjin',
    name: 'TIANJIN',
    flag: 'CHN',
  },
  {
    id: 'chn-xiamen',
    name: 'XIAMEN',
    flag: 'CHN',
  },
  {
    id: 'chn-yantai',
    name: 'YANTAI',
    flag: 'CHN',
  },
  {
    id: 'chn-zhangzhou',
    name: 'ZHANGZHOU',
    flag: 'CHN',
  },
  {
    id: 'chn-zhoushan',
    name: 'ZHOUSHAN',
    flag: 'CHN',
  },
  {
    id: 'chn-zoushan',
    name: 'ZOUSHAN',
    flag: 'CHN',
  },
  {
    id: 'civ-abidjan',
    name: 'ABIDJAN',
    flag: 'CIV',
  },
  {
    id: 'civ-baobabmarineterminal',
    name: 'BAOBAB MARINE TERMINAL',
    flag: 'CIV',
  },
  {
    id: 'civ-portbouetanchorage',
    name: 'PORT BOUET ANCHORAGE',
    flag: 'CIV',
  },
  {
    id: 'civ-sanpedro',
    name: 'SAN PEDRO',
    flag: 'CIV',
  },
  {
    id: 'cmr-douala',
    name: 'DOUALA',
    flag: 'CMR',
  },
  {
    id: 'cod-boma',
    name: 'BOMA',
    flag: 'COD',
  },
  {
    id: 'cod-matadi',
    name: 'MATADI',
    flag: 'COD',
  },
  {
    id: 'cog-pointenoire',
    name: 'POINTE NOIRE',
    flag: 'COG',
  },
  {
    id: 'col-barranquilla',
    name: 'BARRANQUILLA',
    flag: 'COL',
  },
  {
    id: 'col-buenaventura',
    name: 'BUENAVENTURA',
    flag: 'COL',
  },
  {
    id: 'col-cartagena',
    name: 'CARTAGENA',
    flag: 'COL',
  },
  {
    id: 'col-santamarta',
    name: 'SANTA MARTA',
    flag: 'COL',
  },
  {
    id: 'col-tumaco',
    name: 'TUMACO',
    flag: 'COL',
  },
  {
    id: 'col-tumacoanchorage',
    name: 'TUMACO ANCHORAGE',
    flag: 'COL',
  },
  {
    id: 'col-turbo',
    name: 'TURBO',
    flag: 'COL',
  },
  {
    id: 'com-moroni',
    name: 'MORONI',
    flag: 'COM',
  },
  {
    id: 'cpv-mindelo',
    name: 'MINDELO',
    flag: 'CPV',
  },
  {
    id: 'cpv-palmeira',
    name: 'PALMEIRA',
    flag: 'CPV',
  },
  {
    id: 'cpv-praia',
    name: 'PRAIA',
    flag: 'CPV',
  },
  {
    id: 'cri-caldera',
    name: 'CALDERA',
    flag: 'CRI',
  },
  {
    id: 'cri-cocosisland',
    name: 'COCOS ISLAND',
    flag: 'CRI',
  },
  {
    id: 'cri-cuajiniquil',
    name: 'CUAJINIQUIL',
    flag: 'CRI',
  },
  {
    id: 'cri-golfito',
    name: 'GOLFITO',
    flag: 'CRI',
  },
  {
    id: 'cri-limon',
    name: 'LIMON',
    flag: 'CRI',
  },
  {
    id: 'cri-playadelcoco',
    name: 'PLAYA DEL COCO',
    flag: 'CRI',
  },
  {
    id: 'cri-puntaarenas',
    name: 'PUNTAARENAS',
    flag: 'CRI',
  },
  {
    id: 'cri-puntarenas',
    name: 'PUNTARENAS',
    flag: 'CRI',
  },
  {
    id: 'cri-quepos',
    name: 'QUEPOS',
    flag: 'CRI',
  },
  {
    id: 'cub-havana',
    name: 'HAVANA',
    flag: 'CUB',
  },
  {
    id: 'cub-santiagodecuba',
    name: 'SANTIAGO DE CUBA',
    flag: 'CUB',
  },
  {
    id: 'cuw-willemstad',
    name: 'WILLEMSTAD',
    flag: 'CUW',
  },
  {
    id: 'deu-bremerhaven',
    name: 'BREMERHAVEN',
    flag: 'DEU',
  },
  {
    id: 'deu-bremerhavenanchorage',
    name: 'BREMERHAVEN ANCHORAGE',
    flag: 'DEU',
  },
  {
    id: 'deu-cuxhaven',
    name: 'CUXHAVEN',
    flag: 'DEU',
  },
  {
    id: 'dnk-esbjerg',
    name: 'ESBJERG',
    flag: 'DNK',
  },
  {
    id: 'dnk-frederikshavn',
    name: 'FREDERIKSHAVN',
    flag: 'DNK',
  },
  {
    id: 'dnk-hanstholm',
    name: 'HANSTHOLM',
    flag: 'DNK',
  },
  {
    id: 'dnk-helsingor',
    name: 'HELSINGOR',
    flag: 'DNK',
  },
  {
    id: 'dnk-hirtshals',
    name: 'HIRTSHALS',
    flag: 'DNK',
  },
  {
    id: 'dnk-hvidesande',
    name: 'HVIDE SANDE',
    flag: 'DNK',
  },
  {
    id: 'dnk-kalundborg',
    name: 'KALUNDBORG',
    flag: 'DNK',
  },
  {
    id: 'dnk-lemvig',
    name: 'LEMVIG',
    flag: 'DNK',
  },
  {
    id: 'dnk-skagen',
    name: 'SKAGEN',
    flag: 'DNK',
  },
  {
    id: 'dnk-strandby',
    name: 'STRANDBY',
    flag: 'DNK',
  },
  {
    id: 'dnk-thyboron',
    name: 'THYBORON',
    flag: 'DNK',
  },
  {
    id: 'dza-alger',
    name: 'ALGER',
    flag: 'DZA',
  },
  {
    id: 'dza-mostaganem',
    name: 'MOSTAGANEM',
    flag: 'DZA',
  },
  {
    id: 'dza-oran',
    name: 'ORAN',
    flag: 'DZA',
  },
  {
    id: 'ecu-ayoraanchorage',
    name: 'AYORA ANCHORAGE',
    flag: 'ECU',
  },
  {
    id: 'ecu-baltra',
    name: 'BALTRA',
    flag: 'ECU',
  },
  {
    id: 'ecu-baquerizomoreno',
    name: 'BAQUERIZO MORENO',
    flag: 'ECU',
  },
  {
    id: 'ecu-desembarcaderochanduy',
    name: 'DESEMBARCADERO CHANDUY',
    flag: 'ECU',
  },
  {
    id: 'ecu-desembarcaderoplayitamia',
    name: 'DESEMBARCADERO PLAYITA MIA',
    flag: 'ECU',
  },
  {
    id: 'ecu-desembarcaderosalango',
    name: 'DESEMBARCADERO SALANGO',
    flag: 'ECU',
  },
  {
    id: 'ecu-douglas',
    name: 'DOUGLAS',
    flag: 'ECU',
  },
  {
    id: 'ecu-esmeraldas',
    name: 'ESMERALDAS',
    flag: 'ECU',
  },
  {
    id: 'ecu-facilidadpesqueradesantarosa',
    name: 'FACILIDAD PESQUERA DE SANTA ROSA',
    flag: 'ECU',
  },
  {
    id: 'ecu-genovesa',
    name: 'GENOVESA',
    flag: 'ECU',
  },
  {
    id: 'ecu-guayaquil',
    name: 'GUAYAQUIL',
    flag: 'ECU',
  },
  {
    id: 'ecu-lalibertad',
    name: 'LA LIBERTAD',
    flag: 'ECU',
  },
  {
    id: 'ecu-manta',
    name: 'MANTA',
    flag: 'ECU',
  },
  {
    id: 'ecu-posorja',
    name: 'POSORJA',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertoastiesmar',
    name: 'PUERTO ASTIESMAR',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertoatungrupoph',
    name: 'PUERTO ATUN GRUPO PH',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertoayora',
    name: 'PUERTO AYORA',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertobolivar',
    name: 'PUERTO BOLIVAR',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertodemanta',
    name: 'PUERTO DE MANTA',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertolalibertad',
    name: 'PUERTO LA LIBERTAD',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertopesqueroanconcito',
    name: 'PUERTO PESQUERO ANCONCITO',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertopesquerodecrucita',
    name: 'PUERTO PESQUERO DE CRUCITA',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertopesquerodeesmeraldas',
    name: 'PUERTO PESQUERO DE ESMERALDAS',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertopesquerodejaramijo',
    name: 'PUERTO PESQUERO DE JARAMIJO',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertopesquerodepuertolopez',
    name: 'PUERTO PESQUERO DE PUERTO LOPEZ',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertopesquerodesanmateo',
    name: 'PUERTO PESQUERO DE SAN MATEO',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertopesqueroelmorro',
    name: 'PUERTO PESQUERO  EL MORRO',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertopesqueroposorja',
    name: 'PUERTO PESQUERO POSORJA',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertopesqueropuertobolivar',
    name: 'PUERTO PESQUERO PUERTO BOLIVAR',
    flag: 'ECU',
  },
  {
    id: 'ecu-puertovillamil',
    name: 'PUERTO VILLAMIL',
    flag: 'ECU',
  },
  {
    id: 'ecu-puntaarenas',
    name: 'PUNTA ARENAS',
    flag: 'ECU',
  },
  {
    id: 'ecu-sanlorenzo',
    name: 'SAN LORENZO',
    flag: 'ECU',
  },
  {
    id: 'egy-portsaid',
    name: 'PORT SAID',
    flag: 'EGY',
  },
  {
    id: 'egy-suezcanal',
    name: 'SUEZ CANAL',
    flag: 'EGY',
  },
  {
    id: 'egy-suezsouthanchorage',
    name: 'SUEZ SOUTH ANCHORAGE',
    flag: 'EGY',
  },
  {
    id: 'esh-dakhla',
    name: 'DAKHLA',
    flag: 'ESH',
  },
  {
    id: 'esp-algeciras',
    name: 'ALGECIRAS',
    flag: 'ESP',
  },
  {
    id: 'esp-bancodelhoyoanchorage',
    name: 'BANCO DEL HOYO ANCHORAGE',
    flag: 'ESP',
  },
  {
    id: 'esp-barbate',
    name: 'BARBATE',
    flag: 'ESP',
  },
  {
    id: 'esp-cadiz',
    name: 'CADIZ',
    flag: 'ESP',
  },
  {
    id: 'esp-campamento',
    name: 'CAMPAMENTO',
    flag: 'ESP',
  },
  {
    id: 'esp-cangas',
    name: 'CANGAS',
    flag: 'ESP',
  },
  {
    id: 'esp-cartagena',
    name: 'CARTAGENA',
    flag: 'ESP',
  },
  {
    id: 'esp-cueta',
    name: 'CUETA',
    flag: 'ESP',
  },
  {
    id: 'esp-isladearosa',
    name: 'ISLA DE AROSA',
    flag: 'ESP',
  },
  {
    id: "esp-l'ametllademar",
    name: "L'AMETLLA DE MAR",
    flag: 'ESP',
  },
  {
    id: 'esp-laspalmas',
    name: 'LAS PALMAS',
    flag: 'ESP',
  },
  {
    id: 'esp-marin',
    name: 'MARIN',
    flag: 'ESP',
  },
  {
    id: 'esp-pasajes',
    name: 'PASAJES',
    flag: 'ESP',
  },
  {
    id: 'esp-pobradocaraminal',
    name: 'POBRA DO CARAMINAL',
    flag: 'ESP',
  },
  {
    id: 'esp-puertodesanadrian',
    name: 'PUERTO DE SAN ADRIAN',
    flag: 'ESP',
  },
  {
    id: 'esp-santander',
    name: 'SANTANDER',
    flag: 'ESP',
  },
  {
    id: 'esp-santauxiaribeira',
    name: 'SANTA UXIA RIBEIRA',
    flag: 'ESP',
  },
  {
    id: 'esp-tenerife',
    name: 'TENERIFE',
    flag: 'ESP',
  },
  {
    id: 'esp-vigo',
    name: 'VIGO',
    flag: 'ESP',
  },
  {
    id: 'esp-villagarciaanchorage',
    name: 'VILLAGARCIA ANCHORAGE',
    flag: 'ESP',
  },
  {
    id: 'est-tallinn',
    name: 'TALLINN',
    flag: 'EST',
  },
  {
    id: 'fin-loviisa',
    name: 'LOVIISA',
    flag: 'FIN',
  },
  {
    id: 'fin-raahe',
    name: 'RAAHE',
    flag: 'FIN',
  },
  {
    id: 'fin-roytta',
    name: 'ROYTTA',
    flag: 'FIN',
  },
  {
    id: 'fin-veitsiluoto',
    name: 'VEITSILUOTO',
    flag: 'FIN',
  },
  {
    id: 'fji-lautoka',
    name: 'LAUTOKA',
    flag: 'FJI',
  },
  {
    id: 'fji-levuka',
    name: 'LEVUKA',
    flag: 'FJI',
  },
  {
    id: 'fji-suva',
    name: 'SUVA',
    flag: 'FJI',
  },
  {
    id: 'flk-berkeleysound',
    name: 'BERKELEY SOUND',
    flag: 'FLK',
  },
  {
    id: 'flk-stanley',
    name: 'STANLEY',
    flag: 'FLK',
  },
  {
    id: 'fra-brest',
    name: 'BREST',
    flag: 'FRA',
  },
  {
    id: 'fro-fuglafjordur',
    name: 'FUGLAFJORDUR',
    flag: 'FRO',
  },
  {
    id: 'fro-klaksvik',
    name: 'KLAKSVIK',
    flag: 'FRO',
  },
  {
    id: 'fro-kollafjord',
    name: 'KOLLAFJORD',
    flag: 'FRO',
  },
  {
    id: 'fro-leirvik',
    name: 'LEIRVIK',
    flag: 'FRO',
  },
  {
    id: 'fro-midvagur',
    name: 'MIDVAGUR',
    flag: 'FRO',
  },
  {
    id: 'fro-runavik',
    name: 'RUNAVIK',
    flag: 'FRO',
  },
  {
    id: 'fro-strendur',
    name: 'STRENDUR',
    flag: 'FRO',
  },
  {
    id: 'fro-toftir',
    name: 'TOFTIR',
    flag: 'FRO',
  },
  {
    id: 'fro-torshavn',
    name: 'TORSHAVN',
    flag: 'FRO',
  },
  {
    id: 'fro-tvoroyri',
    name: 'TVOROYRI',
    flag: 'FRO',
  },
  {
    id: 'fro-vagur',
    name: 'VAGUR',
    flag: 'FRO',
  },
  {
    id: 'fsm-colonia',
    name: 'COLONIA',
    flag: 'FSM',
  },
  {
    id: 'fsm-kosrae',
    name: 'KOSRAE',
    flag: 'FSM',
  },
  {
    id: 'fsm-pohnpei',
    name: 'POHNPEI',
    flag: 'FSM',
  },
  {
    id: 'gab-owendo',
    name: 'OWENDO',
    flag: 'GAB',
  },
  {
    id: 'gab-portgentil',
    name: 'PORT GENTIL',
    flag: 'GAB',
  },
  {
    id: 'gbr-aberdeen',
    name: 'ABERDEEN',
    flag: 'GBR',
  },
  {
    id: 'gbr-cromarty',
    name: 'CROMARTY',
    flag: 'GBR',
  },
  {
    id: 'gbr-dumbartonfield',
    name: 'DUMBARTON FIELD',
    flag: 'GBR',
  },
  {
    id: 'gbr-fraserburgh',
    name: 'FRASERBURGH',
    flag: 'GBR',
  },
  {
    id: 'gbr-hull',
    name: 'HULL',
    flag: 'GBR',
  },
  {
    id: 'gbr-immingham',
    name: 'IMMINGHAM',
    flag: 'GBR',
  },
  {
    id: 'gbr-kirkwall',
    name: 'KIRKWALL',
    flag: 'GBR',
  },
  {
    id: 'gbr-lerwick',
    name: 'LERWICK',
    flag: 'GBR',
  },
  {
    id: 'gbr-londonderryanchorage',
    name: 'LONDONDERRY ANCHORAGE',
    flag: 'GBR',
  },
  {
    id: 'gbr-marinerfield',
    name: 'MARINER FIELD',
    flag: 'GBR',
  },
  {
    id: 'gbr-peterhead',
    name: 'PETERHEAD',
    flag: 'GBR',
  },
  {
    id: 'gbr-scalloway',
    name: 'SCALLOWAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-scrabster',
    name: 'SCRABSTER',
    flag: 'GBR',
  },
  {
    id: 'gbr-stornoway',
    name: 'STORNOWAY',
    flag: 'GBR',
  },
  {
    id: 'gbr-tyne',
    name: 'TYNE',
    flag: 'GBR',
  },
  {
    id: 'gbr-yarmouth',
    name: 'YARMOUTH',
    flag: 'GBR',
  },
  {
    id: 'gha-sekondi-takoradi',
    name: 'SEKONDI-TAKORADI',
    flag: 'GHA',
  },
  {
    id: 'gha-tema',
    name: 'TEMA',
    flag: 'GHA',
  },
  {
    id: 'gin-conakry',
    name: 'CONAKRY',
    flag: 'GIN',
  },
  {
    id: 'glp-pointeapitre',
    name: 'POINTE A PITRE',
    flag: 'GLP',
  },
  {
    id: 'gmb-banjul',
    name: 'BANJUL',
    flag: 'GMB',
  },
  {
    id: 'gnb-bissau',
    name: 'BISSAU',
    flag: 'GNB',
  },
  {
    id: 'gnq-bata',
    name: 'BATA',
    flag: 'GNQ',
  },
  {
    id: 'gnq-malabo',
    name: 'MALABO',
    flag: 'GNQ',
  },
  {
    id: 'grc-elafonisos',
    name: 'ELAFONISOS',
    flag: 'GRC',
  },
  {
    id: 'grc-heraklio',
    name: 'HERAKLIO',
    flag: 'GRC',
  },
  {
    id: 'grc-kalamata',
    name: 'KALAMATA',
    flag: 'GRC',
  },
  {
    id: 'grc-lavrion',
    name: 'LAVRION',
    flag: 'GRC',
  },
  {
    id: 'grc-piraeus',
    name: 'PIRAEUS',
    flag: 'GRC',
  },
  {
    id: 'grd-stgeorges',
    name: 'ST GEORGES',
    flag: 'GRD',
  },
  {
    id: 'grl-aasiaat',
    name: 'AASIAAT',
    flag: 'GRL',
  },
  {
    id: 'grl-ilulissat',
    name: 'ILULISSAT',
    flag: 'GRL',
  },
  {
    id: 'grl-maniitsoq',
    name: 'MANIITSOQ',
    flag: 'GRL',
  },
  {
    id: 'grl-nanortalik',
    name: 'NANORTALIK',
    flag: 'GRL',
  },
  {
    id: 'grl-nuuk',
    name: 'NUUK',
    flag: 'GRL',
  },
  {
    id: 'grl-paamuit',
    name: 'PAAMUIT',
    flag: 'GRL',
  },
  {
    id: 'grl-qaqurtoq',
    name: 'QAQURTOQ',
    flag: 'GRL',
  },
  {
    id: 'grl-qeqertarsuaq',
    name: 'QEQERTARSUAQ',
    flag: 'GRL',
  },
  {
    id: 'grl-sisimiut',
    name: 'SISIMIUT',
    flag: 'GRL',
  },
  {
    id: 'gtm-puertobarrios',
    name: 'PUERTO BARRIOS',
    flag: 'GTM',
  },
  {
    id: 'gtm-puertoquetzal',
    name: 'PUERTO QUETZAL',
    flag: 'GTM',
  },
  {
    id: 'guy-georgetown',
    name: 'GEORGETOWN',
    flag: 'GUY',
  },
  {
    id: 'hnd-frenchharbor',
    name: 'FRENCH HARBOR',
    flag: 'HND',
  },
  {
    id: 'hnd-puertocastilla',
    name: 'PUERTO CASTILLA',
    flag: 'HND',
  },
  {
    id: 'hrv-kali',
    name: 'KALI',
    flag: 'HRV',
  },
  {
    id: 'hrv-split',
    name: 'SPLIT',
    flag: 'HRV',
  },
  {
    id: 'hrv-zadar',
    name: 'ZADAR',
    flag: 'HRV',
  },
  {
    id: 'idn-ambon',
    name: 'AMBON',
    flag: 'IDN',
  },
  {
    id: 'idn-batam',
    name: 'BATAM',
    flag: 'IDN',
  },
  {
    id: 'idn-benoa',
    name: 'BENOA',
    flag: 'IDN',
  },
  {
    id: 'idn-bitung',
    name: 'BITUNG',
    flag: 'IDN',
  },
  {
    id: 'idn-jakarta',
    name: 'JAKARTA',
    flag: 'IDN',
  },
  {
    id: 'idn-karimun',
    name: 'KARIMUN',
    flag: 'IDN',
  },
  {
    id: 'idn-nipahanchorage',
    name: 'NIPAH ANCHORAGE',
    flag: 'IDN',
  },
  {
    id: 'idn-suralaya',
    name: 'SURALAYA',
    flag: 'IDN',
  },
  {
    id: 'ind-bhavnagarnewport',
    name: 'BHAVNAGAR NEW PORT',
    flag: 'IND',
  },
  {
    id: 'ind-kakinada',
    name: 'KAKINADA',
    flag: 'IND',
  },
  {
    id: 'irl-bereisland',
    name: 'BERE ISLAND',
    flag: 'IRL',
  },
  {
    id: 'irl-castletownbearhaven',
    name: 'CASTLETOWN BEARHAVEN',
    flag: 'IRL',
  },
  {
    id: 'irl-galway',
    name: 'GALWAY',
    flag: 'IRL',
  },
  {
    id: 'irl-killybegs',
    name: 'KILLYBEGS',
    flag: 'IRL',
  },
  {
    id: 'irn-bushehr',
    name: 'BUSHEHR',
    flag: 'IRN',
  },
  {
    id: 'isl-akranes',
    name: 'AKRANES',
    flag: 'ISL',
  },
  {
    id: 'isl-akureyri',
    name: 'AKUREYRI',
    flag: 'ISL',
  },
  {
    id: 'isl-bolungarvik',
    name: 'BOLUNGARVIK',
    flag: 'ISL',
  },
  {
    id: 'isl-eskifjordur',
    name: 'ESKIFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'isl-faskrudsfjordur',
    name: 'FASKRUDSFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'isl-grindavik',
    name: 'GRINDAVIK',
    flag: 'ISL',
  },
  {
    id: 'isl-grundarfjordur',
    name: 'GRUNDARFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'isl-hafnarfjordur',
    name: 'HAFNARFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'isl-isafjordur',
    name: 'ISAFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'isl-keflavik',
    name: 'KEFLAVIK',
    flag: 'ISL',
  },
  {
    id: 'isl-kopasker',
    name: 'KOPASKER',
    flag: 'ISL',
  },
  {
    id: 'isl-neskaupstadur',
    name: 'NESKAUPSTADUR',
    flag: 'ISL',
  },
  {
    id: 'isl-porshofn',
    name: 'PORSHOFN',
    flag: 'ISL',
  },
  {
    id: 'isl-raufarhofn',
    name: 'RAUFARHOFN',
    flag: 'ISL',
  },
  {
    id: 'isl-reydarfjordur',
    name: 'REYDARFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'isl-reykjavik',
    name: 'REYKJAVIK',
    flag: 'ISL',
  },
  {
    id: 'isl-saudarkrokur',
    name: 'SAUDARKROKUR',
    flag: 'ISL',
  },
  {
    id: 'isl-seydisfjordur',
    name: 'SEYDISFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'isl-stodvarfjordur',
    name: 'STODVARFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'isl-vestmannaeyjar',
    name: 'VESTMANNAEYJAR',
    flag: 'ISL',
  },
  {
    id: 'isl-vopnafjordur',
    name: 'VOPNAFJORDUR',
    flag: 'ISL',
  },
  {
    id: 'jam-kingston',
    name: 'KINGSTON',
    flag: 'JAM',
  },
  {
    id: 'jpn-abashiri',
    name: 'ABASHIRI',
    flag: 'JPN',
  },
  {
    id: 'jpn-hachinohe',
    name: 'HACHINOHE',
    flag: 'JPN',
  },
  {
    id: 'jpn-hakata',
    name: 'HAKATA',
    flag: 'JPN',
  },
  {
    id: 'jpn-hiroshima',
    name: 'HIROSHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-ishikari',
    name: 'ISHIKARI',
    flag: 'JPN',
  },
  {
    id: 'jpn-kagoshima',
    name: 'KAGOSHIMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kisarazu',
    name: 'KISARAZU',
    flag: 'JPN',
  },
  {
    id: 'jpn-kobe',
    name: 'KOBE',
    flag: 'JPN',
  },
  {
    id: 'jpn-kokura',
    name: 'KOKURA',
    flag: 'JPN',
  },
  {
    id: 'jpn-kure',
    name: 'KURE',
    flag: 'JPN',
  },
  {
    id: 'jpn-makurazaki',
    name: 'MAKURAZAKI',
    flag: 'JPN',
  },
  {
    id: 'jpn-matsuyama',
    name: 'MATSUYAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-monbetsu',
    name: 'MONBETSU',
    flag: 'JPN',
  },
  {
    id: 'jpn-nagoya',
    name: 'NAGOYA',
    flag: 'JPN',
  },
  {
    id: 'jpn-oikawa',
    name: 'OIKAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-onoda',
    name: 'ONODA',
    flag: 'JPN',
  },
  {
    id: 'jpn-osaka',
    name: 'OSAKA',
    flag: 'JPN',
  },
  {
    id: 'jpn-sakai',
    name: 'SAKAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-sendai',
    name: 'SENDAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-setoda',
    name: 'SETODA',
    flag: 'JPN',
  },
  {
    id: 'jpn-shimizu',
    name: 'SHIMIZU',
    flag: 'JPN',
  },
  {
    id: 'jpn-shiogama',
    name: 'SHIOGAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-ube',
    name: 'UBE',
    flag: 'JPN',
  },
  {
    id: 'jpn-uraga',
    name: 'URAGA',
    flag: 'JPN',
  },
  {
    id: 'jpn-wakayamaanchorage',
    name: 'WAKAYAMA ANCHORAGE',
    flag: 'JPN',
  },
  {
    id: 'jpn-wakkanai',
    name: 'WAKKANAI',
    flag: 'JPN',
  },
  {
    id: 'jpn-yamagawa',
    name: 'YAMAGAWA',
    flag: 'JPN',
  },
  {
    id: 'jpn-yokohama',
    name: 'YOKOHAMA',
    flag: 'JPN',
  },
  {
    id: 'jpn-yokosuka',
    name: 'YOKOSUKA',
    flag: 'JPN',
  },
  {
    id: 'ken-mombasa',
    name: 'MOMBASA',
    flag: 'KEN',
  },
  {
    id: 'kir-london',
    name: 'LONDON',
    flag: 'KIR',
  },
  {
    id: 'kir-tarawa',
    name: 'TARAWA',
    flag: 'KIR',
  },
  {
    id: 'kor-busan',
    name: 'BUSAN',
    flag: 'KOR',
  },
  {
    id: 'kor-busannewport',
    name: 'BUSAN NEW PORT',
    flag: 'KOR',
  },
  {
    id: 'kor-donghae',
    name: 'DONGHAE',
    flag: 'KOR',
  },
  {
    id: 'kor-jeju',
    name: 'JEJU',
    flag: 'KOR',
  },
  {
    id: 'kor-masan',
    name: 'MASAN',
    flag: 'KOR',
  },
  {
    id: 'kor-mokpo',
    name: 'MOKPO',
    flag: 'KOR',
  },
  {
    id: 'kor-mukho',
    name: 'MUKHO',
    flag: 'KOR',
  },
  {
    id: 'kor-okpo',
    name: 'OKPO',
    flag: 'KOR',
  },
  {
    id: 'kor-onsan',
    name: 'ONSAN',
    flag: 'KOR',
  },
  {
    id: 'kor-tongyeong',
    name: 'TONGYEONG',
    flag: 'KOR',
  },
  {
    id: 'kor-ulsan',
    name: 'ULSAN',
    flag: 'KOR',
  },
  {
    id: 'kor-yeosu',
    name: 'YEOSU',
    flag: 'KOR',
  },
  {
    id: 'lbr-monrovia',
    name: 'MONROVIA',
    flag: 'LBR',
  },
  {
    id: 'lka-colombo',
    name: 'COLOMBO',
    flag: 'LKA',
  },
  {
    id: 'lka-hambantota',
    name: 'HAMBANTOTA',
    flag: 'LKA',
  },
  {
    id: 'ltu-klaipeda',
    name: 'KLAIPEDA',
    flag: 'LTU',
  },
  {
    id: 'lva-ventspils',
    name: 'VENTSPILS',
    flag: 'LVA',
  },
  {
    id: 'mar-agadir',
    name: 'AGADIR',
    flag: 'MAR',
  },
  {
    id: 'mar-tangermed',
    name: 'TANGER MED',
    flag: 'MAR',
  },
  {
    id: 'mar-tangier',
    name: 'TANGIER',
    flag: 'MAR',
  },
  {
    id: 'mdg-diegosuarez',
    name: 'DIEGO SUAREZ',
    flag: 'MDG',
  },
  {
    id: 'mdv-kooddoo',
    name: 'KOODDOO',
    flag: 'MDV',
  },
  {
    id: 'mdv-male',
    name: 'MALE',
    flag: 'MDV',
  },
  {
    id: 'mex-acapulco',
    name: 'ACAPULCO',
    flag: 'MEX',
  },
  {
    id: 'mex-dosbocas',
    name: 'DOS BOCAS',
    flag: 'MEX',
  },
  {
    id: 'mex-ensenada',
    name: 'ENSENADA',
    flag: 'MEX',
  },
  {
    id: 'mex-manzanillo',
    name: 'MANZANILLO',
    flag: 'MEX',
  },
  {
    id: 'mex-mazatlan',
    name: 'MAZATLAN',
    flag: 'MEX',
  },
  {
    id: 'mex-puertomadero',
    name: 'PUERTO MADERO',
    flag: 'MEX',
  },
  {
    id: 'mex-salinacruz',
    name: 'SALINA CRUZ',
    flag: 'MEX',
  },
  {
    id: 'mex-tampico',
    name: 'TAMPICO',
    flag: 'MEX',
  },
  {
    id: 'mex-veracruz',
    name: 'VERACRUZ',
    flag: 'MEX',
  },
  {
    id: 'mhl-majuro',
    name: 'MAJURO',
    flag: 'MHL',
  },
  {
    id: 'mlt-bugibba',
    name: 'BUGIBBA',
    flag: 'MLT',
  },
  {
    id: 'mlt-marsaxlokk',
    name: 'MARSAXLOKK',
    flag: 'MLT',
  },
  {
    id: 'mlt-valletta',
    name: 'VALLETTA',
    flag: 'MLT',
  },
  {
    id: 'mmr-yangon',
    name: 'YANGON',
    flag: 'MMR',
  },
  {
    id: 'mne-bar',
    name: 'BAR',
    flag: 'MNE',
  },
  {
    id: 'mne-hercegnovi',
    name: 'HERCEGNOVI',
    flag: 'MNE',
  },
  {
    id: 'mne-zelenika',
    name: 'ZELENIKA',
    flag: 'MNE',
  },
  {
    id: 'moz-beira',
    name: 'BEIRA',
    flag: 'MOZ',
  },
  {
    id: 'moz-maputo',
    name: 'MAPUTO',
    flag: 'MOZ',
  },
  {
    id: 'moz-nacala',
    name: 'NACALA',
    flag: 'MOZ',
  },
  {
    id: 'mrt-cansado',
    name: 'CANSADO',
    flag: 'MRT',
  },
  {
    id: 'mrt-nouadhibou',
    name: 'NOUADHIBOU',
    flag: 'MRT',
  },
  {
    id: 'mrt-nouakchott',
    name: 'NOUAKCHOTT',
    flag: 'MRT',
  },
  {
    id: 'mus-portlouis',
    name: 'PORT LOUIS',
    flag: 'MUS',
  },
  {
    id: 'mys-kuantancity',
    name: 'KUANTAN CITY',
    flag: 'MYS',
  },
  {
    id: 'mys-pasirgudang',
    name: 'PASIR GUDANG',
    flag: 'MYS',
  },
  {
    id: 'mys-penang',
    name: 'PENANG',
    flag: 'MYS',
  },
  {
    id: 'mys-pengerang',
    name: 'PENGERANG',
    flag: 'MYS',
  },
  {
    id: 'mys-portdickson',
    name: 'PORT DICKSON',
    flag: 'MYS',
  },
  {
    id: 'mys-portklang',
    name: 'PORT KLANG',
    flag: 'MYS',
  },
  {
    id: 'mys-tanjungpelepas',
    name: 'TANJUNG PELEPAS',
    flag: 'MYS',
  },
  {
    id: 'mys-telokramunia',
    name: 'TELOK RAMUNIA',
    flag: 'MYS',
  },
  {
    id: 'nam-walvisbay',
    name: 'WALVIS BAY',
    flag: 'NAM',
  },
  {
    id: 'nga-bonny',
    name: 'BONNY',
    flag: 'NGA',
  },
  {
    id: 'nga-escravos',
    name: 'ESCRAVOS',
    flag: 'NGA',
  },
  {
    id: 'nga-escravosoilterminal',
    name: 'ESCRAVOS OIL TERMINAL',
    flag: 'NGA',
  },
  {
    id: 'nga-lagos',
    name: 'LAGOS',
    flag: 'NGA',
  },
  {
    id: 'nga-okrika',
    name: 'OKRIKA',
    flag: 'NGA',
  },
  {
    id: 'nga-portharcourt',
    name: 'PORT HARCOURT',
    flag: 'NGA',
  },
  {
    id: 'nga-warri',
    name: 'WARRI',
    flag: 'NGA',
  },
  {
    id: 'nic-sanjuandelsur',
    name: 'SAN JUAN DEL SUR',
    flag: 'NIC',
  },
  {
    id: 'nld-amsterdam',
    name: 'AMSTERDAM',
    flag: 'NLD',
  },
  {
    id: 'nld-breskens',
    name: 'BRESKENS',
    flag: 'NLD',
  },
  {
    id: 'nld-denhelder',
    name: 'DEN HELDER',
    flag: 'NLD',
  },
  {
    id: 'nld-harlingen',
    name: 'HARLINGEN',
    flag: 'NLD',
  },
  {
    id: 'nld-ijmuiden',
    name: 'IJMUIDEN',
    flag: 'NLD',
  },
  {
    id: 'nld-rotterdammaasvlakte',
    name: 'ROTTERDAM MAASVLAKTE',
    flag: 'NLD',
  },
  {
    id: 'nld-scheveningen',
    name: 'SCHEVENINGEN',
    flag: 'NLD',
  },
  {
    id: 'nor-aagotnes',
    name: 'AAGOTNES',
    flag: 'NOR',
  },
  {
    id: 'nor-aaheim',
    name: 'AAHEIM',
    flag: 'NOR',
  },
  {
    id: 'nor-abelnes',
    name: 'ABELNES',
    flag: 'NOR',
  },
  {
    id: 'nor-akkarfjord',
    name: 'AKKARFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-akrehamn',
    name: 'AKREHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-alesund',
    name: 'ALESUND',
    flag: 'NOR',
  },
  {
    id: 'nor-alnes',
    name: 'ALNES',
    flag: 'NOR',
  },
  {
    id: 'nor-alta',
    name: 'ALTA',
    flag: 'NOR',
  },
  {
    id: 'nor-andenes',
    name: 'ANDENES',
    flag: 'NOR',
  },
  {
    id: 'nor-arendal',
    name: 'ARENDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-arendalanchorage',
    name: 'ARENDAL ANCHORAGE',
    flag: 'NOR',
  },
  {
    id: 'nor-askvoll',
    name: 'ASKVOLL',
    flag: 'NOR',
  },
  {
    id: 'nor-austnes',
    name: 'AUSTNES',
    flag: 'NOR',
  },
  {
    id: 'nor-averoy',
    name: 'AVEROY',
    flag: 'NOR',
  },
  {
    id: 'nor-ballstad',
    name: 'BALLSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-batsfjord',
    name: 'BATSFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-bekkjarvik',
    name: 'BEKKJARVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-bergen',
    name: 'BERGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-bergsfjord',
    name: 'BERGSFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-berlevag',
    name: 'BERLEVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-bessaker',
    name: 'BESSAKER',
    flag: 'NOR',
  },
  {
    id: 'nor-bleik',
    name: 'BLEIK',
    flag: 'NOR',
  },
  {
    id: 'nor-blokken',
    name: 'BLOKKEN',
    flag: 'NOR',
  },
  {
    id: 'nor-bodo',
    name: 'BODO',
    flag: 'NOR',
  },
  {
    id: 'nor-bolga',
    name: 'BOLGA',
    flag: 'NOR',
  },
  {
    id: 'nor-borgundvag',
    name: 'BORGUNDVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-botnhamn',
    name: 'BOTNHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-brattvag',
    name: 'BRATTVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-breivikbotn',
    name: 'BREIVIKBOTN',
    flag: 'NOR',
  },
  {
    id: 'nor-brensholmen',
    name: 'BRENSHOLMEN',
    flag: 'NOR',
  },
  {
    id: 'nor-bringsinghaug',
    name: 'BRINGSINGHAUG',
    flag: 'NOR',
  },
  {
    id: 'nor-bronnoysund',
    name: 'BRONNOYSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-bruhagen',
    name: 'BRUHAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-bud',
    name: 'BUD',
    flag: 'NOR',
  },
  {
    id: 'nor-bulandet',
    name: 'BULANDET',
    flag: 'NOR',
  },
  {
    id: 'nor-byrknes',
    name: 'BYRKNES',
    flag: 'NOR',
  },
  {
    id: 'nor-digermulen',
    name: 'DIGERMULEN',
    flag: 'NOR',
  },
  {
    id: 'nor-djupvik',
    name: 'DJUPVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-dusavik',
    name: 'DUSAVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-dyfjord',
    name: 'DYFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-egersund',
    name: 'EGERSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-eggesbones',
    name: 'EGGESBONES',
    flag: 'NOR',
  },
  {
    id: 'nor-eidshaug',
    name: 'EIDSHAUG',
    flag: 'NOR',
  },
  {
    id: 'nor-eidsvik',
    name: 'EIDSVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-ellingsoy',
    name: 'ELLINGSOY',
    flag: 'NOR',
  },
  {
    id: 'nor-engenes',
    name: 'ENGENES',
    flag: 'NOR',
  },
  {
    id: 'nor-espevaer',
    name: 'ESPEVAER',
    flag: 'NOR',
  },
  {
    id: 'nor-eydehavn',
    name: 'EYDEHAVN',
    flag: 'NOR',
  },
  {
    id: 'nor-farsund',
    name: 'FARSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-fedje',
    name: 'FEDJE',
    flag: 'NOR',
  },
  {
    id: 'nor-feisteinanchorage',
    name: 'FEISTEIN ANCHORAGE',
    flag: 'NOR',
  },
  {
    id: 'nor-finnoy',
    name: 'FINNOY',
    flag: 'NOR',
  },
  {
    id: 'nor-finnsnes',
    name: 'FINNSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-fiskarstranda',
    name: 'FISKARSTRANDA',
    flag: 'NOR',
  },
  {
    id: 'nor-fitjar',
    name: 'FITJAR',
    flag: 'NOR',
  },
  {
    id: 'nor-fjortoft',
    name: 'FJORTOFT',
    flag: 'NOR',
  },
  {
    id: 'nor-flekkeroy',
    name: 'FLEKKEROY',
    flag: 'NOR',
  },
  {
    id: 'nor-floro',
    name: 'FLORO',
    flag: 'NOR',
  },
  {
    id: 'nor-fonnes',
    name: 'FONNES',
    flag: 'NOR',
  },
  {
    id: 'nor-foresvik',
    name: 'FORESVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-forsol',
    name: 'FORSOL',
    flag: 'NOR',
  },
  {
    id: 'nor-fosnavag',
    name: 'FOSNAVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-fredvang',
    name: 'FREDVANG',
    flag: 'NOR',
  },
  {
    id: 'nor-frihetsholmen',
    name: 'FRIHETSHOLMEN',
    flag: 'NOR',
  },
  {
    id: 'nor-gamvik',
    name: 'GAMVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-garten',
    name: 'GARTEN',
    flag: 'NOR',
  },
  {
    id: 'nor-gibostad',
    name: 'GIBOSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-gjesvaer',
    name: 'GJESVAER',
    flag: 'NOR',
  },
  {
    id: 'nor-godoya',
    name: 'GODOYA',
    flag: 'NOR',
  },
  {
    id: 'nor-goliatfield',
    name: 'GOLIAT FIELD',
    flag: 'NOR',
  },
  {
    id: 'nor-gravdal',
    name: 'GRAVDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-grimstad',
    name: 'GRIMSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-gryllefjord',
    name: 'GRYLLEFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-hagavik',
    name: 'HAGAVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-halsa',
    name: 'HALSA',
    flag: 'NOR',
  },
  {
    id: 'nor-hammerfest',
    name: 'HAMMERFEST',
    flag: 'NOR',
  },
  {
    id: 'nor-hamnvik',
    name: 'HAMNVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-hansnes',
    name: 'HANSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-hardbakke',
    name: 'HARDBAKKE',
    flag: 'NOR',
  },
  {
    id: 'nor-hareid',
    name: 'HAREID',
    flag: 'NOR',
  },
  {
    id: 'nor-haroysundet',
    name: 'HAROYSUNDET',
    flag: 'NOR',
  },
  {
    id: 'nor-harstad',
    name: 'HARSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-hasseloysundet',
    name: 'HASSELOYSUNDET',
    flag: 'NOR',
  },
  {
    id: 'nor-hasvik',
    name: 'HASVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-haugesund',
    name: 'HAUGESUND',
    flag: 'NOR',
  },
  {
    id: 'nor-hausvik',
    name: 'HAUSVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-havoysund',
    name: 'HAVOYSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-hellvik',
    name: 'HELLVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-henningsvaer',
    name: 'HENNINGSVAER',
    flag: 'NOR',
  },
  {
    id: 'nor-herland',
    name: 'HERLAND',
    flag: 'NOR',
  },
  {
    id: 'nor-heroy',
    name: 'HEROY',
    flag: 'NOR',
  },
  {
    id: 'nor-hestvika',
    name: 'HESTVIKA',
    flag: 'NOR',
  },
  {
    id: 'nor-hjorungavaag',
    name: 'HJORUNGAVAAG',
    flag: 'NOR',
  },
  {
    id: 'nor-honningsvag',
    name: 'HONNINGSVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-hovden',
    name: 'HOVDEN',
    flag: 'NOR',
  },
  {
    id: 'nor-husoy',
    name: 'HUSOY',
    flag: 'NOR',
  },
  {
    id: 'nor-inner-vikna',
    name: 'INNER-VIKNA',
    flag: 'NOR',
  },
  {
    id: 'nor-kabelvaag',
    name: 'KABELVAAG',
    flag: 'NOR',
  },
  {
    id: 'nor-kalvag',
    name: 'KALVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-kamoyvaer',
    name: 'KAMOYVAER',
    flag: 'NOR',
  },
  {
    id: 'nor-karhamn',
    name: 'KARHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-karvikhamn',
    name: 'KARVIKHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-kiberg',
    name: 'KIBERG',
    flag: 'NOR',
  },
  {
    id: 'nor-kirkehamn',
    name: 'KIRKEHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-kirkenes',
    name: 'KIRKENES',
    flag: 'NOR',
  },
  {
    id: 'nor-kjollefjord',
    name: 'KJOLLEFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-kleppesto',
    name: 'KLEPPESTO',
    flag: 'NOR',
  },
  {
    id: 'nor-klokkarvik',
    name: 'KLOKKARVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-knarrevik',
    name: 'KNARREVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-kopervik',
    name: 'KOPERVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-korsfjord',
    name: 'KORSFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-korshamn',
    name: 'KORSHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-kristiansand',
    name: 'KRISTIANSAND',
    flag: 'NOR',
  },
  {
    id: 'nor-kristiansund',
    name: 'KRISTIANSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-kristoffervalen',
    name: 'KRISTOFFERVALEN',
    flag: 'NOR',
  },
  {
    id: 'nor-langesund',
    name: 'LANGESUND',
    flag: 'NOR',
  },
  {
    id: 'nor-langevag',
    name: 'LANGEVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-larsnes',
    name: 'LARSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-larvik',
    name: 'LARVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-laukvik',
    name: 'LAUKVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-leinoy',
    name: 'LEINOY',
    flag: 'NOR',
  },
  {
    id: 'nor-levanger',
    name: 'LEVANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-lillesand',
    name: 'LILLESAND',
    flag: 'NOR',
  },
  {
    id: 'nor-lodingen',
    name: 'LODINGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-longva',
    name: 'LONGVA',
    flag: 'NOR',
  },
  {
    id: 'nor-luroy',
    name: 'LUROY',
    flag: 'NOR',
  },
  {
    id: 'nor-lyngdal',
    name: 'LYNGDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-maloy',
    name: 'MALOY',
    flag: 'NOR',
  },
  {
    id: 'nor-mandal',
    name: 'MANDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-manger',
    name: 'MANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-mausund',
    name: 'MAUSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-mefjord',
    name: 'MEFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-mehamn',
    name: 'MEHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-mekjarvik',
    name: 'MEKJARVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-melbu',
    name: 'MELBU',
    flag: 'NOR',
  },
  {
    id: 'nor-melkoya',
    name: 'MELKOYA',
    flag: 'NOR',
  },
  {
    id: 'nor-midsund',
    name: 'MIDSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-molde',
    name: 'MOLDE',
    flag: 'NOR',
  },
  {
    id: 'nor-mongstad',
    name: 'MONGSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-monstad',
    name: 'MONSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-mosterhamn',
    name: 'MOSTERHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-myken',
    name: 'MYKEN',
    flag: 'NOR',
  },
  {
    id: 'nor-myklebust',
    name: 'MYKLEBUST',
    flag: 'NOR',
  },
  {
    id: 'nor-myre',
    name: 'MYRE',
    flag: 'NOR',
  },
  {
    id: 'nor-namsos',
    name: 'NAMSOS',
    flag: 'NOR',
  },
  {
    id: 'nor-napp',
    name: 'NAPP',
    flag: 'NOR',
  },
  {
    id: 'nor-nerdvika',
    name: 'NERDVIKA',
    flag: 'NOR',
  },
  {
    id: 'nor-nesset',
    name: 'NESSET',
    flag: 'NOR',
  },
  {
    id: 'nor-nusfjord',
    name: 'NUSFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-nyhellesund',
    name: 'NYHELLESUND',
    flag: 'NOR',
  },
  {
    id: 'nor-nyksund',
    name: 'NYKSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-odda',
    name: 'ODDA',
    flag: 'NOR',
  },
  {
    id: 'nor-oksfjord',
    name: 'OKSFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-olen',
    name: 'OLEN',
    flag: 'NOR',
  },
  {
    id: 'nor-ormenlange',
    name: 'ORMEN LANGE',
    flag: 'NOR',
  },
  {
    id: 'nor-osebergb',
    name: 'OSEBERG B',
    flag: 'NOR',
  },
  {
    id: 'nor-ramberg',
    name: 'RAMBERG',
    flag: 'NOR',
  },
  {
    id: 'nor-ranseilforening',
    name: 'RAN SEILFORENING',
    flag: 'NOR',
  },
  {
    id: 'nor-raudeberg',
    name: 'RAUDEBERG',
    flag: 'NOR',
  },
  {
    id: 'nor-reine',
    name: 'REINE',
    flag: 'NOR',
  },
  {
    id: 'nor-rekefjord',
    name: 'REKEFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-remoy',
    name: 'REMOY',
    flag: 'NOR',
  },
  {
    id: 'nor-risor',
    name: 'RISOR',
    flag: 'NOR',
  },
  {
    id: 'nor-risoyhamn',
    name: 'RISOYHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-roald',
    name: 'ROALD',
    flag: 'NOR',
  },
  {
    id: 'nor-roan',
    name: 'ROAN',
    flag: 'NOR',
  },
  {
    id: 'nor-rodoy',
    name: 'RODOY',
    flag: 'NOR',
  },
  {
    id: 'nor-rognaldsvaag',
    name: 'ROGNALDSVAAG',
    flag: 'NOR',
  },
  {
    id: 'nor-rorvik',
    name: 'RORVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-rost',
    name: 'ROST',
    flag: 'NOR',
  },
  {
    id: 'nor-rottvegen',
    name: 'ROTTVEGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-rovaer',
    name: 'ROVAER',
    flag: 'NOR',
  },
  {
    id: 'nor-rowanstavanger',
    name: 'ROWAN STAVANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-rubbestadneset',
    name: 'RUBBESTADNESET',
    flag: 'NOR',
  },
  {
    id: 'nor-rypefjord',
    name: 'RYPEFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-salthella',
    name: 'SALTHELLA',
    flag: 'NOR',
  },
  {
    id: 'nor-sandnessjoen',
    name: 'SANDNESSJOEN',
    flag: 'NOR',
  },
  {
    id: 'nor-sandshamn',
    name: 'SANDSHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-sandstad',
    name: 'SANDSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-sandviksberget',
    name: 'SANDVIKSBERGET',
    flag: 'NOR',
  },
  {
    id: 'nor-seloy',
    name: 'SELOY',
    flag: 'NOR',
  },
  {
    id: 'nor-senjahopen',
    name: 'SENJAHOPEN',
    flag: 'NOR',
  },
  {
    id: 'nor-seter',
    name: 'SETER',
    flag: 'NOR',
  },
  {
    id: 'nor-siggjarvag',
    name: 'SIGGJARVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-silda',
    name: 'SILDA',
    flag: 'NOR',
  },
  {
    id: 'nor-sirevag',
    name: 'SIREVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-sistranda',
    name: 'SISTRANDA',
    flag: 'NOR',
  },
  {
    id: 'nor-skarstad',
    name: 'SKARSTAD',
    flag: 'NOR',
  },
  {
    id: 'nor-skarsvag',
    name: 'SKARSVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-skjelnan',
    name: 'SKJELNAN',
    flag: 'NOR',
  },
  {
    id: 'nor-skjervika',
    name: 'SKJERVIKA',
    flag: 'NOR',
  },
  {
    id: 'nor-skjervoy',
    name: 'SKJERVOY',
    flag: 'NOR',
  },
  {
    id: 'nor-skogsvagen',
    name: 'SKOGSVAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-skudeneshavn',
    name: 'SKUDENESHAVN',
    flag: 'NOR',
  },
  {
    id: 'nor-slagen',
    name: 'SLAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-sleneset',
    name: 'SLENESET',
    flag: 'NOR',
  },
  {
    id: 'nor-soloavagen',
    name: 'SOLOAVAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-sommaroy',
    name: 'SOMMAROY',
    flag: 'NOR',
  },
  {
    id: 'nor-sorarnoy',
    name: 'SOR ARNOY',
    flag: 'NOR',
  },
  {
    id: 'nor-sorreisa',
    name: 'SORREISA',
    flag: 'NOR',
  },
  {
    id: 'nor-sortland',
    name: 'SORTLAND',
    flag: 'NOR',
  },
  {
    id: 'nor-sorvaagen',
    name: 'SORVAAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-sorvar',
    name: 'SORVAR',
    flag: 'NOR',
  },
  {
    id: 'nor-sovik',
    name: 'SOVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-stamsund',
    name: 'STAMSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-stavanger',
    name: 'STAVANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-stavern',
    name: 'STAVERN',
    flag: 'NOR',
  },
  {
    id: 'nor-steinshamn',
    name: 'STEINSHAMN',
    flag: 'NOR',
  },
  {
    id: 'nor-stokkmarknes',
    name: 'STOKKMARKNES',
    flag: 'NOR',
  },
  {
    id: 'nor-stokksund',
    name: 'STOKKSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-stokkvagen',
    name: 'STOKKVAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-stord',
    name: 'STORD',
    flag: 'NOR',
  },
  {
    id: 'nor-storebo',
    name: 'STOREBO',
    flag: 'NOR',
  },
  {
    id: 'nor-straume',
    name: 'STRAUME',
    flag: 'NOR',
  },
  {
    id: 'nor-sture',
    name: 'STURE',
    flag: 'NOR',
  },
  {
    id: 'nor-sunde',
    name: 'SUNDE',
    flag: 'NOR',
  },
  {
    id: 'nor-svartnes',
    name: 'SVARTNES',
    flag: 'NOR',
  },
  {
    id: 'nor-sveggen',
    name: 'SVEGGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-svelgen',
    name: 'SVELGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-svolvaer',
    name: 'SVOLVAER',
    flag: 'NOR',
  },
  {
    id: 'nor-tananger',
    name: 'TANANGER',
    flag: 'NOR',
  },
  {
    id: 'nor-tennebo',
    name: 'TENNEBO',
    flag: 'NOR',
  },
  {
    id: 'nor-tjeldbergodden',
    name: 'TJELDBERGODDEN',
    flag: 'NOR',
  },
  {
    id: 'nor-tofte',
    name: 'TOFTE',
    flag: 'NOR',
  },
  {
    id: 'nor-tommervag',
    name: 'TOMMERVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-tomrefjord',
    name: 'TOMREFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-torsken',
    name: 'TORSKEN',
    flag: 'NOR',
  },
  {
    id: 'nor-torsvaag',
    name: 'TORSVAAG',
    flag: 'NOR',
  },
  {
    id: 'nor-tranoy',
    name: 'TRANOY',
    flag: 'NOR',
  },
  {
    id: 'nor-tromso',
    name: 'TROMSO',
    flag: 'NOR',
  },
  {
    id: 'nor-tromvik',
    name: 'TROMVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-trondheim',
    name: 'TRONDHEIM',
    flag: 'NOR',
  },
  {
    id: 'nor-tufjord',
    name: 'TUFJORD',
    flag: 'NOR',
  },
  {
    id: 'nor-ulsteinvik',
    name: 'ULSTEINVIK',
    flag: 'NOR',
  },
  {
    id: 'nor-ulvoysund',
    name: 'ULVOYSUND',
    flag: 'NOR',
  },
  {
    id: 'nor-utgard',
    name: 'UTGARD',
    flag: 'NOR',
  },
  {
    id: 'nor-uthaug',
    name: 'UTHAUG',
    flag: 'NOR',
  },
  {
    id: 'nor-vadso',
    name: 'VADSO',
    flag: 'NOR',
  },
  {
    id: 'nor-vaeroy',
    name: 'VAEROY',
    flag: 'NOR',
  },
  {
    id: 'nor-valevaag',
    name: 'VALEVAAG',
    flag: 'NOR',
  },
  {
    id: 'nor-vannvag',
    name: 'VANNVAG',
    flag: 'NOR',
  },
  {
    id: 'nor-vardo',
    name: 'VARDO',
    flag: 'NOR',
  },
  {
    id: 'nor-varhaugvika',
    name: 'VARHAUGVIKA',
    flag: 'NOR',
  },
  {
    id: 'nor-vartdal',
    name: 'VARTDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-vedavagen',
    name: 'VEDAVAGEN',
    flag: 'NOR',
  },
  {
    id: 'nor-veiholmen',
    name: 'VEIHOLMEN',
    flag: 'NOR',
  },
  {
    id: 'nor-vestbygd',
    name: 'VESTBYGD',
    flag: 'NOR',
  },
  {
    id: 'nor-vestnes',
    name: 'VESTNES',
    flag: 'NOR',
  },
  {
    id: 'nor-vigra',
    name: 'VIGRA',
    flag: 'NOR',
  },
  {
    id: 'nor-vormedal',
    name: 'VORMEDAL',
    flag: 'NOR',
  },
  {
    id: 'nor-ydstebohamn',
    name: 'YDSTEBOHAMN',
    flag: 'NOR',
  },
  {
    id: 'nru-nauru',
    name: 'NAURU',
    flag: 'NRU',
  },
  {
    id: 'nzl-bluff',
    name: 'BLUFF',
    flag: 'NZL',
  },
  {
    id: 'nzl-napier',
    name: 'NAPIER',
    flag: 'NZL',
  },
  {
    id: 'nzl-portlyttelton',
    name: 'PORT LYTTELTON',
    flag: 'NZL',
  },
  {
    id: 'omn-duqm',
    name: 'DUQM',
    flag: 'OMN',
  },
  {
    id: 'omn-muscat',
    name: 'MUSCAT',
    flag: 'OMN',
  },
  {
    id: 'omn-salalah',
    name: 'SALALAH',
    flag: 'OMN',
  },
  {
    id: 'omn-sohar',
    name: 'SOHAR',
    flag: 'OMN',
  },
  {
    id: 'pan-amadorcruiseport',
    name: 'AMADOR CRUISE PORT',
    flag: 'PAN',
  },
  {
    id: 'pan-balboa',
    name: 'BALBOA',
    flag: 'PAN',
  },
  {
    id: 'pan-balboaanchorage',
    name: 'BALBOA ANCHORAGE',
    flag: 'PAN',
  },
  {
    id: 'pan-bucaro',
    name: 'BUCARO',
    flag: 'PAN',
  },
  {
    id: 'pan-colon',
    name: 'COLON',
    flag: 'PAN',
  },
  {
    id: 'pan-flamancomarina',
    name: 'FLAMANCO MARINA',
    flag: 'PAN',
  },
  {
    id: 'pan-gatunlakeanchorage',
    name: 'GATUN LAKE ANCHORAGE',
    flag: 'PAN',
  },
  {
    id: 'pan-laboca',
    name: 'LA BOCA',
    flag: 'PAN',
  },
  {
    id: 'pan-limonbayanchorage',
    name: 'LIMON BAY ANCHORAGE',
    flag: 'PAN',
  },
  {
    id: 'pan-manzanillo',
    name: 'MANZANILLO',
    flag: 'PAN',
  },
  {
    id: 'pan-melones',
    name: 'MELONES',
    flag: 'PAN',
  },
  {
    id: 'pan-puertoaguadulce',
    name: 'PUERTO AGUADULCE',
    flag: 'PAN',
  },
  {
    id: 'pan-puertoarmuelles',
    name: 'PUERTO ARMUELLES',
    flag: 'PAN',
  },
  {
    id: 'pan-puertocoquira',
    name: 'PUERTO COQUIRA',
    flag: 'PAN',
  },
  {
    id: 'pan-puertojuandiaz',
    name: 'PUERTO JUAN DIAZ',
    flag: 'PAN',
  },
  {
    id: 'pan-puertomutis',
    name: 'PUERTO MUTIS',
    flag: 'PAN',
  },
  {
    id: 'pan-puertopanama',
    name: 'PUERTO PANAMA',
    flag: 'PAN',
  },
  {
    id: 'pan-puertopedregal',
    name: 'PUERTO PEDREGAL',
    flag: 'PAN',
  },
  {
    id: 'pan-puertopina',
    name: 'PUERTO PINA',
    flag: 'PAN',
  },
  {
    id: 'pan-puertovacamonte',
    name: 'PUERTO VACAMONTE',
    flag: 'PAN',
  },
  {
    id: 'pan-rodman',
    name: 'RODMAN',
    flag: 'PAN',
  },
  {
    id: 'pan-taboga',
    name: 'TABOGA',
    flag: 'PAN',
  },
  {
    id: 'pan-vacamonte',
    name: 'VACAMONTE',
    flag: 'PAN',
  },
  {
    id: 'per-acapulco',
    name: 'ACAPULCO',
    flag: 'PER',
  },
  {
    id: 'per-acari',
    name: 'ACARI',
    flag: 'PER',
  },
  {
    id: 'per-ancon',
    name: 'ANCON',
    flag: 'PER',
  },
  {
    id: 'per-bajovar',
    name: 'BAJOVAR',
    flag: 'PER',
  },
  {
    id: 'per-bayovar',
    name: 'BAYOVAR',
    flag: 'PER',
  },
  {
    id: 'per-caboblanco',
    name: 'CABO BLANCO',
    flag: 'PER',
  },
  {
    id: 'per-caletacruz',
    name: 'CALETA CRUZ',
    flag: 'PER',
  },
  {
    id: 'per-callao',
    name: 'CALLAO',
    flag: 'PER',
  },
  {
    id: 'per-cancas',
    name: 'CANCAS',
    flag: 'PER',
  },
  {
    id: 'per-carquin',
    name: 'CARQUIN',
    flag: 'PER',
  },
  {
    id: 'per-chancay',
    name: 'CHANCAY',
    flag: 'PER',
  },
  {
    id: 'per-chimbote',
    name: 'CHIMBOTE',
    flag: 'PER',
  },
  {
    id: 'per-coishco',
    name: 'COISHCO',
    flag: 'PER',
  },
  {
    id: 'per-colan',
    name: 'COLAN',
    flag: 'PER',
  },
  {
    id: 'per-dpagalileo',
    name: 'DPA GALILEO',
    flag: 'PER',
  },
  {
    id: 'per-elfaro',
    name: 'EL FARO',
    flag: 'PER',
  },
  {
    id: 'per-huacho',
    name: 'HUACHO',
    flag: 'PER',
  },
  {
    id: 'per-huarmey',
    name: 'HUARMEY',
    flag: 'PER',
  },
  {
    id: 'per-huarney',
    name: 'HUARNEY',
    flag: 'PER',
  },
  {
    id: 'per-ilo',
    name: 'ILO',
    flag: 'PER',
  },
  {
    id: 'per-islilla',
    name: 'ISLILLA',
    flag: 'PER',
  },
  {
    id: 'per-lapampillaoilterminal',
    name: 'LA PAMPILLA OIL TERMINAL',
    flag: 'PER',
  },
  {
    id: 'per-laplanchada',
    name: 'LA PLANCHADA',
    flag: 'PER',
  },
  {
    id: 'per-lapunta',
    name: 'LA PUNTA',
    flag: 'PER',
  },
  {
    id: 'per-lapuntaanchorage',
    name: 'LA PUNTA ANCHORAGE',
    flag: 'PER',
  },
  {
    id: 'per-lisas',
    name: 'LISAS',
    flag: 'PER',
  },
  {
    id: 'per-losorganos',
    name: 'LOS ORGANOS',
    flag: 'PER',
  },
  {
    id: 'per-malabrigo',
    name: 'MALABRIGO',
    flag: 'PER',
  },
  {
    id: 'per-mancora',
    name: 'MANCORA',
    flag: 'PER',
  },
  {
    id: 'per-marquez',
    name: 'MARQUEZ',
    flag: 'PER',
  },
  {
    id: 'per-matacavallo',
    name: 'MATA CAVALLO',
    flag: 'PER',
  },
  {
    id: 'per-matarani',
    name: 'MATARANI',
    flag: 'PER',
  },
  {
    id: 'per-mollendo',
    name: 'MOLLENDO',
    flag: 'PER',
  },
  {
    id: 'per-muellepescadores',
    name: 'MUELLE PESCADORES',
    flag: 'PER',
  },
  {
    id: 'per-nuro',
    name: 'NURO',
    flag: 'PER',
  },
  {
    id: 'per-paita',
    name: 'PAITA',
    flag: 'PER',
  },
  {
    id: 'per-paracas',
    name: 'PARACAS',
    flag: 'PER',
  },
  {
    id: 'per-parachique',
    name: 'PARACHIQUE',
    flag: 'PER',
  },
  {
    id: 'per-paramonga',
    name: 'PARAMONGA',
    flag: 'PER',
  },
  {
    id: 'per-pimentel',
    name: 'PIMENTEL',
    flag: 'PER',
  },
  {
    id: 'per-pisco',
    name: 'PISCO',
    flag: 'PER',
  },
  {
    id: 'per-playapacasmayo',
    name: 'PLAYA PACASMAYO',
    flag: 'PER',
  },
  {
    id: 'per-pucusana',
    name: 'PUCUSANA',
    flag: 'PER',
  },
  {
    id: 'per-puertochicama',
    name: 'PUERTO CHICAMA',
    flag: 'PER',
  },
  {
    id: 'per-puertodelomas',
    name: 'PUERTO DE LOMAS',
    flag: 'PER',
  },
  {
    id: 'per-puertodesanta',
    name: 'PUERTO DE SANTA',
    flag: 'PER',
  },
  {
    id: 'per-puertograu',
    name: 'PUERTO GRAU',
    flag: 'PER',
  },
  {
    id: 'per-puertopisco',
    name: 'PUERTO PISCO',
    flag: 'PER',
  },
  {
    id: 'per-puertopizarro',
    name: 'PUERTO PIZARRO',
    flag: 'PER',
  },
  {
    id: 'per-puertosupe',
    name: 'PUERTO SUPE',
    flag: 'PER',
  },
  {
    id: 'per-puntasal',
    name: 'PUNTA SAL',
    flag: 'PER',
  },
  {
    id: 'per-salaverry',
    name: 'SALAVERRY',
    flag: 'PER',
  },
  {
    id: 'per-samanco',
    name: 'SAMANCO',
    flag: 'PER',
  },
  {
    id: 'per-sanjose',
    name: 'SAN JOSE',
    flag: 'PER',
  },
  {
    id: 'per-sanjuandemarcona',
    name: 'SAN JUAN DE MARCONA',
    flag: 'PER',
  },
  {
    id: 'per-sannicolas',
    name: 'SAN NICOLAS',
    flag: 'PER',
  },
  {
    id: 'per-santarosa',
    name: 'SANTA ROSA',
    flag: 'PER',
  },
  {
    id: 'per-supe',
    name: 'SUPE',
    flag: 'PER',
  },
  {
    id: 'per-tablones',
    name: 'TABLONES',
    flag: 'PER',
  },
  {
    id: 'per-talara',
    name: 'TALARA',
    flag: 'PER',
  },
  {
    id: 'per-tambodemora',
    name: 'TAMBO DE MORA',
    flag: 'PER',
  },
  {
    id: 'per-tierracolorada',
    name: 'TIERRA COLORADA',
    flag: 'PER',
  },
  {
    id: 'per-veguetaanchorage',
    name: 'VEGUETA ANCHORAGE',
    flag: 'PER',
  },
  {
    id: 'per-yacila',
    name: 'YACILA',
    flag: 'PER',
  },
  {
    id: 'per-zorritos',
    name: 'ZORRITOS',
    flag: 'PER',
  },
  {
    id: 'phl-cabcaben',
    name: 'CABCABEN',
    flag: 'PHL',
  },
  {
    id: 'phl-davao',
    name: 'DAVAO',
    flag: 'PHL',
  },
  {
    id: 'phl-generalsantos',
    name: 'GENERAL SANTOS',
    flag: 'PHL',
  },
  {
    id: 'phl-lapaz',
    name: 'LA PAZ',
    flag: 'PHL',
  },
  {
    id: 'phl-manila',
    name: 'MANILA',
    flag: 'PHL',
  },
  {
    id: 'phl-tinoto',
    name: 'TINOTO',
    flag: 'PHL',
  },
  {
    id: 'plw-melekeok',
    name: 'MELEKEOK',
    flag: 'PLW',
  },
  {
    id: 'png-lae',
    name: 'LAE',
    flag: 'PNG',
  },
  {
    id: 'png-madang',
    name: 'MADANG',
    flag: 'PNG',
  },
  {
    id: 'png-rabaul',
    name: 'RABAUL',
    flag: 'PNG',
  },
  {
    id: 'png-vanimo',
    name: 'VANIMO',
    flag: 'PNG',
  },
  {
    id: 'png-wewak',
    name: 'WEWAK',
    flag: 'PNG',
  },
  {
    id: 'pol-gdynia',
    name: 'GDYNIA',
    flag: 'POL',
  },
  {
    id: 'prt-leixoes',
    name: 'LEIXOES',
    flag: 'PRT',
  },
  {
    id: 'prt-pontadelgada',
    name: 'PONTA DELGADA',
    flag: 'PRT',
  },
  {
    id: 'pyf-nukuhiva',
    name: 'NUKU HIVA',
    flag: 'PYF',
  },
  {
    id: 'pyf-papeete',
    name: 'PAPEETE',
    flag: 'PYF',
  },
  {
    id: 'rus-kaliningrad',
    name: 'KALININGRAD',
    flag: 'RUS',
  },
  {
    id: 'rus-kronshtadt',
    name: 'KRONSHTADT',
    flag: 'RUS',
  },
  {
    id: 'rus-murmansk',
    name: 'MURMANSK',
    flag: 'RUS',
  },
  {
    id: 'rus-nakhodka',
    name: 'NAKHODKA',
    flag: 'RUS',
  },
  {
    id: 'rus-oktyabrskiy',
    name: 'OKTYABRSKIY',
    flag: 'RUS',
  },
  {
    id: 'rus-petropavlovsk',
    name: 'PETROPAVLOVSK',
    flag: 'RUS',
  },
  {
    id: 'rus-prigorodnoyeanchorage',
    name: 'PRIGORODNOYE ANCHORAGE',
    flag: 'RUS',
  },
  {
    id: 'rus-retinskoe',
    name: 'RETINSKOE',
    flag: 'RUS',
  },
  {
    id: 'rus-saintpetersburg',
    name: 'SAINT PETERSBURG',
    flag: 'RUS',
  },
  {
    id: 'rus-severokurilsk',
    name: 'SEVERO KURILSK',
    flag: 'RUS',
  },
  {
    id: 'rus-slavyanka',
    name: 'SLAVYANKA',
    flag: 'RUS',
  },
  {
    id: 'rus-vladivostok',
    name: 'VLADIVOSTOK',
    flag: 'RUS',
  },
  {
    id: 'rus-vostochnyy',
    name: 'VOSTOCHNYY',
    flag: 'RUS',
  },
  {
    id: 'rus-yuzhokurilsk',
    name: 'YUZHO KURILSK',
    flag: 'RUS',
  },
  {
    id: 'sau-rabigh',
    name: 'RABIGH',
    flag: 'SAU',
  },
  {
    id: 'sen-dakar',
    name: 'DAKAR',
    flag: 'SEN',
  },
  {
    id: 'sgp-singapore',
    name: 'SINGAPORE',
    flag: 'SGP',
  },
  {
    id: 'shn-ascension',
    name: 'ASCENSION',
    flag: 'SHN',
  },
  {
    id: 'sjm-barentsburg',
    name: 'BARENTSBURG',
    flag: 'SJM',
  },
  {
    id: 'sjm-bellsundanchorage',
    name: 'BELLSUND ANCHORAGE',
    flag: 'SJM',
  },
  {
    id: 'sjm-longyearbyen',
    name: 'LONGYEARBYEN',
    flag: 'SJM',
  },
  {
    id: 'sjm-nyalesund',
    name: 'NY ALESUND',
    flag: 'SJM',
  },
  {
    id: 'slb-honiara',
    name: 'HONIARA',
    flag: 'SLB',
  },
  {
    id: 'slb-noroanchorage',
    name: 'NORO ANCHORAGE',
    flag: 'SLB',
  },
  {
    id: 'sle-freetown',
    name: 'FREETOWN',
    flag: 'SLE',
  },
  {
    id: 'slv-chiquirin',
    name: 'CHIQUIRIN',
    flag: 'SLV',
  },
  {
    id: 'slv-launion',
    name: 'LA UNION',
    flag: 'SLV',
  },
  {
    id: 'stp-saotome',
    name: 'SAO TOME',
    flag: 'STP',
  },
  {
    id: 'sur-paramaribo',
    name: 'PARAMARIBO',
    flag: 'SUR',
  },
  {
    id: 'sur-paramariboanchorage',
    name: 'PARAMARIBO ANCHORAGE',
    flag: 'SUR',
  },
  {
    id: 'swe-foto',
    name: 'FOTO',
    flag: 'SWE',
  },
  {
    id: 'swe-goteborg',
    name: 'GOTEBORG',
    flag: 'SWE',
  },
  {
    id: 'swe-helsingborg',
    name: 'HELSINGBORG',
    flag: 'SWE',
  },
  {
    id: 'swe-lulea',
    name: 'LULEA',
    flag: 'SWE',
  },
  {
    id: 'swe-oxelosund',
    name: 'OXELOSUND',
    flag: 'SWE',
  },
  {
    id: 'swe-smogen',
    name: 'SMOGEN',
    flag: 'SWE',
  },
  {
    id: 'swe-uddevalla',
    name: 'UDDEVALLA',
    flag: 'SWE',
  },
  {
    id: 'syc-portvictoria',
    name: 'PORT VICTORIA',
    flag: 'SYC',
  },
  {
    id: 'tgo-lome',
    name: 'LOME',
    flag: 'TGO',
  },
  {
    id: 'tha-bangkok',
    name: 'BANGKOK',
    flag: 'THA',
  },
  {
    id: 'tha-phuket',
    name: 'PHUKET',
    flag: 'THA',
  },
  {
    id: 'tha-samutsakhon',
    name: 'SAMUT SAKHON',
    flag: 'THA',
  },
  {
    id: 'tha-songkhla',
    name: 'SONGKHLA',
    flag: 'THA',
  },
  {
    id: 'tha-songkhlaanchorage',
    name: 'SONGKHLA ANCHORAGE',
    flag: 'THA',
  },
  {
    id: 'tha-sriracha',
    name: 'SRIRACHA',
    flag: 'THA',
  },
  {
    id: 'tls-dili',
    name: 'DILI',
    flag: 'TLS',
  },
  {
    id: 'tto-chaguaramas',
    name: 'CHAGUARAMAS',
    flag: 'TTO',
  },
  {
    id: 'tun-sfax',
    name: 'SFAX',
    flag: 'TUN',
  },
  {
    id: 'tur-canakkale',
    name: 'CANAKKALE',
    flag: 'TUR',
  },
  {
    id: 'tur-cesme',
    name: 'CESME',
    flag: 'TUR',
  },
  {
    id: 'tur-mersin',
    name: 'MERSIN',
    flag: 'TUR',
  },
  {
    id: 'tur-yalova',
    name: 'YALOVA',
    flag: 'TUR',
  },
  {
    id: 'tuv-funafuti',
    name: 'FUNAFUTI',
    flag: 'TUV',
  },
  {
    id: 'twn-kaohsiung',
    name: 'KAOHSIUNG',
    flag: 'TWN',
  },
  {
    id: 'twn-keelung',
    name: 'KEELUNG',
    flag: 'TWN',
  },
  {
    id: 'twn-kinmen',
    name: 'KINMEN',
    flag: 'TWN',
  },
  {
    id: 'twn-mailiao',
    name: 'MAILIAO',
    flag: 'TWN',
  },
  {
    id: 'twn-suao',
    name: 'SUAO',
    flag: 'TWN',
  },
  {
    id: 'twn-taichung',
    name: 'TAICHUNG',
    flag: 'TWN',
  },
  {
    id: 'twn-taipei',
    name: 'TAIPEI',
    flag: 'TWN',
  },
  {
    id: 'tza-daressalaam',
    name: 'DAR ES SALAAM',
    flag: 'TZA',
  },
  {
    id: 'ury-lapaloma',
    name: 'LA PALOMA',
    flag: 'URY',
  },
  {
    id: 'ury-montevideo',
    name: 'MONTEVIDEO',
    flag: 'URY',
  },
  {
    id: 'ury-recaladaanchorage',
    name: 'RECALADA ANCHORAGE',
    flag: 'URY',
  },
  {
    id: 'usa-akutan',
    name: 'AKUTAN',
    flag: 'USA',
  },
  {
    id: 'usa-barberspoint',
    name: 'BARBERS POINT',
    flag: 'USA',
  },
  {
    id: 'usa-bellingham',
    name: 'BELLINGHAM',
    flag: 'USA',
  },
  {
    id: 'usa-dutchharbor',
    name: 'DUTCH HARBOR',
    flag: 'USA',
  },
  {
    id: 'usa-honolulu',
    name: 'HONOLULU',
    flag: 'USA',
  },
  {
    id: 'usa-mobile',
    name: 'MOBILE',
    flag: 'USA',
  },
  {
    id: 'usa-newbedford',
    name: 'NEW BEDFORD',
    flag: 'USA',
  },
  {
    id: 'usa-petersburg',
    name: 'PETERSBURG',
    flag: 'USA',
  },
  {
    id: 'usa-sawmillbay',
    name: 'SAWMILL BAY',
    flag: 'USA',
  },
  {
    id: 'usa-togiak',
    name: 'TOGIAK',
    flag: 'USA',
  },
  {
    id: 'usa-wilmington',
    name: 'WILMINGTON',
    flag: 'USA',
  },
  {
    id: 'vct-kingstown',
    name: 'KINGSTOWN',
    flag: 'VCT',
  },
  {
    id: 'ven-sucre',
    name: 'SUCRE',
    flag: 'VEN',
  },
  {
    id: 'vnm-haiphong',
    name: 'HAIPHONG',
    flag: 'VNM',
  },
  {
    id: 'vnm-hochiminh',
    name: 'HO CHI MINH',
    flag: 'VNM',
  },
  {
    id: 'vnm-hongai',
    name: 'HON GAI',
    flag: 'VNM',
  },
  {
    id: 'vnm-vungtau',
    name: 'VUNG TAU',
    flag: 'VNM',
  },
  {
    id: 'zaf-capetown',
    name: 'CAPE TOWN',
    flag: 'ZAF',
  },
  {
    id: 'zaf-durban',
    name: 'DURBAN',
    flag: 'ZAF',
  },
  {
    id: 'zaf-eastlondon',
    name: 'EAST LONDON',
    flag: 'ZAF',
  },
  {
    id: 'zaf-portelizabeth',
    name: 'PORT ELIZABETH',
    flag: 'ZAF',
  },
  {
    id: 'bra-abaetetuba',
    name: 'ABAETETUBA',
    flag: 'BRA',
  },
  {
    id: 'bra-cabodesantoagostinho',
    name: 'CABO DE SANTO AGOSTINHO',
    flag: 'BRA',
  },
  {
    id: 'bra-carutapera',
    name: 'CARUTAPERA',
    flag: 'BRA',
  },
  {
    id: 'bra-cascavel',
    name: 'CASCAVEL',
    flag: 'BRA',
  },
  {
    id: 'bra-chaves',
    name: 'CHAVES',
    flag: 'BRA',
  },
  {
    id: 'bra-icapui',
    name: 'ICAPUI',
    flag: 'BRA',
  },
  {
    id: 'bra-itapipoca',
    name: 'ITAPIPOCA',
    flag: 'BRA',
  },
  {
    id: 'bra-parnamirim',
    name: 'PARNAMIRIM',
    flag: 'BRA',
  },
  {
    id: 'bra-pitimbu',
    name: 'PITIMBU',
    flag: 'BRA',
  },
  {
    id: 'bra-salinopolis',
    name: 'SALINOPOLIS',
    flag: 'BRA',
  },
  {
    id: 'bra-saojoaodepirabas',
    name: 'SAO JOAO DE PIRABAS',
    flag: 'BRA',
  },
  {
    id: 'bra-saojosedacoroagrande',
    name: 'SAO JOSE DA COROA GRANDE',
    flag: 'BRA',
  },
  {
    id: 'chl-auchemo',
    name: 'AUCHEMO',
    flag: 'CHL',
  },
  {
    id: 'chl-ayacara',
    name: 'AYACARA',
    flag: 'CHL',
  },
  {
    id: 'chl-bocaitata',
    name: 'BOCA ITATA',
    flag: 'CHL',
  },
  {
    id: 'chl-bonifacio',
    name: 'BONIFACIO',
    flag: 'CHL',
  },
  {
    id: 'chl-bucalemu',
    name: 'BUCALEMU',
    flag: 'CHL',
  },
  {
    id: 'chl-burca',
    name: 'BURCA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletaabtao(juanlopez)',
    name: 'CALETA ABTAO (JUAN LOPEZ)',
    flag: 'CHL',
  },
  {
    id: 'chl-caletablancoencalada',
    name: 'CALETA BLANCO ENCALADA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletabotija',
    name: 'CALETA BOTIJA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletachanaraldeaceituno',
    name: 'CALETA CHANARAL DE ACEITUNO',
    flag: 'CHL',
  },
  {
    id: 'chl-caletacifuncho',
    name: 'CALETA CIFUNCHO',
    flag: 'CHL',
  },
  {
    id: 'chl-caletacoloso',
    name: 'CALETA COLOSO',
    flag: 'CHL',
  },
  {
    id: 'chl-caletalachimba',
    name: 'CALETA LA CHIMBA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletalapena',
    name: 'CALETA LA PENA',
    flag: 'CHL',
  },
  {
    id: 'chl-caletapuntalobos',
    name: 'CALETA  PUNTA LOBOS',
    flag: 'CHL',
  },
  {
    id: 'chl-carrizalbajo',
    name: 'CARRIZAL BAJO',
    flag: 'CHL',
  },
  {
    id: 'chl-cartagena',
    name: 'CARTAGENA',
    flag: 'CHL',
  },
  {
    id: 'chl-caucahue',
    name: 'CAUCAHUE',
    flag: 'CHL',
  },
  {
    id: 'chl-chasco',
    name: 'CHASCO',
    flag: 'CHL',
  },
  {
    id: 'chl-chaulinec',
    name: 'CHAULINEC',
    flag: 'CHL',
  },
  {
    id: 'chl-chelin',
    name: 'CHELIN',
    flag: 'CHL',
  },
  {
    id: 'chl-chipana',
    name: 'CHIPANA',
    flag: 'CHL',
  },
  {
    id: 'chl-chorrillos',
    name: 'CHORRILLOS',
    flag: 'CHL',
  },
  {
    id: 'chl-cocholguecaletachica',
    name: 'COCHOLGUE CALETA CHICA',
    flag: 'CHL',
  },
  {
    id: 'chl-cocholguecaletagrande',
    name: 'COCHOLGUE CALETA GRANDE',
    flag: 'CHL',
  },
  {
    id: 'chl-cucao',
    name: 'CUCAO',
    flag: 'CHL',
  },
  {
    id: 'chl-curinanco',
    name: 'CURINANCO',
    flag: 'CHL',
  },
  {
    id: 'chl-elquisco',
    name: 'EL QUISCO',
    flag: 'CHL',
  },
  {
    id: 'chl-fatima',
    name: 'FATIMA',
    flag: 'CHL',
  },
  {
    id: 'chl-guabun',
    name: 'GUABUN',
    flag: 'CHL',
  },
  {
    id: 'chl-huape',
    name: 'HUAPE',
    flag: 'CHL',
  },
  {
    id: 'chl-huicolla',
    name: 'HUICOLLA',
    flag: 'CHL',
  },
  {
    id: 'chl-islaacui',
    name: 'ISLA ACUI',
    flag: 'CHL',
  },
  {
    id: 'chl-islaqueullin',
    name: 'ISLA QUEULLIN',
    flag: 'CHL',
  },
  {
    id: 'chl-lacebada',
    name: 'LA CEBADA',
    flag: 'CHL',
  },
  {
    id: 'chl-lachepica',
    name: 'LA CHEPICA',
    flag: 'CHL',
  },
  {
    id: 'chl-lamehuapi',
    name: 'LAMEHUAPI',
    flag: 'CHL',
  },
  {
    id: 'chl-lamision',
    name: 'LA MISION',
    flag: 'CHL',
  },
  {
    id: 'chl-lapozadellaicha',
    name: 'LA POZA DE LLAICHA',
    flag: 'CHL',
  },
  {
    id: 'chl-lasgaviotas',
    name: 'LAS GAVIOTAS',
    flag: 'CHL',
  },
  {
    id: 'chl-ligua',
    name: 'LIGUA',
    flag: 'CHL',
  },
  {
    id: 'chl-llingua',
    name: 'LLINGUA',
    flag: 'CHL',
  },
  {
    id: 'chl-losbagres',
    name: 'LOS BAGRES',
    flag: 'CHL',
  },
  {
    id: 'chl-loslachos',
    name: 'LOS LACHOS',
    flag: 'CHL',
  },
  {
    id: 'chl-mechuque',
    name: 'MECHUQUE',
    flag: 'CHL',
  },
  {
    id: 'chl-montecristo',
    name: 'MONTECRISTO',
    flag: 'CHL',
  },
  {
    id: 'chl-morhuilla',
    name: 'MORHUILLA',
    flag: 'CHL',
  },
  {
    id: 'chl-muelleartesanalbarrancoamarillo',
    name: 'MUELLE ARTESANAL BARRANCO AMARILLO',
    flag: 'CHL',
  },
  {
    id: 'chl-muelleartesanaldetubul',
    name: 'MUELLE ARTESANAL DE TUBUL',
    flag: 'CHL',
  },
  {
    id: 'chl-muellemora&mora',
    name: 'MUELLE MORA & MORA',
    flag: 'CHL',
  },
  {
    id: 'chl-muelleorizontongoy',
    name: 'MUELLE ORIZON TONGOY',
    flag: 'CHL',
  },
  {
    id: 'chl-muellepuertocisnes&muellepuertogala',
    name: 'MUELLE PUERTO CISNES & MUELLE PUERTO GALA',
    flag: 'CHL',
  },
  {
    id: 'chl-nague',
    name: 'NAGUE',
    flag: 'CHL',
  },
  {
    id: 'chl-pajonales',
    name: 'PAJONALES',
    flag: 'CHL',
  },
  {
    id: 'chl-pandeazucar',
    name: 'PAN DE AZUCAR',
    flag: 'CHL',
  },
  {
    id: 'chl-perales',
    name: 'PERALES',
    flag: 'CHL',
  },
  {
    id: 'chl-pichidangui',
    name: 'PICHIDANGUI',
    flag: 'CHL',
  },
  {
    id: 'chl-pichipelluco',
    name: 'PICHIPELLUCO',
    flag: 'CHL',
  },
  {
    id: 'chl-pilluco',
    name: 'PILLUCO',
    flag: 'CHL',
  },
  {
    id: 'chl-playachicadelaherradura',
    name: 'PLAYA CHICA DE LA HERRADURA',
    flag: 'CHL',
  },
  {
    id: 'chl-puertecito',
    name: 'PUERTECITO',
    flag: 'CHL',
  },
  {
    id: 'chl-puntaalcalde',
    name: 'PUNTA ALCALDE',
    flag: 'CHL',
  },
  {
    id: 'chl-puntaatala',
    name: 'PUNTA ATALA',
    flag: 'CHL',
  },
  {
    id: 'chl-purema',
    name: 'PUREMA',
    flag: 'CHL',
  },
  {
    id: 'chl-quicavi',
    name: 'QUICAVI',
    flag: 'CHL',
  },
  {
    id: 'chl-quichiuto',
    name: 'QUICHIUTO',
    flag: 'CHL',
  },
  {
    id: 'chl-ramada',
    name: 'RAMADA',
    flag: 'CHL',
  },
  {
    id: 'chl-sanmarcos',
    name: 'SAN MARCOS',
    flag: 'CHL',
  },
  {
    id: 'chl-santuariodelanaturaleza',
    name: 'SANTUARIO DE LA NATURALEZA',
    flag: 'CHL',
  },
  {
    id: 'chl-sierra',
    name: 'SIERRA',
    flag: 'CHL',
  },
  {
    id: 'chl-tome,muellepesqueroartesanal',
    name: 'TOME, MUELLE PESQUERO ARTESANAL',
    flag: 'CHL',
  },
  {
    id: 'chl-topocalma',
    name: 'TOPOCALMA',
    flag: 'CHL',
  },
  {
    id: 'chl-triltril',
    name: 'TRIL TRIL',
    flag: 'CHL',
  },
  {
    id: 'cri-puertosoley',
    name: 'PUERTO SOLEY',
    flag: 'CRI',
  },
  {
    id: 'cri-samara',
    name: 'SAMARA',
    flag: 'CRI',
  },
  {
    id: 'ecu-desembarcacderomachalilla',
    name: 'DESEMBARCACDERO MACHALILLA',
    flag: 'ECU',
  },
  {
    id: 'ecu-desembarcaderodonjuan',
    name: 'DESEMBARCADERO DON JUAN',
    flag: 'ECU',
  },
  {
    id: 'ecu-desembarcaderolachorrera',
    name: 'DESEMBARCADERO LA CHORRERA',
    flag: 'ECU',
  },
  {
    id: 'ecu-desembarcaderopalmar',
    name: 'DESEMBARCADERO PALMAR',
    flag: 'ECU',
  },
  {
    id: 'ecu-desembarcaderosua',
    name: 'DESEMBARCADERO SUA',
    flag: 'ECU',
  },
  {
    id: 'ecu-monteverde',
    name: 'MONTEVERDE',
    flag: 'ECU',
  },
  {
    id: 'nor-hollen',
    name: 'HOLLEN',
    flag: 'NOR',
  },
  {
    id: 'nor-lyngor',
    name: 'LYNGOR',
    flag: 'NOR',
  },
  {
    id: 'nor-sorfugloy',
    name: 'SORFUGLOY',
    flag: 'NOR',
  },
  {
    id: 'nor-sula',
    name: 'SULA',
    flag: 'NOR',
  },
  {
    id: 'nor-trysnes',
    name: 'TRYSNES',
    flag: 'NOR',
  },
  {
    id: 'nor-volda',
    name: 'VOLDA',
    flag: 'NOR',
  },
  {
    id: 'pan-bocaparita',
    name: 'BOCA PARITA',
    flag: 'PAN',
  },
  {
    id: 'pan-puertocaimito',
    name: 'PUERTO CAIMITO',
    flag: 'PAN',
  },
  {
    id: 'pan-puertoremedios',
    name: 'PUERTO REMEDIOS',
    flag: 'PAN',
  },
  {
    id: 'pan-taboguilla',
    name: 'TABOGUILLA',
    flag: 'PAN',
  },
  {
    id: 'per-morin',
    name: 'MORIN',
    flag: 'PER',
  },
  {
    id: 'per-muelledeeten',
    name: 'MUELLE DE ETEN',
    flag: 'PER',
  },
  {
    id: 'per-quilca',
    name: 'QUILCA',
    flag: 'PER',
  },
]

export default ports
