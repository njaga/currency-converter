import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, Star, Clock, TrendingUp } from 'lucide-react';
import FavoriteConversions from './FavoriteConversions';
import CurrencyComparison from './CurrencyComparison';

const EXCHANGE_RATE_API_KEY = '1276659af5bdc69143b11f57';
const EXCHANGE_RATE_API_URL = 'https://v6.exchangerate-api.com/v6/';
const CURRENCY_API_KEY = 'cur_live_SjPqYd1qHZ2rbUpVFcFVPwGkTv5F6MFxiYTvIg3g';
const CURRENCY_API_URL = 'https://api.currencyapi.com/v3';

const Logo = () => (
  <motion.svg
    width="300"
    height="80"
    viewBox="0 0 300 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="logo-shadow"
  >
    <motion.path
      d="M30 40C30 49.9411 38.0589 58 48 58C57.9411 58 66 49.9411 66 40C66 30.0589 57.9411 22 48 22"
      stroke="#2563EB"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
    <motion.path
      d="M48 22C38.0589 22 30 30.0589 30 40"
      stroke="#2563EB"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="5 5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
    />
    <motion.path
      d="M46 30H50"
      stroke="#2563EB"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 1 }}
    />
    <motion.path
      d="M48 28V32"
      stroke="#2563EB"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 1 }}
    />
    <motion.text
      x="90"
      y="48"
      className="text-2xl font-semibold"
      fill="#1F2937"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.2 }}
    >
      XOF Converter
    </motion.text>
  </motion.svg>
);

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('XOF');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [timeFrame, setTimeFrame] = useState('1M');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'XOF'];

  const fetchExchangeRate = async () => {
    if (!amount) {
      setConvertedAmount(null);
      setExchangeRate(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${EXCHANGE_RATE_API_URL}${EXCHANGE_RATE_API_KEY}/latest/${fromCurrency}`);
      const data = await response.json();
      
      if (data.result === 'success') {
        handleSuccessResponse(data);
      } else {
        const currencyResponse = await fetch(`${CURRENCY_API_URL}/latest?apikey=${CURRENCY_API_KEY}&base_currency=${fromCurrency}&currencies=${toCurrency}`);
        const currencyData = await currencyResponse.json();
        
        if (currencyData.data) {
          const rate = currencyData.data[toCurrency].value;
          setExchangeRate(rate);
          setConvertedAmount((amount * rate).toFixed(2));
          setLastUpdated(new Date());
        } else {
          throw new Error('Les deux APIs ont échoué');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du taux de change:', error);
      setError("Impossible de récupérer les taux de change. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessResponse = (data) => {
    setExchangeRate(data.conversion_rates[toCurrency]);
    setConvertedAmount((amount * data.conversion_rates[toCurrency]).toFixed(2));
    setLastUpdated(new Date(data.time_last_update_unix * 1000));
  };

  const fetchHistoricalData = async () => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch(timeFrame) {
      case '1W':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '1Y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    try {
      const response = await fetch(`/api/historical-rates?fromCurrency=${fromCurrency}&startDate=${startDate.toISOString().split('T')[0]}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const data = await response.json();
      if (data.result === 'success') {
        if (Object.keys(data.rates).length === 0) {
          setError("Aucune donnée disponible pour la période sélectionnée.");
          setHistoricalData([]);
        } else {
          const historicalRates = Object.entries(data.rates)
            .filter(([date]) => new Date(date) >= startDate && new Date(date) <= endDate)
            .map(([date, rates]) => ({
              date,
              rate: rates[toCurrency]
            }));
          setHistoricalData(historicalRates);
        }
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur détaillée lors de la récupération des données historiques:', error);
      setError(`Impossible de récupérer les données historiques: ${error.message}`);
      setHistoricalData([]);
    }
  };

  useEffect(() => {
    if (amount > 0) {
      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency, amount]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleSaveFavorite = () => {
    const newFavorite = {
      amount,
      from: fromCurrency,
      to: toCurrency,
      rate: exchangeRate
    };
    setFavorites(prevFavorites => [...prevFavorites, newFavorite]);
  };

  const handleRemoveFavorite = (index) => {
    setFavorites(prevFavorites => {
      const newFavorites = [...prevFavorites];
      newFavorites.splice(index, 1);
      if (newFavorites.length === 0) {
        localStorage.removeItem('favorites');
      } else {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-12">
            <Logo />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-100 p-6 rounded-2xl shadow-lg backdrop-blur-sm mb-6"
          >
            <div className="space-y-12">
              <div className="relative">
                <input
                  className="w-full h-24 bg-transparent border-b-2 border-gray-200 px-8 text-5xl font-medium text-gray-800 focus:outline-none focus:border-blue-600 transition-all placeholder-gray-300"
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-[1fr,auto,1fr] gap-8 items-center">
                <select
                  className="h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 text-xl font-medium text-gray-800 focus:outline-none focus:border-blue-600 transition-all appearance-none hover:border-gray-300"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSwapCurrencies}
                  className="p-4 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </motion.button>

                <select
                  className="h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 text-xl font-medium text-gray-800 focus:outline-none focus:border-blue-600 transition-all appearance-none hover:border-gray-300"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              {convertedAmount && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-8 border-t border-gray-100 text-center"
                >
                  <p className="text-2xl font-medium text-gray-600 mb-3">
                    {amount} {fromCurrency}
                  </p>
                  <p className="text-5xl font-semibold text-gray-900 mb-3">
                    {convertedAmount} {toCurrency}
                  </p>
                  <p className="text-base text-gray-500 font-medium">
                    1 {fromCurrency} = {exchangeRate?.toFixed(4)} {toCurrency}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveFavorite}
                    className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md"
                  >
                    <Star className="w-4 h-4 inline-block mr-2" />
                    Ajouter aux favoris
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FavoriteConversions
              favorites={favorites}
              onSelect={(fav) => {
                setAmount(fav.amount);
                setFromCurrency(fav.from);
                setToCurrency(fav.to);
              }}
              onRemove={handleRemoveFavorite}
            />
          </motion.div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <motion.a
              href="https://ndiagandiaye.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
            >
              <span>Développé par Ndiaga Ndiaye</span>
            </motion.a>
            
            <motion.a
              href="/mentions-legales"
              className="text-gray-600 hover:text-blue-600 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              Mentions légales
            </motion.a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CurrencyConverter;