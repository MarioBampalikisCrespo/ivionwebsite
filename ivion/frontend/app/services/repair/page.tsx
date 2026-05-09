'use client';

import { useRef, useState } from 'react';
import useRevealOnScroll from '../../../hooks/useRevealOnScroll';
import styles from './repair.module.css';

const DEVICES = [
  { icon: '📱', name: 'iPhone' },
  { icon: '💻', name: 'MacBook' },
  { icon: '📱', name: 'iPad' },
  { icon: '⌚', name: 'Apple Watch' },
  { icon: '🎧', name: 'AirPods' },
  { icon: '🖥️', name: 'iMac' },
];

const SERVICES = [
  {
    icon: '🖥️',
    name: 'Reparación de pantalla',
    desc: 'Sustitución de pantallas rotas o con problemas de imagen en todos los modelos de iPhone, iPad y MacBook.',
    time: 'Tiempo estimado: 1–2 horas',
  },
  {
    icon: '🔋',
    name: 'Cambio de batería',
    desc: 'Reemplazamos la batería con componentes certificados para que tu dispositivo vuelva a durar como el primer día.',
    time: 'Tiempo estimado: 1 hora',
  },
  {
    icon: '💧',
    name: 'Daños por líquidos',
    desc: 'Diagnóstico y reparación de dispositivos con daños por agua u otros líquidos. Limpieza profesional de placa.',
    time: 'Tiempo estimado: 24–48 horas',
  },
  {
    icon: '🔌',
    name: 'Problemas de carga',
    desc: 'Revisión y reparación del puerto de carga, conector Lightning o USB-C en iPhones, iPads y MacBooks.',
    time: 'Tiempo estimado: 1–3 horas',
  },
  {
    icon: '🔊',
    name: 'Audio y cámara',
    desc: 'Reparación de altavoces, micrófono y cámaras traseras o frontales con garantía de funcionamiento.',
    time: 'Tiempo estimado: 2–4 horas',
  },
  {
    icon: '🛠️',
    name: 'Reparación de placa',
    desc: 'Microsoldadura y reparación de componentes de placa base para averías complejas que otros no reparan.',
    time: 'Tiempo estimado: 2–5 días',
  },
];

const GUARANTEES = [
  {
    icon: '✅',
    title: 'Garantía de 6 meses',
    text: 'Todas nuestras reparaciones incluyen 6 meses de garantía sobre la pieza y la mano de obra.',
  },
  {
    icon: '🔍',
    title: 'Diagnóstico gratuito',
    text: 'Revisamos tu dispositivo sin coste. Solo pagas si decides proceder con la reparación.',
  },
  {
    icon: '⚡',
    title: 'Reparación express',
    text: 'La mayoría de reparaciones se completan el mismo día. Sin esperas innecesarias.',
  },
  {
    icon: '🏅',
    title: 'Técnicos certificados',
    text: 'Nuestro equipo está formado y certificado directamente por Apple.',
  },
];

export default function RepairPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    device: '',
    issue: '',
    description: '',
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const devicesRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const guaranteeRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const devicesVisible = useRevealOnScroll(devicesRef);
  const servicesVisible = useRevealOnScroll(servicesRef);
  const guaranteeVisible = useRevealOnScroll(guaranteeRef);
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
        <span className={styles.badge}>Servicio Técnico Autorizado Apple</span>
        <h1 className={styles.heroTitle}>
          Reparamos tu <span>dispositivo Apple</span><br />como nuevo
        </h1>
        <p className={styles.heroSubtitle}>
          Técnicos certificados, piezas originales y garantía de 6 meses en todas las reparaciones.
          Diagnóstico siempre gratuito.
        </p>
        <a href="#contacto" className={styles.heroCta}>
          Solicitar reparación
        </a>
      </section>

      {/* Devices */}
      <section
        ref={devicesRef}
        className={`${styles.devicesSection} ${styles.reveal} ${devicesVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Dispositivos que reparamos</h2>
          <div className={styles.devicesGrid}>
            {DEVICES.map((d) => (
              <div key={d.name} className={styles.deviceCard}>
                <span className={styles.deviceIcon}>{d.icon}</span>
                <span className={styles.deviceName}>{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        ref={servicesRef}
        className={`${styles.servicesSection} ${styles.reveal} ${servicesVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>¿Qué reparamos?</h2>
          <div className={styles.servicesGrid}>
            {SERVICES.map((s) => (
              <div key={s.name} className={styles.serviceCard}>
                <span className={styles.serviceIcon}>{s.icon}</span>
                <p className={styles.serviceName}>{s.name}</p>
                <p className={styles.serviceDesc}>{s.desc}</p>
                <p className={styles.serviceTime}>{s.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section
        ref={guaranteeRef}
        className={`${styles.guaranteeSection} ${styles.reveal} ${guaranteeVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>¿Por qué elegirnos?</h2>
          <div className={styles.guaranteeGrid}>
            {GUARANTEES.map((g) => (
              <div key={g.title} className={styles.guaranteeCard}>
                <span className={styles.guaranteeIcon}>{g.icon}</span>
                <p className={styles.guaranteeTitle}>{g.title}</p>
                <p className={styles.guaranteeText}>{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section
        ref={contactRef}
        id="contacto"
        className={`${styles.contactSection} ${styles.reveal} ${contactVisible ? styles.revealVisible : ''}`}
      >
        <h2 className={styles.contactTitle}>Solicita tu reparación</h2>
        <p className={styles.contactSubtitle}>
          Rellena el formulario y te contactamos en menos de 24 horas.
        </p>

        {sent ? (
          <p className={styles.successMsg}>
            ¡Solicitud enviada! Nos pondremos en contacto contigo pronto.
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
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Tipo de avería</label>
              <select
                name="issue"
                className={styles.select}
                value={form.issue}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona el tipo de avería</option>
                {SERVICES.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Descripción (opcional)</label>
              <textarea
                name="description"
                className={styles.textarea}
                placeholder="Cuéntanos qué le pasa a tu dispositivo..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </form>
        )}

        <div className={styles.contactInfo}>
          <span className={styles.contactItem}>
            📍 Calle Gran Vía 42, Madrid
          </span>
          <span className={styles.contactItem}>
            📞 <a href="tel:+34912345678">+34 912 345 678</a>
          </span>
          <span className={styles.contactItem}>
            ✉️ <a href="mailto:reparaciones@ivion.es">reparaciones@ivion.es</a>
          </span>
        </div>
      </section>
    </div>
  );
}
