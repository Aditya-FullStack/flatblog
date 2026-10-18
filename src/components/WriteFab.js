import Link from 'next/link';
import { IconPlus } from '@/components/Icons';

export default function WriteFab({ href = '/write' }) {
  return (
    <Link href={href} className="fab" aria-label="Write a new story" title="Write a new story">
      <IconPlus width={26} height={26} />
    </Link>
  );
}
