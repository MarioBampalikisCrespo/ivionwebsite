'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './page.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CATEGORIES = [
  { name: 'iPhone',     href: '/buy/products?category=1' },
  { name: 'iPad',       href: '/buy/products?category=2' },
  { name: 'MacBook',    href: '/buy/products?category=3' },
  { name: 'Accesorios', href: '/buy/products?category=4' },
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
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(imgRef.current, {
        x: reverse ? 60 : -60,
        opacity: 0,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 82%', once: true },
      });
      gsap.from(textRef.current, {
        x: reverse ? -60 : 60,
        opacity: 0,
        duration: 0.75,
        ease: 'power2.out',
        delay: 0.12,
        scrollTrigger: { trigger: cardRef.current, start: 'top 82%', once: true },
      });
    });
  }, { scope: cardRef });

  return (
    <div ref={cardRef} className={`${styles.featureCard} ${reverse ? styles.featureCardReverse : ''}`}>
      <div ref={imgRef} className={styles.featureImageWrapper}>
        <Image src={image} alt={title} fill style={{ objectFit: 'cover' }} />
      </div>
      <div ref={textRef} className={styles.featureText}>
        <h2 className={styles.featureTitle}>{title}</h2>
        <p className={styles.featureDesc}>{text}</p>
        <Link href={href} className={styles.featureCta}>{cta}</Link>
      </div>
    </div>
  );
}

export default function Home() {
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroCtasRef = useRef<HTMLDivElement>(null);
  const categoriesGridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(
        [heroTitleRef.current, heroSubtitleRef.current, heroCtasRef.current],
        { y: 30, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out' }
      );
    });
  }, { scope: heroContentRef });

  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      if (!categoriesGridRef.current) return;
      gsap.from(Array.from(categoriesGridRef.current.children), {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: categoriesGridRef.current, start: 'top 80%', once: true },
      });
    });
    ScrollTrigger.refresh();
  }, { scope: categoriesGridRef });

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/mainbanner.jpg"
          alt="iVion banner"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <div className={styles.heroOverlay} />
        <div ref={heroContentRef} className={styles.heroContent}>
          <h1 ref={heroTitleRef} className={styles.heroTitle}>Excelencia Apple,<br />sin complicaciones</h1>
          <p ref={heroSubtitleRef} className={styles.heroSubtitle}>La mejor selección de productos Apple con el servicio que mereces.</p>
          <div ref={heroCtasRef} className={styles.heroCtas}>
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

      <section className={styles.categoriesSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>¿Qué estás buscando?</h2>
          <div ref={categoriesGridRef} className={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href={cat.href} className={styles.categoryCard}>
                <span className={styles.categoryName}>{cat.name}</span>
                <span className={styles.categoryArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
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
