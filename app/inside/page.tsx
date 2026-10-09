import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = { title: 'What’s inside' };

const START = [
  { title: 'How to Start Right', text: 'Understand how to approach your English journey without feeling overwhelmed.' },
  { title: 'Beat the Laziness', text: 'A little reminder to help you stop waiting for motivation and actually start.' },
  { title: 'Your Goal', text: 'Write down what you want to achieve and why you’re learning English — so you have something to come back to whenever you lose motivation.' },
];

const DAILY = [
  { title: '5 Words + Sentences', text: 'Learn 5 new words and use them in your own sentences.' },
  { title: 'Writing Practice', text: 'Space to practice expressing your thoughts in English.' },
  { title: 'Daily To-Do List', text: 'Plan your English practice and stay organized.' },
  { title: 'Mini Goal', text: 'Set one small, achievable goal for your English each day.' },
  { title: 'Daily Challenge', text: 'Fun speaking topics to help you practice talking and expressing yourself.' },
  { title: 'Daily Reflection', text: 'Reflect on what you learned, practiced, and improved.' },
];

const REFLECTION = ['What changed?', 'What did you learn?', 'What became easier?', 'What do you want to keep working on?'];

export default function InsidePage() {
  return (
    <>
      <PageHeader title="What’s inside?" />

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <Reveal>
          <h2 className="font-serif text-3xl text-forest">✦ Start Your Journey</h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed">
            Before you even start Day 1, you’ll find pages designed to help you start the right way:
          </p>
        </Reveal>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {START.map(({ title, text }, index) => (
            <Reveal key={title} delay={index * 0.08}>
              <Card className="h-full rounded-2xl border border-matcha-600/15 bg-white/60 p-6">
                <span className="font-serif text-4xl text-matcha-400">{index + 1}</span>
                <h3 className="mt-3 font-serif text-xl text-matcha-800">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink/80">{text}</p>
              </Card>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="bg-butter py-20">
        <Reveal className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl text-forest">At the end of the 30 days…</h2>
          <h3 className="mt-5 font-serif text-xl text-matcha-800">Monthly Reflection:</h3>
          <p className="mt-2">Look back at your entire journey.</p>
          <ul className="mt-3 space-y-1">
            {REFLECTION.map((item) => <li key={item}>- {item}</li>)}
          </ul>
          <p className="mt-8 text-lg">
            The goal isn’t to magically become fluent in 30 days.<br />
            <strong className="text-matcha-800">The goal is to finally stop starting over.</strong>
          </p>
          <p className="mt-5 leading-relaxed">
            By the end of your 30 days, you’ll have spent a full month actually practicing English — building consistency, improving your writing and speaking, learning new vocabulary, and most importantly, learning how to keep using the language.
          </p>
          <p className="mt-5 text-sm text-ink/70">Your progress will depend on how consistently you show up.</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <h2 className="font-serif text-3xl text-matcha-800">Why Talk the Talk?</h2>
          <p className="mt-5 text-lg leading-relaxed">
            Because learning English isn’t just about memorizing words.<br />It’s about using them.
          </p>
          <p className="mt-6">Talk the Talk gives you a place to:</p>
          <p className="mt-1 font-serif text-2xl text-forest">Learn → Write → Speak → Practice → Reflect → Repeat.</p>
          <p className="mt-3 leading-relaxed">One day at a time.<br />One word at a time.<br />One challenge at a time.</p>
          <p className="mt-6 font-medium text-matcha-800">
            You don’t need more motivation.<br />You need a system that makes it easier to start.
          </p>
        </Reveal>
      </section>

      <section id="journey" className="mx-auto max-w-5xl scroll-mt-24 px-6 pb-8">
        <Reveal>
          <h2 className="font-serif text-3xl text-matcha-800">Your 30-Day English Journey</h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed">
            A simple daily structure to help you practice English, stay consistent, and know exactly what to do every day:
          </p>
        </Reveal>
        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DAILY.map(({ title, text }, index) => (
            <Reveal key={title} delay={(index % 3) * 0.08}>
              <Card className="h-full rounded-2xl border border-matcha-600/15 bg-white/60 p-6">
                <span className="font-serif text-3xl text-matcha-400">{index + 1}</span>
                <h3 className="mt-2 font-serif text-xl text-matcha-800">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink/80">{text}</p>
              </Card>
            </Reveal>
          ))}
        </ol>
        <Reveal>
          <p className="mt-10 text-center font-serif text-2xl italic text-matcha-600">
            Learn. Write. Speak. Practice. Repeat.<br />One day at a time.
          </p>
          <div className="mt-8 text-center"><Link href="/checkout" className="btn-primary">Order now — Cash on delivery</Link></div>
        </Reveal>
      </section>
    </>
  );
}
