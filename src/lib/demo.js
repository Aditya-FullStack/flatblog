/**
 * Demo content used when Supabase env vars are absent, so the site is
 * fully browsable before you connect a backend.
 */

export const CATEGORIES = {
  Engineering: 'primary',
  Design: 'violet',
  Product: 'secondary',
  Tutorial: 'amber',
  Culture: 'accent'
};

export function categoryTone(category) {
  return CATEGORIES[category] || 'primary';
}

const AUTHOR = {
  id: 'demo-author',
  full_name: 'Aarav Mehta',
  avatar_url: null,
  bio: 'Writer of things, builder of sites, drinker of too much filter coffee.'
};

export const DEMO_POSTS = [
  {
    id: 'demo-1',
    slug: 'flat-design-is-back-and-it-brought-rules',
    title: 'Flat Design Is Back, and This Time It Brought Rules',
    excerpt:
      'Flat 2.0 trades the shapeless minimalism of 2013 for vivid colour, real hierarchy and a system you can actually scale.',
    category: 'Design',
    published: true,
    created_at: '2026-10-14T09:20:00.000Z',
    cover_url: null,
    author: AUTHOR,
    content: `Flat design had a rough decade. What started as a rebellion against glossy gradients turned into a sea of grey-on-grey dashboards that all looked the same.

## What changed

**Flat 2.0** keeps the honesty of flat colour — no bevels, no fake chrome — but adds back the things minimalism threw away:

- A real type scale, so headings actually read as headings
- Deliberate colour roles, not decoration
- Elevation used sparingly, to signal interaction

> Flatness is a style. Hierarchy is a discipline. You need both.

## The system, not the trend

The reason a design system works is that it makes the right choice the *easy* choice. When every button pulls from the same token, a new screen looks native on day one.

\`\`\`
--primary: #2f6bff;
--radius: 16px;
--e1: 0 1px 2px rgba(20,23,31,.06);
\`\`\`

Get the tokens right and the pages almost design themselves.`
  },
  {
    id: 'demo-2',
    slug: 'supabase-auth-in-fifteen-minutes',
    title: 'Supabase Auth in Fifteen Minutes',
    excerpt:
      'Google and Facebook sign-in, session refresh, row-level security — the whole thing, without writing an auth server.',
    category: 'Tutorial',
    published: true,
    created_at: '2026-10-11T14:05:00.000Z',
    cover_url: null,
    author: AUTHOR,
    content: `Auth is the part everyone postpones. Supabase makes it the part you finish before lunch.

## The shape of it

1. Create a project and grab your URL + anon key
2. Enable the Google and Facebook providers
3. Call \`signInWithOAuth\` and let Supabase handle the dance

\`\`\`js
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: location.origin + '/auth/callback' }
});
\`\`\`

## Don't forget row-level security

An anon key is public. Your database rules — not your key — are what keep data safe. Write policies that say *exactly* who may read and write each row.

> If your table has RLS off, assume it is public.

That is the whole trick.`
  },
  {
    id: 'demo-3',
    slug: 'the-quiet-cost-of-a-clever-abstraction',
    title: 'The Quiet Cost of a Clever Abstraction',
    excerpt:
      'Every layer you add to save typing is a layer someone has to debug at 2am. Here is how to tell which ones pay for themselves.',
    category: 'Engineering',
    published: true,
    created_at: '2026-10-08T07:40:00.000Z',
    cover_url: null,
    author: AUTHOR,
    content: `There is a specific joy in a well-placed abstraction. There is a specific despair in debugging one you did not write.

## A simple test

Before you add a layer, ask:

- Does it remove *conceptual* work, or just keystrokes?
- Will a new teammate understand it in five minutes?
- If it breaks, is the failure obvious?

Two yeses out of three is usually enough. One is a warning.

## Boring is a feature

The best infrastructure is the kind nobody talks about, because it never surprises anyone.`
  },
  {
    id: 'demo-4',
    slug: 'shipping-is-a-design-skill',
    title: 'Shipping Is a Design Skill',
    excerpt:
      'The difference between a beautiful mockup and a beautiful product is a thousand small decisions nobody asked you to make.',
    category: 'Product',
    published: true,
    created_at: '2026-10-05T11:15:00.000Z',
    cover_url: null,
    author: AUTHOR,
    content: `A mockup is a promise. A shipped product is the receipt.

## The last five percent

The last five percent of the work is where the product stops looking designed and starts feeling designed:

- The empty state that teaches instead of scolds
- The error message that says what to do next
- The loading state that respects the wait

## Craft is cumulative

None of these are big. All of them are the product.`
  },
  {
    id: 'demo-5',
    slug: 'a-case-for-the-personal-blog-in-2026',
    title: 'A Case for the Personal Blog in 2026',
    excerpt:
      'Feeds optimise for reach. A blog optimises for thinking. They are not the same thing, and you probably need both.',
    category: 'Culture',
    published: true,
    created_at: '2026-10-02T16:30:00.000Z',
    cover_url: null,
    author: AUTHOR,
    content: `Social feeds are rented land. You plant, someone else harvests the attention.

## Own your words

A blog is slower. That is the point. Slowness is what makes it *yours* — no algorithm deciding who sees it, no character limit trimming the thought.

## Start badly

The first ten posts will be bad. Publish them anyway. The eleventh is where it gets interesting.`
  },
  {
    id: 'demo-6',
    slug: 'css-tokens-that-survive-a-redesign',
    title: 'CSS Tokens That Survive a Redesign',
    excerpt:
      'Name your tokens for the job they do, not the colour they are, and a rebrand becomes a one-file change.',
    category: 'Engineering',
    published: true,
    created_at: '2026-09-28T08:00:00.000Z',
    cover_url: null,
    author: AUTHOR,
    content: `\`--blue-500\` is a lie waiting to happen. The moment you make it purple, the name is wrong forever.

## Name the role

\`\`\`css
:root {
  --primary: #2f6bff;
  --on-primary: #fff;
  --surface: #ffffff;
}
\`\`\`

Now dark mode is a media query that reassigns the same names. A rebrand is one block. Nothing else moves.`
  },
  {
    id: 'demo-7',
    slug: 'how-i-write-without-a-muse',
    title: 'How I Write Without a Muse',
    excerpt:
      'Waiting for inspiration is a strategy that works exactly never. Here is the unglamorous alternative.',
    category: 'Culture',
    published: true,
    created_at: '2026-09-24T13:45:00.000Z',
    cover_url: null,
    author: AUTHOR,
    content: `The muse is a rumour started by people who write every day.

## The routine

- Same time, same chair
- Outline before prose
- Ship at "good", not "perfect"

## Edit later

You cannot edit a blank page. Write the bad version, then make it good. In that order, always.`
  },
  {
    id: 'demo-8',
    slug: 'elevation-without-the-shadow-crutch',
    title: 'Elevation Without the Shadow Crutch',
    excerpt:
      'Shadows are one way to show depth. Borders, colour and spacing are quieter ones that age better.',
    category: 'Design',
    published: true,
    created_at: '2026-09-20T10:10:00.000Z',
    cover_url: null,
    author: AUTHOR,
    content: `Every design language eventually leans too hard on drop shadows. They are the easiest depth cue and the first one to look dated.

## Cheaper cues

- A 1px border in a slightly darker surface tone
- A background shift from \`--bg\` to \`--surface\`
- Generous spacing around the "lifted" element

Use a shadow to say *this floats above everything*. Use everything else to say *this is a card*.`
  }
];
