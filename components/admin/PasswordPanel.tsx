'use client';

import { useState, type FormEvent } from 'react';
import { changePassword } from '@/app/admin/actions';

type Notice = { kind: 'success' | 'error'; text: string };

export function PasswordPanel() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const next = String(data.get('next'));

    if (next !== String(data.get('confirm'))) {
      setNotice({ kind: 'error', text: 'The new passwords do not match.' });
      return;
    }

    setBusy(true);
    setNotice(null);
    try {
      const result = await changePassword(String(data.get('current')), next);
      if (result.error) {
        setNotice({ kind: 'error', text: result.error });
      } else {
        setNotice({ kind: 'success', text: 'Password updated. Every other device has been signed out.' });
        form.reset();
      }
    } catch {
      setNotice({ kind: 'error', text: 'That did not work. Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-md gap-4">
      <p className="text-sm leading-relaxed text-ink/70">
        Choose a new admin password. Once it is changed here, only the new password works, and it is stored
        encrypted so nobody else can read it.
      </p>
      <label className="grid gap-1.5 text-sm">
        Current password
        <input name="current" type="password" required autoComplete="current-password" className="field" />
      </label>
      <label className="grid gap-1.5 text-sm">
        New password (at least 10 characters)
        <input name="next" type="password" required minLength={10} autoComplete="new-password" className="field" />
      </label>
      <label className="grid gap-1.5 text-sm">
        Confirm new password
        <input name="confirm" type="password" required minLength={10} autoComplete="new-password" className="field" />
      </label>
      {notice && (
        <p role="alert" className={`text-sm ${notice.kind === 'error' ? 'text-red-800' : 'text-forest'}`}>{notice.text}</p>
      )}
      <button type="submit" disabled={busy} className="btn-primary w-fit">{busy ? 'Updating…' : 'Change password'}</button>
    </form>
  );
}
