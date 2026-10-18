import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUser, supabaseConfigured } from '@/lib/supabase/server';
import { getPostsByAuthor } from '@/lib/data';
import DashboardList from '@/components/DashboardList';
import Avatar from '@/components/Avatar';
import { IconPlus, IconLayout } from '@/components/Icons';

export const metadata = { title: 'Dashboard' };

const isStatic = process.env.STATIC_EXPORT === '1';
export const dynamic = isStatic ? 'force-static' : 'force-dynamic';

export default async function DashboardPage() {
  const user = await getUser();
  if (supabaseConfigured && !user) redirect('/login?next=/dashboard');

  // Demo / static-preview mode: no session, so show a friendly prompt.
  if (!user) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty card card__pad" style={{ maxWidth: 560, margin: '40px auto' }}>
            <div className="empty__icon">
              <IconLayout />
            </div>
            <h1 style={{ fontSize: '1.6rem' }}>Your dashboard lives here</h1>
            <p className="muted">
              Sign in with Google or Facebook to see your stories, drafts and stats.
              This preview is running without a backend, so sign-in is disabled.
            </p>
            <Link href="/login" className="btn btn--primary mt-2">
              Go to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const posts = await getPostsByAuthor(user.id);
  const name =
    user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0];
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  const published = posts.filter((p) => p.published).length;

  return (
    <div className="page">
      <div className="container">
        <div className="row-between wrap mb-3" style={{ gap: 16 }}>
          <div className="row" style={{ gap: 14 }}>
            <Avatar name={name} src={avatarUrl} size="lg" />
            <div>
              <h1 style={{ fontSize: '1.7rem' }}>Your dashboard</h1>
              <p className="muted mb-0">Signed in as {user.email}</p>
            </div>
          </div>
          <Link href="/write" className="btn btn--primary">
            <IconPlus width={18} height={18} /> New story
          </Link>
        </div>

        <div className="stats mb-3">
          <div className="stat">
            <b>{posts.length}</b>
            <span>Total stories</span>
          </div>
          <div className="stat">
            <b>{published}</b>
            <span>Published</span>
          </div>
          <div className="stat">
            <b>{posts.length - published}</b>
            <span>Drafts</span>
          </div>
          <div className="stat">
            <b>{new Set(posts.map((p) => p.category)).size}</b>
            <span>Categories</span>
          </div>
        </div>

        <DashboardList posts={posts} />
      </div>
    </div>
  );
}
