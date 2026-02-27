'use client';

import { useEffect, useState } from 'react';

type Credential = { status?: string; username?: string; temporaryPassword?: string };

export default function AccessPage() {
  const [credential, setCredential] = useState<Credential | null>(null);

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((d) => setCredential(d.data?.credential ?? null))
      .catch(() => setCredential(null));
  }, []);

  return (
    <main className="container section">
      <div className="card">
        <h1>Access Credentials</h1>
        <p>Estado: <strong>{credential?.status || 'sin provisión'}</strong></p>
        <p>Usuario plataforma: {credential?.username || 'pendiente'}</p>
        <p>Password temporal: {credential?.temporaryPassword || 'pendiente de envío por admin'}</p>
      </div>
    </main>
  );
}
