import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/CheckoutForm';
import { PageHeader } from '@/components/PageHeader';
import { getProduct } from '@/lib/data';
import { unitPrice } from '@/lib/pricing';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

export default async function CheckoutPage() {
  const product = await getProduct();

  return (
    <>
      <PageHeader eyebrow="Cash on delivery" title="Place your order">
        <p>{SITE.productName}</p>
      </PageHeader>
      <div className="mx-auto max-w-xl px-6">
        {product.in_stock ? (
          <CheckoutForm price={product.price} unit={unitPrice(product)} />
        ) : (
          <p className="rounded-2xl bg-butter p-6 text-center">The planner is currently out of stock. Please check back soon.</p>
        )}
      </div>
    </>
  );
}
