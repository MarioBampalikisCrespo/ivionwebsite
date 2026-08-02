'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../../lib/api';
import { ProductDTO } from '../../../../lib/types';
import { productImageSrc } from '../../../../lib/images';
import { useAdminGuard } from '../../../../hooks/useAdminGuard';
import styles from './adminProducts.module.css';

export default function AdminProductsPage() {
  const { ready } = useAdminGuard();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    api.get<ProductDTO[]>('/api/products')
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [ready]);

  if (!ready) return null;

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
    setDeletingId(id);
    setError('');
    try {
      await api.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el producto');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.page}>
      <Link href="/account" className={styles.backLink}>← Volver al perfil</Link>

      <div className={styles.headerRow}>
        <h1 className={styles.title}>Gestionar productos</h1>
        <Link href="/account/admin/products/new" className={styles.newBtn}>
          Nuevo producto
        </Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading && <p className={styles.loading}>Cargando productos...</p>}

      {!loading && products.length === 0 && (
        <p className={styles.empty}>No hay productos todavía.</p>
      )}

      {!loading && products.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    {productImageSrc(product.productImage) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className={styles.thumb}
                        src={productImageSrc(product.productImage)!}
                        alt=""
                      />
                    ) : (
                      <div className={styles.thumb} />
                    )}
                  </td>
                  <td>{product.productName}</td>
                  <td>{product.category?.categoryName ?? '—'}</td>
                  <td>{Number(product.productPrice).toFixed(2)} €</td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link href={`/account/admin/products/${product.id}/edit`} className={styles.editLink}>
                        Editar
                      </Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
