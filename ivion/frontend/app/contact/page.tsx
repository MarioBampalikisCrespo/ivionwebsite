'use client';

import { useState } from 'react';
import styles from './contact.module.css';

const SUBJECTS = [
  'Consulta general',
  'Soporte técnico',
  'Pedido o envío',
  'Devolución o garantía',
  'Colaboración o prensa',
  'Otro',
];

const FAQS = [
  { q: '¿Cuánto tarda en llegar mi pedido?', a: 'Los envíos estándar llegan en 2–3 días laborables. El express garantiza entrega en 24 horas.' },
  { q: '¿Puedo devolver un producto?', a: 'Sí, tienes 14 días desde la recepción para devolver cualquier producto en perfecto estado.' },
  { q: '¿Los productos tienen garantía?', a: 'Todos incluyen la garantía oficial Apple de 1 año, ampliable con AppleCare+.' },
  { q: '¿Ofrecéis financiación?', a: 'Sí, financiación flexible de 3 a 24 meses sin intereses en productos seleccionados.' },
];

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/api/mail/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: form.email, name: form.name, type: 'CONTACT', subject: form.subject, message: form.message }),
      });
      setSent(true);
    } catch {
      setError('No se pudo enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>

      <section className={styles.main}>
        <div className={styles.infoCol}>
          <h1 className={styles.title}>Contacta<br />con iVion</h1>
          <p className={styles.intro}>
            Escríbenos y te respondemos en menos de 24 horas.
          </p>

          <div className={styles.infoBlock}>
            <p className={styles.infoLabel}>Dónde estamos</p>
            <p className={styles.infoValue}>Calle Gran Vía 42</p>
            <p className={styles.infoValue}>Madrid, 28013</p>
          </div>

          <div className={styles.infoBlock}>
            <p className={styles.infoLabel}>Teléfono</p>
            <p className={styles.infoValue}>+34 912 345 678</p>
          </div>

          <div className={styles.infoBlock}>
            <p className={styles.infoLabel}>Email</p>
            <p className={styles.infoValue}>hola@ivion.es</p>
            <p className={styles.infoValue}>soporte@ivion.es</p>
          </div>

          <div className={styles.infoBlock}>
            <p className={styles.infoLabel}>Horario</p>
            <p className={styles.infoValue}>Lun–Vie · 9:00–20:00</p>
            <p className={styles.infoValue}>Sáb · 10:00–14:00</p>
          </div>
        </div>

        <div className={styles.formCol}>
          {sent ? (
            <div className={styles.successBox}>
              <p className={styles.successTitle}>Mensaje enviado.</p>
              <p className={styles.successText}>
                Gracias por escribirnos. Te contestamos en menos de 24 horas.
              </p>
              <button
                className={styles.resetBtn}
                onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Nombre</label>
                  <input name="name" type="text" className={styles.input} placeholder="Mario García" value={form.name} onChange={handleChange} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input name="email" type="email" className={styles.input} placeholder="mario@ejemplo.com" value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Asunto</label>
                <select name="subject" className={styles.select} value={form.subject} onChange={handleChange} required>
                  <option value="">Selecciona un asunto</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Mensaje</label>
                <textarea name="message" className={styles.textarea} placeholder="Cuéntanos en qué podemos ayudarte..." value={form.message} onChange={handleChange} required />
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}
              <button type="submit" className={styles.submit} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          <p className={styles.faqEyebrow}>Preguntas frecuentes</p>
          <div className={styles.faqList}>
            {FAQS.map((item) => (
              <div key={item.q} className={styles.faqItem}>
                <p className={styles.faqQ}>{item.q}</p>
                <p className={styles.faqA}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
