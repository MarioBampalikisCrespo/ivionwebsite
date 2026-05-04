'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { ProductDTO, CategoryDTO } from '../../../lib/types';
import styles from './products.module.css';

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<CategoryDTO[]>('/api/categories')
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    const path = categoryParam
      ? `/api/products/category/${categoryParam}`
      : '/api/products';
    api.get<ProductDTO[]>(path)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryParam]);

  const setCategory = (id: number | null) => {
    if (id === null) {
      router.push('/buy/products');
    } else {
      router.push(`/buy/products?category=${id}`);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Nuestros Productos</h1>
        <p>La mejor selección de dispositivos Apple</p>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${!categoryParam ? styles.active : ''}`}
          onClick={() => setCategory(null)}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.filterBtn} ${categoryParam === String(cat.id) ? styles.active : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>

      {loading && <p className={styles.loading}>Cargando productos...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className={styles.empty}>No hay productos disponibles.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className={styles.grid}>
          {products.map((product) => (
            <Link key={product.id} href={`/buy/products/${product.id}`} className={styles.card}>
              <div className={styles.imageWrapper}>
                {product.productImage ? (
                  <Image
                    src={`/products/${product.productImage}`}
                    alt={product.productName}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span className={styles.placeholder}>📱</span>
                )}
              </div>
              <div className={styles.cardBody}>
                {product.category && (
                  <span className={styles.category}>{product.category.categoryName}</span>
                )}
                <p className={styles.name}>{product.productName}</p>
                {(product.productMemory || product.productStorage) && (
                  <p className={styles.specs}>
                    {[product.productMemory, product.productStorage].filter(Boolean).join(' · ')}
                  </p>
                )}
                <p className={styles.price}>{Number(product.productPrice).toFixed(2)} €</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
