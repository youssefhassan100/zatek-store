import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About ZATEK" title="ZATEK is more than just notebooks" />

      <Reveal className="mx-auto max-w-2xl px-6">
        <div dir="rtl" lang="ar" className="space-y-7 text-lg leading-loose">
          <p>
            البراند بدأ من فكرة بسيطة:<br />
            إننا نعمل حاجات فعلًا نكون محتاجينها في حياتنا اليومية — حاجات تساعدنا نذاكر، ننظم وقتنا، نطور نفسنا، ونستمتع بالـlittle things.
          </p>
          <p>
            كل notebook من ZATEK وراها فكرة أو احتياج حقيقي.<br />
            مش بنعمل notebook وخلاص، لكن بنفكر:<br />
            إيه اللي ممكن يخلي يومك أسهل؟ وإيه اللي يخليكي متحمسة تفتحي الـnotebook وتستخدميها فعلًا؟
          </p>
          <p>
            من English learning وstudying، لـplanning وjournaling، كل حاجة بنعملها هدفها إنها تكون useful, creative &amp; actually fun to use.
          </p>
          <div>
            <p>إحنا مؤمنين إن الـlittle things بتفرق:</p>
            <ul className="mt-2 space-y-1 pr-2">
              <li>- صفحة تخليكي تبدأي</li>
              <li>- هدف صغير تكتبيه وتحققيه</li>
              <li>- Notebook تبقى جزء من يومك وتبقى شبهك</li>
            </ul>
          </div>
        </div>
        <p className="mt-12 text-center font-serif text-3xl italic leading-snug text-forest">
          ZATEK is made for your ideas, your goals &amp; your everyday moments.
        </p>
      </Reveal>

      <Reveal className="mx-auto mt-20 max-w-3xl px-6">
        <div className="rounded-[2rem] bg-butter p-10 text-center">
          <p className="font-serif text-3xl text-matcha-800">Ready to find your next favorite notebook?</p>
          <p className="mt-3 text-lg">Take a look at our collection and find the one made for you.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/planner" className="btn-primary">See the planner</Link>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="btn-outline">Instagram</a>
            <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer" className="btn-outline">TikTok</a>
          </div>
        </div>
      </Reveal>
    </>
  );
}
