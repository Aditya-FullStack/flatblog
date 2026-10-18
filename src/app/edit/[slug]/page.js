import { redirect, notFound } from 'next/navigation';
import PostEditor from '@/components/PostEditor';
import { getPostBySlug } from '@/lib/data';
import { DEMO_POSTS } from '@/lib/demo';
import { getUser, supabaseConfigured } from '@/lib/supabase/server';

export const metadata = { title: 'Edit story' };

const isStatic = process.env.STATIC_EXPORT === '1';
export const dynamic = isStatic ? 'force-static' : 'force-dynamic';

export const generateStaticParams = isStatic
  ? () => DEMO_POSTS.map((p) => ({ slug: p.slug }))
  : undefined;

export default async function EditPage({ params }) {
  const user = await getUser();
  if (supabaseConfigured && !user) redirect(`/login?next=/edit/${params.slug}`);

  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
  if (user && post.author_id && post.author_id !== user.id) redirect('/dashboard');

  return (
    <div className="page">
      <PostEditor mode="edit" post={post} />
    </div>
  );
}
