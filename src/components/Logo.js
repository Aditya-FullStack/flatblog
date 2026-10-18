import Link from 'next/link';

export default function Logo({ href = '/' }) {
  return (
    <Link href={href} className="brand" aria-label="FlatBlog home">
      <span className="brand__mark">
        <span>F</span>
      </span>
      <span>
        Flat<span style={{ color: 'var(--primary)' }}>Blog</span>
      </span>
    </Link>
  );
}
