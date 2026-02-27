'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (res.ok) setMessage('Si existe la cuenta, enviamos instrucciones de recuperación.');
  };

  return (
    <main className="container section">
      <div className="card auth-card">
        <h1>Recuperar contraseña</h1>
        <form className="form-grid" onSubmit={onSubmit}>
          <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          {message && <p className="ok-msg">{message}</p>}
          <button className="btn" type="submit">Enviar enlace</button>
        </form>
      </div>
    </main>
  );
}
