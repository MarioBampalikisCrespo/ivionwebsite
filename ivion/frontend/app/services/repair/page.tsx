'use client';

import { useRef, useState } from 'react';
import useRevealOnScroll from '../../../hooks/useRevealOnScroll';
import styles from './repair.module.css';

const DEVICES = ['iPhone', 'MacBook', 'iPad', 'Apple Watch', 'AirPods', 'iMac'];

const SERVICES = [
  { name: 'Reparación de pantalla',  desc: 'Sustitución de pantallas rotas o con problemas de imagen en todos los modelos de iPhone, iPad y MacBook.', time: '1–2 h' },
  { name: 'Cambio de batería',        desc: 'Reemplazamos la batería con componentes certificados para que tu dispositivo vuelva a durar como el primer día.', time: '1 h' },
  { name: 'Daños por líquidos',       desc: 'Diagnóstico y reparación de dispositivos con daños por agua u otros líquidos. Limpieza profesional de placa.', time: '24–48 h' },
  { name: 'Problemas de carga',       desc: 'Revisión y reparación del puerto de carga, conector Lightning o USB-C en iPhones, iPads y MacBooks.', time: '1–3 h' },
  { name: 'Audio y cámara',           desc: 'Reparación de altavoces, micrófono y cámaras traseras o frontales con garantía de funcionamiento.', time: '2–4 h' },
  { name: 'Reparación de placa',      desc: 'Microsoldadura y reparación de componentes de placa base para averías complejas que otros no reparan.', time: '2–5 días' },
];

export default function RepairPage() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', device: '', issue: '', description: '' });
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const servicesRef = useRef<HTMLElement>(null);
  const contactRef  = useRef<HTMLElement>(null);

  const servicesVisible = useRevealOnScroll(servicesRef);
  const contactVisible  = useRevealOnScroll(contactRef);

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
        body: JSON.stringify({ to: form.email, name: form.name, type: 'REPAIR', device: form.device, issue: form.issue, description: form.description }),
      });
      setSent(true);
    } catch {
      setError('No se pudo enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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
            {DEVICES.map((d) => <span key={d} className={styles.deviceTag}>{d}</span>)}
          </div>

          <div className={styles.servicesList}>
            {SERVICES.map((s) => (
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
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Nombre</label>
                    <input name="name" type="text" className={styles.input} placeholder="Mario García" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Teléfono</label>
                    <input name="phone" type="tel" className={styles.input} placeholder="600 000 000" value={form.phone} onChange={handleChange} required />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input name="email" type="email" className={styles.input} placeholder="mario@ejemplo.com" value={form.email} onChange={handleChange} required />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Dispositivo</label>
                    <select name="device" className={styles.select} value={form.device} onChange={handleChange} required>
                      <option value="">Selecciona dispositivo</option>
                      {DEVICES.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Tipo de avería</label>
                    <select name="issue" className={styles.select} value={form.issue} onChange={handleChange} required>
                      <option value="">Selecciona avería</option>
                      {SERVICES.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Descripción (opcional)</label>
                  <textarea name="description" className={styles.textarea} placeholder="Cuéntanos qué le pasa a tu dispositivo..." value={form.description} onChange={handleChange} />
                </div>
                {error && <p className={styles.errorMsg}>{error}</p>}
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
