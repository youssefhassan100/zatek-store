import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}

export function PageHeader({ eyebrow, title, children }: PageHeaderProps) {
  return (
    <header className="mx-auto max-w-3xl px-6 pb-10 pt-16 text-center sm:pt-24">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-4 font-serif text-4xl leading-tight text-matcha-800 sm:text-5xl">{title}</h1>
      {children && <div className="mt-5 text-lg leading-relaxed text-ink/80">{children}</div>}
    </header>
  );
}
