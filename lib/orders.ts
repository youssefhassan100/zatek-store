import 'server-only';
import { randomInt } from 'node:crypto';
import { getProduct } from './data';
import { normalizePhone } from './format';
import { unitPrice } from './pricing';
import { shippingFee } from './shipping';
import { db } from './supabase';
import type { Order } from './types';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const UNIQUE_VIOLATION = '23505';

export class OutOfStockError extends Error {}

export interface NewOrder {
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  notes?: string;
  quantity: number;
}

const generateCode = () =>
  'ZTK-' + Array.from({ length: 6 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join('');

export async function createOrder(input: NewOrder): Promise<Order> {
  const product = await getProduct();
  if (!product.in_stock) throw new OutOfStockError();

  const unit = unitPrice(product);
  const shipping = shippingFee(input.city);
  if (shipping === undefined) throw new Error('Unknown shipping destination');
  const row = {
    ...input,
    notes: input.notes || null,
    unit_price: unit,
    discount: (product.price - unit) * input.quantity,
    shipping,
    total: unit * input.quantity + shipping,
  };

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await db()
      .from('orders')
      .insert({ ...row, code: generateCode() })
      .select()
      .single();
    if (!error) return data as Order;
    if (error.code !== UNIQUE_VIOLATION) throw error;
  }
  throw new Error('Could not generate a unique order code');
}

export async function getOrderByCode(code: string): Promise<Order | null> {
  const { data } = await db().from('orders').select('*').eq('code', code.trim().toUpperCase()).maybeSingle();
  return (data as Order | null) ?? null;
}

/** Customers prove ownership of a code with the phone number used at checkout. */
export async function findOrderForCustomer(code: string, phone: string): Promise<Order | null> {
  const order = await getOrderByCode(code);
  if (!order) return null;
  const given = normalizePhone(phone);
  return given === order.phone || given === order.whatsapp ? order : null;
}

export async function listOrders(): Promise<Order[]> {
  const { data } = await db().from('orders').select('*').order('created_at', { ascending: false }).limit(500);
  return (data ?? []) as Order[];
}
