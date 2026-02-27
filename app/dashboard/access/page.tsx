'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { readApiResponse, unwrapData } from '@/lib/client-api';

type Credential = { status?: string; username?: string; temporaryPassword?: string };

type MePayload = { credential?: Credential };

export default function AccessPage() {
  const router = useRouter();
  const [credential, setCredential] = useState<Credential | null>(null);

  useEffect(() => {
    fetch('/api/me').then(async (r) => {
      const payload = await readApiResponse(r);
      if (r.status === 401) {
        router.replace('/login');
        return;
      }
      const me = unwrapData<MePayload>(payload);
      setCredential(me?.credential ?? null);
    }).catch(() => setCredential(null));
  }, [router]);

  return (
    <main className="container section"><div className="card"><h1>Access Credentials</h1><p>Estado: <strong>{credential?.status || 'sin provisión'}</strong></p><p>Usuario plataforma: {credential?.username || 'pendiente'}</p><p>Password temporal: {credential?.temporaryPassword || 'pendiente de envío por admin'}</p></div></main>
  );
}
