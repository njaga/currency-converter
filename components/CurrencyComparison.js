import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const API_KEY = '1276659af5bdc69143b11f57';
const API_BASE_URL = 'https://v6.exchangerate-api.com/v6/';

const CurrencyComparison = ({ currencies }) => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [rates, setRates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}${API_KEY}/latest/${baseCurrency}`);
        if (!response.ok) {
          throw new Error('Erreur réseau lors de la récupération des données');
        }
        const data = await response.json();
        if (data.result === 'success') {
          setRates(data.conversion_rates);
        } else {
          throw new Error(data['error-type']);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des taux:', error);
        setError("Impossible de récupérer les taux de change. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, [baseCurrency]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Comparaison des devises</h2>
      <select
        className="mb-4 bg-gray-50 rounded-full py-2 px-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 text-gray-800"
        value={baseCurrency}
        onChange={(e) => setBaseCurrency(e.target.value)}
      >
        {currencies.map(currency => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
      {isLoading ? (
        <div className="text-center">Chargement...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {currencies.filter(c => c !== baseCurrency).map(currency => (
            <div key={currency} className="bg-gray-50 p-4 rounded-xl shadow">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{currency}</span>
                <span className="text-lg">{rates[currency]?.toFixed(4)}</span>
              </div>
              <div className="flex items-center mt-2">
                {rates[currency] > 1 ? (
                  <TrendingUp className="text-green-500 w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="text-red-500 w-4 h-4 mr-1" />
                )}
                <span className={rates[currency] > 1 ? "text-green-500" : "text-red-500"}>
                  {((rates[currency] - 1) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencyComparison;