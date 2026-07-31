import { calculateCrossRate, STATIC_BASELINE_RATES_EUR } from '../lib/rates';
import { FIXED_PARITIES, getCurrencyByCode } from '../lib/currencies';

describe('AfriChange Currency Converter Core Logic', () => {
  test('Fixed parity conversion between EUR and XOF (Franc CFA)', () => {
    const rate = calculateCrossRate('EUR', 'XOF', STATIC_BASELINE_RATES_EUR, 'EUR');
    expect(rate).toBe(655.957);
  });

  test('Fixed parity conversion between XOF and XAF is 1.0', () => {
    const rate = calculateCrossRate('XOF', 'XAF', STATIC_BASELINE_RATES_EUR, 'EUR');
    expect(rate).toBe(1.0);
  });

  test('Identity conversion (same currency) returns 1.0', () => {
    const rate = calculateCrossRate('NGN', 'NGN', STATIC_BASELINE_RATES_EUR, 'EUR');
    expect(rate).toBe(1.0);
  });

  test('Cross rate triangulation between XOF and NGN', () => {
    const rate = calculateCrossRate('XOF', 'NGN', STATIC_BASELINE_RATES_EUR, 'EUR');
    expect(rate).toBeGreaterThan(0);
    // rate(XOF -> NGN) = rate(EUR -> NGN) / rate(EUR -> XOF)
    const expected = STATIC_BASELINE_RATES_EUR.NGN / STATIC_BASELINE_RATES_EUR.XOF;
    expect(rate).toBeCloseTo(expected, 4);
  });

  test('Currency metadata lookup returns correct decimals and symbol', () => {
    const xof = getCurrencyByCode('XOF');
    expect(xof.symbol).toBe('CFA');
    expect(xof.decimals).toBe(0);

    const ngn = getCurrencyByCode('NGN');
    expect(ngn.symbol).toBe('₦');
    expect(ngn.decimals).toBe(2);
  });
});
