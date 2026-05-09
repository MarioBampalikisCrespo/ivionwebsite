'use client';

import { useRef, useState } from 'react';
import useRevealOnScroll from '../../hooks/useRevealOnScroll';
import styles from './contact.module.css';

const INFO_CARDS = [
  {
    icon: '📍',
    title: 'Dirección',
    lines: ['Calle Gran Vía 42', 'Madrid, 28013'],
  },
  {
    icon: '📞',
    title: 'Teléfono',
    lines: ['+34 912 345 678', 'Lun–Vie: 9:00–20:00'],
  },
  {
    icon: '✉️',
    title: 'Email',
    lines: ['hola@ivion.es', 'soporte@ivion.es'],
  },
  {
    icon: '🕐',
    title: 'Horario',
    lines: ['Lun–Vie: 9:00–20:00', 'Sáb: 10:00–14:00'],
  },
];

const SUBJECTS = [
  'Consulta general',
  'Soporte técnico',
  'Pedido o envío',
  'Devolución o garantía',
  'Colaboración o prensa',
  'Otro',
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const infoRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  const infoVisible = useRevealOnScroll(infoRef);
  const formVisible = useRevealOnScroll(formRef);
  const faqVisible = useRevealOnScroll(faqRef);

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
        <span className={styles.badge}>Estamos aquí para ayudarte</span>
        <h1 className={styles.heroTitle}>
          Contacta con <span>Ivion</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Tienes alguna duda, consulta o necesitas ayuda con tu pedido? Escríbenos y te respondemos
          en menos de 24 horas.
        </p>
      </section>

      {/* Info cards */}
      <section
        ref={infoRef}
        className={`${styles.infoSection} ${styles.reveal} ${infoVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <div className={styles.infoGrid}>
            {INFO_CARDS.map((card) => (
              <div key={card.title} className={styles.infoCard}>
                <span className={styles.infoIcon}>{card.icon}</span>
                <p className={styles.infoTitle}>{card.title}</p>
                {card.lines.map((line) => (
                  <p key={line} className={styles.infoLine}>{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section
        ref={formRef}
        className={`${styles.formSection} ${styles.reveal} ${formVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.formInner}>
          <h2 className={styles.sectionTitle}>Envíanos un mensaje</h2>
          <p className={styles.sectionSubtitle}>
            Rellena el formulario y te responderemos lo antes posible.
          </p>

          {sent ? (
            <div className={styles.successBox}>
              <span className={styles.successIcon}>✅</span>
              <p className={styles.successTitle}>¡Mensaje enviado!</p>
              <p className={styles.successText}>
                Gracias por contactarnos. Te responderemos en menos de 24 horas.
              </p>
              <button className={styles.resetBtn} onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                Enviar otro mensaje
              </button>
            </div>
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
                  <label className={styles.label}>Email</label>
                  <input
                    name="email"
                    type="email"
                    className={styles.input}
                    placeholder="mario@ejemplo.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Asunto</label>
                <select
                  name="subject"
                  className={styles.select}
                  value={form.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un asunto</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Mensaje</label>
                <textarea
                  name="message"
                  className={styles.textarea}
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className={styles.submit} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section
        ref={faqRef}
        className={`${styles.faqSection} ${styles.reveal} ${faqVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Preguntas frecuentes</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQ}>¿Cuánto tarda en llegar mi pedido?</p>
              <p className={styles.faqA}>Los envíos estándar llegan en 2–3 días laborables. El envío express garantiza entrega en 24 horas.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQ}>¿Puedo devolver un producto?</p>
              <p className={styles.faqA}>Sí, tienes 14 días desde la recepción para devolver cualquier producto en perfecto estado.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQ}>¿Los productos tienen garantía?</p>
              <p className={styles.faqA}>Todos los productos incluyen la garantía oficial de Apple de 1 año, ampliable con AppleCare+.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQ}>¿Ofrecéis financiación?</p>
              <p className={styles.faqA}>Sí, disponemos de financiación flexible desde 3 hasta 24 meses sin intereses en productos seleccionados.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
