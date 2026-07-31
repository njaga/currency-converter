import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield, Database, AlertTriangle, Code, ExternalLink } from 'lucide-react';
import Logo from '../components/Logo';

const sections = [
  {
    icon: Shield,
    title: 'Protection des données',
    content: 'AfriChange ne collecte ni ne stocke aucune donnée personnelle. Toutes les conversions favorites sont stockées uniquement dans votre navigateur (localStorage et IndexedDB).'
  },
  {
    icon: Database,
    title: 'Sources des données',
    content: 'Les taux de change sont fournis par ExchangeRate-API et mis à jour régulièrement pour assurer la précision des conversions.'
  },
  {
    icon: AlertTriangle,
    title: 'Limitation de responsabilité',
    content: 'Les taux affichés sont fournis à titre indicatif. Pour des transactions financières importantes, vérifiez les taux auprès de votre institution financière.'
  }
];

export default function MentionsLegales() {
  return (
    <>
      <Head>
        <title>Mentions Légales | AfriChange</title>
        <meta name="description" content="Mentions légales du convertisseur AfriChange — convertisseur de devises africaines PWA." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl" />
        </div>

        <header className="relative z-10 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
            <Logo size="sm" showText={true} />
          </div>
        </header>

        <main className="relative z-10 max-w-3xl mx-auto px-4 py-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 shadow-lg"
          >
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              Mentions Légales
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              AfriChange — Convertisseur de devises africaines (PWA)
            </p>
          </motion.div>

          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {section.title}
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-[52px]">
                {section.content}
              </p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Développement
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 pl-[52px]">
              Développé par{' '}
              <a 
                href="https://ndiagandiaye.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Ndiaga Ndiaye
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </motion.div>
        </main>

        <footer className="relative z-10 border-t border-slate-200/50 dark:border-slate-800/50 py-6 mt-12">
          <div className="max-w-3xl mx-auto px-4 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} AfriChange
          </div>
        </footer>
      </div>
    </>
  );
}
