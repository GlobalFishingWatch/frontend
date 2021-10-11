const flags = [
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
  },
  {
    id: 'ASM',
    label: 'American Samoa',
  },
  {
    id: 'ATA',
    label: 'Antarctica',
  },
  {
    id: 'ATF',
    label: 'French Southern and Antarctic Lands',
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
  },
  {
    id: 'AZE',
    label: 'Azerbaijan',
  },
  {
    id: 'BDI',
    label: 'Burundi',
  },
  {
    id: 'BEL',
    label: 'Belgium',
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
  },
  {
    id: 'BHR',
    label: 'Bahrain',
  },
  {
    id: 'BHS',
    label: 'Bahamas',
  },
  {
    id: 'BIH',
    label: 'Bosnia and Herzegovina',
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
  },
  {
    id: 'BRA',
    label: 'Brazil',
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
  },
  {
    id: 'CHL',
    label: 'Chile',
  },
  {
    id: 'CHN',
    label: 'China',
  },
  {
    id: 'CIV',
    label: 'Ivory Coast',
  },
  {
    id: 'CMR',
    label: 'Cameroon',
  },
  {
    id: 'COD',
    label: 'DR Congo',
  },
  {
    id: 'COG',
    label: 'Republic of the Congo',
  },
  {
    id: 'COK',
    label: 'Cook Islands',
  },
  {
    id: 'COL',
    label: 'Colombia',
  },
  {
    id: 'COM',
    label: 'Comoros',
  },
  {
    id: 'CPV',
    label: 'Cape Verde',
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
  },
  {
    id: 'CZE',
    label: 'Czech Republic',
  },
  {
    id: 'DEU',
    label: 'Germany',
  },
  {
    id: 'DJI',
    label: 'Djibouti',
  },
  {
    id: 'DMA',
    label: 'Dominica',
  },
  {
    id: 'DNK',
    label: 'Denmark',
  },
  {
    id: 'DOM',
    label: 'Dominican Republic',
  },
  {
    id: 'DZA',
    label: 'Algeria',
  },
  {
    id: 'ECU',
    label: 'Ecuador',
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
  },
  {
    id: 'ESP',
    label: 'Spain',
  },
  {
    id: 'EST',
    label: 'Estonia',
  },
  {
    id: 'ETH',
    label: 'Ethiopia',
  },
  {
    id: 'FIN',
    label: 'Finland',
  },
  {
    id: 'FJI',
    label: 'Fiji',
  },
  {
    id: 'FLK',
    label: 'Falkland Islands',
  },
  {
    id: 'FRA',
    label: 'France',
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
  },
  {
    id: 'GRD',
    label: 'Grenada',
  },
  {
    id: 'GRL',
    label: 'Greenland',
  },
  {
    id: 'GTM',
    label: 'Guatemala',
  },
  {
    id: 'GUF',
    label: 'French Guiana',
  },
  {
    id: 'GUM',
    label: 'Guam',
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
  },
  {
    id: 'HTI',
    label: 'Haiti',
  },
  {
    id: 'HUN',
    label: 'Hungary',
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
  },
  {
    id: 'ISR',
    label: 'Israel',
  },
  {
    id: 'ITA',
    label: 'Italy',
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
  },
  {
    id: 'KAZ',
    label: 'Kazakhstan',
  },
  {
    id: 'KEN',
    label: 'Kenya',
  },
  {
    id: 'KGZ',
    label: 'Kyrgyzstan',
  },
  {
    id: 'KHM',
    label: 'Cambodia',
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
  },
  {
    id: 'LUX',
    label: 'Luxembourg',
  },
  {
    id: 'LVA',
    label: 'Latvia',
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
  },
  {
    id: 'MNE',
    label: 'Montenegro',
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
  },
  {
    id: 'MRT',
    label: 'Mauritania',
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
  },
  {
    id: 'NOR',
    label: 'Norway',
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
  },
  {
    id: 'OMN',
    label: 'Oman',
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
  },
  {
    id: 'PRI',
    label: 'Puerto Rico',
  },
  {
    id: 'PRK',
    label: 'North Korea',
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
  },
  {
    id: 'PYF',
    label: 'French Polynesia',
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
  },
  {
    id: 'RWA',
    label: 'Rwanda',
  },
  {
    id: 'SAU',
    label: 'Saudi Arabia',
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
  },
  {
    id: 'SVN',
    label: 'Slovenia',
  },
  {
    id: 'SWE',
    label: 'Sweden',
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
  },
  {
    id: 'TUR',
    label: 'Turkey',
  },
  {
    id: 'TUV',
    label: 'Tuvalu',
  },
  {
    id: 'TWN',
    label: 'Chinese Taipei',
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
