import React from 'react';
import { Info } from 'lucide-react';

const CurrencyTrends = ({ fromCurrency, toCurrency }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800">
    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
      Tendance {fromCurrency}/{toCurrency}
    </h3>
    <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <p>
        Les tendances historiques sont temporairement indisponibles. AfriChange n'affiche pas de données simulées : cette section sera réactivée uniquement avec une source historique vérifiée.
      </p>
    </div>
  </div>
);

export default CurrencyTrends;
