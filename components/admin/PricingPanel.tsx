'use client';

import { useState, type FormEvent } from 'react';
import { saveProduct } from '@/app/admin/actions';
import type { Product } from '@/lib/types';
import { useBusy } from './useBusy';

export function PricingPanel({ product }: { product: Product }) {
  const [price, setPrice] = useState(String(product.price));
  const [salePrice, setSalePrice] = useState(product.sale_price === null ? '' : String(product.sale_price));
  const [discountActive, setDiscountActive] = useState(product.discount_active);
  const [inStock, setInStock] = useState(product.in_stock);
  const [saved, setSaved] = useState(false);
  const { busy, error, run } = useBusy();

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    run(async () => {
      await saveProduct({
        price: Number(price),
        sale_price: salePrice === '' ? null : Number(salePrice),
        discount_active: discountActive,
        in_stock: inStock,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-md gap-5">
      <label className="grid gap-1.5 text-sm">
        Price (EGP)
        <input type="number" min={0} step="any" required value={price} onChange={(event) => setPrice(event.target.value)} className="field" />
      </label>
      <label className="grid gap-1.5 text-sm">
        Sale price (EGP)
        <input type="number" min={0} step="any" value={salePrice} onChange={(event) => setSalePrice(event.target.value)} className="field" />
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" checked={discountActive} onChange={(event) => setDiscountActive(event.target.checked)} className="h-4 w-4 accent-forest" />
        Discount active (customers pay the sale price)
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" checked={inStock} onChange={(event) => setInStock(event.target.checked)} className="h-4 w-4 accent-forest" />
        In stock
      </label>
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary w-fit">{saved ? 'Saved' : busy ? 'Saving…' : 'Save changes'}</button>
    </form>
  );
}
