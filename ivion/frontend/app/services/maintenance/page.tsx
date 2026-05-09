'use client';

import { useRef, useState } from 'react';
import useRevealOnScroll from '../../../hooks/useRevealOnScroll';
import styles from './maintenance.module.css';

const PLANS = [
  {
    icon: '🔧',
    name: 'Básico',
    price: '29',
    features: [
      'Limpieza externa del dispositivo',
      'Actualización de software',
      'Revisión del estado de la batería',
      'Informe de diagnóstico',
    ],
    featured: false,
  },
  {
    icon: '⭐',
    name: 'Completo',
    price: '59',
    features: [
      'Todo lo del plan Básico',
      'Limpieza interna de ventiladores y puertos',
      'Optimización del rendimiento',
      'Revisión de hardware completa',
      'Copia de seguridad incluida',
    ],
    featured: true,
  },
  {
    icon: '🏆',
    name: 'Premium',
    price: '99',
    features: [
      'Todo lo del plan Completo',
      'Pasta térmica nueva (MacBook)',
      'Revisión de placa base',
      'Prioridad en atención',
      'Garantía extendida de 12 meses',
    ],
    featured: false,
  },
];

const INCLUDED = [
  {
    icon: '🧹',
    name: 'Limpieza interna',
    desc: 'Eliminamos el polvo acumulado en ventiladores, rejillas y componentes internos para mejorar la refrigeración.',
  },
  {
    icon: '⬆️',
    name: 'Actualización de software',
    desc: 'Instalamos las últimas versiones de iOS, macOS y apps para garantizar seguridad y rendimiento óptimo.',
  },
  {
    icon: '🔋',
    name: 'Revisión de batería',
    desc: 'Analizamos el ciclo y estado de la batería e informamos si necesita sustitución próximamente.',
  },
  {
    icon: '🛡️',
    name: 'Revisión de seguridad',
    desc: 'Comprobamos que el dispositivo no tiene malware, perfiles de configuración sospechosos ni vulnerabilidades conocidas.',
  },
  {
    icon: '💾',
    name: 'Copia de seguridad',
    desc: 'Realizamos una copia de seguridad completa antes de cualquier intervención para proteger tus datos.',
  },
  {
    icon: '📊',
    name: 'Informe detallado',
    desc: 'Recibirás un informe completo con el estado de tu dispositivo y recomendaciones personalizadas.',
  },
];

const FREQUENCY = [
  {
    icon: '📱',
    device: 'iPhone',
    period: 'Cada 12 meses',
    desc: 'Limpieza, batería y actualización de software.',
  },
  {
    icon: '💻',
    device: 'MacBook',
    period: 'Cada 6 meses',
    desc: 'Limpieza de ventiladores y pasta térmica.',
  },
  {
    icon: '🖥️',
    device: 'iMac',
    period: 'Cada 12 meses',
    desc: 'Limpieza interna y revisión de componentes.',
  },
  {
    icon: '📱',
    device: 'iPad',
    period: 'Cada 12 meses',
    desc: 'Revisión de batería y actualización de software.',
  },
];

export default function MaintenancePage() {
  const [form, setForm] = useState({ name: '', phone: '', device: '', plan: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const plansRef = useRef<HTMLElement>(null);
  const includedRef = useRef<HTMLElement>(null);
  const frequencyRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const plansVisible = useRevealOnScroll(plansRef);
  const includedVisible = useRevealOnScroll(includedRef);
  const frequencyVisible = useRevealOnScroll(frequencyRef);
  const contactVisible = useRevealOnScroll(contactRef);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={`${styles.hero} ${styles.pageEnter}`}>
        <span className={styles.badge}>Mantenimiento Preventivo Apple</span>
        <h1 className={styles.heroTitle}>
          Mantén tu dispositivo <span>siempre a punto</span>
        </h1>
        <p className={styles.heroSubtitle}>
          El mantenimiento regular prolonga la vida útil de tu dispositivo Apple,
          mejora su rendimiento y previene averías costosas.
        </p>
        <a href="#contacto" className={styles.heroCta}>
          Reservar mantenimiento
        </a>
      </section>

      {/* Plans */}
      <section
        ref={plansRef}
        className={`${styles.plansSection} ${styles.reveal} ${plansVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Planes de mantenimiento</h2>
          <p className={styles.sectionSubtitle}>Elige el plan que mejor se adapta a tus necesidades</p>
          <div className={styles.plansGrid}>
            {PLANS.map((plan) => (
              <div key={plan.name} className={`${styles.planCard} ${plan.featured ? styles.featured : ''}`}>
                {plan.featured && <span className={styles.featuredBadge}>Más popular</span>}
                <span className={styles.planIcon}>{plan.icon}</span>
                <p className={styles.planName}>{plan.name}</p>
                <p className={styles.planPrice}>{plan.price} € <span>/ sesión</span></p>
                <ul className={styles.planFeatures}>
                  {plan.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <a href="#contacto" className={styles.planCta}>Reservar</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section
        ref={includedRef}
        className={`${styles.includedSection} ${styles.reveal} ${includedVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>¿Qué incluye el mantenimiento?</h2>
          <div className={styles.includedGrid}>
            {INCLUDED.map((item) => (
              <div key={item.name} className={styles.includedCard}>
                <span className={styles.includedIcon}>{item.icon}</span>
                <p className={styles.includedName}>{item.name}</p>
                <p className={styles.includedDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequency */}
      <section
        ref={frequencyRef}
        className={`${styles.frequencySection} ${styles.reveal} ${frequencyVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>¿Cada cuánto tiempo?</h2>
          <p className={styles.sectionSubtitle}>Frecuencia recomendada por dispositivo</p>
          <div className={styles.frequencyGrid}>
            {FREQUENCY.map((f) => (
              <div key={f.device} className={styles.frequencyCard}>
                <span className={styles.frequencyIcon}>{f.icon}</span>
                <p className={styles.frequencyDevice}>{f.device}</p>
                <p className={styles.frequencyPeriod}>{f.period}</p>
                <p className={styles.frequencyDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        ref={contactRef}
        id="contacto"
        className={`${styles.contactSection} ${styles.reveal} ${contactVisible ? styles.revealVisible : ''}`}
      >
        <h2 className={styles.contactTitle}>Reserva tu mantenimiento</h2>
        <p className={styles.contactSubtitle}>
          Te confirmamos cita en menos de 24 horas.
        </p>

        {sent ? (
          <p className={styles.successMsg}>
            ¡Reserva recibida! Nos pondremos en contacto contigo pronto.
          </p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre</label>
                <input
                  name="name"
                  type="text"
                  className={styles.input}
                  placeholder="Mario García"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Teléfono</label>
                <input
                  name="phone"
                  type="tel"
                  className={styles.input}
                  placeholder="600 000 000"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Dispositivo</label>
              <select
                name="device"
                className={styles.select}
                value={form.device}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona tu dispositivo</option>
                {FREQUENCY.map((f) => (
                  <option key={f.device} value={f.device}>{f.device}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Plan</label>
              <select
                name="plan"
                className={styles.select}
                value={form.plan}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un plan</option>
                {PLANS.map((p) => (
                  <option key={p.name} value={p.name}>{p.name} — {p.price} €</option>
                ))}
              </select>
            </div>

            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? 'Enviando...' : 'Reservar cita'}
            </button>
          </form>
        )}

        <div className={styles.contactInfo}>
          <span className={styles.contactItem}>📍 Calle Gran Vía 42, Madrid</span>
          <span className={styles.contactItem}>
            📞 <a href="tel:+34912345678">+34 912 345 678</a>
          </span>
          <span className={styles.contactItem}>
            ✉️ <a href="mailto:mantenimiento@ivion.es">mantenimiento@ivion.es</a>
          </span>
        </div>
      </section>
    </div>
  );
}
