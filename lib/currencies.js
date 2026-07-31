/**
 * Currencies Registry for AfriChange PWA
 * Covers African monetary zones (WAEMU/BCEAO, CEMAC/BEAC, WAMZ, EAC, SADC, AMU) and major global currencies.
 */

export const REGIONS = {
  ALL: 'all',
  WEST_AFRICA: 'west_africa',
  CENTRAL_AFRICA: 'central_africa',
  EAST_AFRICA: 'east_africa',
  NORTH_AFRICA: 'north_africa',
  SOUTHERN_AFRICA: 'southern_africa',
  INTERNATIONAL: 'international',
};

export const REGION_NAMES = {
  fr: {
    [REGIONS.ALL]: 'Toutes les devises',
    [REGIONS.WEST_AFRICA]: "Afrique de l'Ouest",
    [REGIONS.CENTRAL_AFRICA]: 'Afrique Centrale',
    [REGIONS.EAST_AFRICA]: "Afrique de l'Est",
    [REGIONS.NORTH_AFRICA]: 'Afrique du Nord',
    [REGIONS.SOUTHERN_AFRICA]: 'Afrique Australe',
    [REGIONS.INTERNATIONAL]: 'Internationales',
  },
  en: {
    [REGIONS.ALL]: 'All Currencies',
    [REGIONS.WEST_AFRICA]: 'West Africa',
    [REGIONS.CENTRAL_AFRICA]: 'Central Africa',
    [REGIONS.EAST_AFRICA]: 'East Africa',
    [REGIONS.NORTH_AFRICA]: 'North Africa',
    [REGIONS.SOUTHERN_AFRICA]: 'Southern Africa',
    [REGIONS.INTERNATIONAL]: 'International',
  },
  es: {
    [REGIONS.ALL]: 'Todas las monedas',
    [REGIONS.WEST_AFRICA]: 'África Occidental',
    [REGIONS.CENTRAL_AFRICA]: 'África Central',
    [REGIONS.EAST_AFRICA]: 'África Oriental',
    [REGIONS.NORTH_AFRICA]: 'África del Norte',
    [REGIONS.SOUTHERN_AFRICA]: 'África Austral',
    [REGIONS.INTERNATIONAL]: 'Internacionales',
  },
  wo: {
    [REGIONS.ALL]: 'Koparr yépp',
    [REGIONS.WEST_AFRICA]: 'Sowwu Afrik',
    [REGIONS.CENTRAL_AFRICA]: 'Diggu Afrik',
    [REGIONS.EAST_AFRICA]: 'Penku Afrik',
    [REGIONS.NORTH_AFRICA]: 'Bëj-gànnaaru Afrik',
    [REGIONS.SOUTHERN_AFRICA]: 'Bëj-saalu Afrik',
    [REGIONS.INTERNATIONAL]: 'Bitim réew',
  },
};

export const CURRENCIES = [
  // Afrique de l'Ouest
  { code: 'XOF', name: 'Franc CFA (BCEAO)', country: 'sn', symbol: 'CFA', region: REGIONS.WEST_AFRICA, decimals: 0 },
  { code: 'NGN', name: 'Naira nigérian', country: 'ng', symbol: '₦', region: REGIONS.WEST_AFRICA, decimals: 2 },
  { code: 'GHS', name: 'Cedi ghanéen', country: 'gh', symbol: '₵', region: REGIONS.WEST_AFRICA, decimals: 2 },
  { code: 'GMD', name: 'Dalasi gambien', country: 'gm', symbol: 'D', region: REGIONS.WEST_AFRICA, decimals: 2 },
  { code: 'SLE', name: 'Leone sierra-léonais', country: 'sl', symbol: 'Le', region: REGIONS.WEST_AFRICA, decimals: 2 },
  { code: 'CVE', name: 'Escudo cap-verdien', country: 'cv', symbol: '$', region: REGIONS.WEST_AFRICA, decimals: 2 },
  { code: 'GNF', name: 'Franc guinéen', country: 'gn', symbol: 'FG', region: REGIONS.WEST_AFRICA, decimals: 0 },
  { code: 'LRD', name: 'Dollar libérien', country: 'lr', symbol: 'L$', region: REGIONS.WEST_AFRICA, decimals: 2 },
  { code: 'MRU', name: 'Ouguiya mauritanien', country: 'mr', symbol: 'UM', region: REGIONS.WEST_AFRICA, decimals: 2 },

  // Afrique Centrale
  { code: 'XAF', name: 'Franc CFA (BEAC)', country: 'cm', symbol: 'FCFA', region: REGIONS.CENTRAL_AFRICA, decimals: 0 },
  { code: 'CDF', name: 'Franc congolais (RDC)', country: 'cd', symbol: 'FC', region: REGIONS.CENTRAL_AFRICA, decimals: 2 },
  { code: 'STN', name: 'Dobra santoméen', country: 'st', symbol: 'Db', region: REGIONS.CENTRAL_AFRICA, decimals: 2 },

  // Afrique de l'Est
  { code: 'KES', name: 'Shilling kényan', country: 'ke', symbol: 'KSh', region: REGIONS.EAST_AFRICA, decimals: 2 },
  { code: 'TZS', name: 'Shilling tanzanien', country: 'tz', symbol: 'TSh', region: REGIONS.EAST_AFRICA, decimals: 2 },
  { code: 'UGX', name: 'Shilling ougandais', country: 'ug', symbol: 'USh', region: REGIONS.EAST_AFRICA, decimals: 0 },
  { code: 'ETB', name: 'Birr éthiopien', country: 'et', symbol: 'Br', region: REGIONS.EAST_AFRICA, decimals: 2 },
  { code: 'RWF', name: 'Franc rwandais', country: 'rw', symbol: 'FRw', region: REGIONS.EAST_AFRICA, decimals: 0 },
  { code: 'BIF', name: 'Franc burundais', country: 'bi', symbol: 'FBu', region: REGIONS.EAST_AFRICA, decimals: 0 },
  { code: 'MUR', name: 'Roupie mauricienne', country: 'mu', symbol: 'Rs', region: REGIONS.EAST_AFRICA, decimals: 2 },
  { code: 'MGA', name: 'Ariary malgache', country: 'mg', symbol: 'Ar', region: REGIONS.EAST_AFRICA, decimals: 0 },
  { code: 'SCR', name: 'Roupie seychelloise', country: 'sc', symbol: 'SR', region: REGIONS.EAST_AFRICA, decimals: 2 },

  // Afrique du Nord
  { code: 'MAD', name: 'Dirham marocain', country: 'ma', symbol: 'DH', region: REGIONS.NORTH_AFRICA, decimals: 2 },
  { code: 'DZD', name: 'Dinar algérien', country: 'dz', symbol: 'DA', region: REGIONS.NORTH_AFRICA, decimals: 2 },
  { code: 'TND', name: 'Dinar tunisien', country: 'tn', symbol: 'DT', region: REGIONS.NORTH_AFRICA, decimals: 3 },
  { code: 'EGP', name: 'Livre égyptienne', country: 'eg', symbol: 'E£', region: REGIONS.NORTH_AFRICA, decimals: 2 },

  // Afrique Australe
  { code: 'ZAR', name: 'Rand sud-africain', country: 'za', symbol: 'R', region: REGIONS.SOUTHERN_AFRICA, decimals: 2 },
  { code: 'BWP', name: 'Pula botswanais', country: 'bw', symbol: 'P', region: REGIONS.SOUTHERN_AFRICA, decimals: 2 },
  { code: 'NAD', name: 'Dollar namibien', country: 'na', symbol: 'N$', region: REGIONS.SOUTHERN_AFRICA, decimals: 2 },
  { code: 'MZN', name: 'Metical mozambicain', country: 'mz', symbol: 'MT', region: REGIONS.SOUTHERN_AFRICA, decimals: 2 },
  { code: 'ZMW', name: 'Kwacha zambien', country: 'zm', symbol: 'ZK', region: REGIONS.SOUTHERN_AFRICA, decimals: 2 },

  // International
  { code: 'EUR', name: 'Euro', country: 'eu', symbol: '€', region: REGIONS.INTERNATIONAL, decimals: 2 },
  { code: 'USD', name: 'Dollar américain', country: 'us', symbol: '$', region: REGIONS.INTERNATIONAL, decimals: 2 },
  { code: 'GBP', name: 'Livre sterling', country: 'gb', symbol: '£', region: REGIONS.INTERNATIONAL, decimals: 2 },
  { code: 'CAD', name: 'Dollar canadien', country: 'ca', symbol: 'C$', region: REGIONS.INTERNATIONAL, decimals: 2 },
  { code: 'CHF', name: 'Franc suisse', country: 'ch', symbol: 'CHF', region: REGIONS.INTERNATIONAL, decimals: 2 },
  { code: 'JPY', name: 'Yen japonais', country: 'jp', symbol: '¥', region: REGIONS.INTERNATIONAL, decimals: 0 },
  { code: 'CNY', name: 'Yuan chinois', country: 'cn', symbol: '¥', region: REGIONS.INTERNATIONAL, decimals: 2 },
  { code: 'AED', name: 'Dirham des E.A.U.', country: 'ae', symbol: 'AED', region: REGIONS.INTERNATIONAL, decimals: 2 },
  { code: 'SAR', name: 'Riyal saoudien', country: 'sa', symbol: 'SR', region: REGIONS.INTERNATIONAL, decimals: 2 },
];

export const getCurrencyByCode = (code) => {
  if (!code) return null;
  return CURRENCIES.find((c) => c.code.toUpperCase() === code.toUpperCase()) || {
    code: code.toUpperCase(),
    name: code.toUpperCase(),
    country: 'un',
    symbol: code,
    region: REGIONS.ALL,
    decimals: 2,
  };
};

// Fixed parity note for Franc CFA
export const FIXED_PARITIES = {
  'EUR_XOF': 655.957,
  'XOF_EUR': 1 / 655.957,
  'EUR_XAF': 655.957,
  'XAF_EUR': 1 / 655.957,
  'XOF_XAF': 1.0,
  'XAF_XOF': 1.0,
};
