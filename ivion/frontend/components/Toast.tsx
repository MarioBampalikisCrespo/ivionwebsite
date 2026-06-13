'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { productImageSrc } from '../lib/images';
import styles from './toast.module.css';

interface ToastProps {
  message: string;
  image?: string | null;
  onClose: () => void;
}

export default function Toast({ message, image, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enterTimer = requestAnimationFrame(() => setVisible(true));
    const exitTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 360);
    }, 3000);
    return () => {
      cancelAnimationFrame(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [onClose]);

  return (
    <div className={`${styles.toast} ${visible ? styles.toastVisible : ''}`}>
      <div className={styles.imageBox}>
        {productImageSrc(image ?? null) ? (
          <Image
            src={productImageSrc(image ?? null)!}
            alt=""
            fill
            style={{ objectFit: 'contain', padding: '6px' }}
          />
        ) : (
          <span style={{ fontSize: 22 }}>💻</span>
        )}
      </div>
      <div className={styles.body}>
        <span className={styles.label}>
          <span className={styles.check}>✓</span>
          Añadido al carrito
        </span>
        <span className={styles.message}>{message}</span>
      </div>
    </div>
  );
}
