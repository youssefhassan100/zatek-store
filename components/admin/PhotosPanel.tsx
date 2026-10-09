'use client';

import type { ChangeEvent } from 'react';
import { addPlannerImage, moveItem, removePlannerImage, replacePlannerImage } from '@/app/admin/actions';
import type { PlannerImage } from '@/lib/types';
import { uploadFile } from './upload';
import { useBusy } from './useBusy';

export function PhotosPanel({ images }: { images: PlannerImage[] }) {
  const { busy, error, run } = useBusy();

  function onAdd(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!files.length) return;
    run(async () => {
      for (const file of files) await addPlannerImage(await uploadFile(file, 'images'));
    });
  }

  function onReplace(image: PlannerImage, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) run(async () => replacePlannerImage(image.id, await uploadFile(file, 'images')));
  }

  function remove(image: PlannerImage) {
    if (confirm('Delete this photo?')) run(() => removePlannerImage(image.id));
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <label className="btn-primary cursor-pointer">
          {busy ? 'Working…' : 'Add photos'}
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden disabled={busy} onChange={onAdd} />
        </label>
        <p className="text-sm text-ink/60">The first photo is the cover. Order here is the page order in the book viewer.</p>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-800">{error}</p>}

      {images.length === 0 ? (
        <p className="py-12 text-center text-ink/60">No photos yet. The site shows placeholder images until you add some.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
          {images.map((image, index) => (
            <li key={image.id} className="overflow-hidden rounded-2xl border border-matcha-600/15 bg-white/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="aspect-[3/4] w-full object-cover" />
              <div className="flex flex-wrap items-center gap-1.5 p-3">
                <span className="mr-auto text-xs text-matcha-600">#{index + 1}</span>
                <button type="button" disabled={busy || index === 0} onClick={() => run(() => moveItem('planner_images', image.id, -1))} className="mini-btn" aria-label="Move earlier">←</button>
                <button type="button" disabled={busy || index === images.length - 1} onClick={() => run(() => moveItem('planner_images', image.id, 1))} className="mini-btn" aria-label="Move later">→</button>
                <label className="mini-btn cursor-pointer">
                  Replace
                  <input type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={busy} onChange={(event) => onReplace(image, event)} />
                </label>
                <button type="button" disabled={busy} onClick={() => remove(image)} className="mini-btn-danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
