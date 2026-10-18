import Link from 'next/link';
import Avatar from '@/components/Avatar';
import { categoryTone } from '@/lib/demo';
import { formatDate, readingTime } from '@/lib/markdown';

const TONE_VAR = {
  primary: '--primary',
  violet: '--violet',
  secondary: '--secondary',
  amber: '--amber',
  accent: '--accent'
};

export function Cover({ post, className = 'postcard__cover' }) {
  if (post.cover_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={post.cover_url} alt={post.title} className={className} />;
  }
  const tone = TONE_VAR[categoryTone(post.category)] || '--primary';
  return (
    <div
      className={`${className} postcard__cover--fallback`}
      style={{ background: `var(${tone})` }}
      aria-hidden
    >
      <span>{post.category || 'Story'}</span>
    </div>
  );
}

export default function PostCard({ post }) {
  return (
    <article className="card card--hover postcard">
      <Link href={`/post/${post.slug}`} aria-label={post.title}>
        <Cover post={post} />
      </Link>
      <div className="postcard__body">
        <div className="row" style={{ gap: 8 }}>
          {post.category && (
            <span className={`chip chip--${categoryTone(post.category)}`}>{post.category}</span>
          )}
          <span className="chip">
            {readingTime(post.content)} min read
          </span>
        </div>
        <h3 className="postcard__title">
          <Link href={`/post/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.excerpt && <p className="postcard__excerpt">{post.excerpt}</p>}
        <div className="postcard__meta">
          <Avatar name={post.author?.full_name} src={post.author?.avatar_url} size="sm" />
          <div className="who">
            <b>{post.author?.full_name || 'Anonymous'}</b>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
