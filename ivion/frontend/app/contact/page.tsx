'use client';

import { useState } from 'react';
import styles from './contact.module.css';

const SUBJECTS = ['Consulta general', 'Soporte técnico', 'Pedido o envío', 'Devolución o garantía', 'Colaboración o prensa', 'Otro'];
const FAQS = [
  { q: '¿Cuánto tarda en llegar mi pedido?',  a: 'Los envíos estándar llegan en 2–3 días laborables. El express garantiza entrega en 24 horas.' },
  { q: '¿Puedo devolver un producto?',         a: 'Sí, tienes 14 días desde la recepción para devolver cualquier producto en perfecto estado.' },
  { q: '¿Los productos tienen garantía?',      a: 'Todos incluyen la garantía oficial Apple de 1 año, ampliable con AppleCare+.' },
  { q: '¿Ofrecéis financiación?',              a: 'Sí, financiación flexible de 3 a 24 meses sin intereses en productos seleccionados.' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE  = /^[^<>'";&|]{2,80}$/;
const MSG_RE   = /^[^<>]{1,2000}$/;

type Field = 'name' | 'email' | 'subject' | 'message';
type FormState = { name: string; email: string; subject: string; message: string };

function validate(form: FormState) {
  const e: Partial<Record<Field, string>> = {};
  if (!form.name.trim())              e.name    = "El nombre es obligatorio";
  else if (!NAME_RE.test(form.name))  e.name    = "El nombre no puede contener caracteres especiales";
  if (!form.email.trim())             e.email   = "El email es obligatorio";
  else if (!EMAIL_RE.test(form.email))e.email   = "Introduce un email válido (ej: mario@ejemplo.com)";
  if (!form.subject)                  e.subject = "Selecciona un asunto";
  if (!form.message.trim())           e.message = "El mensaje es obligatorio";
  else if (!MSG_RE.test(form.message))e.message = "El mensaje no puede contener caracteres especiales";
  return e;
}

export default function ContactPage() {
  const [form, setForm]       = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const errors = validate(form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBlur = (field: Field) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    const currentErrors = validate(form);
    if (Object.keys(currentErrors).length > 0) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: form.email, name: form.name, type: 'CONTACT', subject: form.subject, message: form.message }),
      });
      if (!res.ok) throw new Error ('server error');
      setSent(true);
    } catch {
      setApiError('No se pudo enviar el mensaje. Inténtalo de nuevo')
    } finally {
      setLoading(false);
    }
  };

  const err = (f: Field) => touched[f] && errors[f]
    ? <div className={styles.fieldError}>{errors[f]}</div> : null;

  const inputCls  = (f: Field) => `${styles.input}${touched[f] && errors[f] ? ` ${styles.inputError}` : ''}`;
  const selectCls = (f: Field) => `${styles.select}${touched[f] && errors[f] ? ` ${styles.inputError}` : ''}`;
  const areaCls   = (f: Field) => `${styles.textarea}${touched[f] && errors[f] ? ` ${styles.inputError}` : ''}`;

  return (
    <div className={styles.page}>
      <section className={styles.main}>
        <div className={styles.infoCol}>
          <h1 className={styles.title}>Contacta<br />con iVion</h1>
          <p className={styles.intro}>Escríbenos y te respondemos en menos de 24 horas.</p>
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
              <p className={styles.successText}>Gracias por escribirnos. Te contestamos en menos de 24 horas.</p>
              <button className={styles.resetBtn} onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); setTouched({}); }}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Nombre</label>
                  <input name="name" type="text" className={inputCls('name')} placeholder="Mario García"
                    value={form.name} onChange={handleChange} onBlur={() => handleBlur('name')} />
                  {err('name')}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input name="email" type="email" className={inputCls('email')} placeholder="mario@ejemplo.com"
                    value={form.email} onChange={handleChange} onBlur={() => handleBlur('email')} />
                  {err('email')}
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Asunto</label>
                <select name="subject" className={selectCls('subject')} value={form.subject}
                  onChange={handleChange} onBlur={() => handleBlur('subject')}>
                  <option value="">Selecciona un asunto</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {err('subject')}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Mensaje</label>
                <textarea name="message" className={areaCls('message')} placeholder="Cuéntanos en qué podemos ayudarte..."
                  value={form.message} onChange={handleChange} onBlur={() => handleBlur('message')} />
                {err('message')}
              </div>
              {apiError && <p className={styles.errorMsg}>{apiError}</p>}
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
            {FAQS.map(item => (
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
