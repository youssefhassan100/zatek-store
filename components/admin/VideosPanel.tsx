'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { addVideo, moveItem, removeVideo, updateVideo } from '@/app/admin/actions';
import type { Video } from '@/lib/types';
import { uploadFile } from './upload';
import { useBusy } from './useBusy';

interface VideoRowProps {
  video: Video;
  index: number;
  count: number;
}

function VideoRow({ video, index, count }: VideoRowProps) {
  const [title, setTitle] = useState(video.title ?? '');
  const [subtitle, setSubtitle] = useState(video.subtitle ?? '');
  const [url, setUrl] = useState(video.url);
  const { busy, error, run } = useBusy();

  const dirty = title !== (video.title ?? '') || subtitle !== (video.subtitle ?? '') || url !== video.url;

  function onReplace(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) run(async () => updateVideo(video.id, { url: await uploadFile(file, 'videos') }));
  }

  function remove() {
    if (confirm('Delete this video?')) run(() => removeVideo(video.id));
  }

  return (
    <li className="grid gap-4 rounded-2xl border border-matcha-600/15 bg-white/60 p-4 md:grid-cols-[auto_1fr]">
      <video src={video.url} muted preload="metadata" className="h-40 w-24 rounded-xl bg-matcha-800 object-cover" />
      <div className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" className="field" aria-label="Title" />
          <input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="Subtitle shown on the video" className="field" aria-label="Subtitle" />
        </div>
        <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Video URL" className="field" aria-label="Video URL" />
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" disabled={busy || !dirty} onClick={() => run(() => updateVideo(video.id, { title, subtitle, url }))} className="btn-primary !px-5 !py-2">Save</button>
          <label className="mini-btn cursor-pointer">
            Upload new file
            <input type="file" accept="video/mp4,video/webm,video/quicktime" hidden disabled={busy} onChange={onReplace} />
          </label>
          <button type="button" disabled={busy || index === 0} onClick={() => run(() => moveItem('videos', video.id, -1))} className="mini-btn" aria-label="Move earlier">←</button>
          <button type="button" disabled={busy || index === count - 1} onClick={() => run(() => moveItem('videos', video.id, 1))} className="mini-btn" aria-label="Move later">→</button>
          <button type="button" disabled={busy} onClick={remove} className="mini-btn-danger ml-auto">Delete</button>
        </div>
        {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      </div>
    </li>
  );
}

export function VideosPanel({ videos }: { videos: Video[] }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { busy, error, run } = useBusy();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    run(async () => {
      const source = file ? await uploadFile(file, 'videos') : url.trim();
      await addVideo({ title, subtitle, url: source });
      setTitle('');
      setSubtitle('');
      setUrl('');
      setFile(null);
      form.reset();
    });
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl border border-dashed border-matcha-600/40 p-5">
        <p className="font-medium text-matcha-800">Add a video</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" className="field" aria-label="Title" />
          <input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="Subtitle shown on the video" className="field" aria-label="Subtitle" />
        </div>
        <div className="grid items-center gap-3 sm:grid-cols-2">
          <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="text-sm" aria-label="Video file" />
          <input value={url} onChange={(event) => setUrl(event.target.value)} disabled={Boolean(file)} placeholder="…or paste a video URL" className="field" aria-label="Video URL" />
        </div>
        {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
        <button type="submit" disabled={busy || (!file && !url.trim())} className="btn-primary w-fit">{busy ? 'Uploading…' : 'Add video'}</button>
      </form>

      <ul className="mt-6 grid gap-4">
        {videos.map((video, index) => (
          <VideoRow key={video.id} video={video} index={index} count={videos.length} />
        ))}
      </ul>
      {videos.length === 0 && <p className="py-10 text-center text-ink/60">No videos yet.</p>}
    </div>
  );
}
