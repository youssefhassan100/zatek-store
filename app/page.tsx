import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Price } from '@/components/Price';
import { Reveal } from '@/components/Reveal';
import { VideoSlider } from '@/components/VideoSlider';
import { getGalleryUrls, getProduct, getVideos } from '@/lib/data';
import { SITE } from '@/lib/site';

const HIGHLIGHTS = [
  { href: '/inside', title: 'What’s inside?', text: 'The goal isn’t to magically become fluent in 30 days. The goal is to finally stop starting over.' },
  { href: '/inside#journey', title: 'Your 30-Day English Journey', text: 'Learn. Write. Speak. Practice. Repeat. One day at a time.' },
  { href: '/planner#faq', title: 'Questions, answered', text: 'Who is Talk the Talk for?' },
  { href: '/about', title: 'About ZATEK', text: 'ZATEK is made for your ideas, your goals & your everyday moments.' },
];

export default async function HomePage() {
  const [product, videos, gallery] = await Promise.all([getProduct(), getVideos(), getGalleryUrls()]);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-2 lg:gap-14 lg:py-24">
        <div>
          <Image src={SITE.logo.src} alt="" width={SITE.logo.width} height={SITE.logo.height} className="h-12 w-auto sm:h-16" priority />
          <h1 className="mt-8 font-serif text-4xl leading-tight text-matcha-800 sm:text-6xl">{SITE.productName}</h1>
          <p className="mt-5 font-serif text-2xl italic text-matcha-600">{SITE.tagline}</p>
          <div className="mt-8"><Price product={product} /></div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/checkout" className="btn-primary">Order now</Link>
            <Link href="/planner" className="btn-outline">See the planner</Link>
          </div>
        </div>
        <Card
          tilt={3}
          style={{ width: 'min(100%, 28rem, max(14rem, calc((100svh - 9rem) * 0.75)))' }}
          className="relative mx-auto aspect-[3/4] overflow-hidden rounded-3xl bg-butter shadow-2xl shadow-matcha-800/20">
          <Image src={gallery[0]} alt={SITE.productName} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" priority />
        </Card>
      </section>

      {videos.length > 0 && (
        <section className="mx-auto max-w-6xl py-12" aria-labelledby="reels-title">
          <Reveal className="px-6">
            <p className="eyebrow">ZATEK reels</p>
            <h2 id="reels-title" className="mt-3 font-serif text-3xl text-matcha-800 sm:text-4xl">Stop starting over. Start practicing.</h2>
          </Reveal>
          <div className="mt-6"><VideoSlider videos={videos} /></div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {HIGHLIGHTS.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <Link href={item.href} className="block h-full">
                <Card className="flex h-full flex-col justify-between rounded-3xl border border-matcha-600/15 bg-white/60 p-8">
                  <h3 className="font-serif text-2xl text-matcha-800">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink/75">{item.text}</p>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <Reveal>
          <div className="rounded-[2rem] bg-matcha-800 px-8 py-14 text-center text-butter">
            <p className="font-serif text-3xl leading-snug sm:text-4xl">
              You don’t need more motivation.<br />You need a system that makes it easier to start.
            </p>
            <Link href="/checkout" className="btn mt-8 bg-butter text-matcha-800 hover:bg-white">Order now — Cash on delivery</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
