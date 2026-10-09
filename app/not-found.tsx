import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';

export default function NotFound() {
  return (
    <div className="pb-20 text-center">
      <PageHeader eyebrow="404" title="Page not found">
        <p>The page you are looking for does not exist.</p>
      </PageHeader>
      <Link href="/" className="btn-primary">Back home</Link>
    </div>
  );
}
