'use client';

import { useRef, useState } from 'react';
import useRevealOnScroll from '../../../hooks/useRevealOnScroll';
import styles from './repair.module.css';

const DEVICES  = ['iPhone', 'MacBook', 'iPad', 'Apple Watch', 'AirPods', 'iMac'];
const SERVICES = [
  { name: 'Reparación de pantalla',  desc: 'Sustitución de pantallas rotas o con problemas de imagen en todos los modelos de iPhone, iPad y MacBook.', time: '1–2 h' },
  { name: 'Cambio de batería',        desc: 'Reemplazamos la batería con componentes certificados para que tu dispositivo vuelva a durar como el primer día.', time: '1 h' },
  { name: 'Daños por líquidos',       desc: 'Diagnóstico y reparación de dispositivos con daños por agua u otros líquidos. Limpieza profesional de placa.', time: '24–48 h' },
  { name: 'Problemas de carga',       desc: 'Revisión y reparación del puerto de carga, conector Lightning o USB-C en iPhones, iPads y MacBooks.', time: '1–3 h' },
  { name: 'Audio y cámara',           desc: 'Reparación de altavoces, micrófono y cámaras traseras o frontales con garantía de funcionamiento.', time: '2–4 h' },
  { name: 'Reparación de placa',      desc: 'Microsoldadura y reparación de componentes de placa base para averías complejas que otros no reparan.', time: '2–5 días' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s\-(). ]{9,15}$/;
const NAME_RE  = /^[^<>'";&|]{2,80}$/;

type Field = 'name' | 'phone' | 'email' | 'device' | 'issue';

type FormState = { name: string; email: string; phone: string; device: string; issue: string; description: string };

function validate(form: FormState) {
  const errors: Partial<Record<Field, string>> = {};

  if (!form.name.trim())
    errors.name   = "El nombre es obligatorio";
  else if (!NAME_RE.test(form.name))
    errors.name   = "El nombre no puede contener caracteres especiales";

  if (!form.phone.trim())
    errors.phone  = "El teléfono es obligatorio";
  else if (!PHONE_RE.test(form.phone))
    errors.phone  = "Introduce un número válido (ej: 600 000 000)";

  if (!form.email.trim())
    errors.email  = "El email es obligatorio";
  else if (!EMAIL_RE.test(form.email))
    errors.email  = "Introduce un email válido (ej: mario@ejemplo.com)";

  if (!form.device)
    errors.device = "Selecciona un dispositivo";

  if (!form.issue)
    errors.issue  = "Selecciona el tipo de avería";

  return errors;
}

export default function RepairPage() {
  const [form, setForm]     = useState<FormState>({ name: '', email: '', phone: '', device: '', issue: '', description: '' });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const servicesRef = useRef<HTMLElement>(null);
  const contactRef  = useRef<HTMLElement>(null);
  const servicesVisible = useRevealOnScroll(servicesRef);
  const contactVisible  = useRevealOnScroll(contactRef);

  const errors = validate(form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBlur = (field: Field) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, device: true, issue: true });
    const currentErrors = validate(form);
    if (Object.keys(currentErrors).length > 0) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: form.email, name: form.name, type: 'REPAIR', device: form.device, issue: form.issue, description: form.description }),
      });
      if (!res.ok) throw new Error ('server error');
      setSent(true);
    } catch {
      setApiError('No se pudo enviar el mensaje. Inténtalo de nuevo')
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (field: Field) =>
    touched[field] && errors[field]
      ? <div className={styles.fieldError}>{errors[field]}</div>
      : null;

  const inputCls = (field: Field) =>
    `${styles.input}${touched[field] && errors[field] ? ` ${styles.inputError}` : ''}`;

  const selectCls = (field: Field) =>
    `${styles.select}${touched[field] && errors[field] ? ` ${styles.inputError}` : ''}`;

  return (
    <div className={styles.page}>

      <section className={`${styles.hero} ${styles.pageEnter}`}>
        <p className={styles.eyebrow}>Servicio Técnico Autorizado Apple</p>
        <h1 className={styles.heroTitle}>Tu dispositivo,<br />arreglado.</h1>
        <p className={styles.heroLead}>Diagnóstico gratuito, presupuesto sin compromiso y garantía de 6 meses en cada reparación.</p>
        <a href="#contacto" className={styles.heroCta}>Solicitar reparación</a>
      </section>

      <section
        ref={servicesRef}
        className={`${styles.servicesSection} ${styles.reveal} ${servicesVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.inner}>
          <div className={styles.devicesRow}>
            {DEVICES.map(d => <span key={d} className={styles.deviceTag}>{d}</span>)}
          </div>
          <div className={styles.servicesList}>
            {SERVICES.map(s => (
              <div key={s.name} className={styles.serviceRow}>
                <div className={styles.serviceMain}>
                  <p className={styles.serviceName}>{s.name}</p>
                  <p className={styles.serviceDesc}>{s.desc}</p>
                </div>
                <p className={styles.serviceTime}>{s.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={contactRef}
        id="contacto"
        className={`${styles.contactSection} ${styles.reveal} ${contactVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.contactInner}>
          <div className={styles.contactInfo}>
            <h2 className={styles.contactTitle}>Solicita tu<br />reparación</h2>
            <p className={styles.contactLead}>Te contactamos en menos de 24 horas para confirmarte el presupuesto y el tiempo estimado.</p>
            <div className={styles.infoBlock}>
              <p className={styles.infoLabel}>Dónde estamos</p>
              <p className={styles.infoValue}>Calle Gran Vía 42, Madrid</p>
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.infoLabel}>Teléfono</p>
              <p className={styles.infoValue}><a href="tel:+34912345678">+34 912 345 678</a></p>
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.infoLabel}>Email</p>
              <p className={styles.infoValue}><a href="mailto:reparaciones@ivion.es">reparaciones@ivion.es</a></p>
            </div>
          </div>

          <div className={styles.formCol}>
            {sent ? (
              <div className={styles.successBox}>
                <p className={styles.successTitle}>Solicitud enviada.</p>
                <p className={styles.successText}>Nos pondremos en contacto contigo en menos de 24 horas.</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Nombre</label>
                    <input
                      name="name" type="text"
                      className={inputCls('name')}
                      placeholder="Mario García"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur('name')}
                    />
                    {fieldError('name')}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Teléfono</label>
                    <input
                      name="phone" type="tel"
                      className={inputCls('phone')}
                      placeholder="600 000 000"
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                    />
                    {fieldError('phone')}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input
                    name="email" type="email"
                    className={inputCls('email')}
                    placeholder="mario@ejemplo.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                  />
                  {fieldError('email')}
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Dispositivo</label>
                    <select
                      name="device"
                      className={selectCls('device')}
                      value={form.device}
                      onChange={handleChange}
                      onBlur={() => handleBlur('device')}
                    >
                      <option value="">Selecciona dispositivo</option>
                      {DEVICES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {fieldError('device')}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Tipo de avería</label>
                    <select
                      name="issue"
                      className={selectCls('issue')}
                      value={form.issue}
                      onChange={handleChange}
                      onBlur={() => handleBlur('issue')}
                    >
                      <option value="">Selecciona avería</option>
                      {SERVICES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                      <option value="Otro">Otro</option>
                    </select>
                    {fieldError('issue')}
                  </div>
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

                {apiError && <p className={styles.errorMsg}>{apiError}</p>}

                <button type="submit" className={styles.submit} disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar solicitud'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
