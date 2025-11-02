"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../../page.module.css";
import { useRouter } from "next/navigation";
import { CiUser } from "react-icons/ci";
import Home from "../../page";

export default function Login () {
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

  const goHome = () => {
    router.push('/#')
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
            <li><a href="#" onClick={goHome}>Inicio</a></li>
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
        )
        }

        <div className={styles.loginContainer}>
            <h1 className={styles.titles}>Iniciar Sesión</h1>    
        </div>
        </div>
    </div>
 )
}