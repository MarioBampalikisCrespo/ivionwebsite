'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useRevealOnScroll from '../hooks/useRevealOnScroll';
import styles from './page.module.css';

const CATEGORIES = [
  { name: 'iPhone',      icon: '📱', href: '/buy/products?category=1' },
  { name: 'iPad',        icon: '🖥️', href: '/buy/products?category=2' },
  { name: 'MacBook',     icon: '💻', href: '/buy/products?category=3' },
  { name: 'Accesorios',  icon: '🎧', href: '/buy/products?category=4' },
];

const FEATURES = [
  {
    image: '/iphone_offer.jpg',
    title: '¿Teléfono viejo?',
    text: 'En iVion tu nuevo iPhone te espera con precios que no creerás.',
    cta: 'Ver iPhones',
    href: '/buy/products?category=1',
    reverse: false,
  },
  {
    image: '/repair_service.jpg',
    title: 'Servicio técnico autorizado',
    text: 'Trabajamos junto a Apple para que tu dispositivo quede como recién salido de la caja.',
    cta: 'Más información',
    href: '/services/repair',
    reverse: true,
  },
  {
    image: '/online_store.jpg',
    title: 'Explora nuestra tienda online',
    text: 'Compra desde casa con confianza y envío en 24h.',
    cta: 'Ir a la tienda',
    href: '/buy/products',
    reverse: false,
  },
];

function FeatureCard({ image, title, text, cta, href, reverse }: typeof FEATURES[0]) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useRevealOnScroll(ref as React.RefObject<HTMLElement>);

  return (
    <div
      ref={ref}
      className={`${styles.featureCard} ${reverse ? styles.featureCardReverse : ''} ${styles.reveal} ${visible ? styles.revealVisible : ''}`}
    >
      <div className={styles.featureImageWrapper}>
        <Image src={image} alt={title} fill style={{ objectFit: 'cover' }} />
      </div>
      <div className={styles.featureText}>
        <h2 className={styles.featureTitle}>{title}</h2>
        <p className={styles.featureDesc}>{text}</p>
        <Link href={href} className={styles.featureCta}>{cta}</Link>
      </div>
    </div>
  );
}

export default function Home() {
  const categoriesRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const categoriesVisible = useRevealOnScroll(categoriesRef);
  const featuresVisible = useRevealOnScroll(featuresRef);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <Image
          src="/mainbanner.jpg"
          alt="iVion banner"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <div className={styles.heroOverlay} />
        <div className={`${styles.heroContent} ${styles.pageEnter}`}>
          <span className={styles.heroBadge}>Apple Premium Reseller · Madrid, Gran Vía</span>
          <h1 className={styles.heroTitle}>Excelencia Apple,<br />sin complicaciones</h1>
          <p className={styles.heroSubtitle}>La mejor selección de productos Apple con el servicio que mereces.</p>
          <div className={styles.heroCtas}>
            <Link href="/buy/products" className={styles.ctaPrimary}>
              <Image src="/apple-logo.svg" alt="" width={18} height={18} className={styles.appleIcon} />
              Explorar catálogo
            </Link>
            <Link href="/services/repair" className={styles.ctaSecondary}>
              Servicio técnico
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        ref={categoriesRef}
        className={`${styles.categoriesSection} ${styles.reveal} ${categoriesVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>¿Qué estás buscando?</h2>
          <div className={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href={cat.href} className={styles.categoryCard}>
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <span className={styles.categoryName}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        ref={featuresRef}
        className={`${styles.featuresSection} ${styles.reveal} ${featuresVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Por qué elegir iVion</h2>
          <div className={styles.featuresList}>
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 iVion. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
