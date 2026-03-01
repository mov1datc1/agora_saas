'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { readApiResponse } from '@/lib/client-api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('owner@agora.local');
  const [password, setPassword] = useState('AgoraOwner#2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const payload = await readApiResponse(res);
      if (!res.ok) throw new Error((payload as { error?: string }).error || 'No autorizado');
      router.push('/admin/users');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container section">
      <div className="card auth-card pro-admin-login">
        <p className="eyebrow">Panel propietario</p>
        <h1>Acceso Super Admin</h1>
        <p className="muted-text">Este acceso es exclusivo para el dueño de la plataforma SaaS.</p>
        <p className="muted-text"><strong>Temporal:</strong> owner@agora.local / AgoraOwner#2026</p>
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Usuario
            <input required value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <p className="error-msg">{error}</p>}
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Validando...' : 'Entrar al panel'}</button>
        </form>
      </div>
    </main>
  );
}
