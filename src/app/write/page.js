import { redirect } from 'next/navigation';
import PostEditor from '@/components/PostEditor';
import { getUser, supabaseConfigured } from '@/lib/supabase/server';

export const metadata = { title: 'Write a story' };

export default async function WritePage() {
  const user = await getUser();
  // Demo mode has no auth — let people preview the editor.
  if (supabaseConfigured && !user) redirect('/login?next=/write');

  return (
    <div className="page">
      <PostEditor mode="create" />
    </div>
  );
}
