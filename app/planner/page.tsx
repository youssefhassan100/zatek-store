import type { Metadata } from 'next';
import Link from 'next/link';
import { BookGallery } from '@/components/BookGallery';
import { Card } from '@/components/Card';
import { Flashcards } from '@/components/Flashcards';
import { Price } from '@/components/Price';
import { Reveal } from '@/components/Reveal';
import { getGalleryUrls, getProduct } from '@/lib/data';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'The Planner' };

const AUDIENCE = [
  'starts learning English then stops after a few days',
  'doesn’t know where to start',
  'struggles with consistency and motivation',
  'wants to organize their English practice',
  'understands English but doesn’t practice speaking enough',
  'wants to make English a part of their daily routine',
];

const DETAILS = [
  { label: 'Size', text: 'A5 — perfect for studying, journaling & taking with you anywhere.' },
  { label: 'Paper Quality', text: 'High-quality paper, smooth and comfortable for writing and everyday use.' },
  { label: 'Pages', text: '75 pages' },
];

export default async function PlannerPage() {
  const [product, images] = await Promise.all([getProduct(), getGalleryUrls()]);

  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-8 lg:grid-cols-2 lg:gap-14 lg:py-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookGallery images={images} alt={SITE.productName} />
        </div>

        <div>
          <p className="eyebrow">ZATEK</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-matcha-800 sm:text-5xl">{SITE.productName}</h1>
          <p className="mt-4 font-serif text-2xl italic text-matcha-600">{SITE.tagline}</p>
          <div className="mt-6"><Price product={product} /></div>

          <p dir="rtl" lang="ar" className="mt-8 text-lg leading-loose">
            بتبدأ English بحماس، تذاكر كام يوم، وبعدها motivation تختفي ومش عارف ترجع تبدأ منين؟<br />
            Talk the Talk هو 30-Day English Planner معمول عشان يساعدك turn English into a daily habit — بطريقة بسيطة، منظمة، ومش overwhelming.
          </p>

          <p dir="auto" className="mt-6 leading-relaxed">
            مش مجرد notebook تكتب فيها vocabulary.<br />
            It’s a 30-day journey designed to help you practice English every single day.
          </p>

          <h2 className="mt-10 font-serif text-2xl text-matcha-800">Who is it for?</h2>
          <p className="mt-3 leading-relaxed">
            Talk the Talk is for everyone.<br />
            Whether you’re just starting your English journey or you’ve been learning for years, you can use the planner at your own level.
          </p>
          <p className="mt-4">It’s especially made for anyone who:</p>
          <ul className="mt-3 space-y-2 text-matcha-800">
            {AUDIENCE.map((item) => (
              <li key={item} className="flex gap-3"><span aria-hidden>•</span>{item}</li>
            ))}
          </ul>
          <p className="mt-6 font-medium text-matcha-800">You don’t have to be at a certain level. You just have to start.</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {product.in_stock ? (
              <Link href="/checkout" className="btn-primary">Order now — Cash on delivery</Link>
            ) : (
              <span className="btn bg-matcha-600/20 text-matcha-800">Currently out of stock</span>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <Reveal><h2 className="font-serif text-3xl text-matcha-800">Product Details</h2></Reveal>
        <dl className="mt-8 grid gap-5 sm:grid-cols-3">
          {DETAILS.map(({ label, text }, index) => (
            <Reveal key={label} delay={index * 0.08}>
              <Card className="h-full rounded-2xl border border-matcha-600/15 bg-white/60 p-6">
                <dt className="eyebrow">{label}</dt>
                <dd className="mt-3 leading-relaxed">• {text}</dd>
              </Card>
            </Reveal>
          ))}
        </dl>
      </section>

      <section id="faq" className="scroll-mt-24 py-16">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-4 font-serif text-3xl text-matcha-800 sm:text-4xl">Questions, answered</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">
            Click on card to see answer<br /><span lang="ar">إضغط على الكارت لرؤية الإجابة</span>
          </p>
        </Reveal>
        <div className="mt-10"><Flashcards /></div>
      </section>
    </>
  );
}
