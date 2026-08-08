import { calculateCrossRate } from '../lib/rates';
import { getCurrencyByCode } from '../lib/currencies';

const verifiedFixture = {
  EUR: 1,
  XOF: 655.957,
  XAF: 655.957,
  NGN: 1700,
  GMD: 80,
  SLE: 26.5,
  GHS: 15.5,
  USD: 1.1,
  GBP: 0.84,
};

const criticalCurrencies = ['XOF', 'XAF', 'GMD', 'SLE', 'GHS', 'NGN', 'USD', 'EUR', 'GBP'];

describe('Kiwango currency core', () => {
  test('uses the official fixed EUR/XOF and EUR/XAF parity', () => {
    expect(calculateCrossRate('EUR', 'XOF', verifiedFixture, 'EUR')).toBe(655.957);
    expect(calculateCrossRate('EUR', 'XAF', verifiedFixture, 'EUR')).toBe(655.957);
    expect(calculateCrossRate('XOF', 'XAF', verifiedFixture, 'EUR')).toBe(1);
    expect(calculateCrossRate('XAF', 'XOF', verifiedFixture, 'EUR')).toBe(1);
  });

  test.each(criticalCurrencies)('returns 1 for %s identity conversion', (currency) => {
    expect(calculateCrossRate(currency, currency, verifiedFixture, 'EUR')).toBe(1);
  });

  test.each([
    ['GMD', 'NGN'],
    ['SLE', 'XOF'],
    ['GHS', 'USD'],
    ['NGN', 'GBP'],
    ['USD', 'EUR'],
    ['GBP', 'XAF'],
  ])('triangulates %s/%s from the normalized EUR table', (from, to) => {
    expect(calculateCrossRate(from, to, verifiedFixture, 'EUR')).toBeCloseTo(verifiedFixture[to] / verifiedFixture[from], 8);
  });

  test.each([
    ['GMD', 'XOF'],
    ['SLE', 'EUR'],
    ['GHS', 'NGN'],
    ['USD', 'GBP'],
  ])('swap conversion %s/%s is reciprocal', (from, to) => {
    const forward = calculateCrossRate(from, to, verifiedFixture, 'EUR');
    const reverse = calculateCrossRate(to, from, verifiedFixture, 'EUR');
    expect(forward * reverse).toBeCloseTo(1, 10);
  });

  test('returns null instead of fabricating a rate when data is missing', () => {
    expect(calculateCrossRate('GMD', 'KES', verifiedFixture, 'EUR')).toBeNull();
    expect(calculateCrossRate('KES', 'XOF', verifiedFixture, 'EUR')).toBeNull();
  });

  test('currency metadata covers the V1 critical currency set', () => {
    criticalCurrencies.forEach((code) => expect(getCurrencyByCode(code)?.code).toBe(code));
    expect(getCurrencyByCode('XOF')).toMatchObject({ symbol: 'CFA', decimals: 0 });
    expect(getCurrencyByCode('NGN')).toMatchObject({ symbol: '₦', decimals: 2 });
  });
});
