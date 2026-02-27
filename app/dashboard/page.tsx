'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type MePayload = {
  user?: { name?: string; email?: string };
  subscription?: { planKey?: string; status?: string };
  credential?: { status?: string };
};

export default function DashboardPage() {
  const [data, setData] = useState<MePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/me')
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'No autorizado');
        setData(body.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error'));
  }, []);

  return (
    <main className="container section">
      <h1>Dashboard</h1>
      {error && <p className="error-msg">{error}</p>}
      <div className="grid-three">
        <article className="card">
          <h3>Cuenta</h3>
          <p>{data?.user?.name || '—'}</p>
          <p className="muted-text">{data?.user?.email || 'Inicia sesión para ver tu perfil.'}</p>
        </article>
        <article className="card">
          <h3>Suscripción</h3>
          <p>Plan: {data?.subscription?.planKey || 'Sin plan'}</p>
          <p className="muted-text">Estado: {data?.subscription?.status || '—'}</p>
          <Link className="btn btn-secondary" href="/dashboard/billing">Gestionar pagos</Link>
        </article>
        <article className="card">
          <h3>Acceso plataforma</h3>
          <p>Estado: {data?.credential?.status || 'Sin credenciales'}</p>
          <Link className="btn btn-secondary" href="/dashboard/access">Ver acceso</Link>
        </article>
      </div>
    </main>
  );
}
