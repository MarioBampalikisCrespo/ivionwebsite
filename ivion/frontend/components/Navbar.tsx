'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CiUser, CiShoppingCart } from 'react-icons/ci';
import { useAuth } from '../context/AuthContext';
import styles from './navbar.module.css';

export default function Navbar() {
  const [activePanel, setActivePanel] = useState<'productos' | 'servicios' | null>(null);
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const togglePanel = (panel: 'productos' | 'servicios') => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      router.push('/account');
    } else {
      router.push('/auth/login');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/">
          <Image
            className={styles.imagen}
            src="/iVion_logo_light.svg"
            alt="iVion logo"
            width={260}
            height={80}
            priority
          />
        </Link>
        <Image
          className={styles.partner}
          src="/partnerbadge.png"
          alt="partner badge"
          width={100}
          height={47}
        />
        <ul>
          <li><Link href="/">Inicio</Link></li>
          <li>
            <button className={styles.navButton} onClick={() => togglePanel('productos')}>
              Productos
            </button>
          </li>
          <li>
            <button className={styles.navButton} onClick={() => togglePanel('servicios')}>
              Servicios
            </button>
          </li>
          <li><a href="#soporte">Soporte</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>

        <div className={styles.navIcons}>
          {isAuthenticated && (
            <Link href="/cart" className={styles.cartLink}>
              <CiShoppingCart className={styles.iconStyle} />
            </Link>
          )}
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button className={styles.userButton} onClick={handleUserClick}>
                <CiUser className={styles.iconStyle} />
                {user?.username}
              </button>
              <button className={styles.navButton} onClick={handleLogout}>
                Salir
              </button>
            </div>
          ) : (
            <button className={styles.loginStyle} onClick={handleUserClick}>
              <CiUser className={styles.iconStyle} />
            </button>
          )}
        </div>
      </nav>

      {activePanel && (
        <div className={styles.dropdownPanel}>
          <button className={styles.closeButton} onClick={() => setActivePanel(null)}>×</button>
          {activePanel === 'productos' && (
            <div className={styles.panelContent}>
              <Link href="/buy/products?category=1" onClick={() => setActivePanel(null)}>iPhone</Link>
              <Link href="/buy/products?category=2" onClick={() => setActivePanel(null)}>iPad</Link>
              <Link href="/buy/products?category=3" onClick={() => setActivePanel(null)}>MacBook</Link>
              <Link href="/buy/products?category=4" onClick={() => setActivePanel(null)}>Accesorios</Link>
            </div>
          )}
          {activePanel === 'servicios' && (
            <div className={styles.panelContent}>
              <p>Reparaciones</p>
              <p>Mantenimiento</p>
              <p>Diagnóstico</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
