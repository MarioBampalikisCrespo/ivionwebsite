'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import useRevealOnScroll from '../../hooks/useRevealOnScroll';
import styles from './support.module.css';

const TOPICS = [
  {
    title: 'Pedidos y envíos',
    desc: 'Consulta el estado de tu pedido, tiempos de entrega y opciones de envío disponibles.',
    href: '/contact',
  },
  {
    title: 'Devoluciones',
    desc: 'Tienes 14 días desde la recepción para devolver cualquier producto en perfecto estado.',
    href: '/contact',
  },
  {
    title: 'Garantía',
    desc: 'Todos los productos incluyen garantía oficial Apple de 1 año ampliable con AppleCare+.',
    href: '/contact',
  },
  {
    title: 'Reparaciones',
    desc: 'Servicio técnico autorizado Apple. Diagnóstico gratuito y reparación express.',
    href: '/services/repair',
  },
  {
    title: 'Pagos y financiación',
    desc: 'Financiación sin intereses de 3 a 24 meses en productos seleccionados.',
    href: '/contact',
  },
  {
    title: 'Cuenta y seguridad',
    desc: 'Gestiona tu cuenta, cambia tu contraseña o recupera el acceso a tu perfil.',
    href: '/account',
  },
];

const FAQS = [
  {
    q: '¿Cuánto tarda en llegar mi pedido?',
    a: 'El envío estándar tarda 2–3 días laborables. Con envío express garantizamos entrega en 24 horas.',
  },
  {
    q: '¿Cómo hago una devolución?',
    a: 'Contacta con nosotros dentro de los 14 días siguientes a la recepción. El producto debe estar en perfecto estado y con su embalaje original.',
  },
  {
    q: '¿Los productos son originales de Apple?',
    a: 'Sí, todos nuestros productos son 100% originales Apple, adquiridos a través de distribuidores oficiales autorizados.',
  },
  {
    q: '¿Puedo ampliar la garantía?',
    a: 'Puedes ampliar la garantía de tu dispositivo con AppleCare+ directamente desde la app Ajustes o en cualquiera de nuestras tiendas.',
  },
  {
    q: '¿Cómo puedo seguir mi pedido?',
    a: 'Recibirás un email con el número de seguimiento en cuanto tu pedido sea enviado. También puedes consultarlo en tu área de cliente.',
  },
  {
    q: '¿Aceptáis Apple Pay?',
    a: 'Sí, aceptamos Apple Pay, tarjeta de crédito/débito, PayPal y transferencia bancaria.',
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const topicsRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const topicsVisible = useRevealOnScroll(topicsRef);
  const faqVisible = useRevealOnScroll(faqRef);
  const ctaVisible = useRevealOnScroll(ctaRef);

  return (
    <div className={styles.page}>
      <section className={`${styles.hero} ${styles.pageEnter}`}>
        <span className={styles.eyebrow}>Centro de ayuda</span>
        <h1 className={styles.heroTitle}>¿En qué podemos ayudarte?</h1>
        <p className={styles.heroSubtitle}>
          Encuentra respuesta a tus dudas o contacta con nuestro equipo de soporte.
          Disponibles de lunes a viernes de 9:00 a 20:00.
        </p>
      </section>

      <section
        ref={topicsRef}
        className={`${styles.topicsSection} ${styles.reveal} ${topicsVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>¿Sobre qué necesitas ayuda?</h2>
          <div className={styles.topicsGrid}>
            {TOPICS.map((topic) => (
              <Link key={topic.title} href={topic.href} className={styles.topicCard}>
                <p className={styles.topicTitle}>{topic.title}</p>
                <p className={styles.topicDesc}>{topic.desc}</p>
                <span className={styles.topicArrow}>Más información ↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={faqRef}
        className={`${styles.faqSection} ${styles.reveal} ${faqVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Preguntas frecuentes</h2>
          <div className={styles.faqList}>
            {FAQS.map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className={`${styles.faqChevron} ${openFaq === i ? styles.faqChevronOpen : ''}`}>›</span>
                </button>
                {openFaq === i && (
                  <p className={styles.faqAnswer}>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={ctaRef}
        className={`${styles.ctaSection} ${styles.reveal} ${ctaVisible ? styles.revealVisible : ''}`}
      >
        <h2 className={styles.ctaTitle}>¿No encontraste lo que buscabas?</h2>
        <p className={styles.ctaSubtitle}>
          Nuestro equipo está listo para ayudarte. Escríbenos y te responderemos en menos de 24 horas.
        </p>
        <Link href="/contact" className={styles.ctaBtn}>
          Contactar con soporte
        </Link>
      </section>
    </div>
  );
}
