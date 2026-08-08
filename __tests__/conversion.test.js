import { calculateCrossRate } from '../lib/rates';
import { getCurrencyByCode } from '../lib/currencies';

const verifiedFixture = {
  EUR: 1,
  XOF: 655.957,
  XAF: 655.957,
  NGN: 1700,
  GMD: 80,
};

describe('AfriChange currency core', () => {
  test('uses the official fixed EUR/XOF parity', () => {
    expect(calculateCrossRate('EUR', 'XOF', verifiedFixture, 'EUR')).toBe(655.957);
  });

  test('uses the fixed XOF/XAF parity', () => {
    expect(calculateCrossRate('XOF', 'XAF', verifiedFixture, 'EUR')).toBe(1);
  });

  test('returns 1 for identity conversions', () => {
    expect(calculateCrossRate('NGN', 'NGN', verifiedFixture, 'EUR')).toBe(1);
  });

  test('triangulates non-fixed pairs from one normalized base table', () => {
    const rate = calculateCrossRate('GMD', 'NGN', verifiedFixture, 'EUR');
    expect(rate).toBeCloseTo(verifiedFixture.NGN / verifiedFixture.GMD, 8);
  });

  test('returns null when a required rate is missing', () => {
    expect(calculateCrossRate('GMD', 'KES', verifiedFixture, 'EUR')).toBeNull();
  });

  test('currency metadata keeps expected symbols and decimals', () => {
    expect(getCurrencyByCode('XOF')).toMatchObject({ symbol: 'CFA', decimals: 0 });
    expect(getCurrencyByCode('NGN')).toMatchObject({ symbol: '₦', decimals: 2 });
  });
});
