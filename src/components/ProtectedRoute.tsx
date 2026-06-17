import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  correctPin: string;
}

export default function ProtectedRoute({ children, correctPin }: ProtectedRouteProps) {
  const { isAuthenticated, login } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(pin, correctPin);
    if (!success) {
      setError(true);
      setPin('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950 font-sans text-slate-200">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 max-w-sm w-full mx-4">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-black text-center mb-2">Area Staf</h2>
        <p className="text-sm text-slate-400 text-center mb-8">Masukkan PIN akses untuk melanjutkan.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                setError(false);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-2xl tracking-widest font-mono text-amber-400 focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-700"
              placeholder="••••••"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>PIN salah! Silakan coba lagi.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>Masuk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
