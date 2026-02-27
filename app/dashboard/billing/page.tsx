'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { readApiResponse, unwrapData } from '@/lib/client-api';

type MePayload = {
  subscription?: { planKey?: string; interval?: string; status?: string };
};

async function postJson(url: string, body?: Record<string, string>) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const payload = await readApiResponse(res);
  if (!res.ok) throw new Error((payload as { error?: string }).error || 'Request failed');
  return unwrapData<{ url?: string }>(payload);
}

export default function BillingPage() {
  const router = useRouter();
  const [me, setMe] = useState<MePayload | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/me')
      .then(async (r) => {
        const payload = await readApiResponse(r);
        if (r.status === 401) {
          router.replace('/login');
          return;
        }
        if (!r.ok) throw new Error((payload as { error?: string }).error || 'No autorizado');
        setMe(unwrapData<MePayload>(payload));
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'No fue posible cargar tu suscripción.'));
  }, [router]);

  const startCheckout = async (plan: 'basic' | 'pro', interval: 'monthly' | 'annual') => {
    setError(null);
    setMsg(null);
    try {
      const data = await postJson('/api/stripe/checkout', { plan, interval });
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de checkout');
    }
  };

  const openPortal = async () => {
    try {
      const data = await postJson('/api/stripe/portal');
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo abrir portal');
    }
  };

  const cancelSubscription = async () => {
    try {
      await postJson('/api/stripe/cancel');
      setMsg('Suscripción cancelada correctamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cancelar');
    }
  };

  return (
    <main className="container section">
      <h1>Suscripción y facturación</h1>
      <p className="muted-text">
        Estado actual: {me?.subscription?.status || 'sin suscripción'} · Plan: {me?.subscription?.planKey || 'sin plan activo'} {me?.subscription?.interval || ''}
      </p>
      {msg && <p className="ok-msg">{msg}</p>}
      {error && <p className="error-msg">{error}</p>}
      <div className="grid-two">
        <div className="card">
          <h3>Basic</h3>
          <button className="btn" onClick={() => startCheckout('basic', 'monthly')}>Mensual USD 32</button>
          <button className="btn btn-secondary" onClick={() => startCheckout('basic', 'annual')}>Anual USD 307.2</button>
        </div>
        <div className="card">
          <h3>Pro</h3>
          <button className="btn" onClick={() => startCheckout('pro', 'monthly')}>Mensual USD 64</button>
          <button className="btn btn-secondary" onClick={() => startCheckout('pro', 'annual')}>Anual USD 614.4</button>
        </div>
      </div>
      <div className="card section-actions">
        <button className="btn btn-secondary" onClick={openPortal}>Abrir portal de facturación</button>
        <button className="btn" onClick={cancelSubscription}>Cancelar suscripción</button>
      </div>
    </main>
  );
}
