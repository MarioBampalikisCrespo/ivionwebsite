'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { CiSearch } from 'react-icons/ci';
import { api } from '../../../lib/api';
import { ProductDTO, CategoryDTO } from '../../../lib/types';
import { productImageSrc } from '../../../lib/images';
import styles from './products.module.css';

interface Filters {
  priceMin: string;
  priceMax: string;
  storage: string;
  colour: string;
}

const EMPTY_FILTERS: Filters = { priceMin: '', priceMax: '', storage: '', colour: '' };

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    api.get<CategoryDTO[]>('/api/categories').then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    const path = categoryParam ? `/api/products/category/${categoryParam}` : '/api/products';
    api.get<ProductDTO[]>(path)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryParam]);

  const storageOptions = useMemo(() =>
    [...new Set(products.map((p) => p.productStorage).filter(Boolean))].sort(),
    [products]
  );

  const colourOptions = useMemo(() =>
    [...new Set(products.map((p) => p.colour?.colourName).filter(Boolean))].sort(),
    [products]
  );

  const setCategory = (id: number | null) => {
    setSearch('');
    setFilters(EMPTY_FILTERS);
    router.push(id === null ? '/buy/products' : `/buy/products?category=${id}`);
  };

  const handleFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.productName.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.priceMin && Number(p.productPrice) < Number(filters.priceMin)) return false;
      if (filters.priceMax && Number(p.productPrice) > Number(filters.priceMax)) return false;
      if (filters.storage && p.productStorage !== filters.storage) return false;
      if (filters.colour && p.colour?.colourName !== filters.colour) return false;
      return true;
    });
  }, [products, search, filters]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Nuestros Productos</h1>
        <p>La mejor selección de dispositivos Apple</p>
      </div>

      <div className={styles.searchBar}>
        <CiSearch className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar producto... ej: iPhone 17, MacBook Pro"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className={styles.clearBtn} onClick={() => setSearch('')}>×</button>
        )}
        <button
          className={`${styles.filterToggle} ${filtersOpen || hasActiveFilters ? styles.filterToggleActive : ''}`}
          onClick={() => setFiltersOpen((o) => !o)}
        >
          Filtros {hasActiveFilters && <span className={styles.filterDot} />}
        </button>
      </div>

      {filtersOpen && (
        <div className={styles.filterPanel}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Precio mín. (€)</label>
            <input
              type="number"
              className={styles.filterInput}
              placeholder="0"
              min={0}
              value={filters.priceMin}
              onChange={(e) => handleFilter('priceMin', e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Precio máx. (€)</label>
            <input
              type="number"
              className={styles.filterInput}
              placeholder="9999"
              min={0}
              value={filters.priceMax}
              onChange={(e) => handleFilter('priceMax', e.target.value)}
            />
          </div>
          {storageOptions.length > 0 && (
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Almacenamiento</label>
              <select
                className={styles.filterSelect}
                value={filters.storage}
                onChange={(e) => handleFilter('storage', e.target.value)}
              >
                <option value="">Todos</option>
                {storageOptions.map((s) => (
                  <option key={s!} value={s!}>{s}</option>
                ))}
              </select>
            </div>
          )}
          {colourOptions.length > 0 && (
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Color</label>
              <select
                className={styles.filterSelect}
                value={filters.colour}
                onChange={(e) => handleFilter('colour', e.target.value)}
              >
                <option value="">Todos</option>
                {colourOptions.map((c) => (
                  <option key={c!} value={c!}>{c}</option>
                ))}
              </select>
            </div>
          )}
          {hasActiveFilters && (
            <button className={styles.clearFiltersBtn} onClick={clearFilters}>
              Limpiar filtros
            </button>
          )}
        </div>
      )}

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
      {!loading && !error && filtered.length === 0 && (
        <p className={styles.empty}>
          {search || hasActiveFilters
            ? 'No hay productos que coincidan con tu búsqueda.'
            : 'No hay productos disponibles.'}
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <p className={styles.resultsCount}>{filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}</p>
          <div className={styles.grid}>
            {filtered.map((product) => (
              <Link key={product.id} href={`/buy/products/${product.id}`} className={styles.card}>
                <div className={styles.imageWrapper}>
                  {productImageSrc(product.productImage) ? (
                    <Image
                      src={productImageSrc(product.productImage)!}
                      alt={product.productName}
                      fill
                      style={{ objectFit: 'contain', padding: '12px' }}
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
        </>
      )}
    </div>
  );
}
