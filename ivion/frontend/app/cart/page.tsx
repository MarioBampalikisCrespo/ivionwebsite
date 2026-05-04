'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { CartDTO, OrderDTO } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import styles from './cart.module.css';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<CartDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState('');
  const [orderError, setOrderError] = useState('');

  const loadCart = async (userId: number) => {
    setLoading(true);
    try {
      const data = await api.get<CartDTO>(`/api/cart/user/${userId}`);
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (!isAuthenticated) router.push('/auth/login');
      return;
    }
    loadCart(user.id);
  }, [isAuthenticated, user?.id]);

  const handleRemove = async (productId: number) => {
    if (!user) return;
    setRemoving(productId);
    try {
      const updated = await api.delete<CartDTO>(`/api/cart/user/${user.id}/remove/${productId}`);
      setCart(updated);
    } catch {
    } finally {
      setRemoving(null);
    }
  };

  const handleOrder = async () => {
    if (!user || !address.trim()) return;
    setOrdering(true);
    setOrderError('');
    try {
      await api.post<OrderDTO>(`/api/orders/user/${user.id}/checkout`, {
        shipmentAddress: address,
      });
      setOrderFeedback('¡Pedido realizado con éxito!');
      setShowModal(false);
      await loadCart(user.id);
      setTimeout(() => setOrderFeedback(''), 4000);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Error al realizar el pedido');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <p className={styles.loading}>Cargando carrito...</p>;

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mi Carrito</h1>

      {orderFeedback && <p className={styles.successMsg}>{orderFeedback}</p>}

      {isEmpty ? (
        <div className={styles.empty}>
          <p>Tu carrito está vacío.</p>
          <Link href="/buy/products" className={styles.shopLink}>
            Explorar productos
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.items}>
            {cart.items.map((item) => (
              <div key={item.product.id} className={styles.item}>
                <div className={styles.imageBox}>
                  {item.product.productImage ? (
                    <Image
                      src={`/products/${item.product.productImage}`}
                      alt={item.product.productName}
                      fill
                      style={{ objectFit: 'contain', padding: '8px' }}
                    />
                  ) : (
                    <span className={styles.imgPlaceholder}>📱</span>
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.product.productName}</p>
                  <p className={styles.itemPrice}>
                    {Number(item.product.productPrice).toFixed(2)} € × {item.quantity}
                  </p>
                </div>
                <p className={styles.itemSubtotal}>
                  {(Number(item.product.productPrice) * item.quantity).toFixed(2)} €
                </p>
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemove(item.product.id)}
                  disabled={removing === item.product.id}
                  title="Eliminar"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>{cart.items.length} {cart.items.length === 1 ? 'producto' : 'productos'}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{Number(cart.total).toFixed(2)} €</span>
            </div>
            <button className={styles.checkoutBtn} onClick={() => setShowModal(true)}>
              Realizar pedido
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Confirmar pedido</h2>
            <div className={styles.modalField}>
              <label className={styles.modalLabel}>Dirección de envío</label>
              <input
                className={styles.modalInput}
                type="text"
                placeholder="Calle Ejemplo 1, 28001 Madrid"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            {orderError && <p className={styles.errorMsg}>{orderError}</p>}
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleOrder}
                disabled={ordering || !address.trim()}
              >
                {ordering ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
