'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { api } from '../../../../lib/api';
import { ProductDTO, CartDTO } from '../../../../lib/types';
import { useAuth } from '../../../../context/AuthContext';
import { productImageSrc } from '../../../../lib/images';
import styles from './product.module.css';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    api.get<ProductDTO>(`/api/products/${params.id}`)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    setAdding(true);
    try {
      await api.post<CartDTO>(
        `/api/cart/user/${user!.id}/add/${product!.id}?quantity=${quantity}`,
        null
      );
      setFeedback('¡Añadido al carrito!');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Error al añadir');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p className={styles.loading}>Cargando producto...</p>;
  if (error || !product) return <p className={styles.error}>{error || 'Producto no encontrado'}</p>;

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => router.back()}>
        ← Volver
      </button>

      <div className={styles.content}>
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            {productImageSrc(product.productImage) ? (
              <Image
                src={productImageSrc(product.productImage)!}
                alt={product.productName}
                fill
                style={{ objectFit: 'contain', padding: '16px' }}
              />
            ) : (
              <span className={styles.placeholder}>📱</span>
            )}
          </div>
        </div>

        <div className={styles.info}>
          {product.category && (
            <p className={styles.category}>{product.category.categoryName}</p>
          )}
          <h1 className={styles.name}>{product.productName}</h1>
          <p className={styles.price}>{Number(product.productPrice).toFixed(2)} €</p>

          {(product.productMemory || product.productStorage || product.colour) && (
            <div className={styles.specs}>
              {product.productMemory && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>RAM:</span>
                  <span>{product.productMemory}</span>
                </div>
              )}
              {product.productStorage && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Almacenamiento:</span>
                  <span>{product.productStorage}</span>
                </div>
              )}
              {product.colour && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Color:</span>
                  <span>{product.colour.colourName}</span>
                </div>
              )}
            </div>
          )}

          {product.productDescription && (
            <p className={styles.description}>{product.productDescription}</p>
          )}

          <div className={styles.quantityRow}>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className={styles.qty}>{quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>

          <button
            className={styles.addToCart}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? 'Añadiendo...' : 'Añadir al carrito'}
          </button>

          {feedback && <p className={styles.feedback}>{feedback}</p>}
        </div>
      </div>
    </div>
  );
}
