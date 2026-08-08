import React from 'react';
import Link from 'next/link';
import { reportClientError } from '../lib/telemetry';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    reportClientError(error, 'react_error_boundary');
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-5 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,.08)] dark:border-white/10 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-700">Kiwango</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-.04em]">Une erreur inattendue est survenue.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">Vos données locales ne sont pas supprimées. Rechargez l’application ou revenez à l’accueil.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white">Recharger</button>
            <Link href="/" className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-white/10">Accueil</Link>
          </div>
        </div>
      </main>
    );
  }
}
