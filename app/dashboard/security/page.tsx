'use client';

import { useState } from 'react';

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'No se pudo cambiar contraseña');
      return;
    }
    setMessage('Contraseña actualizada.');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <main className="container section">
      <div className="card auth-card">
        <h1>Security</h1>
        <p className="muted-text">Actualiza tu contraseña de acceso.</p>
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Contraseña actual
            <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </label>
          <label>
            Nueva contraseña
            <input type="password" minLength={10} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </label>
          {message && <p className="ok-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}
          <button className="btn" type="submit">Guardar</button>
        </form>
      </div>
    </main>
  );
}
