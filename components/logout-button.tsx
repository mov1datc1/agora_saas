'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { readApiResponse } from '@/lib/client-api';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      await readApiResponse(res);
    } finally {
      router.push('/login');
      router.refresh();
      setLoading(false);
    }
  };

  return (
    <button className="btn btn-sm btn-secondary" type="button" onClick={onLogout} disabled={loading}>
      {loading ? 'Saliendo...' : 'Cerrar sesión'}
    </button>
  );
}
