'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import useRevealOnScroll from '../../hooks/useRevealOnScroll';
import styles from './about.module.css';

const STORE_IMAGES = [
  { src: '/ivionstore.png', alt: 'Tienda iVion Gran Vía Madrid' },
  { src: '/ivionteam.png',  alt: 'Equipo iVion' },
];

const VALUES = [
  { icon: '🎯', title: 'Autenticidad', text: 'Solo vendemos productos 100% originales Apple, adquiridos a través de canales oficiales y verificados.' },
  { icon: '🤝', title: 'Confianza', text: 'Más de una década acompañando a nuestros clientes con honestidad, transparencia y un servicio sin letra pequeña.' },
  { icon: '🔧', title: 'Excelencia técnica', text: 'Nuestro equipo de técnicos certificados Apple garantiza que cada reparación o consulta se resuelve con el máximo rigor.' },
  { icon: '❤️', title: 'Pasión', text: 'Somos usuarios Apple antes que vendedores. Esa pasión es la que nos empuja a ofrecer siempre lo mejor.' },
];

export default function AboutPage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const prev = () => setSlideIndex((i) => (i - 1 + STORE_IMAGES.length) % STORE_IMAGES.length);
  const next = () => setSlideIndex((i) => (i + 1) % STORE_IMAGES.length);

  const badgeRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);

  const badgeVisible = useRevealOnScroll(badgeRef);
  const valuesVisible = useRevealOnScroll(valuesRef);
  const teamVisible = useRevealOnScroll(teamRef);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={`${styles.hero} ${styles.pageEnter}`}>
        <span className={styles.badge}>Sobre Nosotros</span>
        <h1 className={styles.heroTitle}>
          La tienda Apple que<br /><span>nació de la pasión</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Somos iVion, tu Apple Premium Reseller de confianza. Llevamos más de una década
          acercando la tecnología Apple a las personas con honestidad, pasión y un servicio
          que va más allá de la venta.
        </p>
      </section>

      {/* Badge story */}
      <section
        ref={badgeRef}
        className={`${styles.badgeSection} ${styles.reveal} ${badgeVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.badgeInner}>
          <div className={styles.badgeImageCol}>
            <Image
              src="/ivionshirt.png"
              alt="Empleado iVion"
              width={320}
              height={420}
              className={styles.badgeImg}
            />
          </div>
          <div className={styles.badgeTextCol}>
            <h2 className={styles.badgeTitle}>El porqué del badge de "Premium Reseller"</h2>
            <div className={styles.storyText}>
              <p>
                Todo empezó en 2012, cuando Mario Bampalikis abrió un pequeño local en Madrid con
                una idea clara: vender productos Apple como a él le hubiera gustado que se los
                vendieran a él. Sin presiones, con honestidad, y con el conocimiento profundo de
                alguien que lleva años usando cada dispositivo que pone en el escaparate.
              </p>
              <p>
                Durante los primeros años, iVion fue creciendo poco a poco, ganándose la confianza
                de sus clientes a base de buen trato y asesoramiento real. No había guiones de
                venta ni upselling agresivo — solo personas ayudando a personas a elegir bien.
              </p>
              <p>
                En 2017, Apple lanzó su programa de <strong>Premium Reseller</strong>, un
                reconocimiento oficial reservado para aquellos distribuidores que no solo vendían
                sus productos, sino que lo hacían con los estándares de experiencia de cliente,
                formación técnica y presentación que Apple exige a sus propias tiendas.
              </p>
              <p>
                iVion se presentó al proceso de evaluación sin muchas expectativas. Eran una
                tienda pequeña, sin el músculo de las grandes cadenas. Pero lo que Apple encontró
                fue algo que el dinero no compra fácilmente: un equipo formado, comprometido, y
                una reputación construida cliente a cliente durante cinco años.
              </p>
              <p>
                En marzo de 2018, llegó la notificación. iVion era oficialmente
                <strong> Apple Premium Reseller</strong>. Ese badge que ves en nuestra navbar no
                es un logo de marketing — es el resultado de años de trabajo, de noches resolviendo
                problemas difíciles, y de clientes que decidieron volver y traer a sus familias.
              </p>
              <p>
                Hoy, ese reconocimiento nos recuerda cada día por qué empezamos y hacia dónde
                queremos seguir creciendo: con las personas siempre en el centro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        ref={valuesRef}
        className={`${styles.valuesSection} ${styles.reveal} ${valuesVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Lo que nos define</h2>
          <div className={styles.valuesGrid}>
            {VALUES.map((v) => (
              <div key={v.title} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <p className={styles.valueTitle}>{v.title}</p>
                <p className={styles.valueText}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / closing */}
      <section
        ref={teamRef}
        className={`${styles.teamSection} ${styles.reveal} ${teamVisible ? styles.revealVisible : ''}`}
      >
        <div className={styles.teamInner}>
          <h2 className={styles.teamTitle}>Más que una tienda</h2>
          <div className={styles.sliderWrapper}>
            <div className={styles.storeImageWrapper}>
              {STORE_IMAGES.map((img, i) => (
                <Image
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  fill
                  style={{ objectFit: 'cover', opacity: i === slideIndex ? 1 : 0, transition: 'opacity 0.5s ease' }}
                />
              ))}
            </div>
            <button className={`${styles.sliderBtn} ${styles.sliderBtnLeft}`} onClick={prev} aria-label="Anterior">‹</button>
            <button className={`${styles.sliderBtn} ${styles.sliderBtnRight}`} onClick={next} aria-label="Siguiente">›</button>
            <div className={styles.sliderDots}>
              {STORE_IMAGES.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === slideIndex ? styles.dotActive : ''}`}
                  onClick={() => setSlideIndex(i)}
                  aria-label={`Imagen ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <p className={styles.teamText}>
            Detrás de iVion hay un equipo pequeño pero muy comprometido. Técnicos certificados,
            asesores con años de experiencia y personas que genuinamente disfrutan ayudando a
            otros a sacar el máximo partido a su tecnología. Si alguna vez has entrado por nuestra
            puerta con un problema y has salido con una sonrisa, sabes de lo que hablamos.
          </p>
          <p className={styles.teamText}>
            Gracias por confiar en nosotros. Este badge también es tuyo.
          </p>
        </div>
      </section>
    </div>
  );
}
