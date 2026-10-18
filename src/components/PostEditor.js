'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, supabaseConfigured } from '@/lib/supabase/client';
import { renderMarkdown, slugify } from '@/lib/markdown';
import { CATEGORIES } from '@/lib/demo';

export default function PostEditor({ mode = 'create', post = null }) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  const [title, setTitle] = useState(post?.title || '');
  const [category, setCategory] = useState(post?.category || 'Engineering');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [coverUrl, setCoverUrl] = useState(post?.cover_url || '');
  const [published, setPublished] = useState(post?.published ?? true);

  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const previewHtml = useMemo(() => renderMarkdown(content), [content]);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError('Give your story a title.');
    if (!content.trim()) return setError('Your story needs some words.');

    const supabase = createClient();
    if (!supabase) {
      setError('Demo mode — connect Supabase to publish stories.');
      return;
    }

    setSaving(true);
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login?next=/write');
      return;
    }

    const payload = {
      title: title.trim(),
      excerpt: excerpt.trim() || content.trim().slice(0, 160),
      content,
      category,
      cover_url: coverUrl.trim() || null,
      published
    };

    let error = null;
    let slug = post?.slug;

    if (isEdit) {
      const res = await supabase.from('posts').update(payload).eq('id', post.id);
      error = res.error;
      slug = post.slug;
    } else {
      slug = slugify(title);
      let res = await supabase
        .from('posts')
        .insert({ ...payload, slug, author_id: user.id })
        .select('slug')
        .single();
      // Slug collision → retry once with a short suffix
      if (res.error && res.error.code === '23505') {
        slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`;
        res = await supabase
          .from('posts')
          .insert({ ...payload, slug, author_id: user.id })
          .select('slug')
          .single();
      }
      error = res.error;
      slug = res.data?.slug || slug;
    }

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push(`/post/${slug}`);
    router.refresh();
  }

  return (
    <div className="container">
      <div className="formcard">
        <div className="row-between mb-3">
          <div>
            <div className="eyebrow" style={{ fontSize: '.78rem', fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--primary)' }}>
              {isEdit ? 'Edit story' : 'New story'}
            </div>
            <h1 style={{ fontSize: '1.9rem', marginTop: 6 }}>
              {isEdit ? 'Polish it up' : 'Write something good'}
            </h1>
          </div>
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => setPreview((v) => !v)}
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>

        {!supabaseConfigured && (
          <div className="notice mb-3">
            <span>
              <strong>Demo mode.</strong> You can draft here, but publishing needs
              Supabase keys configured.
            </span>
          </div>
        )}

        <form className="card card__pad" onSubmit={onSubmit}>
          {preview ? (
            <div className="prose" style={{ minHeight: 320 }}>
              <h1 style={{ fontSize: '1.9rem', marginBottom: 16 }}>{title || 'Untitled'}</h1>
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          ) : (
            <>
              <div className="field">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="A headline worth clicking"
                  maxLength={140}
                />
              </div>

              <div className="row" style={{ gap: 16, alignItems: 'flex-start' }}>
                <div className="field" style={{ flex: 1 }}>
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    className="select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {Object.keys(CATEGORIES).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field" style={{ flex: 2 }}>
                  <label htmlFor="cover">Cover image URL (optional)</label>
                  <input
                    id="cover"
                    className="input"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://…"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="excerpt">Excerpt</label>
                <input
                  id="excerpt"
                  className="input"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="One line that makes people want to read on"
                  maxLength={220}
                />
                <span className="hint">Leave blank to auto-generate from your text.</span>
              </div>

              <div className="field">
                <label htmlFor="content">Story</label>
                <textarea
                  id="content"
                  className="textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={'## A section heading\n\nWrite in Markdown — **bold**, *italic*, `code`, lists, > quotes.'}
                />
                <span className="hint">Markdown supported: headings, lists, quotes, code, links.</span>
              </div>

              <label className="row" style={{ gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                <span className="small">Publish immediately (uncheck to save as draft)</span>
              </label>
            </>
          )}

          {error && (
            <div className="notice notice--error mt-3">
              <span>{error}</span>
            </div>
          )}

          <div className="row mt-3" style={{ gap: 12 }}>
            <button type="submit" className="btn btn--primary btn--lg" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish story'}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => router.back()}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
