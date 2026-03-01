'use client';

import { useEffect, useMemo, useState } from 'react';
import { readApiResponse, unwrapData } from '@/lib/client-api';

type UserItem = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  subscription?: {
    planKey?: string;
    interval?: string;
    status?: string;
    currentPeriodEnd?: string;
    suspendedAt?: string;
  } | null;
  credential?: {
    status?: string;
    username?: string;
  } | null;
};

type Metrics = {
  totalUsers: number;
  listedUsers: number;
  activeSubscriptions: number;
  suspendedSubscriptions: number;
  noSubscriptionUsers: number;
};

type UsersPayload = { users: UserItem[]; metrics: Metrics };

export default function AdminUsersPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState<UserItem[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  const loadUsers = async () => {
    setError(null);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const payload = await readApiResponse(res);
      if (!res.ok) throw new Error((payload as { error?: string }).error || 'Error cargando usuarios');
      const data = unwrapData<UsersPayload>(payload);
      setUsers(data.users || []);
      setMetrics(data.metrics || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers().catch(() => setError('Error cargando usuarios'));
  }, []);

  const filteredUsers = useMemo(() => {
    if (statusFilter === 'all') return users;
    if (statusFilter === 'without') return users.filter((u) => !u.subscription);
    return users.filter((u) => u.subscription?.status === statusFilter);
  }, [users, statusFilter]);

  const runAction = async (userId: string, action: 'suspend' | 'delete_user' | 'update_subscription', overrides?: { status?: string; planKey?: 'basic' | 'pro'; interval?: 'monthly' | 'annual' }) => {
    setActiveUserId(userId);
    setError(null);
    try {
      const res = await fetch('/api/admin/users/actions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ userId, action, ...overrides })
      });
      const payload = await readApiResponse(res);
      if (!res.ok) throw new Error((payload as { error?: string }).error || 'Acción no permitida');
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en acción administrativa');
    } finally {
      setActiveUserId(null);
    }
  };

  return (
    <main className="container section admin-shell">
      <section className="admin-hero">
        <div>
          <p className="eyebrow">Control Center</p>
          <h1>Super Admin · Suscripciones & usuarios</h1>
          <p className="muted-text">Monitorea estados de suscripción, credenciales y ejecuta acciones críticas desde un panel profesional.</p>
        </div>
      </section>

      {metrics && (
        <section className="grid-three admin-metrics">
          <div className="card metric-card"><p>Total usuarios</p><strong>{metrics.totalUsers}</strong></div>
          <div className="card metric-card"><p>Suscripciones activas</p><strong>{metrics.activeSubscriptions}</strong></div>
          <div className="card metric-card"><p>Suscripciones suspendidas</p><strong>{metrics.suspendedSubscriptions}</strong></div>
        </section>
      )}

      <section className="card section-actions admin-toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por email" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="trialing">Trial</option>
          <option value="past_due">Past due</option>
          <option value="suspended">Suspendidos</option>
          <option value="without">Sin suscripción</option>
        </select>
        <button className="btn" onClick={loadUsers} disabled={loading}>{loading ? 'Actualizando...' : 'Actualizar panel'}</button>
      </section>

      {error && <p className="error-msg">{error}</p>}

      <section className="card">
        <table className="data-table admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Suscripción</th>
              <th>Credenciales</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>
                  <strong>{u.name}</strong>
                  <div className="muted-text">{u.email}</div>
                </td>
                <td>
                  {u.subscription ? `${u.subscription.planKey || '-'} · ${u.subscription.interval || '-'}` : 'Sin plan'}
                </td>
                <td>{u.credential?.status || 'sin provisión'}</td>
                <td><span className={`status-pill status-${u.subscription?.status || 'none'}`}>{u.subscription?.status || 'sin suscripción'}</span></td>
                <td>
                  <div className="admin-actions">
                    <button className="btn btn-sm btn-secondary" disabled={activeUserId === u._id || !u.subscription} onClick={() => runAction(u._id, 'suspend')}>Suspender</button>
                    <button className="btn btn-sm btn-secondary" disabled={activeUserId === u._id || !u.subscription} onClick={() => runAction(u._id, 'update_subscription', { status: 'active' })}>Reactivar</button>
                    <button className="btn btn-sm btn-secondary" disabled={activeUserId === u._id || !u.subscription} onClick={() => runAction(u._id, 'update_subscription', { planKey: 'pro' })}>Actualizar a Pro</button>
                    <button className="btn btn-sm admin-danger" disabled={activeUserId === u._id} onClick={() => runAction(u._id, 'delete_user')}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="muted-text">No hay usuarios para el filtro seleccionado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
