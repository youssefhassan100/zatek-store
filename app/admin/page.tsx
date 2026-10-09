import type { Metadata } from 'next';
import { Dashboard } from '@/components/admin/Dashboard';
import { LoginForm } from '@/components/admin/LoginForm';
import { isAdmin } from '@/lib/admin-auth';
import { getPlannerImages, getProduct, getVideos } from '@/lib/data';
import { listOrders } from '@/lib/orders';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await isAdmin())) return <LoginForm />;

  const [orders, product, images, videos] = await Promise.all([
    listOrders(),
    getProduct(),
    getPlannerImages(),
    getVideos(),
  ]);

  return <Dashboard orders={orders} product={product} images={images} videos={videos} />;
}
