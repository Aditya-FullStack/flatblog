import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getUser } from '@/lib/supabase/server';

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap'
});

const displayFont = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap'
});

export const metadata = {
  title: {
    default: 'FlatBlog — stories worth a coffee',
    template: '%s · FlatBlog'
  },
  description:
    'A clean, fast blog for engineering, design and product writing. Built with Next.js, Supabase auth and a Flat 2.0 / Material design system.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
};

export const viewport = {
  themeColor: '#2f6bff',
  width: 'device-width',
  initialScale: 1
};

export default async function RootLayout({ children }) {
  const user = await getUser();

  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <Navbar user={user} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
