import { Suspense } from 'react';
import ProductsContent from './ProductsContent';

export default function ProductsPage() {
  return (
    <Suspense fallback={<p style={{ padding: '80px 24px', textAlign: 'center', color: '#888' }}>Cargando...</p>}>
      <ProductsContent />
    </Suspense>
  );
}
