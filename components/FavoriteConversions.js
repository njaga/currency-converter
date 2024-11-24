import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FavoriteConversions = ({ favorites, onSelect, onRemove }) => {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Conversions favorites
      </h3>
      
      {favorites.length === 0 ? (
        <p className="text-gray-500 text-center py-6 text-base">
          Aucune conversion favorite enregistrée
        </p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence>
            {favorites.map((fav, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="group bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => onSelect(fav)}
                    className="flex items-center space-x-4 flex-1"
                  >
                    <Star className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-medium text-gray-700">
                      {fav.amount} {fav.from} → {fav.to}
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemove(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white rounded-full"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default FavoriteConversions;