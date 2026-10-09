'use client';

import { useState } from 'react';

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-serif text-4xl tracking-wider text-forest sm:text-5xl">{code}</p>
      <button type="button" onClick={copy} className="mini-btn" aria-live="polite">
        {copied ? 'Copied' : 'Copy code'}
      </button>
    </div>
  );
}
