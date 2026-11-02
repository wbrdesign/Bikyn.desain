import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary: Mencegah layar putih dan menyediakan tombol reset otomatis
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled app error:', error, errorInfo);
  }

  public handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-zinc-800 border border-zinc-700 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-3xl">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Sistem Sedang Memulihkan Data
            </h2>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Ditemukan data cache lama atau kendala memori browser. Klik tombol di bawah untuk membersihkan data dan memuat ulang website secara otomatis.
            </p>

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
            >
              🔄 Reset Data & Muat Ulang Sekarang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
