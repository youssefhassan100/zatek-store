'use client';

import { useState, type FormEvent } from 'react';
import { login } from '@/app/admin/actions';

export function LoginForm() {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const result = await login(new FormData(event.currentTarget));
    if (result.error) setError(result.error);
    setSubmitting(false);
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <h1 className="font-serif text-3xl text-matcha-800">Admin</h1>
      <form onSubmit={onSubmit} className="mt-8 grid gap-3">
        <input name="password" type="password" required autoComplete="current-password" placeholder="Password" className="field" aria-label="Password" />
        <p role="alert" className="min-h-5 text-sm text-red-800">{error}</p>
        <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Checking…' : 'Enter'}</button>
      </form>
    </div>
  );
}
