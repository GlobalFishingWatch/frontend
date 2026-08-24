const flags = [
  {
    id: '',
    label: 'Unflagged',
  },
  {
    id: 'ABW',
    label: 'Aruba',
  },
  {
    id: 'AFG',
    label: 'Afghanistan',
  },
  {
    id: 'AGO',
    label: 'Angola',
  },
  {
    id: 'AIA',
    label: 'Anguilla',
  },
  {
    id: 'ALA',
    label: 'Åland Islands',
  },
  {
    id: 'ALB',
    label: 'Albania',
  },
  {
    id: 'AND',
    label: 'Andorra',
  },
  {
    id: 'ARE',
    label: 'United Arab Emirates',
  },
  {
    id: 'ARG',
    label: 'Argentina',
  },
  {
    id: 'ARM',
    label: 'Armenia',
    alias: 'Hayastan',
  },
  {
    id: 'ASM',
    label: 'American Samoa',
    alias: 'Amerika Sāmoa',
  },
  {
    id: 'ATA',
    label: 'Antarctica',
  },
  {
    id: 'ATF',
    label: 'French Southern and Antarctic Lands',
    alias: 'Terres australes et antarctiques françaises',
  },
  {
    id: 'ATG',
    label: 'Antigua and Barbuda',
  },
  {
    id: 'AUS',
    label: 'Australia',
  },
  {
    id: 'AUT',
    label: 'Austria',
    alias: 'Österreich',
  },
  {
    id: 'AZE',
    label: 'Azerbaijan',
    alias: 'Azərbaycan',
  },
  {
    id: 'BDI',
    label: 'Burundi',
  },
  {
    id: 'BEL',
    label: 'Belgium',
    alias: ['België', 'Belgique', 'Belgien'],
  },
  {
    id: 'BEN',
    label: 'Benin',
  },
  {
    id: 'BFA',
    label: 'Burkina Faso',
  },
  {
    id: 'BGD',
    label: 'Bangladesh',
  },
  {
    id: 'BGR',
    label: 'Bulgaria',
    alias: 'Bǎlgariya',
  },
  {
    id: 'BHR',
    label: 'Bahrain',
    alias: 'Baḥrayn',
  },
  {
    id: 'BHS',
    label: 'Bahamas',
  },
  {
    id: 'BIH',
    label: 'Bosnia and Herzegovina',
    alias: 'Hercegovina',
  },
  {
    id: 'BLM',
    label: 'Saint Barthélemy',
  },
  {
    id: 'SHN',
    label: 'Saint Helena Ascension and Tristan da Cunha',
  },
  {
    id: 'BLR',
    label: 'Belarus',
  },
  {
    id: 'BLZ',
    label: 'Belize',
  },
  {
    id: 'BMU',
    label: 'Bermuda',
  },
  {
    id: 'BOL',
    label: 'Bolivia',
  },
  {
    id: 'BES',
    label: 'Caribbean Netherlands',
    alias: 'Caribisch Nederland',
  },
  {
    id: 'BRA',
    label: 'Brazil',
    alias: 'Brasil',
  },
  {
    id: 'BRB',
    label: 'Barbados',
  },
  {
    id: 'BRN',
    label: 'Brunei',
  },
  {
    id: 'BTN',
    label: 'Bhutan',
    alias: 'Druk Gyal Khap',
  },
  {
    id: 'BVT',
    label: 'Bouvet Island',
  },
  {
    id: 'BWA',
    label: 'Botswana',
  },
  {
    id: 'CAF',
    label: 'Central African Republic',
    alias: ['Ködörösêse tî Bêafrîka', 'République centrafricaine'],
  },
  {
    id: 'CAN',
    label: 'Canada',
  },
  {
    id: 'CCK',
    label: 'Cocos (Keeling) Islands',
  },
  {
    id: 'CHE',
    label: 'Switzerland',
    alias: ['Schweizerische', 'Suisse', 'Svizzera', 'Svizra', 'Helvetica'],
  },
  {
    id: 'CHL',
    label: 'Chile',
  },
  {
    id: 'CHN',
    label: 'China',
    alias: 'Zhōnghuá Rénmín Gònghéguó',
  },
  {
    id: 'CIV',
    label: 'Ivory Coast',
    alias: "Côte d'Ivoire",
  },
  {
    id: 'CMR',
    label: 'Cameroon',
    alias: 'Cameroun',
  },
  {
    id: 'COD',
    label: 'DR Congo',
    alias: 'Kôngo',
  },
  {
    id: 'COG',
    label: 'Republic of the Congo',
    alias: 'Kôngo',
  },
  {
    id: 'COK',
    label: 'Cook Islands',
    alias: "Kūki 'Āirani",
  },
  {
    id: 'COL',
    label: 'Colombia',
  },
  {
    id: 'COM',
    label: 'Comoros',
    alias: ['Qumurī', 'Komori'],
  },
  {
    id: 'CPV',
    label: 'Cape Verde',
    alias: 'Kabu Verdi',
  },
  {
    id: 'CRI',
    label: 'Costa Rica',
  },
  {
    id: 'CUB',
    label: 'Cuba',
  },
  {
    id: 'CUW',
    label: 'Curaçao',
  },
  {
    id: 'CXR',
    label: 'Christmas Island',
  },
  {
    id: 'CYM',
    label: 'Cayman Islands',
  },
  {
    id: 'CYP',
    label: 'Cyprus',
    alias: 'Cumhuriyeti',
  },
  {
    id: 'CZE',
    label: 'Czech Republic',
    alias: 'Česká',
  },
  {
    id: 'DEU',
    label: 'Germany',
    alias: 'Deutschland',
  },
  {
    id: 'DJI',
    label: 'Djibouti',
    alias: ['Jabuuti', 'Gabuutih'],
  },
  {
    id: 'DMA',
    label: 'Dominica',
  },
  {
    id: 'DNK',
    label: 'Denmark',
    alias: 'Danmark',
  },
  {
    id: 'DOM',
    label: 'Dominican Republic',
    alias: 'República Dominicana',
  },
  {
    id: 'DZA',
    label: 'Algeria',
    alias: 'Algérienne',
  },
  {
    id: 'ECU',
    label: 'Ecuador',
    alias: ['Ikwayur', 'Ekuatur'],
  },
  {
    id: 'EGY',
    label: 'Egypt',
  },
  {
    id: 'ERI',
    label: 'Eritrea',
  },
  {
    id: 'ESH',
    label: 'Western Sahara',
    alias: ['Taneẓroft Tutrimt', 'Sahara Occidental'],
  },
  {
    id: 'ESP',
    label: 'Spain',
    alias: ['España'],
  },
  {
    id: 'EST',
    label: 'Estonia',
    alias: 'Eesti',
  },
  {
    id: 'ETH',
    label: 'Ethiopia',
  },
  {
    id: 'FIN',
    label: 'Finland',
    alias: 'Suomen',
  },
  {
    id: 'FJI',
    label: 'Fiji',
    alias: 'Matanitu Tugalala o Viti',
  },
  {
    id: 'FLK',
    label: 'Falkland Islands',
  },
  {
    id: 'FRA',
    label: 'France',
    alias: 'française',
  },
  {
    id: 'FRO',
    label: 'Faroe Islands',
  },
  {
    id: 'FSM',
    label: 'Micronesia',
  },
  {
    id: 'GAB',
    label: 'Gabon',
  },
  {
    id: 'GBR',
    label: 'United Kingdom',
  },
  {
    id: 'GEO',
    label: 'Georgia',
  },
  {
    id: 'GGY',
    label: 'Guernsey',
  },
  {
    id: 'GHA',
    label: 'Ghana',
  },
  {
    id: 'GIB',
    label: 'Gibraltar',
  },
  {
    id: 'GIN',
    label: 'Guinea',
    alias: 'Guinée',
  },
  {
    id: 'GLP',
    label: 'Guadeloupe',
  },
  {
    id: 'GMB',
    label: 'Gambia',
  },
  {
    id: 'GNB',
    label: 'Guinea-Bissau',
  },
  {
    id: 'GNQ',
    label: 'Equatorial Guinea',
  },
  {
    id: 'GRC',
    label: 'Greece',
    alias: ['Ellinikí', 'Hellas'],
  },
  {
    id: 'GRD',
    label: 'Grenada',
  },
  {
    id: 'GRL',
    label: 'Greenland',
    alias: ['Kalaallit Nunaat', 'Grønland'],
  },
  {
    id: 'GTM',
    label: 'Guatemala',
  },
  {
    id: 'GUF',
    label: 'French Guiana',
    alias: 'Guyane',
  },
  {
    id: 'GUM',
    label: 'Guam',
    alias: 'Guåhån',
  },
  {
    id: 'GUY',
    label: 'Guyana',
  },
  {
    id: 'HKG',
    label: 'Hong Kong',
  },
  {
    id: 'HMD',
    label: 'Heard Island and McDonald Islands',
  },
  {
    id: 'HND',
    label: 'Honduras',
  },
  {
    id: 'HRV',
    label: 'Croatia',
    alias: 'Hrvatska',
  },
  {
    id: 'HTI',
    label: 'Haiti',
    alias: 'Ayiti',
  },
  {
    id: 'HUN',
    label: 'Hungary',
    alias: 'Magyarország',
  },
  {
    id: 'IDN',
    label: 'Indonesia',
  },
  {
    id: 'IMN',
    label: 'Isle of Man',
  },
  {
    id: 'IND',
    label: 'India',
  },
  {
    id: 'IOT',
    label: 'British Indian Ocean Territory',
  },
  {
    id: 'IRL',
    label: 'Ireland',
    alias: ['Éire', 'Airlann'],
  },
  {
    id: 'IRN',
    label: 'Iran',
  },
  {
    id: 'IRQ',
    label: 'Iraq',
  },
  {
    id: 'ISL',
    label: 'Iceland',
    alias: 'Ísland',
  },
  {
    id: 'ISR',
    label: 'Israel',
  },
  {
    id: 'ITA',
    label: 'Italy',
    alias: 'Italia',
  },
  {
    id: 'JAM',
    label: 'Jamaica',
  },
  {
    id: 'JEY',
    label: 'Jersey',
  },
  {
    id: 'JOR',
    label: 'Jordan',
  },
  {
    id: 'JPN',
    label: 'Japan',
    alias: ['Nippon', 'Nihon'],
  },
  {
    id: 'KAZ',
    label: 'Kazakhstan',
    alias: 'Qazaqstan',
  },
  {
    id: 'KEN',
    label: 'Kenya',
  },
  {
    id: 'KGZ',
    label: 'Kyrgyzstan',
    alias: 'Kırğız',
  },
  {
    id: 'KHM',
    label: 'Cambodia',
    alias: ['kampuciə', 'Cambodge'],
  },
  {
    id: 'KIR',
    label: 'Kiribati',
  },
  {
    id: 'KNA',
    label: 'Saint Kitts and Nevis',
  },
  {
    id: 'KOR',
    label: 'South Korea',
    alias: 'Daehan Minguk',
  },
  {
    id: 'UNK',
    label: 'Kosovo',
  },
  {
    id: 'KWT',
    label: 'Kuwait',
  },
  {
    id: 'LAO',
    label: 'Laos',
  },
  {
    id: 'LBN',
    label: 'Lebanon',
    alias: ['Liban', 'Lubnān'],
  },
  {
    id: 'LBR',
    label: 'Liberia',
  },
  {
    id: 'LBY',
    label: 'Libya',
  },
  {
    id: 'LCA',
    label: 'Saint Lucia',
  },
  {
    id: 'LIE',
    label: 'Liechtenstein',
  },
  {
    id: 'LKA',
    label: 'Sri Lanka',
  },
  {
    id: 'LSO',
    label: 'Lesotho',
  },
  {
    id: 'LTU',
    label: 'Lithuania',
    alias: 'Lietuva',
  },
  {
    id: 'LUX',
    label: 'Luxembourg',
    alias: 'Lëtzebuerg',
  },
  {
    id: 'LVA',
    label: 'Latvia',
    alias: 'Latvijas',
  },
  {
    id: 'MAC',
    label: 'Macau',
  },
  {
    id: 'MAF',
    label: 'Saint Martin',
  },
  {
    id: 'MAR',
    label: 'Morocco',
  },
  {
    id: 'MCO',
    label: 'Monaco',
  },
  {
    id: 'MDA',
    label: 'Moldova',
  },
  {
    id: 'MDG',
    label: 'Madagascar',
  },
  {
    id: 'MDV',
    label: 'Maldives',
  },
  {
    id: 'MEX',
    label: 'Mexico',
  },
  {
    id: 'MHL',
    label: 'Marshall Islands',
  },
  {
    id: 'MKD',
    label: 'Macedonia',
  },
  {
    id: 'MLI',
    label: 'Mali',
  },
  {
    id: 'MLT',
    label: 'Malta',
  },
  {
    id: 'MMR',
    label: 'Myanmar',
    alias: 'Burma',
  },
  {
    id: 'MNE',
    label: 'Montenegro',
    alias: 'Crna Gora',
  },
  {
    id: 'MNG',
    label: 'Mongolia',
  },
  {
    id: 'MNP',
    label: 'Northern Mariana Islands',
  },
  {
    id: 'MOZ',
    label: 'Mozambique',
    alias: ['Mozambiki', 'Msumbiji'],
  },
  {
    id: 'MRT',
    label: 'Mauritania',
    alias: 'Mūrītānīyah',
  },
  {
    id: 'MSR',
    label: 'Montserrat',
  },
  {
    id: 'MTQ',
    label: 'Martinique',
  },
  {
    id: 'MUS',
    label: 'Mauritius',
  },
  {
    id: 'MWI',
    label: 'Malawi',
  },
  {
    id: 'MYS',
    label: 'Malaysia',
  },
  {
    id: 'MYT',
    label: 'Mayotte',
  },
  {
    id: 'NAM',
    label: 'Namibia',
  },
  {
    id: 'NCL',
    label: 'New Caledonia',
  },
  {
    id: 'NER',
    label: 'Niger',
  },
  {
    id: 'NFK',
    label: 'Norfolk Island',
  },
  {
    id: 'NGA',
    label: 'Nigeria',
    alias: ['Nijeriya', 'Naìjíríyà'],
  },
  {
    id: 'NIC',
    label: 'Nicaragua',
  },
  {
    id: 'NIU',
    label: 'Niue',
  },
  {
    id: 'NLD',
    label: 'Netherlands',
    alias: 'Nederland',
  },
  {
    id: 'NOR',
    label: 'Norway',
    alias: 'Norge',
  },
  {
    id: 'NPL',
    label: 'Nepal',
  },
  {
    id: 'NRU',
    label: 'Nauru',
  },
  {
    id: 'NZL',
    label: 'New Zealand',
    alias: 'Aotearoa',
  },
  {
    id: 'OMN',
    label: 'Oman',
    alias: 'ʻUmān',
  },
  {
    id: 'PAK',
    label: 'Pakistan',
  },
  {
    id: 'PAN',
    label: 'Panama',
  },
  {
    id: 'PCN',
    label: 'Pitcairn Islands',
  },
  {
    id: 'PER',
    label: 'Peru',
  },
  {
    id: 'PHL',
    label: 'Philippines',
    alias: 'Pilipinas',
  },
  {
    id: 'PLW',
    label: 'Palau',
  },
  {
    id: 'PNG',
    label: 'Papua New Guinea',
  },
  {
    id: 'POL',
    label: 'Poland',
    alias: 'Polska',
  },
  {
    id: 'PRI',
    label: 'Puerto Rico',
  },
  {
    id: 'PRK',
    label: 'North Korea',
    alias: 'PRK',
  },
  {
    id: 'PRT',
    label: 'Portugal',
  },
  {
    id: 'PRY',
    label: 'Paraguay',
  },
  {
    id: 'PSE',
    label: 'Palestine',
    alias: 'Dawlat Filasṭīn',
  },
  {
    id: 'PYF',
    label: 'French Polynesia',
    alias: ['Polynésie française', 'Pōrīnetia Farāni'],
  },
  {
    id: 'QAT',
    label: 'Qatar',
  },
  {
    id: 'REU',
    label: 'Réunion',
  },
  {
    id: 'ROU',
    label: 'Romania',
  },
  {
    id: 'RUS',
    label: 'Russia',
    alias: 'Rossiya',
  },
  {
    id: 'RWA',
    label: 'Rwanda',
  },
  {
    id: 'SAU',
    label: 'Saudi Arabia',
    alias: 'Arabīyah as-Saʿūdīyah',
  },
  {
    id: 'SDN',
    label: 'Sudan',
  },
  {
    id: 'SEN',
    label: 'Senegal',
  },
  {
    id: 'SGP',
    label: 'Singapore',
  },
  {
    id: 'SGS',
    label: 'South Georgia',
  },
  {
    id: 'SJM',
    label: 'Svalbard and Jan Mayen',
  },
  {
    id: 'SLB',
    label: 'Solomon Islands',
  },
  {
    id: 'SLE',
    label: 'Sierra Leone',
  },
  {
    id: 'SLV',
    label: 'El Salvador',
  },
  {
    id: 'SMR',
    label: 'San Marino',
  },
  {
    id: 'SOM',
    label: 'Somalia',
  },
  {
    id: 'SPM',
    label: 'Saint Pierre and Miquelon',
  },
  {
    id: 'SRB',
    label: 'Serbia',
    alias: 'Srbija',
  },
  {
    id: 'SSD',
    label: 'South Sudan',
  },
  {
    id: 'STP',
    label: 'São Tomé and Príncipe',
  },
  {
    id: 'SUR',
    label: 'Suriname',
  },
  {
    id: 'SVK',
    label: 'Slovakia',
    alias: 'Slovenská',
  },
  {
    id: 'SVN',
    label: 'Slovenia',
    alias: 'Slovenija',
  },
  {
    id: 'SWE',
    label: 'Sweden',
    alias: 'Sverige',
  },
  {
    id: 'SWZ',
    label: 'Eswatini',
  },
  {
    id: 'SXM',
    label: 'Sint Maarten',
  },
  {
    id: 'SYC',
    label: 'Seychelles',
  },
  {
    id: 'SYR',
    label: 'Syria',
  },
  {
    id: 'TCA',
    label: 'Turks and Caicos Islands',
  },
  {
    id: 'TCD',
    label: 'Chad',
  },
  {
    id: 'TGO',
    label: 'Togo',
  },
  {
    id: 'THA',
    label: 'Thailand',
  },
  {
    id: 'TJK',
    label: 'Tajikistan',
  },
  {
    id: 'TKL',
    label: 'Tokelau',
  },
  {
    id: 'TKM',
    label: 'Turkmenistan',
  },
  {
    id: 'TLS',
    label: 'Timor-Leste',
  },
  {
    id: 'TON',
    label: 'Tonga',
  },
  {
    id: 'TTO',
    label: 'Trinidad and Tobago',
  },
  {
    id: 'TUN',
    label: 'Tunisia',
    alias: 'Tūnisīyah',
  },
  {
    id: 'TUR',
    label: 'Turkey',
    alias: 'Türkiye',
  },
  {
    id: 'TUV',
    label: 'Tuvalu',
  },
  {
    id: 'TWN',
    label: 'Chinese Taipei',
    alias: ['Taiwan'],
  },
  {
    id: 'TZA',
    label: 'Tanzania',
  },
  {
    id: 'UGA',
    label: 'Uganda',
  },
  {
    id: 'UKR',
    label: 'Ukraine',
    alias: 'Ukrayina',
  },
  {
    id: 'UMI',
    label: 'United States Minor Outlying Islands',
  },
  {
    id: 'URY',
    label: 'Uruguay',
  },
  {
    id: 'USA',
    label: 'United States of America',
  },
  {
    id: 'UZB',
    label: 'Uzbekistan',
  },
  {
    id: 'VAT',
    label: 'Vatican City',
  },
  {
    id: 'VCT',
    label: 'Saint Vincent and the Grenadines',
  },
  {
    id: 'VEN',
    label: 'Venezuela',
  },
  {
    id: 'VGB',
    label: 'British Virgin Islands',
  },
  {
    id: 'VIR',
    label: 'United States Virgin Islands',
  },
  {
    id: 'VNM',
    label: 'Vietnam',
  },
  {
    id: 'VUT',
    label: 'Vanuatu',
  },
  {
    id: 'WLF',
    label: 'Wallis and Futuna',
  },
  {
    id: 'WSM',
    label: 'Samoa',
  },
  {
    id: 'YEM',
    label: 'Yemen',
  },
  {
    id: 'ZAF',
    label: 'South Africa',
  },
  {
    id: 'ZMB',
    label: 'Zambia',
  },
  {
    id: 'ZWE',
    label: 'Zimbabwe',
  },
]

export default flags
