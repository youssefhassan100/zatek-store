'use client';

import { Fragment, useMemo, useState } from 'react';
import { deleteOrder, setOrderStatus } from '@/app/admin/actions';
import { formatDate, formatEGP, whatsappLink } from '@/lib/format';
import { ORDER_STATUSES, STATUS_LABELS, type Order, type OrderStatus } from '@/lib/types';
import { useBusy } from './useBusy';

export function OrdersPanel({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);
  const { busy, error, run } = useBusy();

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return orders.filter(
      (order) =>
        (filter === 'all' || order.status === filter) &&
        (!needle || [order.code, order.name, order.phone].some((value) => value.toLowerCase().includes(needle))),
    );
  }, [orders, filter, query]);

  function remove(order: Order) {
    if (!confirm(`Delete order ${order.code}? This cannot be undone.`)) return;
    run(() => deleteOrder(order.id));
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-3">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search code, name or phone" className="field max-w-xs" aria-label="Search orders" />
        <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className="field max-w-[12rem]" aria-label="Filter by status">
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
        </select>
      </div>

      {error && <p role="alert" className="mb-3 text-sm text-red-800">{error}</p>}

      {visible.length === 0 ? (
        <p className="py-10 text-center text-ink/60">No orders to show.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-matcha-600">
              <tr>
                <th className="py-2 pr-4">Code</th><th className="pr-4">Customer</th><th className="pr-4">City</th>
                <th className="pr-4">Qty</th><th className="pr-4">Total</th><th className="pr-4">Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <Fragment key={order.id}>
                  <tr className="border-t border-matcha-600/15">
                    <td className="py-3 pr-4">
                      <button type="button" className="font-medium text-forest underline-offset-4 hover:underline" onClick={() => setOpenId(openId === order.id ? null : order.id)} aria-expanded={openId === order.id}>
                        {order.code}
                      </button>
                    </td>
                    <td className="pr-4">{order.name}</td>
                    <td className="pr-4">{order.city}</td>
                    <td className="pr-4">{order.quantity}</td>
                    <td className="pr-4">{formatEGP(order.total)}</td>
                    <td className="whitespace-nowrap pr-4">{formatDate(order.created_at)}</td>
                    <td>
                      <select
                        value={order.status}
                        disabled={busy}
                        onChange={(event) => run(() => setOrderStatus(order.id, event.target.value as OrderStatus))}
                        className="field !w-auto !py-1.5"
                        aria-label={`Status of ${order.code}`}
                      >
                        {ORDER_STATUSES.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
                      </select>
                    </td>
                  </tr>
                  {openId === order.id && (
                    <tr className="bg-butter/60">
                      <td colSpan={7} className="px-4 py-4">
                        <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                          <div><dt className="eyebrow">Address</dt><dd>{order.address}, {order.city}</dd></div>
                          <div><dt className="eyebrow">Phone</dt><dd><a className="underline" href={`tel:${order.phone}`}>{order.phone}</a></dd></div>
                          <div><dt className="eyebrow">WhatsApp</dt><dd><a className="underline" href={whatsappLink(order.whatsapp, `Hi ${order.name}, this is ZATEK about your order ${order.code}`)} target="_blank" rel="noopener noreferrer">{order.whatsapp}</a></dd></div>
                          <div><dt className="eyebrow">Discount</dt><dd>{order.discount > 0 ? formatEGP(order.discount) : 'None'}</dd></div>
                          <div><dt className="eyebrow">Shipping</dt><dd>{formatEGP(order.shipping)}</dd></div>
                          {order.notes && <div className="sm:col-span-2"><dt className="eyebrow">Notes</dt><dd>{order.notes}</dd></div>}
                        </dl>
                        <button type="button" onClick={() => remove(order)} disabled={busy} className="mini-btn-danger mt-4">Delete order</button>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
