'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV_LINKS, SITE } from '@/lib/site';

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-matcha-600/10 bg-paper/85 backdrop-blur-md">
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6" aria-label="Main">
        <Link href="/" aria-label={`${SITE.name} home`}>
          <Image src={SITE.logo.src} alt={SITE.name} width={SITE.logo.width} height={SITE.logo.height} className="h-10 w-auto" priority />
        </Link>

        <ul className="hidden items-center gap-7 text-sm lg:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href} className="relative">
              <Link href={href} className={isActive(href) ? 'text-forest' : 'text-ink/70 hover:text-forest'}>
                {label}
              </Link>
              {isActive(href) && (
                <motion.span layoutId="nav-underline" className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-forest" />
              )}
            </li>
          ))}
          <li>
            <Link href="/checkout" className="btn-primary !py-2">Order now</Link>
          </li>
        </ul>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={`h-0.5 w-6 bg-forest transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 bg-forest transition ${open ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-forest transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-matcha-600/10 bg-paper px-6 lg:hidden"
          >
            {[...NAV_LINKS, { href: '/checkout', label: 'Order now' }].map(({ href, label }) => (
              <li key={href} className="border-b border-matcha-600/10 last:border-0">
                <Link href={href} className={`block py-4 ${isActive(href) ? 'text-forest' : 'text-ink/80'}`}>
                  {label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
