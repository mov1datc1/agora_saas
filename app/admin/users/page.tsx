'use client';

import { useEffect, useState } from 'react';

type UserItem = { _id: string; name: string; email: string; role: string };

export default function AdminUsersPage() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<UserItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setError(null);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    const res = await fetch(`/api/admin/users?${params.toString()}`);
    const body = await res.json();
    if (!res.ok) {
      setError(body.error || 'Error cargando usuarios');
      return;
    }
    setUsers(body.data.users);
  };

  useEffect(() => {
    loadUsers().catch(() => setError('Error cargando usuarios'));
  }, []);

  return (
    <main className="container section">
      <h1>Admin Users</h1>
      <div className="card section-actions">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por email" />
        <button className="btn" onClick={loadUsers}>Buscar</button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th></tr></thead>
          <tbody>
            {users.map((u) => <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>)}
          </tbody>
        </table>
      </div>
    </main>
  );
}
