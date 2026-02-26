import Link from 'next/link';
import { PRICES } from '@/lib/pricing';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function HomePage() {
  return (
    <main className="container">
      <LanguageSwitcher />
      <section>
        <h1>Agora Legal SaaS</h1>
        <p>Plataforma comercial para abogados independientes y firmas en LATAM + USA.</p>
        <Link href="/signup" className="btn">Comenzar prueba de 7 días</Link>
      </section>
      <section>
        <h2>Beneficios</h2>
        <ul>
          <li>Gestión de suscripción y cobros con Stripe.</li>
          <li>Provisionamiento de acceso semiautomático.</li>
          <li>Panel de administración con analítica SaaS.</li>
        </ul>
      </section>
      <section>
        <h2>Precios</h2>
        <table>
          <tbody>
            <tr><td>Basic mensual</td><td>USD {PRICES.basic.monthly}</td></tr>
            <tr><td>Pro mensual</td><td>USD {PRICES.pro.monthly}</td></tr>
            <tr><td>Basic anual (20% off)</td><td>USD {PRICES.basic.annual}</td></tr>
            <tr><td>Pro anual (20% off)</td><td>USD {PRICES.pro.annual}</td></tr>
          </tbody>
        </table>
      </section>
      <section>
        <h2>FAQ</h2>
        <p>Incluye prueba gratuita de 7 días y cancelación self-service.</p>
      </section>
    </main>
  );
}
