import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { StatusTimeline } from '@/components/StatusTimeline';
import { formatDate, formatEGP } from '@/lib/format';
import { findOrderForCustomer } from '@/lib/orders';

export const metadata: Metadata = { title: 'Track your order', robots: { index: false } };

type SearchParams = { code?: string; phone?: string };

export default async function TrackPage({ searchParams }: { searchParams: SearchParams }) {
  const { code = '', phone = '' } = searchParams;
  const searched = Boolean(code && phone);
  const order = searched ? await findOrderForCustomer(code, phone) : null;

  return (
    <>
      <PageHeader eyebrow="Track order" title="Where is my planner?">
        <p>Enter your order code and the phone number you used at checkout.</p>
      </PageHeader>

      <div className="mx-auto max-w-md px-6">
        <form action="/track" className="grid gap-3">
          <input name="code" defaultValue={code} required placeholder="ZTK-XXXXXX" autoCapitalize="characters" className="field uppercase" aria-label="Order code" />
          <input name="phone" defaultValue={phone} required type="tel" inputMode="tel" placeholder="Phone number" className="field" aria-label="Phone number" />
          <button type="submit" className="btn-primary">Track order</button>
        </form>

        {searched && !order && (
          <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
            We could not find an order with those details. Please check the code and phone number.
          </p>
        )}

        {order && (
          <div className="mt-8 rounded-3xl border border-matcha-600/15 bg-white/60 p-6">
            <p className="font-serif text-2xl text-forest">{order.code}</p>
            <div className="mt-5"><StatusTimeline status={order.status} /></div>
            <dl className="mt-6 grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-ink/60">Quantity</dt><dd className="text-right">{order.quantity}</dd>
              <dt className="text-ink/60">Shipping</dt><dd className="text-right">{formatEGP(order.shipping)}</dd>
              <dt className="text-ink/60">Total</dt><dd className="text-right">{formatEGP(order.total)}</dd>
              <dt className="text-ink/60">Placed</dt><dd className="text-right">{formatDate(order.created_at)}</dd>
            </dl>
          </div>
        )}
      </div>
    </>
  );
}
