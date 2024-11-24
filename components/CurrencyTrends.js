import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const CurrencyTrends = ({ fromCurrency, toCurrency }) => {
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    // Ici, vous pouvez implémenter la logique pour calculer la tendance
    // basée sur les données historiques ou une autre source
    // Pour cet exemple, nous utiliserons une valeur aléatoire
    const randomTrend = Math.random() - 0.5;
    setTrend(randomTrend);
  }, [fromCurrency, toCurrency]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-indigo-800">Tendance {fromCurrency}/{toCurrency}</h3>
      {trend !== null && (
        <div className="flex items-center space-x-2">
          {trend > 0 ? (
            <>
              <TrendingUp className="text-green-500" />
              <span className="text-green-500 font-semibold">En hausse</span>
            </>
          ) : (
            <>
              <TrendingDown className="text-red-500" />
              <span className="text-red-500 font-semibold">En baisse</span>
            </>
          )}
          <span className="text-gray-600">({Math.abs(trend).toFixed(2)}%)</span>
        </div>
      )}
    </div>
  );
};

export default CurrencyTrends;
