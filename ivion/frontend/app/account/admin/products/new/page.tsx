'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../../../lib/api';
import { CategoryDTO, ColourDTO, ProductDTO, ProductRequest } from '../../../../../lib/types';
import { useAdminGuard } from '../../../../../hooks/useAdminGuard';
import styles from '../adminProducts.module.css';

const TEXT_RE = /^[^<>"';&|]*$/;

type Field = 'productName' | 'productDescription' | 'productMemory' | 'productStorage'
  | 'productImage' | 'productPrice' | 'categoryId' | 'colourId';

interface FormState {
  productName: string;
  productDescription: string;
  productMemory: string;
  productStorage: string;
  productImage: string;
  productPrice: string;
  categoryId: string;
  colourId: string;
}

const EMPTY_FORM: FormState = {
  productName: '', productDescription: '', productMemory: '', productStorage: '',
  productImage: '', productPrice: '', categoryId: '', colourId: '',
};

function validate(form: FormState) {
  const errors: Partial<Record<Field, string>> = {};

  if (!form.productName.trim())
    errors.productName = 'El nombre es obligatorio';
  else if (!TEXT_RE.test(form.productName))
    errors.productName = 'El nombre no puede contener caracteres especiales';

  if (!form.productDescription.trim())
    errors.productDescription = 'La descripción es obligatoria';

  if (!form.productMemory.trim())
    errors.productMemory = 'La memoria es obligatoria (ej: 8 GB)';
  else if (!TEXT_RE.test(form.productMemory))
    errors.productMemory = 'Caracteres no permitidos';

  if (!form.productStorage.trim())
    errors.productStorage = 'El almacenamiento es obligatorio (ej: 256 GB)';
  else if (!TEXT_RE.test(form.productStorage))
    errors.productStorage = 'Caracteres no permitidos';

  if (!form.productImage.trim())
    errors.productImage = 'La imagen es obligatoria';
  else if (!TEXT_RE.test(form.productImage))
    errors.productImage = 'Caracteres no permitidos';

  const price = Number(form.productPrice);
  if (!form.productPrice.trim())
    errors.productPrice = 'El precio es obligatorio';
  else if (Number.isNaN(price) || price < 0)
    errors.productPrice = 'Introduce un precio válido';

  if (!form.categoryId)
    errors.categoryId = 'Selecciona una categoría';

  return errors;
}

export default function NewProductPage() {
  const router = useRouter();
  const { ready } = useAdminGuard();

  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [colours, setColours] = useState<ColourDTO[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ready) return;
    Promise.all([
      api.get<CategoryDTO[]>('/api/categories'),
      api.get<ColourDTO[]>('/api/colours'),
    ]).then(([cats, cols]) => {
      setCategories(cats);
      setColours(cols);
    }).catch(() => {});
  }, [ready]);

  if (!ready) return null;

  const errors = validate(form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBlur = (field: Field) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      productName: true, productDescription: true, productMemory: true, productStorage: true,
      productImage: true, productPrice: true, categoryId: true,
    });
    if (Object.keys(errors).length > 0) return;

    setApiError('');
    setSaving(true);
    try {
      const body: ProductRequest = {
        productName: form.productName,
        productDescription: form.productDescription,
        productMemory: form.productMemory,
        productStorage: form.productStorage,
        productImage: form.productImage,
        productPrice: Number(form.productPrice),
        categoryId: Number(form.categoryId),
        colourId: form.colourId ? Number(form.colourId) : null,
      };
      await api.post<ProductDTO>('/api/products', body);
      router.push('/account/admin/products');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al crear el producto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <Link href="/account/admin/products" className={styles.backLink}>← Volver al listado</Link>
      <h1 className={styles.title} style={{ marginTop: 12, marginBottom: 24 }}>Nuevo producto</h1>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="productName">Nombre</label>
            <input
              id="productName" name="productName" type="text"
              className={`${styles.input}${touched.productName && errors.productName ? ` ${styles.inputError}` : ''}`}
              value={form.productName} onChange={handleChange} onBlur={() => handleBlur('productName')}
              placeholder="iPhone 17 Pro"
            />
            {touched.productName && errors.productName && <div className={styles.fieldError}>{errors.productName}</div>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="productDescription">Descripción</label>
            <textarea
              id="productDescription" name="productDescription"
              className={`${styles.textarea}${touched.productDescription && errors.productDescription ? ` ${styles.inputError}` : ''}`}
              value={form.productDescription} onChange={handleChange} onBlur={() => handleBlur('productDescription')}
              placeholder="Descripción del producto..."
            />
            {touched.productDescription && errors.productDescription && <div className={styles.fieldError}>{errors.productDescription}</div>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="productMemory">Memoria</label>
              <input
                id="productMemory" name="productMemory" type="text"
                className={`${styles.input}${touched.productMemory && errors.productMemory ? ` ${styles.inputError}` : ''}`}
                value={form.productMemory} onChange={handleChange} onBlur={() => handleBlur('productMemory')}
                placeholder="8 GB"
              />
              {touched.productMemory && errors.productMemory && <div className={styles.fieldError}>{errors.productMemory}</div>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="productStorage">Almacenamiento</label>
              <input
                id="productStorage" name="productStorage" type="text"
                className={`${styles.input}${touched.productStorage && errors.productStorage ? ` ${styles.inputError}` : ''}`}
                value={form.productStorage} onChange={handleChange} onBlur={() => handleBlur('productStorage')}
                placeholder="256 GB"
              />
              {touched.productStorage && errors.productStorage && <div className={styles.fieldError}>{errors.productStorage}</div>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="productImage">Imagen</label>
            <input
              id="productImage" name="productImage" type="text"
              className={`${styles.input}${touched.productImage && errors.productImage ? ` ${styles.inputError}` : ''}`}
              value={form.productImage} onChange={handleChange} onBlur={() => handleBlur('productImage')}
              placeholder="iphone17pro.png"
            />
            <span className={styles.hint}>Nombre de archivo en /public/products (ej: iphone17pro.png) o URL completa.</span>
            {touched.productImage && errors.productImage && <div className={styles.fieldError}>{errors.productImage}</div>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="productPrice">Precio (€)</label>
              <input
                id="productPrice" name="productPrice" type="text" inputMode="decimal"
                className={`${styles.input}${touched.productPrice && errors.productPrice ? ` ${styles.inputError}` : ''}`}
                value={form.productPrice} onChange={handleChange} onBlur={() => handleBlur('productPrice')}
                placeholder="999.00"
              />
              {touched.productPrice && errors.productPrice && <div className={styles.fieldError}>{errors.productPrice}</div>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="categoryId">Categoría</label>
              <select
                id="categoryId" name="categoryId"
                className={`${styles.select}${touched.categoryId && errors.categoryId ? ` ${styles.inputError}` : ''}`}
                value={form.categoryId} onChange={handleChange} onBlur={() => handleBlur('categoryId')}
              >
                <option value="">Selecciona...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.categoryName}</option>
                ))}
              </select>
              {touched.categoryId && errors.categoryId && <div className={styles.fieldError}>{errors.categoryId}</div>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="colourId">Color (opcional)</label>
            <select
              id="colourId" name="colourId" className={styles.select}
              value={form.colourId} onChange={handleChange}
            >
              <option value="">Sin color específico</option>
              {colours.map(c => (
                <option key={c.id} value={c.id}>{c.colourName}</option>
              ))}
            </select>
          </div>

          {apiError && <p className={styles.error}>{apiError}</p>}

          <div className={styles.actions}>
            <button type="submit" className={styles.submit} disabled={saving}>
              {saving ? 'Creando...' : 'Crear producto'}
            </button>
            <Link href="/account/admin/products" className={styles.cancel}>Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
