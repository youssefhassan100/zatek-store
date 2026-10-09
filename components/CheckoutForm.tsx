'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { formatEGP } from '@/lib/format';
import { GOVERNORATES, SHIPPING_FEES } from '@/lib/shipping';

interface CheckoutFormProps {
  price: number;
  unit: number;
}

export function CheckoutForm({ price, unit }: CheckoutFormProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState('');
  const [sameNumber, setSameNumber] = useState(true);
  const [city, setCity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const shipping = city ? SHIPPING_FEES[city] : 0;
  const discount = (price - unit) * quantity;
  const total = unit * quantity + shipping;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          phone,
          whatsapp: sameNumber ? phone : form.get('whatsapp'),
          address: form.get('address'),
          city,
          notes: form.get('notes'),
          website: form.get('website'),
          quantity,
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.message ?? 'Something went wrong. Please try again.');
        return;
      }
      router.push(`/order/${body.code}`);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1.5 text-sm">
        Full name
        <input name="name" required minLength={2} autoComplete="name" className="field" />
      </label>

      <label className="grid gap-1.5 text-sm">
        Phone number
        <input
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01012345678"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="field"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-ink/80">
        <input type="checkbox" checked={sameNumber} onChange={(event) => setSameNumber(event.target.checked)} className="accent-forest" />
        My WhatsApp number is the same
      </label>

      {!sameNumber && (
        <label className="grid gap-1.5 text-sm">
          WhatsApp number
          <input name="whatsapp" required type="tel" inputMode="tel" placeholder="01012345678" className="field" />
        </label>
      )}

      <label className="grid gap-1.5 text-sm">
        Shipping address
        <textarea name="address" required minLength={8} rows={2} autoComplete="street-address" className="field" />
      </label>

      <label className="grid gap-1.5 text-sm">
        City / Governorate
        <select required value={city} onChange={(event) => setCity(event.target.value)} className="field">
          <option value="" disabled>Select</option>
          {GOVERNORATES.map((name) => (
            <option key={name} value={name}>{name} — {formatEGP(SHIPPING_FEES[name])}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5 text-sm">
        Notes (optional)
        <textarea name="notes" rows={2} maxLength={300} className="field" />
      </label>

      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="mt-2 rounded-2xl bg-butter p-5">
        <div className="flex items-center justify-between text-sm">
          <span>Quantity</span>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="mini-btn h-10 w-10 !p-0" aria-label="Decrease quantity">−</button>
            <span className="w-4 text-center tabular-nums">{quantity}</span>
            <button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="mini-btn h-10 w-10 !p-0" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatEGP(price * quantity)}</dd></div>
          {discount > 0 && (
            <div className="flex justify-between text-matcha-600"><dt>Discount</dt><dd>− {formatEGP(discount)}</dd></div>
          )}
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{city ? formatEGP(shipping) : 'Select your governorate'}</dd>
          </div>
          <div className="flex justify-between border-t border-matcha-600/15 pt-3 font-serif text-xl text-matcha-800">
            <dt>Total</dt><dd>{formatEGP(total)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-ink/60">Cash on delivery. Pay when your planner arrives.</p>
      </div>

      <p role="alert" className="min-h-5 text-sm text-red-800">{error}</p>

      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? 'Placing your order…' : 'Place order'}
      </button>
    </form>
  );
}
