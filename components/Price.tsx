import { formatEGP } from '@/lib/format';
import { unitPrice } from '@/lib/pricing';
import type { Product } from '@/lib/types';

export function Price({ product }: { product: Product }) {
  const current = unitPrice(product);
  const discounted = current < product.price;
  return (
    <div className="inline-flex w-fit flex-wrap items-baseline gap-x-3 rounded-full bg-butter px-6 py-2.5 text-matcha-800">
      <span className="font-serif text-2xl">{formatEGP(current)}</span>
      {discounted && <span className="text-sm line-through opacity-60">{formatEGP(product.price)}</span>}
      {!product.in_stock && <span className="text-sm font-medium text-red-800">Out of stock</span>}
    </div>
  );
}
