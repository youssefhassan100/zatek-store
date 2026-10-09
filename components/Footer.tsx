import Image from 'next/image';
import Link from 'next/link';
import { NAV_LINKS, SITE } from '@/lib/site';

export function Footer() {
  return (
    <footer className="mt-28 border-t border-matcha-600/15 bg-butter">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src={SITE.logo.src} alt={SITE.name} width={SITE.logo.width} height={SITE.logo.height} className="h-12 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/70">
            ZATEK is made for your ideas, your goals &amp; your everyday moments.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}><Link href={href} className="text-ink/75 hover:text-forest">{label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow">Follow</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="text-ink/75 hover:text-forest">Instagram</a></li>
            <li><a href={SITE.tiktok} target="_blank" rel="noopener noreferrer" className="text-ink/75 hover:text-forest">TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-matcha-600/15 py-6 text-center text-xs text-ink/60">
        <p>Owned and managed by Shahd Ezz</p>
        <p className="mt-1">Developed by UCIF.H</p>
      </div>
    </footer>
  );
}
