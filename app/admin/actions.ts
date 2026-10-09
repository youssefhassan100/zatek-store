'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { endSession, passwordMatches, requireAdmin, setPassword, startSession } from '@/lib/admin-auth';
import { db } from '@/lib/supabase';
import { ORDER_STATUSES, type OrderStatus, type Product } from '@/lib/types';

const BUCKET = 'media';
const PUBLIC_PATH = `/storage/v1/object/public/${BUCKET}/`;

type MediaTable = 'planner_images' | 'videos';

const refresh = () => revalidatePath('/', 'layout');

function assertOk(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

async function deleteStoredFile(url: string) {
  const start = url.indexOf(PUBLIC_PATH);
  if (start === -1) return;
  await db().storage.from(BUCKET).remove([decodeURIComponent(url.slice(start + PUBLIC_PATH.length))]);
}

async function nextPosition(table: MediaTable) {
  const { data } = await db().from(table).select('position').order('position', { ascending: false }).limit(1);
  return data?.length ? Number(data[0].position) + 1 : 0;
}

export async function login(formData: FormData): Promise<{ error?: string }> {
  if (!(await passwordMatches(String(formData.get('password') ?? '')))) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: 'Incorrect password.' };
  }
  await startSession();
  refresh();
  return {};
}

export async function changePassword(current: string, next: string): Promise<{ error?: string }> {
  await requireAdmin();
  if (!(await passwordMatches(current))) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: 'The current password is incorrect.' };
  }
  if (next.length < 10) return { error: 'Use at least 10 characters.' };
  if (next === current) return { error: 'Choose a password different from the current one.' };
  await setPassword(next);
  await startSession();
  refresh();
  return {};
}

export async function logout() {
  endSession();
  refresh();
}

export async function saveProduct(input: Product) {
  await requireAdmin();
  const { price, sale_price, discount_active, in_stock } = input;
  if (!Number.isFinite(price) || price < 0) throw new Error('Invalid price');
  if (sale_price !== null && (!Number.isFinite(sale_price) || sale_price < 0 || sale_price > price)) {
    throw new Error('Invalid sale price');
  }
  assertOk((await db().from('products').upsert({ id: 1, price, sale_price, discount_active, in_stock })).error);
  refresh();
}

export async function setOrderStatus(id: number, status: OrderStatus) {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(status)) throw new Error('Invalid status');
  assertOk((await db().from('orders').update({ status }).eq('id', id)).error);
  refresh();
}

export async function deleteOrder(id: number) {
  await requireAdmin();
  assertOk((await db().from('orders').delete().eq('id', id)).error);
  refresh();
}

/** Issues a one-time upload URL so large files go straight from the browser to Storage. */
export async function createUploadUrl(folder: 'images' | 'videos', fileName: string) {
  await requireAdmin();
  const extension = fileName.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${folder}/${randomUUID()}${extension ? `.${extension}` : ''}`;
  const { data, error } = await db().storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? 'Could not create upload URL');
  const { data: file } = db().storage.from(BUCKET).getPublicUrl(path);
  return { path, token: data.token, publicUrl: file.publicUrl };
}

export async function addPlannerImage(url: string) {
  await requireAdmin();
  assertOk((await db().from('planner_images').insert({ url, position: await nextPosition('planner_images') })).error);
  refresh();
}

export async function replacePlannerImage(id: string, url: string) {
  await requireAdmin();
  const { data } = await db().from('planner_images').select('url').eq('id', id).maybeSingle();
  assertOk((await db().from('planner_images').update({ url }).eq('id', id)).error);
  if (data) await deleteStoredFile(data.url);
  refresh();
}

export async function removePlannerImage(id: string) {
  await requireAdmin();
  const { data } = await db().from('planner_images').select('url').eq('id', id).maybeSingle();
  assertOk((await db().from('planner_images').delete().eq('id', id)).error);
  if (data) await deleteStoredFile(data.url);
  refresh();
}

export async function addVideo(input: { title: string; subtitle: string; url: string }) {
  await requireAdmin();
  if (!input.url) throw new Error('A video file or URL is required');
  assertOk(
    (await db().from('videos').insert({
      title: input.title || null,
      subtitle: input.subtitle || null,
      url: input.url,
      position: await nextPosition('videos'),
    })).error,
  );
  refresh();
}

export async function updateVideo(id: string, patch: { title?: string; subtitle?: string; url?: string }) {
  await requireAdmin();
  const { data: current } = await db().from('videos').select('url').eq('id', id).maybeSingle();
  assertOk(
    (await db().from('videos').update({
      ...(patch.title !== undefined && { title: patch.title || null }),
      ...(patch.subtitle !== undefined && { subtitle: patch.subtitle || null }),
      ...(patch.url && { url: patch.url }),
    }).eq('id', id)).error,
  );
  if (current && patch.url && patch.url !== current.url) await deleteStoredFile(current.url);
  refresh();
}

export async function removeVideo(id: string) {
  await requireAdmin();
  const { data } = await db().from('videos').select('url').eq('id', id).maybeSingle();
  assertOk((await db().from('videos').delete().eq('id', id)).error);
  if (data) await deleteStoredFile(data.url);
  refresh();
}

export async function moveItem(table: MediaTable, id: string, direction: -1 | 1) {
  await requireAdmin();
  if (table !== 'planner_images' && table !== 'videos') throw new Error('Invalid table');
  const { data, error } = await db().from(table).select('id').order('position');
  assertOk(error);
  const ids: string[] = (data ?? []).map((row) => row.id);
  const from = ids.indexOf(id);
  const to = from + direction;
  if (from === -1 || to < 0 || to >= ids.length) return;
  [ids[from], ids[to]] = [ids[to], ids[from]];
  await Promise.all(ids.map((rowId, position) => db().from(table).update({ position }).eq('id', rowId)));
  refresh();
}
