import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../lib/payment-advisor.js', import.meta.url), 'utf8');
const { calculatePaymentOptions } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('ranks the four payment options by their real home-currency cost', () => {
  const result = calculatePaymentOptions({
    amountLocal: 10000,
    marketRate: 100,
    card: { markupPct: 1, fixedFeeHome: 0 },
    atm: { markupPct: 2, fixedFeeHome: 3, localFee: 100 },
    exchange: { spreadPct: 3, fixedFeeHome: 0 },
    dcc: { markupPct: 8, fixedFeeHome: 0 },
  });

  assert.equal(result.referenceCost, 100);
  assert.deepEqual(result.options.map((item) => item.id), ['card', 'exchange', 'atm', 'dcc']);
  assert.equal(result.best.id, 'card');
  assert.equal(result.options.length, 4);
  assert.ok(Math.abs(result.savingsVsWorst - 7) < 1e-10);
});

test('uses an offered exchange-office rate when one is supplied', () => {
  const result = calculatePaymentOptions({
    amountLocal: 10000,
    marketRate: 100,
    exchange: { spreadPct: 30, offeredRate: 98, fixedFeeHome: 2 },
  });
  const exchange = result.options.find((item) => item.id === 'exchange');

  assert.equal(exchange.isEstimatedRate, false);
  assert.equal(exchange.offeredRate, 98);
  assert.ok(Math.abs(exchange.cost - (10000 / 98 + 2)) < 1e-10);
});

test('falls back safely for malformed fee values and rejects invalid core inputs', () => {
  const valid = calculatePaymentOptions({ amountLocal: 5000, marketRate: 50, card: { markupPct: -2 } });
  const card = valid.options.find((item) => item.id === 'card');
  assert.equal(card.cost, 102);

  assert.deepEqual(calculatePaymentOptions({ amountLocal: 0, marketRate: 50 }).options, []);
  assert.deepEqual(calculatePaymentOptions({ amountLocal: 100, marketRate: 0 }).options, []);
});

test('does not report negative extra cost for an unusually favorable offered rate', () => {
  const result = calculatePaymentOptions({
    amountLocal: 10000,
    marketRate: 100,
    exchange: { offeredRate: 105 },
  });
  const exchange = result.options.find((item) => item.id === 'exchange');
  assert.equal(exchange.extra, 0);
  assert.equal(exchange.extraPct, 0);
});
