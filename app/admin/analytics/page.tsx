'use client';

import { useEffect, useState } from 'react';

type Snapshot = {
  _id: string;
  snapshotDate: string;
  mrr: number;
  churnRate: number;
  newSubscriptions: number;
  cancellations: number;
  activeTrials: number;
};

export default function AdminAnalyticsPage() {
  const [rows, setRows] = useState<Snapshot[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'No autorizado');
        setRows(body.data.snapshots);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error'));
  }, []);

  return (
    <main className="container section">
      <h1>Admin Analytics</h1>
      {error && <p className="error-msg">{error}</p>}
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th><th>MRR</th><th>Churn</th><th>Nuevas</th><th>Cancelaciones</th><th>Trials</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id}>
                <td>{new Date(row.snapshotDate).toLocaleDateString()}</td>
                <td>{row.mrr}</td>
                <td>{row.churnRate}</td>
                <td>{row.newSubscriptions}</td>
                <td>{row.cancellations}</td>
                <td>{row.activeTrials}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
