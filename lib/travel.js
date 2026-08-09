export const TRAVEL_DESTINATIONS = [
  { code: 'GM', country: 'Gambie', countryEn: 'Gambia', currency: 'GMD', flag: 'gm', pairs: ['XOF', 'EUR', 'USD'] },
  { code: 'SL', country: 'Sierra Leone', countryEn: 'Sierra Leone', currency: 'SLE', flag: 'sl', pairs: ['XOF', 'EUR', 'USD'] },
  { code: 'GH', country: 'Ghana', countryEn: 'Ghana', currency: 'GHS', flag: 'gh', pairs: ['XOF', 'EUR', 'USD'] },
  { code: 'NG', country: 'Nigeria', countryEn: 'Nigeria', currency: 'NGN', flag: 'ng', pairs: ['XOF', 'EUR', 'USD'] },
  { code: 'GN', country: 'Guinée', countryEn: 'Guinea', currency: 'GNF', flag: 'gn', pairs: ['XOF', 'EUR', 'USD'] },
  { code: 'CI', country: "Côte d'Ivoire", countryEn: "Côte d'Ivoire", currency: 'XOF', flag: 'ci', pairs: ['GMD', 'SLE', 'EUR', 'USD'] },
  { code: 'SN', country: 'Sénégal', countryEn: 'Senegal', currency: 'XOF', flag: 'sn', pairs: ['GMD', 'SLE', 'EUR', 'USD'] },
  { code: 'CM', country: 'Cameroun', countryEn: 'Cameroon', currency: 'XAF', flag: 'cm', pairs: ['XOF', 'EUR', 'USD'] },
  { code: 'KE', country: 'Kenya', countryEn: 'Kenya', currency: 'KES', flag: 'ke', pairs: ['EUR', 'USD', 'XOF'] },
  { code: 'MA', country: 'Maroc', countryEn: 'Morocco', currency: 'MAD', flag: 'ma', pairs: ['EUR', 'USD', 'XOF'] },
  { code: 'ZA', country: 'Afrique du Sud', countryEn: 'South Africa', currency: 'ZAR', flag: 'za', pairs: ['EUR', 'USD', 'XOF'] },
];

export function getTravelDestination(code) {
  return TRAVEL_DESTINATIONS.find((item) => item.code === code) || TRAVEL_DESTINATIONS[0];
}
