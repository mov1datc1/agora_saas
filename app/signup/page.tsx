'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { readApiResponse } from '@/lib/client-api';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', organizationName: '', organizationType: 'firm' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form)
      });
      const payload = await readApiResponse(res);
      if (!res.ok) throw new Error((payload as { error?: string }).error || 'No se pudo crear la cuenta');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (<main className="container section"><div className="card auth-card"><h1>Registro</h1><p className="muted-text">Activa tu prueba gratis y configura tu organización legal.</p><form className="form-grid" onSubmit={onSubmit}><label>Nombre<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label>Contraseña<input required type="password" minLength={10} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><label>Nombre de organización<input required value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} /></label><label>Tipo<select value={form.organizationType} onChange={(e) => setForm({ ...form, organizationType: e.target.value })}><option value="firm">Firma</option><option value="independent_lawyer">Abogado independiente</option></select></label>{error && <p className="error-msg">{error}</p>}<button className="btn" type="submit" disabled={loading}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</button></form></div></main>);
}
