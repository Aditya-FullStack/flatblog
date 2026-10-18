import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page">
      <div className="container">
        <div className="empty" style={{ paddingTop: 90 }}>
          <div className="empty__icon" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem' }}>
            404
          </div>
          <h1 style={{ fontSize: '2rem' }}>That page went for a coffee</h1>
          <p className="muted">We couldn't find the story you were looking for.</p>
          <Link href="/" className="btn btn--primary mt-3">
            Back to the homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
