'use client';

import { useEffect, useState } from 'react';
import { readApiResponse, unwrapData } from '@/lib/client-api';

type Snapshot = { _id: string; snapshotDate: string; mrr: number; churnRate: number; newSubscriptions: number; cancellations: number; activeTrials: number };

type AnalyticsPayload = { snapshots: Snapshot[] };

export default function AdminAnalyticsPage() {
  const [rows, setRows] = useState<Snapshot[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/analytics').then(async (res) => {
      const payload = await readApiResponse(res);
      if (!res.ok) throw new Error((payload as { error?: string }).error || 'No autorizado');
      setRows(unwrapData<AnalyticsPayload>(payload).snapshots || []);
    }).catch((err) => setError(err instanceof Error ? err.message : 'Error'));
  }, []);

  return (
    <main className="container section"><h1>Admin Analytics</h1>{error && <p className="error-msg">{error}</p>}<div className="card"><table className="data-table"><thead><tr><th>Fecha</th><th>MRR</th><th>Churn</th><th>Nuevas</th><th>Cancelaciones</th><th>Trials</th></tr></thead><tbody>{rows.map((row) => (<tr key={row._id}><td>{new Date(row.snapshotDate).toLocaleDateString()}</td><td>{row.mrr}</td><td>{row.churnRate}</td><td>{row.newSubscriptions}</td><td>{row.cancellations}</td><td>{row.activeTrials}</td></tr>))}</tbody></table></div></main>
  );
}
