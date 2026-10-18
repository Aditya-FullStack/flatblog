# FlatBlog

A blogger-style publishing site: browse stories, sign in with **Google** or
**Facebook** via **Supabase**, and write / edit / publish your own posts.

Built with **Next.js 14 (App Router)**, **Supabase** for auth + database, and a
hand-rolled **Flat 2.0 / Material** design system — vivid flat colour, no
gradients, Material structure (app bar, cards, chips, FAB, elevation).

---

## Features

- **Login with Google & Facebook** through Supabase OAuth (no passwords stored).
- **Blogger-style content**: home feed with a featured story, post grid, and
  full article pages with Markdown rendering.
- **Write / edit / publish** your own stories, with drafts, a live Markdown
  preview and an automatic slug.
- **Dashboard** with your stories, status chips and delete.
- **Row-Level Security** baked into the schema — published posts are public,
  drafts and edits are private to their author.
- **Demo mode**: with no keys configured the site still runs on bundled sample
  content so you can see the design immediately.
- **Dark mode** via `prefers-color-scheme`, responsive down to mobile.

---

## Quick start (demo mode — no backend needed)

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. You'll see the full site with sample posts. Sign-in
is disabled and shows a notice until you connect Supabase (next section).

---

## Connecting Supabase (the 10-minute walkthrough)

### 1. Create the project

1. Go to <https://supabase.com> and sign in.
2. **New project** → pick an organisation, give it a name (e.g. `flatblog`),
   set a database password, choose the region closest to you (e.g. Mumbai /
   `ap-south-1`), and click **Create new project**. Wait ~2 minutes.

### 2. Create the tables

1. In the left sidebar open **SQL Editor** → **New query**.
2. Paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql).
3. Click **Run**. You should see *Success. No rows returned*.

This creates the `profiles` and `posts` tables, the trigger that auto-creates a
profile on sign-up, and all the row-level-security policies.

### 3. Grab your API keys

1. Go to **Project Settings** (gear icon) → **API**.
2. Copy **Project URL** and the **anon / public** key.

```bash
cp .env.example .env.local
```

Paste them in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> The anon key is safe to expose in the browser — your data is protected by the
> RLS policies, not by hiding the key. Never put the **service_role** key in a
> `NEXT_PUBLIC_` variable.

### 4. Enable Google sign-in

**A. In Google Cloud Console** (<https://console.cloud.google.com>):

1. Create a project (or pick one) → **APIs & Services** → **OAuth consent
   screen**. Choose *External*, fill in an app name and your email, save.
2. **APIs & Services** → **Credentials** → **Create credentials** →
   **OAuth client ID** → Application type **Web application**.
3. Under **Authorised redirect URIs** add your Supabase callback (find the exact
   URL in the next step — it looks like
   `https://<project-ref>.supabase.co/auth/v1/callback`). Click **Create**.
4. Copy the **Client ID** and **Client secret**.

**B. In Supabase**:

1. **Authentication** → **Providers** → **Google** → toggle **Enable**.
2. Paste the Client ID and Client secret → **Save**.
3. Copy the **Callback URL** shown on that page and make sure it matches what you
   added in Google Cloud (step A3).

### 5. Enable Facebook sign-in

**A. In Meta for Developers** (<https://developers.facebook.com>):

1. **My Apps** → **Create App** → type **Consumer** → give it a name.
2. Add the **Facebook Login** product → **Settings**.
3. In **Valid OAuth Redirect URIs** add the Supabase callback URL
   (`https://<project-ref>.supabase.co/auth/v1/callback`). Save.
4. From **Settings → Basic**, copy the **App ID** and **App Secret**.

**B. In Supabase**:

1. **Authentication** → **Providers** → **Facebook** → toggle **Enable**.
2. Paste the App ID and App Secret → **Save**.

> Facebook apps start in *Development* mode: only accounts with an app role can
> sign in until you switch the app to **Live** in the Meta dashboard.

### 6. Allow your site's redirect URL

**Authentication** → **URL Configuration**:

- **Site URL**: `http://localhost:3000` for local dev (your deployed URL in
  production, e.g. `https://your-site.netlify.app`).
- **Redirect URLs** — add both:
  - `http://localhost:3000/auth/callback`
  - `https://your-site.netlify.app/auth/callback`

### 7. Run it

```bash
npm run dev
```

Click **Sign in → Continue with Google**. You'll be redirected, sign in, and
land on your dashboard. Write a story — it appears on the home page.

---

## Deploying to Netlify

The repo ships a `netlify.toml` that uses Netlify's official Next.js runtime.

1. Push this folder to a GitHub repository.
2. In Netlify: **Add new site → Import an existing project** → pick the repo.
   Build command `npm run build` and publish directory `.next` are read from
   `netlify.toml`.
3. **Site configuration → Environment variables** → add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = your Netlify URL (e.g. `https://your-site.netlify.app`)
4. Deploy. Then go back to Supabase → **Authentication → URL Configuration** and
   add `https://your-site.netlify.app/auth/callback` to the redirect URLs.

---

## Project structure

```
src/
  app/
    layout.js              App shell (fonts, navbar, footer)
    page.js                Home: hero, featured story, post grid
    globals.css            The Flat 2.0 / Material design system
    login/page.js          Sign-in page
    auth/callback/route.js OAuth callback (exchanges code for a session)
    post/[slug]/page.js    Article page (Markdown rendered)
    write/page.js          New story editor
    edit/[slug]/page.js    Edit an existing story
    dashboard/page.js      Your stories
  components/              Navbar, PostCard, PostEditor, LoginForm, …
  lib/
    supabase/              Browser / server / middleware clients
    data.js                Data access (Supabase, with demo fallback)
    markdown.js            Tiny safe Markdown renderer + helpers
    demo.js                Sample content for demo mode
  middleware.js            Refreshes the Supabase session on every request
supabase/schema.sql        Tables, triggers and RLS policies
```

---

## Design system

Everything visual comes from tokens in `src/app/globals.css` — colour roles,
radii, elevation and type. Change `--primary` and the whole site re-themes.

| Token group | Examples |
| --- | --- |
| Colour roles | `--primary`, `--accent`, `--surface`, `--on-surface` |
| Radii | `--r-sm` … `--r-full` |
| Elevation | `--e1`, `--e2`, `--e3`, `--e-fab` |
| Type | Poppins (display) + Inter (body) |

---

## Notes & limitations

- Drafts are only visible to their author (enforced by RLS, not just the UI).
- Cover images are optional; without one, a post gets a flat colour block in its
  category's tone — on brand and dependency-free.
- The bundled Markdown renderer is intentionally small (headings, lists, quotes,
  code, links, bold/italic). Swap in `marked` + `DOMPurify` if you need more.
