'use client';

import { useState } from 'react';
import { logout } from '@/app/admin/actions';
import { formatEGP } from '@/lib/format';
import type { Order, PlannerImage, Product, Video } from '@/lib/types';
import { OrdersPanel } from './OrdersPanel';
import { PasswordPanel } from './PasswordPanel';
import { PhotosPanel } from './PhotosPanel';
import { PricingPanel } from './PricingPanel';
import { VideosPanel } from './VideosPanel';

interface DashboardProps {
  orders: Order[];
  product: Product;
  images: PlannerImage[];
  videos: Video[];
}

const TABS = [
  { id: 'orders', label: 'Orders' },
  { id: 'pricing', label: 'Pricing & stock' },
  { id: 'photos', label: 'Planner photos' },
  { id: 'videos', label: 'Videos' },
  { id: 'security', label: 'Password' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function Dashboard({ orders, product, images, videos }: DashboardProps) {
  const [tab, setTab] = useState<TabId>('orders');

  const stats = [
    { label: 'Total orders', value: orders.length },
    {
      label: 'Total revenue',
      value: formatEGP(orders.filter((order) => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0)),
    },
    {
      label: 'Pending deliveries',
      value: orders.filter((order) => ['pending', 'confirmed', 'shipped'].includes(order.status)).length,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-matcha-800">Admin</h1>
        <button type="button" onClick={() => logout()} className="mini-btn">Log out</button>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-butter p-5">
            <p className="eyebrow">{label}</p>
            <p className="mt-2 font-serif text-3xl text-matcha-800">{value}</p>
          </div>
        ))}
      </section>

      <div role="tablist" className="mt-10 flex gap-2 overflow-x-auto border-b border-matcha-600/15 pb-px scrollbar-none">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm transition ${tab === id ? 'border-forest text-forest' : 'border-transparent text-ink/60 hover:text-forest'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'orders' && <OrdersPanel orders={orders} />}
        {tab === 'pricing' && <PricingPanel product={product} />}
        {tab === 'photos' && <PhotosPanel images={images} />}
        {tab === 'videos' && <VideosPanel videos={videos} />}
        {tab === 'security' && <PasswordPanel />}
      </div>
    </div>
  );
}
