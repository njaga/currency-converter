import React from 'react';
import { motion } from 'framer-motion';
import { Download, QrCode, ArrowRight, ShieldCheck, Zap, WifiOff, CheckCircle2 } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import { getTranslation } from '../lib/i18n';

export default function XeStyleAppDownload({ onInstall, lang = 'fr' }) {
  return (
    <section className="rounded-[36px] bg-[#0a142f] text-white p-8 md:p-14 relative overflow-hidden shadow-2xl">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
        {/* LEFT COLUMN: MARKETING COPY & QR CODE */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Gérez vos devises où que vous soyez avec l&apos;application AfriChange
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
            Elle contient toutes les informations dont vous avez besoin pour vos calculs et conversions de devises internationales et africaines. C&apos;est simple, sécurisé et 100% hors-ligne (à partir de 0 Franc).
          </p>

          {/* CTA & QR Code Row */}
          <div className="pt-2 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onInstall}
                className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
              >
                <Download className="w-5 h-5" />
                <span>Téléchargez l&apos;application</span>
              </button>
            </div>

            {/* Stylized Dotted QR Code Box */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white text-slate-900 border-2 border-dashed border-blue-400/50 shadow-md">
                {/* SVG QR Code Simulation */}
                <svg className="w-20 h-20" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="10" y="10" width="25" height="25" fill="#0a142f" />
                  <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                  <rect x="18" y="18" width="9" height="9" fill="#0a142f" />

                  <rect x="65" y="10" width="25" height="25" fill="#0a142f" />
                  <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                  <rect x="73" y="18" width="9" height="9" fill="#0a142f" />

                  <rect x="10" y="65" width="25" height="25" fill="#0a142f" />
                  <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                  <rect x="18" y="73" width="9" height="9" fill="#0a142f" />

                  {/* QR Pattern dots */}
                  <rect x="42" y="12" width="8" height="8" fill="#2563eb" />
                  <rect x="42" y="28" width="8" height="8" fill="#0a142f" />
                  <rect x="25" y="45" width="8" height="8" fill="#2563eb" />
                  <rect x="45" y="45" width="12" height="12" fill="#0a142f" />
                  <rect x="65" y="45" width="8" height="8" fill="#2563eb" />
                  <rect x="80" y="45" width="8" height="8" fill="#0a142f" />
                  <rect x="45" y="65" width="8" height="8" fill="#0a142f" />
                  <rect x="65" y="65" width="12" height="12" fill="#2563eb" />
                  <rect x="80" y="80" width="10" height="10" fill="#0a142f" />
                </svg>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <p className="font-extrabold text-white">Scannez pour utiliser</p>
                <p className="text-[11px] text-slate-400">PWA installable sur iOS &amp; Android</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REALISTIC iPHONE 15 PRO MOCKUP (MATCHING XE SCREENSHOT) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-[280px] sm:w-[310px] h-[580px] bg-slate-950 rounded-[48px] p-3 border-4 border-slate-700 shadow-2xl shadow-blue-500/20 ring-1 ring-white/20">
            {/* Dynamic Island Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-end px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
            </div>

            {/* Phone Screen Container */}
            <div className="w-full h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-[38px] overflow-hidden pt-10 px-4 pb-4 flex flex-col justify-between relative">
              {/* Screen Top Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold">Conversion</span>
                  <span className="text-[10px] font-bold text-emerald-500">● 100% Hors-Ligne</span>
                </div>

                {/* You send box */}
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vous envoyez</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-sm">
                      <Flags.US className="w-5 h-3.5 rounded-xs" />
                      <span>USD</span>
                    </div>
                    <span className="text-lg font-black font-mono">$10,000.00</span>
                  </div>
                </div>

                {/* They get box */}
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ils me reçoivent</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-sm">
                      <Flags.SN className="w-5 h-3.5 rounded-xs" />
                      <span>XOF</span>
                    </div>
                    <span className="text-lg font-black font-mono text-blue-600 dark:text-blue-400">6,559,570 CFA</span>
                  </div>
                </div>

                {/* Rate detail line */}
                <div className="text-center text-[11px] font-mono font-bold text-slate-400">
                  Taux 1 USD = 655.957 XOF
                </div>

                {/* Delivery options */}
                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Mode de paiement</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Wave / Orange Money</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Délai d&apos;exécution</span>
                    <span className="font-bold text-emerald-600">&lt;10ms (Instant)</span>
                  </div>
                </div>
              </div>

              {/* Screen Bottom CTA Button */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Frais de conversion</span>
                  <span className="font-bold text-emerald-500">0.00 FCFA</span>
                </div>
                <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md text-center">
                  Continuer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
