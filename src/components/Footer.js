import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="row" style={{ gap: 14 }}>
          <Logo />
          <span className="faint">·</span>
          <span>Stories for people who like to think in paragraphs.</span>
        </div>
        <div className="row wrap" style={{ gap: 18 }}>
          <Link href="/">Home</Link>
          <Link href="/write">Write</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/login">Sign in</Link>
        </div>
        <div className="faint small">© {new Date().getFullYear()} FlatBlog. Built with Next.js &amp; Supabase.</div>
      </div>
    </footer>
  );
}
