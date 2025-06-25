"use client"

import { useState, useRef } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import useRevealOnScroll  from "../hooks/useRevealOnScroll";

export default function Home() {
  const [activePanel, setActivePanel] = useState<"productos" | "servicios" | null>(null);

  const togglePanel = (panel: "productos" | "servicios") => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const card1Ref = useRef<HTMLDivElement | null>(null);
  const card2Ref = useRef<HTMLDivElement | null>(null);
  const card3Ref = useRef<HTMLDivElement | null>(null);

  const card1Visible = useRevealOnScroll(card1Ref);
  const card2Visible = useRevealOnScroll(card2Ref);
  const card3Visible = useRevealOnScroll(card3Ref);

  return (
    <div className={styles.page}>
      <div className={styles.nav}>
        <Image
          className={styles.imagen}
          src="/iVion_logo_light.svg"
          alt="iVion logo"
          width={260}
          height={80}
          priority
        />
        <Image
          className={styles.partner}
          src="/partnerbadge.png"
          alt="partner badge"
          width={100}
          height={47}
        />
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><button className={styles.navButton} onClick={() => togglePanel("productos")}>Productos</button></li>
          <li><button className={styles.navButton} onClick={() => togglePanel("servicios")}>Servicios</button></li>
          <li><a href="#soporte">Soporte</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
      </div>

      {activePanel && (
        <div className={styles.dropdownPanel}>
          <button className={styles.closeButton} onClick={() => setActivePanel(null)}>\u2715</button>
          {activePanel === "productos" && (
            <div className={styles.panelContent}>
              <a href="#iphone">iPhone</a>
              <a href="#ipad">iPad</a>
              <a href="#macbook">MacBook</a>
              <a href="#accesories">Accesorios</a>
            </div>
          )}
          {activePanel === "servicios" && (
            <div className={styles.panelContent}>
              <p>Reparaciones</p>
              <p>Mantenimiento</p>
              <p>Diagn\u00f3stico</p>
            </div>
          )}
        </div>
      )}

      <main className={`${styles.main} ${styles.pageEnter}`}>
        <div>
          <Image
            src="/mainbanner.jpg"
            alt="iVion banner"
            width={1480}
            height={500}
          />
        </div>
        <div className={styles.mainTitleDiv}>
          <h1 className={styles.mainTitle}>iVion. Excelencia Apple, sin complicaciones</h1>
        </div>
        <p>Calidad Apple, a precios razonables</p>
        <p>\u00bfTienes problemas con tu dispositivo? \u00a1Tr\u00e1enoslo! Lo revisaremos encantados</p>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.apple}
              src="/apple-logo.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Explora nuestro cat\u00e1logo
          </a>
        </div>

        <div className={styles.divider}>
          <p className={styles.info}>M\u00e1s informaci\u00f3n</p>
          <div className={styles.arrow}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" />
            </svg>
          </div>
        </div>

        <section className={styles.featuresSection}>
          <div
            ref={card1Ref}
            className={`${styles.card} ${styles.fromLeft} ${styles.reveal} ${card1Visible ? styles.revealVisible : ""}`}
          >
            <Image src="/iphone_offer.jpg" alt="Oferta iPhone" width={700} height={500} />
            <div className={styles.cardText}>
              <h2>\u00bfTel\u00e9fono viejo?</h2>
              <p>En iVion tu nuevo iPhone te espera con precios que no creer\u00e1s.</p>
            </div>
          </div>

          <div
            ref={card2Ref}
            className={`${styles.card} ${styles.fromRight} ${styles.reveal} ${card2Visible ? styles.revealVisible : ""}`}
          >
            <div className={styles.cardText}>
              <h2>Servicio t\u00e9cnico autorizado</h2>
              <p>Reparamos tu dispositivo Apple con piezas originales y garant\u00eda oficial.</p>
            </div>
            <Image src="/repair_service.jpg" alt="Servicio t\u00e9cnico" width={700} height={500} />
          </div>

          <div
            ref={card3Ref}
            className={`${styles.card} ${styles.fromLeft} ${styles.reveal} ${card3Visible ? styles.revealVisible : ""}`}
          >
            <Image src="/online_store.jpg" alt="Tienda online" width={500} height={300} />
            <div className={styles.cardText}>
              <h2>Explora nuestra tienda online</h2>
              <p>Compra desde casa con confianza y env\u00edo en 24h.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org \u2192
        </a>
      </footer>
    </div>
  );
}
