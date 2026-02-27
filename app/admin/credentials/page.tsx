'use client';

import { useState } from 'react';

export default function AdminCredentialsPage() {
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = async (action: 'approve_send' | 'suspend') => {
    setStatus(null);
    setError(null);
    const res = await fetch('/api/admin/credentials', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userId, action })
    });
    const body = await res.json();
    if (!res.ok) return setError(body.error || 'Error');
    setStatus(`Credencial actualizada: ${body.data.credential.status}`);
  };

  return (
    <main className="container section">
      <h1>Credential Provisioning</h1>
      <div className="card form-grid">
        <label>
          User ID
          <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Mongo userId" />
        </label>
        <div className="section-actions">
          <button className="btn" onClick={() => execute('approve_send')} disabled={!userId}>Aprobar y enviar</button>
          <button className="btn btn-secondary" onClick={() => execute('suspend')} disabled={!userId}>Suspender</button>
        </div>
        {status && <p className="ok-msg">{status}</p>}
        {error && <p className="error-msg">{error}</p>}
      </div>
    </main>
  );
}
