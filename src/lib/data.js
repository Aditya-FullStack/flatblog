import { createClient, supabaseConfigured } from '@/lib/supabase/server';
import { DEMO_POSTS } from '@/lib/demo';

const POST_SELECT =
  'id, slug, title, excerpt, content, cover_url, category, published, created_at, updated_at, author_id, author:profiles(id, full_name, avatar_url, bio)';

/** All published posts, newest first. Falls back to demo content. */
export async function getPosts({ limit = 24 } = {}) {
  if (!supabaseConfigured) {
    return DEMO_POSTS.filter((p) => p.published).slice(0, limit);
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('getPosts:', error.message);
    return [];
  }
  return data ?? [];
}

/** Posts belonging to a specific author (drafts included). */
export async function getPostsByAuthor(authorId) {
  if (!supabaseConfigured) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('author_id', authorId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getPostsByAuthor:', error.message);
    return [];
  }
  return data ?? [];
}

/** A single published post by slug, or null. */
export async function getPostBySlug(slug) {
  if (!supabaseConfigured) {
    return DEMO_POSTS.find((p) => p.slug === slug) ?? null;
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('slug', slug)
    .maybeSingle();
  if (error) {
    console.error('getPostBySlug:', error.message);
    return null;
  }
  return data;
}

/** The newest post, used as the featured card on the home page. */
export async function getFeaturedPost() {
  const posts = await getPosts({ limit: 1 });
  return posts[0] ?? null;
}

/** Site stats for the home page strip. */
export async function getStats() {
  const posts = await getPosts({ limit: 500 });
  const authors = new Set(posts.map((p) => p.author?.id).filter(Boolean));
  const categories = new Set(posts.map((p) => p.category).filter(Boolean));
  return {
    posts: posts.length,
    authors: authors.size || 1,
    categories: categories.size
  };
}

/** A public profile by id. */
export async function getProfile(userId) {
  if (!supabaseConfigured) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, bio')
    .eq('id', userId)
    .maybeSingle();
  return data ?? null;
}
