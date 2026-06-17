'use client';

import { useRef, useState } from 'react';
import useRevealOnScroll from '../../../hooks/useRevealOnScroll';
import styles from './diagnostic.module.css';

const STEPS = [
  { num: '01', name: 'Trae tu dispositivo',  desc: 'Visítanos en tienda o pide cita previa. Sin esperas ni colas.' },
  { num: '02', name: 'Revisión completa',    desc: 'Nuestros técnicos analizan hardware y software en profundidad.' },
  { num: '03', name: 'Informe detallado',    desc: 'Recibes un informe con el estado de cada componente y recomendaciones.' },
  { num: '04', name: 'Decides tú',           desc: 'Sin compromiso. Si no procedes con la reparación, el diagnóstico es gratis.' },
];

const CHECKS = [
  { name: 'Estado de la batería',      desc: 'Medimos la capacidad real, los ciclos de carga y si la batería necesita sustitución.' },
  { name: 'Pantalla y táctil',         desc: 'Verificamos píxeles muertos, respuesta táctil, brillo y uniformidad del panel.' },
  { name: 'Conectividad',              desc: 'Comprobamos WiFi, Bluetooth, NFC, señal móvil y GPS.' },
  { name: 'Audio',                     desc: 'Testamos altavoces, auriculares y micrófonos en diferentes escenarios.' },
  { name: 'Cámaras',                   desc: 'Revisamos calidad de imagen, estabilización, flash y cámara frontal.' },
  { name: 'Temperatura y rendimiento', desc: 'Detectamos sobrecalentamiento, cuellos de botella y problemas de rendimiento.' },
  { name: 'Almacenamiento',            desc: 'Verificamos el estado del disco, sectores defectuosos y velocidades de lectura/escritura.' },
  { name: 'Puerto de carga',           desc: 'Comprobamos que la carga funciona correctamente y que el conector no está dañado.' },
];

const REPORT_ITEMS = [
  'Estado de cada componente (Correcto / Requiere atención / Crítico)',
  'Estimación de vida útil restante del dispositivo',
  'Lista priorizada de reparaciones recomendadas',
  'Presupuesto orientativo para cada intervención',
  'Recomendaciones de uso y mantenimiento',
];

const DEVICES = ['iPhone', 'MacBook', 'iPad', 'Apple Watch', 'AirPods', 'iMac'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s\-(). ]{9,15}$/;
const NAME_RE  = /^[^<>'";&|]{2,80}$/;

type Field = 'name' | 'phone' | 'email' | 'device';
type FormState = { name: string; email: string; phone: string; device: string; notes: string };

function validate(form: FormState) {
  const e: Partial<Record<Field, string>> = {};
  if (!form.name.trim())              e.name   = "El nombre es obligatorio";
  else if (!NAME_RE.test(form.name))  e.name   = "El nombre no puede contener caracteres especiales";
  if (!form.phone.trim())             e.phone  = "El teléfono es obligatorio";
  else if (!PHONE_RE.test(form.phone))e.phone  = "Introduce un número válido (ej: 600 000 000)";
  if (!form.email.trim())             e.email  = "El email es obligatorio";
  else if (!EMAIL_RE.test(form.email))e.email  = "Introduce un email válido (ej: mario@ejemplo.com)";
  if (!form.device)                   e.device = "Selecciona un dispositivo";
  return e;
}

export default function DiagnosticPage() {
  const [form, setForm]       = useState<FormState>({ name: '', email: '', phone: '', device: '', notes: '' });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const stepsRef   = useRef<HTMLElement>(null);
  const checksRef  = useRef<HTMLElement>(null);
  const reportRef  = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const stepsVisible   = useRevealOnScroll(stepsRef);
  const checksVisible  = useRevealOnScroll(checksRef);
  const reportVisible  = useRevealOnScroll(reportRef);
  const contactVisible = useRevealOnScroll(contactRef);

  const errors = validate(form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBlur = (field: Field) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, device: true });
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    setApiError('');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/api/mail/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: form.email, name: form.name, type: 'DIAGNOSTIC', device: form.device, description: form.notes }),
      });
      setSent(true);
    } catch {
      setApiError('No se pudo enviar la solicitud. Inténtalo de nuevo.');
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
        <p className={styles.eyebrow}>Diagnóstico Técnico Apple</p>
        <p className={styles.heroFree}>Gratuito.</p>
        <h1 className={styles.heroTitle}>Análisis completo de hardware<br />y software sin ningún coste.</h1>
        <p className={styles.heroLead}>Solo pagas si decides proceder con la reparación. Sin letra pequeña.</p>
        <a href="#contacto" className={styles.heroCta}>Pedir cita gratuita</a>
      </section>

      <section
        ref={stepsRef}
        className={`${styles.stepsSection} ${styles.reveal} ${stepsVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.inner}>
          <p className={styles.sectionEyebrow}>Cómo funciona</p>
          <div className={styles.stepsList}>
            {STEPS.map((step) => (
              <div key={step.num} className={styles.stepRow}>
                <span className={styles.stepNum}>{step.num}</span>
                <div className={styles.stepBody}>
                  <p className={styles.stepName}>{step.name}</p>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={checksRef}
        className={`${styles.checksSection} ${styles.reveal} ${checksVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.inner}>
          <p className={styles.sectionEyebrow}>Qué revisamos</p>
          <div className={styles.checksList}>
            {CHECKS.map((check) => (
              <div key={check.name} className={styles.checkRow}>
                <p className={styles.checkName}>{check.name}</p>
                <p className={styles.checkDesc}>{check.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={reportRef}
        className={`${styles.reportSection} ${styles.reveal} ${reportVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.inner}>
          <p className={styles.sectionEyebrow}>El informe</p>
          <div className={styles.reportContent}>
            <p className={styles.reportLead}>Cada diagnóstico incluye un informe escrito con:</p>
            <ul className={styles.reportList}>
              {REPORT_ITEMS.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className={styles.reportNote}>El informe se entrega en persona o por email al finalizar el diagnóstico.</p>
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
            <h2 className={styles.contactTitle}>Pide tu diagnóstico<br />gratuito</h2>
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
              <p className={styles.infoValue}><a href="mailto:diagnostico@ivion.es">diagnostico@ivion.es</a></p>
            </div>
          </div>

          <div className={styles.formCol}>
            {sent ? (
              <div className={styles.successBox}>
                <p className={styles.successTitle}>Solicitud recibida.</p>
                <p className={styles.successText}>Te contactamos pronto para confirmar tu cita de diagnóstico.</p>
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
                <div className={styles.field}>
                  <label className={styles.label}>Dispositivo</label>
                  <select name="device" className={selectCls('device')} value={form.device}
                    onChange={handleChange} onBlur={() => handleBlur('device')}>
                    <option value="">Selecciona tu dispositivo</option>
                    {DEVICES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {err('device')}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>¿Qué síntomas tiene? (opcional)</label>
                  <textarea name="notes" className={styles.textarea}
                    placeholder="Ej: se apaga solo, va lento, no carga..."
                    value={form.notes} onChange={handleChange} />
                </div>
                {apiError && <p className={styles.errorMsg}>{apiError}</p>}
                <button type="submit" className={styles.submit} disabled={loading}>
                  {loading ? 'Enviando...' : 'Solicitar diagnóstico gratuito'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
