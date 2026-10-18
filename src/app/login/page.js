import { redirect } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { getUser } from '@/lib/supabase/server';

export const metadata = { title: 'Sign in' };

export default async function LoginPage() {
  const user = await getUser();
  if (user) redirect('/dashboard');

  return (
    <div className="authwrap">
      <LoginForm />
    </div>
  );
}
