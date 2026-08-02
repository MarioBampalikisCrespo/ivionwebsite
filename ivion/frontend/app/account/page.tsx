'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import { OrderDTO } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import styles from './account.module.css';

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, user, initializing } = useAuth();
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initializing) return;
    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }

    let cancelled = false;
    const loadOrders = () => {
      api.get<OrderDTO[]>(`/api/orders/user/${user.id}`)
        .then(data => { if (!cancelled) setOrders(data); })
        .catch(() => { if (!cancelled) setOrders([]); })
        .finally(() => { if (!cancelled) setLoading(false); });
    };

    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [initializing, isAuthenticated, user]);

  if (!user) return null;

  const initials = (user.username[0] + (user.userSurnames?.[0] ?? '')).toUpperCase();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const stateClass = (state: string) => {
    const map: Record<string, string> = {
      PENDING: styles.pending,
      SHIPPED: styles.shipped,
      IN_TRANSIT: styles.inTransit,
    };
    return map[state] ?? '';
  };

  const stateLabel = (state: string) => {
    const map: Record<string, string> = {
      PENDING: 'Pendiente',
      SHIPPED: 'Enviado',
      IN_TRANSIT: 'En tránsito',
      DELIVERED: 'Entregado',
      CANCELLED: 'Cancelado',
    };
    return map[state] ?? state;
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.headerInfo}>
          <h1>{user.username} {user.userSurnames}</h1>
          <p>{user.email}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Información de la cuenta</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <p className={styles.infoLabel}>Nombre</p>
            <p className={styles.infoValue}>{user.username}</p>
          </div>
          <div className={styles.infoCard}>
            <p className={styles.infoLabel}>Apellidos</p>
            <p className={styles.infoValue}>{user.userSurnames || '—'}</p>
          </div>
          <div className={styles.infoCard}>
            <p className={styles.infoLabel}>Email</p>
            <p className={styles.infoValue}>{user.email}</p>
          </div>
        </div>
      </div>

      {user.role === 'ADMIN' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Administración</h2>
          <div className={styles.adminLinks}>
            <Link href="/account/admin/products" className={styles.adminLink}>
              Gestionar productos
            </Link>
            <Link href="/account/admin/users" className={styles.adminLink}>
              Gestionar usuarios
            </Link>
            <Link href="/account/admin/chat" className={styles.adminLink}>
              Chat de administradores
            </Link>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Mis Pedidos</h2>
        {loading && <p className={styles.loading}>Cargando pedidos...</p>}
        {!loading && orders.length === 0 && (
          <p className={styles.noOrders}>Todavía no has realizado ningún pedido.</p>
        )}
        {!loading && orders.length > 0 && (
          <div className={styles.orders}>
            {orders.map((order) => {
              const total = order.items.reduce((sum, i) => sum + Number(i.unityPrice) * i.quantity, 0);
              return (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <span className={styles.orderId}>Pedido #{order.id}</span>
                    <span className={styles.orderDate}>{formatDate(order.orderDate)}</span>
                    <span className={`${styles.orderState} ${stateClass(order.orderState)}`}>
                      {stateLabel(order.orderState)}
                    </span>
                  </div>
                  <div className={styles.orderItems}>
                    {order.items.map((item) => (
                      <div key={item.product.id} className={styles.orderItem}>
                        <span className={styles.orderItemName}>
                          {item.product.productName} × {item.quantity}
                        </span>
                        <span className={styles.orderItemPrice}>
                          {(Number(item.unityPrice) * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.orderFooter}>
                    <span className={styles.orderAddress}>{order.shipmentAddress}</span>
                    <span className={styles.orderTotal}>{Number(total).toFixed(2)} €</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
