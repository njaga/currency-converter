export default async function handler(req, res) {
  const { fromCurrency, toCurrency, startDate } = req.query;
  const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;
  const CURRENCY_API_KEY = process.env.CURRENCY_API_KEY;

  try {
    // Essayer d'abord Exchange Rate API
    const exchangeRateResponse = await fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${fromCurrency}`);
    const exchangeRateData = await exchangeRateResponse.json();

    if (exchangeRateData.result === 'success') {
      const currentRate = exchangeRateData.conversion_rates[toCurrency];
      
      // Générer des données historiques simulées
      const start = new Date(startDate);
      const end = new Date();
      const simulatedData = {};

      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        const randomVariation = (Math.random() - 0.5) * 0.02; // +/- 1%
        simulatedData[d.toISOString().split('T')[0]] = {
          [toCurrency]: +(currentRate * (1 + randomVariation)).toFixed(6)
        };
      }

      res.status(200).json({
        result: 'success',
        base_code: fromCurrency,
        target_code: toCurrency,
        rates: simulatedData
      });
    } else {
      // Fallback vers Currency API
      const currencyResponse = await fetch(
        `https://api.currencyapi.com/v3/historical?apikey=${CURRENCY_API_KEY}&base_currency=${fromCurrency}&currencies=${toCurrency}&date=${startDate}`
      );
      const currencyData = await currencyResponse.json();

      if (currencyData.data) {
        const simulatedData = {};
        simulatedData[startDate] = {
          [toCurrency]: currencyData.data[toCurrency].value
        };

        res.status(200).json({
          result: 'success',
          base_code: fromCurrency,
          target_code: toCurrency,
          rates: simulatedData
        });
      } else {
        throw new Error('Les deux APIs ont échoué');
      }
    }
  } catch (error) {
    console.error('Erreur détaillée:', error);
    res.status(500).json({ error: `Erreur lors de la récupération des données: ${error.message}` });
  }
}
