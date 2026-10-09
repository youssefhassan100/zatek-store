import { useState } from 'react';

/** Tracks the state of an async admin action so panels can disable controls and show errors. */
export function useBusy() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (cause) {
      console.error(cause);
      setError(
        process.env.NODE_ENV === 'development' && cause instanceof Error
          ? cause.message
          : 'That did not work. Check the details and try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  return { busy, error, run };
}
