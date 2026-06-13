'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { api } from '../../../../lib/api';
import { ProductDTO, ProductVariantDTO, CartDTO } from '../../../../lib/types';
import { useAuth } from '../../../../context/AuthContext';
import { productImageSrc } from '../../../../lib/images';
import Toast from '../../../../components/Toast';
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
  const [toast, setToast] = useState<{ message: string; image: string | null } | null>(null);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);

  useEffect(() => {
    api.get<ProductDTO>(`/api/products/${params.id}`)
      .then(p => {
        setProduct(p);
        if (p.variants?.length > 0) {
          const firstVariant = p.variants[0];
          setSelectedChip(firstVariant.chip ?? null);
          setSelectedSize(firstVariant.screenSize ?? null);
          setSelectedStorage(firstVariant.storage);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  const hasVariants = (product?.variants?.length ?? 0) > 0;
  const variants = product?.variants ?? [];

  const availableChips = useMemo(() =>
    [...new Set(variants.map(v => v.chip).filter(Boolean))] as string[],
  [variants]);

  const availableSizes = useMemo(() => {
    const base = selectedChip ? variants.filter(v => v.chip === selectedChip) : variants;
    return [...new Set(base.map(v => v.screenSize).filter(Boolean))] as string[];
  }, [variants, selectedChip]);

  const availableStorages = useMemo(() => {
    const base = variants.filter(v =>
      (!selectedChip || v.chip === selectedChip) &&
      (!selectedSize || v.screenSize === selectedSize)
    );
    return [...new Set(base.map(v => v.storage))];
  }, [variants, selectedChip, selectedSize]);

  const selectedVariant = useMemo<ProductVariantDTO | null>(() => {
    if (!hasVariants) return null;
    return variants.find(v =>
      (availableChips.length === 0 || v.chip === selectedChip) &&
      (availableSizes.length === 0  || v.screenSize === selectedSize) &&
      v.storage === selectedStorage
    ) ?? null;
  }, [variants, selectedChip, selectedSize, selectedStorage, availableChips, availableSizes, hasVariants]);

  const handleChipChange = (chip: string) => {
    setSelectedChip(chip);
    const next = variants.filter(v => v.chip === chip);
    const sizes = [...new Set(next.map(v => v.screenSize).filter(Boolean))] as string[];
    const newSize = sizes[0] ?? null;
    setSelectedSize(newSize);
    const storages = [...new Set(
      next.filter(v => !newSize || v.screenSize === newSize).map(v => v.storage)
    )];
    setSelectedStorage(storages[0] ?? null);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    const storages = [...new Set(
      variants.filter(v => (!selectedChip || v.chip === selectedChip) && v.screenSize === size).map(v => v.storage)
    )];
    if (!storages.includes(selectedStorage ?? '')) setSelectedStorage(storages[0] ?? null);
  };

  const displayPrice = selectedVariant
    ? Number(selectedVariant.price)
    : Number(product?.productPrice ?? 0);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    if (hasVariants && !selectedVariant) {
      setToast({ message: 'Selecciona una configuración primero.', image: null });
      return;
    }
    setAdding(true);
    try {
      const variantParam = selectedVariant ? `&variantId=${selectedVariant.id}` : '';
      await api.post<CartDTO>(
        `/api/cart/user/${user!.id}/add/${product!.id}?quantity=${quantity}${variantParam}`,
        null
      );
      setToast({ message: product!.productName, image: product!.productImage });
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Error al añadir', image: null });
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p className={styles.loading}>Cargando producto...</p>;
  if (error || !product) return <p className={styles.error}>{error || 'Producto no encontrado'}</p>;

  return (
    <>
    <div className={styles.page}>
      <button className={styles.back} onClick={() => router.back()}>← Volver</button>

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
              <span className={styles.placeholder}>💻</span>
            )}
          </div>
        </div>

        <div className={styles.info}>
          {product.category && (
            <p className={styles.category}>{product.category.categoryName}</p>
          )}
          <h1 className={styles.name}>{product.productName}</h1>
          <p className={styles.price}>{displayPrice.toFixed(2)} €</p>

          {hasVariants ? (
            <div className={styles.variantSection}>
              {availableChips.length > 0 && (
                <div className={styles.variantGroup}>
                  <span className={styles.variantLabel}>Chip</span>
                  <div className={styles.variantOptions}>
                    {availableChips.map(chip => (
                      <button
                        key={chip}
                        className={`${styles.variantChip} ${selectedChip === chip ? styles.variantChipActive : ''}`}
                        onClick={() => handleChipChange(chip)}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableSizes.length > 1 && (
                <div className={styles.variantGroup}>
                  <span className={styles.variantLabel}>Pantalla</span>
                  <div className={styles.variantOptions}>
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        className={`${styles.variantChip} ${selectedSize === size ? styles.variantChipActive : ''}`}
                        onClick={() => handleSizeChange(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.variantGroup}>
                <span className={styles.variantLabel}>Almacenamiento</span>
                <div className={styles.variantOptions}>
                  {availableStorages.map(storage => (
                    <button
                      key={storage}
                      className={`${styles.variantChip} ${selectedStorage === storage ? styles.variantChipActive : ''}`}
                      onClick={() => setSelectedStorage(storage)}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>

              {selectedVariant && (
                <div className={styles.specs}>
                  {selectedVariant.chip && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Chip:</span>
                      <span>{selectedVariant.chip}</span>
                    </div>
                  )}
                  {selectedVariant.screenSize && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Pantalla:</span>
                      <span>{selectedVariant.screenSize}</span>
                    </div>
                  )}
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>RAM:</span>
                    <span>{selectedVariant.memory}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Almacenamiento:</span>
                    <span>{selectedVariant.storage}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            (product.productMemory || product.productStorage || product.colour) && (
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
            )
          )}

          {product.productDescription && (
            <p className={styles.description}>{product.productDescription}</p>
          )}

          <div className={styles.quantityRow}>
            <button className={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
            <span className={styles.qty}>{quantity}</span>
            <button className={styles.qtyBtn} onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>

          <button
            className={styles.addToCart}
            onClick={handleAddToCart}
            disabled={adding || (hasVariants && !selectedVariant)}
          >
            {adding ? 'Añadiendo...' : 'Añadir al carrito'}
          </button>

        </div>
      </div>
    </div>

    {toast && <Toast message={toast.message} image={toast.image} onClose={() => setToast(null)} />}
    </>
  );
}
