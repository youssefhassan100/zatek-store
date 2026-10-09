import 'server-only';
import { formatDate, formatEGP } from './format';
import type { Order } from './types';

function buildMessage(order: Order) {
  return [
    `New ZATEK order`,
    `Order ID: ${order.code}`,
    `Customer: ${order.name}`,
    `Phone: ${order.phone}`,
    `WhatsApp: ${order.whatsapp}`,
    `Address: ${order.address}, ${order.city}`,
    `Quantity: ${order.quantity}`,
    order.discount > 0 ? `Discount applied: ${formatEGP(order.discount)}` : null,
    `Shipping: ${formatEGP(order.shipping)}`,
    `Total (cash on delivery): ${formatEGP(order.total)}`,
    order.notes ? `Notes: ${order.notes}` : null,
    `Date: ${formatDate(order.created_at)}`,
  ]
    .filter(Boolean)
    .join('\n');
}

async function sendViaUltraMsg(to: string, body: string) {
  const { ULTRAMSG_INSTANCE: instance, ULTRAMSG_TOKEN: token } = process.env;
  if (!instance || !token) return false;
  const response = await fetch(`https://api.ultramsg.com/${instance}/messages/chat`, {
    method: 'POST',
    body: new URLSearchParams({ token, to, body }),
  });
  if (!response.ok) throw new Error(`UltraMsg responded with ${response.status}`);
  return true;
}

async function sendViaCloudApi(to: string, body: string) {
  const { WA_TOKEN: token, WA_PHONE_ID: phoneId } = process.env;
  if (!token || !phoneId) return false;
  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body } }),
  });
  if (!response.ok) throw new Error(`WhatsApp Cloud API responded with ${response.status}`);
  return true;
}

/** Never throws: a failed notification must not fail the customer's order. */
export async function notifyOwner(order: Order) {
  const to = process.env.OWNER_WHATSAPP;
  if (!to) return;
  const body = buildMessage(order);
  try {
    const sent = (await sendViaUltraMsg(to, body)) || (await sendViaCloudApi(to, body));
    if (!sent) console.warn('No WhatsApp provider configured; the owner was not notified.');
  } catch (error) {
    console.error('Owner WhatsApp notification failed', error);
  }
}
