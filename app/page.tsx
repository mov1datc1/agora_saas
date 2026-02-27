import Link from 'next/link';
import { PRICES } from '@/lib/pricing';
import { LanguageSwitcher } from '@/components/language-switcher';

const plans = [
  {
    name: 'Basic',
    monthly: PRICES.basic.monthly,
    annual: PRICES.basic.annual,
    description: 'Ideal para firmas pequeñas que quieren visibilidad transaccional.'
  },
  {
    name: 'Pro',
    monthly: PRICES.pro.monthly,
    annual: PRICES.pro.annual,
    description: 'Analítica completa para equipos con foco en crecimiento regional.',
    featured: true
  }
];

export default function HomePage() {
  return (
    <main>
      <section className="hero container">
        <div>
          <LanguageSwitcher />
          <p className="eyebrow">Agora Lexlatin</p>
          <h1>Inteligencia de negocios para decisiones legales y financieras.</h1>
          <p className="lead">
            Analiza fusiones, adquisiciones y financiamientos corporativos en Latinoamérica
            desde una sola plataforma.
          </p>
          <div className="hero-actions">
            <Link href="/signup" className="btn">Quiero la prueba gratis</Link>
            <Link href="/dashboard/billing" className="btn btn-secondary">Ver suscripciones</Link>
          </div>
        </div>
        <div className="hero-panel card">
          <h3>¿Qué incluye?</h3>
          <ul>
            <li>Base de datos curada de operaciones y firmas.</li>
            <li>Panel con métricas comerciales y evolución de mercado.</li>
            <li>Gestión de cobros y suscripciones con Stripe.</li>
          </ul>
        </div>
      </section>

      <section className="container section">
        <h2>Planes de suscripción</h2>
        <div className="grid-two">
          {plans.map((plan) => (
            <article className={`pricing-card card ${plan.featured ? 'featured' : ''}`} key={plan.name}>
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <p><strong>Mensual:</strong> USD {plan.monthly}</p>
              <p><strong>Anual:</strong> USD {plan.annual} (20% off)</p>
              <Link href="/signup" className="btn">Seleccionar {plan.name}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container section muted">
        <h2>Beneficios</h2>
        <div className="grid-three">
          <article className="card"><h3>Descubre nuevos mercados</h3><p>Identifica oportunidades por sector y país con datos contrastados.</p></article>
          <article className="card"><h3>Mide tu desempeño</h3><p>Compara tu firma con la actividad regional de los últimos años.</p></article>
          <article className="card"><h3>Activa en minutos</h3><p>Empieza con prueba gratuita y cancela cuando quieras.</p></article>
        </div>
      </section>
    </main>
  );
}
