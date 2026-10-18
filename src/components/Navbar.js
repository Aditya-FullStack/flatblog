'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import Avatar from '@/components/Avatar';
import { createClient, supabaseConfigured } from '@/lib/supabase/client';
import { IconPen, IconLogout, IconLayout } from '@/components/Icons';

export default function Navbar({ user = null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  async function signOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    setOpen(false);
    router.push('/');
    router.refresh();
  }

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Reader';
  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  const links = [
    { href: '/', label: 'Home' },
    { href: '/write', label: 'Write' }
  ];

  return (
    <header className="appbar">
      <div className="container appbar__inner">
        <Logo />

        <nav className="navlinks" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`navlink ${pathname === l.href ? 'is-active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="spacer" />

        {user ? (
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              className="btn btn--ghost"
              style={{ padding: 4, borderRadius: '999px' }}
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <Avatar name={name} src={avatarUrl} size="sm" />
            </button>
            {open && (
              <div
                role="menu"
                className="card"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 10px)',
                  minWidth: 224,
                  padding: 8,
                  zIndex: 80
                }}
              >
                <div style={{ padding: '10px 12px 12px' }}>
                  <div className="strong" style={{ fontSize: '.92rem' }}>
                    {name}
                  </div>
                  <div className="faint small">{user.email}</div>
                </div>
                <Link href="/dashboard" className="navlink" style={{ display: 'flex', gap: 10, borderRadius: 10 }}>
                  <IconLayout width={18} height={18} /> Dashboard
                </Link>
                <Link href="/write" className="navlink" style={{ display: 'flex', gap: 10, borderRadius: 10 }}>
                  <IconPen width={18} height={18} /> New story
                </Link>
                <button
                  onClick={signOut}
                  className="navlink"
                  style={{ display: 'flex', gap: 10, width: '100%', background: 'none', border: 0, borderRadius: 10, textAlign: 'left', color: 'var(--danger)' }}
                >
                  <IconLogout width={18} height={18} /> Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="btn btn--primary btn--sm">
            {supabaseConfigured ? 'Sign in' : 'Sign in'}
          </Link>
        )}
      </div>
    </header>
  );
}
