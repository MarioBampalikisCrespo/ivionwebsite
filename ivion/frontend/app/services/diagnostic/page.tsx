'use client';

import { useRef, useState } from 'react';
import useRevealOnScroll from '../../../hooks/useRevealOnScroll';
import styles from './diagnostic.module.css';

const STEPS = [
  {
    number: 1,
    icon: '📥',
    name: 'Trae tu dispositivo',
    desc: 'Visítanos en tienda o pide cita previa. Sin esperas.',
  },
  {
    number: 2,
    icon: '🔍',
    name: 'Revisión completa',
    desc: 'Nuestros técnicos analizan hardware y software en profundidad.',
  },
  {
    number: 3,
    icon: '📋',
    name: 'Informe detallado',
    desc: 'Recibes un informe con el estado de cada componente y recomendaciones.',
  },
  {
    number: 4,
    icon: '✅',
    name: 'Decides tú',
    desc: 'Sin compromiso. Si no procedes con la reparación, el diagnóstico es gratis.',
  },
];

const CHECKS = [
  {
    icon: '🔋',
    name: 'Estado de la batería',
    desc: 'Medimos la capacidad real, los ciclos de carga y si la batería necesita sustitución.',
  },
  {
    icon: '🖥️',
    name: 'Pantalla y táctil',
    desc: 'Verificamos píxeles muertos, respuesta táctil, brillo y uniformidad del panel.',
  },
  {
    icon: '📡',
    name: 'Conectividad',
    desc: 'Comprobamos WiFi, Bluetooth, NFC, señal móvil y GPS.',
  },
  {
    icon: '🔊',
    name: 'Audio',
    desc: 'Testamos altavoces, auriculares y micrófonos en diferentes escenarios.',
  },
  {
    icon: '📷',
    name: 'Cámaras',
    desc: 'Revisamos calidad de imagen, estabilización, flash y cámara frontal.',
  },
  {
    icon: '🌡️',
    name: 'Temperatura y rendimiento',
    desc: 'Detectamos sobrecalentamiento, cuellos de botella y problemas de rendimiento.',
  },
  {
    icon: '💾',
    name: 'Almacenamiento',
    desc: 'Verificamos el estado del disco, sectores defectuosos y velocidades de lectura/escritura.',
  },
  {
    icon: '🔌',
    name: 'Puerto de carga',
    desc: 'Comprobamos que la carga funciona correctamente y que el conector no está dañado.',
  },
];

const REPORT_ITEMS = [
  'Estado de cada componente (Correcto / Requiere atención / Crítico)',
  'Estimación de vida útil restante del dispositivo',
  'Lista priorizada de reparaciones recomendadas',
  'Presupuesto orientativo para cada intervención',
  'Recomendaciones de uso y mantenimiento',
];

const DEVICES = ['iPhone', 'MacBook', 'iPad', 'Apple Watch', 'AirPods', 'iMac'];

export default function DiagnosticPage() {
  const [form, setForm] = useState({ name: '', phone: '', device: '', notes: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const stepsRef = useRef<HTMLElement>(null);
  const checksRef = useRef<HTMLElement>(null);
  const reportRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const stepsVisible = useRevealOnScroll(stepsRef);
  const checksVisible = useRevealOnScroll(checksRef);
  const reportVisible = useRevealOnScroll(reportRef);
  const contactVisible = useRevealOnScroll(contactRef);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
        <span className={styles.badge}>Diagnóstico Técnico Apple</span>
        <div className={styles.freeBadge}>🎁 Diagnóstico 100% gratuito</div>
        <h1 className={styles.heroTitle}>
          Descubre el estado real<br />de tu <span>dispositivo Apple</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Análisis completo de hardware y software sin ningún coste.
          Solo pagas si decides proceder con la reparación.
        </p>
        <a href="#contacto" className={styles.heroCta}>
          Pedir cita gratuita
        </a>
      </section>

      {/* Steps */}
      <section
        ref={stepsRef}
        className={`${styles.stepsSection} ${styles.reveal} ${stepsVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>¿Cómo funciona?</h2>
          <div className={styles.stepsGrid}>
            {STEPS.map((step) => (
              <div key={step.number} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.number}</div>
                <span className={styles.stepIcon}>{step.icon}</span>
                <p className={styles.stepName}>{step.name}</p>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we check */}
      <section
        ref={checksRef}
        className={`${styles.checksSection} ${styles.reveal} ${checksVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>¿Qué revisamos?</h2>
          <div className={styles.checksGrid}>
            {CHECKS.map((check) => (
              <div key={check.name} className={styles.checkCard}>
                <span className={styles.checkIcon}>{check.icon}</span>
                <p className={styles.checkName}>{check.name}</p>
                <p className={styles.checkDesc}>{check.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report */}
      <section
        ref={reportRef}
        className={`${styles.reportSection} ${styles.reveal} ${reportVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Tu informe de diagnóstico</h2>
          <div className={styles.reportCard}>
            <p className={styles.reportTitle}>📋 ¿Qué incluye el informe?</p>
            <div className={styles.reportItems}>
              {REPORT_ITEMS.map((item) => (
                <div key={item} className={styles.reportItem}>
                  <div className={styles.reportDot} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className={styles.reportNote}>
              El informe se entrega en persona o por email al finalizar el diagnóstico.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        ref={contactRef}
        id="contacto"
        className={`${styles.contactSection} ${styles.reveal} ${contactVisible ? styles.revealVisible : ''}`}
      >
        <h2 className={styles.contactTitle}>Pide tu diagnóstico gratuito</h2>
        <p className={styles.contactSubtitle}>
          Te confirmamos cita en menos de 24 horas.
        </p>

        {sent ? (
          <p className={styles.successMsg}>
            ¡Solicitud recibida! Te contactamos pronto para confirmar tu cita.
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
                {DEVICES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>¿Qué síntomas tiene? (opcional)</label>
              <textarea
                name="notes"
                className={styles.textarea}
                placeholder="Ej: se apaga solo, va lento, no carga..."
                value={form.notes}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? 'Enviando...' : 'Solicitar diagnóstico gratuito'}
            </button>
          </form>
        )}

        <div className={styles.contactInfo}>
          <span className={styles.contactItem}>📍 Calle Gran Vía 42, Madrid</span>
          <span className={styles.contactItem}>
            📞 <a href="tel:+34912345678">+34 912 345 678</a>
          </span>
          <span className={styles.contactItem}>
            ✉️ <a href="mailto:diagnostico@ivion.es">diagnostico@ivion.es</a>
          </span>
        </div>
      </section>
    </div>
  );
}
