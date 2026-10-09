import type { Product } from './types';

export const unitPrice = (product: Product) =>
  product.discount_active && product.sale_price !== null ? product.sale_price : product.price;
