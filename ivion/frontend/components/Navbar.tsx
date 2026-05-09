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
        <div className={styles.logoGroup}>
          <Link href="/">
            <Image
              className={styles.imagen}
              src="/iVion_logo_light.svg"
              alt="iVion logo"
              width={120}
              height={62}
              priority
            />
          </Link>
          <Link href="/about" onClick={() => setActivePanel(null)}>
            <Image
              className={styles.partner}
              src="/partnerbadge.png"
              alt="Apple Premium Reseller"
              width={100}
              height={47}
            />
          </Link>
        </div>
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
          <li><Link href="/support" onClick={() => setActivePanel(null)}>Soporte</Link></li>
          <li><Link href="/contact" onClick={() => setActivePanel(null)}>Contacto</Link></li>
        </ul>

        <div className={styles.navIcons}>
          {isAuthenticated && (
            <Link href="/cart" className={styles.cartLink}>
              <CiShoppingCart className={styles.iconStyle} />
            </Link>
          )}
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button className={styles.avatarBtn} onClick={handleUserClick} title={user?.username}>
                <span className={styles.avatar}>
                  {(user!.username[0] + (user!.userSurnames?.[0] ?? '')).toUpperCase()}
                </span>
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
              <Link href="/services/repair" onClick={() => setActivePanel(null)}>Reparaciones</Link>
              <Link href="/services/maintenance" onClick={() => setActivePanel(null)}>Mantenimiento</Link>
              <Link href="/services/diagnostic" onClick={() => setActivePanel(null)}>Diagnóstico</Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
