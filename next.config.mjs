/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === '1';
const basePath = process.env.PAGES_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,

  // Used only for the GitHub Pages preview build (served from /<repo>/).
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  images: isStaticExport
    ? { unoptimized: true }
    : {
        remotePatterns: [
          { protocol: 'https', hostname: '**.supabase.co' },
          { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
          { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com' },
          { protocol: 'https', hostname: 'images.unsplash.com' },
          { protocol: 'https', hostname: 'picsum.photos' }
        ]
      },

  // `npm run build:preview` produces a fully static site in ./out
  ...(isStaticExport ? { output: 'export', trailingSlash: true } : {})
};

export default nextConfig;
