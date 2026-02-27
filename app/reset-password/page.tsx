'use client';

import { useState } from 'react';
import { readApiResponse } from '@/lib/client-api';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token, password: newPassword })
    });
    const payload = await readApiResponse(res);
    if (!res.ok) return setError((payload as { error?: string }).error || 'Token inválido');
    setMessage('Contraseña actualizada correctamente.');
  };

  return (<main className="container section"><div className="card auth-card"><h1>Reset password</h1><form className="form-grid" onSubmit={onSubmit}><label>Token<input required value={token} onChange={(e) => setToken(e.target.value)} /></label><label>Nueva contraseña<input type="password" minLength={10} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></label>{message && <p className="ok-msg">{message}</p>}{error && <p className="error-msg">{error}</p>}<button className="btn" type="submit">Actualizar contraseña</button></form></div></main>);
}
