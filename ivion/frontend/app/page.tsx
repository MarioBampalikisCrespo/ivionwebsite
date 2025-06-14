"use client"

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [activePanel, setActivePanel] = useState<"productos" | "servicios" | null>(null);

  const togglePanel = (panel: "productos" | "servicios") => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

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
          <button className={styles.closeButton} onClick={() => setActivePanel(null)}>✕</button>
          {activePanel === "productos" && (
            <div className={styles.panelContent}>
              <p>iPhone</p>
              <p>iPad</p>
              <p>MacBook</p>
              <p>Accesorios</p>
            </div>
          )}
          {activePanel === "servicios" && (
            <div className={styles.panelContent}>
              <p>Reparaciones</p>
              <p>Mantenimiento</p>
              <p>Diagnóstico</p>
            </div>
          )}
        </div>
      )}

      <main className={styles.main}>
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
        <p>¿Tienes problemas con tu dispositivo? ¡Tráenoslo! Lo revisaremos encantados</p>

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
            Explora nuestro catálogo
          </a>
        </div>
        <div className={styles.divider}>
          <p className={styles.info}>Más información</p>
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
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
