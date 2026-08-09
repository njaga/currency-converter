export const DEFAULT_PAYMENT_FEES = Object.freeze({
  card: Object.freeze({ markupPct: 2, fixedFeeHome: 0 }),
  atm: Object.freeze({ markupPct: 2, fixedFeeHome: 3, localFee: 0 }),
  exchange: Object.freeze({ spreadPct: 2, offeredRate: 0, fixedFeeHome: 0 }),
  dcc: Object.freeze({ markupPct: 7, fixedFeeHome: 0 }),
});

const METHOD_ORDER = ['card', 'atm', 'exchange', 'dcc'];

function positive(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function nonNegative(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : fallback;
}

function option(id, cost, referenceCost, details = {}) {
  const extra = Math.max(0, cost - referenceCost);
  return {
    id,
    cost,
    extra,
    extraPct: referenceCost > 0 ? (extra / referenceCost) * 100 : 0,
    ...details,
  };
}

export function calculatePaymentOptions({
  amountLocal,
  marketRate,
  card = {},
  atm = {},
  exchange = {},
  dcc = {},
} = {}) {
  const amount = positive(amountLocal);
  const rate = positive(marketRate);

  if (!amount || !rate) {
    return { referenceCost: null, options: [], best: null, savingsVsWorst: null };
  }

  const referenceCost = amount / rate;
  const cardMarkup = nonNegative(card.markupPct, DEFAULT_PAYMENT_FEES.card.markupPct);
  const atmMarkup = nonNegative(atm.markupPct, DEFAULT_PAYMENT_FEES.atm.markupPct);
  const exchangeSpread = nonNegative(exchange.spreadPct, DEFAULT_PAYMENT_FEES.exchange.spreadPct);
  const dccMarkup = nonNegative(dcc.markupPct, DEFAULT_PAYMENT_FEES.dcc.markupPct);

  const cardCost = referenceCost * (1 + cardMarkup / 100)
    + nonNegative(card.fixedFeeHome, DEFAULT_PAYMENT_FEES.card.fixedFeeHome);

  const atmLocalAmount = amount + nonNegative(atm.localFee, DEFAULT_PAYMENT_FEES.atm.localFee);
  const atmCost = (atmLocalAmount / rate) * (1 + atmMarkup / 100)
    + nonNegative(atm.fixedFeeHome, DEFAULT_PAYMENT_FEES.atm.fixedFeeHome);

  const offeredRate = positive(exchange.offeredRate);
  const estimatedExchangeRate = rate * Math.max(0.000001, 1 - exchangeSpread / 100);
  const exchangeRate = offeredRate || estimatedExchangeRate;
  const exchangeCost = amount / exchangeRate
    + nonNegative(exchange.fixedFeeHome, DEFAULT_PAYMENT_FEES.exchange.fixedFeeHome);

  const dccCost = referenceCost * (1 + dccMarkup / 100)
    + nonNegative(dcc.fixedFeeHome, DEFAULT_PAYMENT_FEES.dcc.fixedFeeHome);

  const options = [
    option('card', cardCost, referenceCost, { markupPct: cardMarkup }),
    option('atm', atmCost, referenceCost, { markupPct: atmMarkup }),
    option('exchange', exchangeCost, referenceCost, {
      offeredRate: exchangeRate,
      isEstimatedRate: !offeredRate,
      spreadPct: exchangeSpread,
    }),
    option('dcc', dccCost, referenceCost, { markupPct: dccMarkup }),
  ].sort((first, second) => {
    const costDifference = first.cost - second.cost;
    return Math.abs(costDifference) > Number.EPSILON
      ? costDifference
      : METHOD_ORDER.indexOf(first.id) - METHOD_ORDER.indexOf(second.id);
  });

  return {
    referenceCost,
    options,
    best: options[0],
    savingsVsWorst: Math.max(0, options.at(-1).cost - options[0].cost),
  };
}
