import type { Metadata, Viewport } from 'next';
import { Cairo, Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { SITE } from '@/lib/site';

const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const arabic = Cairo({ subsets: ['arabic'], variable: '--font-ar', display: 'swap' });

const FALLBACK_URL = 'http://localhost:3000';

function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_URL;
  try {
    return new URL(/^https?:\/\//.test(raw) ? raw : `https://${raw}`);
  } catch {
    return new URL(FALLBACK_URL);
  }
}

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: `${SITE.name} — ${SITE.productName}`, template: `%s | ${SITE.name}` },
  description: 'A 30-day English planner that turns daily practice into a habit. Stop starting over. Start practicing.',
  openGraph: {
    title: SITE.productName,
    description: SITE.tagline,
    siteName: SITE.name,
    type: 'website',
  },
};

// Content comes from the database and the admin edits it live, so pages are rendered per request.
export const dynamic = 'force-dynamic';

export const viewport: Viewport = { themeColor: '#FFFBEC' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${arabic.variable}`}>
      <body className="font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
