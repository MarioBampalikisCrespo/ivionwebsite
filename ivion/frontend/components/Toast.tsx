'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { productImageSrc } from '../lib/images';
import styles from './toast.module.css';

interface ToastProps {
  message: string;
  image?: string | null;
  variant?: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, image, variant = 'success', onClose }: ToastProps) {
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
    <div className={`${styles.toast} ${visible ? styles.toastVisible : ''} ${variant === 'error' ? styles.toastError : ''}`}>
      <div className={styles.imageBox}>
        {variant === 'success' && productImageSrc(image ?? null) ? (
          <Image
            src={productImageSrc(image ?? null)!}
            alt=""
            fill
            style={{ objectFit: 'contain', padding: '6px' }}
          />
        ) : (
          <span style={{ fontSize: 22 }}>{variant === 'error' ? '⚠️' : '💻'}</span>
        )}
      </div>
      <div className={styles.body}>
        <span className={styles.label}>
          <span className={styles.check}>{variant === 'error' ? '!' : '✓'}</span>
          {variant === 'error' ? 'Error' : 'Añadido al carrito'}
        </span>
        <span className={styles.message}>{message}</span>
      </div>
    </div>
  );
}
