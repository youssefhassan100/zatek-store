import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CopyCode } from '@/components/CopyCode';
import { PageHeader } from '@/components/PageHeader';
import { StatusTimeline } from '@/components/StatusTimeline';
import { formatDate, formatEGP, whatsappLink } from '@/lib/format';
import { getOrderByCode } from '@/lib/orders';

export const metadata: Metadata = { title: 'Order confirmed', robots: { index: false } };

export default async function OrderPage({ params }: { params: { code: string } }) {
  const order = await getOrderByCode(params.code);
  if (!order) notFound();

  const owner = process.env.OWNER_WHATSAPP;
  const message = `Hi ZATEK, my order code is ${order.code}`;

  return (
    <>
      <PageHeader eyebrow="Thank you" title={`Your order is in, ${order.name.split(' ')[0]}`}>
        <p>Keep this code. Share it with ZATEK whenever you contact us, so we can find your order instantly.</p>
      </PageHeader>

      <div className="mx-auto max-w-xl space-y-6 px-6">
        <div className="rounded-3xl bg-butter px-6 py-10 text-center">
          <p className="eyebrow mb-4">Order code</p>
          <CopyCode code={order.code} />
        </div>

        <div className="rounded-3xl border border-matcha-600/15 bg-white/60 p-6">
          <StatusTimeline status={order.status} />
          <dl className="mt-6 grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-ink/60">Quantity</dt><dd className="text-right">{order.quantity}</dd>
              <dt className="text-ink/60">Shipping</dt><dd className="text-right">{formatEGP(order.shipping)}</dd>
            <dt className="text-ink/60">Total</dt><dd className="text-right font-medium">{formatEGP(order.total)} · cash on delivery</dd>
            <dt className="text-ink/60">Placed</dt><dd className="text-right">{formatDate(order.created_at)}</dd>
          </dl>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {owner && (
            <a href={whatsappLink(owner, message)} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Message ZATEK on WhatsApp
            </a>
          )}
          <Link href="/track" className="btn-outline">Track this order</Link>
        </div>
      </div>
    </>
  );
}
