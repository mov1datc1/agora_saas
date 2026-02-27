import './globals.css';
import Link from 'next/link';
import { env } from '@/lib/env';
import { AgoraLogo } from '@/components/agora-logo';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="header">
          <div className="container header-inner">
            <AgoraLogo />
            <nav className="nav-links">
              <Link href="/">Inicio</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/dashboard/billing">Suscripciones</Link>
              <Link href="/admin/users">Admin</Link>
            </nav>
            <Link href="/signup" className="btn btn-sm">Prueba gratis</Link>
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
