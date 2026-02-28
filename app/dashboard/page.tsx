'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { readApiResponse, unwrapData } from '@/lib/client-api';

type MePayload = { user?: { name?: string; email?: string }; subscription?: { planKey?: string; status?: string }; credential?: { status?: string } };

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<MePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const planLabel = data?.subscription?.planKey === 'pro' ? 'Pro' : 'Básico';
  const statusLabel = data?.subscription?.status ? data.subscription.status : 'active';
  const statusLabelEs = statusLabel === 'active' ? 'Activo' : statusLabel;

  useEffect(() => {
    fetch('/api/me').then(async (res) => {
      const payload = await readApiResponse(res);
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      if (!res.ok) throw new Error((payload as { error?: string }).error || 'No autorizado');
      setData(unwrapData<MePayload>(payload));
    }).catch((err) => setError(err instanceof Error ? err.message : 'Error'));
  }, [router]);

  return (
    <main className="container section">
      <h1>Dashboard</h1>
      {error && <p className="error-msg">{error}</p>}
      <div className="grid-three">
        <article className="card"><h3>Cuenta</h3><p>{data?.user?.name || '—'}</p><p className="muted-text">{data?.user?.email || 'Inicia sesión para ver tu perfil.'}</p></article>
        <article className="card"><h3>Suscripción</h3><p>Plan: {planLabel}</p><p className="muted-text">Estado: {statusLabelEs}</p><Link className="btn btn-secondary" href="/dashboard/billing">Gestionar pagos</Link></article>
        <article className="card"><h3>Acceso plataforma</h3><p>Estado: {data?.credential?.status || 'Sin credenciales'}</p><Link className="btn btn-secondary" href="/dashboard/access">Ver acceso</Link></article>
      </div>
    </main>
  );
}
