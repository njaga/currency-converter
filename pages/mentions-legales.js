import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour au convertisseur
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Mentions Légales</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">À propos de XOF Converter</h2>
              <p className="text-gray-600 leading-relaxed">
                XOF Converter est un outil de conversion de devises en ligne, spécialement conçu pour 
                faciliter la conversion entre le Franc CFA (XOF) et d&apos;autres devises internationales.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Fonctionnalités</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Conversion en temps réel entre différentes devises</li>
                <li>Sauvegarde temporaire des conversions favorites</li>
                <li>Historique des taux de change</li>
                <li>Interface intuitive et responsive</li>
                <li>Conversion instantanée sans rechargement de page</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Protection des données</h2>
              <p className="text-gray-600 leading-relaxed">
                XOF Converter ne collecte ni ne stocke aucune donnée personnelle. L&apos;application 
                fonctionne sans base de données et toutes les conversions favorites sont stockées 
                uniquement dans la mémoire locale de votre navigateur (localStorage).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Sources des données</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Les taux de change sont fournis par les API suivantes :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>ExchangeRate-API (v6.exchangerate-api.com)</li>
                <li>CurrencyAPI (api.currencyapi.com)</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Les taux sont mis à jour régulièrement pour assurer la précision des conversions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Développeur</h2>
              <p className="text-gray-600 leading-relaxed">
                XOF Converter a été développé par Ndiaga Ndiaye. Pour plus d&apos;informations, 
                visitez <a href="https://ndiagandiaye.com" target="_blank" rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-700">ndiagandiaye.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                Pour toute question ou suggestion concernant XOF Converter, vous pouvez me contacter via 
                mon site web : <a href="https://ndiagandiaye.com" target="_blank" rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-700">ndiagandiaye.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Limitation de responsabilité</h2>
              <p className="text-gray-600 leading-relaxed">
                Les taux de change affichés sont fournis à titre indicatif. Bien que nous nous 
                efforcions de maintenir des données précises et à jour, nous ne pouvons garantir 
                l&apos;exactitude absolue des taux affichés. Pour des transactions financières importantes, 
                il est recommandé de vérifier les taux auprès de votre institution financière.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
