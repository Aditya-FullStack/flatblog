import Link from 'next/link';
import PostCard from '@/components/PostCard';
import WriteFab from '@/components/WriteFab';
import { Cover } from '@/components/PostCard';
import Avatar from '@/components/Avatar';
import { IconArrowRight, IconSparkles, IconBook } from '@/components/Icons';
import { getPosts, getStats } from '@/lib/data';
import { categoryTone } from '@/lib/demo';
import { formatDate, readingTime } from '@/lib/markdown';

const isStatic = process.env.STATIC_EXPORT === '1';
export const dynamic = isStatic ? 'force-static' : 'force-dynamic';

export default async function HomePage() {
  const [posts, stats] = await Promise.all([getPosts({ limit: 24 }), getStats()]);

  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <section className="hero">
          <div className="hero__grid">
            <div>
              <span className="chip chip--primary hero__badge">
                <IconSparkles width={15} height={15} /> Flat 2.0 · Material
              </span>
              <h1>
                Stories worth
                <br />
                a slow coffee.
              </h1>
              <p className="lead">
                Engineering, design and product writing — served flat, fast and
                free of clutter. Sign in with Google or Facebook to publish your
                own.
              </p>
              <div className="row wrap mt-3" style={{ gap: 12 }}>
                <Link href="/write" className="btn btn--primary btn--lg">
                  Start writing <IconArrowRight width={18} height={18} />
                </Link>
                <Link href="#latest" className="btn btn--outline btn--lg">
                  <IconBook width={18} height={18} /> Browse stories
                </Link>
              </div>
            </div>

            <div className="hero__art" aria-hidden>
              <div className="hero__tiles">
                <div className="tile tile--1">
                  <b>{stats.posts}</b>
                  <span>Stories published</span>
                </div>
                <div className="tile tile--2">
                  <b>{stats.categories}</b>
                  <span>Topics covered</span>
                </div>
                <div className="tile tile--3">
                  <b>{stats.authors}</b>
                  <span>Writers</span>
                </div>
                <div className="tile tile--4">
                  <b>0</b>
                  <span>Pop-ups, ever</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured */}
        {featured && (
          <section className="mt-4">
            <div className="section-head">
              <div>
                <div className="eyebrow">Editor's pick</div>
                <h2>This week's headline</h2>
              </div>
            </div>
            <article className="card card--hover feature">
              <Link href={`/post/${featured.slug}`} aria-label={featured.title}>
                <Cover post={featured} className="feature__cover" />
              </Link>
              <div className="feature__body">
                <div className="row" style={{ gap: 8 }}>
                  {featured.category && (
                    <span className={`chip chip--${categoryTone(featured.category)}`}>
                      {featured.category}
                    </span>
                  )}
                  <span className="chip">{readingTime(featured.content)} min read</span>
                </div>
                <h2>
                  <Link href={`/post/${featured.slug}`}>{featured.title}</Link>
                </h2>
                <p className="muted mb-0">{featured.excerpt}</p>
                <div className="row mt-2" style={{ gap: 12 }}>
                  <Avatar
                    name={featured.author?.full_name}
                    src={featured.author?.avatar_url}
                  />
                  <div className="who">
                    <div className="strong">{featured.author?.full_name || 'Anonymous'}</div>
                    <div className="faint small">{formatDate(featured.created_at)}</div>
                  </div>
                </div>
                <Link href={`/post/${featured.slug}`} className="btn btn--primary mt-2" style={{ alignSelf: 'flex-start' }}>
                  Read the story <IconArrowRight width={18} height={18} />
                </Link>
              </div>
            </article>
          </section>
        )}

        {/* Latest grid */}
        <section id="latest" className="mt-4">
          <div className="section-head">
            <div>
              <div className="eyebrow">Latest</div>
              <h2>Fresh off the press</h2>
            </div>
            <Link href="/write" className="btn btn--outline btn--sm">
              Write a story
            </Link>
          </div>

          {rest.length === 0 ? (
            <div className="empty card card__pad">
              <div className="empty__icon">
                <IconBook />
              </div>
              <h3>No stories yet</h3>
              <p>Once posts are published they'll appear here.</p>
            </div>
          ) : (
            <div className="grid">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>

      <WriteFab />
    </div>
  );
}
