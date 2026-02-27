import './globals.css';
import Link from 'next/link';
import { env } from '@/lib/env';
import { AgoraLogo } from '@/components/agora-logo';
import { getSession } from '@/lib/auth';
import { LogoutButton } from '@/components/logout-button';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <html lang="es">
      <body>
        <header className="header">
          <div className="container header-inner">
            <AgoraLogo />
            <nav className="nav-links">
              <Link href="/">Inicio</Link>
              {session && <Link href="/dashboard">Dashboard</Link>}
              {session && <Link href="/dashboard/billing">Suscripciones</Link>}
              {session?.role === 'admin' && <Link href="/admin/users">Admin</Link>}
            </nav>
            {session ? (
              <LogoutButton />
            ) : (
              <div className="header-actions">
                <Link href="/login" className="btn btn-sm btn-secondary">Ingresar</Link>
                <Link href="/signup" className="btn btn-sm">Prueba gratis</Link>
              </div>
            )}
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="container footer-inner">
            <AgoraLogo />
            <div>
              <a href={`mailto:${env.SUPPORT_EMAIL}`}>Email soporte</a> ·{' '}
              <a href={env.SUPPORT_WHATSAPP_URL}>WhatsApp</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
