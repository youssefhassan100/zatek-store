import { STATUS_LABELS, type OrderStatus } from '@/lib/types';

const STEPS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered'];

export function StatusTimeline({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">This order was cancelled.</p>;
  }
  const reached = STEPS.indexOf(status);
  return (
    <ol className="grid grid-cols-4 gap-2">
      {STEPS.map((step, index) => (
        <li key={step} className="text-center">
          <div className={`h-1.5 rounded-full ${index <= reached ? 'bg-forest' : 'bg-matcha-600/15'}`} />
          <span className={`mt-2 block text-xs ${index <= reached ? 'text-matcha-800' : 'text-ink/40'}`}>
            {STATUS_LABELS[step]}
          </span>
        </li>
      ))}
    </ol>
  );
}
