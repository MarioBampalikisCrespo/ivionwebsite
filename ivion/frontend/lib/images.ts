export function productImageSrc(productImage: string | null): string | null {
  if (!productImage) return null;
  if (productImage.startsWith('http')) return productImage;
  return `/products/${productImage}`;
}
