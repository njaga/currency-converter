export default function handler(req, res) {
  res.status(410).json({
    error: 'Historical rates are temporarily unavailable.',
    code: 'HISTORICAL_DATA_UNAVAILABLE',
    message: 'AfriChange no longer generates simulated historical exchange-rate data. This endpoint will only return data again when a verified historical provider is integrated.',
  });
}
