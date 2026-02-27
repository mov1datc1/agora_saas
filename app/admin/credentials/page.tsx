'use client';

import { useState } from 'react';
import { readApiResponse, unwrapData } from '@/lib/client-api';

type CredentialPayload = { credential: { status: string } };

export default function AdminCredentialsPage() {
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = async (action: 'approve_send' | 'suspend') => {
    setStatus(null);
    setError(null);
    const res = await fetch('/api/admin/credentials', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ userId, action }) });
    const payload = await readApiResponse(res);
    if (!res.ok) return setError((payload as { error?: string }).error || 'Error');
    setStatus(`Credencial actualizada: ${unwrapData<CredentialPayload>(payload).credential.status}`);
  };

  return (
    <main className="container section"><h1>Credential Provisioning</h1><div className="card form-grid"><label>User ID<input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Mongo userId" /></label><div className="section-actions"><button className="btn" onClick={() => execute('approve_send')} disabled={!userId}>Aprobar y enviar</button><button className="btn btn-secondary" onClick={() => execute('suspend')} disabled={!userId}>Suspender</button></div>{status && <p className="ok-msg">{status}</p>}{error && <p className="error-msg">{error}</p>}</div></main>
  );
}
