import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/data';
import { renderMarkdown, formatDate, readingTime } from '@/lib/markdown';
import { categoryTone, DEMO_POSTS } from '@/lib/demo';
import Avatar from '@/components/Avatar';
import WriteFab from '@/components/WriteFab';
import { Cover } from '@/components/PostCard';
import { IconArrowRight, IconClock } from '@/components/Icons';
import { getUser } from '@/lib/supabase/server';

const isStatic = process.env.STATIC_EXPORT === '1';
export const dynamic = isStatic ? 'force-static' : 'force-dynamic';

// Prerender every demo story for the static (GitHub Pages) preview build.
export const generateStaticParams = isStatic
  ? () => DEMO_POSTS.map((p) => ({ slug: p.slug }))
  : undefined;

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Story not found' };
  return { title: post.title, description: post.excerpt || undefined };
}

export default async function PostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const user = await getUser();
  const isOwner = Boolean(user && post.author_id && post.author_id === user.id);
  const html = renderMarkdown(post.content);

  return (
    <div className="page">
      <div className="container">
        <article className="article">
          <Link href="/" className="btn btn--ghost btn--sm mb-2">
            ← All stories
          </Link>

          <header className="article__head">
            <div className="row wrap" style={{ gap: 8 }}>
              {post.category && (
                <span className={`chip chip--${categoryTone(post.category)}`}>
                  {post.category}
                </span>
              )}
              <span className="chip">
                <IconClock width={14} height={14} /> {readingTime(post.content)} min read
              </span>
              {post.published === false && <span className="chip chip--accent">Draft</span>}
            </div>

            <h1 className="article__title mt-2">{post.title}</h1>
            {post.excerpt && <p className="lead muted" style={{ fontSize: '1.15rem' }}>{post.excerpt}</p>}

            <div className="article__byline">
              <Avatar name={post.author?.full_name} src={post.author?.avatar_url} />
              <div className="who">
                <div className="strong">{post.author?.full_name || 'Anonymous'}</div>
                <div className="faint small">{formatDate(post.created_at)}</div>
              </div>
              <div className="spacer" />
              {isOwner && (
                <Link href={`/edit/${post.slug}`} className="btn btn--outline btn--sm">
                  Edit story
                </Link>
              )}
            </div>
          </header>

          <Cover post={post} className="article__cover" />

          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

          <div className="card card__pad mt-4">
            <div className="row" style={{ gap: 14 }}>
              <Avatar name={post.author?.full_name} src={post.author?.avatar_url} size="lg" />
              <div>
                <div className="strong" style={{ fontSize: '1.05rem' }}>
                  {post.author?.full_name || 'Anonymous'}
                </div>
                <div className="muted small">
                  {post.author?.bio || 'Writer at FlatBlog.'}
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4" style={{ justifyContent: 'center' }}>
            <Link href="/" className="btn btn--primary">
              More stories <IconArrowRight width={18} height={18} />
            </Link>
          </div>
        </article>
      </div>

      <WriteFab />
    </div>
  );
}
