import 'server-only';
import { db } from './supabase';
import type { PlannerImage, Product, Video } from './types';

const FALLBACK_PRODUCT: Product = { price: 250, sale_price: null, discount_active: false, in_stock: true };
const FALLBACK_IMAGES = [1, 2, 3, 4].map((n) => `/images/planner-${n}.jpg`);

/** Public pages stay up if the database is unreachable; the failure is logged for the server logs. */
async function safely<T>(label: string, read: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await read();
  } catch (error) {
    console.error(`Failed to load ${label}`, error);
    return fallback;
  }
}

export const getProduct = (): Promise<Product> =>
  safely(
    'product',
    async () => {
      const { data, error } = await db()
        .from('products')
        .select('price, sale_price, discount_active, in_stock')
        .eq('id', 1)
        .maybeSingle();
      if (error) throw error;
      if (!data) return FALLBACK_PRODUCT;
      return {
        price: Number(data.price),
        sale_price: data.sale_price === null ? null : Number(data.sale_price),
        discount_active: data.discount_active,
        in_stock: data.in_stock,
      };
    },
    FALLBACK_PRODUCT,
  );

export const getPlannerImages = (): Promise<PlannerImage[]> =>
  safely(
    'planner images',
    async () => {
      const { data, error } = await db().from('planner_images').select('*').order('position');
      if (error) throw error;
      return (data ?? []) as PlannerImage[];
    },
    [],
  );

/** Public gallery URLs, falling back to bundled placeholders until photos are uploaded. */
export async function getGalleryUrls(): Promise<string[]> {
  const images = await getPlannerImages();
  return images.length ? images.map((image) => image.url) : FALLBACK_IMAGES;
}

export const getVideos = (): Promise<Video[]> =>
  safely(
    'videos',
    async () => {
      const { data, error } = await db().from('videos').select('*').order('position');
      if (error) throw error;
      return (data ?? []) as Video[];
    },
    [],
  );
