'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * True when both Supabase env vars are present. When false the whole app
 * runs in "demo mode" — browse-only content, login disabled with a notice.
 */
export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

let browserClient = null;

/** Returns a singleton browser Supabase client, or null in demo mode. */
export function createClient() {
  if (!supabaseConfigured) return null;
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return browserClient;
}
