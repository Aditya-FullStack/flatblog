'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, supabaseConfigured } from '@/lib/supabase/client';
import { IconGoogle, IconFacebook, IconSparkles } from '@/components/Icons';

export default function LoginForm({ next: nextProp = '/dashboard' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [next, setNext] = useState(nextProp);

  // Read ?next= on the client so the page stays statically renderable.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('next');
    if (p) setNext(p);
  }, []);

  async function signIn(provider) {
    setError(null);
    const supabase = createClient();
    if (!supabase) {
      setError('Supabase is not configured yet — add your keys to enable sign-in.');
      return;
    }
    setLoading(provider);
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        ...(provider === 'google' ? { queryParams: { prompt: 'select_account' } } : {})
      }
    });
    if (err) {
      setError(err.message);
      setLoading(null);
    }
  }

  return (
    <div className="card authcard">
      <div className="authcard__head">
        <div
          className="brand__mark"
          style={{ width: 52, height: 52, borderRadius: 16, margin: '0 auto 16px' }}
        >
          <IconSparkles width={26} height={26} />
        </div>
        <h1>Welcome to FlatBlog</h1>
        <p>Sign in to write, edit and publish your stories.</p>
      </div>

      {!supabaseConfigured && (
        <div style={{ padding: '0 30px' }}>
          <div className="notice">
            <span>
              <strong>Demo mode.</strong> Supabase keys aren't set, so sign-in is
              disabled. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable Google &amp;
              Facebook login.
            </span>
          </div>
        </div>
      )}

      <div className="oauth">
        <button
          className="btn btn--google btn--block btn--lg"
          onClick={() => signIn('google')}
          disabled={loading !== null}
        >
          <IconGoogle />
          {loading === 'google' ? 'Redirecting…' : 'Continue with Google'}
        </button>

        <button
          className="btn btn--facebook btn--block btn--lg"
          onClick={() => signIn('facebook')}
          disabled={loading !== null}
        >
          <IconFacebook />
          {loading === 'facebook' ? 'Redirecting…' : 'Continue with Facebook'}
        </button>

        {error && (
          <div className="notice notice--error">
            <span>{error}</span>
          </div>
        )}

        <div className="divider">SECURE OAUTH</div>
        <p className="faint small center mb-0">
          We only receive your name, email and avatar. No passwords, ever.
        </p>
      </div>
    </div>
  );
}
