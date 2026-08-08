import React from 'react';
import { Info } from 'lucide-react';

const CurrencyTrends = ({ fromCurrency, toCurrency }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
    <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-100">
      Tendance {fromCurrency}/{toCurrency}
    </h3>
    <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
      <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <p>
        Les tendances historiques sont temporairement indisponibles. Kiwango n’affiche pas de données simulées : cette section sera réactivée uniquement avec une source historique vérifiée.
      </p>
    </div>
  </div>
);

export default CurrencyTrends;
