'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/markdown';
import { IconPen, IconTrash } from '@/components/Icons';

export default function DashboardList({ posts = [] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(null);

  async function remove(id) {
    if (!confirm('Delete this story? This cannot be undone.')) return;
    setBusy(id);
    const supabase = createClient();
    const { error } = await supabase.from('posts').delete().eq('id', id);
    setBusy(null);
    if (!error) router.refresh();
    else alert(error.message);
  }

  if (posts.length === 0) {
    return (
      <div className="empty card card__pad">
        <div className="empty__icon">
          <IconPen />
        </div>
        <h3>Nothing published yet</h3>
        <p className="muted">Your drafts and published stories will show up here.</p>
        <Link href="/write" className="btn btn--primary mt-2">
          Write your first story
        </Link>
      </div>
    );
  }

  return (
    <div className="stack">
      {posts.map((post) => (
        <div key={post.id} className="card card__body row-between wrap" style={{ gap: 16 }}>
          <div style={{ minWidth: 260, flex: 1 }}>
            <div className="row" style={{ gap: 8, marginBottom: 6 }}>
              <span className={`chip ${post.published ? 'chip--secondary' : 'chip--amber'}`}>
                {post.published ? 'Published' : 'Draft'}
              </span>
              {post.category && <span className="chip">{post.category}</span>}
            </div>
            <Link href={`/post/${post.slug}`} className="strong" style={{ fontSize: '1.08rem' }}>
              {post.title}
            </Link>
            <div className="faint small mt-1">{formatDate(post.created_at)}</div>
          </div>

          <div className="row" style={{ gap: 8 }}>
            <Link href={`/edit/${post.slug}`} className="btn btn--outline btn--sm">
              <IconPen width={16} height={16} /> Edit
            </Link>
            <button
              className="btn btn--danger btn--sm"
              onClick={() => remove(post.id)}
              disabled={busy === post.id}
            >
              <IconTrash width={16} height={16} /> {busy === post.id ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
