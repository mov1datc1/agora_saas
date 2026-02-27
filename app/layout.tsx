import './globals.css';
import Link from 'next/link';
import { env } from '@/lib/env';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="header">
          <nav>
            <Link href="/">Agora SaaS</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/admin/users">Admin</Link>
          </nav>
        </header>
        {children}
        <footer className="footer">
          <a href={`mailto:${env.SUPPORT_EMAIL}`}>Email soporte</a> · <a href={env.SUPPORT_WHATSAPP_URL}>WhatsApp</a>
        </footer>
      </body>
    </html>
  );
}
