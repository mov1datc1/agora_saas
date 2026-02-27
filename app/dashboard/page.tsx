'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readApiResponse, unwrapData } from '@/lib/client-api';

type MePayload = { user?: { name?: string; email?: string }; subscription?: { planKey?: string; status?: string }; credential?: { status?: string } };

export default function DashboardPage() {
  const [data, setData] = useState<MePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/me').then(async (res) => {
      const payload = await readApiResponse(res);
      if (!res.ok) throw new Error((payload as { error?: string }).error || 'No autorizado');
      setData(unwrapData<MePayload>(payload));
    }).catch((err) => setError(err instanceof Error ? err.message : 'Error'));
  }, []);

  return (
    <main className="container section">
      <h1>Dashboard</h1>
      {error && <p className="error-msg">{error}</p>}
      <div className="grid-three">
        <article className="card"><h3>Cuenta</h3><p>{data?.user?.name || '—'}</p><p className="muted-text">{data?.user?.email || 'Inicia sesión para ver tu perfil.'}</p></article>
        <article className="card"><h3>Suscripción</h3><p>Plan: {data?.subscription?.planKey || 'Sin plan'}</p><p className="muted-text">Estado: {data?.subscription?.status || '—'}</p><Link className="btn btn-secondary" href="/dashboard/billing">Gestionar pagos</Link></article>
        <article className="card"><h3>Acceso plataforma</h3><p>Estado: {data?.credential?.status || 'Sin credenciales'}</p><Link className="btn btn-secondary" href="/dashboard/access">Ver acceso</Link></article>
      </div>
    </main>
  );
}
