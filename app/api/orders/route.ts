import { NextResponse } from 'next/server';
import { z } from 'zod';
import { notifyOwner } from '@/lib/notify';
import { createOrder, OutOfStockError } from '@/lib/orders';
import { shippingFee } from '@/lib/shipping';

const mobile = z
  .string()
  .transform((value) => value.replace(/[\s-]/g, ''))
  .pipe(z.string().regex(/^01[0-25]\d{8}$/, 'Enter a valid Egyptian mobile number, e.g. 01012345678.'));

const orderSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(80),
  phone: mobile,
  whatsapp: mobile,
  address: z.string().trim().min(8, 'Please enter your full address.').max(250),
  city: z.string().refine((city) => shippingFee(city) !== undefined, 'Please select your governorate.'),
  notes: z.string().trim().max(300).optional(),
  quantity: z.number().int().min(1).max(10),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = orderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
  }

  const { website, ...input } = parsed.data;
  if (website) return NextResponse.json({ code: 'ZTK-000000' }); // honeypot: pretend success to bots

  try {
    const order = await createOrder(input);
    await notifyOwner(order);
    return NextResponse.json({ code: order.code }, { status: 201 });
  } catch (error) {
    if (error instanceof OutOfStockError) {
      return NextResponse.json({ message: 'The planner is currently out of stock.' }, { status: 409 });
    }
    console.error('Order creation failed', error);
    const reason = (error as { message?: string } | null)?.message;
    const message =
      process.env.NODE_ENV === 'development' && reason
        ? `Order failed: ${reason}`
        : 'We could not place your order. Please try again.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
