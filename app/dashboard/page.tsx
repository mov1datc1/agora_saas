import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="container">
      <h1>Dashboard</h1>
      <div className="card"><Link href="/dashboard/billing">Billing</Link></div>
      <div className="card"><Link href="/dashboard/access">Access</Link></div>
      <div className="card"><Link href="/dashboard/security">Security</Link></div>
    </main>
  );
}
