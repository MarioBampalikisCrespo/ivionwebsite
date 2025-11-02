"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { CiUser } from "react-icons/ci";

export default function Home() {
  const [activePanel, setActivePanel] = useState<"productos" | "servicios" | null>(null);
  const  router = useRouter();

  const togglePanelProductos = (panel: "productos") => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const togglePanelServicios = (panel: "servicios") => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };
    

  const goToBuy = () => {
    router.push('/buy/products')
  };

  const goToLogin = () => {
    router.push('/auth/login');
  }
  
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
          <li><button className={styles.navButton} onClick={() => togglePanelProductos("productos")}>Productos</button></li>
          <li><button className={styles.navButton} onClick={() => togglePanelServicios("servicios")}>Servicios</button></li>
          <li><a href="#soporte">Soporte</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
        <div className="login">
          <button className={styles.loginStyle} onClick={goToLogin}>
              <CiUser className={styles.iconStyle}></CiUser>
          </button>
        </div>
      </div>

      {activePanel && (
        <div className={styles.dropdownPanel}>
          <button className={styles.closeButton} onClick={() => setActivePanel(null)}>×</button>
          {activePanel === "productos" && (
            <div className={styles.panelContent}>
              <a href="#iphone" onClick={goToBuy}>iPhone</a>
              <a href="#ipad">iPad</a>
              <a href="#macbook">MacBook</a>
              <a href="#accesories">Accesorios</a>
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
        <p>¿Tienes problemas con tu dispositivo? ¡Tráenoslo! Lo revisaremos encantados</p>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="#catalogo"
          >
            <Image
              className={styles.apple}
              src="/apple-logo.svg"
              alt="Apple logo"
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
        <a href="https://nextjs.org/learn" target="_blank" rel="noopener noreferrer">
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a href="https://vercel.com/templates" target="_blank" rel="noopener noreferrer">
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
