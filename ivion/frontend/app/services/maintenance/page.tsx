'use client';

import { useRef, useState } from 'react';
import useRevealOnScroll from '../../../hooks/useRevealOnScroll';
import styles from './maintenance.module.css';

const PLANS = [
  {
    name: 'Básico',
    price: '29',
    features: [
      'Limpieza externa del dispositivo',
      'Actualización de software',
      'Revisión del estado de la batería',
      'Informe de diagnóstico',
    ],
  },
  {
    name: 'Completo',
    price: '59',
    features: [
      'Todo lo del plan Básico',
      'Limpieza interna de ventiladores y puertos',
      'Optimización del rendimiento',
      'Revisión de hardware completa',
      'Copia de seguridad incluida',
    ],
  },
  {
    name: 'Premium',
    price: '99',
    features: [
      'Todo lo del plan Completo',
      'Pasta térmica nueva (MacBook)',
      'Revisión de placa base',
      'Prioridad en atención',
      'Garantía extendida de 12 meses',
    ],
  },
];

const INCLUDED = [
  { name: 'Limpieza interna',      desc: 'Eliminamos el polvo acumulado en ventiladores, rejillas y componentes internos para mejorar la refrigeración.' },
  { name: 'Actualización de software', desc: 'Instalamos las últimas versiones de iOS, macOS y apps para garantizar seguridad y rendimiento óptimo.' },
  { name: 'Revisión de batería',   desc: 'Analizamos el ciclo y estado de la batería e informamos si necesita sustitución próximamente.' },
  { name: 'Revisión de seguridad', desc: 'Comprobamos que el dispositivo no tiene malware, perfiles sospechosos ni vulnerabilidades conocidas.' },
  { name: 'Copia de seguridad',    desc: 'Realizamos una copia completa antes de cualquier intervención para proteger tus datos.' },
  { name: 'Informe detallado',     desc: 'Recibirás un informe completo con el estado de tu dispositivo y recomendaciones personalizadas.' },
];

const FREQUENCY = [
  { device: 'iPhone',  period: 'Cada 12 meses', desc: 'Limpieza, batería y actualización de software.' },
  { device: 'MacBook', period: 'Cada 6 meses',  desc: 'Limpieza de ventiladores y pasta térmica.' },
  { device: 'iMac',    period: 'Cada 12 meses', desc: 'Limpieza interna y revisión de componentes.' },
  { device: 'iPad',    period: 'Cada 12 meses', desc: 'Revisión de batería y actualización de software.' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s\-(). ]{9,15}$/;
const NAME_RE  = /^[^<>'";&|]{2,80}$/;

type Field = 'name' | 'phone' | 'email' | 'device' | 'plan';
type FormState = { name: string; email: string; phone: string; device: string; plan: string };

function validate(form: FormState) {
  const e: Partial<Record<Field, string>> = {};
  if (!form.name.trim())              e.name   = "El nombre es obligatorio";
  else if (!NAME_RE.test(form.name))  e.name   = "El nombre no puede contener caracteres especiales";
  if (!form.phone.trim())             e.phone  = "El teléfono es obligatorio";
  else if (!PHONE_RE.test(form.phone))e.phone  = "Introduce un número válido (ej: 600 000 000)";
  if (!form.email.trim())             e.email  = "El email es obligatorio";
  else if (!EMAIL_RE.test(form.email))e.email  = "Introduce un email válido (ej: mario@ejemplo.com)";
  if (!form.device)                   e.device = "Selecciona un dispositivo";
  if (!form.plan)                     e.plan   = "Selecciona un plan";
  return e;
}

export default function MaintenancePage() {
  const [form, setForm]       = useState<FormState>({ name: '', email: '', phone: '', device: '', plan: '' });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const plansRef     = useRef<HTMLElement>(null);
  const includedRef  = useRef<HTMLElement>(null);
  const frequencyRef = useRef<HTMLElement>(null);
  const contactRef   = useRef<HTMLElement>(null);

  const plansVisible     = useRevealOnScroll(plansRef);
  const includedVisible  = useRevealOnScroll(includedRef);
  const frequencyVisible = useRevealOnScroll(frequencyRef);
  const contactVisible   = useRevealOnScroll(contactRef);

  const errors = validate(form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBlur = (field: Field) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, device: true, plan: true });
        const currentErrors = validate(form);
    if (Object.keys(currentErrors).length > 0) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: form.email, name: form.name, type: 'MAINTENANCE', device: form.device, plan: form.plan }),
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

  return (
    <div className={styles.page}>

      <section className={`${styles.hero} ${styles.pageEnter}`}>
        <p className={styles.eyebrow}>Mantenimiento Preventivo Apple</p>
        <h1 className={styles.heroTitle}>Cuida tu dispositivo<br />antes de que falle.</h1>
        <p className={styles.heroLead}>El mantenimiento regular prolonga la vida útil, mejora el rendimiento y previene averías costosas.</p>
        <p className={styles.heroPrice}>Desde 29 € <span>· Incluye diagnóstico y copia de seguridad</span></p>
      </section>

      <section
        ref={plansRef}
        className={`${styles.plansSection} ${styles.reveal} ${plansVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.inner}>
          <p className={styles.sectionEyebrow}>Planes</p>
          <div className={styles.plansList}>
            {PLANS.map((plan) => (
              <div key={plan.name} className={styles.planRow}>
                <div className={styles.planHeader}>
                  <p className={styles.planName}>{plan.name}</p>
                  <p className={styles.planPrice}>{plan.price} <span>€ / sesión</span></p>
                </div>
                <ul className={styles.planFeatures}>
                  {plan.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <a href="#contacto" className={styles.planCta}>Reservar</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={includedRef}
        className={`${styles.includedSection} ${styles.reveal} ${includedVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.inner}>
          <p className={styles.sectionEyebrow}>Qué incluye</p>
          <div className={styles.includedList}>
            {INCLUDED.map((item) => (
              <div key={item.name} className={styles.includedRow}>
                <p className={styles.includedName}>{item.name}</p>
                <p className={styles.includedDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={frequencyRef}
        className={`${styles.frequencySection} ${styles.reveal} ${frequencyVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.inner}>
          <p className={styles.sectionEyebrow}>Frecuencia recomendada</p>
          <div className={styles.frequencyList}>
            {FREQUENCY.map((f) => (
              <div key={f.device} className={styles.frequencyRow}>
                <p className={styles.frequencyDevice}>{f.device}</p>
                <p className={styles.frequencyPeriod}>{f.period}</p>
                <p className={styles.frequencyDesc}>{f.desc}</p>
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
            <h2 className={styles.contactTitle}>Reserva tu<br />mantenimiento</h2>
            <p className={styles.contactLead}>Te confirmamos cita en menos de 24 horas.</p>
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
              <p className={styles.infoValue}><a href="mailto:mantenimiento@ivion.es">mantenimiento@ivion.es</a></p>
            </div>
          </div>

          <div className={styles.formCol}>
            {sent ? (
              <div className={styles.successBox}>
                <p className={styles.successTitle}>Reserva recibida.</p>
                <p className={styles.successText}>Nos pondremos en contacto contigo pronto para confirmar tu cita.</p>
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
                    <label className={styles.label}>Teléfono</label>
                    <input name="phone" type="tel" className={inputCls('phone')} placeholder="600 000 000"
                      value={form.phone} onChange={handleChange} onBlur={() => handleBlur('phone')} />
                    {err('phone')}
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input name="email" type="email" className={inputCls('email')} placeholder="mario@ejemplo.com"
                    value={form.email} onChange={handleChange} onBlur={() => handleBlur('email')} />
                  {err('email')}
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Dispositivo</label>
                    <select name="device" className={selectCls('device')} value={form.device}
                      onChange={handleChange} onBlur={() => handleBlur('device')}>
                      <option value="">Selecciona dispositivo</option>
                      {FREQUENCY.map((f) => <option key={f.device} value={f.device}>{f.device}</option>)}
                    </select>
                    {err('device')}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Plan</label>
                    <select name="plan" className={selectCls('plan')} value={form.plan}
                      onChange={handleChange} onBlur={() => handleBlur('plan')}>
                      <option value="">Selecciona un plan</option>
                      {PLANS.map((p) => <option key={p.name} value={p.name}>{p.name} — {p.price} €</option>)}
                    </select>
                    {err('plan')}
                  </div>
                </div>
                {apiError && <p className={styles.errorMsg}>{apiError}</p>}
                <button type="submit" className={styles.submit} disabled={loading}>
                  {loading ? 'Enviando...' : 'Reservar cita'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
