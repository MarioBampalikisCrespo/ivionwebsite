'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.homePage}>
      <main className={`${styles.main} ${styles.pageEnter}`}>
        <div>
          <Image
            src="/mainbanner.jpg"
            alt="iVion banner"
            width={1480}
            height={500}
          />
        </div>
        <h1 className={styles.mainTitle}>iVion. Excelencia Apple, sin complicaciones</h1>
        <p>Calidad Apple, a precios razonables</p>
        <p>¿Tienes problemas con tu dispositivo? ¡Tráenoslo! Lo revisaremos encantados</p>

        <div className={styles.ctas}>
          <Link className={styles.primary} href="/buy/products">
            <Image
              className={styles.apple}
              src="/apple-logo.svg"
              alt="Apple logo"
              width={20}
              height={20}
            />
            Explora nuestro catálogo
          </Link>
        </div>

        <div className={styles.divider}>
          <p className={styles.info}>Más información</p>
          <div className={styles.arrow}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="24" height="24" fill="currentColor">
              <path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" />
            </svg>
          </div>
        </div>

        <section className={styles.featuresSection}>
          <div className={styles.card1}>
            <Image src="/iphone_offer.jpg" alt="Oferta iPhone" width={700} height={500} />
            <div className={styles.cardText}>
              <h2>¿Teléfono viejo?</h2>
              <p>En iVion tu nuevo iPhone te espera con precios que no creerás.</p>
            </div>
          </div>

          <div className={styles.card2}>
            <div className={styles.cardText}>
              <h2>Servicio técnico autorizado</h2>
              <p>En iVion trabajamos conjunto a Apple para que tu dispositivo quede como recién salido de la caja.</p>
            </div>
            <Image src="/repair_service.jpg" alt="Servicio técnico" width={700} height={500} />
          </div>

          <div className={styles.card3}>
            <Image src="/online_store.jpg" alt="Tienda online" width={500} height={300} className={styles.imgSmall} />
            <div className={styles.cardText}>
              <h2>Explora nuestra tienda online</h2>
              <p>Compra desde casa con confianza y envío en 24h.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 iVion. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
