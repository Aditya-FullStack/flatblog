import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// A static export has no server, so auth is disabled there by design.
const STATIC_EXPORT = process.env.STATIC_EXPORT === '1';

export const supabaseConfigured =
  !STATIC_EXPORT &&
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

/**
 * Server-side Supabase client bound to the request cookies.
 * Returns null in demo mode so callers can fall back to demo data.
 */
export function createClient() {
  if (!supabaseConfigured) return null;
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore; middleware
            // refreshes the session cookie instead.
          }
        }
      }
    }
  );
}

/** Current authenticated user (server-side), or null. */
export async function getUser() {
  const supabase = createClient();
  if (!supabase) return null;
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user ?? null;
}
