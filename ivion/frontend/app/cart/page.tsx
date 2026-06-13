'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { CartDTO, OrderDTO } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import { productImageSrc } from '../../lib/images';
import styles from './cart.module.css';

type Step = 'address' | 'payment' | 'processing' | 'success';

const formatCardNumber = (v: string) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
};

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<CartDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<Step>('address');
  const [address, setAddress] = useState('');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [orderError, setOrderError] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);

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

  const openCheckout = () => {
    setStep('address');
    setOrderError('');
    setShowModal(true);
  };

  const closeModal = () => {
    if (step === 'processing') return;
    setShowModal(false);
  };

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

  const handlePayAndOrder = async () => {
    if (!user) return;
    setStep('processing');
    setOrderError('');
    await new Promise(r => setTimeout(r, 2800));
    try {
      const order = await api.post<OrderDTO>(`/api/orders/user/${user.id}/checkout`, {
        shipmentAddress: address,
      });
      setOrderId(order.id);
      setStep('success');
      await loadCart(user.id);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Error al procesar el pago');
      setStep('payment');
    }
  };

  if (loading) return <p className={styles.loading}>Cargando carrito...</p>;

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mi Carrito</h1>

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
            {cart.items.map((item) => {
              const variant = item.variantId
                ? (item.product.variants ?? []).find(v => v.id === item.variantId) ?? null
                : null;
              const unitPrice = variant ? Number(variant.price) : Number(item.product.productPrice);
              const image = item.product.productImage;
              return (
                <div key={item.product.id} className={styles.item}>
                  <div className={styles.imageBox}>
                    {productImageSrc(image) ? (
                      <Image
                        src={productImageSrc(image)!}
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
                    {variant && (
                      <p className={styles.itemVariant}>
                        {[variant.chip, variant.screenSize, variant.memory, variant.storage].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className={styles.itemPrice}>
                      {unitPrice.toFixed(2)} € × {item.quantity}
                    </p>
                  </div>
                  <p className={styles.itemSubtotal}>
                    {(unitPrice * item.quantity).toFixed(2)} €
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
              );
            })}
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>{cart.items.length} {cart.items.length === 1 ? 'producto' : 'productos'}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{Number(cart.total).toFixed(2)} €</span>
            </div>
            <button className={styles.checkoutBtn} onClick={openCheckout}>
              Realizar pedido
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>

            {step === 'address' && (
              <>
                <div className={styles.modalHeader}>
                  <p className={styles.modalStep}>Paso 1 de 2</p>
                  <h2 className={styles.modalTitle}>Dirección de envío</h2>
                </div>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Dirección</label>
                  <input
                    className={styles.modalInput}
                    type="text"
                    placeholder="Calle Ejemplo 1, 28001 Madrid"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={closeModal}>Cancelar</button>
                  <button
                    className={styles.confirmBtn}
                    onClick={() => setStep('payment')}
                    disabled={!address.trim()}
                  >
                    Continuar
                  </button>
                </div>
              </>
            )}

            {step === 'payment' && (
              <>
                <div className={styles.modalHeader}>
                  <p className={styles.modalStep}>Paso 2 de 2</p>
                  <h2 className={styles.modalTitle}>Datos de pago</h2>
                </div>

                <div className={styles.cardPreview}>
                  <div className={styles.cardChip} />
                  <p className={styles.cardNumber}>
                    {card.number || '•••• •••• •••• ••••'}
                  </p>
                  <div className={styles.cardBottom}>
                    <span className={styles.cardName}>{card.name || 'TITULAR'}</span>
                    <span className={styles.cardExpiry}>{card.expiry || 'MM/AA'}</span>
                  </div>
                </div>

                <div className={styles.payFields}>
                  <div className={styles.modalField}>
                    <label className={styles.modalLabel}>Número de tarjeta</label>
                    <input
                      className={styles.modalInput}
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={card.number}
                      onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
                      inputMode="numeric"
                    />
                  </div>
                  <div className={styles.modalField}>
                    <label className={styles.modalLabel}>Titular</label>
                    <input
                      className={styles.modalInput}
                      type="text"
                      placeholder="NOMBRE APELLIDO"
                      value={card.name}
                      onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                    />
                  </div>
                  <div className={styles.payRow}>
                    <div className={styles.modalField}>
                      <label className={styles.modalLabel}>Caducidad</label>
                      <input
                        className={styles.modalInput}
                        type="text"
                        placeholder="MM/AA"
                        value={card.expiry}
                        onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                        inputMode="numeric"
                      />
                    </div>
                    <div className={styles.modalField}>
                      <label className={styles.modalLabel}>CVV</label>
                      <input
                        className={styles.modalInput}
                        type="password"
                        placeholder="•••"
                        value={card.cvv}
                        onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                </div>

                {orderError && <p className={styles.errorMsg}>{orderError}</p>}

                <div className={styles.payTotal}>
                  <span>Total a pagar</span>
                  <span>{Number(cart?.total ?? 0).toFixed(2)} €</span>
                </div>

                <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={() => setStep('address')}>← Volver</button>
                  <button
                    className={styles.confirmBtn}
                    onClick={handlePayAndOrder}
                    disabled={!card.number || !card.name || !card.expiry || !card.cvv}
                  >
                    Pagar ahora
                  </button>
                </div>
              </>
            )}

            {step === 'processing' && (
              <div className={styles.processingScreen}>
                <div className={styles.spinner} />
                <p className={styles.processingTitle}>Procesando pago...</p>
                <p className={styles.processingDesc}>No cierres esta ventana</p>
              </div>
            )}

            {step === 'success' && (
              <div className={styles.successScreen}>
                <div className={styles.successIcon}>✓</div>
                <h2 className={styles.successTitle}>¡Pedido confirmado!</h2>
                {orderId && <p className={styles.successOrderId}>Pedido #{orderId}</p>}
                <p className={styles.successDesc}>
                  Te enviaremos un email con todos los detalles y el seguimiento de tu envío.
                </p>
                <button
                  className={styles.confirmBtn}
                  style={{ width: '100%' }}
                  onClick={() => { setShowModal(false); router.push('/buy/products'); }}
                >
                  Seguir comprando
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
